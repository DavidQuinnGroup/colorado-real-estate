import '../lib/env/loadNodeEnv.js';
import { prisma } from '../lib/prisma.js';
import { assertDatabaseReady } from '../lib/queue/databasePreflight.js';
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 200;
const TERMINAL = 'Terminal 5';
const HELP_TEXT = `
REIE failed alert row maintenance

Usage:
  node dist/scripts/alertFailedRows.js [options]

Options:
  --limit=<number>       Maximum failed rows to inspect. Default: ${DEFAULT_LIMIT}, max: ${MAX_LIMIT}.
  --mark-test-skipped    Mark likely test failed rows as skipped when --execute is also present.
  --execute              Apply the selected live action.
  --help                 Show this help text.

Terminal 5 examples:
  npm run run:alerts:failed
  npm run run:alerts:failed -- --limit=10
  npm run run:alerts:failed:skip-test

Safety:
  Default mode is inspection-only. No row status changes occur without both --execute and --mark-test-skipped.
`;
function readFlagValue(arg) {
    const [, value] = arg.split('=');
    return value || '';
}
function getBoundedInteger(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed))
        return fallback;
    return Math.max(min, Math.min(Math.floor(parsed), max));
}
function parseOptions(argv) {
    const options = {
        execute: false,
        limit: DEFAULT_LIMIT,
        markTestSkipped: false,
    };
    for (const arg of argv) {
        if (arg === '--help' || arg === '-h') {
            console.log(HELP_TEXT.trim());
            process.exit(0);
        }
        if (arg === '--execute') {
            options.execute = true;
            continue;
        }
        if (arg === '--mark-test-skipped') {
            options.markTestSkipped = true;
            continue;
        }
        if (arg.startsWith('--limit=')) {
            options.limit = getBoundedInteger(readFlagValue(arg), DEFAULT_LIMIT, 1, MAX_LIMIT);
            continue;
        }
        throw new Error(`Unknown option: ${arg}`);
    }
    return options;
}
function summarizePayload(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return {
            payloadType: Array.isArray(payload) ? 'array' : typeof payload,
            payloadKeys: [],
            hasUsableProperty: false,
            hasAddress: false,
            hasCity: false,
            hasPrice: false,
        };
    }
    const record = payload;
    const identity = record.propertyId || record.id || record.slug || record.mlsId || record.address;
    return {
        payloadType: 'object',
        payloadKeys: Object.keys(record).sort(),
        hasUsableProperty: Boolean(identity),
        hasAddress: typeof record.address === 'string' && record.address.trim().length > 0,
        hasCity: typeof record.city === 'string' && record.city.trim().length > 0,
        hasPrice: typeof record.price === 'number' && Number.isFinite(record.price),
    };
}
async function main() {
    const options = parseOptions(process.argv.slice(2));
    await assertDatabaseReady({
        operation: 'failed alert row maintenance',
        recoveryCommand: 'npm run supabase:check:json',
    });
    const rows = await prisma.alertQueue.findMany({
        where: { status: 'failed' },
        orderBy: { createdAt: 'asc' },
        take: options.limit,
        select: {
            id: true,
            userId: true,
            createdAt: true,
            clickedAt: true,
            payload: true,
        },
    });
    const inspectedRows = rows.map((row) => ({
        id: row.id,
        userId: row.userId,
        status: 'failed',
        createdAt: row.createdAt.toISOString(),
        clickedAt: row.clickedAt ? row.clickedAt.toISOString() : null,
        likelyTestRow: row.id.startsWith('test-'),
        ...summarizePayload(row.payload),
    }));
    const eligibleRows = inspectedRows.filter((row) => row.likelyTestRow);
    const shouldUpdate = options.execute && options.markTestSkipped;
    const updateResult = shouldUpdate
        ? await prisma.alertQueue.updateMany({
            where: {
                id: {
                    in: eligibleRows.map((row) => row.id),
                },
                status: 'failed',
            },
            data: {
                status: 'skipped',
            },
        })
        : { count: 0 };
    console.log(JSON.stringify({
        success: true,
        module: 'failed-alert-row-maintenance',
        terminal: TERMINAL,
        generatedAt: new Date().toISOString(),
        dryRun: !shouldUpdate,
        execute: options.execute,
        markTestSkipped: options.markTestSkipped,
        limit: options.limit,
        scanned: inspectedRows.length,
        eligibleTestRows: eligibleRows.length,
        updated: updateResult.count,
        liveAction: shouldUpdate ? 'marked-test-failed-alerts-skipped' : 'none',
        rows: inspectedRows,
        nextCommand: eligibleRows.length > 0 && !shouldUpdate
            ? 'npm run run:alerts:failed:skip-test'
            : 'curl -s "http://localhost:3000/api/process-alerts?limit=10"',
    }, null, 2));
}
main()
    .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/alertFailedRows.ts
