export const AGENT_BRIEFING_COMPOSITION_STATUS = 'AGENT_WORKSPACE_SHARED_BRIEFING_COMPOSITION_AND_PAGE_IDENTITY_RECONCILIATION_MVV' as const;

export const AGENT_BRIEFING_CONTENT_CLASSES = [
  'DIRECT_FACT',
  'DERIVED_FACT',
  'GOVERNED_EDITORIAL_CONTEXT',
  'SUPPORTED_SYNTHESIS',
  'LIMITATION',
  'VERIFICATION_TRIGGER',
  'PROFESSIONAL_HANDOFF',
  'NOT_AUTHORIZED',
] as const;

export type AgentBriefingContentClass = (typeof AGENT_BRIEFING_CONTENT_CLASSES)[number];
export type AgentBriefingSurface = 'MARKET' | 'PLACE' | 'PROPERTY' | 'BUYER' | 'SELLER' | 'LISTING';

export type AgentBriefingTraceability = Readonly<{
  sourceReferences: readonly string[];
  evidenceKeys: readonly string[];
  freshness: 'CURRENT' | 'DATED_DURABLE_CONTEXT' | 'POINT_IN_TIME' | 'NOT_APPLICABLE';
  compositionRule: 'DIRECT_RENDER' | 'GOVERNED_CONTEXT_RENDER' | 'FACT_AND_CONTEXT_SYNTHESIS' | 'LIMITATION_RENDER' | 'VERIFICATION_TRIGGER_RENDER' | 'PROFESSIONAL_CHECKPOINT_RENDER';
}>;

export type AgentBriefingStatement = Readonly<{
  id: string;
  contentClass: Exclude<AgentBriefingContentClass, 'NOT_AUTHORIZED'>;
  text: string;
  traceability: AgentBriefingTraceability;
}>;

export type AgentBriefingEvidence = AgentBriefingStatement & Readonly<{ label: string; value: string }>;
export type AgentBriefingQuestion = Readonly<{ id: string; text: string; triggerEvidenceKeys: readonly string[] }>;
export const AGENT_BRIEFING_CONTEXTUAL_CAPABILITY_HREFS = [
  '/agent/prepare/market',
  '/agent/prepare/place',
  '/agent/prepare/property',
  '/agent/prepare/buyer',
  '/agent/prepare/seller',
  '/agent/prepare/listing',
] as const;
export type AgentBriefingContextualCapabilityHref =
  (typeof AGENT_BRIEFING_CONTEXTUAL_CAPABILITY_HREFS)[number];
export type AgentBriefingNextAction = Readonly<{
  id: string;
  category: 'Agent action' | 'Client discussion item' | 'Professional verification' | 'Future ATLAS action';
  text: string;
  href?: AgentBriefingContextualCapabilityHref;
}>;
export type AgentBriefingReviewSurface = Readonly<{ id: string; label: string; href: string }>;
export type AgentBriefingProfessionalCheckpoint = Readonly<{ id: string; role: string; question: string; traceability: AgentBriefingTraceability }>;

export type AgentBriefingComposition = Readonly<{
  status: typeof AGENT_BRIEFING_COMPOSITION_STATUS;
  surface: AgentBriefingSurface;
  subject: string;
  executiveBriefing: AgentBriefingStatement;
  whatMatters: readonly AgentBriefingStatement[];
  whyItMatters: readonly AgentBriefingStatement[];
  keyEvidence: readonly AgentBriefingEvidence[];
  whatCouldChangeInterpretation: readonly AgentBriefingStatement[];
  questionsWorthAsking: readonly AgentBriefingQuestion[];
  nextActions?: readonly AgentBriefingNextAction[];
  reviewSurfaces: readonly AgentBriefingReviewSurface[];
  sourcesFreshnessLimitations: readonly AgentBriefingStatement[];
  professionalCheckpoints: readonly AgentBriefingProfessionalCheckpoint[];
  protectedBoundaries: Readonly<{
    customerData: false;
    persistence: false;
    providerActivity: false;
    recommendation: false;
    suitability: false;
    fairHousingInference: false;
  }>;
}>;

type AgentBriefingCompositionInput = Omit<AgentBriefingComposition, 'status' | 'protectedBoundaries'>;

const PROTECTED_BOUNDARIES = Object.freeze({
  customerData: false,
  persistence: false,
  providerActivity: false,
  recommendation: false,
  suitability: false,
  fairHousingInference: false,
} as const);

const EXECUTIVE_ALLOWED = new Set<AgentBriefingStatement['contentClass']>(['DIRECT_FACT', 'DERIVED_FACT', 'GOVERNED_EDITORIAL_CONTEXT', 'SUPPORTED_SYNTHESIS', 'LIMITATION']);
const SYNTHESIS_RULES = new Set<AgentBriefingTraceability['compositionRule']>(['FACT_AND_CONTEXT_SYNTHESIS', 'GOVERNED_CONTEXT_RENDER']);

function unique(values: readonly string[]) {
  return [...new Set(values.filter(Boolean))];
}

export function hasMaterialBriefingSection(
  items: readonly Readonly<{ text: string }>[] | undefined,
) {
  return Boolean(items?.some((item) => item.text.trim()));
}

