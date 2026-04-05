"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processListingsBatch = processListingsBatch;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.local" });
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
function getLatLng(listing) {
    return {
        lat: listing.Latitude ||
            listing.lat ||
            listing.latitude ||
            listing?.PropertyLocation?.Latitude ||
            null,
        lng: listing.Longitude ||
            listing.lng ||
            listing.longitude ||
            listing?.PropertyLocation?.Longitude ||
            null,
    };
}
async function processListingsBatch(listings) {
    if (!listings.length)
        return;
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
