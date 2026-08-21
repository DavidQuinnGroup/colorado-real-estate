import { COLORADO_DECISION_GUIDE_REGISTRY, type DecisionGuideRegistryEntry } from '../coloradoDecisionGuideRegistry';
import type { ReieProfessionalHandoffRole } from '../reieProfessionalHandoffTaxonomy';

export const AGENT_PLACE_PREPARATION_ADMISSION_STATUS = 'REIE_AGENT_PLACE_PREPARATION_ADMISSION_AND_VISIBILITY_GATE_MVV' as const;
export const AGENT_PLACE_PREPARATION_CAPABILITY = 'AGENT_PLACE_CONVERSATION_PREPARATION' as const;
export const AGENT_PLACE_PREPARATION_FUTURE_ROUTE = '/agent/prepare/place' as const;
export const AGENT_PLACE_CITY_SOURCE_ID = 'REIE_COLORADO_DECISION_GUIDE_REGISTRY' as const;

export const AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION = Object.freeze({
  capability: AGENT_PLACE_PREPARATION_CAPABILITY,
  routePattern: AGENT_PLACE_PREPARATION_FUTURE_ROUTE,
  requiredIdentityType: 'HUMAN_AGENT',
  requiredRole: 'AGENT',
  allowedMechanism: 'HUMAN_AGENT_SESSION',
  mutationPosture: 'READ_ONLY',
  activationState: 'NOT_AUTHORIZED',
  noGenericAgentGrant: true,
  adminInheritance: false,
  mcpInheritance: false,
} as const);

export type AgentPlaceEvidenceClass =
  | 'AGENT_VISIBLE_FACT'
  | 'AGENT_VISIBLE_EDITORIAL_DECISION_CONTEXT'
  | 'AGENT_VISIBLE_LIMITATION'
  | 'AGENT_VISIBLE_VERIFICATION_ITEM'
  | 'PROGRESSIVE_DISCLOSURE'
  | 'ADMIN_ONLY'
  | 'SOURCE_UNAVAILABLE'
  | 'NOT_AUTHORIZED';

export type AgentPlaceHumanEvidenceState =
  | 'KNOWN_NOW'
  | 'NEEDS_VERIFICATION'
  | 'NOT_AVAILABLE_IN_REIE'
  | 'PROFESSIONAL_REVIEW_NEEDED'
  | 'CURRENTNESS_NEEDS_CONFIRMATION';

export type AgentPlaceObjectType =
  | 'CITY'
  | 'NEIGHBORHOOD'
  | 'SUBMARKET'
  | 'CORRIDOR'
  | 'MARKET_AREA'
  | 'EDITORIAL_CONTEXT'
  | 'UNKNOWN';

export type AgentPlaceCanonicalCity = Readonly<{
  canonicalPlaceId: string;
  canonicalName: 'Boulder' | 'Louisville' | 'Lafayette';
  objectType: 'CITY';
  jurisdictionClass: 'MUNICIPALITY';
  state: 'CO';
  marketRoute: string;
  guideMaturity: 'EDITORIALLY_CERTIFIED';
  registryFreshness: string;
}>;

export type AgentPlacePreparationSourcePosture = Readonly<{
  sourceId: typeof AGENT_PLACE_CITY_SOURCE_ID | string | null;
  sourceClass: 'REPOSITORY_EDITORIAL_CITY_GUIDE' | 'UNKNOWN' | 'PROVIDER_RUNTIME';
  sourceReference: string | null;
  freshness: 'DATED_DURABLE_EDITORIAL' | 'STALE' | 'UNKNOWN';
  completeness: 'COMPLETE' | 'INCOMPLETE';
  conflict: 'NO_CONFLICT' | 'CONFLICTING';
  rights: 'CERTIFIED_INTERNAL_EDITORIAL_USE' | 'UNKNOWN_OR_UNRESOLVED';
  certification: 'CITY_DECISION_GUIDE_CERTIFIED' | 'UNCERTIFIED';
}>;

export type AgentPlacePreparationRequest = Readonly<{
  actorIdentityType: 'HUMAN_AGENT' | 'UNKNOWN';
  actorRole: 'AGENT' | 'ADMIN' | 'UNKNOWN';
  sessionMechanism: 'HUMAN_AGENT_SESSION' | 'OTHER' | 'UNKNOWN';
  capability: typeof AGENT_PLACE_PREPARATION_CAPABILITY | string;
  route: typeof AGENT_PLACE_PREPARATION_FUTURE_ROUTE | string;
  canonicalPlaceId: string | null;
  requestedObjectType: AgentPlaceObjectType;
  freeFormPlaceValue: string | null;
  adminContext: boolean;
  mcpContext: boolean;
  customerContext: boolean;
  persistenceRequested: boolean;
  providerRuntimeRequired: boolean;
  recommendationRequested: boolean;
  rankingRequested: boolean;
  suitabilityRequested: boolean;
  fairHousingSensitiveRequest: boolean;
  schoolQualityRequest: boolean;
  safetyRequest: boolean;
}>;

