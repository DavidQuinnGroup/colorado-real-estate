import Link from "next/link";

import { getBlogLinks, type BlogLink } from "@/lib/linking/getBlogLinks";
import { neighborhoods } from "@/lib/neighborhoods";

type CityGuidesProps = {
  city: string;
  title?: string;
  limit?: number;
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

function getFeaturedBrief(city: string, neighborhood: string): BlogLink | null {
  return getBlogLinks({
    city,
    neighborhood,
    limit: 1,
  })[0] ?? null;
}

export default function CityGuides({
  city,
  title = "Neighborhood Guides",
  limit = 8,
}: CityGuidesProps) {
  const cityName = formatCityName(city);
  const cityGuides = neighborhoods
    .filter((neighborhood) => normalize(neighborhood.city) === normalize(city))
    .slice(0, Math.max(1, limit));

  if (!cityGuides.length) {
    return null;
  }

  return (
    <section className="mt-10 border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          City Guide Layer
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title}
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
        {cityGuides.map((neighborhood) => {
          const neighborhoodHref = `/market/${normalize(neighborhood.city)}/${neighborhood.slug}`;
          const brief = getFeaturedBrief(neighborhood.city, neighborhood.name);

          return (
            <li key={neighborhood.slug} className="bg-black">
              <div className="h-full p-5">
                <Link href={neighborhoodHref} className="group block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-black uppercase italic tracking-tight text-white">
                        Living in {neighborhood.name}
                      </p>
                      <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-white/30">
                        {cityName} guide / {neighborhood.primaryAnchor} / {neighborhood.avgEfficiencyScore} efficiency
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                      Open
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

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/CityGuides.tsx
