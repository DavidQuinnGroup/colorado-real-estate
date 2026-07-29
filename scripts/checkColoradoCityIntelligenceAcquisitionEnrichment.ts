import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { getColoradoDecisionGuideRegistry } from '../lib/coloradoDecisionGuideRegistry.js';
import {
  buildStatewideCityIntelligenceCoverageReport,
  CITY_INTELLIGENCE_ACQUISITION_ADAPTERS,
  CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX,
  COLORADO_CITY_INTELLIGENCE_FACTORY_STATUS,
  COLORADO_CITY_INTELLIGENCE_RECORDS,
  PROHIBITED_CITY_INTELLIGENCE_OUTPUTS,
  REQUIRED_CITY_INTELLIGENCE_DOMAINS,
  isEditorialCertificationEligible,
  isEvidenceComplete,
  runCityIntelligenceAcquisition,
  synthesizeCityGuideIntelligence,
  type CityIntelligenceDomain,
  type CityIntelligenceMaturity,
} from '../lib/coloradoCityIntelligenceFactory.js';
import { GIS_FAIL_CLOSED_ACTIVATION, isGisActivationClosed } from '../lib/geographic-intelligence/activationContract.js';

function assertUnique(values: readonly string[], label: string) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  assert.equal(duplicates.length, 0, `${label} must not contain duplicate values: ${duplicates.join(', ')}`);
}

function domainStatus(recordKey: string, domain: CityIntelligenceDomain) {
  const record = COLORADO_CITY_INTELLIGENCE_RECORDS.find((item) => item.cityKey === recordKey);
  assert(record, `${recordKey} must exist.`);
  return record.domainCompleteness[domain];
}

