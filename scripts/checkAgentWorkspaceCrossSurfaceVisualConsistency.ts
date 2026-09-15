import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

function cssBlock(css: string, selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped} \\{[^}]*\\}`));
  assert.ok(match, `${selector} block must exist.`);
  return match[0];
}

const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };
const preparationStyles = source('components/agent/PreparationWorkspace.module.css');
const financialScenario = source('components/agent/MultiPropertyFinancialScenarioWorkspace.tsx');
const strategySuite = source('components/agent/MultiDimensionalStrategyWorkspace.tsx');
const intelligenceStyles = source('components/agent/IntelligenceWorkspace.module.css');
const authorizationWorkspace = source('components/agent/ClientAuthorizationWorkspace.tsx');
const globals = source('app/globals.css');
const home = source('components/agent/AgentWorkspaceHome.tsx');
const clientWork = source('components/agent/ClientCasesWorkspace.tsx');
const transactions = source('components/agent/TransactionWorkspace.tsx');
const outputs = source('components/agent/AgentOutputsWorkspace.tsx');

assert.match(preparationStyles, /\.workspace \{[\s\S]*?background: transparent;/, 'Buyer/Seller must not use one oversized inner dark page surface.');
assert.match(preparationStyles, /\.workspace > \.section, \.workspace > :global\(\[data-testid='agent-property-criteria-profile'\]\) \{[\s\S]*?background: color-mix\(in srgb, var\(--atlas-profile-surface-primary\)/, 'Buyer/Seller primary setup surfaces must use canonical Agent material.');
assert.match(preparationStyles, /\.workspace > \.section, \.workspace > :global\(\[data-testid='agent-property-criteria-profile'\]\) \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/, 'Buyer/Seller primary setup surfaces must float through shared elevation.');
assert.match(preparationStyles, /\.flatSection \{[\s\S]*?background: transparent;[\s\S]*?box-shadow: none;/, 'Buyer/Seller starting-point and topic sections must sit flat inside the primary setup surface.');
assert.match(preparationStyles, /\.flatSection \+ \.flatSection \{[\s\S]*?border-top: 1px solid color-mix\(in srgb, var\(--atlas-profile-border-subtle\) 30%, transparent\);/, 'Buyer/Seller flat sections may use only a subtle section divider.');
assert.doesNotMatch(preparationStyles, /\.workspace fieldset\.section \{/, 'Buyer/Seller must not reintroduce redundant filled fieldset surfaces.');

for (const [name, file] of [
  ['multi-property scenario', financialScenario],
  ['strategy suite', strategySuite],
] as const) {
  assert.match(file, /atlas-financial-scenario-workspace/, `${name} must use the normalized Financial Strategy canvas.`);
  assert.match(file, /atlas-financial-context/, `${name} must use the normalized Scenario/strategy context surface.`);
  assert.match(file, /atlas-financial-work-surface/, `${name} must use normalized floating work surfaces.`);
  assert.doesNotMatch(file, /bg-\[#0(?:71014|8151a)\]/, `${name} must not reintroduce a fixed dark nested page background.`);
}
assert.match(strategySuite, /atlas-financial-card-grid/, 'Strategy Suite result cards must use normalized Financial card grid treatment.');

assert.match(globals, /\.atlas-financial-context,[\s\S]*?\.atlas-financial-work-surface \{[\s\S]*?border: 1px solid transparent;/, 'Financial structural surfaces must be borderless.');
assert.match(globals, /\.atlas-financial-context,[\s\S]*?\.atlas-financial-work-surface \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/, 'Financial context must use canonical elevation.');
assert.match(globals, /\.atlas-financial-work-surface \{[\s\S]*?box-shadow: var\(--atlas-profile-elevated-depth\);/, 'Financial work surfaces must use the shared elevated depth.');
assert.match(globals, /\.atlas-financial-work-surface article,[\s\S]*?\.atlas-financial-card-grid > article \{[\s\S]*?box-shadow: var\(--atlas-surface-elevation-low\);/, 'Financial nested cards must use low shared elevation.');

assert.match(intelligenceStyles, /\.contextNavigation \{[\s\S]*?box-shadow: var\(--atlas-surface-elevation-low\);/, 'Intelligence context selector must remain subordinate.');
assert.match(intelligenceStyles, /\.workArea \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/, 'Intelligence destination cards must retain floating emphasis.');
assert.match(intelligenceStyles, /\.principles \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/, 'Intelligence provenance surface must remain within the shared hierarchy.');

assert.doesNotMatch(authorizationWorkspace, /bg-\[#071014\]/, 'Client Authorization must not use a fixed dark canvas.');
assert.match(authorizationWorkspace, /atlas-certification-boundary/, 'Client Authorization must use the semantic boundary surface.');
assert.match(authorizationWorkspace, /atlas-authorization-record/, 'Client Authorization records must keep their semantic record class.');
assert.match(globals, /\.atlas-authorization-record-current \{[\s\S]*?box-shadow: inset 4px 0 0 color-mix\(in srgb, var\(--atlas-notice-success\) 68%, transparent\), var\(--atlas-profile-glass-depth\);/, 'Current authorization state must be localized semantic accent plus canonical elevation.');
assert.match(globals, /\.atlas-secure-link-panel \{[\s\S]*?box-shadow: inset 4px 0 0 color-mix\(in srgb, var\(--atlas-action-secure\) 72%, transparent\), var\(--atlas-profile-floating-depth\);/, 'Secure link emphasis must be semantic and localized.');
assert.doesNotMatch(cssBlock(globals, '.atlas-authorization-record-current'), /border-color:/, 'Current authorization record must not rely on a full-panel perimeter border.');

for (const [name, file, marker] of [
  ['Agent Workspace Home', home, 'data-testid="agent-workspace-home"'],
  ['Client Work', clientWork, 'data-testid="client-cases-workspace"'],
  ['Transactions', transactions, 'data-testid="transactions-workspace"'],
  ['Outputs', outputs, 'data-testid="agent-outputs-workspace"'],
] as const) {
  assert.ok(file.includes(marker), `${name} approved reference route marker must remain present.`);
}

assert.equal(packageJson.scripts?.['check:agent-workspace-cross-surface-visual-consistency'], 'jiti scripts/checkAgentWorkspaceCrossSurfaceVisualConsistency.ts');

console.log('AGENT_WORKSPACE_CROSS_SURFACE_VISUAL_CONSISTENCY_CHECK: PASS');
