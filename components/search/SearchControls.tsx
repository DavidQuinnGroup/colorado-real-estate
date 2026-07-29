'use client';

import { Check, Copy, Loader2, MapPin, RotateCcw, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import { useId, useMemo, useState } from 'react';

export type SearchFilters = {
  query: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  beds: string;
  baths: string;
  propertyType: string;
};

type SearchControlsProps = {
  filters: SearchFilters;
  isSearching?: boolean;
  searchError?: string | null;
  onChange: (filters: SearchFilters) => void;
  onRemoveFilter?: (filters: SearchFilters) => void;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const textControlStyle: CSSProperties = {
  boxSizing: 'border-box',
  minHeight: 42,
  paddingBottom: 10,
  paddingTop: 10,
};

const compactControlStyle: CSSProperties = {
  ...textControlStyle,
  minHeight: 40,
};

const iconButtonStyle: CSSProperties = {
  alignItems: 'center',
  boxSizing: 'border-box',
  display: 'inline-flex',
  height: 32,
  justifyContent: 'center',
  width: 32,
};

function RefinementSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-white/10 bg-white/[0.032] p-3" aria-label={title}>
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/66">{eyebrow}</p>
      <p className="mt-1 text-[12px] font-black leading-5 text-white/72">{title}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function getInitialSearchFilters(): SearchFilters {
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

export function hasActiveSearchFilters(filters: SearchFilters) {
  return Object.values(filters).some((value) => value.trim().length > 0);
}

export function setSearchParam(params: URLSearchParams, key: string, value: string) {
  const trimmed = value.trim();
  if (trimmed) params.set(key, trimmed);
}

export function buildSearchParams(filters: SearchFilters) {
  const params = new URLSearchParams();

  setSearchParam(params, 'q', filters.query);
  setSearchParam(params, 'city', filters.city);
  setSearchParam(params, 'minPrice', filters.minPrice);
  setSearchParam(params, 'maxPrice', filters.maxPrice);
  setSearchParam(params, 'beds', filters.beds);
  setSearchParam(params, 'baths', filters.baths);
  setSearchParam(params, 'propertyType', filters.propertyType);

  return params;
}

export function getSearchFiltersFromParams(params: URLSearchParams): SearchFilters {
  return {
    query: params.get('q') || params.get('query') || '',
    city: params.get('city') || '',
    minPrice: params.get('minPrice') || params.get('priceMin') || '',
    maxPrice: params.get('maxPrice') || params.get('priceMax') || '',
    beds: params.get('beds') || params.get('minBeds') || '',
    baths: params.get('baths') || params.get('minBaths') || '',
    propertyType: params.get('propertyType') || params.get('type') || '',
  };
}

function updateFilter(filters: SearchFilters, key: keyof SearchFilters, value: string): SearchFilters {
  return {
    ...filters,
    [key]: value,
  };
}

function formatCurrencyFilter(value: string) {
  const parsed = Number(value.replace(/[$,]/g, ''));
  if (!Number.isFinite(parsed) || parsed <= 0) return value;
  if (parsed >= 1000000) return `$${(parsed / 1000000).toFixed(parsed >= 10000000 ? 0 : 1)}M`;
  if (parsed >= 1000) return `$${Math.round(parsed / 1000)}K`;

  return `$${parsed.toLocaleString()}`;
}

export function getActiveFilterChips(filters: SearchFilters) {
  const chips: Array<{ key: keyof SearchFilters; label: string }> = [];

  if (filters.query.trim()) chips.push({ key: 'query', label: `Keyword: ${filters.query.trim()}` });
  if (filters.city.trim()) chips.push({ key: 'city', label: `City: ${filters.city.trim()}` });
  if (filters.minPrice.trim()) chips.push({ key: 'minPrice', label: `Min ${formatCurrencyFilter(filters.minPrice.trim())}` });
  if (filters.maxPrice.trim()) chips.push({ key: 'maxPrice', label: `Max ${formatCurrencyFilter(filters.maxPrice.trim())}` });
  if (filters.beds.trim()) chips.push({ key: 'beds', label: `${filters.beds.trim()}+ beds` });
  if (filters.baths.trim()) chips.push({ key: 'baths', label: `${filters.baths.trim()}+ baths` });
  if (filters.propertyType.trim()) chips.push({ key: 'propertyType', label: filters.propertyType.trim() });

  return chips;
}

function buildSharePath(filters: SearchFilters) {
  const params = buildSearchParams(filters);
  return params.toString() ? `/search?${params.toString()}` : '/search';
}

function getCriteriaSummary(chipCount: number) {
  if (chipCount === 0) return 'Start broad, then refine.';
  if (chipCount === 1) return 'One refinement is shaping this view.';
  return `${chipCount} refinements are shaping this view.`;
}

export default function SearchControls({
  filters,
  isSearching = false,
  searchError = null,
  onChange,
  onRemoveFilter,
  onReset,
  onSubmit,
}: SearchControlsProps) {
  const formId = useId();
  const [copied, setCopied] = useState(false);
  const chips = useMemo(() => getActiveFilterChips(filters), [filters]);
  const sharePath = useMemo(() => buildSharePath(filters), [filters]);
  const criteriaSummary = useMemo(() => getCriteriaSummary(chips.length), [chips.length]);

  async function handleCopyShareLink() {
    const shareUrl = typeof window === 'undefined' ? sharePath : new URL(sharePath, window.location.origin).toString();

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function removeFilter(key: keyof SearchFilters) {
    const nextFilters = updateFilter(filters, key, '');

    onChange(nextFilters);
    onRemoveFilter?.(nextFilters);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="overflow-hidden rounded-[8px] border border-white/10 bg-[#071017]/76 shadow-[0_14px_42px_rgba(0,0,0,0.2)]"
      aria-labelledby={`${formId}-title`}
      aria-describedby={`${formId}-description ${formId}-status`}
    >
      <div className="border-b border-white/10 bg-white/[0.035] p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p id={`${formId}-title`} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
              <SlidersHorizontal size={13} aria-hidden="true" />
              Shape Your Search
            </p>
            <p id={`${formId}-description`} className="mt-2 text-[11px] font-bold leading-5 text-white/48">
              Build clarity by starting with place or a specific property, then narrow by budget, home type, beds, baths, and keywords the search already supports.
            </p>
          </div>
          <span
            className="shrink-0 rounded-[5px] border border-cyan-100/20 bg-cyan-100/[0.075] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-cyan-100/70"
            data-testid="reie-search-active-count"
            data-search-active-filter-count={chips.length}
          >
            {chips.length ? `${chips.length} Active` : 'Open Search'}
          </span>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/40">
            <Sparkles size={12} aria-hidden="true" className="text-cyan-100/62" />
            Search Criteria
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyShareLink}
              style={iconButtonStyle}
              className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-white/10 text-white/52 transition hover:border-cyan-100/35 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              aria-label="Share this search"
              title="Share This Search"
            >
              {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={onReset}
              style={iconButtonStyle}
              className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-white/10 text-white/52 transition hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              aria-label="Clear search"
              title="Clear Search"
            >
              <RotateCcw size={13} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          className="mt-3 rounded-[8px] border border-white/10 bg-black/24 px-3 py-2"
          data-testid="reie-search-criteria-summary"
          data-search-criteria-summary={criteriaSummary}
          data-search-active-filter-count={chips.length}
        >
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/72">
            <MapPin size={12} aria-hidden="true" />
            Search Path
          </p>
          <p className="mt-1 text-[11px] font-bold leading-5 text-white/52">
            {criteriaSummary} City shapes place, while the specific-property field supports address, ZIP, keyword, or MLS-style lookups without changing result eligibility.
          </p>
        </div>

      <div className="mt-3 grid gap-2">
        <section className="rounded-[8px] bg-cyan-100/[0.055] p-3" aria-label="Primary search criteria">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/66">Start Here</p>
          <p className="sr-only">Where would you like to live?</p>
          <p className="sr-only">Already have a property in mind?</p>
          <div className="mt-3 grid gap-2">
            <label className="block" htmlFor={`${formId}-city`}>
              <span className="sr-only">City</span>
              <input
                id={`${formId}-city`}
                aria-label="City"
                value={filters.city}
                onChange={(event) => onChange(updateFilter(filters, 'city', event.target.value))}
                placeholder="City or town"
                style={textControlStyle}
                className="h-11 w-full rounded-[6px] border border-cyan-100/24 bg-cyan-100/[0.075] px-3 text-sm font-black text-white outline-none transition placeholder:text-cyan-50/38 focus:border-cyan-100/70"
              />
            </label>
            <label className="min-w-0" htmlFor={`${formId}-query`}>
              <span className="sr-only">Keyword, address, ZIP, or MLS number</span>
              <input
                id={`${formId}-query`}
                aria-label="Keyword, address, ZIP, or MLS number"
                value={filters.query}
                onChange={(event) => onChange(updateFilter(filters, 'query', event.target.value))}
                placeholder="Address, ZIP, keyword, MLS"
                style={textControlStyle}
                className="h-11 w-full rounded-[6px] border border-white/10 bg-white/[0.06] px-3 text-sm font-bold text-white outline-none transition placeholder:text-white/30 focus:border-cyan-100/45"
              />
            </label>
            <button
              type="submit"
              disabled={isSearching}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-cyan-100 px-4 text-[10px] font-black uppercase tracking-[0.12em] text-[#061017] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              aria-label="Update results"
            >
              {isSearching ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Search size={16} aria-hidden="true" />}
              Search
            </button>
          </div>
          <p className="mt-2 text-[11px] font-bold leading-5 text-white/38">
            Use this when you already know an address, ZIP code, keyword, or MLS number. Neighborhood names and listing details can also help narrow supported search text.
          </p>
        </section>

        <details className="rounded-[8px] border border-white/10 bg-white/[0.032] p-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/54">
            Refine budget and home details
            <span className="text-cyan-100/70">+</span>
          </summary>
          <div className="mt-3 grid gap-2">
            <RefinementSection eyebrow="Budget" title="What fits your budget?">
              <div className="grid grid-cols-2 gap-2">
                <label htmlFor={`${formId}-min-price`}>
                  <span className="sr-only">Minimum price</span>
                  <input
                    id={`${formId}-min-price`}
                    aria-label="Minimum price"
                    inputMode="numeric"
                    value={filters.minPrice}
                    onChange={(event) => onChange(updateFilter(filters, 'minPrice', event.target.value))}
                    placeholder="Min price"
                    style={compactControlStyle}
                    className="h-10 w-full rounded-[6px] border border-white/10 bg-white/[0.06] px-3 text-xs font-bold text-white outline-none transition placeholder:text-white/30 focus:border-cyan-100/45"
                  />
                </label>
                <label htmlFor={`${formId}-max-price`}>
                  <span className="sr-only">Maximum price</span>
                  <input
                    id={`${formId}-max-price`}
                    aria-label="Maximum price"
                    inputMode="numeric"
                    value={filters.maxPrice}
                    onChange={(event) => onChange(updateFilter(filters, 'maxPrice', event.target.value))}
                    placeholder="Max price"
                    style={compactControlStyle}
                    className="h-10 w-full rounded-[6px] border border-white/10 bg-white/[0.06] px-3 text-xs font-bold text-white outline-none transition placeholder:text-white/30 focus:border-cyan-100/45"
                  />
                </label>
              </div>
              <p
                className="mt-2 text-[11px] font-bold leading-5 text-white/38"
                data-testid="reie-buyer-affordability-awareness"
                data-buyer-confidence-financing-workflow="false"
              >
                Treat price range as a search boundary, not an affordability conclusion. Taxes, insurance, HOA, financing terms,
                closing costs, cash to close, escrow, maintenance, reserves, and rate assumptions should be verified with the appropriate professionals before relying on a budget.
              </p>
            </RefinementSection>

            <div className="grid gap-2 sm:grid-cols-2">
              <RefinementSection eyebrow="Home Type" title="What kind of home?">
                <select
                  id={`${formId}-property-type`}
                  value={filters.propertyType}
                  onChange={(event) => onChange(updateFilter(filters, 'propertyType', event.target.value))}
                  style={compactControlStyle}
                  className="h-10 w-full rounded-[6px] border border-white/10 bg-[#101720] px-3 text-xs font-black uppercase tracking-[0.04em] text-white outline-none transition focus:border-cyan-100/45"
                  aria-label="Property type"
                >
                  <option value="">Type</option>
                  <option value="Residential">Residential</option>
                  <option value="Land">Land</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Multi-Family">Multi-Family</option>
                </select>
              </RefinementSection>

              <RefinementSection eyebrow="Details" title="What do you need?">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    id={`${formId}-beds`}
                    value={filters.beds}
                    onChange={(event) => onChange(updateFilter(filters, 'beds', event.target.value))}
                    style={compactControlStyle}
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
                    id={`${formId}-baths`}
                    value={filters.baths}
                    onChange={(event) => onChange(updateFilter(filters, 'baths', event.target.value))}
                    style={compactControlStyle}
                    className="h-10 rounded-[6px] border border-white/10 bg-[#101720] px-2 text-xs font-black uppercase tracking-[0.04em] text-white outline-none transition focus:border-cyan-100/45"
                    aria-label="Minimum bathrooms"
                  >
                    <option value="">Baths</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
              </RefinementSection>
            </div>
          </div>
        </details>
      </div>

      {chips.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Active search criteria" data-testid="reie-search-active-criteria">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => removeFilter(chip.key)}
              data-testid="reie-search-active-chip"
              data-search-filter-key={chip.key}
              data-search-filter-label={chip.label}
              className="inline-flex max-w-full items-center gap-1 rounded-[6px] border border-cyan-100/20 bg-cyan-100/[0.08] px-2 py-1 text-[10px] font-black uppercase leading-none tracking-[0.08em] text-cyan-50 transition hover:border-cyan-100/45 hover:bg-cyan-100/[0.13] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              aria-label={`Remove ${chip.label}`}
              title={`Remove ${chip.label}`}
            >
              <span className="truncate">{chip.label}</span>
              <X size={11} aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
        <p id={`${formId}-status`} className="text-[10px] font-black uppercase tracking-[0.16em] text-white/34" aria-live="polite">
          {isSearching ? 'Refreshing your search' : chips.length ? criteriaSummary : 'Ready to explore'}
        </p>
        {isSearching ? <Loader2 size={13} className="shrink-0 animate-spin text-cyan-100" aria-hidden="true" /> : null}
      </div>

      {searchError ? <p className="mt-2 text-xs font-bold text-red-300" role="alert">{searchError}</p> : null}
      </div>
    </form>
  );
}