async function main() {
  const [factorySource, packageJson, workerConfig, chatStart, implementationRecord] = await Promise.all([
    readFile('lib/coloradoCityIntelligenceFactory.ts', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('tsconfig.worker.json', 'utf8'),
    readFile('docs/CHAT_START.md', 'utf8'),
    readFile('docs/project-atlas/executive-library/COLORADO-CITY-INTELLIGENCE-ACQUISITION-ENRICHMENT-1-IMPLEMENTATION.md', 'utf8'),
  ]);

  assert.equal(COLORADO_CITY_INTELLIGENCE_FACTORY_STATUS, 'COLORADO_CITY_INTELLIGENCE_ACQUISITION_ENRICHMENT_1_COMPLETE');
  assert(COLORADO_CITY_INTELLIGENCE_RECORDS.length >= 5, 'Factory must validate representative city coverage.');
  assertUnique(COLORADO_CITY_INTELLIGENCE_RECORDS.map((record) => record.cityKey), 'City intelligence keys');
  assertUnique(CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX.map((source) => source.category), 'Source categories');
  assert(CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX.length >= 17, 'Source-domain matrix must cover required acquisition categories.');

  for (const source of CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX) {
    assert(source.intelligenceDomains.length > 0, `${source.category} must map to at least one intelligence domain.`);
    assert(source.geographicCoverage.length > 0, `${source.category} must document geographic coverage.`);
    assert(source.knownLimitations.length > 0, `${source.category} must preserve known limitations.`);
    if (source.publicDisplayEligibility === 'PUBLIC_ELIGIBLE') {
      assert.equal(source.licensingOrPermittedUse, 'CONFIRMED_PUBLIC_DISPLAY', `${source.category} public display requires confirmed permitted use.`);
    }
    if (source.storageEligibility === 'DURABLE_STORAGE_REQUIRES_SCHEMA') {
      assert(
        source.adapterReadiness === 'REQUIRES_CREDENTIAL' || source.adapterReadiness === 'REQUIRES_LICENSE_REVIEW',
        `${source.category} durable storage must remain blocked without schema/provider authorization.`,
      );
    }
  }

  for (const adapter of CITY_INTELLIGENCE_ACQUISITION_ADAPTERS) {
    assert(adapter.modeSupport.includes('dry-run'), `${adapter.adapterId} must support dry-run mode.`);
    assert(adapter.modeSupport.includes('execute'), `${adapter.adapterId} must define execute-mode boundary.`);
    assert.equal(adapter.executeAuthorized, false, `${adapter.adapterId} execute mode must not be authorized.`);
    assert.equal(adapter.evidenceDeduplication, true, `${adapter.adapterId} must deduplicate evidence.`);
    assert.equal(adapter.versioning, true, `${adapter.adapterId} must version evidence.`);
    assert.equal(adapter.conflictPreservation, true, `${adapter.adapterId} must preserve conflicts.`);
    assert.equal(adapter.customerVisiblePartialClaims, false, `${adapter.adapterId} must block customer-visible partial claims.`);
  }

  const dryRun = runCityIntelligenceAcquisition({
    adapterId: 'city-market-repository-adapter',
    cityKey: 'boulder',
    mode: 'dry-run',
  });
  assert.equal(dryRun.status, 'DRY_RUN_READY', 'Dry-run acquisition must be available for fixture certification.');
  assert.equal(dryRun.evidenceVersionCreated, false, 'Dry-run acquisition must not write evidence.');
  assert.equal(dryRun.customerVisibleChange, false, 'Dry-run acquisition must not change customer output.');
  assert.deepEqual(dryRun.activation, GIS_FAIL_CLOSED_ACTIVATION, 'Dry-run acquisition must remain fail-closed.');

  const executeAttempt = runCityIntelligenceAcquisition({
    adapterId: 'city-market-repository-adapter',
    cityKey: 'boulder',
    mode: 'execute',
  });
  assert.equal(executeAttempt.status, 'EXECUTE_BLOCKED', 'Execute mode must be blocked without separate authorization.');
  assert.equal(executeAttempt.evidenceVersionCreated, false, 'Blocked execute mode must not write evidence.');
  assert(isGisActivationClosed(executeAttempt.activation), 'Blocked execute mode must keep GIS activation closed.');

  const boulder = COLORADO_CITY_INTELLIGENCE_RECORDS.find((record) => record.cityKey === 'boulder');
  const louisville = COLORADO_CITY_INTELLIGENCE_RECORDS.find((record) => record.cityKey === 'louisville');
  const broomfield = COLORADO_CITY_INTELLIGENCE_RECORDS.find((record) => record.cityKey === 'broomfield');
  const superior = COLORADO_CITY_INTELLIGENCE_RECORDS.find((record) => record.cityKey === 'superior');
  const niwot = COLORADO_CITY_INTELLIGENCE_RECORDS.find((record) => record.cityKey === 'niwot');

  assert(boulder, 'Boulder editorially certified reference must exist.');
  assert(louisville, 'Second editorially certified reference must exist.');
  assert(broomfield, 'Foundation representative city must exist.');
  assert(superior, 'Incomplete source coverage representative city must exist.');
  assert(niwot, 'Ineligible fail-closed representative city must exist.');

  assert.equal(boulder.maturity, 'EDITORIALLY_CERTIFIED');
  assert.equal(louisville.maturity, 'EDITORIALLY_CERTIFIED');
  assert.equal(broomfield.maturity, 'FOUNDATION');
  assert.equal(superior.maturity, 'EVIDENCE_IN_PROGRESS');
  assert.equal(niwot.publicEligibility, false);

  for (const record of [boulder, louisville]) {
    assert(isEvidenceComplete(record), `${record.canonicalName} must satisfy evidence completeness.`);
    assert(isEditorialCertificationEligible(record), `${record.canonicalName} must satisfy editorial certification gates.`);
    assert.equal(synthesizeCityGuideIntelligence(record).publishable, true, `${record.canonicalName} synthesis must be publishable.`);
  }

  assert.equal(isEvidenceComplete(broomfield), false, 'Foundation city must not be treated as evidence complete.');
  assert.equal(isEvidenceComplete(superior), false, 'Incomplete city must not be treated as evidence complete.');
  assert.equal(isEvidenceComplete(niwot), false, 'Ineligible city must not be treated as evidence complete.');
  assert.equal(synthesizeCityGuideIntelligence(broomfield).publishable, false, 'Foundation enrichment synthesis must fail closed until domains are complete.');
  assert.equal(synthesizeCityGuideIntelligence(superior).publishable, false, 'Incomplete source coverage must fail closed.');
  assert.equal(synthesizeCityGuideIntelligence(niwot).publishable, false, 'Ineligible city must fail closed.');
  assert(synthesizeCityGuideIntelligence(superior).failClosedReason?.includes('CIF-CONFLICT-SUP-BOUNDARY'), 'Unresolved conflicts must be preserved in fail-closed output.');

  for (const domain of REQUIRED_CITY_INTELLIGENCE_DOMAINS) {
    assert.equal(domainStatus('boulder', domain), 'CERTIFIED', `Boulder must certify ${domain}.`);
    assert.equal(domainStatus('louisville', domain), 'CERTIFIED', `Louisville must certify ${domain}.`);
  }

  for (const record of COLORADO_CITY_INTELLIGENCE_RECORDS) {
    assert.equal(record.geographic.state, 'Colorado', `${record.canonicalName} must stay within Colorado model.`);
    assert.equal(record.geographic.publicGisActivated, false, `${record.canonicalName} must not activate public GIS.`);
    assert(record.geographic.temporalChangeSupport, `${record.canonicalName} must support temporal geographic changes.`);
    for (const evidence of record.evidence) {
      assert(evidence.sourceIdentity.length > 0, `${evidence.evidenceId} must include source identity.`);
      assert(evidence.acquisitionRecordId.length > 0, `${evidence.evidenceId} must include acquisition record.`);
      assert(evidence.evidenceVersionId.length > 0, `${evidence.evidenceId} must include evidence version.`);
      assert(evidence.observationDate.length > 0, `${evidence.evidenceId} must include observation date.`);
      assert(evidence.geographicSubject.length > 0, `${evidence.evidenceId} must include geographic subject.`);
      assert(REQUIRED_CITY_INTELLIGENCE_DOMAINS.includes(evidence.domain), `${evidence.evidenceId} must map to a required domain.`);
      assert.equal(evidence.publicDisplayEligible, false, `${evidence.evidenceId} must remain internal until public-display review.`);
    }
    for (const image of record.imagery) {
      if (image.publicEligibility) {
        assert.equal(image.licenseOrPermittedUse, 'CONFIRMED_PUBLIC_DISPLAY', `${image.imageIdentity} requires public-display rights.`);
        assert.equal(image.editorialApproval, true, `${image.imageIdentity} requires editorial approval.`);
      } else {
        assert.notEqual(image.licenseOrPermittedUse, 'CONFIRMED_PUBLIC_DISPLAY', `${image.imageIdentity} cannot be public without confirmed rights.`);
      }
      assert(image.fallbackAsset.length > 0, `${image.imageIdentity} must define fallback behavior.`);
    }
  }

  const coverage = buildStatewideCityIntelligenceCoverageReport();
  assert.equal(coverage.totalRegisteredCities, COLORADO_CITY_INTELLIGENCE_RECORDS.length, 'Coverage report must count registered cities.');
  assert.equal(coverage.maturityCounts.EDITORIALLY_CERTIFIED, 2, 'Coverage report must include two certified reference cities.');
  assert(coverage.missingSourceCategories.includes('LICENSED_EDITORIAL_IMAGERY'), 'Coverage report must identify imagery gaps.');
  assert(coverage.unresolvedConflicts.includes('CIF-CONFLICT-SUP-BOUNDARY'), 'Coverage report must preserve unresolved conflicts.');
  assert(coverage.blockedGuides.some((guide) => guide.cityKey === 'niwot'), 'Coverage report must list fail-closed blocked guides.');

  const decisionGuideRegistry = getColoradoDecisionGuideRegistry();
  assert(
    COLORADO_CITY_INTELLIGENCE_RECORDS.every((record) =>
      decisionGuideRegistry.some((entry) => entry.canonicalName.toLowerCase() === record.canonicalName.toLowerCase()),
    ),
    'Representative city intelligence records must reconcile with the Decision Guide registry.',
  );

  const maturityOrder: readonly CityIntelligenceMaturity[] = [
    'FOUNDATION',
    'EVIDENCE_IN_PROGRESS',
    'EVIDENCE_COMPLETE',
    'EDITORIALLY_CERTIFIED',
    'CONTINUOUSLY_MAINTAINED',
  ];
  assert.deepEqual(
    maturityOrder,
    ['FOUNDATION', 'EVIDENCE_IN_PROGRESS', 'EVIDENCE_COMPLETE', 'EDITORIALLY_CERTIFIED', 'CONTINUOUSLY_MAINTAINED'],
    'Maturity order must preserve the governed model.',
  );

  assert(Object.values(PROHIBITED_CITY_INTELLIGENCE_OUTPUTS).every((value) => value === false), 'All prohibited outputs must remain disabled.');
  assert.match(factorySource, /GIS_FAIL_CLOSED_ACTIVATION/, 'Factory must reuse GIS fail-closed activation.');
  assert.match(factorySource, /DURABLE_STORAGE_REQUIRES_SCHEMA/, 'Factory must document persistence stop condition.');
  assert.match(factorySource, /executeAuthorized: false/, 'Factory must block execute mode.');
  assert.match(factorySource, /publicGisActivated: false/, 'Factory must block public GIS activation.');
  assert.match(implementationRecord, /Source-Domain Matrix/, 'Implementation record must document source-domain matrix.');
  assert.match(implementationRecord, /Statewide Coverage Dashboard/, 'Implementation record must document coverage reporting.');
  assert.match(chatStart, /Colorado City Intelligence Acquisition/, 'CHAT_START must include the active handoff.');

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert(
    packageData.scripts?.['check:colorado-city-intelligence-acquisition-enrichment'],
    'package.json must expose the Colorado City Intelligence Acquisition and Enrichment validation check.',
  );
  assert.match(
    workerConfig,
    /checkColoradoCityIntelligenceAcquisitionEnrichment\.ts/,
    'Worker config must compile the city intelligence validation check.',
  );

  console.log(
    `[colorado-city-intelligence-acquisition-enrichment] ok: ${COLORADO_CITY_INTELLIGENCE_RECORDS.length} representative cities, ${CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX.length} source categories, ${REQUIRED_CITY_INTELLIGENCE_DOMAINS.length} domains, dry-run acquisition, blocked execute mode, provenance, imagery, synthesis fail-closed, and trust boundaries verified.`,
  );
}

main().catch((error) => {
  console.error('[colorado-city-intelligence-acquisition-enrichment] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
