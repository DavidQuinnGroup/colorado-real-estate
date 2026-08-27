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
  CURRENT_COMPETING_LISTING_CONTEXT_VERSION,
  CURRENT_COMPETING_LISTING_CONTEXT_WAVE_6_STATUS,
} from './agentCurrentCompetingListingContext';
import { AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION } from './agentCurrentSnapshotComparison';
import { ATLAS_COHORT_CONTRACT_VERSION } from './atlasCohortComparativeContract';
import { REIE_FINANCIAL_DECISION_PREPARATION_VERSION } from './financialDecisionPreparationContract';

export const SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_STATUS =
  'SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_V1_CERTIFIED_WITH_HOLDS' as const;
export const SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION =
  'SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_V1' as const;
export const SELLER_PRICING_SCENARIO_VERSION = 'SELLER_PRICING_SCENARIO_V1' as const;
export const SELLER_PRICING_SEARCH_BAND_VERSION = 'SELLER_PRICING_SEARCH_BAND_V1' as const;
export const SELLER_PRICING_AGENT_RATIONALE_VERSION = 'SELLER_PRICING_AGENT_RATIONALE_V1' as const;
export const SELLER_PRICING_FINANCIAL_LINK_VERSION = 'SELLER_PRICING_FINANCIAL_LINK_V1' as const;
export const SELLER_PRICING_DECISION_VERSION = 'SELLER_PRICING_DECISION_V1' as const;
export const SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_NEXT_GATE =
  'READY_FOR_SELLER_POST_LAUNCH_RESPONSE_INTELLIGENCE_ARCHITECTURE' as const;
export const SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_PRODUCT_STATUS =
  'SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_V1_CERTIFIED_WITH_POST_LAUNCH_FINANCIAL_PDF_SHARE_HELD' as const;

export const SELLER_PRICING_OBJECTIVE_TYPES = [
  'MAXIMIZE_MARKET_EXPOSURE',
  'MAXIMIZE_COMPETITIVE_POSITION',
  'TARGET_SEARCH_BAND',
  'CREATE_STRONG_BUYER_COMPARISON',
  'BALANCE_PRICE_AND_TIME',
  'PRIORITIZE_TIMING',
  'PRIORITIZE_CERTAINTY',
  'TEST_HIGHER_PRICE_POSITION',
  'ENTER_NEAR_MARKET_CENTER',
  'CUSTOM_AGENT_OBJECTIVE',
] as const;

export const SELLER_PRICING_SUBJECT_POSITION_STATES = [
  'BELOW_CURRENT_RANGE',
  'LOWER_RANGE',
  'MID_RANGE',
  'UPPER_RANGE',
  'ABOVE_CURRENT_RANGE',
  'OUTLIER_CUSTOM',
] as const;

export const SELLER_PRICING_TRADEOFF_TYPES = [
  'EXPOSURE',
  'COMPETITIVE_POSITION',
  'SEARCH_BAND_REACH',
  'BUYER_CHOICE_SET',
  'TIME_PATIENCE',
  'PRICE_FLEXIBILITY',
  'REASSESSMENT',
  'PREPARATION_DEPENDENCY',
  'MARKETING_STORY',
  'SELLER_TIMING',
  'FINANCIAL_SCENARIO_IMPACT',
] as const;

export const SELLER_PRICING_REASSESSMENT_TRIGGER_TYPES = [
  'NEW_COMPETITION',
  'MARKET_COHORT_SHIFT',
  'SELLER_TIMING_CHANGE',
  'PREPARATION_CHANGE',
  'FINANCIAL_CONSTRAINT_CHANGE',
  'AGENT_DEFINED_TRIGGER',
] as const;

export const SELLER_PRICING_VISUAL_COMPONENTS = [
  'OutputPricingObjective',
  'OutputSearchBandLadder',
  'OutputPriceOptionCard',
  'OutputPricingScenarioComparison',
  'OutputSubjectPricePosition',
  'OutputPricingTradeoffMatrix',
  'OutputPositioningEffect',
  'OutputResponseCheckpointTimeline',
  'OutputReassessmentPanel',
  'OutputPricingEvidencePanel',
  'OutputPricingAgentRationale',
  'OutputSellerPricingDecision',
] as const;

export type SellerPricingObjectiveType = (typeof SELLER_PRICING_OBJECTIVE_TYPES)[number];
export type SellerPricingSubjectPositionState = (typeof SELLER_PRICING_SUBJECT_POSITION_STATES)[number];
export type SellerPricingTradeoffType = (typeof SELLER_PRICING_TRADEOFF_TYPES)[number];
export type SellerPricingReassessmentTriggerType = (typeof SELLER_PRICING_REASSESSMENT_TRIGGER_TYPES)[number];
export type SellerPricingVisualComponent = (typeof SELLER_PRICING_VISUAL_COMPONENTS)[number];
export type SellerPricingSelectionState = 'PRIMARY_AGENT_RECOMMENDED' | 'ALTERNATIVE' | 'SELLER_SELECTED' | 'DEFERRED';
export type SellerPricingReadinessState = 'READY_FOR_AGENT_REVIEW' | 'AGENT_INPUT_REQUIRED' | 'EVIDENCE_REVIEW_REQUIRED' | 'FINANCIAL_REVIEW_REQUIRED' | 'HELD_FOR_FUTURE_GATE';

export type SellerPricingEvidenceReference = Readonly<{
  id: string;
  label: string;
  source: string;
  version: string;
  asOf: string;
  coverage: string;
  freshness: AtlasOutputFreshnessState;
  rights: AtlasOutputRightsState;
  reviewState: AtlasOutputReviewState;
  limitations: readonly string[];
}>;

export type SellerPricingObjective = Readonly<{
  id: SellerPricingObjectiveType;
  displayName: string;
  sellerQuestion: string;
  agentRationale: string;
  evidenceRequirements: readonly string[];
  tradeoffReferences: readonly SellerPricingTradeoffType[];
}>;

export type SellerPriceAssumption = Readonly<{
  id: string;
  value: number;
  currency: 'USD';
  unit: 'LIST_PRICE_ASSUMPTION';
  agentAuthor: 'PROJECT_ATLAS_REFERENCE_AGENT';
  createdAt: string;
  updatedAt: string;
  scenarioId: string;
  asOf: string;
  reviewState: AtlasOutputReviewState;
  sellerSelectionState: SellerPricingSelectionState;
  financialLinkReferences: readonly string[];
}>;

export type SellerPricingBoundarySemantics = Readonly<{
  lowerInclusive: boolean;
  upperInclusive: boolean;
  adjacentDoubleCountingPermitted: false;
  label: string;
}>;

export type SellerPricingSearchBand = Readonly<{
  id: string;
  version: typeof SELLER_PRICING_SEARCH_BAND_VERSION;
  label: string;
  lowerBound: number;
  upperBound: number;
  boundarySemantics: SellerPricingBoundarySemantics;
  source: 'AGENT_DEFINED_VERSIONED_BAND';
  cohortReference: string;
  asOf: string;
  geography: string;
  propertyType: string;
  currentListingCount: number;
  subjectMembership: 'SUBJECT_ENTERED_BY_PRICE_ASSUMPTION' | 'SUBJECT_OUTSIDE_BAND';
  agentRationale: string;
  evidenceReferenceIds: readonly string[];
  rights: AtlasOutputRightsState;
  reviewState: AtlasOutputReviewState;
}>;

