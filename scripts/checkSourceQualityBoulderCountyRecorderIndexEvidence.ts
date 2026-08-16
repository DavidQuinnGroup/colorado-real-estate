import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  BOULDER_COUNTY_RECORDER_INDEX_MANIFEST_ELIGIBILITY,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CONVERSION_REQUEST,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL,
  convertBoulderCountyRecorderIndexSourceQualityEvidence,
  createBoulderCountyRecorderIndexSourceQualityAssemblyRequest,
  normalizeBoulderCountyRecorderIndexSourceQualityEvidence,
  summarizeBoulderCountyRecorderIndexSourceQualityEvidence,
} from '../lib/sourceQualityBoulderCountyRecorderIndexEvidence';
import {
  COUNTY_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS,
  convertCountyStructuredEvidence,
  type CountySourceQualityConversionSourceClass,
} from '../lib/sourceQualityCountyEvidenceConversionContract';
import { PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS } from '../lib/sourceQualityPublicRecordEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';
import { getReieSourceRegistry } from '../lib/sourceRegistry';

const conversion = convertBoulderCountyRecorderIndexSourceQualityEvidence();
const normalized = normalizeBoulderCountyRecorderIndexSourceQualityEvidence();
const summary = summarizeBoulderCountyRecorderIndexSourceQualityEvidence();
const assembly = assembleSourceQualitySummaries(createBoulderCountyRecorderIndexSourceQualityAssemblyRequest());
const registryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID);

assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID, 'SRC-BOULDER-COUNTY-RECORDER-INDEX');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_RECORDED_DOCUMENT_INDEX');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.deepEqual(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CERTIFICATION, { certificationId: 'CERT-BOULDER-COUNTY-RECORDER-INDEX-SOURCE-QUALITY-EVIDENCE-001', repositoryReference: 'docs/project-atlas/executive-library', referenceVersion: 'V01', linkageReviewedDate: BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT });
assert.ok(registryRecord);
assert.equal(registryRecord?.responsibleOrganization, 'Boulder County Clerk and Recorder');
assert.equal(registryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(registryRecord?.category, 'RECORDED_DOCUMENT_INDEX');
assert.equal(registryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(registryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(registryRecord?.claimEligible, false);
assert.ok(COUNTY_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS.includes(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID));
assert.ok(PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS.includes(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID));
assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.classification, 'ASSEMBLED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');

const repeat = convertBoulderCountyRecorderIndexSourceQualityEvidence();
assert.equal(repeat.inputFingerprint, conversion.inputFingerprint);
assert.equal(repeat.conversionFingerprint, conversion.conversionFingerprint);
assert.notEqual(convertVariant('SRC-BOULDER-COUNTY-ASSESSOR', 'COUNTY_ASSESSOR').conversionFingerprint, conversion.conversionFingerprint);
assert.notEqual(convertVariant(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID, 'COUNTY_RECORDED_DOCUMENT_INDEX', 'V02').conversionFingerprint, conversion.conversionFingerprint);
assert.notEqual(convertVariant(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID, 'COUNTY_RECORDED_DOCUMENT_INDEX', undefined, 'PROPERTY_RECORD_CONTEXT').conversionFingerprint, conversion.conversionFingerprint);

for (const sourceId of ['EXP-SRC-BOULDER-COUNTY-RECORDER', 'SRA-BOULDER-COUNTY-RECORDER', 'SRC-BOULDER-COUNTY-ASSESSOR', 'SRC-BOULDER-COUNTY-TREASURER', 'SRC-BOULDER-COUNTY-ACCELA-PERMITS', 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS', 'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL', 'SRC-UNKNOWN-RECORDER']) {
  assert.notEqual(convertVariant(sourceId, 'COUNTY_RECORDED_DOCUMENT_INDEX').classification, 'COUNTY_EVIDENCE_CONVERSION_VALID', sourceId + ' must be rejected');
}

assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.indexBoundary, 'INDEX_OR_SEARCH_METADATA_NOT_DOCUMENT_CONTENT');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.registryAuthorization, 'AWAITING_PROVIDER_CONFIRMATION_NOT_PERMISSION');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.retrieval, 'SCRAPING_OR_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');

const runtime = await readFile(new URL('../lib/sourceQualityBoulderCountyRecorderIndexEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture', 'documentImage', 'ocrText', 'fullText', 'signature', 'rawInstrument']) assert.equal(runtime.includes(forbidden), false, 'Evidence runtime must not reference ' + forbidden);
assert.equal(runtime.includes('INDEX_OR_SEARCH_METADATA_NOT_DOCUMENT_CONTENT'), true);
console.log('[source-quality-boulder-county-recorder-index-evidence] ok');

function convertVariant(sourceId: string, sourceClass: CountySourceQualityConversionSourceClass, referenceVersion?: string, sensitivity?: 'PROPERTY_RECORD_CONTEXT' | 'RESTRICTED_OR_UNREVIEWED') {
  return convertCountyStructuredEvidence({
    ...BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceClass,
    certificationReference: { ...BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CERTIFICATION, referenceVersion: referenceVersion ?? BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CERTIFICATION.referenceVersion },
    fieldSensitivityPosture: sensitivity ?? BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  });
}
