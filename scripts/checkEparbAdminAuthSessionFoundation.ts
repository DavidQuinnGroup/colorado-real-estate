import assert from 'node:assert/strict';

import type { NextRequest } from 'next/server';

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  adminProtectedSurfaceClassifications,
  authorizeAdminRequest,
  classifyAdminSurface,
  createAdminSessionCookieValue,
  getAdminSessionCookieOptions,
  getExpiredAdminSessionCookieOptions,
  sanitizeAdminReturnPath,
  validateAdminCredentialSubmission,
  validateAdminSessionCookieValue,
} from '../lib/admin/adminAuth.js';

process.env.REIE_ADMIN_API_KEY = 'deterministic-admin-key';
process.env.REIE_ADMIN_SESSION_VERSION = '1';
Object.assign(process.env, { NODE_ENV: 'production' });

function request(path: string, headers: Record<string, string> = {}) {
  const url = new URL(`https://davidquinngroup.com${path}`);
  const requestHeaders = new Headers(headers);
  return {
    headers: requestHeaders,
    method: 'GET',
    nextUrl: url,
    cookies: {
      get(name: string) {
        const cookieHeader = requestHeaders.get('cookie') || '';
        const cookie = cookieHeader
          .split(';')
          .map((part) => part.trim())
          .find((part) => part.startsWith(`${name}=`));
        if (!cookie) return undefined;
        return { name, value: cookie.slice(name.length + 1) };
      },
    },
  } as NextRequest;
}

async function assertSessionSecurity() {
  const nowMs = Date.now();
  const session = await createAdminSessionCookieValue({ nowMs });
  const valid = await validateAdminSessionCookieValue(session, { nowMs: nowMs + 1000 });

  assert.equal(valid.valid, true, 'Valid signed human admin session must validate.');
  if (valid.valid) {
    assert.equal(valid.payload.identityType, 'HUMAN_ADMIN');
    assert.equal(valid.payload.role, 'REPOSITORY_ADMIN');
    assert.equal(valid.payload.sessionVersion, '1');
    assert.equal(valid.payload.expiresAt - valid.payload.issuedAt, ADMIN_SESSION_MAX_AGE_SECONDS);
  }

  const forged = `${session.slice(0, -1)}x`;
  assert.equal((await validateAdminSessionCookieValue(forged, { nowMs })).valid, false, 'Forged sessions must fail.');

  const expired = await createAdminSessionCookieValue({ nowMs: nowMs - (ADMIN_SESSION_MAX_AGE_SECONDS + 60) * 1000 });
  const expiredResult = await validateAdminSessionCookieValue(expired, { nowMs });
  assert.equal(expiredResult.valid, false, 'Expired sessions must fail.');
  if (!expiredResult.valid) assert.equal(expiredResult.reason, 'EXPIRED_SESSION');

  const oldVersion = await createAdminSessionCookieValue({ nowMs, sessionVersion: 'old' });
  const revokedResult = await validateAdminSessionCookieValue(oldVersion, { nowMs, sessionVersion: '1' });
  assert.equal(revokedResult.valid, false, 'Version-mismatched sessions must fail.');
  if (!revokedResult.valid) assert.equal(revokedResult.reason, 'REVOKED_SESSION');
}

function assertCookieSecurity() {
  const productionCookie = getAdminSessionCookieOptions(true);
  assert.equal(productionCookie.httpOnly, true);
  assert.equal(productionCookie.secure, true);
  assert.equal(productionCookie.sameSite, 'lax');
  assert.equal(productionCookie.path, '/');
  assert.equal(productionCookie.maxAge, ADMIN_SESSION_MAX_AGE_SECONDS);

  const developmentCookie = getAdminSessionCookieOptions(false);
  assert.equal(developmentCookie.httpOnly, true);
  assert.equal(developmentCookie.secure, false);
  assert.equal(developmentCookie.sameSite, 'lax');

  const expiredCookie = getExpiredAdminSessionCookieOptions(true);
  assert.equal(expiredCookie.httpOnly, true);
  assert.equal(expiredCookie.secure, true);
  assert.equal(expiredCookie.maxAge, 0);
  assert.ok(expiredCookie.expires instanceof Date);
}

function assertReturnPathSafety() {
  assert.equal(sanitizeAdminReturnPath('/admin/repository'), '/admin/repository');
  assert.equal(sanitizeAdminReturnPath('/admin/repository/executive-operations-dashboard'), '/admin/repository/executive-operations-dashboard');
  assert.equal(sanitizeAdminReturnPath('https://evil.example/admin'), '/admin');
  assert.equal(sanitizeAdminReturnPath('//evil.example/admin'), '/admin');
  assert.equal(sanitizeAdminReturnPath('/api/admin/enterprise/operational-kpis'), '/admin');
  assert.equal(sanitizeAdminReturnPath('/admin-auth/login'), '/admin');
  assert.equal(sanitizeAdminReturnPath('/admin\\evil'), '/admin');
}

