import { LISTING_COLLECTION_NAME, PROPERTY_COLLECTION_NAME, SEARCH_SCHEMA_REQUIRED_FIELD_NAMES, typesense } from './schema.js';

type ListingIndexInput = Record<string, unknown>;

export type ListingIndexDocument = {
  id: string;
  address: string;
  city: string;
  price: number;
  status: string;
  neighborhood: string;
  isPrivateExclusive: boolean;
  efficiencyScore: number;
  resilienceScore: number;
  altitude: number;
  soilType: string;
  roofType: string;
  hasPolybutyleneRisk: boolean;
  mlsId?: string;
  slug?: string;
  state?: string;
  zip?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  lotSize?: number;
  yearBuilt?: number;
  propertyType?: string;
  subdivision?: string;
  schoolDistrict?: string;
  listingAgent?: string;
  listingOffice?: string;
  description?: string;
  lat?: number;
  lng?: number;
  location?: [number, number];
  createdAt?: number;
  updatedAt?: number;
};

type ListingIndexResult = {
  indexed: boolean;
  documentId: string;
  collections: {
    properties: boolean;
    listings: boolean;
  };
  error?: string;
};

const TARGET_COLLECTIONS = [PROPERTY_COLLECTION_NAME, LISTING_COLLECTION_NAME] as const;
const MIN_INT32 = -2147483648;
const MAX_INT32 = 2147483647;
const MIN_SAFE_INT = Number.MIN_SAFE_INTEGER;
const MAX_SAFE_INT = Number.MAX_SAFE_INTEGER;

function firstValue(...values: unknown[]) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== '') return value;
  }

  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getNestedValue(source: unknown, key: string) {
  if (!isRecord(source)) return undefined;

  return source[key];
}

function toCleanString(value: unknown, fallback = '') {
  if (value === undefined || value === null) return fallback;

  const cleaned = String(value).trim();
  return cleaned || fallback;
}

function toOptionalString(value: unknown) {
  const cleaned = toCleanString(value);
  return cleaned || undefined;
}

function toNumber(value: unknown) {
  if (value === undefined || value === null || value === '') return undefined;

  const parsed = Number(String(value).replace(/[$,]/g, ''));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toInteger(value: unknown) {
  const parsed = toNumber(value);
  return parsed === undefined ? undefined : Math.round(parsed);
}

function toInt32(value: unknown, fallback?: number) {
  const parsed = toInteger(value);
  const valueOrFallback = parsed === undefined ? fallback : parsed;
  if (valueOrFallback === undefined) return undefined;

  return Math.min(Math.max(valueOrFallback, MIN_INT32), MAX_INT32);
}

function toInt64(value: unknown, fallback?: number) {
  const parsed = toInteger(value);
  const valueOrFallback = parsed === undefined ? fallback : parsed;
  if (valueOrFallback === undefined) return undefined;

  return Math.min(Math.max(valueOrFallback, MIN_SAFE_INT), MAX_SAFE_INT);
}

function toBoundedScore(value: unknown, fallback = 0) {
  const parsed = toInt32(value, fallback) ?? fallback;
  return Math.min(Math.max(parsed, 0), 100);
}

function toBoolean(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
    if (['false', '0', 'no', 'n'].includes(normalized)) return false;
  }

  return fallback;
}

