import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { CANONICAL_BASELINE_LOCAL_DATABASES, CANONICAL_DATABASE_BASELINE } from '../lib/schema/canonicalDatabaseBaseline';

const CONTAINER = 'atlas-objective-property-local-postgres';
const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost']);
const LOCAL_PORT = '55432';

export type LocalBaselineTarget = {
  database: (typeof CANONICAL_BASELINE_LOCAL_DATABASES)[number];
  url: string;
};

function command(commandName: string, args: string[], options: { input?: string; env?: NodeJS.ProcessEnv } = {}) {
  const result = spawnSync(commandName, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    input: options.input,
    env: options.env,
  });
  assert.equal(result.status, 0, result.stderr || result.error?.message || `${commandName} failed.`);
  return result.stdout;
}

function docker(args: string[], input?: string) {
  return command('docker', args, { input });
}

export function localBaselineTarget(database: (typeof CANONICAL_BASELINE_LOCAL_DATABASES)[number], url = process.env.ATLAS_BASELINE_DATABASE_URL): LocalBaselineTarget {
  assert.equal(process.env.ATLAS_BASELINE_LOCAL_MODE, '1', 'Set ATLAS_BASELINE_LOCAL_MODE=1 to authorize disposable local baseline work.');
  assert.ok(url, 'ATLAS_BASELINE_DATABASE_URL is required; no DATABASE_URL fallback is permitted.');

  const parsed = new URL(url);
  assert.ok(LOCAL_HOSTS.has(parsed.hostname), 'Baseline work only permits localhost or 127.0.0.1.');
  assert.equal(parsed.port, LOCAL_PORT, `Baseline work only permits local port ${LOCAL_PORT}.`);
  assert.equal(parsed.pathname.slice(1), database, `Baseline URL must target ${database}.`);
  assert.ok(CANONICAL_BASELINE_LOCAL_DATABASES.includes(database), `Database is not an approved disposable baseline target: ${database}.`);
  assert.equal(parsed.protocol, 'postgresql:', 'Baseline work requires a PostgreSQL URL.');
  return { database, url: parsed.toString() };
}

function runSql(database: string, sql: string) {
  return docker(['exec', '-i', CONTAINER, 'psql', '-U', 'postgres', '-d', database, '-X', '-v', 'ON_ERROR_STOP=1', '-At'], sql);
}

export function historicalMigrationNames() {
  const names = readdirSync('prisma/migrations', { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  assert.ok(names.includes(CANONICAL_DATABASE_BASELINE.historicalMigrationCutoff), 'The canonical migration cutoff is absent from prisma/migrations.');
  return names;
}

function prismaEnvironment(url: string): NodeJS.ProcessEnv {
  return {
    ...process.env,
    DATABASE_URL: url,
    DIRECT_URL: url,
    ATLAS_BASELINE_DATABASE_URL: url,
  };
}

export function bootstrapCanonicalDatabaseBaseline(target: LocalBaselineTarget, options: { resolveHistoricalMigrations?: boolean } = {}) {
  assert.equal(process.env.ATLAS_BASELINE_RESET, '1', 'Set ATLAS_BASELINE_RESET=1 before a disposable database can be recreated.');
  const artifact = readFileSync(CANONICAL_DATABASE_BASELINE.artifactPath, 'utf8');
  assert.ok(artifact.startsWith('-- PROJECT ATLAS canonical local bootstrap baseline.'), 'Unexpected canonical baseline artifact.');

  docker(['exec', CONTAINER, 'psql', '-U', 'postgres', '-d', 'postgres', '-X', '-v', 'ON_ERROR_STOP=1', '-c', `DROP DATABASE IF EXISTS "${target.database}" WITH (FORCE)`]);
  docker(['exec', CONTAINER, 'psql', '-U', 'postgres', '-d', 'postgres', '-X', '-v', 'ON_ERROR_STOP=1', '-c', `CREATE DATABASE "${target.database}"`]);
  runSql(target.database, artifact);

  if (options.resolveHistoricalMigrations !== false) {
    for (const migration of historicalMigrationNames()) {
      command('npx', ['prisma', 'migrate', 'resolve', '--schema', 'prisma/schema.prisma', '--applied', migration], { env: prismaEnvironment(target.url) });
    }

    const status = command('npx', ['prisma', 'migrate', 'status', '--schema', 'prisma/schema.prisma'], { env: prismaEnvironment(target.url) });
    assert.match(status, /Database schema is up to date!/, 'Resolved historical state must be current after baseline bootstrap.');
  }

  const leadInteractionState = runSql(target.database, `
SELECT conname || '|' || convalidated::text
FROM pg_constraint
WHERE conrelid = 'public."LeadInteraction"'::regclass
  AND conname IN ('LeadInteraction_clientId_fkey', 'LeadInteraction_propertyId_fkey')
ORDER BY conname;
`).trim().split('\n');
  assert.deepEqual(leadInteractionState, [
    'LeadInteraction_clientId_fkey|true',
    'LeadInteraction_propertyId_fkey|true',
  ], 'Fresh-baseline LeadInteraction foreign keys must be VALID.');

  return { historicalMigrations: historicalMigrationNames().length, leadInteractionState };
}

export function disposeCanonicalDatabaseBaseline(target: LocalBaselineTarget) {
  assert.equal(process.env.ATLAS_BASELINE_RESET, '1', 'Set ATLAS_BASELINE_RESET=1 before a disposable database can be dropped.');
  docker(['exec', CONTAINER, 'psql', '-U', 'postgres', '-d', 'postgres', '-X', '-v', 'ON_ERROR_STOP=1', '-c', `DROP DATABASE IF EXISTS "${target.database}" WITH (FORCE)`]);
}

export function localHarnessUrl(database: (typeof CANONICAL_BASELINE_LOCAL_DATABASES)[number]) {
  const password = docker(['exec', CONTAINER, 'printenv', 'POSTGRES_PASSWORD']).trim();
  assert.ok(password, 'Local PostgreSQL harness password is unavailable.');
  return `postgresql://postgres:${encodeURIComponent(password)}@127.0.0.1:${LOCAL_PORT}/${database}?schema=public`;
}

export function localBaselineSql(database: string, sql: string) {
  return runSql(database, sql);
}

export function prismaLocalEnvironment(url: string) {
  return prismaEnvironment(url);
}

export function runLocalCommand(commandName: string, args: string[], env?: NodeJS.ProcessEnv) {
  return command(commandName, args, { env });
}
