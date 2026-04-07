"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncMLSGrid = syncMLSGrid;
const upsertListing_1 = require("./upsertListing");
const syncState_1 = require("./syncState");
const fetchMLSPage_1 = require("./fetchMLSPage");
// ⚠️ SAFE FALLBACK (avoid broken import crash)
let generateMockListings = () => [];
try {
    const mod = require("./mockListings");
    generateMockListings =
        mod.generateMockListings || mod.default || generateMockListings;
}
catch (e) {
    console.warn("⚠️ mockListings not available");
}
// ⚠️ SAFE OPTIONAL setLastSync
let setLastSync = async () => { };
try {
    const mod = require("./syncState");
    setLastSync = mod.setLastSync || setLastSync;
}
catch (e) {
    console.warn("⚠️ setLastSync not available");
}
function getEnvNumber(key, fallback) {
    const value = process.env[key];
    if (!value)
        return fallback;
    const parsed = Number(value);
    return isNaN(parsed) ? fallback : parsed;
}
function getEnvBool(key, fallback) {
    const value = process.env[key];
    if (value === undefined)
        return fallback;
    return value === "true";
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function syncMLSGrid({ maxRuntimeMs }) {
    const startTime = Date.now();
    const USE_MOCK = getEnvBool("USE_MOCK", true);
    const RATE_DELAY_MS = getEnvNumber("MLS_RATE_DELAY_MS", 1000);
    const PAGE_SIZE = 50;
    const MAX_PAGES = getEnvNumber("MLS_MAX_PAGES", 1);
    console.log("🚀 MLS SYNC START", {
        USE_MOCK,
        MAX_PAGES,
    });
    let lastSync = await (0, syncState_1.getLastSync)();
    if (!lastSync) {
        lastSync = new Date(0).toISOString();
    }
    let page = 0;
    let totalProcessed = 0;
    while (true) {
        if (Date.now() - startTime > maxRuntimeMs) {
            console.log("⛔ Max runtime reached — stopping sync");
            break;
        }
        // 🔥 HARD GUARD
        if (isNaN(page)) {
            console.error("❌ Page is NaN — forcing reset to 0");
            page = 0;
        }
        console.log(`📄 Fetching page ${page}`);
        let listings = [];
        if (USE_MOCK) {
            listings = generateMockListings(PAGE_SIZE);
        }
        else {
            listings = await (0, fetchMLSPage_1.fetchMLSPage)({
                top: PAGE_SIZE,
                skip: Number(page) * PAGE_SIZE,
                lastSync,
            });
        }
        if (!listings || listings.length === 0) {
            console.log("✅ No more listings — ending sync");
            break;
        }
        for (const listing of listings) {
            if (Date.now() - startTime > maxRuntimeMs) {
                console.log("⛔ Runtime exceeded during processing");
                break;
            }
            try {
                await (0, upsertListing_1.upsertListing)(listing);
                totalProcessed++;
            }
            catch (err) {
                console.error("❌ Failed to process listing", err);
            }
        }
        const newestTimestamp = listings[listings.length - 1]?.ModificationTimestamp;
        if (newestTimestamp) {
            lastSync = newestTimestamp;
            await setLastSync(lastSync);
        }
        console.log(`✅ Page ${page} complete — total processed: ${totalProcessed}`);
        page++;
        if (page >= MAX_PAGES) {
            console.log(`⛔ Page limit reached (${MAX_PAGES}) — stopping`);
            break;
        }
        await sleep(RATE_DELAY_MS);
    }
    console.log("🏁 MLS SYNC COMPLETE", {
        totalProcessed,
        runtimeMs: Date.now() - startTime,
    });
}
