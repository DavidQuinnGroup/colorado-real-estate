import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
  normalizeSourceEvidence,
  type SourceEvidenceLinkageRecord,
} from '../lib/sourceQualityEvidenceNormalization';

const sourceId = 'SRC-BOULDER-COUNTY-ASSESSOR';
const reviewedDate = '2026-08-15';
const certification = {
  certificationId: 'CERT-SOURCE-REGISTRY',
  repositoryReference: 'docs/project-atlas/executive-library/REIE-SOURCE-REGISTRY-GRAND-PLAN-ADVANCEMENT-PRODUCTION-CERTIFICATION.md',
  referenceVersion: 'V01',
  linkageReviewedDate: reviewedDate,
} as const;

const completeLinkages: readonly SourceEvidenceLinkageRecord[] = [
  {
    schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
    sourceId,
    evidenceClass: 'SOURCE_RIGHTS_READINESS',
    authoritativeContractType: 'SOURCE_RIGHTS_READINESS_CONTRACT',
    evidenceReferenceId: 'SRA-BOULDER-COUNTY-ASSESSOR',
    repositoryReference: 'lib/sourceRightsActivationReadiness.ts',
    relationshipType: 'RIGHTS',
    posture: 'VERIFIED',
    verificationStatus: 'VERIFIED',
    certificationReference: certification,
    lastReviewedDate: reviewedDate,
    limitationCodes: [],
    linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE',
  },
  {
    schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
    sourceId,
    evidenceClass: 'PROVIDER_INVENTORY',
    authoritativeContractType: 'PROVIDER_INVENTORY_CONTRACT',
    evidenceReferenceId: 'GIS-PROVIDER-ASSESSOR-REVIEW',
    repositoryReference: 'lib/geographic-intelligence/providerInventoryContract.ts',
    relationshipType: 'TECHNICAL_ACCESS',
    posture: 'READY',
    verificationStatus: 'VERIFIED',
    certificationReference: certification,
    lastReviewedDate: reviewedDate,
    limitationCodes: [],
    linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE',
  },
  {
    schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
    sourceId,
    evidenceClass: 'DOMAIN_FRESHNESS',
    authoritativeContractType: 'DOMAIN_FRESHNESS_CONTRACT',
    evidenceReferenceId: 'DOMAIN-FRESHNESS-ASSESSOR-20260815',
    repositoryReference: 'DOMAIN_STRUCTURED_CONTRACT',
    relationshipType: 'FRESHNESS',
    posture: 'VERIFIED_CURRENT',
    verificationStatus: 'VERIFIED',
    certificationReference: certification,
    lastReviewedDate: reviewedDate,
    limitationCodes: [],
    linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE',
  },
  {
    schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
    sourceId,
    evidenceClass: 'SOURCE_RIGHTS_READINESS',
    authoritativeContractType: 'SOURCE_RIGHTS_READINESS_CONTRACT',
    evidenceReferenceId: 'SRA-ASSESSOR-ATTRIBUTION',
    repositoryReference: 'lib/sourceRightsActivationReadiness.ts',
    relationshipType: 'ATTRIBUTION',
    posture: 'REQUIRED',
    verificationStatus: 'VERIFIED',
    certificationReference: certification,
    lastReviewedDate: reviewedDate,
    limitationCodes: ['ATTRIBUTION_REQUIRED'],
    linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE',
  },
  {
    schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
    sourceId,
    evidenceClass: 'EVIDENCE_DEPTH',
    authoritativeContractType: 'EVIDENCE_DEPTH_CONTRACT',
    evidenceReferenceId: 'EDF-ASSESSOR-PROVENANCE-001',
    repositoryReference: 'lib/evidence-depth/evidencePosture.ts',
    relationshipType: 'PROVENANCE',
    posture: 'COMPLETE',
    verificationStatus: 'VERIFIED',
    certificationReference: certification,
    lastReviewedDate: reviewedDate,
    limitationCodes: [],
    linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE',
  },
  {
    schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
    sourceId,
    evidenceClass: 'CERTIFICATION',
    authoritativeContractType: 'CERTIFICATION_REFERENCE',
    evidenceReferenceId: 'CERT-SOURCE-REGISTRY',
    repositoryReference: 'docs/project-atlas/executive-library',
    relationshipType: 'CERTIFICATION',
    posture: 'REFERENCED',
    verificationStatus: 'VERIFIED',
    certificationReference: certification,
    lastReviewedDate: reviewedDate,
    limitationCodes: [],
    linkageProvenance: 'CERTIFICATION_REFERENCE_ONLY',
  },
];

