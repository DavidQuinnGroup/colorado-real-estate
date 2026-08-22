export const COUNTY_PROPERTY_IDENTITY_STATUS = 'REIE_COUNTY_PROPERTY_IDENTITY_SCHEMA_MIGRATION_MVV' as const;

export type CountyPropertyIdentityReadState =
  | 'NO_ADMITTED_IDENTITY'
  | 'ADMITTED_WITH_LIMITATIONS'
  | 'REVIEW_REQUIRED'
  | 'CONFLICTING';

export type CountyPropertyIdentityMappingStatus =
  | 'MATCHED'
  | 'AMBIGUOUS'
  | 'CONFLICTING'
  | 'UNMATCHED'
  | 'STALE'
  | 'SUPERSEDED';

export type CountyPropertyIdentityMappingBasis =
  | 'AUTHORITATIVE_IDENTIFIER'
  | 'EXACT_IDENTIFIER_WITH_JURISDICTION'
  | 'ADDRESS_UNIT_LEGAL_CONFIRMATION'
  | 'MANUAL_REVIEW'
  | 'FUZZY_ADDRESS_CANDIDATE'
  | 'UNKNOWN';

export type CountyPropertyIdentityReadInput = Readonly<{
  propertyReference: string;
  identifiers: readonly Readonly<{
    identifierType: string;
    sourceValue: string;
    normalizedValue: string;
    sourceId: string;
    jurisdictionCode: string;
    freshness: 'FRESH' | 'AGING' | 'STALE' | 'UNKNOWN';
  }>[];
  mappings: readonly Readonly<{
    status: CountyPropertyIdentityMappingStatus;
    confidence: 'UNVERIFIED' | 'SOURCE_REPORTED' | 'DETERMINISTIC_MATCH' | 'MANUAL_REVIEW_CONFIRMED';
    basis: CountyPropertyIdentityMappingBasis;
    verificationRequired: boolean;
    conflictReference: string | null;
  }>[];
}>;

export type CountyPropertyIdentityReadContract = Readonly<{
  status: typeof COUNTY_PROPERTY_IDENTITY_STATUS;
  state: CountyPropertyIdentityReadState;
  propertyReference: string;
  accounts: readonly string[];
  parcels: readonly string[];
  identityStatus: readonly CountyPropertyIdentityMappingStatus[];
  confidence: readonly string[];
  sourceReferences: readonly string[];
  freshness: readonly string[];
  conflicts: readonly string[];
  verificationRequirements: readonly string[];
  admitted: boolean;
  protectedBoundaries: Readonly<{
    countyRetrieval: false;
    sourceActivation: false;
    backfill: false;
    ownerData: false;
    customerData: false;
    publicActivation: false;
  }>;
}>;

const protectedBoundaries = Object.freeze({
  countyRetrieval: false,
  sourceActivation: false,
  backfill: false,
  ownerData: false,
  customerData: false,
  publicActivation: false,
} as const);

const unique = (values: readonly string[]) => Object.freeze([...new Set(values.filter(Boolean))].sort());

export function buildCountyPropertyIdentityReadContract(input: CountyPropertyIdentityReadInput): CountyPropertyIdentityReadContract {
  const fuzzyMatched = input.mappings.some((mapping) => mapping.status === 'MATCHED' && mapping.basis === 'FUZZY_ADDRESS_CANDIDATE');
  const conflicts = unique(input.mappings.flatMap((mapping) => mapping.conflictReference ? [mapping.conflictReference] : mapping.status === 'CONFLICTING' ? ['CONFLICT_REVIEW_REQUIRED'] : []));
  const verificationRequirements = unique([
    ...input.mappings.flatMap((mapping) => mapping.verificationRequired ? ['PROFESSIONAL_VERIFICATION_REQUIRED'] : []),
    ...(fuzzyMatched ? ['FUZZY_ADDRESS_CANNOT_CREATE_MATCH'] : []),
    ...(input.mappings.some((mapping) => mapping.status === 'AMBIGUOUS') ? ['AMBIGUOUS_IDENTITY_REVIEW_REQUIRED'] : []),
    ...(input.mappings.some((mapping) => mapping.status === 'STALE') ? ['FRESHNESS_REVIEW_REQUIRED'] : []),
  ]);
  const hasMatched = input.mappings.some((mapping) => mapping.status === 'MATCHED') && !fuzzyMatched;
  const state: CountyPropertyIdentityReadState = conflicts.length > 0
    ? 'CONFLICTING'
    : hasMatched && verificationRequirements.length === 0
      ? 'ADMITTED_WITH_LIMITATIONS'
      : input.mappings.length > 0 || fuzzyMatched
        ? 'REVIEW_REQUIRED'
        : 'NO_ADMITTED_IDENTITY';

  return Object.freeze({
    status: COUNTY_PROPERTY_IDENTITY_STATUS,
    state,
    propertyReference: input.propertyReference,
    accounts: unique(input.identifiers.filter((identifier) => identifier.identifierType === 'ASSESSOR_ACCOUNT').map((identifier) => identifier.sourceValue)),
    parcels: unique(input.identifiers.filter((identifier) => identifier.identifierType === 'PARCEL').map((identifier) => identifier.sourceValue)),
    identityStatus: unique(input.mappings.map((mapping) => mapping.status)) as CountyPropertyIdentityMappingStatus[],
    confidence: unique(input.mappings.map((mapping) => mapping.confidence)),
    sourceReferences: unique(input.identifiers.map((identifier) => identifier.sourceId)),
    freshness: unique(input.identifiers.map((identifier) => identifier.freshness)),
    conflicts,
    verificationRequirements,
    admitted: state === 'ADMITTED_WITH_LIMITATIONS',
    protectedBoundaries,
  });
}
