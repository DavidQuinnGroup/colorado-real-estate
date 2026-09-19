import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { ClientCaseContextRecordsError, createClientCaseContextRecordsService } from '../lib/clientCaseContextRecordsFoundation';
import { CREATABLE_PURSUIT_OBJECTIVE_TYPES, OBJECTIVE_TYPE_METADATA, objectiveTypeMetadata } from '../lib/clientCaseContextSemanticRegistry';

const serviceSource = readFileSync('lib/clientCaseContextRecordsFoundation.ts', 'utf8');
const registry = readFileSync('lib/clientCaseContextSemanticRegistry.ts', 'utf8');
const route = readFileSync('app/api/agent/client-case-objectives/route.ts', 'utf8');
const commandCenter = readFileSync('components/agent/ClientCommandCenter.tsx', 'utf8');
const information = readFileSync('components/agent/ClientCaseInformationWorkspace.tsx', 'utf8');
const fixture = readFileSync('components/agent/ClientObjectiveVisualFixture.tsx', 'utf8');
const fixturePage = readFileSync('app/agent/design-system/visual-certification/client-objectives/page.tsx', 'utf8');
const fixtureStyles = readFileSync('components/agent/ClientObjectiveVisualFixture.module.css', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(packageJson.scripts?.['check:client-objective-wave-a'], 'jiti scripts/checkClientObjectiveWaveA.ts');
assert.deepEqual(CREATABLE_PURSUIT_OBJECTIVE_TYPES, ['BUY_PRIMARY_HOME', 'SELL_CURRENT_HOME', 'INVESTMENT_ACQUISITION']);
assert.equal(OBJECTIVE_TYPE_METADATA.FINANCIAL_STRATEGY.creatablePursuit, false);
assert.equal(OBJECTIVE_TYPE_METADATA.FINANCIAL_STRATEGY.legacy, true);
assert.deepEqual(objectiveTypeMetadata('FUTURE_TYPE'), { displayLabel: 'Objective', creatablePursuit: false, domainAction: null, legacy: false, known: false });
assert.match(registry, /OBJECTIVE_TYPE_METADATA/);
assert.match(serviceSource, /listObjectiveSummary/);
assert.match(serviceSource, /createPursuitObjective/);
assert.match(serviceSource, /This Objective type is not available for new pursuits/);
assert.match(route, /authorizeAdminRequest/);
assert.match(route, /isSameOriginAdminRequest/);
assert.match(route, /CREATE_PURSUIT_OBJECTIVE/);
assert.match(route, /TRANSITION_OBJECTIVE/);
assert.doesNotMatch(route, /prisma\.clientCaseObjective\.(create|update|delete)/);
assert.match(commandCenter, /client-case-objectives/);
assert.match(commandCenter, /CREATE_PURSUIT_OBJECTIVE/);
assert.match(commandCenter, /TRANSITION_OBJECTIVE/);
assert.match(commandCenter, /No current Objectives/);
assert.match(commandCenter, /Historical Objectives/);
assert.doesNotMatch(commandCenter, /currentInformation\.value\.current\.objectives/);
assert.match(information, /Open Objectives/);
assert.doesNotMatch(information, /setBuyerObjective|setFinancialObjective/);
for (const fixtureName of ['O0', 'O1', 'O3', 'O4', 'OH', 'OL']) assert.match(fixture, new RegExp(fixtureName));
assert.match(fixture, /Static synthetic interface only/);
assert.doesNotMatch(fixture, /fetch\(|prisma|\/api\//i);
assert.match(fixturePage, /ClientObjectiveVisualFixture/);
assert.match(fixturePage, /index: false/);
assert.match(fixtureStyles, /@media \(max-width: 760px\)/);
assert.match(auth, /\/api\/agent\/client-case-objectives/);
assert.match(auth, /\/agent\/design-system\/visual-certification\/client-objectives/);

const records = [
  { id: 'buy-one', clientCaseId: 'case-a', objectiveType: 'BUY_PRIMARY_HOME', status: 'ACTIVE', title: 'Replacement home', createdAt: new Date('2026-01-03'), completedAt: null, archivedAt: null },
  { id: 'buy-two', clientCaseId: 'case-a', objectiveType: 'BUY_PRIMARY_HOME', status: 'ACTIVE', title: 'Mountain residence', createdAt: new Date('2026-01-02'), completedAt: null, archivedAt: null },
  { id: 'legacy-financial', clientCaseId: 'case-a', objectiveType: 'FINANCIAL_STRATEGY', status: 'ARCHIVED', title: 'Existing strategy context', createdAt: new Date('2026-01-01'), completedAt: null, archivedAt: new Date('2026-01-04') },
  { id: 'objective-b', clientCaseId: 'case-b', objectiveType: 'SELL_CURRENT_HOME', status: 'ACTIVE', title: 'Foreign Objective', createdAt: new Date('2026-01-05'), completedAt: null, archivedAt: null },
];
const idempotency = new Map<string, Record<string, unknown>>();
const db = {
  clientCase: { findFirst: async ({ where }: { where: { id: string; ownerAgentSubject: string } }) => where.id === 'case-a' && where.ownerAgentSubject === 'agent-a' ? { id: 'case-a' } : null },
  clientCaseObjective: {
    findMany: async ({ where }: { where: { clientCaseId: string } }) => records.filter((record) => record.clientCaseId === where.clientCaseId),
    findUnique: async ({ where }: { where: { idempotencyKey: string } }) => idempotency.get(where.idempotencyKey) ?? null,
    create: async ({ data }: { data: Record<string, unknown> }) => {
      const objective = { id: `created-${records.length}`, status: 'ACTIVE', completedAt: null, archivedAt: null, createdAt: new Date(), ...data } as Record<string, unknown>;
      records.push(objective as typeof records[number]);
      idempotency.set(String(data.idempotencyKey), objective);
      return objective;
    },
    findFirst: async ({ where }: { where: { id: string; clientCaseId: string } }) => records.find((record) => record.id === where.id && record.clientCaseId === where.clientCaseId) ?? null,
    update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
      const objective = records.find((record) => record.id === where.id)!;
      Object.assign(objective, data);
      return objective;
    },
  },
};

void (async () => {
  const service = createClientCaseContextRecordsService(db as never);
  const summary = await service.listObjectiveSummary('agent-a', 'case-a');
  assert.equal(summary.currentCount, 2);
  assert.equal(summary.historicalCount, 1);
  assert.equal(summary.historical[0].objectiveType, 'FINANCIAL_STRATEGY');
  await assert.rejects(() => service.listObjectiveSummary('agent-b', 'case-a'), (error: unknown) => error instanceof ClientCaseContextRecordsError && error.code === 'NOT_FOUND');
  const firstBuy = await service.createPursuitObjective('agent-a', 'case-a', { objectiveType: 'BUY_PRIMARY_HOME', title: 'Primary move', clientMutationKey: 'same-submit' });
  const repeatedBuy = await service.createPursuitObjective('agent-a', 'case-a', { objectiveType: 'BUY_PRIMARY_HOME', title: 'Primary move', clientMutationKey: 'same-submit' });
  const secondBuy = await service.createPursuitObjective('agent-a', 'case-a', { objectiveType: 'BUY_PRIMARY_HOME', title: 'Second residence', clientMutationKey: 'intentional-second' });
  assert.equal(firstBuy.id, repeatedBuy.id);
  assert.notEqual(firstBuy.id, secondBuy.id);
  await service.createPursuitObjective('agent-a', 'case-a', { objectiveType: 'SELL_CURRENT_HOME', title: 'Current residence', clientMutationKey: 'sell' });
  await service.createPursuitObjective('agent-a', 'case-a', { objectiveType: 'INVESTMENT_ACQUISITION', title: 'Long-term acquisition', clientMutationKey: 'invest' });
  await assert.rejects(() => service.createPursuitObjective('agent-a', 'case-a', { objectiveType: 'FINANCIAL_STRATEGY', title: 'Not a new pursuit', clientMutationKey: 'financial' }), (error: unknown) => error instanceof ClientCaseContextRecordsError && error.code === 'INVALID_REQUEST');
  await assert.rejects(() => service.transitionObjective('agent-a', 'case-a', 'objective-b', { status: 'ARCHIVED' }), (error: unknown) => error instanceof ClientCaseContextRecordsError && error.code === 'NOT_FOUND');
  const completed = await service.transitionObjective('agent-a', 'case-a', 'buy-one', { status: 'COMPLETED' });
  assert.equal(completed.status, 'COMPLETED');
  assert.ok(completed.completedAt instanceof Date);
  console.log('client-objective-wave-a: PASS');
})().catch((error) => { console.error(error); process.exitCode = 1; });
