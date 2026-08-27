import {
  buildAtlasOutputProduct,
  SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
  SHARED_OUTPUT_PRODUCT_PROTECTED_BOUNDARIES,
  type AtlasOutputComposedProduct,
  type AtlasOutputEvidenceReference,
  type AtlasOutputFreshnessState,
  type AtlasOutputModuleDefinition,
  type AtlasOutputModuleInputType,
  type AtlasOutputModulePriority,
  type AtlasOutputProductDefinition,
  type AtlasOutputReviewRequirement,
  type AtlasOutputRightsState,
  type AtlasOutputSectionDefinition,
  type AtlasOutputSourceReference,
} from './sharedOutputProductComposition';
import {
  SELLER_PRESENTATION_OUTPUT_COMPOSITION_STATUS,
  type SellerPresentationPreparationReference,
} from './sellerPresentationOutputComposition';

export const SELLER_DECISION_BRIEF_FOUNDATION_STATUS = 'SELLER_DECISION_BRIEF_FOUNDATION_V1_CERTIFIED' as const;
export const SELLER_DECISION_BRIEF_CONTENT_VERSION = 'SELLER_DECISION_BRIEF_FOUNDATION_V1' as const;
export const SELLER_DECISION_BRIEF_NEXT_GATE = 'READY_FOR_SELLER_PRESENTATION_COMPOSITION_REVIEW_EXPERIENCE' as const;

export type SellerDecisionBriefContentClassification =
  | 'SOURCE_FACT'
  | 'ATLAS_INTELLIGENCE'
  | 'ATLAS_ANALYSIS_REFERENCE'
  | 'AGENT_INTERPRETATION'
  | 'AGENT_RECOMMENDATION'
  | 'ASSUMPTION'
  | 'LIMITATION'
  | 'PROFESSIONAL_HANDOFF';

export type SellerDecisionBriefContentState =
  | 'READY_FOR_AGENT_REVIEW'
  | 'INPUT_REQUIRED'
  | 'EVIDENCE_REQUIRED'
  | 'RIGHTS_REVIEW_REQUIRED'
  | 'FRESHNESS_REVIEW_REQUIRED';

export type SellerDecisionBriefCoverage = 'STRONG' | 'ADEQUATE' | 'PARTIAL' | 'INPUT_REQUIRED' | 'EVIDENCE_REQUIRED';

export type SellerDecisionBriefAdapterFamily =
  | 'SELLER_PREPARATION'
  | 'PROPERTY'
  | 'LOCATION'
  | 'MARKET'
  | 'COMPETITION'
  | 'AGENT_INPUT'
  | 'EVIDENCE_FRESHNESS'
  | 'ADVISORY_HANDOFF';

export type SellerDecisionBriefModuleRegistryEntry = Readonly<{
  moduleId: string;
  sectionId: SellerDecisionBriefSectionId;
  title: string;
  purpose: string;
  inputType: AtlasOutputModuleInputType;
  priority: AtlasOutputModulePriority;
  readinessRule: SellerDecisionBriefContentState;
  classification: SellerDecisionBriefContentClassification;
  evidenceIds: readonly string[];
  intelligenceReferences: readonly string[];
  agentInputIds: readonly string[];
  reusableBy: readonly ('BUYER_PRESENTATION' | 'MARKET_REPORT' | 'PROPERTY_ANALYSIS' | 'LOCATION_ANALYSIS' | 'ADVISORY_BRIEFING')[];
}>;

export type SellerDecisionBriefSectionId =
  | 'seller-brief-executive-summary'
  | 'seller-brief-context'
  | 'seller-brief-property'
  | 'seller-brief-location'
  | 'seller-brief-market'
  | 'seller-brief-competition'
  | 'seller-brief-positioning'
  | 'seller-brief-preparation'
  | 'seller-brief-launch'
  | 'seller-brief-recommendations'
  | 'seller-brief-timeline'
  | 'seller-brief-next-decisions'
  | 'seller-brief-evidence-appendix';

export type SellerDecisionBriefAdapter = Readonly<{
  family: SellerDecisionBriefAdapterFamily;
  canonicalSource: string;
  sellerModulesFed: readonly string[];
  evidencePropagated: readonly string[];
  reusableAcrossProducts: readonly string[];
}>;

export type SellerDecisionBriefQuestionCoverage = Readonly<{
  question: string;
  sectionId: SellerDecisionBriefSectionId;
  moduleIds: readonly string[];
  evidenceOrInput: string;
  coverage: SellerDecisionBriefCoverage;
}>;

