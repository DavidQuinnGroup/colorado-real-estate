export const OPEN_HOUSE_AGENT_PREPARATION_PACKET_STATUS = 'OPEN_HOUSE_AGENT_PREPARATION_PACKET_MVV';
export const OPEN_HOUSE_AGENT_PREPARATION_PACKET_VERSION = '1.0.0';

export type OpenHousePacketStatus = 'READY_FOR_AGENT_REVIEW' | 'FAIL_CLOSED';

export type OpenHousePropertyFactsInput = Readonly<{
  price?: number | null;
  status?: string | null;
  propertyType?: string | null;
  beds?: number | null;
  baths?: number | null;
  squareFeet?: number | null;
  lotSize?: number | null;
  yearBuilt?: number | null;
  otherFacts?: readonly Readonly<{ label: string; value: string }> [];
}>;

export type OpenHouseSourceEvidenceInput = Readonly<{
  sourceIdentity?: string | null;
  visibleTimestamp?: string | null;
  unavailableEvidence?: readonly string[];
  limitations?: readonly string[];
  verificationRequirements?: readonly string[];
}>;

export type OpenHouseMarketContextInput = Readonly<{
  facts?: readonly Readonly<{ label: string; value: string; visibleTimestamp?: string | null }> [];
  limitations?: readonly string[];
  verificationRequirements?: readonly string[];
}>;

export type OpenHouseAgentPreparationInput = Readonly<{
  generatedAt: string;
  property?: Readonly<{
    id?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    neighborhood?: string | null;
    facts?: OpenHousePropertyFactsInput;
  }>;
  sourceEvidence?: OpenHouseSourceEvidenceInput;
  marketContext?: OpenHouseMarketContextInput;
  eventLabel?: string | null;
  eventDateTimeLabel?: string | null;
}>;

export type OpenHousePreparationFact = Readonly<{
  label: string;
  value: string;
  classification: 'SUPPLIED_FACT' | 'MISSING_FACT';
}>;

export type OpenHouseAgentPreparationPacket = Readonly<{
  status: OpenHousePacketStatus;
  contract: typeof OPEN_HOUSE_AGENT_PREPARATION_PACKET_STATUS;
  version: typeof OPEN_HOUSE_AGENT_PREPARATION_PACKET_VERSION;
  packetId: string;
  generatedAt: string;
  event: Readonly<{
    label: string | null;
    dateTimeLabel: string | null;
  }>;
  property: Readonly<{
    id: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    neighborhood: string | null;
    facts: readonly OpenHousePreparationFact[];
  }> | null;
  marketContext: Readonly<{
    state: 'SUPPLIED_CONTEXT' | 'MISSING_CONTEXT';
    facts: readonly Readonly<{ label: string; value: string; visibleTimestamp: string | null }> [];
    limitations: readonly string[];
    verificationRequirements: readonly string[];
  }>;
  sourceEvidence: Readonly<{
    sourceIdentity: string | null;
    visibleTimestamp: string | null;
    timestampState: 'VISIBLE_TIMESTAMP' | 'NO_VISIBLE_TIMESTAMP';
    unavailableEvidence: readonly string[];
    limitations: readonly string[];
    verificationRequirements: readonly string[];
  }>;
  talkingPointInputs: readonly string[];
  visitorQuestionPreparation: readonly string[];
  eventPreparationChecklist: readonly string[];
  fairHousingReminders: readonly string[];
  humanJudgmentBoundary: readonly string[];
  limitations: readonly string[];
  protectedBoundaries: Readonly<{
    propertyLookup: false;
    databaseAccess: false;
    calendarAccess: false;
    eventScheduling: false;
    visitorData: false;
    customerData: false;
    crm: false;
    emailOrSms: false;
    followUpAutomation: false;
    providerCalls: false;
    networkCalls: false;
    persistence: false;
    api: false;
    route: false;
    telemetry: false;
    autonomousComparableSelection: false;
    ranking: false;
    scoring: false;
    valuation: false;
    pricingRecommendation: false;
  }>;
}>;

const PROPERTY_FACT_FIELDS: readonly Readonly<{ key: keyof OpenHousePropertyFactsInput; label: string; format?: (value: number) => string }> [] = [
  { key: 'price', label: 'Listed price', format: (value) => `$${value.toLocaleString('en-US')}` },
  { key: 'status', label: 'Status' },
  { key: 'propertyType', label: 'Property type' },
  { key: 'beds', label: 'Beds' },
  { key: 'baths', label: 'Baths' },
  { key: 'squareFeet', label: 'Square feet', format: (value) => `${value.toLocaleString('en-US')} sq ft` },
  { key: 'lotSize', label: 'Lot size', format: (value) => value.toLocaleString('en-US') },
  { key: 'yearBuilt', label: 'Year built' },
];

function text(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || null;
}

function suppliedValue(value: unknown): value is string | number {
  return (typeof value === 'string' && value.trim().length > 0) || (typeof value === 'number' && Number.isFinite(value));
}

