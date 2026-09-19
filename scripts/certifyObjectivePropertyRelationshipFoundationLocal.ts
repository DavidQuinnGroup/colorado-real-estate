import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';

import { Prisma, PrismaClient } from '@prisma/client';

import { createClientCaseObjectivePropertyRelationshipService } from '../lib/clientCaseObjectivePropertyRelationships';
import { CANONICAL_DATABASE_BASELINE } from '../lib/schema/canonicalDatabaseBaseline';
import {
  bootstrapCanonicalDatabaseBaseline,
  disposeCanonicalDatabaseBaseline,
  localBaselineSql,
  localBaselineTarget,
  localHarnessUrl,
  prismaLocalEnvironment,
  runLocalCommand,
} from './canonicalDatabaseBaselineLocal';

const migrationName = '20260919020000_objective_property_relationship_foundation_v1';

function assertEmptyMigrationDiff(output: string, message: string) {
  assert.ok(output.trim() === '' || output.trim() === '-- This is an empty migration.', message);
}

function schemaFingerprint(database: string) {
  const schema = runLocalCommand('docker', [
    'exec', 'atlas-objective-property-local-postgres', 'pg_dump', '-U', 'postgres', '-d', database,
    '--schema-only', '--no-owner', '--no-privileges', '--exclude-table=_prisma_migrations',
  ]);
  const normalized = schema
    .replace(/^-- Database:.*$/gm, '')
    .replace(/^\\connect .*$/gm, '')
    .replace(/^\\restrict .*$/gm, '')
    .replace(/^\\unrestrict .*$/gm, '');
  return createHash('sha256').update(normalized).digest('hex');
}

