import 'dotenv/config';
import { pathToFileURL } from 'node:url';
import { Job, Worker } from 'bullmq';
import { fetchMLSGridListings } from '../lib/mls/mlsGridClient.js';
import {
  type BatchListingFailure,
  type BatchListingWarning,
  type BatchMediaDiagnostics,
  type BatchProcessPlan,
  processListingsBatch,
} from '../lib/mls/processListingsBatch.js';
import { assertWorkerDatabaseReady } from '../lib/queue/databasePreflight.js';
import { enqueueDeadLetterFromJob } from '../lib/queue/deadLetterQueue.js';
import { MLS_PAGE_QUEUE_NAME, type MlsPageJobData, normalizeMlsPageJobData } from '../lib/queue/mlsPageQueue.js';
import { getRedisConnection } from '../lib/queue/redis.js';

type MlsPageJobResult = {
  durationMs: number;
  failed: number;
  failures: BatchListingFailure[];
  fetched: number;
  indexAttempted: number;
  indexFailed: number;
  indexSucceeded: number;
  lastSync: string;
  mediaDiagnostics: BatchMediaDiagnostics;
  plan: BatchProcessPlan;
  processed: number;
  skip: number;
  skipped: number;
  succeeded: number;
  top: number;
  truncatedFailures: number;
  warningCount: number;
  warnings: BatchListingWarning[];
};

type MlsPageWorkerConfig = {
  concurrency: number;
  lockDurationMs: number;
  maxFailureDetails: number;
  maxJobs: number;
  maxStalledCount: number;
  maxWarningDetails: number;
  once: boolean;
  stalledIntervalMs: number;
};

type EnvMap = Record<string, string | undefined>;

export type MlsPageWorkerPlan = {
  queueName: typeof MLS_PAGE_QUEUE_NAME;
  terminal: 'Terminal 2';
  recoveryTerminal: 'Terminal 5';
  config: MlsPageWorkerConfig;
  commands: {
    status: string;
    retryStatus: string;
    queueDashboard: string;
    supabaseCheck: string;
    supabaseCheckJson: string;
    deadLetter: string;
    dryRunRetry: string;
    liveRetry: string;
  };
  databasePreflight: {
    queue: typeof MLS_PAGE_QUEUE_NAME;
    worker: 'MLS page worker';
    recoveryCommand: typeof SUPABASE_CHECK_JSON_COMMAND;
  };
  bounded: {
    concurrency: boolean;
    lockDurationMs: boolean;
    maxFailureDetails: boolean;
    maxJobs: boolean;
    maxStalledCount: boolean;
    maxWarningDetails: boolean;
    stalledIntervalMs: boolean;
  };
  limits: {
    minConcurrency: number;
    maxConcurrency: number;
    minLockDurationMs: number;
    maxLockDurationMs: number;
    minMaxFailureDetails: number;
    maxMaxFailureDetails: number;
    minMaxJobs: number;
    maxMaxJobs: number;
    minMaxStalledCount: number;
    maxMaxStalledCount: number;
    minMaxWarningDetails: number;
    maxMaxWarningDetails: number;
    minStalledIntervalMs: number;
    maxStalledIntervalMs: number;
  };
};

const LOCAL_BASE_URL = 'http://localhost:3000';
const TERMINAL_2 = 'Terminal 2';
const TERMINAL_5 = 'Terminal 5';
const SUPABASE_CHECK_COMMAND = 'npm run supabase:check';
const SUPABASE_CHECK_JSON_COMMAND = 'npm run supabase:check:json';

function readNumber(value: string | undefined, fallback: number, min: number, max: number) {
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;

  return Math.min(Math.max(Math.floor(parsed), min), max);
}

function isBoundedNumber(value: string | undefined, fallback: number, min: number, max: number) {
  if (!value) return false;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return true;

  const floored = Math.floor(parsed);
  return readNumber(value, fallback, min, max) !== floored;
}

function readBoolean(value: string | undefined) {
  if (!value) return false;
  return ['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase());
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error || 'Unknown MLS page worker error.');
}

function buildStatusCommand() {
  return `curl -s "${LOCAL_BASE_URL}/api/mls/status"`;
}

function buildRetryStatusCommand() {
  return `curl -s "${LOCAL_BASE_URL}/api/mls/retry"`;
}

function buildQueueDashboardCommand() {
  return 'npm run run:queue-dashboard -- --failed --limit=5';
}

