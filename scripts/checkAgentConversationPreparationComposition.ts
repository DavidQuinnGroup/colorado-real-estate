import assert from 'node:assert/strict';
import { buildAgentConversationPreparationPacket, AGENT_CONVERSATION_PREPARATION_TYPES } from '../lib/agent-advisory-workbench/agentConversationPreparationComposition';
import { AGENT_CONVERSATION_PREPARATION_FIXTURES as fixtures } from '../lib/agent-advisory-workbench/agentConversationPreparationFixtures';

assert.deepEqual(AGENT_CONVERSATION_PREPARATION_TYPES, ['MARKET_PLACE', 'SELLER_UPDATE_REVIEW', 'OFFER_PREPARATION_REVIEW']);
const market = buildAgentConversationPreparationPacket(fixtures.marketComplete);
assert.equal(market.visibility, 'ADMIN_ONLY'); assert.equal(market.activationState, 'NOT_AUTHORIZED'); assert.equal(market.readiness, 'READY_FOR_AGENT_REVIEW');
assert.equal(market.assumptions[0].classification, 'USER_ASSUMPTION'); assert.equal(market.protectedBoundaries.persistence, false);
assert.equal(buildAgentConversationPreparationPacket(fixtures.marketIncomplete).readiness, 'REVIEW_REQUIRED_INCOMPLETE_EVIDENCE');
assert.equal(buildAgentConversationPreparationPacket(fixtures.sellerMissingFacts).readiness, 'REVIEW_REQUIRED_INCOMPLETE_EVIDENCE');
assert.equal(buildAgentConversationPreparationPacket(fixtures.offerProfessional).readiness, 'PROFESSIONAL_REVIEW_REQUIRED');
assert.equal(buildAgentConversationPreparationPacket(fixtures.conflictingEvidence).readiness, 'REVIEW_REQUIRED_CONFLICTING_EVIDENCE');
for (const fixture of [fixtures.prohibitedFairHousing, fixtures.prohibitedRecommendation, fixtures.prohibitedOfferAdvice, fixtures.prohibitedPersistence, fixtures.prohibitedCrmIdentity, fixtures.prohibitedHiddenTransfer, fixtures.unsupported]) assert.equal(buildAgentConversationPreparationPacket(fixture).readiness, 'FAIL_CLOSED');
assert.deepEqual(buildAgentConversationPreparationPacket(fixtures.marketComplete), buildAgentConversationPreparationPacket(fixtures.marketComplete));
console.log('AGENT_CONVERSATION_PREPARATION_COMPOSITION_CHECK: PASS');
