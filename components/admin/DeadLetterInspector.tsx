'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock3, Filter, RefreshCw, Search, ShieldAlert, Terminal, Workflow } from 'lucide-react';

type DeadLetterSummary = {
  name: string;
  waiting: number;
  active: number;
  delayed: number;
  failed: number;
  completed: number;
  paused: boolean;
  totalOpen?: number;
  totalTerminal?: number;
};

type DeadLetterSeverity = 'clear' | 'watch' | 'action' | 'critical';

type DeadLetterJob = {
  id?: string;
  name: string;
  state: string;
  failedReason: string | null;
  sourceQueue: string | null;
  sourceJobId: string | null;
  sourceJobName: string | null;
  failedAt: string | null;
  failedAgeMinutes?: number | null;
  attemptsMade: number | null;
  finalAttempt?: boolean | null;
  capturedAt?: string | null;
  capturedBy?: string | null;
  sourceJobState?: string | null;
  sourceJobAttempts?: number | null;
  timestamp: string | null;
  processedOn: string | null;
  finishedOn: string | null;
  stack: string | null;
  payload: unknown;
  retryHint?: string;
  retryCommand?: string;
  retryDryRunCommand?: string;
  retryLiveCommand?: string;
  terminal?: string;
  severity?: DeadLetterSeverity;
};

type SourceQueueSummary = {
  sourceQueue: string;
  jobs: number;
  oldestFailureAt: string | null;
  newestFailureAt: string | null;
  severity?: DeadLetterSeverity;
  dryRunRetryCommand?: string;
  liveRetryCommand?: string;
};

type DiagnosticIssue = {
  area: string;
  message: string;
};

type DeadLetterResponse = {
  success: boolean;
  module: string;
  generatedAt?: string;
  terminal?: 'Terminal 5';
  route?: '/api/admin/dead-letter';
  command?: string;
  timeoutMs: number;
  severity?: DeadLetterSeverity;
  auth?: {
    configured: boolean;
  };
  terminals?: {
    nextApp?: string;
    mlsPageWorker?: string;
    coordinator?: string;
    scriptsAndCurl?: string;
    dockerAndTypesense?: string;
  };
  commands?: {
    terminal?: string;
    deadLetterStatus?: string;
    deadLetterOpen?: string;
    deadLetterFailed?: string;
    deadLetterBySourceQueue?: string;
    status?: string;
    retryStatus?: string;
    queueDashboard?: string;
    alertDryRun?: string;
    dryRunRetryByQueue?: string;
    liveRetryByQueue?: string;
    targetedDryRunRetry?: string;
    targetedLiveRetry?: string;
  };
  filters: {
    limit: number;
    states: string[];
    sourceQueue: string | null;
    scanLimit?: number;
  };
  filterSummary?: {
    limit: number;
    states: string[];
    sourceQueue: string | null;
    scanLimit: number;
    terminal: string;
  };
  diagnostics: DiagnosticIssue[];
  recommendations?: string[];
  recoveryPlan?: RecoveryPlan;
  summary: DeadLetterSummary;
  sourceQueues?: SourceQueueSummary[];
  jobs: DeadLetterJob[];
  error?: string;
  detail?: string;
  redis?: {
    url: string;
  };
};

type LoadState = 'idle' | 'loading' | 'success' | 'error';

type RecoveryPlan = {
  level: 'clear' | 'watch' | 'action' | 'critical';
  title: string;
  summary: string;
  nextAction: string;
  terminal: string;
  command: string;
  liveRetryAllowed?: boolean;
  gates: Array<{
    label: string;
    status: 'pass' | 'watch' | 'fail';
    detail: string;
  }>;
};

const STATE_OPTIONS = ['waiting', 'active', 'delayed', 'failed', 'completed'];
const ADMIN_KEY_SESSION_STORAGE_KEY = 'reie.adminKey';

