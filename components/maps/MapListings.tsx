"use client";

import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

export default function MapListings({ setListings }: any) {
  const map = useMap();

  async function fetchListings() {
    const bounds = map.getBounds();

    const url = `/api/map-listings?minLat=${bounds.getSouth()}&maxLat=${bounds.getNorth()}&minLng=${bounds.getWest()}&maxLng=${bounds.getEast()}`;

    const res = await fetch(url);
    const data = await res.json();

    setListings(data);
  }

  useEffect(() => {
    fetchListings();

    map.on("moveend", fetchListings);

    return () => {
      map.off("moveend", fetchListings);
    };
  }, [map]);

  return null;
}