export type SellerDecisionBrief = Readonly<{
  status: typeof SELLER_DECISION_BRIEF_FOUNDATION_STATUS;
  contentVersion: typeof SELLER_DECISION_BRIEF_CONTENT_VERSION;
  baseSellerFoundation: typeof SELLER_PRESENTATION_OUTPUT_COMPOSITION_STATUS;
  preparationReference: SellerPresentationPreparationReference;
  outputProduct: AtlasOutputComposedProduct;
  sectionRegistry: readonly SellerDecisionBriefSectionId[];
  moduleRegistry: readonly SellerDecisionBriefModuleRegistryEntry[];
  adapters: readonly SellerDecisionBriefAdapter[];
  questionCoverage: readonly SellerDecisionBriefQuestionCoverage[];
  readiness: Readonly<{
    product: AtlasOutputComposedProduct['readiness'];
    content: 'SUBSTANTIVE_CONTENT_FOUNDATION';
    intelligence: 'COMPOSABLE_WITH_REVIEW_GATES';
    agentInput: 'STRUCTURED_AGENT_INPUT_REQUIRED';
    evidence: 'PARTIAL_WITH_EXPLICIT_GATES';
    rights: 'AGENT_INTERNAL_AND_REVIEW_GATED';
    freshness: 'POINT_IN_TIME_AND_REVIEW_GATED';
    visualPresentation: 'NOT_IMPLEMENTED';
    ui: 'NOT_IMPLEMENTED';
    printPdf: 'NOT_IMPLEMENTED';
    versionReuse: 'DETERMINISTIC_CONTENT_VERSION_ONLY';
  }>;
  nextGate: typeof SELLER_DECISION_BRIEF_NEXT_GATE;
}>;

