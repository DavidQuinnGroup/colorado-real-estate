import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = (path: string) => readFileSync(path, 'utf8');
const commandCenter = source('components/agent/ClientCommandCenter.tsx');
const section = source('components/agent/ClientCommandCenterSection.tsx');
const tracker = source('components/agent/ClientTrackerWorkspace.tsx');
const registry = source('components/agent/clientCommandCenterTypes.ts');
const page = source('app/agent/clients/[clientCaseId]/page.tsx');
const trackerPage = source('app/agent/clients/page.tsx');
const navigation = source('lib/agentWorkspaceNavigation.ts');
const fixture = source('components/agent/ClientCommandCenterVisualFixture.tsx');
const auth = source('lib/admin/adminAuth.ts');

assert.match(page, /ClientCommandCenter/);
assert.match(trackerPage, /ClientTrackerWorkspace/);
assert.match(tracker, /\/api\/agent\/client-cases/);
assert.match(tracker, /Search Clients/);
assert.match(commandCenter, /\/api\/agent\/client-cases\?id=/);
assert.match(commandCenter, /\/api\/agent\/client-case-information\?clientCaseId=/);
assert.match(commandCenter, /\/api\/agent\/outputs\?clientCaseId=/);
assert.match(commandCenter, /useSearchParams\(\)/);
assert.match(commandCenter, /router\.push/);
assert.match(commandCenter, /clientCaseId=/);
assert.doesNotMatch(commandCenter, /method:\s*'POST'|createClientCase|Save Client|localStorage|sessionStorage/);
assert.match(section, /<button/);
assert.match(section, /<h2/);
assert.match(section, /aria-expanded/);
assert.match(section, /aria-controls/);
assert.match(section, /data-client-command-center-section/);
for (const sectionName of ['overview', 'people', 'goals', 'properties', 'information', 'readiness', 'buyer', 'seller', 'financial', 'intelligence', 'transactions', 'outputs', 'authorizations']) assert.match(registry, new RegExp(`'${sectionName}'`));
assert.match(navigation, /'authorizations'/);
assert.match(fixture, /Static synthetic interface only/);
assert.doesNotMatch(fixture, /fetch\(|prisma|\/api\//i);
assert.match(auth, /\/agent\/design-system\/visual-certification\/client-command-center/);

console.log('unified-agent-workspace-client-command-center-wave-1: PASS');
