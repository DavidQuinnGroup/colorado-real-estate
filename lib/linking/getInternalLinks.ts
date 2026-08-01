import { cities, isCityMarketRoutePublic } from "@/lib/cities";
import { getBlogLinks } from "@/lib/linking/getBlogLinks";

export type CityInternalLink = {
  name: string;
  url: string;
  description: string;
  briefUrl?: string;
  briefDescription?: string;
  marketHealthScore: number;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function getCityLinks(currentCity: string, limit = 5): CityInternalLink[] {
  const normalizedCurrent = normalize(currentCity);
  const safeLimit = Math.max(1, Math.min(limit, 12));

  return cities
    .filter(isCityMarketRoutePublic)
    .filter((city) => {
      const candidates = [city.name, city.slug, city.marketSlug].map(normalize);
      return !candidates.includes(normalizedCurrent);
    })
    .slice(0, safeLimit)
    .map((city) => {
      const brief = getBlogLinks({ city: city.name, limit: 1 })[0];

      return {
        name: city.name,
        url: `/market/${city.marketSlug}`,
        description: `${city.stats.medianPrice} median price, ${city.stats.inventory} active listings, ${city.stats.daysOnMarket} DOM`,
        briefUrl: brief?.href,
        briefDescription: brief?.description,
        marketHealthScore: city.stats.marketHealthScore,
      };
    });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/linking/getInternalLinks.ts
