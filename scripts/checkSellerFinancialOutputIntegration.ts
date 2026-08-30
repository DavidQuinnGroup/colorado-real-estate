import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildOutputPersistenceIdempotencyKey,
  createOutputPersistenceService,
  parseOutputPersistenceSaveRequest,
  type OutputPersistenceSaveRequest,
} from '../lib/outputPersistenceFoundation';
import {
  buildSellerFinancialOutputComposition,
  SELLER_FINANCIAL_OUTPUT_INTEGRATION_VERSION,
  SELLER_FINANCIAL_OUTPUT_SEMANTIC_PROFILE_VERSION,
} from '../lib/sellerFinancialOutputIntegration';
import { SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1 } from '../lib/sellerFinancialEstimatedScenario';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260829190000_add_output_persistence_foundation/migration.sql', 'utf8');
const serviceSource = readFileSync('lib/outputPersistenceFoundation.ts', 'utf8');
const integrationSource = readFileSync('lib/sellerFinancialOutputIntegration.ts', 'utf8');
const routeSource = readFileSync('app/api/agent/outputs/route.ts', 'utf8');
const componentSource = readFileSync('components/agent/SellerDecisionBriefCompositionPreview.tsx', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

const owner = 'agent-certification';
const asOf = '2026-08-30T15:00:00.000Z';

function scenario(id: string, versionOrdinal: number, salePriceCents: number, supersedesScenarioId: string | null = null) {
  const inputs = [
    { key: 'SALE_PRICE', state: 'VALUE', amountCents: salePriceCents, sourceClass: 'SCENARIO_ASSUMPTION', professionalInputId: null },
    { key: 'PAYOFF', state: 'VALUE', amountCents: 20_000_025, sourceClass: 'AGENT_ESTIMATE', professionalInputId: null },
    { key: 'SELLING_COMPENSATION', state: 'VALUE', amountCents: 1_950_002, sourceClass: 'SCENARIO_ASSUMPTION', professionalInputId: null },
    { key: 'SELLER_CONCESSION', state: 'VALUE', amountCents: 0, sourceClass: 'SCENARIO_ASSUMPTION', professionalInputId: null },
    { key: 'TITLE_CLOSING_ESTIMATE', state: 'VALUE', amountCents: 555_159, sourceClass: 'AGENT_ESTIMATE', professionalInputId: null },
    { key: 'PREPARATION_ALLOWANCE', state: 'UNKNOWN', amountCents: null, sourceClass: 'UNKNOWN', professionalInputId: null },
  ];
  const net = salePriceCents - 20_000_025 - 2_655_161;
  const record = {
    id,
    ownerAgentSubject: owner,
    scenarioKey: 'ATLAS CERTIFICATION',
    versionOrdinal,
    lifecycleState: 'REVIEWED',
    calculationContract: SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1,
    inputSnapshot: inputs,
    sourceQualification: inputs.map(({ key, state, sourceClass, professionalInputId }) => ({ key, state, sourceClass, professionalInputId })),
    professionalInputRefs: [],
    scenarioFingerprint: `scenario-fingerprint-${versionOrdinal}`,
    supersedesScenarioId,
    createdAt: new Date(asOf),
    reviewedAt: new Date(asOf),
    results: [] as Array<Record<string, unknown>>,
  };
  const result = {
    id: `result-${versionOrdinal}`,
    scenarioId: id,
    ownerAgentSubject: owner,
    calculationContract: SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1,
    resultPayload: {
      state: 'ESTIMATED',
      missingInputs: [],
      optionalUnknownInputs: ['PREPARATION_ALLOWANCE'],
      grossSalePriceCents: salePriceCents,
      estimatedPayoffCents: 20_000_025,
      totalEstimatedSellerCostsCents: 2_655_161,
      estimatedNetProceedsCents: net,
      netProceedsBasisPoints: Math.round((net * 10_000) / salePriceCents),
      includedCostKeys: ['SELLING_COMPENSATION', 'SELLER_CONCESSION', 'TITLE_CLOSING_ESTIMATE'],
      calculationContract: SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1,
      qualifier: 'ESTIMATED',
      asOf,
    },
    resultFingerprint: `result-fingerprint-${versionOrdinal}`,
    createdAt: new Date(asOf),
    immutableAt: new Date(asOf),
  };
  record.results = [result];
  return { record, result };
}

const v1 = scenario('scenario-v1', 1, 65_000_055);
const v2 = scenario('scenario-v2', 2, 66_000_055, v1.record.id);
const v1Composition = buildSellerFinancialOutputComposition(v1.record as never, v1.result as never);
const v2Composition = buildSellerFinancialOutputComposition(v2.record as never, v2.result as never);

assert.equal(SELLER_FINANCIAL_OUTPUT_INTEGRATION_VERSION, 'SELLER_FINANCIAL_OUTPUT_INTEGRATION_V1');
assert.equal(SELLER_FINANCIAL_OUTPUT_SEMANTIC_PROFILE_VERSION, 'SELLER_FINANCIAL_ESTIMATED_SCENARIO_V1');
assert.equal(v1Composition.semanticProfile.financials.estimatedNetProceedsCents, 42_344_869);
assert.equal(v2Composition.semanticProfile.financials.estimatedNetProceedsCents, 43_344_869);
assert.equal(v2Composition.semanticProfile.financials.estimatedNetProceedsCents - v1Composition.semanticProfile.financials.estimatedNetProceedsCents, 1_000_000);
assert.equal(v1Composition.semanticProfile.schemaVersion, SELLER_FINANCIAL_OUTPUT_SEMANTIC_PROFILE_VERSION);
assert.equal(v1Composition.semanticProfile.result.calculationContract, SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1);
assert.equal(v1Composition.semanticProfile.reviewState, 'AGENT_REVIEWED');
assert(v1Composition.semanticProfile.unknownZeroNotIncluded.some((item) => item.key === 'SELLER_CONCESSION' && item.state === 'ZERO_VALUE'));
assert(v1Composition.semanticProfile.unknownZeroNotIncluded.some((item) => item.key === 'PREPARATION_ALLOWANCE' && item.state === 'UNKNOWN'));
assert.equal(v1Composition.semanticProfile.sourceQualifications.find((item) => item.key === 'PAYOFF')?.sourceQualifier, 'Agent estimate');
assert.equal(v1Composition.dependencies.some((item) => item.upstreamArtifact === 'SellerFinancialScenario:scenario-v1' && item.dependencyType === 'FINANCIAL_DEPENDENCY'), true);
assert.equal(v1Composition.dependencies.some((item) => item.upstreamArtifact === 'SellerFinancialResult:result-1' && item.dependencyType === 'FINANCIAL_DEPENDENCY'), true);
assert.equal(v1Composition.evidence.sourceSnapshotRefs.length, 6);
assert.equal(v1Composition.evidence.metricRefs.length, 5);
assert.equal(v1Composition.evidence.reviewState, 'AGENT_REVIEWED');
assert.notEqual(v1Composition.contentFingerprint, v2Composition.contentFingerprint);
assert.notEqual(v1Composition.evidence.fingerprint, v2Composition.evidence.fingerprint);

const scenarios = [v1.record, v2.record];
type FakeVersion = Record<string, unknown> & { id: string; productId: string; idempotencyKey: string; reviewedAt: Date; immutableAt: Date; contentPayload: unknown };
const products: Array<{ id: string; ownerAgentSubject: string; productKind: string; audience: string; subjectRef: string }> = [];
const versions: FakeVersion[] = [];
let productSequence = 0;
let versionSequence = 0;
const fakePrisma: Record<string, unknown> = {
  $transaction: async <T>(callback: (transaction: unknown) => Promise<T>) => callback(fakePrisma),
  sellerFinancialScenario: {
    findFirst: async ({ where }: { where: { id: string; ownerAgentSubject: string } }) => scenarios.find((item) => item.id === where.id && item.ownerAgentSubject === where.ownerAgentSubject) ?? null,
  },
  outputProduct: {
    upsert: async ({ where, create }: { where: { ownerAgentSubject_productKind_audience_subjectRef: { ownerAgentSubject: string; productKind: string; audience: string; subjectRef: string } }; create: Record<string, unknown> }) => {
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
      const version = { ...data, id: `output-${++versionSequence}`, immutableAt: new Date(asOf) } as FakeVersion;
      versions.push(version);
      return version;
    },
    findMany: async ({ where }: { where: { ownerAgentSubject: string } }) => versions.filter((version) => version.ownerAgentSubject === where.ownerAgentSubject),
    findFirst: async ({ where }: { where: { id: string; ownerAgentSubject: string } }) => versions.find((version) => version.id === where.id && version.ownerAgentSubject === where.ownerAgentSubject) ?? null,
  },
};

const service = createOutputPersistenceService(fakePrisma as never);
const v1Request = parseOutputPersistenceSaveRequest({ financialScenarioId: 'scenario-v1', reviewConfirmation: 'AGENT_REVIEWED' });
const v2Request = parseOutputPersistenceSaveRequest({ financialScenarioId: 'scenario-v2', reviewConfirmation: 'AGENT_REVIEWED' });
assert.equal('financialScenarioId' in v1Request, true);
const first = await service.persistReviewedOutput(owner, v1Request);
const replay = await service.persistReviewedOutput(owner, v1Request);
const second = await service.persistReviewedOutput(owner, v2Request);
assert.equal(first.created, true);
assert.equal(replay.created, false);
assert.equal(first.id, replay.id);
assert.equal(second.created, true);
assert.equal(versions.length, 2);
assert.equal(products.length, 1, 'Financial V1/V2 output modules must share the existing Seller Presentation product convention.');
assert.equal(first.sellerFinancial?.estimatedNetProceedsCents, 42_344_869);
assert.equal(second.sellerFinancial?.estimatedNetProceedsCents, 43_344_869);
assert.equal((await service.listOwnedOutputHistory(owner)).length, 2);
assert.equal((await service.loadOwnedOutputForPdf(owner, first.id)).contentFingerprint, first.contentFingerprint);
await assert.rejects(() => service.persistReviewedOutput('other-agent', v1Request), /unavailable to this Agent/);
await assert.rejects(() => service.loadOwnedOutputForPdf('other-agent', first.id), /not available to this Agent/);
assert.throws(() => parseOutputPersistenceSaveRequest({ financialScenarioId: '', reviewConfirmation: 'AGENT_REVIEWED' }));
assert.throws(() => parseOutputPersistenceSaveRequest({ financialScenarioId: 'scenario-v1' }));
assert.notEqual(buildOutputPersistenceIdempotencyKey(owner, { sourceVersionRef: v1Composition.sourceVersionRef } as never), buildOutputPersistenceIdempotencyKey(owner, { sourceVersionRef: v2Composition.sourceVersionRef } as never));

for (const model of ['OutputVersion', 'OutputEvidenceSnapshot', 'OutputDependency', 'OutputReview', 'OutputDecision', 'OutputCheckpoint']) {
  assert(schema.includes(`model ${model} {`), `schema missing ${model}`);
  assert(migration.includes(`CREATE TRIGGER "${model}_append_only"`), `append-only trigger missing for ${model}`);
}
assert(schema.includes('FINANCIAL_DEPENDENCY'));
assert.equal(serviceSource.includes('financialScenarioId'), true);
assert.equal(serviceSource.includes('sellerFinancialScenario.findFirst'), true);
assert.equal(serviceSource.includes('outputVersion.update('), false);
assert.equal(serviceSource.includes('outputVersion.delete('), false);
assert.equal(integrationSource.includes('calculateSellerFinancialScenario('), false, 'Output integration must not recalculate a persisted result.');
assert.equal(integrationSource.includes('OutputRender'), false);
assert.equal(routeSource.includes('isSameOriginAdminRequest(request)'), true);
assert.equal(componentSource.includes('data-testid="seller-financial-output-integration"'), true);
assert.equal(componentSource.includes('data-testid="persist-seller-financial-output"'), true);
assert.equal(componentSource.includes("fetch('/api/agent/seller-financial'"), true);
assert.equal(componentSource.includes('financialScenarioId'), true);
assert.equal(packageJson.scripts?.['check:seller-financial-output-integration'], 'jiti scripts/checkSellerFinancialOutputIntegration.ts');

console.log('SELLER_FINANCIAL_OUTPUT_INTEGRATION_CHECK: PASS');
