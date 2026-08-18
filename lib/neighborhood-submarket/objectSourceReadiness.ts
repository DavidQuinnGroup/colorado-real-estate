export const NEIGHBORHOOD_SUBMARKET_OBJECT_SOURCE_READINESS_STATUS = 'IMPLEMENTED_INTERNAL_READINESS_ONLY' as const;

export type GeographicObjectCandidateType =
  | 'NEIGHBORHOOD'
  | 'SUBDIVISION'
  | 'DISTRICT'
  | 'CORRIDOR'
  | 'MARKET_AREA'
  | 'UNINCORPORATED_COMMUNITY'
  | 'MUNICIPALITY'
  | 'COUNTY'
  | 'NON_AUTHORITATIVE_EDITORIAL_CONTEXT';

export type SourceUsePosture =
  | 'CERTIFICATION_READY'
  | 'NOT_READY_SOURCE_IDENTITY'
  | 'NOT_READY_RIGHTS'
  | 'NOT_READY_FRESHNESS'
  | 'NOT_READY_EVIDENCE'
  | 'NOT_READY_ATTRIBUTION'
  | 'NOT_READY_CONFLICT'
  | 'NOT_READY_BOUNDARY'
  | 'NOT_READY_JURISDICTION'
  | 'NOT_READY_EDITORIAL_SEPARATION'
  | 'NOT_READY_PROFESSIONAL_VERIFICATION'
  | 'NOT_READY_FAIR_HOUSING'
  | 'NOT_READY_CORRECTION'
  | 'NOT_READY_RETIREMENT';

export type ActivationState = 'NOT_AUTHORIZED';

export type GovernedEvidenceType =
  | 'OBJECT_IDENTITY'
  | 'OBJECT_TYPE'
  | 'JURISDICTION'
  | 'BOUNDARY'
  | 'PARENT_RELATIONSHIP'
  | 'OBJECT_RELATIONSHIP';

export type GovernedRelationshipType = 'WITHIN' | 'OVERLAPS' | 'ASSOCIATED_WITH' | 'ADJACENT_TO' | 'NON_JURISDICTIONAL_CONTEXT';

export type GovernedReadinessEvidence = Readonly<{
  evidenceId: string;
  evidenceType: GovernedEvidenceType | string;
  sourceReference: string | null;
  posture: 'SUPPORTED' | 'CONFLICTING' | 'INSUFFICIENT' | 'UNKNOWN';
  supportsGovernedFact: boolean;
}>;

export type GovernedRelationshipClaim = Readonly<{
  relatedObjectId: string;
  relationshipType: GovernedRelationshipType;
  evidenceIds: readonly string[];
  posture: 'SUPPORTED' | 'CONFLICTING' | 'UNRESOLVED';
  professionalVerification: 'COMPLETE' | 'REQUIRED';
}>;

