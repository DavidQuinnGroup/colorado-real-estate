"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const minLat = parseFloat(searchParams.get("minLat") || "0");
        const maxLat = parseFloat(searchParams.get("maxLat") || "0");
        const minLng = parseFloat(searchParams.get("minLng") || "0");
        const maxLng = parseFloat(searchParams.get("maxLng") || "0");
        const { data, error } = await supabase
            .from("listings")
            .select("mls_id, address, price, beds, baths, lat, lng")
            .gte("lat", minLat)
            .lte("lat", maxLat)
            .gte("lng", minLng)
            .lte("lng", maxLng)
            .limit(1000);
        if (error) {
            console.error("❌ Map query failed:", error);
            return server_1.NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
        }
        return server_1.NextResponse.json(data);
    }
    catch (err) {
        console.error("❌ Map API error:", err);
        return server_1.NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
