import type { Prisma, PrismaClient } from '@prisma/client';

import { investmentFingerprint } from './investmentBreakevenAnalysis';
import type { PersistableOutputFixture } from './outputPersistenceFoundation';

export const INVESTMENT_BREAKEVEN_OUTPUT_VERSION = 'INVESTMENT_BREAKEVEN_ANALYSIS_V1' as const;

type Database = PrismaClient;

export class InvestmentBreakevenOutputError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'REVIEW_REQUIRED', message: string) {
    super(message);
  }
}

function asRecord(value: Prisma.JsonValue): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function propertyRefs(inputSnapshot: Prisma.JsonValue) {
  const properties = asRecord(inputSnapshot).properties;
  if (!Array.isArray(properties)) return [];
  return properties.flatMap((property) => {
    if (!property || typeof property !== 'object' || Array.isArray(property)) return [];
    const value = property as Record<string, unknown>;
    return typeof value.sellerFinancialResultId === 'string' && value.sellerFinancialResultId
      ? [`SellerFinancialResult:${value.sellerFinancialResultId}`]
      : [];
  });
}

export async function buildInvestmentBreakevenOutputFixture(
  prisma: Database,
  ownerAgentSubject: string,
  raw: Readonly<{ analysisId: string; scenarioIds: readonly string[] }>,
): Promise<PersistableOutputFixture> {
  const scenarioIds = [...new Set(raw.scenarioIds)];
  if (!raw.analysisId || scenarioIds.length < 2 || scenarioIds.length !== raw.scenarioIds.length) {
    throw new InvestmentBreakevenOutputError('INVALID_REQUEST', 'Select at least two distinct reviewed scenarios for a comparison output.');
  }
  const analysis = await prisma.investmentAnalysis.findFirst({
    where: { id: raw.analysisId, ownerAgentSubject },
    include: { scenarios: { where: { id: { in: scenarioIds } }, include: { result: true } } },
  });
  if (!analysis) throw new InvestmentBreakevenOutputError('OWNERSHIP_DENIED', 'The selected investment analysis is unavailable to this Agent.');
  if (analysis.scenarios.length !== scenarioIds.length) throw new InvestmentBreakevenOutputError('OWNERSHIP_DENIED', 'A selected scenario is unavailable to this Agent.');

  const selected = scenarioIds.map((id) => analysis.scenarios.find((scenario) => scenario.id === id)!);
  if (selected.some((scenario) => scenario.lifecycleState !== 'AGENT_REVIEWED' || !scenario.result)) {
    throw new InvestmentBreakevenOutputError('REVIEW_REQUIRED', 'Every comparison scenario must be Agent reviewed with an immutable result.');
  }

  const material = selected.map((scenario) => ({
    scenarioId: scenario.id,
    scenarioKey: scenario.scenarioKey,
    scenarioVersionOrdinal: scenario.versionOrdinal,
    scenarioLifecycleState: scenario.lifecycleState,
    scenarioInputFingerprint: scenario.inputFingerprint,
    resultId: scenario.result!.id,
    resultFingerprint: scenario.result!.resultFingerprint,
    inputSnapshot: scenario.inputSnapshot,
    resultSnapshot: scenario.result!.resultSnapshot,
  }));
  const contentPayload = Object.freeze({
    schemaVersion: INVESTMENT_BREAKEVEN_OUTPUT_VERSION,
    analysis: {
      id: analysis.id,
      analysisKey: analysis.analysisKey,
      title: analysis.title,
      purpose: analysis.purpose,
      calculationVersion: analysis.calculationVersion,
      assumptionPolicy: analysis.assumptionPolicy,
    },
    selectedComparisonState: material.map(({ scenarioId, scenarioKey, scenarioVersionOrdinal, resultId, resultFingerprint }) => ({ scenarioId, scenarioKey, scenarioVersionOrdinal, resultId, resultFingerprint })),
    scenarios: material,
    qualification: 'AGENT_INTERNAL_SYNTHETIC_CERTIFICATION',
    reviewState: 'AGENT_REVIEWED',
    limitations: [
      'Results are modeled estimates based on the selected immutable scenario assumptions.',
      'Financing, rent, vacancy, expenses, and future value are not guaranteed.',
      'Tax consequences, loan qualification, and lender approval are not modeled.',
    ],
  });
  const contentFingerprint = investmentFingerprint(contentPayload);
  const sellerFinancialRefs = [...new Set(selected.flatMap((scenario) => propertyRefs(scenario.inputSnapshot)))];
  const existingProduct = await prisma.outputProduct.findFirst({
    where: { ownerAgentSubject, productKind: 'MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS', audience: 'AGENT_INTERNAL', subjectRef: `InvestmentAnalysis:${analysis.id}` },
    select: { id: true },
  });
  const priorReviewedVersion = existingProduct
    ? await prisma.outputVersion.findFirst({ where: { productId: existingProduct.id, lifecycleState: 'AGENT_REVIEWED' }, orderBy: { versionOrdinal: 'desc' }, select: { id: true } })
    : null;
  const dependencyInput = selected.flatMap((scenario) => [
    {
      upstreamArtifact: `InvestmentScenario:${scenario.id}`,
      downstreamArtifact: INVESTMENT_BREAKEVEN_OUTPUT_VERSION,
      dependencyType: 'AGENT_INPUT_DEPENDENCY' as const,
      materiality: 'HIGH' as const,
      versionUsed: scenario.inputFingerprint,
      fieldMetricScope: ['inputSnapshot', 'sourceQualification', 'dependencySnapshot'],
      changePolicy: 'A different scenario input set requires a successor investment comparison output.',
      invalidationPolicy: 'RECOMPUTE_REQUIRED' as const,
      reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const,
      currentState: 'CURRENT' as const,
    },
    {
      upstreamArtifact: `InvestmentScenarioResult:${scenario.result!.id}`,
      downstreamArtifact: INVESTMENT_BREAKEVEN_OUTPUT_VERSION,
      dependencyType: 'FINANCIAL_DEPENDENCY' as const,
      materiality: 'HIGH' as const,
      versionUsed: scenario.result!.resultFingerprint,
      fieldMetricScope: ['resultSnapshot', 'calculationVersion', 'resultFingerprint'],
      changePolicy: 'A different immutable scenario result requires a successor investment comparison output.',
      invalidationPolicy: 'RECOMPUTE_REQUIRED' as const,
      reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const,
      currentState: 'CURRENT' as const,
    },
  ]);
  const dependencies = Object.freeze([
    {
      upstreamArtifact: `InvestmentAnalysis:${analysis.id}`,
      downstreamArtifact: INVESTMENT_BREAKEVEN_OUTPUT_VERSION,
      dependencyType: 'FINANCIAL_DEPENDENCY' as const,
      materiality: 'HIGH' as const,
      versionUsed: `${analysis.calculationVersion}|${analysis.assumptionPolicy}`,
      fieldMetricScope: ['analysisKey', 'calculationVersion', 'assumptionPolicy'],
      changePolicy: 'A different analysis policy requires a successor investment comparison output.',
      invalidationPolicy: 'RECOMPUTE_REQUIRED' as const,
      reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const,
      currentState: 'CURRENT' as const,
    },
    ...dependencyInput,
    ...sellerFinancialRefs.map((reference) => ({
      upstreamArtifact: reference,
      downstreamArtifact: INVESTMENT_BREAKEVEN_OUTPUT_VERSION,
      dependencyType: 'FINANCIAL_DEPENDENCY' as const,
      materiality: 'HIGH' as const,
      versionUsed: reference,
      fieldMetricScope: ['sellerFinancialResultId'],
      changePolicy: 'A revised Seller Financial result requires a successor investment comparison output.',
      invalidationPolicy: 'REVIEW_REQUIRED' as const,
      reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const,
      currentState: 'CURRENT' as const,
    })),
  ]);
  const selectedRef = material.map((scenario) => `${scenario.scenarioId}:${scenario.resultFingerprint}`).join('|');
  const evidenceFingerprint = investmentFingerprint({ analysisId: analysis.id, selectedRef, contentFingerprint, sellerFinancialRefs });
  return Object.freeze({
    sourceVersionRef: `${INVESTMENT_BREAKEVEN_OUTPUT_VERSION}:${analysis.id}:${investmentFingerprint(selectedRef)}`,
    outputProductId: `investment-breakeven:${analysis.id}`,
    productKind: 'MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS',
    audience: 'AGENT_INTERNAL',
    subjectRef: `InvestmentAnalysis:${analysis.id}`,
    purpose: 'Agent-reviewed internal investment breakeven comparison assembled from immutable scenario results.',
    displayVersion: `Investment Breakeven / ${material.map((scenario) => scenario.scenarioKey).join(' vs ')}`,
    effectiveAsOf: analysis.createdAt.toISOString().slice(0, 10),
    contentVersion: INVESTMENT_BREAKEVEN_OUTPUT_VERSION,
    compositionVersion: INVESTMENT_BREAKEVEN_OUTPUT_VERSION,
    presentationVisualVersion: 'INVESTMENT_BREAKEVEN_AGENT_WORKSPACE_V1',
    outputContractVersion: INVESTMENT_BREAKEVEN_OUTPUT_VERSION,
    payloadSchemaVersion: INVESTMENT_BREAKEVEN_OUTPUT_VERSION,
    contentFingerprint,
    contentPayload: contentPayload as unknown as Prisma.JsonObject,
    lineage: Object.freeze({ analysisId: analysis.id, selectedScenarioResultRefs: selectedRef, ...(priorReviewedVersion ? { priorReviewedVersion: `OutputVersion:${priorReviewedVersion.id}` } : {}) }),
    evidence: Object.freeze({
      sourceSnapshotRefs: [`InvestmentAnalysis:${analysis.id}`, ...sellerFinancialRefs],
      metricRefs: material.map((scenario) => `InvestmentScenarioResult:${scenario.resultId}`),
      analysisRefs: material.map((scenario) => `InvestmentScenario:${scenario.scenarioId}`),
      agentInputRefs: material.map((scenario) => `InvestmentScenarioInput:${scenario.scenarioId}:${scenario.scenarioInputFingerprint}`),
      assumptionRefs: [analysis.calculationVersion, analysis.assumptionPolicy, ...material.map((scenario) => scenario.scenarioInputFingerprint)],
      limitationRefs: contentPayload.limitations,
      rightsRefs: ['SYNTHETIC_CERTIFICATION_INTERNAL_ONLY'],
      freshnessRefs: [`IMMUTABLE_RESULT_SET:${selectedRef}`],
      reviewState: 'AGENT_REVIEWED',
      fingerprint: evidenceFingerprint,
    }),
    dependencies,
    decisionRefs: material.map((scenario) => `InvestmentScenario:${scenario.scenarioId}`),
  });
}
