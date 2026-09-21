import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_POST_FREEZE_LIFECYCLE,
  CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_TRANSPORT_VERSION,
  createClientCaseScenarioFinancialContextTransportService,
} from '../lib/clientCaseScenarioFinancialContextTransport';

const service = readFileSync('lib/clientCaseScenarioFinancialContextTransport.ts', 'utf8');
const manifest = readFileSync('lib/clientCaseScenarioFinancialContextManifestFoundation.ts', 'utf8');
const schema = readFileSync('prisma/schema.prisma', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_TRANSPORT_VERSION, 'CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_TRANSPORT_V1');
assert.equal(CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_POST_FREEZE_LIFECYCLE, 'RETAIN_UNCHANGED_AS_CONTINUING_SCENARIO_LEVEL_WORKING_INTENT');
assert.equal(typeof createClientCaseScenarioFinancialContextTransportService, 'function');

for (const token of [
  'readWorkingContext',
  'mutateDraft',
  'reviewCreateAnalysisVersion',
  'createAnalysisVersion',
  'readFixedContext',
  'compareToCurrent',
  'createClientCaseScenarioFinancialContextDraftService',
  'freezeScenarioForAnalysisWithFinancialContextInTransaction',
  'Prisma.TransactionIsolationLevel.Serializable',
  'FOR UPDATE',
  'draftRetention',
  'unchanged: true',
]) assert.ok(service.includes(token), `missing C2B transport contract: ${token}`);

for (const token of [
  'export async function freezeScenarioForAnalysisWithFinancialContextInTransaction',
  'createClientCaseScenarioVersion',
  'definitionFromClientCaseScenarioVersion',
  'clientCaseScenarioFinancialContextManifest.create',
]) assert.ok(manifest.includes(token), `missing C1 delegation contract: ${token}`);

for (const forbidden of [
  'consumedAt',
  'draftGeneration',
  'successorDraft',
  'outputVersion',
  'clientFinancialAsset.update(',
  'clientFinancialLiability.update(',
  'clientFinancialIncomeSource.update(',
]) assert.equal(service.includes(forbidden), false, `C2B transport must not include ${forbidden}`);

assert.equal((schema.match(/model ClientCaseScenarioFinancialContextDraft \{/g) ?? []).length, 1);
assert.equal((schema.match(/model ClientCaseScenarioFinancialContextManifest \{/g) ?? []).length, 1);
assert.equal(packageJson.scripts?.['check:client-case-scenario-financial-context-transport-foundation'], 'jiti scripts/checkClientCaseScenarioFinancialContextTransportFoundation.ts');

console.log('[client-case-scenario-financial-context-transport-foundation] ok: protected C2B transport delegates to C2A/C1, adds no schema, and retains Scenario-level working intent unchanged through Freeze.');
