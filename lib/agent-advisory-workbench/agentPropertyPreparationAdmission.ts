import type { ReieProfessionalHandoffRole } from '../reieProfessionalHandoffTaxonomy';

export const AGENT_PROPERTY_PREPARATION_ADMISSION_STATUS = 'REIE_AGENT_PROPERTY_PREPARATION_ADMISSION_AND_VISIBILITY_GATE_MVV' as const;
export const AGENT_PROPERTY_PREPARATION_CAPABILITY = 'AGENT_PROPERTY_CONVERSATION_PREPARATION' as const;
export const AGENT_PROPERTY_PREPARATION_FUTURE_ROUTE = '/agent/prepare/property' as const;
export const AGENT_PROPERTY_LISTING_SOURCE_ID = 'REIE_STORED_LISTING_FACTS' as const;

export const AGENT_PROPERTY_PREPARATION_ROUTE_CLASSIFICATION = Object.freeze({
  capability: AGENT_PROPERTY_PREPARATION_CAPABILITY,
  routePattern: AGENT_PROPERTY_PREPARATION_FUTURE_ROUTE,
  requiredIdentityType: 'HUMAN_AGENT',
  requiredRole: 'AGENT',
  allowedMechanism: 'HUMAN_AGENT_SESSION',
  mutationPosture: 'READ_ONLY',
  activationState: 'NOT_AUTHORIZED',
  noGenericAgentGrant: true,
  adminInheritance: false,
} as const);

export type AgentPropertyEvidenceClass =
  | 'AGENT_VISIBLE_FACT'
  | 'AGENT_VISIBLE_DECISION_CONTEXT'
  | 'AGENT_VISIBLE_LIMITATION'
  | 'AGENT_VISIBLE_VERIFICATION_ITEM'
  | 'ADMIN_ONLY'
  | 'SOURCE_UNAVAILABLE'
  | 'NOT_AUTHORIZED';

export type AgentPropertyHumanEvidenceState =
  | 'KNOWN_NOW'
  | 'NEEDS_VERIFICATION'
  | 'NOT_AVAILABLE_IN_REIE'
  | 'PROFESSIONAL_REVIEW_NEEDED'
  | 'CONFLICTING_INFORMATION'
  | 'CURRENTNESS_NEEDS_CONFIRMATION';

export type AgentPropertyPreparationProperty = Readonly<{
  origin: 'REPOSITORY_PROPERTY' | 'SYNTHETIC_FIXTURE' | 'UNKNOWN';
  resolvedPropertyCount: number;
  slug: string;
  mlsId: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  status: string | null;
  isPrivateExclusive: boolean;
  price: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  propertyType: string | null;
  neighborhood: string | null;
}>;

export type AgentPropertyPreparationSourcePosture = Readonly<{
  sourceId: typeof AGENT_PROPERTY_LISTING_SOURCE_ID | string | null;
  sourceClass: 'EXISTING_REPOSITORY_LISTING_FACTS' | 'UNKNOWN' | 'PROVIDER_RUNTIME';
  listingReference: string | null;
  observedAt: string | null;
  freshness: 'CURRENT' | 'STALE' | 'UNKNOWN';
  completeness: 'COMPLETE' | 'INCOMPLETE';
  conflict: 'NO_CONFLICT' | 'CONFLICTING';
  rights: 'CERTIFIED_EXISTING_REPOSITORY_USE' | 'UNKNOWN_OR_UNRESOLVED';
  certification: 'PROPERTY_PRODUCT_CERTIFIED' | 'UNCERTIFIED';
}>;

export type AgentPropertyPreparationRequest = Readonly<{
  actorRole: 'AGENT' | 'ADMIN' | 'UNKNOWN';
  capability: typeof AGENT_PROPERTY_PREPARATION_CAPABILITY | string;
  route: typeof AGENT_PROPERTY_PREPARATION_FUTURE_ROUTE | string;
  adminContext: boolean;
  customerContext: boolean;
  persistenceRequested: boolean;
  providerRuntimeRequired: boolean;
  publicRecordRequested: boolean;
  recommendationRequested: boolean;
  fairHousingSensitiveRequest: boolean;
}>;

