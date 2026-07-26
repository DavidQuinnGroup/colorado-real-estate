import { GIS_FAIL_CLOSED_ACTIVATION } from "../activationContract.js";
import { stableGisEvidenceFingerprint } from "../evidenceFingerprint.js";
import {
  type GisProviderInventoryCategory,
  type GisProviderInventoryEntry,
  type GisProviderInventoryEntityType,
  type GisProviderInventoryRole,
  type GisProviderInventoryScenarioResult,
  type GisProviderOverlap,
  type GisProviderRisk,
} from "../providerInventoryContract.js";
import {
  deterministicProviderInventorySummary,
  validateGisProviderInventoryEntry,
  validateGisProviderOverlap,
} from "../providerInventoryValidation.js";
import { type GeographicIntelligenceDomainId } from "../domainContract.js";

export const GIS_SPRINT_3_FIXTURE_DATE = "2026-07-26";
export const GIS_SPRINT_3_CANONICAL_INVENTORY_SOURCE = "PROJECT ATLAS - REAL ESTATE DATA TOOLS";
export const GIS_SPRINT_3_PROVIDER_BOUNDARY_NOTE = "PROVIDER_INVENTORY_DOES_NOT_AUTHORIZE_PROVIDER_USE";

const allGisDomains = Object.freeze([
  "COMMUNITY_INTELLIGENCE",
  "EDUCATION_INTELLIGENCE",
  "TRANSPORTATION_INTELLIGENCE",
  "ENVIRONMENTAL_INTELLIGENCE",
  "ECONOMIC_INTELLIGENCE",
  "INFRASTRUCTURE_INTELLIGENCE",
  "MARKET_INTELLIGENCE",
  "LIFESTYLE_INTELLIGENCE",
] as const);

