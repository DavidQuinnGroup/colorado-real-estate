import { randomUUID } from 'node:crypto';
import { sendEmail } from '../email/sendEmail.js';
import { prisma } from '../prisma.js';
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
function toPositiveInteger(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed))
        return fallback;
    return Math.min(Math.max(Math.floor(parsed), min), max);
}
function getLimit(limit) {
    return toPositiveInteger(limit, DEFAULT_LIMIT, 1, MAX_LIMIT);
}
function toFiniteNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}
function toCleanString(value) {
    if (typeof value !== 'string')
        return undefined;
    const trimmed = value.trim();
    return trimmed || undefined;
}
function toBoolean(value) {
    if (typeof value === 'boolean')
        return value;
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'true' || normalized === '1' || normalized === 'yes')
            return true;
        if (normalized === 'false' || normalized === '0' || normalized === 'no')
            return false;
    }
    return undefined;
}
function normalizeListingPayload(listing) {
    return {
        ...listing,
        altitude: toFiniteNumber(listing.altitude),
        soilType: toCleanString(listing.soilType),
        hasPolybutyleneRisk: toBoolean(listing.hasPolybutyleneRisk),
    };
}
function asListingPayload(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload))
        return null;
    const listing = payload;
    const identity = listing.propertyId || listing.id || listing.slug || listing.mlsId;
    if (!identity && !listing.address)
        return null;
    return normalizeListingPayload(listing);
}
function getFailureMessage(error) {
    if (error instanceof Error)
        return error.message;
    return 'Unknown alert processing failure.';
}
function getPublicBaseUrl() {
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://davidquinngroup.com';
    return configuredUrl.replace(/\/+$/, '');
}
function getSummaryRecommendation(summary) {
    if (summary.failed > 0)
        return 'Review failed alert rows before running another live or larger alert batch.';
    if (summary.dryRun && summary.preview > 0)
        return 'Dry-run preview found sendable alert rows; review them before live processing.';
    if (summary.dryRun && summary.scanned > 0)
        return 'Dry-run preview completed; no sendable rows were found after skips.';
    if (summary.dryRun)
        return 'Dry-run found no pending alert work.';
    if (summary.sent > 0)
        return 'Live alert run sent email; verify EmailLog, unsubscribe safety, and alert statuses.';
    if (summary.skipped > 0)
        return 'Live alert run completed with skipped rows; review skip reasons before broadening scope.';
    return 'No alert work was required for this run.';
}
function emptySummary(dryRun, requestedLimit, startedAt) {
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
function applyProcessedAlert(summary, processed) {
    summary.alerts.push(processed);
    if (processed.status === 'sent')
        summary.sent++;
    if (processed.status === 'preview')
        summary.preview++;
    if (processed.status === 'skipped')
        summary.skipped++;
    if (processed.status === 'failed') {
        summary.failed++;
        summary.success = false;
    }
}
function getListingSubject(listing) {
    return `David Quinn Group property intelligence: ${listing.address || listing.mlsId || listing.slug || 'new match'}`;
}
async function createUnsubscribeUrl(userId) {
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
async function markAlertStatus(alertId, status) {
    await prisma.alertQueue.update({
        where: { id: alertId },
        data: { status },
    });
}
async function claimAlert(alert) {
    if (alert.status !== 'pending')
        return false;
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
function previewAlert(alert) {
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
async function processAlert(alert, dryRun) {
    const email = alert.user?.email || undefined;
    const listing = asListingPayload(alert.payload);
    if (dryRun)
        return previewAlert(alert);
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
    }
    catch (error) {
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
async function fetchAlertById(alertId) {
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
async function fetchPendingAlerts(limit) {
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
export async function processAlertById(alertId, dryRun = false) {
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
export async function processAlertQueue(options = {}) {
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
