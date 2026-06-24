'use client';

import Link from 'next/link';
import { ArrowUpRight, Bath, BedDouble, Gauge, Home, Mail, MapPin, Ruler, ShieldCheck, Sparkles, TriangleAlert, X } from 'lucide-react';
import type { ReactNode } from 'react';

import type { MapSidebarListing } from '@/components/maps/MapSidebar';
import ResilientListingImage from '@/components/ResilientListingImage';
import { getCityByName } from '@/lib/cities';
import { getListingFallbackPhotoUrl, getListingPhotoUrl } from '@/lib/listingVisuals';
import { formatLuxuryPrice } from '@/lib/utils/formatters';

type SelectedPropertyDrawerProps = {
  property: MapSidebarListing;
  onClose: () => void;
};

function getNumericValue(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return null;

  const parsed = typeof value === 'number' ? value : Number(String(value).replace(/[$,]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatStat(value: number | string | null | undefined) {
  const numericValue = getNumericValue(value);
  if (numericValue === null) return '--';

  return numericValue.toLocaleString();
}

function formatScore(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value).toString() : '--';
}

function getCityMarketHref(city: string) {
  const cityData = getCityByName(city);
  const marketSlug = cityData?.marketSlug ?? `${city.trim().toLowerCase().replace(/\s+/g, '-')}-co-housing-market`;

  return `/market/${marketSlug}`;
}

function getReviewSignal(property: MapSidebarListing) {
  if (property.hasPolybutyleneRisk) return 'Plumbing review';
  if (property.soilType?.trim()) return property.soilType.trim();
  if (typeof property.altitude === 'number' && Number.isFinite(property.altitude)) {
    return `${Math.round(property.altitude).toLocaleString()} ft elevation`;
  }

  return 'REIE verified';
}

function getDecisionSignal(property: MapSidebarListing) {
  if (property.hasPolybutyleneRisk) return 'Contractor review before offer';
  if (typeof property.resilienceScore === 'number' && property.resilienceScore >= 80) return 'Resilience profile is strong';
  if (typeof property.efficiencyScore === 'number' && property.efficiencyScore >= 80) return 'Efficiency profile is strong';
  if (property.isPrivateExclusive) return 'Private inventory candidate';

  return 'Ready for REIE triage';
}

function getPropertyTypeLabel(value: string | null | undefined) {
  const cleaned = value?.trim();
  return cleaned || 'Residential';
}

function getScoreToneClass(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'text-white/58';
  if (value >= 80) return 'text-emerald-100';
  if (value >= 60) return 'text-cyan-100';
  return 'text-amber-100';
}

function hasListingPhoto(property: MapSidebarListing) {
  return Boolean(property.mainPhoto?.trim() || property.image?.trim());
}

function hasCoordinates(property: MapSidebarListing) {
  return Number.isFinite(property.lat) && Number.isFinite(property.lng);
}

export default function SelectedPropertyDrawer({ property, onClose }: SelectedPropertyDrawerProps) {
  const address = property.address || 'Address Available by Request';
  const city = property.city || 'Colorado';
  const state = property.state || 'CO';
  const price = getNumericValue(property.price) ?? 0;
  const hasReviewFlag = Boolean(property.hasPolybutyleneRisk);
  const hasPhoto = hasListingPhoto(property);
  const hasCoordinatesFlag = hasCoordinates(property);
  const propertyHref = `/properties/${property.id}`;
  const inquiryHref = `${propertyHref}#property-contact`;
  const marketHref = getCityMarketHref(city);
  const imageSrc = getListingPhotoUrl(property);
  const fallbackImageSrc = getListingFallbackPhotoUrl(property);
  const propertyType = getPropertyTypeLabel(property.propertyType);
  const decisionSignal = getDecisionSignal(property);
  const reviewSignal = getReviewSignal(property);

  return (
    <aside
      className="pointer-events-auto absolute bottom-4 left-4 right-4 z-[720] max-h-[calc(100%-2rem)] overflow-hidden rounded-[8px] border border-white/14 bg-[#071017]/96 shadow-2xl backdrop-blur-md md:bottom-6 md:left-auto md:right-6 md:w-[410px]"
      data-testid="reie-selected-property-drawer"
      data-selected-property-id={property.id}
      data-selected-property-address={address}
      data-selected-property-city={city}
      data-selected-property-state={state}
      data-selected-property-price={price}
      data-selected-property-type={propertyType}
      data-selected-property-private={String(Boolean(property.isPrivateExclusive))}
      data-selected-property-review={String(hasReviewFlag)}
      data-selected-property-mapped={String(hasCoordinatesFlag)}
      data-selected-property-photo-available={String(hasPhoto)}
      data-selected-property-efficiency-score={formatScore(property.efficiencyScore)}
      data-selected-property-resilience-score={formatScore(property.resilienceScore)}
      data-selected-property-decision-signal={decisionSignal}
      data-selected-property-review-signal={reviewSignal}
      data-selected-property-detail-href={propertyHref}
      data-selected-property-inquiry-href={inquiryHref}
      data-selected-property-market-href={marketHref}
    >
      <div
        className="relative aspect-[16/9] overflow-hidden border-b border-white/10 bg-[#10151b]"
        data-testid="reie-selected-property-media"
        data-selected-property-photo-available={String(hasPhoto)}
        data-selected-property-image-src={imageSrc}
        data-selected-property-fallback-src={fallbackImageSrc}
      >
        <ResilientListingImage
          src={imageSrc}
          fallbackSrc={fallbackImageSrc}
          alt={address}
          loading="eager"
          fetchPriority="high"
          fallbackLabel="REIE visual"
          timeoutMs={4500}
          className="absolute inset-0 h-full w-full object-cover opacity-88 saturate-[0.96]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071017] via-[#071017]/24 to-black/18" />
        <div className="absolute left-4 top-4 flex max-w-[calc(100%-4.75rem)] flex-wrap gap-2">
          <span className="inline-flex min-h-7 items-center gap-1.5 rounded-[5px] border border-white/20 bg-black/58 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/84 backdrop-blur">
            <Home size={12} aria-hidden="true" />
            {propertyType}
          </span>
          {property.isPrivateExclusive ? (
            <span className="inline-flex min-h-7 items-center rounded-[5px] border border-cyan-100/38 bg-cyan-100/12 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100 backdrop-blur">
              Private
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          data-testid="reie-selected-property-close"
          data-selected-property-id={property.id}
          aria-label="Close selected listing"
          className="absolute right-4 top-4 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-white/16 bg-black/52 text-white/72 backdrop-blur transition hover:border-white/34 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        >
          <X size={15} aria-hidden="true" />
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/76">Selected Listing</p>
          <p className="mt-2 font-serif text-[30px] font-black leading-none text-white drop-shadow">{formatLuxuryPrice(price)}</p>
        </div>
      </div>

      <div className="max-h-[52vh] overflow-y-auto p-4">
        <div className="min-w-0">
          <h2 className="line-clamp-2 text-[15px] font-black uppercase leading-snug tracking-[0.06em] text-white">{address}</h2>
          <p className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/46">
            <MapPin size={13} aria-hidden="true" className="text-cyan-100/68" />
            {city}, {state}
          </p>
        </div>

        <div
          className="mt-4 rounded-[6px] border border-cyan-100/18 bg-cyan-100/[0.06] p-3"
          data-testid="reie-selected-property-decision"
          data-selected-property-decision-signal={decisionSignal}
          data-selected-property-review-signal={reviewSignal}
        >
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/76">
            <Sparkles size={13} aria-hidden="true" />
            Decision Signal
          </p>
          <p className="mt-1 text-xs font-black uppercase leading-5 tracking-[0.08em] text-white/72">{decisionSignal}</p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <StatTile icon={<BedDouble size={13} />} label="Beds" value={formatStat(property.beds)} />
          <StatTile icon={<Bath size={13} />} label="Baths" value={formatStat(property.baths)} />
          <StatTile icon={<Ruler size={13} />} label="Sq Ft" value={formatStat(property.sqft)} />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <SignalTile icon={<Gauge size={13} />} label="Eff" value={formatScore(property.efficiencyScore)} valueClassName={getScoreToneClass(property.efficiencyScore)} />
          <SignalTile icon={<ShieldCheck size={13} />} label="Res" value={formatScore(property.resilienceScore)} valueClassName={getScoreToneClass(property.resilienceScore)} />
          <div
            className="min-w-0 rounded-[6px] border border-white/10 bg-white/[0.045] p-3"
            data-testid="reie-selected-property-signal"
            data-selected-property-review-signal={reviewSignal}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/36">Signal</p>
            <p className="mt-1 truncate text-[12px] font-black uppercase leading-none text-cyan-100">{reviewSignal}</p>
          </div>
        </div>

        {hasReviewFlag ? (
          <p className="mt-3 flex items-center gap-2 rounded-[6px] border border-amber-200/24 bg-amber-200/10 px-3 py-2 text-[10px] font-black uppercase leading-4 tracking-[0.12em] text-amber-100">
            <TriangleAlert size={13} aria-hidden="true" className="shrink-0" />
            GC review recommended before offer strategy.
          </p>
        ) : null}

        <div className="mt-4 border-t border-white/10 pt-4">
          <Link
            href={inquiryHref}
            data-testid="reie-selected-property-inquiry-link"
            data-selected-property-id={property.id}
            data-selected-property-inquiry-href={inquiryHref}
            className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[6px] bg-cyan-100 text-[10px] font-black uppercase tracking-[0.14em] text-[#061017] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            Inquire
            <Mail size={13} aria-hidden="true" />
          </Link>
          <p className="mt-2 text-[10px] font-bold leading-4 text-white/38">Saves the property context and opens the inquiry workflow for this listing.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href={propertyHref}
              data-testid="reie-selected-property-detail-link"
              data-selected-property-id={property.id}
              data-selected-property-detail-href={propertyHref}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[6px] border border-white/10 bg-white/[0.055] text-[10px] font-black uppercase tracking-[0.12em] text-white/72 transition hover:border-cyan-100/35 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            >
              Details
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
            <Link
              href={marketHref}
              data-testid="reie-selected-property-market-link"
              data-selected-property-id={property.id}
              data-selected-property-market-href={marketHref}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[6px] border border-white/10 bg-white/[0.055] text-[10px] font-black uppercase tracking-[0.12em] text-white/72 transition hover:border-cyan-100/35 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            >
              Market
              <MapPin size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

function StatTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[6px] border border-white/10 bg-white/[0.045] p-3">
      <div className="text-cyan-100/72">{icon}</div>
      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/36">{label}</p>
      <p className="mt-1 text-sm font-black leading-none text-white">{value}</p>
    </div>
  );
}

function SignalTile({ icon, label, value, valueClassName = 'text-white' }: { icon: ReactNode; label: string; value: string; valueClassName?: string }) {
  return (
    <div className="rounded-[6px] border border-white/10 bg-white/[0.045] p-3">
      <div className="text-cyan-100/72">{icon}</div>
      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/36">{label}</p>
      <p className={`mt-1 text-sm font-black leading-none ${valueClassName}`}>{value}</p>
    </div>
  );
}
