import Link from "next/link";

import { cities } from "@/lib/cities";
import { getBlogLinks, type BlogLink } from "@/lib/linking/getBlogLinks";

type NeighborhoodMarketLinkProps = {
  city: string;
  title?: string;
};

function normalize(value: string) {
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

function getCityMarket(cityName: string) {
  return cities.find((city) => normalize(city.name) === normalize(cityName));
}

function getMarketSlug(cityName: string) {
  return getCityMarket(cityName)?.marketSlug ?? `${normalize(cityName).replace(/\s+/g, "-")}-co-housing-market`;
}

function getCityBrief(cityName: string): BlogLink | null {
  return getBlogLinks({
    city: cityName,
    limit: 1,
  })[0] ?? null;
}

export default function NeighborhoodMarketLink({
  city,
  title,
}: NeighborhoodMarketLinkProps) {
  const cityName = formatCityName(city);
  const cityMarket = getCityMarket(cityName);
  const marketSlug = getMarketSlug(cityName);
  const marketHref = `/market/${marketSlug}`;
  const brief = getCityBrief(cityName);
  const sectionTitle = title ?? `${cityName} Housing Market`;

  return (
    <section
      className="mt-16 border border-white/10 bg-[#050505] p-6 text-white"
      data-testid="reie-neighborhood-market-link"
      data-neighborhood-market-link-title={sectionTitle}
      data-neighborhood-market-link-city={city}
      data-neighborhood-market-link-city-name={cityName}
      data-neighborhood-market-link-market-slug={marketSlug}
      data-neighborhood-market-link-market-href={marketHref}
      data-neighborhood-market-link-has-market={cityMarket ? "true" : "false"}
      data-neighborhood-market-link-median-price={cityMarket?.stats.medianPrice ?? ""}
      data-neighborhood-market-link-inventory={cityMarket?.stats.inventory ?? ""}
      data-neighborhood-market-link-days-on-market={cityMarket?.stats.daysOnMarket ?? ""}
      data-neighborhood-market-link-has-brief={brief ? "true" : "false"}
      data-neighborhood-market-link-brief-href={brief?.href ?? ""}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
        City Market Context
      </p>
      <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
        {sectionTitle}
      </h2>

      <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
        See current housing trends, pricing, inventory, and local strategy signals for{" "}
        {cityName}.
      </p>

      {cityMarket ? (
        <div className="mt-5 flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
          <span>{cityMarket.stats.medianPrice} median</span>
          <span>{cityMarket.stats.inventory} active</span>
          <span>{cityMarket.stats.daysOnMarket} DOM</span>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={marketHref}
          className="inline-block bg-white px-5 py-3 text-[10px] font-black uppercase italic tracking-[0.25em] text-black transition-colors hover:bg-[#00ff80]"
          data-testid="reie-neighborhood-market-report-link"
          data-neighborhood-market-report-link-href={marketHref}
        >
          View {cityName} Housing Market Report
        </Link>

        {brief ? (
          <Link
            href={brief.href}
            className="inline-block border border-white/15 px-5 py-3 text-[10px] font-black uppercase italic tracking-[0.25em] text-white transition-colors hover:border-[#00ff80] hover:text-[#00ff80]"
            data-testid="reie-neighborhood-market-brief-link"
            data-neighborhood-market-brief-title={brief.title}
            data-neighborhood-market-brief-description={brief.description}
            data-neighborhood-market-brief-href={brief.href}
          >
            Open {cityName} REIE Brief
          </Link>
        ) : null}
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/NeighborhoodMarketLink.tsx
