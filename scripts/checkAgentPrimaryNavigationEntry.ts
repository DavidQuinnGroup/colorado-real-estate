import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { createAgentSessionCookieValue } from '../lib/admin/adminAuth';
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
  assert.match(publicNavigation, /label: 'Agent Workspace', href: '\/agent\/prepare\/market'/, 'Signed-in navigation must expose the canonical Agent Workspace route.');
  assert.match(publicNavigation, /fetch\('\/api\/agent\/session', \{ cache: 'no-store', credentials: 'same-origin' \}\)/, 'Navigation must resolve Agent state from the same-origin server session.');
  assert.match(publicNavigation, /reie-public-desktop-navigation-links[\s\S]*agentNavigationEntry/, 'Desktop navigation must include the Agent entry.');
  assert.match(publicNavigation, /reie-public-mobile-navigation[\s\S]*agentNavigationEntry/, 'Mobile navigation must include the Agent entry.');
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

  assert.match(agentLogin, /sanitizeAgentReturnPath/, 'Agent Login must retain safe canonical return-path handling.');
  assert.match(agentLogout, /AGENT_SESSION_COOKIE/, 'Agent sign-out must continue to clear the Agent session.');
  assert.ok(middleware.indexOf('const privateConfiguration = getPrivateSiteAccessConfiguration();') < middleware.indexOf('const isAgentPreparationRoute'), 'Private Development Access must remain outside Agent authorization.');
  assert.match(middleware, /buildAgentLoginRedirect/, 'Agent authorization must remain separate from navigation visibility.');

  console.log('AGENT_PRIMARY_NAVIGATION_ENTRY_CHECK: PASS');
}

main().catch((error) => {
  console.error('AGENT_PRIMARY_NAVIGATION_ENTRY_CHECK: FAIL', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
