import { prisma } from '../prisma';

type ListingPayload = {
  price?: unknown;
  beds?: unknown;
  city?: unknown;
};

type PreferenceSummary = {
  updated: boolean;
  userId: string;
  clickedAlerts: number;
  usableAlerts: number;
  avgPrice: number | null;
  avgBeds: number | null;
  topCities: string[];
  reason?: string;
};

const MAX_CLICKED_ALERTS = 1000;
const MAX_TOP_CITIES = 5;
const MIN_REASONABLE_PRICE = 25000;
const MAX_REASONABLE_PRICE = 100000000;
const MIN_REASONABLE_BEDS = 0;
const MAX_REASONABLE_BEDS = 25;

function emptySummary(userId: string, reason: string): PreferenceSummary {
  return {
    updated: false,
    userId,
    clickedAlerts: 0,
    usableAlerts: 0,
    avgPrice: null,
    avgBeds: null,
    topCities: [],
    reason,
  };
}

function normalizeNumber(value: unknown) {
  if (value === undefined || value === null || value === '') return null;

  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return null;

  return parsed;
}

function normalizePrice(value: unknown) {
  const parsed = normalizeNumber(value);
  if (parsed === null) return null;
  if (parsed < MIN_REASONABLE_PRICE || parsed > MAX_REASONABLE_PRICE) return null;

  return Math.round(parsed);
}

function normalizeBeds(value: unknown) {
  const parsed = normalizeNumber(value);
  if (parsed === null) return null;
  if (parsed < MIN_REASONABLE_BEDS || parsed > MAX_REASONABLE_BEDS) return null;

  return Math.round(parsed);
}

function normalizeCity(value: unknown) {
  const city = String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!city) return null;
  if (city.length > 80) return null;

  return city;
}

function isListingPayload(value: unknown): value is ListingPayload {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function average(values: number[]) {
  if (!values.length) return null;

  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round(total / values.length);
}

function getTopCities(cityCounts: Map<string, number>) {
  return [...cityCounts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, MAX_TOP_CITIES)
    .map(([city]) => city);
}

export async function updateUserPreferences(userId: string): Promise<PreferenceSummary> {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    return emptySummary('', 'Missing user id.');
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: normalizedUserId,
      },
      select: {
        id: true,
        isUnsubscribed: true,
      },
    });

    if (!user) {
      return emptySummary(normalizedUserId, 'User not found.');
    }

    if (user.isUnsubscribed) {
      return emptySummary(normalizedUserId, 'User is unsubscribed.');
    }

    const clickedAlerts = await prisma.alertQueue.findMany({
      where: {
        userId: normalizedUserId,
        clickedAt: {
          not: null,
        },
      },
      orderBy: {
        clickedAt: 'desc',
      },
      take: MAX_CLICKED_ALERTS,
      select: {
        payload: true,
      },
    });

    if (!clickedAlerts.length) {
      return emptySummary(normalizedUserId, 'No clicked alerts found.');
    }

    const prices: number[] = [];
    const beds: number[] = [];
    const cityCounts = new Map<string, number>();
    let usableAlerts = 0;

    for (const alert of clickedAlerts) {
      if (!isListingPayload(alert.payload)) continue;

      const price = normalizePrice(alert.payload.price);
      const bedCount = normalizeBeds(alert.payload.beds);
      const city = normalizeCity(alert.payload.city);

      if (price !== null) prices.push(price);
      if (bedCount !== null) beds.push(bedCount);
      if (city) cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
      if (price !== null || bedCount !== null || city) usableAlerts++;
    }

    if (usableAlerts === 0) {
      return {
        ...emptySummary(normalizedUserId, 'Clicked alerts did not contain usable preference data.'),
        clickedAlerts: clickedAlerts.length,
      };
    }

    const avgPrice = average(prices);
    const avgBeds = average(beds);
    const topCities = getTopCities(cityCounts);

    await prisma.userPreference.upsert({
      where: {
        userId: normalizedUserId,
      },
      update: {
        avgPrice,
        avgBeds,
        topCities,
      },
      create: {
        userId: normalizedUserId,
        avgPrice,
        avgBeds,
        topCities,
      },
    });

    return {
      updated: true,
      userId: normalizedUserId,
      clickedAlerts: clickedAlerts.length,
      usableAlerts,
      avgPrice,
      avgBeds,
      topCities,
    };
  } catch (error) {
    console.error('[REIE CRM] updateUserPreferences error:', error);

    return emptySummary(normalizedUserId, error instanceof Error ? error.message : 'Unknown preference update failure.');
  }
}

// lib/preferences/updateUserPreferences.ts
