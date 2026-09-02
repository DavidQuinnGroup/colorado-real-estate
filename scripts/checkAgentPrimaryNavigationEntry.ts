import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { NextRequest } from 'next/server';

import { buildAgentLoginRedirect, createAgentSessionCookieValue } from '../lib/admin/adminAuth';
import { createAgentLoginSuccessResponse } from '../lib/admin/agentLoginReturn';
import { getAgentNavigationSessionState } from '../lib/admin/agentNavigationSession';

const deterministicAgentCredential = createHash('sha256').update('REIE_AGENT_PRIMARY_NAVIGATION_ENTRY_CHECK').digest('base64url');

Object.assign(process.env, {
  NODE_ENV: 'production',
  REIE_AGENT_CREDENTIAL: deterministicAgentCredential,
  REIE_AGENT_SUBJECT: 'atlas-agent-navigation-check',
  REIE_AGENT_SUBJECT_STATUS: 'ACTIVE',
  REIE_AGENT_SESSION_VERSION: '1',
});

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

async function main() {
  const publicNavigation = source('components/PublicNavigation.tsx');
  const agentSessionRoute = source('app/api/agent/session/route.ts');
  const middleware = source('middleware.ts');
  const agentLogin = source('app/agent/login/page.tsx');
  const agentLogout = source('app/agent/logout/route.ts');

  assert.match(publicNavigation, /label: 'Agent Login', href: '\/agent\/login'/, 'Signed-out navigation must expose the canonical Agent Login route.');
  assert.match(publicNavigation, /label: 'Agent Workspace', href: '\/agent'/, 'Signed-in navigation must expose the canonical Agent Workspace Home route.');
  assert.match(publicNavigation, /fetch\('\/api\/agent\/session', \{ cache: 'no-store', credentials: 'same-origin' \}\)/, 'Navigation must resolve Agent state from the same-origin server session.');
  assert.match(publicNavigation, /import \{ LogIn \} from 'lucide-react'/, 'The persistent Agent entry must use a familiar sign-in icon.');
  assert.match(publicNavigation, /data-testid="reie-public-navigation-actions"[\s\S]*data-testid="reie-public-navigation-agent-entry"[\s\S]*data-testid="reie-public-navigation-primary-action"/, 'Agent Login must remain a persistent secondary control immediately beside the unchanged primary Search Homes action.');
  assert.match(publicNavigation, /href=\{agentNavigationEntry\.href\}[\s\S]*data-testid="reie-public-navigation-agent-entry"/, 'The persistent Agent entry must use the existing signed-in or signed-out destination.');
  assert.doesNotMatch(publicNavigation, /\[\.\.\.publicNavigationLinks, agentNavigationEntry\]/, 'Agent Login must not be hidden in desktop-only or collapsed navigation collections.');
  assert.match(publicNavigation, /data-reie-agent-navigation-state/, 'Agent navigation state must remain inspectable without exposing credential data.');
  assert.match(publicNavigation, /pathname\?\.startsWith\('\/admin'\)/, 'Public navigation must remain absent from the Admin route tree.');
  assert.doesNotMatch(publicNavigation, /ADMIN_SESSION_COOKIE|localStorage|sessionStorage/, 'Public navigation must not expose Admin session state or client-side session storage.');

  const signedOut = await getAgentNavigationSessionState(undefined);
  assert.deepEqual(signedOut, { authenticated: false }, 'Signed-out status must not grant Agent access.');
  assert.match(agentSessionRoute, /'Cache-Control': 'private, no-store'/, 'Agent status must remain private and non-cacheable.');
  assert.match(agentSessionRoute, /Vary: 'Cookie'/, 'Agent status must vary by the signed session cookie.');

  const session = await createAgentSessionCookieValue();
  const signedIn = await getAgentNavigationSessionState(session);
  assert.deepEqual(signedIn, { authenticated: true }, 'Only a valid signed Agent session may show Agent Workspace.');

  const unauthenticatedRedirect = buildAgentLoginRedirect(new NextRequest('https://davidquinngroup.com/agent'));
  assert.equal(unauthenticatedRedirect.status, 303, 'An unauthenticated Agent Workspace visit must use the existing login redirect.');
  assert.equal(unauthenticatedRedirect.headers.get('location'), 'https://davidquinngroup.com/agent/login?next=%2Fagent', 'The Agent Login control must preserve the canonical Workspace Home return path.');
  const authenticatedRedirect = await createAgentLoginSuccessResponse('https://davidquinngroup.com', '/agent');
  assert.equal(authenticatedRedirect.status, 303, 'Successful Agent authentication must redirect to Workspace Home.');
  assert.equal(authenticatedRedirect.headers.get('location'), 'https://davidquinngroup.com/agent', 'The authenticated Agent entry must resolve to Workspace Home.');

  assert.match(agentLogin, /sanitizeAgentReturnPath/, 'Agent Login must retain safe canonical return-path handling.');
  assert.match(agentLogout, /AGENT_SESSION_COOKIE/, 'Agent sign-out must continue to clear the Agent session.');
  assert.ok(middleware.indexOf('const privateConfiguration = getPrivateSiteAccessConfiguration();') < middleware.indexOf('const isAgentWorkspaceRoute'), 'Private Development Access must remain outside Agent authorization.');
  assert.match(middleware, /buildAgentLoginRedirect/, 'Agent authorization must remain separate from navigation visibility.');

  console.log('AGENT_PRIMARY_NAVIGATION_ENTRY_CHECK: PASS');
}

main().catch((error) => {
  console.error('AGENT_PRIMARY_NAVIGATION_ENTRY_CHECK: FAIL', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
