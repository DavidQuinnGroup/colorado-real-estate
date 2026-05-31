import Link from "next/link";

import { getBlogLinks } from "@/lib/linking/getBlogLinks";

type ToolLink = {
  label: string;
  href: string;
  description: string;
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
  const toolLinks: ToolLink[] = [
    {
      label: "Inventory Search Map",
      href: city ? `/search?city=${encodeURIComponent(cityName)}` : "/search",
      description: "Map-based active inventory and property intelligence",
      status: "Live",
    },
    {
      label: `${cityName} Market Report`,
      href: `/market/${buildMarketSlug(cityName)}`,
      description: "Pricing, inventory, resilience, and efficiency signals",
      status: "Report",
    },
    {
      label: `${cityName} Strategy Brief`,
      href: getCityBriefHref(cityName),
      description: "Generated REIE article brief connected to city and neighborhood authority",
      status: "Brief",
    },
    {
      label: "Colorado REIE Home",
      href: "/",
      description: "Primary real estate intelligence engine and interactive map experience",
      status: "Live",
    },
  ];

  return (
    <section className="mt-16 border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          REIE Tool Layer
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4">
        {toolLinks.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group bg-black p-5 transition-colors hover:bg-white/[0.04]"
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
