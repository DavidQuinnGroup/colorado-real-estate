import { upsertListing } from "./upsertListing";
import { getLastSync, setLastSync } from "./syncState";
import { fetchMLSPage } from "./fetchMLSPage";
import { generateMockListings } from "./mockListings";

type SyncOptions = {
  maxRuntimeMs: number;
};

function getEnvNumber(key: string, fallback: number) {
  const value = process.env[key];
  if (!value) return fallback;
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
}

function getEnvBool(key: string, fallback: boolean) {
  const value = process.env[key];
  if (value === undefined) return fallback;
  return value === "true";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function syncMLSGrid({ maxRuntimeMs }: SyncOptions) {
  const startTime = Date.now();

  // ✅ SAFE ENV ACCESS (RUNTIME ONLY)
  const USE_MOCK = getEnvBool("USE_MOCK", true);
  const RATE_DELAY_MS = getEnvNumber("MLS_RATE_DELAY_MS", 1000);
  const PAGE_SIZE = 50;
  const MAX_PAGES = getEnvNumber("MLS_MAX_PAGES", 1);

  console.log("🚀 MLS SYNC START", {
    USE_MOCK,
    MAX_PAGES,
  });

  let lastSync = await getLastSync();
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

    console.log(`📄 Fetching page ${page}`);

    let listings: any[] = [];

    if (USE_MOCK) {
      listings = generateMockListings(PAGE_SIZE);
    } else {
      listings = await fetchMLSPage({
        top: PAGE_SIZE,
        skip: page * PAGE_SIZE,
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
        await upsertListing(listing);
        totalProcessed++;
      } catch (err) {
        console.error("❌ Failed to process listing", err);
      }
    }

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