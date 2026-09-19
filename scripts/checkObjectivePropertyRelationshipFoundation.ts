import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  CLIENT_CASE_OBJECTIVE_PROPERTY_RELATIONSHIPS_VERSION,
  OBJECTIVE_PROPERTY_RELATIONSHIP_ROLES,
  OBJECTIVE_PROPERTY_RELATIONSHIP_STATUSES,
} from '../lib/clientCaseObjectivePropertyRelationships';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migrationPath = 'prisma/migrations/20260919020000_objective_property_relationship_foundation_v1/migration.sql';
const migration = readFileSync(migrationPath, 'utf8');
const service = readFileSync('lib/clientCaseObjectivePropertyRelationships.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(CLIENT_CASE_OBJECTIVE_PROPERTY_RELATIONSHIPS_VERSION, 'CLIENT_CASE_OBJECTIVE_PROPERTY_RELATIONSHIPS_WAVE_A_V1');
assert.deepEqual(OBJECTIVE_PROPERTY_RELATIONSHIP_ROLES, ['SUBJECT', 'CANDIDATE']);
assert.deepEqual(OBJECTIVE_PROPERTY_RELATIONSHIP_STATUSES, ['ACTIVE', 'ENDED']);
assert.equal(packageJson.scripts?.['check:objective-property-relationship-foundation'], 'jiti scripts/checkObjectivePropertyRelationshipFoundation.ts');
assert.equal(packageJson.scripts?.['certify:objective-property-relationship-foundation:local'], 'node scripts/certifyObjectivePropertyRelationshipFoundationLocalRunner.cjs');

assert.match(schema, /enum ClientCaseObjectivePropertyRelationshipRole \{[\s\S]*SUBJECT[\s\S]*CANDIDATE[\s\S]*\}/);
assert.match(schema, /enum ClientCaseObjectivePropertyRelationshipStatus \{[\s\S]*ACTIVE[\s\S]*ENDED[\s\S]*\}/);
assert.match(schema, /model ClientCaseObjectivePropertyRelationship \{/);
assert.match(schema, /@@unique\(\[clientCaseId, id\]\)/);
assert.match(schema, /references: \[clientCaseId, id\], onDelete: Restrict/);
assert.match(schema, /@@index\(\[clientCaseId, status\], map: "CCOPR_case_status_idx"\)/);
assert.match(schema, /@@index\(\[objectiveId, status\], map: "CCOPR_objective_status_idx"\)/);
assert.match(schema, /@@index\(\[clientCasePropertyId, status\], map: "CCOPR_property_status_idx"\)/);

for (const required of [
  'CREATE TYPE "ClientCaseObjectivePropertyRelationshipRole" AS ENUM (\'SUBJECT\', \'CANDIDATE\')',
  'CREATE TYPE "ClientCaseObjectivePropertyRelationshipStatus" AS ENUM (\'ACTIVE\', \'ENDED\')',
  'CREATE TABLE "ClientCaseObjectivePropertyRelationship"',
  '"ClientCaseObjective_clientCaseId_id_key"',
  '"ClientCaseProperty_clientCaseId_id_key"',
  'FOREIGN KEY ("clientCaseId", "objectiveId") REFERENCES "ClientCaseObjective"("clientCaseId", "id") ON DELETE RESTRICT',
  'FOREIGN KEY ("clientCaseId", "clientCasePropertyId") REFERENCES "ClientCaseProperty"("clientCaseId", "id") ON DELETE RESTRICT',
  'CREATE UNIQUE INDEX "CCOPR_active_objective_property_uq"',
  'WHERE "status" = \'ACTIVE\'',
  'CONSTRAINT "CCOPR_status_ended_at_ck"',
]) assert.ok(migration.includes(required), `Migration is missing ${required}.`);
assert.doesNotMatch(migration, /INSERT INTO|DELETE FROM|UPDATE\s+"/i);

for (const required of ['async link(', 'async end(', 'async listByObjective(', 'async listByClientCaseProperty(', 'async listByClientCase(', 'await ownedCase', 'rejectUnexpectedKeys', 'take > 100']) {
  assert.ok(service.includes(required), `Service is missing ${required}.`);
}
for (const forbidden of ['.delete(', 'createdBySubject: input.', 'startedAt: input.', 'endedAt: input.', 'status: input.']) {
  assert.ok(!service.includes(forbidden), `Service must not contain ${forbidden}.`);
}

console.log('[objective-property-relationship-foundation] ok: schema, migration, bounded server-only service, and local certification entrypoint are governed.');
