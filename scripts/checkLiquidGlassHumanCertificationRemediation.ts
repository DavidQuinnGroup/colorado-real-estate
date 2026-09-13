import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const styles = readFileSync('app/atlas-design-system.css', 'utf8');
const fixture = readFileSync('components/design-system/DesignSystemVisualCertificationFixture.tsx', 'utf8');
const fixtureStyles = readFileSync('components/design-system/DesignSystemVisualCertificationFixture.module.css', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

const materialTokens = [
  '--atlas-canvas',
  '--atlas-canvas-atmosphere',
  '--atlas-surface-primary',
  '--atlas-surface-secondary',
  '--atlas-surface-elevated',
  '--atlas-surface-floating',
  '--atlas-surface-data',
  '--atlas-surface-reading',
  '--atlas-surface-critical',
];

for (const token of materialTokens) {
  assert.ok((styles.match(new RegExp(token, 'g')) || []).length >= 2, `${token} must have light and dark semantic values.`);
}

for (const selector of [
  '.atlas-ds-surface-glass',
  '.atlas-ds-surface-glass .atlas-ds-surface-glass',
  '.atlas-ds-surface-elevated',
  '.atlas-ds-surface-floating',
  '.atlas-ds-surface-data',
  '.atlas-ds-surface-reading',
  '.atlas-ds-surface-critical',
]) {
  assert.match(styles, new RegExp(selector.replaceAll('.', '\\.'), 'g'));
}

const profileVariables = [
  '--atlas-profile-glass-opacity',
  '--atlas-profile-glass-blur',
  '--atlas-profile-glass-border',
  '--atlas-profile-glass-depth',
  '--atlas-profile-section-gap',
  '--atlas-profile-panel-padding',
  '--atlas-profile-control-gap',
];
const protectedSemanticTokens = ['--atlas-status-', '--atlas-notice-', '--atlas-information-', '--atlas-focus-ring', '--atlas-action-'];
const profiles = ['public', 'agent', 'client', 'admin'];

const profileBlocks = profiles.map((profile) => {
  const match = styles.match(new RegExp(`\\.atlas-ds-shell-${profile} \\{([\\s\\S]*?)\\n  \\}`));
  assert.ok(match, `${profile} profile block must exist.`);
  const block = match[1];

  for (const variable of profileVariables) {
    assert.match(block, new RegExp(variable), `${profile} must define ${variable}.`);
  }
  for (const semanticToken of protectedSemanticTokens) {
    assert.ok(!block.includes(semanticToken), `${profile} must not redefine ${semanticToken}.`);
  }
  return block;
});

for (const variable of profileVariables) {
  const values = profileBlocks.map((block) => block.match(new RegExp(`${variable}: ([^;]+);`))?.[1]);
  assert.equal(new Set(values).size > 1, true, `${variable} must differentiate at least one profile.`);
}

assert.match(styles, /background: linear-gradient\(135deg, var\(--atlas-profile-canvas-wash\)/);
assert.match(styles, /backdrop-filter: blur\(var\(--atlas-profile-glass-blur\)\)/);
assert.match(styles, /box-shadow: var\(--atlas-profile-glass-depth/);
assert.match(fixture, /function ProfileSample/);
assert.match(fixture, /data-profile-sample=\{profile\}/);
assert.match(fixture, /data-testid="atlas-fixture-material-matrix"/);
assert.match(fixtureStyles, /var\(--atlas-profile-section-gap\)/);
assert.match(fixtureStyles, /var\(--atlas-profile-panel-padding\)/);
assert.match(fixtureStyles, /var\(--atlas-profile-control-gap\)/);
assert.doesNotMatch(fixtureStyles, /--atlas-[\w-]+\s*:/, 'Fixture styles must not redefine canonical tokens.');
assert.equal(packageJson.scripts?.['check:liquid-glass-human-certification-remediation'], 'jiti scripts/checkLiquidGlassHumanCertificationRemediation.ts');

console.log('LIQUID_GLASS_HUMAN_CERTIFICATION_REMEDIATION_CHECK: PASS');
