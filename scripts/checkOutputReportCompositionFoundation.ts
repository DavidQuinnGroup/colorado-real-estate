import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildSyntheticOutputReportComposition,
  OUTPUT_REPORT_COMPOSITION_SCHEMA_VERSION,
  parseOutputReportComposition,
} from '../lib/outputReportCompositionFoundation';

const composition = buildSyntheticOutputReportComposition();
assert.equal(composition.schemaVersion, OUTPUT_REPORT_COMPOSITION_SCHEMA_VERSION);
assert.ok(composition.sections.length > 0, 'Synthetic composition must contain semantic sections.');

assert.throws(() => parseOutputReportComposition({ schemaVersion: OUTPUT_REPORT_COMPOSITION_SCHEMA_VERSION, title: 'x', summary: 'x', sections: [] }), /At least one composition section/);
assert.throws(() => parseOutputReportComposition({ schemaVersion: 'UNKNOWN', title: 'x', summary: 'x', sections: [{ id: 'x', title: 'x', blocks: [{ id: 'x', kind: 'TEXT', value: 'x' }] }] }), /schema is unsupported/);
assert.throws(() => parseOutputReportComposition({ schemaVersion: OUTPUT_REPORT_COMPOSITION_SCHEMA_VERSION, title: 'x', summary: 'x', sections: [{ id: 'x', title: 'x', blocks: [{ id: 'x', kind: 'UNSUPPORTED', value: 'x' }] }] }), /unsupported/);
assert.throws(() => parseOutputReportComposition('{bad json'), /composition must be an object/);

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const service = readFileSync('lib/outputPersistenceFoundation.ts', 'utf8');
const route = readFileSync('app/api/agent/outputs/route.ts', 'utf8');
const workspace = readFileSync('components/agent/AgentOutputsWorkspace.tsx', 'utf8');
const navigation = readFileSync('lib/agentWorkspaceNavigation.ts', 'utf8');
const middleware = readFileSync('middleware.ts', 'utf8');

for (const token of ['clientCaseId', 'transactionId', 'outputProducts OutputProduct[]']) assert.ok(schema.includes(token), `Expected OutputProduct context seam: ${token}`);
for (const token of ['createSyntheticOutputDraft', 'reviewOutputVersion', 'loadOwnedOutputProduct', 'listOwnedOutputProducts', 'ownerAgentSubject']) assert.ok(service.includes(token), `Expected owner-scoped composition service: ${token}`);
for (const token of ['CREATE_SYNTHETIC_DRAFT', 'REVIEW_OUTPUT_VERSION', 'clientCaseId', 'productId']) assert.ok(route.includes(token), `Expected bounded Output API action: ${token}`);
for (const token of ['Semantic preview', 'Review exact version', 'No durable artifact', 'CREATE_SYNTHETIC_DRAFT']) assert.ok(workspace.includes(token), `Expected Output workspace surface: ${token}`);
assert.ok(navigation.includes("key: 'outputs'"), 'Outputs must remain a global Agent Workspace destination.');
assert.ok(middleware.includes('"/api/agent/outputs"'), 'The Outputs API must remain middleware-protected.');
assert.ok(!workspace.includes('localStorage') && !workspace.includes('document.cookie'), 'Outputs must not establish hidden active context.');

console.log('OUTPUT_REPORT_COMPOSITION_FOUNDATION_V1: PASS');
