import { Queue } from 'bullmq';
import { NextRequest, NextResponse } from 'next/server';

import { ALERT_QUEUE_NAME, alertQueue } from '@/lib/queue/alertQueue';
import { DEAD_LETTER_QUEUE_NAME, deadLetterQueue } from '@/lib/queue/deadLetterQueue';
import { LISTING_QUEUE_NAME, listingQueue } from '@/lib/queue/listingQueue';
import { MLS_PAGE_QUEUE_NAME, mlsPageQueue } from '@/lib/queue/mlsPageQueue';
import { MLS_SYNC_QUEUE_NAME, mlsQueue } from '@/lib/queue/mlsQueue';
import { assertAppDatabaseReady } from '@/lib/appDatabasePreflight';
import { getRedisUrl } from '@/lib/queue/redis';

export const dynamic = 'force-dynamic';

type Health = 'healthy' | 'busy' | 'degraded';

type RetryQueueKey = 'mls-page' | 'mls-sync' | 'alerts' | 'listings';

type QueueRegistryItem = {
  key: RetryQueueKey;
  name: string;
  queue: Queue;
  aliases: string[];
};

type RetryRequestBody = {
  allowAllLive?: boolean | string;
  queue?: string;
  dryRun?: boolean | string;
  execute?: boolean | string;
  jobId?: string | string[];
  limit?: number | string;
};

type DiagnosticIssue = {
  area: string;
  message: string;
};

type DiagnosticResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      issue: DiagnosticIssue;
      value: T;
    };

type RetryJobSummary = {
  id?: string;
  name: string;
  state: string;
  attemptsMade: number;
  failedReason: string | null;
  finishedOn: string | null;
  retryable: boolean;
  skippedReason: string | null;
  action: 'would_retry' | 'retried' | 'skipped' | 'error';
};

type RetryQueueResult = {
  key: RetryQueueKey;
  name: string;
  inspected: number;
  retryable: number;
  retried: number;
  skipped: number;
  dryRun: boolean;
  targeted: boolean;
  jobs: RetryJobSummary[];
  errors: Array<{ jobId?: string; error: string }>;
};

type RetryExecutionPlan = {
  level: 'safe' | 'caution' | 'blocked';
  summary: string;
  nextAction: string;
  terminal: typeof TERMINAL_5;
  nextCommand: string;
  liveRetryAllowed: boolean;
  gates: Array<{
    label: string;
    status: 'pass' | 'watch' | 'fail';
    detail: string;
  }>;
};

class RetryRequestError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const RETRY_TIMEOUT_MS = 4_000;
const DEFAULT_RETRY_LIMIT = 100;
const MAX_RETRY_LIMIT = 500;
const MAX_JOB_IDS = 50;
const ROUTE_PATH = '/api/mls/retry';
const TERMINAL_5 = 'Terminal 5';
const DEAD_LETTER_COMMAND = 'curl -s "http://localhost:3000/api/admin/dead-letter?limit=25"';
const STATUS_COMMAND = 'curl -s "http://localhost:3000/api/mls/status"';
const QUEUE_DASHBOARD_COMMAND = 'npm run run:queue-dashboard';
const ALERT_DRY_RUN_COMMAND = 'curl -s -X POST "http://localhost:3000/api/process-alerts?dryRun=true"';
const SUPABASE_CHECK_COMMAND = 'npm run supabase:check';
const SUPABASE_CHECK_JSON_COMMAND = 'npm run supabase:check:json';

const RETRY_QUEUES: QueueRegistryItem[] = [
  {
    key: 'mls-page',
    name: MLS_PAGE_QUEUE_NAME,
    queue: mlsPageQueue,
    aliases: [MLS_PAGE_QUEUE_NAME],
  },
  {
    key: 'mls-sync',
    name: MLS_SYNC_QUEUE_NAME,
    queue: mlsQueue,
    aliases: [MLS_SYNC_QUEUE_NAME],
  },
  {
    key: 'alerts',
    name: ALERT_QUEUE_NAME,
    queue: alertQueue,
    aliases: [ALERT_QUEUE_NAME, 'alert', 'reie-alert'],
  },
  {
    key: 'listings',
    name: LISTING_QUEUE_NAME,
    queue: listingQueue,
    aliases: [LISTING_QUEUE_NAME, 'listing'],
  },
];

const SUPPORTED_QUEUE_VALUES = ['all', ...RETRY_QUEUES.flatMap((item) => [item.key, ...item.aliases])];

function getAdminKey() {
  return process.env.REIE_ADMIN_API_KEY || process.env.ADMIN_API_KEY || null;
}

