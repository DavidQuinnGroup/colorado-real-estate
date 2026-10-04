export const CURRENTNESS_PROJECTION_TARGET_KINDS = [
  'CANONICAL_METHOD_VERSION',
  'CANONICAL_RESULT_VERSION',
  'BASELINE_REFERENCE_VERSION',
  'REPORTING_PERIOD_REFERENCE_VERSION',
  'ANALYTICAL_BASIS_REFERENCE_VERSION',
  'PERIOD_BASIS_COMPATIBILITY_RESULT_CONTEXT',
  'QUALIFICATION_APPLICATION_VERSION',
  'OUTPUT_SEMANTIC_COMPOSITION_SNAPSHOT',
  'OUTPUT_EVIDENCE_SNAPSHOT',
  'EVIDENCE_ADMISSION',
  'PRODUCT_DEFINITION_REFERENCE',
] as const;

export type CurrentnessProjectionTargetKind = (typeof CURRENTNESS_PROJECTION_TARGET_KINDS)[number];

export type CurrentnessProjectionTarget = Readonly<{
  kind: CurrentnessProjectionTargetKind;
  id: string;
}>;

export type CurrentnessProjectionReferenceValidationInput = Readonly<{
  projectionKey: string;
  policyReferenceId: string;
  purposeRef: string | null;
  authorityRef: string;
  primarySubjects: readonly CurrentnessProjectionTarget[];
}>;

export type CurrentnessProjectionDependencySelection = Readonly<{
  roleRef: string;
  ordinal: number;
  target: CurrentnessProjectionTarget;
}>;

export type CurrentnessProjectionVersionLineage = Readonly<{
  supersedesProjectionVersionId: string | null;
  correctionOfProjectionVersionId: string | null;
}>;

export type CurrentnessProjectionVersionValidationInput = Readonly<{
  projectionVersionId: string;
  projectionReferenceId: string;
  versionKey: string;
  lifecycleState: string;
  policyVersionId: string;
  projectedStateAuthorityRef: string;
  projectedStateKey: string;
  projectedStateVersionRef: string;
  projectedStateGoverningSourceRef: string | null;
  projectedStateIntegrityFingerprint: string;
  evaluatedAt: string;
  evaluationCutoffAt: string | null;
  recordedThroughAt: string;
  projectedAt: string;
  eventManifestCount: number;
  eventManifestFingerprint: string;
  authorityRef: string;
  formalizedAt: string | null;
  admittedAt: string | null;
  dependencies: readonly CurrentnessProjectionDependencySelection[];
  eventIds: readonly string[];
  lineage: CurrentnessProjectionVersionLineage;
}>;

export type CurrentnessProjectionVersionLineageRecord = Readonly<{
  id: string;
  supersedesProjectionVersionId: string | null;
  correctionOfProjectionVersionId: string | null;
}>;

export type CurrentnessProjectionValidationFailure =
  | 'PROJECTION_KEY_REQUIRED'
  | 'POLICY_REFERENCE_REQUIRED'
  | 'PURPOSE_REFERENCE_INVALID'
  | 'AUTHORITY_REFERENCE_REQUIRED'
  | 'EXACTLY_ONE_PRIMARY_SUBJECT_REQUIRED'
  | 'PRIMARY_SUBJECT_ID_REQUIRED'
  | 'PROJECTION_VERSION_ID_REQUIRED'
  | 'PROJECTION_REFERENCE_ID_REQUIRED'
  | 'VERSION_KEY_REQUIRED'
  | 'POLICY_VERSION_REQUIRED'
  | 'PROJECTED_STATE_AUTHORITY_REQUIRED'
  | 'PROJECTED_STATE_KEY_REQUIRED'
  | 'PROJECTED_STATE_VERSION_REQUIRED'
  | 'PROJECTED_STATE_GOVERNING_SOURCE_INVALID'
  | 'PROJECTED_STATE_FINGERPRINT_REQUIRED'
  | 'TEMPORAL_METADATA_INVALID'
  | 'CANDIDATE_FINALITY_INVALID'
  | 'ADMITTED_FINALITY_REQUIRED'
  | 'LIFECYCLE_STATE_INVALID'
  | 'DEPENDENCY_ROLE_REQUIRED'
  | 'DEPENDENCY_ORDINAL_INVALID'
  | 'DEPENDENCY_TARGET_ID_REQUIRED'
  | 'DUPLICATE_DEPENDENCY_TARGET'
  | 'DUPLICATE_DEPENDENCY_ORDINAL'
  | 'EVENT_ID_REQUIRED'
  | 'DUPLICATE_EVENT_MEMBERSHIP'
  | 'EVENT_MANIFEST_COUNT_INVALID'
  | 'EVENT_MANIFEST_COUNT_MISMATCH'
  | 'EVENT_MANIFEST_FINGERPRINT_REQUIRED'
  | 'LINEAGE_REFERENCE_INVALID'
  | 'LINEAGE_SELF_REFERENCE'
  | 'LINEAGE_ROLE_CONFLICT';