export type AgentPlaceEvidencePolicy = Readonly<{
  key: string;
  classification: AgentPlaceEvidenceClass;
  display: 'REQUIRED' | 'OPTIONAL' | 'PROGRESSIVE_DISCLOSURE' | 'NOT_AUTHORIZED';
  humanState: AgentPlaceHumanEvidenceState;
  purpose: string;
}>;

export const AGENT_PLACE_PREPARATION_EVIDENCE_POLICY: readonly AgentPlaceEvidencePolicy[] = Object.freeze([
  { key: 'canonical-city-identity', classification: 'AGENT_VISIBLE_FACT', display: 'REQUIRED', humanState: 'KNOWN_NOW', purpose: 'Exact governed city identity and state only.' },
  { key: 'city-orientation', classification: 'AGENT_VISIBLE_EDITORIAL_DECISION_CONTEXT', display: 'REQUIRED', humanState: 'KNOWN_NOW', purpose: 'Existing certified editorial city orientation without a suitability conclusion.' },
  { key: 'municipal-and-county-dependencies', classification: 'AGENT_VISIBLE_VERIFICATION_ITEM', display: 'PROGRESSIVE_DISCLOSURE', humanState: 'PROFESSIONAL_REVIEW_NEEDED', purpose: 'Prepare direct municipal or county confirmation questions.' },
  { key: 'geographic-orientation', classification: 'AGENT_VISIBLE_EDITORIAL_DECISION_CONTEXT', display: 'OPTIONAL', humanState: 'NEEDS_VERIFICATION', purpose: 'Describe governed orientation context without boundary or property assignment claims.' },
  { key: 'housing-orientation', classification: 'AGENT_VISIBLE_EDITORIAL_DECISION_CONTEXT', display: 'OPTIONAL', humanState: 'NEEDS_VERIFICATION', purpose: 'Use durable editorial housing context, not a current-market claim.' },
  { key: 'local-decision-context', classification: 'AGENT_VISIBLE_EDITORIAL_DECISION_CONTEXT', display: 'REQUIRED', humanState: 'NEEDS_VERIFICATION', purpose: 'Frame neutral decision questions, not recommendations or rankings.' },
  { key: 'access-and-destinations', classification: 'AGENT_VISIBLE_VERIFICATION_ITEM', display: 'PROGRESSIVE_DISCLOSURE', humanState: 'CURRENTNESS_NEEDS_CONFIRMATION', purpose: 'Identify matters that require direct current confirmation.' },
  { key: 'current-authorized-market', classification: 'SOURCE_UNAVAILABLE', display: 'NOT_AUTHORIZED', humanState: 'NOT_AVAILABLE_IN_REIE', purpose: 'No current market fact enters the P0 place packet.' },
  { key: 'authorized-reie-market-surface', classification: 'PROGRESSIVE_DISCLOSURE', display: 'PROGRESSIVE_DISCLOSURE', humanState: 'NEEDS_VERIFICATION', purpose: 'Existing Agent Market context is referenced only after its separate authorization checks.' },
  { key: 'source-rights-and-freshness', classification: 'AGENT_VISIBLE_LIMITATION', display: 'REQUIRED', humanState: 'CURRENTNESS_NEEDS_CONFIRMATION', purpose: 'Keep durable editorial source posture distinct from current operational facts.' },
  { key: 'neighborhood-submarket-and-corridor-context', classification: 'NOT_AUTHORIZED', display: 'NOT_AUTHORIZED', humanState: 'NOT_AVAILABLE_IN_REIE', purpose: 'P0 admits cities only; no geographic-object expansion is inherited.' },
  { key: 'customer-and-admin-context', classification: 'ADMIN_ONLY', display: 'NOT_AUTHORIZED', humanState: 'NOT_AVAILABLE_IN_REIE', purpose: 'Customer, Admin, and MCP context never enter the Agent packet.' },
  { key: 'schools-safety-and-protected-class-inference', classification: 'NOT_AUTHORIZED', display: 'NOT_AUTHORIZED', humanState: 'NOT_AVAILABLE_IN_REIE', purpose: 'No school, safety, demographic, protected-class, or suitability output.' },
  { key: 'recommendation-ranking-and-property-assignment', classification: 'NOT_AUTHORIZED', display: 'NOT_AUTHORIZED', humanState: 'NOT_AVAILABLE_IN_REIE', purpose: 'No recommendation, ranking, scoring, assignment, or targeting output.' },
]);

