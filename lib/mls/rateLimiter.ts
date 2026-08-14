export const MLS_GRID_DEFAULT_MIN_DELAY_MS = 1000;
export const MLS_GRID_MAX_MIN_DELAY_MS = 60_000;
export const MLS_GRID_DEFAULT_MAX_REQUESTS_PER_RUN = 1000;
export const MLS_GRID_DEFAULT_MAX_REQUESTS_PER_MINUTE = 60;
export const MLS_GRID_DEFAULT_MAX_REQUESTS_PER_HOUR = 3600;
export const MLS_GRID_DEFAULT_MAX_REQUESTS_PER_24H = 30_000;
export const MLS_GRID_DEFAULT_MAX_RETRIES = 2;
export const MLS_GRID_DEFAULT_RETRY_BASE_DELAY_MS = 1000;
export const MLS_GRID_DEFAULT_RETRY_MAX_DELAY_MS = 30_000;

const minuteMs = 60_000;
const hourMs = 60 * minuteMs;
const dayMs = 24 * hourMs;

let lastRequestTime = 0;
let limiterChain = Promise.resolve();
let runStartedAt = 0;
let runEndedAt = 0;
let requestsAttempted = 0;
let requestsSucceeded = 0;
let requestsFailed = 0;
let requestTimes: number[] = [];

type Clock = () => number;
type Sleep = (ms: number) => Promise<void>;

let now: Clock = () => Date.now();
let sleepImpl: Sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export type MlsGridRequestGovernorConfig = {
  maxRequestsPer24h?: number;
  maxRequestsPerHour?: number;
  maxRequestsPerMinute?: number;
  maxRequestsPerRun?: number;
  minDelayMs?: number;
  now?: Clock;
  sleep?: Sleep;
};

export type MlsGridRequestGovernorPolicy = {
  burstCapacity: 1;
  maxRequestsPer24h: number;
  maxRequestsPerHour: number;
  maxRequestsPerMinute: number;
  maxRequestsPerRun: number;
  minDelayMs: number;
};

export type MlsGridRetryPolicy = {
  baseDelayMs: number;
  maxDelayMs: number;
  maxRetries: number;
};

const governorConfig: MlsGridRequestGovernorConfig = {};

function getBoundedDelayMs(value: number | undefined, fallback = MLS_GRID_DEFAULT_MIN_DELAY_MS) {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.min(Math.floor(value), MLS_GRID_MAX_MIN_DELAY_MS));
}

function getPositiveInteger(value: number | undefined, fallback: number) {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.max(1, Math.floor(value));
}

function getNonnegativeInteger(value: number | undefined, fallback: number) {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.floor(value));
}

