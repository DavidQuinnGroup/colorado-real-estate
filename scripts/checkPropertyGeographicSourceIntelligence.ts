import assert from 'node:assert/strict';
import fs from 'node:fs';

import { CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX } from '../lib/coloradoCityIntelligenceFactory.js';
import {
  buildPropertyGeographicSourceIntelligence,
  PROPERTY_GEOGRAPHIC_SOURCE_INTELLIGENCE_STATUS,
} from '../lib/property/propertyAuthoritativeSourceIntelligence.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const sourceModel = read('lib/property/propertyAuthoritativeSourceIntelligence.ts');
const publicRecordModel = read('lib/property/propertyPublicRecordEvidence.ts');
const propertyProductModel = read('lib/propertyProduct31.ts');
const component = read('components/PropertyProduct31Experience.tsx');
const propertyPage = read('app/properties/[id]/page.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');

for (const required of [
  'sourcePath',
  'geography',
  'evidence',
  'limitation',
  'customerUse',
  'claimEligible',
  'CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX',
  'COLORADO_CITY_INTELLIGENCE_RECORDS',
  'PROPERTY_GEOGRAPHIC_SOURCE_INTELLIGENCE_IMPLEMENTED',
  'PROVIDER_CONFIRMATION_REQUIRED_FIRST',
]) {
  assertIncludes(sourceModel, required, `Source intelligence contract must preserve ${required}.`);
}

for (const requiredCategory of [
  'MLS_LISTING_DATA',
  'MUNICIPAL_PLANNING',
  'COUNTY_ASSESSOR',
  'COUNTY_TREASURER_TAX',
  'BUILDING_PERMITS',
  'BCOD_ADDRESS_POINTS',
  'BCOD_PARK_BOUNDARIES',
]) {
  assertIncludes(sourceModel, requiredCategory, `Source intelligence must account for ${requiredCategory}.`);
}

const matrixCategories = new Set(CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX.map((source) => source.category));
for (const requiredMatrixCategory of ['MLS_LISTING_DATA', 'MUNICIPAL_PLANNING', 'COUNTY_ASSESSOR', 'COUNTY_TREASURER_TAX', 'BUILDING_PERMITS']) {
  assert(matrixCategories.has(requiredMatrixCategory as never), `${requiredMatrixCategory} must exist in the certified source matrix.`);
}

const boulderModel = buildPropertyGeographicSourceIntelligence({
  city: 'Boulder',
  neighborhood: 'Mapleton Hill',
  propertyType: 'Residential',
  status: 'Active',
  price: 1200000,
  sqft: 2400,
  yearBuilt: 1976,
  lotSize: 0.22,
  soilType: 'Front Range Mixed',
  altitude: 5400,
  relatedListingCount: 2,
});

