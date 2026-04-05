"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncMLSGrid = syncMLSGrid;
const fetchMLSPage_1 = require("./fetchMLSPage");
const upsertListing_1 = require("./upsertListing");
const syncState_1 = require("./syncState");
const mockListings_1 = require("./mockListings");
const RATE_DELAY_MS = 900;
const BATCH_SIZE = 50;
async function syncMLSGrid({ maxRuntimeMs }) {
    const start = Date.now();
    const USE_MOCK = process.env.USE_MOCK === "true";
    console.log("⚙️ Sync started");
    console.log("MODE:", USE_MOCK ? "MOCK" : "LIVE");
    let lastSync = await (0, syncState_1.getLastSync)();
    let hasMore = true;
    let page = 0;
    while (hasMore) {
        // ⛔ HARD STOP: runtime protection
        if (Date.now() - start > maxRuntimeMs) {
            console.log("⛔ Max runtime reached — exiting safely");
            break;
        }
        console.log(`📦 Fetching page ${page}`);
        let listings = [];
        if (USE_MOCK) {
            listings = mockListings_1.mockListings.slice(page * BATCH_SIZE, (page + 1) * BATCH_SIZE);
            hasMore = listings.length === BATCH_SIZE;
        }
        else {
            const result = await (0, fetchMLSPage_1.fetchMLSPage)({
                lastSync,
                top: BATCH_SIZE,
                skip: page * BATCH_SIZE,
            });
            listings = result.listings;
            hasMore = result.hasMore;
        }
        if (!listings.length) {
            console.log("✅ No more listings");
            break;
        }
        for (const listing of listings) {
            await (0, upsertListing_1.upsertListing)(listing);
        }
        console.log(`✅ Processed ${listings.length} listings`);
        page++;
        // ⏱ RATE LIMIT (CRITICAL)
        await sleep(RATE_DELAY_MS);
    }
    if (!USE_MOCK) {
        await (0, syncState_1.updateLastSync)(new Date().toISOString());
    }
    console.log("🏁 Sync finished");
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
