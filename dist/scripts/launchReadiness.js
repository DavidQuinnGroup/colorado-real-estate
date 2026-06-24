import '../lib/env/loadNodeEnv.js';
import { prisma } from '../lib/prisma.js';
import { assertDatabaseReady } from '../lib/queue/databasePreflight.js';
const TERMINAL = 'Terminal 5';
const DEFAULT_FROM = 'David Quinn Group <alerts@davidquinngroup.com>';
function getEnv(name) {
    const value = process.env[name];
    return typeof value === 'string' ? value.trim() : '';
}
function readBooleanEnv(name) {
    const normalized = getEnv(name).toLowerCase();
    if (['1', 'true', 'yes', 'y'].includes(normalized))
        return true;
    if (['0', 'false', 'no', 'n', ''].includes(normalized))
        return false;
    return false;
}
function normalizeEmail(value) {
    const angleMatch = value.match(/<([^<>@\s]+@[^<>@\s]+\.[^<>@\s]+)>/);
    return angleMatch?.[1] || value;
}
function isLikelyEmail(value) {
    return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(normalizeEmail(value));
}
function maskEmail(value) {
    const email = normalizeEmail(value);
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain)
        return 'invalid-email';
    return `${localPart.slice(0, 2)}***@${domain}`;
}
function getPublicBaseUrl() {
    return getEnv('NEXT_PUBLIC_SITE_URL') || getEnv('PUBLIC_SITE_URL') || 'https://davidquinngroup.com';
}
function checkResendApiKey(scope) {
    const apiKey = getEnv('RESEND_API_KEY');
    if (!apiKey) {
        return {
            name: 'RESEND_API_KEY',
            status: 'fail',
            detail: `Missing; ${scope} email cannot send.`,
        };
    }
    if (!apiKey.startsWith('re_') || apiKey.length < 12) {
        return {
            name: 'RESEND_API_KEY',
            status: 'fail',
            detail: 'Present but does not match the expected Resend key shape.',
        };
    }
    return {
        name: 'RESEND_API_KEY',
        status: 'pass',
        detail: 'Present with expected Resend key shape; value was not printed.',
    };
}
function checkSender({ warnOnFallback }) {
    const configured = getEnv('RESEND_FROM_EMAIL');
    const sender = configured || DEFAULT_FROM;
    if (!isLikelyEmail(sender)) {
        return {
            name: 'RESEND_FROM_EMAIL',
            status: 'fail',
            detail: 'Sender is configured but does not look like a valid email address.',
        };
    }
    return {
        name: 'RESEND_FROM_EMAIL',
        status: configured || !warnOnFallback ? 'pass' : 'warn',
        detail: configured ? `Sender resolves to ${maskEmail(sender)}.` : `Using built-in sender fallback ${maskEmail(sender)}.`,
    };
}
function checkReplyTo(scope, missingDetail) {
    const replyTo = getEnv('RESEND_REPLY_TO_EMAIL');
    if (!replyTo) {
        return {
            name: 'RESEND_REPLY_TO_EMAIL',
            status: 'warn',
            detail: missingDetail || `Not configured; ${scope} emails will omit an explicit reply-to.`,
        };
    }
    if (!isLikelyEmail(replyTo)) {
        return {
            name: 'RESEND_REPLY_TO_EMAIL',
            status: 'fail',
            detail: 'Reply-to is configured but does not look like a valid email address.',
        };
    }
    return {
        name: 'RESEND_REPLY_TO_EMAIL',
        status: 'pass',
        detail: `Reply-to resolves to ${maskEmail(replyTo)}.`,
    };
}
function checkPublicUrl(scope) {
    const baseUrl = getPublicBaseUrl();
    try {
        const url = new URL(baseUrl);
        return {
            name: 'NEXT_PUBLIC_SITE_URL',
            status: url.protocol === 'https:' ? 'pass' : 'warn',
            detail: url.protocol === 'https:'
                ? `${scope} links will use ${url.origin}.`
                : `${scope} links resolve, but protocol is ${url.protocol || 'unknown'} instead of https.`,
        };
    }
    catch {
        return {
            name: 'NEXT_PUBLIC_SITE_URL',
            status: 'fail',
            detail: 'Public site URL is not a valid absolute URL.',
        };
    }
}
function checkPropertyInquiryRecipient() {
    const propertyRecipient = getEnv('PROPERTY_INQUIRY_NOTIFY_TO');
    const fallbackRecipient = getEnv('REIE_INTERNAL_EMAIL');
    const recipient = propertyRecipient || fallbackRecipient;
    if (!recipient) {
        return {
            name: 'PROPERTY_INQUIRY_NOTIFY_TO',
            status: 'fail',
            detail: 'Missing and REIE_INTERNAL_EMAIL fallback is not set.',
        };
    }
    if (!isLikelyEmail(recipient)) {
        return {
            name: 'PROPERTY_INQUIRY_NOTIFY_TO',
            status: 'fail',
            detail: 'Recipient is configured but does not look like an email address.',
        };
    }
    return {
        name: 'PROPERTY_INQUIRY_NOTIFY_TO',
        status: propertyRecipient ? 'pass' : 'warn',
        detail: propertyRecipient
            ? `Property inquiry recipient is configured as ${maskEmail(propertyRecipient)}.`
            : `Using REIE_INTERNAL_EMAIL fallback ${maskEmail(fallbackRecipient)}.`,
    };
}
function checkPropertyInquiryDryRunDisabled() {
    if (readBooleanEnv('PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN')) {
        return {
            name: 'PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN',
            status: 'fail',
            detail: 'Enabled; property-inquiry notification sends are suppressed.',
        };
    }
    return {
        name: 'PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN',
        status: 'pass',
        detail: 'Disabled or unset; property-inquiry notification sends are not suppressed by dry-run mode.',
    };
}
function getGateLevel(checks) {
    if (checks.some((check) => check.status === 'fail'))
        return 'blocked';
    if (checks.some((check) => check.status === 'warn'))
        return 'watch';
    return 'ready';
}
function getGateSummary(name, level) {
    if (level === 'blocked')
        return `${name} has required blockers.`;
    if (level === 'watch')
        return `${name} is usable with operator review.`;
    return `${name} is ready.`;
}
function buildGate(name, checks) {
    const level = getGateLevel(checks);
    return {
        name,
        level,
        summary: getGateSummary(name, level),
        checks,
    };
}
function getBlockedBy(gates) {
    return gates.flatMap((gate) => gate.checks
        .filter((check) => check.status === 'fail')
        .map((check) => {
        if (check.name === 'PROPERTY_INQUIRY_NOTIFY_TO') {
            return {
                code: 'property_inquiry_recipient_missing',
                gate: gate.name,
                envVars: ['PROPERTY_INQUIRY_NOTIFY_TO', 'REIE_INTERNAL_EMAIL'],
                detail: check.detail,
                nextCommand: 'npm run check:property-inquiry-notification:readiness',
            };
        }
        if (check.name === 'PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN') {
            return {
                code: 'property_inquiry_dry_run_enabled',
                gate: gate.name,
                envVars: ['PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN'],
                detail: check.detail,
                nextCommand: 'npm run check:property-inquiry-notification:readiness',
            };
        }
        return {
            code: check.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''),
            gate: gate.name,
            envVars: [check.name],
            detail: check.detail,
            nextCommand: 'npm run check:launch-readiness',
        };
    }));
}
function getOverallReadiness(gates) {
    const blocked = gates.filter((gate) => gate.level === 'blocked');
    const watch = gates.filter((gate) => gate.level === 'watch');
    if (blocked.length > 0) {
        return {
            level: 'blocked',
            summary: `${blocked.length} launch gate${blocked.length === 1 ? '' : 's'} blocked.`,
            nextAction: 'Resolve blocked launch gates before relying on live notification delivery.',
            nextCommand: 'npm run check:launch-readiness',
        };
    }
    if (watch.length > 0) {
        return {
            level: 'watch',
            summary: `${watch.length} launch gate${watch.length === 1 ? '' : 's'} require operator review.`,
            nextAction: 'Review watch gates, then run final protected dry-runs before live processing.',
            nextCommand: 'npm run run:alerts:dry -- --limit 50',
        };
    }
    return {
        level: 'ready',
        summary: 'Core notification launch gates are ready for final dry-run review.',
        nextAction: 'Run final protected saved-search alert dry-run before live processing.',
        nextCommand: 'npm run run:alerts:dry -- --limit 50',
    };
}
async function main() {
    await assertDatabaseReady({
        operation: 'launch readiness',
        recoveryCommand: 'npm run supabase:check:json',
    });
    const [pendingAlerts, failedAlerts, processingAlerts] = await Promise.all([
        prisma.alertQueue.count({ where: { status: 'pending' } }),
        prisma.alertQueue.count({ where: { status: 'failed' } }),
        prisma.alertQueue.count({ where: { status: 'processing' } }),
    ]);
    const savedSearchAlertGate = buildGate('Saved-search alert email', [
        checkResendApiKey('saved-search alert'),
        checkSender({ warnOnFallback: true }),
        checkReplyTo('saved-search alert'),
        checkPublicUrl('Saved-search alert'),
        {
            name: 'AlertQueue failed rows',
            status: failedAlerts > 0 ? 'fail' : 'pass',
            detail: `${failedAlerts} failed saved-search alert row${failedAlerts === 1 ? '' : 's'} found.`,
        },
        {
            name: 'AlertQueue processing rows',
            status: processingAlerts > 0 ? 'warn' : 'pass',
            detail: `${processingAlerts} processing saved-search alert row${processingAlerts === 1 ? '' : 's'} found.`,
        },
        {
            name: 'AlertQueue pending rows',
            status: pendingAlerts > 0 ? 'warn' : 'pass',
            detail: pendingAlerts > 0
                ? `${pendingAlerts} pending saved-search alert row${pendingAlerts === 1 ? '' : 's'} require final dry-run review before live processing.`
                : 'No pending saved-search alert rows are waiting.',
        },
    ]);
    const propertyInquiryGate = buildGate('Property-inquiry notification email', [
        checkResendApiKey('property-inquiry notification'),
        checkPropertyInquiryRecipient(),
        checkPropertyInquiryDryRunDisabled(),
        checkSender({ warnOnFallback: false }),
        checkReplyTo('property-inquiry notification', 'Not configured; property inquiry emails will reply directly to the lead email.'),
        checkPublicUrl('Property inquiry'),
    ]);
    const databaseGate = buildGate('Supabase connectivity', [
        {
            name: 'Database preflight',
            status: 'pass',
            detail: 'Prisma SELECT 1 passed before launch readiness checks.',
        },
    ]);
    const gates = [databaseGate, savedSearchAlertGate, propertyInquiryGate];
    const readiness = getOverallReadiness(gates);
    const blockedBy = getBlockedBy(gates);
    console.log(JSON.stringify({
        success: readiness.level !== 'blocked',
        check: 'reie-launch-readiness',
        sendsEmail: false,
        mutatesRows: false,
        terminal: TERMINAL,
        generatedAt: new Date().toISOString(),
        readiness,
        blockedBy,
        queue: {
            pendingAlerts,
            failedAlerts,
            processingAlerts,
        },
        gates,
        commands: {
            launchReadiness: 'npm run check:launch-readiness',
            savedSearchAlertReadiness: 'npm run check:alert-notification-readiness',
            propertyInquiryReadiness: 'npm run check:property-inquiry-notification:readiness',
            notificationReadiness: 'npm run check:notification-readiness',
            strictNotificationReadiness: 'npm run check:notification-readiness:strict',
            strictNotificationReadinessContract: 'npm run check:notification-readiness:strict-contract',
            savedSearchAlertDryRun: 'npm run run:alerts:dry -- --limit 50',
        },
    }, null, 2));
    if (readiness.level === 'blocked')
        process.exitCode = 1;
}
main()
    .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/launchReadiness.ts
