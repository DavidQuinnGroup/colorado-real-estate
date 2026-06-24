import { Job, Queue, type JobsOptions } from 'bullmq';

import { createLazyQueue } from './lazyQueue.js';
import { getRedisConnection } from './redis.js';

export type DeadLetterJobData = {
  sourceQueue: string;
  sourceJobId?: string;
  sourceJobName?: string;
  failedReason: string;
  failedAt: string;
  attemptsMade?: number;
  finalAttempt?: boolean;
  stack?: string;
  payload?: unknown;
  capturedAt?: string;
  capturedBy?: string;
  sourceJobState?: string;
  sourceJobTimestamp?: string;
  sourceJobProcessedOn?: string;
  sourceJobFinishedOn?: string;
  sourceJobDelay?: number;
  sourceJobPriority?: number;
  sourceJobAttempts?: number;
};

export type DeadLetterQueuePlan = {
  queueName: typeof DEAD_LETTER_QUEUE_NAME;
  jobName: 'failed-job';
  jobId: string;
  data: DeadLetterJobData;
  terminal: 'Terminal 5';
  commands: {
    inspect: string;
    inspectOpen: string;
    inspectSourceQueue: string;
    queueDashboard: string;
    retryStatus: string;
    status: string;
  };
  defaultJobOptions: {
    attempts: number;
    removeOnComplete: {
      age: number;
      count: number;
    };
    removeOnFail: {
      age: number;
      count: number;
    };
  };
  limits: {
    maxTextLength: number;
    maxStackLength: number;
    maxPayloadTextLength: number;
    maxObjectDepth: number;
    maxObjectKeys: number;
    maxArrayItems: number;
    maxSourceQueueLength: number;
  };
};

export const DEAD_LETTER_QUEUE_NAME = 'reie-dead-letter';

const MAX_TEXT_LENGTH = 6_000;
const MAX_STACK_LENGTH = 12_000;
const MAX_PAYLOAD_TEXT_LENGTH = 18_000;
const MAX_OBJECT_DEPTH = 5;
const MAX_OBJECT_KEYS = 80;
const MAX_ARRAY_ITEMS = 50;
const MAX_SOURCE_QUEUE_LENGTH = 120;
const REDACTED_VALUE = '[REDACTED]';
const TRUNCATED_VALUE = '[TRUNCATED]';
const SENSITIVE_KEY_PATTERN = /(?:api[_-]?key|authorization|bearer|cookie|credential|password|secret|token|refresh[_-]?token|access[_-]?token|private[_-]?key)/i;

const defaultJobOptions: JobsOptions = {
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
  return new Queue<DeadLetterJobData>(DEAD_LETTER_QUEUE_NAME, {
    connection: getRedisConnection(),
    defaultJobOptions,
  });
}

export const deadLetterQueue = createLazyQueue(createDeadLetterQueue);

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error || 'Unknown worker failure.');
}

function getErrorStack(error: unknown) {
  if (error instanceof Error) return error.stack;
  return undefined;
}

function trimText(value: string | undefined, maxLength = MAX_TEXT_LENGTH) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.length <= maxLength) return trimmed;

  return `${trimmed.slice(0, maxLength)}\n${TRUNCATED_VALUE}`;
}

function toIsoDate(value: number | undefined | null) {
  return value ? new Date(value).toISOString() : undefined;
}

function getSafeNumber(value: number | undefined) {
  return Number.isFinite(value) ? value : undefined;
}

function getSafeSourceQueue(value: string) {
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, MAX_SOURCE_QUEUE_LENGTH) : 'unknown';
}

function getSafeString(value: string | undefined, maxLength = 240) {
  if (!value) return undefined;
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, maxLength) : undefined;
}

function getFinalAttempt(attemptsMade: number | undefined, sourceJobAttempts: number | undefined) {
  if (!Number.isFinite(attemptsMade) || !Number.isFinite(sourceJobAttempts) || !sourceJobAttempts) return undefined;
  return Number(attemptsMade) >= Number(sourceJobAttempts);
}

