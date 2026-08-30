import { Prisma, type OutputVersion, type PrismaClient } from '@prisma/client';

import {
  ATLAS_OUTPUT_VERSION_LIFECYCLE_STATES,
  buildOutputVersionLineageInvalidationFoundation,
  type AtlasOutputDependency,
  type AtlasOutputEvidenceSnapshot,
  type AtlasOutputVersion,
} from './outputVersionLineageInvalidationFoundation';
import {
  buildSellerFinancialOutputComposition,
  isSellerFinancialOutputSemanticProfile,
  SELLER_FINANCIAL_OUTPUT_INTEGRATION_VERSION,
  SELLER_FINANCIAL_OUTPUT_SEMANTIC_PROFILE_VERSION,
  type SellerFinancialOutputDependency,
} from './sellerFinancialOutputIntegration';

export const OUTPUT_PERSISTENCE_FOUNDATION_VERSION = 'OUTPUT_PERSISTENCE_FOUNDATION_V1' as const;
export const OUTPUT_PERSISTENCE_PAYLOAD_SCHEMA_VERSION = 'OUTPUT_PERSISTENCE_PAYLOAD_V1' as const;
export const OUTPUT_PERSISTENCE_REVIEW_POLICY = 'PERSIST_REVIEWED_ONLY_V1' as const;
export const OUTPUT_PERSISTENCE_API_ROUTE = '/api/agent/outputs' as const;
export const OUTPUT_PERSISTENCE_SUPPORTED_SOURCE_VERSION_REFS = [
  'seller-decision-brief-v2-reviewed',
  'seller-update-current-version',
] as const;

export type OutputPersistenceSupportedSourceVersionRef = (typeof OUTPUT_PERSISTENCE_SUPPORTED_SOURCE_VERSION_REFS)[number];

type StringRecord = Readonly<Record<string, string | null>>;
type PersistableOutputDependency = Omit<AtlasOutputDependency, 'id'>;

export type PersistableOutputFixture = Readonly<{
  sourceVersionRef: string;
  outputProductId: string;
  productKind: AtlasOutputVersion['productKind'];
  audience: AtlasOutputVersion['audience'];
  subjectRef: string;
  purpose: string;
  displayVersion: string;
  effectiveAsOf: string;
  contentVersion: string;
  compositionVersion: string;
  presentationVisualVersion: string;
  outputContractVersion: string;
  payloadSchemaVersion: string;
  contentFingerprint: string;
  contentPayload: Prisma.JsonObject;
  lineage: StringRecord;
  evidence: Readonly<{
    sourceSnapshotRefs: readonly Prisma.JsonValue[];
    metricRefs: readonly Prisma.JsonValue[];
    analysisRefs: readonly Prisma.JsonValue[];
    agentInputRefs: readonly Prisma.JsonValue[];
    assumptionRefs: readonly Prisma.JsonValue[];
    limitationRefs: readonly Prisma.JsonValue[];
    rightsRefs: readonly Prisma.JsonValue[];
    freshnessRefs: readonly Prisma.JsonValue[];
    reviewState: string;
    fingerprint: string;
  }>;
  dependencies: readonly PersistableOutputDependency[];
  decisionRefs: readonly string[];
}>;

export type LegacyOutputPersistenceSaveRequest = Readonly<{
  sourceVersionRef: OutputPersistenceSupportedSourceVersionRef;
  reviewConfirmation: 'AGENT_REVIEWED';
  reviewNote?: string;
}>;

export type SellerFinancialOutputPersistenceSaveRequest = Readonly<{
  financialScenarioId: string;
  reviewConfirmation: 'AGENT_REVIEWED';
  reviewNote?: string;
}>;

export type OutputPersistenceSaveRequest = LegacyOutputPersistenceSaveRequest | SellerFinancialOutputPersistenceSaveRequest;

