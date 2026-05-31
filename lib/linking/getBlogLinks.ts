import { articles, type ArticleIntent } from "@/lib/articles";
import { neighborhoods } from "@/lib/neighborhoods";

export type BlogLink = {
  title: string;
  href: string;
  canonicalUrl: string;
  neighborhoodHref: string;
  description: string;
  intent: ArticleIntent;
  city: string;
  neighborhood: string;
};

type GetBlogLinksOptions = {
  city?: string;
  neighborhood?: string;
  currentSlug?: string;
  limit?: number;
};

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function getNeighborhoodRoute(city: string, neighborhoodName: string) {
  const neighborhood = neighborhoods.find(
    (item) =>
      normalize(item.city) === normalize(city) &&
      normalize(item.name) === normalize(neighborhoodName),
  );

  if (!neighborhood) {
    return `/search?city=${encodeURIComponent(city)}`;
  }

  return `/market/${normalize(neighborhood.city)}/${neighborhood.slug}`;
}

export function getBlogLinks({
  city,
  neighborhood,
  currentSlug,
  limit = 6,
}: GetBlogLinksOptions = {}): BlogLink[] {
  const normalizedCity = normalize(city);
  const normalizedNeighborhood = normalize(neighborhood);
  const normalizedCurrentSlug = normalize(currentSlug);
  const safeLimit = Math.max(1, Math.min(limit, 24));

  return articles
    .filter((article) => {
      if (normalizedCity && normalize(article.city) !== normalizedCity) {
        return false;
      }

      if (normalizedNeighborhood && normalize(article.neighborhood) !== normalizedNeighborhood) {
        return false;
      }

      if (normalizedCurrentSlug && normalize(article.slug) === normalizedCurrentSlug) {
        return false;
      }

      return true;
    })
    .slice(0, safeLimit)
    .map((article) => {
      const neighborhoodHref = getNeighborhoodRoute(article.city, article.neighborhood);

      return {
        title: article.title,
        href: article.url,
        canonicalUrl: article.url,
        neighborhoodHref,
        description: article.description,
        intent: article.intent,
        city: article.city,
        neighborhood: article.neighborhood,
      };
    });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/linking/getBlogLinks.ts
