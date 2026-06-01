import { randomUUID } from 'node:crypto';
import { sendEmail } from '../lib/email/sendEmail.js';
import { prisma } from '../lib/prisma.js';
import { assertDatabaseReady } from '../lib/queue/databasePreflight.js';
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 500;
const SUPABASE_CHECK_JSON_COMMAND = 'npm run supabase:check:json';
const HELP_TEXT = `
REIE digest sender

Usage:
  node dist/scripts/sendDigest.js [options]

Options:
  --limit <number>    Maximum users to scan. Default: ${DEFAULT_LIMIT}, max: ${MAX_LIMIT}.
  --limit=<number>    Same as --limit <number>.
  --dry-run           Preview digest recipients without sending email or changing status.
  --help              Show this help text.

Environment:
  DIGEST_RUN_LIMIT     Default limit when --limit is omitted.
  DIGEST_RUN_DRY_RUN   Set to true, 1, or yes to force dry-run mode.

Examples:
  node dist/scripts/sendDigest.js --dry-run
  node dist/scripts/sendDigest.js --limit 25
  node dist/scripts/sendDigest.js --limit=25 --dry-run
`;
function printHelp() {
    console.log(HELP_TEXT.trim());
}
function parseBoundedInteger(value, name, min, max) {
    if (!value)
        throw new Error(`Missing value for ${name}.`);
    const parsed = Number(value);
    if (!Number.isInteger(parsed))
        throw new Error(`Invalid integer for ${name}: ${value}`);
    if (parsed < min || parsed > max)
        throw new Error(`${name} must be between ${min} and ${max}.`);
    return parsed;
}
function readBoolean(value) {
    const normalized = String(value || '').trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
}
function readFlagValue(arg) {
    const [, value] = arg.split('=');
    return value;
}
function readDefaultLimit() {
    if (!process.env.DIGEST_RUN_LIMIT)
        return DEFAULT_LIMIT;
    return parseBoundedInteger(process.env.DIGEST_RUN_LIMIT, 'DIGEST_RUN_LIMIT', 1, MAX_LIMIT);
}
function parseArgs(argv) {
    const options = {
        limit: readDefaultLimit(),
        dryRun: readBoolean(process.env.DIGEST_RUN_DRY_RUN),
    };
    for (let index = 0; index < argv.length; index++) {
        const arg = argv[index];
        if (arg === '--help' || arg === '-h') {
            printHelp();
            return null;
        }
        if (arg === '--dry-run') {
            options.dryRun = true;
            continue;
        }
        if (arg === '--limit') {
            options.limit = parseBoundedInteger(argv[index + 1], '--limit', 1, MAX_LIMIT);
            index++;
            continue;
        }
        if (arg.startsWith('--limit=')) {
            options.limit = parseBoundedInteger(readFlagValue(arg), '--limit', 1, MAX_LIMIT);
            continue;
        }
        throw new Error(`Unknown option: ${arg}`);
    }
    return options;
}
function isDigestListing(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        return false;
    const listing = value;
    return Boolean(listing.propertyId || listing.id || listing.slug || listing.mlsId || listing.address);
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
function normalizeDigestListing(listing) {
    return {
        ...listing,
        altitude: toFiniteNumber(listing.altitude),
        soilType: toCleanString(listing.soilType),
        hasPolybutyleneRisk: toBoolean(listing.hasPolybutyleneRisk),
    };
}
function getPublicBaseUrl() {
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'https://davidquinngroup.com';
    return configuredUrl.replace(/\/+$/, '');
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
function partitionAlerts(alerts) {
    const valid = [];
    const invalid = [];
    for (const alert of alerts) {
        if (isDigestListing(alert.payload)) {
            valid.push({
                ...alert,
                listing: normalizeDigestListing(alert.payload),
            });
        }
        else {
            invalid.push(alert);
        }
    }
    return { valid, invalid };
}
async function markAlerts(alertIds, status) {
    if (!alertIds.length)
        return 0;
    const result = await prisma.alertQueue.updateMany({
        where: {
            id: {
                in: alertIds,
            },
        },
        data: {
            status,
        },
    });
    return result.count;
}
async function markInvalidAlertsFailed(alerts, dryRun) {
    if (dryRun || alerts.length === 0)
        return 0;
    return markAlerts(alerts.map((alert) => alert.id), 'failed');
}
async function claimPendingAlerts(alerts) {
    const claimed = [];
    for (const alert of alerts) {
        const result = await prisma.alertQueue.updateMany({
            where: {
                id: alert.id,
                status: 'pending',
            },
            data: {
                status: 'processing',
            },
        });
        if (result.count === 1) {
            claimed.push(alert);
        }
    }
    return claimed;
}
function buildResult(user, status, listings, alerts, reason) {
    return {
        userId: user.id,
        email: user.email,
        status,
        listings,
        alerts,
        reason,
    };
}
async function sendUserDigest(user, dryRun) {
    if (!user.email.trim()) {
        await markInvalidAlertsFailed(user.alertQueue, dryRun);
        return buildResult(user, 'skipped', 0, user.alertQueue.length, 'User has no email address.');
    }
    const { valid, invalid } = partitionAlerts(user.alertQueue);
    await markInvalidAlertsFailed(invalid, dryRun);
    if (!valid.length) {
        return buildResult(user, 'skipped', 0, invalid.length, 'No usable listing payloads.');
    }
    if (dryRun) {
        const reason = invalid.length
            ? `Ready to send. ${invalid.length} malformed alert payload${invalid.length === 1 ? '' : 's'} would be marked failed.`
            : 'Ready to send.';
        return buildResult(user, 'preview', valid.length, user.alertQueue.length, reason);
    }
    const claimed = await claimPendingAlerts(valid);
    if (!claimed.length) {
        return buildResult(user, 'skipped', 0, valid.length, 'No pending alerts could be claimed.');
    }
    const claimedAlertIds = claimed.map((alert) => alert.id);
    const listings = claimed.map((alert) => alert.listing);
    try {
        const unsubscribeUrl = await createUnsubscribeUrl(user.id);
        await sendEmail(user.email, listings, {
            unsubscribeUrl,
            userId: user.id,
            source: 'email_digest',
        });
        await prisma.$transaction([
            prisma.alertQueue.updateMany({
                where: {
                    id: {
                        in: claimedAlertIds,
                    },
                    status: 'processing',
                },
                data: {
                    status: 'sent',
                },
            }),
            prisma.emailLog.create({
                data: {
                    userId: user.id,
                    type: 'PROPERTY_DIGEST',
                    subject: `David Quinn Group: ${listings.length} property intelligence update${listings.length === 1 ? '' : 's'}`,
                },
            }),
        ]);
        return buildResult(user, 'sent', listings.length, claimedAlertIds.length + invalid.length, '');
    }
    catch (error) {
        await markAlerts(claimedAlertIds, 'failed');
        const reason = error instanceof Error ? error.message : 'Unknown digest send failure.';
        return buildResult(user, 'failed', listings.length, claimedAlertIds.length, reason);
    }
}
function printResult(results, options, scanned) {
    const sent = results.filter((result) => result.status === 'sent').length;
    const skipped = results.filter((result) => result.status === 'skipped').length;
    const previews = results.filter((result) => result.status === 'preview').length;
    const failed = results.filter((result) => result.status === 'failed').length;
    console.log('REIE digest run complete:', {
        scanned,
        sent,
        skipped,
        previews,
        failed,
        dryRun: options.dryRun,
        success: failed === 0,
    });
    if (!results.length) {
        console.log('No users with pending digest alerts matched this run.');
        return;
    }
    console.table(results.map((result) => ({
        userId: result.userId,
        email: result.email,
        status: result.status,
        listings: result.listings,
        alerts: result.alerts,
        reason: result.reason,
    })));
}
async function runDigest() {
    const options = parseArgs(process.argv.slice(2));
    if (!options)
        return;
    console.log('REIE digest run starting:', options);
    await assertDatabaseReady({
        operation: 'digest sender',
        recoveryCommand: SUPABASE_CHECK_JSON_COMMAND,
    });
    const users = await prisma.user.findMany({
        where: {
            isUnsubscribed: false,
            alertQueue: {
                some: {
                    status: 'pending',
                },
            },
        },
        take: options.limit,
        orderBy: {
            createdAt: 'asc',
        },
        select: {
            id: true,
            email: true,
            alertQueue: {
                where: {
                    status: 'pending',
                },
                orderBy: {
                    createdAt: 'asc',
                },
                select: {
                    id: true,
                    payload: true,
                },
            },
        },
    });
    const results = [];
    for (const user of users) {
        results.push(await sendUserDigest(user, options.dryRun));
    }
    printResult(results, options, users.length);
    if (results.some((result) => result.status === 'failed')) {
        process.exitCode = 1;
    }
}
runDigest()
    .catch((error) => {
    console.error('REIE digest run failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/sendDigest.ts
