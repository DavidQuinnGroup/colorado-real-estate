import {
  type AtlasOutputEvidenceReference,
  type AtlasOutputFreshnessState,
  type AtlasOutputReviewState,
  type AtlasOutputRightsState,
} from './sharedOutputProductComposition';
import {
  buildSellerDecisionBriefCompositionPreview,
  SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_STATUS,
  SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION,
  type SellerDecisionBriefDensity,
  type SellerDecisionBriefReadinessState,
  type SellerDecisionBriefSectionPresentation,
  type SellerDecisionBriefVisualComponentName,
} from './sellerDecisionBriefCompositionPreview';
import {
  SELLER_DECISION_BRIEF_CONTENT_VERSION,
  type SellerDecisionBriefContentClassification,
  type SellerDecisionBriefSectionId,
} from './sellerDecisionBriefFoundation';

export const SELLER_DECISION_BRIEF_V2_STATUS = 'SELLER_DECISION_BRIEF_V2_CERTIFIED' as const;
export const SELLER_DECISION_BRIEF_V2_VERSION = 'SELLER_DECISION_BRIEF_V2' as const;
export const SELLER_DECISION_BRIEF_NARRATIVE_VERSION = 'SELLER_DECISION_BRIEF_NARRATIVE_V1' as const;
export const SELLER_DECISION_BRIEF_STRATEGY_VERSION = 'SELLER_DECISION_BRIEF_STRATEGY_V1' as const;
export const SELLER_DECISION_BRIEF_V2_NEXT_GATE = 'READY_FOR_SELLER_PRICING_POSITIONING_DECISION_ARCHITECTURE' as const;
export const SELLER_DECISION_BRIEF_V2_PRODUCT_STATUS =
  'SELLER_DECISION_BRIEF_V2_NARRATIVE_STRATEGY_DEPTH_CERTIFIED_PRICING_FINANCIAL_PDF_SHARE_HELD' as const;

export const SELLER_DECISION_BRIEF_NARRATIVE_KINDS = [
  'EXECUTIVE_SUMMARY',
  'PROPERTY_STORY',
  'LOCATION_STORY',
  'MARKET_INTERPRETATION',
  'COMPETITION_INTERPRETATION',
  'POSITIONING_INTERPRETATION',
  'PREPARATION_RATIONALE',
  'LAUNCH_STRATEGY',
  'RECOMMENDATION_RATIONALE',
  'ALTERNATIVE_STRATEGY',
  'NEXT_DECISION',
  'SECTION_TRANSITION',
  'EVIDENCE_EXPLANATION',
] as const;

export type SellerDecisionBriefNarrativeKind = (typeof SELLER_DECISION_BRIEF_NARRATIVE_KINDS)[number];
export type SellerDecisionBriefNarrativeReadiness =
  | SellerDecisionBriefReadinessState
  | 'NARRATIVE_READY_FOR_AGENT_REVIEW'
  | 'STRATEGY_REVIEW_REQUIRED'
  | 'RECOMMENDATION_REVIEW_REQUIRED';

export type SellerDecisionBriefAgentAuthorship = Readonly<{
  required: boolean;
  authorIdentity: 'PROJECT_ATLAS_REFERENCE_AGENT';
  authoredAt: string;
  updatedAt: string;
  reviewState: AtlasOutputReviewState;
  editState: 'SESSION_SAFE_REVIEW_ONLY';
}>;

export type SellerDecisionBriefNarrativeUnit = Readonly<{
  id: string;
  kind: SellerDecisionBriefNarrativeKind;
  product: 'SELLER_PRESENTATION';
  sectionId: SellerDecisionBriefSectionId;
  moduleIds: readonly string[];
  audience: 'SELLER';
  headline: string;
  summary: string;
  points: readonly string[];
  sourceFactReferences: readonly string[];
  atlasIntelligenceReferences: readonly string[];
  analysisReferences: readonly string[];
  agentInputReferences: readonly string[];
  evidenceReferenceIds: readonly string[];
  asOf: string;
  freshness: AtlasOutputFreshnessState;
  rights: AtlasOutputRightsState;
  limitations: readonly string[];
  classification: SellerDecisionBriefContentClassification;
  agentAuthorship: SellerDecisionBriefAgentAuthorship;
  readiness: SellerDecisionBriefNarrativeReadiness;
  density: SellerDecisionBriefDensity;
  version: typeof SELLER_DECISION_BRIEF_NARRATIVE_VERSION;
}>;

export type SellerDecisionBriefSectionTransition = Readonly<{
  id: string;
  fromSectionId: SellerDecisionBriefSectionId;
  toSectionId: SellerDecisionBriefSectionId;
  sellerQuestion: string;
  bridgeMessage: string;
  supportingContext: readonly string[];
  evidenceReferenceIds: readonly string[];
  reviewState: AtlasOutputReviewState;
}>;

export type SellerDecisionBriefDifferentiator = Readonly<{
  id: string;
  differentiator: string;
  type: 'LEAD' | 'SUPPORT' | 'CONTEXT';
  sourceFact: string;
  agentInterpretation: string;
  buyerRelevance: string;
  evidenceReferenceIds: readonly string[];
  reviewState: AtlasOutputReviewState;
}>;

export type SellerDecisionBriefStrategyAlternative = Readonly<{
  id: string;
  name: string;
  objective: string;
  whatChanges: string;
  potentialAdvantages: readonly string[];
  tradeoffs: readonly string[];
  dependencies: readonly string[];
  evidenceReferenceIds: readonly string[];
  agentCommentary: string;
}>;

export type SellerDecisionBriefStrategyElement = Readonly<{
  id: 'POSITIONING' | 'PREPARATION' | 'LAUNCH' | 'RECOMMENDATION';
  objective: string;
  inputs: readonly string[];
  evidenceReferenceIds: readonly string[];
  agentRationale: string;
  alternatives: readonly string[];
  reviewState: AtlasOutputReviewState;
  readiness: SellerDecisionBriefNarrativeReadiness;
}>;

export type SellerDecisionBriefRecommendationEvidenceMap = Readonly<{
  recommendationElement: string;
  property: readonly string[];
  location: readonly string[];
  market: readonly string[];
  competition: readonly string[];
  agentInput: readonly string[];
  handoff: readonly string[];
}>;

export type SellerDecisionBriefNextDecision = Readonly<{
  id: string;
  decision: string;
  whyItMatters: string;
  recommendationReference: string;
  owner: 'AGENT_AND_SELLER';
  targetDate: string;
  dependency: string;
  status: 'AGENT_INPUT_REQUIRED' | 'READY_FOR_AGENT_REVIEW';
  nextAction: string;
}>;

export type SellerDecisionBriefStoryLayer = Readonly<{
  layer: string;
  primaryQuestion: string;
  narrativeId: string;
  supportingIntelligence: readonly string[];
  agentInterpretation: string;
  nextDecisionId: string | null;
}>;

export type SellerDecisionBriefProductFamilyReuse = Readonly<{
  primitive: string;
  classification: 'DIRECTLY_REUSABLE' | 'AUDIENCE_TRANSFORMABLE' | 'PRODUCT_SPECIFIC_EXTENSION';
  reusableProducts: readonly string[];
}>;

export type SellerDecisionBriefV1ToV2Trace = Readonly<{
  v1ModuleId: string;
  v2Extension: string;
  newDepth: string;
  sellerValue: string;
  agentValue: string;
}>;

