import Link from "next/link";

import { getBlogLinks, type BlogLink } from "@/lib/linking/getBlogLinks";
import { neighborhoods } from "@/lib/neighborhoods";

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
    .join(" ");
}

function getFeaturedBrief(city: string, neighborhood: string): BlogLink | null {
  return getBlogLinks({
    city,
    neighborhood,
    limit: 1,
  })[0] ?? null;
}

export default function NearbyNeighborhoods({
  city,
  currentSlug,
  limit = 6,
  title,
}: NearbyNeighborhoodsProps) {
  const normalizedCity = normalizeCity(city);
  const appliedLimit = Math.max(1, limit);
  const nearbyNeighborhoods = neighborhoods
    .filter(
      (neighborhood) =>
        normalizeCity(neighborhood.city) === normalizedCity &&
        neighborhood.slug !== currentSlug,
    )
    .slice(0, appliedLimit);

  if (!nearbyNeighborhoods.length) {
    return null;
  }

  const cityName = formatCityName(nearbyNeighborhoods[0]?.city ?? city);
  const sectionTitle = title ?? `Nearby ${cityName} Neighborhoods`;
  const nearbyNeighborhoodCards = nearbyNeighborhoods.map((neighborhood) => ({
    neighborhood,
    href: `/market/${normalizeCity(neighborhood.city)}/${neighborhood.slug}`,
    brief: getFeaturedBrief(neighborhood.city, neighborhood.name),
  }));
  const briefCount = nearbyNeighborhoodCards.filter((card) => card.brief).length;

  return (
    <section
      className="mt-16 border border-white/10 bg-[#050505] p-6 text-white"
      data-testid="reie-nearby-neighborhoods"
      data-nearby-neighborhoods-title={sectionTitle}
      data-nearby-neighborhoods-city={city}
      data-nearby-neighborhoods-normalized-city={normalizedCity}
      data-nearby-neighborhoods-current-slug={currentSlug}
      data-nearby-neighborhoods-limit={appliedLimit}
      data-nearby-neighborhoods-count={nearbyNeighborhoodCards.length}
      data-nearby-neighborhoods-brief-count={briefCount}
      data-nearby-neighborhoods-has-briefs={briefCount ? "true" : "false"}
    >
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Internal Authority Links
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {sectionTitle}
        </h2>
      </div>

      <div
        className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3"
        data-testid="reie-nearby-neighborhoods-list"
        data-nearby-neighborhoods-list-count={nearbyNeighborhoodCards.length}
      >
        {nearbyNeighborhoodCards.map(({ neighborhood, href, brief }) => (
          <div
            key={neighborhood.slug}
            className="bg-black p-5"
            data-testid="reie-nearby-neighborhood-card"
            data-nearby-neighborhood-slug={neighborhood.slug}
            data-nearby-neighborhood-name={neighborhood.name}
            data-nearby-neighborhood-city={neighborhood.city}
            data-nearby-neighborhood-primary-anchor={neighborhood.primaryAnchor}
            data-nearby-neighborhood-fire-risk={neighborhood.fireRisk}
            data-nearby-neighborhood-insurance-complexity={neighborhood.insuranceComplexity}
            data-nearby-neighborhood-href={href}
            data-nearby-neighborhood-has-brief={brief ? "true" : "false"}
          >
            <Link
              href={href}
              className="group block"
              data-testid="reie-nearby-neighborhood-link"
              data-nearby-neighborhood-link-href={href}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-black uppercase italic tracking-tight text-white">
                    {neighborhood.name}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                    {neighborhood.primaryAnchor}
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                  Open
                </span>
              </div>

              <p className="mt-4 border-t border-white/10 pt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-white/25">
                {neighborhood.fireRisk} fire risk / {neighborhood.insuranceComplexity} insurance
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
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#00ff80]/80">
                  REIE Brief
                </p>
                <p className="mt-2 text-xs font-black uppercase leading-5 tracking-[0.12em] text-white/68 transition-colors group-hover:text-white">
                  {brief.title}
                </p>
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/internal-links/NearbyNeighborhoods.tsx
