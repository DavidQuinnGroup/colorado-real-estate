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
  const visibleCoordinateCount = useMemo(() => visibleListings.filter(hasMapCoordinates).length, [visibleListings]);
  const totalCoordinateCount = useMemo(() => listings.filter(hasMapCoordinates).length, [listings]);
  const privateListingCount = useMemo(() => listings.filter((property) => property.isPrivateExclusive).length, [listings]);
  const filteredPrivateCount = listings.length - visibleListings.length;
  const selectedListingVisible = Boolean(selectedId && visibleListings.some((property) => property.id === selectedId));
  const hoveredListingVisible = Boolean(hoveredId && visibleListings.some((property) => property.id === hoveredId));
  const accessLevel = searchMeta?.accessLevel || (userTier === 'Contracted' ? 'contracted' : 'public');

  const effectiveSearchMeta = useMemo<SearchMapMeta | null>(() => {
    if (!searchMeta) return null;

    const returned = searchMeta.returned ?? listings.length;
    const mapped = searchMeta.mapped ?? visibleCoordinateCount;
    const coordinateFiltered = searchMeta.coordinateFiltered ?? Math.max(0, returned - mapped);

    return {
      ...searchMeta,
      accessLevel,
      returned,
      mapped,
      coordinateFiltered,
      smoke: searchMeta.smoke
        ? {
            ...searchMeta.smoke,
            checks: {
              ...searchMeta.smoke.checks,
              accessLevel,
              coordinateFiltered,
              mapped,
              returned,
            },
          }
        : undefined,
    };
  }, [accessLevel, listings.length, searchMeta, visibleCoordinateCount]);

  useEffect(() => {
    if (!selectedId) return;
    if (visibleListings.some((property) => property.id === selectedId)) return;

    setSelectedId('');
  }, [selectedId, setSelectedId, visibleListings]);

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#030303]"
      data-testid="reie-map-inner"
      data-map-inner-user-tier={userTier}
      data-map-inner-access-level={accessLevel}
      data-map-inner-total-listing-count={listings.length}
      data-map-inner-visible-listing-count={visibleListings.length}
      data-map-inner-private-listing-count={privateListingCount}
      data-map-inner-filtered-private-count={filteredPrivateCount}
      data-map-inner-total-coordinate-count={totalCoordinateCount}
      data-map-inner-visible-coordinate-count={visibleCoordinateCount}
      data-map-inner-selected-listing-id={selectedId || ''}
      data-map-inner-selected-visible={selectedListingVisible ? 'true' : 'false'}
      data-map-inner-hovered-listing-id={hoveredId || ''}
      data-map-inner-hovered-visible={hoveredListingVisible ? 'true' : 'false'}
      data-map-inner-center={BOULDER_MAP_CENTER.join(',')}
      data-map-inner-has-search-meta={effectiveSearchMeta ? 'true' : 'false'}
      data-map-inner-search-returned={effectiveSearchMeta?.returned ?? ''}
      data-map-inner-search-mapped={effectiveSearchMeta?.mapped ?? ''}
      data-map-inner-search-coordinate-filtered={effectiveSearchMeta?.coordinateFiltered ?? ''}
      data-map-inner-search-terminal={effectiveSearchMeta?.terminal ?? ''}
      data-map-inner-search-route={effectiveSearchMeta?.route ?? ''}
      data-map-inner-search-source={effectiveSearchMeta?.source ?? ''}
    >
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
