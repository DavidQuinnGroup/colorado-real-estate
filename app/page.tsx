"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MapInner = dynamic(() => import("@/components/maps/MapInner"), {
  ssr: false, // 🔥 THIS IS THE REAL FIX
});

import MapSidebar from "@/components/maps/MapSidebar";

export default function HomePage() {
  const [listings, setListings] = useState<any[]>([])
  const [activeListingId, setActiveListingId] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "70%" }}>
        <MapInner
          city="boulder"
          onListingsChange={setListings}
          activeListingId={activeListingId}
          setActiveListingId={setActiveListingId}
        />
      </div>

      <MapSidebar
        listings={listings}
        activeListingId={activeListingId}
        setActiveListingId={setActiveListingId}
      />
    </div>
  );
}