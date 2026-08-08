import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_STATUS,
  buildPropertyPublicRecordEvidenceProfile,
} from '../lib/property/propertyPublicRecordEvidence.js';
import { buildPropertyGeographicSourceIntelligence } from '../lib/property/propertyAuthoritativeSourceIntelligence.js';
import { buildPropertyProduct31Model } from '../lib/propertyProduct31.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const recordModel = read('lib/property/propertyPublicRecordEvidence.ts');
const sourceModel = read('lib/property/propertyAuthoritativeSourceIntelligence.ts');
const productModel = read('lib/propertyProduct31.ts');
const component = read('components/PropertyProduct31Experience.tsx');
const propertyPage = read('app/properties/[id]/page.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');

for (const requiredContract of [
  'AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_ARCHITECTURE_READY_SOURCE_CONFIRMATION_REQUIRED',
  'ARCHITECTURE_READY_SOURCE_CONFIRMATION_REQUIRED',
  'IMPLEMENTED_WITH_AUTHORIZED_SOURCE',
  'REMAINS_FAIL_CLOSED',
  'PropertyRecordDomainDisposition',
  'PropertyPublicRecordEvidenceProfile',
  'propertyCorrelation',
  'missingIdentifiers',
  'recordRetrieval: false',
  'bulkRecordIngestion: false',
  'customerRecordDisplay: false',
  'ownerIdentityDisplay: false',
]) {
  assertIncludes(recordModel, requiredContract, `Authoritative property-record contract must include ${requiredContract}.`);
}

for (const officialSource of [
  'Boulder County Assessor Property Search',
  'Boulder County Assessor public data tables',
  'Boulder County Treasurer property tax lookup',
  'Boulder County Treasurer EagleWeb',
  'City of Boulder building permits and inspections',
  'Boulder County Accela Citizen Access Building',
]) {
  assertIncludes(recordModel, officialSource, `Boulder official source candidate missing: ${officialSource}.`);
}

const recordProfile = buildPropertyPublicRecordEvidenceProfile({
  address: '6137 Baseline Rd',
  city: 'Boulder',
  state: 'CO',
  zip: '80303',
  neighborhood: 'East Boulder',
  subdivision: 'Baseline',
  yearBuilt: 1976,
  lotSize: 1.25,
});

assert.equal(recordProfile.status, AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_STATUS);
assert.equal(recordProfile.version, '1.0.0');
assert.equal(recordProfile.jurisdictionCertainty, 'SINGLE_COUNTY_FROM_GOVERNED_CITY_RECORD');
assert.equal(recordProfile.domainProfiles.length, 3);
assert(recordProfile.propertyCorrelation.availableIdentifiers.includes('property address'));
assert(recordProfile.propertyCorrelation.availableIdentifiers.includes('ZIP code'));
assert(recordProfile.propertyCorrelation.missingIdentifiers.includes('parcel number'));
assert(recordProfile.propertyCorrelation.missingIdentifiers.includes('assessor account number'));
assert.equal(recordProfile.propertyCorrelation.correlationConfidence, 'LIMITED');

for (const domain of ['ASSESSOR', 'TAX', 'PERMIT'] as const) {
  const profile = recordProfile.domainProfiles.find((candidate) => candidate.domain === domain);
  assert(profile, `${domain} profile must be present.`);
  assert.equal(profile.implementationDisposition, 'ARCHITECTURE_READY_SOURCE_CONFIRMATION_REQUIRED');
  assert.equal(profile.claimEligible, false);
  assert.equal(profile.propertyEvidenceAvailable, false);
  assert(profile.evidenceFingerprint.startsWith('pr-'), `${domain} profile must expose a deterministic evidence fingerprint.`);
  assert(profile.candidates.length >= 1, `${domain} profile must preserve official source candidates or a fail-closed fallback.`);
  assert(profile.verificationRequirement.length > 20, `${domain} profile must preserve the provider-confirmation requirement.`);
}

for (const [boundary, value] of Object.entries(recordProfile.protectedBoundaries)) {
  assert.equal(value, false, `${boundary} must remain false.`);
}

const sourceIntelligence = buildPropertyGeographicSourceIntelligence({
  address: '6137 Baseline Rd',
  city: 'Boulder',
  state: 'CO',
  zip: '80303',
  neighborhood: 'East Boulder',
  subdivision: 'Baseline',
  propertyType: 'Residential',
  status: 'Active',
  price: 1200000,
  sqft: 2400,
  yearBuilt: 1976,
  lotSize: 1.25,
});

assert.equal(sourceIntelligence.publicRecordEvidence.status, AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_STATUS);
assert.equal(sourceIntelligence.selectedSources.length, 7);
assert.equal(sourceIntelligence.selectedSources.filter((source) => source.claimEligible).length, 2);

