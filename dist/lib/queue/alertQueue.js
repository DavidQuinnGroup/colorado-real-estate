import { Queue } from 'bullmq';
import { createLazyQueue } from './lazyQueue.js';
import { getRedisConnection } from './redis.js';
export const ALERT_QUEUE_NAME = 'reie-alerts';
export const ALERT_JOB_NAME = 'process-alert';
export const ALERT_JOB_ATTEMPTS = 3;
export const ALERT_JOB_BACKOFF_DELAY_MS = 3000;
export const ALERT_REMOVE_ON_COMPLETE_AGE_SECONDS = 7 * 24 * 60 * 60;
export const ALERT_REMOVE_ON_COMPLETE_COUNT = 250;
export const ALERT_REMOVE_ON_FAIL_AGE_SECONDS = 30 * 24 * 60 * 60;
export const ALERT_REMOVE_ON_FAIL_COUNT = 500;
export const ALERT_MAX_REQUESTED_BY_LENGTH = 120;
const defaultJobOptions = {
    attempts: ALERT_JOB_ATTEMPTS,
    backoff: {
        type: 'exponential',
        delay: ALERT_JOB_BACKOFF_DELAY_MS,
    },
    removeOnComplete: {
        age: ALERT_REMOVE_ON_COMPLETE_AGE_SECONDS,
        count: ALERT_REMOVE_ON_COMPLETE_COUNT,
    },
    removeOnFail: {
        age: ALERT_REMOVE_ON_FAIL_AGE_SECONDS,
        count: ALERT_REMOVE_ON_FAIL_COUNT,
    },
};
function createAlertQueue() {
    return new Queue(ALERT_QUEUE_NAME, {
        connection: getRedisConnection(),
        defaultJobOptions,
    });
}
export const alertQueue = createLazyQueue(createAlertQueue);
export function getAlertJobId(alertId) {
    return `alert-${alertId}`;
}
function getSafeString(value, fallback = '') {
    if (!value)
        return fallback;
    const cleaned = value.trim();
    return cleaned || fallback;
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
    const cleaned = getSafeString(value);
    return cleaned ? cleaned.slice(0, ALERT_MAX_REQUESTED_BY_LENGTH) : undefined;
}
function getSafeSource(value) {
    if (value === 'api' || value === 'matching' || value === 'script' || value === 'system') {
        return value;
    }
    return 'system';
}
export function normalizeAlertJobData(data) {
    const alertId = getSafeString(data.alertId);
    if (!alertId) {
        throw new Error('Alert queue job requires alertId.');
    }
    return {
        alertId,
        requestedAt: getSafeRequestedAt(data.requestedAt),
        requestedBy: getSafeRequestedBy(data.requestedBy),
        source: getSafeSource(data.source),
    };
}
export function getAlertQueuePlan(alertId, data = {}, sourceFallback = 'matching') {
    const normalized = normalizeAlertJobData({
        ...data,
        alertId,
        source: data.source ?? sourceFallback,
    });
    return {
        queueName: ALERT_QUEUE_NAME,
        jobName: ALERT_JOB_NAME,
        jobId: getAlertJobId(normalized.alertId || alertId),
        data: normalized,
        terminal: 'Terminal 3',
        recoveryTerminal: 'Terminal 5',
        commands: {
            startWorker: 'npm run run:worker:alerts',
            dryRunWorker: 'npm run run:worker:alerts:once',
            liveOnceWorker: 'npm run run:worker:alerts:once:live',
            processAlertsDryRun: 'curl --max-time 20 -s -X POST -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=25"',
            status: 'curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/process-alerts?limit=25"',
            retryDryRun: 'curl --max-time 8 -s -X POST -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/mls/retry?queue=alerts&dryRun=true&limit=6"',
            queueDashboard: 'npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000',
            deadLetter: 'curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/admin/dead-letter?sourceQueue=reie-alerts&states=waiting%2Cdelayed%2Cfailed&limit=25"',
        },
        defaultJobOptions: {
            attempts: ALERT_JOB_ATTEMPTS,
            backoff: {
                type: 'exponential',
                delay: ALERT_JOB_BACKOFF_DELAY_MS,
            },
            removeOnComplete: {
                age: ALERT_REMOVE_ON_COMPLETE_AGE_SECONDS,
                count: ALERT_REMOVE_ON_COMPLETE_COUNT,
            },
            removeOnFail: {
                age: ALERT_REMOVE_ON_FAIL_AGE_SECONDS,
                count: ALERT_REMOVE_ON_FAIL_COUNT,
            },
        },
        bounded: {
            alertId: normalized.alertId !== alertId,
            requestedAt: data.requestedAt !== undefined && normalized.requestedAt !== data.requestedAt,
            requestedBy: data.requestedBy !== undefined &&
                getSafeRequestedBy(data.requestedBy) !== (data.requestedBy.trim() || undefined),
            source: data.source !== undefined && normalized.source !== data.source,
        },
        limits: {
            maxRequestedByLength: ALERT_MAX_REQUESTED_BY_LENGTH,
        },
    };
}
export async function enqueueAlertJob(alertId, data = {}, options = {}) {
    const plan = getAlertQueuePlan(alertId, data, 'matching');
    return alertQueue.add(ALERT_JOB_NAME, plan.data, {
        ...options,
        jobId: options.jobId ?? plan.jobId,
        attempts: options.attempts ?? defaultJobOptions.attempts,
        backoff: options.backoff ?? defaultJobOptions.backoff,
        removeOnComplete: options.removeOnComplete ?? defaultJobOptions.removeOnComplete,
        removeOnFail: options.removeOnFail ?? defaultJobOptions.removeOnFail,
    });
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/alertQueue.ts
