import { randomUUID } from 'node:crypto';

import { sendEmail } from '../email/sendEmail.js';
import { prisma } from '../prisma.js';

type ProcessAlertQueueOptions = {
  limit?: number;
  dryRun?: boolean;
};

export type ProcessedAlert = {
  id: string;
  userId: string;
  email?: string;
  status: 'sent' | 'failed' | 'skipped' | 'preview';
  reason?: string;
};

export type AlertQueueSummary = {
  success: boolean;
  scanned: number;
  actionable: number;
  preview: number;
  sent: number;
  skipped: number;
  failed: number;
  dryRun: boolean;
  mode: 'preview' | 'live';
  requestedLimit: number;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  recommendation: string;
  alerts: ProcessedAlert[];
};

type AlertListingPayload = {
  id?: string;
  propertyId?: string;
  mlsId?: string;
  slug?: string;
  address?: string;
  city?: string;
  state?: string;
  price?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  image?: string;
  url?: string;
  efficiencyScore?: number;
  resilienceScore?: number;
  altitude?: number;
  soilType?: string;
  hasPolybutyleneRisk?: boolean;
};

type AlertWithUser = {
  id: string;
  userId: string;
  status: string;
  payload: unknown;
  user: {
    id: string;
    email: string;
    isUnsubscribed: boolean;
  } | null;
};

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

function toPositiveInteger(value: unknown, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.floor(parsed), min), max);
}

function getLimit(limit: number | undefined) {
  return toPositiveInteger(limit, DEFAULT_LIMIT, 1, MAX_LIMIT);
}

function toFiniteNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toCleanString(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function toBoolean(value: unknown) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
    if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  }

  return undefined;
}

function normalizeListingPayload(listing: AlertListingPayload): AlertListingPayload {
  return {
    ...listing,
    altitude: toFiniteNumber(listing.altitude),
    soilType: toCleanString(listing.soilType),
    hasPolybutyleneRisk: toBoolean(listing.hasPolybutyleneRisk),
  };
}

function asListingPayload(payload: unknown): AlertListingPayload | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;

  const listing = payload as AlertListingPayload;
  const identity = listing.propertyId || listing.id || listing.slug || listing.mlsId;

  if (!identity && !listing.address) return null;
  return normalizeListingPayload(listing);
}

function getFailureMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Unknown alert processing failure.';
}

function getPublicBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://davidquinngroup.com';
  return configuredUrl.replace(/\/+$/, '');
}

function getSummaryRecommendation(summary: Pick<AlertQueueSummary, 'dryRun' | 'failed' | 'scanned' | 'sent' | 'skipped' | 'preview'>) {
  if (summary.failed > 0) return 'Review failed alert rows before running another live or larger alert batch.';
  if (summary.dryRun && summary.preview > 0) return 'Dry-run preview found sendable alert rows; review them before live processing.';
  if (summary.dryRun && summary.scanned > 0) return 'Dry-run preview completed; no sendable rows were found after skips.';
  if (summary.dryRun) return 'Dry-run found no pending alert work.';
  if (summary.sent > 0) return 'Live alert run sent email; verify EmailLog, unsubscribe safety, and alert statuses.';
  if (summary.skipped > 0) return 'Live alert run completed with skipped rows; review skip reasons before broadening scope.';
  return 'No alert work was required for this run.';
}

function emptySummary(dryRun: boolean, requestedLimit: number, startedAt: string): AlertQueueSummary {
  return {
    success: true,
    scanned: 0,
    actionable: 0,
    preview: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
    dryRun,
    mode: dryRun ? 'preview' : 'live',
    requestedLimit,
    startedAt,
    completedAt: null,
    durationMs: null,
    recommendation: 'Alert queue run has not completed.',
    alerts: [],
  };
}

function applyProcessedAlert(summary: AlertQueueSummary, processed: ProcessedAlert) {
  summary.alerts.push(processed);

  if (processed.status === 'sent') summary.sent++;
  if (processed.status === 'preview') summary.preview++;
  if (processed.status === 'skipped') summary.skipped++;
  if (processed.status === 'failed') {
    summary.failed++;
    summary.success = false;
  }
}

function getListingSubject(listing: AlertListingPayload) {
  return `David Quinn Group property intelligence: ${listing.address || listing.mlsId || listing.slug || 'new match'}`;
}

async function createUnsubscribeUrl(userId: string) {
  const unsubscribeToken = await prisma.unsubscribeToken.create({
    data: {
      token: randomUUID(),
      userId,
    },
    select: {
      token: true,
    },
  });

  return `${getPublicBaseUrl()}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken.token)}`;
}

async function markAlertStatus(alertId: string, status: 'sent' | 'skipped' | 'failed' | 'processing') {
  await prisma.alertQueue.update({
    where: { id: alertId },
    data: { status },
  });
}

async function claimAlert(alert: AlertWithUser) {
  if (alert.status !== 'pending') return false;

  const result = await prisma.alertQueue.updateMany({
    where: {
      id: alert.id,
      status: 'pending',
    },
    data: {
      status: 'processing',
    },
  });

  return result.count === 1;
}

