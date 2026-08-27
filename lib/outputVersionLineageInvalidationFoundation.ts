import {
  type AtlasOutputAudience,
  type AtlasOutputFreshnessState,
  type AtlasOutputProductKind,
  type AtlasOutputReviewState,
  type AtlasOutputRightsState,
  SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
} from './sharedOutputProductComposition';
import {
  SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION,
  buildSellerDecisionBriefCompositionPreview,
} from './sellerDecisionBriefCompositionPreview';
import {
  SELLER_DECISION_BRIEF_CONTENT_VERSION,
} from './sellerDecisionBriefFoundation';
import {
  SELLER_DECISION_BRIEF_NARRATIVE_VERSION,
  SELLER_DECISION_BRIEF_STRATEGY_VERSION,
  SELLER_DECISION_BRIEF_V2_VERSION,
} from './sellerDecisionBriefV2';
import {
  SELLER_PRICING_AGENT_RATIONALE_VERSION,
  SELLER_PRICING_DECISION_VERSION,
  SELLER_PRICING_FINANCIAL_LINK_VERSION,
  SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_FIXTURE,
  SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION,
  SELLER_PRICING_SCENARIO_VERSION,
  SELLER_PRICING_SEARCH_BAND_VERSION,
  type SellerPricingFramework,
} from './sellerPricingPositioningDecisionFramework';
import {
  SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION,
  SELLER_POST_LAUNCH_CHANGE_SET_VERSION,
  SELLER_POST_LAUNCH_CHECKPOINT_VERSION,
  SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_FIXTURE,
  SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_VERSION,
  SELLER_POST_LAUNCH_RESPONSE_INPUT_SET_VERSION,
  SELLER_POST_LAUNCH_REVIEW_VERSION,
  SELLER_POST_LAUNCH_SELLER_DECISION_VERSION,
  SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION_VERSION,
  SELLER_UPDATE_PRODUCT_VERSION,
  type SellerPostLaunchReview,
} from './sellerPostLaunchCurrentContextReview';
import { AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION } from './agentCurrentSnapshotComparison';
import { CURRENT_COMPETING_LISTING_CONTEXT_VERSION } from './agentCurrentCompetingListingContext';
import { ATLAS_COHORT_CONTRACT_VERSION } from './atlasCohortComparativeContract';
import { REIE_FINANCIAL_DECISION_PREPARATION_VERSION } from './financialDecisionPreparationContract';

export const OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_STATUS =
  'OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1_CERTIFIED_WITH_HOLDS' as const;
export const OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION =
  'OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1' as const;
export const OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_NEXT_GATE =
  'READY_FOR_PRINT_PDF_OUTPUT_PRODUCT_ARCHITECTURE' as const;
export const OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_PRODUCT_STATUS =
  'OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_V1_CERTIFIED_DOMAIN_ONLY_PRINT_PDF_PERSISTENCE_DELIVERY_HELD' as const;
export const OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_PERSISTENCE_POSITION =
  'DOMAIN_ONLY_SUFFICIENT_FOR_CURRENT_PHASE' as const;

export const ATLAS_OUTPUT_VERSION_LIFECYCLE_STATES = [
  'DRAFT',
  'COMPOSED',
  'AGENT_REVIEW_REQUIRED',
  'AGENT_REVIEWED',
  'READY_FOR_SELLER_REVIEW',
  'SELLER_REVIEWED_OR_PRESENTED',
  'INVALIDATED',
  'SUPERSEDED',
  'ARCHIVED_HISTORICAL_REFERENCE',
  'FAIL_CLOSED',
] as const;

export const ATLAS_OUTPUT_LINEAGE_REASON_CODES = [
  'PARENT_VERSION',
  'PRIOR_REVIEWED_VERSION',
  'DERIVED_FROM',
  'REVISED_FROM',
  'REFRESHED_FROM',
  'RECOMPOSED_FROM',
  'SUPERSEDES',
  'SUPERSEDED_BY',
] as const;

export const ATLAS_OUTPUT_VERSION_CREATION_REASONS = [
  'INITIAL_DRAFT',
  'CONTENT_REVISION',
  'DATA_REFRESH',
  'AGENT_EDIT',
  'PRICING_CHANGE',
  'FINANCIAL_CHANGE',
  'POST_LAUNCH_REVIEW',
  'AUDIENCE_TRANSFORM',
  'PRODUCT_TRANSFORM',
  'COMPOSITION_CHANGE',
  'RENDER_RELEVANT_CONTENT_CHANGE',
] as const;

export const ATLAS_OUTPUT_DEPENDENCY_TYPES = [
  'FACT_DEPENDENCY',
  'MARKET_DEPENDENCY',
  'COMPETITION_DEPENDENCY',
  'SEARCH_BAND_DEPENDENCY',
  'AGENT_INPUT_DEPENDENCY',
  'NARRATIVE_DEPENDENCY',
  'RECOMMENDATION_DEPENDENCY',
  'PRICING_DEPENDENCY',
  'FINANCIAL_DEPENDENCY',
  'RIGHTS_DEPENDENCY',
  'FRESHNESS_DEPENDENCY',
  'PRESENTATION_DEPENDENCY',
] as const;

export const ATLAS_OUTPUT_INVALIDATION_STATES = [
  'CURRENT',
  'REFRESH_RECOMMENDED',
  'REVIEW_REQUIRED',
  'RECOMPUTE_REQUIRED',
  'RECOMPOSE_REQUIRED',
  'RIGHTS_REVIEW_REQUIRED',
  'FRESHNESS_REVIEW_REQUIRED',
  'SUPERSEDED',
  'EVIDENCE_INSUFFICIENT',
] as const;

export const ATLAS_OUTPUT_DIFF_CLASSES = [
  'PRESENTATION_ONLY',
  'NON_MATERIAL_CONTENT',
  'MATERIAL_CONTENT',
  'DATA_REFRESH',
  'EVIDENCE_CHANGED',
  'AGENT_INPUT_CHANGED',
  'RECOMMENDATION_CHANGED',
  'PRICING_CHANGED',
  'FINANCIAL_CHANGED',
  'RIGHTS_CHANGED',
  'FRESHNESS_CHANGED',
  'NO_MATERIAL_CHANGE',
] as const;

export const ATLAS_OUTPUT_DIFF_SEVERITIES = [
  'PRESENTATION_ONLY',
  'NON_MATERIAL_CONTENT',
  'MATERIAL_CONTENT',
  'DATA_REFRESH',
  'DECISION_RELEVANT',
  'RIGHTS_CRITICAL',
  'FINANCIAL_CRITICAL',
] as const;

export const ATLAS_OUTPUT_UPSTREAM_CHANGE_TYPES = [
  'PROPERTY_FACT_CHANGE',
  'MARKET_REFRESH',
  'COMPETITION_CHANGE',
  'SEARCH_BAND_CHANGE',
  'PRICE_ASSUMPTION_CHANGE',
  'SELECTED_PRICING_SCENARIO_CHANGE',
  'SELLER_TIMING_CHANGE',
  'FINANCIAL_CONSTRAINT_CHANGE',
  'AGENT_RECOMMENDATION_CHANGE',
  'RIGHTS_CHANGE',
  'FRESHNESS_CHANGE',
  'PRESENTATION_ONLY_CHANGE',
] as const;

export const ATLAS_OUTPUT_REUSE_CLASSIFICATIONS = [
  'DIRECT_REUSE',
  'REFERENCE_REUSE',
  'AUDIENCE_TRANSFORM',
  'RECOMPOSE',
  'NEW_INSTANCE',
  'NOT_REUSABLE',
] as const;

export const ATLAS_OUTPUT_SOURCE_SNAPSHOT_STATES = [
  'CURRENT_QUERY_RESULT',
  'REVIEWED_SNAPSHOT',
  'HISTORICAL_REVIEWED_SNAPSHOT',
] as const;

export type AtlasOutputVersionLifecycleState = (typeof ATLAS_OUTPUT_VERSION_LIFECYCLE_STATES)[number];
export type AtlasOutputLineageReasonCode = (typeof ATLAS_OUTPUT_LINEAGE_REASON_CODES)[number];
export type AtlasOutputVersionCreationReason = (typeof ATLAS_OUTPUT_VERSION_CREATION_REASONS)[number];
export type AtlasOutputDependencyType = (typeof ATLAS_OUTPUT_DEPENDENCY_TYPES)[number];
export type AtlasOutputInvalidationState = (typeof ATLAS_OUTPUT_INVALIDATION_STATES)[number];
export type AtlasOutputDiffClass = (typeof ATLAS_OUTPUT_DIFF_CLASSES)[number];
export type AtlasOutputDiffSeverity = (typeof ATLAS_OUTPUT_DIFF_SEVERITIES)[number];
export type AtlasOutputUpstreamChangeType = (typeof ATLAS_OUTPUT_UPSTREAM_CHANGE_TYPES)[number];
export type AtlasOutputReuseClassification = (typeof ATLAS_OUTPUT_REUSE_CLASSIFICATIONS)[number];
export type AtlasOutputSourceSnapshotState = (typeof ATLAS_OUTPUT_SOURCE_SNAPSHOT_STATES)[number];

export type AtlasOutputVersionReference = Readonly<{
  id: string;
  version: string;
  label: string;
}>;

export type AtlasOutputVersion = Readonly<{
  id: string;
  outputProductId: string;
  productKind: AtlasOutputProductKind;
  outputContractVersion: typeof OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION;
  displayVersion: string;
  audience: AtlasOutputAudience;
  subject: string;
  purpose: string;
  createdAt: string;
  updatedAt: string;
  effectiveAsOf: string;
  lifecycleState: AtlasOutputVersionLifecycleState;
  reviewState: AtlasOutputReviewState;
  productTemplateVersion: typeof SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION;
  contentVersion: string;
  compositionVersion: string;
  presentationVisualVersion: string;
  parentVersion: string | null;
  priorReviewedVersion: string | null;
  derivedFromVersion: string | null;
  revisedFromVersion: string | null;
  refreshedFromVersion: string | null;
  recomposedFromVersion: string | null;
  supersedesVersion: string | null;
  supersededByVersion: string | null;
  preparationReferences: readonly AtlasOutputVersionReference[];
  intelligenceReferences: readonly AtlasOutputVersionReference[];
  analysisReferences: readonly AtlasOutputVersionReference[];
  narrativeReferences: readonly AtlasOutputVersionReference[];
  recommendationReferences: readonly AtlasOutputVersionReference[];
  pricingReferences: readonly AtlasOutputVersionReference[];
  financialReferences: readonly AtlasOutputVersionReference[];
  postLaunchReferences: readonly AtlasOutputVersionReference[];
  sellerClientDecisionReferences: readonly AtlasOutputVersionReference[];
  evidenceSnapshotReferences: readonly AtlasOutputVersionReference[];
  dependencyReferences: readonly string[];
  rightsReferences: readonly string[];
  freshnessReferences: readonly string[];
  agentAuthorship: Readonly<{
    required: boolean;
    authorIdentity: 'PROJECT_ATLAS_REFERENCE_AGENT';
    reviewedAt: string | null;
    reviewState: AtlasOutputReviewState;
  }>;
  contentFingerprint: string;
}>;

export type AtlasOutputSectionInstance = Readonly<{
  id: string;
  sectionDefinitionId: string;
  sectionDefinitionVersion: typeof SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION;
  outputVersionId: string;
  moduleInstanceReferences: readonly string[];
  order: number;
  inclusion: 'INCLUDED' | 'AVAILABLE_OPTIONAL' | 'HELD_FOR_REVIEW';
  readiness: 'READY' | 'AGENT_REVIEW_REQUIRED' | 'RIGHTS_REVIEW_REQUIRED' | 'FRESHNESS_REVIEW_REQUIRED';
  reviewState: AtlasOutputReviewState;
  parentVersion: string | null;
  priorReference: string | null;
  supersessionReference: string | null;
  fingerprint: string;
}>;

export type AtlasOutputModuleInstance = Readonly<{
  id: string;
  moduleDefinitionId: string;
  moduleDefinitionVersion: typeof SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION;
  outputVersionId: string;
  sectionInstanceId: string;
  inputReferences: readonly AtlasOutputVersionReference[];
  evidenceSnapshotReference: string;
  contentVersion: string;
  agentInputVersion: string | null;
  narrativeVersion: string | null;
  visualVersion: string;
  readiness: 'READY' | 'AGENT_REVIEW_REQUIRED' | 'RIGHTS_REVIEW_REQUIRED' | 'FRESHNESS_REVIEW_REQUIRED';
  reviewState: AtlasOutputReviewState;
  inclusion: 'INCLUDED' | 'AVAILABLE_OPTIONAL' | 'HELD_FOR_REVIEW';
  order: number;
  parentVersion: string | null;
  priorReference: string | null;
  supersededBy: string | null;
  fingerprint: string;
}>;

