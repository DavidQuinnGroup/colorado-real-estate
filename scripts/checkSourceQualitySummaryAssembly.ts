import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
  assembleSourceQualitySummaries,
  type SourceQualitySummaryAssemblyRequest,
} from '../lib/sourceQualitySummaryAssembly';
import {
  SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION,
  normalizeSourceEvidence,
  type SourceEvidenceLinkageRecord,
} from '../lib/sourceQualityEvidenceNormalization';
import { summarizeSourceQuality } from '../lib/sourceQualityControl';
import { composeSourceQualityReport } from '../lib/sourceQualityReport';

const reviewedDate = '2026-08-15';
const sourceId = 'SRC-BOULDER-COUNTY-ASSESSOR';
const alternateSourceId = 'SRC-BOULDER-COUNTY-TREASURER';
const certification = {
  certificationId: 'CERT-SOURCE-REGISTRY',
  repositoryReference: 'docs/project-atlas/executive-library/REIE-SOURCE-REGISTRY-GRAND-PLAN-ADVANCEMENT-PRODUCTION-CERTIFICATION.md',
  referenceVersion: 'V01',
  linkageReviewedDate: reviewedDate,
} as const;

function linkagesFor(id: string, referenceSuffix: string): readonly SourceEvidenceLinkageRecord[] {
  return [
    { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId: id, evidenceClass: 'SOURCE_RIGHTS_READINESS', authoritativeContractType: 'SOURCE_RIGHTS_READINESS_CONTRACT', evidenceReferenceId: 'SRA-' + referenceSuffix, repositoryReference: 'lib/sourceRightsActivationReadiness.ts', relationshipType: 'RIGHTS', posture: 'VERIFIED', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
    { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId: id, evidenceClass: 'PROVIDER_INVENTORY', authoritativeContractType: 'PROVIDER_INVENTORY_CONTRACT', evidenceReferenceId: 'GIS-PROVIDER-' + referenceSuffix, repositoryReference: 'lib/geographic-intelligence/providerInventoryContract.ts', relationshipType: 'TECHNICAL_ACCESS', posture: 'READY', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
    { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId: id, evidenceClass: 'DOMAIN_FRESHNESS', authoritativeContractType: 'DOMAIN_FRESHNESS_CONTRACT', evidenceReferenceId: 'DOMAIN-FRESHNESS-' + referenceSuffix, repositoryReference: 'DOMAIN_STRUCTURED_CONTRACT', relationshipType: 'FRESHNESS', posture: 'VERIFIED_CURRENT', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
    { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId: id, evidenceClass: 'SOURCE_RIGHTS_READINESS', authoritativeContractType: 'SOURCE_RIGHTS_READINESS_CONTRACT', evidenceReferenceId: 'SRA-ATTRIBUTION-' + referenceSuffix, repositoryReference: 'lib/sourceRightsActivationReadiness.ts', relationshipType: 'ATTRIBUTION', posture: 'NONE_DOCUMENTED', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
    { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId: id, evidenceClass: 'EVIDENCE_DEPTH', authoritativeContractType: 'EVIDENCE_DEPTH_CONTRACT', evidenceReferenceId: 'EDF-PROVENANCE-' + referenceSuffix, repositoryReference: 'lib/evidence-depth/evidencePosture.ts', relationshipType: 'PROVENANCE', posture: 'COMPLETE', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE' },
    { schemaVersion: SOURCE_QUALITY_EVIDENCE_NORMALIZATION_SCHEMA_VERSION, sourceId: id, evidenceClass: 'CERTIFICATION', authoritativeContractType: 'CERTIFICATION_REFERENCE', evidenceReferenceId: 'CERT-' + referenceSuffix, repositoryReference: 'docs/project-atlas/executive-library', relationshipType: 'CERTIFICATION', posture: 'REFERENCED', verificationStatus: 'VERIFIED', certificationReference: certification, lastReviewedDate: reviewedDate, limitationCodes: [], linkageProvenance: 'CERTIFICATION_REFERENCE_ONLY' },
  ];
}

const completeLinkages = linkagesFor(sourceId, 'BOULDER-ASSESSOR');

function request(entries: SourceQualitySummaryAssemblyRequest['entries'], coverageClass: SourceQualitySummaryAssemblyRequest['coverageClass'] = 'NO_COMPLETENESS_CLAIM'): SourceQualitySummaryAssemblyRequest {
  return {
    schemaVersion: SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
    assemblyId: 'SQS-ASM-MVV',
    coverageClass,
    entries,
    certificationReference: certification,
  };
}

function entry(id = sourceId, linkages: readonly SourceEvidenceLinkageRecord[] = completeLinkages): SourceQualitySummaryAssemblyRequest['entries'][number] {
  return { sourceId: id, inclusionPosture: 'EXPLICITLY_SUPPLIED_REVIEWED_SOURCE', linkages, certificationReference: certification };
}

function replaceLinkage(relationshipType: SourceEvidenceLinkageRecord['relationshipType'], patch: Partial<SourceEvidenceLinkageRecord>): readonly SourceEvidenceLinkageRecord[] {
  return completeLinkages.map((linkage) => linkage.relationshipType === relationshipType ? { ...linkage, ...patch } as SourceEvidenceLinkageRecord : linkage);
}

function assembled(input: unknown) {
  const result = assembleSourceQualitySummaries(input);
  assert.notEqual(result.classification, 'FAIL_CLOSED');
  if (result.classification === 'FAIL_CLOSED') throw new Error('Expected assembly result');
  return result.assembly;
}

const one = assembled(request([entry()]));
assert.equal(one.classification, 'ASSEMBLED');
assert.equal(one.sourceCount, 1);
assert.equal(one.assembledSourceCount, 1);
assert.deepEqual(one.sourceOrder, [sourceId]);
assert.equal(one.summaries[0]?.source.sourceId, sourceId);
assert.equal(one.summaries[0]?.activationFirewall.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_THIS_SUMMARY');
assert.equal(one.activationFirewall.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_THIS_ASSEMBLY');
assert.equal(one.activationFirewall.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_THIS_ASSEMBLY');
assert.equal(one.completenessClaim, 'NO_STATEWIDE_OR_PROVIDER_COMPLETENESS_CLAIM');

const expectedSummary = summarizeSourceQuality(normalizeSourceEvidence({ sourceId, linkages: completeLinkages }));
assert.ok(expectedSummary.summary);
assert.deepEqual(one.summaries[0], expectedSummary.summary);

const alternateEntry = entry(alternateSourceId, linkagesFor(alternateSourceId, 'BOULDER-TREASURER'));
const multiple = assembled(request([alternateEntry, entry()], 'SUPPLIED_MANIFEST_ONLY'));
assert.deepEqual(multiple.sourceOrder, [sourceId, alternateSourceId].sort());
assert.equal(multiple.coverageClass, 'SUPPLIED_MANIFEST_ONLY');
const reversed = assembled(request([entry(), alternateEntry], 'SUPPLIED_MANIFEST_ONLY'));
assert.equal(multiple.assemblyFingerprint, reversed.assemblyFingerprint);

const changed = assembled(request([entry(sourceId, replaceLinkage('RIGHTS', { posture: 'RESTRICTED', limitationCodes: ['RIGHTS_RESTRICTED'] }))]));
assert.notEqual(changed.assemblyFingerprint, one.assemblyFingerprint);
assert.equal(changed.summaries[0]?.normalizedPostures.rights, 'RESTRICTED');
assert.ok(changed.summaries[0]?.limitationCodes.includes('RIGHTS_RESTRICTED'));

const unknownRights = assembled(request([entry(sourceId, replaceLinkage('RIGHTS', { posture: 'UNKNOWN', verificationStatus: 'UNVERIFIED' }))]));
assert.equal(unknownRights.summaries[0]?.normalizedPostures.rights, 'UNKNOWN');
const pendingRights = assembled(request([entry(sourceId, replaceLinkage('RIGHTS', { posture: 'PENDING', limitationCodes: ['RIGHTS_PENDING'] }))]));
assert.equal(pendingRights.summaries[0]?.normalizedPostures.rights, 'PENDING');
const restrictedRights = assembled(request([entry(sourceId, replaceLinkage('RIGHTS', { posture: 'RESTRICTED', limitationCodes: ['RIGHTS_RESTRICTED'] }))]));
assert.equal(restrictedRights.summaries[0]?.normalizedPostures.rights, 'RESTRICTED');
const unknownTechnical = assembled(request([entry(sourceId, replaceLinkage('TECHNICAL_ACCESS', { posture: 'UNKNOWN', verificationStatus: 'UNVERIFIED' }))]));
assert.equal(unknownTechnical.summaries[0]?.normalizedPostures.technicalAccess, 'UNKNOWN');
const staleFreshness = assembled(request([entry(sourceId, replaceLinkage('FRESHNESS', { posture: 'STALE_VERIFICATION', limitationCodes: ['FRESHNESS_STALE_VERIFICATION'] }))]));
assert.equal(staleFreshness.summaries[0]?.normalizedPostures.freshness, 'STALE_VERIFICATION');
const unknownAttribution = assembled(request([entry(sourceId, replaceLinkage('ATTRIBUTION', { posture: 'UNKNOWN', verificationStatus: 'UNVERIFIED' }))]));
assert.equal(unknownAttribution.summaries[0]?.normalizedPostures.attribution, 'UNKNOWN');
const incompleteProvenance = assembled(request([entry(sourceId, replaceLinkage('PROVENANCE', { posture: 'INCOMPLETE', limitationCodes: ['PROVENANCE_INCOMPLETE'] }))]));
assert.equal(incompleteProvenance.summaries[0]?.normalizedPostures.provenance, 'INCOMPLETE');
const missingCertification = assembled(request([entry(sourceId, completeLinkages.filter((linkage) => linkage.relationshipType !== 'CERTIFICATION'))]));
assert.equal(missingCertification.summaries[0]?.normalizedPostures.certification, 'ABSENT');

const conflict = assembled(request([entry(sourceId, [...completeLinkages, { ...completeLinkages[0], evidenceReferenceId: 'SRA-CONFLICT-BOULDER-ASSESSOR', posture: 'RESTRICTED', limitationCodes: ['RIGHTS_RESTRICTED'] } as SourceEvidenceLinkageRecord])]));
assert.equal(conflict.summaries[0]?.classification, 'CONFLICT_REQUIRES_REVIEW');
assert.equal(conflict.summaries[0]?.conflictReferences[0]?.relationshipType, 'RIGHTS');

const sparse = assembled(request([entry()], 'PARTIAL_REVIEWED_SOURCE_SET'));
assert.equal(sparse.coverageClass, 'PARTIAL_REVIEWED_SOURCE_SET');
assert.equal(sparse.completenessClaim, 'NO_STATEWIDE_OR_PROVIDER_COMPLETENESS_CLAIM');

assert.equal(assembleSourceQualitySummaries(request([entry(), entry()])).classification, 'FAIL_CLOSED');
assert.ok(assembleSourceQualitySummaries(request([entry(), entry()])).reasons.includes('DUPLICATE_SOURCE_ID'));
const unknownSource = assembleSourceQualitySummaries(request([entry('SRC-UNKNOWN-SOURCE', completeLinkages.map((linkage) => ({ ...linkage, sourceId: 'SRC-UNKNOWN-SOURCE' as const })))]));
assert.equal(unknownSource.classification, 'PARTIALLY_ASSEMBLED');
if (unknownSource.assembly) {
  assert.equal(unknownSource.assembly.assembledSourceCount, 0);
  assert.ok(unknownSource.reasons.includes('CANONICAL_NORMALIZATION_FAILED'));
  assert.ok(unknownSource.reasons.includes('CANONICAL_SUMMARY_FAILED'));
}
assert.equal(assembleSourceQualitySummaries(request([{ ...entry(), linkages: { narrative: 'raw text' } as unknown as readonly SourceEvidenceLinkageRecord[] }])).classification, 'FAIL_CLOSED');

for (const unsupported of [
  { narrative: 'county correspondence text' },
  { providerName: 'Boulder County Assessor' },
  { countyName: 'Boulder County' },
  { fileName: 'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS.md' },
  { sourceUrl: 'https://provider.example/source' },
  { semanticSimilarity: 'looks close' },
  { rightsConclusion: 'approved' },
]) {
  const result = assembleSourceQualitySummaries(request([{ ...entry(), ...unsupported }]));
  assert.equal(result.classification, 'FAIL_CLOSED');
  assert.ok(result.reasons.includes('UNSUPPORTED_DISCOVERY_FIELD'));
}

const report = composeSourceQualityReport(one.summaries);
assert.notEqual(report.classification, 'FAIL_CLOSED');
if (report.classification !== 'FAIL_CLOSED') {
  assert.deepEqual(report.report.sourceOrder, [sourceId]);
  assert.equal(report.report.suppliedDatasetScope, 'SUPPLIED_SUMMARIES_ONLY');
  assert.equal(report.report.activationFirewall.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_THIS_REPORT');
}

assert.equal(one.assemblyFingerprint, assembled(request([entry()])).assemblyFingerprint);
assert.equal('qualityScore' in one, false);
assert.equal('ranking' in one, false);

const runtimeSource = await readFile(new URL('../lib/sourceQualitySummaryAssembly.ts', import.meta.url), 'utf8');
for (const requiredReference of ['normalizeSourceEvidence(', 'summarizeSourceQuality(']) {
  assert.ok(runtimeSource.includes(requiredReference), 'Assembly runtime must call canonical ' + requiredReference);
}
for (const prohibitedReference of [
  '@prisma/client',
  'node:fs',
  'fetch(',
  'http://',
  'https://',
  "from './sourceRegistry'",
  'composeSourceQualityReport(',
  'mlsGridClient',
  'LightBox',
  'ATTOM',
  'sendPropertyInquiryNotification',
  'nodemailer',
  'resend',
  'Typesense',
  'next/',
  'queue',
  'worker',
  'CRMTask',
  'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS',
]) assert.ok(!runtimeSource.includes(prohibitedReference), 'Assembly runtime must not reference ' + prohibitedReference);

console.log('[source-quality-summary-assembly] ok: explicit reviewed source entries assemble deterministically through canonical normalization and summary contracts without discovery, activation, provider/county calls, database, Search, Typesense, CRM, UI, queue, worker, communication, filesystem discovery, or persistence behavior.');
