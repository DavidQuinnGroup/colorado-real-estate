"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processListing = processListing;
const upsertListing_1 = require("./upsertListing");
async function processListing(listing) {
    try {
        // Core ingestion only
        await (0, upsertListing_1.upsertListing)(listing);
        // 🚨 ALERTS DISABLED (will reintroduce later via separate queue)
        // await listingQueue.add(...)
        // await alertQueue.add(...)
        return true;
    }
    catch (error) {
        console.error('[PROCESS LISTING ERROR]', error);
        throw error;
    }
}
