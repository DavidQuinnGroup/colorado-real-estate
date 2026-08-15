import {
  PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES,
  PUBLIC_SEARCH_ELIGIBILITY_DEACTIVATION_DESIGN,
  evaluatePublicSearchEligibilityActivationReadiness,
  type PublicSearchEligibilityActivationMode,
} from './publicSearchEligibilityRuntimeContract.js';
import type {
  PublicSearchEligibilityDiscoveryParityCertification,
  PublicSearchEligibilityDiscoveryParityClassification,
} from './publicSearchEligibilityDiscoveryParityCertification.js';

export const PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_OPERATIONS_READINESS_STATUS =
  'PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_OPERATIONS_READINESS';

export type PublicSearchEligibilityActivationOperationsClassification =
  | 'READY_FOR_CONTROLLED_ACTIVATION'
  | 'NOT_READY_FOR_ACTIVATION'
  | 'STOP_CONDITION_PRESENT'
  | 'INSUFFICIENT_EVIDENCE';

export type PublicSearchEligibilityActivationOperationsReason =
  | 'READY_ALL_OPERATIONAL_EVIDENCE_PRESENT'
  | 'PROVIDER_SNAPSHOT_INCOMPLETE'
  | 'TRANSITION_WRITES_NOT_EXECUTED_AS_AUTHORIZED'
  | 'DB_ELIGIBILITY_DISTRIBUTION_UNCERTIFIED'
  | 'NULL_POPULATION_UNRESOLVED'
  | 'DISCOVERY_PARITY_NOT_CERTIFIED'
  | 'SEARCH_READINESS_UNCERTIFIED'
  | 'TYPESENSE_REBUILD_READINESS_UNCERTIFIED'
  | 'DATABASE_FALLBACK_READINESS_UNCERTIFIED'
  | 'SAVED_SEARCH_READINESS_UNCERTIFIED'
  | 'ALERT_GATE_NOT_SEPARATELY_CLOSED'
  | 'ROLLBACK_READINESS_MISSING'
  | 'AUDIT_EVIDENCE_INCOMPLETE'
  | 'MATERIAL_DRIFT_PRESENT'
  | 'EXPLICIT_STOP_CONDITION_PRESENT'
  | 'PROTECTED_SYSTEM_PREREQUISITE_FAILURE'
  | 'INSUFFICIENT_PROVIDER_SNAPSHOT_EVIDENCE'
  | 'INSUFFICIENT_WRITE_EVIDENCE'
  | 'INSUFFICIENT_DB_DISTRIBUTION_EVIDENCE'
  | 'INSUFFICIENT_NULL_POPULATION_EVIDENCE'
  | 'INSUFFICIENT_DISCOVERY_PARITY_EVIDENCE'
  | 'INSUFFICIENT_SEARCH_EVIDENCE'
  | 'INSUFFICIENT_TYPESENSE_EVIDENCE'
  | 'INSUFFICIENT_FALLBACK_EVIDENCE'
  | 'INSUFFICIENT_SAVED_SEARCH_EVIDENCE'
  | 'INSUFFICIENT_ALERT_GATE_EVIDENCE'
  | 'INSUFFICIENT_ROLLBACK_EVIDENCE'
  | 'INSUFFICIENT_AUDIT_EVIDENCE'
  | 'STORED_ELIGIBILITY_STATE_DOES_NOT_AUTHORIZE_ACTIVATION'
  | 'RUNTIME_ACTIVATION_ATTEMPTED'
  | 'RUNTIME_DEACTIVATION_ATTEMPTED'
  | 'PROVIDER_CALL_ATTEMPTED'
  | 'DATABASE_WRITE_ATTEMPTED'
  | 'SEARCH_MUTATION_ATTEMPTED'
  | 'TYPESENSE_MUTATION_ATTEMPTED'
  | 'SAVED_SEARCH_MUTATION_ATTEMPTED'
  | 'ALERT_OR_EMAIL_ATTEMPTED'
  | 'DEPLOYMENT_ATTEMPTED';

