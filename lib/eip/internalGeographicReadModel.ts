import {
  executeEipSprint1InternalPersistenceProof,
  validateEipSprint1InternalRecord,
  type EipSprint1InternalRecord,
  type EipSprint1MappingEligibility,
  type EipSprint1TrustState,
} from "./internalGeographicPersistenceProof.js";
import type { GioAuthorizedObjectType } from "../gio/persistence.js";
import type { GkcKnowledgeClassification, GkcSourceClass } from "../gkc/fixtureGovernance.js";

export const EIP_SPRINT_2_READ_MODEL_VERSION = "EIP_1.0_SPRINT_2_INTERNAL_GEOGRAPHIC_READ_MODEL_V1";
export const EIP_SPRINT_2_RETRIEVAL_TIMESTAMP = "2026-07-25T00:00:00.000Z";

export type EipSprint2RetrievalStatus = "FOUND" | "NOT_FOUND" | "RESTRICTED_INTERNAL_ONLY";

export type EipSprint2IntelligenceDomain =
  | "GEOGRAPHIC_IDENTITY"
  | "GEOGRAPHIC_ALIAS"
  | "GEOGRAPHIC_BOUNDARY"
  | "GEOGRAPHIC_MARKET_CONTEXT"
  | "GEOGRAPHIC_EDITORIAL_CONTEXT";

export type EipSprint2Confidence = "INSUFFICIENT" | "LOW" | "MEDIUM" | "HIGH";
export type EipSprint2Freshness = "FRESH" | "AGING" | "STALE" | "UNKNOWN" | "NOT_APPLICABLE";

export type EipSprint2InternalGeographicView = Readonly<{
  identity: {
    id: string;
    objectType: GioAuthorizedObjectType;
    canonicalName: string;
    displayName: string;
    canonicalSlug: string;
  };
  classification: {
    knowledgeClassification: GkcKnowledgeClassification;
    intelligenceDomain: EipSprint2IntelligenceDomain;
  };
  trust: {
    trustState: EipSprint1TrustState;
    authority: "INTERNAL_PROOF_ONLY" | "REQUIRES_AUTHORITY_REVIEW" | "CONFLICT_PRESERVED" | "EDITORIAL_ONLY";
    confidence: EipSprint2Confidence;
    freshness: EipSprint2Freshness;
  };
  source: {
    sourceClass: GkcSourceClass;
    sourceAsset: string;
    repositoryLocation: string;
    sourceValue: string;
    sourceRequirementResult: string;
  };
  governance: {
    lifecycle: EipSprint1InternalRecord["lifecycle"]["status"];
    eligibility: EipSprint1InternalRecord["eligibility"];
    reviewStatus: EipSprint1InternalRecord["classification"]["reviewStatus"];
    mappingEligibility: EipSprint1MappingEligibility;
    editorialSeparationEnforced: true;
    restrictedKnowledgeInternalOnly: true;
    noCustomerRetrievalPath: true;
    noSearchVisibility: true;
    noMapVisibility: true;
    noSeoVisibility: true;
    noPageVisibility: true;
    noRuntimeActivation: true;
    noPersistenceMutation: true;
  };
  relationships: {
    aliases: readonly string[];
    relatedObjects: readonly string[];
    relatedObservations: readonly string[];
  };
  metadata: {
    internalVersion: typeof EIP_SPRINT_2_READ_MODEL_VERSION;
    retrievalTimestamp: typeof EIP_SPRINT_2_RETRIEVAL_TIMESTAMP;
    retrievalStatus: EipSprint2RetrievalStatus;
    sourceDecisionId: string;
    sourceQueueItemId: string;
    sourcePreviewRecordId: string;
  };
}>;

export type EipSprint2ReadModelResult = Readonly<{
  retrievalStatus: EipSprint2RetrievalStatus;
  result: EipSprint2InternalGeographicView | null;
}>;

export type EipSprint2ObjectTypeResult = Readonly<{
  retrievalStatus: EipSprint2RetrievalStatus;
  objectType: GioAuthorizedObjectType;
  results: readonly EipSprint2InternalGeographicView[];
}>;

