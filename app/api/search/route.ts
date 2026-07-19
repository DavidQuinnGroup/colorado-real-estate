import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import {
  getDefaultStatusFilter,
  getPrimarySearchPhoto,
  getSearchQualitySummary,
  hasExplicitStatusFilter,
  normalizeSearchPhotos,
  sortListingsForLaunchQuality,
} from '@/lib/search/listingQuality';
import { searchSupabasePropertiesWithMeta } from '@/lib/search/supabaseSearch';
import { searchTypesenseDocuments } from '@/lib/typesense/httpClient';
import { LISTING_COLLECTION_NAME, SEARCH_SCHEMA_DEFAULT_SORT_BY, SEARCH_SCHEMA_QUERY_BY } from '@/lib/typesense/schema';

export const dynamic = 'force-dynamic';

type AccessLevel = 'public' | 'contracted';
type SearchSource = 'typesense' | 'database';
type SearchHealth = 'healthy' | 'degraded';

type SearchPhoto = {
  id: string;
  url: string;
  order: number;
};

type SearchResult = {
  id: string;
  mlsId: string;
  slug: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  propertyType: string;
  status: string;
  lat: number;
  lng: number;
  neighborhood: string | null;
  subdivision: string | null;
  schoolDistrict: string | null;
  listingAgent: string | null;
  listingOffice: string | null;
  description: string | null;
  isPrivateExclusive: boolean;
  efficiencyScore: number;
  resilienceScore: number;
  altitude: number;
  soilType: string;
  hasPolybutyleneRisk: boolean;
  photos: SearchPhoto[];
  mainPhoto: string | null;
  image: string | null;
};

type SearchResponse = {
  results: SearchResult[];
  found: number;
  accessLevel: AccessLevel;
  source: SearchSource;
  generatedAt: string;
  terminal: 'Terminal 5';
  route: '/api/search';
  command: string;
  module: 'REIE Public Search';
  health: SearchHealth;
  boundsApplied: boolean;
  filtersApplied: string[];
  durationMs: number;
  returned: number;
  mapped: number;
  coordinateFiltered: number;
  meta: SearchResponseMeta;
  fallbackReason?: string;
  error?: string;
};

type SearchCustomerExperienceMeta = {
  endpointAvailable: boolean;
  usable: boolean;
  providerDegraded: boolean;
  providerFallbackActive: boolean;
  relevanceContractSatisfied: boolean;
  dataQualityWarnings: string[];
  contract: {
    contractId: string;
    defaultStatusContractApplied: boolean;
    explicitStatus: string | null;
    defaultStatus: string;
    nonDefaultStatusCount: number;
    missingPhotoCount: number;
    resultCount: number;
    statusContractSatisfied: boolean;
  };
};

type SearchResponseMeta = {
  accessLevel: AccessLevel;
  boundsApplied: boolean;
  durationMs: number;
  filtersApplied: string[];
  health: SearchHealth;
  source: SearchSource;
  query: string;
  limit: number;
  offset: number;
  returned: number;
  mapped: number;
  coordinateFiltered: number;
  customerExperience: SearchCustomerExperienceMeta;
  smoke: SearchSmokeMeta;
  typesense?: {
    collection: string;
    filterBy: string;
    queryBy: string;
    sortBy: string;
  };
};

type SearchSmokeMeta = {
  command: 'npm run smoke:search';
  terminal: 'Terminal 5';
  ready: boolean;
  blockers: string[];
  warnings: string[];
  checks: {
    accessLevel: AccessLevel;
    boundsApplied: boolean;
    coordinateFiltered: number;
    durationMs: number;
    foundPublicMetadata: boolean;
    hasTypesenseContext: boolean;
    health: SearchHealth;
    limit: number;
    mapped: number;
    returned: number;
    source: SearchSource;
    customerSearchUsable: boolean;
    providerDegraded: boolean;
    relevanceContractSatisfied: boolean;
  };
};

