import type {
  ConfidenceLevel,
  FreshnessState,
  SourceAvailability,
} from '../enterprise-kpi/types.js';
import {
  buildEoiOperationalKpiReport,
  EOI_OPERATIONAL_KPI_REPORTING_CONTRACT_VERSION,
  type EoiOperationalKpiReport,
  type EoiReportingClassification,
} from './operationalKpiReportingContract.js';

export const EOI_EXECUTIVE_OPERATIONAL_SUMMARY_CONTRACT_VERSION = 'EOI-1.0-SPRINT-2';

export type EoiExecutiveOperationalSummarySectionIdentifier =
  | 'EOI-SUMMARY-EXECUTIVE-OVERVIEW'
  | 'EOI-SUMMARY-OPERATIONAL-CONTEXT'
  | 'EOI-SUMMARY-KPI-COVERAGE'
  | 'EOI-SUMMARY-CONFIDENCE-ASSESSMENT'
  | 'EOI-SUMMARY-FRESHNESS-ASSESSMENT'
  | 'EOI-SUMMARY-HUMAN-REVIEW-REQUIRED'
  | 'EOI-SUMMARY-GOVERNANCE-NOTES'
  | 'EOI-SUMMARY-RECOMMENDED-ATTENTION-AREAS'
  | 'EOI-SUMMARY-DEFERRED-INTERPRETATION'
  | 'EOI-SUMMARY-EVIDENCE-PROVENANCE';

export type EoiExecutiveSummaryEvidenceClassification =
  | 'GOVERNED_FACT'
  | 'GOVERNED_METADATA'
  | 'HUMAN_INTERPRETATION'
  | 'DEFERRED_ANALYSIS';

export type EoiExecutiveSummaryInterpretationBoundary =
  | 'FACT_ONLY'
  | 'METADATA_ONLY'
  | 'HUMAN_REVIEW_REQUIRED'
  | 'DEFERRED_UNTIL_SOURCE_EVIDENCE';

export type EoiExecutiveOperationalSummarySection = {
  identifier: EoiExecutiveOperationalSummarySectionIdentifier;
  displayName: string;
  purpose: string;
  governingSource: typeof EOI_OPERATIONAL_KPI_REPORTING_CONTRACT_VERSION | 'CAO_GOVERNANCE' | 'CIM_GOVERNANCE' | 'ENTERPRISE_EXECUTIVE_WORKSPACE';
  owner: 'OPERATIONS_LEAD' | 'BROKER_REVIEW' | 'EXECUTIVE_REVIEW';
  confidenceClassification: ConfidenceLevel;
  freshnessClassification: FreshnessState;
  evidenceClassification: EoiExecutiveSummaryEvidenceClassification;
  interpretationBoundary: EoiExecutiveSummaryInterpretationBoundary;
  summaryPoints: string[];
};

export type EoiExecutiveOperationalSummaryPayload = {
  contractVersion: typeof EOI_EXECUTIVE_OPERATIONAL_SUMMARY_CONTRACT_VERSION;
  sourceReportVersion: typeof EOI_OPERATIONAL_KPI_REPORTING_CONTRACT_VERSION;
  generatedFrom: 'GOVERNED_OPERATIONAL_KPI_METADATA';
  access: 'PROTECTED_ADMIN';
  readOnly: true;
  liveKpiComputationAuthorized: false;
  automationAuthorized: false;
  telemetryAuthorized: false;
  persistenceAuthorized: false;
  mutationAuthorized: false;
  sourceReport: {
    generatedFrom: EoiOperationalKpiReport['generatedFrom'];
    definitionCount: number;
    observationCount: number;
    liveObservationCount: number;
    definedOnlyObservationCount: number;
    reportingClassifications: Record<EoiReportingClassification, number>;
    sourceAvailability: Record<SourceAvailability, number>;
  };
  sections: EoiExecutiveOperationalSummarySection[];
  boundaries: string[];
};

export type EoiExecutiveOperationalSummaryValidationResult = {
  valid: boolean;
  issues: string[];
};

