export type BoulderCountyMappingEvidence = Readonly<{
  hasCountyIdentity: boolean;
  hasExactNormalizedSitusAddress: boolean;
  hasExactUnitWhenRequired: boolean;
  hasBoulderJurisdiction: boolean;
  hasNonConflictingAccountParcelRelationship: boolean;
  hasConflictingCandidate: boolean;
  hasAddressMismatch: boolean;
  isCondominiumOrUnit: boolean;
}>;

export type BoulderCountyMappingDecision = Readonly<{
  status: 'MATCHED' | 'AMBIGUOUS' | 'CONFLICTING' | 'UNMATCHED' | 'NO_MAPPING_CANDIDATE';
  confidence: 'DETERMINISTIC_MATCH' | 'SOURCE_REPORTED' | 'UNVERIFIED';
  basis: 'EXACT_IDENTIFIER_WITH_JURISDICTION' | 'MANUAL_REVIEW' | 'UNKNOWN';
  verificationRequired: boolean;
  reason: string;
}>;

export function decideBoulderCountyPropertyMapping(evidence: BoulderCountyMappingEvidence): BoulderCountyMappingDecision {
  if (!evidence.hasCountyIdentity) {
    return { status: 'NO_MAPPING_CANDIDATE', confidence: 'UNVERIFIED', basis: 'UNKNOWN', verificationRequired: true, reason: 'NO_ADMITTED_COUNTY_IDENTITY' };
  }
  if (evidence.hasConflictingCandidate) {
    return { status: 'CONFLICTING', confidence: 'SOURCE_REPORTED', basis: 'MANUAL_REVIEW', verificationRequired: true, reason: 'CONFLICTING_COUNTY_PROPERTY_CANDIDATES' };
  }
  if (evidence.hasAddressMismatch) {
    return { status: 'UNMATCHED', confidence: 'SOURCE_REPORTED', basis: 'MANUAL_REVIEW', verificationRequired: true, reason: 'COUNTY_ADDRESS_MISMATCH' };
  }
  if (!evidence.hasExactNormalizedSitusAddress) {
    return { status: 'NO_MAPPING_CANDIDATE', confidence: 'UNVERIFIED', basis: 'UNKNOWN', verificationRequired: true, reason: 'NO_ADMITTED_NON_OWNER_SITUS_ADDRESS' };
  }
  if (evidence.isCondominiumOrUnit && !evidence.hasExactUnitWhenRequired) {
    return { status: 'AMBIGUOUS', confidence: 'SOURCE_REPORTED', basis: 'MANUAL_REVIEW', verificationRequired: true, reason: 'UNIT_SPECIFIC_CONFIRMATION_REQUIRED' };
  }
  if (evidence.hasExactUnitWhenRequired && evidence.hasBoulderJurisdiction && evidence.hasNonConflictingAccountParcelRelationship) {
    return { status: 'MATCHED', confidence: 'DETERMINISTIC_MATCH', basis: 'EXACT_IDENTIFIER_WITH_JURISDICTION', verificationRequired: false, reason: 'DETERMINISTIC_NON_OWNER_LOCATION_CONFIRMATION' };
  }
  return { status: 'AMBIGUOUS', confidence: 'SOURCE_REPORTED', basis: 'MANUAL_REVIEW', verificationRequired: true, reason: 'DETERMINISTIC_CONFIRMATION_INCOMPLETE' };
}
