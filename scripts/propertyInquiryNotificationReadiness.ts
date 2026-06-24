import '../lib/env/loadNodeEnv.js';

type CheckStatus = 'pass' | 'fail' | 'warn';

type CheckResult = {
  name: string;
  status: CheckStatus;
  detail: string;
};

type ReadinessBlocker = {
  code: string;
  envVars: string[];
  detail: string;
  nextCommand: string;
};

const TERMINAL = 'Terminal 5';

function getEnv(name: string) {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

function readBooleanEnv(name: string) {
  const normalized = getEnv(name).toLowerCase();
  if (['1', 'true', 'yes', 'y'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n', ''].includes(normalized)) return false;
  return false;
}

function normalizeEmail(value: string) {
  const angleMatch = value.match(/<([^<>@\s]+@[^<>@\s]+\.[^<>@\s]+)>/);
  return angleMatch?.[1] || value;
}

function isLikelyEmail(value: string) {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(normalizeEmail(value));
}

function maskEmail(value: string) {
  const email = normalizeEmail(value);
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return 'invalid-email';

  return `${localPart.slice(0, 2)}***@${domain}`;
}

function getPublicBaseUrl() {
  return getEnv('NEXT_PUBLIC_SITE_URL') || getEnv('PUBLIC_SITE_URL') || 'https://davidquinngroup.com';
}

function checkResendApiKey(): CheckResult {
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

function checkRecipient(): CheckResult {
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

function checkDryRunDisabled(): CheckResult {
  if (readBooleanEnv('PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN')) {
    return {
      name: 'PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN',
      status: 'fail',
      detail: 'Enabled; high-priority property inquiry notifications will not send while dry-run is active.',
    };
  }

  return {
    name: 'PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN',
    status: 'pass',
    detail: 'Disabled or unset; helper is allowed to send when all other delivery gates pass.',
  };
}

function checkFromEmail(): CheckResult {
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

function checkReplyToEmail(): CheckResult {
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

function checkPublicUrl(): CheckResult {
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
  } catch {
    return {
      name: 'NEXT_PUBLIC_SITE_URL',
      status: 'fail',
      detail: 'Public site URL is not a valid absolute URL.',
    };
  }
}

function getReadiness(checks: CheckResult[]) {
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

function getBlockedBy(checks: CheckResult[]): ReadinessBlocker[] {
  return checks
    .filter((check) => check.status === 'fail')
    .map((check) => {
      if (check.name === 'PROPERTY_INQUIRY_NOTIFY_TO') {
        return {
          code: 'property_inquiry_recipient_missing',
          envVars: ['PROPERTY_INQUIRY_NOTIFY_TO', 'REIE_INTERNAL_EMAIL'],
          detail: check.detail,
          nextCommand: 'npm run check:property-inquiry-notification:readiness',
        };
      }

      if (check.name === 'PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN') {
        return {
          code: 'property_inquiry_dry_run_enabled',
          envVars: ['PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN'],
          detail: check.detail,
          nextCommand: 'npm run check:property-inquiry-notification:readiness',
        };
      }

      return {
        code: check.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''),
        envVars: [check.name],
        detail: check.detail,
        nextCommand: 'npm run check:property-inquiry-notification:readiness',
      };
    });
}

function main() {
  const checks = [
    checkResendApiKey(),
    checkRecipient(),
    checkDryRunDisabled(),
    checkFromEmail(),
    checkReplyToEmail(),
    checkPublicUrl(),
  ];
  const readiness = getReadiness(checks);
  const blockedBy = getBlockedBy(checks);

  console.log(
    JSON.stringify(
      {
        success: readiness.level !== 'blocked',
        check: 'property-inquiry-notification-readiness',
        sendsEmail: false,
        mutatesRows: false,
        terminal: TERMINAL,
        generatedAt: new Date().toISOString(),
        readiness,
        blockedBy,
        checks,
        nextCommand:
          readiness.level === 'blocked'
            ? 'npm run check:property-inquiry-notification:readiness'
            : 'npm run check:notification-readiness',
        commands: {
          propertyInquiryReadiness: 'npm run check:property-inquiry-notification:readiness',
          notificationReadiness: 'npm run check:notification-readiness',
          strictNotificationReadiness: 'npm run check:notification-readiness:strict',
          strictNotificationReadinessContract: 'npm run check:notification-readiness:strict-contract',
          launchReadiness: 'npm run check:launch-readiness',
        },
      },
      null,
      2,
    ),
  );

  if (readiness.level === 'blocked') process.exitCode = 1;
}

main();
