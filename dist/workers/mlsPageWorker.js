"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_1 = require("../lib/queue/redis");
const QUEUE_NAME = 'mls-page';
const worker = new bullmq_1.Worker(QUEUE_NAME, async (job) => {
    console.log('[MLS PAGE WORKER] Processing page job');
    try {
        const { pageUrl } = job.data;
        console.log('[MLS PAGE WORKER] Page:', pageUrl);
        // TODO: plug real logic
    }
    catch (error) {
        console.error('[MLS PAGE WORKER] Failed:', error);
        throw error;
    }
}, {
    connection: redis_1.connection,
    concurrency: 5,
});
worker.on('completed', () => {
    console.log('[MLS PAGE WORKER] Job completed');
});
worker.on('failed', (job, err) => {
    console.error('[MLS PAGE WORKER] Job failed:', err);
});
