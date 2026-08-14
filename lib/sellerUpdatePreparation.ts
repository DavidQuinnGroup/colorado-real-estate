export const SELLER_UPDATE_PREPARATION_PACKET_STATUS = 'SELLER_UPDATE_PREPARATION_PACKET_MVV';
export const SELLER_UPDATE_PREPARATION_PACKET_VERSION = '1.0.0';

export type SellerUpdatePacketStatus = 'READY_FOR_AGENT_REVIEW' | 'FAIL_CLOSED';

export type SellerUpdatePropertyFactsInput = Readonly<{
  address?: string | null;
  city?: string | null;
  state?: string | null;
  neighborhood?: string | null;
  status?: string | null;
  listedPrice?: number | null;
  propertyType?: string | null;
  beds?: number | null;
  baths?: number | null;
  squareFeet?: number | null;
  lotSize?: number | null;
  yearBuilt?: number | null;
  otherFacts?: readonly Readonly<{ label: string; value: string }> [];
}>;

export type SellerUpdateSourcePostureInput = Readonly<{
  sourceIdentity?: string | null;
  visibleTimestamp?: string | null;
  semantic?: string | null;
  limitations?: readonly string[];
  unavailableEvidence?: readonly string[];
  verificationRequirements?: readonly string[];
}>;

export type SellerUpdatePriorBaselineInput = Readonly<{
  label?: string | null;
  facts?: SellerUpdatePropertyFactsInput;
}>;

export type SellerUpdateMarketContextInput = Readonly<{
  geography?: string | null;
  periodLabel?: string | null;
  effectiveDate?: string | null;
  sourceIdentity?: string | null;
  visibleTimestamp?: string | null;
  facts?: readonly Readonly<{ label: string; value: string }> [];
  limitations?: readonly string[];
  verificationRequirements?: readonly string[];
}>;

export type SellerUpdateCompetitiveInput = Readonly<{
  id?: string | null;
  address?: string | null;
  facts?: SellerUpdatePropertyFactsInput;
  sourcePosture?: SellerUpdateSourcePostureInput;
}>;

export type SellerUpdatePreparationInput = Readonly<{
  generatedAt: string;
  subject?: Readonly<{
    id?: string | null;
    facts?: SellerUpdatePropertyFactsInput;
    sourcePosture?: SellerUpdateSourcePostureInput;
  }>;
  priorBaseline?: SellerUpdatePriorBaselineInput;
  marketContext?: SellerUpdateMarketContextInput;
  competitiveFacts?: readonly SellerUpdateCompetitiveInput[];
}>;

export type SellerUpdateFact = Readonly<{
  key: string;
  label: string;
  value: string;
  classification: 'SUPPLIED_FACT' | 'MISSING_FACT' | 'CALCULATED_FACT';
}>;

export type SellerUpdateBaselineDelta = Readonly<{
  key: string;
  label: string;
  priorValue: string;
  currentValue: string;
  classification: 'FACTUAL_CHANGE' | 'UNCHANGED_FACT';
  limitation: string;
}>;

export type SellerUpdateCompetitiveDifference = Readonly<{
  competitiveId: string;
  competitiveAddress: string | null;
  key: string;
  label: string;
  subjectValue: string;
  competitiveValue: string;
  classification: 'FACTUAL_DIFFERENCE' | 'CALCULATED_DIFFERENCE' | 'EVIDENCE_ASYMMETRY' | 'UNAVAILABLE_EVIDENCE';
  limitation: string;
}>;

