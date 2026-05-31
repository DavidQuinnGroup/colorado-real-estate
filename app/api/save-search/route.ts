import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

type SaveSearchBody = {
  email?: unknown;
  city?: unknown;
  minPrice?: unknown;
  beds?: unknown;
  type?: unknown;
  north?: unknown;
  south?: unknown;
  east?: unknown;
  west?: unknown;
  filters?: Record<string, unknown>;
};

type ApiError = Error & {
  code?: string;
};

type ReieGoal = 'sell-optimize' | 'buy-strategy' | 'relocation-fit' | 'portfolio-review';

type Timeline = 'now' | 'ninety-days' | 'six-months' | 'research';

type IntakeSource = 'search-map' | 'city-market-page' | 'property-detail' | 'unknown';

type LeadTemperature = 'hot' | 'warm' | 'nurture';

type AlertReadiness = {
  level: 'ready' | 'watch' | 'incomplete';
  summary: string;
  blockers: string[];
  signals: string[];
};

const VALID_STRATEGIC_GOALS = new Set(['retirement-income', 'equity-growth', 'lifestyle-optimization']);

const VALID_REIE_GOALS = new Set<ReieGoal>(['sell-optimize', 'buy-strategy', 'relocation-fit', 'portfolio-review']);

const VALID_TIMELINES = new Set<Timeline>(['now', 'ninety-days', 'six-months', 'research']);

const VALID_INTAKE_SOURCES = new Set<IntakeSource>(['search-map', 'city-market-page', 'property-detail', 'unknown']);

const VALID_LEAD_TEMPERATURES = new Set<LeadTemperature>(['hot', 'warm', 'nurture']);

const REIE_GOAL_LABELS: Record<ReieGoal, string> = {
  'sell-optimize': 'Sell / Optimize',
  'buy-strategy': 'Buy Strategy',
  'relocation-fit': 'Relocation Fit',
  'portfolio-review': 'Portfolio Review',
};

const TIMELINE_LABELS: Record<Timeline, string> = {
  now: 'Now',
  'ninety-days': '90 Days',
  'six-months': '6 Months',
  research: 'Research',
};

const INTAKE_SOURCE_LABELS: Record<IntakeSource, string> = {
  'search-map': 'Search Map',
  'city-market-page': 'City Market Page',
  'property-detail': 'Property Detail',
  unknown: 'Unknown Source',
};

const MAX_NOTE_LENGTH = 500;
const MAX_CITY_LENGTH = 80;
const MAX_TYPE_LENGTH = 80;
const MAX_MARKET_SCOPE_LENGTH = 120;
const MAX_AUTHORITY_SIGNAL_LENGTH = 60;
const MAX_AUTHORITY_SIGNALS = 8;
const LOCAL_BASE_URL = 'http://localhost:3000';
let intakeSchemaReady = false;

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseBody(value: unknown): SaveSearchBody {
  if (!isRecord(value)) return {};

  return {
    email: value.email,
    city: value.city,
    minPrice: value.minPrice,
    beds: value.beds,
    type: value.type,
    north: value.north,
    south: value.south,
    east: value.east,
    west: value.west,
    filters: isRecord(value.filters) ? value.filters : undefined,
  };
}

