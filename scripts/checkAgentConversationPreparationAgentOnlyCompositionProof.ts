import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { AGENT_CONVERSATION_PREPARATION_TYPES, buildAgentConversationPreparationPacket } from '../lib/agent-advisory-workbench/agentConversationPreparationComposition';
import { AGENT_CONVERSATION_PREPARATION_FIXTURES as fixtures } from '../lib/agent-advisory-workbench/agentConversationPreparationFixtures';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
const component = read('components/AgentConversationPreparationCompositionProof.tsx');
const page = read('app/admin/agent-briefing-preparation/page.tsx');
const auth = read('lib/admin/adminAuth.ts');
const middleware = read('middleware.ts');

assert.deepEqual(AGENT_CONVERSATION_PREPARATION_TYPES, ['MARKET_PLACE', 'SELLER_UPDATE_REVIEW', 'OFFER_PREPARATION_REVIEW']);
assert.equal(buildAgentConversationPreparationPacket(fixtures.marketComplete).readiness, 'READY_FOR_AGENT_REVIEW');
assert.equal(buildAgentConversationPreparationPacket(fixtures.marketIncomplete).readiness, 'REVIEW_REQUIRED_INCOMPLETE_EVIDENCE');
assert.equal(buildAgentConversationPreparationPacket(fixtures.conflictingEvidence).readiness, 'REVIEW_REQUIRED_CONFLICTING_EVIDENCE');
assert.equal(buildAgentConversationPreparationPacket(fixtures.sellerMissingFacts).readiness, 'REVIEW_REQUIRED_INCOMPLETE_EVIDENCE');
assert.equal(buildAgentConversationPreparationPacket(fixtures.offerProfessional).readiness, 'PROFESSIONAL_REVIEW_REQUIRED');
assert.equal(buildAgentConversationPreparationPacket(fixtures.unsupported).readiness, 'FAIL_CLOSED');

for (const marker of ['data-agent-only="true"', 'data-persistence="false"', 'data-customer-data="false"', 'data-network="false"', 'agent-preparation-type-selector', 'agent-synthetic-fixture-selector', 'agent-preparation-reset', 'Preparation purpose', 'Packet readiness', 'Professional handoff categories', 'REIE surfaces to review', 'Do-not-conclude boundaries']) assert(component.includes(marker), `missing AGENT_ONLY proof marker: ${marker}`);
for (const forbidden of [/localStorage/i, /sessionStorage/i, /URLSearchParams/i, /searchParams/i, /<a\b/i, /href=/i, /fetch\s*\(/i, /prisma/i, /createClient/i, /typesense/i, /CRMTask/i, /SellerLead/i, /resend/i, /analytics/i, /<form\b/i, /method="post"/i]) assert(!forbidden.test(component), `prohibited composition behavior: ${forbidden}`);
assert(!/searchParams/i.test(page) && !/scenario/i.test(page), 'route must not accept URL packet state');
assert(page.includes('AgentConversationPreparationCompositionProof'), 'route must render the bounded local-state proof');
assert(auth.includes("surface('/admin/agent-briefing-preparation', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT', 'HUMAN_ADMIN'], ['AGENT', 'REPOSITORY_ADMIN']"), 'route classification must retain AGENT authorization only');
assert(middleware.includes('matcher: ["/admin/:path*", "/api/admin/:path*"]'), 'middleware must retain protected route coverage');

console.log('AGENT_CONVERSATION_PREPARATION_AGENT_ONLY_COMPOSITION_PROOF_CHECK: PASS');
