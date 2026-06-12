import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });
function getEnv(name) {
    const value = process.env[name];
    return typeof value === 'string' ? value.trim() : '';
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
function checkResendApiKey() {
    const apiKey = getEnv('RESEND_API_KEY');
    if (!apiKey) {
        return {
            name: 'RESEND_API_KEY',
            status: 'fail',
            detail: 'Missing; high-priority property inquiry notifications cannot send.',
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
function checkRecipient() {
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
function checkFromEmail() {
    const fromEmail = getEnv('RESEND_FROM_EMAIL') || 'David Quinn Group <alerts@davidquinngroup.com>';
    if (!isLikelyEmail(fromEmail)) {
        return {
            name: 'RESEND_FROM_EMAIL',
            status: 'fail',
            detail: 'Sender is configured but does not look like a valid email address.',
        };
    }
    return {
        name: 'RESEND_FROM_EMAIL',
        status: 'pass',
        detail: `Sender resolves to ${maskEmail(fromEmail)}.`,
    };
}
function checkReplyToEmail() {
    const replyToEmail = getEnv('RESEND_REPLY_TO_EMAIL');
    if (!replyToEmail) {
        return {
            name: 'RESEND_REPLY_TO_EMAIL',
            status: 'warn',
            detail: 'Not configured; property inquiry emails will reply directly to the lead email.',
        };
    }
    if (!isLikelyEmail(replyToEmail)) {
        return {
            name: 'RESEND_REPLY_TO_EMAIL',
            status: 'fail',
            detail: 'Reply-to is configured but does not look like a valid email address.',
        };
    }
    return {
        name: 'RESEND_REPLY_TO_EMAIL',
        status: 'pass',
        detail: `Fallback reply-to resolves to ${maskEmail(replyToEmail)}.`,
    };
}
function checkPublicUrl() {
    const baseUrl = getPublicBaseUrl();
    try {
        const url = new URL(baseUrl);
        const isHttps = url.protocol === 'https:';
        return {
            name: 'NEXT_PUBLIC_SITE_URL',
            status: isHttps ? 'pass' : 'warn',
            detail: isHttps
                ? `Property links will use ${url.origin}.`
                : `Property links resolve, but protocol is ${url.protocol || 'unknown'} instead of https.`,
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
function getReadiness(checks) {
    const failed = checks.filter((check) => check.status === 'fail').length;
    const warnings = checks.filter((check) => check.status === 'warn').length;
    if (failed > 0) {
        return {
            level: 'blocked',
            summary: `${failed} required notification setting${failed === 1 ? '' : 's'} need attention.`,
        };
    }
    if (warnings > 0) {
        return {
            level: 'watch',
            summary: `${warnings} optional notification setting${warnings === 1 ? '' : 's'} should be reviewed.`,
        };
    }
    return {
        level: 'ready',
        summary: 'Property inquiry notification configuration is ready for high-priority sends.',
    };
}
function main() {
    const checks = [
        checkResendApiKey(),
        checkRecipient(),
        checkFromEmail(),
        checkReplyToEmail(),
        checkPublicUrl(),
    ];
    const readiness = getReadiness(checks);
    console.log(JSON.stringify({
        success: readiness.level !== 'blocked',
        check: 'property-inquiry-notification-readiness',
        sendsEmail: false,
        readiness,
        checks,
    }, null, 2));
    if (readiness.level === 'blocked')
        process.exitCode = 1;
}
main();
