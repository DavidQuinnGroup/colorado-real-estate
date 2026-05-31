import { type MlsListingPayload, type ProcessListingResult, processListing } from "./processListing.js";

export type BatchProcessOptions = {
  maxListings?: number;
  maxFailures?: number;
};

export type BatchListingFailure = {
  durationMs: number;
  errorMessage: string;
  listingLabel: string;
};

export type BatchListingWarning = {
  listingLabel: string;
  warnings: string[];
};

export type BatchProcessSummary = {
  durationMs: number;
  failed: number;
  failures: BatchListingFailure[];
  indexAttempted: number;
  indexFailed: number;
  indexSucceeded: number;
  processed: number;
  received: number;
  skipped: number;
  startedAt: string;
  succeeded: number;
  warnings: BatchListingWarning[];
};

const defaultMaxListings = 100;
const defaultMaxFailures = 25;
const maxFailureRecords = 100;

function getSafeMaxListings(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) return defaultMaxListings;
  return Math.max(1, Math.min(Math.floor(value), defaultMaxListings));
}

function getSafeMaxFailures(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) return defaultMaxFailures;
  return Math.max(0, Math.min(Math.floor(value), maxFailureRecords));
}

function getListingValue(listing: MlsListingPayload, fields: readonly string[]) {
  for (const field of fields) {
    const value = listing[field];

    if (value !== undefined && value !== null && String(value).trim()) {
      return value;
    }
  }

  return "unknown";
}

function getListingLabel(listing: MlsListingPayload) {
  return String(
    getListingValue(listing, [
      "ListingKey",
      "ListingId",
      "MLSNumber",
      "ListingNumber",
      "Id",
      "mlsid",
      "UnparsedAddress",
    ])
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function pushFailure(summary: BatchProcessSummary, failure: BatchListingFailure, maxFailures: number) {
  if (summary.failures.length >= maxFailures) return;
  summary.failures.push(failure);
}

function pushWarnings(summary: BatchProcessSummary, result: ProcessListingResult) {
  if (result.warnings.length === 0) return;

  summary.warnings.push({
    listingLabel: result.listingLabel,
    warnings: result.warnings,
  });
}

function applySearchIndexResult(summary: BatchProcessSummary, result: ProcessListingResult) {
  if (!result.searchIndex.attempted) return;

  summary.indexAttempted += 1;

  if (result.searchIndex.indexed) {
    summary.indexSucceeded += 1;
  } else {
    summary.indexFailed += 1;
  }
}

export async function processListingsBatch(
  listings: MlsListingPayload[],
  options: BatchProcessOptions = {}
): Promise<BatchProcessSummary> {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  const maxListings = getSafeMaxListings(options.maxListings);
  const maxFailures = getSafeMaxFailures(options.maxFailures);
  const boundedListings = listings.slice(0, maxListings);

  const summary: BatchProcessSummary = {
    startedAt,
    durationMs: 0,
    received: listings.length,
    processed: 0,
    skipped: Math.max(0, listings.length - boundedListings.length),
    succeeded: 0,
    failed: 0,
    failures: [],
    indexAttempted: 0,
    indexFailed: 0,
    indexSucceeded: 0,
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
        pushWarnings(summary, result);
      } else {
        summary.failed += 1;
        pushFailure(
          summary,
          {
            durationMs: Date.now() - listingStartedMs,
            errorMessage: "Listing processor returned no property record.",
            listingLabel,
          },
          maxFailures
        );
      }
    } catch (error) {
      summary.processed += 1;
      summary.failed += 1;
      pushFailure(
        summary,
        {
          durationMs: Date.now() - listingStartedMs,
          errorMessage: getErrorMessage(error),
          listingLabel,
        },
        maxFailures
      );
      console.error(`MLS batch listing failed for ${listingLabel}:`, getErrorMessage(error));
    }
  }

  summary.durationMs = Date.now() - startedMs;
  console.log("MLS batch processing summary:", summary);

  return summary;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListingsBatch.ts
