import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const styles = readFileSync('app/atlas-design-system.css', 'utf8');
const globals = readFileSync('app/globals.css', 'utf8');
const primitives = readFileSync('components/design-system/AtlasDesignSystem.tsx', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.match(globals, /@import "\.\/atlas-design-system\.css";/);
assert.match(styles, /:root\s*\{/);
assert.match(styles, /@media \(prefers-color-scheme: dark\)/);
assert.match(styles, /@theme inline/);
assert.match(styles, /--color-atlas-canvas: var\(--atlas-canvas\);/);
assert.match(styles, /--atlas-surface-primary:/);
assert.match(styles, /--atlas-surface-secondary:/);
assert.match(styles, /--atlas-surface-elevated:/);
assert.match(styles, /--atlas-surface-floating:/);
assert.match(styles, /--atlas-surface-data:/);
assert.match(styles, /--atlas-surface-reading:/);
assert.match(styles, /--atlas-surface-critical:/);
assert.match(styles, /--atlas-canvas-atmosphere:/);
assert.match(styles, /--atlas-text-primary:/);
assert.match(styles, /--atlas-action-primary:/);
assert.match(styles, /--atlas-field-background:/);
assert.match(styles, /--atlas-status-active:/);
assert.match(styles, /--atlas-information-governed-fact:/);
assert.match(styles, /--atlas-focus-ring:/);
assert.match(styles, /--atlas-depth-2:/);
assert.match(styles, /--atlas-space-4:/);
assert.match(styles, /--atlas-radius-md:/);
assert.match(styles, /--atlas-duration-standard:/);

for (const profile of ['public', 'agent', 'client', 'admin']) {
  assert.match(styles, new RegExp(`\\.atlas-ds-shell-${profile}`));
}

for (const profileVariable of [
  '--atlas-profile-glass-opacity',
  '--atlas-profile-glass-blur',
  '--atlas-profile-glass-border',
  '--atlas-profile-glass-depth',
  '--atlas-profile-section-gap',
  '--atlas-profile-panel-padding',
  '--atlas-profile-control-gap',
]) {
  assert.match(styles, new RegExp(profileVariable));
}

for (const className of [
  'atlas-ds-surface-glass',
  'atlas-ds-surface-data',
  'atlas-ds-surface-reading',
  'atlas-ds-surface-critical',
  'atlas-ds-action-primary',
  'atlas-ds-action-secondary',
  'atlas-ds-action-ghost',
  'atlas-ds-action-secure',
  'atlas-ds-action-destructive',
  'atlas-ds-input',
  'atlas-ds-status',
  'atlas-ds-notice',
  'atlas-ds-information-class',
  'atlas-ds-empty-state',
  'atlas-ds-loading-state',
  'atlas-ds-error-state',
  'atlas-ds-table-wrap',
]) {
  assert(styles.includes(className), `missing Wave 0 foundation class: ${className}`);
}

assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(styles, /@media \(prefers-contrast: more\), \(forced-colors: active\)/);
assert.match(styles, /min-height: 2\.75rem/);
assert.match(styles, /outline: 3px solid var\(--atlas-focus-ring\)/);
assert.match(styles, /\.atlas-ds-surface-glass \.atlas-ds-surface-glass/);
assert.match(styles, /background: linear-gradient\(135deg, var\(--atlas-profile-canvas-wash\)/);
assert.match(styles, /\.atlas-ds-field-control > \.atlas-ds-input[\s\S]*?flex: 1 1 0; width: auto; min-width: 0;/);

for (const exportName of [
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
  assert.match(primitives, new RegExp(`export function ${exportName}`));
}

assert.match(primitives, /<label className="atlas-ds-label" htmlFor=\{htmlFor\}>/);
assert.match(primitives, /aria-busy=\{loading \|\| undefined\}/);
assert.match(primitives, /data-status=\{status\}/);
assert.match(primitives, /data-information-class=\{informationClass\}/);
assert.equal(packageJson.scripts?.['check:liquid-glass-design-system-foundation'], 'jiti scripts/checkLiquidGlassDesignSystemFoundation.ts');

console.log('LIQUID_GLASS_DESIGN_SYSTEM_FOUNDATION_CHECK: PASS');
