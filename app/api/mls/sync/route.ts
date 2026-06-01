import { NextRequest, NextResponse } from 'next/server';

import {
  enqueueMlsSync,
  MLS_SYNC_DEFAULT_MAX_PAGES,
  MLS_SYNC_DEFAULT_MAX_RUNTIME_MS,
  MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS,
  MLS_SYNC_DEFAULT_PAGE_SIZE,
  MLS_SYNC_DEFAULT_RATE_DELAY_MS,
  MLS_SYNC_JOB_NAME,
  MLS_SYNC_MAX_PAGES,
  MLS_SYNC_MAX_PAGE_TIMEOUT_MS,
  MLS_SYNC_MAX_PAGE_SIZE,
  MLS_SYNC_MAX_RATE_DELAY_MS,
  MLS_SYNC_MAX_RUNTIME_MS,
  MLS_SYNC_MAX_START_PAGE,
  MLS_SYNC_QUEUE_NAME,
  mlsQueue,
  normalizeMlsSyncJobData,
  type MlsSyncJobData,
} from '@/lib/queue/mlsQueue';
import { assertAppDatabaseReady } from '@/lib/appDatabasePreflight';

export const dynamic = 'force-dynamic';

type SyncRequestBody = {
  maxRuntimeMs?: number | string;
  rateDelayMs?: number | string;
  pageSize?: number | string;
  maxPages?: number | string;
  startPage?: number | string;
  includeMedia?: boolean | string;
  pageTimeoutMs?: number | string;
  requestedBy?: string;
  dryRun?: boolean | string;
  execute?: boolean | string;
  force?: boolean | string;
};

type QueueDiagnostic = {
  subsystem: 'auth' | 'redis' | 'request';
  message: string;
};

const QUEUE_TIMEOUT_MS = 8_000;
const ROUTE_PATH = '/api/mls/sync';
const TERMINAL_3_WORKER_COMMAND = 'npm run run:worker:mls';
const TERMINAL_5_STATUS_COMMAND = 'curl -s "http://localhost:3000/api/mls/status"';
const TERMINAL_5_SYNC_STATUS_COMMAND = 'curl -s "http://localhost:3000/api/mls/sync"';
const TERMINAL_5_DRY_RUN_RETRY_COMMAND = 'curl -s -X POST "http://localhost:3000/api/mls/retry?queue=mls-sync&dryRun=true"';
const TERMINAL_5_LIVE_RETRY_COMMAND = 'curl -s -X POST "http://localhost:3000/api/mls/retry?queue=mls-sync&dryRun=false&execute=true"';
const TERMINAL_5_DEAD_LETTER_COMMAND = 'curl -s "http://localhost:3000/api/admin/dead-letter?limit=25"';
const TERMINAL_5_DEAD_LETTER_OPEN_COMMAND = 'curl -s "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"';
const TERMINAL_5_QUEUE_DASHBOARD_COMMAND = 'npm run run:queue-dashboard';
const TERMINAL_5_ALERT_DRY_RUN_COMMAND = 'curl -s -X POST "http://localhost:3000/api/process-alerts?dryRun=true&limit=25"';
const TERMINAL_5_SUPABASE_CHECK_COMMAND = 'npm run supabase:check';
const TERMINAL_5_SUPABASE_CHECK_JSON_COMMAND = 'npm run supabase:check:json';

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

function readNumber(value: unknown, fallback: number, min: number, max: number) {
  if (value === undefined || value === null || value === '') return fallback;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;

  return Math.min(Math.max(Math.floor(parsed), min), max);
}

function readBoolean(value: unknown) {
  if (value === true || value === 'true' || value === '1' || value === 'yes' || value === 'y') return true;
  if (value === false || value === 'false' || value === '0' || value === 'no' || value === 'n') return false;
  return undefined;
}

function hasExplicitBoolean(value: unknown) {
  if (typeof value === 'boolean') return true;
  if (typeof value !== 'string') return false;

  return ['1', '0', 'true', 'false', 'yes', 'no', 'y', 'n'].includes(value.trim().toLowerCase());
}