function propertyIdentity(input: OpenHouseAgentPreparationInput) {
  const id = text(input.property?.id);
  const address = text(input.property?.address);
  return { id, address, valid: Boolean(id || address) };
}

function packetId(identity: { id: string | null; address: string | null }, generatedAt: string) {
  const identityPart = (identity.id || identity.address || 'missing-property')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `reie-open-house-agent-preparation-${identityPart || 'missing-property'}-${generatedAt}-v${OPEN_HOUSE_AGENT_PREPARATION_PACKET_VERSION}`;
}

function propertyFacts(input: OpenHousePropertyFactsInput | undefined): readonly OpenHousePreparationFact[] {
  const facts = PROPERTY_FACT_FIELDS.map(({ key, label, format }) => {
    const value = input?.[key];
    if (!suppliedValue(value)) return { label, value: 'Not supplied', classification: 'MISSING_FACT' as const };
    const formatted = typeof value === 'number' && format ? format(value) : String(value);
    return { label, value: formatted, classification: 'SUPPLIED_FACT' as const };
  });

  const otherFacts = (input?.otherFacts || [])
    .map((fact) => ({ label: text(fact.label), value: text(fact.value) }))
    .filter((fact): fact is { label: string; value: string } => Boolean(fact.label && fact.value))
    .map((fact) => ({ ...fact, classification: 'SUPPLIED_FACT' as const }));

  return Object.freeze([...facts, ...otherFacts]);
}

function normalizeList(values: readonly string[] | undefined) {
  return Object.freeze((values || []).map(text).filter((value): value is string => Boolean(value)));
}

function marketContext(input: OpenHouseMarketContextInput | undefined) {
  const facts = Object.freeze(
    (input?.facts || [])
      .map((fact) => ({ label: text(fact.label), value: text(fact.value), visibleTimestamp: text(fact.visibleTimestamp) }))
      .filter((fact): fact is { label: string; value: string; visibleTimestamp: string | null } => Boolean(fact.label && fact.value)),
  );
  return Object.freeze({
    state: facts.length > 0 ? ('SUPPLIED_CONTEXT' as const) : ('MISSING_CONTEXT' as const),
    facts,
    limitations: normalizeList(input?.limitations),
    verificationRequirements: normalizeList(input?.verificationRequirements),
  });
}

function sourceEvidence(input: OpenHouseSourceEvidenceInput | undefined) {
  const visibleTimestamp = text(input?.visibleTimestamp);
  return Object.freeze({
    sourceIdentity: text(input?.sourceIdentity),
    visibleTimestamp,
    timestampState: visibleTimestamp ? ('VISIBLE_TIMESTAMP' as const) : ('NO_VISIBLE_TIMESTAMP' as const),
    unavailableEvidence: normalizeList(input?.unavailableEvidence),
    limitations: normalizeList(input?.limitations),
    verificationRequirements: normalizeList(input?.verificationRequirements),
  });
}

function buildTalkingPointInputs(
  property: NonNullable<OpenHouseAgentPreparationPacket['property']>,
  source: ReturnType<typeof sourceEvidence>,
  context: ReturnType<typeof marketContext>,
) {
  const propertyItems = property.facts
    .filter((fact) => fact.classification === 'SUPPLIED_FACT')
    .map((fact) => `${fact.label}: ${fact.value}.`);
  const contextItems = context.facts.map((fact) => `${fact.label}: ${fact.value}${fact.visibleTimestamp ? ` (visible timestamp: ${fact.visibleTimestamp})` : ''}.`);
  const sourceItem = source.sourceIdentity
    ? [`Source supplied for review: ${source.sourceIdentity}${source.visibleTimestamp ? ` (visible timestamp: ${source.visibleTimestamp})` : '.'}`]
    : ['No source identity was supplied; explain that source verification remains required.'];
  return Object.freeze([...propertyItems, ...contextItems, ...sourceItem]);
}

function buildVisitorQuestionPreparation(
  property: NonNullable<OpenHouseAgentPreparationPacket['property']>,
  source: ReturnType<typeof sourceEvidence>,
  context: ReturnType<typeof marketContext>,
) {
  const missingFacts = property.facts.filter((fact) => fact.classification === 'MISSING_FACT').map((fact) => fact.label.toLowerCase());
  const prompts = [
    'Which supplied property facts should be independently verified before the event?',
    'Which source limitations should the agent be prepared to explain neutrally?',
    'Which property condition, improvement, inclusion, or measurement facts remain unknown?',
    'Which questions require seller, listing-agent, HOA, title, lender, inspector, attorney, or other professional follow-up?',
  ];
  if (missingFacts.length > 0) prompts.push(`Which missing property facts need confirmation: ${missingFacts.join(', ')}?`);
  if (context.state === 'MISSING_CONTEXT') prompts.push('No market or place context was supplied; should any factual context be verified before discussing it?');
  if (!source.visibleTimestamp) prompts.push('No visible source timestamp was supplied; should the agent qualify the date posture before discussing source-based facts?');
  return Object.freeze(prompts);
}

