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
  const related = getBlogLinks({
    city,
    currentSlug,
    limit,
  });

  if (!related.length) {
    return null;
  }

  const cityName = formatCityName(city);

  return (
    <section className="mt-12 border-t border-white/10 pt-8">
      <p className="text-[10px] font-black uppercase tracking-[0.34em] text-white/35">
        Related Intelligence
      </p>
      <h2 className="mt-3 text-2xl font-black uppercase italic tracking-tight text-white">
        {title ?? `${cityName} Market Briefs`}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {related.map((article) => (
          <Link
            key={`${article.intent}-${article.href}-${article.title}`}
            href={article.href}
            className="group border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-cyan-300/50 hover:bg-cyan-300/10"
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
