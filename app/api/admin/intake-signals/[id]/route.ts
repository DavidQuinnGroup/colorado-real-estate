import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type IntakeKind = 'crm_task' | 'interaction';

type IntakePriority = 'High' | 'Medium' | 'Watch';

type IntakeIntent = 'Buyer' | 'Seller' | 'Investor' | 'Research';

type TaskStatus = 'pending' | 'reviewing' | 'completed' | 'dismissed';

type TaskPriority = 'low' | 'medium' | 'high';

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

type IntakeDetailReadinessGate = {
  name: string;
  status: 'pass' | 'watch' | 'blocked';
  detail: string;
};

type IntakeDetailReadiness = {
  level: 'ready' | 'watch' | 'blocked';
  summary: string;
  nextAction: string;
  terminal: string;
  nextCommand: string;
  gates: IntakeDetailReadinessGate[];
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

type UpdateSignalBody = {
  action?: unknown;
  kind?: unknown;
  status?: unknown;
  priority?: unknown;
  reviewNote?: unknown;
  reviewedBy?: unknown;
};

const TASK_STATUSES = new Set<TaskStatus>(['pending', 'reviewing', 'completed', 'dismissed']);
const TASK_PRIORITIES = new Set<TaskPriority>(['low', 'medium', 'high']);
const MAX_NOTE_LENGTH = 500;
const LOCAL_BASE_URL = 'http://localhost:3000';
const TERMINAL = 'Terminal 5';
const ROUTE_BASE = '/api/admin/intake-signals';

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
  return String(error || 'Unknown intake-signal detail failure.');
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

function boundedString(value: unknown, maxLength: number, fallback = '') {
  const text = cleanString(value, fallback);
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function toIsoDate(value: Date | string | null) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') {
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : new Date().toISOString();
  }
  return new Date().toISOString();
}

function getKind(request: NextRequest, bodyKind?: unknown): IntakeKind | null {
  const value = cleanString(bodyKind, request.nextUrl.searchParams.get('kind') || '').toLowerCase();
  if (value === 'crm_task' || value === 'interaction') return value;
  return null;
}

