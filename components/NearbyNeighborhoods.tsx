import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowUpRight, Compass, Flame, Hammer } from 'lucide-react';

import { getBlogLinks, type BlogLink } from '@/lib/linking/getBlogLinks';
import { neighborhoods, type Neighborhood } from '@/lib/neighborhoods';

type NearbyNeighborhoodsProps = {
  city: string;
  currentSlug: string;
  limit?: number;
  title?: string;
};

function normalizeCity(value: string) {
  return value.trim().toLowerCase();
}

function formatCityName(value: string) {
  return value
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function getNeighborhoodPath(neighborhood: Neighborhood) {
  return `/market/${normalizeCity(neighborhood.city)}/${neighborhood.slug}`;
}

function getRelatedNeighborhoods(city: string, currentSlug: string, limit: number) {
  const normalizedCity = normalizeCity(city);

  return neighborhoods
    .filter((neighborhood) => normalizeCity(neighborhood.city) === normalizedCity && neighborhood.slug !== currentSlug)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, Math.max(1, limit));
}

function getFeaturedBrief(city: string, neighborhood: string): BlogLink | null {
  return getBlogLinks({
    city,
    neighborhood,
    limit: 1,
  })[0] ?? null;
}

function getRiskTone(neighborhood: Neighborhood) {
  if (neighborhood.fireRisk === 'High' || neighborhood.fireRisk === 'Extreme' || neighborhood.insuranceComplexity === 'Complex') {
    return 'text-red-300';
  }

  if (neighborhood.fireRisk === 'Moderate' || neighborhood.insuranceComplexity === 'Elevated') {
    return 'text-amber-200';
  }

  return 'text-[#00ff80]';
}

export default function NearbyNeighborhoods({ city, currentSlug, limit = 6, title }: NearbyNeighborhoodsProps) {
  const nearbyNeighborhoods = getRelatedNeighborhoods(city, currentSlug, limit);

  if (!nearbyNeighborhoods.length) {
    return null;
  }

  const cityName = formatCityName(nearbyNeighborhoods[0]?.city ?? city);
  const safeLimit = Math.max(1, limit);
  const sectionTitle = title ?? `Nearby ${cityName} Neighborhoods`;
  const briefCount = nearbyNeighborhoods.filter((neighborhood) => getFeaturedBrief(neighborhood.city, neighborhood.name)).length;

  return (
    <section
      className="mt-10 border border-white/10 bg-[#050505] p-6 text-white"
      data-testid="reie-nearby-neighborhoods"
      data-nearby-neighborhoods-title={sectionTitle}
      data-nearby-neighborhoods-city={city}
      data-nearby-neighborhoods-city-name={cityName}
      data-nearby-neighborhoods-current-slug={currentSlug}
      data-nearby-neighborhoods-requested-limit={limit}
      data-nearby-neighborhoods-limit={safeLimit}
      data-nearby-neighborhoods-count={nearbyNeighborhoods.length}
      data-nearby-neighborhoods-brief-count={briefCount}
    >
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">Adjacent Authority Hubs</p>
          <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
            {sectionTitle}
          </h2>
        </div>
        <p className="max-w-sm text-[10px] font-bold uppercase leading-relaxed tracking-[0.18em] text-white/30">
          Related neighborhood context for continued orientation. These links are not rankings or recommendations.
        </p>
      </div>

      <div
        className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3"
        data-testid="reie-nearby-neighborhoods-list"
        data-nearby-neighborhoods-list-count={nearbyNeighborhoods.length}
      >
        {nearbyNeighborhoods.map((neighborhood, index) => {
          const brief = getFeaturedBrief(neighborhood.city, neighborhood.name);
          const neighborhoodHref = getNeighborhoodPath(neighborhood);

          return (
            <div
              key={neighborhood.slug}
              className="bg-black p-5"
              data-testid="reie-nearby-neighborhood-card"
              data-nearby-neighborhood-index={index}
              data-nearby-neighborhood-slug={neighborhood.slug}
              data-nearby-neighborhood-name={neighborhood.name}
              data-nearby-neighborhood-city={neighborhood.city}
              data-nearby-neighborhood-primary-anchor={neighborhood.primaryAnchor}
              data-nearby-neighborhood-resilience-score={neighborhood.resilienceScore}
              data-nearby-neighborhood-efficiency-score={neighborhood.avgEfficiencyScore}
              data-nearby-neighborhood-fire-risk={neighborhood.fireRisk}
              data-nearby-neighborhood-insurance-complexity={neighborhood.insuranceComplexity}
              data-nearby-neighborhood-soil-type={neighborhood.soilType}
              data-nearby-neighborhood-href={neighborhoodHref}
              data-nearby-neighborhood-has-brief={brief ? 'true' : 'false'}
            >
              <Link
                href={neighborhoodHref}
                className="group block"
                data-testid="reie-nearby-neighborhood-link"
                data-nearby-neighborhood-link-href={neighborhoodHref}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-black uppercase italic tracking-tight text-white">{neighborhood.name}</p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">{neighborhood.primaryAnchor}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#00ff80] opacity-60 transition-opacity group-hover:opacity-100" />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-px bg-white/10">
                  <Metric icon={<Compass size={13} />} label="Anchor" value={neighborhood.primaryAnchor} />
                  <Metric icon={<Hammer size={13} />} label="Pattern" value={neighborhood.era} />
                  <Metric icon={<Flame size={13} />} label="Review" value={neighborhood.fireRisk} tone={getRiskTone(neighborhood)} />
                </div>

                <p className="mt-5 line-clamp-2 text-[10px] italic leading-relaxed text-white/45">{neighborhood.tacticalLever}</p>
                <p className="mt-4 border-t border-white/10 pt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-white/25">
                  {neighborhood.insuranceComplexity} insurance / {neighborhood.soilType} soil
                </p>
              </Link>

              {brief ? (
                <Link
                  href={brief.href}
                  className="group mt-4 block border-t border-white/10 pt-4 transition-colors hover:border-[#00ff80]/50"
                  data-testid="reie-nearby-neighborhood-brief-link"
                  data-nearby-neighborhood-brief-title={brief.title}
                  data-nearby-neighborhood-brief-href={brief.href}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#00ff80]/80">
                        REIE Brief
                      </p>
                      <p className="mt-2 text-xs font-black uppercase leading-5 tracking-[0.12em] text-white/68 transition-colors group-hover:text-white">
                        {brief.title}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#00ff80] opacity-60 transition-opacity group-hover:opacity-100" />
                  </div>
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
  tone = 'text-white',
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="bg-[#050505] p-3">
      <div className="mb-2 flex items-center gap-2 text-white/30">
        {icon}
        <span className="text-[8px] font-black uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className={`text-sm font-black italic uppercase ${tone}`}>{value}</p>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/NearbyNeighborhoods.tsx
