import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { ClientCaseEffectiveContextError, type EffectiveContext, type ResolvedInput } from '../lib/clientCaseEffectiveContextResolver';
import {
  ClientCaseCapabilityReadinessError,
  createClientCaseCapabilityReadinessServiceFromResolver,
  evaluateCapabilityReadinessFromContext,
} from '../lib/clientCaseCapabilityReadinessEvaluator';
import {
  assertCapabilityContractRegistryIntegrity,
  CAPABILITY_INPUT_CONTRACTS,
  type CapabilityInputContract,
} from '../lib/clientCaseCapabilityReadinessRegistry';

const evaluatorSource = readFileSync('lib/clientCaseCapabilityReadinessEvaluator.ts', 'utf8');
const registrySource = readFileSync('lib/clientCaseCapabilityReadinessRegistry.ts', 'utf8');
const schema = readFileSync('prisma/schema.prisma', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(packageJson.scripts?.['check:client-case-capability-readiness-foundation'], 'jiti scripts/checkClientCaseCapabilityReadinessFoundation.ts');
assert.match(evaluatorSource, /createClientCaseEffectiveContextResolver/);
assert.match(evaluatorSource, /await resolver\.resolve\(/);
assert.match(evaluatorSource, /evaluateCapabilityReadinessFromContext/);
assert.doesNotMatch(evaluatorSource, /\.create\(|\.update\(|\.delete\(|\.upsert\(|\$transaction/);
assert.doesNotMatch(evaluatorSource, /fetch\(|app\/api|NextResponse|react/i);
assert.doesNotMatch(registrySource, /PrismaClient|DATABASE_URL|fetch\(/);
assert.doesNotMatch(schema, /CapabilityReadiness|ReadinessResult|ReadinessCache/);
assertCapabilityContractRegistryIntegrity();

const now = new Date('2026-09-14T12:00:00.000Z');

function input(
  semanticKey: string,
  origin: ResolvedInput['origin'],
  sourceRecordId: string,
  options: Partial<ResolvedInput> = {},
): ResolvedInput {
  return {
    stableKey: `${origin}:${semanticKey}:${sourceRecordId}`,
    semanticKey,
    value: options.value ?? semanticKey,
    valueType: options.valueType ?? 'INTEGER',
    origin,
    sourceRecordId,
    sourceVersionId: options.sourceVersionId ?? null,
    scenarioVersionId: options.scenarioVersionId ?? null,
    provenance: options.provenance ?? { sourcePosture: 'CLIENT_STATED', evidenceAdmissionId: null, professionalInputId: null, verification: origin.startsWith('SCENARIO') ? 'HYPOTHETICAL_UNVERIFIED' : 'RECORDED' },
    temporal: options.temporal ?? { observedAt: null, effectiveAt: null, reviewAfter: null },
    contributingSourceRecordIds: options.contributingSourceRecordIds ?? [sourceRecordId],
    limitations: options.limitations ?? [],
  };
}

function context(options: {
  scenarioVersionId?: string;
  historical?: boolean;
  inputs?: readonly ResolvedInput[];
  objectives?: readonly string[];
  limitations?: EffectiveContext['limitations'];
} = {}): EffectiveContext {
  const scenario = options.scenarioVersionId
    ? { id: 'scenario-a', name: 'Synthetic Scenario', status: 'ACTIVE', currentVersionId: options.historical ? 'version-3' : options.scenarioVersionId, resolvedVersionId: options.scenarioVersionId, resolvedVersionNumber: Number(options.scenarioVersionId.replace('version-', '')) || 1, isHistorical: options.historical ?? false }
    : null;
  return {
    contractVersion: 'CANONICAL_CLIENT_CASE_EFFECTIVE_CONTEXT_RESOLVER_V1',
    resolutionRulesetVersion: 1,
    mode: scenario ? 'SCENARIO_VERSION' : 'CANONICAL_BASELINE',
    clientCase: { id: 'case-a', displayName: 'Synthetic Case A', status: 'ACTIVE' },
    scenario,
    objectives: (options.objectives ?? ['FINANCIAL_STRATEGY', 'BUY_PRIMARY_HOME']).map((objectiveType, index) => ({ id: `objective-${index}`, objectiveType, status: 'ACTIVE', title: objectiveType, createdAt: now, completedAt: null, archivedAt: null })),
    facts: [],
    criteria: [],
    properties: [],
    assumptions: [],
    scenarioCriteria: [],
    propertyDispositions: [],
    scenarioObjectiveLinks: [],
    resolvedInputs: [...(options.inputs ?? [])],
    conflicts: [],
    limitations: options.limitations ?? [],
    provenanceSummary: { canonicalSourcePostures: ['CLIENT_STATED'], scenarioVerification: scenario ? 'HYPOTHETICAL_UNVERIFIED' : null },
  } as EffectiveContext;
}

const buyerInputs = [
  input('TARGET_CITIES', 'CANONICAL_CRITERION', 'criterion-cities', { value: ['Boulder'], valueType: 'STRING_SET' }),
  input('PURCHASE_PRICE_RANGE_CENTS', 'CANONICAL_CRITERION', 'criterion-price', { value: { min: 50000000, max: 70000000 }, valueType: 'RANGE_CENTS' }),
  input('MIN_BEDROOMS', 'CANONICAL_CRITERION', 'criterion-bedrooms', { value: 3 }),
];
const scenarioOne = context({
  scenarioVersionId: 'version-1',
  historical: true,
  inputs: [
    ...buyerInputs,
    input('TARGET_ACQUISITION_PRICE_CENTS', 'SCENARIO_ASSUMPTION', 'assumption-price-v1', { value: 60000000, valueType: 'MONEY_CENTS', sourceVersionId: 'version-1', scenarioVersionId: 'version-1' }),
    input('DOWN_PAYMENT_BPS', 'SCENARIO_ASSUMPTION', 'assumption-down-v1', { value: 0, valueType: 'PERCENT_BPS', sourceVersionId: 'version-1', scenarioVersionId: 'version-1' }),
  ],
  limitations: [{ code: 'HISTORICAL_SCENARIO_WITH_CURRENT_CANONICAL_CONTEXT', semanticKey: null, sourceRecordId: 'version-1' }],
});
const scenarioTwo = context({
  scenarioVersionId: 'version-2',
  inputs: [
    ...buyerInputs,
    input('TARGET_ACQUISITION_PRICE_CENTS', 'SCENARIO_ASSUMPTION', 'assumption-price-v2', { value: 60000000, valueType: 'MONEY_CENTS', sourceVersionId: 'version-2', scenarioVersionId: 'version-2' }),
  ],
});
const scenarioThree = context({
  scenarioVersionId: 'version-3',
  inputs: [
    ...buyerInputs,
    input('DOWN_PAYMENT_BPS', 'SCENARIO_ASSUMPTION', 'assumption-down-v3', { value: 2000, valueType: 'PERCENT_BPS', sourceVersionId: 'version-3', scenarioVersionId: 'version-3' }),
  ],
});
const baseline = context({ inputs: buyerInputs });

const financial = CAPABILITY_INPUT_CONTRACTS.find((entry) => entry.capability === 'FINANCIAL_STRATEGY')!;
const buyer = CAPABILITY_INPUT_CONTRACTS.find((entry) => entry.capability === 'BUYER_DECISION')!;
const market = CAPABILITY_INPUT_CONTRACTS.find((entry) => entry.capability === 'MARKET_INTELLIGENCE')!;

const comprehensiveFinancial = evaluateCapabilityReadinessFromContext(scenarioOne, financial, { annualInterestRateBasisPoints: 0 }, now);
assert.equal(comprehensiveFinancial.status, 'COMPREHENSIVE_READY');
assert.equal(comprehensiveFinancial.context.scenarioVersionId, 'version-1');
assert.ok(comprehensiveFinancial.limitations.some((entry) => entry.code === 'HISTORICAL_SCENARIO_WITH_CURRENT_CANONICAL_CONTEXT' && entry.sourceRecordId === 'version-1'));
assert.equal(comprehensiveFinancial.requirements.find((entry) => entry.requirementId === 'FINANCIAL_STRATEGY_DOWN_PAYMENT_CONTEXT')?.presence, 'PRESENT');

const preliminaryFinancial = evaluateCapabilityReadinessFromContext(scenarioTwo, financial, { annualInterestRateBasisPoints: 0 }, now);
assert.equal(preliminaryFinancial.status, 'PRELIMINARY_READY');
assert.deepEqual(preliminaryFinancial.missingComprehensive, ['FINANCIAL_STRATEGY_DOWN_PAYMENT_CONTEXT']);

const insufficientFinancial = evaluateCapabilityReadinessFromContext(scenarioThree, financial, { annualInterestRateBasisPoints: 0 }, now);
assert.equal(insufficientFinancial.status, 'INSUFFICIENT');
assert.deepEqual(insufficientFinancial.missingPreliminary, ['FINANCIAL_STRATEGY_TARGET_ACQUISITION_PRICE']);

const comprehensiveBuyer = evaluateCapabilityReadinessFromContext(baseline, buyer, {}, now);
assert.equal(comprehensiveBuyer.status, 'COMPREHENSIVE_READY');
const helpfulMissingBuyer = evaluateCapabilityReadinessFromContext(context({ inputs: buyerInputs.filter((entry) => entry.semanticKey !== 'MIN_BEDROOMS') }), buyer, {}, now);
assert.equal(helpfulMissingBuyer.status, 'COMPREHENSIVE_READY');
assert.deepEqual(helpfulMissingBuyer.helpfulMissing, ['BUYER_DECISION_MIN_BEDROOMS']);

const marketState = evaluateCapabilityReadinessFromContext(context({ inputs: [] }), market, { marketScope: 'STATE' }, now);
assert.equal(marketState.status, 'COMPREHENSIVE_READY');
assert.equal(marketState.requirements.find((entry) => entry.requirementId === 'MARKET_INTELLIGENCE_TARGET_CITIES')?.presence, 'NOT_APPLICABLE');
const marketCity = evaluateCapabilityReadinessFromContext(baseline, market, { marketScope: 'CITY' }, now);
assert.equal(marketCity.status, 'COMPREHENSIVE_READY');

const requiredVerification = {
  ...buyer,
  requirements: buyer.requirements.map((entry) => entry.id === 'BUYER_DECISION_TARGET_CITIES' ? { ...entry, verificationPolicy: 'EVIDENCE_OR_PROFESSIONAL_INPUT_REQUIRED' as const } : entry),
} as CapabilityInputContract;
assert.equal(evaluateCapabilityReadinessFromContext(baseline, requiredVerification, {}, now).unverified.includes('BUYER_DECISION_TARGET_CITIES'), true);
const staleContract = {
  ...buyer,
  requirements: buyer.requirements.map((entry) => entry.id === 'BUYER_DECISION_TARGET_CITIES' ? { ...entry, freshnessPolicy: { kind: 'MAX_AGE_DAYS' as const, days: 1 } } : entry),
} as CapabilityInputContract;
const staleContext = context({ inputs: [input('TARGET_CITIES', 'CANONICAL_CRITERION', 'criterion-old-cities', { value: ['Boulder'], valueType: 'STRING_SET', temporal: { observedAt: new Date('2026-09-01T00:00:00.000Z'), effectiveAt: null, reviewAfter: null } }), ...buyerInputs.filter((entry) => entry.semanticKey !== 'TARGET_CITIES')] });
assert.equal(evaluateCapabilityReadinessFromContext(staleContext, staleContract, {}, now).stale.includes('BUYER_DECISION_TARGET_CITIES'), true);
const professionalContract = {
  ...buyer,
  requirements: buyer.requirements.map((entry) => entry.id === 'BUYER_DECISION_TARGET_CITIES' ? { ...entry, professionalInputPolicy: 'PROFESSIONAL_INPUT_REQUIRED' as const } : entry),
} as CapabilityInputContract;
assert.equal(evaluateCapabilityReadinessFromContext(baseline, professionalContract, {}, now).professionalInputNeeded.includes('BUYER_DECISION_TARGET_CITIES'), true);

assert.throws(
  () => assertCapabilityContractRegistryIntegrity([{ ...buyer, requirements: buyer.requirements.map((entry) => entry.id === 'BUYER_DECISION_TARGET_CITIES' ? { ...entry, semanticKey: 'UNKNOWN_SEMANTIC' } : entry) } as CapabilityInputContract]),
  /semantic is not registered/,
);
assert.throws(
  () => evaluateCapabilityReadinessFromContext(baseline, financial, { annualInterestRateBasisPoints: -1 }, now),
  (error: unknown) => error instanceof ClientCaseCapabilityReadinessError && error.code === 'INVALID_EXECUTION_PARAMETERS',
);
assert.deepEqual(
  evaluateCapabilityReadinessFromContext(scenarioOne, financial, { annualInterestRateBasisPoints: 0 }, now),
  comprehensiveFinancial,
);
assert.equal(JSON.stringify(comprehensiveFinancial).includes('60000000'), false);

const contexts = new Map<string, EffectiveContext>([
  ['agent-a:case-a:baseline', baseline],
  ['agent-a:case-a:version-1', scenarioOne],
  ['agent-a:case-a:version-2', scenarioTwo],
  ['agent-a:case-a:version-3', scenarioThree],
]);
let resolveCalls = 0;
const resolver = {
  async resolve(owner: string, clientCaseId: string, request: { mode: string; scenarioVersionId?: string }) {
    resolveCalls += 1;
    const key = `${owner}:${clientCaseId}:${request.mode === 'SCENARIO_VERSION' ? request.scenarioVersionId : 'baseline'}`;
    const resolved = contexts.get(key);
    if (!resolved) throw new ClientCaseEffectiveContextError('NOT_FOUND', 'The Client Case is unavailable to this Agent.');
    return resolved;
  },
};
const service = createClientCaseCapabilityReadinessServiceFromResolver(resolver);
const beforeState = JSON.stringify([...contexts.entries()]);
void (async () => {
  const serviceResult = await service.evaluate('agent-a', { clientCaseId: 'case-a', capability: 'FINANCIAL_STRATEGY', scenarioVersionId: 'version-1', executionParameters: { annualInterestRateBasisPoints: 0 } }, now);
  assert.equal(serviceResult.status, 'COMPREHENSIVE_READY');
  assert.equal(resolveCalls, 1);
  await assert.rejects(
    () => service.evaluate('agent-a', { clientCaseId: 'case-a', capability: 'PROPERTY_INTELLIGENCE' }, now),
    (error: unknown) => error instanceof ClientCaseCapabilityReadinessError && error.code === 'CAPABILITY_NOT_ADMITTED',
  );
  await assert.rejects(
    () => service.evaluate('agent-a', { clientCaseId: 'case-a', capability: 'UNKNOWN' as never }, now),
    (error: unknown) => error instanceof ClientCaseCapabilityReadinessError && error.code === 'UNKNOWN_CAPABILITY',
  );
  await assert.rejects(
    () => service.evaluate('agent-b', { clientCaseId: 'case-a', capability: 'BUYER_DECISION' }, now),
    (error: unknown) => error instanceof ClientCaseEffectiveContextError && error.code === 'NOT_FOUND',
  );
  await assert.rejects(
    () => service.evaluate('agent-a', { clientCaseId: 'unknown-case', capability: 'BUYER_DECISION' }, now),
    (error: unknown) => error instanceof ClientCaseEffectiveContextError && error.code === 'NOT_FOUND',
  );
  await assert.rejects(
    () => service.evaluate('agent-a', { clientCaseId: 'case-a', capability: 'BUYER_DECISION', scenarioVersionId: 'version-b' }, now),
    (error: unknown) => error instanceof ClientCaseEffectiveContextError && error.code === 'NOT_FOUND',
  );
  assert.equal(JSON.stringify([...contexts.entries()]), beforeState);
  console.log('CLIENT_CASE_CAPABILITY_READINESS_FOUNDATION_CHECK: PASS');
})().catch((error) => { console.error(error); process.exitCode = 1; });
