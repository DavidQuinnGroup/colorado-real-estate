import type {
  SourceQualityHumanReviewReason,
  SourceQualityReviewSummary,
  SourceQualitySummaryClassification,
} from './sourceQualityControl';

export const SOURCE_QUALITY_REPORT_SCHEMA_VERSION = 'REIE_SOURCE_QUALITY_REPORT_COMPOSITION_V1' as const;

export type SourceQualityReportClassification =
  | 'REPORT_REVIEW_POSTURE_COMPLETE'
  | 'REPORT_REVIEW_REQUIRED'
  | 'REPORT_HAS_CONFLICTS'
  | 'REPORT_HAS_INVALID_SOURCE_EVIDENCE';

export type SourceQualityReportFailureReason =
  | 'INVALID_REPORT_INPUT'
  | 'MALFORMED_SOURCE_QUALITY_SUMMARY'
  | 'DUPLICATE_SOURCE_ID'
  | 'UNSUPPORTED_SUMMARY_CLASSIFICATION'
  | 'UNSUPPORTED_DIMENSION_POSTURE'
  | 'INVALID_FIREWALL_POSTURE'
  | 'UNSUPPORTED_SUMMARY_FIELD';

export type SourceQualityReportQueueEntry = Readonly<{
  sourceId: string;
  classification: SourceQualitySummaryClassification;
  humanReviewReasons: readonly SourceQualityHumanReviewReason[];
  limitationCodes: readonly string[];
  evidenceReferenceIds: readonly string[];
  certificationReferenceIds: readonly string[];
}>;

export type SourceQualityConflictQueueEntry = Readonly<{
  sourceId: string;
  conflictReferences: readonly SourceQualityReviewSummary['conflictReferences'][number][];
}>;

export type SourceQualityReport = Readonly<{
  schemaVersion: typeof SOURCE_QUALITY_REPORT_SCHEMA_VERSION;
  classification: SourceQualityReportClassification;
  suppliedDatasetScope: 'SUPPLIED_SUMMARIES_ONLY';
  sourceCount: number;
  sourceOrder: readonly string[];
  classificationCounts: Readonly<Record<SourceQualitySummaryClassification, number>>;
  reviewRequiredSources: readonly SourceQualityReportQueueEntry[];
  conflictSources: readonly SourceQualityConflictQueueEntry[];
  insufficientEvidenceSources: readonly string[];
  invalidSourceEvidenceSources: readonly string[];
  dimensionPostureCounts: Readonly<{
    rights: Readonly<Record<string, number>>;
    technicalAccess: Readonly<Record<string, number>>;
    freshness: Readonly<Record<string, number>>;
    attribution: Readonly<Record<string, number>>;
    provenance: Readonly<Record<string, number>>;
    certification: Readonly<Record<string, number>>;
    linkage: Readonly<Record<string, number>>;
  }>;
  limitationCodeCounts: Readonly<Record<string, number>>;
  humanReviewReasonCounts: Readonly<Record<SourceQualityHumanReviewReason, number>>;
  evidenceReferenceIndex: Readonly<Record<string, readonly string[]>>;
  certificationReferenceIndex: Readonly<Record<string, readonly string[]>>;
  activationFirewall: Readonly<{
    sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_THIS_REPORT';
    executiveReview: 'EXECUTIVE_REVIEW_REQUIRED_FOR_ACTIVATION';
    customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_THIS_REPORT';
  }>;
  reportFingerprint: string;
}>;

export type SourceQualityReportResult =
  | Readonly<{ classification: 'FAIL_CLOSED'; report: null; reasons: readonly SourceQualityReportFailureReason[] }>
  | Readonly<{ classification: SourceQualityReportClassification; report: SourceQualityReport; reasons: readonly [] }>;

