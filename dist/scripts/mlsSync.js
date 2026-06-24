import { getSyncMLSGridPlan } from '../lib/mls/syncMLSGrid.js';
const MLS_SYNC_DEFAULT_MAX_RUNTIME_MS = 10 * 60 * 1000;
const MLS_SYNC_DEFAULT_RATE_DELAY_MS = 1100;
const MLS_SYNC_DEFAULT_PAGE_SIZE = 50;
const MLS_SYNC_DEFAULT_MAX_PAGES = 1;
const MLS_SYNC_MAX_RUNTIME_MS = 60 * 60 * 1000;
const MLS_SYNC_MAX_RATE_DELAY_MS = 60000;
const MLS_SYNC_MAX_PAGE_SIZE = 100;
const MLS_SYNC_MAX_PAGES = 100;
const MLS_SYNC_MAX_START_PAGE = 1000000;
const MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS = 30000;
const MLS_SYNC_MAX_PAGE_TIMEOUT_MS = 120000;
const HELP_TEXT = `
MLS Grid sync runner

Usage:
  node dist/scripts/mlsSync.js [options]

Options:
  --dry-run                  Print the normalized sync plan without contacting MLS Grid. Default behavior.
  --preview                  Alias for --dry-run.
  --execute                  Explicitly execute the sync.
  --live                     Alias for --execute.
  --json                     Print structured JSON output.
  --max-pages=<number>       Stop after this many MLS pages.
  --page-size=<number>       Listings per MLS page. Max 100.
  --start-page=<number>      Start from a specific MLS page.
  --max-runtime-ms=<number>  Stop after this many milliseconds.
  --rate-delay-ms=<number>   Delay between MLS pages in milliseconds.
  --page-timeout-ms=<number> Timeout for each MLS Grid page request.
  --media                    Fetch listings with expanded Media.
  --no-media                 Fetch listings without expanded Media.
  --help                     Show this help text.

Terminal 5 recommended first test:
  npm run run:mls-sync:dry

Terminal 5 scheduler-safe dry-run:
  npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000

Terminal 5 bounded live run:
  npm run run:mls-sync:live
`;
function parseNumber(value, name, min, max) {
    if (!value)
        throw new Error(`Missing value for ${name}.`);
    const parsed = Number(value);
    if (!Number.isFinite(parsed))
        throw new Error(`Invalid number for ${name}: ${value}`);
    return Math.min(Math.max(Math.floor(parsed), min), max);
}
function readFlagValue(arg) {
    const [, value] = arg.split('=');
    return value;
}
function parseCliOptions(argv) {
    const options = {
        dryRun: true,
        execute: false,
        json: false,
    };
    for (const arg of argv) {
        if (arg === '--help' || arg === '-h') {
            console.log(HELP_TEXT.trim());
            process.exit(0);
        }
        if (arg === '--dry-run' || arg === '--preview') {
            options.dryRun = true;
            options.execute = false;
            continue;
        }
        if (arg === '--execute' || arg === '--live') {
            options.dryRun = false;
            options.execute = true;
            continue;
        }
        if (arg === '--json') {
            options.json = true;
            continue;
        }
        if (arg === '--media') {
            options.includeMedia = true;
            continue;
        }
        if (arg === '--no-media') {
            options.includeMedia = false;
            continue;
        }
        if (arg.startsWith('--max-pages=')) {
            options.maxPages = parseNumber(readFlagValue(arg), '--max-pages', 1, MLS_SYNC_MAX_PAGES);
            continue;
        }
        if (arg.startsWith('--page-size=')) {
            options.pageSize = parseNumber(readFlagValue(arg), '--page-size', 1, MLS_SYNC_MAX_PAGE_SIZE);
            continue;
        }
        if (arg.startsWith('--start-page=')) {
            options.startPage = parseNumber(readFlagValue(arg), '--start-page', 0, MLS_SYNC_MAX_START_PAGE);
            continue;
        }
        if (arg.startsWith('--max-runtime-ms=')) {
            options.maxRuntimeMs = parseNumber(readFlagValue(arg), '--max-runtime-ms', 1000, MLS_SYNC_MAX_RUNTIME_MS);
            continue;
        }
        if (arg.startsWith('--rate-delay-ms=')) {
            options.rateDelayMs = parseNumber(readFlagValue(arg), '--rate-delay-ms', 0, MLS_SYNC_MAX_RATE_DELAY_MS);
            continue;
        }
        if (arg.startsWith('--page-timeout-ms=')) {
            options.pageTimeoutMs = parseNumber(readFlagValue(arg), '--page-timeout-ms', 1000, MLS_SYNC_MAX_PAGE_TIMEOUT_MS);
            continue;
        }
        throw new Error(`Unknown option: ${arg}`);
    }
    return options;
}
function getErrorCode(error) {
    if (!error || typeof error !== 'object')
        return '';
    const maybeCode = error.code;
    return typeof maybeCode === 'string' ? maybeCode : '';
}
function getAggregateErrorMessage(error) {
    if (!error || typeof error !== 'object' || !Array.isArray(error.errors))
        return '';
    const errors = error.errors;
    const summaries = errors
        .map((item) => {
        if (!item || typeof item !== 'object')
            return String(item || '');
        const code = getErrorCode(item);
        const message = item instanceof Error ? item.message : '';
        return [code, message].filter(Boolean).join(': ');
    })
        .filter(Boolean);
    return Array.from(new Set(summaries)).join('; ');
}
function getErrorMessage(error) {
    const aggregateMessage = getAggregateErrorMessage(error);
    if (aggregateMessage)
        return aggregateMessage;
    const code = getErrorCode(error);
    if (error instanceof Error && error.message.trim()) {
        return code ? `${code}: ${error.message}` : error.message;
    }
    if (code)
        return code;
    return String(error || 'Unknown MLS Grid sync runner error.');
}
function getOptionalBoolean(value) {
    return typeof value === 'boolean' ? value : undefined;
}
function buildSyncOptions(options) {
    return {
        maxRuntimeMs: options.maxRuntimeMs ?? MLS_SYNC_DEFAULT_MAX_RUNTIME_MS,
        rateDelayMs: options.rateDelayMs ?? MLS_SYNC_DEFAULT_RATE_DELAY_MS,
        pageSize: options.pageSize ?? MLS_SYNC_DEFAULT_PAGE_SIZE,
        maxPages: options.maxPages ?? MLS_SYNC_DEFAULT_MAX_PAGES,
        startPage: options.startPage ?? 0,
        includeMedia: getOptionalBoolean(options.includeMedia),
        pageTimeoutMs: options.pageTimeoutMs ?? MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS,
    };
}
function buildOutput(options, syncOptions, notes = [], diagnostics = [], summary) {
    return {
        success: diagnostics.length === 0,
        module: 'mls-sync-runner',
        generatedAt: new Date().toISOString(),
        dryRun: options.dryRun,
        executed: options.execute,
        terminal: 'Terminal 5',
        options: syncOptions,
        plan: getSyncMLSGridPlan(syncOptions),
        summary,
        notes,
        diagnostics,
        commands: {
            dryRun: 'npm run run:mls-sync:dry',
            boundedLive: 'npm run run:mls-sync:live',
            status: 'curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/mls/status"',
            queueDashboard: 'npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000',
        },
    };
}
function writeOutput(options, output) {
    if (options.json) {
        console.log(JSON.stringify(output, null, 2));
        return;
    }
    console.log('MLS Grid sync runner plan:', {
        dryRun: output.dryRun,
        executed: output.executed,
        terminal: output.terminal,
        options: output.options,
        plan: output.plan,
    });
    for (const diagnostic of output.diagnostics) {
        console.error(`MLS Grid sync runner diagnostic: ${diagnostic}`);
    }
    for (const note of output.notes) {
        console.log(note);
    }
    if (output.summary) {
        console.log('MLS Grid sync runner complete:', output.summary);
    }
}
async function main() {
    const options = parseCliOptions(process.argv.slice(2));
    const syncOptions = buildSyncOptions(options);
    if (options.dryRun) {
        writeOutput(options, buildOutput(options, syncOptions, ['Dry-run complete. No MLS Grid request was made.']));
        return;
    }
    const { syncMLSGrid } = await import('../lib/mls/syncMLSGrid.js');
    const summary = await syncMLSGrid(syncOptions);
    if (!summary) {
        writeOutput(options, buildOutput(options, syncOptions, ['MLS Grid sync did not start because another healthy sync is already running.']));
        return;
    }
    const diagnostics = [
        ...(summary.stoppedReason === 'error' || summary.listingsFailed > 0
            ? [`MLS Grid sync stopped with ${summary.stoppedReason}; listings failed: ${summary.listingsFailed}.`]
            : []),
        ...(summary.indexFailed > 0 ? [`MLS Grid sync completed with ${summary.indexFailed} search index failure(s).`] : []),
    ];
    writeOutput(options, buildOutput(options, syncOptions, [], diagnostics, summary));
    if (diagnostics.length) {
        process.exitCode = 1;
    }
}
main().catch((error) => {
    console.error('MLS Grid sync runner failed:', getErrorMessage(error));
    process.exitCode = 1;
});
// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/mlsSync.ts
