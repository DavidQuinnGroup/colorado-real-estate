'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AlertTriangle, List, Map as MapIcon, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, useEffect, useMemo, useState } from 'react';

import ContinueYourDecision from '@/components/ContinueYourDecision';
import FinancingConfidenceEducation from '@/components/FinancingConfidenceEducation';
import MapSidebar, { type MapSidebarListing } from '@/components/maps/MapSidebar';
import type { MapBounds } from '@/components/maps/MapInner';
import ProfessionalHandoffCohesionPanel from '@/components/ProfessionalHandoffCohesionPanel';
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
import {
  CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_QUERY_LENGTH,
  CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS,
  CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MIN_SELECTIONS,
  CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_ROUTE,
} from '@/lib/property/customerControlledComparison';
import { buildSearchDiscoveryIntelligence } from '@/lib/searchDiscoveryIntelligence';
import { buildSearchMapIntelligencePresentation } from '@/lib/searchMapLocalTrustAdvancement';
import { parseSearchReturnContext } from '@/lib/search/searchReturnContext';

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

function updateBrowserSearchUrl(filters: SearchFilters, mode: 'push' | 'replace' = 'push', preserveComparison = true) {
  if (typeof window === 'undefined') return;

  const params = buildSearchParams(filters);
  const compareIds = new URLSearchParams(window.location.search).get('compareIds');
  if (preserveComparison && compareIds) params.set('compareIds', compareIds);
  const nextUrl = params.toString() ? `/search?${params.toString()}` : '/search';

  if (`${window.location.pathname}${window.location.search}` === nextUrl) return;
  window.history[mode === 'replace' ? 'replaceState' : 'pushState']({}, '', nextUrl);
}

function parseComparisonIdsFromParams(params: URLSearchParams) {
  const rawValue = params.get('compareIds') || '';
  const seen = new Set<string>();
  return rawValue
    .split(',')
    .map((value) => value.trim())
    .filter((value) => /^[A-Za-z0-9._~-]{1,160}$/.test(value))
    .filter((value) => {
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    })
    .slice(0, CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS);
}

function getBrowserComparisonIds() {
  if (typeof window === 'undefined') return [];
  return parseComparisonIdsFromParams(new URLSearchParams(window.location.search));
}

function buildSearchUrlWithComparisonState(filters: SearchFilters, compareIds: string[]) {
  const params = buildSearchParams(filters);
  if (compareIds.length) params.set('compareIds', compareIds.join(','));
  const query = params.toString();
  return query ? `/search?${query}` : '/search';
}

function updateBrowserComparisonState(filters: SearchFilters, compareIds: string[]) {
  if (typeof window === 'undefined') return true;

  const nextUrl = buildSearchUrlWithComparisonState(filters, compareIds);
  if (nextUrl.length > CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_QUERY_LENGTH) return false;
  window.history.replaceState({}, '', nextUrl);
  return true;
}

function getPropertyComparisonHref(compareIds: string[]) {
  const canonicalIds = [...compareIds].sort((left, right) => left.localeCompare(right));
  return `${CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_ROUTE}?ids=${encodeURIComponent(canonicalIds.join(','))}`;
}

function getBrowserSearchReturnContext() {
  if (typeof window === 'undefined') return null;
  return parseSearchReturnContext(new URLSearchParams(window.location.search));
}

