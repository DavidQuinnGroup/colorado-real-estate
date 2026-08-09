import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { buildPropertyProduct31Model } from '../lib/propertyProduct31.js';
import {
  PROPERTY_INTELLIGENCE_DEEPENING_STATUS,
  SELLER_INTELLIGENCE_ADVANCEMENT_STATUS,
  buildSellerIntelligenceAdvancement,
} from '../lib/sellerPropertyIntelligenceAdvancement.js';
import { getReieSourceRegistry } from '../lib/sourceRegistry.js';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const sellerPage = read('app/sell/page.tsx');
const propertyExperience = read('components/PropertyProduct31Experience.tsx');
const propertyModel = read('lib/propertyProduct31.ts');
const advancementModel = read('lib/sellerPropertyIntelligenceAdvancement.ts');
const sourceRegistry = getReieSourceRegistry();

assert.equal(
  packageJson.scripts?.['check:seller-property-intelligence-advancement'],
  'npm run worker:build && node dist/scripts/checkSellerPropertyIntelligenceAdvancement.js',
  'package.json must expose the Seller + Property Intelligence Advancement check.',
);
assertIncludes(tsconfig, 'scripts/checkSellerPropertyIntelligenceAdvancement.ts', 'Worker build must include the advancement check.');
assertIncludes(tsconfig, 'lib/sellerPropertyIntelligenceAdvancement.ts', 'Worker build must include the shared advancement model.');

assertIncludes(propertyModel, 'buildPropertyIntelligenceDeepening', 'Property Product 3.1 must consume the additive deepening model.');
assertIncludes(propertyExperience, 'data-testid="property-intelligence-deepening"', 'Property UI must render the deepening section.');
assertIncludes(propertyExperience, 'data-testid="property-intelligence-history-event"', 'Property UI must render history events.');
assertIncludes(propertyExperience, 'data-testid="property-intelligence-derived-fact"', 'Property UI must render derived facts.');
assertIncludes(propertyExperience, 'data-testid="property-intelligence-source-trace"', 'Property UI must render source traceability.');
assertIncludes(propertyExperience, 'data-testid="property-intelligence-seller-context"', 'Property UI must connect property intelligence to seller context.');
assertIncludes(propertyExperience, 'data-property-intelligence-source-registry="true"', 'Property UI must expose source-registry traceability.');

for (const propertyBoundary of [
  'data-property-intelligence-valuation={String(model.deepening.protectedBoundaries.valuation)}',
  'data-property-intelligence-appraisal={String(model.deepening.protectedBoundaries.appraisal)}',
  'data-property-intelligence-listing-price-recommendation={String(model.deepening.protectedBoundaries.listingPriceRecommendation)}',
  'data-property-intelligence-sale-prediction={String(model.deepening.protectedBoundaries.salePrediction)}',
  'data-property-intelligence-provider-activation={String(model.deepening.protectedBoundaries.providerActivation)}',
  'data-property-intelligence-assessor-retrieval={String(model.deepening.protectedBoundaries.assessorRetrieval)}',
  'data-property-intelligence-bcod-activation={String(model.deepening.protectedBoundaries.bcodActivation)}',
  'data-property-intelligence-tax-retrieval={String(model.deepening.protectedBoundaries.taxRetrieval)}',
  'data-property-intelligence-permit-retrieval={String(model.deepening.protectedBoundaries.permitRetrieval)}',
  'data-property-intelligence-persistence={String(model.deepening.protectedBoundaries.persistence)}',
  'data-property-intelligence-telemetry={String(model.deepening.protectedBoundaries.telemetry)}',
  'data-property-intelligence-customer-data-mutation={String(model.deepening.protectedBoundaries.customerDataMutation)}',
]) {
  assertIncludes(propertyExperience, propertyBoundary, `Property deepening boundary missing: ${propertyBoundary}`);
}

assertIncludes(sellerPage, 'buildSellerIntelligenceAdvancement', 'Seller page must use the shared seller intelligence model.');
assertIncludes(sellerPage, 'data-testid="seller-intelligence-advancement"', 'Seller page must render the advancement section.');
assertIncludes(sellerPage, 'data-testid="seller-intelligence-dimension"', 'Seller page must render seller intelligence dimensions.');
assertIncludes(sellerPage, 'data-testid="seller-intelligence-source-state"', 'Seller page must render seller source states.');
assertIncludes(sellerPage, 'data-testid="seller-intelligence-continuity-link"', 'Seller page must render cross-journey continuity links.');
assertIncludes(sellerPage, 'data-seller-intelligence-source-registry="true"', 'Seller page must expose source-registry traceability.');