const P0_CITY_NAMES = ['Boulder', 'Louisville', 'Lafayette'] as const;

function cityFromRegistry(name: (typeof P0_CITY_NAMES)[number]): AgentPlaceCanonicalCity {
  const entry = COLORADO_DECISION_GUIDE_REGISTRY.find((candidate) => candidate.canonicalName === name);
  if (!entry || !isP0CityEntry(entry)) {
    throw new Error(`P0 Agent place city registry invariant failed for ${name}.`);
  }

  return Object.freeze({
    canonicalPlaceId: `reie-city:${entry.routeSlug}`,
    canonicalName: name,
    objectType: 'CITY',
    jurisdictionClass: 'MUNICIPALITY',
    state: entry.state,
    marketRoute: entry.marketRoute,
    guideMaturity: entry.guideMaturity,
    registryFreshness: entry.freshness,
  });
}

function isP0CityEntry(entry: DecisionGuideRegistryEntry): entry is DecisionGuideRegistryEntry & {
  canonicalName: (typeof P0_CITY_NAMES)[number];
  state: 'CO';
  marketRoute: string;
  guideMaturity: 'EDITORIALLY_CERTIFIED';
} {
  return P0_CITY_NAMES.includes(entry.canonicalName as (typeof P0_CITY_NAMES)[number])
    && entry.state === 'CO'
    && entry.publicEligibility
    && Boolean(entry.marketRoute)
    && entry.guideMaturity === 'EDITORIALLY_CERTIFIED';
}

export const AGENT_PLACE_PREPARATION_P0_CITIES: readonly AgentPlaceCanonicalCity[] = Object.freeze(
  P0_CITY_NAMES.map(cityFromRegistry),
);

export const AGENT_PLACE_PREPARATION_ALLOWED_CITY_IDS = Object.freeze(
  AGENT_PLACE_PREPARATION_P0_CITIES.map((city) => city.canonicalPlaceId),
);

export function buildAgentPlacePreparationSourcePosture(city: AgentPlaceCanonicalCity): AgentPlacePreparationSourcePosture {
  return Object.freeze({
    sourceId: AGENT_PLACE_CITY_SOURCE_ID,
    sourceClass: 'REPOSITORY_EDITORIAL_CITY_GUIDE',
    sourceReference: `city-guide:${city.canonicalPlaceId}`,
    freshness: 'DATED_DURABLE_EDITORIAL',
    completeness: 'COMPLETE',
    conflict: 'NO_CONFLICT',
    rights: 'CERTIFIED_INTERNAL_EDITORIAL_USE',
    certification: 'CITY_DECISION_GUIDE_CERTIFIED',
  });
}

export type AgentPlacePreparationPacket = Readonly<{
  status: typeof AGENT_PLACE_PREPARATION_ADMISSION_STATUS;
  capability: typeof AGENT_PLACE_PREPARATION_CAPABILITY;
  routeClassification: typeof AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION;
  admission: 'ADMITTED' | 'FAIL_CLOSED';
  readiness: 'READY_FOR_AGENT_REVIEW' | 'REVIEW_REQUIRED' | 'FAIL_CLOSED';
  city: AgentPlaceCanonicalCity | null;
  sourcePosture: AgentPlacePreparationSourcePosture | null;
  evidencePolicy: readonly AgentPlaceEvidencePolicy[];
  whatMatters: readonly string[];
  knownNow: readonly string[];
  needsVerification: readonly string[];
  missingEvidence: readonly string[];
  professionalCheckpoints: readonly Readonly<{ label: 'Agent verification checkpoint'; role: ReieProfessionalHandoffRole; question: string }>[];
  clientQuestions: readonly string[];
  talkingPoints: readonly Readonly<{ label: 'FACT' | 'CONTEXT' | 'LIMITATION' | 'VERIFICATION'; statement: string }>[];
  safeReieSurfaces: readonly Readonly<{ label: string; href: string; display: 'REQUIRED' | 'PROGRESSIVE_DISCLOSURE' }>[];
  failureReasons: readonly string[];
  protectedBoundaries: Readonly<{
    customerData: false;
    crm: false;
    persistence: false;
    providerRuntime: false;
    publicRecordRetrieval: false;
    adminInheritance: false;
    mcpInheritance: false;
    recommendation: false;
    ranking: false;
    suitability: false;
    schoolSafetyInference: false;
    fairHousingInference: false;
    propertyAssignment: false;
    publicActivation: false;
  }>;
}>;