function getRequestAdminKey(request: NextRequest) {
  const authorization = request.headers.get('authorization') || '';
  const bearerToken = authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7).trim() : '';
  return request.headers.get('x-admin-key') || bearerToken || request.nextUrl.searchParams.get('adminKey') || '';
}

function authorizeRequest(request: NextRequest) {
  const configuredKey = getAdminKey();

  if (!configuredKey) {
    return process.env.NODE_ENV !== 'production';
  }

  return getRequestAdminKey(request) === configuredKey;
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === 'object' && Array.isArray((error as { errors?: unknown[] }).errors)) {
    const aggregateMessage = (error as { errors: unknown[] }).errors
      .map((item) => (item instanceof Error ? item.message : String(item || '')))
      .filter(Boolean)
      .join('; ');

    if (aggregateMessage) return aggregateMessage;
  }

  if (error instanceof Error) return error.message;
  return String(error || 'Unknown retry status failure.');
}

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      ...(init?.headers || {}),
    },
  });
}

function timeoutIssue(area: string, timeoutMs: number): DiagnosticIssue {
  return {
    area,
    message: `Timed out after ${timeoutMs}ms.`,
  };
}

function errorIssue(area: string, error: unknown): DiagnosticIssue {
  return {
    area,
    message: getErrorMessage(error),
  };
}

