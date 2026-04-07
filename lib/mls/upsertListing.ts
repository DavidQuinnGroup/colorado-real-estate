import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function upsertListing(listing: any) {
  // ✅ HARD REQUIREMENT: NEVER allow null mlsid
  const mlsid =
    listing?.ListingKey ||
    listing?.ListingId ||
    listing?.Id ||
    null

  if (!mlsid) {
    console.error("❌ Missing MLS ID — skipping listing", {
      possibleKeys: {
        ListingKey: listing?.ListingKey,
        ListingId: listing?.ListingId,
        Id: listing?.Id,
      },
    })
    return
  }

  const property = {
    mlsid: String(mlsid),

    // --- BASIC FIELDS (safe defaults) ---
    address: listing?.UnparsedAddress || null,
    city: listing?.City || null,
    state: listing?.StateOrProvince || null,
    zip: listing?.PostalCode || null,

    price: listing?.ListPrice || null,
    beds: listing?.BedroomsTotal || null,
    baths: listing?.BathroomsTotalInteger || null,
    sqft: listing?.LivingArea || null,

    lat: listing?.Latitude || null,
    lng: listing?.Longitude || null,

    status: listing?.StandardStatus || null,

    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from("Property")
    .upsert(property, {
      onConflict: "mlsid",
    })

  if (error) {
    console.error("❌ UPSERT ERROR", error, {
      mlsid,
    })
  } else {
    console.log("✅ Upserted:", mlsid)
  }
}