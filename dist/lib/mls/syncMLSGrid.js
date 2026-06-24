import dotenv from 'dotenv';
import { fetchMLSPage } from './fetchMLSPage.js';
import { processListing } from './processListing.js';
import { MLS_PAGE_DEFAULT_TIMEOUT_MS, MLS_PAGE_MAX_TIMEOUT_MS } from '../queue/mlsPageQueue.js';
import { getOrCreateMlsSyncState, markMlsSyncFinished, markMlsSyncStarted, updateMlsSyncState, } from './syncState.js';
dotenv.config({ path: '.env.local' });
const defaultMaxRuntimeMs = getEnvInteger('MLS_MAX_RUNTIME_MS', 10 * 60 * 1000);
const defaultRateDelayMs = getEnvInteger('MLS_RATE_DELAY_MS', 1100);
const defaultPageSize = getEnvInteger('MLS_PAGE_SIZE', 50);
const defaultMaxPages = getEnvInteger('MLS_MAX_PAGES', 1);
const maxRuntimeMs = 60 * 60 * 1000;
const maxRateDelayMs = 60000;
const maxPageSize = 100;
const maxPages = 100;
const maxStartPage = 1000000;
const minMaxRuntimeMs = 1000;
const minRateDelayMs = 0;
const minPageSize = 1;
const minMaxPages = 1;
const minPageTimeoutMs = 1000;
const minStartPage = 0;
function getEnvInteger(key, fallback) {
    const parsed = Number(process.env[key]);
    if (!Number.isFinite(parsed))
        return fallback;
    return Math.floor(parsed);
}
function toBoundedInteger(value, fallback, min, max) {
    if (value === undefined || !Number.isFinite(value))
        return fallback;
    return Math.max(min, Math.min(Math.floor(value), max));
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function getStateDateMs(value) {
    const date = value instanceof Date ? value : new Date(value);
    return date.getTime();
}
function isStateStale(state, maximumRuntimeMs) {
    const lastSyncMs = getStateDateMs(state.lastSync);
    if (!Number.isFinite(lastSyncMs))
        return true;
    return Date.now() - lastSyncMs > maximumRuntimeMs;
}
function getErrorCode(error) {
    if (!error || typeof error !== 'object')
        return '';
    const maybeCode = error.code;
    return typeof maybeCode === 'string' ? maybeCode : '';
}
function getAggregateErrorMessage(error) {
    if (!error || typeof error !== 'object' || !Array.isArray(error.errors))
        return '';
    const errors = error.errors;
    const summaries = errors
        .map((item) => {
        if (!item || typeof item !== 'object')
            return String(item || '');
        const code = getErrorCode(item);
        const message = item instanceof Error ? item.message : '';
        return [code, message].filter(Boolean).join(': ');
    })
        .filter(Boolean);
    return Array.from(new Set(summaries)).join('; ');
}
function getErrorMessage(error) {
    const aggregateMessage = getAggregateErrorMessage(error);
    if (aggregateMessage)
        return aggregateMessage;
    const code = getErrorCode(error);
    if (error instanceof Error && error.message.trim()) {
        return code ? `${code}: ${error.message}` : error.message;
    }
    if (code)
        return code;
    return String(error || 'Unknown MLS Grid sync error.');
}
function normalizeOptions(options) {
    return {
        maxRuntimeMs: toBoundedInteger(options.maxRuntimeMs, defaultMaxRuntimeMs, minMaxRuntimeMs, maxRuntimeMs),
        rateDelayMs: toBoundedInteger(options.rateDelayMs, defaultRateDelayMs, minRateDelayMs, maxRateDelayMs),
        pageSize: toBoundedInteger(options.pageSize, defaultPageSize, minPageSize, maxPageSize),
        maxPages: toBoundedInteger(options.maxPages, defaultMaxPages, minMaxPages, maxPages),
        pageTimeoutMs: toBoundedInteger(options.pageTimeoutMs, MLS_PAGE_DEFAULT_TIMEOUT_MS, minPageTimeoutMs, MLS_PAGE_MAX_TIMEOUT_MS),
        startPage: options.startPage,
        includeMedia: options.includeMedia,
    };
}
export function getSyncMLSGridPlan(options = {}, stateLastPage = 0) {
    const normalized = normalizeOptions(options);
    const initialPage = toBoundedInteger(normalized.startPage, stateLastPage, minStartPage, maxStartPage);
    return {
        ...normalized,
        startPage: initialPage,
        includeMedia: normalized.includeMedia ?? false,
        initialPage,
        terminal: 'Terminal 5',
        module: 'MLS Grid Sync',
        dryRunCommand: 'npm run run:mls-sync:dry',
        liveCommand: 'npm run run:mls-sync:live',
        statusCommand: 'curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/mls/status"',
        bounded: {
            maxRuntimeMs: normalized.maxRuntimeMs !== options.maxRuntimeMs && options.maxRuntimeMs !== undefined,
            rateDelayMs: normalized.rateDelayMs !== options.rateDelayMs && options.rateDelayMs !== undefined,
            pageSize: normalized.pageSize !== options.pageSize && options.pageSize !== undefined,
            maxPages: normalized.maxPages !== options.maxPages && options.maxPages !== undefined,
            pageTimeoutMs: normalized.pageTimeoutMs !== options.pageTimeoutMs && options.pageTimeoutMs !== undefined,
            startPage: initialPage !== options.startPage && options.startPage !== undefined,
        },
        limits: {
            minMaxRuntimeMs,
            maxMaxRuntimeMs: maxRuntimeMs,
            minRateDelayMs,
            maxRateDelayMs,
            minPageSize,
            maxPageSize,
            minMaxPages,
            maxMaxPages: maxPages,
            minPageTimeoutMs,
            maxPageTimeoutMs: MLS_PAGE_MAX_TIMEOUT_MS,
            minStartPage,
            maxStartPage,
        },
    };
}
async function processListings(listings) {
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
                }
                else {
                    indexFailed += 1;
                }
            }
        }
        else {
            failed += 1;
        }
    }
    return { succeeded, failed, indexAttempted, indexSucceeded, indexFailed };
}
function getInitialPage(options, state) {
    return toBoundedInteger(options.startPage, state.lastPage || 0, 0, maxStartPage);
}
function shouldStopForRuntime(startTime, maximumRuntimeMs) {
    return Date.now() - startTime > maximumRuntimeMs;
}
async function saveProgress(page, totalRecords, syncedAt) {
    return updateMlsSyncState({
        lastIntelligenceSync: syncedAt,
        lastPage: page,
        lastSync: new Date(),
        totalRecords,
    });
}
function createSummary(startedAt, page, options) {
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
        plan: getSyncMLSGridPlan(options, page),
    };
}
export async function syncMLSGrid(options = {}) {
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
    let caughtError = null;
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
    }
    catch (error) {
        caughtError = error;
        summary.stoppedReason = 'error';
        summary.errorMessage = getErrorMessage(error);
        console.error('MLS Grid sync failed:', summary.errorMessage);
    }
    finally {
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
