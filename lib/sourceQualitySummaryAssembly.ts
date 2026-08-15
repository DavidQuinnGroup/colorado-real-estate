import {
  normalizeSourceEvidence,
  type SourceEvidenceCertificationReference,
  type SourceEvidenceLinkageRecord,
} from './sourceQualityEvidenceNormalization';
import { summarizeSourceQuality, type SourceQualityReviewSummary } from './sourceQualityControl';

export const SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION = 'REIE_SOURCE_QUALITY_SUMMARY_ASSEMBLY_V1' as const;

export type SourceQualitySummaryAssemblyCoverageClass =
  | 'SUPPLIED_MANIFEST_ONLY'
  | 'PARTIAL_REVIEWED_SOURCE_SET'
  | 'NO_COMPLETENESS_CLAIM';

export type SourceQualitySummaryAssemblyInclusionPosture =
  | 'EXPLICITLY_SUPPLIED_REVIEWED_SOURCE'
  | 'EXPLICITLY_SUPPLIED_SPARSE_REVIEW_SOURCE';

export type SourceQualitySummaryAssemblyClassification =
  | 'ASSEMBLED'
  | 'PARTIALLY_ASSEMBLED'
  | 'FAIL_CLOSED';

export type SourceQualitySummaryAssemblyFailureReason =
  | 'INVALID_ASSEMBLY_INPUT'
  | 'UNSUPPORTED_ASSEMBLY_FIELD'
  | 'INVALID_SCHEMA_VERSION'
  | 'MISSING_ASSEMBLY_ID'
  | 'INVALID_COVERAGE_CLASS'
  | 'INVALID_ENTRIES'
  | 'MALFORMED_ENTRY'
  | 'DUPLICATE_SOURCE_ID'
  | 'UNSUPPORTED_DISCOVERY_FIELD'
  | 'MALFORMED_CERTIFICATION_REFERENCE'
  | 'CANONICAL_NORMALIZATION_FAILED'
  | 'CANONICAL_SUMMARY_FAILED';

export type SourceQualitySummaryAssemblyEntry = Readonly<{
  sourceId: string;
  inclusionPosture: SourceQualitySummaryAssemblyInclusionPosture;
  linkages: readonly SourceEvidenceLinkageRecord[];
  certificationReference?: SourceEvidenceCertificationReference;
}>;

export type SourceQualitySummaryAssemblyRequest = Readonly<{
  schemaVersion: typeof SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION;
  assemblyId: string;
  coverageClass: SourceQualitySummaryAssemblyCoverageClass;
  entries: readonly SourceQualitySummaryAssemblyEntry[];
  certificationReference?: SourceEvidenceCertificationReference;
}>;

export type SourceQualitySummaryAssemblySourceResult = Readonly<{
  sourceId: string;
  classification: SourceQualitySummaryAssemblyClassification;
  normalizationResult: string;
  summaryClassification: SourceQualityReviewSummary['classification'] | null;
  reasons: readonly SourceQualitySummaryAssemblyFailureReason[];
  normalizationFingerprint: string;
  summaryFingerprint: string | null;
}>;

export type SourceQualitySummaryAssembly = Readonly<{
  schemaVersion: typeof SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION;
  classification: SourceQualitySummaryAssemblyClassification;
  assemblyId: string;
  coverageClass: SourceQualitySummaryAssemblyCoverageClass;
  suppliedDatasetScope: 'EXPLICIT_REVIEWED_SOURCE_ENTRIES_ONLY';
  completenessClaim: 'NO_STATEWIDE_OR_PROVIDER_COMPLETENESS_CLAIM';
  sourceCount: number;
  assembledSourceCount: number;
  sourceOrder: readonly string[];
  sourceResults: readonly SourceQualitySummaryAssemblySourceResult[];
  summaries: readonly SourceQualityReviewSummary[];
  activationFirewall: Readonly<{
    sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_THIS_ASSEMBLY';
    sourceRegistryMutation: 'SOURCE_REGISTRY_MUTATION_NOT_AUTHORIZED_BY_THIS_ASSEMBLY';
    rightsGrant: 'RIGHTS_GRANT_NOT_AUTHORIZED_BY_THIS_ASSEMBLY';
    customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_THIS_ASSEMBLY';
  }>;
  assemblyFingerprint: string;
}>;

export type SourceQualitySummaryAssemblyResult =
  | Readonly<{ classification: 'FAIL_CLOSED'; assembly: null; reasons: readonly SourceQualitySummaryAssemblyFailureReason[] }>
  | Readonly<{ classification: 'ASSEMBLED' | 'PARTIALLY_ASSEMBLED'; assembly: SourceQualitySummaryAssembly; reasons: readonly SourceQualitySummaryAssemblyFailureReason[] }>;