export type PersistedOutputSummary = Readonly<{
  id: string;
  productId: string;
  sourceVersionRef: string;
  versionOrdinal: number;
  displayVersion: string;
  contentFingerprint: string;
  lifecycleState: string;
  reviewedAt: string;
  immutableAt: string;
  created: boolean;
  sellerFinancial?: Readonly<{
    scenarioVersionOrdinal: number;
    estimatedNetProceedsCents: number;
    asOf: string;
    qualifier: 'ESTIMATED';
  }>;
}>;

export class OutputPersistenceError extends Error {
  constructor(
    readonly code:
      | 'INVALID_REQUEST'
      | 'UNSUPPORTED_SOURCE_VERSION'
      | 'REVIEW_CONFIRMATION_REQUIRED'
      | 'OWNERSHIP_DENIED'
      | 'IMMUTABLE_VERSION'
      | 'PERSISTENCE_CONFLICT'
      | 'PERSISTENCE_UNAVAILABLE',
    message: string,
  ) {
    super(message);
  }
}

function referenceIds(values: readonly { id: string }[]) {
  return values.map((value) => value.id);
}

function outputLineage(version: AtlasOutputVersion): StringRecord {
  return Object.freeze({
    parentVersion: version.parentVersion,
    priorReviewedVersion: version.priorReviewedVersion,
    derivedFromVersion: version.derivedFromVersion,
    revisedFromVersion: version.revisedFromVersion,
    refreshedFromVersion: version.refreshedFromVersion,
    recomposedFromVersion: version.recomposedFromVersion,
    supersedesVersion: version.supersedesVersion,
    supersededByVersion: version.supersededByVersion,
  });
}

function requireSupportedSourceVersionRef(value: string): OutputPersistenceSupportedSourceVersionRef {
  if (!OUTPUT_PERSISTENCE_SUPPORTED_SOURCE_VERSION_REFS.includes(value as OutputPersistenceSupportedSourceVersionRef)) {
    throw new OutputPersistenceError('UNSUPPORTED_SOURCE_VERSION', 'The selected output version is not enabled for V1 persistence.');
  }
  return value as OutputPersistenceSupportedSourceVersionRef;
}

function requireEvidenceSnapshot(version: AtlasOutputVersion, evidenceSnapshots: readonly AtlasOutputEvidenceSnapshot[]) {
  const snapshot = evidenceSnapshots.find((candidate) => candidate.outputVersionId === version.id);
  if (!snapshot) throw new OutputPersistenceError('PERSISTENCE_UNAVAILABLE', 'The output has no governed evidence snapshot.');
  return snapshot;
}

