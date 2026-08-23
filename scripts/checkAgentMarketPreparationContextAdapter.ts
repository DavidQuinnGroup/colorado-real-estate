import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { AGENT_MARKET_HUMAN_STATE, AGENT_MARKET_PREPARATION_CONTEXT_CLASS, admitAgentMarketPreparationContext, buildAgentMarketHumanBriefing } from '../lib/agent-advisory-workbench/agentMarketPreparationContextAdapter';
import { AGENT_MARKET_PREPARATION_CONTEXT_FIXTURES as fixtures } from '../lib/agent-advisory-workbench/agentMarketPreparationContextAdapterFixtures';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
const adapter = read('lib/agent-advisory-workbench/agentMarketPreparationContextAdapter.ts');
const auth = read('lib/admin/adminAuth.ts');
const middleware = read('middleware.ts');
const proof = read('components/AgentConversationPreparationCompositionProof.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };

assert.equal(AGENT_MARKET_PREPARATION_CONTEXT_CLASS, 'AGENT_MARKET_PREPARATION_CONTEXT');
assert.equal(admitAgentMarketPreparationContext(fixtures.complete).state, 'READY');
assert.equal(admitAgentMarketPreparationContext(fixtures.incomplete).state, 'INCOMPLETE');
assert.equal(admitAgentMarketPreparationContext(fixtures.conflicting).state, 'CONFLICTING');
assert.equal(admitAgentMarketPreparationContext(fixtures.stale).state, 'STALE');
const professionalAdmission = admitAgentMarketPreparationContext(fixtures.professional);
assert.equal(professionalAdmission.state, 'PROFESSIONAL_REVIEW_REQUIRED', professionalAdmission.reasons.join(', '));
assert.equal(admitAgentMarketPreparationContext({ ...fixtures.complete, observations: [] }).state, 'INSUFFICIENT_CONTEXT');
assert.equal(admitAgentMarketPreparationContext(fixtures.missingProvenance).state, 'UNAUTHORIZED_CONTEXT');
assert.equal(admitAgentMarketPreparationContext(fixtures.unauthorizedRights).state, 'UNAUTHORIZED_CONTEXT');
assert.equal(admitAgentMarketPreparationContext(fixtures.unsupportedClass).state, 'UNAUTHORIZED_CONTEXT');
for (const fixture of [fixtures.customerData, fixtures.behavioral, fixtures.hiddenContext, fixtures.adminOnly, fixtures.mcp, fixtures.mutation, fixtures.providerRuntime, fixtures.recommendation, fixtures.ranking, fixtures.protectedClass]) assert.equal(admitAgentMarketPreparationContext(fixture).state, 'UNAUTHORIZED_CONTEXT');
for (const fixture of [fixtures.sellerTask, fixtures.offerTask, fixtures.fourthTask]) assert.equal(admitAgentMarketPreparationContext(fixture).state, 'UNSUPPORTED_TASK_CONTEXT');

const briefing = buildAgentMarketHumanBriefing(admitAgentMarketPreparationContext(fixtures.complete));
assert.equal(briefing.humanState, AGENT_MARKET_HUMAN_STATE.READY);
assert.equal(briefing.briefingSummary?.marketLabel, 'Boulder market');
assert.equal(briefing.whatMatters.length, 1);
assert.equal(briefing.evidencePosture[0]?.sourceIdentity, 'SRC-CERTIFIED-MARKET');
assert(briefing.prohibitedOutputs.includes('NO_RECOMMENDATION'));
assert.deepEqual(buildAgentMarketHumanBriefing(admitAgentMarketPreparationContext(fixtures.complete)), briefing);

for (const token of ['fetch(', 'PrismaClient', '@prisma', 'process.env', 'Typesense', 'sendEmail', 'strategyGate', 'REIEControlState']) assert.equal(adapter.includes(token), false, `adapter must not depend on ${token}`);
assert(auth.includes("surface('/agent/prepare/market', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false)"), 'future route must remain exact AGENT-only read-only access');
assert(auth.includes("value === '/agent/prepare/market' || value === '/agent/prepare/market-update' || value === '/agent/prepare/property'"), 'Agent return paths must remain exact and default-deny');
assert(middleware.includes('"/agent/prepare/market"') && middleware.includes('buildAgentLoginRedirect'), 'future market route must be middleware protected and use the Agent login flow exactly');
assert(proof.includes('Synthetic, local-only preparation proof'), 'existing proof harness must remain separate');
assert.equal(packageJson.scripts?.['check:agent-market-preparation-context-adapter'], 'jiti scripts/checkAgentMarketPreparationContextAdapter.ts');

console.log('AGENT_MARKET_PREPARATION_CONTEXT_ADAPTER_CHECK: PASS');
