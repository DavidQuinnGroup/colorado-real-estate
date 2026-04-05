import { upsertListing } from "./upsertListing";
import { getLastSync, setLastSync } from "./syncState";
import { fetchMLSPage } from "./fetchMLSPage";
import { generateMockListings } from "./mockListings";

type SyncOptions = {
  maxRuntimeMs: number;
};

const USE_MOCK = process.env.USE_MOCK === "true";
const RATE_DELAY_MS = Number(process.env.MLS_RATE_DELAY_MS || 1000);
const PAGE_SIZE = 50;
const MAX_PAGES = Number(process.env.MLS_MAX_PAGES || 1);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function syncMLSGrid({ maxRuntimeMs }: SyncOptions) {
  const startTime = Date.now();

  console.log("🚀 MLS SYNC START");

  // ✅ Always checkpoint
  let lastSync = await getLastSync();
  if (!lastSync) {
    lastSync = new Date(0).toISOString();
  }

  let page = 0;
  let totalProcessed = 0;

  while (true) {
    // ✅ HARD STOP: runtime guard
    if (Date.now() - startTime > maxRuntimeMs) {
      console.log("⛔ Max runtime reached — stopping sync");
      break;
    }

    console.log(`📄 Fetching page ${page}`);

    let listings: any[] = [];

    // =========================
    // MOCK MODE (SAFE)
    // =========================
    if (USE_MOCK) {
      listings = generateMockListings(PAGE_SIZE);
    } else {
      // =========================
      // LIVE MODE
      // =========================
      listings = await fetchMLSPage({
        top: PAGE_SIZE,
        skip: page * PAGE_SIZE,
        lastSync,
      });
    }

    // ✅ HARD STOP: no more data
    if (!listings || listings.length === 0) {
      console.log("✅ No more listings — ending sync");
      break;
    }

    // =========================
    // PROCESS LISTINGS (SERIAL)
    // =========================
    for (const listing of listings) {
      // runtime guard inside loop
      if (Date.now() - startTime > maxRuntimeMs) {
        console.log("⛔ Runtime exceeded during processing");
        break;
      }

      try {
        await upsertListing(listing);
        totalProcessed++;
      } catch (err) {
        console.error("❌ Failed to process listing", err);
      }
    }

    // =========================
    // CHECKPOINT AFTER EACH PAGE
    // =========================
    const newestTimestamp =
      listings[listings.length - 1]?.ModificationTimestamp;

    if (newestTimestamp) {
      lastSync = newestTimestamp;
      await setLastSync(lastSync);
    }

    console.log(
      `✅ Page ${page} complete — total processed: ${totalProcessed}`
    );

    page++;

    // =========================
    // HARD STOP: page limit (SAFETY)
    // =========================
    if (page >= MAX_PAGES) {
  console.log(`⛔ Page limit reached (${MAX_PAGES}) — stopping`);
  break;
}

    // =========================
    // RATE LIMIT (CRITICAL)
    // =========================
    await sleep(RATE_DELAY_MS);
  }

  console.log("🏁 MLS SYNC COMPLETE", {
    totalProcessed,
    runtimeMs: Date.now() - startTime,
  });
}