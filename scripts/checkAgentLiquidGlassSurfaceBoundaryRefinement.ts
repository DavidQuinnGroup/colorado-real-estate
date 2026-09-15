import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };
const designSystem = readFileSync('app/atlas-design-system.css', 'utf8');
const shellStyles = readFileSync('components/agent/AgentWorkspaceShell.module.css', 'utf8');
const clientCaseStyles = readFileSync('components/agent/ClientCasesWorkspace.module.css', 'utf8');
const readinessStyles = readFileSync('components/agent/ClientCaseReadinessWorkspace.module.css', 'utf8');
const preparationStyles = readFileSync('components/agent/PreparationWorkspace.module.css', 'utf8');
const intelligenceStyles = readFileSync('components/agent/IntelligenceWorkspace.module.css', 'utf8');
const visualFixture = readFileSync('components/design-system/DesignSystemVisualCertificationFixture.tsx', 'utf8');

assert.match(designSystem, /--atlas-surface-elevation-low:/);
assert.match(designSystem, /--atlas-surface-elevation-medium:/);
assert.match(designSystem, /--atlas-surface-elevation-high:/);
assert.match(designSystem, /\.atlas-ds-shell-agent \{[\s\S]*?--atlas-profile-glass-border: transparent;/);
assert.match(designSystem, /\.atlas-ds-shell-agent \{[\s\S]*?--atlas-profile-glass-depth: var\(--atlas-surface-elevation-low\);/);
assert.match(designSystem, /\.atlas-ds-shell-agent \{[\s\S]*?--atlas-profile-elevated-depth: var\(--atlas-surface-elevation-medium\);/);
assert.match(designSystem, /\.atlas-ds-shell-agent \{[\s\S]*?--atlas-profile-floating-depth: var\(--atlas-surface-elevation-high\);/);
assert.match(designSystem, /\.atlas-ds-shell-agent \.atlas-ds-surface \{[\s\S]*?border-color: transparent;/);
assert.match(designSystem, /\.atlas-ds-shell-agent \.atlas-ds-surface \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth, var\(--atlas-surface-elevation-low\)\);/);
assert.match(designSystem, /\.atlas-ds-shell-agent \.atlas-ds-surface-data,[\s\S]*?border-color: transparent;/);
assert.match(designSystem, /\.atlas-ds-shell-agent \.atlas-ds-surface-elevated \{[\s\S]*?border-color: transparent;/);
assert.match(designSystem, /\.atlas-ds-shell-agent \.atlas-ds-surface-elevated \{[\s\S]*?box-shadow: var\(--atlas-profile-elevated-depth, var\(--atlas-surface-elevation-medium\)\);/);
assert.match(designSystem, /\.atlas-ds-shell-agent \.atlas-ds-surface-floating \{[\s\S]*?border-color: transparent;/);
assert.match(designSystem, /\.atlas-ds-shell-agent \.atlas-ds-surface-floating \{[\s\S]*?box-shadow: var\(--atlas-profile-floating-depth, var\(--atlas-surface-elevation-high\)\);/);
assert.match(designSystem, /\.atlas-ds-shell-agent \.atlas-ds-surface-critical \{[\s\S]*?border-color: color-mix\(in srgb, var\(--atlas-notice-error\) 76%, var\(--atlas-profile-border-strong\)\);/);
assert.match(designSystem, /\.atlas-ds-shell-agent \.atlas-ds-surface-critical \{[\s\S]*?box-shadow: inset 4px 0 0 color-mix\(in srgb, var\(--atlas-notice-error\) 72%, transparent\), var\(--atlas-surface-elevation-low\);/);
assert.match(designSystem, /\.atlas-ds-surface-glass \.atlas-ds-surface-glass \{[\s\S]*?border-color: transparent;/);

assert.match(shellStyles, /\.launchCard \{[\s\S]*?border: 1px solid transparent;/);
assert.match(shellStyles, /\.launchCard \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/);
assert.match(shellStyles, /\.launchCard:hover \{[\s\S]*?border-color: transparent;/);
assert.match(shellStyles, /\.launchCard:hover \{[\s\S]*?box-shadow: var\(--atlas-profile-floating-depth\);/);
assert.match(shellStyles, /\.caseLink \{[\s\S]*?border: 1px solid transparent;/);
assert.match(shellStyles, /\.caseLink \{[\s\S]*?box-shadow: var\(--atlas-surface-elevation-low\);/);
assert.match(shellStyles, /\.shell :global\(main\[data-testid\] > div > section\[class\*='border'\]\)[\s\S]*?border-color: transparent !important;/);
assert.match(shellStyles, /\.shell :global\(a\[class\*='block'\]\[class\*='border'\]\)[\s\S]*?border-color: transparent !important;/);
assert.match(shellStyles, /\.shell :global\(\[class\*='border-white'\]\), \.shell :global\(\[class\*='divide-white'\]\), \.shell :global\(\[class\*='border-cyan'\]\) \{[\s\S]*?border-color: transparent !important;/);
assert.match(shellStyles, /\.shell :global\(button\[class\*='border-white'\]\),[\s\S]*?border-color: color-mix\(in srgb, var\(--atlas-profile-border-strong\) 45%, transparent\) !important;/);
assert.match(shellStyles, /\.shell :global\(input\), \.shell :global\(select\), \.shell :global\(textarea\) \{[\s\S]*?border-color: color-mix\(in srgb, var\(--atlas-profile-border-strong\) 54%, transparent\) !important;/);
assert.match(shellStyles, /\.navigationLinkActive \{[\s\S]*?box-shadow: inset 0 -2px 0 var\(--atlas-action-primary\)/);

assert.match(clientCaseStyles, /\.surface, \.caseCard, \.linkedWork \{[\s\S]*?border: 1px solid transparent;/);
assert.match(clientCaseStyles, /\.surface, \.caseCard, \.linkedWork \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/);
assert.match(clientCaseStyles, /\.input, \.select \{[\s\S]*?border: 1px solid color-mix\(in srgb, var\(--atlas-profile-border-strong\) 54%, transparent\);/);
assert.match(clientCaseStyles, /\.caseCard:hover \{[\s\S]*?border-color: transparent;/);
assert.match(clientCaseStyles, /\.caseCard:hover \{[\s\S]*?box-shadow: var\(--atlas-profile-floating-depth\);/);

assert.match(readinessStyles, /\.selectionPanel, \.resultSection \{[\s\S]*?border-color: transparent;/);
assert.match(readinessStyles, /\.selectionPanel, \.resultSection \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/);
assert.match(readinessStyles, /\.resultList \{[\s\S]*?border: 1px solid transparent;/);
assert.match(readinessStyles, /\.resultList \{[\s\S]*?box-shadow: var\(--atlas-surface-elevation-low\);/);

assert.match(preparationStyles, /\.workspace, \.guidance, \.briefingCard, \.emptyState, \.updateState, \.failureState \{[\s\S]*?border: 1px solid transparent;/);
assert.match(preparationStyles, /\.workspace \{[\s\S]*?background: transparent;/);
assert.match(preparationStyles, /\.workspace > \.section, \.workspace > :global\(\[data-testid='agent-property-criteria-profile'\]\) \{[\s\S]*?box-shadow: var\(--atlas-profile-glass-depth\);/);
assert.match(preparationStyles, /\.flatSection \{[\s\S]*?background: transparent;[\s\S]*?box-shadow: none;/);
assert.doesNotMatch(preparationStyles, /\.workspace fieldset\.section \{/);
assert.match(preparationStyles, /\.selectionCard, \.topicOption \{[\s\S]*?border: 1px solid color-mix\(in srgb, var\(--atlas-profile-border-subtle\) 26%, transparent\);/);
assert.match(preparationStyles, /\.selectionCard\[data-selected='true'\], \.topicOption\[data-selected='true'\] \{[\s\S]*?border-color: color-mix\(in srgb, var\(--atlas-action-primary\) 72%, transparent\);/);
assert.match(preparationStyles, /\.select \{[\s\S]*?border: 1px solid var\(--atlas-profile-border-strong\);/);
assert.match(preparationStyles, /\.updateState \{[\s\S]*?border-color: color-mix\(in srgb, var\(--atlas-notice-information\) 44%, var\(--atlas-profile-border-subtle\)\);/);
assert.match(preparationStyles, /\.failureState \{[\s\S]*?border-color: color-mix\(in srgb, var\(--atlas-notice-warning\) 54%, var\(--atlas-profile-border-subtle\)\);/);
assert.match(preparationStyles, /\.briefing :global\(\[data-testid='agent-shared-briefing-composition'\]\) > :global\(section\),[\s\S]*?border-color: transparent !important;/);
assert.match(preparationStyles, /\.briefing :global\(\[data-testid='agent-current-snapshot-comparison'\]\) \{[\s\S]*?border-color: transparent !important;/);

assert.match(intelligenceStyles, /\.contextNavigation \{[\s\S]*?border: 1px solid transparent;/);
assert.match(intelligenceStyles, /\.contextNavigation \{[\s\S]*?box-shadow: var\(--atlas-surface-elevation-low\);/);
assert.match(intelligenceStyles, /\.contextNavigationLink \{[\s\S]*?border: 1px solid color-mix\(in srgb, var\(--atlas-profile-border-subtle\) 45%, transparent\);/);
assert.match(intelligenceStyles, /\.workArea:hover \{[\s\S]*?border-color: transparent;/);
assert.match(intelligenceStyles, /\.page :global\(\[class\*='border-white'\]\), \.page :global\(\[class\*='border-cyan'\]\) \{[\s\S]*?border-color: transparent !important;/);
assert.match(intelligenceStyles, /\.page :global\(button\[class\*='border-white'\]\),[\s\S]*?border-color: color-mix\(in srgb, var\(--atlas-profile-border-strong\) 45%, transparent\) !important;/);
assert.match(intelligenceStyles, /\.page :global\(\[class\*='border-amber'\]\) \{[\s\S]*?border-color: color-mix\(in srgb, var\(--atlas-notice-warning\) 44%, transparent\) !important;/);
assert.match(intelligenceStyles, /\.page :global\(\[data-testid\$='empty-state'\]\) \{[\s\S]*?border-color: transparent !important;/);
assert.match(intelligenceStyles, /\.page :global\(\[data-testid='agent-current-snapshot-comparison'\]\) \{[\s\S]*?border-color: transparent !important;/);

assert.match(visualFixture, /data-testid="atlas-fixture-structural-glass-surface"/);
assert.match(visualFixture, /Borderless elevated grouping/);
assert.match(visualFixture, /data-testid="atlas-fixture-semantic-surface"/);
assert.match(visualFixture, /Meaningful boundary retained/);

assert.equal(packageJson.scripts?.['check:agent-liquid-glass-surface-boundary-refinement'], 'jiti scripts/checkAgentLiquidGlassSurfaceBoundaryRefinement.ts');

console.log('AGENT_LIQUID_GLASS_SURFACE_BOUNDARY_REFINEMENT_CHECK: PASS');
