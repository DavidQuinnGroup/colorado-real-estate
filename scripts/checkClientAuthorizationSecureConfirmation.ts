import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE,
  SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE_KEY,
  buildClientAuthorizationSnapshot,
} from '../lib/clientAuthorizationFoundation';
import {
  CLIENT_AUTHORIZATION_CONFIRMATION_COOKIE,
  CLIENT_AUTHORIZATION_CONFIRMATION_PURPOSE,
  getClientAuthorizationSessionCookieOptions,
} from '../lib/clientAuthorizationSecureConfirmation';

const baseline = {
  profileKey: SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE_KEY,
  profileVersion: '1.0.0',
  purpose: 'CERTIFY_SECURE_CLIENT_CONFIRMATION',
  actionClass: 'SYNTHETIC_AUTHORIZED_ACTION_V1',
  recipientClass: 'SYNTHETIC_CERTIFICATION_RECIPIENT',
  recipientRef: 'ATLAS_SYNTHETIC_RECIPIENT_A',
  allowedDataClasses: ['SYNTHETIC_NON_SENSITIVE_DATA'],
  principalRequirement: 'SINGLE_REQUIRED_PRINCIPAL',
  principalRefs: ['ATLAS_SYNTHETIC_PRINCIPAL_A'],
  captureMethod: 'PURPOSE_BOUND_SECURE_LINK',
  assurance: 'CLIENT_CONFIRMED',
  effectiveAt: '2026-09-03T00:00:00.000Z',
  expiresAt: '2026-09-10T00:00:00.000Z',
  authorizationLanguage: 'Synthetic authorization.',
  limitations: 'Inert only.',
  propertyId: 'ATLAS_SYNTHETIC_PROPERTY_CERTIFICATION',
  transactionId: null,
};
const first = buildClientAuthorizationSnapshot(baseline);
assert.equal(SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE.lifecycle, 'SYNTHETIC_CERTIFICATION_ONLY');
assert.equal(SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE.requiredAssurance, 'CLIENT_CONFIRMED');
assert.notEqual(first.fingerprint, buildClientAuthorizationSnapshot({ ...baseline, actionClass: 'SYNTHETIC_OTHER_ACTION' }).fingerprint);
assert.notEqual(first.fingerprint, buildClientAuthorizationSnapshot({ ...baseline, purpose: 'OTHER_PURPOSE' }).fingerprint);
assert.notEqual(first.fingerprint, buildClientAuthorizationSnapshot({ ...baseline, recipientRef: 'ATLAS_SYNTHETIC_RECIPIENT_B' }).fingerprint);
assert.notEqual(first.fingerprint, buildClientAuthorizationSnapshot({ ...baseline, allowedDataClasses: ['SYNTHETIC_OTHER_DATA'] }).fingerprint);
assert.notEqual(first.fingerprint, buildClientAuthorizationSnapshot({ ...baseline, propertyId: 'ATLAS_SYNTHETIC_PROPERTY_OTHER' }).fingerprint);
assert.notEqual(first.fingerprint, buildClientAuthorizationSnapshot({ ...baseline, expiresAt: '2026-09-11T00:00:00.000Z' }).fingerprint);
assert.equal(CLIENT_AUTHORIZATION_CONFIRMATION_PURPOSE, 'CLIENT_AUTHORIZATION_CONFIRMATION_V1');
assert.equal(CLIENT_AUTHORIZATION_CONFIRMATION_COOKIE, 'project_atlas_client_authorization_session');
assert.deepEqual(getClientAuthorizationSessionCookieOptions(true), { httpOnly: true, secure: true, sameSite: 'strict', path: '/client-authorization', maxAge: 1800 });

