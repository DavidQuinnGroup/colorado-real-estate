import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
  normalizeSourceEvidence,
  type SourceEvidenceLinkageRecord,
} from '../lib/sourceQualityEvidenceNormalization';
import { summarizeSourceQuality } from '../lib/sourceQualityControl';

const sourceId = 'SRC-BOULDER-COUNTY-ASSESSOR';
const reviewedDate = '2026-08-15';
const certification = {
  certificationId: 'CERT-SOURCE-REGISTRY',
  repositoryReference: 'docs/project-atlas/executive-library/REIE-SOURCE-REGISTRY-GRAND-PLAN-ADVANCEMENT-PRODUCTION-CERTIFICATION.md',
  referenceVersion: 'V01',
  linkageReviewedDate: reviewedDate,
} as const;

const linkages: readonly SourceEvidenceLinkageRecord[] = [
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
    posture: 'NONE_DOCUMENTED',
    verificationStatus: 'VERIFIED',
    certificationReference: certification,
    lastReviewedDate: reviewedDate,
    limitationCodes: [],
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

const canonical = normalizeSourceEvidence({ sourceId, linkages });
assert.equal(canonical.result, 'NORMALIZED');

function clone() {
  return JSON.parse(JSON.stringify(canonical)) as typeof canonical;
}

const complete = summarizeSourceQuality(canonical);
assert.equal(complete.classification, 'REVIEW_POSTURE_COMPLETE');
assert.ok(complete.summary);
assert.equal(complete.summary?.source.sourceId, sourceId);
assert.equal(complete.summary?.source.coverage, 'NOT_EXPOSED_BY_CANONICAL_NORMALIZATION');
assert.equal(complete.summary?.activationFirewall.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_THIS_SUMMARY');
assert.equal(complete.summary?.activationFirewall.customerDisplayAuthority, 'NOT_GRANTED_BY_THIS_SUMMARY');
assert.equal('qualityScore' in (complete.summary ?? {}), false);

const postures: readonly [keyof typeof canonical, string, string][] = [
  ['rights', 'PENDING', 'RIGHTS_REVIEW_REQUIRED'],
  ['rights', 'UNKNOWN', 'RIGHTS_REVIEW_REQUIRED'],
  ['rights', 'RESTRICTED', 'RIGHTS_REVIEW_REQUIRED'],
  ['technicalAccess', 'PENDING', 'TECHNICAL_ACCESS_REVIEW_REQUIRED'],
  ['technicalAccess', 'BLOCKED', 'TECHNICAL_ACCESS_REVIEW_REQUIRED'],
  ['technicalAccess', 'UNKNOWN', 'TECHNICAL_ACCESS_REVIEW_REQUIRED'],
  ['freshness', 'STALE_VERIFICATION', 'STALE_VERIFICATION_REVIEW_REQUIRED'],
  ['freshness', 'UNKNOWN', 'FRESHNESS_REVIEW_REQUIRED'],
  ['freshness', 'DOMAIN_SPECIFIC', 'FRESHNESS_REVIEW_REQUIRED'],
  ['attribution', 'REQUIRED', 'ATTRIBUTION_REVIEW_REQUIRED'],
  ['attribution', 'REQUIRED_PENDING_CONFIRMATION', 'ATTRIBUTION_REVIEW_REQUIRED'],
  ['attribution', 'UNKNOWN', 'ATTRIBUTION_REVIEW_REQUIRED'],
  ['provenance', 'PARTIAL', 'PROVENANCE_REVIEW_REQUIRED'],
  ['provenance', 'INCOMPLETE', 'PROVENANCE_REVIEW_REQUIRED'],
  ['provenance', 'UNKNOWN', 'PROVENANCE_REVIEW_REQUIRED'],
  ['certification', 'ABSENT', 'CERTIFICATION_REVIEW_REQUIRED'],
  ['certification', 'UNVERIFIED', 'CERTIFICATION_REVIEW_REQUIRED'],
];

for (const [dimension, posture, reason] of postures) {
  const changed = clone() as unknown as Record<string, Record<string, unknown>>;
  changed[dimension].posture = posture;
  const summary = summarizeSourceQuality(changed);
  assert.equal(summary.classification, 'REVIEW_REQUIRED');
  assert.ok(summary.summary?.humanReviewReasons.includes(reason as never));
}

const linkageUnknown = clone() as unknown as Record<string, unknown>;
linkageUnknown.linkagePosture = 'UNKNOWN';
const linkageSummary = summarizeSourceQuality(linkageUnknown);
assert.equal(linkageSummary.classification, 'REVIEW_REQUIRED');
assert.ok(linkageSummary.summary?.humanReviewReasons.includes('LINKAGE_REVIEW_REQUIRED'));

const insufficient = clone() as unknown as Record<string, unknown>;
insufficient.result = 'INSUFFICIENT_EVIDENCE';
assert.equal(summarizeSourceQuality(insufficient).classification, 'INSUFFICIENT_EVIDENCE');
const invalid = clone() as unknown as Record<string, unknown>;
invalid.result = 'INVALID_LINKAGE';
assert.equal(summarizeSourceQuality(invalid).classification, 'INVALID_SOURCE_EVIDENCE');

const conflict = clone() as unknown as Record<string, unknown>;
conflict.result = 'CONFLICT_REQUIRES_REVIEW';
conflict.conflicts = [{ relationshipType: 'RIGHTS', postures: ['VERIFIED', 'RESTRICTED'], evidenceReferenceIds: ['SRA-ASSESSOR-CONFLICT', 'SRA-BOULDER-COUNTY-ASSESSOR'] }];
const conflictSummary = summarizeSourceQuality(conflict);
assert.equal(conflictSummary.classification, 'CONFLICT_REQUIRES_REVIEW');
assert.ok(conflictSummary.summary?.humanReviewReasons.includes('CONFLICT_REVIEW_REQUIRED'));
assert.deepEqual(conflictSummary.summary?.conflictReferences, conflict.conflicts);

const limited = clone() as unknown as Record<string, Record<string, unknown>>;
limited.rights.limitationCodes = ['RIGHTS_PENDING'];
const limitedSummary = summarizeSourceQuality(limited);
assert.deepEqual(limitedSummary.summary?.limitationCodes, ['RIGHTS_PENDING']);
assert.ok(limitedSummary.summary?.evidenceReferenceIds.includes('SRA-BOULDER-COUNTY-ASSESSOR'));
assert.ok(limitedSummary.summary?.certificationReferenceIds.includes('CERT-SOURCE-REGISTRY'));

assert.equal(summarizeSourceQuality({ sourceId, rights: 'raw' }).classification, 'INVALID_SOURCE_EVIDENCE');
assert.equal(summarizeSourceQuality({ sourceId, recommendedDecision: 'APPROVE' }).classification, 'INVALID_SOURCE_EVIDENCE');
assert.equal(summarizeSourceQuality({ source: { sourceId }, providerName: 'Example' }).classification, 'INVALID_SOURCE_EVIDENCE');
assert.equal(summarizeSourceQuality('provider terms narrative').classification, 'INVALID_SOURCE_EVIDENCE');

const repeat = summarizeSourceQuality(canonical);
assert.equal(complete.summary?.summaryFingerprint, repeat.summary?.summaryFingerprint);
const changed = clone() as unknown as Record<string, Record<string, unknown>>;
changed.rights.posture = 'PENDING';
const changedSummary = summarizeSourceQuality(changed);
assert.notEqual(complete.summary?.summaryFingerprint, changedSummary.summary?.summaryFingerprint);

const runtimeSource = await readFile(new URL('../lib/sourceQualityControl.ts', import.meta.url), 'utf8');
for (const prohibitedReference of [
  '@prisma/client',
  'node:fs',
  'fetch(',
  'http://',
  'https://',
  "from './sourceRegistry'",
  'normalizeSourceEvidence(',
  'sendPropertyInquiryNotification',
  'nodemailer',
  'resend',
  'Typesense',
  'next/',
  'queue',
  'worker',
  'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS',
]) assert.ok(!runtimeSource.includes(prohibitedReference), 'Pure summary contract must not reference ' + prohibitedReference);

console.log('[source-quality-control] ok: canonical normalized evidence produces deterministic multi-dimensional review summaries without re-normalization, source activation, provider/county calls, database, CRM, Search, Typesense, UI, queue, worker, or communication behavior.');
