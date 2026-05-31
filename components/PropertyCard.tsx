'use client';

import Link from 'next/link';
import type { KeyboardEvent } from 'react';
import { useMemo, useState } from 'react';

import type { MapSidebarListing } from '@/components/maps/MapSidebar';
import { getCityByName } from '@/lib/cities';
import { getListingPhotoUrl, LISTING_IMAGE_FALLBACK } from '@/lib/listingVisuals';
import { formatLuxuryPrice } from '@/lib/utils/formatters';

type PropertyCardProps = {
  property: MapSidebarListing;
  isActive: boolean;
  onClick: () => void;
};

type ImageFallbackState = {
  originalSrc: string;
  activeSrc: string;
};

function getNumericValue(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return null;

  const parsed = typeof value === 'number' ? value : Number(String(value).replace(/[$,]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value: number | string | null | undefined) {
  const numericValue = getNumericValue(value);
  if (numericValue === null) return '--';

  return numericValue.toLocaleString();
}

function formatBedCount(value: number | string | null | undefined) {
  const numericValue = getNumericValue(value);
  if (numericValue === null) return '-- Beds';

  return `${numericValue.toLocaleString()} ${numericValue === 1 ? 'Bed' : 'Beds'}`;
}

function formatSecondaryStats(property: MapSidebarListing) {
  const baths = formatNumber(property.baths);
  const sqft = formatNumber(property.sqft);

  return `${baths} Baths / ${sqft} Sq Ft`;
}

function formatIntelligenceScore(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value).toString() : '--';
}

function getReviewSignal(property: MapSidebarListing) {
  if (property.hasPolybutyleneRisk) return 'Plumbing Review';
  if (property.soilType?.trim()) return property.soilType.trim();
  if (typeof property.altitude === 'number' && Number.isFinite(property.altitude)) {
    return `${Math.round(property.altitude).toLocaleString()} Ft`;
  }

  return 'REIE Verified';
}

function getActiveImageSrc(photoUrl: string, fallbackState: ImageFallbackState | null) {
  if (!fallbackState || fallbackState.originalSrc !== photoUrl) return photoUrl;
  return fallbackState.activeSrc;
}

function getCardLabel(property: MapSidebarListing, price: number, address: string, city: string, state: string) {
  const priceLabel = formatLuxuryPrice(price);
  return `${address}, ${city}, ${state}. ${priceLabel}. Select listing on map.`;
}

function getCityMarketHref(city: string) {
  const cityData = getCityByName(city);
  const marketSlug = cityData?.marketSlug ?? `${city.trim().toLowerCase().replace(/\s+/g, '-')}-co-housing-market`;

  return `/market/${marketSlug}`;
}

export default function PropertyCard({ property, isActive, onClick }: PropertyCardProps) {
  const photoUrl = useMemo(() => getListingPhotoUrl(property), [property]);
  const [fallbackState, setFallbackState] = useState<ImageFallbackState | null>(null);
  const imageSrc = getActiveImageSrc(photoUrl, fallbackState);
  const price = getNumericValue(property.price) ?? 0;
  const address = property.address || 'Address Available by Request';
  const city = property.city || 'Colorado';
  const state = property.state || 'CO';
  const propertyType = property.propertyType || 'Residential';
  const cardLabel = getCardLabel(property, price, address, city, state);
  const reviewSignal = getReviewSignal(property);
  const cityMarketHref = getCityMarketHref(city);

  function handleImageError() {
    if (imageSrc === LISTING_IMAGE_FALLBACK) return;
    setFallbackState({ originalSrc: photoUrl, activeSrc: LISTING_IMAGE_FALLBACK });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    onClick();
  }

  return (
    <article
      id={`property-${property.id}`}
      role="button"
      tabIndex={0}
      aria-label={cardLabel}
      aria-pressed={isActive}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`group cursor-pointer border-b border-white/18 bg-[#050609] outline-none transition duration-200 focus-visible:bg-white/[0.07] focus-visible:shadow-[inset_3px_0_0_#00e5ff] ${
        isActive ? 'bg-white/[0.065] shadow-[inset_3px_0_0_#00e5ff]' : 'hover:bg-white/[0.035]'
      }`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050505]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={address}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          className="h-full w-full object-cover opacity-95 saturate-[1.08] transition duration-700 group-hover:scale-[1.025] group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/48 via-black/0 to-black/8" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20" />

        {property.isPrivateExclusive ? (
          <div className="absolute left-4 top-4 border border-[#00e5ff]/55 bg-black/82 px-3 py-2 text-[9px] font-black uppercase tracking-[0.24em] text-[#00e5ff]">
            Private
          </div>
        ) : null}
      </div>

      <div className="px-5 py-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-serif text-[16px] font-black italic leading-none text-white">{formatLuxuryPrice(price)}</p>
          <p className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.18em] text-white/80">{formatBedCount(property.beds)}</p>
        </div>

        <div className="mt-5 border-t border-white/15 pt-4">
          <h2 className="text-[14px] font-black uppercase leading-tight text-white">{address}</h2>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.42em] text-white">
            {city}, {state}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="min-w-0 text-[10px] font-bold uppercase tracking-[0.16em] text-white/48">{formatSecondaryStats(property)}</p>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={cityMarketHref}
              aria-label={`View ${city} market intelligence`}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
              className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45 transition hover:text-[#00e5ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00e5ff]"
            >
              City Intel
            </Link>

            <Link
              href={`/properties/${property.id}`}
              aria-label={`View details for ${address}`}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
              className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00e5ff] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00e5ff]"
            >
              Details
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="border border-white/10 bg-white/[0.035] px-2 py-2">
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/28">Eff</p>
            <p className="mt-1 text-[11px] font-black uppercase tracking-[0.1em] text-white">{formatIntelligenceScore(property.efficiencyScore)}</p>
          </div>
          <div className="border border-white/10 bg-white/[0.035] px-2 py-2">
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/28">Res</p>
            <p className="mt-1 text-[11px] font-black uppercase tracking-[0.1em] text-white">{formatIntelligenceScore(property.resilienceScore)}</p>
          </div>
          <div className="min-w-0 border border-white/10 bg-white/[0.035] px-2 py-2">
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/28">Review</p>
            <p className="mt-1 truncate text-[9px] font-black uppercase tracking-[0.08em] text-white/70">{reviewSignal}</p>
          </div>
        </div>

        <p className="mt-4 truncate text-[9px] font-black uppercase tracking-[0.2em] text-white/28">{propertyType}</p>
      </div>
    </article>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/PropertyCard.tsx
