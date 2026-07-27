import type {
  ConfidenceLevel,
  FreshnessState,
} from '../enterprise-kpi/types.js';
import {
  buildEoiExecutiveOperationalSummary,
  EOI_EXECUTIVE_OPERATIONAL_SUMMARY_CONTRACT_VERSION,
  type EoiExecutiveOperationalSummaryPayload,
  type EoiExecutiveSummaryEvidenceClassification,
  type EoiExecutiveSummaryInterpretationBoundary,
} from './executiveOperationalSummaryContract.js';
import {
  buildEoiOperationalKpiReport,
  EOI_OPERATIONAL_KPI_REPORTING_CONTRACT_VERSION,
  type EoiOperationalKpiReport,
} from './operationalKpiReportingContract.js';

export const EOI_OPERATIONAL_DASHBOARD_CONTRACT_VERSION = 'EOI-1.0-SPRINT-3';

export type EoiOperationalDashboardSectionIdentifier =
  | 'EOI-DASHBOARD-EXECUTIVE-OPERATIONAL-OVERVIEW'
  | 'EOI-DASHBOARD-KPI-REGISTRY-SUMMARY'
  | 'EOI-DASHBOARD-EXECUTIVE-SUMMARY-OVERVIEW'
  | 'EOI-DASHBOARD-CONFIDENCE-STATUS'
  | 'EOI-DASHBOARD-FRESHNESS-STATUS'
  | 'EOI-DASHBOARD-EVIDENCE-CLASSIFICATION'
  | 'EOI-DASHBOARD-GOVERNANCE-STATUS'
  | 'EOI-DASHBOARD-INTERPRETATION-BOUNDARIES'
  | 'EOI-DASHBOARD-HUMAN-REVIEW-INDICATORS'
  | 'EOI-DASHBOARD-DEFERRED-CAPABILITY-INDICATORS';

export type EoiOperationalDashboardSource =
  | typeof EOI_OPERATIONAL_KPI_REPORTING_CONTRACT_VERSION
  | typeof EOI_EXECUTIVE_OPERATIONAL_SUMMARY_CONTRACT_VERSION
  | 'CAO_GOVERNANCE'
  | 'CIM_GOVERNANCE'
  | 'EOI_GOVERNANCE';

export type EoiOperationalDashboardOwner =
  | 'EXECUTIVE_REVIEW'
  | 'OPERATIONS_LEAD'
  | 'BROKER_REVIEW'
  | 'GOVERNANCE_REVIEW';

export type EoiOperationalDashboardSection = {
  identifier: EoiOperationalDashboardSectionIdentifier;
  displayName: string;
  purpose: string;
  governingSource: EoiOperationalDashboardSource;
  owner: EoiOperationalDashboardOwner;
  confidence: ConfidenceLevel;
  freshness: FreshnessState;
  evidenceClassification: EoiExecutiveSummaryEvidenceClassification;
  interpretationBoundary: EoiExecutiveSummaryInterpretationBoundary;
  displayItems: string[];
};

export type EoiOperationalDashboardPayload = {
  contractVersion: typeof EOI_OPERATIONAL_DASHBOARD_CONTRACT_VERSION;
  sourceKpiContractVersion: typeof EOI_OPERATIONAL_KPI_REPORTING_CONTRACT_VERSION;
  sourceSummaryContractVersion: typeof EOI_EXECUTIVE_OPERATIONAL_SUMMARY_CONTRACT_VERSION;
  generatedFrom: 'GOVERNED_METADATA_ONLY';
  access: 'PROTECTED_ADMIN';
  readOnly: true;
  liveKpiComputationAuthorized: false;
  trendAnalysisAuthorized: false;
  analyticsAuthorized: false;
  automationAuthorized: false;
  telemetryAuthorized: false;
  persistenceAuthorized: false;
  mutationAuthorized: false;
  labels: readonly [
    'READ-ONLY',
    'GOVERNED METADATA',
    'NO LIVE KPI COMPUTATION',
    'NO TREND ANALYSIS',
    'NO OPERATIONAL AUTOMATION',
  ];
  sourceMetadata: {
    kpiDefinitionCount: number;
    summarySectionCount: number;
    liveObservationCount: number;
    generatedFromKpiReport: EoiOperationalKpiReport['generatedFrom'];
    generatedFromSummary: EoiExecutiveOperationalSummaryPayload['generatedFrom'];
  };
  sections: EoiOperationalDashboardSection[];
  boundaries: string[];
};

export type EoiOperationalDashboardValidationResult = {
  valid: boolean;
  issues: string[];
};

