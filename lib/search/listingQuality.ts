export type SearchPhotoInput = {
  id?: string | null;
  url?: string | null;
  order?: number | null;
};

export type NormalizedSearchPhoto = {
  id: string;
  url: string;
  order: number;
};

export type SearchQualityListing = {
  id?: string | null;
  status?: string | null;
  price?: number | string | null;
  photos?: SearchPhotoInput[] | null;
  mainPhoto?: string | null;
  image?: string | null;
};

export const LAUNCH_SEARCH_CONTRACT_ID = 'LAUNCH_1_0_ACTIVE_DEFAULT';
export const DEFAULT_MARKETABLE_STATUS = 'Active';

const DEFAULT_MARKETABLE_STATUS_KEYS = new Set(['active']);

export function normalizeListingStatus(value: string | null | undefined) {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeListingStatusKey(value: string | null | undefined) {
  return normalizeListingStatus(value).toLowerCase();
}

export function hasExplicitStatusFilter(status: string | null | undefined) {
  return normalizeListingStatus(status).length > 0;
}

export function isDefaultMarketableStatus(status: string | null | undefined) {
  return DEFAULT_MARKETABLE_STATUS_KEYS.has(normalizeListingStatusKey(status));
}

export function getDefaultStatusFilter(status: string | null | undefined) {
  return hasExplicitStatusFilter(status) ? normalizeListingStatus(status) : DEFAULT_MARKETABLE_STATUS;
}

export function isUsablePhotoUrl(value: unknown) {
  if (typeof value !== 'string') return false;

  const trimmed = value.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return false;
  if (trimmed.startsWith('/')) return true;

  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function normalizeSearchPhotoUrl(value: unknown) {
  if (!isUsablePhotoUrl(value)) return null;

  const trimmed = String(value).trim();
  if (trimmed.startsWith('/')) return trimmed;

  return new URL(trimmed).toString();
}

export function normalizeSearchPhotos(photos: SearchPhotoInput[] | null | undefined): NormalizedSearchPhoto[] {
  const seen = new Set<string>();
  const normalized: NormalizedSearchPhoto[] = [];

  for (const photo of photos || []) {
    const url = normalizeSearchPhotoUrl(photo.url);
    if (!url || seen.has(url)) continue;

    seen.add(url);
    normalized.push({
      id: typeof photo.id === 'string' && photo.id.trim() ? photo.id.trim() : `photo-${normalized.length + 1}`,
      url,
      order: typeof photo.order === 'number' && Number.isFinite(photo.order) ? photo.order : normalized.length,
    });
  }

  return normalized.sort((left, right) => left.order - right.order).slice(0, 3);
}

export function getPrimarySearchPhoto(photos: SearchPhotoInput[] | null | undefined) {
  return normalizeSearchPhotos(photos)[0]?.url || null;
}

function hasUsableListingPhoto(listing: SearchQualityListing) {
  return Boolean(
    normalizeSearchPhotoUrl(listing.mainPhoto) ||
      normalizeSearchPhotoUrl(listing.image) ||
      normalizeSearchPhotos(listing.photos).length > 0,
  );
}

function getNumericPrice(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return 0;

  const parsed = typeof value === 'number' ? value : Number(String(value).replace(/[$,]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function sortListingsForLaunchQuality<TListing extends SearchQualityListing>(listings: TListing[]) {
  return [...listings].sort((left, right) => {
    const statusDelta = Number(isDefaultMarketableStatus(right.status)) - Number(isDefaultMarketableStatus(left.status));
    if (statusDelta !== 0) return statusDelta;

    const photoDelta = Number(hasUsableListingPhoto(right)) - Number(hasUsableListingPhoto(left));
    if (photoDelta !== 0) return photoDelta;

    const priceDelta = getNumericPrice(right.price) - getNumericPrice(left.price);
    if (priceDelta !== 0) return priceDelta;

    return String(left.id || '').localeCompare(String(right.id || ''));
  });
}

export function getSearchQualitySummary(listings: SearchQualityListing[], statusFilter: string | null | undefined) {
  const defaultStatusContractApplied = !hasExplicitStatusFilter(statusFilter);
  const nonDefaultStatusCount = defaultStatusContractApplied
    ? listings.filter((listing) => !isDefaultMarketableStatus(listing.status)).length
    : 0;
  const missingPhotoCount = listings.filter((listing) => !hasUsableListingPhoto(listing)).length;

  return {
    contractId: LAUNCH_SEARCH_CONTRACT_ID,
    defaultStatusContractApplied,
    explicitStatus: hasExplicitStatusFilter(statusFilter) ? normalizeListingStatus(statusFilter) : null,
    defaultStatus: DEFAULT_MARKETABLE_STATUS,
    nonDefaultStatusCount,
    missingPhotoCount,
    resultCount: listings.length,
    statusContractSatisfied: nonDefaultStatusCount === 0,
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/search/listingQuality.ts
