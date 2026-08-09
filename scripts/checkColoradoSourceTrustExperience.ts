import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  buildColoradoSourceTrustExperience,
  COLORADO_SOURCE_TRUST_EXPERIENCE_STATUS,
  getCustomerSourceStatusLabel,
} from '../lib/coloradoSourceTrustExperience.js';
import { getReieSourceRegistry } from '../lib/sourceRegistry.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const sourceTrust = buildColoradoSourceTrustExperience();
const registry = getReieSourceRegistry();
const sourcesPage = read('app/sources/page.tsx');
const sourceTrustModel = read('lib/coloradoSourceTrustExperience.ts');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');

assert.equal(sourceTrust.status, COLORADO_SOURCE_TRUST_EXPERIENCE_STATUS);
assert.equal(sourceTrust.sourceRecords.length, registry.records.filter((record) => record.customerDisclosureEligible).length);
assert.equal(sourceTrust.countyCoverage.length, 64, 'Colorado county source directory must include 64 county identities.');
assert.equal(sourceTrust.protectedBoundaries.providerActivation, false);
assert.equal(sourceTrust.protectedBoundaries.sourceActivation, false);
assert.equal(sourceTrust.protectedBoundaries.countyDataAcquisition, false);
assert.equal(sourceTrust.protectedBoundaries.publicRecordRetrieval, false);
assert.equal(sourceTrust.protectedBoundaries.statewideCountyIngestion, false);
assert.equal(sourceTrust.protectedBoundaries.prismaChange, false);
assert.equal(sourceTrust.protectedBoundaries.telemetry, false);
assert.equal(sourceTrust.protectedBoundaries.customerDataMutation, false);
assert.equal(sourceTrust.protectedBoundaries.scoring, false);

for (const status of [
  'IN USE',
  'BEING EVALUATED',
  'AWAITING SOURCE CONFIRMATION',
  'LIMITED / MANUAL ACCESS',
  'NOT CURRENTLY AVAILABLE',
  'RESTRICTED',
  'REIE CALCULATION',
] as const) {
  assert(sourceTrust.statusLegend.some((item) => item.status === status), `Missing customer status legend item ${status}.`);
}

assert.equal(getCustomerSourceStatusLabel('Active'), 'IN USE');
assert.equal(getCustomerSourceStatusLabel('Awaiting confirmation'), 'AWAITING SOURCE CONFIRMATION');
assert.equal(getCustomerSourceStatusLabel('Blocked / not authorized'), 'RESTRICTED');
assert.equal(getCustomerSourceStatusLabel('Reference only'), 'LIMITED / MANUAL ACCESS');

const activeRecords = sourceTrust.sourceRecords.filter((record) => record.customerStatus === 'IN USE');
assert(activeRecords.every((record) => record.isInUse), 'Only active certified source records may be marked in use.');

for (const record of sourceTrust.sourceRecords) {
  if (record.customerStatus !== 'IN USE' && record.customerStatus !== 'REIE CALCULATION') {
    assert.equal(record.isInUse, false, `${record.sourceId} must not be marked in use.`);
    assert.doesNotMatch(record.currentReieUseStatus, /^Currently used/, `${record.sourceId} must not imply active use.`);
  }
  if (record.sourceId.includes('BCOD')) {
    assert.equal(record.customerStatus, 'RESTRICTED', `${record.sourceId} must remain restricted.`);
    assert.equal(record.isInUse, false, `${record.sourceId} must not be in use.`);
  }
}

const yuma = sourceTrust.countyCoverage.find((county) => county.county === 'Yuma');
assert(yuma, 'Yuma County must be represented in the neutral county directory.');
assert.equal(yuma.customerStatus, 'NOT CURRENTLY AVAILABLE');
assert.equal(yuma.isIntegrated, false);
assert.equal(yuma.officialSourceLinks.length, 0);

const boulder = sourceTrust.countyCoverage.find((county) => county.county === 'Boulder');
assert(boulder, 'Boulder County must be represented in the county directory.');
assert.equal(boulder.isIntegrated, false, 'Boulder County sources are not active integrated county evidence.');
assert(boulder.customerStatus === 'AWAITING SOURCE CONFIRMATION' || boulder.customerStatus === 'RESTRICTED');
assert(boulder.domains.includes('ASSESSOR / PROPERTY RECORDS'), 'Boulder directory should expose assessor/property-record domain from certified registry records.');

assert.equal(sourceTrust.countyCoverage.filter((county) => county.isIntegrated).length, 0, 'County directory must not claim any county source integration.');

for (const requiredSurface of [
  'data-testid="colorado-source-trust-status"',
  'data-testid="source-trust-status-legend"',
  'data-testid="source-trust-official-link"',
  'data-testid="colorado-source-county-directory"',
  'data-colorado-source-county-count={sourceTrust.countyCoverage.length}',
  'data-colorado-source-county-integrated={String(county.isIntegrated)}',
  'No governed customer-facing county source record',
]) {
  assertIncludes(sourcesPage, requiredSurface, `Sources page missing Source Trust surface marker: ${requiredSurface}`);
}

for (const requiredModelMarker of [
  'SOURCE AVAILABILITY',
  'MISSING COUNTY DATA',
  'MORE AVAILABLE DATA',
  'providerActivation: false',
  'sourceActivation: false',
  'countyDataAcquisition: false',
  'publicRecordRetrieval: false',
  'statewideCountyIngestion: false',
]) {
  assertIncludes(sourceTrustModel, requiredModelMarker, `Source Trust model must preserve boundary marker ${requiredModelMarker}.`);
}

for (const forbidden of [
  'provider email',
  'provider contact',
  'legal-review notes',
  'credentials',
  'rate-limit',
  'negotiation history',
  'opportunity score',
  'county score',
  'source score',
  'school ranking',
  'safety ranking',
  'demographic comparison',
  'protected-class',
  'fetch(',
  'createClient(',
  'process.env',
  'prisma.',
  'navigator.sendBeacon',
  'localStorage',
  'sessionStorage',
]) {
  assertNotIncludes([sourceTrustModel, sourcesPage].join('\n'), forbidden, `Source Trust implementation must not expose or introduce ${forbidden}.`);
}

assert.equal(
  packageJson.scripts?.['check:colorado-source-trust-experience'],
  'npm run worker:build && node dist/scripts/checkColoradoSourceTrustExperience.js',
  'package.json must expose Colorado Source Trust validation.',
);
assertIncludes(tsconfig, 'scripts/checkColoradoSourceTrustExperience.ts', 'Worker config must include Colorado Source Trust validation.');
assertIncludes(tsconfig, 'lib/coloradoSourceTrustExperience.ts', 'Worker config must include Colorado Source Trust model.');

console.log('[colorado-source-trust-experience] ok: status translation, county coverage, official links, restricted sources, fail-closed boundaries, mobile-safe /sources markers, and protected-system exclusions verified.');
