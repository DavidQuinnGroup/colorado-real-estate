export const SHARED_OUTPUT_PRODUCT_COMPOSITION_STATUS =
  'PROJECT_ATLAS_SHARED_OUTPUT_PRODUCT_SECTION_MODULE_FOUNDATION_CERTIFIED' as const;
export const SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION = 'SHARED_OUTPUT_PRODUCT_COMPOSITION_V1' as const;

export const ATLAS_OUTPUT_PRODUCT_KINDS = [
  'SELLER_PRESENTATION',
  'BUYER_PRESENTATION',
  'MARKET_REPORT',
  'PROPERTY_ANALYSIS',
  'LOCATION_ANALYSIS',
  'INVESTMENT_PROPERTY_ANALYSIS',
  'MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS',
  'ADVISORY_BRIEFING',
  'AGENT_INTERNAL_ANALYSIS',
] as const;

export const ATLAS_OUTPUT_AUDIENCES = [
  'AGENT_INTERNAL',
  'SELLER',
  'BUYER',
  'INVESTOR',
  'HOMEOWNER',
  'CLIENT',
  'PROSPECT',
  'PUBLIC',
] as const;

export const ATLAS_OUTPUT_SUBJECT_KINDS = [
  'PROPERTY',
  'LOCATION',
  'MARKET',
  'COHORT',
  'CLIENT_DECISION',
  'PORTFOLIO_SCENARIO',
  'MULTI_PROPERTY_SCENARIO',
] as const;

export const ATLAS_OUTPUT_SECTION_KINDS = [
  'EXECUTIVE_OVERVIEW',
  'SUBJECT_CONTEXT',
  'PROPERTY_FACTS',
  'LOCATION_CONTEXT',
  'MARKET_CONTEXT',
  'COMPARATIVE_CONTEXT',
  'FINANCIAL_CONTEXT',
  'STRATEGY_REVIEW',
  'EVIDENCE_AND_LIMITATIONS',
  'NEXT_STEPS',
] as const;

export const ATLAS_OUTPUT_MODULE_KINDS = [
  'EXECUTIVE_SUMMARY',
  'SUBJECT_PROPERTY',
  'PROPERTY_FACTS',
  'LOCATION_CONTEXT',
  'MARKET_SNAPSHOT',
  'COHORT_COMPARISON',
  'MULTI_MARKET_COMPARISON',
  'CURRENT_COMPETITION',
  'PROPERTY_POSITIONING',
  'DECISION_CONTEXT',
  'FINANCIAL_SCENARIO',
  'RECOMMENDATION',
  'NARRATIVE',
  'METRIC_GROUP',
  'COMPARISON_TABLE',
  'CHART',
  'MAP',
  'PROPERTY_CARD_GROUP',
  'EVIDENCE_NOTES',
  'DISCLOSURES',
  'AGENT_COMMENTARY',
] as const;

export type AtlasOutputProductKind = (typeof ATLAS_OUTPUT_PRODUCT_KINDS)[number];
export type AtlasOutputAudience = (typeof ATLAS_OUTPUT_AUDIENCES)[number];
export type AtlasOutputSubjectKind = (typeof ATLAS_OUTPUT_SUBJECT_KINDS)[number];
export type AtlasOutputSectionKind = (typeof ATLAS_OUTPUT_SECTION_KINDS)[number];
export type AtlasOutputModuleKind = (typeof ATLAS_OUTPUT_MODULE_KINDS)[number];

export type AtlasOutputSourceReference = Readonly<{
  id: string;
  kind: 'PREPARATION_PACKET' | 'INTELLIGENCE_PACKET' | 'ANALYSIS_PACKET' | 'SOURCE_RECORD' | 'CALCULATION_VERSION';
  repositoryReference: string;
}>;

export type AtlasOutputEvidenceState =
  | 'ADMITTED'
  | 'AVAILABLE_WITH_LIMITATIONS'
  | 'MISSING'
  | 'CONFLICTING'
  | 'PROFESSIONAL_VERIFICATION_REQUIRED';

