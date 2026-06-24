import Link from "next/link";

import { getBlogLinks } from "@/lib/linking/getBlogLinks";

type NeighborhoodArticlesProps = {
  city: string;
  neighborhood?: string;
  title?: string;
  limit?: number;
};

function formatCityName(value: string) {
  return value
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function NeighborhoodArticles({
  city,
  neighborhood,
  title,
  limit = 5,
}: NeighborhoodArticlesProps) {
  const articleLinks = getBlogLinks({
    city,
    neighborhood,
    limit,
  });

  if (!articleLinks.length) {
    return null;
  }

  const cityName = formatCityName(city);
  const sectionTitle = title ?? `Related ${cityName} Intelligence`;

  return (
    <section
      className="mt-12 border border-white/10 bg-[#050505] p-6 text-white"
      data-testid="reie-neighborhood-articles"
      data-neighborhood-articles-title={sectionTitle}
      data-neighborhood-articles-city={city}
      data-neighborhood-articles-city-name={cityName}
      data-neighborhood-articles-neighborhood={neighborhood ?? ""}
      data-neighborhood-articles-has-neighborhood={neighborhood ? "true" : "false"}
      data-neighborhood-articles-limit={limit}
      data-neighborhood-articles-count={articleLinks.length}
    >
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Related Content Signals
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {sectionTitle}
        </h2>
      </div>

      <div
        className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2"
        data-testid="reie-neighborhood-articles-list"
        data-neighborhood-articles-list-count={articleLinks.length}
      >
        {articleLinks.map((article, index) => (
          <Link
            key={`${article.intent}-${article.href}-${article.title}`}
            href={article.href}
            className="group bg-black p-5 transition-colors hover:bg-white/[0.04]"
            data-testid="reie-neighborhood-article-link"
            data-neighborhood-article-index={index}
            data-neighborhood-article-intent={article.intent}
            data-neighborhood-article-title={article.title}
            data-neighborhood-article-description={article.description}
            data-neighborhood-article-neighborhood={article.neighborhood}
            data-neighborhood-article-city={article.city}
            data-neighborhood-article-href={article.href}
          >
            <span className="text-[9px] font-black uppercase tracking-[0.24em] text-[#00ff80]">
              {article.intent}
            </span>
            <span className="mt-3 block text-sm font-black uppercase leading-6 tracking-tight text-white">
              {article.title}
            </span>
            <span className="mt-3 line-clamp-3 block text-xs leading-6 text-white/52">
              {article.description}
            </span>
            <span className="mt-4 block text-[9px] font-bold uppercase leading-5 tracking-[0.18em] text-white/30">
              {article.neighborhood}, {article.city}
            </span>
            <span className="mt-3 block text-[9px] font-black uppercase tracking-[0.22em] text-[#00ff80]/70">
              Open Brief
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/NeighborhoodArticles.tsx
