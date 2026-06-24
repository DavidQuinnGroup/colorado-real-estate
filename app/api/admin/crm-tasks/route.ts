import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type CRMTaskPriority = 'high' | 'medium' | 'low' | 'unknown';

type CRMTaskAlertLevel = 'ready' | 'watch' | 'incomplete' | 'unknown';

type CRMTaskSummary = {
  total: number;
  pending: number;
  reviewing: number;
  completed: number;
  dismissed: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  preDiscoveryBriefs: number;
  strategyIntakes: number;
  propertyInquiries: number;
  alertReady: number;
  alertWatch: number;
  alertIncomplete: number;
  alertUnknown: number;
};

type CRMTaskAuditSummary = {
  closed: number;
  completed: number;
  dismissed: number;
  completedWithReview: number;
  completedMissingReview: number;
  dismissedWithReview: number;
  dismissedMissingReview: number;
  closureReviewReady: number;
  closureReviewMissing: number;
  closureReviewCoveragePercent: number;
};

type CRMTaskReadiness = {
  level: 'ready' | 'watch' | 'blocked';
  summary: string;
  nextAction: string;
  terminal: 'Terminal 5';
  nextCommand: string;
  gates: Array<{
    label: string;
    status: 'pass' | 'watch' | 'fail';
    detail: string;
  }>;
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

type CRMTaskAuditRow = {
  closed: bigint | number | null;
  completed: bigint | number | null;
  dismissed: bigint | number | null;
  completedWithReview: bigint | number | null;
  completedMissingReview: bigint | number | null;
  dismissedWithReview: bigint | number | null;
  dismissedMissingReview: bigint | number | null;
};

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const DEFAULT_STATUS = 'pending';
const DEFAULT_STATUS_SET = ['pending', 'reviewing'] as const;
const VALID_PRIORITIES = new Set<CRMTaskPriority>(['high', 'medium', 'low']);

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
  return String(error || 'Unknown CRM task admin failure.');
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

function parseLimit(request: NextRequest) {
  const rawLimit = Number(request.nextUrl.searchParams.get('limit') || DEFAULT_LIMIT);
  if (!Number.isFinite(rawLimit)) return DEFAULT_LIMIT;
  return Math.min(Math.max(Math.floor(rawLimit), 1), MAX_LIMIT);
}

function parseStatus(request: NextRequest) {
  return cleanString(request.nextUrl.searchParams.get('status'), DEFAULT_STATUS)
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 48) || DEFAULT_STATUS;
}

function getStatusFilter(status: string) {
  if (status === 'all') return null;
  if (status === 'active') return [...DEFAULT_STATUS_SET];
  return [status];
}

function parseType(request: NextRequest) {
  return cleanString(request.nextUrl.searchParams.get('type')).slice(0, 80);
}

