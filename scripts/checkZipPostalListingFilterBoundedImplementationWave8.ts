import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  AGENT_ADMITTED_FILTER_REGISTRY,
  getAgentAdmittedFilterRegistration,
  isAgentUnadmittedFilterKey,
} from '../lib/agentAdmittedFilterRegistry';
import {
  normalizeAgentCohortDefinition,
  parseAgentCohortSearchParams,
} from '../lib/agentCohortBuilder';
import { buildAgentCohortPrismaWhere } from '../lib/agentCohortCount';
import {
  classifyAgentCohortRelationship,
  parseAgentComparisonSearchParams,
} from '../lib/agentCurrentSnapshotComparison';
import {
  deriveCompetingCohortInput,
} from '../lib/agentCurrentCompetingListingContext';
import { CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES } from '../lib/agentCurrentCompetingListingContextFixtures';
import {
  ZIP_POSTAL_LISTING_FILTER_WAVE_8_NEXT_GATE,
  ZIP_POSTAL_LISTING_FILTER_WAVE_8_STATUS,
  normalizeZipPostalListingFilterSet,
  normalizeZipPostalListingFilterValue,
} from '../lib/agentZipPostalListingFilterAdmissionReview';

const read = (path: string) => fs.readFileSync(path, 'utf8');

assert.equal(ZIP_POSTAL_LISTING_FILTER_WAVE_8_STATUS, 'ZIP_POSTAL_LISTING_FILTER_BOUNDED_IMPLEMENTATION_WAVE_8_CERTIFIED');
assert.equal(ZIP_POSTAL_LISTING_FILTER_WAVE_8_NEXT_GATE, 'READY_FOR_VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW');

