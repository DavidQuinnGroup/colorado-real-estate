import { enqueueMlsSync, mlsQueue } from '../queue/mlsQueue.js';
const DEFAULT_MAX_RUNTIME_MS = 10 * 60 * 1000;
const DEFAULT_RATE_DELAY_MS = 1100;
const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_MAX_PAGES = 1;
const DEFAULT_REPEAT_EVERY_MS = 60 * 60 * 1000;
const MIN_REPEAT_EVERY_MS = 15 * 60 * 1000;
const MAX_REPEAT_EVERY_MS = 24 * 60 * 60 * 1000;
function getSafeInteger(value, fallback, min, max) {
    if (!Number.isFinite(value) || value === undefined)
        return fallback;
    return Math.max(min, Math.min(Math.floor(value), max));
}
function normalizeSyncOptions(options = {}) {
    return {
        requestedAt: new Date().toISOString(),
        maxRuntimeMs: getSafeInteger(options.maxRuntimeMs, DEFAULT_MAX_RUNTIME_MS, 1000, 60 * 60 * 1000),
        rateDelayMs: getSafeInteger(options.rateDelayMs, DEFAULT_RATE_DELAY_MS, 0, 60000),
        pageSize: getSafeInteger(options.pageSize, DEFAULT_PAGE_SIZE, 1, 100),
        maxPages: getSafeInteger(options.maxPages, DEFAULT_MAX_PAGES, 1, 100),
        startPage: getSafeInteger(options.startPage, 0, 0, Number.MAX_SAFE_INTEGER),
        includeMedia: options.includeMedia,
    };
}
function getRepeatEveryMs(everyMs) {
    return getSafeInteger(everyMs, DEFAULT_REPEAT_EVERY_MS, MIN_REPEAT_EVERY_MS, MAX_REPEAT_EVERY_MS);
}
export async function enqueueImmediateMlsSync(options = {}) {
    return enqueueMlsSync(normalizeSyncOptions(options));
}
export async function scheduleMlsSyncJob(options = {}) {
    const every = getRepeatEveryMs(options.everyMs);
    const jobId = options.jobId || 'reie-mls-sync-scheduled';
    const syncOptions = normalizeSyncOptions(options);
    const repeat = {
        every,
        immediately: options.startImmediately ?? false,
    };
    const job = await mlsQueue.add('sync', syncOptions, {
        jobId,
        repeat,
        removeOnComplete: 25,
        removeOnFail: 100,
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
    });
    return {
        job,
        jobId,
        everyMs: every,
        data: syncOptions,
    };
}
export async function removeScheduledMlsSyncJobs() {
    const repeatableJobs = await mlsQueue.getRepeatableJobs();
    const removed = [];
    for (const job of repeatableJobs) {
        if (job.name !== 'sync')
            continue;
        await mlsQueue.removeRepeatableByKey(job.key);
        removed.push({
            key: job.key,
            name: job.name,
            id: job.id ?? undefined,
        });
    }
    return removed;
}
export async function listScheduledMlsSyncJobs() {
    return mlsQueue.getRepeatableJobs();
}
// lib/mls/scheduleJobs.ts
