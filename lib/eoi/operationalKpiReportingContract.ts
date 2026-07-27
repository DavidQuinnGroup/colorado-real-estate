import type {
  AggregationType,
  ConfidenceLevel,
  FreshnessState,
  MeasurementUnit,
  SourceAvailability,
} from '../enterprise-kpi/types.js';
import {
  caoOperationalKpiOwnership,
  type CaoKpiIdentifier,
  type CaoOperationalRole,
} from '../cao/operatingModelContract.js';
import {
  type CaoConsultationOutcome,
  type CaoLeadDisposition,
} from '../cao/consultationWorkflowDispositionContract.js';
import {
  getCaoQueueReadinessSummary,
  type CaoQueueReadinessInput,
  type CaoQueueReadinessSummary,
} from '../cao/operationsQueueReadinessContract.js';

export const EOI_OPERATIONAL_KPI_REPORTING_CONTRACT_VERSION = 'EOI-1.0-SPRINT-1';

export type EoiOperationalKpiIdentifier =
  | 'EOI-KPI-CONSULTATION-VOLUME'
  | 'EOI-KPI-CONSULTATION-COMPLETION-RATE'
  | 'EOI-KPI-CONSULTATION-NO-SHOW-RATE'
  | 'EOI-KPI-LEAD-QUALIFICATION-RATE'
  | 'EOI-KPI-ACTIVE-CLIENT-COUNT'
  | 'EOI-KPI-CLOSED-WON-COUNT'
  | 'EOI-KPI-CLOSED-LOST-COUNT'
  | 'EOI-KPI-FOLLOW-UP-REQUIRED-COUNT'
  | 'EOI-KPI-QUEUE-HEALTH'
  | 'EOI-KPI-SLA-HEALTH';

export type EoiReportingClassification =
  | 'PROTECTED_ADMIN_READ_ONLY'
  | 'GOVERNED_OPERATIONAL_SUMMARY'
  | 'DEFINED_PENDING_SOURCE_EVIDENCE';

export type EoiCalculationSource =
  | 'CAO_CONSULTATION_WORKFLOW_CONTRACT'
  | 'CAO_LEAD_DISPOSITION_CONTRACT'
  | 'CAO_QUEUE_READINESS_CONTRACT'
  | 'CRM_TASK_READ_MODEL'
  | 'ENTERPRISE_KPI_FRAMEWORK';

export type EoiOperationalEvidence = CaoQueueReadinessInput & {
  consultationOutcome?: CaoConsultationOutcome | null;
  leadDisposition?: CaoLeadDisposition | null;
};

export type EoiOperationalKpiDefinition = {
  identifier: EoiOperationalKpiIdentifier;
  displayName: string;
  businessDefinition: string;
  governingSource: CaoKpiIdentifier;
  owner: CaoOperationalRole;
  calculationSource: EoiCalculationSource;
  unit: MeasurementUnit;
  aggregation: AggregationType;
  confidence: ConfidenceLevel;
  freshness: FreshnessState;
  sourceAvailability: SourceAvailability;
  reportingClassification: EoiReportingClassification;
  automationAuthorized: false;
  telemetryAuthorized: false;
  persistenceAuthorized: false;
};

export type EoiOperationalKpiObservation = {
  identifier: EoiOperationalKpiIdentifier;
  value: number | null;
  sourceAvailability: SourceAvailability;
  confidence: ConfidenceLevel;
  freshness: FreshnessState;
  note: string;
};

export type EoiOperationalKpiReport = {
  contractVersion: typeof EOI_OPERATIONAL_KPI_REPORTING_CONTRACT_VERSION;
  generatedFrom: 'GOVERNED_CONTRACTS' | 'READ_ONLY_EVIDENCE_INPUT';
  access: 'PROTECTED_ADMIN';
  readOnly: true;
  automationAuthorized: false;
  telemetryAuthorized: false;
  persistenceAuthorized: false;
  definitions: EoiOperationalKpiDefinition[];
  observations: EoiOperationalKpiObservation[];
  queueSummary: CaoQueueReadinessSummary | null;
  limitations: string[];
};

export type EoiOperationalKpiReportingValidationResult = {
  valid: boolean;
  issues: string[];
};

export const eoiOperationalKpiIdentifiers: EoiOperationalKpiIdentifier[] = [
  'EOI-KPI-CONSULTATION-VOLUME',
  'EOI-KPI-CONSULTATION-COMPLETION-RATE',
  'EOI-KPI-CONSULTATION-NO-SHOW-RATE',
  'EOI-KPI-LEAD-QUALIFICATION-RATE',
  'EOI-KPI-ACTIVE-CLIENT-COUNT',
  'EOI-KPI-CLOSED-WON-COUNT',
  'EOI-KPI-CLOSED-LOST-COUNT',
  'EOI-KPI-FOLLOW-UP-REQUIRED-COUNT',
  'EOI-KPI-QUEUE-HEALTH',
  'EOI-KPI-SLA-HEALTH',
];

