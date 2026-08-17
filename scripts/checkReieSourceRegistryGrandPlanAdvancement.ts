import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  BOULDER_PERMIT_CANDIDATES_LIFECYCLE_POSTURE,
  BOULDER_PERMIT_CANDIDATES_NON_OPERATIONAL_FIREWALLS,
  BOULDER_PERMIT_CANDIDATES_SOURCE_ID,
  BOULDER_PERMIT_CANDIDATES_SOURCE_QUALITY_ADVANCEMENT_ELIGIBILITY,
  BOULDER_PERMIT_CANDIDATES_SUPERSEDED_OPERATIONAL_SOURCE_IDS,
  REIE_SOURCE_REGISTRY_REFERENCE_DATE,
  REIE_SOURCE_REGISTRY_STATUS,
  getPublicSourceRegistryRecords,
  getReieSourceRegistry,
} from '../lib/sourceRegistry.js';
import {
  BROOMFIELD_COUNTY_TREASURER_SOURCE_ID,
  COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS,
  DOUGLAS_COUNTY_TREASURER_SOURCE_ID,
  JEFFERSON_COUNTY_TREASURER_SOURCE_ID,
  LARIMER_COUNTY_TREASURER_SOURCE_ID,
  WELD_COUNTY_TREASURER_SOURCE_ID,
  isCountyTreasurerExactSourceId,
} from '../lib/sourceQualityCountyTreasurerExactSourceDefinitions.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function record(sourceId: string) {
  const match = getReieSourceRegistry().records.find((item) => item.sourceId === sourceId);
  assert.ok(match, `Expected Source Registry record ${sourceId}.`);
  return match;
}

const registry = getReieSourceRegistry();
const publicRecords = getPublicSourceRegistryRecords();
const sourceIds = registry.records.map((item) => item.sourceId);

assert.equal(registry.status, REIE_SOURCE_REGISTRY_STATUS, 'Source Registry status must be implemented.');
assert.equal(registry.referenceDate, REIE_SOURCE_REGISTRY_REFERENCE_DATE, 'Source Registry reference date must be stable.');
assert.equal(new Set(sourceIds).size, sourceIds.length, 'Source Registry source ids must be unique.');
assert.ok(registry.records.length >= 9, 'Source Registry must include initial governed records.');
assert.equal(publicRecords.length, registry.records.length, 'Initial public registry records must be disclosure eligible.');

for (const sourceClass of ['AUTHORITATIVE_SOURCE', 'LICENSED_PROFESSIONAL_SOURCE', 'SUPPLEMENTAL_SOURCE', 'REIE_DERIVED_INTELLIGENCE'] as const) {
  assert.ok(registry.records.some((item) => item.sourceClass === sourceClass), `Expected source class ${sourceClass}.`);
}

for (const state of ['ACTIVE_AUTHORIZED', 'AWAITING_PROVIDER_CONFIRMATION', 'BLOCKED_NOT_AUTHORIZED', 'REFERENCE_ONLY', 'REIE_DERIVED'] as const) {
  assert.ok(registry.records.some((item) => item.productionActivationState === state), `Expected activation state ${state}.`);
}

