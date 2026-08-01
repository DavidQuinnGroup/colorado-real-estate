import {
  EVIDENCE_DEPTH_FOUNDATION_STATUS,
  EVIDENCE_DEPTH_FOUNDATION_VERSION,
  type EvidenceDepthConflictStatus,
  type EvidenceDepthFreshnessStatus,
  type EvidenceDepthLimitationCategory,
  type EvidenceDepthRightsStatus,
  type EvidenceDepthSupportLevel,
  type EvidenceDepthSupersessionStatus,
} from "../evidence-depth/evidencePosture.js";
import {
  ADVISORY_OPERATING_READINESS_STANDARD,
  type AdvisoryProfessionalEscalationCategory,
} from "../advisory-operating/advisoryOperatingReadiness.js";
import { PROPERTY_SELLER_EVIDENCE_FIXTURES } from "./propertySellerEvidenceReadinessFixtures.js";

export const PROPERTY_SELLER_EVIDENCE_READINESS = "PROPERTY_SELLER_EVIDENCE_READINESS";
export const PROPERTY_SELLER_EVIDENCE_READINESS_STATUS = "PROPERTY_SELLER_EVIDENCE_READINESS_INTERNAL_READY";
export const PROPERTY_SELLER_EVIDENCE_READINESS_VERSION = "1.0.0";

export type PropertySellerEvidenceCategory =
  | "CANONICAL_PROPERTY_IDENTITY"
  | "OWNERSHIP_AND_TITLE_DOCUMENTATION_QUESTIONS"
  | "IMPROVEMENTS_AND_RENOVATION_RECORDS"
  | "PERMITS_AND_MUNICIPAL_RECORDS"
  | "MAINTENANCE_AND_REPAIR_DOCUMENTATION"
  | "WARRANTIES_AND_SERVICE_RECORDS"
  | "SELLER_DISCLOSURES"
  | "INSPECTION_AND_SPECIALIST_REPORTS"
  | "STRUCTURAL_REVIEW_MATERIALS"
  | "ENVIRONMENTAL_REVIEW_MATERIALS"
  | "INSURANCE_QUESTIONS_AND_RECORDS"
  | "HOA_OR_ASSOCIATION_MATERIALS"
  | "SURVEYS_AND_SITE_PLANS"
  | "UTILITIES_AND_SYSTEMS_DOCUMENTATION"
  | "OCCUPANCY_AND_ACCESS_CONSIDERATIONS"
  | "TAX_AND_ASSESSMENT_RECORDS"
  | "MARKET_CONTEXT_MATERIALS"
  | "LISTING_PREPARATION_DOCUMENTS"
  | "UNRESOLVED_INFORMATION"
  | "PROFESSIONAL_VERIFICATION_NEEDS";

export type PropertySellerReadinessDisposition =
  | "DOCUMENTATION_CATEGORY_READY"
  | "DOCUMENTATION_INCOMPLETE"
  | "IDENTITY_UNRESOLVED"
  | "RIGHTS_UNRESOLVED"
  | "FRESHNESS_REVIEW_REQUIRED"
  | "CONFLICT_REVIEW_REQUIRED"
  | "PROFESSIONAL_REVIEW_REQUIRED"
  | "INTERNAL_ONLY"
  | "PUBLIC_USE_BLOCKED"
  | "VALUATION_PROHIBITED"
  | "CONDITION_CONCLUSION_PROHIBITED"
  | "CUSTOMER_DATA_REQUIRED_BUT_UNAUTHORIZED"
  | "PROVIDER_DEPENDENCY_BLOCKED"
  | "FUTURE_INTEGRATION_CANDIDATE"
  | "DEFERRED"
  | "UNRESOLVED";

export type PropertySellerIdentityConfidencePosture =
  | "SYNTHETIC_IDENTITY_ONLY"
  | "REPOSITORY_GOVERNED_REFERENCE"
  | "AMBIGUOUS"
  | "UNRESOLVED";

