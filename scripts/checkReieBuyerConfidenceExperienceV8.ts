import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildBuyerDecisionWorkspace } from '../lib/buyerDecisionWorkspace.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const helper = read('lib/buyerDecisionWorkspace.ts');
const home = read('app/page.tsx');
const searchInterface = read('components/search/SearchInterface.tsx');
const propertyPage = read('app/properties/[id]/page.tsx');
const marketIndex = read('app/market/page.tsx');
const financingEducation = read('components/FinancingConfidenceEducation.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const sprintDoc = read('docs/project-atlas/executive-library/REIE-8-BUYER-CONFIDENCE-EXPERIENCE-V8.md');
const chatStart = read('docs/CHAT_START.md');

assertIncludes(helper, 'buildBuyerDecisionWorkspace', 'Buyer Confidence v8 must expose a deterministic buyer decision helper.');
assertIncludes(helper, "lens: 'readiness' | 'gather' | 'compare' | 'questions' | 'research' | 'next'", 'Buyer Confidence v8 must define the six buyer decision lenses.');
assertIncludes(helper, 'does not qualify a buyer', 'Buyer Confidence v8 must preserve no-qualification trust boundary.');
assertIncludes(helper, 'does not qualify a buyer, calculate affordability, use AI, activate telemetry, recommend properties, or start a lender workflow', 'Buyer Confidence v8 must document explicit trust boundaries.');

assertIncludes(home, 'buildBuyerDecisionWorkspace', 'Home must compose the v8 buyer decision helper.');
assertIncludes(home, 'data-testid="reie-buyer-v8-decision-workspace"', 'Home must expose the v8 Buyer Decision Workspace.');
assertIncludes(home, 'data-testid="reie-buyer-v8-decision-item"', 'Home must expose deterministic buyer decision items.');
assertIncludes(home, 'data-buyer-v8-ai="false"', 'Home must preserve no-AI boundary.');
assertIncludes(home, 'data-buyer-v8-accounts="false"', 'Home must preserve no-customer-account boundary.');
assertIncludes(home, 'data-buyer-v8-gis="false"', 'Home must preserve no-GIS boundary.');
assertIncludes(home, 'data-buyer-v8-telemetry="false"', 'Home must preserve telemetry inactive boundary.');
assertIncludes(home, 'data-buyer-v8-mortgage-calculator="false"', 'Home must preserve mortgage calculator exclusion.');
assertIncludes(home, 'data-buyer-v8-lender-workflow="false"', 'Home must preserve lender workflow exclusion.');
assertIncludes(home, 'data-buyer-v8-recommendation-engine="false"', 'Home must preserve recommendation engine exclusion.');
assertIncludes(home, 'href="/search"', 'Buyer Decision Workspace must preserve search continuity.');
assertIncludes(home, 'href="/market"', 'Buyer Decision Workspace must preserve market continuity.');
assertIncludes(home, 'href="/contact"', 'Buyer Decision Workspace must preserve advisor continuity.');
assertIncludes(home, "financingHref: '#buyer-financing-confidence'", 'Buyer Decision Workspace must preserve financing education transition.');
assertIncludes(home, '<FinancingConfidenceEducation surface="home" />', 'Home must preserve existing financing education composition.');

for (const expectedLens of ['readiness', 'gather', 'compare', 'questions', 'research', 'next']) {
  assertIncludes(helper, `lens: '${expectedLens}'`, `Buyer Decision Workspace must include ${expectedLens} lens.`);
}

const workspace = buildBuyerDecisionWorkspace({
  searchHref: '/search',
  marketHref: '/market',
  propertyHref: '/search',
  financingHref: '#buyer-financing-confidence',
  advisorHref: '/contact',
});

assert.equal(workspace.items.length, 6, 'Buyer decision workspace must include six decision items.');
assert.match(workspace.orientation, /readiness/i, 'Buyer workspace must frame readiness.');
assert.match(workspace.trustBoundary, /does not qualify a buyer/i, 'Buyer workspace must avoid buyer qualification output.');
assert(workspace.items.some((item) => item.lens === 'compare' && item.href === '/market'), 'Buyer workspace must preserve market transition.');
assert(workspace.items.some((item) => item.lens === 'next' && item.href === '/contact'), 'Buyer workspace must preserve advisor transition.');
assert(workspace.items.some((item) => item.lens === 'gather' && item.href === '#buyer-financing-confidence'), 'Buyer workspace must preserve financing education transition.');

assertIncludes(searchInterface, 'data-testid="reie-buyer-search-confidence-framework"', 'Search must preserve buyer confidence framework.');
assertIncludes(searchInterface, 'known-compare-verify-ask-next', 'Search must preserve Known / Compare / Verify / Ask / Next framework.');
assertIncludes(propertyPage, 'data-testid="reie-property-buyer-confidence-framework"', 'Property page must preserve buyer confidence framework.');
assertIncludes(propertyPage, 'data-testid="cep-property-decision-brief"', 'Property page must preserve Property Decision Brief.');
assertIncludes(marketIndex, 'data-testid="reie-market-buyer-confidence"', 'Market must preserve buyer confidence market guidance.');
assertIncludes(marketIndex, 'data-buyer-confidence-market-context="true"', 'Market must preserve market-to-buyer context marker.');
assertIncludes(financingEducation, 'data-financing-confidence-calculator="false"', 'Financing education must preserve no-calculator boundary.');
assertIncludes(financingEducation, 'data-financing-confidence-lender-workflow="false"', 'Financing education must preserve no-lender-workflow boundary.');

assertIncludes(sprintDoc, 'Decision Experience Index v2.0', 'Sprint documentation must include DEI v2.0.');
assertIncludes(sprintDoc, 'Decision Journey Certification', 'Sprint documentation must include Decision Journey Certification.');
assertIncludes(sprintDoc, 'Product Delta', 'Sprint documentation must include Product Delta.');
assertIncludes(sprintDoc, 'Total Score: 28 / 30', 'Sprint documentation must calculate total DEI score.');
assertIncludes(sprintDoc, 'Normalized Score: 4.7 / 5', 'Sprint documentation must calculate normalized DEI score.');
for (const dimension of ['Decision Clarity', 'Decision Confidence', 'Educational Value', 'Trust', 'Decision Readiness', 'Decision Efficiency']) {
  assertIncludes(sprintDoc, dimension, `DEI v2.0 documentation must score ${dimension}.`);
}
for (const continuity of ['Context Continuity', 'Educational Continuity', 'Trust Continuity', 'Decision Continuity']) {
  assertIncludes(sprintDoc, continuity, `Decision Journey Certification must evaluate ${continuity}.`);
}
assertIncludes(sprintDoc, 'No AI', 'Sprint documentation must preserve AI exclusion.');
assertIncludes(sprintDoc, 'No customer accounts', 'Sprint documentation must preserve account exclusion.');
assertIncludes(sprintDoc, 'No Mortgage Calculator', 'Sprint documentation must preserve mortgage-calculator exclusion.');
assertIncludes(sprintDoc, 'No lender workflow', 'Sprint documentation must preserve lender-workflow exclusion.');
assertIncludes(sprintDoc, 'No Public Geographic Intelligence', 'Sprint documentation must preserve public GIS exclusion.');
assertIncludes(chatStart, 'REIE_8_BUYER_CONFIDENCE_EXPERIENCE_V8', 'CHAT_START must record Buyer Confidence v8 governed identifier.');

const combinedRuntime = [helper, home, searchInterface, propertyPage, marketIndex, financingEducation].join('\n');
for (const forbidden of [
  'estimated monthly payment',
  'pre-approved',
  'preferred lender',
  'recommended lender',
  'instant affordability',
  'monthly payment calculator',
  'qualification score',
  'buyer score',
  'recommended property',
  'OpenAI',
  'chatbot',
  'document.cookie =',
  'localStorage.setItem',
  'sessionStorage.setItem',
  'GIS Sprint 9',
  'provider activation',
  'provider connection',
]) {
  assertNotIncludes(combinedRuntime, forbidden, `Buyer Confidence v8 must not include unauthorized behavior or copy: ${forbidden}`);
}

assert.equal(
  packageJson.scripts?.['check:reie-buyer-confidence-experience-v8'],
  'npm run worker:build && node dist/scripts/checkReieBuyerConfidenceExperienceV8.js',
  'package.json must expose Buyer Confidence v8 safety check.',
);

console.log('[reie-buyer-confidence-experience-v8] ok: buyer decision workspace, DEI v2.0, Decision Journey Certification, Product Delta, market continuity, financing education transition, and prohibited activation exclusions verified.');
