export const QUALIFICATION_APPLICATION_SCOPES = [
  'RESULT',
  'METHOD',
  'BASELINE',
  'REPORTING_PERIOD',
  'ANALYTICAL_BASIS',
  'COMPATIBILITY_CONTEXT',
  'OUTPUT_SNAPSHOT',
  'PRODUCT_DEFINITION',
  'EVIDENCE',
] as const;

export const QUALIFICATION_SUBJECT_KINDS = [
  'RESULT_VERSION',
  'METHOD_VERSION',
  'BASELINE_REFERENCE_VERSION',
  'REPORTING_PERIOD_REFERENCE_VERSION',
  'ANALYTICAL_BASIS_REFERENCE_VERSION',
  'PERIOD_BASIS_COMPATIBILITY_CONTEXT',
  'OUTPUT_SEMANTIC_COMPOSITION_SNAPSHOT',
  'PRODUCT_DEFINITION_REFERENCE',
  'OUTPUT_EVIDENCE_SNAPSHOT',
  'EVIDENCE_ADMISSION',
] as const;

export type QualificationApplicationScope = (typeof QUALIFICATION_APPLICATION_SCOPES)[number];
export type QualificationSubjectKind = (typeof QUALIFICATION_SUBJECT_KINDS)[number];

export type QualificationEffectEnvelope = Readonly<{
  effectAuthorityRef: string | null;
  blocksFormalization: boolean | null;
  blocksDelivery: boolean | null;
  requiresReview: boolean | null;
  requiresDisplay: boolean | null;
  informationalOnly: boolean | null;
}>;

export type QualificationSubjectSelection = Readonly<{
  kind: QualificationSubjectKind;
  id: string;
}>;

export type QualificationApplicationValidationInput = Readonly<{
  definitionVersionId: string;
  scope: QualificationApplicationScope;
  subjects: readonly QualificationSubjectSelection[];
  effects: QualificationEffectEnvelope;
}>;

export type QualificationApplicationValidationFailure =
  | 'DEFINITION_VERSION_REQUIRED'
  | 'EXACTLY_ONE_SUBJECT_REQUIRED'
  | 'SUBJECT_ID_REQUIRED'
  | 'LATEST_OR_CURRENT_REFERENCE_FORBIDDEN'
  | 'SUBJECT_SCOPE_MISMATCH'
  | 'EFFECT_AUTHORITY_REQUIRED';

export type QualificationApplicationValidationResult = Readonly<{
  valid: boolean;
  failure: QualificationApplicationValidationFailure | null;
}>;

const SUBJECT_SCOPE: Readonly<Record<QualificationSubjectKind, QualificationApplicationScope>> = Object.freeze({
  RESULT_VERSION: 'RESULT',
  METHOD_VERSION: 'METHOD',
  BASELINE_REFERENCE_VERSION: 'BASELINE',
  REPORTING_PERIOD_REFERENCE_VERSION: 'REPORTING_PERIOD',
  ANALYTICAL_BASIS_REFERENCE_VERSION: 'ANALYTICAL_BASIS',
  PERIOD_BASIS_COMPATIBILITY_CONTEXT: 'COMPATIBILITY_CONTEXT',
  OUTPUT_SEMANTIC_COMPOSITION_SNAPSHOT: 'OUTPUT_SNAPSHOT',
  PRODUCT_DEFINITION_REFERENCE: 'PRODUCT_DEFINITION',
  OUTPUT_EVIDENCE_SNAPSHOT: 'EVIDENCE',
  EVIDENCE_ADMISSION: 'EVIDENCE',
});

function exactIdentifier(value: string): boolean {
  const trimmed = value.trim();
  const normalized = trimmed.toLowerCase();
  return value === trimmed && trimmed.length > 0 && normalized !== 'latest' && normalized !== 'current';
}

export function validateQualificationApplication(
  input: QualificationApplicationValidationInput,
): QualificationApplicationValidationResult {
  if (!exactIdentifier(input.definitionVersionId)) {
    return Object.freeze({ valid: false, failure: 'DEFINITION_VERSION_REQUIRED' });
  }
  if (input.subjects.length !== 1) {
    return Object.freeze({ valid: false, failure: 'EXACTLY_ONE_SUBJECT_REQUIRED' });
  }

  const subject = input.subjects[0];
  if (subject.id.trim().length === 0) {
    return Object.freeze({ valid: false, failure: 'SUBJECT_ID_REQUIRED' });
  }
  if (!exactIdentifier(subject.id)) {
    return Object.freeze({ valid: false, failure: 'LATEST_OR_CURRENT_REFERENCE_FORBIDDEN' });
  }
  if (SUBJECT_SCOPE[subject.kind] !== input.scope) {
    return Object.freeze({ valid: false, failure: 'SUBJECT_SCOPE_MISMATCH' });
  }

  const hasExplicitEffect = [
    input.effects.blocksFormalization,
    input.effects.blocksDelivery,
    input.effects.requiresReview,
    input.effects.requiresDisplay,
    input.effects.informationalOnly,
  ].some((value) => value !== null);
  if (hasExplicitEffect && !exactIdentifier(input.effects.effectAuthorityRef ?? '')) {
    return Object.freeze({ valid: false, failure: 'EFFECT_AUTHORITY_REQUIRED' });
  }

  return Object.freeze({ valid: true, failure: null });
}
