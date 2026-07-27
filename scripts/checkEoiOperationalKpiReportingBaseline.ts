import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  buildEoiOperationalKpiReport,
  eoiOperationalKpiDefinitions,
  eoiOperationalKpiIdentifiers,
  validateEoiOperationalKpiReportingContract,
  type EoiOperationalKpiDefinition,
} from '../lib/eoi/operationalKpiReportingContract.js';

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
  /automationAuthorized:\s*true/,
  /telemetryAuthorized:\s*true/,
  /persistenceAuthorized:\s*true/,
  /mutationAuthorized:\s*true/,
];

function expectInvalid(
  input: Parameters<typeof validateEoiOperationalKpiReportingContract>[0],
  expectedIssue: RegExp,
) {
  const result = validateEoiOperationalKpiReportingContract(input);
  assert.equal(result.valid, false);
  assert.match(result.issues.join('\n'), expectedIssue);
}

async function assertNoRuntimeActivation() {
  const contractSource = await readFile('lib/eoi/operationalKpiReportingContract.ts', 'utf8');
  const routeSource = await readFile('app/api/admin/enterprise/operational-kpis/route.ts', 'utf8');
  const combinedSource = `${contractSource}\n${routeSource}`;

  for (const pattern of FORBIDDEN_RUNTIME_PATTERNS) {
    assert.doesNotMatch(combinedSource, pattern, `EOI Sprint 1 must remain read-only and non-activating: ${pattern}`);
  }

  assert.match(routeSource, /authorizeRepositoryAdminRequest/, 'Operational KPI route must remain protected.');
  assert.match(routeSource, /export async function GET/, 'Operational KPI adapter must expose only a read-only GET handler.');
  assert.doesNotMatch(routeSource, /export async function (POST|PUT|PATCH|DELETE)/, 'Operational KPI adapter must not expose mutation handlers.');
}

function assertDefinitionsComplete() {
  const result = validateEoiOperationalKpiReportingContract();
  assert.equal(result.valid, true, result.issues.join('\n'));
  assert.deepEqual(
    eoiOperationalKpiDefinitions.map((definition) => definition.identifier),
    eoiOperationalKpiIdentifiers,
  );

  for (const definition of eoiOperationalKpiDefinitions) {
    assert.equal(definition.automationAuthorized, false);
    assert.equal(definition.telemetryAuthorized, false);
    assert.equal(definition.persistenceAuthorized, false);
    assert.ok(definition.governingSource);
    assert.ok(definition.owner);
    assert.ok(definition.reportingClassification);
    assert.ok(definition.confidence);
    assert.ok(definition.freshness);
  }
}

function assertReadOnlyReport() {
  const emptyReport = buildEoiOperationalKpiReport();
  assert.equal(emptyReport.readOnly, true);
  assert.equal(emptyReport.automationAuthorized, false);
  assert.equal(emptyReport.telemetryAuthorized, false);
  assert.equal(emptyReport.persistenceAuthorized, false);
  assert.equal(emptyReport.generatedFrom, 'GOVERNED_CONTRACTS');
  assert.equal(emptyReport.queueSummary, null);
  assert.equal(emptyReport.observations.length, eoiOperationalKpiIdentifiers.length);
  assert.ok(emptyReport.observations.every((observation) => observation.value === null));

  const report = buildEoiOperationalKpiReport([
    {
      id: 'task-1',
      status: 'completed',
      type: 'property_inquiry',
      createdAt: new Date().toISOString(),
      hasReviewNote: true,
      consultationOutcome: 'COMPLETED',
      leadDisposition: 'CLOSED_WON',
    },
    {
      id: 'task-2',
      status: 'pending',
      type: 'strategy_intake',
      createdAt: new Date().toISOString(),
      hasReviewNote: false,
      consultationOutcome: 'NO_SHOW',
      leadDisposition: 'NURTURE',
    },
  ]);

  assert.equal(report.generatedFrom, 'READ_ONLY_EVIDENCE_INPUT');
  assert.equal(report.queueSummary?.total, 2);
  assert.equal(findObservation(report, 'EOI-KPI-CONSULTATION-VOLUME'), 2);
  assert.equal(findObservation(report, 'EOI-KPI-CONSULTATION-COMPLETION-RATE'), 50);
  assert.equal(findObservation(report, 'EOI-KPI-CONSULTATION-NO-SHOW-RATE'), 50);
  assert.equal(findObservation(report, 'EOI-KPI-CLOSED-WON-COUNT'), 1);
  assert.equal(findObservation(report, 'EOI-KPI-FOLLOW-UP-REQUIRED-COUNT'), 1);
}

function assertFailureModes() {
  expectInvalid(
    {
      definitions: eoiOperationalKpiDefinitions.filter(
        (definition) => definition.identifier !== 'EOI-KPI-SLA-HEALTH',
      ),
    },
    /Missing operational KPI definition EOI-KPI-SLA-HEALTH/,
  );

  expectInvalid(
    {
      definitions: [...eoiOperationalKpiDefinitions, eoiOperationalKpiDefinitions[0]],
    },
    /Duplicate operational KPI identifier EOI-KPI-CONSULTATION-VOLUME/,
  );

  expectInvalid(
    {
      definitions: eoiOperationalKpiDefinitions.map((definition): EoiOperationalKpiDefinition =>
        definition.identifier === 'EOI-KPI-QUEUE-HEALTH'
          ? { ...definition, owner: '' as never }
          : definition,
      ),
    },
    /EOI-KPI-QUEUE-HEALTH is missing governance owner/,
  );

  expectInvalid(
    {
      definitions: eoiOperationalKpiDefinitions.map((definition): EoiOperationalKpiDefinition =>
        definition.identifier === 'EOI-KPI-QUEUE-HEALTH'
          ? { ...definition, reportingClassification: '' as never }
          : definition,
      ),
    },
    /EOI-KPI-QUEUE-HEALTH is missing reporting classification/,
  );

  expectInvalid(
    {
      definitions: eoiOperationalKpiDefinitions.map((definition): EoiOperationalKpiDefinition =>
        definition.identifier === 'EOI-KPI-QUEUE-HEALTH'
          ? { ...definition, automationAuthorized: true as never }
          : definition,
      ),
    },
    /EOI-KPI-QUEUE-HEALTH must keep automation unauthorized/,
  );
}

function findObservation(
  report: ReturnType<typeof buildEoiOperationalKpiReport>,
  identifier: (typeof eoiOperationalKpiIdentifiers)[number],
) {
  return report.observations.find((observation) => observation.identifier === identifier)?.value;
}

async function main() {
  assertDefinitionsComplete();
  assertReadOnlyReport();
  assertFailureModes();
  await assertNoRuntimeActivation();

  console.log(
    '[eoi-operational-kpi-reporting-baseline] ok: operational KPI definitions, protected read-only adapter, governance ownership, confidence, freshness, reporting classification, and no-automation boundary verified.',
  );
}

main().catch((error) => {
  console.error(
    '[eoi-operational-kpi-reporting-baseline] failed:',
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