export type EipSprint2InternalGeographicReadModel = Readonly<{
  listAll(): readonly EipSprint2InternalGeographicView[];
  retrieveByInternalId(id: string): EipSprint2ReadModelResult;
  retrieveByCanonicalName(canonicalName: string): EipSprint2ReadModelResult;
  retrieveByAlias(alias: string): EipSprint2ReadModelResult;
  retrieveByObjectType(objectType: GioAuthorizedObjectType): EipSprint2ObjectTypeResult;
}>;

export function createEipSprint2InternalGeographicReadModel(
  records: readonly EipSprint1InternalRecord[] = executeEipSprint1InternalPersistenceProof().retrieved,
): EipSprint2InternalGeographicReadModel {
  const views = Object.freeze(records.map(toReadModelView));
  const byId = indexOne(views, (view) => view.identity.id);
  const byCanonicalName = indexMany(views, (view) => normalizeLookupKey(view.identity.canonicalName));
  const byAlias = indexAliases(views);

  return Object.freeze({
    listAll: () => views,
    retrieveByInternalId: (id: string) => resultFor(byId.get(id)),
    retrieveByCanonicalName: (canonicalName: string) => resultFor(firstFor(byCanonicalName, normalizeLookupKey(canonicalName))),
    retrieveByAlias: (alias: string) => resultFor(firstFor(byAlias, normalizeLookupKey(alias))),
    retrieveByObjectType: (objectType: GioAuthorizedObjectType) => {
      const results = views.filter((view) => view.identity.objectType === objectType);
      return Object.freeze({
        retrievalStatus: results.length > 0 ? "FOUND" as const : "NOT_FOUND" as const,
        objectType,
        results: Object.freeze(results),
      });
    },
  });
}

export function toReadModelView(record: EipSprint1InternalRecord): EipSprint2InternalGeographicView {
  validateEipSprint1InternalRecord(record);

  const view: EipSprint2InternalGeographicView = {
    identity: {
      id: record.internalPersistenceId,
      objectType: record.identity.objectType,
      canonicalName: record.identity.canonicalName,
      displayName: record.identity.canonicalName,
      canonicalSlug: record.identity.canonicalSlug,
    },
    classification: {
      knowledgeClassification: record.classification.gkcClassification,
      intelligenceDomain: intelligenceDomainFor(record),
    },
    trust: {
      trustState: record.trust.trustState,
      authority: authorityFor(record),
      confidence: confidenceFor(record),
      freshness: freshnessFor(record),
    },
    source: {
      sourceClass: record.classification.sourceClass,
      sourceAsset: record.source.sourceAsset,
      repositoryLocation: record.source.repositoryLocation,
      sourceValue: record.source.sourceValue,
      sourceRequirementResult: record.source.sourceRequirementResult,
    },
    governance: {
      lifecycle: record.lifecycle.status,
      eligibility: Object.freeze({ ...record.eligibility }),
      reviewStatus: record.classification.reviewStatus,
      mappingEligibility: record.mapping.mappingEligibility,
      editorialSeparationEnforced: true as const,
      restrictedKnowledgeInternalOnly: true as const,
      noCustomerRetrievalPath: true as const,
      noSearchVisibility: true as const,
      noMapVisibility: true as const,
      noSeoVisibility: true as const,
      noPageVisibility: true as const,
      noRuntimeActivation: true as const,
      noPersistenceMutation: true as const,
    },
    relationships: {
      aliases: aliasesFor(record),
      relatedObjects: relatedObjectsFor(record),
      relatedObservations: relatedObservationsFor(record),
    },
    metadata: {
      internalVersion: EIP_SPRINT_2_READ_MODEL_VERSION,
      retrievalTimestamp: EIP_SPRINT_2_RETRIEVAL_TIMESTAMP,
      retrievalStatus: "FOUND" as const,
      sourceDecisionId: record.sourceDecisionId,
      sourceQueueItemId: record.sourceQueueItemId,
      sourcePreviewRecordId: record.sourcePreviewRecordId,
    },
  };

  validateEipSprint2ReadModelView(view);
  return Object.freeze(view);
}

