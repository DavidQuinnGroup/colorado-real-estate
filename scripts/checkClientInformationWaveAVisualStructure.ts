import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const workspace = readFileSync('components/agent/ClientCaseInformationWorkspace.tsx', 'utf8');
const css = readFileSync('components/agent/ClientCaseInformationWorkspace.module.css', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

assert.equal(packageJson.scripts?.['check:client-information-wave-a-visual-structure'], 'jiti scripts/checkClientInformationWaveAVisualStructure.ts');

for (const token of [
  'Client Case Information',
  'Case overview',
  'People',
  'Goals',
  'Current information',
  'Readiness',
  'client-case-information-case-overview',
  'client-case-information-people',
  'id="goals"',
  'id="current-information"',
  'id="readiness"',
  'Check duplicates',
  'Add Contact to Case',
  'Link existing authorized Contact',
  'Edit authorized Contact',
  'Update Contact',
  'no Contact was merged silently',
  'Stated purchase range',
  'Minimum stated purchase price',
  'Maximum stated purchase price',
  'not demonstrated affordability',
  'Review readiness',
]) {
  assert.match(workspace, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

assert.doesNotMatch(workspace, /clientType/);
assert.doesNotMatch(workspace, /preapproval/i);
assert.doesNotMatch(workspace, /credit report/i);

for (const cssClass of [
  'sectionNav',
  'peopleList',
  'personItem',
  'peopleEditor',
  'rolePicker',
  'roleCheck',
  'compactList',
  'linkExisting',
  'canonicalBoundaryNotice',
]) {
  assert.match(css, new RegExp(`\\.${cssClass}\\s*\\{`), `${cssClass} style is required`);
}

function classBlock(cssClass: string) {
  const match = css.match(new RegExp(`[^{}]*\\.${cssClass}[^{}]*\\{([^}]*)\\}`));
  assert.ok(match, `${cssClass} block missing`);
  return match[1];
}

for (const structuralClass of [
  'heading',
  'objectiveOption',
  'summaryItem',
  'cityChip',
  'personItem',
  'peopleEditor',
]) {
  assert.doesNotMatch(classBlock(structuralClass), /(^|;)\s*border\s*:/, `${structuralClass} should not use a perimeter border`);
}

assert.match(classBlock('input'), /border\s*:/);
assert.match(classBlock('select'), /border\s*:/);
assert.doesNotMatch(classBlock('canonicalBoundaryNotice'), /border\s*:/);
assert.match(classBlock('canonicalBoundaryNotice'), /border-color:\s*transparent/);
assert.match(classBlock('canonicalBoundaryNotice'), /inset 4px 0 0/);
assert.match(css, /\.input:focus-visible,\s*\.select:focus-visible,\s*\.link:focus-visible/);
assert.match(css, /@media \(max-width: 40rem\)/);
assert.match(css, /overflow-wrap: anywhere/);
assert.match(css, /\.sectionNav a:hover/);
assert.match(css, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);

console.log('client-information-wave-a-visual-structure: PASS');