export type SellerUpdatePreparationPacket = Readonly<{
  status: SellerUpdatePacketStatus;
  contract: typeof SELLER_UPDATE_PREPARATION_PACKET_STATUS;
  version: typeof SELLER_UPDATE_PREPARATION_PACKET_VERSION;
  packetId: string;
  generatedAt: string;
  subject: Readonly<{
    id: string;
    facts: readonly SellerUpdateFact[];
  }> | null;
  sourcePosture: Readonly<{
    sourceIdentity: string | null;
    visibleTimestamp: string | null;
    timestampState: 'VISIBLE_TIMESTAMP' | 'NO_VISIBLE_TIMESTAMP';
    semantic: string | null;
    limitations: readonly string[];
    unavailableEvidence: readonly string[];
    verificationRequirements: readonly string[];
  }>;
  priorBaseline: Readonly<{
    state: 'CALLER_SUPPLIED_BASELINE' | 'NO_PRIOR_UPDATE_BASELINE';
    label: string | null;
    factualDeltas: readonly SellerUpdateBaselineDelta[];
    limitation: string;
  }>;
  marketContext: Readonly<{
    state: 'SUPPLIED_MARKET_CONTEXT' | 'MISSING_MARKET_CONTEXT';
    geography: string | null;
    periodLabel: string | null;
    effectiveDate: string | null;
    sourceIdentity: string | null;
    visibleTimestamp: string | null;
    facts: readonly Readonly<{ label: string; value: string }> [];
    limitations: readonly string[];
    verificationRequirements: readonly string[];
  }>;
  competitiveFacts: Readonly<{
    selectionMode: 'AGENT_SUPPLIED_ONLY';
    entries: readonly Readonly<{
      id: string;
      address: string | null;
      facts: readonly SellerUpdateFact[];
      sourcePosture: SellerUpdatePreparationPacket['sourcePosture'];
    }> [];
    differences: readonly SellerUpdateCompetitiveDifference[];
  }>;
  unsupportedEvidence: readonly Readonly<{
    label: string;
    state: 'UNAVAILABLE_OR_UNSUPPORTED';
    limitation: string;
  }> [];
  talkingPointInputs: readonly string[];
  verificationQuestions: readonly string[];
  humanReviewChecklist: readonly string[];
  professionalBoundary: readonly string[];
  protectedBoundaries: Readonly<{
    sideEffects: false;
    persistence: false;
    network: false;
    autonomousSelection: false;
    ranking: false;
    scoring: false;
    valuation: false;
    communicationGeneration: false;
    customerBehavior: false;
  }>;
}>;

const FACT_FIELDS = Object.freeze([
  ['address', 'Address'],
  ['city', 'City'],
  ['state', 'State'],
  ['neighborhood', 'Neighborhood'],
  ['status', 'Listing status'],
  ['listedPrice', 'Current listed price'],
  ['propertyType', 'Property type'],
  ['beds', 'Beds'],
  ['baths', 'Baths'],
  ['squareFeet', 'Square feet'],
  ['lotSize', 'Lot size'],
  ['yearBuilt', 'Year built'],
] as const);

const COMPARISON_FIELDS = Object.freeze([
  ['listedPrice', 'Listed price', false],
  ['beds', 'Beds', false],
  ['baths', 'Baths', false],
  ['squareFeet', 'Square feet', false],
  ['lotSize', 'Lot size', false],
  ['yearBuilt', 'Year built', false],
  ['status', 'Listing status', false],
  ['propertyType', 'Property type', false],
  ['pricePerSquareFoot', 'Price per listed square foot', true],
] as const);

const UNSUPPORTED_EVIDENCE = Object.freeze([
  ['Property days on market', 'Property-level days on market was not supplied.'],
  ['Full listing-change history', 'No certified complete listing-change history is supplied.'],
  ['Showing or visitor activity', 'No showing or visitor activity evidence is supplied.'],
  ['Showing feedback', 'No showing-feedback evidence is supplied.'],
  ['Condition or improvements', 'Condition and improvement evidence is not established by listing facts alone.'],
  ['Sold verification', 'No sold verification is supplied.'],
  ['Full public records', 'No complete public-record evidence is supplied.'],
  ['Source confidence', 'No source-confidence conclusion is supplied.'],
  ['Current provider freshness', 'No current provider-freshness conclusion is supplied.'],
] as const);

const HUMAN_REVIEW_CHECKLIST = Object.freeze([
  'Retain responsibility for the seller relationship, communication, narrative, and tone.',
  'Retain responsibility for pricing, price changes, concessions, staging, marketing, and withdrawal or expiration decisions.',
  'Retain responsibility for showing-feedback interpretation, negotiation, CMA methodology, valuation, appraisal, and fiduciary advice.',
  'Verify which facts, dates, source limitations, and missing evidence should be qualified before customer communication.',
]);

const PROFESSIONAL_BOUNDARY = Object.freeze([
  'REIE prepares supplied factual evidence and neutral questions only.',
  'The human agent retains all seller strategy, communication, pricing, negotiation, relationship-management, and fiduciary judgment.',
  'This packet does not generate a seller message, recommend an action, select competitive entries, rank entries, score entries, value property, or predict an outcome.',
]);

function text(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || null;
}

function supplied(value: unknown): value is string | number {
  return (typeof value === 'string' && value.trim().length > 0) || (typeof value === 'number' && Number.isFinite(value));
}

