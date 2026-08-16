import { createHash } from 'node:crypto';

export const SOURCE_QUALITY_DETERMINISTIC_FINGERPRINT_UTILITY_VERSION = 'v1' as const;
export const SOURCE_QUALITY_DETERMINISTIC_FINGERPRINT_ALGORITHM = 'sha256' as const;

export const SOURCE_QUALITY_FINGERPRINT_NAMESPACES = Object.freeze([
  'public-record-input',
  'public-record-conversion',
  'county-public-record-input',
  'county-public-record-conversion',
  'gis-public-geospatial-input',
  'gis-public-geospatial-conversion',
  'human-reviewed-input',
  'human-reviewed-conversion',
  'normalization',
  'control-summary',
  'assembly',
  'report',
  'operational-manifest',
] as const);

export type SourceQualityFingerprintNamespace = (typeof SOURCE_QUALITY_FINGERPRINT_NAMESPACES)[number];

const NAMESPACE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isPlainObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function stableSerialize(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('Unsupported non-finite number in governed fingerprint input.');
    return JSON.stringify(value);
  }
  if (typeof value === 'undefined') throw new TypeError('Unsupported undefined in governed fingerprint input.');
  if (typeof value === 'bigint') throw new TypeError('Unsupported bigint in governed fingerprint input.');
  if (typeof value === 'function') throw new TypeError('Unsupported function in governed fingerprint input.');
  if (typeof value === 'symbol') throw new TypeError('Unsupported symbol in governed fingerprint input.');
  if (Array.isArray(value)) return '[' + value.map(stableSerialize).join(',') + ']';
  if (typeof value !== 'object' || !isPlainObject(value)) throw new TypeError('Unsupported non-plain object in governed fingerprint input.');

  return '{' + Object.keys(value).sort().map((key) => JSON.stringify(key) + ':' + stableSerialize((value as Record<string, unknown>)[key])).join(',') + '}';
}

export function createSourceQualityNamespacedFingerprint(
  namespace: SourceQualityFingerprintNamespace,
  value: unknown,
): string {
  if (!NAMESPACE_PATTERN.test(namespace)) throw new TypeError('Invalid Source Quality fingerprint namespace.');
  const serialized = stableSerialize(value);
  const digest = createHash(SOURCE_QUALITY_DETERMINISTIC_FINGERPRINT_ALGORITHM).update(serialized, 'utf8').digest('hex');
  return `source-quality-fingerprint:${namespace}:${SOURCE_QUALITY_DETERMINISTIC_FINGERPRINT_UTILITY_VERSION}:${SOURCE_QUALITY_DETERMINISTIC_FINGERPRINT_ALGORITHM}:${digest}`;
}
