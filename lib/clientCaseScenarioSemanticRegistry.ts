export const CLIENT_CASE_SCENARIO_FOUNDATION_VERSION = 'CANONICAL_CLIENT_CASE_SCENARIO_FOUNDATION_V1' as const;

export const SCENARIO_STATUSES = ['ACTIVE', 'ARCHIVED'] as const;
export const SCENARIO_VALUE_TYPES = ['MONEY_CENTS', 'PERCENT_BPS', 'INTEGER', 'STRING_SET'] as const;
export const SCENARIO_PROPERTY_DISPOSITIONS = ['SELL', 'RETAIN', 'RETAIN_AS_RENTAL'] as const;

export type ScenarioValueType = typeof SCENARIO_VALUE_TYPES[number];

export type ScenarioSemanticDefinition = Readonly<{
  key: string;
  valueType: ScenarioValueType;
  category: 'GENERIC_SCENARIO_CONTEXT';
  description: string;
}>;

export const SCENARIO_ASSUMPTION_SEMANTICS = Object.freeze({
  TARGET_ACQUISITION_PRICE_CENTS: {
    key: 'TARGET_ACQUISITION_PRICE_CENTS',
    valueType: 'MONEY_CENTS',
    category: 'GENERIC_SCENARIO_CONTEXT',
    description: 'Hypothetical target acquisition price.',
  },
  DOWN_PAYMENT_BPS: {
    key: 'DOWN_PAYMENT_BPS',
    valueType: 'PERCENT_BPS',
    category: 'GENERIC_SCENARIO_CONTEXT',
    description: 'Hypothetical down payment percentage in basis points.',
  },
  CASH_ALLOCATION_CENTS: {
    key: 'CASH_ALLOCATION_CENTS',
    valueType: 'MONEY_CENTS',
    category: 'GENERIC_SCENARIO_CONTEXT',
    description: 'Hypothetical cash allocation.',
  },
  HOLDING_PERIOD_MONTHS: {
    key: 'HOLDING_PERIOD_MONTHS',
    valueType: 'INTEGER',
    category: 'GENERIC_SCENARIO_CONTEXT',
    description: 'Hypothetical intended holding period in months.',
  },
} as const satisfies Record<string, ScenarioSemanticDefinition>);

export const SCENARIO_CRITERION_SEMANTICS = Object.freeze({
  TARGET_CITIES: {
    key: 'TARGET_CITIES',
    valueType: 'STRING_SET',
    category: 'GENERIC_SCENARIO_CONTEXT',
    description: 'Scenario-specific target cities.',
  },
  MIN_BEDROOMS: {
    key: 'MIN_BEDROOMS',
    valueType: 'INTEGER',
    category: 'GENERIC_SCENARIO_CONTEXT',
    description: 'Scenario-specific minimum bedroom count.',
  },
  MAX_PURCHASE_PRICE_CENTS: {
    key: 'MAX_PURCHASE_PRICE_CENTS',
    valueType: 'MONEY_CENTS',
    category: 'GENERIC_SCENARIO_CONTEXT',
    description: 'Scenario-specific maximum purchase price.',
  },
} as const satisfies Record<string, ScenarioSemanticDefinition>);

export type ScenarioAssumptionSemanticKey = keyof typeof SCENARIO_ASSUMPTION_SEMANTICS;
export type ScenarioCriterionSemanticKey = keyof typeof SCENARIO_CRITERION_SEMANTICS;

export function assertScenarioRegistryIntegrity(registry: Record<string, ScenarioSemanticDefinition>) {
  const keys = new Set<string>();
  for (const [entryKey, definition] of Object.entries(registry)) {
    if (!definition.key || definition.key !== entryKey || keys.has(definition.key)) throw new Error('Client Case Scenario semantic registry is invalid.');
    if (!SCENARIO_VALUE_TYPES.includes(definition.valueType) || definition.category !== 'GENERIC_SCENARIO_CONTEXT' || !definition.description) {
      throw new Error('Client Case Scenario semantic registry is incomplete.');
    }
    keys.add(definition.key);
  }
}

assertScenarioRegistryIntegrity(SCENARIO_ASSUMPTION_SEMANTICS);
assertScenarioRegistryIntegrity(SCENARIO_CRITERION_SEMANTICS);