export const eoiOperationalDashboardSectionIdentifiers: EoiOperationalDashboardSectionIdentifier[] = [
  'EOI-DASHBOARD-EXECUTIVE-OPERATIONAL-OVERVIEW',
  'EOI-DASHBOARD-KPI-REGISTRY-SUMMARY',
  'EOI-DASHBOARD-EXECUTIVE-SUMMARY-OVERVIEW',
  'EOI-DASHBOARD-CONFIDENCE-STATUS',
  'EOI-DASHBOARD-FRESHNESS-STATUS',
  'EOI-DASHBOARD-EVIDENCE-CLASSIFICATION',
  'EOI-DASHBOARD-GOVERNANCE-STATUS',
  'EOI-DASHBOARD-INTERPRETATION-BOUNDARIES',
  'EOI-DASHBOARD-HUMAN-REVIEW-INDICATORS',
  'EOI-DASHBOARD-DEFERRED-CAPABILITY-INDICATORS',
];

export const eoiOperationalDashboardLabels = [
  'READ-ONLY',
  'GOVERNED METADATA',
  'NO LIVE KPI COMPUTATION',
  'NO TREND ANALYSIS',
  'NO OPERATIONAL AUTOMATION',
] as const;

export function buildEoiOperationalDashboard(): EoiOperationalDashboardPayload {
  const kpiReport = buildEoiOperationalKpiReport();
  const summary = buildEoiExecutiveOperationalSummary();

  return {
    contractVersion: EOI_OPERATIONAL_DASHBOARD_CONTRACT_VERSION,
    sourceKpiContractVersion: EOI_OPERATIONAL_KPI_REPORTING_CONTRACT_VERSION,
    sourceSummaryContractVersion: EOI_EXECUTIVE_OPERATIONAL_SUMMARY_CONTRACT_VERSION,
    generatedFrom: 'GOVERNED_METADATA_ONLY',
    access: 'PROTECTED_ADMIN',
    readOnly: true,
    liveKpiComputationAuthorized: false,
    trendAnalysisAuthorized: false,
    analyticsAuthorized: false,
    automationAuthorized: false,
    telemetryAuthorized: false,
    persistenceAuthorized: false,
    mutationAuthorized: false,
    labels: eoiOperationalDashboardLabels,
    sourceMetadata: {
      kpiDefinitionCount: kpiReport.definitions.length,
      summarySectionCount: summary.sections.length,
      liveObservationCount: kpiReport.observations.filter((observation) => observation.sourceAvailability === 'LIVE_AVAILABLE').length,
      generatedFromKpiReport: kpiReport.generatedFrom,
      generatedFromSummary: summary.generatedFrom,
    },
    sections: buildDashboardSections(kpiReport, summary),
    boundaries: [
      'The Executive Operations Dashboard is protected administrative presentation only.',
      'The dashboard displays governed metadata from EOI Sprint 1 and Sprint 2 contracts only.',
      'Live KPI computation, trend analysis, analytics, CRM automation, workflow automation, telemetry, persistence, AI, GIS, provider activity, and production mutation are not authorized.',
      'Displayed information must not be interpreted as live operational performance.',
      'Human review remains required before operational, staffing, customer, automation, or executive action.',
    ],
  };
}