function getString(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function getBoundedString(value: unknown, maxLength: number) {
  const text = getString(value);
  if (!text) return null;

  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function getNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null;

  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getInteger(value: unknown) {
  const parsed = getNumber(value);
  return parsed === null ? null : Math.round(parsed);
}

function getBoundedCoordinate(value: unknown, min: number, max: number) {
  const parsed = getNumber(value);
  if (parsed === null || parsed < min || parsed > max) return null;

  return parsed;
}

function getBodyValue(body: SaveSearchBody, key: keyof Omit<SaveSearchBody, 'filters'>) {
  return body[key] ?? body.filters?.[key];
}

function getStrategicGoal(body: SaveSearchBody) {
  const goal = getString(body.filters?.strategicGoal);
  return goal && VALID_STRATEGIC_GOALS.has(goal) ? goal : null;
}

function getReieGoal(body: SaveSearchBody) {
  const goal = getString(body.filters?.reieGoal);
  return goal && VALID_REIE_GOALS.has(goal as ReieGoal) ? (goal as ReieGoal) : null;
}

function getTimeline(body: SaveSearchBody) {
  const timeline = getString(body.filters?.timeline);
  return timeline && VALID_TIMELINES.has(timeline as Timeline) ? (timeline as Timeline) : null;
}

function getIntakeSource(body: SaveSearchBody): IntakeSource {
  const source = getBoundedString(body.filters?.intakeSource, 80) || 'unknown';
  return VALID_INTAKE_SOURCES.has(source as IntakeSource) ? (source as IntakeSource) : 'unknown';
}

function getNotes(body: SaveSearchBody) {
  return getBoundedString(body.filters?.notes, MAX_NOTE_LENGTH);
}

function getClientLabel(body: SaveSearchBody, key: 'reieGoalLabel' | 'timelineLabel') {
  return getBoundedString(body.filters?.[key], 80);
}

function getLeadTemperature(body: SaveSearchBody, timeline: Timeline | null): LeadTemperature {
  const temperature = getString(body.filters?.leadTemperature);

  if (temperature && VALID_LEAD_TEMPERATURES.has(temperature as LeadTemperature)) {
    return temperature as LeadTemperature;
  }

  if (timeline === 'now') return 'hot';
  if (timeline === 'ninety-days') return 'warm';
  return 'nurture';
}

function getMarketScope(body: SaveSearchBody, city: string) {
  return getBoundedString(body.filters?.marketScope, MAX_MARKET_SCOPE_LENGTH) || `${city}, Colorado`;
}

function getAuthoritySignals(body: SaveSearchBody) {
  const value = body.filters?.authoritySignals;
  if (!Array.isArray(value)) return [];

  return value
    .map((signal) => getBoundedString(signal, MAX_AUTHORITY_SIGNAL_LENGTH))
    .filter((signal): signal is string => Boolean(signal))
    .slice(0, MAX_AUTHORITY_SIGNALS);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown save-search error';
}

function buildTaskTitle(city: string, reieGoal: ReieGoal | null, timeline: Timeline | null, intakeSource: IntakeSource) {
  const goalLabel = reieGoal ? REIE_GOAL_LABELS[reieGoal] : 'Strategy Intake';
  const timelineLabel = timeline ? TIMELINE_LABELS[timeline] : 'Unstated Timing';
  const sourceLabel = INTAKE_SOURCE_LABELS[intakeSource];

  return `REIE intake: ${goalLabel} in ${city} (${timelineLabel}, ${sourceLabel})`;
}

function getTaskPriority(timeline: Timeline | null, intakeSource: IntakeSource) {
  if (timeline === 'now') return 'high';
  if (timeline === 'ninety-days') return 'medium';
  if (intakeSource === 'search-map') return 'medium';
  return 'low';
}

function getHeatScoreIncrement(timeline: Timeline | null, notes: string | null, leadTemperature: LeadTemperature) {
  if (leadTemperature === 'hot') return notes ? 22 : 20;
  if (timeline === 'now') return 18;
  if (leadTemperature === 'warm') return notes ? 15 : 13;
  if (timeline === 'ninety-days') return 12;
  if (notes) return 9;
  return 6;
}

function shouldCreateCrmTask(intakeSource: IntakeSource, reieGoal: ReieGoal | null, timeline: Timeline | null, notes: string | null) {
  return intakeSource !== 'unknown' || Boolean(reieGoal || timeline || notes);
}

function hasCompleteBounds(bounds: { north: number | null; south: number | null; east: number | null; west: number | null }) {
  return bounds.north !== null && bounds.south !== null && bounds.east !== null && bounds.west !== null;
}

function buildAlertReadiness(options: {
  city: string;
  searchType: string | null;
  minPrice: number | null;
  beds: number | null;
  bounds: {
    north: number | null;
    south: number | null;
    east: number | null;
    west: number | null;
  };
  reieGoal: ReieGoal | null;
  timeline: Timeline | null;
  notes: string | null;
  authoritySignals: string[];
}): AlertReadiness {
  const blockers = [
    !options.city ? 'City is missing.' : null,
    !options.searchType && options.minPrice === null && options.beds === null && !hasCompleteBounds(options.bounds)
      ? 'Search has no property type, price, bedroom, or map-bound criteria.'
      : null,
  ].filter((item): item is string => Boolean(item));
  const signals = [
    options.searchType ? `Type: ${options.searchType}` : null,
    options.minPrice !== null ? `Min price: ${options.minPrice}` : null,
    options.beds !== null ? `Beds: ${options.beds}` : null,
    hasCompleteBounds(options.bounds) ? 'Map bounds captured' : null,
    options.reieGoal ? `REIE goal: ${REIE_GOAL_LABELS[options.reieGoal]}` : null,
    options.timeline ? `Timeline: ${TIMELINE_LABELS[options.timeline]}` : null,
    options.notes ? 'Client notes included' : null,
    ...options.authoritySignals.slice(0, 3),
  ].filter((item): item is string => Boolean(item));

  if (blockers.length > 0) {
    return {
      level: 'incomplete',
      summary: 'Saved search was captured, but matching criteria should be strengthened before relying on automated alerts.',
      blockers,
      signals,
    };
  }

  if (!options.reieGoal || !options.timeline) {
    return {
      level: 'watch',
      summary: 'Saved search is usable for inventory matching, with limited strategic intent context.',
      blockers: [],
      signals,
    };
  }

  return {
    level: 'ready',
    summary: 'Saved search is ready for REIE matching, intake review, and alert queue monitoring.',
    blockers: [],
    signals,
  };
}

function buildOperationsCommands(savedSearchId: string) {
  return {
    terminal: 'Terminal 5',
    alertStatus: `curl -s "${LOCAL_BASE_URL}/api/process-alerts?limit=25"`,
    alertDryRun: `curl -s -X POST "${LOCAL_BASE_URL}/api/process-alerts?dryRun=true&limit=25"`,
    intakeSignals: `curl -s "${LOCAL_BASE_URL}/api/admin/intake-signals?limit=10"`,
    savedSearchReference: savedSearchId,
  };
}

async function ensureIntakeSchema() {
  if (intakeSchemaReady) return;

  await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT');
  await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT \'Lead\'');
  await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "hasPrivateAccess" BOOLEAN NOT NULL DEFAULT false');
  await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "heatScore" INTEGER NOT NULL DEFAULT 0');
  await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "aestheticTag" TEXT');
  await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "intentSchema" TEXT');
  await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "legacyGoal" TEXT');
  await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "unsubscribedAt" TIMESTAMP(3)');
  await prisma.$executeRawUnsafe('ALTER TABLE "SavedSearch" ADD COLUMN IF NOT EXISTS "type" TEXT');
  await prisma.$executeRawUnsafe('ALTER TABLE "SavedSearch" ADD COLUMN IF NOT EXISTS "north" DOUBLE PRECISION');
  await prisma.$executeRawUnsafe('ALTER TABLE "SavedSearch" ADD COLUMN IF NOT EXISTS "south" DOUBLE PRECISION');
  await prisma.$executeRawUnsafe('ALTER TABLE "SavedSearch" ADD COLUMN IF NOT EXISTS "east" DOUBLE PRECISION');
  await prisma.$executeRawUnsafe('ALTER TABLE "SavedSearch" ADD COLUMN IF NOT EXISTS "west" DOUBLE PRECISION');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CRMTask" (
      "id" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
      "leadId" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'pending',
      "priority" TEXT NOT NULL DEFAULT 'medium',
      "title" TEXT NOT NULL,
      "metadata" JSONB,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "CRMTask_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe('ALTER TABLE "CRMTask" ADD COLUMN IF NOT EXISTS "leadId" TEXT');
  await prisma.$executeRawUnsafe('ALTER TABLE "CRMTask" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT \'strategy_intake\'');
  await prisma.$executeRawUnsafe('ALTER TABLE "CRMTask" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT \'pending\'');
  await prisma.$executeRawUnsafe('ALTER TABLE "CRMTask" ADD COLUMN IF NOT EXISTS "priority" TEXT NOT NULL DEFAULT \'medium\'');
  await prisma.$executeRawUnsafe('ALTER TABLE "CRMTask" ADD COLUMN IF NOT EXISTS "title" TEXT NOT NULL DEFAULT \'REIE intake\'');
  await prisma.$executeRawUnsafe('ALTER TABLE "CRMTask" ADD COLUMN IF NOT EXISTS "metadata" JSONB');
  await prisma.$executeRawUnsafe('ALTER TABLE "CRMTask" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "UserInteraction" (
      "id" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
      "userId" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "duration" INTEGER,
      "metadata" JSONB,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "UserInteraction_pkey" PRIMARY KEY ("id")
    )
  `);
  await prisma.$executeRawUnsafe('ALTER TABLE "UserInteraction" ADD COLUMN IF NOT EXISTS "userId" TEXT');
  await prisma.$executeRawUnsafe('ALTER TABLE "UserInteraction" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT \'save_search\'');
  await prisma.$executeRawUnsafe('ALTER TABLE "UserInteraction" ADD COLUMN IF NOT EXISTS "duration" INTEGER');
  await prisma.$executeRawUnsafe('ALTER TABLE "UserInteraction" ADD COLUMN IF NOT EXISTS "metadata" JSONB');
  await prisma.$executeRawUnsafe('ALTER TABLE "UserInteraction" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP');
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'CRMTask_leadId_fkey'
      ) THEN
        ALTER TABLE "CRMTask"
          ADD CONSTRAINT "CRMTask_leadId_fkey"
          FOREIGN KEY ("leadId") REFERENCES "User"("id")
          ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$
  `);
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'UserInteraction_userId_fkey'
      ) THEN
        ALTER TABLE "UserInteraction"
          ADD CONSTRAINT "UserInteraction_userId_fkey"
          FOREIGN KEY ("userId") REFERENCES "User"("id")
          ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$
  `);

  intakeSchemaReady = true;
}

export async function POST(req: NextRequest) {
  try {
    const body = parseBody(await req.json().catch(() => null));
    const email = getString(body.email)?.toLowerCase();
    const city = getBoundedString(getBodyValue(body, 'city'), MAX_CITY_LENGTH) || 'Boulder';
    const searchType = getBoundedString(getBodyValue(body, 'type'), MAX_TYPE_LENGTH);
    const strategicGoal = getStrategicGoal(body);
    const reieGoal = getReieGoal(body);
    const timeline = getTimeline(body);
    const notes = getNotes(body);
    const intakeSource = getIntakeSource(body);
    const leadTemperature = getLeadTemperature(body, timeline);
    const heatScoreIncrement = getHeatScoreIncrement(timeline, notes, leadTemperature);
    const marketScope = getMarketScope(body, city);
    const authoritySignals = getAuthoritySignals(body);
    const clientReieGoalLabel = getClientLabel(body, 'reieGoalLabel');
    const clientTimelineLabel = getClientLabel(body, 'timelineLabel');
    const minPrice = getInteger(getBodyValue(body, 'minPrice'));
    const beds = getInteger(getBodyValue(body, 'beds'));
    const north = getBoundedCoordinate(getBodyValue(body, 'north'), -90, 90);
    const south = getBoundedCoordinate(getBodyValue(body, 'south'), -90, 90);
    const east = getBoundedCoordinate(getBodyValue(body, 'east'), -180, 180);
    const west = getBoundedCoordinate(getBodyValue(body, 'west'), -180, 180);

    if (!email || !isValidEmail(email)) {
      return jsonResponse({ error: 'A valid email address is required.' }, 400);
    }

    await ensureIntakeSchema();

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { email },
        update: {
          isUnsubscribed: false,
          unsubscribedAt: null,
          heatScore: {
            increment: heatScoreIncrement,
          },
          legacyGoal: strategicGoal ?? undefined,
          intentSchema: intakeSource,
        },
        create: {
          email,
          status: 'Lead',
          heatScore: heatScoreIncrement,
          legacyGoal: strategicGoal,
          intentSchema: intakeSource,
        },
      });

      const savedSearch = await tx.savedSearch.create({
        data: {
          userId: user.id,
          city,
          minPrice,
          beds,
          type: searchType,
          north,
          south,
          east,
          west,
          isActive: true,
        },
      });

      const metadata = {
        schemaVersion: 'reie-save-search-v2',
        capturedAt: new Date().toISOString(),
        city,
        savedSearchId: savedSearch.id,
        strategicGoal,
        reieGoal,
        reieGoalLabel: reieGoal ? REIE_GOAL_LABELS[reieGoal] : null,
        clientReieGoalLabel,
        timeline,
        timelineLabel: timeline ? TIMELINE_LABELS[timeline] : null,
        clientTimelineLabel,
        leadTemperature,
        heatScoreIncrement,
        marketScope,
        authoritySignals,
        notes,
        searchType,
        minPrice,
        beds,
        bounds: {
          north,
          south,
          east,
          west,
        },
        source: intakeSource,
        sourceLabel: INTAKE_SOURCE_LABELS[intakeSource],
        alertReadiness: buildAlertReadiness({
          city,
          searchType,
          minPrice,
          beds,
          bounds: {
            north,
            south,
            east,
            west,
          },
          reieGoal,
          timeline,
          notes,
          authoritySignals,
        }),
      };

      const [interaction] = await tx.$queryRaw<{ id: string }[]>`
        INSERT INTO "UserInteraction" ("userId", "type", "metadata")
        VALUES (${user.id}, 'save_search', ${JSON.stringify(metadata)}::jsonb)
        RETURNING "id"::text AS "id"
      `;

      const [crmTask] = shouldCreateCrmTask(intakeSource, reieGoal, timeline, notes)
        ? await tx.$queryRaw<{ id: string }[]>`
            INSERT INTO "CRMTask" ("leadId", "type", "priority", "title", "metadata")
            VALUES (
              ${user.id},
              'strategy_intake',
              ${getTaskPriority(timeline, intakeSource)},
              ${buildTaskTitle(city, reieGoal, timeline, intakeSource)},
              ${JSON.stringify(metadata)}::jsonb
            )
            RETURNING "id"::text AS "id"
          `
        : [null];

      return {
        user,
        savedSearch,
        crmTask,
        interaction,
      };
    });

    return jsonResponse({
      success: true,
      userId: result.user.id,
      savedSearchId: result.savedSearch.id,
      crmTaskId: result.crmTask?.id ?? null,
      interactionId: result.interaction.id,
      intake: {
        city,
        marketScope,
        source: intakeSource,
        sourceLabel: INTAKE_SOURCE_LABELS[intakeSource],
        reieGoal,
        reieGoalLabel: clientReieGoalLabel || (reieGoal ? REIE_GOAL_LABELS[reieGoal] : null),
        timeline,
        timelineLabel: clientTimelineLabel || (timeline ? TIMELINE_LABELS[timeline] : null),
        leadTemperature,
        heatScoreIncrement,
        authoritySignals,
      },
      alertReadiness: buildAlertReadiness({
        city,
        searchType,
        minPrice,
        beds,
        bounds: {
          north,
          south,
          east,
          west,
        },
        reieGoal,
        timeline,
        notes,
        authoritySignals,
      }),
      operations: buildOperationsCommands(result.savedSearch.id),
    });
  } catch (error) {
    const typedError = error as ApiError;
    console.error('Save search failed:', {
      code: typedError.code,
      message: getErrorMessage(error),
    });

    return jsonResponse({ error: 'Unable to save this search right now.' }, 500);
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/save-search/route.ts