export function validateEipSprint2ReadModelView(view: EipSprint2InternalGeographicView): void {
  if (view.metadata.internalVersion !== EIP_SPRINT_2_READ_MODEL_VERSION) throw new Error("Unsupported Sprint 2 read-model version");
  if (view.metadata.retrievalTimestamp !== EIP_SPRINT_2_RETRIEVAL_TIMESTAMP) throw new Error("Sprint 2 retrieval timestamp must be deterministic");
  if (view.metadata.retrievalStatus !== "FOUND") throw new Error("Materialized read-model views must have FOUND status");
  if (view.governance.lifecycle !== "INTERNAL_PROOF_ONLY") throw new Error("Read model cannot expose non-internal lifecycle");
  if (!view.governance.editorialSeparationEnforced) throw new Error("Read model must enforce editorial separation");
  if (!view.governance.restrictedKnowledgeInternalOnly) throw new Error("Restricted knowledge must remain internal");
  if (!view.governance.noCustomerRetrievalPath) throw new Error("Read model cannot create customer retrieval paths");
  if (!view.governance.noSearchVisibility || !view.governance.noMapVisibility || !view.governance.noSeoVisibility || !view.governance.noPageVisibility) {
    throw new Error("Read model cannot expose search, map, SEO, or page visibility");
  }
  if (!view.governance.noRuntimeActivation) throw new Error("Read model cannot activate runtime consumption");
  if (!view.governance.noPersistenceMutation) throw new Error("Read model cannot mutate persistence");
  if (view.governance.eligibility.customerEligible) throw new Error("Read model cannot activate customer eligibility");
  if (view.governance.eligibility.searchEligible || view.governance.eligibility.mapEligible || view.governance.eligibility.publicPageEligible || view.governance.eligibility.indexingEligible) {
    throw new Error("Read model cannot activate runtime eligibility");
  }
  if (view.governance.eligibility.propertyEnrichment) throw new Error("Read model cannot activate property consumption");
  if (view.classification.knowledgeClassification === "EDITORIAL_KNOWLEDGE" && view.trust.authority !== "EDITORIAL_ONLY") {
    throw new Error("Editorial knowledge must retain editorial-only authority");
  }
  if (view.classification.knowledgeClassification === "RESTRICTED_KNOWLEDGE" && view.governance.restrictedKnowledgeInternalOnly !== true) {
    throw new Error("Restricted knowledge must remain internal-only");
  }
}

function resultFor(view: EipSprint2InternalGeographicView | undefined): EipSprint2ReadModelResult {
  if (!view) {
    return Object.freeze({
      retrievalStatus: "NOT_FOUND" as const,
      result: null,
    });
  }

  return Object.freeze({
    retrievalStatus: view.classification.knowledgeClassification === "RESTRICTED_KNOWLEDGE" ? "RESTRICTED_INTERNAL_ONLY" as const : "FOUND" as const,
    result: view,
  });
}

function indexOne(
  views: readonly EipSprint2InternalGeographicView[],
  keyFor: (view: EipSprint2InternalGeographicView) => string,
): ReadonlyMap<string, EipSprint2InternalGeographicView> {
  const index = new Map<string, EipSprint2InternalGeographicView>();
  for (const view of views) {
    const key = keyFor(view);
    if (index.has(key)) throw new Error(`Duplicate read-model key: ${key}`);
    index.set(key, view);
  }
  return index;
}

function indexMany(
  views: readonly EipSprint2InternalGeographicView[],
  keyFor: (view: EipSprint2InternalGeographicView) => string,
): ReadonlyMap<string, readonly EipSprint2InternalGeographicView[]> {
  const index = new Map<string, EipSprint2InternalGeographicView[]>();
  for (const view of views) {
    const key = keyFor(view);
    index.set(key, [...(index.get(key) ?? []), view].sort((left, right) => left.identity.id.localeCompare(right.identity.id)));
  }
  return index;
}

function indexAliases(views: readonly EipSprint2InternalGeographicView[]): ReadonlyMap<string, readonly EipSprint2InternalGeographicView[]> {
  const index = new Map<string, EipSprint2InternalGeographicView[]>();
  for (const view of views) {
    for (const alias of view.relationships.aliases) {
      const key = normalizeLookupKey(alias);
      index.set(key, [...(index.get(key) ?? []), view].sort((left, right) => left.identity.id.localeCompare(right.identity.id)));
    }
  }
  return index;
}

