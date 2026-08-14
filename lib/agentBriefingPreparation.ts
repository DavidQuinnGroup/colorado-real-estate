export const AGENT_BRIEFING_PREPARATION_STATUS = 'REIE_EVIDENCE_BOUND_CURRENT_STATE_AGENT_BRIEFING_PACKET_MVV';
export const AGENT_BRIEFING_PREPARATION_VERSION = '1.0.0';

export type AgentBriefingType = 'MARKET_PLACE';
export type AgentBriefingStatus = 'READY_FOR_AGENT_REVIEW' | 'REVIEW_REQUIRED_INCOMPLETE_EVIDENCE' | 'FAIL_CLOSED';
export type AgentBriefingEvidenceState = 'FACTUAL_SUPPLIED' | 'CALCULATED_SUPPLIED' | 'UNKNOWN' | 'NOT_AVAILABLE' | 'NOT_VERIFIED';

export type AgentBriefingEvidenceItemInput = Readonly<{
  label?: string | null;
  value?: string | number | null;
  state?: AgentBriefingEvidenceState;
}>;

export type AgentBriefingEvidenceSectionInput = Readonly<{
  id?: string | null;
  title?: string | null;
  sourceIdentity?: string | null;
  visibleDate?: string | null;
  effectiveDate?: string | null;
  evidence?: readonly AgentBriefingEvidenceItemInput[];
  limitations?: readonly string[];
  verificationRequirements?: readonly string[];
}>;

export type AgentBriefingPreparationInput = Readonly<{
  generatedAt?: string | null;
  briefingType?: AgentBriefingType;
  purpose?: string | null;
  evidenceSections?: readonly AgentBriefingEvidenceSectionInput[];
}>;

export type AgentBriefingEvidenceItem = Readonly<{
  label: string;
  value: string | null;
  state: AgentBriefingEvidenceState;
}>;

export type AgentBriefingEvidenceSection = Readonly<{
  id: string;
  title: string;
  sourceIdentity: string | null;
  visibleDate: string | null;
  effectiveDate: string | null;
  evidence: readonly AgentBriefingEvidenceItem[];
  limitations: readonly string[];
  verificationRequirements: readonly string[];
  completeness: 'COMPLETE' | 'SOURCE_OR_DATE_LIMITED' | 'EVIDENCE_INCOMPLETE';
}>;

export type AgentBriefingPacket = Readonly<{
  status: AgentBriefingStatus;
  contract: typeof AGENT_BRIEFING_PREPARATION_STATUS;
  version: typeof AGENT_BRIEFING_PREPARATION_VERSION;
  packetId: string;
  generatedAt: string | null;
  briefingType: AgentBriefingType | null;
  purpose: string | null;
  readiness: 'READY' | 'REVIEW_REQUIRED' | 'FAIL_CLOSED';
  completeness: 'COMPLETE' | 'INCOMPLETE_EVIDENCE' | 'FAIL_CLOSED';
  sections: readonly AgentBriefingEvidenceSection[];
  missingEvidence: readonly string[];
  reviewQuestions: readonly string[];
  internalTalkingPointInputs: readonly string[];
  humanReviewChecklist: readonly string[];
  professionalBoundary: readonly string[];
  fairHousingBoundary: readonly string[];
  failureReasons: readonly string[];
  protectedBoundaries: Readonly<{
    customerDelivery: false;
    email: false;
    chatOrBroadcast: false;
    scheduling: false;
    crm: false;
    persistence: false;
    providerCalls: false;
    networkCalls: false;
    databaseAccess: false;
    autonomousDiscovery: false;
    calculations: false;
    inference: false;
    ranking: false;
    recommendation: false;
    currentStateOnly: true;
  }>;
}>;

const HUMAN_REVIEW_CHECKLIST = Object.freeze([
  'Confirm that each factual or calculated result remains appropriate for the internal briefing purpose.',
  'Review source identity, visible date, effective date, limitations, and verification requirements before relying on a section.',
  'Retain responsibility for brokerage supervision, policy interpretation, training, and customer-specific judgment.',
  'Use this point-in-time preparation packet only after human review; it is not customer communication.',
]);

const PROFESSIONAL_BOUNDARY = Object.freeze([
  'REIE preserves human-supplied evidence and neutral review prompts only.',
  'The managing broker and human agent retain supervision, policy, legal, compliance, fiduciary, pricing, negotiation, offer, suitability, and training judgment.',
  'This packet does not make an autonomous brokerage decision or generate client-specific advice.',
]);

const FAIR_HOUSING_BOUNDARY = Object.freeze([
  'Do not use this packet for protected-class content, demographic targeting, or proxy inference.',
  'Do not turn market or place evidence into desirability, suitability, school, safety, crime, good-area, bad-area, or steering guidance.',
  'Use neutral objective-source referral where appropriate; retain human fair-housing responsibility.',
]);

