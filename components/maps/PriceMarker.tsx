"use client"

import { Marker, Popup } from "react-leaflet"
import L from "leaflet"

export default function PriceMarker({
  property,
  isActive,
  onHover,
  onLeave
}: any) {

  const icon = L.divIcon({
    className: "price-marker",
    html: `
      <div style="
        background:${isActive ? "#2563eb" : "white"};
        color:${isActive ? "white" : "black"};
        padding:6px 12px;
        border-radius:8px;
        font-weight:700;
        border:1px solid #ccc;
        box-shadow:0 2px 6px rgba(0,0,0,0.35);
      ">
        $${Math.round(property.price / 1000)}K
      </div>
    `,
  })

  return (
    <Marker
      position={[property.lat, property.lng]}
      icon={icon}
      eventHandlers={{
        mouseover: onHover,
        mouseout: onLeave
      }}
    >
      <Popup>
        <div>
          <div>${property.price.toLocaleString()}</div>
        </div>
      </Popup>
    </Marker>
  )
}