const assessor = record('SRC-BOULDER-COUNTY-ASSESSOR');
assert.equal(assessor.publicName, 'Boulder County Assessor');
assert.equal(assessor.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(assessor.productionActivationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(assessor.claimEligible, false);
assert.match(assessor.currentReieUse, /Identified source candidate only/);
assert.match(assessor.currentReieUse, /no automated retrieval/);

const adamsAssessorSourceId = 'SRC-ADAMS-COUNTY-ASSESSOR';
assert.equal(registry.records.filter((item) => item.sourceId === adamsAssessorSourceId).length, 1, 'Adams County Assessor source must exist exactly once.');
const adamsAssessor = record(adamsAssessorSourceId);
const adamsAssessorText = JSON.stringify(adamsAssessor);
assert.equal(adamsAssessor.publicName, 'Adams County Assessor');
assert.equal(adamsAssessor.responsibleOrganization, "Adams County Assessor's Office");
assert.equal(adamsAssessor.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(adamsAssessor.category, 'COUNTY_ASSESSOR');
assert.equal(adamsAssessor.jurisdiction.state, 'Colorado');
assert.equal(adamsAssessor.jurisdiction.county, 'Adams County');
assert.equal(adamsAssessor.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(adamsAssessor.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(adamsAssessor.claimEligible, false);
assert.equal(adamsAssessor.customerStatus, 'Blocked / not authorized');
assert.match(adamsAssessor.currentReieUse, /Exact source identity only/);
assert.match(adamsAssessor.currentReieUse, /future-governed Adams County Assessor review/);
assert.match(adamsAssessor.currentReieUse, /no Property Portal search submission/);
assert.match(adamsAssessor.currentReieUse, /no GIS Interactive Maps access/);
assert.match(adamsAssessor.currentReieUse, /no Downloadable GIS Data/);
assert.match(adamsAssessor.currentReieUse, /no Assessor Data Dump/);
assert.match(adamsAssessor.currentReieUse, /no .* property-record retrieval/);
assert.match(adamsAssessor.currentReieUse, /no .* owner\/address lookup/);
assert.match(adamsAssessor.currentReieUse, /no .* parcel\/account lookup/);
assert.match(adamsAssessor.currentReieUse, /no .* customer display/);
assert.match(adamsAssessorText, /ASSESSOR_RECORD_NOT_TITLE/);
assert.match(adamsAssessorText, /ASSESSOR_RECORD_NOT_DEED_VALIDITY/);
assert.match(adamsAssessorText, /ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS/);
assert.match(adamsAssessorText, /ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE/);
assert.match(adamsAssessorText, /ASSESSED_VALUE_NOT_MARKET_VALUE/);
assert.match(adamsAssessorText, /PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY/);
assert.match(adamsAssessorText, /PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY/);
assert.match(adamsAssessorText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(adamsAssessorText, /ASSESSOR_GIS_NOT_ASSESSOR_RECORD_AUTHORITY/);
assert.match(adamsAssessorText, /ASSESSOR_DATA_DUMP_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(adamsAssessorText, /DOWNLOADABLE_GIS_DATA_NOT_UNRESTRICTED_OR_REUSE_READY/);
assert.match(adamsAssessorText, /PROPERTY_PORTAL_NOT_AUTOMATION_AUTHORITY/);
assert.match(adamsAssessorText, /COUNTY_ASSESSOR_NOT_PLANNING_OR_ZONING/);
assert.match(adamsAssessorText, /COUNTY_ASSESSOR_NOT_PERMITS/);
assert.match(adamsAssessorText, /COUNTY_ASSESSOR_NOT_PUBLIC_TRUSTEE/);
assert.match(adamsAssessorText, /COUNTY_ASSESSOR_NOT_COUNTY_TREASURER/);
assert.match(adamsAssessorText, /COUNTY_ASSESSOR_NOT_RECORDER/);
assert.match(adamsAssessorText, /COUNTY_ASSESSOR_NOT_PARCEL_GIS/);
assert.match(adamsAssessorText, /SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(adamsAssessorText, /CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV/);
assert.match(adamsAssessorText, /LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV/);
assert.match(adamsAssessorText, /GIS Interactive Maps, Downloadable GIS Data, Assessor Data Dump, other GIS\/property-map services, Treasurer and Public Trustee, Clerk and Recorder, Planning and Development, Permits and Licensing, public-record datasets, and restricted owner or authorized-agent procedures are separately governed/);
assert.match(adamsAssessorText, /Boulder County, Arapahoe County, Broomfield, Jefferson County, Larimer County, and Weld County Assessor findings/);
assert.match(adamsAssessorText, /Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown/);
assert.doesNotMatch(adamsAssessorText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(adamsAssessorText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => item.sourceId !== 'SRC-ADAMS-COUNTY-TREASURER' && /^SRC-ADAMS-COUNTY-(GIS|DOWNLOADABLE-GIS|DATA-DUMP|PROPERTY-PORTAL|PROPERTY-MAP|TREASURER|PUBLIC-TRUSTEE|RECORDER|CLERK|PLANNING|ZONING|PERMITS|LICENSING|PARCEL)/.test(item.sourceId)).length, 0, 'Adams Assessor Registry MVV must not add GIS, Data Dump, Property Portal, unauthorized Treasurer/Public Trustee, Recorder, Planning, Permit, Licensing, or Parcel source ids.');
assert.equal(registry.records.filter((item) => item.sourceId !== 'SRC-ADAMS-COUNTY-TREASURER' && /ADAMS.*(GIS|DATA_DUMP|PROPERTY_PORTAL|PROPERTY_MAP|TREASURER|PUBLIC_TRUSTEE|RECORDER|CLERK|PLANNING|ZONING|PERMITS|LICENSING|PARCEL_GEOMETRY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Adams Assessor Registry MVV must not conflate assessor identity with adjacent domains.');
assert.doesNotMatch(adamsAssessorText, /EXP-|SRA-|provider aggregate|wildcard County Assessor/i);
if (fs.existsSync('lib/sourceQualityAdamsCountyAssessorEvidence.ts')) {
  const adamsAssessorEvidence = read('lib/sourceQualityAdamsCountyAssessorEvidence.ts');
  assert.match(adamsAssessorEvidence, /ADAMS_COUNTY_ASSESSOR_SOURCE_ID/, 'Adams Assessor evidence must bind through the canonical exact source identity constant.');
  assert.match(adamsAssessorEvidence, /CERT-ADAMS-COUNTY-ASSESSOR-SOURCE-QUALITY-EVIDENCE-001/, 'Adams Assessor evidence must use source-specific certification.');
  assert.match(adamsAssessorEvidence, /COUNTY_ASSESSOR/, 'Adams Assessor evidence must preserve the canonical County Assessor class.');
  assert.match(adamsAssessorEvidence, /CERTIFICATION_REFERENCE/, 'Adams Assessor evidence must remain certification-reference-only.');
  assert.doesNotMatch(adamsAssessorEvidence, /getReieSourceRegistry|sourceRegistry/, 'Adams Assessor evidence must not mutate or depend on Registry implementation state.');
  assert.doesNotMatch(adamsAssessorEvidence, /sourceQualityOperationalManifestData|sourceQualityAdminPreviewFixture/, 'Adams Assessor evidence must not create Manifest or Admin Preview coupling.');
  assert.doesNotMatch(adamsAssessorEvidence, /RIGHTS_VERIFIED|TECHNICAL_ACCESS_READY|FRESHNESS_VERIFIED|PROVENANCE_COMPLETE|ACTIVE_AUTHORIZED/, 'Adams Assessor evidence must not upgrade rights, access, freshness, provenance, or activation posture.');
}

const arapahoeAssessorSourceId = 'SRC-ARAPAHOE-COUNTY-ASSESSOR';
const arapahoeTreasurerSourceId = 'SRC-ARAPAHOE-COUNTY-TREASURER';
assert.equal(registry.records.filter((item) => item.sourceId === arapahoeAssessorSourceId).length, 1, 'Arapahoe County Assessor source must exist exactly once.');
const arapahoeAssessor = record(arapahoeAssessorSourceId);
const arapahoeAssessorText = JSON.stringify(arapahoeAssessor);
assert.equal(arapahoeAssessor.publicName, 'Arapahoe County Assessor');
assert.equal(arapahoeAssessor.responsibleOrganization, "Arapahoe County Assessor's Office");
assert.equal(arapahoeAssessor.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(arapahoeAssessor.category, 'COUNTY_ASSESSOR');
assert.equal(arapahoeAssessor.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(arapahoeAssessor.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(arapahoeAssessor.claimEligible, false);
assert.equal(arapahoeAssessor.customerStatus, 'Blocked / not authorized');
assert.match(arapahoeAssessor.currentReieUse, /Exact source identity only/);
assert.match(arapahoeAssessor.currentReieUse, /future-governed Arapahoe County Assessor review/);
assert.match(arapahoeAssessor.currentReieUse, /no property search submission/);
assert.match(arapahoeAssessor.currentReieUse, /no .* Data Mart export/);
assert.match(arapahoeAssessor.currentReieUse, /no .* GIS access/);
assert.match(arapahoeAssessor.currentReieUse, /no .* property-record retrieval/);
assert.match(arapahoeAssessor.currentReieUse, /no .* owner\/address lookup/);
assert.match(arapahoeAssessor.currentReieUse, /no .* parcel\/account lookup/);
assert.match(arapahoeAssessor.currentReieUse, /no .* customer display/);
assert.match(arapahoeAssessorText, /ASSESSOR_RECORD_NOT_TITLE/);
assert.match(arapahoeAssessorText, /ASSESSOR_RECORD_NOT_DEED_VALIDITY/);
assert.match(arapahoeAssessorText, /ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS/);
assert.match(arapahoeAssessorText, /ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE/);
assert.match(arapahoeAssessorText, /ASSESSED_VALUE_NOT_MARKET_VALUE/);
assert.match(arapahoeAssessorText, /PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY/);
assert.match(arapahoeAssessorText, /PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY/);
assert.match(arapahoeAssessorText, /GOVERNMENT_SOURCE_NOT_VERIFIED_COMPLETE_OR_UNRESTRICTED/);
assert.match(arapahoeAssessorText, /COUNTY_ASSESSOR_NOT_COUNTY_TREASURER/);
assert.match(arapahoeAssessorText, /COUNTY_ASSESSOR_NOT_RECORDER/);
assert.match(arapahoeAssessorText, /COUNTY_ASSESSOR_NOT_PARCEL_GIS/);
assert.match(arapahoeAssessorText, /public search interface only/);
assert.match(arapahoeAssessorText, /extract\/download channel only/);
assert.match(arapahoeAssessorText, /GIS channels only/);
assert.match(arapahoeAssessorText, /do not grant rights, access, freshness, attribution, provenance, findings, or governance inheritance/);
assert.match(arapahoeAssessorText, /Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown/);
assert.doesNotMatch(arapahoeAssessorText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(arapahoeAssessorText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => /^SRC-ARAPAHOE-COUNTY-(RECORDER|PARCEL|GIS|DATA-MART|PARCEL-SEARCH)/.test(item.sourceId)).length, 0, 'Arapahoe Assessor Registry MVV must not add Recorder, Parcel Search, Data Mart, or GIS source ids.');
assert.equal(registry.records.filter((item) => item.sourceId.startsWith('SRC-ARAPAHOE-COUNTY-TREASURER') && item.sourceId !== arapahoeTreasurerSourceId).length, 0, 'Arapahoe Assessor Registry MVV must not add Treasurer aliases beyond the exact separately governed Treasurer source.');
assert.equal(registry.records.filter((item) => item.sourceId !== arapahoeTreasurerSourceId && /ARAPAHOE.*(TREASURER|RECORDER|GIS|DATA_MART|PARCEL_SEARCH|PARCEL_GEOMETRY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Arapahoe Assessor Registry MVV must not conflate assessor identity with adjacent domains.');
if (fs.existsSync('lib/sourceQualityArapahoeCountyAssessorEvidence.ts')) {
  const arapahoeAssessorEvidence = read('lib/sourceQualityArapahoeCountyAssessorEvidence.ts');
  assert.match(arapahoeAssessorEvidence, /ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID/, 'Arapahoe Assessor evidence must bind through the canonical exact source identity constant.');
  assert.match(arapahoeAssessorEvidence, /CERT-ARAPAHOE-COUNTY-ASSESSOR-SOURCE-QUALITY-EVIDENCE-001/, 'Arapahoe Assessor evidence must use source-specific certification.');
  assert.match(arapahoeAssessorEvidence, /COUNTY_ASSESSOR/, 'Arapahoe Assessor evidence must preserve the canonical County Assessor class.');
  assert.match(arapahoeAssessorEvidence, /CERTIFICATION_REFERENCE/, 'Arapahoe Assessor evidence must remain certification-reference-only.');
  assert.doesNotMatch(arapahoeAssessorEvidence, /getReieSourceRegistry|sourceRegistry/, 'Arapahoe Assessor evidence must not mutate or depend on Registry implementation state.');
  assert.doesNotMatch(arapahoeAssessorEvidence, /sourceQualityOperationalManifestData|sourceQualityAdminPreviewFixture/, 'Arapahoe Assessor evidence must not create Manifest or Admin Preview coupling.');
  assert.doesNotMatch(arapahoeAssessorEvidence, /RIGHTS_VERIFIED|TECHNICAL_ACCESS_READY|FRESHNESS_VERIFIED|PROVENANCE_COMPLETE|ACTIVE_AUTHORIZED/, 'Arapahoe Assessor evidence must not upgrade rights, access, freshness, provenance, or activation posture.');
}

assert.equal(registry.records.filter((item) => item.sourceId === arapahoeTreasurerSourceId).length, 1, 'Arapahoe County Treasurer source must exist exactly once.');
const arapahoeTreasurer = record(arapahoeTreasurerSourceId);
const arapahoeTreasurerText = JSON.stringify(arapahoeTreasurer);
assert.equal(arapahoeTreasurer.publicName, 'Arapahoe County Treasurer');
assert.equal(arapahoeTreasurer.responsibleOrganization, 'Arapahoe County Treasurer');
assert.equal(arapahoeTreasurer.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(arapahoeTreasurer.category, 'COUNTY_TREASURER_TAX');
assert.equal(arapahoeTreasurer.jurisdiction.state, 'Colorado');
assert.equal(arapahoeTreasurer.jurisdiction.county, 'Arapahoe County');
assert.equal(arapahoeTreasurer.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(arapahoeTreasurer.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(arapahoeTreasurer.claimEligible, false);
assert.equal(arapahoeTreasurer.customerStatus, 'Blocked / not authorized');
assert.match(arapahoeTreasurer.currentReieUse, /Exact source identity only/);
assert.match(arapahoeTreasurer.currentReieUse, /future-governed Arapahoe County Treasurer review/);
assert.match(arapahoeTreasurer.currentReieUse, /no Tax Search submission/);
assert.match(arapahoeTreasurer.currentReieUse, /no online payment/);
assert.match(arapahoeTreasurer.currentReieUse, /no daily or yearly tax extract access/);
assert.match(arapahoeTreasurer.currentReieUse, /no .* Certificate of Taxes Due/);
assert.match(arapahoeTreasurer.currentReieUse, /no delinquent-tax publication use/);
assert.match(arapahoeTreasurer.currentReieUse, /no tax-lien operation/);
assert.match(arapahoeTreasurer.currentReieUse, /no Public Trustee operation/);
assert.match(arapahoeTreasurer.currentReieUse, /no assessor-record use/);
assert.match(arapahoeTreasurer.currentReieUse, /no recorder-record use/);
assert.match(arapahoeTreasurer.currentReieUse, /no GIS use/);
assert.match(arapahoeTreasurer.currentReieUse, /no tax-record retrieval/);
assert.match(arapahoeTreasurer.currentReieUse, /no .* customer display/);
assert.match(arapahoeTreasurerText, /TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY/);
assert.match(arapahoeTreasurerText, /TREASURER_RECORD_NOT_TITLE/);
assert.match(arapahoeTreasurerText, /TREASURER_RECORD_NOT_RECORDER_INDEX/);
assert.match(arapahoeTreasurerText, /TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY/);
assert.match(arapahoeTreasurerText, /PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY/);
assert.match(arapahoeTreasurerText, /PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY/);
assert.match(arapahoeTreasurerText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(arapahoeTreasurerText, /PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY/);
assert.match(arapahoeTreasurerText, /TAX_EXTRACT_NOT_UNRESTRICTED_OR_REUSE_READY/);
assert.match(arapahoeTreasurerText, /CERTIFICATE_OF_TAXES_DUE_NOT_TITLE_OR_LIEN_CLEARANCE_GUARANTEE/);
assert.match(arapahoeTreasurerText, /FEE_STATUS_SOURCE_SPECIFIC/);
assert.match(arapahoeTreasurerText, /TAX_CURRENTNESS_SOURCE_SPECIFIC/);
assert.match(arapahoeTreasurerText, /SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(arapahoeTreasurerText, /CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV/);
assert.match(arapahoeTreasurerText, /LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV/);
assert.match(arapahoeTreasurerText, /Tax Search, online payment, daily and yearly tax extracts, tax statements and receipts, Certificate of Taxes Due, delinquent-tax publications, tax liens, Public Trustee, Assessor, Recorder, and GIS channels are separately governed/);
assert.match(arapahoeTreasurerText, /Boulder County Treasurer, Arapahoe County Assessor/);
assert.match(arapahoeTreasurerText, /Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown/);
assert.doesNotMatch(arapahoeTreasurerText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(arapahoeTreasurerText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => /^SRC-ARAPAHOE-COUNTY-(TAX-PAYMENT|TAX-EXTRACT|TAX-STATEMENT|TAX-RECEIPT|CERTIFICATE|CERTIFICATE-OF-TAXES-DUE|DELINQUENT-TAX|TAX-LIEN|PUBLIC-TRUSTEE|RECORDER|GIS)/.test(item.sourceId)).length, 0, 'Arapahoe Treasurer Registry MVV must not add payment, extract, certificate, lien, Public Trustee, Recorder, or GIS source ids.');
assert.equal(registry.records.filter((item) => /ARAPAHOE.*(TAX_PAYMENT|TAX_EXTRACT|CERTIFICATE|LIEN|PUBLIC_TRUSTEE|RECORDER|GIS|ASSESSOR_VALUE_AUTHORITY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Arapahoe Treasurer Registry MVV must not conflate Treasurer identity with adjacent domains.');
assert.doesNotMatch(arapahoeTreasurerText, /EXP-|SRA-|provider aggregate|wildcard County Treasurer/i);

const adamsTreasurerSourceId = 'SRC-ADAMS-COUNTY-TREASURER';
assert.equal(registry.records.filter((item) => item.sourceId === adamsTreasurerSourceId).length, 1, 'Adams County Treasurer source must exist exactly once.');
const adamsTreasurer = record(adamsTreasurerSourceId);
const adamsTreasurerText = JSON.stringify(adamsTreasurer);
assert.equal(adamsTreasurer.publicName, 'Adams County Treasurer');
assert.equal(adamsTreasurer.responsibleOrganization, 'Adams County Treasurer / Treasurer Division');
assert.equal(adamsTreasurer.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(adamsTreasurer.category, 'COUNTY_TREASURER_TAX');
assert.equal(adamsTreasurer.jurisdiction.state, 'Colorado');
assert.equal(adamsTreasurer.jurisdiction.county, 'Adams County');
assert.equal(adamsTreasurer.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(adamsTreasurer.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(adamsTreasurer.claimEligible, false);
assert.equal(adamsTreasurer.customerStatus, 'Blocked / not authorized');
assert.match(adamsTreasurer.currentReieUse, /Exact source identity only/);
assert.match(adamsTreasurer.currentReieUse, /future-governed Adams County Treasurer review/);
assert.match(adamsTreasurer.currentReieUse, /no tax search submission/);
assert.match(adamsTreasurer.currentReieUse, /no payment/);
assert.match(adamsTreasurer.currentReieUse, /no tax-lien action/);
assert.match(adamsTreasurer.currentReieUse, /no Treasurer deed action/);
assert.match(adamsTreasurer.currentReieUse, /no certificate action/);
assert.match(adamsTreasurer.currentReieUse, /no fee-schedule reliance/);
assert.match(adamsTreasurer.currentReieUse, /no report or distribution-statement use/);
assert.match(adamsTreasurer.currentReieUse, /no Public Trustee operation/);
assert.match(adamsTreasurer.currentReieUse, /no assessor-record use/);
assert.match(adamsTreasurer.currentReieUse, /no recorder-record use/);
assert.match(adamsTreasurer.currentReieUse, /no GIS use/);
assert.match(adamsTreasurer.currentReieUse, /no tax-record retrieval/);
assert.match(adamsTreasurer.currentReieUse, /no .* customer display/);
assert.match(adamsTreasurerText, /TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY/);
assert.match(adamsTreasurerText, /TREASURER_RECORD_NOT_TITLE/);
assert.match(adamsTreasurerText, /TREASURER_RECORD_NOT_RECORDER_INDEX/);
assert.match(adamsTreasurerText, /TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY/);
assert.match(adamsTreasurerText, /PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY/);
assert.match(adamsTreasurerText, /PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY/);
assert.match(adamsTreasurerText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(adamsTreasurerText, /PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY/);
assert.match(adamsTreasurerText, /TREASURER_DEED_NOT_TITLE_CLEARANCE/);
assert.match(adamsTreasurerText, /TAX_LIEN_DATA_NOT_OWNERSHIP_OR_REDEMPTION_CONCLUSION/);
assert.match(adamsTreasurerText, /TREASURER_FEE_STATUS_SOURCE_SPECIFIC/);
assert.match(adamsTreasurerText, /TAX_CURRENTNESS_SOURCE_SPECIFIC/);
assert.match(adamsTreasurerText, /TREASURER_REPORTS_NOT_COMPLETE_TAX_RECORD_UNIVERSE/);
assert.match(adamsTreasurerText, /SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(adamsTreasurerText, /CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV/);
assert.match(adamsTreasurerText, /LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV/);
assert.match(adamsTreasurerText, /tax search, payment, tax-lien sale, Treasurer deed, deed application, certificates, fee schedules, reports and distribution statements, Public Trustee, Assessor, Clerk and Recorder, GIS, and permit channels are separately governed/);
assert.match(adamsTreasurerText, /Boulder County Treasurer, Arapahoe County Treasurer, Adams County Assessor/);
assert.match(adamsTreasurerText, /Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown/);
assert.doesNotMatch(adamsTreasurerText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(adamsTreasurerText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => item.sourceId !== adamsAssessorSourceId && /^SRC-ADAMS-COUNTY-(TAX-PAYMENT|TAX-SEARCH|TAX-LIEN|TREASURER-DEED|DEED-APPLICATION|CERTIFICATE|FEE-SCHEDULE|REPORT|DISTRIBUTION|PUBLIC-TRUSTEE|ASSESSOR|RECORDER|CLERK|GIS|PERMIT)/.test(item.sourceId)).length, 0, 'Adams Treasurer Registry MVV must not add payment, search, lien, deed, certificate, fee, report, Public Trustee, unauthorized Assessor, Recorder, GIS, or Permit source ids.');
assert.equal(registry.records.filter((item) => item.sourceId !== adamsAssessorSourceId && item.sourceId !== adamsTreasurerSourceId && /ADAMS.*(TAX_PAYMENT|TAX_SEARCH|TAX_LIEN|TREASURER_DEED|PUBLIC_TRUSTEE|RECORDER|GIS|ASSESSOR_VALUE_AUTHORITY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Adams Treasurer Registry MVV must not conflate Treasurer identity with adjacent domains.');
assert.doesNotMatch(adamsTreasurerText, /EXP-|SRA-|provider aggregate|wildcard County Treasurer/i);
if (fs.existsSync('lib/sourceQualityAdamsCountyTreasurerEvidence.ts')) {
  const adamsTreasurerEvidence = read('lib/sourceQualityAdamsCountyTreasurerEvidence.ts');
  assert.match(adamsTreasurerEvidence, /ADAMS_COUNTY_TREASURER_SOURCE_ID/, 'Adams Treasurer evidence must bind through the canonical exact source identity constant.');
  assert.match(adamsTreasurerEvidence, /CERT-ADAMS-COUNTY-TREASURER-SOURCE-QUALITY-EVIDENCE-001/, 'Adams Treasurer evidence must use source-specific certification.');
  assert.match(adamsTreasurerEvidence, /COUNTY_TREASURER/, 'Adams Treasurer evidence must preserve the canonical County Treasurer class.');
  assert.match(adamsTreasurerEvidence, /CERTIFICATION_REFERENCE/, 'Adams Treasurer evidence must remain certification-reference-only.');
  assert.doesNotMatch(adamsTreasurerEvidence, /getReieSourceRegistry|sourceRegistry/, 'Adams Treasurer evidence must not mutate or depend on Registry implementation state.');
  assert.doesNotMatch(adamsTreasurerEvidence, /sourceQualityOperationalManifestData|sourceQualityAdminPreviewFixture/, 'Adams Treasurer evidence must not create Manifest or Admin Preview coupling before Manifest authorization.');
  assert.doesNotMatch(adamsTreasurerEvidence, /RIGHTS_VERIFIED|TECHNICAL_ACCESS_READY|FRESHNESS_VERIFIED|PROVENANCE_COMPLETE|ACTIVE_AUTHORIZED/, 'Adams Treasurer evidence must not upgrade rights, access, freshness, provenance, or activation posture.');
}

const jeffersonTreasurerSourceId = JEFFERSON_COUNTY_TREASURER_SOURCE_ID;
assert.equal(registry.records.filter((item) => item.sourceId === jeffersonTreasurerSourceId).length, 1, 'Jefferson County Treasurer source must exist exactly once.');
assert.equal(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.filter((item) => item.sourceId === jeffersonTreasurerSourceId).length, 1, 'Jefferson County Treasurer finite definition must exist exactly once.');
assert.equal(isCountyTreasurerExactSourceId(jeffersonTreasurerSourceId), true, 'Jefferson County Treasurer must be accepted only after exact finite definition.');
const jeffersonTreasurerDefinition = COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.find((item) => item.sourceId === jeffersonTreasurerSourceId);
const jeffersonTreasurer = record(jeffersonTreasurerSourceId);
const jeffersonTreasurerText = JSON.stringify(jeffersonTreasurer);
assert.equal(jeffersonTreasurerDefinition?.sourceClass, 'COUNTY_TREASURER');
assert.equal(jeffersonTreasurerDefinition?.jurisdiction.state, 'Colorado');
assert.equal(jeffersonTreasurerDefinition?.jurisdiction.county, 'Jefferson County');
assert.equal(jeffersonTreasurerDefinition?.responsibleOrganization, "Jefferson County Treasurer's Office");
assert.equal(jeffersonTreasurer.publicName, 'Jefferson County Treasurer');
assert.equal(jeffersonTreasurer.responsibleOrganization, "Jefferson County Treasurer's Office");
assert.equal(jeffersonTreasurer.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(jeffersonTreasurer.category, 'COUNTY_TREASURER_TAX');
assert.equal(jeffersonTreasurer.jurisdiction.state, 'Colorado');
assert.equal(jeffersonTreasurer.jurisdiction.county, 'Jefferson County');
assert.equal(jeffersonTreasurer.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(jeffersonTreasurer.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(jeffersonTreasurer.claimEligible, false);
assert.equal(jeffersonTreasurer.customerStatus, 'Blocked / not authorized');
assert.match(jeffersonTreasurer.currentReieUse, /Exact source identity only/);
assert.match(jeffersonTreasurer.currentReieUse, /future-governed Jefferson County Treasurer review/);
assert.match(jeffersonTreasurer.currentReieUse, /no Property Search & Pay Taxes submission/);
assert.match(jeffersonTreasurer.currentReieUse, /no payment/);
assert.match(jeffersonTreasurer.currentReieUse, /no tax-lien sale action/);
assert.match(jeffersonTreasurer.currentReieUse, /no deed application action/);
assert.match(jeffersonTreasurer.currentReieUse, /no certificate action or portal certificate claim/);
assert.match(jeffersonTreasurer.currentReieUse, /no Public Trustee operation/);
assert.match(jeffersonTreasurer.currentReieUse, /no assessor-record use/);
assert.match(jeffersonTreasurer.currentReieUse, /no recorder-record use/);
assert.match(jeffersonTreasurer.currentReieUse, /no GIS use/);
assert.match(jeffersonTreasurer.currentReieUse, /no tax-record retrieval/);
assert.match(jeffersonTreasurer.currentReieUse, /no .* customer display/);
assert.match(jeffersonTreasurerText, /TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY/);
assert.match(jeffersonTreasurerText, /TREASURER_RECORD_NOT_TITLE/);
assert.match(jeffersonTreasurerText, /TREASURER_RECORD_NOT_RECORDER_INDEX/);
assert.match(jeffersonTreasurerText, /TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY/);
assert.match(jeffersonTreasurerText, /PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY/);
assert.match(jeffersonTreasurerText, /PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY/);
assert.match(jeffersonTreasurerText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(jeffersonTreasurerText, /PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY/);
assert.match(jeffersonTreasurerText, /FEE_STATUS_SOURCE_SPECIFIC/);
assert.match(jeffersonTreasurerText, /TAX_CURRENTNESS_SOURCE_SPECIFIC/);
assert.match(jeffersonTreasurerText, /TAX_CERTIFICATES_NOT_AVAILABLE_THROUGH_PORTAL/);
assert.match(jeffersonTreasurerText, /TAX_LIEN_SALE_NOT_OWNERSHIP_OR_REDEMPTION_CONCLUSION/);
assert.match(jeffersonTreasurerText, /DEED_APPLICATION_NOT_TITLE_CLEARANCE/);
assert.match(jeffersonTreasurerText, /SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(jeffersonTreasurerText, /CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV/);
assert.match(jeffersonTreasurerText, /LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV/);
assert.match(jeffersonTreasurerText, /Tax Certificates are not available through the website\/portal/);
assert.match(jeffersonTreasurerText, /not a general legal impossibility statement/);
assert.match(jeffersonTreasurerText, /Property Search & Pay Taxes, payment, tax-lien sale, deed application, certificates, Public Trustee, Assessor, Recorder, and GIS channels are separately governed/);
assert.match(jeffersonTreasurerText, /Boulder County Treasurer, Arapahoe County Treasurer, Adams County Treasurer, Jefferson County Assessor/);
assert.match(jeffersonTreasurerText, /Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown/);
assert.doesNotMatch(jeffersonTreasurerText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(jeffersonTreasurerText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => item.sourceId !== 'SRC-JEFFERSON-COUNTY-ASSESSOR' && /^SRC-JEFFERSON-COUNTY-(TAX-PAYMENT|TAX-SEARCH|PROPERTY-SEARCH|TAX-LIEN|DEED-APPLICATION|CERTIFICATE|PUBLIC-TRUSTEE|RECORDER|GIS|ASPIN|PARCEL|PERMIT)/.test(item.sourceId)).length, 0, 'Jefferson Treasurer Registry MVV must not add payment, search, lien, deed application, certificate, Public Trustee, Recorder, GIS, parcel, or permit source ids.');
assert.equal(registry.records.filter((item) => item.sourceId !== 'SRC-JEFFERSON-COUNTY-ASSESSOR' && item.sourceId !== jeffersonTreasurerSourceId && /JEFFERSON.*(TAX_PAYMENT|TAX_SEARCH|PROPERTY_SEARCH|TAX_LIEN|DEED_APPLICATION|CERTIFICATE|PUBLIC_TRUSTEE|RECORDER|GIS|PARCEL_GEOMETRY|ASSESSOR_VALUE_AUTHORITY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Jefferson Treasurer Registry MVV must not conflate Treasurer identity with adjacent domains.');
assert.doesNotMatch(jeffersonTreasurerText, /EXP-|SRA-|provider aggregate|wildcard County Treasurer/i);
const treasurerExactSourceDefinitionsRuntime = read('lib/sourceQualityCountyTreasurerExactSourceDefinitions.ts');
assert.doesNotMatch(treasurerExactSourceDefinitionsRuntime, /rights|technicalAccess|freshness|attribution|provenance|fee|sensitivity|reviewedAt|certification|evidence|payment|lien|deed|Manifest|activation|claimEligible|startsWith|includes\(sourceId\)|COUNTY_TREASURER_TAX/, 'Finite Treasurer definition must not centralize source-specific governance.');
assert.equal((treasurerExactSourceDefinitionsRuntime.match(/Public Trustee/g) ?? []).length, 2, 'Public Trustee text must appear only inside Weld and Larimer responsible organization identities.');
assert.equal(read('lib/sourceQualityOperationalManifestData.ts').includes(jeffersonTreasurerSourceId), false, 'Jefferson Treasurer must remain Registry-only until Manifest inclusion authorization.');

const weldTreasurerSourceId = WELD_COUNTY_TREASURER_SOURCE_ID;
assert.equal(registry.records.filter((item) => item.sourceId === weldTreasurerSourceId).length, 1, 'Weld County Treasurer source must exist exactly once.');
assert.equal(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.filter((item) => item.sourceId === weldTreasurerSourceId).length, 1, 'Weld County Treasurer finite definition must exist exactly once.');
assert.equal(isCountyTreasurerExactSourceId(weldTreasurerSourceId), true, 'Weld County Treasurer must be accepted only after exact finite definition.');
const weldTreasurerDefinition = COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.find((item) => item.sourceId === weldTreasurerSourceId);
const weldTreasurer = record(weldTreasurerSourceId);
const weldTreasurerText = JSON.stringify(weldTreasurer);
assert.equal(weldTreasurerDefinition?.sourceClass, 'COUNTY_TREASURER');
assert.equal(weldTreasurerDefinition?.jurisdiction.state, 'Colorado');
assert.equal(weldTreasurerDefinition?.jurisdiction.county, 'Weld County');
assert.equal(weldTreasurerDefinition?.responsibleOrganization, 'Weld County Treasurer and Public Trustee');
assert.equal(weldTreasurer.publicName, 'Weld County Treasurer');
assert.equal(weldTreasurer.responsibleOrganization, 'Weld County Treasurer and Public Trustee');
assert.equal(weldTreasurer.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(weldTreasurer.category, 'COUNTY_TREASURER_TAX');
assert.equal(weldTreasurer.jurisdiction.state, 'Colorado');
assert.equal(weldTreasurer.jurisdiction.county, 'Weld County');
assert.equal(weldTreasurer.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(weldTreasurer.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(weldTreasurer.claimEligible, false);
assert.equal(weldTreasurer.customerStatus, 'Blocked / not authorized');
assert.match(weldTreasurer.currentReieUse, /Exact source identity only/);
assert.match(weldTreasurer.currentReieUse, /future-governed Weld County Treasurer review/);
assert.match(weldTreasurer.currentReieUse, /no tax search/);
assert.match(weldTreasurer.currentReieUse, /no payment/);
assert.match(weldTreasurer.currentReieUse, /no tax-lien sale action/);
assert.match(weldTreasurer.currentReieUse, /no Treasurer Deed auction/);
assert.match(weldTreasurer.currentReieUse, /no distribution-statement or report use/);
assert.match(weldTreasurer.currentReieUse, /no special-assessment use/);
assert.match(weldTreasurer.currentReieUse, /no manufactured-home tax use/);
assert.match(weldTreasurer.currentReieUse, /no Public Trustee/);
assert.match(weldTreasurer.currentReieUse, /no assessor-record use/);
assert.match(weldTreasurer.currentReieUse, /no Clerk and Recorder use/);
assert.match(weldTreasurer.currentReieUse, /no GIS or map use/);
assert.match(weldTreasurer.currentReieUse, /no tax-record retrieval/);
assert.match(weldTreasurer.currentReieUse, /no .* customer display/);
assert.match(weldTreasurerText, /TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY/);
assert.match(weldTreasurerText, /TREASURER_RECORD_NOT_TITLE/);
assert.match(weldTreasurerText, /TREASURER_RECORD_NOT_RECORDER_INDEX/);
assert.match(weldTreasurerText, /TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY/);
assert.match(weldTreasurerText, /PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY/);
assert.match(weldTreasurerText, /PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY/);
assert.match(weldTreasurerText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(weldTreasurerText, /PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY/);
assert.match(weldTreasurerText, /TAX_CURRENTNESS_SOURCE_SPECIFIC/);
assert.match(weldTreasurerText, /FEE_STATUS_SOURCE_SPECIFIC/);
assert.match(weldTreasurerText, /WELD_PAYMENT_FEES_SOURCE_SPECIFIC/);
assert.match(weldTreasurerText, /WELD_TAX_DEADLINES_NOT_CURRENTNESS_GUARANTEE/);
assert.match(weldTreasurerText, /WELD_TAX_LIEN_SALE_NOT_OWNERSHIP_OR_REDEMPTION_CONCLUSION/);
assert.match(weldTreasurerText, /WELD_TREASURER_DEED_NOT_TITLE_CLEARANCE/);
assert.match(weldTreasurerText, /WELD_LIEN_PAYMENT_RESTRICTIONS_APPLY/);
assert.match(weldTreasurerText, /WELD_SPECIAL_ASSESSMENT_CHANNEL_SEPARATE/);
assert.match(weldTreasurerText, /WELD_MANUFACTURED_HOME_TAX_CHANNEL_SEPARATE/);
assert.match(weldTreasurerText, /WELD_DISTRIBUTION_STATEMENTS_NOT_COMPLETE_TAX_RECORD_UNIVERSE/);
assert.match(weldTreasurerText, /WELD_PUBLIC_TRUSTEE_NOT_TREASURER_DATA_AUTHORITY/);
assert.match(weldTreasurerText, /SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(weldTreasurerText, /CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV/);
assert.match(weldTreasurerText, /LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV/);
assert.match(weldTreasurerText, /combined Weld County Treasurer and Public Trustee office name does not aggregate Public Trustee authority into this Treasurer tax Registry identity/);
assert.match(weldTreasurerText, /tax search, payment, tax-lien sale, Treasurer Deed auctions, distribution statements and reports, special assessments, manufactured-home tax information, Public Trustee releases, foreclosure, tax escrow, Assessor, Clerk and Recorder, GIS\/maps, permits, and records channels are separately governed/);
assert.match(weldTreasurerText, /Boulder County Treasurer, Arapahoe County Treasurer, Adams County Treasurer, Jefferson County Treasurer, Weld County Assessor/);
assert.match(weldTreasurerText, /Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown/);
assert.doesNotMatch(weldTreasurerText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(weldTreasurerText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => item.sourceId !== 'SRC-WELD-COUNTY-ASSESSOR' && /^SRC-WELD-COUNTY-(TAX-PAYMENT|TAX-SEARCH|TAX-LIEN|TREASURER-DEED|DISTRIBUTION|SPECIAL-ASSESSMENT|MANUFACTURED-HOME|PUBLIC-TRUSTEE|RECORDER|CLERK|GIS|MAP|PERMIT|RECORDS)/.test(item.sourceId)).length, 0, 'Weld Treasurer Registry MVV must not add payment, search, lien, deed, distribution, special assessment, manufactured-home tax, Public Trustee, Recorder, Clerk, GIS, map, permit, or records source ids.');
assert.equal(registry.records.filter((item) => item.sourceId !== 'SRC-WELD-COUNTY-ASSESSOR' && item.sourceId !== weldTreasurerSourceId && /WELD.*(TAX_PAYMENT|TAX_SEARCH|TAX_LIEN|TREASURER_DEED|DISTRIBUTION|SPECIAL_ASSESSMENT|MANUFACTURED_HOME|PUBLIC_TRUSTEE|RECORDER|CLERK|GIS|PERMITS|RECORDS|ASSESSOR_VALUE_AUTHORITY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Weld Treasurer Registry MVV must not conflate Treasurer identity with adjacent domains.');
assert.doesNotMatch(weldTreasurerText, /EXP-|SRA-|provider aggregate|wildcard County Treasurer/i);
assert.equal(read('lib/sourceQualityOperationalManifestData.ts').includes('WELD_COUNTY_TREASURER_SOURCE_ID'), true, 'Weld Treasurer must remain Manifest-included after Manifest inclusion authorization.');

const larimerTreasurerSourceId = LARIMER_COUNTY_TREASURER_SOURCE_ID;
assert.equal(registry.records.filter((item) => item.sourceId === larimerTreasurerSourceId).length, 1, 'Larimer County Treasurer source must exist exactly once.');
assert.equal(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.filter((item) => item.sourceId === larimerTreasurerSourceId).length, 1, 'Larimer County Treasurer finite definition must exist exactly once.');
assert.equal(isCountyTreasurerExactSourceId(larimerTreasurerSourceId), true, 'Larimer County Treasurer must be accepted only after exact finite definition.');
const larimerTreasurerDefinition = COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.find((item) => item.sourceId === larimerTreasurerSourceId);
const larimerTreasurer = record(larimerTreasurerSourceId);
const larimerTreasurerText = JSON.stringify(larimerTreasurer);
assert.equal(larimerTreasurerDefinition?.sourceClass, 'COUNTY_TREASURER');
assert.equal(larimerTreasurerDefinition?.jurisdiction.state, 'Colorado');
assert.equal(larimerTreasurerDefinition?.jurisdiction.county, 'Larimer County');
assert.equal(larimerTreasurerDefinition?.responsibleOrganization, 'Larimer County Treasurer & Public Trustee');
assert.equal(larimerTreasurer.publicName, 'Larimer County Treasurer');
assert.equal(larimerTreasurer.responsibleOrganization, 'Larimer County Treasurer & Public Trustee');
assert.equal(larimerTreasurer.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(larimerTreasurer.category, 'COUNTY_TREASURER_TAX');
assert.equal(larimerTreasurer.jurisdiction.state, 'Colorado');
assert.equal(larimerTreasurer.jurisdiction.county, 'Larimer County');
assert.equal(larimerTreasurer.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(larimerTreasurer.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(larimerTreasurer.claimEligible, false);
assert.equal(larimerTreasurer.customerStatus, 'Blocked / not authorized');
assert.match(larimerTreasurer.currentReieUse, /Exact source identity only/);
assert.match(larimerTreasurer.currentReieUse, /future-governed Larimer County Treasurer review/);
assert.match(larimerTreasurer.currentReieUse, /no property or tax search/);
assert.match(larimerTreasurer.currentReieUse, /no tax-statement use/);
assert.match(larimerTreasurer.currentReieUse, /no payment/);
assert.match(larimerTreasurer.currentReieUse, /no delinquent-information use/);
assert.match(larimerTreasurer.currentReieUse, /no receipt use/);
assert.match(larimerTreasurer.currentReieUse, /no exemption or deferral tax-status claim/);
assert.match(larimerTreasurer.currentReieUse, /no manufactured-home tax use/);
assert.match(larimerTreasurer.currentReieUse, /no special-assessment use/);
assert.match(larimerTreasurer.currentReieUse, /no Public Trustee foreclosure or release/);
assert.match(larimerTreasurer.currentReieUse, /no assessor-record use/);
assert.match(larimerTreasurer.currentReieUse, /no recorder-record use/);
assert.match(larimerTreasurer.currentReieUse, /no GIS, planning, or zoning use/);
assert.match(larimerTreasurer.currentReieUse, /no tax-record retrieval/);
assert.match(larimerTreasurer.currentReieUse, /no .* customer display/);
assert.match(larimerTreasurerText, /TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY/);
assert.match(larimerTreasurerText, /TREASURER_RECORD_NOT_TITLE/);
assert.match(larimerTreasurerText, /TREASURER_RECORD_NOT_RECORDER_INDEX/);
assert.match(larimerTreasurerText, /TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY/);
assert.match(larimerTreasurerText, /PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY/);
assert.match(larimerTreasurerText, /PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY/);
assert.match(larimerTreasurerText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(larimerTreasurerText, /PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY/);
assert.match(larimerTreasurerText, /TAX_CURRENTNESS_SOURCE_SPECIFIC/);
assert.match(larimerTreasurerText, /FEE_STATUS_SOURCE_SPECIFIC/);
assert.match(larimerTreasurerText, /LARIMER_TREASURER_PUBLIC_TRUSTEE_COMBINED_OFFICE_NOT_COMBINED_SOURCE_AUTHORITY/);
assert.match(larimerTreasurerText, /LARIMER_SCHEDULED_MAINTENANCE_NOT_CURRENTNESS_GUARANTEE/);
assert.match(larimerTreasurerText, /LARIMER_CURRENT_STATEMENTS_NOT_COMPLETE_TAX_HISTORY/);
assert.match(larimerTreasurerText, /LARIMER_DELINQUENT_STATEMENTS_SOURCE_SPECIFIC/);
assert.match(larimerTreasurerText, /LARIMER_MANUFACTURED_HOME_TAX_CHANNEL_SEPARATE/);
assert.match(larimerTreasurerText, /LARIMER_SPECIAL_ASSESSMENT_CHANNEL_SEPARATE/);
assert.match(larimerTreasurerText, /LARIMER_EXEMPTION_DEFERRAL_NOT_TAX_STATUS_CLEARANCE/);
assert.match(larimerTreasurerText, /LARIMER_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY/);
assert.match(larimerTreasurerText, /LARIMER_FORECLOSURE_RELEASE_NOT_TREASURER_RECORD_AUTHORITY/);
assert.match(larimerTreasurerText, /LARIMER_PUBLIC_TRUSTEE_NOT_TREASURER_DATA_AUTHORITY/);
assert.match(larimerTreasurerText, /SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(larimerTreasurerText, /CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV/);
assert.match(larimerTreasurerText, /LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV/);
assert.match(larimerTreasurerText, /combined Larimer County Treasurer & Public Trustee office name does not aggregate Public Trustee foreclosure or release authority into this Treasurer tax Registry identity/);
assert.match(larimerTreasurerText, /property and tax search, tax statements, payments, delinquent information, receipts, exemptions and deferrals, manufactured-home tax, special assessments, Public Trustee foreclosure and release duties, Assessor, Recorder, GIS, planning, zoning, permits, and records channels are separately governed/);
assert.match(larimerTreasurerText, /Boulder County Treasurer, Arapahoe County Treasurer, Adams County Treasurer, Jefferson County Treasurer, Weld County Treasurer, Larimer County Assessor/);
assert.match(larimerTreasurerText, /Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown/);
assert.doesNotMatch(larimerTreasurerText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(larimerTreasurerText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => item.sourceId !== 'SRC-LARIMER-COUNTY-ASSESSOR' && /^SRC-LARIMER-COUNTY-(TAX-PAYMENT|TAX-SEARCH|PROPERTY-SEARCH|STATEMENT|PAYMENT|DELINQUENT|RECEIPT|EXEMPTION|DEFERRAL|MANUFACTURED-HOME|SPECIAL-ASSESSMENT|PUBLIC-TRUSTEE|FORECLOSURE|RELEASE|RECORDER|GIS|PLANNING|ZONING|PERMIT|RECORDS)/.test(item.sourceId)).length, 0, 'Larimer Treasurer Registry MVV must not add payment, search, statement, delinquent, receipt, exemption, deferral, manufactured-home, special assessment, Public Trustee, foreclosure, release, Recorder, GIS, planning, zoning, permit, or records source ids.');
assert.equal(registry.records.filter((item) => item.sourceId !== 'SRC-LARIMER-COUNTY-ASSESSOR' && item.sourceId !== larimerTreasurerSourceId && /LARIMER.*(TAX_PAYMENT|TAX_SEARCH|PROPERTY_SEARCH|STATEMENT|DELINQUENT|RECEIPT|EXEMPTION|DEFERRAL|MANUFACTURED_HOME|SPECIAL_ASSESSMENT|PUBLIC_TRUSTEE|FORECLOSURE|RELEASE|RECORDER|GIS|PLANNING|ZONING|PERMITS|RECORDS|ASSESSOR_VALUE_AUTHORITY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Larimer Treasurer Registry MVV must not conflate Treasurer identity with adjacent domains.');
assert.doesNotMatch(larimerTreasurerText, /EXP-|SRA-|provider aggregate|wildcard County Treasurer/i);
assert.equal(read('lib/sourceQualityOperationalManifestData.ts').includes('LARIMER_COUNTY_TREASURER_SOURCE_ID'), true, 'Larimer Treasurer must remain Manifest-included after Manifest inclusion authorization.');

const broomfieldTreasurerSourceId = BROOMFIELD_COUNTY_TREASURER_SOURCE_ID;
assert.equal(registry.records.filter((item) => item.sourceId === broomfieldTreasurerSourceId).length, 1, 'Broomfield Treasurer source must exist exactly once.');
assert.equal(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.filter((item) => item.sourceId === broomfieldTreasurerSourceId).length, 1, 'Broomfield Treasurer finite definition must exist exactly once.');
assert.equal(isCountyTreasurerExactSourceId(broomfieldTreasurerSourceId), true, 'Broomfield Treasurer must be accepted only after exact finite definition.');
const broomfieldTreasurerDefinition = COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.find((item) => item.sourceId === broomfieldTreasurerSourceId);
const broomfieldTreasurer = record(broomfieldTreasurerSourceId);
const broomfieldTreasurerText = JSON.stringify(broomfieldTreasurer);
assert.equal(broomfieldTreasurerDefinition?.sourceClass, 'COUNTY_TREASURER');
assert.equal(broomfieldTreasurerDefinition?.jurisdiction.state, 'Colorado');
assert.equal(broomfieldTreasurerDefinition?.jurisdiction.county, 'City and County of Broomfield');
assert.equal(broomfieldTreasurerDefinition?.responsibleOrganization, 'City and County of Broomfield — Treasurer Department');
assert.equal(broomfieldTreasurer.publicName, 'Broomfield Treasurer');
assert.equal(broomfieldTreasurer.responsibleOrganization, 'City and County of Broomfield — Treasurer Department');
assert.equal(broomfieldTreasurer.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(broomfieldTreasurer.category, 'COUNTY_TREASURER_TAX');
assert.equal(broomfieldTreasurer.jurisdiction.state, 'Colorado');
assert.equal(broomfieldTreasurer.jurisdiction.county, 'City and County of Broomfield');
assert.equal(broomfieldTreasurer.jurisdiction.municipality, 'Broomfield');
assert.equal(broomfieldTreasurer.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(broomfieldTreasurer.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(broomfieldTreasurer.claimEligible, false);
assert.equal(broomfieldTreasurer.customerStatus, 'Blocked / not authorized');
assert.match(broomfieldTreasurer.currentReieUse, /Exact source identity only/);
assert.match(broomfieldTreasurer.currentReieUse, /future-governed Broomfield Treasurer review/);
assert.match(broomfieldTreasurer.currentReieUse, /no Online Treasurer Portal automation/);
assert.match(broomfieldTreasurer.currentReieUse, /no property or tax search/);
assert.match(broomfieldTreasurer.currentReieUse, /no payment/);
assert.match(broomfieldTreasurer.currentReieUse, /no Certificate of Taxes Due/);
assert.match(broomfieldTreasurer.currentReieUse, /no payment-provider use/);
assert.match(broomfieldTreasurer.currentReieUse, /no Finance Director investment or reconciliation use/);
assert.match(broomfieldTreasurer.currentReieUse, /no Revenue Manager separate-source treatment/);
assert.match(broomfieldTreasurer.currentReieUse, /no Assessor use/);
assert.match(broomfieldTreasurer.currentReieUse, /no Clerk and Recorder use/);
assert.match(broomfieldTreasurer.currentReieUse, /no GIS use/);
assert.match(broomfieldTreasurer.currentReieUse, /no Public Trustee use/);
assert.match(broomfieldTreasurer.currentReieUse, /no .* customer display/);
assert.match(broomfieldTreasurerText, /TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY/);
assert.match(broomfieldTreasurerText, /TREASURER_RECORD_NOT_TITLE/);
assert.match(broomfieldTreasurerText, /TREASURER_RECORD_NOT_RECORDER_INDEX/);
assert.match(broomfieldTreasurerText, /TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY/);
assert.match(broomfieldTreasurerText, /PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY/);
assert.match(broomfieldTreasurerText, /PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY/);
assert.match(broomfieldTreasurerText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(broomfieldTreasurerText, /PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY/);
assert.match(broomfieldTreasurerText, /TAX_CURRENTNESS_SOURCE_SPECIFIC/);
assert.match(broomfieldTreasurerText, /FEE_STATUS_SOURCE_SPECIFIC/);
assert.match(broomfieldTreasurerText, /CERTIFICATE_OF_TAXES_DUE_NOT_TITLE_OR_LIEN_CLEARANCE_GUARANTEE/);
assert.match(broomfieldTreasurerText, /BROOMFIELD_PAYMENT_PROVIDER_FEES_SOURCE_SPECIFIC/);
assert.match(broomfieldTreasurerText, /BROOMFIELD_ONLINE_TREASURER_PORTAL_NOT_AUTOMATION_AUTHORITY/);
assert.match(broomfieldTreasurerText, /EQUAPAY_NOT_COUNTY_TAX_RECORD_AUTHORITY/);
assert.match(broomfieldTreasurerText, /FINANCE_DIRECTOR_INVESTMENT_RECONCILIATION_NOT_TREASURER_TAX_RECORD_AUTHORITY/);
assert.match(broomfieldTreasurerText, /REVENUE_MANAGER_ROLE_NOT_SEPARATE_SOURCE_IDENTITY/);
assert.match(broomfieldTreasurerText, /CONSOLIDATED_CITY_COUNTY_NOT_AGGREGATE_SOURCE_AUTHORITY/);
assert.match(broomfieldTreasurerText, /SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(broomfieldTreasurerText, /CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV/);
assert.match(broomfieldTreasurerText, /LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV/);
assert.match(broomfieldTreasurerText, /consolidated City and County of Broomfield structure does not create an aggregate Broomfield government source/);
assert.match(broomfieldTreasurerText, /Finance Director investment\/reconciliation role is not Treasurer tax-record authority/);
assert.match(broomfieldTreasurerText, /Revenue Manager role is an internal organizational function rather than a separate source identity/);
assert.match(broomfieldTreasurerText, /Broomfield Online Treasurer Portal, tax search, payment, Certificate of Taxes Due, payment-provider, Finance Director investment and reconciliation, Revenue Manager, Assessor, Clerk and Recorder, GIS, Public Trustee/);
assert.match(broomfieldTreasurerText, /Boulder County Treasurer, Arapahoe County Treasurer, Adams County Treasurer, Jefferson County Treasurer, Larimer County Treasurer, Weld County Treasurer, Broomfield Assessor/);
assert.match(broomfieldTreasurerText, /Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown/);
assert.doesNotMatch(broomfieldTreasurerText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(broomfieldTreasurerText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => item.sourceId !== 'SRC-BROOMFIELD-COUNTY-ASSESSOR' && /^SRC-BROOMFIELD-(TAX-PAYMENT|TAX-SEARCH|ONLINE-TREASURER-PORTAL|CERTIFICATE|PAYMENT-PROVIDER|EQUAPAY|FINANCE-DIRECTOR|REVENUE-MANAGER|PUBLIC-TRUSTEE|COUNTY-RECORDER|GIS|GOVERNMENT)/.test(item.sourceId)).length, 0, 'Broomfield Treasurer Registry MVV must not add payment, search, portal, certificate, payment-provider, Finance Director, Revenue Manager, Public Trustee, Recorder, GIS, or aggregate government source ids.');
assert.equal(registry.records.filter((item) => item.sourceId !== 'SRC-BROOMFIELD-COUNTY-ASSESSOR' && item.sourceId !== broomfieldTreasurerSourceId && /BROOMFIELD.*(TAX_PAYMENT|TAX_SEARCH|ONLINE_TREASURER_PORTAL|CERTIFICATE|PAYMENT_PROVIDER|EQUAPAY|FINANCE_DIRECTOR|REVENUE_MANAGER|PUBLIC_TRUSTEE|RECORDER|GIS|GOVERNMENT|AGGREGATE|ASSESSOR_VALUE_AUTHORITY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Broomfield Treasurer Registry MVV must not conflate Treasurer identity with adjacent domains.');
assert.doesNotMatch(broomfieldTreasurerText, /EXP-|SRA-|provider aggregate|wildcard County Treasurer/i);
assert.equal(read('lib/sourceQualityOperationalManifestData.ts').includes('BROOMFIELD_COUNTY_TREASURER_SOURCE_ID'), true, 'Broomfield Treasurer must remain Manifest-included after Manifest inclusion authorization.');

const douglasTreasurerSourceId = DOUGLAS_COUNTY_TREASURER_SOURCE_ID;
assert.equal(registry.records.filter((item) => item.sourceId === douglasTreasurerSourceId).length, 1, 'Douglas County Treasurer source must exist exactly once.');
assert.equal(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.filter((item) => item.sourceId === douglasTreasurerSourceId).length, 1, 'Douglas County Treasurer finite definition must exist exactly once.');
assert.equal(isCountyTreasurerExactSourceId(douglasTreasurerSourceId), true, 'Douglas County Treasurer must be accepted only after exact finite definition.');
const douglasTreasurerDefinition = COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.find((item) => item.sourceId === douglasTreasurerSourceId);
const douglasTreasurer = record(douglasTreasurerSourceId);
const douglasTreasurerText = JSON.stringify(douglasTreasurer);
assert.equal(douglasTreasurerDefinition?.sourceClass, 'COUNTY_TREASURER');
assert.equal(douglasTreasurerDefinition?.jurisdiction.state, 'Colorado');
assert.equal(douglasTreasurerDefinition?.jurisdiction.county, 'Douglas County');
assert.equal(douglasTreasurerDefinition?.responsibleOrganization, "Douglas County Treasurer's Office");
assert.equal(douglasTreasurer.publicName, 'Douglas County Treasurer');
assert.equal(douglasTreasurer.responsibleOrganization, "Douglas County Treasurer's Office");
assert.equal(douglasTreasurer.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(douglasTreasurer.category, 'COUNTY_TREASURER_TAX');
assert.equal(douglasTreasurer.jurisdiction.state, 'Colorado');
assert.equal(douglasTreasurer.jurisdiction.county, 'Douglas County');
assert.equal(douglasTreasurer.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(douglasTreasurer.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(douglasTreasurer.claimEligible, false);
assert.equal(douglasTreasurer.customerStatus, 'Blocked / not authorized');
assert.match(douglasTreasurer.currentReieUse, /Exact source identity only/);
assert.match(douglasTreasurer.currentReieUse, /future-governed Douglas County Treasurer review/);
assert.match(douglasTreasurer.currentReieUse, /no property-tax inquiry or search submission/);
assert.match(douglasTreasurer.currentReieUse, /no tax notice, statement, receipt, or payment-history use/);
assert.match(douglasTreasurer.currentReieUse, /no current or delinquent charge use/);
assert.match(douglasTreasurer.currentReieUse, /no special-assessment use/);
assert.match(douglasTreasurer.currentReieUse, /no payment/);
assert.match(douglasTreasurer.currentReieUse, /no Statement or Certificate of Taxes Due action/);
assert.match(douglasTreasurer.currentReieUse, /no lien or delinquency workflow use/);
assert.match(douglasTreasurer.currentReieUse, /no Public Trustee use/);
assert.match(douglasTreasurer.currentReieUse, /no Assessor parcel-detail use/);
assert.match(douglasTreasurer.currentReieUse, /no Recorder use/);
assert.match(douglasTreasurer.currentReieUse, /no GIS use/);
assert.match(douglasTreasurer.currentReieUse, /no tax-record retrieval/);
assert.match(douglasTreasurer.currentReieUse, /no parcel\/account lookup/);
assert.match(douglasTreasurer.currentReieUse, /no tax-currentness guarantee/);
assert.match(douglasTreasurer.currentReieUse, /no ownership or redemption conclusion/);
assert.match(douglasTreasurer.currentReieUse, /no customer display/);
assert.match(douglasTreasurerText, /TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY/);
assert.match(douglasTreasurerText, /TREASURER_RECORD_NOT_TITLE/);
assert.match(douglasTreasurerText, /TREASURER_RECORD_NOT_RECORDER_INDEX/);
assert.match(douglasTreasurerText, /TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY/);
assert.match(douglasTreasurerText, /PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY/);
assert.match(douglasTreasurerText, /PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY/);
assert.match(douglasTreasurerText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(douglasTreasurerText, /PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY/);
assert.match(douglasTreasurerText, /TAX_CURRENTNESS_SOURCE_SPECIFIC/);
assert.match(douglasTreasurerText, /FEE_STATUS_SOURCE_SPECIFIC/);
assert.match(douglasTreasurerText, /DOUGLAS_TREASURER_BILLED_ONE_YEAR_IN_ARREARS_NOT_CURRENTNESS_GUARANTEE/);
assert.match(douglasTreasurerText, /DOUGLAS_TAX_STATEMENT_RECEIPT_NOT_TITLE_OR_LIEN_CLEARANCE/);
assert.match(douglasTreasurerText, /DOUGLAS_TAX_LIEN_DELINQUENCY_NOT_OWNERSHIP_OR_REDEMPTION_CONCLUSION/);
assert.match(douglasTreasurerText, /DOUGLAS_PAYMENT_VENDOR_NOT_DATA_REUSE_OR_AUTOMATION_AUTHORITY/);
assert.match(douglasTreasurerText, /DOUGLAS_STATEMENT_OR_CERTIFICATE_OF_TAXES_DUE_DISTINCT_GOVERNED_CHANNEL/);
assert.match(douglasTreasurerText, /DOUGLAS_ASSESSOR_PARCEL_DETAIL_SEPARATE_SOURCE_AUTHORITY/);
assert.match(douglasTreasurerText, /SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(douglasTreasurerText, /CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV/);
assert.match(douglasTreasurerText, /LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV/);
assert.match(douglasTreasurerText, /Treasurer billing is one year in arrears/);
assert.match(douglasTreasurerText, /source-specific currentness limitation, not Assessor authority within the Treasurer source/);
assert.match(douglasTreasurerText, /Douglas County property-tax inquiry and search, tax notices, statements, receipts, payment history, current and delinquent charges, special assessments, payments, Statement or Certificate of Taxes Due, lien and delinquency workflows, Public Trustee, Assessor parcel detail, Recorder, GIS, payment vendors, and lien\/deed operational actions are separately governed/);
assert.match(douglasTreasurerText, /Boulder County Treasurer, Arapahoe County Treasurer, Adams County Treasurer, Jefferson County Treasurer, Larimer County Treasurer, Broomfield Treasurer, Weld County Treasurer, Douglas County Assessor/);
assert.match(douglasTreasurerText, /Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown/);
assert.doesNotMatch(douglasTreasurerText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(douglasTreasurerText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => item.sourceId !== douglasTreasurerSourceId && /^SRC-DOUGLAS-COUNTY-(TAX-PAYMENT|TAX-SEARCH|PROPERTY-TAX|TAX-NOTICE|TAX-STATEMENT|TAX-RECEIPT|PAYMENT-HISTORY|CURRENT-CHARGES|DELINQUENT|SPECIAL-ASSESSMENT|STATEMENT|CERTIFICATE|LIEN|PUBLIC-TRUSTEE|ASSESSOR|RECORDER|GIS|PARCEL-GIS)/.test(item.sourceId)).length, 0, 'Douglas Treasurer Registry MVV must not add payment, search, statement, certificate, lien, Public Trustee, Assessor, Recorder, GIS, or Parcel GIS source ids.');
assert.equal(registry.records.filter((item) => item.sourceId !== douglasTreasurerSourceId && /DOUGLAS.*(TAX_PAYMENT|TAX_SEARCH|PROPERTY_TAX|TAX_NOTICE|TAX_STATEMENT|TAX_RECEIPT|PAYMENT_HISTORY|CURRENT_CHARGES|DELINQUENT|SPECIAL_ASSESSMENT|STATEMENT|CERTIFICATE|LIEN|PUBLIC_TRUSTEE|ASSESSOR|RECORDER|GIS|PARCEL_GIS|ASSESSOR_VALUE_AUTHORITY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Douglas Treasurer Registry MVV must not conflate Treasurer identity with adjacent domains.');
assert.doesNotMatch(douglasTreasurerText, /EXP-|SRA-|provider aggregate|wildcard County Treasurer/i);
assert.equal(read('lib/sourceQualityOperationalManifestData.ts').includes('DOUGLAS_COUNTY_TREASURER_SOURCE_ID'), true, 'Douglas Treasurer must be Manifest-included after Manifest inclusion authorization.');

const broomfieldAssessorSourceId = 'SRC-BROOMFIELD-COUNTY-ASSESSOR';
assert.equal(registry.records.filter((item) => item.sourceId === broomfieldAssessorSourceId).length, 1, 'Broomfield Assessor source must exist exactly once.');
const broomfieldAssessor = record(broomfieldAssessorSourceId);
const broomfieldAssessorText = JSON.stringify(broomfieldAssessor);
assert.equal(broomfieldAssessor.publicName, 'Broomfield Assessor Department');
assert.equal(broomfieldAssessor.responsibleOrganization, 'City and County of Broomfield — Assessor Department');
assert.equal(broomfieldAssessor.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(broomfieldAssessor.category, 'COUNTY_ASSESSOR');
assert.equal(broomfieldAssessor.jurisdiction.state, 'Colorado');
assert.equal(broomfieldAssessor.jurisdiction.county, 'City and County of Broomfield');
assert.equal(broomfieldAssessor.jurisdiction.municipality, 'Broomfield');
assert.equal(broomfieldAssessor.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(broomfieldAssessor.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(broomfieldAssessor.claimEligible, false);
assert.equal(broomfieldAssessor.customerStatus, 'Blocked / not authorized');
assert.match(broomfieldAssessor.currentReieUse, /Exact source identity only/);
assert.match(broomfieldAssessor.currentReieUse, /future-governed Broomfield Assessor review/);
assert.match(broomfieldAssessor.currentReieUse, /no property search submission/);
assert.match(broomfieldAssessor.currentReieUse, /no .* GIS access/);
assert.match(broomfieldAssessor.currentReieUse, /no .* property-record retrieval/);
assert.match(broomfieldAssessor.currentReieUse, /no .* owner\/address lookup/);
assert.match(broomfieldAssessor.currentReieUse, /no .* parcel\/account lookup/);
assert.match(broomfieldAssessor.currentReieUse, /no .* customer display/);
assert.match(broomfieldAssessorText, /ASSESSOR_RECORD_NOT_TITLE/);
assert.match(broomfieldAssessorText, /ASSESSOR_RECORD_NOT_DEED_VALIDITY/);
assert.match(broomfieldAssessorText, /ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS/);
assert.match(broomfieldAssessorText, /ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE/);
assert.match(broomfieldAssessorText, /ASSESSED_VALUE_NOT_MARKET_VALUE/);
assert.match(broomfieldAssessorText, /PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY/);
assert.match(broomfieldAssessorText, /PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY/);
assert.match(broomfieldAssessorText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(broomfieldAssessorText, /COUNTY_ASSESSOR_NOT_COUNTY_TREASURER/);
assert.match(broomfieldAssessorText, /COUNTY_ASSESSOR_NOT_RECORDER/);
assert.match(broomfieldAssessorText, /COUNTY_ASSESSOR_NOT_PARCEL_GIS/);
assert.match(broomfieldAssessorText, /SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(broomfieldAssessorText, /CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV/);
assert.match(broomfieldAssessorText, /LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV/);
assert.match(broomfieldAssessorText, /consolidated City and County status does not create a Broomfield government aggregate source/);
assert.match(broomfieldAssessorText, /Broomfield GIS, Treasurer\/tax, Clerk and Recorder/);
assert.match(broomfieldAssessorText, /Boulder County and Arapahoe County Assessor findings/);
assert.match(broomfieldAssessorText, /Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown/);
assert.doesNotMatch(broomfieldAssessorText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(broomfieldAssessorText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => item.sourceId !== broomfieldTreasurerSourceId && /^SRC-BROOMFIELD-(GIS|COUNTY-TREASURER|COUNTY-RECORDER|COUNTY-PARCEL|COUNTY-DATA-MART|COUNTY-PARCEL-SEARCH|GOVERNMENT)/.test(item.sourceId)).length, 0, 'Broomfield Assessor Registry MVV must not add GIS, unauthorized Treasurer, Recorder, Parcel Search, Data Mart, or aggregate government source ids.');
assert.equal(registry.records.filter((item) => item.sourceId !== broomfieldTreasurerSourceId && /BROOMFIELD.*(TREASURER|RECORDER|GIS|DATA_MART|PARCEL_SEARCH|PARCEL_GEOMETRY|AGGREGATE)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Broomfield Assessor Registry MVV must not conflate assessor identity with adjacent domains.');
assert.doesNotMatch(broomfieldAssessorText, /EXP-|SRA-|provider aggregate|wildcard County Assessor/i);
if (fs.existsSync('lib/sourceQualityBroomfieldCountyAssessorEvidence.ts')) {
  const broomfieldAssessorEvidence = read('lib/sourceQualityBroomfieldCountyAssessorEvidence.ts');
  assert.match(broomfieldAssessorEvidence, /BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID/, 'Broomfield Assessor evidence must bind through the canonical exact source identity constant.');
  assert.match(broomfieldAssessorEvidence, /CERT-BROOMFIELD-COUNTY-ASSESSOR-SOURCE-QUALITY-EVIDENCE-001/, 'Broomfield Assessor evidence must use source-specific certification.');
  assert.match(broomfieldAssessorEvidence, /COUNTY_ASSESSOR/, 'Broomfield Assessor evidence must preserve the canonical County Assessor class.');
  assert.match(broomfieldAssessorEvidence, /CERTIFICATION_REFERENCE/, 'Broomfield Assessor evidence must remain certification-reference-only.');
  assert.doesNotMatch(broomfieldAssessorEvidence, /getReieSourceRegistry|sourceRegistry/, 'Broomfield Assessor evidence must not mutate or depend on Registry implementation state.');
  assert.doesNotMatch(broomfieldAssessorEvidence, /sourceQualityOperationalManifestData|sourceQualityAdminPreviewFixture/, 'Broomfield Assessor evidence must not create Manifest or Admin Preview coupling.');
  assert.doesNotMatch(broomfieldAssessorEvidence, /RIGHTS_VERIFIED|TECHNICAL_ACCESS_READY|FRESHNESS_VERIFIED|PROVENANCE_COMPLETE|ACTIVE_AUTHORIZED/, 'Broomfield Assessor evidence must not upgrade rights, access, freshness, provenance, or activation posture.');
}

const jeffersonAssessorSourceId = 'SRC-JEFFERSON-COUNTY-ASSESSOR';
assert.equal(registry.records.filter((item) => item.sourceId === jeffersonAssessorSourceId).length, 1, 'Jefferson County Assessor source must exist exactly once.');
const jeffersonAssessor = record(jeffersonAssessorSourceId);
const jeffersonAssessorText = JSON.stringify(jeffersonAssessor);
assert.equal(jeffersonAssessor.publicName, 'Jefferson County Assessor');
assert.equal(jeffersonAssessor.responsibleOrganization, "Jefferson County Assessor's Office");
assert.equal(jeffersonAssessor.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(jeffersonAssessor.category, 'COUNTY_ASSESSOR');
assert.equal(jeffersonAssessor.jurisdiction.state, 'Colorado');
assert.equal(jeffersonAssessor.jurisdiction.county, 'Jefferson County');
assert.equal(jeffersonAssessor.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(jeffersonAssessor.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(jeffersonAssessor.claimEligible, false);
assert.equal(jeffersonAssessor.customerStatus, 'Blocked / not authorized');
assert.match(jeffersonAssessor.currentReieUse, /Exact source identity only/);
assert.match(jeffersonAssessor.currentReieUse, /future-governed Jefferson County Assessor review/);
assert.match(jeffersonAssessor.currentReieUse, /no property search submission/);
assert.match(jeffersonAssessor.currentReieUse, /no .* ASPIN or GIS access/);
assert.match(jeffersonAssessor.currentReieUse, /no .* property-record retrieval/);
assert.match(jeffersonAssessor.currentReieUse, /no .* owner\/address lookup/);
assert.match(jeffersonAssessor.currentReieUse, /no .* parcel\/account lookup/);
assert.match(jeffersonAssessor.currentReieUse, /no .* customer display/);
assert.match(jeffersonAssessorText, /ASSESSOR_RECORD_NOT_TITLE/);
assert.match(jeffersonAssessorText, /ASSESSOR_RECORD_NOT_DEED_VALIDITY/);
assert.match(jeffersonAssessorText, /ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS/);
assert.match(jeffersonAssessorText, /ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE/);
assert.match(jeffersonAssessorText, /ASSESSED_VALUE_NOT_MARKET_VALUE/);
assert.match(jeffersonAssessorText, /PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY/);
assert.match(jeffersonAssessorText, /PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY/);
assert.match(jeffersonAssessorText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(jeffersonAssessorText, /COUNTY_ASSESSOR_NOT_COUNTY_TREASURER/);
assert.match(jeffersonAssessorText, /COUNTY_ASSESSOR_NOT_RECORDER/);
assert.match(jeffersonAssessorText, /COUNTY_ASSESSOR_NOT_PARCEL_GIS/);
assert.match(jeffersonAssessorText, /SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(jeffersonAssessorText, /CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV/);
assert.match(jeffersonAssessorText, /LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV/);
assert.match(jeffersonAssessorText, /ASPIN, parcel map, interactive maps, and GIS channels are separately governed/);
assert.match(jeffersonAssessorText, /Treasurer property records, tax status, and tax-payment channels remain separate/);
assert.match(jeffersonAssessorText, /Clerk and Recorder records, recorded documents, title, deed validity, and legal-description authority remain separate/);
assert.match(jeffersonAssessorText, /Boulder County, Arapahoe County, and Broomfield Assessor findings/);
assert.match(jeffersonAssessorText, /Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown/);
assert.doesNotMatch(jeffersonAssessorText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(jeffersonAssessorText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => item.sourceId !== jeffersonTreasurerSourceId && /^SRC-JEFFERSON-COUNTY-(TREASURER|RECORDER|PARCEL|GIS|ASPIN|DATA-MART|PARCEL-SEARCH)/.test(item.sourceId)).length, 0, 'Jefferson Assessor Registry MVV must not add unauthorized Treasurer, Recorder, ASPIN, Parcel Search, Data Mart, or GIS source ids.');
assert.equal(registry.records.filter((item) => item.sourceId !== jeffersonTreasurerSourceId && /JEFFERSON.*(TREASURER|RECORDER|ASPIN|GIS|DATA_MART|PARCEL_SEARCH|PARCEL_GEOMETRY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Jefferson Assessor Registry MVV must not conflate assessor identity with adjacent domains.');
assert.doesNotMatch(jeffersonAssessorText, /EXP-|SRA-|provider aggregate|wildcard County Assessor/i);
if (fs.existsSync('lib/sourceQualityJeffersonCountyAssessorEvidence.ts')) {
  const jeffersonAssessorEvidence = read('lib/sourceQualityJeffersonCountyAssessorEvidence.ts');
  assert.match(jeffersonAssessorEvidence, /JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID/, 'Jefferson Assessor evidence must bind through the canonical exact source identity constant.');
  assert.match(jeffersonAssessorEvidence, /CERT-JEFFERSON-COUNTY-ASSESSOR-SOURCE-QUALITY-EVIDENCE-001/, 'Jefferson Assessor evidence must use source-specific certification.');
  assert.match(jeffersonAssessorEvidence, /COUNTY_ASSESSOR/, 'Jefferson Assessor evidence must preserve the canonical County Assessor class.');
  assert.match(jeffersonAssessorEvidence, /CERTIFICATION_REFERENCE/, 'Jefferson Assessor evidence must remain certification-reference-only.');
  assert.doesNotMatch(jeffersonAssessorEvidence, /getReieSourceRegistry|sourceRegistry/, 'Jefferson Assessor evidence must not mutate or depend on Registry implementation state.');
  assert.doesNotMatch(jeffersonAssessorEvidence, /sourceQualityOperationalManifestData|sourceQualityAdminPreviewFixture/, 'Jefferson Assessor evidence must not create Manifest or Admin Preview coupling.');
  assert.doesNotMatch(jeffersonAssessorEvidence, /RIGHTS_VERIFIED|TECHNICAL_ACCESS_READY|FRESHNESS_VERIFIED|PROVENANCE_COMPLETE|ACTIVE_AUTHORIZED/, 'Jefferson Assessor evidence must not upgrade rights, access, freshness, provenance, or activation posture.');
}

const larimerAssessorSourceId = 'SRC-LARIMER-COUNTY-ASSESSOR';
assert.equal(registry.records.filter((item) => item.sourceId === larimerAssessorSourceId).length, 1, 'Larimer County Assessor source must exist exactly once.');
const larimerAssessor = record(larimerAssessorSourceId);
const larimerAssessorText = JSON.stringify(larimerAssessor);
assert.equal(larimerAssessor.publicName, 'Larimer County Assessor');
assert.equal(larimerAssessor.responsibleOrganization, "Larimer County Assessor's Office");
assert.equal(larimerAssessor.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(larimerAssessor.category, 'COUNTY_ASSESSOR');
assert.equal(larimerAssessor.jurisdiction.state, 'Colorado');
assert.equal(larimerAssessor.jurisdiction.county, 'Larimer County');
assert.equal(larimerAssessor.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(larimerAssessor.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(larimerAssessor.claimEligible, false);
assert.equal(larimerAssessor.customerStatus, 'Blocked / not authorized');
assert.match(larimerAssessor.currentReieUse, /Exact source identity only/);
assert.match(larimerAssessor.currentReieUse, /future-governed Larimer County Assessor review/);
assert.match(larimerAssessor.currentReieUse, /no property search submission/);
assert.match(larimerAssessor.currentReieUse, /no .* Public Data Center download or automation/);
assert.match(larimerAssessor.currentReieUse, /no .* GIS or map access/);
assert.match(larimerAssessor.currentReieUse, /no .* property-record retrieval/);
assert.match(larimerAssessor.currentReieUse, /no .* owner\/address lookup/);
assert.match(larimerAssessor.currentReieUse, /no .* parcel\/account lookup/);
assert.match(larimerAssessor.currentReieUse, /no .* customer display/);
assert.match(larimerAssessorText, /ASSESSOR_RECORD_NOT_TITLE/);
assert.match(larimerAssessorText, /ASSESSOR_RECORD_NOT_DEED_VALIDITY/);
assert.match(larimerAssessorText, /ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS/);
assert.match(larimerAssessorText, /ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE/);
assert.match(larimerAssessorText, /ASSESSED_VALUE_NOT_MARKET_VALUE/);
assert.match(larimerAssessorText, /PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY/);
assert.match(larimerAssessorText, /PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY/);
assert.match(larimerAssessorText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(larimerAssessorText, /PUBLIC_DATA_CENTER_NOT_DOWNLOAD_OR_AUTOMATION_AUTHORITY/);
assert.match(larimerAssessorText, /GIS_OR_MAP_CHANNEL_NOT_ASSESSOR_RECORD_AUTHORITY/);
assert.match(larimerAssessorText, /PLANNING_OR_ZONING_NOT_ASSESSOR_RECORD_AUTHORITY/);
assert.match(larimerAssessorText, /PUBLIC_TRUSTEE_NOT_ASSESSOR_RECORD_AUTHORITY/);
assert.match(larimerAssessorText, /COUNTY_ASSESSOR_NOT_COUNTY_TREASURER/);
assert.match(larimerAssessorText, /COUNTY_ASSESSOR_NOT_RECORDER/);
assert.match(larimerAssessorText, /COUNTY_ASSESSOR_NOT_PARCEL_GIS/);
assert.match(larimerAssessorText, /SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(larimerAssessorText, /CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV/);
assert.match(larimerAssessorText, /LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV/);
assert.match(larimerAssessorText, /Public Data Center, public search, download, GIS, map, planning, zoning, Public Trustee, Treasurer, and Recorder channels are separately governed/);
assert.match(larimerAssessorText, /Boulder County, Arapahoe County, Broomfield, and Jefferson County Assessor findings/);
assert.match(larimerAssessorText, /Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown/);
assert.doesNotMatch(larimerAssessorText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(larimerAssessorText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => item.sourceId !== larimerTreasurerSourceId && /^SRC-LARIMER-COUNTY-(TREASURER|RECORDER|PARCEL|GIS|PUBLIC-DATA-CENTER|PLANNING|ZONING|PUBLIC-TRUSTEE|PARCEL-SEARCH)/.test(item.sourceId)).length, 0, 'Larimer Assessor Registry MVV must not add unauthorized Treasurer, Recorder, Public Data Center, Public Trustee, Planning, Zoning, Parcel Search, or GIS source ids.');
assert.equal(registry.records.filter((item) => item.sourceId !== larimerTreasurerSourceId && /LARIMER.*(TREASURER|RECORDER|GIS|PUBLIC_DATA_CENTER|PLANNING|ZONING|PUBLIC_TRUSTEE|PARCEL_SEARCH|PARCEL_GEOMETRY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Larimer Assessor Registry MVV must not conflate assessor identity with adjacent domains.');
assert.doesNotMatch(larimerAssessorText, /EXP-|SRA-|provider aggregate|wildcard County Assessor/i);
if (fs.existsSync('lib/sourceQualityLarimerCountyAssessorEvidence.ts')) {
  const larimerAssessorEvidence = read('lib/sourceQualityLarimerCountyAssessorEvidence.ts');
  assert.match(larimerAssessorEvidence, /LARIMER_COUNTY_ASSESSOR_SOURCE_ID/, 'Larimer Assessor evidence must bind through the canonical exact source identity constant.');
  assert.match(larimerAssessorEvidence, /CERT-LARIMER-COUNTY-ASSESSOR-SOURCE-QUALITY-EVIDENCE-001/, 'Larimer Assessor evidence must use source-specific certification.');
  assert.match(larimerAssessorEvidence, /COUNTY_ASSESSOR/, 'Larimer Assessor evidence must preserve the canonical County Assessor class.');
  assert.match(larimerAssessorEvidence, /CERTIFICATION_REFERENCE/, 'Larimer Assessor evidence must remain certification-reference-only.');
  assert.doesNotMatch(larimerAssessorEvidence, /getReieSourceRegistry|sourceRegistry/, 'Larimer Assessor evidence must not mutate or depend on Registry implementation state.');
  assert.doesNotMatch(larimerAssessorEvidence, /sourceQualityOperationalManifestData|sourceQualityAdminPreviewFixture/, 'Larimer Assessor evidence must not create Manifest or Admin Preview coupling.');
  assert.doesNotMatch(larimerAssessorEvidence, /RIGHTS_VERIFIED|TECHNICAL_ACCESS_READY|FRESHNESS_VERIFIED|PROVENANCE_COMPLETE|ACTIVE_AUTHORIZED/, 'Larimer Assessor evidence must not upgrade rights, access, freshness, provenance, or activation posture.');
}

const weldAssessorSourceId = 'SRC-WELD-COUNTY-ASSESSOR';
assert.equal(registry.records.filter((item) => item.sourceId === weldAssessorSourceId).length, 1, 'Weld County Assessor source must exist exactly once.');
const weldAssessor = record(weldAssessorSourceId);
const weldAssessorText = JSON.stringify(weldAssessor);
assert.equal(weldAssessor.publicName, 'Weld County Assessor');
assert.equal(weldAssessor.responsibleOrganization, "Weld County Assessor's Office");
assert.equal(weldAssessor.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(weldAssessor.category, 'COUNTY_ASSESSOR');
assert.equal(weldAssessor.jurisdiction.state, 'Colorado');
assert.equal(weldAssessor.jurisdiction.county, 'Weld County');
assert.equal(weldAssessor.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(weldAssessor.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(weldAssessor.claimEligible, false);
assert.equal(weldAssessor.customerStatus, 'Blocked / not authorized');
assert.match(weldAssessor.currentReieUse, /Exact source identity only/);
assert.match(weldAssessor.currentReieUse, /future-governed Weld County Assessor review/);
assert.match(weldAssessor.currentReieUse, /no property search submission/);
assert.match(weldAssessor.currentReieUse, /no Data Download/);
assert.match(weldAssessor.currentReieUse, /no Property Card Search/);
assert.match(weldAssessor.currentReieUse, /no Property Map Search/);
assert.match(weldAssessor.currentReieUse, /no Property Data Search/);
assert.match(weldAssessor.currentReieUse, /no Sales and Account Data Explorer/);
assert.match(weldAssessor.currentReieUse, /no .* property-record retrieval/);
assert.match(weldAssessor.currentReieUse, /no .* owner\/address lookup/);
assert.match(weldAssessor.currentReieUse, /no .* parcel\/account lookup/);
assert.match(weldAssessor.currentReieUse, /no .* customer display/);
assert.match(weldAssessor.currentReieUse, /historical-only and not current evidence/);
assert.match(weldAssessorText, /ASSESSOR_RECORD_NOT_TITLE/);
assert.match(weldAssessorText, /ASSESSOR_RECORD_NOT_DEED_VALIDITY/);
assert.match(weldAssessorText, /ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS/);
assert.match(weldAssessorText, /ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE/);
assert.match(weldAssessorText, /ASSESSED_VALUE_NOT_MARKET_VALUE/);
assert.match(weldAssessorText, /PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY/);
assert.match(weldAssessorText, /PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY/);
assert.match(weldAssessorText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(weldAssessorText, /DATA_DOWNLOAD_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(weldAssessorText, /PROPERTY_CARD_HISTORY_NOT_CURRENT_EVIDENCE/);
assert.match(weldAssessorText, /PROPERTY_MAP_NOT_PARCEL_OR_TITLE_AUTHORITY/);
assert.match(weldAssessorText, /PROPERTY_DATA_CHANNEL_NOT_UNRESTRICTED_OR_REUSE_READY/);
assert.match(weldAssessorText, /SALES_DATA_NOT_MARKET_VALUE_OR_APPRAISAL/);
assert.match(weldAssessorText, /COUNTY_ASSESSOR_NOT_PERMITS_OR_RECORDS/);
assert.match(weldAssessorText, /COUNTY_ASSESSOR_NOT_COUNTY_TREASURER/);
assert.match(weldAssessorText, /COUNTY_ASSESSOR_NOT_RECORDER/);
assert.match(weldAssessorText, /COUNTY_ASSESSOR_NOT_PARCEL_GIS/);
assert.match(weldAssessorText, /SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV/);
assert.match(weldAssessorText, /CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV/);
assert.match(weldAssessorText, /LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV/);
assert.match(weldAssessorText, /Data Download, Property Card Search, Property Map Search, Property Data Search, Sales and Account Data Explorer, Treasurer, Recorder, permits\/records, GIS, and third-party aggregate channels are separately governed/);
assert.match(weldAssessorText, /Property Card Search is historical-only and has not been updated since 2002/);
assert.match(weldAssessorText, /Boulder County, Arapahoe County, Broomfield, Jefferson County, and Larimer County Assessor findings/);
assert.match(weldAssessorText, /Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown/);
assert.doesNotMatch(weldAssessorText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(weldAssessorText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => item.sourceId !== weldTreasurerSourceId && /^SRC-WELD-COUNTY-(DATA-DOWNLOAD|PROPERTY-CARD|PROPERTY-MAP|PROPERTY-DATA|SALES|TREASURER|RECORDER|PARCEL|GIS|PERMITS|RECORDS)/.test(item.sourceId)).length, 0, 'Weld Assessor Registry MVV must not add Data Download, Property Card, Property Map, Property Data, unauthorized Treasurer, Recorder, permits, records, Parcel, or GIS source ids.');
assert.equal(registry.records.filter((item) => item.sourceId !== weldTreasurerSourceId && /WELD.*(DATA_DOWNLOAD|PROPERTY_CARD|PROPERTY_MAP|PROPERTY_DATA|SALES|TREASURER|RECORDER|PERMITS|RECORDS|GIS|PARCEL_SEARCH|PARCEL_GEOMETRY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Weld Assessor Registry MVV must not conflate assessor identity with adjacent domains.');
assert.doesNotMatch(weldAssessorText, /EXP-|SRA-|provider aggregate|wildcard County Assessor/i);
if (fs.existsSync('lib/sourceQualityWeldCountyAssessorEvidence.ts')) {
  const weldAssessorEvidence = read('lib/sourceQualityWeldCountyAssessorEvidence.ts');
  assert.match(weldAssessorEvidence, /WELD_COUNTY_ASSESSOR_SOURCE_ID/, 'Weld Assessor evidence must bind through the canonical exact source identity constant.');
  assert.match(weldAssessorEvidence, /CERT-WELD-COUNTY-ASSESSOR-SOURCE-QUALITY-EVIDENCE-001/, 'Weld Assessor evidence must use source-specific certification.');
  assert.match(weldAssessorEvidence, /COUNTY_ASSESSOR/, 'Weld Assessor evidence must preserve the canonical County Assessor class.');
  assert.match(weldAssessorEvidence, /CERTIFICATION_REFERENCE/, 'Weld Assessor evidence must remain certification-reference-only.');
  assert.doesNotMatch(weldAssessorEvidence, /getReieSourceRegistry|sourceRegistry/, 'Weld Assessor evidence must not mutate or depend on Registry implementation state.');
  assert.doesNotMatch(weldAssessorEvidence, /sourceQualityOperationalManifestData|sourceQualityAdminPreviewFixture/, 'Weld Assessor evidence must not create Manifest or Admin Preview coupling.');
  assert.doesNotMatch(weldAssessorEvidence, /RIGHTS_VERIFIED|TECHNICAL_ACCESS_READY|FRESHNESS_VERIFIED|PROVENANCE_COMPLETE|ACTIVE_AUTHORIZED/, 'Weld Assessor evidence must not upgrade rights, access, freshness, provenance, or activation posture.');
}

const parcelGisSourceId = 'SRC-BOULDER-COUNTY-PARCEL-GIS';
assert.equal(registry.records.filter((item) => item.sourceId === parcelGisSourceId).length, 1, 'Parcel GIS source must exist exactly once.');
const parcelGis = record(parcelGisSourceId);
const parcelGisText = JSON.stringify(parcelGis);
assert.equal(parcelGis.publicName, 'Boulder County GIS Parcel Boundaries / Parcels');
assert.equal(parcelGis.responsibleOrganization, "Boulder County Assessor's Office");
assert.equal(parcelGis.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(parcelGis.category, 'PARCEL_GEOMETRY');
assert.equal(parcelGis.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(parcelGis.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(parcelGis.claimEligible, false);
assert.equal(parcelGis.customerStatus, 'Blocked / not authorized');
assert.match(parcelGis.currentReieUse, /Exact source identity only/);
assert.match(parcelGis.currentReieUse, /future-governed parcel geometry review/);
assert.match(parcelGis.currentReieUse, /no parcel geometry/);
assert.match(parcelGis.currentReieUse, /no .* retrieval/);
assert.match(parcelGis.currentReieUse, /no .* feature-service call/);
assert.match(parcelGis.currentReieUse, /no .* download/);
assert.match(parcelGis.currentReieUse, /no .* customer display/);
assert.match(parcelGisText, /PARCEL_GEOMETRY_NOT_OWNERSHIP/);
assert.match(parcelGisText, /PARCEL_GEOMETRY_NOT_LEGAL_DESCRIPTION/);
assert.match(parcelGisText, /PARCEL_GEOMETRY_NOT_ASSESSOR_RECORD/);
assert.match(parcelGisText, /PARCEL_GEOMETRY_NOT_TITLE/);
assert.match(parcelGisText, /GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY/);
assert.match(parcelGisText, /OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY/);
assert.match(parcelGisText, /PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE/);
assert.match(parcelGisText, /Address Points cannot confirm parcel identity/);
assert.match(parcelGisText, /Park Boundaries cannot establish parcel or property facts/);
assert.match(parcelGisText, /does not grant evidence, rights, freshness, attribution, access, or governance inheritance/);
assert.match(parcelGisText, /Technical access, freshness, attribution, disclaimer, rights, and provenance remain unresolved/);
assert.doesNotMatch(parcelGisText, /ownership truth|owner identity authorized|assessed value|tax status|sales truth|permit truth|zoning truth|legal description authority|title validity/i);
assert.doesNotMatch(parcelGisText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|PROVENANCE = COMPLETE/);
assert.doesNotMatch(parcelGisText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => /^SRC-BOULDER-COUNTY-PARCEL-(?!GIS$)/.test(item.sourceId)).length, 0, 'Unknown speculative Boulder County parcel source ids must reject.');
assert.equal(registry.records.filter((item) => /PARCEL.*(OWNERSHIP|ASSESSOR|TITLE|TAX|PERMIT|ZONING|LEGAL_DESCRIPTION)/i.test(item.sourceId)).length, 0, 'Parcel GIS MVV must not add parcel-derived protected domain sources.');
if (fs.existsSync('lib/sourceQualityBoulderCountyParcelGisEvidence.ts')) {
  const parcelGisEvidence = read('lib/sourceQualityBoulderCountyParcelGisEvidence.ts');
  assert.match(parcelGisEvidence, /BOULDER_COUNTY_PARCEL_GIS_SOURCE_ID/, 'Parcel GIS evidence must bind through the canonical exact source identity constant.');
  assert.match(parcelGisEvidence, /CERT-BOULDER-COUNTY-PARCEL-GIS-SOURCE-QUALITY-EVIDENCE-001/, 'Parcel GIS evidence must use source-specific certification.');
  assert.match(parcelGisEvidence, /COUNTY_GIS_PARCEL_GEOMETRY/, 'Parcel GIS evidence must preserve the canonical GIS class.');
  assert.match(parcelGisEvidence, /CERTIFICATION_REFERENCE/, 'Parcel GIS evidence must remain certification-reference-only.');
  assert.doesNotMatch(parcelGisEvidence, /getReieSourceRegistry|sourceRegistry/, 'Parcel GIS evidence must not mutate or depend on Registry implementation state.');
  assert.doesNotMatch(parcelGisEvidence, /RIGHTS_VERIFIED|TECHNICAL_ACCESS_READY|FRESHNESS_VERIFIED|PROVENANCE_COMPLETE|ACTIVE_AUTHORIZED/, 'Parcel GIS evidence must not upgrade rights, access, freshness, provenance, or activation posture.');
}

const recorderSourceId = 'SRC-BOULDER-COUNTY-RECORDER-INDEX';
assert.equal(registry.records.filter((item) => item.sourceId === recorderSourceId).length, 1, 'Recorder index source must exist exactly once.');
const recorder = record(recorderSourceId);
const recorderText = JSON.stringify(recorder);
assert.equal(recorder.responsibleOrganization, 'Boulder County Clerk and Recorder');
assert.equal(recorder.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(recorder.category, 'RECORDED_DOCUMENT_INDEX');
assert.equal(recorder.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(recorder.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(recorder.claimEligible, false);
assert.equal(recorder.customerDisclosureEligible, true);
assert.match(recorder.currentReieUse, /Recorded-document search\/index reference/);
assert.match(recorder.currentReieUse, /verification metadata/);
assert.match(recorder.currentReieUse, /future structured Source Quality evidence/);
assert.match(recorderText, /INDEX_OR_SEARCH_METADATA_NOT_DOCUMENT_CONTENT/);
assert.match(recorderText, /Document images, scanned instruments, OCR, full text, signatures/);
assert.match(recorderText, /legal descriptions extracted from document bodies/);
assert.match(recorderText, /certified-copy fulfillment/);
assert.match(recorderText, /document-content storage/);
assert.match(recorderText, /document-content redistribution/);
assert.match(recorderText, /Rights, technical access, freshness, attribution, fees, privacy approval, and provenance remain unknown/);
assert.match(recorderText, /Public-record or government-source status does not establish unrestricted reuse/);
assert.match(recorderText, /automated extraction/);
assert.match(recorderText, /legal-use approval/);
assert.match(recorderText, /customer display/);
assert.match(recorderText, /EXP-SRC-BOULDER-COUNTY-RECORDER remains discovery-only context/);
assert.match(recorderText, /SRA-BOULDER-COUNTY-RECORDER remains readiness\/risk context only/);
assert.match(recorderText, /grants no SRC authority inheritance/);
assert.match(recorderText, /COUNTY_RECORDED_DOCUMENT_INDEX/);
assert.doesNotMatch(recorderText, /RIGHTS = VERIFIED|TECHNICAL ACCESS = READY|FRESHNESS = VERIFIED|ATTRIBUTION = REQUIRED|FEE = NONE|PROVENANCE = COMPLETE/);
assert.doesNotMatch(recorderText, /memberSourceIds|parentSourceId|aggregateSource|childSourceIds|relationshipType/i);
assert.equal(registry.records.filter((item) => /RECORDER.*(CONTENT|IMAGE|OCR|FULL_TEXT|CERTIFIED_COPY)/i.test(item.sourceId)).length, 0, 'No document-content Recorder source may be added.');

const experimentalSource = read('lib/coloradoCityEvidenceExpansion.ts');
assert.match(experimentalSource, /sourceId:\s*'EXP-SRC-BOULDER-COUNTY-RECORDER'/, 'Experimental Recorder source context must remain present.');
assert.match(experimentalSource, /document reuse, OCR\/full-text use, fees, and public display rights require review/, 'EXP Recorder context must remain non-operational review context.');
assert.doesNotMatch(experimentalSource, /SRC-BOULDER-COUNTY-RECORDER-INDEX/, 'EXP context must not be converted into the exact operational source.');

const sourceRightsReadiness = read('lib/sourceRightsActivationReadiness.ts');
assert.match(sourceRightsReadiness, /sourceId:\s*'SRA-BOULDER-COUNTY-RECORDER'/, 'SRA Recorder readiness context must remain present.');
assert.match(sourceRightsReadiness, /legalEntityOrProvider:\s*'Boulder County Clerk and Recorder'/, 'SRA Recorder context must keep the Clerk and Recorder authority label.');
assert.match(sourceRightsReadiness, /LEGAL_REVIEW_REQUIRED/, 'SRA Recorder context must not become activation authority.');
assert.match(sourceRightsReadiness, /activationCandidate:\s*false/, 'SRA Recorder context must remain non-activation readiness context.');
assert.doesNotMatch(sourceRightsReadiness, /SRC-BOULDER-COUNTY-RECORDER-INDEX/, 'SRA context must not grant exact SRC authority inheritance.');
if (fs.existsSync('lib/sourceQualityBoulderCountyRecorderIndexEvidence.ts')) {
  const recorderEvidence = read('lib/sourceQualityBoulderCountyRecorderIndexEvidence.ts');
  assert.match(recorderEvidence, /SRC-BOULDER-COUNTY-RECORDER-INDEX/, 'Recorder evidence must bind to the canonical exact source identity.');
  assert.doesNotMatch(recorderEvidence, /EXP-SRC-BOULDER-COUNTY-RECORDER|SRA-BOULDER-COUNTY-RECORDER/, 'Recorder evidence must not inherit EXP or SRA authority.');
  assert.doesNotMatch(recorderEvidence, /documentImage|scannedInstrument|ocrText|fullText|signature|documentBody|certifiedCopyContent|rawInstrumentPayload|documentContentRedistribution/, 'Recorder evidence must not imply document-content authority.');
}

const permitSourceIds = [
  'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
  'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL',
  'SRC-BOULDER-COUNTY-ACCELA-PERMITS',
] as const;
assert.equal(registry.records.filter((item) => permitSourceIds.includes(item.sourceId as (typeof permitSourceIds)[number])).length, permitSourceIds.length);
for (const sourceId of permitSourceIds) {
  const permit = record(sourceId);
  assert.equal(permit.sourceClass, 'AUTHORITATIVE_SOURCE');
  assert.equal(permit.category, 'BUILDING_PERMITS');
  assert.equal(permit.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
  assert.equal(permit.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
  assert.equal(permit.claimEligible, false);
  assert.equal(permit.customerDisclosureEligible, true);
  assert.match(permit.currentReieUse, /Verification prompt only/);
  assert.match(permit.currentReieUse, /no .* retrieval/);
  assert.match(permit.currentReieUse, /no .* customer display/);
  assert.ok(permit.limitations.some((limitation) => /rights|access|freshness|attribution|privacy|automation|display/i.test(limitation)));
}
assert.equal(record('SRC-CITY-BOULDER-OPEN-DATA-PERMITS').responsibleOrganization, 'City of Boulder');
assert.equal(record('SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL').responsibleOrganization, 'City of Boulder');
assert.equal(record('SRC-BOULDER-COUNTY-ACCELA-PERMITS').responsibleOrganization, 'Boulder County Community Planning & Permitting / Accela');
assert.match(record('SRC-CITY-BOULDER-OPEN-DATA-PERMITS').limitations.join(' '), /Open-data availability does not establish unrestricted reuse/);
assert.match(record('SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL').limitations.join(' '), /Portal availability does not establish approved automated access/);
assert.match(record('SRC-BOULDER-COUNTY-ACCELA-PERMITS').limitations.join(' '), /Boulder County channel only; no municipal authority inference/);
const permitCandidate = record(BOULDER_PERMIT_CANDIDATES_SOURCE_ID);
assert.match(permitCandidate.currentReieUse, /Source-candidate and verification-prompt context only/);
assert.match(permitCandidate.currentReieUse, /no permit record is retrieved or displayed/);
assert.doesNotMatch(permitCandidate.currentReieUse, /aggregate|member|parent|child/i);
assert.doesNotMatch(JSON.stringify(permitCandidate), /memberSourceIds|parentSourceId|aggregateSource/i);
assert.equal(permitCandidate.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(permitCandidate.category, 'BUILDING_PERMITS');
assert.equal(permitCandidate.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(permitCandidate.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(permitCandidate.claimEligible, false);
assert.equal(permitCandidate.lifecyclePosture, BOULDER_PERMIT_CANDIDATES_LIFECYCLE_POSTURE);
assert.equal(permitCandidate.sourceQualityAdvancementEligibility, BOULDER_PERMIT_CANDIDATES_SOURCE_QUALITY_ADVANCEMENT_ELIGIBILITY);
assert.deepEqual(permitCandidate.supersededOperationalSourceIds, BOULDER_PERMIT_CANDIDATES_SUPERSEDED_OPERATIONAL_SOURCE_IDS);
assert.deepEqual(permitCandidate.nonOperationalFirewalls, BOULDER_PERMIT_CANDIDATES_NON_OPERATIONAL_FIREWALLS);
assert.ok(permitCandidate.limitations.some((limitation) => limitation.includes('Non-operational discovery context only')));
assert.ok(permitCandidate.limitations.some((limitation) => limitation.includes('Operational permit-source review is superseded by the exact independently governed permit channels')));
for (const firewall of [
  'NOT_SOURCE_QUALITY_EVIDENCE_AUTHORITY',
  'NOT_CONVERSION_AUTHORITY',
  'NOT_OPERATIONAL_MANIFEST_SOURCE',
  'NOT_ACTIVATION_AUTHORITY',
  'NOT_AGGREGATE_SOURCE',
  'NOT_PARENT_SOURCE',
  'NOT_MEMBER_SOURCE',
  'NOT_EVIDENCE_INHERITANCE_AUTHORITY',
  'NOT_RIGHTS_ACCESS_FRESHNESS_ATTRIBUTION_OR_PROVENANCE_AUTHORITY',
] as const) {
  assert.ok(permitCandidate.nonOperationalFirewalls?.includes(firewall), `Permit Candidate must preserve ${firewall}.`);
}
for (const sourceId of BOULDER_PERMIT_CANDIDATES_SUPERSEDED_OPERATIONAL_SOURCE_IDS) {
  const exactPermit = record(sourceId);
  assert.equal(exactPermit.sourceClass, 'AUTHORITATIVE_SOURCE');
  assert.equal(exactPermit.category, 'BUILDING_PERMITS');
  assert.equal(exactPermit.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
  assert.equal(exactPermit.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
  assert.equal(exactPermit.claimEligible, false);
  assert.equal(exactPermit.lifecyclePosture, undefined);
  assert.equal(exactPermit.sourceQualityAdvancementEligibility, undefined);
}

for (const sourceId of ['SRC-BCOD-ADDRESS-POINTS', 'SRC-BCOD-PARK-BOUNDARIES']) {
  const bcod = record(sourceId);
  assert.equal(bcod.responsibleOrganization, 'Boulder County Open Data');
  assert.equal(bcod.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
  assert.equal(bcod.claimEligible, false);
  assert.ok(
    bcod.limitations.some((limitation) => limitation.includes('No API use, download, persistence, transformation, geometry, map rendering')),
      `${sourceId} must preserve no-activation BCOD boundaries.`,
  );
}
assert.notEqual(record('SRC-BCOD-ADDRESS-POINTS').category, 'PARCEL_GEOMETRY', 'Address Points must not substitute for Parcel GIS.');
assert.notEqual(record('SRC-BCOD-PARK-BOUNDARIES').category, 'PARCEL_GEOMETRY', 'Park Boundaries must not substitute for Parcel GIS.');

for (const sourceId of ['SRC-REIE-FINANCING-SCENARIO-CALCULATOR', 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE']) {
  const derived = record(sourceId);
  assert.equal(derived.sourceClass, 'REIE_DERIVED_INTELLIGENCE');
  assert.equal(derived.productionActivationState, 'REIE_DERIVED');
  assert.equal(derived.officialUrl, null);
}

for (const [boundary, value] of Object.entries(registry.protectedBoundaries)) {
  assert.equal(value, false, `Protected boundary ${boundary} must remain false.`);
}

assert.ok(
  registry.statewideScalingContract.some((item) => item.includes('A Boulder County source decision does not authorize another county')),
  'Statewide scaling contract must prevent Boulder decisions from authorizing statewide use.',
);

const sourcesPage = read('app/sources/page.tsx');
assert.match(sourcesPage, /Sources & Methodology/, 'Sources page must expose public methodology title.');
assert.match(sourcesPage, /getPublicSourceRegistryRecords/, 'Sources page must use governed registry records.');
assert.match(sourcesPage, /data-testid="sources-registry-records"/, 'Sources page must expose registry record collection handle.');
assert.match(sourcesPage, /data-source-activation-state/, 'Sources page must expose activation state metadata.');
assert.match(sourcesPage, /authorized automated use/, 'Sources page must explain public availability is not automation authorization.');
assert.doesNotMatch(sourcesPage, /process\.env|api key|credential|secret|internal endpoint/i, 'Sources page must not expose private integration details.');

const publicTrustSource = read('lib/publicTrust.ts');
const footer = read('components/Footer.tsx');
const sitemap = read('app/sitemap.ts');
assert.match(publicTrustSource, /href:\s*'\/sources'/, 'Public trust routes must include /sources.');
assert.match(footer, /publicTrustRoutes/, 'Footer must render governed public trust routes.');
assert.match(sitemap, /publicTrustRoutes/, 'Sitemap must include governed public trust routes.');

const grandPlanPage = read('app/grand-plan/page.tsx');
assert.match(grandPlanPage, /data-grand-plan-advancement="SOURCE_REGISTRY_GRAND_PLAN_ADVANCEMENT"/, 'Grand Plan must expose advancement marker.');
assert.match(grandPlanPage, /data-testid="grand-plan-decision-orchestration"/, 'Grand Plan must expose decision orchestration section.');
assert.match(grandPlanPage, /data-testid="grand-plan-certified-continuity"/, 'Grand Plan must expose certified continuity section.');
assert.match(grandPlanPage, /href: '\/sources'/, 'Grand Plan continuity must link Sources & Methodology.');
assert.match(grandPlanPage, /data-grand-plan-hidden-state-transfer="false"/, 'Grand Plan must preserve no hidden state transfer.');
assert.match(grandPlanPage, /data-grand-plan-scoring="false"/, 'Grand Plan must preserve no-scoring boundary.');
assert.match(grandPlanPage, /data-grand-plan-telemetry="false"/, 'Grand Plan must preserve no-telemetry boundary.');
assert.doesNotMatch(grandPlanPage, /localStorage|sessionStorage|navigator\.sendBeacon|data-grand-plan-scoring="true"/, 'Grand Plan must not introduce hidden state or telemetry.');
assert.ok(!fs.existsSync('app/api/grand-plan/route.ts'), 'Grand Plan must not introduce a duplicate API route.');

const packageJson = read('package.json');
const workerConfig = read('tsconfig.worker.json');
const operationalManifestData = read('lib/sourceQualityOperationalManifestData.ts');
assert.match(packageJson, /check:reie-source-registry-grand-plan-advancement/, 'Package scripts must expose the advancement check.');
assert.match(workerConfig, /scripts\/checkReieSourceRegistryGrandPlanAdvancement\.ts/, 'Worker build must include the advancement check.');
assert.match(workerConfig, /lib\/sourceRegistry\.ts/, 'Worker build must include the Source Registry.');
if (operationalManifestData.includes('SRC-BOULDER-COUNTY-PARCEL-GIS')) {
  assert.equal(record(parcelGisSourceId).authorizationState, 'AWAITING_PROVIDER_CONFIRMATION', 'Parcel GIS Manifest inclusion must not change Registry authorization posture.');
  assert.equal(record(parcelGisSourceId).productionActivationState, 'BLOCKED_NOT_AUTHORIZED', 'Parcel GIS Manifest inclusion must not change Registry activation posture.');
  assert.equal(record(parcelGisSourceId).claimEligible, false, 'Parcel GIS Manifest inclusion must not change Registry claim eligibility.');
}
if (operationalManifestData.includes(arapahoeAssessorSourceId)) {
  assert.equal(arapahoeAssessor.sourceClass, 'AUTHORITATIVE_SOURCE', 'Arapahoe Assessor Manifest inclusion must not change Registry source class.');
  assert.equal(arapahoeAssessor.category, 'COUNTY_ASSESSOR', 'Arapahoe Assessor Manifest inclusion must not change Registry category.');
  assert.equal(arapahoeAssessor.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION', 'Arapahoe Assessor Manifest inclusion must not change Registry authorization posture.');
  assert.equal(arapahoeAssessor.productionActivationState, 'BLOCKED_NOT_AUTHORIZED', 'Arapahoe Assessor Manifest inclusion must not change Registry activation posture.');
  assert.equal(arapahoeAssessor.claimEligible, false, 'Arapahoe Assessor Manifest inclusion must not change Registry claim eligibility.');
  assert.match(arapahoeAssessorText, /PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY/, 'Arapahoe Assessor Manifest inclusion must not authorize public-search automation.');
  assert.match(arapahoeAssessorText, /extract\/download channel only/, 'Arapahoe Assessor Manifest inclusion must not authorize Data Mart use.');
  assert.match(arapahoeAssessorText, /GIS channels only/, 'Arapahoe Assessor Manifest inclusion must not authorize GIS access.');
  assert.match(arapahoeAssessor.currentReieUse, /no property search submission/, 'Arapahoe Assessor Manifest inclusion must not authorize property search.');
  assert.match(arapahoeAssessor.currentReieUse, /no .* property-record retrieval/, 'Arapahoe Assessor Manifest inclusion must not authorize retrieval.');
  assert.match(arapahoeAssessor.currentReieUse, /no .* customer display/, 'Arapahoe Assessor Manifest inclusion must not authorize customer display.');
  assert.match(arapahoeAssessorText, /ASSESSOR_RECORD_NOT_TITLE/, 'Arapahoe Assessor Manifest inclusion must preserve title firewall.');
  assert.match(arapahoeAssessorText, /COUNTY_ASSESSOR_NOT_COUNTY_TREASURER/, 'Arapahoe Assessor Manifest inclusion must not conflate Treasurer.');
  assert.match(arapahoeAssessorText, /COUNTY_ASSESSOR_NOT_RECORDER/, 'Arapahoe Assessor Manifest inclusion must not conflate Recorder.');
  assert.match(arapahoeAssessorText, /COUNTY_ASSESSOR_NOT_PARCEL_GIS/, 'Arapahoe Assessor Manifest inclusion must not conflate Parcel GIS.');
}

console.log(
  `[reie-source-registry-grand-plan-advancement] ok: ${registry.records.length} source records, Arapahoe County Assessor and Parcel GIS exact source identities, public /sources methodology, Grand Plan orchestration, certified continuity, statewide source boundaries, and protected no-activation contract verified.`,
);
