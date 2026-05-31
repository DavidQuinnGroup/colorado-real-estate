const MLS_SYNC_MAX_RUNTIME_MS = 60 * 60 * 1000;
const MLS_SYNC_MAX_RATE_DELAY_MS = 60000;
const MLS_SYNC_MAX_PAGE_SIZE = 100;
const MLS_SYNC_MAX_PAGES = 100;
const MLS_SYNC_MAX_START_PAGE = 1000000;
const MLS_SYNC_MAX_PAGE_TIMEOUT_MS = 120000;
const HELP_TEXT = `
MLS Grid fetch compatibility runner

Usage:
  node dist/scripts/fetchMLS.js [options]

Options:
  --dry-run                  Print a no-write compatibility plan.
  --preview                  Alias for --dry-run.
  --sync                     Legacy live alias for --execute.
  --execute                  Run the active MLS Grid sync pipeline.
  --live                     Alias for --execute.
  --enqueue                  Legacy alias for --sync.
  --max-pages=<number>       Stop after this many MLS pages.
  --page-size=<number>       Listings per MLS page. Max 100.
  --start-page=<number>      Start from a specific MLS page.
  --max-runtime-ms=<number>  Stop after this many milliseconds.
  --rate-delay-ms=<number>   Delay between MLS pages in milliseconds.
  --page-timeout-ms=<number> Timeout for each MLS Grid page request.
  --no-media                 Fetch listings without expanded Media.
  --help                     Show this help text.

Default behavior is a no-write compatibility notice. Use --execute to mutate data.

Terminal 5 preferred dry-run:
  npm run run:mls-sync:dry

Terminal 5 preferred bounded live run:
  npm run run:mls-sync:live

Compatibility bounded live run:
  node dist/scripts/fetchMLS.js --execute --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
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
        dryRun: false,
        sync: false,
    };
    for (const arg of argv) {
        if (arg === '--help' || arg === '-h') {
            console.log(HELP_TEXT.trim());
            process.exit(0);
        }
        if (arg === '--dry-run' || arg === '--preview') {
            options.dryRun = true;
            options.sync = false;
            continue;
        }
        if (arg === '--sync' || arg === '--execute' || arg === '--live') {
            options.sync = true;
            options.dryRun = false;
            continue;
        }
        if (arg === '--enqueue') {
            options.sync = true;
            options.dryRun = false;
            console.warn('--enqueue is deprecated for fetchMLS. Use --execute or npm run run:mls-sync:live instead.');
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
function getSyncOptions(options) {
    const { dryRun, sync, ...syncOptions } = options;
    return syncOptions;
}
async function main() {
    const options = parseCliOptions(process.argv.slice(2));
    if (!options.sync) {
        console.log([
            'fetchMLS is now a compatibility entrypoint for the active MLS Grid sync pipeline.',
            'No MLS data was fetched and no records were changed.',
            'Preferred dry-run command: `npm run run:mls-sync:dry`.',
            'Preferred bounded live command: `npm run run:mls-sync:live`.',
            'Compatibility live command: `node dist/scripts/fetchMLS.js --execute --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000`.',
        ].join('\n'));
        return;
    }
    const syncOptions = getSyncOptions(options);
    const { syncMLSGrid } = await import('../lib/mls/syncMLSGrid.js');
    console.log('Starting MLS Grid compatibility sync with options:', syncOptions);
    const summary = await syncMLSGrid(syncOptions);
    if (!summary) {
        console.log('MLS Grid compatibility sync did not start because another healthy sync is already running.');
        return;
    }
    console.log('MLS Grid compatibility sync complete:', summary);
    if (summary.stoppedReason === 'error' || summary.listingsFailed > 0) {
        process.exitCode = 1;
    }
}
main().catch((error) => {
    console.error('MLS Grid compatibility fetch runner failed:', error?.message ?? error);
    process.exit(1);
});
export {};
// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/fetchMLS.ts