export const eoiOperationalKpiDefinitions: EoiOperationalKpiDefinition[] = [
  kpi('EOI-KPI-CONSULTATION-VOLUME', 'Consultation Volume', 'Count of governed buyer and seller consultation outcomes available for executive review.', 'CAO-KPI-CONSULTATION-SCHEDULING', 'CAO_CONSULTATION_WORKFLOW_CONTRACT', 'COUNT', 'COUNT', 'MEDIUM', 'UNKNOWN', 'DEFINED_BUT_UNAVAILABLE', 'DEFINED_PENDING_SOURCE_EVIDENCE'),
  kpi('EOI-KPI-CONSULTATION-COMPLETION-RATE', 'Consultation Completion Rate', 'Completed consultations divided by scheduled or completed consultation outcomes when read-only evidence is supplied.', 'CAO-KPI-CONSULTATION-COMPLETION', 'CAO_CONSULTATION_WORKFLOW_CONTRACT', 'PERCENT', 'RATE', 'MEDIUM', 'UNKNOWN', 'DEFINED_BUT_UNAVAILABLE', 'DEFINED_PENDING_SOURCE_EVIDENCE'),
  kpi('EOI-KPI-CONSULTATION-NO-SHOW-RATE', 'Consultation No-Show Rate', 'No-show outcomes divided by scheduled or completed consultation outcomes when read-only evidence is supplied.', 'CAO-KPI-CONSULTATION-COMPLETION', 'CAO_CONSULTATION_WORKFLOW_CONTRACT', 'PERCENT', 'RATE', 'MEDIUM', 'UNKNOWN', 'DEFINED_BUT_UNAVAILABLE', 'DEFINED_PENDING_SOURCE_EVIDENCE'),
  kpi('EOI-KPI-LEAD-QUALIFICATION-RATE', 'Lead Qualification Rate', 'Qualified, active, won, or nurture dispositions divided by governed lead dispositions when read-only evidence is supplied.', 'CAO-KPI-LEAD-DISPOSITION', 'CAO_LEAD_DISPOSITION_CONTRACT', 'PERCENT', 'RATE', 'MEDIUM', 'UNKNOWN', 'DEFINED_BUT_UNAVAILABLE', 'DEFINED_PENDING_SOURCE_EVIDENCE'),
  kpi('EOI-KPI-ACTIVE-CLIENT-COUNT', 'Active Client Count', 'Count of governed lead dispositions currently classified as active client.', 'CAO-KPI-LEAD-DISPOSITION', 'CAO_LEAD_DISPOSITION_CONTRACT', 'COUNT', 'COUNT', 'MEDIUM', 'UNKNOWN', 'DEFINED_BUT_UNAVAILABLE', 'DEFINED_PENDING_SOURCE_EVIDENCE'),
  kpi('EOI-KPI-CLOSED-WON-COUNT', 'Closed Won Count', 'Count of governed lead dispositions closed as won.', 'CAO-KPI-LEAD-DISPOSITION', 'CAO_LEAD_DISPOSITION_CONTRACT', 'COUNT', 'COUNT', 'MEDIUM', 'UNKNOWN', 'DEFINED_BUT_UNAVAILABLE', 'DEFINED_PENDING_SOURCE_EVIDENCE'),
  kpi('EOI-KPI-CLOSED-LOST-COUNT', 'Closed Lost Count', 'Count of governed lead dispositions closed as lost.', 'CAO-KPI-LEAD-DISPOSITION', 'CAO_LEAD_DISPOSITION_CONTRACT', 'COUNT', 'COUNT', 'MEDIUM', 'UNKNOWN', 'DEFINED_BUT_UNAVAILABLE', 'DEFINED_PENDING_SOURCE_EVIDENCE'),
  kpi('EOI-KPI-FOLLOW-UP-REQUIRED-COUNT', 'Follow-Up Required Count', 'Count of consultation or disposition evidence requiring human follow-up.', 'CAO-KPI-LEAD-DISPOSITION', 'CAO_LEAD_DISPOSITION_CONTRACT', 'COUNT', 'COUNT', 'MEDIUM', 'UNKNOWN', 'DEFINED_BUT_UNAVAILABLE', 'DEFINED_PENDING_SOURCE_EVIDENCE'),
  kpi('EOI-KPI-QUEUE-HEALTH', 'Queue Health', 'Protected summary of CAO queue readiness state for human review.', 'CAO-KPI-SLA-COMPLIANCE', 'CAO_QUEUE_READINESS_CONTRACT', 'COUNT', 'DERIVED', 'HIGH', 'UNKNOWN', 'DEFINED_BUT_UNAVAILABLE', 'GOVERNED_OPERATIONAL_SUMMARY'),
  kpi('EOI-KPI-SLA-HEALTH', 'SLA Health', 'Protected summary of CAO service-level visibility for human review.', 'CAO-KPI-SLA-COMPLIANCE', 'CAO_QUEUE_READINESS_CONTRACT', 'COUNT', 'DERIVED', 'HIGH', 'UNKNOWN', 'DEFINED_BUT_UNAVAILABLE', 'GOVERNED_OPERATIONAL_SUMMARY'),
];

