"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptiveDelay = adaptiveDelay;
exports.recordSuccess = recordSuccess;
exports.recordFailure = recordFailure;
exports.getCurrentDelay = getCurrentDelay;
let currentDelay = 600; // start safe
const MIN_DELAY = 400; // fastest (~2.5 RPS ceiling buffer)
const MAX_DELAY = 5000; // slowest fallback
let successStreak = 0;
async function adaptiveDelay() {
    await new Promise((r) => setTimeout(r, currentDelay));
}
function recordSuccess() {
    successStreak++;
    // gradually speed up after 5 successes
    if (successStreak >= 5) {
        currentDelay = Math.max(MIN_DELAY, currentDelay - 50);
        successStreak = 0;
        console.log(`⚡ Speeding up: ${currentDelay}ms`);
    }
}
function recordFailure(status) {
    successStreak = 0;
    if (status === 429) {
        currentDelay = Math.min(MAX_DELAY, currentDelay * 2);
        console.log(`🚨 429 detected — backing off HARD: ${currentDelay}ms`);
    }
    else {
        currentDelay = Math.min(MAX_DELAY, currentDelay + 200);
        console.log(`⚠️ Error detected — slowing: ${currentDelay}ms`);
    }
}
function getCurrentDelay() {
    return currentDelay;
}
