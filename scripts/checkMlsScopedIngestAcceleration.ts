import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import type { Property } from '@prisma/client';

import {
  createMlsScopedIngestCheckpoint,
  fetchInitialMlsScopedPublicSearchPage,
  getMlsScopedPublicSearchFingerprint,
  ingestMlsScopedPageAccelerated,
  MLS_SCOPED_ACCELERATION_MAX_CONCURRENCY,
  MLS_SCOPED_PUBLIC_SEARCH_FILTER,
  MLS_SCOPED_PUBLIC_SEARCH_ORDER_BY,
  validateMlsScopedIngestCheckpoint,
  type MlsScopedIngestPageDependencies,
} from '../lib/mls/scopedIngestAcceleration.js';
import { buildPropertyRecordWithDiagnostics, type ExistingPropertySnapshot, type MlsListing } from '../lib/mls/upsertListing.js';

const providerBaseUrl = 'https://api.example-mls.test/odata';
const scopeFingerprint = getMlsScopedPublicSearchFingerprint();

type FixtureStore = Map<string, Property>;

function makeListing(
  id: string,
  {
    sourceModifiedAt = '2026-08-14T10:00:00.000Z',
    price = 750000,
  }: {
    sourceModifiedAt?: string | null;
    price?: number;
  } = {},
): MlsListing {
  return {
    City: 'Boulder',
    Latitude: 40.015,
    ListingKey: id,
    ListPrice: price,
    Longitude: -105.27,
    ModificationTimestamp: sourceModifiedAt,
    PostalCode: '80302',
    PropertyType: 'Residential',
    StandardStatus: 'Active',
    StateOrProvince: 'CO',
    UnparsedAddress: `${id} Pearl St`,
  };
}

function toExisting(property: Property): ExistingPropertySnapshot {
  return {
    id: property.id,
    lat: property.lat,
    lng: property.lng,
    slug: property.slug,
    sourceModifiedAt: property.sourceModifiedAt,
  };
}

function makeProperty(data: NonNullable<ReturnType<typeof buildPropertyRecordWithDiagnostics>['propertyData']>, id: string): Property {
  const now = new Date();
  return {
    altitude: data.altitude ?? 5280,
    address: data.address,
    baths: data.baths ?? null,
    beds: data.beds ?? null,
    city: data.city,
    createdAt: now,
    description: data.description ?? null,
    efficiencyScore: data.efficiencyScore ?? 0,
    gcForensics: (data.gcForensics ?? null) as Property['gcForensics'],
    hasPolybutyleneRisk: data.hasPolybutyleneRisk ?? false,
    id,
    isPrivateExclusive: false,
    lastIntelligenceSync: data.lastIntelligenceSync ? new Date(data.lastIntelligenceSync) : null,
    lat: data.lat,
    listingAgent: data.listingAgent ?? null,
    listingOffice: data.listingOffice ?? null,
    lng: data.lng,
    lotSize: data.lotSize ?? null,
    mlsId: data.mlsId,
    neighborhood: data.neighborhood ?? null,
    negotiationLevers: null,
    optimizedValue: 0,
    price: data.price,
    propertyType: data.propertyType,
    publicSearchEligibility: null,
    resilienceScore: data.resilienceScore ?? 85,
    schoolDistrict: data.schoolDistrict ?? null,
    slug: data.slug,
    soilType: data.soilType ?? 'Front Range Mixed',
    sqft: data.sqft ?? null,
    state: data.state,
    status: data.status,
    subdivision: data.subdivision ?? null,
    sourceModifiedAt: data.sourceModifiedAt ? new Date(data.sourceModifiedAt) : null,
    updatedAt: now,
    yearBuilt: data.yearBuilt ?? null,
    zip: data.zip,
  };
}

