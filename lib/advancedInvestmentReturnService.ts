import type { Prisma, PrismaClient } from '@prisma/client';

import {
  ADVANCED_INVESTMENT_RETURN_CALCULATION_V2,
  ADVANCED_INVESTMENT_RETURN_POLICY_V2,
  advancedReturnFingerprint,
  calculateAdvancedReturn,
  validateAdvancedReturnRequest,
  type AdvancedReturnRequest,
} from './advancedInvestmentReturnAnalysis';

type Database = PrismaClient;
type RecordValue = Record<string, unknown>;

export class AdvancedReturnServiceError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'STALE_RESULT' | 'IMMUTABLE' | 'PERSISTENCE_UNAVAILABLE', message: string) { super(message); }
}

function record(value: unknown): RecordValue {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as RecordValue : {};
}

function text(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 160 || /[<>]/.test(value)) throw new AdvancedReturnServiceError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}

function requestFingerprint(ownerAgentSubject: string, input: AdvancedReturnRequest) {
  return advancedReturnFingerprint({ ownerAgentSubject, input, calculationVersion: ADVANCED_INVESTMENT_RETURN_CALCULATION_V2, projectionPolicy: ADVANCED_INVESTMENT_RETURN_POLICY_V2 });
}

function assumptions(input: AdvancedReturnRequest) {
  return Object.freeze({
    appreciationBasisPoints: input.appreciationBasisPoints,
    rentGrowthBasisPoints: input.rentGrowthBasisPoints,
    expenseGrowthBasisPoints: input.expenseGrowthBasisPoints,
    disposition: input.disposition,
    dispositionCostBasisPoints: input.dispositionCostBasisPoints,
    discountRateBasisPoints: input.discountRateBasisPoints,
  });
}

async function requireCurrentSource(prisma: Database, ownerAgentSubject: string, input: AdvancedReturnRequest) {
  if (input.sourceKind === 'INVESTMENT_SCENARIO') {
    const scenario = await prisma.investmentScenario.findFirst({
      where: { id: input.sourceArtifactId, ownerAgentSubject, lifecycleState: 'AGENT_REVIEWED', result: { is: { id: input.sourceResultId, ownerAgentSubject } } },
      include: { result: true, analysis: true },
    });
    if (!scenario || !scenario.result) throw new AdvancedReturnServiceError('OWNERSHIP_DENIED', 'The reviewed source Investment scenario is unavailable.');
    if (scenario.inputFingerprint !== input.sourceInputFingerprint) throw new AdvancedReturnServiceError('STALE_RESULT', 'The Investment source assumptions are no longer the selected immutable source.');
    return Object.freeze({ source: scenario, dependencies: [
      { upstreamArtifact: `InvestmentAnalysis:${scenario.analysisId}`, dependencyType: 'SOURCE_ANALYSIS', versionUsed: `${scenario.analysis.calculationVersion}|${scenario.analysis.assumptionPolicy}`, qualification: 'AGENT_REVIEWED' },
      { upstreamArtifact: `InvestmentScenario:${scenario.id}`, dependencyType: 'SOURCE_INPUT', versionUsed: scenario.inputFingerprint, qualification: 'AGENT_REVIEWED' },
      { upstreamArtifact: `InvestmentScenarioResult:${scenario.result.id}`, dependencyType: 'SOURCE_RESULT', versionUsed: scenario.result.resultFingerprint, qualification: 'IMMUTABLE' },
    ] });
  }
  const alternative = await prisma.strategyAlternative.findFirst({
    where: { id: input.sourceArtifactId, ownerAgentSubject, lifecycleState: 'AGENT_REVIEWED', results: { some: { id: input.sourceResultId, ownerAgentSubject, inputFingerprint: input.sourceInputFingerprint } } },
    include: { analysis: true, results: { where: { id: input.sourceResultId }, take: 1 } },
  });
  if (!alternative || !alternative.results[0]) throw new AdvancedReturnServiceError('OWNERSHIP_DENIED', 'The reviewed source Strategy alternative is unavailable.');
  if (alternative.inputFingerprint !== input.sourceInputFingerprint) throw new AdvancedReturnServiceError('STALE_RESULT', 'The Strategy source assumptions are no longer the selected immutable source.');
  return Object.freeze({ source: alternative, dependencies: [
    { upstreamArtifact: `StrategyAnalysis:${alternative.analysisId}`, dependencyType: 'SOURCE_ANALYSIS', versionUsed: `${alternative.analysis.engineVersion}|${alternative.analysis.assumptionPolicy}`, qualification: 'AGENT_REVIEWED' },
    { upstreamArtifact: `StrategyAlternative:${alternative.id}`, dependencyType: 'SOURCE_INPUT', versionUsed: alternative.inputFingerprint, qualification: 'AGENT_REVIEWED' },
    { upstreamArtifact: `StrategyAlternativeResult:${alternative.results[0].id}`, dependencyType: 'SOURCE_RESULT', versionUsed: alternative.results[0].resultFingerprint, qualification: 'IMMUTABLE' },
  ] });
}

