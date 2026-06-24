import { spawnSync } from 'node:child_process';

type JsonRecord = Record<string, unknown>;

type ReadinessLevel = 'ready' | 'watch' | 'blocked' | 'unknown';

type SummaryResult = {
  name: string;
  command: string;
  success: boolean;
  exitCode: number | null;
  expectedBlockedExit: boolean;
  sendsEmail: boolean | null;
  mutatesRows: boolean | null;
  terminal: string | null;
  generatedAt: string | null;
  readiness: ReadinessLevel;
  summary: string;
  failedChecks: ChildCheck[];
  warningChecks: ChildCheck[];
  blockedBy: JsonRecord[];
  nextCommand: string | null;
  commands: JsonRecord | null;
  error: string | null;
};

type ChildCheck = {
  name: string;
  status: string;
  detail: string;
};

const checks = [
  {
    name: 'Saved-search alert notification',
    command: 'node',
    args: ['dist/scripts/alertNotificationReadiness.js'],
  },
  {
    name: 'Property-inquiry notification',
    command: 'node',
    args: ['dist/scripts/propertyInquiryNotificationReadiness.js'],
  },
  {
    name: 'Aggregate launch notification readiness',
    command: 'node',
    args: ['dist/scripts/launchReadiness.js'],
  },
];
const strictMode = process.argv.includes('--strict');

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function getBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : null;
}

function getReadinessLevel(value: unknown): ReadinessLevel {
  if (value === 'ready' || value === 'watch' || value === 'blocked') return value;
  return 'unknown';
}

function getReadinessPayload(payload: JsonRecord) {
  const readiness = isRecord(payload.readiness) ? payload.readiness : {};
  return {
    level: getReadinessLevel(readiness.level),
    summary: getString(readiness.summary),
    nextCommand: getString(readiness.nextCommand) || getString(payload.nextCommand) || null,
  };
}

function getChildChecks(payload: JsonRecord) {
  const directChecks = Array.isArray(payload.checks) ? payload.checks : [];
  const gateChecks = Array.isArray(payload.gates)
    ? payload.gates.flatMap((gate) => (isRecord(gate) && Array.isArray(gate.checks) ? gate.checks : []))
    : [];

  return [...directChecks, ...gateChecks]
    .filter(isRecord)
    .map((check) => ({
      name: getString(check.name),
      status: getString(check.status),
      detail: getString(check.detail),
    }))
    .filter((check) => check.name && check.status)
    .slice(0, 12);
}

function filterChildChecks(checks: ChildCheck[], status: 'fail' | 'warn') {
  return checks.filter((check) => check.status === status).slice(0, 6);
}

function getBlockedBy(payload: JsonRecord) {
  return (Array.isArray(payload.blockedBy) ? payload.blockedBy : []).filter(isRecord).slice(0, 8);
}

function extractJson(stdout: string) {
  const start = stdout.indexOf('{');
  const end = stdout.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) return null;

  try {
    const parsed: unknown = JSON.parse(stdout.slice(start, end + 1));
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function summarizeCheck(check: (typeof checks)[number]): SummaryResult {
  const command = [check.command, ...check.args].join(' ');
  const result = spawnSync(check.command, check.args, {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  const exitCode = result.status;
  const stdout = result.stdout || '';
  const stderr = result.stderr || '';
  const payload = extractJson(stdout);
  const expectedBlockedExit = exitCode === 1 && payload !== null;

  if (!payload) {
    return {
      name: check.name,
      command,
      success: false,
      exitCode,
      expectedBlockedExit: false,
      sendsEmail: null,
      mutatesRows: null,
      terminal: null,
      generatedAt: null,
      readiness: 'unknown',
      summary: '',
      failedChecks: [],
      warningChecks: [],
      blockedBy: [],
      nextCommand: null,
      commands: null,
      error: stderr.trim() || stdout.trim() || 'Command did not return parseable JSON.',
    };
  }

  const readiness = getReadinessPayload(payload);
  const childChecks = getChildChecks(payload);
  const commandSucceeded = exitCode === 0 || expectedBlockedExit;

  return {
    name: check.name,
    command,
    success: commandSucceeded,
    exitCode,
    expectedBlockedExit,
    sendsEmail: getBoolean(payload.sendsEmail),
    mutatesRows: getBoolean(payload.mutatesRows),
    terminal: getString(payload.terminal) || null,
    generatedAt: getString(payload.generatedAt) || null,
    readiness: readiness.level,
    summary: readiness.summary,
    failedChecks: filterChildChecks(childChecks, 'fail'),
    warningChecks: filterChildChecks(childChecks, 'warn'),
    blockedBy: getBlockedBy(payload),
    nextCommand: readiness.nextCommand,
    commands: isRecord(payload.commands) ? payload.commands : null,
    error: commandSucceeded ? null : stderr.trim() || `Unexpected exit code ${exitCode ?? 'unknown'}.`,
  };
}

function getOverallReadiness(results: SummaryResult[]) {
  const failed = results.filter((result) => !result.success);
  const blocked = results.filter((result) => result.readiness === 'blocked');
  const watch = results.filter((result) => result.readiness === 'watch');

  if (failed.length > 0) {
    return {
      level: 'blocked' as const,
      summary: `${failed.length} notification readiness command${failed.length === 1 ? '' : 's'} failed unexpectedly.`,
      nextCommand: 'npm run check:notification-readiness',
    };
  }

  if (blocked.length > 0) {
    return {
      level: 'blocked' as const,
      summary: `${blocked.length} notification readiness check${blocked.length === 1 ? '' : 's'} blocked.`,
      nextCommand: 'npm run check:launch-readiness',
    };
  }

  if (watch.length > 0) {
    return {
      level: 'watch' as const,
      summary: `${watch.length} notification readiness check${watch.length === 1 ? '' : 's'} require operator review.`,
      nextCommand: 'npm run run:alerts:dry -- --limit 50',
    };
  }

  return {
    level: 'ready' as const,
    summary: 'Notification readiness checks are ready for final protected dry-run review.',
    nextCommand: 'npm run run:alerts:dry -- --limit 50',
  };
}

const results = checks.map(summarizeCheck);
const readiness = getOverallReadiness(results);
const commandSuccess = results.every((result) => result.success);
const success = commandSuccess && (!strictMode || readiness.level !== 'blocked');

console.log(
  JSON.stringify(
    {
      success,
      check: 'reie-notification-readiness-summary',
      sendsEmail: false,
      mutatesRows: false,
      strictMode,
      commandSuccess,
      terminal: 'Terminal 5',
      generatedAt: new Date().toISOString(),
      readiness,
      results,
      commands: {
        notificationReadiness: 'npm run check:notification-readiness',
        strictNotificationReadiness: 'npm run check:notification-readiness:strict',
        strictNotificationReadinessContract: 'npm run check:notification-readiness:strict-contract',
        launchReadiness: 'npm run check:launch-readiness',
        savedSearchAlertReadiness: 'npm run check:alert-notification-readiness',
        propertyInquiryReadiness: 'npm run check:property-inquiry-notification:readiness',
      },
    },
    null,
    2,
  ),
);

if (!success) process.exitCode = 1;
