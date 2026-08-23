import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { prisma } from '@/lib/prisma';

import {
  AGENT_PROPERTY_LISTING_SOURCE_ID,
  type AgentPropertyPreparationProperty,
  type AgentPropertyPreparationSourcePosture,
} from './agentPropertyPreparationAdmission';
import type {
  AgentPropertyConversationCandidate,
  AgentPropertyConversationCandidateSummary,
} from './agentPropertyConversationPreparation';

export const AGENT_PROPERTY_SEARCH_RESULT_LIMIT = 8;
export const AGENT_PROPERTY_SEARCH_MINIMUM_QUERY_LENGTH = 2;
const MAX_AGENT_PROPERTY_SEARCH_QUERY_LENGTH = 120;
const LEGACY_AGENT_PROPERTY_CANDIDATE_LIMIT = 120;
const CURRENT_LISTING_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

type RepositoryProperty = {
  mlsId: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: string;
  isPrivateExclusive: boolean;
  price: number;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  propertyType: string;
  neighborhood: string | null;
  updatedAt: Date;
  lastIntelligenceSync: Date | null;
  sourceModifiedAt: Date | null;
};

type SupabasePropertyRow = Omit<RepositoryProperty, 'updatedAt' | 'lastIntelligenceSync' | 'sourceModifiedAt'> & {
  updatedAt: string;
  lastIntelligenceSync: string | null;
  sourceModifiedAt: string | null;
};

type RepositoryPropertySummary = Pick<
  RepositoryProperty,
  'slug' | 'address' | 'city' | 'state' | 'zip' | 'status' | 'price' | 'propertyType' | 'neighborhood'
>;

export function normalizeAgentPropertySearchQuery(value: string | null) {
  const query = value?.trim() ?? '';
  if (query.length < AGENT_PROPERTY_SEARCH_MINIMUM_QUERY_LENGTH || query.length > MAX_AGENT_PROPERTY_SEARCH_QUERY_LENGTH) return null;
  return query;
}

const CANDIDATE_COLUMNS = [
  'mlsId', 'slug', 'address', 'city', 'state', 'zip', 'status', 'isPrivateExclusive', 'price', 'beds', 'baths', 'sqft',
  'lotSize', 'yearBuilt', 'propertyType', 'neighborhood', 'updatedAt', 'lastIntelligenceSync', 'sourceModifiedAt',
].join(',');

const CANDIDATE_SUMMARY_COLUMNS = [
  'slug', 'address', 'city', 'state', 'zip', 'status', 'price', 'propertyType', 'neighborhood',
].join(',');

let cachedSupabaseClient: SupabaseClient | null = null;

function getSupabaseClient() {
  if (cachedSupabaseClient) return cachedSupabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Repository property read fallback is unavailable.');

  cachedSupabaseClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedSupabaseClient;
}

function toDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function mapSupabaseRow(row: SupabasePropertyRow): RepositoryProperty | null {
  const updatedAt = toDate(row.updatedAt);
  if (!updatedAt) return null;

  return {
    ...row,
    updatedAt,
    lastIntelligenceSync: toDate(row.lastIntelligenceSync),
    sourceModifiedAt: toDate(row.sourceModifiedAt),
  };
}

function isCurrent(observedAt: Date, now: Date) {
  const age = now.getTime() - observedAt.getTime();
  return age >= -24 * 60 * 60 * 1000 && age <= CURRENT_LISTING_WINDOW_MS;
}

function toCandidate(record: RepositoryProperty, now: Date): AgentPropertyConversationCandidate {
  const observedAt = record.sourceModifiedAt || record.lastIntelligenceSync || record.updatedAt;
  const property: AgentPropertyPreparationProperty = Object.freeze({
    origin: 'REPOSITORY_PROPERTY',
    resolvedPropertyCount: 1,
    slug: record.slug,
    mlsId: record.mlsId,
    address: record.address,
    city: record.city,
    state: record.state,
    zip: record.zip,
    status: record.status,
    isPrivateExclusive: record.isPrivateExclusive,
    price: record.price,
    beds: record.beds,
    baths: record.baths,
    sqft: record.sqft,
    lotSize: record.lotSize,
    yearBuilt: record.yearBuilt,
    propertyType: record.propertyType,
    neighborhood: record.neighborhood,
  });
  const sourcePosture: AgentPropertyPreparationSourcePosture = Object.freeze({
    sourceId: AGENT_PROPERTY_LISTING_SOURCE_ID,
    sourceClass: 'EXISTING_REPOSITORY_LISTING_FACTS',
    listingReference: record.mlsId,
    observedAt: observedAt.toISOString(),
    freshness: isCurrent(observedAt, now) ? 'CURRENT' : 'STALE',
    completeness: record.price > 0 && Boolean(record.propertyType && record.address && record.city && record.state === 'CO' && record.zip) ? 'COMPLETE' : 'INCOMPLETE',
    conflict: 'NO_CONFLICT',
    rights: 'CERTIFIED_EXISTING_REPOSITORY_USE',
    certification: 'PROPERTY_PRODUCT_CERTIFIED',
  });

  return Object.freeze({ property, sourcePosture });
}

function toCandidateSummary(record: RepositoryPropertySummary): AgentPropertyConversationCandidateSummary {
  return Object.freeze({
    property: Object.freeze({
      slug: record.slug,
      address: record.address,
      city: record.city,
      state: record.state,
      zip: record.zip,
      status: record.status,
      price: record.price,
      propertyType: record.propertyType,
      neighborhood: record.neighborhood,
    }),
  });
}

