'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { List, Map as MapIcon } from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useState } from 'react';

import MapSidebar, { type MapSidebarListing } from '@/components/maps/MapSidebar';
import SelectedPropertyDrawer from '@/components/maps/SelectedPropertyDrawer';
import SearchControls, {
  buildSearchParams,
  getInitialSearchFilters,
  getSearchFiltersFromParams,
  hasActiveSearchFilters,
  type SearchFilters,
} from '@/components/search/SearchControls';
import type { SearchMapMeta } from '@/components/maps/SearchMap';
import type { FAQItem } from '@/lib/schema/faqSchema';

const MapInner = dynamic(() => import('@/components/maps/MapInner'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#030303]" />,
});

type UserTier = 'Public' | 'Contracted';
type MobileSearchView = 'list' | 'map';

type StrategyToggleDetail = {
  gateActive?: boolean;
};

type SearchInterfaceProps = {
  initialListings?: MapSidebarListing[];
  initialSearchMeta?: SearchMapMeta | null;
  authorityLinks?: SearchAuthorityLink[];
  faqItems?: FAQItem[];
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

function buildSearchUrl(filters: SearchFilters) {
  const params = buildSearchParams(filters);
  params.set('limit', '250');

  return `/api/search?${params.toString()}`;
}

function getBrowserFilters() {
  if (typeof window === 'undefined') return getInitialSearchFilters();
  return getSearchFiltersFromParams(new URLSearchParams(window.location.search));
}

function updateBrowserSearchUrl(filters: SearchFilters, mode: 'push' | 'replace' = 'push') {
  if (typeof window === 'undefined') return;

  const params = buildSearchParams(filters);
  const nextUrl = params.toString() ? `/search?${params.toString()}` : '/search';

  if (`${window.location.pathname}${window.location.search}` === nextUrl) return;
  window.history[mode === 'replace' ? 'replaceState' : 'pushState']({}, '', nextUrl);
}

export default function SearchInterface({
  initialListings = [],
  initialSearchMeta = null,
  authorityLinks = [],
  faqItems = [],
}: SearchInterfaceProps) {
  const [listings, setListings] = useState<MapSidebarListing[]>(initialListings);
  const [searchMeta, setSearchMeta] = useState<SearchMapMeta | null>(initialSearchMeta);
  const [filters, setFilters] = useState<SearchFilters>(() => getBrowserFilters());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<UserTier>('Public');
  const [mobileView, setMobileView] = useState<MobileSearchView>('list');
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
  const selectedProperty = useMemo(
    () => (visibleSelectedId ? visibleListings.find((listing) => listing.id === visibleSelectedId) || null : null),
    [visibleListings, visibleSelectedId],
  );

  useEffect(() => {
    const handleToggle = (event: Event) => {
      const customEvent = event as CustomEvent<StrategyToggleDetail>;
      setUserTier(getUserTier(customEvent.detail));
    };

    window.addEventListener('DQG_STRATEGY_TOGGLE', handleToggle);
    return () => window.removeEventListener('DQG_STRATEGY_TOGGLE', handleToggle);
  }, []);

  async function runSearch(nextFilters: SearchFilters, options: { updateUrl?: boolean; urlMode?: 'push' | 'replace' } = {}) {
    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(buildSearchUrl(nextFilters));
      const data = (await response.json()) as SearchApiResponse;
      const nextListings = normalizeListings(data.results);

      setListings(nextListings);
      setSearchMeta(data.meta || null);
      setSelectedId((current) => (current && nextListings.some((listing) => listing.id === current) ? current : null));
      if (options.updateUrl) updateBrowserSearchUrl(nextFilters, options.urlMode);

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

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runSearch(filters, { updateUrl: true });
  }

  function handleRemoveFilter(nextFilters: SearchFilters) {
    void runSearch(nextFilters, { updateUrl: true });
  }

  function handleReset() {
    const nextFilters = getInitialSearchFilters();

    setFilters(nextFilters);
    setListings(initialListings);
    setSearchMeta(initialSearchMeta);
    setSelectedId(null);
    setHoveredId(null);
    setSearchError(null);
    updateBrowserSearchUrl(nextFilters);
  }

  useEffect(() => {
    if (!hasActiveSearchFilters(filters)) return;

    const initialFilterTimer = window.setTimeout(() => {
      void runSearch(filters, { updateUrl: true, urlMode: 'replace' });
    }, 0);

    return () => window.clearTimeout(initialFilterTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const nextFilters = getBrowserFilters();
      setFilters(nextFilters);
      if (hasActiveSearchFilters(nextFilters)) {
        void runSearch(nextFilters, { updateUrl: false });
        return;
      }

      setListings(initialListings);
      setSearchMeta(initialSearchMeta);
      setSelectedId(null);
      setHoveredId(null);
      setSearchError(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialListings, initialSearchMeta]);

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
          listings={visibleListings}
          selectedId={visibleSelectedId}
          hoveredId={visibleHoveredId}
          onSelect={setSelectedId}
          onHover={setHoveredId}
          searchControls={searchControls}
          hasActiveFilters={hasActiveSearchFilters(filters)}
          isLoading={isSearching}
        />
      </div>

      <section className={`${mobileView === 'list' ? 'hidden md:block' : 'block'} relative min-h-0 min-w-0 flex-1 border-t border-white/15 md:h-full md:border-l md:border-t-0`}>
        <MapInner
          listings={visibleListings}
          selectedId={visibleSelectedId}
          setSelectedId={setSelectedId}
          hoveredId={visibleHoveredId}
          setHoveredId={setHoveredId}
          searchMeta={effectiveSearchMeta}
          userTier={userTier}
        />

        <div className="pointer-events-none absolute left-6 top-6 z-[700] hidden rounded-[8px] border border-white/12 bg-[#071017]/88 px-4 py-3 shadow-2xl backdrop-blur-md md:block">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Live REIE Map</p>
          <p className="mt-1 text-sm font-black uppercase tracking-[0.08em] text-white">
            {visibleListings.length} visible listings
          </p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/38">
            {isSearching ? 'Inventory updating' : effectiveSearchMeta?.source ? `${effectiveSearchMeta.source} source` : 'Map ready'}
          </p>
        </div>

        {selectedProperty ? <SelectedPropertyDrawer property={selectedProperty} onClose={() => setSelectedId(null)} /> : null}

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
