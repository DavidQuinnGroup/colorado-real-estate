import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildOfferPreparationReadiness } from '../lib/offerPreparationReadiness.js';
import { buildPropertyProduct31Model } from '../lib/propertyProduct31.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const modelSource = read('lib/offerPreparationReadiness.ts');
const componentSource = read('components/OfferPreparationPanel.tsx');
const propertyPage = read('app/properties/[id]/page.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');

assert.equal(
  packageJson.scripts?.['check:offer-preparation-readiness'],
  'npm run worker:build && node dist/scripts/checkOfferPreparationReadiness.js',
  'package.json must expose offer preparation readiness validation.',
);
assertIncludes(tsconfig, '"scripts/checkOfferPreparationReadiness.ts"', 'Worker build must include offer preparation readiness validation.');

for (const stage of ['UNDERSTAND', 'COMPARE', 'VERIFY', 'PREPARE', 'NEXT_STEP']) {
  assertIncludes(modelSource, stage, `Offer preparation model missing stage ${stage}.`);
}

for (const requiredSurfaceMarker of [
  'data-testid="offer-preparation-readiness"',
  'data-testid="offer-preparation-stage"',
  'data-testid="offer-preparation-stage-link"',
  'data-testid="offer-preparation-continuity-link"',
  'data-testid="offer-preparation-source-trust-boundary"',
  'data-offer-preparation-missing-evidence="verification-required"',
  'data-offer-preparation-offer-price={String(model.prohibitedOutputs.offerPrice)}',
  'data-offer-preparation-bid-recommendation={String(model.prohibitedOutputs.bidRecommendation)}',
  'data-offer-preparation-acceptance-prediction={String(model.prohibitedOutputs.acceptancePrediction)}',
  'data-offer-preparation-offer-drafting={String(model.prohibitedOutputs.contractLanguage || model.prohibitedOutputs.offerForm)}',
  'data-offer-preparation-offer-submission={String(model.prohibitedOutputs.offerSubmission)}',
  'data-offer-preparation-valuation={String(model.prohibitedOutputs.valuation)}',
  'data-offer-preparation-ranking-winner={String(model.prohibitedOutputs.rankingWinner)}',
  'data-offer-preparation-suitability={String(model.prohibitedOutputs.suitabilityConclusion)}',
  'data-offer-preparation-investment={String(model.prohibitedOutputs.investmentConclusion)}',
  'data-offer-preparation-legal-advice={String(model.prohibitedOutputs.legalAdvice)}',
  'data-offer-preparation-tax-advice={String(model.prohibitedOutputs.taxAdvice)}',
  'data-offer-preparation-lender-advice={String(model.prohibitedOutputs.lenderAdvice)}',
]) {
  assertIncludes(componentSource, requiredSurfaceMarker, `Offer preparation surface missing ${requiredSurfaceMarker}.`);
}

for (const requiredPageMarker of [
  "import OfferPreparationPanel from '@/components/OfferPreparationPanel';",
  "import { buildOfferPreparationReadiness } from '@/lib/offerPreparationReadiness';",
  'const offerPreparationReadiness = buildOfferPreparationReadiness({',
  '<OfferPreparationPanel model={offerPreparationReadiness} />',
  'data-offer-preparation-runtime-scope="app/properties/[id]/page.tsx"',
  'data-offer-preparation-existing-evidence-only="true"',
  'data-offer-preparation-push-authorized="false"',
  'data-offer-preparation-deploy-authorized="false"',
]) {
  assertIncludes(propertyPage, requiredPageMarker, `Property page missing ${requiredPageMarker}.`);
}

