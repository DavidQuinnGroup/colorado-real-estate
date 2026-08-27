import {
  type AtlasOutputComposedModule,
  type AtlasOutputComposedSection,
  type AtlasOutputEvidenceReference,
  type AtlasOutputInclusionState,
  type AtlasOutputReviewState,
} from './sharedOutputProductComposition';
import {
  buildSellerDecisionBrief,
  SELLER_DECISION_BRIEF_REFERENCE_PREPARATION,
  type SellerDecisionBrief,
  type SellerDecisionBriefContentClassification,
  type SellerDecisionBriefContentState,
  type SellerDecisionBriefModuleRegistryEntry,
  type SellerDecisionBriefQuestionCoverage,
  type SellerDecisionBriefSectionId,
} from './sellerDecisionBriefFoundation';

export const SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_STATUS =
  'SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_V1_CERTIFIED' as const;
export const SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION =
  'SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_V1' as const;
export const SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_NEXT_GATE =
  'READY_FOR_SELLER_NARRATIVE_STRATEGY_DEPTH' as const;
export const SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_EXPERIENCE_STATUS =
  'AGENT_VISIBLE_COMPOSITION_REVIEW_EXPERIENCE_CERTIFIED_PRINT_PDF_SHARE_DELIVERY_HELD' as const;

export type SellerDecisionBriefPreviewMode = 'AGENT_REVIEW' | 'SELLER_PREVIEW' | 'PRINT_PREVIEW';
export type SellerDecisionBriefReadinessState =
  | 'READY'
  | 'AGENT_INPUT_REQUIRED'
  | 'AGENT_REVIEW_REQUIRED'
  | 'EVIDENCE_REQUIRED'
  | 'RIGHTS_REQUIRED'
  | 'FRESHNESS_REQUIRED'
  | 'CONTEXTUAL_OPTIONAL';

export type SellerDecisionBriefDensity = 'D1' | 'D2' | 'D3' | 'D4';

export type SellerDecisionBriefVisualComponentName =
  | 'OutputCover'
  | 'OutputSectionHeader'
  | 'OutputDecisionSnapshot'
  | 'OutputObjectiveCards'
  | 'OutputPropertyHero'
  | 'OutputPropertyFactGrid'
  | 'OutputLocationMap'
  | 'OutputCohortSummary'
  | 'OutputMetricCard'
  | 'OutputCompetitionMap'
  | 'OutputPropertyCard'
  | 'OutputComparisonMatrix'
  | 'OutputPositioningMatrix'
  | 'OutputPreparationMatrix'
  | 'OutputPropertyStory'
  | 'OutputLaunchTimeline'
  | 'OutputRecommendationCard'
  | 'OutputSellerJourney'
  | 'OutputDecisionChecklist'
  | 'OutputEvidencePanel'
  | 'OutputSourceNote'
  | 'OutputReadinessBadge';

export type SellerDecisionBriefComponentRegistryEntry = Readonly<{
  component: SellerDecisionBriefVisualComponentName;
  sellerModuleIds: readonly string[];
  inputAdapter: string;
  density: SellerDecisionBriefDensity;
  responsive: true;
  print: true;
  reusableProducts: readonly string[];
}>;

export type SellerDecisionBriefModulePresentation = Readonly<{
  module: AtlasOutputComposedModule;
  registry: SellerDecisionBriefModuleRegistryEntry;
  visualComponent: SellerDecisionBriefVisualComponentName;
  readinessState: SellerDecisionBriefReadinessState;
  density: SellerDecisionBriefDensity;
  sellerQuestion: string | null;
  nextAction: string;
  agentAuthorship: boolean;
  includedByDefault: boolean;
  evidence: readonly AtlasOutputEvidenceReference[];
}>;