export type ObjectSourceReadinessReason =
  | 'SOURCE_IDENTITY_REQUIRED'
  | 'STABLE_REFERENCE_REQUIRED'
  | 'MUTABLE_SOURCE_STATE_MUST_NOT_BE_COPIED'
  | 'SOURCE_REGISTRY_IDENTITY_NOT_USE_AUTHORITY'
  | 'SOURCE_QUALITY_NOT_PERMITTED_USE'
  | 'RIGHTS_APPROVAL_REQUIRED'
  | 'SOURCE_FRESHNESS_CURRENT_REQUIRED'
  | 'EVIDENCE_OBSERVATION_REQUIRED'
  | 'EVIDENCE_IDENTITY_REQUIRED'
  | 'EVIDENCE_TYPE_REQUIRED'
  | 'UNKNOWN_EVIDENCE_TYPE'
  | 'EVIDENCE_SOURCE_REFERENCE_REQUIRED'
  | 'EDITORIAL_EVIDENCE_NOT_GOVERNED_FACT_ELIGIBLE'
  | 'EVIDENCE_POSTURE_NOT_SUPPORTED'
  | 'ATTRIBUTION_REQUIRED'
  | 'BOUNDARY_CONFLICT_REQUIRES_REVIEW'
  | 'BOUNDARY_EVIDENCE_REQUIRED'
  | 'SUPPORTED_JURISDICTION_REQUIRED'
  | 'EDITORIAL_ONLY_CONTEXT_NOT_FACT_ELIGIBLE'
  | 'PROFESSIONAL_VERIFICATION_REQUIRED'
  | 'FAIR_HOUSING_FIREWALL_REQUIRED'
  | 'CORRECTION_PATH_REQUIRED'
  | 'RETIREMENT_POLICY_REQUIRED'
  | 'PARENT_RELATIONSHIP_EVIDENCE_REQUIRED'
  | 'RELATIONSHIP_EVIDENCE_REQUIRED'
  | 'RELATIONSHIP_EVIDENCE_CONFLICT_REQUIRES_REVIEW'
  | 'RELATIONSHIP_EVIDENCE_UNRESOLVED'
  | 'EXISTING_ROUTE_DOES_NOT_AUTHORIZE_ACTIVATION'
  | 'PUBLIC_ACTIVATION_NOT_AUTHORIZED';

export type ObjectSourceReadinessInput = Readonly<{
  objectId: string;
  objectName: string;
  objectType: GeographicObjectCandidateType;
  sourceIdentity: Readonly<{
    sourceId: string | null;
    sourceName: string;
    registryIdentityKnown: boolean;
    sourceQualityCertified: boolean;
  }>;
  stableReferences: readonly string[];
  copiedMutableSourceState: boolean;
  rights: 'APPROVED_FOR_INTERNAL_GOVERNANCE' | 'UNKNOWN' | 'RESTRICTED';
  freshness: 'CURRENT' | 'STALE' | 'UNKNOWN';
  evidence: readonly GovernedReadinessEvidence[];
  evidenceReferences: readonly string[];
  attribution: Readonly<{
    required: boolean;
    provided: boolean;
  }>;
  boundary: Readonly<{
    status: 'SUPPORTED' | 'CONFLICTING' | 'UNKNOWN';
    evidenceReferences: readonly string[];
  }>;
  jurisdiction: Readonly<{
    status: 'SUPPORTED' | 'UNSUPPORTED' | 'AMBIGUOUS';
    evidenceReferences: readonly string[];
  }>;
  parentRelationship: Readonly<{
    parentObjectId: string | null;
    relationshipType: GovernedRelationshipType | null;
    evidenceIds: readonly string[];
    posture: 'SUPPORTED' | 'CONFLICTING' | 'UNRESOLVED' | 'NOT_APPLICABLE';
    professionalVerification: 'COMPLETE' | 'REQUIRED' | 'NOT_APPLICABLE';
  }>;
  relationships: readonly GovernedRelationshipClaim[];
  editorialSeparation: 'FACTUAL_GOVERNANCE' | 'EDITORIAL_ONLY';
  professionalVerification: 'COMPLETE' | 'REQUIRED' | 'NOT_APPLICABLE';
  fairHousing: Readonly<{
    ranking: false;
    suitability: false;
    demographicInference: false;
    protectedClassInference: false;
    customerPersonalization: false;
    propertyAssignment: false;
  }>;
  correctionPath: 'DEFINED' | 'MISSING';
  retirementPolicy: 'DEFINED' | 'MISSING';
  existingRoute: boolean;
  requestedActivation: boolean;
}>;

export type ObjectSourceReadinessResult = Readonly<{
  objectId: string;
  objectName: string;
  posture: SourceUsePosture;
  certificationState: 'CERTIFICATION_READY' | 'NOT_CERTIFICATION_READY';
  activationState: ActivationState;
  publicSearchMapPropertyRouteAeoReady: false;
  publicActivationBlocked: true;
  stableReferences: readonly string[];
  sourceReferences: readonly string[];
  evidenceReferences: readonly string[];
  reasons: readonly ObjectSourceReadinessReason[];
}>;

