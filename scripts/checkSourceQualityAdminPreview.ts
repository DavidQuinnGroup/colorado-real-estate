import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';

import { SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE, SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE_POSTURE } from '../lib/sourceQualityAdminPreviewFixture';
import { SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA } from '../lib/sourceQualityOperationalManifestData';
import {
  sourceQualityOperationalManifestToAssemblyRequest,
  validateSourceQualityOperationalManifest,
} from '../lib/sourceQualityOperationalManifest';
import { composeSourceQualityReport } from '../lib/sourceQualityReport';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const fixtureAssembly = assembleSourceQualitySummaries(SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE);
assert.notEqual(fixtureAssembly.classification, 'FAIL_CLOSED');
if (fixtureAssembly.classification === 'FAIL_CLOSED') throw new Error('Preview fixture assembly failed closed.');
assert.equal(SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE_POSTURE, 'PREVIEW_FIXTURE_ONLY');
assert.equal(fixtureAssembly.assembly.coverageClass, 'PARTIAL_REVIEWED_SOURCE_SET');
assert.equal(fixtureAssembly.assembly.completenessClaim, 'NO_STATEWIDE_OR_PROVIDER_COMPLETENESS_CLAIM');
assert.equal(fixtureAssembly.assembly.sourceCount, 4);
assert.equal(fixtureAssembly.assembly.assembledSourceCount, 4);