export type AtlasOutputRightsState =
  | 'ADMITTED_FOR_AGENT_INTERNAL'
  | 'ADMITTED_FOR_SPECIFIC_CLIENT'
  | 'ADMITTED_FOR_AUTHENTICATED_CONSUMER'
  | 'ADMITTED_FOR_PUBLIC'
  | 'REQUIRES_REVIEW'
  | 'NOT_ADMITTED';

export type AtlasOutputFreshnessState =
  | 'CURRENT'
  | 'POINT_IN_TIME'
  | 'DATED_DURABLE_CONTEXT'
  | 'STALE_REVIEW_REQUIRED'
  | 'UNKNOWN_REVIEW_REQUIRED'
  | 'NOT_APPLICABLE';

export type AtlasOutputReviewState =
  | 'DRAFT'
  | 'COMPOSED'
  | 'AGENT_REVIEW_REQUIRED'
  | 'AGENT_REVIEWED'
  | 'READY_FOR_AUTHORIZED_OUTPUT'
  | 'FAIL_CLOSED';

export type AtlasOutputInclusionState =
  | 'INCLUDED'
  | 'AVAILABLE_OPTIONAL'
  | 'EXCLUDED_BY_PRODUCT'
  | 'EXCLUDED_BY_AUDIENCE'
  | 'UNAVAILABLE_EVIDENCE'
  | 'UNAVAILABLE_RIGHTS'
  | 'UNAVAILABLE_FRESHNESS'
  | 'REVIEW_REQUIRED';

export type AtlasOutputEvidenceReference = Readonly<{
  id: string;
  label: string;
  sourceReferenceIds: readonly string[];
  evidenceState: AtlasOutputEvidenceState;
  rightsState: AtlasOutputRightsState;
  freshnessState: AtlasOutputFreshnessState;
  asOf: string | null;
  limitations: readonly string[];
}>;

export type AtlasOutputSubjectReference = Readonly<{
  kind: AtlasOutputSubjectKind;
  id: string;
  label: string;
  repositoryReference: string | null;
}>;

export type AtlasOutputProductContext = Readonly<{
  subject: AtlasOutputSubjectReference;
  audience: AtlasOutputAudience;
  purpose: string;
  authorContext: 'AGENT_PREPARATION';
  clientContext: 'NONE' | 'STRUCTURAL_REFERENCE_ONLY' | 'EXPLICIT_RECIPIENT_REVIEW_REQUIRED';
}>;

export type AtlasOutputReviewRequirement = Readonly<{
  id: string;
  label: string;
  required: boolean;
  reason: string;
}>;

export type AtlasOutputModuleDefinition = Readonly<{
  id: string;
  kind: AtlasOutputModuleKind;
  title: string;
  supportedProducts: readonly AtlasOutputProductKind[];
  supportedAudiences: readonly AtlasOutputAudience[];
  required: boolean;
  order: number;
  evidenceReferenceIds: readonly string[];
  intelligenceReferenceIds: readonly string[];
  analysisReferenceIds: readonly string[];
  narrativeReference: string | null;
  visualizationReference: string | null;
  rightsRequirement: AtlasOutputRightsState;
  freshnessRequirement: AtlasOutputFreshnessState;
  reviewRequired: boolean;
  limitations: readonly string[];
}>;

export type AtlasOutputSectionDefinition = Readonly<{
  id: string;
  kind: AtlasOutputSectionKind;
  title: string;
  supportedProducts: readonly AtlasOutputProductKind[];
  supportedAudiences: readonly AtlasOutputAudience[];
  required: boolean;
  order: number;
  moduleIds: readonly string[];
  evidenceRequirementIds: readonly string[];
  rightsRequirement: AtlasOutputRightsState;
  freshnessRequirement: AtlasOutputFreshnessState;
  reviewRequired: boolean;
  presentation: Readonly<{
    display: 'STANDARD' | 'COMPACT' | 'APPENDIX';
    printCandidate: boolean;
    visualCandidate: boolean;
  }>;
}>;

export type AtlasOutputComposedModule = AtlasOutputModuleDefinition & Readonly<{
  inclusionState: AtlasOutputInclusionState;
  reviewState: AtlasOutputReviewState;
  blockingReasons: readonly string[];
}>;

