import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildBuyerDecisionIntelligenceModel,
  buildPlaceIntelligenceDeepeningModel,
  BUYER_INTELLIGENCE_ADVANCEMENT_STATUS,
  BUYER_PLACE_INTELLIGENCE_ADVANCEMENT_STATUS,
  PLACE_INTELLIGENCE_DEEPENING_STATUS,
} from '../lib/buyerPlaceIntelligenceAdvancement.js';
import { neighborhoods } from '../lib/neighborhoods.js';
import { getReieSourceRegistry } from '../lib/sourceRegistry.js';

const BUYER_LANES = [
  'PROPERTY_READINESS',
  'COMPARISON_READINESS',
  'FINANCING_ASSUMPTIONS',
  'DUE_DILIGENCE',
  'PLACE_MARKET_CONTEXT',
  'PROFESSIONAL_HANDOFF',
] as const;

const PLACE_DIMENSIONS = [
  'PLACE_IDENTITY',
  'GEOGRAPHIC_CONTEXT',
  'MARKET_EVIDENCE',
  'BUILT_ENVIRONMENT',
  'RELATED_PLACE_CONTEXT',
  'DECISION_QUESTIONS',
] as const;

function read(path: string) {
  return readFileSync(path, 'utf8');
}

function assertIncludes(source: string, expected: string, message: string) {
  assert(source.includes(expected), message);
}

function assertNotIncludes(source: string, forbidden: string, message: string) {
  assert(!source.includes(forbidden), message);
}

function assertFalseBoundaries(boundaries: Record<string, boolean>, label: string) {
  for (const [key, value] of Object.entries(boundaries)) {
    assert.equal(value, false, `${label} protected boundary ${key} must remain false.`);
  }
}

