import '../lib/env/loadNodeEnv.js';

import { prisma } from '../lib/prisma.js';
import { assertDatabaseReady } from '../lib/queue/databasePreflight.js';

type CheckStatus = 'pass' | 'fail' | 'warn';

type CheckResult = {
  name: string;
  status: CheckStatus;
  detail: string;
};

const TERMINAL = 'Terminal 5';
const DEFAULT_FROM = 'David Quinn Group <alerts@davidquinngroup.com>';

function getEnv(name: string) {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
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

function checkResendApiKey(): CheckResult {
  const apiKey = getEnv('RESEND_API_KEY');

  if (!apiKey) {
    return {
      name: 'RESEND_API_KEY',
      status: 'fail',
      detail: 'Missing; saved-search alert email cannot send.',
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

function checkSender(): CheckResult {
  const sender = getEnv('RESEND_FROM_EMAIL') || DEFAULT_FROM;

  if (!isLikelyEmail(sender)) {
    return {
      name: 'RESEND_FROM_EMAIL',
      status: 'fail',
      detail: 'Sender is configured but does not look like a valid email address.',
    };
  }

  return {
    name: 'RESEND_FROM_EMAIL',
    status: getEnv('RESEND_FROM_EMAIL') ? 'pass' : 'warn',
    detail: getEnv('RESEND_FROM_EMAIL')
      ? `Sender resolves to ${maskEmail(sender)}.`
      : `Using built-in sender fallback ${maskEmail(sender)}.`,
  };
}

function checkReplyTo(): CheckResult {
  const replyTo = getEnv('RESEND_REPLY_TO_EMAIL');

  if (!replyTo) {
    return {
      name: 'RESEND_REPLY_TO_EMAIL',
      status: 'warn',
      detail: 'Not configured; saved-search alerts will omit an explicit reply-to.',
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

function checkPublicUrl(): CheckResult {
  const baseUrl = getEnv('NEXT_PUBLIC_SITE_URL') || getEnv('PUBLIC_SITE_URL') || 'https://davidquinngroup.com';

  try {
    const url = new URL(baseUrl);
    return {
      name: 'NEXT_PUBLIC_SITE_URL',
      status: url.protocol === 'https:' ? 'pass' : 'warn',
      detail:
        url.protocol === 'https:'
          ? `Alert links and unsubscribe links will use ${url.origin}.`
          : `Alert links resolve, but protocol is ${url.protocol || 'unknown'} instead of https.`,
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
      summary: `${failed} required saved-search alert email setting${failed === 1 ? '' : 's'} need attention.`,
    };
  }

  if (warnings > 0) {
    return {
      level: 'watch',
      summary: `${warnings} optional saved-search alert email setting${warnings === 1 ? '' : 's'} should be reviewed.`,
    };
  }

  return {
    level: 'ready',
    summary: 'Saved-search alert email configuration is ready for dry-run-reviewed live sends.',
  };
}

async function main() {
  await assertDatabaseReady({
    operation: 'saved-search alert notification readiness',
    recoveryCommand: 'npm run supabase:check:json',
  });

  const [pending, failed, processing, recipients] = await Promise.all([
    prisma.alertQueue.count({ where: { status: 'pending' } }),
    prisma.alertQueue.count({ where: { status: 'failed' } }),
    prisma.alertQueue.count({ where: { status: 'processing' } }),
    prisma.alertQueue.findMany({
      where: {
        status: 'pending',
      },
      take: 10,
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        user: {
          select: {
            email: true,
            isUnsubscribed: true,
          },
        },
      },
    }),
  ]);

  const checks = [
    checkResendApiKey(),
    checkSender(),
    checkReplyTo(),
    checkPublicUrl(),
    {
      name: 'AlertQueue failed rows',
      status: failed > 0 ? 'fail' : 'pass',
      detail: `${failed} failed saved-search alert row${failed === 1 ? '' : 's'} found.`,
    } satisfies CheckResult,
    {
      name: 'AlertQueue processing rows',
      status: processing > 0 ? 'warn' : 'pass',
      detail: `${processing} processing saved-search alert row${processing === 1 ? '' : 's'} found.`,
    } satisfies CheckResult,
    {
      name: 'AlertQueue pending recipients',
      status: pending > 0 ? 'warn' : 'pass',
      detail:
        pending > 0
          ? `${pending} pending saved-search alert row${pending === 1 ? '' : 's'} available for dry-run review.`
          : 'No pending saved-search alert rows are waiting.',
    } satisfies CheckResult,
  ];
  const readiness = getReadiness(checks);

  console.log(
    JSON.stringify(
      {
        success: readiness.level !== 'blocked',
        check: 'saved-search-alert-notification-readiness',
        sendsEmail: false,
        mutatesRows: false,
        terminal: TERMINAL,
        generatedAt: new Date().toISOString(),
        readiness,
        queue: {
          pending,
          failed,
          processing,
          sampledRecipients: recipients.map((row) => ({
            id: row.id,
            email: row.user?.email ? maskEmail(row.user.email) : null,
            isUnsubscribed: Boolean(row.user?.isUnsubscribed),
          })),
        },
        checks,
        nextCommand:
          readiness.level === 'blocked'
            ? 'npm run check:alert-notification-readiness'
            : 'npm run run:alerts:dry -- --limit 50',
        commands: {
          savedSearchAlertReadiness: 'npm run check:alert-notification-readiness',
          notificationReadiness: 'npm run check:notification-readiness',
          strictNotificationReadiness: 'npm run check:notification-readiness:strict',
          strictNotificationReadinessContract: 'npm run check:notification-readiness:strict-contract',
          launchReadiness: 'npm run check:launch-readiness',
          savedSearchAlertDryRun: 'npm run run:alerts:dry -- --limit 50',
        },
      },
      null,
      2,
    ),
  );

  if (readiness.level === 'blocked') process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/alertNotificationReadiness.ts
