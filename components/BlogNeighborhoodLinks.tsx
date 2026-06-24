import Link from "next/link";

import { getBlogLinks, type BlogLink } from "@/lib/linking/getBlogLinks";
import { neighborhoods } from "@/lib/neighborhoods";

type BlogNeighborhoodLinksProps = {
  city: string;
  title?: string;
};

function normalizeCity(value: string) {
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

export default function BlogNeighborhoodLinks({
  city,
  title,
}: BlogNeighborhoodLinksProps) {
  const normalizedCity = normalizeCity(city);
  const cityNeighborhoods = neighborhoods.filter(
    (neighborhood) => normalizeCity(neighborhood.city) === normalizedCity,
  );

  if (!cityNeighborhoods.length) {
    return null;
  }

  const cityName = formatCityName(cityNeighborhoods[0]?.city ?? city);
  const sectionTitle = title ?? `Explore Neighborhoods in ${cityName}`;
  const neighborhoodCards = cityNeighborhoods.map((neighborhood) => ({
    neighborhood,
    href: `/market/${normalizeCity(neighborhood.city)}/${neighborhood.slug}`,
    brief: getFeaturedBrief(neighborhood.city, neighborhood.name),
  }));
  const briefCount = neighborhoodCards.filter((card) => card.brief).length;

  return (
    <section
      className="mt-16 border border-white/10 bg-[#050505] p-6 text-white"
      data-testid="reie-blog-neighborhood-links"
      data-blog-neighborhood-links-title={sectionTitle}
      data-blog-neighborhood-links-city={city}
      data-blog-neighborhood-links-city-name={cityName}
      data-blog-neighborhood-links-normalized-city={normalizedCity}
      data-blog-neighborhood-links-count={neighborhoodCards.length}
      data-blog-neighborhood-links-brief-count={briefCount}
      data-blog-neighborhood-links-has-briefs={briefCount ? "true" : "false"}
    >
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Related Neighborhood Intelligence
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {sectionTitle}
        </h2>
      </div>

      <div
        className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3"
        data-testid="reie-blog-neighborhood-links-list"
        data-blog-neighborhood-links-list-count={neighborhoodCards.length}
      >
        {neighborhoodCards.map(({ neighborhood, href, brief }, index) => (
          <div
            key={neighborhood.slug}
            className="bg-black p-5"
            data-testid="reie-blog-neighborhood-card"
            data-blog-neighborhood-index={index}
            data-blog-neighborhood-slug={neighborhood.slug}
            data-blog-neighborhood-name={neighborhood.name}
            data-blog-neighborhood-city={neighborhood.city}
            data-blog-neighborhood-primary-anchor={neighborhood.primaryAnchor}
            data-blog-neighborhood-href={href}
            data-blog-neighborhood-has-brief={brief ? "true" : "false"}
          >
            <Link
              href={href}
              className="group block"
              data-testid="reie-blog-neighborhood-link"
              data-blog-neighborhood-link-href={href}
            >
              <p className="text-lg font-black uppercase italic tracking-tight text-white">
                {neighborhood.name}
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                {neighborhood.primaryAnchor}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                  Authority Report
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                  Open
                </span>
              </div>
            </Link>

            {brief ? (
              <Link
                href={brief.href}
                className="group mt-4 block border-t border-white/10 pt-4 transition-colors hover:border-[#00ff80]/50"
                data-testid="reie-blog-neighborhood-brief-link"
                data-blog-neighborhood-brief-title={brief.title}
                data-blog-neighborhood-brief-description={brief.description}
                data-blog-neighborhood-brief-href={brief.href}
              >
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#00ff80]/80">
                  REIE Brief
                </p>
                <p className="mt-2 text-xs font-black uppercase leading-5 tracking-[0.12em] text-white/68 transition-colors group-hover:text-white">
                  {brief.title}
                </p>
                <p className="mt-2 line-clamp-2 text-[10px] font-bold uppercase leading-5 tracking-[0.16em] text-white/28">
                  {brief.description}
                </p>
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/BlogNeighborhoodLinks.tsx
