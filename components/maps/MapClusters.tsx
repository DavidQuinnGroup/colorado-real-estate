"use client"

import dynamic from "next/dynamic"
import { ReactNode } from "react"

const MarkerClusterGroup = dynamic(
  () => import("react-leaflet-cluster"),
  { ssr: false }
)

export default function MapClusters({ children }: { children: ReactNode }) {
  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={60}
      spiderfyOnMaxZoom={true}
      showCoverageOnHover={false}
      zoomToBoundsOnClick={true}
    >
      {children}
    </MarkerClusterGroup>
  )
}