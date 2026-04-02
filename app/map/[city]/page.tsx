"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import MapListings from "@/components/maps/MapListings"
import SaveSearch from "@/components/maps/SaveSearch"

const MapInner = dynamic(() => import("@/components/maps/MapInner"), {
  ssr: false
})

export default function MapPage({ params }: any) {
  const [listings, setListings] = useState([])
  const [activeListingId, setActiveListingId] = useState<string | null>(null)

  return (
    <div className="h-screen flex flex-col">

      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
  <div>
    Homes for sale in {params.city}
  </div>

  <SaveSearch city={params.city} />
</div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Map */}
        <div className="w-1/2">
          <MapInner
            city={params.city}
            onListingsChange={setListings}
            activeListingId={activeListingId}
            setActiveListingId={setActiveListingId}
          />
        </div>

        {/* Listings */}
        <div className="w-1/2 border-l">
          <MapListings
            listings={listings}
            activeListingId={activeListingId}
            setActiveListingId={setActiveListingId}
          />
        </div>

      </div>
    </div>
  )
}