export type AtlasOutputComposedSection = AtlasOutputSectionDefinition & Readonly<{
  inclusionState: AtlasOutputInclusionState;
  reviewState: AtlasOutputReviewState;
  modules: readonly AtlasOutputComposedModule[];
  blockingReasons: readonly string[];
}>;

export type AtlasOutputProductDefinition = Readonly<{
  productKind: AtlasOutputProductKind;
  productId: string;
  title: string;
  version: typeof SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION;
  generatedAt: string;
  effectiveAsOf: string;
  context: AtlasOutputProductContext;
  sourceReferences: readonly AtlasOutputSourceReference[];
  evidenceReferences: readonly AtlasOutputEvidenceReference[];
  sections: readonly AtlasOutputSectionDefinition[];
  modules: readonly AtlasOutputModuleDefinition[];
  reviewRequirements: readonly AtlasOutputReviewRequirement[];
  intendedFormats: readonly ('AGENT_REVIEW_PACKET' | 'SCREEN_PREVIEW' | 'PRINT' | 'PDF' | 'SHARE_LINK')[];
  protectedBoundaries: Readonly<{
    deliveryAuthorization: false;
    publicationAuthorization: false;
    persistenceAuthorization: false;
    providerMutation: false;
    customerMutation: false;
    crmMutation: false;
    emailOrMessageExecution: false;
    recommendation: false;
    ranking: false;
    scoring: false;
  }>;
}>;

export type AtlasOutputComposedProduct = Omit<AtlasOutputProductDefinition, 'sections' | 'modules'> & Readonly<{
  status: typeof SHARED_OUTPUT_PRODUCT_COMPOSITION_STATUS;
  contract: typeof SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION;
  readiness: AtlasOutputReviewState;
  sections: readonly AtlasOutputComposedSection[];
  evidenceSummary: Readonly<{
    admitted: number;
    missing: number;
    rightsReview: number;
    freshnessReview: number;
  }>;
  deterministicCompositionId: string;
  reasons: readonly string[];
}>;

export const SHARED_OUTPUT_PRODUCT_PROTECTED_BOUNDARIES: AtlasOutputProductDefinition['protectedBoundaries'] = Object.freeze({
  deliveryAuthorization: false,
  publicationAuthorization: false,
  persistenceAuthorization: false,
  providerMutation: false,
  customerMutation: false,
  crmMutation: false,
  emailOrMessageExecution: false,
  recommendation: false,
  ranking: false,
  scoring: false,
});

function text(value: string) {
  return value.trim();
}

function unique(values: readonly string[]) {
  return Object.freeze([...new Set(values.map(text).filter(Boolean))]);
}

function isProductKind(value: string): value is AtlasOutputProductKind {
  return ATLAS_OUTPUT_PRODUCT_KINDS.includes(value as AtlasOutputProductKind);
}

function isAudience(value: string): value is AtlasOutputAudience {
  return ATLAS_OUTPUT_AUDIENCES.includes(value as AtlasOutputAudience);
}

function stableSlug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'unknown';
}

function evidenceById(definition: AtlasOutputProductDefinition) {
  return new Map(definition.evidenceReferences.map((evidence) => [evidence.id, evidence]));
}

function sourceById(definition: AtlasOutputProductDefinition) {
  return new Map(definition.sourceReferences.map((source) => [source.id, source]));
}

function failClosed(definition: AtlasOutputProductDefinition, reasons: readonly string[]): AtlasOutputComposedProduct {
  return Object.freeze({
    status: SHARED_OUTPUT_PRODUCT_COMPOSITION_STATUS,
    contract: SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
    productKind: isProductKind(definition.productKind) ? definition.productKind : 'AGENT_INTERNAL_ANALYSIS',
    productId: text(definition.productId) || 'fail-closed-output-product',
    title: text(definition.title) || 'Fail-closed output product',
    version: SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
    generatedAt: text(definition.generatedAt) || 'missing-generated-at',
    effectiveAsOf: text(definition.effectiveAsOf) || 'missing-effective-as-of',
    context: definition.context,
    sourceReferences: Object.freeze([]),
    evidenceReferences: Object.freeze([]),
    reviewRequirements: Object.freeze(definition.reviewRequirements),
    intendedFormats: Object.freeze([...definition.intendedFormats]),
    protectedBoundaries: SHARED_OUTPUT_PRODUCT_PROTECTED_BOUNDARIES,
    readiness: 'FAIL_CLOSED',
    sections: Object.freeze([]),
    evidenceSummary: Object.freeze({ admitted: 0, missing: 0, rightsReview: 0, freshnessReview: 0 }),
    deterministicCompositionId: `atlas-output-fail-closed-${stableSlug(definition.productId)}-v1`,
    reasons: Object.freeze([...new Set(reasons)].sort()),
  });
}

