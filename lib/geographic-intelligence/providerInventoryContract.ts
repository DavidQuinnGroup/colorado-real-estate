import { type GeographicIntelligenceActivationState, type GeographicIntelligenceFreshness, type GeographicIntelligencePermittedUse } from "./activationContract.js";
import { type GeographicIntelligenceDomainId } from "./domainContract.js";
import { type GisEvidenceAuthorityClassification, type GisEvidenceLicensingClassification } from "./evidenceProvenanceContract.js";

export const GIS_1_0_SPRINT_3_AUTHORIZATION = "GIS_1_0_SPRINT_3_PROVIDER_INVENTORY_GOVERNANCE_AUTHORIZED";
export const GIS_1_0_SPRINT_3_CLASSIFICATION = "PROVIDER_INVENTORY_GOVERNANCE";
export const GIS_1_0_SPRINT_3_CERTIFICATION = "GIS_1_0_SPRINT_3_PROVIDER_INVENTORY_GOVERNANCE_CERTIFIED";

export type GisProviderInventoryEntityType =
  | "ORIGINATING_AUTHORITY"
  | "GOVERNMENT_AGENCY"
  | "PUBLIC_RECORD_OFFICE"
  | "DATASET"
  | "PUBLISHER"
  | "DISTRIBUTOR"
  | "AGGREGATOR"
  | "COMMERCIAL_VENDOR"
  | "PROFESSIONAL_ASSOCIATION"
  | "MLS_SYSTEM"
  | "SOFTWARE_TOOL"
  | "OPERATIONAL_SERVICE"
  | "CONSUMER_PORTAL"
  | "EDITORIAL_SOURCE"
  | "CALCULATION_TOOL"
  | "INTERNAL_SOURCE"
  | "GENERIC_SOURCE_CLASS"
  | "UNKNOWN";

export type GisProviderInventoryRole =
  | "ORIGINATING_AUTHORITY"
  | "PRIMARY_PUBLISHER"
  | "DISTRIBUTOR"
  | "AGGREGATOR"
  | "SUPPLEMENTAL_RESEARCH_SOURCE"
  | "OPERATIONAL_TOOL"
  | "CALCULATION_TOOL"
  | "EDITORIAL_SOURCE"
  | "CONSUMER_PORTAL"
  | "UNKNOWN";

export type GisGeographicCoverageType =
  | "NATIONAL"
  | "STATEWIDE"
  | "MULTI_STATE"
  | "REGIONAL"
  | "COUNTY"
  | "MUNICIPAL"
  | "SCHOOL_DISTRICT"
  | "SPECIAL_DISTRICT"
  | "PARCEL"
  | "POINT_OR_PLACE"
  | "SERVICE_AREA"
  | "VARIABLE"
  | "UNKNOWN";

export type GisProviderGovernanceDisposition =
  | "INVENTORY_CONTEXT_ONLY"
  | "RESEARCH_CANDIDATE"
  | "GOVERNANCE_REVIEW_REQUIRED"
  | "LICENSING_REVIEW_REQUIRED"
  | "AUTHORITY_REVIEW_REQUIRED"
  | "TECHNICAL_REVIEW_REQUIRED"
  | "COMMERCIAL_REVIEW_REQUIRED"
  | "DUPLICATE_OR_OVERLAPPING"
  | "DEFERRED"
  | "REJECTED"
  | "RETIRED"
  | "APPROVED_FOR_FUTURE_PROVIDER_EVALUATION";

export type GisProviderSourcePreference =
  | "UNASSESSED"
  | "POTENTIAL_PRIMARY_AUTHORITY"
  | "POTENTIAL_PRIMARY_SOURCE"
  | "POTENTIAL_SECONDARY_SOURCE"
  | "POTENTIAL_SUPPLEMENTAL_SOURCE"
  | "POTENTIAL_FALLBACK_SOURCE"
  | "OPERATIONAL_TOOL_ONLY"
  | "RESEARCH_REFERENCE_ONLY"
  | "UNSUITABLE"
  | "UNKNOWN";