function readExplicitBoolean(value: unknown, fallback: boolean) {
  const parsed = readBoolean(value);
  return parsed === undefined ? fallback : parsed;
}

function cleanString(value: unknown, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const cleaned = value.trim();
  return cleaned || fallback;
}

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object') return String(error || 'Unknown MLS sync queue error.');

  const maybeAggregate = (error as { errors?: unknown[] }).errors;
  if (Array.isArray(maybeAggregate)) {
    const aggregateMessage = maybeAggregate
      .map((item) => (item instanceof Error ? item.message : String(item || '')))
      .filter(Boolean)
      .join('; ');

    if (aggregateMessage) return aggregateMessage;
  }

  return error instanceof Error ? error.message : String(error || 'Unknown MLS sync queue error.');
}

function buildRedisDiagnostic(error: unknown): QueueDiagnostic {
  return {
    subsystem: 'redis',
    message: getErrorMessage(error),
  };
}

async function withTimeout<T>(label: string, operation: Promise<T>) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(`${label} timed out after ${QUEUE_TIMEOUT_MS}ms.`));
    }, QUEUE_TIMEOUT_MS);
  });

  try {
    return await Promise.race([operation, timeoutPromise]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

function readRequestBody(request: NextRequest): Promise<SyncRequestBody> {
  return request.json().catch(() => ({}));
}

function getRequestedBy(request: NextRequest, body: SyncRequestBody) {
  return (
    cleanString(body.requestedBy) ||
    cleanString(request.headers.get('x-reie-requested-by')) ||
    cleanString(request.headers.get('x-user-email')) ||
    cleanString(request.headers.get('x-user-id')) ||
    'api'
  );
}

function buildSyncJobData(request: NextRequest, body: SyncRequestBody = {}): MlsSyncJobData {
  const search = request.nextUrl.searchParams;

  return normalizeMlsSyncJobData({
    requestedAt: new Date().toISOString(),
    requestedBy: getRequestedBy(request, body),
    source: 'api',
    maxRuntimeMs: readNumber(
      body.maxRuntimeMs ?? search.get('maxRuntimeMs'),
      MLS_SYNC_DEFAULT_MAX_RUNTIME_MS,
      1000,
      MLS_SYNC_MAX_RUNTIME_MS,
    ),
    rateDelayMs: readNumber(
      body.rateDelayMs ?? search.get('rateDelayMs'),
      MLS_SYNC_DEFAULT_RATE_DELAY_MS,
      0,
      MLS_SYNC_MAX_RATE_DELAY_MS,
    ),
    pageSize: readNumber(body.pageSize ?? search.get('pageSize'), MLS_SYNC_DEFAULT_PAGE_SIZE, 1, MLS_SYNC_MAX_PAGE_SIZE),
    maxPages: readNumber(body.maxPages ?? search.get('maxPages'), MLS_SYNC_DEFAULT_MAX_PAGES, 1, MLS_SYNC_MAX_PAGES),
    startPage: readNumber(body.startPage ?? search.get('startPage'), 0, 0, MLS_SYNC_MAX_START_PAGE),
    includeMedia: readBoolean(body.includeMedia ?? search.get('includeMedia')),
    pageTimeoutMs: readNumber(
      body.pageTimeoutMs ?? search.get('pageTimeoutMs'),
      MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS,
      1000,
      MLS_SYNC_MAX_PAGE_TIMEOUT_MS,
    ),
  });
}

function readDryRun(request: NextRequest, body: SyncRequestBody = {}) {
  const search = request.nextUrl.searchParams;

  if (hasExplicitBoolean(body.dryRun)) return readExplicitBoolean(body.dryRun, true);
  if (hasExplicitBoolean(search.get('dryRun'))) return readExplicitBoolean(search.get('dryRun'), true);
  if (readBoolean(body.execute ?? search.get('execute')) === true) return false;

  return true;
}

function readForce(request: NextRequest, body: SyncRequestBody = {}) {
  return readBoolean(body.force ?? request.nextUrl.searchParams.get('force')) === true;
}

async function getSyncQueueStatus() {
  const [waiting, active, delayed, failed, completed, paused] = await Promise.all([
    mlsQueue.getWaitingCount(),
    mlsQueue.getActiveCount(),
    mlsQueue.getDelayedCount(),
    mlsQueue.getFailedCount(),
    mlsQueue.getCompletedCount(),
    mlsQueue.isPaused(),
  ]);

  return {
    name: MLS_SYNC_QUEUE_NAME,
    waiting,
    active,
    delayed,
    failed,
    completed,
    paused,
    health: failed > 0 ? 'degraded' : active > 0 || waiting > 0 || delayed > 0 ? 'busy' : 'healthy',
  };
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
      diagnostics: [
        {
          subsystem: 'auth',
          message: 'Send x-admin-key or Authorization: Bearer <key> when an admin key is configured.',
        },
      ],
    },
    { status: 401 },
  );
}

