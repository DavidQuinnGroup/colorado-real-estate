import { Prisma } from '@prisma/client';
import { Queue } from 'bullmq';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { ALERT_QUEUE_NAME, alertQueue } from '@/lib/queue/alertQueue';
import { DEAD_LETTER_QUEUE_NAME, deadLetterQueue } from '@/lib/queue/deadLetterQueue';
import { LISTING_QUEUE_NAME, listingQueue } from '@/lib/queue/listingQueue';
import { MLS_PAGE_QUEUE_NAME, mlsPageQueue } from '@/lib/queue/mlsPageQueue';
import {
  MLS_SYNC_DEFAULT_MAX_PAGES,
  MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS,
  MLS_SYNC_DEFAULT_PAGE_SIZE,
  MLS_SYNC_MAX_PAGE_TIMEOUT_MS,
  MLS_SYNC_QUEUE_NAME,
  mlsQueue,
} from '@/lib/queue/mlsQueue';
import { getRedisUrl } from '@/lib/queue/redis';

export const dynamic = 'force-dynamic';

type Health = 'healthy' | 'busy' | 'degraded';

type StatusUpdateBody = {
  mlsId?: string;
  newStatus?: string;
  priceChange?: number;
};

type QueueStatusItem = {
  name: string;
  waiting: number;
  active: number;
  delayed: number;
  failed: number;
  completed: number;
  paused: boolean;
  health: Health;
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

type RecentCompletedJob = {
  queue: string;
  id?: string;
  name: string;
  finishedOn: string | null;
  returnvalue: unknown;
};

type MlsSyncStateStatus = {
  id: number;
  lastSync: Date | string | null;
  lastIntelligenceSync: Date | string | null;
  lastPage: number;
  totalRecords: number;
  isSyncing: boolean;
};

type PropertyFreshness = {
  total: number;
  active: number;
  stale: number;
  privateExclusive: number;
  stalePercent: number;
  latest: {
    id: string;
    mlsId: string;
    slug: string | null;
    address: string;
    city: string;
    status: string;
    lastIntelligenceSync: Date | string | null;
  } | null;
  latestMinutesAgo: number | null;
  newest: {
    id: string;
    mlsId: string;
    slug: string | null;
    address: string;
    city: string;
    status: string;
    createdAt: Date | string | null;
  } | null;
  newestMinutesAgo: number | null;
  staleThresholdHours: number;
  freshnessField: 'lastIntelligenceSync' | 'updatedAt';
};

type SearchIndexStatus = {
  checkedJobs: number;
  attempted: number;
  succeeded: number;
  failed: number;
  unattempted: number;
  unknown: number;
  health: Health;
  diagnostics: DiagnosticIssue[];
  recent: Array<{
    queue: string;
    id?: string;
    name: string;
    finishedOn: string | null;
    attempted: number | null;
    succeeded: number | null;
    failed: number | null;
    processed: number | null;
    indexed: boolean | null;
    error: string | null;
  }>;
};

type OperationalReadiness = {
  level: 'ready' | 'watch' | 'blocked';
  summary: string;
  nextAction: string;
  nextTerminal: 'Terminal 3' | 'Terminal 5';
  nextCommand: string;
  gates: Array<{
    label: string;
    status: 'pass' | 'watch' | 'fail';
    detail: string;
  }>;
};

const STATUS_TIMEOUT_MS = 4_000;
const STALE_PROPERTY_HOURS = 24;
const TERMINAL_3_WORKER_COMMAND = 'npm run run:worker:mls';
const TERMINAL_5_SMOKE_OPS_COMMAND = 'npm run smoke:ops';
const TERMINAL_5_SMOKE_MLS_STATUS_COMMAND = 'npm run smoke:mls-status';
const TERMINAL_5_SMOKE_SEARCH_COMMAND = 'npm run smoke:search';
const TERMINAL_5_SUPABASE_CHECK_COMMAND = 'npm run supabase:check';
const TERMINAL_5_SUPABASE_CHECK_JSON_COMMAND = 'npm run supabase:check:json';
const TERMINAL_5_STATUS_COMMAND = 'curl -s "http://localhost:3000/api/mls/status"';
const TERMINAL_5_SEARCH_CHECK_COMMAND = 'curl -s "http://localhost:3000/api/search?limit=5"';
const TERMINAL_5_RETRY_STATUS_COMMAND = 'curl -s "http://localhost:3000/api/mls/retry"';
const TERMINAL_5_DEAD_LETTER_COMMAND = 'curl -s "http://localhost:3000/api/admin/dead-letter?limit=25"';
const TERMINAL_5_DEAD_LETTER_OPEN_COMMAND = 'curl -s "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"';
const TERMINAL_5_DEAD_LETTER_FAILED_COMMAND = 'curl -s "http://localhost:3000/api/admin/dead-letter?state=failed&limit=25"';
const TERMINAL_5_QUEUE_DASHBOARD_COMMAND = 'npm run run:queue-dashboard';
const TERMINAL_5_ALERT_DRY_RUN_COMMAND = 'curl -s -X POST "http://localhost:3000/api/process-alerts?dryRun=true&limit=25"';

const STATUS_QUEUES: Array<{ name: string; queue: Queue }> = [
  { name: MLS_SYNC_QUEUE_NAME, queue: mlsQueue },
  { name: MLS_PAGE_QUEUE_NAME, queue: mlsPageQueue },
  { name: LISTING_QUEUE_NAME, queue: listingQueue },
  { name: ALERT_QUEUE_NAME, queue: alertQueue },
];

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

function getPublicBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://davidquinngroup.com';
  return configuredUrl.replace(/\/+$/, '');
}

