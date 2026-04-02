"use client"

import { useState, useRef, useEffect } from "react"
import L from "leaflet"
import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useRouter, useSearchParams } from "next/navigation"

import MapEvents from "./MapEvents"
import MapMarkers from "./MapMarkers"
import { lngLatToTile } from "@/lib/map/getTiles"

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png"
})

type Feature = {
  id?: number
  geometry: {
    coordinates: [number, number]
  }
  properties: {
    cluster?: boolean
    point_count?: number
    id?: string
    price?: number
  }
}

export default function MapInner({
  city,
  onListingsChange,
  activeListingId,
  setActiveListingId
}: {
  city: string
  onListingsChange: (listings: any[]) => void
  activeListingId: string | null
  setActiveListingId: (id: string | null) => void
}) {
  const [features, setFeatures] = useState<Feature[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mapRef = useRef<any>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  const minPrice = searchParams.get("minPrice")
  const beds = searchParams.get("beds")
  const type = searchParams.get("type")

  // 🔥 Center map when listing is clicked
  useEffect(() => {
    if (!activeListingId) return

    const match = features.find(
      (f) => f.properties.id === activeListingId
    )

    if (!match) return

    const [lng, lat] = match.geometry.coordinates

    mapRef.current?.flyTo([lat, lng], 15, { duration: 0.5 })
  }, [activeListingId, features])

  const handleBoundsChange = (map: any) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(async () => {
      const bounds = map.getBounds()
      const zoom = map.getZoom()
      const center = map.getCenter()

      // ✅ Update URL (preserve filters)
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set("lat", center.lat.toString())
      newParams.set("lng", center.lng.toString())
      newParams.set("zoom", zoom.toString())

      router.replace(`?${newParams.toString()}`, { scroll: false })

      // ✅ Fetch listings (right panel)
      const queryParams = new URLSearchParams()

      queryParams.set("north", bounds.getNorth().toString())
      queryParams.set("south", bounds.getSouth().toString())
      queryParams.set("east", bounds.getEast().toString())
      queryParams.set("west", bounds.getWest().toString())

      if (minPrice) queryParams.set("minPrice", minPrice)
      if (beds) queryParams.set("beds", beds)
      if (type) queryParams.set("type", type)

      try {
        const res = await fetch(`/api/map-listings?${queryParams}`)
        const listingData = await res.json()
        onListingsChange(listingData)
      } catch (err) {
        console.error("Listings fetch error:", err)
      }

      // ✅ Tile clustering
      const nw = lngLatToTile(bounds.getWest(), bounds.getNorth(), zoom)
      const se = lngLatToTile(bounds.getEast(), bounds.getSouth(), zoom)

      const tiles = []

      for (let x = nw.x; x <= se.x; x++) {
        for (let y = nw.y; y <= se.y; y++) {
          tiles.push({ x, y, z: zoom })
        }
      }

      if (tiles.length > 20) return

      try {
        const results = await Promise.all(
          tiles.map((t) =>
            fetch(`/api/map-tile/${t.z}/${t.x}/${t.y}`).then((r) => r.json())
          )
        )

        const all = results.flat()
        const unique = new Map()

        all.forEach((f: any) => {
          const key = f.properties?.cluster
            ? `cluster-${f.id}`
            : f.properties?.id

          if (key) unique.set(key, f)
        })

        setFeatures(Array.from(unique.values()))
      } catch (err) {
        console.error("Tile fetch error:", err)
      }

    }, 150)
  }

  return (
    <MapContainer
      center={[40.0176, -105.2797]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapEvents onBoundsChange={handleBoundsChange} />

      <MapMarkers
        features={features}
        activeListingId={activeListingId}
        setActiveListingId={setActiveListingId}
      />
    </MapContainer>
  )
}