export type SellerPricingSubjectPosition = Readonly<{
  state: SellerPricingSubjectPositionState;
  definition: string;
  sellerFacingLabel: string;
  agentInterpretation: string;
  evidenceReferenceIds: readonly string[];
}>;

export type SellerPricingTradeoff = Readonly<{
  id: SellerPricingTradeoffType;
  label: string;
  sellerQuestion: string;
  evidenceReferenceIds: readonly string[];
  agentStatement: string;
  financialLinkReferences: readonly string[];
  reviewState: AtlasOutputReviewState;
}>;

export type SellerPricingPositioningTheme = Readonly<{
  id: string;
  headline: string;
  message: string;
  propertyEvidence: readonly string[];
  locationEvidence: readonly string[];
  marketEvidence: readonly string[];
  competitionEvidence: readonly string[];
  priceScenarioReferences: readonly string[];
  agentRationale: string;
  emphasis: 'LEAD' | 'SUPPORT' | 'CONTEXT';
  reviewState: AtlasOutputReviewState;
}>;

export type SellerPricingResponseCheckpoint = Readonly<{
  id: string;
  name: string;
  basis: 'LAUNCH' | 'DAYS_AFTER_LAUNCH' | 'EVENT_TRIGGER';
  timing: string;
  currentPricingScenarioId: string;
  evidenceToReview: readonly string[];
  currentCompetitionReference: string;
  marketContextReference: string;
  agentInterpretation: string;
  triggeredDecision: string;
  reviewState: AtlasOutputReviewState;
  sellerAction: string;
}>;

export type SellerPricingReassessmentTrigger = Readonly<{
  id: string;
  type: SellerPricingReassessmentTriggerType;
  whatChanged: string;
  evidenceReferenceIds: readonly string[];
  reviewAction: string;
  sellerQuestion: string;
  relatedModules: readonly SellerPricingVisualComponent[];
}>;

export type SellerPricingFinancialLink = Readonly<{
  id: string;
  version: typeof SELLER_PRICING_FINANCIAL_LINK_VERSION;
  pricingScenarioId: string;
  pricingScenarioVersion: typeof SELLER_PRICING_SCENARIO_VERSION;
  priceAssumptionId: string;
  priceAssumptionValue: number;
  asOf: string;
  agentAuthor: 'PROJECT_ATLAS_REFERENCE_AGENT';
  sellerSelectionState: SellerPricingSelectionState;
  financialScenarioReferences: readonly string[];
  financialPreparationVersion: typeof REIE_FINANCIAL_DECISION_PREPARATION_VERSION;
  financialLinkReviewState: 'READY_FOR_REVIEW' | 'REVIEW_REQUIRED';
}>;

export type SellerPricingScenario = Readonly<{
  id: string;
  version: typeof SELLER_PRICING_SCENARIO_VERSION;
  name: string;
  objectiveId: SellerPricingObjectiveType;
  priceAssumption: SellerPriceAssumption;
  searchBandId: string;
  searchBandMembership: 'IN_BAND' | 'OUT_OF_BAND';
  currentCohortReference: string;
  currentCompetitionReference: string;
  subjectPosition: SellerPricingSubjectPosition;
  positioningEffects: readonly string[];
  advantages: readonly string[];
  tradeoffIds: readonly SellerPricingTradeoffType[];
  responseCheckpointIds: readonly string[];
  reassessmentTriggerIds: readonly string[];
  agentRationale: string;
  agentRationaleVersion: typeof SELLER_PRICING_AGENT_RATIONALE_VERSION;
  evidenceReferenceIds: readonly string[];
  asOf: string;
  freshness: AtlasOutputFreshnessState;
  rights: AtlasOutputRightsState;
  reviewState: AtlasOutputReviewState;
  sellerSelectionState: SellerPricingSelectionState;
  nextAction: string;
  financialLink: SellerPricingFinancialLink;
}>;

export type SellerPricingDecision = Readonly<{
  id: string;
  version: typeof SELLER_PRICING_DECISION_VERSION;
  state: 'SELLER_SELECTED' | 'DEFERRED_FOR_AGENT_REVIEW';
  selectedScenarioId: string;
  selectedScenarioVersion: typeof SELLER_PRICING_SCENARIO_VERSION;
  decidedAt: string | null;
  recordedAt: string;
  agentReview: AtlasOutputReviewState;
  nextAction: string;
  checkpointReferences: readonly string[];
  financialLinkState: 'READY_FOR_REVIEW' | 'REVIEW_REQUIRED';
}>;

export type SellerPricingCurrentContext = Readonly<{
  id: string;
  subject: Readonly<{
    reference: string;
    propertyType: string;
    sqft: number;
    beds: number;
    baths: number;
    yearBuilt: number;
    lot: string;
    garage: string;
    geography: string;
    selectedAdmittedFeatures: readonly string[];
  }>;
  cohort: Readonly<{
    id: string;
    version: typeof ATLAS_COHORT_CONTRACT_VERSION;
    currentSnapshotVersion: typeof AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION;
    geography: string;
    propertyType: string;
    currentPopulation: number;
    currentPriceMetrics: readonly string[];
    asOf: string;
    coverage: string;
    freshness: AtlasOutputFreshnessState;
    rights: AtlasOutputRightsState;
    limitations: readonly string[];
  }>;
  competition: Readonly<{
    id: string;
    version: typeof CURRENT_COMPETING_LISTING_CONTEXT_VERSION;
    certification: typeof CURRENT_COMPETING_LISTING_CONTEXT_WAVE_6_STATUS;
    currentListings: readonly Readonly<{
      listingId: string;
      currentAskingListPrice: number | null;
      propertyFacts: string;
      currentStatus: string;
      asOf: string;
      evidenceReferenceId: string;
    }>[];
    asOf: string;
    freshness: AtlasOutputFreshnessState;
    rights: AtlasOutputRightsState;
  }>;
  searchBands: readonly SellerPricingSearchBand[];
  evidenceReferenceIds: readonly string[];
  asOf: string;
  coverage: string;
  rights: AtlasOutputRightsState;
  freshness: AtlasOutputFreshnessState;
  limitations: readonly string[];
}>;

export type SellerPricingModule = Readonly<{
  id: string;
  title: string;
  canonicalInput: string;
  agentInput: string;
  evidenceReferenceIds: readonly string[];
  visual: SellerPricingVisualComponent;
  readiness: SellerPricingReadinessState;
  sellerQuestion: string;
  density: 'D1' | 'D2' | 'D3' | 'D4';
}>;

