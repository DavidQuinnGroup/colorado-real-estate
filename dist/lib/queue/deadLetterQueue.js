import { Queue } from 'bullmq';
import { createLazyQueue } from './lazyQueue.js';
import { getRedisConnection } from './redis.js';
export const DEAD_LETTER_QUEUE_NAME = 'reie-dead-letter';
const MAX_TEXT_LENGTH = 6000;
const MAX_STACK_LENGTH = 12000;
const MAX_PAYLOAD_TEXT_LENGTH = 18000;
const MAX_OBJECT_DEPTH = 5;
const MAX_OBJECT_KEYS = 80;
const MAX_ARRAY_ITEMS = 50;
const REDACTED_VALUE = '[REDACTED]';
const TRUNCATED_VALUE = '[TRUNCATED]';
const SENSITIVE_KEY_PATTERN = /(?:api[_-]?key|authorization|bearer|cookie|credential|password|secret|token|refresh[_-]?token|access[_-]?token|private[_-]?key)/i;
const defaultJobOptions = {
    attempts: 1,
    removeOnComplete: {
        age: 30 * 24 * 60 * 60,
        count: 500,
    },
    removeOnFail: {
        age: 60 * 24 * 60 * 60,
        count: 1000,
    },
};
function createDeadLetterQueue() {
    return new Queue(DEAD_LETTER_QUEUE_NAME, {
        connection: getRedisConnection(),
        defaultJobOptions,
    });
}
export const deadLetterQueue = createLazyQueue(createDeadLetterQueue);
function getErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error || 'Unknown worker failure.');
}
function getErrorStack(error) {
    if (error instanceof Error)
        return error.stack;
    return undefined;
}
function trimText(value, maxLength = MAX_TEXT_LENGTH) {
    if (!value)
        return undefined;
    const trimmed = value.trim();
    if (!trimmed)
        return undefined;
    if (trimmed.length <= maxLength)
        return trimmed;
    return `${trimmed.slice(0, maxLength)}\n${TRUNCATED_VALUE}`;
}
function toIsoDate(value) {
    return value ? new Date(value).toISOString() : undefined;
}
function getSafeNumber(value) {
    return Number.isFinite(value) ? value : undefined;
}
function getSafeSourceQueue(value) {
    const cleaned = value.trim();
    return cleaned ? cleaned.slice(0, 120) : 'unknown';
}
function getSafeString(value, maxLength = 240) {
    if (!value)
        return undefined;
    const cleaned = value.trim();
    return cleaned ? cleaned.slice(0, maxLength) : undefined;
}
function getFinalAttempt(attemptsMade, sourceJobAttempts) {
    if (!Number.isFinite(attemptsMade) || !Number.isFinite(sourceJobAttempts) || !sourceJobAttempts)
        return undefined;
    return Number(attemptsMade) >= Number(sourceJobAttempts);
}
function sanitizePayloadValue(value, depth = 0, seen = new WeakSet()) {
    if (value === null || value === undefined)
        return value;
    if (typeof value === 'string')
        return trimText(value, MAX_TEXT_LENGTH) ?? '';
    if (typeof value === 'number' || typeof value === 'boolean')
        return value;
    if (typeof value === 'bigint')
        return value.toString();
    if (value instanceof Date)
        return value.toISOString();
    if (typeof value === 'function' || typeof value === 'symbol')
        return String(value);
    if (typeof value !== 'object')
        return String(value);
    if (seen.has(value))
        return '[Circular]';
    if (depth >= MAX_OBJECT_DEPTH)
        return '[Max depth reached]';
    seen.add(value);
    if (Array.isArray(value)) {
        const items = value.slice(0, MAX_ARRAY_ITEMS).map((item) => sanitizePayloadValue(item, depth + 1, seen));
        if (value.length > MAX_ARRAY_ITEMS)
            items.push(`${TRUNCATED_VALUE} ${value.length - MAX_ARRAY_ITEMS} additional items`);
        return items;
    }
    const entries = Object.entries(value).slice(0, MAX_OBJECT_KEYS);
    const sanitized = {};
    for (const [key, entryValue] of entries) {
        sanitized[key] = SENSITIVE_KEY_PATTERN.test(key) ? REDACTED_VALUE : sanitizePayloadValue(entryValue, depth + 1, seen);
    }
    const totalKeys = Object.keys(value).length;
    if (totalKeys > MAX_OBJECT_KEYS) {
        sanitized.__truncatedKeys = totalKeys - MAX_OBJECT_KEYS;
    }
    return sanitized;
}
function sanitizePayload(payload) {
    const sanitized = sanitizePayloadValue(payload);
    try {
        const serialized = JSON.stringify(sanitized);
        if (serialized.length <= MAX_PAYLOAD_TEXT_LENGTH)
            return sanitized;
        return {
            summary: `${TRUNCATED_VALUE} payload exceeded ${MAX_PAYLOAD_TEXT_LENGTH} serialized characters`,
            preview: serialized.slice(0, MAX_PAYLOAD_TEXT_LENGTH),
        };
    }
    catch {
        return trimText(String(payload), MAX_PAYLOAD_TEXT_LENGTH) ?? null;
    }
}
function normalizeDeadLetterData(data) {
    const failedAt = getSafeString(data.failedAt, 80) || new Date().toISOString();
    const attemptsMade = getSafeNumber(data.attemptsMade);
    const sourceJobAttempts = getSafeNumber(data.sourceJobAttempts);
    return {
        sourceQueue: getSafeSourceQueue(data.sourceQueue),
        sourceJobId: getSafeString(data.sourceJobId),
        sourceJobName: getSafeString(data.sourceJobName),
        failedReason: trimText(data.failedReason) || 'Unknown worker failure.',
        failedAt,
        attemptsMade,
        finalAttempt: typeof data.finalAttempt === 'boolean' ? data.finalAttempt : getFinalAttempt(attemptsMade, sourceJobAttempts),
        stack: trimText(data.stack, MAX_STACK_LENGTH),
        payload: sanitizePayload(data.payload),
        capturedAt: getSafeString(data.capturedAt, 80) || new Date().toISOString(),
        capturedBy: getSafeString(data.capturedBy, 120) || 'reie-worker',
        sourceJobState: getSafeString(data.sourceJobState, 80),
        sourceJobTimestamp: getSafeString(data.sourceJobTimestamp, 80),
        sourceJobProcessedOn: getSafeString(data.sourceJobProcessedOn, 80),
        sourceJobFinishedOn: getSafeString(data.sourceJobFinishedOn, 80),
        sourceJobDelay: getSafeNumber(data.sourceJobDelay),
        sourceJobPriority: getSafeNumber(data.sourceJobPriority),
        sourceJobAttempts,
    };
}
function getDeadLetterJobId(data) {
    const sourceQueue = data.sourceQueue || 'unknown';
    const sourceJobId = data.sourceJobId || 'unknown';
    const failedAt = data.failedAt || data.capturedAt || new Date().toISOString();
    return `dead-letter-${sourceQueue}-${sourceJobId}-${failedAt}`.replace(/[^\w.-]/g, '-').slice(0, 180);
}
export async function enqueueDeadLetter(data, options = {}) {
    const normalizedData = normalizeDeadLetterData(data);
    return deadLetterQueue.add('failed-job', normalizedData, {
        ...options,
        jobId: options.jobId ?? getDeadLetterJobId(normalizedData),
        attempts: options.attempts ?? defaultJobOptions.attempts,
        removeOnComplete: options.removeOnComplete ?? defaultJobOptions.removeOnComplete,
        removeOnFail: options.removeOnFail ?? defaultJobOptions.removeOnFail,
    });
}
export async function enqueueDeadLetterFromJob(sourceQueue, job, error) {
    const sourceJobState = await job?.getState().catch(() => undefined);
    return enqueueDeadLetter({
        sourceQueue,
        sourceJobId: job?.id,
        sourceJobName: job?.name,
        failedReason: getErrorMessage(error),
        failedAt: new Date().toISOString(),
        attemptsMade: job?.attemptsMade,
        finalAttempt: getFinalAttempt(job?.attemptsMade, job?.opts?.attempts),
        stack: getErrorStack(error),
        payload: job?.data,
        capturedAt: new Date().toISOString(),
        capturedBy: 'reie-worker',
        sourceJobState,
        sourceJobTimestamp: toIsoDate(job?.timestamp),
        sourceJobProcessedOn: toIsoDate(job?.processedOn),
        sourceJobFinishedOn: toIsoDate(job?.finishedOn),
        sourceJobDelay: job?.delay,
        sourceJobPriority: job?.opts?.priority,
        sourceJobAttempts: job?.opts?.attempts,
    });
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/deadLetterQueue.ts
