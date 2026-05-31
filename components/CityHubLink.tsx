import Link from "next/link";

import { cities } from "@/lib/cities";
import { getBlogLinks, type BlogLink } from "@/lib/linking/getBlogLinks";

type CityHubLinkProps = {
  city: string;
  label?: string;
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

function getCityBrief(cityName: string): BlogLink | null {
  return getBlogLinks({
    city: cityName,
    limit: 1,
  })[0] ?? null;
}

export default function CityHubLink({ city, label }: CityHubLinkProps) {
  const cityName = formatCityName(city);
  const href = `/market/${getMarketSlug(cityName)}`;
  const brief = getCityBrief(cityName);

  return (
    <div className="mt-16 grid gap-px overflow-hidden border border-white/10 bg-white/10 text-white md:grid-cols-[1.35fr_1fr]">
      <Link
        href={href}
        className="group block bg-[#050505] p-5 transition-colors hover:bg-white/[0.04]"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          City Authority Hub
        </p>
        <p className="mt-3 text-lg font-black uppercase italic tracking-tight text-white">
          {label ?? `Explore everything about living in ${cityName}`}
        </p>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
          Market report, neighborhood strategy, and local real estate intelligence
        </p>
        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
          View Market Report
        </p>
      </Link>

      {brief ? (
        <Link
          href={brief.href}
          className="group block bg-black p-5 transition-colors hover:bg-white/[0.04]"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
            REIE Strategy Brief
          </p>
          <p className="mt-3 text-sm font-black uppercase italic leading-6 tracking-tight text-white/75 transition-colors group-hover:text-white">
            {brief.title}
          </p>
          <p className="mt-3 line-clamp-2 text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-white/30">
            {brief.description}
          </p>
          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
            Open Brief
          </p>
        </Link>
      ) : null}
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/CityHubLink.tsx
