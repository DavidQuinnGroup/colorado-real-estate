import assert from 'node:assert/strict';

import {
  HUMAN_REVIEWED_EVIDENCE_CONVERSION_FIREWALL,
  SOURCE_QUALITY_HUMAN_REVIEWED_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  convertHumanReviewedSourceQualityEvidence,
} from '../lib/sourceQualityHumanReviewedEvidenceConversionContract';
import { normalizeSourceEvidence } from '../lib/sourceQualityEvidenceNormalization';
import { summarizeSourceQuality } from '../lib/sourceQualityControl';
import { assembleSourceQualitySummaries, SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION } from '../lib/sourceQualitySummaryAssembly';

const certification = {
  certificationId: 'CERT-HUMAN-REVIEWED-SYNTHETIC-001',
  repositoryReference: 'docs/project-atlas/executive-library',
  referenceVersion: 'V01',
  linkageReviewedDate: '2026-08-15',
} as const;
const syntheticRights = {
  schemaVersion: SOURCE_QUALITY_HUMAN_REVIEWED_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  sourceId: 'SRC-BOULDER-COUNTY-ASSESSOR',
  findingClass: 'RIGHTS',
  findingPosture: 'RIGHTS_PERMITTED',
  humanReviewAssertion: 'HUMAN_REVIEW_COMPLETED',
  evidenceReference: { sourceId: 'SRC-BOULDER-COUNTY-ASSESSOR', referenceClass: 'HUMAN_REVIEWED_EVIDENCE_REFERENCE', referenceId: 'HRE-SYNTHETIC-ASSESSOR-RIGHTS-001' },
  reviewAuthorityClass: 'EXECUTIVE_SOURCE_GOVERNANCE_REVIEW',
  reviewedAt: '2026-08-15',
  certificationReference: certification,
  limitationCodes: [],
} as const;

const rights = convertHumanReviewedSourceQualityEvidence(syntheticRights);
assert.equal(rights.classification, 'HUMAN_REVIEWED_EVIDENCE_CONVERSION_VALID');
assert.equal(rights.sourceId, syntheticRights.sourceId);
assert.equal(rights.linkages.length, 2);
assert.equal(rights.linkages.some((linkage) => linkage.relationshipType === 'RIGHTS' && linkage.posture === 'VERIFIED'), true);
assert.equal(convertHumanReviewedSourceQualityEvidence(syntheticRights).inputFingerprint, rights.inputFingerprint);
assert.equal(convertHumanReviewedSourceQualityEvidence(syntheticRights).conversionFingerprint, rights.conversionFingerprint);

