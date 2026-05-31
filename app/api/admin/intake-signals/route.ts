import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type IntakeKind = 'crm_task' | 'interaction';

type IntakePriority = 'High' | 'Medium' | 'Watch';

type IntakeIntent = 'Buyer' | 'Seller' | 'Investor' | 'Research';

type IntakeSignal = {
  id: string;
  kind: IntakeKind;
  name: string;
  email: string;
  userId: string;
  heatScore: number;
  source: string;
  sourceLabel: string;
  area: string;
  intent: IntakeIntent;
  priority: IntakePriority;
  status: string;
  leadTemperature: string;
  heatScoreIncrement: number;
  authoritySignals: string[];
  primaryNorthStar: string | null;
  northStarCount: number;
  alertReadiness: {
    level: 'ready' | 'watch' | 'incomplete' | 'unknown';
    summary: string;
    blockers: string[];
    signals: string[];
  };
  hasNotes: boolean;
  nextAction: string;
  createdAt: string;
  metadata: Record<string, unknown>;
};

type IntakeSummary = {
  total: number;
  highPriority: number;
  crmTasks: number;
  interactions: number;
  hiddenPromotedInteractions: number;
  alertReady: number;
  alertWatch: number;
  alertIncomplete: number;
};

type IntakeSignalRow = {
  id: string;
  kind: IntakeKind;
  userId: string;
  email: string | null;
  userName: string | null;
  heatScore: number | null;
  priority: string | null;
  status: string | null;
  title: string | null;
  interactionType: string | null;
  metadata: unknown;
  createdAt: Date | string | null;
};

type PreparedSignals = {
  signals: IntakeSignal[];
  hiddenPromotedInteractions: number;
};

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

function getAdminKey() {
  return process.env.REIE_ADMIN_API_KEY || process.env.ADMIN_API_KEY || null;
}

function getRequestAdminKey(request: NextRequest) {
  const authorization = request.headers.get('authorization') || '';
  const bearerToken = authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7).trim() : '';
  return request.headers.get('x-admin-key') || bearerToken || request.nextUrl.searchParams.get('adminKey') || '';
}

function authorizeRequest(request: NextRequest) {
  const configuredKey = getAdminKey();

  if (!configuredKey) {
    return process.env.NODE_ENV !== 'production';
  }

  return getRequestAdminKey(request) === configuredKey;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error || 'Unknown intake-signal failure.');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function cleanString(value: unknown, fallback: string) {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function parseLimit(request: NextRequest) {
  const rawLimit = Number(request.nextUrl.searchParams.get('limit') || DEFAULT_LIMIT);
  if (!Number.isFinite(rawLimit)) return DEFAULT_LIMIT;
  return Math.min(Math.max(Math.floor(rawLimit), 1), MAX_LIMIT);
}

function shouldIncludePromotedInteractions(request: NextRequest) {
  const value = cleanString(request.nextUrl.searchParams.get('includePromotedInteractions'), '').toLowerCase();
  return value === '1' || value === 'true' || value === 'yes';
}

function toIsoDate(value: Date | string | null) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') {
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : new Date().toISOString();
  }
  return new Date().toISOString();
}

function getSavedSearchId(metadata: Record<string, unknown>) {
  return cleanString(metadata.savedSearchId, '');
}

function getNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .slice(0, 8);
}

function getAlertReadiness(metadata: Record<string, unknown>): IntakeSignal['alertReadiness'] {
  const alertReadiness = asRecord(metadata.alertReadiness);
  const rawLevel = cleanString(alertReadiness.level, '').toLowerCase();
  const level =
    rawLevel === 'ready' || rawLevel === 'watch' || rawLevel === 'incomplete'
      ? rawLevel
      : 'unknown';

  return {
    level,
    summary: cleanString(alertReadiness.summary, level === 'unknown' ? 'Alert readiness was not recorded for this intake.' : ''),
    blockers: getStringArray(alertReadiness.blockers),
    signals: getStringArray(alertReadiness.signals),
  };
}

function getIntent(metadata: Record<string, unknown>): IntakeIntent {
  const goal = cleanString(metadata.reieGoal, '');

  if (goal === 'sell-optimize') return 'Seller';
  if (goal === 'buy-strategy' || goal === 'relocation-fit') return 'Buyer';
  if (goal === 'portfolio-review') return 'Investor';
  return 'Research';
}