export type PublicSearchEligibilityActivationDbDistributionEvidence = {
  nullCount: number;
  certifiedEligibleCount: number;
  publicScopeUnverifiedCount: number;
  certifiedIneligibleCount: number;
};

export type PublicSearchEligibilityRollbackEvidence = {
  legacyDeactivationAvailable: boolean | null;
  noEligibilityRowRewriteRequired: boolean | null;
  postRollbackSearchVerificationDefined: boolean | null;
  typesenseSearchConsistencyFollowUpDefined: boolean | null;
  incidentEvidenceCaptureDefined: boolean | null;
};

export type PublicSearchEligibilityActivationAuditEvidence = {
  canonicalCommitRecorded: boolean;
  planFingerprintRecorded: boolean;
  writeSetFingerprintRecorded: boolean;
  providerSnapshotFingerprintRecorded: boolean;
  dbDistributionRecorded: boolean;
  discoveryParityCertificationRecorded: boolean;
  activationModeBeforeAfterRecorded: boolean;
  stopThresholdsRecorded: boolean;
  rollbackReadinessRecorded: boolean;
  operatorAuthorizationRecorded: boolean;
  postActivationCertificationPlanRecorded: boolean;
};

export type PublicSearchEligibilityProtectedActionEvidence = {
  runtimeActivationAttempted: boolean;
  runtimeDeactivationAttempted: boolean;
  providerCallAttempted: boolean;
  databaseWriteAttempted: boolean;
  searchMutationAttempted: boolean;
  typesenseMutationAttempted: boolean;
  savedSearchMutationAttempted: boolean;
  alertOrEmailAttempted: boolean;
  deploymentAttempted: boolean;
};

export type PublicSearchEligibilityActivationOperationsReadinessInput = {
  canonicalCommit: string | null;
  activationModeBefore: PublicSearchEligibilityActivationMode | null;
  requestedActivationMode: PublicSearchEligibilityActivationMode | null;
  providerSnapshotCertifiedComplete: boolean | null;
  transitionWritesExecutedAsAuthorized: boolean | null;
  dbEligibilityDistributionCertified: boolean | null;
  dbDistribution: PublicSearchEligibilityActivationDbDistributionEvidence | null;
  expectedNullPopulationUnderstood: boolean | null;
  unresolvedMaterialDriftCount: number | null;
  discoveryParityCertification:
    | Pick<PublicSearchEligibilityDiscoveryParityCertification, 'classification' | 'reasons'>
    | { classification: PublicSearchEligibilityDiscoveryParityClassification; reasons: readonly string[] }
    | null;
  searchReadinessCertified: boolean | null;
  typesenseRebuildReadinessCertified: boolean | null;
  databaseFallbackReadinessCertified: boolean | null;
  savedSearchReadinessCertified: boolean | null;
  alertGateSeparatelyClosed: boolean | null;
  rollback: PublicSearchEligibilityRollbackEvidence | null;
  auditEvidence: PublicSearchEligibilityActivationAuditEvidence | null;
  storedEligibilityRowsPresent: boolean;
  activationAuthorizationSupplied: boolean;
  explicitStopConditionPresent: boolean;
  protectedSystemPrerequisiteFailure: boolean;
  protectedActions: PublicSearchEligibilityProtectedActionEvidence;
};

