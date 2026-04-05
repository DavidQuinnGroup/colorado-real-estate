"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bullmq_1 = require("bullmq");
const mlsQueue_1 = require("../lib/queue/mlsQueue");
const mlsGridClient_1 = require("../lib/mls/mlsGridClient");
const processListingsBatch_1 = require("../lib/mls/processListingsBatch");
const worker = new bullmq_1.Worker("mlsPageQueue", async (job) => {
    const { skip, top, lastSync } = job.data;
    const listings = await (0, mlsGridClient_1.fetchMLSGridListings)({
        skip,
        top,
        lastSync,
    });
    await (0, processListingsBatch_1.processListingsBatch)(listings);
    console.log(`✅ Processed MLS page: skip=${skip}`);
}, {
    connection: mlsQueue_1.connection,
});
worker.on("completed", (job) => {
    console.log(`🎉 Job completed: ${job.id}`);
});
worker.on("failed", (job, err) => {
    console.error(`❌ Job failed: ${job?.id}`, err);
});
