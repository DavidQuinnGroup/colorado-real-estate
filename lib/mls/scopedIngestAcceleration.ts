import { createHash } from 'node:crypto';

import { prisma } from '../prisma.js';
import { fetchMLSPageResponse, fetchMLSPageResponseFromNextLink, type MlsPageListingPayload } from './fetchMLSPage.js';
import { validateProviderNextLink, type MlsPageResponse } from './paginationContract.js';
import { type ExistingPropertySnapshot, type PropertyRecord, upsertListingWithExistingProperty } from './upsertListing.js';

export const MLS_SCOPED_PUBLIC_SEARCH_FILTER =
  "MlgCanView eq true and (StandardStatus eq 'Active' or StandardStatus eq 'Coming Soon')";
export const MLS_SCOPED_PUBLIC_SEARCH_ORDER_BY = 'ModificationTimestamp desc';
export const MLS_SCOPED_PUBLIC_SEARCH_ENDPOINT = '/Property';
export const MLS_SCOPED_PUBLIC_SEARCH_TOP = 100;
export const MLS_SCOPED_ACCELERATION_MAX_CONCURRENCY = 8;
export const MLS_SCOPED_ACCELERATION_DEFAULT_CONCURRENCY = 6;

export type MlsScopedIngestScopeContract = {
  endpoint: typeof MLS_SCOPED_PUBLIC_SEARCH_ENDPOINT;
  filter: typeof MLS_SCOPED_PUBLIC_SEARCH_FILTER;
  orderBy: typeof MLS_SCOPED_PUBLIC_SEARCH_ORDER_BY;
  top: number;
  requestCount: true;
  includeMedia: false;
  traversal: 'PROVIDER_NEXTLINK_TRAVERSAL';
};

export type MlsScopedIngestCheckpoint = {
  version: 1;
  scopeFingerprint: string;
  pageNumber: number;
  processedCount: number;
  fetchedCount: number;
  nextLink: string | null;
  updatedAt: string;
};

export type MlsScopedIngestCheckpointValidation =
  | {
      ok: true;
      checkpoint: MlsScopedIngestCheckpoint;
    }
  | {
      ok: false;
      reason:
        | 'missing_checkpoint'
        | 'wrong_version'
        | 'wrong_scope_fingerprint'
        | 'invalid_page_number'
        | 'invalid_processed_count'
        | 'invalid_fetched_count'
        | 'invalid_next_link';
    };

export type MlsScopedPageIngestCounters = {
  fetched: number;
  processed: number;
  created: number;
  updated: number;
  unchanged: number;
  skipped: number;
  failed: number;
  duplicateSourceIds: number;
  peakConcurrency: number;
};

export type MlsScopedPageIngestResult = MlsScopedPageIngestCounters & {
  errors: Array<{
    listingId: string | null;
    message: string;
  }>;
};

export type MlsScopedIngestPageDependencies = {
  preloadExisting: (ids: string[]) => Promise<Map<string, ExistingPropertySnapshot>>;
  upsert: (listing: MlsPageListingPayload, existing: ExistingPropertySnapshot | null) => Promise<PropertyRecord | null>;
};

export type MlsScopedIngestRunResult = MlsScopedPageIngestCounters & {
  sourceReportedScopedCount: number | null;
  pages: number;
  terminalSignal: string | null;
  finalNextLinkState: 'present' | 'absent';
  checkpoint: MlsScopedIngestCheckpoint;
  durationMs: number;
  errors: MlsScopedPageIngestResult['errors'];
};

export function getMlsScopedPublicSearchContract(top = MLS_SCOPED_PUBLIC_SEARCH_TOP): MlsScopedIngestScopeContract {
  return {
    endpoint: MLS_SCOPED_PUBLIC_SEARCH_ENDPOINT,
    filter: MLS_SCOPED_PUBLIC_SEARCH_FILTER,
    includeMedia: false,
    orderBy: MLS_SCOPED_PUBLIC_SEARCH_ORDER_BY,
    requestCount: true,
    top,
    traversal: 'PROVIDER_NEXTLINK_TRAVERSAL',
  };
}

