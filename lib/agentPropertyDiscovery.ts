import { createHash } from 'node:crypto';

import type { Prisma, PrismaClient } from '@prisma/client';

export const AGENT_PROPERTY_DISCOVERY_VERSION = 'AGENT_PROPERTY_DISCOVERY_STAGE_1_V1' as const;
export const AGENT_PROPERTY_DISCOVERY_MIN_QUERY_LENGTH = 2;
export const AGENT_PROPERTY_DISCOVERY_RESULT_LIMIT = 8;

export type AgentPropertyDiscoverySourceKind = 'CANONICAL_DATABASE' | 'ACTIVE_LISTING';
export type AgentPropertyDiscoveryResolutionState =
  | 'EXISTING_CANONICAL'
  | 'EXISTING_LISTING_WITH_CANONICAL_ASSOCIATION'
  | 'LISTING_FOUND_BUT_NOT_ATTACHABLE'
  | 'AMBIGUOUS';

export type AgentPropertyDiscoveryResult = Readonly<{
  resultToken: string;
  displayAddress: string;
  structuredAddress: {
    address: string | null;
    unit: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
  };
  sourceKind: AgentPropertyDiscoverySourceKind;
  resolutionState: AgentPropertyDiscoveryResolutionState;
  canonicalPropertyId: string | null;
  listingIdentity: { propertyId: string; mlsId: string; status: string } | null;
  attachable: boolean;
  alreadyLinked: boolean;
  context: string;
}>;

export type AgentPropertyDiscoveryResponse = Readonly<{
  query: string;
  normalizedQuery: string;
  minimumQueryLength: number;
  limit: number;
  state: 'QUERY_TOO_SHORT' | 'NO_RESULT' | 'RESULTS';
  results: AgentPropertyDiscoveryResult[];
}>;

type Database = Pick<PrismaClient, 'clientCase' | 'clientCaseProperty' | 'canonicalPhysicalProperty' | 'property'>;

type CanonicalRow = Prisma.CanonicalPhysicalPropertyGetPayload<{ select: typeof CANONICAL_SELECT }>;
type ListingRow = Prisma.PropertyGetPayload<{ select: typeof LISTING_SELECT }>;

const TOKEN_PREFIX = 'atlas-pd1';
const TOKEN_PURPOSE = 'PROJECT_ATLAS_PROPERTY_DISCOVERY_STAGE_1_V1';
const ATTACHABLE_LISTING_CONFIDENCE = new Set(['PROBABLE', 'CONFIRMED']);

const CANONICAL_SELECT = {
  id: true,
  sourceFormattedSitusAddress: true,
  normalizedSitusAddress: true,
  unit: true,
  city: true,
  state: true,
  postalCode: true,
  identityStatus: true,
  identityConfidence: true,
} satisfies Prisma.CanonicalPhysicalPropertySelect;

const LISTING_SELECT = {
  id: true,
  mlsId: true,
  address: true,
  city: true,
  state: true,
  zip: true,
  status: true,
  propertyType: true,
  isPrivateExclusive: true,
  canonicalListingEvents: {
    where: { isCurrent: true, status: 'CURRENT' },
    select: {
      canonicalPropertyId: true,
      status: true,
      isCurrent: true,
      confidence: true,
      verificationRequired: true,
      canonicalProperty: { select: CANONICAL_SELECT },
    },
    orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
    take: 2,
  },
} satisfies Prisma.PropertySelect;