function previewAlert(alert: AlertWithUser): ProcessedAlert {
  const email = alert.user?.email || undefined;
  const listing = asListingPayload(alert.payload);

  if (alert.status !== 'pending') {
    return {
      id: alert.id,
      userId: alert.userId,
      email,
      status: 'skipped',
      reason: `Alert already has status "${alert.status}".`,
    };
  }

  if (!email) {
    return {
      id: alert.id,
      userId: alert.userId,
      status: 'skipped',
      reason: 'User has no email address.',
    };
  }

  if (alert.user?.isUnsubscribed) {
    return {
      id: alert.id,
      userId: alert.userId,
      email,
      status: 'skipped',
      reason: 'User is unsubscribed.',
    };
  }

  if (!listing) {
    return {
      id: alert.id,
      userId: alert.userId,
      email,
      status: 'failed',
      reason: 'Alert payload does not contain a usable property.',
    };
  }

  return {
    id: alert.id,
    userId: alert.userId,
    email,
    status: 'preview',
    reason: 'Ready to send.',
  };
}

async function processAlert(alert: AlertWithUser, dryRun: boolean): Promise<ProcessedAlert> {
  const email = alert.user?.email || undefined;
  const listing = asListingPayload(alert.payload);

  if (dryRun) return previewAlert(alert);

  if (alert.status !== 'pending' && alert.status !== 'processing') {
    return {
      id: alert.id,
      userId: alert.userId,
      email,
      status: 'skipped',
      reason: `Alert already has status "${alert.status}".`,
    };
  }

  const claimed = await claimAlert(alert);

  if (!claimed) {
    return {
      id: alert.id,
      userId: alert.userId,
      email,
      status: 'skipped',
      reason: 'Alert was already claimed by another worker or is no longer pending.',
    };
  }

  if (!email) {
    await markAlertStatus(alert.id, 'skipped');

    return {
      id: alert.id,
      userId: alert.userId,
      status: 'skipped',
      reason: 'User has no email address.',
    };
  }

  if (alert.user?.isUnsubscribed) {
    await markAlertStatus(alert.id, 'skipped');

    return {
      id: alert.id,
      userId: alert.userId,
      email,
      status: 'skipped',
      reason: 'User is unsubscribed.',
    };
  }

  if (!listing) {
    await markAlertStatus(alert.id, 'failed');

    return {
      id: alert.id,
      userId: alert.userId,
      email,
      status: 'failed',
      reason: 'Alert payload does not contain a usable property.',
    };
  }

  try {
    const unsubscribeUrl = await createUnsubscribeUrl(alert.userId);

    await sendEmail(email, [listing], {
      unsubscribeUrl,
      userId: alert.userId,
      source: 'email_alert',
    });

    await prisma.$transaction([
      prisma.alertQueue.update({
        where: { id: alert.id },
        data: { status: 'sent' },
      }),
      prisma.emailLog.create({
        data: {
          userId: alert.userId,
          type: 'PROPERTY_ALERT',
          subject: getListingSubject(listing),
        },
      }),
    ]);

    return {
      id: alert.id,
      userId: alert.userId,
      email,
      status: 'sent',
    };
  } catch (error) {
    const message = getFailureMessage(error);

    await markAlertStatus(alert.id, 'failed');

    return {
      id: alert.id,
      userId: alert.userId,
      email,
      status: 'failed',
      reason: message,
    };
  }
}

async function fetchAlertById(alertId: string) {
  return prisma.alertQueue.findUnique({
    where: {
      id: alertId,
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
  });
}

async function fetchPendingAlerts(limit: number) {
  return prisma.alertQueue.findMany({
    where: {
      status: 'pending',
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          isUnsubscribed: true,
        },
      },
    },
  });
}

export async function processAlertById(alertId: string, dryRun = false): Promise<ProcessedAlert> {
  const alert = await fetchAlertById(alertId);

  if (!alert) {
    return {
      id: alertId,
      userId: '',
      status: 'failed',
      reason: 'Alert queue record was not found.',
    };
  }

  return processAlert(alert, dryRun);
}

export async function processAlertQueue(options: ProcessAlertQueueOptions = {}): Promise<AlertQueueSummary> {
  const limit = getLimit(options.limit);
  const dryRun = Boolean(options.dryRun);
  const startedMs = Date.now();
  const startedAt = new Date(startedMs).toISOString();
  const summary = emptySummary(dryRun, limit, startedAt);
  const alerts = await fetchPendingAlerts(limit);

  summary.scanned = alerts.length;

  for (const alert of alerts) {
    const processed = await processAlert(alert, dryRun);
    applyProcessedAlert(summary, processed);
  }

  summary.actionable = summary.preview + summary.sent;
  summary.completedAt = new Date().toISOString();
  summary.durationMs = Date.now() - startedMs;
  summary.recommendation = getSummaryRecommendation(summary);

  return summary;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/processAlertQueue.ts
