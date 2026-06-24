import Link from "next/link";

import { cities } from "@/lib/cities";
import { getBlogLinks } from "@/lib/linking/getBlogLinks";

type MarketLinksProps = {
  currentMarketSlug?: string;
  limit?: number;
  title?: string;
};

type MarketLink = {
  label: string;
  href: string;
  description: string;
  kind: "market" | "brief";
  status: "Report" | "Brief";
  sourceCity: string;
  marketSlug?: string;
  score?: number;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function MarketLinks({
  currentMarketSlug,
  limit = 6,
  title = "Related Colorado Market Reports",
}: MarketLinksProps) {
  const normalizedCurrent = currentMarketSlug ? normalize(currentMarketSlug) : null;
  const appliedLimit = Math.max(1, limit);
  const relatedCities = cities
    .filter((city) => city.marketSlug && normalize(city.marketSlug) !== normalizedCurrent)
    .slice(0, appliedLimit);
  const marketLinks: MarketLink[] = relatedCities.map((city) => ({
    label: `${city.name} Housing Market`,
    href: `/market/${city.marketSlug}`,
    description: `${city.stats.medianPrice} median price / ${city.stats.inventory} active listings`,
    kind: "market",
    status: "Report",
    sourceCity: city.name,
    marketSlug: city.marketSlug,
    score: city.stats.marketHealthScore,
  }));
  const briefLinks: MarketLink[] = relatedCities
    .flatMap((city) =>
      getBlogLinks({ city: city.name, limit: 1 }).map((article) => ({
        label: `${city.name} Strategy Brief`,
        href: article.href,
        description: article.description,
        kind: "brief" as const,
        status: "Brief" as const,
        sourceCity: city.name,
        marketSlug: city.marketSlug,
      })),
    )
    .slice(0, 2);
  const links = [...marketLinks, ...briefLinks];

  if (!links.length) {
    return null;
  }

  return (
    <section
      className="mt-16 border border-white/10 bg-[#050505] p-6 text-white"
      data-testid="reie-market-links"
      data-market-links-title={title}
      data-market-links-current-market-slug={currentMarketSlug || ""}
      data-market-links-normalized-current={normalizedCurrent || ""}
      data-market-links-limit={appliedLimit}
      data-market-links-related-city-count={relatedCities.length}
      data-market-links-report-count={marketLinks.length}
      data-market-links-brief-count={briefLinks.length}
      data-market-links-count={links.length}
      data-market-links-has-briefs={briefLinks.length ? "true" : "false"}
    >
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Market Authority Links
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title}
        </h2>
      </div>

      <div
        className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3"
        data-testid="reie-market-links-list"
        data-market-links-list-count={links.length}
      >
        {links.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            className="group bg-black p-5 transition-colors hover:bg-white/[0.04]"
            data-testid="reie-market-link"
            data-market-link-index={index}
            data-market-link-kind={link.kind}
            data-market-link-status={link.status}
            data-market-link-label={link.label}
            data-market-link-source-city={link.sourceCity}
            data-market-link-market-slug={link.marketSlug || ""}
            data-market-link-href={link.href}
            data-market-link-description={link.description}
            data-market-link-score={link.score ?? ""}
            data-market-link-has-score={typeof link.score === "number" ? "true" : "false"}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-black uppercase italic tracking-tight text-white">
                  {link.label}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-white/30">
                  {link.description}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                {link.status}
              </span>
            </div>

            {typeof link.score === "number" ? (
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/25">
                  Market health
                </p>
                <p className="mt-1 text-2xl font-black italic tracking-tight text-white">
                  {link.score}%
                </p>
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/internal-links/MarketLinks.tsx
