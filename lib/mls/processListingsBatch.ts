import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

function getLatLng(listing: any) {
  return {
    lat:
      listing.Latitude ||
      listing.lat ||
      listing.latitude ||
      listing?.PropertyLocation?.Latitude ||
      null,

    lng:
      listing.Longitude ||
      listing.lng ||
      listing.longitude ||
      listing?.PropertyLocation?.Longitude ||
      null,
  };
}

export async function processListingsBatch(listings: any[]) {
  if (!listings.length) return;

  const formatted = listings.map((listing) => {
    const { lat, lng } = getLatLng(listing);

    return {
      mls_id: listing.ListingId,
      address: listing.UnparsedAddress,
      price: listing.ListPrice,
      beds: listing.BedroomsTotal ?? null,
      baths: listing.BathroomsTotal ?? null,
      lat,
      lng,
      updated_at: listing.ModificationTimestamp,
      raw: listing,
    };
  });

  const { error } = await supabase
    .from("listings")
    .upsert(formatted, { onConflict: "mls_id" });

  if (error) {
    console.error("❌ Supabase batch upsert failed:", error);
    throw error;
  }

  console.log(`💾 Batch upserted ${formatted.length} listings`);
}