function buildDeadLetterCommand(limit = 25) {
  const params = new URLSearchParams({
    sourceQueue: MLS_PAGE_QUEUE_NAME,
    states: 'waiting,delayed,failed',
    limit: String(limit),
  });

  return `curl -s "${LOCAL_BASE_URL}/api/admin/dead-letter?${params.toString()}"`;
}

function buildRetryCommand(options: { execute?: boolean; jobId?: string; limit?: number } = {}) {
  const params = new URLSearchParams({
    queue: MLS_PAGE_QUEUE_NAME,
    dryRun: options.execute ? 'false' : 'true',
  });

  if (options.execute) params.set('execute', 'true');
  if (options.jobId) params.set('jobId', options.jobId);
  if (options.limit) params.set('limit', String(options.limit));

  return `curl -s -X POST "${LOCAL_BASE_URL}/api/mls/retry?${params.toString()}"`;
}

function normalizeJobData(data: Partial<MlsPageJobData>): MlsPageJobData {
  return normalizeMlsPageJobData(data);
}

function getConfig(env: EnvMap = process.env): MlsPageWorkerConfig {
  return {
    concurrency: readNumber(env.MLS_PAGE_WORKER_CONCURRENCY, 1, 1, 5),
    lockDurationMs: readNumber(env.MLS_PAGE_WORKER_LOCK_DURATION_MS, 10 * 60 * 1000, 60_000, 60 * 60 * 1000),
    maxFailureDetails: readNumber(env.MLS_PAGE_WORKER_MAX_FAILURE_DETAILS, 25, 0, 100),
    maxJobs: readNumber(env.MLS_PAGE_WORKER_MAX_JOBS, 1, 1, 100),
    maxStalledCount: readNumber(env.MLS_PAGE_WORKER_MAX_STALLED_COUNT, 1, 0, 5),
    maxWarningDetails: readNumber(env.MLS_PAGE_WORKER_MAX_WARNING_DETAILS, 25, 0, 100),
    once: readBoolean(env.MLS_PAGE_WORKER_ONCE),
    stalledIntervalMs: readNumber(env.MLS_PAGE_WORKER_STALLED_INTERVAL_MS, 60_000, 10_000, 10 * 60 * 1000),
  };
}

export function getMlsPageWorkerPlan(env: EnvMap = process.env): MlsPageWorkerPlan {
  return {
    queueName: MLS_PAGE_QUEUE_NAME,
    terminal: TERMINAL_2,
    recoveryTerminal: TERMINAL_5,
    config: getConfig(env),
    commands: {
      status: buildStatusCommand(),
      retryStatus: buildRetryStatusCommand(),
      queueDashboard: buildQueueDashboardCommand(),
      supabaseCheck: SUPABASE_CHECK_COMMAND,
      supabaseCheckJson: SUPABASE_CHECK_JSON_COMMAND,
      deadLetter: buildDeadLetterCommand(),
      dryRunRetry: buildRetryCommand({ limit: 10 }),
      liveRetry: buildRetryCommand({ execute: true, limit: 10 }),
    },
    databasePreflight: {
      queue: MLS_PAGE_QUEUE_NAME,
      worker: 'MLS page worker',
      recoveryCommand: SUPABASE_CHECK_JSON_COMMAND,
    },
    bounded: {
      concurrency: isBoundedNumber(env.MLS_PAGE_WORKER_CONCURRENCY, 1, 1, 5),
      lockDurationMs: isBoundedNumber(env.MLS_PAGE_WORKER_LOCK_DURATION_MS, 10 * 60 * 1000, 60_000, 60 * 60 * 1000),
      maxFailureDetails: isBoundedNumber(env.MLS_PAGE_WORKER_MAX_FAILURE_DETAILS, 25, 0, 100),
      maxJobs: isBoundedNumber(env.MLS_PAGE_WORKER_MAX_JOBS, 1, 1, 100),
      maxStalledCount: isBoundedNumber(env.MLS_PAGE_WORKER_MAX_STALLED_COUNT, 1, 0, 5),
      maxWarningDetails: isBoundedNumber(env.MLS_PAGE_WORKER_MAX_WARNING_DETAILS, 25, 0, 100),
      stalledIntervalMs: isBoundedNumber(env.MLS_PAGE_WORKER_STALLED_INTERVAL_MS, 60_000, 10_000, 10 * 60 * 1000),
    },
    limits: {
      minConcurrency: 1,
      maxConcurrency: 5,
      minLockDurationMs: 60_000,
      maxLockDurationMs: 60 * 60 * 1000,
      minMaxFailureDetails: 0,
      maxMaxFailureDetails: 100,
      minMaxJobs: 1,
      maxMaxJobs: 100,
      minMaxStalledCount: 0,
      maxMaxStalledCount: 5,
      minMaxWarningDetails: 0,
      maxMaxWarningDetails: 100,
      minStalledIntervalMs: 10_000,
      maxStalledIntervalMs: 10 * 60 * 1000,
    },
  };
}