export type AgentPropertyEvidencePolicy = Readonly<{
  key: string;
  classification: AgentPropertyEvidenceClass;
  display: 'REQUIRED' | 'OPTIONAL' | 'PROGRESSIVE_DISCLOSURE' | 'NOT_AUTHORIZED';
  humanState: AgentPropertyHumanEvidenceState;
  purpose: string;
}>;

export const AGENT_PROPERTY_PREPARATION_EVIDENCE_POLICY: readonly AgentPropertyEvidencePolicy[] = Object.freeze([
  { key: 'canonical-identity', classification: 'AGENT_VISIBLE_FACT', display: 'REQUIRED', humanState: 'KNOWN_NOW', purpose: 'Exact existing Property slug and visible address identity.' },
  { key: 'listing-status', classification: 'AGENT_VISIBLE_FACT', display: 'REQUIRED', humanState: 'KNOWN_NOW', purpose: 'Current stored listing-status orientation.' },
  { key: 'current-list-price', classification: 'AGENT_VISIBLE_FACT', display: 'REQUIRED', humanState: 'KNOWN_NOW', purpose: 'Current stored list-price orientation without valuation or negotiation meaning.' },
  { key: 'property-configuration', classification: 'AGENT_VISIBLE_FACT', display: 'OPTIONAL', humanState: 'KNOWN_NOW', purpose: 'Available beds, baths, square footage, lot size, year built, and property type.' },
  { key: 'listing-remarks', classification: 'NOT_AUTHORIZED', display: 'NOT_AUTHORIZED', humanState: 'NEEDS_VERIFICATION', purpose: 'Free-form listing remarks are excluded from the first Agent contract.' },
  { key: 'photos-media', classification: 'AGENT_VISIBLE_LIMITATION', display: 'PROGRESSIVE_DISCLOSURE', humanState: 'NEEDS_VERIFICATION', purpose: 'Media is not independently interpreted as property-condition evidence.' },
  { key: 'price-history', classification: 'SOURCE_UNAVAILABLE', display: 'NOT_AUTHORIZED', humanState: 'NOT_AVAILABLE_IN_REIE', purpose: 'The model exists but no authorized property-history read is admitted.' },
  { key: 'open-house', classification: 'SOURCE_UNAVAILABLE', display: 'NOT_AUTHORIZED', humanState: 'NOT_AVAILABLE_IN_REIE', purpose: 'The model exists but no authorized property-event read is admitted.' },
  { key: 'comparison-context', classification: 'AGENT_VISIBLE_DECISION_CONTEXT', display: 'PROGRESSIVE_DISCLOSURE', humanState: 'NEEDS_VERIFICATION', purpose: 'Use existing comparison surfaces without selecting a winner or inferring value.' },
  { key: 'place-market-references', classification: 'AGENT_VISIBLE_DECISION_CONTEXT', display: 'PROGRESSIVE_DISCLOSURE', humanState: 'NEEDS_VERIFICATION', purpose: 'Route to governed neutral place and market surfaces only.' },
  { key: 'assessor-tax-parcel-ownership-permits', classification: 'SOURCE_UNAVAILABLE', display: 'NOT_AUTHORIZED', humanState: 'NOT_AVAILABLE_IN_REIE', purpose: 'No retrieval, correlation, owner display, or county/provider use.' },
  { key: 'hoa-insurance-flood-environmental-title', classification: 'AGENT_VISIBLE_VERIFICATION_ITEM', display: 'PROGRESSIVE_DISCLOSURE', humanState: 'PROFESSIONAL_REVIEW_NEEDED', purpose: 'Prepare verification questions without manufacturing a source answer.' },
  { key: 'inspection-condition', classification: 'AGENT_VISIBLE_VERIFICATION_ITEM', display: 'REQUIRED', humanState: 'PROFESSIONAL_REVIEW_NEEDED', purpose: 'Prepare inspection and condition questions; no condition conclusion.' },
  { key: 'financing-property-questions', classification: 'AGENT_VISIBLE_VERIFICATION_ITEM', display: 'PROGRESSIVE_DISCLOSURE', humanState: 'PROFESSIONAL_REVIEW_NEEDED', purpose: 'Prepare lender questions; no qualification or affordability conclusion.' },
  { key: 'admin-governance-context', classification: 'ADMIN_ONLY', display: 'NOT_AUTHORIZED', humanState: 'NOT_AVAILABLE_IN_REIE', purpose: 'Admin and MCP context never enter the Agent payload.' },
  { key: 'recommendation-and-suitability', classification: 'NOT_AUTHORIZED', display: 'NOT_AUTHORIZED', humanState: 'NOT_AVAILABLE_IN_REIE', purpose: 'No recommendation, pricing, valuation, ranking, or suitability output.' },
]);

