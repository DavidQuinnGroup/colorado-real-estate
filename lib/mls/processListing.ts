import type { AlertMatchSummary } from '../alerts/matchSearches.js';
import { matchAndNotify } from '../alerts/matchSearches.js';
import type { MlsPhoto, ProcessPhotosResult } from './processPhotos.js';
import { processPhotos } from './processPhotos.js';
import type { SearchIndexResult } from './updateSearchIndex.js';
import { updateSearchIndex } from './updateSearchIndex.js';
import type { PropertyRecord } from './upsertListing.js';
import { upsertListing } from './upsertListing.js';

export type MlsListingPayload = Record<string, unknown>;
export type ListingMediaPayload = MlsPhoto;

export type ProcessListingResult = {
  alerts: AlertMatchSummary | null;
  listingLabel: string;
  mediaCount: number;
  photos: ProcessPhotosResult;
  property: PropertyRecord;
  searchIndex: SearchIndexResult;
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

function pushMediaArray(target: ListingMediaPayload[], value: unknown) {
  if (!Array.isArray(value)) return;

  for (const item of value) {
    if (typeof item === 'string' && item.trim()) {
      target.push(item);
    } else if (isMediaRecord(item)) {
      target.push(item);
    }
  }
}

function pushNestedMediaArrays(target: ListingMediaPayload[], value: unknown) {
  if (!isMediaRecord(value)) return;

  for (const field of mediaArrayFields) {
    pushMediaArray(target, value[field]);
  }
}

function pushTopLevelPhoto(target: ListingMediaPayload[], listing: MlsListingPayload, field: string) {
  const value = listing[field];

  if (typeof value !== 'string' || !value.trim()) {
    return;
  }

  target.push({
    MediaType: 'image',
    MediaURL: value,
    Order: target.length,
  });
}

function emptyPhotoResult(error?: string): ProcessPhotosResult {
  return {
    inserted: 0,
    skipped: 0,
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
  const media: ListingMediaPayload[] = [];

  for (const field of mediaArrayFields) {
    pushMediaArray(media, listing[field]);
    pushNestedMediaArrays(media, listing[field]);
  }

  for (const field of topLevelPhotoFields) {
    pushTopLevelPhoto(media, listing, field);
  }

  return media;
}

export async function processListing(listing: MlsListingPayload): Promise<ProcessListingResult | null> {
  const listingLabel = getListingLabel(listing);
  const warnings: string[] = [];

  try {
    const property = await upsertListing(listing);

    if (!property?.id) {
      const warning = `MLS listing ${listingLabel} was skipped because no property record was returned.`;
      warnings.push(warning);
      console.warn(warning);
      return null;
    }

    const processedListingLabel = getProcessedListingLabel(listingLabel, property);
    const searchIndexResult = await updateListingSearchIndex(property, processedListingLabel);
    const rawPhotos = getListingMediaPayload(listing);
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
      photos: photoResult,
      property,
      searchIndex: searchIndexResult,
      warnings,
    };
  } catch (error) {
    console.error(`MLS listing processing failed for ${listingLabel}:`, getErrorMessage(error));
    return null;
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListing.ts
