'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useRef } from 'react';

import { cities } from '@/lib/cities';
import { getBlogLinks, type BlogLink } from '@/lib/linking/getBlogLinks';
import PropertyCard from '../PropertyCard';
import SaveSearch from './SaveSearch';

export type MapSidebarListing = {
  id: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  price?: number | string | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  propertyType?: string | null;
  lat?: number | null;
  lng?: number | null;
  mainPhoto?: string | null;
  image?: string | null;
  isPrivateExclusive?: boolean | null;
  efficiencyScore?: number | null;
  resilienceScore?: number | null;
  altitude?: number | null;
  soilType?: string | null;
  hasPolybutyleneRisk?: boolean | null;
};

type BaseMapSidebarProps = {
  listings?: MapSidebarListing[];
  selectedId?: string | null;
  hoveredId?: string | null;
  onHover?: (id: string | null) => void;
  onCloseDetail?: () => void;
};

type IdSelectSidebarProps = BaseMapSidebarProps & {
  selectedProperty?: undefined;
  onSelect: (value: string) => void;
};

type PropertySelectSidebarProps = BaseMapSidebarProps & {
  selectedProperty: MapSidebarListing | null;
  onSelect: (value: MapSidebarListing) => void;
};

type MapSidebarProps = IdSelectSidebarProps | PropertySelectSidebarProps;

type InventoryStats = {
  dominantCity: string;
  privateCount: number;
  mappedCount: number;
  averageResilience: number | null;
  reviewCount: number;
};

type SidebarAuthorityLinks = {
  marketHref: string;
  brief: BlogLink | null;
};

function getCleanText(value: string | null | undefined) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function hasCoordinates(listing: MapSidebarListing) {
  return Number.isFinite(listing.lat) && Number.isFinite(listing.lng);
}

function isResidentialType(value: string | null | undefined) {
  const propertyType = getCleanText(value).toLowerCase();
  if (!propertyType) return true;

  return (
    propertyType.includes('residential') ||
    propertyType.includes('single') ||
    propertyType.includes('condo') ||
    propertyType.includes('town') ||
    propertyType.includes('multi')
  );
}

function getInventoryStats(listings: MapSidebarListing[]): InventoryStats {
  const cityCounts = new Map<string, number>();
  let privateCount = 0;
  let mappedCount = 0;
  let resilienceTotal = 0;
  let resilienceCount = 0;
  let reviewCount = 0;

  for (const listing of listings) {
    const city = getCleanText(listing.city);
    if (city) cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
    if (listing.isPrivateExclusive) privateCount += 1;
    if (hasCoordinates(listing)) mappedCount += 1;
    if (typeof listing.resilienceScore === 'number' && Number.isFinite(listing.resilienceScore)) {
      resilienceTotal += listing.resilienceScore;
      resilienceCount += 1;
    }
    if (listing.hasPolybutyleneRisk || !isResidentialType(listing.propertyType)) reviewCount += 1;
  }

  const [dominantCity] = Array.from(cityCounts.entries()).sort((a, b) => b[1] - a[1])[0] || [];

  return {
    dominantCity: dominantCity || 'Boulder',
    privateCount,
    mappedCount,
    averageResilience: resilienceCount ? Math.round(resilienceTotal / resilienceCount) : null,
    reviewCount,
  };
}

function getSidebarAuthorityLinks(cityName: string): SidebarAuthorityLinks {
  const city = cities.find((item) => normalize(item.name) === normalize(cityName));
  const marketSlug = city?.marketSlug ?? `${normalize(cityName).replace(/\s+/g, '-')}-co-housing-market`;

  return {
    marketHref: `/market/${marketSlug}`,
    brief: getBlogLinks({ city: cityName, limit: 1 })[0] ?? null,
  };
}

function SaveSearchFallback() {
  return (
    <div className="border border-white/10 bg-black p-4">
      <div className="h-4 w-28 bg-white/10" />
      <div className="mt-4 flex gap-2">
        <div className="h-11 flex-1 bg-white/[0.04]" />
        <div className="h-11 w-24 bg-cyan-300/30" />
      </div>
    </div>
  );
}

function EmptyInventoryState() {
  return (
    <div className="flex h-full items-center justify-center px-10 text-center">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-white/55">Inventory Sync Active</p>
        <p className="mx-auto mt-4 max-w-[280px] text-sm leading-6 text-white/45">
          Move the map or adjust the viewport to load matching Colorado listings.
        </p>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-white/10 bg-white/[0.035] px-3 py-2">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/35">{label}</p>
      <p className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-white">{value}</p>
    </div>
  );
}

function getSelectedAddress(property: MapSidebarListing | null | undefined, listings: MapSidebarListing[], selectedId: string | null) {
  if (property?.address) return property.address;
  if (!selectedId) return null;

  return listings.find((listing) => listing.id === selectedId)?.address || null;
}