export const eoiExecutiveOperationalSummarySectionIdentifiers: EoiExecutiveOperationalSummarySectionIdentifier[] = [
  'EOI-SUMMARY-EXECUTIVE-OVERVIEW',
  'EOI-SUMMARY-OPERATIONAL-CONTEXT',
  'EOI-SUMMARY-KPI-COVERAGE',
  'EOI-SUMMARY-CONFIDENCE-ASSESSMENT',
  'EOI-SUMMARY-FRESHNESS-ASSESSMENT',
  'EOI-SUMMARY-HUMAN-REVIEW-REQUIRED',
  'EOI-SUMMARY-GOVERNANCE-NOTES',
  'EOI-SUMMARY-RECOMMENDED-ATTENTION-AREAS',
  'EOI-SUMMARY-DEFERRED-INTERPRETATION',
  'EOI-SUMMARY-EVIDENCE-PROVENANCE',
];

export function buildEoiExecutiveOperationalSummary(): EoiExecutiveOperationalSummaryPayload {
  const sourceReport = buildEoiOperationalKpiReport();
  const sourceSummary = summarizeSourceReport(sourceReport);

  return {
    contractVersion: EOI_EXECUTIVE_OPERATIONAL_SUMMARY_CONTRACT_VERSION,
    sourceReportVersion: EOI_OPERATIONAL_KPI_REPORTING_CONTRACT_VERSION,
    generatedFrom: 'GOVERNED_OPERATIONAL_KPI_METADATA',
    access: 'PROTECTED_ADMIN',
    readOnly: true,
    liveKpiComputationAuthorized: false,
    automationAuthorized: false,
    telemetryAuthorized: false,
    persistenceAuthorized: false,
    mutationAuthorized: false,
    sourceReport: sourceSummary,
    sections: buildSections(sourceSummary),
    boundaries: [
      'Executive operational summaries are derived from governed metadata only.',
      'Live operational KPI computation is not authorized.',
      'CRM automation and workflow automation are not authorized.',
      'No database, persistence, telemetry, AI, GIS, provider, notification, email, alert, or production mutation behavior is authorized.',
      'Human review remains required before operational decisions, staffing changes, automation decisions, or customer-impacting actions.',
    ],
  };
}

