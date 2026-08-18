import type { ObjectSourceReadinessInput, ObjectSourceReadinessResult } from './objectSourceReadiness';
import type { SearchMarketRelationshipInput, SearchMarketRelationshipResult } from './searchMarketRelationship';

export const INTERNAL_SOURCE_CONTEXT_CONSUMER_ADAPTER_STATUS = 'IMPLEMENTED_ADMIN_ONLY_INTERNAL_READINESS' as const;
export type InternalSourceContextReason = 'SOURCE_CONTEXT_RELATIONSHIP_REQUIRED' | 'UPSTREAM_NOT_READY' | 'UPSTREAM_DATA_INSUFFICIENT' | 'UPSTREAM_COMPLIANCE_BLOCKED' | 'PUBLIC_VISIBILITY_NOT_AUTHORIZED' | 'ACTIVATION_NOT_AUTHORIZED' | 'MUTATION_NOT_AUTHORIZED' | 'FAIR_HOUSING_CLAIM_NOT_AUTHORIZED';
export type InternalSourceContextConsumerInput = Readonly<{
  relationship: SearchMarketRelationshipInput;
  relationshipResult: SearchMarketRelationshipResult;
  sourceReadinessInput: ObjectSourceReadinessInput;
  sourceReadinessResult: ObjectSourceReadinessResult;
  requestedVisibility: 'ADMIN_ONLY' | 'AGENT_ONLY' | 'GUIDED' | 'PUBLIC';
  requestedActivation: boolean;
  requestedMutation: boolean;
  prohibitedClaim: boolean;
}>;
export type InternalSourceContextConsumerResult = Readonly<{
  visibility: 'ADMIN_ONLY'; activationState: 'NOT_AUTHORIZED'; customerVisible: false; mutationAuthorized: false;
  object: Readonly<{ id: string; name: string; type: string }>;
  relationship: Readonly<{ type: 'SOURCE_CONTEXT_FOR'; sourceReferences: readonly string[]; evidenceReferences: readonly string[] }> | null;
  sourcePosture: Readonly<{ rights: string; freshness: string; attributionProvided: boolean; boundary: string; jurisdiction: string; parentRelationship: string; professionalVerification: string; correction: string; retirement: string; certification: string; limitations: readonly string[] }>;
  reasons: readonly InternalSourceContextReason[];
}>;
export function buildInternalSourceContextConsumer(input: InternalSourceContextConsumerInput): InternalSourceContextConsumerResult {
  const reasons: InternalSourceContextReason[] = [];
  if (input.relationship.relationshipType !== 'SOURCE_CONTEXT_FOR') reasons.push('SOURCE_CONTEXT_RELATIONSHIP_REQUIRED');
  if (input.relationshipResult.visibility === 'NOT_READY') reasons.push('UPSTREAM_NOT_READY');
  if (input.relationshipResult.visibility === 'DATA_INSUFFICIENT') reasons.push('UPSTREAM_DATA_INSUFFICIENT');
  if (input.relationshipResult.visibility === 'COMPLIANCE_BLOCKED') reasons.push('UPSTREAM_COMPLIANCE_BLOCKED');
  if (input.sourceReadinessResult.certificationState !== 'CERTIFICATION_READY') reasons.push('UPSTREAM_DATA_INSUFFICIENT');
  if (input.requestedVisibility !== 'ADMIN_ONLY') reasons.push('PUBLIC_VISIBILITY_NOT_AUTHORIZED');
  if (input.requestedActivation) reasons.push('ACTIVATION_NOT_AUTHORIZED');
  if (input.requestedMutation) reasons.push('MUTATION_NOT_AUTHORIZED');
  if (input.prohibitedClaim) reasons.push('FAIR_HOUSING_CLAIM_NOT_AUTHORIZED');
  const valid = reasons.length === 0;
  return { visibility: 'ADMIN_ONLY', activationState: 'NOT_AUTHORIZED', customerVisible: false, mutationAuthorized: false,
    object: { id: input.sourceReadinessInput.objectId, name: input.sourceReadinessInput.objectName, type: input.sourceReadinessInput.objectType },
    relationship: valid ? { type: 'SOURCE_CONTEXT_FOR', sourceReferences: input.sourceReadinessResult.sourceReferences, evidenceReferences: input.sourceReadinessResult.evidenceReferences } : null,
    sourcePosture: { rights: input.sourceReadinessInput.rights, freshness: input.sourceReadinessInput.freshness, attributionProvided: input.sourceReadinessInput.attribution.provided, boundary: input.sourceReadinessInput.boundary.status, jurisdiction: input.sourceReadinessInput.jurisdiction.status, parentRelationship: input.sourceReadinessInput.parentRelationship.posture, professionalVerification: input.sourceReadinessInput.professionalVerification, correction: input.sourceReadinessInput.correctionPath, retirement: input.sourceReadinessInput.retirementPolicy, certification: input.sourceReadinessResult.certificationState, limitations: input.sourceReadinessResult.reasons }, reasons };
}