async function processPageJob(job: Job<MlsPageJobData>, config: MlsPageWorkerConfig): Promise<MlsPageJobResult> {
  const data = normalizeJobData(job.data);
  const startedMs = Date.now();

  console.log(`REIE MLS page job ${job.id} started:`, data);

  const listings = await fetchMLSGridListings(data);
  const summary = await processListingsBatch(listings, {
    maxFailures: config.maxFailureDetails,
  });
  const warnings = summary.warnings.slice(0, config.maxWarningDetails);

  if (summary.failures.length > 0) {
    console.warn(`REIE MLS page job ${job.id} listing failures:`, summary.failures);
  }

  if (warnings.length > 0) {
    console.warn(`REIE MLS page job ${job.id} listing warnings:`, warnings);
  }

  return {
    skip: data.skip,
    top: data.top,
    lastSync: data.lastSync,
    durationMs: Date.now() - startedMs,
    fetched: listings.length,
    plan: summary.plan,
    processed: summary.processed,
    succeeded: summary.succeeded,
    failed: summary.failed,
    skipped: summary.skipped,
    indexAttempted: summary.indexAttempted,
    indexSucceeded: summary.indexSucceeded,
    indexFailed: summary.indexFailed,
    mediaDiagnostics: summary.mediaDiagnostics,
    failures: summary.failures,
    truncatedFailures: summary.truncatedFailures,
    warningCount: summary.warnings.length,
    warnings,
  };
}

function shouldDeadLetterFailedJob(job: Job<MlsPageJobData> | undefined) {
  if (!job) return true;

  const configuredAttempts = job.opts.attempts ?? 1;
  return job.attemptsMade >= configuredAttempts;
}

function getFailureOperations(job: Job<MlsPageJobData> | undefined, finalAttempt: boolean) {
  const jobId = job?.id;

  return {
    workerTerminal: TERMINAL_2,
    recoveryTerminal: TERMINAL_5,
    finalAttempt,
    statusCommand: buildStatusCommand(),
    retryStatusCommand: buildRetryStatusCommand(),
    queueDashboardCommand: buildQueueDashboardCommand(),
    supabaseCheckCommand: SUPABASE_CHECK_COMMAND,
    supabaseCheckJsonCommand: SUPABASE_CHECK_JSON_COMMAND,
    deadLetterCommand: buildDeadLetterCommand(),
    dryRunRetryCommand: buildRetryCommand({
      jobId,
      limit: jobId ? undefined : 10,
    }),
    liveRetryCommand: finalAttempt
      ? buildRetryCommand({
          execute: true,
          jobId,
          limit: jobId ? undefined : 10,
        })
      : 'Live retry is not recommended until BullMQ retry attempts are exhausted.',
  };
}

