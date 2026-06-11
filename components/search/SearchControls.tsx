'use client';

import { Loader2, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import type { FormEvent } from 'react';

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
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

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

export default function SearchControls({
  filters,
  isSearching = false,
  searchError = null,
  onChange,
  onReset,
  onSubmit,
}: SearchControlsProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-[8px] border border-white/10 bg-black/35 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
          <SlidersHorizontal size={13} aria-hidden="true" />
          Filters
        </p>
        <button
          type="button"
          onClick={onReset}
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
          onChange={(event) => onChange(updateFilter(filters, 'query', event.target.value))}
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
            onChange={(event) => onChange(updateFilter(filters, 'minPrice', event.target.value))}
            placeholder="Min price"
            className="h-10 w-full rounded-[6px] border border-white/10 bg-white/[0.06] px-3 text-xs font-bold text-white outline-none transition placeholder:text-white/30 focus:border-cyan-100/45"
          />
        </label>
        <label>
          <span className="sr-only">Maximum price</span>
          <input
            inputMode="numeric"
            value={filters.maxPrice}
            onChange={(event) => onChange(updateFilter(filters, 'maxPrice', event.target.value))}
            placeholder="Max price"
            className="h-10 w-full rounded-[6px] border border-white/10 bg-white/[0.06] px-3 text-xs font-bold text-white outline-none transition placeholder:text-white/30 focus:border-cyan-100/45"
          />
        </label>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        <select
          value={filters.beds}
          onChange={(event) => onChange(updateFilter(filters, 'beds', event.target.value))}
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
          onChange={(event) => onChange(updateFilter(filters, 'baths', event.target.value))}
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
          onChange={(event) => onChange(updateFilter(filters, 'propertyType', event.target.value))}
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
            onChange={(event) => onChange(updateFilter(filters, 'city', event.target.value))}
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
}
