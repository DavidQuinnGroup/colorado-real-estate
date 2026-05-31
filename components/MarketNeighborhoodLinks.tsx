import Link from "next/link";

import { getBlogLinks, type BlogLink } from "@/lib/linking/getBlogLinks";
import { neighborhoods } from "@/lib/neighborhoods";

type MarketNeighborhoodLinksProps = {
  city: string;
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

export default function MarketNeighborhoodLinks({
  city,
  title,
}: MarketNeighborhoodLinksProps) {
  const normalizedCity = normalizeCity(city);
  const cityNeighborhoods = neighborhoods.filter(
    (neighborhood) => normalizeCity(neighborhood.city) === normalizedCity,
  );

  if (!cityNeighborhoods.length) {
    return null;
  }

  const cityName = formatCityName(cityNeighborhoods[0]?.city ?? city);

  return (
    <section className="mt-16 border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Neighborhood Authority Graph
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title ?? `Neighborhoods in ${cityName}`}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3">
        {cityNeighborhoods.map((neighborhood) => {
          const neighborhoodHref = `/market/${normalizeCity(neighborhood.city)}/${neighborhood.slug}`;
          const brief = getFeaturedBrief(neighborhood.city, neighborhood.name);

          return (
            <div key={neighborhood.slug} className="bg-black p-5">
              <Link href={neighborhoodHref} className="group block">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-black uppercase italic tracking-tight text-white">
                      {neighborhood.name}
                    </p>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                      {neighborhood.primaryAnchor}
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                    View
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="border border-white/10 bg-white/[0.02] p-3">
                    <p className="text-[8px] font-black uppercase tracking-[0.22em] text-white/25">
                      Resilience
                    </p>
                    <p className="mt-1 text-xl font-black italic text-white">
                      {neighborhood.resilienceScore}
                    </p>
                  </div>
                  <div className="border border-white/10 bg-white/[0.02] p-3">
                    <p className="text-[8px] font-black uppercase tracking-[0.22em] text-white/25">
                      Efficiency
                    </p>
                    <p className="mt-1 text-xl font-black italic text-white">
                      {neighborhood.avgEfficiencyScore}
                    </p>
                  </div>
                </div>
              </Link>

              {brief ? (
                <Link
                  href={brief.href}
                  className="group mt-5 block border-t border-white/10 pt-4 transition-colors hover:border-[#00ff80]/50"
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
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                      Brief
                    </span>
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

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/MarketNeighborhoodLinks.tsx