export type PropertySellerEvidenceFixture = Readonly<{
  fixtureId: string;
  label: string;
  categories: readonly PropertySellerEvidenceCategory[];
  propertyIdentity: Readonly<{
    syntheticPropertyId: string;
    addressPlaceholder: string;
    parcelReferencePlaceholder: string | null;
    municipality: string;
    county: string;
    propertyType: "SINGLE_FAMILY" | "CONDO" | "TOWNHOME" | "MULTI_UNIT" | "LAND" | "UNKNOWN";
    relatedGeographicObjects: readonly string[];
    identityConfidencePosture: PropertySellerIdentityConfidencePosture;
    ambiguity: readonly string[];
    limitations: readonly string[];
  }>;
  evidencePosture: Readonly<{
    sourceRights: EvidenceDepthRightsStatus;
    freshness: EvidenceDepthFreshnessStatus;
    supportLevel: EvidenceDepthSupportLevel;
    conflictStatus: EvidenceDepthConflictStatus;
    supersessionStatus: EvidenceDepthSupersessionStatus;
    limitationCategories: readonly EvidenceDepthLimitationCategory[];
    provenanceComplete: boolean;
    attributionRequired: boolean;
    publicUseEligibility: "INTERNAL_ONLY" | "BLOCKED" | "UNRESOLVED";
  }>;
  dispositions: readonly PropertySellerReadinessDisposition[];
  professionalReviewCategories: readonly AdvisoryProfessionalEscalationCategory[];
  unresolvedQuestions: readonly string[];
  blockedUseWarnings: readonly string[];
  activation: Readonly<{
    propertyLookup: false;
    ownershipLookup: false;
    parcelLookup: false;
    titleLookup: false;
    publicRecordRetrieval: false;
    providerCalls: 0;
    externalAcquisition: false;
    uploads: false;
    documentStorage: false;
    ocrOrDocumentAnalysis: false;
    customerDataAccess: false;
    customerRecordCreated: false;
    sellerProfileCreated: false;
    publicRouteCreated: false;
    publicApiCreated: false;
    persistenceReads: false;
    persistenceWrites: false;
    databaseWrites: false;
    schemaChanged: false;
    productionWrites: false;
    crmWorkflow: false;
    leadScoring: false;
    leadRouting: false;
    tracking: false;
    telemetry: false;
    personalization: false;
    email: false;
    queueJobs: false;
    workers: false;
  }>;
  prohibitedOutputs: Readonly<{
    propertyValue: null;
    listingPrice: null;
    sellerNetProceeds: null;
    repairPriority: null;
    conditionScore: null;
    sellerReadinessScore: null;
    saleProbability: null;
    urgency: null;
    recommendation: null;
    suitability: null;
    marketability: null;
    investmentValue: null;
    appraisalConclusion: null;
    legalConclusion: null;
    titleConclusion: null;
    insuranceConclusion: null;
    permitConclusion: null;
    environmentalConclusion: null;
    structuralConclusion: null;
  }>;
}>;

export type PropertySellerEvidenceReadinessContract = Readonly<{
  contract: typeof PROPERTY_SELLER_EVIDENCE_READINESS;
  status: typeof PROPERTY_SELLER_EVIDENCE_READINESS_STATUS;
  version: typeof PROPERTY_SELLER_EVIDENCE_READINESS_VERSION;
  reusedEvidenceDepthStatus: typeof EVIDENCE_DEPTH_FOUNDATION_STATUS;
  reusedEvidenceDepthVersion: typeof EVIDENCE_DEPTH_FOUNDATION_VERSION;
  reusedAdvisoryOperatingStandard: typeof ADVISORY_OPERATING_READINESS_STANDARD;
  scope: Readonly<{
    internal: true;
    nonPublic: true;
    fixtureBacked: true;
    deterministic: true;
    readOnly: true;
    nonPersistent: true;
    nonPersonalized: true;
    nonEvaluative: true;
    nonRanking: true;
    nonPredictive: true;
    conclusionFree: true;
    failClosed: true;
    privacySafe: true;
    sourceRightsGoverned: true;
    professionalBoundarySafe: true;
  }>;
  fixtures: readonly PropertySellerEvidenceFixture[];
}>;