export type PublicSearchEligibilityActivationOperationsReadiness = {
  status: typeof PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_OPERATIONS_READINESS_STATUS;
  classification: PublicSearchEligibilityActivationOperationsClassification;
  reasons: readonly PublicSearchEligibilityActivationOperationsReason[];
  runtimeReadinessReasons: readonly string[];
  storedEligibilityState: {
    rowsPresent: boolean;
    authorizesActivation: false;
    separateExecutiveActivationAuthorizationRequired: true;
  };
  activationAuthority: {
    activationAuthorizationSupplied: boolean;
    readyForControlledActivation: boolean;
    requestedMode: PublicSearchEligibilityActivationMode | null;
    modeBefore: PublicSearchEligibilityActivationMode | null;
  };
  rollbackAndDeactivation: {
    deactivationMode: typeof PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.legacy;
    rewritesStoredEligibilityRows: false;
    deactivationRequiresRuntimeConfigChangeOnly: true;
    postRollbackSearchVerificationRequired: true;
    typesenseSearchConsistencyFollowUpRequired: true;
    incidentEvidenceCaptureRequired: true;
  };
  auditEvidenceRequired: readonly (keyof PublicSearchEligibilityActivationAuditEvidence)[];
  stopThresholds: {
    unresolvedMaterialDriftTolerance: 0;
    discoveryParityDivergenceTolerance: 0;
    missingAuditEvidenceTolerance: 0;
    protectedSystemActionTolerance: 0;
  };
  zeroSideEffects: {
    providerCallsPerformed: false;
    databaseWritesPerformed: false;
    runtimeActivationPerformed: false;
    runtimeDeactivationPerformed: false;
    searchMutationPerformed: false;
    typesenseMutationPerformed: false;
    savedSearchMutationPerformed: false;
    alertOrEmailPerformed: false;
    deploymentPerformed: false;
  };
};

export const PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_AUDIT_EVIDENCE_FIELDS = [
  'canonicalCommitRecorded',
  'planFingerprintRecorded',
  'writeSetFingerprintRecorded',
  'providerSnapshotFingerprintRecorded',
  'dbDistributionRecorded',
  'discoveryParityCertificationRecorded',
  'activationModeBeforeAfterRecorded',
  'stopThresholdsRecorded',
  'rollbackReadinessRecorded',
  'operatorAuthorizationRecorded',
  'postActivationCertificationPlanRecorded',
] as const satisfies readonly (keyof PublicSearchEligibilityActivationAuditEvidence)[];

function isMissing(value: boolean | number | string | object | null | undefined) {
  return value === null || value === undefined;
}

function allAuditEvidencePresent(evidence: PublicSearchEligibilityActivationAuditEvidence | null) {
  return Boolean(evidence && PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_AUDIT_EVIDENCE_FIELDS.every((field) => evidence[field]));
}

function rollbackReady(evidence: PublicSearchEligibilityRollbackEvidence | null) {
  return Boolean(
    evidence &&
      evidence.legacyDeactivationAvailable === true &&
      evidence.noEligibilityRowRewriteRequired === true &&
      evidence.postRollbackSearchVerificationDefined === true &&
      evidence.typesenseSearchConsistencyFollowUpDefined === true &&
      evidence.incidentEvidenceCaptureDefined === true,
  );
}

function rollbackEvidenceMissing(evidence: PublicSearchEligibilityRollbackEvidence | null) {
  return (
    !evidence ||
    isMissing(evidence.legacyDeactivationAvailable) ||
    isMissing(evidence.noEligibilityRowRewriteRequired) ||
    isMissing(evidence.postRollbackSearchVerificationDefined) ||
    isMissing(evidence.typesenseSearchConsistencyFollowUpDefined) ||
    isMissing(evidence.incidentEvidenceCaptureDefined)
  );
}