export function validateEoiExecutiveOperationalSummaryContract(input: {
  sections?: readonly EoiExecutiveOperationalSummarySection[];
} = {}): EoiExecutiveOperationalSummaryValidationResult {
  const sections = input.sections ?? buildEoiExecutiveOperationalSummary().sections;
  const issues: string[] = [];
  const identifiers = new Set<EoiExecutiveOperationalSummarySectionIdentifier>();

  for (const expected of eoiExecutiveOperationalSummarySectionIdentifiers) {
    if (!sections.some((section) => section.identifier === expected)) {
      issues.push(`Missing executive operational summary section ${expected}.`);
    }
  }

  for (const section of sections) {
    if (identifiers.has(section.identifier)) {
      issues.push(`Duplicate executive operational summary section ${section.identifier}.`);
    }
    identifiers.add(section.identifier);
    if (!section.displayName) issues.push(`Summary section ${section.identifier} is missing display name.`);
    if (!section.purpose) issues.push(`Summary section ${section.identifier} is missing purpose.`);
    if (!section.governingSource) issues.push(`Summary section ${section.identifier} is missing governing source.`);
    if (!section.owner) issues.push(`Summary section ${section.identifier} is missing owner.`);
    if (!section.confidenceClassification) issues.push(`Summary section ${section.identifier} is missing confidence classification.`);
    if (!section.freshnessClassification) issues.push(`Summary section ${section.identifier} is missing freshness classification.`);
    if (!section.evidenceClassification) issues.push(`Summary section ${section.identifier} is missing evidence classification.`);
    if (!section.interpretationBoundary) issues.push(`Summary section ${section.identifier} is missing interpretation boundary.`);
    if (!section.summaryPoints.length) issues.push(`Summary section ${section.identifier} is missing summary points.`);
  }

  const payload = buildEoiExecutiveOperationalSummary();
  if (payload.liveKpiComputationAuthorized !== false) issues.push('Live KPI computation must remain unauthorized.');
  if (payload.automationAuthorized !== false) issues.push('Automation must remain unauthorized.');
  if (payload.telemetryAuthorized !== false) issues.push('Telemetry must remain unauthorized.');
  if (payload.persistenceAuthorized !== false) issues.push('Persistence must remain unauthorized.');
  if (payload.mutationAuthorized !== false) issues.push('Mutation must remain unauthorized.');
  if (payload.sourceReport.generatedFrom !== 'GOVERNED_CONTRACTS') {
    issues.push('Executive summary must use governed contract metadata rather than live evidence input.');
  }
  if (payload.sourceReport.liveObservationCount !== 0) {
    issues.push('Executive summary must not include live operational observations.');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

function summarizeSourceReport(sourceReport: EoiOperationalKpiReport): EoiExecutiveOperationalSummaryPayload['sourceReport'] {
  const reportingClassifications = {
    PROTECTED_ADMIN_READ_ONLY: 0,
    GOVERNED_OPERATIONAL_SUMMARY: 0,
    DEFINED_PENDING_SOURCE_EVIDENCE: 0,
  } satisfies Record<EoiReportingClassification, number>;
  const sourceAvailability = {
    LIVE_AVAILABLE: 0,
    FIXTURE_AVAILABLE: 0,
    DEFINED_BUT_UNAVAILABLE: 0,
  } satisfies Record<SourceAvailability, number>;

  for (const definition of sourceReport.definitions) {
    reportingClassifications[definition.reportingClassification] += 1;
    sourceAvailability[definition.sourceAvailability] += 1;
  }

  return {
    generatedFrom: sourceReport.generatedFrom,
    definitionCount: sourceReport.definitions.length,
    observationCount: sourceReport.observations.length,
    liveObservationCount: sourceReport.observations.filter((observation) => observation.sourceAvailability === 'LIVE_AVAILABLE').length,
    definedOnlyObservationCount: sourceReport.observations.filter((observation) => observation.value === null).length,
    reportingClassifications,
    sourceAvailability,
  };
}

function buildSections(
  sourceReport: EoiExecutiveOperationalSummaryPayload['sourceReport'],
): EoiExecutiveOperationalSummarySection[] {
  return [
    section(
      'EOI-SUMMARY-EXECUTIVE-OVERVIEW',
      'Executive Overview',
      'Summarize the current executive-operational posture without claiming live performance.',
      'EOI-1.0-SPRINT-1',
      'EXECUTIVE_REVIEW',
      'MEDIUM',
      'UNKNOWN',
      'GOVERNED_METADATA',
      'METADATA_ONLY',
      [
        `EOI has ${sourceReport.definitionCount} governed operational KPI definitions available for protected executive review.`,
        'The summary layer is derived from governed metadata and does not calculate live performance.',
      ],
    ),
    section(
      'EOI-SUMMARY-OPERATIONAL-CONTEXT',
      'Operational Context',
      'Explain the CAO and EOI governance context behind the operational summary.',
      'CAO_GOVERNANCE',
      'OPERATIONS_LEAD',
      'MEDIUM',
      'UNKNOWN',
      'GOVERNED_FACT',
      'FACT_ONLY',
      [
        'CAO remains the owner of operating definitions, lifecycles, consultation outcomes, lead dispositions, ownership, and service-level governance.',
        'EOI summarizes operational intelligence but does not automate operations.',
      ],
    ),
    section(
      'EOI-SUMMARY-KPI-COVERAGE',
      'KPI Coverage',
      'Describe the breadth and evidence state of the operational KPI baseline.',
      'EOI-1.0-SPRINT-1',
      'EXECUTIVE_REVIEW',
      'MEDIUM',
      'UNKNOWN',
      'GOVERNED_METADATA',
      'METADATA_ONLY',
      [
        `${sourceReport.observationCount} KPI observations are represented as governed metadata records.`,
        `${sourceReport.definedOnlyObservationCount} observations remain defined-only until a separately authorized read model is supplied.`,
      ],
    ),
    section(
      'EOI-SUMMARY-CONFIDENCE-ASSESSMENT',
      'Confidence Assessment',
      'Clarify confidence limits for executive interpretation.',
      'ENTERPRISE_EXECUTIVE_WORKSPACE',
      'EXECUTIVE_REVIEW',
      'LOW',
      'UNKNOWN',
      'HUMAN_INTERPRETATION',
      'HUMAN_REVIEW_REQUIRED',
      [
        'Confidence supports governance readiness, not live operational performance certification.',
        'Human review is required before using the summary for staffing, automation, or customer-impacting decisions.',
      ],
    ),
    section(
      'EOI-SUMMARY-FRESHNESS-ASSESSMENT',
      'Freshness Assessment',
      'Clarify freshness limits for defined-only operational KPI metadata.',
      'EOI-1.0-SPRINT-1',
      'EXECUTIVE_REVIEW',
      'LOW',
      'UNKNOWN',
      'GOVERNED_METADATA',
      'DEFERRED_UNTIL_SOURCE_EVIDENCE',
      [
        'Freshness remains unknown for live operational performance because no live operational source is bound.',
        'Source freshness must be governed before trend or risk analysis is introduced.',
      ],
    ),
    section(
      'EOI-SUMMARY-HUMAN-REVIEW-REQUIRED',
      'Human Review Required',
      'Identify where executive or operations review must remain in the loop.',
      'CAO_GOVERNANCE',
      'BROKER_REVIEW',
      'MEDIUM',
      'UNKNOWN',
      'HUMAN_INTERPRETATION',
      'HUMAN_REVIEW_REQUIRED',
      [
        'Operational decisions remain human-owned under CAO governance.',
        'EOI summaries are advisory metadata and do not create, assign, route, close, or escalate work.',
      ],
    ),
    section(
      'EOI-SUMMARY-GOVERNANCE-NOTES',
      'Governance Notes',
      'Preserve the no-automation and no-activation boundaries in executive language.',
      'CIM_GOVERNANCE',
      'EXECUTIVE_REVIEW',
      'HIGH',
      'UNKNOWN',
      'GOVERNED_FACT',
      'FACT_ONLY',
      [
        'CIM measurement remains inactive and fail-closed.',
        'Telemetry, persistence, AI, GIS, provider activation, notifications, email, alerts, and production mutation remain unauthorized.',
      ],
    ),
    section(
      'EOI-SUMMARY-RECOMMENDED-ATTENTION-AREAS',
      'Recommended Attention Areas',
      'Surface safe human-review focus areas without scoring operational risk.',
      'ENTERPRISE_EXECUTIVE_WORKSPACE',
      'EXECUTIVE_REVIEW',
      'MEDIUM',
      'UNKNOWN',
      'HUMAN_INTERPRETATION',
      'HUMAN_REVIEW_REQUIRED',
      [
        'Review defined-only KPI coverage before authorizing dashboard, trend, risk, or source-binding work.',
        'Review queue health and SLA health semantics before live KPI computation is authorized.',
      ],
    ),
    section(
      'EOI-SUMMARY-DEFERRED-INTERPRETATION',
      'Deferred Interpretation',
      'List operational interpretations that must wait for separate authorization.',
      'EOI-1.0-SPRINT-1',
      'EXECUTIVE_REVIEW',
      'HIGH',
      'UNKNOWN',
      'DEFERRED_ANALYSIS',
      'DEFERRED_UNTIL_SOURCE_EVIDENCE',
      [
        'Trend reporting, risk detection, opportunity detection, decision support, and dashboard expansion remain deferred.',
        'Live KPI computation remains deferred until a read-only source binding is explicitly authorized.',
      ],
    ),
    section(
      'EOI-SUMMARY-EVIDENCE-PROVENANCE',
      'Evidence Provenance',
      'Identify the provenance of the summary layer and its limitations.',
      'EOI-1.0-SPRINT-1',
      'EXECUTIVE_REVIEW',
      'MEDIUM',
      'UNKNOWN',
      'GOVERNED_METADATA',
      'METADATA_ONLY',
      [
        `Source report version: ${EOI_OPERATIONAL_KPI_REPORTING_CONTRACT_VERSION}.`,
        `Source report generated from: ${sourceReport.generatedFrom}.`,
      ],
    ),
  ];
}

function section(
  identifier: EoiExecutiveOperationalSummarySectionIdentifier,
  displayName: string,
  purpose: string,
  governingSource: EoiExecutiveOperationalSummarySection['governingSource'],
  owner: EoiExecutiveOperationalSummarySection['owner'],
  confidenceClassification: ConfidenceLevel,
  freshnessClassification: FreshnessState,
  evidenceClassification: EoiExecutiveSummaryEvidenceClassification,
  interpretationBoundary: EoiExecutiveSummaryInterpretationBoundary,
  summaryPoints: string[],
): EoiExecutiveOperationalSummarySection {
  return {
    identifier,
    displayName,
    purpose,
    governingSource,
    owner,
    confidenceClassification,
    freshnessClassification,
    evidenceClassification,
    interpretationBoundary,
    summaryPoints,
  };
}
