'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import MapSidebar, { type MapSidebarListing } from '@/components/maps/MapSidebar';
import type { MapBounds } from '@/components/maps/MapInner';
import type { SearchMapMeta } from '@/components/maps/SearchMap';
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

function buildSearchUrl(bounds: MapBounds) {
  const params = new URLSearchParams({ limit: '250', q: '*' });
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
  const [selectedProperty, setSelectedProperty] = useState<MapSidebarListing | null>(null);
  const lastBounds = useRef('');
  const requestSequence = useRef(0);

  const fetchListings = useCallback(async (bounds: MapBounds) => {
    if (!bounds) return;

    const boundsKey = JSON.stringify(bounds);
    if (boundsKey === lastBounds.current) return;
    lastBounds.current = boundsKey;

    const requestId = requestSequence.current + 1;
    requestSequence.current = requestId;

    try {
      const response = await fetch(buildSearchUrl(bounds));
      const data = (await response.json()) as SearchApiResponse;

      if (requestId !== requestSequence.current) return;

      const nextListings = normalizeListings(data.results);
      const nextSearchMeta = normalizeSearchMeta(data, nextListings);

      if (!response.ok) {
        setSearchMeta(nextSearchMeta);
        setListings(nextListings);
        setSelectedProperty(null);
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
    }
  }, []);

  useEffect(() => {
    const initialLoadTimer = window.setTimeout(() => {
      void fetchListings(DEFAULT_BOULDER_BOUNDS);
    }, 0);

    return () => window.clearTimeout(initialLoadTimer);
  }, [fetchListings]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-white">
      <MapSidebar
        listings={listings}
        selectedProperty={selectedProperty}
        onSelect={setSelectedProperty}
        onCloseDetail={() => setSelectedProperty(null)}
      />

      <div className="relative h-full flex-1">
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

        {authorityLinks.length ? (
          <nav
            aria-label="David Quinn Group authority links"
            className="pointer-events-auto absolute bottom-6 left-6 z-[700] hidden max-w-[min(620px,calc(100%-3rem))] border border-white/12 bg-black/82 p-3 shadow-2xl backdrop-blur md:block"
          >
            <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-4">
              {authorityLinks.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="group bg-[#050505] p-3 transition-colors hover:bg-white/[0.06]"
                >
                  <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#00ff80]/80">
                    {link.eyebrow}
                  </p>
                  <p className="mt-2 text-[10px] font-black uppercase leading-4 tracking-[0.12em] text-white/70 transition-colors group-hover:text-white">
                    {link.label}
                  </p>
                </Link>
              ))}
            </div>
          </nav>
        ) : null}

        {faqItems.length ? (
          <details className="absolute right-6 top-6 z-[700] hidden w-[min(420px,calc(100%-3rem))] border border-white/12 bg-black/82 p-4 shadow-2xl backdrop-blur md:block">
            <summary className="cursor-pointer list-none text-[10px] font-black uppercase tracking-[0.28em] text-[#00ff80]">
              REIE Authority FAQ
            </summary>
            <div className="mt-4 max-h-[52vh] space-y-4 overflow-auto pr-2">
              {faqItems.slice(0, 4).map((faq) => (
                <article key={faq.question} className="border-t border-white/10 pt-4">
                  <h2 className="text-[10px] font-black uppercase leading-5 tracking-[0.14em] text-white/80">
                    {faq.question}
                  </h2>
                  <p className="mt-2 text-[11px] leading-5 text-white/50">{faq.answer}</p>
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
