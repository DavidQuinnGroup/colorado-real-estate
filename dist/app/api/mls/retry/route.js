"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const bullmq_1 = require("bullmq");
const mlsQueue_1 = require("@/lib/queue/mlsQueue");
const mlsPageQueue = new bullmq_1.Queue("mls-page", { connection: mlsQueue_1.connection });
async function POST() {
    try {
        const failed = await mlsPageQueue.getFailed();
        for (const job of failed) {
            await job.retry();
        }
        return server_1.NextResponse.json({
            retried: failed.length,
        });
    }
    catch (err) {
        console.error(err);
        return server_1.NextResponse.json({ error: "Retry failed" }, { status: 500 });
    }
}
