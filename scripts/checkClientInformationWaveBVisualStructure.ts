import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workspace = readFileSync('components/agent/ClientCaseInformationWorkspace.tsx', 'utf8');
const styles = readFileSync('components/agent/ClientCaseInformationWorkspace.module.css', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(packageJson.scripts?.['check:client-information-wave-b-visual-structure'], 'jiti scripts/checkClientInformationWaveBVisualStructure.ts');
assert.match(workspace, /client-case-information-properties/);
assert.match(workspace, /Add \/ Link Property/);
assert.match(workspace, /Current linking mechanism: explicit canonical Property ID/);
assert.match(workspace, /Address autocomplete, off-market discovery, provider lookup, and provisional Property creation are deferred/);
assert.match(workspace, /data-client-case-property-card="true"/);
assert.match(workspace, /Scenario:/);
assert.match(workspace, /Operational state remains in Transactions/);
assert.match(workspace, /Relationship history/);
assert.match(workspace, /View Readiness/);
assert.match(workspace, /roleLabel/);
assert.doesNotMatch(workspace.match(/const relationshipRoleOptions[\s\S]*?\];/)?.[0] ?? '', /OWNER|CO_OWNER|OCCUPANT|UNDER_CONTRACT|COMING_SOON|OFF_MARKET_PROVIDER_LOOKUP/);

assert.match(styles, /\.propertyCardGrid/);
assert.match(styles, /\.propertyCard/);
assert.match(styles, /backdrop-filter: blur\(var\(--atlas-profile-glass-blur\)\)/);
assert.match(styles, /\.roleChipRow/);
assert.match(styles, /\.roleChip/);
assert.match(styles, /\.propertyMetaGrid/);
assert.match(styles, /\.relationshipActions/);
assert.match(styles, /@media \(min-width: 48rem\)/);
assert.match(styles, /@media \(max-width: 40rem\)/);
assert.match(styles, /overflow-wrap: anywhere/);
assert.doesNotMatch(styles, /border:\s*1px solid(?! color-mix\(in srgb, var\(--atlas-profile-border-strong\))/);

console.log('client-information-wave-b-visual-structure: PASS');
