import { Queue } from 'bullmq';
import { createLazyQueue } from './lazyQueue.js';
import { getRedisConnection } from './redis.js';
export const MLS_PAGE_QUEUE_NAME = 'mls-page';
export const MLS_PAGE_JOB_NAME = 'fetch-page';
export const MLS_PAGE_DEFAULT_SKIP = 0;
export const MLS_PAGE_DEFAULT_TOP = 50;
export const MLS_PAGE_DEFAULT_LAST_SYNC = '2000-01-01T00:00:00.000Z';
export const MLS_PAGE_DEFAULT_TIMEOUT_MS = 30000;
export const MLS_PAGE_MAX_SKIP = Number.MAX_SAFE_INTEGER;
export const MLS_PAGE_MAX_TOP = 100;
export const MLS_PAGE_MAX_TIMEOUT_MS = 120000;
export const MLS_PAGE_MAX_REQUESTED_BY_LENGTH = 120;
export const MLS_PAGE_JOB_ATTEMPTS = 3;
export const MLS_PAGE_JOB_BACKOFF_DELAY_MS = 2000;
export const MLS_PAGE_REMOVE_ON_COMPLETE_AGE_SECONDS = 7 * 24 * 60 * 60;
export const MLS_PAGE_REMOVE_ON_COMPLETE_COUNT = 250;
export const MLS_PAGE_REMOVE_ON_FAIL_AGE_SECONDS = 30 * 24 * 60 * 60;
export const MLS_PAGE_REMOVE_ON_FAIL_COUNT = 500;
const defaultJobOptions = {
    attempts: MLS_PAGE_JOB_ATTEMPTS,
    backoff: {
        type: 'exponential',
        delay: MLS_PAGE_JOB_BACKOFF_DELAY_MS,
    },
    removeOnComplete: {
        age: MLS_PAGE_REMOVE_ON_COMPLETE_AGE_SECONDS,
        count: MLS_PAGE_REMOVE_ON_COMPLETE_COUNT,
    },
    removeOnFail: {
        age: MLS_PAGE_REMOVE_ON_FAIL_AGE_SECONDS,
        count: MLS_PAGE_REMOVE_ON_FAIL_COUNT,
    },
};
function createMlsPageQueue() {
    return new Queue(MLS_PAGE_QUEUE_NAME, {
        connection: getRedisConnection(),
        defaultJobOptions,
    });
}
export const mlsPageQueue = createLazyQueue(createMlsPageQueue);
function getSafeInteger(value, fallback, min, max) {
    if (!Number.isFinite(value) || value === undefined)
        return fallback;
    return Math.min(Math.max(Math.floor(value), min), max);
}
function getSafeLastSync(value) {
    if (!value)
        return MLS_PAGE_DEFAULT_LAST_SYNC;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime()))
        return MLS_PAGE_DEFAULT_LAST_SYNC;
    return parsed.toISOString();
}
function getSafeRequestedAt(value) {
    if (!value)
        return new Date().toISOString();
    const parsed = new Date(value);
    if (!Number.isFinite(parsed.getTime()))
        return new Date().toISOString();
    return parsed.toISOString();
}
function getSafeRequestedBy(value) {
    if (!value)
        return undefined;
    const cleaned = value.trim();
    if (!cleaned)
        return undefined;
    return cleaned.slice(0, MLS_PAGE_MAX_REQUESTED_BY_LENGTH);
}
function getSafeSource(value) {
    if (value === 'api' || value === 'coordinator' || value === 'script' || value === 'system') {
        return value;
    }
    return 'system';
}
function getOptionalBoolean(value) {
    return typeof value === 'boolean' ? value : undefined;
}
export function normalizeMlsPageJobData(data) {
    return {
        requestedAt: getSafeRequestedAt(data.requestedAt),
        requestedBy: getSafeRequestedBy(data.requestedBy),
        source: getSafeSource(data.source),
        skip: getSafeInteger(data.skip, MLS_PAGE_DEFAULT_SKIP, 0, MLS_PAGE_MAX_SKIP),
        top: getSafeInteger(data.top, MLS_PAGE_DEFAULT_TOP, 1, MLS_PAGE_MAX_TOP),
        lastSync: getSafeLastSync(data.lastSync),
        includeMedia: getOptionalBoolean(data.includeMedia),
        timeoutMs: getSafeInteger(data.timeoutMs, MLS_PAGE_DEFAULT_TIMEOUT_MS, 1000, MLS_PAGE_MAX_TIMEOUT_MS),
    };
}
function getJobId(data) {
    return `mls-page-${data.skip}-${data.top}-${data.lastSync}`.replace(/[^\w:.-]/g, '-').slice(0, 180);
}
export function getMlsPageQueuePlan(data, sourceFallback = 'coordinator') {
    const normalized = normalizeMlsPageJobData({
        ...data,
        source: data.source ?? sourceFallback,
    });
    return {
        queueName: MLS_PAGE_QUEUE_NAME,
        jobName: MLS_PAGE_JOB_NAME,
        jobId: getJobId(normalized),
        data: normalized,
        terminal: 'Terminal 2',
        recoveryTerminal: 'Terminal 5',
        commands: {
            startWorker: 'npm run run:worker:mls-page',
            oneShotWorker: 'npm run run:worker:mls-page:once',
            status: 'curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/mls/status"',
            retryDryRun: 'curl --max-time 8 -s -X POST -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/mls/retry?queue=mls-page&dryRun=true&limit=6"',
            queueDashboard: 'npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000',
        },
        defaultJobOptions: {
            attempts: MLS_PAGE_JOB_ATTEMPTS,
            backoff: {
                type: 'exponential',
                delay: MLS_PAGE_JOB_BACKOFF_DELAY_MS,
            },
            removeOnComplete: {
                age: MLS_PAGE_REMOVE_ON_COMPLETE_AGE_SECONDS,
                count: MLS_PAGE_REMOVE_ON_COMPLETE_COUNT,
            },
            removeOnFail: {
                age: MLS_PAGE_REMOVE_ON_FAIL_AGE_SECONDS,
                count: MLS_PAGE_REMOVE_ON_FAIL_COUNT,
            },
        },
        bounded: {
            requestedBy: data.requestedBy !== undefined &&
                getSafeRequestedBy(data.requestedBy) !== (data.requestedBy.trim() || undefined),
            requestedAt: data.requestedAt !== undefined && normalized.requestedAt !== data.requestedAt,
            source: data.source !== undefined && normalized.source !== data.source,
            skip: data.skip !== undefined && normalized.skip !== data.skip,
            top: data.top !== undefined && normalized.top !== data.top,
            lastSync: data.lastSync !== undefined && normalized.lastSync !== data.lastSync,
            timeoutMs: data.timeoutMs !== undefined && normalized.timeoutMs !== data.timeoutMs,
        },
        limits: {
            minSkip: 0,
            maxSkip: MLS_PAGE_MAX_SKIP,
            minTop: 1,
            maxTop: MLS_PAGE_MAX_TOP,
            minTimeoutMs: 1000,
            maxTimeoutMs: MLS_PAGE_MAX_TIMEOUT_MS,
            maxRequestedByLength: MLS_PAGE_MAX_REQUESTED_BY_LENGTH,
        },
    };
}
export async function enqueueMlsPage(data, options = {}) {
    const plan = getMlsPageQueuePlan(data, 'coordinator');
    return mlsPageQueue.add(MLS_PAGE_JOB_NAME, plan.data, {
        ...options,
        jobId: plan.jobId,
        attempts: options.attempts ?? defaultJobOptions.attempts,
        backoff: options.backoff ?? defaultJobOptions.backoff,
        removeOnComplete: options.removeOnComplete ?? defaultJobOptions.removeOnComplete,
        removeOnFail: options.removeOnFail ?? defaultJobOptions.removeOnFail,
    });
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/mlsPageQueue.ts