function getAction(value: unknown) {
  return cleanString(value, '').toLowerCase();
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

function getInspectionCommand(request: NextRequest, id: string) {
  const route = `${ROUTE_BASE}/${id}`;
  const method = request.method.toUpperCase();
  const methodFlag = method === 'GET' ? '' : ` -X ${method}`;
  const bodyHint =
    method === 'PATCH'
      ? ` -H "Content-Type: application/json" -d '{"status":"reviewing","reviewNote":"Reviewed in Terminal 5."}'`
      : '';

  return `curl --max-time 8 -s${methodFlag} "${LOCAL_BASE_URL}${route}${request.nextUrl.search}" -H "x-admin-key: $REIE_ADMIN_API_KEY"${bodyHint}`;
}

function getRouteMetadata(request: NextRequest, id: string) {
  const route = `${ROUTE_BASE}/${id}`;

  return {
    generatedAt: new Date().toISOString(),
    terminal: TERMINAL,
    inspectionSource: 'Detail Route' as const,
    route,
    command: getInspectionCommand(request, id),
  };
}

function getFallbackDetailReadiness(id: string, nextCommand: string, reason: string): IntakeDetailReadiness {
  return {
    level: 'blocked',
    summary: reason,
    nextAction: 'Resolve this protected detail-route response before using the signal for CRM, alert, email, or content automation.',
    terminal: TERMINAL,
    nextCommand,
    gates: [
      {
        name: 'Signal Visibility',
        status: 'blocked',
        detail: `Signal "${id}" was not exposed in this response.`,
      },
      {
        name: 'Detail Route',
        status: 'blocked',
        detail: reason,
      },
      {
        name: 'Automation Safety',
        status: 'blocked',
        detail: 'Automation should not scale from a detail route that did not return an authorized signal record.',
      },
    ],
  };
}

function getDetailEnvelope(request: NextRequest, id: string, signal?: IntakeSignal, fallbackReason?: string) {
  const routeMetadata = getRouteMetadata(request, id);
  const readiness = signal
    ? getDetailReadiness(signal, routeMetadata.command)
    : getFallbackDetailReadiness(id, routeMetadata.command, fallbackReason || `Intake signal "${id}" was not available.`);

  return {
    ...routeMetadata,
    ...(signal ? { signal } : {}),
    readiness,
    auth: {
      configured: Boolean(getAdminKey()),
    },
  } as const;
}

function getDetailReadiness(signal: IntakeSignal, nextCommand: string): IntakeDetailReadiness {
  const isInteraction = signal.kind === 'interaction';
  const isOpenCrmTask = signal.kind === 'crm_task' && (signal.status === 'pending' || signal.status === 'reviewing');
  const hasIncompleteCriteria = signal.alertReadiness.level === 'incomplete';
  const gates: IntakeDetailReadinessGate[] = [
    {
      name: 'Signal Visibility',
      status: 'pass',
      detail: `${signal.kind === 'crm_task' ? 'CRM task' : 'Saved-search interaction'} signal "${signal.id}" is visible.`,
    },
    {
      name: 'Promotion State',
      status: isInteraction ? 'watch' : 'pass',
      detail: isInteraction
        ? 'Interaction signal still requires explicit human promotion before CRM handoff.'
        : 'Signal is represented by a CRM task.',
    },
    {
      name: 'Alert Criteria',
      status: hasIncompleteCriteria ? 'watch' : 'pass',
      detail: signal.alertReadiness.summary || 'Alert readiness metadata is available for this signal.',
    },
    {
      name: 'Review State',
      status: isOpenCrmTask ? 'watch' : 'pass',
      detail: isOpenCrmTask
        ? `CRM task is ${signal.status}; human review should complete before automation scales.`
        : `Signal status is ${signal.status}.`,
    },
  ];

  if (hasIncompleteCriteria) {
    return {
      level: 'watch',
      summary: 'This intake signal needs stronger saved-search criteria before automation scales.',
      nextAction: 'Review alert criteria and update the CRM task before relying on this signal for scheduler, email, or content decisions.',
      terminal: TERMINAL,
      nextCommand,
      gates,
    };
  }

  if (isInteraction) {
    return {
      level: 'watch',
      summary: 'This saved-search interaction is visible but has not been promoted to CRM review.',
      nextAction: 'Promote the signal only after confirming intent and handoff capacity.',
      terminal: TERMINAL,
      nextCommand,
      gates,
    };
  }

  if (isOpenCrmTask) {
    return {
      level: 'watch',
      summary: 'This CRM task is ready for human review but should not be treated as closed handoff evidence.',
      nextAction: 'Complete or dismiss the CRM task with review notes before scaling automation based on this signal.',
      terminal: TERMINAL,
      nextCommand,
      gates,
    };
  }

  return {
    level: 'ready',
    summary: 'This intake signal has no detail-level readiness blockers in the current response.',
    nextAction: 'Keep intake review on the approved cadence before scaling automation.',
    terminal: TERMINAL,
    nextCommand,
    gates,
  };
}

async function getSignalId(context: RouteContext) {
  const params = await context.params;
  return params.id;
}

async function getCrmTaskSignal(id: string): Promise<IntakeSignalRow | null> {
  const rows = await prisma.$queryRaw<IntakeSignalRow[]>`
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
    WHERE "CRMTask"."id"::text = ${id}
    LIMIT 1
  `;

  return rows[0] || null;
}

async function getInteractionSignal(id: string): Promise<IntakeSignalRow | null> {
  const rows = await prisma.$queryRaw<IntakeSignalRow[]>`
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
    WHERE "UserInteraction"."id"::text = ${id}
    LIMIT 1
  `;

  return rows[0] || null;
}

async function getSignalRow(id: string, kind: IntakeKind | null) {
  if (kind === 'crm_task') return getCrmTaskSignal(id);
  if (kind === 'interaction') return getInteractionSignal(id);

  return (await getCrmTaskSignal(id)) || (await getInteractionSignal(id));
}

async function findExistingCrmTaskForInteraction(row: IntakeSignalRow) {
  const metadata = asRecord(row.metadata);
  const savedSearchId = getSavedSearchId(metadata);

  if (!savedSearchId) return null;

  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT "id"::text AS "id"
    FROM "CRMTask"
    WHERE "leadId"::text = ${row.userId}
      AND "type" = 'strategy_intake'
      AND "metadata"->>'savedSearchId' = ${savedSearchId}
    ORDER BY "createdAt" DESC
    LIMIT 1
  `;

  return rows[0]?.id ? getCrmTaskSignal(rows[0].id) : null;
}

function parseTaskStatus(value: unknown, fallback: TaskStatus): TaskStatus {
  const status = cleanString(value, fallback).toLowerCase();
  return TASK_STATUSES.has(status as TaskStatus) ? (status as TaskStatus) : fallback;
}

function parseTaskPriority(value: unknown, fallback: TaskPriority): TaskPriority {
  const priority = cleanString(value, fallback).toLowerCase();
  return TASK_PRIORITIES.has(priority as TaskPriority) ? (priority as TaskPriority) : fallback;
}

function getCurrentTaskPriority(row: IntakeSignalRow): TaskPriority {
  return parseTaskPriority(row.priority, 'medium');
}

function getCurrentTaskStatus(row: IntakeSignalRow): TaskStatus {
  return parseTaskStatus(row.status, 'pending');
}

function getPromotedTaskPriority(row: IntakeSignalRow, body: UpdateSignalBody) {
  const metadata = asRecord(row.metadata);
  const timeline = cleanString(metadata.timeline, '').toLowerCase();
  const leadTemperature = cleanString(metadata.leadTemperature, '').toLowerCase();

  if (body.priority !== undefined) return parseTaskPriority(body.priority, 'medium');
  if (leadTemperature === 'hot') return 'high';
  if (timeline === 'now') return 'high';
  if (leadTemperature === 'warm') return 'medium';
  if (timeline === 'ninety-days') return 'medium';
  return 'medium';
}

function getTaskTitle(row: IntakeSignalRow) {
  const metadata = asRecord(row.metadata);
  const city = cleanString(metadata.marketScope, cleanString(metadata.city, 'Colorado'));
  const reieGoalLabel = cleanString(metadata.clientReieGoalLabel, cleanString(metadata.reieGoalLabel, 'Strategy Intake'));
  const timelineLabel = cleanString(metadata.clientTimelineLabel, cleanString(metadata.timelineLabel, 'Unstated Timing'));
  const sourceLabel = cleanString(metadata.sourceLabel, 'User Interaction');

  return `REIE intake: ${reieGoalLabel} in ${city} (${timelineLabel}, ${sourceLabel})`;
}

function mergeReviewMetadata(row: IntakeSignalRow, body: UpdateSignalBody, status: TaskStatus, priority: TaskPriority) {
  const existingMetadata = asRecord(row.metadata);
  const reviewNote = boundedString(body.reviewNote, MAX_NOTE_LENGTH);
  const reviewedBy = boundedString(body.reviewedBy, 120, 'admin');

  return {
    ...existingMetadata,
    review: {
      ...(isRecord(existingMetadata.review) ? existingMetadata.review : {}),
      status,
      priority,
      reviewNote: reviewNote || null,
      reviewedBy,
      reviewedAt: new Date().toISOString(),
    },
  };
}

async function updateCrmTaskSignal(row: IntakeSignalRow, body: UpdateSignalBody) {
  const status = parseTaskStatus(body.status, getCurrentTaskStatus(row));
  const priority = parseTaskPriority(body.priority, getCurrentTaskPriority(row));
  const metadata = mergeReviewMetadata(row, body, status, priority);

  await prisma.$executeRaw`
    UPDATE "CRMTask"
    SET
      "status" = ${status},
      "priority" = ${priority},
      "metadata" = ${JSON.stringify(metadata)}::jsonb
    WHERE "id"::text = ${row.id}
  `;

  return getCrmTaskSignal(row.id);
}

async function promoteInteractionSignal(row: IntakeSignalRow, body: UpdateSignalBody) {
  const existingTask = await findExistingCrmTaskForInteraction(row);
  if (existingTask) return updateCrmTaskSignal(existingTask, body);

  const status = parseTaskStatus(body.status, 'reviewing');
  const priority = getPromotedTaskPriority(row, body);
  const metadata = {
    ...mergeReviewMetadata(row, body, status, priority),
    promotion: {
      promotedFromInteractionId: row.id,
      promotedAt: new Date().toISOString(),
    },
  };

  const createdRows = await prisma.$queryRaw<Array<{ id: string }>>`
    INSERT INTO "CRMTask" ("leadId", "type", "priority", "status", "title", "metadata")
    VALUES (
      ${row.userId},
      'strategy_intake',
      ${priority},
      ${status},
      ${getTaskTitle(row)},
      ${JSON.stringify(metadata)}::jsonb
    )
    RETURNING "id"::text AS "id"
  `;

  return createdRows[0]?.id ? getCrmTaskSignal(createdRows[0].id) : null;
}

function unauthorizedResponse(request: NextRequest, id: string) {
  return NextResponse.json(
    {
      success: false,
      error: 'Admin access is required.',
      ...getDetailEnvelope(request, id, undefined, 'Admin access is required before this intake signal can be inspected.'),
    },
    { status: 401 },
  );
}

function notFoundResponse(request: NextRequest, id: string) {
  return NextResponse.json(
    {
      success: false,
      error: `Intake signal "${id}" was not found.`,
      ...getDetailEnvelope(request, id, undefined, `Intake signal "${id}" was not found.`),
    },
    { status: 404 },
  );
}

export async function GET(request: NextRequest, context: RouteContext) {
  const id = await getSignalId(context);

  if (!authorizeRequest(request)) {
    return unauthorizedResponse(request, id);
  }

  try {
    const row = await getSignalRow(id, getKind(request));

    if (!row) return notFoundResponse(request, id);
    const signal = normalizeSignal(row);

    return NextResponse.json({
      success: true,
      ...getDetailEnvelope(request, id, signal),
    });
  } catch (error) {
    console.error('[REIE INTAKE SIGNAL] Read failed:', getErrorMessage(error));

    return NextResponse.json(
      {
        success: false,
        error: 'Intake signal could not be read.',
        detail: getErrorMessage(error),
        ...getDetailEnvelope(request, id, undefined, 'Intake signal could not be read.'),
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const id = await getSignalId(context);

  if (!authorizeRequest(request)) {
    return unauthorizedResponse(request, id);
  }

  try {
    const body = (await request.json().catch(() => ({}))) as UpdateSignalBody;
    const row = await getSignalRow(id, getKind(request, body.kind));

    if (!row) return notFoundResponse(request, id);

    const updatedRow =
      row.kind === 'crm_task' ? await updateCrmTaskSignal(row, body) : getAction(body.action) === 'promote' ? await promoteInteractionSignal(row, body) : null;

    if (!updatedRow && row.kind === 'interaction') {
      const signal = normalizeSignal(row);
      return NextResponse.json(
        {
          success: false,
          error: 'Interaction signals require action="promote" before they can be updated as CRM tasks.',
          ...getDetailEnvelope(request, id, signal),
        },
        { status: 409 },
      );
    }

    if (!updatedRow) return notFoundResponse(request, id);
    const signal = normalizeSignal(updatedRow);

    return NextResponse.json({
      success: true,
      ...getDetailEnvelope(request, id, signal),
      promoted: row.kind === 'interaction' && updatedRow.kind === 'crm_task',
    });
  } catch (error) {
    console.error('[REIE INTAKE SIGNAL] Update failed:', getErrorMessage(error));

    return NextResponse.json(
      {
        success: false,
        error: 'Intake signal could not be updated.',
        detail: getErrorMessage(error),
        ...getDetailEnvelope(request, id, undefined, 'Intake signal could not be updated.'),
      },
      { status: 500 },
    );
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/intake-signals/[id]/route.ts
