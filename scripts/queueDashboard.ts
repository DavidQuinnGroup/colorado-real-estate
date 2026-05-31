import { Queue } from 'bullmq';
import {
  ALERT_JOB_ATTEMPTS,
  ALERT_JOB_BACKOFF_DELAY_MS,
  ALERT_QUEUE_NAME,
  ALERT_REMOVE_ON_COMPLETE_AGE_SECONDS,
  ALERT_REMOVE_ON_COMPLETE_COUNT,
  ALERT_REMOVE_ON_FAIL_AGE_SECONDS,
  ALERT_REMOVE_ON_FAIL_COUNT,
  alertQueue,
} from '../lib/queue/alertQueue.js';
import { deadLetterQueue, DEAD_LETTER_QUEUE_NAME } from '../lib/queue/deadLetterQueue.js';
import {
  LISTING_JOB_ATTEMPTS,
  LISTING_JOB_BACKOFF_DELAY_MS,
  LISTING_QUEUE_NAME,
  LISTING_REMOVE_ON_COMPLETE,
  LISTING_REMOVE_ON_FAIL,
  listingQueue,
} from '../lib/queue/listingQueue.js';
import {
  MLS_PAGE_JOB_ATTEMPTS,
  MLS_PAGE_JOB_BACKOFF_DELAY_MS,
  MLS_PAGE_QUEUE_NAME,
  MLS_PAGE_REMOVE_ON_COMPLETE_AGE_SECONDS,
  MLS_PAGE_REMOVE_ON_COMPLETE_COUNT,
  MLS_PAGE_REMOVE_ON_FAIL_AGE_SECONDS,
  MLS_PAGE_REMOVE_ON_FAIL_COUNT,
  mlsPageQueue,
} from '../lib/queue/mlsPageQueue.js';
import {
  MLS_SYNC_JOB_ATTEMPTS,
  MLS_SYNC_JOB_BACKOFF_DELAY_MS,
  MLS_SYNC_QUEUE_NAME,
  MLS_SYNC_REMOVE_ON_COMPLETE_AGE_SECONDS,
  MLS_SYNC_REMOVE_ON_COMPLETE_COUNT,
  MLS_SYNC_REMOVE_ON_FAIL_AGE_SECONDS,
  MLS_SYNC_REMOVE_ON_FAIL_COUNT,
  mlsQueue,
} from '../lib/queue/mlsQueue.js';
import { closeRedisConnections } from '../lib/queue/redis.js';

type DashboardOptions = {
  includeFailed: boolean;
  includeSample: boolean;
  limit: number;
  timeoutMs: number;
};

type QueueDefinition = {
  label: string;
  name: string;
  policy?: QueuePolicy;
  queue: Queue;
};

type QueuePolicy = {
  attempts: number;
  backoffDelayMs?: number;
  removeOnComplete?: number | { ageSeconds?: number; count?: number };
  removeOnFail?: number | { ageSeconds?: number; count?: number };
};

type QueueCounts = {
  waiting?: number;
  active?: number;
  delayed?: number;
  completed?: number;
  failed?: number;
  paused?: number;
};

type QueueInspectionResult = {
  label: string;
  name: string;
  counts: QueueCounts;
  health: 'healthy' | 'busy' | 'degraded';
  policy: QueuePolicy | null;
  commands: {
    retryStatus: string;
    dryRunRetry: string;
    liveRetry: string;
    deadLetterBySourceQueue: string;
    workerProcessInspection: string;
  };
  sample?: {
    waiting: unknown[];
    active: unknown[];
    delayed: unknown[];
  };
  staleActive?: unknown[];
  failed?: unknown[];
};

type RecoveryPlan = {
  level: 'safe' | 'caution' | 'blocked';
  summary: string;
  nextAction: string;
  terminal: 'Terminal 5';
  nextCommand: string;
  gates: Array<{
    label: string;
    status: 'pass' | 'watch' | 'fail';
    detail: string;
  }>;
};