const firstPostureByReason: Record<ObjectSourceReadinessReason, SourceUsePosture> = {
  SOURCE_IDENTITY_REQUIRED: 'NOT_READY_SOURCE_IDENTITY',
  STABLE_REFERENCE_REQUIRED: 'NOT_READY_SOURCE_IDENTITY',
  MUTABLE_SOURCE_STATE_MUST_NOT_BE_COPIED: 'NOT_READY_SOURCE_IDENTITY',
  SOURCE_REGISTRY_IDENTITY_NOT_USE_AUTHORITY: 'NOT_READY_SOURCE_IDENTITY',
  SOURCE_QUALITY_NOT_PERMITTED_USE: 'NOT_READY_SOURCE_IDENTITY',
  RIGHTS_APPROVAL_REQUIRED: 'NOT_READY_RIGHTS',
  SOURCE_FRESHNESS_CURRENT_REQUIRED: 'NOT_READY_FRESHNESS',
  EVIDENCE_OBSERVATION_REQUIRED: 'NOT_READY_EVIDENCE',
  EVIDENCE_IDENTITY_REQUIRED: 'NOT_READY_EVIDENCE',
  EVIDENCE_TYPE_REQUIRED: 'NOT_READY_EVIDENCE',
  UNKNOWN_EVIDENCE_TYPE: 'NOT_READY_EVIDENCE',
  EVIDENCE_SOURCE_REFERENCE_REQUIRED: 'NOT_READY_EVIDENCE',
  EDITORIAL_EVIDENCE_NOT_GOVERNED_FACT_ELIGIBLE: 'NOT_READY_EDITORIAL_SEPARATION',
  EVIDENCE_POSTURE_NOT_SUPPORTED: 'NOT_READY_EVIDENCE',
  ATTRIBUTION_REQUIRED: 'NOT_READY_ATTRIBUTION',
  BOUNDARY_CONFLICT_REQUIRES_REVIEW: 'NOT_READY_CONFLICT',
  BOUNDARY_EVIDENCE_REQUIRED: 'NOT_READY_BOUNDARY',
  SUPPORTED_JURISDICTION_REQUIRED: 'NOT_READY_JURISDICTION',
  EDITORIAL_ONLY_CONTEXT_NOT_FACT_ELIGIBLE: 'NOT_READY_EDITORIAL_SEPARATION',
  PROFESSIONAL_VERIFICATION_REQUIRED: 'NOT_READY_PROFESSIONAL_VERIFICATION',
  FAIR_HOUSING_FIREWALL_REQUIRED: 'NOT_READY_FAIR_HOUSING',
  CORRECTION_PATH_REQUIRED: 'NOT_READY_CORRECTION',
  RETIREMENT_POLICY_REQUIRED: 'NOT_READY_RETIREMENT',
  PARENT_RELATIONSHIP_EVIDENCE_REQUIRED: 'NOT_READY_EVIDENCE',
  RELATIONSHIP_EVIDENCE_REQUIRED: 'NOT_READY_EVIDENCE',
  RELATIONSHIP_EVIDENCE_CONFLICT_REQUIRES_REVIEW: 'NOT_READY_CONFLICT',
  RELATIONSHIP_EVIDENCE_UNRESOLVED: 'NOT_READY_CONFLICT',
  EXISTING_ROUTE_DOES_NOT_AUTHORIZE_ACTIVATION: 'NOT_READY_SOURCE_IDENTITY',
  PUBLIC_ACTIVATION_NOT_AUTHORIZED: 'NOT_READY_SOURCE_IDENTITY',
};

const governedEvidenceTypes = new Set<GovernedEvidenceType>([
  'OBJECT_IDENTITY', 'OBJECT_TYPE', 'JURISDICTION', 'BOUNDARY', 'PARENT_RELATIONSHIP', 'OBJECT_RELATIONSHIP',
]);

