import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  createSourceQualityOperationalManifestFingerprint,
  sourceQualityOperationalManifestToAssemblyRequest,
  validateSourceQualityOperationalManifest,
} from '../lib/sourceQualityOperationalManifest';
import { SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA } from '../lib/sourceQualityOperationalManifestData';
import {
  ARAPAHOE_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL,
  convertArapahoeCountyAssessorSourceQualityEvidence,
  normalizeArapahoeCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityArapahoeCountyAssessorEvidence';
import {
  BCOD_ADDRESS_POINTS_MANIFEST_ELIGIBILITY,
  BCOD_ADDRESS_POINTS_SOURCE_ID,
  BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CERTIFICATION,
  BCOD_ADDRESS_POINTS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL,
  convertBcodAddressPointsSourceQualityEvidence,
  normalizeBcodAddressPointsSourceQualityEvidence,
} from '../lib/sourceQualityBcodAddressPointsEvidence';
import {
  BCOD_PARK_BOUNDARIES_MANIFEST_ELIGIBILITY,
  BCOD_PARK_BOUNDARIES_SOURCE_ID,
  BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_CERTIFICATION,
  BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL,
  convertBcodParkBoundariesSourceQualityEvidence,
  normalizeBcodParkBoundariesSourceQualityEvidence,
} from '../lib/sourceQualityBcodParkBoundariesEvidence';
import {
  BOULDER_COUNTY_ACCELA_PERMITS_MANIFEST_ELIGIBILITY,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL,
  convertBoulderCountyAccelaPermitsSourceQualityEvidence,
  normalizeBoulderCountyAccelaPermitsSourceQualityEvidence,
} from '../lib/sourceQualityBoulderCountyAccelaPermitsEvidence';
import {
  BOULDER_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY,
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL,
  convertBoulderCountyAssessorSourceQualityEvidence,
  normalizeBoulderCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityBoulderCountyAssessorEvidence';
import {
  BOULDER_COUNTY_PARCEL_GIS_MANIFEST_ELIGIBILITY,
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID,
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL,
  convertBoulderCountyParcelGisSourceQualityEvidence,
  normalizeBoulderCountyParcelGisSourceQualityEvidence,
} from '../lib/sourceQualityBoulderCountyParcelGisEvidence';
import {
  BOULDER_COUNTY_RECORDER_INDEX_MANIFEST_ELIGIBILITY,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CONVERSION_REQUEST,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL,
  convertBoulderCountyRecorderIndexSourceQualityEvidence,
  normalizeBoulderCountyRecorderIndexSourceQualityEvidence,
} from '../lib/sourceQualityBoulderCountyRecorderIndexEvidence';
import {
  BOULDER_COUNTY_TREASURER_MANIFEST_ELIGIBILITY,
  BOULDER_COUNTY_TREASURER_SOURCE_ID,
  BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL,
  convertBoulderCountyTreasurerSourceQualityEvidence,
  normalizeBoulderCountyTreasurerSourceQualityEvidence,
} from '../lib/sourceQualityBoulderCountyTreasurerEvidence';
import {
  BROOMFIELD_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL,
  convertBroomfieldCountyAssessorSourceQualityEvidence,
  normalizeBroomfieldCountyAssessorSourceQualityEvidence,
} from '../lib/sourceQualityBroomfieldCountyAssessorEvidence';
import {
  CITY_BOULDER_BUILDING_PERMITS_PORTAL_MANIFEST_ELIGIBILITY,
  CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID,
  CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_CERTIFICATION,
  CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_CONVERSION_REQUEST,
  CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_FIREWALL,
  convertCityBoulderBuildingPermitsPortalSourceQualityEvidence,
  normalizeCityBoulderBuildingPermitsPortalSourceQualityEvidence,
} from '../lib/sourceQualityCityBoulderBuildingPermitsPortalEvidence';
import {
  CITY_BOULDER_OPEN_DATA_PERMITS_MANIFEST_ELIGIBILITY,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CERTIFICATION,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL,
  convertCityBoulderOpenDataPermitsSourceQualityEvidence,
  normalizeCityBoulderOpenDataPermitsSourceQualityEvidence,
} from '../lib/sourceQualityCityBoulderOpenDataPermitsEvidence';
import {
  MLS_LISTING_DATA_MANIFEST_ELIGIBILITY,
  MLS_LISTING_DATA_SOURCE_ID,
  MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION,
  MLS_LISTING_DATA_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  MLS_LISTING_DATA_SOURCE_QUALITY_FIREWALL,
  MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES,
  normalizeMlsListingDataSourceQualityEvidence,
} from '../lib/sourceQualityMlsListingDataEvidence';
import {
  MUNICIPAL_PLANNING_CONTEXT_MANIFEST_ELIGIBILITY,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_CERTIFICATION,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_FIREWALL,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES,
  normalizeMunicipalPlanningContextSourceQualityEvidence,
} from '../lib/sourceQualityMunicipalPlanningContextEvidence';
import { getReieSourceRegistry } from '../lib/sourceRegistry';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';
import { composeSourceQualityReport } from '../lib/sourceQualityReport';

const PRIOR_NINE_ENTRY_FINGERPRINTS = new Map([
  [BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID, 'source-quality-operational-manifest:v1:64c2da16'],
  [BOULDER_COUNTY_ASSESSOR_SOURCE_ID, 'source-quality-operational-manifest:v1:73bd531d'],
  [BOULDER_COUNTY_TREASURER_SOURCE_ID, 'source-quality-operational-manifest:v1:636ab5ed'],
  [CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID, 'source-quality-operational-manifest:v1:96384f7b'],
  [CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID, 'source-quality-operational-manifest:v1:b840ce0b'],
  [MLS_LISTING_DATA_SOURCE_ID, 'source-quality-operational-manifest:v1:55c44295'],
  [MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID, 'source-quality-operational-manifest:v1:d5244c8f'],
  ['SRC-REIE-FINANCING-SCENARIO-CALCULATOR', 'source-quality-operational-manifest:v1:cc17d4a2'],
  ['SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE', 'source-quality-operational-manifest:v1:891edde9'],
]);

const RECORDER_INDEX_ENTRY_FINGERPRINT = 'source-quality-operational-manifest:v1:810478bd';

type RegistryLifecycleRecord = ReturnType<typeof getReieSourceRegistry>['records'][number];

function isGovernedPreManifestCountyAssessor(record: RegistryLifecycleRecord): boolean {
  const text = JSON.stringify(record);
  return /^SRC-[A-Z]+-COUNTY-ASSESSOR$/.test(record.sourceId)
    && record.sourceClass === 'AUTHORITATIVE_SOURCE'
    && record.category === 'COUNTY_ASSESSOR'
    && record.authorizationState === 'AWAITING_PROVIDER_CONFIRMATION'
    && record.productionActivationState === 'BLOCKED_NOT_AUTHORIZED'
    && record.claimEligible === false
    && record.currentReieUse.includes('Exact source identity only')
    && text.includes('SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV')
    && text.includes('CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV')
    && text.includes('LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV')
    && text.includes('COUNTY_ASSESSOR_NOT_COUNTY_TREASURER')
    && text.includes('COUNTY_ASSESSOR_NOT_RECORDER')
    && text.includes('COUNTY_ASSESSOR_NOT_PARCEL_GIS')
    && text.includes('Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown')
    && (record.sourcePaths ?? []).some((sourcePath) => sourcePath.includes('EXACT_SOURCE_REGISTRY_MVV'));
}

function explainRegistryOnlySourceIds(records: readonly RegistryLifecycleRecord[], manifestIds: readonly string[]) {
  const manifestSet = new Set(manifestIds);
  return records
    .filter((record) => !manifestSet.has(record.sourceId))
    .map((record) => {
      if (record.sourceId === 'SRC-BOULDER-PERMIT-CANDIDATES') {
        assert.equal(record.lifecyclePosture, 'NON_OPERATIONAL_DISCOVERY_VERIFICATION_CONTEXT');
        assert.equal(record.sourceQualityAdvancementEligibility, 'NOT_ELIGIBLE_NON_OPERATIONAL_CONTEXT');
        return { sourceId: record.sourceId, reason: 'EXPLICIT_NON_OPERATIONAL_REGISTRY_IDENTITY' };
      }
      assert.ok(isGovernedPreManifestCountyAssessor(record), 'Registry-only source requires governed pre-Manifest lifecycle posture: ' + record.sourceId);
      return { sourceId: record.sourceId, reason: 'GOVERNED_PRE_MANIFEST_COUNTY_ASSESSOR_LIFECYCLE' };
    });
}

const valid = validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA);
assert.equal(valid.classification, 'PARTIAL_OPERATIONAL_MANIFEST_VALID');
assert.ok(valid.manifest);
if (!valid.manifest) throw new Error('Expected operational manifest.');
const registryRecords = getReieSourceRegistry().records;
const registrySourceIds = registryRecords.map((record) => record.sourceId);
const manifestSourceIds = valid.manifest.entries.map((entry) => entry.sourceId);
const expectedManifestSourceIds = [
  'SRC-REIE-FINANCING-SCENARIO-CALCULATOR',
  'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE',
  MLS_LISTING_DATA_SOURCE_ID,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID,
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  BOULDER_COUNTY_TREASURER_SOURCE_ID,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID,
  CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID,
  BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID,
  BCOD_ADDRESS_POINTS_SOURCE_ID,
  BCOD_PARK_BOUNDARIES_SOURCE_ID,
  BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID,
  ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
  BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
] as const;
assert.equal(valid.manifest.suppliedDatasetScope, 'SUPPLIED_MANIFEST_ONLY');
assert.equal(valid.manifest.operationalPosture, 'OPERATIONAL_INPUT_POSTURE_ONLY');
assert.equal(valid.manifest.completenessClaim, 'NO_COMPLETENESS_CLAIM');
assert.equal(valid.manifest.entries.length, expectedManifestSourceIds.length);
assert.ok(registryRecords.length >= valid.manifest.entries.length, 'Registry may contain governed pre-Manifest lifecycle sources but cannot be smaller than Manifest.');
assert.equal(new Set(manifestSourceIds).size, manifestSourceIds.length, 'Operational Manifest source ids must be unique.');
for (const sourceId of manifestSourceIds) {
  assert.equal(registrySourceIds.filter((candidate) => candidate === sourceId).length, 1, 'Every Operational Manifest source must exist exactly once in the Source Registry: ' + sourceId);
}
assert.ok(valid.manifest.entries.every((entry) => entry.inclusionClass === 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS'));
assert.equal(valid.manifest.authorityFirewall.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_MANIFEST');
assert.equal(valid.manifest.authorityFirewall.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_MANIFEST');
assert.equal(valid.manifest.authorityFirewall.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_MANIFEST');
assert.equal(valid.manifest.authorityFirewall.qualityScore, 'NO_QUALITY_SCORE');
assert.equal(valid.manifest.authorityFirewall.providerRanking, 'NO_PROVIDER_RANKING');
assert.deepEqual(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.map((entry) => entry.sourceId), expectedManifestSourceIds);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === BOULDER_COUNTY_TREASURER_SOURCE_ID).length, 1);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID).length, 1);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID).length, 1);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID).length, 1);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID).length, 1);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === BCOD_ADDRESS_POINTS_SOURCE_ID).length, 1);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === BCOD_PARK_BOUNDARIES_SOURCE_ID).length, 1);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID).length, 1);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID).length, 1);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID).length, 1);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === 'SRC-BOULDER-PERMIT-CANDIDATES').length, 0);
const registryOnlySources = explainRegistryOnlySourceIds(registryRecords, manifestSourceIds);
assert.deepEqual(registryOnlySources.map((source) => source.sourceId).sort(), ['SRC-BOULDER-PERMIT-CANDIDATES', 'SRC-JEFFERSON-COUNTY-ASSESSOR']);
assert.deepEqual(
  registryOnlySources.map((source) => source.reason).sort(),
  ['EXPLICIT_NON_OPERATIONAL_REGISTRY_IDENTITY', 'GOVERNED_PRE_MANIFEST_COUNTY_ASSESSOR_LIFECYCLE'],
);
const jeffersonPreManifestRecord = registryRecords.find((record) => record.sourceId === 'SRC-JEFFERSON-COUNTY-ASSESSOR');
assert.ok(jeffersonPreManifestRecord);
const syntheticLarimerPreManifestRecord: RegistryLifecycleRecord = {
  ...jeffersonPreManifestRecord,
  sourceId: 'SRC-LARIMER-COUNTY-ASSESSOR',
  publicName: 'Larimer County Assessor',
  responsibleOrganization: "Larimer County Assessor's Office",
  jurisdiction: { state: 'Colorado', county: 'Larimer County', coverage: 'Larimer County assessor/property records source identity only' },
  currentReieUse: 'Exact source identity only for future-governed Larimer County Assessor review; no property search submission, GIS access, property-record retrieval, owner/address lookup, parcel/account lookup, valuation claim, ownership claim, title claim, tax claim, customer display, ingestion, automation, or runtime use is active.',
  sourcePaths: [
    'lib/sourceRegistry.ts/SRC-LARIMER-COUNTY-ASSESSOR',
    'Larimer County Assessor official-source identity research handoff',
    'LARIMER_COUNTY_ASSESSOR_EXACT_SOURCE_REGISTRY_MVV',
  ],
};
assert.deepEqual(
  explainRegistryOnlySourceIds([...registryRecords, syntheticLarimerPreManifestRecord], manifestSourceIds).map((source) => source.sourceId).sort(),
  ['SRC-BOULDER-PERMIT-CANDIDATES', 'SRC-JEFFERSON-COUNTY-ASSESSOR', 'SRC-LARIMER-COUNTY-ASSESSOR'],
);
assert.throws(
  () => explainRegistryOnlySourceIds([...registryRecords, { ...syntheticLarimerPreManifestRecord, productionActivationState: 'ACTIVE_AUTHORIZED' }], manifestSourceIds),
  /Registry-only source requires governed pre-Manifest lifecycle posture/,
);
for (const [sourceId, entryFingerprint] of PRIOR_NINE_ENTRY_FINGERPRINTS) {
  assert.equal(valid.manifest.entries.find((entry) => entry.sourceId === sourceId)?.entryFingerprint, entryFingerprint);
}

