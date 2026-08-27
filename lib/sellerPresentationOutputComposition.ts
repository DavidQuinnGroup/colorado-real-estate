import {
  buildAtlasOutputProduct,
  SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
  SHARED_OUTPUT_PRODUCT_PROTECTED_BOUNDARIES,
  type AtlasOutputComposedProduct,
  type AtlasOutputEvidenceReference,
  type AtlasOutputModuleDefinition,
  type AtlasOutputProductDefinition,
  type AtlasOutputReviewRequirement,
  type AtlasOutputSectionDefinition,
  type AtlasOutputSourceReference,
} from './sharedOutputProductComposition';

export const SELLER_PRESENTATION_OUTPUT_COMPOSITION_STATUS =
  'PROJECT_ATLAS_SELLER_PRESENTATION_OUTPUT_COMPOSITION_FOUNDATION_ADMITTED' as const;
export const SELLER_PRESENTATION_OUTPUT_COMPOSITION_VERSION = 'SELLER_PRESENTATION_OUTPUT_COMPOSITION_V1' as const;

export type SellerPresentationPreparationReference = Readonly<{
  sellerUpdatePacketId: string;
  agentConversationPreparationId: string;
  subjectPropertyId: string;
  generatedAt: string;
  effectiveAsOf: string;
}>;

export type SellerPresentationComposition = Readonly<{
  status: typeof SELLER_PRESENTATION_OUTPUT_COMPOSITION_STATUS;
  version: typeof SELLER_PRESENTATION_OUTPUT_COMPOSITION_VERSION;
  sellerProductKind: 'SELLER_PRESENTATION';
  preparationReference: SellerPresentationPreparationReference;
  outputProduct: AtlasOutputComposedProduct;
  sellerSections: readonly string[];
  sellerModules: readonly string[];
  nextSellerGate: 'READY_FOR_SELLER_PRESENTATION_CONTENT_MODULE_EXPANSION';
  protectedBoundaries: typeof SHARED_OUTPUT_PRODUCT_PROTECTED_BOUNDARIES;
}>;

const REVIEW_REQUIREMENTS: readonly AtlasOutputReviewRequirement[] = Object.freeze([
  {
    id: 'seller-agent-fact-review',
    label: 'Agent factual review',
    required: true,
    reason: 'Seller-facing output requires human review of facts, source limits, and missing evidence before use.',
  },
  {
    id: 'seller-strategy-boundary-review',
    label: 'Seller strategy boundary review',
    required: true,
    reason: 'The current foundation prepares evidence modules only and does not authorize pricing, launch, negotiation, or communication strategy.',
  },
]);

function sourceReferences(preparation: SellerPresentationPreparationReference): readonly AtlasOutputSourceReference[] {
  return Object.freeze([
    {
      id: 'seller-update-preparation-packet',
      kind: 'PREPARATION_PACKET',
      repositoryReference: `lib/sellerUpdatePreparation.ts#${preparation.sellerUpdatePacketId}`,
    },
    {
      id: 'agent-conversation-preparation-composition',
      kind: 'PREPARATION_PACKET',
      repositoryReference: `lib/agent-advisory-workbench/agentConversationPreparationComposition.ts#${preparation.agentConversationPreparationId}`,
    },
    {
      id: 'seller-property-factual-intelligence',
      kind: 'INTELLIGENCE_PACKET',
      repositoryReference: 'lib/sellerUpdatePreparation.ts#subject.facts',
    },
    {
      id: 'seller-market-context-intelligence',
      kind: 'INTELLIGENCE_PACKET',
      repositoryReference: 'lib/sellerUpdatePreparation.ts#marketContext',
    },
    {
      id: 'seller-financial-preparation-composition',
      kind: 'ANALYSIS_PACKET',
      repositoryReference: 'lib/financialPreparationComposition.ts',
    },
  ]);
}