const ID_PATTERN = /^[A-Z][A-Z0-9_-]{2,119}$/;
const ASSEMBLY_KEYS = ['schemaVersion', 'assemblyId', 'coverageClass', 'entries', 'certificationReference'];
const ENTRY_KEYS = ['sourceId', 'inclusionPosture', 'linkages', 'certificationReference'];
const CERTIFICATION_KEYS = ['certificationId', 'repositoryReference', 'referenceVersion', 'linkageReviewedDate'];
const DISCOVERY_KEYS = [
  'providerName',
  'countyName',
  'fileName',
  'sourceUrl',
  'url',
  'repositoryPath',
  'documentPath',
  'semanticSimilarity',
  'fuzzyMatch',
  'narrative',
  'notes',
  'rightsConclusion',
  'customerDisplayAuthority',
  'productionReady',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  if (isRecord(value)) return '{' + Object.keys(value).sort().map((key) => JSON.stringify(key) + ':' + stable(value[key])).join(',') + '}';
  return JSON.stringify(value);
}

function hash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(16).padStart(8, '0');
}

function fail(...reasons: readonly SourceQualitySummaryAssemblyFailureReason[]): SourceQualitySummaryAssemblyResult {
  return { classification: 'FAIL_CLOSED', assembly: null, reasons: [...new Set(reasons)].sort() };
}

function isFailureReasons(value: SourceQualitySummaryAssemblyRequest | readonly SourceQualitySummaryAssemblyFailureReason[]): value is readonly SourceQualitySummaryAssemblyFailureReason[] {
  return Array.isArray(value);
}

function includesDiscoveryField(value: Record<string, unknown>): boolean {
  return Object.keys(value).some((key) => DISCOVERY_KEYS.includes(key));
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key)) && keys.filter((key) => key !== 'certificationReference').every((key) => key in value);
}

function validDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + 'T00:00:00.000Z'));
}

function validCertificationReference(value: unknown): value is SourceEvidenceCertificationReference {
  return isRecord(value)
    && exactKeys(value, CERTIFICATION_KEYS)
    && typeof value.certificationId === 'string'
    && ID_PATTERN.test(value.certificationId)
    && (
      value.repositoryReference === 'docs/project-atlas/executive-library/REIE-SOURCE-REGISTRY-GRAND-PLAN-ADVANCEMENT-PRODUCTION-CERTIFICATION.md'
      || value.repositoryReference === 'docs/project-atlas/executive-library/SOURCE-RIGHTS-READINESS-1-PRODUCTION-CERTIFICATION.md'
      || value.repositoryReference === 'docs/project-atlas/executive-library'
    )
    && typeof value.referenceVersion === 'string'
    && ID_PATTERN.test(value.referenceVersion)
    && validDate(value.linkageReviewedDate);
}

function validEntry(value: unknown): value is SourceQualitySummaryAssemblyEntry {
  return isRecord(value)
    && !includesDiscoveryField(value)
    && exactKeys(value, ENTRY_KEYS)
    && typeof value.sourceId === 'string'
    && ID_PATTERN.test(value.sourceId)
    && (value.inclusionPosture === 'EXPLICITLY_SUPPLIED_REVIEWED_SOURCE' || value.inclusionPosture === 'EXPLICITLY_SUPPLIED_SPARSE_REVIEW_SOURCE')
    && Array.isArray(value.linkages)
    && (value.certificationReference === undefined || validCertificationReference(value.certificationReference));
}