export type SellerPricingFramework = Readonly<{
  status: typeof SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_STATUS;
  version: typeof SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION;
  scenarioVersion: typeof SELLER_PRICING_SCENARIO_VERSION;
  sellerBriefVersion: typeof SELLER_DECISION_BRIEF_V2_VERSION;
  sellerBriefStatus: typeof SELLER_DECISION_BRIEF_V2_STATUS;
  route: '/agent/prepare/seller/presentation';
  objectives: readonly SellerPricingObjective[];
  currentContext: SellerPricingCurrentContext;
  tradeoffs: readonly SellerPricingTradeoff[];
  positioningThemes: readonly SellerPricingPositioningTheme[];
  scenarios: readonly SellerPricingScenario[];
  responseCheckpoints: readonly SellerPricingResponseCheckpoint[];
  reassessmentTriggers: readonly SellerPricingReassessmentTrigger[];
  sellerDecision: SellerPricingDecision;
  modules: readonly SellerPricingModule[];
  questionCoverage: readonly Readonly<{
    question: string;
    moduleId: string;
    evidenceReferenceIds: readonly string[];
    agentInputRequired: boolean;
    visual: SellerPricingVisualComponent;
    coverage: 'STRONG' | 'ADEQUATE' | 'INPUT_REQUIRED';
  }>[];
  evidenceReferences: readonly SellerPricingEvidenceReference[];
  evidenceLineage: readonly string[];
  v2Integration: readonly Readonly<{
    v2Layer: string;
    pricingLayer: string;
    reference: string;
  }>[];
  productFamilyReuse: readonly SellerDecisionBriefProductFamilyReuse[];
  fixtureResult: Readonly<{
    fixtureId: string;
    productVersion: typeof SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION;
    cohortVersion: typeof ATLAS_COHORT_CONTRACT_VERSION;
    competitionVersion: typeof CURRENT_COMPETING_LISTING_CONTEXT_VERSION;
    searchBandVersion: typeof SELLER_PRICING_SEARCH_BAND_VERSION;
    priceScenarioVersions: readonly string[];
    selectedScenario: string;
    agentRationaleVersion: typeof SELLER_PRICING_AGENT_RATIONALE_VERSION;
    sellerDecisionVersion: typeof SELLER_PRICING_DECISION_VERSION;
    financialLinkVersion: typeof SELLER_PRICING_FINANCIAL_LINK_VERSION;
    overallReadiness: SellerPricingReadinessState;
  }>;
  readiness: Readonly<{
    domainComposition: 'CERTIFIED';
    pricingObjective: 'IMPLEMENTED_AGENT_REVIEW_REQUIRED';
    currentPricingContext: 'IMPLEMENTED_POINT_IN_TIME';
    currentCompetition: 'IMPLEMENTED_CURRENT_CONTEXT_ONLY';
    searchBands: 'IMPLEMENTED_AGENT_DEFINED_VERSIONED';
    priceOptions: 'IMPLEMENTED_AGENT_AUTHORED';
    positioningEffect: 'IMPLEMENTED_DESCRIPTIVE';
    tradeoffs: 'IMPLEMENTED';
    agentPricingRationale: 'IMPLEMENTED_AGENT_AUTHORED';
    responseCheckpoints: 'IMPLEMENTED';
    reassessment: 'IMPLEMENTED';
    sellerPricingDecision: 'IMPLEMENTED_SESSION_SAFE';
    financialBridge: 'IMPLEMENTED_VERSION_REVIEW_SEAM';
    evidence: 'PARTIAL_WITH_EXPLICIT_GATES';
    rights: 'AGENT_INTERNAL_AND_REVIEW_GATED';
    freshness: 'POINT_IN_TIME_AND_REVIEW_GATED';
    agentReview: 'IMPLEMENTED';
    sellerPreview: 'IMPLEMENTED';
    printPreview: 'FOUNDATION_IMPLEMENTED';
    postLaunchResponseIntelligence: 'NEXT_GATE';
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
    postLaunchRuntime: false;
  }>;
  nextGate: typeof SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_NEXT_GATE;
  productStatus: typeof SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_PRODUCT_STATUS;
}>;

const AS_OF = '2026-08-27';

function freezeArray<T>(items: readonly T[]): readonly T[] {
  return Object.freeze([...items]);
}

export function belongsToSearchBand(value: number, band: SellerPricingSearchBand): boolean {
  const lowerOk = band.boundarySemantics.lowerInclusive ? value >= band.lowerBound : value > band.lowerBound;
  const upperOk = band.boundarySemantics.upperInclusive ? value <= band.upperBound : value < band.upperBound;
  return lowerOk && upperOk;
}

export function bandForPrice(value: number, bands: readonly SellerPricingSearchBand[]): SellerPricingSearchBand | null {
  return bands.find((band) => belongsToSearchBand(value, band)) ?? null;
}

export function hasAdjacentBandDoubleCount(value: number, bands: readonly SellerPricingSearchBand[]): boolean {
  return bands.filter((band) => belongsToSearchBand(value, band)).length > 1;
}

export function subjectPositionForPrice(value: number, bands: readonly SellerPricingSearchBand[]): SellerPricingSubjectPositionState {
  const ordered = [...bands].sort((a, b) => a.lowerBound - b.lowerBound);
  const first = ordered[0];
  const last = ordered[ordered.length - 1];
  if (value < first.lowerBound) return 'BELOW_CURRENT_RANGE';
  if (value > last.upperBound) return 'ABOVE_CURRENT_RANGE';
  const band = bandForPrice(value, ordered);
  if (!band) return 'OUTLIER_CUSTOM';
  if (band.id.endsWith('lower')) return 'LOWER_RANGE';
  if (band.id.endsWith('current')) return 'MID_RANGE';
  if (band.id.endsWith('upper')) return 'UPPER_RANGE';
  return 'OUTLIER_CUSTOM';
}

export function financialReviewStateForPricingChange(
  previous: Pick<SellerPricingScenario, 'id' | 'version' | 'asOf' | 'agentRationaleVersion'> & { priceAssumptionValue: number },
  current: Pick<SellerPricingScenario, 'id' | 'version' | 'asOf' | 'agentRationaleVersion'> & { priceAssumptionValue: number },
) {
  return previous.id !== current.id
    || previous.version !== current.version
    || previous.asOf !== current.asOf
    || previous.agentRationaleVersion !== current.agentRationaleVersion
    || previous.priceAssumptionValue !== current.priceAssumptionValue
    ? 'REVIEW_REQUIRED' as const
    : 'READY_FOR_REVIEW' as const;
}

function evidenceReferences(): readonly SellerPricingEvidenceReference[] {
  return freezeArray([
    evidence('pricing-objective', 'Seller pricing objective', 'SELLER_PREPARATION', SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION, 'Seller objective and timing remain Agent-reviewed before use.', 'AGENT_REVIEW_REQUIRED'),
    evidence('pricing-subject-facts', 'Subject property facts', 'SELLER_DECISION_BRIEF_V2', SELLER_DECISION_BRIEF_V2_VERSION, 'Fixture subject facts for pricing-context review.', 'AGENT_REVIEW_REQUIRED'),
    evidence('pricing-current-cohort', 'Current market cohort', 'AGENT_CURRENT_SNAPSHOT_COMPARISON', AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION, 'Current snapshot only; not historical trend or valuation.', 'AGENT_REVIEW_REQUIRED'),
    evidence('pricing-current-competition', 'Current competition set', 'CURRENT_COMPETING_LISTING_CONTEXT', CURRENT_COMPETING_LISTING_CONTEXT_VERSION, 'Current competing listing context only; no sold comparable or CMA claim.', 'AGENT_REVIEW_REQUIRED'),
    evidence('pricing-search-bands', 'Agent-defined search bands', 'SELLER_PRICING_SEARCH_BAND', SELLER_PRICING_SEARCH_BAND_VERSION, 'Agent-defined fixture bands with explicit adjacent-boundary semantics.', 'AGENT_REVIEW_REQUIRED'),
    evidence('pricing-agent-rationale', 'Agent pricing rationale', 'SELLER_PRICING_AGENT_RATIONALE', SELLER_PRICING_AGENT_RATIONALE_VERSION, 'Human Agent-authored interpretation required before seller use.', 'AGENT_REVIEW_REQUIRED'),
    evidence('pricing-financial-link', 'Financial scenario link', 'SELLER_PRICING_FINANCIAL_LINK', SELLER_PRICING_FINANCIAL_LINK_VERSION, 'Dependency reference only; no financial advice or generated scenario output.', 'AGENT_REVIEW_REQUIRED'),
  ]);
}

