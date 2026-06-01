import { NextRequest, NextResponse } from 'next/server';

import { processAlertQueue } from '@/lib/alerts/processAlertQueue';
import { prisma } from '@/lib/prisma';
import { assertAppDatabaseReady } from '@/lib/appDatabasePreflight';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ProcessAlertsBody = {
  limit?: number | string;
  dryRun?: boolean | string;
  execute?: boolean | string;
  live?: boolean | string;
  run?: boolean | string;
};

type AlertQueueStats = {
  pending: number;
  processing: number;
  sent: number;
  failed: number;
  skipped: number;
  actionable: number;
  terminal: number;
};

type ProcessAlertQueueResult = Awaited<ReturnType<typeof processAlertQueue>>;

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

type AlertExecutionPlan = {
  level: 'safe' | 'caution' | 'blocked';
  summary: string;
  nextAction: string;
  terminal: 'Terminal 5';
  nextCommand: string;
  liveAllowed: boolean;
  gates: Array<{
    label: string;
    status: 'pass' | 'watch' | 'fail';
    detail: string;
  }>;
};

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
const PROCESS_ALERTS_TIMEOUT_MS = 12_000;
const LOCAL_BASE_URL = 'http://localhost:3000';

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

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error || 'Unknown alert processing error.');
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

async function withTimeout<T>(area: string, fallback: T, promise: Promise<T>, timeoutMs = PROCESS_ALERTS_TIMEOUT_MS): Promise<DiagnosticResult<T>> {
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

function readLimit(value: unknown) {
  if (value === undefined || value === null || value === '') return DEFAULT_LIMIT;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;

  return Math.min(Math.max(Math.floor(parsed), 1), MAX_LIMIT);
}

function readBoolean(value: unknown) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;

  const normalized = String(value || '').trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function hasExplicitBoolean(value: unknown) {
  if (typeof value === 'boolean' || typeof value === 'number') return true;

  const normalized = String(value || '').trim().toLowerCase();
  return ['1', '0', 'true', 'false', 'yes', 'no'].includes(normalized);
}

async function readJsonBody(request: NextRequest): Promise<ProcessAlertsBody> {
  return request.json().catch(() => ({}));
}

function getFallbackStats(): AlertQueueStats {
  return {
    pending: 0,
    processing: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    actionable: 0,
    terminal: 0,
  };
}

async function getQueueStats(): Promise<AlertQueueStats> {
  const [pending, processing, sent, failed, skipped] = await Promise.all([
    prisma.alertQueue.count({ where: { status: 'pending' } }),
    prisma.alertQueue.count({ where: { status: 'processing' } }),
    prisma.alertQueue.count({ where: { status: 'sent' } }),
    prisma.alertQueue.count({ where: { status: 'failed' } }),
    prisma.alertQueue.count({ where: { status: 'skipped' } }),
  ]);

  return {
    pending,
    processing,
    sent,
    failed,
    skipped,
    actionable: pending,
    terminal: sent + failed + skipped,
  };
}

async function getStatsWithDiagnostics() {
  const result = await withTimeout('database:alertQueueStats', getFallbackStats(), getQueueStats());

  return {
    stats: result.value,
    diagnostics: result.ok ? [] : [result.issue],
  };
}

function getFallbackAlertResult(dryRun: boolean) {
  const now = new Date().toISOString();

  return {
    success: false,
    scanned: 0,
    actionable: 0,
    preview: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
    dryRun,
    mode: dryRun ? 'preview' : 'live',
    requestedLimit: 0,
    startedAt: now,
    completedAt: now,
    durationMs: 0,
    recommendation: 'Alert processing timed out or returned the fallback result.',
    alerts: [],
  } satisfies ProcessAlertQueueResult;
}

function readRequestOptions(request: NextRequest, body: ProcessAlertsBody = {}) {
  const queryLimit = request.nextUrl.searchParams.get('limit');
  const queryDryRun = request.nextUrl.searchParams.get('dryRun');
  const queryExecute = request.nextUrl.searchParams.get('execute');
  const queryLive = request.nextUrl.searchParams.get('live');
  const queryRun = request.nextUrl.searchParams.get('run');
  const dryRunExplicit = hasExplicitBoolean(body.dryRun ?? queryDryRun);
  const liveRequested = readBoolean(body.run ?? queryRun) || readBoolean(body.execute ?? queryExecute) || readBoolean(body.live ?? queryLive);
  const dryRunExplicitFalse = dryRunExplicit && !readBoolean(body.dryRun ?? queryDryRun);
  const dryRun = !(liveRequested || dryRunExplicitFalse);

  return {
    limit: readLimit(body.limit ?? queryLimit),
    dryRun,
    dryRunExplicit,
    run: liveRequested || dryRunExplicitFalse,
  };
}

function buildRecommendations(options: {
  dryRun: boolean;
  run: boolean;
  stats: AlertQueueStats;
  diagnostics: DiagnosticIssue[];
  result?: ProcessAlertQueueResult;
}) {
  const recommendations: string[] = [];

  if (options.diagnostics.length > 0) {
    recommendations.push('Resolve diagnostics before processing alert work.');
  }

  if (options.stats.failed > 0) {
    recommendations.push('Review failed alert rows before running another live batch.');
  }

  if (options.stats.processing > 0) {
    recommendations.push('Processing rows are already in flight; avoid overlapping live alert runs.');
  }

  if (!options.dryRun && options.run) {
    recommendations.push('Live alert processing can send client-facing email; use dryRun=1 first and confirm Resend, unsubscribe, tracking, and internal tests.');
  }

  if (options.result?.recommendation) {
    recommendations.push(options.result.recommendation);
  }

  if (options.stats.pending === 0) {
    recommendations.push('No pending alert work is currently queued.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Use dryRun=1 to preview the next alert batch before live processing.');
  }

  return recommendations;
}

function buildCommands(limit: number) {
  return {
    terminal: 'Terminal 5',
    status: `curl -s "${LOCAL_BASE_URL}/api/process-alerts?limit=${limit}"`,
    dryRun: `curl -s -X POST "${LOCAL_BASE_URL}/api/process-alerts?dryRun=true&limit=${limit}"`,
    live: `curl -s -X POST "${LOCAL_BASE_URL}/api/process-alerts?execute=true&limit=${limit}"`,
    alertWorkerDryRun: 'npm run run:worker:alerts:once',
    alertWorkerLiveOnce: 'npm run run:worker:alerts:once:live',
    queueDashboard: 'npm run run:queue-dashboard -- --failed --limit=5',
    mlsStatus: `curl -s "${LOCAL_BASE_URL}/api/mls/status"`,
    retryStatus: `curl -s "${LOCAL_BASE_URL}/api/mls/retry"`,
    deadLetter: `curl -s "${LOCAL_BASE_URL}/api/admin/dead-letter?sourceQueue=reie-alerts&limit=25"`,
    scriptDryRun: 'npm run run:alerts:dry',
    scriptLive: 'npm run run:alerts:live -- --limit 25',
  };
}

function buildExecutionPlan(options: {
  dryRun: boolean;
  run: boolean;
  limit: number;
  stats: AlertQueueStats;
  diagnostics: DiagnosticIssue[];
  result?: ProcessAlertQueueResult;
}): AlertExecutionPlan {
  const commands = buildCommands(options.limit);
  const resultFailed = options.result?.failed || 0;
  const resultSent = options.result?.sent || 0;
  const resultPreview = options.result?.preview || 0;
  const resultActionable = options.result?.actionable || 0;
  const gates: AlertExecutionPlan['gates'] = [
    {
      label: 'Diagnostics',
      status: options.diagnostics.length > 0 ? 'fail' : 'pass',
      detail: options.diagnostics.length > 0 ? `${options.diagnostics.length} alert diagnostic issue(s).` : 'Alert diagnostics are clear.',
    },
    {
      label: 'Pending Alerts',
      status: options.stats.pending > 0 ? 'watch' : 'pass',
      detail: `${options.stats.pending} pending, ${options.stats.processing} processing, ${resultActionable} actionable in this run.`,
    },
    {
      label: 'Preview Readiness',
      status: resultPreview > 0 ? 'watch' : 'pass',
      detail: `${resultPreview} preview-ready alert(s), ${options.result?.skipped || 0} skipped in this run.`,
    },
    {
      label: 'Failed Alert Rows',
      status: options.stats.failed > 0 || resultFailed > 0 ? 'fail' : 'pass',
      detail: `${options.stats.failed} failed stored row(s), ${resultFailed} failed in this run.`,
    },
    {
      label: 'Live Email Risk',
      status: !options.dryRun && options.run ? 'watch' : 'pass',
      detail: !options.dryRun && options.run ? `${resultSent} email send(s) reported by this live run.` : 'Dry-run or status mode; no client email send is requested.',
    },
  ];

  if (options.diagnostics.length > 0) {
    return {
      level: 'blocked',
      summary: 'Alert diagnostics must be cleared before live email processing.',
      nextAction: 'Inspect alert dead letters and queue status.',
      terminal: 'Terminal 5',
      nextCommand: commands.deadLetter,
      liveAllowed: false,
      gates,
    };
  }

  if (options.stats.failed > 0 || resultFailed > 0) {
    return {
      level: 'blocked',
      summary: 'Failed alert rows exist; inspect them before another live alert run.',
      nextAction: 'Inspect alert dead letters before live processing.',
      terminal: 'Terminal 5',
      nextCommand: commands.deadLetter,
      liveAllowed: false,
      gates,
    };
  }

  if (options.stats.processing > 0) {
    return {
      level: 'caution',
      summary: 'Alert rows are already processing; avoid overlapping live runs.',
      nextAction: 'Check queue dashboard before continuing.',
      terminal: 'Terminal 5',
      nextCommand: commands.queueDashboard,
      liveAllowed: false,
      gates,
    };
  }

  if (options.dryRun && options.stats.pending > 0) {
    return {
      level: 'caution',
      summary: options.result
        ? `Dry-run scanned ${options.result.scanned} row(s) and found ${resultPreview} preview-ready alert(s).`
        : 'Alert queue has pending work; dry-run is the recommended next step.',
      nextAction: options.result ? 'Review dry-run results before live processing.' : 'Preview the alert batch.',
      terminal: 'Terminal 5',
      nextCommand: options.result ? commands.live : commands.dryRun,
      liveAllowed: Boolean(options.result && resultPreview > 0),
      gates,
    };
  }

  if (!options.dryRun && options.run) {
    return {
      level: 'caution',
      summary: 'Live alert processing completed; verify resulting logs and alert status.',
      nextAction: 'Refresh alert status.',
      terminal: 'Terminal 5',
      nextCommand: commands.status,
      liveAllowed: false,
      gates,
    };
  }

  return {
    level: 'safe',
    summary: options.stats.pending > 0 ? 'Alert queue has pending work; dry-run is the recommended next step.' : 'No pending alert work is queued.',
    nextAction: options.stats.pending > 0 ? 'Run a dry-run alert preview.' : 'Keep status available for the next saved-search event.',
    terminal: 'Terminal 5',
    nextCommand: options.stats.pending > 0 ? commands.dryRun : commands.status,
    liveAllowed: options.stats.pending > 0,
    gates,
  };
}

async function processAlerts(request: NextRequest, body: ProcessAlertsBody = {}) {
  const options = readRequestOptions(request, body);
  await assertAppDatabaseReady({
    operation: options.dryRun ? 'alert API dry-run processing' : 'alert API live processing',
    recoveryCommand: 'npm run supabase:check',
  });

  const alertResult = await withTimeout(
    options.dryRun ? 'alerts:preview' : 'alerts:process',
    getFallbackAlertResult(options.dryRun),
    processAlertQueue({
      limit: options.limit,
      dryRun: options.dryRun,
    }),
  );
  const { stats, diagnostics: statsDiagnostics } = await getStatsWithDiagnostics();
  const diagnostics = [...(alertResult.ok ? [] : [alertResult.issue]), ...statsDiagnostics];

  return json({
    success: alertResult.value.success && diagnostics.length === 0,
    module: 'REIE Saved Search Alerts',
    mode: options.dryRun ? 'preview' : 'process',
    limit: options.limit,
    dryRun: options.dryRun,
    timeoutMs: PROCESS_ALERTS_TIMEOUT_MS,
    auth: {
      configured: Boolean(getAdminKey()),
    },
    commands: buildCommands(options.limit),
    diagnostics,
    executionPlan: buildExecutionPlan({
      dryRun: options.dryRun,
      run: true,
      limit: options.limit,
      stats,
      diagnostics,
      result: alertResult.value,
    }),
    recommendations: buildRecommendations({
      dryRun: options.dryRun,
      run: true,
      stats,
      diagnostics,
      result: alertResult.value,
    }),
    result: alertResult.value,
    stats,
  });
}

export async function GET(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const options = readRequestOptions(request);

    if (options.run || options.dryRunExplicit) {
      return await processAlerts(request, {
        dryRun: options.dryRun || !options.run,
        limit: options.limit,
      });
    }

    const { stats, diagnostics } = await getStatsWithDiagnostics();

    return json({
      success: diagnostics.length === 0,
      mode: 'status',
      module: 'REIE Saved Search Alerts',
      timeoutMs: PROCESS_ALERTS_TIMEOUT_MS,
      auth: {
        configured: Boolean(getAdminKey()),
      },
      commands: buildCommands(options.limit),
      diagnostics,
      executionPlan: buildExecutionPlan({
        dryRun: true,
        run: false,
        limit: options.limit,
        stats,
        diagnostics,
      }),
      recommendations: buildRecommendations({
        dryRun: true,
        run: false,
        stats,
        diagnostics,
      }),
      stats,
      nextRunHint: '/api/process-alerts?execute=true',
      nextDryRunHint: '/api/process-alerts?dryRun=1',
    });
  } catch (error) {
    console.error('Process alerts status error:', error);

    return json(
      {
        success: false,
        mode: 'status',
        error: 'Failed to read alert queue status.',
        diagnostics: [
          {
            area: 'process-alerts:get',
            message: getErrorMessage(error),
          },
        ],
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await readJsonBody(request);
    return await processAlerts(request, body);
  } catch (error) {
    console.error('Process alerts error:', error);

    return json(
      {
        success: false,
        mode: 'process',
        error: 'Failed to process alert queue.',
        diagnostics: [
          {
            area: 'process-alerts:post',
            message: getErrorMessage(error),
          },
        ],
      },
      { status: 500 },
    );
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/process-alerts/route.ts
