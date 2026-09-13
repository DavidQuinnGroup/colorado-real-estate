import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const styles = readFileSync('app/atlas-design-system.css', 'utf8');
const fixtureStyles = readFileSync('components/design-system/DesignSystemVisualCertificationFixture.module.css', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

const lightBlock = styles.slice(styles.indexOf(':root {'), styles.indexOf('@media (prefers-color-scheme: dark)'));
const darkBlock = styles.slice(styles.indexOf('@media (prefers-color-scheme: dark)'), styles.indexOf('@theme inline'));

for (const token of [
  '--atlas-canvas: #f5f8fb;',
  '--atlas-surface-primary: rgb(255 255 255 / 0.9);',
  '--atlas-surface-secondary: rgb(244 249 252 / 0.9);',
  '--atlas-surface-elevated: #fbfdff;',
  '--atlas-surface-floating: #ffffff;',
  '--atlas-surface-data: #eef4f8;',
  '--atlas-surface-reading: #fffefa;',
  '--atlas-field-background: #ffffff;',
  '--atlas-field-readonly: #edf3f7;',
]) {
  assert.ok(lightBlock.includes(token), `Light must define ${token}`);
}

for (const darkValue of ['#071017', 'rgb(15 28 39 / 0.74)', 'rgb(7 16 23 / 0.78)']) {
  assert.ok(!lightBlock.includes(darkValue), `Light must not resolve to Dark value ${darkValue}`);
  assert.ok(darkBlock.includes(darkValue), `Dark override must retain ${darkValue}`);
}

assert.match(styles, /\.atlas-ds-root \{[\s\S]*?background-color: var\(--atlas-canvas\);/);
assert.match(styles, /\.atlas-ds-canvas \{[\s\S]*?background-color: var\(--atlas-canvas\);[\s\S]*?background-image: linear-gradient/);
assert.match(styles, /\.atlas-ds-surface-glass \{[\s\S]*?background: color-mix\(in srgb, var\(--atlas-surface-primary\)/);
assert.match(styles, /\.atlas-ds-input,[\s\S]*?background: var\(--atlas-field-background\);/);
assert.match(styles, /\.atlas-ds-input\[readonly\][\s\S]*?background: var\(--atlas-field-readonly\);/);

const profiles = {
  public: {
    sectionGap: 'var(--atlas-space-16)', panelPadding: 'var(--atlas-space-10)', contentGap: 'var(--atlas-space-6)', opacity: '0.64', blur: '24px', depth: 'var(--atlas-depth-2)',
  },
  client: {
    sectionGap: 'var(--atlas-space-12)', panelPadding: 'var(--atlas-space-7)', contentGap: 'var(--atlas-space-4)', opacity: '0.78', blur: '14px', depth: 'var(--atlas-depth-2)',
  },
  agent: {
    sectionGap: 'var(--atlas-space-6)', panelPadding: 'var(--atlas-space-4)', contentGap: 'var(--atlas-space-2)', opacity: '0.96', blur: '6px', depth: 'var(--atlas-depth-1)',
  },
  admin: {
    sectionGap: 'var(--atlas-space-4)', panelPadding: 'var(--atlas-space-3)', contentGap: 'var(--atlas-space-1)', opacity: '1', blur: '0px', depth: 'var(--atlas-depth-1)',
  },
};

for (const [profile, expected] of Object.entries(profiles)) {
  const start = styles.indexOf(`.atlas-ds-shell-${profile} {\n    --atlas-profile-reading-width:`);
  assert.notEqual(start, -1, `${profile} profile block must exist`);
  const end = styles.indexOf('\n  }', start);
  assert.notEqual(end, -1, `${profile} profile block must close`);
  const block = styles.slice(start, end);
  assert.ok(block.includes(`--atlas-profile-section-gap: ${expected.sectionGap};`));
  assert.ok(block.includes(`--atlas-profile-panel-padding: ${expected.panelPadding};`));
  assert.ok(block.includes(`--atlas-profile-content-gap: ${expected.contentGap};`));
  assert.ok(block.includes(`--atlas-profile-glass-opacity: ${expected.opacity};`));
  assert.ok(block.includes(`--atlas-profile-glass-blur: ${expected.blur};`));
  assert.ok(block.includes(`--atlas-profile-glass-depth: ${expected.depth};`));
}

assert.match(fixtureStyles, /\.profileSample \{ align-self: start; gap: var\(--atlas-profile-content-gap\); padding: var\(--atlas-profile-panel-padding\); \}/);
assert.doesNotMatch(fixtureStyles, /--atlas-[\w-]+\s*:/, 'Fixture must consume canonical variables only.');
assert.equal(packageJson.scripts?.['check:liquid-glass-final-visual-refinement-v3'], 'jiti scripts/checkLiquidGlassFinalVisualRefinementV3.ts');

console.log('LIQUID_GLASS_FINAL_VISUAL_REFINEMENT_V3_CHECK: PASS');