export type AgentPropertyPreparationSnapshot = Readonly<{
  slug: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: string;
  price: number;
  propertyType: string;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
}>;

export type AgentPropertyPreparationPacket = Readonly<{
  status: typeof AGENT_PROPERTY_PREPARATION_ADMISSION_STATUS;
  capability: typeof AGENT_PROPERTY_PREPARATION_CAPABILITY;
  routeClassification: typeof AGENT_PROPERTY_PREPARATION_ROUTE_CLASSIFICATION;
  admission: 'ADMITTED' | 'FAIL_CLOSED';
  readiness: 'READY_FOR_AGENT_REVIEW' | 'REVIEW_REQUIRED' | 'FAIL_CLOSED';
  snapshot: AgentPropertyPreparationSnapshot | null;
  sourcePosture: AgentPropertyPreparationSourcePosture | null;
  evidencePolicy: readonly AgentPropertyEvidencePolicy[];
  whatMatters: readonly string[];
  knownNow: readonly string[];
  needsVerification: readonly string[];
  missingEvidence: readonly string[];
  professionalCheckpoints: readonly Readonly<{ label: 'Agent verification checkpoint'; role: ReieProfessionalHandoffRole; question: string }> [];
  safeReieSurfaces: readonly Readonly<{ label: string; href: string; display: 'REQUIRED' | 'PROGRESSIVE_DISCLOSURE' }> [];
  failureReasons: readonly string[];
  protectedBoundaries: Readonly<{
    customerData: false;
    crm: false;
    persistence: false;
    providerRuntime: false;
    publicRecordRetrieval: false;
    adminInheritance: false;
    recommendation: false;
    ranking: false;
    suitability: false;
    fairHousingInference: false;
  }>;
}>;

const PROTECTED_BOUNDARIES = Object.freeze({
  customerData: false,
  crm: false,
  persistence: false,
  providerRuntime: false,
  publicRecordRetrieval: false,
  adminInheritance: false,
  recommendation: false,
  ranking: false,
  suitability: false,
  fairHousingInference: false,
} as const);

const PROPERTY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function text(value: string | null) {
  return value?.trim() || null;
}

function validObservedAt(value: string | null) {
  return Boolean(value && Number.isFinite(Date.parse(value)));
}

function fail(reasons: readonly string[]): AgentPropertyPreparationPacket {
  return Object.freeze({
    status: AGENT_PROPERTY_PREPARATION_ADMISSION_STATUS,
    capability: AGENT_PROPERTY_PREPARATION_CAPABILITY,
    routeClassification: AGENT_PROPERTY_PREPARATION_ROUTE_CLASSIFICATION,
    admission: 'FAIL_CLOSED',
    readiness: 'FAIL_CLOSED',
    snapshot: null,
    sourcePosture: null,
    evidencePolicy: AGENT_PROPERTY_PREPARATION_EVIDENCE_POLICY,
    whatMatters: [],
    knownNow: [],
    needsVerification: [],
    missingEvidence: [],
    professionalCheckpoints: [],
    safeReieSurfaces: [],
    failureReasons: Object.freeze([...new Set(reasons)].sort()),
    protectedBoundaries: PROTECTED_BOUNDARIES,
  });
}

function optionalConfiguration(property: AgentPropertyPreparationProperty) {
  const labels = [
    property.beds === null ? null : `${property.beds} beds`,
    property.baths === null ? null : `${property.baths} baths`,
    property.sqft === null ? null : `${property.sqft.toLocaleString()} sq ft`,
    property.lotSize === null ? null : `${property.lotSize} lot size`,
    property.yearBuilt === null ? null : `built ${property.yearBuilt}`,
  ].filter((value): value is string => Boolean(value));
  return labels.length ? labels.join(' / ') : null;
}