function number(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function list(values: readonly string[] | undefined) {
  return Object.freeze((values || []).map(text).filter((value): value is string => Boolean(value)));
}

function valueFor(key: string, facts: SellerUpdatePropertyFactsInput | undefined): string | number | null {
  if (key === 'pricePerSquareFoot') {
    if (!number(facts?.listedPrice) || !number(facts?.squareFeet) || facts.squareFeet <= 0) return null;
    return Math.round(facts.listedPrice / facts.squareFeet);
  }

  const value = facts?.[key as keyof SellerUpdatePropertyFactsInput];
  return supplied(value) ? value : null;
}

function formatValue(key: string, value: string | number | null) {
  if (value === null) return 'Not supplied';
  if (key === 'listedPrice' || key === 'pricePerSquareFoot') return `$${value.toLocaleString('en-US')}${key === 'pricePerSquareFoot' ? ' per listed sq ft' : ''}`;
  if (typeof value === 'number') return value.toLocaleString('en-US');
  return value;
}

function factsFor(input: SellerUpdatePropertyFactsInput | undefined): readonly SellerUpdateFact[] {
  const facts = FACT_FIELDS.map(([key, label]) => {
    const value = valueFor(key, input);
    return Object.freeze({ key, label, value: formatValue(key, value), classification: value === null ? ('MISSING_FACT' as const) : ('SUPPLIED_FACT' as const) });
  });
  const calculated = valueFor('pricePerSquareFoot', input);
  const calculatedFact = Object.freeze({
    key: 'pricePerSquareFoot',
    label: 'Price per listed square foot',
    value: formatValue('pricePerSquareFoot', calculated),
    classification: calculated === null ? ('MISSING_FACT' as const) : ('CALCULATED_FACT' as const),
  });
  const otherFacts = (input?.otherFacts || [])
    .map((fact) => ({ label: text(fact.label), value: text(fact.value) }))
    .filter((fact): fact is { label: string; value: string } => Boolean(fact.label && fact.value))
    .map((fact) => Object.freeze({ key: `other-${fact.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, ...fact, classification: 'SUPPLIED_FACT' as const }));
  return Object.freeze([...facts, calculatedFact, ...otherFacts]);
}

function sourcePosture(input: SellerUpdateSourcePostureInput | undefined): SellerUpdatePreparationPacket['sourcePosture'] {
  const visibleTimestamp = text(input?.visibleTimestamp);
  return Object.freeze({
    sourceIdentity: text(input?.sourceIdentity),
    visibleTimestamp,
    timestampState: visibleTimestamp ? 'VISIBLE_TIMESTAMP' : 'NO_VISIBLE_TIMESTAMP',
    semantic: text(input?.semantic),
    limitations: list(input?.limitations),
    unavailableEvidence: list(input?.unavailableEvidence),
    verificationRequirements: list(input?.verificationRequirements),
  });
}

function baselineDeltas(
  current: SellerUpdatePropertyFactsInput | undefined,
  prior: SellerUpdatePropertyFactsInput | undefined,
): readonly SellerUpdateBaselineDelta[] {
  return Object.freeze(
    FACT_FIELDS.flatMap(([key, label]) => {
      const currentValue = valueFor(key, current);
      const priorValue = valueFor(key, prior);
      if (currentValue === null || priorValue === null) return [];
      return [
        Object.freeze({
          key,
          label,
          priorValue: formatValue(key, priorValue),
          currentValue: formatValue(key, currentValue),
          classification: currentValue === priorValue ? 'UNCHANGED_FACT' : 'FACTUAL_CHANGE',
          limitation: 'This is a caller-supplied baseline comparison only; it does not establish cause, significance, or seller impact.',
        }),
      ];
    }),
  );
}

function marketContext(input: SellerUpdateMarketContextInput | undefined): SellerUpdatePreparationPacket['marketContext'] {
  const facts = Object.freeze(
    (input?.facts || [])
      .map((fact) => ({ label: text(fact.label), value: text(fact.value) }))
      .filter((fact): fact is { label: string; value: string } => Boolean(fact.label && fact.value)),
  );
  return Object.freeze({
    state: facts.length > 0 ? 'SUPPLIED_MARKET_CONTEXT' : 'MISSING_MARKET_CONTEXT',
    geography: text(input?.geography),
    periodLabel: text(input?.periodLabel),
    effectiveDate: text(input?.effectiveDate),
    sourceIdentity: text(input?.sourceIdentity),
    visibleTimestamp: text(input?.visibleTimestamp),
    facts,
    limitations: list(input?.limitations),
    verificationRequirements: list(input?.verificationRequirements),
  });
}

function competitiveDifferences(
  subjectFacts: SellerUpdatePropertyFactsInput | undefined,
  entries: readonly SellerUpdateCompetitiveInput[],
): readonly SellerUpdateCompetitiveDifference[] {
  return Object.freeze(
    entries.flatMap((entry) => {
      const id = text(entry.id);
      if (!id) return [];
      return COMPARISON_FIELDS.map(([key, label, calculated]) => {
        const subjectValue = valueFor(key, subjectFacts);
        const competitiveValue = valueFor(key, entry.facts);
        const classification: SellerUpdateCompetitiveDifference['classification'] =
          subjectValue === null && competitiveValue === null
            ? 'UNAVAILABLE_EVIDENCE'
            : subjectValue === null || competitiveValue === null
              ? 'EVIDENCE_ASYMMETRY'
              : subjectValue === competitiveValue
                ? 'UNAVAILABLE_EVIDENCE'
                : calculated
                  ? 'CALCULATED_DIFFERENCE'
                  : 'FACTUAL_DIFFERENCE';
        const limitation =
          classification === 'EVIDENCE_ASYMMETRY'
            ? 'Evidence is available for one entry and not the other; this does not indicate a better property.'
            : classification === 'UNAVAILABLE_EVIDENCE'
              ? 'The supplied facts do not establish a material comparison conclusion.'
              : 'This is a factual difference only; it does not establish quality, desirability, value, or strategy.';
        return Object.freeze({
          competitiveId: id,
          competitiveAddress: text(entry.address),
          key,
          label,
          subjectValue: formatValue(key, subjectValue),
          competitiveValue: formatValue(key, competitiveValue),
          classification,
          limitation,
        });
      });
    }),
  );
}

function packetId(subjectId: string | null, generatedAt: string) {
  const subjectPart = (subjectId || 'missing-subject').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `reie-seller-update-preparation-${subjectPart || 'missing-subject'}-${generatedAt}-v${SELLER_UPDATE_PREPARATION_PACKET_VERSION}`;
}

function failClosed(input: SellerUpdatePreparationInput, reason: string): SellerUpdatePreparationPacket {
  return Object.freeze({
    status: 'FAIL_CLOSED',
    contract: SELLER_UPDATE_PREPARATION_PACKET_STATUS,
    version: SELLER_UPDATE_PREPARATION_PACKET_VERSION,
    packetId: packetId(text(input.subject?.id), input.generatedAt),
    generatedAt: input.generatedAt,
    subject: null,
    sourcePosture: sourcePosture(input.subject?.sourcePosture),
    priorBaseline: { state: 'NO_PRIOR_UPDATE_BASELINE' as const, label: null, factualDeltas: [], limitation: reason },
    marketContext: marketContext(input.marketContext),
    competitiveFacts: { selectionMode: 'AGENT_SUPPLIED_ONLY' as const, entries: [], differences: [] },
    unsupportedEvidence: UNSUPPORTED_EVIDENCE.map(([label, limitation]) => ({ label, state: 'UNAVAILABLE_OR_UNSUPPORTED' as const, limitation })),
    talkingPointInputs: [reason],
    verificationQuestions: ['Supply an explicit subject identity and at least one current factual listing/property field before review.'],
    humanReviewChecklist: HUMAN_REVIEW_CHECKLIST,
    professionalBoundary: PROFESSIONAL_BOUNDARY,
    protectedBoundaries: { sideEffects: false, persistence: false, network: false, autonomousSelection: false, ranking: false, scoring: false, valuation: false, communicationGeneration: false, customerBehavior: false } as const,
  });
}

export function buildSellerUpdatePreparationPacket(input: SellerUpdatePreparationInput): SellerUpdatePreparationPacket {
  const subjectId = text(input.subject?.id);
  const currentFacts = input.subject?.facts;
  const hasCurrentFact = FACT_FIELDS.some(([key]) => valueFor(key, currentFacts) !== null) || (currentFacts?.otherFacts || []).some((fact) => text(fact.label) && text(fact.value));
  if (!subjectId || !hasCurrentFact) return failClosed(input, 'Fail closed: explicit subject identity and supplied current facts are required.');

  const hasBaseline = Boolean(input.priorBaseline?.facts);
  const subjectSourcePosture = sourcePosture(input.subject?.sourcePosture);
  const entries = Object.freeze(
    (input.competitiveFacts || [])
      .map((entry) => ({ id: text(entry.id), address: text(entry.address), facts: entry.facts, sourcePosture: sourcePosture(entry.sourcePosture) }))
      .filter((entry): entry is { id: string; address: string | null; facts: SellerUpdatePropertyFactsInput | undefined; sourcePosture: SellerUpdatePreparationPacket['sourcePosture'] } => Boolean(entry.id))
      .map((entry) => Object.freeze({ id: entry.id, address: entry.address, facts: factsFor(entry.facts), sourcePosture: entry.sourcePosture })),
  );
  const currentMarketContext = marketContext(input.marketContext);
  const deltas = hasBaseline ? baselineDeltas(currentFacts, input.priorBaseline?.facts) : [];
  const differences = competitiveDifferences(currentFacts, (input.competitiveFacts || []).filter((entry) => Boolean(text(entry.id))));
  const factualChanges = deltas.filter((delta) => delta.classification === 'FACTUAL_CHANGE');
  const talkingPointInputs = [
    `Review ${factsFor(currentFacts).filter((fact) => fact.classification !== 'MISSING_FACT').length} supplied current listing/property facts.`,
    hasBaseline
      ? `${factualChanges.length} caller-baseline factual change${factualChanges.length === 1 ? '' : 's'} require agent review.`
      : 'No prior baseline was supplied; do not make a change-since-prior-update claim.',
    currentMarketContext.state === 'SUPPLIED_MARKET_CONTEXT'
      ? `${currentMarketContext.facts.length} supplied market-context fact${currentMarketContext.facts.length === 1 ? '' : 's'} require period and source review.`
      : 'Market context is missing; do not supply market commentary without governed facts.',
    entries.length > 0
      ? `${entries.length} agent-supplied competitive entr${entries.length === 1 ? 'y is' : 'ies are'} organized for factual review only.`
      : 'No competitive facts were supplied; do not discover or substitute entries.',
    subjectSourcePosture.visibleTimestamp
      ? `Source timestamp supplied for review: ${subjectSourcePosture.visibleTimestamp}.`
      : 'No visible source timestamp was supplied; qualify the date posture before relying on source-based facts.',
  ];
  const verificationQuestions = [
    'Is the current listing status verified?',
    'Is the current listed price verified?',
    'Are supplied market facts current for the intended conversation?',
    'Are competitive entries intentionally selected and factually current?',
    'Is showing or feedback evidence available elsewhere?',
    'Are condition or improvement differences verified?',
    'Does missing evidence require seller, listing-agent, title, HOA, inspector, lender, attorney, or other professional confirmation?',
  ];
  if (!hasBaseline) verificationQuestions.push('Should a prior factual baseline be supplied before discussing factual changes?');
  if (!subjectSourcePosture.visibleTimestamp) verificationQuestions.push('Should the source timestamp posture be qualified before discussion?');

  return Object.freeze({
    status: 'READY_FOR_AGENT_REVIEW',
    contract: SELLER_UPDATE_PREPARATION_PACKET_STATUS,
    version: SELLER_UPDATE_PREPARATION_PACKET_VERSION,
    packetId: packetId(subjectId, input.generatedAt),
    generatedAt: input.generatedAt,
    subject: { id: subjectId, facts: factsFor(currentFacts) },
    sourcePosture: subjectSourcePosture,
    priorBaseline: {
      state: hasBaseline ? ('CALLER_SUPPLIED_BASELINE' as const) : ('NO_PRIOR_UPDATE_BASELINE' as const),
      label: hasBaseline ? text(input.priorBaseline?.label) : null,
      factualDeltas: deltas,
      limitation: hasBaseline
        ? 'Deltas compare only supplied current and caller-supplied baseline fields; no cause, significance, or seller impact is inferred.'
        : 'No prior seller-update baseline is supplied. This packet makes no claim about what changed before the supplied current facts.',
    },
    marketContext: currentMarketContext,
    competitiveFacts: { selectionMode: 'AGENT_SUPPLIED_ONLY' as const, entries, differences },
    unsupportedEvidence: UNSUPPORTED_EVIDENCE.map(([label, limitation]) => ({ label, state: 'UNAVAILABLE_OR_UNSUPPORTED' as const, limitation })),
    talkingPointInputs: Object.freeze(talkingPointInputs),
    verificationQuestions: Object.freeze(verificationQuestions),
    humanReviewChecklist: HUMAN_REVIEW_CHECKLIST,
    professionalBoundary: PROFESSIONAL_BOUNDARY,
    protectedBoundaries: { sideEffects: false, persistence: false, network: false, autonomousSelection: false, ranking: false, scoring: false, valuation: false, communicationGeneration: false, customerBehavior: false } as const,
  });
}
