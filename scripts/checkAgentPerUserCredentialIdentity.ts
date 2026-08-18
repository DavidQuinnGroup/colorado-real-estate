import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

import type { NextRequest } from 'next/server';

import {
  ADMIN_SESSION_COOKIE,
  AGENT_SESSION_COOKIE,
  authorizeAdminRequest,
  createAdminSessionCookieValue,
  createAgentSessionCookieValue,
  resolveAgentRole,
  validateAgentCredentialSubmission,
  validateAgentSessionCookieValue,
} from '../lib/admin/adminAuth.js';

const deterministicAgentCredential = createHash('sha256').update('REIE_AGENT_PER_USER_CREDENTIAL_IDENTITY_CHECK').digest('base64url');

Object.assign(process.env, {
  NODE_ENV: 'production',
  REIE_ADMIN_API_KEY: 'deterministic-admin-key',
  REIE_ADMIN_SESSION_VERSION: '1',
  REIE_AGENT_CREDENTIAL: deterministicAgentCredential,
  REIE_AGENT_SUBJECT: 'atlas-human-agent-001',
  REIE_AGENT_SUBJECT_STATUS: 'ACTIVE',
  REIE_AGENT_SESSION_VERSION: '1',
});

function request(path: string, headers: Record<string, string> = {}) {
  const url = new URL(`https://davidquinngroup.com${path}`);
  const requestHeaders = new Headers(headers);
  return {
    headers: requestHeaders,
    method: 'GET',
    nextUrl: url,
    cookies: {
      get(name: string) {
        const cookie = (requestHeaders.get('cookie') || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
        return cookie ? { name, value: cookie.slice(name.length + 1) } : undefined;
      },
    },
  } as NextRequest;
}

async function main() {
  const agentSession = await createAgentSessionCookieValue();
  const agentCookie = `${AGENT_SESSION_COOKIE}=${agentSession}`;
  const validAgent = await validateAgentSessionCookieValue(agentSession);
  assert.equal(validAgent.valid, true, 'The active individual subject must produce a valid signed agent session.');
  if (validAgent.valid) {
    assert.equal(validAgent.payload.identityType, 'HUMAN_AGENT');
    assert.equal(validAgent.payload.role, 'AGENT');
    assert.equal(validAgent.payload.subject, 'atlas-human-agent-001');
    assert.equal(validAgent.payload.issuer, 'PER_USER_CREDENTIAL');
  }

  assert.equal(await validateAgentCredentialSubmission(deterministicAgentCredential), true);
  assert.equal(await validateAgentCredentialSubmission('wrong-credential'), false);
  assert.equal(resolveAgentRole({ issuer: 'PER_USER_CREDENTIAL', subject: 'atlas-human-agent-001' }), 'AGENT');
  assert.equal(resolveAgentRole({ issuer: 'EXTERNAL_IDP', subject: 'atlas-human-agent-001' }), 'AGENT', 'Issuer replacement must preserve internal role semantics.');

  const permitted = await authorizeAdminRequest(request('/admin/agent-briefing-preparation', { cookie: agentCookie }));
  assert.equal(permitted.authenticated, true, 'Agent access must be limited to the exact preparation route.');
  if (permitted.authenticated) {
    assert.equal(permitted.identityType, 'HUMAN_AGENT');
    assert.equal(permitted.role, 'AGENT');
    assert.equal(permitted.canMutate, false);
  }

  for (const path of ['/admin', '/admin/repository', '/admin/repository/executive-operations-dashboard', '/api/admin/enterprise/operational-kpis', '/api/property-inquiry', '/api/process-alerts']) {
    const denied = await authorizeAdminRequest(request(path, { cookie: agentCookie }), { method: path === '/api/process-alerts' ? 'POST' : 'GET' });
    assert.equal(denied.authenticated, false, `Agent session must not access ${path}.`);
  }

  const clientSpoof = await authorizeAdminRequest(request('/admin/agent-briefing-preparation', { 'x-reie-admin-role': 'AGENT' }));
  assert.equal(clientSpoof.authenticated, false, 'Client-supplied role headers must not authenticate a request.');
  const forged = `${agentSession.slice(0, -1)}x`;
  assert.equal((await validateAgentSessionCookieValue(forged)).valid, false, 'Forged agent sessions must fail closed.');

  process.env.REIE_AGENT_SUBJECT = 'different-subject';
  assert.equal((await validateAgentSessionCookieValue(agentSession)).valid, false, 'Unknown subjects must fail closed.');
  process.env.REIE_AGENT_SUBJECT = 'atlas-human-agent-001';
  process.env.REIE_AGENT_SUBJECT_STATUS = 'DISABLED';
  assert.equal((await validateAgentSessionCookieValue(agentSession)).valid, false, 'Disabled allowlist mappings must fail closed.');
  process.env.REIE_AGENT_SUBJECT_STATUS = 'ACTIVE';

  const adminSession = await createAdminSessionCookieValue();
  const admin = await authorizeAdminRequest(request('/admin/repository/executive-operations-dashboard', { cookie: `${ADMIN_SESSION_COOKIE}=${adminSession}` }));
  assert.equal(admin.authenticated, true, 'Existing human admin sessions must remain valid.');

  const [authSource, agentRoute, agentLogin] = await Promise.all([
    readFile('lib/admin/adminAuth.ts', 'utf8'),
    readFile('app/agent-auth/login/route.ts', 'utf8'),
    readFile('app/agent/login/page.tsx', 'utf8'),
  ]);
  assert.doesNotMatch(authSource, /AGENT_PASSWORD|TEAM_PASSWORD|SHARED_AGENT/, 'Shared agent credential models must not be implemented.');
  assert.match(authSource, /REIE_AGENT_SUBJECT_STATUS !== 'ACTIVE'/, 'Allowlist revocation must be explicit and fail closed.');
  assert.match(authSource, /HUMAN_AGENT_SESSION/, 'Agent sessions must have a distinct authentication mechanism.');
  assert.doesNotMatch(agentRoute, /console\.(log|error).*agentCredential|agentCredential.*console/, 'Agent credentials must not be logged.');
  assert.doesNotMatch(agentLogin, /name=["'](?:role|adminRole|agentRole)["']/, 'The browser must not submit or select a role.');

  console.log('[agent-per-user-credential-identity] ok: individual credential, stable subject, server allowlist, exact read-only route, revocation, no admin inheritance, and issuer migration seam verified.');
}

main().catch((error) => {
  console.error('[agent-per-user-credential-identity] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
