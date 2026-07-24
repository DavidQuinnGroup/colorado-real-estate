'use client';

import Link from 'next/link';
import { ArrowUpRight, Bath, BedDouble, ImageOff, MapPin, Ruler, ShieldCheck, Sparkles, TriangleAlert } from 'lucide-react';
import type { CSSProperties, KeyboardEvent } from 'react';
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

const heroStatStyle: CSSProperties = {
  alignItems: 'center',
  boxSizing: 'border-box',
  display: 'inline-flex',
  minHeight: 28,
};

function getNumericValue(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return null;

  const parsed = typeof value === 'number' ? value : Number(String(value).replace(/[$,]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function getCompactStat(value: number | string | null | undefined, fallback: string) {
  const numericValue = getNumericValue(value);
  if (numericValue === null) return fallback;

  return numericValue.toLocaleString();
}

function formatIntelligenceScore(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value).toString() : '--';
}

function getReviewSignal(property: MapSidebarListing) {
  if (property.hasPolybutyleneRisk) return 'Plumbing Review';
  if (property.soilType?.trim()) return property.soilType.trim();
  if (typeof property.altitude === 'number' && Number.isFinite(property.altitude)) {
    return 'Elevation Context';
  }

  return 'Public Listing Context Available';
}

function getDecisionLabel(property: MapSidebarListing) {
  if (property.hasPolybutyleneRisk) return 'Worth a closer plumbing review';
  if (!isResidentialListing(property.propertyType)) return 'Special-use details deserve a closer look';
  if (typeof property.resilienceScore === 'number' && property.resilienceScore >= 80) return 'Ready for a closer look';

  return 'Public listing context available';
}

function isResidentialListing(value: string | null | undefined) {
  const propertyType = value?.trim().toLowerCase() || '';
  if (!propertyType) return true;

  return (
    propertyType.includes('residential') ||
    propertyType.includes('single') ||
    propertyType.includes('condo') ||
    propertyType.includes('town') ||
    propertyType.includes('multi')
  );
}

function getActiveImageSrc(photoUrl: string, fallbackState: ImageFallbackState | null) {
  if (!fallbackState || fallbackState.originalSrc !== photoUrl) return photoUrl;
  return fallbackState.activeSrc;
}

function hasListingPhoto(property: MapSidebarListing) {
  return Boolean(property.mainPhoto?.trim() || property.image?.trim());
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

function hasCoordinates(property: MapSidebarListing) {
  return Number.isFinite(property.lat) && Number.isFinite(property.lng);
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
  const statusLabel = property.status?.trim() || '';
  const cardLabel = getCardLabel(property, price, address, city, state);
  const reviewSignal = getReviewSignal(property);
  const decisionLabel = getDecisionLabel(property);
  const cityMarketHref = getCityMarketHref(city);
  const hasReviewFlag = Boolean(property.hasPolybutyleneRisk);
  const hasCoordinatesFlag = hasCoordinates(property);
  const isFallbackVisual = imageSrc === LISTING_IMAGE_FALLBACK || !hasListingPhoto(property);
  const detailHref = `/properties/${property.id}`;
  const selectedStateId = `property-${property.id}-selected-state`;

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
      aria-describedby={isActive ? selectedStateId : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      data-testid="reie-property-card"
      data-property-card-id={property.id}
      data-property-card-active={String(isActive)}
      data-property-card-address={address}
      data-property-card-city={city}
      data-property-card-state={state}
      data-property-card-price={price}
      data-property-card-type={propertyType}
      data-property-card-private={String(Boolean(property.isPrivateExclusive))}
      data-property-card-review={String(hasReviewFlag)}
      data-property-card-mapped={String(hasCoordinatesFlag)}
      data-property-card-photo-fallback={String(isFallbackVisual)}
      data-property-card-efficiency-score={formatIntelligenceScore(property.efficiencyScore)}
      data-property-card-resilience-score={formatIntelligenceScore(property.resilienceScore)}
      data-property-card-review-signal={reviewSignal}
      data-property-card-decision-signal={decisionLabel}
      data-property-card-market-href={cityMarketHref}
      data-property-card-detail-href={detailHref}
      className={`group m-3 cursor-pointer overflow-hidden rounded-[8px] border outline-none transition duration-200 focus-visible:border-cyan-200 focus-visible:ring-2 focus-visible:ring-cyan-200/40 ${
        isActive
          ? 'border-cyan-100/80 bg-[#101821] shadow-[0_18px_55px_rgba(7,22,38,0.55)] ring-2 ring-cyan-100/32'
          : 'border-white/10 bg-[#0a0f14] shadow-[0_12px_35px_rgba(0,0,0,0.28)] hover:border-white/24 hover:bg-[#101720]'
      }`}
    >
      {isActive ? (
        <div
          id={selectedStateId}
          className="flex h-7 items-center justify-between bg-cyan-100 px-4 text-[9px] font-black uppercase tracking-[0.14em] text-[#061017]"
        >
          <span>Selected Property</span>
          <span className="text-[#061017]/62">Map Synced</span>
        </div>
      ) : null}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#10151b]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={address}
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          className={`h-full w-full object-cover opacity-95 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-100 ${
            isFallbackVisual ? 'saturate-[0.82]' : 'saturate-[1.02]'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080b0f]/82 via-[#080b0f]/16 to-transparent" />
        <div className="absolute left-4 top-4 flex max-w-[calc(100%-2rem)] items-center gap-2">
          {property.isPrivateExclusive ? (
            <span className="rounded-[4px] border border-cyan-200/45 bg-cyan-200/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-100 backdrop-blur">
              Private
            </span>
          ) : null}
          {hasReviewFlag ? (
            <span className="inline-flex items-center gap-1 rounded-[4px] border border-amber-200/45 bg-amber-200/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-100 backdrop-blur">
              <TriangleAlert size={12} aria-hidden="true" />
              Closer Look
            </span>
          ) : null}
        </div>
        {isFallbackVisual ? (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-[4px] border border-white/18 bg-black/58 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/72 backdrop-blur">
            <ImageOff size={12} aria-hidden="true" />
            Photo Pending
          </span>
        ) : null}

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between gap-3">
            <p className="font-serif text-[24px] font-black leading-none text-white drop-shadow">{formatLuxuryPrice(price)}</p>
            <span className="hidden rounded-[4px] border border-white/20 bg-black/50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/72 backdrop-blur sm:inline-flex">
              {statusLabel || 'Available'}
            </span>
          </div>
          <div
            className="mt-3 flex flex-wrap gap-2"
            data-testid="reie-property-card-core-facts"
            data-property-card-beds={getCompactStat(property.beds, '--')}
            data-property-card-baths={getCompactStat(property.baths, '--')}
            data-property-card-sqft={getCompactStat(property.sqft, '--')}
            data-property-card-status={statusLabel || 'Available'}
          >
            <span style={heroStatStyle} className="inline-flex items-center gap-1.5 rounded-[4px] bg-white/92 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#111820]">
              <BedDouble size={13} aria-hidden="true" />
              {getCompactStat(property.beds, '--')} bd
            </span>
            <span style={heroStatStyle} className="inline-flex items-center gap-1.5 rounded-[4px] bg-white/92 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#111820]">
              <Bath size={13} aria-hidden="true" />
              {getCompactStat(property.baths, '--')} ba
            </span>
            <span style={heroStatStyle} className="inline-flex items-center gap-1.5 rounded-[4px] bg-white/92 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-[#111820]">
              <Ruler size={13} aria-hidden="true" />
              {getCompactStat(property.sqft, '--')} sf
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3.5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="min-w-0 text-[15px] font-black uppercase leading-snug text-white">{address}</h2>
            <span className="shrink-0 rounded-[5px] border border-white/12 bg-white/[0.055] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/64">
              {statusLabel || 'Available'}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
            <MapPin size={13} aria-hidden="true" className="text-cyan-100/70" />
            {city}, {state}
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/48">
          <span className="rounded-[5px] border border-white/10 bg-white/[0.035] px-2.5 py-1">{propertyType}</span>
          <span className="rounded-[5px] border border-white/10 bg-white/[0.035] px-2.5 py-1">
            {hasCoordinatesFlag ? 'Map Located' : 'Map Review'}
          </span>
        </div>

        <div
          className="mt-3 rounded-[6px] border border-cyan-100/18 bg-cyan-100/[0.055] px-3 py-2"
          data-testid="reie-property-card-decision"
          data-property-card-decision-signal={decisionLabel}
          data-property-card-review-signal={reviewSignal}
        >
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/76">
            <Sparkles size={12} aria-hidden="true" />
            Review Context
          </p>
          <p className="mt-1 text-xs font-bold leading-4 text-white/70">{decisionLabel}</p>
        </div>

        <div
          className="mt-3 grid grid-cols-2 gap-2 text-left"
          data-testid="reie-property-card-intelligence"
          data-property-card-efficiency-score={formatIntelligenceScore(property.efficiencyScore)}
          data-property-card-resilience-score={formatIntelligenceScore(property.resilienceScore)}
          data-property-card-review-signal={reviewSignal}
        >
          <div className="rounded-[6px] border border-white/10 bg-white/[0.045] px-3 py-2">
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white/38">
              <ShieldCheck size={12} aria-hidden="true" />
              Map Context
            </p>
            <p className="mt-1 text-[12px] font-black uppercase leading-none text-white">
              {hasCoordinatesFlag ? 'Location Shown' : 'Location Needs Review'}
            </p>
          </div>
          <div className="min-w-0 rounded-[6px] border border-white/10 bg-white/[0.045] px-3 py-2">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/38">Property Signals</p>
            <p className="mt-1 truncate text-[12px] font-black leading-none text-cyan-100">{reviewSignal}</p>
          </div>
        </div>

        <div className="mt-2.5 flex flex-col items-start gap-2.5 border-t border-white/10 pt-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 text-[10px] font-bold uppercase leading-4 tracking-[0.14em] text-white/40">
            Open details when this listing deserves a closer look.
          </p>

          <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
            <Link
              href={cityMarketHref}
              data-testid="reie-property-card-market-link"
              data-property-card-market-href={cityMarketHref}
              aria-label={`View ${city} market intelligence`}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-white/10 text-white/55 transition hover:border-cyan-100/45 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              title={`${city} market intelligence`}
            >
              <MapPin size={15} aria-hidden="true" />
            </Link>

            <Link
              href={detailHref}
              data-testid="reie-property-card-detail-link"
              data-property-card-detail-href={detailHref}
              aria-label={`View details for ${address}`}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-[6px] border border-cyan-100/35 bg-cyan-100/10 px-3 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:border-white/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              title="View Property"
            >
              View Property
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/PropertyCard.tsx