const productModel = buildPropertyProduct31Model({
  address: '100 Main St',
  city: 'Boulder',
  state: 'CO',
  zip: '80302',
  neighborhood: 'Mapleton Hill',
  propertyType: 'Detached',
  status: 'Active',
  price: 1000000,
  beds: 4,
  baths: 3,
  sqft: 2500,
  lotSize: 0.2,
  yearBuilt: 1970,
  relatedListings: [
    {
      id: 'comparison-1',
      address: '200 Main St',
      city: 'Boulder',
      state: 'CO',
      neighborhood: 'Whittier',
      price: 850000,
      beds: 3,
      baths: 2,
      sqft: 1900,
      status: 'Active',
    },
  ],
});

const readiness = buildOfferPreparationReadiness({
  propertyLabel: '100 Main St',
  searchHref: '/search',
  compareHref: '/compare',
  financingHref: '/buy#financing-readiness',
  grandPlanHref: '/grand-plan',
  sourcesHref: '/sources',
  inquiryHref: '#property-contact',
  productModel,
});

assert.equal(readiness.status, 'OFFER_PREPARATION_READINESS_IMPLEMENTED');
assert.equal(readiness.stages.length, 5, 'Offer preparation must expose the five-stage preparation contract.');
assert.deepEqual(
  readiness.stages.map((stage) => stage.key),
  ['UNDERSTAND', 'COMPARE', 'VERIFY', 'PREPARE', 'NEXT_STEP'],
  'Offer preparation stages must preserve the authorized sequence.',
);
assert(readiness.stages.some((stage) => stage.key === 'VERIFY' && stage.evidenceState === 'VERIFICATION REQUIRED'), 'Missing evidence must become verification required.');
assert(readiness.verificationDomains.includes('Public record evidence'), 'Public record evidence must remain verification-bound.');
assert(readiness.verificationDomains.includes('Tax evidence'), 'Tax evidence must remain verification-bound.');
assert(readiness.verificationDomains.includes('Permit evidence'), 'Permit evidence must remain verification-bound.');
assert.equal(readiness.continuityLinks.length, 6, 'Offer preparation must link Search, Compare, financing, Grand Plan, Sources, and Property Inquiry.');
assert(readiness.continuityLinks.some((link) => link.label === 'Search' && link.href === '/search'));
assert(readiness.continuityLinks.some((link) => link.label === 'Compare' && link.href === '/compare'));
assert(readiness.continuityLinks.some((link) => link.label === 'Financing readiness' && link.href === '/buy#financing-readiness'));
assert(readiness.continuityLinks.some((link) => link.label === 'Grand Plan' && link.href === '/grand-plan'));
assert(readiness.continuityLinks.some((link) => link.label === 'Sources' && link.href === '/sources'));
assert(readiness.continuityLinks.some((link) => link.label === 'Property Inquiry' && link.href === '#property-contact'));
assert.deepEqual(readiness.sourceTrustBoundaries, [
  'MORE AVAILABLE DATA DOES NOT MEAN A BETTER PROPERTY',
  'SOURCE AVAILABILITY DOES NOT EQUAL PROPERTY QUALITY',
  'MISSING COUNTY DATA DOES NOT EQUAL NEGATIVE PROPERTY CONDITION',
]);

for (const [key, value] of Object.entries(readiness.prohibitedOutputs)) {
  assert.equal(value, false, `Offer preparation prohibited output must remain false: ${key}`);
}

for (const [key, value] of Object.entries(readiness.protectedBoundaries)) {
  assert.equal(value, false, `Offer preparation protected boundary must remain false: ${key}`);
}

for (const forbidden of [
  'you should offer',
  'recommended bid',
  'probability of acceptance',
  'winning property',
  'best property',
  'good deal',
  'bad deal',
  'investment return',
  'school ranking',
  'safety ranking',
  'localStorage.',
  'sessionStorage.',
  'navigator.sendBeacon',
  'fetch(',
  'prisma.',
  'createClient(',
]) {
  assertNotIncludes([modelSource, componentSource].join('\n'), forbidden, `Offer preparation must not include ${forbidden}.`);
}

console.log(
  '[offer-preparation-readiness] ok: five stages, evidence limits, verification required posture, continuity links, fair-housing/privacy boundaries, and no transaction-output protections verified.',
);
