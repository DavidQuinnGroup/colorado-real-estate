import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  BOULDER_COUNTY_ACCELA_PERMITS_MANIFEST_ELIGIBILITY,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CERTIFICATION,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT,
  BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_FIREWALL,
  convertBoulderCountyAccelaPermitsSourceQualityEvidence,
  createBoulderCountyAccelaPermitsSourceQualityAssemblyRequest,
  normalizeBoulderCountyAccelaPermitsSourceQualityEvidence,
  summarizeBoulderCountyAccelaPermitsSourceQualityEvidence,
} from '../lib/sourceQualityBoulderCountyAccelaPermitsEvidence';
import {
  convertCountyStructuredEvidence,
  createCountySourceQualityEvidenceConversionFingerprint,
} from '../lib/sourceQualityCountyEvidenceConversionContract';
import {
  SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_SCHEMA_VERSION,
  convertPublicRecordStructuredEvidence,
} from '../lib/sourceQualityPublicRecordEvidenceConversionContract';
import { getReieSourceRegistry } from '../lib/sourceRegistry';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const conversion = convertBoulderCountyAccelaPermitsSourceQualityEvidence();
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID, 'SRC-BOULDER-COUNTY-ACCELA-PERMITS');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceId, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID);
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceClass, 'COUNTY_PERMIT');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.sourceId, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID);
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.sourceConfirmation?.confirmationClass, 'EXACT_SOURCE_ID_CONFIRMED');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.fieldSensitivityPosture, 'RESTRICTED_OR_UNREVIEWED');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.reviewedAt, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT);
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.certificationReference?.certificationId, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences.length, 1);
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.inputClass, 'CERTIFICATION_REFERENCE');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]?.sourceId, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID);

assert.equal(conversion.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.equal(conversion.sourceId, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID);
assert.equal(conversion.linkages.length, 1);
assert.equal(conversion.linkages[0]?.sourceId, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID);
assert.equal(conversion.linkages[0]?.relationshipType, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(conversion.linkages[0]?.posture, 'REFERENCED');
assert.equal(conversion.inputFingerprint, createCountySourceQualityEvidenceConversionFingerprint(BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST));
assert.equal(convertBoulderCountyAccelaPermitsSourceQualityEvidence().inputFingerprint, conversion.inputFingerprint);
assert.equal(convertBoulderCountyAccelaPermitsSourceQualityEvidence().conversionFingerprint, conversion.conversionFingerprint);

const publicRecord = convertPublicRecordStructuredEvidence({
  ...BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
  schemaVersion: SOURCE_QUALITY_PUBLIC_RECORD_EVIDENCE_CONVERSION_SCHEMA_VERSION,
});
assert.equal(publicRecord.classification, 'PUBLIC_RECORD_EVIDENCE_CONVERSION_VALID');
assert.equal(publicRecord.sourceId, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID);

const candidate = convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
  sourceId: 'SRC-BOULDER-PERMIT-CANDIDATES',
  sourceConfirmation: { sourceId: 'SRC-BOULDER-PERMIT-CANDIDATES', confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
  evidenceReferences: [{ ...BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId: 'SRC-BOULDER-PERMIT-CANDIDATES' }],
});
assert.equal(candidate.classification, 'COUNTY_NON_OPERATIONAL_CANDIDATE_REJECTED');

for (const sourceId of [
  'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
  'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL',
  'SRC-BOULDER-COUNTY-ASSESSOR',
  'SRC-BOULDER-COUNTY-TREASURER',
  'SRC-ANOTHER-COUNTY-ACCELA-PERMITS',
  'SRC-UNKNOWN-COUNTY-SOURCE',
]) {
  const result = convertCountyStructuredEvidence({
    ...BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
    sourceId,
    sourceConfirmation: { sourceId, confirmationClass: 'EXACT_SOURCE_ID_CONFIRMED', reviewedAt: BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_EVIDENCE_REVIEWED_AT },
    evidenceReferences: [{ ...BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, sourceId }],
  });
  assert.notEqual(result.classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
}

assert.equal(convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
  sourceConfirmation: undefined,
}).classification, 'COUNTY_SOURCE_CONFIRMATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
  certificationReference: undefined,
}).classification, 'COUNTY_CERTIFICATION_REQUIRED');
assert.equal(convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
  reviewedAt: '',
}).classification, 'COUNTY_EVIDENCE_REFERENCE_INVALID');
assert.equal(convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
  narrative: 'not composable',
}).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
assert.equal(convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
  evidenceReferences: [{ ...BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST.evidenceReferences[0]!, permitNumber: 'not allowed' }],
}).classification, 'COUNTY_NARRATIVE_INPUT_REJECTED');
assert.equal(convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
  fieldSensitivityPosture: 'PROPERTY_RECORD_CONTEXT',
}).classification, 'COUNTY_EVIDENCE_CONVERSION_VALID');
assert.notEqual(convertCountyStructuredEvidence({
  ...BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_QUALITY_CONVERSION_REQUEST,
  fieldSensitivityPosture: 'PROPERTY_RECORD_CONTEXT',
}).conversionFingerprint, conversion.conversionFingerprint);

const normalized = normalizeBoulderCountyAccelaPermitsSourceQualityEvidence();
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID);
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeBoulderCountyAccelaPermitsSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);

const summary = summarizeBoulderCountyAccelaPermitsSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createBoulderCountyAccelaPermitsSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
if (assembly.classification === 'FAIL_CLOSED') throw new Error('Accela assembly must accept converted certification evidence.');
assert.equal(assembly.assembly.sourceCount, 1);
assert.equal(assembly.assembly.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');
assert.equal(BOULDER_COUNTY_ACCELA_PERMITS_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');

const registryRecord = getReieSourceRegistry().records.find((record) => record.sourceId === BOULDER_COUNTY_ACCELA_PERMITS_SOURCE_ID);
assert.ok(registryRecord);
assert.equal(registryRecord?.responsibleOrganization, 'Boulder County Community Planning & Permitting / Accela');
assert.equal(registryRecord?.sourceClass, 'AUTHORITATIVE_SOURCE');
assert.equal(registryRecord?.category, 'BUILDING_PERMITS');
assert.equal(registryRecord?.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(registryRecord?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED');
assert.equal(registryRecord?.claimEligible, false);

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

const runtime = await readFile(new URL('../lib/sourceQualityBoulderCountyAccelaPermitsEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of [
  'sourceRightsActivationReadiness',
  'SRC-BOULDER-PERMIT-CANDIDATES',
  'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
  'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL',
  '@prisma/client',
  'PrismaClient',
  'process.env',
  'fetch(',
  'http://',
  'https://',
  'CRMTask',
  'Typesense',
  'Search',
  'next/',
  'queue',
  'worker',
  'nodemailer',
  'resend',
  'twilio',
  'sourceQualityOperationalManifestData',
  'sourceQualityAdminPreviewFixture',
  'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS',
]) assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);

console.log('[source-quality-boulder-county-accela-permits-evidence] ok: exact Accela permits certification-only metadata reuses canonical County/Public Record conversion with restricted sensitivity, known gaps, no candidate/city inheritance, no raw permit data, and no authority grant.');
