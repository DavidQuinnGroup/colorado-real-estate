import {
  type AtlasOutputFreshnessState,
  type AtlasOutputReviewState,
  type AtlasOutputRightsState,
} from './sharedOutputProductComposition';
import {
  SELLER_DECISION_BRIEF_V2_STATUS,
  SELLER_DECISION_BRIEF_V2_VERSION,
  type SellerDecisionBriefProductFamilyReuse,
} from './sellerDecisionBriefV2';
import {
  SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_FIXTURE,
  SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_STATUS,
  SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION,
  SELLER_PRICING_SCENARIO_VERSION,
  SELLER_PRICING_FINANCIAL_LINK_VERSION,
  type SellerPricingScenario,
} from './sellerPricingPositioningDecisionFramework';
import {
  CURRENT_COMPETING_LISTING_CONTEXT_VERSION,
  CURRENT_COMPETING_LISTING_CONTEXT_WAVE_6_STATUS,
} from './agentCurrentCompetingListingContext';
import { AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION } from './agentCurrentSnapshotComparison';
import { ATLAS_COHORT_CONTRACT_VERSION } from './atlasCohortComparativeContract';
import {
  SELLER_UPDATE_PREPARATION_PACKET_STATUS,
  SELLER_UPDATE_PREPARATION_PACKET_VERSION,
} from './sellerUpdatePreparation';
import { REIE_FINANCIAL_DECISION_PREPARATION_VERSION } from './financialDecisionPreparationContract';

export const SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_STATUS =
  'SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_V1_CERTIFIED_WITH_HOLDS' as const;
export const SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_VERSION =
  'SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_V1' as const;
export const SELLER_POST_LAUNCH_REVIEW_VERSION = 'SELLER_POST_LAUNCH_REVIEW_V1' as const;
export const SELLER_POST_LAUNCH_CHECKPOINT_VERSION = 'SELLER_POST_LAUNCH_CHECKPOINT_V1' as const;
export const SELLER_POST_LAUNCH_RESPONSE_INPUT_SET_VERSION = 'SELLER_POST_LAUNCH_RESPONSE_INPUT_SET_V1' as const;
export const SELLER_POST_LAUNCH_CHANGE_SET_VERSION = 'SELLER_POST_LAUNCH_CHANGE_SET_V1' as const;
export const SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION =
  'SELLER_POST_LAUNCH_AGENT_INTERPRETATION_V1' as const;
export const SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION_VERSION =
  'SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION_V1' as const;
export const SELLER_POST_LAUNCH_SELLER_DECISION_VERSION =
  'SELLER_POST_LAUNCH_SELLER_DECISION_V1' as const;
export const SELLER_UPDATE_PRODUCT_VERSION = 'SELLER_UPDATE_PRODUCT_V1' as const;
export const SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_NEXT_GATE =
  'READY_FOR_OUTPUT_VERSION_AND_REUSE_ARCHITECTURE' as const;
export const SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_PRODUCT_STATUS =
  'SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_V1_CERTIFIED_WITH_OUTPUT_REUSE_FINANCIAL_PDF_SHARE_HELD' as const;

export const SELLER_POST_LAUNCH_CHECKPOINT_STATES = [
  'PLANNED',
  'READY_FOR_REVIEW',
  'IN_REVIEW',
  'AGENT_INTERPRETATION_REQUIRED',
  'SELLER_DECISION_REQUIRED',
  'COMPLETE',
  'NEXT_CHECKPOINT_PLANNED',
] as const;

export const SELLER_POST_LAUNCH_CHECKPOINT_TYPES = [
  'CALENDAR_BASED',
  'EVENT_BASED',
  'COMPETITION_CHANGE',
  'MARKET_CHANGE',
  'SELLER_TIMING_CHANGE',
  'PREPARATION_CHANGE',
  'FINANCIAL_CHANGE',
  'AGENT_DEFINED',
] as const;

export const SELLER_POST_LAUNCH_RESPONSE_INPUT_CLASSES = [
  'AGENT_OBSERVATION',
  'SELLER_FEEDBACK',
  'MARKETING_EXECUTION_STATUS',
  'SELLER_PRIORITY_CHANGE',
  'SELLER_TIMING_CHANGE',
  'PROPERTY_ACCESS_CHANGE',
  'PROPERTY_CONDITION_CHANGE',
  'FINANCIAL_CONSTRAINT_CHANGE',
  'AGENT_DEFINED_RESPONSE_INPUT',
] as const;

export const SELLER_POST_LAUNCH_EVIDENCE_CLASSES = [
  'OBSERVED_FACT',
  'AGENT_SUMMARY',
  'AGENT_INTERPRETATION',
  'SELLER_INPUT',
  'EXTERNAL_SYSTEM_INPUT',
  'ASSUMPTION',
  'LIMITATION',
] as const;

export const SELLER_POST_LAUNCH_CHANGE_CLASSES = [
  'NEW',
  'CHANGED',
  'STABLE',
  'REQUIRES_REVIEW',
] as const;

export const SELLER_POST_LAUNCH_COMPARABILITY_STATES = [
  'COMPARABLE',
  'CURRENT_ONLY',
  'INPUT_ONLY',
  'EVIDENCE_INSUFFICIENT',
] as const;

export const SELLER_POST_LAUNCH_TRIGGER_TYPES = [
  'NEW_COMPETITION',
  'MARKET_COHORT_SHIFT',
  'SEARCH_BAND_SHIFT',
  'SELLER_TIMING_CHANGE',
  'PREPARATION_CHANGE',
  'FINANCIAL_CONSTRAINT_CHANGE',
  'RESPONSE_SIGNAL_CHANGE',
  'AGENT_DEFINED_TRIGGER',
] as const;

export const SELLER_POST_LAUNCH_DECISION_TYPES = [
  'CONTINUE_CURRENT_PLAN',
  'UPDATE_PRICING_SCENARIO',
  'UPDATE_POSITIONING',
  'UPDATE_PREPARATION',
  'UPDATE_MARKETING_EXECUTION',
  'CHANGE_TIMING',
  'DEFER_DECISION',
  'CUSTOM_AGENT_DEFINED',
] as const;

export const SELLER_UPDATE_VISUAL_COMPONENTS = [
  'OutputChangeSummary',
  'OutputChangeCard',
  'OutputCurrentPriorMarket',
  'OutputCurrentPriorCompetition',
  'OutputResponseSummary',
  'OutputPositioningStatus',
  'OutputPricingStatus',
  'OutputAgentInterpretation',
  'OutputRecommendationCard',
  'OutputDecisionChecklist',
  'OutputCheckpointTimeline',
  'OutputEvidencePanel',
] as const;

export type SellerPostLaunchCheckpointState = (typeof SELLER_POST_LAUNCH_CHECKPOINT_STATES)[number];
export type SellerPostLaunchCheckpointType = (typeof SELLER_POST_LAUNCH_CHECKPOINT_TYPES)[number];
export type SellerPostLaunchResponseInputClass = (typeof SELLER_POST_LAUNCH_RESPONSE_INPUT_CLASSES)[number];
export type SellerPostLaunchEvidenceClass = (typeof SELLER_POST_LAUNCH_EVIDENCE_CLASSES)[number];
export type SellerPostLaunchChangeClass = (typeof SELLER_POST_LAUNCH_CHANGE_CLASSES)[number];
export type SellerPostLaunchComparabilityState = (typeof SELLER_POST_LAUNCH_COMPARABILITY_STATES)[number];
export type SellerPostLaunchTriggerType = (typeof SELLER_POST_LAUNCH_TRIGGER_TYPES)[number];
export type SellerPostLaunchDecisionType = (typeof SELLER_POST_LAUNCH_DECISION_TYPES)[number];
export type SellerUpdateVisualComponent = (typeof SELLER_UPDATE_VISUAL_COMPONENTS)[number];
export type SellerPostLaunchReadinessState =
  | 'REFRESH_REQUIRED'
  | 'EVIDENCE_READY'
  | 'RESPONSE_INPUT_REQUIRED'
  | 'AGENT_INTERPRETATION_REQUIRED'
  | 'RECOMMENDATION_REQUIRED'
  | 'SELLER_DECISION_REQUIRED'
  | 'READY_FOR_SELLER_UPDATE'
  | 'COMPLETE'
  | 'NEXT_CHECKPOINT_PLANNED';

export type SellerPostLaunchEvidenceReference = Readonly<{
  id: string;
  label: string;
  evidenceClass: SellerPostLaunchEvidenceClass;
  source: string;
  version: string;
  asOf: string;
  coverage: string;
  freshness: AtlasOutputFreshnessState;
  rights: AtlasOutputRightsState;
  reviewState: AtlasOutputReviewState;
  limitations: readonly string[];
}>;

export type SellerPostLaunchCheckpoint = Readonly<{
  id: string;
  version: typeof SELLER_POST_LAUNCH_CHECKPOINT_VERSION;
  type: SellerPostLaunchCheckpointType;
  name: string;
  basis: string;
  plannedTimeOrEvent: string;
  actualReviewTime: string | null;
  requiredEvidence: readonly string[];
  requiredResponseInputs: readonly SellerPostLaunchResponseInputClass[];
  currentState: SellerPostLaunchCheckpointState;
  triggerReferences: readonly string[];
  sellerDecisionReference: string | null;
  nextCheckpointReference: string | null;
}>;