export type SellerDecisionBriefV2 = Readonly<{
  status: typeof SELLER_DECISION_BRIEF_V2_STATUS;
  version: typeof SELLER_DECISION_BRIEF_V2_VERSION;
  narrativeVersion: typeof SELLER_DECISION_BRIEF_NARRATIVE_VERSION;
  strategyVersion: typeof SELLER_DECISION_BRIEF_STRATEGY_VERSION;
  baseV1Version: typeof SELLER_DECISION_BRIEF_CONTENT_VERSION;
  compositionPreviewVersion: typeof SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION;
  compositionPreviewStatus: typeof SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_STATUS;
  route: '/agent/prepare/seller/presentation';
  productTitle: 'Seller Decision Brief V2';
  sectionPresentations: readonly SellerDecisionBriefSectionPresentation[];
  narratives: readonly SellerDecisionBriefNarrativeUnit[];
  differentiators: readonly SellerDecisionBriefDifferentiator[];
  sectionTransitions: readonly SellerDecisionBriefSectionTransition[];
  strategyElements: readonly SellerDecisionBriefStrategyElement[];
  alternatives: readonly SellerDecisionBriefStrategyAlternative[];
  recommendationEvidenceMap: SellerDecisionBriefRecommendationEvidenceMap;
  nextDecisions: readonly SellerDecisionBriefNextDecision[];
  storyLayers: readonly SellerDecisionBriefStoryLayer[];
  productFamilyReuse: readonly SellerDecisionBriefProductFamilyReuse[];
  v1ToV2Trace: readonly SellerDecisionBriefV1ToV2Trace[];
  questionCoverageV2: readonly Readonly<{
    question: string;
    sectionId: SellerDecisionBriefSectionId;
    narrativeId: string;
    evidenceReferenceIds: readonly string[];
    agentInputRequired: boolean;
    coverage: 'STRONG' | 'ADEQUATE' | 'PARTIAL' | 'INPUT_REQUIRED';
  }>[];
  readiness: Readonly<{
    product: AtlasOutputReviewState;
    content: 'V2_NARRATIVE_STRATEGY_DEPTH_IMPLEMENTED';
    narrative: 'EVIDENCE_LINKED_AGENT_REVIEW_REQUIRED';
    propertyStory: 'IMPLEMENTED';
    locationStory: 'IMPLEMENTED';
    marketInterpretation: 'IMPLEMENTED';
    competitionInterpretation: 'IMPLEMENTED';
    positioning: 'IMPLEMENTED_AGENT_INPUT_REQUIRED';
    preparationStrategy: 'IMPLEMENTED_AGENT_INPUT_REQUIRED';
    launchStrategy: 'IMPLEMENTED_AGENT_INPUT_REQUIRED';
    recommendation: 'IMPLEMENTED_AGENT_RECOMMENDATION_REVIEW_REQUIRED';
    alternatives: 'IMPLEMENTED';
    nextDecisions: 'IMPLEMENTED_AGENT_INPUT_REQUIRED';
    evidence: 'PARTIAL_WITH_EXPLICIT_GATES';
    rights: 'AGENT_INTERNAL_AND_REVIEW_GATED';
    freshness: 'POINT_IN_TIME_AND_REVIEW_GATED';
    agentReview: 'IMPLEMENTED';
    sellerPreview: 'IMPLEMENTED';
    printPreview: 'FOUNDATION_IMPLEMENTED';
    pdf: 'NOT_IMPLEMENTED';
    shareDelivery: 'NOT_IMPLEMENTED';
    financialDecisionPreparation: 'SEPARATE_FOUNDATION_NOT_INTEGRATED';
    pricingDecisionArchitecture: 'NEXT_GATE';
  }>;
  protectedBoundaries: Readonly<{
    persistenceAuthorization: false;
    providerRuntime: false;
    customerMutation: false;
    crmMutation: false;
    emailOrMessageExecution: false;
    pdfGeneration: false;
    shareDelivery: false;
    automatedPricingRecommendation: false;
    automatedStrategyRecommendation: false;
  }>;
  nextGate: typeof SELLER_DECISION_BRIEF_V2_NEXT_GATE;
  productStatus: typeof SELLER_DECISION_BRIEF_V2_PRODUCT_STATUS;
}>;

function unique(values: readonly string[]) {
  return Object.freeze([...new Set(values.map((value) => value.trim()).filter(Boolean))]);
}

function authored(required: boolean): SellerDecisionBriefAgentAuthorship {
  return Object.freeze({
    required,
    authorIdentity: 'PROJECT_ATLAS_REFERENCE_AGENT',
    authoredAt: '2026-08-27T00:00:00.000Z',
    updatedAt: '2026-08-27T00:00:00.000Z',
    reviewState: 'AGENT_REVIEW_REQUIRED',
    editState: 'SESSION_SAFE_REVIEW_ONLY',
  });
}

function evidence(previewEvidence: readonly AtlasOutputEvidenceReference[], ids: readonly string[]) {
  const found = ids
    .map((id) => previewEvidence.find((item) => item.id === id))
    .filter((item): item is AtlasOutputEvidenceReference => Boolean(item));
  return {
    freshness: found.some((item) => item.freshnessState === 'UNKNOWN_REVIEW_REQUIRED') ? 'UNKNOWN_REVIEW_REQUIRED' as const
      : found.some((item) => item.freshnessState === 'DATED_DURABLE_CONTEXT') ? 'DATED_DURABLE_CONTEXT' as const
        : found[0]?.freshnessState ?? 'POINT_IN_TIME' as const,
    rights: found.some((item) => item.rightsState === 'REQUIRES_REVIEW') ? 'REQUIRES_REVIEW' as const : found[0]?.rightsState ?? 'ADMITTED_FOR_AGENT_INTERNAL' as const,
    asOf: found.find((item) => item.asOf)?.asOf ?? '2026-08-27',
    limitations: unique(found.flatMap((item) => item.limitations)),
  };
}

function narrative(
  previewEvidence: readonly AtlasOutputEvidenceReference[],
  input: Omit<SellerDecisionBriefNarrativeUnit, 'product' | 'audience' | 'asOf' | 'freshness' | 'rights' | 'limitations' | 'agentAuthorship' | 'version'> & Readonly<{
    agentAuthorshipRequired: boolean;
    limitations?: readonly string[];
  }>,
): SellerDecisionBriefNarrativeUnit {
  const evidenceState = evidence(previewEvidence, input.evidenceReferenceIds);
  return Object.freeze({
    ...input,
    product: 'SELLER_PRESENTATION',
    audience: 'SELLER',
    sourceFactReferences: unique(input.sourceFactReferences),
    atlasIntelligenceReferences: unique(input.atlasIntelligenceReferences),
    analysisReferences: unique(input.analysisReferences),
    agentInputReferences: unique(input.agentInputReferences),
    evidenceReferenceIds: unique(input.evidenceReferenceIds),
    points: Object.freeze([...input.points]),
    asOf: evidenceState.asOf,
    freshness: evidenceState.freshness,
    rights: evidenceState.rights,
    limitations: unique([...(input.limitations ?? []), ...evidenceState.limitations]),
    agentAuthorship: authored(input.agentAuthorshipRequired),
    version: SELLER_DECISION_BRIEF_NARRATIVE_VERSION,
  });
}

function moduleIds(section: SellerDecisionBriefSectionPresentation) {
  return section.modules.map((item) => item.module.id);
}

function section(preview: ReturnType<typeof buildSellerDecisionBriefCompositionPreview>, sectionId: SellerDecisionBriefSectionId) {
  const found = preview.sectionPresentations.find((item) => item.sectionId === sectionId);
  if (!found) throw new Error(`Missing Seller V2 section ${sectionId}`);
  return found;
}