export function getMlsScopedPublicSearchFingerprint(contract = getMlsScopedPublicSearchContract()) {
  const canonical = JSON.stringify({
    endpoint: contract.endpoint,
    filter: contract.filter,
    includeMedia: contract.includeMedia,
    orderBy: contract.orderBy,
    requestCount: contract.requestCount,
    top: contract.top,
    traversal: contract.traversal,
  });

  return createHash('sha256').update(canonical).digest('hex');
}

export function createMlsScopedIngestCheckpoint({
  checkpoint,
  nextLink,
  pageNumber,
  processedCount,
  fetchedCount,
  scopeFingerprint = getMlsScopedPublicSearchFingerprint(),
}: {
  checkpoint?: MlsScopedIngestCheckpoint | null;
  nextLink: string | null;
  pageNumber: number;
  processedCount: number;
  fetchedCount: number;
  scopeFingerprint?: string;
}): MlsScopedIngestCheckpoint {
  return {
    version: 1,
    scopeFingerprint,
    pageNumber,
    processedCount: (checkpoint?.processedCount ?? 0) + processedCount,
    fetchedCount: (checkpoint?.fetchedCount ?? 0) + fetchedCount,
    nextLink,
    updatedAt: new Date().toISOString(),
  };
}

export function validateMlsScopedIngestCheckpoint({
  checkpoint,
  expectedScopeFingerprint = getMlsScopedPublicSearchFingerprint(),
  providerBaseUrl,
}: {
  checkpoint: MlsScopedIngestCheckpoint | null | undefined;
  expectedScopeFingerprint?: string;
  providerBaseUrl: string;
}): MlsScopedIngestCheckpointValidation {
  if (!checkpoint) {
    return {
      ok: false,
      reason: 'missing_checkpoint',
    };
  }

  if (checkpoint.version !== 1) {
    return {
      ok: false,
      reason: 'wrong_version',
    };
  }

  if (checkpoint.scopeFingerprint !== expectedScopeFingerprint) {
    return {
      ok: false,
      reason: 'wrong_scope_fingerprint',
    };
  }

  if (!Number.isInteger(checkpoint.pageNumber) || checkpoint.pageNumber < 0) {
    return {
      ok: false,
      reason: 'invalid_page_number',
    };
  }

  if (!Number.isInteger(checkpoint.processedCount) || checkpoint.processedCount < 0) {
    return {
      ok: false,
      reason: 'invalid_processed_count',
    };
  }

  if (!Number.isInteger(checkpoint.fetchedCount) || checkpoint.fetchedCount < 0) {
    return {
      ok: false,
      reason: 'invalid_fetched_count',
    };
  }

  if (checkpoint.nextLink) {
    const validation = validateProviderNextLink(checkpoint.nextLink, providerBaseUrl);
    if (!validation.ok) {
      return {
        ok: false,
        reason: 'invalid_next_link',
      };
    }
  }

  return {
    ok: true,
    checkpoint,
  };
}

function getListingId(listing: MlsPageListingPayload) {
  for (const field of ['ListingKey', 'ListingId', 'MlsId', 'MLSNumber', 'ListingNumber', 'Id', 'mlsid']) {
    const value = listing[field];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }

  return null;
}

function getSafeConcurrency(concurrency: number | undefined) {
  if (!Number.isFinite(concurrency)) return MLS_SCOPED_ACCELERATION_DEFAULT_CONCURRENCY;
  return Math.max(1, Math.min(Math.floor(concurrency as number), MLS_SCOPED_ACCELERATION_MAX_CONCURRENCY));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error || 'Unknown scoped ingest error.');
}

function groupListingsById(listings: MlsPageListingPayload[]) {
  const groups = new Map<string, MlsPageListingPayload[]>();
  const missingIdGroups: MlsPageListingPayload[][] = [];
  let duplicateSourceIds = 0;

  for (const listing of listings) {
    const listingId = getListingId(listing);
    if (!listingId) {
      missingIdGroups.push([listing]);
      continue;
    }

    const group = groups.get(listingId);
    if (group) {
      duplicateSourceIds += 1;
      group.push(listing);
    } else {
      groups.set(listingId, [listing]);
    }
  }

  return {
    duplicateSourceIds,
    groups: [...groups.values(), ...missingIdGroups],
    ids: Array.from(groups.keys()),
  };
}

