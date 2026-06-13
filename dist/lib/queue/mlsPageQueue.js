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
    return cleaned.slice(0, 120);
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
export async function enqueueMlsPage(data, options = {}) {
    const normalized = normalizeMlsPageJobData({
        ...data,
        source: data.source ?? 'coordinator',
    });
    return mlsPageQueue.add(MLS_PAGE_JOB_NAME, normalized, {
        ...options,
        jobId: getJobId(normalized),
        attempts: options.attempts ?? defaultJobOptions.attempts,
        backoff: options.backoff ?? defaultJobOptions.backoff,
        removeOnComplete: options.removeOnComplete ?? defaultJobOptions.removeOnComplete,
        removeOnFail: options.removeOnFail ?? defaultJobOptions.removeOnFail,
    });
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/mlsPageQueue.ts
