import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  MLS_LISTING_DATA_MANIFEST_ELIGIBILITY,
  MLS_LISTING_DATA_SOURCE_ID,
  MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION,
  MLS_LISTING_DATA_SOURCE_QUALITY_FIREWALL,
  MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES,
  createMlsListingDataSourceQualityAssemblyRequest,
  normalizeMlsListingDataSourceQualityEvidence,
  summarizeMlsListingDataSourceQualityEvidence,
} from '../lib/sourceQualityMlsListingDataEvidence';
import { normalizeSourceEvidence, type SourceEvidenceLinkageRecord } from '../lib/sourceQualityEvidenceNormalization';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const normalized = normalizeMlsListingDataSourceQualityEvidence();
assert.equal(MLS_LISTING_DATA_SOURCE_ID, 'SRC-MLS-LISTING-DATA');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES.length, 1);
assert.ok(MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES.every((linkage) => linkage.sourceId === MLS_LISTING_DATA_SOURCE_ID));
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES[0]?.authoritativeContractType, 'CERTIFICATION_REFERENCE');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES[0]?.relationshipType, 'CERTIFICATION');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES[0]?.posture, 'REFERENCED');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES[0]?.verificationStatus, 'VERIFIED');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES[0]?.linkageProvenance, 'CERTIFICATION_REFERENCE_ONLY');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES[0]?.certificationReference?.certificationId, MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, MLS_LISTING_DATA_SOURCE_ID);
assert.equal(normalized.source?.sourceClass, 'LICENSED_PROFESSIONAL_SOURCE');
assert.equal(normalized.activation.declaredPosture, 'ACTIVE_AUTHORIZED');
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeMlsListingDataSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);
assert.equal(MLS_LISTING_DATA_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_FIREWALL.registryActivation, 'SOURCE_REGISTRY_ACTIVATION_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_MANIFEST');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_MANIFEST');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_MANIFEST');

const foreign = normalizeSourceEvidence({
  sourceId: MLS_LISTING_DATA_SOURCE_ID,
  linkages: [{ ...MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES[0]!, sourceId: 'SRC-BOULDER-COUNTY-ASSESSOR' }],
});
assert.equal(foreign.result, 'INVALID_LINKAGE');
assert.ok(foreign.reasons.includes('FOREIGN_LINKAGE_SOURCE_ID'));
const malformed = normalizeSourceEvidence({ sourceId: 'MLS', linkages: [] });
assert.equal(malformed.result, 'INVALID_LINKAGE');
const withoutCertification = normalizeSourceEvidence({
  sourceId: MLS_LISTING_DATA_SOURCE_ID,
  linkages: [{ ...MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES[0]!, certificationReference: null }],
});
assert.equal(withoutCertification.result, 'INVALID_LINKAGE');
const wrongRelationship = normalizeSourceEvidence({
  sourceId: MLS_LISTING_DATA_SOURCE_ID,
  linkages: [{ ...MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES[0]!, relationshipType: 'RIGHTS', posture: 'UNKNOWN' } as SourceEvidenceLinkageRecord],
});
assert.equal(wrongRelationship.result, 'INVALID_LINKAGE');
const wrongEvidenceClass = normalizeSourceEvidence({
  sourceId: MLS_LISTING_DATA_SOURCE_ID,
  linkages: [{ ...MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES[0]!, evidenceClass: 'SOURCE_RIGHTS_READINESS', authoritativeContractType: 'SOURCE_RIGHTS_READINESS_CONTRACT' } as SourceEvidenceLinkageRecord],
});
assert.equal(wrongEvidenceClass.result, 'INVALID_LINKAGE');

const domainSpecificFreshness: SourceEvidenceLinkageRecord = {
  schemaVersion: 'REIE_SOURCE_QUALITY_EVIDENCE_NORMALIZATION_V1',
  sourceId: MLS_LISTING_DATA_SOURCE_ID,
  evidenceClass: 'MLS_FRESHNESS',
  authoritativeContractType: 'MLS_FRESHNESS_CONTRACT',
  evidenceReferenceId: 'SQE-MLS-FRESHNESS-DOMAIN-001',
  repositoryReference: 'lib/mls/sourceFreshness.ts',
  relationshipType: 'FRESHNESS',
  posture: 'DOMAIN_SPECIFIC',
  verificationStatus: 'VERIFIED',
  certificationReference: MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION,
  lastReviewedDate: MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION.linkageReviewedDate,
  limitationCodes: ['FRESHNESS_DOMAIN_SPECIFIC'],
  linkageProvenance: 'EXPLICIT_REVIEWED_LINKAGE',
};
const withDomainSpecificFreshness = normalizeSourceEvidence({
  sourceId: MLS_LISTING_DATA_SOURCE_ID,
  linkages: [...MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES, domainSpecificFreshness],
});
assert.equal(withDomainSpecificFreshness.freshness.posture, 'DOMAIN_SPECIFIC');
assert.notEqual(withDomainSpecificFreshness.freshness.posture, 'VERIFIED_CURRENT');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES.some((linkage) => linkage.relationshipType === 'FRESHNESS'), false);

const summary = summarizeMlsListingDataSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.ok(summary.summary);
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createMlsListingDataSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.ok(assembly.assembly);
assert.equal(assembly.assembly?.sourceOrder[0], MLS_LISTING_DATA_SOURCE_ID);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');

const runtime = await readFile(new URL('../lib/sourceQualityMlsListingDataEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['SRA-MLS-DERIVED-CITY-INTELLIGENCE', 'alias', 'fuzzy', 'provider correspondence', 'MLS Grid', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS']) assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
console.log('[source-quality-mls-listing-data-evidence] ok: exact MLS certification-only evidence normalizes and assembles deterministically with known gaps, no authority grant, and no provider/live-system behavior.');
