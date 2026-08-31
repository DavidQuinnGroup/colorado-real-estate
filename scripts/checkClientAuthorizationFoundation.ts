import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  CLIENT_AUTHORIZATION_FOUNDATION_VERSION,
  CLIENT_AUTHORIZATION_SNAPSHOT_VERSION,
  SYNTHETIC_AUTHORIZATION_PROFILE,
  SYNTHETIC_AUTHORIZATION_PROFILE_KEY,
  buildClientAuthorizationSnapshot,
  clientAuthorizationFingerprint,
  clientAuthorizationRequirement,
} from '../lib/clientAuthorizationFoundation';
import { PROFESSIONAL_EXTERNAL_REQUEST_PROFILES } from '../lib/professionalExternalRequestProfileRegistry';
import { assertLowRiskTransactionDecisionProfile, transactionArchivePolicy } from '../lib/buyerUnderContractFoundation';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260831110000_add_client_authorization_foundation/migration.sql', 'utf8');
const service = readFileSync('lib/clientAuthorizationFoundation.ts', 'utf8');
const route = readFileSync('app/api/agent/client-authorizations/route.ts', 'utf8');
const workspace = readFileSync('components/agent/ClientAuthorizationWorkspace.tsx', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(CLIENT_AUTHORIZATION_FOUNDATION_VERSION, 'CLIENT_AUTHORIZATION_FOUNDATION_V1');
assert.equal(SYNTHETIC_AUTHORIZATION_PROFILE.profileKey, SYNTHETIC_AUTHORIZATION_PROFILE_KEY);
assert.equal(SYNTHETIC_AUTHORIZATION_PROFILE.lifecycle, 'ACTIVE');
assert.equal(SYNTHETIC_AUTHORIZATION_PROFILE.highConsequence, false);
assert.deepEqual(SYNTHETIC_AUTHORIZATION_PROFILE.allowedDataClasses, ['SYNTHETIC_NON_SENSITIVE_DATA']);
assert.equal(clientAuthorizationRequirement('PROPERTY_MANAGER_RENT_ESTIMATE_V1'), 'NOT_REQUIRED_BY_PROFILE');
assert.equal(clientAuthorizationRequirement('BUYER_UNDER_CONTRACT_LOW_RISK_AGENT_RECORDED_DECISION'), 'NOT_REQUIRED_BY_PROFILE');
assert.equal(PROFESSIONAL_EXTERNAL_REQUEST_PROFILES.PROPERTY_MANAGER_RENT_ESTIMATE_V1.clientAuthorizationRequirement, 'NOT_REQUIRED_BY_PROFILE');
assert.equal(assertLowRiskTransactionDecisionProfile('REQUEST_PROFESSIONAL_ESTIMATE'), 'REQUEST_PROFESSIONAL_ESTIMATE');
assert.throws(() => assertLowRiskTransactionDecisionProfile('NOTICE_TO_TERMINATE'));
assert.equal(transactionArchivePolicy().coverage, 'ALL_TRANSACTION_DOCUMENTS');
assert.equal(transactionArchivePolicy().retention, 'INDEFINITE');

const authorizationTerms = { profileKey: SYNTHETIC_AUTHORIZATION_PROFILE_KEY, profileVersion: '1.0.0', purpose: 'CERTIFY_CLIENT_AUTHORIZATION_GOVERNANCE', actionClass: 'SYNTHETIC_INFORMATION_DISCLOSURE', recipientClass: 'SYNTHETIC_CERTIFICATION_RECIPIENT', recipientRef: 'ATLAS_SYNTHETIC_RECIPIENT_A', allowedDataClasses: ['SYNTHETIC_NON_SENSITIVE_DATA'], principalRequirement: 'SINGLE_REQUIRED_PRINCIPAL', principalRefs: ['ATLAS_SYNTHETIC_PRINCIPAL_A', 'ATLAS_SYNTHETIC_PRINCIPAL_B'], captureMethod: 'AGENT_RECORDED_MEETING', assurance: 'AGENT_RECORDED', effectiveAt: '2026-08-31T12:00:00.000Z', expiresAt: '2026-09-30T12:00:00.000Z' };
const first = buildClientAuthorizationSnapshot(authorizationTerms);
const reordered = buildClientAuthorizationSnapshot({ ...authorizationTerms, principalRefs: ['ATLAS_SYNTHETIC_PRINCIPAL_B', 'ATLAS_SYNTHETIC_PRINCIPAL_A'] });
assert.equal(first.snapshot.schemaVersion, CLIENT_AUTHORIZATION_SNAPSHOT_VERSION);
assert.equal(first.fingerprint, reordered.fingerprint);
assert.notEqual(first.fingerprint, clientAuthorizationFingerprint({ ...first.snapshot, recipientRef: 'ATLAS_SYNTHETIC_RECIPIENT_B' }));

for (const name of ['ClientAuthorizationProfile', 'ClientAuthorization', 'ClientAuthorizationPrincipal', 'ClientAuthorizationSnapshot', 'ClientAuthorizationUse']) {
  assert.match(schema, new RegExp(`model ${name} \\{`));
  assert.match(migration, new RegExp(`CREATE TABLE "${name}"`));
}
assert.match(schema, /enum ClientAuthorizationStatus/);
assert.match(schema, /supersedesAuthorizationId\s+String\?\s+@unique/);
assert.match(migration, /ClientAuthorizationSnapshot_append_only/);
assert.match(migration, /ClientAuthorizationProfile_used_version_immutable/);
assert.match(migration, /ClientAuthorization_material_terms_immutable/);
assert.match(migration, /No historical authorization is fabricated/);
assert.match(service, /PROFILE_DOES_NOT_REQUIRE_CLIENT_AUTHORIZATION/);
assert.match(service, /MISSING_REQUIRED_PRINCIPAL/);
assert.match(service, /ASSURANCE_INSUFFICIENT/);
assert.match(service, /DATA_CLASS_NOT_AUTHORIZED/);
assert.match(service, /REVOKED/);
assert.match(service, /EXPIRED/);
assert.match(service, /recordUse/);
assert.match(service, /clientAuthorizationRequirement/);
assert.doesNotMatch(service, /clientConsented|consentGranted|hasConsent/);
assert.match(route, /authorizeAdminRequest/);
assert.match(route, /isSameOriginAdminRequest/);
assert.match(auth, /\/api\/agent\/client-authorizations/);
assert.match(auth, /\/agent\/authorizations/);
assert.match(workspace, /Synthetic authorization fixture/);
assert.match(workspace, /does not collect client authorization/);
assert.doesNotMatch(workspace, /client email|secure-link confirmation/i);
assert.equal(packageJson.scripts?.['check:client-authorization-foundation'], 'jiti scripts/checkClientAuthorizationFoundation.ts');

console.log('CLIENT_AUTHORIZATION_FOUNDATION_CHECK: PASS');