export type SellerPostLaunchResponseInput = Readonly<{
  id: string;
  sourceClass: SellerPostLaunchResponseInputClass;
  enteredBy: 'PROJECT_ATLAS_REFERENCE_AGENT' | 'SELLER_SUPPLIED_TO_AGENT' | 'EXTERNAL_SYSTEM_REFERENCE';
  summary: string;
  asOf: string;
  verification: 'VERIFIED_FOR_REVIEW' | 'AGENT_REVIEW_REQUIRED' | 'SELLER_CONFIRMATION_REQUIRED' | 'UNVERIFIED';
  rights: AtlasOutputRightsState;
  limitations: readonly string[];
  sellerFacingUse: 'VISIBLE' | 'SUMMARIZED' | 'HELD_FOR_AGENT_REVIEW';
  agentInternalUse: 'VISIBLE_TO_AGENT';
}>;

export type SellerPostLaunchReviewedBaseline = Readonly<{
  state: 'AVAILABLE' | 'BASELINE_UNAVAILABLE';
  priorReviewId: string | null;
  priorReviewVersion: typeof SELLER_POST_LAUNCH_REVIEW_VERSION | null;
  priorMarketVersion: typeof AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION | null;
  priorCompetitionVersion: typeof CURRENT_COMPETING_LISTING_CONTEXT_VERSION | null;
  priorSubjectVersion: string | null;
  priorPricingScenarioVersion: typeof SELLER_PRICING_SCENARIO_VERSION | null;
  priorAsOf: string | null;
  comparabilityMetadata: readonly string[];
  limitation: string | null;
}>;

export type SellerPostLaunchCurrentRefresh = Readonly<{
  domain: 'MARKET' | 'COMPETITION' | 'SUBJECT' | 'PRICING';
  id: string;
  version: string;
  priorVersion: string;
  asOf: string;
  priorAsOf: string;
  comparability: SellerPostLaunchComparabilityState;
  facts: readonly Readonly<{ label: string; prior: string; current: string; changeClass: SellerPostLaunchChangeClass }>[];
  evidenceReferenceIds: readonly string[];
  coverage: string;
  freshness: AtlasOutputFreshnessState;
  rights: AtlasOutputRightsState;
  limitations: readonly string[];
}>;

export type SellerPostLaunchChangeEntry = Readonly<{
  id: string;
  domain: SellerPostLaunchCurrentRefresh['domain'];
  field: string;
  previousValue: string;
  currentValue: string;
  previousEvidence: string;
  currentEvidence: string;
  previousAsOf: string;
  currentAsOf: string;
  comparability: SellerPostLaunchComparabilityState;
  changeClass: SellerPostLaunchChangeClass;
  agentInterpretationReference: string;
  relatedDecision: SellerPostLaunchDecisionType;
}>;

export type SellerPostLaunchReassessmentTrigger = Readonly<{
  id: string;
  type: SellerPostLaunchTriggerType;
  priority: 'MONITOR' | 'REVIEW' | 'DECISION_REQUIRED';
  evidenceReferenceIds: readonly string[];
  reviewAction: string;
  relatedPricingScenarios: readonly string[];
  sellerQuestion: string;
  reviewState: AtlasOutputReviewState;
}>;

export type SellerPostLaunchAgentInterpretation = Readonly<{
  id: string;
  version: typeof SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION;
  reviewId: string;
  whatChanged: readonly string[];
  whatStayedStable: readonly string[];
  whyItMatters: string;
  positioningEffect: string;
  pricingEffect: string;
  timingEffect: string;
  currentOptions: readonly SellerPostLaunchDecisionType[];
  agentRecommendation: string;
  supportingEvidence: readonly string[];
  limitations: readonly string[];
  agentAuthor: 'PROJECT_ATLAS_REFERENCE_AGENT';
  reviewState: AtlasOutputReviewState;
  sellerFacingSummary: string;
}>;

export type SellerPostLaunchUpdatedRecommendation = Readonly<{
  id: string;
  version: typeof SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION_VERSION;
  reviewId: string;
  decisionAddressed: string;
  currentRecommendation: SellerPostLaunchDecisionType;
  previousRecommendationReference: string;
  rationale: string;
  changeReason: string;
  supportingCurrentEvidence: readonly string[];
  supportingChangeSets: readonly string[];
  alternatives: readonly SellerPostLaunchDecisionType[];
  tradeoffs: readonly string[];
  timing: string;
  confidenceLimitations: readonly string[];
  nextAction: string;
  sellerDecision: SellerPostLaunchDecisionType;
  nextCheckpoint: string;
}>;

export type SellerPostLaunchSellerDecision = Readonly<{
  id: string;
  version: typeof SELLER_POST_LAUNCH_SELLER_DECISION_VERSION;
  reviewId: string;
  selectedAction: SellerPostLaunchDecisionType;
  reason: string;
  agentReview: AtlasOutputReviewState;
  sellerConfirmation: 'PENDING_SELLER_CONFIRMATION' | 'CONFIRMED' | 'DEFERRED';
  effectiveDate: string | null;
  nextCheckpoint: string;
  pricingEffect: 'PRICING_REVIEW_REQUIRED' | 'PRICING_UNCHANGED' | 'PRICING_UPDATE_SELECTED';
  financialEffect: 'REVIEW_REQUIRED' | 'READY_FOR_REVIEW';
}>;

export type SellerUpdateModule = Readonly<{
  id: string;
  title: string;
  canonicalInputs: readonly string[];
  currentPrior: 'CURRENT_AND_PRIOR' | 'CURRENT_ONLY' | 'RESPONSE_ONLY' | 'VERSION_LINEAGE';
  agentInput: string;
  visual: SellerUpdateVisualComponent;
  readiness: SellerPostLaunchReadinessState;
  sellerQuestion: string;
  density: 'D1' | 'D2' | 'D3' | 'D4';
}>;

export type SellerPostLaunchVersionLineage = Readonly<{
  layer: string;
  idVersion: string;
  parentPriorReference: string;
  changeTrigger: string;
  reviewState: AtlasOutputReviewState | 'READY_FOR_REVIEW' | 'REVIEW_REQUIRED';
  sellerOutputReference: string;
}>;