function getPropertyUrl(identity: string) {
  return `${getPublicBaseUrl()}/properties/${encodeURIComponent(identity)}`;
}

function buildRetryCommand(queueName: string, options: { execute?: boolean; jobId?: string; limit?: number } = {}) {
  const params = new URLSearchParams({
    queue: queueName,
    dryRun: options.execute ? 'false' : 'true',
  });

  if (options.execute) params.set('execute', 'true');
  if (options.jobId) params.set('jobId', options.jobId);
  if (options.limit) params.set('limit', String(options.limit));

  return `curl -s -X POST "http://localhost:3000/api/mls/retry?${params.toString()}"`;
}

function buildDeadLetterSourceQueueCommand(sourceQueue = MLS_SYNC_QUEUE_NAME) {
  const params = new URLSearchParams({
    sourceQueue,
    states: 'waiting,delayed,failed',
    limit: '25',
  });

  return `curl -s "http://localhost:3000/api/admin/dead-letter?${params.toString()}"`;
}

function buildSyncDryRunCommand() {
  const params = new URLSearchParams({
    dryRun: 'true',
    maxPages: String(MLS_SYNC_DEFAULT_MAX_PAGES),
    pageSize: String(Math.min(MLS_SYNC_DEFAULT_PAGE_SIZE, 5)),
    startPage: '0',
    pageTimeoutMs: String(MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS),
  });

  return `curl -s -X POST "http://localhost:3000/api/mls/sync?${params.toString()}"`;
}

function buildSyncLiveCommand(force = false) {
  const params = new URLSearchParams({
    execute: 'true',
    maxPages: String(MLS_SYNC_DEFAULT_MAX_PAGES),
    pageSize: String(Math.min(MLS_SYNC_DEFAULT_PAGE_SIZE, 5)),
    startPage: '0',
    pageTimeoutMs: String(MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS),
  });

  if (force) params.set('force', 'true');

  return `curl -s -X POST "http://localhost:3000/api/mls/sync?${params.toString()}"`;
}

function minutesSince(value: Date | string | null | undefined) {
  if (!value) return null;

  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return null;

  return Math.max(0, Math.round((Date.now() - timestamp) / 60000));
}

function toIsoDate(value: number | undefined | null) {
  return value ? new Date(value).toISOString() : null;
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
  return String(error || 'Unknown status read failure.');
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

async function withTimeout<T>(area: string, fallback: T, promise: Promise<T>, timeoutMs = STATUS_TIMEOUT_MS): Promise<DiagnosticResult<T>> {
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

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      ...(init?.headers || {}),
    },
  });
}

function unauthorizedResponse() {
  return json(
    {
      success: false,
      error: 'Admin access is required.',
    },
    { status: 401 },
  );
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

function getQueueHealth(counts: Pick<QueueStatusItem, 'active' | 'delayed' | 'failed' | 'waiting'>) {
  if (counts.failed > 0) return 'degraded';
  if (counts.active > 0 || counts.waiting > 0 || counts.delayed > 0) return 'busy';
  return 'healthy';
}

function isDatabaseConnectivityMessage(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes('error querying the database') ||
    normalized.includes('tenant/user') ||
    normalized.includes('enotfound') ||
    normalized.includes('database preflight failed')
  );
}

function hasDatabaseConnectivityDiagnostics(diagnostics: DiagnosticIssue[]) {
  return diagnostics.some((diagnostic) => diagnostic.area.startsWith('database:') || isDatabaseConnectivityMessage(diagnostic.message));
}

function getFallbackQueueStatus(name: string): QueueStatusItem {
  return {
    name,
    waiting: 0,
    active: 0,
    delayed: 0,
    failed: 0,
    completed: 0,
    paused: false,
    health: 'degraded',
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
    paused: false,
    totalOpen: 0,
    recent: [],
  };
}

