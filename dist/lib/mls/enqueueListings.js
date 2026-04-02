"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueueListings = enqueueListings;
const mlsQueue_1 = require("@/lib/queue/mlsQueue");
async function enqueueListings(listings) {
    const jobs = listings.map((listing) => ({
        name: "process-listing",
        data: listing
    }));
    await mlsQueue_1.mlsQueue.addBulk(jobs);
}
