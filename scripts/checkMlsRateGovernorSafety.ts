import assert from 'node:assert/strict';

import {
  createMlsScopedIngestCheckpoint,
  fetchInitialMlsScopedPublicSearchPage,
  fetchNextMlsScopedPublicSearchPage,
  getMlsScopedPublicSearchFingerprint,
  ingestMlsScopedPageAccelerated,
  MLS_SCOPED_PUBLIC_SEARCH_FILTER,
  MLS_SCOPED_PUBLIC_SEARCH_ORDER_BY,
  validateMlsScopedIngestCheckpoint,
  type MlsScopedIngestPageDependencies,
} from '../lib/mls/scopedIngestAcceleration.js';
import {
  configureMlsGridRequestGovernor,
  executeMlsGridRequest,
  getRateLimitState,
  resetMlsGridRequestGovernorConfig,
  resetRateLimitState,
} from '../lib/mls/rateLimiter.js';

const providerBaseUrl = 'https://api.example-mls.test/odata';
const originalFetch = globalThis.fetch;
const originalBaseUrl = process.env.MLS_GRID_BASE_URL;
const originalToken = process.env.MLS_GRID_TOKEN;
const originalRetryBase = process.env.MLS_GRID_RETRY_BASE_DELAY_MS;
const originalRetryMax = process.env.MLS_GRID_RETRY_MAX_DELAY_MS;
const originalMaxRetries = process.env.MLS_GRID_MAX_RETRIES;

let clock = 10_000;
let realProviderCalls = 0;
let mockProviderCalls = 0;
const capturedUrls: URL[] = [];

function resetFixture(config: Parameters<typeof configureMlsGridRequestGovernor>[0] = {}) {
  clock = 10_000;
  realProviderCalls = 0;
  mockProviderCalls = 0;
  capturedUrls.length = 0;
  resetRateLimitState();
  resetMlsGridRequestGovernorConfig();
  configureMlsGridRequestGovernor({
    maxRequestsPer24h: 30_000,
    maxRequestsPerHour: 3600,
    maxRequestsPerMinute: 60,
    maxRequestsPerRun: 100,
    minDelayMs: 1000,
    now: () => clock,
    sleep: async (ms) => {
      clock += ms;
    },
    ...config,
  });
}

function installMockFetch(responses: Response[]) {
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = new URL(String(input));
    if (url.host !== 'api.example-mls.test') {
      realProviderCalls += 1;
      throw new Error(`Unexpected real provider fixture URL: ${url.host}`);
    }

    mockProviderCalls += 1;
    capturedUrls.push(url);
    const response = responses.shift();
    if (!response) throw new Error('No mocked MLS Grid response configured.');
    return response;
  }) as typeof fetch;
}

function jsonResponse(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    status,
  });
}

function restoreEnv() {
  globalThis.fetch = originalFetch;
  if (originalBaseUrl === undefined) delete process.env.MLS_GRID_BASE_URL;
  else process.env.MLS_GRID_BASE_URL = originalBaseUrl;
  if (originalToken === undefined) delete process.env.MLS_GRID_TOKEN;
  else process.env.MLS_GRID_TOKEN = originalToken;
  if (originalRetryBase === undefined) delete process.env.MLS_GRID_RETRY_BASE_DELAY_MS;
  else process.env.MLS_GRID_RETRY_BASE_DELAY_MS = originalRetryBase;
  if (originalRetryMax === undefined) delete process.env.MLS_GRID_RETRY_MAX_DELAY_MS;
  else process.env.MLS_GRID_RETRY_MAX_DELAY_MS = originalRetryMax;
  if (originalMaxRetries === undefined) delete process.env.MLS_GRID_MAX_RETRIES;
  else process.env.MLS_GRID_MAX_RETRIES = originalMaxRetries;
}

process.env.MLS_GRID_BASE_URL = providerBaseUrl;
process.env.MLS_GRID_TOKEN = 'fixture-token';
process.env.MLS_GRID_RETRY_BASE_DELAY_MS = '1000';
process.env.MLS_GRID_RETRY_MAX_DELAY_MS = '5000';
process.env.MLS_GRID_MAX_RETRIES = '2';

resetFixture();
await executeMlsGridRequest(async () => 'one');
await executeMlsGridRequest(async () => 'two');
await executeMlsGridRequest(async () => 'three');
assert.deepEqual(getRateLimitState().requestTimes, [10_000, 11_000, 12_000]);
assert.equal(getRateLimitState().policy.minDelayMs, 1000);
assert.equal(getRateLimitState().policy.burstCapacity, 1);

resetFixture();
await Promise.all([
  executeMlsGridRequest(async () => 'a'),
  executeMlsGridRequest(async () => 'b'),
  executeMlsGridRequest(async () => 'c'),
]);
assert.deepEqual(getRateLimitState().requestTimes, [10_000, 11_000, 12_000]);

resetFixture({ maxRequestsPerRun: 2 });
await executeMlsGridRequest(async () => 'a');
await executeMlsGridRequest(async () => 'b');
await assert.rejects(() => executeMlsGridRequest(async () => 'c'), /maxRequestsPerRun=2/);
assert.equal(getRateLimitState().attempted, 2);

