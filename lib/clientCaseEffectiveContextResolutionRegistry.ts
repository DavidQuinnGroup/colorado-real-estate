import type { ScenarioValueType } from './clientCaseScenarioSemanticRegistry';

export const CLIENT_CASE_EFFECTIVE_CONTEXT_RESOLVER_VERSION = 'CANONICAL_CLIENT_CASE_EFFECTIVE_CONTEXT_RESOLVER_V1' as const;

export const EFFECTIVE_CONTEXT_RESOLUTION_RULESET_VERSION = 1 as const;

export type EffectiveContextResolutionCategory =
  | 'CANONICAL_ONLY'
  | 'SCENARIO_ONLY'
  | 'SCENARIO_OVERRIDES_CANONICAL_CRITERION';

export type ScenarioCriterionResolutionRule = Readonly<{
  semanticKey: string;
  canonicalValueType: 'STRING_SET' | 'INTEGER' | 'RANGE_CENTS';
  scenarioValueType: ScenarioValueType;
  category: EffectiveContextResolutionCategory;
}>;

// Only Scenario criteria with the same durable semantic key and compatible value type can replace a canonical criterion.
export const SCENARIO_CRITERION_RESOLUTION_RULES = Object.freeze({
  TARGET_CITIES: {
    semanticKey: 'TARGET_CITIES',
    canonicalValueType: 'STRING_SET',
    scenarioValueType: 'STRING_SET',
    category: 'SCENARIO_OVERRIDES_CANONICAL_CRITERION',
  },
  MIN_BEDROOMS: {
    semanticKey: 'MIN_BEDROOMS',
    canonicalValueType: 'INTEGER',
    scenarioValueType: 'INTEGER',
    category: 'SCENARIO_OVERRIDES_CANONICAL_CRITERION',
  },
} as const satisfies Record<string, ScenarioCriterionResolutionRule>);

export const SCENARIO_ONLY_RESOLUTION_RULES = Object.freeze({
  TARGET_ACQUISITION_PRICE_CENTS: { semanticKey: 'TARGET_ACQUISITION_PRICE_CENTS', valueType: 'MONEY_CENTS' },
  DOWN_PAYMENT_BPS: { semanticKey: 'DOWN_PAYMENT_BPS', valueType: 'PERCENT_BPS' },
  CASH_ALLOCATION_CENTS: { semanticKey: 'CASH_ALLOCATION_CENTS', valueType: 'MONEY_CENTS' },
  HOLDING_PERIOD_MONTHS: { semanticKey: 'HOLDING_PERIOD_MONTHS', valueType: 'INTEGER' },
  MAX_PURCHASE_PRICE_CENTS: { semanticKey: 'MAX_PURCHASE_PRICE_CENTS', valueType: 'MONEY_CENTS' },
} as const satisfies Record<string, Readonly<{ semanticKey: string; valueType: ScenarioValueType }>>);

export function scenarioCriterionResolutionRule(semanticKey: string) {
  return SCENARIO_CRITERION_RESOLUTION_RULES[semanticKey as keyof typeof SCENARIO_CRITERION_RESOLUTION_RULES] ?? null;
}

export function scenarioOnlyResolutionRule(semanticKey: string) {
  return SCENARIO_ONLY_RESOLUTION_RULES[semanticKey as keyof typeof SCENARIO_ONLY_RESOLUTION_RULES] ?? null;
}

export function assertEffectiveContextResolutionRegistryIntegrity() {
  for (const [key, rule] of Object.entries(SCENARIO_CRITERION_RESOLUTION_RULES)) {
    if (key !== rule.semanticKey || rule.category !== 'SCENARIO_OVERRIDES_CANONICAL_CRITERION') {
      throw new Error('Effective Context resolution registry is invalid.');
    }
  }
  for (const [key, rule] of Object.entries(SCENARIO_ONLY_RESOLUTION_RULES)) {
    if (key !== rule.semanticKey) throw new Error('Effective Context resolution registry is invalid.');
  }
}

assertEffectiveContextResolutionRegistryIntegrity();
