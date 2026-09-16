import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workspace = readFileSync('components/agent/ClientCaseInformationWorkspace.tsx', 'utf8');
const styles = readFileSync('components/agent/ClientCaseInformationWorkspace.module.css', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(packageJson.scripts?.['check:agent-property-discovery-visual-structure'], 'jiti scripts/checkAgentPropertyDiscoveryVisualStructure.ts');
assert.match(workspace, /Search property/);
assert.match(workspace, /Start typing an address/);
assert.match(workspace, /No matching property found in the currently available property data/);
assert.match(workspace, /Property found, not yet available to add to a Client Case|result\.context/);
assert.match(workspace, /Already linked/);
assert.match(workspace, /Clear selection/);
assert.match(workspace, /aria-autocomplete="list"/);
assert.match(workspace, /aria-activedescendant/);
assert.match(workspace, /aria-controls="property-results"/);
assert.match(workspace, /role="combobox"/);
assert.match(workspace, /role="listbox"/);
assert.match(workspace, /role="option"/);
assert.match(workspace, /disabled=\{!result\.attachable\}/);
assert.match(styles, /\.suggestionPanel/);
assert.match(styles, /backdrop-filter: blur/);
assert.match(styles, /\.selectedPropertySummary/);
assert.match(styles, /@media \(min-width: 52rem\)/);
assert.doesNotMatch(workspace, /Canonical physical Property ID|CanonicalPhysicalProperty ID/);
assert.doesNotMatch(styles, /overflow-x:\s*scroll|overflow-x:\s*auto/);

console.log('agent-property-discovery-visual-structure: PASS');
