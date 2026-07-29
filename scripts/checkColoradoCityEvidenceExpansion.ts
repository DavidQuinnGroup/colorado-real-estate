import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  buildBoulderCountyEvidenceCoverageMatrix,
  COLORADO_CITY_EVIDENCE_EXPANSION_STATUS,
  EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX,
  getCitiesEligibleForMaturityAdvancement,
  IMAGERY_RIGHTS_INVENTORY,
  runEvidenceExpansionDryRun,
  type EvidenceExpansionDomain,
} from '../lib/coloradoCityEvidenceExpansion.js';
import {
  REQUIRED_CITY_INTELLIGENCE_DOMAINS,
  type CityIntelligenceDomain,
} from '../lib/coloradoCityIntelligenceFactory.js';

const EXPECTED_PRIORITY_CITIES = ['Boulder', 'Louisville', 'Lafayette', 'Superior', 'Erie', 'Longmont'] as const;
const REQUIRED_EXPANSION_DOMAINS: readonly EvidenceExpansionDomain[] = [
  'ASSESSOR',
  'BUILDING_PERMITS',
  'MUNICIPAL_PLANNING',
  'IMAGERY_RIGHTS',
  'MLS_DERIVED',
];

function assertUnique(values: readonly string[], label: string) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  assert.equal(duplicates.length, 0, `${label} must not contain duplicate values: ${duplicates.join(', ')}`);
}

function countByDomain(candidates: ReturnType<typeof runEvidenceExpansionDryRun>, domain: CityIntelligenceDomain) {
  return candidates.filter((candidate) => candidate.domain === domain).length;
}