const MODULES: readonly SellerDecisionBriefModuleRegistryEntry[] = Object.freeze([
  module('seller-module-decision-snapshot', 'seller-brief-executive-summary', 'Decision snapshot', 'Summarize what the seller and Agent are deciding now.', 'ATLAS_AND_AGENT_INPUT', 'P0', 'INPUT_REQUIRED', 'AGENT_INTERPRETATION', ['seller-objectives', 'seller-market-context', 'seller-competitive-facts'], ['seller-preparation', 'market-context', 'competition-context'], ['agent-decision-summary'], ['ADVISORY_BRIEFING']),
  module('seller-module-objectives', 'seller-brief-context', 'Seller objectives', 'Represent the seller goals that frame the decision brief.', 'AGENT_INPUT', 'P0', 'INPUT_REQUIRED', 'AGENT_INTERPRETATION', ['seller-objectives'], ['seller-preparation'], ['agent-seller-objectives'], ['ADVISORY_BRIEFING']),
  module('seller-module-timing-constraints', 'seller-brief-context', 'Timing and constraints', 'Represent timing, constraints, and decision questions supplied by the Agent.', 'AGENT_INPUT', 'P0', 'INPUT_REQUIRED', 'ASSUMPTION', ['seller-timing'], ['seller-preparation'], ['agent-timing-constraints'], ['ADVISORY_BRIEFING']),
  module('seller-module-property-hero', 'seller-brief-property', 'Property hero', 'Frame the subject property identity from canonical property facts.', 'ATLAS_INTELLIGENCE', 'P0', 'READY_FOR_AGENT_REVIEW', 'SOURCE_FACT', ['seller-subject-property-facts'], ['property-preparation'], [], ['PROPERTY_ANALYSIS']),
  module('seller-module-fact-grid', 'seller-brief-property', 'Property fact grid', 'Expose source facts and missing fields as a seller-readable fact grid contract.', 'ATLAS_INTELLIGENCE', 'P0', 'READY_FOR_AGENT_REVIEW', 'SOURCE_FACT', ['seller-subject-property-facts', 'seller-source-timestamp-posture'], ['property-preparation'], [], ['PROPERTY_ANALYSIS']),
  module('seller-module-property-strengths', 'seller-brief-property', 'Property strengths', 'Hold Agent-authored differentiators separate from source facts.', 'AGENT_INPUT', 'P0', 'INPUT_REQUIRED', 'AGENT_INTERPRETATION', ['seller-subject-property-facts', 'seller-condition-improvement-evidence'], ['property-preparation'], ['agent-property-strengths'], ['PROPERTY_ANALYSIS']),
  module('seller-module-location-story', 'seller-brief-location', 'Location story', 'Compose location context and Agent-authored local narrative input.', 'ATLAS_AND_AGENT_INPUT', 'P0', 'INPUT_REQUIRED', 'AGENT_INTERPRETATION', ['seller-location-context'], ['place-preparation'], ['agent-location-story'], ['LOCATION_ANALYSIS', 'ADVISORY_BRIEFING']),
  module('seller-module-current-market-snapshot', 'seller-brief-market', 'Current market snapshot', 'Expose current market/cohort metrics, as-of posture, and limitations.', 'ATLAS_INTELLIGENCE', 'P0', 'READY_FOR_AGENT_REVIEW', 'ATLAS_INTELLIGENCE', ['seller-market-context'], ['market-preparation', 'cohort-comparative-contract'], [], ['MARKET_REPORT', 'BUYER_PRESENTATION']),
  module('seller-module-current-competition', 'seller-brief-competition', 'Current competition', 'Represent current competing listing context and buyer choice set.', 'ATLAS_INTELLIGENCE', 'P0', 'READY_FOR_AGENT_REVIEW', 'ATLAS_ANALYSIS_REFERENCE', ['seller-competitive-facts'], ['current-competing-listing-context-wave-6'], [], ['PROPERTY_ANALYSIS', 'MARKET_REPORT']),
  module('seller-module-subject-cohort-matrix', 'seller-brief-competition', 'Subject cohort matrix', 'Represent the subject property against the current cohort as factual context.', 'ATLAS_INTELLIGENCE', 'P0', 'READY_FOR_AGENT_REVIEW', 'ATLAS_ANALYSIS_REFERENCE', ['seller-subject-property-facts', 'seller-competitive-facts'], ['current-competing-listing-context-wave-6', 'atlas-cohort-comparative-contract'], [], ['PROPERTY_ANALYSIS', 'MARKET_REPORT']),
  module('seller-module-positioning-themes', 'seller-brief-positioning', 'Positioning themes', 'Hold Agent-authored positioning themes supported by evidence references.', 'AGENT_INPUT', 'P0', 'INPUT_REQUIRED', 'AGENT_INTERPRETATION', ['seller-subject-property-facts', 'seller-market-context', 'seller-competitive-facts'], ['property-preparation', 'market-preparation', 'competition-context'], ['agent-positioning-themes'], ['ADVISORY_BRIEFING']),
  module('seller-module-preparation-plan', 'seller-brief-preparation', 'Preparation plan', 'Represent seller preparation priorities and verification work before launch.', 'ATLAS_AND_AGENT_INPUT', 'P0', 'INPUT_REQUIRED', 'AGENT_INTERPRETATION', ['seller-condition-improvement-evidence', 'seller-document-verification'], ['seller-preparation', 'property-preparation'], ['agent-preparation-plan'], ['ADVISORY_BRIEFING']),
  module('seller-module-property-story', 'seller-brief-launch', 'Property story', 'Represent the Agent-authored property story and marketing narrative input.', 'AGENT_INPUT', 'P0', 'INPUT_REQUIRED', 'AGENT_INTERPRETATION', ['seller-subject-property-facts', 'seller-location-context'], ['property-preparation', 'place-preparation'], ['agent-property-story'], ['PROPERTY_ANALYSIS']),
  module('seller-module-asset-plan', 'seller-brief-launch', 'Asset plan', 'Represent media and asset readiness as an Agent-authored launch input seam.', 'AGENT_INPUT', 'P0', 'INPUT_REQUIRED', 'AGENT_INTERPRETATION', ['seller-asset-readiness'], ['seller-preparation'], ['agent-asset-plan'], ['ADVISORY_BRIEFING']),
  module('seller-module-launch-plan', 'seller-brief-launch', 'Launch plan', 'Represent launch sequence, owners, and target dates when Agent supplied.', 'AGENT_INPUT', 'P0', 'INPUT_REQUIRED', 'AGENT_INTERPRETATION', ['seller-launch-plan'], ['seller-preparation'], ['agent-launch-plan'], ['ADVISORY_BRIEFING']),
  module('seller-module-recommendation-card', 'seller-brief-recommendations', 'Recommendation card', 'Represent an explicit Agent-authored recommendation with rationale, alternatives, tradeoffs, assumptions, and next action.', 'AGENT_INPUT', 'P0', 'INPUT_REQUIRED', 'AGENT_RECOMMENDATION', ['seller-recommendation-support'], ['seller-preparation', 'professional-handoff'], ['agent-recommendation-card'], ['ADVISORY_BRIEFING']),
  module('seller-module-seller-journey', 'seller-brief-timeline', 'Seller journey', 'Represent milestones, owners, dependencies, and target dates.', 'AGENT_INPUT', 'P0', 'INPUT_REQUIRED', 'AGENT_INTERPRETATION', ['seller-journey-plan'], ['seller-preparation', 'advisory-handoff'], ['agent-seller-journey'], ['ADVISORY_BRIEFING']),
  module('seller-module-next-decisions', 'seller-brief-next-decisions', 'Next decisions', 'Represent the specific seller decisions and Agent actions after the brief.', 'AGENT_INPUT', 'P0', 'INPUT_REQUIRED', 'AGENT_INTERPRETATION', ['seller-next-decisions'], ['seller-preparation'], ['agent-next-decisions'], ['ADVISORY_BRIEFING']),
  module('seller-module-evidence-panel', 'seller-brief-evidence-appendix', 'Evidence panel', 'Surface source references, as-of posture, rights, freshness, limitations, assumptions, Agent-authored content, and professional handoffs.', 'EVIDENCE_APPENDIX', 'APPENDIX', 'FRESHNESS_REVIEW_REQUIRED', 'LIMITATION', ['seller-subject-property-facts', 'seller-source-timestamp-posture', 'seller-market-context', 'seller-competitive-facts', 'seller-condition-improvement-evidence', 'seller-financial-preparation'], ['shared-output-product-evidence-interface'], ['agent-evidence-review'], ['ADVISORY_BRIEFING', 'MARKET_REPORT', 'PROPERTY_ANALYSIS', 'LOCATION_ANALYSIS']),
]);

