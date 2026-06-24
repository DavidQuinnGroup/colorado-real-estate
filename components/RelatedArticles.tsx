import Link from "next/link";

import { getBlogLinks } from "@/lib/linking/getBlogLinks";

type RelatedArticlesProps = {
  city: string;
  currentSlug: string;
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

export default function RelatedArticles({
  city,
  currentSlug,
  title,
  limit = 4,
}: RelatedArticlesProps) {
  const safeLimit = Math.max(1, limit);
  const related = getBlogLinks({
    city,
    currentSlug,
    limit: safeLimit,
  });

  if (!related.length) {
    return null;
  }

  const cityName = formatCityName(city);
  const sectionTitle = title ?? `${cityName} Market Briefs`;

  return (
    <section
      className="mt-12 border-t border-white/10 pt-8"
      data-testid="reie-related-articles"
      data-related-articles-title={sectionTitle}
      data-related-articles-city={city}
      data-related-articles-city-name={cityName}
      data-related-articles-current-slug={currentSlug}
      data-related-articles-requested-limit={limit}
      data-related-articles-limit={safeLimit}
      data-related-articles-count={related.length}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.34em] text-white/35">
        Related Intelligence
      </p>
      <h2 className="mt-3 text-2xl font-black uppercase italic tracking-tight text-white">
        {sectionTitle}
      </h2>

      <div
        className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2"
        data-testid="reie-related-articles-list"
        data-related-articles-list-count={related.length}
      >
        {related.map((article, index) => (
          <Link
            key={`${article.intent}-${article.href}-${article.title}`}
            href={article.href}
            className="group border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-cyan-300/50 hover:bg-cyan-300/10"
            data-testid="reie-related-article-link"
            data-related-article-index={index}
            data-related-article-intent={article.intent}
            data-related-article-title={article.title}
            data-related-article-description={article.description}
            data-related-article-neighborhood={article.neighborhood}
            data-related-article-city={article.city}
            data-related-article-href={article.href}
          >
            <span className="text-[9px] font-black uppercase tracking-[0.24em] text-cyan-300">
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
            <span className="mt-3 block text-[9px] font-black uppercase tracking-[0.22em] text-cyan-300/70">
              Open Brief
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/RelatedArticles.tsx
