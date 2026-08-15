import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  createSourceQualityOperationalManifestFingerprint,
  sourceQualityOperationalManifestToAssemblyRequest,
  validateSourceQualityOperationalManifest,
} from '../lib/sourceQualityOperationalManifest';
import { SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA } from '../lib/sourceQualityOperationalManifestData';
import {
  MLS_LISTING_DATA_MANIFEST_ELIGIBILITY,
  MLS_LISTING_DATA_SOURCE_ID,
  MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION,
  MLS_LISTING_DATA_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  MLS_LISTING_DATA_SOURCE_QUALITY_FIREWALL,
  MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES,
  normalizeMlsListingDataSourceQualityEvidence,
} from '../lib/sourceQualityMlsListingDataEvidence';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';
import { composeSourceQualityReport } from '../lib/sourceQualityReport';

const valid = validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA);
assert.equal(valid.classification, 'PARTIAL_OPERATIONAL_MANIFEST_VALID');
assert.ok(valid.manifest);
if (!valid.manifest) throw new Error('Expected operational manifest.');
assert.equal(valid.manifest.suppliedDatasetScope, 'SUPPLIED_MANIFEST_ONLY');
assert.equal(valid.manifest.operationalPosture, 'OPERATIONAL_INPUT_POSTURE_ONLY');
assert.equal(valid.manifest.completenessClaim, 'NO_COMPLETENESS_CLAIM');
assert.equal(valid.manifest.entries.length, 3);
assert.ok(valid.manifest.entries.every((entry) => entry.inclusionClass === 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS'));
assert.equal(valid.manifest.authorityFirewall.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_MANIFEST');
assert.equal(valid.manifest.authorityFirewall.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_MANIFEST');
assert.equal(valid.manifest.authorityFirewall.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_MANIFEST');
assert.equal(valid.manifest.authorityFirewall.qualityScore, 'NO_QUALITY_SCORE');
assert.equal(valid.manifest.authorityFirewall.providerRanking, 'NO_PROVIDER_RANKING');

const rawMlsEntry = SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[2];
assert.ok(rawMlsEntry);
assert.equal(rawMlsEntry?.sourceId, MLS_LISTING_DATA_SOURCE_ID);
assert.equal(rawMlsEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.strictEqual(rawMlsEntry?.linkages, MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES);
assert.deepEqual(rawMlsEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(rawMlsEntry?.certificationReference, MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION);
assert.equal(rawMlsEntry?.reviewedAt, MLS_LISTING_DATA_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(rawMlsEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(rawMlsEntry?.limitationCodes, []);
assert.equal(MLS_LISTING_DATA_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_FIREWALL.registryActivation, 'SOURCE_REGISTRY_ACTIVATION_NOT_SOURCE_QUALITY_CERTIFICATION');

const withoutMls = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== MLS_LISTING_DATA_SOURCE_ID),
});
assert.ok(withoutMls.manifest);
assert.equal(withoutMls.manifest?.entries.length, 2);
assert.notEqual(valid.manifest.manifestFingerprint, withoutMls.manifest?.manifestFingerprint);
for (const entry of withoutMls.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const mlsEntry = valid.manifest.entries.find((entry) => entry.sourceId === MLS_LISTING_DATA_SOURCE_ID);
assert.ok(mlsEntry);
assert.equal(mlsEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.equal(mlsEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === MLS_LISTING_DATA_SOURCE_ID)?.entryFingerprint);
const mlsNormalized = normalizeMlsListingDataSourceQualityEvidence();
assert.equal(mlsNormalized.rights.posture, 'UNKNOWN');
assert.equal(mlsNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(mlsNormalized.freshness.posture, 'UNKNOWN');
assert.equal(mlsNormalized.attribution.posture, 'UNKNOWN');
assert.equal(mlsNormalized.provenance.posture, 'UNKNOWN');

const assemblyRequest = sourceQualityOperationalManifestToAssemblyRequest(valid.manifest);
const assembly = assembleSourceQualitySummaries(assemblyRequest);
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
if (assembly.classification === 'FAIL_CLOSED') throw new Error('Assembly must accept converted operational manifest.');
assert.equal(assembly.assembly.sourceCount, 3);
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === MLS_LISTING_DATA_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
const report = composeSourceQualityReport(assembly.assembly.summaries);
assert.notEqual(report.classification, 'FAIL_CLOSED');
if (report.classification === 'FAIL_CLOSED') throw new Error('Report must accept three-source operational manifest output.');
assert.equal(report.report.sourceCount, 3);
assert.ok(report.report.insufficientEvidenceSources.includes(MLS_LISTING_DATA_SOURCE_ID));

assert.equal(createSourceQualityOperationalManifestFingerprint(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA), createSourceQualityOperationalManifestFingerprint(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA));
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, entries: [...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries].reverse() }).manifest?.manifestFingerprint, valid.manifest.manifestFingerprint);
assert.notEqual(createSourceQualityOperationalManifestFingerprint(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA), createSourceQualityOperationalManifestFingerprint({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, manifestId: 'SQOM-INITIAL-002' }));
assert.notEqual(createSourceQualityOperationalManifestFingerprint(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA), createSourceQualityOperationalManifestFingerprint({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, certificationReference: { ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.certificationReference, certificationId: 'CERT-SQOM-CHANGED-001' } }));
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, entries: [SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[0], SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[0]] }).classification, 'DUPLICATE_SOURCE_ID');
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, coverageClass: 'STATEWIDE_COMPLETE' }).classification, 'UNSUPPORTED_COVERAGE_CLASS');
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, entries: [{ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[0], inclusionClass: 'APPROVED_SOURCE' }] }).classification, 'UNSUPPORTED_INCLUSION_CLASS');
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, certificationReference: null }).classification, 'CERTIFICATION_REFERENCE_REQUIRED');
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, reviewAuthorityClass: 'ACTIVATION_AUTHORIZED' }).classification, 'MANIFEST_ENTRY_INVALID');
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, entries: [{ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[0], linkages: [] }] }).classification, 'STRUCTURED_EVIDENCE_REQUIRED');
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, entries: [{ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[0], linkages: [{}] }] }).classification, 'MANIFEST_ENTRY_INVALID');
for (const field of ['notes', 'narrative', 'url', 'email', 'credential', 'protectedCountyArtifact']) assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, [field]: 'not-representable' }).classification, 'FAIL_CLOSED');