function module(
  moduleId: string,
  sectionId: SellerDecisionBriefSectionId,
  title: string,
  purpose: string,
  inputType: AtlasOutputModuleInputType,
  priority: AtlasOutputModulePriority,
  readinessRule: SellerDecisionBriefContentState,
  classification: SellerDecisionBriefContentClassification,
  evidenceIds: readonly string[],
  intelligenceReferences: readonly string[],
  agentInputIds: readonly string[],
  reusableBy: readonly SellerDecisionBriefModuleRegistryEntry['reusableBy'][number][],
): SellerDecisionBriefModuleRegistryEntry {
  return Object.freeze({ moduleId, sectionId, title, purpose, inputType, priority, readinessRule, classification, evidenceIds: Object.freeze([...evidenceIds]), intelligenceReferences: Object.freeze([...intelligenceReferences]), agentInputIds: Object.freeze([...agentInputIds]), reusableBy: Object.freeze([...reusableBy]) });
}

const SECTION_ORDER: readonly SellerDecisionBriefSectionId[] = Object.freeze([
  'seller-brief-executive-summary',
  'seller-brief-context',
  'seller-brief-property',
  'seller-brief-location',
  'seller-brief-market',
  'seller-brief-competition',
  'seller-brief-positioning',
  'seller-brief-preparation',
  'seller-brief-launch',
  'seller-brief-recommendations',
  'seller-brief-timeline',
  'seller-brief-next-decisions',
  'seller-brief-evidence-appendix',
]);

const SECTION_TITLES: Record<SellerDecisionBriefSectionId, string> = {
  'seller-brief-executive-summary': 'Executive summary',
  'seller-brief-context': 'Seller context',
  'seller-brief-property': 'Subject property',
  'seller-brief-location': 'Location',
  'seller-brief-market': 'Current market',
  'seller-brief-competition': 'Current competition',
  'seller-brief-positioning': 'Positioning',
  'seller-brief-preparation': 'Preparation',
  'seller-brief-launch': 'Launch',
  'seller-brief-recommendations': 'Agent recommendation',
  'seller-brief-timeline': 'Seller journey and timeline',
  'seller-brief-next-decisions': 'Next decisions',
  'seller-brief-evidence-appendix': 'Evidence appendix',
};

const SECTION_KINDS: Record<SellerDecisionBriefSectionId, AtlasOutputSectionDefinition['kind']> = {
  'seller-brief-executive-summary': 'EXECUTIVE_OVERVIEW',
  'seller-brief-context': 'CONTEXT',
  'seller-brief-property': 'PROPERTY',
  'seller-brief-location': 'LOCATION',
  'seller-brief-market': 'MARKET',
  'seller-brief-competition': 'COMPETITION',
  'seller-brief-positioning': 'POSITIONING',
  'seller-brief-preparation': 'PREPARATION',
  'seller-brief-launch': 'LAUNCH',
  'seller-brief-recommendations': 'RECOMMENDATIONS',
  'seller-brief-timeline': 'TIMELINE',
  'seller-brief-next-decisions': 'NEXT_DECISIONS',
  'seller-brief-evidence-appendix': 'EVIDENCE_APPENDIX',
};

const MODULE_KIND: Record<string, AtlasOutputModuleDefinition['kind']> = {
  'seller-module-decision-snapshot': 'DECISION_SNAPSHOT',
  'seller-module-objectives': 'OBJECTIVES',
  'seller-module-timing-constraints': 'TIMING_CONSTRAINTS',
  'seller-module-property-hero': 'PROPERTY_HERO',
  'seller-module-fact-grid': 'FACT_GRID',
  'seller-module-property-strengths': 'PROPERTY_STRENGTHS',
  'seller-module-location-story': 'LOCATION_STORY',
  'seller-module-current-market-snapshot': 'MARKET_SNAPSHOT',
  'seller-module-current-competition': 'CURRENT_COMPETITION',
  'seller-module-subject-cohort-matrix': 'COMPARISON_TABLE',
  'seller-module-positioning-themes': 'POSITIONING_THEMES',
  'seller-module-preparation-plan': 'PREPARATION_PLAN',
  'seller-module-property-story': 'PROPERTY_STORY',
  'seller-module-asset-plan': 'ASSET_PLAN',
  'seller-module-launch-plan': 'LAUNCH_PLAN',
  'seller-module-recommendation-card': 'RECOMMENDATION_CARD',
  'seller-module-seller-journey': 'SELLER_JOURNEY',
  'seller-module-next-decisions': 'NEXT_DECISIONS',
  'seller-module-evidence-panel': 'EVIDENCE_PANEL',
};

function sourceReferences(): readonly AtlasOutputSourceReference[] {
  return Object.freeze([
    source('seller-preparation', 'PREPARATION_PACKET', 'lib/agent-advisory-workbench/agentSellerConsultationPreparation.ts'),
    source('seller-update-preparation', 'PREPARATION_PACKET', 'lib/sellerUpdatePreparation.ts'),
    source('property-preparation', 'PREPARATION_PACKET', 'lib/agent-advisory-workbench/agentPropertyConversationPreparation.ts'),
    source('place-preparation', 'PREPARATION_PACKET', 'lib/agent-advisory-workbench/agentPlaceConversationPreparation.ts'),
    source('market-preparation', 'PREPARATION_PACKET', 'lib/agent-advisory-workbench/marketConversationExperience.ts'),
    source('atlas-cohort-comparative-contract', 'ANALYSIS_PACKET', 'lib/atlasCohortComparativeContract.ts'),
    source('current-competing-listing-context-wave-6', 'ANALYSIS_PACKET', 'lib/agentCurrentCompetingListingContext.ts'),
    source('professional-handoff', 'INTELLIGENCE_PACKET', 'lib/professionalHandoffCohesion.ts'),
    source('shared-output-product-evidence-interface', 'SOURCE_RECORD', 'lib/sharedOutputProductComposition.ts#AtlasOutputEvidenceReference'),
  ]);
}