export function createAdvancedInvestmentReturnService(prisma: Database) {
  async function listOwned(ownerAgentSubject: string) {
    return prisma.advancedInvestmentReturnAnalysis.findMany({
      where: { ownerAgentSubject },
      include: { projections: { include: { results: { orderBy: { versionOrdinal: 'desc' } }, dependencies: true, auditEvents: true, supersededByProjection: true }, orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async function createProjection(ownerAgentSubject: string, raw: unknown) {
    const owner = text(ownerAgentSubject, 'ownerAgentSubject');
    let input: AdvancedReturnRequest;
    try { input = validateAdvancedReturnRequest(raw); } catch (error) { throw new AdvancedReturnServiceError('INVALID_REQUEST', error instanceof Error ? error.message : 'Projection request is invalid.'); }
    const source = await requireCurrentSource(prisma, owner, input);
    const inputFingerprint = requestFingerprint(owner, input);
    return prisma.$transaction(async (tx) => {
      const analysis = await tx.advancedInvestmentReturnAnalysis.upsert({
        where: { ownerAgentSubject_analysisKey: { ownerAgentSubject: owner, analysisKey: input.analysisKey } },
        create: { ownerAgentSubject: owner, analysisKey: input.analysisKey, title: input.analysisTitle, purpose: input.analysisPurpose, lifecycleState: 'DRAFT', calculationVersion: ADVANCED_INVESTMENT_RETURN_CALCULATION_V2, projectionPolicy: ADVANCED_INVESTMENT_RETURN_POLICY_V2 },
        update: {},
      });
      const existing = await tx.advancedInvestmentReturnProjection.findUnique({ where: { inputFingerprint }, include: { results: { orderBy: { versionOrdinal: 'desc' } } } });
      if (existing) return { projection: existing, result: existing.results[0] ?? null, created: false };
      if (input.supersedesProjectionId) {
        const predecessor = await tx.advancedInvestmentReturnProjection.findFirst({ where: { id: input.supersedesProjectionId, ownerAgentSubject: owner } });
        if (!predecessor) throw new AdvancedReturnServiceError('NOT_FOUND', 'The predecessor projection is unavailable.');
      }
      const versionOrdinal = await tx.advancedInvestmentReturnProjection.count({ where: { analysisId: analysis.id, projectionKey: input.projectionKey } });
      const resultSnapshot = calculateAdvancedReturn(input);
      const projection = await tx.advancedInvestmentReturnProjection.create({
        data: {
          analysisId: analysis.id, ownerAgentSubject: owner, projectionKey: input.projectionKey, versionOrdinal: versionOrdinal + 1,
          analysisProfile: input.analysisProfile, sourceKind: input.sourceKind, sourceArtifactId: input.sourceArtifactId, sourceResultId: input.sourceResultId, sourceInputFingerprint: input.sourceInputFingerprint,
          lifecycleState: input.review ? 'AGENT_REVIEWED' : 'DRAFT', calculationVersion: ADVANCED_INVESTMENT_RETURN_CALCULATION_V2, projectionPolicy: ADVANCED_INVESTMENT_RETURN_POLICY_V2,
          selectedHorizonMonths: input.horizonMonths as Prisma.InputJsonValue, inputSnapshot: input as unknown as Prisma.InputJsonValue, assumptionSnapshot: assumptions(input) as Prisma.InputJsonValue,
          dependencySnapshot: { sourceArtifactId: input.sourceArtifactId, sourceResultId: input.sourceResultId, sourceInputFingerprint: input.sourceInputFingerprint, properties: input.properties.map((property) => ({ canonicalPropertyId: property.canonicalPropertyId, role: property.role, qualification: property.qualification })) } as Prisma.InputJsonValue,
          inputFingerprint, supersedesProjectionId: input.supersedesProjectionId, reviewedAt: input.review ? new Date() : null,
        },
      });
      const result = await tx.advancedInvestmentReturnProjectionResult.create({
        data: { projectionId: projection.id, ownerAgentSubject: owner, inputFingerprint, calculationVersion: ADVANCED_INVESTMENT_RETURN_CALCULATION_V2, projectionPolicy: ADVANCED_INVESTMENT_RETURN_POLICY_V2, versionOrdinal: 1, resultSnapshot: resultSnapshot as unknown as Prisma.InputJsonValue, resultFingerprint: advancedReturnFingerprint({ projectionId: projection.id, inputFingerprint, resultSnapshot }) },
      });
      await tx.advancedInvestmentReturnDependency.createMany({ data: [
        ...source.dependencies,
        ...input.properties.filter((property) => property.canonicalPropertyId).map((property) => ({ upstreamArtifact: `CanonicalPhysicalProperty:${property.canonicalPropertyId}`, dependencyType: 'PROPERTY_IDENTITY', versionUsed: input.sourceInputFingerprint, qualification: property.qualification })),
      ].map((dependency) => ({ projectionId: projection.id, ownerAgentSubject: owner, ...dependency, detail: { sourceKind: input.sourceKind, sourceArtifactId: input.sourceArtifactId } })) });
      await tx.advancedInvestmentReturnAuditEvent.createMany({ data: [
        { projectionId: projection.id, ownerAgentSubject: owner, eventType: 'PROJECTION_CREATED', eventFingerprint: advancedReturnFingerprint({ projectionId: projection.id, event: 'PROJECTION_CREATED' }) },
        { projectionId: projection.id, ownerAgentSubject: owner, eventType: 'RESULT_MATERIALIZED', eventFingerprint: advancedReturnFingerprint({ projectionId: projection.id, event: 'RESULT_MATERIALIZED', resultId: result.id }) },
      ] });
      return { projection, result, created: true };
    });
  }

  async function cloneProjection(ownerAgentSubject: string, sourceProjectionId: string, projectionKey: string) {
    const source = await prisma.advancedInvestmentReturnProjection.findFirst({ where: { id: text(sourceProjectionId, 'sourceProjectionId'), ownerAgentSubject } });
    if (!source) throw new AdvancedReturnServiceError('NOT_FOUND', 'The source projection is unavailable.');
    const input = record(source.inputSnapshot);
    return createProjection(ownerAgentSubject, { ...input, projectionKey: text(projectionKey, 'projectionKey'), supersedesProjectionId: source.id, review: false });
  }

  async function updateDraftAssumptions(ownerAgentSubject: string, projectionId: string, patch: RecordValue) {
    const projection = await prisma.advancedInvestmentReturnProjection.findFirst({ where: { id: text(projectionId, 'projectionId'), ownerAgentSubject } });
    if (!projection) throw new AdvancedReturnServiceError('NOT_FOUND', 'The projection is unavailable.');
    if (projection.lifecycleState === 'AGENT_REVIEWED') throw new AdvancedReturnServiceError('IMMUTABLE', 'Reviewed projections cannot be changed. Create a successor projection.');
    const current = record(projection.inputSnapshot);
    const candidate = { ...current, ...patch, review: false, supersedesProjectionId: current.supersedesProjectionId ?? null };
    let input: AdvancedReturnRequest;
    try { input = validateAdvancedReturnRequest(candidate); } catch (error) { throw new AdvancedReturnServiceError('INVALID_REQUEST', error instanceof Error ? error.message : 'Projection assumptions are invalid.'); }
    const fingerprint = requestFingerprint(ownerAgentSubject, input);
    const updated = await prisma.advancedInvestmentReturnProjection.update({ where: { id: projection.id }, data: { inputSnapshot: input as unknown as Prisma.InputJsonValue, assumptionSnapshot: assumptions(input) as Prisma.InputJsonValue, selectedHorizonMonths: input.horizonMonths as Prisma.InputJsonValue, inputFingerprint: fingerprint, lifecycleState: 'STALE_RESULT', reviewedAt: null } });
    await prisma.advancedInvestmentReturnAuditEvent.create({ data: { projectionId: projection.id, ownerAgentSubject, eventType: 'ASSUMPTIONS_CHANGED_STALE', eventFingerprint: advancedReturnFingerprint({ projectionId: projection.id, fingerprint, event: 'ASSUMPTIONS_CHANGED_STALE' }) } });
    return updated;
  }

  async function recalculateProjection(ownerAgentSubject: string, projectionId: string) {
    const projection = await prisma.advancedInvestmentReturnProjection.findFirst({ where: { id: text(projectionId, 'projectionId'), ownerAgentSubject }, include: { results: { orderBy: { versionOrdinal: 'desc' }, take: 1 } } });
    if (!projection) throw new AdvancedReturnServiceError('NOT_FOUND', 'The projection is unavailable.');
    if (projection.lifecycleState === 'AGENT_REVIEWED') throw new AdvancedReturnServiceError('IMMUTABLE', 'Reviewed projections cannot be recalculated. Create a successor projection.');
    const input = validateAdvancedReturnRequest(projection.inputSnapshot);
    const resultSnapshot = calculateAdvancedReturn(input);
    if (projection.results[0]?.inputFingerprint === projection.inputFingerprint) return { projection, result: projection.results[0], recalculated: false };
    return prisma.$transaction(async (tx) => {
      const latest = await tx.advancedInvestmentReturnProjectionResult.findFirst({ where: { projectionId: projection.id }, orderBy: { versionOrdinal: 'desc' } });
      const result = await tx.advancedInvestmentReturnProjectionResult.create({ data: { projectionId: projection.id, ownerAgentSubject, inputFingerprint: projection.inputFingerprint, calculationVersion: ADVANCED_INVESTMENT_RETURN_CALCULATION_V2, projectionPolicy: ADVANCED_INVESTMENT_RETURN_POLICY_V2, versionOrdinal: (latest?.versionOrdinal ?? 0) + 1, resultSnapshot: resultSnapshot as unknown as Prisma.InputJsonValue, resultFingerprint: advancedReturnFingerprint({ projectionId: projection.id, inputFingerprint: projection.inputFingerprint, resultSnapshot }) } });
      const current = await tx.advancedInvestmentReturnProjection.update({ where: { id: projection.id }, data: { lifecycleState: 'DRAFT' } });
      await tx.advancedInvestmentReturnAuditEvent.create({ data: { projectionId: projection.id, ownerAgentSubject, eventType: 'RESULT_RECALCULATED', eventFingerprint: advancedReturnFingerprint({ projectionId: projection.id, resultId: result.id, event: 'RESULT_RECALCULATED' }) } });
      return { projection: current, result, recalculated: true };
    });
  }

  async function reviewProjection(ownerAgentSubject: string, projectionId: string) {
    const projection = await prisma.advancedInvestmentReturnProjection.findFirst({ where: { id: text(projectionId, 'projectionId'), ownerAgentSubject }, include: { results: { orderBy: { versionOrdinal: 'desc' }, take: 1 } } });
    if (!projection) throw new AdvancedReturnServiceError('NOT_FOUND', 'The projection is unavailable.');
    if (projection.lifecycleState === 'AGENT_REVIEWED') return { projection, reviewed: false };
    if (!projection.results[0] || projection.results[0].inputFingerprint !== projection.inputFingerprint) throw new AdvancedReturnServiceError('STALE_RESULT', 'Recalculate the current assumptions before Agent review.');
    return prisma.$transaction(async (tx) => {
      const reviewed = await tx.advancedInvestmentReturnProjection.update({ where: { id: projection.id }, data: { lifecycleState: 'AGENT_REVIEWED', reviewedAt: new Date() } });
      await tx.advancedInvestmentReturnAuditEvent.create({ data: { projectionId: projection.id, ownerAgentSubject, eventType: 'PROJECTION_AGENT_REVIEWED', eventFingerprint: advancedReturnFingerprint({ projectionId: projection.id, event: 'PROJECTION_AGENT_REVIEWED' }) } });
      return { projection: reviewed, reviewed: true };
    });
  }

  async function sensitivity(ownerAgentSubject: string, projectionId: string, patch: RecordValue) {
    const projection = await prisma.advancedInvestmentReturnProjection.findFirst({ where: { id: text(projectionId, 'projectionId'), ownerAgentSubject } });
    if (!projection) throw new AdvancedReturnServiceError('NOT_FOUND', 'The projection is unavailable.');
    return calculateAdvancedReturn(validateAdvancedReturnRequest({ ...record(projection.inputSnapshot), ...patch, review: false }));
  }

  return Object.freeze({ listOwned, createProjection, cloneProjection, updateDraftAssumptions, recalculateProjection, reviewProjection, sensitivity });
}