type SearchParams = {
  query: string;
  north?: number;
  south?: number;
  east?: number;
  west?: number;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  city?: string;
  neighborhood?: string;
  propertyType?: string;
  status?: string;
  privateOnly: boolean;
  limit: number;
  offset: number;
};

type TypesenseHit = {
  document?: Record<string, unknown>;
};

type TypesenseSearchResponse = {
  found?: number;
  hits?: TypesenseHit[];
};

type PropertyWithPhotos = Prisma.PropertyGetPayload<{
  select: typeof PROPERTY_SELECT;
}>;

const MAX_LIMIT = 250;
const DEFAULT_LIMIT = 250;
const MAX_OFFSET = 10_000;
const LOCAL_BASE_URL = 'http://localhost:3000';
const ROUTE = '/api/search';
const TERMINAL = 'Terminal 5';
const MODULE = 'REIE Public Search';

const PROPERTY_SELECT = {
  id: true,
  mlsId: true,
  slug: true,
  price: true,
  address: true,
  city: true,
  state: true,
  zip: true,
  beds: true,
  baths: true,
  sqft: true,
  lotSize: true,
  yearBuilt: true,
  propertyType: true,
  status: true,
  lat: true,
  lng: true,
  neighborhood: true,
  subdivision: true,
  schoolDistrict: true,
  description: true,
  listingAgent: true,
  listingOffice: true,
  isPrivateExclusive: true,
  efficiencyScore: true,
  resilienceScore: true,
  altitude: true,
  soilType: true,
  hasPolybutyleneRisk: true,
  photos: {
    select: {
      id: true,
      url: true,
      order: true,
    },
    orderBy: { order: 'asc' },
    take: 3,
  },
} satisfies Prisma.PropertySelect;

function getFirstString(searchParams: URLSearchParams, keys: string[]) {
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value?.trim()) return value.trim();
  }

  return undefined;
}

function getFirstNumber(searchParams: URLSearchParams, keys: string[]) {
  const value = getFirstString(searchParams, keys);
  if (!value) return undefined;

  const parsed = Number(value.replace(/[$,]/g, ''));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getBoolean(searchParams: URLSearchParams, keys: string[]) {
  const value = getFirstString(searchParams, keys);
  if (!value) return false;

  return ['1', 'true', 'yes', 'y'].includes(value.toLowerCase());
}

function getLimit(searchParams: URLSearchParams) {
  const requestedLimit = getFirstNumber(searchParams, ['limit', 'perPage', 'per_page']) || DEFAULT_LIMIT;
  return Math.min(Math.max(Math.floor(requestedLimit), 1), MAX_LIMIT);
}

function getOffset(searchParams: URLSearchParams) {
  const requestedOffset = getFirstNumber(searchParams, ['offset', 'skip']) || 0;
  return Math.min(Math.max(Math.floor(requestedOffset), 0), MAX_OFFSET);
}

function getAdminKey() {
  return process.env.REIE_ADMIN_API_KEY || process.env.ADMIN_API_KEY || null;
}

function getRequestAdminKey(request: NextRequest) {
  const authorization = request.headers.get('authorization') || '';
  const bearerToken = authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7).trim() : '';
  return request.headers.get('x-admin-key') || bearerToken || '';
}

function authorizeRequest(request: NextRequest) {
  const configuredKey = getAdminKey();
  return Boolean(configuredKey) && getRequestAdminKey(request) === configuredKey;
}

function getAccessLevel(request: NextRequest): AccessLevel {
  const candidates = [
    request.headers.get('x-user-role'),
    request.headers.get('x-access-level'),
    request.headers.get('x-reie-access-level'),
  ]
    .map((value) => value?.trim().toLowerCase())
    .filter(Boolean);

  return candidates.includes('contracted') && authorizeRequest(request) ? 'contracted' : 'public';
}

function normalizeQuery(value: string | undefined) {
  if (!value) return '';
  return value === '*' ? '' : value;
}

