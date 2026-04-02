"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const processListing_1 = require("@/lib/mls/processListing");
new bullmq_1.Worker("listings", async (job) => {
    await (0, processListing_1.processListing)(job.data);
});
