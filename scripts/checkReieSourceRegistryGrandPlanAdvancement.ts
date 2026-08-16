import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  REIE_SOURCE_REGISTRY_REFERENCE_DATE,
  REIE_SOURCE_REGISTRY_STATUS,
  getPublicSourceRegistryRecords,
  getReieSourceRegistry,
} from '../lib/sourceRegistry.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function record(sourceId: string) {
  const match = getReieSourceRegistry().records.find((item) => item.sourceId === sourceId);
  assert.ok(match, `Expected Source Registry record ${sourceId}.`);
  return match;
}

const registry = getReieSourceRegistry();
const publicRecords = getPublicSourceRegistryRecords();
const sourceIds = registry.records.map((item) => item.sourceId);

assert.equal(registry.status, REIE_SOURCE_REGISTRY_STATUS, 'Source Registry status must be implemented.');
assert.equal(registry.referenceDate, REIE_SOURCE_REGISTRY_REFERENCE_DATE, 'Source Registry reference date must be stable.');
assert.equal(new Set(sourceIds).size, sourceIds.length, 'Source Registry source ids must be unique.');
assert.ok(registry.records.length >= 9, 'Source Registry must include initial governed records.');
assert.equal(publicRecords.length, registry.records.length, 'Initial public registry records must be disclosure eligible.');

for (const sourceClass of ['AUTHORITATIVE_SOURCE', 'LICENSED_PROFESSIONAL_SOURCE', 'SUPPLEMENTAL_SOURCE', 'REIE_DERIVED_INTELLIGENCE'] as const) {
  assert.ok(registry.records.some((item) => item.sourceClass === sourceClass), `Expected source class ${sourceClass}.`);
}

for (const state of ['ACTIVE_AUTHORIZED', 'AWAITING_PROVIDER_CONFIRMATION', 'BLOCKED_NOT_AUTHORIZED', 'REFERENCE_ONLY', 'REIE_DERIVED'] as const) {
  assert.ok(registry.records.some((item) => item.productionActivationState === state), `Expected activation state ${state}.`);
}

