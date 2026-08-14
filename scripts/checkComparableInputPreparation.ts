import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildComparableInputPacket,
  type ComparableInputPreparationRequest,
} from '../lib/comparableInputPreparation';

const subject = {
  id: 'subject-001',
  address: '100 Subject Lane',
  city: 'Boulder',
  state: 'CO',
  neighborhood: 'North Boulder',
  price: 800000,
  status: 'Active',
  propertyType: 'Single Family',
  beds: 3,
  baths: 2,
  sqft: 2000,
  lotSize: 0.2,
  yearBuilt: 1980,
  updatedAt: '2026-08-12T15:00:00.000Z',
  sourceId: 'SRC-MLS-LISTING-DATA',
} as const;

const candidateOne = {
  id: 'candidate-001',
  address: '200 Candidate Avenue',
  city: 'Boulder',
  state: 'CO',
  neighborhood: 'North Boulder',
  price: 850000,
  status: 'Active',
  propertyType: 'Single Family',
  beds: 4,
  baths: 2,
  sqft: 2100,
  lotSize: 0.25,
  yearBuilt: 1985,
  lastIntelligenceSync: '2026-08-11T12:00:00.000Z',
  sourceId: 'SRC-MLS-LISTING-DATA',
} as const;

const candidateTwo = {
  id: 'candidate-002',
  address: '300 Candidate Court',
  city: 'Boulder',
  state: 'CO',
  price: 780000,
  status: 'Unknown',
  propertyType: 'Townhome',
  beds: 3,
  baths: 2,
  sqft: undefined,
  lotSize: undefined,
  yearBuilt: undefined,
  sourceId: 'SRC-MLS-LISTING-DATA',
} as const;

const request: ComparableInputPreparationRequest = {
  generatedAt: '2026-08-13T18:00:00.000Z',
  subject,
  candidates: [candidateOne, candidateTwo],
};

const packet = buildComparableInputPacket(request);
const repeatPacket = buildComparableInputPacket(request);

assert.equal(packet.status, 'READY_FOR_AGENT_REVIEW');
assert.equal(packet.failureReason, null);
assert.equal(packet.subject?.identity.id, subject.id);
assert.equal(packet.candidates.length, 2);
assert.equal(packet.comparisons.length, 2);
assert.deepEqual(packet, repeatPacket, 'Same explicit inputs and generatedAt must produce deterministic output.');
assert.ok(packet.comparisons[0].differences.some((difference) => difference.state === 'FACTUAL_DIFFERENCE'), 'Expected factual listing differences.');
assert.ok(packet.comparisons[0].differences.some((difference) => difference.state === 'CALCULATED_DIFFERENCE'), 'Expected labelled arithmetic difference.');
assert.ok(packet.comparisons[1].differences.some((difference) => difference.state === 'EVIDENCE_ASYMMETRY'), 'Expected evidence asymmetry when candidate facts are missing.');
const unavailablePacket = buildComparableInputPacket({
  generatedAt: request.generatedAt,
  subject: { ...subject, lotSize: undefined },
  candidates: [candidateTwo],
});
assert.ok(unavailablePacket.comparisons[0].differences.some((difference) => difference.state === 'UNAVAILABLE_EVIDENCE'), 'Expected unavailable evidence when both compared values are absent.');
assert.ok(packet.limitations.some((limitation) => limitation.category === 'SOLD_VERIFICATION' && limitation.state === 'UNAVAILABLE_EVIDENCE'), 'Expected sold verification limitation.');
assert.ok(packet.limitations.some((limitation) => limitation.category === 'RECENCY' && limitation.state === 'VERIFICATION_REQUIRED'), 'Expected recency verification limitation.');
assert.equal(packet.subject?.sourceAndFreshness.visibleTimestamp, '2026-08-12T15:00:00.000Z');
assert.equal(packet.candidates[0].sourceAndFreshness.visibleTimestamp, '2026-08-11T12:00:00.000Z');
assert.equal(packet.candidates[1].sourceAndFreshness.visibleTimestampKind, 'NO_VISIBLE_TIMESTAMP');
assert.ok(packet.verificationQuestions.length >= 10, 'Expected neutral verification questions for each candidate.');
assert.ok(packet.humanReviewChecklist.some((item) => item.includes('Comparable selection')), 'Expected human comparable-selection responsibility.');
assert.ok(packet.humanReviewChecklist.some((item) => item.includes('CMA methodology')), 'Expected human CMA responsibility.');

