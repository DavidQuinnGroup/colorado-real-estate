/**
 * IRES SPECIFIC NORMALIZER
 * Maps IRES-specific keys to the REIE Forensic Schema (Module 15.2).
 */
export function normalizeListing(raw) {
    const description = (raw.PublicRemarks || "").toLowerCase();
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
        photos: raw.Media?.map((m) => m.MediaURL) || [],
        // Module 15.2 Forensics: Colorado Acclimation Protocol
        forensics: {
            altitude: raw.Elevation || 5280,
            isHighAltitudeRisk: (raw.Elevation || 0) > 6500,
            roofType: description.includes("metal") ? "Metal" : "Standard",
            soilType: "Bentonite/Expansive Risk" // Default for Front Range
        },
        raw_json: raw, // Always keep raw for debugging
    };
}
// ./lib/mls/normalizeIRESListing.ts
