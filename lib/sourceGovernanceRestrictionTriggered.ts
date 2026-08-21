export const PROJECT_ATLAS_RESTRICTION_TRIGGERED_SOURCE_GOVERNANCE_STATUS = 'PROJECT_ATLAS_RESTRICTION_TRIGGERED_SOURCE_GOVERNANCE_CERTIFIED' as const;
export const MLS_GRID_RIGHTS_CLARIFICATION_STATUS = 'AWAITING_RESPONSE_NONBLOCKING_FOR_ORDINARY_INTERNAL_PROFESSIONAL_ANALYSIS' as const;

export type SourceGovernanceUse =
  | 'RAW_SOURCE_RECORD'
  | 'NORMALIZED_INTERNAL_FACT'
  | 'DERIVED_SINGLE_RECORD_FACT'
  | 'CURRENT_AGGREGATE_STATISTIC'
  | 'RETAINED_AGGREGATE_SNAPSHOT'
  | 'HISTORICAL_COMPARISON'
  | 'AGENT_PROFESSIONAL_SYNTHESIS'
  | 'CLIENT_FACING_PROFESSIONAL_WORK_PRODUCT'
  | 'PUBLIC_WEBSITE_DISPLAY'
  | 'PROVIDER_RETRIEVAL';

export type RestrictionTrigger =
  | 'EXPLICIT_PROHIBITION'
  | 'EXPLICIT_PERMISSION_REQUIREMENT'
  | 'AUTOMATION_RESTRICTION'
  | 'DERIVED_WORK_RESTRICTION'
  | 'RETENTION_LIMIT'
  | 'DELETION_REQUIREMENT'
  | 'TERMINATION_PURGE_REQUIREMENT'
  | 'PUBLIC_DISPLAY_RESTRICTION'
  | 'REDISTRIBUTION_RESTRICTION'
  | 'ATTRIBUTION_REQUIREMENT_NOT_YET_SATISFIED'
  | 'TECHNICAL_ACCESS_RESTRICTION'
  | 'RATE_LIMIT_ACCESS_POLICY'
  | 'LICENSE_SCOPE_CONFLICT'
  | 'MATERIALLY_AMBIGUOUS_CONTRACTUAL_TERM'
  | 'REGULATORY_OR_BROKERAGE_POLICY_CONFLICT';

export type SourceGovernanceDecision =
  | 'NOT_BLOCKED_BY_PERMISSION_POSTURE'
  | 'BLOCKED_BY_IDENTIFIED_RESTRICTION'
  | 'BLOCKED_BY_MISSING_DATA'
  | 'BLOCKED_BY_ARCHITECTURE'
  | 'BLOCKED_BY_SOURCE_QUALITY'
  | 'BLOCKED_BY_OTHER_GOVERNANCE'
  | 'READY_FOR_NEXT_GATE';

export type RestrictionEvidence = Readonly<{
  trigger: RestrictionTrigger;
  evidenceReference: string;
  affectedUses: readonly SourceGovernanceUse[];
}>;

export type RestrictionTriggeredSourceGovernanceInput = Readonly<{
  sourceAccessAuthorized: boolean;
  professionalPurpose: boolean;
  proposedUse: SourceGovernanceUse;
  knownTermsMateriallyAmbiguous: boolean;
  restrictionEvidence: readonly RestrictionEvidence[];
  sourceQualitySufficient: boolean;
  historicalEvidenceAvailable: boolean;
  architectureReady: boolean;
}>;

export type RestrictionTriggeredSourceGovernanceResult = Readonly<{
  decision: SourceGovernanceDecision;
  permissionPosture: 'NOT_BLOCKED_BY_PERMISSION_POSTURE' | 'BLOCKED_BY_IDENTIFIED_RESTRICTION' | 'CLARIFICATION_REQUIRED';
  restrictionEvidenceReferences: readonly string[];
  reasons: readonly string[];
  providerContactRequired: false;
  sourceActivityAuthorized: false;
  runtimeActivationAuthorized: false;
}>;

export const MLS_GRID_RATE_LIMIT_RESTRICTION: RestrictionEvidence = Object.freeze({
  trigger: 'RATE_LIMIT_ACCESS_POLICY',
  evidenceReference: 'REIE-MLS-GRID-RATE-LIMIT-SAFETY-AND-SCOPED-INGEST-RECERTIFICATION-PREPARATION#Provider-Safety-Event',
  affectedUses: ['PROVIDER_RETRIEVAL'] as const,
});

