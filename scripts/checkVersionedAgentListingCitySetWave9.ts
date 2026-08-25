import assert from 'node:assert/strict';
import fs from 'node:fs';

import { AGENT_ADMITTED_FILTER_REGISTRY } from '../lib/agentAdmittedFilterRegistry';
import {
  AGENT_ADMITTED_LISTING_CITY_OPTIONS,
  AGENT_ADMITTED_LISTING_CITY_SET,
  AGENT_ADMITTED_LISTING_CITY_SET_VERSION,
  AGENT_LISTING_CITY_SET_REGISTRY,
  AGENT_LOCATION_PREPARATION_CITY_KEYS,
  VERSIONED_AGENT_LISTING_CITY_SET_WAVE_9_NEXT_GATE,
  VERSIONED_AGENT_LISTING_CITY_SET_WAVE_9_STATUS,
  classifyAgentListingCity,
  getActiveAgentListingCity,
} from '../lib/agentAdmittedListingCitySet';
import { aggregateAgentCohort } from '../lib/agentCohortAggregation';
import { AGENT_COHORT_SUPPORTED_CITIES, normalizeAgentCohortDefinition } from '../lib/agentCohortBuilder';
import { buildAgentCohortPrismaWhere } from '../lib/agentCohortCount';
import { deriveCompetingCohortInput } from '../lib/agentCurrentCompetingListingContext';
import { parseAgentComparisonSearchParams } from '../lib/agentCurrentSnapshotComparison';
import { CURRENT_MARKET_SUPPORTED_CITIES } from '../lib/currentMarketComputation';

const activeCityIds = ['boulder', 'louisville', 'lafayette', 'superior', 'erie', 'longmont', 'denver', 'broomfield', 'westminster', 'brighton', 'arvada'] as const;
const activeCityLabels = ['Boulder', 'Louisville', 'Lafayette', 'Superior', 'Erie', 'Longmont', 'Denver', 'Broomfield', 'Westminster', 'Brighton', 'Arvada'] as const;
const wave9CityZips = Object.freeze({
  denver: '80202',
  broomfield: '80020',
  westminster: '80031',
  brighton: '80601',
  arvada: '80007',
} as const);

assert.equal(VERSIONED_AGENT_LISTING_CITY_SET_WAVE_9_STATUS, 'VERSIONED_AGENT_LISTING_CITY_SET_AND_PRIORITY_CITY_EXPANSION_BOUNDED_IMPLEMENTATION_WAVE_9_CERTIFIED');
assert.equal(VERSIONED_AGENT_LISTING_CITY_SET_WAVE_9_NEXT_GATE, 'READY_FOR_HISTORICAL_EVIDENCE_FOUNDATION_ADMISSION_REVIEW');
assert.equal(AGENT_ADMITTED_LISTING_CITY_SET_VERSION, 'AGENT_ADMITTED_LISTING_CITY_SET_V1');
assert.deepEqual(AGENT_ADMITTED_LISTING_CITY_SET.map((city) => city.id), [...activeCityIds]);
assert.deepEqual(AGENT_ADMITTED_LISTING_CITY_OPTIONS.map((city) => city.id), [...activeCityIds]);
assert.deepEqual(AGENT_COHORT_SUPPORTED_CITIES.map((city) => city.id), [...activeCityIds]);
assert.deepEqual(CURRENT_MARKET_SUPPORTED_CITIES, [...activeCityLabels]);
assert.equal(AGENT_LISTING_CITY_SET_REGISTRY.find((city) => city.id === 'aurora')?.state, 'DEFERRED');
assert.equal(AGENT_LISTING_CITY_SET_REGISTRY.find((city) => city.id === 'niwot')?.state, 'BLOCKED');
assert.deepEqual(AGENT_LOCATION_PREPARATION_CITY_KEYS, ['boulder', 'louisville', 'lafayette']);
assert.equal(AGENT_ADMITTED_FILTER_REGISTRY.city.valueAuthority, AGENT_ADMITTED_LISTING_CITY_SET_VERSION);
assert.equal(AGENT_ADMITTED_FILTER_REGISTRY.city.geographyActivation, false);

