const DEFAULT_INITIAL_DELAY_MS = 600;
const DEFAULT_MIN_DELAY_MS = 400;
const DEFAULT_MAX_DELAY_MS = 5000;
const DEFAULT_SUCCESS_THRESHOLD = 5;
const DEFAULT_STEP_MS = 50;
const DEFAULT_FAILURE_STEP_MS = 200;
let currentDelayMs = readBoundedInteger('MLS_ADAPTIVE_INITIAL_DELAY_MS', DEFAULT_INITIAL_DELAY_MS, 0, 60000);
let successStreak = 0;
function readBoundedInteger(key, fallback, min, max) {
    const parsed = Number(process.env[key]);
    if (!Number.isFinite(parsed))
        return fallback;
    return Math.max(min, Math.min(Math.floor(parsed), max));
}
function getMinDelayMs() {
    return readBoundedInteger('MLS_ADAPTIVE_MIN_DELAY_MS', DEFAULT_MIN_DELAY_MS, 0, 60000);
}
function getMaxDelayMs() {
    return readBoundedInteger('MLS_ADAPTIVE_MAX_DELAY_MS', DEFAULT_MAX_DELAY_MS, getMinDelayMs(), 60000);
}
function getSuccessThreshold() {
    return readBoundedInteger('MLS_ADAPTIVE_SUCCESS_THRESHOLD', DEFAULT_SUCCESS_THRESHOLD, 1, 100);
}
function getStepMs() {
    return readBoundedInteger('MLS_ADAPTIVE_STEP_MS', DEFAULT_STEP_MS, 1, 10000);
}
function getFailureStepMs() {
    return readBoundedInteger('MLS_ADAPTIVE_FAILURE_STEP_MS', DEFAULT_FAILURE_STEP_MS, 1, 10000);
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function clampDelay(value) {
    return Math.max(getMinDelayMs(), Math.min(Math.floor(value), getMaxDelayMs()));
}
export async function adaptiveDelay() {
    if (currentDelayMs > 0) {
        await sleep(currentDelayMs);
    }
}
export function recordSuccess() {
    successStreak += 1;
    if (successStreak < getSuccessThreshold()) {
        return getAdaptiveLimiterState();
    }
    currentDelayMs = clampDelay(currentDelayMs - getStepMs());
    successStreak = 0;
    return getAdaptiveLimiterState();
}
export function recordFailure(status) {
    successStreak = 0;
    if (status === 429) {
        currentDelayMs = clampDelay(currentDelayMs * 2);
    }
    else {
        currentDelayMs = clampDelay(currentDelayMs + getFailureStepMs());
    }
    return getAdaptiveLimiterState();
}
export function resetAdaptiveLimiter(delayMs = DEFAULT_INITIAL_DELAY_MS) {
    currentDelayMs = clampDelay(delayMs);
    successStreak = 0;
    return getAdaptiveLimiterState();
}
export function getCurrentDelay() {
    return currentDelayMs;
}
export function getAdaptiveLimiterState() {
    return {
        currentDelayMs,
        maxDelayMs: getMaxDelayMs(),
        minDelayMs: getMinDelayMs(),
        successStreak,
        successThreshold: getSuccessThreshold(),
    };
}
// lib/mls/adaptiveLimiter.ts
