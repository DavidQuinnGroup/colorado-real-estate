import { Queue, type JobsOptions } from 'bullmq';

import { createLazyQueue } from './lazyQueue.js';
import { getRedisConnection } from './redis.js';

export type AlertJobData = {
  alertId?: string;
  requestedAt?: string;
  requestedBy?: string;
  source?: AlertJobSource;
};

export type AlertJobSource = 'api' | 'matching' | 'script' | 'system';

export const ALERT_QUEUE_NAME = 'reie-alerts';
export const ALERT_JOB_NAME = 'process-alert';

export const ALERT_JOB_ATTEMPTS = 3;
export const ALERT_JOB_BACKOFF_DELAY_MS = 3_000;
export const ALERT_REMOVE_ON_COMPLETE_AGE_SECONDS = 7 * 24 * 60 * 60;
export const ALERT_REMOVE_ON_COMPLETE_COUNT = 250;
export const ALERT_REMOVE_ON_FAIL_AGE_SECONDS = 30 * 24 * 60 * 60;
export const ALERT_REMOVE_ON_FAIL_COUNT = 500;

const defaultJobOptions: JobsOptions = {
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
  return new Queue<AlertJobData>(ALERT_QUEUE_NAME, {
    connection: getRedisConnection(),
    defaultJobOptions,
  });
}

export const alertQueue = createLazyQueue(createAlertQueue);

export function getAlertJobId(alertId: string) {
  return `alert-${alertId}`;
}

function getSafeString(value: string | undefined, fallback = '') {
  if (!value) return fallback;

  const cleaned = value.trim();
  return cleaned || fallback;
}

function getSafeRequestedAt(value: string | undefined) {
  if (!value) return new Date().toISOString();

  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return new Date().toISOString();

  return parsed.toISOString();
}

function getSafeRequestedBy(value: string | undefined) {
  const cleaned = getSafeString(value);
  return cleaned ? cleaned.slice(0, 120) : undefined;
}

function getSafeSource(value: AlertJobSource | undefined): AlertJobSource {
  if (value === 'api' || value === 'matching' || value === 'script' || value === 'system') {
    return value;
  }

  return 'system';
}

export function normalizeAlertJobData(data: AlertJobData): AlertJobData {
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

export async function enqueueAlertJob(alertId: string, data: Omit<AlertJobData, 'alertId'> = {}, options: JobsOptions = {}) {
  const normalized = normalizeAlertJobData({
    ...data,
    alertId,
    source: data.source ?? 'matching',
  });

  return alertQueue.add(ALERT_JOB_NAME, normalized, {
    ...options,
    jobId: options.jobId ?? getAlertJobId(normalized.alertId || alertId),
    attempts: options.attempts ?? defaultJobOptions.attempts,
    backoff: options.backoff ?? defaultJobOptions.backoff,
    removeOnComplete: options.removeOnComplete ?? defaultJobOptions.removeOnComplete,
    removeOnFail: options.removeOnFail ?? defaultJobOptions.removeOnFail,
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/alertQueue.ts
