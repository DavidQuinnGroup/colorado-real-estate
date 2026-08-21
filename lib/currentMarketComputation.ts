import { evaluateRestrictionTriggeredSourceGovernance } from './sourceGovernanceRestrictionTriggered';

export const REIE_BOUNDED_CURRENT_MARKET_COMPUTATION_STATUS = 'REIE_BOUNDED_CURRENT_MARKET_COMPUTATION_CERTIFIED' as const;
export const CURRENT_MARKET_COMPUTATION_MODE = 'FIXTURE_ONLY_LIVE_READ_AUTHORIZATION_REQUIRED' as const;
export const CURRENT_MARKET_NORMALIZATION_VERSION = 'CURRENT_MARKET_NORMALIZATION_V1' as const;
export const CURRENT_MARKET_METRIC_VERSION = 'CURRENT_MARKET_METRICS_V1' as const;

export const CURRENT_MARKET_SUPPORTED_CITIES = Object.freeze(['Boulder', 'Louisville', 'Lafayette', 'Superior', 'Erie', 'Longmont'] as const);
export type CurrentMarketCity = (typeof CURRENT_MARKET_SUPPORTED_CITIES)[number];
export type CurrentMarketStatus = 'ACTIVE' | 'COMING_SOON' | 'PENDING' | 'CLOSED' | 'INACTIVE' | 'UNKNOWN';
export type CurrentMarketPropertyType = 'SINGLE_FAMILY' | 'CONDO' | 'TOWNHOME' | 'MULTI_FAMILY' | 'LAND' | 'OTHER' | 'UNKNOWN';
export type CurrentMarketScope = Readonly<{ type: 'CITY' | 'ZIP'; id: string }>;
export type CurrentMarketMetric = 'ACTIVE_INVENTORY_COUNT' | 'MEDIAN_ACTIVE_LIST_PRICE' | 'MEDIAN_ACTIVE_LIST_PRICE_PER_SQFT' | 'ACTIVE_INVENTORY_BY_PROPERTY_TYPE' | 'PENDING_COUNT' | 'PENDING_TO_ACTIVE_RATIO';
export type CurrentMarketAggregateState = 'CERTIFIED' | 'INSUFFICIENT_VERIFIED_SAMPLE' | 'NOT_AVAILABLE';

export type CurrentMarketListingInput = Readonly<{
  mlsId: string | null;
  status: string | null;
  city: string | null;
  zip: string | null;
  propertyType: string | null;
  listPrice: number | null;
  sqft: number | null;
  sourceModifiedAt: string | Date | null;
}>;

export type CurrentMarketComputationInput = Readonly<{
  sourceSetId: string;
  computedAt: string | Date;
  maximumSourceAgeHours: number;
  minimumVerifiedSampleSize: number;
  listings: readonly CurrentMarketListingInput[];
}>;

export type NormalizedCurrentMarketListing = Readonly<{
  city: CurrentMarketCity;
  listPrice: number | null;
  mlsId: string;
  propertyType: CurrentMarketPropertyType;
  sourceModifiedAt: string;
  sqft: number | null;
  status: CurrentMarketStatus;
  zip: string;
}>;

export type CurrentMarketAggregate = Readonly<{
  metric: CurrentMarketMetric;
  scope: CurrentMarketScope;
  state: CurrentMarketAggregateState;
  value: number | null;
  sampleSize: number;
  populationSize: number;
  sourceSetId: string;
  computedAt: string;
  latestAdmittedSourceModifiedAt: string | null;
  oldestAdmittedSourceModifiedAt: string | null;
  freshness: 'CURRENT_CERTIFIED' | 'NO_ADMITTED_RECORDS';
  normalizationVersion: typeof CURRENT_MARKET_NORMALIZATION_VERSION;
  metricVersion: typeof CURRENT_MARKET_METRIC_VERSION;
  limitations: readonly string[];
}>;