function getQueueGuidance(status: Awaited<ReturnType<typeof getSyncQueueStatus>>) {
  if (status.failed > 0) {
    return `Inspect /api/mls/status and run a Terminal 5 dry-run retry before enqueueing more work: ${TERMINAL_5_DRY_RUN_RETRY_COMMAND}`;
  }
  if (status.active > 0) return 'An MLS sync job is active; avoid overlapping broad sync jobs.';
  if (status.waiting > 0 || status.delayed > 0) return 'MLS sync work is already queued; keep new jobs small unless clearing a backlog intentionally.';
  return 'Queue is clear for a bounded sync job.';
}

function buildLiveEnqueueHint(data?: MlsSyncJobData) {
  const maxPages = data?.maxPages ?? MLS_SYNC_DEFAULT_MAX_PAGES;
  const pageSize = data?.pageSize ?? 5;
  const startPage = data?.startPage ?? 0;

  return `POST ${ROUTE_PATH}?execute=true&maxPages=${maxPages}&pageSize=${pageSize}&startPage=${startPage}`;
}

function buildSyncCommand(data?: MlsSyncJobData, options: { execute?: boolean; force?: boolean } = {}) {
  const params = new URLSearchParams({
    maxPages: String(data?.maxPages ?? MLS_SYNC_DEFAULT_MAX_PAGES),
    pageSize: String(data?.pageSize ?? Math.min(MLS_SYNC_DEFAULT_PAGE_SIZE, 5)),
    startPage: String(data?.startPage ?? 0),
  });

  if (options.execute) {
    params.set('execute', 'true');
  } else {
    params.set('dryRun', 'true');
  }

  if (data?.rateDelayMs !== undefined) params.set('rateDelayMs', String(data.rateDelayMs));
  if (data?.maxRuntimeMs !== undefined) params.set('maxRuntimeMs', String(data.maxRuntimeMs));
  if (data?.pageTimeoutMs !== undefined) params.set('pageTimeoutMs', String(data.pageTimeoutMs));
  if (data?.includeMedia !== undefined) params.set('includeMedia', String(data.includeMedia));
  if (options.force) params.set('force', 'true');

  return `curl -s -X POST "http://localhost:3000${ROUTE_PATH}?${params.toString()}"`;
}

