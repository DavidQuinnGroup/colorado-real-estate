import { createHash } from 'node:crypto';
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
import {
  adaptSellerFinancialModuleToSellerPresentation,
  isSellerPresentationFinancialModule,
  sellerPresentationFinancialModuleFingerprint,
  SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_VERSION,
} from './sellerPresentationFinancialModuleAdapter';
import {
  BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURE_IDS,
  BUYER_DECISION_BRIEF_FOUNDATION_VERSION,
  buyerDecisionBriefFingerprint,
  buyerDecisionBriefFixture,
  isBuyerDecisionBrief,
  type BuyerDecisionBriefCertificationFixtureId,
} from './buyerDecisionBriefFoundation';
import {
  buildSyntheticOutputReportComposition,
  OUTPUT_REPORT_COMPOSITION_FOUNDATION_VERSION,
  OUTPUT_REPORT_COMPOSITION_SCHEMA_VERSION,
  OUTPUT_REPORT_COMPOSITION_SYNTHETIC_SOURCE,
  OUTPUT_REPORT_COMPOSITION_SYNTHETIC_SUBJECT,
  outputReportCompositionFingerprint,
  parseOutputReportComposition,
  type OutputReportComposition,
} from './outputReportCompositionFoundation';

export const OUTPUT_PERSISTENCE_FOUNDATION_VERSION = 'OUTPUT_PERSISTENCE_FOUNDATION_V1' as const;
export const OUTPUT_PERSISTENCE_PAYLOAD_SCHEMA_VERSION = 'OUTPUT_PERSISTENCE_PAYLOAD_V1' as const;
export const OUTPUT_PERSISTENCE_REVIEW_POLICY = 'PERSIST_REVIEWED_ONLY_V1' as const;
export const OUTPUT_PERSISTENCE_API_ROUTE = '/api/agent/outputs' as const;
export const MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_VERSION = 'MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_V1' as const;

function multiPropertyScenarioOutputFingerprint(value: unknown) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}
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

export type SellerPresentationFinancialModulePersistenceSaveRequest = Readonly<{
  sellerPresentationFinancialOutputVersionId: string;
  reviewConfirmation: 'AGENT_REVIEWED';
  reviewNote?: string;
}>;

export type BuyerDecisionBriefPersistenceSaveRequest = Readonly<{
  buyerDecisionBriefFixtureId: BuyerDecisionBriefCertificationFixtureId;
  reviewConfirmation: 'AGENT_REVIEWED';
  reviewNote?: string;
}>;

export type OutputPersistenceSaveRequest =
  | LegacyOutputPersistenceSaveRequest
  | SellerFinancialOutputPersistenceSaveRequest
  | SellerPresentationFinancialModulePersistenceSaveRequest
  | BuyerDecisionBriefPersistenceSaveRequest;

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
  sellerPresentationFinancialModule?: Readonly<{
    estimatedNetProceedsCents: number;
    asOf: string;
    financialOutputVersionId: string;
  }>;
  buyerDecisionBrief?: Readonly<{
    fixtureId: BuyerDecisionBriefCertificationFixtureId;
    offerPriceContextCents: number;
  }>;
}>;

