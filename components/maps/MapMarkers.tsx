"use client"

import { Marker } from "react-leaflet"
import PriceMarker from "./PriceMarker"

export default function MapMarkers({
  features,
  activeListingId,
  setActiveListingId
}: any) {
  if (!features) return null

  return (
    <>
      {features.map((feature: any, index: number) => {
        const [lng, lat] = feature.geometry.coordinates

        if (feature.properties.cluster) {
          return (
            <Marker key={`cluster-${index}`} position={[lat, lng]}>
              <div className="cluster-marker">
                {feature.properties.point_count}
              </div>
            </Marker>
          )
        }

        const isActive = feature.properties.id === activeListingId

        return (
          <PriceMarker
            key={feature.properties.id}
            property={{
              id: feature.properties.id,
              price: feature.properties.price,
              lat,
              lng,
              address: "",
              city: "",
              slug: ""
            }}
            isActive={isActive}
            onHover={() => setActiveListingId(feature.properties.id)}
            onLeave={() => setActiveListingId(null)}
          />
        )
      })}
    </>
  )
}