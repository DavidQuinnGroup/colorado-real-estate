import assert from 'node:assert/strict';
import fs from 'node:fs';

const governedStatus = 'REIE_7_1_SPRINT_3_BUYER_CONFIDENCE_EXPERIENCE_BASELINE';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

function assertFileExists(filePath: string) {
  assert(fs.existsSync(filePath), `${filePath} must exist.`);
}

function assertFileMissing(filePath: string) {
  assert(!fs.existsSync(filePath), `${filePath} must remain absent.`);
}

const runtimeFiles = [
  'app/buy/page.tsx',
  'app/page.tsx',
  'components/search/SearchInterface.tsx',
  'components/search/SearchControls.tsx',
  'components/maps/SelectedPropertyDrawer.tsx',
  'app/properties/[id]/page.tsx',
  'app/market/page.tsx',
  'app/market/[city]/page.tsx',
  'app/market/[city]/[slug]/page.tsx',
] as const;

for (const filePath of runtimeFiles) assertFileExists(filePath);

for (const forbiddenRoute of [
  'app/mortgage/page.tsx',
  'app/lender/page.tsx',
  'app/lenders/page.tsx',
  'app/sundance/page.tsx',
]) {
  assertFileMissing(forbiddenRoute);
}

const buyerPage = read('app/buy/page.tsx');
const home = read('app/page.tsx');
const searchInterface = read('components/search/SearchInterface.tsx');
const searchControls = read('components/search/SearchControls.tsx');
const selectedDrawer = read('components/maps/SelectedPropertyDrawer.tsx');
const propertyPage = read('app/properties/[id]/page.tsx');
const marketIndex = read('app/market/page.tsx');
const cityMarket = read('app/market/[city]/page.tsx');
const neighborhoodMarket = read('app/market/[city]/[slug]/page.tsx');
const inquiryForm = read('components/PropertyInquiryForm.tsx');
const navigation = read('components/PublicNavigation.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const sprintDoc = read('docs/project-atlas/executive-library/REIE-7.1-SPRINT-3-BUYER-CONFIDENCE-EXPERIENCE.md');
const chatStart = read('docs/CHAT_START.md');

assertIncludes(home, "href: '/buy'", 'Home must route buyer education to the dedicated Buy destination.');
assertIncludes(buyerPage, 'data-testid="reie-buyer-confidence-orientation"', 'Buy page must include buyer confidence orientation.');
assertIncludes(buyerPage, 'data-testid="reie-buyer-confidence-path"', 'Buy page must expose buyer confidence path.');
assertIncludes(buyerPage, 'data-reie-sprint-3-buyer-confidence="true"', 'Buy page must expose governed Sprint 3 marker.');
for (const step of ['orient', 'compare', 'verify', 'decide']) {
  assertIncludes(buyerPage, `data-buyer-confidence-step={item.step.toLowerCase()}`, 'Buy page buyer confidence steps must be data-marked.');
  assertIncludes(buyerPage, step[0].toUpperCase() + step.slice(1), `Buy page buyer confidence path must include ${step}.`);
}

assertIncludes(searchInterface, 'data-testid="reie-buyer-search-confidence-framework"', 'Search must include buyer confidence framework.');
assertIncludes(searchInterface, 'known-compare-verify-ask-next', 'Search must expose Known / Compare / Verify / Ask / Next framework.');
assertIncludes(searchInterface, 'Open the property page before submitting focused questions.', 'Search must guide buyers to property review before contact.');
assertIncludes(searchInterface, 'data-testid="reie-search-mobile-list-toggle"', 'Search mobile list toggle must remain present.');
assertIncludes(searchInterface, 'data-testid="reie-search-mobile-map-toggle"', 'Search mobile map toggle must remain present.');
assertIncludes(searchInterface, 'data-testid="reie-search-zero-result-recovery"', 'Search zero-result recovery must remain present.');
assertIncludes(searchInterface, 'data-testid="reie-search-degraded-status"', 'Search degraded-service guidance must remain present.');

assertIncludes(searchControls, 'data-testid="reie-buyer-affordability-awareness"', 'Search controls must include affordability awareness.');
assertIncludes(searchControls, 'price range as a search boundary, not an affordability conclusion', 'Budget copy must avoid affordability claims.');
assertIncludes(searchControls, 'data-buyer-confidence-financing-workflow="false"', 'Search budget awareness must not activate financing workflow.');
assertIncludes(searchControls, 'buildSearchParams', 'Search parameter construction must remain present.');

assertIncludes(selectedDrawer, 'data-testid="reie-selected-property-buyer-confidence"', 'Selected-property drawer must include buyer-confidence continuity.');
assertIncludes(selectedDrawer, 'view-property-before-contact', 'Selected-property drawer must guide property review before contact.');
assertIncludes(selectedDrawer, 'data-testid="reie-selected-property-detail-link"', 'Selected-property detail link must remain present.');
assertIncludes(selectedDrawer, 'data-testid="reie-selected-property-inquiry-link"', 'Selected-property inquiry link must remain present.');

assertIncludes(propertyPage, 'data-testid="reie-property-buyer-confidence-framework"', 'Property page must include buyer confidence framework.');
assertIncludes(propertyPage, 'BUYER_CONFIDENCE_FRAMEWORK', 'Property page must define buyer confidence framework.');
assertIncludes(propertyPage, 'data-testid="cep-property-decision-brief"', 'Property Decision Brief must remain present.');
assertIncludes(propertyPage, 'data-testid="reie-property-financial-intelligence"', 'Property financial context must remain present.');
assertIncludes(propertyPage, 'affordability guidance', 'Property page must preserve no-affordability-guidance boundary.');
assertIncludes(propertyPage, 'data-buyer-confidence-ai="false"', 'Property page must expose no-AI marker.');
assertIncludes(propertyPage, 'data-buyer-confidence-gis="false"', 'Property page must expose no-GIS marker.');
assertIncludes(propertyPage, 'data-buyer-confidence-provider-activation="false"', 'Property page must expose no-provider marker.');

assertIncludes(marketIndex, 'data-testid="reie-market-buyer-confidence"', 'Market index must include buyer confidence market guidance.');
assertIncludes(marketIndex, 'data-buyer-confidence-forecast="false"', 'Market index must avoid forecast claims.');
assertIncludes(cityMarket, 'data-testid="reie-city-buyer-confidence"', 'City market page must include buyer confidence guidance.');
assertIncludes(cityMarket, 'data-buyer-confidence-neighborhood-guidance="true"', 'City market page must connect neighborhood context.');
assertIncludes(neighborhoodMarket, 'data-testid="reie-neighborhood-buyer-confidence"', 'Neighborhood page must include buyer confidence guidance.');
assertIncludes(neighborhoodMarket, 'data-buyer-confidence-neighborhood-context="true"', 'Neighborhood page must mark neighborhood context.');

assertIncludes(inquiryForm, "label: 'Schedule Tour'", 'Property inquiry schedule-tour option must remain present.');
assertIncludes(inquiryForm, "label: 'Researching'", 'Property inquiry research option must remain present.');
assertIncludes(inquiryForm, "fetch('/api/property-inquiry'", 'Property inquiry must preserve existing endpoint.');
assertIncludes(navigation, "{ label: 'Search', href: '/search' }", 'Public navigation must preserve search route.');
assertIncludes(navigation, "{ label: 'Market', href: '/market' }", 'Public navigation must preserve market route.');

for (const source of [buyerPage, searchInterface, propertyPage, marketIndex, cityMarket, neighborhoodMarket]) {
  assertIncludes(source, 'data-buyer-confidence-ai="false"', 'Buyer confidence surfaces must expose no-AI markers.');
  assertIncludes(source, 'data-buyer-confidence-gis="false"', 'Buyer confidence surfaces must expose no-GIS markers.');
  assertIncludes(source, 'data-buyer-confidence-provider-activation="false"', 'Buyer confidence surfaces must expose no-provider markers.');
}

const combinedRuntime = runtimeFiles.map((filePath) => read(filePath)).join('\n');
for (const forbidden of [
  'estimated monthly payment',
  'pre-approved',
  'preferred lender',
  'recommended lender',
  'instant affordability',
  'mortgage calculator',
  'document.cookie =',
  'localStorage.setItem',
  'sessionStorage.setItem',
  'OpenAI',
  'chatbot',
  'GIS Sprint 9',
  'provider activation',
  'provider connection',
]) {
  assertNotIncludes(combinedRuntime, forbidden, `Buyer confidence runtime must not include unauthorized text or behavior: ${forbidden}`);
}

assert(packageJson.scripts?.['check:reie-buyer-confidence-experience'], 'package.json must expose the Sprint 3 buyer confidence safety check.');
assertIncludes(sprintDoc, governedStatus, 'Sprint 3 documentation must record the governed implementation identifier.');
assertIncludes(sprintDoc, 'Deployment remains prohibited', 'Sprint 3 documentation must preserve deployment prohibition.');
assertIncludes(chatStart, governedStatus, 'CHAT_START must record the Sprint 3 governed implementation identifier.');
assertIncludes(chatStart, 'Deployment remains prohibited', 'CHAT_START must preserve deployment prohibition.');

console.log('[reie-buyer-confidence-experience] ok: buyer confidence orientation, search/property/market continuity, affordability awareness, no AI/GIS/provider activation, no financing workflow, and documentation boundaries verified.');
