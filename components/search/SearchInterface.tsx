'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Loader2, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useState } from 'react';

import MapSidebar, { type MapSidebarListing } from '@/components/maps/MapSidebar';
import type { SearchMapMeta } from '@/components/maps/SearchMap';
import type { FAQItem } from '@/lib/schema/faqSchema';

const MapInner = dynamic(() => import('@/components/maps/MapInner'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#030303]" />,
});

type UserTier = 'Public' | 'Contracted';

type StrategyToggleDetail = {
  gateActive?: boolean;
};

type SearchInterfaceProps = {
  initialListings?: MapSidebarListing[];
  initialSearchMeta?: SearchMapMeta | null;
  authorityLinks?: SearchAuthorityLink[];
  faqItems?: FAQItem[];
};

type SearchFilters = {
  query: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  beds: string;
  baths: string;
  propertyType: string;
};

type SearchApiResponse = {
  results?: unknown;
  meta?: SearchMapMeta;
  source?: string;
  error?: string;
};

export type SearchAuthorityLink = {
  label: string;
  href: string;
  eyebrow: string;
};

function getUserTier(detail: StrategyToggleDetail | undefined): UserTier {
  return detail?.gateActive ? 'Contracted' : 'Public';
}

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
  return typeof value === 'boolean' ? value : null;
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

function getInitialFilters(): SearchFilters {
  return {
    query: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    propertyType: '',
  };
}

function setParam(params: URLSearchParams, key: string, value: string) {
  const trimmed = value.trim();
  if (trimmed) params.set(key, trimmed);
}

function buildSearchUrl(filters: SearchFilters) {
  const params = new URLSearchParams({ limit: '250' });

  setParam(params, 'q', filters.query);
  setParam(params, 'city', filters.city);
  setParam(params, 'minPrice', filters.minPrice);
  setParam(params, 'maxPrice', filters.maxPrice);
  setParam(params, 'beds', filters.beds);
  setParam(params, 'baths', filters.baths);
  setParam(params, 'propertyType', filters.propertyType);

  return `/api/search?${params.toString()}`;
}