function narratives(preview: ReturnType<typeof buildSellerDecisionBriefCompositionPreview>): readonly SellerDecisionBriefNarrativeUnit[] {
  const evidenceReferences = preview.brief.outputProduct.evidenceReferences;
  const executive = section(preview, 'seller-brief-executive-summary');
  const property = section(preview, 'seller-brief-property');
  const location = section(preview, 'seller-brief-location');
  const market = section(preview, 'seller-brief-market');
  const competition = section(preview, 'seller-brief-competition');
  const positioning = section(preview, 'seller-brief-positioning');
  const preparation = section(preview, 'seller-brief-preparation');
  const launch = section(preview, 'seller-brief-launch');
  const recommendation = section(preview, 'seller-brief-recommendations');
  const nextDecisions = section(preview, 'seller-brief-next-decisions');
  const appendix = section(preview, 'seller-brief-evidence-appendix');

  return Object.freeze([
    narrative(evidenceReferences, {
      id: 'seller-v2-executive-summary',
      kind: 'EXECUTIVE_SUMMARY',
      sectionId: executive.sectionId,
      moduleIds: moduleIds(executive),
      headline: 'The decision is how to prepare, position, and launch this property with evidence visible before seller use.',
      summary: 'V2 synthesizes seller objectives, property strengths, location context, market conditions, competition, strategy, recommendation, alternatives, and next decisions.',
      points: ['Clarify seller objectives before strategy language is used.', 'Use property, location, market, and competition evidence as support, not as automated conclusions.', 'Keep Agent interpretation and recommendation visibly human-authored.'],
      sourceFactReferences: ['seller-subject-property-facts'],
      atlasIntelligenceReferences: ['seller-market-context'],
      analysisReferences: ['current-competing-listing-context-wave-6'],
      agentInputReferences: ['agent-decision-summary', 'agent-recommendation-card'],
      evidenceReferenceIds: ['seller-objectives', 'seller-subject-property-facts', 'seller-market-context', 'seller-competitive-facts', 'seller-recommendation-support'],
      classification: 'AGENT_INTERPRETATION',
      readiness: 'NARRATIVE_READY_FOR_AGENT_REVIEW',
      density: 'D1',
      agentAuthorshipRequired: true,
    }),
    narrative(evidenceReferences, {
      id: 'seller-v2-property-story',
      kind: 'PROPERTY_STORY',
      sectionId: property.sectionId,
      moduleIds: moduleIds(property),
      headline: 'The property story starts with verified facts and adds Agent-reviewed differentiators.',
      summary: 'The subject property is framed through identity, factual attributes, strengths, context to address, and verification questions.',
      points: ['Use admitted property facts as the source-fact layer.', 'Separate differentiators into lead, support, and context groups.', 'Treat condition and improvement claims as review-gated until evidence is supplied.'],
      sourceFactReferences: ['property-preparation', 'seller-update-preparation'],
      atlasIntelligenceReferences: ['seller-subject-property-facts'],
      analysisReferences: [],
      agentInputReferences: ['agent-property-strengths'],
      evidenceReferenceIds: ['seller-subject-property-facts', 'seller-source-timestamp-posture', 'seller-condition-improvement-evidence'],
      classification: 'AGENT_INTERPRETATION',
      readiness: 'EVIDENCE_REQUIRED',
      density: 'D2',
      agentAuthorshipRequired: true,
    }),
    narrative(evidenceReferences, {
      id: 'seller-v2-location-story',
      kind: 'LOCATION_STORY',
      sectionId: location.sectionId,
      moduleIds: moduleIds(location),
      headline: 'Location explains context, access, and place relevance without making unsupported desirability claims.',
      summary: 'The location story connects admitted place context to the property story and identifies questions that need address-specific review.',
      points: ['Use place preparation as durable context.', 'Connect location context to buyer understanding through Agent interpretation.', 'Avoid safety, school-quality, protected-class, or steering conclusions.'],
      sourceFactReferences: ['place-preparation'],
      atlasIntelligenceReferences: ['seller-location-context'],
      analysisReferences: [],
      agentInputReferences: ['agent-location-story'],
      evidenceReferenceIds: ['seller-location-context'],
      classification: 'AGENT_INTERPRETATION',
      readiness: 'AGENT_INPUT_REQUIRED',
      density: 'D2',
      agentAuthorshipRequired: true,
    }),
    narrative(evidenceReferences, {
      id: 'seller-v2-market-interpretation',
      kind: 'MARKET_INTERPRETATION',
      sectionId: market.sectionId,
      moduleIds: moduleIds(market),
      headline: 'The current market snapshot frames available choice and timing questions.',
      summary: 'Market context is interpreted as a point-in-time preparation input that helps the Agent decide what to verify before using strategy language.',
      points: ['Name the cohort and as-of posture.', 'Explain what current metrics can and cannot support.', 'Keep pricing, timing, and negotiation conclusions out of automated output.'],
      sourceFactReferences: ['market-preparation'],
      atlasIntelligenceReferences: ['seller-market-context'],
      analysisReferences: ['atlas-cohort-comparative-contract'],
      agentInputReferences: ['agent-market-interpretation'],
      evidenceReferenceIds: ['seller-market-context'],
      classification: 'AGENT_INTERPRETATION',
      readiness: 'AGENT_REVIEW_REQUIRED',
      density: 'D2',
      agentAuthorshipRequired: true,
    }),
    narrative(evidenceReferences, {
      id: 'seller-v2-competition-interpretation',
      kind: 'COMPETITION_INTERPRETATION',
      sectionId: competition.sectionId,
      moduleIds: moduleIds(competition),
      headline: 'Competition is framed as buyer choice context, not ranking or scoring.',
      summary: 'Current competing listing context helps the Agent explain what buyers may compare and where the subject may need positioning support.',
      points: ['Anchor the subject against current buyer alternatives.', 'Name differences as factual or Agent-interpreted.', 'Keep comparable selection, ranking, and scoring outside V2.'],
      sourceFactReferences: ['current-competing-listing-context-wave-6'],
      atlasIntelligenceReferences: ['seller-competitive-facts'],
      analysisReferences: ['current-competing-listing-context-wave-6', 'atlas-cohort-comparative-contract'],
      agentInputReferences: ['agent-competition-themes'],
      evidenceReferenceIds: ['seller-competitive-facts', 'seller-subject-property-facts'],
      classification: 'ATLAS_ANALYSIS_REFERENCE',
      readiness: 'NARRATIVE_READY_FOR_AGENT_REVIEW',
      density: 'D3',
      agentAuthorshipRequired: true,
    }),
    narrative(evidenceReferences, {
      id: 'seller-v2-positioning-interpretation',
      kind: 'POSITIONING_INTERPRETATION',
      sectionId: positioning.sectionId,
      moduleIds: moduleIds(positioning),
      headline: 'Positioning should lead with verified strengths and address context before launch.',
      summary: 'The positioning layer translates property, location, market, and competition evidence into Agent-authored themes.',
      points: ['Lead with differentiators that have evidence support.', 'Support with context where evidence is partial.', 'Address likely buyer comparison points before launch.'],
      sourceFactReferences: ['seller-subject-property-facts'],
      atlasIntelligenceReferences: ['seller-market-context', 'seller-competitive-facts'],
      analysisReferences: ['current-competing-listing-context-wave-6'],
      agentInputReferences: ['agent-positioning-themes'],
      evidenceReferenceIds: ['seller-subject-property-facts', 'seller-location-context', 'seller-market-context', 'seller-competitive-facts'],
      classification: 'AGENT_INTERPRETATION',
      readiness: 'AGENT_INPUT_REQUIRED',
      density: 'D2',
      agentAuthorshipRequired: true,
    }),
    narrative(evidenceReferences, {
      id: 'seller-v2-preparation-rationale',
      kind: 'PREPARATION_RATIONALE',
      sectionId: preparation.sectionId,
      moduleIds: moduleIds(preparation),
      headline: 'Preparation work should make the property easier to verify, present, and explain.',
      summary: 'The preparation rationale organizes verification, staging, documentation, and professional handoff items around seller decisions.',
      points: ['Identify actions by purpose, timing, owner, and dependency.', 'Treat condition and improvement evidence as missing until supplied.', 'Route professional questions to the proper handoff.'],
      sourceFactReferences: ['seller-preparation', 'property-preparation'],
      atlasIntelligenceReferences: ['seller-document-verification'],
      analysisReferences: ['professional-handoff'],
      agentInputReferences: ['agent-preparation-plan'],
      evidenceReferenceIds: ['seller-condition-improvement-evidence', 'seller-document-verification'],
      classification: 'AGENT_INTERPRETATION',
      readiness: 'EVIDENCE_REQUIRED',
      density: 'D3',
      agentAuthorshipRequired: true,
    }),
    narrative(evidenceReferences, {
      id: 'seller-v2-launch-strategy',
      kind: 'LAUNCH_STRATEGY',
      sectionId: launch.sectionId,
      moduleIds: moduleIds(launch),
      headline: 'The launch strategy should turn the property story into an ordered plan.',
      summary: 'Launch depth connects asset priorities, exposure plan, timing, first-week review, dependencies, and Agent rationale.',
      points: ['Use the property story and asset plan as launch inputs.', 'Keep channel and timing choices Agent-authored.', 'Include first-week feedback and review checkpoint seams.'],
      sourceFactReferences: ['seller-preparation'],
      atlasIntelligenceReferences: ['seller-asset-readiness', 'seller-launch-plan'],
      analysisReferences: [],
      agentInputReferences: ['agent-property-story', 'agent-asset-plan', 'agent-launch-plan'],
      evidenceReferenceIds: ['seller-subject-property-facts', 'seller-location-context', 'seller-asset-readiness', 'seller-launch-plan'],
      classification: 'AGENT_INTERPRETATION',
      readiness: 'AGENT_INPUT_REQUIRED',
      density: 'D3',
      agentAuthorshipRequired: true,
    }),
    narrative(evidenceReferences, {
      id: 'seller-v2-recommendation-rationale',
      kind: 'RECOMMENDATION_RATIONALE',
      sectionId: recommendation.sectionId,
      moduleIds: moduleIds(recommendation),
      headline: 'The recommendation must state the decision, rationale, evidence, alternatives, tradeoffs, and next action.',
      summary: 'Recommendation depth is explicitly Agent-authored and supported by a deterministic evidence map across property, location, market, competition, preparation, launch, and handoffs.',
      points: ['State the decision addressed.', 'Map supporting evidence by domain.', 'Show alternatives and tradeoffs before asking for the next seller decision.'],
      sourceFactReferences: ['seller-subject-property-facts'],
      atlasIntelligenceReferences: ['seller-market-context', 'seller-competitive-facts'],
      analysisReferences: ['current-competing-listing-context-wave-6', 'professional-handoff'],
      agentInputReferences: ['agent-recommendation-card'],
      evidenceReferenceIds: ['seller-recommendation-support', 'seller-subject-property-facts', 'seller-location-context', 'seller-market-context', 'seller-competitive-facts', 'seller-document-verification'],
      classification: 'AGENT_RECOMMENDATION',
      readiness: 'RECOMMENDATION_REVIEW_REQUIRED',
      density: 'D1',
      agentAuthorshipRequired: true,
    }),
    narrative(evidenceReferences, {
      id: 'seller-v2-alternative-strategy',
      kind: 'ALTERNATIVE_STRATEGY',
      sectionId: recommendation.sectionId,
      moduleIds: moduleIds(recommendation),
      headline: 'Alternatives make the recommendation reviewable instead of one-directional.',
      summary: 'V2 represents alternate strategy paths with objective, change, advantages, tradeoffs, dependencies, evidence, and Agent commentary.',
      points: ['Compare preparation-led, launch-led, and review-first options.', 'Name tradeoffs without predicting outcome.', 'Keep alternatives reusable for future pricing and financial scenarios.'],
      sourceFactReferences: ['seller-subject-property-facts'],
      atlasIntelligenceReferences: ['seller-market-context'],
      analysisReferences: ['current-competing-listing-context-wave-6'],
      agentInputReferences: ['agent-alternative-strategy'],
      evidenceReferenceIds: ['seller-subject-property-facts', 'seller-market-context', 'seller-competitive-facts'],
      classification: 'AGENT_INTERPRETATION',
      readiness: 'STRATEGY_REVIEW_REQUIRED',
      density: 'D2',
      agentAuthorshipRequired: true,
    }),
    narrative(evidenceReferences, {
      id: 'seller-v2-next-decision',
      kind: 'NEXT_DECISION',
      sectionId: nextDecisions.sectionId,
      moduleIds: moduleIds(nextDecisions),
      headline: 'Next decisions connect the recommendation to seller action.',
      summary: 'The next-decision layer records decision, owner, target date, dependency, status, recommendation reference, and next action.',
      points: ['Ask the seller to confirm the strategy direction.', 'Resolve evidence and preparation dependencies.', 'Schedule the next review checkpoint.'],
      sourceFactReferences: ['seller-preparation'],
      atlasIntelligenceReferences: ['seller-next-decisions'],
      analysisReferences: ['professional-handoff'],
      agentInputReferences: ['agent-next-decisions', 'agent-seller-journey'],
      evidenceReferenceIds: ['seller-next-decisions', 'seller-journey-plan', 'seller-recommendation-support'],
      classification: 'AGENT_INTERPRETATION',
      readiness: 'AGENT_INPUT_REQUIRED',
      density: 'D1',
      agentAuthorshipRequired: true,
    }),
    narrative(evidenceReferences, {
      id: 'seller-v2-section-transition',
      kind: 'SECTION_TRANSITION',
      sectionId: executive.sectionId,
      moduleIds: moduleIds(executive),
      headline: 'The brief should progress from objectives to evidence-backed action.',
      summary: 'Section transitions connect each module family into a single Seller decision story.',
      points: ['Bridge from objectives to property.', 'Bridge from evidence to strategy.', 'Bridge from recommendation to next decision.'],
      sourceFactReferences: ['seller-preparation'],
      atlasIntelligenceReferences: ['shared-output-product-evidence-interface'],
      analysisReferences: [],
      agentInputReferences: ['agent-evidence-review'],
      evidenceReferenceIds: ['seller-objectives', 'seller-subject-property-facts', 'seller-market-context', 'seller-recommendation-support'],
      classification: 'AGENT_INTERPRETATION',
      readiness: 'NARRATIVE_READY_FOR_AGENT_REVIEW',
      density: 'D2',
      agentAuthorshipRequired: true,
    }),
    narrative(evidenceReferences, {
      id: 'seller-v2-evidence-explanation',
      kind: 'EVIDENCE_EXPLANATION',
      sectionId: appendix.sectionId,
      moduleIds: moduleIds(appendix),
      headline: 'The evidence appendix explains source, as-of, rights, freshness, assumptions, and limitations.',
      summary: 'Evidence explanation remains visible so seller-facing narrative can be audited before authorized output.',
      points: ['Show source and as-of where available.', 'Name missing evidence and rights/freshness review.', 'Separate professional handoff topics from Agent commentary.'],
      sourceFactReferences: ['shared-output-product-evidence-interface'],
      atlasIntelligenceReferences: ['seller-source-timestamp-posture'],
      analysisReferences: ['professional-handoff'],
      agentInputReferences: ['agent-evidence-review'],
      evidenceReferenceIds: ['seller-subject-property-facts', 'seller-source-timestamp-posture', 'seller-market-context', 'seller-competitive-facts', 'seller-condition-improvement-evidence', 'seller-financial-preparation'],
      classification: 'LIMITATION',
      readiness: 'FRESHNESS_REQUIRED',
      density: 'D4',
      agentAuthorshipRequired: false,
    }),
  ]);
}

