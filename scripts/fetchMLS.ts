import { fetchIRESListings } from "@/lib/mls/fetchIRESListings"
import { normalizeListing } from "@/lib/mls/normalizeListing"
import { enqueueListings } from "@/lib/mls/enqueueListings"

async function runIngestion() {
  const listings = await fetchIRESListings()

  const normalized = listings.map((l: any) =>
    normalizeListing(l)
  )

  await enqueueListings(normalized)

  console.log(`✅ Enqueued ${normalized.length} listings`)
}

runIngestion().catch((err) => {
  console.error("❌ MLS ingestion failed:", err)
  process.exit(1)
})