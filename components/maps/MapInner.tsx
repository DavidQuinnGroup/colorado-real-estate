'use client';

import { useEffect, useMemo } from 'react';

import type { MapSidebarListing } from './MapSidebar';
import SearchMap, { type SearchMapMeta } from './SearchMap';

type UserTier = 'Public' | 'Contracted';

export type MapBounds = {
  north?: number;
  south?: number;
  east?: number;
  west?: number;
  neLat?: number;
  swLat?: number;
  neLng?: number;
  swLng?: number;
} | null;

type MapInnerProps = {
  listings?: MapSidebarListing[];
  onBoundsChange?: (bounds: MapBounds) => void;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  hoveredId?: string | null;
  setHoveredId?: (id: string | null) => void;
  searchMeta?: SearchMapMeta | null;
  userTier?: UserTier;
};

const BOULDER_MAP_CENTER: [number, number] = [40.0174, -105.276];

function hasMapCoordinates(property: MapSidebarListing) {
  return (
    Number.isFinite(property.lat) &&
    Number.isFinite(property.lng) &&
    Math.abs(Number(property.lat)) <= 90 &&
    Math.abs(Number(property.lng)) <= 180 &&
    !(Number(property.lat) === 0 && Number(property.lng) === 0)
  );
}

export default function MapInner({
  listings = [],
  onBoundsChange,
  selectedId,
  setSelectedId,
  hoveredId = null,
  setHoveredId = () => {},
  searchMeta = null,
  userTier = 'Public',
}: MapInnerProps) {
  const visibleListings = useMemo(() => {
    if (userTier === 'Contracted') return listings;
    return listings.filter((property) => !property.isPrivateExclusive);
  }, [listings, userTier]);

  const effectiveSearchMeta = useMemo<SearchMapMeta | null>(() => {
    if (!searchMeta) return null;

    const visibleCoordinateCount = visibleListings.filter(hasMapCoordinates).length;
    const returned = searchMeta.returned ?? listings.length;
    const mapped = searchMeta.mapped ?? visibleCoordinateCount;
    const coordinateFiltered = searchMeta.coordinateFiltered ?? Math.max(0, returned - mapped);

    return {
      ...searchMeta,
      accessLevel: searchMeta.accessLevel || (userTier === 'Contracted' ? 'contracted' : 'public'),
      returned,
      mapped,
      coordinateFiltered,
      smoke: searchMeta.smoke
        ? {
            ...searchMeta.smoke,
            checks: {
              ...searchMeta.smoke.checks,
              accessLevel: searchMeta.accessLevel || (userTier === 'Contracted' ? 'contracted' : 'public'),
              coordinateFiltered,
              mapped,
              returned,
            },
          }
        : undefined,
    };
  }, [listings.length, searchMeta, userTier, visibleListings]);

  useEffect(() => {
    if (!selectedId) return;
    if (visibleListings.some((property) => property.id === selectedId)) return;

    setSelectedId('');
  }, [selectedId, setSelectedId, visibleListings]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#030303]">
      <SearchMap
        listings={visibleListings}
        onBoundsChange={onBoundsChange}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
        center={BOULDER_MAP_CENTER}
        searchMeta={effectiveSearchMeta}
        userTier={userTier}
      />
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/MapInner.tsx
