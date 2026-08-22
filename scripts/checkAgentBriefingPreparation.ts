import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { buildAgentBriefingPreparationPacket } from '../lib/agentBriefingPreparation';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const generatedAt = '2026-08-14T12:00:00.000Z';
const validInput = {
  generatedAt,
  briefingType: 'MARKET_PLACE' as const,
  purpose: 'Prepare neutral internal market-and-place inputs for the weekly team meeting.',
  evidenceSections: [
    {
      id: 'market-snapshot',
      title: 'Current market snapshot',
      sourceIdentity: 'REIE governed market package',
      visibleDate: '2026-08-14',
      effectiveDate: '2026-08-01',
      evidence: [
        { label: 'Active inventory signal', value: 'Supplied current inventory context', state: 'FACTUAL_SUPPLIED' as const },
        { label: 'Price per square foot context', value: '775', state: 'CALCULATED_SUPPLIED' as const },
      ],
      limitations: ['This is a supplied current-state section and needs human review before external use.'],
      verificationRequirements: ['Confirm the intended meeting period before discussing this section.'],
    },
    {
      id: 'place-context',
      title: 'City location context',
      sourceIdentity: 'REIE City Decision Guide',
      visibleDate: '2026-08-14',
      effectiveDate: '2026-08-08',
      evidence: [{ label: 'Municipal context', value: 'Supplied objective city-service reference', state: 'FACTUAL_SUPPLIED' as const }],
      limitations: ['Local claims remain source-bound and require neutral presentation.'],
      verificationRequirements: ['Refer place-specific questions to appropriate objective sources.'],
    },
  ],
};

const packet = buildAgentBriefingPreparationPacket(validInput);
assert(packet.status === 'READY_FOR_AGENT_REVIEW', 'multiple complete MARKET_PLACE sections should produce a ready packet');
assert(packet.sections.length === 2, 'packet should preserve each explicitly supplied section');
assert(packet.sections[0].evidence[0].state === 'FACTUAL_SUPPLIED', 'factual evidence state must be preserved');
assert(packet.sections[0].evidence[1].state === 'CALCULATED_SUPPLIED', 'calculated-result label must be preserved');
assert(packet.sections[0].sourceIdentity === 'REIE governed market package', 'source identity must be preserved');
assert(packet.sections[0].visibleDate === '2026-08-14' && packet.sections[0].effectiveDate === '2026-08-01', 'visible and effective date context must be preserved');
assert(packet.sections[0].limitations.length === 1, 'limitations must be preserved');
assert(packet.sections[0].verificationRequirements.length === 1, 'verification requirements must be preserved');
assert(packet.internalTalkingPointInputs.some((item) => item.includes('Active inventory signal: Supplied current inventory context')), 'talking points must derive only from supported supplied evidence');
assert(packet.internalTalkingPointInputs.some((item) => item.includes('(CALCULATED_SUPPLIED)')), 'talking points must retain calculated labeling');
assert(packet.reviewQuestions.length >= 3, 'human review questions should be present');
assert(packet.protectedBoundaries.customerDelivery === false && packet.protectedBoundaries.email === false && packet.protectedBoundaries.crm === false, 'packet must remain internal only with no delivery or CRM');
assert(packet.protectedBoundaries.calculations === false && packet.protectedBoundaries.inference === false && packet.protectedBoundaries.recommendation === false, 'packet must not calculate, infer, or recommend');
assert(packet.protectedBoundaries.currentStateOnly === true, 'packet must declare current-state-only posture');

const incomplete = buildAgentBriefingPreparationPacket({
  ...validInput,
  evidenceSections: [{
    ...validInput.evidenceSections[0],
    evidence: [
      { label: 'Pending evidence', value: null, state: 'UNKNOWN' as const },
      { label: 'Unavailable evidence', value: null, state: 'NOT_AVAILABLE' as const },
      { label: 'Unverified evidence', value: null, state: 'NOT_VERIFIED' as const },
    ],
    visibleDate: undefined,
    effectiveDate: undefined,
  }],
});
assert(incomplete.status === 'REVIEW_REQUIRED_INCOMPLETE_EVIDENCE', 'incomplete supplied evidence must require review rather than become affirmative');
assert(incomplete.completeness === 'INCOMPLETE_EVIDENCE', 'incomplete evidence classification must be visible');
assert(incomplete.missingEvidence.length === 3, 'unknown, unavailable, and unverified evidence must remain missing');
assert(incomplete.internalTalkingPointInputs.length === 0, 'incomplete evidence cannot silently become a talking point');

const invalidUnknown = buildAgentBriefingPreparationPacket({
  ...validInput,
  evidenceSections: [{
    ...validInput.evidenceSections[0],
    evidence: [{ label: 'Unknown item', value: 'affirmative text', state: 'UNKNOWN' as const }],
  }],
});
assert(invalidUnknown.status === 'FAIL_CLOSED', 'unknown evidence with an affirmative value must fail closed');

const prohibited = buildAgentBriefingPreparationPacket({
  ...validInput,
  evidenceSections: [{
    ...validInput.evidenceSections[0],
    evidence: [{ label: 'Neighborhood suitability', value: 'Ideal for families', state: 'FACTUAL_SUPPLIED' as const }],
  }],
});
assert(prohibited.status === 'FAIL_CLOSED', 'prohibited fair-housing inference must fail closed');
assert(prohibited.failureReasons.some((reason) => reason.includes('PROHIBITED_INFERENCE')), 'blocked fair-housing posture must be explicit');

