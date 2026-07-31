/**
 * DQG City Authority Database.
 * Primary city-level data source for market landing pages, internal links, and
 * REIE market-pulse modules.
 */

export type CityStats = {
  medianPrice: string;
  pricePerSqFt: string;
  daysOnMarket: string;
  inventory: string;
  marketHealthScore: number;
  avgEfficiency: number;
};

export type CityData = {
  name: string;
  slug: string;
  marketSlug: string;
  stats: CityStats;
};

function createCity(city: CityData): CityData {
  return city;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export const cities: CityData[] = [
  createCity({
    name: "Boulder",
    slug: "boulder-co-real-estate",
    marketSlug: "boulder-co-housing-market",
    stats: {
      medianPrice: "$1,450,000",
      pricePerSqFt: "$850",
      daysOnMarket: "22",
      inventory: "58",
      marketHealthScore: 88,
      avgEfficiency: 94,
    },
  }),
  createCity({
    name: "Louisville",
    slug: "louisville-co-real-estate",
    marketSlug: "louisville-co-housing-market",
    stats: {
      medianPrice: "$925,000",
      pricePerSqFt: "$580",
      daysOnMarket: "14",
      inventory: "35",
      marketHealthScore: 92,
      avgEfficiency: 88,
    },
  }),
  createCity({
    name: "Lafayette",
    slug: "lafayette-co-real-estate",
    marketSlug: "lafayette-co-housing-market",
    stats: {
      medianPrice: "$850,000",
      pricePerSqFt: "$525",
      daysOnMarket: "18",
      inventory: "42",
      marketHealthScore: 84,
      avgEfficiency: 82,
    },
  }),
  createCity({
    name: "Denver",
    slug: "denver-co-real-estate",
    marketSlug: "denver-co-housing-market",
    stats: {
      medianPrice: "$720,000",
      pricePerSqFt: "$455",
      daysOnMarket: "29",
      inventory: "640",
      marketHealthScore: 76,
      avgEfficiency: 78,
    },
  }),
  createCity({
    name: "Niwot",
    slug: "niwot-co-real-estate",
    marketSlug: "niwot-co-housing-market",
    stats: {
      medianPrice: "$1,850,000",
      pricePerSqFt: "$720",
      daysOnMarket: "31",
      inventory: "12",
      marketHealthScore: 78,
      avgEfficiency: 75,
    },
  }),
  createCity({
    name: "Gunbarrel",
    slug: "gunbarrel-co-real-estate",
    marketSlug: "gunbarrel-co-housing-market",
    stats: {
      medianPrice: "$865,000",
      pricePerSqFt: "$525",
      daysOnMarket: "18",
      inventory: "42",
      marketHealthScore: 89,
      avgEfficiency: 85,
    },
  }),
  createCity({
    name: "Broomfield",
    slug: "broomfield-co-real-estate",
    marketSlug: "broomfield-co-housing-market",
    stats: {
      medianPrice: "$815,000",
      pricePerSqFt: "$398",
      daysOnMarket: "30",
      inventory: "142",
      marketHealthScore: 72,
      avgEfficiency: 79,
    },
  }),
  createCity({
    name: "Erie",
    slug: "erie-co-real-estate",
    marketSlug: "erie-co-housing-market",
    stats: {
      medianPrice: "$845,000",
      pricePerSqFt: "$405",
      daysOnMarket: "27",
      inventory: "118",
      marketHealthScore: 81,
      avgEfficiency: 74,
    },
  }),
  createCity({
    name: "Longmont",
    slug: "longmont-co-real-estate",
    marketSlug: "longmont-co-housing-market",
    stats: {
      medianPrice: "$725,000",
      pricePerSqFt: "$360",
      daysOnMarket: "34",
      inventory: "182",
      marketHealthScore: 68,
      avgEfficiency: 70,
    },
  }),
  createCity({
    name: "Westminster",
    slug: "westminster-co-real-estate",
    marketSlug: "westminster-co-housing-market",
    stats: {
      medianPrice: "$685,000",
      pricePerSqFt: "$340",
      daysOnMarket: "28",
      inventory: "155",
      marketHealthScore: 74,
      avgEfficiency: 80,
    },
  }),
  createCity({
    name: "Thornton",
    slug: "thornton-co-real-estate",
    marketSlug: "thornton-co-housing-market",
    stats: {
      medianPrice: "$615,000",
      pricePerSqFt: "$310",
      daysOnMarket: "26",
      inventory: "194",
      marketHealthScore: 70,
      avgEfficiency: 68,
    },
  }),
  createCity({
    name: "Brighton",
    slug: "brighton-co-real-estate",
    marketSlug: "brighton-co-housing-market",
    stats: {
      medianPrice: "$595,000",
      pricePerSqFt: "$295",
      daysOnMarket: "32",
      inventory: "112",
      marketHealthScore: 65,
      avgEfficiency: 55,
    },
  }),
  createCity({
    name: "Firestone",
    slug: "firestone-co-real-estate",
    marketSlug: "firestone-co-housing-market",
    stats: {
      medianPrice: "$575,000",
      pricePerSqFt: "$280",
      daysOnMarket: "35",
      inventory: "88",
      marketHealthScore: 62,
      avgEfficiency: 50,
    },
  }),
  createCity({
    name: "Frederick",
    slug: "frederick-co-real-estate",
    marketSlug: "frederick-co-housing-market",
    stats: {
      medianPrice: "$585,000",
      pricePerSqFt: "$285",
      daysOnMarket: "30",
      inventory: "94",
      marketHealthScore: 64,
      avgEfficiency: 52,
    },
  }),
];

export function getCityByName(cityName: string) {
  const normalizedCityName = normalize(cityName);
  return cities.find((city) => normalize(city.name) === normalizedCityName) || null;
}

export function getCityByMarketSlug(marketSlug: string) {
  const normalizedMarketSlug = normalize(marketSlug);
  return cities.find((city) => normalize(city.marketSlug) === normalizedMarketSlug) || null;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/cities.ts
