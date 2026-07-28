import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const REQUIRED_FILES = [
  'lib/admin/adminAuth.ts',
  'middleware.ts',
  'app/admin/login/page.tsx',
  'app/admin-auth/login/route.ts',
  'app/admin/logout/route.ts',
  'app/api/admin/repository/auth.ts',
  'docs/project-atlas/executive-library/EPARB-REVIEW-001-CONTROLLED-ADMINISTRATIVE-AUTHENTICATION-AND-SESSION-FOUNDATION-IMPLEMENTATION.md',
];

const CUSTOMER_AUTH_FORBIDDEN_FILES = [
  'app/api/search/route.ts',
  'app/api/property-inquiry/route.ts',
  'app/api/valuation/route.ts',
  'app/api/save-search/route.ts',
  'app/api/track-click/route.ts',
];

async function read(path: string) {
  return readFile(path, 'utf8');
}

async function assertCoreSourceSafety() {
  const adminAuth = await read('lib/admin/adminAuth.ts');
  const middleware = await read('middleware.ts');
  const loginRoute = await read('app/admin-auth/login/route.ts');
  const loginPage = await read('app/admin/login/page.tsx');
  const logoutRoute = await read('app/admin/logout/route.ts');
  const repositoryAuth = await read('app/api/admin/repository/auth.ts');

  assert.match(adminAuth, /ADMIN_SESSION_COOKIE = 'reie_admin_session'/, 'Human admin session cookie must be distinct from legacy machine-key cookie.');
  assert.match(adminAuth, /ADMIN_MACHINE_KEY_COOKIE = 'reie_admin_key'/, 'Legacy admin key cookie must be explicitly named as machine-key compatibility.');
  assert.match(adminAuth, /httpOnly: true/, 'Session cookie must be HttpOnly.');
  assert.match(adminAuth, /secure: isProduction/, 'Session cookie must be Secure in production.');
  assert.match(adminAuth, /sameSite: 'lax'/, 'Session cookie must enforce SameSite.');
  assert.match(adminAuth, /expiresAt <= nowSeconds/, 'Session expiration must be enforced.');
  assert.match(adminAuth, /sessionVersion !==/, 'Session version revocation must be enforced.');
  assert.match(adminAuth, /crypto\.subtle\.sign/, 'Session integrity must be cryptographically signed.');
  assert.match(adminAuth, /constantTimeEqual/, 'Credential and signature checks must use a constant-time comparison helper.');
  assert.match(adminAuth, /sanitizeAdminReturnPath/, 'Open redirect protection must be centralized.');
  assert.doesNotMatch(adminAuth, /searchParams\.get\(['"]adminKey['"]\)/, 'Admin key query-string authentication must not be supported.');
  assert.doesNotMatch(adminAuth, /localStorage|sessionStorage|document\.cookie/, 'Admin session code must not use client-readable storage APIs.');

  assert.match(middleware, /authorizeAdminRequest/, 'Middleware must use the shared admin authorization boundary.');
  assert.match(middleware, /buildAdminLoginRedirect/, 'Browser admin denials must redirect to login.');
  assert.match(middleware, /buildAdminUnauthorizedResponse/, 'Admin API denials must remain JSON 401.');
  assert.match(middleware, /withTrustedAdminHeaders/, 'Middleware must pass trusted identity metadata to route-local checks.');
  assert.match(middleware, /pathname === "\/admin\/login"/, 'Middleware must allow the login page to render.');
  assert.match(middleware, /pathname === "\/admin\/logout"/, 'Middleware must allow logout to clear sessions.');

  assert.match(repositoryAuth, /isTrustedMiddlewareAuthorizedRequest/, 'Route-local admin helper must accept trusted middleware-authenticated sessions.');
  assert.match(repositoryAuth, /getConfiguredAdminCredential/, 'Route-local admin helper must retain machine credential compatibility.');
  assert.match(repositoryAuth, /ADMIN_MACHINE_KEY_COOKIE/, 'Legacy machine-key cookie compatibility must remain explicit.');

  assert.match(loginRoute, /validateAdminCredentialSubmission/, 'Login route must validate credentials server-side.');
  assert.match(loginRoute, /createAdminSessionCookieValue/, 'Login route must create a signed human session.');
  assert.match(loginRoute, /ADMIN_SESSION_COOKIE/, 'Login route must set the human session cookie.');
  assert.match(loginRoute, /isSameOriginAdminRequest/, 'Login route must reject cross-origin administrative credential submissions.');
  assert.doesNotMatch(loginRoute, /ADMIN_MACHINE_KEY_COOKIE|reie_admin_key/, 'Login route must not set raw admin keys in cookies.');
  assert.doesNotMatch(loginRoute, /console\.(log|error).*credential|adminCredential.*console/, 'Login route must not log submitted credentials.');
  assert.doesNotMatch(loginRoute, /searchParams\.set\(['"]adminCredential['"]/, 'Login route must not place credentials in URLs.');

  assert.match(loginPage, /type="password"/, 'Login page must use a password input.');
  assert.match(loginPage, /method="post"/, 'Login page must submit through POST.');
  assert.doesNotMatch(loginPage, /adminKey/, 'Login page must not use query-string admin keys.');
  assert.match(logoutRoute, /getExpiredAdminSessionCookieOptions/, 'Logout must invalidate the session cookie.');
}

async function assertDocumentationCoverage() {
  const implementationDoc = await read('docs/project-atlas/executive-library/EPARB-REVIEW-001-CONTROLLED-ADMINISTRATIVE-AUTHENTICATION-AND-SESSION-FOUNDATION-IMPLEMENTATION.md');
  const reviewDoc = await read('docs/project-atlas/executive-library/EPARB-REVIEW-001-ENTERPRISE-ADMINISTRATIVE-AUTHENTICATION-AND-ACCESS-ARCHITECTURE.md');
  const portfolio = await read('docs/project-atlas/executive-library/EPARB-1.0-INITIAL-REVIEW-PORTFOLIO.md');
  const chatStart = await read('docs/CHAT_START.md');

  assert.match(implementationDoc, /MODEL_E_REPOSITORY_SUPPORTED_HYBRID/, 'Implementation doc must record the approved model.');
  assert.match(implementationDoc, /Human Session Foundation/, 'Implementation doc must document human sessions.');
  assert.match(implementationDoc, /Machine\/API Compatibility/, 'Implementation doc must document machine/API compatibility.');
  assert.match(implementationDoc, /EOI Sprint 3/, 'Implementation doc must document EOI Sprint 3 access path.');
  assert.match(implementationDoc, /deployment remains prohibited/i, 'Implementation doc must prohibit deployment.');
  assert.match(reviewDoc, /Controlled Administrative Authentication/, 'Review doc must reference the implementation.');
  assert.match(portfolio, /EPARB_REVIEW_001_CONTROLLED_ADMINISTRATIVE_AUTHENTICATION_AND_SESSION_FOUNDATION_IMPLEMENTED_DEPLOYMENT_NOT_AUTHORIZED/, 'Portfolio must record implementation result.');
  assert.match(chatStart, /EPARB_REVIEW_001_CONTROLLED_ADMINISTRATIVE_AUTHENTICATION_AND_SESSION_FOUNDATION_IMPLEMENTED_DEPLOYMENT_NOT_AUTHORIZED/, 'CHAT_START must record implementation result.');
}

async function assertNoCustomerAuthChanges() {
  for (const file of CUSTOMER_AUTH_FORBIDDEN_FILES) {
    const source = await read(file);
    assert.doesNotMatch(source, /ADMIN_SESSION_COOKIE|authorizeAdminRequest|validateAdminSessionCookieValue|createAdminSessionCookieValue/, `${file} must not depend on admin session auth.`);
  }
}

async function main() {
  for (const file of REQUIRED_FILES) await read(file);
  await assertCoreSourceSafety();
  await assertDocumentationCoverage();
  await assertNoCustomerAuthChanges();

  console.log(
    '[admin-auth-safety] ok: shared boundary, secure session cookie handling, login/logout safety, route-helper compatibility, documentation coverage, and no customer auth coupling verified.',
  );
}

main().catch((error) => {
  console.error('[admin-auth-safety] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
