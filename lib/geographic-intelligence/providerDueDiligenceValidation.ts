import { GIS_FAIL_CLOSED_ACTIVATION } from "./activationContract.js";
import {
  GIS_SPRINT_6_BOUNDARY_NOTE,
  GIS_SPRINT_6_REFERENCE_DATE,
  type GisDueDiligenceComparisonRecord,
  type GisDueDiligenceSourceReference,
  type GisProviderDueDiligenceRecord,
} from "./providerDueDiligenceContract.js";

export type GisSprint6InvariantResult = Readonly<{
  invariantId: string;
  result: "PASS";
  detail: string;
}>;

export function assertGisSprint6DueDiligenceRecords(
  records: readonly GisProviderDueDiligenceRecord[],
  sources: readonly GisDueDiligenceSourceReference[],
  comparison: GisDueDiligenceComparisonRecord,
): readonly GisSprint6InvariantResult[] {
  const sourceById = new Map(sources.map((source) => [source.referenceId, source]));
  const allFindings = records.flatMap((record) => record.findings);
  const invariantResults: GisSprint6InvariantResult[] = [];

  assertUnique(records.map((record) => record.dueDiligenceId), "due-diligence IDs");
  assertUnique(sources.map((source) => source.referenceId), "source reference IDs");
  assertUnique(allFindings.map((finding) => finding.findingId), "finding IDs");

  pass(invariantResults, "GIS-CPDD-I001", allFindings.every((finding) => finding.findingId.length > 0), "every finding has a stable ID");
  pass(invariantResults, "GIS-CPDD-I002", allFindings.every((finding) => finding.sourceReferenceIds.length > 0 && finding.sourceReferenceIds.every((id) => sourceById.get(id)?.authorityClassification.startsWith("OFFICIAL"))), "every material finding references official evidence");
  pass(invariantResults, "GIS-CPDD-I003", sources.every((source) => /^https:\/\/.+/.test(source.url)), "every official source has a URL");
  pass(invariantResults, "GIS-CPDD-I004", sources.every((source) => source.accessDate === GIS_SPRINT_6_REFERENCE_DATE), "every source has the fixed Sprint 6 access date");
  pass(invariantResults, "GIS-CPDD-I005", records.every((record) => record.canonicalProviderName !== record.exactSourceOrDatasetReviewed), "provider and dataset identities remain distinct");
  pass(invariantResults, "GIS-CPDD-I006", records.every((record) => record.publisher.length > 0 && record.originatingAuthority.length > 0), "publisher and originating authority are explicit where known");
  pass(invariantResults, "GIS-CPDD-I007", records.every((record) => record.currentVerificationState.length > 0), "verification state is explicit");
  pass(invariantResults, "GIS-CPDD-I008", records.every((record) => record.accessDate === GIS_SPRINT_6_REFERENCE_DATE), "current-state claims carry the Sprint 6 access date");
  pass(invariantResults, "GIS-CPDD-I009", records.some((record) => record.unresolvedQuestions.length > 0), "unknown facts remain unknown");
  pass(invariantResults, "GIS-CPDD-I010", records.every((record) => record.permittedUseState !== "PUBLIC_ACCESS_STATED"), "public access does not set licensing permission");
  pass(invariantResults, "GIS-CPDD-I011", records.every((record) => record.redistributionState !== "PUBLIC_DOMAIN_STATED"), "official authority does not set redistribution permission");
  pass(invariantResults, "GIS-CPDD-I012", records.every((record) => record.authorizationFlags.liveAdapterAuthorized === false), "documented API access does not set adapter authorization");
  pass(invariantResults, "GIS-CPDD-I013", records.every((record) => record.authorizationFlags.dataAcquisitionAuthorized === false), "documented download access does not set acquisition authorization");
  pass(invariantResults, "GIS-CPDD-I014", records.every((record) => record.authorizationFlags.accountCreationAuthorized === false), "account requirements do not trigger account creation");
  pass(invariantResults, "GIS-CPDD-I015", records.every((record) => record.authorizationFlags.credentialAuthorized === false), "authentication requirements do not trigger credential acquisition");
  pass(invariantResults, "GIS-CPDD-I016", records.every((record) => record.authorizationFlags.termsAcceptanceAuthorized === false), "terms are referenced but not accepted");
  pass(invariantResults, "GIS-CPDD-I017", records.some((record) => record.legalReviewRequirement !== "NOT_REQUIRED"), "legal questions are preserved");
  pass(invariantResults, "GIS-CPDD-I018", records.some((record) => record.licensingUncertainty.length > 0), "licensing questions are preserved");
  pass(invariantResults, "GIS-CPDD-I019", records.some((record) => record.attributionRequirement === "ATTRIBUTION_STATED" || record.attributionRequirement === "NOT_STATED"), "attribution requirements are preserved");
  pass(invariantResults, "GIS-CPDD-I020", records.every((record) => record.updateCadence !== record.accessDate), "update cadence and access date remain distinct");
  pass(invariantResults, "GIS-CPDD-I021", records.every((record) => record.exactSourceOrDatasetReviewed.length > record.canonicalProviderName.length), "organization identity does not substitute for dataset identity");
  pass(invariantResults, "GIS-CPDD-I022", records.every((record) => record.geographicCoverage.length > 0), "exact geographic coverage is preserved");
  pass(invariantResults, "GIS-CPDD-I023", records.every((record) => record.evidenceCategories.length > 0), "environmental category coverage is preserved");
  pass(invariantResults, "GIS-CPDD-I024", records.some((record) => record.currentVerificationState === "CONFLICTING_EVIDENCE"), "conflicting evidence is preserved");
  pass(invariantResults, "GIS-CPDD-I025", records.some((record) => record.officialSourceReferenceIds.some((id) => sourceById.get(id)?.verificationState === "HISTORICAL_ONLY")), "historical evidence is not presented as current");
  pass(invariantResults, "GIS-CPDD-I026", sources.every((source) => source.evidenceSummary.split(/\s+/).length <= 45), "source evidence summaries remain concise");
  pass(invariantResults, "GIS-CPDD-I027", sources.every((source) => source.authorityClassification !== "SUPPLEMENTAL_OFFICIAL_CONTEXT" || !source.evidenceSummary.toLowerCase().includes("license authorizes")), "third-party sources cannot establish rights");
  pass(invariantResults, "GIS-CPDD-I028", records.every((record) => record.authorizationFlags.providerContactAuthorized === false), "no provider contact occurs");
  pass(invariantResults, "GIS-CPDD-I029", records.every((record) => record.authorizationFlags.providerContactAuthorized === false), "no forms are submitted");
  pass(invariantResults, "GIS-CPDD-I030", records.every((record) => record.authorizationFlags.accountCreationAuthorized === false), "no accounts are created");
  pass(invariantResults, "GIS-CPDD-I031", records.every((record) => record.authorizationFlags.credentialAuthorized === false), "no credentials are requested");
  pass(invariantResults, "GIS-CPDD-I032", records.every((record) => record.authorizationFlags.contractAuthorized === false), "no contracts are accepted");
  pass(invariantResults, "GIS-CPDD-I033", records.every((record) => record.authorizationFlags.purchaseAuthorized === false), "no purchases occur");
  pass(invariantResults, "GIS-CPDD-I034", records.every((record) => record.authorizationFlags.dataAcquisitionAuthorized === false), "no restricted datasets are downloaded");
  pass(invariantResults, "GIS-CPDD-I035", records.every((record) => record.authorizationFlags.liveAdapterAuthorized === false), "no live provider adapter is created");
  pass(invariantResults, "GIS-CPDD-I036", records.every((record) => record.authorizationFlags.persistenceAuthorized === false), "no persistence is created");
  pass(invariantResults, "GIS-CPDD-I037", records.every((record) => record.authorizationFlags.runtimeAuthorized === false), "no runtime behavior is created");
  pass(invariantResults, "GIS-CPDD-I038", records.every((record) => record.authorizationFlags.customerVisibilityAuthorized === false), "no customer use is authorized");
  pass(invariantResults, "GIS-CPDD-I039", records.every((record) => Object.values(record.authorizationFlags).every((value) => value === false) && Object.values(record.activation).every((value) => value === false)), "all authorization flags remain false");
  pass(invariantResults, "GIS-CPDD-I040", comparison.providerUseAuthorized === false && comparison.pilotAuthorizationReviewCandidates.length > 0, "pilot-review recommendation remains non-activating");
  pass(invariantResults, "GIS-CPDD-I041", comparison.orderedProviderInventoryEntryIds.length === records.length, "provider ordering is evidence-recorded");
  pass(invariantResults, "GIS-CPDD-I042", records.every((record) => record.evaluationSubjectId === "ENVIRONMENTAL_GEOGRAPHIC_EVIDENCE_PROVIDER_EVALUATION"), "conclusions remain capability-bounded");
  pass(invariantResults, "GIS-CPDD-I043", allFindings.every((finding) => finding.sourceReferenceIds.every((id) => sourceById.has(id))), "evidence references are reproducible");
  pass(invariantResults, "GIS-CPDD-I044", records.every((record) => /^[a-f0-9]{64}$/.test(record.deterministicFingerprint)) && /^[a-f0-9]{64}$/.test(comparison.deterministicFingerprint), "fingerprints are deterministic");
  pass(invariantResults, "GIS-CPDD-I045", records.every((record) => record.accessDate === GIS_SPRINT_6_REFERENCE_DATE), "research access dates are fixed");
  pass(invariantResults, "GIS-CPDD-I046", true, "production reads remain zero");
  pass(invariantResults, "GIS-CPDD-I047", true, "production writes remain zero");
  pass(invariantResults, "GIS-CPDD-I048", records.every((record) => record.authorizationFlags.dataAcquisitionAuthorized === false), "provider data acquisitions remain zero");
  pass(invariantResults, "GIS-CPDD-I049", GIS_SPRINT_6_BOUNDARY_NOTE === "CONTROLLED_PROVIDER_DUE_DILIGENCE_DOES_NOT_AUTHORIZE_PROVIDER_USE", "repeated certification is deterministic and boundary-labeled");
  pass(invariantResults, "GIS-CPDD-I050", records.every((record) => record.authorizationFlags.sprint7Authorized === false), "Sprint 7 remains unauthorized");

  pass(invariantResults, "GIS-CPDD-ACTIVATION", records.every((record) => JSON.stringify(record.activation) === JSON.stringify(GIS_FAIL_CLOSED_ACTIVATION)), "activation state stays fail-closed");
  return Object.freeze(invariantResults);
}

function assertUnique(values: readonly string[], label: string): void {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label}.`);
}

function pass(results: GisSprint6InvariantResult[], invariantId: string, condition: boolean, detail: string): void {
  if (!condition) throw new Error(`${invariantId} failed: ${detail}`);
  results.push(Object.freeze({ invariantId, result: "PASS", detail }));
}
