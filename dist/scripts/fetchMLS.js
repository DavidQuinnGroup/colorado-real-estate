"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchIRESListings_1 = require("@/lib/mls/fetchIRESListings");
const normalizeListing_1 = require("@/lib/mls/normalizeListing");
const enqueueListings_1 = require("@/lib/mls/enqueueListings");
async function runIngestion() {
    const listings = await (0, fetchIRESListings_1.fetchIRESListings)();
    const normalized = listings.map((l) => (0, normalizeListing_1.normalizeListing)(l));
    await (0, enqueueListings_1.enqueueListings)(normalized);
    console.log(`✅ Enqueued ${normalized.length} listings`);
}
runIngestion().catch((err) => {
    console.error("❌ MLS ingestion failed:", err);
    process.exit(1);
});
