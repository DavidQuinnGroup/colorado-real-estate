import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  CITY_BOULDER_OPEN_DATA_PERMITS_MANIFEST_ELIGIBILITY,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CERTIFICATION,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL,
  convertCityBoulderOpenDataPermitsSourceQualityEvidence,
  createCityBoulderOpenDataPermitsSourceQualityAssemblyRequest,
  normalizeCityBoulderOpenDataPermitsSourceQualityEvidence,
  summarizeCityBoulderOpenDataPermitsSourceQualityEvidence,
} from '../lib/sourceQualityCityBoulderOpenDataPermitsEvidence';
import {
  convertPublicRecordStructuredEvidence,
} from '../lib/sourceQualityPublicRecordEvidenceConversionContract';
import { getReieSourceRegistry } from '../lib/sourceRegistry';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const conversion = convertCityBoulderOpenDataPermitsSourceQualityEvidence();
const request = CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST;

assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID, 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS');
assert.equal(request.sourceId, CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID);
assert.equal(request.sourceClass, 'MUNICIPAL_OPEN_DATA_PERMIT');
assert.equal(request.sourceConfirmation?.sourceId, CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID);
assert.equal(request.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(request.fieldSensitivityPosture, 'IDENTIFIER_BEARING_CONTEXT');
assert.equal(request.reviewedAt, CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(request.certificationReference?.certificationId, CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(request.evidenceReferences.length, 1);
assert.equal(request.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(request.evidenceReferences[0]?.sourceId, CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID);
assert.equal(conversion.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.posture, 'REFERENCED');

const registryRecord = getReieSourceRegistry().records.find((item) => item.sourceId === CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID);
assert.ok(registryRecord);
assert.equal(registryRecord.responsibleOrganization, 'City of Boulder');
assert.equal(registryRecord.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(registryRecord.category, 'BUILDING_PERMITS');
assert.equal(registryRecord.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(registryRecord.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(registryRecord.claimEligible, false);
assert.match(registryRecord.limitations.join(' '), /Open-data availability does not establish unrestricted reuse/);

for (const sourceId of [
  'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL',
  'SRC-BOULDER-COUNTY-ACCELA-PERMITS',
  'SRC-BOULDER-PERMIT-CANDIDATES',
  'SRC-BOULDER-COUNTY-ASSESSOR',
  'SRC-BOULDER-COUNTY-TREASURER',
  'SRC-UNKNOWN-PUBLIC-RECORD',
] as const) {
  const result = convertPublicRecordStructuredEvidence({
    ...request,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: request.reviewedAt },
    evidenceReferences: [{ ...request.evidenceReferences[0]!, sourceId }],
  });
  assert.notEqual(result.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
}

assert.equal(convertPublicRecordStructuredEvidence({ ...request, certificationReference: undefined }).classification, 'PUBLIC_RECORD_CERTIFICATION_REQUIRED');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, sourceConfirmation: undefined }).classification, 'PUBLIC_RECORD_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, reviewedAt: '' }).classification, 'PUBLIC_RECORD_REFERENCE_INVALID');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'PUBLIC_RECORD_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, evidenceReferences: [] }).classification, 'PUBLIC_RECORD_EVIDENCE_INSUFFICIENT');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, narrative: 'not composable' }).classification, 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, evidenceReferences: [{ ...request.evidenceReferences[0]!, applicantName: 'not allowed' }] }).classification, 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED');

assert.equal(convertCityBoulderOpenDataPermitsSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertCityBoulderOpenDataPermitsSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);
assert.notEqual(convertPublicRecordStructuredEvidence({
  ...request,
  certificationReference: { ...request.certificationReference!, referenceVersion: 'V02' },
}).conversionFingerprint, conversion.conversionFingerprint);
assert.notEqual(convertPublicRecordStructuredEvidence({
  ...request,
  fieldSensitivityPosture: 'PROPERTY_RECORD_CONTEXT',
}).conversionFingerprint, conversion.conversionFingerprint);

const normalized = normalizeCityBoulderOpenDataPermitsSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');

const summary = summarizeCityBoulderOpenDataPermitsSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');

const assembly = assembleSourceQualitySummaries(createCityBoulderOpenDataPermitsSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.retrieval, 'SCRAPING_OR_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.redistribution, 'REDISTRIBUTION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.openDataFallacy, 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY');

const runtime = await readFile(new URL('../lib/sourceQualityCityBoulderOpenDataPermitsEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['sourceRightsActivationReadiness', 'SRA-', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'narrative', 'applicant', 'ownerName', 'mailingAddress', 'rawRecord']) assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);

console.log('[source-quality-city-boulder-open-data-permits-evidence] ok: exact City Open Data certification-only evidence reuses canonical public-record conversion with identifier-bearing governance metadata, preserved unknowns, sparse assembly acceptance, and no authority grant.');
