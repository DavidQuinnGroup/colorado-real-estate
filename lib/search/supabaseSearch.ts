import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import {
  getDefaultStatusFilter,
  getPrimarySearchPhoto,
  normalizeSearchPhotos,
  sortListingsForLaunchQuality,
} from './listingQuality';

export type SupabaseSearchParams = {
  query?: string;
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
  isPrivateExclusive?: boolean;
  privateOnly?: boolean;
  limit?: number;
  offset?: number;
};

export type SupabaseSearchPhoto = {
  id: string;
  url: string;
  order: number;
};

export type SupabaseSearchProperty = {
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
  photos: SupabaseSearchPhoto[];
  mainPhoto: string | null;
  image: string | null;
};

export type SupabaseSearchResult = {
  results: SupabaseSearchProperty[];
  found: number;
  rawReturned: number;
};

type SupabasePropertyRow = Omit<SupabaseSearchProperty, 'photos' | 'mainPhoto' | 'image'>;

type SupabasePhotoRow = {
  id: string;
  propertyId: string;
  url: string;
  order: number;
};

const PROPERTY_COLUMNS = [
  'id',
  'mlsId',
  'slug',
  'price',
  'address',
  'city',
  'state',
  'zip',
  'beds',
  'baths',
  'sqft',
  'lotSize',
  'yearBuilt',
  'propertyType',
  'status',
  'lat',
  'lng',
  'neighborhood',
  'subdivision',
  'schoolDistrict',
  'listingAgent',
  'listingOffice',
  'description',
  'isPrivateExclusive',
  'efficiencyScore',
  'resilienceScore',
  'altitude',
  'soilType',
  'hasPolybutyleneRisk',
].join(',');

const QUERY_FIELDS = ['address', 'city', 'neighborhood', 'subdivision', 'schoolDistrict', 'listingAgent', 'listingOffice', 'zip', 'mlsId'];

let cachedClient: SupabaseClient | null = null;

function getSupabaseSearchClient() {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase search fallback is missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  cachedClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}

function isFiniteNumber(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function sanitizeSearchText(value: string | undefined) {
  return value?.replace(/[%*,()]/g, ' ').trim() || '';
}

function buildTextSearchFilter(query: string) {
  const sanitized = sanitizeSearchText(query);
  if (!sanitized) return '';

  return QUERY_FIELDS.map((field) => `${field}.ilike.%${sanitized}%`).join(',');
}

function toLimit(value: number | undefined) {
  return Math.min(Math.max(Math.floor(value ?? 250), 1), 250);
}

function toOffset(value: number | undefined) {
  return Math.max(Math.floor(value ?? 0), 0);
}

function hasCompleteBounds(params: SupabaseSearchParams) {
  return (
    isFiniteNumber(params.north) &&
    isFiniteNumber(params.south) &&
    isFiniteNumber(params.east) &&
    isFiniteNumber(params.west)
  );
}

function applySearchFilters<TQuery extends {
  or: (filters: string) => TQuery;
  ilike: (column: string, pattern: string) => TQuery;
  gte: (column: string, value: number) => TQuery;
  lte: (column: string, value: number) => TQuery;
  eq: (column: string, value: boolean) => TQuery;
}>(
  query: TQuery,
  params: SupabaseSearchParams,
  accessLevel: 'public' | 'contracted',
) {
  let filtered = query;
  const textSearch = buildTextSearchFilter(params.query || '');

  if (textSearch) filtered = filtered.or(textSearch);
  if (params.city) filtered = filtered.ilike('city', params.city);
  if (params.neighborhood) filtered = filtered.ilike('neighborhood', params.neighborhood);
  if (params.propertyType) filtered = filtered.ilike('propertyType', params.propertyType);
  filtered = filtered.ilike('status', getDefaultStatusFilter(params.status));
  if (isFiniteNumber(params.minPrice)) filtered = filtered.gte('price', params.minPrice);
  if (isFiniteNumber(params.maxPrice)) filtered = filtered.lte('price', params.maxPrice);
  if (isFiniteNumber(params.beds)) filtered = filtered.gte('beds', params.beds);
  if (isFiniteNumber(params.baths)) filtered = filtered.gte('baths', params.baths);

  if (hasCompleteBounds(params)) {
    const { north, south, east, west } = params as Required<Pick<SupabaseSearchParams, 'north' | 'south' | 'east' | 'west'>>;

    filtered = filtered
      .gte('lat', Math.min(north, south))
      .lte('lat', Math.max(north, south))
      .gte('lng', Math.min(east, west))
      .lte('lng', Math.max(east, west));
  }

  if (accessLevel === 'public') {
    filtered = filtered.eq('isPrivateExclusive', false);
  } else if (params.privateOnly || params.isPrivateExclusive) {
    filtered = filtered.eq('isPrivateExclusive', true);
  }

  return filtered;
}

async function fetchPhotos(client: SupabaseClient, propertyIds: string[]) {
  if (propertyIds.length === 0) return new Map<string, SupabaseSearchPhoto[]>();

  const { data, error } = await client
    .from('PropertyPhoto')
    .select('id,propertyId,url,order')
    .in('propertyId', propertyIds)
    .order('order', { ascending: true });

  if (error) {
    throw new Error(`Supabase search photo fallback failed: ${error.message}`);
  }

  const photoMap = new Map<string, SupabaseSearchPhoto[]>();

  for (const photo of (data || []) as SupabasePhotoRow[]) {
    const current = photoMap.get(photo.propertyId) || [];
    if (current.length < 3) {
      current.push({
        id: photo.id,
        url: photo.url,
        order: photo.order,
      });
    }
    photoMap.set(photo.propertyId, current);
  }

  return photoMap;
}

function mapProperty(row: SupabasePropertyRow, photos: SupabaseSearchPhoto[]): SupabaseSearchProperty {
  const normalizedPhotos = normalizeSearchPhotos(photos);
  const firstPhoto = getPrimarySearchPhoto(normalizedPhotos);

  return {
    ...row,
    photos: normalizedPhotos,
    mainPhoto: firstPhoto,
    image: firstPhoto,
  };
}

export async function searchSupabasePropertiesWithMeta(
  params: SupabaseSearchParams = {},
  accessLevel: 'public' | 'contracted' = 'public',
): Promise<SupabaseSearchResult> {
  const client = getSupabaseSearchClient();
  const limit = toLimit(params.limit);
  const offset = toOffset(params.offset);
  const rangeEnd = offset + limit - 1;
  const baseQuery = client.from('Property').select(PROPERTY_COLUMNS, { count: 'exact' });
  const filteredQuery = applySearchFilters(baseQuery, params, accessLevel);
  const { data, error, count } = await filteredQuery
    .order('updatedAt', { ascending: false })
    .order('price', { ascending: false })
    .order('id', { ascending: true })
    .range(offset, rangeEnd);

  if (error) {
    throw new Error(`Supabase search fallback failed: ${error.message}`);
  }

  const rows = ((data || []) as unknown) as SupabasePropertyRow[];
  const photoMap = await fetchPhotos(
    client,
    rows.map((row) => row.id),
  );
  const results = sortListingsForLaunchQuality(rows.map((row) => mapProperty(row, photoMap.get(row.id) || [])));

  return {
    results,
    found: count ?? results.length,
    rawReturned: rows.length,
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/search/supabaseSearch.ts
