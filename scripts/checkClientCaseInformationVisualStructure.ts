import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const layout = readFileSync('app/agent/layout.tsx', 'utf8');
const page = readFileSync('app/agent/clients/[clientCaseId]/information/page.tsx', 'utf8');
const workspace = readFileSync('components/agent/ClientCaseInformationWorkspace.tsx', 'utf8');
const styles = readFileSync('components/agent/ClientCaseInformationWorkspace.module.css', 'utf8');
const clientCaseWorkspace = readFileSync('components/agent/ClientCasesWorkspace.tsx', 'utf8');

assert.match(layout, /AgentWorkspaceShell/);
assert.match(page, /index: false/);
assert.match(page, /ClientCaseInformationWorkspace/);
assert.match(workspace, /AtlasSurface/);
assert.match(workspace, /AtlasField/);
assert.match(workspace, /AtlasNotice/);
assert.match(workspace, /AtlasButton/);
assert.match(workspace, /client-case-information-objectives/);
assert.match(workspace, /client-case-information-buyer-criteria/);
assert.match(workspace, /client-case-information-property-occupancy/);
assert.match(workspace, /client-case-information-provenance-timing/);
assert.match(workspace, /client-case-information-summary/);
assert.match(workspace, /client-case-information-readiness-preview/);
assert.match(workspace, /Scenario Version inputs/);
assert.doesNotMatch(workspace, /min-h-screen|bg-gradient|fixed inset|absolute inset/);
assert.match(styles, /\.sectionGrid/);
assert.match(styles, /@media \(min-width: 58rem\)/);
assert.match(styles, /@media \(max-width: 40rem\)/);
assert.match(styles, /\.rangeGrid/);
assert.match(styles, /overflow-wrap: anywhere/);
assert.match(clientCaseWorkspace, /client-case-information-summary-card/);

console.log('client-case-information-visual-structure: PASS');