export function validateEoiOperationalDashboardContract(input: {
  sections?: readonly EoiOperationalDashboardSection[];
  payload?: EoiOperationalDashboardPayload;
} = {}): EoiOperationalDashboardValidationResult {
  const payload = input.payload ?? buildEoiOperationalDashboard();
  const sections = input.sections ?? payload.sections;
  const issues: string[] = [];
  const identifiers = new Set<EoiOperationalDashboardSectionIdentifier>();

  for (const expected of eoiOperationalDashboardSectionIdentifiers) {
    if (!sections.some((section) => section.identifier === expected)) {
      issues.push(`Missing operational dashboard section ${expected}.`);
    }
  }

  for (const section of sections) {
    if (identifiers.has(section.identifier)) {
      issues.push(`Duplicate operational dashboard section ${section.identifier}.`);
    }
    identifiers.add(section.identifier);
    if (!section.displayName) issues.push(`Dashboard section ${section.identifier} is missing display name.`);
    if (!section.purpose) issues.push(`Dashboard section ${section.identifier} is missing purpose.`);
    if (!section.governingSource) issues.push(`Dashboard section ${section.identifier} is missing governing source.`);
    if (!section.owner) issues.push(`Dashboard section ${section.identifier} is missing owner.`);
    if (!section.confidence) issues.push(`Dashboard section ${section.identifier} is missing confidence.`);
    if (!section.freshness) issues.push(`Dashboard section ${section.identifier} is missing freshness.`);
    if (!section.evidenceClassification) issues.push(`Dashboard section ${section.identifier} is missing evidence classification.`);
    if (!section.interpretationBoundary) issues.push(`Dashboard section ${section.identifier} is missing interpretation boundary.`);
    if (!section.displayItems.length) issues.push(`Dashboard section ${section.identifier} is missing display items.`);
  }

  for (const label of eoiOperationalDashboardLabels) {
    if (!payload.labels.includes(label)) issues.push(`Operational dashboard is missing required label ${label}.`);
  }

  if (payload.generatedFrom !== 'GOVERNED_METADATA_ONLY') issues.push('Dashboard must be generated from governed metadata only.');
  if (payload.liveKpiComputationAuthorized !== false) issues.push('Live KPI computation must remain unauthorized.');
  if (payload.trendAnalysisAuthorized !== false) issues.push('Trend analysis must remain unauthorized.');
  if (payload.analyticsAuthorized !== false) issues.push('Analytics must remain unauthorized.');
  if (payload.automationAuthorized !== false) issues.push('Automation must remain unauthorized.');
  if (payload.telemetryAuthorized !== false) issues.push('Telemetry must remain unauthorized.');
  if (payload.persistenceAuthorized !== false) issues.push('Persistence must remain unauthorized.');
  if (payload.mutationAuthorized !== false) issues.push('Mutation must remain unauthorized.');
  if (payload.sourceMetadata.generatedFromKpiReport !== 'GOVERNED_CONTRACTS') {
    issues.push('Dashboard must not use read-only evidence input or live operational evidence.');
  }
  if (payload.sourceMetadata.generatedFromSummary !== 'GOVERNED_OPERATIONAL_KPI_METADATA') {
    issues.push('Dashboard must use governed executive summary metadata.');
  }
  if (payload.sourceMetadata.liveObservationCount !== 0) {
    issues.push('Dashboard must not display live operational observations.');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

function buildDashboardSections(
  kpiReport: EoiOperationalKpiReport,
  summary: EoiExecutiveOperationalSummaryPayload,
): EoiOperationalDashboardSection[] {
  return [
    section(
      'EOI-DASHBOARD-EXECUTIVE-OPERATIONAL-OVERVIEW',
      'Executive Operational Overview',
      'Present the protected EOI dashboard posture without representing live operating performance.',
      'EOI-1.0-SPRINT-2',
      'EXECUTIVE_REVIEW',
      'MEDIUM',
      'UNKNOWN',
      'GOVERNED_METADATA',
      'METADATA_ONLY',
      [
        `${summary.sections.length} governed summary sections are available for protected executive review.`,
        'This section is a metadata overview and does not compute operational performance.',
      ],
    ),
    section(
      'EOI-DASHBOARD-KPI-REGISTRY-SUMMARY',
      'KPI Registry Summary',
      'Show the governed operational KPI definition coverage established in EOI Sprint 1.',
      'EOI-1.0-SPRINT-1',
      'EXECUTIVE_REVIEW',
      'MEDIUM',
      'UNKNOWN',
      'GOVERNED_METADATA',
      'METADATA_ONLY',
      [
        `${kpiReport.definitions.length} operational KPI definitions are present.`,
        `${countDefinedOnly(kpiReport)} KPI definitions remain defined pending separately authorized source evidence.`,
      ],
    ),
    section(
      'EOI-DASHBOARD-EXECUTIVE-SUMMARY-OVERVIEW',
      'Executive Summary Overview',
      'Show the governed summary section coverage established in EOI Sprint 2.',
      'EOI-1.0-SPRINT-2',
      'EXECUTIVE_REVIEW',
      'MEDIUM',
      'UNKNOWN',
      'GOVERNED_METADATA',
      'METADATA_ONLY',
      [
        `${summary.sections.length} executive summary sections are governed.`,
        'Executive interpretation remains bounded by evidence classification and human review requirements.',
      ],
    ),
    section(
      'EOI-DASHBOARD-CONFIDENCE-STATUS',
      'Confidence Status',
      'Display confidence classifications from governed metadata only.',
      'EOI-1.0-SPRINT-2',
      'GOVERNANCE_REVIEW',
      'MEDIUM',
      'UNKNOWN',
      'GOVERNED_METADATA',
      'METADATA_ONLY',
      [
        'Confidence labels describe the governed metadata posture, not measured operational accuracy.',
        'Confidence does not authorize live KPI computation or action.',
      ],
    ),
    section(
      'EOI-DASHBOARD-FRESHNESS-STATUS',
      'Freshness Status',
      'Display freshness classifications from governed metadata only.',
      'EOI-1.0-SPRINT-2',
      'GOVERNANCE_REVIEW',
      'MEDIUM',
      'UNKNOWN',
      'GOVERNED_METADATA',
      'METADATA_ONLY',
      [
        'Freshness is UNKNOWN until separately authorized operational source evidence exists.',
        'No time-series, trend, or live reporting feed is created.',
      ],
    ),
    section(
      'EOI-DASHBOARD-EVIDENCE-CLASSIFICATION',
      'Evidence Classification',
      'Make the evidence boundary visible for every dashboard section.',
      'EOI-1.0-SPRINT-2',
      'GOVERNANCE_REVIEW',
      'HIGH',
      'UNKNOWN',
      'GOVERNED_FACT',
      'FACT_ONLY',
      [
        'Dashboard sections carry explicit evidence classifications.',
        'Protected intelligence, customer records, CRM details, and operational data are not displayed.',
      ],
    ),
    section(
      'EOI-DASHBOARD-GOVERNANCE-STATUS',
      'Governance Status',
      'Show the dashboard authorization posture and disabled operational behaviors.',
      'EOI_GOVERNANCE',
      'GOVERNANCE_REVIEW',
      'HIGH',
      'UNKNOWN',
      'GOVERNED_FACT',
      'FACT_ONLY',
      [
        'Read-only protected administrative presentation is authorized.',
        'Automation, analytics, telemetry, persistence, mutation, AI, GIS, and providers remain disabled.',
      ],
    ),
    section(
      'EOI-DASHBOARD-INTERPRETATION-BOUNDARIES',
      'Interpretation Boundaries',
      'Prevent dashboard presentation from being mistaken for live analytics or recommendations.',
      'EOI-1.0-SPRINT-2',
      'EXECUTIVE_REVIEW',
      'HIGH',
      'UNKNOWN',
      'GOVERNED_METADATA',
      'HUMAN_REVIEW_REQUIRED',
      [
        'Dashboard sections distinguish governed fact, governed metadata, human interpretation, and deferred analysis.',
        'Human review is required before decisions or operational changes.',
      ],
    ),
    section(
      'EOI-DASHBOARD-HUMAN-REVIEW-INDICATORS',
      'Human Review Indicators',
      'Surface where executive or operational review remains required.',
      'CAO_GOVERNANCE',
      'OPERATIONS_LEAD',
      'MEDIUM',
      'UNKNOWN',
      'HUMAN_INTERPRETATION',
      'HUMAN_REVIEW_REQUIRED',
      [
        'Review indicators are guidance labels only.',
        'No routing, assignment, notification, task creation, or lifecycle transition is performed.',
      ],
    ),
    section(
      'EOI-DASHBOARD-DEFERRED-CAPABILITY-INDICATORS',
      'Deferred Capability Indicators',
      'Show which EOI capabilities are explicitly outside Sprint 3.',
      'EOI_GOVERNANCE',
      'EXECUTIVE_REVIEW',
      'HIGH',
      'UNKNOWN',
      'DEFERRED_ANALYSIS',
      'DEFERRED_UNTIL_SOURCE_EVIDENCE',
      [
        'Trend reporting, analytics, risk detection, opportunity detection, and decision support remain deferred.',
        'Future activation requires separate executive authorization and validation.',
      ],
    ),
  ];
}

function section(
  identifier: EoiOperationalDashboardSectionIdentifier,
  displayName: string,
  purpose: string,
  governingSource: EoiOperationalDashboardSource,
  owner: EoiOperationalDashboardOwner,
  confidence: ConfidenceLevel,
  freshness: FreshnessState,
  evidenceClassification: EoiExecutiveSummaryEvidenceClassification,
  interpretationBoundary: EoiExecutiveSummaryInterpretationBoundary,
  displayItems: string[],
): EoiOperationalDashboardSection {
  return {
    identifier,
    displayName,
    purpose,
    governingSource,
    owner,
    confidence,
    freshness,
    evidenceClassification,
    interpretationBoundary,
    displayItems,
  };
}

function countDefinedOnly(kpiReport: EoiOperationalKpiReport) {
  return kpiReport.definitions.filter((definition) => definition.sourceAvailability === 'DEFINED_BUT_UNAVAILABLE').length;
}
