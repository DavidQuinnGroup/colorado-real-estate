import { NextRequest, NextResponse } from 'next/server';

import { DEAD_LETTER_QUEUE_NAME, deadLetterQueue, type DeadLetterJobData } from '@/lib/queue/deadLetterQueue';
import { getRedisUrl } from '@/lib/queue/redis';

export const dynamic = 'force-dynamic';

type DeadLetterState = 'waiting' | 'active' | 'delayed' | 'failed' | 'completed';

type DeadLetterSeverity = 'clear' | 'watch' | 'action' | 'critical';

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

type DeadLetterSummary = {
  name: string;
  waiting: number;
  active: number;
  delayed: number;
  failed: number;
  completed: number;
  paused: boolean;
  totalOpen: number;
  totalTerminal: number;
};

type DeadLetterJobSummary = {
  id?: string;
  name: string;
  state: DeadLetterState | 'unknown';
  severity: DeadLetterSeverity;
  failedReason: string | null;
  sourceQueue: string | null;
  sourceJobId: string | null;
  sourceJobName: string | null;
  failedAt: string | null;
  failedAgeMinutes: number | null;
  attemptsMade: number | null;
  finalAttempt: boolean | null;
  capturedAt: string | null;
  capturedBy: string | null;
  sourceJobState: string | null;
  sourceJobAttempts: number | null;
  timestamp: string | null;
  processedOn: string | null;
  finishedOn: string | null;
  stack: string | null;
  payload: unknown;
  retryHint: string;
  retryCommand: string;
  retryDryRunCommand: string;
  retryLiveCommand: string;
  terminal: string;
};

type SourceQueueSummary = {
  sourceQueue: string;
  jobs: number;
  oldestFailureAt: string | null;
  newestFailureAt: string | null;
  severity: DeadLetterSeverity;
  dryRunRetryCommand: string;
  liveRetryCommand: string;
};

type DeadLetterFilters = {
  limit: number;
  states: DeadLetterState[];
  sourceQueue: string | null;
  scanLimit: number;
};

type RecoveryPlan = {
  level: DeadLetterSeverity;
  title: string;
  summary: string;
  nextAction: string;
  terminal: typeof TERMINAL_5;
  command: string;
  liveRetryAllowed: boolean;
  gates: Array<{
    label: string;
    status: 'pass' | 'watch' | 'fail';
    detail: string;
  }>;
};

const DEAD_LETTER_TIMEOUT_MS = 4_000;
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 200;
const MAX_SOURCE_QUEUE_LENGTH = 80;
const SUPPORTED_STATES: DeadLetterState[] = ['waiting', 'active', 'delayed', 'failed', 'completed'];
const OPEN_STATES = new Set<DeadLetterState>(['waiting', 'active', 'delayed', 'failed']);
const TERMINAL_5 = 'Terminal 5';
const LOCAL_BASE_URL = 'http://localhost:3000';
const ROUTE = '/api/admin/dead-letter';
const STATUS_COMMAND = `curl -s "${LOCAL_BASE_URL}/api/mls/status"`;
const RETRY_STATUS_COMMAND = `curl -s "${LOCAL_BASE_URL}/api/mls/retry"`;
const QUEUE_DASHBOARD_COMMAND = 'npm run run:queue-dashboard';
const ALERT_DRY_RUN_COMMAND = `curl -s -X POST "${LOCAL_BASE_URL}/api/process-alerts?dryRun=true"`;

function getInspectionCommand(request?: NextRequest) {
  const searchParams = request ? new URLSearchParams(request.nextUrl.searchParams) : new URLSearchParams();
  searchParams.delete('adminKey');
  const search = searchParams.toString() ? `?${searchParams.toString()}` : '';
  return `curl --max-time 8 -s "${LOCAL_BASE_URL}${ROUTE}${search}" -H "x-admin-key: $REIE_ADMIN_API_KEY"`;
}

function getInspectionMetadata(request?: NextRequest) {
  return {
    generatedAt: new Date().toISOString(),
    terminal: TERMINAL_5,
    route: ROUTE,
    command: getInspectionCommand(request),
  } as const;
}

function getAdminKey() {
  return process.env.REIE_ADMIN_API_KEY || process.env.ADMIN_API_KEY || null;
}

