import type { Prisma, PrismaClient } from '@prisma/client';

import { ADVANCED_INVESTMENT_RETURN_CALCULATION_V2, ADVANCED_INVESTMENT_RETURN_POLICY_V2, advancedReturnFingerprint } from './advancedInvestmentReturnAnalysis';
import type { PersistableOutputFixture } from './outputPersistenceFoundation';

export const ADVANCED_INVESTMENT_RETURN_OUTPUT_V2 = 'ADVANCED_INVESTMENT_RETURN_ANALYSIS_V2' as const;

export class AdvancedReturnOutputError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'STALE_RESULT' | 'PERSISTENCE_UNAVAILABLE', message: string) { super(message); }
}

export async function buildAdvancedReturnOutputFixture(prisma: PrismaClient, ownerAgentSubject: string, projectionId: string): Promise<PersistableOutputFixture> {
  const projection = await prisma.advancedInvestmentReturnProjection.findFirst({
    where: { id: projectionId, ownerAgentSubject, lifecycleState: 'AGENT_REVIEWED' },
    include: { analysis: true, results: { orderBy: { versionOrdinal: 'desc' }, take: 1 }, dependencies: true },
  });
  if (!projection) throw new AdvancedReturnOutputError('OWNERSHIP_DENIED', 'The reviewed Advanced Return projection is unavailable to this Agent.');
  const result = projection.results[0];
  if (!result || result.inputFingerprint !== projection.inputFingerprint) throw new AdvancedReturnOutputError('STALE_RESULT', 'The current reviewed projection result is unavailable.');
  const input = projection.inputSnapshot as unknown as Record<string, unknown>;
  const properties = Array.isArray(input.properties) ? input.properties : [];
  const currentProduct = await prisma.outputProduct.findFirst({ where: { ownerAgentSubject, productKind: 'ADVISORY_BRIEFING', audience: 'AGENT_INTERNAL', subjectRef: `AdvancedInvestmentReturnAnalysis:${projection.analysisId}` }, select: { id: true } });
  const previous = currentProduct ? await prisma.outputVersion.findFirst({ where: { productId: currentProduct.id, lifecycleState: 'AGENT_REVIEWED' }, orderBy: { versionOrdinal: 'desc' }, select: { id: true } }) : null;
  const payload = Object.freeze({
    schemaVersion: ADVANCED_INVESTMENT_RETURN_OUTPUT_V2,
    executiveSummary: 'Agent-reviewed pre-tax modeled holding-period decision support. No recommendation, transaction action, client delivery, tax analysis, or financing event is created.',
    source: { analysisId: projection.analysisId, projectionId: projection.id, sourceKind: projection.sourceKind, sourceArtifactId: projection.sourceArtifactId, sourceResultId: projection.sourceResultId, sourceInputFingerprint: projection.sourceInputFingerprint },
    projection: { analysisProfile: projection.analysisProfile, projectionKey: projection.projectionKey, versionOrdinal: projection.versionOrdinal, calculationVersion: projection.calculationVersion, projectionPolicy: projection.projectionPolicy, selectedHorizonMonths: projection.selectedHorizonMonths, inputFingerprint: projection.inputFingerprint, assumptions: projection.assumptionSnapshot },
    inputSnapshot: projection.inputSnapshot,
    dependencies: projection.dependencies.map((dependency) => ({ upstreamArtifact: dependency.upstreamArtifact, dependencyType: dependency.dependencyType, versionUsed: dependency.versionUsed, qualification: dependency.qualification, detail: dependency.detail })),
    horizonSnapshots: result.resultSnapshot,
    limitations: [
      'Pre-tax modeled decision support only; not tax, legal, appraisal, underwriting, or investment advice.',
      'No automatic strategy recommendation, client delivery, provider action, secure document, CRM, MLS, Compass transaction record, or financial account action is available.',
      ...properties.some((property) => property && typeof property === 'object' && (property as Record<string, unknown>).debtModel === 'PAYMENT_ONLY_NON_AMORTIZING') ? ['Retained-loan source supplies a payment but not rate/term; its debt balance is preserved rather than fabricated as an amortization schedule.'] : [],
    ],
    questionsToVerify: ['Future property value, rent, expenses, financing terms, rental permission, disposition costs, and tax consequences are not guaranteed.'],
  });
  const contentFingerprint = advancedReturnFingerprint(payload);
  const dependencies = [
    { upstreamArtifact: `AdvancedInvestmentReturnAnalysis:${projection.analysisId}`, downstreamArtifact: ADVANCED_INVESTMENT_RETURN_OUTPUT_V2, dependencyType: 'FINANCIAL_DEPENDENCY' as const, materiality: 'HIGH' as const, versionUsed: `${projection.analysis.calculationVersion}|${projection.analysis.projectionPolicy}`, fieldMetricScope: ['calculationVersion', 'projectionPolicy'], changePolicy: 'A changed Advanced Return engine or policy requires a successor output.', invalidationPolicy: 'RECOMPUTE_REQUIRED' as const, reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const, currentState: 'CURRENT' as const },
    { upstreamArtifact: `AdvancedInvestmentReturnProjection:${projection.id}`, downstreamArtifact: ADVANCED_INVESTMENT_RETURN_OUTPUT_V2, dependencyType: 'AGENT_INPUT_DEPENDENCY' as const, materiality: 'HIGH' as const, versionUsed: projection.inputFingerprint, fieldMetricScope: ['inputSnapshot', 'assumptionSnapshot', 'selectedHorizonMonths', 'dependencySnapshot'], changePolicy: 'Changed assumptions require a successor Advanced Return output.', invalidationPolicy: 'RECOMPUTE_REQUIRED' as const, reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const, currentState: 'CURRENT' as const },
    { upstreamArtifact: `AdvancedInvestmentReturnProjectionResult:${result.id}`, downstreamArtifact: ADVANCED_INVESTMENT_RETURN_OUTPUT_V2, dependencyType: 'FINANCIAL_DEPENDENCY' as const, materiality: 'HIGH' as const, versionUsed: result.resultFingerprint, fieldMetricScope: ['resultSnapshot', 'calculationVersion', 'projectionPolicy'], changePolicy: 'A different immutable projection result requires a successor Advanced Return output.', invalidationPolicy: 'RECOMPUTE_REQUIRED' as const, reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const, currentState: 'CURRENT' as const },
    ...projection.dependencies.map((dependency) => ({ upstreamArtifact: dependency.upstreamArtifact, downstreamArtifact: ADVANCED_INVESTMENT_RETURN_OUTPUT_V2, dependencyType: 'FACT_DEPENDENCY' as const, materiality: 'HIGH' as const, versionUsed: dependency.versionUsed, fieldMetricScope: ['qualification', 'detail'], changePolicy: 'A changed governed source dependency requires a successor Advanced Return output.', invalidationPolicy: 'RECOMPUTE_REQUIRED' as const, reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const, currentState: 'CURRENT' as const })),
  ];
  return Object.freeze({
    sourceVersionRef: `${ADVANCED_INVESTMENT_RETURN_OUTPUT_V2}:${projection.id}:${result.resultFingerprint}`,
    outputProductId: `advanced-return:${projection.analysisId}`,
    productKind: 'ADVISORY_BRIEFING', audience: 'AGENT_INTERNAL', subjectRef: `AdvancedInvestmentReturnAnalysis:${projection.analysisId}`,
    purpose: 'Agent-reviewed advanced investment return holding-period analysis.',
    displayVersion: `Advanced Return / ${projection.projectionKey} / v${projection.versionOrdinal}`,
    effectiveAsOf: projection.createdAt.toISOString().slice(0, 10),
    contentVersion: ADVANCED_INVESTMENT_RETURN_OUTPUT_V2, compositionVersion: ADVANCED_INVESTMENT_RETURN_OUTPUT_V2,
    presentationVisualVersion: 'ADVANCED_INVESTMENT_RETURN_AGENT_WORKSPACE_V2', outputContractVersion: ADVANCED_INVESTMENT_RETURN_OUTPUT_V2, payloadSchemaVersion: ADVANCED_INVESTMENT_RETURN_OUTPUT_V2,
    contentFingerprint, contentPayload: payload as unknown as Prisma.JsonObject,
    lineage: Object.freeze({ advancedReturnAnalysisId: projection.analysisId, projectionId: projection.id, projectionResultId: result.id, ...(previous ? { priorReviewedVersion: `OutputVersion:${previous.id}` } : {}) }),
    evidence: Object.freeze({ sourceSnapshotRefs: projection.dependencies.map((dependency) => dependency.upstreamArtifact), metricRefs: [`AdvancedInvestmentReturnProjectionResult:${result.id}`], analysisRefs: [`AdvancedInvestmentReturnAnalysis:${projection.analysisId}`, `AdvancedInvestmentReturnProjection:${projection.id}`], agentInputRefs: [`AdvancedInvestmentReturnProjectionInput:${projection.id}:${projection.inputFingerprint}`], assumptionRefs: [ADVANCED_INVESTMENT_RETURN_CALCULATION_V2, ADVANCED_INVESTMENT_RETURN_POLICY_V2, projection.inputFingerprint], limitationRefs: (payload.limitations as unknown as Prisma.JsonValue[]), rightsRefs: ['SYNTHETIC_CERTIFICATION_INTERNAL_ONLY'], freshnessRefs: [`IMMUTABLE_ADVANCED_RETURN_RESULT:${result.id}`], reviewState: 'AGENT_REVIEWED', fingerprint: advancedReturnFingerprint({ contentFingerprint, projectionId: projection.id, resultId: result.id }) }),
    dependencies,
    decisionRefs: [`AdvancedInvestmentReturnProjection:${projection.id}`],
  });
}
