import { neighborhoods } from "@/lib/neighborhoods";

export type NeighborhoodLink = {
  name: string;
  city: string;
  href: string;
  description: string;
  primaryAnchor: string;
  resilienceScore: number;
  avgEfficiencyScore: number;
};

type GetNeighborhoodLinksOptions = {
  city?: string;
  currentSlug?: string;
  limit?: number;
};

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function getNeighborhoodLinks({
  city,
  currentSlug,
  limit = 6,
}: GetNeighborhoodLinksOptions = {}): NeighborhoodLink[] {
  const normalizedCity = normalize(city);
  const normalizedCurrentSlug = normalize(currentSlug);
  const safeLimit = Math.max(1, Math.min(limit, 24));

  return neighborhoods
    .filter((neighborhood) => {
      if (normalizedCity && normalize(neighborhood.city) !== normalizedCity) {
        return false;
      }

      if (normalizedCurrentSlug && normalize(neighborhood.slug) === normalizedCurrentSlug) {
        return false;
      }

      return true;
    })
    .sort((a, b) => b.resilienceScore - a.resilienceScore)
    .slice(0, safeLimit)
    .map((neighborhood) => ({
      name: neighborhood.name,
      city: neighborhood.city,
      href: `/market/${normalize(neighborhood.city)}/${neighborhood.slug}`,
      description: `${neighborhood.primaryAnchor} / ${neighborhood.fireRisk} fire risk / ${neighborhood.insuranceComplexity} insurance`,
      primaryAnchor: neighborhood.primaryAnchor,
      resilienceScore: neighborhood.resilienceScore,
      avgEfficiencyScore: neighborhood.avgEfficiencyScore,
    }));
}

// lib/linking/getNeighborhoodLinks.ts