export type SellerPostLaunchReview = Readonly<{
  status: typeof SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_STATUS;
  version: typeof SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_VERSION;
  reviewVersion: typeof SELLER_POST_LAUNCH_REVIEW_VERSION;
  sellerBriefVersion: typeof SELLER_DECISION_BRIEF_V2_VERSION;
  sellerBriefStatus: typeof SELLER_DECISION_BRIEF_V2_STATUS;
  pricingFrameworkVersion: typeof SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION;
  pricingFrameworkStatus: typeof SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_STATUS;
  sellerUpdatePreparationVersion: typeof SELLER_UPDATE_PREPARATION_PACKET_VERSION;
  sellerUpdatePreparationStatus: typeof SELLER_UPDATE_PREPARATION_PACKET_STATUS;
  route: '/agent/prepare/seller/presentation';
  reviewId: string;
  sellerReference: string;
  propertyReference: string;
  originalPricingScenarioId: string;
  originalPricingScenarioVersion: typeof SELLER_PRICING_SCENARIO_VERSION;
  currentPricingScenarioId: string;
  currentPricingScenarioVersion: typeof SELLER_PRICING_SCENARIO_VERSION;
  selectedPriceAssumption: number;
  launchContext: Readonly<{
    id: string;
    launchedAt: string;
    pricingScenarioId: string;
    pricingScenarioVersion: typeof SELLER_PRICING_SCENARIO_VERSION;
    source: 'AGENT_REVIEWED_LAUNCH_CONTEXT';
    reviewState: AtlasOutputReviewState;
  }>;
  priorReviewedBaseline: SellerPostLaunchReviewedBaseline;
  previousCheckpoint: SellerPostLaunchCheckpoint;
  currentCheckpoint: SellerPostLaunchCheckpoint;
  nextCheckpoint: SellerPostLaunchCheckpoint;
  currentMarket: SellerPostLaunchCurrentRefresh;
  currentCompetition: SellerPostLaunchCurrentRefresh;
  currentSubject: SellerPostLaunchCurrentRefresh;
  currentPricing: SellerPostLaunchCurrentRefresh;
  responseInputSetVersion: typeof SELLER_POST_LAUNCH_RESPONSE_INPUT_SET_VERSION;
  responseInputs: readonly SellerPostLaunchResponseInput[];
  marketChangeSet: readonly SellerPostLaunchChangeEntry[];
  competitionChangeSet: readonly SellerPostLaunchChangeEntry[];
  subjectChangeSet: readonly SellerPostLaunchChangeEntry[];
  reassessmentTriggers: readonly SellerPostLaunchReassessmentTrigger[];
  agentInterpretation: SellerPostLaunchAgentInterpretation;
  updatedRecommendation: SellerPostLaunchUpdatedRecommendation;
  sellerDecision: SellerPostLaunchSellerDecision;
  sellerUpdateProduct: Readonly<{
    id: string;
    version: typeof SELLER_UPDATE_PRODUCT_VERSION;
    title: 'Seller Update';
    modules: readonly SellerUpdateModule[];
    previewReadiness: 'READY_FOR_SELLER_UPDATE';
    printPreview: 'FOUNDATION_IMPLEMENTED';
  }>;
  questionCoverage: readonly Readonly<{
    question: string;
    moduleId: string;
    evidenceReferenceIds: readonly string[];
    agentInputRequired: boolean;
    coverage: 'STRONG' | 'ADEQUATE' | 'INPUT_REQUIRED';
  }>[];
  evidenceReferences: readonly SellerPostLaunchEvidenceReference[];
  versionLineage: readonly SellerPostLaunchVersionLineage[];
  pricingContinuity: readonly Readonly<{
    dependency: string;
    priorState: string;
    currentState: string;
    changeEffect: 'PRICING_REVIEW_REQUIRED' | 'NO_PRICING_REVIEW_REQUIRED';
    pricingReviewState: 'REVIEW_REQUIRED' | 'READY_FOR_REVIEW';
    sellerUpdateEffect: string;
  }>[];
  financialContinuity: readonly Readonly<{
    changedInput: string;
    linkedFinancialReference: string;
    version: typeof REIE_FINANCIAL_DECISION_PREPARATION_VERSION | typeof SELLER_PRICING_FINANCIAL_LINK_VERSION;
    changeReason: string;
    resultingReviewState: 'REVIEW_REQUIRED' | 'READY_FOR_REVIEW';
  }>[];
  productFamilyReuse: readonly Readonly<{
    primitive: string;
    buyerUpdate: 'DIRECT_REUSE' | 'AUDIENCE_TRANSFORM' | 'SPECIALIZED_EXTENSION' | 'PRODUCT_SPECIFIC';
    propertyMonitoring: 'DIRECT_REUSE' | 'AUDIENCE_TRANSFORM' | 'SPECIALIZED_EXTENSION' | 'PRODUCT_SPECIFIC';
    marketUpdate: 'DIRECT_REUSE' | 'AUDIENCE_TRANSFORM' | 'SPECIALIZED_EXTENSION' | 'PRODUCT_SPECIFIC';
    investmentMonitoring: 'DIRECT_REUSE' | 'AUDIENCE_TRANSFORM' | 'SPECIALIZED_EXTENSION' | 'PRODUCT_SPECIFIC';
    financialReview: 'DIRECT_REUSE' | 'AUDIENCE_TRANSFORM' | 'SPECIALIZED_EXTENSION' | 'PRODUCT_SPECIFIC';
    advisoryFollowUp: 'DIRECT_REUSE' | 'AUDIENCE_TRANSFORM' | 'SPECIALIZED_EXTENSION' | 'PRODUCT_SPECIFIC';
  }>[];
  inheritedProductReuse: readonly SellerDecisionBriefProductFamilyReuse[];
  readiness: Readonly<{
    sellerDecisionBrief: 'CERTIFIED';
    narrativeStrategy: 'CERTIFIED';
    pricingPositioning: 'CERTIFIED_WITH_HOLDS';
    postLaunchReviewDomain: 'CERTIFIED';
    checkpointLifecycle: 'IMPLEMENTED_DETERMINISTIC';
    currentMarketRefresh: 'IMPLEMENTED_POINT_IN_TIME';
    currentCompetitionRefresh: 'IMPLEMENTED_POINT_IN_TIME';
    currentSubjectRefresh: 'IMPLEMENTED_REVIEW_GATED';
    currentPriorComparison: 'IMPLEMENTED_COMPARABILITY_EXPLICIT';
    responseInputs: 'IMPLEMENTED_SOURCE_LABELLED';
    changeSets: 'IMPLEMENTED_FACTUAL';
    reassessment: 'IMPLEMENTED';
    agentInterpretation: 'IMPLEMENTED_AGENT_AUTHORED';
    updatedRecommendation: 'IMPLEMENTED_AGENT_AUTHORED';
    sellerDecision: 'IMPLEMENTED';
    nextCheckpoint: 'IMPLEMENTED';
    sellerUpdateProduct: 'IMPLEMENTED';
    sellerUpdatePreview: 'IMPLEMENTED';
    pricingVersionContinuity: 'IMPLEMENTED';
    financialReviewContinuity: 'IMPLEMENTED_REVIEW_REQUIRED';
    evidence: 'PARTIAL_WITH_EXPLICIT_GATES';
    rights: 'AGENT_INTERNAL_AND_REVIEW_GATED';
    freshness: 'POINT_IN_TIME_AND_REVIEW_GATED';
    agentReview: 'IMPLEMENTED';
    printPreview: 'FOUNDATION_IMPLEMENTED';
    outputVersionReuse: 'NEXT_GATE';
    financialDecisionPreparation: 'REFERENCE_SEAM_ONLY';
    pdf: 'NOT_IMPLEMENTED';
    shareDelivery: 'NOT_IMPLEMENTED';
  }>;
  protectedBoundaries: Readonly<{
    persistenceAuthorization: false;
    providerRuntime: false;
    customerMutation: false;
    crmMutation: false;
    emailOrMessageExecution: false;
    pdfGeneration: false;
    shareDelivery: false;
    automatedValuation: false;
    automatedPricingRecommendation: false;
    financialAdvice: false;
    postLaunchPolling: false;
    customerBehaviorTracking: false;
  }>;
  nextGate: typeof SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_NEXT_GATE;
  productStatus: typeof SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_PRODUCT_STATUS;
}>;

const AS_OF = '2026-08-27';
const PRIOR_AS_OF = '2026-08-20';
const REVIEW_ID = 'seller-post-launch-review-v1-fixture';

function freezeArray<T>(items: readonly T[]): readonly T[] {
  return Object.freeze([...items]);
}

export function checkpointTransitionAllowed(from: SellerPostLaunchCheckpointState, to: SellerPostLaunchCheckpointState) {
  const transitions: Readonly<Record<SellerPostLaunchCheckpointState, readonly SellerPostLaunchCheckpointState[]>> = Object.freeze({
    PLANNED: ['READY_FOR_REVIEW'],
    READY_FOR_REVIEW: ['IN_REVIEW'],
    IN_REVIEW: ['AGENT_INTERPRETATION_REQUIRED', 'SELLER_DECISION_REQUIRED'],
    AGENT_INTERPRETATION_REQUIRED: ['SELLER_DECISION_REQUIRED'],
    SELLER_DECISION_REQUIRED: ['COMPLETE'],
    COMPLETE: ['NEXT_CHECKPOINT_PLANNED'],
    NEXT_CHECKPOINT_PLANNED: ['PLANNED'],
  });
  return transitions[from].includes(to);
}

export function reviewStateForPricingDependencyChange(changed: boolean) {
  return changed ? 'REVIEW_REQUIRED' as const : 'READY_FOR_REVIEW' as const;
}

export function reviewStateForFinancialDependencyChange(changed: boolean) {
  return changed ? 'REVIEW_REQUIRED' as const : 'READY_FOR_REVIEW' as const;
}

export function buildPriorReviewedBaseline(available = true): SellerPostLaunchReviewedBaseline {
  if (!available) {
    return Object.freeze({
      state: 'BASELINE_UNAVAILABLE',
      priorReviewId: null,
      priorReviewVersion: null,
      priorMarketVersion: null,
      priorCompetitionVersion: null,
      priorSubjectVersion: null,
      priorPricingScenarioVersion: null,
      priorAsOf: null,
      comparabilityMetadata: freezeArray([]),
      limitation: 'No valid prior reviewed baseline was supplied, so current-only review must remain explicit.',
    });
  }
  return Object.freeze({
    state: 'AVAILABLE',
    priorReviewId: 'seller-post-launch-prior-reviewed-plan',
    priorReviewVersion: SELLER_POST_LAUNCH_REVIEW_VERSION,
    priorMarketVersion: AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION,
    priorCompetitionVersion: CURRENT_COMPETING_LISTING_CONTEXT_VERSION,
    priorSubjectVersion: 'SELLER_POST_LAUNCH_SUBJECT_CONTEXT_V1',
    priorPricingScenarioVersion: SELLER_PRICING_SCENARIO_VERSION,
    priorAsOf: PRIOR_AS_OF,
    comparabilityMetadata: freezeArray(['Same fixture geography', 'Same property type', 'Same selected pricing scenario lineage', 'Current-vs-prior values are review-gated']),
    limitation: null,
  });
}