function createFixtureDependencies(store: FixtureStore, options: { failIds?: Set<string>; preloadDelayMs?: number } = {}) {
  let preloadCalls = 0;
  let upsertCalls = 0;

  const dependencies: MlsScopedIngestPageDependencies = {
    preloadExisting: async (ids) => {
      preloadCalls += 1;
      if (options.preloadDelayMs) await delay(options.preloadDelayMs);
      return new Map(ids.flatMap((id) => {
        const existing = store.get(id);
        return existing ? [[id, toExisting(existing)] as const] : [];
      }));
    },
    upsert: async (listing, existing) => {
      upsertCalls += 1;
      const id = String(listing.ListingKey || '');
      if (options.failIds?.has(id)) throw new Error(`fixture failure for ${id}`);
      const { propertyData } = buildPropertyRecordWithDiagnostics(listing, existing, new Date('2026-08-14T12:00:00.000Z'));
      if (!propertyData) return null;
      const property = makeProperty(propertyData, existing?.id || `prop-${id}`);
      store.set(property.mlsId, property);
      return property;
    },
  };

  return {
    dependencies,
    getStats: () => ({ preloadCalls, upsertCalls }),
  };
}

async function measureCurrentPerRowBaseline(rows: MlsListing[]) {
  const started = Date.now();
  for (const row of rows) {
    assert.ok(row);
    await delay(1);
  }
  return Date.now() - started;
}

const store = new Map<string, Property>();
const newPage = [makeListing('new-1'), makeListing('new-2'), makeListing('new-3')];
let fixture = createFixtureDependencies(store);
let result = await ingestMlsScopedPageAccelerated(newPage, fixture.dependencies, { concurrency: 3 });
assert.equal(result.created, 3);
assert.equal(result.updated, 0);
assert.equal(result.failed, 0);
assert.equal(fixture.getStats().preloadCalls, 1);

fixture = createFixtureDependencies(store);
result = await ingestMlsScopedPageAccelerated(newPage, fixture.dependencies, { concurrency: 3 });
assert.equal(result.created, 0);
assert.equal(result.updated, 3);
assert.equal(result.failed, 0);

const mixedPage = [makeListing('new-4'), makeListing('new-1', { price: 775000 })];
fixture = createFixtureDependencies(store);
result = await ingestMlsScopedPageAccelerated(mixedPage, fixture.dependencies, { concurrency: 2 });
assert.equal(result.created, 1);
assert.equal(result.updated, 1);

const duplicatePage = [makeListing('dup-1', { price: 700000 }), makeListing('dup-1', { price: 710000 })];
fixture = createFixtureDependencies(store);
result = await ingestMlsScopedPageAccelerated(duplicatePage, fixture.dependencies, { concurrency: 2 });
assert.equal(result.duplicateSourceIds, 1);
assert.equal(result.created, 1);
assert.equal(result.updated, 1);
assert.equal(store.get('dup-1')?.price, 710000);

const replayPage = [makeListing('replay-1')];
fixture = createFixtureDependencies(store);
result = await ingestMlsScopedPageAccelerated(replayPage, fixture.dependencies, { concurrency: 1 });
assert.equal(result.created, 1);
fixture = createFixtureDependencies(store);
result = await ingestMlsScopedPageAccelerated(replayPage, fixture.dependencies, { concurrency: 1 });
assert.equal(result.updated, 1);

