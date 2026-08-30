import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  EVIDENCE_ADMISSION_FOUNDATION_VERSION,
  EvidenceAdmissionError,
  evidenceAdmissionFingerprint,
  policyForEvidenceSource,
  resolveEligibleEvidence,
  validateEvidenceCandidateInput,
} from '../lib/evidenceAdmissionFoundation';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260830190000_add_evidence_admission_foundation/migration.sql', 'utf8');
const service = readFileSync('lib/evidenceAdmissionFoundation.ts', 'utf8');
const route = readFileSync('app/api/agent/evidence/route.ts', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(EVIDENCE_ADMISSION_FOUNDATION_VERSION, 'EVIDENCE_ADMISSION_FOUNDATION_V1');
for (const name of ['EvidenceCandidate', 'EvidenceAdmission', 'EvidenceAdmissionAuditEvent']) {
  assert.match(schema, new RegExp(`model ${name} \\{`));
  assert.match(migration, new RegExp(`CREATE TABLE "${name}"`));
}
for (const name of ['EvidenceSourceKind', 'EvidenceCandidateStatus', 'EvidenceClaimKind', 'EvidenceVerificationStatus', 'EvidenceAdmissionPolicy', 'EvidenceAdmissionAuditEventType']) {
  assert.match(schema, new RegExp(`enum ${name} \\{`));
  assert.match(migration, new RegExp(`CREATE TYPE "${name}"`));
}
for (const event of ['CANDIDATE_CREATED', 'CANDIDATE_REVIEWED', 'CANDIDATE_ADMITTED', 'CANDIDATE_REJECTED', 'ADMISSION_SUPERSEDED']) assert.match(migration, new RegExp(`'${event}'`));
assert.match(migration, /EvidenceAdmission_append_only/);
assert.match(migration, /EvidenceAdmissionAuditEvent_append_only/);
assert.match(migration, /EvidenceCandidate_transition_only/);
assert.match(migration, /EvidenceCandidate_no_delete/);
assert.match(migration, /FOREIGN KEY \("candidateId"\)/);
assert.match(migration, /FOREIGN KEY \("admissionId"\)/);
assert.match(migration, /FOREIGN KEY \("supersedesAdmissionId"\)/);
assert.match(service, /findFirst\(\{ where: \{ id: input\.candidateId, ownerAgentSubject: owner \} \}\)/);
assert.match(service, /findFirst\(\{ where: \{ id: admissionId, ownerAgentSubject: ownerScope\(ownerAgentSubject\) \} \}\)/);
assert.match(service, /CONFLICT_REQUIRES_REVIEW/);
assert.match(service, /SENSITIVE_DATA_PROHIBITED/);
assert.match(service, /policyForEvidenceSource/);
assert.match(route, /authorizeAdminRequest/);
assert.match(route, /authorization\.subject/);
assert.doesNotMatch(route, /ownerAgentSubject/);
assert.match(auth, /surface\('\/api\/agent\/evidence', 'MUTATING_ADMIN_API'/);
assert.equal(packageJson.scripts?.['check:evidence-admission-foundation'], 'jiti scripts/checkEvidenceAdmissionFoundation.ts');

const candidate = validateEvidenceCandidateInput({
  sourceKind: 'TRUSTED_INTERNAL_DETERMINISTIC',
  sourceRef: 'fixture://lender-rate-v1',
  claimKind: 'LENDER_RATE',
  candidatePayload: { rate: 6.25, unit: 'PERCENT' },
  observedAt: '2026-08-30T12:00:00.000Z',
  receivedAt: '2026-08-30T12:05:00.000Z',
  provenance: { sourceType: 'INTERNAL_FIXTURE', sourceReference: 'fixture://lender-rate-v1', receivedAt: '2026-08-30T12:05:00.000Z', verificationStatus: 'SOURCE_ROLE_VERIFIED', verificationMethod: 'DETERMINISTIC_FIXTURE' },
});
assert.equal(candidate.claimKind, 'LENDER_RATE');
assert.equal(evidenceAdmissionFingerprint(candidate), evidenceAdmissionFingerprint(candidate));
assert.equal(policyForEvidenceSource('TRUSTED_INTERNAL_DETERMINISTIC'), 'TRUSTED_INTERNAL_DETERMINISTIC_AUTO_ADMISSION');
assert.equal(policyForEvidenceSource('PROFESSIONAL_DOCUMENT'), null);
assert.throws(() => validateEvidenceCandidateInput({ ...candidate, candidatePayload: { rate: 6.25, unit: 'PERCENT', bankAccount: '123456789' } }), (error: unknown) => error instanceof EvidenceAdmissionError && error.code === 'SENSITIVE_DATA_PROHIBITED');

const owner = 'agent-fixture';
const older = { id: 'admission-a', ownerAgentSubject: owner, candidateId: 'candidate-a', claimKind: 'LENDER_RATE' as const, effectiveAt: new Date('2026-08-01T00:00:00.000Z'), expiresAt: null, supersedesAdmissionId: null, supersededByAdmission: { id: 'admission-b' } };
const current = { id: 'admission-b', ownerAgentSubject: owner, candidateId: 'candidate-b', claimKind: 'LENDER_RATE' as const, effectiveAt: new Date('2026-08-15T00:00:00.000Z'), expiresAt: null, supersedesAdmissionId: older.id, supersededByAdmission: null };
assert.deepEqual(resolveEligibleEvidence([older, current], new Date('2026-08-30T00:00:00.000Z')), { state: 'ELIGIBLE', admissions: [current] });
const conflict = { ...current, id: 'admission-c', candidateId: 'candidate-c', supersedesAdmissionId: null };
assert.equal(resolveEligibleEvidence([current, conflict], new Date('2026-08-30T00:00:00.000Z')).state, 'CONFLICT_REQUIRES_REVIEW');
assert.equal(resolveEligibleEvidence([{ ...current, expiresAt: new Date('2026-08-29T00:00:00.000Z') }], new Date('2026-08-30T00:00:00.000Z')).state, 'NONE');

console.log('EVIDENCE_ADMISSION_FOUNDATION_CHECK: PASS');