const runtime = await readFile(new URL('../lib/sourceQualityOperationalManifest.ts', import.meta.url), 'utf8');
const data = await readFile(new URL('../lib/sourceQualityOperationalManifestData.ts', import.meta.url), 'utf8');
const adminPage = await readFile(new URL('../app/admin/source-quality/page.tsx', import.meta.url), 'utf8');
assert.ok(data.includes('MLS_LISTING_DATA_SOURCE_ID'));
assert.equal(data.includes("'SRC-MLS-LISTING-DATA'"), false);
assert.ok(adminPage.includes('report.sourceCount'));
assert.equal(adminPage.includes(MLS_LISTING_DATA_SOURCE_ID), false);
for (const prohibited of ['sourceRegistry', 'readdir', 'readFile', 'glob(', 'process.env', '@prisma/client', 'PrismaClient', 'prisma.', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS']) assert.equal((runtime + data).includes(prohibited), false, 'Manifest runtime/data must not reference ' + prohibited);
for (const prohibited of ['ATTOM', 'LightBox', 'county correspondence', 'provider correspondence', 'qualityScore', 'providerRanking', 'activationAuthority', 'legalUseApproval', 'customerDisplayAuthority']) assert.equal(data.includes(prohibited), false, 'Operational data must not include ' + prohibited);
console.log('[source-quality-operational-manifest] ok: exact three-source partial typed set reuses canonical MLS evidence, preserves known gaps and firewalls, and converts deterministically through Assembly and Report without discovery, live-system, or authority behavior.');