const DEFAULT_LIMIT = 5;
const DEFAULT_TIMEOUT_MS = 8000;
const MAX_PAYLOAD_STRING_LENGTH = 500;
const STALE_ACTIVE_JOB_MS = 30 * 60 * 1000;
const REDACTED_KEYS = new Set(['authorization', 'cookie', 'email', 'password', 'phone', 'token', 'x-admin-key']);
const queueErrorMessages = new Map<string, string>();

const HELP_TEXT = `
REIE queue dashboard

Usage:
  node dist/scripts/queueDashboard.js [options]

Options:
  --failed             Include recent failed jobs for each queue.
  --sample             Include recent waiting/active/delayed sample jobs.
  --limit=<number>     Number of sample jobs per state. Default: 5, max: 50.
  --timeout-ms=<num>   Timeout per queue operation. Default: 8000.
  --help               Show this help text.

Recommended local check:
  node dist/scripts/queueDashboard.js --failed --limit=5

Related Terminal 5 checks:
  npm run run:mls-sync:dry
  curl -s "http://localhost:3000/api/mls/status"
  curl -s "http://localhost:3000/api/mls/retry"
  curl -s "http://localhost:3000/api/admin/dead-letter?limit=25"
  curl -s -X POST "http://localhost:3000/api/mls/retry?queue=mls-sync&dryRun=true&limit=10"
`;

const QUEUES: QueueDefinition[] = [
  {
    label: 'MLS sync',
    name: MLS_SYNC_QUEUE_NAME,
    policy: {
      attempts: MLS_SYNC_JOB_ATTEMPTS,
      backoffDelayMs: MLS_SYNC_JOB_BACKOFF_DELAY_MS,
      removeOnComplete: {
        ageSeconds: MLS_SYNC_REMOVE_ON_COMPLETE_AGE_SECONDS,
        count: MLS_SYNC_REMOVE_ON_COMPLETE_COUNT,
      },
      removeOnFail: {
        ageSeconds: MLS_SYNC_REMOVE_ON_FAIL_AGE_SECONDS,
        count: MLS_SYNC_REMOVE_ON_FAIL_COUNT,
      },
    },
    queue: mlsQueue as Queue,
  },
  {
    label: 'MLS page',
    name: MLS_PAGE_QUEUE_NAME,
    policy: {
      attempts: MLS_PAGE_JOB_ATTEMPTS,
      backoffDelayMs: MLS_PAGE_JOB_BACKOFF_DELAY_MS,
      removeOnComplete: {
        ageSeconds: MLS_PAGE_REMOVE_ON_COMPLETE_AGE_SECONDS,
        count: MLS_PAGE_REMOVE_ON_COMPLETE_COUNT,
      },
      removeOnFail: {
        ageSeconds: MLS_PAGE_REMOVE_ON_FAIL_AGE_SECONDS,
        count: MLS_PAGE_REMOVE_ON_FAIL_COUNT,
      },
    },
    queue: mlsPageQueue as Queue,
  },
  {
    label: 'Listings',
    name: LISTING_QUEUE_NAME,
    policy: {
      attempts: LISTING_JOB_ATTEMPTS,
      backoffDelayMs: LISTING_JOB_BACKOFF_DELAY_MS,
      removeOnComplete: LISTING_REMOVE_ON_COMPLETE,
      removeOnFail: LISTING_REMOVE_ON_FAIL,
    },
    queue: listingQueue as Queue,
  },
  {
    label: 'Alerts',
    name: ALERT_QUEUE_NAME,
    policy: {
      attempts: ALERT_JOB_ATTEMPTS,
      backoffDelayMs: ALERT_JOB_BACKOFF_DELAY_MS,
      removeOnComplete: {
        ageSeconds: ALERT_REMOVE_ON_COMPLETE_AGE_SECONDS,
        count: ALERT_REMOVE_ON_COMPLETE_COUNT,
      },
      removeOnFail: {
        ageSeconds: ALERT_REMOVE_ON_FAIL_AGE_SECONDS,
        count: ALERT_REMOVE_ON_FAIL_COUNT,
      },
    },
    queue: alertQueue as Queue,
  },
  {
    label: 'Dead letter',
    name: DEAD_LETTER_QUEUE_NAME,
    queue: deadLetterQueue as Queue,
  },
];

