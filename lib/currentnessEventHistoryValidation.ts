export const CURRENTNESS_EVENT_TARGET_KINDS = [
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

export type CurrentnessEventTargetKind = (typeof CURRENTNESS_EVENT_TARGET_KINDS)[number];

export type CurrentnessEventTarget = Readonly<{
  kind: CurrentnessEventTargetKind;
  id: string;
}>;

export type CurrentnessEventDependencySelection = Readonly<{
  roleRef: string;
  ordinal: number;
  target: CurrentnessEventTarget;
}>;

export type CurrentnessEventLineage = Readonly<{
  predecessorEventId: string | null;
  correctionOfEventId: string | null;
  causalEventId: string | null;
}>;

export type CurrentnessEventValidationInput = Readonly<{
  eventId: string;
  eventTypeVersionId: string;
  primarySubjects: readonly CurrentnessEventTarget[];
  dependencies: readonly CurrentnessEventDependencySelection[];
  lineage: CurrentnessEventLineage;
}>;

export type CurrentnessEventValidationFailure =
  | 'EVENT_ID_REQUIRED'
  | 'EVENT_TYPE_VERSION_REQUIRED'
  | 'EXACTLY_ONE_PRIMARY_SUBJECT_REQUIRED'
  | 'PRIMARY_SUBJECT_ID_REQUIRED'
  | 'DEPENDENCY_ROLE_REQUIRED'
  | 'DEPENDENCY_ORDINAL_INVALID'
  | 'DEPENDENCY_TARGET_ID_REQUIRED'
  | 'DUPLICATE_DEPENDENCY_TARGET'
  | 'DUPLICATE_DEPENDENCY_ORDINAL'
  | 'LINEAGE_REFERENCE_INVALID'
  | 'LINEAGE_SELF_REFERENCE'
  | 'LINEAGE_ROLE_CONFLICT';

export type CurrentnessEventValidationResult = Readonly<{
  valid: boolean;
  failure: CurrentnessEventValidationFailure | null;
}>;

export type CurrentnessEventLineageRecord = Readonly<{
  id: string;
  predecessorEventId: string | null;
  correctionOfEventId: string | null;
  causalEventId: string | null;
}>;

function exactIdentifier(value: string): boolean {
  const trimmed = value.trim();
  const normalized = trimmed.toLowerCase();
  return value === trimmed && trimmed.length > 0 && normalized !== 'latest' && normalized !== 'current';
}

export function validateCurrentnessEvent(
  input: CurrentnessEventValidationInput,
): CurrentnessEventValidationResult {
  if (!exactIdentifier(input.eventId)) {
    return Object.freeze({ valid: false, failure: 'EVENT_ID_REQUIRED' });
  }
  if (!exactIdentifier(input.eventTypeVersionId)) {
    return Object.freeze({ valid: false, failure: 'EVENT_TYPE_VERSION_REQUIRED' });
  }
  if (input.primarySubjects.length !== 1) {
    return Object.freeze({ valid: false, failure: 'EXACTLY_ONE_PRIMARY_SUBJECT_REQUIRED' });
  }
  if (!exactIdentifier(input.primarySubjects[0].id)) {
    return Object.freeze({ valid: false, failure: 'PRIMARY_SUBJECT_ID_REQUIRED' });
  }

  const targetKeys = new Set<string>();
  const ordinalKeys = new Set<string>();
  for (const dependency of input.dependencies) {
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

  const lineageIds = [
    input.lineage.predecessorEventId,
    input.lineage.correctionOfEventId,
    input.lineage.causalEventId,
  ].filter((value): value is string => value !== null);
  if (lineageIds.some((value) => !exactIdentifier(value))) {
    return Object.freeze({ valid: false, failure: 'LINEAGE_REFERENCE_INVALID' });
  }
  if (lineageIds.includes(input.eventId)) {
    return Object.freeze({ valid: false, failure: 'LINEAGE_SELF_REFERENCE' });
  }
  if (input.lineage.predecessorEventId !== null && input.lineage.correctionOfEventId !== null) {
    return Object.freeze({ valid: false, failure: 'LINEAGE_ROLE_CONFLICT' });
  }

  return Object.freeze({ valid: true, failure: null });
}

export function hasCurrentnessEventLineageCycle(
  records: readonly CurrentnessEventLineageRecord[],
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
    const nextIds = [record.predecessorEventId, record.correctionOfEventId, record.causalEventId]
      .filter((value): value is string => value !== null);
    if (nextIds.some(visit)) return true;
    visiting.delete(id);
    visited.add(id);
    return false;
  };

  return records.some((record) => visit(record.id));
}
