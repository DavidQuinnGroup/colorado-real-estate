import dotenv from 'dotenv';

import { fetchMLSPage, type MlsPageListingPayload } from './fetchMLSPage.js';
import { processListing } from './processListing.js';
import { MLS_PAGE_DEFAULT_TIMEOUT_MS, MLS_PAGE_MAX_TIMEOUT_MS } from '../queue/mlsPageQueue.js';
import {
  getOrCreateMlsSyncState,
  markMlsSyncFinished,
  markMlsSyncStarted,
  updateMlsSyncState,
} from './syncState.js';

dotenv.config({ path: '.env.local' });

export type SyncMLSGridOptions = {
  maxRuntimeMs?: number;
  rateDelayMs?: number;
  pageSize?: number;
  maxPages?: number;
  startPage?: number;
  includeMedia?: boolean;
  pageTimeoutMs?: number;
};

export type SyncStoppedReason = 'complete' | 'max_runtime' | 'max_pages' | 'error';

export type SyncSummary = {
  startedAt: string;
  completedAt?: string;
  startPage: number;
  nextPage: number;
  pagesFetched: number;
  listingsFetched: number;
  listingsSucceeded: number;
  listingsFailed: number;
  indexAttempted: number;
  indexSucceeded: number;
  indexFailed: number;
  stoppedReason: SyncStoppedReason;
  durationMs?: number;
  errorMessage?: string;
  options?: NormalizedSyncOptions;
  recoveredStaleLock?: boolean;
};

type MlsSyncStateSnapshot = {
  isSyncing: boolean;
  lastPage: number;
  lastSync: Date | string;
  totalRecords: number;
};

type NormalizedSyncOptions = Required<Omit<SyncMLSGridOptions, 'startPage' | 'includeMedia'>> &
  Pick<SyncMLSGridOptions, 'startPage' | 'includeMedia'>;

const defaultMaxRuntimeMs = getEnvInteger('MLS_MAX_RUNTIME_MS', 10 * 60 * 1000);
const defaultRateDelayMs = getEnvInteger('MLS_RATE_DELAY_MS', 1100);
const defaultPageSize = getEnvInteger('MLS_PAGE_SIZE', 50);
const defaultMaxPages = getEnvInteger('MLS_MAX_PAGES', 1);
const maxRuntimeMs = 60 * 60 * 1000;
const maxPageSize = 100;
const maxPages = 100;
const maxStartPage = 1_000_000;

function getEnvInteger(key: string, fallback: number) {
  const parsed = Number(process.env[key]);
  if (!Number.isFinite(parsed)) return fallback;

  return Math.floor(parsed);
}

function toBoundedInteger(value: number | undefined, fallback: number, min: number, max: number) {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(Math.floor(value), max));
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getStateDateMs(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return date.getTime();
}

function isStateStale(state: Pick<MlsSyncStateSnapshot, 'lastSync'>, maximumRuntimeMs: number) {
  const lastSyncMs = getStateDateMs(state.lastSync);
  if (!Number.isFinite(lastSyncMs)) return true;

  return Date.now() - lastSyncMs > maximumRuntimeMs;
}

function getErrorCode(error: unknown) {
  if (!error || typeof error !== 'object') return '';
  const maybeCode = (error as { code?: unknown }).code;
  return typeof maybeCode === 'string' ? maybeCode : '';
}

function getAggregateErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object' || !Array.isArray((error as { errors?: unknown[] }).errors)) return '';

  const errors = (error as { errors: unknown[] }).errors;
  const summaries = errors
    .map((item) => {
      if (!item || typeof item !== 'object') return String(item || '');

      const code = getErrorCode(item);
      const message = item instanceof Error ? item.message : '';
      return [code, message].filter(Boolean).join(': ');
    })
    .filter(Boolean);

  return Array.from(new Set(summaries)).join('; ');
}

function getErrorMessage(error: unknown) {
  const aggregateMessage = getAggregateErrorMessage(error);
  if (aggregateMessage) return aggregateMessage;

  const code = getErrorCode(error);
  if (error instanceof Error && error.message.trim()) {
    return code ? `${code}: ${error.message}` : error.message;
  }

  if (code) return code;

  return String(error || 'Unknown MLS Grid sync error.');
}

function normalizeOptions(options: SyncMLSGridOptions): NormalizedSyncOptions {
  return {
    maxRuntimeMs: toBoundedInteger(options.maxRuntimeMs, defaultMaxRuntimeMs, 1000, maxRuntimeMs),
    rateDelayMs: toBoundedInteger(options.rateDelayMs, defaultRateDelayMs, 0, 60_000),
    pageSize: toBoundedInteger(options.pageSize, defaultPageSize, 1, maxPageSize),
    maxPages: toBoundedInteger(options.maxPages, defaultMaxPages, 1, maxPages),
    pageTimeoutMs: toBoundedInteger(options.pageTimeoutMs, MLS_PAGE_DEFAULT_TIMEOUT_MS, 1000, MLS_PAGE_MAX_TIMEOUT_MS),
    startPage: options.startPage,
    includeMedia: options.includeMedia,
  };
}

