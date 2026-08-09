import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

function assertPanelLink(source: string, label: string, href: string, destination: string, context: string) {
  assertIncludes(source, `label: '${label}'`, `${context} must render ${label}.`);
  assertIncludes(source, `href: '${href}'`, `${context} must route ${label} to ${href}.`);
  assertIncludes(source, `destination: '${destination}'`, `${context} must identify ${label} as ${destination}.`);
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const cohesionPanel = read('components/JourneyCohesionPanel.tsx');
const publicNavigation = read('components/PublicNavigation.tsx');
const continueDecision = read('components/ContinueYourDecision.tsx');
const homepage = read('app/page.tsx');
const searchInterface = read('components/search/SearchInterface.tsx');
const cityMarket = read('app/market/[city]/page.tsx');
const marketIndex = read('app/market/page.tsx');
const propertyPage = read('app/properties/[id]/page.tsx');
const neighborhoodPage = read('app/market/[city]/[slug]/page.tsx');
const neighborhoodProduct = read('components/NeighborhoodProduct3Experience.tsx');
const buyerPage = read('app/buy/page.tsx');
const sellerPage = read('app/sell/page.tsx');
const homeWorthPage = read('app/home-worth/page.tsx');
const financingEducation = read('components/FinancingConfidenceEducation.tsx');
const grandPlanPage = read('app/grand-plan/page.tsx');
const contactPage = read('app/contact/page.tsx');
const decisionGuidePlatform = read('lib/decisionGuidePlatform.ts');

assert.equal(
  packageJson.scripts?.['check:reie-product-experience-cohesion-wave'],
  'npm run worker:build && node dist/scripts/checkReieProductExperienceCohesionWave.js',
  'package.json must expose the REIE Product Experience cohesion wave check.',
);
assertIncludes(tsconfig, 'scripts/checkReieProductExperienceCohesionWave.ts', 'Worker build must include the cohesion wave check.');

for (const boundary of [
  'data-reie-product-cohesion-ai="false"',
  'data-reie-product-cohesion-personalization="false"',
  'data-reie-product-cohesion-telemetry="false"',
  'data-reie-product-cohesion-gis="false"',
  'data-reie-product-cohesion-provider-activation="false"',
  'data-reie-product-cohesion-ranking="false"',
  'data-reie-product-cohesion-valuation="false"',
]) {
  assertIncludes(cohesionPanel, boundary, `Cohesion panel boundary missing: ${boundary}`);
}

for (const runtimeActivation of [
  'useEffect',
  'fetch(',
  'XMLHttpRequest',
  'navigator.sendBeacon',
  'localStorage',
  'sessionStorage',
  'document.cookie',
]) {
  assertNotIncludes(cohesionPanel, runtimeActivation, `Cohesion panel must not activate runtime behavior: ${runtimeActivation}`);
}

for (const route of ['/search', '/buy', '/market', '/home-worth', '/sell', '/grand-plan', '/about', '/contact']) {
  assertIncludes(publicNavigation, `href: '${route}'`, `Public navigation must preserve ${route}.`);
}

for (const [source, marker, context] of [
  [homepage, 'data-testid="home-djx-continuity"', 'homepage'],
  [searchInterface, 'data-testid="cep-navigation-search-journey"', 'search'],
  [marketIndex, 'data-testid="market-djx-continuity"', 'market root'],
  [cityMarket, 'buildDecisionGuideContinuityLinks', 'city market'],
  [propertyPage, 'data-testid="property-djx-continuity"', 'property'],
  [neighborhoodPage, 'data-testid="neighborhood-djx-continuity"', 'neighborhood'],
] as const) {
  assertIncludes(source, marker, `${context} must preserve certified Decision Journey continuity.`);
}

for (const [source, surface] of [
  [buyerPage, 'buyer'],
  [sellerPage, 'seller'],
  [homeWorthPage, 'home-worth'],
  [grandPlanPage, 'grand-plan'],
  [contactPage, 'contact'],
] as const) {
  assertIncludes(source, 'JourneyCohesionPanel', `${surface} must use the shared cohesion panel.`);
  assertIncludes(source, `surface="${surface}"`, `${surface} must expose its cohesion surface identity.`);
}

assertPanelLink(buyerPage, 'Search Homes', '/search', 'search', 'Buyer page');
assertPanelLink(buyerPage, 'Financing Guidance', '/buy#buyer-financing-confidence', 'financing', 'Buyer page');
assertPanelLink(buyerPage, 'Advisory Guidance', '/contact#advisory-readiness', 'advisory', 'Buyer page');

assertPanelLink(sellerPage, 'Home Worth', '/home-worth', 'home-worth', 'Seller page');
assertPanelLink(sellerPage, 'Market Context', '/market', 'market', 'Seller page');
assertPanelLink(sellerPage, 'Advisory Guidance', '/contact', 'advisory', 'Seller page');

assertPanelLink(homeWorthPage, 'Market Context', '/market', 'market', 'Home-worth page');
assertPanelLink(homeWorthPage, 'Review Inventory', '/search', 'search', 'Home-worth page');
assertPanelLink(homeWorthPage, 'Seller Strategy', '/sell', 'seller', 'Home-worth page');

assertPanelLink(grandPlanPage, 'Search Homes', '/search', 'search', 'Grand Plan page');
assertPanelLink(grandPlanPage, 'Buyer Guidance', '/buy', 'buyer', 'Grand Plan page');
assertPanelLink(grandPlanPage, 'Advisory Guidance', '/contact', 'advisory', 'Grand Plan page');

assertPanelLink(contactPage, 'Search Homes', '/search', 'search', 'Contact page');
assertPanelLink(contactPage, 'Grand Plan', '/grand-plan', 'grand-plan', 'Contact page');
assertPanelLink(contactPage, 'Home Worth', '/home-worth', 'home-worth', 'Contact page');

for (const [label, href, destination] of [
  ['Buyer Guidance', '/buy', 'buyer-guidance'],
  ['Seller Guidance', '/sell', 'seller-guidance'],
  ['Financing Guidance', '/buy#financing-confidence', 'financing-confidence'],
  ['Grand Plan', '/grand-plan', 'grand-plan'],
  ['Advisory Guidance', '/contact', 'advisory'],
] as const) {
  assertIncludes(decisionGuidePlatform, `{ label: '${label}', href: '${href}', destination: '${destination}' }`, `LDI continuity must preserve ${label}.`);
}
assertIncludes(decisionGuidePlatform, "destination: 'city-search'", 'LDI city search destination identity must remain explicit.');

for (const source of [
  homepage,
  searchInterface,
  cityMarket,
  marketIndex,
  propertyPage,
  neighborhoodPage,
  neighborhoodProduct,
  buyerPage,
  sellerPage,
  homeWorthPage,
  financingEducation,
  grandPlanPage,
  contactPage,
  cohesionPanel,
  continueDecision,
]) {
  for (const forbidden of [
    'best neighborhood',
    'safest neighborhood',
    'school ranking',
    'safety ranking',
    'guaranteed results',
    'promise a guaranteed outcome',
    'forecast appreciation',
    'make an investment recommendation',
    'personalized recommendation',
    'automatically personalizes',
    'AI-powered recommendation',
    'automated valuation conclusion',
    'preferred lender',
    'mortgage calculator',
  ]) {
    assertNotIncludes(source, forbidden, `Cohesion wave must not introduce prohibited claim: ${forbidden}`);
  }
}

for (const prohibitedFilePattern of [
  'app/api/',
  'prisma/schema.prisma',
  'data/searchPages.ts',
  'lib/cities.ts',
  'lib/coloradoDecisionGuideRegistry.ts',
]) {
  assertNotIncludes(
    read('docs/project-atlas/executive-library/REIE-STRATEGIC-PRIORITY-REVIEW-POST-LOCAL-DECISION-INTELLIGENCE-PHASE-2.md'),
    `implementation changed ${prohibitedFilePattern}`,
    `Strategic review must not be rewritten to imply ${prohibitedFilePattern} changes.`,
  );
}

console.log('[reie-product-experience-cohesion-wave] ok: shared cohesion panel, journey labels, protected boundaries, and certified continuity contracts verified.');
