import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const detailWorkspace = readFileSync('components/agent/ClientCasesWorkspace.tsx', 'utf8');
const informationWorkspace = readFileSync('components/agent/ClientCaseInformationWorkspace.tsx', 'utf8');
const discoverySelect = readFileSync('components/agent/AgentPropertyDiscoverySelect.tsx', 'utf8');
const detailRoute = readFileSync('app/api/agent/client-cases/route.ts', 'utf8');
const informationRoute = readFileSync('app/api/agent/client-case-information/route.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(packageJson.scripts?.['check:agent-property-discovery-raw-id-agent-ux'], 'jiti scripts/checkAgentPropertyDiscoveryRawIdAgentUx.ts');
assert.match(detailWorkspace, /AgentPropertyDiscoverySelect/);
assert.match(informationWorkspace, /AgentPropertyDiscoverySelect/);
assert.match(discoverySelect, /\/api\/agent\/property-discovery/);
assert.match(discoverySelect, /role="combobox"/);
assert.match(discoverySelect, /role="listbox"/);
assert.match(discoverySelect, /data-selected-property-summary="true"/);
assert.match(detailRoute, /ATTACH_DISCOVERED_PROPERTY/);
assert.match(detailRoute, /canonicalPropertyIdForResultToken/);
assert.match(informationRoute, /ATTACH_DISCOVERED_PROPERTY/);
assert.match(informationRoute, /canonicalPropertyIdForResultToken/);
assert.doesNotMatch(detailWorkspace, /name="canonicalPropertyId"|placeholder="Canonical property ID"/);
assert.doesNotMatch(informationWorkspace, /name="canonicalPropertyId"|placeholder="Canonical property ID"/);
assert.doesNotMatch(detailRoute, /body\.action === 'ATTACH_PROPERTY'/);
assert.doesNotMatch(informationRoute, /body\.action === 'ATTACH_EXISTING_PROPERTY'/);

console.log('agent-property-discovery-raw-id-agent-ux: PASS');
