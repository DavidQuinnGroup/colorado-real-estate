import { Prisma } from "@prisma/client";

import { getCityByName } from "@/lib/cities";
import { getBlogLinks } from "@/lib/linking/getBlogLinks";
import { neighborhoods } from "@/lib/neighborhoods";
import { prisma } from "@/lib/prisma";

export type PropertyLinkSource = {
  id?: string | null;
  city?: string | null;
  neighborhood?: string | null;
};

export type PropertyLinkItem = {
  id: string;
  mlsId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  neighborhood: string | null;
  status: string;
};

export type PropertyAuthorityLink = {
  label: string;
  href: string;
  description: string;
  status: "Market" | "Neighborhood" | "Brief" | "Search";
};

export type PropertyLinksResult = {
  neighborhoodHomes: PropertyLinkItem[];
  cityHomes: PropertyLinkItem[];
  authorityLinks: PropertyAuthorityLink[];
};

const propertyLinkSelect = {
  id: true,
  mlsId: true,
  address: true,
  city: true,
  state: true,
  zip: true,
  price: true,
  beds: true,
  baths: true,
  sqft: true,
  neighborhood: true,
  status: true,
} satisfies Prisma.PropertySelect;

function normalize(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

function normalizeKey(value: string | null | undefined) {
  return normalize(value)?.toLowerCase() ?? "";
}

function buildBaseWhere(property: PropertyLinkSource): Prisma.PropertyWhereInput {
  return {
    status: "Active",
    ...(property.id ? { id: { not: property.id } } : {}),
  };
}

function getCityMarketHref(city: string) {
  const cityData = getCityByName(city);
  const marketSlug = cityData?.marketSlug ?? `${city.toLowerCase().replace(/\s+/g, "-")}-co-housing-market`;

  return `/market/${marketSlug}`;
}

function getNeighborhoodHref(city: string | null, neighborhood: string | null) {
  if (!city || !neighborhood) return null;

  const normalizedCity = normalizeKey(city);
  const normalizedNeighborhood = normalizeKey(neighborhood);
  const match = neighborhoods.find(
    (item) =>
      normalizeKey(item.city) === normalizedCity &&
      (normalizeKey(item.name) === normalizedNeighborhood || normalizeKey(item.slug) === normalizedNeighborhood),
  );

  return match ? `/market/${normalizeKey(match.city)}/${match.slug}` : null;
}

function buildAuthorityLinks(city: string | null, neighborhood: string | null): PropertyAuthorityLink[] {
  const links: PropertyAuthorityLink[] = [];

  if (city) {
    links.push({
      label: `${city} Market Intelligence`,
      href: getCityMarketHref(city),
      description: "City market report, inventory posture, pricing context, evidence, and verification prompts",
      status: "Market",
    });
  }

  const neighborhoodHref = getNeighborhoodHref(city, neighborhood);

  if (neighborhood && neighborhoodHref) {
    links.push({
      label: `${neighborhood} Neighborhood Authority`,
      href: neighborhoodHref,
      description: "Neighborhood-level construction context, access context, evidence, and verification prompts",
      status: "Neighborhood",
    });
  }

  const brief = getBlogLinks({
    city: city ?? undefined,
    neighborhood: neighborhood ?? undefined,
    limit: 1,
  })[0] ?? getBlogLinks({ city: city ?? undefined, limit: 1 })[0];

  if (brief) {
    links.push({
      label: brief.title,
      href: brief.href,
      description: brief.description,
      status: "Brief",
    });
  } else if (city) {
    links.push({
      label: `${city} Inventory Search`,
      href: `/search?city=${encodeURIComponent(city)}`,
      description: "Live map-based inventory search for matching Colorado properties",
      status: "Search",
    });
  }

  return links;
}

export async function getPropertyLinks(
  property: PropertyLinkSource,
  take = 6,
): Promise<PropertyLinksResult> {
  const city = normalize(property.city);
  const neighborhood = normalize(property.neighborhood);
  const limit = Math.max(1, Math.min(take, 12));
  const baseWhere = buildBaseWhere(property);

  const authorityLinks = buildAuthorityLinks(city, neighborhood);

  try {
    const [neighborhoodHomes, cityHomes] = await Promise.all([
      neighborhood
        ? prisma.property.findMany({
            where: {
              ...baseWhere,
              neighborhood,
            },
            select: propertyLinkSelect,
            orderBy: [{ updatedAt: "desc" }],
            take: limit,
          })
        : Promise.resolve([]),
      city
        ? prisma.property.findMany({
            where: {
              ...baseWhere,
              city,
            },
            select: propertyLinkSelect,
            orderBy: [{ updatedAt: "desc" }],
            take: limit,
          })
        : Promise.resolve([]),
    ]);

    return {
      neighborhoodHomes,
      cityHomes,
      authorityLinks,
    };
  } catch (error) {
    console.error("[property-links] Prisma lookup failed; rendering authority links only:", error instanceof Error ? error.message : "unknown error");

    return {
      neighborhoodHomes: [],
      cityHomes: [],
      authorityLinks,
    };
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/linking/getPropertyLinks.ts