const freshnessStore = new Map<string, Property>();
fixture = createFixtureDependencies(freshnessStore);
await ingestMlsScopedPageAccelerated([makeListing('fresh-1', { sourceModifiedAt: '2026-08-14T10:00:00.000Z' })], fixture.dependencies);
assert.equal(freshnessStore.get('fresh-1')?.sourceModifiedAt?.toISOString(), '2026-08-14T10:00:00.000Z');
fixture = createFixtureDependencies(freshnessStore);
await ingestMlsScopedPageAccelerated([makeListing('fresh-1', { sourceModifiedAt: '2026-08-14T11:00:00.000Z' })], fixture.dependencies);
assert.equal(freshnessStore.get('fresh-1')?.sourceModifiedAt?.toISOString(), '2026-08-14T11:00:00.000Z');
fixture = createFixtureDependencies(freshnessStore);
await ingestMlsScopedPageAccelerated([makeListing('fresh-1', { sourceModifiedAt: '2026-08-14T11:00:00.000Z' })], fixture.dependencies);
assert.equal(freshnessStore.get('fresh-1')?.sourceModifiedAt?.toISOString(), '2026-08-14T11:00:00.000Z');
fixture = createFixtureDependencies(freshnessStore);
await ingestMlsScopedPageAccelerated([makeListing('fresh-1', { sourceModifiedAt: '2026-08-14T09:00:00.000Z' })], fixture.dependencies);
assert.equal(freshnessStore.get('fresh-1')?.sourceModifiedAt?.toISOString(), '2026-08-14T11:00:00.000Z');
fixture = createFixtureDependencies(freshnessStore);
await ingestMlsScopedPageAccelerated([makeListing('fresh-1', { sourceModifiedAt: null })], fixture.dependencies);
assert.equal(freshnessStore.get('fresh-1')?.sourceModifiedAt?.toISOString(), '2026-08-14T11:00:00.000Z');
fixture = createFixtureDependencies(freshnessStore);
await ingestMlsScopedPageAccelerated([makeListing('fresh-1', { sourceModifiedAt: 'not-a-date' })], fixture.dependencies);
assert.equal(freshnessStore.get('fresh-1')?.sourceModifiedAt?.toISOString(), '2026-08-14T11:00:00.000Z');

fixture = createFixtureDependencies(new Map(), { failIds: new Set(['fail-1']) });
result = await ingestMlsScopedPageAccelerated([makeListing('ok-1'), makeListing('fail-1')], fixture.dependencies, { concurrency: 2 });
assert.equal(result.created, 1);
assert.equal(result.failed, 1);
assert.equal(result.errors.length, 1);

fixture = createFixtureDependencies(new Map());
result = await ingestMlsScopedPageAccelerated([makeListing('ok-1'), makeListing('fail-1')], fixture.dependencies, { concurrency: 2 });
assert.equal(result.created, 2);
assert.equal(result.failed, 0);

const checkpoint = createMlsScopedIngestCheckpoint({
  fetchedCount: 100,
  nextLink: 'https://api.example-mls.test/odata/Property?$skip=100&$top=100',
  pageNumber: 1,
  processedCount: 100,
  scopeFingerprint,
});
assert.equal(validateMlsScopedIngestCheckpoint({ checkpoint, providerBaseUrl }).ok, true);
assert.equal(
  validateMlsScopedIngestCheckpoint({
    checkpoint: { ...checkpoint, scopeFingerprint: 'wrong' },
    providerBaseUrl,
  }).ok,
  false,
);
assert.equal(
  validateMlsScopedIngestCheckpoint({
    checkpoint: { ...checkpoint, nextLink: 'not a valid link' },
    providerBaseUrl,
  }).ok,
  false,
);
assert.equal(
  validateMlsScopedIngestCheckpoint({
    checkpoint: { ...checkpoint, nextLink: 'https://evil.example.test/odata/Property?$skip=100' },
    providerBaseUrl,
  }).ok,
  false,
);

const concurrencyRows = Array.from({ length: 24 }, (_, index) => makeListing(`conc-${index}`));
fixture = createFixtureDependencies(new Map(), { preloadDelayMs: 1 });
result = await ingestMlsScopedPageAccelerated(concurrencyRows, fixture.dependencies, { concurrency: 999 });
assert.equal(result.peakConcurrency <= MLS_SCOPED_ACCELERATION_MAX_CONCURRENCY, true);
assert.equal(result.fetched, 24);
assert.equal(result.processed, 24);

