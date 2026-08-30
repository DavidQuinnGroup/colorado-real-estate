import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildOutputPersistenceIdempotencyKey,
  buildPersistableOutputFixture,
  createOutputPersistenceService,
  OUTPUT_PERSISTENCE_API_ROUTE,
  OUTPUT_PERSISTENCE_FOUNDATION_VERSION,
  OUTPUT_PERSISTENCE_PAYLOAD_SCHEMA_VERSION,
  OUTPUT_PERSISTENCE_REVIEW_POLICY,
  OUTPUT_PERSISTENCE_SUPPORTED_SOURCE_VERSION_REFS,
  OutputPersistenceError,
  parseOutputPersistenceSaveRequest,
} from '../lib/outputPersistenceFoundation';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260829190000_add_output_persistence_foundation/migration.sql', 'utf8');
const serviceSource = readFileSync('lib/outputPersistenceFoundation.ts', 'utf8');
const authSource = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const routeSource = readFileSync('app/api/agent/outputs/route.ts', 'utf8');
const componentSource = readFileSync('components/agent/SellerDecisionBriefCompositionPreview.tsx', 'utf8');
const reportSource = readFileSync('docs/project-atlas/executive-library/OUTPUT-PERSISTENCE-FOUNDATION-V1-CERTIFICATION.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(OUTPUT_PERSISTENCE_FOUNDATION_VERSION, 'OUTPUT_PERSISTENCE_FOUNDATION_V1');
assert.equal(OUTPUT_PERSISTENCE_PAYLOAD_SCHEMA_VERSION, 'OUTPUT_PERSISTENCE_PAYLOAD_V1');
assert.equal(OUTPUT_PERSISTENCE_REVIEW_POLICY, 'PERSIST_REVIEWED_ONLY_V1');
assert.equal(OUTPUT_PERSISTENCE_API_ROUTE, '/api/agent/outputs');
assert.deepEqual(OUTPUT_PERSISTENCE_SUPPORTED_SOURCE_VERSION_REFS, ['seller-decision-brief-v2-reviewed', 'seller-update-current-version']);

for (const model of ['OutputProduct', 'OutputVersion', 'OutputEvidenceSnapshot', 'OutputDependency', 'OutputReview', 'OutputDecision', 'OutputCheckpoint']) {
  assert(schema.includes(`model ${model} {`), `schema missing ${model}`);
  assert(migration.includes(`CREATE TABLE "${model}"`), `migration missing ${model}`);
}
for (const token of ['OutputProductKind', 'OutputAudience', 'OutputVersionLifecycleState', 'OutputDependencyType', 'OutputInvalidationState']) {
  assert(schema.includes(`enum ${token} {`), `schema missing enum ${token}`);
  assert(migration.includes(`CREATE TYPE "${token}"`), `migration missing enum ${token}`);
}
assert(migration.includes('ADD CONSTRAINT "OutputVersion_productId_fkey"'));
assert(migration.includes('OutputVersion_productId_versionOrdinal_key'));
assert(migration.includes('OutputVersion_idempotencyKey_key'));
assert(migration.includes('CREATE FUNCTION "preventOutputPersistenceMutation"()'));
for (const model of ['OutputVersion', 'OutputEvidenceSnapshot', 'OutputDependency', 'OutputReview', 'OutputDecision', 'OutputCheckpoint']) {
  assert(migration.includes(`CREATE TRIGGER "${model}_append_only"`), `migration missing append-only trigger for ${model}`);
}
assert.equal(migration.includes('OutputRender'), false);
assert.equal(migration.includes('Pdf'), false);
assert.equal(migration.includes('PDF'), false);

const sellerFixture = buildPersistableOutputFixture('seller-decision-brief-v2-reviewed');
const updateFixture = buildPersistableOutputFixture('seller-update-current-version');
const sellerPayload = sellerFixture.contentPayload as unknown as { schemaVersion: string; sourceVersionRef: string; referenceGroups: Record<string, readonly string[]> };
const updatePayload = updateFixture.contentPayload as unknown as { sourceVersionRef: string };
assert.equal(sellerPayload.schemaVersion, OUTPUT_PERSISTENCE_PAYLOAD_SCHEMA_VERSION);
assert.equal(sellerPayload.sourceVersionRef, sellerFixture.sourceVersionRef);
assert.equal(updatePayload.sourceVersionRef, updateFixture.sourceVersionRef);
assert.equal(sellerPayload.referenceGroups.decision.length > 0, true);
assert.equal(updateFixture.evidence.sourceSnapshotRefs.length > 0, true);
assert.equal(sellerFixture.dependencies.length > 0, true);
assert.equal(buildOutputPersistenceIdempotencyKey('agent-a', sellerFixture), buildOutputPersistenceIdempotencyKey('agent-a', sellerFixture));
assert.notEqual(buildOutputPersistenceIdempotencyKey('agent-a', sellerFixture), buildOutputPersistenceIdempotencyKey('agent-b', sellerFixture));

assert.deepEqual(
  parseOutputPersistenceSaveRequest({ sourceVersionRef: 'seller-update-current-version', reviewConfirmation: 'AGENT_REVIEWED' }),
  { sourceVersionRef: 'seller-update-current-version', reviewConfirmation: 'AGENT_REVIEWED', reviewNote: undefined },
);
for (const invalid of [null, {}, { sourceVersionRef: 'unknown', reviewConfirmation: 'AGENT_REVIEWED' }, { sourceVersionRef: 'seller-update-current-version' }, { sourceVersionRef: 'seller-update-current-version', reviewConfirmation: 'AGENT_REVIEWED', reviewNote: 'x'.repeat(501) }]) {
  assert.throws(() => parseOutputPersistenceSaveRequest(invalid), OutputPersistenceError);
}

type FakeProduct = { id: string; ownerAgentSubject: string; productKind: string; audience: string; subjectRef: string };
type FakeVersion = Record<string, unknown> & { id: string; productId: string; idempotencyKey: string; reviewedAt: Date; immutableAt: Date };
const products: FakeProduct[] = [];
const versions: FakeVersion[] = [];
let productSequence = 0;
let versionSequence = 0;
const fakePrisma: Record<string, unknown> = {
  $transaction: async <T>(callback: (transaction: unknown) => Promise<T>) => callback(fakePrisma),
  outputProduct: {
    upsert: async ({ where, create }: { where: { ownerAgentSubject_productKind_audience_subjectRef: FakeProduct }; create: Record<string, unknown> }) => {
      const key = where.ownerAgentSubject_productKind_audience_subjectRef;
      const existing = products.find((product) => product.ownerAgentSubject === key.ownerAgentSubject && product.productKind === key.productKind && product.audience === key.audience && product.subjectRef === key.subjectRef);
      if (existing) return existing;
      const product = { id: `product-${++productSequence}`, ownerAgentSubject: create.ownerAgentSubject as string, productKind: create.productKind as string, audience: create.audience as string, subjectRef: create.subjectRef as string };
      products.push(product);
      return product;
    },
  },
  outputVersion: {
    findUnique: async ({ where }: { where: { idempotencyKey: string } }) => versions.find((version) => version.idempotencyKey === where.idempotencyKey) ?? null,
    count: async ({ where }: { where: { productId: string } }) => versions.filter((version) => version.productId === where.productId).length,
    create: async ({ data }: { data: Record<string, unknown> }) => {
      const version = { ...data, id: `version-${++versionSequence}`, immutableAt: new Date('2026-08-29T00:00:00.000Z') } as FakeVersion;
      versions.push(version);
      return version;
    },
    findMany: async ({ where }: { where: { ownerAgentSubject: string } }) => versions.filter((version) => version.ownerAgentSubject === where.ownerAgentSubject),
    findFirst: async ({ where }: { where: { id: string; ownerAgentSubject: string } }) => versions.find((version) => version.id === where.id && version.ownerAgentSubject === where.ownerAgentSubject) ?? null,
  },
};

const service = createOutputPersistenceService(fakePrisma as never);
const request = parseOutputPersistenceSaveRequest({ sourceVersionRef: 'seller-decision-brief-v2-reviewed', reviewConfirmation: 'AGENT_REVIEWED' });
const first = await service.persistReviewedOutput('agent-a', request);
const repeated = await service.persistReviewedOutput('agent-a', request);
const second = await service.persistReviewedOutput('agent-a', parseOutputPersistenceSaveRequest({ sourceVersionRef: 'seller-update-current-version', reviewConfirmation: 'AGENT_REVIEWED' }));
const otherOwner = await service.persistReviewedOutput('agent-b', request);
assert.equal(first.created, true);
assert.equal(repeated.created, false);
assert.equal(first.id, repeated.id);
assert.equal(second.versionOrdinal, 2);
assert.equal(otherOwner.versionOrdinal, 1);
assert.equal((await service.listOwnedOutputHistory('agent-a')).length, 2);
assert.equal((await service.listOwnedOutputHistory('agent-b')).length, 1);
assert.equal((await service.loadOwnedOutputForPdf('agent-a', first.id)).contentFingerprint, sellerFixture.contentFingerprint);
await assert.rejects(() => service.loadOwnedOutputForPdf('agent-b', first.id), OutputPersistenceError);

for (const token of ['prisma.$transaction', 'idempotencyKey', 'P2002', 'update: {}', 'loadOwnedOutputForPdf']) {
  assert(serviceSource.includes(token), `service missing ${token}`);
}
assert.equal(serviceSource.includes('outputVersion.update('), false);
assert.equal(serviceSource.includes('outputVersion.delete('), false);
assert.equal(serviceSource.includes('MLS_GRID_TOKEN'), false);
assert.equal(serviceSource.includes('sendEmail'), false);
assert.equal(serviceSource.includes('OutputRender'), false);
assert.equal(authSource.includes("surface('/api/agent/outputs', 'MUTATING_ADMIN_API', ['HUMAN_AGENT']"), true);
assert.equal(authSource.includes('subject: agentSessionValidation.payload.subject'), true);
assert.equal(routeSource.includes('isSameOriginAdminRequest(request)'), true);
assert.equal(routeSource.includes('authorization.subject'), true);
assert.equal(componentSource.includes("fetch('/api/agent/outputs'"), true);
assert.equal(componentSource.includes('data-testid="output-persistence-foundation"'), true);
assert.equal(componentSource.includes('data-pdf-storage="false"'), true);
assert.equal(componentSource.includes('data-output-render-storage="false"'), true);
assert.equal(reportSource.includes('OUTPUT_PERSISTENCE_FOUNDATION_V1_CERTIFIED_WITH_MIGRATION_AUTHORIZATION_REQUIRED'), true);
assert.equal(reportSource.includes('READY_FOR_OUTPUT_PERSISTENCE_MIGRATION_AND_CONTROLLED_RUNTIME_VERIFICATION'), true);
assert.equal(packageJson.scripts?.['check:output-persistence-foundation'], 'jiti scripts/checkOutputPersistenceFoundation.ts');

console.log('OUTPUT_PERSISTENCE_FOUNDATION_CHECK: PASS');