const PROTECTED_BOUNDARIES = Object.freeze({
  customerDelivery: false,
  email: false,
  chatOrBroadcast: false,
  scheduling: false,
  crm: false,
  persistence: false,
  providerCalls: false,
  networkCalls: false,
  databaseAccess: false,
  autonomousDiscovery: false,
  calculations: false,
  inference: false,
  ranking: false,
  recommendation: false,
  currentStateOnly: true,
} as const);

const PROHIBITED_INFERENCE = /\b(?:race|religion|religious|national origin|familial status|disability|disabled|gender identity|sexual orientation|demographic|protected class|desirable|desirability|suitable|suitability|good (?:area|neighborhood)|bad (?:area|neighborhood)|best school|top school|school ranking|safest|safe neighborhood|low crime|high crime|ideal (?:for|place)|perfect for|steering)\b/i;

function text(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || null;
}

function valueText(value: string | number | null | undefined) {
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return text(typeof value === 'string' ? value : null);
}

function normalizeList(values: readonly string[] | undefined) {
  return Object.freeze((values || []).map((value) => text(value)).filter((value): value is string => Boolean(value)));
}

function hasProhibitedInference(value: string | null) {
  return Boolean(value && PROHIBITED_INFERENCE.test(value));
}

function normalizeEvidence(input: readonly AgentBriefingEvidenceItemInput[] | undefined) {
  return Object.freeze(
    (input || []).map((item) => ({
      label: text(item.label),
      value: valueText(item.value),
      state: item.state,
    })),
  );
}

function sectionCompleteness(section: Omit<AgentBriefingEvidenceSection, 'completeness'>) {
  const incompleteEvidence = section.evidence.some((item) => item.state === 'UNKNOWN' || item.state === 'NOT_AVAILABLE' || item.state === 'NOT_VERIFIED');
  if (incompleteEvidence) return 'EVIDENCE_INCOMPLETE' as const;
  if (!section.sourceIdentity || (!section.visibleDate && !section.effectiveDate)) return 'SOURCE_OR_DATE_LIMITED' as const;
  return 'COMPLETE' as const;
}

function packetId(generatedAt: string | null, sections: readonly AgentBriefingEvidenceSection[]) {
  const sectionIds = sections.map((section) => section.id).join('-').replace(/[^a-zA-Z0-9-]/g, '-');
  return `reie-agent-briefing-market-place-${sectionIds || 'invalid'}-${generatedAt || 'missing-generated-at'}-v${AGENT_BRIEFING_PREPARATION_VERSION}`;
}

function failClosed(input: AgentBriefingPreparationInput, reasons: readonly string[]): AgentBriefingPacket {
  const generatedAt = text(input.generatedAt);
  return Object.freeze({
    status: 'FAIL_CLOSED',
    contract: AGENT_BRIEFING_PREPARATION_STATUS,
    version: AGENT_BRIEFING_PREPARATION_VERSION,
    packetId: packetId(generatedAt, []),
    generatedAt,
    briefingType: input.briefingType ?? null,
    purpose: text(input.purpose),
    readiness: 'FAIL_CLOSED',
    completeness: 'FAIL_CLOSED',
    sections: [],
    missingEvidence: [],
    reviewQuestions: ['Correct the blocked input before preparing an internal briefing packet.'],
    internalTalkingPointInputs: [],
    humanReviewChecklist: HUMAN_REVIEW_CHECKLIST,
    professionalBoundary: PROFESSIONAL_BOUNDARY,
    fairHousingBoundary: FAIR_HOUSING_BOUNDARY,
    failureReasons: Object.freeze([...reasons]),
    protectedBoundaries: PROTECTED_BOUNDARIES,
  });
}

