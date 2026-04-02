"use client"

import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet"
import { neighborhoodPolygons } from "@/lib/neighborhoodPolygons"
import Link from "next/link"
import "leaflet/dist/leaflet.css"

export default function NeighborhoodOverlayMap() {

  return (

    <MapContainer
      center={[40.017, -105.283]}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {neighborhoodPolygons.map((n) => (

        <Polygon
          key={n.slug}
          positions={n.coordinates}
        >

          <Popup>

            <Link
              href={`/neighborhood/${n.slug}`}
            >
              View {n.name} Neighborhood →
            </Link>

          </Popup>

        </Polygon>

      ))}

    </MapContainer>

  )
}