function validateDefinition(definition: AtlasOutputProductDefinition): readonly string[] {
  const reasons: string[] = [];
  if (!isProductKind(definition.productKind)) reasons.push('OUTPUT_PRODUCT_KIND_INVALID');
  if (!text(definition.productId)) reasons.push('OUTPUT_PRODUCT_ID_REQUIRED');
  if (!text(definition.title)) reasons.push('OUTPUT_PRODUCT_TITLE_REQUIRED');
  if (definition.version !== SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION) reasons.push('OUTPUT_PRODUCT_VERSION_INVALID');
  if (!text(definition.generatedAt)) reasons.push('OUTPUT_PRODUCT_GENERATED_AT_REQUIRED');
  if (!text(definition.effectiveAsOf)) reasons.push('OUTPUT_PRODUCT_EFFECTIVE_AS_OF_REQUIRED');
  if (!isAudience(definition.context.audience)) reasons.push('OUTPUT_PRODUCT_AUDIENCE_INVALID');
  if (!text(definition.context.subject.id) || !text(definition.context.subject.label)) reasons.push('OUTPUT_PRODUCT_SUBJECT_REQUIRED');
  if (!text(definition.context.purpose)) reasons.push('OUTPUT_PRODUCT_PURPOSE_REQUIRED');
  if (definition.context.authorContext !== 'AGENT_PREPARATION') reasons.push('OUTPUT_PRODUCT_AUTHOR_CONTEXT_INVALID');
  if (definition.sourceReferences.length === 0) reasons.push('OUTPUT_PRODUCT_SOURCE_REFERENCES_REQUIRED');
  if (definition.evidenceReferences.length === 0) reasons.push('OUTPUT_PRODUCT_EVIDENCE_REFERENCES_REQUIRED');
  if (definition.sections.length === 0) reasons.push('OUTPUT_PRODUCT_SECTIONS_REQUIRED');
  if (definition.modules.length === 0) reasons.push('OUTPUT_PRODUCT_MODULES_REQUIRED');
  if (definition.reviewRequirements.length === 0) reasons.push('OUTPUT_PRODUCT_REVIEW_REQUIREMENTS_REQUIRED');
  if (definition.intendedFormats.length === 0) reasons.push('OUTPUT_PRODUCT_INTENDED_FORMAT_REQUIRED');
  for (const [boundary, value] of Object.entries(definition.protectedBoundaries)) {
    if (value !== false) reasons.push(`OUTPUT_PRODUCT_PROTECTED_BOUNDARY_MUST_BE_FALSE_${boundary}`);
  }
  const sources = sourceById(definition);
  for (const evidence of definition.evidenceReferences) {
    if (!text(evidence.id) || !text(evidence.label)) reasons.push('OUTPUT_EVIDENCE_ID_AND_LABEL_REQUIRED');
    if (evidence.sourceReferenceIds.length === 0) reasons.push(`OUTPUT_EVIDENCE_SOURCE_REQUIRED_${evidence.id}`);
    if (evidence.sourceReferenceIds.some((sourceId) => !sources.has(sourceId))) reasons.push(`OUTPUT_EVIDENCE_UNKNOWN_SOURCE_${evidence.id}`);
    if (evidence.limitations.length === 0) reasons.push(`OUTPUT_EVIDENCE_LIMITATIONS_REQUIRED_${evidence.id}`);
  }
  const modules = new Map(definition.modules.map((module) => [module.id, module]));
  for (const section of definition.sections) {
    if (!text(section.id) || !text(section.title)) reasons.push('OUTPUT_SECTION_ID_AND_TITLE_REQUIRED');
    if (!section.supportedProducts.includes(definition.productKind)) reasons.push(`OUTPUT_SECTION_PRODUCT_NOT_SUPPORTED_${section.id}`);
    if (!section.supportedAudiences.includes(definition.context.audience)) reasons.push(`OUTPUT_SECTION_AUDIENCE_NOT_SUPPORTED_${section.id}`);
    if (section.moduleIds.length === 0) reasons.push(`OUTPUT_SECTION_MODULES_REQUIRED_${section.id}`);
    if (section.moduleIds.some((moduleId) => !modules.has(moduleId))) reasons.push(`OUTPUT_SECTION_UNKNOWN_MODULE_${section.id}`);
  }
  const evidence = evidenceById(definition);
  for (const module of definition.modules) {
    if (!text(module.id) || !text(module.title)) reasons.push('OUTPUT_MODULE_ID_AND_TITLE_REQUIRED');
    if (!module.supportedProducts.includes(definition.productKind)) reasons.push(`OUTPUT_MODULE_PRODUCT_NOT_SUPPORTED_${module.id}`);
    if (!module.supportedAudiences.includes(definition.context.audience)) reasons.push(`OUTPUT_MODULE_AUDIENCE_NOT_SUPPORTED_${module.id}`);
    if (module.evidenceReferenceIds.length === 0) reasons.push(`OUTPUT_MODULE_EVIDENCE_REQUIRED_${module.id}`);
    if (module.evidenceReferenceIds.some((evidenceId) => !evidence.has(evidenceId))) reasons.push(`OUTPUT_MODULE_UNKNOWN_EVIDENCE_${module.id}`);
    if (module.limitations.length === 0) reasons.push(`OUTPUT_MODULE_LIMITATIONS_REQUIRED_${module.id}`);
  }
  return Object.freeze([...new Set(reasons)].sort());
}