function normalized(linkages: unknown = completeLinkages, id = sourceId) {
  return normalizeSourceEvidence({ sourceId: id, linkages });
}

const complete = normalized();
assert.equal(complete.result, 'NORMALIZED');
assert.equal(complete.rights.posture, 'VERIFIED');
assert.equal(complete.technicalAccess.posture, 'READY');
assert.equal(complete.freshness.posture, 'VERIFIED_CURRENT');
assert.equal(complete.attribution.posture, 'REQUIRED');
assert.equal(complete.provenance.posture, 'COMPLETE');
assert.equal(complete.certification.posture, 'REFERENCED');
assert.equal(complete.activation.declaredPosture, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(complete.source?.claimEligible, false);

const missingSource = normalizeSourceEvidence({ linkages: completeLinkages });
assert.equal(missingSource.result, 'INVALID_LINKAGE');
assert.ok(missingSource.reasons.includes('MISSING_SOURCE_ID'));
const unknownSource = normalized(completeLinkages, 'SRC-UNKNOWN-SOURCE');
assert.equal(unknownSource.result, 'INVALID_LINKAGE');
assert.ok(unknownSource.reasons.includes('UNKNOWN_SOURCE_ID'));

const without = (relationshipType: SourceEvidenceLinkageRecord['relationshipType']) => completeLinkages.filter((entry) => entry.relationshipType !== relationshipType);
assert.equal(normalized(without('RIGHTS')).result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized(without('RIGHTS')).rights.posture, 'UNKNOWN');
assert.equal(normalized(without('FRESHNESS')).freshness.posture, 'UNKNOWN');
assert.equal(normalized(without('CERTIFICATION')).certification.posture, 'ABSENT');

const pendingRights = normalized(completeLinkages.map((entry) => entry.relationshipType === 'RIGHTS' ? { ...entry, posture: 'PENDING' as const } : entry));
assert.equal(pendingRights.result, 'INSUFFICIENT_EVIDENCE');
const restrictedRights = normalized(completeLinkages.map((entry) => entry.relationshipType === 'RIGHTS' ? { ...entry, posture: 'RESTRICTED' as const, limitationCodes: ['RIGHTS_RESTRICTED'] as const } : entry));
assert.equal(restrictedRights.rights.posture, 'RESTRICTED');
assert.equal(restrictedRights.source?.claimEligible, false);
const pendingProvider = normalized(completeLinkages.map((entry) => entry.relationshipType === 'TECHNICAL_ACCESS' ? { ...entry, posture: 'PENDING' as const, verificationStatus: 'PENDING' as const } : entry));
assert.equal(pendingProvider.result, 'INSUFFICIENT_EVIDENCE');
const unknownTechnical = normalized(completeLinkages.map((entry) => entry.relationshipType === 'TECHNICAL_ACCESS' ? { ...entry, posture: 'UNKNOWN' as const } : entry));
assert.equal(unknownTechnical.result, 'INSUFFICIENT_EVIDENCE');
const staleFreshness = normalized(completeLinkages.map((entry) => entry.relationshipType === 'FRESHNESS' ? { ...entry, posture: 'STALE_VERIFICATION' as const, limitationCodes: ['FRESHNESS_STALE_VERIFICATION'] as const } : entry));
assert.equal(staleFreshness.freshness.posture, 'STALE_VERIFICATION');
assert.equal(staleFreshness.result, 'INSUFFICIENT_EVIDENCE');
const unknownAttribution = normalized(completeLinkages.map((entry) => entry.relationshipType === 'ATTRIBUTION' ? { ...entry, posture: 'UNKNOWN' as const } : entry));
assert.equal(unknownAttribution.result, 'INSUFFICIENT_EVIDENCE');
const incompleteProvenance = normalized(completeLinkages.map((entry) => entry.relationshipType === 'PROVENANCE' ? { ...entry, posture: 'INCOMPLETE' as const, limitationCodes: ['PROVENANCE_INCOMPLETE'] as const } : entry));
assert.equal(incompleteProvenance.result, 'INSUFFICIENT_EVIDENCE');
const unverified = normalized(completeLinkages.map((entry) => entry.relationshipType === 'RIGHTS' ? { ...entry, verificationStatus: 'UNVERIFIED' as const } : entry));
assert.equal(unverified.result, 'INSUFFICIENT_EVIDENCE');

const malformed = normalized(completeLinkages.map((entry) => entry.relationshipType === 'RIGHTS' ? { ...entry, evidenceReferenceId: 'https://invalid.example' } : entry));
assert.equal(malformed.result, 'INVALID_LINKAGE');
assert.ok(malformed.reasons.includes('MALFORMED_EVIDENCE_REFERENCE'));
const conflict = normalized([...completeLinkages, { ...completeLinkages[0], evidenceReferenceId: 'SRA-ASSESSOR-CONFLICT', posture: 'RESTRICTED' as const, limitationCodes: ['RIGHTS_RESTRICTED'] as const }]);
assert.equal(conflict.result, 'CONFLICT_REQUIRES_REVIEW');
assert.equal(conflict.conflicts[0]?.relationshipType, 'RIGHTS');

for (const unsupportedSimilarity of [
  { providerName: 'Boulder County Assessor' },
  { countyName: 'Boulder County' },
  { fileName: 'sourceRightsActivationReadiness.ts' },
  { sourceUrl: 'https://bouldercounty.gov' },
  { semanticSimilarity: 'same source' },
]) {
  const similarity = normalized([{ ...completeLinkages[0], ...unsupportedSimilarity }]);
  assert.equal(similarity.result, 'INVALID_LINKAGE');
  assert.ok(similarity.reasons.includes('MALFORMED_LINKAGE_RECORD'));
}

const similarIds = normalized([{ ...completeLinkages[0], sourceId: 'SRA-BOULDER-COUNTY-ASSESSOR' }]);
assert.equal(similarIds.result, 'INVALID_LINKAGE');
assert.ok(similarIds.reasons.includes('FOREIGN_LINKAGE_SOURCE_ID'));
const narrativeOnly = normalized([
  ...without('CERTIFICATION'),
  {
    ...completeLinkages[5],
    evidenceClass: 'NARRATIVE_ONLY' as const,
    authoritativeContractType: 'NARRATIVE_REFERENCE_ONLY' as const,
    evidenceReferenceId: 'NARRATIVE-TRIAL-TERMS',
    repositoryReference: 'docs/project-atlas/executive-library' as const,
    limitationCodes: ['NARRATIVE_ONLY_NON_COMPOSABLE'] as const,
  },
]);
assert.equal(narrativeOnly.result, 'NORMALIZED');
assert.equal(narrativeOnly.rights.posture, 'VERIFIED');
assert.equal(narrativeOnly.certification.posture, 'REFERENCED');

const repeat = normalized();
assert.deepEqual(complete, repeat);
const changed = normalized(completeLinkages.map((entry) => entry.relationshipType === 'ATTRIBUTION' ? { ...entry, posture: 'REQUIRED_PENDING_CONFIRMATION' as const } : entry));
assert.notEqual(complete.normalizationFingerprint, changed.normalizationFingerprint);
assert.equal(complete.activation.declaredPosture, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(complete.source?.customerDisclosureEligible, true);

const runtimeSource = await readFile(new URL('../lib/sourceQualityEvidenceNormalization.ts', import.meta.url), 'utf8');
for (const prohibitedReference of [
  '@prisma/client',
  'node:fs',
  'fetch(',
  'http://',
  'https://',
  'mlsGridClient',
  'CRMTask',
  'taskIntent',
  'Typesense',
  'next/',
  'queue',
  'worker',
  'nodemailer',
  'resend',
  'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS',
]) assert.ok(!runtimeSource.includes(prohibitedReference), 'Pure normalization contract must not reference ' + prohibitedReference);

console.log('[source-quality-evidence-normalization] ok: explicit reviewed links normalize deterministically without fuzzy joins, activation, provider/county calls, credentials, database, CRM, Search, Typesense, UI, or workflow behavior.');