function getFallbackPropertyFreshness() {
  return {
    total: 0,
    active: 0,
    stale: 0,
    privateExclusive: 0,
    stalePercent: 0,
    latest: null,
    latestMinutesAgo: null,
    newest: null,
    newestMinutesAgo: null,
    staleThresholdHours: STALE_PROPERTY_HOURS,
    freshnessField: 'lastIntelligenceSync' as const,
  };
}

function getOverallHealth(queues: QueueStatusItem[], deadLetterOpen: number, isSyncing: boolean, issues: DiagnosticIssue[]): Health {
  if (issues.length > 0 || deadLetterOpen > 0 || queues.some((queue) => queue.health === 'degraded')) return 'degraded';
  if (isSyncing || queues.some((queue) => queue.health === 'busy')) return 'busy';
  return 'healthy';
}

function getReturnValueField(returnvalue: unknown, key: string) {
  if (!returnvalue || typeof returnvalue !== 'object' || Array.isArray(returnvalue)) return undefined;
  return (returnvalue as Record<string, unknown>)[key];
}

function getOptionalReturnValueNumber(returnvalue: unknown, key: string) {
  const value = getReturnValueField(returnvalue, key);
  if (value === undefined || value === null || value === '') return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getReturnValueString(returnvalue: unknown, key: string) {
  const value = getReturnValueField(returnvalue, key);
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function getCompletedJobIndexStatus(jobs: RecentCompletedJob[]): SearchIndexStatus {
  const recent = jobs.map((job) => {
    const attempted =
      getOptionalReturnValueNumber(job.returnvalue, 'indexAttempted') ??
      getOptionalReturnValueNumber(job.returnvalue, 'searchIndexAttempted');
    const succeeded =
      getOptionalReturnValueNumber(job.returnvalue, 'indexSucceeded') ??
      getOptionalReturnValueNumber(job.returnvalue, 'searchIndexSucceeded');
    const failed = getOptionalReturnValueNumber(job.returnvalue, 'indexFailed') ?? getOptionalReturnValueNumber(job.returnvalue, 'searchIndexFailed');
    const processed = getOptionalReturnValueNumber(job.returnvalue, 'processed') ?? getOptionalReturnValueNumber(job.returnvalue, 'succeeded');
    const indexedValue = getReturnValueField(job.returnvalue, 'searchIndexIndexed');
    const indexed = typeof indexedValue === 'boolean' ? indexedValue : null;
    const error = getReturnValueString(job.returnvalue, 'searchIndexError');

    return {
      queue: job.queue,
      id: job.id,
      name: job.name,
      finishedOn: job.finishedOn,
      attempted,
      succeeded,
      failed,
      processed,
      indexed,
      error,
    };
  });

  const attempted = recent.reduce((total, job) => total + (job.attempted ?? (job.indexed !== null ? 1 : 0)), 0);
  const succeeded = recent.reduce((total, job) => total + (job.succeeded ?? (job.indexed === true ? 1 : 0)), 0);
  const failed = recent.reduce((total, job) => total + (job.failed ?? (job.indexed === false ? 1 : 0)), 0);
  const unattempted = recent.filter((job) => job.attempted === 0 && (job.processed ?? 0) > 0).length;
  const unknown = recent.filter((job) => job.attempted === null && job.succeeded === null && job.failed === null && job.indexed === null).length;

  const diagnostics = recent.flatMap((job) => {
    const failures = job.failed ?? (job.indexed === false ? 1 : 0);

    if (failures > 0) {
      return [
        {
          area: `searchIndex:${job.queue}`,
          message: `Recent completed job ${job.id || job.name} reported ${failures} search index failure(s)${
            job.error ? `: ${job.error}` : '.'
          }`,
        },
      ];
    }

    if (job.attempted === 0 && (job.processed ?? 0) > 0) {
      return [
        {
          area: `searchIndex:${job.queue}`,
          message: `Recent completed job ${job.id || job.name} did not attempt a search-index update.`,
        },
      ];
    }

    return [];
  });

  return {
    checkedJobs: recent.length,
    attempted,
    succeeded,
    failed,
    unattempted,
    unknown,
    health: diagnostics.length > 0 ? 'degraded' : unknown === recent.length && recent.length > 0 ? 'busy' : 'healthy',
    diagnostics,
    recent,
  };
}

function buildRecommendations(options: {
  queues: QueueStatusItem[];
  deadLetterOpen: number;
  diagnostics: DiagnosticIssue[];
  propertyFreshness: PropertyFreshness;
  searchIndex: SearchIndexStatus;
  isSyncing: boolean;
}) {
  const recommendations: string[] = [];
  const hasDatabaseDiagnostics = hasDatabaseConnectivityDiagnostics(options.diagnostics);

  if (hasDatabaseDiagnostics) {
    recommendations.push(`Resolve Supabase connectivity before starting or retrying ingestion work: ${TERMINAL_5_SUPABASE_CHECK_JSON_COMMAND}`);
  } else if (options.diagnostics.length > 0) {
    recommendations.push('Resolve diagnostics before starting or retrying ingestion work.');
  }

  if (options.deadLetterOpen > 0) {
    recommendations.push(`Inspect dead-letter records before retrying jobs: ${TERMINAL_5_DEAD_LETTER_COMMAND}`);
  }

  const failedQueues = options.queues.filter((queue) => queue.failed > 0);
  if (failedQueues.length > 0) {
    recommendations.push(
      `Run a Terminal 5 dry-run retry before live retrying failed queue(s): ${failedQueues
        .map((queue) => buildRetryCommand(queue.name))
        .join(' ; ')}`,
    );
  }

  if (options.propertyFreshness.freshnessField === 'updatedAt') {
    recommendations.push('Database is missing lastIntelligenceSync columns; freshness is falling back to updatedAt until migrations are applied.');
  }

  if (options.propertyFreshness.stalePercent >= 25) {
    recommendations.push(`Inventory freshness is degraded; preview a bounded MLS sync before live ingestion: ${buildSyncDryRunCommand()}`);
  }

  if (options.searchIndex.failed > 0 || options.searchIndex.unattempted > 0) {
    recommendations.push(`Resolve search-index diagnostics before increasing MLS volume. Verify search metadata from Terminal 5: ${TERMINAL_5_SMOKE_SEARCH_COMMAND}`);
  }

  if (options.searchIndex.checkedJobs > 0 && options.searchIndex.unknown === options.searchIndex.checkedJobs) {
    recommendations.push('Recent completed jobs do not expose search-index counters yet; confirm worker output is rebuilt and current.');
  }

  if (options.isSyncing) {
    recommendations.push(`MLS sync is active; avoid launching overlapping broad sync jobs. Terminal 3 worker command: ${TERMINAL_3_WORKER_COMMAND}`);
  }

  if (recommendations.length === 0) {
    recommendations.push('No immediate recovery action required.');
  }

  return recommendations;
}

function buildOperationalReadiness(options: {
  queues: QueueStatusItem[];
  deadLetterOpen: number;
  diagnostics: DiagnosticIssue[];
  propertyFreshness: PropertyFreshness;
  searchIndex: SearchIndexStatus;
  isSyncing: boolean;
}): OperationalReadiness {
  const failedQueues = options.queues.filter((queue) => queue.failed > 0);
  const busyQueues = options.queues.filter((queue) => queue.active > 0 || queue.waiting > 0 || queue.delayed > 0);
  const hasDatabaseDiagnostics = hasDatabaseConnectivityDiagnostics(options.diagnostics);
  const staleStatus = options.propertyFreshness.stalePercent >= 25 ? 'fail' : options.propertyFreshness.stalePercent > 0 ? 'watch' : 'pass';
  const searchStatus =
    options.searchIndex.failed > 0 || options.searchIndex.unattempted > 0
      ? 'fail'
      : options.searchIndex.unknown > 0
        ? 'watch'
        : 'pass';
  const queueStatus = failedQueues.length > 0 ? 'fail' : busyQueues.length > 0 || options.isSyncing ? 'watch' : 'pass';
  const diagnosticStatus = options.diagnostics.length > 0 ? 'fail' : 'pass';
  const deadLetterStatus = options.deadLetterOpen > 0 ? 'fail' : 'pass';
  const gates: OperationalReadiness['gates'] = [
    {
      label: 'Diagnostics',
      status: diagnosticStatus,
      detail: diagnosticStatus === 'pass' ? 'No endpoint diagnostics are currently blocking status reads.' : `${options.diagnostics.length} diagnostic issue(s) need review.`,
    },
    {
      label: 'Queue Backlog',
      status: queueStatus,
      detail:
        queueStatus === 'pass'
          ? 'MLS queues are idle with no failed jobs.'
          : queueStatus === 'watch'
            ? `${busyQueues.length} queue(s) are active, waiting, or delayed.`
            : `${failedQueues.length} queue(s) have failed jobs.`,
    },
    {
      label: 'Dead Letter',
      status: deadLetterStatus,
      detail: deadLetterStatus === 'pass' ? 'No open dead-letter records are present.' : `${options.deadLetterOpen} dead-letter record(s) are open.`,
    },
    {
      label: 'Inventory Freshness',
      status: staleStatus,
      detail: `${options.propertyFreshness.stalePercent}% stale using ${options.propertyFreshness.freshnessField}.`,
    },
    {
      label: 'Search Index',
      status: searchStatus,
      detail: `${options.searchIndex.succeeded} indexed, ${options.searchIndex.failed} failed, ${options.searchIndex.unknown} unknown across recent completions.`,
    },
  ];

  const hasFailedGate = gates.some((gate) => gate.status === 'fail');
  const hasWatchGate = gates.some((gate) => gate.status === 'watch');

  if (options.deadLetterOpen > 0) {
    return {
      level: 'blocked',
      summary: 'Recovery work should inspect dead-letter records before any new broad MLS ingestion.',
      nextAction: 'Inspect open dead-letter records.',
      nextTerminal: 'Terminal 5',
      nextCommand: TERMINAL_5_DEAD_LETTER_OPEN_COMMAND,
      gates,
    };
  }

  if (failedQueues.length > 0) {
    if (hasDatabaseDiagnostics) {
      return {
        level: 'blocked',
        summary: 'Failed queue jobs and database connectivity diagnostics are present; resolve Supabase before retrying.',
        nextAction: 'Run the Supabase preflight JSON report and follow the recovery runbook before queue retry.',
        nextTerminal: 'Terminal 5',
        nextCommand: TERMINAL_5_SUPABASE_CHECK_JSON_COMMAND,
        gates,
      };
    }

    return {
      level: 'blocked',
      summary: 'Failed queue jobs are present; preview retry behavior before live retry.',
      nextAction: 'Run a dry-run retry for the first failed queue.',
      nextTerminal: 'Terminal 5',
      nextCommand: buildRetryCommand(failedQueues[0].name),
      gates,
    };
  }

  if (options.diagnostics.length > 0) {
    return {
      level: 'blocked',
      summary: 'Status diagnostics must be cleared before increasing MLS ingestion volume.',
      nextAction: 'Run the MLS status smoke check and review diagnostics.',
      nextTerminal: 'Terminal 5',
      nextCommand: TERMINAL_5_SMOKE_MLS_STATUS_COMMAND,
      gates,
    };
  }

  if (options.searchIndex.failed > 0 || options.searchIndex.unattempted > 0) {
    return {
      level: 'blocked',
      summary: 'Search-index reporting is not clean enough for increased MLS volume.',
      nextAction: 'Run search smoke readiness before increasing sync volume.',
      nextTerminal: 'Terminal 5',
      nextCommand: TERMINAL_5_SMOKE_SEARCH_COMMAND,
      gates,
    };
  }

  if (options.propertyFreshness.stalePercent >= 25) {
    return {
      level: 'watch',
      summary: 'Inventory freshness is degraded, but a bounded sync preview can be run.',
      nextAction: 'Preview a bounded MLS sync.',
      nextTerminal: 'Terminal 5',
      nextCommand: buildSyncDryRunCommand(),
      gates,
    };
  }

  if (options.isSyncing || busyQueues.length > 0) {
    return {
      level: 'watch',
      summary: 'MLS ingestion is already active; monitor current work before launching another broad sync.',
      nextAction: 'Keep the coordinator worker visible and refresh status.',
      nextTerminal: 'Terminal 3',
      nextCommand: TERMINAL_3_WORKER_COMMAND,
      gates,
    };
  }

  return {
    level: hasFailedGate ? 'blocked' : hasWatchGate ? 'watch' : 'ready',
    summary: hasWatchGate ? 'MLS operations are usable with watch items.' : 'MLS operations are ready for bounded sync or smoke checks.',
    nextAction: hasWatchGate ? 'Run operational smoke before changing sync volume.' : 'Run operational smoke or a bounded sync preview.',
    nextTerminal: 'Terminal 5',
    nextCommand: hasWatchGate ? TERMINAL_5_SMOKE_OPS_COMMAND : buildSyncDryRunCommand(),
    gates,
  };
}

async function hasColumn(tableName: string, columnName: string) {
  const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = ${tableName}
        AND column_name = ${columnName}
    ) AS "exists"
  `;

  return Boolean(rows[0]?.exists);
}

async function getQueueStatus(name: string, queue: Queue): Promise<QueueStatusItem> {
  const [waiting, active, delayed, failed, completed, paused] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getDelayedCount(),
    queue.getFailedCount(),
    queue.getCompletedCount(),
    queue.isPaused(),
  ]);

  return {
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
    STATUS_QUEUES.map(({ name, queue }) => withTimeout(`queue:${name}`, getFallbackQueueStatus(name), getQueueStatus(name, queue))),
  );

  return {
    queues: results.map((result) => result.value),
    issues: results.flatMap((result) => (result.ok ? [] : [result.issue])),
  };
}

async function getRecentFailedJobs(queue: Queue, queueName: string) {
  const jobs = await queue.getFailed(0, 4);

  return jobs.map((job) => ({
    queue: queueName,
    id: job.id,
    name: job.name,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason || null,
    finishedOn: toIsoDate(job.finishedOn),
      dryRunRetryCommand: buildRetryCommand(queueName, { jobId: job.id }),
      liveRetryCommand: buildRetryCommand(queueName, { execute: true, jobId: job.id }),
      deadLetterSourceQueueCommand: buildDeadLetterSourceQueueCommand(queueName),
    }));
}

async function getRecentCompletedJobs(queue: Queue, queueName: string): Promise<RecentCompletedJob[]> {
  const jobs = await queue.getCompleted(0, 4);

  return jobs.map((job) => ({
    queue: queueName,
    id: job.id,
    name: job.name,
    finishedOn: toIsoDate(job.finishedOn),
    returnvalue: job.returnvalue ?? null,
  }));
}

async function getRecentFailedJobsStatus() {
  const fallback: Awaited<ReturnType<typeof getRecentFailedJobs>> = [];
  const results = await Promise.all(
    STATUS_QUEUES.map(({ name, queue }) => withTimeout(`recentFailedJobs:${name}`, fallback, getRecentFailedJobs(queue, name))),
  );

  return {
    recentFailedJobs: results.flatMap((result) => result.value),
    issues: results.flatMap((result) => (result.ok ? [] : [result.issue])),
  };
}

async function getRecentCompletedJobsStatus() {
  const fallback: RecentCompletedJob[] = [];
  const completedQueues = STATUS_QUEUES.filter(
    (item) => item.name === MLS_SYNC_QUEUE_NAME || item.name === MLS_PAGE_QUEUE_NAME || item.name === LISTING_QUEUE_NAME,
  );
  const results = await Promise.all(
    completedQueues.map(({ name, queue }) => withTimeout(`recentCompletedJobs:${name}`, fallback, getRecentCompletedJobs(queue, name))),
  );

  return {
    recentCompletedJobs: results.flatMap((result) => result.value),
    issues: results.flatMap((result) => (result.ok ? [] : [result.issue])),
  };
}

async function getDeadLetterStatus() {
  const [waiting, active, delayed, failed, completed, paused, recent] = await Promise.all([
    deadLetterQueue.getWaitingCount(),
    deadLetterQueue.getActiveCount(),
    deadLetterQueue.getDelayedCount(),
    deadLetterQueue.getFailedCount(),
    deadLetterQueue.getCompletedCount(),
    deadLetterQueue.isPaused(),
    deadLetterQueue.getJobs(['waiting', 'delayed', 'failed'], 0, 9),
  ]);

  return {
    name: DEAD_LETTER_QUEUE_NAME,
    waiting,
    active,
    delayed,
    failed,
    completed,
    paused,
    totalOpen: waiting + active + delayed + failed,
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

async function getMlsSyncState(): Promise<MlsSyncStateStatus | null> {
  const hasLastIntelligenceSync = await hasColumn('MlsSyncState', 'lastIntelligenceSync');

  if (hasLastIntelligenceSync) {
    const rows = await prisma.$queryRaw<MlsSyncStateStatus[]>`
      SELECT
        "id",
        "lastSync",
        "lastIntelligenceSync",
        "lastPage",
        "totalRecords",
        "isSyncing"
      FROM "MlsSyncState"
      WHERE "id" = 1
      LIMIT 1
    `;

    return rows[0] || null;
  }

  const rows = await prisma.$queryRaw<MlsSyncStateStatus[]>`
    SELECT
      "id",
      "lastSync",
      NULL::timestamp AS "lastIntelligenceSync",
      "lastPage",
      "totalRecords",
      "isSyncing"
    FROM "MlsSyncState"
    WHERE "id" = 1
    LIMIT 1
  `;

  return rows[0] || null;
}

async function getPropertyFreshness(): Promise<PropertyFreshness> {
  const staleCutoff = new Date(Date.now() - STALE_PROPERTY_HOURS * 60 * 60 * 1000);
  const hasLastIntelligenceSync = await hasColumn('Property', 'lastIntelligenceSync');
  const freshnessField = hasLastIntelligenceSync ? 'lastIntelligenceSync' : 'updatedAt';

  const [total, active, staleRows, privateExclusive, latestRows, newestRows] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({
      where: {
        status: {
          in: ['Active', 'ACTIVE', 'Active Under Contract', 'Coming Soon'],
        },
      },
    }),
    hasLastIntelligenceSync
      ? prisma.$queryRaw<Array<{ count: bigint }>>`
          SELECT COUNT(*)::bigint AS "count"
          FROM "Property"
          WHERE "lastIntelligenceSync" IS NULL OR "lastIntelligenceSync" < ${staleCutoff}
        `
      : prisma.$queryRaw<Array<{ count: bigint }>>`
          SELECT COUNT(*)::bigint AS "count"
          FROM "Property"
          WHERE "updatedAt" < ${staleCutoff}
        `,
    prisma.property.count({
      where: {
        isPrivateExclusive: true,
      },
    }),
    hasLastIntelligenceSync
      ? prisma.$queryRaw<PropertyFreshness['latest'][]>`
          SELECT
            "id",
            "mlsId",
            "slug",
            "address",
            "city",
            "status",
            "lastIntelligenceSync"
          FROM "Property"
          ORDER BY "lastIntelligenceSync" DESC NULLS LAST
          LIMIT 1
        `
      : prisma.$queryRaw<PropertyFreshness['latest'][]>`
          SELECT
            "id",
            "mlsId",
            "slug",
            "address",
            "city",
            "status",
            "updatedAt" AS "lastIntelligenceSync"
          FROM "Property"
          ORDER BY "updatedAt" DESC NULLS LAST
          LIMIT 1
        `,
    prisma.property.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        mlsId: true,
        slug: true,
        address: true,
        city: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);
  const stale = Number(staleRows[0]?.count || 0);
  const latest = latestRows[0] || null;
  const newest = newestRows || null;

  return {
    total,
    active,
    stale,
    privateExclusive,
    stalePercent: total ? Math.round((stale / total) * 100) : 0,
    latest,
    latestMinutesAgo: minutesSince(latest?.lastIntelligenceSync),
    newest,
    newestMinutesAgo: minutesSince(newest?.createdAt),
    staleThresholdHours: STALE_PROPERTY_HOURS,
    freshnessField,
  };
}

async function publishIndexingSignal(url: string) {
  const token = process.env.GOOGLE_INDEXING_ACCESS_TOKEN;

  if (!token) {
    return {
      attempted: false,
      ok: false,
      reason: 'GOOGLE_INDEXING_ACCESS_TOKEN is not configured.',
    };
  }

  const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      type: 'URL_UPDATED',
    }),
  });

  return {
    attempted: true,
    ok: response.ok,
    status: response.status,
  };
}

function isNotFoundError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
}

export async function GET(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return unauthorizedResponse();
  }

  const [syncStateResult, propertyFreshnessResult, queueStatusResult, deadLetterResult, recentFailedJobsResult, recentCompletedJobsResult] = await Promise.all([
    withTimeout('database:syncState', null, getMlsSyncState()),
    withTimeout('database:propertyFreshness', getFallbackPropertyFreshness(), getPropertyFreshness()),
    getQueueStatuses(),
    withTimeout('redis:deadLetter', getFallbackDeadLetterStatus(), getDeadLetterStatus()),
    getRecentFailedJobsStatus(),
    getRecentCompletedJobsStatus(),
  ]);

  const syncState = syncStateResult.value;
  const propertyFreshness = propertyFreshnessResult.value;
  const queues = queueStatusResult.queues;
  const deadLetter = deadLetterResult.value;
  const recentFailedJobs = recentFailedJobsResult.recentFailedJobs;
  const recentCompletedJobs = recentCompletedJobsResult.recentCompletedJobs;
  const searchIndex = getCompletedJobIndexStatus(recentCompletedJobs);
  const diagnostics = [
    ...(syncStateResult.ok ? [] : [syncStateResult.issue]),
    ...(propertyFreshnessResult.ok ? [] : [propertyFreshnessResult.issue]),
    ...queueStatusResult.issues,
    ...(deadLetterResult.ok ? [] : [deadLetterResult.issue]),
    ...recentFailedJobsResult.issues,
    ...recentCompletedJobsResult.issues,
    ...searchIndex.diagnostics,
  ];
  const health = getOverallHealth(queues, deadLetter.totalOpen, Boolean(syncState?.isSyncing), diagnostics);

  return json({
    success: true,
    status: health,
    engine: 'REIE V 7.0',
    module: 'MLS Operations Status',
    generatedAt: new Date().toISOString(),
    timeoutMs: STATUS_TIMEOUT_MS,
    auth: {
      configured: Boolean(getAdminKey()),
    },
    indexingConfigured: Boolean(process.env.GOOGLE_INDEXING_ACCESS_TOKEN),
    redis: {
      url: redactRedisUrl(getRedisUrl()),
    },
    syncDefaults: {
      maxPages: MLS_SYNC_DEFAULT_MAX_PAGES,
      pageSize: MLS_SYNC_DEFAULT_PAGE_SIZE,
      pageTimeoutMs: MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS,
      startPage: 0,
    },
    syncLimits: {
      pageTimeoutMs: MLS_SYNC_MAX_PAGE_TIMEOUT_MS,
    },
    terminals: {
      nextApp: 'Terminal 1',
      mlsPageWorker: 'Terminal 2',
      coordinator: 'Terminal 3',
      dockerAndTypesense: 'Terminal 4',
      statusChecks: 'Terminal 5',
      scriptsAndCurl: 'Terminal 5',
    },
    commands: {
      smokeOps: TERMINAL_5_SMOKE_OPS_COMMAND,
      smokeMlsStatus: TERMINAL_5_SMOKE_MLS_STATUS_COMMAND,
      smokeSearch: TERMINAL_5_SMOKE_SEARCH_COMMAND,
      supabaseCheck: TERMINAL_5_SUPABASE_CHECK_COMMAND,
      supabaseCheckJson: TERMINAL_5_SUPABASE_CHECK_JSON_COMMAND,
      status: TERMINAL_5_STATUS_COMMAND,
      rawStatus: TERMINAL_5_STATUS_COMMAND,
      retryStatus: TERMINAL_5_RETRY_STATUS_COMMAND,
      searchCheck: TERMINAL_5_SEARCH_CHECK_COMMAND,
      rawSearchCheck: TERMINAL_5_SEARCH_CHECK_COMMAND,
      dryRunRetry: buildRetryCommand(MLS_SYNC_QUEUE_NAME),
      dryRunRetryMlsSync: buildRetryCommand(MLS_SYNC_QUEUE_NAME),
      liveRetryMlsSync: buildRetryCommand(MLS_SYNC_QUEUE_NAME, { execute: true }),
      dryRunSync: buildSyncDryRunCommand(),
      dryRunSyncPreview: buildSyncDryRunCommand(),
      liveSync: buildSyncLiveCommand(),
      forcedLiveSync: buildSyncLiveCommand(true),
      deadLetter: TERMINAL_5_DEAD_LETTER_COMMAND,
      deadLetterInspector: TERMINAL_5_DEAD_LETTER_COMMAND,
      deadLetterOpen: TERMINAL_5_DEAD_LETTER_OPEN_COMMAND,
      deadLetterFailed: TERMINAL_5_DEAD_LETTER_FAILED_COMMAND,
      deadLetterByMlsSync: buildDeadLetterSourceQueueCommand(MLS_SYNC_QUEUE_NAME),
      queueDashboard: TERMINAL_5_QUEUE_DASHBOARD_COMMAND,
      alertDryRun: TERMINAL_5_ALERT_DRY_RUN_COMMAND,
      worker: TERMINAL_3_WORKER_COMMAND,
    },
    diagnostics,
    recommendations: buildRecommendations({
      queues,
      deadLetterOpen: deadLetter.totalOpen,
      diagnostics,
      propertyFreshness,
      searchIndex,
      isSyncing: Boolean(syncState?.isSyncing),
    }),
    operationalReadiness: buildOperationalReadiness({
      queues,
      deadLetterOpen: deadLetter.totalOpen,
      diagnostics,
      propertyFreshness,
      searchIndex,
      isSyncing: Boolean(syncState?.isSyncing),
    }),
    syncState: syncState
      ? {
          ...syncState,
          lastSyncMinutesAgo: minutesSince(syncState.lastSync),
          lastIntelligenceSyncMinutesAgo: minutesSince(syncState.lastIntelligenceSync),
        }
      : null,
    propertyFreshness,
    queues,
    deadLetter,
    searchIndex,
    recentFailedJobs,
    recentCompletedJobs,
  });
}

export async function POST(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = (await request.json().catch(() => ({}))) as StatusUpdateBody;
    const mlsId = body.mlsId?.trim();
    const newStatus = body.newStatus?.trim();

    if (!mlsId || !newStatus) {
      return json(
        {
          success: false,
          error: 'mlsId and newStatus are required.',
        },
        { status: 400 },
      );
    }

    const property = await prisma.property.update({
      where: { mlsId },
      data: {
        status: newStatus,
        lastIntelligenceSync: new Date(),
      },
      select: {
        id: true,
        mlsId: true,
        slug: true,
        status: true,
        price: true,
        lastIntelligenceSync: true,
      },
    });

    const propertyUrl = getPropertyUrl(property.slug || property.mlsId);
    const indexing = await publishIndexingSignal(propertyUrl);

    console.log('MLS freshness signal processed:', {
      mlsId,
      newStatus,
      priceChange: body.priceChange ?? null,
      indexing,
    });

    return json({
      success: true,
      property,
      propertyUrl,
      indexing,
    });
  } catch (error) {
    if (isNotFoundError(error)) {
      return json(
        {
          success: false,
          error: 'Property not found for supplied mlsId.',
        },
        { status: 404 },
      );
    }

    console.error('MLS status update failed:', getErrorMessage(error));

    return json(
      {
        success: false,
        error: 'MLS status update failed.',
      },
      { status: 500 },
    );
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/status/route.ts
