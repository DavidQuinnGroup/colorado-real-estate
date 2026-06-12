'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { List, Map as MapIcon } from 'lucide-react';
import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react';

import MapSidebar, { type MapSidebarListing } from '@/components/maps/MapSidebar';
import type { MapBounds } from '@/components/maps/MapInner';
import type { SearchMapMeta } from '@/components/maps/SearchMap';
import SearchControls, {
  buildSearchParams,
  getInitialSearchFilters,
  hasActiveSearchFilters,
  type SearchFilters,
} from '@/components/search/SearchControls';
import type { FAQItem } from '@/lib/schema/faqSchema';

type SearchApiResponse = {
  results?: unknown;
  found?: number;
  source?: string;
  meta?: SearchMapMeta;
  fallbackReason?: string;
  error?: string;
};

export type HomeAuthorityLink = {
  label: string;
  href: string;
  eyebrow: string;
};

type HomeSearchExperienceProps = {
  authorityLinks?: HomeAuthorityLink[];
  faqItems?: FAQItem[];
};

type MobileSearchView = 'list' | 'map';

const MapInner = dynamic(() => import('@/components/maps/MapInner'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-[#050505]" />,
});

const DEFAULT_BOULDER_BOUNDS: NonNullable<MapBounds> = {
  north: 40.12,
  south: 39.92,
  east: -105.12,
  west: -105.42,
  neLat: 40.12,
  neLng: -105.12,
  swLat: 39.92,
  swLng: -105.42,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toStringOrNull(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function toNumberOrNull(value: unknown) {
  if (value === null || value === undefined || value === '') return null;

  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toBoolean(value: unknown) {
  return value === true;
}

function toBooleanOrNull(value: unknown) {
  if (typeof value === 'boolean') return value;
  return null;
}

function normalizeListing(value: unknown): MapSidebarListing | null {
  if (!isRecord(value)) return null;

  const id = toStringOrNull(value.id);
  if (!id) return null;

  const mainPhoto = toStringOrNull(value.mainPhoto) || toStringOrNull(value.image);

  return {
    id,
    address: toStringOrNull(value.address) || '(No Address Provided)',
    city: toStringOrNull(value.city) || 'Colorado',
    state: toStringOrNull(value.state) || 'CO',
    price: toNumberOrNull(value.price) ?? 0,
    beds: toNumberOrNull(value.beds),
    baths: toNumberOrNull(value.baths),
    sqft: toNumberOrNull(value.sqft),
    propertyType: toStringOrNull(value.propertyType),
    lat: toNumberOrNull(value.lat),
    lng: toNumberOrNull(value.lng),
    mainPhoto,
    image: mainPhoto,
    isPrivateExclusive: toBoolean(value.isPrivateExclusive),
    efficiencyScore: toNumberOrNull(value.efficiencyScore),
    resilienceScore: toNumberOrNull(value.resilienceScore),
    altitude: toNumberOrNull(value.altitude),
    soilType: toStringOrNull(value.soilType),
    hasPolybutyleneRisk: toBooleanOrNull(value.hasPolybutyleneRisk),
  };
}

function normalizeListings(results: unknown): MapSidebarListing[] {
  if (!Array.isArray(results)) return [];

  return results.flatMap((item) => {
    const listing = normalizeListing(item);
    return listing ? [listing] : [];
  });
}

function getBoundsValue(bounds: MapBounds, primaryKey: keyof NonNullable<MapBounds>, fallbackKey: keyof NonNullable<MapBounds>) {
  if (!bounds) return null;
  return bounds[primaryKey] ?? bounds[fallbackKey] ?? null;
}

function buildSearchUrl(bounds: MapBounds, filters: SearchFilters) {
  const params = buildSearchParams(filters);
  params.set('limit', '250');
  const north = getBoundsValue(bounds, 'neLat', 'north');
  const south = getBoundsValue(bounds, 'swLat', 'south');
  const east = getBoundsValue(bounds, 'neLng', 'east');
  const west = getBoundsValue(bounds, 'swLng', 'west');

  if (north !== null && south !== null && east !== null && west !== null) {
    params.set('north', String(north));
    params.set('south', String(south));
    params.set('east', String(east));
    params.set('west', String(west));
  }

  return `/api/search?${params.toString()}`;
}

function normalizeSearchMeta(data: SearchApiResponse, listings: MapSidebarListing[]): SearchMapMeta {
  if (data.meta) {
    const source = data.meta.source || data.source || 'database';
    const accessLevel = data.meta.accessLevel || 'public';
    const health = data.meta.health || (source === 'database' ? 'degraded' : 'healthy');
    const mapped = data.meta.mapped ?? listings.length;
    const returned = data.meta.returned ?? listings.length;
    const coordinateFiltered = data.meta.coordinateFiltered ?? 0;

    return {
      ...data.meta,
      accessLevel,
      health,
      mapped,
      returned,
      coordinateFiltered,
      source,
      smoke: data.meta.smoke
        ? {
            ...data.meta.smoke,
            checks: {
              ...data.meta.smoke.checks,
              accessLevel,
              coordinateFiltered,
              health,
              mapped,
              returned,
              source,
            },
          }
        : undefined,
    };
  }

  const source = data.source || 'database';
  const health = source === 'database' ? 'degraded' : 'healthy';

  return {
    accessLevel: 'public',
    boundsApplied: true,
    coordinateFiltered: 0,
    durationMs: 0,
    filtersApplied: ['bounds', 'publicAccess'],
    health,
    mapped: listings.length,
    returned: listings.length,
    source,
    smoke: {
      command: 'npm run smoke:search',
      terminal: 'Terminal 5',
      ready: false,
      blockers: ['Search API response did not include metadata.'],
      checks: {
        accessLevel: 'public',
        boundsApplied: true,
        coordinateFiltered: 0,
        durationMs: 0,
        foundPublicMetadata: false,
        hasTypesenseContext: false,
        health,
        mapped: listings.length,
        returned: listings.length,
        source,
      },
    },
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Home search failed.';
}

export default function HomeSearchExperience({ authorityLinks = [], faqItems = [] }: HomeSearchExperienceProps) {
  const [listings, setListings] = useState<MapSidebarListing[]>([]);
  const [searchMeta, setSearchMeta] = useState<SearchMapMeta | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(() => getInitialSearchFilters());
  const [selectedProperty, setSelectedProperty] = useState<MapSidebarListing | null>(null);
  const [mobileView, setMobileView] = useState<MobileSearchView>('list');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const currentBounds = useRef<MapBounds>(DEFAULT_BOULDER_BOUNDS);
  const lastRequestKey = useRef('');
  const requestSequence = useRef(0);

  const fetchListings = useCallback(async (bounds: MapBounds, nextFilters = filters, force = false) => {
    if (!bounds) return;
    currentBounds.current = bounds;

    const requestKey = JSON.stringify({ bounds, filters: nextFilters });
    if (!force && requestKey === lastRequestKey.current) return;
    lastRequestKey.current = requestKey;

    const requestId = requestSequence.current + 1;
    requestSequence.current = requestId;
    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(buildSearchUrl(bounds, nextFilters));
      const data = (await response.json()) as SearchApiResponse;

      if (requestId !== requestSequence.current) return;

      const nextListings = normalizeListings(data.results);
      const nextSearchMeta = normalizeSearchMeta(data, nextListings);

      if (!response.ok) {
        setSearchMeta(nextSearchMeta);
        setListings(nextListings);
        setSelectedProperty(null);
        setSearchError(data.error || 'Inventory search is temporarily unavailable.');
        console.error('Home search error:', data.error || 'Inventory search is temporarily unavailable.');
        return;
      }

      setSearchMeta(nextSearchMeta);
      setListings(nextListings);
      setSelectedProperty((selected) => {
        if (!selected) return selected;
        return nextListings.find((listing) => listing.id === selected.id) || null;
      });
    } catch (error) {
      if (requestId !== requestSequence.current) return;

      console.error('Home search error:', getErrorMessage(error));
      setListings([]);
      setSearchMeta(null);
      setSelectedProperty(null);
      setSearchError('Inventory search is temporarily unavailable.');
    } finally {
      if (requestId === requestSequence.current) setIsSearching(false);
    }
  }, [filters]);

  useEffect(() => {
    const initialLoadTimer = window.setTimeout(() => {
      void fetchListings(DEFAULT_BOULDER_BOUNDS);
    }, 0);

    return () => window.clearTimeout(initialLoadTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void fetchListings(currentBounds.current || DEFAULT_BOULDER_BOUNDS, filters, true);
  }

  function handleRemoveFilter(nextFilters: SearchFilters) {
    void fetchListings(currentBounds.current || DEFAULT_BOULDER_BOUNDS, nextFilters, true);
  }

  function handleReset() {
    const nextFilters = getInitialSearchFilters();

    setFilters(nextFilters);
    setSelectedProperty(null);
    setSearchError(null);
    void fetchListings(currentBounds.current || DEFAULT_BOULDER_BOUNDS, nextFilters, true);
  }

  const searchControls = (
    <SearchControls
      filters={filters}
      isSearching={isSearching}
      searchError={searchError}
      onChange={setFilters}
      onRemoveFilter={handleRemoveFilter}
      onReset={handleReset}
      onSubmit={handleSearch}
    />
  );

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black text-white md:flex-row">
      <div className="absolute right-3 top-3 z-[900] grid grid-cols-2 overflow-hidden rounded-[8px] border border-white/12 bg-[#071017]/92 p-1 shadow-2xl backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setMobileView('list')}
          className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-[6px] px-3 text-[10px] font-black uppercase tracking-[0.12em] transition ${
            mobileView === 'list' ? 'bg-cyan-100 text-[#061017]' : 'text-white/58 hover:text-white'
          }`}
          aria-pressed={mobileView === 'list'}
        >
          <List size={13} aria-hidden="true" />
          List
        </button>
        <button
          type="button"
          onClick={() => setMobileView('map')}
          className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-[6px] px-3 text-[10px] font-black uppercase tracking-[0.12em] transition ${
            mobileView === 'map' ? 'bg-cyan-100 text-[#061017]' : 'text-white/58 hover:text-white'
          }`}
          aria-pressed={mobileView === 'map'}
        >
          <MapIcon size={13} aria-hidden="true" />
          Map
        </button>
      </div>

      <div className={mobileView === 'map' ? 'hidden md:flex md:h-full md:shrink-0' : 'flex min-h-0 md:h-full md:shrink-0'}>
        <MapSidebar
          listings={listings}
          selectedProperty={selectedProperty}
          onSelect={setSelectedProperty}
          onCloseDetail={() => setSelectedProperty(null)}
          searchControls={searchControls}
          hasActiveFilters={hasActiveSearchFilters(filters)}
          isLoading={isSearching}
        />
      </div>

      <div className={`${mobileView === 'list' ? 'hidden md:block' : 'block'} relative min-h-0 flex-1`}>
        <MapInner
          listings={listings}
          onBoundsChange={fetchListings}
          searchMeta={searchMeta}
          selectedId={selectedProperty?.id ?? null}
          setSelectedId={(id: string) => {
            if (!id) {
              setSelectedProperty(null);
              return;
            }

            const found = listings.find((listing) => listing.id === id);
            if (found) setSelectedProperty(found);
          }}
        />

        <div className="pointer-events-none absolute left-6 top-6 z-[700] hidden rounded-[8px] border border-white/12 bg-[#071017]/88 px-4 py-3 shadow-2xl backdrop-blur-md md:block">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Live REIE Map</p>
          <p className="mt-1 text-sm font-black uppercase tracking-[0.08em] text-white">
            {listings.length} visible listings
          </p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/38">
            {isSearching ? 'Inventory updating' : searchMeta?.source ? `${searchMeta.source} source` : 'Map ready'}
          </p>
        </div>

        {authorityLinks.length ? (
          <nav
            aria-label="David Quinn Group authority links"
            className="pointer-events-auto absolute bottom-6 left-6 z-[700] hidden max-w-[min(660px,calc(100%-3rem))] rounded-[8px] border border-white/12 bg-[#071017]/88 p-2 shadow-2xl backdrop-blur-md md:block"
          >
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {authorityLinks.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="group rounded-[6px] border border-white/10 bg-white/[0.055] p-3 transition-colors hover:border-cyan-100/35 hover:bg-white/[0.085]"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/72">
                    {link.eyebrow}
                  </p>
                  <p className="mt-2 text-[11px] font-black uppercase leading-4 tracking-[0.08em] text-white/68 transition-colors group-hover:text-white">
                    {link.label}
                  </p>
                </Link>
              ))}
            </div>
          </nav>
        ) : null}

        {faqItems.length ? (
          <details className="absolute right-6 top-6 z-[700] hidden w-[min(420px,calc(100%-3rem))] rounded-[8px] border border-white/12 bg-[#071017]/88 p-4 shadow-2xl backdrop-blur-md md:block">
            <summary className="cursor-pointer list-none text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100">
              REIE Authority FAQ
            </summary>
            <div className="mt-4 max-h-[52vh] space-y-4 overflow-auto pr-2">
              {faqItems.slice(0, 4).map((faq) => (
                <article key={faq.question} className="border-t border-white/10 pt-4">
                  <h2 className="text-[11px] font-black uppercase leading-5 tracking-[0.08em] text-white/80">
                    {faq.question}
                  </h2>
                  <p className="mt-2 text-[12px] leading-5 text-white/52">{faq.answer}</p>
                </article>
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/home/HomeSearchExperience.tsx