for (const sellerBoundary of [
  'data-seller-intelligence-valuation-certainty={String(sellerIntelligence.protectedBoundaries.valuationCertainty)}',
  'data-seller-intelligence-listing-price-recommendation={String(sellerIntelligence.protectedBoundaries.listingPriceRecommendation)}',
  'data-seller-intelligence-sale-prediction={String(sellerIntelligence.protectedBoundaries.salePrediction)}',
  'data-seller-intelligence-hidden-state-transfer={String(sellerIntelligence.protectedBoundaries.hiddenStateTransfer)}',
  'data-seller-intelligence-protected-class-inference={String(sellerIntelligence.protectedBoundaries.protectedClassInference)}',
  'data-seller-intelligence-source-activation={String(sellerIntelligence.protectedBoundaries.sourceActivation)}',
  'data-seller-intelligence-persistence={String(sellerIntelligence.protectedBoundaries.persistence)}',
  'data-seller-intelligence-telemetry={String(sellerIntelligence.protectedBoundaries.telemetry)}',
  'data-seller-intelligence-customer-data-mutation={String(sellerIntelligence.protectedBoundaries.customerDataMutation)}',
]) {
  assertIncludes(sellerPage, sellerBoundary, `Seller advancement boundary missing: ${sellerBoundary}`);
}

const readyModel = buildPropertyProduct31Model({
  address: '100 Main St',
  city: 'Boulder',
  state: 'CO',
  neighborhood: 'Mapleton Hill',
  propertyType: 'Residential',
  status: 'Active',
  price: 1200000,
  sqft: 2400,
  beds: 4,
  baths: 3,
  yearBuilt: 1976,
  lotSize: 0.22,
  updatedAt: new Date('2026-08-08T12:00:00.000Z'),
  lastIntelligenceSync: new Date('2026-08-08T13:00:00.000Z'),
  photoCount: 8,
  relatedListings: [
    {
      id: 'related-1',
      address: '102 Main St',
      city: 'Boulder',
      state: 'CO',
      neighborhood: 'Mapleton Hill',
      price: 1275000,
      beds: 4,
      baths: 3,
      sqft: 2600,
      status: 'Active',
    },
  ],
});

assert.equal(readyModel.deepening.status, PROPERTY_INTELLIGENCE_DEEPENING_STATUS);
assert.equal(readyModel.profile.length, 3, 'Property Product 3.1 profile count must remain unchanged.');
assert.equal(readyModel.dna.length, 4, 'Property Product 3.1 DNA count must remain unchanged.');
assert.equal(readyModel.confidence.facets.length, 4, 'Property Product 3.1 confidence count must remain unchanged.');
assert(readyModel.deepening.history.length >= 4, 'Deepening must expose property history context.');
assert(readyModel.deepening.derivedFacts.some((fact) => fact.key === 'PRICE_PER_SQUARE_FOOT' && fact.state === 'reie-derived'), 'Deepening must expose deterministic price-per-square-foot context.');
assert(readyModel.deepening.derivedFacts.some((fact) => fact.key === 'EVIDENCE_COMPLETENESS'), 'Deepening must expose evidence completeness.');
assert(readyModel.deepening.sellerContext.length >= 3, 'Deepening must carry seller decision context.');
assert(readyModel.deepening.sourceTrace.some((source) => source.sourceId === 'SRC-MLS-LISTING-DATA' && source.state === 'ACTIVE_AUTHORIZED' && source.claimEligible), 'MLS source must remain active and claim eligible.');
assert(readyModel.deepening.sourceTrace.some((source) => source.sourceId === 'SRC-BOULDER-COUNTY-ASSESSOR' && source.state === 'AWAITING_PROVIDER_CONFIRMATION' && !source.claimEligible), 'Assessor must remain awaiting provider confirmation.');
assert(readyModel.deepening.sourceTrace.some((source) => source.sourceId === 'SRC-BCOD-ADDRESS-POINTS' && source.state === 'BLOCKED_NOT_AUTHORIZED' && !source.claimEligible), 'BCOD Address Points must remain blocked.');
assert(readyModel.deepening.sourceTrace.some((source) => source.sourceId === 'SRC-BCOD-PARK-BOUNDARIES' && source.state === 'BLOCKED_NOT_AUTHORIZED' && !source.claimEligible), 'BCOD Park Boundaries must remain blocked.');