function evidence(id: string, label: string, source: string, version: string, limitation: string, reviewState: AtlasOutputReviewState): SellerPricingEvidenceReference {
  return Object.freeze({
    id,
    label,
    source,
    version,
    asOf: AS_OF,
    coverage: 'DETERMINISTIC_FIXTURE_FOR_AGENT_REVIEW',
    freshness: 'POINT_IN_TIME',
    rights: 'ADMITTED_FOR_AGENT_INTERNAL',
    reviewState,
    limitations: freezeArray([limitation]),
  });
}

function objectives(): readonly SellerPricingObjective[] {
  return freezeArray([
    objective('MAXIMIZE_MARKET_EXPOSURE', 'Maximize market exposure', 'How do we enter the widest relevant search context?', ['EXPOSURE', 'SEARCH_BAND_REACH', 'PRICE_FLEXIBILITY']),
    objective('MAXIMIZE_COMPETITIVE_POSITION', 'Maximize competitive position', 'How do we look strong against current choices?', ['COMPETITIVE_POSITION', 'BUYER_CHOICE_SET', 'MARKETING_STORY']),
    objective('TARGET_SEARCH_BAND', 'Target a search band', 'Which search band are we intentionally entering?', ['SEARCH_BAND_REACH', 'BUYER_CHOICE_SET']),
    objective('CREATE_STRONG_BUYER_COMPARISON', 'Create strong buyer comparison', 'How do we make the property easier to compare favorably?', ['COMPETITIVE_POSITION', 'MARKETING_STORY']),
    objective('BALANCE_PRICE_AND_TIME', 'Balance price and time', 'How do we balance ambition with response timing?', ['TIME_PATIENCE', 'REASSESSMENT', 'SELLER_TIMING']),
    objective('PRIORITIZE_TIMING', 'Prioritize timing', 'What price posture supports a timing-sensitive plan?', ['SELLER_TIMING', 'PRICE_FLEXIBILITY']),
    objective('PRIORITIZE_CERTAINTY', 'Prioritize certainty', 'What option creates the clearest response path?', ['COMPETITIVE_POSITION', 'REASSESSMENT']),
    objective('TEST_HIGHER_PRICE_POSITION', 'Test higher price position', 'What changes if we test a higher band?', ['EXPOSURE', 'TIME_PATIENCE', 'REASSESSMENT']),
    objective('ENTER_NEAR_MARKET_CENTER', 'Enter near market center', 'How do we position close to current buyer-choice center?', ['BUYER_CHOICE_SET', 'PRICE_FLEXIBILITY']),
    objective('CUSTOM_AGENT_OBJECTIVE', 'Custom Agent objective', 'What custom objective should the Agent define?', ['PREPARATION_DEPENDENCY', 'FINANCIAL_SCENARIO_IMPACT']),
  ]);
}

function objective(id: SellerPricingObjectiveType, displayName: string, sellerQuestion: string, tradeoffReferences: readonly SellerPricingTradeoffType[]): SellerPricingObjective {
  return Object.freeze({
    id,
    displayName,
    sellerQuestion,
    agentRationale: `${displayName} is an Agent-authored pricing objective that must be reviewed against current evidence before seller use.`,
    evidenceRequirements: freezeArray(['pricing-objective', 'pricing-current-cohort', 'pricing-current-competition', 'pricing-search-bands']),
    tradeoffReferences: freezeArray(tradeoffReferences),
  });
}

function searchBands(): readonly SellerPricingSearchBand[] {
  const base = {
    version: SELLER_PRICING_SEARCH_BAND_VERSION,
    source: 'AGENT_DEFINED_VERSIONED_BAND' as const,
    cohortReference: 'pricing-current-cohort-v1',
    asOf: AS_OF,
    geography: 'Boulder fixture pricing geography',
    propertyType: 'Single-family',
    rights: 'ADMITTED_FOR_AGENT_INTERNAL' as const,
    reviewState: 'AGENT_REVIEW_REQUIRED' as const,
    evidenceReferenceIds: freezeArray(['pricing-search-bands', 'pricing-current-cohort']),
  };
  return freezeArray([
    Object.freeze({
      ...base,
      id: 'seller-pricing-band-lower',
      label: 'Lower search band',
      lowerBound: 900000,
      upperBound: 1100000,
      boundarySemantics: semantics(true, false, 'Includes $900,000 and excludes $1,100,000.'),
      currentListingCount: 7,
      subjectMembership: 'SUBJECT_ENTERED_BY_PRICE_ASSUMPTION',
      agentRationale: 'Creates broader buyer reach while requiring tradeoff review around price ambition.',
    }),
    Object.freeze({
      ...base,
      id: 'seller-pricing-band-current',
      label: 'Current-center search band',
      lowerBound: 1100000,
      upperBound: 1300000,
      boundarySemantics: semantics(true, false, 'Includes $1,100,000 and excludes $1,300,000.'),
      currentListingCount: 9,
      subjectMembership: 'SUBJECT_ENTERED_BY_PRICE_ASSUMPTION',
      agentRationale: 'Frames the property near the current buyer-choice center with balanced exposure and ambition.',
    }),
    Object.freeze({
      ...base,
      id: 'seller-pricing-band-upper',
      label: 'Upper search band',
      lowerBound: 1300000,
      upperBound: 1500000,
      boundarySemantics: semantics(true, true, 'Includes $1,300,000 through $1,500,000 for the final fixture band.'),
      currentListingCount: 5,
      subjectMembership: 'SUBJECT_ENTERED_BY_PRICE_ASSUMPTION',
      agentRationale: 'Tests a higher price position with clearer patience and reassessment requirements.',
    }),
  ]);
}

function semantics(lowerInclusive: boolean, upperInclusive: boolean, label: string): SellerPricingBoundarySemantics {
  return Object.freeze({ lowerInclusive, upperInclusive, adjacentDoubleCountingPermitted: false, label });
}

function tradeoffs(): readonly SellerPricingTradeoff[] {
  return freezeArray(SELLER_PRICING_TRADEOFF_TYPES.map((id) => Object.freeze({
    id,
    label: id.replaceAll('_', ' ').toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase()),
    sellerQuestion: `How does this option affect ${id.replaceAll('_', ' ').toLowerCase()}?`,
    evidenceReferenceIds: freezeArray(['pricing-current-cohort', 'pricing-current-competition', 'pricing-agent-rationale']),
    agentStatement: `The Agent must review the ${id.replaceAll('_', ' ').toLowerCase()} tradeoff before using this option with the Seller.`,
    financialLinkReferences: id === 'FINANCIAL_SCENARIO_IMPACT' ? freezeArray(['pricing-financial-link-selected']) : freezeArray([]),
    reviewState: 'AGENT_REVIEW_REQUIRED' as const,
  })));
}