function getPriority(value: unknown): CRMTaskPriority {
  const priority = cleanString(value).toLowerCase();
  return VALID_PRIORITIES.has(priority as CRMTaskPriority) ? (priority as CRMTaskPriority) : 'unknown';
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

function getNextAction(metadata: Record<string, unknown>, alertReadiness: CRMTask['alertReadiness']) {
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

function getInspectionCommand(request: NextRequest) {
  const search = request.nextUrl.search || '';
  return `curl --max-time 8 -s "http://localhost:3000/api/admin/crm-tasks${search}" -H "x-admin-key: $REIE_ADMIN_API_KEY"`;
}

function getInspectionMetadata(request: NextRequest) {
  return {
    generatedAt: new Date().toISOString(),
    terminal: 'Terminal 5' as const,
    inspectionSource: 'List Route' as const,
    route: '/api/admin/crm-tasks',
    command: getInspectionCommand(request),
  };
}

function normalizeTask(row: CRMTaskRow, status: string): CRMTask {
  const metadata = asRecord(row.metadata);
  const alertReadiness = getAlertReadiness(metadata);

  return {
    id: row.id,
    leadId: row.leadId,
    email: cleanString(row.email, 'unknown@email.local'),
    name: cleanString(row.name) || null,
    heatScore: getNumber(row.heatScore),
    type: cleanString(row.type, 'unknown'),
    status: cleanString(row.status, status),
    priority: getPriority(row.priority),
    title: cleanString(row.title, 'Untitled CRM task'),
    createdAt: toIsoDate(row.createdAt),
    intentSummary: cleanString(metadata.intentSummary) || null,
    nextAction: getNextAction(metadata, alertReadiness),
    tacticalLevers: cleanString(metadata.tacticalLevers) || null,
    latestSavedSearchIntake: getLatestSavedSearchIntake(metadata),
    propertyInquiry: getPropertyInquiry(metadata),
    alertReadiness,
    operations: getOperations(status),
    metadata,
  };
}

function getSummary(tasks: CRMTask[]): CRMTaskSummary {
  return {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === 'pending').length,
    reviewing: tasks.filter((task) => task.status === 'reviewing').length,
    completed: tasks.filter((task) => task.status === 'completed').length,
    dismissed: tasks.filter((task) => task.status === 'dismissed').length,
    highPriority: tasks.filter((task) => task.priority === 'high').length,
    mediumPriority: tasks.filter((task) => task.priority === 'medium').length,
    lowPriority: tasks.filter((task) => task.priority === 'low').length,
    preDiscoveryBriefs: tasks.filter((task) => task.type === 'PRE_DISCOVERY_BRIEF').length,
    strategyIntakes: tasks.filter((task) => task.type === 'strategy_intake').length,
    propertyInquiries: tasks.filter((task) => task.type === 'property_inquiry').length,
    alertReady: tasks.filter((task) => task.alertReadiness.level === 'ready').length,
    alertWatch: tasks.filter((task) => task.alertReadiness.level === 'watch').length,
    alertIncomplete: tasks.filter((task) => task.alertReadiness.level === 'incomplete').length,
    alertUnknown: tasks.filter((task) => task.alertReadiness.level === 'unknown').length,
  };
}

function normalizeCount(value: bigint | number | null | undefined) {
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  return 0;
}

function normalizeAuditSummary(row: CRMTaskAuditRow | undefined): CRMTaskAuditSummary {
  const completedWithReview = normalizeCount(row?.completedWithReview);
  const completedMissingReview = normalizeCount(row?.completedMissingReview);
  const dismissedWithReview = normalizeCount(row?.dismissedWithReview);
  const dismissedMissingReview = normalizeCount(row?.dismissedMissingReview);
  const closureReviewReady = completedWithReview + dismissedWithReview;
  const closureReviewMissing = completedMissingReview + dismissedMissingReview;
  const closed = normalizeCount(row?.closed);

  return {
    closed,
    completed: normalizeCount(row?.completed),
    dismissed: normalizeCount(row?.dismissed),
    completedWithReview,
    completedMissingReview,
    dismissedWithReview,
    dismissedMissingReview,
    closureReviewReady,
    closureReviewMissing,
    closureReviewCoveragePercent: closed > 0 ? Math.round((closureReviewReady / closed) * 100) : 100,
  };
}

function getVerdict(summary: CRMTaskSummary, status: string) {
  if (!summary.total) return status === 'all' ? 'No CRM tasks are currently available.' : 'No CRM tasks matched this status.';
  if (summary.alertIncomplete > 0) return 'Some CRM tasks need stronger saved-search criteria before automated alert matching.';
  if (summary.alertReady > 0) return 'CRM tasks include alert-ready REIE intake context.';
  if (summary.alertWatch > 0) return 'CRM tasks include watch-level saved-search context.';
  return 'CRM tasks scanned; no saved-search alert readiness was attached.';
}

function getReadiness(summary: CRMTaskSummary, audit: CRMTaskAuditSummary, status: string): CRMTaskReadiness {
  const auditGateStatus = audit.closureReviewMissing > 0 ? 'fail' : 'pass';
  const intakeGateStatus = summary.alertIncomplete > 0 ? 'watch' : 'pass';
  const activeGateStatus = summary.pending + summary.reviewing > 0 ? 'watch' : 'pass';
  const gates: CRMTaskReadiness['gates'] = [
    {
      label: 'Closure Audit',
      status: auditGateStatus,
      detail: `${audit.closureReviewCoveragePercent}% closure review coverage; ${audit.closureReviewMissing} closed tasks missing review notes.`,
    },
    {
      label: 'Active Review',
      status: activeGateStatus,
      detail: `${summary.pending} pending and ${summary.reviewing} reviewing CRM tasks in this response.`,
    },
    {
      label: 'Alert Criteria',
      status: intakeGateStatus,
      detail: `${summary.alertReady} alert-ready, ${summary.alertWatch} watch, ${summary.alertIncomplete} incomplete CRM tasks in this response.`,
    },
  ];

  if (auditGateStatus === 'fail') {
    return {
      level: 'blocked',
      summary: 'CRM closure audit coverage is incomplete.',
      nextAction: 'Review closed CRM tasks missing notes before increasing CRM automation or reporting cadence.',
      terminal: 'Terminal 5',
      nextCommand: 'npm run run:crm:all',
      gates,
    };
  }

  if (summary.alertIncomplete > 0) {
    return {
      level: 'watch',
      summary: 'CRM queue is usable, but some active tasks need stronger saved-search criteria.',
      nextAction: 'Review incomplete CRM intake criteria before relying on automated alert matching.',
      terminal: 'Terminal 5',
      nextCommand: getOperations(status).reviewCommand,
      gates,
    };
  }

  if (summary.pending + summary.reviewing > 0) {
    return {
      level: 'watch',
      summary: 'CRM closure audit is clean and active tasks are ready for human review.',
      nextAction: 'Continue reviewing active CRM tasks in the admin dashboard.',
      terminal: 'Terminal 5',
      nextCommand: getOperations(status).reviewCommand,
      gates,
    };
  }

  return {
    level: 'ready',
    summary: 'CRM closure audit is clean and no active CRM task blockers were detected.',
    nextAction: 'Keep CRM reporting on the approved cadence and monitor new intake.',
    terminal: 'Terminal 5',
    nextCommand: getOperations(status).reviewCommand,
    gates,
  };
}

function getFallbackReadiness(status: string, reason: string): CRMTaskReadiness {
  return {
    level: 'blocked',
    summary: reason,
    nextAction: 'Resolve this protected CRM task list response before using CRM readiness for scheduler, email, alert, or content automation.',
    terminal: 'Terminal 5',
    nextCommand: getOperations(status).reviewCommand,
    gates: [
      {
        label: 'Task Visibility',
        status: 'fail',
        detail: 'No CRM task records were exposed in this response.',
      },
      {
        label: 'List Route',
        status: 'fail',
        detail: reason,
      },
      {
        label: 'Automation Safety',
        status: 'fail',
        detail: 'Automation should not scale from a CRM task list route that did not return authorized task records.',
      },
    ],
  };
}

function getFilters(limit: number, status: string, type: string) {
  return {
    limit,
    status,
    effectiveStatuses: getStatusFilter(status),
    type: type || null,
  };
}

function getCRMTaskEnvelope(
  request: NextRequest,
  tasks: CRMTask[],
  audit: CRMTaskAuditSummary,
  options?: {
    fallbackReason?: string;
  },
) {
  const limit = parseLimit(request);
  const status = parseStatus(request);
  const type = parseType(request);
  const summary = getSummary(tasks);
  const readiness = options?.fallbackReason ? getFallbackReadiness(status, options.fallbackReason) : getReadiness(summary, audit, status);

  return {
    ...getInspectionMetadata(request),
    tasks,
    summary,
    audit,
    readiness,
    verdict: options?.fallbackReason || getVerdict(summary, status),
    filters: getFilters(limit, status, type),
    operations: getOperations(status),
    auth: {
      configured: Boolean(getAdminKey()),
    },
  } as const;
}

async function getAuditSummary(type: string): Promise<CRMTaskAuditSummary> {
  if (type) {
    const rows = await prisma.$queryRaw<CRMTaskAuditRow[]>`
      SELECT
        COUNT(*) FILTER (WHERE "CRMTask"."status" IN ('completed', 'dismissed')) AS "closed",
        COUNT(*) FILTER (WHERE "CRMTask"."status" = 'completed') AS "completed",
        COUNT(*) FILTER (WHERE "CRMTask"."status" = 'dismissed') AS "dismissed",
        COUNT(*) FILTER (
          WHERE "CRMTask"."status" = 'completed'
            AND NULLIF(TRIM("CRMTask"."metadata" #>> '{review,reviewNote}'), '') IS NOT NULL
        ) AS "completedWithReview",
        COUNT(*) FILTER (
          WHERE "CRMTask"."status" = 'completed'
            AND NULLIF(TRIM("CRMTask"."metadata" #>> '{review,reviewNote}'), '') IS NULL
        ) AS "completedMissingReview",
        COUNT(*) FILTER (
          WHERE "CRMTask"."status" = 'dismissed'
            AND NULLIF(TRIM("CRMTask"."metadata" #>> '{review,reviewNote}'), '') IS NOT NULL
        ) AS "dismissedWithReview",
        COUNT(*) FILTER (
          WHERE "CRMTask"."status" = 'dismissed'
            AND NULLIF(TRIM("CRMTask"."metadata" #>> '{review,reviewNote}'), '') IS NULL
        ) AS "dismissedMissingReview"
      FROM "CRMTask"
      WHERE "CRMTask"."type" = ${type}
    `;

    return normalizeAuditSummary(rows[0]);
  }

  const rows = await prisma.$queryRaw<CRMTaskAuditRow[]>`
    SELECT
      COUNT(*) FILTER (WHERE "CRMTask"."status" IN ('completed', 'dismissed')) AS "closed",
      COUNT(*) FILTER (WHERE "CRMTask"."status" = 'completed') AS "completed",
      COUNT(*) FILTER (WHERE "CRMTask"."status" = 'dismissed') AS "dismissed",
      COUNT(*) FILTER (
        WHERE "CRMTask"."status" = 'completed'
          AND NULLIF(TRIM("CRMTask"."metadata" #>> '{review,reviewNote}'), '') IS NOT NULL
      ) AS "completedWithReview",
      COUNT(*) FILTER (
        WHERE "CRMTask"."status" = 'completed'
          AND NULLIF(TRIM("CRMTask"."metadata" #>> '{review,reviewNote}'), '') IS NULL
      ) AS "completedMissingReview",
      COUNT(*) FILTER (
        WHERE "CRMTask"."status" = 'dismissed'
          AND NULLIF(TRIM("CRMTask"."metadata" #>> '{review,reviewNote}'), '') IS NOT NULL
      ) AS "dismissedWithReview",
      COUNT(*) FILTER (
        WHERE "CRMTask"."status" = 'dismissed'
          AND NULLIF(TRIM("CRMTask"."metadata" #>> '{review,reviewNote}'), '') IS NULL
      ) AS "dismissedMissingReview"
    FROM "CRMTask"
  `;

  return normalizeAuditSummary(rows[0]);
}

async function getTaskRows(limit: number, status: string, type: string): Promise<CRMTaskRow[]> {
  const statusFilter = getStatusFilter(status);

  if (type && statusFilter) {
    return prisma.$queryRaw<CRMTaskRow[]>`
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
      WHERE "CRMTask"."status" = ANY(${statusFilter})
        AND "CRMTask"."type" = ${type}
      ORDER BY "CRMTask"."createdAt" DESC
      LIMIT ${limit}
    `;
  }

  if (type) {
    return prisma.$queryRaw<CRMTaskRow[]>`
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
      WHERE "CRMTask"."type" = ${type}
      ORDER BY "CRMTask"."createdAt" DESC
      LIMIT ${limit}
    `;
  }

  if (statusFilter) {
    return prisma.$queryRaw<CRMTaskRow[]>`
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
      WHERE "CRMTask"."status" = ANY(${statusFilter})
      ORDER BY "CRMTask"."createdAt" DESC
      LIMIT ${limit}
    `;
  }

  return prisma.$queryRaw<CRMTaskRow[]>`
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
    ORDER BY "CRMTask"."createdAt" DESC
    LIMIT ${limit}
  `;
}

function unauthorizedResponse(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: 'Admin access is required.',
      ...getCRMTaskEnvelope(request, [], normalizeAuditSummary(undefined), {
        fallbackReason: 'Admin access is required before CRM tasks can be inspected.',
      }),
    },
    { status: 401 },
  );
}

export async function GET(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return unauthorizedResponse(request);
  }

  try {
    const limit = parseLimit(request);
    const status = parseStatus(request);
    const type = parseType(request);
    const rows = await getTaskRows(limit, status, type);
    const tasks = rows.map((row) => normalizeTask(row, status));
    const audit = await getAuditSummary(type);

    return NextResponse.json({
      success: true,
      ...getCRMTaskEnvelope(request, tasks, audit),
    });
  } catch (error) {
    console.error('[REIE CRM TASKS] Read failed:', getErrorMessage(error));

    return NextResponse.json(
      {
        success: false,
        error: 'CRM tasks could not be read.',
        detail: getErrorMessage(error),
        ...getCRMTaskEnvelope(request, [], normalizeAuditSummary(undefined), {
          fallbackReason: 'CRM tasks could not be read.',
        }),
      },
      { status: 500 },
    );
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/route.ts
