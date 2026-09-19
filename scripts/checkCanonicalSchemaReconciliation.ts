import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { EXTERNAL_SCHEMA_CROSS_SCHEMA_DEPENDENCIES, EXTERNAL_SCHEMA_OWNERSHIP, EXTERNAL_SCHEMA_TABLES, PRISMA_RAW_NAME_PRESERVATION } from '../lib/schema/canonicalSchemaOwnership';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260919000000_canonical_schema_reconciliation_v1/migration.sql', 'utf8');
const pageGenerator = readFileSync('lib/generatePages.ts', 'utf8');

assert.equal(EXTERNAL_SCHEMA_TABLES.length, 25, 'The external schema inventory must retain all 25 production-only public tables.');
assert.equal(new Set(EXTERNAL_SCHEMA_TABLES).size, 25, 'The external schema inventory must not duplicate tables.');
assert.equal(EXTERNAL_SCHEMA_OWNERSHIP.PROJECT_ATLAS_OWNED_EXTERNAL_TO_PRISMA.length, 19);
assert.equal(EXTERNAL_SCHEMA_OWNERSHIP.LEGACY_BUT_ACTIVE.length, 5);
assert.equal(EXTERNAL_SCHEMA_OWNERSHIP.PROVIDER_AUTH_ADJACENT.length, 1);
assert.deepEqual(EXTERNAL_SCHEMA_CROSS_SCHEMA_DEPENDENCIES, [
  'profiles.id -> auth.users.id',
  'leads.assigned_to -> auth.users.id',
]);
assert.deepEqual(PRISMA_RAW_NAME_PRESERVATION.foreignKeyConstraintNames, [
  'ClientAuthorizationConfirmationEvidence_clientAuthorizationPrin',
]);

for (const required of [
  'uuid                 String    @id @default(dbgenerated("gen_random_uuid()"))',
  'id                   String    @unique(map: "Property_id_key") @default(cuid())',
  'optimizedValue      Int?',
  'id           String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid',
  'sellerLead   SellerLead? @relation(fields: [sellerLeadId], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "CRMTask_leadid_fkey")',
  'id              String   @id @default(dbgenerated("(gen_random_uuid())::text"))',
  'topCities String[] @default([])',
  'model City {',
  'model Neighborhood {',
]) assert.ok(schema.includes(required), `Missing canonical schema mapping: ${required}`);

assert.ok(pageGenerator.includes('prisma.neighborhood.findMany'), 'City and Neighborhood must remain modeled while the page generator still reads them.');

for (const protectedIndex of [
  'ClientAuthorizationConfirmationEvidence_clientAuthorizationPrin',
  'ClientAuthorizationSession_clientAuthorizationPrincipalId_idx',
  'ClientCaseParty_clientCaseId_role_idx',
  'Property_id_key',
]) assert.ok(!migration.includes(`DROP INDEX "${protectedIndex}"`), `Protected index must not be dropped: ${protectedIndex}`);

for (const required of [
  'CREATE INDEX IF NOT EXISTS "LeadInteraction_clientId_idx"',
  'CREATE INDEX IF NOT EXISTS "LeadInteraction_propertyId_idx"',
  'CREATE INDEX IF NOT EXISTS "LeadInteraction_interactionType_idx"',
  'FOREIGN KEY ("clientId") REFERENCES "User"("id")',
  'FOREIGN KEY ("propertyId") REFERENCES "Property"("id")',
  'ON DELETE CASCADE ON UPDATE CASCADE NOT VALID',
]) assert.ok(migration.includes(required), `Missing staged LeadInteraction migration operation: ${required}`);

for (const prohibited of ['DROP TABLE', 'DROP INDEX', 'ALTER COLUMN "optimizedValue"', 'ALTER COLUMN "id"', 'DELETE FROM']) {
  assert.ok(!migration.includes(prohibited), `Forward migration contains prohibited operation: ${prohibited}`);
}

console.log('[canonical-schema-reconciliation] ok: production-aligned mappings, protected external ownership, and additive staged LeadInteraction integrity are present.');