function getRequestAdminKey(request: NextRequest) {
  const authorization = request.headers.get('authorization') || '';
  const bearerToken = authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7).trim() : '';
  return request.headers.get('x-admin-key') || bearerToken || '';
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
  return String(error || 'Unknown dead-letter inspection failure.');
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

async function withTimeout<T>(area: string, fallback: T, promise: Promise<T>, timeoutMs = DEAD_LETTER_TIMEOUT_MS): Promise<DiagnosticResult<T>> {
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

function cleanString(value: unknown, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function parseLimit(request: NextRequest) {
  const rawValue = request.nextUrl.searchParams.get('limit') || String(DEFAULT_LIMIT);
  const parsed = Number(rawValue);

  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;
  return Math.min(Math.max(Math.floor(parsed), 1), MAX_LIMIT);
}

function parseStates(request: NextRequest): DeadLetterState[] {
  const rawValue = request.nextUrl.searchParams.get('states') || request.nextUrl.searchParams.get('state') || 'waiting,delayed,failed';
  const states = rawValue
    .split(',')
    .map((state) => state.trim().toLowerCase())
    .filter((state): state is DeadLetterState => SUPPORTED_STATES.includes(state as DeadLetterState));

  return Array.from(new Set(states.length > 0 ? states : ['waiting', 'delayed', 'failed']));
}

function parseSourceQueue(request: NextRequest) {
  const rawValue = cleanString(request.nextUrl.searchParams.get('sourceQueue'));
  if (!rawValue) return null;

  return rawValue.replace(/[^\w:./-]/g, '').slice(0, MAX_SOURCE_QUEUE_LENGTH) || null;
}

function getFilters(request: NextRequest): DeadLetterFilters {
  const limit = parseLimit(request);
  const sourceQueue = parseSourceQueue(request);

  return {
    limit,
    states: parseStates(request),
    sourceQueue,
    scanLimit: sourceQueue ? Math.min(limit * 5, MAX_LIMIT) : limit,
  };
}

function getFallbackSummary(): DeadLetterSummary {
  return {
    name: DEAD_LETTER_QUEUE_NAME,
    waiting: 0,
    active: 0,
    delayed: 0,
    failed: 0,
    completed: 0,
    paused: false,
    totalOpen: 0,
    totalTerminal: 0,
  };
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

function toIsoDate(value: number | undefined | null) {
  return value ? new Date(value).toISOString() : null;
}

function parseRecordedDate(value: string | null | undefined) {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function getFailureAgeMinutes(failedAt: string | null, fallbackTimestamp: number | undefined) {
  const timestamp = parseRecordedDate(failedAt) ?? fallbackTimestamp ?? null;
  if (!timestamp) return null;

  return Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
}

function getSeverity(state: DeadLetterState | 'unknown', failedAgeMinutes: number | null): DeadLetterSeverity {
  if (state === 'completed') return 'clear';
  if (failedAgeMinutes !== null && failedAgeMinutes >= 24 * 60) return 'critical';
  if (state === 'active' || state === 'waiting') return 'watch';
  if (state === 'failed') return 'action';
  if (state === 'delayed') return 'watch';
  return 'action';
}

function getRetryParams(data: DeadLetterJobData, extraParams?: Record<string, string>) {
  if (!data.sourceQueue) return 'Inspect manually; source queue was not recorded.';

  const params = new URLSearchParams({ queue: data.sourceQueue, ...extraParams });
  if (data.sourceJobId) params.set('jobId', data.sourceJobId);

  return params.toString();
}

function getRetryStatusCommand(data: DeadLetterJobData) {
  const params = getRetryParams(data);
  if (params.startsWith('Inspect manually')) return params;

  return `curl -s "${LOCAL_BASE_URL}/api/mls/retry?${params}"`;
}

function getRetryDryRunCommand(data: DeadLetterJobData) {
  const params = getRetryParams(data, { dryRun: 'true' });
  if (params.startsWith('Inspect manually')) return params;

  return `curl -s -X POST "${LOCAL_BASE_URL}/api/mls/retry?${params}"`;
}

function getRetryLiveCommand(data: DeadLetterJobData) {
  const params = getRetryParams(data, { dryRun: 'false', execute: 'true' });
  if (params.startsWith('Inspect manually')) return 'Live retry unavailable; source queue was not recorded.';

  return `curl -s -X POST "${LOCAL_BASE_URL}/api/mls/retry?${params}"`;
}

function getSourceQueueRetryCommand(sourceQueue: string, live = false) {
  const params = new URLSearchParams({
    queue: sourceQueue,
    dryRun: live ? 'false' : 'true',
    limit: '10',
  });

  if (live) params.set('execute', 'true');

  return `curl -s -X POST "${LOCAL_BASE_URL}/api/mls/retry?${params.toString()}"`;
}

function getRetryHint(data: DeadLetterJobData, state: DeadLetterState | 'unknown') {
  if (state === 'active') return 'Wait for the job to finish before retrying.';
  if (state === 'completed') return 'No retry needed; this dead-letter record is completed.';
  if (!data.sourceQueue) return 'Inspect manually; the source queue was not recorded.';
  return `Use ${TERMINAL_5} for a dry-run retry after fixing the root cause: ${getRetryDryRunCommand(data)}`;
}

function getSummarySeverity(summary: DeadLetterSummary, diagnostics: DiagnosticIssue[]): DeadLetterSeverity {
  if (diagnostics.length > 0) return 'critical';
  if (summary.failed > 0) return 'action';
  if (summary.waiting + summary.active + summary.delayed > 0) return 'watch';
  return 'clear';
}

function summarizeSourceQueues(jobs: DeadLetterJobSummary[]): SourceQueueSummary[] {
  const summaries = new Map<string, { jobs: number; oldest: number | null; newest: number | null; severity: DeadLetterSeverity }>();

  for (const job of jobs) {
    const sourceQueue = job.sourceQueue || 'unknown';
    const failedTimestamp = parseRecordedDate(job.failedAt || job.timestamp);
    const current = summaries.get(sourceQueue) || { jobs: 0, oldest: null, newest: null, severity: 'clear' as DeadLetterSeverity };

    current.jobs += 1;
    if (failedTimestamp !== null) {
      current.oldest = current.oldest === null ? failedTimestamp : Math.min(current.oldest, failedTimestamp);
      current.newest = current.newest === null ? failedTimestamp : Math.max(current.newest, failedTimestamp);
    }
    if (job.severity === 'critical' || (job.severity === 'action' && current.severity !== 'critical')) current.severity = job.severity;
    if (job.severity === 'watch' && current.severity === 'clear') current.severity = 'watch';

    summaries.set(sourceQueue, current);
  }

  return [...summaries.entries()]
    .map(([sourceQueue, summary]) => ({
      sourceQueue,
      jobs: summary.jobs,
      oldestFailureAt: summary.oldest === null ? null : new Date(summary.oldest).toISOString(),
      newestFailureAt: summary.newest === null ? null : new Date(summary.newest).toISOString(),
      severity: summary.severity,
      dryRunRetryCommand: sourceQueue === 'unknown' ? RETRY_STATUS_COMMAND : getSourceQueueRetryCommand(sourceQueue),
      liveRetryCommand: sourceQueue === 'unknown' ? RETRY_STATUS_COMMAND : getSourceQueueRetryCommand(sourceQueue, true),
    }))
    .sort((a, b) => b.jobs - a.jobs || a.sourceQueue.localeCompare(b.sourceQueue));
}

function getRecommendations(summary: DeadLetterSummary, jobs: DeadLetterJobSummary[], diagnostics: DiagnosticIssue[]) {
  const recommendations: string[] = [];
  const sourceQueues = summarizeSourceQueues(jobs);
  const topSourceQueue = sourceQueues[0] || null;

  if (diagnostics.length > 0) {
    recommendations.push('Confirm Redis is running in Terminal 4 before retrying dead-letter jobs.');
  }

  if (summary.failed > 0) {
    recommendations.push(`Inspect failed records before retrying; run dry-run retry commands in ${TERMINAL_5} first.`);
  }

  if (topSourceQueue && topSourceQueue.jobs >= 2) {
    recommendations.push(`Prioritize ${topSourceQueue.sourceQueue}; it has the highest dead-letter concentration in this result set.`);
  }

  if (jobs.some((job) => job.severity === 'critical')) {
    recommendations.push('Investigate failures older than 24 hours before running broad retries.');
  }

  if (jobs.some((job) => job.finalAttempt === false)) {
    recommendations.push('Some dead-letter records were captured before the final configured attempt; verify worker retry settings before live retrying.');
  }

  if (recommendations.length === 0) {
    recommendations.push('No dead-letter action is currently required.');
  }

  return recommendations;
}

function getRecoveryPlan(summary: DeadLetterSummary, jobs: DeadLetterJobSummary[], diagnostics: DiagnosticIssue[]): RecoveryPlan {
  const sourceQueues = summarizeSourceQueues(jobs);
  const topSourceQueue = sourceQueues[0] || null;
  const criticalJobs = jobs.filter((job) => job.severity === 'critical').length;
  const finalAttemptJobs = jobs.filter((job) => job.finalAttempt === true).length;
  const openJobs = jobs.filter((job) => OPEN_STATES.has(job.state as DeadLetterState)).length;
  const gates: RecoveryPlan['gates'] = [
    {
      label: 'Diagnostics',
      status: diagnostics.length > 0 ? 'fail' : 'pass',
      detail: diagnostics.length > 0 ? `${diagnostics.length} dead-letter diagnostic issue(s) detected.` : 'Dead-letter reads are clean.',
    },
    {
      label: 'Open Records',
      status: summary.totalOpen > 0 || openJobs > 0 ? 'watch' : 'pass',
      detail: `${summary.totalOpen} open queue record(s), ${openJobs} open record(s) in this result set.`,
    },
    {
      label: 'Age Risk',
      status: criticalJobs > 0 ? 'fail' : 'pass',
      detail: criticalJobs > 0 ? `${criticalJobs} record(s) are older than 24 hours.` : 'No 24-hour critical age risk in this result set.',
    },
    {
      label: 'Final Attempt',
      status: finalAttemptJobs > 0 ? 'watch' : 'pass',
      detail: finalAttemptJobs > 0 ? `${finalAttemptJobs} final-attempt record(s) require root-cause review before live retry.` : 'No final-attempt records in this result set.',
    },
  ];

  if (diagnostics.length > 0) {
    return {
      level: 'critical',
      title: 'Dead-Letter Read Blocked',
      summary: 'Dead-letter diagnostics must be cleared before retrying failed source jobs.',
      nextAction: 'Confirm Redis and queue infrastructure before retrying.',
      terminal: TERMINAL_5,
      command: QUEUE_DASHBOARD_COMMAND,
      liveRetryAllowed: false,
      gates,
    };
  }

  if (criticalJobs > 0) {
    return {
      level: 'critical',
      title: 'Investigate Before Retry',
      summary: 'One or more dead-letter records are old enough to suggest a root-cause fix may be required.',
      nextAction: 'Inspect old payloads and failure stacks before retrying.',
      terminal: TERMINAL_5,
      command: `curl -s "${LOCAL_BASE_URL}/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"`,
      liveRetryAllowed: false,
      gates,
    };
  }

  if (topSourceQueue && topSourceQueue.sourceQueue !== 'unknown') {
    return {
      level: summary.failed > 0 ? 'action' : 'watch',
      title: 'Dry-Run Source Queue',
      summary: `${topSourceQueue.sourceQueue} is the highest-priority recovery scope in this result set.`,
      nextAction: 'Run a source-queue dry-run retry before live retry.',
      terminal: TERMINAL_5,
      command: topSourceQueue.dryRunRetryCommand,
      liveRetryAllowed: true,
      gates,
    };
  }

  if (summary.totalOpen > 0 || openJobs > 0) {
    return {
      level: 'watch',
      title: 'Inspect Retry Status',
      summary: 'Open dead-letter records exist, but no specific source queue can be targeted automatically.',
      nextAction: 'Inspect retry route status and source queue metadata.',
      terminal: TERMINAL_5,
      command: RETRY_STATUS_COMMAND,
      liveRetryAllowed: false,
      gates,
    };
  }

  return {
    level: 'clear',
    title: 'No Dead-Letter Recovery Needed',
    summary: 'No open dead-letter recovery action is currently required.',
    nextAction: 'Keep status checks available while MLS sync work continues.',
    terminal: TERMINAL_5,
    command: STATUS_COMMAND,
    liveRetryAllowed: false,
    gates,
  };
}

function getCommandTemplates() {
  return {
    terminal: TERMINAL_5,
    deadLetterStatus: `curl -s "${LOCAL_BASE_URL}/api/admin/dead-letter"`,
    deadLetterOpen: `curl -s "${LOCAL_BASE_URL}/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"`,
    deadLetterFailed: `curl -s "${LOCAL_BASE_URL}/api/admin/dead-letter?state=failed&limit=25"`,
    deadLetterBySourceQueue: `curl -s "${LOCAL_BASE_URL}/api/admin/dead-letter?sourceQueue=mls-sync&states=waiting,delayed,failed&limit=25"`,
    status: STATUS_COMMAND,
    retryStatus: RETRY_STATUS_COMMAND,
    queueDashboard: QUEUE_DASHBOARD_COMMAND,
    alertDryRun: ALERT_DRY_RUN_COMMAND,
    dryRunRetryByQueue: `curl -s -X POST "${LOCAL_BASE_URL}/api/mls/retry?queue=mls-sync&dryRun=true&limit=10"`,
    liveRetryByQueue: `curl -s -X POST "${LOCAL_BASE_URL}/api/mls/retry?queue=mls-sync&dryRun=false&execute=true&limit=10"`,
    targetedDryRunRetry: `curl -s -X POST "${LOCAL_BASE_URL}/api/mls/retry?queue=mls-sync&dryRun=true&jobId=<jobId>"`,
    targetedLiveRetry: `curl -s -X POST "${LOCAL_BASE_URL}/api/mls/retry?queue=mls-sync&dryRun=false&execute=true&jobId=<jobId>"`,
  };
}

function getFilterSummary(filters: DeadLetterFilters) {
  return {
    limit: filters.limit,
    sourceQueue: filters.sourceQueue,
    states: filters.states,
    scanLimit: filters.scanLimit,
    terminal: TERMINAL_5,
  };
}

function sortJobs(jobs: DeadLetterJobSummary[]) {
  return [...jobs].sort((a, b) => {
    const stateWeight = (state: DeadLetterState | 'unknown') => {
      if (state === 'failed') return 0;
      if (state === 'delayed') return 1;
      if (state === 'waiting') return 2;
      if (state === 'active') return 3;
      if (state === 'completed') return 4;
      return 5;
    };
    const byState = stateWeight(a.state) - stateWeight(b.state);
    if (byState !== 0) return byState;

    return (b.failedAgeMinutes ?? -1) - (a.failedAgeMinutes ?? -1);
  });
}

async function getDeadLetterSummary(): Promise<DeadLetterSummary> {
  const [waiting, active, delayed, failed, completed, paused] = await Promise.all([
    deadLetterQueue.getWaitingCount(),
    deadLetterQueue.getActiveCount(),
    deadLetterQueue.getDelayedCount(),
    deadLetterQueue.getFailedCount(),
    deadLetterQueue.getCompletedCount(),
    deadLetterQueue.isPaused(),
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
    totalTerminal: completed,
  };
}

async function getDeadLetterJobs(filters: DeadLetterFilters): Promise<DeadLetterJobSummary[]> {
  const jobs = await deadLetterQueue.getJobs(filters.states, 0, filters.scanLimit - 1);
  const summaries = await Promise.all(
    jobs.map(async (job): Promise<DeadLetterJobSummary> => {
      const data = (job.data || {}) as DeadLetterJobData;
      const jobState = await job.getState().catch(() => 'unknown');
      const state = SUPPORTED_STATES.includes(jobState as DeadLetterState) ? (jobState as DeadLetterState) : 'unknown';
      const failedAt = data.failedAt || null;
      const failedAgeMinutes = getFailureAgeMinutes(failedAt, job.timestamp);

      return {
        id: job.id,
        name: job.name,
        state,
        severity: getSeverity(state, failedAgeMinutes),
        failedReason: data.failedReason || job.failedReason || null,
        sourceQueue: data.sourceQueue || null,
        sourceJobId: data.sourceJobId || null,
        sourceJobName: data.sourceJobName || null,
        failedAt,
        failedAgeMinutes,
        attemptsMade: data.attemptsMade ?? null,
        finalAttempt: data.finalAttempt ?? null,
        capturedAt: data.capturedAt || null,
        capturedBy: data.capturedBy || null,
        sourceJobState: data.sourceJobState || null,
        sourceJobAttempts: data.sourceJobAttempts ?? null,
        timestamp: toIsoDate(job.timestamp),
        processedOn: toIsoDate(job.processedOn),
        finishedOn: toIsoDate(job.finishedOn),
        stack: data.stack || null,
        payload: data.payload ?? null,
        retryHint: getRetryHint(data, state),
        retryCommand: getRetryStatusCommand(data),
        retryDryRunCommand: getRetryDryRunCommand(data),
        retryLiveCommand: getRetryLiveCommand(data),
        terminal: TERMINAL_5,
      };
    }),
  );

  const filteredJobs = filters.sourceQueue ? summaries.filter((job) => job.sourceQueue === filters.sourceQueue) : summaries;
  return sortJobs(filteredJobs).slice(0, filters.limit);
}

function getFallbackJobs(): DeadLetterJobSummary[] {
  return [];
}

function getTerminalMap() {
  return {
    nextApp: 'Terminal 1',
    mlsPageWorker: 'Terminal 2',
    coordinator: 'Terminal 3',
    dockerAndTypesense: 'Terminal 4',
    scriptsAndCurl: TERMINAL_5,
  };
}

function getDeadLetterEnvelope(
  request: NextRequest,
  summary: DeadLetterSummary,
  jobs: DeadLetterJobSummary[],
  diagnostics: DiagnosticIssue[],
  recommendations?: string[],
) {
  const filters = getFilters(request);

  return {
    module: 'REIE Dead-Letter Inspector',
    ...getInspectionMetadata(request),
    timeoutMs: DEAD_LETTER_TIMEOUT_MS,
    severity: getSummarySeverity(summary, diagnostics),
    auth: {
      configured: Boolean(getAdminKey()),
    },
    terminals: getTerminalMap(),
    commands: getCommandTemplates(),
    filters,
    filterSummary: getFilterSummary(filters),
    diagnostics,
    recommendations: recommendations || getRecommendations(summary, jobs, diagnostics),
    recoveryPlan: getRecoveryPlan(summary, jobs, diagnostics),
    summary,
    sourceQueues: summarizeSourceQueues(jobs),
    jobs,
    openStates: SUPPORTED_STATES.filter((state) => OPEN_STATES.has(state)),
  };
}

function unauthorizedResponse(request: NextRequest) {
  const summary = getFallbackSummary();
  const jobs = getFallbackJobs();
  const diagnostics: DiagnosticIssue[] = [];

  return json(
    {
      success: false,
      error: 'Admin access is required.',
      ...getDeadLetterEnvelope(request, summary, jobs, diagnostics, ['Provide the configured admin key before inspecting dead-letter records.']),
    },
    { status: 401 },
  );
}

export async function GET(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return unauthorizedResponse(request);
  }

  try {
    const filters = getFilters(request);

    const [summaryResult, jobsResult] = await Promise.all([
      withTimeout('deadLetter:summary', getFallbackSummary(), getDeadLetterSummary()),
      withTimeout('deadLetter:jobs', getFallbackJobs(), getDeadLetterJobs(filters)),
    ]);
    const diagnostics = [...(summaryResult.ok ? [] : [summaryResult.issue]), ...(jobsResult.ok ? [] : [jobsResult.issue])];
    const summary = summaryResult.value;
    const jobs = jobsResult.value;

    return json({
      success: true,
      ...getDeadLetterEnvelope(request, summary, jobs, diagnostics),
      redis: {
        url: redactRedisUrl(getRedisUrl()),
      },
    });
  } catch (error) {
    const summary = getFallbackSummary();
    const jobs = getFallbackJobs();
    const diagnostics = [errorIssue('deadLetter:route', error)];

    console.error('[REIE DEAD LETTER] Inspection failed:', getErrorMessage(error));

    return json(
      {
        success: false,
        error: 'Dead-letter inspection could not be read.',
        detail: getErrorMessage(error),
        ...getDeadLetterEnvelope(request, summary, jobs, diagnostics),
      },
      { status: 500 },
    );
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/dead-letter/route.ts
