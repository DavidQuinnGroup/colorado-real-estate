export const EIA_PERSISTENCE_SCHEMA_VERSION = "EIA-1.0-wave-1-schema-v1";
export const EIA_PERSISTENCE_DOMAIN_MODEL_VERSION = "EIA-1.0-persistence-foundation-v1";
export const EIA_PERSISTENCE_CREATING_SERVICE = "PROJECT_ATLAS_EIA_PERSISTENCE_FOUNDATION";
export function assertExplicitClassification(scope) {
    if (!scope.environment || !scope.dataOrigin) {
        throw new Error("EIA persistence requires explicit environment and data-origin classification.");
    }
    if (scope.dataOrigin === "FIXTURE" && (!scope.fixtureSet || !scope.fixtureScenario)) {
        throw new Error("Fixture records require fixtureSet and fixtureScenario.");
    }
    if (scope.dataOrigin !== "FIXTURE" && (scope.fixtureSet || scope.fixtureScenario)) {
        throw new Error("Fixture metadata is only valid for FIXTURE records.");
    }
}
export function assertNoMixedAggregation(scopes) {
    const origins = new Set(scopes.map((scope) => scope.dataOrigin));
    if (origins.has("FIXTURE") && origins.size > 1) {
        throw new Error("EIA persistence prohibits mixed fixture/live aggregation by default.");
    }
}
export function buildKpiObservationIdempotencyKey(input) {
    assertExplicitClassification(input);
    return [
        "EIA-KPI-OBS",
        input.environment,
        input.dataOrigin,
        input.fixtureSet ?? "NO_FIXTURE_SET",
        input.fixtureScenario ?? "NO_FIXTURE_SCENARIO",
        input.kpiId,
        input.periodStart?.toISOString() ?? "NO_PERIOD_START",
        input.periodEnd?.toISOString() ?? "NO_PERIOD_END",
        input.observedAt?.toISOString() ?? "NO_OBSERVED_AT",
        input.sourceStateFingerprint ?? "NO_SOURCE_STATE",
        input.calculationVersion,
    ].join("|");
}
export function buildKpiEvaluationIdempotencyKey(input) {
    assertExplicitClassification(input);
    return [
        "EIA-KPI-EVAL",
        input.environment,
        input.dataOrigin,
        input.fixtureSet ?? "NO_FIXTURE_SET",
        input.fixtureScenario ?? "NO_FIXTURE_SCENARIO",
        input.kpiId,
        input.observationId,
        input.sourceStateFingerprint ?? "NO_SOURCE_STATE",
        input.calculationVersion,
        input.thresholdVersion ?? "NO_THRESHOLD_VERSION",
    ].join("|");
}
export function createEIAPersistenceRepository(prisma) {
    return {
        async createProvenance(input) {
            assertExplicitClassification(input);
            return prisma.eIAProvenance.create({
                data: {
                    sourceSystem: input.sourceSystem,
                    sourceType: input.sourceType,
                    sourceRecordId: input.sourceRecordId,
                    sourceQueryRef: input.sourceQueryRef,
                    observationAt: input.observationAt,
                    processedAt: input.processedAt,
                    environment: input.environment,
                    dataOrigin: input.dataOrigin,
                    fixtureSet: input.fixtureSet,
                    fixtureScenario: input.fixtureScenario,
                    calculationVersion: input.calculationVersion,
                    schemaVersion: EIA_PERSISTENCE_SCHEMA_VERSION,
                    domainModelVersion: EIA_PERSISTENCE_DOMAIN_MODEL_VERSION,
                    canonVersion: input.canonVersion,
                    repositoryVersion: input.repositoryVersion,
                    confidence: input.confidence,
                    freshness: input.freshness,
                    privacy: input.privacy,
                    sensitivity: input.sensitivity,
                    pii: input.pii ?? "NONE",
                    retention: input.retention,
                    creatingService: EIA_PERSISTENCE_CREATING_SERVICE,
                    creatingAppVersion: input.creatingAppVersion,
                    immutability: "APPEND_ONLY",
                },
            });
        },
        async upsertEvidenceReference(input) {
            assertExplicitClassification(input);
            return prisma.eIAEvidenceReference.upsert({
                where: { evidenceKey: input.evidenceKey },
                create: {
                    evidenceKey: input.evidenceKey,
                    evidenceType: input.evidenceType,
                    title: input.title,
                    sourceSystem: input.sourceSystem,
                    sourceRecordId: input.sourceRecordId,
                    sourceQueryRef: input.sourceQueryRef,
                    observedAt: input.observedAt,
                    repositoryObjectRid: input.repositoryObjectRid,
                    contentHash: input.contentHash,
                    provenanceId: input.provenanceId,
                    environment: input.environment,
                    dataOrigin: input.dataOrigin,
                    confidence: input.confidence,
                    freshness: input.freshness,
                    privacy: input.privacy,
                    sensitivity: input.sensitivity,
                    pii: input.pii ?? "NONE",
                    retention: input.retention,
                    immutability: "APPEND_ONLY",
                },
                update: {},
            });
        },
        async linkEvidence(input) {
            return prisma.eIAEvidenceLink.upsert({
                where: {
                    evidenceId_entityType_entityId_relationship: input,
                },
                create: input,
                update: {},
            });
        },
        async upsertKpiObservation(input) {
            const idempotencyKey = buildKpiObservationIdempotencyKey(input);
            const value = input.value;
            const valueData = value.kind === "NUMERIC"
                ? { valueKind: value.kind, numericValue: value.numericValue }
                : value.kind === "TEXT"
                    ? { valueKind: value.kind, textValue: value.textValue }
                    : value.kind === "BOOLEAN"
                        ? { valueKind: value.kind, booleanValue: value.booleanValue }
                        : value.kind === "RATIO"
                            ? {
                                valueKind: value.kind,
                                ratioNumerator: value.ratioNumerator,
                                ratioDenominator: value.ratioDenominator,
                            }
                            : value.kind === "DURATION"
                                ? { valueKind: value.kind, durationMs: value.durationMs }
                                : { valueKind: value.kind, unavailableReason: value.unavailableReason };
            return prisma.eIAKpiObservation.upsert({
                where: { idempotencyKey },
                create: {
                    kpiId: input.kpiId,
                    ...valueData,
                    unit: input.unit,
                    periodStart: input.periodStart,
                    periodEnd: input.periodEnd,
                    observedAt: input.observedAt,
                    status: input.status,
                    idempotencyKey,
                    calculationVersion: input.calculationVersion,
                    schemaVersion: EIA_PERSISTENCE_SCHEMA_VERSION,
                    provenanceId: input.provenanceId,
                    environment: input.environment,
                    dataOrigin: input.dataOrigin,
                    fixtureSet: input.fixtureSet,
                    fixtureScenario: input.fixtureScenario,
                    confidence: input.confidence,
                    freshness: input.freshness,
                    privacy: input.privacy,
                    sensitivity: input.sensitivity,
                    retention: input.retention,
                    immutability: "APPEND_ONLY",
                },
                update: {},
            });
        },
        async upsertKpiEvaluation(input) {
            const idempotencyKey = buildKpiEvaluationIdempotencyKey(input);
            return prisma.eIAKpiEvaluation.upsert({
                where: { idempotencyKey },
                create: {
                    kpiId: input.kpiId,
                    observationId: input.observationId,
                    status: input.status,
                    includedInHealth: input.includedInHealth,
                    exclusionReason: input.exclusionReason,
                    calculationVersion: input.calculationVersion,
                    thresholdVersion: input.thresholdVersion,
                    evaluatedAt: input.evaluatedAt,
                    idempotencyKey,
                    provenanceId: input.provenanceId,
                    environment: input.environment,
                    dataOrigin: input.dataOrigin,
                    confidence: input.confidence,
                    freshness: input.freshness,
                    privacy: input.privacy,
                    sensitivity: input.sensitivity,
                    retention: input.retention,
                    immutability: "APPEND_ONLY",
                },
                update: {},
            });
        },
        listKpiObservations(scope) {
            assertExplicitClassification(scope);
            return prisma.eIAKpiObservation.findMany({
                where: {
                    environment: scope.environment,
                    dataOrigin: scope.dataOrigin,
                    fixtureSet: scope.fixtureSet,
                    fixtureScenario: scope.fixtureScenario,
                    kpiId: scope.kpiId,
                    archivedAt: null,
                },
                orderBy: { observedAt: "desc" },
            });
        },
    };
}
export const EIA_MODEL_OWNERSHIP = [
    {
        pattern: "EIAProvenance/EIAEvidence*",
        canonicalOwner: "PROJECT ATLAS Executive Architecture",
        operationalSteward: "Enterprise Architecture Office",
        authorizedWriters: ["Governed EIA persistence services"],
        authorizedReaders: ["INTERNAL", "EXECUTIVE", "SYSTEM"],
        immutability: "APPEND_ONLY",
        retention: "AUDIT",
        privacy: "SYSTEM",
    },
    {
        pattern: "EIAKpi*/EIA*Health*",
        canonicalOwner: "PROJECT ATLAS Measurement Foundation",
        operationalSteward: "REIE Platform Operations",
        authorizedWriters: ["Governed measurement persistence services"],
        authorizedReaders: ["INTERNAL", "EXECUTIVE", "SYSTEM"],
        immutability: "IMMUTABLE_VERSIONED",
        retention: "HISTORICAL",
        privacy: "INTERNAL",
    },
    {
        pattern: "EIAIntelligence*/EIAExecutiveInsight",
        canonicalOwner: "PROJECT ATLAS Enterprise Intelligence",
        operationalSteward: "Executive Architecture Office",
        authorizedWriters: ["Governed intelligence persistence services"],
        authorizedReaders: ["EXECUTIVE", "SYSTEM"],
        immutability: "APPEND_ONLY",
        retention: "HISTORICAL",
        privacy: "EXECUTIVE",
    },
    {
        pattern: "EIADecision*",
        canonicalOwner: "PROJECT ATLAS Decision Support",
        operationalSteward: "Executive Architecture Office",
        authorizedWriters: ["Governed decision-support persistence services"],
        authorizedReaders: ["EXECUTIVE", "SYSTEM"],
        immutability: "APPEND_ONLY",
        retention: "HISTORICAL",
        privacy: "EXECUTIVE",
    },
    {
        pattern: "EIAEnterpriseInitiative/EIAImprovementAction",
        canonicalOwner: "PROJECT ATLAS Learning System",
        operationalSteward: "Enterprise Architecture Office",
        authorizedWriters: ["Governed learning persistence services"],
        authorizedReaders: ["EXECUTIVE", "SYSTEM"],
        immutability: "MUTABLE_WITH_HISTORY",
        retention: "HISTORICAL",
        privacy: "EXECUTIVE",
    },
];