function evidenceReferences(): readonly SellerPostLaunchEvidenceReference[] {
  return freezeArray([
    evidence('post-launch-prior-review', 'Prior reviewed plan', 'ASSUMPTION', 'SELLER_POST_LAUNCH_REVIEW', SELLER_POST_LAUNCH_REVIEW_VERSION, PRIOR_AS_OF, 'Prior reviewed baseline fixture is an admitted review assumption.'),
    evidence('post-launch-current-market', 'Current market refresh', 'EXTERNAL_SYSTEM_INPUT', 'AGENT_CURRENT_SNAPSHOT_COMPARISON', AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION, AS_OF, 'Current snapshot only; no trend or valuation conclusion.'),
    evidence('post-launch-current-competition', 'Current competition refresh', 'EXTERNAL_SYSTEM_INPUT', 'CURRENT_COMPETING_LISTING_CONTEXT', CURRENT_COMPETING_LISTING_CONTEXT_VERSION, AS_OF, 'Current competing listing context only; no sold comparable or CMA claim.'),
    evidence('post-launch-current-subject', 'Current subject refresh', 'OBSERVED_FACT', 'SELLER_UPDATE_PREPARATION', SELLER_UPDATE_PREPARATION_PACKET_VERSION, AS_OF, 'Subject response facts remain review-gated.'),
    evidence('post-launch-response-inputs', 'Response input set', 'SELLER_INPUT', 'SELLER_POST_LAUNCH_RESPONSE_INPUT_SET', SELLER_POST_LAUNCH_RESPONSE_INPUT_SET_VERSION, AS_OF, 'Agent and Seller supplied inputs require review before seller-facing use.'),
    evidence('post-launch-change-sets', 'Change sets', 'AGENT_SUMMARY', 'SELLER_POST_LAUNCH_CHANGE_SET', SELLER_POST_LAUNCH_CHANGE_SET_VERSION, AS_OF, 'Factual change classes only; interpretation is separate.'),
    evidence('post-launch-agent-interpretation', 'Agent interpretation', 'AGENT_INTERPRETATION', 'SELLER_POST_LAUNCH_AGENT_INTERPRETATION', SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION, AS_OF, 'Agent-authored interpretation required.'),
    evidence('post-launch-updated-recommendation', 'Updated recommendation', 'AGENT_INTERPRETATION', 'SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION', SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION_VERSION, AS_OF, 'Agent-authored recommendation; no automation.'),
    evidence('post-launch-financial-continuity', 'Financial continuity', 'LIMITATION', 'REIE_FINANCIAL_DECISION_PREPARATION', REIE_FINANCIAL_DECISION_PREPARATION_VERSION, AS_OF, 'Review-required reference only; no financial advice.'),
  ]);
}

function evidence(id: string, label: string, evidenceClass: SellerPostLaunchEvidenceClass, source: string, version: string, asOf: string, limitation: string): SellerPostLaunchEvidenceReference {
  return Object.freeze({
    id,
    label,
    evidenceClass,
    source,
    version,
    asOf,
    coverage: 'DETERMINISTIC_POST_LAUNCH_FIXTURE_FOR_AGENT_REVIEW',
    freshness: 'POINT_IN_TIME',
    rights: 'ADMITTED_FOR_AGENT_INTERNAL',
    reviewState: 'AGENT_REVIEW_REQUIRED',
    limitations: freezeArray([limitation]),
  });
}

function checkpoints(): readonly [SellerPostLaunchCheckpoint, SellerPostLaunchCheckpoint, SellerPostLaunchCheckpoint] {
  const previous = checkpoint('post-launch-checkpoint-launch', 'CALENDAR_BASED', 'Launch confirmation', 'Launch checkpoint completed from Pricing V1.', '2026-08-20T10:00:00.000Z', 'COMPLETE', ['post-launch-prior-review'], ['AGENT_OBSERVATION'], ['post-launch-trigger-market-shift'], 'post-launch-decision-v1-fixture', 'post-launch-checkpoint-current');
  const current = checkpoint('post-launch-checkpoint-current', 'COMPETITION_CHANGE', 'First response review', 'First response review after launch and current competition refresh.', '2026-08-27T10:00:00.000Z', 'SELLER_DECISION_REQUIRED', ['post-launch-current-market', 'post-launch-current-competition', 'post-launch-response-inputs'], ['AGENT_OBSERVATION', 'SELLER_FEEDBACK', 'MARKETING_EXECUTION_STATUS'], ['post-launch-trigger-new-competition', 'post-launch-trigger-response-signal'], 'post-launch-decision-v1-fixture', 'post-launch-checkpoint-next');
  const next = checkpoint('post-launch-checkpoint-next', 'EVENT_BASED', 'Next reassessment review', 'Next checkpoint planned for new competition or Seller timing update.', 'When a defined trigger occurs or seven days after current review', 'NEXT_CHECKPOINT_PLANNED', ['post-launch-current-market', 'post-launch-current-competition'], ['AGENT_OBSERVATION', 'SELLER_FEEDBACK'], ['post-launch-trigger-agent-defined'], null, null);
  return [previous, current, next];
}

function checkpoint(
  id: string,
  type: SellerPostLaunchCheckpointType,
  name: string,
  basis: string,
  plannedTimeOrEvent: string,
  currentState: SellerPostLaunchCheckpointState,
  requiredEvidence: readonly string[],
  requiredResponseInputs: readonly SellerPostLaunchResponseInputClass[],
  triggerReferences: readonly string[],
  sellerDecisionReference: string | null,
  nextCheckpointReference: string | null,
): SellerPostLaunchCheckpoint {
  return Object.freeze({
    id,
    version: SELLER_POST_LAUNCH_CHECKPOINT_VERSION,
    type,
    name,
    basis,
    plannedTimeOrEvent,
    actualReviewTime: currentState === 'COMPLETE' ? plannedTimeOrEvent : currentState === 'SELLER_DECISION_REQUIRED' ? `${AS_OF}T12:00:00.000Z` : null,
    requiredEvidence: freezeArray(requiredEvidence),
    requiredResponseInputs: freezeArray(requiredResponseInputs),
    currentState,
    triggerReferences: freezeArray(triggerReferences),
    sellerDecisionReference,
    nextCheckpointReference,
  });
}

function responseInputs(): readonly SellerPostLaunchResponseInput[] {
  return freezeArray([
    responseInput('response-agent-observation', 'AGENT_OBSERVATION', 'PROJECT_ATLAS_REFERENCE_AGENT', 'Agent observed that current competition changed and response quality should be reviewed.', 'VERIFIED_FOR_REVIEW', 'VISIBLE'),
    responseInput('response-seller-feedback', 'SELLER_FEEDBACK', 'SELLER_SUPPLIED_TO_AGENT', 'Seller reported willingness to continue the plan if the next checkpoint is explicit.', 'SELLER_CONFIRMATION_REQUIRED', 'SUMMARIZED'),
    responseInput('response-marketing-status', 'MARKETING_EXECUTION_STATUS', 'PROJECT_ATLAS_REFERENCE_AGENT', 'Marketing execution status is active with response review pending.', 'AGENT_REVIEW_REQUIRED', 'VISIBLE'),
    responseInput('response-seller-priority', 'SELLER_PRIORITY_CHANGE', 'SELLER_SUPPLIED_TO_AGENT', 'Seller priority remains balanced between confidence, timing, and avoiding unnecessary pricing churn.', 'SELLER_CONFIRMATION_REQUIRED', 'SUMMARIZED'),
    responseInput('response-seller-timing', 'SELLER_TIMING_CHANGE', 'SELLER_SUPPLIED_TO_AGENT', 'Seller timing remains stable for this fixture review.', 'SELLER_CONFIRMATION_REQUIRED', 'SUMMARIZED'),
    responseInput('response-property-access', 'PROPERTY_ACCESS_CHANGE', 'PROJECT_ATLAS_REFERENCE_AGENT', 'Property access is unchanged and does not create a new review trigger.', 'AGENT_REVIEW_REQUIRED', 'VISIBLE'),
    responseInput('response-property-condition', 'PROPERTY_CONDITION_CHANGE', 'PROJECT_ATLAS_REFERENCE_AGENT', 'Property condition is unchanged from the launch-reviewed preparation context.', 'AGENT_REVIEW_REQUIRED', 'VISIBLE'),
    responseInput('response-financial-constraint', 'FINANCIAL_CONSTRAINT_CHANGE', 'SELLER_SUPPLIED_TO_AGENT', 'Seller financial constraint should be rechecked before any pricing change.', 'SELLER_CONFIRMATION_REQUIRED', 'HELD_FOR_AGENT_REVIEW'),
    responseInput('response-agent-defined', 'AGENT_DEFINED_RESPONSE_INPUT', 'PROJECT_ATLAS_REFERENCE_AGENT', 'Agent-defined note: review whether current plan still fits after competition refresh.', 'AGENT_REVIEW_REQUIRED', 'VISIBLE'),
  ]);
}

function responseInput(
  id: string,
  sourceClass: SellerPostLaunchResponseInputClass,
  enteredBy: SellerPostLaunchResponseInput['enteredBy'],
  summary: string,
  verification: SellerPostLaunchResponseInput['verification'],
  sellerFacingUse: SellerPostLaunchResponseInput['sellerFacingUse'],
): SellerPostLaunchResponseInput {
  return Object.freeze({
    id,
    sourceClass,
    enteredBy,
    summary,
    asOf: AS_OF,
    verification,
    rights: 'ADMITTED_FOR_AGENT_INTERNAL',
    limitations: freezeArray(['Response input is review-gated and does not independently determine strategy.']),
    sellerFacingUse,
    agentInternalUse: 'VISIBLE_TO_AGENT',
  });
}