async function main() {
  const [packageJson, workerConfig, chatStart, expansionSource, implementationRecord, rightsMatrixRecord, coverageRecord, imageryRecord, activationPlan] =
    await Promise.all([
      readFile('package.json', 'utf8'),
      readFile('tsconfig.worker.json', 'utf8'),
      readFile('docs/CHAT_START.md', 'utf8'),
      readFile('lib/coloradoCityEvidenceExpansion.ts', 'utf8'),
      readFile('docs/project-atlas/executive-library/COLORADO-CITY-INTELLIGENCE-EVIDENCE-EXPANSION-1-IMPLEMENTATION.md', 'utf8'),
      readFile('docs/project-atlas/executive-library/COLORADO-CITY-INTELLIGENCE-SOURCE-RIGHTS-MATRIX-1.md', 'utf8'),
      readFile('docs/project-atlas/executive-library/BOULDER-COUNTY-EVIDENCE-COVERAGE-MATRIX-1.md', 'utf8'),
      readFile('docs/project-atlas/executive-library/COLORADO-CITY-IMAGERY-RIGHTS-INVENTORY-1.md', 'utf8'),
      readFile('docs/project-atlas/executive-library/COLORADO-CITY-INTELLIGENCE-PERSISTENCE-PROVIDER-ACTIVATION-PLAN-1.md', 'utf8'),
    ]);

  assert.equal(COLORADO_CITY_EVIDENCE_EXPANSION_STATUS, 'COLORADO_CITY_INTELLIGENCE_EVIDENCE_EXPANSION_1_COMPLETE');
  assertUnique(EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX.map((source) => source.sourceId), 'Evidence expansion source ids');
  assert.equal(EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX.length, 8, 'Evidence expansion must preserve the governed eight-source rights matrix.');

  for (const domain of REQUIRED_EXPANSION_DOMAINS) {
    assert(
      EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX.some((source) => source.domain === domain),
      `Source-rights matrix must cover ${domain}.`,
    );
  }

  const expectedSources = [
    'repository:lib/cities.ts + lib/coloradoDecisionGuideRegistry.ts',
    'https://bouldercounty.gov/government/open-data/',
    'https://bouldercounty.gov/departments/assessor/',
    'https://aca-prod.accela.com/BOCO/',
    'https://bouldercolorado.gov/planning-development-services-records-request-resources',
    'https://bouldercolorado.gov/government/departments/planning-development-services',
    'https://boulder.co.ds.search.govos.com/',
    'repository:public imagery assets + future rights ledger',
  ];
  for (const url of expectedSources) {
    assert(EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX.some((source) => source.url === url), `Missing governed source URL: ${url}`);
  }

  for (const source of EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX) {
    assert(source.knownLimitations.length > 0, `${source.sourceId} must document limitations.`);
    assert(source.attributionRequirement.length > 0, `${source.sourceId} must document attribution requirements.`);
    assert.notEqual(source.permittedPublicDisplay, 'YES_WITH_ATTRIBUTION', `${source.sourceId} must not become public-display approved in this wave.`);
    if (source.rightsStatus !== 'PUBLIC_TERMS_IDENTIFIED') {
      assert.notEqual(source.permittedStorage, 'YES_REPOSITORY_LOCAL', `${source.sourceId} must not permit durable storage before rights review.`);
      assert(
        source.automationFeasibility === 'DRY_RUN_ONLY' ||
          source.automationFeasibility === 'POSSIBLE_AFTER_RIGHTS_REVIEW' ||
          source.automationFeasibility === 'BLOCKED_PENDING_TERMS',
        `${source.sourceId} must remain dry-run or rights-blocked.`,
      );
    }
    if (source.domain === 'IMAGERY_RIGHTS') {
      assert.equal(source.rightsStatus, 'BLOCKED_PENDING_RIGHTS', 'Imagery expansion must fail closed pending asset-level rights.');
    }
  }

  assert.equal(IMAGERY_RIGHTS_INVENTORY.length, 7, 'Imagery inventory must cover fallback plus six priority city candidates.');
  const publicImages = IMAGERY_RIGHTS_INVENTORY.filter((image) => image.publicEligibility);
  assert.equal(publicImages.length, 1, 'Only the existing approved fallback image may be public eligible.');
  assert.equal(publicImages[0].imageId, 'IMG-DQG-FALLBACK-HOME');
  for (const image of IMAGERY_RIGHTS_INVENTORY) {
    assert(image.fallback.length > 0, `${image.imageId} must define fallback behavior.`);
    if (!image.publicEligibility) {
      assert.equal(image.permittedUse, 'UNKNOWN_REQUIRES_REVIEW', `${image.imageId} must fail closed until rights review.`);
      assert.equal(image.editorialApproval, false, `${image.imageId} cannot be editorially approved without rights.`);
    }
  }

  const candidates = runEvidenceExpansionDryRun();
  assert(candidates.length >= EXPECTED_PRIORITY_CITIES.length * 2, 'Dry run must represent each priority city with acquired or blocked evidence candidates.');
  assertUnique(candidates.map((candidate) => candidate.evidenceCandidateId), 'Evidence candidate ids');
  assertUnique(candidates.map((candidate) => candidate.duplicateKey), 'Evidence candidate duplicate keys');
  assert(countByDomain(candidates, 'MARKET_INTERPRETATION') >= EXPECTED_PRIORITY_CITIES.length - 1, 'Dry run must include market interpretation candidates where repository-local market data exists.');
  assert(countByDomain(candidates, 'HOUSING_PATTERNS') >= EXPECTED_PRIORITY_CITIES.length - 1, 'Dry run must include housing pattern candidates where repository-local market data exists.');

  for (const candidate of candidates) {
    assert.equal(candidate.customerVisible, false, `${candidate.evidenceCandidateId} must not be customer visible.`);
    assert(candidate.provenance.sourceIdentity.length > 0, `${candidate.evidenceCandidateId} must include source identity.`);
    assert(candidate.provenance.acquisitionRecordId.startsWith('EXP-DRYRUN-'), `${candidate.evidenceCandidateId} must use a dry-run acquisition id.`);
    assert(candidate.provenance.evidenceVersionId.startsWith('EXP-V1-'), `${candidate.evidenceCandidateId} must define an evidence version.`);
    assert.match(candidate.normalizedSubject, /^Colorado\|/, `${candidate.evidenceCandidateId} must normalize to Colorado city subject.`);
    assert.notEqual(candidate.provenance.permittedPublicDisplay, 'YES_WITH_ATTRIBUTION', `${candidate.evidenceCandidateId} must not be public-display approved.`);
    assert(!/forecast|prediction|appreciation|school ranking|safety ranking|crime score|demographic recommendation/i.test(candidate.supportedObservation), `${candidate.evidenceCandidateId} must avoid prohibited claims.`);
  }

  const coverage = buildBoulderCountyEvidenceCoverageMatrix();
  assert.deepEqual(coverage.map((row) => row.city), [...EXPECTED_PRIORITY_CITIES], 'Coverage matrix must preserve the six-city Boulder County wave.');
  for (const row of coverage) {
    assert(REQUIRED_CITY_INTELLIGENCE_DOMAINS.every((domain) => row.coverage[domain]), `${row.city} must report every required domain.`);
    assert(row.evidenceCurrentlyAvailable.length > 0, `${row.city} must have dry-run evidence candidates or explicit blockers.`);
    if (row.city !== 'Superior') {
      assert(row.evidenceAcquiredInDryRun.length > 0, `${row.city} must have acquired repository-local dry-run evidence candidates.`);
    }
    assert(row.evidenceMissing.length > 0, `${row.city} must preserve missing domains.`);
    assert.notEqual(row.resultingMaturityPotential, 'EVIDENCE_COMPLETE', `${row.city} cannot become evidence complete from this dry run.`);
    if (['Boulder', 'Louisville', 'Lafayette'].includes(row.city)) {
      assert.equal(row.currentMaturity, 'EDITORIALLY_CERTIFIED', `${row.city} must preserve current editorial maturity.`);
    } else {
      assert.notEqual(row.currentMaturity, 'EDITORIALLY_CERTIFIED', `${row.city} must not be editorially certified by evidence expansion.`);
    }
  }

  const advancement = getCitiesEligibleForMaturityAdvancement();
  assert.equal(advancement.length, EXPECTED_PRIORITY_CITIES.length, 'Maturity advancement report must cover all priority cities.');
  assert(
    advancement.some((row) => row.city === 'Erie' && row.to === 'EVIDENCE_IN_PROGRESS' && row.blockers.length > 0),
    'Erie may move toward evidence-in-progress but must retain blockers.',
  );
  assert(
    advancement.some((row) => row.city === 'Longmont' && row.to === 'EVIDENCE_IN_PROGRESS' && row.blockers.length > 0),
    'Longmont may move toward evidence-in-progress but must retain blockers.',
  );

  assert.match(expansionSource, /customerVisible: false/, 'Evidence expansion must keep candidates non-customer-visible.');
  assert.match(expansionSource, /EXP-DRYRUN-/, 'Evidence expansion must identify dry-run acquisition records.');
  assert.doesNotMatch(expansionSource, /fetch\(/, 'Evidence expansion must not fetch external sources.');
  assert.doesNotMatch(expansionSource, /PrismaClient|prisma\./, 'Evidence expansion must not use Prisma or persistence.');
  assert.doesNotMatch(expansionSource, /INSERT INTO|UPDATE .* SET|DELETE FROM/i, 'Evidence expansion must not include database mutation.');

  assert.match(implementationRecord, /No public city guide publication/, 'Implementation record must document no public guide publication.');
  assert.match(rightsMatrixRecord, /Source Rights Matrix/, 'Source-rights documentation must exist.');
  assert.match(coverageRecord, /Boulder County Evidence Coverage Matrix/, 'Coverage matrix documentation must exist.');
  assert.match(imageryRecord, /Imagery Rights Inventory/, 'Imagery rights documentation must exist.');
  assert.match(activationPlan, /Persistence and Provider Activation Plan/, 'Persistence/provider activation plan must exist.');
  assert.match(activationPlan, /not authorized/i, 'Activation plan must preserve not-authorized status.');
  assert.match(chatStart, /City Intelligence Evidence Expansion/, 'CHAT_START must include the active evidence expansion handoff.');

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert(
    packageData.scripts?.['check:colorado-city-evidence-expansion'],
    'package.json must expose the Colorado City Evidence Expansion validation check.',
  );
  assert.match(workerConfig, /checkColoradoCityEvidenceExpansion\.ts/, 'Worker config must compile the evidence expansion validation check.');

  console.log(
    `[colorado-city-evidence-expansion] ok: ${EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX.length} source-rights records, ${IMAGERY_RIGHTS_INVENTORY.length} imagery records, ${candidates.length} dry-run evidence candidates, ${coverage.length} city coverage rows, no-write acquisition, rights gates, and maturity safeguards verified.`,
  );
}

main().catch((error) => {
  console.error('[colorado-city-evidence-expansion] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