function hasEvidence(reference: string) {
  return reference.trim().length > 0;
}

function isInternalProfessionalUse(use: SourceGovernanceUse) {
  return use !== 'PUBLIC_WEBSITE_DISPLAY' && use !== 'PROVIDER_RETRIEVAL';
}

export function evaluateRestrictionTriggeredSourceGovernance(
  input: RestrictionTriggeredSourceGovernanceInput,
): RestrictionTriggeredSourceGovernanceResult {
  const citedRestrictions = input.restrictionEvidence.filter(
    (restriction) => hasEvidence(restriction.evidenceReference) && restriction.affectedUses.includes(input.proposedUse),
  );
  const uncitedRestrictionAssertion = input.restrictionEvidence.some(
    (restriction) => !hasEvidence(restriction.evidenceReference) && restriction.affectedUses.includes(input.proposedUse),
  );
  const references = citedRestrictions.map((restriction) => restriction.evidenceReference);

  if (!input.sourceAccessAuthorized || !input.professionalPurpose) {
    return result('BLOCKED_BY_OTHER_GOVERNANCE', 'CLARIFICATION_REQUIRED', references, ['AUTHORIZED_ACCESS_AND_PROFESSIONAL_PURPOSE_REQUIRED']);
  }
  if (input.knownTermsMateriallyAmbiguous) {
    return result('BLOCKED_BY_OTHER_GOVERNANCE', 'CLARIFICATION_REQUIRED', references, ['MATERIAL_TERM_CLARIFICATION_REQUIRED']);
  }
  if (citedRestrictions.length > 0) {
    return result('BLOCKED_BY_IDENTIFIED_RESTRICTION', 'BLOCKED_BY_IDENTIFIED_RESTRICTION', references, citedRestrictions.map((restriction) => restriction.trigger));
  }
  if (input.proposedUse === 'PUBLIC_WEBSITE_DISPLAY') {
    return result('BLOCKED_BY_OTHER_GOVERNANCE', 'NOT_BLOCKED_BY_PERMISSION_POSTURE', references, ['PUBLIC_DISPLAY_REQUIRES_SEPARATE_SOURCE_SPECIFIC_GATE']);
  }
  if (!input.sourceQualitySufficient) {
    return result('BLOCKED_BY_SOURCE_QUALITY', 'NOT_BLOCKED_BY_PERMISSION_POSTURE', references, ['SOURCE_QUALITY_INSUFFICIENT']);
  }
  if (input.proposedUse === 'HISTORICAL_COMPARISON' && !input.historicalEvidenceAvailable) {
    return result('BLOCKED_BY_MISSING_DATA', 'NOT_BLOCKED_BY_PERMISSION_POSTURE', references, ['HISTORICAL_EVIDENCE_NOT_AVAILABLE']);
  }
  if (!input.architectureReady) {
    return result('BLOCKED_BY_ARCHITECTURE', 'NOT_BLOCKED_BY_PERMISSION_POSTURE', references, ['SEPARATE_ARCHITECTURE_GATE_REQUIRED']);
  }
  if (uncitedRestrictionAssertion) {
    return result('NOT_BLOCKED_BY_PERMISSION_POSTURE', 'NOT_BLOCKED_BY_PERMISSION_POSTURE', references, ['RESTRICTION_EVIDENCE_NOT_IDENTIFIED']);
  }
  return result(
    isInternalProfessionalUse(input.proposedUse) ? 'NOT_BLOCKED_BY_PERMISSION_POSTURE' : 'READY_FOR_NEXT_GATE',
    'NOT_BLOCKED_BY_PERMISSION_POSTURE',
    references,
    ['PROCEED_WITH_GOVERNED_PROFESSIONAL_USE'],
  );
}

function result(
  decision: SourceGovernanceDecision,
  permissionPosture: RestrictionTriggeredSourceGovernanceResult['permissionPosture'],
  restrictionEvidenceReferences: readonly string[],
  reasons: readonly string[],
): RestrictionTriggeredSourceGovernanceResult {
  return Object.freeze({
    decision,
    permissionPosture,
    restrictionEvidenceReferences: Object.freeze([...restrictionEvidenceReferences]),
    reasons: Object.freeze([...reasons]),
    providerContactRequired: false,
    sourceActivityAuthorized: false,
    runtimeActivationAuthorized: false,
  });
}
