import assert from 'node:assert/strict';
import fs from 'node:fs';

import { AGENT_COHORT_SUPPORTED_CITIES, normalizeAgentCohortDefinition } from '../lib/agentCohortBuilder';
import { CURRENT_MARKET_SUPPORTED_CITIES } from '../lib/currentMarketComputation';
import { IRES_CITYID_SOURCE_GEOGRAPHY_FIREWALL, resolveIresCityId } from '../lib/iresCityIdEvidence';
import {
  AGENT_LISTING_CITY_REVIEW_ENTRIES,
  BLOCKED_AGENT_LISTING_CITY_KEYS,
  CURRENT_SIX_AGENT_LISTING_CITY_KEYS,
  DEFERRED_AGENT_LISTING_CITY_KEYS,
  RECOMMENDED_AGENT_CITY_AUTHORITY_NAME,
  VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_NEXT_GATE,
  VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_STATUS,
  VERSIONED_CITY_SET_PROTECTED_BOUNDARIES,
  WAVE_9_READY_AGENT_LISTING_CITY_KEYS,
  getAgentListingCityReviewEntry,
  normalizeAgentListingCityLabel,
} from '../lib/agentVersionedCitySetExpansionAdmissionReview';
import { AGENT_ADMITTED_LISTING_CITY_SET, AGENT_ADMITTED_LISTING_CITY_SET_VERSION } from '../lib/agentAdmittedListingCitySet';

const docPath = 'docs/project-atlas/executive-library/VERSIONED-CITY-SET-EXPANSION-ADMISSION-REVIEW.md';
const doc = fs.readFileSync(docPath, 'utf8');

assert.equal(VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_STATUS, 'VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_CERTIFIED');
assert.equal(VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_NEXT_GATE, 'READY_FOR_VERSIONED_AGENT_LISTING_CITY_SET_AND_PRIORITY_CITY_EXPANSION_BOUNDED_IMPLEMENTATION_WAVE_9');
assert.equal(RECOMMENDED_AGENT_CITY_AUTHORITY_NAME, 'AGENT_ADMITTED_LISTING_CITY_SET_V1');
assert.equal(AGENT_ADMITTED_LISTING_CITY_SET_VERSION, RECOMMENDED_AGENT_CITY_AUTHORITY_NAME);
assert.deepEqual(AGENT_COHORT_SUPPORTED_CITIES.map((city) => city.id), [...CURRENT_SIX_AGENT_LISTING_CITY_KEYS, ...WAVE_9_READY_AGENT_LISTING_CITY_KEYS]);
assert.deepEqual(CURRENT_MARKET_SUPPORTED_CITIES, AGENT_ADMITTED_LISTING_CITY_SET.map((city) => city.label));

for (const key of CURRENT_SIX_AGENT_LISTING_CITY_KEYS) {
  const entry = getAgentListingCityReviewEntry(key);
  assert.equal(entry?.admissionState, 'CURRENTLY_ADMITTED');
  assert.equal(entry?.sourceScope, 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION');
  assert.equal(entry?.rightsAudience, 'AGENT_ONLY');
  assert.equal(entry?.zipCompatible, true);
  assert.equal(resolveIresCityId(entry?.iresCityId).reportedCityName, entry?.displayLabel);
}

for (const key of WAVE_9_READY_AGENT_LISTING_CITY_KEYS) {
  const entry = getAgentListingCityReviewEntry(key);
  assert.equal(entry?.admissionState, 'READY_FOR_WAVE_9_RUNTIME_ADMISSION');
  assert.ok((entry?.coverage.activeResidentialRows ?? 0) > 100);
  assert.equal(entry?.coverage.zipPopulation, entry?.coverage.activeResidentialRows);
  assert.ok((entry?.coverage.distinctZips ?? 0) >= 3);
  assert.equal(resolveIresCityId(entry?.iresCityId).reportedCityName, entry?.displayLabel);
}

for (const key of DEFERRED_AGENT_LISTING_CITY_KEYS) {
  assert.equal(getAgentListingCityReviewEntry(key)?.admissionState, 'DEFERRED_NOT_WAVE_9_PRIORITY');
}

for (const key of BLOCKED_AGENT_LISTING_CITY_KEYS) {
  const entry = getAgentListingCityReviewEntry(key);
  assert.equal(entry?.admissionState, 'BLOCKED_BY_PLACE_IDENTITY');
  assert.equal(entry?.semanticType, 'UNINCORPORATED_COMMUNITY');
  assert.equal(entry?.surfaceAvailability.sharedCohortEngine, false);
}

assert.equal(normalizeAgentListingCityLabel('  Denver  '), 'denver');
assert.equal(getAgentListingCityReviewEntry('City of Broomfield'), null);

const denverRuntime = normalizeAgentCohortDefinition({ purpose: 'Denver is active after Wave 9 implementation', filters: { city: 'Denver', statusScope: 'Active' } });
assert.equal(denverRuntime.validation.ready, true);
assert.equal(denverRuntime.citySetAuthority, RECOMMENDED_AGENT_CITY_AUTHORITY_NAME);

const broomfieldRuntime = normalizeAgentCohortDefinition({ purpose: 'Broomfield is active after Wave 9 implementation', filters: { city: 'Broomfield', statusScope: 'Active', zip: '80020' } });
assert.equal(broomfieldRuntime.validation.ready, true);
assert.equal(broomfieldRuntime.citySetAuthority, RECOMMENDED_AGENT_CITY_AUTHORITY_NAME);

assert.equal(Object.values(VERSIONED_CITY_SET_PROTECTED_BOUNDARIES).every((value) => value === false), true);
assert.equal(Object.values(IRES_CITYID_SOURCE_GEOGRAPHY_FIREWALL).every((value) => value === false), true);
assert.equal(AGENT_LISTING_CITY_REVIEW_ENTRIES.some((entry) => entry.semanticType === 'UNINCORPORATED_COMMUNITY'), true);
assert.equal(AGENT_LISTING_CITY_REVIEW_ENTRIES.some((entry) => entry.semanticType === 'CITY_AND_COUNTY'), true);
assert.equal(AGENT_LISTING_CITY_REVIEW_ENTRIES.some((entry) => entry.semanticType === 'LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY'), true);

for (const required of [
  VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_STATUS,
  VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_NEXT_GATE,
  RECOMMENDED_AGENT_CITY_AUTHORITY_NAME,
  'Property.city is a required listing-location city label',
  'DATA_EXISTS_DOES_NOT_EQUAL_CITY_ADMITTED',
  'Niwot is not certified as an incorporated municipality',
  'DATABASE MUTATION: NONE',
]) {
  assert.ok(doc.includes(required), `Admission review document missing ${required}`);
}

console.log('VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW_CHECK: PASS');