function parseNumber(value: string | undefined, name: string) {
  if (!value) throw new Error(`Missing value for ${name}.`);

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`Invalid number for ${name}: ${value}`);

  return parsed;
}

function readFlagValue(arg: string) {
  const [, value] = arg.split('=');
  return value;
}

function getSafeInteger(value: number, fallback: number, min: number, max: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(Math.floor(value), max));
}

function parseCliOptions(argv: string[]): DashboardOptions {
  const options: DashboardOptions = {
    includeFailed: false,
    includeSample: false,
    limit: DEFAULT_LIMIT,
    timeoutMs: DEFAULT_TIMEOUT_MS,
  };

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      console.log(HELP_TEXT.trim());
      process.exit(0);
    }

    if (arg === '--failed') {
      options.includeFailed = true;
      continue;
    }

    if (arg === '--sample') {
      options.includeSample = true;
      continue;
    }

    if (arg.startsWith('--limit=')) {
      options.limit = parseNumber(readFlagValue(arg), '--limit');
      continue;
    }

    if (arg.startsWith('--timeout-ms=')) {
      options.timeoutMs = parseNumber(readFlagValue(arg), '--timeout-ms');
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  return {
    ...options,
    limit: getSafeInteger(options.limit, DEFAULT_LIMIT, 1, 50),
    timeoutMs: getSafeInteger(options.timeoutMs, DEFAULT_TIMEOUT_MS, 1000, 30000),
  };
}

