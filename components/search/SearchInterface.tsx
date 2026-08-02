'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AlertTriangle, List, Map as MapIcon, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, useEffect, useMemo, useState } from 'react';

import ContinueYourDecision from '@/components/ContinueYourDecision';
import FinancingConfidenceEducation from '@/components/FinancingConfidenceEducation';
import MapSidebar, { type MapSidebarListing } from '@/components/maps/MapSidebar';
import type { MapBounds } from '@/components/maps/MapInner';
import SelectedPropertyDrawer from '@/components/maps/SelectedPropertyDrawer';
import SearchControls, {
  buildSearchParams,
  getActiveFilterChips,
  getInitialSearchFilters,
  getSearchFiltersFromParams,
  hasActiveSearchFilters,
  type SearchFilters,
} from '@/components/search/SearchControls';
import type { SearchMapMeta } from '@/components/maps/SearchMap';
import { getJourneyMeasurementAttributes } from '@/lib/customerJourneyMeasurement';
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
  generatedAt?: string;
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

function normalizePhotoList(value: unknown) {
  if (!Array.isArray(value)) return null;

  const photos = value.flatMap((photo) => {
    if (!isRecord(photo)) return [];
    const url = toStringOrNull(photo.url);
    return url ? [{ url }] : [];
  });

  return photos.length > 0 ? photos : null;
}

