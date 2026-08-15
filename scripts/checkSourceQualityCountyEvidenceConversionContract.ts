import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID,
  BOULDER_COUNTY_ASSESSOR_CONVERSION_POSTURE,
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST,
  COUNTY_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS,
  COUNTY_SOURCE_QUALITY_CONVERSION_FIREWALL,
  convertCountyStructuredEvidence,
  createCountySourceQualityAssemblyRequest,
} from '../lib/sourceQualityCountyEvidenceConversionContract';
import { summarizeSourceQuality } from '../lib/sourceQualityControl';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const valid = convertCountyStructuredEvidence(BOULDER_COUNTY_ASSESSOR_SYNTHETIC_CONVERSION_REQUEST);
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-BOULDER-COUNTY-ASSESSOR');
assert.deepEqual(COUNTY_SOURCE_QUALITY_CONVERSION_ALLOWED_SOURCE_IDS, [
  'SRC-BOULDER-COUNTY-ASSESSOR',
  'SRC-BOULDER-COUNTY-TREASURER',
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
