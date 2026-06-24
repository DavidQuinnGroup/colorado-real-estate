import { Queue } from 'bullmq';
import { createLazyQueue } from './lazyQueue.js';
import { getRedisConnection } from './redis.js';
export const MLS_SYNC_QUEUE_NAME = 'mls-sync';
export const MLS_SYNC_JOB_NAME = 'sync';
export const MLS_SYNC_DEFAULT_MAX_RUNTIME_MS = 10 * 60 * 1000;
export const MLS_SYNC_DEFAULT_RATE_DELAY_MS = 1100;
export const MLS_SYNC_DEFAULT_PAGE_SIZE = 50;
export const MLS_SYNC_DEFAULT_MAX_PAGES = 1;
export const MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS = 30000;
export const MLS_SYNC_MAX_RUNTIME_MS = 60 * 60 * 1000;
export const MLS_SYNC_MAX_RATE_DELAY_MS = 60000;
export const MLS_SYNC_MAX_PAGE_SIZE = 100;
export const MLS_SYNC_MAX_PAGES = 100;
export const MLS_SYNC_MAX_START_PAGE = 1000000;
export const MLS_SYNC_MAX_PAGE_TIMEOUT_MS = 120000;
export const MLS_SYNC_MAX_REQUESTED_BY_LENGTH = 120;
export const MLS_SYNC_JOB_ATTEMPTS = 3;
export const MLS_SYNC_JOB_BACKOFF_DELAY_MS = 5000;
export const MLS_SYNC_REMOVE_ON_COMPLETE_AGE_SECONDS = 7 * 24 * 60 * 60;
export const MLS_SYNC_REMOVE_ON_COMPLETE_COUNT = 250;
export const MLS_SYNC_REMOVE_ON_FAIL_AGE_SECONDS = 30 * 24 * 60 * 60;
export const MLS_SYNC_REMOVE_ON_FAIL_COUNT = 500;
const defaultJobOptions = {
    attempts: MLS_SYNC_JOB_ATTEMPTS,
    backoff: {
        type: 'exponential',
        delay: MLS_SYNC_JOB_BACKOFF_DELAY_MS,
    },
    removeOnComplete: {
        age: MLS_SYNC_REMOVE_ON_COMPLETE_AGE_SECONDS,
        count: MLS_SYNC_REMOVE_ON_COMPLETE_COUNT,
    },
    removeOnFail: {
        age: MLS_SYNC_REMOVE_ON_FAIL_AGE_SECONDS,
        count: MLS_SYNC_REMOVE_ON_FAIL_COUNT,
    },
};
function createMlsQueue() {
    return new Queue(MLS_SYNC_QUEUE_NAME, {
        connection: getRedisConnection(),
        defaultJobOptions,
    });
}
export const mlsQueue = createLazyQueue(createMlsQueue);
function getSafeInteger(value, fallback, min, max) {
    if (!Number.isFinite(value) || value === undefined)
        return fallback;
    return Math.max(min, Math.min(Math.floor(value), max));
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
    return cleaned.slice(0, MLS_SYNC_MAX_REQUESTED_BY_LENGTH);
}
function getSafeSource(value) {
    if (value === 'api' || value === 'worker-once' || value === 'script' || value === 'system') {
        return value;
    }
    return 'system';
}
function getOptionalBoolean(value) {
    return typeof value === 'boolean' ? value : undefined;
}
export function normalizeMlsSyncJobData(data = {}) {
    return {
        requestedAt: getSafeRequestedAt(data.requestedAt),
        requestedBy: getSafeRequestedBy(data.requestedBy),
        source: getSafeSource(data.source),
        maxRuntimeMs: getSafeInteger(data.maxRuntimeMs, MLS_SYNC_DEFAULT_MAX_RUNTIME_MS, 1000, MLS_SYNC_MAX_RUNTIME_MS),
        rateDelayMs: getSafeInteger(data.rateDelayMs, MLS_SYNC_DEFAULT_RATE_DELAY_MS, 0, MLS_SYNC_MAX_RATE_DELAY_MS),
        pageSize: getSafeInteger(data.pageSize, MLS_SYNC_DEFAULT_PAGE_SIZE, 1, MLS_SYNC_MAX_PAGE_SIZE),
        maxPages: getSafeInteger(data.maxPages, MLS_SYNC_DEFAULT_MAX_PAGES, 1, MLS_SYNC_MAX_PAGES),
        startPage: getSafeInteger(data.startPage, 0, 0, MLS_SYNC_MAX_START_PAGE),
        includeMedia: getOptionalBoolean(data.includeMedia),
        pageTimeoutMs: getSafeInteger(data.pageTimeoutMs, MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS, 1000, MLS_SYNC_MAX_PAGE_TIMEOUT_MS),
    };
}
export function getMlsSyncQueuePlan(data = {}, sourceFallback = 'api') {
    const normalized = normalizeMlsSyncJobData({
        ...data,
        source: data.source ?? sourceFallback,
    });
    return {
        queueName: MLS_SYNC_QUEUE_NAME,
        jobName: MLS_SYNC_JOB_NAME,
        data: normalized,
        terminal: 'Terminal 3',
        recoveryTerminal: 'Terminal 5',
        commands: {
            startWorker: 'npm run run:worker:mls',
            dryRunSync: 'npm run run:mls-sync:dry',
            liveSync: 'npm run run:mls-sync:live',
            status: 'curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/mls/status"',
            retryDryRun: 'curl --max-time 8 -s -X POST -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/mls/retry?queue=mls-sync&dryRun=true&limit=6"',
            queueDashboard: 'npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000',
        },
        defaultJobOptions: {
            attempts: MLS_SYNC_JOB_ATTEMPTS,
            backoff: {
                type: 'exponential',
                delay: MLS_SYNC_JOB_BACKOFF_DELAY_MS,
            },
            removeOnComplete: {
                age: MLS_SYNC_REMOVE_ON_COMPLETE_AGE_SECONDS,
                count: MLS_SYNC_REMOVE_ON_COMPLETE_COUNT,
            },
            removeOnFail: {
                age: MLS_SYNC_REMOVE_ON_FAIL_AGE_SECONDS,
                count: MLS_SYNC_REMOVE_ON_FAIL_COUNT,
            },
        },
        bounded: {
            requestedBy: data.requestedBy !== undefined &&
                getSafeRequestedBy(data.requestedBy) !== (data.requestedBy.trim() || undefined),
            requestedAt: data.requestedAt !== undefined && normalized.requestedAt !== data.requestedAt,
            source: data.source !== undefined && normalized.source !== data.source,
            maxRuntimeMs: data.maxRuntimeMs !== undefined && normalized.maxRuntimeMs !== data.maxRuntimeMs,
            rateDelayMs: data.rateDelayMs !== undefined && normalized.rateDelayMs !== data.rateDelayMs,
            pageSize: data.pageSize !== undefined && normalized.pageSize !== data.pageSize,
            maxPages: data.maxPages !== undefined && normalized.maxPages !== data.maxPages,
            startPage: data.startPage !== undefined && normalized.startPage !== data.startPage,
            pageTimeoutMs: data.pageTimeoutMs !== undefined && normalized.pageTimeoutMs !== data.pageTimeoutMs,
        },
        limits: {
            minMaxRuntimeMs: 1000,
            maxMaxRuntimeMs: MLS_SYNC_MAX_RUNTIME_MS,
            minRateDelayMs: 0,
            maxRateDelayMs: MLS_SYNC_MAX_RATE_DELAY_MS,
            minPageSize: 1,
            maxPageSize: MLS_SYNC_MAX_PAGE_SIZE,
            minMaxPages: 1,
            maxMaxPages: MLS_SYNC_MAX_PAGES,
            minStartPage: 0,
            maxStartPage: MLS_SYNC_MAX_START_PAGE,
            minPageTimeoutMs: 1000,
            maxPageTimeoutMs: MLS_SYNC_MAX_PAGE_TIMEOUT_MS,
            maxRequestedByLength: MLS_SYNC_MAX_REQUESTED_BY_LENGTH,
        },
    };
}
export async function enqueueMlsSync(data = {}, options = {}) {
    const plan = getMlsSyncQueuePlan(data, 'api');
    return mlsQueue.add(MLS_SYNC_JOB_NAME, plan.data, {
        ...options,
        attempts: options.attempts ?? defaultJobOptions.attempts,
        backoff: options.backoff ?? defaultJobOptions.backoff,
        removeOnComplete: options.removeOnComplete ?? defaultJobOptions.removeOnComplete,
        removeOnFail: options.removeOnFail ?? defaultJobOptions.removeOnFail,
    });
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/mlsQueue.ts