for (const [city, zip] of Object.entries(wave9CityZips)) {
  const entry = getActiveAgentListingCity(city);
  assert.equal(entry?.state, 'ACTIVE');
  assert.equal(entry?.versionIntroduced, 'WAVE_9_PRIORITY_CITY_EXPANSION');
  assert.equal(entry?.zipCompatible, true);
  assert.equal(entry?.comparisonCompatible, true);
  assert.equal(entry?.rightsAudience, 'AGENT_ONLY');
  assert.equal(entry?.sourceScope, 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION');
  const normalized = normalizeAgentCohortDefinition({
    purpose: `Wave 9 ${city} ZIP compatibility`,
    filters: { city, zip, propertyType: 'Residential', statusScope: 'Active' },
    asOf: '2026-08-25T12:00:00.000Z',
  });
  assert.equal(normalized.validation.ready, true, `${city} must normalize as active`);
  assert.equal(normalized.citySetAuthority, AGENT_ADMITTED_LISTING_CITY_SET_VERSION);
  assert.deepEqual(normalized.filters.zip, [zip]);
  assert.deepEqual(buildAgentCohortPrismaWhere(normalized).city, { equals: entry?.label, mode: 'insensitive' });
  assert.deepEqual(buildAgentCohortPrismaWhere(normalized).zip, { in: [zip] });
}

const aurora = normalizeAgentCohortDefinition({ purpose: 'Aurora remains deferred', filters: { city: 'Aurora', zip: '80012', statusScope: 'Active' } });
assert.equal(aurora.validation.ready, false);
assert.equal(aurora.validation.reasons.includes('FILTER_REJECTED:city'), true);
assert.equal(aurora.validation.reasons.includes('FILTER_REJECTED:city:CITY_DEFERRED'), true);
assert.equal(classifyAgentListingCity('Aurora').reason, 'CITY_DEFERRED');

const niwot = normalizeAgentCohortDefinition({ purpose: 'Niwot remains blocked', filters: { city: 'Niwot', zip: '80503', statusScope: 'Active' } });
assert.equal(niwot.validation.ready, false);
assert.equal(niwot.validation.reasons.includes('FILTER_REJECTED:city:CITY_BLOCKED'), true);
assert.equal(classifyAgentListingCity('Niwot').reason, 'CITY_BLOCKED');

const unknown = normalizeAgentCohortDefinition({ purpose: 'Unknown listing city', filters: { city: 'Fort Collins', zip: '80521', statusScope: 'Active' } });
assert.equal(unknown.validation.ready, false);
assert.equal(unknown.validation.reasons.includes('FILTER_REJECTED:city:CITY_NOT_ADMITTED'), true);

const zipOnly = normalizeAgentCohortDefinition({ purpose: 'ZIP without active city', filters: { zip: '80202', statusScope: 'Active' } });
assert.equal(zipOnly.validation.ready, false);
assert.equal(zipOnly.validation.reasons.includes('FILTER_REJECTED:zip:ZIP_REQUIRES_ADMITTED_CITY'), true);

const params = new URLSearchParams('cohortCount=7&metricId=agent.cohort.current-mls-listing-record-count.v1&operation=SIDE_BY_SIDE');
activeCityIds.slice(0, 7).forEach((city, index) => {
  params.set(`cohort.${index}.city`, city);
  params.set(`cohort.${index}.propertyType`, 'residential');
  params.set(`cohort.${index}.statusScope`, 'active');
  params.set(`cohort.${index}.label`, city);
});
const seven = parseAgentComparisonSearchParams(params);
assert.equal(seven.cohorts.length, 7);
assert.equal(seven.cohorts.every((cohort) => normalizeAgentCohortDefinition(cohort.cohort).validation.ready), true);

const denverSubject = {
  property: {
    origin: 'SYNTHETIC_FIXTURE',
    resolvedPropertyCount: 1,
    slug: 'wave-9-denver-subject',
    mlsId: 'WAVE9DENVER',
    address: '1 Test St',
    city: 'Denver',
    state: 'CO',
    zip: '80202',
    price: 750000,
    beds: 2,
    baths: 2,
    sqft: 1400,
    yearBuilt: 1998,
    lotSize: null,
    propertyType: 'Residential',
    status: 'Active',
    isPrivateExclusive: false,
    neighborhood: null,
  },
  sourcePosture: {
    sourceId: 'AGENT_PROPERTY_LISTING_SOURCE_V1',
    sourceClass: 'EXISTING_REPOSITORY_LISTING_FACTS',
    listingReference: 'WAVE9DENVER',
    observedAt: '2026-08-25T12:00:00.000Z',
    freshness: 'CURRENT',
    completeness: 'COMPLETE',
    conflict: 'NO_CONFLICT',
    rights: 'CERTIFIED_EXISTING_REPOSITORY_USE',
    certification: 'PROPERTY_PRODUCT_CERTIFIED',
  },
} as const;
const competing = deriveCompetingCohortInput(denverSubject);
assert.equal(normalizeAgentCohortDefinition(competing.input).filters.city, 'denver');
assert.equal(normalizeAgentCohortDefinition(competing.input).validation.ready, true);

const rejectedAggregation = await aggregateAgentCohort({ purpose: 'Aurora aggregation remains unavailable', filters: { city: 'Aurora', statusScope: 'Active' } });
assert.equal(rejectedAggregation.status, 'NOT_AVAILABLE');
assert.equal(rejectedAggregation.normalized.validation.reasons.includes('FILTER_REJECTED:city:CITY_DEFERRED'), true);

const cohortBuilder = fs.readFileSync('lib/agentCohortBuilder.ts', 'utf8');
const currentMarket = fs.readFileSync('lib/currentMarketComputation.ts', 'utf8');
const comparisonUi = fs.readFileSync('components/agent/AgentCurrentSnapshotComparison.tsx', 'utf8');
const doc = fs.readFileSync('docs/project-atlas/executive-library/VERSIONED-AGENT-LISTING-CITY-SET-WAVE-9-CERTIFICATION.md', 'utf8');
assert.doesNotMatch(cohortBuilder, /AGENT_COHORT_SUPPORTED_CITIES\s*=\s*\[/);
assert.doesNotMatch(currentMarket, /CURRENT_MARKET_SUPPORTED_CITIES\s*=\s*Object\.freeze\(\[/);
assert.match(comparisonUi, /AGENT_LOCATION_PREPARATION_CITY_KEYS/);
for (const required of [
  VERSIONED_AGENT_LISTING_CITY_SET_WAVE_9_STATUS,
  VERSIONED_AGENT_LISTING_CITY_SET_WAVE_9_NEXT_GATE,
  AGENT_ADMITTED_LISTING_CITY_SET_VERSION,
  'Aurora: DEFERRED / NOT ACTIVE',
  'Niwot: BLOCKED / NOT ACTIVE',
  'DATABASE MUTATION: NONE',
  'DEPLOYMENT: NONE',
]) {
  assert.ok(doc.includes(required), `Wave 9 certification document missing ${required}`);
}

console.log('VERSIONED_AGENT_LISTING_CITY_SET_AND_PRIORITY_CITY_EXPANSION_WAVE_9_CHECK: PASS');