function addMissingEvidenceReasons(
  input: PublicSearchEligibilityActivationOperationsReadinessInput,
  reasons: PublicSearchEligibilityActivationOperationsReason[],
) {
  if (isMissing(input.providerSnapshotCertifiedComplete)) reasons.push('INSUFFICIENT_PROVIDER_SNAPSHOT_EVIDENCE');
  if (isMissing(input.transitionWritesExecutedAsAuthorized)) reasons.push('INSUFFICIENT_WRITE_EVIDENCE');
  if (isMissing(input.dbEligibilityDistributionCertified) || !input.dbDistribution) reasons.push('INSUFFICIENT_DB_DISTRIBUTION_EVIDENCE');
  if (isMissing(input.expectedNullPopulationUnderstood)) reasons.push('INSUFFICIENT_NULL_POPULATION_EVIDENCE');
  if (!input.discoveryParityCertification) reasons.push('INSUFFICIENT_DISCOVERY_PARITY_EVIDENCE');
  if (isMissing(input.searchReadinessCertified)) reasons.push('INSUFFICIENT_SEARCH_EVIDENCE');
  if (isMissing(input.typesenseRebuildReadinessCertified)) reasons.push('INSUFFICIENT_TYPESENSE_EVIDENCE');
  if (isMissing(input.databaseFallbackReadinessCertified)) reasons.push('INSUFFICIENT_FALLBACK_EVIDENCE');
  if (isMissing(input.savedSearchReadinessCertified)) reasons.push('INSUFFICIENT_SAVED_SEARCH_EVIDENCE');
  if (isMissing(input.alertGateSeparatelyClosed)) reasons.push('INSUFFICIENT_ALERT_GATE_EVIDENCE');
  if (rollbackEvidenceMissing(input.rollback)) reasons.push('INSUFFICIENT_ROLLBACK_EVIDENCE');
  if (!input.auditEvidence) reasons.push('INSUFFICIENT_AUDIT_EVIDENCE');
}

function addProtectedActionReasons(
  input: PublicSearchEligibilityActivationOperationsReadinessInput,
  reasons: PublicSearchEligibilityActivationOperationsReason[],
) {
  if (input.protectedActions.runtimeActivationAttempted) reasons.push('RUNTIME_ACTIVATION_ATTEMPTED');
  if (input.protectedActions.runtimeDeactivationAttempted) reasons.push('RUNTIME_DEACTIVATION_ATTEMPTED');
  if (input.protectedActions.providerCallAttempted) reasons.push('PROVIDER_CALL_ATTEMPTED');
  if (input.protectedActions.databaseWriteAttempted) reasons.push('DATABASE_WRITE_ATTEMPTED');
  if (input.protectedActions.searchMutationAttempted) reasons.push('SEARCH_MUTATION_ATTEMPTED');
  if (input.protectedActions.typesenseMutationAttempted) reasons.push('TYPESENSE_MUTATION_ATTEMPTED');
  if (input.protectedActions.savedSearchMutationAttempted) reasons.push('SAVED_SEARCH_MUTATION_ATTEMPTED');
  if (input.protectedActions.alertOrEmailAttempted) reasons.push('ALERT_OR_EMAIL_ATTEMPTED');
  if (input.protectedActions.deploymentAttempted) reasons.push('DEPLOYMENT_ATTEMPTED');
}

function addNotReadyReasons(
  input: PublicSearchEligibilityActivationOperationsReadinessInput,
  reasons: PublicSearchEligibilityActivationOperationsReason[],
) {
  if (input.providerSnapshotCertifiedComplete === false) reasons.push('PROVIDER_SNAPSHOT_INCOMPLETE');
  if (input.transitionWritesExecutedAsAuthorized === false) reasons.push('TRANSITION_WRITES_NOT_EXECUTED_AS_AUTHORIZED');
  if (input.dbEligibilityDistributionCertified === false) reasons.push('DB_ELIGIBILITY_DISTRIBUTION_UNCERTIFIED');
  if (input.expectedNullPopulationUnderstood === false) reasons.push('NULL_POPULATION_UNRESOLVED');
  if (input.discoveryParityCertification && input.discoveryParityCertification.classification !== 'PARITY') reasons.push('DISCOVERY_PARITY_NOT_CERTIFIED');
  if (input.searchReadinessCertified === false) reasons.push('SEARCH_READINESS_UNCERTIFIED');
  if (input.typesenseRebuildReadinessCertified === false) reasons.push('TYPESENSE_REBUILD_READINESS_UNCERTIFIED');
  if (input.databaseFallbackReadinessCertified === false) reasons.push('DATABASE_FALLBACK_READINESS_UNCERTIFIED');
  if (input.savedSearchReadinessCertified === false) reasons.push('SAVED_SEARCH_READINESS_UNCERTIFIED');
  if (input.alertGateSeparatelyClosed === false) reasons.push('ALERT_GATE_NOT_SEPARATELY_CLOSED');
  if (input.rollback && !rollbackReady(input.rollback)) reasons.push('ROLLBACK_READINESS_MISSING');
  if (input.auditEvidence && !allAuditEvidencePresent(input.auditEvidence)) reasons.push('AUDIT_EVIDENCE_INCOMPLETE');
  if ((input.unresolvedMaterialDriftCount ?? 0) > 0) reasons.push('MATERIAL_DRIFT_PRESENT');
}