const supportsDimension = (
  evidence: readonly GovernedReadinessEvidence[],
  evidenceIds: readonly string[],
  evidenceType: GovernedEvidenceType,
): boolean => evidenceIds.length > 0 && evidenceIds.every((evidenceId) => evidence.some((item) =>
  item.evidenceId === evidenceId
  && item.evidenceType === evidenceType
  && item.posture === 'SUPPORTED'
  && item.supportsGovernedFact,
));

const hasFairHousingFirewall = (input: ObjectSourceReadinessInput): boolean =>
  input.fairHousing.ranking === false
  && input.fairHousing.suitability === false
  && input.fairHousing.demographicInference === false
  && input.fairHousing.protectedClassInference === false
  && input.fairHousing.customerPersonalization === false
  && input.fairHousing.propertyAssignment === false;

export function evaluateObjectSourceReadiness(input: ObjectSourceReadinessInput): ObjectSourceReadinessResult {
  const reasons: ObjectSourceReadinessReason[] = [];

  if (!input.sourceIdentity.sourceId || !input.sourceIdentity.registryIdentityKnown) reasons.push('SOURCE_IDENTITY_REQUIRED');
  if (input.stableReferences.length === 0) reasons.push('STABLE_REFERENCE_REQUIRED');
  if (input.copiedMutableSourceState) reasons.push('MUTABLE_SOURCE_STATE_MUST_NOT_BE_COPIED');
  if (input.sourceIdentity.registryIdentityKnown && input.rights !== 'APPROVED_FOR_INTERNAL_GOVERNANCE') reasons.push('SOURCE_REGISTRY_IDENTITY_NOT_USE_AUTHORITY');
  if (input.sourceIdentity.sourceQualityCertified && input.rights !== 'APPROVED_FOR_INTERNAL_GOVERNANCE') reasons.push('SOURCE_QUALITY_NOT_PERMITTED_USE');
  if (input.rights !== 'APPROVED_FOR_INTERNAL_GOVERNANCE') reasons.push('RIGHTS_APPROVAL_REQUIRED');
  if (input.freshness !== 'CURRENT') reasons.push('SOURCE_FRESHNESS_CURRENT_REQUIRED');
  if (input.evidenceReferences.length === 0) reasons.push('EVIDENCE_OBSERVATION_REQUIRED');
  if (input.evidence.some((item) => !item.evidenceId)) reasons.push('EVIDENCE_IDENTITY_REQUIRED');
  if (input.evidence.some((item) => !item.evidenceType)) reasons.push('EVIDENCE_TYPE_REQUIRED');
  if (input.evidence.some((item) => !governedEvidenceTypes.has(item.evidenceType as GovernedEvidenceType))) reasons.push('UNKNOWN_EVIDENCE_TYPE');
  if (input.evidence.some((item) => item.supportsGovernedFact && !item.sourceReference)) reasons.push('EVIDENCE_SOURCE_REFERENCE_REQUIRED');
  if (input.evidence.some((item) => !item.supportsGovernedFact)) reasons.push('EDITORIAL_EVIDENCE_NOT_GOVERNED_FACT_ELIGIBLE');
  if (input.evidence.some((item) => item.posture !== 'SUPPORTED')) reasons.push('EVIDENCE_POSTURE_NOT_SUPPORTED');
  if (!supportsDimension(input.evidence, input.evidenceReferences, 'OBJECT_IDENTITY')
    || !input.evidence.some((item) => item.evidenceType === 'OBJECT_TYPE' && item.posture === 'SUPPORTED' && item.supportsGovernedFact)) reasons.push('EVIDENCE_OBSERVATION_REQUIRED');
  if (input.attribution.required && !input.attribution.provided) reasons.push('ATTRIBUTION_REQUIRED');
  if (input.boundary.status === 'CONFLICTING') reasons.push('BOUNDARY_CONFLICT_REQUIRES_REVIEW');
  if (input.boundary.status !== 'SUPPORTED' || input.boundary.evidenceReferences.length === 0) reasons.push('BOUNDARY_EVIDENCE_REQUIRED');
  if (input.jurisdiction.status !== 'SUPPORTED' || input.jurisdiction.evidenceReferences.length === 0) reasons.push('SUPPORTED_JURISDICTION_REQUIRED');
  if (input.jurisdiction.status === 'SUPPORTED' && !supportsDimension(input.evidence, input.jurisdiction.evidenceReferences, 'JURISDICTION')) reasons.push('SUPPORTED_JURISDICTION_REQUIRED');
  if (input.boundary.status === 'SUPPORTED' && !supportsDimension(input.evidence, input.boundary.evidenceReferences, 'BOUNDARY')) reasons.push('BOUNDARY_EVIDENCE_REQUIRED');
  const parent = input.parentRelationship;
  if (parent.parentObjectId || parent.relationshipType) {
    if (!parent.parentObjectId || !parent.relationshipType || !supportsDimension(input.evidence, parent.evidenceIds, 'PARENT_RELATIONSHIP')) reasons.push('PARENT_RELATIONSHIP_EVIDENCE_REQUIRED');
    if (parent.posture === 'CONFLICTING') reasons.push('RELATIONSHIP_EVIDENCE_CONFLICT_REQUIRES_REVIEW');
    if (parent.posture === 'UNRESOLVED') reasons.push('RELATIONSHIP_EVIDENCE_UNRESOLVED');
    if (parent.professionalVerification !== 'COMPLETE') reasons.push('PROFESSIONAL_VERIFICATION_REQUIRED');
  }
  for (const relationship of input.relationships) {
    if (!relationship.relatedObjectId || !supportsDimension(input.evidence, relationship.evidenceIds, 'OBJECT_RELATIONSHIP')) reasons.push('RELATIONSHIP_EVIDENCE_REQUIRED');
    if (relationship.posture === 'CONFLICTING') reasons.push('RELATIONSHIP_EVIDENCE_CONFLICT_REQUIRES_REVIEW');
    if (relationship.posture === 'UNRESOLVED') reasons.push('RELATIONSHIP_EVIDENCE_UNRESOLVED');
    if (relationship.professionalVerification !== 'COMPLETE') reasons.push('PROFESSIONAL_VERIFICATION_REQUIRED');
  }
  if (input.editorialSeparation === 'EDITORIAL_ONLY') reasons.push('EDITORIAL_ONLY_CONTEXT_NOT_FACT_ELIGIBLE');
  if (input.professionalVerification !== 'COMPLETE') reasons.push('PROFESSIONAL_VERIFICATION_REQUIRED');
  if (!hasFairHousingFirewall(input)) reasons.push('FAIR_HOUSING_FIREWALL_REQUIRED');
  if (input.correctionPath !== 'DEFINED') reasons.push('CORRECTION_PATH_REQUIRED');
  if (input.retirementPolicy !== 'DEFINED') reasons.push('RETIREMENT_POLICY_REQUIRED');
  if (input.existingRoute) reasons.push('EXISTING_ROUTE_DOES_NOT_AUTHORIZE_ACTIVATION');
  if (input.requestedActivation) reasons.push('PUBLIC_ACTIVATION_NOT_AUTHORIZED');

  const posture = reasons.length === 0 ? 'CERTIFICATION_READY' : firstPostureByReason[reasons[0]];

  return {
    objectId: input.objectId,
    objectName: input.objectName,
    posture,
    certificationState: posture === 'CERTIFICATION_READY' ? 'CERTIFICATION_READY' : 'NOT_CERTIFICATION_READY',
    activationState: 'NOT_AUTHORIZED',
    publicSearchMapPropertyRouteAeoReady: false,
    publicActivationBlocked: true,
    stableReferences: input.stableReferences,
    sourceReferences: input.sourceIdentity.sourceId ? [input.sourceIdentity.sourceId] : [],
    evidenceReferences: input.evidence.map((item) => item.evidenceId).filter(Boolean),
    reasons,
  };
}
