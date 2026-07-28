import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildGuidedSearchDecisionSupport } from '../lib/search/guidedSearchDecisionSupport.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const helper = read('lib/search/guidedSearchDecisionSupport.ts');
const searchInterface = read('components/search/SearchInterface.tsx');
const searchControls = read('components/search/SearchControls.tsx');
const mapSidebar = read('components/maps/MapSidebar.tsx');
const propertyCard = read('components/PropertyCard.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const sprintDoc = read('docs/project-atlas/executive-library/REIE-8-GUIDED-SEARCH-INTELLIGENCE-V8.md');

assertIncludes(helper, 'buildGuidedSearchDecisionSupport', 'Guided Search v8 must expose a deterministic decision-support helper.');
assertIncludes(helper, "confidenceLevel: 'ready' | 'compare' | 'verify'", 'Guided Search v8 must classify result confidence without AI.');
assertIncludes(helper, 'Open the property page', 'Guided Search v8 must preserve search-to-property transition.');

assertIncludes(searchInterface, 'data-testid="reie-buyer-search-confidence-framework"', 'Search must preserve buyer confidence framework.');
assertIncludes(searchInterface, 'data-testid="reie-search-zero-result-recovery"', 'Search must preserve zero-result recovery.');
assertIncludes(searchInterface, 'data-testid="reie-search-degraded-status"', 'Search must preserve degraded search guidance.');
assertIncludes(searchControls, 'data-testid="reie-buyer-affordability-awareness"', 'Search must preserve affordability boundary copy.');
assertIncludes(searchControls, 'data-buyer-confidence-financing-workflow="false"', 'Search must not activate financing workflow.');

assertIncludes(mapSidebar, 'data-testid="reie-sidebar-v8-decision-portfolio"', 'Sidebar must expose Guided Search v8 decision portfolio.');
assertIncludes(mapSidebar, 'data-sidebar-v8-decision-mode', 'Sidebar must expose decision-mode metadata.');
assertIncludes(mapSidebar, 'data-sidebar-fallback-visual-count', 'Sidebar must expose governed fallback-media count.');
assertIncludes(mapSidebar, 'Use the list to compare alternatives', 'Sidebar must guide comparison before property detail.');

assertIncludes(propertyCard, 'data-testid="reie-property-card-v8-decision-path"', 'Property cards must expose v8 decision path.');
assertIncludes(propertyCard, 'data-property-card-v8-attention-label', 'Property cards must expose attention label metadata.');
assertIncludes(propertyCard, 'data-property-card-v8-compare', 'Property cards must expose compare prompt metadata.');
assertIncludes(propertyCard, 'data-property-card-v8-verify', 'Property cards must expose verify prompt metadata.');
assertIncludes(propertyCard, 'data-property-card-v8-next', 'Property cards must expose next-step metadata.');
assertIncludes(propertyCard, 'buildGuidedSearchDecisionSupport', 'Property cards must use shared decision-support helper.');

const guidedReview = buildGuidedSearchDecisionSupport({
  city: 'Boulder',
  price: 875000,
  beds: 3,
  baths: 2,
  propertyType: 'Residential',
  hasCoordinates: true,
  hasReviewFlag: true,
  hasFallbackVisual: false,
  reviewSignal: 'Plumbing Review',
});

assert.equal(guidedReview.confidenceLevel, 'verify', 'Review-flagged listing must require verification.');
assert.match(guidedReview.attentionReason, /deserves attention/i, 'Decision support must explain attention.');
assert.match(guidedReview.comparePrompt, /Compare/i, 'Decision support must include compare prompt.');
assert.match(guidedReview.verifyPrompt, /Verify/i, 'Decision support must include verify prompt.');
assert.match(guidedReview.nextStep, /Property Intelligence/i, 'Decision support must route deeper review to Property Intelligence.');

const guidedMapped = buildGuidedSearchDecisionSupport({
  city: 'Longmont',
  price: 650000,
  propertyType: 'Residential',
  hasCoordinates: true,
  hasReviewFlag: false,
  hasFallbackVisual: false,
});

assert.equal(guidedMapped.confidenceLevel, 'ready', 'Mapped non-flagged listing should remain ready for comparison.');
assert.match(guidedMapped.attentionReason, /Longmont/i, 'Mapped listing must include local place context.');

const combinedRuntime = [helper, searchInterface, searchControls, mapSidebar, propertyCard].join('\n');
for (const forbidden of [
  'OpenAI',
  'chatbot',
  'recommendation engine',
  'mortgage calculator',
  'preferred lender',
  'pre-approved',
  'document.cookie =',
  'localStorage.setItem',
  'sessionStorage.setItem',
  'provider activation',
  'GIS Sprint 9',
]) {
  assertNotIncludes(combinedRuntime, forbidden, `Guided Search v8 must not include unauthorized behavior or copy: ${forbidden}`);
}

assert(packageJson.scripts?.['check:reie-guided-search-intelligence-v8'], 'package.json must expose Guided Search v8 safety check.');
assertIncludes(sprintDoc, 'REIE_8_GUIDED_SEARCH_INTELLIGENCE_V8', 'Sprint documentation must record the governed identifier.');
assertIncludes(sprintDoc, 'No customer AI', 'Sprint documentation must preserve customer AI exclusion.');
assertIncludes(sprintDoc, 'No Public Geographic Intelligence', 'Sprint documentation must preserve public GIS exclusion.');
assertIncludes(sprintDoc, 'No Mortgage Calculator', 'Sprint documentation must preserve financing exclusion.');

console.log('[reie-guided-search-intelligence-v8] ok: decision support, result explanation, search-to-property continuity, and prohibited activation boundaries verified.');
