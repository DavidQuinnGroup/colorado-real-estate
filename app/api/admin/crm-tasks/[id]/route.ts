import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type CRMTaskPriority = 'high' | 'medium' | 'low' | 'unknown';

type CRMTaskStatus = 'pending' | 'reviewing' | 'completed' | 'dismissed';

type CRMTaskAlertLevel = 'ready' | 'watch' | 'incomplete' | 'unknown';

type RouteContext = {
  params: Promise<{ id: string }>;
};

type CRMTaskRow = {
  id: string;
  leadId: string;
  email: string | null;
  name: string | null;
  heatScore: number | null;
  type: string | null;
  status: string | null;
  priority: string | null;
  title: string | null;
  metadata: unknown;
  createdAt: Date | string | null;
};

type CRMTask = {
  id: string;
  leadId: string;
  email: string;
  name: string | null;
  heatScore: number;
  type: string;
  status: string;
  priority: CRMTaskPriority;
  title: string;
  createdAt: string;
  intentSummary: string | null;
  nextAction: string;
  tacticalLevers: string | null;
  latestSavedSearchIntake: {
    savedSearchId: string | null;
    capturedAt: string | null;
    city: string | null;
    marketScope: string | null;
    searchType: string | null;
    reieGoalLabel: string | null;
    timelineLabel: string | null;
    leadTemperature: string | null;
    sourceLabel: string | null;
    authoritySignals: string[];
    primaryNorthStar: string | null;
    northStarCount: number;
    hasNotes: boolean;
  } | null;
  propertyInquiry: {
    propertyId: string | null;
    mlsId: string | null;
    slug: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    price: number | null;
    propertyType: string | null;
    status: string | null;
    timelineLabel: string | null;
    leadTemperature: string | null;
    hasPhone: boolean;
    hasNotes: boolean;
  } | null;
  alertReadiness: {
    level: CRMTaskAlertLevel;
    summary: string;
    blockers: string[];
    signals: string[];
  };
  operations: {
    terminal: 'Terminal 5';
    reviewCommand: string;
    intakeCommand: string;
    alertStatusCommand: string;
  };
  metadata: Record<string, unknown>;
};

type UpdateCRMTaskBody = {
  status?: unknown;
  priority?: unknown;
  reviewNote?: unknown;
  reviewedBy?: unknown;
};

const DEFAULT_STATUS = 'pending';
const DEFAULT_LIMIT = 20;
const MAX_NOTE_LENGTH = 500;
const TASK_STATUSES = new Set<CRMTaskStatus>(['pending', 'reviewing', 'completed', 'dismissed']);
const TASK_PRIORITIES = new Set<Exclude<CRMTaskPriority, 'unknown'>>(['high', 'medium', 'low']);
const LOCAL_BASE_URL = 'http://localhost:3000';

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
  return String(error || 'Unknown CRM task detail failure.');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function cleanString(value: unknown, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function boundedString(value: unknown, maxLength: number, fallback = '') {
  const text = cleanString(value, fallback);
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function getNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getNullableNumber(value: unknown) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => cleanString(item))
    .filter(Boolean)
    .slice(0, 8);
}

function toIsoDate(value: Date | string | null) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') {
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : new Date().toISOString();
  }
  return new Date().toISOString();
}

function getPriority(value: unknown): CRMTaskPriority {
  const priority = cleanString(value).toLowerCase();
  return TASK_PRIORITIES.has(priority as Exclude<CRMTaskPriority, 'unknown'>) ? (priority as CRMTaskPriority) : 'unknown';
}

function parseTaskStatus(value: unknown, fallback: CRMTaskStatus): CRMTaskStatus {
  const status = cleanString(value, fallback).toLowerCase();
  return TASK_STATUSES.has(status as CRMTaskStatus) ? (status as CRMTaskStatus) : fallback;
}

function parseTaskPriority(value: unknown, fallback: Exclude<CRMTaskPriority, 'unknown'>) {
  const priority = cleanString(value, fallback).toLowerCase();
  return TASK_PRIORITIES.has(priority as Exclude<CRMTaskPriority, 'unknown'>) ? (priority as Exclude<CRMTaskPriority, 'unknown'>) : fallback;
}