function formatDate(value: string | null) {
  if (!value) return 'Not recorded';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatAge(minutes: number | null | undefined) {
  if (minutes === null || minutes === undefined) return 'Age unknown';
  if (minutes < 60) return `${minutes}m old`;

  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h old`;

  return `${Math.floor(hours / 24)}d old`;
}

function stringifyPayload(value: unknown) {
  if (value === null || value === undefined) return 'No payload recorded.';

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function getRetryCommand(job: DeadLetterJob) {
  if (job.retryCommand) return job.retryCommand;
  if (!job.sourceQueue) return 'Inspect manually; source queue was not recorded.';
  const params = new URLSearchParams({ queue: job.sourceQueue });
  if (job.sourceJobId) params.set('jobId', job.sourceJobId);
  return `curl -s "http://localhost:3000/api/mls/retry?${params.toString()}"`;
}

function getRetryDryRunCommand(job: DeadLetterJob) {
  if (job.retryDryRunCommand) return job.retryDryRunCommand;
  if (!job.sourceQueue) return 'Inspect manually; source queue was not recorded.';
  const params = new URLSearchParams({ queue: job.sourceQueue, dryRun: 'true' });
  if (job.sourceJobId) params.set('jobId', job.sourceJobId);
  return `curl -s -X POST "http://localhost:3000/api/mls/retry?${params.toString()}"`;
}

function getRetryLiveCommand(job: DeadLetterJob) {
  if (job.retryLiveCommand) return job.retryLiveCommand;
  if (!job.sourceQueue) return 'Live retry unavailable; source queue was not recorded.';
  const params = new URLSearchParams({ queue: job.sourceQueue, dryRun: 'false', execute: 'true' });
  if (job.sourceJobId) params.set('jobId', job.sourceJobId);
  return `curl -s -X POST "http://localhost:3000/api/mls/retry?${params.toString()}"`;
}

function getSeverityClass(severity: DeadLetterSeverity | undefined) {
  if (severity === 'critical') return 'border-red-400/50 bg-red-500/15 text-red-100';
  if (severity === 'action') return 'border-amber-300/50 bg-amber-400/10 text-amber-100';
  if (severity === 'watch') return 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100';
  return 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100';
}

function getGateClass(status: RecoveryPlan['gates'][number]['status']) {
  if (status === 'fail') return 'border-red-400/30 bg-red-500/10 text-red-100';
  if (status === 'watch') return 'border-amber-300/30 bg-amber-400/10 text-amber-100';
  return 'border-emerald-300/20 bg-emerald-400/5 text-emerald-100';
}

function getSeverityLabel(severity: DeadLetterSeverity | undefined) {
  if (severity === 'critical') return 'Critical';
  if (severity === 'action') return 'Action';
  if (severity === 'watch') return 'Watch';
  return 'Clear';
}

function getStateBadgeClass(state: string) {
  if (state === 'failed') return 'border-red-500/50 bg-red-500/10 text-red-200';
  if (state === 'waiting') return 'border-amber-400/50 bg-amber-400/10 text-amber-100';
  if (state === 'active') return 'border-cyan-400/50 bg-cyan-400/10 text-cyan-100';
  if (state === 'completed') return 'border-emerald-400/50 bg-emerald-400/10 text-emerald-100';
  return 'border-slate-500/60 bg-slate-700/60 text-slate-200';
}

function getFinalAttemptLabel(job: DeadLetterJob) {
  if (job.finalAttempt === true) return 'Final attempt';
  if (job.finalAttempt === false) return 'Retry attempts remain';
  return 'Attempt status unknown';
}

function getFinalAttemptClass(job: DeadLetterJob) {
  if (job.finalAttempt === true) return 'border-red-400/40 bg-red-500/10 text-red-100';
  if (job.finalAttempt === false) return 'border-amber-300/40 bg-amber-400/10 text-amber-100';
  return 'border-slate-600 bg-slate-800 text-slate-300';
}

function getOpenJobCount(summary: DeadLetterSummary) {
  return summary.totalOpen ?? summary.waiting + summary.active + summary.delayed + summary.failed;
}

function getOldestOpenJob(jobs: DeadLetterJob[]) {
  return jobs
    .filter((job) => job.state !== 'completed')
    .reduce<DeadLetterJob | null>((oldest, job) => {
      if (job.failedAgeMinutes === null || job.failedAgeMinutes === undefined) return oldest;
      if (!oldest || (oldest.failedAgeMinutes ?? -1) < job.failedAgeMinutes) return job;
      return oldest;
    }, null);
}

function getRetryStatusCommand(response: DeadLetterResponse) {
  return response.commands?.retryStatus || 'curl -s "http://localhost:3000/api/mls/retry"';
}

function getOpenDeadLetterCommand(response: DeadLetterResponse) {
  return response.commands?.deadLetterOpen || 'curl -s "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"';
}

function getSourceQueueDryRunCommand(response: DeadLetterResponse, sourceQueue: string | null | undefined) {
  if (!sourceQueue) return response.commands?.dryRunRetryByQueue || 'curl -s -X POST "http://localhost:3000/api/mls/retry?queue=mls-sync&dryRun=true&limit=10"';

  const params = new URLSearchParams({
    queue: sourceQueue,
    dryRun: 'true',
    limit: '10',
  });

  return `curl -s -X POST "http://localhost:3000/api/mls/retry?${params.toString()}"`;
}

function getRecoveryPlan(response: DeadLetterResponse, topSourceQueue: SourceQueueSummary | null, oldestOpenJob: DeadLetterJob | null): RecoveryPlan {
  const openJobs = getOpenJobCount(response.summary);
  const criticalJobs = response.jobs.filter((job) => job.severity === 'critical').length;
  const finalAttemptJobs = response.jobs.filter((job) => job.finalAttempt === true).length;
  const sourceQueue = topSourceQueue?.sourceQueue || oldestOpenJob?.sourceQueue || null;
  const terminal = response.commands?.terminal || response.terminals?.scriptsAndCurl || 'Terminal 5';
  const gates: RecoveryPlan['gates'] = [
    {
      label: 'Diagnostics',
      status: response.diagnostics.length > 0 ? 'fail' : 'pass',
      detail: response.diagnostics.length > 0 ? `${response.diagnostics.length} inspector diagnostic issue(s).` : 'Inspector diagnostics are clear.',
    },
    {
      label: 'Open Records',
      status: openJobs > 0 ? 'watch' : 'pass',
      detail: openJobs > 0 ? `${openJobs} open dead-letter record(s) in scope.` : 'No open dead-letter records in scope.',
    },
    {
      label: 'Age Risk',
      status: criticalJobs > 0 ? 'fail' : oldestOpenJob ? 'watch' : 'pass',
      detail: criticalJobs > 0 ? `${criticalJobs} critical-age record(s).` : oldestOpenJob ? `Oldest open failure is ${formatAge(oldestOpenJob.failedAgeMinutes)}.` : 'No aging open failures.',
    },
    {
      label: 'Retry Attempt Risk',
      status: finalAttemptJobs > 0 ? 'watch' : 'pass',
      detail: finalAttemptJobs > 0 ? `${finalAttemptJobs} final-attempt record(s) should be reviewed before live retry.` : 'No final-attempt risk detected in this result set.',
    },
  ];

  if (response.diagnostics.length > 0) {
    return {
      level: 'critical',
      title: 'Inspector Blocked',
      summary: 'Clear dead-letter diagnostics before retrying source jobs.',
      nextAction: 'Refresh dead-letter status after Redis and workers are confirmed.',
      terminal,
      command: getOpenDeadLetterCommand(response),
      gates,
    };
  }

  if (criticalJobs > 0) {
    return {
      level: 'critical',
      title: 'Investigate First',
      summary: 'Some failures are old enough that a code or data fix may be required before retry.',
      nextAction: 'Review the oldest critical records and payloads.',
      terminal,
      command: getOpenDeadLetterCommand(response),
      gates,
    };
  }

  if (openJobs > 0 && sourceQueue) {
    return {
      level: 'action',
      title: 'Dry-Run Queue Retry',
      summary: `${sourceQueue} is the current priority recovery scope.`,
      nextAction: 'Run a dry-run retry for this source queue before any live retry.',
      terminal,
      command: getSourceQueueDryRunCommand(response, sourceQueue),
      gates,
    };
  }

  if (openJobs > 0) {
    return {
      level: 'watch',
      title: 'Inspect Retry Status',
      summary: 'Open records exist, but no source queue is safe to target automatically.',
      nextAction: 'Inspect retry status and source queue metadata.',
      terminal,
      command: getRetryStatusCommand(response),
      gates,
    };
  }

  return {
    level: 'clear',
    title: 'No Recovery Needed',
    summary: 'No open dead-letter records matched the active filters.',
    nextAction: 'Keep retry status available for the next queue event.',
    terminal,
    command: getRetryStatusCommand(response),
    gates,
  };
}

export default function DeadLetterInspector() {
  const [limit, setLimit] = useState(25);
  const [sourceQueue, setSourceQueue] = useState('');
  const [states, setStates] = useState<string[]>(['waiting', 'delayed', 'failed']);
  const [adminKey, setAdminKey] = useState(() => {
    if (typeof window === 'undefined') return '';

    try {
      return window.sessionStorage.getItem(ADMIN_KEY_SESSION_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [response, setResponse] = useState<DeadLetterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    params.set('states', states.join(','));
    if (sourceQueue.trim()) params.set('sourceQueue', sourceQueue.trim());
    return params.toString();
  }, [limit, sourceQueue, states]);

  const selectedStateLabel = states.length === STATE_OPTIONS.length ? 'All states' : states.join(', ');
  const sourceQueueSummaries = response?.sourceQueues || [];
  const topSourceQueue = sourceQueueSummaries[0] || null;
  const oldestOpenJob = response ? getOldestOpenJob(response.jobs) : null;
  const recommendations = response?.recommendations || [];
  const activeFilterSummary = response?.filterSummary || response?.filters || null;
  const recoveryPlan = response ? response.recoveryPlan || getRecoveryPlan(response, topSourceQueue, oldestOpenJob) : null;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const trimmedAdminKey = adminKey.trim();
      if (trimmedAdminKey) {
        window.sessionStorage.setItem(ADMIN_KEY_SESSION_STORAGE_KEY, trimmedAdminKey);
      } else {
        window.sessionStorage.removeItem(ADMIN_KEY_SESSION_STORAGE_KEY);
      }
    } catch {
      // Session storage can be unavailable in private or restricted browser contexts.
    }
  }, [adminKey]);

  const loadDeadLetters = useCallback(async () => {
    setLoadState('loading');
    setError(null);

    try {
      const headers: HeadersInit = {};
      if (adminKey.trim()) headers['x-admin-key'] = adminKey.trim();

      const result = await fetch(`/api/admin/dead-letter?${queryString}`, {
        cache: 'no-store',
        headers,
      });
      const data = (await result.json()) as DeadLetterResponse;

      if (!result.ok) {
        setResponse(data);
        setExpandedJobId(null);
        setLoadState('error');
        setError(data.error || `Dead-letter request failed with HTTP ${result.status}.`);
        return;
      }

      setResponse(data);
      setExpandedJobId(null);
      setLoadState('success');
    } catch (loadError) {
      setLoadState('error');
      setResponse(null);
      setError(loadError instanceof Error ? loadError.message : 'Dead-letter inspection failed.');
    }
  }, [adminKey, queryString]);

  function toggleState(state: string) {
    setStates((currentStates) => {
      if (currentStates.includes(state)) {
        const nextStates = currentStates.filter((item) => item !== state);
        return nextStates.length > 0 ? nextStates : ['waiting', 'delayed', 'failed'];
      }

      return [...currentStates, state];
    });
  }

  function applySourceQueueFilter(queue: string) {
    setSourceQueue(queue === 'unknown' ? '' : queue);
  }

  function toggleExpandedJob(job: DeadLetterJob) {
    const identity = job.id || `${job.sourceQueue || 'unknown'}-${job.sourceJobId || job.failedAt || job.name}`;
    setExpandedJobId((current) => (current === identity ? null : identity));
  }

  return (
    <section className="min-h-screen bg-[#06080c] px-5 py-6 text-slate-100 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/admin"
              data-testid="reie-dead-letter-back"
              className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase text-slate-500 transition hover:text-cyan-200"
            >
              <ArrowLeft size={14} />
              Master Control Panel
            </Link>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
              <ShieldAlert size={16} />
              REIE Operations
            </div>
            <h1 className="text-3xl font-black uppercase leading-none tracking-normal text-white sm:text-4xl">Dead-Letter Inspector</h1>
          </div>

          <button
            type="button"
            data-testid="reie-dead-letter-inspect"
            onClick={loadDeadLetters}
            disabled={loadState === 'loading'}
            className="inline-flex h-11 items-center justify-center gap-2 border border-cyan-300/40 bg-cyan-300 px-4 text-sm font-black uppercase tracking-normal text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={loadState === 'loading' ? 'animate-spin' : ''} />
            {loadState === 'loading' ? 'Inspecting' : 'Inspect'}
          </button>
        </header>

        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="border border-slate-800 bg-slate-950/80 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase text-white">
              <Filter size={16} className="text-cyan-300" />
              Filters
            </div>

            <label className="mb-4 block">
              <span className="mb-2 block text-xs font-bold uppercase text-slate-400">Limit</span>
              <input
                type="number"
                data-testid="reie-dead-letter-limit"
                min={1}
                max={200}
                value={limit}
                onChange={(event) => setLimit(Math.min(Math.max(Number(event.target.value) || 25, 1), 200))}
                className="h-10 w-full border border-slate-700 bg-slate-900 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-300"
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-2 block text-xs font-bold uppercase text-slate-400">Source Queue</span>
              <div className="flex h-10 items-center border border-slate-700 bg-slate-900 px-3 focus-within:border-cyan-300">
                <Search size={15} className="mr-2 text-slate-500" />
                <input
                  type="text"
                  data-testid="reie-dead-letter-source-queue"
                  value={sourceQueue}
                  onChange={(event) => setSourceQueue(event.target.value)}
                  placeholder="mls-page"
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-600"
                />
              </div>
            </label>

            <div className="mb-5">
              <div className="mb-2 text-xs font-bold uppercase text-slate-400">States</div>
              <div className="grid grid-cols-2 gap-2">
                {STATE_OPTIONS.map((state) => {
                  const selected = states.includes(state);

                  return (
                    <button
                      key={state}
                      type="button"
                      data-testid={`reie-dead-letter-state-${state}`}
                      onClick={() => toggleState(state)}
                      className={`h-9 border px-2 text-xs font-black uppercase transition ${
                        selected
                          ? 'border-cyan-300 bg-cyan-300 text-slate-950'
                          : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {state}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase text-slate-400">Admin Key</span>
              <input
                type="password"
                data-testid="reie-dead-letter-admin-key"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                placeholder="Required in production"
                className="h-10 w-full border border-slate-700 bg-slate-900 px-3 text-sm font-semibold text-white outline-none focus:border-cyan-300"
              />
            </label>

            <div className="mt-5 border-t border-slate-800 pt-4 text-xs leading-5 text-slate-400">
              <div>
                <span className="font-bold text-slate-300">States:</span> {selectedStateLabel}
              </div>
              <div>
                <span className="font-bold text-slate-300">Endpoint:</span> /api/admin/dead-letter
              </div>
              {response?.auth ? (
                <div>
                  <span className="font-bold text-slate-300">Admin key:</span> {response.auth.configured ? 'Configured' : 'Local bypass'}
                </div>
              ) : null}
              {response?.generatedAt ? (
                <div>
                  <span className="font-bold text-slate-300">Generated:</span> {formatDate(response.generatedAt)}
                </div>
              ) : null}
              {response?.filters.scanLimit ? (
                <div>
                  <span className="font-bold text-slate-300">Scan limit:</span> {response.filters.scanLimit}
                </div>
              ) : null}
              {response?.filterSummary?.terminal ? (
                <div>
                  <span className="font-bold text-slate-300">Inspection terminal:</span> {response.filterSummary.terminal}
                </div>
              ) : null}
              {response?.terminals?.dockerAndTypesense ? (
                <div>
                  <span className="font-bold text-slate-300">Redis:</span> {response.terminals.dockerAndTypesense}
                </div>
              ) : null}
              {response?.terminals?.mlsPageWorker ? (
                <div>
                  <span className="font-bold text-slate-300">MLS page worker:</span> {response.terminals.mlsPageWorker}
                </div>
              ) : null}
              {response?.terminals?.coordinator ? (
                <div>
                  <span className="font-bold text-slate-300">Coordinator:</span> {response.terminals.coordinator}
                </div>
              ) : null}
            </div>
          </aside>

          <main className="flex min-w-0 flex-col gap-4">
            {error ? (
              <div className="border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-100">
                <div className="mb-1 flex items-center gap-2 font-black uppercase">
                  <AlertTriangle size={16} />
                  Request Failed
                </div>
                {error}
              </div>
            ) : null}

            {response ? (
              <>
                <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                  <Metric
                    label="Severity"
                    testId="reie-dead-letter-severity"
                    value={getSeverityLabel(response.severity)}
                    tone={response.severity === 'critical' || response.severity === 'action' ? 'danger' : response.severity === 'watch' ? 'warning' : 'normal'}
                  />
                  <Metric
                    label="Open"
                    testId="reie-dead-letter-open-count"
                    value={getOpenJobCount(response.summary)}
                    tone={getOpenJobCount(response.summary) > 0 ? 'warning' : 'normal'}
                  />
                  <Metric label="Waiting" value={response.summary.waiting} />
                  <Metric label="Delayed" value={response.summary.delayed} />
                  <Metric label="Failed" value={response.summary.failed} tone={response.summary.failed > 0 ? 'danger' : 'normal'} />
                  <Metric label="Completed" value={response.summary.completed} />
                  <Metric label="Paused" value={response.summary.paused ? 'Yes' : 'No'} tone={response.summary.paused ? 'warning' : 'normal'} />
                </div>

                <div className="grid gap-3 lg:grid-cols-3">
                  <Signal
                    icon={<Workflow size={16} />}
                    label="Top Source Queue"
                    value={topSourceQueue ? topSourceQueue.sourceQueue : 'None'}
                    detail={topSourceQueue ? `${topSourceQueue.jobs} matching job${topSourceQueue.jobs === 1 ? '' : 's'}` : 'No queue concentration detected'}
                  />
                  <Signal
                    icon={<Clock3 size={16} />}
                    label="Oldest Open Failure"
                    value={oldestOpenJob ? formatAge(oldestOpenJob.failedAgeMinutes) : 'None'}
                    detail={oldestOpenJob ? oldestOpenJob.sourceQueue || 'Unknown queue' : 'No open dead-letter jobs in this result set'}
                  />
                  <Signal
                    icon={<ShieldAlert size={16} />}
                    label="Inspector Status"
                    value={getSeverityLabel(response.severity)}
                    detail={`${response.timeoutMs}ms timeout window`}
                  />
                </div>

                {activeFilterSummary ? (
                  <div
                    className="grid gap-3 lg:grid-cols-3"
                    data-testid="reie-dead-letter-filter-summary"
                    data-api-route={response.route || '/api/admin/dead-letter'}
                    data-api-terminal={response.filterSummary?.terminal || response.commands?.terminal || response.terminals?.scriptsAndCurl || 'Terminal 5'}
                    data-api-source-queue={activeFilterSummary.sourceQueue || 'all'}
                    data-api-states={activeFilterSummary.states.join(',')}
                    data-api-limit={activeFilterSummary.limit}
                    data-api-scan-limit={activeFilterSummary.scanLimit || activeFilterSummary.limit}
                  >
                    <Signal
                      icon={<Filter size={16} />}
                      label="Active States"
                      value={activeFilterSummary.states.join(', ')}
                      detail={`${activeFilterSummary.limit} shown / ${activeFilterSummary.scanLimit || activeFilterSummary.limit} scanned`}
                    />
                    <Signal
                      icon={<Search size={16} />}
                      label="Source Queue Filter"
                      value={activeFilterSummary.sourceQueue || 'All queues'}
                      detail="Use source queue cards below to narrow the result set"
                    />
                    <Signal
                      icon={<Terminal size={16} />}
                      label="Inspection Terminal"
                      value={response.filterSummary?.terminal || response.commands?.terminal || response.terminals?.scriptsAndCurl || 'Terminal 5'}
                      detail="Run retry and status commands from this terminal"
                    />
                  </div>
                ) : null}

                {response.route || response.command || response.terminal || response.generatedAt ? (
                  <div
                    className="border border-slate-800 bg-slate-950/70 p-4"
                    data-testid="reie-dead-letter-api-metadata"
                    data-api-generated-at={response.generatedAt || ''}
                    data-api-route={response.route || '/api/admin/dead-letter'}
                    data-api-terminal={response.terminal || response.commands?.terminal || response.terminals?.scriptsAndCurl || 'Terminal 5'}
                    data-api-command={response.command || getOpenDeadLetterCommand(response)}
                    data-api-source-queue={activeFilterSummary?.sourceQueue || 'all'}
                    data-api-states={activeFilterSummary?.states.join(',') || states.join(',')}
                    data-api-limit={activeFilterSummary?.limit || limit}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-black uppercase text-white">
                        <Terminal size={16} className="text-cyan-300" />
                        API Inspection
                      </div>
                      <span className="border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[10px] font-black uppercase text-cyan-100">
                        {response.terminal || response.commands?.terminal || response.terminals?.scriptsAndCurl || 'Terminal 5'}
                      </span>
                    </div>
                    <div className="grid gap-2 text-xs leading-5 text-slate-400 sm:grid-cols-3">
                      <div className="min-w-0 border border-slate-900 bg-slate-950/80 px-3 py-2">
                        <span className="block font-black uppercase text-slate-500">Generated</span>
                        <span className="mt-1 block break-words text-slate-200">{response.generatedAt || 'Not recorded'}</span>
                      </div>
                      <div className="min-w-0 border border-slate-900 bg-slate-950/80 px-3 py-2">
                        <span className="block font-black uppercase text-slate-500">Route</span>
                        <span className="mt-1 block break-words text-slate-200">{response.route || '/api/admin/dead-letter'}</span>
                      </div>
                      <div className="min-w-0 border border-slate-900 bg-slate-950/80 px-3 py-2">
                        <span className="block font-black uppercase text-slate-500">Filters</span>
                        <span className="mt-1 block break-words text-slate-200">
                          {activeFilterSummary ? `${activeFilterSummary.states.join(', ')} / limit ${activeFilterSummary.limit}` : 'Not recorded'}
                        </span>
                      </div>
                    </div>
                    <div
                      className="mt-3 min-w-0 border border-slate-800 bg-black/70 p-3"
                      data-testid="reie-dead-letter-api-command"
                      data-api-terminal={response.terminal || response.commands?.terminal || response.terminals?.scriptsAndCurl || 'Terminal 5'}
                      data-api-command={response.command || getOpenDeadLetterCommand(response)}
                    >
                      <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 API Check</div>
                      <code className="block max-w-full overflow-x-auto whitespace-nowrap text-xs text-slate-200">
                        {response.command || getOpenDeadLetterCommand(response)}
                      </code>
                    </div>
                  </div>
                ) : null}

                {recoveryPlan ? (
                  <div
                    className={`border p-4 ${getSeverityClass(recoveryPlan.level)}`}
                    data-testid="reie-dead-letter-recovery-plan"
                    data-recovery-level={recoveryPlan.level}
                    data-recovery-terminal={recoveryPlan.terminal}
                    data-recovery-command={recoveryPlan.command}
                    data-live-retry-allowed={typeof recoveryPlan.liveRetryAllowed === 'boolean' ? String(recoveryPlan.liveRetryAllowed) : 'unknown'}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-black uppercase">
                        <Workflow size={16} />
                        {recoveryPlan.title}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="border border-current/30 px-2 py-1 text-[10px] font-black uppercase">{recoveryPlan.level}</span>
                        {typeof recoveryPlan.liveRetryAllowed === 'boolean' ? (
                          <span className="border border-current/30 px-2 py-1 text-[10px] font-black uppercase">
                            Live retry {recoveryPlan.liveRetryAllowed ? 'available after dry-run' : 'blocked'}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <p className="text-sm leading-6">{recoveryPlan.summary}</p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                      {recoveryPlan.gates.map((gate) => (
                        <div key={gate.label} className={`border px-3 py-2 ${getGateClass(gate.status)}`}>
                          <div className="text-[10px] font-black uppercase">{gate.label}</div>
                          <div className="mt-1 text-xs leading-5 text-slate-400">{gate.detail}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 border border-slate-800 bg-black/40 p-3">
                      <div className="mb-2 text-[10px] font-black uppercase text-slate-400">
                        Next: {recoveryPlan.terminal} / {recoveryPlan.nextAction}
                      </div>
                      <code className="block overflow-x-auto whitespace-nowrap text-xs text-slate-200">{recoveryPlan.command}</code>
                    </div>
                  </div>
                ) : null}

                {recommendations.length > 0 ? (
                  <div className={`border p-4 text-sm ${getSeverityClass(response.severity)}`} data-testid="reie-dead-letter-recommendations">
                    <div className="mb-3 flex items-center gap-2 font-black uppercase">
                      <ShieldAlert size={16} />
                      Recommendations
                    </div>
                    <div className="space-y-2">
                      {recommendations.map((recommendation) => (
                        <p key={recommendation} className="leading-6">
                          {recommendation}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}

                {response.commands ? (
                  <div
                    className="border border-slate-800 bg-slate-950/70 p-4"
                    data-testid="reie-dead-letter-command-center"
                    data-api-route={response.route || '/api/admin/dead-letter'}
                    data-api-terminal={response.commands.terminal || response.terminals?.scriptsAndCurl || 'Terminal 5'}
                    data-command-status={response.commands.deadLetterStatus || response.commands.status || ''}
                    data-command-dry-run-retry={response.commands.dryRunRetryByQueue || response.commands.targetedDryRunRetry || ''}
                    data-command-live-retry={response.commands.liveRetryByQueue || response.commands.targetedLiveRetry || ''}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-black uppercase text-white">
                        <Terminal size={16} className="text-cyan-300" />
                        Operations Commands
                      </div>
                      <div className="text-xs font-bold uppercase text-slate-500">{response.commands.terminal || response.terminals?.scriptsAndCurl || 'Terminal 5'}</div>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-2">
                      {response.commands.deadLetterStatus || response.commands.status ? (
                        <CommandBlock label="Dead-Letter Status" command={response.commands.deadLetterStatus || response.commands.status || ''} />
                      ) : null}
                      {response.commands.deadLetterOpen ? <CommandBlock label="Open Dead Letters" command={response.commands.deadLetterOpen} /> : null}
                      {response.commands.deadLetterFailed ? <CommandBlock label="Failed Dead Letters" command={response.commands.deadLetterFailed} /> : null}
                      {response.commands.deadLetterBySourceQueue ? <CommandBlock label="Filter By Source Queue" command={response.commands.deadLetterBySourceQueue} /> : null}
                      {response.commands.retryStatus ? <CommandBlock label="Retry Status" command={response.commands.retryStatus} /> : null}
                      {response.commands.status ? <CommandBlock label="MLS Status" command={response.commands.status} /> : null}
                      {response.commands.queueDashboard ? <CommandBlock label="Queue Dashboard" command={response.commands.queueDashboard} /> : null}
                      {response.commands.alertDryRun ? <CommandBlock label="Alert Dry Run" command={response.commands.alertDryRun} tone="safe" /> : null}
                      {response.commands.dryRunRetryByQueue ? <CommandBlock label="Dry-Run Queue Retry" command={response.commands.dryRunRetryByQueue} tone="safe" /> : null}
                      {response.commands.liveRetryByQueue ? <CommandBlock label="Live Queue Retry" command={response.commands.liveRetryByQueue} tone="danger" /> : null}
                      {response.commands.targetedDryRunRetry ? (
                        <CommandBlock label="Targeted Dry-Run Retry" command={response.commands.targetedDryRunRetry} tone="safe" />
                      ) : null}
                      {response.commands.targetedLiveRetry ? (
                        <CommandBlock label="Targeted Live Retry" command={response.commands.targetedLiveRetry} tone="danger" />
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {sourceQueueSummaries.length > 0 ? (
                  <div
                    className="border border-slate-800 bg-slate-950/70"
                    data-testid="reie-dead-letter-source-queues"
                    data-api-route={response.route || '/api/admin/dead-letter'}
                    data-source-queue-count={sourceQueueSummaries.length}
                    data-top-source-queue={topSourceQueue?.sourceQueue || 'none'}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                      <h2 className="text-sm font-black uppercase text-white">Source Queues</h2>
                      <div className="text-xs font-bold uppercase text-slate-500">{sourceQueueSummaries.length} grouped</div>
                    </div>
                    <div className="grid gap-px bg-slate-800 md:grid-cols-2 xl:grid-cols-4">
                      {sourceQueueSummaries.map((queue) => (
                        <button
                          key={queue.sourceQueue}
                          type="button"
                          data-testid={`reie-dead-letter-source-queue-${queue.sourceQueue}`}
                          data-source-queue={queue.sourceQueue}
                          data-source-queue-jobs={queue.jobs}
                          data-source-queue-severity={queue.severity || 'clear'}
                          data-command-dry-run-retry={queue.dryRunRetryCommand || ''}
                          data-command-live-retry={queue.liveRetryCommand || ''}
                          onClick={() => applySourceQueueFilter(queue.sourceQueue)}
                          className="bg-slate-950 p-4 text-left transition hover:bg-slate-900"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="text-[11px] font-black uppercase text-cyan-300">{queue.sourceQueue}</div>
                            <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getSeverityClass(queue.severity)}`}>
                              {getSeverityLabel(queue.severity)}
                            </span>
                          </div>
                          <div className="mt-2 text-2xl font-black text-white">{queue.jobs}</div>
                          <div className="mt-2 text-xs leading-5 text-slate-500">
                            Newest {formatDate(queue.newestFailureAt)}
                            <br />
                            Oldest {formatDate(queue.oldestFailureAt)}
                          </div>
                          {queue.dryRunRetryCommand ? (
                            <code className="mt-3 block overflow-hidden text-ellipsis whitespace-nowrap border border-slate-800 bg-black/50 px-2 py-1 text-[10px] text-slate-400">
                              {queue.dryRunRetryCommand}
                            </code>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {response.diagnostics.length > 0 ? (
                  <div className="border border-amber-400/40 bg-amber-950/30 p-4 text-sm text-amber-100">
                    <div className="mb-2 flex items-center gap-2 font-black uppercase">
                      <AlertTriangle size={16} />
                      Diagnostics
                    </div>
                    <div className="space-y-1">
                      {response.diagnostics.map((issue) => (
                        <div key={`${issue.area}-${issue.message}`}>
                          <span className="font-bold">{issue.area}:</span> {issue.message}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border border-emerald-400/30 bg-emerald-950/20 p-3 text-sm font-bold text-emerald-100">
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Dead-letter inspection completed without diagnostics.
                    </span>
                  </div>
                )}

                <div className="overflow-hidden border border-slate-800 bg-slate-950/70">
                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                    <h2 className="text-sm font-black uppercase text-white">Jobs</h2>
                    <div className="text-xs font-bold uppercase text-slate-500">{response.jobs.length} shown</div>
                  </div>

                  {response.jobs.length === 0 ? (
                    <div className="p-8 text-center text-sm font-semibold text-slate-500">No dead-letter jobs matched these filters.</div>
                  ) : (
                    <div className="divide-y divide-slate-800">
                      {response.jobs.map((job) => {
                        const identity = job.id || `${job.sourceQueue || 'unknown'}-${job.sourceJobId || job.failedAt || job.name}`;
                        const expanded = expandedJobId === identity;

                        return (
                          <article
                            key={identity}
                            className="p-4"
                            data-job-id={job.id || 'untracked'}
                            data-job-source-queue={job.sourceQueue || 'unknown'}
                            data-job-state={job.state}
                            data-job-severity={job.severity || 'clear'}
                            data-job-terminal={job.terminal || 'Terminal 5'}
                            data-command-status={getRetryCommand(job)}
                            data-command-dry-run-retry={getRetryDryRunCommand(job)}
                            data-command-live-retry={getRetryLiveCommand(job)}
                          >
                            <button
                              type="button"
                              data-testid={`reie-dead-letter-job-${identity}`}
                              onClick={() => toggleExpandedJob(job)}
                              className="grid w-full gap-3 text-left lg:grid-cols-[150px_minmax(0,1fr)_190px]"
                            >
                              <div>
                                <div className="flex flex-wrap gap-2">
                                  <span className={`inline-flex border px-2 py-1 text-[11px] font-black uppercase ${getStateBadgeClass(job.state)}`}>
                                    {job.state}
                                  </span>
                                  <span className={`inline-flex border px-2 py-1 text-[11px] font-black uppercase ${getSeverityClass(job.severity)}`}>
                                    {getSeverityLabel(job.severity)}
                                  </span>
                                  <span className={`inline-flex border px-2 py-1 text-[11px] font-black uppercase ${getFinalAttemptClass(job)}`}>
                                    {getFinalAttemptLabel(job)}
                                  </span>
                                </div>
                                <div className="mt-2 text-xs text-slate-500">Job {job.id || 'untracked'}</div>
                              </div>

                              <div className="min-w-0">
                                <div className="truncate text-sm font-black uppercase text-white">{job.sourceQueue || 'Unknown queue'}</div>
                                <div className="mt-1 truncate text-sm text-slate-300">{job.failedReason || 'No failure reason recorded.'}</div>
                                <div className="mt-2 text-xs text-slate-500">
                                  Source job {job.sourceJobId || 'unknown'} / {job.sourceJobName || job.name}
                                </div>
                                {job.retryHint ? <div className="mt-2 text-xs font-semibold text-cyan-200">{job.retryHint}</div> : null}
                              </div>

                              <div className="text-left text-xs text-slate-400 lg:text-right">
                                <div className="font-bold text-slate-300">{formatDate(job.failedAt || job.timestamp)}</div>
                                <div>{formatAge(job.failedAgeMinutes)}</div>
                                <div>
                                  Attempts {job.attemptsMade ?? 0}
                                  {job.sourceJobAttempts ? ` / ${job.sourceJobAttempts}` : ''}
                                </div>
                              </div>
                            </button>

                            {expanded ? (
                              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                                <div className="grid gap-px bg-slate-800 lg:col-span-2 lg:grid-cols-4">
                                  <MetadataCell label="Captured" value={formatDate(job.capturedAt || job.timestamp)} />
                                  <MetadataCell label="Captured By" value={job.capturedBy || 'Not recorded'} />
                                  <MetadataCell label="Source State" value={job.sourceJobState || job.state || 'Unknown'} />
                                  <MetadataCell label="Final Attempt" value={getFinalAttemptLabel(job)} />
                                </div>
                                <div className="border border-cyan-300/30 bg-cyan-950/20 p-3 lg:col-span-2">
                                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-cyan-200">
                                    <Terminal size={14} />
                                    {job.terminal || 'Terminal 5'} Status Check
                                  </div>
                                  <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                                    {getRetryCommand(job)}
                                  </code>
                                </div>
                                <div className="border border-emerald-300/30 bg-emerald-950/20 p-3 lg:col-span-2">
                                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-emerald-200">
                                    <Terminal size={14} />
                                    {job.terminal || 'Terminal 5'} Dry-Run Retry
                                  </div>
                                  <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                                    {getRetryDryRunCommand(job)}
                                  </code>
                                </div>
                                <div className="border border-amber-300/40 bg-amber-950/20 p-3 lg:col-span-2">
                                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-amber-100">
                                    <AlertTriangle size={14} />
                                    {job.terminal || 'Terminal 5'} Live Retry
                                  </div>
                                  <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                                    {getRetryLiveCommand(job)}
                                  </code>
                                </div>
                                <pre className="max-h-72 overflow-auto border border-slate-800 bg-black p-3 text-xs leading-5 text-slate-300">
                                  {stringifyPayload(job.payload)}
                                </pre>
                                <pre className="max-h-72 overflow-auto border border-slate-800 bg-black p-3 text-xs leading-5 text-red-100">
                                  {job.stack || 'No stack recorded.'}
                                </pre>
                              </div>
                            ) : null}
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex min-h-[360px] items-center justify-center border border-slate-800 bg-slate-950/70 p-8 text-center">
                <div>
                  <ShieldAlert className="mx-auto mb-4 text-cyan-300" size={36} />
                  <h2 className="text-lg font-black uppercase text-white">Ready To Inspect</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                    Load recent dead-letter records to decide whether a failed job needs a code fix, a targeted retry, or no action.
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  testId,
  value,
  tone = 'normal',
}: {
  label: string;
  testId?: string;
  value: number | string;
  tone?: 'normal' | 'warning' | 'danger';
}) {
  const valueClass = tone === 'danger' ? 'text-red-200' : tone === 'warning' ? 'text-amber-100' : 'text-white';

  return (
    <div data-testid={testId} className="border border-slate-800 bg-slate-950/80 p-4">
      <div className="text-[11px] font-black uppercase text-slate-500">{label}</div>
      <div className={`mt-2 text-2xl font-black ${valueClass}`}>{value}</div>
    </div>
  );
}

function Signal({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="border border-slate-800 bg-slate-950/80 p-4">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-black uppercase text-slate-500">
        <span className="text-cyan-300">{icon}</span>
        {label}
      </div>
      <div className="truncate text-lg font-black text-white">{value}</div>
      <div className="mt-2 text-xs leading-5 text-slate-500">{detail}</div>
    </div>
  );
}

function MetadataCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-slate-950 p-3">
      <div className="text-[10px] font-black uppercase text-slate-500">{label}</div>
      <div className="mt-1 truncate text-xs font-bold text-slate-200">{value}</div>
    </div>
  );
}

function CommandBlock({ label, command, tone = 'normal' }: { label: string; command: string; tone?: 'normal' | 'safe' | 'danger' }) {
  const labelClass = tone === 'danger' ? 'text-amber-100' : tone === 'safe' ? 'text-emerald-200' : 'text-cyan-200';

  return (
    <div className="min-w-0 border border-slate-800 bg-black/40 p-3">
      <div className={`mb-2 text-xs font-black uppercase ${labelClass}`}>{label}</div>
      <code className="block overflow-x-auto whitespace-nowrap text-xs text-slate-200">{command}</code>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/admin/DeadLetterInspector.tsx
