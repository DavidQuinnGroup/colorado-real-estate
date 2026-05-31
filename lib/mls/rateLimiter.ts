export const MLS_GRID_DEFAULT_MIN_DELAY_MS = 500;
export const MLS_GRID_MAX_MIN_DELAY_MS = 60_000;

let lastRequestTime = 0;
let limiterChain = Promise.resolve();

function getBoundedDelayMs(value: number | undefined, fallback = MLS_GRID_DEFAULT_MIN_DELAY_MS) {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.min(Math.floor(value), MLS_GRID_MAX_MIN_DELAY_MS));
}

export function readMlsGridDelayMs() {
  const parsed = Number(process.env.MLS_GRID_MIN_DELAY_MS ?? process.env.MLS_RATE_DELAY_MS);

  return getBoundedDelayMs(parsed);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRateLimitState() {
  return {
    lastRequestTime,
    minDelayMs: readMlsGridDelayMs(),
    nextAvailableAt: lastRequestTime ? lastRequestTime + readMlsGridDelayMs() : 0,
  };
}

export function resetRateLimitState() {
  lastRequestTime = 0;
  limiterChain = Promise.resolve();
}

export async function rateLimit(delayMs = readMlsGridDelayMs()) {
  const minDelayMs = getBoundedDelayMs(delayMs);

  const run = limiterChain.then(async () => {
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    const waitMs = Math.max(0, minDelayMs - elapsed);

    if (waitMs > 0) {
      await sleep(waitMs);
    }

    lastRequestTime = Date.now();

    return {
      minDelayMs,
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

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/rateLimiter.ts
