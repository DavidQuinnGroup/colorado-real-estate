"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mlsQueue = void 0;
exports.enqueueMLSJob = enqueueMLSJob;
const bullmq_1 = require("bullmq");
const redis_1 = require("./redis");
const QUEUE_NAME = 'mls-sync';
// ✅ THIS WAS MISSING
exports.mlsQueue = new bullmq_1.Queue(QUEUE_NAME, {
    connection: redis_1.connection,
});
async function enqueueMLSJob() {
    console.log('[QUEUE] Adding MLS job...');
    const job = await exports.mlsQueue.add(QUEUE_NAME, {}, {
        removeOnComplete: true,
        removeOnFail: false,
        attempts: 5,
    });
    console.log('[QUEUE] Job added:', job.id);
    return job;
}