export type GisProviderVerificationState =
  | "NOT_VERIFIED"
  | "INVENTORY_DOCUMENT_ONLY"
  | "REPOSITORY_EVIDENCE_ONLY"
  | "AUTHORITATIVE_DOCUMENT_VERIFIED"
  | "CONTRACT_VERIFIED"
  | "TECHNICALLY_VERIFIED"
  | "HISTORICAL_OR_POSSIBLY_STALE"
  | "VERIFICATION_REQUIRED";

export type GisProviderAcquisitionMethod =
  | "OFFICIAL_API"
  | "LICENSED_DATA_FEED"
  | "MLS_FEED"
  | "FILE_DOWNLOAD"
  | "OPEN_DATA_PORTAL"
  | "GIS_SERVICE"
  | "MANUAL_RESEARCH"
  | "PUBLIC_RECORD_REQUEST"
  | "DOCUMENT_REVIEW"
  | "USER_SUPPLIED"
  | "EMBED_OR_LINK_ONLY"
  | "WEB_INTERFACE_ONLY"
  | "CONTRACT_REQUIRED"
  | "UNKNOWN"
  | "PROHIBITED";

export type GisProviderCostClassification =
  | "FREE"
  | "MEMBERSHIP_INCLUDED"
  | "SUBSCRIPTION"
  | "USAGE_BASED"
  | "ENTERPRISE_CONTRACT"
  | "GOVERNMENT_OPEN_ACCESS"
  | "UNKNOWN";

export type GisNonGisReieDomain =
  | "PROPERTY_INTELLIGENCE"
  | "SELLER_INTELLIGENCE"
  | "BUYER_INTELLIGENCE"
  | "DEVELOPMENT_INTELLIGENCE"
  | "EXECUTIVE_INTELLIGENCE"
  | "TRANSACTION_OPERATIONS"
  | "SHOWING_OPERATIONS"
  | "FINANCING_OPERATIONS"
  | "TITLE_OPERATIONS"
  | "LEAD_GENERATION"
  | "SEARCH_PRESENTATION"
  | "GENERAL_RESEARCH"
  | "UNKNOWN";

export type GisProviderRisk =
  | "SINGLE_PROVIDER_DEPENDENCY"
  | "CONTRACTUAL_LOCK_IN"
  | "ACCOUNT_DEPENDENCY"
  | "MEMBERSHIP_DEPENDENCY"
  | "MANUAL_WORKFLOW_DEPENDENCY"
  | "UNSTABLE_BRANDING_OR_OWNERSHIP"
  | "RATE_LIMIT_DEPENDENCY"
  | "JURISDICTION_FRAGMENTATION"
  | "INCOMPLETE_COVERAGE"
  | "FRESHNESS_UNCERTAINTY"
  | "LICENSING_UNCERTAINTY"
  | "TECHNICAL_ACCESS_UNCERTAINTY"
  | "REDISTRIBUTION_RESTRICTIONS"
  | "PROVIDER_CONTINUITY_RISK";

export type GisProviderInventoryCategory =
  | "MLS_SYSTEMS_AND_PRIMARY_LISTING_DATA"
  | "PUBLIC_RECORDS_AND_PROPERTY_RESEARCH"
  | "GIS_AND_PARCEL_MAPPING"
  | "COUNTY_ASSESSOR_SOURCES"
  | "COUNTY_CLERK_AND_RECORDER_SOURCES"
  | "MARKET_STATISTICS"
  | "DEMOGRAPHIC_ECONOMIC_EMPLOYMENT_AND_SCHOOL_RESEARCH"
  | "ENVIRONMENTAL_AND_RISK_DATA"
  | "BUILDING_AND_PERMIT_DATA"
  | "PLANNING_AND_DEVELOPMENT"
  | "HOA_RESEARCH"
  | "TITLE_COMPANY_RESOURCES"
  | "MORTGAGE_AND_FINANCING_TOOLS"
  | "CONSUMER_RESEARCH_SITES"
  | "PROFESSIONAL_RESEARCH_AND_ANALYTICS_TOOLS"
  | "INVESTMENT_RESEARCH";