export function buildEoiOperationalKpiReport(
  evidence: readonly EoiOperationalEvidence[] = [],
): EoiOperationalKpiReport {
  const hasEvidence = evidence.length > 0;
  const queueSummary = hasEvidence ? getCaoQueueReadinessSummary(evidence, 'CRM_TASK_LIST') : null;
  const observations = eoiOperationalKpiDefinitions.map((definition) =>
    observeOperationalKpi(definition, evidence, queueSummary),
  );

  return {
    contractVersion: EOI_OPERATIONAL_KPI_REPORTING_CONTRACT_VERSION,
    generatedFrom: hasEvidence ? 'READ_ONLY_EVIDENCE_INPUT' : 'GOVERNED_CONTRACTS',
    access: 'PROTECTED_ADMIN',
    readOnly: true,
    automationAuthorized: false,
    telemetryAuthorized: false,
    persistenceAuthorized: false,
    definitions: eoiOperationalKpiDefinitions,
    observations,
    queueSummary,
    limitations: [
      'This baseline is read-only and protected for administrative review.',
      'No CRM automation, workflow automation, notification, telemetry, persistence, AI, GIS, provider activation, or database mutation is authorized.',
      hasEvidence
        ? 'Observations are derived only from caller-supplied read-only operational evidence.'
        : 'Live operational values are not inferred until a separately authorized read model is supplied.',
    ],
  };
}

