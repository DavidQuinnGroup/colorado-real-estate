"use client"

import dynamic from "next/dynamic"
import { ReactNode } from "react"

const MarkerClusterGroup = ({ children }: any) => <>{children}</>

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