"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

type Property = {
  id: string
  address: string
  lat: number
  lng: number
  price: number
}

export default function PropertyMap({
  properties
}: {
  properties: Property[]
}) {
  return (
    <MapContainer
      {...({
        center: [40.017, -105.283],
        zoom: 12,
        style: { height: "500px", width: "100%" },
      } as any)}
    >
      <TileLayer
        {...({
          attribution: "&copy; OpenStreetMap contributors",
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        } as any)}
      />

      {properties.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]}>
          <Popup>
            {p.address}
            <br />
            ${p.price.toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}