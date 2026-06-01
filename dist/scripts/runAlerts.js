import { processAlertQueue } from '../lib/alerts/processAlertQueue.js';
import { prisma } from '../lib/prisma.js';
import { assertDatabaseReady } from '../lib/queue/databasePreflight.js';
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
const EMAIL_VISIBLE_PREFIX = 2;
const LOCAL_BASE_URL = 'http://localhost:3000';
const TERMINAL_5 = 'Terminal 5';
const HELP_TEXT = `
REIE saved-search alert runner

Usage:
  node dist/scripts/runAlerts.js [options]

Options:
  --limit <number>    Maximum pending alerts to scan. Default: ${DEFAULT_LIMIT}, max: ${MAX_LIMIT}.
  --limit=<number>    Same as --limit <number>.
  --dry-run           Preview queued alerts without sending email or changing status.
  --live              Send live alert email and update alert statuses.
  --execute           Alias for --live.
  --help              Show this help text.

Environment:
  ALERT_RUN_LIMIT     Default limit when --limit is omitted.
  ALERT_RUN_DRY_RUN   Set to false, 0, or no only when live mode is intentionally allowed.

Terminal 5 examples:
  node dist/scripts/runAlerts.js
  node dist/scripts/runAlerts.js --limit 25
  node dist/scripts/runAlerts.js --dry-run
  node dist/scripts/runAlerts.js --limit=25 --live
  npm run run:alerts:dry
  npm run run:alerts:live -- --limit 25

Related Terminal 5 checks:
  npm run worker:build
  npm run run:mls-sync:dry
  curl -s "http://localhost:3000/api/process-alerts?dryRun=true&limit=25"
  curl -s "http://localhost:3000/api/process-alerts?limit=25"
  curl -s "http://localhost:3000/api/mls/retry"
  curl -s "http://localhost:3000/api/admin/dead-letter?sourceQueue=reie-alerts&limit=25"

Operational rule:
  Dry-run is the default. Use --live or --execute only after reviewing a dry-run preview.
`;
function printHelp() {
    console.log(HELP_TEXT.trim());
}
function parseBoundedInteger(value, name, min, max) {
    if (!value)
        throw new Error(`Missing value for ${name}.`);
    const parsed = Number(value);
    if (!Number.isInteger(parsed))
        throw new Error(`Invalid integer for ${name}: ${value}`);
    if (parsed < min || parsed > max)
        throw new Error(`${name} must be between ${min} and ${max}.`);
    return parsed;
}
function readBoolean(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (['false', '0', 'no'].includes(normalized))
        return false;
    if (['true', '1', 'yes'].includes(normalized))
        return true;
    return undefined;
}
function readFlagValue(arg) {
    const [, value] = arg.split('=');
    return value;
}
function readDefaultLimit() {
    if (!process.env.ALERT_RUN_LIMIT)
        return DEFAULT_LIMIT;
    return parseBoundedInteger(process.env.ALERT_RUN_LIMIT, 'ALERT_RUN_LIMIT', 1, MAX_LIMIT);
}
function readDefaultDryRun() {
    const envValue = readBoolean(process.env.ALERT_RUN_DRY_RUN);
    return envValue ?? true;
}
function parseArgs(argv) {
    const options = {
        limit: readDefaultLimit(),
        dryRun: readDefaultDryRun(),
    };
    for (let index = 0; index < argv.length; index++) {
        const arg = argv[index];
        if (arg === '--help' || arg === '-h') {
            printHelp();
            return null;
        }
        if (arg === '--dry-run') {
            options.dryRun = true;
            continue;
        }
        if (arg === '--live' || arg === '--execute') {
            options.dryRun = false;
            continue;
        }
        if (arg === '--limit') {
            options.limit = parseBoundedInteger(argv[index + 1], '--limit', 1, MAX_LIMIT);
            index++;
            continue;
        }
        if (arg.startsWith('--limit=')) {
            options.limit = parseBoundedInteger(readFlagValue(arg), '--limit', 1, MAX_LIMIT);
            continue;
        }
        throw new Error(`Unknown option: ${arg}`);
    }
    return options;
}
function maskEmail(email) {
    if (!email)
        return '';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain)
        return '[invalid email]';
    return `${localPart.slice(0, EMAIL_VISIBLE_PREFIX)}***@${domain}`;
}
function buildCommands(limit) {
    return {
        terminal: TERMINAL_5,
        status: `curl -s "${LOCAL_BASE_URL}/api/process-alerts?limit=${limit}"`,
        apiDryRun: `curl -s -X POST "${LOCAL_BASE_URL}/api/process-alerts?dryRun=true&limit=${limit}"`,
        apiLive: `curl -s -X POST "${LOCAL_BASE_URL}/api/process-alerts?execute=true&limit=${limit}"`,
        scriptDryRun: `node dist/scripts/runAlerts.js --dry-run --limit=${limit}`,
        scriptLive: `node dist/scripts/runAlerts.js --live --limit=${limit}`,
        workerDryRun: 'npm run run:worker:alerts:once',
        workerLiveOnce: 'npm run run:worker:alerts:once:live',
        queueDashboard: 'npm run run:queue-dashboard -- --failed --limit=5',
        retryStatus: `curl -s "${LOCAL_BASE_URL}/api/mls/retry"`,
        deadLetter: `curl -s "${LOCAL_BASE_URL}/api/admin/dead-letter?sourceQueue=reie-alerts&states=waiting,delayed,failed&limit=25"`,
    };
}
function getRecommendation(result) {
    if (result.failed > 0)
        return 'Review failed alerts before running a larger or live batch.';
    if (result.dryRun && result.scanned > 0)
        return 'Dry-run preview completed. Review rows before rerunning with --live.';
    if (result.dryRun)
        return 'Dry-run found no pending alert work.';
    return 'Live alert run completed. Confirm EmailLog and AlertQueue status in the database.';
}
function buildExecutionPlan(options, result) {
    const commands = buildCommands(options.limit);
    const gates = [
        {
            label: 'Mode',
            status: result.dryRun ? 'pass' : 'watch',
            detail: result.dryRun ? 'Dry-run mode; no client email should be sent.' : 'Live mode requested; verify email side effects.',
        },
        {
            label: 'Failures',
            status: result.failed > 0 ? 'fail' : 'pass',
            detail: `${result.failed} failed alert(s) in this run.`,
        },
        {
            label: 'Email Sends',
            status: result.sent > 0 && !result.dryRun ? 'watch' : 'pass',
            detail: `${result.sent} sent, ${result.skipped} skipped, ${result.scanned} scanned.`,
        },
        {
            label: 'Review Scope',
            status: result.scanned > 0 ? 'watch' : 'pass',
            detail: result.scanned > 0 ? 'Review masked alert rows below before changing live scope.' : 'No alert rows were scanned.',
        },
    ];
    if (result.failed > 0) {
        return {
            level: 'blocked',
            summary: 'Alert failures were reported; live runs should stop until dead letters and failed rows are reviewed.',
            nextAction: 'Inspect alert dead letters.',
            terminal: TERMINAL_5,
            nextCommand: commands.deadLetter,
            liveAllowed: false,
            gates,
        };
    }
    if (result.dryRun && result.scanned > 0) {
        return {
            level: 'caution',
            summary: 'Dry-run found alert rows. Live run is available only after reviewing the preview.',
            nextAction: 'Review preview rows before live execution.',
            terminal: TERMINAL_5,
            nextCommand: commands.scriptLive,
            liveAllowed: true,
            gates,
        };
    }
    if (!result.dryRun) {
        return {
            level: 'caution',
            summary: 'Live alert run completed. Verify email logs, unsubscribe safety, and alert statuses.',
            nextAction: 'Refresh alert API status.',
            terminal: TERMINAL_5,
            nextCommand: commands.status,
            liveAllowed: false,
            gates,
        };
    }
    return {
        level: 'safe',
        summary: 'No pending alert rows were found in dry-run mode.',
        nextAction: 'Keep alert status available for the next saved-search event.',
        terminal: TERMINAL_5,
        nextCommand: commands.status,
        liveAllowed: false,
        gates,
    };
}
function printResult(options, result) {
    const commands = buildCommands(options.limit);
    console.log('REIE saved-search alert run complete:', {
        scanned: result.scanned,
        sent: result.sent,
        skipped: result.skipped,
        failed: result.failed,
        dryRun: result.dryRun,
        success: result.success,
        recommendation: getRecommendation(result),
        executionPlan: buildExecutionPlan(options, result),
        relatedCommands: commands,
    });
    if (!result.alerts.length) {
        console.log('No pending alerts matched this run.');
        return;
    }
    console.table(result.alerts.map((alert) => ({
        id: alert.id,
        email: maskEmail(alert.email),
        status: alert.status,
        reason: alert.reason || '',
    })));
}
async function runAlerts() {
    const options = parseArgs(process.argv.slice(2));
    if (!options)
        return;
    console.log('REIE saved-search alert run starting:', {
        ...options,
        mode: options.dryRun ? 'preview' : 'live',
    });
    await assertDatabaseReady({
        operation: 'saved-search alert runner',
        recoveryCommand: 'npm run supabase:check',
    });
    const result = await processAlertQueue({
        limit: options.limit,
        dryRun: options.dryRun,
    });
    printResult(options, result);
    if (!result.success) {
        process.exitCode = 1;
    }
}
runAlerts()
    .catch((error) => {
    console.error('REIE saved-search alert run failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/runAlerts.ts
