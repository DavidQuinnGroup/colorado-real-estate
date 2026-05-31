import Link from "next/link";

import { cities } from "@/lib/cities";
import { getBlogLinks, type BlogLink } from "@/lib/linking/getBlogLinks";

type CityNavigationProps = {
  title?: string;
  limit?: number;
};

function getCityBrief(cityName: string): BlogLink | null {
  return getBlogLinks({
    city: cityName,
    limit: 1,
  })[0] ?? null;
}

export default function CityNavigation({
  title = "Explore Colorado Market Reports",
  limit = cities.length,
}: CityNavigationProps) {
  const cityLinks = cities.slice(0, Math.max(1, Math.min(limit, cities.length)));

  return (
    <section className="mt-12 border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          City Market Navigation
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title}
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {cityLinks.map((city) => {
          const brief = getCityBrief(city.name);

          return (
            <li key={city.marketSlug} className="bg-black">
              <div className="h-full p-5">
                <Link href={`/market/${city.marketSlug}`} className="group block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-black uppercase italic tracking-tight text-white">
                        {city.name} Real Estate
                      </p>
                      <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-white/30">
                        {city.stats.medianPrice} median / {city.stats.inventory} active /{" "}
                        {city.stats.daysOnMarket} DOM
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                      Report
                    </span>
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
                        <p className="mt-2 line-clamp-2 text-[10px] font-bold uppercase leading-5 tracking-[0.16em] text-white/28">
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
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/CityNavigation.tsx