function validateStatement(statement: AgentBriefingStatement, location: string) {
  if (!statement.id || !statement.text.trim()) throw new Error(`${location} requires a stable id and visible text.`);
  if (!statement.traceability.sourceReferences.length || !statement.traceability.evidenceKeys.length) throw new Error(`${location} requires source and evidence traceability.`);
  if (statement.contentClass === 'SUPPORTED_SYNTHESIS' && !SYNTHESIS_RULES.has(statement.traceability.compositionRule)) throw new Error(`${location} has unsupported synthesis.`);
}

function validateQuestions(questions: readonly AgentBriefingQuestion[]) {
  if (questions.length > 5) throw new Error('Questions must be bounded to five high-value items.');
  for (const question of questions) {
    if (!question.id || !question.text.trim() || !question.triggerEvidenceKeys.length) throw new Error('Questions must be specific and traceable to material evidence.');
  }
}

function validateNextActions(actions: readonly AgentBriefingNextAction[] | undefined) {
  if (!actions) return;
  if (actions.length > 5) throw new Error('Next actions must be bounded to five useful items.');
  for (const action of actions) {
    if (!action.id || !action.text.trim() || !action.category) throw new Error('Next actions require stable, visible, categorized content.');
    if (
      action.href &&
      !AGENT_BRIEFING_CONTEXTUAL_CAPABILITY_HREFS.includes(action.href)
    )
      throw new Error('Contextual actions require an exact authorized capability route.');
  }
}

function validateDuplication(input: AgentBriefingCompositionInput) {
  const counts = new Map<string, number>();
  const visibleStatements = [
    input.executiveBriefing,
    ...input.whatMatters,
    ...input.whyItMatters,
    ...input.keyEvidence,
    ...input.whatCouldChangeInterpretation,
    ...input.sourcesFreshnessLimitations,
  ];
  for (const statement of visibleStatements) {
    for (const key of unique(statement.traceability.evidenceKeys)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  if ([...counts.values()].some((count) => count > 3)) throw new Error('Visible evidence duplication exceeds the governed threshold.');
}

export function composeAgentBriefing(input: AgentBriefingCompositionInput): AgentBriefingComposition {
  if (!input.subject.trim()) throw new Error('A briefing subject is required.');
  if (!EXECUTIVE_ALLOWED.has(input.executiveBriefing.contentClass)) throw new Error('Executive briefing cannot lead with verification or professional handoff content.');
  validateStatement(input.executiveBriefing, 'Executive briefing');
  for (const [location, statements] of Object.entries({
    whatMatters: input.whatMatters,
    whyItMatters: input.whyItMatters,
    whatCouldChangeInterpretation: input.whatCouldChangeInterpretation,
    sourcesFreshnessLimitations: input.sourcesFreshnessLimitations,
  })) for (const statement of statements) validateStatement(statement, location);
  for (const evidence of input.keyEvidence) validateStatement(evidence, 'Key evidence');
  validateQuestions(input.questionsWorthAsking);
  validateNextActions(input.nextActions);
  if (input.professionalCheckpoints.some((checkpoint) => checkpoint.role === 'REAL_ESTATE_AGENT')) throw new Error('The current Agent must not receive a redundant Real Estate Agent handoff.');
  for (const checkpoint of input.professionalCheckpoints) {
    if (!checkpoint.id || !checkpoint.role || !checkpoint.question || !checkpoint.traceability.sourceReferences.length) throw new Error('Professional checkpoints require external-role traceability.');
  }
  validateDuplication(input);

  return Object.freeze({
    status: AGENT_BRIEFING_COMPOSITION_STATUS,
    ...input,
    executiveBriefing: Object.freeze({ ...input.executiveBriefing, traceability: Object.freeze({ ...input.executiveBriefing.traceability, sourceReferences: Object.freeze(unique(input.executiveBriefing.traceability.sourceReferences)), evidenceKeys: Object.freeze(unique(input.executiveBriefing.traceability.evidenceKeys)) }) }),
    whatMatters: Object.freeze(input.whatMatters.map((statement) => Object.freeze(statement))),
    whyItMatters: Object.freeze(input.whyItMatters.map((statement) => Object.freeze(statement))),
    keyEvidence: Object.freeze(input.keyEvidence.map((statement) => Object.freeze(statement))),
    whatCouldChangeInterpretation: Object.freeze(input.whatCouldChangeInterpretation.map((statement) => Object.freeze(statement))),
    questionsWorthAsking: Object.freeze(input.questionsWorthAsking.map((question) => Object.freeze({ ...question, triggerEvidenceKeys: Object.freeze(unique(question.triggerEvidenceKeys)) }))),
    nextActions: input.nextActions ? Object.freeze(input.nextActions.map((action) => Object.freeze(action))) : undefined,
    reviewSurfaces: Object.freeze(input.reviewSurfaces.map((surface) => Object.freeze(surface))),
    sourcesFreshnessLimitations: Object.freeze(input.sourcesFreshnessLimitations.map((statement) => Object.freeze(statement))),
    professionalCheckpoints: Object.freeze(input.professionalCheckpoints.map((checkpoint) => Object.freeze(checkpoint))),
    protectedBoundaries: PROTECTED_BOUNDARIES,
  });
}
