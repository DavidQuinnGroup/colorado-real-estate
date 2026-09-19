import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CANONICAL_DATABASE_BASELINE } from '../lib/schema/canonicalDatabaseBaseline';
import {
  bootstrapCanonicalDatabaseBaseline,
  disposeCanonicalDatabaseBaseline,
  localBaselineTarget,
  localHarnessUrl,
  prismaLocalEnvironment,
  runLocalCommand,
} from './canonicalDatabaseBaselineLocal';

const baselineMigration = '20260919010000_canonical_database_baseline_v1';
const syntheticMigrationName = 'baseline_forward_migration_probe';

function assertSchemaMatches(url: string) {
  const diff = runLocalCommand('npx', [
    'prisma', 'migrate', 'diff', '--from-url', url, '--to-schema-datamodel', 'prisma/schema.prisma', '--script',
  ], prismaLocalEnvironment(url));
  assert.ok(
    diff.trim() === '' || diff.trim() === '-- This is an empty migration.',
    'Fresh baseline must match the canonical Prisma schema exactly.',
  );
}

function makeBaselineDevelopmentWorkspace() {
  const workspace = mkdtempSync(join(tmpdir(), 'project-atlas-baseline-development-'));
  const prismaDirectory = join(workspace, 'prisma');
  const migrationDirectory = join(prismaDirectory, 'migrations', baselineMigration);
  mkdirSync(migrationDirectory, { recursive: true });
  copyFileSync('prisma/migrations/migration_lock.toml', join(prismaDirectory, 'migration_lock.toml'));
  copyFileSync(CANONICAL_DATABASE_BASELINE.artifactPath, join(migrationDirectory, 'migration.sql'));

  const schema = `${readFileSync('prisma/schema.prisma', 'utf8')}

model BaselineForwardMigrationProbe {
  id String @id @default(cuid())
}
`;
  writeFileSync(join(prismaDirectory, 'schema.prisma'), schema);
  return { workspace, schemaPath: join(prismaDirectory, 'schema.prisma') };
}

function resolveBaselineWorkspaceMigration(schemaPath: string, url: string) {
  runLocalCommand('npx', [
    'prisma', 'migrate', 'resolve', '--schema', schemaPath, '--applied', baselineMigration,
  ], prismaLocalEnvironment(url));
}

assert.equal(process.env.ATLAS_BASELINE_LOCAL_MODE, '1', 'Set ATLAS_BASELINE_LOCAL_MODE=1 to run local certification.');
assert.equal(process.env.ATLAS_BASELINE_RESET, '1', 'Set ATLAS_BASELINE_RESET=1 to run local certification.');

const run1 = localBaselineTarget('atlas_canonical_baseline_run1', localHarnessUrl('atlas_canonical_baseline_run1'));
const run2 = localBaselineTarget('atlas_canonical_baseline_run2', localHarnessUrl('atlas_canonical_baseline_run2'));
const pathA = localBaselineTarget('atlas_canonical_baseline_path_a', localHarnessUrl('atlas_canonical_baseline_path_a'));
const pathB = localBaselineTarget('atlas_canonical_baseline_path_b', localHarnessUrl('atlas_canonical_baseline_path_b'));

const run1Result = bootstrapCanonicalDatabaseBaseline(run1);
const run2Result = bootstrapCanonicalDatabaseBaseline(run2);
assertSchemaMatches(run1.url);
assertSchemaMatches(run2.url);
assert.equal(run1Result.historicalMigrations, run2Result.historicalMigrations);

// Path A is the local production-aligned schema surrogate; Path B is a second fresh bootstrap.
bootstrapCanonicalDatabaseBaseline(pathA, { resolveHistoricalMigrations: false });
bootstrapCanonicalDatabaseBaseline(pathB, { resolveHistoricalMigrations: false });

const development = makeBaselineDevelopmentWorkspace();
try {
  resolveBaselineWorkspaceMigration(development.schemaPath, pathA.url);
  resolveBaselineWorkspaceMigration(development.schemaPath, pathB.url);

  runLocalCommand('npx', [
    'prisma', 'migrate', 'dev', '--schema', development.schemaPath, '--create-only', '--skip-generate', '--name', syntheticMigrationName,
  ], prismaLocalEnvironment(pathA.url));

  const syntheticDirectory = readdirSync(join(development.workspace, 'prisma', 'migrations'))
    .find((entry) => entry.endsWith(`_${syntheticMigrationName}`));
  assert.ok(syntheticDirectory, 'Baseline-aware migrate dev did not create the expected synthetic migration directory.');
  const syntheticSql = readFileSync(join(development.workspace, 'prisma', 'migrations', syntheticDirectory, 'migration.sql'), 'utf8');
  assert.match(syntheticSql, /CREATE TABLE "BaselineForwardMigrationProbe"/, 'Baseline-aware migrate dev must generate the synthetic forward migration.');

  for (const target of [pathA, pathB]) {
    const deploy = runLocalCommand('npx', ['prisma', 'migrate', 'deploy', '--schema', development.schemaPath], prismaLocalEnvironment(target.url));
    assert.match(deploy, /Applying migration[\s\S]*baseline_forward_migration_probe/, 'Baseline-aware migrate deploy must apply the synthetic forward migration.');
  }

  const convergence = runLocalCommand('npx', ['prisma', 'migrate', 'diff', '--from-url', pathA.url, '--to-url', pathB.url, '--script'], prismaLocalEnvironment(pathA.url));
  assert.ok(
    convergence.trim() === '' || convergence.trim() === '-- This is an empty migration.',
    'Path A and Path B must converge after the same forward migration.',
  );
} finally {
  rmSync(development.workspace, { recursive: true, force: true });
  for (const target of [run1, run2, pathA, pathB]) disposeCanonicalDatabaseBaseline(target);
}

console.log(`[canonical-database-baseline-local] ok: two fresh bootstrap runs resolved ${run1Result.historicalMigrations} historical migrations; baseline-aware migrate dev and deploy converged Path A and Path B with a temporary synthetic migration.`);
