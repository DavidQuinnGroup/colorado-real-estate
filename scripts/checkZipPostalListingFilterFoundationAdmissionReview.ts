import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  ZIP_POSTAL_LISTING_COVERAGE_EVIDENCE,
  ZIP_POSTAL_LISTING_FIELD_CONTRACT,
  ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_STATUS,
  ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_VERSION,
  ZIP_POSTAL_LISTING_FILTER_FOUNDATION_NEXT_GATE,
  ZIP_POSTAL_LISTING_IMPLEMENTATION_READINESS,
  ZIP_POSTAL_LISTING_PROTECTED_BOUNDARIES,
  normalizeZipPostalListingFilterSet,
  normalizeZipPostalListingFilterValue,
} from '../lib/agentZipPostalListingFilterAdmissionReview';
import { getAgentAdmittedFilterRegistration } from '../lib/agentAdmittedFilterRegistry';
import { normalizeAgentCohortDefinition, parseAgentCohortSearchParams } from '../lib/agentCohortBuilder';

const read = (path: string) => fs.readFileSync(path, 'utf8');

assert.equal(ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_STATUS, 'ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_CERTIFIED');
assert.equal(ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_VERSION, 'ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_V1');
assert.equal(ZIP_POSTAL_LISTING_FILTER_FOUNDATION_NEXT_GATE, 'READY_FOR_ZIP_POSTAL_LISTING_FILTER_BOUNDED_IMPLEMENTATION_WAVE_8');

assert.equal(ZIP_POSTAL_LISTING_FIELD_CONTRACT.repositoryField, 'Property.zip');
assert.equal(ZIP_POSTAL_LISTING_FIELD_CONTRACT.dataType, 'STRING_IDENTIFIER');
assert.equal(ZIP_POSTAL_LISTING_FIELD_CONTRACT.addressRole, 'CURRENT_LISTING_PROPERTY_LOCATION_ADDRESS');
assert.deepEqual([...ZIP_POSTAL_LISTING_FIELD_CONTRACT.sourceFields], ['PostalCode', 'Zip', 'zip']);
assert.deepEqual([...ZIP_POSTAL_LISTING_FIELD_CONTRACT.allowedOperators], ['EQUALS', 'IN']);
assert.equal(ZIP_POSTAL_LISTING_FIELD_CONTRACT.blockedOperators.includes('NUMERIC_RANGE'), true);
assert.equal(ZIP_POSTAL_LISTING_FIELD_CONTRACT.geographyActivation, false);
assert.equal(ZIP_POSTAL_LISTING_FIELD_CONTRACT.aggregatable, false);
assert.equal(ZIP_POSTAL_LISTING_FIELD_CONTRACT.metricAdmission, false);
assert.equal(ZIP_POSTAL_LISTING_FIELD_CONTRACT.defaultCompetingCohortDerivation, false);
assert.equal(ZIP_POSTAL_LISTING_FIELD_CONTRACT.publicClientExport, false);

assert.equal(ZIP_POSTAL_LISTING_COVERAGE_EVIDENCE.allPropertyRows.total, 75490);
assert.equal(ZIP_POSTAL_LISTING_COVERAGE_EVIDENCE.allPropertyRows.populated, 75490);
assert.equal(ZIP_POSTAL_LISTING_COVERAGE_EVIDENCE.allPropertyRows.fiveDigit, 75490);
assert.equal(ZIP_POSTAL_LISTING_COVERAGE_EVIDENCE.allPropertyRows.zipPlus4, 0);
assert.equal(ZIP_POSTAL_LISTING_COVERAGE_EVIDENCE.allPropertyRows.malformed, 0);
assert.equal(ZIP_POSTAL_LISTING_COVERAGE_EVIDENCE.allPropertyRows.whitespacePadded, 0);
assert.equal(ZIP_POSTAL_LISTING_COVERAGE_EVIDENCE.allPropertyRows.sentinel00000, 0);
assert.equal(ZIP_POSTAL_LISTING_COVERAGE_EVIDENCE.sixCityActiveResidentialRows.total, 873);
assert.equal(ZIP_POSTAL_LISTING_COVERAGE_EVIDENCE.sixCityActiveResidentialRows.populated, 873);
assert.equal(ZIP_POSTAL_LISTING_COVERAGE_EVIDENCE.sixCityActiveResidentialRows.distinctBaseZipCount, 11);