function currentContext(bands: readonly SellerPricingSearchBand[]): SellerPricingCurrentContext {
  return Object.freeze({
    id: 'seller-pricing-current-context-v1',
    subject: Object.freeze({
      reference: 'seller-decision-brief-subject-property',
      propertyType: 'Single-family',
      sqft: 2840,
      beds: 4,
      baths: 3,
      yearBuilt: 1998,
      lot: '7,405 sq ft',
      garage: 'Attached garage evidence review required',
      geography: 'Boulder fixture pricing geography',
      selectedAdmittedFeatures: freezeArray(['Property fact grid', 'Location context', 'Current market context', 'Current competition context']),
    }),
    cohort: Object.freeze({
      id: 'pricing-current-cohort-v1',
      version: ATLAS_COHORT_CONTRACT_VERSION,
      currentSnapshotVersion: AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION,
      geography: 'Boulder fixture pricing geography',
      propertyType: 'Single-family',
      currentPopulation: 21,
      currentPriceMetrics: freezeArray(['Current asking/list price median: $1,220,000', 'Current asking/list price mean: $1,245,000']),
      asOf: AS_OF,
      coverage: 'Current repository property-search projection fixture',
      freshness: 'POINT_IN_TIME',
      rights: 'ADMITTED_FOR_AGENT_INTERNAL',
      limitations: freezeArray(['Current snapshot only; no historical trend, valuation, sale probability, or recommended price is inferred.']),
    }),
    competition: Object.freeze({
      id: 'pricing-current-competition-v1',
      version: CURRENT_COMPETING_LISTING_CONTEXT_VERSION,
      certification: CURRENT_COMPETING_LISTING_CONTEXT_WAVE_6_STATUS,
      currentListings: freezeArray([
        listing('fixture-comp-1', 1075000, '3 bed / 3 bath / 2,420 sq ft', 'Active'),
        listing('fixture-comp-2', 1195000, '4 bed / 3 bath / 2,760 sq ft', 'Active'),
        listing('fixture-comp-3', 1295000, '4 bed / 4 bath / 3,010 sq ft', 'Active'),
      ]),
      asOf: AS_OF,
      freshness: 'POINT_IN_TIME',
      rights: 'ADMITTED_FOR_AGENT_INTERNAL',
    }),
    searchBands: bands,
    evidenceReferenceIds: freezeArray(['pricing-subject-facts', 'pricing-current-cohort', 'pricing-current-competition', 'pricing-search-bands']),
    asOf: AS_OF,
    coverage: 'Subject, cohort, competition, and Agent-defined band fixture for pricing framework certification.',
    rights: 'ADMITTED_FOR_AGENT_INTERNAL',
    freshness: 'POINT_IN_TIME',
    limitations: freezeArray(['Missing live evidence must remain explicit; fixture values are illustrative and review-gated.']),
  });
}

function listing(listingId: string, currentAskingListPrice: number, propertyFacts: string, currentStatus: string) {
  return Object.freeze({
    listingId,
    currentAskingListPrice,
    propertyFacts,
    currentStatus,
    asOf: AS_OF,
    evidenceReferenceId: 'pricing-current-competition',
  });
}

function positioningThemes(): readonly SellerPricingPositioningTheme[] {
  return freezeArray([
    theme('pricing-theme-buyer-reach', 'Buyer reach', 'The lower and current-center options may keep the property visible in more current searches.', ['seller-pricing-scenario-exposure', 'seller-pricing-scenario-balance']),
    theme('pricing-theme-story-strength', 'Story strength', 'The current-center option keeps the property story close to the visible buyer-choice center.', ['seller-pricing-scenario-balance']),
    theme('pricing-theme-price-ambition', 'Price ambition', 'The upper option requires clearer patience, response checkpoints, and reassessment language.', ['seller-pricing-scenario-upper-test']),
  ]);
}

function theme(id: string, headline: string, message: string, scenarioIds: readonly string[]): SellerPricingPositioningTheme {
  return Object.freeze({
    id,
    headline,
    message,
    propertyEvidence: freezeArray(['pricing-subject-facts']),
    locationEvidence: freezeArray(['seller-v2-location-story']),
    marketEvidence: freezeArray(['pricing-current-cohort']),
    competitionEvidence: freezeArray(['pricing-current-competition']),
    priceScenarioReferences: freezeArray(scenarioIds),
    agentRationale: `${headline} is an Agent-authored positioning effect linked to current context and price scenario review.`,
    emphasis: id === 'pricing-theme-story-strength' ? 'LEAD' : 'SUPPORT',
    reviewState: 'AGENT_REVIEW_REQUIRED',
  });
}

function checkpoints(): readonly SellerPricingResponseCheckpoint[] {
  return freezeArray([
    checkpoint('pricing-checkpoint-launch', 'Launch confirmation', 'LAUNCH', 'Before public launch', 'Confirm objective, selected price assumption, evidence, and limitations.', 'Confirm selected pricing scenario before launch.'),
    checkpoint('pricing-checkpoint-first-response', 'First response review', 'DAYS_AFTER_LAUNCH', 'After first response window', 'Review showings, inquiries, current competition, and new evidence.', 'Decide whether the response supports staying the course or reassessing.'),
    checkpoint('pricing-checkpoint-reassessment', 'Reassessment trigger review', 'EVENT_TRIGGER', 'When a defined trigger occurs', 'Review trigger evidence, competition shift, and financial-link review state.', 'Decide whether to update the scenario or hold current plan.'),
  ]);
}

function checkpoint(id: string, name: string, basis: SellerPricingResponseCheckpoint['basis'], timing: string, agentInterpretation: string, triggeredDecision: string): SellerPricingResponseCheckpoint {
  return Object.freeze({
    id,
    name,
    basis,
    timing,
    currentPricingScenarioId: 'seller-pricing-scenario-balance',
    evidenceToReview: freezeArray(['pricing-current-cohort', 'pricing-current-competition', 'pricing-agent-rationale']),
    currentCompetitionReference: 'pricing-current-competition-v1',
    marketContextReference: 'pricing-current-cohort-v1',
    agentInterpretation,
    triggeredDecision,
    reviewState: 'AGENT_REVIEW_REQUIRED',
    sellerAction: 'Review with Agent and confirm next pricing decision.',
  });
}

function reassessmentTriggers(): readonly SellerPricingReassessmentTrigger[] {
  return freezeArray([
    trigger('pricing-trigger-new-competition', 'NEW_COMPETITION', 'A materially relevant current competitor appears.', 'Review current competition and search-band frame.'),
    trigger('pricing-trigger-market-shift', 'MARKET_COHORT_SHIFT', 'The current cohort population or price distribution changes.', 'Review current market context and option posture.'),
    trigger('pricing-trigger-seller-timing', 'SELLER_TIMING_CHANGE', 'The Seller changes timing priority.', 'Review objective, tradeoffs, and response checkpoint.'),
    trigger('pricing-trigger-preparation', 'PREPARATION_CHANGE', 'Preparation or property-story evidence changes.', 'Review positioning effect and launch dependency.'),
    trigger('pricing-trigger-financial', 'FINANCIAL_CONSTRAINT_CHANGE', 'A linked financial planning assumption changes.', 'Mark linked financial references review-required.'),
    trigger('pricing-trigger-agent-defined', 'AGENT_DEFINED_TRIGGER', 'The Agent defines a scenario-specific review trigger.', 'Review Agent rationale before seller use.'),
  ]);
}

function trigger(id: string, type: SellerPricingReassessmentTriggerType, whatChanged: string, reviewAction: string): SellerPricingReassessmentTrigger {
  const relatedModules: readonly SellerPricingVisualComponent[] = ['OutputReassessmentPanel', 'OutputResponseCheckpointTimeline', 'OutputSellerPricingDecision'];
  return Object.freeze({
    id,
    type,
    whatChanged,
    evidenceReferenceIds: freezeArray(['pricing-current-cohort', 'pricing-current-competition', 'pricing-agent-rationale']),
    reviewAction,
    sellerQuestion: 'When will we reassess?',
    relatedModules: freezeArray(relatedModules),
  });
}

