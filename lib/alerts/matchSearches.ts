import { Prisma } from '@prisma/client';

import { enqueueAlert } from '../queue/enqueueAlert.js';
import { prisma } from '../prisma.js';

type SearchWithUser = {
  id: string;
  userId: string;
  city: string;
  minPrice: number | null;
  beds: number | null;
  type: string | null;
  north: number | null;
  south: number | null;
  east: number | null;
  west: number | null;
  user: {
    id: string;
    email: string;
    isUnsubscribed: boolean;
  } | null;
};

export type AlertMatchProperty = {
  id?: unknown;
  mlsId?: unknown;
  slug?: unknown;
  address?: unknown;
  city?: unknown;
  state?: unknown;
  price?: unknown;
  beds?: unknown;
  baths?: unknown;
  sqft?: unknown;
  propertyType?: unknown;
  image?: unknown;
  lat?: unknown;
  lng?: unknown;
  efficiencyScore?: unknown;
  resilienceScore?: unknown;
  altitude?: unknown;
  soilType?: unknown;
  hasPolybutyleneRisk?: unknown;
};

export type AlertMatchSummary = {
  scannedSearches: number;
  matchedSearches: number;
  queuedAlerts: number;
  queuedAlertJobs: number;
  skippedAlertJobs: number;
  skippedDuplicates: number;
  skippedUsers: number;
  skippedInvalidProperty: number;
};

const ALERT_TYPE = 'NEW_LISTING';
const DEFAULT_MAX_SEARCHES = 5000;

function toPositiveInteger(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.floor(parsed), min), max);
}

function getMaxSearches() {
  return toPositiveInteger(process.env.ALERT_MATCH_MAX_SEARCHES, DEFAULT_MAX_SEARCHES, 1, 25000);
}

function toCleanString(value: unknown, fallback = '') {
  if (value === undefined || value === null) return fallback;

  const cleaned = String(value).trim();
  return cleaned || fallback;
}

function toNumber(value: unknown) {
  if (value === undefined || value === null || value === '') return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function sameValue(left: unknown, right: unknown) {
  return toCleanString(left).toLowerCase() === toCleanString(right).toLowerCase();
}

function hasCompleteBounds(search: SearchWithUser) {
  return search.north !== null && search.south !== null && search.east !== null && search.west !== null;
}

function matchesBounds(search: SearchWithUser, property: AlertMatchProperty) {
  if (!hasCompleteBounds(search)) return true;

  const lat = toNumber(property.lat);
  const lng = toNumber(property.lng);

  if (lat === null || lng === null) return false;

  return lat <= search.north! && lat >= search.south! && lng <= search.east! && lng >= search.west!;
}

function matchesSearch(search: SearchWithUser, property: AlertMatchProperty) {
  const propertyPrice = toNumber(property.price) ?? 0;
  const propertyBeds = toNumber(property.beds) ?? 0;

  if (!sameValue(search.city, property.city)) return false;
  if (search.minPrice !== null && propertyPrice < search.minPrice) return false;
  if (search.beds !== null && propertyBeds < search.beds) return false;
  if (search.type && !sameValue(search.type, property.propertyType)) return false;

  return matchesBounds(search, property);
}

function getPublicBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://davidquinngroup.com';
  return configuredUrl.replace(/\/+$/, '');
}

function isValidProperty(property: AlertMatchProperty) {
  return Boolean(property.id && property.city);
}