export function buildPersistableOutputFixture(sourceVersionRef: string): PersistableOutputFixture {
  const supportedSourceVersionRef = requireSupportedSourceVersionRef(sourceVersionRef);
  const foundation = buildOutputVersionLineageInvalidationFoundation();
  const version = foundation.outputVersions.find((candidate) => candidate.id === supportedSourceVersionRef);
  if (!version) throw new OutputPersistenceError('PERSISTENCE_UNAVAILABLE', 'The selected output fixture is unavailable.');
  const evidence = requireEvidenceSnapshot(version, foundation.evidenceSnapshots);
  const dependencies = foundation.dependencies.filter((dependency) => version.dependencyReferences.includes(dependency.id));

  return Object.freeze({
    sourceVersionRef: supportedSourceVersionRef,
    outputProductId: version.outputProductId,
    productKind: version.productKind,
    audience: version.audience,
    subjectRef: version.subject,
    purpose: version.purpose,
    displayVersion: version.displayVersion,
    effectiveAsOf: version.effectiveAsOf,
    contentVersion: version.contentVersion,
    compositionVersion: version.compositionVersion,
    presentationVisualVersion: version.presentationVisualVersion,
    contentFingerprint: version.contentFingerprint,
    outputContractVersion: OUTPUT_PERSISTENCE_FOUNDATION_VERSION,
    payloadSchemaVersion: OUTPUT_PERSISTENCE_PAYLOAD_SCHEMA_VERSION,
    contentPayload: Object.freeze({
      schemaVersion: OUTPUT_PERSISTENCE_PAYLOAD_SCHEMA_VERSION,
      sourceVersionRef: version.id,
      contentVersion: version.contentVersion,
      compositionVersion: version.compositionVersion,
      presentationVisualVersion: version.presentationVisualVersion,
      referenceGroups: Object.freeze({
        preparation: referenceIds(version.preparationReferences),
        intelligence: referenceIds(version.intelligenceReferences),
        analysis: referenceIds(version.analysisReferences),
        narrative: referenceIds(version.narrativeReferences),
        recommendation: referenceIds(version.recommendationReferences),
        pricing: referenceIds(version.pricingReferences),
        postLaunch: referenceIds(version.postLaunchReferences),
        decision: referenceIds(version.sellerClientDecisionReferences),
      }),
    }) as Prisma.JsonObject,
    lineage: outputLineage(version),
    evidence: Object.freeze({
      sourceSnapshotRefs: [...evidence.sourceSnapshotReferences],
      metricRefs: [...evidence.metricReferences],
      analysisRefs: [...evidence.analysisReferences],
      agentInputRefs: [...evidence.agentInputReferences],
      assumptionRefs: [...evidence.assumptionReferences],
      limitationRefs: [...evidence.limitationReferences],
      rightsRefs: [...evidence.rightsReferences],
      freshnessRefs: [...evidence.freshnessReferences],
      reviewState: evidence.reviewState,
      fingerprint: evidence.fingerprint,
    }),
    dependencies,
    decisionRefs: referenceIds(version.sellerClientDecisionReferences),
  });
}

export function parseOutputPersistenceSaveRequest(value: unknown): OutputPersistenceSaveRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new OutputPersistenceError('INVALID_REQUEST', 'The output persistence request must be an object.');
  }
  const input = value as Record<string, unknown>;
  if (input.reviewConfirmation !== 'AGENT_REVIEWED') {
    throw new OutputPersistenceError('REVIEW_CONFIRMATION_REQUIRED', 'An Agent review confirmation is required before persistence.');
  }
  if (input.reviewNote !== undefined && (typeof input.reviewNote !== 'string' || input.reviewNote.length > 500)) {
    throw new OutputPersistenceError('INVALID_REQUEST', 'The review note is invalid.');
  }
  if (typeof input.financialScenarioId === 'string' && input.financialScenarioId.trim()) {
    return Object.freeze({ financialScenarioId: input.financialScenarioId, reviewConfirmation: 'AGENT_REVIEWED', reviewNote: input.reviewNote as string | undefined });
  }
  if (typeof input.sourceVersionRef !== 'string') {
    throw new OutputPersistenceError('INVALID_REQUEST', 'A source output version or reviewed Seller Financial scenario is required.');
  }
  return Object.freeze({ sourceVersionRef: requireSupportedSourceVersionRef(input.sourceVersionRef), reviewConfirmation: 'AGENT_REVIEWED', reviewNote: input.reviewNote as string | undefined });
}

function sellerFinancialSummary(contentPayload: Prisma.JsonValue) {
  if (!isSellerFinancialOutputSemanticProfile(contentPayload)) return undefined;
  return Object.freeze({
    scenarioVersionOrdinal: contentPayload.scenario.versionOrdinal,
    estimatedNetProceedsCents: contentPayload.financials.estimatedNetProceedsCents,
    asOf: contentPayload.result.asOf,
    qualifier: 'ESTIMATED' as const,
  });
}

export function serializePersistedOutputSummary(version: Pick<OutputVersion, 'id' | 'productId' | 'sourceVersionRef' | 'versionOrdinal' | 'displayVersion' | 'contentFingerprint' | 'lifecycleState' | 'reviewedAt' | 'immutableAt' | 'contentPayload'>, created: boolean): PersistedOutputSummary {
  const sellerFinancial = sellerFinancialSummary(version.contentPayload);
  return Object.freeze({
    id: version.id,
    productId: version.productId,
    sourceVersionRef: version.sourceVersionRef,
    versionOrdinal: version.versionOrdinal,
    displayVersion: version.displayVersion,
    contentFingerprint: version.contentFingerprint,
    lifecycleState: version.lifecycleState,
    reviewedAt: version.reviewedAt.toISOString(),
    immutableAt: version.immutableAt.toISOString(),
    created,
    ...(sellerFinancial ? { sellerFinancial } : {}),
  });
}

