'use client';

import Link from 'next/link';
import { ArrowUpRight, Bath, BedDouble, Home, Mail, MapPin, Ruler, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import type { MapSidebarListing } from '@/components/maps/MapSidebar';
import { CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS } from '@/lib/property/customerControlledComparison';
import ResilientListingImage from '@/components/ResilientListingImage';
import { getCityByName } from '@/lib/cities';
import { getListingFallbackPhotoUrl, getListingPhotoUrl } from '@/lib/listingVisuals';
import { buildPropertyHrefWithSearchReturn, buildSearchReturnPath } from '@/lib/search/searchReturnContext';
import { formatLuxuryPrice } from '@/lib/utils/formatters';

type SelectedPropertyDrawerProps = {
  property: MapSidebarListing;
  onClose: () => void;
  isInComparison?: boolean;
  comparisonCount?: number;
  onToggleComparison?: (propertyId: string) => void;
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
  if (property.hasPolybutyleneRisk) return 'Plumbing review suggested';
  if (property.soilType?.trim()) return 'Property signals available';
  if (typeof property.altitude === 'number' && Number.isFinite(property.altitude)) {
    return 'Elevation context available';
  }

  return 'Public listing context';
}

function getAdvisoryNote(property: MapSidebarListing) {
  if (property.hasPolybutyleneRisk) return 'Verify plumbing context before next steps.';
  if (typeof property.resilienceScore === 'number' && property.resilienceScore >= 80) return 'Location and property context are available for review.';
  if (typeof property.efficiencyScore === 'number' && property.efficiencyScore >= 80) return 'Public location context may be useful for comparison.';
  if (property.isPrivateExclusive) return 'Additional listing context can be discussed through inquiry.';

  return 'Review public facts, location, and condition details before deciding.';
}

function getLocationFit(property: MapSidebarListing) {
  return hasCoordinates(property) ? 'Shown on this map' : 'Map location needs review';
}

function getPropertyTypeLabel(value: string | null | undefined) {
  const cleaned = value?.trim();
  return cleaned || 'Residential';
}

function hasListingPhoto(property: MapSidebarListing) {
  return Boolean(property.mainPhoto?.trim() || property.image?.trim());
}

function hasCoordinates(property: MapSidebarListing) {
  return Number.isFinite(property.lat) && Number.isFinite(property.lng);
}

export default function SelectedPropertyDrawer({
  property,
  onClose,
  isInComparison = false,
  comparisonCount = 0,
  onToggleComparison,
}: SelectedPropertyDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const basePropertyHref = `/properties/${property.id}`;
  const [detailHref, setDetailHref] = useState(basePropertyHref);
  const address = property.address || 'Address Available by Request';
  const city = property.city || 'Colorado';
  const state = property.state || 'CO';
  const price = getNumericValue(property.price) ?? 0;
  const hasReviewFlag = Boolean(property.hasPolybutyleneRisk);
  const hasPhoto = hasListingPhoto(property);
  const hasCoordinatesFlag = hasCoordinates(property);
  const propertyHref = detailHref.startsWith(basePropertyHref) ? detailHref : basePropertyHref;
  const inquiryHref = `${propertyHref}#property-contact`;
  const marketHref = getCityMarketHref(city);
  const imageSrc = getListingPhotoUrl(property);
  const fallbackImageSrc = getListingFallbackPhotoUrl(property);
  const propertyType = getPropertyTypeLabel(property.propertyType);
  const advisoryNote = getAdvisoryNote(property);
  const reviewSignal = getReviewSignal(property);
  const locationFit = getLocationFit(property);
  const headingId = `selected-property-${property.id}-heading`;
  const comparisonDisabled = !isInComparison && comparisonCount >= CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS;

  useEffect(() => {
    drawerRef.current?.focus({ preventScroll: true });
  }, [property.id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const returnHandoffTimer = window.setTimeout(() => {
      const searchShell = document.querySelector<HTMLElement>('[data-testid="reie-search-interface"]');
      const view = searchShell?.dataset.mobileView || null;
      const returnPath = buildSearchReturnPath(new URLSearchParams(window.location.search), property.id, view);
      setDetailHref(buildPropertyHrefWithSearchReturn(basePropertyHref, returnPath));
    }, 0);

    return () => window.clearTimeout(returnHandoffTimer);
  }, [basePropertyHref, property.id]);

  return (
    <aside
      ref={drawerRef}
      className="reie-selected-property-drawer pointer-events-auto fixed z-[1200] max-h-[calc(100%-2rem)] overflow-hidden rounded-[8px] border border-white/14 bg-[#071017]/96 shadow-2xl backdrop-blur-md"
      role="dialog"
      aria-labelledby={headingId}
      tabIndex={-1}
      data-testid="reie-selected-property-drawer"
      data-selected-property-id={property.id}
      data-selected-property-preview-model="click-pinned"
      data-selected-property-preview-hover-dependent="false"
      data-selected-property-preview-dismissible="close-or-escape"
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
      data-selected-property-decision-signal={advisoryNote}
      data-selected-property-review-signal={reviewSignal}
      data-selected-property-detail-href={propertyHref}
      data-selected-property-inquiry-href={inquiryHref}
      data-selected-property-market-href={marketHref}
      data-search-return-handoff="bounded-url"
      data-search-return-source="search"
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
          fallbackLabel="Property visual"
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
          className="absolute z-20 inline-flex shrink-0 items-center justify-center rounded-[6px] border border-white/16 bg-black/52 text-white/72 backdrop-blur transition hover:border-white/34 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          style={{ height: '44px', right: '1rem', top: '1rem', width: '44px' }}
        >
          <X size={15} aria-hidden="true" />
        </button>

        <div className="pointer-events-none absolute bottom-4 left-4 right-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/76">Selected Property</p>
          <p className="mt-2 font-serif text-[30px] font-black leading-none text-white drop-shadow">{formatLuxuryPrice(price)}</p>
        </div>
      </div>

      <div className="max-h-[52vh] overflow-y-auto p-4">
        <div className="min-w-0">
          <h2 id={headingId} className="line-clamp-2 text-left text-[15px] font-black uppercase leading-snug tracking-[0.06em] text-white">
            {address}
          </h2>
          <p className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/46">
            <MapPin size={13} aria-hidden="true" className="text-cyan-100/68" />
            {city}, {state}
          </p>
          <p className="mt-2 text-left text-[11px] font-bold leading-5 text-white/42">
            This panel reflects the property selected from the map or listing results.
          </p>
        </div>

        <div
          className="mt-3 rounded-[6px] border border-cyan-100/18 bg-cyan-100/[0.06] p-3"
          data-testid="reie-selected-property-decision"
          data-selected-property-decision-signal={advisoryNote}
          data-selected-property-review-signal={reviewSignal}
        >
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/76">
            <Sparkles size={13} aria-hidden="true" />
            Review context
          </p>
          <p className="mt-1.5 text-left text-xs font-bold leading-5 text-white/72">{advisoryNote}</p>
        </div>

        <div
          className="mt-3 rounded-[6px] border border-white/10 bg-white/[0.045] p-3"
          data-testid="reie-selected-property-buyer-confidence"
          data-buyer-confidence-next-step="view-property-before-contact"
          data-buyer-confidence-automation="false"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/44">Buyer Confidence Path</p>
          <p className="mt-1.5 text-left text-xs font-bold leading-5 text-white/58">
            Open the property decision view to compare public facts, market context, ownership-cost questions, and records to verify before asking or touring.
          </p>
        </div>

        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/42">Property Details</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <StatTile icon={<BedDouble size={13} />} label="Beds" value={formatStat(property.beds)} />
          <StatTile icon={<Bath size={13} />} label="Baths" value={formatStat(property.baths)} />
          <StatTile icon={<Ruler size={13} />} label="Sq Ft" value={formatStat(property.sqft)} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <ContextTile icon={<MapPin size={13} />} label="Map Context" value={locationFit} />
          <ContextTile
            icon={<ShieldCheck size={13} />}
            label="Property Signals"
            value={reviewSignal}
            testId="reie-selected-property-signal"
            dataValue={reviewSignal}
          />
        </div>

        {hasReviewFlag ? (
          <p className="mt-3 rounded-[6px] border border-amber-200/24 bg-amber-200/10 px-3 py-2 text-left text-[10px] font-black uppercase leading-4 tracking-[0.12em] text-amber-100">
            Verify plumbing and condition details before next steps.
          </p>
        ) : null}

        <div className="mt-4 border-t border-white/10 pt-4">
          <div
            className="mb-3 rounded-[6px] border border-cyan-100/16 bg-cyan-100/[0.055] p-3"
            data-testid="cep-conversion-selected-property-guidance"
            data-conversion-source="search-selected-property"
            data-conversion-detail-href={propertyHref}
            data-conversion-inquiry-href={inquiryHref}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-cyan-100/72">Next Step</p>
            <p className="mt-1.5 text-left text-xs font-bold leading-5 text-white/62">
              Open the full property decision view first, or ask a property-specific question when timing, records, or tour criteria matter.
            </p>
          </div>
          <Link
            href={propertyHref}
            data-testid="reie-selected-property-detail-link"
            data-selected-property-id={property.id}
            data-selected-property-detail-href={propertyHref}
            data-search-return-handoff="bounded-url"
            data-search-return-source="search"
            className="reie-decision-link reie-decision-link--primary inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[6px] text-[10px] font-black uppercase tracking-[0.14em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            View Property
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
          <p className="mt-2 text-left text-[10px] font-bold leading-4 text-white/42">Open the full listing details to review property facts and verification questions.</p>
          {onToggleComparison ? (
            <button
              type="button"
              onClick={() => onToggleComparison(property.id)}
              disabled={comparisonDisabled}
              data-testid="reie-selected-property-comparison-toggle"
              data-selected-property-id={property.id}
              data-property-comparison-selected={String(isInComparison)}
              data-property-comparison-count={comparisonCount}
              data-property-comparison-customer-controlled="true"
              className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-[6px] border border-cyan-100/24 bg-cyan-100/[0.08] px-3 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-100/50 hover:bg-cyan-100/[0.14] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.035] disabled:text-white/34 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            >
              {isInComparison ? 'Remove from comparison' : 'Add to comparison'}
            </button>
          ) : null}
          <Link
            href={inquiryHref}
            data-testid="reie-selected-property-inquiry-link"
            data-selected-property-id={property.id}
            data-selected-property-inquiry-href={inquiryHref}
            className="reie-decision-link reie-decision-link--secondary mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[6px] text-[10px] font-black uppercase tracking-[0.12em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            Ask About This Property
            <Mail size={13} aria-hidden="true" />
          </Link>
          <Link href={marketHref} data-testid="reie-selected-property-market-link" data-selected-property-id={property.id} data-selected-property-market-href={marketHref} className="sr-only">
            Market context
          </Link>
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

function ContextTile({
  icon,
  label,
  value,
  testId,
  dataValue,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  testId?: string;
  dataValue?: string;
}) {
  return (
    <div className="min-w-0 rounded-[6px] border border-white/10 bg-white/[0.045] p-3" data-testid={testId} data-selected-property-review-signal={dataValue}>
      <div className="text-cyan-100/72">{icon}</div>
      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/36">{label}</p>
      <p className="mt-1 text-[12px] font-black uppercase leading-4 text-cyan-100">{value}</p>
    </div>
  );
}
