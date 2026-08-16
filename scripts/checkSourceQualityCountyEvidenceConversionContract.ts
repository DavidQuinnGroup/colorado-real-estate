import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
  ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID,
  BOULDER_COUNTY_ASSESSOR_CONVERSION_POSTURE,
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
  BROOMFIELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  COUNTY_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS,
  COUNTY_SOURCE_QUALITY_CONVERSION_FIREWALL,
  JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID,
  JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  LARIMER_COUNTY_ASSESSOR_SOURCE_ID,
  LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  convertCountyStructuredEvidence,
  createCountySourceQualityAssemblyRequest,
} from '../lib/sourceQualityCountyEvidenceConversionContract';
import { summarizeSourceQuality } from '../lib/sourceQualityControl';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const valid = convertCountyStructuredEvidence(BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST);
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-BOULDER-COUNTY-ASSESSOR');
assert.deepEqual(COUNTY_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS, [
  'SRC-BOULDER-COUNTY-ASSESSOR',
  'SRC-ARAPAHOE-COUNTY-ASSESSOR',
  'SRC-BROOMFIELD-COUNTY-ASSESSOR',
  'SRC-JEFFERSON-COUNTY-ASSESSOR',
  'SRC-LARIMER-COUNTY-ASSESSOR',
  'SRC-BOULDER-COUNTY-TREASURER',
  'SRC-BOULDER-COUNTY-RECORDER-INDEX',
  'SRC-BOULDER-COUNTY-ACCELA-PERMITS',
]);
assert.equal(BOULDER_COUNTY_ASSESSOR_CONVERSION_POSTURE, 'COUNTY_PUBLIC_RECORD_SOURCE_QUALITY_CONVERSION_READY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(valid.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(valid.sourceId, BOULDER_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(valid.linkages.length, 1);
assert.equal(valid.linkages[0]?.sourceId, BOULDER_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(valid.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(valid.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(valid.linkages[0]?.posture, 'REFERENCED');
assert.equal(valid.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(valid.normalized?.rights.posture, 'UNKNOWN');
assert.equal(valid.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(valid.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(valid.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(valid.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertCountyStructuredEvidence(BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST).conversionFingerprint, valid.conversionFingerprint);

const arapahoeAssessor = convertCountyStructuredEvidence(ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST);
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-ARAPAHOE-COUNTY-ASSESSOR');
assert.equal(arapahoeAssessor.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(arapahoeAssessor.sourceId, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(arapahoeAssessor.linkages.length, 1);
assert.equal(arapahoeAssessor.linkages[0]?.sourceId, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(arapahoeAssessor.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(arapahoeAssessor.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(arapahoeAssessor.linkages[0]?.posture, 'REFERENCED');
assert.equal(arapahoeAssessor.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(arapahoeAssessor.normalized?.rights.posture, 'UNKNOWN');
assert.equal(arapahoeAssessor.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(arapahoeAssessor.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(arapahoeAssessor.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(arapahoeAssessor.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertCountyStructuredEvidence(ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST).conversionFingerprint, arapahoeAssessor.conversionFingerprint);
assert.notEqual(arapahoeAssessor.conversionFingerprint, valid.conversionFingerprint);
assert.equal(valid.sourceId, BOULDER_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(valid.linkages[0]?.sourceId, BOULDER_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(valid.normalized?.rights.posture, 'UNKNOWN');
assert.equal(valid.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(valid.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(valid.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(valid.normalized?.provenance.posture, 'UNKNOWN');

const broomfieldAssessor = convertCountyStructuredEvidence(BROOMFIELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST);
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-BROOMFIELD-COUNTY-ASSESSOR');
assert.equal(broomfieldAssessor.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(broomfieldAssessor.sourceId, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(broomfieldAssessor.linkages.length, 1);
assert.equal(broomfieldAssessor.linkages[0]?.sourceId, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(broomfieldAssessor.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(broomfieldAssessor.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(broomfieldAssessor.linkages[0]?.posture, 'REFERENCED');
assert.equal(broomfieldAssessor.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(broomfieldAssessor.normalized?.rights.posture, 'UNKNOWN');
assert.equal(broomfieldAssessor.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(broomfieldAssessor.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(broomfieldAssessor.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(broomfieldAssessor.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertCountyStructuredEvidence(BROOMFIELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST).conversionFingerprint, broomfieldAssessor.conversionFingerprint);
assert.notEqual(broomfieldAssessor.conversionFingerprint, valid.conversionFingerprint);
assert.notEqual(broomfieldAssessor.conversionFingerprint, arapahoeAssessor.conversionFingerprint);

const jeffersonAssessor = convertCountyStructuredEvidence(JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST);
assert.equal(JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-JEFFERSON-COUNTY-ASSESSOR');
assert.equal(jeffersonAssessor.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(jeffersonAssessor.sourceId, JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(jeffersonAssessor.linkages.length, 1);
assert.equal(jeffersonAssessor.linkages[0]?.sourceId, JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(jeffersonAssessor.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(jeffersonAssessor.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(jeffersonAssessor.linkages[0]?.posture, 'REFERENCED');
assert.equal(jeffersonAssessor.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(jeffersonAssessor.normalized?.rights.posture, 'UNKNOWN');
assert.equal(jeffersonAssessor.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(jeffersonAssessor.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(jeffersonAssessor.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(jeffersonAssessor.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertCountyStructuredEvidence(JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST).conversionFingerprint, jeffersonAssessor.conversionFingerprint);
assert.notEqual(jeffersonAssessor.conversionFingerprint, valid.conversionFingerprint);
assert.notEqual(jeffersonAssessor.conversionFingerprint, arapahoeAssessor.conversionFingerprint);
assert.notEqual(jeffersonAssessor.conversionFingerprint, broomfieldAssessor.conversionFingerprint);

const larimerAssessor = convertCountyStructuredEvidence(LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST);
assert.equal(LARIMER_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-LARIMER-COUNTY-ASSESSOR');
assert.equal(larimerAssessor.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(larimerAssessor.sourceId, LARIMER_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(larimerAssessor.linkages.length, 1);
assert.equal(larimerAssessor.linkages[0]?.sourceId, LARIMER_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(larimerAssessor.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(larimerAssessor.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(larimerAssessor.linkages[0]?.posture, 'REFERENCED');
assert.equal(larimerAssessor.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(larimerAssessor.normalized?.rights.posture, 'UNKNOWN');
assert.equal(larimerAssessor.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(larimerAssessor.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(larimerAssessor.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(larimerAssessor.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertCountyStructuredEvidence(LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST).conversionFingerprint, larimerAssessor.conversionFingerprint);
assert.notEqual(larimerAssessor.conversionFingerprint, valid.conversionFingerprint);
assert.notEqual(larimerAssessor.conversionFingerprint, arapahoeAssessor.conversionFingerprint);
assert.notEqual(larimerAssessor.conversionFingerprint, broomfieldAssessor.conversionFingerprint);
assert.notEqual(larimerAssessor.conversionFingerprint, jeffersonAssessor.conversionFingerprint);

const withoutConfirmation = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceConfirmation: undefined,
});
assert.equal(withoutConfirmation.classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
const foreign = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  evidenceReferences: [{ ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-COUNTY-TREASURER' }],
});
assert.equal(foreign.classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
const unknown = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: 'SRC-UNKNOWN-COUNTY-SOURCE',
  sourceConfirmation: { sourceId: 'SRC-UNKNOWN-COUNTY-SOURCE', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
  evidenceReferences: [{ ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-UNKNOWN-COUNTY-SOURCE' }],
});
assert.equal(unknown.classification, 'COUNTY_SOURCE_INVALID');
const candidate = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: 'SRC-BOULDER-PERMIT-CANDIDATES',
  sourceConfirmation: { sourceId: 'SRC-BOULDER-PERMIT-CANDIDATES', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
  evidenceReferences: [{ ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-PERMIT-CANDIDATES' }],
});
assert.equal(candidate.classification, 'COUNTY_NON_OPERATIONAL_CANDIDATE_REJECTED');
assert.deepEqual(candidate.reasons, ['NON_OPERATIONAL_PERMIT_CANDIDATE_NOT_CONVERSION_AUTHORITY']);
assert.equal(candidate.sourceId, null);
assert.equal(candidate.linkages.length, 0);
for (const sourceId of ['EXP-SRC-BOULDER-COUNTY-RECORDER', 'SRA-BOULDER-COUNTY-RECORDER', 'SRC-GENERIC-COUNTY-RECORDER', 'RECORDER']) {
  assert.equal(convertCountyStructuredEvidence({
    ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
    sourceId,
    sourceClass: 'COUNTY_RECORDED_DOCUMENT_INDEX',
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
    evidenceReferences: [{ ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
    fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  }).classification, 'COUNTY_SOURCE_INVALID');
}
const cityAsCounty = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
  sourceConfirmation: { sourceId: 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
  evidenceReferences: [{ ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS' }],
});
assert.equal(cityAsCounty.classification, 'COUNTY_SOURCE_INVALID');
const noCertification = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  certificationReference: undefined,
});
assert.equal(noCertification.classification, 'COUNTY_CERTIFICATION_REQUIRED');
const unreviewedSensitivity = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  fieldSensitivityPosture: 'UNKNOWN',
});
assert.equal(unreviewedSensitivity.classification, 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED');
const narrative = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  narrative: 'not composable',
});
assert.equal(narrative.classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
const pii = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  evidenceReferences: [{ ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, ownerName: 'not allowed' }],
});
assert.equal(pii.classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
const crossClass = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceClass: 'COUNTY_TREASURER',
});
assert.equal(crossClass.classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceClass: 'COUNTY_TREASURER' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({
  ...ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER',
  sourceConfirmation: { sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{ ...ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER' }],
}).classification, 'COUNTY_SOURCE_INVALID');
for (const sourceId of ['EXP-SRC-ARAPAHOE-COUNTY-ASSESSOR', 'SRA-ARAPAHOE-COUNTY-ASSESSOR', 'SRC-GENERIC-COUNTY-ASSESSOR', 'SRC-PROVIDER-COUNTY-ASSESSOR', 'SRC-ARAPAHOE-PARCEL-SEARCH', 'SRC-ARAPAHOE-ASSESSOR-DATA-MART', 'SRC-ARAPAHOE-GIS']) {
  assert.equal(convertCountyStructuredEvidence({
    ...ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  }).classification, 'COUNTY_SOURCE_INVALID');
}
assert.equal(convertCountyStructuredEvidence({
  ...ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  evidenceReferences: [{ ...ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID }],
}).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
assert.equal(convertCountyStructuredEvidence({
  ...ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  ownerName: 'not allowed',
}).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');

assert.equal(convertCountyStructuredEvidence({ ...BROOMFIELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...BROOMFIELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceClass: 'COUNTY_TREASURER' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({
  ...BROOMFIELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: 'SRC-BROOMFIELD-COUNTY-TREASURER',
  sourceConfirmation: { sourceId: 'SRC-BROOMFIELD-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{ ...BROOMFIELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-BROOMFIELD-COUNTY-TREASURER' }],
}).classification, 'COUNTY_SOURCE_INVALID');
for (const sourceId of ['EXP-SRC-BROOMFIELD-COUNTY-ASSESSOR', 'SRA-BROOMFIELD-COUNTY-ASSESSOR', 'SRC-GENERIC-COUNTY-ASSESSOR', 'SRC-PROVIDER-COUNTY-ASSESSOR', 'SRC-BROOMFIELD-GIS', 'SRC-BROOMFIELD-COUNTY-RECORDER', 'SRC-BROOMFIELD-COUNTY-PARCEL-GIS', 'SRC-BROOMFIELD-GOVERNMENT']) {
  assert.equal(convertCountyStructuredEvidence({
    ...BROOMFIELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...BROOMFIELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  }).classification, 'COUNTY_SOURCE_INVALID');
}
assert.equal(convertCountyStructuredEvidence({
  ...BROOMFIELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  evidenceReferences: [{ ...BROOMFIELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID }],
}).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
assert.equal(convertCountyStructuredEvidence({
  ...BROOMFIELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  ownerName: 'not allowed',
}).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');

assert.equal(convertCountyStructuredEvidence({ ...JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceClass: 'COUNTY_TREASURER' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({
  ...JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: 'SRC-JEFFERSON-COUNTY-TREASURER',
  sourceConfirmation: { sourceId: 'SRC-JEFFERSON-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{ ...JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-JEFFERSON-COUNTY-TREASURER' }],
}).classification, 'COUNTY_SOURCE_INVALID');
for (const sourceId of ['EXP-SRC-JEFFERSON-COUNTY-ASSESSOR', 'SRA-JEFFERSON-COUNTY-ASSESSOR', 'SRC-GENERIC-COUNTY-ASSESSOR', 'SRC-PROVIDER-COUNTY-ASSESSOR', 'SRC-JEFFERSON-ASPIN', 'SRC-JEFFERSON-GIS', 'SRC-JEFFERSON-COUNTY-RECORDER', 'SRC-JEFFERSON-COUNTY-PARCEL-GIS']) {
  assert.equal(convertCountyStructuredEvidence({
    ...JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  }).classification, 'COUNTY_SOURCE_INVALID');
}
for (const inheritedSourceId of [BOULDER_COUNTY_ASSESSOR_SOURCE_ID, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID] as const) {
  assert.equal(convertCountyStructuredEvidence({
    ...JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
    evidenceReferences: [{ ...JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: inheritedSourceId }],
  }).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
}
assert.equal(convertCountyStructuredEvidence({
  ...JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  ownerName: 'not allowed',
}).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
assert.equal(convertCountyStructuredEvidence({
  ...JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  evidenceReferences: [{ ...JEFFERSON_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, parcelId: 'not allowed' }],
}).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');

assert.equal(convertCountyStructuredEvidence({ ...LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceClass: 'COUNTY_TREASURER' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({
  ...LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: 'SRC-LARIMER-COUNTY-TREASURER',
  sourceConfirmation: { sourceId: 'SRC-LARIMER-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{ ...LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-LARIMER-COUNTY-TREASURER' }],
}).classification, 'COUNTY_SOURCE_INVALID');
for (const sourceId of ['EXP-SRC-LARIMER-COUNTY-ASSESSOR', 'SRA-LARIMER-COUNTY-ASSESSOR', 'SRC-GENERIC-COUNTY-ASSESSOR', 'SRC-PROVIDER-COUNTY-ASSESSOR', 'SRC-LARIMER-PUBLIC-DATA-CENTER', 'SRC-LARIMER-GIS', 'SRC-LARIMER-MAP', 'SRC-LARIMER-COUNTY-RECORDER', 'SRC-LARIMER-COUNTY-PARCEL-GIS', 'SRC-LARIMER-PLANNING', 'SRC-LARIMER-ZONING', 'SRC-LARIMER-PUBLIC-TRUSTEE']) {
  assert.equal(convertCountyStructuredEvidence({
    ...LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  }).classification, 'COUNTY_SOURCE_INVALID');
}
for (const inheritedSourceId of [BOULDER_COUNTY_ASSESSOR_SOURCE_ID, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID, JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID] as const) {
  assert.equal(convertCountyStructuredEvidence({
    ...LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
    evidenceReferences: [{ ...LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: inheritedSourceId }],
  }).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
}
assert.equal(convertCountyStructuredEvidence({
  ...LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  ownerName: 'not allowed',
}).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
assert.equal(convertCountyStructuredEvidence({
  ...LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  evidenceReferences: [{ ...LARIMER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, parcelId: 'not allowed' }],
}).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');

const expandedEvidenceReferences = [
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences,
  { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, inputClass: 'RIGHTS_READINESS_REFERENCE', evidenceReferenceId: 'COUNTY-CONVERSION-RIGHTS-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
  { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, inputClass: 'TECHNICAL_ACCESS_REFERENCE', evidenceReferenceId: 'COUNTY-CONVERSION-TECH-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
  { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, inputClass: 'FRESHNESS_REFERENCE', evidenceReferenceId: 'COUNTY-CONVERSION-FRESHNESS-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
  { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, inputClass: 'ATTRIBUTION_REFERENCE', evidenceReferenceId: 'COUNTY-CONVERSION-ATTRIBUTION-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
  { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, inputClass: 'PROVENANCE_REFERENCE', evidenceReferenceId: 'COUNTY-CONVERSION-PROVENANCE-001', posture: 'UNKNOWN', verificationStatus: 'VERIFIED', limitationCodes: [] },
] as const;
const expanded = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  evidenceReferences: expandedEvidenceReferences,
});
assert.equal(expanded.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(expanded.normalized?.rights.posture, 'UNKNOWN');
assert.equal(expanded.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(expanded.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(expanded.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(expanded.normalized?.provenance.posture, 'UNKNOWN');
const reversed = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  evidenceReferences: [...expandedEvidenceReferences].reverse(),
});
assert.equal(reversed.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(reversed.conversionFingerprint, expanded.conversionFingerprint);
const changedSource = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: 'SRC-BOULDER-COUNTY-TREASURER',
  sourceClass: 'COUNTY_TREASURER',
  sourceConfirmation: { sourceId: 'SRC-BOULDER-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
  evidenceReferences: [{ ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-COUNTY-TREASURER' }],
});
assert.equal(changedSource.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.notEqual(changedSource.conversionFingerprint, valid.conversionFingerprint);
const changedSensitivity = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  fieldSensitivityPosture: 'IDENTIFIER_BEARING_CONTEXT',
});
assert.equal(changedSensitivity.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.notEqual(changedSensitivity.conversionFingerprint, valid.conversionFingerprint);
const accela = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID,
  sourceClass: 'COUNTY_PERMIT',
  sourceConfirmation: { sourceId: BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
  evidenceReferences: [{
    ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!,
    sourceId: BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID,
    evidenceReferenceId: 'COUNTY-CONVERSION-ACCELA-CERT-001',
  }],
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
});
assert.equal(accela.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(accela.sourceId, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID);
assert.equal(accela.linkages[0]?.sourceId, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID);
assert.equal(accela.normalized?.rights.posture, 'UNKNOWN');
assert.equal(accela.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(accela.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(accela.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(accela.normalized?.provenance.posture, 'UNKNOWN');

const recorderRequest = {
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID,
  sourceClass: 'COUNTY_RECORDED_DOCUMENT_INDEX',
  sourceConfirmation: { sourceId: BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
  evidenceReferences: [{
    ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!,
    sourceId: BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID,
    evidenceReferenceId: 'COUNTY-CONVERSION-RECORDER-INDEX-CERT-001',
  }],
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
} as const;
const recorder = convertCountyStructuredEvidence(recorderRequest);
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID, 'SRC-BOULDER-COUNTY-RECORDER-INDEX');
assert.equal(recorder.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(recorder.sourceId, BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID);
assert.equal(recorder.linkages.length, 1);
assert.equal(recorder.linkages[0]?.sourceId, BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID);
assert.equal(recorder.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(recorder.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(recorder.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(recorder.normalized?.rights.posture, 'UNKNOWN');
assert.equal(recorder.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(recorder.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(recorder.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(recorder.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertCountyStructuredEvidence(recorderRequest).conversionFingerprint, recorder.conversionFingerprint);
assert.equal(convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID,
  sourceClass: 'COUNTY_ASSESSOR',
  sourceConfirmation: { sourceId: BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-15' },
  evidenceReferences: [{ ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID }],
}).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({ ...recorderRequest, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...recorderRequest, documentImage: 'not composable' }).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
assert.equal(convertCountyStructuredEvidence({
  ...recorderRequest,
  evidenceReferences: [{ ...recorderRequest.evidenceReferences[0]!, ocrText: 'not composable' }],
}).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
const recorderAssemblyRequest = createCountySourceQualityAssemblyRequest(recorder);
assert.ok(recorderAssemblyRequest);
const recorderAssembly = assembleSourceQualitySummaries(recorderAssemblyRequest);
assert.notEqual(recorderAssembly.classification, 'FAIL_CLOSED');
assert.equal(recorderAssembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');

const summary = summarizeSourceQuality(valid.normalized);
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
const request = createCountySourceQualityAssemblyRequest(valid);
assert.ok(request);
const assembly = assembleSourceQualitySummaries(request);
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(COUNTY_SOURCE_QUALITY_CONVERSION_FIREWALL.sourceActivation, 'COUNTY_SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_CONVERSION');
assert.equal(COUNTY_SOURCE_QUALITY_CONVERSION_FIREWALL.customerDisplay, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_CONVERSION');
assert.equal(COUNTY_SOURCE_QUALITY_CONVERSION_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_CONVERSION');
assert.equal(COUNTY_SOURCE_QUALITY_CONVERSION_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');

const runtime = await readFile(new URL('../lib/sourceQualityCountyEvidenceConversionContract.ts', import.meta.url), 'utf8');
for (const forbidden of ['@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture']) assert.equal(runtime.includes(forbidden), false, 'Contract must not reference ' + forbidden);
assert.ok(runtime.includes('convertPublicRecordStructuredEvidence'));
console.log('[source-quality-county-evidence-conversion-contract] ok: exact county structured references delegate to the public-record core, preserve Assessor/Treasurer behavior, support exact County Accela, reject candidate and City-as-County inputs, and convert deterministically without activation, retrieval, or narrative behavior.');
