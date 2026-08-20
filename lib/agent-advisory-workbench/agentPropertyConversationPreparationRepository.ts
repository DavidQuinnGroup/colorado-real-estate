import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { prisma } from '@/lib/prisma';

import {
  AGENT_PROPERTY_LISTING_SOURCE_ID,
  type AgentPropertyPreparationProperty,
  type AgentPropertyPreparationSourcePosture,
} from './agentPropertyPreparationAdmission';
import type { AgentPropertyConversationCandidate } from './agentPropertyConversationPreparation';

const MAX_CANDIDATES = 120;
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

const CANDIDATE_COLUMNS = [
  'mlsId', 'slug', 'address', 'city', 'state', 'zip', 'status', 'isPrivateExclusive', 'price', 'beds', 'baths', 'sqft',
  'lotSize', 'yearBuilt', 'propertyType', 'neighborhood', 'updatedAt', 'lastIntelligenceSync', 'sourceModifiedAt',
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

async function readSupabaseCandidates() {
  const { data, error } = await getSupabaseClient()
    .from('Property')
    .select(CANDIDATE_COLUMNS)
    .eq('state', 'CO')
    .eq('isPrivateExclusive', false)
    .ilike('status', 'Active')
    .order('updatedAt', { ascending: false })
    .limit(MAX_CANDIDATES);

  if (error) throw new Error('Repository property read fallback failed.');
  return (data || []).flatMap((row) => {
    const mapped = mapSupabaseRow(row as unknown as SupabasePropertyRow);
    return mapped ? [mapped] : [];
  });
}

export async function getAgentPropertyConversationCandidates(now = new Date()): Promise<readonly AgentPropertyConversationCandidate[]> {
  try {
    const records = await prisma.property.findMany({
      where: { state: { equals: 'CO', mode: 'insensitive' }, status: { equals: 'Active', mode: 'insensitive' }, isPrivateExclusive: false },
      select: {
        mlsId: true, slug: true, address: true, city: true, state: true, zip: true, status: true, isPrivateExclusive: true,
        price: true, beds: true, baths: true, sqft: true, lotSize: true, yearBuilt: true, propertyType: true, neighborhood: true,
        updatedAt: true, lastIntelligenceSync: true, sourceModifiedAt: true,
      },
      orderBy: [{ updatedAt: 'desc' }, { slug: 'asc' }],
      take: MAX_CANDIDATES,
    });
    return Object.freeze(records.map((record) => toCandidate(record, now)));
  } catch {
    try {
      return Object.freeze((await readSupabaseCandidates()).map((record) => toCandidate(record, now)));
    } catch {
      return Object.freeze([]);
    }
  }
}
