"use client"

import { Marker, Popup } from "react-leaflet"
import L from "leaflet"

function formatPrice(price: number) {
  if (!price) return ""
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`
  if (price >= 1_000) return `$${Math.round(price / 1_000)}K`
  return `$${price}`
}

function createPriceIcon(price: number) {
  const label = formatPrice(price)

  return L.divIcon({
    className: "",
    html: `
      <div style="
        background: #111;
        color: white;
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        border: 1px solid rgba(255,255,255,0.2);
        white-space: nowrap;
      ">
        ${label}
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

export default function MapMarkers({
  listings,
  activeListingId,
  setActiveListingId
}: any) {
  return (
    <>
      {listings.map((listing: any) => (
        <Marker
          key={listing.mls_id}
          position={[listing.lat, listing.lng]}
          icon={createPriceIcon(listing.price)}
          eventHandlers={{
            click: () => setActiveListingId(listing.mls_id)
          }}
        >
          <Popup>
            <div>
              <strong>{listing.address}</strong>
              <br />
              {formatPrice(listing.price)}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}