function getAlertReadiness(metadata: Record<string, unknown>): CRMTask['alertReadiness'] {
  const alertReadiness = asRecord(metadata.alertReadiness);
  const rawLevel = cleanString(alertReadiness.level).toLowerCase();
  const level =
    rawLevel === 'ready' || rawLevel === 'watch' || rawLevel === 'incomplete'
      ? rawLevel
      : 'unknown';

  return {
    level,
    summary: cleanString(alertReadiness.summary, level === 'unknown' ? 'Alert readiness was not recorded for this CRM task.' : ''),
    blockers: getStringArray(alertReadiness.blockers),
    signals: getStringArray(alertReadiness.signals),
  };
}

function getLatestSavedSearchIntake(metadata: Record<string, unknown>): CRMTask['latestSavedSearchIntake'] {
  if (cleanString(metadata.schemaVersion) === 'reie-property-inquiry-v1') return null;

  const nestedIntake = asRecord(metadata.latestSavedSearchIntake);
  const intake = Object.keys(nestedIntake).length ? nestedIntake : metadata;

  if (!Object.keys(intake).length) return null;

  return {
    savedSearchId: cleanString(intake.savedSearchId) || null,
    capturedAt: cleanString(intake.capturedAt) || null,
    city: cleanString(intake.city) || null,
    marketScope: cleanString(intake.marketScope) || null,
    searchType: cleanString(intake.searchType) || null,
    reieGoalLabel: cleanString(intake.reieGoalLabel) || null,
    timelineLabel: cleanString(intake.timelineLabel) || null,
    leadTemperature: cleanString(intake.leadTemperature) || null,
    sourceLabel: cleanString(intake.sourceLabel) || null,
    authoritySignals: getStringArray(intake.authoritySignals),
    primaryNorthStar: cleanString(intake.primaryNorthStar) || null,
    northStarCount: getNumber(intake.northStarCount),
    hasNotes: Boolean(intake.hasNotes),
  };
}

function getPropertyInquiry(metadata: Record<string, unknown>): CRMTask['propertyInquiry'] {
  if (cleanString(metadata.schemaVersion) !== 'reie-property-inquiry-v1') return null;

  const property = asRecord(metadata.property);

  return {
    propertyId: cleanString(property.id) || null,
    mlsId: cleanString(property.mlsId) || null,
    slug: cleanString(property.slug) || null,
    address: cleanString(property.address) || null,
    city: cleanString(property.city) || null,
    state: cleanString(property.state) || null,
    price: getNullableNumber(property.price),
    propertyType: cleanString(property.propertyType) || null,
    status: cleanString(property.status) || null,
    timelineLabel: cleanString(metadata.timelineLabel) || null,
    leadTemperature: cleanString(metadata.leadTemperature) || null,
    hasPhone: Boolean(cleanString(metadata.phone)),
    hasNotes: Boolean(cleanString(metadata.notes)),
  };
}

function getNextAction(row: CRMTaskRow, metadata: Record<string, unknown>, alertReadiness: CRMTask['alertReadiness']) {
  if (row.status === 'completed') return 'No action required; CRM task is completed.';
  if (row.status === 'dismissed') return 'No action required; CRM task was dismissed.';

  const nextAction = cleanString(metadata.nextAction);
  if (nextAction) return nextAction;

  if (alertReadiness.level === 'incomplete') {
    return 'Strengthen saved-search criteria before relying on automated alert matching.';
  }

  if (alertReadiness.level === 'ready') {
    return 'Review saved-search context and prepare one specific advisory point.';
  }

  return 'Review CRM task context and continue intelligence capture.';
}

function getOperations(status: string) {
  const reviewCommandByStatus: Record<string, string> = {
    active: 'npm run run:crm:active',
    pending: 'npm run run:crm:pending',
    reviewing: 'npm run run:crm:reviewing',
    all: 'npm run run:crm:all',
  };

  return {
    terminal: 'Terminal 5' as const,
    reviewCommand: reviewCommandByStatus[status] || `npm run run:crm -- --limit ${DEFAULT_LIMIT} --status ${status}`,
    intakeCommand: 'curl --max-time 8 -s "http://localhost:3000/api/admin/intake-signals?limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"',
    alertStatusCommand: 'curl --max-time 8 -s "http://localhost:3000/api/process-alerts?limit=6"',
  };
}

