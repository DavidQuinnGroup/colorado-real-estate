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

const arapahoeAssessorSourceId = 'SRC-ARAPAHOE-COUNTY-ASSESSOR';
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
assert.equal(registry.records.filter((item) => /^SRC-ARAPAHOE-COUNTY-(TREASURER|RECORDER|PARCEL|GIS|DATA-MART|PARCEL-SEARCH)/.test(item.sourceId)).length, 0, 'Arapahoe Assessor Registry MVV must not add Treasurer, Recorder, Parcel Search, Data Mart, or GIS source ids.');
assert.equal(registry.records.filter((item) => /ARAPAHOE.*(TREASURER|RECORDER|GIS|DATA_MART|PARCEL_SEARCH|PARCEL_GEOMETRY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Arapahoe Assessor Registry MVV must not conflate assessor identity with adjacent domains.');
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
assert.equal(registry.records.filter((item) => /^SRC-BROOMFIELD-(GIS|COUNTY-TREASURER|COUNTY-RECORDER|COUNTY-PARCEL|COUNTY-DATA-MART|COUNTY-PARCEL-SEARCH|GOVERNMENT)/.test(item.sourceId)).length, 0, 'Broomfield Assessor Registry MVV must not add GIS, Treasurer, Recorder, Parcel Search, Data Mart, or aggregate government source ids.');
assert.equal(registry.records.filter((item) => /BROOMFIELD.*(TREASURER|RECORDER|GIS|DATA_MART|PARCEL_SEARCH|PARCEL_GEOMETRY|AGGREGATE)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Broomfield Assessor Registry MVV must not conflate assessor identity with adjacent domains.');
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
assert.equal(registry.records.filter((item) => /^SRC-JEFFERSON-COUNTY-(TREASURER|RECORDER|PARCEL|GIS|ASPIN|DATA-MART|PARCEL-SEARCH)/.test(item.sourceId)).length, 0, 'Jefferson Assessor Registry MVV must not add Treasurer, Recorder, ASPIN, Parcel Search, Data Mart, or GIS source ids.');
assert.equal(registry.records.filter((item) => /JEFFERSON.*(TREASURER|RECORDER|ASPIN|GIS|DATA_MART|PARCEL_SEARCH|PARCEL_GEOMETRY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Jefferson Assessor Registry MVV must not conflate assessor identity with adjacent domains.');
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
assert.equal(registry.records.filter((item) => /^SRC-LARIMER-COUNTY-(TREASURER|RECORDER|PARCEL|GIS|PUBLIC-DATA-CENTER|PLANNING|ZONING|PUBLIC-TRUSTEE|PARCEL-SEARCH)/.test(item.sourceId)).length, 0, 'Larimer Assessor Registry MVV must not add Treasurer, Recorder, Public Data Center, Public Trustee, Planning, Zoning, Parcel Search, or GIS source ids.');
assert.equal(registry.records.filter((item) => /LARIMER.*(TREASURER|RECORDER|GIS|PUBLIC_DATA_CENTER|PLANNING|ZONING|PUBLIC_TRUSTEE|PARCEL_SEARCH|PARCEL_GEOMETRY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Larimer Assessor Registry MVV must not conflate assessor identity with adjacent domains.');
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
assert.equal(registry.records.filter((item) => /^SRC-WELD-COUNTY-(DATA-DOWNLOAD|PROPERTY-CARD|PROPERTY-MAP|PROPERTY-DATA|SALES|TREASURER|RECORDER|PARCEL|GIS|PERMITS|RECORDS)/.test(item.sourceId)).length, 0, 'Weld Assessor Registry MVV must not add Data Download, Property Card, Property Map, Property Data, Sales, Treasurer, Recorder, permits, records, Parcel, or GIS source ids.');
assert.equal(registry.records.filter((item) => /WELD.*(DATA_DOWNLOAD|PROPERTY_CARD|PROPERTY_MAP|PROPERTY_DATA|SALES|TREASURER|RECORDER|PERMITS|RECORDS|GIS|PARCEL_SEARCH|PARCEL_GEOMETRY)/i.test(`${item.sourceId} ${item.category}`)).length, 0, 'Weld Assessor Registry MVV must not conflate assessor identity with adjacent domains.');
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
