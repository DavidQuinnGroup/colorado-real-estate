import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  BOULDER_COUNTY_TREASURER_MANIFEST_ELIGIBILITY,
  BOULDER_COUNTY_TREASURER_SOURCE_ID,
  BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL,
  convertBoulderCountyTreasurerSourceQualityEvidence,
  createBoulderCountyTreasurerSourceQualityAssemblyRequest,
  normalizeBoulderCountyTreasurerSourceQualityEvidence,
  summarizeBoulderCountyTreasurerSourceQualityEvidence,
} from '../lib/sourceQualityBoulderCountyTreasurerEvidence';
import { convertCountyStructuredEvidence } from '../lib/sourceQualityCountyEvidenceConversionContract';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const conversion = convertBoulderCountyTreasurerSourceQualityEvidence();
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_ID, 'SRC-BOULDER-COUNTY-TREASURER');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, BOULDER_COUNTY_TREASURER_SOURCE_ID);
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_TREASURER');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, BOULDER_COUNTY_TREASURER_SOURCE_ID);
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'IDENTIFIER_BEARING_CONTEXT');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, BOULDER_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, BOULDER_COUNTY_TREASURER_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.posture, 'REFERENCED');

for (const sourceId of ['SRC-BOULDER-COUNTY-ASSESSOR', 'SRC-BOULDER-PERMIT-CANDIDATES', 'SRC-BCOD-ADDRESS-POINTS', 'SRC-UNKNOWN-COUNTY-SOURCE', 'BOULDER-COUNTY', 'TREASURER']) {
  const result = convertCountyStructuredEvidence({
    ...BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  });
  assert.notEqual(result.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
}
const foreignReference = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{ ...BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-COUNTY-ASSESSOR' }],
});
assert.equal(foreignReference.classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
const missingCertification = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  certificationReference: undefined,
});
assert.equal(missingCertification.classification, 'COUNTY_CERTIFICATION_REQUIRED');
const missingCertificationInput = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{
    sourceId: BOULDER_COUNTY_TREASURER_SOURCE_ID,
    inputClass: 'RIGHTS_READINESS_REFERENCE',
    evidenceReferenceId: 'SQE-BOULDER-COUNTY-TREASURER-STRUCTURAL-ONLY-001',
    posture: 'UNKNOWN',
    verificationStatus: 'VERIFIED',
    limitationCodes: [],
  }],
});
assert.equal(missingCertificationInput.classification, 'COUNTY_CERTIFICATION_REQUIRED');
const missingReviewedAt = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CONVERSION_REQUEST,
  reviewedAt: '',
});
assert.equal(missingReviewedAt.classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
assert.equal(convertBoulderCountyTreasurerSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertBoulderCountyTreasurerSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);

const normalized = normalizeBoulderCountyTreasurerSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, BOULDER_COUNTY_TREASURER_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeBoulderCountyTreasurerSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

const summary = summarizeBoulderCountyTreasurerSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createBoulderCountyTreasurerSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.equal(assembly.assembly?.sourceCount, 1);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(BOULDER_COUNTY_TREASURER_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryTermsReview, 'TERMS_REVIEW_REQUIRED_NOT_RESOLVED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.retrieval, 'SCRAPING_OR_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');

const runtime = await readFile(new URL('../lib/sourceQualityBoulderCountyTreasurerEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['sourceRightsActivationReadiness', 'SRA-BOULDER-COUNTY-TREASURER', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'sourceQualityOperationalManifestData', 'sourceQualityAdminPreviewFixture']) assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
console.log('[source-quality-boulder-county-treasurer-evidence] ok: exact Treasurer certification-only metadata reuses canonical county conversion with known gaps, no rights/access/currentness upgrade, no raw tax data, and no authority grant.');