function evidenceReferences(preparation: SellerPresentationPreparationReference): readonly AtlasOutputEvidenceReference[] {
  return Object.freeze([
    {
      id: 'seller-subject-property-facts',
      label: 'Subject property facts from seller preparation',
      sourceReferenceIds: ['seller-update-preparation-packet', 'seller-property-factual-intelligence'],
      evidenceState: 'AVAILABLE_WITH_LIMITATIONS',
      rightsState: 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessState: 'POINT_IN_TIME',
      asOf: preparation.effectiveAsOf,
      limitations: ['Listing/property facts are preparation inputs; currentness and customer-facing use require Agent review.'],
    },
    {
      id: 'seller-source-timestamp-posture',
      label: 'Visible source timestamp posture',
      sourceReferenceIds: ['seller-update-preparation-packet'],
      evidenceState: 'PROFESSIONAL_VERIFICATION_REQUIRED',
      rightsState: 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessState: 'UNKNOWN_REVIEW_REQUIRED',
      asOf: preparation.effectiveAsOf,
      limitations: ['Visible timestamps are not authoritative MLS freshness.'],
    },
    {
      id: 'seller-market-context',
      label: 'Seller market context',
      sourceReferenceIds: ['seller-market-context-intelligence'],
      evidenceState: 'AVAILABLE_WITH_LIMITATIONS',
      rightsState: 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessState: 'POINT_IN_TIME',
      asOf: preparation.effectiveAsOf,
      limitations: ['Market context is supplied for preparation only and does not establish pricing, strategy, or outcome.'],
    },
    {
      id: 'seller-competitive-facts',
      label: 'Agent-supplied competitive facts',
      sourceReferenceIds: ['seller-update-preparation-packet'],
      evidenceState: 'AVAILABLE_WITH_LIMITATIONS',
      rightsState: 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessState: 'POINT_IN_TIME',
      asOf: preparation.effectiveAsOf,
      limitations: ['Competitive facts are explicitly supplied and not discovered, ranked, scored, or selected by ATLAS.'],
    },
    {
      id: 'seller-condition-improvement-evidence',
      label: 'Condition and improvement evidence',
      sourceReferenceIds: ['seller-update-preparation-packet'],
      evidenceState: 'MISSING',
      rightsState: 'REQUIRES_REVIEW',
      freshnessState: 'UNKNOWN_REVIEW_REQUIRED',
      asOf: null,
      limitations: ['Condition and improvement evidence is not established by listing facts alone.'],
    },
    {
      id: 'seller-financial-preparation',
      label: 'Seller financial/proceeds preparation inputs',
      sourceReferenceIds: ['seller-financial-preparation-composition'],
      evidenceState: 'PROFESSIONAL_VERIFICATION_REQUIRED',
      rightsState: 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessState: 'NOT_APPLICABLE',
      asOf: preparation.effectiveAsOf,
      limitations: ['Financial preparation does not calculate net proceeds, affordability, investment merit, tax advice, legal advice, or lender conclusions.'],
    },
  ]);
}

