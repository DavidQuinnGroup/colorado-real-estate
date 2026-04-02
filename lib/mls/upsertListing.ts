import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function upsertListing(listing: any) {
  const { error } = await supabase
    .from("Property")
    .upsert(
      {
        id: listing.listing_id,
        mls_id: listing.mls_id,
        address: listing.address,
        price: listing.price,
        status: listing.status,
        lat: listing.lat,
        lng: listing.lng,
        beds: listing.beds,
        baths: listing.baths,
        sqft: listing.sqft,
        photos: listing.photos,
        raw_json: listing.raw_json,
      },
      { onConflict: "id" }
    );

  if (error) {
    console.error("❌ Upsert error:", error);
    throw error;
  }
}