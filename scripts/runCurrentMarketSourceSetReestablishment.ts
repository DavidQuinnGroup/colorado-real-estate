import dotenv from 'dotenv';

import { CURRENT_MARKET_SUPPORTED_CITIES, computeCurrentMarketAggregates } from '../lib/currentMarketComputation';
import type { CurrentMarketSourceSetCompletion } from '../lib/currentMarketSourceSetCurrentness';
import {
  buildInternalSynchronizedPropertyMarketComputationInput,
  readInternalSynchronizedPropertyMarketRecords,
  REIE_SYNCHRONIZED_PROPERTY_MARKET_SOURCE_SET,
} from '../lib/internalSynchronizedPropertyMarketReadAdapter';
import { fetchMLSPageResponse, fetchMLSPageResponseFromNextLink } from '../lib/mls/fetchMLSPage';
import { ingestMlsScopedPageAccelerated, preloadExistingProperties, upsertScopedListingWithExisting } from '../lib/mls/scopedIngestAcceleration';
import { configureMlsGridRequestGovernor, getRateLimitState, resetRateLimitState } from '../lib/mls/rateLimiter';
import { prisma } from '../lib/prisma';

dotenv.config({ path: '.env.local' });

const PAGE_SIZE = 100;
const MAX_PAGES = 100;
const MAX_PROVIDER_REQUESTS = 100;
const MIN_PROVIDER_DELAY_MS = 1000;
const CONCURRENCY = 6;
const TIMEOUT_MS = 45_000;

const execute = process.argv.slice(2).includes('--execute');
const MLS_GRID_MUNICIPALITY_SCOPE_STATUS: string = 'BLOCKED_PENDING_MLS_GRID_MUNICIPALITY_FILTER_TECHNICAL_CLARIFICATION';

type Snapshot = {
  sixCityProperties: number;
  alertEvents: number;
  alertQueue: number;
  emailLog: number;
  isSyncing: boolean | null;
};

function iso(value: Date | null) {
  return value?.toISOString() ?? null;
}

function sourceModifiedAt(listing: Record<string, unknown>) {
  for (const field of ['ModificationTimestamp', 'ListingModificationTimestamp']) {
    const value = listing[field];
    if (typeof value !== 'string') continue;
    const parsed = new Date(value);
    if (Number.isFinite(parsed.getTime())) return parsed;
  }
  return null;
}

async function snapshot(): Promise<Snapshot> {
  const [sixCityProperties, alertEvents, alertQueue, emailLog, syncState] = await Promise.all([
    prisma.property.count({ where: { OR: CURRENT_MARKET_SUPPORTED_CITIES.map((city) => ({ city: { equals: city, mode: 'insensitive' } })) } }),
    prisma.alertEvent.count(),
    prisma.alertQueue.count(),
    prisma.emailLog.count(),
    prisma.mlsSyncState.findUnique({ where: { id: 1 }, select: { isSyncing: true } }),
  ]);
  return { sixCityProperties, alertEvents, alertQueue, emailLog, isSyncing: syncState?.isSyncing ?? null };
}

function preflight() {
  const baseUrlConfigured = Boolean((process.env.MLS_GRID_BASE_URL || process.env.MLS_API_URL || '').trim());
  const credentialConfigured = Boolean((process.env.MLS_GRID_TOKEN || process.env.MLS_API_KEY || '').trim());
  if (!baseUrlConfigured || !credentialConfigured) throw new Error('Existing MLS integration configuration is incomplete.');
  return { baseUrlConfigured, credentialConfigured };
}

