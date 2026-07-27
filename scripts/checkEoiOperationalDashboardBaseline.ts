import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  buildEoiOperationalDashboard,
  eoiOperationalDashboardLabels,
  eoiOperationalDashboardSectionIdentifiers,
  validateEoiOperationalDashboardContract,
  type EoiOperationalDashboardPayload,
  type EoiOperationalDashboardSection,
} from '../lib/eoi/operationalDashboardContract.js';

const FORBIDDEN_RUNTIME_PATTERNS = [
  /fetch\s*\(/,
  /XMLHttpRequest/,
  /navigator\.sendBeacon/,
  /document\.cookie/,
  /localStorage/,
  /sessionStorage/,
  /prisma\./,
  /\$transaction/,
  /\.create\s*\(/,
  /\.update\s*\(/,
  /\.delete\s*\(/,
  /sendEmail/,
  /sendPropertyInquiryNotification/,
  /getKpiTrends/,
  /detectRiskSignals/,
  /detectOpportunitySignals/,
  /buildDecisionSupport/,
  /liveKpiComputationAuthorized:\s*true/,
  /trendAnalysisAuthorized:\s*true/,
  /analyticsAuthorized:\s*true/,
  /automationAuthorized:\s*true/,
  /telemetryAuthorized:\s*true/,
  /persistenceAuthorized:\s*true/,
  /mutationAuthorized:\s*true/,
];

function expectInvalid(
  input: Parameters<typeof validateEoiOperationalDashboardContract>[0],
  expectedIssue: RegExp,
) {
  const result = validateEoiOperationalDashboardContract(input);
  assert.equal(result.valid, false);
  assert.match(result.issues.join('\n'), expectedIssue);
}

async function assertNoRuntimeActivation() {
  const contractSource = await readFile('lib/eoi/operationalDashboardContract.ts', 'utf8');
  const routeAdapterSource = await readFile('lib/eoi/operationalDashboardRouteAdapter.ts', 'utf8');
  const pageSource = await readFile('app/admin/repository/executive-operations-dashboard/page.tsx', 'utf8');
  const combinedSource = `${contractSource}\n${routeAdapterSource}\n${pageSource}`;

  for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
    assert.doesNotMatch(combinedSource, pattern, `EOI Sprint 3 dashboard must remain metadata-only and non-activating: ${pattern}`);
  }

  assert.doesNotMatch(pageSource, /['"]use client['"]/, 'Executive operations dashboard must remain a server-rendered protected admin page.');
  assert.match(pageSource, /buildEoiOperationalDashboardRoutePayload/, 'Dashboard page must use the protected dashboard route adapter.');
  assert.match(pageSource, /READ-ONLY/, 'Dashboard page must display READ-ONLY.');
  assert.match(pageSource, /GOVERNED METADATA/, 'Dashboard page must display GOVERNED METADATA.');
  assert.match(pageSource, /NO LIVE KPI COMPUTATION/, 'Dashboard page must display NO LIVE KPI COMPUTATION.');
  assert.match(pageSource, /NO TREND ANALYSIS/, 'Dashboard page must display NO TREND ANALYSIS.');
  assert.match(pageSource, /NO OPERATIONAL AUTOMATION/, 'Dashboard page must display NO OPERATIONAL AUTOMATION.');
  assert.match(routeAdapterSource, /generatedFrom: 'GOVERNED_METADATA_ONLY'/, 'Dashboard adapter must expose governed metadata only.');
  assert.match(routeAdapterSource, /liveObservationCount: 0/, 'Dashboard adapter must expose zero live observations.');
  assert.match(routeAdapterSource, /trendAnalysisAuthorized: false/, 'Dashboard adapter must keep trend analysis disabled.');
  assert.match(routeAdapterSource, /automationAuthorized: false/, 'Dashboard adapter must keep automation disabled.');
  assert.match(routeAdapterSource, /mutationAuthorized: false/, 'Dashboard adapter must keep mutation disabled.');
}

function assertDashboardCompleteness() {
  const dashboard = buildEoiOperationalDashboard();
  const result = validateEoiOperationalDashboardContract({
    payload: dashboard,
    sections: dashboard.sections,
  });

  assert.equal(result.valid, true, result.issues.join('\n'));
  assert.equal(dashboard.contractVersion, 'EOI-1.0-SPRINT-3');
  assert.equal(dashboard.sourceKpiContractVersion, 'EOI-1.0-SPRINT-1');
  assert.equal(dashboard.sourceSummaryContractVersion, 'EOI-1.0-SPRINT-2');
  assert.equal(dashboard.generatedFrom, 'GOVERNED_METADATA_ONLY');
  assert.equal(dashboard.access, 'PROTECTED_ADMIN');
  assert.equal(dashboard.readOnly, true);
  assert.equal(dashboard.liveKpiComputationAuthorized, false);
  assert.equal(dashboard.trendAnalysisAuthorized, false);
  assert.equal(dashboard.analyticsAuthorized, false);
  assert.equal(dashboard.automationAuthorized, false);
  assert.equal(dashboard.telemetryAuthorized, false);
  assert.equal(dashboard.persistenceAuthorized, false);
  assert.equal(dashboard.mutationAuthorized, false);
  assert.equal(dashboard.sourceMetadata.kpiDefinitionCount, 10);
  assert.equal(dashboard.sourceMetadata.summarySectionCount, 10);
  assert.equal(dashboard.sourceMetadata.liveObservationCount, 0);
  assert.deepEqual(dashboard.labels, eoiOperationalDashboardLabels);
  assert.deepEqual(
    dashboard.sections.map((section) => section.identifier),
    eoiOperationalDashboardSectionIdentifiers,
  );

  for (const section of dashboard.sections) {
    assert.ok(section.governingSource);
    assert.ok(section.owner);
    assert.ok(section.confidence);
    assert.ok(section.freshness);
    assert.ok(section.evidenceClassification);
    assert.ok(section.interpretationBoundary);
    assert.ok(section.displayItems.length > 0);
  }
}

function assertFailureModes() {
  const dashboard = buildEoiOperationalDashboard();
  const sections = dashboard.sections;

  expectInvalid(
    {
      payload: dashboard,
      sections: sections.filter((section) => section.identifier !== 'EOI-DASHBOARD-DEFERRED-CAPABILITY-INDICATORS'),
    },
    /Missing operational dashboard section EOI-DASHBOARD-DEFERRED-CAPABILITY-INDICATORS/,
  );

  expectInvalid(
    {
      payload: dashboard,
      sections: [...sections, sections[0]],
    },
    /Duplicate operational dashboard section EOI-DASHBOARD-EXECUTIVE-OPERATIONAL-OVERVIEW/,
  );

  expectInvalid(
    {
      payload: dashboard,
      sections: sections.map((section): EoiOperationalDashboardSection =>
        section.identifier === 'EOI-DASHBOARD-CONFIDENCE-STATUS'
          ? { ...section, governingSource: '' as never }
          : section,
      ),
    },
    /EOI-DASHBOARD-CONFIDENCE-STATUS is missing governing source/,
  );

  expectInvalid(
    {
      payload: dashboard,
      sections: sections.map((section): EoiOperationalDashboardSection =>
        section.identifier === 'EOI-DASHBOARD-CONFIDENCE-STATUS'
          ? { ...section, evidenceClassification: '' as never }
          : section,
      ),
    },
    /EOI-DASHBOARD-CONFIDENCE-STATUS is missing evidence classification/,
  );

  expectInvalid(
    {
      payload: {
        ...dashboard,
        trendAnalysisAuthorized: true as never,
      } satisfies EoiOperationalDashboardPayload,
      sections,
    },
    /Trend analysis must remain unauthorized/,
  );
}

async function assertRouteAdapterCoverage() {
  const routeAdapterSource = await readFile('lib/eoi/operationalDashboardRouteAdapter.ts', 'utf8');
  const pageSource = await readFile('app/admin/repository/executive-operations-dashboard/page.tsx', 'utf8');

  for (const identifier of eoiOperationalDashboardSectionIdentifiers) {
    assert.match(routeAdapterSource, new RegExp(identifier), `Route adapter is missing ${identifier}.`);
  }

  for (const label of eoiOperationalDashboardLabels) {
    assert.match(routeAdapterSource, new RegExp(label), `Route adapter is missing label ${label}.`);
    assert.match(pageSource, new RegExp(label), `Dashboard page is missing label ${label}.`);
  }

  assert.match(pageSource, /aria-label="Dashboard governance labels:/, 'Dashboard labels must have an accessible section label.');
  assert.match(pageSource, /aria-label="Operational dashboard sections"/, 'Dashboard sections must have an accessible section label.');
  assert.match(pageSource, /aria-label="Operational dashboard boundaries"/, 'Dashboard boundaries must have an accessible section label.');
}

async function main() {
  assertDashboardCompleteness();
  assertFailureModes();
  await assertNoRuntimeActivation();
  await assertRouteAdapterCoverage();

  console.log(
    '[eoi-operational-dashboard-baseline] ok: protected dashboard sections, source metadata, evidence labels, interpretation boundaries, read-only presentation, and no-activation posture verified.',
  );
}

main().catch((error) => {
  console.error(
    '[eoi-operational-dashboard-baseline] failed:',
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
