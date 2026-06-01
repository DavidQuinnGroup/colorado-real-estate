import 'dotenv/config';
import { Worker } from 'bullmq';
import { fetchMLSGridListings } from '../lib/mls/mlsGridClient.js';
import { processListingsBatch, } from '../lib/mls/processListingsBatch.js';
import { assertWorkerDatabaseReady } from '../lib/queue/databasePreflight.js';
import { enqueueDeadLetterFromJob } from '../lib/queue/deadLetterQueue.js';
import { MLS_PAGE_QUEUE_NAME, normalizeMlsPageJobData } from '../lib/queue/mlsPageQueue.js';
import { getRedisConnection } from '../lib/queue/redis.js';
const LOCAL_BASE_URL = 'http://localhost:3000';
const TERMINAL_2 = 'Terminal 2';
const TERMINAL_5 = 'Terminal 5';
const SUPABASE_CHECK_COMMAND = 'npm run supabase:check';
const SUPABASE_CHECK_JSON_COMMAND = 'npm run supabase:check:json';
function readNumber(value, fallback, min, max) {
    if (!value)
        return fallback;
    const parsed = Number(value);
    if (!Number.isFinite(parsed))
        return fallback;
    return Math.min(Math.max(Math.floor(parsed), min), max);
}
function getErrorMessage(error) {
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
function buildRetryCommand(options = {}) {
    const params = new URLSearchParams({
        queue: MLS_PAGE_QUEUE_NAME,
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
function normalizeJobData(data) {
    return normalizeMlsPageJobData(data);
}
function getConfig() {
    return {
        concurrency: readNumber(process.env.MLS_PAGE_WORKER_CONCURRENCY, 1, 1, 5),
        lockDurationMs: readNumber(process.env.MLS_PAGE_WORKER_LOCK_DURATION_MS, 10 * 60 * 1000, 60000, 60 * 60 * 1000),
        maxFailureDetails: readNumber(process.env.MLS_PAGE_WORKER_MAX_FAILURE_DETAILS, 25, 0, 100),
        maxStalledCount: readNumber(process.env.MLS_PAGE_WORKER_MAX_STALLED_COUNT, 1, 0, 5),
        maxWarningDetails: readNumber(process.env.MLS_PAGE_WORKER_MAX_WARNING_DETAILS, 25, 0, 100),
        stalledIntervalMs: readNumber(process.env.MLS_PAGE_WORKER_STALLED_INTERVAL_MS, 60000, 10000, 10 * 60 * 1000),
    };
}
async function processPageJob(job, config) {
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
        processed: summary.processed,
        succeeded: summary.succeeded,
        failed: summary.failed,
        skipped: summary.skipped,
        indexAttempted: summary.indexAttempted,
        indexSucceeded: summary.indexSucceeded,
        indexFailed: summary.indexFailed,
        failures: summary.failures,
        warningCount: summary.warnings.length,
        warnings,
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
function createMlsPageWorker(config) {
    const worker = new Worker(MLS_PAGE_QUEUE_NAME, (job) => processPageJob(job, config), {
        connection: getRedisConnection(),
        concurrency: config.concurrency,
        lockDuration: config.lockDurationMs,
        maxStalledCount: config.maxStalledCount,
        stalledInterval: config.stalledIntervalMs,
    });
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
    const config = getConfig();
    const startupContext = {
        ...config,
        terminal: TERMINAL_2,
        recoveryTerminal: TERMINAL_5,
        queue: MLS_PAGE_QUEUE_NAME,
        statusCommand: buildStatusCommand(),
        retryStatusCommand: buildRetryStatusCommand(),
        queueDashboardCommand: buildQueueDashboardCommand(),
        supabaseCheckCommand: SUPABASE_CHECK_COMMAND,
        supabaseCheckJsonCommand: SUPABASE_CHECK_JSON_COMMAND,
        deadLetterCommand: buildDeadLetterCommand(),
        dryRunRetryCommand: buildRetryCommand({ limit: 10 }),
        liveRetryCommand: buildRetryCommand({ execute: true, limit: 10 }),
    };
    console.log(`REIE MLS page worker starting on queue "${MLS_PAGE_QUEUE_NAME}":`, startupContext);
    await assertWorkerDatabaseReady({
        queue: MLS_PAGE_QUEUE_NAME,
        recoveryCommand: SUPABASE_CHECK_JSON_COMMAND,
        worker: 'MLS page worker',
    });
    const worker = createMlsPageWorker(config);
    async function shutdown(signal) {
        console.log(`REIE MLS page worker received ${signal}. Shutting down.`);
        await worker.close();
        process.exit(0);
    }
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    console.log(`REIE MLS page worker listening on queue "${MLS_PAGE_QUEUE_NAME}":`, startupContext);
}
start().catch((error) => {
    console.error('REIE MLS page worker failed:', getErrorMessage(error));
    process.exit(1);
});
// /Users/davidquinn/david-quinn-group/colorado-real-estate/workers/mlsPageWorker.ts