function source(id: string, kind: AtlasOutputSourceReference['kind'], repositoryReference: string): AtlasOutputSourceReference {
  return Object.freeze({ id, kind, repositoryReference });
}

function evidenceReferences(effectiveAsOf: string): readonly AtlasOutputEvidenceReference[] {
  return Object.freeze([
    evidence('seller-objectives', 'Seller objectives and priorities', ['seller-preparation'], 'PROFESSIONAL_VERIFICATION_REQUIRED', 'ADMITTED_FOR_AGENT_INTERNAL', 'NOT_APPLICABLE', effectiveAsOf, ['Agent-supplied seller objectives are required before customer-facing use.']),
    evidence('seller-timing', 'Seller timing and constraints', ['seller-preparation'], 'PROFESSIONAL_VERIFICATION_REQUIRED', 'ADMITTED_FOR_AGENT_INTERNAL', 'NOT_APPLICABLE', effectiveAsOf, ['Agent-supplied timing and constraints are required.']),
    evidence('seller-subject-property-facts', 'Subject property facts', ['property-preparation', 'seller-update-preparation'], 'AVAILABLE_WITH_LIMITATIONS', 'ADMITTED_FOR_AGENT_INTERNAL', 'POINT_IN_TIME', effectiveAsOf, ['Property facts are point-in-time preparation facts requiring Agent review.']),
    evidence('seller-source-timestamp-posture', 'Source timestamp posture', ['seller-update-preparation'], 'PROFESSIONAL_VERIFICATION_REQUIRED', 'ADMITTED_FOR_AGENT_INTERNAL', 'UNKNOWN_REVIEW_REQUIRED', effectiveAsOf, ['Visible timestamp is not authoritative MLS freshness.']),
    evidence('seller-condition-improvement-evidence', 'Condition and improvement evidence', ['seller-update-preparation'], 'MISSING', 'REQUIRES_REVIEW', 'UNKNOWN_REVIEW_REQUIRED', null, ['Condition and improvement evidence is not established by listing facts alone.']),
    evidence('seller-location-context', 'Location context', ['place-preparation'], 'AVAILABLE_WITH_LIMITATIONS', 'ADMITTED_FOR_AGENT_INTERNAL', 'DATED_DURABLE_CONTEXT', effectiveAsOf, ['Location context is city/place orientation only and requires address-specific verification.']),
    evidence('seller-market-context', 'Current market context', ['market-preparation', 'atlas-cohort-comparative-contract'], 'AVAILABLE_WITH_LIMITATIONS', 'ADMITTED_FOR_AGENT_INTERNAL', 'POINT_IN_TIME', effectiveAsOf, ['Market metrics are point-in-time orientation and not pricing or strategy.']),
    evidence('seller-competitive-facts', 'Current competition context', ['current-competing-listing-context-wave-6'], 'AVAILABLE_WITH_LIMITATIONS', 'ADMITTED_FOR_AGENT_INTERNAL', 'POINT_IN_TIME', effectiveAsOf, ['Competition context is factual and cannot rank, score, or select comparables.']),
    evidence('seller-document-verification', 'Document and verification questions', ['seller-preparation', 'professional-handoff'], 'PROFESSIONAL_VERIFICATION_REQUIRED', 'ADMITTED_FOR_AGENT_INTERNAL', 'NOT_APPLICABLE', effectiveAsOf, ['Documents and verification questions require appropriate professional review.']),
    evidence('seller-asset-readiness', 'Media and asset readiness', ['seller-preparation'], 'PROFESSIONAL_VERIFICATION_REQUIRED', 'ADMITTED_FOR_AGENT_INTERNAL', 'NOT_APPLICABLE', effectiveAsOf, ['Asset readiness is an Agent-supplied planning seam only.']),
    evidence('seller-launch-plan', 'Launch plan', ['seller-preparation'], 'PROFESSIONAL_VERIFICATION_REQUIRED', 'ADMITTED_FOR_AGENT_INTERNAL', 'NOT_APPLICABLE', effectiveAsOf, ['Launch plan is Agent-authored and review-required.']),
    evidence('seller-recommendation-support', 'Recommendation supporting evidence', ['seller-preparation', 'property-preparation', 'market-preparation', 'current-competing-listing-context-wave-6'], 'PROFESSIONAL_VERIFICATION_REQUIRED', 'REQUIRES_REVIEW', 'UNKNOWN_REVIEW_REQUIRED', effectiveAsOf, ['Recommendation card is Agent-authored and not ATLAS-authored strategy.']),
    evidence('seller-financial-preparation', 'Seller financial and proceeds preparation', ['seller-preparation', 'professional-handoff'], 'PROFESSIONAL_VERIFICATION_REQUIRED', 'ADMITTED_FOR_AGENT_INTERNAL', 'NOT_APPLICABLE', effectiveAsOf, ['Financial preparation is professional-review only and does not calculate proceeds, affordability, investment, tax, legal, or lending conclusions.']),
    evidence('seller-journey-plan', 'Seller journey plan', ['seller-preparation', 'professional-handoff'], 'PROFESSIONAL_VERIFICATION_REQUIRED', 'ADMITTED_FOR_AGENT_INTERNAL', 'NOT_APPLICABLE', effectiveAsOf, ['Milestones, owners, and target dates are Agent supplied.']),
    evidence('seller-next-decisions', 'Next seller decisions', ['seller-preparation'], 'PROFESSIONAL_VERIFICATION_REQUIRED', 'ADMITTED_FOR_AGENT_INTERNAL', 'NOT_APPLICABLE', effectiveAsOf, ['Next decisions require Agent and seller review.']),
  ]);
}