export default function MapSidebar(props: MapSidebarProps) {
  const { listings = [], selectedId, hoveredId, onHover = () => {}, onCloseDetail } = props;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeId = selectedId ?? props.selectedProperty?.id ?? null;
  const stats = useMemo(() => getInventoryStats(listings), [listings]);
  const authorityLinks = useMemo(() => getSidebarAuthorityLinks(stats.dominantCity), [stats.dominantCity]);
  const selectedAddress = getSelectedAddress(props.selectedProperty, listings, activeId);

  useEffect(() => {
    if (!activeId) return;

    const selectedCard = document.getElementById(`property-${activeId}`);
    selectedCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeId]);

  function handleSelect(property: MapSidebarListing) {
    if (props.selectedProperty !== undefined) {
      props.onSelect(property);
      return;
    }

    props.onSelect(property.id);
  }

  return (
    <aside className="relative z-20 flex h-full w-full min-w-0 shrink-0 flex-col bg-[#030406] md:w-[34vw] md:min-w-[430px] md:max-w-[520px]">
      <header className="relative shrink-0 overflow-hidden border-b border-white/16 px-5 pb-3 pt-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0))]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-serif text-[2.05rem] font-black italic uppercase leading-none tracking-normal text-white">Colorado</h1>

            {activeId && onCloseDetail ? (
              <button
                type="button"
                onClick={onCloseDetail}
                className="mt-1 border border-white/15 px-3 py-2 text-[9px] font-black uppercase tracking-[0.22em] text-white/60 transition hover:border-cyan-300/60 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
              >
                Clear
              </button>
            ) : null}
          </div>

          <div className="mt-8 flex items-end justify-between border-b border-white/22 pb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.48em] text-white">Exclusive Inventory</p>
            <p className="whitespace-nowrap text-[10px] font-black uppercase text-white">{listings.length} Properties</p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <StatTile label="Mapped" value={stats.mappedCount} />
            <StatTile label="Resilience" value={stats.averageResilience === null ? '--' : `${stats.averageResilience}`} />
            <StatTile label="Review" value={stats.reviewCount} />
          </div>

          <div className="mt-3 min-h-9 border border-white/10 bg-black/55 px-3 py-2">
            <p className="truncate text-[9px] font-black uppercase tracking-[0.22em] text-white/35">
              {selectedAddress ? 'Selected Listing' : 'Primary Market'}
            </p>
            <p className="mt-1 truncate text-[11px] font-black uppercase tracking-[0.12em] text-white/75">
              {selectedAddress || `${stats.dominantCity}, Colorado`}
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10">
            <Link
              href={authorityLinks.marketHref}
              className="group bg-black/70 px-3 py-2 transition-colors hover:bg-white/[0.06]"
            >
              <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#00ff80]/80">
                Market
              </p>
              <p className="mt-1 truncate text-[9px] font-black uppercase tracking-[0.12em] text-white/55 transition-colors group-hover:text-white">
                {stats.dominantCity} Report
              </p>
            </Link>

            {authorityLinks.brief ? (
              <Link
                href={authorityLinks.brief.href}
                className="group bg-black/70 px-3 py-2 transition-colors hover:bg-white/[0.06]"
              >
                <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#00ff80]/80">
                  Brief
                </p>
                <p className="mt-1 truncate text-[9px] font-black uppercase tracking-[0.12em] text-white/55 transition-colors group-hover:text-white">
                  REIE Strategy
                </p>
              </Link>
            ) : (
              <Link
                href={`/search?city=${encodeURIComponent(stats.dominantCity)}`}
                className="group bg-black/70 px-3 py-2 transition-colors hover:bg-white/[0.06]"
              >
                <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#00ff80]/80">
                  Search
                </p>
                <p className="mt-1 truncate text-[9px] font-black uppercase tracking-[0.12em] text-white/55 transition-colors group-hover:text-white">
                  More Inventory
                </p>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div ref={sidebarRef} className="custom-sidebar-wide flex-1 overflow-y-auto bg-[#030406]">
        {listings.length > 0 ? (
          listings.map((property) => (
            <div
              key={property.id}
              onFocus={() => onHover(property.id)}
              onBlur={() => onHover(null)}
              onMouseEnter={() => onHover(property.id)}
              onMouseLeave={() => onHover(null)}
            >
              <PropertyCard
                property={property}
                isActive={activeId === property.id || hoveredId === property.id}
                onClick={() => handleSelect(property)}
              />
            </div>
          ))
        ) : (
          <EmptyInventoryState />
        )}
      </div>

      <div className="shrink-0 border-t border-white/12 bg-[#030406] p-4">
        <Suspense fallback={<SaveSearchFallback />}>
          <SaveSearch city={stats.dominantCity} />
        </Suspense>
      </div>

      <style jsx global>{`
        .custom-sidebar-wide::-webkit-scrollbar {
          width: 10px;
        }

        .custom-sidebar-wide::-webkit-scrollbar-track {
          background: #030406;
        }

        .custom-sidebar-wide::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.16);
          border: 3px solid #030406;
        }

        .custom-sidebar-wide::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 229, 255, 0.62);
        }
      `}</style>
    </aside>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/MapSidebar.tsx
