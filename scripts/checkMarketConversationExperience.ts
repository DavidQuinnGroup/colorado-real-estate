import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { prepareMarketConversation } from '../lib/agent-advisory-workbench/marketConversationExperience';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
const page = read('app/agent/prepare/market/page.tsx');
const layout = read('app/agent/prepare/market/layout.tsx');
const experience = read('components/agent/MarketConversationExperience.tsx');
const coordinator = read('lib/agent-advisory-workbench/marketConversationExperience.ts');
const auth = read('lib/admin/adminAuth.ts');
const middleware = read('middleware.ts');
const proof = read('components/AgentConversationPreparationCompositionProof.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };

const result = prepareMarketConversation('boulder-co-housing-market', '2026-08-20');
assert.equal(result.producer.state, 'CERTIFIED');
assert.equal(result.admission?.state, 'PROFESSIONAL_REVIEW_REQUIRED');
assert.equal(result.briefing?.whatMatters.length, 3);
assert.equal(prepareMarketConversation('niwot-co-housing-market', '2026-08-20').briefing, null);
assert.equal(prepareMarketConversation('boulder-co-housing-market', '2026-08-30').briefing, null);

for (const market of ['Boulder', 'Louisville', 'Lafayette', 'Superior', 'Erie', 'Longmont']) assert(experience.includes(`label: '${market}'`), `missing certified market ${market}`);
for (const unsupported of ['Niwot', 'Gunbarrel', 'Table Mesa', 'Denver']) assert.equal(experience.includes(`label: '${unsupported}'`), false, `unsupported market ${unsupported} must not be selectable`);
for (const marker of ['Prepare my briefing', '30-second briefing', 'What matters', 'What needs verification', 'Questions to prepare', 'Professional handoff', 'Sources &amp; limitations', 'Choose a supported market, then prepare your briefing.', 'data-testid="agent-market-sources-limitations"']) assert(experience.includes(marker), `missing product marker ${marker}`);
for (const forbidden of ['AGENT_MARKET_PREPARATION_CONTEXT_FIXTURES', 'Synthetic fixture', 'localStorage', 'sessionStorage', 'document.cookie', 'fetch(', 'PrismaClient', 'CRM', 'customerName', 'marketHealthScore', 'recommendation: true', 'ranking: true', 'MCP', 'MasterControlPanel']) assert.equal(experience.includes(forbidden), false, `experience must not reference ${forbidden}`);
for (const required of ['produceRealMarketPreparationContext', 'admitAgentMarketPreparationContext', 'buildAgentMarketHumanBriefing']) assert(coordinator.includes(required), `coordinator must use ${required}`);
assert(page.includes('MarketConversationExperience'));
assert(layout.includes('fixed inset-0 z-50'));
assert(auth.includes("surface('/agent/prepare/market', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false)"));
assert(middleware.includes('"/agent/prepare/market"') && middleware.includes('buildAgentLoginRedirect'));
assert(proof.includes('Synthetic, local-only preparation proof'));
assert.equal(packageJson.scripts?.['check:market-conversation-experience'], 'jiti scripts/checkMarketConversationExperience.ts');
console.log('MARKET_CONVERSATION_EXPERIENCE_CHECK: PASS');
