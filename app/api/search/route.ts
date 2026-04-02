import { NextRequest, NextResponse } from "next/server"
import Typesense from "typesense"

const client = new Typesense.Client({
  nodes: [
    {
      host: "localhost",
      port: 8108,
      protocol: "http",
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || "xyz",
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const q = searchParams.get("q") || "*"
    const city = searchParams.get("city")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const beds = searchParams.get("beds")
    const propertyType = searchParams.get("propertyType")

    const neLat = searchParams.get("neLat")
    const neLng = searchParams.get("neLng")
    const swLat = searchParams.get("swLat")
    const swLng = searchParams.get("swLng")

    let filters: string[] = []

    // 🗺 GEO (bounding box)
    if (neLat && neLng && swLat && swLng) {
      filters.push(
        `location:(${swLat}, ${swLng}, ${neLat}, ${neLng})`
      )
    }

    // 🏙 City
    if (city) {
      filters.push(`city:=${city}`)
    }

    // 💰 Price
    if (minPrice) {
      filters.push(`price:>=${minPrice}`)
    }

    if (maxPrice) {
      filters.push(`price:<=${maxPrice}`)
    }

    // 🛏 Beds
    if (beds) {
      filters.push(`beds:>=${beds}`)
    }

    // 🏡 Property Type
    if (propertyType) {
      filters.push(`property_type:=${propertyType}`)
    }

    const filter_by = filters.join(" && ")

    const results = await client
      .collections("listings")
      .documents()
      .search({
        q,
        query_by: "address,city",
        filter_by: filter_by || undefined,
        sort_by: "updated_at:desc",
        per_page: 50,
      })

    return NextResponse.json({
      success: true,
      count: results.found,
      hits: results.hits,
    })
  } catch (err: any) {
    console.error("❌ Search API error:", err)

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}