const noCandidatePacket = buildComparableInputPacket({ ...request, candidates: [] });
assert.equal(noCandidatePacket.status, 'FAIL_CLOSED');
assert.equal(noCandidatePacket.failureReason, 'NO_CANDIDATES');
assert.equal(noCandidatePacket.candidates.length, 0);
assert.equal(noCandidatePacket.comparisons.length, 0);

const forbiddenOutputTerms = [
  'best comp',
  'ranking',
  'score',
  'valuation',
  'market value',
  'estimated value',
  'suggested list price',
  'suggested offer',
  'appraisal conclusion',
  'investment return',
  'acceptance probability',
  'suitability',
  'desirability',
  'protected-class',
  'safety ranking',
  'school ranking',
  'steering',
];
const serializedPacket = JSON.stringify(packet).toLowerCase();
for (const term of forbiddenOutputTerms) {
  assert.ok(!serializedPacket.includes(term), `Packet output must not contain forbidden term: ${term}`);
}

const moduleSource = readFileSync(new URL('../lib/comparableInputPreparation.ts', import.meta.url), 'utf8').toLowerCase();
const forbiddenImportTerms = [
  '@prisma/client',
  'prisma',
  '/mls',
  '/alerts',
  'queue',
  'worker',
  'resend',
  '/email',
  '/crm',
  'lightbox',
  'attom',
  'typesense',
  'fetch(',
];
for (const term of forbiddenImportTerms) {
  assert.ok(!moduleSource.includes(term), `Comparable Input module must not reference protected system term: ${term}`);
}

const pageSource = readFileSync(new URL('../app/admin/comparable-input-preparation/page.tsx', import.meta.url), 'utf8').toLowerCase();
assert.ok(pageSource.includes("from '@/lib/comparableinputpreparation'"), 'Agent preview must reuse the certified packet contract.');
assert.ok(pageSource.includes("from '@/lib/property/publicpropertyread'"), 'Agent preview must use the approved bounded property read.');
assert.ok(pageSource.includes('method="get"'), 'Agent preview selection form must use GET.');
assert.ok(!pageSource.includes('method="post"'), 'Agent preview must not expose a POST form.');
assert.ok(pageSource.includes('index: false') && pageSource.includes('follow: false'), 'Agent preview metadata must be noindex and nofollow.');
assert.ok(pageSource.includes('subjectid') && pageSource.includes('candidateid') && pageSource.includes('candidateid2'), 'Agent preview must require explicit subject and candidate fields.');
assert.ok(pageSource.includes("candidateid2 ? [candidateid, candidateid2] : [candidateid]"), 'Agent preview must support one or two explicit candidates only.');
assert.ok(pageSource.includes('missing_explicit_selection') && pageSource.includes('duplicate_identity'), 'Agent preview must fail closed for missing and duplicate selections.');
assert.ok(pageSource.includes('unavailable_selected_property'), 'Agent preview must fail closed for unavailable selected properties.');
assert.ok(pageSource.includes('reie prepares evidence.'), 'Agent preview must display the agent-review boundary.');
assert.ok(pageSource.includes('data-comparable-input-agent-preview-persistence="false"'), 'Agent preview must declare no persistence.');
assert.ok(!pageSource.includes('sourcemodifiedat'), 'Agent preview must not depend on sourceModifiedAt.');

const forbiddenPageImportTerms = [
  '@prisma/client',
  '@/lib/prisma',
  '/mls',
  '/alerts',
  'queue',
  'worker',
  'resend',
  '/email',
  '/crm',
  'lightbox',
  'attom',
  'typesense',
  'fetch(',
];
for (const term of forbiddenPageImportTerms) {
  assert.ok(!pageSource.includes(term), `Agent preview must not reference protected system term: ${term}`);
}

const forbiddenPageConclusionTerms = [
  'best comp',
  'recommended comp',
  'estimated value',
  'market value',
  'suggested list price',
  'suggested offer',
  'appraisal conclusion',
  'investment return',
  'acceptance probability',
  'suitability',
  'desirability',
  'safety ranking',
  'school ranking',
  'steering',
];
for (const term of forbiddenPageConclusionTerms) {
  assert.ok(!pageSource.includes(term), `Agent preview must not contain prohibited conclusion language: ${term}`);
}

console.log('Comparable Input Preparation MVV checks passed.');
