import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  REIE_VISUAL_INTELLIGENCE_SYSTEM_STATUS,
  VIS_COMPONENT_CONTRACTS,
  VIS_DEI_REVIEW,
  VIS_DESIGN_TOKENS,
  VIS_PROHIBITED_PATTERNS,
  VIS_PROTOTYPE_FIXTURE,
  VIS_SIGNATURE_VISUAL_SPECS,
  VIS_STATE_HANDLING,
} from '../lib/visual-intelligence/visualIntelligenceSystem.js';

const requiredComponentIds = [
  'VIS-COMPONENT-MARKET-PULSE',
  'VIS-COMPONENT-PROPERTY-DNA',
  'VIS-COMPONENT-CONFIDENCE-LAYER',
  'VIS-COMPONENT-MARKET-REPORT-COMPOSITION',
] as const;

const requiredDocs = [
  'docs/project-atlas/executive-library/REIE-VISUAL-INTELLIGENCE-SYSTEM-1.md',
] as const;

const prohibitedRuntimePatterns = [
  /fetch\(/,
  /PrismaClient|prisma\./,
  /navigator\.sendBeacon|gtag\(|analytics/i,
  /openai|anthropic|AI\s+recommendation/i,
  /mapbox|arcgis|esri/i,
  /mortgage calculator|loan calculator/i,
] as const;

const prohibitedPrototypeClaims = [
  /guaranteed outcome|price prediction|forecasted appreciation/i,
] as const;

function assertIncludes(source: string, needle: string, label: string) {
  assert.ok(source.includes(needle), `${label} must include ${needle}.`);
}

async function main() {
  const [
    modelSource,
    componentSource,
    routeSource,
    repositoryPage,
    packageJson,
    workerConfig,
    chatStart,
    ...docs
  ] = await Promise.all([
    readFile('lib/visual-intelligence/visualIntelligenceSystem.ts', 'utf8'),
    readFile('components/visual-intelligence/VisualIntelligencePrototype.tsx', 'utf8'),
    readFile('app/admin/repository/visual-intelligence/page.tsx', 'utf8'),
    readFile('app/admin/repository/page.tsx', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('tsconfig.worker.json', 'utf8'),
    readFile('docs/CHAT_START.md', 'utf8'),
    ...requiredDocs.map((doc) => readFile(doc, 'utf8')),
  ]);

  assert.equal(REIE_VISUAL_INTELLIGENCE_SYSTEM_STATUS, 'REIE_VISUAL_INTELLIGENCE_SYSTEM_1_COMPLETE');
  assert.equal(VIS_PROTOTYPE_FIXTURE.publicActivation, false);
  assert.equal(VIS_PROTOTYPE_FIXTURE.providerActivation, false);
  assert.equal(VIS_PROTOTYPE_FIXTURE.schemaChange, false);
  assert.equal(VIS_PROTOTYPE_FIXTURE.status, 'NON_PRODUCTION_FIXTURE');
  assert.equal(VIS_DEI_REVIEW.total, 27);
  assert.equal(VIS_DEI_REVIEW.normalized, 4.5);

  assert.equal(VIS_COMPONENT_CONTRACTS.length, 4, 'VIS 1.0 must define the four representative component contracts.');
  for (const contractId of requiredComponentIds) {
    const contract = VIS_COMPONENT_CONTRACTS.find((candidate) => candidate.id === contractId);
    assert.ok(contract, `${contractId} must exist.`);
    assert.deepEqual(
      contract?.requiredStates,
      ['ready', 'loading', 'empty', 'sparse', 'stale', 'conflict', 'failure'],
      `${contractId} must preserve full state handling.`,
    );
    assert.ok(contract?.accessibilityContract.length, `${contractId} must define accessibility protections.`);
    assert.ok(contract?.trustContract.length, `${contractId} must define trust protections.`);
  }

  assert.equal(Object.keys(VIS_STATE_HANDLING).length, 7, 'VIS state handling must cover seven governed states.');
  assert.ok(VIS_SIGNATURE_VISUAL_SPECS.length >= 4, 'Signature visual specs must cover the portfolio candidates.');
  assert.ok(VIS_PROHIBITED_PATTERNS.includes('public GIS activation'), 'VIS must prohibit public GIS activation.');
  assert.ok(VIS_PROHIBITED_PATTERNS.includes('provider execution'), 'VIS must prohibit provider execution.');
  assert.ok(VIS_PROHIBITED_PATTERNS.includes('school or safety ranking'), 'VIS must prohibit ranking claims.');
  assert.ok(VIS_DESIGN_TOKENS.colors.coloradoGold, 'VIS must define the Colorado visual palette.');
  assert.ok(VIS_PROTOTYPE_FIXTURE.market.metricBands.length >= 3, 'Market Pulse fixture must include metric bands.');
  assert.ok(VIS_PROTOTYPE_FIXTURE.property.dimensions.length >= 4, 'Property DNA fixture must include decision dimensions.');
  assert.ok(VIS_PROTOTYPE_FIXTURE.evidenceFacets.length >= 5, 'Confidence Layer fixture must include provenance facets.');

  assert.match(routeSource, /robots:\s*\{[\s\S]*index:\s*false,[\s\S]*follow:\s*false/, 'VIS preview route must be noindex/nofollow.');
  assertIncludes(routeSource, '/admin/repository', 'VIS preview route');
  assertIncludes(routeSource, 'VisualIntelligencePrototype', 'VIS preview route');
  assertIncludes(repositoryPage, '/admin/repository/visual-intelligence', 'Repository Studio navigation');

  assertIncludes(componentSource, 'data-testid="vis-prototype"', 'VIS prototype');
  assertIncludes(componentSource, 'data-vis-public-activation="false"', 'VIS prototype');
  assertIncludes(componentSource, 'data-provider-activation="false"', 'VIS prototype');
  assertIncludes(componentSource, 'data-prisma-schema-change="false"', 'VIS prototype');
  assertIncludes(componentSource, 'data-testid="vis-market-pulse"', 'VIS prototype');
  assertIncludes(componentSource, 'data-visual-kind="market-level"', 'VIS prototype');
  assertIncludes(componentSource, 'data-testid="vis-property-dna"', 'VIS prototype');
  assertIncludes(componentSource, 'data-visual-kind="property-level"', 'VIS prototype');
  assertIncludes(componentSource, 'data-testid="vis-confidence-layer"', 'VIS prototype');
  assertIncludes(componentSource, 'data-testid="vis-market-report-composition"', 'VIS prototype');
  assertIncludes(componentSource, 'data-testid="vis-accessible-data-alternative"', 'VIS prototype');
  assertIncludes(componentSource, 'role="img"', 'VIS prototype');
  assertIncludes(componentSource, '<table', 'VIS prototype accessible table');
  assertIncludes(componentSource, '<details', 'VIS prototype non-hover disclosure');

  for (const pattern of prohibitedRuntimePatterns) {
    assert.doesNotMatch(modelSource, pattern, `VIS model must not contain ${pattern}.`);
    assert.doesNotMatch(componentSource, pattern, `VIS prototype must not contain ${pattern}.`);
    assert.doesNotMatch(routeSource, pattern, `VIS route must not contain ${pattern}.`);
  }
  for (const pattern of prohibitedPrototypeClaims) {
    assert.doesNotMatch(componentSource, pattern, `VIS prototype must not render ${pattern}.`);
    assert.doesNotMatch(routeSource, pattern, `VIS route must not render ${pattern}.`);
  }

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert.ok(
    packageData.scripts?.['check:reie-visual-intelligence-system'],
    'package.json must expose VIS validation.',
  );
  assert.match(workerConfig, /checkReieVisualIntelligenceSystem\.ts/);
  assert.match(workerConfig, /lib\/visual-intelligence\/\*\*\/\*\.ts/);

  for (const [index, doc] of docs.entries()) {
    assert.match(doc, /REIE Visual Intelligence System/i, `${requiredDocs[index]} must document VIS.`);
    assert.match(doc, /NON_PRODUCTION_FIXTURE|non-production fixture/i, `${requiredDocs[index]} must document fixture-only status.`);
    assert.match(doc, /no public activation|publicActivation: false|No public route/i, `${requiredDocs[index]} must document no public activation.`);
    assert.match(doc, /Confidence Layer/i, `${requiredDocs[index]} must document confidence and provenance.`);
    assert.match(doc, /Accessibility/i, `${requiredDocs[index]} must document accessibility standards.`);
    assert.match(doc, /Validation Checklist/i, `${requiredDocs[index]} must document validation.`);
  }
  assert.match(chatStart, /Visual Intelligence System/i, 'CHAT_START must preserve VIS handoff.');

  console.log(
    `[reie-visual-intelligence-system] ok: ${VIS_COMPONENT_CONTRACTS.length} contracts, ${VIS_SIGNATURE_VISUAL_SPECS.length} signature specs, ${VIS_PROTOTYPE_FIXTURE.evidenceFacets.length} confidence facets, no public/provider/schema activation.`,
  );
}

main().catch((error) => {
  console.error('[reie-visual-intelligence-system] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
