export const CLIENT_CASE_CONTEXT_RECORDS_FOUNDATION_VERSION = 'CANONICAL_CLIENT_CASE_CONTEXT_RECORDS_AND_OBJECTIVES_FOUNDATION_V1' as const;

export const OBJECTIVE_TYPES = ['BUY_PRIMARY_HOME', 'SELL_CURRENT_HOME', 'INVESTMENT_ACQUISITION', 'FINANCIAL_STRATEGY'] as const;
export const OBJECTIVE_STATUSES = ['ACTIVE', 'COMPLETED', 'ARCHIVED'] as const;
export const CONTEXT_SCOPES = ['CASE', 'OBJECTIVE', 'PROPERTY'] as const;
export const SOURCE_POSTURES = ['CLIENT_STATED', 'AGENT_ENTERED', 'EVIDENCE_SUPPORTED', 'PROFESSIONAL_INPUT_SUPPORTED', 'SYSTEM_DERIVED'] as const;

export type ObjectiveType = (typeof OBJECTIVE_TYPES)[number];
export type ObjectiveStatus = (typeof OBJECTIVE_STATUSES)[number];
export type ContextScope = (typeof CONTEXT_SCOPES)[number];
export type SourcePosture = (typeof SOURCE_POSTURES)[number];
export type ContextValueType = 'ENUM' | 'INTEGER' | 'RANGE_CENTS' | 'STRING_SET';

export type ObjectiveTypeMetadata = Readonly<{
  displayLabel: string;
  creatablePursuit: boolean;
  domainAction: 'BUYER' | 'SELLER' | null;
  legacy: boolean;
}>;

export const OBJECTIVE_TYPE_METADATA = Object.freeze({
  BUY_PRIMARY_HOME: { displayLabel: 'Buy', creatablePursuit: true, domainAction: 'BUYER', legacy: false },
  SELL_CURRENT_HOME: { displayLabel: 'Sell', creatablePursuit: true, domainAction: 'SELLER', legacy: false },
  INVESTMENT_ACQUISITION: { displayLabel: 'Invest', creatablePursuit: true, domainAction: null, legacy: false },
  FINANCIAL_STRATEGY: { displayLabel: 'Financial Strategy', creatablePursuit: false, domainAction: null, legacy: true },
} as const satisfies Record<ObjectiveType, ObjectiveTypeMetadata>);

export const CREATABLE_PURSUIT_OBJECTIVE_TYPES = OBJECTIVE_TYPES.filter((objectiveType) => OBJECTIVE_TYPE_METADATA[objectiveType].creatablePursuit) as readonly ObjectiveType[];

export function objectiveTypeMetadata(value: string): ObjectiveTypeMetadata & { known: boolean } {
  const metadata = OBJECTIVE_TYPE_METADATA[value as ObjectiveType];
  return metadata ? { ...metadata, known: true } : { displayLabel: 'Objective', creatablePursuit: false, domainAction: null, legacy: false, known: false };
}

export type SemanticDefinition = Readonly<{
  key: string;
  valueType: ContextValueType;
  allowedScopes: readonly ContextScope[];
  allowedSourcePostures: readonly SourcePosture[];
  enumValues?: readonly string[];
}>;

const POSTURES = {
  fact: ['CLIENT_STATED', 'AGENT_ENTERED', 'EVIDENCE_SUPPORTED', 'PROFESSIONAL_INPUT_SUPPORTED', 'SYSTEM_DERIVED'],
  criterion: ['CLIENT_STATED', 'AGENT_ENTERED'],
} as const satisfies Record<string, readonly SourcePosture[]>;

export const FACT_SEMANTICS = Object.freeze({
  PROPERTY_OCCUPANCY_STATUS: {
    key: 'PROPERTY_OCCUPANCY_STATUS',
    valueType: 'ENUM',
    allowedScopes: ['PROPERTY'],
    allowedSourcePostures: POSTURES.fact,
    enumValues: ['OWNER_OCCUPIED', 'TENANT_OCCUPIED', 'VACANT', 'UNKNOWN'],
  },
} as const satisfies Record<string, SemanticDefinition>);

export const CRITERION_SEMANTICS = Object.freeze({
  TARGET_CITIES: {
    key: 'TARGET_CITIES',
    valueType: 'STRING_SET',
    allowedScopes: ['CASE', 'OBJECTIVE'],
    allowedSourcePostures: POSTURES.criterion,
  },
  MIN_BEDROOMS: {
    key: 'MIN_BEDROOMS',
    valueType: 'INTEGER',
    allowedScopes: ['OBJECTIVE'],
    allowedSourcePostures: POSTURES.criterion,
  },
  PURCHASE_PRICE_RANGE_CENTS: {
    key: 'PURCHASE_PRICE_RANGE_CENTS',
    valueType: 'RANGE_CENTS',
    allowedScopes: ['OBJECTIVE'],
    allowedSourcePostures: POSTURES.criterion,
  },
} as const satisfies Record<string, SemanticDefinition>);

export type FactSemanticKey = keyof typeof FACT_SEMANTICS;
export type CriterionSemanticKey = keyof typeof CRITERION_SEMANTICS;

export function isRegisteredScope(value: unknown): value is ContextScope {
  return typeof value === 'string' && (CONTEXT_SCOPES as readonly string[]).includes(value);
}

export function isRegisteredSourcePosture(value: unknown): value is SourcePosture {
  return typeof value === 'string' && (SOURCE_POSTURES as readonly string[]).includes(value);
}

export function assertRegistryIntegrity(registry: Record<string, SemanticDefinition>) {
  const keys = new Set<string>();
  for (const [entryKey, definition] of Object.entries(registry)) {
    if (!definition.key || definition.key !== entryKey || keys.has(definition.key)) throw new Error('Client Case context semantic registry is invalid.');
    if (!definition.valueType || definition.allowedScopes.length === 0 || definition.allowedSourcePostures.length === 0) throw new Error('Client Case context semantic registry is incomplete.');
    keys.add(definition.key);
  }
}

assertRegistryIntegrity(FACT_SEMANTICS);
assertRegistryIntegrity(CRITERION_SEMANTICS);
