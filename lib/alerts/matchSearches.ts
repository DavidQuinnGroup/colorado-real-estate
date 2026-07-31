import { Prisma } from '@prisma/client';

import {
  buildAlertPayloadIntent,
  isValidAlertProperty,
  matchesAlertSearch,
  toCleanAlertString,
} from './intent/evaluateAlertIntent.js';
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
  isActive: boolean;
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

function getPublicBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://davidquinngroup.com';
  return configuredUrl.replace(/\/+$/, '');
}

export function buildAlertPayload(property: AlertMatchProperty): Prisma.InputJsonObject {
  return buildAlertPayloadIntent(property, getPublicBaseUrl()) as Prisma.InputJsonObject;
}

async function fetchCandidateSearches(property: AlertMatchProperty): Promise<SearchWithUser[]> {
  const city = toCleanAlertString(property.city);

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

  if (!isValidAlertProperty(property)) {
    summary.skippedInvalidProperty = 1;
    console.warn('Saved-search matching skipped because property is missing id or city.');
    return summary;
  }

  const candidateSearches = await fetchCandidateSearches(property);
  const payload = buildAlertPayload(property);

  summary.scannedSearches = candidateSearches.length;

  for (const search of candidateSearches) {
    if (!matchesAlertSearch(search, property)) continue;

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
