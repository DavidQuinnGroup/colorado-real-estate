import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

const grandPlanIntake = read('components/GrandPlanIntake.tsx');
const sundancePage = read('app/sundance-film-festival/page.tsx');
const sitemap = read('app/sitemap.ts');
const packageJson = read('package.json');
const workerConfig = read('tsconfig.worker.json');

assert.match(grandPlanIntake, /type DecisionPlanSection = \{/, 'Grand Plan must define a bounded decision-plan section type.');
assert.match(grandPlanIntake, /getDecisionPlanSections/, 'Grand Plan must build deterministic decision-plan sections from entered state.');
assert.match(grandPlanIntake, /data-testid="grand-plan-decision-plan"/, 'Grand Plan must expose the decision plan summary.');
assert.match(grandPlanIntake, /data-testid="grand-plan-decision-plan-section"/, 'Grand Plan must expose inspectable decision-plan sections.');
assert.match(grandPlanIntake, /data-grand-plan-decision-plan-read-only="true"/, 'Grand Plan decision plan must remain read-only.');
assert.match(grandPlanIntake, /data-grand-plan-decision-plan-hidden-state-transfer="false"/, 'Grand Plan must preserve no hidden state transfer.');
assert.match(grandPlanIntake, /data-grand-plan-decision-plan-scoring="false"/, 'Grand Plan must preserve no-scoring boundary.');

for (const domain of ['place', 'property', 'timing', 'financing', 'verification', 'professional-questions', 'next-step']) {
  assert.match(grandPlanIntake, new RegExp(`id: '${domain}'`), `Decision plan must include ${domain}.`);
}

for (const required of [
  'Known',
  'Assumed',
  'Unresolved',
  'Useful Next Step',
  'does not rank properties, score places, predict outcomes',
  'More available evidence does not mean a better property',
  'missing county data does not mean a negative condition',
  'No lender approval, rate quote, or qualification is created by the Grand Plan',
]) {
  assert.match(grandPlanIntake, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Grand Plan decision plan must include: ${required}`);
}

for (const forbidden of [
  'automated recommendation',
  'investment score',
  'suitability score',
  'best choice',
  'valuation certainty',
  'financing approval',
  'navigator.sendBeacon',
  'localStorage',
  'sessionStorage',
]) {
  assert.ok(!grandPlanIntake.includes(forbidden), `Grand Plan must not introduce forbidden behavior or claim: ${forbidden}`);
}

assert.match(sundancePage, /data-testid="sundance-editorial-authority-page"/, 'Sundance route must expose a stable page handle.');
assert.match(sundancePage, /data-editorial-authority-pilot="sundance-film-festival"/, 'Sundance route must identify the editorial pilot.');
assert.match(sundancePage, /data-testid="sundance-visible-answer"/, 'Sundance route must render visible answer-first content.');
assert.match(sundancePage, /data-testid="sundance-editorial-authority-schema"/, 'Sundance route must include bounded structured data.');
assert.match(sundancePage, /data-sundance-schema-visible-alignment="true"/, 'Sundance schema must be marked as visibly aligned.');
assert.match(sundancePage, /data-testid="sundance-source-boundaries"/, 'Sundance route must expose source and freshness boundaries.');
assert.match(sundancePage, /data-testid="sundance-reie-continuity"/, 'Sundance route must link into existing REIE surfaces.');
assert.match(sundancePage, /href:\s*'\/grand-plan'|href="\/grand-plan"/, 'Sundance route must link to Grand Plan.');
assert.match(sundancePage, /href:\s*'\/search'|href="\/search"/, 'Sundance route must link to Search.');
assert.match(sundancePage, /href:\s*'\/market'|href="\/market"/, 'Sundance route must link to Market.');
assert.match(sundancePage, /href:\s*'\/sources'|href="\/sources"/, 'Sundance route must link to Sources.');
assert.match(sundancePage, /href:\s*'\/contact'|href="\/contact"/, 'Sundance route must link to Contact.');
assert.match(sitemap, /url\('\/sundance-film-festival'\)/, 'Sitemap must include the Sundance editorial authority route.');
assert.match(packageJson, /check:grand-plan-editorial-authority-advancement/, 'Package scripts must expose this check.');
assert.match(workerConfig, /scripts\/checkGrandPlanEditorialAuthorityAdvancement\.ts/, 'Worker build must compile this check.');

for (const forbidden of [
  'ticket inventory',
  'investment opportunity',
  'affiliate',
  'automated valuation',
]) {
  assert.ok(!sundancePage.toLowerCase().includes(forbidden.toLowerCase()), `Sundance route must not include unsupported claim: ${forbidden}`);
}

assert.match(sundancePage, /data-editorial-authority-booking="false"/, 'Sundance route must explicitly block booking behavior.');
assert.match(sundancePage, /data-editorial-authority-market-impact-claims="false"/, 'Sundance route must explicitly block market-impact claims.');
assert.match(sundancePage, /data-editorial-authority-property-ranking="false"/, 'Sundance route must explicitly block property ranking.');
assert.match(sundancePage, /data-editorial-authority-suitability-scoring="false"/, 'Sundance route must explicitly block suitability scoring.');
assert.match(sundancePage, /data-editorial-authority-provider-activation="false"/, 'Sundance route must explicitly block provider activation.');
assert.match(sundancePage, /data-editorial-authority-hidden-state-transfer="false"/, 'Sundance route must explicitly block hidden state transfer.');

for (const required of [
  'not a live festival schedule',
  'not a live event guide',
  'verified from official sources',
  'without relying on unsupported live-event or market-impact claims',
  'does not prove fit, availability, pricing',
  'not a substitute for those sources or professional judgment',
]) {
  assert.match(sundancePage, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `Sundance route must include boundary: ${required}`);
}

console.log(
  '[grand-plan-editorial-authority-advancement] ok: Grand Plan decision-plan synthesis, Sundance editorial authority route, sitemap inclusion, schema alignment, REIE continuity links, and protected boundaries verified.',
);
