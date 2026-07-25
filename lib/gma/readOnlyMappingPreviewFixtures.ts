import { cities as legacyCities } from "../../data/cities.js";
import { marketReports } from "../../data/marketReports.js";
import { neighborhoods as legacyNeighborhoods } from "../../data/neighborhoods.js";
import { cities as searchCities, searches } from "../../data/searchPages.js";
import { cities as primaryCities } from "../cities.js";
import { marketData } from "../marketData.js";
import { neighborhoods as primaryNeighborhoods } from "../neighborhoods.js";
import { neighborhoodPolygons } from "../neighborhoodPolygons.js";

export type ObjectType = "MUNICIPALITY" | "NEIGHBORHOOD" | "MARKET_AREA" | "ZIP_CODE" | "SUBDIVISION";
export type MappingType =
  | "IDENTITY_MAPPING"
  | "ALIAS_MAPPING"
  | "RELATIONSHIP_MAPPING"
  | "OBSERVATION_MAPPING"
  | "SOURCE_ASSOCIATION"
  | "EDITORIAL_ASSOCIATION"
  | "DEFERRED_MAPPING"
  | "REJECTED_MAPPING";
export type MappingMethod =
  | "AUTHORITATIVE_IMPORT"
  | "LICENSED_IMPORT"
  | "EXACT_NORMALIZED_MATCH"
  | "DETERMINISTIC_RULE"
  | "MANUAL_REVIEW"
  | "EDITORIAL_ASSOCIATION"
  | "LEGACY_MIGRATION";
export type Confidence = "AUTHORITATIVE" | "EXACT" | "HIGH" | "MEDIUM" | "LOW" | "UNRESOLVED" | "REJECTED";
export type Outcome =
  | "EXACT_CANONICAL_CANDIDATE"
  | "AUTHORITATIVE_CANONICAL_CANDIDATE"
  | "ALIAS_CANDIDATE"
  | "SOURCE_SPECIFIC_ALIAS"
  | "EDITORIAL_ASSOCIATION_ONLY"
  | "DUPLICATE_CANDIDATE"
  | "CONFLICTING_IDENTITY"
  | "AMBIGUOUS_OBJECT_TYPE"
  | "MANUAL_REVIEW_REQUIRED"
  | "DEFERRED"
  | "REJECTED"
  | "UNRESOLVED";

export type PreviewRecord = Readonly<{
  previewId: string;
  sourceAsset: string;
  repositoryLocation: string;
  sourceValue: string;
  sourceObjectType: ObjectType | "EDITORIAL_CONTENT" | "SEARCH_INTENT" | "PROPERTY_FIELD";
  proposedTargetObjectType: ObjectType | "EDITORIAL_ASSOCIATION" | "DEFERRED" | "REJECTED";
  proposedCanonicalName: string;
  proposedCanonicalSlug: string;
  mappingType: MappingType;
  mappingMethod: MappingMethod;
  confidence: Confidence;
  sourceClass: "FIRST_PARTY_REIE" | "LICENSED_FACT" | "PROVISIONAL_STATIC" | "EDITORIAL";
  outcome: Outcome;
  evidenceSummary: string;
  ambiguityStatus: "NONE" | "OBJECT_TYPE_AMBIGUITY" | "SOURCE_AMBIGUITY" | "BOUNDARY_AMBIGUITY";
  conflictStatus: "NONE" | "DUPLICATE" | "CONFLICT";
  editorialSeparationStatus: "PASS" | "EDITORIAL_ONLY";
  humanReviewRequirement: "NOT_REQUIRED_FOR_PREVIEW" | "REQUIRED";
  recommendedDisposition: Outcome;
  activationEligibility: "NOT_ELIGIBLE";
  notes: string;
}>;

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function previewId(prefix: string, value: string) {
  return `GMA_PREVIEW|${prefix}|${normalize(value)}`;
}

function record(input: Omit<PreviewRecord, "activationEligibility">): PreviewRecord {
  return Object.freeze({ ...input, activationEligibility: "NOT_ELIGIBLE" });
}

