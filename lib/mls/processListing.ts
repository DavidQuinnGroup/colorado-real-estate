import type { AlertMatchSummary } from '../alerts/matchSearches.js';
import { matchAndNotify } from '../alerts/matchSearches.js';
import type { MlsPhoto, ProcessPhotosResult } from './processPhotos.js';
import { processPhotos } from './processPhotos.js';
import type { SearchIndexResult } from './updateSearchIndex.js';
import { updateSearchIndex } from './updateSearchIndex.js';
import type { PropertyRecord, UpsertListingDiagnostics } from './upsertListing.js';
import { getUpsertListingDiagnostics, upsertListing } from './upsertListing.js';

export type MlsListingPayload = Record<string, unknown>;
export type ListingMediaPayload = MlsPhoto;

export type ListingMediaDiagnostics = {
  module: 'MLS Listing Media';
  terminal: 'Terminal 5';
  extractedCount: number;
  directMediaArrayFields: string[];
  nestedMediaArrayFields: string[];
  topLevelPhotoFields: string[];
  stringMediaCount: number;
  recordMediaCount: number;
  ignoredMediaItemCount: number;
  hasMediaPayload: boolean;
  hasNestedMediaPayload: boolean;
  hasTopLevelPhotoPayload: boolean;
  nextCommand: 'npm run smoke:ops';
};

export type ProcessListingResult = {
  alerts: AlertMatchSummary | null;
  listingLabel: string;
  mediaCount: number;
  mediaDiagnostics: ListingMediaDiagnostics;
  photos: ProcessPhotosResult;
  property: PropertyRecord;
  searchIndex: SearchIndexResult;
  upsertDiagnostics: UpsertListingDiagnostics;
  warnings: string[];
};

const mediaArrayFields = [
  'Media',
  'media',
  'Photos',
  'photos',
  'Images',
  'images',
  'PropertyPhotos',
  'propertyPhotos',
] as const;

const topLevelPhotoFields = [
  'MediaURL',
  'MediaUrl',
  'MediaURLFull',
  'MediaUrlFull',
  'MediaObjectURL',
  'MediaObjectUrl',
  'PhotoURL',
  'PhotoUrl',
  'ImageURL',
  'ImageUrl',
  'PrimaryPhotoURL',
  'PrimaryPhotoUrl',
  'LargePhotoURL',
  'LargePhotoUrl',
  'mainPhoto',
  'image',
  'thumbnailUrl',
] as const;

const listingLabelFields = [
  'ListingKey',
  'ListingId',
  'MlsId',
  'MLSNumber',
  'ListingNumber',
  'Id',
  'mlsid',
  'UnparsedAddress',
] as const;

function getFirstListingValue(listing: MlsListingPayload, fields: readonly string[]) {
  for (const field of fields) {
    const value = listing[field];

    if (value !== undefined && value !== null && String(value).trim()) {
      return value;
    }
  }

  return 'unknown';
}

function getListingLabel(listing: MlsListingPayload) {
  return String(getFirstListingValue(listing, listingLabelFields));
}

function getProcessedListingLabel(listingLabel: string, property: PropertyRecord) {
  const candidates = [property.mlsId, property.id, property.address, listingLabel];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  }

  return listingLabel;
}

function isMediaRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error || 'Unknown listing processing error.');
}

function appendMediaItem(target: ListingMediaPayload[], value: unknown) {
  if (typeof value === 'string' && value.trim()) {
    target.push(value);
    return true;
  }

  if (isMediaRecord(value)) {
    target.push(value);
    return true;
  }

  return false;
}

function collectMediaArray(target: ListingMediaPayload[], value: unknown) {
  if (!Array.isArray(value)) return { found: false, ignored: 0 };

  let ignored = 0;

  for (const item of value) {
    if (!appendMediaItem(target, item)) ignored += 1;
  }

  return { found: true, ignored };
}

function collectNestedMediaArrays(target: ListingMediaPayload[], value: unknown, parentField: string) {
  const nestedFields: string[] = [];
  let ignored = 0;

  if (!isMediaRecord(value)) return { fields: nestedFields, ignored };

  for (const field of mediaArrayFields) {
    const result = collectMediaArray(target, value[field]);

    if (result.found) {
      nestedFields.push(`${parentField}.${field}`);
      ignored += result.ignored;
    }
  }

  return { fields: nestedFields, ignored };
}

function collectTopLevelPhoto(target: ListingMediaPayload[], listing: MlsListingPayload, field: string) {
  const value = listing[field];

  if (typeof value !== 'string' || !value.trim()) {
    return false;
  }

  target.push({
    MediaURL: value,
    Order: target.length,
    SourceField: field,
  });

  return true;
}

function emptyPhotoResult(error?: string): ProcessPhotosResult {
  return {
    inserted: 0,
    skipped: 0,
    diagnostics: {
      inputCount: 0,
      flattenedCount: 0,
      validCount: 0,
      duplicateCount: 0,
      invalidUrlCount: 0,
      nonImageCount: 0,
      truncatedCount: 0,
      preservedExisting: true,
      replacedExisting: false,
      maxPhotos: 100,
    },
    ...(error ? { error } : {}),
  };
}