export type CurrentnessProjectionValidationResult = Readonly<{
  valid: boolean;
  failure: CurrentnessProjectionValidationFailure | null;
}>;

const ADMITTED_LIFECYCLE_STATES = new Set([
  'ADMITTED',
  'ADMITTED_WITH_QUALIFICATIONS',
]);

function exactIdentifier(value: string): boolean {
  const trimmed = value.trim();
  const normalized = trimmed.toLowerCase();
  return value === trimmed && trimmed.length > 0 && normalized !== 'latest' && normalized !== 'current';
}

function validTimestamp(value: string): boolean {
  return value.trim().length > 0 && Number.isFinite(Date.parse(value));
}

export function validateCurrentnessProjectionReference(
  input: CurrentnessProjectionReferenceValidationInput,
): CurrentnessProjectionValidationResult {
  if (!exactIdentifier(input.projectionKey)) {
    return Object.freeze({ valid: false, failure: 'PROJECTION_KEY_REQUIRED' });
  }
  if (!exactIdentifier(input.policyReferenceId)) {
    return Object.freeze({ valid: false, failure: 'POLICY_REFERENCE_REQUIRED' });
  }
  if (input.purposeRef !== null && !exactIdentifier(input.purposeRef)) {
    return Object.freeze({ valid: false, failure: 'PURPOSE_REFERENCE_INVALID' });
  }
  if (!exactIdentifier(input.authorityRef)) {
    return Object.freeze({ valid: false, failure: 'AUTHORITY_REFERENCE_REQUIRED' });
  }
  if (input.primarySubjects.length !== 1) {
    return Object.freeze({ valid: false, failure: 'EXACTLY_ONE_PRIMARY_SUBJECT_REQUIRED' });
  }
  if (!exactIdentifier(input.primarySubjects[0].id)) {
    return Object.freeze({ valid: false, failure: 'PRIMARY_SUBJECT_ID_REQUIRED' });
  }
  return Object.freeze({ valid: true, failure: null });
}

export function validateCurrentnessProjectionVersion(
  input: CurrentnessProjectionVersionValidationInput,
): CurrentnessProjectionValidationResult {
  if (!exactIdentifier(input.projectionVersionId)) {
    return Object.freeze({ valid: false, failure: 'PROJECTION_VERSION_ID_REQUIRED' });
  }
  if (!exactIdentifier(input.projectionReferenceId)) {
    return Object.freeze({ valid: false, failure: 'PROJECTION_REFERENCE_ID_REQUIRED' });
  }
  if (!exactIdentifier(input.versionKey)) {
    return Object.freeze({ valid: false, failure: 'VERSION_KEY_REQUIRED' });
  }
  if (!exactIdentifier(input.policyVersionId)) {
    return Object.freeze({ valid: false, failure: 'POLICY_VERSION_REQUIRED' });
  }
  if (!exactIdentifier(input.projectedStateAuthorityRef)) {
    return Object.freeze({ valid: false, failure: 'PROJECTED_STATE_AUTHORITY_REQUIRED' });
  }
  if (!exactIdentifier(input.projectedStateKey)) {
    return Object.freeze({ valid: false, failure: 'PROJECTED_STATE_KEY_REQUIRED' });
  }
  if (!exactIdentifier(input.projectedStateVersionRef)) {
    return Object.freeze({ valid: false, failure: 'PROJECTED_STATE_VERSION_REQUIRED' });
  }
  if (
    input.projectedStateGoverningSourceRef !== null
    && !exactIdentifier(input.projectedStateGoverningSourceRef)
  ) {
    return Object.freeze({ valid: false, failure: 'PROJECTED_STATE_GOVERNING_SOURCE_INVALID' });
  }
  if (input.projectedStateIntegrityFingerprint.trim().length === 0) {
    return Object.freeze({ valid: false, failure: 'PROJECTED_STATE_FINGERPRINT_REQUIRED' });
  }
  if (!exactIdentifier(input.authorityRef)) {
    return Object.freeze({ valid: false, failure: 'AUTHORITY_REFERENCE_REQUIRED' });
  }

  const requiredTimestamps = [input.evaluatedAt, input.recordedThroughAt, input.projectedAt];
  if (
    requiredTimestamps.some((value) => !validTimestamp(value))
    || (input.evaluationCutoffAt !== null && !validTimestamp(input.evaluationCutoffAt))
    || Date.parse(input.evaluatedAt) > Date.parse(input.projectedAt)
    || Date.parse(input.recordedThroughAt) > Date.parse(input.projectedAt)
    || (
      input.evaluationCutoffAt !== null
      && Date.parse(input.evaluationCutoffAt) > Date.parse(input.evaluatedAt)
    )
  ) {
    return Object.freeze({ valid: false, failure: 'TEMPORAL_METADATA_INVALID' });
  }

  if (input.lifecycleState === 'CANDIDATE') {
    if (input.formalizedAt !== null || input.admittedAt !== null) {
      return Object.freeze({ valid: false, failure: 'CANDIDATE_FINALITY_INVALID' });
    }
  } else if (ADMITTED_LIFECYCLE_STATES.has(input.lifecycleState)) {
    if (
      input.formalizedAt === null
      || input.admittedAt === null
      || !validTimestamp(input.formalizedAt)
      || !validTimestamp(input.admittedAt)
    ) {
      return Object.freeze({ valid: false, failure: 'ADMITTED_FINALITY_REQUIRED' });
    }
  } else {
    return Object.freeze({ valid: false, failure: 'LIFECYCLE_STATE_INVALID' });
  }

  const dependencyResult = validateCurrentnessProjectionDependencies(input.dependencies);
  if (!dependencyResult.valid) return dependencyResult;

  const manifestResult = validateCurrentnessProjectionEventManifest(
    input.eventIds,
    input.eventManifestCount,
    input.eventManifestFingerprint,
  );
  if (!manifestResult.valid) return manifestResult;

  const lineageIds = [
    input.lineage.supersedesProjectionVersionId,
    input.lineage.correctionOfProjectionVersionId,
  ].filter((value): value is string => value !== null);
  if (lineageIds.some((value) => !exactIdentifier(value))) {
    return Object.freeze({ valid: false, failure: 'LINEAGE_REFERENCE_INVALID' });
  }
  if (lineageIds.includes(input.projectionVersionId)) {
    return Object.freeze({ valid: false, failure: 'LINEAGE_SELF_REFERENCE' });
  }
  if (
    input.lineage.supersedesProjectionVersionId !== null
    && input.lineage.correctionOfProjectionVersionId !== null
  ) {
    return Object.freeze({ valid: false, failure: 'LINEAGE_ROLE_CONFLICT' });
  }

  return Object.freeze({ valid: true, failure: null });
}

