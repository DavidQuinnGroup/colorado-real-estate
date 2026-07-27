import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  buildEoiExecutiveOperationalSummary,
  eoiExecutiveOperationalSummarySectionIdentifiers,
  validateEoiExecutiveOperationalSummaryContract,
  type EoiExecutiveOperationalSummarySection,
} from '../lib/eoi/executiveOperationalSummaryContract.js';

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
  /liveKpiComputationAuthorized:\s*true/,
  /automationAuthorized:\s*true/,
  /telemetryAuthorized:\s*true/,
  /persistenceAuthorized:\s*true/,
  /mutationAuthorized:\s*true/,
];

function expectInvalid(
  input: Parameters<typeof validateEoiExecutiveOperationalSummaryContract>[0],
  expectedIssue: RegExp,
) {
  const result = validateEoiExecutiveOperationalSummaryContract(input);
  assert.equal(result.valid, false);
  assert.match(result.issues.join('\n'), expectedIssue);
}

async function assertNoRuntimeActivation() {
  const contractSource = await readFile('lib/eoi/executiveOperationalSummaryContract.ts', 'utf8');
  const routeSource = await readFile('app/api/admin/enterprise/operational-summary/route.ts', 'utf8');
  const routeAdapterSource = await readFile('lib/eoi/executiveOperationalSummaryRouteAdapter.ts', 'utf8');
  const combinedSource = `${contractSource}\n${routeSource}\n${routeAdapterSource}`;

  for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
    assert.doesNotMatch(combinedSource, pattern, `EOI Sprint 2 must remain read-only and non-activating: ${pattern}`);
  }

  assert.match(routeSource, /authorizeRepositoryAdminRequest/, 'Executive operational summary route must remain protected.');
  assert.match(routeSource, /export async function GET/, 'Executive operational summary adapter must expose only a read-only GET handler.');
  assert.doesNotMatch(routeSource, /export async function (POST|PUT|PATCH|DELETE)/, 'Executive operational summary adapter must not expose mutation handlers.');
  assert.match(routeAdapterSource, /generatedFrom: 'GOVERNED_CONTRACT_METADATA'/, 'Route adapter must expose governed metadata only.');
  assert.match(routeAdapterSource, /liveKpiComputationAuthorized: false/, 'Route adapter must keep live KPI computation disabled.');
  assert.match(routeAdapterSource, /mutationAuthorized: false/, 'Route adapter must keep mutation disabled.');
}

function assertSummaryCompleteness() {
  const summary = buildEoiExecutiveOperationalSummary();
  const result = validateEoiExecutiveOperationalSummaryContract({
    sections: summary.sections,
  });

  assert.equal(result.valid, true, result.issues.join('\n'));
  assert.equal(summary.contractVersion, 'EOI-1.0-SPRINT-2');
  assert.equal(summary.sourceReportVersion, 'EOI-1.0-SPRINT-1');
  assert.equal(summary.generatedFrom, 'GOVERNED_OPERATIONAL_KPI_METADATA');
  assert.equal(summary.readOnly, true);
  assert.equal(summary.liveKpiComputationAuthorized, false);
  assert.equal(summary.automationAuthorized, false);
  assert.equal(summary.telemetryAuthorized, false);
  assert.equal(summary.persistenceAuthorized, false);
  assert.equal(summary.mutationAuthorized, false);
  assert.equal(summary.sourceReport.generatedFrom, 'GOVERNED_CONTRACTS');
  assert.equal(summary.sourceReport.definitionCount, 10);
  assert.equal(summary.sourceReport.liveObservationCount, 0);
  assert.deepEqual(
    summary.sections.map((section) => section.identifier),
    eoiExecutiveOperationalSummarySectionIdentifiers,
  );

  for (const section of summary.sections) {
    assert.ok(section.owner);
    assert.ok(section.governingSource);
    assert.ok(section.evidenceClassification);
    assert.ok(section.confidenceClassification);
    assert.ok(section.freshnessClassification);
    assert.ok(section.interpretationBoundary);
    assert.ok(section.summaryPoints.length > 0);
  }
}

function assertFailureModes() {
  const sections = buildEoiExecutiveOperationalSummary().sections;

  expectInvalid(
    {
      sections: sections.filter((section) => section.identifier !== 'EOI-SUMMARY-EVIDENCE-PROVENANCE'),
    },
    /Missing executive operational summary section EOI-SUMMARY-EVIDENCE-PROVENANCE/,
  );

  expectInvalid(
    {
      sections: [...sections, sections[0]],
    },
    /Duplicate executive operational summary section EOI-SUMMARY-EXECUTIVE-OVERVIEW/,
  );

  expectInvalid(
    {
      sections: sections.map((section): EoiExecutiveOperationalSummarySection =>
        section.identifier === 'EOI-SUMMARY-KPI-COVERAGE'
          ? { ...section, owner: '' as never }
          : section,
      ),
    },
    /EOI-SUMMARY-KPI-COVERAGE is missing owner/,
  );

  expectInvalid(
    {
      sections: sections.map((section): EoiExecutiveOperationalSummarySection =>
        section.identifier === 'EOI-SUMMARY-KPI-COVERAGE'
          ? { ...section, evidenceClassification: '' as never }
          : section,
      ),
    },
    /EOI-SUMMARY-KPI-COVERAGE is missing evidence classification/,
  );

  expectInvalid(
    {
      sections: sections.map((section): EoiExecutiveOperationalSummarySection =>
        section.identifier === 'EOI-SUMMARY-KPI-COVERAGE'
          ? { ...section, interpretationBoundary: '' as never }
          : section,
      ),
    },
    /EOI-SUMMARY-KPI-COVERAGE is missing interpretation boundary/,
  );
}

async function main() {
  assertSummaryCompleteness();
  assertFailureModes();
  await assertNoRuntimeActivation();

  console.log(
    '[eoi-executive-operational-summary-baseline] ok: summary sections, governance owner/source, evidence, confidence, freshness, interpretation boundaries, protected adapter, and no-activation posture verified.',
  );
}

main().catch((error) => {
  console.error(
    '[eoi-executive-operational-summary-baseline] failed:',
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
