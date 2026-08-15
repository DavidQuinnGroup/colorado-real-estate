import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  createSourceQualityOperationalManifestFingerprint,
  sourceQualityOperationalManifestToAssemblyRequest,
  validateSourceQualityOperationalManifest,
} from '../lib/sourceQualityOperationalManifest';
import { SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA } from '../lib/sourceQualityOperationalManifestData';
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
  BOULDER_COUNTY_TREASURER_MANIFEST_ELIGIBILITY,
  BOULDER_COUNTY_TREASURER_SOURCE_ID,
  BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BOULDER_COUNTY_TREASURER_SOURCE_QUALITY_FIREWALL,
  convertBoulderCountyTreasurerSourceQualityEvidence,
  normalizeBoulderCountyTreasurerSourceQualityEvidence,
} from '../lib/sourceQualityBoulderCountyTreasurerEvidence';
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

const PRIOR_SEVEN_ENTRY_FINGERPRINTS = new Map([
  [BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID, 'source-quality-operational-manifest:v1:64c2da16'],
  [BOULDER_COUNTY_ASSESSOR_SOURCE_ID, 'source-quality-operational-manifest:v1:73bd531d'],
  [BOULDER_COUNTY_TREASURER_SOURCE_ID, 'source-quality-operational-manifest:v1:636ab5ed'],
  [MLS_LISTING_DATA_SOURCE_ID, 'source-quality-operational-manifest:v1:55c44295'],
  [MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID, 'source-quality-operational-manifest:v1:d5244c8f'],
  ['SRC-REIE-FINANCING-SCENARIO-CALCULATOR', 'source-quality-operational-manifest:v1:cc17d4a2'],
  ['SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE', 'source-quality-operational-manifest:v1:891edde9'],
]);

const valid = validateSourceQualityOperationalManifest(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA);
assert.equal(valid.classification, 'PARTIAL_OPERATIONAL_MANIFEST_VALID');
assert.ok(valid.manifest);
if (!valid.manifest) throw new Error('Expected operational manifest.');
assert.equal(valid.manifest.suppliedDatasetScope, 'SUPPLIED_MANIFEST_ONLY');
assert.equal(valid.manifest.operationalPosture, 'OPERATIONAL_INPUT_POSTURE_ONLY');
assert.equal(valid.manifest.completenessClaim, 'NO_COMPLETENESS_CLAIM');
assert.equal(valid.manifest.entries.length, 8);
assert.ok(valid.manifest.entries.every((entry) => entry.inclusionClass === 'STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS'));
assert.equal(valid.manifest.authorityFirewall.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_MANIFEST');
assert.equal(valid.manifest.authorityFirewall.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_MANIFEST');
assert.equal(valid.manifest.authorityFirewall.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_MANIFEST');
assert.equal(valid.manifest.authorityFirewall.qualityScore, 'NO_QUALITY_SCORE');
assert.equal(valid.manifest.authorityFirewall.providerRanking, 'NO_PROVIDER_RANKING');
assert.deepEqual(SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.map((entry) => entry.sourceId), [
  'SRC-REIE-FINANCING-SCENARIO-CALCULATOR',
  'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE',
  MLS_LISTING_DATA_SOURCE_ID,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID,
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  BOULDER_COUNTY_TREASURER_SOURCE_ID,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID,
  CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID,
]);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === BOULDER_COUNTY_TREASURER_SOURCE_ID).length, 1);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID).length, 1);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID).length, 1);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === 'SRC-BOULDER-PERMIT-CANDIDATES').length, 0);
assert.equal(valid.manifest.entries.filter((entry) => entry.sourceId === 'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL').length, 0);
for (const [sourceId, entryFingerprint] of PRIOR_SEVEN_ENTRY_FINGERPRINTS) {
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

const withoutMls = validateSourceQualityOperationalManifest({
  ...SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA,
  entries: SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA.entries.filter((entry) => entry.sourceId !== MLS_LISTING_DATA_SOURCE_ID),
});
assert.ok(withoutMls.manifest);
assert.equal(withoutMls.manifest?.entries.length, 7);
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
assert.equal(withoutAssessor.manifest?.entries.length, 7);
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
assert.equal(withoutMunicipal.manifest?.entries.length, 7);
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
assert.equal(withoutTreasurer.manifest?.entries.length, 7);
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
assert.equal(withoutAccela.manifest?.entries.length, 7);
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
assert.equal(withoutCityOpenData.manifest?.entries.length, 7);
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

const assemblyRequest = sourceQualityOperationalManifestToAssemblyRequest(valid.manifest);
const assembly = assembleSourceQualitySummaries(assemblyRequest);
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
if (assembly.classification === 'FAIL_CLOSED') throw new Error('Assembly must accept converted operational manifest.');
assert.equal(assembly.assembly.sourceCount, 8);
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === MLS_LISTING_DATA_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === BOULDER_COUNTY_ASSESSOR_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === BOULDER_COUNTY_TREASURER_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(assembly.assembly.summaries.find((summary) => summary.source.sourceId === CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID)?.classification, 'INSUFFICIENT_EVIDENCE');
const report = composeSourceQualityReport(assembly.assembly.summaries);
assert.notEqual(report.classification, 'FAIL_CLOSED');
if (report.classification === 'FAIL_CLOSED') throw new Error('Report must accept eight-source operational manifest output.');
assert.equal(report.report.sourceCount, 8);
assert.ok(report.report.insufficientEvidenceSources.includes(MLS_LISTING_DATA_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(BOULDER_COUNTY_ASSESSOR_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(BOULDER_COUNTY_TREASURER_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID));
assert.ok(report.report.insufficientEvidenceSources.includes(CITY_BOULDER_OPEN_DATA_PERMITS_SOURCE_ID));

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
assert.equal(data.includes('SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL'), false);
assert.ok(adminPage.includes('report.sourceCount'));
assert.equal(adminPage.includes(MLS_LISTING_DATA_SOURCE_ID), false);
for (const prohibited of ['sourceRegistry', 'sourceRightsActivationReadiness', 'SRA-BOULDER-COUNTY-ASSESSOR', 'SRA-BOULDER-COUNTY-TREASURER', 'sourceQualityHumanReviewedEvidenceConversionContract', 'sourceQualityCityBoulderBuildingPermitsPortalEvidence', 'readdir', 'readFile', 'glob(', 'process.env', '@prisma/client', 'PrismaClient', 'prisma.', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS']) assert.equal((runtime + data).includes(prohibited), false, 'Manifest runtime/data must not reference ' + prohibited);
for (const prohibited of ['ATTOM', 'LightBox', 'county correspondence', 'provider correspondence', 'human-reviewed narrative', 'qualityScore', 'providerRanking', 'activationAuthority', 'legalUseApproval', 'customerDisplayAuthority']) assert.equal(data.includes(prohibited), false, 'Operational data must not include ' + prohibited);
console.log('[source-quality-operational-manifest] ok: exact eight-source partial typed set reuses canonical MLS, Municipal, Assessor, Treasurer, Accela, and City Open Data evidence, preserves known gaps/terms/open-data/provider-confirmation/blocked-activation/public-source firewalls, excludes City Portal permits, and converts deterministically through Assembly and Report without discovery, live-system, or authority behavior.');
