/**
 * REIE MLS NORMALIZER
 * Implements Module 1.2 (Engineering Audit) & Module 5 (GC Valuation Suite).
 */
export function normalizeListing(listing) {
    const description = (listing.PublicRemarks || "").toLowerCase();
    // GC-Lens: Structural & Mechanical "Vital Signs" (Module 1.2.1)
    const hasPolybutylene = description.includes("polybutylene") || description.includes("quest piping");
    const roofType = description.includes("metal roof") ? "Standing-Seam Metal" :
        description.includes("tile roof") ? "Concrete Tile" : "Asphalt Shingle";
    return {
        mlsId: listing.ListingId,
        address: listing.StreetAddress,
        city: listing.City,
        state: listing.StateOrProvince,
        zip: listing.PostalCode,
        price: listing.ListPrice,
        beds: listing.BedroomsTotal,
        baths: listing.BathroomsTotalInteger,
        sqft: listing.LivingArea,
        lotSize: listing.LotSizeArea,
        yearBuilt: listing.YearBuilt,
        propertyType: listing.PropertyType,
        status: listing.StandardStatus,
        lat: listing.Latitude,
        lng: listing.Longitude,
        description: listing.PublicRemarks,
        photos: listing.Media?.map((p) => p.MediaURL) || [],
        // Module 5 & 15.2: GC Intelligence & Altitude Forensics
        forensics: {
            hasPolybutylene,
            roofType,
            hvacType: description.includes("radiant") ? "Radiant" : "Forced Air",
            electricalAmperage: description.includes("200 amp") ? 200 : 100,
            finishGrade: description.includes("custom") ? "Designer-Grade" : "Builder-Standard",
            altitude: listing.Elevation || 5280
        },
        // North Star Efficiency Baseline
        efficiencyScore: 0,
        resilienceScore: 85 // Baseline for the area
    };
}
// ./lib/mls/normalizeListing.ts
