import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { ClientCaseEffectiveContextError, createClientCaseEffectiveContextResolver } from '../lib/clientCaseEffectiveContextResolver';
import { assertEffectiveContextResolutionRegistryIntegrity, SCENARIO_CRITERION_RESOLUTION_RULES } from '../lib/clientCaseEffectiveContextResolutionRegistry';

const source = readFileSync('lib/clientCaseEffectiveContextResolver.ts', 'utf8');
const registry = readFileSync('lib/clientCaseEffectiveContextResolutionRegistry.ts', 'utf8');
const schema = readFileSync('prisma/schema.prisma', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(packageJson.scripts?.['check:client-case-effective-context-resolver'], 'jiti scripts/checkClientCaseEffectiveContextResolver.ts');
assert.match(source, /CANONICAL_BASELINE/);
assert.match(source, /SCENARIO_VERSION/);
assert.match(source, /supersededAt: null/);
assert.match(source, /scenarioVersionId/);
assert.match(source, /clientCaseId, clientCase: \{ ownerAgentSubject \}/);
assert.doesNotMatch(source, /\.create\(|\.update\(|\.delete\(|\$transaction/);
assert.doesNotMatch(source, /fetch\(|app\/api|NextResponse|react/i);
assert.doesNotMatch(registry, /DATABASE_URL|PrismaClient|fetch\(/);
assert.doesNotMatch(schema, /EffectiveContext|ContextCache|ResolvedInput|ScenarioResolution/);
assert.equal(SCENARIO_CRITERION_RESOLUTION_RULES.MIN_BEDROOMS.category, 'SCENARIO_OVERRIDES_CANONICAL_CRITERION');
assertEffectiveContextResolutionRegistryIntegrity();

type Row = Record<string, any>;

const date = new Date('2026-09-14T00:00:00.000Z');
const state = {
  cases: [
    { id: 'case-a', ownerAgentSubject: 'agent-a', displayName: 'Synthetic Case A', status: 'ACTIVE' },
    { id: 'case-b', ownerAgentSubject: 'agent-b', displayName: 'Synthetic Case B', status: 'ACTIVE' },
  ],
  objectives: [
    { id: 'objective-buy', clientCaseId: 'case-a', objectiveType: 'BUY_PRIMARY_HOME', status: 'ACTIVE', title: 'Buy', createdAt: date, completedAt: null, archivedAt: null },
    { id: 'objective-sell', clientCaseId: 'case-a', objectiveType: 'SELL_CURRENT_HOME', status: 'ACTIVE', title: 'Sell', createdAt: new Date('2026-09-14T00:01:00.000Z'), completedAt: null, archivedAt: null },
    { id: 'objective-b', clientCaseId: 'case-b', objectiveType: 'BUY_PRIMARY_HOME', status: 'ACTIVE', title: 'Other', createdAt: date, completedAt: null, archivedAt: null },
  ],
  facts: [
    { id: 'fact-current', clientCaseId: 'case-a', semanticKey: 'PROPERTY_OCCUPANCY_STATUS', scope: 'PROPERTY', scopeReference: 'PROPERTY:case-property-a', objectiveId: null, clientCasePropertyId: 'case-property-a', value: 'OWNER_OCCUPIED', sourcePosture: 'AGENT_ENTERED', evidenceAdmissionId: null, professionalInputId: null, observedAt: null, effectiveAt: null, reviewAfter: null, limitation: null, supersededAt: null },
    { id: 'fact-superseded', clientCaseId: 'case-a', semanticKey: 'PROPERTY_OCCUPANCY_STATUS', scope: 'PROPERTY', scopeReference: 'PROPERTY:case-property-a', objectiveId: null, clientCasePropertyId: 'case-property-a', value: 'VACANT', sourcePosture: 'AGENT_ENTERED', evidenceAdmissionId: null, professionalInputId: null, observedAt: null, effectiveAt: null, reviewAfter: null, limitation: null, supersededAt: date },
  ],
  criteria: [
    { id: 'criterion-cities', clientCaseId: 'case-a', semanticKey: 'TARGET_CITIES', scope: 'CASE', scopeReference: 'CASE', objectiveId: null, clientCasePropertyId: null, value: ['Boulder'], sourcePosture: 'CLIENT_STATED', evidenceAdmissionId: null, professionalInputId: null, observedAt: null, effectiveAt: null, reviewAfter: null, limitation: null, supersededAt: null },
    { id: 'criterion-bedrooms', clientCaseId: 'case-a', semanticKey: 'MIN_BEDROOMS', scope: 'OBJECTIVE', scopeReference: 'OBJECTIVE:objective-buy', objectiveId: 'objective-buy', clientCasePropertyId: null, value: 3, sourcePosture: 'CLIENT_STATED', evidenceAdmissionId: null, professionalInputId: null, observedAt: null, effectiveAt: null, reviewAfter: null, limitation: null, supersededAt: null },
  ],
  properties: [
    { id: 'case-property-a', clientCaseId: 'case-a', canonicalPropertyId: 'physical-a', role: 'CURRENT_PRIMARY', createdAt: date },
    { id: 'case-property-b', clientCaseId: 'case-a', canonicalPropertyId: 'physical-b', role: 'EXISTING_INVESTMENT', createdAt: new Date('2026-09-14T00:01:00.000Z') },
  ],
  scenarios: [
    { id: 'scenario-a', clientCaseId: 'case-a', name: 'Synthetic A', status: 'ACTIVE', currentVersionId: 'version-a2' },
    { id: 'scenario-b', clientCaseId: 'case-b', name: 'Synthetic B', status: 'ACTIVE', currentVersionId: 'version-b1' },
  ],
  versions: [
    { id: 'version-a1', scenarioId: 'scenario-a', versionNumber: 1 },
    { id: 'version-a2', scenarioId: 'scenario-a', versionNumber: 2 },
    { id: 'version-b1', scenarioId: 'scenario-b', versionNumber: 1 },
  ],
  assumptions: [
    { id: 'assumption-a1', scenarioVersionId: 'version-a1', semanticKey: 'DOWN_PAYMENT_BPS', valueType: 'PERCENT_BPS', value: 0 },
    { id: 'assumption-unsupported-a1', scenarioVersionId: 'version-a1', semanticKey: 'FUTURE_ASSUMPTION', valueType: 'INTEGER', value: 1 },
    { id: 'assumption-a2', scenarioVersionId: 'version-a2', semanticKey: 'DOWN_PAYMENT_BPS', valueType: 'PERCENT_BPS', value: 2_000 },
  ],
  scenarioCriteria: [
    { id: 'scenario-criterion-cities-a1', scenarioVersionId: 'version-a1', semanticKey: 'TARGET_CITIES', valueType: 'STRING_SET', value: ['Louisville'] },
    { id: 'scenario-criterion-bedrooms-a1', scenarioVersionId: 'version-a1', semanticKey: 'MIN_BEDROOMS', valueType: 'INTEGER', value: 4 },
    { id: 'scenario-criterion-max-a1', scenarioVersionId: 'version-a1', semanticKey: 'MAX_PURCHASE_PRICE_CENTS', valueType: 'MONEY_CENTS', value: 70000000 },
    { id: 'scenario-criterion-unsupported-a1', scenarioVersionId: 'version-a1', semanticKey: 'FUTURE_CRITERION', valueType: 'INTEGER', value: 1 },
    { id: 'scenario-criterion-bedrooms-a2', scenarioVersionId: 'version-a2', semanticKey: 'MIN_BEDROOMS', valueType: 'INTEGER', value: 5 },
  ],
  dispositions: [
    { id: 'disposition-a1', scenarioVersionId: 'version-a1', clientCasePropertyId: 'case-property-a', disposition: 'SELL' },
    { id: 'disposition-a2', scenarioVersionId: 'version-a2', clientCasePropertyId: 'case-property-a', disposition: 'RETAIN_AS_RENTAL' },
  ],
  objectiveLinks: [
    { id: 'objective-link-a1', scenarioVersionId: 'version-a1', clientCaseObjectiveId: 'objective-buy' },
    { id: 'objective-link-a2', scenarioVersionId: 'version-a2', clientCaseObjectiveId: 'objective-sell' },
  ],
};

let reads = 0;
function caseView(entry: Row) {
  return {
    ...entry,
    objectives: state.objectives.filter((row) => row.clientCaseId === entry.id),
    facts: state.facts.filter((row) => row.clientCaseId === entry.id && row.supersededAt === null),
    criteria: state.criteria.filter((row) => row.clientCaseId === entry.id && row.supersededAt === null),
    properties: state.properties.filter((row) => row.clientCaseId === entry.id),
  };
}

const db: any = {
  clientCase: {
    findFirst: async ({ where }: Row) => {
      reads += 1;
      const entry = state.cases.find((row) => row.id === where.id && row.ownerAgentSubject === where.ownerAgentSubject);
      return entry ? caseView(entry) : null;
    },
  },
  clientCaseScenarioVersion: {
    findFirst: async ({ where }: Row) => {
      reads += 1;
      const version = state.versions.find((row) => row.id === where.id);
      if (!version) return null;
      const scenario = state.scenarios.find((row) => row.id === version.scenarioId)!;
      const expected = where.scenario;
      if (scenario.clientCaseId !== expected.clientCaseId || state.cases.find((row) => row.id === scenario.clientCaseId)?.ownerAgentSubject !== expected.clientCase.ownerAgentSubject) return null;
      return {
        ...version,
        scenario,
        assumptions: state.assumptions.filter((row) => row.scenarioVersionId === version.id),
        criteria: state.scenarioCriteria.filter((row) => row.scenarioVersionId === version.id),
        propertyDispositions: state.dispositions.filter((row) => row.scenarioVersionId === version.id),
        objectiveLinks: state.objectiveLinks.filter((row) => row.scenarioVersionId === version.id),
      };
    },
  },
};

const resolver = createClientCaseEffectiveContextResolver(db as never);

void (async () => {
  const baselineBefore = await resolver.resolve('agent-a', 'case-a', { mode: 'CANONICAL_BASELINE' });
  assert.equal(baselineBefore.mode, 'CANONICAL_BASELINE');
  assert.equal(baselineBefore.scenario, null);
  assert.equal(baselineBefore.facts.length, 1);
  assert.equal(baselineBefore.resolvedInputs.some((entry) => entry.sourceRecordId === 'fact-superseded'), false);

  const historical = await resolver.resolve('agent-a', 'case-a', { mode: 'SCENARIO_VERSION', scenarioVersionId: 'version-a1' });
  assert.equal(historical.scenario?.resolvedVersionId, 'version-a1');
  assert.equal(historical.scenario?.currentVersionId, 'version-a2');
  assert.equal(historical.scenario?.isHistorical, true);
  assert.equal(historical.assumptions[0].value, 0);
  assert.ok(historical.assumptions.some((entry) => entry.id === 'assumption-unsupported-a1'));
  assert.ok(historical.scenarioCriteria.some((entry) => entry.id === 'scenario-criterion-unsupported-a1'));
  assert.equal(historical.propertyDispositions[0].disposition, 'SELL');
  assert.equal(historical.properties.find((entry) => entry.id === 'case-property-a')?.role, 'CURRENT_PRIMARY');
  assert.equal(historical.objectives.length, 2);
  assert.equal(historical.scenarioObjectiveLinks.length, 1);
  const bedrooms = historical.resolvedInputs.find((entry) => entry.stableKey === 'SCENARIO_CRITERION:MIN_BEDROOMS');
  assert.equal(bedrooms?.value, 4);
  assert.deepEqual(bedrooms?.contributingSourceRecordIds, ['criterion-bedrooms', 'scenario-criterion-bedrooms-a1']);
  assert.ok(historical.criteria.some((entry) => entry.id === 'criterion-bedrooms'));
  assert.ok(historical.scenarioCriteria.some((entry) => entry.id === 'scenario-criterion-bedrooms-a1'));
  assert.equal(historical.limitations.some((entry) => entry.code === 'UNSUPPORTED_RESOLUTION_SEMANTIC' && entry.semanticKey === 'MAX_PURCHASE_PRICE_CENTS'), false);
  assert.ok(historical.limitations.some((entry) => entry.code === 'HISTORICAL_SCENARIO_WITH_CURRENT_CANONICAL_CONTEXT' && entry.sourceRecordId === 'version-a1'));
  assert.ok(historical.limitations.some((entry) => entry.code === 'UNSUPPORTED_RESOLUTION_SEMANTIC' && entry.sourceRecordId === 'assumption-unsupported-a1'));
  assert.ok(historical.limitations.some((entry) => entry.code === 'UNSUPPORTED_RESOLUTION_SEMANTIC' && entry.sourceRecordId === 'scenario-criterion-unsupported-a1'));
  assert.ok(historical.resolvedInputs.some((entry) => entry.stableKey === 'SCENARIO_CRITERION:MAX_PURCHASE_PRICE_CENTS'));
  assert.equal(historical.resolvedInputs.some((entry) => entry.semanticKey === 'FUTURE_ASSUMPTION' || entry.semanticKey === 'FUTURE_CRITERION'), false);

  const current = await resolver.resolve('agent-a', 'case-a', { mode: 'SCENARIO_VERSION', scenarioVersionId: 'version-a2' });
  assert.equal(current.scenario?.isHistorical, false);
  assert.equal(current.resolvedInputs.find((entry) => entry.stableKey === 'SCENARIO_CRITERION:MIN_BEDROOMS')?.value, 5);
  const baselineAfter = await resolver.resolve('agent-a', 'case-a', { mode: 'CANONICAL_BASELINE' });
  assert.deepEqual(baselineAfter, baselineBefore);
  assert.deepEqual(await resolver.resolve('agent-a', 'case-a', { mode: 'SCENARIO_VERSION', scenarioVersionId: 'version-a1' }), historical);

  await assert.rejects(
    () => resolver.resolve('agent-a', 'case-a', { mode: 'SCENARIO_VERSION', scenarioVersionId: 'version-b1' }),
    (error: unknown) => error instanceof ClientCaseEffectiveContextError && error.code === 'NOT_FOUND',
  );
  await assert.rejects(
    () => resolver.resolve('agent-b', 'case-a', { mode: 'CANONICAL_BASELINE' }),
    (error: unknown) => error instanceof ClientCaseEffectiveContextError && error.code === 'NOT_FOUND',
  );
  await assert.rejects(
    () => resolver.resolve('agent-a', 'unknown-case', { mode: 'CANONICAL_BASELINE' }),
    (error: unknown) => error instanceof ClientCaseEffectiveContextError && error.code === 'NOT_FOUND',
  );

  state.scenarioCriteria.push({ id: 'scenario-criterion-invalid', scenarioVersionId: 'version-a2', semanticKey: 'MIN_BEDROOMS', valueType: 'INTEGER', value: true } as any);
  await assert.rejects(
    () => resolver.resolve('agent-a', 'case-a', { mode: 'SCENARIO_VERSION', scenarioVersionId: 'version-a2' }),
    (error: unknown) => error instanceof ClientCaseEffectiveContextError && error.code === 'INVALID_PERSISTED_STATE',
  );
  state.scenarioCriteria.pop();

  const readsAfterChecks = reads;
  assert.ok(readsAfterChecks >= 7);
  assert.equal(state.facts[0].value, 'OWNER_OCCUPIED');
  assert.equal(state.criteria[1].value, 3);
  assert.equal(state.scenarios[0].currentVersionId, 'version-a2');
  assert.equal(state.versions.length, 3);
  console.log('CLIENT_CASE_EFFECTIVE_CONTEXT_RESOLVER_CHECK: PASS');
})().catch((error) => { console.error(error); process.exitCode = 1; });