const manifestResult = validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA);
assert.equal(manifestResult.classification, 'PARTIAL_OPERATIONAL_MANIFEST_VALID');
assert.ok(manifestResult.manifest);
if (!manifestResult.manifest) throw new Error('Operational manifest must validate.');
assert.equal(manifestResult.manifest.coverageClass, 'PARTIAL_REVIEWED_SOURCE_SET');
assert.equal(manifestResult.manifest.suppliedDatasetScope, 'SUPPLIED_MANIFEST_ONLY');
assert.equal(manifestResult.manifest.operationalPosture, 'OPERATIONAL_INPUT_POSTURE_ONLY');
assert.equal(manifestResult.manifest.completenessClaim, 'NO_COMPLETENESS_CLAIM');
assert.equal(manifestResult.manifest.authorityFirewall.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_MANIFEST');
assert.equal(manifestResult.manifest.authorityFirewall.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_MANIFEST');
assert.equal(manifestResult.manifest.authorityFirewall.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_MANIFEST');
assert.equal(manifestResult.manifest.authorityFirewall.qualityScore, 'NO_QUALITY_SCORE');
assert.equal(manifestResult.manifest.authorityFirewall.providerRanking, 'NO_PROVIDER_RANKING');
assert.equal(manifestResult.manifest.authorityFirewall.completeness, 'NO_COMPLETENESS_CLAIM');

const assembly = assembleSourceQualitySummaries(sourceQualityOperationalManifestToAssemblyRequest(manifestResult.manifest));
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
if (assembly.classification === 'FAIL_CLOSED') throw new Error('Operational manifest assembly failed closed.');
assert.equal(assembly.assembly.coverageClass, 'PARTIAL_REVIEWED_SOURCE_SET');
assert.equal(assembly.assembly.completenessClaim, 'NO_STATEWIDE_OR_PROVIDER_COMPLETENESS_CLAIM');
assert.equal(assembly.assembly.sourceCount, manifestResult.manifest.entries.length);
assert.equal(assembly.assembly.assembledSourceCount, manifestResult.manifest.entries.length);

const report = composeSourceQualityReport(assembly.assembly.summaries);
assert.notEqual(report.classification, 'FAIL_CLOSED');
if (report.classification === 'FAIL_CLOSED') throw new Error('Operational manifest report failed closed.');
assert.equal(report.report.suppliedDatasetScope, 'SUPPLIED_SUMMARIES_ONLY');
assert.equal(report.report.sourceCount, manifestResult.manifest.entries.length);
assert.equal(assembleSourceQualitySummaries(sourceQualityOperationalManifestToAssemblyRequest(manifestResult.manifest)).classification, assembly.classification);
assert.equal(composeSourceQualityReport(assembly.assembly.summaries).report?.reportFingerprint, report.report.reportFingerprint);

const pageSource = await readFile(new URL('../app/admin/source-quality/page.tsx', import.meta.url), 'utf8');
const fixtureSource = await readFile(new URL('../lib/sourceQualityAdminPreviewFixture.ts', import.meta.url), 'utf8');
assert.ok(pageSource.includes('SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA'));
assert.ok(pageSource.includes('validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA)'));
assert.ok(pageSource.includes('sourceQualityOperationalManifestToAssemblyRequest(manifest)'));
assert.ok(pageSource.includes('assembleSourceQualitySummaries(assemblyRequest)'));
assert.ok(pageSource.includes('composeSourceQualityReport(assembly.summaries)'));
assert.ok(!pageSource.includes('SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE'));
assert.ok(!pageSource.includes('SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE_POSTURE'));
assert.ok(!pageSource.includes('PREVIEW_FIXTURE_ONLY'));
assert.ok(pageSource.includes('OPERATIONAL REVIEWED MANIFEST'));
assert.ok(pageSource.includes('manifest.coverageClass'));
assert.ok(pageSource.includes('manifest.suppliedDatasetScope'));
assert.ok(pageSource.includes('manifest.operationalPosture'));
assert.ok(pageSource.includes('NO COMPLETENESS CLAIM'));
assert.ok(pageSource.includes('NOT A COMPLETE SOURCE INVENTORY'));
assert.ok(pageSource.includes('Current Manifest Source Count'));
assert.ok(pageSource.includes('String(report.sourceCount)'));
assert.ok(pageSource.includes('FailClosed'));
assert.ok(pageSource.includes('NO FIXTURE FALLBACK'));
assert.ok(pageSource.includes('manifest.authorityFirewall.sourceActivation'));
assert.ok(pageSource.includes('manifest.authorityFirewall.customerDisplayAuthority'));
assert.ok(pageSource.includes('manifest.authorityFirewall.legalUse'));
assert.ok(pageSource.includes('manifest.authorityFirewall.qualityScore'));
assert.ok(pageSource.includes('manifest.authorityFirewall.providerRanking'));
assert.ok(pageSource.includes('manifest.authorityFirewall.completeness'));
assert.ok(pageSource.includes('activationFirewall.sourceActivation'));
assert.ok(pageSource.includes('activationFirewall.customerDisplayAuthority'));
assert.ok(!pageSource.includes('use client'));
assert.ok(!pageSource.includes('use server'));
assert.ok(fixtureSource.includes('PREVIEW_FIXTURE_ONLY'));
assert.ok(!fixtureSource.includes('COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS'));

for (const prohibited of ['@prisma/client', 'PrismaClient', 'prisma.', 'fetch(', 'http://', 'https://', 'process.env', 'node:fs', 'createClient', 'Typesense', 'CRMTask', 'sendPropertyInquiryNotification', 'nodemailer', 'resend', 'twilio', 'SourceRegistry', 'sourceRegistry', 'trustScore', 'leaderboard', 'ranking', 'Activate', 'Approve', 'Publish', '<form', 'route.ts', 'method="POST"', 'method="PATCH"', 'method="PUT"', 'method="DELETE"', 'onSubmit', 'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS']) assert.ok(!pageSource.includes(prohibited), 'Operational page must not reference ' + prohibited);
for (const prohibited of ['email', 'phone', 'address', 'credential', 'secret', 'narrative', 'correspondence', 'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS']) assert.ok(!fixtureSource.toLowerCase().includes(prohibited), 'Preview fixture must not contain ' + prohibited);

try {
  await access(new URL('../app/api/admin/source-quality/route.ts', import.meta.url), constants.F_OK);
  assert.fail('A source-quality API route is not authorized.');
} catch (error) {
  if (error instanceof assert.AssertionError) throw error;
}

console.log('[source-quality-admin-preview] ok: protected server page renders canonical operational manifest through Manifest validation, Assembly, and Report without fixture fallback, live data, business-logic duplication, mutation, activation, score/ranking, or protected-system dependency; preview fixture remains regression-only.');
