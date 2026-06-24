import { processListing, } from "./processListing.js";
const defaultMaxListings = 100;
const defaultMaxFailures = 25;
const maxFailureRecords = 100;
const minMaxListings = 1;
const minMaxFailures = 0;
function getSafeMaxListings(value) {
    if (value === undefined || !Number.isFinite(value))
        return defaultMaxListings;
    return Math.max(minMaxListings, Math.min(Math.floor(value), defaultMaxListings));
}
function getSafeMaxFailures(value) {
    if (value === undefined || !Number.isFinite(value))
        return defaultMaxFailures;
    return Math.max(minMaxFailures, Math.min(Math.floor(value), maxFailureRecords));
}
export function getBatchProcessPlan(inputCount, options = {}) {
    const safeInputCount = Number.isFinite(inputCount) ? Math.max(0, Math.floor(inputCount)) : 0;
    const maxListings = getSafeMaxListings(options.maxListings);
    const maxFailures = getSafeMaxFailures(options.maxFailures);
    return {
        inputCount: safeInputCount,
        maxListings,
        maxFailures,
        willProcess: Math.min(safeInputCount, maxListings),
        willSkip: Math.max(0, safeInputCount - maxListings),
        terminal: "Terminal 2",
        module: "MLS Batch Processor",
        commands: {
            startWorker: "npm run run:worker:mls-page",
            oneShotWorker: "npm run run:worker:mls-page:once",
            queueDashboard: "npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000",
            retryStatus: 'curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/mls/retry?queue=mls-page&limit=6"',
        },
        bounded: {
            maxListings: options.maxListings !== undefined && maxListings !== options.maxListings,
            maxFailures: options.maxFailures !== undefined && maxFailures !== options.maxFailures,
        },
        limits: {
            minMaxListings,
            maxMaxListings: defaultMaxListings,
            minMaxFailures,
            maxMaxFailures: maxFailureRecords,
        },
    };
}
function getListingValue(listing, fields) {
    for (const field of fields) {
        const value = listing[field];
        if (value !== undefined && value !== null && String(value).trim()) {
            return value;
        }
    }
    return "unknown";
}
function getListingLabel(listing) {
    return String(getListingValue(listing, [
        "ListingKey",
        "ListingId",
        "MLSNumber",
        "ListingNumber",
        "Id",
        "mlsid",
        "UnparsedAddress",
    ]));
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
function pushFailure(summary, failure, maxFailures) {
    if (summary.failures.length >= maxFailures) {
        summary.truncatedFailures += 1;
        return;
    }
    summary.failures.push(failure);
}
function pushWarnings(summary, result) {
    if (result.warnings.length === 0)
        return;
    summary.warnings.push({
        listingLabel: result.listingLabel,
        warnings: result.warnings,
    });
}
function applySearchIndexResult(summary, result) {
    if (!result.searchIndex.attempted)
        return;
    summary.indexAttempted += 1;
    if (result.searchIndex.indexed) {
        summary.indexSucceeded += 1;
    }
    else {
        summary.indexFailed += 1;
    }
}
function incrementCounter(counts, value) {
    counts[value] = (counts[value] || 0) + 1;
}
function createEmptyBatchMediaDiagnostics() {
    return {
        listingCount: 0,
        listingsWithMedia: 0,
        listingsWithDirectMedia: 0,
        listingsWithNestedMedia: 0,
        listingsWithTopLevelPhotos: 0,
        extractedMediaCount: 0,
        ignoredMediaItemCount: 0,
        directMediaArrayFieldCounts: {},
        nestedMediaArrayFieldCounts: {},
        topLevelPhotoFieldCounts: {},
        terminal: "Terminal 5",
        module: "MLS Batch Media",
        nextCommand: "npm run smoke:ops",
    };
}
function applyListingMediaDiagnostics(summary, diagnostics) {
    summary.listingCount += 1;
    summary.extractedMediaCount += diagnostics.extractedCount;
    summary.ignoredMediaItemCount += diagnostics.ignoredMediaItemCount;
    if (diagnostics.hasMediaPayload)
        summary.listingsWithMedia += 1;
    if (diagnostics.directMediaArrayFields.length > 0)
        summary.listingsWithDirectMedia += 1;
    if (diagnostics.hasNestedMediaPayload)
        summary.listingsWithNestedMedia += 1;
    if (diagnostics.hasTopLevelPhotoPayload)
        summary.listingsWithTopLevelPhotos += 1;
    for (const field of diagnostics.directMediaArrayFields) {
        incrementCounter(summary.directMediaArrayFieldCounts, field);
    }
    for (const field of diagnostics.nestedMediaArrayFields) {
        incrementCounter(summary.nestedMediaArrayFieldCounts, field);
    }
    for (const field of diagnostics.topLevelPhotoFields) {
        incrementCounter(summary.topLevelPhotoFieldCounts, field);
    }
}
export function summarizeBatchMediaDiagnostics(diagnostics) {
    const summary = createEmptyBatchMediaDiagnostics();
    for (const item of diagnostics) {
        applyListingMediaDiagnostics(summary, item);
    }
    return summary;
}
export async function processListingsBatch(listings, options = {}) {
    const startedAt = new Date().toISOString();
    const startedMs = Date.now();
    const plan = getBatchProcessPlan(listings.length, options);
    const maxListings = plan.maxListings;
    const maxFailures = plan.maxFailures;
    const boundedListings = listings.slice(0, maxListings);
    const summary = {
        startedAt,
        durationMs: 0,
        received: listings.length,
        processed: 0,
        skipped: Math.max(0, listings.length - boundedListings.length),
        succeeded: 0,
        failed: 0,
        failures: [],
        plan,
        indexAttempted: 0,
        indexFailed: 0,
        indexSucceeded: 0,
        mediaDiagnostics: createEmptyBatchMediaDiagnostics(),
        truncatedFailures: 0,
        warnings: [],
    };
    for (const listing of boundedListings) {
        const listingStartedMs = Date.now();
        const listingLabel = getListingLabel(listing);
        try {
            const result = await processListing(listing);
            summary.processed += 1;
            if (result) {
                summary.succeeded += 1;
                applySearchIndexResult(summary, result);
                applyListingMediaDiagnostics(summary.mediaDiagnostics, result.mediaDiagnostics);
                pushWarnings(summary, result);
            }
            else {
                summary.failed += 1;
                pushFailure(summary, {
                    durationMs: Date.now() - listingStartedMs,
                    errorMessage: "Listing processor returned no property record.",
                    listingLabel,
                }, maxFailures);
            }
        }
        catch (error) {
            summary.processed += 1;
            summary.failed += 1;
            pushFailure(summary, {
                durationMs: Date.now() - listingStartedMs,
                errorMessage: getErrorMessage(error),
                listingLabel,
            }, maxFailures);
            console.error(`MLS batch listing failed for ${listingLabel}:`, getErrorMessage(error));
        }
    }
    summary.durationMs = Date.now() - startedMs;
    console.log("MLS batch processing summary:", summary);
    return summary;
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListingsBatch.ts
