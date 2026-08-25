import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildAgentCohortPrismaWhere } from '../lib/agentCohortCount';
import { normalizeAgentCohortDefinition } from '../lib/agentCohortBuilder';
import { AGENT_BUYER_CRITERIA_COMPARISON_ADAPTER_STATUS, mapBuyerCriteriaToAgentCohort } from '../lib/agentBuyerCriteriaComparisonAdapter';
import { AGENT_COMPARISON_SURFACE_CONFIGS } from '../lib/agentCurrentSnapshotComparisonSurfaceConfig';
import { classifyAgentCohortRelationship, parseAgentComparisonSearchParams } from '../lib/agentCurrentSnapshotComparison';
import { createPropertyCriteriaProfile, updatePropertyCriteriaChoice, updatePropertyCriteriaRange } from '../lib/agent-advisory-workbench/propertyCriteriaProfile';
import {
  AGENT_NUMERIC_INTERVAL_VERSION,
  classifyAgentNumericIntervals,
  generatedAdjacentIntervals,
  legacyClosedInterval,
  normalizeAgentNumericInterval,
} from '../lib/agentNumericInterval';

assert.equal(AGENT_NUMERIC_INTERVAL_VERSION, 'AGENT_NUMERIC_INTERVAL_V1');
assert.equal(AGENT_BUYER_CRITERIA_COMPARISON_ADAPTER_STATUS, 'AGENT_BUYER_CRITERIA_TO_COHORT_ADAPTER_WAVE_4_CERTIFIED');

const closed = normalizeAgentNumericInterval('price', { min: 500000, max: 1000000, boundary: 'CLOSED' });
const lowerOpen = normalizeAgentNumericInterval('price', { min: 500000, max: 1000000, boundary: 'LOWER_EXCLUSIVE_UPPER_INCLUSIVE' });
const upperOpen = normalizeAgentNumericInterval('price', { min: 500000, max: 1000000, boundary: 'LOWER_INCLUSIVE_UPPER_EXCLUSIVE' });
const open = normalizeAgentNumericInterval('price', { min: 500000, max: 1000000, boundary: 'OPEN' });
const lowerUnbounded = normalizeAgentNumericInterval('price', { max: 1000000, boundary: 'LOWER_UNBOUNDED' });
const upperUnbounded = normalizeAgentNumericInterval('price', { min: 500000, boundary: 'UPPER_UNBOUNDED' });
for (const interval of [closed, lowerOpen, upperOpen, open, lowerUnbounded, upperUnbounded]) assert.equal(interval.validation.ready, true, interval.serialized);
assert.equal(normalizeAgentNumericInterval('price', { min: 1000000, max: 500000, boundary: 'CLOSED' }).validation.reasons.includes('INTERVAL_MIN_GREATER_THAN_MAX'), true);
assert.equal(normalizeAgentNumericInterval('price', { min: 1000000, max: 1000000, boundary: 'OPEN' }).validation.reasons.includes('INTERVAL_EMPTY_AT_EQUAL_BOUNDS'), true);
assert.equal(normalizeAgentNumericInterval('price', { min: '500,000', max: '$1,000,000', boundary: 'CLOSED' }).serialized, closed.serialized);
assert.notEqual(closed.serialized, upperOpen.serialized);

