import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const styles = readFileSync('app/atlas-design-system.css', 'utf8');
const fixture = readFileSync('components/design-system/DesignSystemVisualCertificationFixture.tsx', 'utf8');
const fixtureStyles = readFileSync('components/design-system/DesignSystemVisualCertificationFixture.module.css', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

const profileMaterialVariables = [
  '--atlas-profile-canvas',
  '--atlas-profile-canvas-atmosphere',
  '--atlas-profile-surface-primary',
  '--atlas-profile-surface-secondary',
  '--atlas-profile-surface-elevated',
  '--atlas-profile-surface-floating',
  '--atlas-profile-surface-data',
  '--atlas-profile-surface-reading',
  '--atlas-profile-field-background',
  '--atlas-profile-field-readonly',
  '--atlas-profile-border-subtle',
  '--atlas-profile-border-strong',
] as const;

function profileBlock(profile: 'public' | 'agent' | 'client' | 'admin') {
  const profileStyles = styles.slice(0, styles.indexOf('\n  @media (prefers-color-scheme: dark)'));
  const start = profileStyles.lastIndexOf(`.atlas-ds-shell-${profile} {`);
  assert.notEqual(start, -1, `${profile} profile block must exist`);
  const end = styles.indexOf('\n  }', start);
  assert.notEqual(end, -1, `${profile} profile block must close`);
  return styles.slice(start, end);
}

const baseProfileBlock = styles.slice(
  styles.indexOf('.atlas-ds-shell-public,\n  .atlas-ds-shell-agent,'),
  styles.indexOf('\n  }', styles.indexOf('.atlas-ds-shell-public,\n  .atlas-ds-shell-agent,')),
);

for (const variable of profileMaterialVariables) {
  assert.match(baseProfileBlock, new RegExp(`${variable}: var\\(--atlas-`), `shared profile layer must alias ${variable}`);
}

for (const profile of ['agent', 'client', 'admin'] as const) {
  const block = profileBlock(profile);
  for (const variable of profileMaterialVariables) {
    assert.match(block, new RegExp(`${variable}:`), `${profile} must define ${variable}`);
  }
  assert.match(block, /--atlas-profile-glass-border:/);
  assert.match(block, /--atlas-profile-elevated-depth:|--atlas-profile-floating-depth:|--atlas-profile-glass-depth:/);
}

const publicBlock = profileBlock('public');
assert.doesNotMatch(publicBlock, /--atlas-profile-surface-(?:primary|secondary|elevated|floating|data|reading):/, 'Public must retain base canonical material aliases.');
assert.match(styles, /@media \(prefers-color-scheme: dark\) \{[\s\S]*?\.atlas-ds-shell-agent \{[\s\S]*?--atlas-profile-canvas: var\(--atlas-canvas\);/);
assert.match(styles, /@media \(prefers-color-scheme: dark\) \{[\s\S]*?\.atlas-ds-shell-client \{[\s\S]*?--atlas-profile-canvas: #102131;/);
assert.match(styles, /@media \(prefers-color-scheme: dark\) \{[\s\S]*?\.atlas-ds-shell-admin \{[\s\S]*?--atlas-profile-canvas: #101d29;/);

assert.match(styles, /\.atlas-ds-canvas \{[\s\S]*?background-color: var\(--atlas-profile-canvas\);[\s\S]*?var\(--atlas-profile-canvas-atmosphere\)/);
assert.match(styles, /\.atlas-ds-surface-glass \{[\s\S]*?var\(--atlas-profile-surface-primary\)/);
assert.match(styles, /\.atlas-ds-surface-glass \.atlas-ds-surface-glass \{[\s\S]*?var\(--atlas-profile-surface-secondary\)[\s\S]*?backdrop-filter: none;/);
assert.match(styles, /\.atlas-ds-surface-elevated \{[\s\S]*?var\(--atlas-profile-surface-elevated\)[\s\S]*?var\(--atlas-profile-elevated-depth\)/);
assert.match(styles, /\.atlas-ds-surface-floating \{[\s\S]*?var\(--atlas-profile-surface-floating\)[\s\S]*?var\(--atlas-profile-floating-depth\)/);
assert.match(styles, /\.atlas-ds-surface-reading \{[\s\S]*?var\(--atlas-profile-surface-reading\)/);
assert.match(styles, /\.atlas-ds-input,[\s\S]*?background: var\(--atlas-profile-field-background\);/);
assert.match(styles, /\.atlas-ds-field-unit \{[\s\S]*?background: var\(--atlas-profile-field-readonly\);/);

assert.match(fixture, /type ShellProfile = 'public' \| 'agent' \| 'client' \| 'admin';/);
assert.match(fixture, /atlas-ds-shell-\$\{profile\}/);
assert.doesNotMatch(fixtureStyles, /--atlas-[\w-]+\s*:/, 'Fixture must consume canonical profile variables only.');
assert.equal(packageJson.scripts?.['check:liquid-glass-profile-contrast-refinement-v4'], 'jiti scripts/checkLiquidGlassProfileContrastRefinementV4.ts');

console.log('LIQUID_GLASS_PROFILE_CONTRAST_REFINEMENT_V4_CHECK: PASS');
