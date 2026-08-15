import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  BOULDER_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY,
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL,
  BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  convertBoulderCountyAssessorSourceQualityEvidence,
  createBoulderCountyAssessorSourceQualityAssemblyRequest,
  normalizeBoulderCountyAssessorSourceQualityEvidence,
  summarizeBoulderCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityBoulderCountyAssessorEvidence';
import { convertCountyStructuredEvidence } from '../lib/sourceQualityCountyEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const conversion = convertBoulderCountyAssessorSourceQualityEvidence();
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_ID, 'SRC-BOULDER-COUNTY-ASSESSOR');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, BOULDER_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_ASSESSOR');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, BOULDER_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'PROPERTY_RECORD_CONTEXT');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, BOULDER_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');

const foreignReference = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{ ...BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-COUNTY-TREASURER' }],
});
assert.equal(foreignReference.classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
for (const foreignSourceId of ['SRC-BOULDER-COUNTY-TREASURER', 'SRC-BOULDER-PERMIT-CANDIDATES', 'SRC-UNKNOWN-COUNTY-SOURCE']) {
  const foreignConfirmation = convertCountyStructuredEvidence({
    ...BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceConfirmation: { sourceId: foreignSourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
  });
  assert.equal(foreignConfirmation.classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
}
const missingCertification = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  certificationReference: undefined,
});
assert.equal(missingCertification.classification, 'COUNTY_CERTIFICATION_REQUIRED');
const missingCertificationInput = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{
    sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
    inputClass: 'RIGHTS_READINESS_REFERENCE',
    evidenceReferenceId: 'SQE-BOULDER-COUNTY-ASSESSOR-STRUCTURAL-ONLY-001',
    posture: 'UNKNOWN',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
});
assert.equal(missingCertificationInput.classification, 'COUNTY_CERTIFICATION_REQUIRED');
const missingReviewedAt = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CONVERSION_REQUEST,
  reviewedAt: '',
});
assert.equal(missingReviewedAt.classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
assert.equal(convertBoulderCountyAssessorSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertBoulderCountyAssessorSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);

const normalized = normalizeBoulderCountyAssessorSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, BOULDER_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeBoulderCountyAssessorSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

const summary = summarizeBoulderCountyAssessorSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createBoulderCountyAssessorSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(BOULDER_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.sraReadiness, 'SRA_READINESS_RECORD_NOT_DIRECT_SOURCE_QUALITY_RIGHTS_EVIDENCE');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');

const runtime = await readFile(new URL('../lib/sourceQualityBoulderCountyAssessorEvidence.ts', import.meta.url), 'utf8');
const directSraIdentifier = ['SRA', 'BOULDER', 'COUNTY', 'ASSESSOR'].join('-');
for (const forbidden of ['sourceRightsActivationReadiness', directSraIdentifier, '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture']) assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
console.log('[source-quality-boulder-county-assessor-evidence] ok: exact Assessor certification-only metadata reuses canonical county conversion with known gaps, no SRA rights reuse, no raw data, and no authority grant.');