function toExistingSnapshot(property: PropertyRecord): ExistingPropertySnapshot {
  return {
    id: property.id,
    lat: property.lat,
    lng: property.lng,
    slug: property.slug,
    sourceModifiedAt: property.sourceModifiedAt,
  };
}

export async function preloadExistingProperties(ids: string[]) {
  if (!ids.length) return new Map<string, ExistingPropertySnapshot>();

  const rows = await prisma.property.findMany({
    where: {
      mlsId: {
        in: ids,
      },
    },
    select: {
      id: true,
      lat: true,
      lng: true,
      mlsId: true,
      slug: true,
      sourceModifiedAt: true,
    },
  });

  return new Map(
    rows.map((row) => [
      row.mlsId,
      {
        id: row.id,
        lat: row.lat,
        lng: row.lng,
        slug: row.slug,
        sourceModifiedAt: row.sourceModifiedAt,
      },
    ]),
  );
}

export async function upsertScopedListingWithExisting(
  listing: MlsPageListingPayload,
  existing: ExistingPropertySnapshot | null,
) {
  return upsertListingWithExistingProperty(listing, existing);
}

export async function ingestMlsScopedPageAccelerated(
  listings: MlsPageListingPayload[],
  dependencies: MlsScopedIngestPageDependencies,
  {
    concurrency,
  }: {
    concurrency?: number;
  } = {},
): Promise<MlsScopedPageIngestResult> {
  const safeConcurrency = getSafeConcurrency(concurrency);
  const grouped = groupListingsById(listings);
  const existing = await dependencies.preloadExisting(grouped.ids);
  const counters: MlsScopedPageIngestResult = {
    created: 0,
    duplicateSourceIds: grouped.duplicateSourceIds,
    errors: [],
    failed: 0,
    fetched: listings.length,
    peakConcurrency: 0,
    processed: 0,
    skipped: 0,
    unchanged: 0,
    updated: 0,
  };

  let active = 0;
  let groupIndex = 0;

  async function processGroup(group: MlsPageListingPayload[]) {
    let currentExisting = existing.get(getListingId(group[0] || {}) || '') || null;

    for (const listing of group) {
      const listingId = getListingId(listing);

      try {
        const property = await dependencies.upsert(listing, currentExisting);

        if (!property) {
          counters.skipped += 1;
          continue;
        }

        counters.processed += 1;

        if (currentExisting) {
          counters.updated += 1;
        } else {
          counters.created += 1;
        }

        currentExisting = toExistingSnapshot(property);
      } catch (error) {
        counters.failed += 1;
        counters.errors.push({
          listingId,
          message: getErrorMessage(error),
        });
      }
    }
  }

  async function worker() {
    while (groupIndex < grouped.groups.length) {
      const group = grouped.groups[groupIndex];
      groupIndex += 1;
      active += 1;
      counters.peakConcurrency = Math.max(counters.peakConcurrency, active);
      try {
        await processGroup(group || []);
      } finally {
        active -= 1;
      }
    }
  }

  const workerCount = Math.min(safeConcurrency, grouped.groups.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return counters;
}

export function addMlsScopedPageCounters(
  target: MlsScopedPageIngestCounters,
  source: MlsScopedPageIngestCounters,
) {
  target.created += source.created;
  target.duplicateSourceIds += source.duplicateSourceIds;
  target.failed += source.failed;
  target.fetched += source.fetched;
  target.peakConcurrency = Math.max(target.peakConcurrency, source.peakConcurrency);
  target.processed += source.processed;
  target.skipped += source.skipped;
  target.unchanged += source.unchanged;
  target.updated += source.updated;
}

export async function fetchInitialMlsScopedPublicSearchPage({
  timeoutMs,
  top = MLS_SCOPED_PUBLIC_SEARCH_TOP,
}: {
  timeoutMs?: number;
  top?: number;
} = {}) {
  return fetchMLSPageResponse({
    filter: MLS_SCOPED_PUBLIC_SEARCH_FILTER,
    includeMedia: false,
    orderBy: MLS_SCOPED_PUBLIC_SEARCH_ORDER_BY,
    page: 0,
    requestCount: true,
    timeoutMs,
    top,
  });
}

export async function fetchNextMlsScopedPublicSearchPage(
  nextLink: string,
  {
    timeoutMs,
  }: {
    timeoutMs?: number;
  } = {},
) {
  return fetchMLSPageResponseFromNextLink(nextLink, { timeoutMs });
}

export async function ingestMlsScopedPublicSearchPages({
  checkpoint = null,
  concurrency,
  maxPages,
  maxRows,
  providerBaseUrl,
  timeoutMs,
  top = MLS_SCOPED_PUBLIC_SEARCH_TOP,
}: {
  checkpoint?: MlsScopedIngestCheckpoint | null;
  concurrency?: number;
  maxPages: number;
  maxRows: number;
  providerBaseUrl: string;
  timeoutMs?: number;
  top?: number;
}): Promise<MlsScopedIngestRunResult> {
  const startedAt = Date.now();
  const scopeFingerprint = getMlsScopedPublicSearchFingerprint(getMlsScopedPublicSearchContract(top));
  const aggregate: MlsScopedPageIngestCounters = {
    created: 0,
    duplicateSourceIds: 0,
    failed: 0,
    fetched: 0,
    peakConcurrency: 0,
    processed: 0,
    skipped: 0,
    unchanged: 0,
    updated: 0,
  };
  const errors: MlsScopedPageIngestResult['errors'] = [];
  let pageNumber = checkpoint?.pageNumber ?? 0;
  let nextLink = checkpoint?.nextLink ?? null;
  let sourceReportedScopedCount: number | null = null;
  let terminalSignal: string | null = null;
  let currentCheckpoint = checkpoint;

  if (checkpoint) {
    const validation = validateMlsScopedIngestCheckpoint({
      checkpoint,
      expectedScopeFingerprint: scopeFingerprint,
      providerBaseUrl,
    });

    if (!validation.ok) {
      throw new Error(`Rejected scoped MLS checkpoint: ${validation.reason}.`);
    }
  }

  for (let pages = 0; pages < maxPages && aggregate.fetched < maxRows; pages += 1) {
    let page: MlsPageResponse<MlsPageListingPayload>;

    if (nextLink) {
      const validation = validateProviderNextLink(nextLink, providerBaseUrl);
      if (!validation.ok) {
        throw new Error(`Rejected scoped MLS nextLink: ${validation.reason}.`);
      }
      page = await fetchNextMlsScopedPublicSearchPage(nextLink, { timeoutMs });
    } else if (currentCheckpoint) {
      break;
    } else {
      page = await fetchInitialMlsScopedPublicSearchPage({ timeoutMs, top });
    }

    if (sourceReportedScopedCount === null && page.metadata.sourceCount !== null) {
      sourceReportedScopedCount = page.metadata.sourceCount;
    }

    const boundedPageValue = page.value.slice(0, Math.max(0, maxRows - aggregate.fetched));
    const result = await ingestMlsScopedPageAccelerated(
      boundedPageValue,
      {
        preloadExisting: preloadExistingProperties,
        upsert: upsertScopedListingWithExisting,
      },
      { concurrency },
    );

    addMlsScopedPageCounters(aggregate, result);
    errors.push(...result.errors);

    if (result.failed > 0) {
      throw new Error(`Scoped MLS page failed before checkpoint: failed=${result.failed}.`);
    }

    pageNumber += 1;
    terminalSignal = page.metadata.terminationSignal;
    nextLink = page.metadata.nextLink;
    currentCheckpoint = createMlsScopedIngestCheckpoint({
      checkpoint: currentCheckpoint,
      fetchedCount: result.fetched,
      nextLink,
      pageNumber,
      processedCount: result.processed,
      scopeFingerprint,
    });

    if (!nextLink || aggregate.fetched >= maxRows) break;
  }

  return {
    ...aggregate,
    checkpoint:
      currentCheckpoint ||
      createMlsScopedIngestCheckpoint({
        fetchedCount: 0,
        nextLink: null,
        pageNumber,
        processedCount: 0,
        scopeFingerprint,
      }),
    durationMs: Date.now() - startedAt,
    errors,
    finalNextLinkState: nextLink ? 'present' : 'absent',
    pages: pageNumber - (checkpoint?.pageNumber ?? 0),
    sourceReportedScopedCount,
    terminalSignal,
  };
}