async function withTimeout<T>(label: string, timeoutMs: number, operation: Promise<T>) {
  let timeout: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms.`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([operation, timeoutPromise]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function summarizeJob(job: any) {
  return {
    id: job?.id,
    name: job?.name,
    attemptsMade: job?.attemptsMade,
    failedReason: job?.failedReason,
    timestamp: job?.timestamp ? new Date(job.timestamp).toISOString() : undefined,
    processedOn: job?.processedOn ? new Date(job.processedOn).toISOString() : undefined,
    finishedOn: job?.finishedOn ? new Date(job.finishedOn).toISOString() : undefined,
    data: redactPayload(job?.data),
  };
}

function getJobProcessedAgeMs(job: any) {
  if (!job?.processedOn) return 0;
  return Math.max(Date.now() - Number(job.processedOn), 0);
}

function isSensitiveKey(key: string) {
  const normalized = key.toLowerCase();
  return REDACTED_KEYS.has(normalized) || normalized.includes('secret') || normalized.includes('api_key') || normalized.includes('apikey');
}

function truncateString(value: string) {
  if (value.length <= MAX_PAYLOAD_STRING_LENGTH) return value;
  return `${value.slice(0, MAX_PAYLOAD_STRING_LENGTH)}...<truncated>`;
}

function redactPayload(value: unknown, depth = 0): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return truncateString(value);
  if (typeof value !== 'object') return value;
  if (depth >= 4) return '[Max depth reached]';

  if (Array.isArray(value)) {
    return value.slice(0, 25).map((item) => redactPayload(item, depth + 1));
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      isSensitiveKey(key) ? '[REDACTED]' : redactPayload(item, depth + 1),
    ]),
  );
}

function getErrorCode(error: unknown) {
  if (!error || typeof error !== 'object') return '';
  const maybeCode = (error as { code?: unknown }).code;
  return typeof maybeCode === 'string' ? maybeCode : '';
}

function getAggregateErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object' || !Array.isArray((error as { errors?: unknown[] }).errors)) return '';

  const errors = (error as { errors: unknown[] }).errors;
  const summaries = errors
    .map((item) => {
      if (!item || typeof item !== 'object') return String(item || '');
      const code = getErrorCode(item);
      const address = (item as { address?: unknown }).address;
      const port = (item as { port?: unknown }).port;
      const syscall = (item as { syscall?: unknown }).syscall;
      const location = typeof address === 'string' && port ? `${address}:${port}` : '';

      return [code, syscall, location].filter(Boolean).join(' ');
    })
    .filter(Boolean);

  return Array.from(new Set(summaries)).join('; ');
}

function getDiagnosticMessage(error: unknown, queueName: string) {
  const aggregateMessage = getAggregateErrorMessage(error);
  if (aggregateMessage) return `Redis connection failed for ${queueName}: ${aggregateMessage}`;

  const code = getErrorCode(error);
  if (code) return `Redis connection failed for ${queueName}: ${code}`;

  if (error instanceof Error && error.message.trim()) {
    const queuedError = queueErrorMessages.get(queueName);
    if (queuedError && error.message === 'Connection is closed.') return queuedError;

    return error.message;
  }

  const fallback = String(error || '').trim();
  return fallback || `Queue inspection failed for ${queueName}; Redis may be unavailable or blocked by sandbox permissions.`;
}

function attachDashboardQueueErrorListeners() {
  for (const definition of QUEUES) {
    definition.queue.on('error', (error) => {
      queueErrorMessages.set(definition.name, getDiagnosticMessage(error, definition.name));
    });
  }
}

function getQueueHealth(counts: QueueCounts) {
  if ((counts.failed || 0) > 0) return 'degraded';
  if ((counts.active || 0) > 0 || (counts.waiting || 0) > 0 || (counts.delayed || 0) > 0) return 'busy';
  return 'healthy';
}

function buildDryRunRetryCommand(queueName: string, limit = 10) {
  const params = new URLSearchParams({
    queue: queueName,
    dryRun: 'true',
    limit: String(limit),
  });

  return `curl -s -X POST "http://localhost:3000/api/mls/retry?${params.toString()}"`;
}

function buildRetryStatusCommand(queueName: string, limit = 10) {
  const params = new URLSearchParams({
    queue: queueName,
    limit: String(limit),
  });

  return `curl -s "http://localhost:3000/api/mls/retry?${params.toString()}"`;
}

function buildLiveRetryCommand(queueName: string, limit = 10) {
  const params = new URLSearchParams({
    queue: queueName,
    dryRun: 'false',
    execute: 'true',
    limit: String(limit),
  });

  return `curl -s -X POST "http://localhost:3000/api/mls/retry?${params.toString()}"`;
}

function buildWorkerProcessInspectionCommand() {
  return 'ps -ax -o pid,command | rg "worker|queue|bull|mls"';
}

function buildDeadLetterBySourceQueueCommand(queueName: string, limit = 25) {
  const params = new URLSearchParams({
    sourceQueue: queueName,
    states: 'waiting,delayed,failed',
    limit: String(limit),
  });

  return `curl -s "http://localhost:3000/api/admin/dead-letter?${params.toString()}"`;
}

async function inspectQueue(definition: QueueDefinition, options: DashboardOptions) {
  const counts = await withTimeout(
    `${definition.name} getJobCounts`,
    options.timeoutMs,
    definition.queue.getJobCounts('waiting', 'active', 'delayed', 'completed', 'failed', 'paused'),
  );

  const result: QueueInspectionResult = {
    label: definition.label,
    name: definition.name,
    counts,
    health: getQueueHealth(counts),
    policy: definition.policy ?? null,
    commands: {
      retryStatus: buildRetryStatusCommand(definition.name),
      dryRunRetry: buildDryRunRetryCommand(definition.name),
      liveRetry: buildLiveRetryCommand(definition.name),
      deadLetterBySourceQueue: buildDeadLetterBySourceQueueCommand(definition.name),
      workerProcessInspection: buildWorkerProcessInspectionCommand(),
    },
  };

  if (options.includeSample) {
    const [waiting, active, delayed] = await Promise.all([
      withTimeout(`${definition.name} waiting sample`, options.timeoutMs, definition.queue.getJobs(['waiting'], 0, options.limit - 1)),
      withTimeout(`${definition.name} active sample`, options.timeoutMs, definition.queue.getJobs(['active'], 0, options.limit - 1)),
      withTimeout(`${definition.name} delayed sample`, options.timeoutMs, definition.queue.getJobs(['delayed'], 0, options.limit - 1)),
    ]);

    result.sample = {
      waiting: waiting.map(summarizeJob),
      active: active.map(summarizeJob),
      delayed: delayed.map(summarizeJob),
    };

    result.staleActive = active.filter((job) => getJobProcessedAgeMs(job) > STALE_ACTIVE_JOB_MS).map(summarizeJob);
  } else if ((counts.active || 0) > 0) {
    const active = await withTimeout(
      `${definition.name} active stale check`,
      options.timeoutMs,
      definition.queue.getJobs(['active'], 0, Math.min(options.limit, 5) - 1),
    );

    result.staleActive = active.filter((job) => getJobProcessedAgeMs(job) > STALE_ACTIVE_JOB_MS).map(summarizeJob);
  }

  if (options.includeFailed) {
    const failed = await withTimeout(
      `${definition.name} failed jobs`,
      options.timeoutMs,
      definition.queue.getJobs(['failed'], 0, options.limit - 1),
    );

    result.failed = failed.map(summarizeJob);
  }

  return result;
}

function buildRecoveryPlan(queues: QueueInspectionResult[], diagnostics: Array<{ queue: string; message: string }>): RecoveryPlan {
  const failedQueues = queues.filter((queue) => (queue.counts.failed || 0) > 0);
  const staleActiveQueues = queues.filter((queue) => (queue.staleActive?.length || 0) > 0);
  const busyQueues = queues.filter((queue) => (queue.counts.active || 0) > 0 || (queue.counts.waiting || 0) > 0 || (queue.counts.delayed || 0) > 0);
  const deadLetter = queues.find((queue) => queue.name === DEAD_LETTER_QUEUE_NAME);
  const deadLetterOpen = deadLetter ? (deadLetter.counts.waiting || 0) + (deadLetter.counts.active || 0) + (deadLetter.counts.delayed || 0) + (deadLetter.counts.failed || 0) : 0;
  const firstFailedQueue = failedQueues.find((queue) => queue.name !== DEAD_LETTER_QUEUE_NAME) || failedQueues[0] || null;
  const firstStaleActiveQueue = staleActiveQueues.find((queue) => queue.name !== DEAD_LETTER_QUEUE_NAME) || staleActiveQueues[0] || null;
  const gates: RecoveryPlan['gates'] = [
    {
      label: 'Diagnostics',
      status: diagnostics.length > 0 ? 'fail' : 'pass',
      detail: diagnostics.length > 0 ? `${diagnostics.length} queue inspection diagnostic issue(s).` : 'Queue inspection completed cleanly.',
    },
    {
      label: 'Failed Jobs',
      status: failedQueues.length > 0 ? 'watch' : 'pass',
      detail: failedQueues.length > 0 ? `${failedQueues.length} queue(s) report failed jobs.` : 'No failed jobs reported by inspected queues.',
    },
    {
      label: 'Dead Letter',
      status: deadLetterOpen > 0 ? 'fail' : 'pass',
      detail: deadLetterOpen > 0 ? `${deadLetterOpen} open dead-letter job(s).` : 'No open dead-letter queue jobs reported.',
    },
    {
      label: 'Stale Active Jobs',
      status: staleActiveQueues.length > 0 ? 'fail' : 'pass',
      detail:
        staleActiveQueues.length > 0
          ? `${staleActiveQueues.length} queue(s) have active jobs older than ${Math.round(STALE_ACTIVE_JOB_MS / 60000)} minutes.`
          : 'No stale active jobs detected.',
    },
    {
      label: 'Active Work',
      status: busyQueues.length > 0 ? 'watch' : 'pass',
      detail: busyQueues.length > 0 ? `${busyQueues.length} queue(s) have active, waiting, or delayed work.` : 'Queues are idle.',
    },
  ];

  if (diagnostics.length > 0) {
    return {
      level: 'blocked',
      summary: 'Queue dashboard could not fully inspect Redis-backed queues.',
      nextAction: 'Confirm Docker and Redis are running before retrying jobs.',
      terminal: 'Terminal 5',
      nextCommand: 'npm run infra:up',
      gates,
    };
  }

  if (deadLetterOpen > 0) {
    return {
      level: 'blocked',
      summary: 'Dead-letter jobs are open; inspect dead letters before retrying source queues.',
      nextAction: 'Inspect open dead-letter records.',
      terminal: 'Terminal 5',
      nextCommand: 'curl -s "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"',
      gates,
    };
  }

  if (firstStaleActiveQueue) {
    return {
      level: 'blocked',
      summary: `${firstStaleActiveQueue.name} has stale active jobs; inspect workers before adding more work.`,
      nextAction: 'Inspect retry state, dead letters for the source queue, and worker process health before retrying or adding work.',
      terminal: 'Terminal 5',
      nextCommand: firstStaleActiveQueue.commands.retryStatus,
      gates,
    };
  }

  if (firstFailedQueue) {
    return {
      level: 'caution',
      summary: `${firstFailedQueue.name} has failed jobs available for dry-run recovery.`,
      nextAction: 'Run a dry-run retry before live retry.',
      terminal: 'Terminal 5',
      nextCommand: firstFailedQueue.commands.dryRunRetry,
      gates,
    };
  }

  if (busyQueues.length > 0) {
    return {
      level: 'caution',
      summary: 'Queues are processing work; monitor before launching more ingestion or retries.',
      nextAction: 'Refresh queue dashboard or MLS status.',
      terminal: 'Terminal 5',
      nextCommand: 'curl -s "http://localhost:3000/api/mls/status"',
      gates,
    };
  }

  return {
    level: 'safe',
    summary: 'Queue system is idle and no failed jobs are reported.',
    nextAction: 'Run smoke checks or a bounded MLS dry-run as needed.',
    terminal: 'Terminal 5',
    nextCommand: 'npm run smoke:ops',
    gates,
  };
}

async function closeQueues() {
  await Promise.allSettled(QUEUES.map((definition) => definition.queue.close()));
  await closeRedisConnections();
}

async function main() {
  const options = parseCliOptions(process.argv.slice(2));
  const startedAt = new Date().toISOString();
  const queues: QueueInspectionResult[] = [];
  const diagnostics: Array<{ queue: string; message: string }> = [];

  attachDashboardQueueErrorListeners();

  for (const definition of QUEUES) {
    try {
      queues.push(await inspectQueue(definition, options));
    } catch (error: any) {
      diagnostics.push({
        queue: definition.name,
        message: getDiagnosticMessage(error, definition.name),
      });
    }
  }

  console.log(
    JSON.stringify(
      {
        success: diagnostics.length === 0,
        module: 'queue-dashboard',
        generatedAt: new Date().toISOString(),
        startedAt,
        options,
        diagnostics,
        recoveryPlan: buildRecoveryPlan(queues, diagnostics),
        commands: {
          terminal: 'Terminal 5',
          dryRunMlsSync: 'npm run run:mls-sync:dry',
          mlsStatus: 'curl -s "http://localhost:3000/api/mls/status"',
          retryStatus: 'curl -s "http://localhost:3000/api/mls/retry"',
          deadLetter: 'curl -s "http://localhost:3000/api/admin/dead-letter?limit=25"',
          deadLetterOpen: 'curl -s "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"',
          workerProcessInspection: buildWorkerProcessInspectionCommand(),
          staleActiveMlsSyncInspection: buildRetryStatusCommand(MLS_SYNC_QUEUE_NAME),
          staleActiveMlsPageInspection: buildRetryStatusCommand(MLS_PAGE_QUEUE_NAME),
          dryRunRetryMlsSync: buildDryRunRetryCommand(MLS_SYNC_QUEUE_NAME),
          dryRunRetryMlsPage: buildDryRunRetryCommand(MLS_PAGE_QUEUE_NAME),
          dryRunRetryListings: buildDryRunRetryCommand(LISTING_QUEUE_NAME),
          dryRunRetryAlerts: buildDryRunRetryCommand(ALERT_QUEUE_NAME),
          alertDryRun: 'curl -s -X POST "http://localhost:3000/api/process-alerts?dryRun=true&limit=25"',
        },
        queues,
      },
      null,
      2,
    ),
  );

  if (diagnostics.length) {
    process.exitCode = 1;
  }
}

main()
  .catch((error: any) => {
    console.error('REIE queue dashboard failed:', getDiagnosticMessage(error, 'dashboard'));
    process.exitCode = 1;
  })
  .finally(() => {
    return closeQueues();
  });

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/queueDashboard.ts
