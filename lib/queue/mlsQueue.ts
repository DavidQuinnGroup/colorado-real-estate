import { Queue, type JobsOptions } from 'bullmq';

import { getRedisConnection } from './redis.js';

export type MlsSyncJobSource = 'api' | 'worker-once' | 'script' | 'system';

export type MlsSyncJobData = {
  requestedAt?: string;
  requestedBy?: string;
  source?: MlsSyncJobSource;
  maxRuntimeMs?: number;
  rateDelayMs?: number;
  pageSize?: number;
  maxPages?: number;
  startPage?: number;
  includeMedia?: boolean;
  pageTimeoutMs?: number;
};

export const MLS_SYNC_QUEUE_NAME = 'mls-sync';
export const MLS_SYNC_JOB_NAME = 'sync';

export const MLS_SYNC_DEFAULT_MAX_RUNTIME_MS = 10 * 60 * 1000;
export const MLS_SYNC_DEFAULT_RATE_DELAY_MS = 1100;
export const MLS_SYNC_DEFAULT_PAGE_SIZE = 50;
export const MLS_SYNC_DEFAULT_MAX_PAGES = 1;
export const MLS_SYNC_DEFAULT_PAGE_TIMEOUT_MS = 30_000;

export const MLS_SYNC_MAX_RUNTIME_MS = 60 * 60 * 1000;
export const MLS_SYNC_MAX_RATE_DELAY_MS = 60_000;
export const MLS_SYNC_MAX_PAGE_SIZE = 100;
export const MLS_SYNC_MAX_PAGES = 100;
export const MLS_SYNC_MAX_START_PAGE = 1_000_000;
export const MLS_SYNC_MAX_PAGE_TIMEOUT_MS = 120_000;

export const MLS_SYNC_JOB_ATTEMPTS = 3;
export const MLS_SYNC_JOB_BACKOFF_DELAY_MS = 5_000;
export const MLS_SYNC_REMOVE_ON_COMPLETE_AGE_SECONDS = 7 * 24 * 60 * 60;
export const MLS_SYNC_REMOVE_ON_COMPLETE_COUNT = 250;
export const MLS_SYNC_REMOVE_ON_FAIL_AGE_SECONDS = 30 * 24 * 60 * 60;
export const MLS_SYNC_REMOVE_ON_FAIL_COUNT = 500;

const defaultJobOptions: JobsOptions = {
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

export const connection = getRedisConnection();

export const mlsQueue = new Queue<MlsSyncJobData>(MLS_SYNC_QUEUE_NAME, {
  connection,
  defaultJobOptions,
});

function getSafeInteger(value: number | undefined, fallback: number, min: number, max: number) {
  if (!Number.isFinite(value) || value === undefined) return fallback;
  return Math.max(min, Math.min(Math.floor(value), max));
}

function getSafeRequestedAt(value: string | undefined) {
  if (!value) return new Date().toISOString();

  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return new Date().toISOString();

  return parsed.toISOString();
}

function getSafeRequestedBy(value: string | undefined) {
  if (!value) return undefined;

  const cleaned = value.trim();
  if (!cleaned) return undefined;

  return cleaned.slice(0, 120);
}

function getSafeSource(value: MlsSyncJobSource | undefined): MlsSyncJobSource {
  if (value === 'api' || value === 'worker-once' || value === 'script' || value === 'system') {
    return value;
  }

  return 'system';
}

function getOptionalBoolean(value: boolean | undefined) {
  return typeof value === 'boolean' ? value : undefined;
}

export function normalizeMlsSyncJobData(data: MlsSyncJobData = {}): MlsSyncJobData {
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

export async function enqueueMlsSync(data: MlsSyncJobData = {}, options: JobsOptions = {}) {
  const normalizedData = normalizeMlsSyncJobData({
    ...data,
    source: data.source ?? 'api',
  });

  return mlsQueue.add(MLS_SYNC_JOB_NAME, normalizedData, {
    ...options,
    attempts: options.attempts ?? defaultJobOptions.attempts,
    backoff: options.backoff ?? defaultJobOptions.backoff,
    removeOnComplete: options.removeOnComplete ?? defaultJobOptions.removeOnComplete,
    removeOnFail: options.removeOnFail ?? defaultJobOptions.removeOnFail,
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/mlsQueue.ts