async function assertAuthorizationBehavior() {
  const session = await createAdminSessionCookieValue();
  const sessionCookie = `${ADMIN_SESSION_COOKIE}=${session}`;

  const unauthenticatedDashboard = await authorizeAdminRequest(request('/admin/repository/executive-operations-dashboard'));
  assert.equal(unauthenticatedDashboard.authenticated, false, 'Unauthenticated dashboard request must fail closed.');

  const authenticatedDashboard = await authorizeAdminRequest(
    request('/admin/repository/executive-operations-dashboard', { cookie: sessionCookie }),
  );
  assert.equal(authenticatedDashboard.authenticated, true, 'EOI dashboard must accept a valid human admin session.');
  if (authenticatedDashboard.authenticated) {
    assert.equal(authenticatedDashboard.identityType, 'HUMAN_ADMIN');
    assert.equal(authenticatedDashboard.mechanism, 'HUMAN_SESSION');
    assert.equal(authenticatedDashboard.canMutate, false);
  }

  const invalidSessionDashboard = await authorizeAdminRequest(
    request('/admin/repository/executive-operations-dashboard', { cookie: `${ADMIN_SESSION_COOKIE}=invalid` }),
  );
  assert.equal(invalidSessionDashboard.authenticated, false, 'EOI dashboard must reject invalid sessions.');

  const machineApi = await authorizeAdminRequest(
    request('/api/admin/enterprise/operational-kpis', { 'x-admin-key': 'deterministic-admin-key' }),
  );
  assert.equal(machineApi.authenticated, true, 'Approved machine/API key must still work on approved admin API surfaces.');
  if (machineApi.authenticated) {
    assert.equal(machineApi.identityType, 'MACHINE_ADMIN');
    assert.equal(machineApi.mechanism, 'X_ADMIN_KEY');
  }

  const invalidMachineApi = await authorizeAdminRequest(
    request('/api/admin/enterprise/operational-kpis', { 'x-admin-key': 'wrong-key' }),
  );
  assert.equal(invalidMachineApi.authenticated, false, 'Invalid machine/API key must fail.');

  const humanMutation = await authorizeAdminRequest(
    request('/api/admin/toggle-access', { cookie: sessionCookie }),
    { method: 'POST' },
  );
  assert.equal(humanMutation.authenticated, false, 'Human sessions must not gain mutating admin API access in this sprint.');

  const queryStringCredential = await authorizeAdminRequest(request('/admin?adminKey=deterministic-admin-key'));
  assert.equal(queryStringCredential.authenticated, false, 'Query-string credentials must not authenticate admin requests.');

  assert.equal(await validateAdminCredentialSubmission('deterministic-admin-key'), true);
  assert.equal(await validateAdminCredentialSubmission('wrong-key'), false);
}

function assertSurfaceClassification() {
  const dashboard = classifyAdminSurface('/admin/repository/executive-operations-dashboard');
  assert.equal(dashboard.surfaceType, 'BROWSER_ADMIN_PAGE');
  assert.ok(dashboard.acceptedIdentityTypes.includes('HUMAN_ADMIN'));
  assert.ok(dashboard.allowedMechanisms.includes('HUMAN_SESSION'));
  assert.equal(dashboard.mutationPosture, 'READ_ONLY');

  const operationalKpis = classifyAdminSurface('/api/admin/enterprise/operational-kpis');
  assert.equal(operationalKpis.surfaceType, 'DUAL_ACCESS_ADMIN_API');
  assert.ok(operationalKpis.allowedMechanisms.includes('HUMAN_SESSION'));
  assert.ok(operationalKpis.allowedMechanisms.includes('X_ADMIN_KEY'));
  assert.equal(operationalKpis.mutationPosture, 'READ_ONLY');

  const toggleAccess = classifyAdminSurface('/api/admin/toggle-access', 'POST');
  assert.equal(toggleAccess.surfaceType, 'MUTATING_ADMIN_API');
  assert.equal(toggleAccess.csrfProtectionRequired, true);
  assert.equal(toggleAccess.allowedMechanisms.includes('HUMAN_SESSION'), false);

  for (const surface of adminProtectedSurfaceClassifications) {
    assert.ok(surface.routePattern);
    assert.ok(surface.acceptedIdentityTypes.length > 0, `${surface.routePattern} must define accepted identity types.`);
    assert.ok(surface.requiredRoles.length > 0, `${surface.routePattern} must define required roles.`);
    assert.ok(surface.allowedMechanisms.length > 0, `${surface.routePattern} must define allowed mechanisms.`);
    assert.ok(surface.auditClassification, `${surface.routePattern} must define audit classification.`);
  }
}

async function main() {
  await assertSessionSecurity();
  assertCookieSecurity();
  assertReturnPathSafety();
  await assertAuthorizationBehavior();
  assertSurfaceClassification();

  console.log(
    '[eparb-admin-auth-session-foundation] ok: signed sessions, expiration, revocation, cookie flags, open-redirect safety, machine compatibility, human dashboard access, mutation boundary, and protected-surface classification verified.',
  );
}

main().catch((error) => {
  console.error(
    '[eparb-admin-auth-session-foundation] failed:',
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
