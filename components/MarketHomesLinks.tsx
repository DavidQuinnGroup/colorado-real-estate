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
  const sectionTitle = title ?? `Homes For Sale in ${cityName}`;
  const searchLinks = searchTypes.map((type) => ({
    type,
    label: type.title.replace("CITY", cityName),
    description: type.description.replace("CITY", cityName),
    href: buildSearchHref(cityName, type.slug),
  }));

  return (
    <section
      className="mt-16 border border-white/10 bg-[#050505] p-6 text-white"
      data-testid="reie-market-homes-links"
      data-market-homes-links-title={sectionTitle}
      data-market-homes-links-city={city}
      data-market-homes-links-city-name={cityName}
      data-market-homes-links-requested-limit={limit}
      data-market-homes-links-limit={safeLimit}
      data-market-homes-links-search-count={searchLinks.length}
      data-market-homes-links-brief-count={brief ? 1 : 0}
      data-market-homes-links-count={searchLinks.length + (brief ? 1 : 0)}
      data-market-homes-links-has-brief={brief ? "true" : "false"}
      data-market-homes-links-brief-href={brief?.href ?? ""}
    >
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Inventory Search Paths
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {sectionTitle}
        </h2>
      </div>

      <div
        className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3"
        data-testid="reie-market-homes-links-list"
        data-market-homes-links-list-count={searchLinks.length + (brief ? 1 : 0)}
      >
        {searchLinks.map(({ type, label, description, href }, index) => (
          <Link
            key={type.slug}
            href={href}
            className="reie-market-action-link group bg-black p-5 transition-colors hover:bg-white/[0.04]"
            data-testid="reie-market-homes-search-link"
            data-market-homes-link-index={index}
            data-market-homes-link-kind="search"
            data-market-homes-link-type-slug={type.slug}
            data-market-homes-link-label={label}
            data-market-homes-link-description={description}
            data-market-homes-link-href={href}
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
        ))}

        {brief ? (
          <Link
            href={brief.href}
            className="reie-market-action-link group bg-black p-5 transition-colors hover:bg-white/[0.04]"
            data-testid="reie-market-homes-brief-link"
            data-market-homes-link-index={searchLinks.length}
            data-market-homes-link-kind="brief"
            data-market-homes-link-label={brief.title}
            data-market-homes-link-description={brief.description}
            data-market-homes-link-href={brief.href}
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
