import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS,
  PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL,
  SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  convertPublicRecordStructuredEvidence,
  createPublicRecordSourceQualityAssemblyRequest,
  type PublicRecordSourceQualityEvidenceConversionRequest,
} from '../lib/sourceQualityPublicRecordEvidenceConversionContract';
import { summarizeSourceQuality } from '../lib/sourceQualityControl';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const certificationReference = {
  certificationId: 'CERT-PUBLIC-RECORD-CONVERSION-SYNTHETIC-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: '2026-08-15',
} as const;

const request: PublicRecordSourceQualityEvidenceConversionRequest = {
  schemaVersion: SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  sourceId: 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
  sourceClass: 'MUNICIPAL_OPEN_DATA_PERMIT',
  sourceConfirmation: {
    sourceId: 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-15',
  },
  evidenceReferences: [{
    sourceId: 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'PUBLIC-RECORD-CONVERSION-CITY-OPEN-DATA-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  certificationReference,
  fieldSensitivityPosture: 'IDENTIFIER_BEARING_CONTEXT',
  conversionAuthorityClass: 'EXECUTIVE_PUBLIC_RECORD_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: '2026-08-15',
};

const recorderRequest: PublicRecordSourceQualityEvidenceConversionRequest = {
  ...request,
  sourceId: 'SRC-BOULDER-COUNTY-RECORDER-INDEX',
  sourceClass: 'COUNTY_RECORDED_DOCUMENT_INDEX',
  sourceConfirmation: {
    sourceId: 'SRC-BOULDER-COUNTY-RECORDER-INDEX',
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-15',
  },
  evidenceReferences: [{
    sourceId: 'SRC-BOULDER-COUNTY-RECORDER-INDEX',
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'PUBLIC-RECORD-CONVERSION-RECORDER-INDEX-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
};

assert.deepEqual(PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS, [
  'SRC-BOULDER-COUNTY-ASSESSOR',
  'SRC-ARAPAHOE-COUNTY-ASSESSOR',
  'SRC-BROOMFIELD-COUNTY-ASSESSOR',
  'SRC-JEFFERSON-COUNTY-ASSESSOR',
  'SRC-LARIMER-COUNTY-ASSESSOR',
  'SRC-BOULDER-COUNTY-TREASURER',
  'SRC-BOULDER-COUNTY-RECORDER-INDEX',
  'SRC-BOULDER-COUNTY-ACCELA-PERMITS',
  'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
  'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL',
]);
assert.equal(PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS.includes('SRC-BOULDER-PERMIT-CANDIDATES' as never), false);

const valid = convertPublicRecordStructuredEvidence(request);
assert.equal(valid.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(valid.sourceId, 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS');
assert.equal(valid.linkages.length, 1);
assert.equal(valid.linkages[0]?.sourceId, 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS');
assert.equal(valid.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(valid.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(valid.linkages[0]?.posture, 'REFERENCED');
assert.equal(valid.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(valid.normalized?.rights.posture, 'UNKNOWN');
assert.equal(valid.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(valid.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(valid.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(valid.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertPublicRecordStructuredEvidence(request).inputFingerprint, valid.inputFingerprint);
assert.equal(convertPublicRecordStructuredEvidence(request).conversionFingerprint, valid.conversionFingerprint);

assert.equal(convertPublicRecordStructuredEvidence({
  ...request,
  sourceId: 'SRC-UNKNOWN-PUBLIC-RECORD',
  sourceConfirmation: { sourceId: 'SRC-UNKNOWN-PUBLIC-RECORD', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
  evidenceReferences: [{ ...request.evidenceReferences[0]!, sourceId: 'SRC-UNKNOWN-PUBLIC-RECORD' }],
}).classification, 'PUBLIC_RECORD_SOURCE_INVALID');
assert.equal(convertPublicRecordStructuredEvidence({
  ...request,
  sourceId: 'SRC-BOULDER-PERMIT-CANDIDATES',
  sourceConfirmation: { sourceId: 'SRC-BOULDER-PERMIT-CANDIDATES', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
  evidenceReferences: [{ ...request.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-PERMIT-CANDIDATES' }],
}).classification, 'PUBLIC_RECORD_SOURCE_INVALID');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, sourceClass: 'COUNTY_PERMIT' }).classification, 'PUBLIC_RECORD_SOURCE_MISMATCH');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, sourceConfirmation: undefined }).classification, 'PUBLIC_RECORD_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, certificationReference: undefined }).classification, 'PUBLIC_RECORD_CERTIFICATION_REQUIRED');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, reviewedAt: '' }).classification, 'PUBLIC_RECORD_REFERENCE_INVALID');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'PUBLIC_RECORD_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, evidenceReferences: [] }).classification, 'PUBLIC_RECORD_EVIDENCE_INSUFFICIENT');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, narrative: 'not composable' }).classification, 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, evidenceReferences: [{ ...request.evidenceReferences[0]!, applicantName: 'not allowed' }] }).classification, 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED');
assert.equal(convertPublicRecordStructuredEvidence({ ...request, evidenceReferences: [{ ...request.evidenceReferences[0]!, sourceId: 'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL' }] }).classification, 'PUBLIC_RECORD_REFERENCE_INVALID');

const recorder = convertPublicRecordStructuredEvidence(recorderRequest);
assert.equal(recorder.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(recorder.sourceId, 'SRC-BOULDER-COUNTY-RECORDER-INDEX');
assert.equal(recorder.linkages.length, 1);
assert.equal(recorder.linkages[0]?.sourceId, 'SRC-BOULDER-COUNTY-RECORDER-INDEX');
assert.equal(recorder.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(recorder.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(recorder.linkages[0]?.posture, 'REFERENCED');
assert.equal(recorder.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(recorder.normalized?.rights.posture, 'UNKNOWN');
assert.equal(recorder.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(recorder.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(recorder.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(recorder.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertPublicRecordStructuredEvidence(recorderRequest).inputFingerprint, recorder.inputFingerprint);
assert.equal(convertPublicRecordStructuredEvidence(recorderRequest).conversionFingerprint, recorder.conversionFingerprint);
for (const sourceClass of ['COUNTY_ASSESSOR', 'COUNTY_TREASURER', 'COUNTY_PERMIT', 'MUNICIPAL_OPEN_DATA_PERMIT', 'MUNICIPAL_PERMIT_PORTAL'] as const) {
  assert.equal(convertPublicRecordStructuredEvidence({ ...recorderRequest, sourceClass }).classification, 'PUBLIC_RECORD_SOURCE_MISMATCH');
}
for (const sourceId of ['EXP-SRC-BOULDER-COUNTY-RECORDER', 'SRA-BOULDER-COUNTY-RECORDER', 'SRC-GENERIC-COUNTY-RECORDER', 'RECORDER']) {
  assert.equal(convertPublicRecordStructuredEvidence({
    ...recorderRequest,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
    evidenceReferences: [{ ...recorderRequest.evidenceReferences[0]!, sourceId }],
  }).classification, 'PUBLIC_RECORD_SOURCE_INVALID');
}
for (const sourceId of [
  'SRC-BOULDER-COUNTY-ASSESSOR',
  'SRC-BOULDER-COUNTY-TREASURER',
  'SRC-BOULDER-COUNTY-ACCELA-PERMITS',
  'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
  'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL',
]) {
  assert.equal(convertPublicRecordStructuredEvidence({
    ...recorderRequest,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
    evidenceReferences: [{ ...recorderRequest.evidenceReferences[0]!, sourceId }],
  }).classification, 'PUBLIC_RECORD_SOURCE_MISMATCH');
}
assert.equal(convertPublicRecordStructuredEvidence({ ...recorderRequest, sourceConfirmation: undefined }).classification, 'PUBLIC_RECORD_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertPublicRecordStructuredEvidence({ ...recorderRequest, certificationReference: undefined }).classification, 'PUBLIC_RECORD_CERTIFICATION_REQUIRED');
assert.equal(convertPublicRecordStructuredEvidence({ ...recorderRequest, reviewedAt: '' }).classification, 'PUBLIC_RECORD_REFERENCE_INVALID');
assert.equal(convertPublicRecordStructuredEvidence({ ...recorderRequest, narrative: 'not composable' }).classification, 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED');
for (const key of ['ownerName', 'address', 'documentImage', 'scannedInstrument', 'ocrText', 'fullText', 'signature', 'documentBody', 'legalDescription', 'certifiedCopyContent', 'rawInstrumentPayload', 'documentContentRedistribution']) {
  assert.equal(convertPublicRecordStructuredEvidence({
    ...recorderRequest,
    evidenceReferences: [{ ...recorderRequest.evidenceReferences[0]!, [key]: 'not composable' }],
  }).classification, 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED');
}

const arapahoeAssessorRequest: PublicRecordSourceQualityEvidenceConversionRequest = {
  ...request,
  sourceId: 'SRC-ARAPAHOE-COUNTY-ASSESSOR',
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: {
    sourceId: 'SRC-ARAPAHOE-COUNTY-ASSESSOR',
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-16',
  },
  evidenceReferences: [{
    sourceId: 'SRC-ARAPAHOE-COUNTY-ASSESSOR',
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'PUBLIC-RECORD-CONVERSION-ARAPAHOE-ASSESSOR-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: '2026-08-16',
};
const arapahoeAssessor = convertPublicRecordStructuredEvidence(arapahoeAssessorRequest);
assert.equal(arapahoeAssessor.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(arapahoeAssessor.sourceId, 'SRC-ARAPAHOE-COUNTY-ASSESSOR');
assert.equal(arapahoeAssessor.linkages.length, 1);
assert.equal(arapahoeAssessor.linkages[0]?.sourceId, 'SRC-ARAPAHOE-COUNTY-ASSESSOR');
assert.equal(arapahoeAssessor.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(arapahoeAssessor.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(arapahoeAssessor.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(arapahoeAssessor.normalized?.rights.posture, 'UNKNOWN');
assert.equal(arapahoeAssessor.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(arapahoeAssessor.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(arapahoeAssessor.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(arapahoeAssessor.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertPublicRecordStructuredEvidence(arapahoeAssessorRequest).conversionFingerprint, arapahoeAssessor.conversionFingerprint);
assert.notEqual(arapahoeAssessor.conversionFingerprint, valid.conversionFingerprint);
for (const sourceId of ['EXP-SRC-ARAPAHOE-COUNTY-ASSESSOR', 'SRA-ARAPAHOE-COUNTY-ASSESSOR', 'SRC-GENERIC-COUNTY-ASSESSOR', 'SRC-PROVIDER-COUNTY-ASSESSOR', 'SRC-ARAPAHOE-PARCEL-SEARCH', 'SRC-ARAPAHOE-ASSESSOR-DATA-MART', 'SRC-ARAPAHOE-GIS']) {
  assert.equal(convertPublicRecordStructuredEvidence({
    ...arapahoeAssessorRequest,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...arapahoeAssessorRequest.evidenceReferences[0]!, sourceId }],
  }).classification, 'PUBLIC_RECORD_SOURCE_INVALID');
}
assert.equal(convertPublicRecordStructuredEvidence({ ...arapahoeAssessorRequest, sourceClass: 'COUNTY_TREASURER' }).classification, 'PUBLIC_RECORD_SOURCE_MISMATCH');
assert.equal(convertPublicRecordStructuredEvidence({ ...arapahoeAssessorRequest, sourceConfirmation: undefined }).classification, 'PUBLIC_RECORD_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertPublicRecordStructuredEvidence({ ...arapahoeAssessorRequest, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'PUBLIC_RECORD_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertPublicRecordStructuredEvidence({ ...arapahoeAssessorRequest, ownerName: 'not allowed' }).classification, 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED');
assert.equal(convertPublicRecordStructuredEvidence({
  ...arapahoeAssessorRequest,
  evidenceReferences: [{ ...arapahoeAssessorRequest.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-COUNTY-ASSESSOR' }],
}).classification, 'PUBLIC_RECORD_REFERENCE_INVALID');

const broomfieldAssessorRequest: PublicRecordSourceQualityEvidenceConversionRequest = {
  ...request,
  sourceId: 'SRC-BROOMFIELD-COUNTY-ASSESSOR',
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: {
    sourceId: 'SRC-BROOMFIELD-COUNTY-ASSESSOR',
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-16',
  },
  evidenceReferences: [{
    sourceId: 'SRC-BROOMFIELD-COUNTY-ASSESSOR',
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'PUBLIC-RECORD-CONVERSION-BROOMFIELD-ASSESSOR-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: '2026-08-16',
};
const broomfieldAssessor = convertPublicRecordStructuredEvidence(broomfieldAssessorRequest);
assert.equal(broomfieldAssessor.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(broomfieldAssessor.sourceId, 'SRC-BROOMFIELD-COUNTY-ASSESSOR');
assert.equal(broomfieldAssessor.linkages.length, 1);
assert.equal(broomfieldAssessor.linkages[0]?.sourceId, 'SRC-BROOMFIELD-COUNTY-ASSESSOR');
assert.equal(broomfieldAssessor.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(broomfieldAssessor.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(broomfieldAssessor.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(broomfieldAssessor.normalized?.rights.posture, 'UNKNOWN');
assert.equal(broomfieldAssessor.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(broomfieldAssessor.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(broomfieldAssessor.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(broomfieldAssessor.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertPublicRecordStructuredEvidence(broomfieldAssessorRequest).conversionFingerprint, broomfieldAssessor.conversionFingerprint);
assert.notEqual(broomfieldAssessor.conversionFingerprint, valid.conversionFingerprint);
assert.notEqual(broomfieldAssessor.conversionFingerprint, arapahoeAssessor.conversionFingerprint);
for (const sourceId of ['EXP-SRC-BROOMFIELD-COUNTY-ASSESSOR', 'SRA-BROOMFIELD-COUNTY-ASSESSOR', 'SRC-GENERIC-COUNTY-ASSESSOR', 'SRC-PROVIDER-COUNTY-ASSESSOR', 'SRC-BROOMFIELD-GIS', 'SRC-BROOMFIELD-COUNTY-TREASURER', 'SRC-BROOMFIELD-COUNTY-RECORDER', 'SRC-BROOMFIELD-COUNTY-PARCEL-GIS']) {
  assert.equal(convertPublicRecordStructuredEvidence({
    ...broomfieldAssessorRequest,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...broomfieldAssessorRequest.evidenceReferences[0]!, sourceId }],
  }).classification, 'PUBLIC_RECORD_SOURCE_INVALID');
}
assert.equal(convertPublicRecordStructuredEvidence({ ...broomfieldAssessorRequest, sourceClass: 'COUNTY_TREASURER' }).classification, 'PUBLIC_RECORD_SOURCE_MISMATCH');
assert.equal(convertPublicRecordStructuredEvidence({ ...broomfieldAssessorRequest, sourceConfirmation: undefined }).classification, 'PUBLIC_RECORD_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertPublicRecordStructuredEvidence({ ...broomfieldAssessorRequest, certificationReference: undefined }).classification, 'PUBLIC_RECORD_CERTIFICATION_REQUIRED');
assert.equal(convertPublicRecordStructuredEvidence({ ...broomfieldAssessorRequest, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'PUBLIC_RECORD_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertPublicRecordStructuredEvidence({ ...broomfieldAssessorRequest, ownerName: 'not allowed' }).classification, 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED');
assert.equal(convertPublicRecordStructuredEvidence({
  ...broomfieldAssessorRequest,
  evidenceReferences: [{ ...broomfieldAssessorRequest.evidenceReferences[0]!, sourceId: 'SRC-ARAPAHOE-COUNTY-ASSESSOR' }],
}).classification, 'PUBLIC_RECORD_REFERENCE_INVALID');

const jeffersonAssessorRequest: PublicRecordSourceQualityEvidenceConversionRequest = {
  ...request,
  sourceId: 'SRC-JEFFERSON-COUNTY-ASSESSOR',
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: {
    sourceId: 'SRC-JEFFERSON-COUNTY-ASSESSOR',
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-16',
  },
  evidenceReferences: [{
    sourceId: 'SRC-JEFFERSON-COUNTY-ASSESSOR',
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'PUBLIC-RECORD-CONVERSION-JEFFERSON-ASSESSOR-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: '2026-08-16',
};
const jeffersonAssessor = convertPublicRecordStructuredEvidence(jeffersonAssessorRequest);
assert.equal(jeffersonAssessor.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(jeffersonAssessor.sourceId, 'SRC-JEFFERSON-COUNTY-ASSESSOR');
assert.equal(jeffersonAssessor.linkages.length, 1);
assert.equal(jeffersonAssessor.linkages[0]?.sourceId, 'SRC-JEFFERSON-COUNTY-ASSESSOR');
assert.equal(jeffersonAssessor.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(jeffersonAssessor.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(jeffersonAssessor.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(jeffersonAssessor.normalized?.rights.posture, 'UNKNOWN');
assert.equal(jeffersonAssessor.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(jeffersonAssessor.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(jeffersonAssessor.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(jeffersonAssessor.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertPublicRecordStructuredEvidence(jeffersonAssessorRequest).conversionFingerprint, jeffersonAssessor.conversionFingerprint);
assert.notEqual(jeffersonAssessor.conversionFingerprint, valid.conversionFingerprint);
assert.notEqual(jeffersonAssessor.conversionFingerprint, arapahoeAssessor.conversionFingerprint);
assert.notEqual(jeffersonAssessor.conversionFingerprint, broomfieldAssessor.conversionFingerprint);
for (const sourceId of ['EXP-SRC-JEFFERSON-COUNTY-ASSESSOR', 'SRA-JEFFERSON-COUNTY-ASSESSOR', 'SRC-GENERIC-COUNTY-ASSESSOR', 'SRC-PROVIDER-COUNTY-ASSESSOR', 'SRC-JEFFERSON-ASPIN', 'SRC-JEFFERSON-GIS', 'SRC-JEFFERSON-COUNTY-TREASURER', 'SRC-JEFFERSON-COUNTY-RECORDER', 'SRC-JEFFERSON-COUNTY-PARCEL-GIS']) {
  assert.equal(convertPublicRecordStructuredEvidence({
    ...jeffersonAssessorRequest,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...jeffersonAssessorRequest.evidenceReferences[0]!, sourceId }],
  }).classification, 'PUBLIC_RECORD_SOURCE_INVALID');
}
assert.equal(convertPublicRecordStructuredEvidence({ ...jeffersonAssessorRequest, sourceClass: 'COUNTY_TREASURER' }).classification, 'PUBLIC_RECORD_SOURCE_MISMATCH');
assert.equal(convertPublicRecordStructuredEvidence({ ...jeffersonAssessorRequest, sourceClass: 'COUNTY_RECORDED_DOCUMENT_INDEX' }).classification, 'PUBLIC_RECORD_SOURCE_MISMATCH');
assert.equal(convertPublicRecordStructuredEvidence({ ...jeffersonAssessorRequest, sourceConfirmation: undefined }).classification, 'PUBLIC_RECORD_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertPublicRecordStructuredEvidence({ ...jeffersonAssessorRequest, certificationReference: undefined }).classification, 'PUBLIC_RECORD_CERTIFICATION_REQUIRED');
assert.equal(convertPublicRecordStructuredEvidence({ ...jeffersonAssessorRequest, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'PUBLIC_RECORD_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertPublicRecordStructuredEvidence({ ...jeffersonAssessorRequest, ownerName: 'not allowed' }).classification, 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED');
assert.equal(convertPublicRecordStructuredEvidence({
  ...jeffersonAssessorRequest,
  evidenceReferences: [{ ...jeffersonAssessorRequest.evidenceReferences[0]!, parcelId: 'not allowed' }],
}).classification, 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED');
for (const inheritedSourceId of ['SRC-BOULDER-COUNTY-ASSESSOR', 'SRC-ARAPAHOE-COUNTY-ASSESSOR', 'SRC-BROOMFIELD-COUNTY-ASSESSOR']) {
  assert.equal(convertPublicRecordStructuredEvidence({
    ...jeffersonAssessorRequest,
    evidenceReferences: [{ ...jeffersonAssessorRequest.evidenceReferences[0]!, sourceId: inheritedSourceId }],
  }).classification, 'PUBLIC_RECORD_REFERENCE_INVALID');
}

const larimerAssessorRequest: PublicRecordSourceQualityEvidenceConversionRequest = {
  ...request,
  sourceId: 'SRC-LARIMER-COUNTY-ASSESSOR',
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: {
    sourceId: 'SRC-LARIMER-COUNTY-ASSESSOR',
    confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED',
    reviewedAt: '2026-08-16',
  },
  evidenceReferences: [{
    sourceId: 'SRC-LARIMER-COUNTY-ASSESSOR',
    inputClass: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'PUBLIC-RECORD-CONVERSION-LARIMER-ASSESSOR-CERT-001',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  conversionAuthorityClass: 'EXECUTIVE_COUNTY_EVIDENCE_CONVERSION_REVIEW',
  reviewedAt: '2026-08-16',
};
const larimerAssessor = convertPublicRecordStructuredEvidence(larimerAssessorRequest);
assert.equal(larimerAssessor.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(larimerAssessor.sourceId, 'SRC-LARIMER-COUNTY-ASSESSOR');
assert.equal(larimerAssessor.linkages.length, 1);
assert.equal(larimerAssessor.linkages[0]?.sourceId, 'SRC-LARIMER-COUNTY-ASSESSOR');
assert.equal(larimerAssessor.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(larimerAssessor.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(larimerAssessor.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(larimerAssessor.normalized?.rights.posture, 'UNKNOWN');
assert.equal(larimerAssessor.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(larimerAssessor.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(larimerAssessor.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(larimerAssessor.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertPublicRecordStructuredEvidence(larimerAssessorRequest).conversionFingerprint, larimerAssessor.conversionFingerprint);
assert.notEqual(larimerAssessor.conversionFingerprint, valid.conversionFingerprint);
assert.notEqual(larimerAssessor.conversionFingerprint, arapahoeAssessor.conversionFingerprint);
assert.notEqual(larimerAssessor.conversionFingerprint, broomfieldAssessor.conversionFingerprint);
assert.notEqual(larimerAssessor.conversionFingerprint, jeffersonAssessor.conversionFingerprint);
for (const sourceId of ['EXP-SRC-LARIMER-COUNTY-ASSESSOR', 'SRA-LARIMER-COUNTY-ASSESSOR', 'SRC-GENERIC-COUNTY-ASSESSOR', 'SRC-PROVIDER-COUNTY-ASSESSOR', 'SRC-LARIMER-PUBLIC-DATA-CENTER', 'SRC-LARIMER-GIS', 'SRC-LARIMER-MAP', 'SRC-LARIMER-COUNTY-TREASURER', 'SRC-LARIMER-COUNTY-RECORDER', 'SRC-LARIMER-COUNTY-PARCEL-GIS', 'SRC-LARIMER-PLANNING', 'SRC-LARIMER-ZONING', 'SRC-LARIMER-PUBLIC-TRUSTEE']) {
  assert.equal(convertPublicRecordStructuredEvidence({
    ...larimerAssessorRequest,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...larimerAssessorRequest.evidenceReferences[0]!, sourceId }],
  }).classification, 'PUBLIC_RECORD_SOURCE_INVALID');
}
assert.equal(convertPublicRecordStructuredEvidence({ ...larimerAssessorRequest, sourceClass: 'COUNTY_TREASURER' }).classification, 'PUBLIC_RECORD_SOURCE_MISMATCH');
assert.equal(convertPublicRecordStructuredEvidence({ ...larimerAssessorRequest, sourceClass: 'COUNTY_RECORDED_DOCUMENT_INDEX' }).classification, 'PUBLIC_RECORD_SOURCE_MISMATCH');
assert.equal(convertPublicRecordStructuredEvidence({ ...larimerAssessorRequest, sourceConfirmation: undefined }).classification, 'PUBLIC_RECORD_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertPublicRecordStructuredEvidence({ ...larimerAssessorRequest, certificationReference: undefined }).classification, 'PUBLIC_RECORD_CERTIFICATION_REQUIRED');
assert.equal(convertPublicRecordStructuredEvidence({ ...larimerAssessorRequest, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'PUBLIC_RECORD_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertPublicRecordStructuredEvidence({ ...larimerAssessorRequest, ownerName: 'not allowed' }).classification, 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED');
assert.equal(convertPublicRecordStructuredEvidence({
  ...larimerAssessorRequest,
  evidenceReferences: [{ ...larimerAssessorRequest.evidenceReferences[0]!, parcelId: 'not allowed' }],
}).classification, 'PUBLIC_RECORD_NARRATIVE_INPUT_REJECTED');
for (const inheritedSourceId of ['SRC-BOULDER-COUNTY-ASSESSOR', 'SRC-ARAPAHOE-COUNTY-ASSESSOR', 'SRC-BROOMFIELD-COUNTY-ASSESSOR', 'SRC-JEFFERSON-COUNTY-ASSESSOR']) {
  assert.equal(convertPublicRecordStructuredEvidence({
    ...larimerAssessorRequest,
    evidenceReferences: [{ ...larimerAssessorRequest.evidenceReferences[0]!, sourceId: inheritedSourceId }],
  }).classification, 'PUBLIC_RECORD_REFERENCE_INVALID');
}

const recorderExpanded = convertPublicRecordStructuredEvidence({
  ...recorderRequest,
  evidenceReferences: [
    ...recorderRequest.evidenceReferences,
    { sourceId: recorderRequest.sourceId, inputClass: 'RIGHTS_READINESS_REFERENCE', evidenceReferenceId: 'PUBLIC-RECORD-RECORDER-RIGHTS-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
    { sourceId: recorderRequest.sourceId, inputClass: 'TECHNICAL_ACCESS_REFERENCE', evidenceReferenceId: 'PUBLIC-RECORD-RECORDER-TECH-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
    { sourceId: recorderRequest.sourceId, inputClass: 'FRESHNESS_REFERENCE', evidenceReferenceId: 'PUBLIC-RECORD-RECORDER-FRESHNESS-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
    { sourceId: recorderRequest.sourceId, inputClass: 'ATTRIBUTION_REFERENCE', evidenceReferenceId: 'PUBLIC-RECORD-RECORDER-ATTRIBUTION-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
    { sourceId: recorderRequest.sourceId, inputClass: 'PROVENANCE_REFERENCE', evidenceReferenceId: 'PUBLIC-RECORD-RECORDER-PROVENANCE-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: ['PROVENANCE_INCOMPLETE'] },
  ],
});
assert.equal(recorderExpanded.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(recorderExpanded.normalized?.rights.posture, 'UNKNOWN');
assert.equal(recorderExpanded.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(recorderExpanded.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(recorderExpanded.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(recorderExpanded.normalized?.provenance.posture, 'UNKNOWN');
const recorderAssemblyRequest = createPublicRecordSourceQualityAssemblyRequest(recorder);
assert.ok(recorderAssemblyRequest);
const recorderAssembly = assembleSourceQualitySummaries(recorderAssemblyRequest);
assert.notEqual(recorderAssembly.classification, 'FAIL_CLOSED');
assert.equal(recorderAssembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');

const portal = convertPublicRecordStructuredEvidence({
  ...request,
  sourceId: 'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL',
  sourceClass: 'MUNICIPAL_PERMIT_PORTAL',
  sourceConfirmation: { sourceId: 'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
  evidenceReferences: [{ ...request.evidenceReferences[0]!, sourceId: 'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL', evidenceReferenceId: 'PUBLIC-RECORD-CONVERSION-CITY-PORTAL-CERT-001' }],
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
});
assert.equal(portal.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.notEqual(portal.conversionFingerprint, valid.conversionFingerprint);
const accela = convertPublicRecordStructuredEvidence({
  ...request,
  sourceId: 'SRC-BOULDER-COUNTY-ACCELA-PERMITS',
  sourceClass: 'COUNTY_PERMIT',
  sourceConfirmation: { sourceId: 'SRC-BOULDER-COUNTY-ACCELA-PERMITS', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
  evidenceReferences: [{ ...request.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-COUNTY-ACCELA-PERMITS', evidenceReferenceId: 'PUBLIC-RECORD-CONVERSION-ACCELA-CERT-001' }],
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
});
assert.equal(accela.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');

const expanded = convertPublicRecordStructuredEvidence({
  ...request,
  evidenceReferences: [
    ...request.evidenceReferences,
    { sourceId: request.sourceId, inputClass: 'RIGHTS_READINESS_REFERENCE', evidenceReferenceId: 'PUBLIC-RECORD-RIGHTS-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
    { sourceId: request.sourceId, inputClass: 'TECHNICAL_ACCESS_REFERENCE', evidenceReferenceId: 'PUBLIC-RECORD-TECH-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
    { sourceId: request.sourceId, inputClass: 'FRESHNESS_REFERENCE', evidenceReferenceId: 'PUBLIC-RECORD-FRESHNESS-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
    { sourceId: request.sourceId, inputClass: 'ATTRIBUTION_REFERENCE', evidenceReferenceId: 'PUBLIC-RECORD-ATTRIBUTION-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
    { sourceId: request.sourceId, inputClass: 'PROVENANCE_REFERENCE', evidenceReferenceId: 'PUBLIC-RECORD-PROVENANCE-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
  ],
});
assert.equal(expanded.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(expanded.normalized?.rights.posture, 'UNKNOWN');
assert.equal(expanded.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(expanded.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(expanded.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(expanded.normalized?.provenance.posture, 'UNKNOWN');

const summary = summarizeSourceQuality(valid.normalized);
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
const assemblyRequest = createPublicRecordSourceQualityAssemblyRequest(valid);
assert.ok(assemblyRequest);
const assembly = assembleSourceQualitySummaries(assemblyRequest);
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
if (assembly.classification === 'FAIL_CLOSED') throw new Error('Public-record assembly must accept converted evidence.');
assert.equal(assembly.assembly.sourceCount, 1);
assert.equal(assembly.assembly.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');

assert.equal(PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL.sourceActivation, 'PUBLIC_RECORD_SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_CONVERSION');
assert.equal(PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL.retrieval, 'PUBLIC_RECORD_RETRIEVAL_NOT_AUTHORIZED_BY_CONVERSION');
assert.equal(PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL.scraping, 'PUBLIC_RECORD_SCRAPING_NOT_AUTHORIZED_BY_CONVERSION');
assert.equal(PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL.customerDisplay, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_CONVERSION');
assert.equal(PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_CONVERSION');
assert.equal(PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL.openDataFallacy, 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY');
assert.equal(PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_FIREWALL.portalFallacy, 'PORTAL_EXISTENCE_NOT_AUTOMATION_OR_DISPLAY_AUTHORITY');

const runtime = await readFile(new URL('../lib/sourceQualityPublicRecordEvidenceConversionContract.ts', import.meta.url), 'utf8');
for (const forbidden of ['@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture']) assert.equal(runtime.includes(forbidden), false, 'Contract must not reference ' + forbidden);
console.log('[source-quality-public-record-evidence-conversion-contract] ok: exact public/government record structured references convert deterministically through canonical normalization, control, and assembly with unknown dimensions and no activation, retrieval, scraping, display, legal-use, network, database, CRM, Search, Typesense, UI, or route behavior.');
