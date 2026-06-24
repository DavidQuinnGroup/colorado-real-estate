import { prisma } from '../prisma.js';
const photoUrlFields = [
    'MediaURL',
    'MediaUrl',
    'MediaURLFull',
    'MediaUrlFull',
    'MediaObjectURL',
    'MediaObjectUrl',
    'ObjectURL',
    'ObjectUrl',
    'OriginalURL',
    'OriginalUrl',
    'HighResURL',
    'HighResUrl',
    'LargePhotoURL',
    'LargePhotoUrl',
    'ThumbnailURL',
    'ThumbnailUrl',
    'PhotoURL',
    'PhotoUrl',
    'ImageURL',
    'ImageUrl',
    'PrimaryPhotoURL',
    'PrimaryPhotoUrl',
    'url',
    'Url',
    'uri',
    'Uri',
];
const photoOrderFields = [
    'Order',
    'order',
    'MediaOrder',
    'MediaOrderNumeric',
    'SequenceNumber',
    'ResourceRecordKeyNumeric',
    'SortOrder',
    'sortOrder',
];
const nestedPhotoFields = ['Media', 'media', 'Photos', 'photos', 'Images', 'images', 'PropertyPhotos', 'propertyPhotos'];
const imageFileExtensionPattern = /\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i;
const maxPhotosPerProperty = 100;
const nonImageMediaTerms = ['application/pdf', 'pdf', 'floor plan', 'floorplan', 'document', 'brochure', 'video', 'virtual tour', 'virtualtour'];
function emptyDiagnostics(inputCount = 0) {
    return {
        inputCount,
        flattenedCount: 0,
        validCount: 0,
        duplicateCount: 0,
        invalidUrlCount: 0,
        nonImageCount: 0,
        truncatedCount: 0,
        preservedExisting: true,
        replacedExisting: false,
        maxPhotos: maxPhotosPerProperty,
    };
}
function isPhotoRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function cleanPhotoUrl(value) {
    if (typeof value !== 'string')
        return null;
    const url = value.trim();
    if (!url)
        return null;
    if (url.startsWith('//'))
        return `https:${url}`;
    if (url.startsWith('http://') || url.startsWith('https://'))
        return url;
    return null;
}
function getFirstStringValue(photo, fields) {
    for (const field of fields) {
        const value = cleanPhotoUrl(photo[field]);
        if (value)
            return value;
    }
    return null;
}
function getPhotoOrder(photo, fallbackOrder) {
    if (typeof photo === 'string')
        return fallbackOrder;
    for (const field of photoOrderFields) {
        const value = Number(photo[field]);
        if (Number.isFinite(value))
            return value;
    }
    return fallbackOrder;
}
function getTextField(photo, fields) {
    for (const field of fields) {
        const value = photo[field];
        if (typeof value === 'string' && value.trim()) {
            return value.trim().toLowerCase();
        }
    }
    return '';
}
function includesNonImageMediaTerm(value) {
    return nonImageMediaTerms.some((term) => value.includes(term));
}
function isImageMedia(photo, url) {
    if (typeof photo === 'string')
        return imageFileExtensionPattern.test(url);
    const mediaType = getTextField(photo, ['MediaType', 'mediaType', 'MimeType', 'mimeType', 'ContentType', 'contentType']);
    const mediaCategory = getTextField(photo, ['MediaCategory', 'mediaCategory', 'ResourceName', 'resourceName']);
    if (includesNonImageMediaTerm(mediaType) || includesNonImageMediaTerm(mediaCategory))
        return false;
    if (mediaType.includes('image') || mediaType.includes('photo'))
        return true;
    if (mediaCategory.includes('image') || mediaCategory.includes('photo') || mediaCategory.includes('property'))
        return true;
    return imageFileExtensionPattern.test(url);
}
function getNestedPhotos(photo) {
    for (const field of nestedPhotoFields) {
        const value = photo[field];
        if (Array.isArray(value)) {
            return value.filter((item) => typeof item === 'string' || isPhotoRecord(item));
        }
    }
    return null;
}
function flattenPhotos(photos) {
    const flattened = [];
    for (const photo of photos) {
        if (typeof photo === 'string') {
            flattened.push(photo);
            continue;
        }
        const nested = getNestedPhotos(photo);
        if (nested) {
            flattened.push(...nested);
        }
        else {
            flattened.push(photo);
        }
    }
    return flattened;
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error || 'Unknown MLS photo processing error.');
}
export function extractPhotoUrl(photo) {
    if (typeof photo === 'string') {
        return cleanPhotoUrl(photo);
    }
    return getFirstStringValue(photo, photoUrlFields);
}
export function normalizePhotoRecords(propertyId, photos) {
    return normalizePhotoRecordsWithDiagnostics(propertyId, photos).records;
}
export function normalizePhotoRecordsWithDiagnostics(propertyId, photos) {
    const seenUrls = new Set();
    const flattenedPhotos = flattenPhotos(photos);
    const candidates = flattenedPhotos.map((photo, index) => ({
        photo,
        url: extractPhotoUrl(photo),
        order: getPhotoOrder(photo, index),
    }));
    const validCandidates = [];
    let duplicateCount = 0;
    let invalidUrlCount = 0;
    let nonImageCount = 0;
    for (const candidate of candidates) {
        if (!candidate.url) {
            invalidUrlCount += 1;
            continue;
        }
        if (seenUrls.has(candidate.url)) {
            duplicateCount += 1;
            continue;
        }
        if (!isImageMedia(candidate.photo, candidate.url)) {
            nonImageCount += 1;
            continue;
        }
        seenUrls.add(candidate.url);
        validCandidates.push({
            photo: candidate.photo,
            url: candidate.url,
            order: candidate.order,
        });
    }
    const sortedCandidates = validCandidates.sort((a, b) => a.order - b.order || a.url.localeCompare(b.url));
    const limitedCandidates = sortedCandidates.slice(0, maxPhotosPerProperty);
    const records = limitedCandidates.map((item, index) => ({
        propertyId,
        url: item.url,
        order: index,
    }));
    return {
        records,
        diagnostics: {
            inputCount: photos.length,
            flattenedCount: flattenedPhotos.length,
            validCount: records.length,
            duplicateCount,
            invalidUrlCount,
            nonImageCount,
            truncatedCount: Math.max(0, sortedCandidates.length - limitedCandidates.length),
            preservedExisting: records.length === 0,
            replacedExisting: records.length > 0,
            maxPhotos: maxPhotosPerProperty,
        },
    };
}
async function replacePhotoRecords(propertyId, photoRecords) {
    await prisma.$transaction([
        prisma.propertyPhoto.deleteMany({
            where: {
                propertyId,
            },
        }),
        prisma.propertyPhoto.createMany({
            data: photoRecords,
        }),
    ]);
}
export async function processPhotos(propertyId, photos = []) {
    if (!propertyId) {
        throw new Error('Cannot process MLS photos without a propertyId.');
    }
    if (!Array.isArray(photos) || photos.length === 0) {
        console.log(`No MLS photos supplied for property ${propertyId}; existing photo records were preserved.`);
        return { inserted: 0, skipped: 0, diagnostics: emptyDiagnostics(Array.isArray(photos) ? photos.length : 0) };
    }
    const { records: photoRecords, diagnostics } = normalizePhotoRecordsWithDiagnostics(propertyId, photos);
    const skipped = diagnostics.duplicateCount + diagnostics.invalidUrlCount + diagnostics.nonImageCount + diagnostics.truncatedCount;
    if (photoRecords.length === 0) {
        console.log(`No valid MLS photo URLs found for property ${propertyId}; existing photo records were preserved.`);
        return { inserted: 0, skipped, diagnostics };
    }
    try {
        await replacePhotoRecords(propertyId, photoRecords);
        console.log(`Processed ${photoRecords.length} MLS photos for property ${propertyId}.`);
        return { inserted: photoRecords.length, skipped, diagnostics };
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(`MLS photo processing failed for property ${propertyId}:`, errorMessage);
        return {
            inserted: 0,
            skipped: diagnostics.flattenedCount,
            diagnostics: {
                ...diagnostics,
                preservedExisting: true,
                replacedExisting: false,
            },
            error: errorMessage,
        };
    }
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processPhotos.ts
