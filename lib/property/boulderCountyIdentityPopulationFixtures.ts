export const BOULDER_COUNTY_IDENTITY_POPULATION_FIXTURES = Object.freeze({
  accountParcelCsv: '"strap","Parcelno"\n"R0001","00AB00CD00EF"\n"R0001","00AB00CD00F0"\n"R0002","00AB00CD00EF"\n',
  cleanSinglePropertyMatch: {
    hasCountyIdentity: true, hasExactNormalizedSitusAddress: true, hasExactUnitWhenRequired: true, hasBoulderJurisdiction: true, hasNonConflictingAccountParcelRelationship: true, hasConflictingCandidate: false, hasAddressMismatch: false, isCondominiumOrUnit: false,
  },
  multiParcelProperty: {
    hasCountyIdentity: true, hasExactNormalizedSitusAddress: true, hasExactUnitWhenRequired: true, hasBoulderJurisdiction: true, hasNonConflictingAccountParcelRelationship: true, hasConflictingCandidate: false, hasAddressMismatch: false, isCondominiumOrUnit: false,
  },
  multiAccountProperty: {
    hasCountyIdentity: true, hasExactNormalizedSitusAddress: true, hasExactUnitWhenRequired: true, hasBoulderJurisdiction: true, hasNonConflictingAccountParcelRelationship: true, hasConflictingCandidate: false, hasAddressMismatch: false, isCondominiumOrUnit: false,
  },
  condoUnitAmbiguity: {
    hasCountyIdentity: true, hasExactNormalizedSitusAddress: true, hasExactUnitWhenRequired: false, hasBoulderJurisdiction: true, hasNonConflictingAccountParcelRelationship: true, hasConflictingCandidate: false, hasAddressMismatch: false, isCondominiumOrUnit: true,
  },
  addressMismatch: {
    hasCountyIdentity: true, hasExactNormalizedSitusAddress: true, hasExactUnitWhenRequired: true, hasBoulderJurisdiction: true, hasNonConflictingAccountParcelRelationship: true, hasConflictingCandidate: false, hasAddressMismatch: true, isCondominiumOrUnit: false,
  },
  duplicateCollision: {
    hasCountyIdentity: true, hasExactNormalizedSitusAddress: true, hasExactUnitWhenRequired: true, hasBoulderJurisdiction: true, hasNonConflictingAccountParcelRelationship: true, hasConflictingCandidate: true, hasAddressMismatch: false, isCondominiumOrUnit: false,
  },
  missingAddress: {
    hasCountyIdentity: true, hasExactNormalizedSitusAddress: false, hasExactUnitWhenRequired: false, hasBoulderJurisdiction: false, hasNonConflictingAccountParcelRelationship: true, hasConflictingCandidate: false, hasAddressMismatch: false, isCondominiumOrUnit: false,
  },
  missingParcel: {
    hasCountyIdentity: false, hasExactNormalizedSitusAddress: false, hasExactUnitWhenRequired: false, hasBoulderJurisdiction: false, hasNonConflictingAccountParcelRelationship: false, hasConflictingCandidate: false, hasAddressMismatch: false, isCondominiumOrUnit: false,
  },
  conflictingCandidate: {
    hasCountyIdentity: true, hasExactNormalizedSitusAddress: true, hasExactUnitWhenRequired: true, hasBoulderJurisdiction: true, hasNonConflictingAccountParcelRelationship: false, hasConflictingCandidate: true, hasAddressMismatch: false, isCondominiumOrUnit: false,
  },
});
