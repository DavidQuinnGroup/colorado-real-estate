import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

import {
  CLIENT_CASE_PROPERTY_RELATIONSHIP_ROLES_VERSION,
  LEGACY_ROLE_TO_RELATIONSHIP_ROLE,
  RELATIONSHIP_ROLE_LABELS,
  createClientCasePropertyRelationshipService,
} from '../lib/clientCasePropertyRelationshipRoles';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migrationPath = 'prisma/migrations/20260916000000_add_client_case_property_relationship_roles_wave_b/migration.sql';
const migration = readFileSync(migrationPath, 'utf8');
const workflow = readFileSync('lib/clientCaseInformationWorkflow.ts', 'utf8');
const route = readFileSync('app/api/agent/client-case-information/route.ts', 'utf8');
const context = readFileSync('lib/clientCaseEffectiveContextResolver.ts', 'utf8');
const readiness = readFileSync('lib/clientCaseCapabilityReadinessEvaluator.ts', 'utf8');
const registry = readFileSync('lib/clientCaseCapabilityReadinessRegistry.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(CLIENT_CASE_PROPERTY_RELATIONSHIP_ROLES_VERSION, 'CLIENT_CASE_PROPERTY_RELATIONSHIP_ROLES_WAVE_B_V1');
assert.equal(packageJson.scripts?.['check:client-information-wave-b-property-relationships'], 'jiti scripts/checkClientInformationWaveBPropertyRelationships.ts');
assert.match(schema, /enum ClientCasePropertyRelationshipRoleType/);
assert.match(schema, /CURRENT_HOME[\s\S]*TARGET_PRIMARY[\s\S]*INVESTMENT_PROPERTY[\s\S]*SALE_RELEVANT[\s\S]*OTHER/);
assert.match(schema, /enum ClientCasePropertyRelationshipRoleStatus/);
assert.match(schema, /model ClientCasePropertyRelationshipRole/);
assert.match(schema, /relationshipRoles ClientCasePropertyRelationshipRole\[\]/);
assert.match(schema, /@@unique\(\[clientCaseId, canonicalPropertyId\]\)/);
const waveBRoleEnum = schema.match(/enum ClientCasePropertyRelationshipRoleType \{[\s\S]*?\}/)?.[0] ?? '';
assert.doesNotMatch(waveBRoleEnum, /OWNER|CO_OWNER|OCCUPANT|UNDER_CONTRACT|PENDING|COMING_SOON/);

assert.match(migration, /CREATE TYPE "ClientCasePropertyRelationshipRoleType"/);
assert.match(migration, /CREATE TABLE "ClientCasePropertyRelationshipRole"/);
assert.match(migration, /CREATE UNIQUE INDEX "CCPRR_active_property_role_uq"[\s\S]*WHERE "status" = 'ACTIVE'/);
assert.match(migration, /INSERT INTO "ClientCasePropertyRelationshipRole"/);
assert.match(migration, /WHEN 'CURRENT_HOME' THEN 'CURRENT_HOME'/);
assert.match(migration, /WHEN 'NEW_PRIMARY' THEN 'TARGET_PRIMARY'/);
assert.match(migration, /WHEN 'INVESTMENT_PROPERTY' THEN 'INVESTMENT_PROPERTY'/);
assert.match(migration, /WHEN 'SALE_PROPERTY' THEN 'SALE_RELEVANT'/);
assert.match(migration, /WHEN 'OTHER' THEN 'OTHER'/);
assert.doesNotMatch(migration, /DROP TABLE|DROP COLUMN|DELETE FROM|UPDATE "ClientCaseProperty"|ALTER TABLE "ClientCaseProperty" DROP/i);

assert.deepEqual(LEGACY_ROLE_TO_RELATIONSHIP_ROLE, {
  CURRENT_HOME: 'CURRENT_HOME',
  NEW_PRIMARY: 'TARGET_PRIMARY',
  INVESTMENT_PROPERTY: 'INVESTMENT_PROPERTY',
  SALE_PROPERTY: 'SALE_RELEVANT',
  OTHER: 'OTHER',
});
assert.equal(RELATIONSHIP_ROLE_LABELS.SALE_RELEVANT, 'Planning to sell');

assert.match(workflow, /attachExistingProperty/);
assert.match(workflow, /addRelationshipRole/);
assert.match(workflow, /endRelationshipRole/);
assert.match(route, /ATTACH_DISCOVERED_PROPERTY|ADD_PROPERTY_RELATIONSHIP_ROLE|END_PROPERTY_RELATIONSHIP_ROLE/);
assert.match(route, /canonicalPropertyIdForResultToken/);
assert.doesNotMatch(route, /body\.action === 'ATTACH_EXISTING_PROPERTY'/);
assert.match(route, /isSameOriginAdminRequest/);
assert.match(context, /relationshipRoles:\s*\{/);
assert.match(readiness, /hasCasePropertyRole/);
assert.match(registry, /BUYER_DECISION_TARGET_PROPERTY/);

type Role = { id: string; clientCasePropertyId: string; role: string; status: 'ACTIVE' | 'ENDED'; startedAt: Date; endedAt: Date | null; createdBySubject: string; createdAt: Date; updatedAt: Date };
const now = new Date('2026-09-16T12:00:00.000Z');
const state = {
  cases: [{ id: 'case-x', ownerAgentSubject: 'agent-a', status: 'ACTIVE', createdBySubject: 'agent-a' }],
  canonicalProperties: [
    { id: 'home-a', sourceFormattedSitusAddress: '100 Canonical Way', normalizedSitusAddress: '100 CANONICAL WAY', city: 'Boulder', state: 'CO', postalCode: '80302' },
    { id: 'home-b', sourceFormattedSitusAddress: '200 Target Ave', normalizedSitusAddress: '200 TARGET AVE', city: 'Boulder', state: 'CO', postalCode: '80302' },
    { id: 'property-c', sourceFormattedSitusAddress: '300 Investor Rd', normalizedSitusAddress: '300 INVESTOR RD', city: 'Longmont', state: 'CO', postalCode: '80501' },
  ],
  anchors: [] as Array<{ id: string; clientCaseId: string; canonicalPropertyId: string; role: string; createdAt: Date; updatedAt: Date }>,
  roles: [] as Role[],
  facts: [] as any[],
  dispositions: [
    { id: 'scenario-sell-a', clientCasePropertyId: 'anchor-home-a', disposition: 'SELL', createdAt: now, scenarioVersion: { id: 'scenario-1-v1', versionNumber: 1, scenario: { id: 'scenario-1', name: 'Sell A acquire B', currentVersionId: 'scenario-1-v1' } } },
    { id: 'scenario-retain-a', clientCasePropertyId: 'anchor-home-a', disposition: 'RETAIN', createdAt: now, scenarioVersion: { id: 'scenario-3-v1', versionNumber: 1, scenario: { id: 'scenario-3', name: 'Retain A acquire B', currentVersionId: 'scenario-3-v1' } } },
  ],
};

const byId = <T extends { id: string }>(rows: T[], id: string) => rows.find((row) => row.id === id) ?? null;
let sequence = 0;
function next(prefix: string) { sequence += 1; return `${prefix}-${sequence}`; }
function includeAnchor(anchor: (typeof state.anchors)[number]) {
  return {
    ...anchor,
    canonicalProperty: byId(state.canonicalProperties, anchor.canonicalPropertyId),
    relationshipRoles: state.roles.filter((role) => role.clientCasePropertyId === anchor.id),
    facts: state.facts.filter((fact) => fact.clientCasePropertyId === anchor.id),
    scenarioPropertyDispositions: state.dispositions.filter((entry) => entry.clientCasePropertyId === anchor.id),
  };
}

const db: any = {
  clientCase: {
    findFirst: async ({ where }: any) => state.cases.find((row) => row.id === where.id && row.ownerAgentSubject === where.ownerAgentSubject) ?? null,
  },
  canonicalPhysicalProperty: {
    findUnique: async ({ where }: any) => byId(state.canonicalProperties, where.id),
  },
  clientCaseProperty: {
    findFirst: async ({ where }: any) => {
      const anchor = state.anchors.find((row) => (!where.id || row.id === where.id) && (!where.clientCaseId || row.clientCaseId === where.clientCaseId) && (!where.canonicalPropertyId || row.canonicalPropertyId === where.canonicalPropertyId));
      return anchor ? includeAnchor(anchor) : null;
    },
    findMany: async ({ where }: any) => state.anchors.filter((row) => row.clientCaseId === where.clientCaseId).map(includeAnchor),
    create: async ({ data }: any) => {
      if (state.anchors.some((row) => row.clientCaseId === data.clientCaseId && row.canonicalPropertyId === data.canonicalPropertyId)) {
        const error = new Error('duplicate') as Error & { code?: string };
        error.code = 'P2002';
        throw error;
      }
      const anchor = { id: `anchor-${data.canonicalPropertyId}`, clientCaseId: data.clientCaseId, canonicalPropertyId: data.canonicalPropertyId, role: data.role, createdAt: now, updatedAt: now };
      state.anchors.push(anchor);
      return anchor;
    },
  },
  clientCasePropertyRelationshipRole: {
    findFirst: async ({ where }: any) => state.roles.find((row) => (!where.id || row.id === where.id) && (!where.clientCasePropertyId || row.clientCasePropertyId === where.clientCasePropertyId) && (!where.role || row.role === where.role) && (!where.status || row.status === where.status) && (!where.clientCaseProperty || state.anchors.some((anchor) => anchor.id === row.clientCasePropertyId && anchor.clientCaseId === where.clientCaseProperty.clientCaseId))) ?? null,
    create: async ({ data }: any) => {
      if (state.roles.some((row) => row.clientCasePropertyId === data.clientCasePropertyId && row.role === data.role && row.status === 'ACTIVE')) {
        const error = new Error('duplicate') as Error & { code?: string };
        error.code = 'P2002';
        throw error;
      }
      const role: Role = { id: next('role'), clientCasePropertyId: data.clientCasePropertyId, role: data.role, status: data.status, startedAt: now, endedAt: null, createdBySubject: data.createdBySubject, createdAt: now, updatedAt: now };
      state.roles.push(role);
      return role;
    },
    update: async ({ where, data }: any) => {
      const role = state.roles.find((row) => row.id === where.id)!;
      Object.assign(role, data, { updatedAt: now });
      return role;
    },
  },
  $transaction: async (callback: any) => callback(db),
};

void (async () => {
  const service = createClientCasePropertyRelationshipService(db);
  await service.attachExistingProperty('agent-a', 'case-x', { canonicalPropertyId: 'home-a', roles: ['CURRENT_HOME', 'SALE_RELEVANT'] });
  await service.attachExistingProperty('agent-a', 'case-x', { canonicalPropertyId: 'home-b', roles: ['TARGET_PRIMARY'] });
  await service.attachExistingProperty('agent-a', 'case-x', { canonicalPropertyId: 'property-c', roles: ['INVESTMENT_PROPERTY'] });
  assert.equal(state.anchors.length, 3);
  assert.equal(state.roles.length, 4);
  assert.equal(state.roles.filter((role) => role.clientCasePropertyId === 'anchor-home-a' && role.status === 'ACTIVE').length, 2);
  await assert.rejects(() => service.addRelationshipRole('agent-a', 'case-x', 'anchor-home-a', { role: 'CURRENT_HOME' }), /already active/);
  await assert.rejects(() => service.addRelationshipRole('agent-a', 'case-x', 'anchor-home-a', { role: 'OWNER' }), /unsupported/);
  await assert.rejects(() => service.addRelationshipRole('agent-b', 'case-x', 'anchor-home-a', { role: 'OTHER' }), /unavailable/);
  const saleRole = state.roles.find((role) => role.clientCasePropertyId === 'anchor-home-a' && role.role === 'SALE_RELEVANT')!;
  await service.endRelationshipRole('agent-a', 'case-x', saleRole.id);
  assert.equal(state.roles.find((role) => role.id === saleRole.id)?.status, 'ENDED');
  assert.equal(state.roles.some((role) => role.clientCasePropertyId === 'anchor-home-a' && role.role === 'CURRENT_HOME' && role.status === 'ACTIVE'), true);
  assert.equal(state.anchors.length, 3);
  assert.equal(state.dispositions.length, 2);
  const listed = await service.listProperties('agent-a', 'case-x');
  assert.equal(listed.find((property) => property.id === 'anchor-home-a')?.activeRelationshipRoleLabels.includes('Current home'), true);
  assert.equal(createHash('sha256').update(migration).digest('hex').length, 64);
  console.log('client-information-wave-b-property-relationships: PASS');
})().catch((error) => { console.error(error); process.exitCode = 1; });