for (const [category, domain] of [
  ['COUNTY_ASSESSOR', 'ASSESSOR'],
  ['COUNTY_TREASURER_TAX', 'TAX'],
  ['BUILDING_PERMITS', 'PERMIT'],
] as const) {
  const source = sourceIntelligence.selectedSources.find((candidate) => candidate.category === category);
  assert(source, `${category} source item must exist.`);
  assert.equal(source.readiness, 'FAIL_CLOSED_REVIEW_REQUIRED');
  assert.equal(source.claimEligible, false);
  assert.equal(source.recordDomain, domain);
  assert.equal(source.implementationDisposition, 'ARCHITECTURE_READY_SOURCE_CONFIRMATION_REQUIRED');
  assert.equal(source.jurisdiction, domain === 'PERMIT' ? 'Boulder County' : 'Boulder County');
  assert(source.evidenceFingerprint?.startsWith('pr-'), `${category} source item must expose a fingerprint.`);
}

const product = buildPropertyProduct31Model({
  address: '6137 Baseline Rd',
  city: 'Boulder',
  state: 'CO',
  zip: '80303',
  subdivision: 'Baseline',
  propertyType: 'Residential',
  status: 'Active',
  price: 1200000,
  sqft: 2400,
  beds: 4,
  baths: 3,
  yearBuilt: 1976,
  lotSize: 1.25,
});

assert.equal(product.authoritativeSources.publicRecordEvidence.status, AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_STATUS);
assert.equal(product.authoritativeSources.publicRecordEvidence.protectedBoundaries.recordRetrieval, false);
assert.equal(product.authoritativeSources.publicRecordEvidence.protectedBoundaries.customerRecordDisplay, false);
assert.equal(product.authoritativeSources.publicRecordEvidence.protectedBoundaries.persistence, false);
assert.equal(product.authoritativeSources.publicRecordEvidence.protectedBoundaries.prismaChange, false);

for (const componentSurface of [
  'data-testid="property-public-record-evidence-profile"',
  'data-property-record-intelligence={recordEvidence.status}',
  'data-property-record-disposition-assessor={recordDisposition',
  'data-property-record-disposition-tax={recordDisposition',
  'data-property-record-disposition-permit={recordDisposition',
  'data-property-record-customer-display={String(recordEvidence.protectedBoundaries.customerRecordDisplay)}',
  'data-property-record-retrieval={String(recordEvidence.protectedBoundaries.recordRetrieval)}',
  'data-property-record-correlation-confidence={recordEvidence.propertyCorrelation.correlationConfidence}',
  'data-property-record-disposition={source.implementationDisposition',
]) {
  assertIncludes(component, componentSurface, `Property Product 3.1 public-record surface missing: ${componentSurface}`);
}

for (const requiredIntegration of [
  'publicRecordEvidence',
  'buildPropertyPublicRecordEvidenceProfile',
  'implementationDisposition',
  'evidenceFingerprint',
]) {
  assertIncludes(sourceModel, requiredIntegration, `Source intelligence must integrate property-record contract: ${requiredIntegration}.`);
}

for (const requiredInput of ['state: property.state', 'zip: property.zip', 'subdivision: property.subdivision']) {
  assertIncludes(propertyPage, requiredInput, `Property page must pass existing field into record correlation: ${requiredInput}.`);
}

assertIncludes(productModel, 'state?: string | null', 'Property Product 3.1 input must accept existing state field.');
assertIncludes(productModel, 'zip?: string | null', 'Property Product 3.1 input must accept existing ZIP field.');
assertIncludes(productModel, 'subdivision?: string | null', 'Property Product 3.1 input must accept existing subdivision field.');

for (const forbiddenRuntime of [
  'fetch(',
  'XMLHttpRequest',
  'createClient(',
  'process.env',
  'prisma.',
  'localStorage',
  'sessionStorage',
  'navigator.sendBeacon',
  'INSERT INTO',
  'UPDATE "',
  'DELETE FROM',
  'BCOD API',
  'BCOD dataset',
  'automated valuation',
  'suitability score',
]) {
  assertNotIncludes([recordModel, sourceModel, productModel, component].join('\n'), forbiddenRuntime, `Property-record intelligence must not introduce ${forbiddenRuntime}.`);
}

assert.equal(
  packageJson.scripts?.['check:authoritative-property-record-intelligence'],
  'npm run worker:build && node dist/scripts/checkAuthoritativePropertyRecordIntelligence.js',
  'package.json must expose the authoritative property-record intelligence check.',
);
assertIncludes(tsconfig, 'scripts/checkAuthoritativePropertyRecordIntelligence.ts', 'Worker build must compile the authoritative property-record check.');
assertIncludes(tsconfig, 'lib/property/propertyPublicRecordEvidence.ts', 'Worker build must compile the property public-record evidence contract.');

console.log(
  '[authoritative-property-record-intelligence] ok: assessor, tax, and permit dispositions are architecture-ready/source-confirmation-required with no retrieval, persistence, provider activation, customer display, or protected-system mutation.',
);
