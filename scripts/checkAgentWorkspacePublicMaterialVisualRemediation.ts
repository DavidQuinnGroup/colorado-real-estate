import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };
const designSystem = readFileSync('app/atlas-design-system.css', 'utf8');
const shellStyles = readFileSync('components/agent/AgentWorkspaceShell.module.css', 'utf8');
const clientCases = readFileSync('components/agent/ClientCasesWorkspace.tsx', 'utf8');
const clientCaseStyles = readFileSync('components/agent/ClientCasesWorkspace.module.css', 'utf8');
const readinessStyles = readFileSync('components/agent/ClientCaseReadinessWorkspace.module.css', 'utf8');
const preparationStyles = readFileSync('components/agent/PreparationWorkspace.module.css', 'utf8');
const intelligenceStyles = readFileSync('components/agent/IntelligenceWorkspace.module.css', 'utf8');
const strategyPage = readFileSync('app/agent/strategy/page.tsx', 'utf8');

const agentProfileStart = designSystem.indexOf('.atlas-ds-shell-agent {');
assert.notEqual(agentProfileStart, -1, 'Agent profile block must exist.');
const agentProfileEnd = designSystem.indexOf('\n  }', agentProfileStart);
assert.notEqual(agentProfileEnd, -1, 'Agent profile block must close.');
const agentProfile = designSystem.slice(agentProfileStart, agentProfileEnd);

for (const alias of [
  '--atlas-profile-canvas: var(--atlas-canvas);',
  '--atlas-profile-canvas-atmosphere: var(--atlas-canvas-atmosphere);',
  '--atlas-profile-surface-primary: var(--atlas-surface-primary);',
  '--atlas-profile-surface-secondary: var(--atlas-surface-secondary);',
  '--atlas-profile-surface-data: var(--atlas-surface-data);',
  '--atlas-profile-field-background: var(--atlas-field-background);',
  '--atlas-profile-field-readonly: var(--atlas-field-readonly);',
]) {
  assert.ok(agentProfile.includes(alias), `Agent profile must reuse canonical Public material alias: ${alias}`);
}

for (const publicMaterialToken of [
  '--atlas-profile-glass-opacity: 0.66;',
  '--atlas-profile-glass-blur: 24px;',
  '--atlas-profile-panel-padding: var(--atlas-space-5);',
  '--atlas-profile-content-gap: var(--atlas-space-4);',
]) {
  assert.ok(agentProfile.includes(publicMaterialToken), `Agent profile must adopt bounded Public material token: ${publicMaterialToken}`);
}

for (const agentFloatingMaterialToken of [
  '--atlas-profile-glass-border: transparent;',
  '--atlas-profile-glass-depth: var(--atlas-surface-elevation-low);',
  '--atlas-profile-elevated-depth: var(--atlas-surface-elevation-medium);',
  '--atlas-profile-floating-depth: var(--atlas-surface-elevation-high);',
]) {
  assert.ok(agentProfile.includes(agentFloatingMaterialToken), `Agent profile must adopt borderless floating material token: ${agentFloatingMaterialToken}`);
}

for (const retiredToken of [
  '--atlas-profile-glass-opacity: 0.96;',
  '--atlas-profile-glass-blur: 6px;',
  '--atlas-profile-canvas: #e8f1f6;',
  '--atlas-profile-canvas: #071b27;',
  '--atlas-profile-surface-secondary: #17394a;',
]) {
  assert.ok(!designSystem.includes(retiredToken), `Retired outlined Agent material token must not remain: ${retiredToken}`);
}

assert.match(designSystem, /\.atlas-ds-shell-agent \.atlas-ds-surface/);
assert.match(shellStyles, /background-image: linear-gradient\(135deg, var\(--atlas-profile-canvas-wash\)/);
assert.match(shellStyles, /\.launchCard \{[\s\S]*?backdrop-filter: blur\(var\(--atlas-profile-glass-blur\)\)/);
assert.match(shellStyles, /\.shell :global\(\.atlas-action-secondary\)[\s\S]*?color-mix\(in srgb, var\(--atlas-action-secondary\) 78%, transparent\)/);
assert.doesNotMatch(shellStyles, /#[0-9a-fA-F]{3,8}/, 'Agent shell module must not introduce hard-coded hex values.');

assert.match(clientCases, /import styles from '\.\/ClientCasesWorkspace\.module\.css';/);
assert.doesNotMatch(clientCases, /border-white\/10|border-white\/15|bg-\[#071014\]|text-white/, 'Client Work must not carry old outlined dark utility treatment.');
assert.match(clientCaseStyles, /\.surface, \.caseCard, \.linkedWork \{[\s\S]*?backdrop-filter: blur\(var\(--atlas-profile-glass-blur\)\)/);
assert.match(readinessStyles, /\.selectionPanel, \.resultSection \{[\s\S]*?backdrop-filter: blur\(var\(--atlas-profile-glass-blur\)\)/);
assert.match(preparationStyles, /\.workspace \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/);
assert.match(intelligenceStyles, /\.contextNavigation \{[\s\S]*?backdrop-filter: blur\(var\(--atlas-profile-glass-blur\)\)/);
assert.doesNotMatch(strategyPage, /bg-\[#08151a\]|border-white\/10/);

assert.equal(packageJson.scripts?.['check:agent-workspace-public-material-visual-remediation'], 'jiti scripts/checkAgentWorkspacePublicMaterialVisualRemediation.ts');

console.log('AGENT_WORKSPACE_PUBLIC_MATERIAL_VISUAL_REMEDIATION_CHECK: PASS');