function getCommandSet(data?: MlsSyncJobData) {
  const dryRunSync = buildSyncCommand(data);
  const liveSync = buildSyncCommand(data, { execute: true });
  const forcedLiveSync = buildSyncCommand(data, { execute: true, force: true });

  return {
    status: TERMINAL_5_STATUS_COMMAND,
    syncStatus: TERMINAL_5_SYNC_STATUS_COMMAND,
    retryStatus: 'curl -s "http://localhost:3000/api/mls/retry"',
    dryRunSync,
    liveSync,
    forcedLiveSync,
    dryRunRetry: TERMINAL_5_DRY_RUN_RETRY_COMMAND,
    liveRetry: TERMINAL_5_LIVE_RETRY_COMMAND,
    deadLetter: TERMINAL_5_DEAD_LETTER_COMMAND,
    deadLetterInspector: TERMINAL_5_DEAD_LETTER_COMMAND,
    deadLetterOpen: TERMINAL_5_DEAD_LETTER_OPEN_COMMAND,
    queueDashboard: TERMINAL_5_QUEUE_DASHBOARD_COMMAND,
    supabaseCheck: TERMINAL_5_SUPABASE_CHECK_COMMAND,
    supabaseCheckJson: TERMINAL_5_SUPABASE_CHECK_JSON_COMMAND,
    alertDryRun: TERMINAL_5_ALERT_DRY_RUN_COMMAND,
    worker: TERMINAL_3_WORKER_COMMAND,
    terminal5Status: TERMINAL_5_STATUS_COMMAND,
    terminal5SyncStatus: TERMINAL_5_SYNC_STATUS_COMMAND,
    terminal5RetryStatus: 'curl -s "http://localhost:3000/api/mls/retry"',
    terminal5DryRunSync: dryRunSync,
    terminal5LiveSync: liveSync,
    terminal5ForcedLiveSync: forcedLiveSync,
    terminal5DryRunRetry: TERMINAL_5_DRY_RUN_RETRY_COMMAND,
    terminal5LiveRetry: TERMINAL_5_LIVE_RETRY_COMMAND,
    terminal5DeadLetter: TERMINAL_5_DEAD_LETTER_COMMAND,
    terminal5DeadLetterOpen: TERMINAL_5_DEAD_LETTER_OPEN_COMMAND,
    terminal5QueueDashboard: TERMINAL_5_QUEUE_DASHBOARD_COMMAND,
    terminal5SupabaseCheck: TERMINAL_5_SUPABASE_CHECK_COMMAND,
    terminal5SupabaseCheckJson: TERMINAL_5_SUPABASE_CHECK_JSON_COMMAND,
    terminal5AlertDryRun: TERMINAL_5_ALERT_DRY_RUN_COMMAND,
    terminal3Worker: TERMINAL_3_WORKER_COMMAND,
  };
}

function getTerminalMap() {
  return {
    nextApp: 'Terminal 1',
    mlsPageWorker: 'Terminal 2',
    coordinator: 'Terminal 3',
    dockerAndTypesense: 'Terminal 4',
    scriptsAndCurl: 'Terminal 5',
  };
}

function getExpectedJobResultMetrics() {
  return {
    ingestion: ['fetched', 'processed', 'succeeded', 'failed', 'skipped', 'warningCount'],
    searchIndex: ['indexAttempted', 'indexSucceeded', 'indexFailed'],
    interpretation:
      'indexFailed should remain 0. If listings succeed but indexFailed increases, MLS ingestion is working but search visibility needs Typesense repair or reindexing.',
  };
}

