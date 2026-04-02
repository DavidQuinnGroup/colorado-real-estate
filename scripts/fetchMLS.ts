import { fetchIRESListings } from "@/lib/mls/fetchIRESListings"
import { normalizeIRESListing } from "@/lib/mls/normalizeIRESListing"
import { enqueueListings } from "@/lib/mls/enqueueListings"

async function runIngestion() {

  let skip = 0
  const limit = 500

  while (true) {

    const listings = await fetchIRESListings(skip)

    if (!listings.length) break

    const normalized = listings.map(normalizeIRESListing)

    await enqueueListings(normalized)

    console.log(`Queued ${normalized.length} listings`)

    skip += limit
  }

  console.log("MLS ingestion complete")
}

runIngestion()