function getPriority(row: IntakeSignalRow, metadata: Record<string, unknown>): IntakePriority {
  const priority = cleanString(row.priority, '').toLowerCase();
  const timeline = cleanString(metadata.timeline, '').toLowerCase();
  const leadTemperature = cleanString(metadata.leadTemperature, '').toLowerCase();

  if (leadTemperature === 'hot') return 'High';
  if (priority === 'high' || timeline === 'now') return 'High';
  if (leadTemperature === 'warm') return 'Medium';
  if (priority === 'medium' || timeline === 'ninety-days') return 'Medium';
  return 'Watch';
}

function getArea(metadata: Record<string, unknown>) {
  const marketScope = cleanString(metadata.marketScope, '');
  const city = cleanString(metadata.city, '');
  const searchType = cleanString(metadata.searchType, '');

  if (marketScope && searchType) return `${marketScope} / ${searchType}`;
  if (marketScope) return marketScope;
  if (city && searchType) return `${city} / ${searchType}`;
  if (city) return city;
  return 'Colorado market';
}

function getName(row: IntakeSignalRow, metadata: Record<string, unknown>) {
  if (row.kind === 'crm_task') return cleanString(row.title, 'REIE strategy intake');

  const sourceLabel = cleanString(metadata.sourceLabel, 'Search Activity');
  const reieGoalLabel = cleanString(metadata.reieGoalLabel, 'Strategy Intake');
  return `${sourceLabel}: ${reieGoalLabel}`;
}

function getNextAction(row: IntakeSignalRow, metadata: Record<string, unknown>, priority: IntakePriority) {
  const metadataNextAction = cleanString(metadata.nextAction, '');
  if (metadataNextAction) return metadataNextAction;

  const leadTemperature = cleanString(metadata.leadTemperature, '').toLowerCase();
  const alertReadiness = getAlertReadiness(metadata);

  if (alertReadiness.level === 'incomplete') {
    return 'Strengthen saved-search criteria before relying on automated alert matching.';
  }

  if (row.kind === 'crm_task') {
    if (row.status === 'completed') return 'No action required; task is completed.';
    if (row.status === 'dismissed') return 'No action required; signal was dismissed.';
    if (leadTemperature === 'hot') return 'Review immediately; hot REIE intake with direct outreach priority.';
    if (alertReadiness.level === 'ready' && priority === 'High') return 'Review immediately; alert-ready intake has high outreach priority.';
    if (priority === 'High') return 'Review immediately and assign direct outreach.';
    if (priority === 'Medium') return 'Review context and prepare strategy follow-up.';
    return 'Monitor for repeat behavior before outreach.';
  }

  const notes = cleanString(metadata.notes, '');
  if (notes) return 'Review notes and promote to CRM if intent is qualified.';

  return 'Validate search context and promote if this should enter CRM review.';
}

function normalizeSignal(row: IntakeSignalRow): IntakeSignal {
  const metadata = asRecord(row.metadata);
  const priority = getPriority(row, metadata);
  const notes = cleanString(metadata.notes, '');
  const alertReadiness = getAlertReadiness(metadata);

  return {
    id: row.id,
    kind: row.kind,
    name: getName(row, metadata),
    email: cleanString(row.email, 'unknown@email.local'),
    userId: row.userId,
    heatScore: getNumber(row.heatScore),
    source: cleanString(metadata.source, row.interactionType || row.kind),
    sourceLabel: cleanString(metadata.sourceLabel, row.kind === 'crm_task' ? 'CRM Task' : 'User Interaction'),
    area: getArea(metadata),
    intent: getIntent(metadata),
    priority,
    status: cleanString(row.status, row.kind === 'crm_task' ? 'pending' : 'recorded'),
    leadTemperature: cleanString(metadata.leadTemperature, priority === 'High' ? 'hot' : priority === 'Medium' ? 'warm' : 'nurture'),
    heatScoreIncrement: getNumber(metadata.heatScoreIncrement),
    authoritySignals: getStringArray(metadata.authoritySignals),
    primaryNorthStar: cleanString(metadata.primaryNorthStar, '') || null,
    northStarCount: getNumber(metadata.northStarCount),
    alertReadiness,
    hasNotes: Boolean(notes),
    nextAction: getNextAction(row, metadata, priority),
    createdAt: toIsoDate(row.createdAt),
    metadata,
  };
}

function getDedupeKey(signal: IntakeSignal) {
  const savedSearchId = getSavedSearchId(signal.metadata);
  return savedSearchId ? `saved-search:${savedSearchId}` : `${signal.kind}:${signal.id}`;
}

function compareSignals(a: IntakeSignal, b: IntakeSignal) {
  const byDate = Date.parse(b.createdAt) - Date.parse(a.createdAt);
  if (byDate !== 0) return byDate;
  if (a.kind === b.kind) return 0;
  return a.kind === 'crm_task' ? -1 : 1;
}

