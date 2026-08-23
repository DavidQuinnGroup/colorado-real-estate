import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { NextRequest } from 'next/server';

import {
  AGENT_SESSION_COOKIE,
  authorizeAdminRequest,
  createAgentSessionCookieValue,
  getAgentSessionCookieOptions,
} from '../lib/admin/adminAuth';
import { getAgentNavigationSessionState } from '../lib/admin/agentNavigationSession';

const credential = createHash('sha256').update('REIE_AGENT_PUBLIC_RETURN_NAVIGATION_CHECK').digest('base64url');
const agentRoutes = [
  '/agent',
  '/agent/prepare/buyer',
  '/agent/prepare/seller',
  '/agent/prepare/listing',
  '/agent/prepare/place',
  '/agent/prepare/property',
  '/agent/prepare/market',
] as const;

Object.assign(process.env, {
  NODE_ENV: 'production',
  REIE_AGENT_CREDENTIAL: credential,
  REIE_AGENT_SUBJECT: 'atlas-agent-public-return-navigation-check',
  REIE_AGENT_SUBJECT_STATUS: 'ACTIVE',
  REIE_AGENT_SESSION_VERSION: '1',
});

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

function request(path: string, cookie?: string) {
  return new NextRequest(`https://davidquinngroup.com${path}`, { headers: cookie ? { cookie } : undefined });
}

async function assertAgentAccess(path: (typeof agentRoutes)[number], cookie: string) {
  const result = await authorizeAdminRequest(request(path, cookie));
  assert.equal(result.authenticated, true, `${path} must preserve the existing Agent session.`);
  if (result.authenticated) {
    assert.equal(result.role, 'AGENT');
    assert.equal(result.mechanism, 'HUMAN_AGENT_SESSION');
    assert.equal(result.canMutate, false);
  }
}

async function main() {
  const layout = source('app/agent/layout.tsx');
  const shell = source('components/agent/AgentWorkspaceShell.tsx');
  const middleware = source('middleware.ts');

  assert.match(layout, /<AgentWorkspaceShell>\{children\}<\/AgentWorkspaceShell>/, 'The shared Agent shell must cover every Agent route.');
  assert.match(shell, /<Link href="\/" prefetch=\{false\}[\s\S]*data-testid="agent-workspace-public-site-link"/, 'The shared Agent shell must expose a non-prefetched same-origin Public Site return link.');
  assert.match(shell, /<Globe2[^>]*aria-hidden="true"[^>]*\/>[\s\S]*Public Site/, 'Public Site must have an accessible visible label and familiar navigation icon.');
  assert.ok(shell.indexOf('agent-workspace-home-control') < shell.indexOf('agent-workspace-public-site-link'), 'Workspace Home must precede Public Site in the Agent control hierarchy.');
  assert.ok(shell.indexOf('agent-workspace-public-site-link') < shell.indexOf('agent-workspace-sign-out'), 'Public Site must precede Sign out in the Agent control hierarchy.');
  assert.match(shell, /import Link from 'next\/link'/, 'Public Site must use the repository-supported same-origin navigation primitive.');
  assert.ok(middleware.indexOf('const privateConfiguration = getPrivateSiteAccessConfiguration();') < middleware.indexOf('const isAgentWorkspaceRoute'), 'Private Development Access must remain outside Agent authorization.');

  assert.deepEqual(getAgentSessionCookieOptions(true), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60,
  }, 'The Agent session must remain root-scoped for same-origin public-side navigation.');

  const session = await createAgentSessionCookieValue();
  const cookie = `${AGENT_SESSION_COOKIE}=${session}`;
  assert.deepEqual(await getAgentNavigationSessionState(session), { authenticated: true }, 'The Agent session must be recognized before public-side navigation.');
  for (const route of agentRoutes) await assertAgentAccess(route, cookie);
  assert.deepEqual(await getAgentNavigationSessionState(session), { authenticated: true }, 'Public Site navigation must not alter the Agent session value.');
  for (const route of agentRoutes) await assertAgentAccess(route, cookie);

  const admin = await authorizeAdminRequest(request('/admin', cookie));
  assert.equal(admin.authenticated, false, 'Public Site navigation must not grant Admin access to an Agent session.');

  console.log('AGENT_PUBLIC_RETURN_NAVIGATION_CHECK: PASS');
}

main().catch((error) => {
  console.error('AGENT_PUBLIC_RETURN_NAVIGATION_CHECK: FAIL', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