function moduleInclusion(module: AtlasOutputModuleDefinition, definition: AtlasOutputProductDefinition): Pick<AtlasOutputComposedModule, 'inclusionState' | 'reviewState' | 'blockingReasons'> {
  const evidence = evidenceById(definition);
  const referencedEvidence = module.evidenceReferenceIds.map((id) => evidence.get(id)).filter((item): item is AtlasOutputEvidenceReference => Boolean(item));
  const blockingReasons: string[] = [];
  if (!module.supportedProducts.includes(definition.productKind)) blockingReasons.push('MODULE_PRODUCT_NOT_APPLICABLE');
  if (!module.supportedAudiences.includes(definition.context.audience)) blockingReasons.push('MODULE_AUDIENCE_NOT_APPLICABLE');
  if (referencedEvidence.some((item) => item.evidenceState === 'MISSING' || item.evidenceState === 'CONFLICTING')) blockingReasons.push('MODULE_EVIDENCE_UNAVAILABLE');
  if (referencedEvidence.some((item) => item.rightsState === 'NOT_ADMITTED' || item.rightsState === 'REQUIRES_REVIEW')) blockingReasons.push('MODULE_RIGHTS_REVIEW_REQUIRED');
  if (referencedEvidence.some((item) => item.freshnessState === 'STALE_REVIEW_REQUIRED' || item.freshnessState === 'UNKNOWN_REVIEW_REQUIRED')) blockingReasons.push('MODULE_FRESHNESS_REVIEW_REQUIRED');
  if (module.reviewRequired || referencedEvidence.some((item) => item.evidenceState === 'PROFESSIONAL_VERIFICATION_REQUIRED')) blockingReasons.push('MODULE_AGENT_REVIEW_REQUIRED');

  if (blockingReasons.includes('MODULE_PRODUCT_NOT_APPLICABLE')) return { inclusionState: 'EXCLUDED_BY_PRODUCT', reviewState: 'FAIL_CLOSED', blockingReasons: Object.freeze(blockingReasons) };
  if (blockingReasons.includes('MODULE_AUDIENCE_NOT_APPLICABLE')) return { inclusionState: 'EXCLUDED_BY_AUDIENCE', reviewState: 'FAIL_CLOSED', blockingReasons: Object.freeze(blockingReasons) };
  if (blockingReasons.includes('MODULE_EVIDENCE_UNAVAILABLE')) return { inclusionState: 'UNAVAILABLE_EVIDENCE', reviewState: 'AGENT_REVIEW_REQUIRED', blockingReasons: Object.freeze(blockingReasons) };
  if (blockingReasons.includes('MODULE_RIGHTS_REVIEW_REQUIRED')) return { inclusionState: 'UNAVAILABLE_RIGHTS', reviewState: 'AGENT_REVIEW_REQUIRED', blockingReasons: Object.freeze(blockingReasons) };
  if (blockingReasons.includes('MODULE_FRESHNESS_REVIEW_REQUIRED')) return { inclusionState: 'UNAVAILABLE_FRESHNESS', reviewState: 'AGENT_REVIEW_REQUIRED', blockingReasons: Object.freeze(blockingReasons) };
  if (blockingReasons.includes('MODULE_AGENT_REVIEW_REQUIRED')) return { inclusionState: 'REVIEW_REQUIRED', reviewState: 'AGENT_REVIEW_REQUIRED', blockingReasons: Object.freeze(blockingReasons) };
  return { inclusionState: module.required ? 'INCLUDED' : 'AVAILABLE_OPTIONAL', reviewState: 'COMPOSED', blockingReasons: Object.freeze([]) };
}