async function processListingPhotos(propertyId: string, media: ListingMediaPayload[], listingLabel: string) {
  try {
    return await processPhotos(propertyId, media);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`MLS photo processing failed for ${listingLabel}:`, errorMessage);
    return emptyPhotoResult(errorMessage);
  }
}

async function queueSavedSearchAlerts(property: PropertyRecord, listingLabel: string) {
  try {
    return await matchAndNotify(property);
  } catch (error) {
    console.error(`Saved-search alert matching failed for ${listingLabel}:`, getErrorMessage(error));
    return null;
  }
}

async function updateListingSearchIndex(property: PropertyRecord, listingLabel: string) {
  const result = await updateSearchIndex(property);

  if (result.error) {
    console.error(`Search index update failed for ${listingLabel}:`, result.error);
  }

  return result;
}

export function getListingMediaPayload(listing: MlsListingPayload): ListingMediaPayload[] {
  return collectListingMediaPayload(listing).media;
}

export function getListingMediaDiagnostics(listing: MlsListingPayload): ListingMediaDiagnostics {
  return collectListingMediaPayload(listing).diagnostics;
}

function collectListingMediaPayload(listing: MlsListingPayload): {
  media: ListingMediaPayload[];
  diagnostics: ListingMediaDiagnostics;
} {
  const media: ListingMediaPayload[] = [];
  const directMediaArrayFields: string[] = [];
  const nestedMediaArrayFields: string[] = [];
  const collectedTopLevelPhotoFields: string[] = [];
  let ignoredMediaItemCount = 0;

  for (const field of mediaArrayFields) {
    const directResult = collectMediaArray(media, listing[field]);

    if (directResult.found) {
      directMediaArrayFields.push(field);
      ignoredMediaItemCount += directResult.ignored;
    }

    const nestedResult = collectNestedMediaArrays(media, listing[field], field);
    nestedMediaArrayFields.push(...nestedResult.fields);
    ignoredMediaItemCount += nestedResult.ignored;
  }

  for (const field of topLevelPhotoFields) {
    if (collectTopLevelPhoto(media, listing, field)) {
      collectedTopLevelPhotoFields.push(field);
    }
  }

  const stringMediaCount = media.filter((item) => typeof item === 'string').length;
  const recordMediaCount = media.length - stringMediaCount;

  return {
    media,
    diagnostics: {
      module: 'MLS Listing Media',
      terminal: 'Terminal 5',
      extractedCount: media.length,
      directMediaArrayFields,
      nestedMediaArrayFields,
      topLevelPhotoFields: collectedTopLevelPhotoFields,
      stringMediaCount,
      recordMediaCount,
      ignoredMediaItemCount,
      hasMediaPayload: media.length > 0,
      hasNestedMediaPayload: nestedMediaArrayFields.length > 0,
      hasTopLevelPhotoPayload: collectedTopLevelPhotoFields.length > 0,
      nextCommand: 'npm run smoke:ops',
    },
  };
}

export async function processListing(listing: MlsListingPayload): Promise<ProcessListingResult | null> {
  const listingLabel = getListingLabel(listing);
  const warnings: string[] = [];

  try {
    const upsertDiagnostics = getUpsertListingDiagnostics(listing);
    const property = await upsertListing(listing);

    if (!property?.id) {
      const warning = `MLS listing ${listingLabel} was skipped because no property record was returned${
        upsertDiagnostics.skipReason ? `: ${upsertDiagnostics.skipReason}` : '.'
      }`;
      warnings.push(warning);
      console.warn(warning);
      return null;
    }

    const processedListingLabel = getProcessedListingLabel(listingLabel, property);
    const searchIndexResult = await updateListingSearchIndex(property, processedListingLabel);
    const { media: rawPhotos, diagnostics: mediaDiagnostics } = collectListingMediaPayload(listing);
    const photoResult = await processListingPhotos(property.id, rawPhotos, processedListingLabel);
    const alertResult = await queueSavedSearchAlerts(property, processedListingLabel);

    if (!searchIndexResult.indexed) {
      warnings.push(`Search index update did not complete for this listing${searchIndexResult.error ? `: ${searchIndexResult.error}` : '.'}`);
    }

    if (photoResult.error) {
      warnings.push(`Photo processing warning: ${photoResult.error}`);
    }

    if (!alertResult) {
      warnings.push('Saved-search alert matching did not complete for this listing.');
    }

    return {
      alerts: alertResult,
      listingLabel: processedListingLabel,
      mediaCount: rawPhotos.length,
      mediaDiagnostics,
      photos: photoResult,
      property,
      searchIndex: searchIndexResult,
      upsertDiagnostics,
      warnings,
    };
  } catch (error) {
    console.error(`MLS listing processing failed for ${listingLabel}:`, getErrorMessage(error));
    return null;
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListing.ts
