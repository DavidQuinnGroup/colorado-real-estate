import type { GeographicObjectCandidateType, ObjectSourceReadinessResult } from './objectSourceReadiness';

export const NEIGHBORHOOD_SUBMARKET_SEARCH_MARKET_RELATIONSHIP_STATUS = 'IMPLEMENTED_INTERNAL_ARCHITECTURE_ONLY' as const;

export type SearchMarketRelationshipType = 'SEARCH_CONTEXT_FOR' | 'MARKET_CONTEXT_FOR' | 'DISPLAY_LABEL_FOR' | 'FILTER_CONTEXT_FOR' | 'DECISION_GUIDE_CONTEXT_FOR' | 'SOURCE_CONTEXT_FOR';
export type SearchMarketVisibility = 'ADMIN_ONLY' | 'AGENT_ONLY' | 'NOT_READY' | 'DATA_INSUFFICIENT' | 'COMPLIANCE_BLOCKED' | 'PUBLIC/GUIDED_ELIGIBLE';
export type SearchMarketRelationshipReason =
  | 'SOURCE_READINESS_REQUIRED' | 'OBJECT_IDENTITY_REQUIRED' | 'ROUTE_DOES_NOT_AUTHORIZE_RELATIONSHIP'
  | 'EDITORIAL_CONTEXT_NOT_GOVERNED_FACT' | 'UNSUPPORTED_JURISDICTION' | 'RANKING_NOT_AUTHORIZED'
  | 'RECOMMENDATION_NOT_AUTHORIZED' | 'SUITABILITY_NOT_AUTHORIZED' | 'PERSONALIZATION_NOT_AUTHORIZED'
  | 'PROTECTED_CLASS_INFERENCE_NOT_AUTHORIZED' | 'PROPERTY_ASSIGNMENT_NOT_AUTHORIZED' | 'PUBLIC_ACTIVATION_NOT_AUTHORIZED';

export type SearchMarketRelationshipInput = Readonly<{
  objectId: string; objectType: GeographicObjectCandidateType; relationshipType: SearchMarketRelationshipType;
  sourceReadiness: ObjectSourceReadinessResult; existingRoute: boolean; editorialContext: boolean;
  jurisdictionSupported: boolean; requestedActivation: boolean;
  prohibitedUse: Readonly<{ ranking: boolean; recommendation: boolean; suitability: boolean; personalization: boolean; protectedClassInference: boolean; propertyAssignment: boolean }>;
}>;

export type SearchMarketRelationshipResult = Readonly<{
  relationshipType: SearchMarketRelationshipType; visibility: SearchMarketVisibility; activationState: 'NOT_AUTHORIZED';
  searchRuntimeActivated: false; marketRuntimeActivated: false; mapActivated: false; propertyActivated: false; aeoActivated: false;
  reasons: readonly SearchMarketRelationshipReason[];
}>;

export function evaluateSearchMarketRelationship(input: SearchMarketRelationshipInput): SearchMarketRelationshipResult {
  const reasons: SearchMarketRelationshipReason[] = [];
  if (!input.objectId) reasons.push('OBJECT_IDENTITY_REQUIRED');
  if (input.sourceReadiness.certificationState !== 'CERTIFICATION_READY') reasons.push('SOURCE_READINESS_REQUIRED');
  if (input.existingRoute) reasons.push('ROUTE_DOES_NOT_AUTHORIZE_RELATIONSHIP');
  if (input.editorialContext) reasons.push('EDITORIAL_CONTEXT_NOT_GOVERNED_FACT');
  if (!input.jurisdictionSupported) reasons.push('UNSUPPORTED_JURISDICTION');
  if (input.prohibitedUse.ranking) reasons.push('RANKING_NOT_AUTHORIZED');
  if (input.prohibitedUse.recommendation) reasons.push('RECOMMENDATION_NOT_AUTHORIZED');
  if (input.prohibitedUse.suitability) reasons.push('SUITABILITY_NOT_AUTHORIZED');
  if (input.prohibitedUse.personalization) reasons.push('PERSONALIZATION_NOT_AUTHORIZED');
  if (input.prohibitedUse.protectedClassInference) reasons.push('PROTECTED_CLASS_INFERENCE_NOT_AUTHORIZED');
  if (input.prohibitedUse.propertyAssignment) reasons.push('PROPERTY_ASSIGNMENT_NOT_AUTHORIZED');
  if (input.requestedActivation) reasons.push('PUBLIC_ACTIVATION_NOT_AUTHORIZED');
  const visibility: SearchMarketVisibility = reasons.length === 0 ? 'PUBLIC/GUIDED_ELIGIBLE'
    : reasons.some((reason) => /RANKING|RECOMMENDATION|SUITABILITY|PERSONALIZATION|PROTECTED_CLASS|PROPERTY_ASSIGNMENT/.test(reason)) ? 'COMPLIANCE_BLOCKED'
      : reasons.includes('SOURCE_READINESS_REQUIRED') ? 'DATA_INSUFFICIENT' : 'NOT_READY';
  return { relationshipType: input.relationshipType, visibility, activationState: 'NOT_AUTHORIZED', searchRuntimeActivated: false, marketRuntimeActivated: false, mapActivated: false, propertyActivated: false, aeoActivated: false, reasons };
}
