"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import type { Map as LeafletMap } from "leaflet"
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet"
import L from "leaflet"
import Supercluster from "supercluster"

interface Props {
  listings: any[]
  onBoundsChange: (bounds: any) => void

  // 🔥 NEW (optional for sync)
  hoveredId?: string | null
  selectedId?: string | null
  setHoveredId?: (id: string | null) => void
  setSelectedId?: (id: string | null) => void
}

// 🧠 Map Events
function MapEvents({ onBoundsChange, setBounds, setZoom }: any) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds()
      const zoom = map.getZoom()

      setBounds([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ])

      setZoom(zoom)

      onBoundsChange({
        neLat: bounds.getNorthEast().lat,
        neLng: bounds.getNorthEast().lng,
        swLat: bounds.getSouthWest().lat,
        swLng: bounds.getSouthWest().lng,
      })
    },
  })

  return null
}

// 💰 Price Marker (UPDATED: active state)
function createPriceIcon(price: number, active = false) {
  return L.divIcon({
    html: `<div style="
      background:${active ? "#2563eb" : "#000"};
      color:#fff;
      padding:6px 10px;
      border-radius:999px;
      font-size:12px;
      font-weight:600;
      transform:${active ? "scale(1.2)" : "scale(1)"};
      transition:all 0.15s ease;
    ">
      $${Math.round(price / 1000)}k
    </div>`,
    className: "",
  })
}

// 🔵 Cluster Marker
function createClusterIcon(count: number) {
  return L.divIcon({
    html: `<div style="
      background:#111;
      color:#fff;
      width:40px;
      height:40px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:50%;
      font-size:14px;
      font-weight:700;
    ">
      ${count}
    </div>`,
    className: "",
  })
}

export default function SearchMap({
  listings,
  onBoundsChange,
  hoveredId,
  selectedId,
  setHoveredId,
  setSelectedId,
}: Props) {
  const [mounted, setMounted] = useState(false)
  const [bounds, setBounds] = useState<any>(null)
  const [zoom, setZoom] = useState(12)

  // fallback local state if parent not controlling
  const [localSelected, setLocalSelected] = useState<any>(null)

  const mapRef = useRef<LeafletMap | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 🔥 Convert listings → geo points
const points = useMemo(() => {
  return listings.map((listing) => ({
    type: "Feature" as const,
    properties: {
      cluster: false,
      listing,
    },
    geometry: {
      type: "Point" as const,
      coordinates: [listing.lng, listing.lat],
    },
  }))
}, [listings])

  // 🔥 Build cluster index
  const clusterIndex = useMemo(() => {
    const index = new Supercluster({
      radius: 60,
      maxZoom: 20,
    })

    index.load(points)
    return index
  }, [points])

  // 🔥 Dynamic clusters
  const clusters = useMemo(() => {
    if (!bounds) return []
    return clusterIndex.getClusters(bounds, zoom)
  }, [clusterIndex, bounds, zoom])

  if (!mounted) return null

  return (
    <div className="relative h-full w-full">
      <MapContainer
        ref={mapRef as any}
        center={[40.015, -105.27]}
        zoom={12}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapEvents
          onBoundsChange={onBoundsChange}
          setBounds={setBounds}
          setZoom={setZoom}
        />

        {clusters.map((cluster: any) => {
          const [lng, lat] = cluster.geometry.coordinates

          // 🔵 Cluster
          if (cluster.properties.cluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                position={[lat, lng]}
                icon={createClusterIcon(
                  cluster.properties.point_count
                )}
                eventHandlers={{
                  click: () => {
                    const expansionZoom = Math.min(
                      clusterIndex.getClusterExpansionZoom(cluster.id),
                      20
                    )

                    mapRef.current?.setView(
                      [lat, lng],
                      expansionZoom,
                      { animate: true }
                    )
                  },
                }}
              />
            )
          }

          // 💰 Listing
          const listing = cluster.properties.listing

          const isHovered = hoveredId === listing.id
          const isSelected = selectedId === listing.id

          return (
            <Marker
              key={listing.id}
              position={[listing.lat, listing.lng]}
              icon={createPriceIcon(
                listing.price,
                isHovered || isSelected
              )}
              eventHandlers={{
                click: () => {
                  if (setSelectedId) {
                    setSelectedId(listing.id)
                  } else {
                    setLocalSelected(listing)
                  }
                },
                mouseover: () => setHoveredId?.(listing.id),
                mouseout: () => setHoveredId?.(null),
              }}
            />
          )
        })}
      </MapContainer>

      {/* 🧾 Floating preview (fallback mode only) */}
      {!selectedId && localSelected && (
        <div className="absolute bottom-6 left-6 bg-white shadow-xl rounded-xl p-4 w-[300px] z-[1000]">
          <div className="font-semibold text-lg">
            {localSelected.address}
          </div>

          <div className="text-gray-600 mb-2">
            ${localSelected.price?.toLocaleString()}
          </div>

          <div className="text-sm text-gray-500">
            {localSelected.beds} beds • {localSelected.baths} baths
          </div>

          <button
            className="mt-3 text-sm text-blue-600"
            onClick={() => setLocalSelected(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}