function currentRefreshes(selectedPricingScenario: SellerPricingScenario): readonly [SellerPostLaunchCurrentRefresh, SellerPostLaunchCurrentRefresh, SellerPostLaunchCurrentRefresh, SellerPostLaunchCurrentRefresh] {
  const market = refresh('MARKET', 'post-launch-market-refresh-v1', AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION, AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION, [
    ['Current cohort population', '21 active fixture listings', '23 active fixture listings', 'CHANGED'],
    ['Current search-band count', '9 in current-center band', '8 in current-center band', 'CHANGED'],
    ['Admitted price context', 'Median current asking/list price visible', 'Median current asking/list price visible', 'STABLE'],
  ], ['post-launch-current-market']);
  const competition = refresh('COMPETITION', 'post-launch-competition-refresh-v1', CURRENT_COMPETING_LISTING_CONTEXT_VERSION, CURRENT_COMPETING_LISTING_CONTEXT_VERSION, [
    ['Competition count', '3 reviewed current competitors', '4 reviewed current competitors', 'CHANGED'],
    ['New current member', 'None in prior review', 'One new current member requires Agent review', 'NEW'],
    ['Subject position', 'MID_RANGE', 'MID_RANGE', 'STABLE'],
  ], ['post-launch-current-competition']);
  const subject = refresh('SUBJECT', 'post-launch-subject-refresh-v1', SELLER_UPDATE_PREPARATION_PACKET_VERSION, SELLER_UPDATE_PREPARATION_PACKET_VERSION, [
    ['Preparation status', 'Launch-ready', 'Launch-ready', 'STABLE'],
    ['Seller timing', 'Stable', 'Stable', 'STABLE'],
    ['Financial constraint', 'Not reviewed after launch', 'Review required if pricing changes', 'REQUIRES_REVIEW'],
  ], ['post-launch-current-subject', 'post-launch-response-inputs']);
  const pricing = refresh('PRICING', 'post-launch-pricing-refresh-v1', selectedPricingScenario.version, selectedPricingScenario.version, [
    ['Selected pricing scenario', selectedPricingScenario.id, selectedPricingScenario.id, 'STABLE'],
    ['Price assumption', String(selectedPricingScenario.priceAssumption.value), String(selectedPricingScenario.priceAssumption.value), 'STABLE'],
    ['Financial link', 'READY_FOR_REVIEW', 'REVIEW_REQUIRED if pricing changes', 'REQUIRES_REVIEW'],
  ], ['post-launch-financial-continuity']);
  return [market, competition, subject, pricing];
}

function refresh(
  domain: SellerPostLaunchCurrentRefresh['domain'],
  id: string,
  version: string,
  priorVersion: string,
  facts: readonly [string, string, string, SellerPostLaunchChangeClass][],
  evidenceReferenceIds: readonly string[],
): SellerPostLaunchCurrentRefresh {
  return Object.freeze({
    domain,
    id,
    version,
    priorVersion,
    asOf: AS_OF,
    priorAsOf: PRIOR_AS_OF,
    comparability: 'COMPARABLE',
    facts: freezeArray(facts.map(([label, prior, current, changeClass]) => Object.freeze({ label, prior, current, changeClass }))),
    evidenceReferenceIds: freezeArray(evidenceReferenceIds),
    coverage: `${domain} current-vs-prior fixture comparison`,
    freshness: 'POINT_IN_TIME',
    rights: 'ADMITTED_FOR_AGENT_INTERNAL',
    limitations: freezeArray(['Current-vs-prior comparison is a deterministic fixture and remains Agent-review gated.']),
  });
}

function changeEntries(refreshes: readonly SellerPostLaunchCurrentRefresh[], interpretationId: string): readonly SellerPostLaunchChangeEntry[] {
  return freezeArray(refreshes.flatMap((refreshItem) => refreshItem.facts.map((fact, index) => Object.freeze({
    id: `${refreshItem.id}-change-${index + 1}`,
    domain: refreshItem.domain,
    field: fact.label,
    previousValue: fact.prior,
    currentValue: fact.current,
    previousEvidence: `${refreshItem.id}-prior`,
    currentEvidence: `${refreshItem.id}-current`,
    previousAsOf: refreshItem.priorAsOf,
    currentAsOf: refreshItem.asOf,
    comparability: refreshItem.comparability,
    changeClass: fact.changeClass,
    agentInterpretationReference: interpretationId,
    relatedDecision: fact.changeClass === 'REQUIRES_REVIEW' ? 'DEFER_DECISION' : fact.changeClass === 'CHANGED' || fact.changeClass === 'NEW' ? 'CONTINUE_CURRENT_PLAN' : 'CONTINUE_CURRENT_PLAN',
  }))));
}

function reassessmentTriggers(selectedPricingScenario: SellerPricingScenario): readonly SellerPostLaunchReassessmentTrigger[] {
  const scenario = selectedPricingScenario.id;
  return freezeArray([
    trigger('post-launch-trigger-new-competition', 'NEW_COMPETITION', 'REVIEW', ['post-launch-current-competition'], 'Review the new current competitor and confirm whether the plan still fits.', scenario, 'What changed in current competition?'),
    trigger('post-launch-trigger-market-shift', 'MARKET_COHORT_SHIFT', 'REVIEW', ['post-launch-current-market'], 'Review current cohort population and search-band count changes.', scenario, 'What changed in the current market?'),
    trigger('post-launch-trigger-search-band', 'SEARCH_BAND_SHIFT', 'MONITOR', ['post-launch-current-market'], 'Monitor search-band count change before changing the plan.', scenario, 'Does our search-band context still fit?'),
    trigger('post-launch-trigger-seller-timing', 'SELLER_TIMING_CHANGE', 'MONITOR', ['post-launch-response-inputs'], 'Confirm Seller timing remains stable.', scenario, 'Has my timing changed?'),
    trigger('post-launch-trigger-preparation', 'PREPARATION_CHANGE', 'MONITOR', ['post-launch-current-subject'], 'Confirm preparation status remains launch-ready.', scenario, 'Does preparation need to change?'),
    trigger('post-launch-trigger-financial', 'FINANCIAL_CONSTRAINT_CHANGE', 'DECISION_REQUIRED', ['post-launch-financial-continuity'], 'Mark linked financial references review-required before a pricing change.', scenario, 'Does this affect my financial planning?'),
    trigger('post-launch-trigger-response-signal', 'RESPONSE_SIGNAL_CHANGE', 'REVIEW', ['post-launch-response-inputs'], 'Review recorded response inputs before updating the recommendation.', scenario, 'What response have we recorded?'),
    trigger('post-launch-trigger-agent-defined', 'AGENT_DEFINED_TRIGGER', 'REVIEW', ['post-launch-agent-interpretation'], 'Agent-defined trigger requires Agent interpretation before Seller use.', scenario, 'What should we review next?'),
  ]);
}

function trigger(
  id: string,
  type: SellerPostLaunchTriggerType,
  priority: SellerPostLaunchReassessmentTrigger['priority'],
  evidenceReferenceIds: readonly string[],
  reviewAction: string,
  relatedPricingScenario: string,
  sellerQuestion: string,
): SellerPostLaunchReassessmentTrigger {
  return Object.freeze({
    id,
    type,
    priority,
    evidenceReferenceIds: freezeArray(evidenceReferenceIds),
    reviewAction,
    relatedPricingScenarios: freezeArray([relatedPricingScenario]),
    sellerQuestion,
    reviewState: 'AGENT_REVIEW_REQUIRED',
  });
}

function agentInterpretation(marketChangeSet: readonly SellerPostLaunchChangeEntry[], competitionChangeSet: readonly SellerPostLaunchChangeEntry[], subjectChangeSet: readonly SellerPostLaunchChangeEntry[]): SellerPostLaunchAgentInterpretation {
  return Object.freeze({
    id: 'post-launch-agent-interpretation-v1-fixture',
    version: SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION,
    reviewId: REVIEW_ID,
    whatChanged: freezeArray(['Current cohort population changed.', 'Current competition count changed.', 'One new current competitor requires Agent review.']),
    whatStayedStable: freezeArray(['Selected pricing scenario remains the balanced positioning option.', 'Subject price position remains MID_RANGE.', 'Seller timing remains stable.']),
    whyItMatters: 'The plan can continue, but current competition and financial dependency review should remain visible before the next checkpoint.',
    positioningEffect: 'Positioning remains consistent with the selected pricing scenario, with new competition requiring review.',
    pricingEffect: 'Pricing scenario is unchanged; pricing review is required only if the Agent chooses to update the scenario.',
    timingEffect: 'Timing remains stable, so the next checkpoint can stay event-based or seven days out.',
    currentOptions: freezeArray<SellerPostLaunchDecisionType>(['CONTINUE_CURRENT_PLAN', 'UPDATE_PRICING_SCENARIO', 'DEFER_DECISION']),
    agentRecommendation: 'Continue the current plan through the next checkpoint while monitoring current competition and response inputs.',
    supportingEvidence: freezeArray([...marketChangeSet, ...competitionChangeSet, ...subjectChangeSet].map((entry) => entry.id)),
    limitations: freezeArray(['Agent interpretation is human-authored and must be reviewed before Seller communication.']),
    agentAuthor: 'PROJECT_ATLAS_REFERENCE_AGENT',
    reviewState: 'AGENT_REVIEW_REQUIRED',
    sellerFacingSummary: 'Some current context changed, but the selected plan still has a reviewable path to continue with a clear next checkpoint.',
  });
}