async function withTimeout<T>(area: string, fallback: T, promise: Promise<T>, timeoutMs = RETRY_TIMEOUT_MS): Promise<DiagnosticResult<T>> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let timedOut = false;

  try {
    const value = await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timeout = setTimeout(() => {
          timedOut = true;
          resolve(fallback);
        }, timeoutMs);
      }),
    ]);

    if (timedOut) {
      return {
        ok: false,
        issue: timeoutIssue(area, timeoutMs),
        value: fallback,
      };
    }

    return {
      ok: true,
      value,
    };
  } catch (error) {
    return {
      ok: false,
      issue: errorIssue(area, error),
      value: fallback,
    };
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function redactRedisUrl(redisUrl: string) {
  try {
    const url = new URL(redisUrl);
    if (url.password) url.password = 'REDACTED';
    if (url.username) url.username = 'REDACTED';
    return url.toString();
  } catch {
    return redisUrl.replace(/\/\/([^:@/]+):([^@/]+)@/, '//REDACTED:REDACTED@');
  }
}

function cleanString(value: unknown, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function getQueueValue(request: NextRequest, bodyQueue?: unknown) {
  const bodyValue = cleanString(bodyQueue);
  if (bodyValue) return bodyValue;
  return cleanString(request.nextUrl.searchParams.get('queue'), 'all');
}

function matchesQueueValue(item: QueueRegistryItem, queueValue: string) {
  const normalized = queueValue.toLowerCase();
  return item.key === normalized || item.name.toLowerCase() === normalized || item.aliases.some((alias) => alias.toLowerCase() === normalized);
}

function getRequestedQueues(request: NextRequest, bodyQueue?: unknown) {
  const queueValue = getQueueValue(request, bodyQueue);

  if (queueValue.toLowerCase() === 'all') return RETRY_QUEUES;

  const matchedQueue = RETRY_QUEUES.find((item) => matchesQueueValue(item, queueValue));
  if (!matchedQueue) {
    throw new RetryRequestError(`Unsupported queue "${queueValue}". Use one of: ${SUPPORTED_QUEUE_VALUES.join(', ')}.`);
  }

  return [matchedQueue];
}

function parseBoolean(value: unknown) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return false;

  return ['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase());
}

function hasExplicitBoolean(value: unknown) {
  if (typeof value === 'boolean') return true;
  if (typeof value !== 'string') return false;

  return ['1', '0', 'true', 'false', 'yes', 'no', 'y', 'n'].includes(value.trim().toLowerCase());
}

function parseExplicitBoolean(value: unknown, fallback: boolean) {
  if (!hasExplicitBoolean(value)) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return fallback;

  return ['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase());
}

function parseDryRun(request: NextRequest, body: RetryRequestBody) {
  const queryDryRun = request.nextUrl.searchParams.get('dryRun');
  const queryExecute = request.nextUrl.searchParams.get('execute') || request.nextUrl.searchParams.get('live');

  if (hasExplicitBoolean(body.dryRun)) return parseExplicitBoolean(body.dryRun, true);
  if (hasExplicitBoolean(queryDryRun)) return parseExplicitBoolean(queryDryRun, true);
  if (parseBoolean(body.execute) || parseBoolean(queryExecute)) return false;

  return true;
}

function getLiveRetryIntent(request: NextRequest, body: RetryRequestBody) {
  const queryExecute = request.nextUrl.searchParams.get('execute') || request.nextUrl.searchParams.get('live');
  const queryDryRun = request.nextUrl.searchParams.get('dryRun');

  return parseBoolean(body.execute) || parseBoolean(queryExecute) || parseExplicitBoolean(body.dryRun, true) === false || parseExplicitBoolean(queryDryRun, true) === false;
}

function getAllowAllLiveRetry(request: NextRequest, body: RetryRequestBody) {
  const queryAllowAll = request.nextUrl.searchParams.get('allowAllLive') || request.nextUrl.searchParams.get('allowBroadLive');
  return parseBoolean(body.allowAllLive) || parseBoolean(queryAllowAll);
}

function parseLimit(request: NextRequest, bodyLimit?: unknown) {
  const rawValue = bodyLimit ?? request.nextUrl.searchParams.get('limit') ?? String(DEFAULT_RETRY_LIMIT);
  const parsed = Number(rawValue);

  if (!Number.isFinite(parsed)) return DEFAULT_RETRY_LIMIT;
  return Math.min(Math.max(Math.floor(parsed), 1), MAX_RETRY_LIMIT);
}

function parseJobIds(request: NextRequest, bodyJobId?: unknown) {
  const values = [
    ...(Array.isArray(bodyJobId) ? bodyJobId : [bodyJobId]),
    ...request.nextUrl.searchParams.getAll('jobId'),
    ...request.nextUrl.searchParams.getAll('jobIds'),
  ];
  const jobIds = values
    .flatMap((value) => (typeof value === 'string' ? value.split(',') : []))
    .map((value) => value.trim())
    .filter(Boolean);

  return Array.from(new Set(jobIds)).slice(0, MAX_JOB_IDS);
}

function toIsoDate(value: number | undefined | null) {
  return value ? new Date(value).toISOString() : null;
}

function getQueueHealth(counts: { active: number; delayed: number; failed: number; waiting: number }): Health {
  if (counts.failed > 0) return 'degraded';
  if (counts.active > 0 || counts.waiting > 0 || counts.delayed > 0) return 'busy';
  return 'healthy';
}

function getFallbackQueueStatus({ key, name }: QueueRegistryItem) {
  return {
    key,
    name,
    waiting: 0,
    active: 0,
    delayed: 0,
    failed: 0,
    completed: 0,
    paused: false,
    health: 'degraded' as Health,
  };
}

function getFallbackDeadLetterStatus() {
  return {
    name: DEAD_LETTER_QUEUE_NAME,
    waiting: 0,
    active: 0,
    delayed: 0,
    failed: 0,
    completed: 0,
    recent: [],
  };
}

function getFallbackRetryResult(item: QueueRegistryItem, dryRun: boolean, targeted: boolean): RetryQueueResult {
  return {
    key: item.key,
    name: item.name,
    inspected: 0,
    retryable: 0,
    retried: 0,
    skipped: 0,
    dryRun,
    targeted,
    jobs: [],
    errors: [],
  };
}

function buildRetryCommand(queue = 'mls-sync', options: { allowAllLive?: boolean; execute?: boolean; jobId?: string; limit?: number } = {}) {
  const params = new URLSearchParams({
    queue,
    dryRun: options.execute ? 'false' : 'true',
  });

  if (options.execute) params.set('execute', 'true');
  if (options.allowAllLive) params.set('allowAllLive', 'true');
  if (options.jobId) params.set('jobId', options.jobId);
  if (options.limit) params.set('limit', String(options.limit));

  return `curl -s -X POST "http://localhost:3000${ROUTE_PATH}?${params.toString()}"`;
}

function buildRetryCommandSet(queue = 'mls-sync', jobId = '<jobId>', limit?: number) {
  return {
    supabaseCheck: SUPABASE_CHECK_COMMAND,
    supabaseCheckJson: SUPABASE_CHECK_JSON_COMMAND,
    status: STATUS_COMMAND,
    retryStatus: `curl -s "http://localhost:3000${ROUTE_PATH}"`,
    deadLetter: DEAD_LETTER_COMMAND,
    queueDashboard: QUEUE_DASHBOARD_COMMAND,
    alertDryRun: ALERT_DRY_RUN_COMMAND,
    dryRunRetry: buildRetryCommand(queue, { jobId: jobId === '<jobId>' ? undefined : jobId, limit }),
    liveRetry: buildRetryCommand(queue, {
      execute: true,
      jobId: jobId === '<jobId>' ? undefined : jobId,
      limit,
    }),
    dryRunMlsSync: buildRetryCommand('mls-sync', { limit }),
    liveMlsSync: buildRetryCommand('mls-sync', { execute: true, limit }),
    dryRunMlsPage: buildRetryCommand('mls-page', { limit }),
    liveMlsPage: buildRetryCommand('mls-page', { execute: true, limit }),
    dryRunAlerts: buildRetryCommand('alerts', { limit }),
    liveAlerts: buildRetryCommand('alerts', { execute: true, limit }),
    dryRunListings: buildRetryCommand('listings', { limit }),
    liveListings: buildRetryCommand('listings', { execute: true, limit }),
    broadDryRun: buildRetryCommand('all', { limit }),
    broadLiveAllQueues: buildRetryCommand('all', {
      allowAllLive: true,
      execute: true,
      limit,
    }),
    targetedDryRunExample: buildRetryCommand(queue, { jobId }),
    targetedLiveExample: buildRetryCommand(queue, {
      execute: true,
      jobId,
    }),
  };
}

function isDatabaseConnectivityMessage(message: string | null | undefined) {
  const normalized = String(message || '').toLowerCase();
  return (
    normalized.includes('error querying the database') ||
    normalized.includes('tenant/user') ||
    normalized.includes('enotfound') ||
    normalized.includes('database preflight failed')
  );
}

function hasDatabaseConnectivityDiagnostics(diagnostics: DiagnosticIssue[]) {
  return diagnostics.some((diagnostic) => diagnostic.area.toLowerCase().includes('database') || isDatabaseConnectivityMessage(diagnostic.message));
}

function hasDatabaseConnectivityRetryJobs(results: RetryQueueResult[]) {
  return results.some((result) => result.jobs.some((job) => job.retryable && isDatabaseConnectivityMessage(job.failedReason)));
}

function buildStatusPlan(options: {
  diagnostics: DiagnosticIssue[];
  queues: Array<{ key: RetryQueueKey; name: string; failed: number; active: number; waiting: number; delayed: number }>;
  deadLetterOpen: number;
  recentFailedJobs: Array<{ key: RetryQueueKey; queue: string; id?: string; name: string; failedReason?: string | null }>;
}): RetryExecutionPlan {
  const failedQueues = options.queues.filter((queue) => queue.failed > 0);
  const busyQueues = options.queues.filter((queue) => queue.active > 0 || queue.waiting > 0 || queue.delayed > 0);
  const firstFailedQueue = failedQueues[0]?.name || options.recentFailedJobs[0]?.queue || 'mls-sync';
  const hasDatabaseFailures =
    hasDatabaseConnectivityDiagnostics(options.diagnostics) ||
    options.recentFailedJobs.some((job) => isDatabaseConnectivityMessage(job.failedReason));
  const gates: RetryExecutionPlan['gates'] = [
    {
      label: 'Diagnostics',
      status: options.diagnostics.length > 0 ? 'fail' : 'pass',
      detail: options.diagnostics.length > 0 ? `${options.diagnostics.length} retry status diagnostic issue(s) detected.` : 'Retry status reads are clean.',
    },
    {
      label: 'Failed Jobs',
      status: failedQueues.length > 0 ? 'watch' : 'pass',
      detail: failedQueues.length > 0 ? `${failedQueues.length} queue(s) currently report failed jobs.` : 'No failed queue jobs reported by BullMQ.',
    },
    {
      label: 'Dead Letter',
      status: options.deadLetterOpen > 0 ? 'fail' : 'pass',
      detail: options.deadLetterOpen > 0 ? `${options.deadLetterOpen} dead-letter record(s) should be inspected first.` : 'No open dead-letter records reported.',
    },
    {
      label: 'Active Work',
      status: busyQueues.length > 0 ? 'watch' : 'pass',
      detail: busyQueues.length > 0 ? `${busyQueues.length} queue(s) have active, waiting, or delayed work.` : 'Queues are idle enough for a bounded dry-run retry.',
    },
  ];

  if (options.deadLetterOpen > 0) {
    return {
      level: 'blocked',
      summary: 'Dead-letter records exist; inspect them before retrying source jobs.',
      nextAction: 'Inspect open dead-letter records.',
      terminal: TERMINAL_5,
      nextCommand: DEAD_LETTER_COMMAND,
      liveRetryAllowed: false,
      gates,
    };
  }

  if (options.diagnostics.length > 0) {
    if (hasDatabaseFailures) {
      return {
        level: 'blocked',
        summary: 'Retry diagnostics include database connectivity failures; resolve Supabase before retrying queue jobs.',
        nextAction: 'Run the Supabase preflight JSON report and follow the recovery runbook.',
        terminal: TERMINAL_5,
        nextCommand: SUPABASE_CHECK_JSON_COMMAND,
        liveRetryAllowed: false,
        gates,
      };
    }

    return {
      level: 'blocked',
      summary: 'Retry diagnostics are not clean enough for live recovery.',
      nextAction: 'Refresh retry status and clear diagnostics.',
      terminal: TERMINAL_5,
      nextCommand: `curl -s "http://localhost:3000${ROUTE_PATH}"`,
      liveRetryAllowed: false,
      gates,
    };
  }

  if (failedQueues.length > 0) {
    if (hasDatabaseFailures) {
      return {
        level: 'blocked',
        summary: 'Failed queue jobs are from database connectivity; resolve Supabase before retrying.',
        nextAction: 'Run the Supabase preflight JSON report and follow the recovery runbook.',
        terminal: TERMINAL_5,
        nextCommand: SUPABASE_CHECK_JSON_COMMAND,
        liveRetryAllowed: false,
        gates,
      };
    }

    return {
      level: 'caution',
      summary: 'Failed jobs are available for dry-run retry inspection.',
      nextAction: 'Run a dry-run retry against the first failed queue.',
      terminal: TERMINAL_5,
      nextCommand: buildRetryCommand(firstFailedQueue, { limit: 10 }),
      liveRetryAllowed: true,
      gates,
    };
  }

  return {
    level: busyQueues.length > 0 ? 'caution' : 'safe',
    summary: busyQueues.length > 0 ? 'Retry route is available, but queues still have pending work.' : 'Retry route is ready; dry-run is the default.',
    nextAction: busyQueues.length > 0 ? 'Review queue dashboard before live retry.' : 'Use retry status or queue dashboard before live recovery.',
    terminal: TERMINAL_5,
    nextCommand: busyQueues.length > 0 ? QUEUE_DASHBOARD_COMMAND : `curl -s "http://localhost:3000${ROUTE_PATH}"`,
    liveRetryAllowed: false,
    gates,
  };
}

function buildPostPlan(options: {
  dryRun: boolean;
  liveRetryRequested: boolean;
  allowAllLive: boolean;
  requestedQueues: QueueRegistryItem[];
  queueResults: RetryQueueResult[];
  diagnostics: DiagnosticIssue[];
  limit: number;
  jobIds: string[];
  commandQueue: string;
}): RetryExecutionPlan {
  const totalRetryable = options.queueResults.reduce((sum, result) => sum + result.retryable, 0);
  const totalRetried = options.queueResults.reduce((sum, result) => sum + result.retried, 0);
  const totalErrors = options.queueResults.reduce((sum, result) => sum + result.errors.length, 0);
  const totalSkipped = options.queueResults.reduce((sum, result) => sum + result.skipped, 0);
  const broadLive = options.liveRetryRequested && options.requestedQueues.length > 1;
  const hasDatabaseFailures = hasDatabaseConnectivityDiagnostics(options.diagnostics) || hasDatabaseConnectivityRetryJobs(options.queueResults);
  const gates: RetryExecutionPlan['gates'] = [
    {
      label: 'Mode',
      status: options.dryRun ? 'pass' : 'watch',
      detail: options.dryRun ? 'Dry-run only; no jobs were retried.' : 'Live retry mode was requested.',
    },
    {
      label: 'Scope',
      status: broadLive && !options.allowAllLive ? 'fail' : broadLive ? 'watch' : 'pass',
      detail:
        options.requestedQueues.length === 1
          ? `Single queue scope: ${options.requestedQueues[0].name}.`
          : `${options.requestedQueues.length} queue(s) selected${options.allowAllLive ? ' with explicit broad live allowance.' : '.'}`,
    },
    {
      label: 'Retryable Jobs',
      status: totalRetryable > 0 ? 'watch' : 'pass',
      detail: `${totalRetryable} retryable, ${totalSkipped} skipped.`,
    },
    {
      label: 'Errors',
      status: options.diagnostics.length > 0 || totalErrors > 0 ? 'fail' : 'pass',
      detail: `${options.diagnostics.length} diagnostic issue(s), ${totalErrors} job error(s).`,
    },
  ];

  if (options.diagnostics.length > 0 || totalErrors > 0) {
    if (hasDatabaseFailures) {
      return {
        level: 'blocked',
        summary: 'Retry request found database connectivity failures; resolve Supabase before retrying queue jobs.',
        nextAction: 'Run the Supabase preflight JSON report and follow the recovery runbook.',
        terminal: TERMINAL_5,
        nextCommand: SUPABASE_CHECK_JSON_COMMAND,
        liveRetryAllowed: false,
        gates,
      };
    }

    return {
      level: 'blocked',
      summary: 'Retry request completed with diagnostics or job errors.',
      nextAction: 'Inspect retry status before another attempt.',
      terminal: TERMINAL_5,
      nextCommand: `curl -s "http://localhost:3000${ROUTE_PATH}"`,
      liveRetryAllowed: false,
      gates,
    };
  }

  if (options.dryRun && totalRetryable > 0) {
    if (hasDatabaseFailures) {
      return {
        level: 'blocked',
        summary: 'Dry-run found retryable jobs failed by database connectivity; do not live retry until Supabase passes.',
        nextAction: 'Run the Supabase preflight JSON report and follow the recovery runbook.',
        terminal: TERMINAL_5,
        nextCommand: SUPABASE_CHECK_JSON_COMMAND,
        liveRetryAllowed: false,
        gates,
      };
    }

    return {
      level: 'caution',
      summary: 'Dry-run found retryable jobs; live retry can be run intentionally for the same scope.',
      nextAction: 'Run live retry only after confirming the dry-run result.',
      terminal: TERMINAL_5,
      nextCommand: buildRetryCommand(options.commandQueue, {
        execute: true,
        jobId: options.jobIds[0],
        limit: options.limit,
        allowAllLive: options.requestedQueues.length > 1,
      }),
      liveRetryAllowed: true,
      gates,
    };
  }

  if (!options.dryRun) {
    return {
      level: totalRetried > 0 ? 'caution' : 'safe',
      summary: `${totalRetried} job(s) were retried.`,
      nextAction: 'Refresh MLS status and retry status.',
      terminal: TERMINAL_5,
      nextCommand: STATUS_COMMAND,
      liveRetryAllowed: false,
      gates,
    };
  }

  return {
    level: 'safe',
    summary: 'Dry-run completed with no retryable jobs.',
    nextAction: 'Refresh retry status when more queue activity appears.',
    terminal: TERMINAL_5,
    nextCommand: `curl -s "http://localhost:3000${ROUTE_PATH}"`,
    liveRetryAllowed: false,
    gates,
  };
}

async function readJsonBody(request: NextRequest): Promise<RetryRequestBody> {
  return (await request.json().catch(() => ({}))) as RetryRequestBody;
}

async function getQueueStatus(item: QueueRegistryItem) {
  const { key, name, queue } = item;
  const [waiting, active, delayed, failed, completed, paused] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getDelayedCount(),
    queue.getFailedCount(),
    queue.getCompletedCount(),
    queue.isPaused(),
  ]);

  return {
    key,
    name,
    waiting,
    active,
    delayed,
    failed,
    completed,
    paused,
    health: getQueueHealth({ waiting, active, delayed, failed }),
  };
}

async function getQueueStatuses() {
  const results = await Promise.all(
    RETRY_QUEUES.map((item) => withTimeout(`retryStatus:${item.key}`, getFallbackQueueStatus(item), getQueueStatus(item))),
  );

  return {
    queues: results.map((result) => result.value),
    diagnostics: results.flatMap((result) => (result.ok ? [] : [result.issue])),
  };
}

async function getRecentFailedJobs({ key, name, queue }: QueueRegistryItem) {
  const jobs = await queue.getFailed(0, 4);

  return jobs.map((job) => ({
    key,
    queue: name,
    id: job.id,
    name: job.name,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason || null,
    finishedOn: toIsoDate(job.finishedOn),
    dryRunRetryCommand: buildRetryCommand(name, { jobId: job.id }),
    liveRetryCommand: buildRetryCommand(name, { execute: true, jobId: job.id }),
  }));
}

async function getRecentFailedJobsStatus() {
  const fallback: Awaited<ReturnType<typeof getRecentFailedJobs>> = [];
  const results = await Promise.all(
    RETRY_QUEUES.map((item) => withTimeout(`retryRecentFailed:${item.key}`, fallback, getRecentFailedJobs(item))),
  );

  return {
    recentFailedJobs: results.flatMap((result) => result.value),
    diagnostics: results.flatMap((result) => (result.ok ? [] : [result.issue])),
  };
}

async function getDeadLetterStatus() {
  const [waiting, active, delayed, failed, completed, recent] = await Promise.all([
    deadLetterQueue.getWaitingCount(),
    deadLetterQueue.getActiveCount(),
    deadLetterQueue.getDelayedCount(),
    deadLetterQueue.getFailedCount(),
    deadLetterQueue.getCompletedCount(),
    deadLetterQueue.getJobs(['waiting', 'delayed', 'failed'], 0, 9),
  ]);

  return {
    name: DEAD_LETTER_QUEUE_NAME,
    waiting,
    active,
    delayed,
    failed,
    completed,
    recent: recent.map((job) => ({
      id: job.id,
      name: job.name,
      failedReason: job.data?.failedReason || job.failedReason || null,
      sourceQueue: job.data?.sourceQueue || null,
      sourceJobId: job.data?.sourceJobId || null,
      failedAt: job.data?.failedAt || null,
      attemptsMade: job.data?.attemptsMade || null,
    })),
  };
}

async function summarizeRetryJob(job: Awaited<ReturnType<Queue['getJob']>> | null): Promise<RetryJobSummary | null> {
  if (!job) return null;

  const state = await job.getState().catch(() => 'unknown');
  const retryable = state === 'failed';

  return {
    id: job.id,
    name: job.name,
    state,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason || null,
    finishedOn: toIsoDate(job.finishedOn),
    retryable,
    skippedReason: retryable ? null : `Job is ${state}, not failed.`,
    action: retryable ? 'would_retry' : 'skipped',
  };
}

async function getRetryCandidateJobs(item: QueueRegistryItem, limit: number, jobIds: string[]) {
  if (jobIds.length > 0) {
    const jobs = await Promise.all(jobIds.map((jobId) => item.queue.getJob(jobId)));
    return jobs.filter((job): job is NonNullable<typeof job> => Boolean(job));
  }

  return item.queue.getFailed(0, limit - 1);
}

async function retryFailedJobs(item: QueueRegistryItem, limit: number, dryRun: boolean, jobIds: string[]): Promise<RetryQueueResult> {
  const candidateJobs = await getRetryCandidateJobs(item, limit, jobIds);
  const errors: Array<{ jobId?: string; error: string }> = [];
  let retried = 0;
  let retryable = 0;
  let skipped = 0;
  const jobs: RetryJobSummary[] = [];

  for (const job of candidateJobs) {
    const summary = await summarizeRetryJob(job);
    if (!summary) continue;

    jobs.push(summary);

    if (summary.retryable) {
      retryable++;
    } else {
      skipped++;
    }

    if (dryRun || !summary.retryable) continue;

    try {
      await job.retry();
      summary.action = 'retried';
      retried++;
    } catch (error) {
      summary.action = 'error';
      errors.push({
        jobId: job.id,
        error: getErrorMessage(error),
      });
    }
  }

  for (const jobId of jobIds) {
    if (!candidateJobs.some((job) => job.id === jobId)) {
      errors.push({
        jobId,
        error: 'Job was not found in this queue.',
      });
    }
  }

  return {
    key: item.key,
    name: item.name,
    inspected: candidateJobs.length,
    retryable,
    retried,
    skipped,
    dryRun,
    targeted: jobIds.length > 0,
    jobs,
    errors,
  };
}

async function retryQueueWithDiagnostics(item: QueueRegistryItem, limit: number, dryRun: boolean, jobIds: string[]) {
  const fallback = getFallbackRetryResult(item, dryRun, jobIds.length > 0);
  const result = await withTimeout(`retry:${item.key}`, fallback, retryFailedJobs(item, limit, dryRun, jobIds), RETRY_TIMEOUT_MS);

  return {
    result: result.value,
    diagnostics: result.ok ? [] : [result.issue],
  };
}

function unauthorizedResponse() {
  return json(
    {
      success: false,
      error: 'Admin access is required.',
      auth: {
        configured: Boolean(getAdminKey()),
      },
    },
    { status: 401 },
  );
}

export async function GET(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return unauthorizedResponse();
  }

  const [queueStatus, deadLetterStatus, recentFailedJobsStatus] = await Promise.all([
    getQueueStatuses(),
    withTimeout('retryDeadLetter', getFallbackDeadLetterStatus(), getDeadLetterStatus()),
    getRecentFailedJobsStatus(),
  ]);
  const diagnostics = [
    ...queueStatus.diagnostics,
    ...(deadLetterStatus.ok ? [] : [deadLetterStatus.issue]),
    ...recentFailedJobsStatus.diagnostics,
  ];
  const deadLetterOpen = deadLetterStatus.value.waiting + deadLetterStatus.value.active + deadLetterStatus.value.delayed + deadLetterStatus.value.failed;

  return json(
    {
      success: true,
      module: 'REIE MLS Queue Retry',
      generatedAt: new Date().toISOString(),
      timeoutMs: RETRY_TIMEOUT_MS,
      redis: {
        url: redactRedisUrl(getRedisUrl()),
      },
      auth: {
        configured: Boolean(getAdminKey()),
      },
      defaults: {
        dryRun: true,
        liveRetryRequires: 'POST with execute=true or dryRun=false',
        broadLiveRetryRequires: 'A single queue is required for live retry unless allowAllLive=true is supplied.',
        terminal: TERMINAL_5,
      },
      terminals: {
        scriptsAndCurl: TERMINAL_5,
        statusChecks: TERMINAL_5,
      },
      commands: {
        ...buildRetryCommandSet(),
      },
      diagnostics,
      executionPlan: buildStatusPlan({
        diagnostics,
        queues: queueStatus.queues,
        deadLetterOpen,
        recentFailedJobs: recentFailedJobsStatus.recentFailedJobs,
      }),
      supportedQueues: SUPPORTED_QUEUE_VALUES,
      queues: queueStatus.queues,
      deadLetter: deadLetterStatus.value,
      recentFailedJobs: recentFailedJobsStatus.recentFailedJobs,
    },
  );
}

