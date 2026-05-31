import { cities } from "@/lib/cities";
import { getBlogLinks } from "@/lib/linking/getBlogLinks";

export type CityLink = {
  name: string;
  href: string;
  description: string;
  briefHref?: string;
  briefDescription?: string;
  medianPrice: string;
  inventory: string;
  marketHealthScore: number;
};

type GetCityLinksOptions = {
  currentCity?: string;
  currentMarketSlug?: string;
  limit?: number;
};

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function isCurrentCity(
  city: (typeof cities)[number],
  currentCity: string,
  currentMarketSlug: string,
) {
  const candidates = [city.name, city.slug, city.marketSlug].map(normalize);

  return (
    (currentCity.length > 0 && candidates.includes(currentCity)) ||
    (currentMarketSlug.length > 0 && normalize(city.marketSlug) === currentMarketSlug)
  );
}

export function getCityLinks({
  currentCity,
  currentMarketSlug,
  limit = 6,
}: GetCityLinksOptions = {}): CityLink[] {
  const normalizedCurrentCity = normalize(currentCity);
  const normalizedCurrentMarketSlug = normalize(currentMarketSlug);
  const safeLimit = Math.max(1, Math.min(limit, 12));

  return cities
    .filter((city) => !isCurrentCity(city, normalizedCurrentCity, normalizedCurrentMarketSlug))
    .slice(0, safeLimit)
    .map((city) => {
      const brief = getBlogLinks({ city: city.name, limit: 1 })[0];

      return {
        name: city.name,
        href: `/market/${city.marketSlug}`,
        description: `${city.stats.medianPrice} median price, ${city.stats.inventory} active listings, ${city.stats.daysOnMarket} DOM`,
        briefHref: brief?.href,
        briefDescription: brief?.description,
        medianPrice: city.stats.medianPrice,
        inventory: city.stats.inventory,
        marketHealthScore: city.stats.marketHealthScore,
      };
    });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/linking/getCityLinks.ts