function transitions(): readonly SellerDecisionBriefSectionTransition[] {
  const flow: readonly [SellerDecisionBriefSectionId, SellerDecisionBriefSectionId, string, string, readonly string[], readonly string[]][] = [
    ['seller-brief-executive-summary', 'seller-brief-context', 'What are we trying to accomplish?', 'Start by making the seller objective explicit before property or market detail changes the discussion.', ['seller-v2-executive-summary'], ['seller-objectives']],
    ['seller-brief-context', 'seller-brief-property', 'What makes my property distinctive?', 'Move from seller goals to the factual property story and the strengths that need Agent review.', ['seller-v2-property-story'], ['seller-subject-property-facts']],
    ['seller-brief-property', 'seller-brief-location', 'How does my location shape the sale?', 'Connect the physical property to the place context that may shape buyer understanding.', ['seller-v2-location-story'], ['seller-location-context']],
    ['seller-brief-location', 'seller-brief-market', 'What market are we entering?', 'Use location and property context to frame the current market snapshot.', ['seller-v2-market-interpretation'], ['seller-market-context']],
    ['seller-brief-market', 'seller-brief-competition', 'What choices will buyers see?', 'Translate the market snapshot into the current buyer choice set without ranking or scoring.', ['seller-v2-competition-interpretation'], ['seller-competitive-facts']],
    ['seller-brief-competition', 'seller-brief-positioning', 'Where does my property stand out?', 'Use buyer-choice context to choose positioning themes for Agent review.', ['seller-v2-positioning-interpretation'], ['seller-subject-property-facts', 'seller-competitive-facts']],
    ['seller-brief-positioning', 'seller-brief-preparation', 'What requires context?', 'Turn positioning questions into preparation and verification actions.', ['seller-v2-preparation-rationale'], ['seller-condition-improvement-evidence', 'seller-document-verification']],
    ['seller-brief-preparation', 'seller-brief-launch', 'How should we present and launch?', 'Convert preparation priorities into a launch plan and asset strategy.', ['seller-v2-launch-strategy'], ['seller-asset-readiness', 'seller-launch-plan']],
    ['seller-brief-launch', 'seller-brief-recommendations', 'What strategy does my Agent recommend?', 'Move from launch options to the Agent-authored recommendation and evidence map.', ['seller-v2-recommendation-rationale'], ['seller-recommendation-support']],
    ['seller-brief-recommendations', 'seller-brief-next-decisions', 'What do I need to decide next?', 'Convert recommendation, alternatives, and tradeoffs into concrete seller decisions.', ['seller-v2-next-decision'], ['seller-next-decisions']],
    ['seller-brief-next-decisions', 'seller-brief-evidence-appendix', 'What evidence supports this?', 'Close by making the source, as-of, rights, freshness, and limitation record visible.', ['seller-v2-evidence-explanation'], ['seller-source-timestamp-posture']],
  ];
  return Object.freeze(flow.map(([fromSectionId, toSectionId, sellerQuestion, bridgeMessage, supportingContext, evidenceReferenceIds], index) => Object.freeze({
    id: `seller-v2-transition-${index + 1}`,
    fromSectionId,
    toSectionId,
    sellerQuestion,
    bridgeMessage,
    supportingContext: Object.freeze([...supportingContext]),
    evidenceReferenceIds: Object.freeze([...evidenceReferenceIds]),
    reviewState: 'AGENT_REVIEW_REQUIRED' as const,
  })));
}

