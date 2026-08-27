import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { buildSellerUpdatePreparationPacket } from '../lib/sellerUpdatePreparation';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const generatedAt = '2026-08-14T12:00:00.000Z';
const currentFacts = {
  address: '200 E Colfax Ave',
  city: 'Denver',
  state: 'CO',
  status: 'Active',
  listedPrice: 750000,
  propertyType: 'Single family',
  beds: 3,
  baths: 2,
  squareFeet: 1500,
  yearBuilt: 1998,
} as const;

const validInput = {
  generatedAt,
  subject: {
    id: 'subject-001',
    facts: currentFacts,
    sourcePosture: {
      sourceIdentity: 'Supplied listing evidence',
      visibleTimestamp: '2026-08-14T09:00:00.000Z',
      semantic: 'Caller-supplied visible timestamp only',
      limitations: ['Condition is not established by listing facts.'],
    },
  },
  priorBaseline: {
    label: 'Caller factual baseline',
    facts: { ...currentFacts, listedPrice: 775000, status: 'Coming soon' },
  },
  marketContext: {
    geography: 'Denver',
    periodLabel: 'August 2026',
    effectiveDate: '2026-08-01',
    sourceIdentity: 'Caller-supplied governed market context',
    visibleTimestamp: '2026-08-14T08:00:00.000Z',
    facts: [{ label: 'Active inventory context', value: 'Supplied factual cohort statement' }],
    limitations: ['Requires agent interpretation.'],
  },
  competitiveFacts: [
    {
      id: 'competitive-001',
      address: '201 E Colfax Ave',
      facts: { listedPrice: 730000, status: 'Active', beds: 3, baths: 2, squareFeet: 1400, propertyType: 'Single family' },
      sourcePosture: { sourceIdentity: 'Supplied competitive evidence', visibleTimestamp: '2026-08-14T09:30:00.000Z' },
    },
  ],
} as const;

const packet = buildSellerUpdatePreparationPacket(validInput);
assert(packet.status === 'READY_FOR_AGENT_REVIEW', 'valid explicit subject/current facts should produce a review packet');
assert(packet.subject?.id === 'subject-001', 'packet should preserve explicit subject identity');
assert(packet.subject?.facts.some((fact) => fact.key === 'pricePerSquareFoot' && fact.classification === 'CALCULATED_FACT'), 'price per square foot should be distinctly calculated');
assert(packet.priorBaseline.state === 'CALLER_SUPPLIED_BASELINE', 'prior facts should be labeled caller supplied');
assert(packet.priorBaseline.factualDeltas.some((delta) => delta.key === 'listedPrice' && delta.classification === 'FACTUAL_CHANGE'), 'price delta should be baseline-backed');
assert(packet.priorBaseline.factualDeltas.some((delta) => delta.key === 'status' && delta.classification === 'FACTUAL_CHANGE'), 'status delta should be baseline-backed');
assert(packet.priorBaseline.factualDeltas.some((delta) => delta.key === 'beds' && delta.classification === 'UNCHANGED_FACT'), 'unchanged supplied facts should remain auditable');
assert(packet.marketContext.state === 'SUPPLIED_MARKET_CONTEXT', 'supplied market facts should be retained');
assert(packet.competitiveFacts.selectionMode === 'AGENT_SUPPLIED_ONLY', 'competitive entries must remain agent supplied only');
assert(packet.competitiveFacts.entries.length === 1, 'one explicit competitive entry should be retained');
assert(packet.sourcePosture.timestampState === 'VISIBLE_TIMESTAMP', 'visible source timestamp should be propagated');
assert(packet.verificationQuestions.length >= 7, 'neutral verification questions should be present');
assert(packet.humanReviewChecklist.length >= 4, 'human review checklist should be present');

const missingSubject = buildSellerUpdatePreparationPacket({ generatedAt, subject: { facts: currentFacts } });
assert(missingSubject.status === 'FAIL_CLOSED', 'missing subject identity must fail closed');

const sparse = buildSellerUpdatePreparationPacket({ generatedAt, subject: { id: 'sparse-001', facts: { status: 'Active' } } });
assert(sparse.status === 'READY_FOR_AGENT_REVIEW', 'sparse but supplied current facts should remain reviewable');
assert(sparse.subject?.facts.some((fact) => fact.classification === 'MISSING_FACT'), 'sparse facts should remain visibly missing');
assert(sparse.priorBaseline.state === 'NO_PRIOR_UPDATE_BASELINE', 'absent baseline must remain explicit');
assert(sparse.priorBaseline.factualDeltas.length === 0, 'no baseline must not produce delta claims');
assert(sparse.marketContext.state === 'MISSING_MARKET_CONTEXT', 'missing market context must remain explicit');
assert(sparse.sourcePosture.timestampState === 'NO_VISIBLE_TIMESTAMP', 'missing timestamp must remain explicit');

const multipleCompetitors = buildSellerUpdatePreparationPacket({
  ...validInput,
  competitiveFacts: [
    ...validInput.competitiveFacts,
    { id: 'competitive-002', address: '202 E Colfax Ave', facts: { listedPrice: 760000, status: 'Pending', beds: 4 } },
  ],
});
assert(multipleCompetitors.competitiveFacts.entries.length === 2, 'multiple explicit competitive entries should be retained without ordering guidance');
assert(multipleCompetitors.competitiveFacts.differences.some((difference) => difference.competitiveId === 'competitive-002' && difference.classification === 'EVIDENCE_ASYMMETRY'), 'uneven facts must produce evidence asymmetry');
assert(packet.unsupportedEvidence.some((item) => item.label === 'Property days on market'), 'missing DOM must remain visible');
assert(packet.unsupportedEvidence.some((item) => item.label === 'Showing feedback'), 'missing feedback must remain visible');
assert(packet.unsupportedEvidence.some((item) => item.label === 'Condition or improvements'), 'missing condition evidence must remain visible');