const ID_PATTERN = /^[A-Za-z0-9._:-]{3,200}$/;
const SUMMARY_KEYS = ['schemaVersion', 'classification', 'source', 'normalizedPostures', 'limitationCodes', 'evidenceReferenceIds', 'certificationReferenceIds', 'conflictReferences', 'humanReviewReasons', 'activationFirewall', 'summaryFingerprint'];
const SOURCE_KEYS = ['sourceId', 'sourceClass', 'responsibleOrganization', 'coverage', 'declaredActivationPosture', 'permittedUse', 'canonicalClaimEligible', 'canonicalCustomerDisclosureEligible', 'sourcePaths', 'freshnessExpectation', 'lastSourceVerificationDate', 'lastSuccessfulDataRefresh'];
const POSTURE_KEYS = ['rights', 'technicalAccess', 'freshness', 'attribution', 'provenance', 'certification', 'linkage', 'normalizationResult'];
const FIREWALL_KEYS = ['sourceActivation', 'executiveReview', 'customerDisplayAuthority'];
const CLASSIFICATIONS: readonly SourceQualitySummaryClassification[] = ['REVIEW_POSTURE_COMPLETE', 'REVIEW_REQUIRED', 'INSUFFICIENT_EVIDENCE', 'CONFLICT_REQUIRES_REVIEW', 'INVALID_SOURCE_EVIDENCE'];
const REVIEW_REASONS: readonly SourceQualityHumanReviewReason[] = ['RIGHTS_REVIEW_REQUIRED', 'TECHNICAL_ACCESS_REVIEW_REQUIRED', 'FRESHNESS_REVIEW_REQUIRED', 'STALE_VERIFICATION_REVIEW_REQUIRED', 'ATTRIBUTION_REVIEW_REQUIRED', 'PROVENANCE_REVIEW_REQUIRED', 'CERTIFICATION_REVIEW_REQUIRED', 'LINKAGE_REVIEW_REQUIRED', 'CONFLICT_REVIEW_REQUIRED'];
const POSTURES = {
  rights: ['VERIFIED', 'PENDING', 'UNKNOWN', 'RESTRICTED'],
  technicalAccess: ['READY', 'PENDING', 'BLOCKED', 'UNKNOWN'],
  freshness: ['VERIFIED_CURRENT', 'STALE_VERIFICATION', 'UNKNOWN', 'DOMAIN_SPECIFIC'],
  attribution: ['NONE_DOCUMENTED', 'REQUIRED', 'REQUIRED_PENDING_CONFIRMATION', 'UNKNOWN'],
  provenance: ['COMPLETE', 'PARTIAL', 'INCOMPLETE', 'UNKNOWN'],
  certification: ['REFERENCED', 'ABSENT', 'UNVERIFIED'],
  linkage: ['VERIFIED', 'PENDING', 'UNKNOWN', 'UNVERIFIED'],
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  return Object.keys(value).every((key) => keys.includes(key)) && keys.every((key) => key in value);
}

