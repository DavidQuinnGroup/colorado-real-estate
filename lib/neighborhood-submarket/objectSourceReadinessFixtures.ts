import type { ObjectSourceReadinessInput } from './objectSourceReadiness';

const fairHousingFirewall = {
  ranking: false,
  suitability: false,
  demographicInference: false,
  protectedClassInference: false,
  customerPersonalization: false,
  propertyAssignment: false,
} as const;

const baseReady = (
  objectId: string,
  objectName: string,
  objectType: ObjectSourceReadinessInput['objectType'],
): ObjectSourceReadinessInput => ({
  objectId,
  objectName,
  objectType,
  sourceIdentity: {
    sourceId: 'SRC-INTERNAL-GEOGRAPHIC-GOVERNANCE-FIXTURE',
    sourceName: 'Internal Geographic Governance Fixture',
    registryIdentityKnown: true,
    sourceQualityCertified: true,
  },
  stableReferences: [`${objectId}-STABLE-REFERENCE`],
  copiedMutableSourceState: false,
  rights: 'APPROVED_FOR_INTERNAL_GOVERNANCE',
  freshness: 'CURRENT',
  evidenceReferences: [`${objectId}-EVIDENCE`],
  attribution: { required: true, provided: true },
  boundary: { status: 'SUPPORTED', evidenceReferences: [`${objectId}-BOUNDARY`] },
  jurisdiction: { status: 'SUPPORTED', evidenceReferences: [`${objectId}-JURISDICTION`] },
  editorialSeparation: 'FACTUAL_GOVERNANCE',
  professionalVerification: 'COMPLETE',
  fairHousing: fairHousingFirewall,
  correctionPath: 'DEFINED',
  retirementPolicy: 'DEFINED',
  existingRoute: false,
  requestedActivation: false,
});

export const OBJECT_SOURCE_READINESS_FIXTURES = {
  niwot: {
    ...baseReady('GEO-NIWOT', 'Niwot', 'UNINCORPORATED_COMMUNITY'),
    jurisdiction: { status: 'AMBIGUOUS' as const, evidenceReferences: [] },
    boundary: { status: 'UNKNOWN' as const, evidenceReferences: [] },
    professionalVerification: 'REQUIRED' as const,
  },
  gunbarrel: {
    ...baseReady('GEO-GUNBARREL', 'Gunbarrel', 'NON_AUTHORITATIVE_EDITORIAL_CONTEXT'),
    editorialSeparation: 'EDITORIAL_ONLY' as const,
    jurisdiction: { status: 'AMBIGUOUS' as const, evidenceReferences: [] },
    professionalVerification: 'REQUIRED' as const,
  },
  tableMesa: {
    ...baseReady('GEO-TABLE-MESA', 'Table Mesa', 'NEIGHBORHOOD'),
    evidenceReferences: [],
    boundary: { status: 'UNKNOWN' as const, evidenceReferences: [] },
  },
  municipality: baseReady('GEO-MUNICIPALITY-FIXTURE', 'Municipality Fixture', 'MUNICIPALITY'),
  subdivision: baseReady('GEO-SUBDIVISION-FIXTURE', 'Subdivision Fixture', 'SUBDIVISION'),
  corridor: baseReady('GEO-CORRIDOR-FIXTURE', 'Corridor Fixture', 'CORRIDOR'),
  marketArea: baseReady('GEO-MARKET-AREA-FIXTURE', 'Market Area Fixture', 'MARKET_AREA'),
  editorialOnlyContext: {
    ...baseReady('GEO-EDITORIAL-CONTEXT-FIXTURE', 'Editorial Context Fixture', 'NON_AUTHORITATIVE_EDITORIAL_CONTEXT'),
    editorialSeparation: 'EDITORIAL_ONLY' as const,
  },
  unknownRights: {
    ...baseReady('GEO-UNKNOWN-RIGHTS-FIXTURE', 'Unknown Rights Fixture', 'NEIGHBORHOOD'),
    rights: 'UNKNOWN' as const,
  },
  staleSource: {
    ...baseReady('GEO-STALE-SOURCE-FIXTURE', 'Stale Source Fixture', 'NEIGHBORHOOD'),
    freshness: 'STALE' as const,
  },
  conflictingBoundary: {
    ...baseReady('GEO-CONFLICTING-BOUNDARY-FIXTURE', 'Conflicting Boundary Fixture', 'NEIGHBORHOOD'),
    boundary: { status: 'CONFLICTING' as const, evidenceReferences: ['CONFLICTING-BOUNDARY-EVIDENCE'] },
  },
  unsupportedJurisdiction: {
    ...baseReady('GEO-UNSUPPORTED-JURISDICTION-FIXTURE', 'Unsupported Jurisdiction Fixture', 'NEIGHBORHOOD'),
    jurisdiction: { status: 'UNSUPPORTED' as const, evidenceReferences: [] },
  },
  completeInternalGovernanceReady: baseReady('GEO-COMPLETE-INTERNAL-READY-FIXTURE', 'Complete Internal Ready Fixture', 'NEIGHBORHOOD'),
  existingRouteNoAuthority: {
    ...baseReady('GEO-EXISTING-ROUTE-FIXTURE', 'Existing Route Fixture', 'NEIGHBORHOOD'),
    existingRoute: true,
  },
  sourceRegistryNoUseAuthority: {
    ...baseReady('GEO-REGISTRY-NO-AUTHORITY-FIXTURE', 'Registry No Authority Fixture', 'NEIGHBORHOOD'),
    rights: 'RESTRICTED' as const,
  },
  sourceQualityNoUseAuthority: {
    ...baseReady('GEO-SOURCE-QUALITY-NO-AUTHORITY-FIXTURE', 'Source Quality No Authority Fixture', 'NEIGHBORHOOD'),
    rights: 'UNKNOWN' as const,
  },
  requestedPublicActivation: {
    ...baseReady('GEO-REQUESTED-PUBLIC-ACTIVATION-FIXTURE', 'Requested Public Activation Fixture', 'NEIGHBORHOOD'),
    requestedActivation: true,
  },
} as const satisfies Record<string, ObjectSourceReadinessInput>;
