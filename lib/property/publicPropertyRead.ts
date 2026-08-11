import 'server-only';

import type { Prisma } from '@prisma/client';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { prisma } from '@/lib/prisma';

export type PublicPropertyWithPhotos = Prisma.PropertyGetPayload<{
  include: {
    photos: {
      orderBy: {
        order: 'asc';
      };
    };
  };
}>;

type SupabasePropertyPhotoRow = {
  id: string;
  propertyId: string;
  url: string;
  order: number;
};

type SupabasePropertyRow = Omit<PublicPropertyWithPhotos, 'photos' | 'createdAt' | 'updatedAt' | 'lastIntelligenceSync'> & {
  createdAt: string;
  updatedAt: string;
  lastIntelligenceSync: string | null;
};

const PROPERTY_COLUMNS = [
  'id',
  'mlsId',
  'slug',
  'address',
  'city',
  'state',
  'zip',
  'price',
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
  'description',
  'listingAgent',
  'listingOffice',
  'createdAt',
  'updatedAt',
  'lastIntelligenceSync',
  'isPrivateExclusive',
  'gcForensics',
  'negotiationLevers',
  'optimizedValue',
  'efficiencyScore',
  'resilienceScore',
  'altitude',
  'soilType',
  'hasPolybutyleneRisk',
].join(',');

let cachedSupabaseClient: SupabaseClient | null = null;

function getSupabasePropertyClient() {
  if (cachedSupabaseClient) return cachedSupabaseClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase property fallback is missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  cachedSupabaseClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedSupabaseClient;
}

export function toPublicPropertyIdFilterValue(value: string) {
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 160) return null;
  if (!/^[A-Za-z0-9._~-]+$/.test(trimmed)) return null;

  return trimmed;
}

async function fetchSupabasePropertyPhotos(client: SupabaseClient, propertyId: string) {
  const { data, error } = await client
    .from('PropertyPhoto')
    .select('id,propertyId,url,order')
    .eq('propertyId', propertyId)
    .order('order', { ascending: true });

  if (error) {
    throw new Error('Supabase property photo fallback failed.');
  }

  return ((data || []) as SupabasePropertyPhotoRow[]).map((photo) => ({
    id: photo.id,
    propertyId: photo.propertyId,
    url: photo.url,
    order: photo.order,
  }));
}

function mapSupabaseProperty(row: SupabasePropertyRow, photos: SupabasePropertyPhotoRow[]): PublicPropertyWithPhotos {
  return {
    ...row,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    lastIntelligenceSync: row.lastIntelligenceSync ? new Date(row.lastIntelligenceSync) : null,
    photos,
  } as PublicPropertyWithPhotos;
}

async function getSupabaseProperty(id: string): Promise<PublicPropertyWithPhotos | null> {
  const filterValue = toPublicPropertyIdFilterValue(id);
  if (!filterValue) return null;

  const client = getSupabasePropertyClient();
  const { data, error } = await client
    .from('Property')
    .select(PROPERTY_COLUMNS)
    .or(`id.eq.${filterValue},slug.eq.${filterValue},mlsId.eq.${filterValue}`)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error('Supabase property fallback failed.');
  }

  if (!data) return null;

  const row = data as unknown as SupabasePropertyRow;
  const photos = await fetchSupabasePropertyPhotos(client, row.id);

  return mapSupabaseProperty(row, photos);
}

export async function getPublicProperty(id: string): Promise<PublicPropertyWithPhotos | null> {
  try {
    const property = await prisma.property.findFirst({
      where: {
        OR: [{ id }, { slug: id }, { mlsId: id }],
      },
      include: {
        photos: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return property || getSupabaseProperty(id);
  } catch (error) {
    console.error('[property-page] Prisma lookup failed; attempting Supabase REST fallback:', error instanceof Error ? error.message : 'unknown error');

    return getSupabaseProperty(id);
  }
}

export async function getPublicPropertiesByIds(ids: string[]): Promise<PublicPropertyWithPhotos[]> {
  const boundedIds = ids.map(toPublicPropertyIdFilterValue).filter((id): id is string => Boolean(id)).slice(0, 3);
  if (boundedIds.length === 0) return [];

  try {
    const properties = await prisma.property.findMany({
      where: {
        id: {
          in: boundedIds,
        },
      },
      include: {
        photos: {
          orderBy: { order: 'asc' },
        },
      },
      take: 3,
    });

    const foundIds = new Set(properties.map((property) => property.id));
    const missingIds = boundedIds.filter((id) => !foundIds.has(id));
    if (missingIds.length === 0) return properties;

    const fallbackProperties = await Promise.all(missingIds.slice(0, 3 - properties.length).map((id) => getSupabaseProperty(id)));
    return [...properties, ...fallbackProperties.filter((property): property is PublicPropertyWithPhotos => Boolean(property))].slice(0, 3);
  } catch (error) {
    console.error('[property-compare] Prisma shortlist lookup failed; attempting bounded Supabase REST fallback:', error instanceof Error ? error.message : 'unknown error');

    const fallbackProperties = await Promise.all(boundedIds.map((id) => getSupabaseProperty(id)));
    return fallbackProperties.filter((property): property is PublicPropertyWithPhotos => Boolean(property)).slice(0, 3);
  }
}