function hasStopReason(reasons: readonly PublicSearchEligibilityActivationOperationsReason[]) {
  return reasons.some((reason) =>
    [
      'EXPLICIT_STOP_CONDITION_PRESENT',
      'PROTECTED_SYSTEM_PREREQUISITE_FAILURE',
      'DISCOVERY_PARITY_NOT_CERTIFIED',
      'SEARCH_READINESS_UNCERTIFIED',
      'TYPESENSE_REBUILD_READINESS_UNCERTIFIED',
      'DATABASE_FALLBACK_READINESS_UNCERTIFIED',
      'SAVED_SEARCH_READINESS_UNCERTIFIED',
      'MATERIAL_DRIFT_PRESENT',
      'RUNTIME_ACTIVATION_ATTEMPTED',
      'RUNTIME_DEACTIVATION_ATTEMPTED',
      'PROVIDER_CALL_ATTEMPTED',
      'DATABASE_WRITE_ATTEMPTED',
      'SEARCH_MUTATION_ATTEMPTED',
      'TYPESENSE_MUTATION_ATTEMPTED',
      'SAVED_SEARCH_MUTATION_ATTEMPTED',
      'ALERT_OR_EMAIL_ATTEMPTED',
      'DEPLOYMENT_ATTEMPTED',
    ].includes(reason),
  );
}

function hasInsufficientEvidenceReason(reasons: readonly PublicSearchEligibilityActivationOperationsReason[]) {
  return reasons.some((reason) => reason.startsWith('INSUFFICIENT_'));
}

