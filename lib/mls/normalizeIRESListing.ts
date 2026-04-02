export function normalizeListing(raw: any) {
  return {
    listing_id: raw.ListingKey,
    mls_id: raw.ListingId,
    address: raw.UnparsedAddress,
    price: raw.ListPrice,
    status: raw.StandardStatus,

    lat: raw.Latitude,
    lng: raw.Longitude,

    beds: raw.BedroomsTotal,
    baths: raw.BathroomsTotalInteger,
    sqft: raw.LivingArea,

    photos: raw.Media?.map((m: any) => m.MediaURL) || [],

    raw_json: raw, // 🔥 always keep raw for debugging
  };
}