import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  ADAMS_COUNTY_ASSESSOR_SOURCE_ID,
  ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
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
  WELD_COUNTY_ASSESSOR_SOURCE_ID,
  WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  convertCountyStructuredEvidence,
  createCountySourceQualityAssemblyRequest,
} from '../lib/sourceQualityCountyEvidenceConversionContract';
import { COUNTY_ASSESSOR_EXACT_SOURCE_IDS } from '../lib/sourceQualityCountyAssessorExactSourceDefinitions';
import { COUNTY_TREASURER_EXACT_SOURCE_IDS } from '../lib/sourceQualityCountyTreasurerExactSourceDefinitions';
import { summarizeSourceQuality } from '../lib/sourceQualityControl';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const valid = convertCountyStructuredEvidence(BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST);
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-BOULDER-COUNTY-ASSESSOR');
assert.deepEqual(COUNTY_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS, [
  ...COUNTY_ASSESSOR_EXACT_SOURCE_IDS,
  ...COUNTY_TREASURER_EXACT_SOURCE_IDS,
  'SRC-BOULDER-COUNTY-RECORDER-INDEX',
  'SRC-BOULDER-COUNTY-ACCELA-PERMITS',
]);
assert.equal(COUNTY_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS.includes('SRC-JEFFERSON-COUNTY-TREASURER' as never), true);
for (const futureTreasurerSourceId of ['SRC-WELD-COUNTY-TREASURER', 'SRC-LARIMER-COUNTY-TREASURER', 'SRC-BROOMFIELD-COUNTY-TREASURER', 'SRC-FAKE-COUNTY-TREASURER'] as const) {
  assert.equal(COUNTY_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS.includes(futureTreasurerSourceId as never), false);
}
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

