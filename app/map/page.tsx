"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("@/components/maps/SearchMap"), {
  ssr: false,
})

export default function MapPage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [bounds, setBounds] = useState<any>(null)

  const [email, setEmail] = useState("")

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    beds: "",
    propertyType: "",
  })

  async function fetchListings(currentBounds: any) {
    if (!currentBounds) return

    const { neLat, neLng, swLat, swLng } = currentBounds

    setLoading(true)

    const params = new URLSearchParams({
      neLat,
      neLng,
      swLat,
      swLng,
      ...filters,
    })

    const res = await fetch(`/api/search?${params.toString()}`)
    const data = await res.json()

    setListings(data.hits || [])
    setLoading(false)
  }

  // 🔥 AUTO REFRESH when filters change
  useEffect(() => {
    if (bounds) {
      fetchListings(bounds)
    }
  }, [filters])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-[420px] bg-white shadow-xl z-10 overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">
            Listings ({listings.length})
          </h2>
        </div>

        {/* 🔥 FILTER UI */}
        <div className="p-4 border-b space-y-3">
          {/* Price */}
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Price"
              className="w-1/2 border p-2 rounded"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max Price"
              className="w-1/2 border p-2 rounded"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
            />
          </div>

          {/* Beds */}
          <select
            className="w-full border p-2 rounded"
            value={filters.beds}
            onChange={(e) =>
              setFilters({ ...filters, beds: e.target.value })
            }
          >
            <option value="">Any Beds</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>

          {/* Property Type */}
          <select
            className="w-full border p-2 rounded"
            value={filters.propertyType}
            onChange={(e) =>
              setFilters({
                ...filters,
                propertyType: e.target.value,
              })
            }
          >
            <option value="">All Types</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="townhome">Townhome</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="p-4 text-sm text-gray-500">
            Loading listings...
          </div>
        )}

<div className="p-4 border-b space-y-2">
  <input
    type="email"
    placeholder="Email for alerts"
    className="w-full border p-2 rounded"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <button
    className="w-full bg-blue-600 text-white p-2 rounded"
    onClick={async () => {
      await fetch("/api/save-search", {
        method: "POST",
        body: JSON.stringify({
          email,
          filters: {
            ...filters,
            bounds,
          },
        }),
      })

      alert("Search saved! You'll get alerts.")
    }}
  >
    Save Search
  </button>
</div>

        {/* Listings */}
        {listings.map((hit: any) => {
          const listing = hit.document
          const isHovered = hoveredId === listing.id
          const isSelected = selectedId === listing.id

          return (
            <div
              key={listing.id}
              onMouseEnter={() => setHoveredId(listing.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedId(listing.id)}
              className={`p-4 border-b cursor-pointer transition
                ${isHovered ? "bg-gray-100" : ""}
                ${isSelected ? "bg-gray-200" : ""}
              `}
            >
              {/* Image */}
              <div className="h-[120px] bg-gray-200 mb-2 rounded-lg overflow-hidden">
                {listing.image && (
                  <img
                    src={listing.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="font-semibold">
                {listing.address}
              </div>

              <div className="text-gray-600">
                ${listing.price?.toLocaleString()}
              </div>

              <div className="text-sm text-gray-500">
                {listing.beds} beds • {listing.baths} baths
              </div>
            </div>
          )
        })}
      </div>

      {/* Map */}
      <div className="flex-1">
        <Map
          listings={listings}
          onBoundsChange={(b: any) => {
            setBounds(b)
            fetchListings(b)
          }}
          hoveredId={hoveredId}
          selectedId={selectedId}
          setHoveredId={setHoveredId}
          setSelectedId={setSelectedId}
        />
      </div>
    </div>
  )
}