import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  PROFESSIONAL_INPUT_FOUNDATION_VERSION,
  ProfessionalInputError,
  validateProfessionalInputRequest,
  validateProfessionalInputResponse,
} from '../lib/professionalInputFoundation';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260830200000_add_professional_input_foundation/migration.sql', 'utf8');
const service = readFileSync('lib/professionalInputFoundation.ts', 'utf8');
const route = readFileSync('app/api/agent/professional-inputs/route.ts', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(PROFESSIONAL_INPUT_FOUNDATION_VERSION, 'PROFESSIONAL_INPUT_REQUEST_AND_VERIFICATION_FOUNDATION_V1');
for (const name of ['ProfessionalInputRequest', 'ProfessionalInputResponse', 'ProfessionalInput']) {
  assert.match(schema, new RegExp(`model ${name} \\{`));
  assert.match(migration, new RegExp(`CREATE TABLE "${name}"`));
}
assert.match(schema, /enum ProfessionalInputRequestStatus \{/);
assert.match(migration, /CREATE TYPE "ProfessionalInputRequestStatus"/);
assert.match(migration, /ProfessionalInputResponse_append_only/);
assert.match(migration, /ProfessionalInput_append_only/);
assert.match(migration, /ProfessionalInputResponse_candidateId_fkey/);
assert.match(migration, /ProfessionalInput_evidenceAdmissionId_fkey/);
assert.match(service, /candidate\.sourceKind !== 'PROFESSIONAL_REPORTED'/);
assert.match(service, /validateEvidenceCandidateInput/);
assert.match(service, /evidenceAdmissionId/);
assert.match(service, /versionOrdinal: count \+ 1/);
assert.match(route, /authorizeAdminRequest/);
assert.doesNotMatch(route, /ownerAgentSubject/);
assert.match(auth, /surface\('\/api\/agent\/professional-inputs', 'MUTATING_ADMIN_API'/);
assert.equal(packageJson.scripts?.['check:professional-input-foundation'], 'jiti scripts/checkProfessionalInputFoundation.ts');

const request = validateProfessionalInputRequest({ claimKind: 'LENDER_RATE', requestedSourceRole: 'LENDER', purpose: 'Confirm rate for a reviewed internal planning input.', supportDocumentRequired: true });
assert.equal(request.claimKind, 'LENDER_RATE');
assert.equal(request.supportDocumentRequired, true);
const response = validateProfessionalInputResponse({ requestId: 'request-fixture', candidate: { sourceKind: 'PROFESSIONAL_REPORTED', sourceRef: 'fixture://lender-rate', claimKind: 'LENDER_RATE', candidatePayload: { rate: 6.25, unit: 'PERCENT' }, receivedAt: '2026-08-30T14:00:00.000Z', provenance: { sourceType: 'PROFESSIONAL_REPORTED', sourceReference: 'fixture://lender-rate', receivedAt: '2026-08-30T14:00:00.000Z', verificationStatus: 'SOURCE_ROLE_CLAIMED' } } });
assert.equal(response.candidate.provenance.verificationStatus, 'SOURCE_ROLE_CLAIMED');
assert.throws(() => validateProfessionalInputResponse({ ...response, candidate: { ...response.candidate, sourceKind: 'PROFESSIONAL_DOCUMENT' } }), (error: unknown) => error instanceof ProfessionalInputError && error.code === 'INVALID_REQUEST');

console.log('PROFESSIONAL_INPUT_FOUNDATION_CHECK: PASS');
