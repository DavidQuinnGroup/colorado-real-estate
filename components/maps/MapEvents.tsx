"use client"

import { useMapEvents } from "react-leaflet"

export default function MapEvents({
  onBoundsChange
}: {
  onBoundsChange: (map: any) => void
}) {
  const map = useMapEvents({
    moveend: () => onBoundsChange(map),
    zoomend: () => onBoundsChange(map),
  })

  return null
}