function updatedRecommendation(interpretation: SellerPostLaunchAgentInterpretation): SellerPostLaunchUpdatedRecommendation {
  return Object.freeze({
    id: 'post-launch-updated-recommendation-v1-fixture',
    version: SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION_VERSION,
    reviewId: REVIEW_ID,
    decisionAddressed: 'Does the current pricing and positioning plan still fit after the current-context refresh?',
    currentRecommendation: 'CONTINUE_CURRENT_PLAN',
    previousRecommendationReference: 'seller-pricing-scenario-balance',
    rationale: interpretation.agentRecommendation,
    changeReason: 'Current competition changed but did not force an automatic pricing or positioning update.',
    supportingCurrentEvidence: freezeArray(['post-launch-current-market', 'post-launch-current-competition', 'post-launch-response-inputs']),
    supportingChangeSets: freezeArray(interpretation.supportingEvidence),
    alternatives: freezeArray<SellerPostLaunchDecisionType>(['UPDATE_PRICING_SCENARIO', 'UPDATE_POSITIONING', 'DEFER_DECISION']),
    tradeoffs: freezeArray(['Continuing preserves the selected plan.', 'Updating may require pricing and financial review.', 'Deferring keeps uncertainty visible.']),
    timing: 'Review again at the next event-based checkpoint or seven-day review.',
    confidenceLimitations: freezeArray(['No outcome prediction, valuation, or automated pricing recommendation is made.']),
    nextAction: 'Agent reviews the update with the Seller and confirms the next checkpoint.',
    sellerDecision: 'CONTINUE_CURRENT_PLAN',
    nextCheckpoint: 'post-launch-checkpoint-next',
  });
}

function sellerDecision(): SellerPostLaunchSellerDecision {
  return Object.freeze({
    id: 'post-launch-decision-v1-fixture',
    version: SELLER_POST_LAUNCH_SELLER_DECISION_VERSION,
    reviewId: REVIEW_ID,
    selectedAction: 'CONTINUE_CURRENT_PLAN',
    reason: 'Current context changed, but the selected pricing scenario remains reviewable through the next checkpoint.',
    agentReview: 'AGENT_REVIEW_REQUIRED',
    sellerConfirmation: 'PENDING_SELLER_CONFIRMATION',
    effectiveDate: null,
    nextCheckpoint: 'post-launch-checkpoint-next',
    pricingEffect: 'PRICING_UNCHANGED',
    financialEffect: 'REVIEW_REQUIRED',
  });
}

function sellerUpdateModules(): readonly SellerUpdateModule[] {
  const rows: readonly [string, string, readonly string[], SellerUpdateModule['currentPrior'], string, SellerUpdateVisualComponent, SellerPostLaunchReadinessState, string, SellerUpdateModule['density']][] = [
    ['SELLER_UPDATE_MODULE_CHANGE_SUMMARY', 'Change summary', ['marketChangeSet', 'competitionChangeSet', 'subjectChangeSet'], 'CURRENT_AND_PRIOR', 'Agent reviews factual summary', 'OutputChangeSummary', 'READY_FOR_SELLER_UPDATE', 'What changed?', 'D1'],
    ['SELLER_UPDATE_MODULE_CURRENT_MARKET', 'Current market', ['currentMarket', 'priorReviewedBaseline'], 'CURRENT_AND_PRIOR', 'Agent reviews market refresh', 'OutputCurrentPriorMarket', 'EVIDENCE_READY', 'What changed in the current market?', 'D2'],
    ['SELLER_UPDATE_MODULE_CURRENT_COMPETITION', 'Current competition', ['currentCompetition', 'priorReviewedBaseline'], 'CURRENT_AND_PRIOR', 'Agent reviews competition refresh', 'OutputCurrentPriorCompetition', 'EVIDENCE_READY', 'What changed in current competition?', 'D2'],
    ['SELLER_UPDATE_MODULE_SUBJECT_RESPONSE', 'Subject response', ['responseInputs', 'currentSubject'], 'RESPONSE_ONLY', 'Agent reviews response inputs', 'OutputResponseSummary', 'RESPONSE_INPUT_REQUIRED', 'What response have we recorded?', 'D3'],
    ['SELLER_UPDATE_MODULE_CHANGE_SET', 'Detailed change set', ['marketChangeSet', 'competitionChangeSet', 'subjectChangeSet'], 'CURRENT_AND_PRIOR', 'Agent reviews change cards', 'OutputChangeCard', 'EVIDENCE_READY', 'What factually changed?', 'D3'],
    ['SELLER_UPDATE_MODULE_POSITIONING_STATUS', 'Positioning status', ['currentPricing', 'agentInterpretation'], 'CURRENT_AND_PRIOR', 'Agent reviews positioning effect', 'OutputPositioningStatus', 'AGENT_INTERPRETATION_REQUIRED', 'Does our positioning need to change?', 'D2'],
    ['SELLER_UPDATE_MODULE_PRICING_STATUS', 'Pricing status', ['currentPricing', 'pricingContinuity'], 'CURRENT_AND_PRIOR', 'Agent reviews pricing continuity', 'OutputPricingStatus', 'AGENT_INTERPRETATION_REQUIRED', 'Does our current pricing plan still fit?', 'D2'],
    ['SELLER_UPDATE_MODULE_AGENT_INTERPRETATION', 'Agent interpretation', ['agentInterpretation'], 'CURRENT_ONLY', 'Agent authors interpretation', 'OutputAgentInterpretation', 'AGENT_INTERPRETATION_REQUIRED', 'What does my Agent think it means?', 'D1'],
    ['SELLER_UPDATE_MODULE_RECOMMENDATION', 'Updated recommendation', ['updatedRecommendation'], 'CURRENT_ONLY', 'Agent authors recommendation', 'OutputRecommendationCard', 'RECOMMENDATION_REQUIRED', 'What does my Agent recommend?', 'D1'],
    ['SELLER_UPDATE_MODULE_SELLER_DECISION', 'Seller decision', ['sellerDecision'], 'CURRENT_ONLY', 'Agent confirms decision', 'OutputDecisionChecklist', 'SELLER_DECISION_REQUIRED', 'What do I need to decide?', 'D1'],
    ['SELLER_UPDATE_MODULE_NEXT_CHECKPOINT', 'Next checkpoint', ['nextCheckpoint'], 'CURRENT_ONLY', 'Agent confirms next checkpoint', 'OutputCheckpointTimeline', 'NEXT_CHECKPOINT_PLANNED', 'What happens next?', 'D2'],
    ['SELLER_UPDATE_MODULE_EVIDENCE', 'Evidence appendix', ['evidenceReferences', 'versionLineage'], 'VERSION_LINEAGE', 'Agent reviews evidence', 'OutputEvidencePanel', 'EVIDENCE_READY', 'What evidence supports this review?', 'D4'],
  ];
  return freezeArray(rows.map(([id, title, canonicalInputs, currentPrior, agentInput, visual, readiness, sellerQuestion, density]) => Object.freeze({
    id,
    title,
    canonicalInputs: freezeArray(canonicalInputs),
    currentPrior,
    agentInput,
    visual,
    readiness,
    sellerQuestion,
    density,
  })));
}

function questionCoverage(modules: readonly SellerUpdateModule[]): SellerPostLaunchReview['questionCoverage'] {
  return freezeArray([
    coverage('What changed?', 'SELLER_UPDATE_MODULE_CHANGE_SUMMARY', ['post-launch-change-sets'], true, 'STRONG'),
    coverage('What stayed the same?', 'SELLER_UPDATE_MODULE_CHANGE_SUMMARY', ['post-launch-change-sets'], true, 'STRONG'),
    coverage('What changed in the current market?', 'SELLER_UPDATE_MODULE_CURRENT_MARKET', ['post-launch-current-market'], true, 'ADEQUATE'),
    coverage('What changed in current competition?', 'SELLER_UPDATE_MODULE_CURRENT_COMPETITION', ['post-launch-current-competition'], true, 'ADEQUATE'),
    coverage('What response have we recorded?', 'SELLER_UPDATE_MODULE_SUBJECT_RESPONSE', ['post-launch-response-inputs'], true, 'STRONG'),
    coverage('What does my Agent think it means?', 'SELLER_UPDATE_MODULE_AGENT_INTERPRETATION', ['post-launch-agent-interpretation'], true, 'INPUT_REQUIRED'),
    coverage('Does our current pricing plan still fit?', 'SELLER_UPDATE_MODULE_PRICING_STATUS', ['post-launch-financial-continuity'], true, 'ADEQUATE'),
    coverage('Does our positioning need to change?', 'SELLER_UPDATE_MODULE_POSITIONING_STATUS', ['post-launch-agent-interpretation'], true, 'ADEQUATE'),
    coverage('What options exist now?', 'SELLER_UPDATE_MODULE_RECOMMENDATION', ['post-launch-updated-recommendation'], true, 'ADEQUATE'),
    coverage('What does my Agent recommend?', 'SELLER_UPDATE_MODULE_RECOMMENDATION', ['post-launch-updated-recommendation'], true, 'INPUT_REQUIRED'),
    coverage('What do I need to decide?', 'SELLER_UPDATE_MODULE_SELLER_DECISION', ['post-launch-updated-recommendation'], true, 'STRONG'),
    coverage('What happens next?', 'SELLER_UPDATE_MODULE_NEXT_CHECKPOINT', ['post-launch-current-competition'], true, 'STRONG'),
    coverage('What evidence supports this review?', 'SELLER_UPDATE_MODULE_EVIDENCE', ['post-launch-prior-review', 'post-launch-current-market', 'post-launch-current-competition'], false, 'STRONG'),
  ].map((row) => {
    if (!modules.some((module) => module.id === row.moduleId)) throw new Error(`Missing Seller Update module ${row.moduleId}`);
    return row;
  }));
}