function evidence(
  id: string,
  label: string,
  sourceReferenceIds: readonly string[],
  evidenceState: AtlasOutputEvidenceReference['evidenceState'],
  rightsState: AtlasOutputRightsState,
  freshnessState: AtlasOutputFreshnessState,
  asOf: string | null,
  limitations: readonly string[],
): AtlasOutputEvidenceReference {
  return Object.freeze({ id, label, sourceReferenceIds: Object.freeze([...sourceReferenceIds]), evidenceState, rightsState, freshnessState, asOf, limitations: Object.freeze([...limitations]) });
}

function sections(): readonly AtlasOutputSectionDefinition[] {
  return Object.freeze(SECTION_ORDER.map((sectionId, index) => {
    const sectionModules = MODULES.filter((entry) => entry.sectionId === sectionId);
    return Object.freeze({
      id: sectionId,
      kind: SECTION_KINDS[sectionId],
      title: SECTION_TITLES[sectionId],
      supportedProducts: ['SELLER_PRESENTATION'] as const,
      supportedAudiences: ['SELLER', 'AGENT_INTERNAL'] as const,
      required: sectionId !== 'seller-brief-timeline',
      order: (index + 1) * 10,
      moduleIds: Object.freeze(sectionModules.map((entry) => entry.moduleId)),
      evidenceRequirementIds: Object.freeze([...new Set(sectionModules.flatMap((entry) => entry.evidenceIds))]),
      rightsRequirement: sectionModules.some((entry) => entry.readinessRule === 'RIGHTS_REVIEW_REQUIRED') ? 'REQUIRES_REVIEW' : 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessRequirement: sectionModules.some((entry) => entry.readinessRule === 'FRESHNESS_REVIEW_REQUIRED') ? 'UNKNOWN_REVIEW_REQUIRED' : 'POINT_IN_TIME',
      reviewRequired: true,
      presentation: {
        display: sectionId === 'seller-brief-evidence-appendix' ? 'APPENDIX' as const : 'STANDARD' as const,
        printCandidate: true,
        visualCandidate: ['seller-brief-market', 'seller-brief-competition', 'seller-brief-timeline'].includes(sectionId),
      },
    });
  }));
}

function atlasModules(): readonly AtlasOutputModuleDefinition[] {
  return Object.freeze(MODULES.map((entry, index) => Object.freeze({
    id: entry.moduleId,
    kind: MODULE_KIND[entry.moduleId],
    title: entry.title,
    supportedProducts: ['SELLER_PRESENTATION'] as const,
    supportedAudiences: ['SELLER', 'AGENT_INTERNAL'] as const,
    required: entry.readinessRule === 'READY_FOR_AGENT_REVIEW',
    order: (index + 1) * 10,
    evidenceReferenceIds: entry.evidenceIds,
    intelligenceReferenceIds: entry.intelligenceReferences,
    analysisReferenceIds: entry.intelligenceReferences.filter((reference) => reference.includes('cohort') || reference.includes('competing') || reference.includes('financial')),
    narrativeReference: entry.classification === 'AGENT_RECOMMENDATION' || entry.classification === 'AGENT_INTERPRETATION' ? `agent-authored:${entry.moduleId}` : null,
    visualizationReference: ['seller-module-current-market-snapshot', 'seller-module-current-competition', 'seller-module-subject-cohort-matrix', 'seller-module-seller-journey'].includes(entry.moduleId) ? `future-visual:${entry.moduleId}` : null,
    rightsRequirement: entry.readinessRule === 'RIGHTS_REVIEW_REQUIRED' ? 'REQUIRES_REVIEW' : 'ADMITTED_FOR_AGENT_INTERNAL',
    freshnessRequirement: entry.readinessRule === 'FRESHNESS_REVIEW_REQUIRED' ? 'UNKNOWN_REVIEW_REQUIRED' : 'POINT_IN_TIME',
    reviewRequired: true,
    limitations: [`${entry.title} is ${entry.classification.toLowerCase().replaceAll('_', ' ')} and remains Agent-review required.`],
    inputType: entry.inputType,
    priority: entry.priority,
    readinessRule: entry.readinessRule,
  })));
}