function toEpochMilliseconds(value: unknown) {
  if (value instanceof Date) return value.getTime();

  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.round(value);
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function getCreatedAt(listing: ListingIndexInput) {
  return toEpochMilliseconds(
    firstValue(
      listing.createdAt,
      listing.CreatedAt,
      listing.ListingContractDate,
      listing.OriginalEntryTimestamp,
      listing.OnMarketDate,
      listing.inputDate,
      listing.InputDate,
    ),
  );
}

function getUpdatedAt(listing: ListingIndexInput, createdAt?: number) {
  return (
    toEpochMilliseconds(
      firstValue(
        listing.updatedAt,
        listing.UpdatedAt,
        listing.ModificationTimestamp,
        listing.ListingModificationTimestamp,
        listing.MajorChangeTimestamp,
        listing.StatusChangeTimestamp,
        listing.PriceChangeTimestamp,
        listing.CloseDate,
      ),
    ) ??
    createdAt ??
    Date.now()
  );
}

function getGcForensics(listing: ListingIndexInput) {
  const value = firstValue(listing.gcForensics, listing.GCForensics, listing.forensics);
  return isRecord(value) ? value : {};
}

function getBathCount(listing: ListingIndexInput) {
  const explicitBaths = toNumber(
    firstValue(
      listing.baths,
      listing.BathroomsTotalInteger,
      listing.BathroomsTotalDecimal,
      listing.BathroomsTotal,
      listing.BathsTotal,
    ),
  );

  if (explicitBaths !== undefined) return explicitBaths;

  const full = toNumber(listing.BathroomsFull) ?? 0;
  const half = toNumber(listing.BathroomsHalf) ?? 0;
  const threeQuarter = toNumber(listing.BathroomsThreeQuarter) ?? 0;
  const oneQuarter = toNumber(listing.BathroomsOneQuarter) ?? 0;
  const calculated = full + half * 0.5 + threeQuarter * 0.75 + oneQuarter * 0.25;

  return calculated || undefined;
}

function getAddress(listing: ListingIndexInput) {
  const streetParts = [
    listing.StreetNumber,
    listing.StreetDirPrefix,
    listing.StreetName,
    listing.StreetSuffix,
    listing.StreetDirSuffix,
    listing.UnitNumber ? `Unit ${listing.UnitNumber}` : undefined,
  ]
    .map((part) => toCleanString(part))
    .filter(Boolean);

  return toCleanString(
    firstValue(
      listing.address,
      listing.UnparsedAddress,
      listing.FullAddress,
      listing.StreetAddress,
      streetParts.length ? streetParts.join(' ') : undefined,
    ),
    'Address unavailable',
  );
}

function getMlsId(listing: ListingIndexInput) {
  return toOptionalString(
    firstValue(
      listing.mlsId,
      listing.mls_id,
      listing.ListingKey,
      listing.ListingId,
      listing.MlsId,
      listing.MLSNumber,
      listing.ListingNumber,
      listing.Id,
      listing.mlsid,
    ),
  );
}

function getLatLng(listing: ListingIndexInput) {
  const lat = toNumber(
    firstValue(
      listing.lat,
      listing.latitude,
      listing.Latitude,
      getNestedValue(listing.PropertyLocation, 'Latitude'),
      getNestedValue(listing.Coordinates, 'Latitude'),
    ),
  );
  const lng = toNumber(
    firstValue(
      listing.lng,
      listing.longitude,
      listing.Longitude,
      getNestedValue(listing.PropertyLocation, 'Longitude'),
      getNestedValue(listing.Coordinates, 'Longitude'),
    ),
  );
  const isValidLocation =
    lat !== undefined &&
    lng !== undefined &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180 &&
    !(lat === 0 && lng === 0);

  return {
    lat: isValidLocation ? lat : undefined,
    lng: isValidLocation ? lng : undefined,
    location: isValidLocation ? ([lat, lng] as [number, number]) : undefined,
  };
}

function getNeighborhood(listing: ListingIndexInput) {
  return toCleanString(
    firstValue(listing.neighborhood, listing.Neighborhood, listing.MLSAreaMajor, listing.Area, listing.SubdivisionName),
    'Unassigned',
  );
}

function getListingAgent(listing: ListingIndexInput) {
  const fullName = firstValue(listing.listingAgent, listing.ListAgentFullName, listing.ListingAgentName, listing.AgentName);
  if (fullName) return toOptionalString(fullName);

  const firstName = toCleanString(firstValue(listing.ListAgentFirstName, listing.AgentFirstName));
  const lastName = toCleanString(firstValue(listing.ListAgentLastName, listing.AgentLastName));
  const joined = `${firstName} ${lastName}`.trim();

  return joined || undefined;
}

function withoutUndefined<T extends Record<string, unknown>>(document: T) {
  return Object.fromEntries(Object.entries(document).filter(([, value]) => value !== undefined)) as T;
}

function assertRequiredSearchFields(document: ListingIndexDocument) {
  const missingFields = SEARCH_SCHEMA_REQUIRED_FIELD_NAMES.filter((fieldName) => {
    const value = document[fieldName as keyof ListingIndexDocument];
    return value === undefined || value === null || value === '';
  });

  if (missingFields.length) {
    throw new Error(`Listing ${document.id || 'unknown'} cannot be indexed without required field(s): ${missingFields.join(', ')}.`);
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getCollectionResult(results: PromiseSettledResult<unknown>[], collectionName: (typeof TARGET_COLLECTIONS)[number]) {
  const index = TARGET_COLLECTIONS.indexOf(collectionName);
  return results[index]?.status === 'fulfilled';
}

function getFailedCollectionMessages(results: PromiseSettledResult<unknown>[], documentId: string) {
  return results.flatMap((result, index) => {
    if (result.status === 'fulfilled') return [];

    const collectionName = TARGET_COLLECTIONS[index] || 'unknown';
    return `${collectionName}: ${errorMessage(result.reason)} for ${documentId}`;
  });
}

export function toListingDocument(listing: ListingIndexInput): ListingIndexDocument {
  const mlsId = getMlsId(listing);
  const id = toCleanString(firstValue(listing.id, mlsId));
  const { lat, lng, location } = getLatLng(listing);
  const gcForensics = getGcForensics(listing);
  const createdAt = getCreatedAt(listing);
  const updatedAt = getUpdatedAt(listing, createdAt);

  if (!id) {
    throw new Error('Listing cannot be indexed without an id or MLS id.');
  }

  const document = withoutUndefined({
    id,
    mlsId,
    slug: toOptionalString(listing.slug),
    address: getAddress(listing),
    city: toCleanString(firstValue(listing.city, listing.City), 'Unknown City'),
    state: toCleanString(firstValue(listing.state, listing.StateOrProvince, listing.State), 'CO'),
    zip: toOptionalString(firstValue(listing.zip, listing.PostalCode, listing.Zip)),
    price: toInt64(firstValue(listing.price, listing.ListPrice, listing.CurrentPrice), 0) ?? 0,
    beds: toNumber(firstValue(listing.beds, listing.BedroomsTotal, listing.BedsTotal)),
    baths: getBathCount(listing),
    sqft: toInt32(firstValue(listing.sqft, listing.LivingArea, listing.BuildingAreaTotal, listing.AboveGradeFinishedArea)),
    lotSize: toNumber(firstValue(listing.lotSize, listing.LotSizeAcres, listing.LotSizeArea, listing.LotAcres)),
    yearBuilt: toInt32(firstValue(listing.yearBuilt, listing.YearBuilt, listing.EffectiveYearBuilt)),
    propertyType: toOptionalString(
      firstValue(listing.propertyType, listing.property_type, listing.PropertyType, listing.PropertySubType),
    ),
    status: toCleanString(firstValue(listing.status, listing.StandardStatus, listing.MlsStatus), 'Active'),
    neighborhood: getNeighborhood(listing),
    subdivision: toOptionalString(firstValue(listing.subdivision, listing.SubdivisionName, listing.Subdivision)),
    schoolDistrict: toOptionalString(
      firstValue(listing.schoolDistrict, listing.HighSchoolDistrict, listing.SchoolDistrict, listing.ElementarySchoolDistrict),
    ),
    listingAgent: getListingAgent(listing),
    listingOffice: toOptionalString(firstValue(listing.listingOffice, listing.ListOfficeName, listing.ListingOfficeName)),
    description: toOptionalString(firstValue(listing.description, listing.PublicRemarks, listing.PrivateRemarks)),
    lat,
    lng,
    location,
    isPrivateExclusive: toBoolean(listing.isPrivateExclusive),
    efficiencyScore: toBoundedScore(listing.efficiencyScore),
    resilienceScore: toBoundedScore(listing.resilienceScore),
    altitude: toInt32(firstValue(listing.altitude, listing.Elevation, gcForensics.altitude), 0) ?? 0,
    soilType: toCleanString(firstValue(listing.soilType, gcForensics.soilType), 'Unknown'),
    roofType: toCleanString(firstValue(listing.roofType, gcForensics.roofType), 'Unknown'),
    hasPolybutyleneRisk: toBoolean(firstValue(listing.hasPolybutyleneRisk, gcForensics.hasPolybutyleneRisk)),
    createdAt,
    updatedAt,
  });

  assertRequiredSearchFields(document);
  return document;
}

export async function indexListing(listing: ListingIndexInput): Promise<ListingIndexResult> {
  const document = toListingDocument(listing);
  const results = await Promise.allSettled(
    TARGET_COLLECTIONS.map((collectionName) => typesense.collections(collectionName).documents().upsert(document)),
  );
  const properties = getCollectionResult(results, PROPERTY_COLLECTION_NAME);
  const listings = getCollectionResult(results, LISTING_COLLECTION_NAME);
  const failedMessages = getFailedCollectionMessages(results, document.id);

  if (failedMessages.length) {
    console.error(`Typesense listing index failed for ${document.id}: ${failedMessages.join('; ')}`);
  }

  return {
    indexed: properties && listings,
    documentId: document.id,
    collections: {
      properties,
      listings,
    },
    error: failedMessages.length ? failedMessages.join('; ') : undefined,
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexListing.ts