export default function SearchInterface({
  initialListings = [],
  initialSearchMeta = null,
  authorityLinks = [],
  faqItems = [],
}: SearchInterfaceProps) {
  const [listings, setListings] = useState<MapSidebarListing[]>(initialListings);
  const [searchMeta, setSearchMeta] = useState<SearchMapMeta | null>(initialSearchMeta);
  const [filters, setFilters] = useState<SearchFilters>(() => getInitialFilters());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<UserTier>('Public');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const visibleListings = useMemo(() => {
    if (userTier === 'Contracted') return listings;
    return listings.filter((property) => !property.isPrivateExclusive);
  }, [listings, userTier]);

  const effectiveSearchMeta = useMemo<SearchMapMeta | null>(() => {
    if (!searchMeta) return null;

    return {
      ...searchMeta,
      accessLevel: searchMeta.accessLevel || (userTier === 'Contracted' ? 'contracted' : 'public'),
    };
  }, [searchMeta, userTier]);

  const visibleIds = useMemo(() => new Set(visibleListings.map((listing) => listing.id)), [visibleListings]);
  const visibleSelectedId = selectedId && visibleIds.has(selectedId) ? selectedId : null;
  const visibleHoveredId = hoveredId && visibleIds.has(hoveredId) ? hoveredId : null;

  useEffect(() => {
    const handleToggle = (event: Event) => {
      const customEvent = event as CustomEvent<StrategyToggleDetail>;
      setUserTier(getUserTier(customEvent.detail));
    };

    window.addEventListener('DQG_STRATEGY_TOGGLE', handleToggle);
    return () => window.removeEventListener('DQG_STRATEGY_TOGGLE', handleToggle);
  }, []);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(buildSearchUrl(filters));
      const data = (await response.json()) as SearchApiResponse;
      const nextListings = normalizeListings(data.results);

      setListings(nextListings);
      setSearchMeta(data.meta || null);
      setSelectedId((current) => (current && nextListings.some((listing) => listing.id === current) ? current : null));

      if (!response.ok) {
        setSearchError(data.error || 'Inventory search is temporarily unavailable.');
      }
    } catch {
      setListings([]);
      setSearchMeta(null);
      setSelectedId(null);
      setSearchError('Inventory search is temporarily unavailable.');
    } finally {
      setIsSearching(false);
    }
  }

  function handleReset() {
    setFilters(getInitialFilters());
    setListings(initialListings);
    setSearchMeta(initialSearchMeta);
    setSelectedId(null);
    setHoveredId(null);
    setSearchError(null);
  }

  const searchControls = (
    <form onSubmit={handleSearch} className="rounded-[8px] border border-white/10 bg-black/35 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
          <SlidersHorizontal size={13} aria-hidden="true" />
          Filters
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-white/10 text-white/52 transition hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          aria-label="Reset search filters"
        >
          <RotateCcw size={13} aria-hidden="true" />
        </button>
      </div>

      <label className="mt-3 block">
        <span className="sr-only">Search city, address, ZIP, or MLS</span>
        <input
          value={filters.query}
          onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
          placeholder="City, address, ZIP, MLS"
          className="h-10 w-full rounded-[6px] border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-white/30 focus:border-cyan-100/45"
        />
      </label>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <label>
          <span className="sr-only">Minimum price</span>
          <input
            inputMode="numeric"
            value={filters.minPrice}
            onChange={(event) => setFilters((current) => ({ ...current, minPrice: event.target.value }))}
            placeholder="Min price"
            className="h-10 w-full rounded-[6px] border border-white/10 bg-white/[0.06] px-3 text-xs font-bold text-white outline-none transition placeholder:text-white/30 focus:border-cyan-100/45"
          />
        </label>
        <label>
          <span className="sr-only">Maximum price</span>
          <input
            inputMode="numeric"
            value={filters.maxPrice}
            onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value }))}
            placeholder="Max price"
            className="h-10 w-full rounded-[6px] border border-white/10 bg-white/[0.06] px-3 text-xs font-bold text-white outline-none transition placeholder:text-white/30 focus:border-cyan-100/45"
          />
        </label>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        <select
          value={filters.beds}
          onChange={(event) => setFilters((current) => ({ ...current, beds: event.target.value }))}
          className="h-10 rounded-[6px] border border-white/10 bg-[#101720] px-2 text-xs font-black uppercase tracking-[0.04em] text-white outline-none transition focus:border-cyan-100/45"
          aria-label="Minimum bedrooms"
        >
          <option value="">Beds</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
        <select
          value={filters.baths}
          onChange={(event) => setFilters((current) => ({ ...current, baths: event.target.value }))}
          className="h-10 rounded-[6px] border border-white/10 bg-[#101720] px-2 text-xs font-black uppercase tracking-[0.04em] text-white outline-none transition focus:border-cyan-100/45"
          aria-label="Minimum bathrooms"
        >
          <option value="">Baths</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
        <select
          value={filters.propertyType}
          onChange={(event) => setFilters((current) => ({ ...current, propertyType: event.target.value }))}
          className="h-10 rounded-[6px] border border-white/10 bg-[#101720] px-2 text-xs font-black uppercase tracking-[0.04em] text-white outline-none transition focus:border-cyan-100/45"
          aria-label="Property type"
        >
          <option value="">Type</option>
          <option value="Residential">Res</option>
          <option value="Land">Land</option>
          <option value="Commercial">Comm</option>
          <option value="Multi-Family">Multi</option>
        </select>
      </div>

      <div className="mt-2 flex gap-2">
        <label className="min-w-0 flex-1">
          <span className="sr-only">City</span>
          <input
            value={filters.city}
            onChange={(event) => setFilters((current) => ({ ...current, city: event.target.value }))}
            placeholder="Exact city"
            className="h-10 w-full rounded-[6px] border border-white/10 bg-white/[0.06] px-3 text-xs font-bold text-white outline-none transition placeholder:text-white/30 focus:border-cyan-100/45"
          />
        </label>
        <button
          type="submit"
          disabled={isSearching}
          className="inline-flex h-10 w-11 shrink-0 items-center justify-center rounded-[6px] bg-cyan-100 text-[#061017] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          aria-label="Apply search filters"
        >
          {isSearching ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Search size={16} aria-hidden="true" />}
        </button>
      </div>

      {searchError ? <p className="mt-2 text-xs font-bold text-red-300">{searchError}</p> : null}
    </form>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-white">
      <MapSidebar
        listings={visibleListings}
        selectedId={visibleSelectedId}
        hoveredId={visibleHoveredId}
        onSelect={setSelectedId}
        onHover={setHoveredId}
        searchControls={searchControls}
      />

      <section className="relative h-full min-w-0 flex-1 border-l border-white/15">
        <MapInner
          listings={visibleListings}
          selectedId={visibleSelectedId}
          setSelectedId={setSelectedId}
          hoveredId={visibleHoveredId}
          setHoveredId={setHoveredId}
          searchMeta={effectiveSearchMeta}
          userTier={userTier}
        />

        {authorityLinks.length ? (
          <nav
            aria-label="Colorado real estate authority links"
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
              REIE Search FAQ
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
      </section>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/SearchInterface.tsx