export type CurrentMarketComputationResult = Readonly<{
  status: typeof REIE_BOUNDED_CURRENT_MARKET_COMPUTATION_STATUS;
  mode: typeof CURRENT_MARKET_COMPUTATION_MODE;
  aggregates: readonly CurrentMarketAggregate[];
  normalizedListings: readonly NormalizedCurrentMarketListing[];
  exclusionCounts: Readonly<Record<string, number>>;
  protectedBoundaries: Readonly<{
    providerActivity: false;
    persistence: false;
    publicActivation: false;
    customerData: false;
    agentComposition: false;
  }>;
}>;

const STATUS_TAXONOMY: Readonly<Record<string, CurrentMarketStatus>> = Object.freeze({
  active: 'ACTIVE',
  'coming soon': 'COMING_SOON',
  pending: 'PENDING',
  'under contract': 'PENDING',
  closed: 'CLOSED',
  sold: 'CLOSED',
  inactive: 'INACTIVE',
  withdrawn: 'INACTIVE',
  expired: 'INACTIVE',
  cancelled: 'INACTIVE',
  canceled: 'INACTIVE',
});

const PROPERTY_TYPE_TAXONOMY: Readonly<Record<string, CurrentMarketPropertyType>> = Object.freeze({
  'single family': 'SINGLE_FAMILY',
  'single-family': 'SINGLE_FAMILY',
  detached: 'SINGLE_FAMILY',
  condo: 'CONDO',
  condominium: 'CONDO',
  townhome: 'TOWNHOME',
  townhouse: 'TOWNHOME',
  'multi family': 'MULTI_FAMILY',
  multifamily: 'MULTI_FAMILY',
  land: 'LAND',
  other: 'OTHER',
});

function text(value: string | null) {
  return value?.trim().replace(/\s+/g, ' ') ?? '';
}

function normalizeStatus(value: string | null): CurrentMarketStatus {
  return STATUS_TAXONOMY[text(value).toLowerCase()] ?? 'UNKNOWN';
}

function normalizeCity(value: string | null): CurrentMarketCity | null {
  const normalized = text(value).toLowerCase();
  return CURRENT_MARKET_SUPPORTED_CITIES.find((city) => city.toLowerCase() === normalized) ?? null;
}

function normalizeZip(value: string | null): string | null {
  const match = text(value).match(/^(\d{5})(?:-\d{4})?$/);
  return match?.[1] ?? null;
}

function normalizePropertyType(value: string | null): CurrentMarketPropertyType {
  return PROPERTY_TYPE_TAXONOMY[text(value).toLowerCase()] ?? 'UNKNOWN';
}

function finitePositive(value: number | null): number | null {
  return value !== null && Number.isFinite(value) && value > 0 ? value : null;
}