function bootstrapAtCanonicalBaseline(target: ReturnType<typeof localBaselineTarget>) {
  const result = bootstrapCanonicalDatabaseBaseline(target, { resolveHistoricalMigrations: false });
  const historicalMigrations = readdirSync('prisma/migrations', { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name <= CANONICAL_DATABASE_BASELINE.historicalMigrationCutoff)
    .map((entry) => entry.name)
    .sort();
  assert.ok(historicalMigrations.includes(CANONICAL_DATABASE_BASELINE.historicalMigrationCutoff), 'The canonical historical migration cutoff is absent.');
  const ledgerValues = historicalMigrations.map((migration) => {
    const checksum = createHash('sha256').update(readFileSync(`prisma/migrations/${migration}/migration.sql`)).digest('hex');
    return `(gen_random_uuid(), '${checksum}', CURRENT_TIMESTAMP, '${migration}', '', CURRENT_TIMESTAMP, 0)`;
  });
  localBaselineSql(target.database, `
CREATE TABLE "_prisma_migrations" (
  "id" VARCHAR(36) NOT NULL,
  "checksum" VARCHAR(64) NOT NULL,
  "finished_at" TIMESTAMPTZ,
  "migration_name" VARCHAR(255) NOT NULL,
  "logs" TEXT,
  "rolled_back_at" TIMESTAMPTZ,
  "started_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "started_at", "applied_steps_count")
VALUES ${ledgerValues.join(',\n')};
`);
  assert.equal(
    localBaselineSql(target.database, `SELECT count(*) FROM "_prisma_migrations";`).trim(),
    String(historicalMigrations.length),
    'The local historical migration ledger must match the published canonical cutoff.',
  );
  return { ...result, historicalMigrations: historicalMigrations.length };
}

function fixtureClient(url: string) {
  return new PrismaClient({ datasources: { db: { url } } });
}

function measuredFixtureClient(url: string) {
  const queryCounter = { value: 0 };
  const prisma = new PrismaClient<Prisma.PrismaClientOptions, 'query'>({
    datasources: { db: { url } },
    log: [{ emit: 'event', level: 'query' }],
  });
  prisma.$on('query', () => { queryCounter.value += 1; });
  return { prisma, queryCounter };
}

async function seedPreexistingPathA(prisma: PrismaClient) {
  await prisma.canonicalPhysicalProperty.create({ data: { id: 'path-a-canonical' } });
  await prisma.clientCase.create({
    data: {
      id: 'path-a-case',
      ownerAgentSubject: 'path-a-agent',
      displayName: 'Path A preexisting case',
      createdBySubject: 'path-a-agent',
      idempotencyKey: 'path-a-case-key',
    },
  });
  await prisma.clientCaseObjective.create({
    data: {
      id: 'path-a-objective',
      clientCaseId: 'path-a-case',
      objectiveType: 'BUY_PRIMARY_HOME',
      title: 'Path A preexisting objective',
      createdBySubject: 'path-a-agent',
      idempotencyKey: 'path-a-objective-key',
    },
  });
  await prisma.clientCaseProperty.create({
    data: {
      id: 'path-a-property',
      clientCaseId: 'path-a-case',
      canonicalPropertyId: 'path-a-canonical',
      role: 'OTHER',
    },
  });
}

async function seedFixture(prisma: PrismaClient) {
  for (const id of ['a', 'b', 'c', 'd', 'e', 'f']) {
    await prisma.canonicalPhysicalProperty.create({
      data: {
        id: `canonical-${id}`,
        sourceFormattedSitusAddress: `${id.toUpperCase()} Synthetic Way`,
        city: 'Boulder',
        state: 'CO',
        postalCode: '80302',
      },
    });
  }
  await prisma.clientCase.createMany({
    data: [
      { id: 'case-a', ownerAgentSubject: 'agent-a', displayName: 'Synthetic Client A', createdBySubject: 'agent-a', idempotencyKey: 'case-a-key' },
      { id: 'case-b', ownerAgentSubject: 'agent-b', displayName: 'Synthetic Client B', createdBySubject: 'agent-b', idempotencyKey: 'case-b-key' },
    ],
  });
  await prisma.clientCaseObjective.createMany({
    data: [
      { id: 'objective-s1', clientCaseId: 'case-a', objectiveType: 'SELL_CURRENT_HOME', title: 'SELL S1', createdBySubject: 'agent-a', idempotencyKey: 'objective-s1-key' },
      { id: 'objective-b1', clientCaseId: 'case-a', objectiveType: 'BUY_PRIMARY_HOME', title: 'BUY B1', createdBySubject: 'agent-a', idempotencyKey: 'objective-b1-key' },
      { id: 'objective-b2', clientCaseId: 'case-a', objectiveType: 'BUY_PRIMARY_HOME', title: 'BUY B2', createdBySubject: 'agent-a', idempotencyKey: 'objective-b2-key' },
      { id: 'objective-i1', clientCaseId: 'case-a', objectiveType: 'INVESTMENT_ACQUISITION', title: 'INVEST I1', createdBySubject: 'agent-a', idempotencyKey: 'objective-i1-key' },
      { id: 'objective-life', clientCaseId: 'case-a', objectiveType: 'BUY_PRIMARY_HOME', title: 'Lifecycle probe', createdBySubject: 'agent-a', idempotencyKey: 'objective-life-key' },
    ],
  });
  await prisma.clientCaseProperty.createMany({
    data: [
      ...['a', 'b', 'c', 'd', 'e'].map((id) => ({ id: `property-${id}`, clientCaseId: 'case-a', canonicalPropertyId: `canonical-${id}`, role: 'OTHER' as const })),
      { id: 'property-f', clientCaseId: 'case-b', canonicalPropertyId: 'canonical-f', role: 'OTHER' as const },
    ],
  });
}

async function reject(operation: () => Promise<unknown>) {
  await assert.rejects(operation);
}

export async function certifyObjectivePropertyRelationshipFoundationLocal() {
assert.equal(process.env.ATLAS_BASELINE_LOCAL_MODE, '1', 'Set ATLAS_BASELINE_LOCAL_MODE=1 to run local certification.');
assert.equal(process.env.ATLAS_BASELINE_RESET, '1', 'Set ATLAS_BASELINE_RESET=1 to run local certification.');

const pathA = localBaselineTarget('atlas_canonical_baseline_path_a', localHarnessUrl('atlas_canonical_baseline_path_a'));
const pathB = localBaselineTarget('atlas_canonical_baseline_path_b', localHarnessUrl('atlas_canonical_baseline_path_b'));
let pathAPrisma: PrismaClient | undefined;
let pathBPrisma: PrismaClient | undefined;

try {
  bootstrapAtCanonicalBaseline(pathA);
  pathAPrisma = fixtureClient(pathA.url);
  await seedPreexistingPathA(pathAPrisma);
  await pathAPrisma.$disconnect();
  pathAPrisma = undefined;

  const pathADeploy = runLocalCommand('npx', ['prisma', 'migrate', 'deploy', '--schema', 'prisma/schema.prisma'], prismaLocalEnvironment(pathA.url));
  assert.match(pathADeploy, new RegExp(`Applying migration[\\s\\S]*${migrationName}`), 'Path A must apply the exact Objective-Property migration.');
  pathAPrisma = fixtureClient(pathA.url);
  assert.equal(await pathAPrisma.clientCase.count({ where: { id: 'path-a-case' } }), 1);
  assert.equal(await pathAPrisma.clientCaseObjective.count({ where: { id: 'path-a-objective' } }), 1);
  assert.equal(await pathAPrisma.clientCaseProperty.count({ where: { id: 'path-a-property' } }), 1);
  assert.equal(await pathAPrisma.clientCaseObjectivePropertyRelationship.count(), 0, 'Path A migration must not backfill relationship intent.');
  await pathAPrisma.$disconnect();
  pathAPrisma = undefined;

  bootstrapAtCanonicalBaseline(pathB);
  const pathBDeploy = runLocalCommand('npx', ['prisma', 'migrate', 'deploy', '--schema', 'prisma/schema.prisma'], prismaLocalEnvironment(pathB.url));
  assert.match(pathBDeploy, new RegExp(`Applying migration[\\s\\S]*${migrationName}`), 'Path B must apply the exact Objective-Property migration.');
  pathBPrisma = fixtureClient(pathB.url);
  assert.equal(await pathBPrisma.clientCaseObjectivePropertyRelationship.count(), 0, 'Path B must begin with zero relationship rows.');
  await pathBPrisma.$disconnect();
  pathBPrisma = undefined;

  const convergence = runLocalCommand('npx', ['prisma', 'migrate', 'diff', '--from-url', pathA.url, '--to-url', pathB.url, '--script'], prismaLocalEnvironment(pathA.url));
  assertEmptyMigrationDiff(convergence, 'Path A and Path B must converge after the exact migration.');
  assert.equal(schemaFingerprint(pathA.database), schemaFingerprint(pathB.database), 'Path A and Path B schema fingerprints must match.');

  const noOpDiff = runLocalCommand('npx', ['prisma', 'migrate', 'diff', '--from-url', pathA.url, '--to-schema-datamodel', 'prisma/schema.prisma', '--script'], prismaLocalEnvironment(pathA.url));
  const noOpWithoutRawPrismaLimitations = noOpDiff
    .replace(/(?:--[^\n]*\n)?DROP INDEX "CCOPR_active_objective_property_uq";?\s*/g, '')
    .replace(/(?:--[^\n]*\n)?ALTER TABLE "ClientCaseObjectivePropertyRelationship" DROP CONSTRAINT "CCOPR_status_ended_at_ck";?\s*/g, '');
  assertEmptyMigrationDiff(noOpWithoutRawPrismaLimitations, 'Prisma diff must have no unexpected material drift beyond its raw partial-index/check representation.');

  pathAPrisma = fixtureClient(pathA.url);
  await seedFixture(pathAPrisma);
  const service = createClientCaseObjectivePropertyRelationshipService(pathAPrisma);
  const s1a = await service.link('agent-a', 'case-a', { objectiveId: 'objective-s1', clientCasePropertyId: 'property-a', role: 'SUBJECT' });
  const b1b = await service.link('agent-a', 'case-a', { objectiveId: 'objective-b1', clientCasePropertyId: 'property-b', role: 'CANDIDATE' });
  const b1c = await service.link('agent-a', 'case-a', { objectiveId: 'objective-b1', clientCasePropertyId: 'property-c', role: 'CANDIDATE' });
  await service.link('agent-a', 'case-a', { objectiveId: 'objective-b2', clientCasePropertyId: 'property-d', role: 'CANDIDATE' });
  await service.link('agent-a', 'case-a', { objectiveId: 'objective-i1', clientCasePropertyId: 'property-c', role: 'CANDIDATE' });
  await service.link('agent-a', 'case-a', { objectiveId: 'objective-i1', clientCasePropertyId: 'property-e', role: 'CANDIDATE' });
  assert.equal(await pathAPrisma.clientCaseObjectivePropertyRelationship.count({ where: { status: 'ACTIVE' } }), 6, 'The complex fixture must contain six active relationships.');
  assert.equal(s1a.createdBySubject, 'agent-a');
  assert.equal(b1b.role, 'CANDIDATE');

  await reject(() => service.link('agent-a', 'case-a', { objectiveId: 'objective-b1', clientCasePropertyId: 'property-f', role: 'CANDIDATE' }));
  await reject(() => service.listByClientCase('agent-a', 'case-b'));
  await reject(() => service.link('', 'case-a', { objectiveId: 'objective-b1', clientCasePropertyId: 'property-b', role: 'CANDIDATE' }));
  await reject(() => service.link('agent-a', 'case-a', { objectiveId: 'objective-b2', clientCasePropertyId: 'property-e', role: 'CANDIDATE', createdBySubject: 'override' }));
  await reject(() => service.link('agent-a', 'case-a', { objectiveId: 'objective-b2', clientCasePropertyId: 'property-e', role: 'CANDIDATE', startedAt: '2020-01-01T00:00:00.000Z' }));

  await assert.rejects(() => pathAPrisma!.$executeRawUnsafe(`INSERT INTO "ClientCaseObjectivePropertyRelationship" ("id", "clientCaseId", "objectiveId", "clientCasePropertyId", "role", "status", "createdBySubject", "updatedAt") VALUES ('cross-client', 'case-a', 'objective-b1', 'property-f', 'CANDIDATE', 'ACTIVE', 'agent-a', CURRENT_TIMESTAMP)`));
  await assert.rejects(() => pathAPrisma!.$executeRawUnsafe(`INSERT INTO "ClientCaseObjectivePropertyRelationship" ("id", "clientCaseId", "objectiveId", "clientCasePropertyId", "role", "status", "createdBySubject", "updatedAt") VALUES ('duplicate-active', 'case-a', 'objective-b1', 'property-b', 'CANDIDATE', 'ACTIVE', 'agent-a', CURRENT_TIMESTAMP)`));
  await assert.rejects(() => pathAPrisma!.$executeRawUnsafe(`INSERT INTO "ClientCaseObjectivePropertyRelationship" ("id", "clientCaseId", "objectiveId", "clientCasePropertyId", "role", "status", "endedAt", "createdBySubject", "updatedAt") VALUES ('invalid-active', 'case-a', 'objective-life', 'property-b', 'CANDIDATE', 'ACTIVE', CURRENT_TIMESTAMP, 'agent-a', CURRENT_TIMESTAMP)`));
  await assert.rejects(() => pathAPrisma!.$executeRawUnsafe(`INSERT INTO "ClientCaseObjectivePropertyRelationship" ("id", "clientCaseId", "objectiveId", "clientCasePropertyId", "role", "status", "createdBySubject", "updatedAt") VALUES ('invalid-ended', 'case-a', 'objective-life', 'property-c', 'CANDIDATE', 'ENDED', 'agent-a', CURRENT_TIMESTAMP)`));
  await assert.rejects(() => pathAPrisma!.$executeRawUnsafe(`INSERT INTO "ClientCaseObjectivePropertyRelationship" ("id", "clientCaseId", "objectiveId", "clientCasePropertyId", "role", "status", "createdBySubject", "updatedAt") VALUES ('invalid-role', 'case-a', 'objective-life', 'property-d', 'UNSUPPORTED', 'ACTIVE', 'agent-a', CURRENT_TIMESTAMP)`));
  await assert.rejects(() => pathAPrisma!.$executeRawUnsafe(`INSERT INTO "ClientCaseObjectivePropertyRelationship" ("id", "clientCaseId", "objectiveId", "clientCasePropertyId", "role", "status", "createdBySubject", "updatedAt") VALUES ('invalid-status', 'case-a', 'objective-life', 'property-e', 'CANDIDATE', 'UNSUPPORTED', 'agent-a', CURRENT_TIMESTAMP)`));

  await pathAPrisma!.$executeRawUnsafe(`INSERT INTO "ClientCaseObjectivePropertyRelationship" ("id", "clientCaseId", "objectiveId", "clientCasePropertyId", "role", "status", "createdBySubject", "updatedAt") VALUES ('active-valid', 'case-a', 'objective-life', 'property-a', 'CANDIDATE', 'ACTIVE', 'agent-a', CURRENT_TIMESTAMP)`);
  await pathAPrisma!.$executeRawUnsafe(`INSERT INTO "ClientCaseObjectivePropertyRelationship" ("id", "clientCaseId", "objectiveId", "clientCasePropertyId", "role", "status", "endedAt", "createdBySubject", "updatedAt") VALUES ('ended-valid', 'case-a', 'objective-life', 'property-e', 'CANDIDATE', 'ENDED', CURRENT_TIMESTAMP, 'agent-a', CURRENT_TIMESTAMP)`);

  const ended = await service.end('agent-a', 'case-a', b1c.id);
  assert.equal(ended.status, 'ENDED');
  assert.ok(ended.endedAt);
  const b1cRelinked = await service.link('agent-a', 'case-a', { objectiveId: 'objective-b1', clientCasePropertyId: 'property-c', role: 'CANDIDATE' });
  assert.notEqual(b1cRelinked.id, b1c.id);
  assert.equal(b1cRelinked.status, 'ACTIVE');
  assert.equal(b1cRelinked.endedAt, null);
  await reject(() => service.link('agent-a', 'case-a', { objectiveId: 'objective-b1', clientCasePropertyId: 'property-c', role: 'CANDIDATE' }));

  await assert.rejects(() => pathAPrisma!.clientCaseObjective.delete({ where: { id: 'objective-b1' } }));
  await assert.rejects(() => pathAPrisma!.clientCaseProperty.delete({ where: { id: 'property-c' } }));
  const objectiveHistory = await service.listByObjective('agent-a', 'case-a', 'objective-b1');
  assert.equal(objectiveHistory.filter((relationship) => relationship.objectiveId === 'objective-b1').length, 3);
  const propertyHistory = await service.listByClientCaseProperty('agent-a', 'case-a', 'property-c');
  assert.equal(propertyHistory.length, 3);
  assert.equal(propertyHistory.some((relationship) => relationship.objectiveId === 'objective-i1'), true);

  await pathAPrisma.$disconnect();
  pathAPrisma = undefined;
  const measured = measuredFixtureClient(pathA.url);
  pathAPrisma = measured.prisma;
  const measuredService = createClientCaseObjectivePropertyRelationshipService(pathAPrisma);
  await measuredService.listByClientCase('agent-a', 'case-a', { status: 'ACTIVE', take: 1 });
  const oneRowQueryCount = measured.queryCounter.value;
  measured.queryCounter.value = 0;
  const batch = await measuredService.listByClientCase('agent-a', 'case-a', { status: 'ACTIVE', take: 100 });
  assert.equal(batch.some((relationship) => relationship.clientCaseId === 'case-b'), false);
  assert.equal(measured.queryCounter.value, oneRowQueryCount, 'Client batch reads must not add queries per relationship.');
  assert.ok(measured.queryCounter.value <= 5, `Client batch lookup must remain bounded; observed ${measured.queryCounter.value} queries.`);
  assert.ok(batch.length >= 6);

  const indexDefinition = localBaselineSql(pathA.database, `SELECT indexdef FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'CCOPR_active_objective_property_uq';`);
  assert.match(indexDefinition, /UNIQUE INDEX[\s\S]*\("objectiveId", "clientCasePropertyId"\)[\s\S]*WHERE[\s\S]*\(?"?status"? = 'ACTIVE'/);
  const checkDefinition = localBaselineSql(pathA.database, `SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'CCOPR_status_ended_at_ck';`);
  assert.match(checkDefinition, /"?status"? = 'ACTIVE'[\s\S]*"endedAt" IS NULL[\s\S]*"?status"? = 'ENDED'[\s\S]*"endedAt" IS NOT NULL/);
  const pathBStatus = runLocalCommand('npx', ['prisma', 'migrate', 'status', '--schema', 'prisma/schema.prisma'], prismaLocalEnvironment(pathB.url));
  assert.match(pathBStatus, /Database schema is up to date!/);
  assert.equal(localBaselineSql(pathB.database, `SELECT count(*) FROM "_prisma_migrations" WHERE finished_at IS NULL OR rolled_back_at IS NOT NULL;`).trim(), '0');

  console.log(`[objective-property-relationship-local] ok: Path A and Path B applied ${migrationName}, converged, preserved preexisting rows with zero backfill, and certified owner scope, composite integrity, active uniqueness, lifecycle history, parent restrictions, and bounded batch reads.`);
} finally {
  await pathAPrisma?.$disconnect();
  await pathBPrisma?.$disconnect();
  disposeCanonicalDatabaseBaseline(pathA);
  disposeCanonicalDatabaseBaseline(pathB);
}
}