export function evaluatePublicSearchEligibilityActivationOperationsReadiness(
  input: PublicSearchEligibilityActivationOperationsReadinessInput,
): PublicSearchEligibilityActivationOperationsReadiness {
  const reasons: PublicSearchEligibilityActivationOperationsReason[] = [];
  addMissingEvidenceReasons(input, reasons);
  addNotReadyReasons(input, reasons);
  addProtectedActionReasons(input, reasons);

  if (input.explicitStopConditionPresent) reasons.push('EXPLICIT_STOP_CONDITION_PRESENT');
  if (input.protectedSystemPrerequisiteFailure) reasons.push('PROTECTED_SYSTEM_PREREQUISITE_FAILURE');
  if (input.storedEligibilityRowsPresent && !input.activationAuthorizationSupplied) {
    reasons.push('STORED_ELIGIBILITY_STATE_DOES_NOT_AUTHORIZE_ACTIVATION');
  }

  const runtimeReadiness = evaluatePublicSearchEligibilityActivationReadiness({
    absentRowsReconciledOrAcceptedFailClosed: input.transitionWritesExecutedAsAuthorized === true,
    alertBehaviorSeparatelyGated: input.alertGateSeparatelyClosed === true,
    dbDistribution: input.dbDistribution ?? {
      certifiedEligibleCount: 0,
      certifiedIneligibleCount: 0,
      nullCount: 1,
      publicScopeUnverifiedCount: 0,
    },
    dbEligibilityDistributionCertified: input.dbEligibilityDistributionCertified === true,
    expectedNullPopulationUnderstood: input.expectedNullPopulationUnderstood === true,
    providerSnapshotCertifiedComplete: input.providerSnapshotCertifiedComplete === true,
    savedSearchBehaviorReady: input.savedSearchReadinessCertified === true,
    searchIndexActivationPlanCertified:
      input.searchReadinessCertified === true &&
      input.databaseFallbackReadinessCertified === true &&
      input.discoveryParityCertification?.classification === 'PARITY',
    transitionWritesExecuted: input.transitionWritesExecutedAsAuthorized === true,
    typesenseRebuildReady: input.typesenseRebuildReadinessCertified === true,
    unresolvedStateDriftFailures: input.unresolvedMaterialDriftCount ?? 1,
  });

  const uniqueReasons = [...new Set(reasons)];
  const classification: PublicSearchEligibilityActivationOperationsClassification = hasStopReason(uniqueReasons)
    ? 'STOP_CONDITION_PRESENT'
    : hasInsufficientEvidenceReason(uniqueReasons)
      ? 'INSUFFICIENT_EVIDENCE'
      : uniqueReasons.length > 0 || runtimeReadiness.status !== 'READY_TO_ACTIVATE_CERTIFIED_ELIGIBILITY'
        ? 'NOT_READY_FOR_ACTIVATION'
        : 'READY_FOR_CONTROLLED_ACTIVATION';

  const readyForControlledActivation =
    classification === 'READY_FOR_CONTROLLED_ACTIVATION' &&
    input.activationAuthorizationSupplied &&
    input.requestedActivationMode === PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.certifiedEligibility &&
    input.activationModeBefore === PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.legacy;

  return Object.freeze({
    status: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_OPERATIONS_READINESS_STATUS,
    classification,
    reasons: Object.freeze(
      uniqueReasons.length > 0
        ? uniqueReasons
        : (['READY_ALL_OPERATIONAL_EVIDENCE_PRESENT'] satisfies PublicSearchEligibilityActivationOperationsReason[]),
    ),
    runtimeReadinessReasons: Object.freeze(runtimeReadiness.reasons),
    storedEligibilityState: {
      rowsPresent: input.storedEligibilityRowsPresent,
      authorizesActivation: false as const,
      separateExecutiveActivationAuthorizationRequired: true as const,
    },
    activationAuthority: {
      activationAuthorizationSupplied: input.activationAuthorizationSupplied,
      readyForControlledActivation,
      requestedMode: input.requestedActivationMode,
      modeBefore: input.activationModeBefore,
    },
    rollbackAndDeactivation: {
      deactivationMode: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.legacy,
      rewritesStoredEligibilityRows: false as const,
      deactivationRequiresRuntimeConfigChangeOnly:
        PUBLIC_SEARCH_ELIGIBILITY_DEACTIVATION_DESIGN.rollbackToLegacyModeWithoutRewritingEligibilityRows,
      postRollbackSearchVerificationRequired: true as const,
      typesenseSearchConsistencyFollowUpRequired: true as const,
      incidentEvidenceCaptureRequired: true as const,
    },
    auditEvidenceRequired: PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_AUDIT_EVIDENCE_FIELDS,
    stopThresholds: {
      unresolvedMaterialDriftTolerance: 0 as const,
      discoveryParityDivergenceTolerance: 0 as const,
      missingAuditEvidenceTolerance: 0 as const,
      protectedSystemActionTolerance: 0 as const,
    },
    zeroSideEffects: {
      providerCallsPerformed: false as const,
      databaseWritesPerformed: false as const,
      runtimeActivationPerformed: false as const,
      runtimeDeactivationPerformed: false as const,
      searchMutationPerformed: false as const,
      typesenseMutationPerformed: false as const,
      savedSearchMutationPerformed: false as const,
      alertOrEmailPerformed: false as const,
      deploymentPerformed: false as const,
    },
  });
}
