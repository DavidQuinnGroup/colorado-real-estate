import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"
import { indexListing } from "@/lib/typesense/indexListing"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function processListingsBatch(listings: any[]) {
  if (!listings.length) return

  const formatted = listings.map((listing) => ({
    mls_id: listing.ListingId,
    address: listing.UnparsedAddress,
    price: listing.ListPrice,
    updated_at: listing.ModificationTimestamp,
    raw: listing,
  }))

  const { error } = await supabase
    .from("listings")
    .upsert(formatted, { onConflict: "mls_id" })

  if (error) {
    console.error("❌ Supabase batch upsert failed:", error)
    throw error
  }

  // 🔥 Index AFTER DB success
  for (const listing of formatted) {
    await indexListing(listing)
  }

  console.log(`💾 Batch upserted ${formatted.length} listings`)
}