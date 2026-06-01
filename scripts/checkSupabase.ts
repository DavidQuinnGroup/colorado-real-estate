import dns from 'node:dns/promises';
import net from 'node:net';

import dotenv from 'dotenv';

type CheckStatus = 'pass' | 'fail' | 'warn' | 'skip';

type CheckResult = {
  name: string;
  status: CheckStatus;
  detail: string;
};

type CheckSupabaseOptions = {
  json: boolean;
};

type ReadinessGateStatus = 'pass' | 'watch' | 'fail';

const REST_TIMEOUT_MS = 8000;
const POSTGRES_TIMEOUT_MS = 8000;
const NETWORK_CHECK_ATTEMPTS = 3;
const NETWORK_CHECK_RETRY_DELAY_MS = 250;
const RECOVERY_RUNBOOK_PATH = 'docs/supabase-recovery-runbook.md';
const SUPABASE_DASHBOARD_PROJECT_BASE_URL = 'https://supabase.com/dashboard/project';
const TERMINAL = 'Terminal 5';
const SUPABASE_ENV_NAMES = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
];

const HELP_TEXT = `
Supabase connectivity preflight

Usage:
  node dist/scripts/checkSupabase.js [options]

Options:
  --json   Print a machine-readable, non-secret JSON report.
  --help   Show this help text.

Terminal 5 examples:
  npm run supabase:check
  node dist/scripts/checkSupabase.js --json
`;

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

function parseArgs(argv: string[]): CheckSupabaseOptions | null {
  const options: CheckSupabaseOptions = {
    json: false,
  };

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      console.log(HELP_TEXT.trim());
      return null;
    }

    if (arg === '--json') {
      options.json = true;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function getEnv(name: string) {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function isPlaceholderValue(value: string) {
  if (!value) return false;
  return /<[^>]+>/.test(value) || value.includes('example.com');
}

function getPlaceholderNames(values: Record<string, string>) {
  return Object.entries(values)
    .filter(([, value]) => isPlaceholderValue(value))
    .map(([name]) => name);
}

function parseHost(value: string) {
  if (!value) return '';

  try {
    return new URL(value).host;
  } catch {
    return '';
  }
}

function parsePostgresHost(value: string) {
  if (!value) return '';

  try {
    return new URL(value).hostname;
  } catch {
    return '';
  }
}

function parsePostgresEndpoint(value: string) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : 5432,
    };
  } catch {
    return null;
  }
}

function parsePostgresFingerprint(value: string) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const username = decodeURIComponent(url.username);
    const projectRef = parseSupabaseProjectRefFromDatabaseUrl(value);

    return {
      host: url.hostname,
      port: url.port ? Number(url.port) : 5432,
      database: url.pathname.replace(/^\/+/, '') || 'postgres',
      usernamePattern: projectRef ? 'postgres.<project-ref>' : username ? 'custom-or-unrecognized' : 'missing',
      projectRef,
      schema: url.searchParams.get('schema') || 'unset',
      pgbouncer: url.searchParams.get('pgbouncer') || 'unset',
      connectionLimit: url.searchParams.get('connection_limit') || 'unset',
      sslmode: url.searchParams.get('sslmode') || 'unset',
    };
  } catch {
    return null;
  }
}

function parseSupabaseProjectRefFromUrl(value: string) {
  const host = parseHost(value);
  const [projectRef] = host.split('.');
  return projectRef || '';
}

function parseSupabaseProjectRefFromDatabaseUrl(value: string) {
  if (!value) return '';

  try {
    const url = new URL(value);
    const username = decodeURIComponent(url.username);
    const match = username.match(/^postgres\.([a-z0-9]+)$/i);
    return match?.[1] || '';
  } catch {
    return '';
  }
}