function differentiators(): readonly SellerDecisionBriefDifferentiator[] {
  return Object.freeze([
    {
      id: 'seller-v2-differentiator-lead-property',
      differentiator: 'Verified property facts can anchor the first story before subjective positioning is added.',
      type: 'LEAD',
      sourceFact: 'Subject property facts',
      agentInterpretation: 'Lead with the facts that are easiest for buyers and the seller to verify.',
      buyerRelevance: 'The buyer can understand the property quickly before deeper context is introduced.',
      evidenceReferenceIds: Object.freeze(['seller-subject-property-facts']),
      reviewState: 'AGENT_REVIEW_REQUIRED',
    },
    {
      id: 'seller-v2-differentiator-support-location',
      differentiator: 'Location context can support the property story when address-specific claims are reviewed.',
      type: 'SUPPORT',
      sourceFact: 'Place preparation context',
      agentInterpretation: 'Use location as support, not as a desirability or steering conclusion.',
      buyerRelevance: 'The buyer receives context for how the property sits in its local environment.',
      evidenceReferenceIds: Object.freeze(['seller-location-context']),
      reviewState: 'AGENT_REVIEW_REQUIRED',
    },
    {
      id: 'seller-v2-differentiator-context-condition',
      differentiator: 'Condition and improvement claims require more evidence before they lead the story.',
      type: 'CONTEXT',
      sourceFact: 'Condition evidence missing',
      agentInterpretation: 'Address this before launch so the presentation does not overstate unsupported attributes.',
      buyerRelevance: 'The buyer can see a more complete and credible property presentation after verification.',
      evidenceReferenceIds: Object.freeze(['seller-condition-improvement-evidence']),
      reviewState: 'AGENT_REVIEW_REQUIRED',
    },
  ]);
}

function alternatives(): readonly SellerDecisionBriefStrategyAlternative[] {
  return Object.freeze([
    {
      id: 'seller-v2-alternative-preparation-led',
      name: 'Preparation-led launch',
      objective: 'Resolve evidence, documentation, and presentation dependencies before go-live.',
      whatChanges: 'More work is completed before public launch decisions are finalized.',
      potentialAdvantages: Object.freeze(['Cleaner seller story', 'More complete evidence record', 'Fewer unsupported claims']),
      tradeoffs: Object.freeze(['May require more calendar time', 'Depends on seller and professional follow-through']),
      dependencies: Object.freeze(['Condition evidence', 'Document review', 'Agent launch plan']),
      evidenceReferenceIds: Object.freeze(['seller-condition-improvement-evidence', 'seller-document-verification']),
      agentCommentary: 'Use when the property story depends on facts that still need review.',
    },
    {
      id: 'seller-v2-alternative-launch-led',
      name: 'Launch-led with explicit context',
      objective: 'Proceed with a restrained presentation while unresolved items are framed as context.',
      whatChanges: 'The brief leads with admitted facts and limits unsupported elements.',
      potentialAdvantages: Object.freeze(['Maintains momentum', 'Keeps missing evidence visible', 'Avoids overstated claims']),
      tradeoffs: Object.freeze(['Some story elements remain less developed', 'Agent must carefully manage seller expectations']),
      dependencies: Object.freeze(['Agent review', 'Seller decision on unresolved items']),
      evidenceReferenceIds: Object.freeze(['seller-subject-property-facts', 'seller-market-context', 'seller-competitive-facts']),
      agentCommentary: 'Use only if review-gated limitations remain visible.',
    },
    {
      id: 'seller-v2-alternative-review-first',
      name: 'Review-first strategy',
      objective: 'Pause strategy language until evidence, rights, and freshness review clears.',
      whatChanges: 'Strategy remains internal until the evidence record is more complete.',
      potentialAdvantages: Object.freeze(['Strongest governance posture', 'Reduces unsupported recommendation risk']),
      tradeoffs: Object.freeze(['Less seller-facing immediacy', 'May delay decision conversation']),
      dependencies: Object.freeze(['Rights review', 'Freshness review', 'Professional handoffs']),
      evidenceReferenceIds: Object.freeze(['seller-source-timestamp-posture', 'seller-recommendation-support', 'seller-financial-preparation']),
      agentCommentary: 'Use when recommendation support or source posture is not ready for seller-facing use.',
    },
  ]);
}