export const GIS_SPRINT_3_PROVIDER_INVENTORY = Object.freeze([
  entry("IRES MLS", "MLS_SYSTEMS_AND_PRIMARY_LISTING_DATA", ["MLS_SYSTEM"], ["DISTRIBUTOR"], ["MARKET_INTELLIGENCE"], ["SEARCH_PRESENTATION", "PROPERTY_INTELLIGENCE"], "MLS listing and market data context", "MEMBERSHIP_INCLUDED", "MEMBERSHIP_DEPENDENCY", "GOVERNANCE_REVIEW_REQUIRED"),
  entry("Matrix within IRES", "MLS_SYSTEMS_AND_PRIMARY_LISTING_DATA", ["SOFTWARE_TOOL"], ["OPERATIONAL_TOOL"], [], ["SEARCH_PRESENTATION"], "MLS software interface context", "MEMBERSHIP_INCLUDED", "MEMBERSHIP_DEPENDENCY", "GOVERNANCE_REVIEW_REQUIRED", "OPERATIONAL_TOOL_ONLY"),
  entry("ShowingTime", "MLS_SYSTEMS_AND_PRIMARY_LISTING_DATA", ["OPERATIONAL_SERVICE", "SOFTWARE_TOOL"], ["OPERATIONAL_TOOL"], [], ["SHOWING_OPERATIONS"], "Showing workflow tool context", "UNKNOWN", "ACCOUNT_DEPENDENCY", "INVENTORY_CONTEXT_ONLY", "OPERATIONAL_TOOL_ONLY"),
  entry("Supra eKEY", "MLS_SYSTEMS_AND_PRIMARY_LISTING_DATA", ["OPERATIONAL_SERVICE", "SOFTWARE_TOOL"], ["OPERATIONAL_TOOL"], [], ["SHOWING_OPERATIONS"], "Lockbox operational tool context", "UNKNOWN", "ACCOUNT_DEPENDENCY", "INVENTORY_CONTEXT_ONLY", "OPERATIONAL_TOOL_ONLY"),
  entry("ColoProperty.com", "MLS_SYSTEMS_AND_PRIMARY_LISTING_DATA", ["CONSUMER_PORTAL", "PUBLISHER"], ["CONSUMER_PORTAL"], ["MARKET_INTELLIGENCE"], ["SEARCH_PRESENTATION"], "Consumer listing presentation context", "UNKNOWN", "LICENSING_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED", "RESEARCH_REFERENCE_ONLY"),

  entry("TitlePro247", "PUBLIC_RECORDS_AND_PROPERTY_RESEARCH", ["COMMERCIAL_VENDOR", "AGGREGATOR"], ["AGGREGATOR"], [], ["TITLE_OPERATIONS", "PROPERTY_INTELLIGENCE", "LEAD_GENERATION"], "Title and property research platform context", "ENTERPRISE_CONTRACT", "CONTRACTUAL_LOCK_IN", "COMMERCIAL_REVIEW_REQUIRED"),
  entry("IRES Public Records", "PUBLIC_RECORDS_AND_PROPERTY_RESEARCH", ["DATASET", "DISTRIBUTOR"], ["DISTRIBUTOR"], [], ["PROPERTY_INTELLIGENCE"], "Public-record access through IRES context", "MEMBERSHIP_INCLUDED", "MEMBERSHIP_DEPENDENCY", "GOVERNANCE_REVIEW_REQUIRED"),
  sourceClass("County assessor source class", "COUNTY_ASSESSOR_SOURCES", ["PUBLIC_RECORD_OFFICE", "GENERIC_SOURCE_CLASS"], ["PRIMARY_PUBLISHER"], ["COMMUNITY_INTELLIGENCE", "MARKET_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "County-specific assessor source class; jurisdiction instance required."),
  sourceClass("County clerk and recorder source class", "COUNTY_CLERK_AND_RECORDER_SOURCES", ["PUBLIC_RECORD_OFFICE", "GENERIC_SOURCE_CLASS"], ["PRIMARY_PUBLISHER"], [], ["TITLE_OPERATIONS", "PROPERTY_INTELLIGENCE"], "County-specific clerk and recorder source class; jurisdiction instance required."),
  entry("Colorado Open Records Act request channels", "PUBLIC_RECORDS_AND_PROPERTY_RESEARCH", ["GOVERNMENT_AGENCY", "GENERIC_SOURCE_CLASS"], ["PRIMARY_PUBLISHER"], [], ["GENERAL_RESEARCH"], "Request-channel governance context only", "UNKNOWN", "MANUAL_WORKFLOW_DEPENDENCY", "GOVERNANCE_REVIEW_REQUIRED"),

  entry("Boulder County GIS", "GIS_AND_PARCEL_MAPPING", ["GOVERNMENT_AGENCY", "PUBLISHER"], ["PRIMARY_PUBLISHER"], ["ENVIRONMENTAL_INTELLIGENCE", "INFRASTRUCTURE_INTELLIGENCE", "COMMUNITY_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "County GIS context for Boulder County", "UNKNOWN", "JURISDICTION_FRAGMENTATION", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_SOURCE", "Boulder County"),
  entry("Broomfield GIS", "GIS_AND_PARCEL_MAPPING", ["GOVERNMENT_AGENCY", "PUBLISHER"], ["PRIMARY_PUBLISHER"], ["ENVIRONMENTAL_INTELLIGENCE", "INFRASTRUCTURE_INTELLIGENCE", "COMMUNITY_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "County/city GIS context for Broomfield", "UNKNOWN", "JURISDICTION_FRAGMENTATION", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_SOURCE", "Broomfield"),
  entry("Larimer County GIS", "GIS_AND_PARCEL_MAPPING", ["GOVERNMENT_AGENCY", "PUBLISHER"], ["PRIMARY_PUBLISHER"], ["ENVIRONMENTAL_INTELLIGENCE", "INFRASTRUCTURE_INTELLIGENCE", "COMMUNITY_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "County GIS context for Larimer County", "UNKNOWN", "JURISDICTION_FRAGMENTATION", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_SOURCE", "Larimer County"),
  entry("Weld County GIS", "GIS_AND_PARCEL_MAPPING", ["GOVERNMENT_AGENCY", "PUBLISHER"], ["PRIMARY_PUBLISHER"], ["ENVIRONMENTAL_INTELLIGENCE", "INFRASTRUCTURE_INTELLIGENCE", "COMMUNITY_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "County GIS context for Weld County", "UNKNOWN", "JURISDICTION_FRAGMENTATION", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_SOURCE", "Weld County"),
  entry("Adams County GIS", "GIS_AND_PARCEL_MAPPING", ["GOVERNMENT_AGENCY", "PUBLISHER"], ["PRIMARY_PUBLISHER"], ["ENVIRONMENTAL_INTELLIGENCE", "INFRASTRUCTURE_INTELLIGENCE", "COMMUNITY_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "County GIS context for Adams County", "UNKNOWN", "JURISDICTION_FRAGMENTATION", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_SOURCE", "Adams County"),
  entry("Jefferson County GIS", "GIS_AND_PARCEL_MAPPING", ["GOVERNMENT_AGENCY", "PUBLISHER"], ["PRIMARY_PUBLISHER"], ["ENVIRONMENTAL_INTELLIGENCE", "INFRASTRUCTURE_INTELLIGENCE", "COMMUNITY_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "County GIS context for Jefferson County", "UNKNOWN", "JURISDICTION_FRAGMENTATION", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_SOURCE", "Jefferson County"),

  sourceClass("Boulder County Assessor", "COUNTY_ASSESSOR_SOURCES", ["PUBLIC_RECORD_OFFICE"], ["PRIMARY_PUBLISHER"], ["MARKET_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Boulder County assessor context; rights unverified.", "Boulder County"),
  sourceClass("Broomfield Assessor", "COUNTY_ASSESSOR_SOURCES", ["PUBLIC_RECORD_OFFICE"], ["PRIMARY_PUBLISHER"], ["MARKET_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Broomfield assessor context; rights unverified.", "Broomfield"),
  sourceClass("Larimer County Assessor", "COUNTY_ASSESSOR_SOURCES", ["PUBLIC_RECORD_OFFICE"], ["PRIMARY_PUBLISHER"], ["MARKET_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Larimer County assessor context; rights unverified.", "Larimer County"),
  sourceClass("Weld County Assessor", "COUNTY_ASSESSOR_SOURCES", ["PUBLIC_RECORD_OFFICE"], ["PRIMARY_PUBLISHER"], ["MARKET_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Weld County assessor context; rights unverified.", "Weld County"),
  sourceClass("Adams County Assessor", "COUNTY_ASSESSOR_SOURCES", ["PUBLIC_RECORD_OFFICE"], ["PRIMARY_PUBLISHER"], ["MARKET_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Adams County assessor context; rights unverified.", "Adams County"),
  sourceClass("Jefferson County Assessor", "COUNTY_ASSESSOR_SOURCES", ["PUBLIC_RECORD_OFFICE"], ["PRIMARY_PUBLISHER"], ["MARKET_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Jefferson County assessor context; rights unverified.", "Jefferson County"),

  entry("IRES Stats", "MARKET_STATISTICS", ["DATASET", "MLS_SYSTEM"], ["DISTRIBUTOR"], ["MARKET_INTELLIGENCE"], ["EXECUTIVE_INTELLIGENCE"], "MLS statistics context", "MEMBERSHIP_INCLUDED", "MEMBERSHIP_DEPENDENCY", "LICENSING_REVIEW_REQUIRED"),
  entry("Local REALTOR association source class", "MARKET_STATISTICS", ["PROFESSIONAL_ASSOCIATION", "GENERIC_SOURCE_CLASS"], ["PRIMARY_PUBLISHER"], ["MARKET_INTELLIGENCE", "ECONOMIC_INTELLIGENCE"], ["EXECUTIVE_INTELLIGENCE"], "Local association publication class, including Boulder, Longmont, Fort Collins, Loveland-Berthoud, and similar governed associations.", "UNKNOWN", "LICENSING_UNCERTAINTY", "LICENSING_REVIEW_REQUIRED"),

  entry("U.S. Census Bureau", "DEMOGRAPHIC_ECONOMIC_EMPLOYMENT_AND_SCHOOL_RESEARCH", ["GOVERNMENT_AGENCY", "ORIGINATING_AUTHORITY"], ["ORIGINATING_AUTHORITY", "PRIMARY_PUBLISHER"], ["COMMUNITY_INTELLIGENCE", "ECONOMIC_INTELLIGENCE"], ["GENERAL_RESEARCH"], "Demographic and economic context", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "APPROVED_FOR_FUTURE_PROVIDER_EVALUATION", "POTENTIAL_PRIMARY_AUTHORITY", "United States"),
  entry("Esri", "DEMOGRAPHIC_ECONOMIC_EMPLOYMENT_AND_SCHOOL_RESEARCH", ["COMMERCIAL_VENDOR", "AGGREGATOR"], ["AGGREGATOR"], ["COMMUNITY_INTELLIGENCE", "ECONOMIC_INTELLIGENCE", "LIFESTYLE_INTELLIGENCE"], ["GENERAL_RESEARCH"], "Commercial demographics and segmentation context", "ENTERPRISE_CONTRACT", "CONTRACTUAL_LOCK_IN", "COMMERCIAL_REVIEW_REQUIRED"),
  entry("Colorado Department of Labor and Employment", "DEMOGRAPHIC_ECONOMIC_EMPLOYMENT_AND_SCHOOL_RESEARCH", ["GOVERNMENT_AGENCY", "ORIGINATING_AUTHORITY"], ["ORIGINATING_AUTHORITY"], ["ECONOMIC_INTELLIGENCE"], ["GENERAL_RESEARCH"], "Labor and employment context", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_AUTHORITY", "Colorado"),
  entry("U.S. Bureau of Labor Statistics", "DEMOGRAPHIC_ECONOMIC_EMPLOYMENT_AND_SCHOOL_RESEARCH", ["GOVERNMENT_AGENCY", "ORIGINATING_AUTHORITY"], ["ORIGINATING_AUTHORITY"], ["ECONOMIC_INTELLIGENCE"], ["GENERAL_RESEARCH"], "Labor statistics context", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_AUTHORITY", "United States"),
  entry("GreatSchools", "DEMOGRAPHIC_ECONOMIC_EMPLOYMENT_AND_SCHOOL_RESEARCH", ["CONSUMER_PORTAL", "EDITORIAL_SOURCE"], ["SUPPLEMENTAL_RESEARCH_SOURCE"], ["EDUCATION_INTELLIGENCE"], ["GENERAL_RESEARCH"], "Education research context; ratings and rights unverified.", "UNKNOWN", "LICENSING_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED", "RESEARCH_REFERENCE_ONLY"),
  entry("Colorado SchoolView", "DEMOGRAPHIC_ECONOMIC_EMPLOYMENT_AND_SCHOOL_RESEARCH", ["GOVERNMENT_AGENCY", "PUBLISHER"], ["PRIMARY_PUBLISHER"], ["EDUCATION_INTELLIGENCE"], ["GENERAL_RESEARCH"], "Colorado education data context", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_SOURCE", "Colorado"),
  sourceClass("School district source class", "DEMOGRAPHIC_ECONOMIC_EMPLOYMENT_AND_SCHOOL_RESEARCH", ["GOVERNMENT_AGENCY", "GENERIC_SOURCE_CLASS"], ["PRIMARY_PUBLISHER"], ["EDUCATION_INTELLIGENCE"], ["GENERAL_RESEARCH"], "District-specific school source class; jurisdiction instance required."),

  entry("FEMA flood-map source class", "ENVIRONMENTAL_AND_RISK_DATA", ["GOVERNMENT_AGENCY", "GENERIC_SOURCE_CLASS"], ["PRIMARY_PUBLISHER"], ["ENVIRONMENTAL_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Flood-map context; not property-specific legal or insurance conclusion.", "UNKNOWN", "LICENSING_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_SOURCE"),
  entry("Colorado Geological Survey", "ENVIRONMENTAL_AND_RISK_DATA", ["GOVERNMENT_AGENCY", "PUBLISHER"], ["PRIMARY_PUBLISHER"], ["ENVIRONMENTAL_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Geological context", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_SOURCE", "Colorado"),
  entry("Wildfire-risk source class", "ENVIRONMENTAL_AND_RISK_DATA", ["GENERIC_SOURCE_CLASS"], ["UNKNOWN"], ["ENVIRONMENTAL_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Wildfire-risk context class; source and rights require governance.", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED"),
  entry("Air-quality source class", "ENVIRONMENTAL_AND_RISK_DATA", ["GENERIC_SOURCE_CLASS"], ["UNKNOWN"], ["ENVIRONMENTAL_INTELLIGENCE", "LIFESTYLE_INTELLIGENCE"], ["GENERAL_RESEARCH"], "Air-quality context class; source and rights require governance.", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED"),
  entry("Radon-map source class", "ENVIRONMENTAL_AND_RISK_DATA", ["GENERIC_SOURCE_CLASS"], ["UNKNOWN"], ["ENVIRONMENTAL_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Radon-map context class; source and rights require governance.", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED"),
  entry("Water-rights source class", "ENVIRONMENTAL_AND_RISK_DATA", ["GENERIC_SOURCE_CLASS"], ["UNKNOWN"], ["ENVIRONMENTAL_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Water-rights context class; source and rights require governance.", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED"),
  entry("U.S. Geological Survey", "ENVIRONMENTAL_AND_RISK_DATA", ["GOVERNMENT_AGENCY", "ORIGINATING_AUTHORITY"], ["ORIGINATING_AUTHORITY"], ["ENVIRONMENTAL_INTELLIGENCE"], ["GENERAL_RESEARCH"], "Geological and natural hazard context", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_AUTHORITY", "United States"),
  entry("National Weather Service", "ENVIRONMENTAL_AND_RISK_DATA", ["GOVERNMENT_AGENCY", "ORIGINATING_AUTHORITY"], ["ORIGINATING_AUTHORITY"], ["ENVIRONMENTAL_INTELLIGENCE"], ["GENERAL_RESEARCH"], "Weather and climate observation context", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_AUTHORITY", "United States"),

  sourceClass("Building-department source class", "BUILDING_AND_PERMIT_DATA", ["GOVERNMENT_AGENCY", "GENERIC_SOURCE_CLASS"], ["PRIMARY_PUBLISHER"], ["INFRASTRUCTURE_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "City or county building department source class; jurisdiction instance required."),
  sourceClass("Planning-department source class", "PLANNING_AND_DEVELOPMENT", ["GOVERNMENT_AGENCY", "GENERIC_SOURCE_CLASS"], ["PRIMARY_PUBLISHER"], ["COMMUNITY_INTELLIGENCE", "INFRASTRUCTURE_INTELLIGENCE"], ["DEVELOPMENT_INTELLIGENCE"], "City, county, or regional planning department source class; jurisdiction instance required."),
  entry("HOA source class", "HOA_RESEARCH", ["GENERIC_SOURCE_CLASS"], ["UNKNOWN"], ["COMMUNITY_INTELLIGENCE"], ["TITLE_OPERATIONS", "PROPERTY_INTELLIGENCE"], "HOA websites, management companies, and recorded documents must remain authority-separated.", "UNKNOWN", "LICENSING_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED"),
  entry("Title-company resource class", "TITLE_COMPANY_RESOURCES", ["COMMERCIAL_VENDOR", "GENERIC_SOURCE_CLASS"], ["AGGREGATOR"], [], ["TITLE_OPERATIONS", "SELLER_INTELLIGENCE", "LEAD_GENERATION"], "Title-company products may mix factual records, estimates, marketing, and lead-generation outputs.", "ENTERPRISE_CONTRACT", "CONTRACTUAL_LOCK_IN", "COMMERCIAL_REVIEW_REQUIRED"),

  entry("Fannie Mae", "MORTGAGE_AND_FINANCING_TOOLS", ["GOVERNMENT_AGENCY", "PUBLISHER"], ["PRIMARY_PUBLISHER"], ["ECONOMIC_INTELLIGENCE"], ["FINANCING_OPERATIONS"], "GSE financing program context", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_SOURCE", "United States"),
  entry("Freddie Mac", "MORTGAGE_AND_FINANCING_TOOLS", ["GOVERNMENT_AGENCY", "PUBLISHER"], ["PRIMARY_PUBLISHER"], ["ECONOMIC_INTELLIGENCE"], ["FINANCING_OPERATIONS"], "GSE financing program context", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_SOURCE", "United States"),
  entry("Mortgage and affordability-tool class", "MORTGAGE_AND_FINANCING_TOOLS", ["CALCULATION_TOOL", "GENERIC_SOURCE_CLASS"], ["CALCULATION_TOOL"], [], ["FINANCING_OPERATIONS", "BUYER_INTELLIGENCE"], "Calculator and affordability illustration class; not evidence authority.", "UNKNOWN", "LICENSING_UNCERTAINTY", "INVENTORY_CONTEXT_ONLY", "UNKNOWN"),

  portal("Zillow"), portal("Redfin"), portal("Realtor.com"), portal("Homes.com"), portal("Google Maps"), portal("Google Street View"),

  entry("Cloud CMA", "PROFESSIONAL_RESEARCH_AND_ANALYTICS_TOOLS", ["SOFTWARE_TOOL", "COMMERCIAL_VENDOR"], ["OPERATIONAL_TOOL", "CALCULATION_TOOL"], ["MARKET_INTELLIGENCE"], ["SELLER_INTELLIGENCE"], "CMA workflow and presentation tool context", "SUBSCRIPTION", "CONTRACTUAL_LOCK_IN", "INVENTORY_CONTEXT_ONLY", "OPERATIONAL_TOOL_ONLY"),
  entry("Realtors Property Resource", "PROFESSIONAL_RESEARCH_AND_ANALYTICS_TOOLS", ["COMMERCIAL_VENDOR", "AGGREGATOR"], ["AGGREGATOR"], ["MARKET_INTELLIGENCE", "COMMUNITY_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Membership-governed research platform context", "MEMBERSHIP_INCLUDED", "MEMBERSHIP_DEPENDENCY", "COMMERCIAL_REVIEW_REQUIRED"),
  entry("Remine", "PROFESSIONAL_RESEARCH_AND_ANALYTICS_TOOLS", ["COMMERCIAL_VENDOR", "AGGREGATOR"], ["AGGREGATOR"], ["MARKET_INTELLIGENCE"], ["SELLER_INTELLIGENCE", "LEAD_GENERATION"], "Commercial research and prospecting context", "SUBSCRIPTION", "CONTRACTUAL_LOCK_IN", "COMMERCIAL_REVIEW_REQUIRED"),
  entry("InfoSparks", "PROFESSIONAL_RESEARCH_AND_ANALYTICS_TOOLS", ["COMMERCIAL_VENDOR", "AGGREGATOR"], ["AGGREGATOR"], ["MARKET_INTELLIGENCE"], ["EXECUTIVE_INTELLIGENCE"], "Market analytics platform context", "SUBSCRIPTION", "CONTRACTUAL_LOCK_IN", "COMMERCIAL_REVIEW_REQUIRED"),
  entry("ShowingTime MarketStats", "PROFESSIONAL_RESEARCH_AND_ANALYTICS_TOOLS", ["COMMERCIAL_VENDOR", "AGGREGATOR"], ["AGGREGATOR"], ["MARKET_INTELLIGENCE"], ["EXECUTIVE_INTELLIGENCE"], "Market statistics platform context", "SUBSCRIPTION", "CONTRACTUAL_LOCK_IN", "COMMERCIAL_REVIEW_REQUIRED"),
  entry("CoreLogic platform class", "PROFESSIONAL_RESEARCH_AND_ANALYTICS_TOOLS", ["COMMERCIAL_VENDOR", "AGGREGATOR"], ["AGGREGATOR"], ["MARKET_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE", "TITLE_OPERATIONS"], "Commercial property, title, market, and analytics platform class", "ENTERPRISE_CONTRACT", "CONTRACTUAL_LOCK_IN", "COMMERCIAL_REVIEW_REQUIRED"),
  entry("Black Knight analytics class", "PROFESSIONAL_RESEARCH_AND_ANALYTICS_TOOLS", ["COMMERCIAL_VENDOR", "AGGREGATOR"], ["AGGREGATOR"], ["MARKET_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Commercial analytics platform class", "ENTERPRISE_CONTRACT", "CONTRACTUAL_LOCK_IN", "COMMERCIAL_REVIEW_REQUIRED"),
  entry("ATTOM Data", "PROFESSIONAL_RESEARCH_AND_ANALYTICS_TOOLS", ["COMMERCIAL_VENDOR", "AGGREGATOR"], ["AGGREGATOR"], ["MARKET_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE", "LEAD_GENERATION"], "Commercial data provider context", "ENTERPRISE_CONTRACT", "CONTRACTUAL_LOCK_IN", "COMMERCIAL_REVIEW_REQUIRED"),

  entry("Investment-analysis tool class", "INVESTMENT_RESEARCH", ["CALCULATION_TOOL", "GENERIC_SOURCE_CLASS"], ["CALCULATION_TOOL"], ["MARKET_INTELLIGENCE", "ECONOMIC_INTELLIGENCE"], ["BUYER_INTELLIGENCE"], "Investment calculations and assumptions class", "UNKNOWN", "LICENSING_UNCERTAINTY", "INVENTORY_CONTEXT_ONLY"),
  entry("Opportunity Zone authority/source class", "INVESTMENT_RESEARCH", ["GOVERNMENT_AGENCY", "GENERIC_SOURCE_CLASS"], ["PRIMARY_PUBLISHER"], ["ECONOMIC_INTELLIGENCE"], ["DEVELOPMENT_INTELLIGENCE"], "Opportunity Zone source class; authority and jurisdiction must be explicit before use.", "UNKNOWN", "FRESHNESS_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED", "POTENTIAL_PRIMARY_SOURCE"),
  entry("Short-term-rental regulation source class", "INVESTMENT_RESEARCH", ["GOVERNMENT_AGENCY", "GENERIC_SOURCE_CLASS"], ["PRIMARY_PUBLISHER"], ["ECONOMIC_INTELLIGENCE", "COMMUNITY_INTELLIGENCE"], ["GENERAL_RESEARCH"], "Short-term-rental regulation class; jurisdiction instance required.", "UNKNOWN", "JURISDICTION_FRAGMENTATION", "GOVERNANCE_REVIEW_REQUIRED"),
  entry("Rental-licensing source class", "INVESTMENT_RESEARCH", ["GOVERNMENT_AGENCY", "GENERIC_SOURCE_CLASS"], ["PRIMARY_PUBLISHER"], ["ECONOMIC_INTELLIGENCE", "COMMUNITY_INTELLIGENCE"], ["PROPERTY_INTELLIGENCE"], "Rental-licensing source class; jurisdiction instance required.", "UNKNOWN", "JURISDICTION_FRAGMENTATION", "GOVERNANCE_REVIEW_REQUIRED"),
] as const);

export const GIS_SPRINT_3_PROVIDER_OVERLAPS = Object.freeze([
  overlap("GIS-S3-OVERLAP-LISTING", ["ires-mls", "coloproperty-com"], "LISTING_DATA", "Listing data may overlap but roles and rights differ."),
  overlap("GIS-S3-OVERLAP-PUBLIC-RECORDS", ["ires-public-records", "county-assessor-source-class", "titlepro247"], "PUBLIC_RECORDS", "Public-record facts may overlap across distributor, office, and commercial aggregator contexts."),
  overlap("GIS-S3-OVERLAP-GIS-ASSESSOR", ["boulder-county-gis", "boulder-county-assessor"], "PARCEL_OR_GIS", "Parcel and ownership layers may overlap but authority and update cadence differ."),
] as const);

export function certifyGisSprint3ProviderInventoryScenarios(): Readonly<Record<string, GisProviderInventoryScenarioResult>> {
  const byId = new Map(GIS_SPRINT_3_PROVIDER_INVENTORY.map((candidate) => [candidate.inventoryEntryId, candidate]));
  const scenarioA = byId.get("boulder-county-gis");
  const scenarioB = byId.get("attom-data");
  const scenarioC = byId.get("showingtime");
  const scenarioD = byId.get("zillow");
  const scenarioE = byId.get("county-assessor-source-class");
  const scenarioF = byId.get("greatschools");
  const scenarioH = byId.get("u-s-census-bureau");
  const rejected = { ...byId.get("google-street-view")!, governanceDisposition: "REJECTED" as const, rejectionReason: "Fixture rejection: customer-facing imagery source cannot be used without separate rights and technical review." };
  const stale = { ...byId.get("realtors-property-resource")!, verificationState: "HISTORICAL_OR_POSSIBLY_STALE" as const, lastVerifiedDate: null };
  const allScenariosValid = [
    scenarioA?.governanceDisposition === "GOVERNANCE_REVIEW_REQUIRED",
    scenarioB?.governanceDisposition === "COMMERCIAL_REVIEW_REQUIRED",
    scenarioC?.sourcePreference === "OPERATIONAL_TOOL_ONLY",
    scenarioD?.sourcePreference === "RESEARCH_REFERENCE_ONLY",
    scenarioE?.entityTypes.includes("GENERIC_SOURCE_CLASS") && scenarioE.jurisdiction === null,
    scenarioF?.licensingClassification === "UNKNOWN",
    validateGisProviderOverlap(GIS_SPRINT_3_PROVIDER_OVERLAPS[0], GIS_SPRINT_3_PROVIDER_INVENTORY.map((candidate) => candidate.inventoryEntryId)).length === 0,
    scenarioH?.governanceDisposition === "APPROVED_FOR_FUTURE_PROVIDER_EVALUATION" && Object.values(scenarioH.activation).every((value) => value === false),
    validateGisProviderInventoryEntry(rejected).filter((failure) => failure !== "LICENSING_UNKNOWN_FAIL_CLOSED" && failure !== "PERMITTED_USE_UNKNOWN_FAIL_CLOSED").length === 0,
    stale.verificationState === "HISTORICAL_OR_POSSIBLY_STALE",
  ].every(Boolean);
  if (!allScenariosValid) throw new Error("GIS Sprint 3 provider inventory scenario certification failed.");

  return Object.freeze({
    scenarioA: "GOVERNED_PROVIDER_INVENTORY_ENTRY",
    scenarioB: "COMMERCIAL_REVIEW_REQUIRED",
    scenarioC: "OPERATIONAL_TOOL_ONLY",
    scenarioD: "RESEARCH_REFERENCE_ONLY",
    scenarioE: "JURISDICTION_INSTANCE_REQUIRED_BEFORE_ACTIVATION",
    scenarioF: "FAILED_CLOSED_LICENSING_UNKNOWN",
    scenarioG: "OVERLAP_PRESERVED_NOT_EQUIVALENT",
    scenarioH: "APPROVED_FOR_FUTURE_PROVIDER_EVALUATION",
    scenarioI: "REJECTED_WITH_REASON_RETAINED",
    scenarioJ: "VERIFICATION_REQUIRED",
  });
}

export function gisSprint3ProviderInventoryFingerprint(): string {
  return stableGisEvidenceFingerprint({
    summary: deterministicProviderInventorySummary(GIS_SPRINT_3_PROVIDER_INVENTORY, GIS_SPRINT_3_PROVIDER_OVERLAPS),
    scenarios: certifyGisSprint3ProviderInventoryScenarios(),
  });
}

function entry(
  name: string,
  category: GisProviderInventoryCategory,
  entityTypes: readonly GisProviderInventoryEntityType[],
  roles: readonly GisProviderInventoryRole[],
  gisDomains: readonly GeographicIntelligenceDomainId[],
  nonGis: readonly GisProviderInventoryEntry["potentialNonGisReieRelevance"][number][],
  notes: string,
  cost: GisProviderInventoryEntry["costClassification"],
  risk: GisProviderRisk,
  disposition: GisProviderInventoryEntry["governanceDisposition"],
  preference: GisProviderInventoryEntry["sourcePreference"] = "UNASSESSED",
  jurisdiction: string | null = null,
): GisProviderInventoryEntry {
  const id = slug(name);
  return Object.freeze({
    inventoryEntryId: id,
    canonicalName: name,
    alternateNames: Object.freeze([]),
    category,
    entityTypes: Object.freeze(entityTypes),
    providerRoles: Object.freeze(roles),
    sourceOrDatasetIdentities: Object.freeze([`${id}-source-context`]),
    publisherIdentity: null,
    originatingAuthorityIdentity: roles.includes("ORIGINATING_AUTHORITY") ? id : null,
    jurisdiction,
    geographicCoverageType: jurisdiction ? "COUNTY" : coverageFor(category),
    knownCoverageDescription: jurisdiction ?? "Coverage not verified; inventory context only.",
    potentialGisDomainRelevance: Object.freeze(gisDomains),
    potentialNonGisReieRelevance: Object.freeze(nonGis),
    outsideGisSprint3DirectOwnership: nonGis.length > 0 && gisDomains.length === 0,
    potentialEvidenceCategories: Object.freeze([notes]),
    operationalCapabilities: roles.includes("OPERATIONAL_TOOL") ? Object.freeze([notes]) : Object.freeze([]),
    acquisitionMethodPossibilities: Object.freeze(["UNKNOWN"] as const),
    licensingClassification: "UNKNOWN",
    permittedUse: "UNKNOWN",
    licensingVerificationState: "INVENTORY_DOCUMENT_ONLY",
    authorityClassification: roles.includes("ORIGINATING_AUTHORITY") ? "GOVERNMENTAL" : "UNKNOWN",
    freshnessExpectation: "UNKNOWN",
    updateCadence: "UNKNOWN",
    costClassification: cost,
    accountOrMembershipRequired: cost === "MEMBERSHIP_INCLUDED" || cost === "SUBSCRIPTION" || cost === "ENTERPRISE_CONTRACT" ? "UNKNOWN" : "UNKNOWN",
    contractRequired: cost === "ENTERPRISE_CONTRACT" || cost === "SUBSCRIPTION" ? "UNKNOWN" : "UNKNOWN",
    authenticationRequired: "UNKNOWN",
    attributionRequired: "UNKNOWN",
    dependencyRisks: Object.freeze([risk, "LICENSING_UNCERTAINTY", "TECHNICAL_ACCESS_UNCERTAINTY"] as const),
    duplicationOrOverlapReferences: Object.freeze([]),
    sourcePreference: preference,
    governanceDisposition: disposition,
    verificationState: "INVENTORY_DOCUMENT_ONLY",
    lastVerifiedDate: null,
    classificationEvidence: Object.freeze([GIS_SPRINT_3_CANONICAL_INVENTORY_SOURCE]),
    rejectionReason: null,
    notes,
    internalOnly: true,
    activation: GIS_FAIL_CLOSED_ACTIVATION,
    customerDisplayAuthorized: false,
    redistributionAuthorized: false,
  });
}

function sourceClass(
  name: string,
  category: GisProviderInventoryCategory,
  entityTypes: readonly GisProviderInventoryEntityType[],
  roles: readonly GisProviderInventoryRole[],
  gisDomains: readonly GeographicIntelligenceDomainId[],
  nonGis: readonly GisProviderInventoryEntry["potentialNonGisReieRelevance"][number][],
  notes: string,
  jurisdiction: string | null = null,
): GisProviderInventoryEntry {
  return entry(name, category, entityTypes, roles, gisDomains, nonGis, notes, "UNKNOWN", "JURISDICTION_FRAGMENTATION", jurisdiction ? "GOVERNANCE_REVIEW_REQUIRED" : "GOVERNANCE_REVIEW_REQUIRED", jurisdiction ? "POTENTIAL_PRIMARY_SOURCE" : "UNASSESSED", jurisdiction);
}

function portal(name: string): GisProviderInventoryEntry {
  return entry(name, "CONSUMER_RESEARCH_SITES", ["CONSUMER_PORTAL"], ["CONSUMER_PORTAL", "SUPPLEMENTAL_RESEARCH_SOURCE"], ["COMMUNITY_INTELLIGENCE", "LIFESTYLE_INTELLIGENCE"], ["SEARCH_PRESENTATION", "GENERAL_RESEARCH"], "Consumer research portal context only; no scraping, ingestion, display, or redistribution authorization.", "UNKNOWN", "LICENSING_UNCERTAINTY", "GOVERNANCE_REVIEW_REQUIRED", "RESEARCH_REFERENCE_ONLY");
}

function overlap(overlapId: string, ids: readonly string[], category: GisProviderOverlap["overlapCategory"], notes: string): GisProviderOverlap {
  return Object.freeze({
    overlapId,
    involvedInventoryEntryIds: Object.freeze(ids),
    overlapCategory: category,
    potentialDuplicatedEvidenceClass: category,
    authorityDifference: "Unresolved authority differences retained.",
    coverageDifference: "Coverage may differ and is not inferred as equivalent.",
    temporalDifference: "Freshness and update cadence require future verification.",
    licensingDifference: "Licensing and permitted use remain unknown.",
    unresolved: true,
    equivalent: false,
    notes,
    internalOnly: true,
  });
}

function coverageFor(category: GisProviderInventoryCategory): GisProviderInventoryEntry["geographicCoverageType"] {
  if (category.includes("COUNTY") || category === "GIS_AND_PARCEL_MAPPING") return "COUNTY";
  if (category === "DEMOGRAPHIC_ECONOMIC_EMPLOYMENT_AND_SCHOOL_RESEARCH" || category === "ENVIRONMENTAL_AND_RISK_DATA") return "VARIABLE";
  if (category === "MLS_SYSTEMS_AND_PRIMARY_LISTING_DATA" || category === "MARKET_STATISTICS") return "REGIONAL";
  return "UNKNOWN";
}

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const GIS_SPRINT_3_CANONICAL_CATEGORY_COUNT = 16;
export const GIS_SPRINT_3_ALL_GIS_DOMAINS = allGisDomains;

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/fixtures/gisSprint3ProviderInventoryFixtures.ts