const deterministicA = buildSellerUpdatePreparationPacket(validInput);
const deterministicB = buildSellerUpdatePreparationPacket(validInput);
assert(JSON.stringify(deterministicA) === JSON.stringify(deterministicB), 'fixed generatedAt and inputs must be deterministic');

const rendered = JSON.stringify(packet);
for (const prohibited of ['recommended list price', 'price reduction recommendation', 'concession recommendation', 'marketing recommendation', 'negotiation recommendation', 'appraisal conclusion', 'seller-message generation', 'best comp', 'acceptance probability']) {
  assert(!rendered.toLowerCase().includes(prohibited), `packet must not contain prohibited conclusion language: ${prohibited}`);
}
assert(packet.protectedBoundaries.sideEffects === false && packet.protectedBoundaries.network === false && packet.protectedBoundaries.persistence === false, 'packet must certify zero side effects');
assert(packet.protectedBoundaries.autonomousSelection === false && packet.protectedBoundaries.ranking === false && packet.protectedBoundaries.scoring === false && packet.protectedBoundaries.valuation === false, 'packet must prohibit selection, ranking, scoring, and valuation');
assert(packet.protectedBoundaries.communicationGeneration === false && packet.protectedBoundaries.customerBehavior === false, 'packet must prohibit seller communication and customer behavior');

const runtimeSource = readFileSync(resolve(process.cwd(), 'lib/sellerUpdatePreparation.ts'), 'utf8');
assert(!/^\s*import\s/m.test(runtimeSource), 'runtime module must remain self-contained with no imports');
for (const protectedPattern of [/\bprisma\b/i, /\bfetch\s*\(/i, /\brequire\s*\(/i, /\bnode:fs\b/i, /\bnode:http\b/i, /\bnode:https\b/i, /\bmls\b/i, /\btypesense\b/i, /\bcrm\b/i, /\balert\b/i, /\bqueue\b/i, /\bworker\b/i, /\bresend\b/i, /\bprocess\b/i]) {
  assert(!protectedPattern.test(runtimeSource), `runtime module must not reference a protected system: ${protectedPattern}`);
}

const previewSource = readFileSync(resolve(process.cwd(), 'app/admin/seller-update-preparation/page.tsx'), 'utf8');
const middlewareSource = readFileSync(resolve(process.cwd(), 'middleware.ts'), 'utf8');
assert(previewSource.includes("data-seller-update-preparation-route=\"/admin/seller-update-preparation\""), 'preview must use the protected seller-update route');
assert(previewSource.includes("method=\"get\""), 'preview form must be GET-only');
assert(!/<form[^>]+action=/i.test(previewSource), 'preview form must not declare an action mutation target');
assert(previewSource.includes("index: false") && previewSource.includes("follow: false") && previewSource.includes("nocache: true"), 'preview metadata must be noindex, nofollow, and nocache');
assert(previewSource.includes("googleBot") && previewSource.includes("noimageindex: true"), 'preview metadata must preserve Googlebot noindex posture');
assert(previewSource.includes("getPublicPropertiesByIds(selection.requestedIds)"), 'preview must use one bounded property read for submitted IDs');
assert(previewSource.includes("toPublicPropertyIdFilterValue"), 'preview must reuse repository property ID validation');
assert(previewSource.includes("requestedIds.length > 3") && previewSource.includes("new Set(requestedIds).size !== requestedIds.length"), 'preview must enforce the maximum and distinct identities');
assert(previewSource.includes("allRequestedResolved") && previewSource.includes("Fail closed: every explicitly requested Property ID must resolve successfully."), 'preview must fail closed for unavailable requested IDs');
assert(previewSource.includes('packet.priorBaseline.state') && previewSource.includes('packet.marketContext.state'), 'preview must render version-one baseline and market limitation states');
assert(previewSource.includes('packet.competitiveFacts.selectionMode'), 'preview must render explicit competitive-selection posture');
assert(previewSource.includes("not an authoritative MLS freshness statement"), 'preview must qualify visible timestamps');
assert(previewSource.includes("REIE prepares factual evidence. The agent determines seller strategy."), 'preview must display the professional boundary');
for (const prohibited of [/sourceModifiedAt/i, /publicSearchEligibility/i, /buildMarket/i, /CRMTask/i, /seller email\/message/i, /fetch\s*\(/i, /\.\$executeRaw/i, /\.\$queryRaw/i, /method=\"post\"/i, /<form[^>]+action=/i]) {
  assert(!prohibited.test(previewSource), `preview must not depend on a prohibited system or mutation pattern: ${prohibited}`);
}
assert(
  middlewareSource.includes("pathname.startsWith('/admin')") &&
    middlewareSource.includes('"/admin/:path*"') &&
    middlewareSource.includes('"/api/admin/:path*"') &&
    middlewareSource.includes('buildAdminLoginRedirect'),
  'existing middleware must protect the preview and redirect unauthenticated admin requests',
);

console.log('SELLER_UPDATE_PREPARATION_CHECK: PASS');