function productDefinition(preparation: SellerPresentationPreparationReference): AtlasOutputProductDefinition {
  return {
    productKind: 'SELLER_PRESENTATION',
    productId: `seller-decision-brief-${preparation.subjectPropertyId}`,
    title: 'Seller Decision Brief Foundation V1',
    version: SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
    generatedAt: preparation.generatedAt,
    effectiveAsOf: preparation.effectiveAsOf,
    context: {
      subject: {
        kind: 'PROPERTY',
        id: preparation.subjectPropertyId,
        label: `Seller Decision Brief subject ${preparation.subjectPropertyId}`,
        repositoryReference: 'lib/sellerPresentationOutputComposition.ts#SellerPresentationPreparationReference',
      },
      audience: 'SELLER',
      purpose: 'Compose a substantive Seller Decision Brief from ATLAS intelligence and explicit Agent input for Agent review.',
      authorContext: 'AGENT_PREPARATION',
      clientContext: 'EXPLICIT_RECIPIENT_REVIEW_REQUIRED',
    },
    sourceReferences: sourceReferences(),
    evidenceReferences: evidenceReferences(preparation.effectiveAsOf),
    sections: sections(),
    modules: atlasModules(),
    reviewRequirements: reviewRequirements(),
    intendedFormats: ['AGENT_REVIEW_PACKET', 'SCREEN_PREVIEW', 'PRINT', 'PDF'],
    protectedBoundaries: SHARED_OUTPUT_PRODUCT_PROTECTED_BOUNDARIES,
  };
}

function reviewRequirements(): readonly AtlasOutputReviewRequirement[] {
  return Object.freeze([
    { id: 'seller-brief-agent-input-review', label: 'Agent input review', required: true, reason: 'Seller objectives, positioning, launch plan, recommendation, and next decisions are Agent-authored.' },
    { id: 'seller-brief-evidence-review', label: 'Evidence/freshness/rights review', required: true, reason: 'The brief combines point-in-time ATLAS intelligence, missing condition evidence, review-gated recommendation support, and professional handoff boundaries.' },
    { id: 'seller-brief-no-automation-review', label: 'No automated strategy review', required: true, reason: 'ATLAS does not author pricing, launch, negotiation, or seller strategy recommendations.' },
  ]);
}

export function buildSellerDecisionBrief(preparation: SellerPresentationPreparationReference): SellerDecisionBrief {
  const outputProduct = buildAtlasOutputProduct(productDefinition(preparation));
  return Object.freeze({
    status: SELLER_DECISION_BRIEF_FOUNDATION_STATUS,
    contentVersion: SELLER_DECISION_BRIEF_CONTENT_VERSION,
    baseSellerFoundation: SELLER_PRESENTATION_OUTPUT_COMPOSITION_STATUS,
    preparationReference: preparation,
    outputProduct,
    sectionRegistry: SECTION_ORDER,
    moduleRegistry: MODULES,
    adapters: SELLER_DECISION_BRIEF_ADAPTERS,
    questionCoverage: SELLER_DECISION_BRIEF_QUESTION_COVERAGE,
    readiness: Object.freeze({
      product: outputProduct.readiness,
      content: 'SUBSTANTIVE_CONTENT_FOUNDATION',
      intelligence: 'COMPOSABLE_WITH_REVIEW_GATES',
      agentInput: 'STRUCTURED_AGENT_INPUT_REQUIRED',
      evidence: 'PARTIAL_WITH_EXPLICIT_GATES',
      rights: 'AGENT_INTERNAL_AND_REVIEW_GATED',
      freshness: 'POINT_IN_TIME_AND_REVIEW_GATED',
      visualPresentation: 'NOT_IMPLEMENTED',
      ui: 'NOT_IMPLEMENTED',
      printPdf: 'NOT_IMPLEMENTED',
      versionReuse: 'DETERMINISTIC_CONTENT_VERSION_ONLY',
    }),
    nextGate: SELLER_DECISION_BRIEF_NEXT_GATE,
  });
}

export const SELLER_DECISION_BRIEF_REFERENCE_PREPARATION: SellerPresentationPreparationReference = Object.freeze({
  sellerUpdatePacketId: 'seller-decision-brief-reference-seller-update',
  agentConversationPreparationId: 'seller-decision-brief-reference-agent-preparation',
  subjectPropertyId: 'seller-decision-brief-subject-property',
  generatedAt: '2026-08-27T00:00:00.000Z',
  effectiveAsOf: '2026-08-27',
});

