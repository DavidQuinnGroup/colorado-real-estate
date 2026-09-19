import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CANONICAL_DATABASE_BASELINE } from '../lib/schema/canonicalDatabaseBaseline';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const artifact = readFileSync(CANONICAL_DATABASE_BASELINE.artifactPath, 'utf8');
const bootstrap = readFileSync('scripts/bootstrapCanonicalDatabaseBaseline.ts', 'utf8');
const local = readFileSync('scripts/canonicalDatabaseBaselineLocal.ts', 'utf8');

assert.equal(packageJson.scripts?.['bootstrap:canonical-database-baseline:local'], 'jiti scripts/bootstrapCanonicalDatabaseBaseline.ts');
assert.equal(packageJson.scripts?.['check:canonical-database-baseline'], 'jiti scripts/checkCanonicalDatabaseBaseline.ts');
assert.equal(packageJson.scripts?.['certify:canonical-database-baseline:local'], 'jiti scripts/certifyCanonicalDatabaseBaselineLocal.ts');
assert.ok(artifact.startsWith('-- PROJECT ATLAS canonical local bootstrap baseline.\n-- Generated from prisma/schema.prisma with prisma migrate diff --from-empty.\n-- This is intentionally outside prisma/migrations and is never a production-pending migration.\nCREATE EXTENSION IF NOT EXISTS pgcrypto;'));
for (const forbidden of [/^INSERT INTO /m, /^UPDATE /m, /^DELETE FROM /m, /^COPY /m]) assert.ok(!forbidden.test(artifact), `Baseline artifact must not contain data mutation: ${forbidden}.`);
for (const required of ['CREATE TABLE "LeadInteraction"', 'CREATE TABLE "City"', 'CREATE TABLE "Neighborhood"', 'CREATE UNIQUE INDEX "Property_id_key"', 'CREATE INDEX "LeadInteraction_clientId_idx"']) assert.ok(artifact.includes(required), `Baseline artifact is missing ${required}.`);
assert.equal(CANONICAL_DATABASE_BASELINE.externalSchemaPolicy.ownershipSource, 'lib/schema/canonicalSchemaOwnership.ts');
assert.equal(CANONICAL_DATABASE_BASELINE.historicalMigrationCutoff, '20260919000000_canonical_schema_reconciliation_v1');
assert.ok(CANONICAL_DATABASE_BASELINE.intentionalProductionDifferences.some((difference) => difference.includes('LeadInteraction')));
for (const required of [
  "ATLAS_BASELINE_LOCAL_MODE",
  "ATLAS_BASELINE_DATABASE_URL is required; no DATABASE_URL fallback is permitted.",
  "LOCAL_HOSTS",
  "LOCAL_PORT = '55432'",
  'CANONICAL_BASELINE_LOCAL_DATABASES.includes(database)',
  'ATLAS_BASELINE_RESET',
  "prisma', 'migrate', 'resolve'",
]) assert.ok(local.includes(required), `Local bootstrap guard is missing ${required}.`);
assert.ok(bootstrap.includes('ATLAS_BASELINE_DATABASE is required'));

console.log('[canonical-database-baseline] ok: generated baseline is schema-only, separately governed, and local bootstrap is explicitly guarded.');
