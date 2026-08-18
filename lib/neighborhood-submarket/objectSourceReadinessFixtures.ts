import type { ObjectSourceReadinessInput } from './objectSourceReadiness';

const fairHousingFirewall = {
  ranking: false,
  suitability: false,
  demographicInference: false,
  protectedClassInference: false,
  customerPersonalization: false,
  propertyAssignment: false,
} as const;

const evidence = (objectId: string): ObjectSourceReadinessInput['evidence'] => [
  { evidenceId: `${objectId}-IDENTITY`, evidenceType: 'OBJECT_IDENTITY', sourceReference: 'SRC-INTERNAL-GEOGRAPHIC-GOVERNANCE-FIXTURE', posture: 'SUPPORTED', supportsGovernedFact: true },
  { evidenceId: `${objectId}-TYPE`, evidenceType: 'OBJECT_TYPE', sourceReference: 'SRC-INTERNAL-GEOGRAPHIC-GOVERNANCE-FIXTURE', posture: 'SUPPORTED', supportsGovernedFact: true },
  { evidenceId: `${objectId}-JURISDICTION`, evidenceType: 'JURISDICTION', sourceReference: 'SRC-INTERNAL-GEOGRAPHIC-GOVERNANCE-FIXTURE', posture: 'SUPPORTED', supportsGovernedFact: true },
  { evidenceId: `${objectId}-BOUNDARY`, evidenceType: 'BOUNDARY', sourceReference: 'SRC-INTERNAL-GEOGRAPHIC-GOVERNANCE-FIXTURE', posture: 'SUPPORTED', supportsGovernedFact: true },
];

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
  evidence: evidence(objectId),
  evidenceReferences: [`${objectId}-IDENTITY`],
  attribution: { required: true, provided: true },
  boundary: { status: 'SUPPORTED', evidenceReferences: [`${objectId}-BOUNDARY`] },
  jurisdiction: { status: 'SUPPORTED', evidenceReferences: [`${objectId}-JURISDICTION`] },
  parentRelationship: { parentObjectId: null, relationshipType: null, evidenceIds: [], posture: 'NOT_APPLICABLE', professionalVerification: 'NOT_APPLICABLE' },
  relationships: [],
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
    parentRelationship: { parentObjectId: 'GEO-BOULDER-COUNTY', relationshipType: 'WITHIN' as const, evidenceIds: [], posture: 'UNRESOLVED' as const, professionalVerification: 'REQUIRED' as const },
  },
  gunbarrel: {
    ...baseReady('GEO-GUNBARREL', 'Gunbarrel', 'NON_AUTHORITATIVE_EDITORIAL_CONTEXT'),
    editorialSeparation: 'EDITORIAL_ONLY' as const,
    jurisdiction: { status: 'AMBIGUOUS' as const, evidenceReferences: [] },
    professionalVerification: 'REQUIRED' as const,
    parentRelationship: { parentObjectId: 'GEO-BOULDER-COUNTY', relationshipType: 'WITHIN' as const, evidenceIds: [], posture: 'UNRESOLVED' as const, professionalVerification: 'REQUIRED' as const },
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
  missingEvidenceIdentity: {
    ...baseReady('GEO-MISSING-EVIDENCE-ID-FIXTURE', 'Missing Evidence Identity Fixture', 'NEIGHBORHOOD'),
    evidence: [{ evidenceId: '', evidenceType: 'OBJECT_IDENTITY', sourceReference: 'SRC-INTERNAL-GEOGRAPHIC-GOVERNANCE-FIXTURE', posture: 'SUPPORTED', supportsGovernedFact: true }],
  },
  unknownEvidenceType: {
    ...baseReady('GEO-UNKNOWN-EVIDENCE-TYPE-FIXTURE', 'Unknown Evidence Type Fixture', 'NEIGHBORHOOD'),
    evidence: [{ evidenceId: 'UNKNOWN-EVIDENCE', evidenceType: 'UNSUPPORTED_EVIDENCE_TYPE', sourceReference: 'SRC-INTERNAL-GEOGRAPHIC-GOVERNANCE-FIXTURE', posture: 'SUPPORTED', supportsGovernedFact: true }] as ObjectSourceReadinessInput['evidence'],
  },
  editorialEvidence: {
    ...baseReady('GEO-EDITORIAL-EVIDENCE-FIXTURE', 'Editorial Evidence Fixture', 'NEIGHBORHOOD'),
    evidence: evidence('GEO-EDITORIAL-EVIDENCE-FIXTURE').map((item) => ({ ...item, supportsGovernedFact: false })),
  },
  unsupportedParentRelationship: {
    ...baseReady('GEO-UNSUPPORTED-PARENT-FIXTURE', 'Unsupported Parent Fixture', 'NEIGHBORHOOD'),
    parentRelationship: { parentObjectId: 'GEO-PARENT', relationshipType: 'WITHIN' as const, evidenceIds: [], posture: 'UNRESOLVED' as const, professionalVerification: 'REQUIRED' as const },
  },
  staleRelationshipEvidence: {
    ...baseReady('GEO-STALE-RELATIONSHIP-FIXTURE', 'Stale Relationship Fixture', 'NEIGHBORHOOD'),
    freshness: 'STALE' as const,
    relationships: [{ relatedObjectId: 'GEO-RELATED', relationshipType: 'ASSOCIATED_WITH' as const, evidenceIds: ['GEO-STALE-RELATIONSHIP-FIXTURE-RELATIONSHIP'], posture: 'SUPPORTED' as const, professionalVerification: 'COMPLETE' as const }],
    evidence: [...evidence('GEO-STALE-RELATIONSHIP-FIXTURE'), { evidenceId: 'GEO-STALE-RELATIONSHIP-FIXTURE-RELATIONSHIP', evidenceType: 'OBJECT_RELATIONSHIP', sourceReference: 'SRC-INTERNAL-GEOGRAPHIC-GOVERNANCE-FIXTURE', posture: 'SUPPORTED', supportsGovernedFact: true }],
  },
  conflictingRelationshipEvidence: {
    ...baseReady('GEO-CONFLICTING-RELATIONSHIP-FIXTURE', 'Conflicting Relationship Fixture', 'NEIGHBORHOOD'),
    relationships: [{ relatedObjectId: 'GEO-RELATED', relationshipType: 'OVERLAPS' as const, evidenceIds: ['GEO-CONFLICTING-RELATIONSHIP-FIXTURE-RELATIONSHIP'], posture: 'CONFLICTING' as const, professionalVerification: 'COMPLETE' as const }],
    evidence: [...evidence('GEO-CONFLICTING-RELATIONSHIP-FIXTURE'), { evidenceId: 'GEO-CONFLICTING-RELATIONSHIP-FIXTURE-RELATIONSHIP', evidenceType: 'OBJECT_RELATIONSHIP', sourceReference: 'SRC-INTERNAL-GEOGRAPHIC-GOVERNANCE-FIXTURE', posture: 'CONFLICTING', supportsGovernedFact: true }],
  },
} as const satisfies Record<string, ObjectSourceReadinessInput>;