function normalizeSearchText(value: string | null | undefined) {
  return (value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function safeText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || null;
}

function propertyAddress(parts: { address: string | null; city: string | null; state: string | null; postalCode: string | null }) {
  const place = [parts.city, parts.state, parts.postalCode].filter(Boolean).join(', ');
  return [parts.address, place].filter(Boolean).join(' · ') || 'Existing property';
}

function canonicalAddress(row: CanonicalRow) {
  return propertyAddress({
    address: safeText(row.sourceFormattedSitusAddress) ?? safeText(row.normalizedSitusAddress),
    city: safeText(row.city),
    state: safeText(row.state),
    postalCode: safeText(row.postalCode),
  });
}

function tokenPayload(payload: { sourceKind: AgentPropertyDiscoverySourceKind; canonicalPropertyId: string }) {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = createHash('sha256').update(`${TOKEN_PURPOSE}:${body}`).digest('base64url').slice(0, 24);
  return `${TOKEN_PREFIX}.${body}.${signature}`;
}

function parseToken(token: string) {
  const [prefix, body, signature] = token.split('.');
  if (prefix !== TOKEN_PREFIX || !body || !signature) return null;
  const expected = createHash('sha256').update(`${TOKEN_PURPOSE}:${body}`).digest('base64url').slice(0, 24);
  if (signature !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as { sourceKind?: unknown; canonicalPropertyId?: unknown };
    if ((payload.sourceKind === 'CANONICAL_DATABASE' || payload.sourceKind === 'ACTIVE_LISTING') && typeof payload.canonicalPropertyId === 'string' && payload.canonicalPropertyId.trim()) {
      return { sourceKind: payload.sourceKind, canonicalPropertyId: payload.canonicalPropertyId.trim() };
    }
  } catch {
    return null;
  }
  return null;
}

function rankAddress(displayAddress: string, normalizedQuery: string, sourceKind: AgentPropertyDiscoverySourceKind, attachable: boolean) {
  const normalizedAddress = normalizeSearchText(displayAddress);
  if (sourceKind === 'CANONICAL_DATABASE' && normalizedAddress === normalizedQuery) return 0;
  if (sourceKind === 'CANONICAL_DATABASE' && normalizedAddress.startsWith(normalizedQuery)) return 1;
  if (sourceKind === 'ACTIVE_LISTING' && attachable && normalizedAddress === normalizedQuery) return 2;
  if (attachable) return 3;
  return 9;
}

function isSafeListingAssociation(event: ListingRow['canonicalListingEvents'][number]) {
  return event.status === 'CURRENT' && event.isCurrent === true && ATTACHABLE_LISTING_CONFIDENCE.has(event.confidence);
}

function canonicalResult(row: CanonicalRow, alreadyLinkedIds: ReadonlySet<string>, ambiguous: boolean): AgentPropertyDiscoveryResult {
  const displayAddress = canonicalAddress(row);
  return {
    resultToken: ambiguous ? '' : tokenPayload({ sourceKind: 'CANONICAL_DATABASE', canonicalPropertyId: row.id }),
    displayAddress,
    structuredAddress: {
      address: safeText(row.sourceFormattedSitusAddress) ?? safeText(row.normalizedSitusAddress),
      unit: safeText(row.unit),
      city: safeText(row.city),
      state: safeText(row.state),
      postalCode: safeText(row.postalCode),
    },
    sourceKind: 'CANONICAL_DATABASE',
    resolutionState: ambiguous ? 'AMBIGUOUS' : 'EXISTING_CANONICAL',
    canonicalPropertyId: row.id,
    listingIdentity: null,
    attachable: !ambiguous,
    alreadyLinked: alreadyLinkedIds.has(row.id),
    context: ambiguous ? 'Multiple existing properties match this address. Review unit or address context before attachment.' : 'Existing property',
  };
}

function listingResult(row: ListingRow, alreadyLinkedIds: ReadonlySet<string>): AgentPropertyDiscoveryResult {
  const safeEvent = row.canonicalListingEvents.find(isSafeListingAssociation) ?? null;
  const canonical = safeEvent?.canonicalProperty ?? null;
  const canonicalPropertyId = safeEvent?.canonicalPropertyId ?? null;
  const displayAddress = canonical ? canonicalAddress(canonical) : propertyAddress({ address: row.address, city: row.city, state: row.state, postalCode: row.zip });
  const attachable = Boolean(canonicalPropertyId);
  return {
    resultToken: canonicalPropertyId ? tokenPayload({ sourceKind: 'ACTIVE_LISTING', canonicalPropertyId }) : '',
    displayAddress,
    structuredAddress: {
      address: canonical ? safeText(canonical.sourceFormattedSitusAddress) ?? safeText(canonical.normalizedSitusAddress) : safeText(row.address),
      unit: canonical ? safeText(canonical.unit) : null,
      city: canonical ? safeText(canonical.city) : safeText(row.city),
      state: canonical ? safeText(canonical.state) : safeText(row.state),
      postalCode: canonical ? safeText(canonical.postalCode) : safeText(row.zip),
    },
    sourceKind: 'ACTIVE_LISTING',
    resolutionState: attachable ? 'EXISTING_LISTING_WITH_CANONICAL_ASSOCIATION' : 'LISTING_FOUND_BUT_NOT_ATTACHABLE',
    canonicalPropertyId,
    listingIdentity: { propertyId: row.id, mlsId: row.mlsId, status: row.status },
    attachable,
    alreadyLinked: canonicalPropertyId ? alreadyLinkedIds.has(canonicalPropertyId) : false,
    context: attachable ? 'Active listing with existing property identity' : 'Property found, not yet available to add to a Client Case',
  };
}

export function createAgentPropertyDiscoveryService(prisma: Database) {
  async function verifyCase(ownerAgentSubject: string, clientCaseId: string) {
    const clientCase = await prisma.clientCase.findFirst({ where: { id: clientCaseId, ownerAgentSubject }, select: { id: true } });
    if (!clientCase) throw new Error('OWNERSHIP_DENIED');
  }

  async function linkedCanonicalIds(ownerAgentSubject: string, clientCaseId: string) {
    const rows = await prisma.clientCaseProperty.findMany({
      where: { clientCaseId, clientCase: { ownerAgentSubject } },
      select: { canonicalPropertyId: true },
    });
    return new Set(rows.map((row) => row.canonicalPropertyId));
  }

  async function search(ownerAgentSubject: string, clientCaseId: string, rawQuery: string, limit = AGENT_PROPERTY_DISCOVERY_RESULT_LIMIT): Promise<AgentPropertyDiscoveryResponse> {
    await verifyCase(ownerAgentSubject, clientCaseId);
    const query = rawQuery.trim();
    const normalizedQuery = normalizeSearchText(query);
    const safeLimit = Math.min(Math.max(Math.floor(limit), 1), AGENT_PROPERTY_DISCOVERY_RESULT_LIMIT);
    if (normalizedQuery.length < AGENT_PROPERTY_DISCOVERY_MIN_QUERY_LENGTH) {
      return { query, normalizedQuery, minimumQueryLength: AGENT_PROPERTY_DISCOVERY_MIN_QUERY_LENGTH, limit: safeLimit, state: 'QUERY_TOO_SHORT', results: [] };
    }

    const [alreadyLinkedIds, canonicalRows, listingRows] = await Promise.all([
      linkedCanonicalIds(ownerAgentSubject, clientCaseId),
      prisma.canonicalPhysicalProperty.findMany({
        where: {
          supersededById: null,
          OR: [
            { sourceFormattedSitusAddress: { contains: query, mode: 'insensitive' } },
            { normalizedSitusAddress: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
            { postalCode: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: CANONICAL_SELECT,
        orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
        take: safeLimit,
      }),
      prisma.property.findMany({
        where: {
          isPrivateExclusive: false,
          status: { equals: 'Active', mode: 'insensitive' },
          OR: [
            { address: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
            { zip: { contains: query, mode: 'insensitive' } },
            { mlsId: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: LISTING_SELECT,
        orderBy: [{ updatedAt: 'desc' }, { id: 'asc' }],
        take: safeLimit,
      }),
    ]);

    const addressCounts = new Map<string, number>();
    for (const row of canonicalRows) {
      const key = normalizeSearchText(canonicalAddress(row));
      addressCounts.set(key, (addressCounts.get(key) ?? 0) + 1);
    }

    const resultsByCanonicalId = new Map<string, AgentPropertyDiscoveryResult>();
    const looseResults: AgentPropertyDiscoveryResult[] = [];
    for (const row of canonicalRows) {
      const ambiguous = (addressCounts.get(normalizeSearchText(canonicalAddress(row))) ?? 0) > 1;
      const result = canonicalResult(row, alreadyLinkedIds, ambiguous);
      resultsByCanonicalId.set(row.id, result);
    }
    for (const row of listingRows) {
      const result = listingResult(row, alreadyLinkedIds);
      if (result.canonicalPropertyId) {
        if (!resultsByCanonicalId.has(result.canonicalPropertyId)) resultsByCanonicalId.set(result.canonicalPropertyId, result);
      } else {
        looseResults.push(result);
      }
    }

    const results = [...resultsByCanonicalId.values(), ...looseResults]
      .sort((left, right) => rankAddress(left.displayAddress, normalizedQuery, left.sourceKind, left.attachable) - rankAddress(right.displayAddress, normalizedQuery, right.sourceKind, right.attachable) || left.displayAddress.localeCompare(right.displayAddress))
      .slice(0, safeLimit);

    return { query, normalizedQuery, minimumQueryLength: AGENT_PROPERTY_DISCOVERY_MIN_QUERY_LENGTH, limit: safeLimit, state: results.length ? 'RESULTS' : 'NO_RESULT', results };
  }

  async function canonicalPropertyIdForResultToken(ownerAgentSubject: string, clientCaseId: string, token: string) {
    await verifyCase(ownerAgentSubject, clientCaseId);
    const parsed = parseToken(token);
    if (!parsed) return null;
    const found = await prisma.canonicalPhysicalProperty.findFirst({ where: { id: parsed.canonicalPropertyId, supersededById: null }, select: { id: true } });
    return found?.id ?? null;
  }

  return { search, canonicalPropertyIdForResultToken };
}
