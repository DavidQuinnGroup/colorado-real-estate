import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { ClientCaseScenarioError, createClientCaseScenarioService } from '../lib/clientCaseScenarioFoundation';
import { SCENARIO_ASSUMPTION_SEMANTICS, SCENARIO_CRITERION_SEMANTICS, assertScenarioRegistryIntegrity } from '../lib/clientCaseScenarioSemanticRegistry';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260914010000_add_client_case_scenario_foundation/migration.sql', 'utf8');
const source = readFileSync('lib/clientCaseScenarioFoundation.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

for (const model of ['ClientCaseScenario', 'ClientCaseScenarioVersion', 'ClientCaseScenarioAssumption', 'ClientCaseScenarioCriterion', 'ClientCaseScenarioPropertyDisposition', 'ClientCaseScenarioObjective']) {
  assert.match(schema, new RegExp(`model ${model} \\{`));
  assert.match(migration, new RegExp(`CREATE TABLE "${model}"`));
}
for (const token of ['ClientCaseScenarioStatus', 'currentVersionId', 'duplicatedFromScenarioId', '@@unique([scenarioId, versionNumber])']) assert.match(schema, new RegExp(token.replace(/[()[\]@]/g, '\\$&')));
assert.match(migration, /ClientCaseScenarioVersion_scenarioId_versionNumber_key/);
assert.match(migration, /ClientCaseScenario_currentVersionId_fkey/);
assert.doesNotMatch(migration, /\b(DROP|TRUNCATE|DELETE\s+FROM|INSERT\s+INTO|UPDATE\s+"ClientCase")\b/i);
assert.match(source, /prisma\.\$transaction/);
assert.match(source, /expectedCurrentVersionId/);
assert.match(source, /currentVersionId: expectedCurrentVersionId/);
assert.doesNotMatch(source, /updateScenarioVersion/);
assert.equal(packageJson.scripts?.['check:client-case-scenario-foundation'], 'jiti scripts/checkClientCaseScenarioFoundation.ts');
assertScenarioRegistryIntegrity(SCENARIO_ASSUMPTION_SEMANTICS);
assertScenarioRegistryIntegrity(SCENARIO_CRITERION_SEMANTICS);

type Row = Record<string, any>;
let serial = 0;
let state = {
  scenarios: [] as Row[],
  versions: [] as Row[],
  assumptions: [] as Row[],
  criteria: [] as Row[],
  dispositions: [] as Row[],
  objectiveLinks: [] as Row[],
};

const cases = [
  { id: 'case-a', ownerAgentSubject: 'agent-a' },
  { id: 'case-b', ownerAgentSubject: 'agent-b' },
];
const objectives = [
  { id: 'objective-a', clientCaseId: 'case-a', objectiveType: 'BUY_PRIMARY_HOME', status: 'ACTIVE' },
  { id: 'objective-b', clientCaseId: 'case-b', objectiveType: 'SELL_CURRENT_HOME', status: 'ACTIVE' },
];
const properties = [
  { id: 'property-a', clientCaseId: 'case-a', role: 'CURRENT_HOME' },
  { id: 'property-b', clientCaseId: 'case-b', role: 'CURRENT_HOME' },
];
const canonicalFact = { id: 'fact-a', value: 'canonical value', supersededAt: null };
const canonicalCriterion = { id: 'criterion-a', value: 3, supersededAt: null };

function next(prefix: string) {
  serial += 1;
  return `${prefix}-${serial}`;
}

function matches(row: Row, where: Row) {
  return Object.entries(where).every(([key, value]) => {
    if (key === 'clientCase') return value.ownerAgentSubject === cases.find((entry) => entry.id === row.clientCaseId)?.ownerAgentSubject;
    return row[key] === value;
  });
}

function versionView(version: Row) {
  return {
    ...version,
    assumptions: state.assumptions.filter((entry) => entry.scenarioVersionId === version.id),
    criteria: state.criteria.filter((entry) => entry.scenarioVersionId === version.id),
    propertyDispositions: state.dispositions.filter((entry) => entry.scenarioVersionId === version.id),
    objectiveLinks: state.objectiveLinks.filter((entry) => entry.scenarioVersionId === version.id),
  };
}

function scenarioView(scenario: Row) {
  return { ...scenario, currentVersion: scenario.currentVersionId ? versionView(state.versions.find((entry) => entry.id === scenario.currentVersionId)!) : null };
}

const db: any = {
  clientCase: {
    findFirst: async ({ where }: Row) => cases.find((entry) => matches(entry, where)) ?? null,
  },
  clientCaseObjective: {
    findFirst: async ({ where }: Row) => objectives.find((entry) => matches(entry, where)) ?? null,
  },
  clientCaseProperty: {
    findFirst: async ({ where }: Row) => properties.find((entry) => matches(entry, where)) ?? null,
  },
  clientCaseScenario: {
    findFirst: async ({ where, include }: Row) => {
      const scenario = state.scenarios.find((entry) => matches(entry, where));
      if (!scenario) return null;
      return include ? scenarioView(scenario) : { ...scenario };
    },
    findMany: async ({ where }: Row) => state.scenarios.filter((entry) => matches(entry, where)).map((entry) => ({ ...entry })),
    create: async ({ data }: Row) => {
      const scenario = { id: next('scenario'), status: 'ACTIVE', archivedAt: null, currentVersionId: null, duplicatedFromScenarioId: null, duplicatedFromScenarioVersionId: null, createdAt: new Date(), updatedAt: new Date(), ...data };
      state.scenarios.push(scenario);
      return { ...scenario };
    },
    update: async ({ where, data }: Row) => {
      const scenario = state.scenarios.find((entry) => matches(entry, where));
      if (!scenario) throw new Error('missing scenario');
      Object.assign(scenario, data, { updatedAt: new Date() });
      return { ...scenario };
    },
    updateMany: async ({ where, data }: Row) => {
      const scenarios = state.scenarios.filter((entry) => matches(entry, where));
      scenarios.forEach((entry) => Object.assign(entry, data, { updatedAt: new Date() }));
      return { count: scenarios.length };
    },
  },
  clientCaseScenarioVersion: {
    findFirst: async ({ where, include }: Row) => {
      const version = state.versions.find((entry) => matches(entry, where));
      if (!version) return null;
      return include ? versionView(version) : { ...version };
    },
    findMany: async ({ where }: Row) => state.versions.filter((entry) => matches(entry, where)).sort((a, b) => a.versionNumber - b.versionNumber).map(versionView),
    create: async ({ data }: Row) => {
      const version = { id: next('version'), scenarioId: data.scenarioId, versionNumber: data.versionNumber, createdBySubject: data.createdBySubject, createdAt: new Date() };
      if (state.versions.some((entry) => entry.scenarioId === version.scenarioId && entry.versionNumber === version.versionNumber)) {
        const error = new Error('duplicate version') as Error & { code: string };
        error.code = 'P2002';
        throw error;
      }
      state.versions.push(version);
      for (const entry of data.assumptions?.create ?? []) state.assumptions.push({ id: next('assumption'), scenarioVersionId: version.id, ...entry });
      for (const entry of data.criteria?.create ?? []) state.criteria.push({ id: next('criterion'), scenarioVersionId: version.id, ...entry });
      for (const entry of data.propertyDispositions?.create ?? []) state.dispositions.push({ id: next('disposition'), scenarioVersionId: version.id, clientCasePropertyId: entry.clientCaseProperty.connect.id, disposition: entry.disposition });
      for (const entry of data.objectiveLinks?.create ?? []) state.objectiveLinks.push({ id: next('objective-link'), scenarioVersionId: version.id, clientCaseObjectiveId: entry.clientCaseObjective.connect.id });
      return { ...version };
    },
  },
  $transaction: async <T>(callback: (transaction: any) => Promise<T>) => {
    const snapshot = structuredClone(state);
    try {
      return await callback(db);
    } catch (error) {
      state = snapshot;
      throw error;
    }
  },
};

const service = createClientCaseScenarioService(db as never);
const definition = {
  assumptions: [{ semanticKey: 'DOWN_PAYMENT_BPS', value: 2_000 }],
  criteria: [{ semanticKey: 'MIN_BEDROOMS', value: 4 }],
  propertyDispositions: [{ clientCasePropertyId: 'property-a', disposition: 'SELL' }],
  objectiveIds: ['objective-a'],
};

void (async () => {
  const scenarioA = await service.create('agent-a', 'case-a', { name: 'Synthetic Scenario A', initialDefinition: definition });
  assert.ok(scenarioA.currentVersion);
  assert.equal(scenarioA.currentVersion.versionNumber, 1);
  assert.equal(state.scenarios.length, 1);
  assert.equal(state.versions.length, 1);
  assert.equal(scenarioA.currentVersion.assumptions[0].value, 2_000);

  const scenarioB = await service.create('agent-a', 'case-a', { name: 'Synthetic Scenario B', initialDefinition: { assumptions: [], criteria: [], propertyDispositions: [], objectiveIds: [] } });
  assert.equal((await service.list('agent-a', 'case-a')).length, 2);

  const scenarioA2 = await service.updateDefinition('agent-a', 'case-a', scenarioA.id, {
    expectedCurrentVersionId: scenarioA.currentVersionId,
    definition: { ...definition, assumptions: [{ semanticKey: 'DOWN_PAYMENT_BPS', value: 2_500 }] },
  });
  assert.ok(scenarioA2.currentVersion);
  assert.equal(scenarioA2.currentVersion.versionNumber, 2);
  assert.equal((await service.history('agent-a', 'case-a', scenarioA.id)).length, 2);
  await assert.rejects(
    () => service.updateDefinition('agent-a', 'case-a', scenarioA.id, { expectedCurrentVersionId: scenarioA.currentVersionId, definition }),
    (error: unknown) => error instanceof ClientCaseScenarioError && error.code === 'CONFLICT',
  );

  const duplicate = await service.duplicate('agent-a', 'case-a', scenarioA.id, { name: 'Synthetic Scenario Copy' });
  assert.ok(duplicate.currentVersion);
  assert.equal(duplicate.currentVersion.versionNumber, 1);
  assert.equal(duplicate.duplicatedFromScenarioId, scenarioA.id);
  assert.equal(duplicate.currentVersion.assumptions[0].value, 2_500);
  await service.updateDefinition('agent-a', 'case-a', duplicate.id, {
    expectedCurrentVersionId: duplicate.currentVersionId,
    definition: { ...definition, assumptions: [{ semanticKey: 'DOWN_PAYMENT_BPS', value: 3_000 }] },
  });
  const sourceAfterDuplicateUpdate = await service.get('agent-a', 'case-a', scenarioA.id);
  assert.ok(sourceAfterDuplicateUpdate.currentVersion);
  assert.equal(sourceAfterDuplicateUpdate.currentVersion.assumptions[0].value, 2_500);

  const renamed = await service.rename('agent-a', 'case-a', scenarioB.id, { name: 'Synthetic Scenario B Renamed' });
  assert.equal(renamed.currentVersionId, scenarioB.currentVersionId);
  await service.archive('agent-a', 'case-a', scenarioB.id);
  assert.equal((await service.list('agent-a', 'case-a')).some((entry) => entry.id === scenarioB.id), false);
  assert.equal((await service.history('agent-a', 'case-a', scenarioB.id)).length, 1);

  const beforeInvalid = state.scenarios.length;
  await assert.rejects(
    () => service.create('agent-a', 'case-a', { name: 'Invalid Foreign Link', initialDefinition: { ...definition, objectiveIds: ['objective-b'] } }),
    (error: unknown) => error instanceof ClientCaseScenarioError && error.code === 'NOT_FOUND',
  );
  await assert.rejects(
    () => service.create('agent-a', 'case-a', { name: 'Invalid Foreign Property', initialDefinition: { ...definition, propertyDispositions: [{ clientCasePropertyId: 'property-b', disposition: 'SELL' }] } }),
    (error: unknown) => error instanceof ClientCaseScenarioError && error.code === 'NOT_FOUND',
  );
  assert.equal(state.scenarios.length, beforeInvalid);
  await assert.rejects(
    () => service.get('agent-b', 'case-a', scenarioA.id),
    (error: unknown) => error instanceof ClientCaseScenarioError && error.code === 'NOT_FOUND',
  );

  assert.deepEqual(canonicalFact, { id: 'fact-a', value: 'canonical value', supersededAt: null });
  assert.deepEqual(canonicalCriterion, { id: 'criterion-a', value: 3, supersededAt: null });
  assert.equal(properties[0].role, 'CURRENT_HOME');
  assert.equal(state.scenarios.find((entry) => entry.id === scenarioA.id)?.id, scenarioA.id);
  console.log('CLIENT_CASE_SCENARIO_FOUNDATION_CHECK: PASS');
})().catch((error) => { console.error(error); process.exitCode = 1; });
