import { neighborhoods } from '../data/neighborhoods';

type Neighborhood = {
  slug: string;
  name: string;
};

export function getNeighborhoodsByCity(city: string): Neighborhood[] {
  const normalizedCity = city.trim().toLowerCase();

  return neighborhoods
    .filter((neighborhood) => neighborhood.city.toLowerCase() === normalizedCity)
    .map((neighborhood) => ({
      slug: neighborhood.slug,
      name: neighborhood.name,
    }));
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/getNeighborhoodsByCity.ts
