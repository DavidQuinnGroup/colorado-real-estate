import { fetchMLSPage } from "./fetchMLSPage"
import { upsertListing } from "./upsertListing"
import { getLastSync, updateLastSync } from "./syncState"
import { mockListings } from "./mockListings"

type SyncOptions = {
  maxRuntimeMs: number
}

const RATE_DELAY_MS = 900
const BATCH_SIZE = 50

export async function syncMLSGrid({ maxRuntimeMs }: SyncOptions) {
  const start = Date.now()

  const USE_MOCK = process.env.USE_MOCK === "true"

  console.log("⚙️ Sync started")
  console.log("MODE:", USE_MOCK ? "MOCK" : "LIVE")

  let lastSync = await getLastSync()
  let hasMore = true
  let page = 0

  while (hasMore) {
    // ⛔ HARD STOP: runtime protection
    if (Date.now() - start > maxRuntimeMs) {
      console.log("⛔ Max runtime reached — exiting safely")
      break
    }

    console.log(`📦 Fetching page ${page}`)

    let listings: any[] = []

    if (USE_MOCK) {
      listings = mockListings.slice(page * BATCH_SIZE, (page + 1) * BATCH_SIZE)
      hasMore = listings.length === BATCH_SIZE
    } else {
      const result = await fetchMLSPage({
        lastSync,
        top: BATCH_SIZE,
        skip: page * BATCH_SIZE,
      })

      listings = result.listings
      hasMore = result.hasMore
    }

    if (!listings.length) {
      console.log("✅ No more listings")
      break
    }

    for (const listing of listings) {
      await upsertListing(listing)
    }

    console.log(`✅ Processed ${listings.length} listings`)

    page++

    // ⏱ RATE LIMIT (CRITICAL)
    await sleep(RATE_DELAY_MS)
  }

  if (!USE_MOCK) {
    await updateLastSync(new Date().toISOString())
  }

  console.log("🏁 Sync finished")
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}