resetFixture();
installMockFetch([
  jsonResponse(200, {
    '@odata.count': 29884,
    '@odata.nextLink': `${providerBaseUrl}/Property?$skiptoken=next`,
    value: [],
  }),
]);
await fetchInitialMlsScopedPublicSearchPage({ timeoutMs: 1000, top: 100 });
assert.equal(capturedUrls[0]?.searchParams.get('$filter'), MLS_SCOPED_PUBLIC_SEARCH_FILTER);
assert.equal(capturedUrls[0]?.searchParams.get('$orderby'), MLS_SCOPED_PUBLIC_SEARCH_ORDER_BY);
assert.equal(capturedUrls[0]?.searchParams.get('$count'), 'true');
assert.equal(capturedUrls[0]?.searchParams.has('$expand'), false);

resetFixture();
installMockFetch([
  jsonResponse(200, {
    '@odata.count': 29884,
    '@odata.nextLink': `${providerBaseUrl}/Property?$skiptoken=next2`,
    value: [],
  }),
]);
await fetchNextMlsScopedPublicSearchPage(`${providerBaseUrl}/Property?$skiptoken=next`, { timeoutMs: 1000 });
assert.equal(capturedUrls[0]?.searchParams.get('$skiptoken'), 'next');

resetFixture();
installMockFetch([
  jsonResponse(429, { error: 'too many requests' }, { 'retry-after': '2' }),
  jsonResponse(200, { '@odata.count': 29884, value: [] }),
]);
await fetchInitialMlsScopedPublicSearchPage({ timeoutMs: 1000, top: 100 });
assert.deepEqual(getRateLimitState().requestTimes, [10_000, 12_000]);
assert.equal(getRateLimitState().failed, 1);
assert.equal(getRateLimitState().succeeded, 1);

resetFixture();
installMockFetch([
  jsonResponse(503, { error: 'unavailable 1' }),
  jsonResponse(503, { error: 'unavailable 2' }),
  jsonResponse(503, { error: 'unavailable 3' }),
]);
await assert.rejects(() => fetchInitialMlsScopedPublicSearchPage({ timeoutMs: 1000, top: 100 }), /MLS Grid API error: 503/);
assert.equal(getRateLimitState().attempted, 3);
assert.equal(getRateLimitState().failed, 3);

const checkpoint = createMlsScopedIngestCheckpoint({
  fetchedCount: 100,
  nextLink: `${providerBaseUrl}/Property?$skiptoken=next`,
  pageNumber: 1,
  processedCount: 100,
  scopeFingerprint: getMlsScopedPublicSearchFingerprint(),
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
    checkpoint: { ...checkpoint, nextLink: 'https://evil.example.test/odata/Property?$skiptoken=next' },
    providerBaseUrl,
  }).ok,
  false,
);

resetFixture();
const rowDependencies: MlsScopedIngestPageDependencies = {
  preloadExisting: async () => new Map(),
  upsert: async (listing) => ({
    id: String(listing.ListingKey),
    lat: null,
    lng: null,
    mlsId: String(listing.ListingKey),
    slug: String(listing.ListingKey),
    sourceModifiedAt: null,
  } as unknown as Awaited<ReturnType<MlsScopedIngestPageDependencies['upsert']>>),
};
const rowResult = await ingestMlsScopedPageAccelerated(
  Array.from({ length: 12 }, (_, index) => ({ ListingKey: `row-${index}` })),
  rowDependencies,
  { concurrency: 8 },
);
assert.equal(rowResult.peakConcurrency > 1, true);
assert.equal(getRateLimitState().attempted, 0);

assert.equal(realProviderCalls, 0);

restoreEnv();
resetRateLimitState();
resetMlsGridRequestGovernorConfig();

console.log(
  JSON.stringify(
    {
      status: 'SUCCESS',
      mode: 'FIXTURE_ONLY_NO_REAL_MLS_GRID_PROVIDER_CALL',
      cases: {
        activeComingSoonFilterForwarded: 'PASS',
        boundedRetries: 'PASS',
        checkpointResume: 'PASS',
        concurrentCallersSerialize: 'PASS',
        dbWorkerConcurrencyDoesNotIncreaseProviderRps: 'PASS',
        exhaustedBudgetFailsClosed: 'PASS',
        initialFilteredRequest: 'PASS',
        malformedNextLinkRejected: 'PASS',
        nextLinkRequestGoverned: 'PASS',
        noBurstAboveOne: 'PASS',
        rateOneRequestPerSecond: 'PASS',
        requestAccounting: 'PASS',
        requestBudget: 'PASS',
        retryAfter429: 'PASS',
        retryRespectsGovernor: 'PASS',
        scopeFingerprintMismatch: 'PASS',
        wrongHostNextLinkRejected: 'PASS',
        zeroRealProviderCallsDuringFixtures: 'PASS',
      },
      accounting: {
        mockProviderCalls,
        realProviderCalls,
      },
      policy: {
        burstCapacity: 1,
        maxSustainedRps: 1,
        minInterRequestIntervalMs: 1000,
      },
    },
    null,
    2,
  ),
);
