import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  MUNICIPAL_PLANNING_CONTEXT_MANIFEST_ELIGIBILITY,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_CERTIFICATION,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_FIREWALL,
  MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES,
  createMunicipalPlanningContextSourceQualityAssemblyRequest,
  normalizeMunicipalPlanningContextSourceQualityEvidence,
  summarizeMunicipalPlanningContextSourceQualityEvidence,
} from '../lib/sourceQualityMunicipalPlanningContextEvidence';
import { normalizeSourceEvidence, type SourceEvidenceLinkageRecord } from '../lib/sourceQualityEvidenceNormalization';
import { assembleSourceQualitySummaries } from '../lib/sourceQualitySummaryAssembly';

const normalized = normalizeMunicipalPlanningContextSourceQualityEvidence();
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID, 'SRC-MUNICIPAL-PLANNING-CONTEXT');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES.length, 1);
assert.ok(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES.every((linkage) => linkage.sourceId === MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID));
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES[0]?.evidenceClass, 'CERTIFICATION');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES[0]?.authoritativeContractType, 'CERTIFICATION_REFERENCE');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES[0]?.relationshipType, 'CERTIFICATION');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES[0]?.posture, 'REFERENCED');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES[0]?.verificationStatus, 'VERIFIED');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES[0]?.linkageProvenance, 'CERTIFICATION_REFERENCE_ONLY');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES[0]?.certificationReference?.certificationId, MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_CERTIFICATION.certificationId);
assert.equal(normalized.result, 'INSUFFICIENT_EVIDENCE');
assert.equal(normalized.source?.sourceId, MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID);
assert.equal(normalized.source?.sourceClass, 'SUPPLEMENTAL_SOURCE');
assert.equal(normalized.activation.declaredPosture, 'REFERENCE_ONLY');
assert.equal(normalized.rights.posture, 'UNKNOWN');
assert.equal(normalized.technicalAccess.posture, 'UNKNOWN');
assert.equal(normalized.freshness.posture, 'UNKNOWN');
assert.equal(normalized.attribution.posture, 'UNKNOWN');
assert.equal(normalized.provenance.posture, 'UNKNOWN');
assert.equal(normalized.certification.posture, 'REFERENCED');
assert.equal(normalizeMunicipalPlanningContextSourceQualityEvidence().normalizationFingerprint, normalized.normalizationFingerprint);
assert.equal(MUNICIPAL_PLANNING_CONTEXT_MANIFEST_ELIGIBILITY, 'READY_WITH_KNOWN_GAPS');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_FIREWALL.registryActivation, 'SOURCE_REGISTRY_ACTIVATION_NOT_SOURCE_QUALITY_CERTIFICATION');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_FIREWALL.sourceActivation, 'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_MANIFEST');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_FIREWALL.customerDisplayAuthority, 'CUSTOMER_DISPLAY_NOT_GRANTED_BY_MANIFEST');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_FIREWALL.legalUse, 'LEGAL_USE_NOT_APPROVED_BY_MANIFEST');
assert.equal(MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_FIREWALL.publicSourceFallacy, 'PUBLIC_OR_MUNICIPAL_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE');

const foreign = normalizeSourceEvidence({
  sourceId: MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID,
  linkages: [{ ...MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES[0]!, sourceId: 'SRC-BOULDER-COUNTY-ASSESSOR' }],
});
assert.equal(foreign.result, 'INVALID_LINKAGE');
assert.ok(foreign.reasons.includes('FOREIGN_LINKAGE_SOURCE_ID'));
const malformed = normalizeSourceEvidence({ sourceId: 'MUNICIPAL', linkages: [] });
assert.equal(malformed.result, 'INVALID_LINKAGE');
const withoutCertification = normalizeSourceEvidence({
  sourceId: MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID,
  linkages: [{ ...MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES[0]!, certificationReference: null }],
});
assert.equal(withoutCertification.result, 'INVALID_LINKAGE');
const wrongRelationship = normalizeSourceEvidence({
  sourceId: MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID,
  linkages: [{ ...MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES[0]!, relationshipType: 'RIGHTS', posture: 'UNKNOWN' } as SourceEvidenceLinkageRecord],
});
assert.equal(wrongRelationship.result, 'INVALID_LINKAGE');
const wrongEvidenceClass = normalizeSourceEvidence({
  sourceId: MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID,
  linkages: [{ ...MUNICIPAL_PLANNING_CONTEXT_SOURCE_QUALITY_LINKAGES[0]!, evidenceClass: 'SOURCE_RIGHTS_READINESS', authoritativeContractType: 'SOURCE_RIGHTS_READINESS_CONTRACT' } as SourceEvidenceLinkageRecord],
});
assert.equal(wrongEvidenceClass.result, 'INVALID_LINKAGE');

const summary = summarizeMunicipalPlanningContextSourceQualityEvidence();
assert.equal(summary.classification, 'INSUFFICIENT_EVIDENCE');
assert.ok(summary.summary);
assert.equal(summary.summary?.normalizedPostures.rights, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.technicalAccess, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.freshness, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.attribution, 'UNKNOWN');
assert.equal(summary.summary?.normalizedPostures.provenance, 'UNKNOWN');
const assembly = assembleSourceQualitySummaries(createMunicipalPlanningContextSourceQualityAssemblyRequest());
assert.notEqual(assembly.classification, 'FAIL_CLOSED');
assert.ok(assembly.assembly);
assert.equal(assembly.assembly?.sourceOrder[0], MUNICIPAL_PLANNING_CONTEXT_SOURCE_ID);
assert.equal(assembly.assembly?.summaries[0]?.classification, 'INSUFFICIENT_EVIDENCE');

const runtime = await readFile(new URL('../lib/sourceQualityMunicipalPlanningContextEvidence.ts', import.meta.url), 'utf8');
for (const forbidden of ['CERT-PREVIEW-FIXTURE', 'FIX-', 'sourceQualityAdminPreviewFixture', 'SRA-MUNICIPAL-PLANNING-RECORDS', 'alias', 'fuzzy', 'municipal document', '@prisma/client', 'PrismaClient', 'process.env', 'fetch(', 'http://', 'https://', 'CRMTask', 'Typesense', 'Search', 'next/', 'queue', 'worker', 'nodemailer', 'resend', 'twilio', 'COLORADO-COUNTY-57-RESPONSE-RECONCILIATION-AND-REMAINING-SEVEN-READINESS']) assert.equal(runtime.includes(forbidden), false, 'Evidence module must not reference ' + forbidden);
console.log('[source-quality-municipal-planning-context-evidence] ok: exact municipal certification-only evidence normalizes and assembles deterministically with known gaps, no authority grant, and no municipal/live-system behavior.');
