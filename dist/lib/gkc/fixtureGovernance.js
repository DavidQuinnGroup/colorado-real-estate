export const GKC_KNOWLEDGE_CLASSIFICATIONS = [
    "AUTHORITATIVE_FACT",
    "LICENSED_FACT",
    "ENTERPRISE_OBSERVATION",
    "EDITORIAL_KNOWLEDGE",
    "PROVISIONAL_KNOWLEDGE",
    "RESTRICTED_KNOWLEDGE",
];
export const GKC_SOURCE_CLASSES = [
    "AUTHORITATIVE_GOVERNMENT",
    "AUTHORITATIVE_INDUSTRY",
    "LICENSED_COMMERCIAL",
    "FIRST_PARTY_REIE",
    "SECONDARY_PUBLIC",
    "PARTNER_SUBMITTED",
    "USER_SUBMITTED",
];
export const GKC_FIXTURE_OBJECT_TYPES = [
    "MUNICIPALITY",
    "NEIGHBORHOOD",
    "MARKET_AREA",
    "ZIP_CODE",
    "SUBDIVISION",
];
export const GKC_CONFIDENCE_LEVELS = ["INSUFFICIENT", "LOW", "MEDIUM", "HIGH"];
export const GKC_VALUE_KINDS = ["TEXT", "NUMBER", "BOOLEAN", "JSON", "DATE"];
export const GKC_FRESHNESS_STATES = ["FRESH", "AGING", "STALE", "UNKNOWN", "NOT_APPLICABLE"];
export const GKC_REVIEW_STATES = ["PENDING_REVIEW", "REVIEWED", "CONFLICTED", "REJECTED"];
export const GKC_SAFE_ELIGIBILITY_DEFAULTS = {
    internalUse: false,
    searchEligible: false,
    mapEligible: false,
    publicPageEligible: false,
    indexingEligible: false,
    propertyEnrichment: false,
    marketAnalytics: false,
};
const classificationSet = new Set(GKC_KNOWLEDGE_CLASSIFICATIONS);
const sourceClassSet = new Set(GKC_SOURCE_CLASSES);
const objectTypeSet = new Set(GKC_FIXTURE_OBJECT_TYPES);
const confidenceRank = {
    INSUFFICIENT: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
};
export const GKC_SOURCE_FIXTURES = [
    {
        id: "synthetic-source-authoritative-government",
        synthetic: true,
        sourceClass: "AUTHORITATIVE_GOVERNMENT",
        authorityLevel: "PRIMARY",
        licensingRestricted: false,
        publicDisplayRestricted: true,
        health: "ACTIVE",
        cadence: "ANNUAL",
    },
    {
        id: "synthetic-source-authoritative-industry",
        synthetic: true,
        sourceClass: "AUTHORITATIVE_INDUSTRY",
        authorityLevel: "PRIMARY",
        licensingRestricted: true,
        publicDisplayRestricted: true,
        health: "ACTIVE",
        cadence: "DAILY",
    },
    {
        id: "synthetic-source-licensed-commercial",
        synthetic: true,
        sourceClass: "LICENSED_COMMERCIAL",
        authorityLevel: "SUPPLEMENTAL",
        licensingRestricted: true,
        publicDisplayRestricted: true,
        health: "ACTIVE",
        cadence: "MONTHLY",
    },
    {
        id: "synthetic-source-first-party-reie",
        synthetic: true,
        sourceClass: "FIRST_PARTY_REIE",
        authorityLevel: "EDITORIAL",
        licensingRestricted: false,
        publicDisplayRestricted: false,
        health: "ACTIVE",
        cadence: "EVENT_DRIVEN",
    },
    {
        id: "synthetic-source-secondary-public",
        synthetic: true,
        sourceClass: "SECONDARY_PUBLIC",
        authorityLevel: "SUPPLEMENTAL",
        licensingRestricted: false,
        publicDisplayRestricted: true,
        health: "DEGRADED",
        cadence: "UNKNOWN",
    },
    {
        id: "synthetic-source-partner-submitted",
        synthetic: true,
        sourceClass: "PARTNER_SUBMITTED",
        authorityLevel: "UNVERIFIED",
        licensingRestricted: true,
        publicDisplayRestricted: true,
        health: "PROPOSED",
        cadence: "UNKNOWN",
    },
    {
        id: "synthetic-source-user-submitted",
        synthetic: true,
        sourceClass: "USER_SUBMITTED",
        authorityLevel: "UNVERIFIED",
        licensingRestricted: false,
        publicDisplayRestricted: true,
        health: "PROPOSED",
        cadence: "UNKNOWN",
    },
];
export const GKC_SCHEMA_KEY_REGISTRY = [
    {
        key: "market.median_sale_price.v1",
        domain: "Market",
        valueKind: "NUMBER",
        applicableObjectTypes: ["MARKET_AREA", "MUNICIPALITY", "NEIGHBORHOOD", "ZIP_CODE"],
        unit: "USD",
        requiresSource: true,
        requiresEffectiveDate: true,
        freshnessPolicy: "AGING",
        confidenceFloor: "MEDIUM",
        requiresReview: true,
        publicDisplayEligibleByDefault: false,
        version: "v1",
        deprecated: false,
    },
    {
        key: "market.inventory_count.v1",
        domain: "Market",
        valueKind: "NUMBER",
        applicableObjectTypes: ["MARKET_AREA", "MUNICIPALITY", "NEIGHBORHOOD", "ZIP_CODE"],
        unit: "COUNT",
        requiresSource: true,
        requiresEffectiveDate: true,
        freshnessPolicy: "FRESH",
        confidenceFloor: "MEDIUM",
        requiresReview: true,
        publicDisplayEligibleByDefault: false,
        version: "v1",
        deprecated: false,
    },
    {
        key: "government.zoning_summary.v1",
        domain: "Government",
        valueKind: "TEXT",
        applicableObjectTypes: ["MUNICIPALITY", "SUBDIVISION"],
        unit: "NONE",
        requiresSource: true,
        requiresEffectiveDate: true,
        freshnessPolicy: "AGING",
        confidenceFloor: "HIGH",
        requiresReview: true,
        publicDisplayEligibleByDefault: false,
        version: "v1",
        deprecated: false,
    },
    {
        key: "planning.comprehensive_plan_status.v1",
        domain: "Planning and Development",
        valueKind: "JSON",
        applicableObjectTypes: ["MUNICIPALITY", "MARKET_AREA"],
        unit: "NONE",
        requiresSource: true,
        requiresEffectiveDate: true,
        freshnessPolicy: "AGING",
        confidenceFloor: "MEDIUM",
        requiresReview: true,
        publicDisplayEligibleByDefault: false,
        version: "v1",
        deprecated: false,
    },
    {
        key: "lifestyle.park_count.v1",
        domain: "Lifestyle and Recreation",
        valueKind: "NUMBER",
        applicableObjectTypes: ["MUNICIPALITY", "NEIGHBORHOOD", "MARKET_AREA"],
        unit: "COUNT",
        requiresSource: true,
        requiresEffectiveDate: true,
        freshnessPolicy: "AGING",
        confidenceFloor: "MEDIUM",
        requiresReview: true,
        publicDisplayEligibleByDefault: false,
        version: "v1",
        deprecated: false,
    },
    {
        key: "environmental.flood_context.v1",
        domain: "Environmental and Risk",
        valueKind: "JSON",
        applicableObjectTypes: ["MUNICIPALITY", "NEIGHBORHOOD", "ZIP_CODE", "SUBDIVISION"],
        unit: "NONE",
        requiresSource: true,
        requiresEffectiveDate: true,
        freshnessPolicy: "AGING",
        confidenceFloor: "HIGH",
        requiresReview: true,
        publicDisplayEligibleByDefault: false,
        version: "v1",
        deprecated: false,
    },
    {
        key: "economic.population.v1",
        domain: "Economic and Demographic",
        valueKind: "NUMBER",
        applicableObjectTypes: ["MUNICIPALITY", "ZIP_CODE", "MARKET_AREA"],
        unit: "COUNT",
        requiresSource: true,
        requiresEffectiveDate: true,
        freshnessPolicy: "AGING",
        confidenceFloor: "HIGH",
        requiresReview: true,
        publicDisplayEligibleByDefault: false,
        version: "v1",
        deprecated: false,
    },
    {
        key: "editorial.community_summary.v1",
        domain: "Editorial",
        valueKind: "TEXT",
        applicableObjectTypes: ["MUNICIPALITY", "NEIGHBORHOOD", "MARKET_AREA", "SUBDIVISION"],
        unit: "NONE",
        requiresSource: false,
        requiresEffectiveDate: false,
        freshnessPolicy: "AGING",
        confidenceFloor: "LOW",
        requiresReview: true,
        publicDisplayEligibleByDefault: false,
        version: "v1",
        deprecated: false,
    },
];
export const GKC_FIXTURE_OBJECTS = [
    {
        id: "synthetic-gio-municipality-north-table",
        synthetic: true,
        objectType: "MUNICIPALITY",
        canonicalName: "Synthetic North Table",
        canonicalSlug: "synthetic-north-table",
    },
    {
        id: "synthetic-gio-neighborhood-pine-bench",
        synthetic: true,
        objectType: "NEIGHBORHOOD",
        canonicalName: "Synthetic Pine Bench",
        canonicalSlug: "synthetic-pine-bench",
    },
    {
        id: "synthetic-gio-market-foothill-test",
        synthetic: true,
        objectType: "MARKET_AREA",
        canonicalName: "Synthetic Foothill Test Market",
        canonicalSlug: "synthetic-foothill-test-market",
    },
    {
        id: "synthetic-gio-zip-80000",
        synthetic: true,
        objectType: "ZIP_CODE",
        canonicalName: "80000",
        canonicalSlug: "80000",
    },
    {
        id: "synthetic-gio-subdivision-copper-meadow",
        synthetic: true,
        objectType: "SUBDIVISION",
        canonicalName: "Synthetic Copper Meadow",
        canonicalSlug: "synthetic-copper-meadow",
    },
];
const permittedSourceClassifications = {
    AUTHORITATIVE_GOVERNMENT: ["AUTHORITATIVE_FACT", "RESTRICTED_KNOWLEDGE"],
    AUTHORITATIVE_INDUSTRY: ["AUTHORITATIVE_FACT", "LICENSED_FACT", "RESTRICTED_KNOWLEDGE"],
    LICENSED_COMMERCIAL: ["LICENSED_FACT", "ENTERPRISE_OBSERVATION", "RESTRICTED_KNOWLEDGE"],
    FIRST_PARTY_REIE: ["ENTERPRISE_OBSERVATION", "EDITORIAL_KNOWLEDGE", "RESTRICTED_KNOWLEDGE"],
    SECONDARY_PUBLIC: ["EDITORIAL_KNOWLEDGE", "PROVISIONAL_KNOWLEDGE"],
    PARTNER_SUBMITTED: ["PROVISIONAL_KNOWLEDGE", "EDITORIAL_KNOWLEDGE", "RESTRICTED_KNOWLEDGE"],
    USER_SUBMITTED: ["PROVISIONAL_KNOWLEDGE"],
};
const sourceById = new Map(GKC_SOURCE_FIXTURES.map((source) => [source.id, source]));
const schemaKeyByKey = new Map(GKC_SCHEMA_KEY_REGISTRY.map((entry) => [entry.key, entry]));
export function assertGkcKnowledgeClassification(value) {
    if (!classificationSet.has(value)) {
        throw new Error(`Unknown GKC knowledge classification: ${value}`);
    }
}
export function assertGkcSourceClass(value) {
    if (!sourceClassSet.has(value)) {
        throw new Error(`Unknown GKC source class: ${value}`);
    }
}
export function assertGkcFixtureObjectType(value) {
    if (!objectTypeSet.has(value)) {
        throw new Error(`Unauthorized synthetic GKC fixture object type: ${value}`);
    }
}
export function normalizeGkcAliasValue(value) {
    return value
        .normalize("NFKD")
        .replace(/[‘’]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/[‐‑‒–—]/g, "-")
        .trim()
        .toLocaleLowerCase("en-US")
        .replace(/\bmt\./g, "mount")
        .replace(/\bft\./g, "fort")
        .replace(/\bst\./g, "saint")
        .replace(/\bn\./g, "north")
        .replace(/\bs\./g, "south")
        .replace(/\be\./g, "east")
        .replace(/\bw\./g, "west")
        .replace(/\s*-\s*/g, "-")
        .replace(/[^\w\s+'-]/g, "")
        .replace(/\s+/g, " ");
}
export function normalizeGkcZipAlias(value) {
    const trimmed = value.trim();
    if (/^\d{5}$/.test(trimmed) || /^\d{5}-\d{4}$/.test(trimmed)) {
        return trimmed;
    }
    throw new Error(`Invalid synthetic ZIP alias format: ${value}`);
}
export function buildGkcObjectDedupeKey(object) {
    assertGkcFixtureObjectType(object.objectType);
    return `GKC_OBJECT|${object.objectType}|${normalizeGkcAliasValue(object.canonicalSlug).replace(/\s+/g, "-")}`;
}
export function buildGkcAliasDedupeKey(alias) {
    const normalized = normalizeGkcAliasValue(alias.aliasText);
    return `GKC_ALIAS|${alias.objectId}|${normalized}|${alias.aliasType}|${alias.language ?? "und"}|${alias.deprecated ? "DEPRECATED" : "ACTIVE"}`;
}
export function buildGkcObservationDedupeKey(observation) {
    return [
        "GKC_OBSERVATION",
        observation.objectId,
        observation.schemaKey,
        observation.sourceId ?? observation.derivationIdentity ?? observation.editorialAuthor ?? "NO_SOURCE",
        observation.effectiveDate ?? "NO_EFFECTIVE_DATE",
        observation.conflictGroupKey ?? "NO_CONFLICT",
    ].join("|");
}
export function detectGkcAliasCollisions(aliases) {
    const collisions = new Map();
    for (const alias of aliases) {
        const key = `${normalizeGkcAliasValue(alias.aliasText)}|${alias.language ?? "und"}`;
        const objectIds = collisions.get(key) ?? [];
        if (!objectIds.includes(alias.objectId)) {
            objectIds.push(alias.objectId);
        }
        collisions.set(key, objectIds);
    }
    return new Map([...collisions].filter(([, objectIds]) => objectIds.length > 1));
}
export function validateGkcSourceClassification(source, classification) {
    assertGkcSourceClass(source.sourceClass);
    assertGkcKnowledgeClassification(classification);
    if (!source.synthetic) {
        throw new Error(`GKC source fixture must be synthetic: ${source.id}`);
    }
    if (source.health === "RETIRED") {
        throw new Error(`Retired synthetic source cannot support active knowledge: ${source.id}`);
    }
    if (!permittedSourceClassifications[source.sourceClass].includes(classification)) {
        throw new Error(`Source class ${source.sourceClass} cannot support ${classification}`);
    }
    if (classification === "LICENSED_FACT" && !source.licensingRestricted) {
        throw new Error("Licensed fact requires licensing metadata.");
    }
}
export function validateGkcSchemaKeyObservation(observation) {
    const schemaKey = schemaKeyByKey.get(observation.schemaKey);
    if (!schemaKey) {
        throw new Error(`Unknown GKC observation schema key: ${observation.schemaKey}`);
    }
    if (!schemaKey.applicableObjectTypes.includes(observation.objectType)) {
        throw new Error(`Schema key ${schemaKey.key} is incompatible with ${observation.objectType}`);
    }
    if (schemaKey.valueKind !== observation.valueKind) {
        throw new Error(`Invalid value kind for ${schemaKey.key}: ${observation.valueKind}`);
    }
    if (schemaKey.unit && schemaKey.unit !== "NONE" && observation.unit !== schemaKey.unit) {
        throw new Error(`Invalid unit for ${schemaKey.key}: ${observation.unit ?? "MISSING"}`);
    }
    if (schemaKey.requiresEffectiveDate && !observation.effectiveDate) {
        throw new Error(`Schema key ${schemaKey.key} requires effectiveDate`);
    }
    if (schemaKey.requiresSource && !observation.sourceId) {
        throw new Error(`Schema key ${schemaKey.key} requires sourceId`);
    }
    if (schemaKey.valueKind === "JSON" && (typeof observation.value !== "object" || observation.value === null || Array.isArray(observation.value))) {
        throw new Error(`Schema key ${schemaKey.key} requires a JSON object value`);
    }
    if (schemaKey.valueKind === "NUMBER" && typeof observation.value !== "number") {
        throw new Error(`Schema key ${schemaKey.key} requires a numeric value`);
    }
    if (schemaKey.valueKind === "TEXT" && typeof observation.value !== "string") {
        throw new Error(`Schema key ${schemaKey.key} requires a text value`);
    }
    if (confidenceRank[observation.confidence] < confidenceRank[schemaKey.confidenceFloor]) {
        throw new Error(`Observation confidence is below floor for ${schemaKey.key}`);
    }
    return schemaKey;
}
export function validateGkcSourceRequirement(observation) {
    assertGkcKnowledgeClassification(observation.classification);
    if (!observation.synthetic) {
        throw new Error(`GKC observation fixture must be synthetic: ${observation.id}`);
    }
    if (observation.sourceId) {
        const source = sourceById.get(observation.sourceId);
        if (!source) {
            throw new Error(`Unknown synthetic sourceId: ${observation.sourceId}`);
        }
        validateGkcSourceClassification(source, observation.classification);
    }
    if (observation.classification === "AUTHORITATIVE_FACT" && !observation.sourceId) {
        throw new Error("Authoritative facts require source identity.");
    }
    if (observation.classification === "LICENSED_FACT" && !observation.sourceId) {
        throw new Error("Licensed facts require source identity.");
    }
    if (observation.classification === "ENTERPRISE_OBSERVATION" && !observation.sourceId && !observation.derivationIdentity) {
        throw new Error("Enterprise observations require source or governed derivation identity.");
    }
    if (observation.classification === "EDITORIAL_KNOWLEDGE" && !observation.sourceId && !observation.editorialAuthor) {
        throw new Error("Editorial knowledge requires authorship or editorial source identity.");
    }
    if (observation.classification === "PROVISIONAL_KNOWLEDGE" && !observation.sourceId && !observation.derivationIdentity) {
        throw new Error("Provisional knowledge requires source unless marked as an internal hypothesis.");
    }
    if (observation.classification === "RESTRICTED_KNOWLEDGE" && !observation.sourceId) {
        throw new Error("Restricted knowledge requires source identity.");
    }
}
export function canActivateGkcEligibility(observation, requested) {
    validateGkcSourceRequirement(observation);
    validateGkcSchemaKeyObservation(observation);
    const asksForActivation = Object.values(requested).some((value) => value === true);
    if (!asksForActivation) {
        return true;
    }
    if (requested.internalUse === true && Object.entries(requested).every(([key, value]) => key === "internalUse" || value !== true)) {
        return true;
    }
    if (observation.classification === "RESTRICTED_KNOWLEDGE" || observation.classification === "PROVISIONAL_KNOWLEDGE") {
        return false;
    }
    if (observation.reviewStatus !== "REVIEWED") {
        return false;
    }
    if (observation.freshness === "STALE" || observation.freshness === "UNKNOWN") {
        return false;
    }
    if (observation.conflictGroupKey && observation.reviewStatus !== "REVIEWED") {
        return false;
    }
    if (observation.sourceId) {
        const source = sourceById.get(observation.sourceId);
        if (source?.publicDisplayRestricted && (requested.publicPageEligible || requested.indexingEligible)) {
            return false;
        }
    }
    return true;
}
export const GKC_OBJECT_LIFECYCLE_TRANSITIONS = {
    PROPOSED: ["ACTIVE", "ARCHIVED"],
    ACTIVE: ["LIMITED", "MERGED", "SUPERSEDED", "ARCHIVED"],
    LIMITED: ["ACTIVE", "SUPERSEDED", "ARCHIVED"],
    MERGED: ["ARCHIVED"],
    SUPERSEDED: ["ARCHIVED"],
    ARCHIVED: [],
};
export const GKC_SOURCE_LIFECYCLE_TRANSITIONS = {
    PROPOSED: ["ACTIVE", "RETIRED"],
    ACTIVE: ["DEGRADED", "RESTRICTED", "RETIRED"],
    DEGRADED: ["ACTIVE", "RESTRICTED", "RETIRED"],
    RESTRICTED: ["ACTIVE", "RETIRED"],
    RETIRED: [],
};
export const GKC_KNOWLEDGE_LIFECYCLE_TRANSITIONS = {
    PROPOSED: ["VERIFIED", "DISPUTED", "ARCHIVED"],
    VERIFIED: ["ACTIVE", "REVIEW_DUE", "DISPUTED"],
    ACTIVE: ["REVIEW_DUE", "STALE", "DISPUTED", "SUPERSEDED", "ARCHIVED"],
    REVIEW_DUE: ["ACTIVE", "STALE", "DISPUTED", "SUPERSEDED"],
    STALE: ["ACTIVE", "SUPERSEDED", "ARCHIVED"],
    DISPUTED: ["ACTIVE", "SUPERSEDED", "ARCHIVED"],
    SUPERSEDED: ["ARCHIVED"],
    ARCHIVED: [],
};
export function validateLifecycleTransition(transitions, from, to) {
    if (!transitions[from]?.includes(to)) {
        throw new Error(`Invalid lifecycle transition: ${from} -> ${to}`);
    }
}
export function resolveGkcConflictGroup(observations, preferredObservationId) {
    const preferred = observations.find((observation) => observation.id === preferredObservationId);
    if (!preferred?.conflictGroupKey) {
        throw new Error("Preferred observation must belong to a conflict group.");
    }
    const group = observations.filter((observation) => observation.conflictGroupKey === preferred.conflictGroupKey);
    if (group.length < 2) {
        throw new Error("Conflict resolution requires competing observations.");
    }
    return group;
}
export function validateNoPublicEligibilityDefaults(observations) {
    for (const observation of observations) {
        for (const [key, value] of Object.entries(observation.eligibility)) {
            if (value !== false) {
                throw new Error(`Synthetic observation ${observation.id} has unsafe eligibility default ${key}`);
            }
        }
    }
}
export function assertSyntheticFixtureId(id) {
    if (!id.startsWith("synthetic-")) {
        throw new Error(`Fixture id must be synthetic-prefixed: ${id}`);
    }
}
export function createGkcRepresentativeObservations() {
    return [
        {
            id: "synthetic-observation-market-median-price",
            synthetic: true,
            objectId: "synthetic-gio-market-foothill-test",
            objectType: "MARKET_AREA",
            schemaKey: "market.median_sale_price.v1",
            classification: "LICENSED_FACT",
            sourceId: "synthetic-source-authoritative-industry",
            valueKind: "NUMBER",
            value: 500000,
            unit: "USD",
            effectiveDate: "2026-01-01",
            freshness: "FRESH",
            confidence: "MEDIUM",
            reviewStatus: "REVIEWED",
            eligibility: { ...GKC_SAFE_ELIGIBILITY_DEFAULTS },
        },
        {
            id: "synthetic-observation-zoning-summary",
            synthetic: true,
            objectId: "synthetic-gio-municipality-north-table",
            objectType: "MUNICIPALITY",
            schemaKey: "government.zoning_summary.v1",
            classification: "RESTRICTED_KNOWLEDGE",
            sourceId: "synthetic-source-authoritative-government",
            valueKind: "TEXT",
            value: "Synthetic zoning context for governance validation only.",
            unit: "NONE",
            effectiveDate: "2026-01-01",
            freshness: "AGING",
            confidence: "HIGH",
            reviewStatus: "REVIEWED",
            eligibility: { ...GKC_SAFE_ELIGIBILITY_DEFAULTS },
        },
        {
            id: "synthetic-observation-community-summary",
            synthetic: true,
            objectId: "synthetic-gio-neighborhood-pine-bench",
            objectType: "NEIGHBORHOOD",
            schemaKey: "editorial.community_summary.v1",
            classification: "EDITORIAL_KNOWLEDGE",
            editorialAuthor: "synthetic-editorial-reviewer",
            valueKind: "TEXT",
            value: "Synthetic community summary used only for fixture validation.",
            unit: "NONE",
            freshness: "AGING",
            confidence: "LOW",
            reviewStatus: "REVIEWED",
            eligibility: { ...GKC_SAFE_ELIGIBILITY_DEFAULTS },
        },
        {
            id: "synthetic-observation-flood-context-a",
            synthetic: true,
            objectId: "synthetic-gio-zip-80000",
            objectType: "ZIP_CODE",
            schemaKey: "environmental.flood_context.v1",
            classification: "RESTRICTED_KNOWLEDGE",
            sourceId: "synthetic-source-authoritative-government",
            valueKind: "JSON",
            value: { context: "Synthetic flood context A", sourceMapVersion: "synthetic-v1" },
            unit: "NONE",
            effectiveDate: "2026-01-01",
            freshness: "AGING",
            confidence: "HIGH",
            reviewStatus: "CONFLICTED",
            conflictGroupKey: "synthetic-conflict-flood-80000",
            eligibility: { ...GKC_SAFE_ELIGIBILITY_DEFAULTS },
        },
        {
            id: "synthetic-observation-flood-context-b",
            synthetic: true,
            objectId: "synthetic-gio-zip-80000",
            objectType: "ZIP_CODE",
            schemaKey: "environmental.flood_context.v1",
            classification: "RESTRICTED_KNOWLEDGE",
            sourceId: "synthetic-source-licensed-commercial",
            valueKind: "JSON",
            value: { context: "Synthetic flood context B", sourceMapVersion: "synthetic-v2" },
            unit: "NONE",
            effectiveDate: "2026-01-01",
            freshness: "AGING",
            confidence: "HIGH",
            reviewStatus: "CONFLICTED",
            conflictGroupKey: "synthetic-conflict-flood-80000",
            eligibility: { ...GKC_SAFE_ELIGIBILITY_DEFAULTS },
        },
    ];
}
export function runGkcFixtureGovernanceValidation() {
    const checks = [];
    const observations = createGkcRepresentativeObservations();
    for (const classification of GKC_KNOWLEDGE_CLASSIFICATIONS) {
        assertGkcKnowledgeClassification(classification);
    }
    checks.push("classification registry accepted all approved classes");
    for (const source of GKC_SOURCE_FIXTURES) {
        assertSyntheticFixtureId(source.id);
        assertGkcSourceClass(source.sourceClass);
    }
    checks.push("source fixtures are synthetic and class-valid");
    for (const object of GKC_FIXTURE_OBJECTS) {
        assertSyntheticFixtureId(object.id);
        assertGkcFixtureObjectType(object.objectType);
        buildGkcObjectDedupeKey(object);
    }
    checks.push("object fixtures are synthetic and idempotent");
    for (const observation of observations) {
        assertSyntheticFixtureId(observation.id);
        validateGkcSourceRequirement(observation);
        validateGkcSchemaKeyObservation(observation);
        buildGkcObservationDedupeKey(observation);
    }
    checks.push("representative observations passed source, schema-key, and idempotency validation");
    validateNoPublicEligibilityDefaults(observations);
    checks.push("safe eligibility defaults remained false");
    resolveGkcConflictGroup(observations, "synthetic-observation-flood-context-a");
    checks.push("conflicting observations remained separately resolvable");
    return { ok: true, checks };
}