function scenarios(bands: readonly SellerPricingSearchBand[]): readonly SellerPricingScenario[] {
  return freezeArray([
    scenario('seller-pricing-scenario-exposure', 'Exposure option', 'MAXIMIZE_MARKET_EXPOSURE', 1075000, 'seller-pricing-band-lower', 'PRIMARY_AGENT_RECOMMENDED', ['Broader search-band reach', 'Strong buyer-choice context'], ['EXPOSURE', 'SEARCH_BAND_REACH', 'PRICE_FLEXIBILITY'], 'Lead with buyer reach and verify whether the Seller accepts the price-flexibility tradeoff.', ['pricing-theme-buyer-reach']),
    scenario('seller-pricing-scenario-balance', 'Balanced positioning option', 'BALANCE_PRICE_AND_TIME', 1195000, 'seller-pricing-band-current', 'SELLER_SELECTED', ['Near current buyer-choice center', 'Balanced story and response plan'], ['COMPETITIVE_POSITION', 'BUYER_CHOICE_SET', 'REASSESSMENT'], 'This is the selected fixture option because it balances current context, competition frame, and response checkpoints.', ['pricing-theme-story-strength']),
    scenario('seller-pricing-scenario-upper-test', 'Upper test option', 'TEST_HIGHER_PRICE_POSITION', 1325000, 'seller-pricing-band-upper', 'ALTERNATIVE', ['Higher price ambition', 'Clearer patience/reassessment plan'], ['TIME_PATIENCE', 'REASSESSMENT', 'FINANCIAL_SCENARIO_IMPACT'], 'Use only if the Seller accepts narrower current-choice context and defined reassessment checkpoints.', ['pricing-theme-price-ambition']),
  ].map((item) => {
    const band = bands.find((candidate) => candidate.id === item.searchBandId);
    if (!band) throw new Error(`Missing pricing search band ${item.searchBandId}`);
    return item;
  }));
}

function scenario(
  id: string,
  name: string,
  objectiveId: SellerPricingObjectiveType,
  price: number,
  searchBandId: string,
  sellerSelectionState: SellerPricingSelectionState,
  advantages: readonly string[],
  tradeoffIds: readonly SellerPricingTradeoffType[],
  agentRationale: string,
  positioningEffects: readonly string[],
): SellerPricingScenario {
  const bands = searchBands();
  const band = bands.find((item) => item.id === searchBandId);
  if (!band) throw new Error(`Missing pricing search band ${searchBandId}`);
  const positionState = subjectPositionForPrice(price, bands);
  const financialLink = financialLinkFor(id, price, sellerSelectionState);
  return Object.freeze({
    id,
    version: SELLER_PRICING_SCENARIO_VERSION,
    name,
    objectiveId,
    priceAssumption: Object.freeze({
      id: `${id}-assumption`,
      value: price,
      currency: 'USD',
      unit: 'LIST_PRICE_ASSUMPTION',
      agentAuthor: 'PROJECT_ATLAS_REFERENCE_AGENT',
      createdAt: `${AS_OF}T00:00:00.000Z`,
      updatedAt: `${AS_OF}T00:00:00.000Z`,
      scenarioId: id,
      asOf: AS_OF,
      reviewState: 'AGENT_REVIEW_REQUIRED',
      sellerSelectionState,
      financialLinkReferences: freezeArray([financialLink.id]),
    }),
    searchBandId,
    searchBandMembership: belongsToSearchBand(price, band) ? 'IN_BAND' : 'OUT_OF_BAND',
    currentCohortReference: 'pricing-current-cohort-v1',
    currentCompetitionReference: 'pricing-current-competition-v1',
    subjectPosition: subjectPosition(positionState, searchBandId),
    positioningEffects: freezeArray(positioningEffects),
    advantages: freezeArray(advantages),
    tradeoffIds: freezeArray(tradeoffIds),
    responseCheckpointIds: freezeArray(['pricing-checkpoint-launch', 'pricing-checkpoint-first-response', 'pricing-checkpoint-reassessment']),
    reassessmentTriggerIds: freezeArray(['pricing-trigger-new-competition', 'pricing-trigger-market-shift', 'pricing-trigger-financial']),
    agentRationale,
    agentRationaleVersion: SELLER_PRICING_AGENT_RATIONALE_VERSION,
    evidenceReferenceIds: freezeArray(['pricing-objective', 'pricing-current-cohort', 'pricing-current-competition', 'pricing-search-bands', 'pricing-agent-rationale']),
    asOf: AS_OF,
    freshness: 'POINT_IN_TIME',
    rights: 'ADMITTED_FOR_AGENT_INTERNAL',
    reviewState: 'AGENT_REVIEW_REQUIRED',
    sellerSelectionState,
    nextAction: sellerSelectionState === 'SELLER_SELECTED' ? 'Confirm selected pricing scenario and response checkpoint with the Seller.' : 'Review as an alternative with explicit tradeoffs.',
    financialLink,
  });
}

function subjectPosition(state: SellerPricingSubjectPositionState, bandId: string): SellerPricingSubjectPosition {
  return Object.freeze({
    state,
    definition: `Derived from declared Agent-defined search band ${bandId}; no valuation, ranking, or sale-probability conclusion is made.`,
    sellerFacingLabel: state.replaceAll('_', ' ').toLowerCase().replace(/^\w/, (letter) => letter.toUpperCase()),
    agentInterpretation: 'Use descriptive positioning only and keep final pricing judgment Agent-authored.',
    evidenceReferenceIds: freezeArray(['pricing-search-bands', 'pricing-current-competition']),
  });
}

function financialLinkFor(scenarioId: string, price: number, sellerSelectionState: SellerPricingSelectionState): SellerPricingFinancialLink {
  return Object.freeze({
    id: scenarioId === 'seller-pricing-scenario-balance' ? 'pricing-financial-link-selected' : `${scenarioId}-financial-link`,
    version: SELLER_PRICING_FINANCIAL_LINK_VERSION,
    pricingScenarioId: scenarioId,
    pricingScenarioVersion: SELLER_PRICING_SCENARIO_VERSION,
    priceAssumptionId: `${scenarioId}-assumption`,
    priceAssumptionValue: price,
    asOf: AS_OF,
    agentAuthor: 'PROJECT_ATLAS_REFERENCE_AGENT',
    sellerSelectionState,
    financialScenarioReferences: freezeArray(['SELLER_FINANCIAL_DECISION_PREPARATION_V1_REFERENCE']),
    financialPreparationVersion: REIE_FINANCIAL_DECISION_PREPARATION_VERSION,
    financialLinkReviewState: sellerSelectionState === 'SELLER_SELECTED' ? 'READY_FOR_REVIEW' : 'REVIEW_REQUIRED',
  });
}

function sellerDecision(): SellerPricingDecision {
  return Object.freeze({
    id: 'seller-pricing-decision-v1-fixture',
    version: SELLER_PRICING_DECISION_VERSION,
    state: 'SELLER_SELECTED',
    selectedScenarioId: 'seller-pricing-scenario-balance',
    selectedScenarioVersion: SELLER_PRICING_SCENARIO_VERSION,
    decidedAt: null,
    recordedAt: `${AS_OF}T00:00:00.000Z`,
    agentReview: 'AGENT_REVIEW_REQUIRED',
    nextAction: 'Agent confirms the selected option, response checkpoints, reassessment triggers, and financial-link review state.',
    checkpointReferences: freezeArray(['pricing-checkpoint-launch', 'pricing-checkpoint-first-response']),
    financialLinkState: 'READY_FOR_REVIEW',
  });
}