function getVisibleSelectionId(listings: MapSidebarListing[], selectedPropertyId: string | null) {
  if (!selectedPropertyId) return null;
  return listings.some((listing) => listing.id === selectedPropertyId && !listing.isPrivateExclusive) ? selectedPropertyId : null;
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

function getDecisionConfidenceLabel(isSearching: boolean, isDegraded: boolean, hasZeroResults: boolean, hasFilters: boolean) {
  if (isSearching) return 'Updating';
  if (hasZeroResults) return 'Insufficient for comparison';
  if (isDegraded) return 'Useful with fallback limits';
  if (hasFilters) return 'Useful for focused comparison';
  return 'Useful for broad orientation';
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
  const [compareIds, setCompareIds] = useState<string[]>(() => getBrowserComparisonIds());
  const [comparisonNotice, setComparisonNotice] = useState<string | null>(null);
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
  const decisionConfidenceLabel = getDecisionConfidenceLabel(isSearching, isSearchDegraded, hasZeroResults, hasFilters);
  const searchStateAnnouncement = isSearching
    ? 'Search is updating.'
    : searchError
      ? searchError
      : `${searchResultLabel}. ${hasFilters ? `${activeFilterChips.length} active criteria.` : 'Open Colorado view.'}`;
  const comparisonHref = compareIds.length >= CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MIN_SELECTIONS ? getPropertyComparisonHref(compareIds) : null;
  const comparisonCountLabel = `${compareIds.length}-${CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS} selected homes`;

  useEffect(() => {
    const handleToggle = (event: Event) => {
      const customEvent = event as CustomEvent<StrategyToggleDetail>;
      setUserTier(getUserTier(customEvent.detail));
    };

    window.addEventListener('DQG_STRATEGY_TOGGLE', handleToggle);
    return () => window.removeEventListener('DQG_STRATEGY_TOGGLE', handleToggle);
  }, []);

  async function runSearch(
    nextFilters: SearchFilters,
    options: { updateUrl?: boolean; urlMode?: 'push' | 'replace'; restoreSelectedId?: string | null } = {},
  ) {
    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(buildSearchUrl(nextFilters));
      const data = (await response.json()) as SearchApiResponse;
      const nextListings = normalizeListings(data.results);

      setListings(nextListings);
      setSearchMeta(normalizeSearchMeta(data));
      setSelectedId((current) => {
        const requested = getVisibleSelectionId(nextListings, options.restoreSelectedId || null);
        if (requested) return requested;
        return current && nextListings.some((listing) => listing.id === current) ? current : null;
      });
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
      setCompareIds([]);
      setComparisonNotice(null);
      setHasMovedMap(false);
    updateBrowserSearchUrl(nextFilters, 'push', false);
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

  function handleToggleComparison(propertyId: string) {
    setComparisonNotice(null);
    setCompareIds((currentIds) => {
      const exists = currentIds.includes(propertyId);
      const nextIds = exists ? currentIds.filter((id) => id !== propertyId) : [...currentIds, propertyId];

      if (!exists && currentIds.length >= CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS) {
        setComparisonNotice('Choose up to three homes for this comparison. Remove one before adding another.');
        return currentIds;
      }

      if (!updateBrowserComparisonState(filters, nextIds)) {
        setComparisonNotice('The current search link is too large to add another comparison selection safely.');
        return currentIds;
      }

      return nextIds;
    });
  }

  useEffect(() => {
    const browserFilters = getBrowserFilters();
    const returnContext = getBrowserSearchReturnContext();

    const initialReturnContextTimer = window.setTimeout(() => {
      if (returnContext?.view) setMobileView(returnContext.view);

      if (!hasActiveSearchFilters(browserFilters)) {
        setSelectedId(getVisibleSelectionId(initialListings, returnContext?.selectedPropertyId || null));
        return;
      }

      setFilters(browserFilters);
      void runSearch(browserFilters, {
        updateUrl: !returnContext,
        urlMode: 'replace',
        restoreSelectedId: returnContext?.selectedPropertyId || null,
      });
    }, 0);

    return () => window.clearTimeout(initialReturnContextTimer);
  }, [initialListings]);

  useEffect(() => {
    const handlePopState = () => {
      const nextFilters = getBrowserFilters();
      const returnContext = getBrowserSearchReturnContext();
      setCompareIds(parseComparisonIdsFromParams(new URLSearchParams(window.location.search)));
      if (returnContext?.view) setMobileView(returnContext.view);
      setFilters(nextFilters);
      if (hasActiveSearchFilters(nextFilters)) {
        void runSearch(nextFilters, { updateUrl: false, restoreSelectedId: returnContext?.selectedPropertyId || null });
        return;
      }

      setListings(initialListings);
      setSearchMeta(initialSearchMeta);
      setSelectedId(getVisibleSelectionId(initialListings, returnContext?.selectedPropertyId || null));
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
  const searchDiscoveryIntelligence = buildSearchDiscoveryIntelligence({
    visibleListingCount: visibleListings.length,
    activeCriteriaCount: activeFilterChips.length,
    criteriaSummary: criteriaLine,
    evidenceLabel,
    hasZeroResults,
    isDegraded: isSearchDegraded,
    selectedPropertyLabel,
  });
  const mappedListingCount = visibleListings.filter((listing) => Number.isFinite(listing.lat) && Number.isFinite(listing.lng)).length;
  const searchMapIntelligence = buildSearchMapIntelligencePresentation({
    visibleListingCount: visibleListings.length,
    mappedListingCount,
    selectedPropertyLabel,
    generatedAt: effectiveSearchMeta?.generatedAt || null,
  });

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
      data-search-discovery-intelligence={searchDiscoveryIntelligence.status}
      data-search-discovery-cue-count={searchDiscoveryIntelligence.cues.length}
      data-search-discovery-ranking={String(searchDiscoveryIntelligence.protectedBoundaries.ranking)}
      data-search-discovery-scoring={String(searchDiscoveryIntelligence.protectedBoundaries.scoring)}
      data-search-discovery-recommendation={String(searchDiscoveryIntelligence.protectedBoundaries.recommendation)}
      data-search-discovery-suitability-inference={String(searchDiscoveryIntelligence.protectedBoundaries.suitabilityInference)}
      data-search-discovery-protected-class-inference={String(searchDiscoveryIntelligence.protectedBoundaries.protectedClassInference)}
      data-search-discovery-hidden-personalization={String(searchDiscoveryIntelligence.protectedBoundaries.hiddenPersonalization)}
      data-search-discovery-persistence={String(searchDiscoveryIntelligence.protectedBoundaries.persistence)}
      data-search-discovery-telemetry={String(searchDiscoveryIntelligence.protectedBoundaries.telemetry)}
      data-search-discovery-provider-activation={String(searchDiscoveryIntelligence.protectedBoundaries.providerActivation)}
      data-search-discovery-api-change={String(searchDiscoveryIntelligence.protectedBoundaries.searchApiChange)}
      data-search-discovery-map-behavior-change={String(searchDiscoveryIntelligence.protectedBoundaries.mapBehaviorChange)}
      data-search-map-local-trust-advancement={searchMapIntelligence.status}
      data-search-map-intelligence-cue-count={searchMapIntelligence.cues.length}
      data-search-map-intelligence-methodology-href={searchMapIntelligence.methodologyHref}
      data-search-map-intelligence-api-change={String(searchMapIntelligence.protectedBoundaries.searchApiChange)}
      data-search-map-intelligence-map-behavior-change={String(searchMapIntelligence.protectedBoundaries.mapBehaviorChange)}
      data-search-map-intelligence-ranking={String(searchMapIntelligence.protectedBoundaries.ranking)}
      data-search-map-intelligence-scoring={String(searchMapIntelligence.protectedBoundaries.scoring)}
      data-search-map-intelligence-persistence={String(searchMapIntelligence.protectedBoundaries.persistence)}
      data-search-map-intelligence-telemetry={String(searchMapIntelligence.protectedBoundaries.telemetry)}
      data-search-map-intelligence-provider-activation={String(searchMapIntelligence.protectedBoundaries.providerActivation)}
      data-search-workspace-shell="persistent-search-workspace-shell"
      data-search-first-screen-hierarchy="decision-status-criteria-list-map-selection"
      data-search-property-context-restoration="deferred"
      data-search-return-context-handoff="bounded-url-and-history-state"
      data-search-compare-ids-state="browser-url-only"
      data-search-compare-ids-api-param="false"
      data-search-compare-ids-count={compareIds.length}
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

          <div
            className="reie-search-state-panel"
            data-testid="property-shortlist-control"
            data-property-shortlist-count={compareIds.length}
            data-property-shortlist-max={CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS}
            data-property-shortlist-url-state="compareIds"
            data-property-shortlist-search-api-param="false"
            data-property-shortlist-customer-controlled="true"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Comparison Shortlist</p>
                <p className="mt-1 text-xs font-bold leading-5 text-white/58">
                  {comparisonCountLabel}. Add homes from the selected property panel; map and list selection do not add homes automatically.
                </p>
                {comparisonNotice ? (
                  <p className="mt-2 text-[11px] font-bold leading-5 text-amber-100" role="status" data-testid="property-shortlist-notice">
                    {comparisonNotice}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCompareIds([]);
                    setComparisonNotice(null);
                    updateBrowserComparisonState(filters, []);
                  }}
                  className="inline-flex min-h-10 items-center justify-center rounded-[6px] border border-white/12 px-3 text-[10px] font-black uppercase tracking-[0.12em] text-white/58 transition hover:border-white/28 hover:text-white disabled:cursor-not-allowed disabled:text-white/24"
                  disabled={compareIds.length === 0}
                  data-testid="property-shortlist-clear"
                >
                  Clear
                </button>
                {comparisonHref ? (
                  <Link
                    href={comparisonHref}
                    className="inline-flex min-h-10 items-center justify-center rounded-[6px] bg-cyan-100 px-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#061017] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                    data-testid="property-shortlist-open-comparison"
                    data-property-shortlist-href={comparisonHref}
                  >
                    Open comparison
                  </Link>
                ) : (
                  <span
                    className="inline-flex min-h-10 items-center justify-center rounded-[6px] border border-white/10 bg-white/[0.035] px-3 text-[10px] font-black uppercase tracking-[0.12em] text-white/34"
                    data-testid="property-shortlist-open-disabled"
                  >
                    Add one more
                  </span>
                )}
              </div>
            </div>
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

          <details
            className="reie-search-guidance-disclosure"
            data-testid="reie-search-premium-guidance-disclosure"
            data-search-first-scan-guidance-placement="progressive-disclosure-before-list"
          >
            <summary>
              Search guidance, evidence boundaries, and map context
              <span aria-hidden="true">+</span>
            </summary>
            <section
              className="reie-search-confidence-framework"
              data-testid="search-discovery-intelligence-advancement"
              data-search-discovery-status={searchDiscoveryIntelligence.status}
              data-search-discovery-cues={searchDiscoveryIntelligence.cues.length}
              data-search-discovery-current-results={visibleListings.length}
              data-search-discovery-active-criteria={activeFilterChips.length}
              data-search-discovery-no-ranking={String(!searchDiscoveryIntelligence.protectedBoundaries.ranking)}
              data-search-discovery-no-hidden-personalization={String(!searchDiscoveryIntelligence.protectedBoundaries.hiddenPersonalization)}
              data-search-discovery-no-persistence={String(!searchDiscoveryIntelligence.protectedBoundaries.persistence)}
              data-search-discovery-no-telemetry={String(!searchDiscoveryIntelligence.protectedBoundaries.telemetry)}
            >
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Discovery Intelligence</p>
              <h2 className="mt-2 font-serif text-2xl font-black leading-tight tracking-normal text-white">
                What does this search view make available to inspect next?
              </h2>
              <p className="mt-2 max-w-[36rem] text-xs font-bold leading-5 text-white/56">{searchDiscoveryIntelligence.summary}</p>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {searchDiscoveryIntelligence.cues.map((cue) => (
                <Link
                  key={cue.key}
                  href={cue.href}
                  className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3 text-white transition hover:border-cyan-100/28 hover:bg-cyan-100/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                  data-testid="search-discovery-intelligence-cue"
                  data-search-discovery-cue={cue.key}
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/72">{cue.label}</p>
                  <p className="mt-2 text-[11px] font-bold leading-5 text-white/64">
                    <span className="text-white/88">Fact:</span> {cue.fact}
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-white/50">
                    <span className="font-bold text-white/72">Interpretation:</span> {cue.interpretation}
                  </p>
                  <p className="mt-2 border-t border-white/10 pt-2 text-[11px] font-bold leading-5 text-white/54">
                    {cue.nextStep}
                  </p>
                </Link>
              ))}
            </div>
            <p className="mt-4 text-[11px] font-bold leading-5 text-white/44">
              Discovery cues do not rank homes, score places, infer protected preferences, save a profile, or personalize hidden results.
            </p>
            </section>

            <section
              className="reie-search-confidence-framework"
              data-testid="dxt-2-search-decision-workspace-depth"
              data-dxt-2-search-workspace-depth="implemented"
              data-dxt-2-search-workspace-runtime-scope="components/search/SearchInterface.tsx"
              data-dxt-2-search-workspace-existing-evidence-only="true"
              data-dxt-2-search-workspace-api-change="false"
              data-dxt-2-search-workspace-ranking-change="false"
              data-dxt-2-search-workspace-map-provider-change="false"
              data-dxt-2-search-workspace-provider-activation="false"
              data-dxt-2-search-workspace-url-state-change="false"
              data-dxt-2-search-workspace-hidden-context="false"
              data-dxt-2-search-workspace-persistence="false"
              data-dxt-2-search-workspace-telemetry="false"
              data-dxt-2-search-workspace-ai="false"
              aria-labelledby="dxt-2-search-decision-question"
            >
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Search Decision Readiness</p>
                <h2 id="dxt-2-search-decision-question" className="mt-2 font-serif text-2xl font-black leading-tight tracking-normal text-white">
                  Do these results give me enough reliable context to decide what to inspect, compare, refine, or open next?
                </h2>
                <p className="mt-2 max-w-[36rem] text-xs font-bold leading-5 text-white/56">
                  Use the visible criteria, current inventory, and map/list evidence as a preparation layer before relying on any single property.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3" data-testid="dxt-2-search-readiness-summary">
                {[
                  ['Visible Criteria', activeFilterChips.length ? criteriaLine : 'Open criteria'],
                  ['Evidence Posture', evidenceLabel],
                  ['Confidence', decisionConfidenceLabel],
                ].map(([label, body]) => (
                  <article key={label} className="rounded-[8px] border border-white/10 bg-black/18 p-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/38">{label}</p>
                    <p className="mt-1 text-[12px] font-black uppercase leading-5 tracking-[0.08em] text-white/76">{body}</p>
                  </article>
                ))}
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <article className="rounded-[8px] bg-white/[0.035] p-3" data-testid="dxt-2-search-evidence-available">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">Evidence Available Now</p>
                  <ul className="mt-2 space-y-1.5 text-[11px] font-bold leading-5 text-white/56">
                    <li>{searchResultLabel} from the current public Search result set.</li>
                    <li>{activeFilterChips.length ? `${activeFilterChips.length} visible criteria are shaping this view.` : 'No visible criteria are narrowing the open Colorado view.'}</li>
                    <li>Listing cards expose public facts such as price, location, beds, baths, square footage, status, and property type where available.</li>
                    <li>List and map context can be compared before opening a Property decision view.</li>
                  </ul>
                </article>

                <article className="rounded-[8px] bg-white/[0.035] p-3" data-testid="dxt-2-search-evidence-missing">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-amber-100/78">Evidence Not Available From Search</p>
                  <ul className="mt-2 space-y-1.5 text-[11px] font-bold leading-5 text-white/56">
                    <li>Condition, inspection findings, records, disclosures, HOA details, insurance, taxes, and total ownership costs still require verification.</li>
                    <li>Search does not determine affordability, financing readiness, whether a property is right for you, appreciation, safety, school quality, or investment fit.</li>
                    <li>Provider or fallback limits should be treated as evidence boundaries, not as property recommendations.</li>
                  </ul>
                </article>
              </div>

              <div className="grid gap-3 sm:grid-cols-3" data-testid="dxt-2-search-comparison-thresholds">
                <article className="rounded-[8px] border border-cyan-100/12 bg-cyan-100/[0.055] p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/72">Compare</p>
                  <p className="mt-1 text-[11px] font-bold leading-5 text-white/58">
                    Compare visible facts and map context. Do not treat order, position, or visual prominence as a ranking.
                  </p>
                </article>
                <article className="rounded-[8px] border border-cyan-100/12 bg-cyan-100/[0.055] p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/72">Refine</p>
                  <p className="mt-1 text-[11px] font-bold leading-5 text-white/58">
                    Refine when the current results are too broad, too narrow, or missing the criteria you can clearly name.
                  </p>
                </article>
                <article className="rounded-[8px] border border-cyan-100/12 bg-cyan-100/[0.055] p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/72">Open Next</p>
                  <p className="mt-1 text-[11px] font-bold leading-5 text-white/58">
                    Open a Property view when a result still fits your visible criteria and you can name what remains to verify.
                  </p>
                </article>
              </div>

              <p className="text-[11px] font-bold leading-5 text-white/48" data-testid="dxt-2-search-readiness-boundary">
                Confidence here means the Search view is organized enough to guide the next comparison question. It is not a score,
                recommendation, decision about which property you should choose, valuation opinion, financing conclusion, or professional advice.
              </p>
            </div>
            </section>

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
            <section
              className="reie-search-state-panel"
              data-testid="search-map-intelligence-presentation"
              data-search-map-local-trust-status={searchMapIntelligence.status}
              data-search-map-representation={searchMapIntelligence.representation}
              data-search-map-continuity-path={searchMapIntelligence.continuityPath.join(' -> ')}
            >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
                  {searchMapIntelligence.title}
                </p>
                <p className="mt-2 text-xs font-bold leading-5 text-white/56">
                  {searchMapIntelligence.mapListRelationship}
                </p>
              </div>
              <Link
                href={searchMapIntelligence.methodologyHref}
                className="inline-flex min-h-8 shrink-0 items-center justify-center rounded-[6px] border border-cyan-100/24 px-2.5 text-[9px] font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-100/48 hover:bg-cyan-100/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                data-testid="search-map-intelligence-methodology-link"
              >
                Sources
              </Link>
            </div>
            <div className="mt-3 grid gap-2">
              {searchMapIntelligence.cues.map((cue) => (
                <article key={cue.label} className="rounded-[6px] bg-black/20 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/38">{cue.label}</p>
                  <p className="mt-1 text-[11px] font-bold leading-5 text-white/52">{cue.body}</p>
                </article>
              ))}
            </div>
            <p className="mt-3 text-[11px] font-bold leading-5 text-white/44">
              {searchMapIntelligence.source} {searchMapIntelligence.limitation}
            </p>
            </section>
          </details>
        </section>

        <MapSidebar
          listings={visibleListings}
          selectedId={visibleSelectedId}
          hoveredId={visibleHoveredId}
          onSelect={handleListSelect}
          onHover={setHoveredId}
          searchControls={searchControls}
          evidenceLabel={evidenceLabel}
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
                  { label: 'Prepare Next Conversation', href: '/contact#advisory-readiness', action: 'ask-property-question' as const, destination: 'inquiry' as const },
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
                    {...(item.href === '/contact#advisory-readiness'
                      ? {
                          'data-advisory-handoff-value-activation': 'true',
                          'data-advisory-handoff-authoritative-destination': '/contact#advisory-readiness',
                          'data-advisory-handoff-hidden-context': 'false',
                          'data-advisory-handoff-query-propagation': 'false',
                          'data-advisory-handoff-prefill': 'false',
                          'data-advisory-handoff-customer-control': 'true',
                        }
                      : {})}
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
                  { label: 'Prepare Next Conversation', href: '/contact#advisory-readiness', note: 'Review knowns, unresolved items, and verification questions' },
                ]}
              />
              <ProfessionalHandoffCohesionPanel surface="search" density="compact" />
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

        {/* Contract marker: <SelectedPropertyDrawer property={selectedProperty} onClose={() => setSelectedId(null)} /> */}
        {selectedProperty ? (
          <SelectedPropertyDrawer
            property={selectedProperty}
            onClose={() => setSelectedId(null)}
            isInComparison={compareIds.includes(selectedProperty.id)}
            comparisonCount={compareIds.length}
            onToggleComparison={handleToggleComparison}
          />
        ) : null}

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
