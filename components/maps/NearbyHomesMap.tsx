"use client"

import dynamic from "next/dynamic"

const Map = dynamic(() => import("./MapInner"), {
  ssr: false
})

export default function NearbyHomesMap({ city }: { city: string }) {
  return (
  <Map
    city={city}
    onListingsChange={() => {}}
    activeListingId={null}
    setActiveListingId={() => {}}
  />
)
}