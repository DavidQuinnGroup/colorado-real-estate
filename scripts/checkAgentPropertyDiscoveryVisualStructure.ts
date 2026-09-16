import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workspace = readFileSync('components/agent/ClientCaseInformationWorkspace.tsx', 'utf8');
const discoverySelect = readFileSync('components/agent/AgentPropertyDiscoverySelect.tsx', 'utf8');
const styles = readFileSync('components/agent/ClientCaseInformationWorkspace.module.css', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(packageJson.scripts?.['check:agent-property-discovery-visual-structure'], 'jiti scripts/checkAgentPropertyDiscoveryVisualStructure.ts');
assert.match(workspace, /AgentPropertyDiscoverySelect/);
assert.match(discoverySelect, /Search property/);
assert.match(discoverySelect, /Start typing an address/);
assert.match(discoverySelect, /No matching property found in the currently available property data/);
assert.match(discoverySelect, /Property found, not yet available to add to a Client Case|result\.context/);
assert.match(discoverySelect, /Already linked/);
assert.match(discoverySelect, /Clear selection/);
assert.match(discoverySelect, /aria-autocomplete="list"/);
assert.match(discoverySelect, /aria-activedescendant/);
assert.match(discoverySelect, /aria-controls="property-results"/);
assert.match(discoverySelect, /role="combobox"/);
assert.match(discoverySelect, /role="listbox"/);
assert.match(discoverySelect, /role="option"/);
assert.match(discoverySelect, /disabled=\{!result\.attachable\}/);
assert.match(styles, /\.suggestionPanel/);
assert.match(styles, /backdrop-filter: blur/);
assert.match(styles, /\.selectedPropertySummary/);
assert.match(styles, /\.propertyLinkLayout/);
assert.match(styles, /container-type:\s*inline-size/);
assert.match(styles, /@container \(min-width: 52rem\)/);
assert.match(styles, /grid-template-columns:\s*minmax\(18rem, 1\.3fr\) minmax\(16rem, 1fr\) max-content/);
assert.match(styles, /white-space:\s*nowrap/);
assert.match(styles, /@container \(max-width: 31rem\)/);
assert.doesNotMatch(styles, /@media \(min-width: 52rem\) \{ \.propertyLinkForm/);
assert.doesNotMatch(discoverySelect, /Canonical physical Property ID|CanonicalPhysicalProperty ID/);
assert.doesNotMatch(styles, /overflow-x:\s*scroll|overflow-x:\s*auto/);

console.log('agent-property-discovery-visual-structure: PASS');