export type PropertySellerEvidenceReadinessInspection = Readonly<{
  contract: typeof PROPERTY_SELLER_EVIDENCE_READINESS;
  status: typeof PROPERTY_SELLER_EVIDENCE_READINESS_STATUS;
  version: typeof PROPERTY_SELLER_EVIDENCE_READINESS_VERSION;
  reusedEvidenceDepthStatus: typeof EVIDENCE_DEPTH_FOUNDATION_STATUS;
  fixtureCount: number;
  evidenceCategoriesCovered: readonly PropertySellerEvidenceCategory[];
  dispositionCoverage: readonly PropertySellerReadinessDisposition[];
  professionalReviewCategoriesCovered: readonly AdvisoryProfessionalEscalationCategory[];
  incompleteCategoryCount: number;
  rightsFailClosedCount: number;
  freshnessReviewCount: number;
  conflictReviewCount: number;
  provenanceGapCount: number;
  propertyIdentityLimitationCount: number;
  blockedUseWarningCount: number;
  futureIntegrationCandidateCount: number;
  deferredOrUnresolvedCount: number;
  valuationGuardCount: number;
  conditionConclusionGuardCount: number;
  customerDataGuardCount: number;
  providerDependencyGuardCount: number;
  publicNonExposureGuardCount: number;
  summary: PropertySellerInternalPreparationSummary;
  activationAssertions: Readonly<{
    noPropertyLookup: boolean;
    noOwnershipLookup: boolean;
    noPublicRecordRetrieval: boolean;
    noProviderCalls: boolean;
    noUploads: boolean;
    noPersistence: boolean;
    noApiOrPublicRoute: boolean;
    noCustomerData: boolean;
    noCrmWorkflow: boolean;
    noTrackingOrTelemetry: boolean;
    noProductionWrites: boolean;
  }>;
  prohibitedOutputAssertions: Readonly<{
    valuation: false;
    pricing: false;
    sellerNetSheet: false;
    comparableSaleCalculation: false;
    conditionConclusion: false;
    repairScore: false;
    legalTitleInsuranceMunicipalHoaStructuralEnvironmentalConclusion: false;
    sellerReadinessScore: false;
    saleProbability: false;
    recommendation: false;
    ranking: false;
  }>;
  fixtures: readonly PropertySellerEvidenceFixture[];
}>;

export type PropertySellerInternalPreparationSummary = Readonly<{
  evidenceCategoryCount: number;
  availableDocumentCategoryCount: number;
  incompleteCategoryCount: number;
  rightsLimitations: readonly EvidenceDepthRightsStatus[];
  freshnessIssues: readonly EvidenceDepthFreshnessStatus[];
  conflictStatuses: readonly EvidenceDepthConflictStatus[];
  provenanceGapCount: number;
  propertyIdentityLimitations: readonly string[];
  professionalReviewCategories: readonly AdvisoryProfessionalEscalationCategory[];
  blockedUseCategories: readonly PropertySellerEvidenceCategory[];
  unresolvedQuestions: readonly string[];
  futureIntegrationDependencies: readonly PropertySellerReadinessDisposition[];
  propertyValue: null;
  listingPrice: null;
  conditionScore: null;
  repairPriority: null;
  sellerReadinessScore: null;
  saleProbability: null;
  urgency: null;
  recommendation: null;
  suitability: null;
  marketability: null;
  investmentValue: null;
  appraisalConclusion: null;
  legalConclusion: null;
}>;

export const PROPERTY_SELLER_EVIDENCE_READINESS_CONTRACT: PropertySellerEvidenceReadinessContract =
  Object.freeze({
    contract: PROPERTY_SELLER_EVIDENCE_READINESS,
    status: PROPERTY_SELLER_EVIDENCE_READINESS_STATUS,
    version: PROPERTY_SELLER_EVIDENCE_READINESS_VERSION,
    reusedEvidenceDepthStatus: EVIDENCE_DEPTH_FOUNDATION_STATUS,
    reusedEvidenceDepthVersion: EVIDENCE_DEPTH_FOUNDATION_VERSION,
    reusedAdvisoryOperatingStandard: ADVISORY_OPERATING_READINESS_STANDARD,
    scope: Object.freeze({
      internal: true,
      nonPublic: true,
      fixtureBacked: true,
      deterministic: true,
      readOnly: true,
      nonPersistent: true,
      nonPersonalized: true,
      nonEvaluative: true,
      nonRanking: true,
      nonPredictive: true,
      conclusionFree: true,
      failClosed: true,
      privacySafe: true,
      sourceRightsGoverned: true,
      professionalBoundarySafe: true,
    }),
    fixtures: PROPERTY_SELLER_EVIDENCE_FIXTURES,
  });

