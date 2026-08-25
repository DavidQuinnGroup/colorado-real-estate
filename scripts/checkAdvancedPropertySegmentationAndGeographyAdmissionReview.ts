import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path: string) => fs.readFileSync(path, 'utf8');

const docPath = 'docs/project-atlas/executive-library/ADVANCED-PROPERTY-SEGMENTATION-AND-GEOGRAPHY-ADMISSION-REVIEW.md';
const doc = read(docPath);
const schema = read('prisma/schema.prisma');
const cohortBuilder = read('lib/agentCohortBuilder.ts');
const cohortCount = read('lib/agentCohortCount.ts');
const aggregation = read('lib/agentCohortAggregation.ts');
const currentContext = read('lib/agentCurrentCompetingListingContext.ts');
const interval = read('lib/agentNumericInterval.ts');
const buyerAdapter = read('lib/agentBuyerCriteriaComparisonAdapter.ts');
const iresCityId = read('lib/iresCityIdEvidence.ts');
const gioPersistence = read('lib/gio/persistence.ts');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const propertyModel = schema.match(/^model Property \{[\s\S]*?^}/m)?.[0] ?? '';

assert(doc.includes('ADVANCED_PROPERTY_SEGMENTATION_AND_GEOGRAPHY_ADMISSION_REVIEW_CERTIFIED'));
assert(doc.includes('READY_FOR_ADMITTED_FILTER_REGISTRY_AND_PRIORITY_1_PROPERTY_SEGMENTATION_BOUNDED_IMPLEMENTATION_WAVE_7'));
assert(doc.includes('75,490'));
assert(doc.includes('13,114'));
assert(doc.includes('12,006'));

for (const required of [
  'city',
  'zip',
  'price',
  'beds',
  'baths',
  'sqft',
  'lotSize',
  'yearBuilt',
  'propertyType',
  'status',
  'neighborhood',
  'subdivision',
  'schoolDistrict',
  'description',
  'listingAgent',
  'listingOffice',
  'lat',
  'lng',
]) {
  assert(propertyModel.includes(required), `Property schema must expose audited field ${required}.`);
}

for (const absent of [
  'garageSpaces',
  'parkingSpaces',
  'hoaAmount',
  'builderName',
  'zoning',
  'basement',
  'architecturalStyle',
  'waterSource',
  'sewer',
]) {
  assert.equal(propertyModel.includes(absent), false, `${absent} must remain absent from current Property schema.`);
}

for (const admittedFilter of [
  'city',
  'propertyType',
  'statusScope',
  'priceMin',
  'priceMax',
  'bedsMin',
  'bathsMin',
  'sqftMin',
  'sqftMax',
  'yearBuiltMin',
  'yearBuiltMax',
]) {
  assert(cohortBuilder.includes(`'${admittedFilter}'`), `Existing cohort filter ${admittedFilter} must remain admitted.`);
}

assert(cohortCount.includes('buildAgentCohortPrismaWhere'));
assert(aggregation.includes('EXCLUDE_NULL_AND_REPORT_COVERAGE'));
assert(currentContext.includes('CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6_CERTIFIED'));
assert(currentContext.includes('READY_FOR_ADVANCED_PROPERTY_SEGMENTATION_AND_GEOGRAPHY_ADMISSION_REVIEW'));
assert(interval.includes('Math.floor(parsed)'), 'Review must account for current integer-normalizing interval behavior.');
assert(buyerAdapter.includes('maximum bedrooms'));
assert(buyerAdapter.includes('maximum bathrooms'));
assert(buyerAdapter.includes('garage or parking spaces'));
assert(buyerAdapter.includes('HOA'));

assert(iresCityId.includes('IRES_LOCAL_NON_STANDARD_FIELD'));
assert(iresCityId.includes('NOT_RECONCILED'));
assert(iresCityId.includes('activation: false'));
assert(gioPersistence.includes('mapEligible: false'));
assert(gioPersistence.includes('marketAnalytics: false'));

for (const required of [
  'Property subtype: blocked',
  'Bedroom/bathroom expansion',
  'Lot size / acreage',
  'Garage / parking: blocked',
  'HOA: blocked',
  'School: district string exists',
  'ZIP: ready after small local foundation',
  'Map / polygon / radius: blocked',
  'Exact next implementation field set',
  'Exact excluded geography set',
  'Protected-system confirmation',
]) {
  assert(doc.includes(required), `Review doc missing required finding: ${required}`);
}

for (const forbidden of [
  'ZIP activation: yes',
  'database/schema/provider/MLS/IRES/Supabase/Typesense/CRM/email/secrets changes: yes',
  'public/client/export/deployment changes: yes',
  'historical/sold/CMA/valuation/recommendation changes: yes',
]) {
  assert.equal(doc.includes(forbidden), false, `Review must not authorize ${forbidden}`);
}

assert.equal(
  packageJson.scripts?.['check:advanced-property-segmentation-and-geography-admission-review'],
  'jiti scripts/checkAdvancedPropertySegmentationAndGeographyAdmissionReview.ts',
);

console.log('ADVANCED_PROPERTY_SEGMENTATION_AND_GEOGRAPHY_ADMISSION_REVIEW_CHECK: PASS');