function prepareSignals(rows: IntakeSignalRow[], includePromotedInteractions: boolean): PreparedSignals {
  const normalized = rows.map(normalizeSignal).sort(compareSignals);
  const crmKeys = new Set(normalized.filter((signal) => signal.kind === 'crm_task').map(getDedupeKey));
  const seenKeys = new Set<string>();
  const signals: IntakeSignal[] = [];
  let hiddenPromotedInteractions = 0;

  for (const signal of normalized) {
    const key = getDedupeKey(signal);
    const isPromotedInteraction = signal.kind === 'interaction' && crmKeys.has(key);

    if (isPromotedInteraction && !includePromotedInteractions) {
      hiddenPromotedInteractions += 1;
      continue;
    }

    if (seenKeys.has(key)) continue;

    seenKeys.add(key);
    signals.push(signal);
  }

  return {
    signals,
    hiddenPromotedInteractions,
  };
}

function getSummary(signals: IntakeSignal[], hiddenPromotedInteractions: number): IntakeSummary {
  return {
    total: signals.length,
    highPriority: signals.filter((signal) => signal.priority === 'High').length,
    crmTasks: signals.filter((signal) => signal.kind === 'crm_task').length,
    interactions: signals.filter((signal) => signal.kind === 'interaction').length,
    hiddenPromotedInteractions,
    alertReady: signals.filter((signal) => signal.alertReadiness.level === 'ready').length,
    alertWatch: signals.filter((signal) => signal.alertReadiness.level === 'watch').length,
    alertIncomplete: signals.filter((signal) => signal.alertReadiness.level === 'incomplete').length,
  };
}

async function getIntakeRows(limit: number): Promise<IntakeSignalRow[]> {
  const rowLimit = limit * 3;

  const [crmTaskRows, interactionRows] = await Promise.all([
    prisma.$queryRaw<IntakeSignalRow[]>`
      SELECT
        "CRMTask"."id"::text AS "id",
        'crm_task'::text AS "kind",
        "CRMTask"."leadId"::text AS "userId",
        "User"."email" AS "email",
        "User"."name" AS "userName",
        "User"."heatScore" AS "heatScore",
        "CRMTask"."priority" AS "priority",
        "CRMTask"."status" AS "status",
        "CRMTask"."title" AS "title",
        NULL::text AS "interactionType",
        "CRMTask"."metadata" AS "metadata",
        "CRMTask"."createdAt" AS "createdAt"
      FROM "CRMTask"
      INNER JOIN "User" ON "User"."id" = "CRMTask"."leadId"
      WHERE "CRMTask"."type" = 'strategy_intake'
      ORDER BY "CRMTask"."createdAt" DESC
      LIMIT ${rowLimit}
    `,
    prisma.$queryRaw<IntakeSignalRow[]>`
      SELECT
        "UserInteraction"."id"::text AS "id",
        'interaction'::text AS "kind",
        "UserInteraction"."userId"::text AS "userId",
        "User"."email" AS "email",
        "User"."name" AS "userName",
        "User"."heatScore" AS "heatScore",
        NULL::text AS "priority",
        'recorded'::text AS "status",
        NULL::text AS "title",
        "UserInteraction"."type" AS "interactionType",
        "UserInteraction"."metadata" AS "metadata",
        "UserInteraction"."createdAt" AS "createdAt"
      FROM "UserInteraction"
      INNER JOIN "User" ON "User"."id" = "UserInteraction"."userId"
      WHERE "UserInteraction"."type" = 'save_search'
      ORDER BY "UserInteraction"."createdAt" DESC
      LIMIT ${rowLimit}
    `,
  ]);

  return [...crmTaskRows, ...interactionRows];
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: 'Admin access is required.',
      auth: {
        configured: Boolean(getAdminKey()),
      },
    },
    { status: 401 },
  );
}

export async function GET(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const limit = parseLimit(request);
    const rows = await getIntakeRows(limit);
    const { signals, hiddenPromotedInteractions } = prepareSignals(rows, shouldIncludePromotedInteractions(request));
    const limitedSignals = signals.slice(0, limit);

    return NextResponse.json({
      success: true,
      signals: limitedSignals,
      summary: getSummary(limitedSignals, hiddenPromotedInteractions),
      auth: {
        configured: Boolean(getAdminKey()),
      },
    });
  } catch (error) {
    console.error('[REIE INTAKE SIGNALS] Read failed:', getErrorMessage(error));

    return NextResponse.json(
      {
        success: false,
        error: 'Intake signals could not be read.',
        detail: getErrorMessage(error),
      },
      { status: 500 },
    );
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/intake-signals/route.ts
