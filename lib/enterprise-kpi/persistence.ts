import type {
  EIAConfidence,
  EIADataOrigin,
  EIAEnvironment,
  EIAFreshness,
  EIAImmutability,
  EIAPii,
  EIAPrivacy,
  EIARetention,
  EIASensitivity,
  Prisma,
  PrismaClient,
} from "@prisma/client";

export const EIA_PERSISTENCE_SCHEMA_VERSION = "EIA-1.0-wave-1-schema-v1";
export const EIA_PERSISTENCE_DOMAIN_MODEL_VERSION = "EIA-1.0-persistence-foundation-v1";
export const EIA_PERSISTENCE_CREATING_SERVICE = "PROJECT_ATLAS_EIA_PERSISTENCE_FOUNDATION";

export type EIAClassificationScope = {
  environment: EIAEnvironment;
  dataOrigin: EIADataOrigin;
  fixtureSet?: string;
  fixtureScenario?: string;
};

export type EIAProvenanceInput = EIAClassificationScope & {
  sourceSystem: string;
  sourceType: string;
  sourceRecordId?: string;
  sourceQueryRef?: string;
  observationAt?: Date;
  processedAt?: Date;
  calculationVersion?: string;
  canonVersion?: string;
  repositoryVersion?: string;
  confidence: EIAConfidence;
  freshness: EIAFreshness;
  privacy: EIAPrivacy;
  sensitivity: EIASensitivity;
  pii?: EIAPii;
  retention: EIARetention;
  creatingAppVersion?: string;
};

export type EIAKpiObservationInput = EIAClassificationScope & {
  kpiId: string;
  value:
    | { kind: "NUMERIC"; numericValue: Prisma.Decimal.Value }
    | { kind: "TEXT"; textValue: string }
    | { kind: "BOOLEAN"; booleanValue: boolean }
    | { kind: "RATIO"; ratioNumerator: Prisma.Decimal.Value; ratioDenominator: Prisma.Decimal.Value }
    | { kind: "DURATION"; durationMs: number }
    | { kind: "UNAVAILABLE"; unavailableReason: string };
  unit?: string;
  periodStart?: Date;
  periodEnd?: Date;
  observedAt?: Date;
  status: "HEALTHY" | "WARNING" | "CRITICAL" | "UNKNOWN" | "NOT_APPLICABLE";
  calculationVersion: string;
  provenanceId: string;
  confidence: EIAConfidence;
  freshness: EIAFreshness;
  privacy: EIAPrivacy;
  sensitivity: EIASensitivity;
  retention: EIARetention;
  sourceStateFingerprint?: string;
};

export type EIAEvidenceReferenceInput = EIAClassificationScope & {
  evidenceKey: string;
  evidenceType: string;
  title: string;
  sourceSystem: string;
  sourceRecordId?: string;
  sourceQueryRef?: string;
  observedAt?: Date;
  repositoryObjectRid?: string;
  contentHash?: string;
  provenanceId: string;
  confidence: EIAConfidence;
  freshness: EIAFreshness;
  privacy: EIAPrivacy;
  sensitivity: EIASensitivity;
  pii?: EIAPii;
  retention: EIARetention;
};

export type EIAKpiEvaluationInput = EIAClassificationScope & {
  kpiId: string;
  observationId: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL" | "UNKNOWN" | "NOT_APPLICABLE";
  includedInHealth: boolean;
  exclusionReason?: string;
  calculationVersion: string;
  thresholdVersion?: string;
  evaluatedAt: Date;
  provenanceId: string;
  confidence: EIAConfidence;
  freshness: EIAFreshness;
  privacy: EIAPrivacy;
  sensitivity: EIASensitivity;
  retention: EIARetention;
  sourceStateFingerprint?: string;
};

export function assertExplicitClassification(scope: EIAClassificationScope) {
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

export function assertNoMixedAggregation(scopes: EIAClassificationScope[]) {
  const origins = new Set(scopes.map((scope) => scope.dataOrigin));
  if (origins.has("FIXTURE") && origins.size > 1) {
    throw new Error("EIA persistence prohibits mixed fixture/live aggregation by default.");
  }
}

export function buildKpiObservationIdempotencyKey(input: EIAKpiObservationInput) {
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

export function buildKpiEvaluationIdempotencyKey(input: EIAKpiEvaluationInput) {
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

export function createEIAPersistenceRepository(prisma: PrismaClient) {
  return {
    async createProvenance(input: EIAProvenanceInput) {
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

    async upsertEvidenceReference(input: EIAEvidenceReferenceInput) {
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

    async linkEvidence(input: {
      evidenceId: string;
      entityType: string;
      entityId: string;
      relationship: string;
    }) {
      return prisma.eIAEvidenceLink.upsert({
        where: {
          evidenceId_entityType_entityId_relationship: input,
        },
        create: input,
        update: {},
      });
    },

    async upsertKpiObservation(input: EIAKpiObservationInput) {
      const idempotencyKey = buildKpiObservationIdempotencyKey(input);
      const value = input.value;
      const valueData =
        value.kind === "NUMERIC"
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

    async upsertKpiEvaluation(input: EIAKpiEvaluationInput) {
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

    listKpiObservations(scope: EIAClassificationScope & { kpiId?: string }) {
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
    immutability: "APPEND_ONLY" satisfies EIAImmutability,
    retention: "AUDIT" satisfies EIARetention,
    privacy: "SYSTEM" satisfies EIAPrivacy,
  },
  {
    pattern: "EIAKpi*/EIA*Health*",
    canonicalOwner: "PROJECT ATLAS Measurement Foundation",
    operationalSteward: "REIE Platform Operations",
    authorizedWriters: ["Governed measurement persistence services"],
    authorizedReaders: ["INTERNAL", "EXECUTIVE", "SYSTEM"],
    immutability: "IMMUTABLE_VERSIONED" satisfies EIAImmutability,
    retention: "HISTORICAL" satisfies EIARetention,
    privacy: "INTERNAL" satisfies EIAPrivacy,
  },
  {
    pattern: "EIAIntelligence*/EIAExecutiveInsight",
    canonicalOwner: "PROJECT ATLAS Enterprise Intelligence",
    operationalSteward: "Executive Architecture Office",
    authorizedWriters: ["Governed intelligence persistence services"],
    authorizedReaders: ["EXECUTIVE", "SYSTEM"],
    immutability: "APPEND_ONLY" satisfies EIAImmutability,
    retention: "HISTORICAL" satisfies EIARetention,
    privacy: "EXECUTIVE" satisfies EIAPrivacy,
  },
  {
    pattern: "EIADecision*",
    canonicalOwner: "PROJECT ATLAS Decision Support",
    operationalSteward: "Executive Architecture Office",
    authorizedWriters: ["Governed decision-support persistence services"],
    authorizedReaders: ["EXECUTIVE", "SYSTEM"],
    immutability: "APPEND_ONLY" satisfies EIAImmutability,
    retention: "HISTORICAL" satisfies EIARetention,
    privacy: "EXECUTIVE" satisfies EIAPrivacy,
  },
  {
    pattern: "EIAEnterpriseInitiative/EIAImprovementAction",
    canonicalOwner: "PROJECT ATLAS Learning System",
    operationalSteward: "Enterprise Architecture Office",
    authorizedWriters: ["Governed learning persistence services"],
    authorizedReaders: ["EXECUTIVE", "SYSTEM"],
    immutability: "MUTABLE_WITH_HISTORY" satisfies EIAImmutability,
    retention: "HISTORICAL" satisfies EIARetention,
    privacy: "EXECUTIVE" satisfies EIAPrivacy,
  },
];
