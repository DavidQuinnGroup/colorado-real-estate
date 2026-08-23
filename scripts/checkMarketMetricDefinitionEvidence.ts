import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  MARKET_DOM_BASES,
  MARKET_METRIC_ALLOWED_USES,
  MARKET_METRIC_CONTRACT_PROTECTED_BOUNDARIES,
  MARKET_METRIC_DEFINITION_EVIDENCE_STATUS,
  MARKET_METRIC_DEFINITIONS,
  MARKET_METRIC_PROHIBITED_INTERPRETATIONS,
  MARKET_METRIC_SEMANTIC_STATUSES,
  MARKET_PRICE_BASES,
  compareMarketMetricObservations,
  displayMarketMetricLabel,
  evaluateMarketMetricUse,
} from '../lib/marketMetricDefinitionEvidence';
import {
  CERTIFIED_MARKET_METRIC_DEFINITION_FIXTURE,
  MARKET_METRIC_DEFINITION_EVIDENCE_FIXTURES as fixtures,
} from '../lib/marketMetricDefinitionEvidenceFixtures';

const source = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

assert.equal(MARKET_METRIC_DEFINITION_EVIDENCE_STATUS, 'PROJECT_ATLAS_MARKET_METRIC_DEFINITION_AND_EVIDENCE_CONTRACT_MVV');
for (const state of ['CERTIFIED', 'PARTIALLY_DEFINED', 'SEMANTICS_UNRESOLVED', 'NOT_ADMITTED', 'DEPRECATED']) assert.ok(MARKET_METRIC_SEMANTIC_STATUSES.includes(state as never));
for (const basis of ['LISTING_DOM', 'AVERAGE_DOM', 'MEDIAN_DOM', 'CDOM', 'AVERAGE_CDOM', 'MEDIAN_CDOM', 'OTHER_DEFINED_DOM_MEASURE', 'UNRESOLVED_DOM_MEASURE']) assert.ok(MARKET_DOM_BASES.includes(basis as never));
for (const basis of ['CURRENT_LIST_PRICE', 'ORIGINAL_LIST_PRICE', 'MEDIAN_LIST_PRICE', 'AVERAGE_LIST_PRICE', 'CLOSE_PRICE', 'MEDIAN_CLOSE_PRICE', 'AVERAGE_CLOSE_PRICE', 'PRICE_PER_SQUARE_FOOT', 'OTHER_DEFINED_PRICE_MEASURE', 'UNRESOLVED_PRICE_MEASURE']) assert.ok(MARKET_PRICE_BASES.includes(basis as never));
for (const use of ['DISPLAY_RAW_OBSERVATION', 'AGENT_PREPARATION', 'AUDIENCE_UPDATE_PREPARATION', 'HISTORICAL_COMPARISON', 'DERIVED_CALCULATION', 'COMPARATIVE_REPORTING', 'PUBLIC_DISPLAY']) assert.ok(MARKET_METRIC_ALLOWED_USES.includes(use as never));
for (const prohibition of ['NO_TREND_INFERENCE', 'NO_FORECAST', 'NO_BUYER_LEVERAGE_INFERENCE', 'NO_SELLER_LEVERAGE_INFERENCE', 'NO_AFFORDABILITY_INFERENCE', 'NO_PROPERTY_VALUATION', 'NO_PRICING_RECOMMENDATION', 'NO_NEGOTIATION_RECOMMENDATION']) assert.ok(MARKET_METRIC_PROHIBITED_INTERPRETATIONS.includes(prohibition as never));

const inventory = MARKET_METRIC_DEFINITIONS.INVENTORY_SIGNAL;
const dom = MARKET_METRIC_DEFINITIONS.DAYS_ON_MARKET_SIGNAL;
const price = MARKET_METRIC_DEFINITIONS.PRICE_SIGNAL;
for (const definition of [inventory, dom, price]) {
  assert.equal(definition.semanticStatus, 'SEMANTICS_UNRESOLVED');
  assert.equal(definition.sourceMethodologyReference, null);
  assert.equal(definition.historicalComparisonStatus, 'METADATA_REQUIRED');
  assert.equal(definition.allowedUses.includes('HISTORICAL_COMPARISON'), false);
  assert.equal(definition.allowedUses.includes('PUBLIC_DISPLAY'), false);
  assert.ok(definition.prohibitedInterpretations.includes('NO_TREND_INFERENCE'));
}
assert.equal(dom.domBasis, 'UNRESOLVED_DOM_MEASURE');
assert.equal(price.priceBasis, 'UNRESOLVED_PRICE_MEASURE');
assert.equal(displayMarketMetricLabel(dom), 'Days-on-market signal (semantics unresolved)');
assert.equal(displayMarketMetricLabel(price), 'Price signal (semantics unresolved)');
assert.doesNotMatch(displayMarketMetricLabel(dom), /average|median/i);
assert.doesNotMatch(displayMarketMetricLabel(price), /median (list|sold)|close price/i);

