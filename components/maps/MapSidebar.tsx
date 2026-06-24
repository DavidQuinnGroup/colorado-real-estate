'use client';

import Link from 'next/link';
import { Bell, FileText, Gauge, Layers3, ListFilter, MapPinned, ShieldCheck, X } from 'lucide-react';
import type { ReactNode } from 'react';
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
  searchControls?: ReactNode;
  hasActiveFilters?: boolean;
  isLoading?: boolean;
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
  priceFloor: number | null;
  priceCeiling: number | null;
};

type ListingMetadata = {
  hasCoordinates: boolean;
  isReviewFlagged: boolean;
  price: number | null;
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

function getNumericPrice(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(String(value).replace(/[$,]/g, ''));

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function getListingMetadata(listing: MapSidebarListing): ListingMetadata {
  return {
    hasCoordinates: hasCoordinates(listing),
    isReviewFlagged: Boolean(listing.hasPolybutyleneRisk || !isResidentialType(listing.propertyType)),
    price: getNumericPrice(listing.price),
  };
}

function formatCompactPrice(value: number | null) {
  if (value === null) return '--';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}M`;
  if (value >= 1000) return `$${Math.round(value / 1000)}K`;

  return `$${value.toLocaleString()}`;
}

function getInventoryStats(listings: MapSidebarListing[]): InventoryStats {
  const cityCounts = new Map<string, number>();
  let privateCount = 0;
  let mappedCount = 0;
  let resilienceTotal = 0;
  let resilienceCount = 0;
  let reviewCount = 0;
  let priceFloor: number | null = null;
  let priceCeiling: number | null = null;

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

    const price = getNumericPrice(listing.price);
    if (price !== null) {
      priceFloor = priceFloor === null ? price : Math.min(priceFloor, price);
      priceCeiling = priceCeiling === null ? price : Math.max(priceCeiling, price);
    }
  }

  const [dominantCity] = Array.from(cityCounts.entries()).sort((a, b) => b[1] - a[1])[0] || [];

  return {
    dominantCity: dominantCity || 'Boulder',
    privateCount,
    mappedCount,
    averageResilience: resilienceCount ? Math.round(resilienceTotal / resilienceCount) : null,
    reviewCount,
    priceFloor,
    priceCeiling,
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
    <div className="rounded-[8px] border border-white/10 bg-[#101720] p-4">
      <div className="h-4 w-28 rounded-[4px] bg-white/10" />
      <div className="mt-4 flex gap-2">
        <div className="h-11 flex-1 rounded-[4px] bg-white/[0.04]" />
        <div className="h-11 w-24 rounded-[4px] bg-cyan-300/30" />
      </div>
    </div>
  );
}

function EmptyInventoryState({ hasActiveFilters }: { hasActiveFilters?: boolean }) {
  return (
    <div className="flex h-full items-center justify-center px-5 py-8 text-center">
      <div className="max-w-[320px] rounded-[8px] border border-white/10 bg-white/[0.035] p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-cyan-100/75">
          {hasActiveFilters ? 'No Matching Inventory' : 'Inventory Sync Active'}
        </p>
        <p className="mx-auto mt-4 text-sm leading-6 text-white/52">
          {hasActiveFilters
            ? 'Loosen one filter chip or broaden the map area to reveal more Colorado inventory.'
            : 'Move the map or adjust the viewport to load matching Colorado listings.'}
        </p>
        {hasActiveFilters ? (
          <p className="mt-4 border-t border-white/10 pt-4 text-[10px] font-black uppercase tracking-[0.16em] text-white/34">
            Filter reset is available above
          </p>
        ) : null}
      </div>
    </div>
  );
}

function LoadingInventorySkeleton() {
  return (
    <div className="space-y-3 p-3" aria-label="Loading inventory">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3">
          <div className="h-40 animate-pulse rounded-[6px] bg-white/[0.06]" />
          <div className="mt-3 h-5 w-2/3 animate-pulse rounded-[4px] bg-white/[0.08]" />
          <div className="mt-2 h-3 w-4/5 animate-pulse rounded-[4px] bg-white/[0.05]" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-12 animate-pulse rounded-[6px] bg-white/[0.05]" />
            <div className="h-12 animate-pulse rounded-[6px] bg-white/[0.05]" />
            <div className="h-12 animate-pulse rounded-[6px] bg-white/[0.05]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatTile({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-white/[0.045] px-3 py-3">
      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/42">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-[18px] font-black leading-none text-white">{value}</p>
    </div>
  );
}

function SearchIntelligenceStrip({ stats }: { stats: InventoryStats }) {
  const mappedLabel = stats.mappedCount > 0 ? `${stats.mappedCount} mappable listings` : 'Map coverage loading';
  const resilienceLabel =
    stats.averageResilience === null ? 'Resilience scoring pending' : `${stats.averageResilience} average resilience`;
  const reviewLabel = stats.reviewCount > 0 ? `${stats.reviewCount} diligence flags` : 'No major review flags';

  return (
    <div
      className="mt-3 rounded-[8px] border border-cyan-100/18 bg-cyan-100/[0.065] p-3"
      data-testid="reie-sidebar-intelligence"
      data-sidebar-mapped-count={stats.mappedCount}
      data-sidebar-review-count={stats.reviewCount}
      data-sidebar-average-resilience={stats.averageResilience ?? ''}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/78">Search Intelligence</p>
        <span className="rounded-[4px] border border-cyan-100/20 bg-black/30 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-cyan-100/70">
          REIE
        </span>
      </div>
      <div className="mt-3 grid gap-2 text-[10px] font-black uppercase leading-4 tracking-[0.12em] text-white/58">
        <div className="flex items-center gap-2">
          <MapPinned size={12} aria-hidden="true" className="shrink-0 text-cyan-100/70" />
          <span>{mappedLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} aria-hidden="true" className="shrink-0 text-cyan-100/70" />
          <span>{resilienceLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <Gauge size={12} aria-hidden="true" className="shrink-0 text-cyan-100/70" />
          <span>{reviewLabel}</span>
        </div>
      </div>
    </div>
  );
}

function ResultsToolbar({
  count,
  stats,
  hasActiveFilters,
  isLoading,
}: {
  count: number;
  stats: InventoryStats;
  hasActiveFilters?: boolean;
  isLoading?: boolean;
}) {
  const mapCoverage = count > 0 ? `${Math.round((stats.mappedCount / count) * 100)}% mapped` : 'Map pending';

  return (
    <div
      className="sticky top-0 z-10 border-b border-white/10 bg-[#070b10]/95 px-3 py-3 backdrop-blur"
      data-testid="reie-sidebar-results-toolbar"
      data-sidebar-listing-count={count}
      data-sidebar-mapped-count={stats.mappedCount}
      data-sidebar-mode={hasActiveFilters ? 'filtered' : 'live'}
      data-sidebar-loading={String(Boolean(isLoading))}
    >
      <div className="flex items-center justify-between gap-3 rounded-[8px] border border-white/10 bg-white/[0.035] px-3 py-2.5">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
            <ListFilter size={13} aria-hidden="true" />
            Results
          </p>
          <p className="mt-1 truncate text-[11px] font-black uppercase tracking-[0.1em] text-white/45">
            {isLoading ? 'Updating inventory' : `${stats.dominantCity} priority stack`}
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-3 overflow-hidden rounded-[6px] border border-white/10 bg-black/24 text-center">
          <div className="min-w-[58px] px-2 py-1.5">
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/34">Total</p>
            <p className="mt-0.5 text-[13px] font-black leading-none text-white">{count}</p>
          </div>
          <div className="min-w-[58px] border-l border-white/10 px-2 py-1.5">
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/34">Map</p>
            <p className="mt-0.5 text-[11px] font-black leading-none text-cyan-100">{mapCoverage}</p>
          </div>
          <div className="min-w-[58px] border-l border-white/10 px-2 py-1.5">
            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/34">Mode</p>
            <p className="mt-0.5 text-[11px] font-black leading-none text-white">{hasActiveFilters ? 'Filtered' : 'Live'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSelectedAddress(property: MapSidebarListing | null | undefined, listings: MapSidebarListing[], selectedId: string | null) {
  if (property?.address) return property.address;
  if (!selectedId) return null;

  return listings.find((listing) => listing.id === selectedId)?.address || null;
}

export default function MapSidebar(props: MapSidebarProps) {
  const { listings = [], selectedId, hoveredId, onHover = () => {}, onCloseDetail, searchControls, hasActiveFilters, isLoading } = props;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeId = selectedId ?? props.selectedProperty?.id ?? null;
  const stats = useMemo(() => getInventoryStats(listings), [listings]);
  const authorityLinks = useMemo(() => getSidebarAuthorityLinks(stats.dominantCity), [stats.dominantCity]);
  const selectedAddress = getSelectedAddress(props.selectedProperty, listings, activeId);
  const selectedListing = activeId ? listings.find((listing) => listing.id === activeId) || null : null;
  const hoveredListing = hoveredId ? listings.find((listing) => listing.id === hoveredId) || null : null;

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
    <aside
      className="relative z-20 flex h-full w-full min-w-0 shrink-0 flex-col border-b border-white/10 bg-[#070b10] md:w-[35vw] md:min-w-[440px] md:max-w-[560px] md:border-b-0 md:border-r"
      data-testid="reie-map-sidebar"
      data-sidebar-listing-count={listings.length}
      data-sidebar-mapped-count={stats.mappedCount}
      data-sidebar-private-count={stats.privateCount}
      data-sidebar-review-count={stats.reviewCount}
      data-sidebar-dominant-city={stats.dominantCity}
      data-sidebar-selected-listing-id={activeId || ''}
      data-sidebar-hovered-listing-id={hoveredId || ''}
      data-sidebar-selected-address={selectedListing?.address || ''}
      data-sidebar-hovered-address={hoveredListing?.address || ''}
      data-sidebar-has-active-filters={String(Boolean(hasActiveFilters))}
      data-sidebar-loading={String(Boolean(isLoading))}
    >
      <header
        className="relative max-h-[52vh] shrink-0 overflow-y-auto border-b border-white/12 px-4 pb-4 pt-16 md:max-h-none md:overflow-hidden md:px-5 md:pt-5"
        data-testid="reie-sidebar-header"
        data-sidebar-dominant-city={stats.dominantCity}
        data-sidebar-listing-count={listings.length}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(98,177,196,0.13),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.055),rgba(0,0,0,0))]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">REIE Inventory</p>
              <h1 className="mt-2 font-serif text-[2.15rem] font-black leading-none tracking-normal text-white">
                Colorado Search
              </h1>
            </div>

            {activeId && onCloseDetail ? (
              <button
                type="button"
                onClick={onCloseDetail}
                className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-white/15 text-white/60 transition hover:border-cyan-200/60 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                aria-label="Clear selected listing"
              >
                <X size={16} aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <div className="mt-5 rounded-[8px] border border-white/10 bg-black/24 p-3">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/38">Primary Market</p>
                <p className="mt-1 text-[17px] font-black uppercase leading-none text-white">{stats.dominantCity}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/38">Inventory</p>
                <p className="mt-1 text-[17px] font-black leading-none text-cyan-100">{listings.length}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-[6px] bg-white/[0.055] px-3 py-2">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/34">Low</p>
                <p className="mt-1 text-sm font-black text-white">{formatCompactPrice(stats.priceFloor)}</p>
              </div>
              <div className="rounded-[6px] bg-white/[0.055] px-3 py-2">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/34">High</p>
                <p className="mt-1 text-sm font-black text-white">{formatCompactPrice(stats.priceCeiling)}</p>
              </div>
              <div className="rounded-[6px] bg-white/[0.055] px-3 py-2">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/34">Private</p>
                <p className="mt-1 text-sm font-black text-white">{stats.privateCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <StatTile icon={<MapPinned size={13} aria-hidden="true" />} label="Mapped" value={stats.mappedCount} />
            <StatTile icon={<ShieldCheck size={13} aria-hidden="true" />} label="Res" value={stats.averageResilience === null ? '--' : `${stats.averageResilience}`} />
            <StatTile icon={<Gauge size={13} aria-hidden="true" />} label="Review" value={stats.reviewCount} />
          </div>

          <SearchIntelligenceStrip stats={stats} />

          {searchControls ? <div className="mt-3">{searchControls}</div> : null}

          <div
            className="mt-3 min-h-12 rounded-[8px] border border-white/10 bg-black/35 px-3 py-2.5"
            data-testid="reie-sidebar-selected-summary"
            data-sidebar-selected-listing-id={activeId || ''}
            data-sidebar-selected-address={selectedAddress || ''}
          >
            <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-white/36">
              {selectedAddress ? 'Selected Listing' : 'Primary Market'}
            </p>
            <p className="mt-1 truncate text-[12px] font-black uppercase tracking-[0.08em] text-white/76">
              {selectedAddress || `${stats.dominantCity}, Colorado`}
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href={authorityLinks.marketHref}
              className="group rounded-[8px] border border-white/10 bg-white/[0.045] px-3 py-2.5 transition-colors hover:border-cyan-100/35 hover:bg-white/[0.075]"
            >
              <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/72">
                <Layers3 size={13} aria-hidden="true" />
                Market
              </p>
              <p className="mt-1 truncate text-[10px] font-black uppercase tracking-[0.08em] text-white/55 transition-colors group-hover:text-white">
                {stats.dominantCity} Report
              </p>
            </Link>

            {authorityLinks.brief ? (
              <Link
                href={authorityLinks.brief.href}
                className="group rounded-[8px] border border-white/10 bg-white/[0.045] px-3 py-2.5 transition-colors hover:border-cyan-100/35 hover:bg-white/[0.075]"
              >
                <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/72">
                  <FileText size={13} aria-hidden="true" />
                  Brief
                </p>
                <p className="mt-1 truncate text-[10px] font-black uppercase tracking-[0.08em] text-white/55 transition-colors group-hover:text-white">
                  REIE Strategy
                </p>
              </Link>
            ) : (
              <Link
                href={`/search?city=${encodeURIComponent(stats.dominantCity)}`}
                className="group rounded-[8px] border border-white/10 bg-white/[0.045] px-3 py-2.5 transition-colors hover:border-cyan-100/35 hover:bg-white/[0.075]"
              >
                <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/72">
                  <Bell size={13} aria-hidden="true" />
                  Search
                </p>
                <p className="mt-1 truncate text-[10px] font-black uppercase tracking-[0.08em] text-white/55 transition-colors group-hover:text-white">
                  More Inventory
                </p>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div
        ref={sidebarRef}
        className="custom-sidebar-wide flex-1 overflow-y-auto bg-[#070b10] pb-1"
        data-testid="reie-sidebar-list"
        data-sidebar-listing-count={listings.length}
        data-sidebar-selected-listing-id={activeId || ''}
        data-sidebar-hovered-listing-id={hoveredId || ''}
      >
        <ResultsToolbar count={listings.length} stats={stats} hasActiveFilters={hasActiveFilters} isLoading={isLoading} />

        {isLoading ? (
          <LoadingInventorySkeleton />
        ) : listings.length > 0 ? (
          listings.map((property, index) => {
            const listingMetadata = getListingMetadata(property);
            const isSelected = activeId === property.id;
            const isHovered = hoveredId === property.id;

            return (
            <div
              key={property.id}
              data-testid="reie-sidebar-listing"
              data-sidebar-listing-id={property.id}
              data-sidebar-listing-index={index}
              data-sidebar-listing-address={property.address || ''}
              data-sidebar-listing-city={property.city || ''}
              data-sidebar-listing-price={listingMetadata.price ?? ''}
              data-sidebar-listing-mapped={String(listingMetadata.hasCoordinates)}
              data-sidebar-listing-private={String(Boolean(property.isPrivateExclusive))}
              data-sidebar-listing-review={String(listingMetadata.isReviewFlagged)}
              data-sidebar-listing-selected={String(isSelected)}
              data-sidebar-listing-hovered={String(isHovered)}
              onFocus={() => onHover(property.id)}
              onBlur={() => onHover(null)}
              onMouseEnter={() => onHover(property.id)}
              onMouseLeave={() => onHover(null)}
            >
              <PropertyCard
                property={property}
                isActive={isSelected || isHovered}
                onClick={() => handleSelect(property)}
              />
            </div>
            );
          })
        ) : (
          <EmptyInventoryState hasActiveFilters={hasActiveFilters} />
        )}
      </div>

      <div className="shrink-0 border-t border-white/12 bg-[#070b10] p-4" data-testid="reie-sidebar-save-search-footer">
        <Suspense fallback={<SaveSearchFallback />}>
          <SaveSearch city={stats.dominantCity} />
        </Suspense>
      </div>

      <style jsx global>{`
        .custom-sidebar-wide::-webkit-scrollbar {
          width: 10px;
        }

        .custom-sidebar-wide::-webkit-scrollbar-track {
          background: #070b10;
        }

        .custom-sidebar-wide::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.16);
          border: 3px solid #070b10;
        }

        .custom-sidebar-wide::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 222, 235, 0.62);
        }
      `}</style>
    </aside>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/MapSidebar.tsx