function modules(): readonly SellerPricingModule[] {
  const rows: readonly [string, string, string, string, readonly string[], SellerPricingVisualComponent, SellerPricingReadinessState, string, SellerPricingModule['density']][] = [
    ['pricing-objective-module', 'Pricing objective', 'Seller objective and Agent pricing objective', 'Agent confirms objective', ['pricing-objective'], 'OutputPricingObjective', 'READY_FOR_AGENT_REVIEW', 'What are we trying to accomplish with price?', 'D1'],
    ['pricing-search-band-module', 'Search-band ladder', 'Agent-defined search-band set', 'Agent confirms band boundaries', ['pricing-search-bands', 'pricing-current-cohort'], 'OutputSearchBandLadder', 'READY_FOR_AGENT_REVIEW', 'What search bands matter?', 'D3'],
    ['pricing-option-card-module', 'Price option cards', 'Pricing scenarios and assumptions', 'Agent authors up to three options', ['pricing-agent-rationale'], 'OutputPriceOptionCard', 'AGENT_INPUT_REQUIRED', 'What price options are we considering?', 'D2'],
    ['pricing-comparison-module', 'Scenario comparison', 'Pricing scenarios, bands, competition, tradeoffs', 'Agent reviews comparison', ['pricing-current-competition'], 'OutputPricingScenarioComparison', 'READY_FOR_AGENT_REVIEW', 'How does each option change the current competitive frame?', 'D2'],
    ['pricing-position-module', 'Subject price position', 'Declared band membership and subject position', 'Agent reviews descriptive position', ['pricing-search-bands'], 'OutputSubjectPricePosition', 'READY_FOR_AGENT_REVIEW', 'How does each option affect positioning?', 'D2'],
    ['pricing-tradeoff-module', 'Tradeoff matrix', 'Reusable pricing tradeoffs', 'Agent reviews tradeoff language', ['pricing-agent-rationale'], 'OutputPricingTradeoffMatrix', 'READY_FOR_AGENT_REVIEW', 'What are the tradeoffs?', 'D2'],
    ['pricing-positioning-effect-module', 'Positioning effect', 'V2 positioning themes plus price scenarios', 'Agent reviews positioning effect', ['pricing-current-competition'], 'OutputPositioningEffect', 'READY_FOR_AGENT_REVIEW', 'What positioning story supports each option?', 'D2'],
    ['pricing-rationale-module', 'Agent pricing rationale', 'Agent-authored rationale and evidence map', 'Agent authors rationale', ['pricing-agent-rationale'], 'OutputPricingAgentRationale', 'AGENT_INPUT_REQUIRED', 'What does my Agent recommend?', 'D1'],
    ['pricing-response-module', 'Response checkpoint timeline', 'Pricing response checkpoints', 'Agent confirms checkpoints', ['pricing-current-competition'], 'OutputResponseCheckpointTimeline', 'READY_FOR_AGENT_REVIEW', 'What will we review after launch?', 'D2'],
    ['pricing-reassessment-module', 'Reassessment panel', 'Reassessment trigger taxonomy', 'Agent confirms triggers', ['pricing-current-cohort'], 'OutputReassessmentPanel', 'READY_FOR_AGENT_REVIEW', 'When will we reassess?', 'D2'],
    ['pricing-decision-module', 'Seller pricing decision', 'Seller decision state', 'Agent records session-safe decision', ['pricing-agent-rationale'], 'OutputSellerPricingDecision', 'READY_FOR_AGENT_REVIEW', 'What decision do I need to make?', 'D1'],
    ['pricing-evidence-module', 'Pricing evidence panel', 'Pricing evidence, versions, rights, freshness', 'Agent reviews evidence', ['pricing-financial-link'], 'OutputPricingEvidencePanel', 'EVIDENCE_REVIEW_REQUIRED', 'What evidence supports this?', 'D4'],
  ];
  return freezeArray(rows.map(([id, title, canonicalInput, agentInput, evidenceReferenceIds, visual, readiness, sellerQuestion, density]) => Object.freeze({
    id,
    title,
    canonicalInput,
    agentInput,
    evidenceReferenceIds: freezeArray(evidenceReferenceIds),
    visual,
    readiness,
    sellerQuestion,
    density,
  })));
}

function questionCoverage(): SellerPricingFramework['questionCoverage'] {
  const byQuestion: readonly [string, string, readonly string[], boolean, SellerPricingVisualComponent, SellerPricingFramework['questionCoverage'][number]['coverage']][] = [
    ['What are we trying to accomplish with price?', 'pricing-objective-module', ['pricing-objective'], true, 'OutputPricingObjective', 'STRONG'],
    ['What current listing context exists?', 'pricing-comparison-module', ['pricing-current-cohort'], false, 'OutputPricingScenarioComparison', 'ADEQUATE'],
    ['What current competition exists?', 'pricing-comparison-module', ['pricing-current-competition'], false, 'OutputPricingScenarioComparison', 'ADEQUATE'],
    ['What search bands matter?', 'pricing-search-band-module', ['pricing-search-bands'], true, 'OutputSearchBandLadder', 'STRONG'],
    ['What price options are we considering?', 'pricing-option-card-module', ['pricing-agent-rationale'], true, 'OutputPriceOptionCard', 'STRONG'],
    ['How does each option change the current competitive frame?', 'pricing-comparison-module', ['pricing-current-competition'], true, 'OutputPricingScenarioComparison', 'ADEQUATE'],
    ['How does each option affect positioning?', 'pricing-positioning-effect-module', ['pricing-agent-rationale'], true, 'OutputPositioningEffect', 'ADEQUATE'],
    ['What are the tradeoffs?', 'pricing-tradeoff-module', ['pricing-agent-rationale'], true, 'OutputPricingTradeoffMatrix', 'STRONG'],
    ['What does my Agent recommend?', 'pricing-rationale-module', ['pricing-agent-rationale'], true, 'OutputPricingAgentRationale', 'INPUT_REQUIRED'],
    ['Why?', 'pricing-rationale-module', ['pricing-current-cohort', 'pricing-current-competition'], true, 'OutputPricingAgentRationale', 'ADEQUATE'],
    ['What will we review after launch?', 'pricing-response-module', ['pricing-current-competition'], true, 'OutputResponseCheckpointTimeline', 'STRONG'],
    ['When will we reassess?', 'pricing-reassessment-module', ['pricing-current-cohort'], true, 'OutputReassessmentPanel', 'STRONG'],
    ['What decision do I need to make?', 'pricing-decision-module', ['pricing-agent-rationale'], true, 'OutputSellerPricingDecision', 'STRONG'],
    ['How does this connect to my financial planning?', 'pricing-evidence-module', ['pricing-financial-link'], true, 'OutputPricingEvidencePanel', 'ADEQUATE'],
    ['What evidence supports this?', 'pricing-evidence-module', ['pricing-current-cohort', 'pricing-current-competition', 'pricing-financial-link'], false, 'OutputPricingEvidencePanel', 'STRONG'],
  ];
  return freezeArray(byQuestion.map(([question, moduleId, evidenceReferenceIds, agentInputRequired, visual, coverage]) => Object.freeze({
    question,
    moduleId,
    evidenceReferenceIds: freezeArray(evidenceReferenceIds),
    agentInputRequired,
    visual,
    coverage,
  })));
}

