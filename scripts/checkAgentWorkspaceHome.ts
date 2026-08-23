import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { NextRequest } from 'next/server';

import {
  AGENT_SESSION_COOKIE,
  authorizeAdminRequest,
  buildAgentLoginRedirect,
  createAgentSessionCookieValue,
  sanitizeAgentReturnPath,
} from '../lib/admin/adminAuth';
import { createAgentLoginSuccessResponse } from '../lib/admin/agentLoginReturn';

const credential = createHash('sha256').update('REIE_AGENT_WORKSPACE_HOME_CHECK').digest('base64url');
const capabilityRoutes = [
  '/agent/prepare/buyer',
  '/agent/prepare/seller',
  '/agent/prepare/listing',
  '/agent/prepare/place',
  '/agent/prepare/property',
  '/agent/prepare/market',
  '/agent/prepare/market-update',
] as const;

Object.assign(process.env, {
  NODE_ENV: 'production',
  REIE_ADMIN_API_KEY: 'deterministic-admin-key',
  REIE_AGENT_CREDENTIAL: credential,
  REIE_AGENT_SUBJECT: 'atlas-agent-workspace-home-check',
  REIE_AGENT_SUBJECT_STATUS: 'ACTIVE',
  REIE_AGENT_SESSION_VERSION: '1',
});

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

function request(path: string, cookie?: string) {
  return new NextRequest(`https://davidquinngroup.com${path}`, { headers: cookie ? { cookie } : undefined });
}

function location(response: Response) {
  return new URL(response.headers.get('location') || '', 'https://davidquinngroup.com').pathname;
}

async function main() {
  const page = source('app/agent/page.tsx');
  const titleHierarchy = source('components/ProjectAtlasTitleHierarchy.ts');
  const home = source('components/agent/AgentWorkspaceHome.tsx');
  const preparationHeader = source('components/agent/AgentPreparationPageHeader.tsx');
  const listingPreparation = source('components/agent/ListingPreparationExperience.tsx');
  const shell = source('components/agent/AgentWorkspaceShell.tsx');
  const publicNavigation = source('components/PublicNavigation.tsx');
  const middleware = source('middleware.ts');

  assert.match(page, /AgentWorkspaceHome/, 'The canonical /agent route must render the Workspace Home.');
  assert.match(home, /Choose what you want to prepare/, 'Workspace Home must state its Agent preparation purpose.');
  assert.match(home, /Preparation launcher/, 'Workspace Home must identify its capability-launcher role.');
  assert.match(titleHierarchy, /page: 'text-3xl font-semibold leading-tight text-white sm:text-4xl'/, 'The reusable page-title standard must preserve hierarchy above card titles.');
  assert.match(titleHierarchy, /section: 'text-\[22px\] font-semibold leading-7 text-white sm:text-2xl sm:leading-8'/, 'The reusable section-title standard must remain responsive and above capability titles.');
  assert.match(titleHierarchy, /capabilityCard: 'mt-5 text-xl font-semibold leading-7 text-white sm:mt-6 sm:text-\[22px\] sm:leading-7'/, 'The reusable capability-card title must remain prominent, responsive, and below the major section title.');
  assert.match(home, /projectAtlasTitleHierarchy\.capabilityCard/, 'Workspace capability titles must use the reusable title standard.');
  assert.match(home, /data-testid="agent-workspace-capability-title"/, 'Workspace capability titles must remain individually inspectable.');
  assert.match(preparationHeader, /projectAtlasTitleHierarchy\.page/, 'Buyer, Seller, Location, Property, and Market preparation headers must share the page-title standard.');
  assert.match(listingPreparation, /projectAtlasTitleHierarchy\.page/, 'Listing preparation must share the page-title standard.');
  for (const route of capabilityRoutes) assert.match(home, new RegExp(`href: '${route}'`), `${route} must be an immediate Workspace Home launcher.`);
  assert.match(home, /Location Preparation[\s\S]*geographic and local context/, 'Location Preparation must remain distinct geographic and local intelligence.');
  assert.match(home, /Property Preparation[\s\S]*property-specific diligence/, 'Property Preparation must remain distinct asset-specific intelligence.');
  assert.match(home, /Market Preparation[\s\S]*current inventory, pricing, days on market, competition, supply, demand/, 'Market Preparation must remain distinct current market intelligence.');
  assert.match(home, /Market Update Preparation[\s\S]*dated, evidence-aware market update/, 'Market Update Preparation must remain distinct from Market Preparation.');
  assert.match(home, /data-persistence="false"/, 'Workspace Home must remain session-only.');
  assert.doesNotMatch(home, /localStorage|sessionStorage|fetch\(|CRM|customer history|saved preparation|notification/i, 'Workspace Home must not introduce persistence, customer history, or background activity.');
  assert.match(shell, /href="\/agent"/, 'Agent capability navigation must include a Workspace Home return.');
  assert.match(publicNavigation, /label: 'Agent Workspace', href: '\/agent'/, 'Authenticated primary navigation must target Workspace Home.');
  assert.ok(middleware.indexOf('const privateConfiguration = getPrivateSiteAccessConfiguration();') < middleware.indexOf('const isAgentWorkspaceRoute'), 'Private Development Access must remain outside Agent Workspace authorization.');
  assert.match(middleware, /pathname === "\/agent"/, 'Middleware must exact-match the Agent Workspace Home route.');
  assert.doesNotMatch(middleware, /\/agent\/:path\*/, 'Middleware must not grant generic Agent authorization.');

  const session = await createAgentSessionCookieValue();
  const cookie = `${AGENT_SESSION_COOKIE}=${session}`;
  const allowed = await authorizeAdminRequest(request('/agent', cookie));
  assert.equal(allowed.authenticated, true, 'A valid Agent session must access Workspace Home.');
  if (allowed.authenticated) {
    assert.equal(allowed.role, 'AGENT');
    assert.equal(allowed.mechanism, 'HUMAN_AGENT_SESSION');
    assert.equal(allowed.canMutate, false);
  }
  assert.equal((await authorizeAdminRequest(request('/agent'))).authenticated, false, 'Workspace Home must require an Agent session.');
  assert.equal((await authorizeAdminRequest(request('/admin', cookie))).authenticated, false, 'Agent Workspace access must not grant Admin access.');
  const redirect = buildAgentLoginRedirect(request('/agent'));
  assert.equal(location(redirect), '/agent/login');
  assert.equal(new URL(redirect.headers.get('location') || '').searchParams.get('next'), '/agent');
  assert.equal(sanitizeAgentReturnPath(null), '/agent', 'Direct Agent login must default to Workspace Home.');
  assert.equal(sanitizeAgentReturnPath('/agent/prepare/property'), '/agent/prepare/property', 'Safe explicit Agent preparation returns must be preserved.');
  assert.equal(sanitizeAgentReturnPath('/admin'), '/agent', 'Unsafe Agent returns must fail closed to Workspace Home.');
  assert.equal(location(await createAgentLoginSuccessResponse('https://davidquinngroup.com', null)), '/agent', 'Successful direct Agent login must land on Workspace Home.');

  console.log('AGENT_WORKSPACE_HOME_CHECK: PASS');
}

main().catch((error) => {
  console.error('AGENT_WORKSPACE_HOME_CHECK: FAIL', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
