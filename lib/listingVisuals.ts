type ListingPhoto =
  | string
  | {
      url?: string | null;
    };

type ListingVisualCategory = 'residential' | 'luxury' | 'land' | 'commercial';

export type ListingVisualInput = {
  id?: string | null;
  address?: string | null;
  city?: string | null;
  propertyType?: string | null;
  price?: number | string | null;
  photos?: ListingPhoto[] | null;
  mainPhoto?: string | null;
  image?: string | null;
};

const RESIDENTIAL_FALLBACKS = ['/reie-listing-modern.svg', '/reie-listing-estate.svg'] as const;
const LAND_FALLBACKS = ['/reie-listing-land.svg'] as const;
const COMMERCIAL_FALLBACKS = ['/reie-listing-commercial.svg'] as const;
const BLOCKED_EXTERNAL_MEDIA_HOSTS = new Set(['media.mlsgrid.com']);

export const LISTING_IMAGE_FALLBACK = RESIDENTIAL_FALLBACKS[0];
export const BLOCKED_EXTERNAL_LISTING_MEDIA_HOSTS = Array.from(BLOCKED_EXTERNAL_MEDIA_HOSTS);

function hashText(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getNumericValue(value: unknown) {
  if (value === null || value === undefined || value === '') return null;

  const parsed = typeof value === 'number' ? value : Number(String(value).replace(/[$,]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizePhotoUrl(value: unknown) {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return null;
  if (trimmed.startsWith('/')) return trimmed;

  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export function isBlockedExternalListingMediaUrl(value: unknown) {
  const photoUrl = normalizePhotoUrl(value);
  if (!photoUrl || photoUrl.startsWith('/')) return false;

  try {
    const hostname = new URL(photoUrl).hostname.toLowerCase();
    return BLOCKED_EXTERNAL_MEDIA_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

export function getDisplaySafeListingPhotoUrl(value: unknown) {
  const photoUrl = normalizePhotoUrl(value);
  if (!photoUrl || isBlockedExternalListingMediaUrl(photoUrl)) return null;

  return photoUrl;
}

function getFirstPhotoUrl(property: ListingVisualInput) {
  if (!property.photos?.length) return null;

  for (const photo of property.photos) {
    const photoUrl = getDisplaySafeListingPhotoUrl(typeof photo === 'string' ? photo : photo.url);
    if (photoUrl) return photoUrl;
  }

  return null;
}

function getListingVisualCategory(property: ListingVisualInput): ListingVisualCategory {
  const propertyType = String(property.propertyType || '').toLowerCase();
  const address = String(property.address || '').toLowerCase();
  const price = getNumericValue(property.price);

  if (
    propertyType.includes('farm') ||
    propertyType.includes('land') ||
    propertyType.includes('acre') ||
    propertyType.includes('ranch') ||
    address.startsWith('0 ')
  ) {
    return 'land';
  }

  if (
    propertyType.includes('commercial') ||
    propertyType.includes('office') ||
    propertyType.includes('retail') ||
    propertyType.includes('industrial') ||
    propertyType.includes('business')
  ) {
    return 'commercial';
  }

  if (price !== null && price >= 2_000_000) {
    return 'luxury';
  }

  return 'residential';
}

function getFallbackPhotoPool(category: ListingVisualCategory) {
  if (category === 'land') return LAND_FALLBACKS;
  if (category === 'commercial') return COMMERCIAL_FALLBACKS;
  return RESIDENTIAL_FALLBACKS;
}

export function getListingPhotoUrl(property: ListingVisualInput) {
  const mlsPhoto =
    getFirstPhotoUrl(property) ||
    getDisplaySafeListingPhotoUrl(property.mainPhoto) ||
    getDisplaySafeListingPhotoUrl(property.image);

  if (mlsPhoto) return mlsPhoto;

  const category = getListingVisualCategory(property);
  const photoPool = getFallbackPhotoPool(category);
  const identity = `${property.id || ''}-${property.address || ''}-${property.city || ''}-${property.propertyType || ''}`;
  const index = hashText(identity) % photoPool.length;

  return photoPool[index] || LISTING_IMAGE_FALLBACK;
}

export function getListingFallbackPhotoUrl(property: ListingVisualInput) {
  const category = getListingVisualCategory(property);
  const photoPool = getFallbackPhotoPool(category);
  const identity = `${property.id || ''}-${property.address || ''}-${property.city || ''}-${property.propertyType || ''}`;
  const index = hashText(identity) % photoPool.length;

  return photoPool[index] || LISTING_IMAGE_FALLBACK;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/listingVisuals.ts