async function processListings(listings: MlsPageListingPayload[]) {
  let succeeded = 0;
  let failed = 0;
  let indexAttempted = 0;
  let indexSucceeded = 0;
  let indexFailed = 0;

  for (const listing of listings) {
    const result = await processListing(listing);

    if (result) {
      succeeded += 1;

      if (result.searchIndex.attempted) {
        indexAttempted += 1;

        if (result.searchIndex.indexed) {
          indexSucceeded += 1;
        } else {
          indexFailed += 1;
        }
      }
    } else {
      failed += 1;
    }
  }

  return { succeeded, failed, indexAttempted, indexSucceeded, indexFailed };
}

function getInitialPage(options: NormalizedSyncOptions, state: MlsSyncStateSnapshot) {
  return toBoundedInteger(options.startPage, state.lastPage || 0, 0, maxStartPage);
}

function shouldStopForRuntime(startTime: number, maximumRuntimeMs: number) {
  return Date.now() - startTime > maximumRuntimeMs;
}

async function saveProgress(page: number, totalRecords: number, syncedAt?: Date) {
  return updateMlsSyncState({
    lastIntelligenceSync: syncedAt,
    lastPage: page,
    lastSync: new Date(),
    totalRecords,
  });
}

function createSummary(startedAt: string, page: number, options: NormalizedSyncOptions): SyncSummary {
  return {
    startedAt,
    startPage: page,
    nextPage: page,
    pagesFetched: 0,
    listingsFetched: 0,
    listingsSucceeded: 0,
    listingsFailed: 0,
    indexAttempted: 0,
    indexSucceeded: 0,
    indexFailed: 0,
    stoppedReason: 'complete',
    options,
  };
}

export async function syncMLSGrid(options: SyncMLSGridOptions = {}): Promise<SyncSummary | null> {
  const syncOptions = normalizeOptions(options);
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  console.log('Initializing bounded MLS Grid sync:', syncOptions);

  const state = await getOrCreateMlsSyncState();

  const recoveredStaleLock = state.isSyncing && isStateStale(state, syncOptions.maxRuntimeMs);

  if (state.isSyncing && !recoveredStaleLock) {
    console.log('MLS Grid sync is already in progress. Skipping this run.');
    return null;
  }

  if (recoveredStaleLock) {
    console.warn('Recovering stale MLS Grid sync lock and starting a new bounded sync.');
  }

  let page = getInitialPage(syncOptions, state);
  let totalRecords = state.totalRecords || 0;
  let caughtError: unknown = null;

  const summary = createSummary(startedAt, page, syncOptions);
  summary.recoveredStaleLock = recoveredStaleLock;

  await markMlsSyncStarted({
    lastSync: startedAt,
  });

  try {
    for (let pageCount = 0; pageCount < syncOptions.maxPages; pageCount += 1) {
      if (shouldStopForRuntime(startTime, syncOptions.maxRuntimeMs)) {
        summary.stoppedReason = 'max_runtime';
        console.log(`MLS sync runtime limit reached at page ${page}. Progress was saved.`);
        break;
      }

      console.log(`Fetching MLS Grid page ${page}.`);
      const listings = await fetchMLSPage({
        page,
        top: syncOptions.pageSize,
        includeMedia: syncOptions.includeMedia,
        timeoutMs: syncOptions.pageTimeoutMs,
      });

      summary.pagesFetched += 1;
      summary.listingsFetched += listings.length;

      if (listings.length === 0) {
        page = 0;
        summary.nextPage = page;
        summary.stoppedReason = 'complete';

        await saveProgress(page, totalRecords, new Date());

        console.log('MLS Grid sync reached the end of the feed. Page counter reset.');
        break;
      }

      const result = await processListings(listings);
      summary.listingsSucceeded += result.succeeded;
      summary.listingsFailed += result.failed;
      summary.indexAttempted += result.indexAttempted;
      summary.indexSucceeded += result.indexSucceeded;
      summary.indexFailed += result.indexFailed;
      totalRecords += result.succeeded;

      page += 1;
      summary.nextPage = page;

      await saveProgress(page, totalRecords, result.succeeded > 0 ? new Date() : undefined);

      if (pageCount + 1 >= syncOptions.maxPages) {
        summary.stoppedReason = 'max_pages';
        console.log(`MLS sync page limit reached after ${summary.pagesFetched} page(s). Progress was saved.`);
        break;
      }

      if (syncOptions.rateDelayMs > 0) {
        await sleep(syncOptions.rateDelayMs);
      }
    }
  } catch (error) {
    caughtError = error;
    summary.stoppedReason = 'error';
    summary.errorMessage = getErrorMessage(error);
    console.error('MLS Grid sync failed:', summary.errorMessage);
  } finally {
    summary.completedAt = new Date().toISOString();
    summary.durationMs = Date.now() - startTime;

    await markMlsSyncFinished({
      lastPage: summary.nextPage,
      lastSync: summary.completedAt,
      totalRecords,
    });

    console.log('MLS Grid sync summary:', summary);
  }

  if (caughtError) {
    throw caughtError;
  }

  return summary;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/syncMLSGrid.ts