function parseDate(value: string | Date | null): Date | null {
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value : null;
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function countReason(target: Record<string, number>, reason: string) {
  target[reason] = (target[reason] ?? 0) + 1;
}

function median(values: readonly number[]) {
  if (!values.length) return null;
  const ordered = [...values].sort((left, right) => left - right);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
}

function scopes(listings: readonly NormalizedCurrentMarketListing[]) {
  const map = new Map<string, { scope: CurrentMarketScope; listings: NormalizedCurrentMarketListing[] }>();
  for (const listing of listings) {
    for (const scope of [
      { type: 'CITY' as const, id: listing.city },
      { type: 'ZIP' as const, id: listing.zip },
    ]) {
      const key = `${scope.type}:${scope.id}`;
      const existing = map.get(key) ?? { scope: Object.freeze(scope), listings: [] };
      existing.listings.push(listing);
      map.set(key, existing);
    }
  }
  return [...map.values()].sort((left, right) => `${left.scope.type}:${left.scope.id}`.localeCompare(`${right.scope.type}:${right.scope.id}`));
}

function aggregate(
  metric: CurrentMarketMetric,
  scope: CurrentMarketScope,
  value: number | null,
  sampleSize: number,
  populationSize: number,
  input: CurrentMarketComputationInput,
  listings: readonly NormalizedCurrentMarketListing[],
  limitations: readonly string[] = [],
): CurrentMarketAggregate {
  const timestamps = listings.map((listing) => listing.sourceModifiedAt).sort();
  const requiresSample = metric === 'MEDIAN_ACTIVE_LIST_PRICE' || metric === 'MEDIAN_ACTIVE_LIST_PRICE_PER_SQFT';
  const state: CurrentMarketAggregateState = value === null
    ? 'NOT_AVAILABLE'
    : requiresSample && sampleSize < input.minimumVerifiedSampleSize
      ? 'INSUFFICIENT_VERIFIED_SAMPLE'
      : 'CERTIFIED';
  return Object.freeze({
    metric,
    scope,
    state,
    value: state === 'CERTIFIED' || !requiresSample ? value : null,
    sampleSize,
    populationSize,
    sourceSetId: input.sourceSetId,
    computedAt: parseDate(input.computedAt)!.toISOString(),
    latestAdmittedSourceModifiedAt: timestamps.at(-1) ?? null,
    oldestAdmittedSourceModifiedAt: timestamps.at(0) ?? null,
    freshness: timestamps.length ? 'CURRENT_CERTIFIED' : 'NO_ADMITTED_RECORDS',
    normalizationVersion: CURRENT_MARKET_NORMALIZATION_VERSION,
    metricVersion: CURRENT_MARKET_METRIC_VERSION,
    limitations: Object.freeze([...new Set(limitations)].sort()),
  });
}

export function computeCurrentMarketAggregates(input: CurrentMarketComputationInput): CurrentMarketComputationResult {
  const computedAt = parseDate(input.computedAt);
  if (!computedAt || !text(input.sourceSetId) || !Number.isFinite(input.maximumSourceAgeHours) || input.maximumSourceAgeHours < 0 || !Number.isInteger(input.minimumVerifiedSampleSize) || input.minimumVerifiedSampleSize < 1) {
    throw new Error('Current Market computation requires a source set, valid computation time, non-negative freshness window, and positive integer sample policy.');
  }

  const sourceGovernance = evaluateRestrictionTriggeredSourceGovernance({
    sourceAccessAuthorized: true,
    professionalPurpose: true,
    proposedUse: 'CURRENT_AGGREGATE_STATISTIC',
    knownTermsMateriallyAmbiguous: false,
    restrictionEvidence: [],
    sourceQualitySufficient: true,
    historicalEvidenceAvailable: true,
    architectureReady: true,
  });
  if (sourceGovernance.decision !== 'NOT_BLOCKED_BY_PERMISSION_POSTURE') throw new Error('Current Market source-governance posture is not eligible.');

  const exclusionCounts: Record<string, number> = {};
  const candidates: NormalizedCurrentMarketListing[] = [];
  const identities = new Map<string, number>();

  for (const listing of input.listings) {
    const mlsId = text(listing.mlsId);
    const city = normalizeCity(listing.city);
    const zip = normalizeZip(listing.zip);
    const sourceModifiedAt = parseDate(listing.sourceModifiedAt);
    if (!mlsId) { countReason(exclusionCounts, 'MISSING_LISTING_IDENTITY'); continue; }
    if (!city) { countReason(exclusionCounts, 'UNSUPPORTED_OR_INVALID_CITY'); continue; }
    if (!zip) { countReason(exclusionCounts, 'INVALID_ZIP'); continue; }
    if (!sourceModifiedAt) { countReason(exclusionCounts, 'MISSING_OR_INVALID_SOURCE_MODIFIED_AT'); continue; }
    if ((computedAt.getTime() - sourceModifiedAt.getTime()) / 3_600_000 > input.maximumSourceAgeHours) { countReason(exclusionCounts, 'SOURCE_STALE'); continue; }
    identities.set(mlsId, (identities.get(mlsId) ?? 0) + 1);
    candidates.push(Object.freeze({
      mlsId,
      city,
      zip,
      status: normalizeStatus(listing.status),
      propertyType: normalizePropertyType(listing.propertyType),
      listPrice: finitePositive(listing.listPrice),
      sqft: finitePositive(listing.sqft),
      sourceModifiedAt: sourceModifiedAt.toISOString(),
    }));
  }

  const normalizedListings = candidates.filter((listing) => {
    if ((identities.get(listing.mlsId) ?? 0) > 1) {
      countReason(exclusionCounts, 'DUPLICATE_LISTING_IDENTITY');
      return false;
    }
    if (listing.status === 'UNKNOWN') {
      countReason(exclusionCounts, 'UNSUPPORTED_STATUS');
      return false;
    }
    return true;
  }).sort((left, right) => left.mlsId.localeCompare(right.mlsId));

  const aggregates: CurrentMarketAggregate[] = [];
  for (const group of scopes(normalizedListings)) {
    const active = group.listings.filter((listing) => listing.status === 'ACTIVE');
    const pending = group.listings.filter((listing) => listing.status === 'PENDING');
    const activeWithPrice = active.filter((listing) => listing.listPrice !== null);
    const activeWithPpsf = active.filter((listing) => listing.listPrice !== null && listing.sqft !== null);
    const typeCounts = active.reduce<Record<CurrentMarketPropertyType, number>>((counts, listing) => {
      counts[listing.propertyType] += 1;
      return counts;
    }, { SINGLE_FAMILY: 0, CONDO: 0, TOWNHOME: 0, MULTI_FAMILY: 0, LAND: 0, OTHER: 0, UNKNOWN: 0 });
    const typeMetricValue = Object.entries(typeCounts).filter(([, count]) => count > 0).length;
    const scopeLimitations = [
      'Price bands are deferred pending a separately governed threshold policy.',
      'PPSF uses current list price and stored square footage; it is not sale price per square foot.',
      'No closed-sale, DOM, price-change, or historical trend metric is produced.',
    ];

    aggregates.push(
      aggregate('ACTIVE_INVENTORY_COUNT', group.scope, active.length, active.length, group.listings.length, input, group.listings, scopeLimitations),
      aggregate('MEDIAN_ACTIVE_LIST_PRICE', group.scope, median(activeWithPrice.map((listing) => listing.listPrice!)), activeWithPrice.length, active.length, input, group.listings, scopeLimitations),
      aggregate('MEDIAN_ACTIVE_LIST_PRICE_PER_SQFT', group.scope, median(activeWithPpsf.map((listing) => listing.listPrice! / listing.sqft!)), activeWithPpsf.length, active.length, input, group.listings, scopeLimitations),
      aggregate('ACTIVE_INVENTORY_BY_PROPERTY_TYPE', group.scope, typeMetricValue, active.length, active.length, input, group.listings, [...scopeLimitations, `Property-type counts: ${JSON.stringify(typeCounts)}.`]),
      aggregate('PENDING_COUNT', group.scope, pending.length, pending.length, group.listings.length, input, group.listings, scopeLimitations),
      aggregate('PENDING_TO_ACTIVE_RATIO', group.scope, active.length ? pending.length / active.length : null, pending.length + active.length, group.listings.length, input, group.listings, active.length ? scopeLimitations : [...scopeLimitations, 'Ratio unavailable because active inventory denominator is zero.']),
    );
  }

  return Object.freeze({
    status: REIE_BOUNDED_CURRENT_MARKET_COMPUTATION_STATUS,
    mode: CURRENT_MARKET_COMPUTATION_MODE,
    aggregates: Object.freeze(aggregates.sort((left, right) => `${left.scope.type}:${left.scope.id}:${left.metric}`.localeCompare(`${right.scope.type}:${right.scope.id}:${right.metric}`))),
    normalizedListings: Object.freeze(normalizedListings),
    exclusionCounts: Object.freeze(Object.fromEntries(Object.entries(exclusionCounts).sort(([left], [right]) => left.localeCompare(right)))),
    protectedBoundaries: Object.freeze({ providerActivity: false, persistence: false, publicActivation: false, customerData: false, agentComposition: false }),
  });
}
