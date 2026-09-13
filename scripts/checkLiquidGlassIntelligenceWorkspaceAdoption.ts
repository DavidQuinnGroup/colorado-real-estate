import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

const navigation = source('lib/agentWorkspaceNavigation.ts');
const authorization = source('lib/admin/adminAuth.ts');
const landing = source('components/agent/IntelligenceWorkspace.tsx');
const styles = source('components/agent/IntelligenceWorkspace.module.css');
const property = source('components/agent/PropertyConversationExperience.tsx');
const place = source('components/agent/PlaceConversationExperience.tsx');
const market = source('components/agent/MarketConversationExperience.tsx');
const designSystem = source('components/design-system/AtlasDesignSystem.tsx');

assert.equal(existsSync(resolve(process.cwd(), 'app/agent/prepare/page.tsx')), true, 'The exact Intelligence landing route must exist.');
assert.match(navigation, /key: 'intelligence', label: 'Intelligence', href: '\/agent\/prepare'/, 'Intelligence must lead to its unified landing route.');
assert.match(authorization, /surface\('\/agent\/prepare', 'BROWSER_ADMIN_PAGE', \['HUMAN_AGENT'\], \['AGENT'\], \['HUMAN_AGENT_SESSION'\], 'READ_ONLY'/, 'The Intelligence landing must remain exact Agent-only, read-only access.');

for (const marker of ['agent-intelligence-workspace', 'Property Intelligence', 'Location Intelligence', 'Market Intelligence', 'Analyze property', 'Explore location', 'Analyze market', 'data-persistence="false"', 'data-customer-data="false"', 'data-provider-activity="false"']) {
  assert.ok(landing.includes(marker), `Intelligence landing must retain ${marker}.`);
}

assert.match(landing, /AtlasInformationClassLabel informationClass="governed-fact"/, 'Landing must expose governed-fact provenance semantics.');
assert.match(landing, /AtlasInformationClassLabel informationClass="editorial-context"/, 'Landing must expose editorial-context semantics.');
assert.match(landing, /AtlasInformationClassLabel informationClass="warning-limitation"/, 'Landing must expose limitation semantics.');
assert.match(designSystem, /AtlasInformationClassLabel/, 'The certified information-class primitive must remain available.');

for (const [name, experience, marker] of [
  ['Property', property, 'agent-property-conversation-experience'],
  ['Location', place, 'agent-place-conversation-experience'],
  ['Market', market, 'agent-market-conversation-experience'],
] as const) {
  assert.ok(experience.includes("import styles from './IntelligenceWorkspace.module.css'"), `${name} must use the shared Intelligence presentation layer.`);
  assert.ok(experience.includes(`className={styles.page}`), `${name} must use the shared Liquid Glass canvas.`);
  assert.ok(experience.includes(marker), `${name} must retain its exact route marker.`);
  assert.ok(experience.includes('data-persistence="false"'), `${name} must remain session-only.`);
  assert.equal(experience.includes('localStorage'), false, `${name} must not add browser persistence.`);
}

for (const marker of [
  'var(--atlas-profile-canvas)',
  'var(--atlas-profile-surface-primary)',
  'var(--atlas-profile-field-background)',
  'var(--atlas-focus-ring)',
  'prefers-reduced-motion',
  'cursor: pointer',
  'cursor: not-allowed',
  'agent-current-competing-listing-context',
  'agent-current-snapshot-comparison',
]) {
  assert.ok(styles.includes(marker), `Shared Intelligence styling must retain ${marker}.`);
}

assert.equal(styles.includes('#071014'), false, 'Shared Intelligence styling must not introduce a fixed dark canvas.');
assert.equal(styles.includes('localStorage'), false, 'Shared Intelligence styling must not introduce persistence.');

console.log('LIQUID_GLASS_INTELLIGENCE_WORKSPACE_ADOPTION_CHECK: PASS');
