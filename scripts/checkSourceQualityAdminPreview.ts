import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';

import { SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE, SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE_POSTURE } from '../lib/sourceQualityAdminPreviewFixture';
import { composeSourceQualityReport } from '../lib/sourceQualityReport';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const assembly = assembleSourceQualitySummaries(SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE);
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
if (assembly.classification === 'FAIL_CLOSED') throw new Error('Preview fixture assembly failed closed.');
assert.equal(SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE_POSTURE, 'PREVIEW_FIXTURE_ONLY');
assert.equal(assembly.assembly.coverageClass, 'PARTIAL_REVIEWED_SOURCE_SET');
assert.equal(assembly.assembly.completenessClaim, 'NO_STATEWIDE_OR_PROVIDER_COMPLETENESS_CLAIM');
assert.equal(assembly.assembly.sourceCount, 4);
assert.equal(assembly.assembly.assembledSourceCount, 4);

const report = composeSourceQualityReport(assembly.assembly.summaries);
assert.notEqual(report.classification, 'FAIL_CLOSED');
if (report.classification === 'FAIL_CLOSED') throw new Error('Preview fixture report failed closed.');
assert.equal(report.report.suppliedDatasetScope, 'SUPPLIED_SUMMARIES_ONLY');
assert.equal(report.report.classificationCounts.REVIEW_POSTURE_COMPLETE, 1);
assert.equal(report.report.classificationCounts.REVIEW_REQUIRED, 1);
assert.equal(report.report.classificationCounts.CONFLICT_REQUIRES_REVIEW, 1);
assert.equal(report.report.classificationCounts.INSUFFICIENT_EVIDENCE, 1);
assert.equal(assembleSourceQualitySummaries(SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE).classification, assembly.classification);
assert.equal(composeSourceQualityReport(assembly.assembly.summaries).report?.reportFingerprint, report.report.reportFingerprint);

const pageSource = await readFile(new URL('../app/admin/source-quality/page.tsx', import.meta.url), 'utf8');
const fixtureSource = await readFile(new URL('../lib/sourceQualityAdminPreviewFixture.ts', import.meta.url), 'utf8');
assert.ok(pageSource.includes("assembleSourceQualitySummaries(SOURCE_QUALITY_ADMIN_PREVIEW_FIXTURE)"));
assert.ok(pageSource.includes('composeSourceQualityReport(assembly.summaries)'));
assert.ok(pageSource.includes('PREVIEW_FIXTURE_ONLY'));
assert.ok(pageSource.includes('NO COMPLETENESS CLAIM'));
assert.ok(pageSource.includes('NOT AN OPERATIONAL SOURCE INVENTORY'));
assert.equal(pageSource.includes('SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_THIS_REPORT'), false);
assert.ok(pageSource.includes('activationFirewall.sourceActivation'));
assert.ok(pageSource.includes('activationFirewall.customerDisplayAuthority'));
assert.ok(!pageSource.includes('use client'));
assert.ok(!pageSource.includes('use server'));
assert.ok(fixtureSource.includes('PREVIEW_FIXTURE_ONLY'));
assert.ok(!fixtureSource.includes('COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS'));

for (const prohibited of ['@prisma/client', 'PrismaClient', 'prisma.', 'fetch(', 'http://', 'https://', 'process.env', 'node:fs', 'createClient', 'Typesense', 'CRMTask', 'sendPropertyInquiryNotification', 'nodemailer', 'resend', 'twilio', 'SourceRegistry', 'sourceRegistry', 'qualityScore', 'trustScore', 'leaderboard', 'ranking', 'Activate', 'Approve', 'Publish', '<form', 'route.ts', 'method="POST"', 'method="PATCH"', 'method="PUT"', 'method="DELETE"', 'onSubmit']) assert.ok(!pageSource.includes(prohibited), 'Preview page must not reference ' + prohibited);
for (const prohibited of ['email', 'phone', 'address', 'credential', 'secret', 'narrative', 'correspondence', 'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS']) assert.ok(!fixtureSource.toLowerCase().includes(prohibited), 'Preview fixture must not contain ' + prohibited);

try {
  await access(new URL('../app/api/admin/source-quality/route.ts', import.meta.url), constants.F_OK);
  assert.fail('A source-quality API route is not authorized.');
} catch (error) {
  if (error instanceof assert.AssertionError) throw error;
}

console.log('[source-quality-admin-preview] ok: protected fixture-only server preview renders canonical Assembly and Report output without live data, business-logic duplication, mutation, activation, score/ranking, or protected-system dependency.');
