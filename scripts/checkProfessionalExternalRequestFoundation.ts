import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import { createProfessionalExternalRequestBootstrapResponse } from '../lib/professionalExternalRequestBootstrap';

import {
  PROFESSIONAL_EXTERNAL_REQUEST_FOUNDATION_VERSION,
  PROFESSIONAL_EXTERNAL_REQUEST_PROFILE,
  ProfessionalExternalRequestError,
  validateProfessionalExternalRequestDraft,
  validatePropertyManagerRentEstimateResponse,
} from '../lib/professionalExternalRequestProfileRegistry';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260831000000_add_professional_external_request_foundation/migration.sql', 'utf8');
const service = readFileSync('lib/professionalExternalRequestFoundation.ts', 'utf8');
const externalRoute = readFileSync('app/professional-request/respond/submit/route.ts', 'utf8');
const externalResponseForm = readFileSync('components/professional-request/PropertyManagerRentEstimateResponseForm.tsx', 'utf8');
const bootstrapRoute = readFileSync('app/professional-request/access/route.ts', 'utf8');
const bootstrapResponse = readFileSync('lib/professionalExternalRequestBootstrap.ts', 'utf8');
const agentRoute = readFileSync('app/api/agent/professional-external-requests/route.ts', 'utf8');
const workflow = readFileSync('components/agent/ProfessionalExternalRequestWorkflow.tsx', 'utf8');
const middleware = readFileSync('middleware.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(PROFESSIONAL_EXTERNAL_REQUEST_FOUNDATION_VERSION, 'PROFESSIONAL_EXTERNAL_REQUEST_FOUNDATION_V1');
for (const name of ['ExternalRequestDelivery', 'ExternalRequestCapability', 'ExternalRequestSession', 'ExternalRequestDisclosureSnapshot', 'ExternalIdentityVerification']) {
  assert.match(schema, new RegExp(`model ${name} \\{`));
  assert.match(migration, new RegExp(`CREATE TABLE "${name}"`));
}
assert.match(schema, /supersedesRequestId\s+String\?/);
assert.match(migration, /ProfessionalInputRequest_supersedesRequestId_fkey/);
assert.match(migration, /ExternalRequestDisclosureSnapshot_append_only/);
assert.match(migration, /ExternalIdentityVerification_append_only/);
assert.match(service, /randomBytes\(bytes\)/);
assert.match(service, /tokenHash/);
assert.match(service, /httpOnly: true/);
assert.match(service, /sameSite: 'strict'/);
assert.match(service, /maxUses: 1/);
assert.match(service, /SOURCE_ROLE_CLAIMED/);
assert.match(service, /Agent for review/);
assert.match(bootstrapRoute, /createProfessionalExternalRequestBootstrapResponse/);
assert.doesNotMatch(bootstrapRoute, /NextResponse\.redirect/);
assert.match(bootstrapResponse, /meta http-equiv="refresh"/);
assert.match(bootstrapResponse, /RESPONSE_PATH = '\/professional-request\/respond'/);
assert.match(bootstrapResponse, /response\.cookies\.set\('project_atlas_external_request_session'/);
assert.match(bootstrapResponse, /Referrer-Policy/);
assert.match(externalRoute, /sameOrigin/);
assert.match(externalRoute, /csrfToken/);
assert.match(externalResponseForm, /fetch\('\/professional-request\/respond\/submit'/);
assert.doesNotMatch(externalResponseForm, /\/api\/professional-request\/respond/);
assert.equal(existsSync('app/api/professional-request/respond/route.ts'), false);
assert.doesNotMatch(middleware, /\/api\/professional-request\/respond/);
assert.match(agentRoute, /PREPARE_SUCCESSOR/);
assert.match(agentRoute, /authorizeAdminRequest/);
assert.match(workflow, /controlled-synthetic-authorization-required/);
assert.doesNotMatch(workflow, /action: 'SEND'/);
assert.match(middleware, /Content-Security-Policy/);
assert.match(middleware, /professionalExternalRequestNonce/);
assert.match(middleware, /crypto\.getRandomValues/);
assert.match(middleware, /script-src 'self' 'nonce-\$\{nonce\}'/);
assert.match(middleware, /headers\.set\('content-security-policy', contentSecurityPolicy\)/);
assert.match(middleware, /NextResponse\.next\(\{ request: \{ headers \} \}\)/);
assert.match(middleware, /frame-ancestors 'none'/);
assert.match(middleware, /X-Content-Type-Options/);
assert.match(middleware, /X-Robots-Tag/);
assert.equal(packageJson.scripts?.['check:professional-external-request-foundation'], 'jiti scripts/checkProfessionalExternalRequestFoundation.ts');

const bootstrap = createProfessionalExternalRequestBootstrapResponse('controlled-session-value');
assert.equal(bootstrap.status, 200);
assert.match(await bootstrap.text(), /meta http-equiv="refresh" content="0;url=\/professional-request\/respond"/);
assert.equal(bootstrap.headers.get('location'), null);
assert.equal(bootstrap.headers.get('cache-control'), 'private, no-store');
assert.equal(bootstrap.headers.get('referrer-policy'), 'no-referrer');
assert.match(bootstrap.headers.get('set-cookie') || '', /project_atlas_external_request_session=controlled-session-value/);
assert.match(bootstrap.headers.get('set-cookie') || '', /Path=\/professional-request/);
assert.match(bootstrap.headers.get('set-cookie') || '', /HttpOnly/);
assert.match(bootstrap.headers.get('set-cookie') || '', /SameSite=strict/);

const draft = validateProfessionalExternalRequestDraft({ profile: PROFESSIONAL_EXTERNAL_REQUEST_PROFILE, recipientEmail: 'manager@example.test', propertyLabel: '123 Example Street', propertyCity: 'Boulder', propertyState: 'CO', purpose: 'Provide a professional monthly rent estimate for Agent review.' });
assert.equal(draft.profile, PROFESSIONAL_EXTERNAL_REQUEST_PROFILE);
assert.throws(() => validateProfessionalExternalRequestDraft({ ...draft, clientFinancialData: 'no' }), (error: unknown) => error instanceof ProfessionalExternalRequestError && error.code === 'INVALID_REQUEST');
const response = validatePropertyManagerRentEstimateResponse({ monthlyRent: 3200, rentRangeLow: 3000, rentRangeHigh: 3400, note: 'Assumes ordinary market-ready condition.', responderRole: 'Property manager' });
assert.equal(response.monthlyRent, 3200);
assert.throws(() => validatePropertyManagerRentEstimateResponse({ ...response, note: 'SSN 123-45-6789' }), (error: unknown) => error instanceof ProfessionalExternalRequestError && error.code === 'INVALID_REQUEST');

console.log('PROFESSIONAL_EXTERNAL_REQUEST_FOUNDATION_CHECK: PASS');
