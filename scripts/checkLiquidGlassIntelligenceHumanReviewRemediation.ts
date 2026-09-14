import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

const fixture = source('components/design-system/DesignSystemVisualCertificationFixture.tsx');
const fixtureStyles = source('components/design-system/DesignSystemVisualCertificationFixture.module.css');
const publicAccess = source('app/private-access/page.tsx');
const agentLogin = source('app/agent/login/page.tsx');
const publicAccessRoute = source('app/private-access/login/route.ts');
const agentLoginRoute = source('app/agent-auth/login/route.ts');
const intelligence = source('components/agent/IntelligenceWorkspace.tsx');
const intelligenceStyles = source('components/agent/IntelligenceWorkspace.module.css');
const agentShell = source('components/agent/AgentWorkspaceShell.tsx');
const agentHome = source('components/agent/AgentWorkspaceHome.tsx');
const buyer = source('components/agent/BuyerConsultationExperience.tsx');
const seller = source('components/agent/SellerConsultationExperience.tsx');
const preparationWorkspace = source('components/agent/PreparationWorkspace.tsx');
const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };

assert.match(fixture, /<h3 className=\{styles\.profileTitle\} data-testid=\{`atlas-fixture-profile-title-\$\{profile\}`\}>\{profileLabels\[profile\]\} material profile<\/h3>/);
assert.match(fixture, /<p className="atlas-ds-label">Synthetic review context<\/p>/);
assert.match(fixtureStyles, /\.profileTitle \{[\s\S]*?font-family: var\(--atlas-font-display\);[\s\S]*?font-size: 1\.375rem;[\s\S]*?font-weight: 700;/);

assert.match(publicAccess, /action="\/private-access\/login"/);
assert.match(publicAccess, /id="atlas-public-access-form"/);
assert.match(publicAccess, /name="atlas-public-access"/);
assert.match(publicAccess, /data-autofill-identity="atlas-public-access"/);
assert.match(publicAccess, /id="atlas-public-access-password" name="privateAccessSecret"/);
assert.match(publicAccess, /autoComplete="section-atlas-public-access current-password"/);
assert.match(agentLogin, /action="\/agent-auth\/login"/);
assert.match(agentLogin, /id="atlas-agent-access-form"/);
assert.match(agentLogin, /name="atlas-agent-access"/);
assert.match(agentLogin, /data-autofill-identity="atlas-agent-access"/);
assert.match(agentLogin, /id="atlas-agent-credential" name="agentCredential"/);
assert.match(agentLogin, /autoComplete="section-atlas-agent-access current-password"/);
assert.doesNotMatch(publicAccess, /agentCredential/);
assert.doesNotMatch(agentLogin, /privateAccessSecret/);
assert.match(publicAccessRoute, /formData\.get\('privateAccessSecret'\)/);
assert.match(agentLoginRoute, /formData\.get\('agentCredential'\)/);

for (const marker of ['Intelligence', 'Property Intelligence', 'Location Intelligence', 'Market Intelligence', 'agent-intelligence-context-navigation']) {
  assert.ok(intelligence.includes(marker), `Intelligence hub must expose ${marker}.`);
}
for (const [path, current] of [
  ['components/agent/PropertyConversationExperience.tsx', 'property'],
  ['components/agent/PlaceConversationExperience.tsx', 'location'],
  ['components/agent/MarketConversationExperience.tsx', 'market'],
] as const) {
  const childPage = source(path);
  assert.match(childPage, new RegExp(`IntelligenceChildPageHeader current="${current}"`), `${path} must retain the shared Intelligence child-page composition.`);
  assert.match(childPage, new RegExp(`IntelligenceChildPageHeader current="${current}">[\\s\\S]*?<header[\\s\\S]*?<\\/header>[\\s\\S]*?<\\/IntelligenceChildPageHeader>`), `${path} must render its header before the shared Intelligence navigation.`);
  assert.doesNotMatch(childPage, /IntelligenceContextNavigation current=/, `${path} must not place the Intelligence navigation independently.`);
}
for (const marker of ['min-height: 2.75rem', '@media (max-width: 40rem)', 'grid-template-columns: repeat(3, minmax(0, 1fr))', 'aria-current']) {
  assert.ok(intelligenceStyles.includes(marker), `Intelligence navigation must retain ${marker}.`);
}
assert.match(intelligence, /export function IntelligenceChildPageHeader[\s\S]*?<IntelligenceContextNavigation current=\{current\} \/>/, 'The shared child-page composition must render navigation after its supplied header.');
assert.doesNotMatch(intelligenceStyles, /childPageHeader/, 'The obsolete compensating child-header spacing must not remain after structural correction.');

assert.match(agentShell, /atlas-ds-root atlas-ds-shell-agent atlas-ds-density-operational/);
assert.match(agentHome, /launchGroups/);
assert.match(buyer, /preparationWorkspaceStyles as styles/);
assert.match(seller, /preparationWorkspaceStyles as styles/);
assert.match(preparationWorkspace, /PreparationWorkspace\.module\.css/);
assert.equal(packageJson.scripts?.['check:liquid-glass-intelligence-human-review-remediation'], 'jiti scripts/checkLiquidGlassIntelligenceHumanReviewRemediation.ts');

console.log('LIQUID_GLASS_INTELLIGENCE_HUMAN_REVIEW_REMEDIATION_CHECK: PASS');
