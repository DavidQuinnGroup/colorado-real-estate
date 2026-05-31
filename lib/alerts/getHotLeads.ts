import { prisma } from '../prisma';

type HotLeadOptions = {
  limit?: number;
  days?: number;
};

type AlertPayload = {
  id?: unknown;
  propertyId?: unknown;
  listingId?: unknown;
  mlsId?: unknown;
  slug?: unknown;
  address?: unknown;
  city?: unknown;
  state?: unknown;
  price?: unknown;
  beds?: unknown;
};

export type HotLead = {
  alertId: string;
  userId: string;
  email: string;
  name: string | null;
  heatScore: number;
  clickedAt: Date;
  score: number;
  listing: {
    id: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    price: number | null;
    beds: number | null;
  };
};

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;
const RECENT_CLICK_WEIGHT = 35;
const HEAT_SCORE_WEIGHT = 50;
const LISTING_CONTEXT_WEIGHT = 15;

function clampInteger(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;

  return Math.min(Math.max(Math.floor(parsed), min), max);
}

function getSinceDate(days: number) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return since;
}

function isPayload(value: unknown): value is AlertPayload {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function normalizeText(value: unknown) {
  const normalized = String(value ?? '').replace(/\s+/g, ' ').trim();
  return normalized || null;
}

function normalizeNumber(value: unknown) {
  if (value === undefined || value === null || value === '') return null;

  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return null;

  return parsed;
}

function normalizePrice(value: unknown) {
  const parsed = normalizeNumber(value);
  if (parsed === null || parsed <= 0) return null;

  return Math.round(parsed);
}

function normalizeBeds(value: unknown) {
  const parsed = normalizeNumber(value);
  if (parsed === null || parsed < 0) return null;

  return Math.round(parsed);
}

function getListing(payload: unknown): HotLead['listing'] {
  if (!isPayload(payload)) {
    return {
      id: null,
      address: null,
      city: null,
      state: null,
      price: null,
      beds: null,
    };
  }

  return {
    id:
      normalizeText(payload.propertyId) ||
      normalizeText(payload.id) ||
      normalizeText(payload.listingId) ||
      normalizeText(payload.mlsId) ||
      normalizeText(payload.slug),
    address: normalizeText(payload.address),
    city: normalizeText(payload.city),
    state: normalizeText(payload.state) || 'CO',
    price: normalizePrice(payload.price),
    beds: normalizeBeds(payload.beds),
  };
}

function scoreRecentClick(clickedAt: Date) {
  const ageHours = Math.max(0, (Date.now() - clickedAt.getTime()) / 36e5);
  if (ageHours <= 24) return RECENT_CLICK_WEIGHT;
  if (ageHours <= 72) return Math.round(RECENT_CLICK_WEIGHT * 0.8);
  if (ageHours <= 168) return Math.round(RECENT_CLICK_WEIGHT * 0.55);

  return Math.round(RECENT_CLICK_WEIGHT * 0.25);
}

function scoreHeat(heatScore: number) {
  return Math.min(Math.max(heatScore, 0), 100) * (HEAT_SCORE_WEIGHT / 100);
}

function scoreListingContext(listing: HotLead['listing']) {
  let score = 0;
  if (listing.id) score += 4;
  if (listing.address) score += 4;
  if (listing.city) score += 3;
  if (listing.price) score += 2;
  if (listing.beds !== null) score += 2;

  return Math.min(score, LISTING_CONTEXT_WEIGHT);
}

function scoreLead(clickedAt: Date, heatScore: number, listing: HotLead['listing']) {
  return Math.round(scoreRecentClick(clickedAt) + scoreHeat(heatScore) + scoreListingContext(listing));
}

export async function getHotLeads(options: HotLeadOptions = {}): Promise<HotLead[]> {
  const limit = clampInteger(options.limit, DEFAULT_LIMIT, 1, MAX_LIMIT);
  const days = clampInteger(options.days, DEFAULT_DAYS, 1, MAX_DAYS);
  const since = getSinceDate(days);

  const clickedAlerts = await prisma.alertQueue.findMany({
    where: {
      clickedAt: {
        gte: since,
      },
      user: {
        isUnsubscribed: false,
      },
    },
    orderBy: [
      {
        clickedAt: 'desc',
      },
      {
        createdAt: 'desc',
      },
    ],
    take: limit * 3,
    select: {
      id: true,
      userId: true,
      clickedAt: true,
      payload: true,
      user: {
        select: {
          email: true,
          name: true,
          heatScore: true,
        },
      },
    },
  });

  return clickedAlerts
    .filter((alert): alert is typeof alert & { clickedAt: Date } => Boolean(alert.clickedAt))
    .map((alert) => {
      const listing = getListing(alert.payload);
      const heatScore = alert.user.heatScore || 0;

      return {
        alertId: alert.id,
        userId: alert.userId,
        email: alert.user.email,
        name: alert.user.name,
        heatScore,
        clickedAt: alert.clickedAt,
        score: scoreLead(alert.clickedAt, heatScore, listing),
        listing,
      };
    })
    .sort((left, right) => right.score - left.score || right.clickedAt.getTime() - left.clickedAt.getTime())
    .slice(0, limit);
}

// lib/alerts/getHotLeads.ts
