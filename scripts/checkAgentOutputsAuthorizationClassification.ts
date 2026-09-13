import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { NextRequest } from 'next/server';

import {
  AGENT_SESSION_COOKIE,
  authorizeAdminRequest,
  buildAgentLoginRedirect,
  classifyAdminSurface,
  createAgentSessionCookieValue,
} from '../lib/admin/adminAuth';
import { createAgentLoginSuccessResponse } from '../lib/admin/agentLoginReturn';

const credential = createHash('sha256').update('REIE_AGENT_OUTPUTS_AUTHORIZATION_CLASSIFICATION_CHECK').digest('base64url');

Object.assign(process.env, {
  NODE_ENV: 'production',
  REIE_ADMIN_API_KEY: 'deterministic-admin-key',
  REIE_ADMIN_SESSION_VERSION: '1',
  REIE_AGENT_CREDENTIAL: credential,
  REIE_AGENT_SUBJECT: 'atlas-agent-outputs-authorization-check',
  REIE_AGENT_SUBJECT_STATUS: 'ACTIVE',
  REIE_AGENT_SESSION_VERSION: '1',
});

function request(path: string, cookie?: string) {
  return new NextRequest(`https://davidquinngroup.com${path}`, { headers: cookie ? { cookie } : undefined });
}

function location(response: Response) {
  return new URL(response.headers.get('location') || '', 'https://davidquinngroup.com');
}

async function assertAgentBrowserAccess(path: string, cookie: string, expectedRoutePattern: string) {
  const result = await authorizeAdminRequest(request(path, cookie));
  assert.equal(result.authenticated, true, `${path} must accept a valid Agent session.`);
  if (result.authenticated) {
    assert.equal(result.identityType, 'HUMAN_AGENT');
    assert.equal(result.role, 'AGENT');
    assert.equal(result.mechanism, 'HUMAN_AGENT_SESSION');
    assert.equal(result.canMutate, false);
    assert.equal(result.surface.routePattern, expectedRoutePattern);
    assert.equal(result.surface.surfaceType, 'BROWSER_ADMIN_PAGE');
  }
}

async function main() {
  const outputsSurface = classifyAdminSurface('/agent/outputs');
  assert.deepEqual(outputsSurface, {
    routePattern: '/agent/outputs',
    surfaceType: 'BROWSER_ADMIN_PAGE',
    acceptedIdentityTypes: ['HUMAN_AGENT'],
    requiredRoles: ['AGENT'],
    allowedMechanisms: ['HUMAN_AGENT_SESSION'],
    mutationPosture: 'READ_ONLY',
    auditClassification: 'READ_ONLY_ADMIN',
    csrfProtectionRequired: false,
  }, 'Outputs must retain the exact Agent browser authorization surface.');

  const session = await createAgentSessionCookieValue();
  const cookie = `${AGENT_SESSION_COOKIE}=${session}`;
  await assertAgentBrowserAccess('/agent/outputs', cookie, '/agent/outputs');
  await assertAgentBrowserAccess('/agent/clients', cookie, '/agent/clients');
  await assertAgentBrowserAccess('/agent/strategy', cookie, '/agent/strategy');

  const signedOutRedirect = buildAgentLoginRedirect(request('/agent/outputs'));
  assert.equal(signedOutRedirect.status, 303);
  assert.equal(location(signedOutRedirect).pathname, '/agent/login');
  assert.equal(location(signedOutRedirect).searchParams.get('next'), '/agent/outputs');

  const loginResponse = await createAgentLoginSuccessResponse('https://davidquinngroup.com', '/agent/outputs');
  assert.equal(loginResponse.status, 303);
  assert.equal(location(loginResponse).pathname, '/agent/outputs');
  const setCookie = loginResponse.headers.get('set-cookie') || '';
  const issuedSession = setCookie.match(new RegExp(`^${AGENT_SESSION_COOKIE}=([^;]+)`))?.[1];
  assert.ok(issuedSession, 'Successful Agent login must issue an Agent session for Outputs.');
  await assertAgentBrowserAccess('/agent/outputs', `${AGENT_SESSION_COOKIE}=${issuedSession}`, '/agent/outputs');

  const outputApiSurface = classifyAdminSurface('/api/agent/outputs');
  assert.equal(outputApiSurface.surfaceType, 'MUTATING_ADMIN_API');
  assert.deepEqual(outputApiSurface.acceptedIdentityTypes, ['HUMAN_AGENT']);
  assert.deepEqual(outputApiSurface.requiredRoles, ['AGENT']);
  assert.deepEqual(outputApiSurface.allowedMechanisms, ['HUMAN_AGENT_SESSION']);
  assert.equal((await authorizeAdminRequest(request('/api/agent/outputs'))).authenticated, false, 'Anonymous Outputs API access must remain denied.');
  assert.equal((await authorizeAdminRequest(request('/api/agent/outputs', cookie))).authenticated, true, 'A valid Agent session must retain Outputs API eligibility.');

  const unknownSurface = classifyAdminSurface('/agent/unknown');
  assert.deepEqual(unknownSurface.acceptedIdentityTypes, []);
  assert.equal((await authorizeAdminRequest(request('/agent/unknown', cookie))).authenticated, false, 'Unknown Agent routes must remain fail closed.');

  const authSource = readFileSync('lib/admin/adminAuth.ts', 'utf8');
  const middlewareSource = readFileSync('middleware.ts', 'utf8');
  assert.match(authSource, /surface\('\/agent\/outputs', 'BROWSER_ADMIN_PAGE', \['HUMAN_AGENT'\], \['AGENT'\], \['HUMAN_AGENT_SESSION'\], 'READ_ONLY', 'READ_ONLY_ADMIN', false\)/);
  assert.match(authSource, /surface\('\/api\/agent\/outputs', 'MUTATING_ADMIN_API', \['HUMAN_AGENT'\], \['AGENT'\], \['HUMAN_AGENT_SESSION'\], 'MUTATION_CAPABLE', 'MUTATING_ADMIN', true\)/);
  assert.match(middlewareSource, /pathname === "\/api\/agent\/outputs"/);

  console.log('AGENT_OUTPUTS_AUTHORIZATION_CLASSIFICATION_CHECK: PASS');
}

main().catch((error) => {
  console.error('AGENT_OUTPUTS_AUTHORIZATION_CLASSIFICATION_CHECK: FAIL', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