const PROTECTED_BOUNDARIES = Object.freeze({
  customerData: false,
  crm: false,
  persistence: false,
  providerRuntime: false,
  publicRecordRetrieval: false,
  adminInheritance: false,
  mcpInheritance: false,
  recommendation: false,
  ranking: false,
  suitability: false,
  schoolSafetyInference: false,
  fairHousingInference: false,
  propertyAssignment: false,
  publicActivation: false,
} as const);

function fail(reasons: readonly string[]): AgentPlacePreparationPacket {
  return Object.freeze({
    status: AGENT_PLACE_PREPARATION_ADMISSION_STATUS,
    capability: AGENT_PLACE_PREPARATION_CAPABILITY,
    routeClassification: AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION,
    admission: 'FAIL_CLOSED',
    readiness: 'FAIL_CLOSED',
    city: null,
    sourcePosture: null,
    evidencePolicy: AGENT_PLACE_PREPARATION_EVIDENCE_POLICY,
    whatMatters: [],
    knownNow: [],
    needsVerification: [],
    missingEvidence: [],
    professionalCheckpoints: [],
    clientQuestions: [],
    talkingPoints: [],
    safeReieSurfaces: [],
    failureReasons: Object.freeze([...new Set(reasons)].sort()),
    protectedBoundaries: PROTECTED_BOUNDARIES,
  });
}

