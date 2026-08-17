import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  ADAMS_COUNTY_TREASURER_SOURCE_ID,
  ARAPAHOE_COUNTY_TREASURER_SOURCE_ID,
  BOULDER_COUNTY_TREASURER_SOURCE_ID,
  BROOMFIELD_COUNTY_TREASURER_SOURCE_ID,
  COUNTY_TREASURER_EXACT_SOURCE_CLASS,
  COUNTY_TREASURER_EXACT_SOURCE_CLASS_BY_ID,
  COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS,
  COUNTY_TREASURER_EXACT_SOURCE_IDS,
  JEFFERSON_COUNTY_TREASURER_SOURCE_ID,
  LARIMER_COUNTY_TREASURER_SOURCE_ID,
  WELD_COUNTY_TREASURER_SOURCE_ID,
  isCountyTreasurerExactSourceId,
} from '../lib/sourceQualityCountyTreasurerExactSourceDefinitions';
import { convertPublicRecordStructuredEvidence } from '../lib/sourceQualityPublicRecordEvidenceConversionContract';
import { convertCountyStructuredEvidence } from '../lib/sourceQualityCountyEvidenceConversionContract';
import { BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, convertBoulderCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityBoulderCountyTreasurerEvidence';
import { ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, convertArapahoeCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityArapahoeCountyTreasurerEvidence';
import { ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST, convertAdamsCountyTreasurerSourceQualityEvidence } from '../lib/sourceQualityAdamsCountyTreasurerEvidence';

assert.equal(COUNTY_TREASURER_EXACT_SOURCE_CLASS, 'COUNTY_TREASURER');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_ID, 'SRC-BOULDER-COUNTY-TREASURER');
assert.equal(ARAPAHOE_COUNTY_TREASURER_SOURCE_ID, 'SRC-ARAPAHOE-COUNTY-TREASURER');
assert.equal(ADAMS_COUNTY_TREASURER_SOURCE_ID, 'SRC-ADAMS-COUNTY-TREASURER');
assert.equal(JEFFERSON_COUNTY_TREASURER_SOURCE_ID, 'SRC-JEFFERSON-COUNTY-TREASURER');
assert.equal(LARIMER_COUNTY_TREASURER_SOURCE_ID, 'SRC-LARIMER-COUNTY-TREASURER');
assert.equal(BROOMFIELD_COUNTY_TREASURER_SOURCE_ID, 'SRC-BROOMFIELD-COUNTY-TREASURER');
assert.equal(WELD_COUNTY_TREASURER_SOURCE_ID, 'SRC-WELD-COUNTY-TREASURER');
assert.deepEqual(COUNTY_TREASURER_EXACT_SOURCE_IDS, [
  BOULDER_COUNTY_TREASURER_SOURCE_ID,
  ARAPAHOE_COUNTY_TREASURER_SOURCE_ID,
  ADAMS_COUNTY_TREASURER_SOURCE_ID,
  JEFFERSON_COUNTY_TREASURER_SOURCE_ID,
  LARIMER_COUNTY_TREASURER_SOURCE_ID,
  BROOMFIELD_COUNTY_TREASURER_SOURCE_ID,
  WELD_COUNTY_TREASURER_SOURCE_ID,
]);
assert.equal(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.length, 7);
assert.equal(new Set(COUNTY_TREASURER_EXACT_SOURCE_IDS).size, 7);
for (const definition of COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS) {
  assert.equal(definition.sourceClass, 'COUNTY_TREASURER');
  assert.equal(definition.jurisdiction.state, 'Colorado');
  assert.equal(COUNTY_TREASURER_EXACT_SOURCE_CLASS_BY_ID[definition.sourceId], 'COUNTY_TREASURER');
  assert.equal(isCountyTreasurerExactSourceId(definition.sourceId), true);
}
assert.equal(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.find((definition) => definition.sourceId === BOULDER_COUNTY_TREASURER_SOURCE_ID)?.responsibleOrganization, 'Boulder County Treasurer');
assert.equal(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.find((definition) => definition.sourceId === ARAPAHOE_COUNTY_TREASURER_SOURCE_ID)?.responsibleOrganization, 'Arapahoe County Treasurer');
assert.equal(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.find((definition) => definition.sourceId === ADAMS_COUNTY_TREASURER_SOURCE_ID)?.responsibleOrganization, 'Adams County Treasurer / Treasurer Division');
assert.equal(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.find((definition) => definition.sourceId === JEFFERSON_COUNTY_TREASURER_SOURCE_ID)?.responsibleOrganization, "Jefferson County Treasurer's Office");
assert.equal(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.find((definition) => definition.sourceId === LARIMER_COUNTY_TREASURER_SOURCE_ID)?.responsibleOrganization, 'Larimer County Treasurer & Public Trustee');
assert.equal(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.find((definition) => definition.sourceId === BROOMFIELD_COUNTY_TREASURER_SOURCE_ID)?.responsibleOrganization, 'City and County of Broomfield — Treasurer Department');
assert.equal(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.find((definition) => definition.sourceId === WELD_COUNTY_TREASURER_SOURCE_ID)?.responsibleOrganization, 'Weld County Treasurer and Public Trustee');
assert.equal(isCountyTreasurerExactSourceId(JEFFERSON_COUNTY_TREASURER_SOURCE_ID), true);
assert.equal(isCountyTreasurerExactSourceId(LARIMER_COUNTY_TREASURER_SOURCE_ID), true);
assert.equal(isCountyTreasurerExactSourceId(BROOMFIELD_COUNTY_TREASURER_SOURCE_ID), true);
assert.equal(isCountyTreasurerExactSourceId(WELD_COUNTY_TREASURER_SOURCE_ID), true);

for (const sourceId of ['SRC-SYNTHETIC-COUNTY-TREASURER', 'SRC-UNREGISTERED-COUNTY-TREASURER', 'SRC-FAKE-COUNTY-TREASURER', 'SRC-GENERIC-COUNTY-TREASURER', 'SRC-PROVIDER-COUNTY-TREASURER', 'EXP-SRC-ADAMS-COUNTY-TREASURER', 'SRA-ADAMS-COUNTY-TREASURER']) {
  assert.equal(isCountyTreasurerExactSourceId(sourceId), false);
  const request = {
    ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
    evidenceReferences: [{ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  } as const;
  assert.equal(convertCountyStructuredEvidence(request).classification, 'COUNTY_SOURCE_INVALID');
  assert.equal(convertPublicRecordStructuredEvidence({ ...request, schemaVersion: 'REIE_SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_V1' }).classification, 'PUBLIC_RECORD_SOURCE_INVALID');
}

const arbitraryCategoryOnly = {
  ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  sourceId: 'SRC-ARBITRARY-COUNTY-TREASURER',
  sourceConfirmation: { sourceId: 'SRC-ARBITRARY-COUNTY-TREASURER', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-ARBITRARY-COUNTY-TREASURER' }],
} as const;
assert.equal(convertCountyStructuredEvidence(arbitraryCategoryOnly).classification, 'COUNTY_SOURCE_INVALID');
assert.equal(convertPublicRecordStructuredEvidence({ ...arbitraryCategoryOnly, schemaVersion: 'REIE_SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_V1' }).classification, 'PUBLIC_RECORD_SOURCE_INVALID');

assert.equal(convertBoulderCountyTreasurerSourceQualityEvidence().classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(convertArapahoeCountyTreasurerSourceQualityEvidence().classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(convertAdamsCountyTreasurerSourceQualityEvidence().classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
const jeffersonDefinitionOnlyRequest = {
  ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  sourceId: JEFFERSON_COUNTY_TREASURER_SOURCE_ID,
  sourceConfirmation: { sourceId: JEFFERSON_COUNTY_TREASURER_SOURCE_ID, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: JEFFERSON_COUNTY_TREASURER_SOURCE_ID }],
} as const;
assert.equal(convertCountyStructuredEvidence(jeffersonDefinitionOnlyRequest).classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(convertPublicRecordStructuredEvidence({ ...jeffersonDefinitionOnlyRequest, schemaVersion: 'REIE_SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_V1' }).classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
const larimerDefinitionOnlyRequest = {
  ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  sourceId: LARIMER_COUNTY_TREASURER_SOURCE_ID,
  sourceConfirmation: { sourceId: LARIMER_COUNTY_TREASURER_SOURCE_ID, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-17' },
  evidenceReferences: [{ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: LARIMER_COUNTY_TREASURER_SOURCE_ID }],
  reviewedAt: '2026-08-17',
  certificationReference: { ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference!, linkageReviewedDate: '2026-08-17' },
} as const;
assert.equal(convertCountyStructuredEvidence(larimerDefinitionOnlyRequest).classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(convertPublicRecordStructuredEvidence({ ...larimerDefinitionOnlyRequest, schemaVersion: 'REIE_SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_V1' }).classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
const broomfieldDefinitionOnlyRequest = {
  ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  sourceId: BROOMFIELD_COUNTY_TREASURER_SOURCE_ID,
  sourceConfirmation: { sourceId: BROOMFIELD_COUNTY_TREASURER_SOURCE_ID, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-17' },
  evidenceReferences: [{ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: BROOMFIELD_COUNTY_TREASURER_SOURCE_ID }],
  reviewedAt: '2026-08-17',
  certificationReference: { ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference!, linkageReviewedDate: '2026-08-17' },
} as const;
assert.equal(convertCountyStructuredEvidence(broomfieldDefinitionOnlyRequest).classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(convertPublicRecordStructuredEvidence({ ...broomfieldDefinitionOnlyRequest, schemaVersion: 'REIE_SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_V1' }).classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(convertCountyStructuredEvidence({ ...broomfieldDefinitionOnlyRequest, sourceClass: 'COUNTY_ASSESSOR' }).classification, 'COUNTY_EVIDENCE_SOURCE_MISMATCH');
assert.equal(convertPublicRecordStructuredEvidence({ ...broomfieldDefinitionOnlyRequest, sourceClass: 'COUNTY_ASSESSOR', schemaVersion: 'REIE_SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_V1' }).classification, 'PUBLIC_RECORD_SOURCE_MISMATCH');
const weldDefinitionOnlyRequest = {
  ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  sourceId: WELD_COUNTY_TREASURER_SOURCE_ID,
  sourceConfirmation: { sourceId: WELD_COUNTY_TREASURER_SOURCE_ID, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: '2026-08-16' },
  evidenceReferences: [{ ...ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: WELD_COUNTY_TREASURER_SOURCE_ID }],
} as const;
assert.equal(convertCountyStructuredEvidence(weldDefinitionOnlyRequest).classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(convertPublicRecordStructuredEvidence({ ...weldDefinitionOnlyRequest, schemaVersion: 'REIE_SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_V1' }).classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(convertCountyStructuredEvidence(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST).conversionFingerprint, convertBoulderCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.equal(convertCountyStructuredEvidence(ARAPAHOE_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST).conversionFingerprint, convertArapahoeCountyTreasurerSourceQualityEvidence().conversionFingerprint);
assert.equal(convertCountyStructuredEvidence(ADAMS_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST).conversionFingerprint, convertAdamsCountyTreasurerSourceQualityEvidence().conversionFingerprint);

const runtime = await readFile(new URL('../lib/sourceQualityCountyTreasurerExactSourceDefinitions.ts', import.meta.url), 'utf8');
for (const prohibited of ['rights', 'technicalAccess', 'freshness', 'attribution', 'provenance', 'fee', 'sensitivity', 'reviewedAt', 'certification', 'evidence', 'payment', 'lien', 'deed', 'Manifest', 'activation', 'claimEligible', 'startsWith', 'includes(sourceId)', 'COUNTY_TREASURER_TAX']) {
  assert.equal(runtime.includes(prohibited), false, 'Treasurer exact-source definitions must not centralize ' + prohibited);
}
assert.equal((runtime.match(/Public Trustee/g) ?? []).length, 2, 'Public Trustee text must appear only inside Weld and Larimer responsible organization identities.');

console.log('[source-quality-county-treasurer-exact-source-definitions] ok: finite exact Treasurer source identity definitions cover Boulder/Arapahoe/Adams/Jefferson/Larimer/Broomfield/Weld only, preserve exact fail-closed behavior for future counties/provider/EXP/SRA/wildcard inputs, and do not centralize source-specific governance.');