function isJsonPrimitive(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function addOptionalPayloadValue(payload: Record<string, Prisma.InputJsonValue>, key: string, value: unknown) {
  if (value === undefined || value === null || value === '') return;

  if (isJsonPrimitive(value)) {
    payload[key] = value;
    return;
  }

  payload[key] = String(value);
}

function buildAlertPayload(property: AlertMatchProperty): Prisma.InputJsonObject {
  const identity = toCleanString(property.slug || property.id || property.mlsId);
  const propertyUrl = identity
    ? `${getPublicBaseUrl()}/properties/${encodeURIComponent(identity)}`
    : `${getPublicBaseUrl()}/search`;
  const payload: Record<string, Prisma.InputJsonValue> = {
    id: String(property.id),
    propertyId: String(property.id),
    address: toCleanString(property.address, 'Colorado property'),
    city: toCleanString(property.city, 'Colorado'),
    state: toCleanString(property.state, 'CO'),
    price: toNumber(property.price) ?? 0,
    url: propertyUrl,
  };

  addOptionalPayloadValue(payload, 'mlsId', property.mlsId);
  addOptionalPayloadValue(payload, 'slug', property.slug);
  addOptionalPayloadValue(payload, 'beds', toNumber(property.beds));
  addOptionalPayloadValue(payload, 'baths', toNumber(property.baths));
  addOptionalPayloadValue(payload, 'sqft', toNumber(property.sqft));
  addOptionalPayloadValue(payload, 'propertyType', property.propertyType);
  addOptionalPayloadValue(payload, 'image', property.image);
  addOptionalPayloadValue(payload, 'efficiencyScore', toNumber(property.efficiencyScore));
  addOptionalPayloadValue(payload, 'resilienceScore', toNumber(property.resilienceScore));
  addOptionalPayloadValue(payload, 'altitude', toNumber(property.altitude));
  addOptionalPayloadValue(payload, 'soilType', property.soilType);
  addOptionalPayloadValue(payload, 'hasPolybutyleneRisk', property.hasPolybutyleneRisk);

  return payload;
}

async function fetchCandidateSearches(property: AlertMatchProperty): Promise<SearchWithUser[]> {
  const city = toCleanString(property.city);

  if (!city) return [];

  return prisma.savedSearch.findMany({
    where: {
      isActive: true,
      city: {
        equals: city,
        mode: 'insensitive',
      },
      user: {
        is: {
          isUnsubscribed: false,
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          isUnsubscribed: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: getMaxSearches(),
  });
}

function isDuplicateError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

async function queueAlert(search: SearchWithUser, property: AlertMatchProperty, payload: Prisma.InputJsonObject) {
  try {
    const [, alertQueueRecord] = await prisma.$transaction([
      prisma.alertEvent.create({
        data: {
          userId: search.userId,
          propertyId: String(property.id),
          type: ALERT_TYPE,
        },
      }),
      prisma.alertQueue.create({
        data: {
          userId: search.userId,
          payload,
          status: 'pending',
        },
      }),
    ]);

    try {
      await enqueueAlert(alertQueueRecord.id, {
        requestedBy: `saved-search:${search.id}`,
        source: 'matching',
      });

      return 'queued_with_job' as const;
    } catch (error) {
      console.warn('Saved-search alert queued in Postgres but BullMQ enqueue failed:', {
        alertQueueId: alertQueueRecord.id,
        searchId: search.id,
        message: error instanceof Error ? error.message : String(error),
      });

      return 'queued_without_job' as const;
    }
  } catch (error) {
    if (isDuplicateError(error)) return 'duplicate' as const;
    throw error;
  }
}

function emptySummary(): AlertMatchSummary {
  return {
    scannedSearches: 0,
    matchedSearches: 0,
    queuedAlerts: 0,
    queuedAlertJobs: 0,
    skippedAlertJobs: 0,
    skippedDuplicates: 0,
    skippedUsers: 0,
    skippedInvalidProperty: 0,
  };
}

export async function matchAndNotify(property: AlertMatchProperty): Promise<AlertMatchSummary> {
  const summary = emptySummary();

  if (!isValidProperty(property)) {
    summary.skippedInvalidProperty = 1;
    console.warn('Saved-search matching skipped because property is missing id or city.');
    return summary;
  }

  const candidateSearches = await fetchCandidateSearches(property);
  const payload = buildAlertPayload(property);

  summary.scannedSearches = candidateSearches.length;

  for (const search of candidateSearches) {
    if (!matchesSearch(search, property)) continue;

    summary.matchedSearches++;

    if (!search.user?.email || search.user.isUnsubscribed) {
      summary.skippedUsers++;
      continue;
    }

    const result = await queueAlert(search, property, payload);

    if (result === 'duplicate') {
      summary.skippedDuplicates++;
      continue;
    }

    summary.queuedAlerts++;
    if (result === 'queued_with_job') {
      summary.queuedAlertJobs++;
    } else {
      summary.skippedAlertJobs++;
    }
  }

  console.log('Saved-search match summary:', summary);
  return summary;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/matchSearches.ts
