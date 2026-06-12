'use client';

import Link from 'next/link';
import { ArrowUpRight, Bath, BedDouble, Gauge, Mail, MapPin, Ruler, ShieldCheck, TriangleAlert, X } from 'lucide-react';
import type { ReactNode } from 'react';

import type { MapSidebarListing } from '@/components/maps/MapSidebar';
import { getCityByName } from '@/lib/cities';
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

export default function SelectedPropertyDrawer({ property, onClose }: SelectedPropertyDrawerProps) {
  const address = property.address || 'Address Available by Request';
  const city = property.city || 'Colorado';
  const state = property.state || 'CO';
  const price = getNumericValue(property.price) ?? 0;
  const hasReviewFlag = Boolean(property.hasPolybutyleneRisk);
  const propertyHref = `/properties/${property.id}`;
  const inquiryHref = `${propertyHref}#property-contact`;

  return (
    <aside className="pointer-events-auto absolute bottom-4 left-4 right-4 z-[720] rounded-[8px] border border-white/14 bg-[#071017]/94 p-4 shadow-2xl backdrop-blur-md md:bottom-6 md:left-auto md:right-6 md:w-[380px]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Selected Listing</p>
          <h2 className="mt-2 truncate text-[15px] font-black uppercase tracking-[0.06em] text-white">{address}</h2>
          <p className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/46">
            <MapPin size={13} aria-hidden="true" className="text-cyan-100/68" />
            {city}, {state}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close selected listing"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-white/10 text-white/58 transition hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        >
          <X size={15} aria-hidden="true" />
        </button>
      </div>

      <p className="mt-4 font-serif text-[30px] font-black leading-none text-white">{formatLuxuryPrice(price)}</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatTile icon={<BedDouble size={13} />} label="Beds" value={formatStat(property.beds)} />
        <StatTile icon={<Bath size={13} />} label="Baths" value={formatStat(property.baths)} />
        <StatTile icon={<Ruler size={13} />} label="Sq Ft" value={formatStat(property.sqft)} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <SignalTile icon={<Gauge size={13} />} label="Eff" value={formatScore(property.efficiencyScore)} />
        <SignalTile icon={<ShieldCheck size={13} />} label="Res" value={formatScore(property.resilienceScore)} />
        <div className="min-w-0 rounded-[6px] border border-white/10 bg-white/[0.045] p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/36">Signal</p>
          <p className="mt-1 truncate text-[12px] font-black uppercase leading-none text-cyan-100">{getReviewSignal(property)}</p>
        </div>
      </div>

      {hasReviewFlag ? (
        <p className="mt-3 flex items-center gap-2 rounded-[6px] border border-amber-200/24 bg-amber-200/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-amber-100">
          <TriangleAlert size={13} aria-hidden="true" />
          GC review recommended before offer strategy.
        </p>
      ) : null}

      <div className="mt-4 border-t border-white/10 pt-4">
        <Link
          href={inquiryHref}
          className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[6px] bg-cyan-100 text-[10px] font-black uppercase tracking-[0.14em] text-[#061017] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        >
          Inquire
          <Mail size={13} aria-hidden="true" />
        </Link>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Link
            href={propertyHref}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[6px] border border-white/10 bg-white/[0.055] text-[10px] font-black uppercase tracking-[0.12em] text-white/72 transition hover:border-cyan-100/35 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            Details
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
          <Link
            href={getCityMarketHref(city)}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[6px] border border-white/10 bg-white/[0.055] text-[10px] font-black uppercase tracking-[0.12em] text-white/72 transition hover:border-cyan-100/35 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            Market
            <MapPin size={13} aria-hidden="true" />
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

function SignalTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[6px] border border-white/10 bg-white/[0.045] p-3">
      <div className="text-cyan-100/72">{icon}</div>
      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/36">{label}</p>
      <p className="mt-1 text-sm font-black leading-none text-white">{value}</p>
    </div>
  );
}