const assessor = record('SRC-BOULDER-COUNTY-ASSESSOR');
assert.equal(assessor.publicName, 'Boulder County Assessor');
assert.equal(assessor.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(assessor.productionActivationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(assessor.claimEligible, false);
assert.match(assessor.currentReieUse, /Identified source candidate only/);
assert.match(assessor.currentReieUse, /no automated retrieval/);

const parcelGisSourceId = 'SRC-BOULDER-COUNTY-PARCEL-GIS';
assert.equal(registry.records.filter((item) => item.sourceId === parcelGisSourceId).length, 1, 'Parcel GIS source must exist exactly once.');
const parcelGis = record(parcelGisSourceId);
const parcelGisText = JSON.stringify(parcelGis);
assert.equal(parcelGis.publicName, 'Boulder County GIS Parcel Boundaries / Parcels');
assert.equal(parcelGis.responsibleOrganization, "Boulder County Assessor's Office");
assert.equal(parcelGis.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(parcelGis.category, 'PARCEL_GEOMETRY');
assert.equal(parcelGis.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(parcelGis.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(parcelGis.claimEligible, false);
assert.equal(parcelGis.customerStatus, 'Blocked / not authorized');
assert.match(parcelGis.currentReieUse, /Exact source identity only/);
assert.match(parcelGis.currentReieUse, /future-governed parcel geometry review/);
assert.match(parcelGis.currentReieUse, /no parcel geometry/);
assert.match(parcelGis.currentReieUse, /no .* retrieval/);
assert.match(parcelGis.currentReieUse, /no .* feature-service call/);
assert.match(parcelGis.currentReieUse, /no .* download/);
assert.match(parcelGis.currentReieUse, /no .* customer display/);
assert.match(parcelGisText, /PARCEL_GEOMETRY_NOT_OWNERSHIP/);
assert.match(parcelGisText, /PARCEL_GEOMETRY_NOT_LEGAL_DESCRIPTION/);
assert.match(parcelGisText, /PARCEL_GEOMETRY_NOT_ASSESSOR_RECORD/);
assert.match(parcelGisText, /PARCEL_GEOMETRY_NOT_TITLE/);
assert.match(parcelGisText, /GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY/);
assert.match(parcelGisText, /OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY/);
assert.match(parcelGisText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(parcelGisText, /Address Points cannot confirm parcel identity/);
assert.match(parcelGisText, /Park Boundaries cannot establish parcel or property facts/);
assert.match(parcelGisText, /does not grant evidence, rights, freshness, attribution, access, or governance inheritance/);
assert.match(parcelGisText, /Technical access, freshness, attribution, disclaimer, rights, and provenance remain unresolved/);
assert.doesNotMatch(parcelGisText, /ownership truth|owner identity authorized|assessed value|tax status|sales truth|permit truth|zoning truth|legal description authority|title validity/i);
assert.doesNotMatch(parcelGisText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|PROVENANCE = COMPLETE/);
assert.doesNotMatch(parcelGisText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => /^SRC-BOULDER-COUNTY-PARCEL-(?!GIS$)/.test(item.sourceId)).length, 0, 'Unknown speculative Boulder County parcel source ids must reject.');
assert.equal(registry.records.filter((item) => /PARCEL.*(OWNERSHIP|ASSESSOR|TITLE|TAX|PERMIT|ZONING|LEGAL_DESCRIPTION)/i.test(item.sourceId)).length, 0, 'Parcel GIS MVV must not add parcel-derived protected domain sources.');
assert.ok(!fs.existsSync('lib/sourceQualityBoulderCountyParcelGisEvidence.ts'), 'Parcel GIS Source Quality evidence must not be added in Registry MVV.');

const recorderSourceId = 'SRC-BOULDER-COUNTY-RECORDER-INDEX';
assert.equal(registry.records.filter((item) => item.sourceId === recorderSourceId).length, 1, 'Recorder index source must exist exactly once.');
const recorder = record(recorderSourceId);
const recorderText = JSON.stringify(recorder);
assert.equal(recorder.responsibleOrganization, 'Boulder County Clerk and Recorder');
assert.equal(recorder.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(recorder.category, 'RECORDED_DOCUMENT_INDEX');
assert.equal(recorder.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(recorder.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(recorder.claimEligible, false);
assert.equal(recorder.customerDisclosureEligible, true);
assert.match(recorder.currentReieUse, /Recorded-document search\/index reference/);
assert.match(recorder.currentReieUse, /verification metadata/);
assert.match(recorder.currentReieUse, /future structured Source Quality evidence/);
assert.match(recorderText, /INDEX_OR_SEARCH_METADATA_NOT_DOCUMENT_CONTENT/);
assert.match(recorderText, /Document images, scanned instruments, OCR, full text, signatures/);
assert.match(recorderText, /legal descriptions extracted from document bodies/);
assert.match(recorderText, /certified-copy fulfillment/);
assert.match(recorderText, /document-content storage/);
assert.match(recorderText, /document-content redistribution/);
assert.match(recorderText, /Rights, technical access, freshness, attribution, fees, privacy approval, and provenance remain unknown/);
assert.match(recorderText, /Public-record or government-source status does not establish unrestricted reuse/);
assert.match(recorderText, /automated extraction/);
assert.match(recorderText, /legal-use approval/);
assert.match(recorderText, /customer display/);
assert.match(recorderText, /EXP-SRC-BOULDER-COUNTY-RECORDER remains discovery-only context/);
assert.match(recorderText, /SRA-BOULDER-COUNTY-RECORDER remains readiness\/risk context only/);
assert.match(recorderText, /grants no SRC authority inheritance/);
assert.match(recorderText, /COUNTY_RECORDED_DOCUMENT_INDEX/);
assert.doesNotMatch(recorderText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(recorderText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => /RECORDER.*(CONTENT|IMAGE|OCR|FULL_TEXT|CERTIFIED_COPY)/i.test(item.sourceId)).length, 0, 'No document-content Recorder source may be added.');

const experimentalSource = read('lib/coloradoCityEvidenceExpansion.ts');
assert.match(experimentalSource, /sourceId:\s*'EXP-SRC-BOULDER-COUNTY-RECORDER'/, 'Experimental Recorder source context must remain present.');
assert.match(experimentalSource, /document reuse, OCR\/full-text use, fees, and public display rights require review/, 'EXP Recorder context must remain non-operational review context.');
assert.doesNotMatch(experimentalSource, /SRC-BOULDER-COUNTY-RECORDER-INDEX/, 'EXP context must not be converted into the exact operational source.');

const sourceRightsReadiness = read('lib/sourceRightsActivationReadiness.ts');
assert.match(sourceRightsReadiness, /sourceId:\s*'SRA-BOULDER-COUNTY-RECORDER'/, 'SRA Recorder readiness context must remain present.');
assert.match(sourceRightsReadiness, /legalEntityOrProvider:\s*'Boulder County Clerk and Recorder'/, 'SRA Recorder context must keep the Clerk and Recorder authority label.');
assert.match(sourceRightsReadiness, /LEGAL_REVIEW_REQUIRED/, 'SRA Recorder context must not become activation authority.');
assert.match(sourceRightsReadiness, /activationCandidate:\s*false/, 'SRA Recorder context must remain non-activation readiness context.');
assert.doesNotMatch(sourceRightsReadiness, /SRC-BOULDER-COUNTY-RECORDER-INDEX/, 'SRA context must not grant exact SRC authority inheritance.');
if (fs.existsSync('lib/sourceQualityBoulderCountyRecorderIndexEvidence.ts')) {
  const recorderEvidence = read('lib/sourceQualityBoulderCountyRecorderIndexEvidence.ts');
  assert.match(recorderEvidence, /SRC-BOULDER-COUNTY-RECORDER-INDEX/, 'Recorder evidence must bind to the canonical exact source identity.');
  assert.doesNotMatch(recorderEvidence, /EXP-SRC-BOULDER-COUNTY-RECORDER|SRA-BOULDER-COUNTY-RECORDER/, 'Recorder evidence must not inherit EXP or SRA authority.');
  assert.doesNotMatch(recorderEvidence, /documentImage|scannedInstrument|ocrText|fullText|signature|documentBody|certifiedCopyContent|rawInstrumentPayload|documentContentRedistribution/, 'Recorder evidence must not imply document-content authority.');
}

const permitSourceIds = [
  'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
  'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL',
  'SRC-BOULDER-COUNTY-ACCELA-PERMITS',
] as const;
assert.equal(registry.records.filter((item) => permitSourceIds.includes(item.sourceId as (typeof permitSourceIds)[number])).length, permitSourceIds.length);
for (const sourceId of permitSourceIds) {
  const permit = record(sourceId);
  assert.equal(permit.sourceClass, 'AUTHORITATIVE_SOURCE');
  assert.equal(permit.category, 'BUILDING_PERMITS');
  assert.equal(permit.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
  assert.equal(permit.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
  assert.equal(permit.claimEligible, false);
  assert.equal(permit.customerDisclosureEligible, true);
  assert.match(permit.currentReieUse, /Verification prompt only/);
  assert.match(permit.currentReieUse, /no .* retrieval/);
  assert.match(permit.currentReieUse, /no .* customer display/);
  assert.ok(permit.limitations.some((limitation) => /rights|access|freshness|attribution|privacy|automation|display/i.test(limitation)));
}
assert.equal(record('SRC-CITY-BOULDER-OPEN-DATA-PERMITS').responsibleOrganization, 'City of Boulder');
assert.equal(record('SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL').responsibleOrganization, 'City of Boulder');
assert.equal(record('SRC-BOULDER-COUNTY-ACCELA-PERMITS').responsibleOrganization, 'Boulder County Community Planning & Permitting / Accela');
assert.match(record('SRC-CITY-BOULDER-OPEN-DATA-PERMITS').limitations.join(' '), /Open-data availability does not establish unrestricted reuse/);
assert.match(record('SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL').limitations.join(' '), /Portal availability does not establish approved automated access/);
assert.match(record('SRC-BOULDER-COUNTY-ACCELA-PERMITS').limitations.join(' '), /Boulder County channel only; no municipal authority inference/);
const permitCandidate = record('SRC-BOULDER-PERMIT-CANDIDATES');
assert.match(permitCandidate.currentReieUse, /Source-candidate and verification-prompt context only/);
assert.match(permitCandidate.currentReieUse, /no permit record is retrieved or displayed/);
assert.doesNotMatch(permitCandidate.currentReieUse, /aggregate|member|parent|child/i);
assert.doesNotMatch(JSON.stringify(permitCandidate), /memberSourceIds|parentSourceId|aggregateSource/i);

for (const sourceId of ['SRC-BCOD-ADDRESS-POINTS', 'SRC-BCOD-PARK-BOUNDARIES']) {
  const bcod = record(sourceId);
  assert.equal(bcod.responsibleOrganization, 'Boulder County Open Data');
  assert.equal(bcod.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
  assert.equal(bcod.claimEligible, false);
  assert.ok(
    bcod.limitations.some((limitation) => limitation.includes('No API use, download, persistence, transformation, geometry, map rendering')),
      `${sourceId} must preserve no-activation BCOD boundaries.`,
  );
}
assert.notEqual(record('SRC-BCOD-ADDRESS-POINTS').category, 'PARCEL_GEOMETRY', 'Address Points must not substitute for Parcel GIS.');
assert.notEqual(record('SRC-BCOD-PARK-BOUNDARIES').category, 'PARCEL_GEOMETRY', 'Park Boundaries must not substitute for Parcel GIS.');

for (const sourceId of ['SRC-REIE-FINANCING-SCENARIO-CALCULATOR', 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE']) {
  const derived = record(sourceId);
  assert.equal(derived.sourceClass, 'REIE_DERIVED_INTELLIGENCE');
  assert.equal(derived.productionActivationState, 'REIE_DERIVED');
  assert.equal(derived.officialUrl, null);
}

for (const [boundary, value] of Object.entries(registry.protectedBoundaries)) {
  assert.equal(value, false, `Protected boundary ${boundary} must remain false.`);
}

assert.ok(
  registry.statewideScalingContract.some((item) => item.includes('A Boulder County source decision does not authorize another county')),
  'Statewide scaling contract must prevent Boulder decisions from authorizing statewide use.',
);

const sourcesPage = read('app/sources/page.tsx');
assert.match(sourcesPage, /Sources & Methodology/, 'Sources page must expose public methodology title.');
assert.match(sourcesPage, /getPublicSourceRegistryRecords/, 'Sources page must use governed registry records.');
assert.match(sourcesPage, /data-testid="sources-registry-records"/, 'Sources page must expose registry record collection handle.');
assert.match(sourcesPage, /data-source-activation-state/, 'Sources page must expose activation state metadata.');
assert.match(sourcesPage, /authorized automated use/, 'Sources page must explain public availability is not automation authorization.');
assert.doesNotMatch(sourcesPage, /process\.env|api key|credential|secret|internal endpoint/i, 'Sources page must not expose private integration details.');

const publicTrustSource = read('lib/publicTrust.ts');
const footer = read('components/Footer.tsx');
const sitemap = read('app/sitemap.ts');
assert.match(publicTrustSource, /href:\s*'\/sources'/, 'Public trust routes must include /sources.');
assert.match(footer, /publicTrustRoutes/, 'Footer must render governed public trust routes.');
assert.match(sitemap, /publicTrustRoutes/, 'Sitemap must include governed public trust routes.');

const grandPlanPage = read('app/grand-plan/page.tsx');
assert.match(grandPlanPage, /data-grand-plan-advancement="SOURCE_REGISTRY_GRAND_PLAN_ADVANCEMENT"/, 'Grand Plan must expose advancement marker.');
assert.match(grandPlanPage, /data-testid="grand-plan-decision-orchestration"/, 'Grand Plan must expose decision orchestration section.');
assert.match(grandPlanPage, /data-testid="grand-plan-certified-continuity"/, 'Grand Plan must expose certified continuity section.');
assert.match(grandPlanPage, /href: '\/sources'/, 'Grand Plan continuity must link Sources & Methodology.');
assert.match(grandPlanPage, /data-grand-plan-hidden-state-transfer="false"/, 'Grand Plan must preserve no hidden state transfer.');
assert.match(grandPlanPage, /data-grand-plan-scoring="false"/, 'Grand Plan must preserve no-scoring boundary.');
assert.match(grandPlanPage, /data-grand-plan-telemetry="false"/, 'Grand Plan must preserve no-telemetry boundary.');
assert.doesNotMatch(grandPlanPage, /localStorage|sessionStorage|navigator\.sendBeacon|data-grand-plan-scoring="true"/, 'Grand Plan must not introduce hidden state or telemetry.');
assert.ok(!fs.existsSync('app/api/grand-plan/route.ts'), 'Grand Plan must not introduce a duplicate API route.');

const packageJson = read('package.json');
const workerConfig = read('tsconfig.worker.json');
const operationalManifestData = read('lib/sourceQualityOperationalManifestData.ts');
assert.match(packageJson, /check:reie-source-registry-grand-plan-advancement/, 'Package scripts must expose the advancement check.');
assert.match(workerConfig, /scripts\/checkReieSourceRegistryGrandPlanAdvancement\.ts/, 'Worker build must include the advancement check.');
assert.match(workerConfig, /lib\/sourceRegistry\.ts/, 'Worker build must include the Source Registry.');
assert.doesNotMatch(operationalManifestData, /SRC-BOULDER-COUNTY-PARCEL-GIS/, 'Parcel GIS must not be added to the Source Quality Operational Manifest by the Registry MVV.');

console.log(
  `[reie-source-registry-grand-plan-advancement] ok: ${registry.records.length} source records, Parcel GIS exact source identity, public /sources methodology, Grand Plan orchestration, certified continuity, statewide source boundaries, and protected no-activation contract verified.`,
);