const FAIR_HOUSING_REMINDERS = Object.freeze([
  'Respond neutrally; do not discuss demographic or protected-class characteristics.',
  'Do not characterize a neighborhood as desirable, suitable, good, bad, or safer for a visitor.',
  'Do not provide safety rankings, school-quality rankings, or steering guidance.',
  'Refer visitors to objective third-party resources where appropriate and keep factual property discussion separate from personal suitability.',
]);

const HUMAN_JUDGMENT_BOUNDARY = Object.freeze([
  'The agent retains event planning, property presentation, visitor interaction, factual verification, and fair-housing compliance.',
  'The agent retains follow-up, relationship management, negotiation, CMA work, pricing decisions, appraisal reliance, offer decisions, fiduciary advice, and customer communication.',
  'This packet organizes supplied evidence and questions; it does not operate, promote, schedule, or follow up on an event.',
]);

const EVENT_PREPARATION_CHECKLIST = Object.freeze([
  'Verify supplied property facts and distinguish them from unknown or unverified items.',
  'Review source identity and visible timestamp posture before discussing source-based facts.',
  'Prepare neutral explanations for material unknowns, unavailable evidence, and verification needs.',
  'Handle property access, safety, signage, scheduling, and event logistics outside REIE.',
  'Review fair-housing and professional-boundary reminders before visitor interaction.',
  'Prepare follow-up questions for the appropriate seller, listing agent, HOA, title, lender, inspector, attorney, or other professional.',
]);

const PROTECTED_BOUNDARIES = Object.freeze({
  propertyLookup: false,
  databaseAccess: false,
  calendarAccess: false,
  eventScheduling: false,
  visitorData: false,
  customerData: false,
  crm: false,
  emailOrSms: false,
  followUpAutomation: false,
  providerCalls: false,
  networkCalls: false,
  persistence: false,
  api: false,
  route: false,
  telemetry: false,
  autonomousComparableSelection: false,
  ranking: false,
  scoring: false,
  valuation: false,
  pricingRecommendation: false,
});

export function buildOpenHouseAgentPreparationPacket(input: OpenHouseAgentPreparationInput): OpenHouseAgentPreparationPacket {
  const identity = propertyIdentity(input);
  const context = marketContext(input.marketContext);
  const source = sourceEvidence(input.sourceEvidence);
  const event = Object.freeze({ label: text(input.eventLabel), dateTimeLabel: text(input.eventDateTimeLabel) });

  if (!identity.valid) {
    return Object.freeze({
      status: 'FAIL_CLOSED',
      contract: OPEN_HOUSE_AGENT_PREPARATION_PACKET_STATUS,
      version: OPEN_HOUSE_AGENT_PREPARATION_PACKET_VERSION,
      packetId: packetId(identity, input.generatedAt),
      generatedAt: input.generatedAt,
      event,
      property: null,
      marketContext: context,
      sourceEvidence: source,
      talkingPointInputs: Object.freeze([]),
      visitorQuestionPreparation: Object.freeze(['No packet was prepared because an explicitly supplied property identity is required.']),
      eventPreparationChecklist: EVENT_PREPARATION_CHECKLIST,
      fairHousingReminders: FAIR_HOUSING_REMINDERS,
      humanJudgmentBoundary: HUMAN_JUDGMENT_BOUNDARY,
      limitations: Object.freeze(['FAIL_CLOSED: supply a property ID or address before preparing an open-house packet.']),
      protectedBoundaries: PROTECTED_BOUNDARIES,
    });
  }

  const property = Object.freeze({
    id: identity.id,
    address: identity.address,
    city: text(input.property?.city),
    state: text(input.property?.state),
    neighborhood: text(input.property?.neighborhood),
    facts: propertyFacts(input.property?.facts),
  });
  const limitations = Object.freeze([
    ...source.unavailableEvidence.map((item) => `Unavailable evidence: ${item}`),
    ...source.limitations,
    ...context.limitations,
    ...(context.state === 'MISSING_CONTEXT' ? ['No market or place context was supplied; do not infer it.'] : []),
    ...(!source.visibleTimestamp ? ['NO_VISIBLE_TIMESTAMP: do not imply source recency.'] : []),
  ]);

  return Object.freeze({
    status: 'READY_FOR_AGENT_REVIEW',
    contract: OPEN_HOUSE_AGENT_PREPARATION_PACKET_STATUS,
    version: OPEN_HOUSE_AGENT_PREPARATION_PACKET_VERSION,
    packetId: packetId(identity, input.generatedAt),
    generatedAt: input.generatedAt,
    event,
    property,
    marketContext: context,
    sourceEvidence: source,
    talkingPointInputs: buildTalkingPointInputs(property, source, context),
    visitorQuestionPreparation: buildVisitorQuestionPreparation(property, source, context),
    eventPreparationChecklist: EVENT_PREPARATION_CHECKLIST,
    fairHousingReminders: FAIR_HOUSING_REMINDERS,
    humanJudgmentBoundary: HUMAN_JUDGMENT_BOUNDARY,
    limitations,
    protectedBoundaries: PROTECTED_BOUNDARIES,
  });
}