function composeModule(module: AtlasOutputModuleDefinition, definition: AtlasOutputProductDefinition): AtlasOutputComposedModule {
  const inclusion = moduleInclusion(module, definition);
  return Object.freeze({ ...module, evidenceReferenceIds: unique(module.evidenceReferenceIds), intelligenceReferenceIds: unique(module.intelligenceReferenceIds), analysisReferenceIds: unique(module.analysisReferenceIds), ...inclusion });
}

function composeSection(section: AtlasOutputSectionDefinition, modules: readonly AtlasOutputComposedModule[], definition: AtlasOutputProductDefinition): AtlasOutputComposedSection {
  const sectionModules = section.moduleIds
    .map((moduleId) => modules.find((module) => module.id === moduleId))
    .filter((module): module is AtlasOutputComposedModule => Boolean(module))
    .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));
  const blockingReasons: string[] = [];
  if (!section.supportedProducts.includes(definition.productKind)) blockingReasons.push('SECTION_PRODUCT_NOT_APPLICABLE');
  if (!section.supportedAudiences.includes(definition.context.audience)) blockingReasons.push('SECTION_AUDIENCE_NOT_APPLICABLE');
  if (sectionModules.some((module) => module.required && module.inclusionState === 'UNAVAILABLE_EVIDENCE')) blockingReasons.push('SECTION_EVIDENCE_UNAVAILABLE');
  if (sectionModules.some((module) => module.required && module.inclusionState === 'UNAVAILABLE_RIGHTS')) blockingReasons.push('SECTION_RIGHTS_REVIEW_REQUIRED');
  if (sectionModules.some((module) => module.required && module.inclusionState === 'UNAVAILABLE_FRESHNESS')) blockingReasons.push('SECTION_FRESHNESS_REVIEW_REQUIRED');
  if (section.reviewRequired || sectionModules.some((module) => module.reviewState === 'AGENT_REVIEW_REQUIRED')) blockingReasons.push('SECTION_AGENT_REVIEW_REQUIRED');

  const inclusionState: AtlasOutputInclusionState =
    blockingReasons.includes('SECTION_PRODUCT_NOT_APPLICABLE') ? 'EXCLUDED_BY_PRODUCT'
      : blockingReasons.includes('SECTION_AUDIENCE_NOT_APPLICABLE') ? 'EXCLUDED_BY_AUDIENCE'
        : blockingReasons.includes('SECTION_EVIDENCE_UNAVAILABLE') ? 'UNAVAILABLE_EVIDENCE'
          : blockingReasons.includes('SECTION_RIGHTS_REVIEW_REQUIRED') ? 'UNAVAILABLE_RIGHTS'
            : blockingReasons.includes('SECTION_FRESHNESS_REVIEW_REQUIRED') ? 'UNAVAILABLE_FRESHNESS'
              : blockingReasons.includes('SECTION_AGENT_REVIEW_REQUIRED') ? 'REVIEW_REQUIRED'
                : section.required ? 'INCLUDED' : 'AVAILABLE_OPTIONAL';
  const reviewState: AtlasOutputReviewState = blockingReasons.length > 0 ? 'AGENT_REVIEW_REQUIRED' : 'COMPOSED';
  return Object.freeze({ ...section, moduleIds: unique(section.moduleIds), modules: Object.freeze(sectionModules), inclusionState, reviewState, blockingReasons: Object.freeze(blockingReasons) });
}

