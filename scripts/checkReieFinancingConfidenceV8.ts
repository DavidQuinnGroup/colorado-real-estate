import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildFinancingDecisionWorkspace } from '../lib/financingDecisionWorkspace.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

function assertFileMissing(filePath: string) {
  assert(!fs.existsSync(filePath), `${filePath} must remain absent.`);
}

const helper = read('lib/financingDecisionWorkspace.ts');
const component = read('components/FinancingConfidenceEducation.tsx');
const home = read('app/page.tsx');
const searchInterface = read('components/search/SearchInterface.tsx');
const propertyPage = read('app/properties/[id]/page.tsx');
const marketIndex = read('app/market/page.tsx');
const buyerHelper = read('lib/buyerDecisionWorkspace.ts');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const sprintDoc = read('docs/project-atlas/executive-library/REIE-8-FINANCING-CONFIDENCE-V8.md');
const chatStart = read('docs/CHAT_START.md');

for (const forbiddenRoute of [
  'app/mortgage/page.tsx',
  'app/mortgages/page.tsx',
  'app/lender/page.tsx',
  'app/lenders/page.tsx',
  'app/financing/page.tsx',
  'app/prequalification/page.tsx',
]) {
  assertFileMissing(forbiddenRoute);
}

assertIncludes(helper, 'buildFinancingDecisionWorkspace', 'Financing Confidence v8 must expose a deterministic financing decision helper.');
assertIncludes(helper, "lens: 'readiness' | 'concepts' | 'terms' | 'documents' | 'questions' | 'research' | 'next'", 'Financing Confidence v8 must define seven financing decision lenses.');
assertIncludes(helper, 'does not calculate payments', 'Financing Confidence v8 must preserve no-payment-calculation boundary.');
assertIncludes(helper, 'does not calculate payments, qualify customers, recommend lenders, compare rates, use AI, activate telemetry, or start a lender workflow', 'Financing Confidence v8 must document explicit trust boundaries.');

assertIncludes(component, 'buildFinancingDecisionWorkspace', 'Financing component must compose the v8 decision helper.');
assertIncludes(component, 'data-testid="reie-financing-v8-decision-workspace"', 'Financing component must expose the v8 Financing Decision Workspace.');
assertIncludes(component, 'data-testid="reie-financing-v8-decision-item"', 'Financing component must expose deterministic financing decision items.');
assertIncludes(component, 'data-financing-v8-ai="false"', 'Financing component must preserve no-AI boundary.');
assertIncludes(component, 'data-financing-v8-customer-accounts="false"', 'Financing component must preserve no-customer-account boundary.');
assertIncludes(component, 'data-financing-v8-gis="false"', 'Financing component must preserve no-GIS boundary.');
assertIncludes(component, 'data-financing-v8-telemetry="false"', 'Financing component must preserve telemetry inactive boundary.');
assertIncludes(component, 'data-financing-v8-mortgage-calculator="false"', 'Financing component must preserve mortgage calculator exclusion.');
assertIncludes(component, 'data-financing-v8-loan-calculator="false"', 'Financing component must preserve loan calculator exclusion.');
assertIncludes(component, 'data-financing-v8-loan-application="false"', 'Financing component must preserve loan application exclusion.');
assertIncludes(component, 'data-financing-v8-lender-workflow="false"', 'Financing component must preserve lender workflow exclusion.');
assertIncludes(component, 'data-financing-v8-rate-shopping="false"', 'Financing component must preserve rate-shopping exclusion.');
assertIncludes(component, 'data-financing-v8-recommendation-engine="false"', 'Financing component must preserve recommendation engine exclusion.');
assertIncludes(component, 'href={item.href}', 'Financing workspace must render deterministic continuation links.');

for (const expectedLens of ['readiness', 'concepts', 'terms', 'documents', 'questions', 'research', 'next']) {
  assertIncludes(helper, `lens: '${expectedLens}'`, `Financing Decision Workspace must include ${expectedLens} lens.`);
}

const workspace = buildFinancingDecisionWorkspace({
  buyerHref: '#buyer-financing-confidence',
  searchHref: '/search',
  marketHref: '/market',
  advisorHref: '/contact',
});

assert.equal(workspace.items.length, 7, 'Financing decision workspace must include seven decision items.');
assert.match(workspace.orientation, /readiness/i, 'Financing workspace must frame readiness.');
assert.match(workspace.trustBoundary, /does not calculate payments/i, 'Financing workspace trust boundary must avoid payment calculations.');
assert(workspace.items.some((item) => item.lens === 'readiness' && item.href === '#buyer-financing-confidence'), 'Financing workspace must preserve buyer transition.');
assert(workspace.items.some((item) => item.lens === 'concepts' && item.href === '/search'), 'Financing workspace must preserve search transition.');
assert(workspace.items.some((item) => item.lens === 'research' && item.href === '/market'), 'Financing workspace must preserve market transition.');
assert(workspace.items.some((item) => item.lens === 'questions' && item.href === '/contact'), 'Financing workspace must preserve advisor transition.');