export function buildAgentPropertyPreparationPacket(input: Readonly<{
  property: AgentPropertyPreparationProperty;
  sourcePosture: AgentPropertyPreparationSourcePosture;
  request: AgentPropertyPreparationRequest;
}>): AgentPropertyPreparationPacket {
  const { property, sourcePosture, request } = input;
  const reasons: string[] = [];

  if (request.actorRole !== 'AGENT') reasons.push('AGENT_ROLE_REQUIRED');
  if (request.capability !== AGENT_PROPERTY_PREPARATION_CAPABILITY) reasons.push('PROPERTY_CAPABILITY_REQUIRED');
  if (request.route !== AGENT_PROPERTY_PREPARATION_FUTURE_ROUTE) reasons.push('EXACT_AGENT_PROPERTY_ROUTE_REQUIRED');
  if (request.adminContext) reasons.push('ADMIN_ONLY_CONTEXT_PROHIBITED');
  if (request.customerContext) reasons.push('CUSTOMER_CONTEXT_PROHIBITED');
  if (request.persistenceRequested) reasons.push('PERSISTENCE_PROHIBITED');
  if (request.providerRuntimeRequired) reasons.push('PROVIDER_RUNTIME_PROHIBITED');
  if (request.publicRecordRequested) reasons.push('PUBLIC_RECORD_RETRIEVAL_PROHIBITED');
  if (request.recommendationRequested) reasons.push('RECOMMENDATION_PROHIBITED');
  if (request.fairHousingSensitiveRequest) reasons.push('FAIR_HOUSING_SENSITIVE_REQUEST_PROHIBITED');

  if (property.origin !== 'REPOSITORY_PROPERTY') reasons.push('SYNTHETIC_OR_UNKNOWN_PROPERTY_PROHIBITED');
  if (property.resolvedPropertyCount !== 1) reasons.push('UNKNOWN_OR_AMBIGUOUS_PROPERTY');
  if (!PROPERTY_SLUG_PATTERN.test(property.slug)) reasons.push('CANONICAL_PROPERTY_SLUG_REQUIRED');
  if (!text(property.mlsId) || !text(property.address) || !text(property.city) || property.state !== 'CO' || !text(property.zip)) reasons.push('CANONICAL_PROPERTY_IDENTITY_INCOMPLETE');
  if (property.status?.trim().toUpperCase() !== 'ACTIVE') reasons.push('PROPERTY_STATUS_NOT_ADMISSIBLE');
  if (property.isPrivateExclusive) reasons.push('PRIVATE_OR_NONPUBLIC_PROPERTY_PROHIBITED');
  if (typeof property.price !== 'number' || property.price <= 0 || !text(property.propertyType)) reasons.push('INSUFFICIENT_FACTUAL_EVIDENCE');

  if (sourcePosture.sourceId !== AGENT_PROPERTY_LISTING_SOURCE_ID || sourcePosture.sourceClass !== 'EXISTING_REPOSITORY_LISTING_FACTS') reasons.push('MISSING_SOURCE_IDENTITY');
  if (sourcePosture.listingReference !== property.mlsId) reasons.push('LISTING_REFERENCE_MISMATCH');
  if (!validObservedAt(sourcePosture.observedAt)) reasons.push('OBSERVED_DATE_REQUIRED');
  if (sourcePosture.freshness !== 'CURRENT') reasons.push('STALE_OR_UNKNOWN_MATERIAL_EVIDENCE');
  if (sourcePosture.completeness !== 'COMPLETE') reasons.push('MATERIAL_EVIDENCE_INCOMPLETE');
  if (sourcePosture.conflict !== 'NO_CONFLICT') reasons.push('CONFLICTING_MATERIAL_EVIDENCE');
  if (sourcePosture.rights !== 'CERTIFIED_EXISTING_REPOSITORY_USE' || sourcePosture.certification !== 'PROPERTY_PRODUCT_CERTIFIED') reasons.push('SOURCE_RIGHTS_OR_CERTIFICATION_REQUIRED');

  if (reasons.length > 0) return fail(reasons);

  const snapshot: AgentPropertyPreparationSnapshot = Object.freeze({
    slug: property.slug,
    address: property.address!,
    city: property.city!,
    state: property.state!,
    zip: property.zip!,
    status: property.status!,
    price: property.price!,
    propertyType: property.propertyType!,
    beds: property.beds,
    baths: property.baths,
    sqft: property.sqft,
    lotSize: property.lotSize,
    yearBuilt: property.yearBuilt,
  });
  const configuration = optionalConfiguration(property);
  const knownNow = [
    `Current stored listing status: ${snapshot.status}.`,
    `Current stored list price: ${snapshot.price}.`,
    `Property type: ${snapshot.propertyType}.`,
    ...(configuration ? [`Available configuration: ${configuration}.`] : []),
  ];
  const needsVerification = [
    'Confirm the current listing status, price, and included property facts directly before relying on them.',
    'Confirm measurements, lot details, room configuration, inclusions, and recent changes where material.',
    'Use governed place and market surfaces as orientation only; verify any fact material to the discussion.',
  ];
  const missingEvidence = [
    'No assessor, tax, parcel, ownership, permit, title, HOA, insurance, flood, or environmental record is admitted as a property fact.',
    'No price-history or open-house event is admitted by this first contract.',
    'Listing remarks and media are not independently interpreted as condition evidence.',
  ];

  return Object.freeze({
    status: AGENT_PROPERTY_PREPARATION_ADMISSION_STATUS,
    capability: AGENT_PROPERTY_PREPARATION_CAPABILITY,
    routeClassification: AGENT_PROPERTY_PREPARATION_ROUTE_CLASSIFICATION,
    admission: 'ADMITTED',
    readiness: configuration ? 'READY_FOR_AGENT_REVIEW' : 'REVIEW_REQUIRED',
    snapshot,
    sourcePosture: Object.freeze({ ...sourcePosture }),
    evidencePolicy: AGENT_PROPERTY_PREPARATION_EVIDENCE_POLICY,
    whatMatters: Object.freeze([
      'Use current stored listing facts to orient the conversation, not to conclude value, condition, or suitability.',
      'Separate visible facts from evidence that still requires direct verification or professional review.',
      'Prepare the next factual question before moving into comparison, place, market, or professional discussion.',
    ]),
    knownNow: Object.freeze(knownNow),
    needsVerification: Object.freeze(needsVerification),
    missingEvidence: Object.freeze(missingEvidence),
    professionalCheckpoints: Object.freeze([
      { label: 'Agent verification checkpoint' as const, role: 'INSPECTOR' as const, question: 'Which condition, systems, drainage, or maintenance questions need qualified inspection?' },
      { label: 'Agent verification checkpoint' as const, role: 'TITLE_PROFESSIONAL' as const, question: 'Which title, deed, easement, covenant, or disclosure materials require direct review?' },
      { label: 'Agent verification checkpoint' as const, role: 'TAX_PROFESSIONAL' as const, question: 'Which tax assumptions, exemptions, or ownership-cost questions require a qualified tax review?' },
      { label: 'Agent verification checkpoint' as const, role: 'INSURANCE_PROFESSIONAL' as const, question: 'Which insurance, flood, environmental, or coverage questions require direct confirmation?' },
      { label: 'Agent verification checkpoint' as const, role: 'LENDER' as const, question: 'Which financing assumptions require a lender conversation rather than a qualification conclusion?' },
      { label: 'Agent verification checkpoint' as const, role: 'MUNICIPAL_OR_COUNTY_AUTHORITY' as const, question: 'Which permit or public-record question requires direct official-source review?' },
    ]),
    safeReieSurfaces: Object.freeze([
      { label: 'Property detail', href: `/properties/${property.slug}`, display: 'REQUIRED' as const },
      { label: 'Sources and methodology', href: '/sources', display: 'REQUIRED' as const },
      { label: 'Property comparison', href: '/properties/compare', display: 'PROGRESSIVE_DISCLOSURE' as const },
      { label: 'Governed place and market context', href: '/market', display: 'PROGRESSIVE_DISCLOSURE' as const },
    ]),
    failureReasons: [],
    protectedBoundaries: PROTECTED_BOUNDARIES,
  });
}
