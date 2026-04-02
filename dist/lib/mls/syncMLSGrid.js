"use strict";
// /lib/mls/syncMLSGrid.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncMLSGrid = syncMLSGrid;
const supabase_js_1 = require("@supabase/supabase-js");
const mlsGridClient_1 = require("./mlsGridClient");
const mlsPageQueue_1 = require("../queue/mlsPageQueue");
function getSupabase() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
    }
    return (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function withRetry(fn, label) {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        try {
            return await fn();
        }
        catch (err) {
            attempt++;
            console.error(`❌ ${label} failed (attempt ${attempt})`, err?.message);
            if (attempt >= MAX_RETRIES)
                throw err;
            await sleep(RETRY_DELAY_MS * attempt);
        }
    }
    throw new Error(`Failed after retries: ${label}`);
}
async function getLastSync(supabase) {
    const { data, error } = await supabase
        .from("mls_sync_state")
        .select("last_sync")
        .eq("id", "mls_grid")
        .single();
    if (error) {
        console.error("❌ Failed to fetch lastSync", error);
        return null;
    }
    return data?.last_sync || null;
}
async function updateLastSync(supabase, timestamp) {
    const { error } = await supabase
        .from("mls_sync_state")
        .upsert({
        id: "mls_grid",
        last_sync: timestamp,
    });
    if (error) {
        console.error("❌ Failed to update lastSync", error);
    }
}
async function syncMLSGrid() {
    const supabase = getSupabase();
    console.log("🚀 Starting MLS Grid sync...");
    const lastSync = await getLastSync(supabase);
    console.log("⏱ Last Sync:", lastSync);
    let nextUrl = null;
    let page = 0;
    do {
        page++;
        console.log(`📦 Fetching page ${page}...`);
        const data = await withRetry(() => (0, mlsGridClient_1.fetchMLSGridListings)(nextUrl, lastSync), `Fetch page ${page}`);
        const listings = data?.value || [];
        console.log(`➡️ ${listings.length} listings fetched`);
        // 🔥 FAN OUT PAGE JOB
        await mlsPageQueue_1.mlsPageQueue.add("process-page", {
            listings,
            page,
        }, {
            removeOnComplete: true,
            removeOnFail: false,
        });
        nextUrl = data?.["@odata.nextLink"] || null;
    } while (nextUrl);
    const newSyncTime = new Date().toISOString();
    await updateLastSync(supabase, newSyncTime);
    console.log("🎉 Sync complete. Updated lastSync:", newSyncTime);
}