export type SellerDecisionBriefSectionPresentation = Readonly<{
  section: AtlasOutputComposedSection;
  sectionId: SellerDecisionBriefSectionId;
  density: SellerDecisionBriefDensity;
  readinessState: SellerDecisionBriefReadinessState;
  blockerCount: number;
  modules: readonly SellerDecisionBriefModulePresentation[];
}>;

export type SellerDecisionBriefCompositionPreview = Readonly<{
  status: typeof SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_STATUS;
  version: typeof SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION;
  brief: SellerDecisionBrief;
  route: '/agent/prepare/seller/presentation';
  modes: readonly SellerDecisionBriefPreviewMode[];
  selectedSectionId: SellerDecisionBriefSectionId;
  selectedModuleId: string;
  sectionPresentations: readonly SellerDecisionBriefSectionPresentation[];
  componentRegistry: readonly SellerDecisionBriefComponentRegistryEntry[];
  questionCoverage: readonly SellerDecisionBriefQuestionCoverage[];
  readiness: Readonly<{
    product: AtlasOutputReviewState;
    visualPresentation: 'IMPLEMENTED';
    ui: 'IMPLEMENTED';
    responsive: 'STRUCTURAL_STATES_IMPLEMENTED';
    accessibility: 'SEMANTIC_STRUCTURE_IMPLEMENTED';
    printPreview: 'FOUNDATION_IMPLEMENTED';
    pdf: 'NOT_IMPLEMENTED';
    shareDelivery: 'NOT_IMPLEMENTED';
    persistence: 'NOT_IMPLEMENTED';
  }>;
  protectedBoundaries: Readonly<{
    persistenceAuthorization: false;
    providerRuntime: false;
    customerMutation: false;
    crmMutation: false;
    emailOrMessageExecution: false;
    pdfGeneration: false;
    shareDelivery: false;
    recommendationAutomation: false;
  }>;
  nextGate: typeof SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_NEXT_GATE;
  experienceStatus: typeof SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_EXPERIENCE_STATUS;
}>;

const DENSITY_BY_SECTION: Record<SellerDecisionBriefSectionId, SellerDecisionBriefDensity> = {
  'seller-brief-executive-summary': 'D1',
  'seller-brief-context': 'D2',
  'seller-brief-property': 'D2',
  'seller-brief-location': 'D2',
  'seller-brief-market': 'D2',
  'seller-brief-competition': 'D3',
  'seller-brief-positioning': 'D2',
  'seller-brief-preparation': 'D3',
  'seller-brief-launch': 'D3',
  'seller-brief-recommendations': 'D1',
  'seller-brief-timeline': 'D3',
  'seller-brief-next-decisions': 'D1',
  'seller-brief-evidence-appendix': 'D4',
};

