import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const CONTAINER = 'atlas-objective-property-local-postgres';
const DATABASE = 'atlas_objective_property_test';
const migration = readFileSync('prisma/migrations/20260919000000_canonical_schema_reconciliation_v1/migration.sql', 'utf8');

function runSql(sql: string, expectedSuccess = true) {
  const result = spawnSync(
    'docker',
    ['exec', '-i', CONTAINER, 'psql', '-U', 'postgres', '-d', DATABASE, '-X', '-v', 'ON_ERROR_STOP=1', '-At'],
    { encoding: 'utf8', input: sql },
  );

  if (expectedSuccess) {
    assert.equal(result.status, 0, result.stderr || result.error?.message || 'Local schema certification SQL failed.');
  } else {
    assert.notEqual(result.status, 0, 'Expected synthetic orphan insert to be rejected.');
  }

  return result;
}

runSql(`
TRUNCATE TABLE "LeadInteraction", "Property", "User" CASCADE;
ALTER TABLE "LeadInteraction" DROP CONSTRAINT IF EXISTS "LeadInteraction_clientId_fkey";
ALTER TABLE "LeadInteraction" DROP CONSTRAINT IF EXISTS "LeadInteraction_propertyId_fkey";
DROP INDEX IF EXISTS "LeadInteraction_clientId_idx";
DROP INDEX IF EXISTS "LeadInteraction_propertyId_idx";
DROP INDEX IF EXISTS "LeadInteraction_interactionType_idx";
INSERT INTO "User" (id, email, "updatedAt") VALUES ('synthetic-user', 'synthetic-user@example.invalid', CURRENT_TIMESTAMP);
INSERT INTO "Property" (id, "mlsId", slug, address, city, state, zip, price, "propertyType", status, lat, lng, "updatedAt")
VALUES ('synthetic-property', 'synthetic-mls', 'synthetic-property', 'Synthetic address', 'Synthetic city', 'CO', '00000', 1, 'Synthetic', 'Synthetic', 0, 0, CURRENT_TIMESTAMP);
INSERT INTO "LeadInteraction" (id, "clientId", "propertyId", "interactionType") VALUES
  ('synthetic-orphan-user', 'missing-user', 'synthetic-property', 'SYNTHETIC'),
  ('synthetic-orphan-property', 'synthetic-user', 'missing-property', 'SYNTHETIC'),
  ('synthetic-valid-existing', 'synthetic-user', 'synthetic-property', 'SYNTHETIC');
`);

runSql(migration);

const stagedState = runSql(`
SELECT conname || '|' || convalidated::text
FROM pg_constraint
WHERE conrelid = 'public."LeadInteraction"'::regclass
  AND conname IN ('LeadInteraction_clientId_fkey', 'LeadInteraction_propertyId_fkey')
ORDER BY conname;
SELECT count(*)::text
FROM "LeadInteraction"
WHERE id IN ('synthetic-orphan-user', 'synthetic-orphan-property');
`).stdout.trim().split('\n');

assert.deepEqual(stagedState.slice(0, 2), [
  'LeadInteraction_clientId_fkey|false',
  'LeadInteraction_propertyId_fkey|false',
]);
assert.equal(stagedState[2], '2', 'Pre-existing synthetic orphan rows must remain after NOT VALID constraint creation.');

const rejected = runSql(
  `INSERT INTO "LeadInteraction" (id, "clientId", "propertyId", "interactionType") VALUES ('synthetic-new-orphan', 'missing-user', 'synthetic-property', 'SYNTHETIC');`,
  false,
);
assert.match(rejected.stderr, /LeadInteraction_clientId_fkey/, 'New synthetic orphan must be rejected by the user FK.');

runSql(`
INSERT INTO "LeadInteraction" (id, "clientId", "propertyId", "interactionType")
VALUES ('synthetic-new-valid', 'synthetic-user', 'synthetic-property', 'SYNTHETIC');
UPDATE "LeadInteraction"
SET "clientId" = 'synthetic-user', "propertyId" = 'synthetic-property'
WHERE id IN ('synthetic-orphan-user', 'synthetic-orphan-property');
ALTER TABLE "LeadInteraction" VALIDATE CONSTRAINT "LeadInteraction_clientId_fkey";
ALTER TABLE "LeadInteraction" VALIDATE CONSTRAINT "LeadInteraction_propertyId_fkey";
`);

const validatedState = runSql(`
SELECT conname || '|' || convalidated::text
FROM pg_constraint
WHERE conrelid = 'public."LeadInteraction"'::regclass
  AND conname IN ('LeadInteraction_clientId_fkey', 'LeadInteraction_propertyId_fkey')
ORDER BY conname;
`).stdout.trim().split('\n');

assert.deepEqual(validatedState, [
  'LeadInteraction_clientId_fkey|true',
  'LeadInteraction_propertyId_fkey|true',
]);

const password = spawnSync('docker', ['exec', CONTAINER, 'printenv', 'POSTGRES_PASSWORD'], { encoding: 'utf8' });
assert.equal(password.status, 0, password.stderr || password.error?.message || 'Unable to read the local harness password.');
const localUrl = `postgresql://postgres:${password.stdout.trim()}@127.0.0.1:55432/${DATABASE}?schema=public`;
const diff = spawnSync(
  'npx',
  ['prisma', 'migrate', 'diff', '--from-url', localUrl, '--to-schema-datamodel', 'prisma/schema.prisma', '--script'],
  { encoding: 'utf8' },
);
assert.equal(diff.status, 0, diff.stderr || diff.error?.message || 'Local Prisma diff failed.');
assert.equal(diff.stdout.trim(), `-- RenameForeignKey
ALTER TABLE "ClientAuthorizationConfirmationEvidence" RENAME CONSTRAINT "ClientAuthorizationConfirmationEvidence_clientAuthorizationPrin" TO "ClientAuthorizationConfirmationEvidence_clientAuthorizatio_fkey";`);

console.log('[canonical-schema-reconciliation-local] ok: staged constraints retain existing synthetic orphans, enforce new writes, validate after correction, and leave only the documented raw-name diff exception.');