function unique<T extends string>(values: readonly T[]): readonly T[] {
  return Object.freeze([...new Set(values)].sort());
}

function isFailClosedRights(rights: EvidenceDepthRightsStatus) {
  return rights === "UNKNOWN_OR_UNRESOLVED" || rights === "INTERNAL_ANALYSIS_ONLY" || rights === "RESTRICTED" || rights === "PROHIBITED";
}

export function buildPropertySellerInternalPreparationSummary(
  fixtures: readonly PropertySellerEvidenceFixture[] = PROPERTY_SELLER_EVIDENCE_FIXTURES,
): PropertySellerInternalPreparationSummary {
  const categories = unique(fixtures.flatMap((fixture) => [...fixture.categories]));
  return Object.freeze({
    evidenceCategoryCount: categories.length,
    availableDocumentCategoryCount: fixtures.filter((fixture) => fixture.dispositions.includes("DOCUMENTATION_CATEGORY_READY")).length,
    incompleteCategoryCount: fixtures.filter((fixture) => fixture.dispositions.includes("DOCUMENTATION_INCOMPLETE")).length,
    rightsLimitations: unique(fixtures.map((fixture) => fixture.evidencePosture.sourceRights).filter(isFailClosedRights)),
    freshnessIssues: unique(
      fixtures
        .map((fixture) => fixture.evidencePosture.freshness)
        .filter((freshness) => freshness === "STALE" || freshness === "UNDATED" || freshness === "AGING"),
    ),
    conflictStatuses: unique(
      fixtures
        .map((fixture) => fixture.evidencePosture.conflictStatus)
        .filter((conflict) => conflict !== "NO_KNOWN_CONFLICT" && conflict !== "COMPATIBLE_EVIDENCE"),
    ),
    provenanceGapCount: fixtures.filter((fixture) => !fixture.evidencePosture.provenanceComplete).length,
    propertyIdentityLimitations: Object.freeze([...new Set(fixtures.flatMap((fixture) => [...fixture.propertyIdentity.limitations]))].sort()),
    professionalReviewCategories: unique(fixtures.flatMap((fixture) => [...fixture.professionalReviewCategories])),
    blockedUseCategories: unique(
      fixtures
        .filter((fixture) => fixture.evidencePosture.publicUseEligibility !== "INTERNAL_ONLY" || fixture.dispositions.includes("PUBLIC_USE_BLOCKED"))
        .flatMap((fixture) => [...fixture.categories]),
    ),
    unresolvedQuestions: Object.freeze([...new Set(fixtures.flatMap((fixture) => [...fixture.unresolvedQuestions]))].sort()),
    futureIntegrationDependencies: unique(
      fixtures
        .flatMap((fixture) => [...fixture.dispositions])
        .filter((disposition) =>
          ["CUSTOMER_DATA_REQUIRED_BUT_UNAUTHORIZED", "PROVIDER_DEPENDENCY_BLOCKED", "FUTURE_INTEGRATION_CANDIDATE", "DEFERRED", "UNRESOLVED"].includes(
            disposition,
          ),
        ),
    ),
    propertyValue: null,
    listingPrice: null,
    conditionScore: null,
    repairPriority: null,
    sellerReadinessScore: null,
    saleProbability: null,
    urgency: null,
    recommendation: null,
    suitability: null,
    marketability: null,
    investmentValue: null,
    appraisalConclusion: null,
    legalConclusion: null,
  });
}

