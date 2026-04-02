"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// 🔥 LOAD .env.local EXPLICITLY
dotenv_1.default.config({ path: '.env.local' });
const bullmq_1 = require("bullmq");
const redis_1 = require("../lib/queue/redis");
const syncMLSGrid_1 = require("../lib/mls/syncMLSGrid");
const QUEUE_NAME = 'mls-sync';
console.log('[MLS WORKER] Booting...');
const worker = new bullmq_1.Worker(QUEUE_NAME, async (job) => {
    console.log('[MLS WORKER] JOB RECEIVED:', job.id);
    try {
        console.log('[MLS WORKER] ENV CHECK:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        await (0, syncMLSGrid_1.syncMLSGrid)();
        console.log('[MLS WORKER] Sync completed');
    }
    catch (error) {
        console.error('[MLS WORKER] Sync failed:', error);
        throw error;
    }
}, {
    connection: redis_1.connection,
    concurrency: 1,
});
worker.on('ready', () => {
    console.log('[MLS WORKER] Ready and waiting for jobs...');
});
worker.on('failed', (job, err) => {
    console.error('[MLS WORKER] Job failed:', job?.id, err);
});
worker.on('completed', (job) => {
    console.log('[MLS WORKER] Job completed:', job.id);
});