export type GisProviderInventoryEntry = Readonly<{
  inventoryEntryId: string;
  canonicalName: string;
  alternateNames: readonly string[];
  category: GisProviderInventoryCategory;
  entityTypes: readonly GisProviderInventoryEntityType[];
  providerRoles: readonly GisProviderInventoryRole[];
  sourceOrDatasetIdentities: readonly string[];
  publisherIdentity: string | null;
  originatingAuthorityIdentity: string | null;
  jurisdiction: string | null;
  geographicCoverageType: GisGeographicCoverageType;
  knownCoverageDescription: string;
  potentialGisDomainRelevance: readonly GeographicIntelligenceDomainId[];
  potentialNonGisReieRelevance: readonly GisNonGisReieDomain[];
  outsideGisSprint3DirectOwnership: boolean;
  potentialEvidenceCategories: readonly string[];
  operationalCapabilities: readonly string[];
  acquisitionMethodPossibilities: readonly GisProviderAcquisitionMethod[];
  licensingClassification: GisEvidenceLicensingClassification;
  permittedUse: GeographicIntelligencePermittedUse;
  licensingVerificationState: GisProviderVerificationState;
  authorityClassification: GisEvidenceAuthorityClassification;
  freshnessExpectation: GeographicIntelligenceFreshness;
  updateCadence: "UNKNOWN" | "STATIC" | "EVENT_DRIVEN" | "PERIODIC" | "CONTINUOUS" | "MANUAL";
  costClassification: GisProviderCostClassification;
  accountOrMembershipRequired: "YES" | "NO" | "UNKNOWN";
  contractRequired: "YES" | "NO" | "UNKNOWN";
  authenticationRequired: "YES" | "NO" | "UNKNOWN";
  attributionRequired: "YES" | "NO" | "UNKNOWN";
  dependencyRisks: readonly GisProviderRisk[];
  duplicationOrOverlapReferences: readonly string[];
  sourcePreference: GisProviderSourcePreference;
  governanceDisposition: GisProviderGovernanceDisposition;
  verificationState: GisProviderVerificationState;
  lastVerifiedDate: string | null;
  classificationEvidence: readonly string[];
  rejectionReason: string | null;
  notes: string;
  internalOnly: true;
  activation: GeographicIntelligenceActivationState;
  customerDisplayAuthorized: false;
  redistributionAuthorized: false;
}>;

export type GisProviderOverlap = Readonly<{
  overlapId: string;
  involvedInventoryEntryIds: readonly string[];
  overlapCategory: "LISTING_DATA" | "PUBLIC_RECORDS" | "PARCEL_OR_GIS" | "MARKET_STATISTICS" | "CONSUMER_RESEARCH" | "COMMERCIAL_ANALYTICS" | "REGULATORY_OR_PLANNING" | "UNKNOWN";
  potentialDuplicatedEvidenceClass: string;
  authorityDifference: string;
  coverageDifference: string;
  temporalDifference: string;
  licensingDifference: string;
  unresolved: true;
  equivalent: false;
  notes: string;
  internalOnly: true;
}>;

export type GisProviderInventoryScenarioResult =
  | "GOVERNED_PROVIDER_INVENTORY_ENTRY"
  | "COMMERCIAL_REVIEW_REQUIRED"
  | "OPERATIONAL_TOOL_ONLY"
  | "RESEARCH_REFERENCE_ONLY"
  | "JURISDICTION_INSTANCE_REQUIRED_BEFORE_ACTIVATION"
  | "FAILED_CLOSED_LICENSING_UNKNOWN"
  | "OVERLAP_PRESERVED_NOT_EQUIVALENT"
  | "APPROVED_FOR_FUTURE_PROVIDER_EVALUATION"
  | "REJECTED_WITH_REASON_RETAINED"
  | "VERIFICATION_REQUIRED";

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/providerInventoryContract.ts