function assertBuyerModel() {
  const model = buildBuyerDecisionIntelligenceModel();

  assert.equal(model.status, BUYER_INTELLIGENCE_ADVANCEMENT_STATUS, 'Buyer Intelligence status must be explicit.');
  assert.deepEqual(
    model.lanes.map((lane) => lane.key),
    BUYER_LANES,
    'Buyer Intelligence must expose exactly the authorized six lanes.',
  );
  assert.equal(model.lanes.length, 6, 'Buyer Intelligence lane count must remain six.');
  assertFalseBoundaries(model.protectedBoundaries, 'Buyer Intelligence');

  for (const lane of model.lanes) {
    assert(lane.fact.length > 20, `${lane.key} must include a fact.`);
    assert(lane.meaning.length > 20, `${lane.key} must include meaning.`);
    assert(lane.openQuestion.endsWith('?'), `${lane.key} must include an open question.`);
    assert(lane.verificationAction.length > 20, `${lane.key} must include a verification action.`);
    assert(lane.href.startsWith('/') || lane.href.startsWith('#'), `${lane.key} must expose a visible continuation href.`);
    assert(lane.sourceIds.length >= 1, `${lane.key} must identify source posture.`);
  }

  for (const destination of ['search', 'property', 'compare', 'buy', 'financing', 'market', 'grand-plan', 'advisory']) {
    assert(
      model.continuityLinks.some((link) => link.destination === destination),
      `Buyer continuity must include ${destination}.`,
    );
  }

  const assessorRecord = model.sourceRecords.find((record) => record.sourceId === 'SRC-BOULDER-COUNTY-ASSESSOR');
  assert(assessorRecord, 'Buyer model must expose Boulder County Assessor as verification-gated source posture.');
  assert.equal(assessorRecord.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION', 'Boulder County Assessor must remain awaiting confirmation.');
  assert.equal(assessorRecord.productionActivationState, 'AWAITING_PROVIDER_CONFIRMATION', 'Boulder County Assessor must not be activated.');
  assert.equal(assessorRecord.claimEligible, false, 'Boulder County Assessor must remain claim-ineligible.');
}

function assertPlaceModel() {
  const neighborhood = neighborhoods.find((candidate) => candidate.city === 'Boulder') ?? neighborhoods[0];
  assert(neighborhood, 'Representative neighborhood fixture must exist.');

  const model = buildPlaceIntelligenceDeepeningModel({
    neighborhood,
    inventoryState: { count: 0, source: 'fallback' },
    evidenceState: 'complete',
    marketLabels: {
      inventory: 'Search ready',
      competitiveness: 'Review context',
      timing: 'Current context',
    },
    cityMarketHref: '/market/boulder-co-housing-market',
    searchHref: `/search?neighborhood=${encodeURIComponent(neighborhood.name)}`,
    relatedPlaceNames: ['Whittier', 'Newlands', 'Table Mesa'],
  });

  assert.equal(model.status, PLACE_INTELLIGENCE_DEEPENING_STATUS, 'Place Intelligence status must be explicit.');
  assert.deepEqual(
    model.dimensions.map((dimension) => dimension.key),
    PLACE_DIMENSIONS,
    'Place Intelligence must expose exactly the authorized six dimensions.',
  );
  assert.equal(model.dimensions.length, 6, 'Place Intelligence dimension count must remain six.');
  assertFalseBoundaries(model.protectedBoundaries, 'Place Intelligence');

  for (const dimension of model.dimensions) {
    assert(dimension.fact.length > 20, `${dimension.key} must include a fact.`);
    assert(dimension.meaning.length > 20, `${dimension.key} must include meaning.`);
    assert(dimension.investigate.length > 20, `${dimension.key} must include an investigation prompt.`);
    assert(dimension.sourcePosture.length > 20, `${dimension.key} must include source posture.`);
    assert(dimension.href.startsWith('/') || dimension.href.startsWith('#'), `${dimension.key} must expose a visible continuation href.`);
    assert(dimension.sourceIds.length >= 1, `${dimension.key} must identify source posture.`);
  }
}

function assertRouteContracts() {
  const buyerPage = read('app/buy/page.tsx');
  const neighborhoodPage = read('app/market/[city]/[slug]/page.tsx');
  const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
  const workerConfig = read('tsconfig.worker.json');
  const modelSource = read('lib/buyerPlaceIntelligenceAdvancement.ts');
  const implementationRecord = read(
    'docs/project-atlas/executive-library/REIE-BUYER-PLACE-INTELLIGENCE-ADVANCEMENT-IMPLEMENTATION.md',
  );
  const chatStart = read('docs/CHAT_START.md');

  for (const phrase of [
    'buildBuyerDecisionIntelligenceModel',
    'data-testid="buyer-intelligence-advancement"',
    'data-buyer-intelligence-status={buyerDecisionIntelligence.status}',
    'data-buyer-intelligence-lane-count={buyerDecisionIntelligence.lanes.length}',
    'data-testid="buyer-intelligence-lane"',
    'Fact',
    'Meaning',
    'Open question',
    'Verification / next action',
    'data-buyer-intelligence-hidden-state-transfer={String(buyerDecisionIntelligence.protectedBoundaries.hiddenStateTransfer)}',
    'data-buyer-intelligence-provider-activation={String(buyerDecisionIntelligence.protectedBoundaries.providerActivation)}',
    'data-buyer-intelligence-api-change={String(buyerDecisionIntelligence.protectedBoundaries.apiChange)}',
    'Boulder County Assessor stays awaiting provider confirmation',
    'data-testid="buyer-intelligence-continuity"',
  ]) {
    assertIncludes(buyerPage, phrase, `Buyer page must include ${phrase}`);
  }

  for (const phrase of [
    'buildPlaceIntelligenceDeepeningModel',
    'data-testid="place-intelligence-deepening"',
    'data-place-intelligence-status={placeIntelligenceDeepening.status}',
    'data-place-intelligence-dimension-count={placeIntelligenceDeepening.dimensions.length}',
    'data-testid="place-intelligence-dimension"',
    'data-place-intelligence-school-ranking={String(placeIntelligenceDeepening.protectedBoundaries.schoolRanking)}',
    'data-place-intelligence-crime-steering={String(placeIntelligenceDeepening.protectedBoundaries.crimeSteering)}',
    'data-place-intelligence-socioeconomic-sorting={String(',
    'placeIntelligenceDeepening.protectedBoundaries.socioeconomicSorting',
    'data-place-intelligence-place-ordering={String(placeIntelligenceDeepening.protectedBoundaries.placeOrderingConclusion)}',
    'data-place-intelligence-fair-housing-proxy={String(placeIntelligenceDeepening.protectedBoundaries.fairHousingProxy)}',
    'data-place-intelligence-public-gis={String(placeIntelligenceDeepening.protectedBoundaries.publicGisActivation)}',
    'data-place-intelligence-provider-activation={String(placeIntelligenceDeepening.protectedBoundaries.providerActivation)}',
    'data-place-intelligence-api-change={String(placeIntelligenceDeepening.protectedBoundaries.apiChange)}',
    '<NeighborhoodProduct3Experience model={neighborhoodProduct3Model} />',
    '<FAQSchema faqs={neighborhoodFaqs} pageUrl={canonicalUrl} />',
    '<NearbyNeighborhoods city={neighborhood.city} currentSlug={neighborhood.slug} />',
  ]) {
    assertIncludes(neighborhoodPage, phrase, `Neighborhood page must include ${phrase}`);
  }

  assert.equal(
    packageJson.scripts?.['check:buyer-place-intelligence-advancement'],
    'npm run worker:build && node dist/scripts/checkBuyerPlaceIntelligenceAdvancement.js',
    'package.json must register the Buyer + Place Intelligence advancement check.',
  );
  assertIncludes(workerConfig, 'scripts/checkBuyerPlaceIntelligenceAdvancement.ts', 'Worker build must include Buyer + Place check.');
  assertIncludes(workerConfig, 'lib/buyerPlaceIntelligenceAdvancement.ts', 'Worker build must include Buyer + Place model.');

  for (const phrase of [
    BUYER_PLACE_INTELLIGENCE_ADVANCEMENT_STATUS,
    'BUYER_PLACE_INTELLIGENCE_ADVANCEMENT_LOCALLY_CERTIFIED',
    'Buyer Intelligence Advancement',
    'Neighborhood / Place Intelligence Deepening',
    'No provider/source activation',
    'No BCOD activation',
    'Boulder County Assessor remains `AWAITING_PROVIDER_CONFIRMATION`',
    'npm run check:buyer-place-intelligence-advancement',
  ]) {
    assertIncludes(implementationRecord, phrase, `Implementation record must include ${phrase}`);
  }
  assertIncludes(chatStart, 'BUYER_PLACE_INTELLIGENCE_ADVANCEMENT_LOCALLY_CERTIFIED', 'CHAT_START must record local certification status.');

  for (const forbidden of [
    'localStorage',
    'sessionStorage',
    'document.cookie',
    'navigator.sendBeacon',
    'gtag(',
    'analytics(',
    'trackEvent',
    'fetch(',
    'Prisma.',
    'prisma.',
    'recommendedProperty',
    'recommendedNeighborhood',
    'schoolRating',
    'safetyScore',
    'crimeScore',
    'investmentScore',
    'appreciationForecast',
    'approvalProbability',
    'qualificationScore',
    'affordabilityScore',
    'buyingPowerScore',
    'hiddenSuitabilityScore',
  ]) {
    assertNotIncludes(modelSource, forbidden, `Buyer + Place model must not introduce protected runtime or scoring behavior: ${forbidden}`);
  }
}

function assertSourceRegistryContainment() {
  const registry = getReieSourceRegistry();
  const boulderAssessor = registry.records.find((record) => record.sourceId === 'SRC-BOULDER-COUNTY-ASSESSOR');
  const bcodAddress = registry.records.find((record) => record.sourceId === 'SRC-BCOD-ADDRESS-POINTS');
  const bcodParks = registry.records.find((record) => record.sourceId === 'SRC-BCOD-PARK-BOUNDARIES');

  assert(boulderAssessor, 'Boulder County Assessor source record must exist.');
  assert.equal(boulderAssessor.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
  assert.equal(boulderAssessor.productionActivationState, 'AWAITING_PROVIDER_CONFIRMATION');
  assert.equal(boulderAssessor.claimEligible, false);

  assert(bcodAddress, 'BCOD Address Points source record must exist.');
  assert.equal(bcodAddress.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
  assert.equal(bcodAddress.claimEligible, false);

  assert(bcodParks, 'BCOD Park Boundaries source record must exist.');
  assert.equal(bcodParks.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
  assert.equal(bcodParks.claimEligible, false);
}

assertBuyerModel();
assertPlaceModel();
assertRouteContracts();
assertSourceRegistryContainment();

console.log(
  '[buyer-place-intelligence-advancement] ok: Buyer lanes, Place dimensions, Source Registry posture, fair-housing boundaries, and protected-system containment verified.',
);
