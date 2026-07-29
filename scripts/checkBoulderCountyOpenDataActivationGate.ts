import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  BOULDER_COUNTY_COUNSEL_REVIEW_ITEMS,
  BOULDER_COUNTY_COST_OPERATIONS_ASSESSMENT,
  BOULDER_COUNTY_FIRST_ACTIVATION_BOUNDARY,
  BOULDER_COUNTY_OPEN_DATA_ACTIVATION_GATE_STATUS,
  BOULDER_COUNTY_OPEN_DATASETS,
  BOULDER_COUNTY_PERSISTENCE_DECISION_GATE,
  BOULDER_COUNTY_PROVIDER_CONFIRMATION_QUESTIONS,
  BOULDER_COUNTY_OPEN_DATA_SOURCES,
  getBoulderCountyOpenDataActivationCandidates,
  getRecommendedBoulderCountyFirstActivationDatasets,
} from '../lib/boulderCountyOpenDataActivationGate.js';

const REQUIRED_DOCS = [
  'docs/project-atlas/executive-library/SOURCE-RIGHTS-READINESS-1-PRODUCTION-CERTIFICATION.md',
  'docs/project-atlas/executive-library/BOULDER-COUNTY-OPEN-DATA-ACTIVATION-GATE-1.md',
  'docs/project-atlas/executive-library/BOULDER-COUNTY-OPEN-DATA-DATASET-INVENTORY-1.md',
  'docs/project-atlas/executive-library/BOULDER-COUNTY-OPEN-DATA-DATASET-RIGHTS-MATRIX-1.md',
  'docs/project-atlas/executive-library/BOULDER-COUNTY-OPEN-DATA-PROVIDER-CONFIRMATION-REQUEST-1.md',
  'docs/project-atlas/executive-library/BOULDER-COUNTY-OPEN-DATA-COUNSEL-REVIEW-PACKET-1.md',
  'docs/project-atlas/executive-library/BOULDER-COUNTY-OPEN-DATA-FIRST-ACTIVATION-BOUNDARY-1.md',
  'docs/project-atlas/executive-library/BOULDER-COUNTY-OPEN-DATA-PERSISTENCE-DECISION-GATE-1.md',
  'docs/project-atlas/executive-library/BOULDER-COUNTY-OPEN-DATA-COST-OPERATIONS-ASSESSMENT-1.md',
] as const;

function assertUnique(values: readonly string[], label: string) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  assert.equal(duplicates.length, 0, `${label} must not contain duplicate values: ${duplicates.join(', ')}`);
}