function productReadiness(sections: readonly AtlasOutputComposedSection[], definition: AtlasOutputProductDefinition): AtlasOutputReviewState {
  if (sections.some((section) => section.required && (section.inclusionState === 'EXCLUDED_BY_PRODUCT' || section.inclusionState === 'EXCLUDED_BY_AUDIENCE' || section.inclusionState === 'UNAVAILABLE_EVIDENCE'))) return 'FAIL_CLOSED';
  if (sections.some((section) => ['UNAVAILABLE_RIGHTS', 'UNAVAILABLE_FRESHNESS', 'REVIEW_REQUIRED'].includes(section.inclusionState))) return 'AGENT_REVIEW_REQUIRED';
  if (definition.reviewRequirements.some((requirement) => requirement.required)) return 'AGENT_REVIEW_REQUIRED';
  return 'COMPOSED';
}

function evidenceSummary(evidenceReferences: readonly AtlasOutputEvidenceReference[]) {
  return Object.freeze({
    admitted: evidenceReferences.filter((item) => item.evidenceState === 'ADMITTED' || item.evidenceState === 'AVAILABLE_WITH_LIMITATIONS').length,
    missing: evidenceReferences.filter((item) => item.evidenceState === 'MISSING' || item.evidenceState === 'CONFLICTING').length,
    rightsReview: evidenceReferences.filter((item) => item.rightsState === 'REQUIRES_REVIEW' || item.rightsState === 'NOT_ADMITTED').length,
    freshnessReview: evidenceReferences.filter((item) => item.freshnessState === 'STALE_REVIEW_REQUIRED' || item.freshnessState === 'UNKNOWN_REVIEW_REQUIRED').length,
  });
}

export function buildAtlasOutputProduct(definition: AtlasOutputProductDefinition): AtlasOutputComposedProduct {
  const validation = validateDefinition(definition);
  if (validation.length > 0) return failClosed(definition, validation);

  const modules = Object.freeze(definition.modules
    .map((module) => composeModule(module, definition))
    .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id)));
  const sections = Object.freeze(definition.sections
    .map((section) => composeSection(section, modules, definition))
    .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id)));
  const readiness = productReadiness(sections, definition);
  const summary = evidenceSummary(definition.evidenceReferences);
  const deterministicCompositionId = [
    'atlas-output',
    stableSlug(definition.productKind),
    stableSlug(definition.productId),
    stableSlug(definition.context.audience),
    stableSlug(definition.context.subject.id),
    stableSlug(definition.effectiveAsOf),
    'v1',
  ].join('-');

  return Object.freeze({
    status: SHARED_OUTPUT_PRODUCT_COMPOSITION_STATUS,
    contract: SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
    productKind: definition.productKind,
    productId: definition.productId,
    title: definition.title,
    version: SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
    generatedAt: definition.generatedAt,
    effectiveAsOf: definition.effectiveAsOf,
    context: definition.context,
    sourceReferences: Object.freeze(definition.sourceReferences.map((source) => Object.freeze(source))),
    evidenceReferences: Object.freeze(definition.evidenceReferences.map((evidence) => Object.freeze({ ...evidence, sourceReferenceIds: unique(evidence.sourceReferenceIds), limitations: unique(evidence.limitations) }))),
    reviewRequirements: Object.freeze(definition.reviewRequirements.map((requirement) => Object.freeze(requirement))),
    intendedFormats: Object.freeze([...definition.intendedFormats]),
    protectedBoundaries: SHARED_OUTPUT_PRODUCT_PROTECTED_BOUNDARIES,
    readiness,
    sections,
    evidenceSummary: summary,
    deterministicCompositionId,
    reasons: Object.freeze(sections.flatMap((section) => section.blockingReasons.map((reason) => `${section.id}:${reason}`))),
  });
}