export const SELLER_DECISION_BRIEF_COMPONENT_REGISTRY: readonly SellerDecisionBriefComponentRegistryEntry[] = Object.freeze([
  component('OutputCover', ['seller-module-decision-snapshot'], 'SELLER_PREPARATION', 'D1', ['BUYER_PRESENTATION', 'MARKET_REPORT', 'PROPERTY_ANALYSIS', 'LOCATION_ANALYSIS', 'ADVISORY_BRIEFING']),
  component('OutputSectionHeader', ['*'], 'SHARED_OUTPUT_SECTION', 'D2', ['BUYER_PRESENTATION', 'MARKET_REPORT', 'PROPERTY_ANALYSIS', 'LOCATION_ANALYSIS', 'ADVISORY_BRIEFING']),
  component('OutputDecisionSnapshot', ['seller-module-decision-snapshot'], 'AGENT_INPUT', 'D1', ['ADVISORY_BRIEFING']),
  component('OutputObjectiveCards', ['seller-module-objectives', 'seller-module-timing-constraints'], 'SELLER_PREPARATION', 'D2', ['ADVISORY_BRIEFING']),
  component('OutputPropertyHero', ['seller-module-property-hero'], 'PROPERTY', 'D2', ['PROPERTY_ANALYSIS']),
  component('OutputPropertyFactGrid', ['seller-module-fact-grid'], 'PROPERTY', 'D3', ['PROPERTY_ANALYSIS']),
  component('OutputLocationMap', ['seller-module-location-story'], 'LOCATION', 'D2', ['LOCATION_ANALYSIS', 'PROPERTY_ANALYSIS']),
  component('OutputCohortSummary', ['seller-module-current-market-snapshot'], 'MARKET', 'D2', ['MARKET_REPORT', 'BUYER_PRESENTATION']),
  component('OutputMetricCard', ['seller-module-current-market-snapshot'], 'MARKET', 'D2', ['MARKET_REPORT', 'BUYER_PRESENTATION']),
  component('OutputCompetitionMap', ['seller-module-current-competition'], 'COMPETITION', 'D3', ['PROPERTY_ANALYSIS', 'MARKET_REPORT']),
  component('OutputPropertyCard', ['seller-module-current-competition', 'seller-module-property-hero'], 'PROPERTY', 'D3', ['PROPERTY_ANALYSIS', 'MARKET_REPORT']),
  component('OutputComparisonMatrix', ['seller-module-subject-cohort-matrix'], 'COMPETITION', 'D3', ['PROPERTY_ANALYSIS', 'MARKET_REPORT']),
  component('OutputPositioningMatrix', ['seller-module-positioning-themes'], 'AGENT_INPUT', 'D2', ['ADVISORY_BRIEFING']),
  component('OutputPreparationMatrix', ['seller-module-preparation-plan'], 'SELLER_PREPARATION', 'D3', ['ADVISORY_BRIEFING']),
  component('OutputPropertyStory', ['seller-module-property-story', 'seller-module-asset-plan'], 'AGENT_INPUT', 'D2', ['PROPERTY_ANALYSIS']),
  component('OutputLaunchTimeline', ['seller-module-launch-plan'], 'AGENT_INPUT', 'D3', ['ADVISORY_BRIEFING']),
  component('OutputRecommendationCard', ['seller-module-recommendation-card'], 'AGENT_INPUT', 'D1', ['ADVISORY_BRIEFING']),
  component('OutputSellerJourney', ['seller-module-seller-journey'], 'ADVISORY_HANDOFF', 'D3', ['ADVISORY_BRIEFING']),
  component('OutputDecisionChecklist', ['seller-module-next-decisions'], 'SELLER_PREPARATION', 'D1', ['ADVISORY_BRIEFING']),
  component('OutputEvidencePanel', ['seller-module-evidence-panel'], 'EVIDENCE_FRESHNESS', 'D4', ['ADVISORY_BRIEFING', 'MARKET_REPORT', 'PROPERTY_ANALYSIS', 'LOCATION_ANALYSIS']),
  component('OutputSourceNote', ['*'], 'SHARED_OUTPUT_EVIDENCE', 'D4', ['BUYER_PRESENTATION', 'MARKET_REPORT', 'PROPERTY_ANALYSIS', 'LOCATION_ANALYSIS', 'ADVISORY_BRIEFING']),
  component('OutputReadinessBadge', ['*'], 'SHARED_OUTPUT_READINESS', 'D4', ['BUYER_PRESENTATION', 'MARKET_REPORT', 'PROPERTY_ANALYSIS', 'LOCATION_ANALYSIS', 'ADVISORY_BRIEFING']),
]);

function component(
  componentName: SellerDecisionBriefVisualComponentName,
  sellerModuleIds: readonly string[],
  inputAdapter: string,
  density: SellerDecisionBriefDensity,
  reusableProducts: readonly string[],
): SellerDecisionBriefComponentRegistryEntry {
  return Object.freeze({
    component: componentName,
    sellerModuleIds: Object.freeze([...sellerModuleIds]),
    inputAdapter,
    density,
    responsive: true,
    print: true,
    reusableProducts: Object.freeze([...reusableProducts]),
  });
}

