import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const fixture = readFileSync('components/design-system/DesignSystemVisualCertificationFixture.tsx', 'utf8');
const fixtureStyles = readFileSync('components/design-system/DesignSystemVisualCertificationFixture.module.css', 'utf8');
const fixtureRoute = readFileSync('app/agent/design-system/visual-certification/page.tsx', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const middleware = readFileSync('middleware.ts', 'utf8');
const sitemap = readFileSync('app/sitemap.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.match(fixtureRoute, /DesignSystemVisualCertificationFixture/);
assert.match(fixtureRoute, /index: false/);
assert.match(fixtureRoute, /follow: false/);
assert.match(auth, /surface\('\/agent\/design-system\/visual-certification', 'BROWSER_ADMIN_PAGE', \['HUMAN_AGENT'\], \['AGENT'\], \['HUMAN_AGENT_SESSION'\], 'READ_ONLY', 'READ_ONLY_ADMIN', false\)/);
assert.match(middleware, /pathname === '\/agent' \|\| pathname\.startsWith\('\/agent\/'\)/);
assert(!sitemap.includes('/agent/design-system/visual-certification'), 'fixture route must not be in the sitemap');

for (const primitive of [
  'AtlasSurface',
  'AtlasButton',
  'AtlasLink',
  'AtlasField',
  'AtlasNotice',
  'AtlasInformationClassLabel',
  'AtlasStatusLabel',
  'AtlasEmptyState',
  'AtlasLoadingState',
  'AtlasErrorState',
]) {
  assert.match(fixture, new RegExp(`\\b${primitive}\\b`));
}

assert.match(fixture, /type ShellProfile = 'public' \| 'agent' \| 'client' \| 'admin';/);
assert.match(fixture, /atlas-ds-shell-\$\{profile\}/);
assert.match(fixture, /function ProfileSample/);
assert.match(fixture, /data-profile-sample=\{profile\}/);
assert.match(fixture, /data-testid="atlas-fixture-material-matrix"/);

for (const informationClass of [
  'governed-fact',
  'assumption',
  'modeled-result',
  'professional-input',
  'editorial-context',
  'agent-opinion',
  'system-status',
  'warning-limitation',
]) {
  assert.match(fixture, new RegExp(`informationClass: '${informationClass}'`));
}

for (const prohibitedReference of ['fetch(', 'prisma', '/api/', 'server action', 'mailto:', 'tel:']) {
  assert(!fixture.toLowerCase().includes(prohibitedReference), `fixture must not reference ${prohibitedReference}`);
}

assert.doesNotMatch(fixtureStyles, /--atlas-[\w-]+\s*:/, 'fixture styles must consume, not redefine, canonical tokens');
assert.match(fixture, /prefers-color-scheme: dark/);
assert.match(fixture, /prefers-reduced-motion: reduce/);
assert.match(fixture, /data-testid="atlas-visual-certification-fixture"/);
assert.match(fixture, /data-testid="atlas-fixture-focus-target"/);
assert.match(fixtureStyles, /var\(--atlas-profile-section-gap\)/);
assert.match(fixtureStyles, /var\(--atlas-profile-panel-padding\)/);
assert.match(fixtureStyles, /var\(--atlas-profile-control-gap\)/);
assert.equal(packageJson.scripts?.['check:liquid-glass-visual-certification-fixture'], 'jiti scripts/checkLiquidGlassVisualCertificationFixture.ts');

console.log('LIQUID_GLASS_VISUAL_CERTIFICATION_FIXTURE_CHECK: PASS');