function getBounds(searchParams: URLSearchParams) {
  const north = getFirstNumber(searchParams, ['north', 'neLat']);
  const south = getFirstNumber(searchParams, ['south', 'swLat']);
  const east = getFirstNumber(searchParams, ['east', 'neLng']);
  const west = getFirstNumber(searchParams, ['west', 'swLng']);

  if (north === undefined || south === undefined || east === undefined || west === undefined) {
    return {};
  }

  return {
    north: Math.max(north, south),
    south: Math.min(north, south),
    east: Math.max(east, west),
    west: Math.min(east, west),
  };
}

function getSearchParams(request: Request): SearchParams {
  const { searchParams } = new URL(request.url);

  return {
    query: normalizeQuery(getFirstString(searchParams, ['q', 'query', 'search'])),
    ...getBounds(searchParams),
    minPrice: getFirstNumber(searchParams, ['minPrice', 'priceMin', 'price_min']),
    maxPrice: getFirstNumber(searchParams, ['maxPrice', 'priceMax', 'price_max']),
    beds: getFirstNumber(searchParams, ['beds', 'minBeds', 'bedrooms']),
    baths: getFirstNumber(searchParams, ['baths', 'minBaths', 'bathrooms']),
    city: getFirstString(searchParams, ['city']),
    neighborhood: getFirstString(searchParams, ['neighborhood', 'area']),
    propertyType: getFirstString(searchParams, ['propertyType', 'type']),
    status: getFirstString(searchParams, ['status']),
    privateOnly: getBoolean(searchParams, ['privateOnly', 'private_only']),
    limit: getLimit(searchParams),
    offset: getOffset(searchParams),
  };
}

function hasCompleteBounds(params: SearchParams) {
  return params.north !== undefined && params.south !== undefined && params.east !== undefined && params.west !== undefined;
}

function isValidCoordinate(lat: number | null | undefined, lng: number | null | undefined) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(Number(lat)) <= 90 &&
    Math.abs(Number(lng)) <= 180 &&
    !(Number(lat) === 0 && Number(lng) === 0)
  );
}

function buildQueryFilter(query: string): Prisma.PropertyWhereInput {
  if (!query) return {};

  return {
    OR: [
      { address: { contains: query, mode: 'insensitive' } },
      { city: { contains: query, mode: 'insensitive' } },
      { neighborhood: { contains: query, mode: 'insensitive' } },
      { subdivision: { contains: query, mode: 'insensitive' } },
      { schoolDistrict: { contains: query, mode: 'insensitive' } },
      { listingAgent: { contains: query, mode: 'insensitive' } },
      { listingOffice: { contains: query, mode: 'insensitive' } },
      { zip: { contains: query, mode: 'insensitive' } },
      { mlsId: { contains: query, mode: 'insensitive' } },
    ],
  };
}

function buildDatabaseWhere(params: SearchParams, accessLevel: AccessLevel): Prisma.PropertyWhereInput {
  const statusFilter = getDefaultStatusFilter(params.status);

  return {
    AND: [
      buildQueryFilter(params.query),
      params.city ? { city: { equals: params.city, mode: 'insensitive' } } : {},
      params.neighborhood ? { neighborhood: { equals: params.neighborhood, mode: 'insensitive' } } : {},
      params.propertyType ? { propertyType: { equals: params.propertyType, mode: 'insensitive' } } : {},
      { status: { equals: statusFilter, mode: 'insensitive' } },
      params.minPrice !== undefined || params.maxPrice !== undefined
        ? {
            price: {
              gte: params.minPrice,
              lte: params.maxPrice,
            },
          }
        : {},
      params.beds !== undefined ? { beds: { gte: params.beds } } : {},
      params.baths !== undefined ? { baths: { gte: params.baths } } : {},
      hasCompleteBounds(params)
        ? {
            lat: { gte: params.south, lte: params.north },
            lng: { gte: params.west, lte: params.east },
          }
        : {},
      accessLevel === 'public' ? { isPrivateExclusive: false } : {},
      accessLevel === 'contracted' && params.privateOnly ? { isPrivateExclusive: true } : {},
    ],
  };
}