export function buildReadOnlyMappingPreviewRecords(): readonly PreviewRecord[] {
  const primaryCityNames = new Set(primaryCities.map((city) => city.name));
  const primaryNeighborhoodNames = new Set(primaryNeighborhoods.map((neighborhood) => neighborhood.name));
  const legacyCityNames = new Set(legacyCities.map((city) => city.name));
  const records: PreviewRecord[] = [];

  for (const city of primaryCities) {
    const ambiguousAsNeighborhood = primaryNeighborhoodNames.has(city.name);
    records.push(record({
      previewId: previewId("LIB_CITY", city.name),
      sourceAsset: "Primary city registry",
      repositoryLocation: "lib/cities.ts",
      sourceValue: city.name,
      sourceObjectType: "MUNICIPALITY",
      proposedTargetObjectType: ambiguousAsNeighborhood ? "DEFERRED" : "MUNICIPALITY",
      proposedCanonicalName: city.name,
      proposedCanonicalSlug: city.slug,
      mappingType: ambiguousAsNeighborhood ? "DEFERRED_MAPPING" : "IDENTITY_MAPPING",
      mappingMethod: "EXACT_NORMALIZED_MATCH",
      confidence: ambiguousAsNeighborhood ? "UNRESOLVED" : "EXACT",
      sourceClass: "FIRST_PARTY_REIE",
      outcome: ambiguousAsNeighborhood ? "AMBIGUOUS_OBJECT_TYPE" : "EXACT_CANONICAL_CANDIDATE",
      evidenceSummary: "Primary runtime city registry entry; source authority still requires external verification.",
      ambiguityStatus: ambiguousAsNeighborhood ? "OBJECT_TYPE_AMBIGUITY" : "NONE",
      conflictStatus: legacyCityNames.has(city.name) ? "DUPLICATE" : "NONE",
      editorialSeparationStatus: "PASS",
      humanReviewRequirement: "REQUIRED",
      recommendedDisposition: ambiguousAsNeighborhood ? "MANUAL_REVIEW_REQUIRED" : "EXACT_CANONICAL_CANDIDATE",
      notes: ambiguousAsNeighborhood ? "Same name appears as neighborhood; do not select municipality automatically." : "Canonical candidate only; not final canonical identity.",
    }));
  }

  for (const city of legacyCities) {
    records.push(record({
      previewId: previewId("LEGACY_CITY", city.name),
      sourceAsset: "Legacy city registry",
      repositoryLocation: "data/cities.ts",
      sourceValue: city.name,
      sourceObjectType: "MUNICIPALITY",
      proposedTargetObjectType: primaryCityNames.has(city.name) ? "MUNICIPALITY" : "DEFERRED",
      proposedCanonicalName: city.name,
      proposedCanonicalSlug: city.slug,
      mappingType: primaryCityNames.has(city.name) ? "ALIAS_MAPPING" : "DEFERRED_MAPPING",
      mappingMethod: "LEGACY_MIGRATION",
      confidence: primaryCityNames.has(city.name) ? "MEDIUM" : "LOW",
      sourceClass: "PROVISIONAL_STATIC",
      outcome: primaryCityNames.has(city.name) ? "ALIAS_CANDIDATE" : "MANUAL_REVIEW_REQUIRED",
      evidenceSummary: "Legacy city registry entry with optional county text; county relationship is outside this preview scope.",
      ambiguityStatus: "SOURCE_AMBIGUITY",
      conflictStatus: primaryCityNames.has(city.name) ? "DUPLICATE" : "CONFLICT",
      editorialSeparationStatus: "PASS",
      humanReviewRequirement: "REQUIRED",
      recommendedDisposition: primaryCityNames.has(city.name) ? "DUPLICATE_CANDIDATE" : "MANUAL_REVIEW_REQUIRED",
      notes: "Treat as alias/conflict input only until authoritative municipal source review.",
    }));
  }

  for (const neighborhood of primaryNeighborhoods) {
    const sameAsCity = primaryCityNames.has(neighborhood.name);
    records.push(record({
      previewId: previewId("LIB_NEIGHBORHOOD", `${neighborhood.city}-${neighborhood.name}`),
      sourceAsset: "Primary neighborhood registry",
      repositoryLocation: "lib/neighborhoods.ts",
      sourceValue: `${neighborhood.city} / ${neighborhood.name}`,
      sourceObjectType: "NEIGHBORHOOD",
      proposedTargetObjectType: sameAsCity ? "DEFERRED" : "NEIGHBORHOOD",
      proposedCanonicalName: neighborhood.name,
      proposedCanonicalSlug: neighborhood.slug,
      mappingType: sameAsCity ? "DEFERRED_MAPPING" : "IDENTITY_MAPPING",
      mappingMethod: sameAsCity ? "MANUAL_REVIEW" : "EXACT_NORMALIZED_MATCH",
      confidence: sameAsCity ? "UNRESOLVED" : "MEDIUM",
      sourceClass: "FIRST_PARTY_REIE",
      outcome: sameAsCity ? "AMBIGUOUS_OBJECT_TYPE" : "MANUAL_REVIEW_REQUIRED",
      evidenceSummary: "Primary neighborhood registry contains identity plus editorial, resilience, risk, and construction fields.",
      ambiguityStatus: sameAsCity ? "OBJECT_TYPE_AMBIGUITY" : "BOUNDARY_AMBIGUITY",
      conflictStatus: legacyNeighborhoods.some((item) => item.name === neighborhood.name) ? "DUPLICATE" : "NONE",
      editorialSeparationStatus: "PASS",
      humanReviewRequirement: "REQUIRED",
      recommendedDisposition: "MANUAL_REVIEW_REQUIRED",
      notes: "Identity can be previewed; narrative and risk fields remain editorial/restricted and cannot become observations.",
    }));
  }

  for (const neighborhood of legacyNeighborhoods) {
    records.push(record({
      previewId: previewId("LEGACY_NEIGHBORHOOD", `${neighborhood.city}-${neighborhood.name}`),
      sourceAsset: "Legacy neighborhood registry",
      repositoryLocation: "data/neighborhoods.ts",
      sourceValue: `${neighborhood.city} / ${neighborhood.name}`,
      sourceObjectType: "NEIGHBORHOOD",
      proposedTargetObjectType: "NEIGHBORHOOD",
      proposedCanonicalName: neighborhood.name,
      proposedCanonicalSlug: neighborhood.slug,
      mappingType: "ALIAS_MAPPING",
      mappingMethod: "LEGACY_MIGRATION",
      confidence: "LOW",
      sourceClass: "PROVISIONAL_STATIC",
      outcome: "DUPLICATE_CANDIDATE",
      evidenceSummary: "Legacy neighborhood fixture has price, description, and coordinates without authoritative provenance.",
      ambiguityStatus: "SOURCE_AMBIGUITY",
      conflictStatus: "DUPLICATE",
      editorialSeparationStatus: "PASS",
      humanReviewRequirement: "REQUIRED",
      recommendedDisposition: "DUPLICATE_CANDIDATE",
      notes: "Use for duplicate and alias review only; price/description/coordinates are not mapping facts.",
    }));
  }

  for (const polygon of neighborhoodPolygons) {
    records.push(record({
      previewId: previewId("NEIGHBORHOOD_POLYGON", polygon.slug),
      sourceAsset: "Neighborhood polygon fixture",
      repositoryLocation: "lib/neighborhoodPolygons.ts",
      sourceValue: polygon.name,
      sourceObjectType: "NEIGHBORHOOD",
      proposedTargetObjectType: "DEFERRED",
      proposedCanonicalName: polygon.name,
      proposedCanonicalSlug: polygon.slug,
      mappingType: "DEFERRED_MAPPING",
      mappingMethod: "MANUAL_REVIEW",
      confidence: "LOW",
      sourceClass: "PROVISIONAL_STATIC",
      outcome: "DEFERRED",
      evidenceSummary: "Approximate static polygon without source, precision, or effective date.",
      ambiguityStatus: "BOUNDARY_AMBIGUITY",
      conflictStatus: "NONE",
      editorialSeparationStatus: "PASS",
      humanReviewRequirement: "REQUIRED",
      recommendedDisposition: "DEFERRED",
      notes: "Spatial resolution is deferred by authorization; polygon cannot become a governed boundary.",
    }));
  }

  for (const market of marketData) {
    records.push(record({
      previewId: previewId("MARKET_DATA", market.slug),
      sourceAsset: "Market data backbone",
      repositoryLocation: "lib/marketData.ts",
      sourceValue: market.name,
      sourceObjectType: "MARKET_AREA",
      proposedTargetObjectType: "MARKET_AREA",
      proposedCanonicalName: market.name,
      proposedCanonicalSlug: market.slug,
      mappingType: "OBSERVATION_MAPPING",
      mappingMethod: "MANUAL_REVIEW",
      confidence: "LOW",
      sourceClass: "PROVISIONAL_STATIC",
      outcome: "MANUAL_REVIEW_REQUIRED",
      evidenceSummary: "Static market values lack source ID, license posture, effective period, and methodology.",
      ambiguityStatus: market.name.includes(market.city) ? "NONE" : "SOURCE_AMBIGUITY",
      conflictStatus: primaryCityNames.has(market.name.replace(" Housing Market", "")) ? "CONFLICT" : "NONE",
      editorialSeparationStatus: "PASS",
      humanReviewRequirement: "REQUIRED",
      recommendedDisposition: "MANUAL_REVIEW_REQUIRED",
      notes: "Market area preview only; market facts cannot become observations without source and schema-key review.",
    }));
  }

  for (const report of marketReports) {
    records.push(record({
      previewId: previewId("MARKET_REPORT", report.slug),
      sourceAsset: "Market report fixture",
      repositoryLocation: "data/marketReports.ts",
      sourceValue: report.slug,
      sourceObjectType: "MARKET_AREA",
      proposedTargetObjectType: "DEFERRED",
      proposedCanonicalName: "Boulder market report",
      proposedCanonicalSlug: report.slug,
      mappingType: "DEFERRED_MAPPING",
      mappingMethod: "LEGACY_MIGRATION",
      confidence: "LOW",
      sourceClass: "PROVISIONAL_STATIC",
      outcome: "DEFERRED",
      evidenceSummary: "Dated market fixture lacks source, geography definition, and methodology.",
      ambiguityStatus: "SOURCE_AMBIGUITY",
      conflictStatus: "NONE",
      editorialSeparationStatus: "PASS",
      humanReviewRequirement: "REQUIRED",
      recommendedDisposition: "DEFERRED",
      notes: "Potential observation source only after source and period review.",
    }));
  }

  for (const city of searchCities) {
    const displayName = city.split("-").map((part) => `${part.charAt(0).toLocaleUpperCase("en-US")}${part.slice(1)}`).join(" ");
    records.push(record({
      previewId: previewId("SEARCH_CITY", city),
      sourceAsset: "Search city registry",
      repositoryLocation: "data/searchPages.ts",
      sourceValue: city,
      sourceObjectType: "SEARCH_INTENT",
      proposedTargetObjectType: "EDITORIAL_ASSOCIATION",
      proposedCanonicalName: displayName,
      proposedCanonicalSlug: city,
      mappingType: "EDITORIAL_ASSOCIATION",
      mappingMethod: "EDITORIAL_ASSOCIATION",
      confidence: "LOW",
      sourceClass: "EDITORIAL",
      outcome: primaryCityNames.has(displayName) ? "EDITORIAL_ASSOCIATION_ONLY" : "MANUAL_REVIEW_REQUIRED",
      evidenceSummary: "Search-page city slug supports SEO/search intent, not authoritative identity.",
      ambiguityStatus: primaryCityNames.has(displayName) ? "NONE" : "SOURCE_AMBIGUITY",
      conflictStatus: primaryCityNames.has(displayName) ? "NONE" : "CONFLICT",
      editorialSeparationStatus: "EDITORIAL_ONLY",
      humanReviewRequirement: primaryCityNames.has(displayName) ? "NOT_REQUIRED_FOR_PREVIEW" : "REQUIRED",
      recommendedDisposition: primaryCityNames.has(displayName) ? "EDITORIAL_ASSOCIATION_ONLY" : "MANUAL_REVIEW_REQUIRED",
      notes: "Runtime page/search presence does not prove canonical identity.",
    }));
  }

  for (const search of searches) {
    records.push(record({
      previewId: previewId("SEARCH_INTENT", search),
      sourceAsset: "Programmatic search intent registry",
      repositoryLocation: "data/searchPages.ts",
      sourceValue: search,
      sourceObjectType: "SEARCH_INTENT",
      proposedTargetObjectType: "EDITORIAL_ASSOCIATION",
      proposedCanonicalName: search,
      proposedCanonicalSlug: search,
      mappingType: "EDITORIAL_ASSOCIATION",
      mappingMethod: "EDITORIAL_ASSOCIATION",
      confidence: "LOW",
      sourceClass: "EDITORIAL",
      outcome: "EDITORIAL_ASSOCIATION_ONLY",
      evidenceSummary: "Search intent is content taxonomy, not geographic object identity.",
      ambiguityStatus: "NONE",
      conflictStatus: "NONE",
      editorialSeparationStatus: "EDITORIAL_ONLY",
      humanReviewRequirement: "NOT_REQUIRED_FOR_PREVIEW",
      recommendedDisposition: "EDITORIAL_ASSOCIATION_ONLY",
      notes: "No GIO object target is proposed.",
    }));
  }

  return Object.freeze(records);
}

export const readOnlyMappingPreviewRecords = buildReadOnlyMappingPreviewRecords();