export type OutputProductDetail = Readonly<{
  id: string;
  productKind: string;
  audience: string;
  subjectRef: string;
  purpose: string;
  clientCase: Readonly<{ id: string; displayName: string; status: string }> | null;
  transaction: Readonly<{ id: string; label: string; stage: string }> | null;
  currentVersionId: string | null;
  reviewedVersionId: string | null;
  versions: ReadonlyArray<Readonly<{
    id: string;
    versionOrdinal: number;
    displayVersion: string;
    lifecycleState: string;
    reviewState: string;
    createdAt: string;
    reviewedAt: string;
    immutableAt: string;
    contentFingerprint: string;
    composition: OutputReportComposition | null;
    artifactState: 'NO_ARTIFACT';
    reviews: ReadonlyArray<Readonly<{ id: string; reviewerSubject: string; disposition: string; reviewedAt: string; reviewNote: string | null }>>;
    dependencies: ReadonlyArray<Readonly<{ id: string; upstreamArtifact: string; dependencyType: string; currentState: string; reviewPolicy: string }>>;
    decisions: ReadonlyArray<Readonly<{ id: string; decisionRef: string; disposition: string; recordedAt: string }>>;
    checkpoints: ReadonlyArray<Readonly<{ id: string; checkpointRef: string; state: string; recordedAt: string; detail: string | null }>>;
    evidenceSnapshot: Readonly<{ fingerprint: string; reviewState: string; sourceSnapshotRefs: Prisma.JsonValue; limitationRefs: Prisma.JsonValue }> | null;
  }>>;
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

function asComposition(payload: Prisma.JsonValue): OutputReportComposition | null {
  try { return parseOutputReportComposition(payload); } catch { return null; }
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
  if (typeof input.sellerPresentationFinancialOutputVersionId === 'string' && input.sellerPresentationFinancialOutputVersionId.trim()) {
    return Object.freeze({ sellerPresentationFinancialOutputVersionId: input.sellerPresentationFinancialOutputVersionId, reviewConfirmation: 'AGENT_REVIEWED', reviewNote: input.reviewNote as string | undefined });
  }
  if (typeof input.buyerDecisionBriefFixtureId === 'string' && BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURE_IDS.includes(input.buyerDecisionBriefFixtureId as BuyerDecisionBriefCertificationFixtureId)) {
    return Object.freeze({ buyerDecisionBriefFixtureId: input.buyerDecisionBriefFixtureId as BuyerDecisionBriefCertificationFixtureId, reviewConfirmation: 'AGENT_REVIEWED', reviewNote: input.reviewNote as string | undefined });
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

function sellerPresentationFinancialModuleSummary(contentPayload: Prisma.JsonValue) {
  if (!isSellerPresentationFinancialModule(contentPayload)) return undefined;
  return Object.freeze({
    estimatedNetProceedsCents: contentPayload.estimatedNetProceedsCents,
    asOf: contentPayload.asOf,
    financialOutputVersionId: contentPayload.financialOutputVersionId,
  });
}

function buyerDecisionBriefSummary(contentPayload: Prisma.JsonValue) {
  if (!isBuyerDecisionBrief(contentPayload)) return undefined;
  return Object.freeze({
    fixtureId: contentPayload.fixtureId,
    offerPriceContextCents: contentPayload.decisionContext.offerPriceContextCents,
  });
}

export function serializePersistedOutputSummary(version: Pick<OutputVersion, 'id' | 'productId' | 'sourceVersionRef' | 'versionOrdinal' | 'displayVersion' | 'contentFingerprint' | 'lifecycleState' | 'reviewedAt' | 'immutableAt' | 'contentPayload'>, created: boolean): PersistedOutputSummary {
  const sellerFinancial = sellerFinancialSummary(version.contentPayload);
  const sellerPresentationFinancialModule = sellerPresentationFinancialModuleSummary(version.contentPayload);
  const buyerDecisionBrief = buyerDecisionBriefSummary(version.contentPayload);
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
    ...(sellerPresentationFinancialModule ? { sellerPresentationFinancialModule } : {}),
    ...(buyerDecisionBrief ? { buyerDecisionBrief } : {}),
  });
}

export function buildOutputPersistenceIdempotencyKey(ownerAgentSubject: string, fixture: PersistableOutputFixture) {
  return `ATLAS_OUTPUT_PERSISTENCE_V1|${ownerAgentSubject}|${fixture.outputProductId}|${fixture.sourceVersionRef}|${fixture.contentFingerprint}`;
}

export function createOutputPersistenceService(prisma: PrismaClient) {
  function serializeOutputProductDetail(product: Prisma.OutputProductGetPayload<{
    include: {
      clientCase: { select: { id: true; displayName: true; status: true } };
      transaction: { select: { id: true; label: true; stage: true } };
      versions: {
        include: { evidenceSnapshot: true; dependencies: true; reviews: true; decisions: true; checkpoints: true };
      };
    };
  }>): OutputProductDetail {
    const versions = [...product.versions].sort((left, right) => right.versionOrdinal - left.versionOrdinal);
    const reviewed = versions.find((version) => version.lifecycleState === 'AGENT_REVIEWED') ?? null;
    return Object.freeze({
      id: product.id,
      productKind: product.productKind,
      audience: product.audience,
      subjectRef: product.subjectRef,
      purpose: product.purpose,
      clientCase: product.clientCase ? Object.freeze({ id: product.clientCase.id, displayName: product.clientCase.displayName, status: product.clientCase.status }) : null,
      transaction: product.transaction ? Object.freeze({ id: product.transaction.id, label: product.transaction.label, stage: product.transaction.stage }) : null,
      currentVersionId: versions[0]?.id ?? null,
      reviewedVersionId: reviewed?.id ?? null,
      versions: Object.freeze(versions.map((version) => Object.freeze({
        id: version.id,
        versionOrdinal: version.versionOrdinal,
        displayVersion: version.displayVersion,
        lifecycleState: version.lifecycleState,
        reviewState: version.reviewState,
        createdAt: version.immutableAt.toISOString(),
        reviewedAt: version.reviewedAt.toISOString(),
        immutableAt: version.immutableAt.toISOString(),
        contentFingerprint: version.contentFingerprint,
        composition: asComposition(version.contentPayload),
        artifactState: 'NO_ARTIFACT' as const,
        reviews: Object.freeze(version.reviews.map((review) => Object.freeze({ id: review.id, reviewerSubject: review.reviewerSubject, disposition: review.disposition, reviewedAt: review.reviewedAt.toISOString(), reviewNote: review.reviewNote }))),
        dependencies: Object.freeze(version.dependencies.map((dependency) => Object.freeze({ id: dependency.id, upstreamArtifact: dependency.upstreamArtifact, dependencyType: dependency.dependencyType, currentState: dependency.currentState, reviewPolicy: dependency.reviewPolicy }))),
        decisions: Object.freeze(version.decisions.map((decision) => Object.freeze({ id: decision.id, decisionRef: decision.decisionRef, disposition: decision.disposition, recordedAt: decision.recordedAt.toISOString() }))),
        checkpoints: Object.freeze(version.checkpoints.map((checkpoint) => Object.freeze({ id: checkpoint.id, checkpointRef: checkpoint.checkpointRef, state: checkpoint.state, recordedAt: checkpoint.recordedAt.toISOString(), detail: checkpoint.detail }))),
        evidenceSnapshot: version.evidenceSnapshot ? Object.freeze({ fingerprint: version.evidenceSnapshot.fingerprint, reviewState: version.evidenceSnapshot.reviewState, sourceSnapshotRefs: version.evidenceSnapshot.sourceSnapshotRefs, limitationRefs: version.evidenceSnapshot.limitationRefs }) : null,
      }))),
    });
  }

  async function ownedProduct(ownerAgentSubject: string, productId: string) {
    const product = await prisma.outputProduct.findFirst({
      where: { id: productId, ownerAgentSubject },
      include: {
        clientCase: { select: { id: true, displayName: true, status: true } },
        transaction: { select: { id: true, label: true, stage: true } },
        versions: { include: { evidenceSnapshot: true, dependencies: true, reviews: true, decisions: true, checkpoints: true } },
      },
    });
    if (!product) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'The requested OutputProduct is unavailable to this Agent.');
    return product;
  }

  async function createSyntheticOutputDraft(ownerAgentSubject: string, clientCaseId: string) {
    if (!ownerAgentSubject.trim() || !clientCaseId.trim()) throw new OutputPersistenceError('INVALID_REQUEST', 'A Client Case context is required for the synthetic output fixture.');
    const composition = buildSyntheticOutputReportComposition();
    const contentFingerprint = outputReportCompositionFingerprint(composition);
    return prisma.$transaction(async (tx) => {
      const clientCase = await tx.clientCase.findFirst({ where: { id: clientCaseId, ownerAgentSubject }, select: { id: true } });
      if (!clientCase) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'The selected Client Case is unavailable to this Agent.');
      const product = await tx.outputProduct.upsert({
        where: { ownerAgentSubject_productKind_audience_subjectRef: { ownerAgentSubject, productKind: 'AGENT_INTERNAL_ANALYSIS', audience: 'AGENT_INTERNAL', subjectRef: OUTPUT_REPORT_COMPOSITION_SYNTHETIC_SUBJECT } },
        create: {
          ownerAgentSubject,
          productKind: 'AGENT_INTERNAL_ANALYSIS',
          audience: 'AGENT_INTERNAL',
          subjectRef: OUTPUT_REPORT_COMPOSITION_SYNTHETIC_SUBJECT,
          purpose: 'Inert Project Atlas Output report composition foundation certification.',
          outputContractVersion: OUTPUT_REPORT_COMPOSITION_FOUNDATION_VERSION,
          lineageKey: `${ownerAgentSubject}|AGENT_INTERNAL_ANALYSIS|AGENT_INTERNAL|${OUTPUT_REPORT_COMPOSITION_SYNTHETIC_SUBJECT}`,
          clientCaseId: clientCase.id,
        },
        update: {},
      });
      if (product.clientCaseId !== clientCase.id) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'The synthetic OutputProduct is already bound to a different Client Case.');
      const existing = await tx.outputVersion.findFirst({ where: { productId: product.id, sourceVersionRef: OUTPUT_REPORT_COMPOSITION_SYNTHETIC_SOURCE } });
      if (existing) return Object.freeze({ productId: product.id, versionId: existing.id, created: false });
      const now = new Date();
      const version = await tx.outputVersion.create({ data: {
        productId: product.id,
        sourceVersionRef: OUTPUT_REPORT_COMPOSITION_SYNTHETIC_SOURCE,
        versionOrdinal: 1,
        idempotencyKey: `ATLAS_OUTPUT_COMPOSITION_DRAFT_V1|${ownerAgentSubject}|${product.id}|${contentFingerprint}`,
        outputContractVersion: OUTPUT_REPORT_COMPOSITION_FOUNDATION_VERSION,
        displayVersion: 'ATLAS Synthetic Output - Foundation V1 / Draft',
        audience: 'AGENT_INTERNAL', subjectRef: OUTPUT_REPORT_COMPOSITION_SYNTHETIC_SUBJECT,
        purpose: product.purpose, effectiveAsOf: now,
        lifecycleState: 'AGENT_REVIEW_REQUIRED', reviewState: 'AGENT_REVIEW_REQUIRED',
        contentVersion: OUTPUT_REPORT_COMPOSITION_SCHEMA_VERSION,
        compositionVersion: OUTPUT_REPORT_COMPOSITION_FOUNDATION_VERSION,
        presentationVisualVersion: 'ATLAS_OUTPUT_SEMANTIC_PREVIEW_V1',
        contentFingerprint, payloadSchemaVersion: OUTPUT_REPORT_COMPOSITION_SCHEMA_VERSION,
        contentPayload: composition as unknown as Prisma.InputJsonValue,
        lineage: { creationReason: 'SYNTHETIC_CERTIFICATION_DRAFT', clientCaseId } as Prisma.InputJsonValue,
        ownerAgentSubject, reviewedAt: now,
        evidenceSnapshot: { create: { snapshotSchemaVersion: OUTPUT_REPORT_COMPOSITION_SCHEMA_VERSION, sourceSnapshotRefs: ['SYNTHETIC_CERTIFICATION_INTERNAL_ONLY'], metricRefs: [], analysisRefs: [], agentInputRefs: [], assumptionRefs: [], limitationRefs: ['No real client, property, market, financial, or transaction claims.'], rightsRefs: ['SYNTHETIC_CERTIFICATION_INTERNAL_ONLY'], freshnessRefs: [], reviewState: 'AGENT_REVIEW_REQUIRED', fingerprint: contentFingerprint } },
        dependencies: { create: [{ upstreamArtifact: 'ATLAS_SYNTHETIC_OUTPUT_COMPOSITION_V1', downstreamArtifact: 'ATLAS_SYNTHETIC_OUTPUT_FOUNDATION_V1', dependencyType: 'NARRATIVE_DEPENDENCY', materiality: 'LOW', versionUsed: OUTPUT_REPORT_COMPOSITION_FOUNDATION_VERSION, fieldMetricScope: ['syntheticCertification'], changePolicy: 'A material semantic change requires a successor OutputVersion.', invalidationPolicy: 'REVIEW_REQUIRED', reviewPolicy: 'AGENT_REVIEW_REQUIRED', currentState: 'CURRENT' }] },
        checkpoints: { create: [{ checkpointRef: 'SYNTHETIC_OUTPUT_PREPARED', state: 'REVIEW_REQUIRED', checkpointSchemaVersion: OUTPUT_REPORT_COMPOSITION_FOUNDATION_VERSION, recordedBySubject: ownerAgentSubject, recordedAt: now, detail: 'Prepared for an explicit human Agent review. No delivery or render occurred.' }] },
      } });
      return Object.freeze({ productId: product.id, versionId: version.id, created: true });
    });
  }

  async function reviewOutputVersion(ownerAgentSubject: string, outputVersionId: string, reviewNote?: string) {
    if (reviewNote !== undefined && (typeof reviewNote !== 'string' || reviewNote.length > 500)) throw new OutputPersistenceError('INVALID_REQUEST', 'The review note is invalid.');
    return prisma.$transaction(async (tx) => {
      const draft = await tx.outputVersion.findFirst({ where: { id: outputVersionId, ownerAgentSubject }, include: { product: true, evidenceSnapshot: true, dependencies: true } });
      if (!draft) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'The requested OutputVersion is unavailable to this Agent.');
      if (draft.lifecycleState !== 'AGENT_REVIEW_REQUIRED') throw new OutputPersistenceError('IMMUTABLE_VERSION', 'Only a review-required semantic version can be reviewed into an immutable successor.');
      const idempotencyKey = `ATLAS_OUTPUT_COMPOSITION_REVIEW_V1|${ownerAgentSubject}|${draft.id}|${draft.contentFingerprint}`;
      const existing = await tx.outputVersion.findFirst({ where: { idempotencyKey } });
      if (existing) return Object.freeze({ productId: existing.productId, versionId: existing.id, created: false });
      const ordinal = await tx.outputVersion.count({ where: { productId: draft.productId } }) + 1;
      const now = new Date();
      const reviewed = await tx.outputVersion.create({ data: {
        productId: draft.productId,
        sourceVersionRef: `${OUTPUT_REPORT_COMPOSITION_SYNTHETIC_SOURCE}:REVIEWED:${draft.id}`,
        versionOrdinal: ordinal, idempotencyKey,
        outputContractVersion: draft.outputContractVersion,
        displayVersion: 'ATLAS Synthetic Output - Foundation V1 / Reviewed',
        audience: draft.audience, subjectRef: draft.subjectRef, purpose: draft.purpose, effectiveAsOf: draft.effectiveAsOf,
        lifecycleState: 'AGENT_REVIEWED', reviewState: 'AGENT_REVIEWED',
        contentVersion: draft.contentVersion, compositionVersion: draft.compositionVersion, presentationVisualVersion: draft.presentationVisualVersion,
        contentFingerprint: draft.contentFingerprint, payloadSchemaVersion: draft.payloadSchemaVersion,
        contentPayload: draft.contentPayload as Prisma.InputJsonValue,
        lineage: { reviewedFromVersion: draft.id, sourceFingerprint: draft.contentFingerprint } as Prisma.InputJsonValue,
        ownerAgentSubject, reviewedAt: now,
        evidenceSnapshot: { create: { snapshotSchemaVersion: draft.evidenceSnapshot?.snapshotSchemaVersion ?? draft.payloadSchemaVersion, sourceSnapshotRefs: draft.evidenceSnapshot?.sourceSnapshotRefs as Prisma.InputJsonValue ?? [], metricRefs: draft.evidenceSnapshot?.metricRefs as Prisma.InputJsonValue ?? [], analysisRefs: draft.evidenceSnapshot?.analysisRefs as Prisma.InputJsonValue ?? [], agentInputRefs: draft.evidenceSnapshot?.agentInputRefs as Prisma.InputJsonValue ?? [], assumptionRefs: draft.evidenceSnapshot?.assumptionRefs as Prisma.InputJsonValue ?? [], limitationRefs: draft.evidenceSnapshot?.limitationRefs as Prisma.InputJsonValue ?? [], rightsRefs: draft.evidenceSnapshot?.rightsRefs as Prisma.InputJsonValue ?? [], freshnessRefs: draft.evidenceSnapshot?.freshnessRefs as Prisma.InputJsonValue ?? [], reviewState: 'AGENT_REVIEWED', fingerprint: draft.evidenceSnapshot?.fingerprint ?? draft.contentFingerprint } },
        dependencies: { create: draft.dependencies.map((dependency) => ({ upstreamArtifact: dependency.upstreamArtifact, downstreamArtifact: dependency.downstreamArtifact, dependencyType: dependency.dependencyType, materiality: dependency.materiality, versionUsed: dependency.versionUsed, fieldMetricScope: dependency.fieldMetricScope as Prisma.InputJsonValue, changePolicy: dependency.changePolicy, invalidationPolicy: dependency.invalidationPolicy, reviewPolicy: dependency.reviewPolicy, currentState: dependency.currentState })) },
        reviews: { create: { reviewerSubject: ownerAgentSubject, disposition: 'APPROVED', reviewContractVersion: OUTPUT_REPORT_COMPOSITION_FOUNDATION_VERSION, reviewedAt: now, reviewNote } },
        checkpoints: { create: [{ checkpointRef: 'SYNTHETIC_OUTPUT_REVIEWED', state: 'COMPLETED', checkpointSchemaVersion: OUTPUT_REPORT_COMPOSITION_FOUNDATION_VERSION, recordedBySubject: ownerAgentSubject, recordedAt: now, detail: 'Explicit Agent review created a new immutable reviewed OutputVersion. No delivery or render occurred.' }] },
      } });
      return Object.freeze({ productId: reviewed.productId, versionId: reviewed.id, created: true });
    });
  }

  async function createMultiPropertyFinancialScenarioOutputDraft(ownerAgentSubject: string, scenarioVersionId: string) {
    if (!ownerAgentSubject.trim()) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'An Agent owner identity is required.');
    const scenarioVersion = await prisma.multiPropertyFinancialScenarioVersion.findFirst({
      where: { id: scenarioVersionId, ownerAgentSubject },
      include: { scenario: true, result: true, properties: true },
    });
    if (!scenarioVersion || !scenarioVersion.result) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'The selected immutable scenario result is unavailable to this Agent.');
    const scenarioResult = scenarioVersion.result;
    const sourceVersionRef = `${MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_VERSION}:${scenarioVersion.id}:${scenarioResult.id}`;
    const contentPayload = {
      schemaVersion: MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_VERSION,
      scenario: {
        id: scenarioVersion.scenarioId,
        key: scenarioVersion.scenario.scenarioKey,
        displayName: scenarioVersion.scenario.displayName,
        versionId: scenarioVersion.id,
        versionOrdinal: scenarioVersion.versionOrdinal,
        inputFingerprint: scenarioVersion.inputFingerprint,
        resultId: scenarioResult.id,
        resultFingerprint: scenarioResult.resultFingerprint,
      },
      result: scenarioResult.resultSnapshot,
      limitations: [
        'Agent-internal semantic output prepared from an immutable modeled scenario result.',
        'No render, delivery, client portal publication, or external action occurred.',
        'Explicit Agent review remains required before any later governed Output progression.',
      ],
      qualification: 'SYNTHETIC_CERTIFICATION_INTERNAL_ONLY',
    };
    const contentFingerprint = multiPropertyScenarioOutputFingerprint(contentPayload);
    const idempotencyKey = `MPFS_OUTPUT_DRAFT_V1|${ownerAgentSubject}|${scenarioVersion.id}|${scenarioResult.resultFingerprint}`;
    return prisma.$transaction(async (tx) => {
      const product = await tx.outputProduct.upsert({
        where: { ownerAgentSubject_productKind_audience_subjectRef: { ownerAgentSubject, productKind: 'MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS', audience: 'AGENT_INTERNAL', subjectRef: `MultiPropertyFinancialScenario:${scenarioVersion.scenarioId}` } },
        create: {
          ownerAgentSubject,
          productKind: 'MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS',
          audience: 'AGENT_INTERNAL',
          subjectRef: `MultiPropertyFinancialScenario:${scenarioVersion.scenarioId}`,
          purpose: 'Agent-internal multi-property financial scenario comparison prepared from one immutable version.',
          outputContractVersion: MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_VERSION,
          lineageKey: `${ownerAgentSubject}|MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS|AGENT_INTERNAL|MultiPropertyFinancialScenario:${scenarioVersion.scenarioId}`,
          clientCaseId: scenarioVersion.scenario.clientCaseId,
        },
        update: {},
      });
      if (product.clientCaseId !== scenarioVersion.scenario.clientCaseId) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'The OutputProduct is already bound to a different Client Case scope.');
      const existing = await tx.outputVersion.findUnique({ where: { idempotencyKey } });
      if (existing) return Object.freeze({ productId: product.id, versionId: existing.id, created: false });
      const versionOrdinal = await tx.outputVersion.count({ where: { productId: product.id } }) + 1;
      const now = new Date();
      const outputVersion = await tx.outputVersion.create({ data: {
        productId: product.id, sourceVersionRef, versionOrdinal, idempotencyKey,
        outputContractVersion: MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_VERSION,
        displayVersion: `${scenarioVersion.scenario.displayName} / Scenario v${scenarioVersion.versionOrdinal}`,
        audience: 'AGENT_INTERNAL', subjectRef: `MultiPropertyFinancialScenario:${scenarioVersion.scenarioId}`, purpose: product.purpose,
        effectiveAsOf: now, lifecycleState: 'AGENT_REVIEW_REQUIRED', reviewState: 'AGENT_REVIEW_REQUIRED',
        contentVersion: MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_VERSION,
        compositionVersion: MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_VERSION,
        presentationVisualVersion: 'MULTI_PROPERTY_FINANCIAL_SCENARIO_AGENT_SEMANTIC_V1',
        contentFingerprint, payloadSchemaVersion: MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_VERSION,
        contentPayload: contentPayload as Prisma.InputJsonValue,
        lineage: { scenarioId: scenarioVersion.scenarioId, scenarioVersionId: scenarioVersion.id, scenarioResultId: scenarioResult.id, inputFingerprint: scenarioVersion.inputFingerprint, resultFingerprint: scenarioResult.resultFingerprint } as Prisma.InputJsonValue,
        ownerAgentSubject, multiPropertyFinancialScenarioVersionId: scenarioVersion.id, reviewedAt: now,
        evidenceSnapshot: { create: { snapshotSchemaVersion: MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_VERSION, sourceSnapshotRefs: [`MultiPropertyFinancialScenario:${scenarioVersion.scenarioId}`], metricRefs: [`MultiPropertyFinancialScenarioResult:${scenarioResult.id}`], analysisRefs: [`MultiPropertyFinancialScenarioVersion:${scenarioVersion.id}`], agentInputRefs: scenarioVersion.properties.map((property) => `MultiPropertyFinancialScenarioProperty:${property.id}`), assumptionRefs: [scenarioVersion.inputFingerprint, scenarioVersion.calculationEngine], limitationRefs: contentPayload.limitations, rightsRefs: ['SYNTHETIC_CERTIFICATION_INTERNAL_ONLY'], freshnessRefs: [`IMMUTABLE_RESULT:${scenarioResult.resultFingerprint}`], reviewState: 'AGENT_REVIEW_REQUIRED', fingerprint: contentFingerprint } },
        dependencies: { create: [
          { upstreamArtifact: `MultiPropertyFinancialScenarioVersion:${scenarioVersion.id}`, downstreamArtifact: MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_VERSION, dependencyType: 'AGENT_INPUT_DEPENDENCY', materiality: 'HIGH', versionUsed: scenarioVersion.inputFingerprint, fieldMetricScope: ['inputSnapshot', 'properties'], changePolicy: 'A revised scenario input set requires a successor OutputVersion.', invalidationPolicy: 'RECOMPOSE_REQUIRED', reviewPolicy: 'AGENT_REVIEW_REQUIRED', currentState: 'CURRENT' },
          { upstreamArtifact: `MultiPropertyFinancialScenarioResult:${scenarioResult.id}`, downstreamArtifact: MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_VERSION, dependencyType: 'FINANCIAL_DEPENDENCY', materiality: 'HIGH', versionUsed: scenarioResult.resultFingerprint, fieldMetricScope: ['resultSnapshot', 'calculationEngine'], changePolicy: 'A revised immutable result requires a successor OutputVersion.', invalidationPolicy: 'RECOMPOSE_REQUIRED', reviewPolicy: 'AGENT_REVIEW_REQUIRED', currentState: 'CURRENT' },
        ] },
        checkpoints: { create: [{ checkpointRef: 'MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_PREPARED', state: 'REVIEW_REQUIRED', checkpointSchemaVersion: MULTI_PROPERTY_FINANCIAL_SCENARIO_OUTPUT_VERSION, recordedBySubject: ownerAgentSubject, recordedAt: now, detail: 'Semantic output prepared from one immutable ScenarioVersion and ScenarioResult. No render or delivery occurred.' }] },
      } });
      await tx.multiPropertyFinancialScenarioAuditEvent.create({ data: { scenarioId: scenarioVersion.scenarioId, scenarioVersionId: scenarioVersion.id, ownerAgentSubject, eventType: 'OUTPUT_VERSION_PREPARED', eventFingerprint: multiPropertyScenarioOutputFingerprint({ scenarioVersionId: scenarioVersion.id, outputVersionId: outputVersion.id, event: 'OUTPUT_VERSION_PREPARED' }), detail: { outputVersionId: outputVersion.id, outputProductId: product.id, lifecycleState: 'AGENT_REVIEW_REQUIRED' } as Prisma.InputJsonValue } });
      return Object.freeze({ productId: product.id, versionId: outputVersion.id, created: true });
    });
  }
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

  async function buildSellerPresentationFinancialModuleFixture(ownerAgentSubject: string, outputVersionId: string): Promise<PersistableOutputFixture> {
    const financialOutput = await prisma.outputVersion.findFirst({
      where: { id: outputVersionId, ownerAgentSubject, lifecycleState: 'AGENT_REVIEWED' },
      include: { evidenceSnapshot: true, product: true },
    });
    if (!financialOutput) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'The selected reviewed Seller Financial output is unavailable to this Agent.');
    let presentationModule;
    try {
      presentationModule = adaptSellerFinancialModuleToSellerPresentation({
        financialOutputVersionId: financialOutput.id,
        financialOutputSourceVersionRef: financialOutput.sourceVersionRef,
        financialOutputContentFingerprint: financialOutput.contentFingerprint,
        contentPayload: financialOutput.contentPayload,
      });
    } catch (error) {
      if (error instanceof Error) throw new OutputPersistenceError('INVALID_REQUEST', error.message);
      throw error;
    }
    if (!financialOutput.evidenceSnapshot) {
      throw new OutputPersistenceError('PERSISTENCE_UNAVAILABLE', 'The selected Seller Financial output has no governed evidence snapshot.');
    }
    const evidence = financialOutput.evidenceSnapshot;
    return Object.freeze({
      sourceVersionRef: `seller-presentation-financial-module-v1:${financialOutput.id}`,
      outputProductId: financialOutput.productId,
      productKind: financialOutput.product.productKind,
      audience: financialOutput.audience,
      subjectRef: financialOutput.subjectRef,
      purpose: 'Reviewed Seller Presentation composed with an explicit immutable Seller Financial module.',
      displayVersion: `Seller Presentation / Financial output #${financialOutput.versionOrdinal}`,
      effectiveAsOf: presentationModule.asOf.slice(0, 10),
      contentVersion: SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_VERSION,
      compositionVersion: SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_VERSION,
      presentationVisualVersion: 'SELLER_PRESENTATION_FINANCIAL_SECTION_V1',
      outputContractVersion: SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_VERSION,
      payloadSchemaVersion: SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_VERSION,
      contentFingerprint: sellerPresentationFinancialModuleFingerprint(presentationModule),
      contentPayload: presentationModule as unknown as Prisma.JsonObject,
      lineage: Object.freeze({ derivedFromVersion: `OutputVersion:${financialOutput.id}` }),
      evidence: Object.freeze({
        sourceSnapshotRefs: evidence.sourceSnapshotRefs as Prisma.JsonValue[],
        metricRefs: evidence.metricRefs as Prisma.JsonValue[],
        analysisRefs: evidence.analysisRefs as Prisma.JsonValue[],
        agentInputRefs: evidence.agentInputRefs as Prisma.JsonValue[],
        assumptionRefs: evidence.assumptionRefs as Prisma.JsonValue[],
        limitationRefs: evidence.limitationRefs as Prisma.JsonValue[],
        rightsRefs: evidence.rightsRefs as Prisma.JsonValue[],
        freshnessRefs: evidence.freshnessRefs as Prisma.JsonValue[],
        reviewState: evidence.reviewState,
        fingerprint: evidence.fingerprint,
      }),
      dependencies: Object.freeze([{
        upstreamArtifact: `OutputVersion:${financialOutput.id}`,
        downstreamArtifact: 'SELLER_PRESENTATION_FINANCIAL_MODULE_V1',
        dependencyType: 'FACT_DEPENDENCY' as const,
        materiality: 'HIGH' as const,
        versionUsed: financialOutput.contentFingerprint,
        fieldMetricScope: ['estimatedSalePriceCents', 'estimatedPayoffCents', 'estimatedSellerCostsCents', 'estimatedNetProceedsCents', 'costBreakdown', 'sourceQualifications', 'asOf'],
        changePolicy: 'A different reviewed Seller Financial output requires a successor Seller Presentation version.',
        invalidationPolicy: 'RECOMPOSE_REQUIRED' as const,
        reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const,
        currentState: 'CURRENT' as const,
      }]),
      decisionRefs: [`OutputVersion:${financialOutput.id}`],
    });
  }

  function buildBuyerDecisionBriefFixture(fixtureId: BuyerDecisionBriefCertificationFixtureId): PersistableOutputFixture {
    const brief = buyerDecisionBriefFixture(fixtureId);
    const contentFingerprint = buyerDecisionBriefFingerprint(brief);
    return Object.freeze({
      sourceVersionRef: `buyer-decision-brief-v1:${fixtureId}`,
      outputProductId: 'buyer-decision-brief-certification-product-v1',
      productKind: 'BUYER_PRESENTATION',
      audience: 'BUYER',
      subjectRef: 'atlas-certification-buyer-decision-subject',
      purpose: 'Agent-reviewed Buyer Decision Brief assembled from bounded synthetic certification inputs.',
      displayVersion: `Buyer Decision Brief / ${fixtureId.endsWith('_A') ? 'A' : 'B'}`,
      effectiveAsOf: brief.asOf,
      contentVersion: BUYER_DECISION_BRIEF_FOUNDATION_VERSION,
      compositionVersion: BUYER_DECISION_BRIEF_FOUNDATION_VERSION,
      presentationVisualVersion: 'BUYER_DECISION_BRIEF_AGENT_REVIEW_V1',
      outputContractVersion: BUYER_DECISION_BRIEF_FOUNDATION_VERSION,
      payloadSchemaVersion: BUYER_DECISION_BRIEF_FOUNDATION_VERSION,
      contentFingerprint,
      contentPayload: brief as unknown as Prisma.JsonObject,
      lineage: Object.freeze({
        ...(fixtureId.endsWith('_B') ? { priorReviewedVersion: 'buyer-decision-brief-v1:ATLAS_CERTIFICATION_BUYER_BRIEF_A' } : {}),
      }),
      evidence: Object.freeze({
        sourceSnapshotRefs: ['PROPERTY_SELLER_EVIDENCE_FIXTURES:PSER-001'],
        metricRefs: [],
        analysisRefs: [],
        agentInputRefs: [`BuyerDecisionContext:${fixtureId}`],
        assumptionRefs: [`OfferPriceContext:${brief.decisionContext.offerPriceContextCents}`],
        limitationRefs: brief.limitations as Prisma.JsonValue[],
        rightsRefs: ['SYNTHETIC_CERTIFICATION_INTERNAL_ONLY'],
        freshnessRefs: [`AS_OF:${brief.asOf}`],
        reviewState: 'AGENT_REVIEWED',
        fingerprint: buyerDecisionBriefFingerprint(Object.freeze({ ...brief, fixtureId })),
      }),
      dependencies: Object.freeze([
        {
          upstreamArtifact: 'PROPERTY_SELLER_EVIDENCE_FIXTURES:PSER-001',
          downstreamArtifact: 'BUYER_DECISION_BRIEF_V1',
          dependencyType: 'FACT_DEPENDENCY' as const,
          materiality: 'HIGH' as const,
          versionUsed: 'PROPERTY_SELLER_EVIDENCE_READINESS_V1',
          fieldMetricScope: ['property.reference', 'property.qualification', 'location.city'],
          changePolicy: 'A revised property identity or qualification requires a new reviewed Buyer Decision Brief.',
          invalidationPolicy: 'RECOMPOSE_REQUIRED' as const,
          reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const,
          currentState: 'CURRENT' as const,
        },
        {
          upstreamArtifact: `BuyerDecisionContext:${fixtureId}`,
          downstreamArtifact: 'BUYER_DECISION_BRIEF_V1',
          dependencyType: 'AGENT_INPUT_DEPENDENCY' as const,
          materiality: 'HIGH' as const,
          versionUsed: contentFingerprint,
          fieldMetricScope: ['decisionContext', 'tradeoffs', 'followUp'],
          changePolicy: 'A material decision-context change requires a successor reviewed Buyer Decision Brief.',
          invalidationPolicy: 'REVIEW_REQUIRED' as const,
          reviewPolicy: 'AGENT_REVIEW_REQUIRED' as const,
          currentState: 'CURRENT' as const,
        },
      ]),
      decisionRefs: [`BuyerDecisionContext:${fixtureId}`],
    });
  }

  async function persistReviewedFixture(ownerAgentSubject: string, fixture: PersistableOutputFixture, reviewNote?: string): Promise<PersistedOutputSummary> {
    if (!ownerAgentSubject.trim()) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'An Agent owner identity is required.');
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
                  reviewNote,
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

  async function persistReviewedOutput(ownerAgentSubject: string, request: OutputPersistenceSaveRequest): Promise<PersistedOutputSummary> {
    const fixture = 'financialScenarioId' in request
      ? await buildSellerFinancialFixture(ownerAgentSubject, request.financialScenarioId)
      : 'sellerPresentationFinancialOutputVersionId' in request
        ? await buildSellerPresentationFinancialModuleFixture(ownerAgentSubject, request.sellerPresentationFinancialOutputVersionId)
        : 'buyerDecisionBriefFixtureId' in request
          ? buildBuyerDecisionBriefFixture(request.buyerDecisionBriefFixtureId)
          : buildPersistableOutputFixture(request.sourceVersionRef);
    return persistReviewedFixture(ownerAgentSubject, fixture, request.reviewNote);
  }

  async function listOwnedOutputHistory(ownerAgentSubject: string): Promise<readonly PersistedOutputSummary[]> {
    if (!ownerAgentSubject.trim()) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'An Agent owner identity is required.');
    const versions = await prisma.outputVersion.findMany({
      where: { ownerAgentSubject },
      orderBy: [{ reviewedAt: 'desc' }, { versionOrdinal: 'desc' }],
    });
    return versions.map((version) => serializePersistedOutputSummary(version, false));
  }

  async function listOwnedOutputProducts(ownerAgentSubject: string, clientCaseId?: string | null): Promise<readonly OutputProductDetail[]> {
    if (!ownerAgentSubject.trim()) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'An Agent owner identity is required.');
    if (clientCaseId) {
      const clientCase = await prisma.clientCase.findFirst({ where: { id: clientCaseId, ownerAgentSubject }, select: { id: true } });
      if (!clientCase) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'The selected Client Case is unavailable to this Agent.');
    }
    const products = await prisma.outputProduct.findMany({
      where: { ownerAgentSubject, ...(clientCaseId ? { clientCaseId } : {}) },
      orderBy: { createdAt: 'desc' },
      include: {
        clientCase: { select: { id: true, displayName: true, status: true } },
        transaction: { select: { id: true, label: true, stage: true } },
        versions: { include: { evidenceSnapshot: true, dependencies: true, reviews: true, decisions: true, checkpoints: true } },
      },
    });
    return Object.freeze(products.map(serializeOutputProductDetail));
  }

  async function loadOwnedOutputProduct(ownerAgentSubject: string, productId: string) {
    if (!ownerAgentSubject.trim()) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'An Agent owner identity is required.');
    return serializeOutputProductDetail(await ownedProduct(ownerAgentSubject, productId));
  }

  async function loadOwnedOutputVersion(ownerAgentSubject: string, outputVersionId: string) {
    const version = await prisma.outputVersion.findFirst({ where: { id: outputVersionId, ownerAgentSubject }, select: { productId: true } });
    if (!version) throw new OutputPersistenceError('OWNERSHIP_DENIED', 'The requested OutputVersion is unavailable to this Agent.');
    return loadOwnedOutputProduct(ownerAgentSubject, version.productId);
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

  return Object.freeze({
    persistReviewedFixture,
    persistReviewedOutput,
    listOwnedOutputHistory,
    listOwnedOutputProducts,
    loadOwnedOutputProduct,
    loadOwnedOutputVersion,
    createSyntheticOutputDraft,
    createMultiPropertyFinancialScenarioOutputDraft,
    reviewOutputVersion,
    loadOwnedOutputForPdf,
  });
}

export function outputPersistenceLifecycleIsSupported(value: string) {
  return ATLAS_OUTPUT_VERSION_LIFECYCLE_STATES.includes(value as (typeof ATLAS_OUTPUT_VERSION_LIFECYCLE_STATES)[number]);
}