const adamsAssessor = convertCountyStructuredEvidence(ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST);
assert.equal(ADAMS_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-ADAMS-COUNTY-ASSESSOR');
assert.equal(adamsAssessor.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(adamsAssessor.sourceId, ADAMS_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(adamsAssessor.linkages.length, 1);
assert.equal(adamsAssessor.linkages[0]?.sourceId, ADAMS_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(adamsAssessor.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(adamsAssessor.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(adamsAssessor.linkages[0]?.posture, 'REFERENCED');
assert.equal(adamsAssessor.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(adamsAssessor.normalized?.rights.posture, 'UNKNOWN');
assert.equal(adamsAssessor.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(adamsAssessor.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(adamsAssessor.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(adamsAssessor.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertCountyStructuredEvidence(ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST).conversionFingerprint, adamsAssessor.conversionFingerprint);
assert.notEqual(adamsAssessor.conversionFingerprint, valid.conversionFingerprint);

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
assert.notEqual(arapahoeAssessor.conversionFingerprint, adamsAssessor.conversionFingerprint);
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
assert.notEqual(broomfieldAssessor.conversionFingerprint, adamsAssessor.conversionFingerprint);
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
assert.notEqual(jeffersonAssessor.conversionFingerprint, adamsAssessor.conversionFingerprint);
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
assert.notEqual(larimerAssessor.conversionFingerprint, adamsAssessor.conversionFingerprint);
assert.notEqual(larimerAssessor.conversionFingerprint, arapahoeAssessor.conversionFingerprint);
assert.notEqual(larimerAssessor.conversionFingerprint, broomfieldAssessor.conversionFingerprint);
assert.notEqual(larimerAssessor.conversionFingerprint, jeffersonAssessor.conversionFingerprint);

const weldAssessor = convertCountyStructuredEvidence(WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST);
assert.equal(WELD_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-WELD-COUNTY-ASSESSOR');
assert.equal(weldAssessor.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(weldAssessor.sourceId, WELD_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(weldAssessor.linkages.length, 1);
assert.equal(weldAssessor.linkages[0]?.sourceId, WELD_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(weldAssessor.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(weldAssessor.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(weldAssessor.linkages[0]?.posture, 'REFERENCED');
assert.equal(weldAssessor.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(weldAssessor.normalized?.rights.posture, 'UNKNOWN');
assert.equal(weldAssessor.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(weldAssessor.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(weldAssessor.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(weldAssessor.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertCountyStructuredEvidence(WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST).conversionFingerprint, weldAssessor.conversionFingerprint);
assert.notEqual(weldAssessor.conversionFingerprint, valid.conversionFingerprint);
assert.notEqual(weldAssessor.conversionFingerprint, adamsAssessor.conversionFingerprint);
assert.notEqual(weldAssessor.conversionFingerprint, arapahoeAssessor.conversionFingerprint);
assert.notEqual(weldAssessor.conversionFingerprint, broomfieldAssessor.conversionFingerprint);
assert.notEqual(weldAssessor.conversionFingerprint, jeffersonAssessor.conversionFingerprint);
assert.notEqual(weldAssessor.conversionFingerprint, larimerAssessor.conversionFingerprint);

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

assert.equal(convertCountyStructuredEvidence({ ...ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceClass: 'COUNTY_TREASURER' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({ ...ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceClass: 'COUNTY_RECORDED_DOCUMENT_INDEX' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({
  ...ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: 'SRC-ADAMS-COUNTY-TREASURER',
  sourceConfirmation: { sourceId: 'SRC-ADAMS-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{ ...ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-ADAMS-COUNTY-TREASURER' }],
}).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
for (const sourceId of ['EXP-SRC-ADAMS-COUNTY-ASSESSOR', 'SRA-ADAMS-COUNTY-ASSESSOR', 'SRC-GENERIC-COUNTY-ASSESSOR', 'SRC-PROVIDER-COUNTY-ASSESSOR', 'SRC-ADAMS-PROPERTY-PORTAL', 'SRC-ADAMS-GIS-INTERACTIVE-MAPS', 'SRC-ADAMS-DOWNLOADABLE-GIS-DATA', 'SRC-ADAMS-ASSESSOR-DATA-DUMP', 'SRC-ADAMS-PUBLIC-TRUSTEE', 'SRC-ADAMS-COUNTY-RECORDER', 'SRC-ADAMS-PLANNING-DEVELOPMENT', 'SRC-ADAMS-PERMITS-LICENSING', 'SRC-ADAMS-COUNTY-PARCEL-GIS', 'SRC-UNKNOWN-COUNTY-SOURCE']) {
  assert.equal(convertCountyStructuredEvidence({
    ...ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  }).classification, 'COUNTY_SOURCE_INVALID');
}
assert.equal(convertCountyStructuredEvidence({
  ...ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  certificationReference: undefined,
}).classification, 'COUNTY_CERTIFICATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({
  ...ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  fieldSensitivityPosture: 'UNKNOWN',
}).classification, 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED');
for (const inheritedSourceId of [BOULDER_COUNTY_ASSESSOR_SOURCE_ID] as const) {
  assert.equal(convertCountyStructuredEvidence({
    ...ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
    evidenceReferences: [{ ...ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: inheritedSourceId }],
  }).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
}
for (const key of ['ownerName', 'address', 'parcelId', 'propertyRecord', 'rawRecord']) {
  assert.equal(convertCountyStructuredEvidence({
    ...ADAMS_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
    [key]: 'not allowed',
  }).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
}

assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceClass: 'COUNTY_TREASURER' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({
  ...ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER',
  sourceConfirmation: { sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{ ...ARAPAHOE_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER' }],
}).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
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
}).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
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

assert.equal(convertCountyStructuredEvidence({ ...WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST, sourceClass: 'COUNTY_TREASURER' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({
  ...WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: 'SRC-WELD-COUNTY-TREASURER',
  sourceConfirmation: { sourceId: 'SRC-WELD-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{ ...WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-WELD-COUNTY-TREASURER' }],
}).classification, 'COUNTY_SOURCE_INVALID');
for (const sourceId of ['EXP-SRC-WELD-COUNTY-ASSESSOR', 'SRA-WELD-COUNTY-ASSESSOR', 'SRC-GENERIC-COUNTY-ASSESSOR', 'SRC-PROVIDER-COUNTY-ASSESSOR', 'SRC-WELD-DATA-DOWNLOAD', 'SRC-WELD-PROPERTY-CARD', 'SRC-WELD-PROPERTY-MAP', 'SRC-WELD-PROPERTY-DATA', 'SRC-WELD-SALES-EXPLORER', 'SRC-WELD-COUNTY-RECORDER', 'SRC-WELD-COUNTY-PARCEL-GIS', 'SRC-WELD-PERMITS', 'SRC-WELD-GIS']) {
  assert.equal(convertCountyStructuredEvidence({
    ...WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  }).classification, 'COUNTY_SOURCE_INVALID');
}
for (const inheritedSourceId of [BOULDER_COUNTY_ASSESSOR_SOURCE_ID, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID, JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID, LARIMER_COUNTY_ASSESSOR_SOURCE_ID] as const) {
  assert.equal(convertCountyStructuredEvidence({
    ...WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
    evidenceReferences: [{ ...WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: inheritedSourceId }],
  }).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
}
assert.equal(convertCountyStructuredEvidence({
  ...WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  ownerName: 'not allowed',
}).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
assert.equal(convertCountyStructuredEvidence({
  ...WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  evidenceReferences: [{ ...WELD_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!, parcelId: 'not allowed' }],
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
const arapahoeTreasurerRequest = {
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER',
  sourceClass: 'COUNTY_TREASURER',
  sourceConfirmation: { sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{
    ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!,
    sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER',
    evidenceReferenceId: 'COUNTY-CONVERSION-ARAPAHOE-TREASURER-CERT-001',
  }],
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  reviewedAt: '2026-08-16',
} as const;
const arapahoeTreasurer = convertCountyStructuredEvidence(arapahoeTreasurerRequest);
assert.equal(arapahoeTreasurer.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(arapahoeTreasurer.sourceId, 'SRC-ARAPAHOE-COUNTY-TREASURER');
assert.equal(arapahoeTreasurer.linkages.length, 1);
assert.equal(arapahoeTreasurer.linkages[0]?.sourceId, 'SRC-ARAPAHOE-COUNTY-TREASURER');
assert.equal(arapahoeTreasurer.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(arapahoeTreasurer.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(arapahoeTreasurer.normalized?.rights.posture, 'UNKNOWN');
assert.equal(arapahoeTreasurer.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(arapahoeTreasurer.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(arapahoeTreasurer.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(arapahoeTreasurer.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertCountyStructuredEvidence(arapahoeTreasurerRequest).conversionFingerprint, arapahoeTreasurer.conversionFingerprint);
assert.notEqual(arapahoeTreasurer.conversionFingerprint, changedSource.conversionFingerprint);
for (const sourceId of ['SRC-ARAPAHOE-COUNTY-PUBLIC-TRUSTEE', 'SRC-ARAPAHOE-COUNTY-RECORDER', 'SRC-ARAPAHOE-COUNTY-GIS', 'SRC-ARAPAHOE-TAX-PAYMENT', 'SRC-ARAPAHOE-TAX-EXTRACT', 'SRC-ARAPAHOE-CERTIFICATE-OF-TAXES-DUE', 'SRC-ARAPAHOE-TAX-LIEN', 'EXP-SRC-ARAPAHOE-COUNTY-TREASURER', 'SRA-ARAPAHOE-COUNTY-TREASURER', 'SRC-GENERIC-COUNTY-TREASURER', 'SRC-PROVIDER-COUNTY-TREASURER']) {
  assert.equal(convertCountyStructuredEvidence({
    ...arapahoeTreasurerRequest,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...arapahoeTreasurerRequest.evidenceReferences[0]!, sourceId }],
  }).classification, 'COUNTY_SOURCE_INVALID');
}
assert.equal(convertCountyStructuredEvidence({ ...arapahoeTreasurerRequest, sourceId: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID, sourceClass: 'COUNTY_ASSESSOR', sourceConfirmation: { sourceId: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' }, evidenceReferences: [{ ...arapahoeTreasurerRequest.evidenceReferences[0]!, sourceId: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID }] }).classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(convertCountyStructuredEvidence({ ...arapahoeTreasurerRequest, sourceClass: 'COUNTY_ASSESSOR' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({ ...arapahoeTreasurerRequest, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...arapahoeTreasurerRequest, certificationReference: undefined }).classification, 'COUNTY_CERTIFICATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...arapahoeTreasurerRequest, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertCountyStructuredEvidence({ ...arapahoeTreasurerRequest, taxpayerName: 'not allowed' }).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
assert.equal(convertCountyStructuredEvidence({
  ...arapahoeTreasurerRequest,
  evidenceReferences: [{ ...arapahoeTreasurerRequest.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-COUNTY-TREASURER' }],
}).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
const adamsTreasurerRequest = {
  ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  sourceId: 'SRC-ADAMS-COUNTY-TREASURER',
  sourceClass: 'COUNTY_TREASURER',
  sourceConfirmation: { sourceId: 'SRC-ADAMS-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{
    ...BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST.evidenceReferences[0]!,
    sourceId: 'SRC-ADAMS-COUNTY-TREASURER',
    evidenceReferenceId: 'COUNTY-CONVERSION-ADAMS-TREASURER-CERT-001',
  }],
  fieldSensitivityPosture: 'RESTRICTED_OR_UNREVIEWED',
  reviewedAt: '2026-08-16',
} as const;
const adamsTreasurer = convertCountyStructuredEvidence(adamsTreasurerRequest);
assert.equal(adamsTreasurer.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(adamsTreasurer.sourceId, 'SRC-ADAMS-COUNTY-TREASURER');
assert.equal(adamsTreasurer.linkages.length, 1);
assert.equal(adamsTreasurer.linkages[0]?.sourceId, 'SRC-ADAMS-COUNTY-TREASURER');
assert.equal(adamsTreasurer.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(adamsTreasurer.normalized?.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(adamsTreasurer.normalized?.rights.posture, 'UNKNOWN');
assert.equal(adamsTreasurer.normalized?.technicalAccess.posture, 'UNKNOWN');
assert.equal(adamsTreasurer.normalized?.freshness.posture, 'UNKNOWN');
assert.equal(adamsTreasurer.normalized?.attribution.posture, 'UNKNOWN');
assert.equal(adamsTreasurer.normalized?.provenance.posture, 'UNKNOWN');
assert.equal(convertCountyStructuredEvidence(adamsTreasurerRequest).conversionFingerprint, adamsTreasurer.conversionFingerprint);
assert.notEqual(adamsTreasurer.conversionFingerprint, changedSource.conversionFingerprint);
assert.notEqual(adamsTreasurer.conversionFingerprint, arapahoeTreasurer.conversionFingerprint);
for (const sourceId of ['SRC-ADAMS-COUNTY-PUBLIC-TRUSTEE', 'SRC-ADAMS-COUNTY-RECORDER', 'SRC-ADAMS-COUNTY-GIS', 'SRC-ADAMS-COUNTY-ASSESSOR', 'SRC-ADAMS-TAX-PAYMENT', 'SRC-ADAMS-TAX-SEARCH', 'SRC-ADAMS-TREASURER-DEED', 'SRC-ADAMS-DEED-APPLICATION', 'SRC-ADAMS-CERTIFICATE', 'SRC-ADAMS-TAX-LIEN', 'EXP-SRC-ADAMS-COUNTY-TREASURER', 'SRA-ADAMS-COUNTY-TREASURER', 'SRC-GENERIC-COUNTY-TREASURER', 'SRC-PROVIDER-COUNTY-TREASURER']) {
  assert.equal(convertCountyStructuredEvidence({
    ...adamsTreasurerRequest,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...adamsTreasurerRequest.evidenceReferences[0]!, sourceId }],
  }).classification, sourceId === 'SRC-ADAMS-COUNTY-ASSESSOR' ? 'COUNTY_EVIDENCE_SOURCE_MISMATCH' : 'COUNTY_SOURCE_INVALID');
}
assert.equal(convertCountyStructuredEvidence({ ...adamsTreasurerRequest, sourceClass: 'COUNTY_ASSESSOR' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertCountyStructuredEvidence({ ...adamsTreasurerRequest, sourceConfirmation: undefined }).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...adamsTreasurerRequest, certificationReference: undefined }).classification, 'COUNTY_CERTIFICATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({ ...adamsTreasurerRequest, fieldSensitivityPosture: 'UNKNOWN' }).classification, 'COUNTY_FIELD_SENSITIVITY_UNREVIEWED');
assert.equal(convertCountyStructuredEvidence({ ...adamsTreasurerRequest, taxpayerName: 'not allowed' }).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
assert.equal(convertCountyStructuredEvidence({ ...adamsTreasurerRequest, rawRecord: 'not allowed' }).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
assert.equal(convertCountyStructuredEvidence({
  ...adamsTreasurerRequest,
  evidenceReferences: [{ ...adamsTreasurerRequest.evidenceReferences[0]!, sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER' }],
}).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
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