export type AtlasSourceSnapshot = Readonly<{
  id: string;
  state: AtlasOutputSourceSnapshotState;
  sourceType: 'SUBJECT_PROPERTY' | 'CURRENT_MARKET_COHORT' | 'CURRENT_COMPETITION' | 'SEARCH_BAND_CONTEXT' | 'PRICING_CONTEXT' | 'POST_LAUNCH_REVIEW' | 'FINANCIAL_REFERENCE';
  sourceReference: string;
  sourceVersion: string;
  subjectCohortQueryReference: string;
  asOf: string;
  observedRetrievedAt: string;
  fieldMetricReferences: readonly string[];
  coverage: string;
  rightsState: AtlasOutputRightsState;
  freshness: AtlasOutputFreshnessState;
  limitations: readonly string[];
  methodCalculationVersion: string;
  materializedReviewedValues: readonly string[];
  fingerprint: string;
}>;

export type AtlasOutputEvidenceSnapshot = Readonly<{
  id: string;
  outputVersionId: string;
  sourceSnapshotReferences: readonly string[];
  metricReferences: readonly string[];
  analysisReferences: readonly string[];
  agentInputReferences: readonly string[];
  assumptionReferences: readonly string[];
  limitationReferences: readonly string[];
  rightsReferences: readonly string[];
  freshnessReferences: readonly string[];
  createdAt: string;
  reviewState: AtlasOutputReviewState;
  fingerprint: string;
}>;

export type AtlasOutputDependency = Readonly<{
  id: string;
  upstreamArtifact: string;
  downstreamArtifact: string;
  dependencyType: AtlasOutputDependencyType;
  materiality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  versionUsed: string;
  fieldMetricScope: readonly string[];
  changePolicy: string;
  invalidationPolicy: AtlasOutputInvalidationState;
  reviewPolicy: AtlasOutputReviewState;
  currentState: AtlasOutputInvalidationState;
}>;

export type AtlasOutputInvalidationEvaluation = Readonly<{
  upstreamChange: AtlasOutputUpstreamChangeType;
  dependency: AtlasOutputDependencyType;
  resultingState: AtlasOutputInvalidationState;
  recompute: boolean;
  recompose: boolean;
  agentReview: boolean;
  sellerEffect: string;
}>;

export type AtlasOutputVersionDiff = Readonly<{
  id: string;
  diffClass: AtlasOutputDiffClass;
  priorOutputVersion: string;
  currentOutputVersion: string;
  changedSections: readonly string[];
  changedModules: readonly string[];
  changedInputs: readonly string[];
  changedEvidence: readonly string[];
  changedAgentContent: readonly string[];
  changedRecommendations: readonly string[];
  changedPricing: readonly string[];
  changedFinancial: readonly string[];
  rightsChanges: readonly string[];
  freshnessChanges: readonly string[];
  presentationOnlyChanges: readonly string[];
  invalidatedDependencies: readonly string[];
  severity: AtlasOutputDiffSeverity;
  sellerFacingChangeSummary: string;
  agentInternalDetail: string;
}>;

export type AtlasOutputReuseRule = Readonly<{
  artifact: string;
  sameProductNewVersion: AtlasOutputReuseClassification;
  sellerUpdate: AtlasOutputReuseClassification;
  buyer: AtlasOutputReuseClassification;
  market: AtlasOutputReuseClassification;
  property: AtlasOutputReuseClassification;
  location: AtlasOutputReuseClassification;
  investment: AtlasOutputReuseClassification;
  financial: AtlasOutputReuseClassification;
  advisory: AtlasOutputReuseClassification;
}>;

export type AtlasOutputVersionFoundation = Readonly<{
  status: typeof OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_STATUS;
  version: typeof OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION;
  route: '/agent/prepare/seller/presentation';
  outputVersions: readonly AtlasOutputVersion[];
  sectionInstances: readonly AtlasOutputSectionInstance[];
  moduleInstances: readonly AtlasOutputModuleInstance[];
  sourceSnapshots: readonly AtlasSourceSnapshot[];
  evidenceSnapshots: readonly AtlasOutputEvidenceSnapshot[];
  dependencies: readonly AtlasOutputDependency[];
  invalidationEvaluations: readonly AtlasOutputInvalidationEvaluation[];
  diffs: readonly AtlasOutputVersionDiff[];
  sellerVersionChain: readonly Readonly<{ order: number; artifact: string; version: string; parentPrior: string; evidence: string; review: string; decisionLink: string; downstream: string }>[];
  pricingLineage: readonly Readonly<{ pricingArtifact: string; version: string; evidenceInputs: readonly string[]; agentInput: string; sellerDecision: string; downstream: string; invalidationTrigger: AtlasOutputUpstreamChangeType }>[];
  postLaunchLineage: readonly Readonly<{ artifact: string; version: string; priorReference: string; currentInputs: readonly string[]; agentInterpretation: string; sellerDecision: string; next: string }>[];
  financialInvalidations: readonly Readonly<{ upstreamChange: AtlasOutputUpstreamChangeType; financialReference: string; previousState: string; resultingState: 'READY_FOR_REVIEW' | 'REVIEW_REQUIRED'; reason: string; agentAction: string }>[];
  reuseRules: readonly AtlasOutputReuseRule[];
  subjectAudienceTransform: readonly Readonly<{ change: string; newProductInstance: boolean; newOutputVersion: boolean; rightsReview: boolean; evidenceReuse: string; reviewRequired: boolean }>[];
  agentVersionUi: readonly Readonly<{ uiElement: string; canonicalData: string; agentQuestionAnswered: string; action: string; readiness: string }>[];
  dependencyWarnings: readonly Readonly<{ warning: string; upstreamChange: AtlasOutputUpstreamChangeType; downstreamArtifact: string; state: AtlasOutputInvalidationState; requiredAction: string }>[];
  fingerprints: readonly Readonly<{ fingerprint: string; inputs: readonly string[]; stableAcross: string; changesWhen: string; use: string }>[];
  reproducibilityInputs: readonly Readonly<{ input: string; versionSnapshot: string; required: boolean; purpose: string }>[];
  persistenceMapping: readonly Readonly<{ phase1DomainContract: string; futureDurableEntity: string; firstPersistenceNeed: string; currentStatus: 'DOMAIN_ONLY' | 'FUTURE_GATE' }>[];
  questionCoverage: readonly string[];
  nextGateRanking: readonly Readonly<{ rank: number; gate: string; why: string; dependencies: readonly string[]; unlocks: string }>[];
  readiness: Readonly<Record<string, 'IMPLEMENTED' | 'IMPLEMENTED_WITH_HOLDS' | 'DOMAIN_ONLY' | 'NEXT_GATE'>>;
  protectedBoundaries: Readonly<{
    persistenceAuthorization: false;
    schemaMigration: false;
    providerRuntime: false;
    customerMutation: false;
    crmMutation: false;
    emailOrMessageExecution: false;
    pdfGeneration: false;
    shareDelivery: false;
    durableOutputStorage: false;
    crossSessionRetention: false;
  }>;
  nextGate: typeof OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_NEXT_GATE;
  productStatus: typeof OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_PRODUCT_STATUS;
  persistencePosition: typeof OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_PERSISTENCE_POSITION;
}>;

const AS_OF = '2026-08-27';

function freezeArray<T>(items: readonly T[]): readonly T[] {
  return Object.freeze([...items]);
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  return `{${Object.keys(value as Record<string, unknown>).sort().map((key) => `${JSON.stringify(key)}:${stableStringify((value as Record<string, unknown>)[key])}`).join(',')}}`;
}

