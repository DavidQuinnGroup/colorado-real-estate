import { prisma } from '../lib/prisma.js';
import { runCRMTasks } from '../workers/runCRMTasks.js';

type RunCRMOptions = {
  limit?: number;
  status?: string;
  json?: boolean;
};

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const DEFAULT_STATUS = 'active';

const HELP_TEXT = `
REIE CRM task runner

Usage:
  node dist/scripts/runCRM.js [options]

Options:
  --limit <number>   Maximum CRM tasks to scan. Default: ${DEFAULT_LIMIT}, max: ${MAX_LIMIT}.
  --limit=<number>   Same as --limit <number>.
  --status <status>  CRM task status to scan. Default: ${DEFAULT_STATUS}.
  --status=<status>  Same as --status <status>.
  --json             Print scheduler-friendly JSON only.
  --help             Show this help text.

Environment:
  CRM_RUN_LIMIT      Default limit when --limit is omitted.
  CRM_RUN_STATUS     Default task status when --status is omitted.

Terminal 5 examples:
  node dist/scripts/runCRM.js
  node dist/scripts/runCRM.js --limit 25
  node dist/scripts/runCRM.js --status pending --limit=25
  node dist/scripts/runCRM.js --status active --limit=25
  node dist/scripts/runCRM.js --status all --limit=50
  node dist/scripts/runCRM.js --status active --limit=25 --json
  npm run run:crm -- --limit 20 --status active

Related Terminal 5 checks:
  npm run worker:build
  curl -s http://localhost:3000/api/admin/intake-signals
  npm run run:mls-sync:dry
  npm run typecheck
  npm run lint
`;

function printHelp() {
  console.log(HELP_TEXT.trim());
}

function parseBoundedInteger(value: string | undefined, name: string, min: number, max: number) {
  if (!value) throw new Error(`Missing value for ${name}.`);

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) throw new Error(`Invalid integer for ${name}: ${value}`);
  if (parsed < min || parsed > max) throw new Error(`${name} must be between ${min} and ${max}.`);

  return parsed;
}

function readFlagValue(arg: string) {
  const [, value] = arg.split('=');
  return value;
}

function normalizeStatus(value: string | undefined) {
  const normalized = String(value || '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .trim()
    .slice(0, 48);

  return normalized || DEFAULT_STATUS;
}

function readDefaultLimit() {
  if (!process.env.CRM_RUN_LIMIT) return DEFAULT_LIMIT;
  return parseBoundedInteger(process.env.CRM_RUN_LIMIT, 'CRM_RUN_LIMIT', 1, MAX_LIMIT);
}

function parseArgs(argv: string[]): RunCRMOptions | null {
  const options: RunCRMOptions = {
    limit: readDefaultLimit(),
    status: normalizeStatus(process.env.CRM_RUN_STATUS),
  };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      printHelp();
      return null;
    }

    if (arg === '--json') {
      options.json = true;
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

    if (arg === '--status') {
      options.status = normalizeStatus(argv[index + 1]);
      if (!options.status) throw new Error('Missing value for --status.');
      index++;
      continue;
    }

    if (arg.startsWith('--status=')) {
      options.status = normalizeStatus(readFlagValue(arg));
      if (!options.status) throw new Error('Missing value for --status.');
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function getReadinessVerdict(summary: Awaited<ReturnType<typeof runCRMTasks>>) {
  if (!summary.success) return 'CRM task scan failed.';
  if (!summary.scanned) return summary.status === 'all' ? 'No CRM tasks are currently available.' : 'No CRM tasks matched this status.';
  if (summary.alertIncomplete > 0) return 'Some CRM tasks need stronger saved-search criteria before automated alert matching.';
  if (summary.alertReady > 0) return 'CRM tasks include alert-ready REIE intake context.';
  if (summary.alertWatch > 0) return 'CRM tasks include watch-level saved-search context.';
  return 'CRM tasks scanned; no saved-search alert readiness was attached.';
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!options) return;

  if (!options.json) {
    console.log('REIE CRM runner plan:', {
      terminal: 'Terminal 5',
      options,
      notes: [
        'CRM reporting is read-only.',
        'CRM task completion and dismissal remain human-reviewed through the admin review flow.',
        'CRM task completion and dismissal require review notes.',
        'Alert readiness comes from saved-search intake metadata created by the REIE capture flow.',
      ],
      relatedCommands: {
        crm: 'npm run run:crm -- --limit 20 --status active',
        intakeSignals: 'curl -s http://localhost:3000/api/admin/intake-signals',
        alertStatus: 'curl -s http://localhost:3000/api/process-alerts',
      },
    });
  }

  const summary = await runCRMTasks({
    limit: options.limit,
    status: options.status,
    quiet: options.json,
  });

  const report = {
    verdict: getReadinessVerdict(summary),
    scanned: summary.scanned,
    status: summary.status,
    effectiveStatuses: summary.effectiveStatuses,
    pending: summary.pending,
    reviewing: summary.reviewing,
    completed: summary.completed,
    dismissed: summary.dismissed,
    alertReady: summary.alertReady,
    alertWatch: summary.alertWatch,
    alertIncomplete: summary.alertIncomplete,
    audit: summary.audit,
    readiness: summary.readiness,
  };

  if (options.json) {
    console.log(JSON.stringify({
      success: summary.success,
      mode: 'scheduler',
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      terminal: 'Terminal 5',
      command: 'npm run run:crm:scheduler',
      options: {
        limit: options.limit,
        status: options.status,
      },
      report,
      tasks: summary.tasks,
    }, null, 2));
  } else {
    console.log('REIE CRM readiness verdict:', report);
  }

  if (!summary.success) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error('REIE CRM runner crashed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/runCRM.ts
