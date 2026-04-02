import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { tileToBBox } from "@/lib/map/tiles"
import { listingsToPoints } from "@/lib/map/listingsToPoints"
import { buildCluster } from "@/lib/map/supercluster"

export async function GET(
  req: Request,
  { params }: { params: { z: string; x: string; y: string } }
) {
  try {
    const z = Number(params.z)
    const x = Number(params.x)
    const y = Number(params.y)

    const { west, south, east, north } = tileToBBox(x, y, z)

    const listings = await prisma.$queryRaw`
      SELECT id, price, lat, lng
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
    }))

    const points = listingsToPoints(properties)

    const cluster = buildCluster(points)

    const clusters = cluster.getClusters(
      [west, south, east, north],
      z
    )

    return NextResponse.json(clusters, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    })

  } catch (error) {
    console.error("Tile API error:", error)

    return NextResponse.json(
      { error: "Failed to load tile" },
      { status: 500 }
    )
  }
}