function firstFor(
  index: ReadonlyMap<string, readonly EipSprint2InternalGeographicView[]>,
  key: string,
): EipSprint2InternalGeographicView | undefined {
  return index.get(key)?.[0];
}

function normalizeLookupKey(value: string): string {
  return value.trim().toLocaleLowerCase("en-US").replace(/\s+/g, " ");
}

function intelligenceDomainFor(record: EipSprint1InternalRecord): EipSprint2IntelligenceDomain {
  if (record.classification.gkcClassification === "EDITORIAL_KNOWLEDGE") return "GEOGRAPHIC_EDITORIAL_CONTEXT";
  if (record.mapping.mappingEligibility === "ALIAS_CANDIDATE_ONLY" || record.mapping.mappingEligibility === "DUPLICATE_CANDIDATE_ONLY") return "GEOGRAPHIC_ALIAS";
  if (record.mapping.mappingEligibility === "DEFERRED") return "GEOGRAPHIC_BOUNDARY";
  if (record.identity.objectType === "MARKET_AREA") return "GEOGRAPHIC_MARKET_CONTEXT";
  return "GEOGRAPHIC_IDENTITY";
}

function authorityFor(record: EipSprint1InternalRecord): EipSprint2InternalGeographicView["trust"]["authority"] {
  if (record.classification.gkcClassification === "EDITORIAL_KNOWLEDGE") return "EDITORIAL_ONLY";
  if (record.classification.gkcClassification === "RESTRICTED_KNOWLEDGE") return "CONFLICT_PRESERVED";
  if (record.trust.trustState === "REQUIRES_AUTHORITATIVE_SOURCE" || record.trust.trustState === "DEFERRED_BOUNDARY") {
    return "REQUIRES_AUTHORITY_REVIEW";
  }
  return "INTERNAL_PROOF_ONLY";
}

function confidenceFor(record: EipSprint1InternalRecord): EipSprint2Confidence {
  if (record.trust.trustState === "TRUST_VALIDATED_FOR_INTERNAL_PROOF") return "MEDIUM";
  if (record.trust.trustState === "REQUIRES_AUTHORITATIVE_SOURCE") return "LOW";
  if (record.trust.trustState === "CONFLICT_PRESERVED") return "LOW";
  if (record.trust.trustState === "EDITORIAL_ONLY_RESTRICTED") return "INSUFFICIENT";
  return "LOW";
}

function freshnessFor(record: EipSprint1InternalRecord): EipSprint2Freshness {
  if (record.classification.gkcClassification === "EDITORIAL_KNOWLEDGE") return "NOT_APPLICABLE";
  if (record.trust.trustState === "DEFERRED_BOUNDARY") return "UNKNOWN";
  return "FRESH";
}

function aliasesFor(record: EipSprint1InternalRecord): readonly string[] {
  const aliases = new Set<string>();
  aliases.add(record.source.sourceValue);
  if (record.source.sourceValue !== record.identity.canonicalName) aliases.add(record.identity.canonicalName);
  if (record.mapping.mappingEligibility === "ALIAS_CANDIDATE_ONLY") aliases.add(`alias:${record.source.sourceValue}`);
  if (record.mapping.mappingEligibility === "DUPLICATE_CANDIDATE_ONLY") aliases.add(`duplicate:${record.source.sourceValue}`);
  return Object.freeze([...aliases]);
}

function relatedObjectsFor(record: EipSprint1InternalRecord): readonly string[] {
  const related = new Set<string>();
  if (record.mapping.ambiguity !== "NONE") related.add(`ambiguity:${record.mapping.ambiguity}`);
  if (record.mapping.conflict !== "NONE") related.add(`conflict:${record.mapping.conflict}`);
  return Object.freeze([...related]);
}

function relatedObservationsFor(record: EipSprint1InternalRecord): readonly string[] {
  return Object.freeze([
    record.sourceDecisionId,
    record.sourceQueueItemId,
    record.sourcePreviewRecordId,
  ]);
}
