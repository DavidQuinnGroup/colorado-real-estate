import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { listingsToPoints } from "@/lib/map/listingsToPoints"
import { buildCluster } from "@/lib/map/supercluster"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const north = Number(searchParams.get("north"))
    const south = Number(searchParams.get("south"))
    const east = Number(searchParams.get("east"))
    const west = Number(searchParams.get("west"))
    const zoom = Number(searchParams.get("zoom") || 12)

    // Query database
    const listings = await prisma.$queryRaw`
      SELECT
        id,
        price,
        lat,
        lng,
        address,
        city,
        slug
      FROM "Property"
      WHERE ST_Intersects(
        location,
        ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, 4326)
      )
      LIMIT 500
    `

    const properties = (listings as any[]).map((p) => ({
      id: p.id,
      price: p.price,
      lat: p.lat,
      lng: p.lng,
      address: p.address,
      city: p.city,
      slug: p.slug,
    }))

    // Convert listings → GeoJSON points
    const points = listingsToPoints(properties)

    // Build cluster
    const cluster = buildCluster(points)

    const clusters = cluster.getClusters(
      [west, south, east, north],
      zoom
    )

    return NextResponse.json(clusters)

  } catch (error) {
    console.error("Map listings API error:", error)

    return NextResponse.json(
      { error: "Failed to load listings" },
      { status: 500 }
    )
  }
}