function sanitizeTypesenseFilterValue(value: string) {
  return value.replace(/[`\\]/g, '').trim();
}

function exactFilter(field: string, value: string | undefined) {
  const sanitized = value ? sanitizeTypesenseFilterValue(value) : '';
  return sanitized ? `${field}:=\`${sanitized}\`` : null;
}

function buildTypesenseFilters(params: SearchParams, accessLevel: AccessLevel) {
  const filters: string[] = [
    'lat:>=-90',
    'lat:<=90',
    'lng:>=-180',
    'lng:<=180',
    'lat:!=0',
    'lng:!=0',
  ];

  if (params.minPrice !== undefined) filters.push(`price:>=${Math.floor(params.minPrice)}`);
  if (params.maxPrice !== undefined) filters.push(`price:<=${Math.floor(params.maxPrice)}`);
  if (params.beds !== undefined) filters.push(`beds:>=${params.beds}`);
  if (params.baths !== undefined) filters.push(`baths:>=${params.baths}`);
  if (hasCompleteBounds(params)) {
    filters.push(`lat:>=${params.south}`);
    filters.push(`lat:<=${params.north}`);
    filters.push(`lng:>=${params.west}`);
    filters.push(`lng:<=${params.east}`);
  }

  const exactFilters = [
    exactFilter('city', params.city),
    exactFilter('neighborhood', params.neighborhood),
    exactFilter('propertyType', params.propertyType),
    exactFilter('status', getDefaultStatusFilter(params.status)),
  ].filter((filter): filter is string => Boolean(filter));

  filters.push(...exactFilters);

  if (accessLevel === 'public') filters.push('isPrivateExclusive:=false');
  if (accessLevel === 'contracted' && params.privateOnly) filters.push('isPrivateExclusive:=true');

  return filters.join(' && ');
}

function getAppliedFilters(params: SearchParams, accessLevel: AccessLevel) {
  const filters: string[] = [];

  if (params.query) filters.push('query');
  if (hasCompleteBounds(params)) filters.push('bounds');
  if (params.minPrice !== undefined) filters.push('minPrice');
  if (params.maxPrice !== undefined) filters.push('maxPrice');
  if (params.beds !== undefined) filters.push('beds');
  if (params.baths !== undefined) filters.push('baths');
  if (params.city) filters.push('city');
  if (params.neighborhood) filters.push('neighborhood');
  if (params.propertyType) filters.push('propertyType');
  filters.push(hasExplicitStatusFilter(params.status) ? 'status' : 'defaultStatus');
  if (params.privateOnly) filters.push('privateOnly');
  if (accessLevel === 'public') filters.push('publicAccess');
  if (accessLevel === 'contracted') filters.push('contractedAccess');

  return filters;
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function toNullableString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function toNumberValue(value: unknown, fallback = 0) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toBooleanValue(value: unknown) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown search error';
}

function getInspectionCommand(request: NextRequest) {
  const search = request.nextUrl.search || '';
  return `curl --max-time 8 -s "${LOCAL_BASE_URL}${ROUTE}${search}"`;
}

function buildSearchResponse(
  request: NextRequest,
  response: Omit<
    SearchResponse,
    | 'generatedAt'
    | 'terminal'
    | 'route'
    | 'command'
    | 'module'
    | 'health'
    | 'boundsApplied'
    | 'filtersApplied'
    | 'durationMs'
    | 'returned'
    | 'mapped'
    | 'coordinateFiltered'
  >,
): SearchResponse {
  return {
    ...response,
    generatedAt: new Date().toISOString(),
    terminal: TERMINAL,
    route: ROUTE,
    command: getInspectionCommand(request),
    module: MODULE,
    health: response.meta.health,
    boundsApplied: response.meta.boundsApplied,
    filtersApplied: response.meta.filtersApplied,
    durationMs: response.meta.durationMs,
    returned: response.meta.returned,
    mapped: response.meta.mapped,
    coordinateFiltered: response.meta.coordinateFiltered,
  };
}

function mapProperty(property: PropertyWithPhotos): SearchResult {
  const photos = normalizeSearchPhotos(property.photos);
  const firstPhoto = getPrimarySearchPhoto(photos);

  return {
    id: property.id,
    mlsId: property.mlsId,
    slug: property.slug,
    price: property.price,
    address: property.address,
    city: property.city,
    state: property.state,
    zip: property.zip,
    beds: property.beds,
    baths: property.baths,
    sqft: property.sqft,
    lotSize: property.lotSize,
    yearBuilt: property.yearBuilt,
    propertyType: property.propertyType,
    status: property.status,
    lat: property.lat,
    lng: property.lng,
    neighborhood: property.neighborhood,
    subdivision: property.subdivision,
    schoolDistrict: property.schoolDistrict,
    listingAgent: property.listingAgent,
    listingOffice: property.listingOffice,
    description: property.description,
    isPrivateExclusive: property.isPrivateExclusive,
    efficiencyScore: property.efficiencyScore,
    resilienceScore: property.resilienceScore,
    altitude: property.altitude,
    soilType: property.soilType,
    hasPolybutyleneRisk: property.hasPolybutyleneRisk,
    photos,
    mainPhoto: firstPhoto,
    image: firstPhoto,
  };
}

async function getPhotoMap(propertyIds: string[]) {
  if (!propertyIds.length) return new Map<string, SearchPhoto[]>();

  const properties = await prisma.property.findMany({
    where: {
      id: {
        in: propertyIds,
      },
    },
    select: {
      id: true,
      photos: {
        select: {
          id: true,
          url: true,
          order: true,
        },
        orderBy: { order: 'asc' },
        take: 3,
      },
    },
  });

  return new Map(properties.map((property) => [property.id, property.photos]));
}

function mapTypesenseDocument(document: Record<string, unknown>, photoMap: Map<string, SearchPhoto[]>): SearchResult | null {
  const lat = toNullableNumber(document.lat);
  const lng = toNullableNumber(document.lng);
  if (!isValidCoordinate(lat, lng)) return null;

  const id = toStringValue(document.id);
  if (!id) return null;

  const photos = normalizeSearchPhotos(photoMap.get(id) || []);
  const firstPhoto = getPrimarySearchPhoto(photos);

  return {
    id,
    mlsId: toStringValue(document.mlsId),
    slug: toStringValue(document.slug, id),
    price: toNumberValue(document.price),
    address: toStringValue(document.address, 'Address unavailable'),
    city: toStringValue(document.city, 'Colorado'),
    state: toStringValue(document.state, 'CO'),
    zip: toStringValue(document.zip),
    beds: toNullableNumber(document.beds),
    baths: toNullableNumber(document.baths),
    sqft: toNullableNumber(document.sqft),
    lotSize: toNullableNumber(document.lotSize),
    yearBuilt: toNullableNumber(document.yearBuilt),
    propertyType: toStringValue(document.propertyType, 'Residential'),
    status: toStringValue(document.status, 'Active'),
    lat: Number(lat),
    lng: Number(lng),
    neighborhood: toNullableString(document.neighborhood),
    subdivision: toNullableString(document.subdivision),
    schoolDistrict: toNullableString(document.schoolDistrict),
    listingAgent: toNullableString(document.listingAgent),
    listingOffice: toNullableString(document.listingOffice),
    description: toNullableString(document.description),
    isPrivateExclusive: toBooleanValue(document.isPrivateExclusive),
    efficiencyScore: toNumberValue(document.efficiencyScore),
    resilienceScore: toNumberValue(document.resilienceScore, 85),
    altitude: toNumberValue(document.altitude, 5280),
    soilType: toStringValue(document.soilType, 'Unknown'),
    hasPolybutyleneRisk: toBooleanValue(document.hasPolybutyleneRisk),
    photos,
    mainPhoto: firstPhoto,
    image: firstPhoto,
  };
}

async function searchTypesense(params: SearchParams, accessLevel: AccessLevel) {
  const page = Math.floor(params.offset / params.limit) + 1;
  const filterBy = buildTypesenseFilters(params, accessLevel);
  const response = await searchTypesenseDocuments<TypesenseSearchResponse>(
    LISTING_COLLECTION_NAME,
    {
      q: params.query || '*',
      query_by: SEARCH_SCHEMA_QUERY_BY,
      filter_by: filterBy,
      sort_by: SEARCH_SCHEMA_DEFAULT_SORT_BY,
      page,
      per_page: params.limit,
    },
  );

  const documents = (response.hits || [])
    .map((hit) => hit.document)
    .filter((document): document is Record<string, unknown> => Boolean(document));
  const ids = documents.map((document) => toStringValue(document.id)).filter(Boolean);
  const photoMap = await getPhotoMap(ids);
  const results = sortListingsForLaunchQuality(
    documents.flatMap((document) => {
      const result = mapTypesenseDocument(document, photoMap);
      return result ? [result] : [];
    }),
  );

  return {
    results,
    found: response.found ?? results.length,
    rawReturned: documents.length,
    filterBy,
  };
}

async function searchDatabase(params: SearchParams, accessLevel: AccessLevel) {
  const where = buildDatabaseWhere(params, accessLevel);

  try {
    const [properties, found] = await Promise.all([
      prisma.property.findMany({
        where,
        select: PROPERTY_SELECT,
        orderBy: [{ updatedAt: 'desc' }, { price: 'desc' }, { id: 'asc' }],
        take: params.limit,
        skip: params.offset,
      }),
      prisma.property.count({ where }),
    ]);

    const mappedProperties = sortListingsForLaunchQuality(properties.map(mapProperty));
    const results = mappedProperties.filter((property) => isValidCoordinate(property.lat, property.lng));

    return {
      results,
      found,
      rawReturned: mappedProperties.length,
    };
  } catch (error) {
    console.error('REIE search Prisma fallback unavailable:', {
      database: getErrorMessage(error),
    });
    const fallback = await searchSupabasePropertiesWithMeta(params, accessLevel);
    const results = sortListingsForLaunchQuality(fallback.results).filter((property) => isValidCoordinate(property.lat, property.lng));

    return {
      results,
      found: fallback.found,
      rawReturned: fallback.rawReturned,
    };
  }
}

function buildResponseMeta(
  params: SearchParams,
  source: SearchSource,
  accessLevel: AccessLevel,
  rawReturned: number,
  mapped: number,
  results: SearchResult[],
  durationMs: number,
  filterBy?: string,
): SearchResponseMeta {
  const coordinateFiltered = Math.max(0, rawReturned - mapped);
  const health: SearchHealth = source === 'database' || coordinateFiltered > 0 ? 'degraded' : 'healthy';
  const hasTypesenseContext = source === 'typesense' && Boolean(filterBy);
  const qualitySummary = getSearchQualitySummary(results, params.status);
  const dataQualityWarnings = [
    coordinateFiltered > 0 ? `${coordinateFiltered} result(s) were omitted from the map because coordinates were missing or invalid.` : null,
    qualitySummary.missingPhotoCount > 0 ? `${qualitySummary.missingPhotoCount} result(s) require listing-photo placeholders.` : null,
  ].filter((warning): warning is string => Boolean(warning));
  const blockers = [
    rawReturned < mapped ? 'Mapped result count is greater than returned result count.' : null,
    durationMs < 0 ? 'Search duration is invalid.' : null,
    source === 'typesense' && !hasTypesenseContext ? 'Search provider query metadata is missing.' : null,
    qualitySummary.statusContractSatisfied ? null : 'Default search returned inventory outside the launch status contract.',
  ].filter((blocker): blocker is string => Boolean(blocker));
  const customerSearchUsable = blockers.length === 0;
  const providerDegraded = source === 'database' || coordinateFiltered > 0;
  const warnings = [
    source === 'database' ? 'Primary search provider is degraded; fallback search served the request.' : null,
    ...dataQualityWarnings,
  ].filter((warning): warning is string => Boolean(warning));

  return {
    accessLevel,
    boundsApplied: hasCompleteBounds(params),
    durationMs,
    filtersApplied: getAppliedFilters(params, accessLevel),
    health,
    source,
    query: params.query,
    limit: params.limit,
    offset: params.offset,
    returned: rawReturned,
    mapped,
    coordinateFiltered,
    customerExperience: {
      endpointAvailable: true,
      usable: customerSearchUsable,
      providerDegraded,
      providerFallbackActive: source === 'database',
      relevanceContractSatisfied: qualitySummary.statusContractSatisfied,
      dataQualityWarnings,
      contract: qualitySummary,
    },
    smoke: {
      command: 'npm run smoke:search',
      terminal: 'Terminal 5',
      ready: customerSearchUsable,
      blockers,
      warnings,
      checks: {
        accessLevel,
        boundsApplied: hasCompleteBounds(params),
        coordinateFiltered,
        durationMs,
        foundPublicMetadata: true,
        hasTypesenseContext,
        health,
        limit: params.limit,
        mapped,
        returned: rawReturned,
        source,
        customerSearchUsable,
        providerDegraded,
        relevanceContractSatisfied: qualitySummary.statusContractSatisfied,
      },
    },
    ...(source === 'typesense'
      ? {
          typesense: {
            collection: LISTING_COLLECTION_NAME,
            filterBy: filterBy || '',
            queryBy: SEARCH_SCHEMA_QUERY_BY,
            sortBy: SEARCH_SCHEMA_DEFAULT_SORT_BY,
          },
        }
      : {}),
  };
}

function jsonResponse(response: SearchResponse, status = 200) {
  return NextResponse.json(response, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET(request: NextRequest) {
  const startedMs = Date.now();
  const accessLevel = getAccessLevel(request);
  const params = getSearchParams(request);

  try {
    const typesenseResult = await searchTypesense(params, accessLevel);

    return jsonResponse(
      buildSearchResponse(request, {
        results: typesenseResult.results,
        found: typesenseResult.found,
        accessLevel,
        source: 'typesense',
        meta: buildResponseMeta(
          params,
          'typesense',
          accessLevel,
          typesenseResult.rawReturned,
          typesenseResult.results.length,
          typesenseResult.results,
          Date.now() - startedMs,
          typesenseResult.filterBy,
        ),
      }),
    );
  } catch (typesenseError) {
    const fallbackReason = getErrorMessage(typesenseError);

    try {
      const databaseResult = await searchDatabase(params, accessLevel);

      return jsonResponse(
        buildSearchResponse(request, {
          results: databaseResult.results,
          found: databaseResult.found,
          accessLevel,
          source: 'database',
          meta: buildResponseMeta(
            params,
            'database',
            accessLevel,
            databaseResult.rawReturned,
            databaseResult.results.length,
            databaseResult.results,
            Date.now() - startedMs,
          ),
          fallbackReason: fallbackReason ? 'Search provider fallback served the request.' : undefined,
        }),
      );
    } catch (databaseError) {
      console.error('REIE search failed:', {
        typesense: fallbackReason,
        database: getErrorMessage(databaseError),
      });

      return jsonResponse(
        buildSearchResponse(request, {
          results: [],
          found: 0,
          accessLevel,
          source: 'database',
          meta: buildResponseMeta(params, 'database', accessLevel, 0, 0, [], Date.now() - startedMs),
          fallbackReason: fallbackReason ? 'Search provider fallback was attempted.' : undefined,
          error: 'Inventory search is temporarily unavailable.',
        }),
        500,
      );
    }
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/search/route.ts
