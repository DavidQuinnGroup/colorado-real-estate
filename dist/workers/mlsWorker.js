import 'dotenv/config';
import { Worker } from 'bullmq';
import { syncMLSGrid } from '../lib/mls/syncMLSGrid.js';
import { assertWorkerDatabaseReady } from '../lib/queue/databasePreflight.js';
import { enqueueDeadLetter, enqueueDeadLetterFromJob } from '../lib/queue/deadLetterQueue.js';
import { connection, MLS_SYNC_DEFAULT_MAX_PAGES, MLS_SYNC_DEFAULT_MAX_RUNTIME_MS, MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS, MLS_SYNC_DEFAULT_PAGE_SIZE, MLS_SYNC_DEFAULT_RATE_DELAY_MS, MLS_SYNC_JOB_NAME, MLS_SYNC_MAX_PAGES, MLS_SYNC_MAX_PAGE_TIMEOUT_MS, MLS_SYNC_MAX_PAGE_SIZE, MLS_SYNC_MAX_RATE_DELAY_MS, MLS_SYNC_MAX_RUNTIME_MS, MLS_SYNC_MAX_START_PAGE, MLS_SYNC_QUEUE_NAME, normalizeMlsSyncJobData, } from '../lib/queue/mlsQueue.js';
const LOCAL_BASE_URL = 'http://localhost:3000';
const TERMINAL_3 = 'Terminal 3';
const TERMINAL_5 = 'Terminal 5';
function readNumber(value, fallback, min, max) {
    if (!value)
        return fallback;
    const parsed = Number(value);
    if (!Number.isFinite(parsed))
        return fallback;
    return Math.min(Math.max(Math.floor(parsed), min), max);
}
function readBoolean(value) {
    if (!value)
        return false;
    return ['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase());
}
function readOptionalBoolean(value) {
    if (value === undefined)
        return undefined;
    if (['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase()))
        return true;
    if (['0', 'false', 'no', 'n'].includes(value.trim().toLowerCase()))
        return false;
    return undefined;
}
function getErrorCode(error) {
    if (!error || typeof error !== 'object')
        return '';
    const maybeCode = error.code;
    return typeof maybeCode === 'string' ? maybeCode : '';
}
function getAggregateErrorMessage(error) {
    if (!error || typeof error !== 'object' || !Array.isArray(error.errors))
        return '';
    const errors = error.errors;
    const summaries = errors
        .map((item) => {
        if (!item || typeof item !== 'object')
            return String(item || '');
        const code = getErrorCode(item);
        const message = item instanceof Error ? item.message : '';
        return [code, message].filter(Boolean).join(': ');
    })
        .filter(Boolean);
    return Array.from(new Set(summaries)).join('; ');
}
function getErrorMessage(error) {
    const aggregateMessage = getAggregateErrorMessage(error);
    if (aggregateMessage)
        return aggregateMessage;
    const code = getErrorCode(error);
    if (error instanceof Error && error.message.trim()) {
        return code ? `${code}: ${error.message}` : error.message;
    }
    if (code)
        return code;
    return String(error || 'Unknown MLS sync worker error.');
}
function getErrorStack(error) {
    return error instanceof Error ? error.stack : undefined;
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
        sourceQueue: MLS_SYNC_QUEUE_NAME,
        states: 'waiting,delayed,failed',
        limit: String(limit),
    });
    return `curl -s "${LOCAL_BASE_URL}/api/admin/dead-letter?${params.toString()}"`;
}
function buildRetryCommand(options = {}) {
    const params = new URLSearchParams({
        queue: MLS_SYNC_QUEUE_NAME,
        dryRun: options.execute ? 'false' : 'true',
    });
    if (options.execute)
        params.set('execute', 'true');
    if (options.jobId)
        params.set('jobId', options.jobId);
    if (options.limit)
        params.set('limit', String(options.limit));
    return `curl -s -X POST "${LOCAL_BASE_URL}/api/mls/retry?${params.toString()}"`;
}
function buildDryRunSyncCommand() {
    const params = new URLSearchParams({
        dryRun: 'true',
        maxPages: String(MLS_SYNC_DEFAULT_MAX_PAGES),
        pageSize: String(Math.min(MLS_SYNC_DEFAULT_PAGE_SIZE, 5)),
        startPage: '0',
        pageTimeoutMs: String(MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS),
    });
    return `curl -s -X POST "${LOCAL_BASE_URL}/api/mls/sync?${params.toString()}"`;
}
function getConfig() {
    return {
        concurrency: readNumber(process.env.MLS_WORKER_CONCURRENCY, 1, 1, 3),
        lockDurationMs: readNumber(process.env.MLS_WORKER_LOCK_DURATION_MS, 15 * 60 * 1000, 60000, 60 * 60 * 1000),
        maxStalledCount: readNumber(process.env.MLS_WORKER_MAX_STALLED_COUNT, 1, 0, 5),
        once: readBoolean(process.env.MLS_WORKER_ONCE),
        stalledIntervalMs: readNumber(process.env.MLS_WORKER_STALLED_INTERVAL_MS, 60000, 10000, 10 * 60 * 1000),
    };
}
function getOneShotOptions() {
    return normalizeMlsSyncJobData({
        requestedAt: new Date().toISOString(),
        requestedBy: 'Terminal 3 one-shot worker',
        source: 'worker-once',
        maxRuntimeMs: readNumber(process.env.MLS_MAX_RUNTIME_MS, MLS_SYNC_DEFAULT_MAX_RUNTIME_MS, 1000, MLS_SYNC_MAX_RUNTIME_MS),
        rateDelayMs: readNumber(process.env.MLS_RATE_DELAY_MS, MLS_SYNC_DEFAULT_RATE_DELAY_MS, 0, MLS_SYNC_MAX_RATE_DELAY_MS),
        pageSize: readNumber(process.env.MLS_PAGE_SIZE, MLS_SYNC_DEFAULT_PAGE_SIZE, 1, MLS_SYNC_MAX_PAGE_SIZE),
        maxPages: readNumber(process.env.MLS_MAX_PAGES, MLS_SYNC_DEFAULT_MAX_PAGES, 1, MLS_SYNC_MAX_PAGES),
        startPage: readNumber(process.env.MLS_START_PAGE, 0, 0, MLS_SYNC_MAX_START_PAGE),
        includeMedia: readOptionalBoolean(process.env.MLS_INCLUDE_MEDIA ?? process.env.MLS_GRID_INCLUDE_MEDIA),
        pageTimeoutMs: readNumber(process.env.MLS_PAGE_TIMEOUT_MS, MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS, 1000, MLS_SYNC_MAX_PAGE_TIMEOUT_MS),
    });
}
function normalizeJobData(data = {}) {
    return normalizeMlsSyncJobData(data);
}
export async function runMLSWorker(options = {}) {
    return syncMLSGrid(normalizeJobData(options));
}
function summarizeResult(result) {
    if (!result) {
        return {
            started: false,
            reason: 'another healthy sync is already running',
        };
    }
    return {
        started: true,
        stoppedReason: result.stoppedReason,
        pagesFetched: result.pagesFetched,
        listingsFetched: result.listingsFetched,
        listingsSucceeded: result.listingsSucceeded,
        listingsFailed: result.listingsFailed,
        nextPage: result.nextPage,
        durationMs: result.durationMs,
        recoveredStaleLock: result.recoveredStaleLock,
        pageTimeoutMs: result.options?.pageTimeoutMs,
    };
}
function shouldDeadLetterFailedJob(job) {
    if (!job)
        return true;
    const configuredAttempts = job.opts.attempts ?? 1;
    return job.attemptsMade >= configuredAttempts;
}
function getFailureOperations(job, finalAttempt) {
    const jobId = job?.id;
    return {
        workerTerminal: TERMINAL_3,
        recoveryTerminal: TERMINAL_5,
        finalAttempt,
        statusCommand: buildStatusCommand(),
        retryStatusCommand: buildRetryStatusCommand(),
        queueDashboardCommand: buildQueueDashboardCommand(),
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
function createMlsSyncWorker(config) {
    const worker = new Worker(MLS_SYNC_QUEUE_NAME, async (job) => {
        const normalizedJobData = normalizeJobData(job.data);
        console.log(`REIE MLS sync job ${job.id} started:`, normalizedJobData);
        const result = await runMLSWorker(normalizedJobData);
        if (!result) {
            console.log(`REIE MLS sync job ${job.id} skipped because another healthy sync is already running.`);
        }
        return result;
    }, {
        connection,
        concurrency: config.concurrency,
        lockDuration: config.lockDurationMs,
        maxStalledCount: config.maxStalledCount,
        stalledInterval: config.stalledIntervalMs,
    });
    worker.on('active', (job) => {
        console.log(`REIE MLS sync job ${job.id} active:`, {
            attemptsMade: job.attemptsMade,
            configuredAttempts: job.opts.attempts ?? 1,
            name: job.name,
        });
    });
    worker.on('completed', (job, result) => {
        console.log(`REIE MLS sync job ${job.id} completed:`, summarizeResult(result));
    });
    worker.on('failed', (job, error) => {
        const attemptsMade = job?.attemptsMade ?? 0;
        const configuredAttempts = job?.opts.attempts ?? 1;
        const finalAttempt = shouldDeadLetterFailedJob(job);
        console.error(`REIE MLS sync job ${job?.id ?? 'unknown'} failed:`, {
            attemptsMade,
            configuredAttempts,
            finalAttempt,
            message: getErrorMessage(error),
            operations: getFailureOperations(job, finalAttempt),
        });
        if (!finalAttempt) {
            console.warn(`REIE MLS sync job ${job?.id ?? 'unknown'} will retry before dead-letter capture.`);
            return;
        }
        void enqueueDeadLetterFromJob(MLS_SYNC_QUEUE_NAME, job, error).catch((deadLetterError) => {
            console.error('Failed to enqueue MLS sync dead-letter job:', getErrorMessage(deadLetterError));
        });
    });
    worker.on('error', (error) => {
        console.error('REIE MLS sync worker connection error:', getErrorMessage(error));
    });
    worker.on('stalled', (jobId) => {
        console.warn(`REIE MLS sync job ${jobId} stalled and will be retried by BullMQ.`);
    });
    return worker;
}
async function runOneShot() {
    const options = getOneShotOptions();
    let result;
    try {
        result = await runMLSWorker(options);
    }
    catch (error) {
        const operations = getFailureOperations(undefined, true);
        console.error('REIE MLS one-shot sync failed:', {
            message: getErrorMessage(error),
            operations,
        });
        await enqueueDeadLetter({
            sourceQueue: MLS_SYNC_QUEUE_NAME,
            sourceJobName: MLS_SYNC_JOB_NAME,
            failedReason: getErrorMessage(error),
            failedAt: new Date().toISOString(),
            attemptsMade: 1,
            finalAttempt: true,
            stack: getErrorStack(error),
            payload: options,
            capturedAt: new Date().toISOString(),
            capturedBy: 'Terminal 3 one-shot worker',
            sourceJobState: 'one-shot-error',
            sourceJobAttempts: 1,
        }).catch((deadLetterError) => {
            console.error('Failed to enqueue MLS one-shot dead-letter job:', getErrorMessage(deadLetterError));
        });
        throw error;
    }
    if (!result) {
        console.log('MLS Grid one-shot sync did not start because another healthy sync is already running.');
        return 0;
    }
    console.log('MLS Grid one-shot sync complete:', summarizeResult(result));
    return result.stoppedReason === 'error' || result.listingsFailed > 0 ? 1 : 0;
}
async function start() {
    const config = getConfig();
    console.log('REIE MLS sync worker started:', {
        ...config,
        queue: MLS_SYNC_QUEUE_NAME,
        terminal: TERMINAL_3,
        recoveryTerminal: TERMINAL_5,
        statusCommand: buildStatusCommand(),
        retryStatusCommand: buildRetryStatusCommand(),
        queueDashboardCommand: buildQueueDashboardCommand(),
        dryRunSyncCommand: buildDryRunSyncCommand(),
        dryRunRetryCommand: buildRetryCommand({ limit: 10 }),
        liveRetryCommand: buildRetryCommand({ execute: true, limit: 10 }),
        oneShotCommand: 'MLS_WORKER_ONCE=true npm run run:worker:mls',
        deadLetterCommand: buildDeadLetterCommand(),
    });
    await assertWorkerDatabaseReady({
        queue: MLS_SYNC_QUEUE_NAME,
        recoveryCommand: 'npm run supabase:check',
        worker: 'MLS sync worker',
    });
    if (config.once) {
        process.exit(await runOneShot());
    }
    const worker = createMlsSyncWorker(config);
    async function shutdown(signal) {
        console.log(`REIE MLS sync worker received ${signal}. Shutting down.`);
        await worker.close();
        process.exit(0);
    }
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    console.log(`REIE MLS sync worker listening on queue "${MLS_SYNC_QUEUE_NAME}":`, {
        terminal: TERMINAL_3,
        recoveryTerminal: TERMINAL_5,
        statusCommand: buildStatusCommand(),
        deadLetterCommand: buildDeadLetterCommand(),
        dryRunRetryCommand: buildRetryCommand({ limit: 10 }),
    });
}
start().catch((error) => {
    console.error('REIE MLS sync worker failed:', getErrorMessage(error));
    process.exit(1);
});
// /Users/davidquinn/david-quinn-group/colorado-real-estate/workers/mlsWorker.ts