function getRoutePath(id: string) {
  return `/api/admin/crm-tasks/${id}`;
}

function getInspectionCommand(request: NextRequest, id: string) {
  const method = request.method.toUpperCase();
  const methodFlag = method === 'GET' ? '' : ` -X ${method}`;
  const bodyHint =
    method === 'PATCH'
      ? ` -H "Content-Type: application/json" -d '{"status":"reviewing","reviewNote":"Reviewed in Terminal 5."}'`
      : '';

  return `curl --max-time 8 -s${methodFlag} "${LOCAL_BASE_URL}${getRoutePath(id)}${request.nextUrl.search}" -H "x-admin-key: $REIE_ADMIN_API_KEY"${bodyHint}`;
}

function getInspectionMetadata(request: NextRequest, id: string) {
  return {
    generatedAt: new Date().toISOString(),
    terminal: 'Terminal 5' as const,
    inspectionSource: 'Detail Route' as const,
    route: getRoutePath(id),
    command: getInspectionCommand(request, id),
  };
}

function getDetailEnvelope(request: NextRequest, id: string, task?: CRMTask) {
  return {
    ...getInspectionMetadata(request, id),
    ...(task ? { task } : {}),
    operations: getOperations(task?.status || DEFAULT_STATUS),
    auth: {
      configured: Boolean(getAdminKey()),
    },
  } as const;
}

function normalizeTask(row: CRMTaskRow): CRMTask {
  const metadata = asRecord(row.metadata);
  const status = cleanString(row.status, DEFAULT_STATUS);
  const alertReadiness = getAlertReadiness(metadata);

  return {
    id: row.id,
    leadId: row.leadId,
    email: cleanString(row.email, 'unknown@email.local'),
    name: cleanString(row.name) || null,
    heatScore: getNumber(row.heatScore),
    type: cleanString(row.type, 'unknown'),
    status,
    priority: getPriority(row.priority),
    title: cleanString(row.title, 'Untitled CRM task'),
    createdAt: toIsoDate(row.createdAt),
    intentSummary: cleanString(metadata.intentSummary) || null,
    nextAction: getNextAction(row, metadata, alertReadiness),
    tacticalLevers: cleanString(metadata.tacticalLevers) || null,
    latestSavedSearchIntake: getLatestSavedSearchIntake(metadata),
    propertyInquiry: getPropertyInquiry(metadata),
    alertReadiness,
    operations: getOperations(status),
    metadata,
  };
}

async function getTaskId(context: RouteContext) {
  const params = await context.params;
  return params.id;
}

async function getTaskRow(id: string): Promise<CRMTaskRow | null> {
  const rows = await prisma.$queryRaw<CRMTaskRow[]>`
    SELECT
      "CRMTask"."id"::text AS "id",
      "CRMTask"."leadId"::text AS "leadId",
      "User"."email" AS "email",
      "User"."name" AS "name",
      "User"."heatScore" AS "heatScore",
      "CRMTask"."type" AS "type",
      "CRMTask"."status" AS "status",
      "CRMTask"."priority" AS "priority",
      "CRMTask"."title" AS "title",
      "CRMTask"."metadata" AS "metadata",
      "CRMTask"."createdAt" AS "createdAt"
    FROM "CRMTask"
    INNER JOIN "User" ON "User"."id" = "CRMTask"."leadId"
    WHERE "CRMTask"."id"::text = ${id}
    LIMIT 1
  `;

  return rows[0] || null;
}

function getCurrentTaskStatus(row: CRMTaskRow): CRMTaskStatus {
  return parseTaskStatus(row.status, 'pending');
}

function getCurrentTaskPriority(row: CRMTaskRow): Exclude<CRMTaskPriority, 'unknown'> {
  return parseTaskPriority(row.priority, 'medium');
}