function coverage(question: string, moduleId: string, evidenceReferenceIds: readonly string[], agentInputRequired: boolean, coverageState: SellerPostLaunchReview['questionCoverage'][number]['coverage']) {
  return Object.freeze({
    question,
    moduleId,
    evidenceReferenceIds: freezeArray(evidenceReferenceIds),
    agentInputRequired,
    coverage: coverageState,
  });
}

function versionLineage(selectedScenario: SellerPricingScenario): readonly SellerPostLaunchVersionLineage[] {
  const rows: readonly [string, string, string, string, SellerPostLaunchVersionLineage['reviewState'], string][] = [
    ['Original Seller Decision Brief', SELLER_DECISION_BRIEF_V2_VERSION, 'Prior certified Seller V2', 'Pricing decision package', 'AGENT_REVIEW_REQUIRED', 'Seller Presentation'],
    ['Original pricing scenario', `${selectedScenario.id}:${selectedScenario.version}`, SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION, 'Launch decision', 'READY_FOR_REVIEW', 'Pricing status'],
    ['Launch context', 'post-launch-launch-context-v1', selectedScenario.id, 'Launch confirmation', 'AGENT_REVIEW_REQUIRED', 'Review timeline'],
    ['Post-launch review', `${REVIEW_ID}:${SELLER_POST_LAUNCH_REVIEW_VERSION}`, 'Launch context', 'Current checkpoint', 'AGENT_REVIEW_REQUIRED', 'Seller Update'],
    ['Checkpoint', SELLER_POST_LAUNCH_CHECKPOINT_VERSION, 'Pricing response checkpoint', 'Current review', 'AGENT_REVIEW_REQUIRED', 'Next checkpoint'],
    ['Market context', AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION, ATLAS_COHORT_CONTRACT_VERSION, 'Current market refresh', 'AGENT_REVIEW_REQUIRED', 'Current market'],
    ['Competition context', CURRENT_COMPETING_LISTING_CONTEXT_VERSION, CURRENT_COMPETING_LISTING_CONTEXT_WAVE_6_STATUS, 'Current competition refresh', 'AGENT_REVIEW_REQUIRED', 'Current competition'],
    ['Subject context', SELLER_UPDATE_PREPARATION_PACKET_VERSION, SELLER_UPDATE_PREPARATION_PACKET_STATUS, 'Current subject refresh', 'AGENT_REVIEW_REQUIRED', 'Subject response'],
    ['Response input set', SELLER_POST_LAUNCH_RESPONSE_INPUT_SET_VERSION, 'Agent/Seller response inputs', 'Current checkpoint', 'AGENT_REVIEW_REQUIRED', 'Response summary'],
    ['Market change set', SELLER_POST_LAUNCH_CHANGE_SET_VERSION, 'Market prior/current', 'Current refresh', 'AGENT_REVIEW_REQUIRED', 'Change cards'],
    ['Competition change set', SELLER_POST_LAUNCH_CHANGE_SET_VERSION, 'Competition prior/current', 'Current refresh', 'AGENT_REVIEW_REQUIRED', 'Change cards'],
    ['Subject change set', SELLER_POST_LAUNCH_CHANGE_SET_VERSION, 'Subject prior/current', 'Current refresh', 'AGENT_REVIEW_REQUIRED', 'Change cards'],
    ['Agent interpretation', SELLER_POST_LAUNCH_AGENT_INTERPRETATION_VERSION, 'Change sets', 'Agent review', 'AGENT_REVIEW_REQUIRED', 'Agent interpretation'],
    ['Updated recommendation', SELLER_POST_LAUNCH_UPDATED_RECOMMENDATION_VERSION, 'Agent interpretation', 'Reassessment trigger', 'AGENT_REVIEW_REQUIRED', 'Updated recommendation'],
    ['Seller decision', SELLER_POST_LAUNCH_SELLER_DECISION_VERSION, 'Updated recommendation', 'Seller confirmation', 'AGENT_REVIEW_REQUIRED', 'Seller decision'],
    ['Next checkpoint', SELLER_POST_LAUNCH_CHECKPOINT_VERSION, 'Seller decision', 'Next review', 'AGENT_REVIEW_REQUIRED', 'Next checkpoint'],
    ['Seller Update', SELLER_UPDATE_PRODUCT_VERSION, SELLER_POST_LAUNCH_REVIEW_VERSION, 'Seller update preview', 'AGENT_REVIEW_REQUIRED', 'Seller Update preview'],
    ['Financial link', SELLER_PRICING_FINANCIAL_LINK_VERSION, REIE_FINANCIAL_DECISION_PREPARATION_VERSION, 'Financial dependency review', 'REVIEW_REQUIRED', 'Evidence appendix'],
  ];
  return freezeArray(rows.map(([layer, idVersion, parentPriorReference, changeTrigger, reviewState, sellerOutputReference]) => Object.freeze({
    layer,
    idVersion,
    parentPriorReference,
    changeTrigger,
    reviewState,
    sellerOutputReference,
  })));
}

function pricingContinuity(selectedScenario: SellerPricingScenario): SellerPostLaunchReview['pricingContinuity'] {
  const rows: readonly [string, string, string, SellerPostLaunchReview['pricingContinuity'][number]['changeEffect'], SellerPostLaunchReview['pricingContinuity'][number]['pricingReviewState'], string][] = [
    ['PRICE ASSUMPTION', String(selectedScenario.priceAssumption.value), String(selectedScenario.priceAssumption.value), 'NO_PRICING_REVIEW_REQUIRED', 'READY_FOR_REVIEW', 'Seller sees pricing unchanged.'],
    ['SEARCH BAND', selectedScenario.searchBandId, selectedScenario.searchBandId, 'PRICING_REVIEW_REQUIRED', 'REVIEW_REQUIRED', 'Seller sees search-band count changed and review remains visible.'],
    ['CURRENT COMPETITION', '3 reviewed current competitors', '4 reviewed current competitors', 'PRICING_REVIEW_REQUIRED', 'REVIEW_REQUIRED', 'Seller sees current competition changed.'],
    ['SELLER TIMING', 'Stable', 'Stable', 'NO_PRICING_REVIEW_REQUIRED', 'READY_FOR_REVIEW', 'Seller sees timing stayed stable.'],
    ['PREPARATION STATUS', 'Launch-ready', 'Launch-ready', 'NO_PRICING_REVIEW_REQUIRED', 'READY_FOR_REVIEW', 'Seller sees preparation stayed stable.'],
    ['POSITIONING THEME', 'Story strength', 'Story strength with new competition review', 'PRICING_REVIEW_REQUIRED', 'REVIEW_REQUIRED', 'Seller sees positioning requires Agent review.'],
    ['SELECTED PRICING SCENARIO', selectedScenario.id, selectedScenario.id, 'NO_PRICING_REVIEW_REQUIRED', 'READY_FOR_REVIEW', 'Seller sees selected scenario preserved.'],
  ];
  return freezeArray(rows.map(([dependency, priorState, currentState, changeEffect, pricingReviewState, sellerUpdateEffect]) => Object.freeze({
    dependency,
    priorState,
    currentState,
    changeEffect,
    pricingReviewState,
    sellerUpdateEffect,
  })));
}

function financialContinuity(): SellerPostLaunchReview['financialContinuity'] {
  return freezeArray([
    financial('PRICE ASSUMPTION', 'No price assumption change in current fixture.', 'READY_FOR_REVIEW'),
    financial('SELECTED PRICING SCENARIO', 'Selected pricing scenario did not change.', 'READY_FOR_REVIEW'),
    financial('SELLER TIMING', 'Seller timing remains stable.', 'READY_FOR_REVIEW'),
    financial('FINANCIAL CONSTRAINT', 'Seller financial constraint input requires review before a pricing change.', 'REVIEW_REQUIRED'),
  ]);
}