export const SELLER_DECISION_BRIEF_ADAPTERS: readonly SellerDecisionBriefAdapter[] = Object.freeze([
  adapter('SELLER_PREPARATION', 'lib/agent-advisory-workbench/agentSellerConsultationPreparation.ts', ['seller-module-objectives', 'seller-module-timing-constraints', 'seller-module-preparation-plan', 'seller-module-launch-plan', 'seller-module-next-decisions'], ['seller-objectives', 'seller-timing', 'seller-document-verification', 'seller-launch-plan', 'seller-next-decisions'], ['Advisory Briefing', 'Buyer Presentation']),
  adapter('PROPERTY', 'lib/agent-advisory-workbench/agentPropertyConversationPreparation.ts', ['seller-module-property-hero', 'seller-module-fact-grid', 'seller-module-property-strengths', 'seller-module-property-story'], ['seller-subject-property-facts', 'seller-source-timestamp-posture', 'seller-condition-improvement-evidence'], ['Property Analysis']),
  adapter('LOCATION', 'lib/agent-advisory-workbench/agentPlaceConversationPreparation.ts', ['seller-module-location-story'], ['seller-location-context'], ['Location Analysis', 'Property Analysis']),
  adapter('MARKET', 'lib/agent-advisory-workbench/marketConversationExperience.ts', ['seller-module-current-market-snapshot'], ['seller-market-context'], ['Market Report', 'Buyer Presentation']),
  adapter('COMPETITION', 'lib/agentCurrentCompetingListingContext.ts', ['seller-module-current-competition', 'seller-module-subject-cohort-matrix'], ['seller-competitive-facts'], ['Property Analysis', 'Market Report']),
  adapter('AGENT_INPUT', 'explicit Agent input contract', ['seller-module-decision-snapshot', 'seller-module-positioning-themes', 'seller-module-asset-plan', 'seller-module-recommendation-card', 'seller-module-seller-journey'], ['seller-objectives', 'seller-recommendation-support', 'seller-journey-plan'], ['Advisory Briefing']),
  adapter('EVIDENCE_FRESHNESS', 'lib/sharedOutputProductComposition.ts#AtlasOutputEvidenceReference', ['seller-module-evidence-panel'], ['all seller evidence references'], ['Market Report', 'Property Analysis', 'Location Analysis', 'Advisory Briefing']),
  adapter('ADVISORY_HANDOFF', 'lib/professionalHandoffCohesion.ts', ['seller-module-recommendation-card', 'seller-module-seller-journey', 'seller-module-evidence-panel'], ['seller-document-verification', 'seller-recommendation-support', 'seller-journey-plan'], ['Advisory Briefing']),
]);

function adapter(
  family: SellerDecisionBriefAdapterFamily,
  canonicalSource: string,
  sellerModulesFed: readonly string[],
  evidencePropagated: readonly string[],
  reusableAcrossProducts: readonly string[],
): SellerDecisionBriefAdapter {
  return Object.freeze({ family, canonicalSource, sellerModulesFed: Object.freeze([...sellerModulesFed]), evidencePropagated: Object.freeze([...evidencePropagated]), reusableAcrossProducts: Object.freeze([...reusableAcrossProducts]) });
}

export const SELLER_DECISION_BRIEF_QUESTION_COVERAGE: readonly SellerDecisionBriefQuestionCoverage[] = Object.freeze([
  coverage('What are we deciding?', 'seller-brief-executive-summary', ['seller-module-decision-snapshot'], 'Agent decision summary plus seller objectives', 'STRONG'),
  coverage('What will buyers see in my property?', 'seller-brief-property', ['seller-module-property-hero', 'seller-module-fact-grid', 'seller-module-property-strengths'], 'Property facts plus Agent-authored strengths', 'ADEQUATE'),
  coverage('How does my location affect the sale?', 'seller-brief-location', ['seller-module-location-story'], 'Place preparation plus Agent location story input', 'PARTIAL'),
  coverage('What market am I entering?', 'seller-brief-market', ['seller-module-current-market-snapshot'], 'Market preparation and cohort context', 'ADEQUATE'),
  coverage('What else can buyers choose?', 'seller-brief-competition', ['seller-module-current-competition'], 'Current competing listing context', 'ADEQUATE'),
  coverage('How does my property sit in that choice set?', 'seller-brief-competition', ['seller-module-subject-cohort-matrix'], 'Subject/cohort factual context', 'ADEQUATE'),
  coverage('What positioning choices matter?', 'seller-brief-positioning', ['seller-module-positioning-themes'], 'Agent-authored positioning themes', 'INPUT_REQUIRED'),
  coverage('What should we prepare?', 'seller-brief-preparation', ['seller-module-preparation-plan'], 'Seller/property preparation plus verification questions', 'INPUT_REQUIRED'),
  coverage('How will we launch?', 'seller-brief-launch', ['seller-module-property-story', 'seller-module-asset-plan', 'seller-module-launch-plan'], 'Agent-authored launch inputs', 'INPUT_REQUIRED'),
  coverage('What does my Agent recommend?', 'seller-brief-recommendations', ['seller-module-recommendation-card'], 'Explicit Agent-authored recommendation card', 'INPUT_REQUIRED'),
  coverage('What happens next?', 'seller-brief-next-decisions', ['seller-module-seller-journey', 'seller-module-next-decisions'], 'Milestones and next decisions supplied by Agent', 'INPUT_REQUIRED'),
  coverage('What evidence supports this?', 'seller-brief-evidence-appendix', ['seller-module-evidence-panel'], 'Shared output evidence/rights/freshness references', 'STRONG'),
]);

function coverage(
  question: string,
  sectionId: SellerDecisionBriefSectionId,
  moduleIds: readonly string[],
  evidenceOrInput: string,
  coverageState: SellerDecisionBriefCoverage,
): SellerDecisionBriefQuestionCoverage {
  return Object.freeze({ question, sectionId, moduleIds: Object.freeze([...moduleIds]), evidenceOrInput, coverage: coverageState });
}