function registryForModule(moduleId: string): SellerDecisionBriefComponentRegistryEntry {
  return SELLER_DECISION_BRIEF_COMPONENT_REGISTRY.find((entry) => entry.sellerModuleIds.includes(moduleId))
    ?? SELLER_DECISION_BRIEF_COMPONENT_REGISTRY.find((entry) => entry.component === 'OutputEvidencePanel')
    ?? SELLER_DECISION_BRIEF_COMPONENT_REGISTRY[0];
}

function readinessFromRegistry(
  registry: SellerDecisionBriefModuleRegistryEntry,
  module: AtlasOutputComposedModule,
): SellerDecisionBriefReadinessState {
  if (module.inclusionState === 'UNAVAILABLE_EVIDENCE' || registry.readinessRule === 'EVIDENCE_REQUIRED') return 'EVIDENCE_REQUIRED';
  if (module.inclusionState === 'UNAVAILABLE_RIGHTS' || registry.readinessRule === 'RIGHTS_REVIEW_REQUIRED') return 'RIGHTS_REQUIRED';
  if (module.inclusionState === 'UNAVAILABLE_FRESHNESS' || registry.readinessRule === 'FRESHNESS_REVIEW_REQUIRED') return 'FRESHNESS_REQUIRED';
  if (registry.readinessRule === 'INPUT_REQUIRED') return 'AGENT_INPUT_REQUIRED';
  if (module.reviewState === 'AGENT_REVIEW_REQUIRED' || registry.readinessRule === 'READY_FOR_AGENT_REVIEW') return 'AGENT_REVIEW_REQUIRED';
  if (module.inclusionState === 'AVAILABLE_OPTIONAL') return 'CONTEXTUAL_OPTIONAL';
  return 'READY';
}

function sectionReadiness(modules: readonly SellerDecisionBriefModulePresentation[]): SellerDecisionBriefReadinessState {
  const priority: readonly SellerDecisionBriefReadinessState[] = [
    'EVIDENCE_REQUIRED',
    'RIGHTS_REQUIRED',
    'FRESHNESS_REQUIRED',
    'AGENT_INPUT_REQUIRED',
    'AGENT_REVIEW_REQUIRED',
    'CONTEXTUAL_OPTIONAL',
    'READY',
  ];
  return priority.find((state) => modules.some((module) => module.readinessState === state)) ?? 'READY';
}

function nextAction(readiness: SellerDecisionBriefReadinessState): string {
  return {
    READY: 'Confirm the visible content and mark the module ready for authorized output.',
    AGENT_INPUT_REQUIRED: 'Add or confirm the Agent-authored input before seller-facing use.',
    AGENT_REVIEW_REQUIRED: 'Review facts, limits, evidence, and wording before release.',
    EVIDENCE_REQUIRED: 'Supply or verify the missing evidence before inclusion.',
    RIGHTS_REQUIRED: 'Confirm rights and client-use authorization before inclusion.',
    FRESHNESS_REQUIRED: 'Refresh or confirm the as-of posture before seller-facing use.',
    CONTEXTUAL_OPTIONAL: 'Decide whether this contextual module belongs in the brief.',
  }[readiness];
}

function hasAgentAuthorship(classification: SellerDecisionBriefContentClassification, readinessRule: SellerDecisionBriefContentState) {
  return classification === 'AGENT_INTERPRETATION' || classification === 'AGENT_RECOMMENDATION' || readinessRule === 'INPUT_REQUIRED';
}

function evidenceForModule(brief: SellerDecisionBrief, module: AtlasOutputComposedModule) {
  return Object.freeze(module.evidenceReferenceIds
    .map((id) => brief.outputProduct.evidenceReferences.find((evidence) => evidence.id === id))
    .filter((evidence): evidence is AtlasOutputEvidenceReference => Boolean(evidence)));
}