const service = readFileSync('lib/clientAuthorizationSecureConfirmation.ts', 'utf8');
const workspace = readFileSync('components/agent/ClientAuthorizationWorkspace.tsx', 'utf8');
const externalShell = readFileSync('components/project-atlas/ProjectAtlasExternalShell.tsx', 'utf8');
const externalNavigation = readFileSync('lib/projectAtlasExternalNavigation.ts', 'utf8');
const externalLayout = readFileSync('app/client-authorization/layout.tsx', 'utf8');
const confirmationForm = readFileSync('components/client-authorization/ClientAuthorizationConfirmationForm.tsx', 'utf8');
const agentRoute = readFileSync('app/api/agent/client-authorizations/route.ts', 'utf8');
const accessRoute = readFileSync('app/client-authorization/access/route.ts', 'utf8');
const submitRoute = readFileSync('app/client-authorization/confirm/submit/route.ts', 'utf8');
const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260903000000_add_client_authorization_secure_confirmation_v1/migration.sql', 'utf8');
const principalLinkRepairMigration = readFileSync('prisma/migrations/20260904000000_repair_client_authorization_confirmation_principal_links/migration.sql', 'utf8');
const middleware = readFileSync('middleware.ts', 'utf8');
assert.match(service, /tokenHash: hash\(capabilityPlaintext\)/);
assert.match(service, /purpose !== CLIENT_AUTHORIZATION_CONFIRMATION_PURPOSE/);
assert.match(service, /useCount >= capability\.maxUses/);
assert.match(service, /csrfTokenHash/);
assert.match(service, /status: decision === 'CONFIRMED' \? 'ACTIVE' : 'DECLINED'/);
assert.match(service, /clientAuthorizationConfirmationEvidence/);
assert.match(service, /updateMany\(\{ where: \{ authorizationId: record\.id, revokedAt: null, completedAt: null \}/);
assert.match(service, /async function recoverCapability/);
assert.match(service, /Recovery requires exactly one unused, unexpired confirmation capability/);
assert.match(service, /clientAuthorizationSession\.findFirst/);
assert.match(service, /exchangedAt: null, useCount: 0/);
assert.match(agentRoute, /RECOVER_SECURE_CONFIRMATION_CAPABILITY/);
assert.match(service, /transactionId, propertyId \}\);/);
assert.match(service, /createdBySubject: actor, idempotencyKey, transactionId, propertyId, principals:/);
assert.match(accessRoute, /NextResponse\.redirect\(new URL\('\/client-authorization\/confirm'/);
assert.match(accessRoute, /Referrer-Policy/);
assert.match(accessRoute, /X-Robots-Tag/);
assert.match(accessRoute, /createProjectAtlasExternalUnavailableResponse/);
assert.match(submitRoute, /request\.headers\.get\('origin'\) !== request\.nextUrl\.origin/);
assert.match(submitRoute, /export async function POST/);
assert.match(schema, /model ClientAuthorizationConfirmationEvidence/);
assert.match(schema, /clientAuthorizationPrincipalId String\?/);
assert.match(migration, /ClientAuthorizationConfirmationEvidence_append_only/);
assert.match(migration, /ClientAuthorizationUse_append_only/);
assert.match(migration, /ClientAuthorizationSnapshot_freeze_when_prepared/);
assert.match(schema, /SYNTHETIC_CERTIFICATION_ONLY/);
assert.match(middleware, /isClientAuthorizationConfirmationRoute/);
assert.match(middleware, /isProfessionalExternalRequestRoute\(pathname\) \|\| isClientAuthorizationConfirmationRoute\(pathname\)/);
assert.match(middleware, /pathname === "\/agent\/authorizations"/);
assert.match(middleware, /pathname === "\/api\/agent\/client-authorizations"/);
assert.match(workspace, /\['PENDING_CONFIRMATION', 'ACTIVE'\]\.includes\(authorization\.status\)/);
assert.match(workspace, /Field label="Property context" value=\{terms\.propertyId\}/);
assert.match(workspace, /Field label="Transaction context" value=\{terms\.transactionId\}/);
assert.match(workspace, /Recover lost secure link/);
assert.match(workspace, /ATLAS_SECURE_CONFIRMATION_RECOVERY_/);
assert.match(externalLayout, /ProjectAtlasExternalShell/);
assert.match(confirmationForm, /ProjectAtlasPublicHomeAction terminal/);
assert.match(externalShell, /href=\{PROJECT_ATLAS_PUBLIC_HOME_PATH\}/);
assert.doesNotMatch(externalShell, /agent|token|cookie|session/i);
assert.match(externalNavigation, /href="\$\{PUBLIC_HOME_PATH\}"/);
assert.match(externalNavigation, /Referrer-Policy/);
assert.match(principalLinkRepairMigration, /ALTER TABLE "ClientAuthorizationSession" ADD COLUMN IF NOT EXISTS "clientAuthorizationPrincipalId" TEXT/);
assert.match(principalLinkRepairMigration, /ALTER TABLE "ClientAuthorizationConfirmationEvidence" ADD COLUMN IF NOT EXISTS "clientAuthorizationPrincipalId" TEXT/);
assert.match(principalLinkRepairMigration, /ClientAuthorizationSession_clientAuthorizationPrincipalId_fkey/);
assert.match(principalLinkRepairMigration, /ClientAuthorizationConfirmationEvidence_clientAuthorizationPrincipalId_fkey/);
assert.doesNotMatch(service, /tokenPlaintext|rawToken|capabilityPlaintext: capabilityPlaintext/);

console.log('CLIENT_AUTHORIZATION_SECURE_CONFIRMATION_CHECKER: PASS');