export function buildOutputPersistenceIdempotencyKey(ownerAgentSubject: string, fixture: PersistableOutputFixture) {
  return `ATLAS_OUTPUT_PERSISTENCE_V1|${ownerAgentSubject}|${fixture.outputProductId}|${fixture.sourceVersionRef}|${fixture.contentFingerprint}`;
}

export function createOutputPersistenceService(prisma: PrismaClient) {
  async function buildSellerFinancialFixture(ownerAgentSubject: string, scenarioId: string): Promise<PersistableOutputFixture> {
    const scenario = await prisma.sellerFinancialScenario.findFirst({
      where: { id: scenarioId, ownerAgentSubject },
      include: { results: true },
    });
    if (!scenario) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'The selected Seller Financial scenario is unavailable to this Agent.');
    const result = scenario.results.find((candidate) => candidate.calculationContract === scenario.calculationContract);
    if (!result) throw new OutputPersistenceError('PERSISTENCE_UNAVAILABLE', 'The selected Seller Financial result is unavailable.');
    const professionalInputIds = Array.isArray(scenario.professionalInputRefs)
      ? scenario.professionalInputRefs.flatMap((reference) => reference && typeof reference === 'object' && !Array.isArray(reference) && typeof (reference as { id?: unknown }).id === 'string' ? [(reference as { id: string }).id] : [])
      : [];
    if (professionalInputIds.length) {
      const professionalInputs = await prisma.professionalInput.findMany({ where: { id: { in: professionalInputIds }, ownerAgentSubject } });
      if (professionalInputs.length !== professionalInputIds.length) {
        throw new OutputPersistenceError('OWNERSHIP_DENIED', 'A Seller Financial professional-input provenance reference is unavailable to this Agent.');
      }
    }
    try {
      const composition = buildSellerFinancialOutputComposition(scenario, result);
      const productFixture = buildPersistableOutputFixture('seller-decision-brief-v2-reviewed');
      return Object.freeze({
        sourceVersionRef: composition.sourceVersionRef,
        outputProductId: productFixture.outputProductId,
        productKind: productFixture.productKind,
        audience: productFixture.audience,
        subjectRef: productFixture.subjectRef,
        purpose: 'Reviewed Seller Presentation financial scenario module.',
        displayVersion: composition.displayVersion,
        effectiveAsOf: composition.effectiveAsOf.toISOString().slice(0, 10),
        contentVersion: SELLER_FINANCIAL_OUTPUT_SEMANTIC_PROFILE_VERSION,
        compositionVersion: SELLER_FINANCIAL_OUTPUT_INTEGRATION_VERSION,
        presentationVisualVersion: 'SELLER_FINANCIAL_SEMANTIC_MODULE_V1',
        outputContractVersion: SELLER_FINANCIAL_OUTPUT_INTEGRATION_VERSION,
        payloadSchemaVersion: SELLER_FINANCIAL_OUTPUT_SEMANTIC_PROFILE_VERSION,
        contentFingerprint: composition.contentFingerprint,
        contentPayload: composition.semanticProfile as unknown as Prisma.JsonObject,
        lineage: Object.freeze({
          derivedFromVersion: `SellerFinancialScenario:${scenario.id}`,
          resultVersion: `SellerFinancialResult:${result.id}`,
          supersedesScenarioId: scenario.supersedesScenarioId,
        }),
        evidence: composition.evidence,
        dependencies: composition.dependencies as readonly SellerFinancialOutputDependency[],
        decisionRefs: [composition.decisionRef],
      });
    } catch (error) {
      if (error instanceof Error) throw new OutputPersistenceError('PERSISTENCE_UNAVAILABLE', error.message);
      throw error;
    }
  }

  async function persistReviewedOutput(ownerAgentSubject: string, request: OutputPersistenceSaveRequest): Promise<PersistedOutputSummary> {
    if (!ownerAgentSubject.trim()) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'An Agent owner identity is required.');
    const fixture = 'financialScenarioId' in request
      ? await buildSellerFinancialFixture(ownerAgentSubject, request.financialScenarioId)
      : buildPersistableOutputFixture(request.sourceVersionRef);
    const idempotencyKey = buildOutputPersistenceIdempotencyKey(ownerAgentSubject, fixture);

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await prisma.$transaction(async (tx) => {
          const product = await tx.outputProduct.upsert({
            where: {
              ownerAgentSubject_productKind_audience_subjectRef: {
                ownerAgentSubject,
                productKind: fixture.productKind,
                audience: fixture.audience,
                subjectRef: fixture.subjectRef,
              },
            },
            create: {
              ownerAgentSubject,
              productKind: fixture.productKind,
              audience: fixture.audience,
              subjectRef: fixture.subjectRef,
              purpose: fixture.purpose,
              outputContractVersion: fixture.outputContractVersion,
              lineageKey: `${ownerAgentSubject}|${fixture.productKind}|${fixture.audience}|${fixture.subjectRef}`,
            },
            update: {},
          });
          const existing = await tx.outputVersion.findUnique({ where: { idempotencyKey } });
          if (existing) return serializePersistedOutputSummary(existing, false);

          const count = await tx.outputVersion.count({ where: { productId: product.id } });
          const reviewedAt = new Date();
          const version = await tx.outputVersion.create({
            data: {
              productId: product.id,
              sourceVersionRef: fixture.sourceVersionRef,
              versionOrdinal: count + 1,
              idempotencyKey,
              outputContractVersion: fixture.outputContractVersion,
              displayVersion: fixture.displayVersion,
              audience: fixture.audience,
              subjectRef: fixture.subjectRef,
              purpose: fixture.purpose,
              effectiveAsOf: new Date(`${fixture.effectiveAsOf}T00:00:00.000Z`),
              lifecycleState: 'AGENT_REVIEWED',
              reviewState: 'AGENT_REVIEWED',
              contentVersion: fixture.contentVersion,
              compositionVersion: fixture.compositionVersion,
              presentationVisualVersion: fixture.presentationVisualVersion,
              contentFingerprint: fixture.contentFingerprint,
              payloadSchemaVersion: fixture.payloadSchemaVersion,
              contentPayload: fixture.contentPayload as Prisma.InputJsonValue,
              lineage: fixture.lineage as Prisma.InputJsonValue,
              ownerAgentSubject,
              reviewedAt,
              evidenceSnapshot: {
                create: {
                  snapshotSchemaVersion: fixture.payloadSchemaVersion,
                  sourceSnapshotRefs: fixture.evidence.sourceSnapshotRefs as Prisma.InputJsonValue,
                  metricRefs: fixture.evidence.metricRefs as Prisma.InputJsonValue,
                  analysisRefs: fixture.evidence.analysisRefs as Prisma.InputJsonValue,
                  agentInputRefs: fixture.evidence.agentInputRefs as Prisma.InputJsonValue,
                  assumptionRefs: fixture.evidence.assumptionRefs as Prisma.InputJsonValue,
                  limitationRefs: fixture.evidence.limitationRefs as Prisma.InputJsonValue,
                  rightsRefs: fixture.evidence.rightsRefs as Prisma.InputJsonValue,
                  freshnessRefs: fixture.evidence.freshnessRefs as Prisma.InputJsonValue,
                  reviewState: fixture.evidence.reviewState,
                  fingerprint: fixture.evidence.fingerprint,
                },
              },
              dependencies: {
                create: fixture.dependencies.map((dependency) => ({
                  upstreamArtifact: dependency.upstreamArtifact,
                  downstreamArtifact: dependency.downstreamArtifact,
                  dependencyType: dependency.dependencyType,
                  materiality: dependency.materiality,
                  versionUsed: dependency.versionUsed,
                  fieldMetricScope: dependency.fieldMetricScope as Prisma.InputJsonValue,
                  changePolicy: dependency.changePolicy,
                  invalidationPolicy: dependency.invalidationPolicy,
                  reviewPolicy: dependency.reviewPolicy,
                  currentState: dependency.currentState,
                })),
              },
              reviews: {
                create: {
                  reviewerSubject: ownerAgentSubject,
                  disposition: 'APPROVED',
                  reviewContractVersion: OUTPUT_PERSISTENCE_REVIEW_POLICY,
                  reviewedAt,
                  reviewNote: request.reviewNote,
                },
              },
              decisions: {
                create: fixture.decisionRefs.map((decisionRef) => ({
                  decisionRef,
                  disposition: 'SELECTED',
                  decisionSchemaVersion: OUTPUT_PERSISTENCE_PAYLOAD_SCHEMA_VERSION,
                  recordedBySubject: ownerAgentSubject,
                  recordedAt: reviewedAt,
                })),
              },
              checkpoints: {
                create: [{
                  checkpointRef: 'PERSISTED_REVIEWED_OUTPUT',
                  state: 'COMPLETED',
                  checkpointSchemaVersion: OUTPUT_PERSISTENCE_REVIEW_POLICY,
                  recordedBySubject: ownerAgentSubject,
                  recordedAt: reviewedAt,
                  detail: 'Reviewed output persisted as an immutable V1 version.',
                }],
              },
            },
          });
          return serializePersistedOutputSummary(version, true);
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          const existing = await prisma.outputVersion.findUnique({ where: { idempotencyKey } });
          if (existing) return serializePersistedOutputSummary(existing, false);
          if (attempt === 0) continue;
          throw new OutputPersistenceError('PERSISTENCE_CONFLICT', 'Concurrent output persistence could not be resolved.');
        }
        if (error instanceof OutputPersistenceError) throw error;
        throw new OutputPersistenceError('PERSISTENCE_UNAVAILABLE', 'Output persistence is unavailable.');
      }
    }
    throw new OutputPersistenceError('PERSISTENCE_CONFLICT', 'Concurrent output persistence could not be resolved.');
  }

  async function listOwnedOutputHistory(ownerAgentSubject: string): Promise<readonly PersistedOutputSummary[]> {
    if (!ownerAgentSubject.trim()) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'An Agent owner identity is required.');
    const versions = await prisma.outputVersion.findMany({
      where: { ownerAgentSubject },
      orderBy: [{ reviewedAt: 'desc' }, { versionOrdinal: 'desc' }],
    });
    return versions.map((version) => serializePersistedOutputSummary(version, false));
  }

  async function loadOwnedOutputForPdf(ownerAgentSubject: string, outputVersionId: string) {
    const version = await prisma.outputVersion.findFirst({
      where: { id: outputVersionId, ownerAgentSubject, lifecycleState: 'AGENT_REVIEWED' },
      select: { id: true, sourceVersionRef: true, contentFingerprint: true, contentPayload: true, immutableAt: true },
    });
    if (!version) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'The requested reviewed output is not available to this Agent.');
    return Object.freeze({
      outputVersionId: version.id,
      sourceVersionRef: version.sourceVersionRef,
      contentFingerprint: version.contentFingerprint,
      contentPayload: version.contentPayload,
      immutableAt: version.immutableAt.toISOString(),
    });
  }

  return Object.freeze({ persistReviewedOutput, listOwnedOutputHistory, loadOwnedOutputForPdf });
}

export function outputPersistenceLifecycleIsSupported(value: string) {
  return ATLAS_OUTPUT_VERSION_LIFECYCLE_STATES.includes(value as (typeof ATLAS_OUTPUT_VERSION_LIFECYCLE_STATES)[number]);
}
