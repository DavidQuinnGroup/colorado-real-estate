import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  AGENT_COHORT_BUILDER_VERSION,
  AGENT_COHORT_COUNT_LABEL,
  AGENT_COHORT_SUPPORTED_FILTER_KEYS,
  REUSABLE_AGENT_COHORT_BUILDER_NEXT_GATE,
  REUSABLE_AGENT_COHORT_BUILDER_WAVE_1_STATUS,
  buildAgentCohortCountContract,
  normalizeAgentCohortDefinition,
  parseAgentCohortSearchParams,
} from '../lib/agentCohortBuilder';
import { buildAgentCohortPrismaWhere } from '../lib/agentCohortCount';

assert.equal(REUSABLE_AGENT_COHORT_BUILDER_WAVE_1_STATUS, 'REUSABLE_AGENT_COHORT_BUILDER_BOUNDED_IMPLEMENTATION_WAVE_1_CERTIFIED');
assert.equal(REUSABLE_AGENT_COHORT_BUILDER_NEXT_GATE, 'READY_FOR_ADMITTED_BASIC_AGGREGATION_WAVE_2');
assert.equal(AGENT_COHORT_BUILDER_VERSION, 'AGENT_COHORT_BUILDER_V1');

for (const key of ['city', 'propertyType', 'statusScope', 'priceMin', 'priceMax', 'bedsMin', 'bathsMin', 'sqftMin', 'sqftMax', 'yearBuiltMin', 'yearBuiltMax']) {
  assert(AGENT_COHORT_SUPPORTED_FILTER_KEYS.includes(key as (typeof AGENT_COHORT_SUPPORTED_FILTER_KEYS)[number]), `Missing supported quick filter: ${key}`);
}