assert.equal(normalizeZipPostalListingFilterValue('01234').normalized, '01234');
assert.equal(normalizeZipPostalListingFilterValue('80301').ready, true);
assert.deepEqual(normalizeZipPostalListingFilterValue('80301-1234'), {
  ready: true,
  normalized: '80301',
  reasons: ['ZIP_PLUS_4_NORMALIZED_TO_BASE_FIVE_DIGIT'],
});
for (const value of ['1234', '123456', 'ABCDE', ' ', '', '80 301', '8030A', 80301, null, undefined, '00000']) {
  assert.equal(normalizeZipPostalListingFilterValue(value).ready, false, `${String(value)} must not validate as an admitted ZIP.`);
}
assert.deepEqual(normalizeZipPostalListingFilterSet(['80302', '80301', '80302']), {
  ready: true,
  normalized: '80301,80302',
  reasons: [],
});
assert.equal(normalizeZipPostalListingFilterSet([]).ready, false);

assert.equal(getAgentAdmittedFilterRegistration('zip')?.propertyField, 'zip');
const parsedZip = parseAgentCohortSearchParams(new URLSearchParams('city=boulder&propertyType=residential&statusScope=active&zip=80301'));
assert.equal(normalizeAgentCohortDefinition(parsedZip).validation.ready, true);

assert.equal(ZIP_POSTAL_LISTING_IMPLEMENTATION_READINESS.zipOnlyCohort, 'BLOCKED_BY_CURRENT_GEOGRAPHY_CONTRACT');
assert.equal(ZIP_POSTAL_LISTING_IMPLEMENTATION_READINESS.cityZipCohort, 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION');
assert.equal(ZIP_POSTAL_LISTING_IMPLEMENTATION_READINESS.multiSelectFilter, 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION');
assert.equal(ZIP_POSTAL_LISTING_IMPLEMENTATION_READINESS.buyerMapping, 'DEFER');
assert.equal(ZIP_POSTAL_LISTING_IMPLEMENTATION_READINESS.currentCompetingListingContextRefinement, 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION');

assert.equal(Object.values(ZIP_POSTAL_LISTING_PROTECTED_BOUNDARIES).every((value) => value === false), true);

const schema = read('prisma/schema.prisma');
const propertyModel = schema.match(/^model Property \{[\s\S]*?^}/m)?.[0] ?? '';
assert.match(propertyModel, /\n  zip\s+String\n/);
assert.match(read('lib/mls/upsertListing.ts'), /PostalCode'[\s\S]*'Zip'[\s\S]*'zip'/);
assert.match(read('lib/typesense/schema.ts'), /name: 'zip', type: 'string', facet: true/);
assert.match(read('lib/internalSynchronizedPropertyMarketReadAdapter.ts'), /zip: true/);
assert.match(read('lib/schema/propertySchema.ts'), /zip: string/);
assert.match(read('lib/agent-advisory-workbench/propertyCriteriaProfile.ts'), /PropertyCriteriaProfile/);
assert.equal(read('lib/agent-advisory-workbench/propertyCriteriaProfile.ts').includes('zip'), false, 'Buyer criteria profile must not already contain a ZIP criterion.');

const docPath = 'docs/project-atlas/executive-library/ZIP-POSTAL-LISTING-FILTER-FOUNDATION-ADMISSION-REVIEW.md';
const doc = read(docPath);
for (const required of [
  ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_STATUS,
  ZIP_POSTAL_LISTING_FILTER_FOUNDATION_NEXT_GATE,
  'Property.zip',
  'PostalCode',
  'CURRENT_LISTING_PROPERTY_LOCATION_ADDRESS',
  'STRING_IDENTIFIER',
  'ZIP_ONLY_BLOCKED_BY_CURRENT_COHORT_GEOGRAPHY_CONTRACT',
  'CITY_AND_ZIP_INTERSECTION_READY',
  'ZIP_POSTAL_LISTING_FILTER_BOUNDED_IMPLEMENTATION_WAVE_8_CERTIFIED',
  'DATABASE MUTATION: NONE',
  'ZIP RUNTIME FILTER IMPLEMENTATION: NONE',
]) {
  assert(doc.includes(required), `ZIP admission review artifact missing ${required}.`);
}

console.log('ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_CHECK: PASS');
