import Link from "next/link";

import { cities } from "@/lib/cities";
import { getBlogLinks } from "@/lib/linking/getBlogLinks";
import { neighborhoods } from "@/lib/neighborhoods";

type CityLinksProps = {
  city: string;
  title?: string;
};

type InternalLink = {
  label: string;
  href: string;
  description: string;
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

function getCityData(city: string) {
  const normalizedCity = normalize(city);

  return cities.find((item) => {
    const candidates = [item.name, item.slug, item.marketSlug].map(normalize);
    return candidates.includes(normalizedCity);
  });
}

function getCityBriefHref(cityName: string) {
  return getBlogLinks({ city: cityName, limit: 1 })[0]?.href ?? `/articles/${normalize(cityName).replace(/\s+/g, "-")}-real-estate-intelligence`;
}

export default function CityLinks({ city, title }: CityLinksProps) {
  const cityData = getCityData(city);
  const cityName = cityData?.name ?? formatCityName(city);
  const marketSlug = cityData?.marketSlug ?? `${normalize(cityName).replace(/\s+/g, "-")}-co-housing-market`;
  const cityNeighborhoods = neighborhoods
    .filter((neighborhood) => normalize(neighborhood.city) === normalize(cityName))
    .slice(0, 3);

  const links: InternalLink[] = [
    {
      label: `${cityName} Search Map`,
      href: `/search?city=${encodeURIComponent(cityName)}`,
      description: "Live inventory and map-based property intelligence",
    },
    {
      label: `${cityName} Housing Market`,
      href: `/market/${marketSlug}`,
      description: "Market health, efficiency, and local strategy report",
    },
    {
      label: `${cityName} Strategy Brief`,
      href: getCityBriefHref(cityName),
      description: "Generated REIE article brief connected to local authority signals",
    },
    ...cityNeighborhoods.map((neighborhood) => ({
      label: `${neighborhood.name} Intelligence`,
      href: `/market/${normalize(neighborhood.city)}/${neighborhood.slug}`,
      description: `${neighborhood.primaryAnchor} neighborhood authority report`,
    })),
  ];

  return (
    <section className="mt-16 border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          City Authority Links
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title ?? `Explore ${cityName} Real Estate`}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group bg-black p-5 transition-colors hover:bg-white/[0.04]"
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
                Open
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/internal-links/CityLinks.tsx
