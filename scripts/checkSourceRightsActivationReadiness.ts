import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  getPublicDecisionGuideRegistryEntries,
} from '../lib/coloradoDecisionGuideRegistry.js';
import {
  getActivationRanking,
  getRecommendedFirstActivation,
  IMAGERY_ACQUISITION_STRATEGY,
  PERSISTENCE_READINESS_SPECIFICATION,
  SOURCE_RIGHTS_ACTIVATION_READINESS_STATUS,
  SOURCE_RIGHTS_ACTIVATION_RECORDS,
} from '../lib/sourceRightsActivationReadiness.js';

const REQUIRED_DOCS = [
  'docs/project-atlas/executive-library/COLORADO-CITY-INTELLIGENCE-EVIDENCE-EXPANSION-1-PRODUCTION-CERTIFICATION.md',
  'docs/project-atlas/executive-library/DECISION-GUIDE-DISCOVERY-EXPERIENCE-1-IMPLEMENTATION.md',
  'docs/project-atlas/executive-library/SOURCE-RIGHTS-ACTIVATION-READINESS-1-MATRIX.md',
  'docs/project-atlas/executive-library/COUNSEL-PROVIDER-REVIEW-PACKET-1.md',
  'docs/project-atlas/executive-library/FIRST-SOURCE-ACTIVATION-RECOMMENDATION-1.md',
  'docs/project-atlas/executive-library/PERSISTENCE-READINESS-SPECIFICATION-1.md',
  'docs/project-atlas/executive-library/COLORADO-IMAGERY-ACQUISITION-PLAN-1.md',
] as const;

const EXPECTED_ENHANCED_FOUNDATION_CITY_INVENTORY = [
  'Brighton',
  'Broomfield',
  'Denver',
  'Erie',
  'Firestone',
  'Frederick',
  'Longmont',
  'Superior',
  'Westminster',
] as const;

const EXPECTED_ENHANCED_FOUNDATION_CITY_FINGERPRINT = EXPECTED_ENHANCED_FOUNDATION_CITY_INVENTORY.join('|');

function assertUnique(values: readonly string[], label: string) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  assert.equal(duplicates.length, 0, `${label} must not contain duplicate values: ${duplicates.join(', ')}`);
}