function decodeJwtPayload(token: string) {
  const [, payload] = token.split('.');
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function parseSupabaseProjectRefFromJwt(token: string) {
  const payload = decodeJwtPayload(token);
  const ref = payload?.ref;
  return typeof ref === 'string' ? ref : '';
}

function getUniqueValues(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function formatError(error: unknown) {
  if (error instanceof Error) {
    const candidate = error as Error & { cause?: unknown };
    const cause = candidate.cause instanceof Error ? ` ${candidate.cause.message}` : '';
    const singleLine = `${error.message}${cause}`.replace(/\s+/g, ' ').trim();
    const dnsFailure = singleLine.match(/getaddrinfo\s+(ENOTFOUND|EAI_AGAIN)\s+([^\s)]+)/);
    return dnsFailure ? `DNS lookup failed: ${dnsFailure[1]} ${dnsFailure[2]}` : singleLine;
  }

  return String(error);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function checkProjectRefConsistency(values: Record<string, string>): CheckResult {
  const comparableValues = Object.fromEntries(Object.entries(values).filter(([, ref]) => ref && ref !== 'unavailable'));
  const uniqueRefs = getUniqueValues(Object.values(comparableValues));

  if (uniqueRefs.length === 0) {
    return {
      name: 'Supabase project ref consistency',
      status: 'skip',
      detail: 'No project refs could be parsed from configured Supabase values.',
    };
  }

  const details = Object.entries(values)
    .map(([name, ref]) => `${name}=${ref || 'unparsed'}`)
    .join(', ');

  return {
    name: 'Supabase project ref consistency',
    status: uniqueRefs.length === 1 ? 'pass' : 'fail',
    detail: uniqueRefs.length === 1 ? `All parsed refs match: ${uniqueRefs[0]}. ${details}` : `Parsed refs differ. ${details}`,
  };
}

function checkNoPlaceholders(values: Record<string, string>): CheckResult {
  const placeholderNames = getPlaceholderNames(values);

  if (!placeholderNames.length) {
    return {
      name: 'Supabase placeholder values',
      status: 'pass',
      detail: 'No placeholder Supabase values detected.',
    };
  }

  return {
    name: 'Supabase placeholder values',
    status: 'fail',
    detail: `Replace placeholder value(s): ${placeholderNames.join(', ')}.`,
  };
}

function checkPostgresUrlShape(databaseUrl: string): CheckResult {
  const fingerprint = parsePostgresFingerprint(databaseUrl);

  if (!databaseUrl) {
    return {
      name: 'Supabase Postgres URL shape',
      status: 'skip',
      detail: 'DATABASE_URL is missing.',
    };
  }

  if (!fingerprint) {
    return {
      name: 'Supabase Postgres URL shape',
      status: 'fail',
      detail: 'DATABASE_URL is not a valid URL.',
    };
  }

  const issues = [
    fingerprint.projectRef ? '' : 'username should use postgres.<project-ref>',
    fingerprint.database === 'postgres' ? '' : `database is ${fingerprint.database}, expected postgres`,
    fingerprint.pgbouncer === 'true' ? '' : `pgbouncer is ${fingerprint.pgbouncer}, expected true`,
    fingerprint.connectionLimit === '1' ? '' : `connection_limit is ${fingerprint.connectionLimit}, expected 1 for scripts`,
  ].filter(Boolean);

  const detail = [
    `host=${fingerprint.host}`,
    `port=${fingerprint.port}`,
    `database=${fingerprint.database}`,
    `usernamePattern=${fingerprint.usernamePattern}`,
    `projectRef=${fingerprint.projectRef || 'unparsed'}`,
    `schema=${fingerprint.schema}`,
    `pgbouncer=${fingerprint.pgbouncer}`,
    `connection_limit=${fingerprint.connectionLimit}`,
    `sslmode=${fingerprint.sslmode}`,
  ].join(', ');

  return {
    name: 'Supabase Postgres URL shape',
    status: issues.length ? 'warn' : 'pass',
    detail: issues.length ? `${detail}. Review: ${issues.join('; ')}.` : detail,
  };
}

function hasFailed(results: CheckResult[], name: string) {
  return results.some((result) => result.name === name && result.status === 'fail');
}

function hasPassed(results: CheckResult[], name: string) {
  return results.some((result) => result.name === name && result.status === 'pass');
}

function logResult(result: CheckResult) {
  console.log(`${result.status.toUpperCase()} ${result.name}: ${result.detail}`);
}

function getProjectRef(results: CheckResult[]) {
  const consistency = results.find((result) => result.name === 'Supabase project ref consistency');
  const match = consistency?.detail.match(/All parsed refs match:\s*([a-z0-9]+)/i);
  return match?.[1] || '';
}

function getFailureClassification(results: CheckResult[]) {
  const projectDnsFailed = hasFailed(results, 'Supabase project DNS');
  const restFailed = hasFailed(results, 'Supabase REST');
  const postgresDnsPassed = hasPassed(results, 'Supabase Postgres DNS');
  const postgresTcpPassed = hasPassed(results, 'Supabase Postgres TCP');
  const prismaFailed = hasFailed(results, 'Prisma database');

  if (projectDnsFailed && restFailed && postgresDnsPassed && postgresTcpPassed && prismaFailed) {
    return [
      'Likely diagnosis: the configured project ref is not reachable as an active Supabase API host, while the regional pooler host itself is reachable.',
      'Check whether the project is paused, deleted, transferred, renamed, migrated, or whether local env values point to an old project ref.',
    ];
  }

  if (projectDnsFailed && restFailed) {
    return [
      'Likely diagnosis: the configured Supabase project API host is not reachable.',
      'Confirm the project exists and the REST API URL exactly matches the dashboard project ref.',
    ];
  }

  if (prismaFailed && postgresDnsPassed && postgresTcpPassed) {
    return [
      'Likely diagnosis: the pooler host accepts connections, but the configured database user, password, tenant, or project ref is not accepted.',
      'Replace DATABASE_URL from the active Supabase connection panel after confirming the project ref.',
    ];
  }

  return [];
}

function toReadinessGateStatus(status: CheckStatus): ReadinessGateStatus {
  if (status === 'pass') return 'pass';
  if (status === 'fail') return 'fail';
  return 'watch';
}

function buildReadiness(results: CheckResult[], failed: CheckResult[], classification: string[]) {
  const success = failed.length === 0;

  return {
    level: success ? 'ready' : 'blocked',
    summary: success
      ? 'Supabase connectivity preflight passed.'
      : `Supabase connectivity preflight failed: ${failed.map((result) => result.name).join(', ')}.`,
    nextAction: success
      ? 'Continue with Typesense reindex and database-backed dry-runs.'
      : classification[1] || classification[0] || 'Run the Supabase recovery runbook and replace matched env values if needed.',
    terminal: TERMINAL,
    nextCommand: success ? 'npm run typesense:reindex' : 'npm run supabase:check',
    gates: results.map((result) => ({
      label: result.name,
      status: toReadinessGateStatus(result.status),
      detail: result.detail,
    })),
  };
}

function getRecoveryHint(results: CheckResult[], failed: CheckResult[]) {
  const failedNames = failed.map((result) => result.name);
  const projectRef = getProjectRef(results);
  const dashboardHint = projectRef ? `Supabase dashboard project URL: ${SUPABASE_DASHBOARD_PROJECT_BASE_URL}/${projectRef}` : '';
  const classification = getFailureClassification(results);

  return [
    `Supabase recovery runbook: ${RECOVERY_RUNBOOK_PATH}`,
    dashboardHint,
    ...classification,
    `Replace these values together after confirming the active Supabase project: ${SUPABASE_ENV_NAMES.join(', ')}`,
    `Failed checks: ${failedNames.join(', ')}`,
    'Do not retry MLS, alert, digest, CRM, seed, or Typesense reindex jobs until this preflight passes.',
  ]
    .filter(Boolean)
    .join('\n');
}

function buildReport(results: CheckResult[], options: CheckSupabaseOptions) {
  const failed = results.filter((result) => result.status === 'fail');
  const projectRef = getProjectRef(results);
  const dashboardProjectUrl = projectRef ? `${SUPABASE_DASHBOARD_PROJECT_BASE_URL}/${projectRef}` : null;
  const classification = getFailureClassification(results);

  return {
    success: failed.length === 0,
    module: 'supabase-check',
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    terminal: TERMINAL,
    command: options.json ? 'npm run supabase:check:json' : 'npm run supabase:check',
    recoveryRunbook: RECOVERY_RUNBOOK_PATH,
    dashboardProjectUrl,
    projectRef: projectRef || null,
    failedChecks: failed.map((result) => result.name),
    classification,
    readiness: buildReadiness(results, failed, classification),
    blockedUntilPasses: [
      'MLS sync dry-run or live sync',
      'Queue retry of database-connectivity failures',
      'Alert dry-run or live send',
      'Digest dry-run or live send',
      'CRM scheduler reporting',
      'Seed dry-runs that touch Supabase',
      'Typesense reindex from Supabase',
      'Recurring scheduler activation',
    ],
    replaceTogether: SUPABASE_ENV_NAMES,
    results,
  };
}

async function checkDns(name: string, host: string): Promise<CheckResult> {
  if (!host) {
    return {
      name,
      status: 'skip',
      detail: 'No host could be parsed.',
    };
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= NETWORK_CHECK_ATTEMPTS; attempt++) {
    try {
      const addresses = await dns.lookup(host, { all: true });
      const attemptDetail = attempt > 1 ? ` after ${attempt} attempts` : '';

      return {
        name,
        status: 'pass',
        detail: `${host} resolved${attemptDetail} to ${addresses.map((address) => address.address).join(', ') || 'no addresses'}.`,
      };
    } catch (error) {
      lastError = error;
      if (attempt < NETWORK_CHECK_ATTEMPTS) {
        await sleep(NETWORK_CHECK_RETRY_DELAY_MS);
      }
    }
  }

  return {
    name,
    status: 'fail',
    detail: `${host} did not resolve after ${NETWORK_CHECK_ATTEMPTS} attempts. ${formatError(lastError)}`,
  };
}

async function checkSupabaseRest(url: string, serviceRoleKey: string): Promise<CheckResult> {
  if (!url) {
    return {
      name: 'Supabase REST',
      status: 'skip',
      detail: 'NEXT_PUBLIC_SUPABASE_URL is missing.',
    };
  }

  if (!serviceRoleKey) {
    return {
      name: 'Supabase REST',
      status: 'skip',
      detail: 'SUPABASE_SERVICE_ROLE_KEY is missing.',
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REST_TIMEOUT_MS);

  try {
    const response = await fetch(`${url.replace(/\/+$/, '')}/rest/v1/`, {
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
      },
      signal: controller.signal,
    });

    return {
      name: 'Supabase REST',
      status: response.ok || response.status === 404 ? 'pass' : 'fail',
      detail: `HTTP ${response.status} from REST endpoint.`,
    };
  } catch (error) {
    return {
      name: 'Supabase REST',
      status: 'fail',
      detail: formatError(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function checkPostgresTcp(databaseUrl: string): Promise<CheckResult> {
  const endpoint = parsePostgresEndpoint(databaseUrl);

  if (!endpoint) {
    return {
      name: 'Supabase Postgres TCP',
      status: 'skip',
      detail: databaseUrl ? 'DATABASE_URL is not a valid URL.' : 'DATABASE_URL is missing.',
    };
  }

  let lastFailure = '';

  for (let attempt = 1; attempt <= NETWORK_CHECK_ATTEMPTS; attempt++) {
    const result = await new Promise<CheckResult>((resolve) => {
      const socket = net.createConnection(endpoint);
      const timeout = setTimeout(() => {
        socket.destroy();
        resolve({
          name: 'Supabase Postgres TCP',
          status: 'fail',
          detail: `${endpoint.host}:${endpoint.port} timed out after ${POSTGRES_TIMEOUT_MS}ms.`,
        });
      }, POSTGRES_TIMEOUT_MS);

      socket.once('connect', () => {
        clearTimeout(timeout);
        socket.end();
        const attemptDetail = attempt > 1 ? ` after ${attempt} attempts` : '';

        resolve({
          name: 'Supabase Postgres TCP',
          status: 'pass',
          detail: `${endpoint.host}:${endpoint.port} accepted a TCP connection${attemptDetail}.`,
        });
      });

      socket.once('error', (error) => {
        clearTimeout(timeout);
        resolve({
          name: 'Supabase Postgres TCP',
          status: 'fail',
          detail: `${endpoint.host}:${endpoint.port} connection failed. ${formatError(error)}`,
        });
      });
    });

    if (result.status === 'pass') return result;
    lastFailure = result.detail;

    if (attempt < NETWORK_CHECK_ATTEMPTS) {
      await sleep(NETWORK_CHECK_RETRY_DELAY_MS);
    }
  }

  return {
    name: 'Supabase Postgres TCP',
    status: 'fail',
    detail: `${lastFailure} Retried ${NETWORK_CHECK_ATTEMPTS} times.`,
  };
}

async function checkPrismaDatabase(databaseUrl: string, skip: boolean): Promise<CheckResult> {
  if (!databaseUrl) {
    return {
      name: 'Prisma database',
      status: 'skip',
      detail: 'DATABASE_URL is missing.',
    };
  }

  if (skip) {
    return {
      name: 'Prisma database',
      status: 'skip',
      detail: 'Skipped because Postgres DNS or TCP failed.',
    };
  }

  try {
    const { prisma } = await import('../lib/prisma.js');
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();

    return {
      name: 'Prisma database',
      status: 'pass',
      detail: 'SELECT 1 succeeded.',
    };
  } catch (error) {
    return {
      name: 'Prisma database',
      status: 'fail',
      detail: formatError(error),
    };
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options) return;

  const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const publishableKey = getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  const databaseUrl = getEnv('DATABASE_URL');
  const supabaseEnvValues = {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publishableKey,
    SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey,
    DATABASE_URL: databaseUrl,
  };
  const supabaseHost = parseHost(supabaseUrl);
  const databaseHost = parsePostgresHost(databaseUrl);
  const projectRefs = {
    url: parseSupabaseProjectRefFromUrl(supabaseUrl),
    databaseUser: parseSupabaseProjectRefFromDatabaseUrl(databaseUrl),
    anonKey: parseSupabaseProjectRefFromJwt(anonKey),
    serviceRoleKey: parseSupabaseProjectRefFromJwt(serviceRoleKey),
    publishableKey: publishableKey.startsWith('sb_publishable_') ? 'unavailable' : '',
  };
  const results: CheckResult[] = [
    {
      name: 'NEXT_PUBLIC_SUPABASE_URL',
      status: supabaseUrl ? 'pass' : 'fail',
      detail: supabaseUrl ? `Configured host: ${supabaseHost || 'invalid URL'}.` : 'Missing.',
    },
    {
      name: 'SUPABASE_SERVICE_ROLE_KEY',
      status: serviceRoleKey ? 'pass' : 'fail',
      detail: serviceRoleKey ? 'Configured.' : 'Missing.',
    },
    {
      name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      status: anonKey ? 'pass' : 'warn',
      detail: anonKey ? 'Configured.' : 'Missing; server-side preflight can still run.',
    },
    {
      name: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
      status: publishableKey ? 'pass' : 'warn',
      detail: publishableKey ? 'Configured.' : 'Missing; legacy anon key may still support local checks.',
    },
    {
      name: 'DATABASE_URL',
      status: databaseUrl ? 'pass' : 'warn',
      detail: databaseUrl ? `Configured host: ${databaseHost || 'invalid URL'}.` : 'Missing; REST checks can still run.',
    },
    checkNoPlaceholders(supabaseEnvValues),
    checkProjectRefConsistency(projectRefs),
    checkPostgresUrlShape(databaseUrl),
  ];

  const hasPlaceholders = hasFailed(results, 'Supabase placeholder values');
  results.push(await checkDns('Supabase project DNS', supabaseHost));
  results.push(await checkDns('Supabase Postgres DNS', databaseHost));
  results.push(
    hasPlaceholders
      ? {
          name: 'Supabase Postgres TCP',
          status: 'skip',
          detail: 'Skipped because Supabase placeholder values are still configured.',
        }
      : await checkPostgresTcp(databaseUrl),
  );
  results.push(
    hasPlaceholders
      ? {
          name: 'Prisma database',
          status: 'skip',
          detail: 'Skipped because Supabase placeholder values are still configured.',
        }
      : await checkPrismaDatabase(
          databaseUrl,
          hasFailed(results, 'Supabase Postgres DNS') || hasFailed(results, 'Supabase Postgres TCP'),
        ),
  );
  results.push(
    hasPlaceholders
      ? {
          name: 'Supabase REST',
          status: 'skip',
          detail: 'Skipped because Supabase placeholder values are still configured.',
        }
      : await checkSupabaseRest(supabaseUrl, serviceRoleKey),
  );

  const report = buildReport(results, options);
  const failed = results.filter((result) => result.status === 'fail');

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
    if (failed.length) process.exit(1);
    return;
  }

  console.log('Supabase connectivity preflight starting.');
  for (const result of results) {
    logResult(result);
  }

  if (failed.length) {
    console.log(getRecoveryHint(results, failed));
    throw new Error(
      `Supabase preflight failed: ${failed.map((result) => result.name).join(', ')}. Verify Supabase project status, endpoint values, DNS, and local network access.`,
    );
  }

  console.log('Supabase connectivity preflight passed.');
}

main().catch((error) => {
  console.log(formatError(error));
  process.exit(1);
});

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkSupabase.ts