for (const boundary of Object.values(readyModel.deepening.protectedBoundaries)) {
  assert.equal(boundary, false, 'Property deepening protected boundaries must remain false.');
}

const sellerModel = buildSellerIntelligenceAdvancement();
assert.equal(sellerModel.status, SELLER_INTELLIGENCE_ADVANCEMENT_STATUS);
assert.deepEqual(
  sellerModel.dimensions.map((dimension) => dimension.key),
  [
    'PROPERTY_EVIDENCE',
    'MARKET_POSITION_CONTEXT',
    'PROPERTY_PREPARATION',
    'TIMING',
    'SELLING_PROCESS_READINESS',
    'BUY_SELL_INTERDEPENDENCE',
  ],
  'Seller intelligence must expose the authorized decision dimensions.',
);
assert(sellerModel.continuityLinks.some((link) => link.href === '/sources'), 'Seller intelligence must link to Source Registry.');
assert(sellerModel.continuityLinks.some((link) => link.href === '/grand-plan'), 'Seller intelligence must link to Grand Plan.');
assert(sellerModel.continuityLinks.some((link) => link.href === '/buy#financing-readiness'), 'Seller intelligence must link to Financing Readiness.');
assert(sellerModel.continuityLinks.some((link) => link.href === '/contact#advisory-readiness'), 'Seller intelligence must link to Advisory Readiness.');
assert(sellerModel.sourceStates.some((source) => source.sourceId === 'SRC-BOULDER-COUNTY-ASSESSOR' && source.state === 'AWAITING_PROVIDER_CONFIRMATION'), 'Seller intelligence must preserve assessor provider-confirmation state.');
assert(sellerModel.sourceStates.some((source) => source.sourceId === 'SRC-BCOD-ADDRESS-POINTS' && source.state === 'BLOCKED_NOT_AUTHORIZED'), 'Seller intelligence must preserve BCOD Address Points block.');
assert(sellerModel.sourceStates.some((source) => source.sourceId === 'SRC-BCOD-PARK-BOUNDARIES' && source.state === 'BLOCKED_NOT_AUTHORIZED'), 'Seller intelligence must preserve BCOD Park Boundaries block.');

for (const boundary of Object.values(sellerModel.protectedBoundaries)) {
  assert.equal(boundary, false, 'Seller intelligence protected boundaries must remain false.');
}

assert.equal(sourceRegistry.protectedBoundaries.providerActivation, false);
assert.equal(sourceRegistry.protectedBoundaries.assessorRetrieval, false);
assert.equal(sourceRegistry.protectedBoundaries.taxRetrieval, false);
assert.equal(sourceRegistry.protectedBoundaries.permitRetrieval, false);
assert.equal(sourceRegistry.protectedBoundaries.bcodActivation, false);
assert.equal(sourceRegistry.protectedBoundaries.persistence, false);
assert.equal(sourceRegistry.protectedBoundaries.telemetry, false);
assert.equal(sourceRegistry.protectedBoundaries.customerDataMutation, false);

for (const forbiddenRuntime of [
  'fetch(',
  'PrismaClient',
  'createClient(',
  'process.env',
  'localStorage',
  'sessionStorage',
  'document.cookie',
]) {
  assertNotIncludes(advancementModel, forbiddenRuntime, `Shared advancement model must not use runtime/provider/persistence primitive: ${forbiddenRuntime}`);
}

for (const forbiddenCopy of [
  'guaranteed home value',
  'appraisal conclusion',
  'seller is desperate',
  'overpriced',
  'deal opportunity',
  'investment score',
  'fit score',
  'financial-readiness score',
  'automated valuation certainty',
  'protected-class inference is true',
  'data-seller-intelligence-hidden-state-transfer="true"',
  'data-property-intelligence-provider-activation="true"',
]) {
  assertNotIncludes([propertyExperience, propertyModel, advancementModel].join('\n'), forbiddenCopy, `Advancement model and property surface must not include prohibited claim or activation copy: ${forbiddenCopy}`);
}

console.log('Seller + Property Intelligence Advancement validation passed.');