function createMlsPageWorker(config: MlsPageWorkerConfig) {
  let worker: Worker<MlsPageJobData, MlsPageJobResult>;

  worker = new Worker<MlsPageJobData, MlsPageJobResult>(
    MLS_PAGE_QUEUE_NAME,
    async (job) => {
      try {
        return await processPageJob(job, config);
      } finally {
        if (config.once) {
          await worker.pause(true);
        }
      }
    },
    {
      connection: getRedisConnection(),
      concurrency: config.concurrency,
      lockDuration: config.lockDurationMs,
      maxStalledCount: config.maxStalledCount,
      stalledInterval: config.stalledIntervalMs,
    },
  );

  worker.on('active', (job) => {
    console.log(`REIE MLS page job ${job.id} active:`, {
      attemptsMade: job.attemptsMade,
      configuredAttempts: job.opts.attempts ?? 1,
      name: job.name,
    });
  });

  worker.on('completed', (job, result) => {
    console.log(`REIE MLS page job ${job.id} completed:`, {
      durationMs: result.durationMs,
      failed: result.failed,
      fetched: result.fetched,
      processed: result.processed,
      skipped: result.skipped,
      succeeded: result.succeeded,
      indexAttempted: result.indexAttempted,
      indexSucceeded: result.indexSucceeded,
      indexFailed: result.indexFailed,
      mediaListings: result.mediaDiagnostics.listingsWithMedia,
      mediaExtracted: result.mediaDiagnostics.extractedMediaCount,
      mediaIgnored: result.mediaDiagnostics.ignoredMediaItemCount,
      mediaDirectArrays: result.mediaDiagnostics.listingsWithDirectMedia,
      mediaNestedArrays: result.mediaDiagnostics.listingsWithNestedMedia,
      mediaTopLevelPhotos: result.mediaDiagnostics.listingsWithTopLevelPhotos,
      warningCount: result.warningCount,
      failureDetails: result.failures.length,
      warningDetails: result.warnings.length,
    });
  });

  worker.on('failed', (job, error) => {
    const attemptsMade = job?.attemptsMade ?? 0;
    const configuredAttempts = job?.opts.attempts ?? 1;
    const finalAttempt = shouldDeadLetterFailedJob(job);

    console.error(`REIE MLS page job ${job?.id ?? 'unknown'} failed:`, {
      attemptsMade,
      configuredAttempts,
      finalAttempt,
      message: getErrorMessage(error),
      operations: getFailureOperations(job, finalAttempt),
    });

    if (!finalAttempt) {
      console.warn(`REIE MLS page job ${job?.id ?? 'unknown'} will retry before dead-letter capture.`);
      return;
    }

    void enqueueDeadLetterFromJob(MLS_PAGE_QUEUE_NAME, job, error).catch((deadLetterError) => {
      console.error('Failed to enqueue MLS page dead-letter job:', getErrorMessage(deadLetterError));
    });
  });

  worker.on('error', (error) => {
    console.error('REIE MLS page worker connection error:', getErrorMessage(error));
  });

  worker.on('stalled', (jobId) => {
    console.warn(`REIE MLS page job ${jobId} stalled and will be retried by BullMQ.`);
  });

  return worker;
}

async function start() {
  const plan = getMlsPageWorkerPlan();
  const { config } = plan;
  const startupContext = {
    ...config,
    terminal: plan.terminal,
    recoveryTerminal: plan.recoveryTerminal,
    queue: plan.queueName,
    statusCommand: plan.commands.status,
    retryStatusCommand: plan.commands.retryStatus,
    queueDashboardCommand: plan.commands.queueDashboard,
    supabaseCheckCommand: plan.commands.supabaseCheck,
    supabaseCheckJsonCommand: plan.commands.supabaseCheckJson,
    deadLetterCommand: plan.commands.deadLetter,
    dryRunRetryCommand: plan.commands.dryRunRetry,
    liveRetryCommand: plan.commands.liveRetry,
  };

  console.log(`REIE MLS page worker starting on queue "${MLS_PAGE_QUEUE_NAME}":`, startupContext);

  await assertWorkerDatabaseReady(plan.databasePreflight);

  const worker = createMlsPageWorker(config);
  let settledJobs = 0;
  let shutdownStarted = false;

  async function shutdown(reason: string, exitCode = 0) {
    if (shutdownStarted) return;
    shutdownStarted = true;
    console.log(`REIE MLS page worker ${reason}. Shutting down.`);
    await worker.close();
    process.exit(exitCode);
  }

  function countOneShotJob(event: 'completed' | 'failed') {
    if (!config.once) return;

    settledJobs += 1;
    console.log(`REIE MLS page one-shot job ${event}:`, {
      maxJobs: config.maxJobs,
      settledJobs,
    });

    if (settledJobs >= config.maxJobs) {
      void shutdown(`processed ${settledJobs} one-shot job(s)`);
    }
  }

  worker.on('completed', () => countOneShotJob('completed'));
  worker.on('failed', () => countOneShotJob('failed'));

  async function shutdownForSignal(signal: NodeJS.Signals) {
    await shutdown(`received ${signal}`);
  }

  process.on('SIGINT', shutdownForSignal);
  process.on('SIGTERM', shutdownForSignal);

  console.log(`REIE MLS page worker listening on queue "${MLS_PAGE_QUEUE_NAME}":`, startupContext);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  start().catch((error) => {
    console.error('REIE MLS page worker failed:', getErrorMessage(error));
    process.exit(1);
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/workers/mlsPageWorker.ts
