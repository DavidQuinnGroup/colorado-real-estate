import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { ClientCaseContextRecordsError, createClientCaseContextRecordsService } from '../lib/clientCaseContextRecordsFoundation';
import { CRITERION_SEMANTICS, FACT_SEMANTICS, assertRegistryIntegrity } from '../lib/clientCaseContextSemanticRegistry';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260914000000_add_client_case_context_records_and_objectives_foundation/migration.sql', 'utf8');
const serviceSource = readFileSync('lib/clientCaseContextRecordsFoundation.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

for (const model of ['ClientCaseObjective', 'ClientCaseFact', 'ClientCaseCriterion']) assert.match(schema, new RegExp(`model ${model} \\{`));
for (const token of ['ClientCaseObjectiveType', 'ClientCaseContextScope', 'ClientCaseContextSourcePosture', 'supersedesFactId', 'supersedesCriterionId', 'scopeReference']) assert.match(schema, new RegExp(`\\b${token}\\b`));
assert.match(migration, /CREATE TABLE "ClientCaseObjective"/);
assert.match(migration, /CREATE TABLE "ClientCaseFact"/);
assert.match(migration, /CREATE TABLE "ClientCaseCriterion"/);
assert.match(migration, /ClientCaseFact_current_scope_key/);
assert.match(migration, /ClientCaseCriterion_current_scope_key/);
assert.match(migration, /WHERE "supersededAt" IS NULL/);
assert.doesNotMatch(migration, /\b(DROP|TRUNCATE|DELETE\s+FROM|UPDATE\s+"ClientCase")\b/i);
assert.doesNotMatch(migration, /\bINSERT\s+INTO\b/i);
assert.match(serviceSource, /prisma\.\$transaction/);
assert.match(serviceSource, /scopeReference: `OBJECTIVE:\$\{objective\.id\}`/);
assert.match(serviceSource, /scopeReference: `PROPERTY:\$\{property\.id\}`/);
assert.doesNotMatch(serviceSource, /Scenario|readiness|savedSearch\.update|transaction\.create|outputProduct\.create/);
assert.equal(packageJson.scripts?.['check:client-case-context-records-foundation'], 'jiti scripts/checkClientCaseContextRecordsFoundation.ts');

assertRegistryIntegrity(FACT_SEMANTICS);
assertRegistryIntegrity(CRITERION_SEMANTICS);
assert.equal(FACT_SEMANTICS.PROPERTY_OCCUPANCY_STATUS.valueType, 'ENUM');
assert.deepEqual(CRITERION_SEMANTICS.TARGET_CITIES.allowedScopes, ['CASE', 'OBJECTIVE']);
assert.equal(CRITERION_SEMANTICS.PURCHASE_PRICE_RANGE_CENTS.valueType, 'RANGE_CENTS');

const writes: Array<{ model: string; data: Record<string, unknown> }> = [];
const predecessor: { id: string; clientCaseId: string; semanticKey: string; scopeReference: string; supersededAt: Date | null } = { id: 'fact-old', clientCaseId: 'case-a', semanticKey: 'PROPERTY_OCCUPANCY_STATUS', scopeReference: 'PROPERTY:case-property-a', supersededAt: null };
type FakeRecord = Record<string, unknown>;
type FakeDb = {
  clientCase: { findFirst: (query: { where: { id: string; ownerAgentSubject: string } }) => Promise<{ id: string } | null> };
  clientCaseObjective: { findFirst: (query: { where: { id: string; clientCaseId: string } }) => Promise<FakeRecord | null>; findUnique: () => Promise<null>; create: (query: { data: FakeRecord }) => Promise<FakeRecord>; update: (query: { data: FakeRecord }) => Promise<FakeRecord>; findMany: () => Promise<never[]> };
  clientCaseProperty: { findFirst: (query: { where: { id: string; clientCaseId: string } }) => Promise<{ id: string } | null>; findMany: () => Promise<never[]> };
  evidenceAdmission: { findFirst: () => Promise<null> };
  professionalInput: { findFirst: () => Promise<null> };
  clientCaseFact: { findFirst: (query: { where: FakeRecord }) => Promise<typeof predecessor | null>; create: (query: { data: FakeRecord }) => Promise<FakeRecord>; update: (query: { data: FakeRecord }) => Promise<typeof predecessor>; findMany: () => Promise<never[]> };
  clientCaseCriterion: { findFirst: () => Promise<null>; create: (query: { data: FakeRecord }) => Promise<FakeRecord>; update: () => Promise<FakeRecord>; findMany: () => Promise<never[]> };
  $transaction: <T>(callback: (tx: FakeDb) => Promise<T>) => Promise<T>;
};
const db: FakeDb = {
  clientCase: {
    findFirst: async ({ where }: { where: { id: string; ownerAgentSubject: string } }) => where.id === 'case-a' && where.ownerAgentSubject === 'agent-a' ? { id: 'case-a' } : null,
  },
  clientCaseObjective: {
    findFirst: async ({ where }: { where: { id: string; clientCaseId: string } }) => where.id === 'objective-a' && where.clientCaseId === 'case-a' ? { id: 'objective-a', clientCaseId: 'case-a', status: 'ACTIVE' } : null,
    findUnique: async () => null,
    create: async ({ data }: { data: Record<string, unknown> }) => { writes.push({ model: 'objective', data }); return { id: 'objective-a', ...data }; },
    update: async ({ data }: { data: Record<string, unknown> }) => ({ id: 'objective-a', ...data }),
    findMany: async () => [],
  },
  clientCaseProperty: {
    findFirst: async ({ where }: { where: { id: string; clientCaseId: string } }) => where.id === 'case-property-a' && where.clientCaseId === 'case-a' ? { id: 'case-property-a' } : null,
    findMany: async () => [],
  },
  evidenceAdmission: { findFirst: async () => null },
  professionalInput: { findFirst: async () => null },
  clientCaseFact: {
    findFirst: async ({ where }: { where: Record<string, unknown> }) => where.id === 'fact-old' ? predecessor : null,
    create: async ({ data }: { data: Record<string, unknown> }) => { writes.push({ model: 'fact', data }); return { id: 'fact-new', ...data }; },
    update: async ({ data }: { data: Record<string, unknown> }) => { predecessor.supersededAt = data.supersededAt as Date; return predecessor; },
    findMany: async () => [],
  },
  clientCaseCriterion: {
    findFirst: async () => null,
    create: async ({ data }: { data: Record<string, unknown> }) => { writes.push({ model: 'criterion', data }); return { id: 'criterion-a', ...data }; },
    update: async () => ({}),
    findMany: async () => [],
  },
  $transaction: async <T>(callback: (tx: FakeDb) => Promise<T>) => callback(db),
};

const service = createClientCaseContextRecordsService(db as never);

void (async () => {
  await service.createObjective('agent-a', 'case-a', { objectiveType: 'BUY_PRIMARY_HOME', title: 'Synthetic purchase objective', clientMutationKey: 'objective-create-1' });
  await service.createFact('agent-a', 'case-a', {
    semanticKey: 'PROPERTY_OCCUPANCY_STATUS',
    scope: 'PROPERTY',
    clientCasePropertyId: 'case-property-a',
    value: 'OWNER_OCCUPIED',
    sourcePosture: 'AGENT_ENTERED',
    supersedesId: 'fact-old',
  });
  await service.createCriterion('agent-a', 'case-a', {
    semanticKey: 'PURCHASE_PRICE_RANGE_CENTS',
    scope: 'OBJECTIVE',
    objectiveId: 'objective-a',
    value: { minimumCents: 50000000, maximumCents: 70000000, currency: 'USD' },
    sourcePosture: 'CLIENT_STATED',
  });
  assert.equal(writes[0].model, 'objective');
  assert.equal(writes[1].data.scopeReference, 'PROPERTY:case-property-a');
  assert.equal(writes[1].data.supersedesFactId, 'fact-old');
  assert.ok(predecessor.supersededAt instanceof Date);
  assert.equal(writes[2].data.scopeReference, 'OBJECTIVE:objective-a');

  await assert.rejects(
    () => service.createCriterion('agent-a', 'case-a', { semanticKey: 'MIN_BEDROOMS', scope: 'OBJECTIVE', objectiveId: 'objective-foreign', value: 3, sourcePosture: 'CLIENT_STATED' }),
    (error: unknown) => error instanceof ClientCaseContextRecordsError && error.code === 'NOT_FOUND',
  );
  await assert.rejects(
    () => service.createFact('agent-a', 'case-a', { semanticKey: 'PROPERTY_OCCUPANCY_STATUS', scope: 'PROPERTY', clientCasePropertyId: 'case-property-a', value: { invalid: true }, sourcePosture: 'AGENT_ENTERED' }),
    (error: unknown) => error instanceof ClientCaseContextRecordsError && error.code === 'INVALID_REQUEST',
  );
  await assert.rejects(
    () => service.createCriterion('agent-a', 'case-a', { semanticKey: 'TARGET_CITIES', scope: 'CASE', value: ['Boulder'], sourcePosture: 'EVIDENCE_SUPPORTED' }),
    (error: unknown) => error instanceof ClientCaseContextRecordsError && error.code === 'INVALID_REQUEST',
  );
  console.log('CLIENT_CASE_CONTEXT_RECORDS_FOUNDATION_CHECK: PASS');
})().catch((error) => { console.error(error); process.exitCode = 1; });