export function validateCurrentnessProjectionDependencies(
  dependencies: readonly CurrentnessProjectionDependencySelection[],
): CurrentnessProjectionValidationResult {
  const targetKeys = new Set<string>();
  const ordinalKeys = new Set<string>();

  for (const dependency of dependencies) {
    if (!exactIdentifier(dependency.roleRef)) {
      return Object.freeze({ valid: false, failure: 'DEPENDENCY_ROLE_REQUIRED' });
    }
    if (!Number.isInteger(dependency.ordinal) || dependency.ordinal < 0) {
      return Object.freeze({ valid: false, failure: 'DEPENDENCY_ORDINAL_INVALID' });
    }
    if (!exactIdentifier(dependency.target.id)) {
      return Object.freeze({ valid: false, failure: 'DEPENDENCY_TARGET_ID_REQUIRED' });
    }

    const targetKey = `${dependency.roleRef}\u0000${dependency.target.kind}\u0000${dependency.target.id}`;
    if (targetKeys.has(targetKey)) {
      return Object.freeze({ valid: false, failure: 'DUPLICATE_DEPENDENCY_TARGET' });
    }
    targetKeys.add(targetKey);

    const ordinalKey = `${dependency.roleRef}\u0000${dependency.ordinal}`;
    if (ordinalKeys.has(ordinalKey)) {
      return Object.freeze({ valid: false, failure: 'DUPLICATE_DEPENDENCY_ORDINAL' });
    }
    ordinalKeys.add(ordinalKey);
  }

  return Object.freeze({ valid: true, failure: null });
}

export function validateCurrentnessProjectionEventManifest(
  eventIds: readonly string[],
  declaredCount: number,
  manifestFingerprint: string,
): CurrentnessProjectionValidationResult {
  if (!Number.isInteger(declaredCount) || declaredCount < 0) {
    return Object.freeze({ valid: false, failure: 'EVENT_MANIFEST_COUNT_INVALID' });
  }
  if (manifestFingerprint.trim().length === 0) {
    return Object.freeze({ valid: false, failure: 'EVENT_MANIFEST_FINGERPRINT_REQUIRED' });
  }
  if (eventIds.some((eventId) => !exactIdentifier(eventId))) {
    return Object.freeze({ valid: false, failure: 'EVENT_ID_REQUIRED' });
  }
  if (new Set(eventIds).size !== eventIds.length) {
    return Object.freeze({ valid: false, failure: 'DUPLICATE_EVENT_MEMBERSHIP' });
  }
  if (eventIds.length !== declaredCount) {
    return Object.freeze({ valid: false, failure: 'EVENT_MANIFEST_COUNT_MISMATCH' });
  }
  return Object.freeze({ valid: true, failure: null });
}

export function hasCurrentnessProjectionVersionLineageCycle(
  records: readonly CurrentnessProjectionVersionLineageRecord[],
): boolean {
  const byId = new Map(records.map((record) => [record.id, record]));
  const visited = new Set<string>();
  const visiting = new Set<string>();

  const visit = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    const record = byId.get(id);
    if (!record) return false;

    visiting.add(id);
    const nextIds = [
      record.supersedesProjectionVersionId,
      record.correctionOfProjectionVersionId,
    ].filter((value): value is string => value !== null);
    if (nextIds.some(visit)) return true;
    visiting.delete(id);
    visited.add(id);
    return false;
  };

  return records.some((record) => visit(record.id));
}