export function buildAgentPlacePreparationPacket(input: Readonly<{
  request: AgentPlacePreparationRequest;
  sourcePosture: AgentPlacePreparationSourcePosture;
}>): AgentPlacePreparationPacket {
  const { request, sourcePosture } = input;
  const reasons: string[] = [];
  const city = AGENT_PLACE_PREPARATION_P0_CITIES.find((candidate) => candidate.canonicalPlaceId === request.canonicalPlaceId) ?? null;

  if (request.actorIdentityType !== 'HUMAN_AGENT') reasons.push('HUMAN_AGENT_IDENTITY_REQUIRED');
  if (request.actorRole !== 'AGENT') reasons.push('AGENT_ROLE_REQUIRED');
  if (request.sessionMechanism !== 'HUMAN_AGENT_SESSION') reasons.push('HUMAN_AGENT_SESSION_REQUIRED');
  if (request.capability !== AGENT_PLACE_PREPARATION_CAPABILITY) reasons.push('PLACE_CAPABILITY_REQUIRED');
  if (request.route !== AGENT_PLACE_PREPARATION_FUTURE_ROUTE) reasons.push('EXACT_AGENT_PLACE_ROUTE_REQUIRED');
  if (request.adminContext) reasons.push('ADMIN_ONLY_CONTEXT_PROHIBITED');
  if (request.mcpContext) reasons.push('MCP_CONTEXT_PROHIBITED');
  if (request.customerContext) reasons.push('CUSTOMER_CONTEXT_PROHIBITED');
  if (request.persistenceRequested) reasons.push('PERSISTENCE_PROHIBITED');
  if (request.providerRuntimeRequired) reasons.push('PROVIDER_RUNTIME_PROHIBITED');
  if (request.recommendationRequested) reasons.push('RECOMMENDATION_PROHIBITED');
  if (request.rankingRequested) reasons.push('RANKING_PROHIBITED');
  if (request.suitabilityRequested) reasons.push('SUITABILITY_PROHIBITED');
  if (request.fairHousingSensitiveRequest) reasons.push('FAIR_HOUSING_SENSITIVE_REQUEST_PROHIBITED');
  if (request.schoolQualityRequest) reasons.push('SCHOOL_QUALITY_REQUEST_PROHIBITED');
  if (request.safetyRequest) reasons.push('SAFETY_REQUEST_PROHIBITED');
  if (request.freeFormPlaceValue?.trim()) reasons.push('FREE_FORM_PLACE_INPUT_PROHIBITED');
  if (request.requestedObjectType !== 'CITY') reasons.push('CITY_ONLY_P0_SCOPE_REQUIRED');
  if (!city) reasons.push('UNKNOWN_OR_UNADMITTED_CANONICAL_CITY');

  if (sourcePosture.sourceId !== AGENT_PLACE_CITY_SOURCE_ID || sourcePosture.sourceClass !== 'REPOSITORY_EDITORIAL_CITY_GUIDE') reasons.push('MISSING_SOURCE_IDENTITY');
  if (city && sourcePosture.sourceReference !== `city-guide:${city.canonicalPlaceId}`) reasons.push('SOURCE_REFERENCE_MISMATCH');
  if (sourcePosture.freshness !== 'DATED_DURABLE_EDITORIAL') reasons.push('STALE_OR_UNKNOWN_SOURCE');
  if (sourcePosture.completeness !== 'COMPLETE') reasons.push('SOURCE_EVIDENCE_INCOMPLETE');
  if (sourcePosture.conflict !== 'NO_CONFLICT') reasons.push('CONFLICTING_SOURCE_EVIDENCE');
  if (sourcePosture.rights !== 'CERTIFIED_INTERNAL_EDITORIAL_USE') reasons.push('SOURCE_RIGHTS_UNRESOLVED');
  if (sourcePosture.certification !== 'CITY_DECISION_GUIDE_CERTIFIED') reasons.push('CITY_CONTENT_CERTIFICATION_REQUIRED');

  if (reasons.length > 0) return fail(reasons);

  const safeReieSurfaces = Object.freeze([
    { label: 'City market orientation', href: city!.marketRoute, display: 'REQUIRED' as const },
    { label: 'Sources and methodology', href: '/sources', display: 'REQUIRED' as const },
    { label: 'Existing Agent Market context', href: '/agent/prepare/market', display: 'PROGRESSIVE_DISCLOSURE' as const },
  ]);

  return Object.freeze({
    status: AGENT_PLACE_PREPARATION_ADMISSION_STATUS,
    capability: AGENT_PLACE_PREPARATION_CAPABILITY,
    routeClassification: AGENT_PLACE_PREPARATION_ROUTE_CLASSIFICATION,
    admission: 'ADMITTED',
    readiness: 'READY_FOR_AGENT_REVIEW',
    city,
    sourcePosture: Object.freeze({ ...sourcePosture }),
    evidencePolicy: AGENT_PLACE_PREPARATION_EVIDENCE_POLICY,
    whatMatters: Object.freeze([
      'Use the exact city identity and governed editorial orientation to prepare neutral discussion questions.',
      'Separate durable city context from any matter that needs direct current verification.',
      'Do not convert place context into a recommendation, suitability statement, ranking, or property assignment.',
    ]),
    knownNow: Object.freeze([
      `Canonical city: ${city!.canonicalName}, ${city!.state}.`,
      `Editorial certification: ${city!.guideMaturity}.`,
      `Registry freshness is dated durable editorial context: ${city!.registryFreshness}.`,
    ]),
    needsVerification: Object.freeze([
      'Verify any municipal, county, access, destination, service, boundary, or current operational fact directly before relying on it.',
      'Treat any current-market discussion as separately governed and progressive; no current-market fact is in this P0 packet.',
      'Use professional or official verification where the discussion turns on a material factual dependency.',
    ]),
    missingEvidence: Object.freeze([
      'No neighborhood, submarket, corridor, market-area, or editorial-context identity is admitted.',
      'No school, safety, demographic, protected-class, customer, property, listing, CRM, or provider runtime data is admitted.',
      'No current market source, public source activation, or customer-facing route is authorized by this contract.',
    ]),
    professionalCheckpoints: Object.freeze([
      { label: 'Agent verification checkpoint' as const, role: 'MUNICIPAL_OR_COUNTY_AUTHORITY' as const, question: 'Which municipal or county fact requires direct official confirmation?' },
      { label: 'Agent verification checkpoint' as const, role: 'REAL_ESTATE_AGENT' as const, question: 'Which neutral city-context question needs factual verification before it informs a property discussion?' },
      { label: 'Agent verification checkpoint' as const, role: 'OTHER_GOVERNED_ROLE' as const, question: 'Which specialized question requires a directly qualified professional rather than an Agent preparation conclusion?' },
    ]),
    clientQuestions: Object.freeze([
      'What exactly is this City and what jurisdiction governs it?',
      'Which local facts are confirmed versus durable orientation context?',
      'Which municipal or development facts deserve direct verification?',
      'Which access or destination details should be checked for currentness?',
      'What should be independently investigated based on the client\'s own priorities?',
    ]),
    talkingPoints: Object.freeze([
      { label: 'FACT' as const, statement: `The selected canonical identity is ${city!.canonicalName}, ${city!.state}.` },
      { label: 'CONTEXT' as const, statement: 'Use the certified City Decision Guide as durable editorial orientation, not as a current operational conclusion.' },
      { label: 'LIMITATION' as const, statement: 'No current-market, school, safety, demographic, customer, or provider data is admitted in this packet.' },
      { label: 'VERIFICATION' as const, statement: 'Confirm material municipal, county, access, destination, boundary, or other current facts directly before relying on them.' },
    ]),
    safeReieSurfaces,
    failureReasons: [],
    protectedBoundaries: PROTECTED_BOUNDARIES,
  });
}