const inclusiveLeft = normalizeAgentCohortDefinition({ purpose: 'inclusive left', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', priceMin: 500000, priceMax: 1000000 } });
const inclusiveRight = normalizeAgentCohortDefinition({ purpose: 'inclusive right', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', priceMin: 1000000, priceMax: 2000000 } });
assert.equal(classifyAgentCohortRelationship(inclusiveLeft, inclusiveRight), 'OVERLAPPING');

const halfOpenLeft = normalizeAgentCohortDefinition({ purpose: 'half-open left', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', priceMin: 500000, priceMax: 1000000 }, intervals: { price: { boundary: 'LOWER_INCLUSIVE_UPPER_EXCLUSIVE' } } });
const halfOpenRight = normalizeAgentCohortDefinition({ purpose: 'half-open right', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', priceMin: 1000000, priceMax: 2000000 }, intervals: { price: { boundary: 'LOWER_INCLUSIVE_UPPER_EXCLUSIVE' } } });
assert.equal(classifyAgentCohortRelationship(halfOpenLeft, halfOpenRight), 'DISJOINT');
assert.notEqual(inclusiveLeft.cohort.cohortDefinitionId, halfOpenLeft.cohort.cohortDefinitionId);
assert.deepEqual(buildAgentCohortPrismaWhere(inclusiveLeft).price, { gte: 500000, lte: 1000000 });
assert.deepEqual(buildAgentCohortPrismaWhere(halfOpenLeft).price, { gte: 500000, lt: 1000000 });

const bands = generatedAdjacentIntervals('price', [500000, 1000000, 2000000]);
assert.equal(classifyAgentNumericIntervals(bands[0], bands[1]), 'DISJOINT');
const broad = normalizeAgentCohortDefinition({ purpose: 'broad', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', priceMin: 500000, priceMax: 2000000 }, intervals: { price: { boundary: 'LOWER_INCLUSIVE_UPPER_EXCLUSIVE' } } });
assert.equal(classifyAgentCohortRelationship(broad, halfOpenRight), 'SUPERSET');
assert.equal(classifyAgentCohortRelationship(halfOpenRight, broad), 'SUBSET');
assert.equal(legacyClosedInterval('price', 500000, 1000000).serialized, closed.serialized);

const parsed = parseAgentComparisonSearchParams(new URLSearchParams('a.city=boulder&a.propertyType=residential&a.statusScope=active&a.priceMin=500000&a.priceMax=1000000&a.priceInterval=LOWER_INCLUSIVE_UPPER_EXCLUSIVE&b.city=boulder&b.propertyType=residential&b.statusScope=active&b.priceMin=1000000&b.priceMax=2000000&b.priceInterval=LOWER_INCLUSIVE_UPPER_EXCLUSIVE'));
assert.equal(parsed.cohorts[0].cohort.intervals?.price?.boundary, 'LOWER_INCLUSIVE_UPPER_EXCLUSIVE');

let buyerProfile = createPropertyCriteriaProfile('BUYER_PREFERENCE');
buyerProfile = updatePropertyCriteriaRange(buyerProfile, 'bedrooms', { min: 2 });
buyerProfile = updatePropertyCriteriaRange(buyerProfile, 'bathrooms', { min: 2 });
buyerProfile = updatePropertyCriteriaRange(buyerProfile, 'squareFeet', { min: 1200, max: 2400 });
buyerProfile = updatePropertyCriteriaChoice(buyerProfile, 'propertyTypes', ['SINGLE_FAMILY'], 'PREFERRED');
const buyerMapping = mapBuyerCriteriaToAgentCohort(buyerProfile, AGENT_COMPARISON_SURFACE_CONFIGS.BUYER_PREPARATION.defaultLeft);
assert.equal(buyerMapping.filters.bedsMin, 2);
assert.equal(buyerMapping.filters.bathsMin, 2);
assert.equal(buyerMapping.filters.sqftMin, 1200);
assert.equal(buyerMapping.filters.sqftMax, 2400);
assert(buyerMapping.mappedCriteria.includes('minimum bedrooms'));
buyerProfile = updatePropertyCriteriaRange(buyerProfile, 'garageSpaces', { min: 2 });
const limitedBuyerMapping = mapBuyerCriteriaToAgentCohort(buyerProfile, AGENT_COMPARISON_SURFACE_CONFIGS.BUYER_PREPARATION.defaultLeft);
assert.equal(limitedBuyerMapping.status, 'LIMITED_BY_UNMAPPED_CRITERIA');
assert(limitedBuyerMapping.unmappedCriteria.includes('garage or parking spaces'));

const unsupportedLocation = normalizeAgentCohortDefinition({ purpose: 'unsupported location', filters: { city: 'Denver', propertyType: 'Residential', statusScope: 'Active' } });
assert.equal(unsupportedLocation.validation.ready, false);
assert(unsupportedLocation.validation.reasons.includes('FILTER_REJECTED:city'));

const comparisonComponent = fs.readFileSync('components/agent/AgentCurrentSnapshotComparison.tsx', 'utf8');
const buyerExperience = fs.readFileSync('components/agent/BuyerConsultationExperience.tsx', 'utf8');
const placeExperience = fs.readFileSync('components/agent/PlaceConversationExperience.tsx', 'utf8');
const marketExperience = fs.readFileSync('components/agent/MarketConversationExperience.tsx', 'utf8');
const marketUpdateExperience = fs.readFileSync('components/agent/MarketUpdatePreparationExperience.tsx', 'utf8');
for (const marker of ['getAgentComparisonSurfaceConfig', 'agent-current-snapshot-interval-controls', 'Non-overlapping generated bands', 'data-agent-comparison-grain="MLS_LISTING"', 'data-agent-comparison-audience="AGENT_ONLY"']) assert(comparisonComponent.includes(marker), `missing shared comparison marker ${marker}`);
assert(buyerExperience.includes('surface="BUYER_PREPARATION"') && buyerExperience.includes('buyerCriteriaProfile={propertyCriteriaProfile}'));
assert(placeExperience.includes('surface="LOCATION_PREPARATION"'));
assert(marketExperience.includes('surface="MARKET_PREPARATION"'));
assert(marketUpdateExperience.includes('surface="MARKET_UPDATE_PREPARATION"'));
for (const source of [comparisonComponent, buyerExperience, placeExperience, marketExperience]) {
  for (const forbidden of ['better market', 'where the buyer should live', 'offer should be made', 'appreciation will be stronger', 'marketHealthScore']) assert.equal(source.includes(forbidden), false, `recommendation copy leaked: ${forbidden}`);
}
assert(comparisonComponent.includes('valuation') && comparisonComponent.includes('Not admitted here'), 'Valuation must appear only as an excluded boundary.');

const certification = fs.readFileSync('docs/project-atlas/executive-library/AGENT-DECISION-COMPARISON-REUSE-AND-INTERVAL-SEMANTICS-BOUNDED-IMPLEMENTATION-WAVE-4-CERTIFICATION.md', 'utf8');
assert(certification.includes('AGENT_DECISION_COMPARISON_REUSE_AND_INTERVAL_SEMANTICS_BOUNDED_IMPLEMENTATION_WAVE_4_CERTIFIED'));
assert(certification.includes('READY_FOR_COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_5'));

console.log('AGENT_DECISION_COMPARISON_REUSE_INTERVAL_SEMANTICS_WAVE_4_CHECK: PASS');