export function atlasOutputFingerprint(kind: string, inputs: unknown): string {
  const serialized = `${kind}:${stableStringify(inputs)}`;
  let hash = 2166136261;
  for (let index = 0; index < serialized.length; index += 1) {
    hash ^= serialized.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${kind.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function outputVersionTransitionAllowed(from: AtlasOutputVersionLifecycleState, to: AtlasOutputVersionLifecycleState) {
  const transitions: Readonly<Record<AtlasOutputVersionLifecycleState, readonly AtlasOutputVersionLifecycleState[]>> = Object.freeze({
    DRAFT: ['COMPOSED', 'FAIL_CLOSED'],
    COMPOSED: ['AGENT_REVIEW_REQUIRED', 'AGENT_REVIEWED', 'INVALIDATED', 'FAIL_CLOSED'],
    AGENT_REVIEW_REQUIRED: ['AGENT_REVIEWED', 'INVALIDATED', 'FAIL_CLOSED'],
    AGENT_REVIEWED: ['READY_FOR_SELLER_REVIEW', 'INVALIDATED', 'SUPERSEDED', 'ARCHIVED_HISTORICAL_REFERENCE'],
    READY_FOR_SELLER_REVIEW: ['SELLER_REVIEWED_OR_PRESENTED', 'INVALIDATED', 'SUPERSEDED'],
    SELLER_REVIEWED_OR_PRESENTED: ['SUPERSEDED', 'ARCHIVED_HISTORICAL_REFERENCE', 'INVALIDATED'],
    INVALIDATED: ['DRAFT', 'SUPERSEDED', 'ARCHIVED_HISTORICAL_REFERENCE'],
    SUPERSEDED: ['ARCHIVED_HISTORICAL_REFERENCE'],
    ARCHIVED_HISTORICAL_REFERENCE: [],
    FAIL_CLOSED: ['DRAFT'],
  });
  return transitions[from].includes(to);
}

export function reviewedOutputRequiresSuccessor(version: Pick<AtlasOutputVersion, 'lifecycleState'>, materialChange: boolean) {
  return materialChange && ['AGENT_REVIEWED', 'READY_FOR_SELLER_REVIEW', 'SELLER_REVIEWED_OR_PRESENTED'].includes(version.lifecycleState);
}

export function evaluateOutputInvalidation(change: AtlasOutputUpstreamChangeType): AtlasOutputInvalidationEvaluation {
  const table: Readonly<Record<AtlasOutputUpstreamChangeType, AtlasOutputInvalidationEvaluation>> = Object.freeze({
    PROPERTY_FACT_CHANGE: invalidation(change, 'FACT_DEPENDENCY', 'RECOMPOSE_REQUIRED', true, true, true, 'Property module and dependent Seller summary require review.'),
    MARKET_REFRESH: invalidation(change, 'MARKET_DEPENDENCY', 'REFRESH_RECOMMENDED', false, true, true, 'Market module and pricing context should be refreshed for Agent review.'),
    COMPETITION_CHANGE: invalidation(change, 'COMPETITION_DEPENDENCY', 'REVIEW_REQUIRED', false, true, true, 'Pricing scenario and Seller Update require competition review.'),
    SEARCH_BAND_CHANGE: invalidation(change, 'SEARCH_BAND_DEPENDENCY', 'RECOMPUTE_REQUIRED', true, true, true, 'Price option context and pricing review must be recomputed.'),
    PRICE_ASSUMPTION_CHANGE: invalidation(change, 'PRICING_DEPENDENCY', 'RECOMPUTE_REQUIRED', true, true, true, 'Pricing output and financial link require review.'),
    SELECTED_PRICING_SCENARIO_CHANGE: invalidation(change, 'PRICING_DEPENDENCY', 'REVIEW_REQUIRED', true, true, true, 'Seller pricing decision and Seller Update must be reviewed.'),
    SELLER_TIMING_CHANGE: invalidation(change, 'AGENT_INPUT_DEPENDENCY', 'REVIEW_REQUIRED', false, true, true, 'Timeline, pricing posture, and financial reference require review.'),
    FINANCIAL_CONSTRAINT_CHANGE: invalidation(change, 'FINANCIAL_DEPENDENCY', 'REVIEW_REQUIRED', true, true, true, 'Financial decision preparation seam becomes review-required.'),
    AGENT_RECOMMENDATION_CHANGE: invalidation(change, 'RECOMMENDATION_DEPENDENCY', 'REVIEW_REQUIRED', false, true, true, 'Linked Seller decision and output version require review.'),
    RIGHTS_CHANGE: invalidation(change, 'RIGHTS_DEPENDENCY', 'RIGHTS_REVIEW_REQUIRED', false, true, true, 'Affected module/output is held until rights review clears.'),
    FRESHNESS_CHANGE: invalidation(change, 'FRESHNESS_DEPENDENCY', 'FRESHNESS_REVIEW_REQUIRED', false, true, true, 'Affected module/output needs freshness review.'),
    PRESENTATION_ONLY_CHANGE: invalidation(change, 'PRESENTATION_DEPENDENCY', 'CURRENT', false, false, false, 'Render seam changes without material content invalidation.'),
  });
  return table[change];
}

function invalidation(
  upstreamChange: AtlasOutputUpstreamChangeType,
  dependency: AtlasOutputDependencyType,
  resultingState: AtlasOutputInvalidationState,
  recompute: boolean,
  recompose: boolean,
  agentReview: boolean,
  sellerEffect: string,
): AtlasOutputInvalidationEvaluation {
  return Object.freeze({ upstreamChange, dependency, resultingState, recompute, recompose, agentReview, sellerEffect });
}

function ref(id: string, version: string, label = id): AtlasOutputVersionReference {
  return Object.freeze({ id, version, label });
}

function outputVersion(input: Omit<AtlasOutputVersion, 'outputContractVersion' | 'productTemplateVersion' | 'contentFingerprint'> & { fingerprintInputs: unknown }): AtlasOutputVersion {
  return Object.freeze({
    ...input,
    outputContractVersion: OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION,
    productTemplateVersion: SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
    preparationReferences: freezeArray(input.preparationReferences),
    intelligenceReferences: freezeArray(input.intelligenceReferences),
    analysisReferences: freezeArray(input.analysisReferences),
    narrativeReferences: freezeArray(input.narrativeReferences),
    recommendationReferences: freezeArray(input.recommendationReferences),
    pricingReferences: freezeArray(input.pricingReferences),
    financialReferences: freezeArray(input.financialReferences),
    postLaunchReferences: freezeArray(input.postLaunchReferences),
    sellerClientDecisionReferences: freezeArray(input.sellerClientDecisionReferences),
    evidenceSnapshotReferences: freezeArray(input.evidenceSnapshotReferences),
    dependencyReferences: freezeArray(input.dependencyReferences),
    rightsReferences: freezeArray(input.rightsReferences),
    freshnessReferences: freezeArray(input.freshnessReferences),
    contentFingerprint: atlasOutputFingerprint('OUTPUT_CONTENT_FINGERPRINT', input.fingerprintInputs),
  });
}

function buildOutputVersions(pricing: SellerPricingFramework, postLaunch: SellerPostLaunchReview): readonly AtlasOutputVersion[] {
  const selectedScenario = pricing.scenarios.find((scenario) => scenario.id === pricing.sellerDecision.selectedScenarioId) ?? pricing.scenarios[0];
  const common = {
    outputProductId: 'seller-decision-brief-product-instance-v1',
    productKind: 'SELLER_PRESENTATION' as const,
    audience: 'SELLER' as const,
    subject: 'seller-decision-brief-subject-property',
    createdAt: `${AS_OF}T10:00:00.000Z`,
    updatedAt: `${AS_OF}T12:00:00.000Z`,
    effectiveAsOf: AS_OF,
    presentationVisualVersion: SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION,
    preparationReferences: [ref('seller-preparation-reference', SELLER_DECISION_BRIEF_CONTENT_VERSION, 'Seller preparation reference')],
    intelligenceReferences: [ref('current-market-snapshot', AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION, 'Current market snapshot'), ref('current-competition', CURRENT_COMPETING_LISTING_CONTEXT_VERSION, 'Current competition')],
    analysisReferences: [ref('seller-strategy', SELLER_DECISION_BRIEF_STRATEGY_VERSION, 'Seller strategy')],
    narrativeReferences: [ref('seller-narrative', SELLER_DECISION_BRIEF_NARRATIVE_VERSION, 'Seller narrative')],
    recommendationReferences: [ref('seller-recommendation', SELLER_DECISION_BRIEF_NARRATIVE_VERSION, 'Agent recommendation')],
    rightsReferences: ['agent-internal-rights', 'seller-review-rights'],
    freshnessReferences: ['point-in-time-current-market', 'point-in-time-current-competition'],
    agentAuthorship: { required: true, authorIdentity: 'PROJECT_ATLAS_REFERENCE_AGENT' as const, reviewedAt: `${AS_OF}T12:00:00.000Z`, reviewState: 'AGENT_REVIEW_REQUIRED' as AtlasOutputReviewState },
  };

  return freezeArray([
    outputVersion({
      ...common,
      id: 'seller-decision-brief-v1-reviewed',
      displayVersion: 'Seller Decision Brief V1',
      purpose: 'Reviewed Seller presentation baseline.',
      lifecycleState: 'ARCHIVED_HISTORICAL_REFERENCE',
      reviewState: 'AGENT_REVIEWED',
      contentVersion: SELLER_DECISION_BRIEF_CONTENT_VERSION,
      compositionVersion: SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
      parentVersion: null,
      priorReviewedVersion: null,
      derivedFromVersion: null,
      revisedFromVersion: null,
      refreshedFromVersion: null,
      recomposedFromVersion: null,
      supersedesVersion: null,
      supersededByVersion: 'seller-decision-brief-v2-reviewed',
      pricingReferences: [],
      financialReferences: [],
      postLaunchReferences: [],
      sellerClientDecisionReferences: [],
      evidenceSnapshotReferences: [ref('evidence-snapshot-seller-v1', 'EVIDENCE_SNAPSHOT_V1')],
      dependencyReferences: ['dep-property-fact-module', 'dep-market-module'],
      fingerprintInputs: ['seller-v1', SELLER_DECISION_BRIEF_CONTENT_VERSION],
    }),
    outputVersion({
      ...common,
      id: 'seller-decision-brief-v2-reviewed',
      displayVersion: 'Reviewed Aug 27',
      purpose: 'Seller Decision Brief V2 reviewed output.',
      lifecycleState: 'AGENT_REVIEWED',
      reviewState: 'AGENT_REVIEW_REQUIRED',
      contentVersion: SELLER_DECISION_BRIEF_V2_VERSION,
      compositionVersion: SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION,
      parentVersion: 'seller-decision-brief-v1-reviewed',
      priorReviewedVersion: 'seller-decision-brief-v1-reviewed',
      derivedFromVersion: 'seller-decision-brief-v1-reviewed',
      revisedFromVersion: 'seller-decision-brief-v1-reviewed',
      refreshedFromVersion: null,
      recomposedFromVersion: null,
      supersedesVersion: 'seller-decision-brief-v1-reviewed',
      supersededByVersion: 'seller-update-current-version',
      pricingReferences: [ref(selectedScenario.id, selectedScenario.version, selectedScenario.name), ref('seller-pricing-framework', pricing.version)],
      financialReferences: [ref(selectedScenario.financialLink.id, selectedScenario.financialLink.version, 'Financial link')],
      postLaunchReferences: [],
      sellerClientDecisionReferences: [ref(pricing.sellerDecision.id, pricing.sellerDecision.version, 'Seller pricing decision')],
      evidenceSnapshotReferences: [ref('evidence-snapshot-seller-v2', 'EVIDENCE_SNAPSHOT_V1')],
      dependencyReferences: ['dep-property-fact-module', 'dep-market-module', 'dep-agent-narrative-output', 'dep-recommendation-decision'],
      fingerprintInputs: ['seller-v2', SELLER_DECISION_BRIEF_V2_VERSION, selectedScenario.id, SELLER_DECISION_BRIEF_NARRATIVE_VERSION],
    }),
    outputVersion({
      ...common,
      id: 'seller-pricing-version-reviewed',
      displayVersion: 'Pricing review 1',
      purpose: 'Seller pricing and positioning version.',
      lifecycleState: 'AGENT_REVIEWED',
      reviewState: 'AGENT_REVIEW_REQUIRED',
      contentVersion: pricing.version,
      compositionVersion: pricing.version,
      parentVersion: 'seller-decision-brief-v2-reviewed',
      priorReviewedVersion: 'seller-decision-brief-v2-reviewed',
      derivedFromVersion: 'seller-decision-brief-v2-reviewed',
      revisedFromVersion: null,
      refreshedFromVersion: AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION,
      recomposedFromVersion: null,
      supersedesVersion: null,
      supersededByVersion: null,
      pricingReferences: [ref(selectedScenario.id, selectedScenario.version, selectedScenario.name), ref('seller-pricing-search-band-set', SELLER_PRICING_SEARCH_BAND_VERSION)],
      financialReferences: [ref(selectedScenario.financialLink.id, selectedScenario.financialLink.version, 'Financial link')],
      postLaunchReferences: [],
      sellerClientDecisionReferences: [ref(pricing.sellerDecision.id, pricing.sellerDecision.version, 'Seller pricing decision')],
      evidenceSnapshotReferences: [ref('evidence-snapshot-pricing-v1', 'EVIDENCE_SNAPSHOT_V1')],
      dependencyReferences: ['dep-market-pricing-context', 'dep-competition-pricing-scenario', 'dep-search-band-price-option', 'dep-pricing-financial-link'],
      fingerprintInputs: ['pricing-v1', selectedScenario.id, selectedScenario.priceAssumption.value, selectedScenario.searchBandId],
    }),
    outputVersion({
      ...common,
      id: 'seller-launch-context-version',
      displayVersion: 'Launch context',
      purpose: 'Launch context derived from selected pricing scenario.',
      lifecycleState: 'SELLER_REVIEWED_OR_PRESENTED',
      reviewState: 'AGENT_REVIEWED',
      contentVersion: 'SELLER_LAUNCH_CONTEXT_V1',
      compositionVersion: pricing.version,
      parentVersion: 'seller-pricing-version-reviewed',
      priorReviewedVersion: 'seller-pricing-version-reviewed',
      derivedFromVersion: 'seller-pricing-version-reviewed',
      revisedFromVersion: null,
      refreshedFromVersion: null,
      recomposedFromVersion: null,
      supersedesVersion: null,
      supersededByVersion: 'seller-post-launch-review-current',
      pricingReferences: [ref(selectedScenario.id, selectedScenario.version, selectedScenario.name)],
      financialReferences: [ref(selectedScenario.financialLink.id, selectedScenario.financialLink.version, 'Financial link')],
      postLaunchReferences: [],
      sellerClientDecisionReferences: [ref(pricing.sellerDecision.id, pricing.sellerDecision.version, 'Seller pricing decision')],
      evidenceSnapshotReferences: [ref('evidence-snapshot-launch-v1', 'EVIDENCE_SNAPSHOT_V1')],
      dependencyReferences: ['dep-pricing-decision-launch', 'dep-pricing-financial-link'],
      fingerprintInputs: ['launch', selectedScenario.id, pricing.sellerDecision.id],
    }),
    outputVersion({
      ...common,
      id: 'seller-post-launch-review-current',
      displayVersion: 'Post-launch review 1',
      purpose: 'Current context review after launch.',
      lifecycleState: 'AGENT_REVIEW_REQUIRED',
      reviewState: 'AGENT_REVIEW_REQUIRED',
      contentVersion: postLaunch.version,
      compositionVersion: postLaunch.reviewVersion,
      parentVersion: 'seller-launch-context-version',
      priorReviewedVersion: 'seller-launch-context-version',
      derivedFromVersion: 'seller-launch-context-version',
      revisedFromVersion: null,
      refreshedFromVersion: AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION,
      recomposedFromVersion: null,
      supersedesVersion: null,
      supersededByVersion: null,
      pricingReferences: [ref(postLaunch.currentPricingScenarioId, postLaunch.currentPricingScenarioVersion, 'Current selected pricing scenario')],
      financialReferences: [ref('post-launch-financial-continuity', REIE_FINANCIAL_DECISION_PREPARATION_VERSION, 'Financial continuity')],
      postLaunchReferences: [ref(postLaunch.reviewId, postLaunch.reviewVersion, 'Post-launch review')],
      sellerClientDecisionReferences: [ref(postLaunch.sellerDecision.id, postLaunch.sellerDecision.version, 'Post-launch Seller decision')],
      evidenceSnapshotReferences: [ref('evidence-snapshot-post-launch-v1', 'EVIDENCE_SNAPSHOT_V1')],
      dependencyReferences: ['dep-post-launch-seller-update', 'dep-market-pricing-context', 'dep-competition-pricing-scenario'],
      fingerprintInputs: ['post-launch', postLaunch.reviewId, postLaunch.currentMarket.asOf, postLaunch.sellerDecision.selectedAction],
    }),
    outputVersion({
      ...common,
      id: 'seller-update-superseded-version',
      outputProductId: 'seller-update-product-instance-v1',
      productKind: 'SELLER_PRESENTATION',
      displayVersion: 'Seller Update #0',
      purpose: 'Prior Seller Update retained as superseded history.',
      lifecycleState: 'SUPERSEDED',
      reviewState: 'AGENT_REVIEWED',
      contentVersion: SELLER_UPDATE_PRODUCT_VERSION,
      compositionVersion: postLaunch.sellerUpdateProduct.version,
      parentVersion: 'seller-post-launch-review-current',
      priorReviewedVersion: 'seller-post-launch-review-current',
      derivedFromVersion: 'seller-post-launch-review-current',
      revisedFromVersion: null,
      refreshedFromVersion: null,
      recomposedFromVersion: null,
      supersedesVersion: null,
      supersededByVersion: 'seller-update-current-version',
      pricingReferences: [ref(postLaunch.currentPricingScenarioId, postLaunch.currentPricingScenarioVersion, 'Current selected pricing scenario')],
      financialReferences: [ref('post-launch-financial-continuity', REIE_FINANCIAL_DECISION_PREPARATION_VERSION, 'Financial continuity')],
      postLaunchReferences: [ref(postLaunch.reviewId, postLaunch.reviewVersion, 'Post-launch review')],
      sellerClientDecisionReferences: [ref(postLaunch.sellerDecision.id, postLaunch.sellerDecision.version, 'Post-launch Seller decision')],
      evidenceSnapshotReferences: [ref('evidence-snapshot-seller-update-prior', 'EVIDENCE_SNAPSHOT_V1')],
      dependencyReferences: ['dep-post-launch-seller-update'],
      fingerprintInputs: ['seller-update-prior', postLaunch.reviewId],
    }),
    outputVersion({
      ...common,
      id: 'seller-update-current-version',
      outputProductId: 'seller-update-product-instance-v1',
      productKind: 'SELLER_PRESENTATION',
      displayVersion: 'Seller Update #1',
      purpose: 'Current Seller Update derived from post-launch review.',
      lifecycleState: 'READY_FOR_SELLER_REVIEW',
      reviewState: 'AGENT_REVIEW_REQUIRED',
      contentVersion: SELLER_UPDATE_PRODUCT_VERSION,
      compositionVersion: postLaunch.sellerUpdateProduct.version,
      parentVersion: 'seller-update-superseded-version',
      priorReviewedVersion: 'seller-update-superseded-version',
      derivedFromVersion: 'seller-post-launch-review-current',
      revisedFromVersion: null,
      refreshedFromVersion: AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION,
      recomposedFromVersion: 'seller-update-superseded-version',
      supersedesVersion: 'seller-update-superseded-version',
      supersededByVersion: null,
      pricingReferences: [ref(postLaunch.currentPricingScenarioId, postLaunch.currentPricingScenarioVersion, 'Current selected pricing scenario')],
      financialReferences: [ref('post-launch-financial-continuity', REIE_FINANCIAL_DECISION_PREPARATION_VERSION, 'Financial continuity')],
      postLaunchReferences: [ref(postLaunch.reviewId, postLaunch.reviewVersion, 'Post-launch review')],
      sellerClientDecisionReferences: [ref(postLaunch.sellerDecision.id, postLaunch.sellerDecision.version, 'Post-launch Seller decision')],
      evidenceSnapshotReferences: [ref('evidence-snapshot-seller-update-current', 'EVIDENCE_SNAPSHOT_V1')],
      dependencyReferences: ['dep-post-launch-seller-update', 'dep-rights-output-module', 'dep-freshness-output-module'],
      fingerprintInputs: ['seller-update-current', postLaunch.reviewId, postLaunch.updatedRecommendation.currentRecommendation, postLaunch.sellerDecision.selectedAction],
    }),
    outputVersion({
      ...common,
      id: 'seller-update-invalidated-version',
      outputProductId: 'seller-update-product-instance-v1',
      productKind: 'SELLER_PRESENTATION',
      displayVersion: 'Seller Update invalidated fixture',
      purpose: 'Invalidated fixture demonstrating material market change.',
      lifecycleState: 'INVALIDATED',
      reviewState: 'AGENT_REVIEW_REQUIRED',
      contentVersion: SELLER_UPDATE_PRODUCT_VERSION,
      compositionVersion: postLaunch.sellerUpdateProduct.version,
      parentVersion: 'seller-update-current-version',
      priorReviewedVersion: 'seller-update-current-version',
      derivedFromVersion: 'seller-update-current-version',
      revisedFromVersion: null,
      refreshedFromVersion: 'market-snapshot-b',
      recomposedFromVersion: null,
      supersedesVersion: null,
      supersededByVersion: 'seller-update-draft-successor',
      pricingReferences: [ref(postLaunch.currentPricingScenarioId, postLaunch.currentPricingScenarioVersion, 'Current selected pricing scenario')],
      financialReferences: [ref('post-launch-financial-continuity', REIE_FINANCIAL_DECISION_PREPARATION_VERSION, 'Financial continuity')],
      postLaunchReferences: [ref(postLaunch.reviewId, postLaunch.reviewVersion, 'Post-launch review')],
      sellerClientDecisionReferences: [ref(postLaunch.sellerDecision.id, postLaunch.sellerDecision.version, 'Post-launch Seller decision')],
      evidenceSnapshotReferences: [ref('evidence-snapshot-seller-update-invalidated', 'EVIDENCE_SNAPSHOT_V1')],
      dependencyReferences: ['dep-market-module', 'dep-market-pricing-context'],
      fingerprintInputs: ['seller-update-invalidated', 'market-snapshot-b'],
    }),
    outputVersion({
      ...common,
      id: 'seller-update-draft-successor',
      outputProductId: 'seller-update-product-instance-v1',
      productKind: 'SELLER_PRESENTATION',
      displayVersion: 'Seller Update #2 draft',
      purpose: 'Draft successor derived after material refresh.',
      lifecycleState: 'DRAFT',
      reviewState: 'DRAFT',
      contentVersion: SELLER_UPDATE_PRODUCT_VERSION,
      compositionVersion: postLaunch.sellerUpdateProduct.version,
      parentVersion: 'seller-update-current-version',
      priorReviewedVersion: 'seller-update-current-version',
      derivedFromVersion: 'seller-update-current-version',
      revisedFromVersion: null,
      refreshedFromVersion: 'market-snapshot-b',
      recomposedFromVersion: 'seller-update-current-version',
      supersedesVersion: null,
      supersededByVersion: null,
      pricingReferences: [ref(postLaunch.currentPricingScenarioId, postLaunch.currentPricingScenarioVersion, 'Current selected pricing scenario')],
      financialReferences: [ref('post-launch-financial-continuity', REIE_FINANCIAL_DECISION_PREPARATION_VERSION, 'Financial continuity')],
      postLaunchReferences: [ref('next-post-launch-review-seam', SELLER_POST_LAUNCH_REVIEW_VERSION, 'Next post-launch review seam')],
      sellerClientDecisionReferences: [ref('next-seller-decision-seam', SELLER_POST_LAUNCH_SELLER_DECISION_VERSION, 'Next Seller decision seam')],
      evidenceSnapshotReferences: [ref('evidence-snapshot-seller-update-successor', 'EVIDENCE_SNAPSHOT_V1')],
      dependencyReferences: ['dep-market-pricing-context', 'dep-pricing-financial-link'],
      fingerprintInputs: ['seller-update-draft-successor', 'market-snapshot-b', 'price-assumption-b'],
    }),
    outputVersion({
      ...common,
      id: 'financial-decision-version-seam',
      outputProductId: 'financial-review-product-seam',
      productKind: 'MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS',
      audience: 'AGENT_INTERNAL',
      displayVersion: 'Financial review seam',
      purpose: 'Future financial decision preparation version seam.',
      lifecycleState: 'AGENT_REVIEW_REQUIRED',
      reviewState: 'AGENT_REVIEW_REQUIRED',
      contentVersion: REIE_FINANCIAL_DECISION_PREPARATION_VERSION,
      compositionVersion: SELLER_PRICING_FINANCIAL_LINK_VERSION,
      parentVersion: 'seller-pricing-version-reviewed',
      priorReviewedVersion: 'seller-pricing-version-reviewed',
      derivedFromVersion: 'seller-pricing-version-reviewed',
      revisedFromVersion: null,
      refreshedFromVersion: null,
      recomposedFromVersion: null,
      supersedesVersion: null,
      supersededByVersion: null,
      pricingReferences: [ref(selectedScenario.id, selectedScenario.version, selectedScenario.name)],
      financialReferences: [ref('financial-preparation', REIE_FINANCIAL_DECISION_PREPARATION_VERSION, 'Financial preparation')],
      postLaunchReferences: [],
      sellerClientDecisionReferences: [ref(pricing.sellerDecision.id, pricing.sellerDecision.version, 'Seller pricing decision')],
      evidenceSnapshotReferences: [ref('evidence-snapshot-financial-seam', 'EVIDENCE_SNAPSHOT_V1')],
      dependencyReferences: ['dep-pricing-financial-link'],
      fingerprintInputs: ['financial-seam', selectedScenario.id, selectedScenario.priceAssumption.value],
    }),
    outputVersion({
      ...common,
      id: 'render-version-seam',
      outputProductId: 'seller-render-product-seam',
      displayVersion: 'Render seam',
      purpose: 'Future print/PDF render version seam.',
      lifecycleState: 'COMPOSED',
      reviewState: 'COMPOSED',
      contentVersion: SELLER_UPDATE_PRODUCT_VERSION,
      compositionVersion: postLaunch.sellerUpdateProduct.version,
      presentationVisualVersion: 'SELLER_OUTPUT_RENDER_VERSION_SEAM_V1',
      parentVersion: 'seller-update-current-version',
      priorReviewedVersion: 'seller-update-current-version',
      derivedFromVersion: 'seller-update-current-version',
      revisedFromVersion: null,
      refreshedFromVersion: null,
      recomposedFromVersion: null,
      supersedesVersion: null,
      supersededByVersion: null,
      pricingReferences: [ref(postLaunch.currentPricingScenarioId, postLaunch.currentPricingScenarioVersion, 'Current selected pricing scenario')],
      financialReferences: [],
      postLaunchReferences: [ref(postLaunch.reviewId, postLaunch.reviewVersion, 'Post-launch review')],
      sellerClientDecisionReferences: [ref(postLaunch.sellerDecision.id, postLaunch.sellerDecision.version, 'Post-launch Seller decision')],
      evidenceSnapshotReferences: [ref('evidence-snapshot-seller-update-current', 'EVIDENCE_SNAPSHOT_V1')],
      dependencyReferences: ['dep-presentation-render'],
      fingerprintInputs: ['render-seam', SELLER_UPDATE_PRODUCT_VERSION, 'visual-only'],
    }),
  ]);
}

function sourceSnapshot(
  id: string,
  state: AtlasOutputSourceSnapshotState,
  sourceType: AtlasSourceSnapshot['sourceType'],
  sourceReference: string,
  sourceVersion: string,
  subjectCohortQueryReference: string,
  fieldMetricReferences: readonly string[],
  coverage: string,
): AtlasSourceSnapshot {
  const values = freezeArray(fieldMetricReferences.map((field) => `${field}:fixture-value`));
  return Object.freeze({
    id,
    state,
    sourceType,
    sourceReference,
    sourceVersion,
    subjectCohortQueryReference,
    asOf: AS_OF,
    observedRetrievedAt: `${AS_OF}T11:00:00.000Z`,
    fieldMetricReferences: freezeArray(fieldMetricReferences),
    coverage,
    rightsState: 'ADMITTED_FOR_AGENT_INTERNAL',
    freshness: 'POINT_IN_TIME',
    limitations: freezeArray(['Domain-only deterministic fixture; no provider/runtime call was performed.']),
    methodCalculationVersion: OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION,
    materializedReviewedValues: values,
    fingerprint: atlasOutputFingerprint('SOURCE_SNAPSHOT_FINGERPRINT', [id, sourceVersion, subjectCohortQueryReference, fieldMetricReferences, values]),
  });
}

function buildSourceSnapshots(): readonly AtlasSourceSnapshot[] {
  return freezeArray([
    sourceSnapshot('source-snapshot-subject-property', 'REVIEWED_SNAPSHOT', 'SUBJECT_PROPERTY', 'SELLER_DECISION_BRIEF_V2', SELLER_DECISION_BRIEF_V2_VERSION, 'seller-decision-brief-subject-property', ['propertyType', 'beds', 'baths', 'squareFeet', 'lot', 'yearBuilt'], 'Subject property facts for Seller output.'),
    sourceSnapshot('source-snapshot-current-market-cohort', 'CURRENT_QUERY_RESULT', 'CURRENT_MARKET_COHORT', 'AGENT_CURRENT_SNAPSHOT_COMPARISON', AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION, ATLAS_COHORT_CONTRACT_VERSION, ['currentPopulation', 'currentPriceMetrics', 'searchBandCount'], 'Current market cohort point-in-time snapshot.'),
    sourceSnapshot('source-snapshot-current-competition', 'CURRENT_QUERY_RESULT', 'CURRENT_COMPETITION', 'CURRENT_COMPETING_LISTING_CONTEXT', CURRENT_COMPETING_LISTING_CONTEXT_VERSION, 'seller-current-competition-set', ['listingIds', 'askingPrice', 'status', 'propertyFacts'], 'Current competition point-in-time snapshot.'),
    sourceSnapshot('source-snapshot-search-band-context', 'REVIEWED_SNAPSHOT', 'SEARCH_BAND_CONTEXT', 'SELLER_PRICING_SEARCH_BAND', SELLER_PRICING_SEARCH_BAND_VERSION, 'seller-pricing-search-band-set', ['lowerBound', 'upperBound', 'boundarySemantics', 'listingCount'], 'Agent-defined search-band context.'),
    sourceSnapshot('source-snapshot-pricing-context', 'REVIEWED_SNAPSHOT', 'PRICING_CONTEXT', 'SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK', SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION, 'seller-pricing-scenario-balance', ['objective', 'priceAssumption', 'scenarioId', 'financialLink'], 'Reviewed Seller pricing context.'),
    sourceSnapshot('source-snapshot-post-launch-review', 'REVIEWED_SNAPSHOT', 'POST_LAUNCH_REVIEW', 'SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW', SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_VERSION, 'seller-post-launch-review-v1-fixture', ['checkpoint', 'responseInputs', 'changeSets', 'sellerDecision'], 'Current post-launch review context.'),
    sourceSnapshot('source-snapshot-financial-reference', 'HISTORICAL_REVIEWED_SNAPSHOT', 'FINANCIAL_REFERENCE', 'REIE_FINANCIAL_DECISION_PREPARATION', REIE_FINANCIAL_DECISION_PREPARATION_VERSION, 'seller-financial-preparation-reference', ['priceAssumption', 'sellerTiming', 'financialConstraint'], 'Financial review seam only.'),
  ]);
}

function evidenceSnapshot(id: string, outputVersionId: string, sources: readonly string[], metrics: readonly string[], analysis: readonly string[], agentInputs: readonly string[], assumptions: readonly string[], limitations: readonly string[]): AtlasOutputEvidenceSnapshot {
  return Object.freeze({
    id,
    outputVersionId,
    sourceSnapshotReferences: freezeArray(sources),
    metricReferences: freezeArray(metrics),
    analysisReferences: freezeArray(analysis),
    agentInputReferences: freezeArray(agentInputs),
    assumptionReferences: freezeArray(assumptions),
    limitationReferences: freezeArray(limitations),
    rightsReferences: freezeArray(['agent-internal-rights', 'seller-review-rights']),
    freshnessReferences: freezeArray(['point-in-time-current-market', 'point-in-time-current-competition']),
    createdAt: `${AS_OF}T11:30:00.000Z`,
    reviewState: 'AGENT_REVIEW_REQUIRED',
    fingerprint: atlasOutputFingerprint('EVIDENCE_SNAPSHOT_FINGERPRINT', [id, outputVersionId, sources, metrics, analysis, agentInputs, assumptions, limitations]),
  });
}

function dependency(id: string, upstreamArtifact: string, downstreamArtifact: string, dependencyType: AtlasOutputDependencyType, materiality: AtlasOutputDependency['materiality'], versionUsed: string, invalidationPolicy: AtlasOutputInvalidationState, currentState = invalidationPolicy): AtlasOutputDependency {
  return Object.freeze({
    id,
    upstreamArtifact,
    downstreamArtifact,
    dependencyType,
    materiality,
    versionUsed,
    fieldMetricScope: freezeArray(['identity', 'version', 'asOf', 'reviewState']),
    changePolicy: 'Material upstream version changes derive successor output versions or force review.',
    invalidationPolicy,
    reviewPolicy: 'AGENT_REVIEW_REQUIRED',
    currentState,
  });
}

function buildDependencies(): readonly AtlasOutputDependency[] {
  return freezeArray([
    dependency('dep-property-fact-module', 'PROPERTY FACT', 'PROPERTY MODULE', 'FACT_DEPENDENCY', 'HIGH', SELLER_DECISION_BRIEF_V2_VERSION, 'RECOMPOSE_REQUIRED', 'CURRENT'),
    dependency('dep-market-module', 'MARKET SNAPSHOT', 'MARKET MODULE', 'MARKET_DEPENDENCY', 'HIGH', AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION, 'REFRESH_RECOMMENDED'),
    dependency('dep-market-pricing-context', 'MARKET SNAPSHOT', 'PRICING CURRENT CONTEXT', 'MARKET_DEPENDENCY', 'HIGH', AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION, 'REVIEW_REQUIRED'),
    dependency('dep-competition-pricing-scenario', 'COMPETITION SET', 'PRICING SCENARIO', 'COMPETITION_DEPENDENCY', 'HIGH', CURRENT_COMPETING_LISTING_CONTEXT_VERSION, 'REVIEW_REQUIRED'),
    dependency('dep-search-band-price-option', 'SEARCH-BAND SET', 'PRICE OPTION', 'SEARCH_BAND_DEPENDENCY', 'HIGH', SELLER_PRICING_SEARCH_BAND_VERSION, 'RECOMPUTE_REQUIRED'),
    dependency('dep-agent-input-timing', 'AGENT / SELLER TIMING INPUT', 'SELLER TIMELINE MODULE', 'AGENT_INPUT_DEPENDENCY', 'HIGH', SELLER_DECISION_BRIEF_STRATEGY_VERSION, 'REVIEW_REQUIRED'),
    dependency('dep-agent-narrative-output', 'AGENT NARRATIVE', 'SELLER OUTPUT', 'NARRATIVE_DEPENDENCY', 'MEDIUM', SELLER_DECISION_BRIEF_NARRATIVE_VERSION, 'REVIEW_REQUIRED', 'CURRENT'),
    dependency('dep-recommendation-decision', 'RECOMMENDATION', 'SELLER DECISION', 'RECOMMENDATION_DEPENDENCY', 'CRITICAL', SELLER_DECISION_BRIEF_NARRATIVE_VERSION, 'REVIEW_REQUIRED'),
    dependency('dep-seller-decision-supersession', 'SELLER DECISION', 'SELLER UPDATE', 'RECOMMENDATION_DEPENDENCY', 'CRITICAL', SELLER_POST_LAUNCH_SELLER_DECISION_VERSION, 'SUPERSEDED'),
    dependency('dep-pricing-financial-link', 'PRICING SCENARIO', 'FINANCIAL LINK', 'FINANCIAL_DEPENDENCY', 'CRITICAL', SELLER_PRICING_FINANCIAL_LINK_VERSION, 'REVIEW_REQUIRED'),
    dependency('dep-post-launch-seller-update', 'POST-LAUNCH REVIEW', 'SELLER UPDATE', 'PRICING_DEPENDENCY', 'HIGH', SELLER_POST_LAUNCH_REVIEW_VERSION, 'REVIEW_REQUIRED'),
    dependency('dep-rights-output-module', 'RIGHTS', 'OUTPUT MODULE', 'RIGHTS_DEPENDENCY', 'CRITICAL', 'RIGHTS_SNAPSHOT_V1', 'RIGHTS_REVIEW_REQUIRED'),
    dependency('dep-freshness-output-module', 'FRESHNESS', 'OUTPUT MODULE', 'FRESHNESS_DEPENDENCY', 'HIGH', 'FRESHNESS_SNAPSHOT_V1', 'FRESHNESS_REVIEW_REQUIRED'),
    dependency('dep-evidence-insufficient-module', 'EVIDENCE SNAPSHOT', 'OUTPUT MODULE', 'FACT_DEPENDENCY', 'HIGH', 'EVIDENCE_SNAPSHOT_V1', 'EVIDENCE_INSUFFICIENT'),
    dependency('dep-presentation-render', 'PRESENTATION VERSION', 'RENDER VERSION SEAM', 'PRESENTATION_DEPENDENCY', 'LOW', 'SELLER_OUTPUT_RENDER_VERSION_SEAM_V1', 'CURRENT', 'CURRENT'),
  ]);
}

function diff(id: string, diffClass: AtlasOutputDiffClass, severity: AtlasOutputDiffSeverity, invalidatedDependencies: readonly string[], sellerSummary: string): AtlasOutputVersionDiff {
  return Object.freeze({
    id,
    diffClass,
    priorOutputVersion: 'seller-update-current-version',
    currentOutputVersion: diffClass === 'NO_MATERIAL_CHANGE' || diffClass === 'PRESENTATION_ONLY' ? 'render-version-seam' : 'seller-update-draft-successor',
    changedSections: freezeArray(diffClass === 'PRESENTATION_ONLY' || diffClass === 'NO_MATERIAL_CHANGE' ? [] : ['seller-brief-market', 'seller-brief-competition']),
    changedModules: freezeArray(diffClass === 'PRESENTATION_ONLY' ? [] : ['seller-module-current-market-snapshot', 'seller-module-current-competition']),
    changedInputs: freezeArray(diffClass === 'PRICING_CHANGED' ? ['priceAssumption'] : diffClass === 'FINANCIAL_CHANGED' ? ['financialConstraint'] : []),
    changedEvidence: freezeArray(diffClass === 'DATA_REFRESH' || diffClass === 'EVIDENCE_CHANGED' ? ['source-snapshot-current-market-cohort'] : []),
    changedAgentContent: freezeArray(diffClass === 'AGENT_INPUT_CHANGED' || diffClass === 'RECOMMENDATION_CHANGED' ? ['seller-recommendation'] : []),
    changedRecommendations: freezeArray(diffClass === 'RECOMMENDATION_CHANGED' ? ['updatedRecommendation'] : []),
    changedPricing: freezeArray(diffClass === 'PRICING_CHANGED' ? ['seller-pricing-scenario-balance'] : []),
    changedFinancial: freezeArray(diffClass === 'FINANCIAL_CHANGED' ? ['post-launch-financial-continuity'] : []),
    rightsChanges: freezeArray(diffClass === 'RIGHTS_CHANGED' ? ['seller-review-rights'] : []),
    freshnessChanges: freezeArray(diffClass === 'FRESHNESS_CHANGED' ? ['point-in-time-current-market'] : []),
    presentationOnlyChanges: freezeArray(diffClass === 'PRESENTATION_ONLY' ? ['presentationVisualVersion'] : []),
    invalidatedDependencies: freezeArray(invalidatedDependencies),
    severity,
    sellerFacingChangeSummary: sellerSummary,
    agentInternalDetail: `${diffClass} evaluated through deterministic fixture and shared dependency graph.`,
  });
}

function buildSectionInstances(preview = buildSellerDecisionBriefCompositionPreview()): readonly AtlasOutputSectionInstance[] {
  return freezeArray(preview.sectionPresentations.slice(0, 6).map((section, index) => Object.freeze({
    id: `section-instance-${section.sectionId}`,
    sectionDefinitionId: section.sectionId,
    sectionDefinitionVersion: SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
    outputVersionId: 'seller-decision-brief-v2-reviewed',
    moduleInstanceReferences: freezeArray(section.modules.slice(0, 3).map((module) => `module-instance-${module.module.id}`)),
    order: index + 1,
    inclusion: section.readinessState === 'READY' ? 'INCLUDED' : 'HELD_FOR_REVIEW',
    readiness: section.readinessState === 'RIGHTS_REQUIRED' ? 'RIGHTS_REVIEW_REQUIRED' : section.readinessState === 'FRESHNESS_REQUIRED' ? 'FRESHNESS_REVIEW_REQUIRED' : section.readinessState === 'READY' ? 'READY' : 'AGENT_REVIEW_REQUIRED',
    reviewState: section.readinessState === 'READY' ? 'COMPOSED' : 'AGENT_REVIEW_REQUIRED',
    parentVersion: 'seller-decision-brief-v1-reviewed',
    priorReference: 'seller-decision-brief-v1-reviewed',
    supersessionReference: null,
    fingerprint: atlasOutputFingerprint('SECTION_INSTANCE_FINGERPRINT', [section.sectionId, section.modules.map((module) => module.module.id), section.readinessState]),
  })));
}

function buildModuleInstances(preview = buildSellerDecisionBriefCompositionPreview()): readonly AtlasOutputModuleInstance[] {
  return freezeArray(preview.sectionPresentations.slice(0, 6).flatMap((section) => section.modules.slice(0, 2).map((module, index) => Object.freeze({
    id: `module-instance-${module.module.id}`,
    moduleDefinitionId: module.module.id,
    moduleDefinitionVersion: SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
    outputVersionId: 'seller-decision-brief-v2-reviewed',
    sectionInstanceId: `section-instance-${section.sectionId}`,
    inputReferences: freezeArray([ref(module.registry.inputType, module.module.id, module.registry.purpose)]),
    evidenceSnapshotReference: 'evidence-snapshot-seller-v2',
    contentVersion: SELLER_DECISION_BRIEF_V2_VERSION,
    agentInputVersion: module.agentAuthorship ? SELLER_DECISION_BRIEF_STRATEGY_VERSION : null,
    narrativeVersion: SELLER_DECISION_BRIEF_NARRATIVE_VERSION,
    visualVersion: module.visualComponent,
    readiness: module.readinessState === 'RIGHTS_REQUIRED' ? 'RIGHTS_REVIEW_REQUIRED' : module.readinessState === 'FRESHNESS_REQUIRED' ? 'FRESHNESS_REVIEW_REQUIRED' : module.readinessState === 'READY' ? 'READY' : 'AGENT_REVIEW_REQUIRED',
    reviewState: module.readinessState === 'READY' ? 'COMPOSED' : 'AGENT_REVIEW_REQUIRED',
    inclusion: module.includedByDefault ? 'INCLUDED' : 'AVAILABLE_OPTIONAL',
    order: index + 1,
    parentVersion: 'seller-decision-brief-v1-reviewed',
    priorReference: 'seller-decision-brief-v1-reviewed',
    supersededBy: null,
    fingerprint: atlasOutputFingerprint('MODULE_INSTANCE_FINGERPRINT', [module.module.id, module.visualComponent, module.evidence.map((evidence) => evidence.id), module.readinessState]),
  }))));
}

export function adaptSellerDecisionBriefV2ToOutputVersion() {
  return buildOutputVersionLineageInvalidationFoundation().outputVersions.find((version) => version.id === 'seller-decision-brief-v2-reviewed');
}

export function adaptSellerPricingToOutputVersion() {
  return buildOutputVersionLineageInvalidationFoundation().outputVersions.find((version) => version.id === 'seller-pricing-version-reviewed');
}

export function adaptPostLaunchReviewToOutputVersion() {
  return buildOutputVersionLineageInvalidationFoundation().outputVersions.find((version) => version.id === 'seller-post-launch-review-current');
}

export function adaptSellerUpdateToOutputVersion() {
  return buildOutputVersionLineageInvalidationFoundation().outputVersions.find((version) => version.id === 'seller-update-current-version');
}

export function buildOutputVersionLineageInvalidationFoundation(): AtlasOutputVersionFoundation {
  const pricing = SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_FIXTURE;
  const postLaunch = SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_FIXTURE;
  const outputVersions = buildOutputVersions(pricing, postLaunch);
  const sourceSnapshots = buildSourceSnapshots();
  const evidenceSnapshots = freezeArray([
    evidenceSnapshot('evidence-snapshot-seller-v1', 'seller-decision-brief-v1-reviewed', ['source-snapshot-subject-property'], ['propertyFacts'], ['seller-v1-analysis'], ['agent-input-v1'], ['seller-baseline-assumption'], ['seller-v1-limitations']),
    evidenceSnapshot('evidence-snapshot-seller-v2', 'seller-decision-brief-v2-reviewed', ['source-snapshot-subject-property', 'source-snapshot-current-market-cohort', 'source-snapshot-current-competition'], ['propertyFacts', 'currentMarket', 'currentCompetition'], ['seller-v2-analysis'], ['agent-narrative-v1'], ['seller-v2-assumption'], ['seller-v2-limitations']),
    evidenceSnapshot('evidence-snapshot-pricing-v1', 'seller-pricing-version-reviewed', ['source-snapshot-current-market-cohort', 'source-snapshot-current-competition', 'source-snapshot-search-band-context', 'source-snapshot-pricing-context'], ['searchBands', 'priceAssumption'], ['pricing-analysis'], ['pricing-agent-rationale'], ['pricing-assumption'], ['pricing-limitations']),
    evidenceSnapshot('evidence-snapshot-launch-v1', 'seller-launch-context-version', ['source-snapshot-pricing-context'], ['selectedScenario'], ['launch-analysis'], ['launch-agent-review'], ['launch-assumption'], ['launch-limitations']),
    evidenceSnapshot('evidence-snapshot-post-launch-v1', 'seller-post-launch-review-current', ['source-snapshot-post-launch-review', 'source-snapshot-current-market-cohort', 'source-snapshot-current-competition'], ['changeSets', 'responseInputs'], ['post-launch-analysis'], ['post-launch-agent-interpretation'], ['post-launch-assumption'], ['post-launch-limitations']),
    evidenceSnapshot('evidence-snapshot-seller-update-current', 'seller-update-current-version', ['source-snapshot-post-launch-review', 'source-snapshot-current-market-cohort', 'source-snapshot-current-competition'], ['sellerUpdateModules'], ['seller-update-analysis'], ['updatedRecommendation'], ['seller-update-assumption'], ['seller-update-limitations']),
    evidenceSnapshot('evidence-snapshot-seller-update-prior', 'seller-update-superseded-version', ['source-snapshot-post-launch-review'], ['priorUpdateModules'], ['prior-update-analysis'], ['prior-recommendation'], ['prior-update-assumption'], ['prior-update-limitations']),
    evidenceSnapshot('evidence-snapshot-seller-update-invalidated', 'seller-update-invalidated-version', ['source-snapshot-current-market-cohort'], ['marketSnapshotB'], ['invalidated-analysis'], ['agent-review-required'], ['invalidated-assumption'], ['invalidated-limitations']),
    evidenceSnapshot('evidence-snapshot-seller-update-successor', 'seller-update-draft-successor', ['source-snapshot-current-market-cohort', 'source-snapshot-current-competition'], ['marketSnapshotB', 'competitionSetB'], ['successor-analysis'], ['draft-agent-input'], ['successor-assumption'], ['successor-limitations']),
    evidenceSnapshot('evidence-snapshot-financial-seam', 'financial-decision-version-seam', ['source-snapshot-financial-reference', 'source-snapshot-pricing-context'], ['financialReviewState'], ['financial-seam-analysis'], ['professional-input-seam'], ['financial-assumption'], ['financial-limitations']),
  ]);
  const dependencies = buildDependencies();
  const invalidationEvaluations = freezeArray(ATLAS_OUTPUT_UPSTREAM_CHANGE_TYPES.map(evaluateOutputInvalidation));
  const diffs = freezeArray([
    diff('diff-data-refresh', 'DATA_REFRESH', 'DATA_REFRESH', ['dep-market-module', 'dep-market-pricing-context'], 'Market context refreshed and needs Agent review.'),
    diff('diff-agent-content-change', 'AGENT_INPUT_CHANGED', 'MATERIAL_CONTENT', ['dep-agent-narrative-output'], 'Agent content changed and should be reviewed.'),
    diff('diff-recommendation-change', 'RECOMMENDATION_CHANGED', 'DECISION_RELEVANT', ['dep-recommendation-decision'], 'Recommendation changed and linked Seller decision requires review.'),
    diff('diff-pricing-change', 'PRICING_CHANGED', 'DECISION_RELEVANT', ['dep-pricing-financial-link'], 'Pricing changed and Seller Update must be reviewed.'),
    diff('diff-financial-link-change', 'FINANCIAL_CHANGED', 'FINANCIAL_CRITICAL', ['dep-pricing-financial-link'], 'Financial link changed and requires Agent review.'),
    diff('diff-no-material-change', 'NO_MATERIAL_CHANGE', 'NON_MATERIAL_CONTENT', [], 'No material Seller-facing change.'),
    diff('diff-presentation-only', 'PRESENTATION_ONLY', 'PRESENTATION_ONLY', ['dep-presentation-render'], 'Presentation-only change does not alter content.'),
  ]);

  return Object.freeze({
    status: OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_STATUS,
    version: OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION,
    route: '/agent/prepare/seller/presentation',
    outputVersions,
    sectionInstances: buildSectionInstances(),
    moduleInstances: buildModuleInstances(),
    sourceSnapshots,
    evidenceSnapshots,
    dependencies,
    invalidationEvaluations,
    diffs,
    sellerVersionChain: freezeArray([
      chain(1, 'SELLER DECISION BRIEF V1', SELLER_DECISION_BRIEF_CONTENT_VERSION, 'none', 'evidence-snapshot-seller-v1', 'AGENT_REVIEWED', 'none', 'SELLER_DECISION_BRIEF_V2'),
      chain(2, 'SELLER DECISION BRIEF V2', SELLER_DECISION_BRIEF_V2_VERSION, 'seller-decision-brief-v1-reviewed', 'evidence-snapshot-seller-v2', 'AGENT_REVIEW_REQUIRED', pricing.sellerDecision.id, 'PRICING_SCENARIO'),
      chain(3, 'PRICING SCENARIO', SELLER_PRICING_SCENARIO_VERSION, 'seller-decision-brief-v2-reviewed', 'evidence-snapshot-pricing-v1', 'AGENT_REVIEW_REQUIRED', pricing.sellerDecision.id, 'SELLER_PRICING_DECISION'),
      chain(4, 'SELLER PRICING DECISION', SELLER_PRICING_DECISION_VERSION, SELLER_PRICING_SCENARIO_VERSION, 'evidence-snapshot-pricing-v1', 'AGENT_REVIEW_REQUIRED', pricing.sellerDecision.id, 'LAUNCH_CONTEXT'),
      chain(5, 'LAUNCH CONTEXT', 'SELLER_LAUNCH_CONTEXT_V1', SELLER_PRICING_DECISION_VERSION, 'evidence-snapshot-launch-v1', 'AGENT_REVIEWED', pricing.sellerDecision.id, 'POST_LAUNCH_REVIEW'),
      chain(6, 'POST-LAUNCH REVIEW', SELLER_POST_LAUNCH_REVIEW_VERSION, 'seller-launch-context-version', 'evidence-snapshot-post-launch-v1', 'AGENT_REVIEW_REQUIRED', postLaunch.sellerDecision.id, 'SELLER_UPDATE'),
      chain(7, 'SELLER UPDATE', SELLER_UPDATE_PRODUCT_VERSION, 'seller-post-launch-review-current', 'evidence-snapshot-seller-update-current', 'AGENT_REVIEW_REQUIRED', postLaunch.sellerDecision.id, 'NEXT_SELLER_UPDATE_SEAM'),
      chain(8, 'NEXT SELLER UPDATE SEAM', SELLER_UPDATE_PRODUCT_VERSION, 'seller-update-current-version', 'evidence-snapshot-seller-update-successor', 'DRAFT', 'next-seller-decision-seam', 'FINANCIAL_DECISION_SEAM'),
      chain(9, 'FINANCIAL DECISION SEAM', REIE_FINANCIAL_DECISION_PREPARATION_VERSION, SELLER_PRICING_FINANCIAL_LINK_VERSION, 'evidence-snapshot-financial-seam', 'AGENT_REVIEW_REQUIRED', pricing.sellerDecision.id, 'RENDER_SEAM'),
      chain(10, 'RENDER SEAM', 'SELLER_OUTPUT_RENDER_VERSION_SEAM_V1', 'seller-update-current-version', 'evidence-snapshot-seller-update-current', 'COMPOSED', postLaunch.sellerDecision.id, 'PRINT_PDF_GATE'),
    ]),
    pricingLineage: freezeArray([
      pricingRow('PRICING OBJECTIVE', 'BALANCE_PRICE_AND_TIME', ['pricing-objective'], 'Agent objective interpretation', pricing.sellerDecision.id, 'Pricing scenario', 'AGENT_RECOMMENDATION_CHANGE'),
      pricingRow('SEARCH-BAND SET', SELLER_PRICING_SEARCH_BAND_VERSION, ['pricing-search-bands'], 'Agent-defined bands', pricing.sellerDecision.id, 'Price option', 'SEARCH_BAND_CHANGE'),
      pricingRow('PRICE ASSUMPTION', SELLER_PRICING_SCENARIO_VERSION, ['pricing-selected-price-assumption'], 'Agent-authored assumption', pricing.sellerDecision.id, 'Pricing scenario', 'PRICE_ASSUMPTION_CHANGE'),
      pricingRow('PRICING SCENARIO', SELLER_PRICING_SCENARIO_VERSION, ['pricing-current-cohort', 'pricing-current-competition'], 'Agent scenario rationale', pricing.sellerDecision.id, 'Seller pricing decision', 'SELECTED_PRICING_SCENARIO_CHANGE'),
      pricingRow('POSITIONING THEMES', SELLER_DECISION_BRIEF_STRATEGY_VERSION, ['seller-positioning-themes'], 'Agent positioning interpretation', pricing.sellerDecision.id, 'Seller output', 'AGENT_RECOMMENDATION_CHANGE'),
      pricingRow('AGENT RATIONALE', SELLER_PRICING_AGENT_RATIONALE_VERSION, ['pricing-agent-rationale'], 'Agent-authored rationale', pricing.sellerDecision.id, 'Recommendation', 'AGENT_RECOMMENDATION_CHANGE'),
      pricingRow('SELLER PRICING DECISION', SELLER_PRICING_DECISION_VERSION, ['pricing-seller-decision'], 'Agent records decision', pricing.sellerDecision.id, 'Launch context', 'SELECTED_PRICING_SCENARIO_CHANGE'),
      pricingRow('RESPONSE CHECKPOINT', 'SELLER_PRICING_RESPONSE_CHECKPOINT_V1', ['pricing-response-checkpoint'], 'Agent checkpoint plan', pricing.sellerDecision.id, 'Post-launch review', 'SELLER_TIMING_CHANGE'),
    ]),
    postLaunchLineage: freezeArray([
      postLaunchRow('POST-LAUNCH REVIEW', SELLER_POST_LAUNCH_REVIEW_VERSION, 'seller-launch-context-version', ['currentMarket', 'currentCompetition'], SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION, postLaunch.sellerDecision.id, 'SELLER UPDATE'),
      postLaunchRow('CHECKPOINT', SELLER_POST_LAUNCH_CHECKPOINT_VERSION, 'pricing response checkpoint', ['checkpoint'], SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION, postLaunch.sellerDecision.id, 'NEXT CHECKPOINT'),
      postLaunchRow('MARKET CHANGE SET', SELLER_POST_LAUNCH_CHANGE_SET_VERSION, 'prior market snapshot', ['currentMarket'], SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION, postLaunch.sellerDecision.id, 'SELLER UPDATE'),
      postLaunchRow('COMPETITION CHANGE SET', SELLER_POST_LAUNCH_CHANGE_SET_VERSION, 'prior competition set', ['currentCompetition'], SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION, postLaunch.sellerDecision.id, 'SELLER UPDATE'),
      postLaunchRow('SUBJECT CHANGE SET', SELLER_POST_LAUNCH_CHANGE_SET_VERSION, 'prior subject context', ['currentSubject'], SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION, postLaunch.sellerDecision.id, 'SELLER UPDATE'),
      postLaunchRow('RESPONSE INPUT SET', SELLER_POST_LAUNCH_RESPONSE_INPUT_SET_VERSION, 'prior response inputs', ['responseInputs'], SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION, postLaunch.sellerDecision.id, 'SELLER UPDATE'),
      postLaunchRow('UPDATED RECOMMENDATION', SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION_VERSION, 'prior recommendation', ['agentInterpretation'], SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION, postLaunch.sellerDecision.id, 'SELLER DECISION'),
      postLaunchRow('SELLER DECISION', SELLER_POST_LAUNCH_SELLER_DECISION_VERSION, SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION_VERSION, ['sellerDecision'], SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION, postLaunch.sellerDecision.id, 'NEXT CHECKPOINT'),
      postLaunchRow('NEXT CHECKPOINT', SELLER_POST_LAUNCH_CHECKPOINT_VERSION, SELLER_POST_LAUNCH_SELLER_DECISION_VERSION, ['nextCheckpoint'], SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION, postLaunch.sellerDecision.id, 'NEXT SELLER UPDATE'),
      postLaunchRow('SELLER UPDATE', SELLER_UPDATE_PRODUCT_VERSION, SELLER_POST_LAUNCH_REVIEW_VERSION, ['sellerUpdateProduct'], SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION, postLaunch.sellerDecision.id, 'SUPERSESSION SEAM'),
    ]),
    financialInvalidations: freezeArray([
      financialInvalidation('PRICE_ASSUMPTION_CHANGE', 'PRICE ASSUMPTION', 'READY_FOR_REVIEW', 'REVIEW_REQUIRED', 'Price assumption changed.', 'Review financial preparation seam.'),
      financialInvalidation('SELECTED_PRICING_SCENARIO_CHANGE', 'SELECTED PRICING SCENARIO', 'READY_FOR_REVIEW', 'REVIEW_REQUIRED', 'Selected scenario changed.', 'Review financial link before Seller use.'),
      financialInvalidation('SELLER_TIMING_CHANGE', 'SELLER TIMING', 'READY_FOR_REVIEW', 'REVIEW_REQUIRED', 'Seller timing changed.', 'Review timing-dependent financial assumptions.'),
      financialInvalidation('FINANCIAL_CONSTRAINT_CHANGE', 'FINANCIAL CONSTRAINT', 'READY_FOR_REVIEW', 'REVIEW_REQUIRED', 'Seller financial constraint changed.', 'Hold financial reference for Agent review.'),
    ]),
    reuseRules: buildReuseRules(),
    subjectAudienceTransform: buildSubjectAudienceTransform(),
    agentVersionUi: buildAgentVersionUi(),
    dependencyWarnings: freezeArray([
      warning('MARKET REFRESH AVAILABLE', 'MARKET_REFRESH', 'Market module / pricing context', 'REFRESH_RECOMMENDED', 'Refresh evidence and review market-dependent modules.'),
      warning('COMPETITION CHANGED', 'COMPETITION_CHANGE', 'Pricing scenario / Seller Update', 'REVIEW_REQUIRED', 'Review competition and pricing context.'),
      warning('PRICING REVIEW REQUIRED', 'PRICE_ASSUMPTION_CHANGE', 'Pricing output', 'RECOMPUTE_REQUIRED', 'Review pricing scenario before Seller use.'),
      warning('FINANCIAL REVIEW REQUIRED', 'FINANCIAL_CONSTRAINT_CHANGE', 'Financial link', 'REVIEW_REQUIRED', 'Review financial preparation seam.'),
      warning('RIGHTS REVIEW REQUIRED', 'RIGHTS_CHANGE', 'Output module', 'RIGHTS_REVIEW_REQUIRED', 'Hold module/output until rights review clears.'),
      warning('FRESHNESS REVIEW REQUIRED', 'FRESHNESS_CHANGE', 'Output module', 'FRESHNESS_REVIEW_REQUIRED', 'Refresh or review source freshness.'),
      warning('SELLER DECISION SUPERSEDED', 'AGENT_RECOMMENDATION_CHANGE', 'Seller decision', 'SUPERSEDED', 'Create successor decision reference.'),
    ]),
    fingerprints: freezeArray([
      fingerprintRow('OUTPUT CONTENT FINGERPRINT', ['productKind', 'audience', 'subject', 'module content versions', 'evidence snapshots', 'pricing', 'decision'], 'Render-only visual changes', 'Material content/evidence/decision changes', 'Detect reviewed output material changes.'),
      fingerprintRow('SOURCE SNAPSHOT FINGERPRINT', ['source', 'query/cohort', 'asOf', 'member identities', 'used fields', 'calculation version'], 'Presentation changes', 'Source/query/value changes', 'Reproduce reviewed evidence.'),
      fingerprintRow('MODULE INSTANCE FINGERPRINT', ['module definition', 'inputs', 'evidence snapshot', 'content', 'agent input', 'visual'], 'Unchanged inputs and content', 'Module inputs/content/evidence change', 'Scope module instances to output version.'),
      fingerprintRow('SECTION INSTANCE FINGERPRINT', ['section definition', 'module order', 'module instance references'], 'Module content unchanged', 'Section/module order or references change', 'Scope section composition.'),
      fingerprintRow('EVIDENCE SNAPSHOT FINGERPRINT', ['source snapshots', 'metrics', 'analysis', 'agent inputs', 'assumptions', 'limitations'], 'Render changes', 'Evidence/analysis assumptions change', 'Reproduce output evidence basis.'),
    ]),
    reproducibilityInputs: buildReproducibilityInputs(postLaunch),
    persistenceMapping: buildPersistenceMapping(),
    questionCoverage: freezeArray([
      'What output product is this?', 'What output version is this?', 'What state is it in?', 'Is it mutable?', 'What came before it?', 'Why was this version created?', 'What does it supersede?', 'What sections and modules does it contain?', 'What input versions does it use?', 'What evidence snapshot does it use?', 'What current / reviewed data context does it use?', 'What market version does it use?', 'What competition version does it use?', 'What pricing version does it use?', 'What recommendation version does it use?', 'What Seller decision version does it reference?', 'What post-launch review does it reference?', 'What changed from the prior version?', 'What dependencies are invalid?', 'What requires refresh?', 'What requires recomputation?', 'What requires recomposition?', 'What requires Agent review?', 'What can be reused?', 'What subject/audience scope applies?', 'Can the reviewed output be reproduced?', 'What is the future render version seam?', 'When does durable persistence become required?',
    ]),
    nextGateRanking: freezeArray([
      { rank: 1, gate: 'READY_FOR_PRINT_PDF_OUTPUT_PRODUCT_ARCHITECTURE', why: 'Agent-reviewed output versions now have content fingerprints, render seam, and Seller Update lineage.', dependencies: freezeArray(['Output version foundation', 'Seller Update preview', 'Print-preview foundation']), unlocks: 'PDF/print architecture without reworking lineage.' },
      { rank: 2, gate: 'READY_FOR_DURABLE_OUTPUT_PERSISTENCE_AUTHORIZATION', why: 'Persistence becomes material when reviewed output or Seller decision must be retained across sessions.', dependencies: freezeArray(['Rights/retention approval', 'OutputVersion durable schema']), unlocks: 'Cross-session reviewed output history.' },
      { rank: 3, gate: 'READY_FOR_SELLER_FINANCIAL_DECISION_PREPARATION_V1', why: 'Financial invalidation seam is explicit but no financial decision product is implemented.', dependencies: freezeArray(['Financial rights/review policy', 'Pricing scenario continuity']), unlocks: 'Reviewed financial decision preparation.' },
      { rank: 4, gate: 'READY_FOR_SELLER_UPDATE_VISUAL_DEPTH', why: 'Seller Update is versioned and can receive richer visual treatment.', dependencies: freezeArray(['Seller Update modules', 'Output version UI']), unlocks: 'More complete seller-facing update experience.' },
    ]),
    readiness: Object.freeze({
      sharedOutputProduct: 'IMPLEMENTED',
      outputVersionContract: 'IMPLEMENTED',
      versionStateMachine: 'IMPLEMENTED',
      reviewedImmutability: 'IMPLEMENTED',
      supersession: 'IMPLEMENTED',
      sectionInstance: 'IMPLEMENTED',
      moduleInstance: 'IMPLEMENTED',
      sourceSnapshot: 'IMPLEMENTED',
      evidenceSnapshot: 'IMPLEMENTED',
      dependencyGraph: 'IMPLEMENTED',
      materialChangeEvaluation: 'IMPLEMENTED',
      invalidation: 'IMPLEMENTED',
      outputDiff: 'IMPLEMENTED',
      sellerV2Adapter: 'IMPLEMENTED',
      pricingAdapter: 'IMPLEMENTED',
      postLaunchAdapter: 'IMPLEMENTED',
      sellerUpdateVersionChain: 'IMPLEMENTED',
      financialInvalidationSeam: 'IMPLEMENTED_WITH_HOLDS',
      agentVersionHistory: 'IMPLEMENTED',
      currentPriorDiff: 'IMPLEMENTED',
      dependencyWarnings: 'IMPLEMENTED',
      reuseRules: 'IMPLEMENTED',
      subjectScope: 'IMPLEMENTED',
      audienceTransform: 'IMPLEMENTED',
      reproducibility: 'IMPLEMENTED',
      renderVersionSeam: 'IMPLEMENTED_WITH_HOLDS',
      durablePersistence: 'NEXT_GATE',
      printPdf: 'NEXT_GATE',
      delivery: 'NEXT_GATE',
      crossProductReuse: 'DOMAIN_ONLY',
    }),
    protectedBoundaries: Object.freeze({
      persistenceAuthorization: false,
      schemaMigration: false,
      providerRuntime: false,
      customerMutation: false,
      crmMutation: false,
      emailOrMessageExecution: false,
      pdfGeneration: false,
      shareDelivery: false,
      durableOutputStorage: false,
      crossSessionRetention: false,
    }),
    nextGate: OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_NEXT_GATE,
    productStatus: OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_PRODUCT_STATUS,
    persistencePosition: OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_PERSISTENCE_POSITION,
  });
}

function chain(order: number, artifact: string, version: string, parentPrior: string, evidence: string, review: string, decisionLink: string, downstream: string) {
  return Object.freeze({ order, artifact, version, parentPrior, evidence, review, decisionLink, downstream });
}

function pricingRow(pricingArtifact: string, version: string, evidenceInputs: readonly string[], agentInput: string, sellerDecision: string, downstream: string, invalidationTrigger: AtlasOutputUpstreamChangeType) {
  return Object.freeze({ pricingArtifact, version, evidenceInputs: freezeArray(evidenceInputs), agentInput, sellerDecision, downstream, invalidationTrigger });
}

function postLaunchRow(artifact: string, version: string, priorReference: string, currentInputs: readonly string[], agentInterpretation: string, sellerDecision: string, next: string) {
  return Object.freeze({ artifact, version, priorReference, currentInputs: freezeArray(currentInputs), agentInterpretation, sellerDecision, next });
}

function financialInvalidation(upstreamChange: AtlasOutputUpstreamChangeType, financialReference: string, previousState: string, resultingState: 'READY_FOR_REVIEW' | 'REVIEW_REQUIRED', reason: string, agentAction: string) {
  return Object.freeze({ upstreamChange, financialReference, previousState, resultingState, reason, agentAction });
}

function warning(warningText: string, upstreamChange: AtlasOutputUpstreamChangeType, downstreamArtifact: string, state: AtlasOutputInvalidationState, requiredAction: string) {
  return Object.freeze({ warning: warningText, upstreamChange, downstreamArtifact, state, requiredAction });
}

function fingerprintRow(fingerprint: string, inputs: readonly string[], stableAcross: string, changesWhen: string, use: string) {
  return Object.freeze({ fingerprint, inputs: freezeArray(inputs), stableAcross, changesWhen, use });
}

function buildReuseRules(): readonly AtlasOutputReuseRule[] {
  const direct = 'DIRECT_REUSE' as const;
  const reference = 'REFERENCE_REUSE' as const;
  const transform = 'AUDIENCE_TRANSFORM' as const;
  const recompose = 'RECOMPOSE' as const;
  const newInstance = 'NEW_INSTANCE' as const;
  return freezeArray([
    reuse('OUTPUT PRODUCT INSTANCE', newInstance, reference, transform, recompose, recompose, recompose, recompose, reference, reference),
    reuse('OUTPUT VERSION', reference, direct, transform, recompose, recompose, recompose, recompose, reference, direct),
    reuse('SECTION DEFINITION', direct, direct, direct, direct, direct, direct, direct, direct, direct),
    reuse('SECTION INSTANCE', reference, reference, transform, recompose, recompose, recompose, recompose, reference, reference),
    reuse('MODULE DEFINITION', direct, direct, direct, direct, direct, direct, direct, direct, direct),
    reuse('MODULE INSTANCE', reference, direct, transform, recompose, recompose, recompose, recompose, reference, reference),
    reuse('EVIDENCE SNAPSHOT', reference, reference, transform, reference, reference, reference, reference, reference, reference),
    reuse('AGENT NARRATIVE', reference, recompose, transform, recompose, recompose, recompose, recompose, 'NOT_REUSABLE', reference),
    reuse('SELLER DECISION', reference, direct, 'NOT_REUSABLE', 'NOT_REUSABLE', reference, reference, reference, reference, reference),
  ]);
}

function reuse(
  artifact: string,
  sameProductNewVersion: AtlasOutputReuseClassification,
  sellerUpdate: AtlasOutputReuseClassification,
  buyer: AtlasOutputReuseClassification,
  market: AtlasOutputReuseClassification,
  property: AtlasOutputReuseClassification,
  location: AtlasOutputReuseClassification,
  investment: AtlasOutputReuseClassification,
  financial: AtlasOutputReuseClassification,
  advisory: AtlasOutputReuseClassification,
): AtlasOutputReuseRule {
  return Object.freeze({ artifact, sameProductNewVersion, sellerUpdate, buyer, market, property, location, investment, financial, advisory });
}

function buildSubjectAudienceTransform() {
  return freezeArray([
    transform('SAME SUBJECT / NEW DRAFT', false, true, false, 'Prior evidence snapshot can be referenced.', true),
    transform('SAME SUBJECT / NEW REVIEW', false, true, false, 'Prior reviewed snapshot can be referenced.', true),
    transform('NEW SUBJECT', true, false, true, 'Definitions only; subject evidence cannot transfer.', true),
    transform('NEW CLIENT', true, false, true, 'Only source definitions can be reused after rights review.', true),
    transform('AGENT INTERNAL TO SELLER', false, true, true, 'Permitted source snapshots may be reused after Seller-audience rights review.', true),
    transform('SELLER TO BUYER', false, true, true, 'Audience transform required; Seller decision content is not reusable.', true),
    transform('SELLER TO INVESTOR', false, true, true, 'Investment transform requires financial/professional review.', true),
    transform('AGENT INTERNAL TO PUBLIC', false, true, true, 'Public rights review required; default hold.', true),
    transform('SELLER PRESENTATION TO SELLER UPDATE', false, true, false, 'Prior reviewed Seller version and evidence snapshots can be referenced.', true),
    transform('SELLER PRESENTATION TO PROPERTY ANALYSIS', true, false, true, 'Property definitions may be reused; client-scoped content cannot.', true),
  ]);
}

function transform(change: string, newProductInstance: boolean, newOutputVersion: boolean, rightsReview: boolean, evidenceReuse: string, reviewRequired: boolean) {
  return Object.freeze({ change, newProductInstance, newOutputVersion, rightsReview, evidenceReuse, reviewRequired });
}

function buildAgentVersionUi() {
  return freezeArray([
    ui('CURRENT VERSION BADGE', 'AtlasOutputVersion', 'What version am I viewing?', 'Inspect current state', 'IMPLEMENTED'),
    ui('VERSION HISTORY PANEL', 'outputVersions + lineage references', 'What came before it?', 'Compare to prior', 'IMPLEMENTED'),
    ui('WHAT CHANGED SUMMARY', 'AtlasOutputVersionDiff', 'What changed?', 'Review diff', 'IMPLEMENTED'),
    ui('DEPENDENCY WARNING', 'AtlasOutputDependency + invalidation', 'What requires review?', 'Open warning', 'IMPLEMENTED'),
    ui('COMPARE TO PRIOR', 'priorReviewedVersion + diff', 'How is this different?', 'Compare', 'IMPLEMENTED'),
    ui('CREATE NEW DRAFT SEAM', 'creationReason CONTENT_REVISION', 'Can I create a successor?', 'Draft successor seam', 'SESSION_SAFE'),
    ui('CREATE NEXT SELLER UPDATE SEAM', 'SELLER_UPDATE_PRODUCT_V1', 'What happens next?', 'Create next update seam', 'SESSION_SAFE'),
    ui('REFRESH EVIDENCE SEAM', 'source/evidence snapshot refs', 'What needs refresh?', 'Refresh evidence seam', 'SESSION_SAFE'),
    ui('REUSE CONTENT / MODULE SEAM', 'reuseRules', 'What can be reused?', 'Review reuse rules', 'IMPLEMENTED'),
    ui('SELLER VERSION / DECISION REFERENCE', 'sellerClientDecisionReferences', 'What decision is linked?', 'Inspect decision', 'IMPLEMENTED'),
  ]);
}

function ui(uiElement: string, canonicalData: string, agentQuestionAnswered: string, action: string, readiness: string) {
  return Object.freeze({ uiElement, canonicalData, agentQuestionAnswered, action, readiness });
}

function buildReproducibilityInputs(postLaunch: SellerPostLaunchReview) {
  return freezeArray([
    repro('PRODUCT CONTRACT VERSION', OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION, true, 'Interpret output version semantics.'),
    repro('OUTPUT VERSION', 'seller-update-current-version', true, 'Identify the reviewed output.'),
    repro('CONTENT VERSION', SELLER_UPDATE_PRODUCT_VERSION, true, 'Rebuild content references.'),
    repro('COMPOSITION VERSION', postLaunch.sellerUpdateProduct.version, true, 'Rebuild module composition.'),
    repro('TEMPLATE VERSION', SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION, true, 'Rebuild definitions.'),
    repro('PREPARATION VERSION', SELLER_DECISION_BRIEF_CONTENT_VERSION, true, 'Trace preparation inputs.'),
    repro('SOURCE SNAPSHOT IDS', 'source-snapshot-*', true, 'Rebuild evidence basis.'),
    repro('COHORT VERSION', ATLAS_COHORT_CONTRACT_VERSION, true, 'Trace market cohort.'),
    repro('COMPETITION VERSION', CURRENT_COMPETING_LISTING_CONTEXT_VERSION, true, 'Trace competition context.'),
    repro('METRIC / CALCULATION VERSION', OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION, true, 'Trace fingerprint and invalidation logic.'),
    repro('NARRATIVE VERSION', SELLER_DECISION_BRIEF_NARRATIVE_VERSION, true, 'Trace Agent-authored content.'),
    repro('AGENT INPUT VERSION', SELLER_DECISION_BRIEF_STRATEGY_VERSION, true, 'Trace Agent input.'),
    repro('RECOMMENDATION VERSION', SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION_VERSION, true, 'Trace recommendation.'),
    repro('PRICING SCENARIO VERSION', SELLER_PRICING_SCENARIO_VERSION, true, 'Trace pricing decision.'),
    repro('SEARCH-BAND VERSION', SELLER_PRICING_SEARCH_BAND_VERSION, true, 'Trace pricing context.'),
    repro('POST-LAUNCH REVIEW VERSION', SELLER_POST_LAUNCH_REVIEW_VERSION, true, 'Trace current review.'),
    repro('SELLER DECISION VERSION', SELLER_POST_LAUNCH_SELLER_DECISION_VERSION, true, 'Trace Seller decision.'),
    repro('EVIDENCE SNAPSHOT', 'evidence-snapshot-seller-update-current', true, 'Trace evidence snapshot.'),
    repro('RIGHTS', 'agent-internal-rights', true, 'Trace rights state.'),
    repro('FRESHNESS', 'point-in-time-current-market', true, 'Trace freshness state.'),
    repro('EFFECTIVE AS-OF', AS_OF, true, 'Trace date context.'),
    repro('REVIEW STATE', 'AGENT_REVIEW_REQUIRED', true, 'Trace review posture.'),
    repro('CONTENT FINGERPRINT', 'OUTPUT_CONTENT_FINGERPRINT', true, 'Detect material changes.'),
  ]);
}

function repro(input: string, versionSnapshot: string, required: boolean, purpose: string) {
  return Object.freeze({ input, versionSnapshot, required, purpose });
}

function buildPersistenceMapping() {
  return freezeArray([
    persist('OUTPUT PRODUCT INSTANCE', 'OutputProduct', 'Cross-session reviewed output history.', 'FUTURE_GATE'),
    persist('OUTPUT VERSION', 'OutputVersion', 'Retain reviewed output/Seller decision across sessions.', 'FUTURE_GATE'),
    persist('SECTION INSTANCE', 'OutputSectionInstance', 'Durable output reproduction.', 'FUTURE_GATE'),
    persist('MODULE INSTANCE', 'OutputModuleInstance', 'Durable module-level reuse/diff.', 'FUTURE_GATE'),
    persist('OUTPUT EVIDENCE SNAPSHOT', 'OutputEvidenceSnapshot', 'Reviewed evidence retention.', 'FUTURE_GATE'),
    persist('OUTPUT DEPENDENCY', 'OutputDependency', 'Cross-session invalidation monitoring.', 'FUTURE_GATE'),
    persist('OUTPUT REVIEW STATE', 'OutputReview', 'Reviewed/presented state retention.', 'FUTURE_GATE'),
    persist('SELLER DECISION', 'OutputDecision', 'Cross-session Seller decision audit.', 'FUTURE_GATE'),
    persist('CHECKPOINT', 'OutputCheckpoint', 'Cross-session post-launch comparison.', 'FUTURE_GATE'),
    persist('RENDER SEAM', 'OutputRender', 'PDF/print render production.', 'FUTURE_GATE'),
  ]);
}

function persist(phase1DomainContract: string, futureDurableEntity: string, firstPersistenceNeed: string, currentStatus: 'DOMAIN_ONLY' | 'FUTURE_GATE') {
  return Object.freeze({ phase1DomainContract, futureDurableEntity, firstPersistenceNeed, currentStatus });
}

export const OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_FIXTURE =
  buildOutputVersionLineageInvalidationFoundation();
