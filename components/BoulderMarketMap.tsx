"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export default function BoulderMarketMap() {

  const neighborhoods = [

    {
      name: "Downtown Boulder",
      price: "$1.4M",
      position: [40.0176, -105.2797]
    },

    {
      name: "North Boulder",
      price: "$1.2M",
      position: [40.0444, -105.2830]
    },

    {
      name: "South Boulder",
      price: "$1.1M",
      position: [39.9870, -105.2500]
    },

    {
      name: "Table Mesa",
      price: "$1.05M",
      position: [39.9836, -105.2430]
    }

  ]

  return (

    <div className="h-[500px] w-full rounded-xl overflow-hidden">

      <MapContainer
  {...({
    center: [40.0150, -105.2705],
    zoom: 12,
    scrollWheelZoom: false,
    style: { height: "100%", width: "100%" }
  } as any)}
>

        <TileLayer
  {...({
    attribution: "&copy; OpenStreetMap contributors",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  } as any)}
/>

        {neighborhoods.map((n, i) => (

          <Marker key={i} position={n.position as [number, number]}>

            <Popup>

              <strong>{n.name}</strong>

              <br/>

              Median Price: {n.price}

            </Popup>

          </Marker>

        ))}

      </MapContainer>

    </div>

  )

}