const zipRegistration = getAgentAdmittedFilterRegistration('zip');
assert.equal(zipRegistration?.propertyField, 'zip');
assert.equal(zipRegistration?.valueType, 'STRING_IDENTIFIER');
assert.equal(zipRegistration?.tier, 'ADVANCED_PROPERTY_FILTER');
assert.equal(zipRegistration?.operator, 'IN');
assert.equal(zipRegistration?.analyticalGrain, 'MLS_LISTING');
assert.equal(zipRegistration?.sourceScope, 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION');
assert.equal(zipRegistration?.rightsAudience, 'AGENT_ONLY');
assert.equal(zipRegistration?.geographyActivation, false);
assert.equal(zipRegistration?.aggregatable, false);
assert.equal(isAgentUnadmittedFilterKey('zip'), false);
assert.equal(AGENT_ADMITTED_FILTER_REGISTRY.zip.key, 'zip');

assert.deepEqual(normalizeZipPostalListingFilterValue('01234'), { ready: true, normalized: '01234', reasons: [] });
assert.deepEqual(normalizeZipPostalListingFilterValue('80301-1234'), { ready: true, normalized: '80301', reasons: ['ZIP_PLUS_4_NORMALIZED_TO_BASE_FIVE_DIGIT'] });
for (const malformed of ['8030', '803011', '80A01', '803 01', '00000', '', ' ', 80301]) {
  assert.equal(normalizeZipPostalListingFilterValue(malformed).ready, false, `${String(malformed)} must fail closed.`);
}
assert.deepEqual(normalizeZipPostalListingFilterSet(['80302', '80301', '80302']), { ready: true, normalized: '80301,80302', reasons: [] });
assert.equal(normalizeZipPostalListingFilterSet(['80301', 'BADZIP']).ready, false);

const singleZip = normalizeAgentCohortDefinition({
  purpose: 'Wave 8 single ZIP',
  filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', zip: '80301' },
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(singleZip.validation.ready, true);
assert.deepEqual(singleZip.filters.zip, ['80301']);
assert.match(singleZip.serializedCohortIdentity, /"zip":\[\"80301\"\]/);
assert.deepEqual(buildAgentCohortPrismaWhere(singleZip).zip, { in: ['80301'] });

const multiZip = normalizeAgentCohortDefinition({
  purpose: 'Wave 8 multi ZIP',
  filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', zip: ['80302', '80301', '80302'] },
  asOf: '2026-08-25T12:00:00.000Z',
});
const equivalentMultiZip = normalizeAgentCohortDefinition({
  purpose: 'Wave 8 multi ZIP equivalent',
  filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', zip: ['80301', '80302'] },
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(multiZip.validation.ready, true);
assert.deepEqual(multiZip.filters.zip, ['80301', '80302']);
assert.equal(multiZip.serializedFilters, equivalentMultiZip.serializedFilters);
assert.deepEqual(buildAgentCohortPrismaWhere(multiZip).zip, { in: ['80301', '80302'] });

const zipPlusPriorityOne = normalizeAgentCohortDefinition({
  purpose: 'Wave 8 ZIP plus Priority 1',
  filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', zip: '80301', bedsExact: 3, bathsMin: 2, lotSizeMin: 0.1 },
});
assert.equal(zipPlusPriorityOne.validation.ready, true);
assert.equal(zipPlusPriorityOne.filters.bedsExact, 3);
assert.equal(zipPlusPriorityOne.filters.bathsMin, 2);
assert.equal(zipPlusPriorityOne.filters.lotSizeMin, 0.1);

const zeroResultValid = normalizeAgentCohortDefinition({
  purpose: 'Valid zero result city ZIP',
  filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', zip: '99999' },
});
assert.equal(zeroResultValid.validation.ready, true);

const zipOnly = normalizeAgentCohortDefinition({
  purpose: 'ZIP without city',
  filters: { propertyType: 'Residential', statusScope: 'Active', zip: '80301' },
});
assert.equal(zipOnly.validation.ready, false);
assert.equal(zipOnly.validation.reasons.includes('FILTER_REJECTED:zip:ZIP_REQUIRES_ADMITTED_CITY'), true);

const unsupportedCityZip = normalizeAgentCohortDefinition({
  purpose: 'Deferred city plus ZIP',
  filters: { city: 'Aurora', propertyType: 'Residential', statusScope: 'Active', zip: '80012' },
});
assert.equal(unsupportedCityZip.validation.ready, false);
assert.equal(unsupportedCityZip.validation.reasons.includes('FILTER_REJECTED:city'), true);

assert.equal(classifyAgentCohortRelationship(singleZip, multiZip), 'SUBSET');
assert.equal(classifyAgentCohortRelationship(singleZip, normalizeAgentCohortDefinition({ purpose: 'Other zip', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', zip: '80302' } })), 'DISJOINT');
assert.equal(classifyAgentCohortRelationship(multiZip, normalizeAgentCohortDefinition({ purpose: 'Overlap zip', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', zip: ['80302', '80303'] } })), 'OVERLAPPING');

const parsedRepeatedZip = parseAgentCohortSearchParams(new URLSearchParams('city=boulder&propertyType=residential&statusScope=active&zip=80302&zip=80301&zip=80302'));
assert.deepEqual(normalizeAgentCohortDefinition(parsedRepeatedZip).filters.zip, ['80301', '80302']);
const parsedComparisonZip = parseAgentComparisonSearchParams(new URLSearchParams('cohortCount=3&cohort.0.city=boulder&cohort.0.propertyType=residential&cohort.0.statusScope=active&cohort.0.zip=80301&cohort.1.city=boulder&cohort.1.propertyType=residential&cohort.1.statusScope=active&cohort.1.zip=80302&cohort.2.city=boulder&cohort.2.propertyType=residential&cohort.2.statusScope=active&cohort.2.zip=80303'));
assert.equal(parsedComparisonZip.cohorts.length, 3);
assert.deepEqual(normalizeAgentCohortDefinition(parsedComparisonZip.cohorts[1].cohort).filters.zip, ['80302']);

const subject = CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES.validSubject;
const defaultInput = deriveCompetingCohortInput(subject);
assert.deepEqual(normalizeAgentCohortDefinition(defaultInput.input).filters.zip, []);
const refinedInput = deriveCompetingCohortInput(subject, { filters: { zip: subject.property.zip ? [subject.property.zip] : [] } });
assert.deepEqual(normalizeAgentCohortDefinition(refinedInput.input).filters.zip, [subject.property.zip]);

assert.equal(parsedComparisonZip.cohorts.every((cohort) => normalizeAgentCohortDefinition(cohort.cohort).filters.city === 'boulder'), true);

const cohortBuilder = read('components/agent/AgentCohortBuilder.tsx');
assert.match(cohortBuilder, /Listing ZIPs/);
assert.match(cohortBuilder, /data-agent-cohort-zip-postal-attribute="true"/);
assert.match(cohortBuilder, /data-agent-cohort-zip-geography="false"/);
const propertyExperience = read('components/agent/PropertyConversationExperience.tsx');
assert.match(propertyExperience, /Listing ZIPs/);
assert.match(propertyExperience, /Use subject ZIP/);
assert.match(propertyExperience, /data-agent-current-competing-listing-zip-geography="false"/);

const docPath = 'docs/project-atlas/executive-library/ZIP-POSTAL-LISTING-FILTER-BOUNDED-IMPLEMENTATION-WAVE-8-CERTIFICATION.md';
const doc = read(docPath);
for (const required of [
  ZIP_POSTAL_LISTING_FILTER_WAVE_8_STATUS,
  ZIP_POSTAL_LISTING_FILTER_WAVE_8_NEXT_GATE,
  'Property.zip',
  'ZIP_REQUIRES_ADMITTED_CITY',
  'ZIP IN [80301, 80302]',
  'DATABASE MUTATION: NONE',
  'ZIP-ONLY COHORT ACTIVATION: NONE',
]) {
  assert(doc.includes(required), `Wave 8 certification artifact missing ${required}.`);
}

console.log('ZIP_POSTAL_LISTING_FILTER_BOUNDED_IMPLEMENTATION_WAVE_8_CHECK: PASS');