function taskClosureRequiresReviewNote(status: CRMTaskStatus) {
  return status === 'completed' || status === 'dismissed';
}

function getReviewNote(body: UpdateCRMTaskBody) {
  return boundedString(body.reviewNote, MAX_NOTE_LENGTH);
}

function mergeReviewMetadata(
  row: CRMTaskRow,
  body: UpdateCRMTaskBody,
  status: CRMTaskStatus,
  priority: Exclude<CRMTaskPriority, 'unknown'>,
) {
  const existingMetadata = asRecord(row.metadata);
  const existingReview = isRecord(existingMetadata.review) ? existingMetadata.review : {};
  const reviewNote = getReviewNote(body);
  const reviewedBy = boundedString(body.reviewedBy, 120, 'admin');
  const reviewedAt = new Date().toISOString();

  return {
    ...existingMetadata,
    review: {
      ...existingReview,
      status,
      priority,
      reviewNote: reviewNote || null,
      reviewedBy,
      reviewedAt,
      completedAt: status === 'completed' ? reviewedAt : existingReview.completedAt ?? null,
      dismissedAt: status === 'dismissed' ? reviewedAt : existingReview.dismissedAt ?? null,
    },
  };
}

async function updateTask(row: CRMTaskRow, body: UpdateCRMTaskBody) {
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

  return getTaskRow(row.id);
}

function unauthorizedResponse(request: NextRequest, id: string) {
  return NextResponse.json(
    {
      success: false,
      error: 'Admin access is required.',
      ...getDetailEnvelope(request, id),
    },
    { status: 401 },
  );
}

function notFoundResponse(request: NextRequest, id: string) {
  return NextResponse.json(
    {
      success: false,
      error: `CRM task "${id}" was not found.`,
      ...getDetailEnvelope(request, id),
    },
    { status: 404 },
  );
}

export async function GET(request: NextRequest, context: RouteContext) {
  const id = await getTaskId(context);

  if (!authorizeRequest(request)) {
    return unauthorizedResponse(request, id);
  }

  try {
    const row = await getTaskRow(id);

    if (!row) return notFoundResponse(request, id);

    return NextResponse.json({
      success: true,
      ...getDetailEnvelope(request, id, normalizeTask(row)),
    });
  } catch (error) {
    console.error('[REIE CRM TASK] Read failed:', getErrorMessage(error));

    return NextResponse.json(
      {
        success: false,
        error: 'CRM task could not be read.',
        detail: getErrorMessage(error),
        ...getDetailEnvelope(request, id),
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const id = await getTaskId(context);

  if (!authorizeRequest(request)) {
    return unauthorizedResponse(request, id);
  }

  try {
    const body = (await request.json().catch(() => ({}))) as UpdateCRMTaskBody;
    const row = await getTaskRow(id);

    if (!row) return notFoundResponse(request, id);

    const targetStatus = parseTaskStatus(body.status, getCurrentTaskStatus(row));
    const reviewNote = getReviewNote(body);

    if (taskClosureRequiresReviewNote(targetStatus) && !reviewNote) {
      const task = normalizeTask(row);
      return NextResponse.json(
        {
          success: false,
          error: 'A review note is required before completing or dismissing a CRM task.',
          ...getDetailEnvelope(request, id, task),
          audit: {
            required: true,
            requiredForStatuses: ['completed', 'dismissed'],
            reviewNoteMaxLength: MAX_NOTE_LENGTH,
          },
        },
        { status: 400 },
      );
    }

    const updatedRow = await updateTask(row, body);

    if (!updatedRow) return notFoundResponse(request, id);

    return NextResponse.json({
      success: true,
      ...getDetailEnvelope(request, id, normalizeTask(updatedRow)),
    });
  } catch (error) {
    console.error('[REIE CRM TASK] Update failed:', getErrorMessage(error));

    return NextResponse.json(
      {
        success: false,
        error: 'CRM task could not be updated.',
        detail: getErrorMessage(error),
        ...getDetailEnvelope(request, id),
      },
      { status: 500 },
    );
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/[id]/route.ts