for (const [source, marker] of [
  [home, 'surface="home"'],
  [searchInterface, 'surface="search"'],
  [propertyPage, 'surface="property"'],
  [marketIndex, 'surface="market"'],
] as const) {
  assertIncludes(source, marker, `Financing education must remain integrated on ${marker}.`);
}

assertIncludes(buyerHelper, 'Review financing education', 'Buyer Confidence v8 must preserve transition to financing education.');
assertIncludes(home, 'data-testid="reie-buyer-v8-decision-workspace"', 'Homepage must preserve Buyer Decision Workspace.');
assertIncludes(searchInterface, 'data-testid="reie-buyer-search-confidence-framework"', 'Search must preserve buyer confidence framework.');
assertIncludes(propertyPage, 'data-testid="reie-property-buyer-confidence-framework"', 'Property page must preserve buyer confidence framework.');
assertIncludes(marketIndex, 'data-testid="reie-market-buyer-confidence"', 'Market must preserve buyer confidence framework.');

assertIncludes(sprintDoc, 'Decision Experience Index v2.0', 'Sprint documentation must include DEI v2.0.');
assertIncludes(sprintDoc, 'Decision Journey Certification v2', 'Sprint documentation must include Decision Journey Certification v2.');
assertIncludes(sprintDoc, 'Product Delta', 'Sprint documentation must include Product Delta.');
assertIncludes(sprintDoc, 'Total Score: 29 / 30', 'Sprint documentation must calculate total DEI score.');
assertIncludes(sprintDoc, 'Normalized Score: 4.8 / 5', 'Sprint documentation must calculate normalized DEI score.');
assertIncludes(sprintDoc, 'Total Journey Score: 28 / 30', 'Sprint documentation must calculate total journey score.');
assertIncludes(sprintDoc, 'Normalized Journey Score: 4.7 / 5', 'Sprint documentation must calculate normalized journey score.');
for (const dimension of ['Decision Clarity', 'Decision Confidence', 'Educational Value', 'Trust', 'Decision Readiness', 'Decision Efficiency']) {
  assertIncludes(sprintDoc, dimension, `DEI v2.0 documentation must score ${dimension}.`);
}
for (const continuity of ['Context Continuity', 'Educational Continuity', 'Trust Continuity', 'Decision Continuity', 'Decision Momentum', 'Decision Efficiency']) {
  assertIncludes(sprintDoc, continuity, `Decision Journey Certification v2 must evaluate ${continuity}.`);
}
assertIncludes(sprintDoc, 'No AI', 'Sprint documentation must preserve AI exclusion.');
assertIncludes(sprintDoc, 'No Mortgage Calculator', 'Sprint documentation must preserve mortgage-calculator exclusion.');
assertIncludes(sprintDoc, 'No loan calculator', 'Sprint documentation must preserve loan-calculator exclusion.');
assertIncludes(sprintDoc, 'No loan applications', 'Sprint documentation must preserve application exclusion.');
assertIncludes(sprintDoc, 'No lender workflow', 'Sprint documentation must preserve lender-workflow exclusion.');
assertIncludes(sprintDoc, 'No rate shopping', 'Sprint documentation must preserve rate-shopping exclusion.');
assertIncludes(sprintDoc, 'No Public Geographic Intelligence', 'Sprint documentation must preserve public GIS exclusion.');
assertIncludes(chatStart, 'REIE_8_FINANCING_CONFIDENCE_V8', 'CHAT_START must record Financing Confidence v8 governed identifier.');

const combinedRuntime = [helper, component, home, searchInterface, propertyPage, marketIndex, buyerHelper].join('\n');
for (const forbidden of [
  'calculateMonthlyPayment',
  'calculateLoan',
  'amortization',
  'prequal',
  'pre-qual',
  'affiliate',
  'preferred lender',
  'recommended lender',
  'instant approval',
  'guaranteed payment',
  'you can afford',
  'monthly payment calculator',
  'qualification score',
  'buyer score',
  'document.cookie =',
  'localStorage.setItem',
  'sessionStorage.setItem',
  'fetch("https://',
  "fetch('https://",
  'OpenAI',
  'chatbot',
  'GIS Sprint 9',
  'provider activation',
  'provider connection',
]) {
  assertNotIncludes(combinedRuntime, forbidden, `Financing Confidence v8 must not include unauthorized behavior or copy: ${forbidden}`);
}

assert.equal(
  packageJson.scripts?.['check:reie-financing-confidence-v8'],
  'npm run worker:build && node dist/scripts/checkReieFinancingConfidenceV8.js',
  'package.json must expose Financing Confidence v8 safety check.',
);

console.log('[reie-financing-confidence-v8] ok: financing decision workspace, DEI v2.0, Decision Journey Certification v2, Product Delta, buyer-to-financing continuity, and prohibited activation exclusions verified.');
