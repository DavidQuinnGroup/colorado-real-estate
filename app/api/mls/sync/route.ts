import { NextResponse } from "next/server"

export async function GET() {
  try {
    // ⛔ Prevent execution during build (no env / no Redis)
    if (!process.env.MLS_GRID_BASE_URL) {
      return NextResponse.json({
        status: "skipped",
        reason: "Missing env during build",
      })
    }

    const { fetchMLSGridListings } = await import("@/lib/mls/mlsGridClient")
    const { processListingsBatch } = await import("@/lib/mls/processListingsBatch")

    const listings = await fetchMLSGridListings({
      skip: 0,
      top: 25,
      lastSync: new Date().toISOString(),
    })

    await processListingsBatch(listings)

    return NextResponse.json({
      status: "success",
      processed: listings.length,
    })
  } catch (err) {
    console.error("MLS sync failed:", err)

    return NextResponse.json(
      { error: "MLS sync failed" },
      { status: 500 }
    )
  }
}