function validId(value: unknown): value is string {
  return typeof value === 'string' && ID_PATTERN.test(value);
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

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

function allStrings(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function validSummary(value: unknown): value is SourceQualityReviewSummary {
  if (!isRecord(value) || !exactKeys(value, SUMMARY_KEYS) || value.schemaVersion !== 'REIE_SOURCE_QUALITY_CONTROL_SUMMARY_V1' || !CLASSIFICATIONS.includes(value.classification as SourceQualitySummaryClassification)) return false;
  if (!isRecord(value.source) || !exactKeys(value.source, SOURCE_KEYS) || !validId(value.source.sourceId) || value.source.coverage !== 'NOT_EXPOSED_BY_CANONICAL_NORMALIZATION' || typeof value.source.sourceClass !== 'string' || typeof value.source.responsibleOrganization !== 'string' || typeof value.source.declaredActivationPosture !== 'string' || typeof value.source.permittedUse !== 'string' || typeof value.source.canonicalClaimEligible !== 'boolean' || typeof value.source.canonicalCustomerDisclosureEligible !== 'boolean' || !allStrings(value.source.sourcePaths) || typeof value.source.freshnessExpectation !== 'string' || typeof value.source.lastSourceVerificationDate !== 'string' || (value.source.lastSuccessfulDataRefresh !== null && typeof value.source.lastSuccessfulDataRefresh !== 'string')) return false;
  if (!isRecord(value.normalizedPostures) || !exactKeys(value.normalizedPostures, POSTURE_KEYS)) return false;
  for (const dimension of Object.keys(POSTURES) as Array<keyof typeof POSTURES>) {
    if (!POSTURES[dimension].includes(value.normalizedPostures[dimension] as never)) return false;
  }
  if (!['NORMALIZED', 'INSUFFICIENT_EVIDENCE', 'CONFLICT_REQUIRES_REVIEW', 'INVALID_LINKAGE'].includes(String(value.normalizedPostures.normalizationResult))) return false;
  if (!allStrings(value.limitationCodes) || !value.limitationCodes.every(validId) || !allStrings(value.evidenceReferenceIds) || !value.evidenceReferenceIds.every(validId) || !allStrings(value.certificationReferenceIds) || !value.certificationReferenceIds.every(validId) || !Array.isArray(value.humanReviewReasons) || !value.humanReviewReasons.every((reason) => REVIEW_REASONS.includes(reason))) return false;
  if (!Array.isArray(value.conflictReferences) || !value.conflictReferences.every((reference) => isRecord(reference) && exactKeys(reference, ['relationshipType', 'postures', 'evidenceReferenceIds']) && typeof reference.relationshipType === 'string' && allStrings(reference.postures) && allStrings(reference.evidenceReferenceIds) && reference.evidenceReferenceIds.every(validId))) return false;
  if (!isRecord(value.activationFirewall) || !exactKeys(value.activationFirewall, FIREWALL_KEYS) || value.activationFirewall.sourceActivation !== 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_THIS_SUMMARY' || value.activationFirewall.executiveReview !== 'EXECUTIVE_REVIEW_REQUIRED_FOR_ACTIVATION' || value.activationFirewall.customerDisplayAuthority !== 'NOT_GRANTED_BY_THIS_SUMMARY' || !validId(value.summaryFingerprint)) return false;
  return true;
}

function emptyCounts(values: readonly string[]): Record<string, number> {
  return Object.fromEntries(values.map((value) => [value, 0]));
}

function increment(counts: Record<string, number>, value: string) {
  counts[value] = (counts[value] ?? 0) + 1;
}

function referenceIndex(summaries: readonly SourceQualityReviewSummary[], field: 'evidenceReferenceIds' | 'certificationReferenceIds'): Record<string, readonly string[]> {
  const index: Record<string, string[]> = {};
  for (const summary of summaries) {
    for (const referenceId of summary[field]) (index[referenceId] ??= []).push(summary.source.sourceId);
  }
  return Object.fromEntries(Object.entries(index).sort(([left], [right]) => left.localeCompare(right)).map(([referenceId, sourceIds]) => [referenceId, uniqueSorted(sourceIds)]));
}

function reportClassification(summaries: readonly SourceQualityReviewSummary[]): SourceQualityReportClassification {
  if (summaries.some((summary) => summary.classification === 'INVALID_SOURCE_EVIDENCE')) return 'REPORT_HAS_INVALID_SOURCE_EVIDENCE';
  if (summaries.some((summary) => summary.classification === 'CONFLICT_REQUIRES_REVIEW')) return 'REPORT_HAS_CONFLICTS';
  return summaries.some((summary) => summary.classification !== 'REVIEW_POSTURE_COMPLETE') ? 'REPORT_REVIEW_REQUIRED' : 'REPORT_REVIEW_POSTURE_COMPLETE';
}

function fail(...reasons: readonly SourceQualityReportFailureReason[]): SourceQualityReportResult {
  return { classification: 'FAIL_CLOSED', report: null, reasons: [...new Set(reasons)].sort() };
}

export function composeSourceQualityReport(input: unknown): SourceQualityReportResult {
  if (!Array.isArray(input)) return fail('INVALID_REPORT_INPUT');
  if (!input.every(validSummary)) return fail('MALFORMED_SOURCE_QUALITY_SUMMARY');
  const summaries = [...input] as SourceQualityReviewSummary[];
  const sourceIds = summaries.map((summary) => summary.source.sourceId);
  if (new Set(sourceIds).size !== sourceIds.length) return fail('DUPLICATE_SOURCE_ID');
  summaries.sort((left, right) => left.source.sourceId.localeCompare(right.source.sourceId));

  const classificationCounts = emptyCounts(CLASSIFICATIONS) as Record<SourceQualitySummaryClassification, number>;
  const dimensionPostureCounts = {
    rights: emptyCounts(POSTURES.rights),
    technicalAccess: emptyCounts(POSTURES.technicalAccess),
    freshness: emptyCounts(POSTURES.freshness),
    attribution: emptyCounts(POSTURES.attribution),
    provenance: emptyCounts(POSTURES.provenance),
    certification: emptyCounts(POSTURES.certification),
    linkage: emptyCounts(POSTURES.linkage),
  };
  const limitationCodeCounts: Record<string, number> = {};
  const humanReviewReasonCounts = emptyCounts(REVIEW_REASONS) as Record<SourceQualityHumanReviewReason, number>;
  for (const summary of summaries) {
    increment(classificationCounts, summary.classification);
    increment(dimensionPostureCounts.rights, summary.normalizedPostures.rights);
    increment(dimensionPostureCounts.technicalAccess, summary.normalizedPostures.technicalAccess);
    increment(dimensionPostureCounts.freshness, summary.normalizedPostures.freshness);
    increment(dimensionPostureCounts.attribution, summary.normalizedPostures.attribution);
    increment(dimensionPostureCounts.provenance, summary.normalizedPostures.provenance);
    increment(dimensionPostureCounts.certification, summary.normalizedPostures.certification);
    increment(dimensionPostureCounts.linkage, summary.normalizedPostures.linkage);
    for (const code of summary.limitationCodes) increment(limitationCodeCounts, code);
    for (const reason of summary.humanReviewReasons) increment(humanReviewReasonCounts, reason);
  }
  const reviewRequiredSources = summaries.filter((summary) => summary.classification !== 'REVIEW_POSTURE_COMPLETE').map((summary) => ({
    sourceId: summary.source.sourceId,
    classification: summary.classification,
    humanReviewReasons: uniqueSorted(summary.humanReviewReasons) as SourceQualityHumanReviewReason[],
    limitationCodes: uniqueSorted(summary.limitationCodes),
    evidenceReferenceIds: uniqueSorted(summary.evidenceReferenceIds),
    certificationReferenceIds: uniqueSorted(summary.certificationReferenceIds),
  }));
  const conflictSources = summaries.filter((summary) => summary.classification === 'CONFLICT_REQUIRES_REVIEW').map((summary) => ({ sourceId: summary.source.sourceId, conflictReferences: summary.conflictReferences }));
  const reportBasis = {
    schemaVersion: SOURCE_QUALITY_REPORT_SCHEMA_VERSION,
    classification: reportClassification(summaries),
    summaries: summaries.map((summary) => ({ sourceId: summary.source.sourceId, summaryFingerprint: summary.summaryFingerprint })),
    classificationCounts,
    dimensionPostureCounts,
    limitationCodeCounts,
    humanReviewReasonCounts,
  };
  const report: SourceQualityReport = {
    schemaVersion: SOURCE_QUALITY_REPORT_SCHEMA_VERSION,
    classification: reportBasis.classification,
    suppliedDatasetScope: 'SUPPLIED_SUMMARIES_ONLY',
    sourceCount: summaries.length,
    sourceOrder: summaries.map((summary) => summary.source.sourceId),
    classificationCounts,
    reviewRequiredSources,
    conflictSources,
    insufficientEvidenceSources: summaries.filter((summary) => summary.classification === 'INSUFFICIENT_EVIDENCE').map((summary) => summary.source.sourceId),
    invalidSourceEvidenceSources: summaries.filter((summary) => summary.classification === 'INVALID_SOURCE_EVIDENCE').map((summary) => summary.source.sourceId),
    dimensionPostureCounts,
    limitationCodeCounts: Object.fromEntries(Object.entries(limitationCodeCounts).sort(([left], [right]) => left.localeCompare(right))),
    humanReviewReasonCounts,
    evidenceReferenceIndex: referenceIndex(summaries, 'evidenceReferenceIds'),
    certificationReferenceIndex: referenceIndex(summaries, 'certificationReferenceIds'),
    activationFirewall: {
      sourceActivation: 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_THIS_REPORT',
      executiveReview: 'EXECUTIVE_REVIEW_REQUIRED_FOR_ACTIVATION',
      customerDisplayAuthority: 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_THIS_REPORT',
    },
    reportFingerprint: 'source-quality-report:v1:' + hash(stable(reportBasis)),
  };
  return { classification: report.classification, report, reasons: [] };
}

export function renderSourceQualityReportMarkdown(report: SourceQualityReport): string {
  const lines = [
    '# PROJECT ATLAS™ — SOURCE QUALITY REVIEW REPORT',
    '',
    'Report posture: ' + report.classification,
    'Supplied dataset scope: ' + report.suppliedDatasetScope,
    'Source count: ' + report.sourceCount,
    '',
    '## Review classification counts',
    ...Object.entries(report.classificationCounts).map(([classification, count]) => '- ' + classification + ': ' + count),
    '',
    '## Sources requiring review',
    ...(report.reviewRequiredSources.length === 0 ? ['- None'] : report.reviewRequiredSources.map((entry) => '- ' + entry.sourceId + ': ' + entry.classification + '; reasons=' + entry.humanReviewReasons.join(',') + '; limitations=' + entry.limitationCodes.join(','))),
    '',
    '## Conflicts',
    ...(report.conflictSources.length === 0 ? ['- None'] : report.conflictSources.map((entry) => '- ' + entry.sourceId + ': ' + entry.conflictReferences.map((reference) => reference.relationshipType + ':' + reference.evidenceReferenceIds.join(',')).join(';'))),
    '',
    '## Evidence-dimension summary',
    ...Object.entries(report.dimensionPostureCounts).flatMap(([dimension, counts]) => ['- ' + dimension + ':', ...Object.entries(counts).map(([posture, count]) => '  - ' + posture + ': ' + count)]),
    '',
    '## Limitation summary',
    ...(Object.keys(report.limitationCodeCounts).length === 0 ? ['- None'] : Object.entries(report.limitationCodeCounts).map(([code, count]) => '- ' + code + ': ' + count)),
    '',
    '## Evidence references',
    ...(Object.keys(report.evidenceReferenceIndex).length === 0 ? ['- None'] : Object.entries(report.evidenceReferenceIndex).map(([referenceId, sourceIds]) => '- ' + referenceId + ': ' + sourceIds.join(','))),
    '',
    '## Certification references',
    ...(Object.keys(report.certificationReferenceIndex).length === 0 ? ['- None'] : Object.entries(report.certificationReferenceIndex).map(([referenceId, sourceIds]) => '- ' + referenceId + ': ' + sourceIds.join(','))),
    '',
    '## Firewalls',
    '- ' + report.activationFirewall.sourceActivation,
    '- ' + report.activationFirewall.executiveReview,
    '- ' + report.activationFirewall.customerDisplayAuthority,
    '',
    'Report fingerprint: ' + report.reportFingerprint,
  ];
  return lines.join('\n');
}
