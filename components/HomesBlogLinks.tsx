import Link from "next/link";

import { cities } from "@/lib/cities";
import { getBlogLinks } from "@/lib/linking/getBlogLinks";

type HomesBlogLinksProps = {
  city: string;
  type?: "homes" | "condos" | "luxury" | string;
  title?: string;
};

type GuideLink = {
  eyebrow: string;
  label: string;
  href: string;
  description: string;
  kind: "search" | "market" | "strategy" | "brief";
  intent?: string;
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

function getMarketSlug(cityName: string) {
  const cityData = cities.find((city) => normalize(city.name) === normalize(cityName));
  return cityData?.marketSlug ?? `${normalize(cityName).replace(/\s+/g, "-")}-co-housing-market`;
}

function getArticleBriefHref(cityName: string, type: string) {
  const intent = type === "luxury" ? "Investment" : type === "condos" ? "Efficiency" : "Lifestyle";
  const article = getBlogLinks({ city: cityName, limit: 12 }).find((link) => link.intent === intent);

  return article?.href ?? `/articles/${normalize(cityName).replace(/\s+/g, "-")}-real-estate-intelligence`;
}

function getArticleIntent(type: string) {
  return type === "luxury" ? "Investment" : type === "condos" ? "Efficiency" : "Lifestyle";
}

function getGuideLinks(cityName: string, type: string): GuideLink[] {
  const marketHref = `/market/${getMarketSlug(cityName)}`;
  const searchHref = `/search?city=${encodeURIComponent(cityName)}`;
  const articleHref = getArticleBriefHref(cityName, type);

  if (type === "condos") {
    return [
      {
        eyebrow: "Inventory",
        label: `${cityName} Condo Inventory`,
        href: searchHref,
        description: "Map-based search for attached-home and condo opportunities",
        kind: "search",
      },
      {
        eyebrow: "Market",
        label: `${cityName} Condo Market Context`,
        href: marketHref,
        description: "Pricing, absorption, and local market pressure signals",
        kind: "market",
      },
      {
        eyebrow: "Efficiency",
        label: `${cityName} Lifestyle Efficiency`,
        href: marketHref,
        description: "Neighborhood and daily-routine intelligence for condo buyers",
        kind: "strategy",
      },
      {
        eyebrow: "Brief",
        label: `${cityName} Efficiency Brief`,
        href: articleHref,
        description: "Generated REIE article brief tied to local lifestyle and time-value signals",
        kind: "brief",
        intent: getArticleIntent(type),
      },
    ];
  }

  if (type === "luxury") {
    return [
      {
        eyebrow: "Inventory",
        label: `${cityName} Luxury Inventory`,
        href: searchHref,
        description: "Live map search for upper-tier homes and private-market candidates",
        kind: "search",
      },
      {
        eyebrow: "Market",
        label: `${cityName} Luxury Market Report`,
        href: marketHref,
        description: "High-end pricing, scarcity, and negotiation context",
        kind: "market",
      },
      {
        eyebrow: "Forensics",
        label: `${cityName} Construction Forensics`,
        href: marketHref,
        description: "GC-level risk signals behind premium finishes and location",
        kind: "strategy",
      },
      {
        eyebrow: "Brief",
        label: `${cityName} Investment Brief`,
        href: articleHref,
        description: "Generated REIE article brief on construction DNA and value risk",
        kind: "brief",
        intent: getArticleIntent(type),
      },
    ];
  }

  return [
    {
      eyebrow: "Inventory",
      label: `${cityName} Homes for Sale`,
      href: searchHref,
      description: "Live active inventory with map-based market context",
      kind: "search",
    },
    {
      eyebrow: "Market",
      label: `${cityName} Housing Market`,
      href: marketHref,
      description: "Pricing, inventory, resilience, and efficiency intelligence",
      kind: "market",
    },
    {
      eyebrow: "Neighborhoods",
      label: `${cityName} Neighborhood Strategy`,
      href: marketHref,
      description: "Local lifestyle, construction, and negotiation signals",
      kind: "strategy",
    },
    {
      eyebrow: "Brief",
      label: `${cityName} Lifestyle Brief`,
      href: articleHref,
      description: "Generated REIE article brief connected to neighborhood lifestyle intelligence",
      kind: "brief",
      intent: getArticleIntent(type),
    },
  ];
}

export default function HomesBlogLinks({
  city,
  type = "homes",
  title,
}: HomesBlogLinksProps) {
  const cityName = formatCityName(city);
  const sectionTitle = title ?? `Real Estate Guides for ${cityName}`;
  const marketSlug = getMarketSlug(cityName);
  const guideLinks = getGuideLinks(cityName, type);
  const brief = guideLinks.find((guide) => guide.kind === "brief");

  return (
    <section
      className="mt-16 border border-white/10 bg-[#050505] p-6 text-white"
      data-testid="reie-homes-blog-links"
      data-homes-blog-links-title={sectionTitle}
      data-homes-blog-links-city={city}
      data-homes-blog-links-city-name={cityName}
      data-homes-blog-links-type={type}
      data-homes-blog-links-market-slug={marketSlug}
      data-homes-blog-links-count={guideLinks.length}
      data-homes-blog-links-has-brief={brief ? "true" : "false"}
      data-homes-blog-links-brief-intent={brief?.intent ?? ""}
      data-homes-blog-links-brief-href={brief?.href ?? ""}
    >
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Real Estate Guide Links
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {sectionTitle}
        </h2>
      </div>

      <div
        className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4"
        data-testid="reie-homes-blog-links-list"
        data-homes-blog-links-list-count={guideLinks.length}
      >
        {guideLinks.map((guide, index) => (
          <Link
            key={`${guide.href}-${guide.label}`}
            href={guide.href}
            className="group bg-black p-5 transition-colors hover:bg-white/[0.04]"
            data-testid="reie-homes-blog-link"
            data-homes-blog-link-index={index}
            data-homes-blog-link-kind={guide.kind}
            data-homes-blog-link-eyebrow={guide.eyebrow}
            data-homes-blog-link-label={guide.label}
            data-homes-blog-link-description={guide.description}
            data-homes-blog-link-href={guide.href}
            data-homes-blog-link-intent={guide.intent ?? ""}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-3 text-[9px] font-black uppercase tracking-[0.24em] text-[#00ff80]">
                  {guide.eyebrow}
                </p>
                <p className="text-base font-black uppercase italic tracking-tight text-white">
                  {guide.label}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-white/30">
                  {guide.description}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                Open
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/HomesBlogLinks.tsx