async function run() {
  if (
    execute &&
    MLS_GRID_MUNICIPALITY_SCOPE_STATUS ===
      'BLOCKED_PENDING_MLS_GRID_MUNICIPALITY_FILTER_TECHNICAL_CLARIFICATION'
  ) {
    throw new Error(
      `Live source-set reestablishment is ${MLS_GRID_MUNICIPALITY_SCOPE_STATUS}. ` +
        'A certified provider six-city filter contract is required before any provider or database activity.',
    );
  }

  const preflightResult = preflight();
  const before = await snapshot();
  if (before.isSyncing) throw new Error('A concurrent MLS synchronization is already running.');

  if (!execute) {
    return {
      status: 'DRY_RUN_NO_PROVIDER_NO_DATABASE_MUTATION',
      preflight: preflightResult,
      bounds: { pageSize: PAGE_SIZE, maxPages: MAX_PAGES, maxProviderRequests: MAX_PROVIDER_REQUESTS, minProviderDelayMs: MIN_PROVIDER_DELAY_MS, concurrency: CONCURRENCY, timeoutMs: TIMEOUT_MS },
      scope: { cities: CURRENT_MARKET_SUPPORTED_CITIES, certification: MLS_GRID_MUNICIPALITY_SCOPE_STATUS, includeMedia: false, traversal: 'PROVIDER_NEXTLINK_UNTIL_TERMINAL' },
    };
  }

  resetRateLimitState();
  configureMlsGridRequestGovernor({ maxRequestsPerRun: MAX_PROVIDER_REQUESTS, minDelayMs: MIN_PROVIDER_DELAY_MS });
  const startedAt = new Date();
  const syncRunId = `REIE_CURRENT_MARKET_SOURCE_SET_${startedAt.toISOString().replace(/[-:.TZ]/g, '')}`;
  let response = await fetchMLSPageResponse({ filter: 'CERTIFIED_SIX_CITY_PROVIDER_SCOPE_REQUIRED', page: 0, top: PAGE_SIZE, includeMedia: false, orderBy: 'ModificationTimestamp desc', requestCount: true, timeoutMs: TIMEOUT_MS });
  const sourceReportedRecordCount = response.metadata.sourceCount;
  let recordsFetched = 0;
  let recordsProcessed = 0;
  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  let pagesProcessed = 0;
  let sourceCutoff: Date | null = null;
  let terminalSignal: CurrentMarketSourceSetCompletion['terminalSignal'] = 'NOT_TERMINAL';

  while (true) {
    if (pagesProcessed >= MAX_PAGES) throw new Error('Source-set page guard reached before terminal traversal.');
    const page = await ingestMlsScopedPageAccelerated(response.value, {
      preloadExisting: preloadExistingProperties,
      upsert: upsertScopedListingWithExisting,
    }, { concurrency: CONCURRENCY });
    recordsFetched += page.fetched;
    recordsProcessed += page.processed;
    created += page.created;
    updated += page.updated;
    skipped += page.skipped;
    failed += page.failed;
    pagesProcessed += 1;
    for (const listing of response.value) {
      const changedAt = sourceModifiedAt(listing);
      if (changedAt && (!sourceCutoff || changedAt > sourceCutoff)) sourceCutoff = changedAt;
    }
    if (page.failed > 0) throw new Error(`Source-set ingest failed for ${page.failed} record(s).`);
    if (response.metadata.terminationSignal === 'next_link_absent') {
      terminalSignal = 'NEXT_LINK_ABSENT';
      break;
    }
    if (response.metadata.terminationSignal === 'empty_page') {
      terminalSignal = 'EMPTY_PAGE';
      break;
    }
    if (!response.metadata.nextLink) throw new Error('Source-set traversal did not provide a terminal nextLink state.');
    response = await fetchMLSPageResponseFromNextLink(response.metadata.nextLink, { timeoutMs: TIMEOUT_MS });
  }

  const completedAt = new Date();
  const sourceSet: CurrentMarketSourceSetCompletion = Object.freeze({
    sourceSetId: REIE_SYNCHRONIZED_PROPERTY_MARKET_SOURCE_SET,
    syncRunId,
    startedAt,
    completedAt,
    completionState: 'COMPLETE',
    sourceCutoffAt: sourceCutoff,
    sourceReportedRecordCount,
    recordsFetched,
    recordsProcessed,
    pagesProcessed,
    terminalSignal,
    errorCount: failed,
  });
  const read = await readInternalSynchronizedPropertyMarketRecords();
  const computedAt = new Date();
  const reports = CURRENT_MARKET_SUPPORTED_CITIES.map((city) => {
    const cityRecords = read.records.filter((record) => record.city?.trim().toLowerCase() === city.toLowerCase());
    const result = computeCurrentMarketAggregates(buildInternalSynchronizedPropertyMarketComputationInput(Object.freeze({ sourceSetId: read.sourceSetId, records: cityRecords }), sourceSet, computedAt));
    return {
      city,
      recordsConsidered: cityRecords.length,
      admittedRecords: result.normalizedListings.length,
      exclusionCategories: result.exclusionCounts,
      aggregates: result.aggregates.filter((aggregate) => aggregate.scope.type === 'CITY' && aggregate.scope.id === city),
    };
  });
  const after = await snapshot();
  if (after.alertEvents !== before.alertEvents || after.alertQueue !== before.alertQueue || after.emailLog !== before.emailLog) {
    throw new Error('Unexpected customer, alert, or email side effect detected.');
  }
  return {
    status: 'REIE_MLS_SOURCE_SET_REESTABLISHED_CURRENT',
    sourceSet: {
      syncRunId,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      sourceCutoffAt: iso(sourceCutoff),
      sourceReportedRecordCount,
      recordsFetched,
      recordsProcessed,
      pagesProcessed,
      terminalSignal,
      created,
      updated,
      skipped,
      failed,
    },
    requestGovernor: getRateLimitState(),
    reports,
    sideEffects: {
      alertEventDelta: after.alertEvents - before.alertEvents,
      alertQueueDelta: after.alertQueue - before.alertQueue,
      emailLogDelta: after.emailLog - before.emailLog,
    },
    providerActivity: true,
    databaseMutation: true,
    rawListingOutput: false,
  };
}

try {
  console.log(JSON.stringify(await run(), null, 2));
} catch (error) {
  console.error(JSON.stringify({ status: 'STOPPED', error: error instanceof Error ? error.message : String(error) }, null, 2));
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