function financial(changedInput: string, changeReason: string, resultingReviewState: SellerPostLaunchReview['financialContinuity'][number]['resultingReviewState']) {
  return Object.freeze({
    changedInput,
    linkedFinancialReference: 'SELLER_FINANCIAL_DECISION_PREPARATION_V1_REFERENCE',
    version: REIE_FINANCIAL_DECISION_PREPARATION_VERSION,
    changeReason,
    resultingReviewState,
  });
}

function productFamilyReuse(): SellerPostLaunchReview['productFamilyReuse'] {
  const direct = 'DIRECT_REUSE' as const;
  const transform = 'AUDIENCE_TRANSFORM' as const;
  const extension = 'SPECIALIZED_EXTENSION' as const;
  return freezeArray([
    reuse('CHECKPOINT', direct, direct, direct, direct, transform, direct),
    reuse('CURRENT / PRIOR COMPARISON', transform, direct, direct, direct, transform, transform),
    reuse('CHANGE SET', transform, direct, direct, direct, transform, direct),
    reuse('RESPONSE INPUT', transform, extension, transform, extension, transform, direct),
    reuse('REASSESSMENT TRIGGER', transform, direct, transform, direct, transform, direct),
    reuse('AGENT INTERPRETATION', transform, transform, transform, transform, transform, direct),
    reuse('UPDATED RECOMMENDATION', transform, extension, transform, extension, transform, direct),
    reuse('DECISION', direct, direct, transform, direct, transform, direct),
    reuse('NEXT CHECKPOINT', direct, direct, direct, direct, transform, direct),
  ]);
}

function reuse(
  primitive: string,
  buyerUpdate: SellerPostLaunchReview['productFamilyReuse'][number]['buyerUpdate'],
  propertyMonitoring: SellerPostLaunchReview['productFamilyReuse'][number]['propertyMonitoring'],
  marketUpdate: SellerPostLaunchReview['productFamilyReuse'][number]['marketUpdate'],
  investmentMonitoring: SellerPostLaunchReview['productFamilyReuse'][number]['investmentMonitoring'],
  financialReview: SellerPostLaunchReview['productFamilyReuse'][number]['financialReview'],
  advisoryFollowUp: SellerPostLaunchReview['productFamilyReuse'][number]['advisoryFollowUp'],
) {
  return Object.freeze({ primitive, buyerUpdate, propertyMonitoring, marketUpdate, investmentMonitoring, financialReview, advisoryFollowUp });
}

export function buildSellerPostLaunchCurrentContextReview(): SellerPostLaunchReview {
  const pricing = SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_FIXTURE;
  const selectedScenario = pricing.scenarios.find((scenario) => scenario.id === pricing.sellerDecision.selectedScenarioId) ?? pricing.scenarios[0];
  const [previousCheckpoint, currentCheckpoint, nextCheckpoint] = checkpoints();
  const [currentMarket, currentCompetition, currentSubject, currentPricing] = currentRefreshes(selectedScenario);
  const preliminaryMarketChangeSet = changeEntries([currentMarket], 'post-launch-agent-interpretation-v1-fixture');
  const competitionChangeSet = changeEntries([currentCompetition], 'post-launch-agent-interpretation-v1-fixture');
  const subjectChangeSet = changeEntries([currentSubject], 'post-launch-agent-interpretation-v1-fixture');
  const interpretation = agentInterpretation(preliminaryMarketChangeSet, competitionChangeSet, subjectChangeSet);
  const marketChangeSet = changeEntries([currentMarket], interpretation.id);
  const recommendation = updatedRecommendation(interpretation);
  const modules = sellerUpdateModules();

  return Object.freeze({
    status: SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_STATUS,
    version: SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_VERSION,
    reviewVersion: SELLER_POST_LAUNCH_REVIEW_VERSION,
    sellerBriefVersion: SELLER_DECISION_BRIEF_V2_VERSION,
    sellerBriefStatus: SELLER_DECISION_BRIEF_V2_STATUS,
    pricingFrameworkVersion: SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION,
    pricingFrameworkStatus: SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_STATUS,
    sellerUpdatePreparationVersion: SELLER_UPDATE_PREPARATION_PACKET_VERSION,
    sellerUpdatePreparationStatus: SELLER_UPDATE_PREPARATION_PACKET_STATUS,
    route: '/agent/prepare/seller/presentation',
    reviewId: REVIEW_ID,
    sellerReference: 'seller-decision-brief-reference-seller',
    propertyReference: 'seller-decision-brief-subject-property',
    originalPricingScenarioId: selectedScenario.id,
    originalPricingScenarioVersion: selectedScenario.version,
    currentPricingScenarioId: selectedScenario.id,
    currentPricingScenarioVersion: selectedScenario.version,
    selectedPriceAssumption: selectedScenario.priceAssumption.value,
    launchContext: Object.freeze({
      id: 'post-launch-launch-context-v1-fixture',
      launchedAt: '2026-08-20T10:00:00.000Z',
      pricingScenarioId: selectedScenario.id,
      pricingScenarioVersion: selectedScenario.version,
      source: 'AGENT_REVIEWED_LAUNCH_CONTEXT',
      reviewState: 'AGENT_REVIEW_REQUIRED',
    }),
    priorReviewedBaseline: buildPriorReviewedBaseline(true),
    previousCheckpoint,
    currentCheckpoint,
    nextCheckpoint,
    currentMarket,
    currentCompetition,
    currentSubject,
    currentPricing,
    responseInputSetVersion: SELLER_POST_LAUNCH_RESPONSE_INPUT_SET_VERSION,
    responseInputs: responseInputs(),
    marketChangeSet,
    competitionChangeSet,
    subjectChangeSet,
    reassessmentTriggers: reassessmentTriggers(selectedScenario),
    agentInterpretation: interpretation,
    updatedRecommendation: recommendation,
    sellerDecision: sellerDecision(),
    sellerUpdateProduct: Object.freeze({
      id: 'seller-update-product-v1-fixture',
      version: SELLER_UPDATE_PRODUCT_VERSION,
      title: 'Seller Update',
      modules,
      previewReadiness: 'READY_FOR_SELLER_UPDATE',
      printPreview: 'FOUNDATION_IMPLEMENTED',
    }),
    questionCoverage: questionCoverage(modules),
    evidenceReferences: evidenceReferences(),
    versionLineage: versionLineage(selectedScenario),
    pricingContinuity: pricingContinuity(selectedScenario),
    financialContinuity: financialContinuity(),
    productFamilyReuse: productFamilyReuse(),
    inheritedProductReuse: pricing.productFamilyReuse,
    readiness: Object.freeze({
      sellerDecisionBrief: 'CERTIFIED',
      narrativeStrategy: 'CERTIFIED',
      pricingPositioning: 'CERTIFIED_WITH_HOLDS',
      postLaunchReviewDomain: 'CERTIFIED',
      checkpointLifecycle: 'IMPLEMENTED_DETERMINISTIC',
      currentMarketRefresh: 'IMPLEMENTED_POINT_IN_TIME',
      currentCompetitionRefresh: 'IMPLEMENTED_POINT_IN_TIME',
      currentSubjectRefresh: 'IMPLEMENTED_REVIEW_GATED',
      currentPriorComparison: 'IMPLEMENTED_COMPARABILITY_EXPLICIT',
      responseInputs: 'IMPLEMENTED_SOURCE_LABELLED',
      changeSets: 'IMPLEMENTED_FACTUAL',
      reassessment: 'IMPLEMENTED',
      agentInterpretation: 'IMPLEMENTED_AGENT_AUTHORED',
      updatedRecommendation: 'IMPLEMENTED_AGENT_AUTHORED',
      sellerDecision: 'IMPLEMENTED',
      nextCheckpoint: 'IMPLEMENTED',
      sellerUpdateProduct: 'IMPLEMENTED',
      sellerUpdatePreview: 'IMPLEMENTED',
      pricingVersionContinuity: 'IMPLEMENTED',
      financialReviewContinuity: 'IMPLEMENTED_REVIEW_REQUIRED',
      evidence: 'PARTIAL_WITH_EXPLICIT_GATES',
      rights: 'AGENT_INTERNAL_AND_REVIEW_GATED',
      freshness: 'POINT_IN_TIME_AND_REVIEW_GATED',
      agentReview: 'IMPLEMENTED',
      printPreview: 'FOUNDATION_IMPLEMENTED',
      outputVersionReuse: 'NEXT_GATE',
      financialDecisionPreparation: 'REFERENCE_SEAM_ONLY',
      pdf: 'NOT_IMPLEMENTED',
      shareDelivery: 'NOT_IMPLEMENTED',
    }),
    protectedBoundaries: Object.freeze({
      persistenceAuthorization: false,
      providerRuntime: false,
      customerMutation: false,
      crmMutation: false,
      emailOrMessageExecution: false,
      pdfGeneration: false,
      shareDelivery: false,
      automatedValuation: false,
      automatedPricingRecommendation: false,
      financialAdvice: false,
      postLaunchPolling: false,
      customerBehaviorTracking: false,
    }),
    nextGate: SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_NEXT_GATE,
    productStatus: SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_PRODUCT_STATUS,
  });
}

export const SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_FIXTURE =
  buildSellerPostLaunchCurrentContextReview();