function strategyElements(): readonly SellerDecisionBriefStrategyElement[] {
  return Object.freeze([
    {
      id: 'POSITIONING',
      objective: 'Lead with verified differentiators and support them with property, location, market, and competition context.',
      inputs: Object.freeze(['Property story', 'Location story', 'Competition themes', 'Agent positioning themes']),
      evidenceReferenceIds: Object.freeze(['seller-subject-property-facts', 'seller-location-context', 'seller-market-context', 'seller-competitive-facts']),
      agentRationale: 'Positioning is Agent-authored because it turns evidence into emphasis and message order.',
      alternatives: Object.freeze(['seller-v2-alternative-preparation-led', 'seller-v2-alternative-launch-led']),
      reviewState: 'AGENT_REVIEW_REQUIRED',
      readiness: 'AGENT_INPUT_REQUIRED',
    },
    {
      id: 'PREPARATION',
      objective: 'Convert unsupported or incomplete context into verification, preparation, and handoff actions.',
      inputs: Object.freeze(['Condition evidence', 'Document verification questions', 'Agent preparation plan']),
      evidenceReferenceIds: Object.freeze(['seller-condition-improvement-evidence', 'seller-document-verification']),
      agentRationale: 'Preparation rationale explains why each action improves credibility, presentation, or review readiness.',
      alternatives: Object.freeze(['seller-v2-alternative-preparation-led', 'seller-v2-alternative-review-first']),
      reviewState: 'AGENT_REVIEW_REQUIRED',
      readiness: 'EVIDENCE_REQUIRED',
    },
    {
      id: 'LAUNCH',
      objective: 'Translate property story and asset priorities into launch sequence, exposure plan, timing, and first-week review.',
      inputs: Object.freeze(['Property story', 'Asset plan', 'Launch plan', 'Seller journey']),
      evidenceReferenceIds: Object.freeze(['seller-subject-property-facts', 'seller-asset-readiness', 'seller-launch-plan', 'seller-journey-plan']),
      agentRationale: 'Launch strategy is Agent-authored because timing, exposure, and asset choices require professional judgment.',
      alternatives: Object.freeze(['seller-v2-alternative-launch-led', 'seller-v2-alternative-preparation-led']),
      reviewState: 'AGENT_REVIEW_REQUIRED',
      readiness: 'AGENT_INPUT_REQUIRED',
    },
    {
      id: 'RECOMMENDATION',
      objective: 'Make the Agent recommendation auditable through rationale, evidence, alternatives, tradeoffs, dependencies, and next action.',
      inputs: Object.freeze(['Recommendation card', 'Recommendation evidence map', 'Professional handoff']),
      evidenceReferenceIds: Object.freeze(['seller-recommendation-support', 'seller-subject-property-facts', 'seller-location-context', 'seller-market-context', 'seller-competitive-facts', 'seller-document-verification']),
      agentRationale: 'The recommendation remains explicit Agent authorship and cannot be automated pricing, timing, negotiation, or outcome advice.',
      alternatives: Object.freeze(['seller-v2-alternative-preparation-led', 'seller-v2-alternative-launch-led', 'seller-v2-alternative-review-first']),
      reviewState: 'AGENT_REVIEW_REQUIRED',
      readiness: 'RECOMMENDATION_REVIEW_REQUIRED',
    },
  ]);
}

function nextDecisions(): readonly SellerDecisionBriefNextDecision[] {
  return Object.freeze([
    {
      id: 'seller-v2-next-decision-strategy-direction',
      decision: 'Confirm the preferred strategy direction.',
      whyItMatters: 'The rest of preparation and launch sequencing depends on which strategy the Agent and seller choose.',
      recommendationReference: 'seller-v2-recommendation-rationale',
      owner: 'AGENT_AND_SELLER',
      targetDate: 'Before launch plan is finalized',
      dependency: 'Agent recommendation review',
      status: 'AGENT_INPUT_REQUIRED',
      nextAction: 'Agent reviews recommendation, alternatives, and tradeoffs with the seller.',
    },
    {
      id: 'seller-v2-next-decision-evidence-resolution',
      decision: 'Resolve missing condition, improvement, and documentation evidence.',
      whyItMatters: 'The property story and preparation plan should not rely on unsupported claims.',
      recommendationReference: 'seller-v2-preparation-rationale',
      owner: 'AGENT_AND_SELLER',
      targetDate: 'Before seller-facing output authorization',
      dependency: 'Evidence and professional handoff review',
      status: 'AGENT_INPUT_REQUIRED',
      nextAction: 'Gather or verify the evidence required for the preparation plan.',
    },
    {
      id: 'seller-v2-next-decision-launch-checkpoint',
      decision: 'Choose the launch readiness checkpoint.',
      whyItMatters: 'The seller needs a clear moment to approve story, assets, timing, and review state.',
      recommendationReference: 'seller-v2-launch-strategy',
      owner: 'AGENT_AND_SELLER',
      targetDate: 'Before go-live',
      dependency: 'Asset plan and launch plan input',
      status: 'READY_FOR_AGENT_REVIEW',
      nextAction: 'Set the review checkpoint and confirm open dependencies.',
    },
  ]);
}