function modules(): readonly AtlasOutputModuleDefinition[] {
  return Object.freeze([
    {
      id: 'seller-executive-summary',
      kind: 'EXECUTIVE_SUMMARY',
      title: 'Seller presentation executive summary',
      supportedProducts: ['SELLER_PRESENTATION'],
      supportedAudiences: ['SELLER', 'AGENT_INTERNAL'],
      required: true,
      order: 10,
      evidenceReferenceIds: ['seller-subject-property-facts', 'seller-market-context'],
      intelligenceReferenceIds: ['seller-update-preparation-packet'],
      analysisReferenceIds: [],
      narrativeReference: 'future:seller-presentation-narrative',
      visualizationReference: null,
      rightsRequirement: 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessRequirement: 'POINT_IN_TIME',
      reviewRequired: true,
      limitations: ['Summary content is composed as Agent-review structure only until seller narrative is authorized.'],
    },
    {
      id: 'seller-subject-property',
      kind: 'SUBJECT_PROPERTY',
      title: 'Subject property orientation',
      supportedProducts: ['SELLER_PRESENTATION'],
      supportedAudiences: ['SELLER', 'AGENT_INTERNAL'],
      required: true,
      order: 20,
      evidenceReferenceIds: ['seller-subject-property-facts', 'seller-source-timestamp-posture'],
      intelligenceReferenceIds: ['seller-property-factual-intelligence'],
      analysisReferenceIds: [],
      narrativeReference: null,
      visualizationReference: null,
      rightsRequirement: 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessRequirement: 'POINT_IN_TIME',
      reviewRequired: true,
      limitations: ['Subject facts require Agent review before seller-facing use.'],
    },
    {
      id: 'seller-market-snapshot',
      kind: 'MARKET_SNAPSHOT',
      title: 'Seller market context',
      supportedProducts: ['SELLER_PRESENTATION'],
      supportedAudiences: ['SELLER', 'AGENT_INTERNAL'],
      required: true,
      order: 30,
      evidenceReferenceIds: ['seller-market-context'],
      intelligenceReferenceIds: ['seller-market-context-intelligence'],
      analysisReferenceIds: [],
      narrativeReference: null,
      visualizationReference: 'future:market-context-visual-module',
      rightsRequirement: 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessRequirement: 'POINT_IN_TIME',
      reviewRequired: true,
      limitations: ['Market context cannot become pricing, timing, or negotiation guidance.'],
    },
    {
      id: 'seller-current-competition',
      kind: 'CURRENT_COMPETITION',
      title: 'Current competing listing context',
      supportedProducts: ['SELLER_PRESENTATION'],
      supportedAudiences: ['SELLER', 'AGENT_INTERNAL'],
      required: false,
      order: 40,
      evidenceReferenceIds: ['seller-competitive-facts'],
      intelligenceReferenceIds: ['seller-update-preparation-packet'],
      analysisReferenceIds: ['current-competing-listing-context-wave-6'],
      narrativeReference: null,
      visualizationReference: 'future:competition-table',
      rightsRequirement: 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessRequirement: 'POINT_IN_TIME',
      reviewRequired: true,
      limitations: ['Competition module is factual only and cannot rank, score, or select comparable properties.'],
    },
    {
      id: 'seller-condition-review',
      kind: 'EVIDENCE_NOTES',
      title: 'Condition and improvement evidence review',
      supportedProducts: ['SELLER_PRESENTATION'],
      supportedAudiences: ['SELLER', 'AGENT_INTERNAL'],
      required: false,
      order: 50,
      evidenceReferenceIds: ['seller-condition-improvement-evidence'],
      intelligenceReferenceIds: ['seller-update-preparation-packet'],
      analysisReferenceIds: [],
      narrativeReference: null,
      visualizationReference: null,
      rightsRequirement: 'REQUIRES_REVIEW',
      freshnessRequirement: 'UNKNOWN_REVIEW_REQUIRED',
      reviewRequired: true,
      limitations: ['Condition evidence is explicitly gated until supplied and reviewed.'],
    },
    {
      id: 'seller-financial-questions',
      kind: 'FINANCIAL_SCENARIO',
      title: 'Seller financial questions for professional review',
      supportedProducts: ['SELLER_PRESENTATION'],
      supportedAudiences: ['SELLER', 'AGENT_INTERNAL'],
      required: false,
      order: 60,
      evidenceReferenceIds: ['seller-financial-preparation'],
      intelligenceReferenceIds: ['seller-financial-preparation-composition'],
      analysisReferenceIds: ['financial-preparation-composition'],
      narrativeReference: null,
      visualizationReference: null,
      rightsRequirement: 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessRequirement: 'NOT_APPLICABLE',
      reviewRequired: true,
      limitations: ['Financial questions are professional-review prompts only.'],
    },
    {
      id: 'seller-disclosures-limitations',
      kind: 'DISCLOSURES',
      title: 'Evidence, rights, freshness, and limitations',
      supportedProducts: ['SELLER_PRESENTATION'],
      supportedAudiences: ['SELLER', 'AGENT_INTERNAL'],
      required: true,
      order: 70,
      evidenceReferenceIds: ['seller-source-timestamp-posture', 'seller-financial-preparation'],
      intelligenceReferenceIds: ['agent-conversation-preparation-composition'],
      analysisReferenceIds: [],
      narrativeReference: 'future:output-disclosure-language',
      visualizationReference: null,
      rightsRequirement: 'REQUIRES_REVIEW',
      freshnessRequirement: 'UNKNOWN_REVIEW_REQUIRED',
      reviewRequired: true,
      limitations: ['This module carries the current output rights, freshness, and missing-evidence gates.'],
    },
  ]);
}

