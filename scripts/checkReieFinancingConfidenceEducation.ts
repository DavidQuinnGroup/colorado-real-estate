import assert from 'node:assert/strict';
import fs from 'node:fs';

const governedStatus = 'REIE_7_1_SPRINT_4_FINANCING_CONFIDENCE_EDUCATION_BASELINE';

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
  'components/FinancingConfidenceEducation.tsx',
  'app/buy/page.tsx',
  'app/page.tsx',
  'components/search/SearchInterface.tsx',
  'components/search/SearchControls.tsx',
  'app/properties/[id]/page.tsx',
  'components/internal-links/PropertyLinks.tsx',
  'components/RelatedPropertyLinks.tsx',
  'app/market/page.tsx',
  'app/market/[city]/page.tsx',
  'app/market/[city]/[slug]/page.tsx',
] as const;

for (const filePath of runtimeFiles) assertFileExists(filePath);

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

const component = read('components/FinancingConfidenceEducation.tsx');
const buyerPage = read('app/buy/page.tsx');
const home = read('app/page.tsx');
const searchInterface = read('components/search/SearchInterface.tsx');
const searchControls = read('components/search/SearchControls.tsx');
const propertyPage = read('app/properties/[id]/page.tsx');
const propertyLinks = read('components/internal-links/PropertyLinks.tsx');
const relatedPropertyLinks = read('components/RelatedPropertyLinks.tsx');
const marketIndex = read('app/market/page.tsx');
const cityMarket = read('app/market/[city]/page.tsx');
const neighborhoodMarket = read('app/market/[city]/[slug]/page.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const sprintDoc = read('docs/project-atlas/executive-library/REIE-7.1-SPRINT-4-FINANCING-CONFIDENCE-EDUCATION.md');
const chatStart = read('docs/CHAT_START.md');

assertIncludes(component, 'data-testid="reie-financing-confidence-education"', 'Financing Confidence component must expose test marker.');
assertIncludes(component, 'data-financing-confidence-education="true"', 'Financing Confidence component must mark education active.');
assertIncludes(component, 'data-financing-confidence-advice="false"', 'Financing Confidence component must prohibit advice.');
assertIncludes(component, 'data-financing-confidence-workflow="false"', 'Financing Confidence component must prohibit workflow activation.');
assertIncludes(component, 'data-financing-confidence-calculator="false"', 'Financing Confidence component must prohibit calculator activation.');
assertIncludes(component, 'data-financing-confidence-lender-workflow="false"', 'Financing Confidence component must prohibit lender workflow.');
assertIncludes(component, 'data-financing-confidence-ai="false"', 'Financing Confidence component must prohibit AI activation.');
assertIncludes(component, 'data-financing-confidence-gis="false"', 'Financing Confidence component must prohibit GIS activation.');
assertIncludes(component, 'data-financing-confidence-provider-activation="false"', 'Financing Confidence component must prohibit provider activation.');

for (const requiredCopy of [
  'This is educational guidance only.',
  'loan qualification',
  'personalized financial advice',
  'rate predictions',
  'payment quotes',
  'lender recommendations',
  'affordability conclusions',
  'Affordability factors',
  'Monthly cost components',
  'Cash to close',
  'Rate sensitivity',
  'Questions for a lender',
  'Questions for your real estate advisor',
]) {
  assertIncludes(component, requiredCopy, `Financing education must include required copy: ${requiredCopy}`);
}

for (const [source, marker] of [
  [buyerPage, 'surface="buy"'],
  [searchInterface, 'surface="search"'],
  [propertyPage, 'surface="property"'],
  [marketIndex, 'surface="market"'],
  [cityMarket, 'surface="city-market"'],
  [neighborhoodMarket, 'surface="neighborhood-market"'],
] as const) {
  assertIncludes(source, marker, `Financing education must be integrated on ${marker}.`);
}

assertIncludes(home, "href: '/buy'", 'Home must route financing education through the dedicated Buy destination.');

assertIncludes(searchControls, 'data-testid="reie-buyer-affordability-awareness"', 'Search budget awareness must remain present.');
assertIncludes(searchControls, 'cash to close', 'Search budget guidance must include cash-to-close education.');
assertIncludes(searchControls, 'escrow', 'Search budget guidance must include escrow education.');
assertIncludes(searchControls, 'rate assumptions', 'Search budget guidance must include rate-assumption education.');
assertIncludes(searchControls, 'data-buyer-confidence-financing-workflow="false"', 'Search budget guidance must not activate financing workflow.');
assertIncludes(propertyLinks, 'key={`${link.status}-${link.href}-${link.label}-${index}`}', 'Property authority links must use stable unique keys.');
assertIncludes(relatedPropertyLinks, 'key={`${link.status}-${link.href}-${link.label}-${index}`}', 'Related property authority links must use stable unique keys.');

const combinedRuntime = runtimeFiles.map((filePath) => read(filePath)).join('\n');

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
  'document.cookie =',
  'localStorage.setItem',
  'sessionStorage.setItem',
  'fetch("https://',
  "fetch('https://",
  'OpenAI',
  'GIS Sprint 9',
  'provider activation',
  'provider connection',
]) {
  assertNotIncludes(combinedRuntime, forbidden, `Financing Confidence runtime must not include unauthorized text or behavior: ${forbidden}`);
}

assert(packageJson.scripts?.['check:reie-financing-confidence-education'], 'package.json must expose the Sprint 4 Financing Confidence safety check.');
assertIncludes(sprintDoc, governedStatus, 'Sprint 4 documentation must record the governed implementation identifier.');
assertIncludes(sprintDoc, 'Deployment remains prohibited', 'Sprint 4 documentation must preserve deployment prohibition.');
assertIncludes(sprintDoc, 'No Mortgage Calculator', 'Sprint 4 documentation must preserve calculator prohibition.');
assertIncludes(sprintDoc, 'No lender workflow', 'Sprint 4 documentation must preserve lender-workflow prohibition.');
assertIncludes(chatStart, governedStatus, 'CHAT_START must record the Sprint 4 governed implementation identifier.');
assertIncludes(chatStart, 'Deployment remains prohibited', 'CHAT_START must preserve deployment prohibition.');

console.log('[reie-financing-confidence-education] ok: education renders on home/search/property/market surfaces; no calculator, lender workflow, AI, GIS, provider activation, storage, telemetry, or financing workflow detected.');