function storyLayers(): readonly SellerDecisionBriefStoryLayer[] {
  return Object.freeze([
    { layer: 'Objectives', primaryQuestion: 'What are we trying to accomplish?', narrativeId: 'seller-v2-executive-summary', supportingIntelligence: Object.freeze(['seller-objectives']), agentInterpretation: 'Frame the whole brief around seller objective and timing.', nextDecisionId: 'seller-v2-next-decision-strategy-direction' },
    { layer: 'Property', primaryQuestion: 'What makes my property distinctive?', narrativeId: 'seller-v2-property-story', supportingIntelligence: Object.freeze(['seller-subject-property-facts']), agentInterpretation: 'Lead with verified property facts and review-gated strengths.', nextDecisionId: 'seller-v2-next-decision-evidence-resolution' },
    { layer: 'Location', primaryQuestion: 'How does my location shape the sale?', narrativeId: 'seller-v2-location-story', supportingIntelligence: Object.freeze(['seller-location-context']), agentInterpretation: 'Connect place context to property story without unsupported claims.', nextDecisionId: null },
    { layer: 'Market', primaryQuestion: 'What market are we entering?', narrativeId: 'seller-v2-market-interpretation', supportingIntelligence: Object.freeze(['seller-market-context']), agentInterpretation: 'Use point-in-time market evidence for orientation and review.', nextDecisionId: null },
    { layer: 'Competition', primaryQuestion: 'What choices will buyers see?', narrativeId: 'seller-v2-competition-interpretation', supportingIntelligence: Object.freeze(['seller-competitive-facts']), agentInterpretation: 'Explain buyer alternatives factually without ranking.', nextDecisionId: null },
    { layer: 'Positioning', primaryQuestion: 'Where does my property stand out?', narrativeId: 'seller-v2-positioning-interpretation', supportingIntelligence: Object.freeze(['seller-subject-property-facts', 'seller-competitive-facts']), agentInterpretation: 'Turn evidence into Agent-authored emphasis.', nextDecisionId: 'seller-v2-next-decision-strategy-direction' },
    { layer: 'Preparation', primaryQuestion: 'What should we prepare?', narrativeId: 'seller-v2-preparation-rationale', supportingIntelligence: Object.freeze(['seller-document-verification']), agentInterpretation: 'Prioritize work that improves evidence and presentation readiness.', nextDecisionId: 'seller-v2-next-decision-evidence-resolution' },
    { layer: 'Launch', primaryQuestion: 'How should we present and launch?', narrativeId: 'seller-v2-launch-strategy', supportingIntelligence: Object.freeze(['seller-launch-plan']), agentInterpretation: 'Convert the story into launch sequence and review checkpoints.', nextDecisionId: 'seller-v2-next-decision-launch-checkpoint' },
    { layer: 'Recommendation', primaryQuestion: 'What strategy does my Agent recommend?', narrativeId: 'seller-v2-recommendation-rationale', supportingIntelligence: Object.freeze(['seller-recommendation-support']), agentInterpretation: 'Make recommendation, evidence, alternatives, and tradeoffs explicit.', nextDecisionId: 'seller-v2-next-decision-strategy-direction' },
    { layer: 'Next Decisions', primaryQuestion: 'What do I need to decide next?', narrativeId: 'seller-v2-next-decision', supportingIntelligence: Object.freeze(['seller-next-decisions']), agentInterpretation: 'Connect decision, owner, dependency, and next action.', nextDecisionId: 'seller-v2-next-decision-launch-checkpoint' },
  ]);
}

function productFamilyReuse(): readonly SellerDecisionBriefProductFamilyReuse[] {
  return Object.freeze([
    { primitive: 'NARRATIVE CONTRACT', classification: 'DIRECTLY_REUSABLE', reusableProducts: Object.freeze(['BUYER_PRESENTATION', 'MARKET_REPORT', 'PROPERTY_ANALYSIS', 'LOCATION_ANALYSIS', 'ADVISORY_BRIEFING']) },
    { primitive: 'SECTION TRANSITION', classification: 'DIRECTLY_REUSABLE', reusableProducts: Object.freeze(['BUYER_PRESENTATION', 'MARKET_REPORT', 'PROPERTY_ANALYSIS', 'LOCATION_ANALYSIS', 'ADVISORY_BRIEFING']) },
    { primitive: 'EVIDENCE-LINKED INTERPRETATION', classification: 'AUDIENCE_TRANSFORMABLE', reusableProducts: Object.freeze(['BUYER_PRESENTATION', 'MARKET_REPORT', 'PROPERTY_ANALYSIS', 'LOCATION_ANALYSIS']) },
    { primitive: 'POSITIONING / STRATEGY THEME', classification: 'PRODUCT_SPECIFIC_EXTENSION', reusableProducts: Object.freeze(['ADVISORY_BRIEFING', 'PROPERTY_ANALYSIS']) },
    { primitive: 'ALTERNATIVE STRATEGY', classification: 'DIRECTLY_REUSABLE', reusableProducts: Object.freeze(['INVESTMENT_PROPERTY_ANALYSIS', 'MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS', 'ADVISORY_BRIEFING']) },
    { primitive: 'RECOMMENDATION', classification: 'AUDIENCE_TRANSFORMABLE', reusableProducts: Object.freeze(['ADVISORY_BRIEFING', 'PROPERTY_ANALYSIS', 'INVESTMENT_PROPERTY_ANALYSIS']) },
    { primitive: 'RECOMMENDATION EVIDENCE MAP', classification: 'DIRECTLY_REUSABLE', reusableProducts: Object.freeze(['ADVISORY_BRIEFING', 'PROPERTY_ANALYSIS', 'INVESTMENT_PROPERTY_ANALYSIS']) },
    { primitive: 'NEXT DECISION', classification: 'DIRECTLY_REUSABLE', reusableProducts: Object.freeze(['BUYER_PRESENTATION', 'ADVISORY_BRIEFING', 'MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS']) },
  ]);
}

function v1ToV2Trace(preview: ReturnType<typeof buildSellerDecisionBriefCompositionPreview>): readonly SellerDecisionBriefV1ToV2Trace[] {
  const narrativeByModule = new Map<string, SellerDecisionBriefNarrativeUnit>();
  for (const unit of narratives(preview)) {
    for (const moduleId of unit.moduleIds) {
      if (!narrativeByModule.has(moduleId)) narrativeByModule.set(moduleId, unit);
    }
  }
  return Object.freeze(preview.sectionPresentations.flatMap((sellerSection) => sellerSection.modules.map((item) => {
    const unit = narrativeByModule.get(item.module.id) ?? narrativeByModule.get('seller-module-evidence-panel');
    return Object.freeze({
      v1ModuleId: item.module.id,
      v2Extension: unit?.kind ?? 'EVIDENCE_EXPLANATION',
      newDepth: unit?.summary ?? 'Evidence, limitations, and review state remain visible.',
      sellerValue: 'The module contributes to a coherent Seller decision story instead of standing alone.',
      agentValue: 'The Agent can inspect narrative, evidence, authorship, review state, and next action together.',
    });
  })));
}

function questionCoverageV2(): SellerDecisionBriefV2['questionCoverageV2'] {
  const rows: readonly [string, SellerDecisionBriefSectionId, string, readonly string[], boolean, 'STRONG' | 'ADEQUATE' | 'PARTIAL' | 'INPUT_REQUIRED'][] = [
    ['What are we trying to accomplish?', 'seller-brief-executive-summary', 'seller-v2-executive-summary', ['seller-objectives'], true, 'STRONG'],
    ['What makes my property distinctive?', 'seller-brief-property', 'seller-v2-property-story', ['seller-subject-property-facts'], true, 'ADEQUATE'],
    ['How does my location shape the sale?', 'seller-brief-location', 'seller-v2-location-story', ['seller-location-context'], true, 'PARTIAL'],
    ['What market are we entering?', 'seller-brief-market', 'seller-v2-market-interpretation', ['seller-market-context'], true, 'ADEQUATE'],
    ['What choices will buyers see?', 'seller-brief-competition', 'seller-v2-competition-interpretation', ['seller-competitive-facts'], true, 'ADEQUATE'],
    ['How does my property compare to those choices?', 'seller-brief-competition', 'seller-v2-competition-interpretation', ['seller-subject-property-facts', 'seller-competitive-facts'], true, 'ADEQUATE'],
    ['Where does my property stand out?', 'seller-brief-positioning', 'seller-v2-positioning-interpretation', ['seller-subject-property-facts', 'seller-competitive-facts'], true, 'INPUT_REQUIRED'],
    ['What requires context?', 'seller-brief-positioning', 'seller-v2-positioning-interpretation', ['seller-condition-improvement-evidence'], true, 'INPUT_REQUIRED'],
    ['What should we prepare?', 'seller-brief-preparation', 'seller-v2-preparation-rationale', ['seller-condition-improvement-evidence', 'seller-document-verification'], true, 'INPUT_REQUIRED'],
    ['How should we present and launch?', 'seller-brief-launch', 'seller-v2-launch-strategy', ['seller-asset-readiness', 'seller-launch-plan'], true, 'INPUT_REQUIRED'],
    ['What strategy does my Agent recommend?', 'seller-brief-recommendations', 'seller-v2-recommendation-rationale', ['seller-recommendation-support'], true, 'INPUT_REQUIRED'],
    ['Why?', 'seller-brief-recommendations', 'seller-v2-recommendation-rationale', ['seller-subject-property-facts', 'seller-market-context', 'seller-competitive-facts'], true, 'ADEQUATE'],
    ['What alternatives exist?', 'seller-brief-recommendations', 'seller-v2-alternative-strategy', ['seller-subject-property-facts', 'seller-market-context'], true, 'ADEQUATE'],
    ['What are the tradeoffs?', 'seller-brief-recommendations', 'seller-v2-alternative-strategy', ['seller-market-context', 'seller-competitive-facts'], true, 'ADEQUATE'],
    ['What do I need to decide next?', 'seller-brief-next-decisions', 'seller-v2-next-decision', ['seller-next-decisions'], true, 'STRONG'],
    ['What evidence supports this?', 'seller-brief-evidence-appendix', 'seller-v2-evidence-explanation', ['seller-source-timestamp-posture'], false, 'STRONG'],
  ];
  return Object.freeze(rows.map(([question, sectionId, narrativeId, evidenceReferenceIds, agentInputRequired, coverage]) => Object.freeze({
    question,
    sectionId,
    narrativeId,
    evidenceReferenceIds: Object.freeze([...evidenceReferenceIds]),
    agentInputRequired,
    coverage,
  })));
}

