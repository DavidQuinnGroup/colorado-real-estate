import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { sanitizeAgentReturnPath } from '../lib/admin/adminAuth';

const route = readFileSync('app/api/agent/client-case-readiness/route.ts', 'utf8');
const workspace = readFileSync('components/agent/ClientCaseReadinessWorkspace.tsx', 'utf8');
const presentation = readFileSync('lib/clientCaseAgentReadinessPresentation.ts', 'utf8');
const clientCaseWorkspace = readFileSync('components/agent/ClientCasesWorkspace.tsx', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const schema = readFileSync('prisma/schema.prisma', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(packageJson.scripts?.['check:client-case-agent-readiness-workflow'], 'jiti scripts/checkClientCaseAgentReadinessWorkflow.ts');
assert.match(route, /createClientCaseCapabilityReadinessService\(prisma\)\.evaluate/);
assert.match(route, /createClientCaseScenarioService\(prisma\)\.list/);
assert.match(route, /clientCaseService\.listOwned/);
assert.match(route, /Cache-Control': 'private, no-store/);
assert.doesNotMatch(route, /\.create\(|\.update\(|\.delete\(|\.upsert\(|\$transaction|isSameOriginAdminRequest/);
assert.match(presentation, /CAPABILITY_ADMISSION_REGISTRY/);
assert.match(presentation, /entry\.admission === 'ADMITTED_V1'/);
assert.match(presentation, /getCapabilityInputContract/);
assert.match(workspace, /Canonical baseline/);
assert.match(workspace, /current version/);
assert.match(workspace, /annualInterestRateBasisPoints/);
assert.match(workspace, /marketScope/);
assert.match(workspace, /Check readiness/);
assert.doesNotMatch(workspace, /Run Analysis|Create scenario|Save readiness|Record readiness/);
assert.match(workspace, /requestSequence/);
assert.match(workspace, /resultSelectionKey/);
assert.match(workspace, /clearResult\(\)/);
assert.match(workspace, /does not create, edit, or duplicate client information/);
assert.match(clientCaseWorkspace, /\/readiness/);
assert.match(auth, /\/api\/agent\/client-case-readiness/);
assert.match(auth, /surface\('\/api\/agent\/client-case-readiness', 'READ_ONLY_ADMIN_API'/);
assert.match(auth, /\^\\\/agent\\\/clients\\\/\[\^\/\]\+\\\/readiness\$/);
assert.equal(sanitizeAgentReturnPath('/agent/clients/case-a/readiness'), '/agent/clients/case-a/readiness');
assert.equal(sanitizeAgentReturnPath('/agent/clients/case-a/readiness/other'), '/agent');
assert.doesNotMatch(schema, /AgentReadinessWorkflow|ReadinessWorkflowRecord|ReadinessCheck/);

console.log('client-case-agent-readiness-workflow: PASS');