assert.equal(boulderModel.status, PROPERTY_GEOGRAPHIC_SOURCE_INTELLIGENCE_STATUS);
assert.equal(boulderModel.geography.city, 'Boulder');
assert.equal(boulderModel.selectedSources.length, 7);
assert.equal(boulderModel.selectedSources.filter((source) => source.claimEligible).length, 2);
assert.equal(boulderModel.publicRecordEvidence.status, 'AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_ARCHITECTURE_READY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(boulderModel.publicRecordEvidence.domainProfiles.length, 3);
assert(boulderModel.selectedSources.some((source) => source.category === 'MLS_LISTING_DATA' && source.readiness === 'READY_EXISTING_REPOSITORY_DATA'));
assert(boulderModel.selectedSources.some((source) => source.category === 'MUNICIPAL_PLANNING' && source.readiness === 'GOVERNED_REFERENCE_ONLY'));
assert(boulderModel.selectedSources.some((source) => source.category === 'COUNTY_ASSESSOR' && source.readiness === 'FAIL_CLOSED_REVIEW_REQUIRED'));
assert(boulderModel.selectedSources.some((source) => source.category === 'COUNTY_TREASURER_TAX' && source.readiness === 'FAIL_CLOSED_REVIEW_REQUIRED'));
assert(boulderModel.selectedSources.some((source) => source.category === 'BUILDING_PERMITS' && source.readiness === 'FAIL_CLOSED_REVIEW_REQUIRED'));
assert(boulderModel.selectedSources.some((source) => source.category === 'BCOD_ADDRESS_POINTS' && source.readiness === 'BLOCKED_NOT_AUTHORIZED'));
assert(boulderModel.selectedSources.some((source) => source.category === 'BCOD_PARK_BOUNDARIES' && source.readiness === 'BLOCKED_NOT_AUTHORIZED'));

for (const [category, domain] of [
  ['COUNTY_ASSESSOR', 'ASSESSOR'],
  ['COUNTY_TREASURER_TAX', 'TAX'],
  ['BUILDING_PERMITS', 'PERMIT'],
] as const) {
  const source = boulderModel.selectedSources.find((candidate) => candidate.category === category);
  assert(source, `${category} source must exist.`);
  assert.equal(source.recordDomain, domain);
  assert.equal(source.implementationDisposition, 'ARCHITECTURE_READY_SOURCE_CONFIRMATION_REQUIRED');
  assert.equal(source.claimEligible, false);
}

for (const [boundary, value] of Object.entries(boulderModel.protectedBoundaries)) {
  assert.equal(value, false, `${boundary} must remain false.`);
}

const unknownCityModel = buildPropertyGeographicSourceIntelligence({
  city: 'Unmodeled City',
  propertyType: 'Residential',
});

assert.equal(unknownCityModel.geography.city, 'Unmodeled City');
assert(unknownCityModel.selectedSources.some((source) => source.category === 'MUNICIPAL_PLANNING' && source.readiness === 'FAIL_CLOSED_REVIEW_REQUIRED'));
assert.equal(unknownCityModel.selectedSources.filter((source) => source.claimEligible).length, 1);

for (const requiredSurface of [
  'data-testid="property-geographic-source-intelligence"',
  'data-testid="property-public-record-evidence-profile"',
  'data-testid="property-geographic-source-item"',
  'data-property-source-readiness-contract="source-geography-subject-freshness-evidence-limitation-claim-intelligence-presentation"',
  'data-property-record-intelligence={recordEvidence.status}',
  'data-property-record-disposition-assessor={recordDisposition',
  'data-property-geographic-source-provider-activation={String(model.authoritativeSources.protectedBoundaries.providerActivation)}',
  'data-property-geographic-source-bcod-address-points={String(model.authoritativeSources.protectedBoundaries.bcodAddressPoints)}',
  'data-property-geographic-source-public-gis={String(model.authoritativeSources.protectedBoundaries.publicGis)}',
]) {
  assertIncludes(component, requiredSurface, `Rendered source-readiness surface missing: ${requiredSurface}`);
}

assertIncludes(propertyProductModel, 'authoritativeSources', 'Property Product 3.1 model must expose authoritative source intelligence.');
assertIncludes(propertyPage, 'buildPropertyProduct31Model', 'Property page must use the integrated Property Product 3.1 model.');
assertIncludes(publicRecordModel, 'PropertyRecordDomainDisposition', 'Public-record evidence contract must expose explicit domain dispositions.');
assertIncludes(publicRecordModel, 'recordRetrieval: false', 'Public-record evidence contract must prevent record retrieval.');
assertIncludes(publicRecordModel, 'customerRecordDisplay: false', 'Public-record evidence contract must prevent customer record display.');

for (const forbidden of [
  'fetch(',
  'createClient(',
  'process.env',
  'prisma.',
  'localStorage',
  'sessionStorage',
  'navigator.sendBeacon',
  'BCOD API',
  'download',
  'owner identity',
  'automated valuation',
  'suitability score',
]) {
  assertNotIncludes(sourceModel, forbidden, `Source intelligence must not introduce protected behavior or claims: ${forbidden}`);
}

assert.equal(
  packageJson.scripts?.['check:property-geographic-source-intelligence'],
  'npm run worker:build && node dist/scripts/checkPropertyGeographicSourceIntelligence.js',
  'package.json must expose the property/geographic source intelligence check.',
);
assertIncludes(tsconfig, 'scripts/checkPropertyGeographicSourceIntelligence.ts', 'Worker build must compile the property/geographic source intelligence check.');
assertIncludes(tsconfig, 'lib/property/propertyAuthoritativeSourceIntelligence.ts', 'Worker build must compile the property source intelligence contract.');
assertIncludes(tsconfig, 'lib/property/propertyPublicRecordEvidence.ts', 'Worker build must compile the property public-record evidence contract.');

console.log('[property-geographic-source-intelligence] ok: property source readiness, geographic source reuse, BCOD fail-closed gates, and protected-system boundaries verified.');
