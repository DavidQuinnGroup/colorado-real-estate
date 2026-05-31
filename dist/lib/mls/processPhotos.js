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
function isImageMedia(photo, url) {
    if (typeof photo === 'string')
        return true;
    const mediaType = getTextField(photo, ['MediaType', 'mediaType', 'MimeType', 'mimeType', 'ContentType', 'contentType']);
    const mediaCategory = getTextField(photo, ['MediaCategory', 'mediaCategory', 'ResourceName', 'resourceName']);
    if (mediaType.includes('image') || mediaType.includes('photo'))
        return true;
    if (mediaCategory.includes('image') || mediaCategory.includes('photo') || mediaCategory.includes('property'))
        return true;
    if (!mediaType && !mediaCategory)
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
    const seenUrls = new Set();
    return flattenPhotos(photos)
        .map((photo, index) => {
        const url = extractPhotoUrl(photo);
        const order = getPhotoOrder(photo, index);
        return { photo, url, order };
    })
        .filter((item) => {
        if (!item.url || seenUrls.has(item.url))
            return false;
        if (!isImageMedia(item.photo, item.url))
            return false;
        seenUrls.add(item.url);
        return true;
    })
        .sort((a, b) => a.order - b.order || a.url.localeCompare(b.url))
        .slice(0, maxPhotosPerProperty)
        .map((item, index) => ({
        propertyId,
        url: item.url,
        order: index,
    }));
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
        return { inserted: 0, skipped: 0 };
    }
    const flattenedPhotoCount = flattenPhotos(photos).length;
    const photoRecords = normalizePhotoRecords(propertyId, photos);
    const skipped = Math.max(0, flattenedPhotoCount - photoRecords.length);
    if (photoRecords.length === 0) {
        console.log(`No valid MLS photo URLs found for property ${propertyId}; existing photo records were preserved.`);
        return { inserted: 0, skipped };
    }
    try {
        await replacePhotoRecords(propertyId, photoRecords);
        console.log(`Processed ${photoRecords.length} MLS photos for property ${propertyId}.`);
        return { inserted: photoRecords.length, skipped };
    }
    catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(`MLS photo processing failed for property ${propertyId}:`, errorMessage);
        return { inserted: 0, skipped: flattenedPhotoCount, error: errorMessage };
    }
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processPhotos.ts