function sections(): readonly AtlasOutputSectionDefinition[] {
  return Object.freeze([
    {
      id: 'seller-overview',
      kind: 'EXECUTIVE_OVERVIEW',
      title: 'Seller overview',
      supportedProducts: ['SELLER_PRESENTATION'],
      supportedAudiences: ['SELLER', 'AGENT_INTERNAL'],
      required: true,
      order: 10,
      moduleIds: ['seller-executive-summary'],
      evidenceRequirementIds: ['seller-subject-property-facts', 'seller-market-context'],
      rightsRequirement: 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessRequirement: 'POINT_IN_TIME',
      reviewRequired: true,
      presentation: { display: 'STANDARD', printCandidate: true, visualCandidate: false },
    },
    {
      id: 'seller-property-context',
      kind: 'PROPERTY_FACTS',
      title: 'Property context',
      supportedProducts: ['SELLER_PRESENTATION'],
      supportedAudiences: ['SELLER', 'AGENT_INTERNAL'],
      required: true,
      order: 20,
      moduleIds: ['seller-subject-property', 'seller-condition-review'],
      evidenceRequirementIds: ['seller-subject-property-facts', 'seller-condition-improvement-evidence'],
      rightsRequirement: 'REQUIRES_REVIEW',
      freshnessRequirement: 'UNKNOWN_REVIEW_REQUIRED',
      reviewRequired: true,
      presentation: { display: 'STANDARD', printCandidate: true, visualCandidate: false },
    },
    {
      id: 'seller-market-position',
      kind: 'MARKET_CONTEXT',
      title: 'Market and positioning context',
      supportedProducts: ['SELLER_PRESENTATION'],
      supportedAudiences: ['SELLER', 'AGENT_INTERNAL'],
      required: true,
      order: 30,
      moduleIds: ['seller-market-snapshot', 'seller-current-competition'],
      evidenceRequirementIds: ['seller-market-context', 'seller-competitive-facts'],
      rightsRequirement: 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessRequirement: 'POINT_IN_TIME',
      reviewRequired: true,
      presentation: { display: 'STANDARD', printCandidate: true, visualCandidate: true },
    },
    {
      id: 'seller-financial-review',
      kind: 'FINANCIAL_CONTEXT',
      title: 'Financial and professional review',
      supportedProducts: ['SELLER_PRESENTATION'],
      supportedAudiences: ['SELLER', 'AGENT_INTERNAL'],
      required: false,
      order: 40,
      moduleIds: ['seller-financial-questions'],
      evidenceRequirementIds: ['seller-financial-preparation'],
      rightsRequirement: 'ADMITTED_FOR_AGENT_INTERNAL',
      freshnessRequirement: 'NOT_APPLICABLE',
      reviewRequired: true,
      presentation: { display: 'STANDARD', printCandidate: true, visualCandidate: false },
    },
    {
      id: 'seller-evidence-limitations',
      kind: 'EVIDENCE_AND_LIMITATIONS',
      title: 'Evidence, rights, freshness, and limitations',
      supportedProducts: ['SELLER_PRESENTATION'],
      supportedAudiences: ['SELLER', 'AGENT_INTERNAL'],
      required: true,
      order: 50,
      moduleIds: ['seller-disclosures-limitations'],
      evidenceRequirementIds: ['seller-source-timestamp-posture', 'seller-financial-preparation'],
      rightsRequirement: 'REQUIRES_REVIEW',
      freshnessRequirement: 'UNKNOWN_REVIEW_REQUIRED',
      reviewRequired: true,
      presentation: { display: 'APPENDIX', printCandidate: true, visualCandidate: false },
    },
  ]);
}

function productDefinition(preparation: SellerPresentationPreparationReference): AtlasOutputProductDefinition {
  return {
    productKind: 'SELLER_PRESENTATION',
    productId: `seller-presentation-${preparation.subjectPropertyId}`,
    title: 'Seller Presentation Foundation',
    version: SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
    generatedAt: preparation.generatedAt,
    effectiveAsOf: preparation.effectiveAsOf,
    context: {
      subject: {
        kind: 'PROPERTY',
        id: preparation.subjectPropertyId,
        label: `Seller subject property ${preparation.subjectPropertyId}`,
        repositoryReference: 'lib/sellerUpdatePreparation.ts#subject',
      },
      audience: 'SELLER',
      purpose: 'Compose seller presentation sections and modules from governed preparation evidence for Agent review.',
      authorContext: 'AGENT_PREPARATION',
      clientContext: 'EXPLICIT_RECIPIENT_REVIEW_REQUIRED',
    },
    sourceReferences: sourceReferences(preparation),
    evidenceReferences: evidenceReferences(preparation),
    sections: sections(),
    modules: modules(),
    reviewRequirements: REVIEW_REQUIREMENTS,
    intendedFormats: ['AGENT_REVIEW_PACKET', 'SCREEN_PREVIEW', 'PRINT', 'PDF'],
    protectedBoundaries: SHARED_OUTPUT_PRODUCT_PROTECTED_BOUNDARIES,
  };
}

export function buildSellerPresentationComposition(preparation: SellerPresentationPreparationReference): SellerPresentationComposition {
  const outputProduct = buildAtlasOutputProduct(productDefinition(preparation));
  return Object.freeze({
    status: SELLER_PRESENTATION_OUTPUT_COMPOSITION_STATUS,
    version: SELLER_PRESENTATION_OUTPUT_COMPOSITION_VERSION,
    sellerProductKind: 'SELLER_PRESENTATION',
    preparationReference: preparation,
    outputProduct,
    sellerSections: Object.freeze(outputProduct.sections.map((section) => section.id)),
    sellerModules: Object.freeze(outputProduct.sections.flatMap((section) => section.modules.map((module) => module.id))),
    nextSellerGate: 'READY_FOR_SELLER_PRESENTATION_CONTENT_MODULE_EXPANSION',
    protectedBoundaries: SHARED_OUTPUT_PRODUCT_PROTECTED_BOUNDARIES,
  });
}

export const SELLER_PRESENTATION_REFERENCE_PREPARATION: SellerPresentationPreparationReference = Object.freeze({
  sellerUpdatePacketId: 'seller-update-preparation-reference-v1',
  agentConversationPreparationId: 'agent-conversation-seller-update-review-reference-v1',
  subjectPropertyId: 'seller-subject-property-reference',
  generatedAt: '2026-08-27T00:00:00.000Z',
  effectiveAsOf: '2026-08-27',
});
