import 'dotenv/config';
import { Worker } from 'bullmq';
import { processAlertById, processAlertQueue } from '../lib/alerts/processAlertQueue.js';
import { prisma } from '../lib/prisma.js';
import { assertDatabaseReady } from '../lib/queue/databasePreflight.js';
import { getRedisConnection } from '../lib/queue/redis.js';
const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_INTERVAL_MS = 60000;
const DEFAULT_CONCURRENCY = 2;
const ALERT_QUEUE_NAME = 'reie-alerts';
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
    const normalized = String(value || '').trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes';
}
function readMode(value) {
    if (value === 'queue' || value === 'batch' || value === 'hybrid')
        return value;
    return 'hybrid';
}
function getConfig() {
    return {
        batchSize: readNumber(process.env.ALERT_WORKER_BATCH_SIZE, DEFAULT_BATCH_SIZE, 1, 200),
        intervalMs: readNumber(process.env.ALERT_WORKER_INTERVAL_MS, DEFAULT_INTERVAL_MS, 5000, 30 * 60000),
        once: readBoolean(process.env.ALERT_WORKER_ONCE),
        mode: readMode(process.env.ALERT_WORKER_MODE),
        concurrency: readNumber(process.env.ALERT_WORKER_CONCURRENCY, DEFAULT_CONCURRENCY, 1, 10),
        dryRun: readBoolean(process.env.ALERT_WORKER_DRY_RUN),
    };
}
function validateConfig(config) {
    if (config.dryRun && !config.once && config.mode !== 'batch') {
        throw new Error('ALERT_WORKER_DRY_RUN requires ALERT_WORKER_MODE=batch or ALERT_WORKER_ONCE=true so queue jobs are not consumed.');
    }
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
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
function buildAlertDryRunCommand(limit = 25) {
    return `curl -s -X POST "${LOCAL_BASE_URL}/api/process-alerts?dryRun=true&limit=${limit}"`;
}
function buildDeadLetterCommand(limit = 25) {
    const params = new URLSearchParams({
        sourceQueue: ALERT_QUEUE_NAME,
        states: 'waiting,delayed,failed',
        limit: String(limit),
    });
    return `curl -s "${LOCAL_BASE_URL}/api/admin/dead-letter?${params.toString()}"`;
}
function buildRetryCommand(options = {}) {
    const params = new URLSearchParams({
        queue: 'alerts',
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
        alertDryRunCommand: buildAlertDryRunCommand(),
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
function getBatchRecommendation(result) {
    if (result.failed > 0)
        return 'Review failed alert rows before running a larger or live batch.';
    if (result.dryRun && result.scanned > 0)
        return 'Dry-run preview completed. Review rows before enabling live worker processing.';
    if (result.dryRun)
        return 'Dry-run found no pending alert work.';
    if (result.sent > 0)
        return 'Live alert batch sent email. Confirm EmailLog and AlertQueue status.';
    return 'No live alert sends were required for this batch.';
}
async function runAlertBatch(config) {
    const result = await processAlertQueue({
        limit: config.batchSize,
        dryRun: config.dryRun,
    });
    console.log('REIE alert worker batch complete:', {
        scanned: result.scanned,
        sent: result.sent,
        skipped: result.skipped,
        failed: result.failed,
        dryRun: result.dryRun,
        success: result.success,
        recommendation: getBatchRecommendation(result),
    });
    return result;
}
async function sleep(ms) {
    await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function getAlertId(job) {
    const alertId = job.data?.alertId;
    if (typeof alertId !== 'string' || !alertId.trim()) {
        throw new Error(`Alert job ${job.id ?? 'unknown'} is missing alertId.`);
    }
    return alertId;
}
async function processAlertJob(job) {
    const alertId = getAlertId(job);
    const result = await processAlertById(alertId, false);
    if (result.status === 'failed') {
        throw new Error(result.reason || `Alert ${alertId} failed.`);
    }
    return result;
}
async function startQueueWorker(config) {
    const connection = getRedisConnection();
    const worker = new Worker(ALERT_QUEUE_NAME, processAlertJob, {
        connection,
        concurrency: config.concurrency,
    });
    worker.on('completed', (job, result) => {
        console.log(`REIE alert job ${job.id} completed:`, result);
    });
    worker.on('failed', (job, error) => {
        const attemptsMade = job?.attemptsMade ?? 0;
        const configuredAttempts = job?.opts.attempts ?? 1;
        const finalAttempt = shouldDeadLetterFailedJob(job);
        console.error(`REIE alert job ${job?.id ?? 'unknown'} failed:`, {
            attemptsMade,
            configuredAttempts,
            finalAttempt,
            message: getErrorMessage(error),
            operations: getFailureOperations(job, finalAttempt),
        });
        if (!finalAttempt) {
            console.warn(`REIE alert job ${job?.id ?? 'unknown'} will retry before dead-letter capture.`);
            return;
        }
        void import('../lib/queue/deadLetterQueue.js')
            .then(({ enqueueDeadLetterFromJob }) => enqueueDeadLetterFromJob(ALERT_QUEUE_NAME, job, error))
            .catch((deadLetterError) => {
            console.error('Failed to enqueue alert dead-letter job:', getErrorMessage(deadLetterError));
        });
    });
    worker.on('error', (error) => {
        console.error('REIE alert worker Redis error:', getErrorMessage(error));
    });
    console.log(`REIE alert worker listening on queue "${ALERT_QUEUE_NAME}":`, {
        terminal: TERMINAL_3,
        recoveryTerminal: TERMINAL_5,
        queue: ALERT_QUEUE_NAME,
        statusCommand: buildStatusCommand(),
        retryStatusCommand: buildRetryStatusCommand(),
        queueDashboardCommand: buildQueueDashboardCommand(),
        alertDryRunCommand: buildAlertDryRunCommand(),
        deadLetterCommand: buildDeadLetterCommand(),
        dryRunRetryCommand: buildRetryCommand({ limit: 10 }),
        liveRetryCommand: buildRetryCommand({ execute: true, limit: 10 }),
    });
    return worker;
}
function startShutdownHandlers(workers) {
    let shuttingDown = false;
    async function shutdown(signal) {
        if (shuttingDown)
            return;
        shuttingDown = true;
        console.log(`REIE alert worker received ${signal}. Shutting down.`);
        await Promise.allSettled(workers.map((worker) => worker.close()));
        await prisma.$disconnect();
        process.exit(0);
    }
    process.on('SIGINT', (signal) => {
        void shutdown(signal);
    });
    process.on('SIGTERM', (signal) => {
        void shutdown(signal);
    });
}
async function startPollingLoop(config) {
    while (true) {
        try {
            await runAlertBatch(config);
        }
        catch (error) {
            console.error('REIE alert worker batch failed:', getErrorMessage(error));
        }
        await sleep(config.intervalMs);
    }
}
async function startAlertWorker() {
    const config = getConfig();
    validateConfig(config);
    await assertDatabaseReady({
        operation: 'alert worker startup',
        recoveryCommand: 'npm run supabase:check',
    });
    const workers = [];
    console.log('REIE alert worker started:', {
        batchSize: config.batchSize,
        intervalMs: config.intervalMs,
        once: config.once,
        mode: config.mode,
        concurrency: config.concurrency,
        dryRun: config.dryRun,
        terminal: config.once ? TERMINAL_5 : TERMINAL_3,
        recoveryTerminal: TERMINAL_5,
        dryRunCommand: 'npm run run:worker:alerts:once',
        liveOnceCommand: 'npm run run:worker:alerts:once:live',
        statusCommand: buildStatusCommand(),
        retryStatusCommand: buildRetryStatusCommand(),
        queueDashboardCommand: buildQueueDashboardCommand(),
        alertDryRunCommand: buildAlertDryRunCommand(),
        inspectorCommand: buildDeadLetterCommand(),
        dryRunRetryCommand: buildRetryCommand({ limit: 10 }),
        liveRetryCommand: buildRetryCommand({ execute: true, limit: 10 }),
        liveModeWarning: config.dryRun ? null : 'Live alert worker mode can send email. Confirm Resend, unsubscribe, tracking, and internal tests first.',
    });
    startShutdownHandlers(workers);
    if (config.once) {
        const result = await runAlertBatch(config);
        await prisma.$disconnect();
        process.exit(result.success ? 0 : 1);
    }
    if (config.mode === 'queue' || config.mode === 'hybrid') {
        workers.push(await startQueueWorker(config));
    }
    if (config.mode === 'batch' || config.mode === 'hybrid') {
        await startPollingLoop(config);
    }
}
startAlertWorker().catch(async (error) => {
    console.error('REIE alert worker failed to start:', getErrorMessage(error));
    await prisma.$disconnect();
    process.exit(1);
});
// /Users/davidquinn/david-quinn-group/colorado-real-estate/workers/alertWorker.ts
