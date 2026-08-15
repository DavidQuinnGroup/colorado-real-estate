import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  createSourceQualityOperationalManifestFingerprint,
  sourceQualityOperationalManifestToAssemblyRequest,
  validateSourceQualityOperationalManifest,
} from '../lib/sourceQualityOperationalManifest';
import { SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA } from '../lib/sourceQualityOperationalManifestData';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';
import { composeSourceQualityReport } from '../lib/sourceQualityReport';

const valid = validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA);
assert.equal(valid.classification, 'PARTIAL_OPERATIONAL_MANIFEST_VALID');
assert.ok(valid.manifest);
if (!valid.manifest) throw new Error('Expected operational manifest.');
assert.equal(valid.manifest.suppliedDatasetScope, 'SUPPLIED_MANIFEST_ONLY');
assert.equal(valid.manifest.operationalPosture, 'OPERATIONAL_INPUT_POSTURE_ONLY');
assert.equal(valid.manifest.completenessClaim, 'NO_COMPLETENESS_CLAIM');
assert.equal(valid.manifest.entries.length, 2);
assert.ok(valid.manifest.entries.every((entry) => entry.inclusionClass === 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS'));
assert.equal(valid.manifest.authorityFirewall.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_MANIFEST');
assert.equal(valid.manifest.authorityFirewall.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_MANIFEST');
assert.equal(valid.manifest.authorityFirewall.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_MANIFEST');
assert.equal(valid.manifest.authorityFirewall.qualityScore, 'NO_QUALITY_SCORE');
assert.equal(valid.manifest.authorityFirewall.providerRanking, 'NO_PROVIDER_RANKING');

const assemblyRequest = sourceQualityOperationalManifestToAssemblyRequest(valid.manifest);
const assembly = assembleSourceQualitySummaries(assemblyRequest);
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
if (assembly.classification === 'FAIL_CLOSED') throw new Error('Assembly must accept converted operational manifest.');
const report = composeSourceQualityReport(assembly.assembly.summaries);
assert.notEqual(report.classification, 'FAIL_CLOSED');

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
for (const prohibited of ['sourceRegistry', 'readdir', 'readFile', 'glob(', 'process.env', '@prisma/client', 'PrismaClient', 'prisma.', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS']) assert.equal((runtime + data).includes(prohibited), false, 'Manifest runtime/data must not reference ' + prohibited);
for (const prohibited of ['ATTOM', 'LightBox', 'county correspondence', 'provider correspondence', 'qualityScore', 'providerRanking', 'activationAuthority', 'legalUseApproval', 'customerDisplayAuthority']) assert.equal(data.includes(prohibited), false, 'Operational data must not include ' + prohibited);
console.log('[source-quality-operational-manifest] ok: explicit partial typed source set validates deterministically, converts to canonical Assembly and Report, preserves sparse coverage/firewalls, and has no discovery, narrative, live-system, or authority behavior.');