assert.deepEqual(evaluateMarketMetricUse(inventory, fixtures.unresolvedInventory, 'AGENT_PREPARATION'), { allowed: true, reason: 'ALLOWED' });
assert.deepEqual(evaluateMarketMetricUse(inventory, fixtures.unresolvedInventory, 'PUBLIC_DISPLAY'), { allowed: false, reason: 'USE_NOT_ADMITTED' });
assert.deepEqual(evaluateMarketMetricUse(inventory, fixtures.unresolvedDom, 'AGENT_PREPARATION'), { allowed: false, reason: 'OBSERVATION_DEFINITION_MISMATCH' });

const unresolvedDom = compareMarketMetricObservations(dom, fixtures.unresolvedDom, dom, fixtures.unresolvedDom);
assert.equal(unresolvedDom.state, 'COMPARABLE_WITH_LIMITATIONS');
assert.ok(unresolvedDom.reasons.includes('DEFINITION_HISTORICAL_COMPARISON_NOT_CERTIFIED'));
const unresolvedPrice = compareMarketMetricObservations(price, fixtures.unresolvedPrice, price, fixtures.unresolvedPrice);
assert.equal(unresolvedPrice.state, 'COMPARABLE_WITH_LIMITATIONS');
assert.ok(unresolvedPrice.reasons.includes('DEFINITION_HISTORICAL_COMPARISON_NOT_CERTIFIED'));

assert.deepEqual(compareMarketMetricObservations(CERTIFIED_MARKET_METRIC_DEFINITION_FIXTURE, fixtures.compatibleLeft, CERTIFIED_MARKET_METRIC_DEFINITION_FIXTURE, fixtures.compatibleRight), { state: 'COMPARABLE', reasons: [] });
const incompatible = compareMarketMetricObservations(CERTIFIED_MARKET_METRIC_DEFINITION_FIXTURE, fixtures.compatibleLeft, price, fixtures.incompatibleDefinition);
assert.equal(incompatible.state, 'NOT_COMPARABLE');
assert.ok(incompatible.reasons.includes('METRIC_DEFINITION_MISMATCH'));
assert.equal(compareMarketMetricObservations(CERTIFIED_MARKET_METRIC_DEFINITION_FIXTURE, fixtures.compatibleLeft, CERTIFIED_MARKET_METRIC_DEFINITION_FIXTURE, fixtures.incompleteMetadata).state, 'INSUFFICIENT_METADATA');
assert.equal(compareMarketMetricObservations(CERTIFIED_MARKET_METRIC_DEFINITION_FIXTURE, fixtures.compatibleLeft, CERTIFIED_MARKET_METRIC_DEFINITION_FIXTURE, fixtures.limitedComparison).state, 'COMPARABLE_WITH_LIMITATIONS');
assert.ok(compareMarketMetricObservations(CERTIFIED_MARKET_METRIC_DEFINITION_FIXTURE, fixtures.compatibleLeft, CERTIFIED_MARKET_METRIC_DEFINITION_FIXTURE, fixtures.limitedComparison).reasons.includes('OBSERVATION_CERTIFICATION_LIMITED'));

const semantics = source('lib/agent-advisory-workbench/marketMetricSemantics.ts');
assert.match(semantics, /marketMetricDefinition/);
assert.match(semantics, /displayMarketMetricLabel/);
assert.equal(Object.values(MARKET_METRIC_CONTRACT_PROTECTED_BOUNDARIES).every((value) => value === false), true);
console.log('MARKET_METRIC_DEFINITION_EVIDENCE_CHECK: PASS');