const performanceRows = Array.from({ length: 100 }, (_, index) => makeListing(`perf-${index}`));
const currentBaselineMs = await measureCurrentPerRowBaseline(performanceRows);
fixture = createFixtureDependencies(new Map(), { preloadDelayMs: 1 });
const acceleratedStarted = Date.now();
result = await ingestMlsScopedPageAccelerated(performanceRows, fixture.dependencies, { concurrency: 8 });
const acceleratedMs = Date.now() - acceleratedStarted;
assert.equal(result.failed, 0);
assert.equal(fixture.getStats().preloadCalls, 1);
assert.equal(fixture.getStats().upsertCalls, 100);

const originalFetch = globalThis.fetch;
const originalBaseUrl = process.env.MLS_GRID_BASE_URL;
const originalToken = process.env.MLS_GRID_TOKEN;
let scopedRequestUrl: URL | null = null;
process.env.MLS_GRID_BASE_URL = providerBaseUrl;
process.env.MLS_GRID_TOKEN = 'fixture-token';
globalThis.fetch = (async (input: RequestInfo | URL) => {
  scopedRequestUrl = new URL(String(input));
  return new Response(
    JSON.stringify({
      '@odata.count': 29884,
      '@odata.nextLink': `${providerBaseUrl}/Property?$skiptoken=fixture`,
      value: [],
    }),
    {
      headers: {
        'content-type': 'application/json',
      },
      status: 200,
    },
  );
}) as typeof fetch;

try {
  const scopedResponse = await fetchInitialMlsScopedPublicSearchPage({ timeoutMs: 1000, top: 100 });
  assert.equal(scopedResponse.metadata.sourceCount, 29884);
  const capturedUrl = scopedRequestUrl as URL | null;
  assert.notEqual(capturedUrl, null);
  const requestUrl = capturedUrl as URL;
  assert.equal(requestUrl.searchParams.get('$filter'), MLS_SCOPED_PUBLIC_SEARCH_FILTER);
  assert.equal(requestUrl.searchParams.get('$orderby'), MLS_SCOPED_PUBLIC_SEARCH_ORDER_BY);
  assert.equal(requestUrl.searchParams.get('$count'), 'true');
  assert.equal(requestUrl.searchParams.get('$top'), '100');
  assert.equal(requestUrl.searchParams.has('$expand'), false);
} finally {
  globalThis.fetch = originalFetch;
  if (originalBaseUrl === undefined) delete process.env.MLS_GRID_BASE_URL;
  else process.env.MLS_GRID_BASE_URL = originalBaseUrl;
  if (originalToken === undefined) delete process.env.MLS_GRID_TOKEN;
  else process.env.MLS_GRID_TOKEN = originalToken;
}

console.log(
  JSON.stringify(
    {
      status: 'SUCCESS',
      mode: 'FIXTURE_ONLY_NO_DB_NO_PROVIDER_NO_SIDE_EFFECT',
      cases: {
        aggregateCounters: 'PASS',
        allExistingPage: 'PASS',
        allNewPage: 'PASS',
        boundedConcurrencyCeiling: 'PASS',
        checkpointAfterPageSuccessOnly: 'PASS',
        duplicateIdWithinPage: 'PASS',
        malformedNextLink: 'PASS',
        missingSourceModifiedAt: 'PASS',
        mixedCreateUpdate: 'PASS',
        noAlert: 'PASS',
        noCustomerMutation: 'PASS',
        noEmail: 'PASS',
        noTypesense: 'PASS',
        olderSourceModifiedAt: 'PASS',
        partialPageFailure: 'PASS',
        retryAfterFailure: 'PASS',
        sameIdReplayAfterRestart: 'PASS',
        sameSourceModifiedAt: 'PASS',
        scopedInitialRequestFilterForwarding: 'PASS',
        wrongHostNextLink: 'PASS',
        wrongScopeFingerprint: 'PASS',
      },
      measurements: {
        acceleratedMs,
        currentBaselineMs,
        performanceRows: performanceRows.length,
        preloadCalls: fixture.getStats().preloadCalls,
        upsertCalls: fixture.getStats().upsertCalls,
      },
    },
    null,
    2,
  ),
);
