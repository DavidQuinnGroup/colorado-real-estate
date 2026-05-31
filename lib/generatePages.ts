/**
 * DQG Programmatic Page Engine.
 * Generates neighborhood, comparison, and lifestyle-intent page definitions
 * from verified REIE location data.
 */

import { prisma } from "./prisma";

type PageTier = 1 | 2 | 3;

export type NeighborhoodPageVariables = {
  neighborhoodName: string;
  city: string;
  efficiencyScore: number;
  topAnchor: string;
  vibe: string;
};

export type LifestylePageVariables = {
  anchor: string;
  city: string;
  resilience: number;
};

export type ProgrammaticPageVariables = NeighborhoodPageVariables | LifestylePageVariables;

export type ProgrammaticPage = {
  slug: string;
  title: string;
  tier: PageTier;
  variables: ProgrammaticPageVariables;
  metaDescription: string;
};

type NeighborhoodWithCity = Awaited<
  ReturnType<typeof getNeighborhoodsForPageGeneration>
>[number];

const lifestyleModifiers = [
  "Luxury homes near",
  "Best neighborhoods for commuting to",
  "High-altitude estates near",
  "Low-maintenance living near",
] as const;

function toSlugSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildLivingInPage(neighborhood: NeighborhoodWithCity): ProgrammaticPage {
  return {
    slug: `living-in-${toSlugSegment(neighborhood.slug)}-${toSlugSegment(neighborhood.city.name)}`,
    title: `Living in ${neighborhood.name}, ${neighborhood.city.name} | Efficiency & Lifestyle Audit`,
    tier: 1,
    variables: {
      neighborhoodName: neighborhood.name,
      city: neighborhood.city.name,
      efficiencyScore: neighborhood.avgEfficiencyScore,
      topAnchor: neighborhood.primaryAnchor,
      vibe: neighborhood.lifestyleVibe,
    },
    metaDescription: `Explore ${neighborhood.name} in ${neighborhood.city.name}. Features an average Efficiency Score of ${neighborhood.avgEfficiencyScore} and proximity to ${neighborhood.primaryAnchor}.`,
  };
}

function buildLifestylePage(
  neighborhood: NeighborhoodWithCity,
  modifier: (typeof lifestyleModifiers)[number]
): ProgrammaticPage {
  return {
    slug: `${toSlugSegment(modifier)}-${toSlugSegment(neighborhood.primaryAnchor)}`,
    title: `${modifier} ${neighborhood.primaryAnchor} | ${neighborhood.city.name} Intelligence`,
    tier: 3,
    variables: {
      anchor: neighborhood.primaryAnchor,
      city: neighborhood.city.name,
      resilience: neighborhood.resilienceScore,
    },
    metaDescription: `Strategic analysis of ${modifier} ${neighborhood.primaryAnchor}. Evaluating structural resilience and lifestyle ROI.`,
  };
}

async function getNeighborhoodsForPageGeneration() {
  return prisma.neighborhood.findMany({
    include: {
      city: true,
    },
    orderBy: [
      {
        city: {
          name: "asc",
        },
      },
      {
        name: "asc",
      },
    ],
  });
}

export async function generateProgrammaticPages(): Promise<ProgrammaticPage[]> {
  const neighborhoods = await getNeighborhoodsForPageGeneration();
  const pages: ProgrammaticPage[] = [];

  neighborhoods.forEach((neighborhood) => {
    pages.push(buildLivingInPage(neighborhood));

    lifestyleModifiers.forEach((modifier) => {
      pages.push(buildLifestylePage(neighborhood, modifier));
    });
  });

  return pages;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/generatePages.ts