function isSafePropertySlug(value: string | null) {
  return Boolean(value && /^[A-Za-z0-9._~-]{1,160}$/.test(value));
}

async function readSupabaseCandidateSummaries(query: string) {
  const pattern = `%${query.replace(/[%_]/g, '\\$&')}%`;
  const { data, error } = await getSupabaseClient()
    .from('Property')
    .select(CANDIDATE_SUMMARY_COLUMNS)
    .eq('state', 'CO')
    .eq('isPrivateExclusive', false)
    .ilike('status', 'Active')
    .or(`address.ilike.${pattern},city.ilike.${pattern},zip.ilike.${pattern},propertyType.ilike.${pattern},neighborhood.ilike.${pattern},mlsId.ilike.${pattern}`)
    .order('updatedAt', { ascending: false })
    .limit(AGENT_PROPERTY_SEARCH_RESULT_LIMIT);

  if (error) throw new Error('Repository property summary read fallback failed.');
  return (data || []) as unknown as RepositoryPropertySummary[];
}

async function readSupabaseCandidateBySlug(slug: string) {
  const { data, error } = await getSupabaseClient()
    .from('Property')
    .select(CANDIDATE_COLUMNS)
    .eq('slug', slug)
    .eq('state', 'CO')
    .eq('isPrivateExclusive', false)
    .ilike('status', 'Active')
    .limit(1)
    .maybeSingle();

  if (error) throw new Error('Repository property detail read fallback failed.');
  return data ? mapSupabaseRow(data as unknown as SupabasePropertyRow) : null;
}

// Listing Preparation is an existing, separately authorized selector surface.
// Property Preparation uses the bounded search function below and never calls this.
export async function getAgentPropertyConversationCandidateSummaries(): Promise<readonly AgentPropertyConversationCandidateSummary[]> {
  try {
    const records = await prisma.property.findMany({
      where: {
        state: { equals: 'CO', mode: 'insensitive' },
        status: { equals: 'Active', mode: 'insensitive' },
        isPrivateExclusive: false,
      },
      select: {
        slug: true, address: true, city: true, state: true, zip: true, status: true, price: true, propertyType: true, neighborhood: true,
      },
      orderBy: [{ updatedAt: 'desc' }, { slug: 'asc' }],
      take: LEGACY_AGENT_PROPERTY_CANDIDATE_LIMIT,
    });
    return Object.freeze(records.map(toCandidateSummary));
  } catch {
    try {
      const { data, error } = await getSupabaseClient()
        .from('Property')
        .select(CANDIDATE_SUMMARY_COLUMNS)
        .eq('state', 'CO')
        .eq('isPrivateExclusive', false)
        .ilike('status', 'Active')
        .order('updatedAt', { ascending: false })
        .limit(LEGACY_AGENT_PROPERTY_CANDIDATE_LIMIT);
      if (error) throw new Error('Repository property summary read fallback failed.');
      return Object.freeze(((data || []) as unknown as RepositoryPropertySummary[]).map(toCandidateSummary));
    } catch {
      return Object.freeze([]);
    }
  }
}

export async function searchAgentPropertyConversationCandidateSummaries(query: string): Promise<readonly AgentPropertyConversationCandidateSummary[]> {
  const normalizedQuery = normalizeAgentPropertySearchQuery(query);
  if (!normalizedQuery) return Object.freeze([]);

  try {
    const records = await prisma.property.findMany({
      where: {
        state: { equals: 'CO', mode: 'insensitive' },
        status: { equals: 'Active', mode: 'insensitive' },
        isPrivateExclusive: false,
        OR: [
          { address: { contains: normalizedQuery, mode: 'insensitive' } },
          { city: { contains: normalizedQuery, mode: 'insensitive' } },
          { zip: { contains: normalizedQuery, mode: 'insensitive' } },
          { propertyType: { contains: normalizedQuery, mode: 'insensitive' } },
          { neighborhood: { contains: normalizedQuery, mode: 'insensitive' } },
          { mlsId: { contains: normalizedQuery, mode: 'insensitive' } },
        ],
      },
      select: {
        slug: true, address: true, city: true, state: true, zip: true, status: true, price: true, propertyType: true, neighborhood: true,
      },
      orderBy: [{ updatedAt: 'desc' }, { slug: 'asc' }],
      take: AGENT_PROPERTY_SEARCH_RESULT_LIMIT,
    });
    return Object.freeze(records.map(toCandidateSummary));
  } catch {
    try {
      return Object.freeze((await readSupabaseCandidateSummaries(normalizedQuery)).map(toCandidateSummary));
    } catch {
      return Object.freeze([]);
    }
  }
}

export async function getAgentPropertyConversationCandidate(slug: string, now = new Date()): Promise<AgentPropertyConversationCandidate | null> {
  if (!isSafePropertySlug(slug)) return null;

  try {
    const record = await prisma.property.findFirst({
      where: {
        slug,
        state: { equals: 'CO', mode: 'insensitive' },
        status: { equals: 'Active', mode: 'insensitive' },
        isPrivateExclusive: false,
      },
      select: {
        mlsId: true, slug: true, address: true, city: true, state: true, zip: true, status: true, isPrivateExclusive: true,
        price: true, beds: true, baths: true, sqft: true, lotSize: true, yearBuilt: true, propertyType: true, neighborhood: true,
        updatedAt: true, lastIntelligenceSync: true, sourceModifiedAt: true,
      },
    });
    return record ? toCandidate(record, now) : null;
  } catch {
    try {
      const record = await readSupabaseCandidateBySlug(slug);
      return record ? toCandidate(record, now) : null;
    } catch {
      return null;
    }
  }
}