function normalizeListing(value: unknown): MapSidebarListing | null {
  if (!isRecord(value)) return null;

  const id = toStringOrNull(value.id);
  if (!id) return null;

  const mainPhoto = toStringOrNull(value.mainPhoto) || toStringOrNull(value.image);
  const photos = normalizePhotoList(value.photos);

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
    status: toStringOrNull(value.status),
    lat: toNumberOrNull(value.lat),
    lng: toNumberOrNull(value.lng),
    photos,
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

function normalizeSearchMeta(data: SearchApiResponse) {
  if (!data.meta) return null;

  return {
    ...data.meta,
    generatedAt: data.meta.generatedAt || data.generatedAt,
  };
}

function getDiscoveryFilterLabel(hasFilters: boolean) {
  return hasFilters ? 'Focused view' : 'Open Colorado view';
}

function getCustomerSearchStatus(meta: SearchMapMeta | null) {
  if (meta?.health === 'degraded') return 'Fallback evidence';
  return 'Complete evidence';
}

function getSearchResultLabel(count: number) {
  if (count === 0) return 'No properties in this view';
  if (count === 1) return '1 property in this view';
  return `${count} properties in this view`;
}

function getMapMovementLabel(bounds: MapBounds, hasMoved: boolean) {
  if (!hasMoved || !bounds) return 'Map ready';
  return 'Map context viewed';
}

function getCriteriaLine(chips: Array<{ label: string }>) {
  if (chips.length === 0) return 'Open criteria';
  if (chips.length <= 2) return chips.map((chip) => chip.label).join(' / ');
  return `${chips.slice(0, 2).map((chip) => chip.label).join(' / ')} +${chips.length - 2}`;
}

function getEvidenceLabel(isSearching: boolean, isDegraded: boolean, hasZeroResults: boolean) {
  if (isSearching) return 'Updating results';
  if (hasZeroResults) return 'No matching properties';
  if (isDegraded) return 'Fallback evidence';
  return 'Complete evidence';
}

export default function SearchInterface({
  initialListings = [],
  initialSearchMeta = null,
  authorityLinks = [],
  faqItems = [],
}: SearchInterfaceProps) {
  const [listings, setListings] = useState<MapSidebarListing[]>(initialListings);
  const [searchMeta, setSearchMeta] = useState<SearchMapMeta | null>(initialSearchMeta);
  const [filters, setFilters] = useState<SearchFilters>(() => getInitialSearchFilters());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<UserTier>('Public');
  const [mobileView, setMobileView] = useState<MobileSearchView>('list');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lastMapBounds, setLastMapBounds] = useState<MapBounds>(null);
  const [hasMovedMap, setHasMovedMap] = useState(false);

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
  const hasFilters = hasActiveSearchFilters(filters);
  const mobileStatusLabel = isSearching
    ? 'Updating properties in view'
    : selectedProperty && mobileView === 'map'
      ? selectedProperty.address || 'Selected listing'
      : `${visibleListings.length} properties`;
  const activeFilterChips = useMemo(() => getActiveFilterChips(filters), [filters]);
  const hasZeroResults = !isSearching && visibleListings.length === 0;
  const isSearchDegraded = effectiveSearchMeta?.health === 'degraded' || Boolean(effectiveSearchMeta?.customerExperience?.providerDegraded);
  const searchResultLabel = getSearchResultLabel(visibleListings.length);
  const mapMovementLabel = getMapMovementLabel(lastMapBounds, hasMovedMap);
  const criteriaLine = getCriteriaLine(activeFilterChips);
  const evidenceLabel = getEvidenceLabel(isSearching, isSearchDegraded, hasZeroResults);
  const selectedPropertyLabel = selectedProperty?.address || 'No property selected';
  const workspaceModeLabel = mobileView === 'map' ? 'Map view' : 'List view';
  const searchStateAnnouncement = isSearching
    ? 'Search is updating.'
    : searchError
      ? searchError
      : `${searchResultLabel}. ${hasFilters ? `${activeFilterChips.length} active criteria.` : 'Open Colorado view.'}`;

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
      setSearchMeta(normalizeSearchMeta(data));
      setSelectedId((current) => (current && nextListings.some((listing) => listing.id === current) ? current : null));
      if (options.updateUrl) updateBrowserSearchUrl(nextFilters, options.urlMode);

      if (!response.ok) {
        setSearchError(data.error || 'We are having trouble updating the search. Try again shortly, or continue with an advisor if you would like help exploring options.');
      }
    } catch {
      setListings([]);
      setSearchMeta(null);
      setSelectedId(null);
      setSearchError('We are having trouble updating the search. Try again shortly, or continue with an advisor if you would like help exploring options.');
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

  function handleRemoveFilterKey(key: keyof SearchFilters) {
    const nextFilters = {
      ...filters,
      [key]: '',
    };

    setFilters(nextFilters);
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
    setHasMovedMap(false);
    updateBrowserSearchUrl(nextFilters);
  }

  function handleListSelect(id: string) {
    setSelectedId(id);

    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
      setMobileView('map');
    }
  }

  function handleMapSelect(id: string) {
    setSelectedId(id);
  }

  function handleWorkspaceKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Escape' || !selectedId) return;
    event.stopPropagation();
    setSelectedId(null);
    setHoveredId(null);
  }

  function handleBoundsChange(bounds: MapBounds) {
    setLastMapBounds(bounds);
    if (bounds) setHasMovedMap(true);
  }

  useEffect(() => {
    const browserFilters = getBrowserFilters();
    if (!hasActiveSearchFilters(browserFilters)) return;

    const initialFilterTimer = window.setTimeout(() => {
      setFilters(browserFilters);
      void runSearch(browserFilters, { updateUrl: true, urlMode: 'replace' });
    }, 0);

    return () => window.clearTimeout(initialFilterTimer);
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
  const discoveryFilterLabel = getDiscoveryFilterLabel(hasFilters);
  const discoveryCountLabel = visibleListings.length === 1 ? '1 property in view' : `${visibleListings.length} properties in view`;

  return (
    <div
      className="reie-search-experience-shell relative flex h-full w-full flex-col overflow-hidden bg-black text-white md:flex-row"
      data-testid="reie-search-interface"
      data-mobile-view={mobileView}
      data-selected-listing-id={visibleSelectedId || ''}
      data-hovered-listing-id={visibleHoveredId || ''}
      data-visible-listing-count={visibleListings.length}
      data-user-tier={userTier}
      data-search-generated-at={effectiveSearchMeta?.generatedAt || ''}
      data-search-source={effectiveSearchMeta?.source || 'initial'}
      data-search-status={getCustomerSearchStatus(effectiveSearchMeta)}
      data-search-access-level={effectiveSearchMeta?.accessLevel || (userTier === 'Contracted' ? 'contracted' : 'public')}
      data-search-filters-active={String(hasFilters)}
      data-search-active-filter-count={activeFilterChips.length}
      data-search-loading={String(isSearching)}
      data-search-zero-results={String(hasZeroResults)}
      data-search-degraded={String(isSearchDegraded)}
      data-search-map-movement={mapMovementLabel}
      data-search-preview-model="click-pinned"
      data-search-preview-hover-dependent="false"
      data-search-workspace-shell="persistent-search-workspace-shell"
      data-search-first-screen-hierarchy="decision-status-criteria-list-map-selection"
      data-search-property-context-restoration="deferred"
      data-search-map-visual-normalization="deferred"
      data-search-brokerage-disclosure-hold="EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING"
      data-search-persistence="false"
      onKeyDown={handleWorkspaceKeyDown}
    >
      <p className="sr-only" aria-live="polite" data-testid="reie-search-state-announcement">
        {searchStateAnnouncement}
      </p>
      <div
        className="reie-search-mobile-toolbar absolute left-3 right-3 top-3 z-[900] items-center justify-between gap-3"
        data-testid="reie-search-mobile-toolbar"
        data-mobile-view={mobileView}
        data-mobile-status={mobileStatusLabel}
        data-selected-listing-id={visibleSelectedId || ''}
      >
        <span
          className="reie-search-mobile-status-pill"
          data-testid="reie-search-mobile-status"
        >
          {mobileStatusLabel} / {activeFilterChips.length ? `${activeFilterChips.length} criteria` : 'open criteria'}
        </span>
        <div className="reie-search-mobile-toggle-group" aria-label="Search view mode">
          <button
            type="button"
            data-testid="reie-search-mobile-list-toggle"
            onClick={() => setMobileView('list')}
            className="reie-search-mobile-toggle-button"
            aria-label="Show listing list"
            aria-pressed={mobileView === 'list'}
          >
            <List size={13} aria-hidden="true" />
            List
          </button>
          <button
            type="button"
            data-testid="reie-search-mobile-map-toggle"
            onClick={() => setMobileView('map')}
            className="reie-search-mobile-toggle-button"
            aria-label="Show search map"
            aria-pressed={mobileView === 'map'}
          >
            <MapIcon size={13} aria-hidden="true" />
            Map
          </button>
        </div>
      </div>

      <div
        className="reie-search-list-pane"
        data-testid="reie-search-list-pane"
        data-mobile-view={mobileView}
        data-visible-listing-count={visibleListings.length}
        data-selected-listing-id={visibleSelectedId || ''}
        data-search-shell-region="list-and-criteria"
      >
        <section
          className="reie-search-discovery-intro"
          data-testid="reie-search-discovery-intro"
          data-discovery-listing-count={visibleListings.length}
          data-discovery-filter-state={hasFilters ? 'focused' : 'open'}
          data-search-shell-region="orientation"
          aria-labelledby="reie-search-decision-prompt"
        >
          <div className="reie-search-product-hero">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/76">Guided Property Search</p>
              <h2 id="reie-search-decision-prompt" className="mt-2 font-serif text-[1.85rem] font-black leading-[1.03] tracking-normal text-white">
                Which homes deserve your attention?
              </h2>
              <p className="sr-only">Explore Colorado homes with criteria, context, and confidence.</p>
              <p className="mt-2 max-w-[31rem] text-sm leading-6 text-white/60">
                Compare active inventory with criteria, list context, and map context before opening a property decision view.
              </p>
              <p className="sr-only">
                Start with the places, homes, or criteria that matter. Use the map and property details together, then refine as your priorities become clearer.
              </p>
            </div>
            <div className="reie-search-product-status" aria-label="Current search status">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/36">Properties</p>
                <p className="mt-1 text-xl font-black leading-none text-white" data-testid="reie-search-result-count">{visibleListings.length}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/36">View</p>
                <p className="mt-1 text-[12px] font-black uppercase leading-none text-cyan-100">{discoveryFilterLabel}</p>
              </div>
            </div>
          </div>

          <div
            className="reie-search-decision-strip"
            data-testid="reie-search-decision-strip"
            data-search-shell-hierarchy="decision-status-criteria-list-map-selection"
            data-search-result-label={searchResultLabel}
            data-search-criteria-summary={criteriaLine}
            data-search-mobile-view={mobileView}
            data-search-selected-property={selectedPropertyLabel}
          >
            {[
              ['Decision', 'Compare homes worth attention'],
              ['Results', isSearching ? 'Updating results' : searchResultLabel],
              ['Criteria', activeFilterChips.length ? criteriaLine : 'Open criteria'],
              ['Workspace', `${workspaceModeLabel} / map context`],
            ].map(([label, body]) => (
              <div key={label} className="reie-search-decision-strip-item" data-search-shell-step={label.toLowerCase()}>
                <p>{label}</p>
                <span>{body}</span>
              </div>
            ))}
          </div>

          <div
            className="reie-search-state-panel reie-search-product-state"
            data-testid="reie-search-state-panel"
            data-search-result-label={searchResultLabel}
            data-search-degraded={String(isSearchDegraded)}
            data-search-map-movement={mapMovementLabel}
            data-search-zero-results={String(hasZeroResults)}
            data-search-shell-region="result-status"
          >
            <div>
              <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/72">
                <SlidersHorizontal size={12} aria-hidden="true" />
                Search Summary
              </p>
              <p className="mt-1 text-[11px] font-bold leading-5 text-white/58">
                {searchResultLabel}. {activeFilterChips.length ? criteriaLine : 'Start broad, then refine.'}
              </p>
            </div>
            <div className="grid gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white/46 sm:text-right">
              <span>{activeFilterChips.length ? `${activeFilterChips.length} active criteria` : 'Open criteria'}</span>
              <span>List compares properties. Map shows geographic context.</span>
              <span className={isSearchDegraded ? 'text-amber-100/82' : 'text-cyan-100/70'}>{evidenceLabel}</span>
              <span className="sr-only">Map movement preserves this result set until criteria change</span>
            </div>
          </div>

          <div
            className="reie-search-workspace-summary"
            data-testid="reie-search-workspace-summary"
            data-search-result-label={searchResultLabel}
            data-search-criteria-summary={criteriaLine}
            data-search-evidence-state={evidenceLabel}
            data-search-active-filter-count={activeFilterChips.length}
            data-search-shell-region="active-criteria"
          >
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/38">Current Criteria</p>
              <p className="mt-1 truncate text-[12px] font-black uppercase tracking-[0.08em] text-white/76">{criteriaLine}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/38">Evidence</p>
              <p className={`mt-1 truncate text-[12px] font-black uppercase tracking-[0.08em] ${isSearchDegraded || hasZeroResults ? 'text-amber-100/86' : 'text-cyan-100/76'}`}>
                {evidenceLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="reie-search-summary-clear"
              data-testid="reie-search-summary-clear"
            >
              <RotateCcw size={12} aria-hidden="true" />
              Clear
            </button>
          </div>

          {activeFilterChips.length ? (
            <div className="reie-search-summary-chips" aria-label="Current active search criteria" data-testid="reie-search-summary-active-criteria">
              {activeFilterChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => handleRemoveFilterKey(chip.key)}
                  data-testid="reie-search-summary-active-chip"
                  data-search-filter-key={chip.key}
                  data-search-filter-label={chip.label}
                  className="inline-flex max-w-full items-center gap-1 rounded-[6px] border border-cyan-100/20 bg-cyan-100/[0.08] px-2.5 py-1.5 text-[10px] font-black uppercase leading-none tracking-[0.08em] text-cyan-50 transition hover:border-cyan-100/45 hover:bg-cyan-100/[0.13] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                  aria-label={`Remove ${chip.label}`}
                  title={`Remove ${chip.label}`}
                >
                  <span className="truncate">{chip.label}</span>
                  <span aria-hidden="true">x</span>
                </button>
              ))}
            </div>
          ) : null}

          <ol className="reie-search-orientation" data-testid="reie-search-orientation" aria-label="How to begin guided search" data-search-shell-region="workspace-steps">
            <li>
              <span>Refine</span>
              Start with place or a specific property.
            </li>
            <li>
              <span>Compare</span>
              Use the list for property alternatives.
            </li>
            <li>
              <span>Context</span>
              Open Property Intelligence when a home still matches your stated criteria.
            </li>
          </ol>

          <div
            className="reie-search-confidence-framework"
            data-testid="reie-buyer-search-confidence-framework"
            data-buyer-confidence-framework="known-compare-verify-ask-next"
            data-buyer-confidence-ai="false"
            data-buyer-confidence-gis="false"
            data-buyer-confidence-provider-activation="false"
          >
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
                Decision Framework
                <span className="text-white/34 transition group-open:rotate-45">+</span>
              </summary>
              <div className="mt-3 grid gap-2 sm:grid-cols-5">
                {[
                  ['Known', 'Start with the facts the listing and search view can show.'],
                  ['Compare', 'Use map, list, market, and property context together.'],
                  ['Verify', 'Carry forward cost, condition, timing, and records questions.'],
                  ['Ask', 'Open the property page before submitting focused questions.'],
                  ['Next', 'Tour, continue search, or review the market when confidence is not ready.'],
                ].map(([label, body]) => (
                  <article key={label} data-testid="reie-buyer-search-confidence-step">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/72">{label}</p>
                    <p className="mt-1 text-[11px] font-bold leading-5 text-white/52">{body}</p>
                  </article>
                ))}
              </div>
              <div className="mt-4">
                <FinancingConfidenceEducation surface="search" compact />
              </div>
            </details>
          </div>

          {isSearchDegraded ? (
            <div
              className="reie-search-safe-status"
              role="status"
              data-testid="reie-search-degraded-status"
              data-search-health={effectiveSearchMeta?.health || ''}
              data-search-provider-degraded={String(Boolean(effectiveSearchMeta?.customerExperience?.providerDegraded))}
            >
              <AlertTriangle size={14} aria-hidden="true" />
              <span>Search is using a safe fallback. Results remain usable, but available evidence may be limited.</span>
            </div>
          ) : null}
          {hasZeroResults ? (
            <div className="reie-search-recovery-panel" data-testid="reie-search-zero-result-recovery">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">No matching properties</p>
              <p className="mt-2 text-xs font-bold leading-5 text-white/56">
                Broaden the criteria, remove one active chip, or clear the search to return to the open Colorado view.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-3 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[6px] border border-cyan-100/28 bg-cyan-100/[0.08] px-3 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-100/55 hover:bg-cyan-100/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                data-testid="reie-search-zero-result-clear"
              >
                <RotateCcw size={12} aria-hidden="true" />
                Clear Search
              </button>
            </div>
          ) : null}
        </section>

        <MapSidebar
          listings={visibleListings}
          selectedId={visibleSelectedId}
          hoveredId={visibleHoveredId}
          onSelect={handleListSelect}
          onHover={setHoveredId}
          searchControls={searchControls}
          hasActiveFilters={hasFilters}
          isLoading={isSearching}
          onClearSearch={handleReset}
          continuityContent={
            <div className="reie-search-continuation-stack">
              <nav
                className="reie-search-journey-nav"
                aria-label="Continue from search"
                data-testid="cep-navigation-search-journey"
                data-cep-measurement-ready="true"
                data-cep-measurement-active="false"
              >
                {[
                  { label: 'Market Context', href: '/market', action: 'view-market' as const, destination: 'market' as const },
                  { label: 'Seller Review', href: '/sell', action: 'request-seller-review' as const, destination: 'seller' as const },
                  { label: 'Ask an Advisor', href: '/contact', action: 'ask-property-question' as const, destination: 'inquiry' as const },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="reie-decision-link reie-decision-link--secondary inline-flex min-h-10 items-center justify-center rounded-[6px] px-3 py-2 text-center text-[10px] font-black uppercase tracking-[0.12em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                    {...getJourneyMeasurementAttributes({
                      surface: 'search-continuity',
                      stage: 'search',
                      action: item.action,
                      destination: item.destination,
                    })}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <ContinueYourDecision
                stage="search"
                cameFrom="Homepage, market context, or direct search"
                currentDecision="Choose which properties deserve closer review."
                whyHere="Search keeps active inventory, criteria, map context, and property links together before you rely on any single listing."
                nextStep="Open a property decision view or broaden into market context."
                links={[
                  { label: 'Market Context', href: '/market', note: 'Compare city context' },
                  { label: 'View Property', href: visibleListings[0] ? `/properties/${visibleListings[0].id}` : '/search', note: 'Open listing detail' },
                  { label: 'Ask an Advisor', href: '/contact', note: 'Bring focused questions' },
                ]}
              />
              <div className="reie-search-continuity" data-testid="reie-search-grand-plan-continuity">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Build on What Matters</p>
                  <p className="mt-1 text-xs leading-5 text-white/58">
                    If you completed your Grand Plan, use those priorities as a guide. Search does not automatically apply your plan, so you remain in control.
                  </p>
                </div>
                <Link href="/grand-plan" className="reie-search-continuity-link" data-testid="reie-search-grand-plan-link">
                  Create Your Grand Plan
                </Link>
              </div>
            </div>
          }
        />
      </div>

      <section
        className="reie-search-map-pane relative min-h-0 min-w-0 flex-1 border-t border-white/15 md:border-l md:border-t-0"
        data-testid="reie-search-map-pane"
        data-mobile-view={mobileView}
        data-selected-listing-id={visibleSelectedId || ''}
        data-search-source={effectiveSearchMeta?.source || 'initial'}
        data-search-shell-region="map-and-preview"
      >
        <MapInner
          listings={visibleListings}
          onBoundsChange={handleBoundsChange}
          selectedId={visibleSelectedId}
          setSelectedId={handleMapSelect}
          hoveredId={visibleHoveredId}
          setHoveredId={setHoveredId}
          searchMeta={effectiveSearchMeta}
          userTier={userTier}
        />

        <div className="pointer-events-none absolute left-6 top-6 z-[700] hidden rounded-[8px] border border-white/10 bg-[#071017]/84 px-4 py-3 shadow-2xl backdrop-blur-md md:block">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Colorado Map</p>
          <p className="mt-1 text-sm font-black uppercase tracking-[0.08em] text-white">
            {discoveryCountLabel}
          </p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/38">
            {isSearching ? 'Updating properties in view' : 'Geographic context'}
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
                  className="reie-decision-link reie-decision-link--card group rounded-[6px] border border-white/10 bg-white/[0.055] p-3 transition-colors hover:border-cyan-100/35 hover:bg-white/[0.085]"
                  data-testid="reie-search-authority-link"
                  {...getJourneyMeasurementAttributes({
                    surface: 'search-map-authority-links',
                    stage: 'search',
                    action: link.href.startsWith('/market') ? 'view-market' : 'continue-journey',
                    destination: link.href.startsWith('/market') ? 'market' : 'search',
                  })}
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
              Search Guidance
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
