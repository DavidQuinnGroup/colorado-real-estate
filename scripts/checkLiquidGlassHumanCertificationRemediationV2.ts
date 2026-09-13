import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const styles = readFileSync('app/atlas-design-system.css', 'utf8');
const fixture = readFileSync('components/design-system/DesignSystemVisualCertificationFixture.tsx', 'utf8');
const fixtureStyles = readFileSync('components/design-system/DesignSystemVisualCertificationFixture.module.css', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

for (const selector of ['.atlas-ds-surface-data', '.atlas-ds-surface-reading', '.atlas-ds-surface-critical']) {
  assert.match(styles, new RegExp(selector.replaceAll('.', '\\.'), 'g'), `${selector} must match AtlasSurface material output.`);
}
assert.doesNotMatch(styles, /\.atlas-ds-(?:data|reading|critical)-surface/, 'legacy material selectors must not bypass AtlasSurface output.');

for (const profile of ['public', 'agent', 'client', 'admin']) {
  const match = styles.match(new RegExp(`\\.atlas-ds-shell-${profile} \\{([\\s\\S]*?)\\n  \\}`));
  assert.ok(match, `${profile} profile block must exist.`);
  for (const variable of ['--atlas-profile-glass-opacity', '--atlas-profile-glass-blur', '--atlas-profile-section-gap', '--atlas-profile-panel-padding', '--atlas-profile-copy-measure']) {
    assert.match(match[1], new RegExp(variable), `${profile} must define ${variable}.`);
  }
}

assert.match(styles, /\.atlas-ds-surface-elevated[\s\S]*?box-shadow: inset 0 1px 0/);
assert.match(styles, /\.atlas-ds-surface-floating[\s\S]*?box-shadow: inset 0 1px 0/);
assert.match(styles, /\.atlas-ds-surface-critical[\s\S]*?inset 4px 0 0/);
assert.match(styles, /\.atlas-ds-field-control > \.atlas-ds-input[\s\S]*?flex: 1 1 0; width: auto; min-width: 0;/);
assert.match(styles, /\.atlas-ds-field-unit \{[\s\S]*?flex: 0 0 auto;/);
assert.match(styles, /@media \(max-width: 40rem\) \{[\s\S]*?\.atlas-ds-field-control \{ flex-wrap: nowrap; \}[\s\S]*?\.atlas-ds-field-unit \{ width: auto; \}/);

for (const requiredRule of [
  '.fixture, .fixture * { box-sizing: border-box; min-width: 0; }',
  '.profileGrid, .surfaceGrid { grid-template-columns: repeat(4, minmax(0, 1fr)); }',
  '@media (max-width: 64rem) { .profileGrid, .surfaceGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }',
  '@media (max-width: 40rem) {',
  '.controlRow { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); width: 100%; }',
]) {
  assert.ok(fixtureStyles.includes(requiredRule), `missing V2 responsive containment rule: ${requiredRule}`);
}

assert.match(fixtureStyles, /\.sectionNavigation \{[\s\S]*?overflow-x: auto; overscroll-behavior-inline: contain;/);
assert.match(fixture, /data-testid="atlas-fixture-focus-target"/);
assert.equal(packageJson.scripts?.['check:liquid-glass-human-certification-remediation-v2'], 'jiti scripts/checkLiquidGlassHumanCertificationRemediationV2.ts');

console.log('LIQUID_GLASS_HUMAN_CERTIFICATION_REMEDIATION_V2_CHECK: PASS');