function v2Integration(): SellerPricingFramework['v2Integration'] {
  return freezeArray([
    ['V2 PROPERTY STORY', 'PRICING PROPERTY CONTEXT', 'pricing-subject-facts'],
    ['V2 LOCATION STORY', 'PRICING LOCATION CONTEXT', 'seller-v2-location-story'],
    ['V2 MARKET INTERPRETATION', 'PRICING CURRENT CONTEXT', 'pricing-current-cohort'],
    ['V2 COMPETITION INTERPRETATION', 'PRICING COMPETITION CONTEXT', 'pricing-current-competition'],
    ['V2 POSITIONING', 'PRICING POSITIONING EFFECT', 'pricing-theme-story-strength'],
    ['V2 PREPARATION', 'PRICING PREPARATION DEPENDENCY', 'PREPARATION_DEPENDENCY'],
    ['V2 LAUNCH', 'PRICING RESPONSE PLAN', 'pricing-checkpoint-launch'],
    ['V2 RECOMMENDATION', 'PRICING AGENT RECOMMENDATION', 'seller-pricing-scenario-balance'],
    ['V2 NEXT DECISIONS', 'PRICING SELLER DECISION', 'seller-pricing-decision-v1-fixture'],
  ].map(([v2Layer, pricingLayer, reference]) => Object.freeze({ v2Layer, pricingLayer, reference })));
}

function productFamilyReuse(): readonly SellerDecisionBriefProductFamilyReuse[] {
  return freezeArray([
    { primitive: 'SEARCH BAND', classification: 'DIRECTLY_REUSABLE', reusableProducts: freezeArray(['BUYER_PRESENTATION', 'PROPERTY_ANALYSIS', 'MARKET_REPORT']) },
    { primitive: 'SCENARIO', classification: 'DIRECTLY_REUSABLE', reusableProducts: freezeArray(['INVESTMENT_PROPERTY_ANALYSIS', 'MULTI_PROPERTY_FINANCIAL_BREAKEVEN', 'ADVISORY_BRIEFING']) },
    { primitive: 'TRADEOFF', classification: 'AUDIENCE_TRANSFORMABLE', reusableProducts: freezeArray(['BUYER_PRESENTATION', 'PROPERTY_ANALYSIS', 'ADVISORY_BRIEFING']) },
    { primitive: 'POSITION STATE', classification: 'DIRECTLY_REUSABLE', reusableProducts: freezeArray(['PROPERTY_ANALYSIS', 'MARKET_REPORT']) },
    { primitive: 'CHECKPOINT', classification: 'DIRECTLY_REUSABLE', reusableProducts: freezeArray(['ADVISORY_BRIEFING', 'SELLER_UPDATE']) },
    { primitive: 'REASSESSMENT TRIGGER', classification: 'DIRECTLY_REUSABLE', reusableProducts: freezeArray(['SELLER_UPDATE', 'POST_LAUNCH_RESPONSE_INTELLIGENCE']) },
    { primitive: 'DECISION', classification: 'DIRECTLY_REUSABLE', reusableProducts: freezeArray(['BUYER_PRESENTATION', 'ADVISORY_BRIEFING']) },
    { primitive: 'FINANCIAL-LINK INVALIDATION', classification: 'PRODUCT_SPECIFIC_EXTENSION', reusableProducts: freezeArray(['MULTI_PROPERTY_FINANCIAL_BREAKEVEN', 'INVESTMENT_PROPERTY_ANALYSIS']) },
  ]);
}

export function buildSellerPricingPositioningDecisionFramework(): SellerPricingFramework {
  const bands = searchBands();
  const builtScenarios = scenarios(bands);
  return Object.freeze({
    status: SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_STATUS,
    version: SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION,
    scenarioVersion: SELLER_PRICING_SCENARIO_VERSION,
    sellerBriefVersion: SELLER_DECISION_BRIEF_V2_VERSION,
    sellerBriefStatus: SELLER_DECISION_BRIEF_V2_STATUS,
    route: '/agent/prepare/seller/presentation',
    objectives: objectives(),
    currentContext: currentContext(bands),
    tradeoffs: tradeoffs(),
    positioningThemes: positioningThemes(),
    scenarios: builtScenarios,
    responseCheckpoints: checkpoints(),
    reassessmentTriggers: reassessmentTriggers(),
    sellerDecision: sellerDecision(),
    modules: modules(),
    questionCoverage: questionCoverage(),
    evidenceReferences: evidenceReferences(),
    evidenceLineage: freezeArray(['PROPERTY FACT', 'CURRENT MARKET', 'CURRENT COMPETITION', 'SEARCH BAND', 'PRICE OPTION', 'POSITIONING EFFECT', 'AGENT RATIONALE', 'SELLER DECISION']),
    v2Integration: v2Integration(),
    productFamilyReuse: productFamilyReuse(),
    fixtureResult: Object.freeze({
      fixtureId: 'SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_V1_FIXTURE',
      productVersion: SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION,
      cohortVersion: ATLAS_COHORT_CONTRACT_VERSION,
      competitionVersion: CURRENT_COMPETING_LISTING_CONTEXT_VERSION,
      searchBandVersion: SELLER_PRICING_SEARCH_BAND_VERSION,
      priceScenarioVersions: freezeArray(builtScenarios.map((scenarioItem) => `${scenarioItem.id}:${scenarioItem.version}`)),
      selectedScenario: 'seller-pricing-scenario-balance',
      agentRationaleVersion: SELLER_PRICING_AGENT_RATIONALE_VERSION,
      sellerDecisionVersion: SELLER_PRICING_DECISION_VERSION,
      financialLinkVersion: SELLER_PRICING_FINANCIAL_LINK_VERSION,
      overallReadiness: 'READY_FOR_AGENT_REVIEW',
    }),
    readiness: Object.freeze({
      domainComposition: 'CERTIFIED',
      pricingObjective: 'IMPLEMENTED_AGENT_REVIEW_REQUIRED',
      currentPricingContext: 'IMPLEMENTED_POINT_IN_TIME',
      currentCompetition: 'IMPLEMENTED_CURRENT_CONTEXT_ONLY',
      searchBands: 'IMPLEMENTED_AGENT_DEFINED_VERSIONED',
      priceOptions: 'IMPLEMENTED_AGENT_AUTHORED',
      positioningEffect: 'IMPLEMENTED_DESCRIPTIVE',
      tradeoffs: 'IMPLEMENTED',
      agentPricingRationale: 'IMPLEMENTED_AGENT_AUTHORED',
      responseCheckpoints: 'IMPLEMENTED',
      reassessment: 'IMPLEMENTED',
      sellerPricingDecision: 'IMPLEMENTED_SESSION_SAFE',
      financialBridge: 'IMPLEMENTED_VERSION_REVIEW_SEAM',
      evidence: 'PARTIAL_WITH_EXPLICIT_GATES',
      rights: 'AGENT_INTERNAL_AND_REVIEW_GATED',
      freshness: 'POINT_IN_TIME_AND_REVIEW_GATED',
      agentReview: 'IMPLEMENTED',
      sellerPreview: 'IMPLEMENTED',
      printPreview: 'FOUNDATION_IMPLEMENTED',
      postLaunchResponseIntelligence: 'NEXT_GATE',
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
      postLaunchRuntime: false,
    }),
    nextGate: SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_NEXT_GATE,
    productStatus: SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_PRODUCT_STATUS,
  });
}

export const SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_FIXTURE =
  buildSellerPricingPositioningDecisionFramework();
