import type { SundanceArticleArchitectureRecord } from './sundanceArticleArchitecture';

export const SUNDANCE_SOURCE_LOCKED_INPUT_ONLY = true as const;
export const SUNDANCE_SOURCE_LOCKED_INPUT_CATEGORIES = [
  'CUSTOMER_QUESTION', 'APPROVED_CLAIM_BOUNDARY', 'APPROVED_SOURCE_REFERENCE',
  'SOURCE_EFFECTIVE_PERIOD', 'SOURCE_FRESHNESS_LIMIT', 'RIGHTS_LIMITATION',
  'EDITORIAL_CLASS', 'PUBLIC_LIMITATION', 'PROFESSIONAL_ESCALATION',
  'AEO_ROLE', 'CANONICAL_PILLAR_RELATION',
] as const;
export type SundanceSourceLockedInputCategory = (typeof SUNDANCE_SOURCE_LOCKED_INPUT_CATEGORIES)[number];
export type SundanceSourceLockedDraftInput = Readonly<{ category: SundanceSourceLockedInputCategory; value: string }>;

export function buildSundanceSourceLockedDraftInput(record: SundanceArticleArchitectureRecord): readonly SundanceSourceLockedDraftInput[] {
  return [
    { category: 'CUSTOMER_QUESTION', value: record.customerQuestion },
    { category: 'APPROVED_CLAIM_BOUNDARY', value: 'EDITORIAL_ONLY' },
    { category: 'APPROVED_SOURCE_REFERENCE', value: record.sourceReferences.map((item) => item.sourceId).join('|') },
    { category: 'SOURCE_EFFECTIVE_PERIOD', value: record.effectivePeriod.kind },
    { category: 'SOURCE_FRESHNESS_LIMIT', value: record.sourceReferences.map((item) => item.freshnessPosture).join('|') },
    { category: 'RIGHTS_LIMITATION', value: record.sourceReferences.map((item) => item.rightsPosture).join('|') },
    { category: 'EDITORIAL_CLASS', value: 'EDITORIAL_ONLY' },
    { category: 'PUBLIC_LIMITATION', value: 'NO_PUBLICATION_AUTHORITY' },
    { category: 'PROFESSIONAL_ESCALATION', value: record.professionalHandoff.surface },
    { category: 'AEO_ROLE', value: record.aeoRole },
    { category: 'CANONICAL_PILLAR_RELATION', value: record.pillarRelationship },
  ];
}

export function hasOnlySundanceSourceLockedInput(input: readonly { category: string; value: string }[]): boolean {
  return input.length > 0 && input.every((item) => SUNDANCE_SOURCE_LOCKED_INPUT_CATEGORIES.includes(item.category as SundanceSourceLockedInputCategory) && item.value.trim().length > 0);
}
