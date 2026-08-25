export const AGENT_NUMERIC_INTERVAL_VERSION = 'AGENT_NUMERIC_INTERVAL_V1' as const;

export const AGENT_NUMERIC_INTERVAL_BOUNDARY_KINDS = [
  'CLOSED',
  'LOWER_INCLUSIVE_UPPER_EXCLUSIVE',
  'LOWER_EXCLUSIVE_UPPER_INCLUSIVE',
  'OPEN',
  'LOWER_UNBOUNDED',
  'UPPER_UNBOUNDED',
] as const;

export type AgentNumericIntervalBoundaryKind = (typeof AGENT_NUMERIC_INTERVAL_BOUNDARY_KINDS)[number];
export type AgentNumericIntervalDimension = 'price' | 'sqft' | 'yearBuilt' | 'beds' | 'baths';
export type AgentNumericIntervalInput = Readonly<{
  min?: number | string | null;
  max?: number | string | null;
  boundary?: AgentNumericIntervalBoundaryKind | string | null;
}>;
export type AgentNumericInterval = Readonly<{
  version: typeof AGENT_NUMERIC_INTERVAL_VERSION;
  dimension: AgentNumericIntervalDimension;
  min: number | null;
  max: number | null;
  includeMin: boolean;
  includeMax: boolean;
  boundary: AgentNumericIntervalBoundaryKind;
  serialized: string;
  validation: Readonly<{ ready: boolean; reasons: readonly string[] }>;
}>;
export type AgentNumericIntervalRelation = 'SAME_INTERVAL' | 'DISJOINT' | 'SUBSET' | 'SUPERSET' | 'OVERLAPPING';

function normalizeNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(String(value).replace(/[$,]/g, '').trim());
  return Number.isFinite(parsed) ? Math.floor(parsed) : Number.NaN;
}

function boundary(value: AgentNumericIntervalInput['boundary']): AgentNumericIntervalBoundaryKind {
  return AGENT_NUMERIC_INTERVAL_BOUNDARY_KINDS.includes(value as AgentNumericIntervalBoundaryKind)
    ? value as AgentNumericIntervalBoundaryKind
    : 'CLOSED';
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function normalizeAgentNumericInterval(dimension: AgentNumericIntervalDimension, input: AgentNumericIntervalInput): AgentNumericInterval {
  const min = normalizeNumber(input.min);
  const max = normalizeNumber(input.max);
  const kind = boundary(input.boundary);
  const reasons = new Set<string>();
  if (Number.isNaN(min)) reasons.add('INTERVAL_MIN_MALFORMED');
  if (Number.isNaN(max)) reasons.add('INTERVAL_MAX_MALFORMED');
  const normalizedMin = Number.isNaN(min) ? null : min;
  const normalizedMax = Number.isNaN(max) ? null : max;
  if (kind === 'LOWER_UNBOUNDED' && normalizedMax === null) reasons.add('INTERVAL_MAX_REQUIRED');
  if (kind === 'UPPER_UNBOUNDED' && normalizedMin === null) reasons.add('INTERVAL_MIN_REQUIRED');
  if (normalizedMin !== null && normalizedMax !== null && normalizedMin > normalizedMax) reasons.add('INTERVAL_MIN_GREATER_THAN_MAX');
  const includeMin = kind === 'CLOSED' || kind === 'LOWER_INCLUSIVE_UPPER_EXCLUSIVE' || kind === 'UPPER_UNBOUNDED';
  const includeMax = kind === 'CLOSED' || kind === 'LOWER_EXCLUSIVE_UPPER_INCLUSIVE' || kind === 'LOWER_UNBOUNDED';
  if (normalizedMin !== null && normalizedMax !== null && normalizedMin === normalizedMax && (!includeMin || !includeMax)) reasons.add('INTERVAL_EMPTY_AT_EQUAL_BOUNDS');
  const body = Object.freeze({ dimension, min: normalizedMin, max: normalizedMax, includeMin, includeMax, boundary: kind });
  return Object.freeze({
    version: AGENT_NUMERIC_INTERVAL_VERSION,
    ...body,
    serialized: stableSerialize(body),
    validation: Object.freeze({ ready: reasons.size === 0, reasons: Object.freeze([...reasons].sort()) }),
  });
}

export function legacyClosedInterval(dimension: AgentNumericIntervalDimension, min: number | null, max: number | null) {
  return normalizeAgentNumericInterval(dimension, { min, max, boundary: 'CLOSED' });
}

export function generatedAdjacentIntervals(
  dimension: AgentNumericIntervalDimension,
  boundaries: readonly number[],
  terminalClosed = false,
) {
  return Object.freeze(boundaries.slice(0, -1).map((min, index) => normalizeAgentNumericInterval(dimension, {
    min,
    max: boundaries[index + 1],
    boundary: terminalClosed && index === boundaries.length - 2 ? 'CLOSED' : 'LOWER_INCLUSIVE_UPPER_EXCLUSIVE',
  })));
}

function compareMin(left: AgentNumericInterval, right: AgentNumericInterval) {
  if (left.min === null && right.min === null) return 0;
  if (left.min === null) return -1;
  if (right.min === null) return 1;
  if (left.min !== right.min) return left.min - right.min;
  if (left.includeMin === right.includeMin) return 0;
  return left.includeMin ? -1 : 1;
}

function compareMax(left: AgentNumericInterval, right: AgentNumericInterval) {
  if (left.max === null && right.max === null) return 0;
  if (left.max === null) return 1;
  if (right.max === null) return -1;
  if (left.max !== right.max) return left.max - right.max;
  if (left.includeMax === right.includeMax) return 0;
  return left.includeMax ? 1 : -1;
}

export function classifyAgentNumericIntervals(left: AgentNumericInterval, right: AgentNumericInterval): AgentNumericIntervalRelation {
  if (left.serialized === right.serialized) return 'SAME_INTERVAL';
  const leftBeforeRight = left.max !== null && right.min !== null && (left.max < right.min || (left.max === right.min && (!left.includeMax || !right.includeMin)));
  const rightBeforeLeft = right.max !== null && left.min !== null && (right.max < left.min || (right.max === left.min && (!right.includeMax || !left.includeMin)));
  if (leftBeforeRight || rightBeforeLeft) return 'DISJOINT';
  const leftWithinRight = compareMin(left, right) >= 0 && compareMax(left, right) <= 0;
  const rightWithinLeft = compareMin(right, left) >= 0 && compareMax(right, left) <= 0;
  if (leftWithinRight && !rightWithinLeft) return 'SUBSET';
  if (rightWithinLeft && !leftWithinRight) return 'SUPERSET';
  return 'OVERLAPPING';
}
