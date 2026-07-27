export type EoiExecutiveOperationalSummaryRouteSection = {
  identifier:
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
  displayName: string;
  evidenceClassification:
    | 'GOVERNED_FACT'
    | 'GOVERNED_METADATA'
    | 'HUMAN_INTERPRETATION'
    | 'DEFERRED_ANALYSIS';
  interpretationBoundary:
    | 'FACT_ONLY'
    | 'METADATA_ONLY'
    | 'HUMAN_REVIEW_REQUIRED'
    | 'DEFERRED_UNTIL_SOURCE_EVIDENCE';
};

export type EoiExecutiveOperationalSummaryRoutePayload = {
  contractVersion: 'EOI-1.0-SPRINT-2';
  sourceContractVersion: 'EOI-1.0-SPRINT-1';
  access: 'PROTECTED_ADMIN';
  readOnly: true;
  generatedFrom: 'GOVERNED_CONTRACT_METADATA';
  liveKpiComputationAuthorized: false;
  automationAuthorized: false;
  telemetryAuthorized: false;
  persistenceAuthorized: false;
  mutationAuthorized: false;
  sections: EoiExecutiveOperationalSummaryRouteSection[];
  limitations: string[];
};

export const eoiExecutiveOperationalSummaryRouteSections: EoiExecutiveOperationalSummaryRouteSection[] = [
  section('EOI-SUMMARY-EXECUTIVE-OVERVIEW', 'Executive Overview', 'GOVERNED_METADATA', 'METADATA_ONLY'),
  section('EOI-SUMMARY-OPERATIONAL-CONTEXT', 'Operational Context', 'GOVERNED_METADATA', 'METADATA_ONLY'),
  section('EOI-SUMMARY-KPI-COVERAGE', 'KPI Coverage', 'GOVERNED_FACT', 'FACT_ONLY'),
  section('EOI-SUMMARY-CONFIDENCE-ASSESSMENT', 'Confidence Assessment', 'GOVERNED_METADATA', 'METADATA_ONLY'),
  section('EOI-SUMMARY-FRESHNESS-ASSESSMENT', 'Freshness Assessment', 'GOVERNED_METADATA', 'METADATA_ONLY'),
  section('EOI-SUMMARY-HUMAN-REVIEW-REQUIRED', 'Human Review Required', 'HUMAN_INTERPRETATION', 'HUMAN_REVIEW_REQUIRED'),
  section('EOI-SUMMARY-GOVERNANCE-NOTES', 'Governance Notes', 'GOVERNED_FACT', 'FACT_ONLY'),
  section('EOI-SUMMARY-RECOMMENDED-ATTENTION-AREAS', 'Recommended Attention Areas', 'HUMAN_INTERPRETATION', 'HUMAN_REVIEW_REQUIRED'),
  section('EOI-SUMMARY-DEFERRED-INTERPRETATION', 'Deferred Interpretation', 'DEFERRED_ANALYSIS', 'DEFERRED_UNTIL_SOURCE_EVIDENCE'),
  section('EOI-SUMMARY-EVIDENCE-PROVENANCE', 'Evidence Provenance', 'GOVERNED_METADATA', 'METADATA_ONLY'),
];

export function buildEoiExecutiveOperationalSummaryRoutePayload(): EoiExecutiveOperationalSummaryRoutePayload {
  return {
    contractVersion: 'EOI-1.0-SPRINT-2',
    sourceContractVersion: 'EOI-1.0-SPRINT-1',
    access: 'PROTECTED_ADMIN',
    readOnly: true,
    generatedFrom: 'GOVERNED_CONTRACT_METADATA',
    liveKpiComputationAuthorized: false,
    automationAuthorized: false,
    telemetryAuthorized: false,
    persistenceAuthorized: false,
    mutationAuthorized: false,
    sections: eoiExecutiveOperationalSummaryRouteSections,
    limitations: [
      'This protected adapter exposes governed summary metadata only.',
      'No live KPI computation, operational database query, CRM automation, workflow automation, telemetry, persistence, AI, GIS, provider activation, or production mutation is authorized.',
      'Human interpretation remains deferred until separately authorized source evidence and review procedures exist.',
    ],
  };
}

function section(
  identifier: EoiExecutiveOperationalSummaryRouteSection['identifier'],
  displayName: string,
  evidenceClassification: EoiExecutiveOperationalSummaryRouteSection['evidenceClassification'],
  interpretationBoundary: EoiExecutiveOperationalSummaryRouteSection['interpretationBoundary'],
): EoiExecutiveOperationalSummaryRouteSection {
  return {
    identifier,
    displayName,
    evidenceClassification,
    interpretationBoundary,
  };
}
