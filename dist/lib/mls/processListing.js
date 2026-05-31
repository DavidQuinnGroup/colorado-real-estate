import { matchAndNotify } from '../alerts/matchSearches.js';
import { processPhotos } from './processPhotos.js';
import { updateSearchIndex } from './updateSearchIndex.js';
import { upsertListing } from './upsertListing.js';
const mediaArrayFields = [
    'Media',
    'media',
    'Photos',
    'photos',
    'Images',
    'images',
    'PropertyPhotos',
    'propertyPhotos',
];
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
];
const listingLabelFields = [
    'ListingKey',
    'ListingId',
    'MlsId',
    'MLSNumber',
    'ListingNumber',
    'Id',
    'mlsid',
    'UnparsedAddress',
];
function getFirstListingValue(listing, fields) {
    for (const field of fields) {
        const value = listing[field];
        if (value !== undefined && value !== null && String(value).trim()) {
            return value;
        }
    }
    return 'unknown';
}
function getListingLabel(listing) {
    return String(getFirstListingValue(listing, listingLabelFields));
}
function getProcessedListingLabel(listingLabel, property) {
    const candidates = [property.mlsId, property.id, property.address, listingLabel];
    for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim())
            return candidate.trim();
    }
    return listingLabel;
}
function isMediaRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error || 'Unknown listing processing error.');
}
function pushMediaArray(target, value) {
    if (!Array.isArray(value))
        return;
    for (const item of value) {
        if (typeof item === 'string' && item.trim()) {
            target.push(item);
        }
        else if (isMediaRecord(item)) {
            target.push(item);
        }
    }
}
function pushNestedMediaArrays(target, value) {
    if (!isMediaRecord(value))
        return;
    for (const field of mediaArrayFields) {
        pushMediaArray(target, value[field]);
    }
}
function pushTopLevelPhoto(target, listing, field) {
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
function emptyPhotoResult(error) {
    return {
        inserted: 0,
        skipped: 0,
        ...(error ? { error } : {}),
    };
}
async function processListingPhotos(propertyId, media, listingLabel) {
    try {
        return await processPhotos(propertyId, media);
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(`MLS photo processing failed for ${listingLabel}:`, errorMessage);
        return emptyPhotoResult(errorMessage);
    }
}
async function queueSavedSearchAlerts(property, listingLabel) {
    try {
        return await matchAndNotify(property);
    }
    catch (error) {
        console.error(`Saved-search alert matching failed for ${listingLabel}:`, getErrorMessage(error));
        return null;
    }
}
async function updateListingSearchIndex(property, listingLabel) {
    const result = await updateSearchIndex(property);
    if (result.error) {
        console.error(`Search index update failed for ${listingLabel}:`, result.error);
    }
    return result;
}
export function getListingMediaPayload(listing) {
    const media = [];
    for (const field of mediaArrayFields) {
        pushMediaArray(media, listing[field]);
        pushNestedMediaArrays(media, listing[field]);
    }
    for (const field of topLevelPhotoFields) {
        pushTopLevelPhoto(media, listing, field);
    }
    return media;
}
export async function processListing(listing) {
    const listingLabel = getListingLabel(listing);
    const warnings = [];
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
    }
    catch (error) {
        console.error(`MLS listing processing failed for ${listingLabel}:`, getErrorMessage(error));
        return null;
    }
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListing.ts
