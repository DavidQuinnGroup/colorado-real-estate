import Link from "next/link";

import { getBlogLinks } from "@/lib/linking/getBlogLinks";

type ToolLink = {
  label: string;
  href: string;
  description: string;
  kind: "search" | "market" | "brief" | "home";
  status: "Live" | "Brief" | "Report";
};

type ToolLinksProps = {
  title?: string;
  city?: string;
};

function formatCityName(city: string) {
  return city
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function buildMarketSlug(cityName: string) {
  return `${cityName.toLowerCase().replace(/\s+/g, "-")}-co-housing-market`;
}

function getCityBriefHref(cityName: string) {
  return getBlogLinks({ city: cityName, limit: 1 })[0]?.href ?? `/articles/${cityName.toLowerCase().replace(/\s+/g, "-")}-real-estate-intelligence`;
}

export default function ToolLinks({
  title = "Real Estate Intelligence Tools",
  city,
}: ToolLinksProps) {
  const cityName = formatCityName(city ?? "Boulder");
  const marketSlug = buildMarketSlug(cityName);
  const briefHref = getCityBriefHref(cityName);
  const toolLinks: ToolLink[] = [
    {
      label: "Inventory Search Map",
      href: city ? `/search?city=${encodeURIComponent(cityName)}` : "/search",
      description: "Map-based active inventory and property intelligence",
      kind: "search",
      status: "Live",
    },
    {
      label: `${cityName} Market Report`,
      href: `/market/${marketSlug}`,
      description: "Pricing, inventory, resilience, and efficiency signals",
      kind: "market",
      status: "Report",
    },
    {
      label: `${cityName} Strategy Brief`,
      href: briefHref,
      description: "Generated REIE article brief connected to city and neighborhood authority",
      kind: "brief",
      status: "Brief",
    },
    {
      label: "Colorado REIE Home",
      href: "/",
      description: "Primary real estate intelligence engine and interactive map experience",
      kind: "home",
      status: "Live",
    },
  ];

  return (
    <section
      className="mt-16 border border-white/10 bg-[#050505] p-6 text-white"
      data-testid="reie-tool-links"
      data-tool-links-title={title}
      data-tool-links-input-city={city || ""}
      data-tool-links-city={cityName}
      data-tool-links-uses-default-city={city ? "false" : "true"}
      data-tool-links-market-slug={marketSlug}
      data-tool-links-brief-href={briefHref}
      data-tool-links-count={toolLinks.length}
    >
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          REIE Tool Layer
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title}
        </h2>
      </div>

      <div
        className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4"
        data-testid="reie-tool-links-list"
        data-tool-links-list-count={toolLinks.length}
      >
        {toolLinks.map((tool, index) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group bg-black p-5 transition-colors hover:bg-white/[0.04]"
            data-testid="reie-tool-link"
            data-tool-link-index={index}
            data-tool-link-kind={tool.kind}
            data-tool-link-status={tool.status}
            data-tool-link-label={tool.label}
            data-tool-link-href={tool.href}
            data-tool-link-description={tool.description}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-black uppercase italic tracking-tight text-white">
                  {tool.label}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-white/30">
                  {tool.description}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                {tool.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/internal-links/ToolLinks.tsx
