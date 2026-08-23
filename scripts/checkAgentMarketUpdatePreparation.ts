import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { NextRequest } from 'next/server';

import { AGENT_SESSION_COOKIE, authorizeAdminRequest, buildAgentLoginRedirect, createAgentSessionCookieValue, sanitizeAgentReturnPath } from '../lib/admin/adminAuth';
import { prepareAgentMarketUpdate } from '../lib/agent-advisory-workbench/marketUpdatePreparation';
import { MARKET_UPDATE_PREPARATION_FIXTURES } from '../lib/agent-advisory-workbench/marketUpdatePreparationFixtures';

const credential = createHash('sha256').update('REIE_AGENT_MARKET_UPDATE_PREPARATION_CHECK').digest('base64url');
Object.assign(process.env, {
  NODE_ENV: 'production',
  REIE_ADMIN_API_KEY: 'deterministic-admin-key',
  REIE_AGENT_CREDENTIAL: credential,
  REIE_AGENT_SUBJECT: 'atlas-agent-market-update-check',
  REIE_AGENT_SUBJECT_STATUS: 'ACTIVE',
  REIE_AGENT_SESSION_VERSION: '1',
});

const source = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
const request = (path: string, cookie?: string) => new NextRequest(`https://davidquinngroup.com${path}`, { headers: cookie ? { cookie } : undefined });

async function main() {
  const buyer = prepareAgentMarketUpdate(MARKET_UPDATE_PREPARATION_FIXTURES.buyerInventory);
  const seller = prepareAgentMarketUpdate(MARKET_UPDATE_PREPARATION_FIXTURES.sellerPrice);
  const missingTopic = prepareAgentMarketUpdate(MARKET_UPDATE_PREPARATION_FIXTURES.missingTopic);
  const stale = prepareAgentMarketUpdate(MARKET_UPDATE_PREPARATION_FIXTURES.stale);
  assert.equal(buyer.state, 'EVIDENCE_REVIEW_REQUIRED');
  assert.equal(buyer.observations.length, 1);
  assert.match(buyer.observations[0].label, /inventory/i);
  assert.match(buyer.optionalDraftLanguage?.text ?? '', /point-in-time reference/);
  assert.match(buyer.audienceContext.text, /negotiating leverage/i);
  assert.notEqual(buyer.audienceContext.text, seller.audienceContext.text, 'Audience selection must change the preparation context.');
  assert.equal(buyer.observations[0].directObservation.class, 'DIRECT_OBSERVATION');
  assert.match(buyer.observations[0].value, /reported inventory/i);
  assert.equal(seller.observations.length, 1);
  assert.match(seller.observations[0].label, /price signal \(semantics unresolved\)/i);
  assert.equal(missingTopic.state, 'NOT_READY');
  assert.equal(stale.state, 'NOT_READY');
  assert.deepEqual(buyer.boundaries, { sessionOnly: true, persistence: false, customerData: false, recipientSelection: false, communicationExecution: false, adminInheritance: false, providerActivity: false });

  const page = source('app/agent/prepare/market-update/page.tsx');
  const experience = source('components/agent/MarketUpdatePreparationExperience.tsx');
  const contract = source('lib/agent-advisory-workbench/marketUpdatePreparation.ts');
  const shell = source('components/agent/AgentWorkspaceShell.tsx');
  const home = source('components/agent/AgentWorkspaceHome.tsx');
  const adminNewsletter = source('app/admin/market-newsletter-package/page.tsx');
  const auth = source('lib/admin/adminAuth.ts');
  const middleware = source('middleware.ts');
  const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };

  assert.match(page, /MarketUpdatePreparationExperience/);
  for (const marker of ['Choose what to prepare', 'Executive market summary', 'Key market observations', 'What these measures help explain', 'What could change the interpretation', 'Talking points', 'Client-friendly explanations', 'Sources, as-of dates &amp; freshness', 'Verification checkpoints', 'Agent next actions', 'Draft market update language', 'data-testid="agent-market-update-prepare"', 'data-testid="agent-market-update-refresh"']) assert.match(experience, new RegExp(marker));
  assert.match(experience, /setPreparedInput/, 'Selections and output must remain on the same page.');
  assert.match(experience, /data-session-only="true"/);
  for (const forbidden of ['localStorage', 'sessionStorage', 'fetch(', 'PrismaClient', 'sendEmail', 'createMarketNewsletter', 'document.cookie', 'recipientEmail', 'customerName', 'CRM']) assert.equal(experience.includes(forbidden), false, `${forbidden} must not enter the Agent Market Update surface.`);
  assert.match(contract, /prepareMarketConversation/, 'Market Update must reuse admitted Market Preparation evidence.');
  assert.match(contract, /MARKET_UPDATE_NARRATIVE_CLASSES/);
  assert.match(contract, /not as a forecast/);
  assert.match(contract, /recipientSelection: false/);
  assert.match(contract, /communicationExecution: false/);
  assert.equal(adminNewsletter.includes('/agent/prepare/market-update'), false, 'Admin newsletter execution surfaces must remain separate.');
  assert.match(home, /Market Update Preparation[\s\S]*dated, evidence-aware market update/);
  assert.match(shell, /href="\/agent\/prepare\/market-update"/);
  assert.match(auth, /surface\('\/agent\/prepare\/market-update', 'BROWSER_ADMIN_PAGE', \['HUMAN_AGENT'\], \['AGENT'\], \['HUMAN_AGENT_SESSION'\], 'READ_ONLY', 'READ_ONLY_ADMIN', false\)/);
  assert.match(middleware, /pathname === "\/agent\/prepare\/market-update"/);
  assert.match(middleware, /"\/agent\/prepare\/market-update"/);
  assert.equal(packageJson.scripts?.['check:agent-market-update-preparation'], 'jiti scripts/checkAgentMarketUpdatePreparation.ts');

  const session = await createAgentSessionCookieValue();
  const cookie = `${AGENT_SESSION_COOKIE}=${session}`;
  const allowed = await authorizeAdminRequest(request('/agent/prepare/market-update', cookie));
  assert.equal(allowed.authenticated, true);
  if (allowed.authenticated) {
    assert.equal(allowed.role, 'AGENT');
    assert.equal(allowed.mechanism, 'HUMAN_AGENT_SESSION');
    assert.equal(allowed.canMutate, false);
  }
  assert.equal((await authorizeAdminRequest(request('/admin', cookie))).authenticated, false, 'Market Update must not grant generic Admin authority.');
  assert.equal(sanitizeAgentReturnPath('/agent/prepare/market-update'), '/agent/prepare/market-update');
  const redirect = buildAgentLoginRedirect(request('/agent/prepare/market-update'));
  assert.equal(new URL(redirect.headers.get('location') || '').searchParams.get('next'), '/agent/prepare/market-update');

  console.log('AGENT_MARKET_UPDATE_PREPARATION_CHECK: PASS');
}

main().catch((error) => {
  console.error('AGENT_MARKET_UPDATE_PREPARATION_CHECK: FAIL', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
