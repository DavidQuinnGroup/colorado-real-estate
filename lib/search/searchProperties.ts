import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { searchSupabasePropertiesWithMeta } from '@/lib/search/supabaseSearch';

export type SearchProperty = {
  id: string;
  address: string;
  city: string;
  state: string;
  price: number;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  lat: number;
  lng: number;
  mainPhoto: string | null;
  image: string | null;
  isPrivateExclusive: boolean;
  efficiencyScore: number;
  resilienceScore: number;
  altitude: number;
  soilType: string;
  hasPolybutyleneRisk: boolean;
};

export type SearchPropertiesMeta = {
  source: 'database';
  accessLevel: 'public' | 'contracted';
  boundsApplied: false;
  filtersApplied: string[];
  health: 'healthy' | 'degraded';
  returned: number;
  mapped: number;
  coordinateFiltered: number;
  limit: number;
  offset: number;
};

export type SearchPropertiesResult = {
  results: SearchProperty[];
  meta: SearchPropertiesMeta;
};

type SearchParams = {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  minResilience?: number;
  isPrivateExclusive?: boolean;
  accessLevel?: 'public' | 'contracted';
  limit?: number;
  offset?: number;
};

const MAX_LIMIT = 250;

function getSafeLimit(limit: number | undefined) {
  return Math.min(Math.max(Math.floor(limit ?? MAX_LIMIT), 1), MAX_LIMIT);
}

function getSafeOffset(offset: number | undefined) {
  return Math.max(Math.floor(offset ?? 0), 0);
}

function hasCoordinates(property: Pick<SearchProperty, 'lat' | 'lng'>) {
  return (
    Number.isFinite(property.lat) &&
    Number.isFinite(property.lng) &&
    Math.abs(Number(property.lat)) <= 90 &&
    Math.abs(Number(property.lng)) <= 180 &&
    !(Number(property.lat) === 0 && Number(property.lng) === 0)
  );
}

function buildWhere(params: SearchParams): Prisma.PropertyWhereInput {
  return {
    city: params.city ? { equals: params.city, mode: 'insensitive' } : undefined,
    price: {
      gte: params.minPrice,
      lte: params.maxPrice,
    },
    beds: params.beds ? { gte: params.beds } : undefined,
    baths: params.baths ? { gte: params.baths } : undefined,
    resilienceScore: params.minResilience ? { gte: params.minResilience } : undefined,
    isPrivateExclusive: params.isPrivateExclusive ?? undefined,
  };
}

function getAccessLevel(params: SearchParams): SearchPropertiesMeta['accessLevel'] {
  return params.accessLevel === 'contracted' ? 'contracted' : 'public';
}

function getAppliedFilters(params: SearchParams) {
  const filters: string[] = [];

  if (params.city) filters.push('city');
  if (params.minPrice !== undefined) filters.push('minPrice');
  if (params.maxPrice !== undefined) filters.push('maxPrice');
  if (params.beds !== undefined) filters.push('beds');
  if (params.baths !== undefined) filters.push('baths');
  if (params.minResilience !== undefined) filters.push('minResilience');
  if (params.isPrivateExclusive !== undefined) filters.push('privateExclusive');
  filters.push(getAccessLevel(params) === 'contracted' ? 'contractedAccess' : 'publicAccess');

  return filters;
}

function mapSearchProperty(property: Prisma.PropertyGetPayload<{ select: typeof PROPERTY_SELECT }>): SearchProperty {
  const firstPhoto = property.photos[0]?.url || null;

  return {
    id: property.id,
    address: property.address,
    city: property.city,
    state: property.state,
    price: property.price,
    beds: property.beds,
    baths: property.baths,
    sqft: property.sqft,
    lat: property.lat,
    lng: property.lng,
    mainPhoto: firstPhoto,
    image: firstPhoto,
    isPrivateExclusive: property.isPrivateExclusive,
    efficiencyScore: property.efficiencyScore,
    resilienceScore: property.resilienceScore,
    altitude: property.altitude,
    soilType: property.soilType,
    hasPolybutyleneRisk: property.hasPolybutyleneRisk,
  };
}

const PROPERTY_SELECT = {
  id: true,
  address: true,
  city: true,
  state: true,
  price: true,
  beds: true,
  baths: true,
  sqft: true,
  lat: true,
  lng: true,
  isPrivateExclusive: true,
  efficiencyScore: true,
  resilienceScore: true,
  altitude: true,
  soilType: true,
  hasPolybutyleneRisk: true,
  photos: {
    select: {
      url: true,
    },
    orderBy: { order: 'asc' },
    take: 1,
  },
} satisfies Prisma.PropertySelect;

export async function searchPropertiesWithMeta(params: SearchParams = {}): Promise<SearchPropertiesResult> {
  const limit = getSafeLimit(params.limit);
  const offset = getSafeOffset(params.offset);
  const accessLevel = getAccessLevel(params);
  let properties: Prisma.PropertyGetPayload<{ select: typeof PROPERTY_SELECT }>[];

  try {
    properties = await prisma.property.findMany({
      where: buildWhere(params),
      select: PROPERTY_SELECT,
      orderBy: [{ price: 'desc' }, { updatedAt: 'desc' }],
      take: limit,
      skip: offset,
    });
  } catch (error) {
    console.error('REIE search page Prisma fallback unavailable:', {
      database: error instanceof Error ? error.message : 'Unknown search page database error',
    });
    const fallback = await searchSupabasePropertiesWithMeta(
      {
        city: params.city,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        beds: params.beds,
        baths: params.baths,
        isPrivateExclusive: params.isPrivateExclusive,
        limit,
        offset,
      },
      accessLevel,
    );
    properties = fallback.results.map((property) => ({
      id: property.id,
      address: property.address,
      city: property.city,
      state: property.state,
      price: property.price,
      beds: property.beds,
      baths: property.baths,
      sqft: property.sqft,
      lat: property.lat,
      lng: property.lng,
      isPrivateExclusive: property.isPrivateExclusive,
      efficiencyScore: property.efficiencyScore,
      resilienceScore: property.resilienceScore,
      altitude: property.altitude,
      soilType: property.soilType,
      hasPolybutyleneRisk: property.hasPolybutyleneRisk,
      photos: property.photos.slice(0, 1).map((photo) => ({ url: photo.url })),
    }));
  }

  const results = properties.map(mapSearchProperty);
  const mapped = results.filter(hasCoordinates).length;
  const coordinateFiltered = Math.max(0, results.length - mapped);

  return {
    results,
    meta: {
      source: 'database',
      accessLevel,
      boundsApplied: false,
      filtersApplied: getAppliedFilters(params),
      health: coordinateFiltered > 0 ? 'degraded' : 'healthy',
      returned: results.length,
      mapped,
      coordinateFiltered,
      limit,
      offset,
    },
  };
}

export async function searchProperties(params: SearchParams = {}): Promise<SearchProperty[]> {
  const result = await searchPropertiesWithMeta(params);
  return result.results;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/search/searchProperties.ts