async function main() {
  const [source, packageJson, workerConfig, chatStart, ...docs] = await Promise.all([
    readFile('lib/boulderCountyOpenDataActivationGate.ts', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('tsconfig.worker.json', 'utf8'),
    readFile('docs/CHAT_START.md', 'utf8'),
    ...REQUIRED_DOCS.map((doc) => readFile(doc, 'utf8')),
  ]);

  assert.equal(BOULDER_COUNTY_OPEN_DATA_ACTIVATION_GATE_STATUS, 'BOULDER_COUNTY_OPEN_DATA_ACTIVATION_GATE_1_COMPLETE');
  assert.match(BOULDER_COUNTY_OPEN_DATA_SOURCES.countyOpenDataPage, /^https:\/\/bouldercounty\.gov\/government\/open-data\//);
  assert.match(BOULDER_COUNTY_OPEN_DATA_SOURCES.arcgisHubSearchApi, /^https:\/\/opendata-bouldercounty\.hub\.arcgis\.com\//);

  assert(BOULDER_COUNTY_OPEN_DATASETS.length >= 7, 'Dataset inventory must cover the first-value candidates and exclusions.');
  assertUnique(BOULDER_COUNTY_OPEN_DATASETS.map((dataset) => dataset.datasetId), 'Dataset ids');
  assertUnique(BOULDER_COUNTY_OPEN_DATASETS.map((dataset) => dataset.catalogItemId), 'Catalog item ids');

  for (const dataset of BOULDER_COUNTY_OPEN_DATASETS) {
    assert(dataset.title.length > 0, `${dataset.datasetId} must have a title.`);
    assert(dataset.catalogUrl.startsWith('https://'), `${dataset.datasetId} must have a catalog URL.`);
    assert(dataset.serviceUrl.startsWith('https://'), `${dataset.datasetId} must have a service URL.`);
    assert(dataset.provider.includes('Boulder County'), `${dataset.datasetId} must identify Boulder County provider.`);
    assert.equal(dataset.access, 'public', `${dataset.datasetId} must be public catalog evidence.`);
    assert(dataset.license.length > 0, `${dataset.datasetId} must include license posture.`);
    assert(dataset.updateCadence.length > 0, `${dataset.datasetId} must include update cadence.`);
    assert(dataset.representativeFields.length > 0, `${dataset.datasetId} must include representative fields or explicit unknown placeholder.`);
    assert(dataset.allowedInitialUse.length > 0, `${dataset.datasetId} must include allowed initial use.`);
    assert(dataset.prohibitedInitialUse.length >= 4, `${dataset.datasetId} must include meaningful prohibitions.`);
    assert(dataset.unresolvedQuestions.length > 0, `${dataset.datasetId} must preserve activation blockers.`);
  }

  const recommended = getRecommendedBoulderCountyFirstActivationDatasets();
  assert.deepEqual(
    recommended.map((dataset) => dataset.datasetId),
    ['BCOD-ADDRESS-POINTS', 'BCOD-PARK-BOUNDARIES'],
    'First activation boundary must stay narrow and explicit.',
  );
  assert.equal(BOULDER_COUNTY_FIRST_ACTIVATION_BOUNDARY.maxInitialDatasets, 2);
  assert.deepEqual(BOULDER_COUNTY_FIRST_ACTIVATION_BOUNDARY.approvedRuntimeEffects, ['none in this sprint']);
  assert(BOULDER_COUNTY_FIRST_ACTIVATION_BOUNDARY.prohibitedRuntimeEffects.includes('provider execution'));
  assert(BOULDER_COUNTY_FIRST_ACTIVATION_BOUNDARY.prohibitedRuntimeEffects.includes('database writes'));
  assert(BOULDER_COUNTY_FIRST_ACTIVATION_BOUNDARY.prohibitedRuntimeEffects.includes('customer-facing dataset display'));

  const candidates = getBoulderCountyOpenDataActivationCandidates();
  assert.equal(candidates[0].datasetId, 'BCOD-ADDRESS-POINTS');
  assert.equal(candidates[candidates.length - 1].readiness, 'DEFER_DEPRECATED_OR_STATIC');

  assert.equal(BOULDER_COUNTY_PROVIDER_CONFIRMATION_QUESTIONS.length, 20);
  assert(BOULDER_COUNTY_PROVIDER_CONFIRMATION_QUESTIONS.every((question) => question.requiredForActivation));
  assert(BOULDER_COUNTY_COUNSEL_REVIEW_ITEMS.some((item) => item.provisionalStatus === 'NOT_APPROVED'));

  assert.equal(BOULDER_COUNTY_PERSISTENCE_DECISION_GATE.existingPersistenceReusable, false);
  assert.equal(BOULDER_COUNTY_PERSISTENCE_DECISION_GATE.futureMigrationRequired, true);
  assert(BOULDER_COUNTY_PERSISTENCE_DECISION_GATE.requiredObjects.includes('source_license_snapshot'));
  assert(BOULDER_COUNTY_PERSISTENCE_DECISION_GATE.requiredObjects.includes('normalized_observation'));
  assert(BOULDER_COUNTY_PERSISTENCE_DECISION_GATE.prohibitedUntilAuthorized.includes('writes from provider data into production'));
  assert.equal(BOULDER_COUNTY_COST_OPERATIONS_ASSESSMENT.engineeringEffort, 'MEDIUM');
  assert(BOULDER_COUNTY_COST_OPERATIONS_ASSESSMENT.monitoringNeeds.includes('license and terms page change monitoring'));

  assert.doesNotMatch(source, /fetch\(/, 'Activation gate must not acquire external data at runtime.');
  assert.doesNotMatch(source, /PrismaClient|prisma\./, 'Activation gate must not use Prisma.');
  assert.doesNotMatch(source, /INSERT INTO|UPDATE .* SET|DELETE FROM/i, 'Activation gate must not write provider data.');

  for (const [index, doc] of docs.entries()) {
    assert.match(doc, /not legal advice|no activation|not authorized|provider confirmation/i, `${REQUIRED_DOCS[index]} must preserve activation/legal boundaries.`);
    assert.match(doc, /Boulder County Open Data/i, `${REQUIRED_DOCS[index]} must be Boulder County Open Data specific.`);
  }
  assert.match(docs[0], /4d1c7e6cc12d1e55c24d42f36d262cac4b323d0a/);
  assert.match(docs[0], /51322007163/);
  assert.match(docs[1], /BOULDER_COUNTY_OPEN_DATA_ACTIVATION_GATE_1_COMPLETE/);
  assert.match(chatStart, /Boulder County Open Data Rights Confirmation/);

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert(
    packageData.scripts?.['check:boulder-county-open-data-activation-gate'],
    'package.json must expose Boulder County Open Data activation gate validation.',
  );
  assert.match(workerConfig, /checkBoulderCountyOpenDataActivationGate\.ts/);

  console.log(
    `[boulder-county-open-data-activation-gate] ok: ${BOULDER_COUNTY_OPEN_DATASETS.length} datasets, ${BOULDER_COUNTY_PROVIDER_CONFIRMATION_QUESTIONS.length} provider questions, ${BOULDER_COUNTY_COUNSEL_REVIEW_ITEMS.length} counsel items, no activation, and future persistence gate verified.`,
  );
}

main().catch((error) => {
  console.error('[boulder-county-open-data-activation-gate] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
