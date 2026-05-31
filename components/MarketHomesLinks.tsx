import Link from "next/link";

import { getBlogLinks, type BlogLink } from "@/lib/linking/getBlogLinks";
import { propertySearchTypes } from "@/lib/propertySearchTypes";

type MarketHomesLinksProps = {
  city: string;
  title?: string;
  limit?: number;
};

function formatCityName(value: string) {
  return value
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function buildSearchHref(city: string, typeSlug: string) {
  const params = new URLSearchParams({
    city,
    type: typeSlug,
  });

  return `/search?${params.toString()}`;
}

function getCityBrief(cityName: string): BlogLink | null {
  return getBlogLinks({
    city: cityName,
    limit: 1,
  })[0] ?? null;
}

export default function MarketHomesLinks({
  city,
  title,
  limit = 6,
}: MarketHomesLinksProps) {
  const cityName = formatCityName(city);
  const safeLimit = Math.max(1, Math.min(limit, propertySearchTypes.length));
  const searchTypes = propertySearchTypes.slice(0, safeLimit);
  const brief = getCityBrief(cityName);

  return (
    <section className="mt-16 border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Inventory Search Paths
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title ?? `Homes For Sale in ${cityName}`}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3">
        {searchTypes.map((type) => {
          const label = type.title.replace("CITY", cityName);
          const description = type.description.replace("CITY", cityName);

          return (
            <Link
              key={type.slug}
              href={buildSearchHref(cityName, type.slug)}
              className="group bg-black p-5 transition-colors hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-black uppercase italic tracking-tight text-white">
                    {label}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-white/30">
                    {description}
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                  Search
                </span>
              </div>
            </Link>
          );
        })}

        {brief ? (
          <Link
            href={brief.href}
            className="group bg-black p-5 transition-colors hover:bg-white/[0.04]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-3 text-[9px] font-black uppercase tracking-[0.24em] text-[#00ff80]">
                  REIE Brief
                </p>
                <p className="text-base font-black uppercase italic tracking-tight text-white">
                  {brief.title}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-white/30">
                  {brief.description}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                Brief
              </span>
            </div>
          </Link>
        ) : null}
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/MarketHomesLinks.tsx
