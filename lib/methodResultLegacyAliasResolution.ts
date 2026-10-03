export const METHOD_RESULT_ALIAS_KINDS = [
  'CALCULATION_VERSION',
  'CALCULATION_CONTRACT',
  'CALCULATION_ENGINE',
  'LEGACY_IDENTIFIER',
  'IMPLEMENTATION_REFERENCE',
  'OTHER',
] as const;

export type MethodResultAliasKind = (typeof METHOD_RESULT_ALIAS_KINDS)[number];

export type MethodResultAliasAdjudicationState =
  | 'UNADJUDICATED'
  | 'ADJUDICATED'
  | 'HELD'
  | 'UNMAPPED'
  | 'REJECTED';

export type MethodResultAliasRecord = Readonly<{
  aliasNamespace: string;
  aliasKind: MethodResultAliasKind;
  aliasValue: string;
  adjudicationState: MethodResultAliasAdjudicationState;
  methodId: string | null;
  methodVersionId: string | null;
  resultId: string | null;
  resultVersionId: string | null;
}>;

export type MethodResultAliasQuery = Readonly<{
  aliasNamespace: string;
  aliasKind: MethodResultAliasKind;
  aliasValue: string;
}>;

export type MethodResultAliasResolution =
  | Readonly<{
      resolved: true;
      target: Readonly<{
        type: 'METHOD' | 'METHOD_VERSION' | 'RESULT' | 'RESULT_VERSION';
        id: string;
      }>;
    }>
  | Readonly<{
      resolved: false;
      reason: 'MISSING' | 'AMBIGUOUS' | 'UNADJUDICATED' | 'HELD' | 'UNMAPPED' | 'REJECTED' | 'INVALID_TARGET_CARDINALITY';
    }>;

const noResolution = (reason: Exclude<MethodResultAliasResolution, { resolved: true }>['reason']): MethodResultAliasResolution =>
  Object.freeze({ resolved: false, reason });

export function resolveExactMethodResultAlias(
  query: MethodResultAliasQuery,
  records: readonly MethodResultAliasRecord[],
): MethodResultAliasResolution {
  const matches = records.filter(
    (record) =>
      record.aliasNamespace === query.aliasNamespace &&
      record.aliasKind === query.aliasKind &&
      record.aliasValue === query.aliasValue,
  );

  if (matches.length === 0) return noResolution('MISSING');
  if (matches.length !== 1) return noResolution('AMBIGUOUS');

  const alias = matches[0];
  if (alias.adjudicationState !== 'ADJUDICATED') return noResolution(alias.adjudicationState);

  const targets = [
    alias.methodId ? { type: 'METHOD' as const, id: alias.methodId } : null,
    alias.methodVersionId ? { type: 'METHOD_VERSION' as const, id: alias.methodVersionId } : null,
    alias.resultId ? { type: 'RESULT' as const, id: alias.resultId } : null,
    alias.resultVersionId ? { type: 'RESULT_VERSION' as const, id: alias.resultVersionId } : null,
  ].filter((target): target is NonNullable<typeof target> => target !== null);

  if (targets.length !== 1) return noResolution('INVALID_TARGET_CARDINALITY');
  return Object.freeze({ resolved: true, target: Object.freeze(targets[0]) });
}