function sanitizePayloadValue(value: unknown, depth = 0, seen = new WeakSet<object>()): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return trimText(value, MAX_TEXT_LENGTH) ?? '';
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (typeof value === 'bigint') return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'function' || typeof value === 'symbol') return String(value);

  if (typeof value !== 'object') return String(value);

  if (seen.has(value)) return '[Circular]';
  if (depth >= MAX_OBJECT_DEPTH) return '[Max depth reached]';

  seen.add(value);

  if (Array.isArray(value)) {
    const items = value.slice(0, MAX_ARRAY_ITEMS).map((item) => sanitizePayloadValue(item, depth + 1, seen));
    if (value.length > MAX_ARRAY_ITEMS) items.push(`${TRUNCATED_VALUE} ${value.length - MAX_ARRAY_ITEMS} additional items`);
    return items;
  }

  const entries = Object.entries(value as Record<string, unknown>).slice(0, MAX_OBJECT_KEYS);
  const sanitized: Record<string, unknown> = {};

  for (const [key, entryValue] of entries) {
    sanitized[key] = SENSITIVE_KEY_PATTERN.test(key) ? REDACTED_VALUE : sanitizePayloadValue(entryValue, depth + 1, seen);
  }

  const totalKeys = Object.keys(value as Record<string, unknown>).length;
  if (totalKeys > MAX_OBJECT_KEYS) {
    sanitized.__truncatedKeys = totalKeys - MAX_OBJECT_KEYS;
  }

  return sanitized;
}

function sanitizePayload(payload: unknown) {
  const sanitized = sanitizePayloadValue(payload);

  try {
    const serialized = JSON.stringify(sanitized);
    if (serialized.length <= MAX_PAYLOAD_TEXT_LENGTH) return sanitized;

    return {
      summary: `${TRUNCATED_VALUE} payload exceeded ${MAX_PAYLOAD_TEXT_LENGTH} serialized characters`,
      preview: serialized.slice(0, MAX_PAYLOAD_TEXT_LENGTH),
    };
  } catch {
    return trimText(String(payload), MAX_PAYLOAD_TEXT_LENGTH) ?? null;
  }
}

function normalizeDeadLetterData(data: DeadLetterJobData): DeadLetterJobData {
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

function getDeadLetterJobId(data: DeadLetterJobData) {
  const sourceQueue = data.sourceQueue || 'unknown';
  const sourceJobId = data.sourceJobId || 'unknown';
  const failedAt = data.failedAt || data.capturedAt || new Date().toISOString();

  return `dead-letter-${sourceQueue}-${sourceJobId}-${failedAt}`.replace(/[^\w.-]/g, '-').slice(0, 180);
}

export function getDeadLetterQueuePlan(data: DeadLetterJobData): DeadLetterQueuePlan {
  const normalizedData = normalizeDeadLetterData(data);

  return {
    queueName: DEAD_LETTER_QUEUE_NAME,
    jobName: 'failed-job',
    jobId: getDeadLetterJobId(normalizedData),
    data: normalizedData,
    terminal: 'Terminal 5',
    commands: {
      inspect: 'curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/admin/dead-letter?limit=25"',
      inspectOpen:
        'curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/admin/dead-letter?states=waiting%2Cdelayed%2Cfailed&limit=25"',
      inspectSourceQueue: `curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/admin/dead-letter?sourceQueue=${encodeURIComponent(
        normalizedData.sourceQueue,
      )}&states=waiting%2Cdelayed%2Cfailed&limit=25"`,
      queueDashboard: 'npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000',
      retryStatus: 'curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/mls/retry"',
      status: 'curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/mls/status"',
    },
    defaultJobOptions: {
      attempts: 1,
      removeOnComplete: {
        age: 30 * 24 * 60 * 60,
        count: 500,
      },
      removeOnFail: {
        age: 60 * 24 * 60 * 60,
        count: 1000,
      },
    },
    limits: {
      maxTextLength: MAX_TEXT_LENGTH,
      maxStackLength: MAX_STACK_LENGTH,
      maxPayloadTextLength: MAX_PAYLOAD_TEXT_LENGTH,
      maxObjectDepth: MAX_OBJECT_DEPTH,
      maxObjectKeys: MAX_OBJECT_KEYS,
      maxArrayItems: MAX_ARRAY_ITEMS,
      maxSourceQueueLength: MAX_SOURCE_QUEUE_LENGTH,
    },
  };
}

export async function enqueueDeadLetter(data: DeadLetterJobData, options: JobsOptions = {}) {
  const plan = getDeadLetterQueuePlan(data);

  return deadLetterQueue.add(plan.jobName, plan.data, {
    ...options,
    jobId: options.jobId ?? plan.jobId,
    attempts: options.attempts ?? defaultJobOptions.attempts,
    removeOnComplete: options.removeOnComplete ?? defaultJobOptions.removeOnComplete,
    removeOnFail: options.removeOnFail ?? defaultJobOptions.removeOnFail,
  });
}

export async function enqueueDeadLetterFromJob(sourceQueue: string, job: Job | undefined, error: unknown) {
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