for (const findingPosture of ['RIGHTS_RESTRICTED', 'RIGHTS_PROHIBITED', 'RIGHTS_UNKNOWN']) assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, findingPosture }).classification, 'HUMAN_REVIEWED_EVIDENCE_CONVERSION_VALID');
for (const request of [
  { ...syntheticRights, findingClass: 'TECHNICAL_ACCESS', findingPosture: 'TECHNICAL_ACCESS_AVAILABLE' },
  { ...syntheticRights, findingClass: 'TECHNICAL_ACCESS', findingPosture: 'TECHNICAL_ACCESS_RESTRICTED' },
  { ...syntheticRights, findingClass: 'TECHNICAL_ACCESS', findingPosture: 'TECHNICAL_ACCESS_UNAVAILABLE' },
  { ...syntheticRights, findingClass: 'TECHNICAL_ACCESS', findingPosture: 'TECHNICAL_ACCESS_UNKNOWN' },
  { ...syntheticRights, findingClass: 'FRESHNESS', findingPosture: 'FRESHNESS_DOCUMENTED' },
  { ...syntheticRights, findingClass: 'FRESHNESS', findingPosture: 'FRESHNESS_DOMAIN_SPECIFIC' },
  { ...syntheticRights, findingClass: 'FRESHNESS', findingPosture: 'FRESHNESS_UNKNOWN' },
  { ...syntheticRights, findingClass: 'ATTRIBUTION', findingPosture: 'ATTRIBUTION_REQUIRED' },
  { ...syntheticRights, findingClass: 'ATTRIBUTION', findingPosture: 'ATTRIBUTION_NOT_DOCUMENTED' },
  { ...syntheticRights, findingClass: 'ATTRIBUTION', findingPosture: 'ATTRIBUTION_UNKNOWN' },
  { ...syntheticRights, findingClass: 'FEE', findingPosture: 'FEE_REQUIRED' },
  { ...syntheticRights, findingClass: 'FEE', findingPosture: 'FEE_NOT_DOCUMENTED' },
  { ...syntheticRights, findingClass: 'FEE', findingPosture: 'FEE_UNKNOWN' },
  { ...syntheticRights, findingClass: 'DISCLAIMER', findingPosture: 'DISCLAIMER_REQUIRED' },
  { ...syntheticRights, findingClass: 'DISCLAIMER', findingPosture: 'DISCLAIMER_NOT_DOCUMENTED' },
  { ...syntheticRights, findingClass: 'DISCLAIMER', findingPosture: 'DISCLAIMER_UNKNOWN' },
  { ...syntheticRights, findingClass: 'REFERRAL', findingPosture: 'REFERRAL_REQUIRED' },
  { ...syntheticRights, findingClass: 'REFERRAL', findingPosture: 'REFERRAL_NOT_REQUIRED_DOCUMENTED' },
  { ...syntheticRights, findingClass: 'FOLLOW_UP', findingPosture: 'FOLLOW_UP_REQUIRED' },
  { ...syntheticRights, findingClass: 'FOLLOW_UP', findingPosture: 'FOLLOW_UP_NOT_REQUIRED_DOCUMENTED' },
  { ...syntheticRights, findingClass: 'PROVENANCE', findingPosture: 'PROVENANCE_PARTIAL' },
  { ...syntheticRights, findingClass: 'PROVENANCE', findingPosture: 'PROVENANCE_INCOMPLETE' },
  { ...syntheticRights, findingClass: 'PROVENANCE', findingPosture: 'PROVENANCE_UNKNOWN' },
]) assert.equal(convertHumanReviewedSourceQualityEvidence(request).classification, 'HUMAN_REVIEWED_EVIDENCE_CONVERSION_VALID');

assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, sourceId: 'not-a-source', evidenceReference: { ...syntheticRights.evidenceReference, sourceId: 'not-a-source' } }).classification, 'SOURCE_ID_INVALID');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, sourceId: 'SRC-UNKNOWN-HUMAN-REVIEWED-SOURCE', evidenceReference: { ...syntheticRights.evidenceReference, sourceId: 'SRC-UNKNOWN-HUMAN-REVIEWED-SOURCE' } }).classification, 'SOURCE_ID_INVALID');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, evidenceReference: { ...syntheticRights.evidenceReference, sourceId: 'SRC-BOULDER-COUNTY-TREASURER' } }).classification, 'SOURCE_MISMATCH');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, humanReviewAssertion: 'NOT_REVIEWED' }).classification, 'HUMAN_REVIEW_REQUIRED');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, reviewAuthorityClass: 'MODEL_INFERENCE' }).classification, 'REVIEW_AUTHORITY_UNSUPPORTED');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, evidenceReference: undefined }).classification, 'EVIDENCE_REFERENCE_REQUIRED');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, certificationReference: undefined }).classification, 'CERTIFICATION_REQUIRED');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, reviewedAt: '' }).classification, 'SOURCE_ID_INVALID');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, findingClass: 'UNSUPPORTED' }).classification, 'FINDING_CLASS_UNSUPPORTED');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, findingPosture: 'UNSUPPORTED' }).classification, 'FINDING_POSTURE_UNSUPPORTED');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, narrative: 'not composable' }).classification, 'NARRATIVE_INPUT_REJECTED');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, emailBody: 'not composable' }).classification, 'NARRATIVE_INPUT_REJECTED');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, email: 'not allowed' }).classification, 'PII_OR_SECRET_INPUT_REJECTED');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, ownerName: 'not allowed' }).classification, 'PII_OR_SECRET_INPUT_REJECTED');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, credential: 'not allowed' }).classification, 'PII_OR_SECRET_INPUT_REJECTED');
assert.equal(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, protectedArtifact: 'not composable' }).classification, 'FAIL_CLOSED');