export function buildAgentBriefingPreparationPacket(input: AgentBriefingPreparationInput): AgentBriefingPacket {
  const generatedAt = text(input.generatedAt);
  const purpose = text(input.purpose);
  const rawSections = input.evidenceSections || [];
  const invalidReasons: string[] = [];

  if (!generatedAt) invalidReasons.push('MISSING_GENERATED_AT');
  if (input.briefingType !== 'MARKET_PLACE') invalidReasons.push('UNSUPPORTED_BRIEFING_TYPE');
  if (!purpose) invalidReasons.push('MISSING_INTERNAL_PURPOSE');
  if (rawSections.length === 0) invalidReasons.push('NO_EVIDENCE_SECTIONS');

  const sections = rawSections.map((rawSection, index) => {
    const id = text(rawSection.id);
    const title = text(rawSection.title);
    const sourceIdentity = text(rawSection.sourceIdentity);
    const evidence = normalizeEvidence(rawSection.evidence);
    const limitations = normalizeList(rawSection.limitations);
    const verificationRequirements = normalizeList(rawSection.verificationRequirements);

    if (!id) invalidReasons.push(`SECTION_${index + 1}_MISSING_ID`);
    if (!title) invalidReasons.push(`SECTION_${index + 1}_MISSING_TITLE`);
    if (!sourceIdentity) invalidReasons.push(`SECTION_${index + 1}_MISSING_SOURCE_IDENTITY`);
    if (!Array.isArray(rawSection.limitations)) invalidReasons.push(`SECTION_${index + 1}_MISSING_LIMITATIONS`);
    if (!Array.isArray(rawSection.verificationRequirements)) invalidReasons.push(`SECTION_${index + 1}_MISSING_VERIFICATION_REQUIREMENTS`);
    if (evidence.length === 0) invalidReasons.push(`SECTION_${index + 1}_NO_EVIDENCE`);

    for (const item of evidence) {
      if (!item.label || !item.state) invalidReasons.push(`SECTION_${index + 1}_INVALID_EVIDENCE_ITEM`);
      if ((item.state === 'FACTUAL_SUPPLIED' || item.state === 'CALCULATED_SUPPLIED') && item.value === null) {
        invalidReasons.push(`SECTION_${index + 1}_SUPPORTED_EVIDENCE_MISSING_VALUE`);
      }
      if ((item.state === 'UNKNOWN' || item.state === 'NOT_AVAILABLE' || item.state === 'NOT_VERIFIED') && item.value !== null) {
        invalidReasons.push(`SECTION_${index + 1}_INCOMPLETE_EVIDENCE_HAS_AFFIRMATIVE_VALUE`);
      }
      if (hasProhibitedInference(item.label) || hasProhibitedInference(item.value)) invalidReasons.push(`SECTION_${index + 1}_PROHIBITED_INFERENCE`);
    }

    const normalized = {
      id: id || `invalid-section-${index + 1}`,
      title: title || `Untitled section ${index + 1}`,
      sourceIdentity,
      visibleDate: text(rawSection.visibleDate),
      effectiveDate: text(rawSection.effectiveDate),
      evidence: Object.freeze(evidence.map((item) => ({ label: item.label || 'Missing label', value: item.value, state: item.state || 'UNKNOWN' as AgentBriefingEvidenceState }))),
      limitations,
      verificationRequirements,
    };

    return Object.freeze({ ...normalized, completeness: sectionCompleteness(normalized) });
  });

  if (new Set(sections.map((section) => section.id)).size !== sections.length) invalidReasons.push('DUPLICATE_SECTION_ID');
  if (invalidReasons.length > 0) return failClosed(input, invalidReasons);

  const missingEvidence = Object.freeze(
    sections.flatMap((section) => section.evidence
      .filter((item) => item.state === 'UNKNOWN' || item.state === 'NOT_AVAILABLE' || item.state === 'NOT_VERIFIED')
      .map((item) => `${section.title}: ${item.label} is ${item.state}.`)),
  );
  const sourceOrDateLimitations = sections
    .filter((section) => section.completeness === 'SOURCE_OR_DATE_LIMITED')
    .map((section) => `${section.title}: source identity is supplied but visible/effective date context is incomplete.`);
  const reviewQuestions = Object.freeze([
    ...sections.flatMap((section) => section.verificationRequirements.map((requirement) => `${section.title}: ${requirement}`)),
    ...sourceOrDateLimitations.map((limitation) => `Should this section's date posture be qualified? ${limitation}`),
    ...missingEvidence.map((item) => `What is the appropriate verification path for ${item}`),
    'Does the selected evidence remain appropriate for this internal briefing purpose?',
  ]);
  const internalTalkingPointInputs = Object.freeze(
    sections.flatMap((section) => section.evidence
      .filter((item) => item.state === 'FACTUAL_SUPPLIED' || item.state === 'CALCULATED_SUPPLIED')
      .map((item) => `${section.title} — ${item.label}: ${item.value} (${item.state}).`)),
  );
  const hasIncompleteEvidence = missingEvidence.length > 0 || sourceOrDateLimitations.length > 0;

  return Object.freeze({
    status: hasIncompleteEvidence ? 'REVIEW_REQUIRED_INCOMPLETE_EVIDENCE' : 'READY_FOR_AGENT_REVIEW',
    contract: AGENT_BRIEFING_PREPARATION_STATUS,
    version: AGENT_BRIEFING_PREPARATION_VERSION,
    packetId: packetId(generatedAt, sections),
    generatedAt,
    briefingType: 'MARKET_PLACE',
    purpose,
    readiness: hasIncompleteEvidence ? 'REVIEW_REQUIRED' : 'READY',
    completeness: hasIncompleteEvidence ? 'INCOMPLETE_EVIDENCE' : 'COMPLETE',
    sections: Object.freeze(sections),
    missingEvidence,
    reviewQuestions,
    internalTalkingPointInputs,
    humanReviewChecklist: HUMAN_REVIEW_CHECKLIST,
    professionalBoundary: PROFESSIONAL_BOUNDARY,
    fairHousingBoundary: FAIR_HOUSING_BOUNDARY,
    failureReasons: [],
    protectedBoundaries: PROTECTED_BOUNDARIES,
  });
}
