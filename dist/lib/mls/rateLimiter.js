"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = rateLimit;
let lastRequestTime = 0;
async function rateLimit() {
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    const MIN_DELAY = 500; // 🔥 2 requests/sec
    if (elapsed < MIN_DELAY) {
        await new Promise((r) => setTimeout(r, MIN_DELAY - elapsed));
    }
    lastRequestTime = Date.now();
}