export async function POST(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await readJsonBody(request);
    const requestedQueues = getRequestedQueues(request, body.queue);
    const limit = parseLimit(request, body.limit);
    const jobIds = parseJobIds(request, body.jobId);
    const dryRun = parseDryRun(request, body);
    const liveRetryRequested = getLiveRetryIntent(request, body);
    const allowAllLive = getAllowAllLiveRetry(request, body);
    const queueResults = [];
    const diagnostics = [];

    if (jobIds.length > 0 && requestedQueues.length !== 1) {
      throw new RetryRequestError('Targeted jobId retry requires a single queue value.');
    }

    if (liveRetryRequested && requestedQueues.length > 1 && !allowAllLive) {
      throw new RetryRequestError('Broad live retry across all queues requires a single queue value or allowAllLive=true.');
    }

    if (!dryRun) {
      await assertAppDatabaseReady({
        operation: 'queue live retry API',
        recoveryCommand: SUPABASE_CHECK_JSON_COMMAND,
      });
    }

    for (const queue of requestedQueues) {
      const queueResult = await retryQueueWithDiagnostics(queue, limit, dryRun, jobIds);
      queueResults.push(queueResult.result);
      diagnostics.push(...queueResult.diagnostics);
    }

    const totalInspected = queueResults.reduce((sum, result) => sum + result.inspected, 0);
    const totalRetryable = queueResults.reduce((sum, result) => sum + result.retryable, 0);
    const totalRetried = queueResults.reduce((sum, result) => sum + result.retried, 0);
    const totalSkipped = queueResults.reduce((sum, result) => sum + result.skipped, 0);
    const totalErrors = queueResults.reduce((sum, result) => sum + result.errors.length, 0);
    const commandQueue = request.nextUrl.searchParams.get('queue') || cleanString(body.queue, 'all');
    const commandJobId = jobIds[0] || '<jobId>';
    const executionPlan = buildPostPlan({
      dryRun,
      liveRetryRequested,
      allowAllLive,
      requestedQueues,
      queueResults,
      diagnostics,
      limit,
      jobIds,
      commandQueue,
    });

    return json(
      {
        success: diagnostics.length === 0 && totalErrors === 0,
        module: 'REIE MLS Queue Retry',
        generatedAt: new Date().toISOString(),
        dryRun,
        liveRetryRequested,
        limit,
        jobIds,
        timeoutMs: RETRY_TIMEOUT_MS,
        terminal: TERMINAL_5,
        terminals: {
          scriptsAndCurl: TERMINAL_5,
          statusChecks: TERMINAL_5,
        },
        diagnostics,
        inspected: totalInspected,
        retryable: totalRetryable,
        retried: totalRetried,
        skipped: totalSkipped,
        errors: totalErrors,
        allowAllLive,
        executionPlan,
        commands: {
          ...buildRetryCommandSet(commandQueue, commandJobId, limit),
          repeatDryRun: buildRetryCommand(request.nextUrl.searchParams.get('queue') || cleanString(body.queue, 'all'), {
            jobId: jobIds[0],
            limit,
          }),
          liveRetry: buildRetryCommand(request.nextUrl.searchParams.get('queue') || cleanString(body.queue, 'all'), {
            execute: true,
            jobId: jobIds[0],
            limit,
          }),
        },
        results: queueResults,
        liveRetryRequires: 'execute=true or dryRun=false',
        broadLiveRetryRequires: 'Use a single queue for live retry, or pass allowAllLive=true intentionally.',
      },
    );
  } catch (error: unknown) {
    const status = error instanceof RetryRequestError ? error.status : 500;
    const message = getErrorMessage(error);

    console.error('MLS retry failed:', message);

    return json(
      {
        success: false,
        error: message,
        diagnostics: [
          {
            area: 'retry',
            message,
          },
        ],
        supportedQueues: SUPPORTED_QUEUE_VALUES,
        commands: buildRetryCommandSet(),
      },
      { status },
    );
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/retry/route.ts
