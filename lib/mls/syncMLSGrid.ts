import { createClient } from "@supabase/supabase-js";
import { fetchMLSGridListings } from "./mlsGridClient";
import { mlsPageQueue } from "../queue/mlsPageQueue";

function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      console.error(`❌ ${label} failed (attempt ${attempt})`, err?.message);

      if (attempt >= MAX_RETRIES) throw err;

      await sleep(RETRY_DELAY_MS * attempt);
    }
  }

  throw new Error(`Failed after retries: ${label}`);
}

async function getLastSync(supabase: any): Promise<string | null> {
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

async function updateLastSync(supabase: any, timestamp: string) {
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

export async function syncMLSGrid() {
  const supabase = getSupabase();

  console.log("🚀 Starting MLS Grid sync (COORDINATOR MODE)...");

  const lastSync = await getLastSync(supabase);
  console.log("⏱ Last Sync:", lastSync);

  let nextUrl: string | null = null;
  let page = 0;

  do {
    page++;

    console.log(`📦 Discovering page ${page}...`);

    const data = await withRetry(
      () => fetchMLSGridListings(nextUrl, lastSync),
      `Fetch page ${page}`
    );

    const listings = data?.value || [];

    console.log(`➡️ Page ${page} has ${listings.length} listings`);

    // 🚨 IMPORTANT: enqueue NEXT URL, not listings
    await mlsPageQueue.add(
      "mls-page-job",
      {
        page,
        nextUrl,     // what to fetch
        lastSync,    // filter
      },
      {
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    nextUrl = data?.["@odata.nextLink"] || null;

  } while (nextUrl);

  const newSyncTime = new Date().toISOString();
  await updateLastSync(supabase, newSyncTime);

  console.log("🎉 Sync complete. Updated lastSync:", newSyncTime);
}