function validateRequest(input: unknown): SourceQualitySummaryAssemblyRequest | readonly SourceQualitySummaryAssemblyFailureReason[] {
  const reasons = new Set<SourceQualitySummaryAssemblyFailureReason>();
  if (!isRecord(input)) return ['INVALID_ASSEMBLY_INPUT'];
  if (includesDiscoveryField(input)) reasons.add('UNSUPPORTED_DISCOVERY_FIELD');
  if (!exactKeys(input, ASSEMBLY_KEYS)) reasons.add('UNSUPPORTED_ASSEMBLY_FIELD');
  if (input.schemaVersion !== SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION) reasons.add('INVALID_SCHEMA_VERSION');
  if (typeof input.assemblyId !== 'string' || !ID_PATTERN.test(input.assemblyId)) reasons.add('MISSING_ASSEMBLY_ID');
  if (!['SUPPLIED_MANIFEST_ONLY', 'PARTIAL_REVIEWED_SOURCE_SET', 'NO_COMPLETENESS_CLAIM'].includes(String(input.coverageClass))) reasons.add('INVALID_COVERAGE_CLASS');
  if (!Array.isArray(input.entries) || input.entries.length === 0) reasons.add('INVALID_ENTRIES');
  if (input.certificationReference !== undefined && !validCertificationReference(input.certificationReference)) reasons.add('MALFORMED_CERTIFICATION_REFERENCE');
  const entries = Array.isArray(input.entries) ? input.entries : [];
  if (entries.some((entry) => isRecord(entry) && includesDiscoveryField(entry))) reasons.add('UNSUPPORTED_DISCOVERY_FIELD');
  if (!entries.every(validEntry)) reasons.add('MALFORMED_ENTRY');
  const sourceIds = entries.filter(validEntry).map((entry) => entry.sourceId);
  if (new Set(sourceIds).size !== sourceIds.length) reasons.add('DUPLICATE_SOURCE_ID');
  return reasons.size > 0 ? [...reasons].sort() : input as SourceQualitySummaryAssemblyRequest;
}

export function assembleSourceQualitySummaries(input: unknown): SourceQualitySummaryAssemblyResult {
  const request = validateRequest(input);
  if (isFailureReasons(request)) return fail(...request);

  const sourceResults: SourceQualitySummaryAssemblySourceResult[] = [];
  const summaries: SourceQualityReviewSummary[] = [];

  for (const entry of [...request.entries].sort((left, right) => left.sourceId.localeCompare(right.sourceId))) {
    const normalized = normalizeSourceEvidence({ sourceId: entry.sourceId, linkages: entry.linkages });
    const control = summarizeSourceQuality(normalized);
    const reasons = new Set<SourceQualitySummaryAssemblyFailureReason>();
    if (normalized.result === 'INVALID_LINKAGE') reasons.add('CANONICAL_NORMALIZATION_FAILED');
    if (!control.summary) reasons.add('CANONICAL_SUMMARY_FAILED');
    if (control.summary) summaries.push(control.summary);
    sourceResults.push({
      sourceId: entry.sourceId,
      classification: control.summary ? 'ASSEMBLED' : 'PARTIALLY_ASSEMBLED',
      normalizationResult: normalized.result,
      summaryClassification: control.summary?.classification ?? null,
      reasons: [...reasons].sort(),
      normalizationFingerprint: normalized.normalizationFingerprint,
      summaryFingerprint: control.summary?.summaryFingerprint ?? null,
    });
  }

  summaries.sort((left, right) => left.source.sourceId.localeCompare(right.source.sourceId));
  const classification: 'ASSEMBLED' | 'PARTIALLY_ASSEMBLED' = sourceResults.every((result) => result.classification === 'ASSEMBLED') ? 'ASSEMBLED' : 'PARTIALLY_ASSEMBLED';
  const assemblyBasis = {
    schemaVersion: SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
    assemblyId: request.assemblyId,
    coverageClass: request.coverageClass,
    requestEntries: [...request.entries].sort((left, right) => left.sourceId.localeCompare(right.sourceId)),
    sourceResults,
    summaries: summaries.map((summary) => ({ sourceId: summary.source.sourceId, summaryFingerprint: summary.summaryFingerprint })),
  };
  const assembly: SourceQualitySummaryAssembly = {
    schemaVersion: SOURCE_QUALITY_SUMMARY_ASSEMBLY_SCHEMA_VERSION,
    classification,
    assemblyId: request.assemblyId,
    coverageClass: request.coverageClass,
    suppliedDatasetScope: 'EXPLICIT_REVIEWED_SOURCE_ENTRIES_ONLY',
    completenessClaim: 'NO_STATEWIDE_OR_PROVIDER_COMPLETENESS_CLAIM',
    sourceCount: request.entries.length,
    assembledSourceCount: summaries.length,
    sourceOrder: summaries.map((summary) => summary.source.sourceId),
    sourceResults,
    summaries,
    activationFirewall: {
      sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_THIS_ASSEMBLY',
      sourceRegistryMutation: 'SOURCE_REGISTRY_MUTATION_NOT_AUTHORIZED_BY_THIS_ASSEMBLY',
      rightsGrant: 'RIGHTS_GRANT_NOT_AUTHORIZED_BY_THIS_ASSEMBLY',
      customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_THIS_ASSEMBLY',
    },
    assemblyFingerprint: 'source-quality-summary-assembly:v1:' + hash(stable(assemblyBasis)),
  };
  return { classification, assembly, reasons: sourceResults.flatMap((result) => result.reasons).filter((reason, index, all) => all.indexOf(reason) === index).sort() };
}
