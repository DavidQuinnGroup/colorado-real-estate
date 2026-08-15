import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, normalizeSourceEvidence, type SourceEvidenceLinkageRecord } from '../lib/sourceQualityEvidenceNormalization';
import { summarizeSourceQuality, type SourceQualityReviewSummary } from '../lib/sourceQualityControl';
import { composeSourceQualityReport, renderSourceQualityReportMarkdown } from '../lib/sourceQualityReport';

const reviewedDate = '2026-08-15';
const sourceId = 'SRC-BOULDER-COUNTY-ASSESSOR';
const certification = { certificationId: 'CERT-SOURCE-REGISTRY', repositoryReference: 'docs/project-atlas/executive-library/REIE-SOURCE-REGISTRY-GRAND-PLAN-ADVANCEMENT-PRODUCTION-CERTIFICATION.md', referenceVersion: 'V01', linkageReviewedDate: reviewedDate } as const;

const linkages: readonly SourceEvidenceLinkageRecord[] = [
  { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId, evidenceClass: 'SOURCE_RIGHTS_READINESS', authoritativeContractType: 'SOURCE_RIGHTS_READINESS_CONTRACT', evidenceReferenceId: 'SRA-BOULDER-COUNTY-ASSESSOR', repositoryReference: 'lib/sourceRightsActivationReadiness.ts', relationshipType: 'RIGHTS', posture: 'VERIFIED', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
  { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId, evidenceClass: 'PROVIDER_INVENTORY', authoritativeContractType: 'PROVIDER_INVENTORY_CONTRACT', evidenceReferenceId: 'GIS-PROVIDER-ASSESSOR-REVIEW', repositoryReference: 'lib/geographic-intelligence/providerInventoryContract.ts', relationshipType: 'TECHNICAL_ACCESS', posture: 'READY', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
  { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId, evidenceClass: 'DOMAIN_FRESHNESS', authoritativeContractType: 'DOMAIN_FRESHNESS_CONTRACT', evidenceReferenceId: 'DOMAIN-FRESHNESS-ASSESSOR-20260815', repositoryReference: 'DOMAIN_STRUCTURED_CONTRACT', relationshipType: 'FRESHNESS', posture: 'VERIFIED_CURRENT', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
  { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId, evidenceClass: 'SOURCE_RIGHTS_READINESS', authoritativeContractType: 'SOURCE_RIGHTS_READINESS_CONTRACT', evidenceReferenceId: 'SRA-ASSESSOR-ATTRIBUTION', repositoryReference: 'lib/sourceRightsActivationReadiness.ts', relationshipType: 'ATTRIBUTION', posture: 'NONE_DOCUMENTED', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
  { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId, evidenceClass: 'EVIDENCE_DEPTH', authoritativeContractType: 'EVIDENCE_DEPTH_CONTRACT', evidenceReferenceId: 'EDF-ASSESSOR-PROVENANCE-001', repositoryReference: 'lib/evidence-depth/evidencePosture.ts', relationshipType: 'PROVENANCE', posture: 'COMPLETE', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
  { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId, evidenceClass: 'CERTIFICATION', authoritativeContractType: 'CERTIFICATION_REFERENCE', evidenceReferenceId: 'CERT-SOURCE-REGISTRY', repositoryReference: 'docs/project-atlas/executive-library', relationshipType: 'CERTIFICATION', posture: 'REFERENCED', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'CERTIFICATION_REFERENCE_ONLY' },
];

const normalized = normalizeSourceEvidence({ sourceId, linkages });
const completeResult = summarizeSourceQuality(normalized);
assert.ok(completeResult.summary);
const complete = completeResult.summary;

function summary(sourceSuffix: string, classification: SourceQualityReviewSummary['classification'], overrides: Record<string, unknown> = {}): SourceQualityReviewSummary {
  const value = JSON.parse(JSON.stringify(complete)) as SourceQualityReviewSummary;
  const source = { ...value.source, sourceId: 'SRC-REPORT-' + sourceSuffix };
  const normalizedPostures = { ...value.normalizedPostures };
  const base = { ...value, source, classification, normalizedPostures, summaryFingerprint: 'summary-report-' + sourceSuffix, ...overrides };
  return base as SourceQualityReviewSummary;
}

const review = summary('A', 'REVIEW_REQUIRED', { normalizedPostures: { ...complete.normalizedPostures, rights: 'PENDING' }, humanReviewReasons: ['RIGHTS_REVIEW_REQUIRED'], limitationCodes: ['RIGHTS_PENDING'] });
const insufficient = summary('B', 'INSUFFICIENT_EVIDENCE', { normalizedPostures: { ...complete.normalizedPostures, freshness: 'UNKNOWN', normalizationResult: 'INSUFFICIENT_EVIDENCE' }, humanReviewReasons: ['FRESHNESS_REVIEW_REQUIRED'], limitationCodes: ['FRESHNESS_UNKNOWN'] });
const conflict = summary('C', 'CONFLICT_REQUIRES_REVIEW', { normalizedPostures: { ...complete.normalizedPostures, normalizationResult: 'CONFLICT_REQUIRES_REVIEW' }, humanReviewReasons: ['CONFLICT_REVIEW_REQUIRED'], conflictReferences: [{ relationshipType: 'RIGHTS', postures: ['VERIFIED', 'RESTRICTED'], evidenceReferenceIds: ['REF-CONFLICT-001'] }] });
const invalid = summary('D', 'INVALID_SOURCE_EVIDENCE', { normalizedPostures: { ...complete.normalizedPostures, normalizationResult: 'INVALID_LINKAGE' }, humanReviewReasons: ['LINKAGE_REVIEW_REQUIRED'] });

const mixed = composeSourceQualityReport([invalid, conflict, insufficient, review, complete]);
assert.notEqual(mixed.classification, 'FAIL_CLOSED');
if (mixed.classification === 'FAIL_CLOSED') throw new Error('Expected report.');
assert.equal(mixed.classification, 'REPORT_HAS_INVALID_SOURCE_EVIDENCE');
assert.deepEqual(mixed.report.sourceOrder, ['SRC-BOULDER-COUNTY-ASSESSOR', 'SRC-REPORT-A', 'SRC-REPORT-B', 'SRC-REPORT-C', 'SRC-REPORT-D']);
assert.equal(mixed.report.classificationCounts.REVIEW_POSTURE_COMPLETE, 1);
assert.equal(mixed.report.classificationCounts.REVIEW_REQUIRED, 1);
assert.equal(mixed.report.classificationCounts.INSUFFICIENT_EVIDENCE, 1);
assert.equal(mixed.report.classificationCounts.CONFLICT_REQUIRES_REVIEW, 1);
assert.equal(mixed.report.classificationCounts.INVALID_SOURCE_EVIDENCE, 1);
assert.equal(mixed.report.dimensionPostureCounts.rights.PENDING, 1);
assert.equal(mixed.report.dimensionPostureCounts.freshness.UNKNOWN, 1);
assert.equal(mixed.report.reviewRequiredSources[0]?.sourceId, 'SRC-REPORT-A');
assert.equal(mixed.report.conflictSources[0]?.sourceId, 'SRC-REPORT-C');
assert.deepEqual(mixed.report.insufficientEvidenceSources, ['SRC-REPORT-B']);
assert.deepEqual(mixed.report.invalidSourceEvidenceSources, ['SRC-REPORT-D']);
assert.equal(mixed.report.limitationCodeCounts.RIGHTS_PENDING, 1);
assert.equal(mixed.report.humanReviewReasonCounts.RIGHTS_REVIEW_REQUIRED, 1);
assert.ok(mixed.report.evidenceReferenceIndex['SRA-BOULDER-COUNTY-ASSESSOR']);
assert.ok(mixed.report.certificationReferenceIndex['CERT-SOURCE-REGISTRY']);
assert.equal(mixed.report.activationFirewall.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_THIS_REPORT');
assert.equal(mixed.report.activationFirewall.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_THIS_REPORT');
assert.equal(mixed.report.suppliedDatasetScope, 'SUPPLIED_SUMMARIES_ONLY');
assert.equal('qualityScore' in mixed.report, false);
assert.equal('ranking' in mixed.report, false);

const reordered = composeSourceQualityReport([complete, review, invalid, insufficient, conflict]);
assert.notEqual(reordered.classification, 'FAIL_CLOSED');
if (reordered.classification !== 'FAIL_CLOSED') assert.equal(reordered.report.reportFingerprint, mixed.report.reportFingerprint);
const changed = composeSourceQualityReport([invalid, conflict, insufficient, summary('A', 'REVIEW_REQUIRED', { normalizedPostures: { ...complete.normalizedPostures, rights: 'RESTRICTED' }, humanReviewReasons: ['RIGHTS_REVIEW_REQUIRED'], limitationCodes: ['RIGHTS_RESTRICTED'] }), complete]);
assert.notEqual(changed.classification, 'FAIL_CLOSED');
if (changed.classification !== 'FAIL_CLOSED') assert.notEqual(changed.report.reportFingerprint, mixed.report.reportFingerprint);
assert.equal(composeSourceQualityReport([complete, complete]).classification, 'FAIL_CLOSED');
assert.equal(composeSourceQualityReport([{ sourceId: 'SRC-RAW' }]).classification, 'FAIL_CLOSED');
assert.equal(composeSourceQualityReport([{ ...complete, score: 100 }]).classification, 'FAIL_CLOSED');
assert.equal(composeSourceQualityReport([{ ...complete, providerNarrative: 'terms text' }]).classification, 'FAIL_CLOSED');
assert.equal(composeSourceQualityReport('raw provider narrative').classification, 'FAIL_CLOSED');
const markdown = renderSourceQualityReportMarkdown(mixed.report);
assert.equal(markdown, renderSourceQualityReportMarkdown(mixed.report));
assert.ok(markdown.includes('PROJECT ATLAS™ — SOURCE QUALITY REVIEW REPORT'));
assert.ok(!markdown.includes('PRODUCTION_READY'));
assert.ok(!markdown.includes('APPROVED'));

const runtimeSource = await readFile(new URL('../lib/sourceQualityReport.ts', import.meta.url), 'utf8');
for (const prohibitedReference of [
  '@prisma/client', 'node:fs', 'fetch(', 'http://', 'https://', "from './sourceRegistry'", 'normalizeSourceEvidence(', 'summarizeSourceQuality(', 'sendPropertyInquiryNotification', 'nodemailer', 'resend', 'Typesense', 'next/', 'queue', 'worker', 'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS',
]) assert.ok(!runtimeSource.includes(prohibitedReference), 'Report runtime must not reference ' + prohibitedReference);

console.log('[source-quality-report] ok: supplied canonical review summaries compose deterministically into sparse internal report data and Markdown without re-normalization, source activation, provider/county calls, database, CRM, Search, Typesense, UI, workflow, or persistence behavior.');
