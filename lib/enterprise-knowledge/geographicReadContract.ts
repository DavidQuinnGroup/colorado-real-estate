export const ENTERPRISE_GEOGRAPHIC_READ_CONTRACT_VERSION = "ENTERPRISE_GEOGRAPHIC_READ_CONTRACT_V1";
export const ENTERPRISE_GEOGRAPHIC_READ_CERTIFIED_SUBJECT_ID = "cms10utak0002qa0l8mu7gr8i";

export type EnterpriseGeographicReadOperation = "object-id" | "canonical-name" | "alias" | "aggregate" | "health";
export type EnterpriseGeographicReadStatus = "HEALTHY" | "DEGRADED" | "INCOMPLETE" | "CONFLICT" | "NOT_FOUND" | "NOT_AUTHORIZED" | "INVARIANT_VIOLATION";

export type EnterpriseGeographicReadRequest = Readonly<{
  operation: EnterpriseGeographicReadOperation;
  objectId?: string;
  canonicalName?: string;
  alias?: string;
  requestId?: string;
}>;

export type EnterpriseGeographicReadSource = (request: EnterpriseGeographicReadRequest) => Promise<EnterpriseGeographicReadResult>;

export type EnterpriseGeographicReadResult = Readonly<{
  success: boolean;
  module: string;
  version: string;
  authorization: string;
  mode: "read";
  operation: EnterpriseGeographicReadOperation;
  executed: false;
  writesPerformed: 0;
  requestId: string | null;
  retrievalTimestamp: string;
  status: EnterpriseGeographicReadStatus;
  requiredRecords: Readonly<Record<string, number>>;
  foundRecords: Readonly<Record<string, number>>;
  warnings: readonly string[];
  blockingFailures: readonly string[];
  invariantResults: {
    canonicalIdentity: boolean;
    eligibility: boolean;
    relationships: boolean;
    rowCounts: boolean;
    authorizedLookup: boolean;
    noActivation: boolean;
  };
  resolution: {
    requestedValue: string | null;
    resolvedBy: EnterpriseGeographicReadOperation;
    resolvedObjectId: string | null;
  };
  aggregate: EnterpriseGeographicReadAggregate | null;
}>;

export type EnterpriseGeographicReadAggregate = Readonly<{
  identity: {
    governedObjectId: string;
    objectType: string;
    canonicalName: string;
    displayName: string;
    canonicalSlug: string;
    canonicalIdentityState: "CERTIFIED_SINGLETON";
    lifecycleState: string;
    visibility: string;
  };
  aliases: readonly {
    aliasId: string;
    aliasValue: string;
    normalizedValue: string;
    aliasType: string;
    canonicalAssociation: string;
    lifecycleState: string;
    language: string | null;
    sourceId: string | null;
    effectiveDate: string | null;
    confidenceMetadata: "CERTIFIED_BY_SPRINT_6_PILOT";
  }[];
  sources: readonly {
    sourceId: string;
    sourceIdentity: string;
    sourceClass: string;
    authority: string;
    accessMethod: string;
    updateCadence: string;
    licensingRestriction: boolean;
    publicDisplayRestriction: boolean;
    healthState: string;
    verificationMetadata: "CERTIFIED_BY_SPRINT_6_PILOT";
  }[];
  observations: readonly {
    observationId: string;
    schemaKey: string | null;
    observationKey: string;
    governedValue: unknown;
    knowledgeClassification: string;
    confidence: string;
    freshness: string;
    derivationMethod: string;
    sourceReference: string | null;
    effectiveDate: string | null;
    retrievedAt: string | null;
    verifiedAt: string | null;
    internalOnly: boolean;
    reviewStatus: string;
  }[];
  eligibility: {
    eligibilityId: string;
    internalUse: boolean;
    searchEligibility: boolean;
    mapEligibility: boolean;
    publicPageEligibility: boolean;
    indexingEligibility: boolean;
    propertyEnrichment: boolean;
    marketAnalytics: boolean;
    allActivationFlagsFalse: boolean;
  };
  relationships: {
    geographicRelationshipCount: 0;
    propertyGeographicRelationshipCount: 0;
  };
  governance: {
    persistedLineage: unknown;
    governedExternalLineage: {
      sprint3QualityState: "READY";
      sprint4ReadinessReference: string;
      sprint5ApprovalReference: string;
      sprint6AuthorizationReference: string;
      sprint6CertificationStatus: string;
      sprint6A1CertificationStatus: string;
      sourceGmaLineage: string;
    };
    productionPilotVersion: string;
    adapterVersion: string;
    retrievalTimestamp: string;
  };
  activation: {
    runtime: false;
    customer: false;
    search: false;
    map: false;
    publicPage: false;
    indexing: false;
    analytics: false;
    ai: false;
    propertyRelationship: false;
  };
}>;

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/enterprise-knowledge/geographicReadContract.ts