const rawMlsEntry = SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[2];
assert.ok(rawMlsEntry);
assert.equal(rawMlsEntry?.sourceId, MLS_LISTING_DATA_SOURCE_ID);
assert.equal(rawMlsEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.strictEqual(rawMlsEntry?.linkages, MLS_LISTING_DATA_SOURCE_QUALITY_LINKAGES);
assert.deepEqual(rawMlsEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(rawMlsEntry?.certificationReference, MLS_LISTING_DATA_SOURCE_QUALITY_CERTIFICATION);
assert.equal(rawMlsEntry?.reviewedAt, MLS_LISTING_DATA_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(rawMlsEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(rawMlsEntry?.limitationCodes, []);
assert.equal(MLS_LISTING_DATA_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(MLS_LISTING_DATA_SOURCE_QUALITY_FIREWALL.registryActivation, 'SOURCE_REGISTRY_ACTIVATION_NOT_SOURCE_QUALITY_CERTIFICATION');

const rawMunicipalEntry = SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[3];
assert.ok(rawMunicipalEntry);
assert.equal(rawMunicipalEntry?.sourceId, MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID);
assert.equal(rawMunicipalEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.strictEqual(rawMunicipalEntry?.linkages, MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES);
assert.deepEqual(rawMunicipalEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(rawMunicipalEntry?.certificationReference, MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_CERTIFICATION);
assert.equal(rawMunicipalEntry?.reviewedAt, MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(rawMunicipalEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(rawMunicipalEntry?.limitationCodes, []);
assert.equal(MUNICIPAL_PLANNING_CONTEXT_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_FIREWALL.registryActivation, 'SOURCE_REGISTRY_ACTIVATION_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_MUNICIPAL_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');

const assessorEvidence = convertBoulderCountyAssessorSourceQualityEvidence();
const rawAssessorEntry = SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[4];
assert.ok(rawAssessorEntry);
assert.equal(rawAssessorEntry?.sourceId, BOULDER_COUNTY_ASSESSOR_SOURCE_ID);
assert.equal(rawAssessorEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.deepEqual(rawAssessorEntry?.linkages, assessorEvidence.linkages);
assert.deepEqual(rawAssessorEntry?.linkages, convertBoulderCountyAssessorSourceQualityEvidence().linkages);
assert.deepEqual(rawAssessorEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(rawAssessorEntry?.certificationReference, BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION);
assert.equal(rawAssessorEntry?.reviewedAt, BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(rawAssessorEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(rawAssessorEntry?.limitationCodes, []);
assert.equal(BOULDER_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.sraReadiness, 'SRA_READINESS_RECORD_NOT_DIRECT_SOURCE_QUALITY_RIGHTS_EVIDENCE');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');

const treasurerEvidence = convertBoulderCountyTreasurerSourceQualityEvidence();
const rawTreasurerEntry = SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[5];
assert.ok(rawTreasurerEntry);
assert.equal(rawTreasurerEntry?.sourceId, BOULDER_COUNTY_TREASURER_SOURCE_ID);
assert.equal(rawTreasurerEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.deepEqual(rawTreasurerEntry?.linkages, treasurerEvidence.linkages);
assert.deepEqual(rawTreasurerEntry?.linkages, convertBoulderCountyTreasurerSourceQualityEvidence().linkages);
assert.deepEqual(rawTreasurerEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(rawTreasurerEntry?.certificationReference, BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION);
assert.equal(rawTreasurerEntry?.reviewedAt, BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(rawTreasurerEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(rawTreasurerEntry?.limitationCodes, []);
assert.equal(BOULDER_COUNTY_TREASURER_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryTermsReview, 'TERMS_REVIEW_REQUIRED_NOT_RESOLVED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.retrieval, 'SCRAPING_OR_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_TAX_PROPERTY_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');

const accelaEvidence = convertBoulderCountyAccelaPermitsSourceQualityEvidence();
const rawAccelaEntry = SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[6];
assert.ok(rawAccelaEntry);
assert.equal(rawAccelaEntry?.sourceId, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID);
assert.equal(rawAccelaEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.deepEqual(rawAccelaEntry?.linkages, accelaEvidence.linkages);
assert.deepEqual(rawAccelaEntry?.linkages, convertBoulderCountyAccelaPermitsSourceQualityEvidence().linkages);
assert.deepEqual(rawAccelaEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(rawAccelaEntry?.certificationReference, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CERTIFICATION);
assert.equal(rawAccelaEntry?.reviewedAt, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(rawAccelaEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(rawAccelaEntry?.limitationCodes, []);
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL.registryProviderConfirmation, 'AWAITING_PROVIDER_CONFIRMATION_NOT_RESOLVED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL.retrieval, 'SCRAPING_OR_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL.portalFallacy, 'PORTAL_EXISTENCE_NOT_ACCESS_OR_AUTOMATION_OR_DISPLAY_AUTHORITY');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL.candidateInheritance, 'PERMIT_CANDIDATE_SOURCE_NOT_EVIDENCE_AUTHORITY');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL.cityInheritance, 'CITY_PERMIT_SOURCES_NOT_EVIDENCE_AUTHORITY_FOR_COUNTY_ACCELA');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_PERMIT_PROPERTY_OR_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');

const cityOpenDataEvidence = convertCityBoulderOpenDataPermitsSourceQualityEvidence();
const rawCityOpenDataEntry = SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[7];
assert.ok(rawCityOpenDataEntry);
assert.equal(rawCityOpenDataEntry?.sourceId, CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID);
assert.equal(rawCityOpenDataEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.deepEqual(rawCityOpenDataEntry?.linkages, cityOpenDataEvidence.linkages);
assert.deepEqual(rawCityOpenDataEntry?.linkages, convertCityBoulderOpenDataPermitsSourceQualityEvidence().linkages);
assert.deepEqual(rawCityOpenDataEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(rawCityOpenDataEntry?.certificationReference, CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CERTIFICATION);
assert.equal(rawCityOpenDataEntry?.reviewedAt, CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(rawCityOpenDataEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(rawCityOpenDataEntry?.limitationCodes, []);
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'MUNICIPAL_OPEN_DATA_PERMIT');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'IDENTIFIER_BEARING_CONTEXT');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.registryAuthorization, 'AWAITING_PROVIDER_CONFIRMATION_NOT_PERMISSION');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.retrieval, 'SCRAPING_OR_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.redistribution, 'REDISTRIBUTION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.openDataFallacy, 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY');
assert.equal(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_PERMIT_PROPERTY_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');

const cityPortalEvidence = convertCityBoulderBuildingPermitsPortalSourceQualityEvidence();
const rawCityPortalEntry = SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[8];
assert.ok(rawCityPortalEntry);
assert.equal(rawCityPortalEntry?.sourceId, CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID);
assert.equal(rawCityPortalEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.deepEqual(rawCityPortalEntry?.linkages, cityPortalEvidence.linkages);
assert.deepEqual(rawCityPortalEntry?.linkages, convertCityBoulderBuildingPermitsPortalSourceQualityEvidence().linkages);
assert.deepEqual(rawCityPortalEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(rawCityPortalEntry?.certificationReference, CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_CERTIFICATION);
assert.equal(rawCityPortalEntry?.reviewedAt, CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(rawCityPortalEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(rawCityPortalEntry?.limitationCodes, []);
assert.equal(CITY_BOULDER_BUILDING_PERMITS_PORTAL_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'MUNICIPAL_PERMIT_PORTAL');
assert.equal(CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_FIREWALL.registryAuthorization, 'AWAITING_PROVIDER_CONFIRMATION_NOT_PERMISSION');
assert.equal(CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_FIREWALL.retrieval, 'SCRAPING_OR_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_FIREWALL.portalFallacy, 'PORTAL_EXISTENCE_NOT_AUTOMATION_OR_USE_AUTHORITY');
assert.equal(CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_PERMIT_PROPERTY_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');

const recorderEvidence = convertBoulderCountyRecorderIndexSourceQualityEvidence();
const rawRecorderEntry = SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[9];
assert.ok(rawRecorderEntry);
assert.equal(rawRecorderEntry?.sourceId, BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID);
assert.equal(rawRecorderEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.deepEqual(rawRecorderEntry?.linkages, recorderEvidence.linkages);
assert.deepEqual(rawRecorderEntry?.linkages, convertBoulderCountyRecorderIndexSourceQualityEvidence().linkages);
assert.equal(recorderEvidence.inputFingerprint, 'county-source-quality-conversion-input:v1:a6606bea');
assert.equal(recorderEvidence.conversionFingerprint, 'county-source-quality-conversion:v1:0c53a2b6');
assert.deepEqual(rawRecorderEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(rawRecorderEntry?.certificationReference, BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CERTIFICATION);
assert.equal(rawRecorderEntry?.reviewedAt, BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(rawRecorderEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(rawRecorderEntry?.limitationCodes, []);
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_RECORDED_DOCUMENT_INDEX');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.registryAuthorization, 'AWAITING_PROVIDER_CONFIRMATION_NOT_PERMISSION');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.retrieval, 'SCRAPING_OR_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.indexBoundary, 'INDEX_OR_SEARCH_METADATA_NOT_DOCUMENT_CONTENT');
assert.equal(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_RECORDER_PROPERTY_PERSON_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');

const addressPointsEvidence = convertBcodAddressPointsSourceQualityEvidence();
const rawAddressPointsEntry = SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[10];
assert.ok(rawAddressPointsEntry);
assert.equal(rawAddressPointsEntry?.sourceId, BCOD_ADDRESS_POINTS_SOURCE_ID);
assert.equal(rawAddressPointsEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.deepEqual(rawAddressPointsEntry?.linkages, addressPointsEvidence.linkages);
assert.deepEqual(rawAddressPointsEntry?.linkages, convertBcodAddressPointsSourceQualityEvidence().linkages);
assert.deepEqual(rawAddressPointsEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(rawAddressPointsEntry?.certificationReference, BCOD_ADDRESS_POINTS_SOURCE_QUALITY_CERTIFICATION);
assert.equal(rawAddressPointsEntry?.reviewedAt, BCOD_ADDRESS_POINTS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(rawAddressPointsEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(rawAddressPointsEntry?.limitationCodes, []);
assert.equal(BCOD_ADDRESS_POINTS_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.registryAuthorization, 'AWAITING_PROVIDER_CONFIRMATION_NOT_PERMISSION');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.retrieval, 'GIS_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.rawGisData, 'RAW_GIS_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.addressPointParcelFirewall, 'ADDRESS_POINT_NOT_PARCEL_CONFIRMATION');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.coordinateDisplayAuthority, 'COORDINATE_NOT_CUSTOMER_DISPLAY_AUTHORITY');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.gisDatasetUseAuthority, 'GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.openDataFallacy, 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.parcelInheritance, 'NO_INHERITANCE_FROM_BOULDER_COUNTY_PARCEL_GIS');
assert.equal(BCOD_ADDRESS_POINTS_SOURCE_QUALITY_FIREWALL.parkBoundaryInheritance, 'NO_INHERITANCE_FROM_BCOD_PARK_BOUNDARIES');

const parkBoundariesEvidence = convertBcodParkBoundariesSourceQualityEvidence();
const rawParkBoundariesEntry = SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[11];
assert.ok(rawParkBoundariesEntry);
assert.equal(rawParkBoundariesEntry?.sourceId, BCOD_PARK_BOUNDARIES_SOURCE_ID);
assert.equal(rawParkBoundariesEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.deepEqual(rawParkBoundariesEntry?.linkages, parkBoundariesEvidence.linkages);
assert.deepEqual(rawParkBoundariesEntry?.linkages, convertBcodParkBoundariesSourceQualityEvidence().linkages);
assert.deepEqual(rawParkBoundariesEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(rawParkBoundariesEntry?.certificationReference, BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_CERTIFICATION);
assert.equal(rawParkBoundariesEntry?.reviewedAt, BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(rawParkBoundariesEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(rawParkBoundariesEntry?.limitationCodes, []);
assert.equal(BCOD_PARK_BOUNDARIES_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.registryAuthorization, 'AWAITING_PROVIDER_CONFIRMATION_NOT_PERMISSION');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.retrieval, 'GIS_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.rawGisData, 'RAW_GIS_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.parkBoundaryFirewall, 'PARK_BOUNDARY_NOT_PROPERTY_OR_PARCEL_FACT');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.gisDatasetUseAuthority, 'GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.openDataFallacy, 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.addressPointsInheritance, 'NO_INHERITANCE_FROM_ADDRESS_POINTS');
assert.equal(BCOD_PARK_BOUNDARIES_SOURCE_QUALITY_FIREWALL.parcelGisInheritance, 'NO_INHERITANCE_FROM_BOULDER_COUNTY_PARCEL_GIS');

const parcelGisEvidence = convertBoulderCountyParcelGisSourceQualityEvidence();
const rawParcelGisEntry = SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[12];
assert.ok(rawParcelGisEntry);
assert.equal(rawParcelGisEntry?.sourceId, BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.equal(rawParcelGisEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.deepEqual(rawParcelGisEntry?.linkages, parcelGisEvidence.linkages);
assert.deepEqual(rawParcelGisEntry?.linkages, convertBoulderCountyParcelGisSourceQualityEvidence().linkages);
assert.deepEqual(rawParcelGisEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(rawParcelGisEntry?.certificationReference, BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_CERTIFICATION);
assert.equal(rawParcelGisEntry?.reviewedAt, BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(rawParcelGisEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(rawParcelGisEntry?.limitationCodes, []);
assert.equal(BOULDER_COUNTY_PARCEL_GIS_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.registryAuthorization, 'AWAITING_PROVIDER_CONFIRMATION_NOT_PERMISSION');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.registryActivation, 'BLOCKED_NOT_AUTHORIZED_NOT_BYPASSED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.retrieval, 'GIS_RETRIEVAL_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.rawGisData, 'RAW_GIS_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.parcelOwnershipFirewall, 'PARCEL_GEOMETRY_NOT_OWNERSHIP');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.parcelLegalDescriptionFirewall, 'PARCEL_GEOMETRY_NOT_LEGAL_DESCRIPTION');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.parcelAssessorFirewall, 'PARCEL_GEOMETRY_NOT_ASSESSOR_RECORD');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.parcelTitleFirewall, 'PARCEL_GEOMETRY_NOT_TITLE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.gisDatasetUseAuthority, 'GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.openDataFallacy, 'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.addressPointsInheritance, 'NO_INHERITANCE_FROM_ADDRESS_POINTS');
assert.equal(BOULDER_COUNTY_PARCEL_GIS_SOURCE_QUALITY_FIREWALL.parkBoundaryInheritance, 'NO_INHERITANCE_FROM_PARK_BOUNDARIES');

const treasurerRegistryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === BOULDER_COUNTY_TREASURER_SOURCE_ID);
assert.ok(treasurerRegistryRecord);
assert.equal(treasurerRegistryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(treasurerRegistryRecord?.category, 'COUNTY_TREASURER_TAX');
assert.equal(treasurerRegistryRecord?.authorizationState, 'TERMS_REVIEW_REQUIRED');
assert.equal(treasurerRegistryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(treasurerRegistryRecord?.claimEligible, false);

const accelaRegistryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID);
assert.ok(accelaRegistryRecord);
assert.equal(accelaRegistryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(accelaRegistryRecord?.category, 'BUILDING_PERMITS');
assert.equal(accelaRegistryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(accelaRegistryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(accelaRegistryRecord?.claimEligible, false);

const cityOpenDataRegistryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID);
assert.ok(cityOpenDataRegistryRecord);
assert.equal(cityOpenDataRegistryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(cityOpenDataRegistryRecord?.category, 'BUILDING_PERMITS');
assert.equal(cityOpenDataRegistryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(cityOpenDataRegistryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(cityOpenDataRegistryRecord?.claimEligible, false);

const cityPortalRegistryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID);
assert.ok(cityPortalRegistryRecord);
assert.equal(cityPortalRegistryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(cityPortalRegistryRecord?.category, 'BUILDING_PERMITS');
assert.equal(cityPortalRegistryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(cityPortalRegistryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(cityPortalRegistryRecord?.claimEligible, false);

const recorderRegistryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID);
assert.ok(recorderRegistryRecord);
assert.equal(recorderRegistryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(recorderRegistryRecord?.category, 'RECORDED_DOCUMENT_INDEX');
assert.equal(recorderRegistryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(recorderRegistryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(recorderRegistryRecord?.claimEligible, false);

const addressPointsRegistryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === BCOD_ADDRESS_POINTS_SOURCE_ID);
assert.ok(addressPointsRegistryRecord);
assert.equal(addressPointsRegistryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(addressPointsRegistryRecord?.category, 'BCOD_ADDRESS_POINTS');
assert.equal(addressPointsRegistryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(addressPointsRegistryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(addressPointsRegistryRecord?.claimEligible, false);

const parkBoundariesRegistryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === BCOD_PARK_BOUNDARIES_SOURCE_ID);
assert.ok(parkBoundariesRegistryRecord);
assert.equal(parkBoundariesRegistryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(parkBoundariesRegistryRecord?.category, 'BCOD_PARK_BOUNDARIES');
assert.equal(parkBoundariesRegistryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(parkBoundariesRegistryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(parkBoundariesRegistryRecord?.claimEligible, false);

const parcelGisRegistryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.ok(parcelGisRegistryRecord);
assert.equal(parcelGisRegistryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(parcelGisRegistryRecord?.category, 'PARCEL_GEOMETRY');
assert.equal(parcelGisRegistryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(parcelGisRegistryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(parcelGisRegistryRecord?.claimEligible, false);

const permitCandidateRegistryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === 'SRC-BOULDER-PERMIT-CANDIDATES');
assert.ok(permitCandidateRegistryRecord);
assert.equal(permitCandidateRegistryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(permitCandidateRegistryRecord?.category, 'BUILDING_PERMITS');
assert.equal(permitCandidateRegistryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(permitCandidateRegistryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(permitCandidateRegistryRecord?.claimEligible, false);
assert.equal(permitCandidateRegistryRecord?.lifecyclePosture, 'NON_OPERATIONAL_DISCOVERY_VERIFICATION_CONTEXT');
assert.equal(permitCandidateRegistryRecord?.sourceQualityAdvancementEligibility, 'NOT_ELIGIBLE_NON_OPERATIONAL_CONTEXT');
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === permitCandidateRegistryRecord?.sourceId).length, 0);
assert.deepEqual(permitCandidateRegistryRecord?.supersededOperationalSourceIds, [
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID,
  CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID,
]);
assert.ok(permitCandidateRegistryRecord?.nonOperationalFirewalls?.includes('NOT_OPERATIONAL_MANIFEST_SOURCE'));
assert.ok(permitCandidateRegistryRecord?.nonOperationalFirewalls?.includes('NOT_EVIDENCE_INHERITANCE_AUTHORITY'));
assert.ok(permitCandidateRegistryRecord?.nonOperationalFirewalls?.includes('NOT_RIGHTS_ACCESS_FRESHNESS_ATTRIBUTION_OR_PROVENANCE_AUTHORITY'));

const withoutMls = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== MLS_LISTING_DATA_SOURCE_ID),
});
assert.ok(withoutMls.manifest);
assert.equal(withoutMls.manifest?.entries.length, 14);
assert.notEqual(valid.manifest.manifestFingerprint, withoutMls.manifest?.manifestFingerprint);
for (const entry of withoutMls.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const mlsEntry = valid.manifest.entries.find((entry) => entry.sourceId === MLS_LISTING_DATA_SOURCE_ID);
assert.ok(mlsEntry);
assert.equal(mlsEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.equal(mlsEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === MLS_LISTING_DATA_SOURCE_ID)?.entryFingerprint);
const mlsNormalized = normalizeMlsListingDataSourceQualityEvidence();
assert.equal(mlsNormalized.rights.posture, 'UNKNOWN');
assert.equal(mlsNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(mlsNormalized.freshness.posture, 'UNKNOWN');
assert.equal(mlsNormalized.attribution.posture, 'UNKNOWN');
assert.equal(mlsNormalized.provenance.posture, 'UNKNOWN');

const withoutAssessor = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== BOULDER_COUNTY_ASSESSOR_SOURCE_ID),
});
assert.ok(withoutAssessor.manifest);
assert.equal(withoutAssessor.manifest?.entries.length, 14);
assert.notEqual(valid.manifest.manifestFingerprint, withoutAssessor.manifest?.manifestFingerprint);
for (const entry of withoutAssessor.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const assessorEntry = valid.manifest.entries.find((entry) => entry.sourceId === BOULDER_COUNTY_ASSESSOR_SOURCE_ID);
assert.ok(assessorEntry);
assert.equal(assessorEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.equal(assessorEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === BOULDER_COUNTY_ASSESSOR_SOURCE_ID)?.entryFingerprint);
const assessorNormalized = normalizeBoulderCountyAssessorSourceQualityEvidence();
assert.equal(assessorNormalized.rights.posture, 'UNKNOWN');
assert.equal(assessorNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(assessorNormalized.freshness.posture, 'UNKNOWN');
assert.equal(assessorNormalized.attribution.posture, 'UNKNOWN');
assert.equal(assessorNormalized.provenance.posture, 'UNKNOWN');

const withoutMunicipal = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID),
});
assert.ok(withoutMunicipal.manifest);
assert.equal(withoutMunicipal.manifest?.entries.length, 14);
assert.notEqual(valid.manifest.manifestFingerprint, withoutMunicipal.manifest?.manifestFingerprint);
for (const entry of withoutMunicipal.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const municipalEntry = valid.manifest.entries.find((entry) => entry.sourceId === MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID);
assert.ok(municipalEntry);
assert.equal(municipalEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.equal(municipalEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID)?.entryFingerprint);
const municipalNormalized = normalizeMunicipalPlanningContextSourceQualityEvidence();
assert.equal(municipalNormalized.rights.posture, 'UNKNOWN');
assert.equal(municipalNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(municipalNormalized.freshness.posture, 'UNKNOWN');
assert.equal(municipalNormalized.attribution.posture, 'UNKNOWN');
assert.equal(municipalNormalized.provenance.posture, 'UNKNOWN');

const withoutTreasurer = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== BOULDER_COUNTY_TREASURER_SOURCE_ID),
});
assert.ok(withoutTreasurer.manifest);
assert.equal(withoutTreasurer.manifest?.entries.length, 14);
assert.notEqual(valid.manifest.manifestFingerprint, withoutTreasurer.manifest?.manifestFingerprint);
for (const entry of withoutTreasurer.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const treasurerEntry = valid.manifest.entries.find((entry) => entry.sourceId === BOULDER_COUNTY_TREASURER_SOURCE_ID);
assert.ok(treasurerEntry);
assert.equal(treasurerEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.equal(treasurerEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === BOULDER_COUNTY_TREASURER_SOURCE_ID)?.entryFingerprint);
const treasurerNormalized = normalizeBoulderCountyTreasurerSourceQualityEvidence();
assert.equal(treasurerNormalized.rights.posture, 'UNKNOWN');
assert.equal(treasurerNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(treasurerNormalized.freshness.posture, 'UNKNOWN');
assert.equal(treasurerNormalized.attribution.posture, 'UNKNOWN');
assert.equal(treasurerNormalized.provenance.posture, 'UNKNOWN');

const withoutAccela = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID),
});
assert.ok(withoutAccela.manifest);
assert.equal(withoutAccela.manifest?.entries.length, 14);
assert.notEqual(valid.manifest.manifestFingerprint, withoutAccela.manifest?.manifestFingerprint);
for (const entry of withoutAccela.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const accelaEntry = valid.manifest.entries.find((entry) => entry.sourceId === BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID);
assert.ok(accelaEntry);
assert.equal(accelaEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.equal(accelaEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID)?.entryFingerprint);
const accelaNormalized = normalizeBoulderCountyAccelaPermitsSourceQualityEvidence();
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(accelaNormalized.rights.posture, 'UNKNOWN');
assert.equal(accelaNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(accelaNormalized.freshness.posture, 'UNKNOWN');
assert.equal(accelaNormalized.attribution.posture, 'UNKNOWN');
assert.equal(accelaNormalized.provenance.posture, 'UNKNOWN');

const withoutCityOpenData = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID),
});
assert.ok(withoutCityOpenData.manifest);
assert.equal(withoutCityOpenData.manifest?.entries.length, 14);
assert.notEqual(valid.manifest.manifestFingerprint, withoutCityOpenData.manifest?.manifestFingerprint);
for (const entry of withoutCityOpenData.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const cityOpenDataEntry = valid.manifest.entries.find((entry) => entry.sourceId === CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID);
assert.ok(cityOpenDataEntry);
assert.equal(cityOpenDataEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.equal(cityOpenDataEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID)?.entryFingerprint);
const cityOpenDataNormalized = normalizeCityBoulderOpenDataPermitsSourceQualityEvidence();
assert.equal(cityOpenDataNormalized.rights.posture, 'UNKNOWN');
assert.equal(cityOpenDataNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(cityOpenDataNormalized.freshness.posture, 'UNKNOWN');
assert.equal(cityOpenDataNormalized.attribution.posture, 'UNKNOWN');
assert.equal(cityOpenDataNormalized.provenance.posture, 'UNKNOWN');

const withoutCityPortal = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID),
});
assert.ok(withoutCityPortal.manifest);
assert.equal(withoutCityPortal.manifest?.entries.length, 14);
assert.notEqual(valid.manifest.manifestFingerprint, withoutCityPortal.manifest?.manifestFingerprint);
for (const entry of withoutCityPortal.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const cityPortalEntry = valid.manifest.entries.find((entry) => entry.sourceId === CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID);
assert.ok(cityPortalEntry);
assert.equal(cityPortalEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.equal(cityPortalEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID)?.entryFingerprint);
const cityPortalNormalized = normalizeCityBoulderBuildingPermitsPortalSourceQualityEvidence();
assert.equal(cityPortalNormalized.rights.posture, 'UNKNOWN');
assert.equal(cityPortalNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(cityPortalNormalized.freshness.posture, 'UNKNOWN');
assert.equal(cityPortalNormalized.attribution.posture, 'UNKNOWN');
assert.equal(cityPortalNormalized.provenance.posture, 'UNKNOWN');

const withoutRecorder = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID),
});
assert.ok(withoutRecorder.manifest);
assert.equal(withoutRecorder.manifest?.entries.length, 14);
assert.notEqual(valid.manifest.manifestFingerprint, withoutRecorder.manifest?.manifestFingerprint);
for (const entry of withoutRecorder.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const recorderEntry = valid.manifest.entries.find((entry) => entry.sourceId === BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID);
assert.ok(recorderEntry);
assert.equal(recorderEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.equal(recorderEntry?.entryFingerprint, RECORDER_INDEX_ENTRY_FINGERPRINT);
assert.equal(recorderEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID)?.entryFingerprint);
const recorderNormalized = normalizeBoulderCountyRecorderIndexSourceQualityEvidence();
assert.equal(recorderNormalized.rights.posture, 'UNKNOWN');
assert.equal(recorderNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(recorderNormalized.freshness.posture, 'UNKNOWN');
assert.equal(recorderNormalized.attribution.posture, 'UNKNOWN');
assert.equal(recorderNormalized.provenance.posture, 'UNKNOWN');

const withoutAddressPoints = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== BCOD_ADDRESS_POINTS_SOURCE_ID),
});
assert.ok(withoutAddressPoints.manifest);
assert.equal(withoutAddressPoints.manifest?.entries.length, 14);
assert.notEqual(valid.manifest.manifestFingerprint, withoutAddressPoints.manifest?.manifestFingerprint);
for (const entry of withoutAddressPoints.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const addressPointsEntry = valid.manifest.entries.find((entry) => entry.sourceId === BCOD_ADDRESS_POINTS_SOURCE_ID);
assert.ok(addressPointsEntry);
assert.equal(addressPointsEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.equal(addressPointsEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === BCOD_ADDRESS_POINTS_SOURCE_ID)?.entryFingerprint);
const addressPointsNormalized = normalizeBcodAddressPointsSourceQualityEvidence();
assert.equal(addressPointsNormalized.rights.posture, 'UNKNOWN');
assert.equal(addressPointsNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(addressPointsNormalized.freshness.posture, 'UNKNOWN');
assert.equal(addressPointsNormalized.attribution.posture, 'UNKNOWN');
assert.equal(addressPointsNormalized.provenance.posture, 'UNKNOWN');

const withoutParkBoundaries = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== BCOD_PARK_BOUNDARIES_SOURCE_ID),
});
assert.ok(withoutParkBoundaries.manifest);
assert.equal(withoutParkBoundaries.manifest?.entries.length, 14);
assert.notEqual(valid.manifest.manifestFingerprint, withoutParkBoundaries.manifest?.manifestFingerprint);
for (const entry of withoutParkBoundaries.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const parkBoundariesEntry = valid.manifest.entries.find((entry) => entry.sourceId === BCOD_PARK_BOUNDARIES_SOURCE_ID);
assert.ok(parkBoundariesEntry);
assert.equal(parkBoundariesEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.equal(parkBoundariesEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === BCOD_PARK_BOUNDARIES_SOURCE_ID)?.entryFingerprint);
const parkBoundariesNormalized = normalizeBcodParkBoundariesSourceQualityEvidence();
assert.equal(parkBoundariesNormalized.rights.posture, 'UNKNOWN');
assert.equal(parkBoundariesNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(parkBoundariesNormalized.freshness.posture, 'UNKNOWN');
assert.equal(parkBoundariesNormalized.attribution.posture, 'UNKNOWN');
assert.equal(parkBoundariesNormalized.provenance.posture, 'UNKNOWN');

const withoutParcelGis = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID),
});
assert.ok(withoutParcelGis.manifest);
assert.equal(withoutParcelGis.manifest?.entries.length, 14);
assert.notEqual(valid.manifest.manifestFingerprint, withoutParcelGis.manifest?.manifestFingerprint);
for (const entry of withoutParcelGis.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const parcelGisEntry = valid.manifest.entries.find((entry) => entry.sourceId === BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID);
assert.ok(parcelGisEntry);
assert.equal(parcelGisEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.equal(parcelGisEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID)?.entryFingerprint);
const parcelGisNormalized = normalizeBoulderCountyParcelGisSourceQualityEvidence();
assert.equal(parcelGisNormalized.rights.posture, 'UNKNOWN');
assert.equal(parcelGisNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(parcelGisNormalized.freshness.posture, 'UNKNOWN');
assert.equal(parcelGisNormalized.attribution.posture, 'UNKNOWN');
assert.equal(parcelGisNormalized.provenance.posture, 'UNKNOWN');

const withoutArapahoeAssessor = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID),
});
assert.ok(withoutArapahoeAssessor.manifest);
assert.equal(withoutArapahoeAssessor.manifest?.entries.length, 14);
assert.notEqual(valid.manifest.manifestFingerprint, withoutArapahoeAssessor.manifest?.manifestFingerprint);
for (const entry of withoutArapahoeAssessor.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const arapahoeAssessorEvidence = convertArapahoeCountyAssessorSourceQualityEvidence();
const arapahoeAssessorEntry = valid.manifest.entries.find((entry) => entry.sourceId === ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID);
assert.ok(arapahoeAssessorEntry);
assert.equal(arapahoeAssessorEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.deepEqual(arapahoeAssessorEntry?.linkages, arapahoeAssessorEvidence.linkages);
assert.deepEqual(arapahoeAssessorEntry?.linkages, convertArapahoeCountyAssessorSourceQualityEvidence().linkages);
assert.deepEqual(arapahoeAssessorEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(arapahoeAssessorEntry?.certificationReference, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION);
assert.equal(arapahoeAssessorEntry?.reviewedAt, ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(arapahoeAssessorEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(arapahoeAssessorEntry?.limitationCodes, []);
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSearchAuthority, 'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notTreasurer, 'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notRecorder, 'COUNTY_ASSESSOR_NOT_RECORDER');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notParcelGis, 'COUNTY_ASSESSOR_NOT_PARCEL_GIS');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noBoulderInheritance, 'BOULDER_SOURCE_FINDINGS_NOT_INHERITED_BY_ARAPAHOE_ASSESSOR');
assert.equal(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_COUNTY_PROPERTY_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');
assert.equal(arapahoeAssessorEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID)?.entryFingerprint);
assert.notEqual(arapahoeAssessorEntry?.entryFingerprint, assessorEntry?.entryFingerprint);
const arapahoeAssessorNormalized = normalizeArapahoeCountyAssessorSourceQualityEvidence();
assert.equal(arapahoeAssessorNormalized.rights.posture, 'UNKNOWN');
assert.equal(arapahoeAssessorNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(arapahoeAssessorNormalized.freshness.posture, 'UNKNOWN');
assert.equal(arapahoeAssessorNormalized.attribution.posture, 'UNKNOWN');
assert.equal(arapahoeAssessorNormalized.provenance.posture, 'UNKNOWN');
const arapahoeAssessorRegistryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID);
assert.ok(arapahoeAssessorRegistryRecord);
assert.equal(arapahoeAssessorRegistryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(arapahoeAssessorRegistryRecord?.category, 'COUNTY_ASSESSOR');
assert.equal(arapahoeAssessorRegistryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(arapahoeAssessorRegistryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(arapahoeAssessorRegistryRecord?.claimEligible, false);

const withoutBroomfieldAssessor = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID),
});
assert.ok(withoutBroomfieldAssessor.manifest);
assert.equal(withoutBroomfieldAssessor.manifest?.entries.length, 14);
assert.notEqual(valid.manifest.manifestFingerprint, withoutBroomfieldAssessor.manifest?.manifestFingerprint);
for (const entry of withoutBroomfieldAssessor.manifest?.entries ?? []) {
  assert.equal(valid.manifest.entries.find((candidate) => candidate.sourceId === entry.sourceId)?.entryFingerprint, entry.entryFingerprint);
}
const broomfieldAssessorEvidence = convertBroomfieldCountyAssessorSourceQualityEvidence();
const broomfieldAssessorEntry = valid.manifest.entries.find((entry) => entry.sourceId === BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID);
assert.ok(broomfieldAssessorEntry);
assert.equal(broomfieldAssessorEntry?.inclusionClass, 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS');
assert.deepEqual(broomfieldAssessorEntry?.linkages, broomfieldAssessorEvidence.linkages);
assert.deepEqual(broomfieldAssessorEntry?.linkages, convertBroomfieldCountyAssessorSourceQualityEvidence().linkages);
assert.deepEqual(broomfieldAssessorEntry?.expectedEvidenceClasses, ['CERTIFICATION']);
assert.strictEqual(broomfieldAssessorEntry?.certificationReference, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_CERTIFICATION);
assert.equal(broomfieldAssessorEntry?.reviewedAt, BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(broomfieldAssessorEntry?.reviewAuthorityClass, 'DELEGATED_SOURCE_GOVERNANCE_REVIEW');
assert.deepEqual(broomfieldAssessorEntry?.limitationCodes, []);
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.registryStatus, 'SOURCE_REGISTRY_STATUS_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_EVIDENCE_PACKAGE');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_EVIDENCE_PACKAGE');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_EVIDENCE_PACKAGE');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.publicSearchAuthority, 'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notTreasurer, 'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notRecorder, 'COUNTY_ASSESSOR_NOT_RECORDER');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.notParcelGis, 'COUNTY_ASSESSOR_NOT_PARCEL_GIS');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noBoulderInheritance, 'BOULDER_SOURCE_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_ASSESSOR');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noArapahoeInheritance, 'ARAPAHOE_SOURCE_FINDINGS_NOT_INHERITED_BY_BROOMFIELD_ASSESSOR');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.noCityCountyAggregation, 'CONSOLIDATED_CITY_COUNTY_STATUS_NOT_SOURCE_AGGREGATION_AUTHORITY');
assert.equal(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_QUALITY_FIREWALL.rawData, 'RAW_COUNTY_PROPERTY_DATA_NOT_ACCEPTED_BY_EVIDENCE_PACKAGE');
assert.equal(broomfieldAssessorEntry?.entryFingerprint, validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA).manifest?.entries.find((entry) => entry.sourceId === BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID)?.entryFingerprint);
assert.notEqual(broomfieldAssessorEntry?.entryFingerprint, assessorEntry?.entryFingerprint);
assert.notEqual(broomfieldAssessorEntry?.entryFingerprint, arapahoeAssessorEntry?.entryFingerprint);
const broomfieldAssessorNormalized = normalizeBroomfieldCountyAssessorSourceQualityEvidence();
assert.equal(broomfieldAssessorNormalized.rights.posture, 'UNKNOWN');
assert.equal(broomfieldAssessorNormalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(broomfieldAssessorNormalized.freshness.posture, 'UNKNOWN');
assert.equal(broomfieldAssessorNormalized.attribution.posture, 'UNKNOWN');
assert.equal(broomfieldAssessorNormalized.provenance.posture, 'UNKNOWN');
const broomfieldAssessorRegistryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID);
assert.ok(broomfieldAssessorRegistryRecord);
assert.equal(broomfieldAssessorRegistryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(broomfieldAssessorRegistryRecord?.category, 'COUNTY_ASSESSOR');
assert.equal(broomfieldAssessorRegistryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(broomfieldAssessorRegistryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(broomfieldAssessorRegistryRecord?.claimEligible, false);

const assemblyRequest = sourceQualityOperationalManifestToAssemblyRequest(valid.manifest);
const assembly = assembleSourceQualitySummaries(assemblyRequest);
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
if (assembly.classification === 'FAIL_CLOSED') throw new Error('Assembly must accept converted operational manifest.');
assert.equal(assembly.assembly.sourceCount, 15);
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === MLS_LISTING_DATA_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === BOULDER_COUNTY_ASSESSOR_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === BOULDER_COUNTY_TREASURER_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === BCOD_ADDRESS_POINTS_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === BCOD_PARK_BOUNDARIES_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
const report = composeSourceQualityReport(assembly.assembly.summaries);
assert.notEqual(report.classification, 'FAIL_CLOSED');
if (report.classification === 'FAIL_CLOSED') throw new Error('Report must accept fifteen-source operational manifest output.');
assert.equal(report.report.sourceCount, 15);
assert.ok(report.report.insufficientEvidenceSources.includes(MLS_LISTING_DATA_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(BOULDER_COUNTY_ASSESSOR_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(BOULDER_COUNTY_TREASURER_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(BCOD_ADDRESS_POINTS_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(BCOD_PARK_BOUNDARIES_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID));

assert.equal(createSourceQualityOperationalManifestFingerprint(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA), createSourceQualityOperationalManifestFingerprint(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA));
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, entries: [...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries].reverse() }).manifest?.manifestFingerprint, valid.manifest.manifestFingerprint);
assert.notEqual(createSourceQualityOperationalManifestFingerprint(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA), createSourceQualityOperationalManifestFingerprint({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, manifestId: 'SQOM-INITIAL-002' }));
assert.notEqual(createSourceQualityOperationalManifestFingerprint(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA), createSourceQualityOperationalManifestFingerprint({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, certificationReference: { ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.certificationReference, certificationId: 'CERT-SQOM-CHANGED-001' } }));
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, entries: [SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[0], SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[0]] }).classification, 'DUPLICATE_SOURCE_ID');
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, coverageClass: 'STATEWIDE_COMPLETE' }).classification, 'UNSUPPORTED_COVERAGE_CLASS');
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, entries: [{ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[0], inclusionClass: 'APPROVED_SOURCE' }] }).classification, 'UNSUPPORTED_INCLUSION_CLASS');
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, certificationReference: null }).classification, 'CERTIFICATION_REFERENCE_REQUIRED');
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, reviewAuthorityClass: 'ACTIVATION_AUTHORIZED' }).classification, 'MANIFEST_ENTRY_INVALID');
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, entries: [{ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[0], linkages: [] }] }).classification, 'STRUCTURED_EVIDENCE_REQUIRED');
assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, entries: [{ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries[0], linkages: [{}] }] }).classification, 'MANIFEST_ENTRY_INVALID');
for (const field of ['notes', 'narrative', 'url', 'email', 'credential', 'protectedCountyArtifact']) assert.equal(validateSourceQualityOperationalManifest({ ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA, [field]: 'not-representable' }).classification, 'FAIL_CLOSED');

const runtime = await readFile(new URL('../lib/sourceQualityOperationalManifest.ts', import.meta.url), 'utf8');
const data = await readFile(new URL('../lib/sourceQualityOperationalManifestData.ts', import.meta.url), 'utf8');
const adminPage = await readFile(new URL('../app/admin/source-quality/page.tsx', import.meta.url), 'utf8');
assert.ok(data.includes('MLS_LISTING_DATA_SOURCE_ID'));
assert.equal(data.includes("'SRC-MLS-LISTING-DATA'"), false);
assert.ok(data.includes('MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID'));
assert.equal(data.includes("'SRC-MUNICIPAL-PLANNING-CONTEXT'"), false);
assert.ok(data.includes('BOULDER_COUNTY_ASSESSOR_SOURCE_ID'));
assert.equal(data.includes("'SRC-BOULDER-COUNTY-ASSESSOR'"), false);
assert.ok(data.includes('BOULDER_COUNTY_TREASURER_SOURCE_ID'));
assert.equal(data.includes("'SRC-BOULDER-COUNTY-TREASURER'"), false);
assert.ok(data.includes('BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID'));
assert.equal(data.includes("'SRC-BOULDER-COUNTY-ACCELA-PERMITS'"), false);
assert.ok(data.includes('CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID'));
assert.equal(data.includes("'SRC-CITY-BOULDER-OPEN-DATA-PERMITS'"), false);
assert.ok(data.includes('CITY_BOULDER_BUILDING_PERMITS_PORTAL_SOURCE_ID'));
assert.equal(data.includes("'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL'"), false);
assert.ok(data.includes('BOULDER_COUNTY_RECORDER_INDEX_SOURCE_ID'));
assert.equal(data.includes("'SRC-BOULDER-COUNTY-RECORDER-INDEX'"), false);
assert.ok(data.includes('BCOD_ADDRESS_POINTS_SOURCE_ID'));
assert.equal(data.includes("'SRC-BCOD-ADDRESS-POINTS'"), false);
assert.ok(data.includes('BCOD_PARK_BOUNDARIES_SOURCE_ID'));
assert.equal(data.includes("'SRC-BCOD-PARK-BOUNDARIES'"), false);
assert.ok(data.includes('BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID'));
assert.equal(data.includes("'SRC-BOULDER-COUNTY-PARCEL-GIS'"), false);
assert.ok(data.includes('ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID'));
assert.equal(data.includes("'SRC-ARAPAHOE-COUNTY-ASSESSOR'"), false);
assert.ok(data.includes('BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID'));
assert.equal(data.includes("'SRC-BROOMFIELD-COUNTY-ASSESSOR'"), false);
assert.ok(adminPage.includes('report.sourceCount'));
assert.equal(adminPage.includes(MLS_LISTING_DATA_SOURCE_ID), false);
for (const prohibited of ['sourceRegistry', 'sourceRightsActivationReadiness', 'SRA-BOULDER-COUNTY-ASSESSOR', 'SRA-BOULDER-COUNTY-TREASURER', 'sourceQualityHumanReviewedEvidenceConversionContract', 'readdir', 'readFile', 'glob(', 'process.env', '@prisma/client', 'PrismaClient', 'prisma.', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS']) assert.equal((runtime + data).includes(prohibited), false, 'Manifest runtime/data must not reference ' + prohibited);
for (const prohibited of ['ATTOM', 'LightBox', 'county correspondence', 'provider correspondence', 'human-reviewed narrative', 'qualityScore', 'providerRanking', 'activationAuthority', 'legalUseApproval', 'customerDisplayAuthority']) assert.equal(data.includes(prohibited), false, 'Operational data must not include ' + prohibited);
console.log('[source-quality-operational-manifest] ok: exact fifteen-source partial typed set reuses canonical MLS, Municipal, Assessor, Treasurer, Accela, City Open Data, City Portal, Recorder Index, Address Points, Park Boundaries, Parcel GIS, Arapahoe Assessor, and Broomfield Assessor evidence, preserves known gaps/terms/open-data/portal/index/provider-confirmation/blocked-activation/public-source/geospatial firewalls, and converts deterministically through Assembly and Report without discovery, live-system, or authority behavior.');