async function main() {
  const [marketPage, readinessSource, packageJson, workerConfig, chatStart, ...docs] = await Promise.all([
    readFile('app/market/page.tsx', 'utf8'),
    readFile('lib/sourceRightsActivationReadiness.ts', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('tsconfig.worker.json', 'utf8'),
    readFile('docs/CHAT_START.md', 'utf8'),
    ...REQUIRED_DOCS.map((doc) => readFile(doc, 'utf8')),
  ]);

  assert.equal(SOURCE_RIGHTS_ACTIVATION_READINESS_STATUS, 'SOURCE_RIGHTS_ACTIVATION_READINESS_1_COMPLETE');

  const certifiedGuides = getPublicDecisionGuideRegistryEntries().filter(
    (entry) => entry.guideMaturity === 'EDITORIALLY_CERTIFIED' && entry.optionalEditorialOverride,
  );
  assert.deepEqual(
    certifiedGuides.map((entry) => entry.canonicalName).sort(),
    ['Boulder', 'Lafayette', 'Louisville'],
    'Only Boulder, Lafayette, and Louisville may appear as certified Decision Guides.',
  );
  assert.equal(
    getPublicDecisionGuideRegistryEntries().filter((entry) => entry.guideMaturity === 'FOUNDATION').length,
    0,
    'Public FOUNDATION Local Decision Intelligence backlog must remain closed after Phase 2 Wave 3.',
  );
  const enhancedFoundationCityInventory = getPublicDecisionGuideRegistryEntries()
    .filter((entry) => entry.guideMaturity === 'ENHANCED_FOUNDATION')
    .map((entry) => entry.canonicalName)
    .sort();
  assert.deepEqual(
    enhancedFoundationCityInventory,
    EXPECTED_ENHANCED_FOUNDATION_CITY_INVENTORY,
    'Enhanced Foundation city inventory must match the current canonical Decision Guide registry.',
  );
  assert.equal(
    enhancedFoundationCityInventory.join('|'),
    EXPECTED_ENHANCED_FOUNDATION_CITY_FINGERPRINT,
    'Enhanced Foundation city inventory fingerprint must remain deterministic.',
  );
  assert.match(marketPage, /decision-guide-discovery-certified/, 'Market page must expose certified guide discovery section.');
  assert.match(marketPage, /data-decision-guide-discovery-foundation-promoted="false"/, 'Market page must explicitly block foundation promotion.');
  assert.match(marketPage, /guideMaturity === 'EDITORIALLY_CERTIFIED'/, 'Market page discovery must filter to editorial certification.');
  assert.match(marketPage, /optionalEditorialOverride/, 'Market page discovery must require editorial override support.');

  assert(SOURCE_RIGHTS_ACTIVATION_RECORDS.length >= 8, 'Source-rights dossier must cover the requested source classes.');
  assertUnique(SOURCE_RIGHTS_ACTIVATION_RECORDS.map((source) => source.sourceId), 'Source-rights source ids');

  for (const source of SOURCE_RIGHTS_ACTIVATION_RECORDS) {
    assert(source.legalEntityOrProvider.length > 0, `${source.sourceId} must identify legal entity/provider.`);
    assert(source.officialSourceUrl.length > 0, `${source.sourceId} must identify official source URL.`);
    assert(source.termsOfUseLocation.length > 0, `${source.sourceId} must identify terms location.`);
    assert(source.datasetsOrRecordsRequired.length > 0, `${source.sourceId} must identify required records.`);
    assert(source.accessMethod.length > 0, `${source.sourceId} must identify access method.`);
    assert(source.license.length > 0, `${source.sourceId} must identify license posture.`);
    assert(source.storagePermission.length > 0, `${source.sourceId} must identify storage posture.`);
    assert(source.transformationPermission.length > 0, `${source.sourceId} must identify transformation posture.`);
    assert(source.aggregationPermission.length > 0, `${source.sourceId} must identify aggregation posture.`);
    assert(source.publicDisplayPermission.length > 0, `${source.sourceId} must identify public display posture.`);
    assert(source.redistributionRestrictions.length > 0, `${source.sourceId} must identify redistribution restrictions.`);
    assert(source.attributionRequirements.length > 0, `${source.sourceId} must identify attribution.`);
    assert(source.rateLimits.length > 0, `${source.sourceId} must identify rate-limit status.`);
    assert(source.credentialRequirements.length > 0, `${source.sourceId} must identify credential requirements.`);
    assert(source.fees.length > 0, `${source.sourceId} must identify fee posture.`);
    assert(source.updateCadence.length > 0, `${source.sourceId} must identify update cadence.`);
    assert(source.retentionRestrictions.length > 0, `${source.sourceId} must identify retention restrictions.`);
    assert(source.deletionObligations.length > 0, `${source.sourceId} must identify deletion obligations.`);
    assert(source.privacyConsiderations.length > 0, `${source.sourceId} must identify privacy considerations.`);
    assert(source.unresolvedLanguage.length > 0, `${source.sourceId} must identify unresolved language.`);
    assert(source.counselQuestion.length > 0, `${source.sourceId} must identify counsel/provider question.`);
    if (source.sourceId !== 'SRA-MLS-DERIVED-CITY-INTELLIGENCE') {
      assert.notEqual(source.recommendedDecision, 'APPROVE', `${source.sourceId} must not receive final approval unless already governed.`);
    }
  }

  const mls = SOURCE_RIGHTS_ACTIVATION_RECORDS.find((source) => source.sourceId === 'SRA-MLS-DERIVED-CITY-INTELLIGENCE');
  assert(mls, 'Existing MLS-derived city intelligence must be represented.');
  assert.equal(mls.recommendedDecision, 'APPROVE', 'Only existing governed MLS-derived repository data may be approved.');

  const ranking = getActivationRanking();
  assert.equal(ranking[0].sourceId, 'SRA-BOULDER-COUNTY-OPEN-DATA', 'Boulder County Open Data must rank first for initial evidence activation.');
  assert.equal(getRecommendedFirstActivation().sourceId, 'SRA-BOULDER-COUNTY-OPEN-DATA', 'Recommended first activation must be Boulder County Open Data.');
  assert.equal(getRecommendedFirstActivation().recommendedDecision, 'APPROVE_WITH_CONDITIONS', 'First activation must require conditions, not legal conclusion.');

  assert.equal(PERSISTENCE_READINESS_SPECIFICATION.existingPersistenceReusable, false, 'Existing persistence must not be treated as sufficient.');
  assert.equal(PERSISTENCE_READINESS_SPECIFICATION.futureMigrationRequired, true, 'Future migration must be required for durable evidence.');
  assert(PERSISTENCE_READINESS_SPECIFICATION.prohibitedUntilAuthorized.includes('provider execution'), 'Provider execution must remain blocked.');
  assert(PERSISTENCE_READINESS_SPECIFICATION.prohibitedUntilAuthorized.includes('durable external-source writes'), 'Durable external writes must remain blocked.');

  assert(
    IMAGERY_ACQUISITION_STRATEGY.some((strategy) => strategy.channel === 'DQG photography program' && strategy.speed === 'FASTEST' && strategy.rightsConfidence === 'HIGH'),
    'Imagery plan must identify DQG photography as the fastest high-confidence path.',
  );
  assert(
    IMAGERY_ACQUISITION_STRATEGY.some((strategy) => strategy.channel === 'Fallback imagery' && strategy.rightsConfidence === 'HIGH'),
    'Imagery plan must preserve fallback imagery.',
  );

  assert.doesNotMatch(readinessSource, /fetch\(/, 'Source-rights readiness must not fetch external sources.');
  assert.doesNotMatch(readinessSource, /PrismaClient|prisma\./, 'Source-rights readiness must not use Prisma.');
  assert.doesNotMatch(readinessSource, /INSERT INTO|UPDATE .* SET|DELETE FROM/i, 'Source-rights readiness must not write provider data.');

  for (const [index, doc] of docs.entries()) {
    assert.match(doc, /not legal advice|not issue final legal conclusions|not authorized/i, `${REQUIRED_DOCS[index]} must preserve legal/activation boundary.`);
  }
  assert.match(chatStart, /Source Rights Resolution/, 'CHAT_START must include Source Rights Resolution handoff.');

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert(
    packageData.scripts?.['check:source-rights-activation-readiness'],
    'package.json must expose source-rights activation readiness validation.',
  );
  assert.match(workerConfig, /checkSourceRightsActivationReadiness\.ts/, 'Worker config must compile source-rights activation readiness validation.');

  console.log(
    `[source-rights-activation-readiness] ok: ${certifiedGuides.length} certified guides, ${SOURCE_RIGHTS_ACTIVATION_RECORDS.length} source-rights records, ${ranking.length} ranked activation candidates, persistence blocked pending migration, imagery fail-closed, and provider/legal gates verified.`,
  );
}

main().catch((error) => {
  console.error('[source-rights-activation-readiness] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