export function validateEoiOperationalKpiReportingContract(input: {
  definitions?: readonly EoiOperationalKpiDefinition[];
} = {}): EoiOperationalKpiReportingValidationResult {
  const definitions = input.definitions ?? eoiOperationalKpiDefinitions;
  const issues: string[] = [];
  const ids = new Set<EoiOperationalKpiIdentifier>();

  for (const expected of eoiOperationalKpiIdentifiers) {
    if (!definitions.some((definition) => definition.identifier === expected)) {
      issues.push(`Missing operational KPI definition ${expected}.`);
    }
  }

  for (const definition of definitions) {
    if (ids.has(definition.identifier)) issues.push(`Duplicate operational KPI identifier ${definition.identifier}.`);
    ids.add(definition.identifier);
    if (!definition.displayName) issues.push(`Operational KPI ${definition.identifier} is missing display name.`);
    if (!definition.businessDefinition) issues.push(`Operational KPI ${definition.identifier} is missing business definition.`);
    if (!definition.governingSource) issues.push(`Operational KPI ${definition.identifier} is missing governing source.`);
    if (!definition.owner) issues.push(`Operational KPI ${definition.identifier} is missing governance owner.`);
    if (!definition.calculationSource) issues.push(`Operational KPI ${definition.identifier} is missing calculation source.`);
    if (!definition.confidence) issues.push(`Operational KPI ${definition.identifier} is missing confidence.`);
    if (!definition.freshness) issues.push(`Operational KPI ${definition.identifier} is missing freshness.`);
    if (!definition.reportingClassification) issues.push(`Operational KPI ${definition.identifier} is missing reporting classification.`);
    if (definition.automationAuthorized !== false) issues.push(`Operational KPI ${definition.identifier} must keep automation unauthorized.`);
    if (definition.telemetryAuthorized !== false) issues.push(`Operational KPI ${definition.identifier} must keep telemetry unauthorized.`);
    if (definition.persistenceAuthorized !== false) issues.push(`Operational KPI ${definition.identifier} must keep persistence unauthorized.`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

function kpi(
  identifier: EoiOperationalKpiIdentifier,
  displayName: string,
  businessDefinition: string,
  governingSource: CaoKpiIdentifier,
  calculationSource: EoiCalculationSource,
  unit: MeasurementUnit,
  aggregation: AggregationType,
  confidence: ConfidenceLevel,
  freshness: FreshnessState,
  sourceAvailability: SourceAvailability,
  reportingClassification: EoiReportingClassification,
): EoiOperationalKpiDefinition {
  const owner =
    caoOperationalKpiOwnership.find((item) => item.kpi === governingSource)?.owner || 'OPERATIONS_LEAD';

  return {
    identifier,
    displayName,
    businessDefinition,
    governingSource,
    owner,
    calculationSource,
    unit,
    aggregation,
    confidence,
    freshness,
    sourceAvailability,
    reportingClassification,
    automationAuthorized: false,
    telemetryAuthorized: false,
    persistenceAuthorized: false,
  };
}

function observeOperationalKpi(
  definition: EoiOperationalKpiDefinition,
  evidence: readonly EoiOperationalEvidence[],
  queueSummary: CaoQueueReadinessSummary | null,
): EoiOperationalKpiObservation {
  if (evidence.length === 0) {
    return emptyObservation(definition);
  }

  const value = calculateValue(definition.identifier, evidence, queueSummary);
  return {
    identifier: definition.identifier,
    value,
    sourceAvailability: 'LIVE_AVAILABLE',
    confidence: value === null ? 'INSUFFICIENT' : definition.confidence,
    freshness: value === null ? 'UNKNOWN' : 'FRESH',
    note:
      value === null
        ? 'Read-only evidence was supplied, but the KPI could not be calculated from governed fields.'
        : 'Calculated from caller-supplied read-only operational evidence without persistence or automation.',
  };
}

function emptyObservation(definition: EoiOperationalKpiDefinition): EoiOperationalKpiObservation {
  return {
    identifier: definition.identifier,
    value: null,
    sourceAvailability: definition.sourceAvailability,
    confidence: 'INSUFFICIENT',
    freshness: 'UNKNOWN',
    note: 'Definition is governed; no live operational evidence was supplied or inferred.',
  };
}

function calculateValue(
  identifier: EoiOperationalKpiIdentifier,
  evidence: readonly EoiOperationalEvidence[],
  queueSummary: CaoQueueReadinessSummary | null,
): number | null {
  const consultationOutcomes = evidence.flatMap((item) => (item.consultationOutcome ? [item.consultationOutcome] : []));
  const dispositions = evidence.flatMap((item) => (item.leadDisposition ? [item.leadDisposition] : []));

  switch (identifier) {
    case 'EOI-KPI-CONSULTATION-VOLUME':
      return consultationOutcomes.length;
    case 'EOI-KPI-CONSULTATION-COMPLETION-RATE':
      return percentage(countOutcomes(consultationOutcomes, ['COMPLETED', 'STRATEGY_COMPLETED']), consultationOutcomes.length);
    case 'EOI-KPI-CONSULTATION-NO-SHOW-RATE':
      return percentage(countOutcomes(consultationOutcomes, ['NO_SHOW']), consultationOutcomes.length);
    case 'EOI-KPI-LEAD-QUALIFICATION-RATE':
      return percentage(countDispositions(dispositions, ['QUALIFIED', 'ACTIVE_CLIENT', 'CLOSED_WON', 'NURTURE']), dispositions.length);
    case 'EOI-KPI-ACTIVE-CLIENT-COUNT':
      return countDispositions(dispositions, ['ACTIVE_CLIENT']);
    case 'EOI-KPI-CLOSED-WON-COUNT':
      return countDispositions(dispositions, ['CLOSED_WON']);
    case 'EOI-KPI-CLOSED-LOST-COUNT':
      return countDispositions(dispositions, ['CLOSED_LOST']);
    case 'EOI-KPI-FOLLOW-UP-REQUIRED-COUNT':
      return (
        countOutcomes(consultationOutcomes, ['FOLLOW_UP_REQUIRED', 'RESCHEDULE_REQUIRED']) +
        countDispositions(dispositions, ['WORKING', 'NURTURE'])
      );
    case 'EOI-KPI-QUEUE-HEALTH':
      return queueSummary ? queueSummary.total - queueSummary.reviewIncomplete : null;
    case 'EOI-KPI-SLA-HEALTH':
      return queueSummary ? queueSummary.onTime : null;
    default:
      return null;
  }
}

function countOutcomes(outcomes: readonly CaoConsultationOutcome[], targets: readonly CaoConsultationOutcome[]) {
  return outcomes.filter((outcome) => targets.includes(outcome)).length;
}

function countDispositions(dispositions: readonly CaoLeadDisposition[], targets: readonly CaoLeadDisposition[]) {
  return dispositions.filter((disposition) => targets.includes(disposition)).length;
}

function percentage(numerator: number, denominator: number) {
  if (denominator <= 0) return null;
  return Number(((numerator / denominator) * 100).toFixed(2));
}