const noPurpose = buildAgentBriefingPreparationPacket({ ...validInput, purpose: ' ' });
assert(noPurpose.status === 'FAIL_CLOSED', 'missing internal purpose must fail closed');
const missingSource = buildAgentBriefingPreparationPacket({
  ...validInput,
  evidenceSections: [{ ...validInput.evidenceSections[0], sourceIdentity: undefined }],
});
assert(missingSource.status === 'FAIL_CLOSED', 'missing source identity must fail closed');
const unsupportedType = buildAgentBriefingPreparationPacket({ ...validInput, briefingType: undefined });
assert(unsupportedType.status === 'FAIL_CLOSED', 'unsupported briefing type must fail closed');

const deterministicA = buildAgentBriefingPreparationPacket(validInput);
const deterministicB = buildAgentBriefingPreparationPacket(validInput);
assert(JSON.stringify(deterministicA) === JSON.stringify(deterministicB), 'identical input must produce deterministic output');
const talkingPoints = packet.internalTalkingPointInputs.join(' ').toLowerCase();
for (const prohibitedPhrase of ['what changed', 'increased', 'decreased', 'improved', 'worsened', 'since last briefing', 'period-over-period', 'trend change', 'recommended price', 'negotiation recommendation', 'offer recommendation', 'suitable', 'desirable', 'good area', 'bad area']) {
  assert(!talkingPoints.includes(prohibitedPhrase), `talking points must not introduce prohibited current-state or advisory language: ${prohibitedPhrase}`);
}

const runtimeSource = readFileSync(resolve(process.cwd(), 'lib/agentBriefingPreparation.ts'), 'utf8');
assert(!/^\s*import\s/m.test(runtimeSource), 'runtime module must remain self-contained with no imports');
for (const protectedPattern of [/\brequire\s*\(/i, /\bfetch\s*\(/i, /\bprisma\s*\./i, /\bcreateClient\s*\(/i, /\bprocess\s*\./i, /\breadFile\w*\s*\(/i, /\bwriteFile\w*\s*\(/i, /\bhttps?\s*\.request\s*\(/i, /\bsourceRegistry\b/i, /\bcomparableInputPreparation\b/i, /\bopenHouseAgentPreparation\b/i, /\bsellerUpdatePreparation\b/i]) {
  assert(!protectedPattern.test(runtimeSource), `runtime module must not reference a protected or duplicate system: ${protectedPattern}`);
}

const previewSource = readFileSync(resolve(process.cwd(), 'app/admin/agent-briefing-preparation/page.tsx'), 'utf8');
const compositionProofSource = readFileSync(resolve(process.cwd(), 'components/AgentConversationPreparationCompositionProof.tsx'), 'utf8');
const middlewareSource = readFileSync(resolve(process.cwd(), 'middleware.ts'), 'utf8');
assert(previewSource.includes('AgentConversationPreparationCompositionProof'), 'preview must use the bounded composition-proof adapter');
assert(!/searchParams|scenario/i.test(previewSource), 'preview must not accept URL packet state');
assert(compositionProofSource.includes('data-agent-only="true"') && compositionProofSource.includes('data-persistence="false"'), 'proof must remain agent-only and non-persistent');
assert(compositionProofSource.includes('MARKET_PLACE') && compositionProofSource.includes('SELLER_UPDATE_REVIEW') && compositionProofSource.includes('OFFER_PREPARATION_REVIEW'), 'proof must expose only the three authorized types');
assert(compositionProofSource.includes('buildAgentConversationPreparationPacket') && compositionProofSource.includes('AGENT_CONVERSATION_PREPARATION_FIXTURES'), 'proof must reuse the canonical composition and synthetic fixtures');
for (const field of ['Preparation purpose', 'Packet readiness', 'Known evidence', 'Assumptions', 'Professional handoff categories', 'Do-not-conclude boundaries']) assert(compositionProofSource.includes(field), `proof must render ${field}`);
assert(compositionProofSource.includes('agent-preparation-reset'), 'proof must provide deterministic local reset');
assert(previewSource.includes('index: false') && previewSource.includes('follow: false') && previewSource.includes('nocache: true') && previewSource.includes('noimageindex: true'), 'preview must use noindex, nofollow, nocache, and Googlebot noindex posture');
assert(!/<form\b/i.test(compositionProofSource) && !/method="post"/i.test(compositionProofSource), 'proof must not use form POST behavior');
assert(!/localStorage|sessionStorage|URLSearchParams|<a\b|href=|fetch\s*\(|prisma|createClient|typesense|crmTask|resend|queue|worker|email\s*\(/i.test(compositionProofSource), 'proof must not depend on persistence, navigation, provider, DB, CRM, queue, worker, or email systems');
assert(middlewareSource.includes('matcher: ["/admin/:path*", "/api/admin/:path*"]') && middlewareSource.includes('buildAdminLoginRedirect'), 'existing middleware must protect the preview and redirect unauthenticated admin requests');

console.log('AGENT_BRIEFING_PREPARATION_CHECK: PASS');