export function inspectPropertySellerEvidenceReadiness(
  fixtures: readonly PropertySellerEvidenceFixture[] = PROPERTY_SELLER_EVIDENCE_FIXTURES,
): PropertySellerEvidenceReadinessInspection {
  return Object.freeze({
    contract: PROPERTY_SELLER_EVIDENCE_READINESS,
    status: PROPERTY_SELLER_EVIDENCE_READINESS_STATUS,
    version: PROPERTY_SELLER_EVIDENCE_READINESS_VERSION,
    reusedEvidenceDepthStatus: EVIDENCE_DEPTH_FOUNDATION_STATUS,
    fixtureCount: fixtures.length,
    evidenceCategoriesCovered: unique(fixtures.flatMap((fixture) => [...fixture.categories])),
    dispositionCoverage: unique(fixtures.flatMap((fixture) => [...fixture.dispositions])),
    professionalReviewCategoriesCovered: unique(fixtures.flatMap((fixture) => [...fixture.professionalReviewCategories])),
    incompleteCategoryCount: fixtures.filter((fixture) => fixture.dispositions.includes("DOCUMENTATION_INCOMPLETE")).length,
    rightsFailClosedCount: fixtures.filter((fixture) => isFailClosedRights(fixture.evidencePosture.sourceRights)).length,
    freshnessReviewCount: fixtures.filter((fixture) => fixture.dispositions.includes("FRESHNESS_REVIEW_REQUIRED")).length,
    conflictReviewCount: fixtures.filter((fixture) => fixture.dispositions.includes("CONFLICT_REVIEW_REQUIRED")).length,
    provenanceGapCount: fixtures.filter((fixture) => !fixture.evidencePosture.provenanceComplete).length,
    propertyIdentityLimitationCount: fixtures.filter((fixture) => fixture.propertyIdentity.limitations.length > 0).length,
    blockedUseWarningCount: fixtures.filter((fixture) => fixture.blockedUseWarnings.length > 0).length,
    futureIntegrationCandidateCount: fixtures.filter((fixture) => fixture.dispositions.includes("FUTURE_INTEGRATION_CANDIDATE")).length,
    deferredOrUnresolvedCount: fixtures.filter((fixture) => fixture.dispositions.includes("DEFERRED") || fixture.dispositions.includes("UNRESOLVED")).length,
    valuationGuardCount: fixtures.filter((fixture) => fixture.dispositions.includes("VALUATION_PROHIBITED")).length,
    conditionConclusionGuardCount: fixtures.filter((fixture) => fixture.dispositions.includes("CONDITION_CONCLUSION_PROHIBITED")).length,
    customerDataGuardCount: fixtures.filter((fixture) => fixture.dispositions.includes("CUSTOMER_DATA_REQUIRED_BUT_UNAUTHORIZED")).length,
    providerDependencyGuardCount: fixtures.filter((fixture) => fixture.dispositions.includes("PROVIDER_DEPENDENCY_BLOCKED")).length,
    publicNonExposureGuardCount: fixtures.filter((fixture) => fixture.dispositions.includes("PUBLIC_USE_BLOCKED") || fixture.evidencePosture.publicUseEligibility === "BLOCKED").length,
    summary: buildPropertySellerInternalPreparationSummary(fixtures),
    activationAssertions: Object.freeze({
      noPropertyLookup: fixtures.every((fixture) => fixture.activation.propertyLookup === false),
      noOwnershipLookup: fixtures.every((fixture) => fixture.activation.ownershipLookup === false),
      noPublicRecordRetrieval: fixtures.every((fixture) => fixture.activation.publicRecordRetrieval === false),
      noProviderCalls: fixtures.every((fixture) => fixture.activation.providerCalls === 0),
      noUploads: fixtures.every((fixture) => fixture.activation.uploads === false && fixture.activation.documentStorage === false),
      noPersistence: fixtures.every((fixture) => fixture.activation.persistenceReads === false && fixture.activation.persistenceWrites === false),
      noApiOrPublicRoute: fixtures.every((fixture) => fixture.activation.publicApiCreated === false && fixture.activation.publicRouteCreated === false),
      noCustomerData: fixtures.every((fixture) => fixture.activation.customerDataAccess === false && fixture.activation.customerRecordCreated === false),
      noCrmWorkflow: fixtures.every((fixture) => fixture.activation.crmWorkflow === false && fixture.activation.sellerProfileCreated === false),
      noTrackingOrTelemetry: fixtures.every((fixture) => fixture.activation.tracking === false && fixture.activation.telemetry === false),
      noProductionWrites: fixtures.every((fixture) => fixture.activation.productionWrites === false && fixture.activation.databaseWrites === false),
    }),
    prohibitedOutputAssertions: Object.freeze({
      valuation: false,
      pricing: false,
      sellerNetSheet: false,
      comparableSaleCalculation: false,
      conditionConclusion: false,
      repairScore: false,
      legalTitleInsuranceMunicipalHoaStructuralEnvironmentalConclusion: false,
      sellerReadinessScore: false,
      saleProbability: false,
      recommendation: false,
      ranking: false,
    }),
    fixtures,
  });
}