export async function GET(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const queue = await withTimeout('mls-sync queue status', getSyncQueueStatus());

    return json({
      success: true,
      module: 'REIE MLS Sync Queue',
      route: ROUTE_PATH,
      auth: {
        configured: Boolean(getAdminKey()),
      },
      queue,
      guidance: getQueueGuidance(queue),
      defaults: {
        maxRuntimeMs: MLS_SYNC_DEFAULT_MAX_RUNTIME_MS,
        rateDelayMs: MLS_SYNC_DEFAULT_RATE_DELAY_MS,
        pageSize: MLS_SYNC_DEFAULT_PAGE_SIZE,
        maxPages: MLS_SYNC_DEFAULT_MAX_PAGES,
        startPage: 0,
        pageTimeoutMs: MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS,
      },
      limits: {
        maxRuntimeMs: MLS_SYNC_MAX_RUNTIME_MS,
        rateDelayMs: MLS_SYNC_MAX_RATE_DELAY_MS,
        pageSize: MLS_SYNC_MAX_PAGE_SIZE,
        maxPages: MLS_SYNC_MAX_PAGES,
        startPage: MLS_SYNC_MAX_START_PAGE,
        pageTimeoutMs: MLS_SYNC_MAX_PAGE_TIMEOUT_MS,
      },
      worker: {
        terminal: 'Terminal 3',
        command: TERMINAL_3_WORKER_COMMAND,
      },
      terminals: getTerminalMap(),
      commands: getCommandSet({
        maxPages: 1,
        pageSize: 5,
        startPage: 0,
        pageTimeoutMs: MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS,
      }),
      expectedJobResultMetrics: getExpectedJobResultMetrics(),
      enqueueHint: `POST ${ROUTE_PATH}?dryRun=true&maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=${MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS}`,
      liveEnqueueHint: buildLiveEnqueueHint({
        maxPages: 1,
        pageSize: 5,
        startPage: 0,
        pageTimeoutMs: MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS,
      }),
      safety: {
        defaultDryRun: true,
        liveEnqueueRequires: 'execute=true or dryRun=false',
        forceRequiredWhenFailedJobsExist: true,
      },
    });
  } catch (error) {
    console.error('MLS sync queue status failed:', getErrorMessage(error));

    return json(
      {
        success: false,
        error: 'MLS sync queue status failed.',
        route: ROUTE_PATH,
        diagnostics: [buildRedisDiagnostic(error)],
      },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await readRequestBody(request);
    const data = buildSyncJobData(request, body);
    const dryRun = readDryRun(request, body);
    const force = readForce(request, body);
    const queue = await withTimeout('mls-sync queue status', getSyncQueueStatus());

    if (dryRun) {
      return json({
        success: true,
        dryRun: true,
        force,
        route: ROUTE_PATH,
        queue: MLS_SYNC_QUEUE_NAME,
        job: {
          name: MLS_SYNC_JOB_NAME,
          data,
        },
        status: queue,
        guidance: getQueueGuidance(queue),
        terminals: {
          ...getTerminalMap(),
        },
        commands: getCommandSet(data),
        expectedJobResultMetrics: getExpectedJobResultMetrics(),
        liveEnqueueHint: buildLiveEnqueueHint(data),
      });
    }

    if (queue.failed > 0 && !force) {
      return json(
        {
          success: false,
          dryRun: false,
          force,
          route: ROUTE_PATH,
          queue: MLS_SYNC_QUEUE_NAME,
          error: 'MLS sync queue has failed jobs. Run a dry-run retry first or pass force=true after inspection.',
          status: queue,
          guidance: getQueueGuidance(queue),
          terminals: {
            ...getTerminalMap(),
          },
          commands: getCommandSet(data),
          expectedJobResultMetrics: getExpectedJobResultMetrics(),
          dryRunRetryCommand: TERMINAL_5_DRY_RUN_RETRY_COMMAND,
        },
        { status: 409 },
      );
    }

    await assertAppDatabaseReady({
      operation: 'MLS sync live enqueue',
      recoveryCommand: TERMINAL_5_SUPABASE_CHECK_JSON_COMMAND,
    });

    const job = await withTimeout('mls-sync enqueue', enqueueMlsSync(data));
    const status = await withTimeout('mls-sync queue status', getSyncQueueStatus());

    return json({
      success: true,
      dryRun: false,
      force,
      route: ROUTE_PATH,
      queue: MLS_SYNC_QUEUE_NAME,
      job: {
        id: job.id,
        name: job.name,
        data: job.data,
      },
      status,
      guidance: getQueueGuidance(status),
      terminals: {
        ...getTerminalMap(),
      },
      commands: getCommandSet(data),
      expectedJobResultMetrics: getExpectedJobResultMetrics(),
    });
  } catch (error) {
    console.error('MLS sync enqueue failed:', getErrorMessage(error));

    return json(
      {
        success: false,
        error: 'MLS sync enqueue failed.',
        route: ROUTE_PATH,
        diagnostics: [buildRedisDiagnostic(error)],
      },
      { status: 503 },
    );
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/sync/route.ts
