import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
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
      return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Map API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}