function moduleQuestion(questions: readonly SellerDecisionBriefQuestionCoverage[], moduleId: string) {
  return questions.find((coverage) => coverage.moduleIds.includes(moduleId))?.question ?? null;
}

function sectionPresentations(brief: SellerDecisionBrief): readonly SellerDecisionBriefSectionPresentation[] {
  return Object.freeze(brief.outputProduct.sections.map((section) => {
    const sectionId = section.id as SellerDecisionBriefSectionId;
    const modules = Object.freeze(section.modules.map((module) => {
      const registry = brief.moduleRegistry.find((entry) => entry.moduleId === module.id);
      if (!registry) throw new Error(`Missing Seller module registry entry for ${module.id}`);
      const visual = registryForModule(module.id);
      const readiness = readinessFromRegistry(registry, module);
      return Object.freeze({
        module,
        registry,
        visualComponent: visual.component,
        readinessState: readiness,
        density: visual.density,
        sellerQuestion: moduleQuestion(brief.questionCoverage, module.id),
        nextAction: nextAction(readiness),
        agentAuthorship: hasAgentAuthorship(registry.classification, registry.readinessRule),
        includedByDefault: !(['UNAVAILABLE_EVIDENCE', 'UNAVAILABLE_RIGHTS', 'UNAVAILABLE_FRESHNESS', 'EXCLUDED_BY_PRODUCT', 'EXCLUDED_BY_AUDIENCE'] as AtlasOutputInclusionState[]).includes(module.inclusionState),
        evidence: evidenceForModule(brief, module),
      });
    }));
    const readiness = sectionReadiness(modules);
    return Object.freeze({
      section,
      sectionId,
      density: DENSITY_BY_SECTION[sectionId],
      readinessState: readiness,
      blockerCount: modules.filter((module) => module.readinessState !== 'READY').length,
      modules,
    });
  }));
}

export function buildSellerDecisionBriefCompositionPreview(): SellerDecisionBriefCompositionPreview {
  const brief = buildSellerDecisionBrief(SELLER_DECISION_BRIEF_REFERENCE_PREPARATION);
  const sections = sectionPresentations(brief);
  const firstSection = sections[0];
  const firstModule = firstSection.modules[0];
  return Object.freeze({
    status: SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_STATUS,
    version: SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION,
    brief,
    route: '/agent/prepare/seller/presentation',
    modes: Object.freeze(['AGENT_REVIEW', 'SELLER_PREVIEW', 'PRINT_PREVIEW'] as const),
    selectedSectionId: firstSection.sectionId,
    selectedModuleId: firstModule.module.id,
    sectionPresentations: sections,
    componentRegistry: SELLER_DECISION_BRIEF_COMPONENT_REGISTRY,
    questionCoverage: brief.questionCoverage,
    readiness: Object.freeze({
      product: brief.outputProduct.readiness,
      visualPresentation: 'IMPLEMENTED',
      ui: 'IMPLEMENTED',
      responsive: 'STRUCTURAL_STATES_IMPLEMENTED',
      accessibility: 'SEMANTIC_STRUCTURE_IMPLEMENTED',
      printPreview: 'FOUNDATION_IMPLEMENTED',
      pdf: 'NOT_IMPLEMENTED',
      shareDelivery: 'NOT_IMPLEMENTED',
      persistence: 'NOT_IMPLEMENTED',
    }),
    protectedBoundaries: Object.freeze({
      persistenceAuthorization: false,
      providerRuntime: false,
      customerMutation: false,
      crmMutation: false,
      emailOrMessageExecution: false,
      pdfGeneration: false,
      shareDelivery: false,
      recommendationAutomation: false,
    }),
    nextGate: SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_NEXT_GATE,
    experienceStatus: SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_EXPERIENCE_STATUS,
  });
}

export const SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_FIXTURE =
  buildSellerDecisionBriefCompositionPreview();
