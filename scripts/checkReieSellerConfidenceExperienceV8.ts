import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildSellerDecisionWorkspace } from '../lib/sellerDecisionWorkspace.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const helper = read('lib/sellerDecisionWorkspace.ts');
const homeWorth = read('app/home-worth/page.tsx');
const sellerForm = read('components/HomeValueEstimator.tsx');
const valuationRoute = read('app/api/valuation/route.ts');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const sprintDoc = read('docs/project-atlas/executive-library/REIE-8-SELLER-CONFIDENCE-EXPERIENCE-V8.md');

assertIncludes(helper, 'buildSellerDecisionWorkspace', 'Seller Confidence v8 must expose a deterministic seller decision helper.');
assertIncludes(helper, "lens: 'readiness' | 'gather' | 'questions' | 'factors' | 'next'", 'Seller Confidence v8 must define the five seller decision lenses.');
assertIncludes(helper, 'does not produce an instant value', 'Seller Confidence v8 must preserve no-instant-value trust boundary.');

assertIncludes(homeWorth, 'buildSellerDecisionWorkspace', '/home-worth must compose the v8 seller decision helper.');
assertIncludes(homeWorth, 'data-testid="reie-seller-v8-decision-workspace"', '/home-worth must expose the v8 Seller Decision Workspace.');
assertIncludes(homeWorth, 'data-testid="reie-seller-v8-decision-item"', '/home-worth must expose deterministic seller decision items.');
assertIncludes(homeWorth, 'data-seller-v8-ai="false"', '/home-worth must preserve no-AI boundary.');
assertIncludes(homeWorth, 'data-seller-v8-automated-valuation="false"', '/home-worth must preserve no-automated-valuation boundary.');
assertIncludes(homeWorth, 'data-seller-v8-gis="false"', '/home-worth must preserve no-GIS boundary.');
assertIncludes(homeWorth, 'data-seller-v8-telemetry="false"', '/home-worth must preserve telemetry inactive boundary.');
assertIncludes(homeWorth, 'data-seller-v8-lender-workflow="false"', '/home-worth must preserve lender workflow exclusion.');
assertIncludes(homeWorth, "marketHref: '/market'", '/home-worth must preserve market continuity.');
assertIncludes(homeWorth, "searchHref: '/search'", '/home-worth must preserve search/inventory continuity.');
assertIncludes(homeWorth, "sellerHref: '/sell'", '/home-worth must preserve seller strategy continuity.');
assertIncludes(homeWorth, 'href="#home-worth-request"', '/home-worth must preserve seller review request continuity.');
assertIncludes(homeWorth, '<HomeValueEstimator />', '/home-worth must preserve the existing seller intake component.');
assertIncludes(homeWorth, 'JourneyCohesionPanel', '/home-worth must preserve shared journey cohesion continuity.');
assertIncludes(homeWorth, "label: 'Market Context', href: '/market'", '/home-worth cohesion panel must route to market context.');
assertIncludes(homeWorth, "label: 'Review Inventory', href: '/search'", '/home-worth cohesion panel must route to search inventory.');
assertIncludes(homeWorth, "label: 'Seller Strategy', href: '/sell'", '/home-worth cohesion panel must route to seller strategy.');

for (const expectedLens of ['readiness', 'gather', 'questions', 'factors', 'next']) {
  assertIncludes(helper, `lens: '${expectedLens}'`, `Seller Decision Workspace must include ${expectedLens} lens.`);
}

const workspace = buildSellerDecisionWorkspace({
  marketHref: '/market',
  searchHref: '/search',
  sellerHref: '/sell',
  requestHref: '#home-worth-request',
});

assert.equal(workspace.items.length, 5, 'Seller decision workspace must include five decision items.');
assert.match(workspace.orientation, /readiness/i, 'Seller workspace must frame readiness.');
assert.match(workspace.trustBoundary, /does not produce an instant value/i, 'Seller workspace trust boundary must avoid instant value output.');
assert(workspace.items.some((item) => item.lens === 'factors' && item.href === '/market'), 'Seller workspace must preserve market transition.');
assert(workspace.items.some((item) => item.lens === 'next' && item.href === '/search'), 'Seller workspace must preserve search transition.');

assertIncludes(sellerForm, "fetch('/api/valuation'", 'Seller intake submission must remain in existing form component.');
assertIncludes(valuationRoute, "type: 'strategy_intake'", 'Valuation backend must preserve strategy intake posture.');
assertIncludes(valuationRoute, 'emailSent: false', 'Valuation backend must preserve no-live-email status.');
assertNotIncludes(valuationRoute, 'optimizedValue', 'Valuation backend must not return unsupported value output.');
assertNotIncludes(valuationRoute, 'estimatedEquity', 'Valuation backend must not return unsupported equity output.');

assertIncludes(sprintDoc, 'Decision Experience Index v2.0', 'Sprint documentation must include DEI v2.0.');
assertIncludes(sprintDoc, 'Product Delta', 'Sprint documentation must include Product Delta.');
assertIncludes(sprintDoc, 'Total Score: 27 / 30', 'Sprint documentation must calculate total DEI score.');
assertIncludes(sprintDoc, 'Normalized Score: 4.5 / 5', 'Sprint documentation must calculate normalized DEI score.');
for (const dimension of ['Decision Clarity', 'Decision Confidence', 'Educational Value', 'Trust', 'Decision Readiness', 'Decision Efficiency']) {
  assertIncludes(sprintDoc, dimension, `DEI v2.0 documentation must score ${dimension}.`);
}
assertIncludes(sprintDoc, 'No AI', 'Sprint documentation must preserve AI exclusion.');
assertIncludes(sprintDoc, 'No automated valuation models', 'Sprint documentation must preserve AVM exclusion.');
assertIncludes(sprintDoc, 'No Mortgage Calculator', 'Sprint documentation must preserve mortgage-calculator exclusion.');
assertIncludes(sprintDoc, 'No Public Geographic Intelligence', 'Sprint documentation must preserve public GIS exclusion.');

const combinedRuntime = [helper, homeWorth, sellerForm].join('\n');
for (const forbidden of [
  'Estimated Value',
  'Zestimate',
  'instant valuation accuracy',
  'guaranteed value',
  'guaranteed price',
  'appraisal result',
  'OpenAI',
  'chatbot',
  'recommendation engine',
  'mortgage calculator',
  'preferred lender',
  'pre-approved',
  'document.cookie =',
  'localStorage.setItem',
  'sessionStorage.setItem',
  'GIS Sprint 9',
]) {
  assertNotIncludes(combinedRuntime, forbidden, `Seller Confidence v8 must not include unauthorized behavior or copy: ${forbidden}`);
}

assert.equal(
  packageJson.scripts?.['check:reie-seller-confidence-experience-v8'],
  'npm run worker:build && node dist/scripts/checkReieSellerConfidenceExperienceV8.js',
  'package.json must expose Seller Confidence v8 safety check.',
);

console.log('[reie-seller-confidence-experience-v8] ok: seller decision workspace, DEI v2.0, Product Delta, intake continuity, and prohibited activation exclusions verified.');