function readOptionalInteger(name: string) {
  const value = process.env[name];
  if (value === undefined || value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function readMlsGridDelayMs() {
  const parsed = Number(process.env.MLS_GRID_MIN_DELAY_MS ?? process.env.MLS_RATE_DELAY_MS);

  return getBoundedDelayMs(parsed);
}

export function getMlsGridRequestGovernorPolicy(): MlsGridRequestGovernorPolicy {
  return {
    burstCapacity: 1,
    maxRequestsPer24h: getPositiveInteger(
      governorConfig.maxRequestsPer24h ?? readOptionalInteger('MLS_GRID_MAX_REQUESTS_PER_24H'),
      MLS_GRID_DEFAULT_MAX_REQUESTS_PER_24H,
    ),
    maxRequestsPerHour: getPositiveInteger(
      governorConfig.maxRequestsPerHour ?? readOptionalInteger('MLS_GRID_MAX_REQUESTS_PER_HOUR'),
      MLS_GRID_DEFAULT_MAX_REQUESTS_PER_HOUR,
    ),
    maxRequestsPerMinute: getPositiveInteger(
      governorConfig.maxRequestsPerMinute ?? readOptionalInteger('MLS_GRID_MAX_REQUESTS_PER_MINUTE'),
      MLS_GRID_DEFAULT_MAX_REQUESTS_PER_MINUTE,
    ),
    maxRequestsPerRun: getPositiveInteger(
      governorConfig.maxRequestsPerRun ?? readOptionalInteger('MLS_GRID_MAX_REQUESTS_PER_RUN'),
      MLS_GRID_DEFAULT_MAX_REQUESTS_PER_RUN,
    ),
    minDelayMs: getBoundedDelayMs(governorConfig.minDelayMs ?? readMlsGridDelayMs()),
  };
}

export function readMlsGridRetryPolicy(): MlsGridRetryPolicy {
  return {
    baseDelayMs: getBoundedDelayMs(
      readOptionalInteger('MLS_GRID_RETRY_BASE_DELAY_MS'),
      MLS_GRID_DEFAULT_RETRY_BASE_DELAY_MS,
    ),
    maxDelayMs: getBoundedDelayMs(
      readOptionalInteger('MLS_GRID_RETRY_MAX_DELAY_MS'),
      MLS_GRID_DEFAULT_RETRY_MAX_DELAY_MS,
    ),
    maxRetries: getNonnegativeInteger(readOptionalInteger('MLS_GRID_MAX_RETRIES'), MLS_GRID_DEFAULT_MAX_RETRIES),
  };
}

export function configureMlsGridRequestGovernor(config: MlsGridRequestGovernorConfig = {}) {
  governorConfig.maxRequestsPer24h = config.maxRequestsPer24h;
  governorConfig.maxRequestsPerHour = config.maxRequestsPerHour;
  governorConfig.maxRequestsPerMinute = config.maxRequestsPerMinute;
  governorConfig.maxRequestsPerRun = config.maxRequestsPerRun;
  governorConfig.minDelayMs = config.minDelayMs;
  if (config.now) now = config.now;
  if (config.sleep) sleepImpl = config.sleep;
}

export function resetMlsGridRequestGovernorConfig() {
  governorConfig.maxRequestsPer24h = undefined;
  governorConfig.maxRequestsPerHour = undefined;
  governorConfig.maxRequestsPerMinute = undefined;
  governorConfig.maxRequestsPerRun = undefined;
  governorConfig.minDelayMs = undefined;
  now = () => Date.now();
  sleepImpl = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
}

function pruneRequestTimes(currentTime: number) {
  requestTimes = requestTimes.filter((requestTime) => currentTime - requestTime < dayMs);
}

function countRequestsSince(currentTime: number, windowMs: number) {
  return requestTimes.filter((requestTime) => currentTime - requestTime < windowMs).length;
}

function assertBudgetAvailable(policy: MlsGridRequestGovernorPolicy, currentTime: number) {
  pruneRequestTimes(currentTime);

  if (requestsAttempted >= policy.maxRequestsPerRun) {
    throw new Error(`MLS Grid request budget exhausted: maxRequestsPerRun=${policy.maxRequestsPerRun}.`);
  }

  if (countRequestsSince(currentTime, minuteMs) >= policy.maxRequestsPerMinute) {
    throw new Error(`MLS Grid request budget exhausted: maxRequestsPerMinute=${policy.maxRequestsPerMinute}.`);
  }

  if (countRequestsSince(currentTime, hourMs) >= policy.maxRequestsPerHour) {
    throw new Error(`MLS Grid request budget exhausted: maxRequestsPerHour=${policy.maxRequestsPerHour}.`);
  }

  if (countRequestsSince(currentTime, dayMs) >= policy.maxRequestsPer24h) {
    throw new Error(`MLS Grid request budget exhausted: maxRequestsPer24h=${policy.maxRequestsPer24h}.`);
  }
}

function markRequestAttempted(requestTime: number) {
  if (!runStartedAt) runStartedAt = requestTime;
  runEndedAt = requestTime;
  requestsAttempted += 1;
  requestTimes.push(requestTime);
}

function recordRequestOutcome(outcome: 'success' | 'failure') {
  runEndedAt = now();
  if (outcome === 'success') requestsSucceeded += 1;
  else requestsFailed += 1;
}

export function getRateLimitState() {
  const currentTime = now();
  const durationMs = runStartedAt ? Math.max(0, (runEndedAt || currentTime) - runStartedAt) : 0;

  return {
    averageRequestsPerSecond: durationMs > 0 ? requestsAttempted / (durationMs / 1000) : 0,
    failed: requestsFailed,
    lastRequestTime,
    nextAvailableAt: lastRequestTime ? lastRequestTime + getMlsGridRequestGovernorPolicy().minDelayMs : 0,
    policy: getMlsGridRequestGovernorPolicy(),
    requestTimes: [...requestTimes],
    runEndedAt,
    runStartedAt,
    succeeded: requestsSucceeded,
    attempted: requestsAttempted,
  };
}

export function resetRateLimitState() {
  lastRequestTime = 0;
  limiterChain = Promise.resolve();
  runStartedAt = 0;
  runEndedAt = 0;
  requestsAttempted = 0;
  requestsSucceeded = 0;
  requestsFailed = 0;
  requestTimes = [];
}

export async function rateLimit(delayMs?: number) {
  const policy = {
    ...getMlsGridRequestGovernorPolicy(),
    minDelayMs: getBoundedDelayMs(delayMs, getMlsGridRequestGovernorPolicy().minDelayMs),
  };

  const run = limiterChain.then(async () => {
    const beforeWait = now();
    assertBudgetAvailable(policy, beforeWait);

    const elapsed = beforeWait - lastRequestTime;
    const waitMs = Math.max(0, policy.minDelayMs - elapsed);

    if (waitMs > 0) {
      await sleepImpl(waitMs);
    }

    const requestTime = now();
    assertBudgetAvailable(policy, requestTime);
    lastRequestTime = requestTime;
    markRequestAttempted(requestTime);

    return {
      minDelayMs: policy.minDelayMs,
      waitedMs: waitMs,
      requestTime: lastRequestTime,
    };
  });

  limiterChain = run.then(
    () => undefined,
    () => undefined,
  );

  return run;
}

export async function executeMlsGridRequest<T>(operation: () => Promise<T>, delayMs?: number) {
  await rateLimit(delayMs);

  try {
    const result = await operation();
    recordRequestOutcome('success');
    return result;
  } catch (error) {
    recordRequestOutcome('failure');
    throw error;
  }
}

export function isRetryableMlsGridStatus(status: number | undefined) {
  return status === 408 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

export function getMlsGridRetryDelayMs(attempt: number, retryAfterMs?: number) {
  const policy = readMlsGridRetryPolicy();

  if (retryAfterMs !== undefined && Number.isFinite(retryAfterMs)) {
    return Math.max(0, Math.min(Math.floor(retryAfterMs), policy.maxDelayMs));
  }

  return Math.min(policy.baseDelayMs * 2 ** Math.max(0, attempt), policy.maxDelayMs);
}

export async function waitForMlsGridRetry(attempt: number, retryAfterMs?: number) {
  const waitMs = getMlsGridRetryDelayMs(attempt, retryAfterMs);
  if (waitMs > 0) await sleepImpl(waitMs);
  return waitMs;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/rateLimiter.ts