function recommendationEvidenceMap(): SellerDecisionBriefRecommendationEvidenceMap {
  return Object.freeze({
    recommendationElement: 'seller-v2-recommendation-rationale',
    property: Object.freeze(['seller-subject-property-facts', 'seller-condition-improvement-evidence']),
    location: Object.freeze(['seller-location-context']),
    market: Object.freeze(['seller-market-context']),
    competition: Object.freeze(['seller-competitive-facts']),
    agentInput: Object.freeze(['agent-recommendation-card', 'agent-positioning-themes', 'agent-launch-plan']),
    handoff: Object.freeze(['seller-document-verification', 'seller-financial-preparation']),
  });
}

export function buildSellerDecisionBriefV2(): SellerDecisionBriefV2 {
  const preview = buildSellerDecisionBriefCompositionPreview();
  return Object.freeze({
    status: SELLER_DECISION_BRIEF_V2_STATUS,
    version: SELLER_DECISION_BRIEF_V2_VERSION,
    narrativeVersion: SELLER_DECISION_BRIEF_NARRATIVE_VERSION,
    strategyVersion: SELLER_DECISION_BRIEF_STRATEGY_VERSION,
    baseV1Version: SELLER_DECISION_BRIEF_CONTENT_VERSION,
    compositionPreviewVersion: SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION,
    compositionPreviewStatus: SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_STATUS,
    route: '/agent/prepare/seller/presentation',
    productTitle: 'Seller Decision Brief V2',
    sectionPresentations: preview.sectionPresentations,
    narratives: narratives(preview),
    differentiators: differentiators(),
    sectionTransitions: transitions(),
    strategyElements: strategyElements(),
    alternatives: alternatives(),
    recommendationEvidenceMap: recommendationEvidenceMap(),
    nextDecisions: nextDecisions(),
    storyLayers: storyLayers(),
    productFamilyReuse: productFamilyReuse(),
    v1ToV2Trace: v1ToV2Trace(preview),
    questionCoverageV2: questionCoverageV2(),
    readiness: Object.freeze({
      product: preview.brief.outputProduct.readiness,
      content: 'V2_NARRATIVE_STRATEGY_DEPTH_IMPLEMENTED',
      narrative: 'EVIDENCE_LINKED_AGENT_REVIEW_REQUIRED',
      propertyStory: 'IMPLEMENTED',
      locationStory: 'IMPLEMENTED',
      marketInterpretation: 'IMPLEMENTED',
      competitionInterpretation: 'IMPLEMENTED',
      positioning: 'IMPLEMENTED_AGENT_INPUT_REQUIRED',
      preparationStrategy: 'IMPLEMENTED_AGENT_INPUT_REQUIRED',
      launchStrategy: 'IMPLEMENTED_AGENT_INPUT_REQUIRED',
      recommendation: 'IMPLEMENTED_AGENT_RECOMMENDATION_REVIEW_REQUIRED',
      alternatives: 'IMPLEMENTED',
      nextDecisions: 'IMPLEMENTED_AGENT_INPUT_REQUIRED',
      evidence: 'PARTIAL_WITH_EXPLICIT_GATES',
      rights: 'AGENT_INTERNAL_AND_REVIEW_GATED',
      freshness: 'POINT_IN_TIME_AND_REVIEW_GATED',
      agentReview: 'IMPLEMENTED',
      sellerPreview: 'IMPLEMENTED',
      printPreview: 'FOUNDATION_IMPLEMENTED',
      pdf: 'NOT_IMPLEMENTED',
      shareDelivery: 'NOT_IMPLEMENTED',
      financialDecisionPreparation: 'SEPARATE_FOUNDATION_NOT_INTEGRATED',
      pricingDecisionArchitecture: 'NEXT_GATE',
    }),
    protectedBoundaries: Object.freeze({
      persistenceAuthorization: false,
      providerRuntime: false,
      customerMutation: false,
      crmMutation: false,
      emailOrMessageExecution: false,
      pdfGeneration: false,
      shareDelivery: false,
      automatedPricingRecommendation: false,
      automatedStrategyRecommendation: false,
    }),
    nextGate: SELLER_DECISION_BRIEF_V2_NEXT_GATE,
    productStatus: SELLER_DECISION_BRIEF_V2_PRODUCT_STATUS,
  });
}

export function narrativeForSection(v2: SellerDecisionBriefV2, sectionId: SellerDecisionBriefSectionId) {
  return v2.narratives.find((unit) => unit.sectionId === sectionId);
}

export function narrativeForModule(v2: SellerDecisionBriefV2, moduleId: string) {
  return v2.narratives.find((unit) => unit.moduleIds.includes(moduleId));
}

export function visualComponentForNarrative(kind: SellerDecisionBriefNarrativeKind): SellerDecisionBriefVisualComponentName {
  if (kind === 'EXECUTIVE_SUMMARY') return 'OutputDecisionSnapshot';
  if (kind === 'PROPERTY_STORY') return 'OutputPropertyStory';
  if (kind === 'LOCATION_STORY') return 'OutputLocationMap';
  if (kind === 'MARKET_INTERPRETATION') return 'OutputCohortSummary';
  if (kind === 'COMPETITION_INTERPRETATION') return 'OutputComparisonMatrix';
  if (kind === 'POSITIONING_INTERPRETATION') return 'OutputPositioningMatrix';
  if (kind === 'PREPARATION_RATIONALE') return 'OutputPreparationMatrix';
  if (kind === 'LAUNCH_STRATEGY') return 'OutputLaunchTimeline';
  if (kind === 'RECOMMENDATION_RATIONALE') return 'OutputRecommendationCard';
  if (kind === 'ALTERNATIVE_STRATEGY') return 'OutputRecommendationCard';
  if (kind === 'NEXT_DECISION') return 'OutputDecisionChecklist';
  if (kind === 'SECTION_TRANSITION') return 'OutputSectionHeader';
  return 'OutputEvidencePanel';
}

export const SELLER_DECISION_BRIEF_V2_FIXTURE = buildSellerDecisionBriefV2();