const normalizedRights = normalizeSourceEvidence({ sourceId: syntheticRights.sourceId, linkages: rights.linkages });
assert.equal(normalizedRights.rights.posture, 'VERIFIED');
assert.equal(normalizedRights.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalizedRights.freshness.posture, 'UNKNOWN');
assert.equal(normalizedRights.attribution.posture, 'UNKNOWN');
assert.equal(normalizedRights.provenance.posture, 'UNKNOWN');
assert.equal(summarizeSourceQuality(normalizedRights).classification, 'INSUFFICIENT_EVIDENCE');
const assembly = assembleSourceQualitySummaries({
  schemaVersion: SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
  assemblyId: 'SQS-HUMAN-REVIEWED-SYNTHETIC-001',
  coverageClass: 'PARTIAL_REVIEWED_SOURCE_SET',
  certificationReference: certification,
  entries: [{ sourceId: syntheticRights.sourceId, inclusionPosture: 'EXPLICITLY_SUPPLIED_SPARSE_REVIEW_SOURCE', linkages: rights.linkages, certificationReference: certification }],
});
assert.notEqual(assembly.classification, 'FAIL_CLOSED');

const restricted = convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, findingPosture: 'RIGHTS_RESTRICTED' });
const conflict = normalizeSourceEvidence({ sourceId: syntheticRights.sourceId, linkages: [...rights.linkages, ...restricted.linkages.filter((linkage) => linkage.relationshipType === 'RIGHTS')] });
assert.equal(conflict.result, 'CONFLICT_REQUIRES_REVIEW');
assert.notEqual(convertHumanReviewedSourceQualityEvidence({ ...syntheticRights, evidenceReference: { ...syntheticRights.evidenceReference, referenceId: 'HRE-SYNTHETIC-ASSESSOR-RIGHTS-002' } }).conversionFingerprint, rights.conversionFingerprint);
assert.equal(HUMAN_REVIEWED_EVIDENCE_CONVERSION_FIREWALL.modelDoesNotParseNarrative, 'MODEL_DOES_NOT_PARSE_SOURCE_NARRATIVE');
assert.equal(HUMAN_REVIEWED_EVIDENCE_CONVERSION_FIREWALL.humanReviewRequired, 'HUMAN_REVIEW_REQUIRED');
assert.equal(HUMAN_REVIEWED_EVIDENCE_CONVERSION_FIREWALL.evidenceOnly, 'STRUCTURED_HUMAN_FINDING_IS_EVIDENCE_ONLY');
assert.equal(HUMAN_REVIEWED_EVIDENCE_CONVERSION_FIREWALL.activation, 'SOURCE_ACTIVATION_SEPARATELY_GOVERNED');
assert.equal(HUMAN_REVIEWED_EVIDENCE_CONVERSION_FIREWALL.retrieval, 'SCRAPING_OR_RETRIEVAL_SEPARATELY_GOVERNED');
assert.equal(HUMAN_REVIEWED_EVIDENCE_CONVERSION_FIREWALL.customerDisplay, 'CUSTOMER_DISPLAY_SEPARATELY_GOVERNED');
assert.equal(HUMAN_REVIEWED_EVIDENCE_CONVERSION_FIREWALL.legalUse, 'LEGAL_USE_SEPARATELY_GOVERNED');
console.log('[source-quality-human-reviewed-evidence-conversion-contract] ok: finite human-reviewed metadata converts deterministically without narrative parsing, source inference, authority grant, or protected-system behavior.');
