"use client"

import { useState, useRef, useEffect } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useRouter, useSearchParams } from "next/navigation"

import MapEvents from "./MapEvents"
import MapMarkers from "./MapMarkers"

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png"
})

type Listing = {
  mls_id: string
  address: string
  price: number
  beds: number | null
  baths: number | null
  lat: number
  lng: number
}

function FlyToListing({ listing }: { listing: Listing | undefined }) {
  const map = useMap()

  useEffect(() => {
    if (!listing) return
    map.flyTo([listing.lat, listing.lng], 15, { duration: 0.5 })
  }, [listing, map])

  return null
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

  const [listings, setListings] = useState<Listing[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  const minPrice = searchParams.get("minPrice")
  const beds = searchParams.get("beds")
  const type = searchParams.get("type")

  const handleBoundsChange = (map: any) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(async () => {
      const bounds = map.getBounds()
      const zoom = map.getZoom()
      const center = map.getCenter()

      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set("lat", center.lat.toString())
      newParams.set("lng", center.lng.toString())
      newParams.set("zoom", zoom.toString())

      router.replace(`?${newParams.toString()}`, { scroll: false })

      const queryParams = new URLSearchParams()
      queryParams.set("minLat", bounds.getSouth().toString())
      queryParams.set("maxLat", bounds.getNorth().toString())
      queryParams.set("minLng", bounds.getWest().toString())
      queryParams.set("maxLng", bounds.getEast().toString())

      if (minPrice) queryParams.set("minPrice", minPrice)
      if (beds) queryParams.set("beds", beds)
      if (type) queryParams.set("type", type)

      try {
        const res = await fetch(`/api/map-listings?${queryParams}`)
        const data = await res.json()

        setListings(data)
        onListingsChange(data)
      } catch (err) {
        console.error("Listings fetch error:", err)
      }
    }, 150)
  }

  const activeListing = listings.find(
    (l) => l.mls_id === activeListingId
  )

  useEffect(() => {
  // 🔥 Fix "Map container is already initialized"
  const container = document.querySelector(".leaflet-container")
  if (container && (container as any)._leaflet_id) {
    ;(container as any)._leaflet_id = null
  }
}, [])

  return (
    <MapContainer
  center={[40.0176, -105.2797]}
  zoom={13}
  style={{ height: "100%", width: "100%" }}
>
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapEvents onBoundsChange={handleBoundsChange} />

      <MapMarkers
        listings={listings}
        activeListingId={activeListingId}
        setActiveListingId={setActiveListingId}
      />

      <FlyToListing listing={activeListing} />
    </MapContainer>
  )
}