const valid = normalizeAgentCohortDefinition({
  purpose: 'Boulder buyer inventory prep',
  filters: {
    city: 'Boulder',
    propertyType: 'Residential',
    statusScope: 'Active',
    priceMin: 500000,
    priceMax: 1250000,
    bedsMin: 3,
    bathsMin: 2,
    sqftMin: 1200,
    yearBuiltMin: 1950,
  },
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(valid.validation.ready, true);
assert.equal(valid.cohort.analyticalGrain, 'MLS_LISTING');
assert.equal(valid.cohort.period.periodBasis, 'OBSERVATION_AS_OF_TIMESTAMP');
assert.equal(valid.cohort.period.form, 'AS_OF_INSTANT_SNAPSHOT');
assert.equal(valid.cohort.stockFlowClass, 'STOCK');
assert.equal(valid.cohort.sourceScope.sourceIds[0], 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION');
assert.equal(valid.cohort.scenarioBoundary, 'NOT_SCENARIO');
assert.equal(valid.cohort.geography.mappingState, 'MAPPED');
assert(valid.cohort.nullMissingPolicy.includes('SOURCE_PROVIDES_NULL'));

const repeated = normalizeAgentCohortDefinition({
  purpose: 'Boulder buyer inventory prep',
  filters: {
    yearBuiltMin: 1950,
    sqftMin: 1200,
    bathsMin: 2,
    bedsMin: 3,
    priceMax: 1250000,
    priceMin: 500000,
    statusScope: 'Active',
    propertyType: 'Residential',
    city: 'Boulder',
  },
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(repeated.serializedFilters, valid.serializedFilters);
assert.equal(repeated.cohort.cohortDefinitionId, valid.cohort.cohortDefinitionId);

const missingGrain = normalizeAgentCohortDefinition({
  purpose: 'Wrong grain',
  filters: { city: 'Boulder', statusScope: 'Active' },
  analyticalGrain: 'MLS_LISTING',
  temporalBasis: 'OBSERVATION_AS_OF_TIMESTAMP',
  periodForm: 'AS_OF_INSTANT_SNAPSHOT',
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(missingGrain.validation.ready, true);

const unsupportedGrain = normalizeAgentCohortDefinition({
  purpose: 'Unsupported physical property grain',
  filters: { city: 'Boulder', statusScope: 'Active' },
  analyticalGrain: 'PHYSICAL_PROPERTY',
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(unsupportedGrain.validation.ready, false);
assert(unsupportedGrain.validation.reasons.includes('FILTER_REJECTED:analyticalGrain'));

const historicalBasis = normalizeAgentCohortDefinition({
  purpose: 'Historical basis should fail',
  filters: { city: 'Boulder', statusScope: 'Active' },
  temporalBasis: 'CLOSE_SOLD_DATE',
  periodForm: 'CALENDAR_YEAR',
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(historicalBasis.validation.ready, false);
assert(historicalBasis.validation.reasons.includes('FILTER_REJECTED:temporalBasis'));
assert(historicalBasis.validation.reasons.includes('FILTER_REJECTED:periodForm'));

const missingGeography = normalizeAgentCohortDefinition({ purpose: 'No city', filters: { statusScope: 'Active' }, asOf: '2026-08-25T12:00:00.000Z' });
assert.equal(missingGeography.validation.ready, false);
assert(missingGeography.validation.reasons.includes('GEOGRAPHY_RECONCILIATION_REQUIRED'));

const invalidGeography = normalizeAgentCohortDefinition({ purpose: 'Deferred city', filters: { city: 'Aurora', statusScope: 'Active' }, asOf: '2026-08-25T12:00:00.000Z' });
assert.equal(invalidGeography.validation.ready, false);
assert(invalidGeography.validation.reasons.includes('FILTER_REJECTED:city'));

const invalidPrice = normalizeAgentCohortDefinition({ purpose: 'Invalid range', filters: { city: 'Boulder', statusScope: 'Active', priceMin: 900000, priceMax: 800000 }, asOf: '2026-08-25T12:00:00.000Z' });
assert(invalidPrice.validation.reasons.includes('FILTER_REJECTED:priceRange'));

const invalidSqft = normalizeAgentCohortDefinition({ purpose: 'Invalid sqft', filters: { city: 'Boulder', statusScope: 'Active', sqftMin: 2200, sqftMax: 1600 }, asOf: '2026-08-25T12:00:00.000Z' });
assert(invalidSqft.validation.reasons.includes('FILTER_REJECTED:sqftRange'));

const unsupported = normalizeAgentCohortDefinition({
  purpose: 'Unsupported DOM',
  filters: { city: 'Boulder', statusScope: 'Active' },
  unsupportedFilters: ['daysOnMarket', 'soldDate', 'scenarioReturn'],
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(unsupported.validation.ready, false);
assert(unsupported.validation.reasons.includes('FILTER_REJECTED:daysOnMarket'));
assert(unsupported.validation.reasons.includes('FILTER_REJECTED:soldDate'));
assert(unsupported.validation.reasons.includes('FILTER_REJECTED:scenarioReturn'));

const scenario = normalizeAgentCohortDefinition({
  purpose: 'Scenario should fail',
  filters: { city: 'Boulder', statusScope: 'Active' },
  scenarioBoundary: 'NOT_SCENARIO',
  unsupportedFilters: ['scenarioModel'],
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(scenario.validation.ready, false);
assert(scenario.validation.reasons.includes('FILTER_REJECTED:scenarioModel'));

const parsed = parseAgentCohortSearchParams(new URLSearchParams('city=lafayette&propertyType=residential&statusScope=active&bedsMin=2&unsupportedFilter=dom'));
assert.equal(parsed.filters.city, 'lafayette');
assert.equal(parsed.filters.bedsMin, '2');
assert.deepEqual(parsed.unsupportedFilters, ['dom']);

const where = buildAgentCohortPrismaWhere(valid);
assert.deepEqual(where.city, { equals: 'Boulder', mode: 'insensitive' });
assert.deepEqual(where.propertyType, { equals: 'Residential', mode: 'insensitive' });
assert.deepEqual(where.status, { equals: 'Active', mode: 'insensitive' });
assert.deepEqual(where.price, { gte: 500000, lte: 1250000 });
assert.deepEqual(where.beds, { gte: 3 });
assert.deepEqual(where.baths, { gte: 2 });
assert.deepEqual(where.sqft, { gte: 1200, lte: undefined });
assert.deepEqual(where.yearBuilt, { gte: 1950, lte: undefined });

const count = buildAgentCohortCountContract({ normalized: valid, count: 12, available: true, asOf: '2026-08-25T12:00:00.000Z' });
assert.equal(count.label, AGENT_COHORT_COUNT_LABEL);
assert.equal(count.analyticalGrain, 'MLS_LISTING');
assert.equal(count.temporalBasis, 'OBSERVATION_AS_OF_TIMESTAMP');
assert.equal(count.periodForm, 'AS_OF_INSTANT_SNAPSHOT');
assert.equal(count.sourceScope, 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION');
assert.equal(count.value, 12);
assert(count.limitations.some((item) => item.includes('not physical properties')));
assert(count.limitations.some((item) => item.includes('Null fields are not coerced to zero')));

const unavailable = buildAgentCohortCountContract({ normalized: valid, count: 22, available: false, asOf: '2026-08-25T12:00:00.000Z' });
assert.equal(unavailable.value, null);
assert.equal(unavailable.available, false);

const contractSource = fs.readFileSync('lib/agentCohortBuilder.ts', 'utf8');
assert.doesNotMatch(contractSource, /prisma\.|PrismaClient|fetch\(|process\.env|new Typesense|sendEmail|CRMTask|supabase/i, 'Reusable cohort contract must stay side-effect free.');

const countSource = fs.readFileSync('lib/agentCohortCount.ts', 'utf8');
assert.match(countSource, /prisma\.property\.count/);
assert.doesNotMatch(countSource, /findMany|create\(|update\(|upsert\(|delete\(|deleteMany|createMany|updateMany|fetch\(|new Typesense|sendEmail|CRMTask/i, 'Count adapter must remain read-only and provider-free.');

const componentSource = fs.readFileSync('components/agent/AgentCohortBuilder.tsx', 'utf8');
assert.match(componentSource, /data-agent-cohort-grain="MLS_LISTING"/);
assert.match(componentSource, /data-agent-cohort-temporal-basis="OBSERVATION_AS_OF_TIMESTAMP"/);
assert.match(componentSource, /data-agent-cohort-source-scope="CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION"/);
assert.match(componentSource, /data-agent-cohort-provider-activity="false"/);
assert.match(componentSource, /data-agent-cohort-persistence="false"/);
assert.doesNotMatch(componentSource, /Matching current (physical )?properties|Matching current sales|Sales count|DOM count|CDOM count|absorption rate|recommended price/i, 'Wave 1 UI must not claim unsupported analytics.');

const marketUpdateSource = fs.readFileSync('components/agent/MarketUpdatePreparationExperience.tsx', 'utf8');
assert.match(marketUpdateSource, /<AgentCohortBuilder surface="MARKET_UPDATE_PREPARATION" \/>/);

console.log('REUSABLE_AGENT_COHORT_BUILDER_BOUNDED_IMPLEMENTATION_WAVE_1_CHECK: PASS');
