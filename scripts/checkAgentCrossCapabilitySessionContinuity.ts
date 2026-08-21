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
  getAgentSessionCookieOptions,
  sanitizeAgentReturnPath,
} from '../lib/admin/adminAuth';
import { createAgentLoginSuccessResponse } from '../lib/admin/agentLoginReturn';

const credential = createHash('sha256').update('REIE_AGENT_CROSS_CAPABILITY_SESSION_CONTINUITY_CHECK').digest('base64url');
const agentRoutes = ['/agent/prepare/market', '/agent/prepare/property', '/agent/prepare/place'] as const;

Object.assign(process.env, {
  NODE_ENV: 'production',
  REIE_ADMIN_API_KEY: 'deterministic-admin-key',
  REIE_ADMIN_SESSION_VERSION: '1',
  REIE_AGENT_CREDENTIAL: credential,
  REIE_AGENT_SUBJECT: 'atlas-human-agent-cross-capability-check',
  REIE_AGENT_SUBJECT_STATUS: 'ACTIVE',
  REIE_AGENT_SESSION_VERSION: '1',
});

function request(path: string, cookie?: string) {
  return new NextRequest(`https://davidquinngroup.com${path}`, {
    headers: cookie ? { cookie } : undefined,
  });
}

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

function location(response: Response) {
  return new URL(response.headers.get('location') || '', 'https://davidquinngroup.com').pathname;
}

async function assertAllowed(path: (typeof agentRoutes)[number], cookie: string) {
  const result = await authorizeAdminRequest(request(path, cookie));
  assert.equal(result.authenticated, true, `${path} must accept the same valid Agent session.`);
  if (result.authenticated) {
    assert.equal(result.identityType, 'HUMAN_AGENT');
    assert.equal(result.role, 'AGENT');
    assert.equal(result.mechanism, 'HUMAN_AGENT_SESSION');
    assert.equal(result.canMutate, false);
  }
}

async function main() {
  const cookieOptions = getAgentSessionCookieOptions(true);
  assert.deepEqual(cookieOptions, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60,
  }, 'Agent session scope and security attributes must remain unchanged.');

  const session = await createAgentSessionCookieValue();
  const cookie = `${AGENT_SESSION_COOKIE}=${session}`;

  await assertAllowed('/agent/prepare/market', cookie);
  await assertAllowed('/agent/prepare/property', cookie);
  await assertAllowed('/agent/prepare/place', cookie);
  await assertAllowed('/agent/prepare/market', cookie);
  await assertAllowed('/agent/prepare/property', cookie);
  await assertAllowed('/agent/prepare/place', cookie);

  for (const path of ['/agent/unknown', '/admin', '/admin/repository', '/api/admin/enterprise/operational-kpis', '/api/process-alerts']) {
    const result = await authorizeAdminRequest(request(path, cookie), { method: path === '/api/process-alerts' ? 'POST' : 'GET' });
    assert.equal(result.authenticated, false, `A valid Agent session must not gain ${path} access.`);
  }

  for (const path of agentRoutes) {
    const signedOutRedirect = buildAgentLoginRedirect(request(path));
    assert.equal(signedOutRedirect.status, 303, `${path} must retain its signed-out login redirect.`);
    assert.equal(location(signedOutRedirect), '/agent/login');
    assert.equal(new URL(signedOutRedirect.headers.get('location') || '').searchParams.get('next'), path);
    assert.equal(signedOutRedirect.headers.get('cache-control'), 'private, no-store');
    assert.equal(signedOutRedirect.headers.get('x-middleware-cache'), 'no-cache');
  }

  const loginResponse = await createAgentLoginSuccessResponse('https://davidquinngroup.com', '/agent/prepare/place');
  const setCookie = loginResponse.headers.get('set-cookie') || '';
  assert.match(setCookie, new RegExp(`^${AGENT_SESSION_COOKIE}=`), 'Agent login must issue the Agent session cookie.');
  for (const attribute of ['path=/', 'max-age=28800', 'httponly', 'secure', 'samesite=lax']) {
    assert.ok(setCookie.toLowerCase().includes(attribute), `Agent login must retain ${attribute}.`);
  }
  assert.equal(sanitizeAgentReturnPath('/admin/agent-briefing-preparation'), '/agent/prepare/market', 'The proof harness must remain excluded from Agent returns.');

  const middleware = source('middleware.ts');
  const shell = source('components/agent/AgentWorkspaceShell.tsx');
  assert.match(middleware, /pathname === "\/agent\/prepare\/market" \|\| pathname === "\/agent\/prepare\/property" \|\| pathname === "\/agent\/prepare\/place"/, 'Middleware must enumerate only the exact Agent capabilities.');
  assert.match(middleware, /Cache-Control', 'private, no-store'/, 'Authenticated Agent route responses must be private and non-storable.');
  assert.match(middleware, /x-middleware-cache', 'no-cache'/, 'Middleware results must not persist in the client router cache.');
  assert.match(shell, /href="\/agent\/prepare\/property" prefetch=\{false\}/, 'Property navigation must avoid speculative protected-route prefetching.');
  assert.match(shell, /href="\/agent\/prepare\/market" prefetch=\{false\}/, 'Market navigation must avoid speculative protected-route prefetching.');
  assert.match(shell, /href="\/agent\/prepare\/place" prefetch=\{false\}/, 'Place navigation must avoid speculative protected-route prefetching.');
  assert.doesNotMatch(middleware, /\/agent\/:path\*/, 'Middleware must not create generic Agent authorization.');

  console.log('AGENT_CROSS_CAPABILITY_SESSION_CONTINUITY_CHECK: PASS');
}

main().catch((error) => {
  console.error('AGENT_CROSS_CAPABILITY_SESSION_CONTINUITY_CHECK: FAIL', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
