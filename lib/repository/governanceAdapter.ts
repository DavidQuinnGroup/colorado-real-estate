import "server-only";

import crypto from "node:crypto";

import { Prisma } from "@prisma/client";
import type {
  EIAConfidence,
  EIAEnvironment,
  EIAFreshness,
  EIAKpiObservation,
  EIAKpiEvaluation,
} from "@prisma/client";

import {
  createEIAPersistenceRepository,
} from "@/lib/enterprise-kpi/persistence";
import {
  evaluateKpi,
  getEnterpriseKpi,
  type KpiObservation,
} from "@/lib/enterprise-kpi";
import { prisma } from "@/lib/prisma";
import { getCoverageReport } from "@/lib/repository/intelligence";
import {
  getRepositoryHealth,
  repositorySupabase,
  type RepositoryHealthSummary,
} from "@/lib/repository/server";

export const REPOSITORY_GOVERNANCE_ADAPTER_ID = "REPOSITORY_GOVERNANCE";
export const REPOSITORY_GOVERNANCE_ADAPTER_NAME = "Repository Governance Adapter";
export const REPOSITORY_GOVERNANCE_ADAPTER_VERSION = "1.0.0";
export const REPOSITORY_GOVERNANCE_CALCULATION_VERSION =
  "EIA-1.0-repository-governance-adapter-v1";

type AdapterStatus =
  | "SUCCESS"
  | "PARTIAL"
  | "UNAVAILABLE"
  | "UNAUTHORIZED"
  | "STALE"
  | "INCOMPLETE"
  | "INVALID"
  | "SCHEMA_MISMATCH"
  | "SOURCE_CONFLICT"
  | "PERSISTENCE_FAILURE";

type RepositoryObjectHealthRow = {
  id: string;
  rid: string;
  family: string;
  has_governing_authority: boolean;
  has_active_steward: boolean;
  has_relationships: boolean;
  platform_traceability_ok: boolean;
  capability_lineage_ok: boolean;
};

type RepositoryObjectVersionRow = {
  id: string;
  rid: string;
  updated_at: string;
};

type RepositoryGovernanceSourceState = {
  health: RepositoryHealthSummary;
  objectHealth: RepositoryObjectHealthRow[];
  objectVersions: RepositoryObjectVersionRow[];
  governanceExceptionCount: number;
  coverageOverall: {
    governance_pct: number | null;
    stewardship_pct: number | null;
    relationship_pct: number | null;
    traceability_pct: number | null;
  };
  platformTraceabilityPct: number | null;
};

type AdapterObservationPlan = {
  kpiId: "KPI-GOV-001" | "KPI-GOV-002" | "KPI-GOV-003";
  displayName: string;
  unit: "PERCENT";
  value: number | null;
  unavailableReason?: string;
  sourceRecords: string[];
  formula: string;
  freshness: EIAFreshness;
  confidence: EIAConfidence;
  validation: AdapterStatus;
  persistedObservation?: EIAKpiObservation;
  persistedEvaluation?: EIAKpiEvaluation;
};

export type RepositoryGovernanceAdapterResult = {
  adapter: {
    id: typeof REPOSITORY_GOVERNANCE_ADAPTER_ID;
    name: typeof REPOSITORY_GOVERNANCE_ADAPTER_NAME;
    version: typeof REPOSITORY_GOVERNANCE_ADAPTER_VERSION;
    sourceSystem: "Enterprise Repository";
    reliability: "AUTHORITATIVE";
    owner: "PROJECT ATLAS Executive Architecture";
    steward: "Enterprise Architecture Office";
  };
  invocationId: string;
  mode: "DRY_RUN" | "EXECUTE";
  startedAt: string;
  completedAt: string;
  environment: EIAEnvironment;
  sourceStatus: AdapterStatus;
  validationStatus: AdapterStatus;
  persistenceStatus: AdapterStatus;
  overallStatus: AdapterStatus;
  sourceStateFingerprint: string;
  sourceEffectiveAt: string;
  observationWindow: {
    start: string;
    end: string;
  };
  observationsAttempted: number;
  observationsPersisted: number;
  observationsDeduplicated: number;
  observationsUnavailable: number;
  validationFailures: string[];
  persistenceFailures: string[];
  unsupportedKpis: Array<{
    requestedMetric: string;
    reason: string;
  }>;
  observations: AdapterObservationPlan[];
};

function currentEnvironment(): EIAEnvironment {
  if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") return "PRODUCTION";
  if (process.env.VERCEL_ENV === "preview") return "PREVIEW";
  if (process.env.NODE_ENV === "test") return "TEST";
  if (process.env.NODE_ENV === "development") return "DEVELOPMENT";
  return "UNKNOWN";
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function fingerprintRepositoryGovernanceSourceState(
  state: RepositoryGovernanceSourceState,
): string {
  return crypto
    .createHash("sha256")
    .update(
      stableJson({
        health: state.health,
        objectHealth: [...state.objectHealth].sort((left, right) => left.rid.localeCompare(right.rid)),
        objectVersions: [...state.objectVersions].sort((left, right) => left.rid.localeCompare(right.rid)),
        governanceExceptionCount: state.governanceExceptionCount,
        coverageOverall: state.coverageOverall,
        platformTraceabilityPct: state.platformTraceabilityPct,
      }),
    )
    .digest("hex");
}

function sourceEffectiveAt(rows: RepositoryObjectVersionRow[]) {
  const latest = rows
    .map((row) => new Date(row.updated_at).getTime())
    .filter((time) => Number.isFinite(time))
    .sort((left, right) => right - left)[0];
  return new Date(latest ?? Date.now());
}

function confidenceFor(value: number | null, source: RepositoryGovernanceSourceState): EIAConfidence {
  if (value === null) return "INSUFFICIENT";
  if (source.objectHealth.length === 0 || source.health.total_objects === 0) return "INSUFFICIENT";
  if (source.objectHealth.length !== source.health.total_objects) return "MEDIUM";
  return "HIGH";
}

function freshnessFor(sourceTime: Date, now: Date): EIAFreshness {
  const ageHours = (now.getTime() - sourceTime.getTime()) / 3_600_000;
  if (ageHours <= 24) return "FRESH";
  if (ageHours <= 168) return "STALE";
  return "STALE";
}

function statusForPlan(plan: AdapterObservationPlan): KpiObservation["provenance"] {
  return plan.value === null ? "DEFINED_ONLY" : "LIVE_INTERNAL";
}

function toEifObservation(plan: AdapterObservationPlan, observedAt: string): KpiObservation {
  return {
    kpiId: plan.kpiId,
    value: plan.value,
    observedAt,
    provenance: statusForPlan(plan),
    sourceAvailability: plan.value === null ? "DEFINED_BUT_UNAVAILABLE" : "LIVE_AVAILABLE",
    note: plan.unavailableReason ?? `${REPOSITORY_GOVERNANCE_ADAPTER_NAME} live observation.`,
  };
}

async function readSourceState(): Promise<RepositoryGovernanceSourceState> {
  const [
    health,
    coverage,
    { data: objectHealth, error: objectHealthError },
    { data: objectVersions, error: objectVersionError },
    { count: governanceExceptionCount, error: exceptionError },
  ] = await Promise.all([
    getRepositoryHealth(),
    getCoverageReport(),
    repositorySupabase
      .from("repository_object_health")
      .select(
        "id,rid,family,has_governing_authority,has_active_steward,has_relationships,platform_traceability_ok,capability_lineage_ok",
      ),
    repositorySupabase.from("repository_object").select("id,rid,updated_at"),
    repositorySupabase
      .from("repository_governance_exception_candidates")
      .select("object_id", { count: "exact", head: true }),
  ]);

  for (const [label, error] of [
    ["repository_object_health", objectHealthError],
    ["repository_object", objectVersionError],
    ["repository_governance_exception_candidates", exceptionError],
  ] as const) {
    if (error) throw new Error(`Unable to read ${label}: ${error.message}`);
  }

  const platform = coverage.by_family.find((item) => item.key === "PLAT");

  return {
    health,
    objectHealth: (objectHealth ?? []) as unknown as RepositoryObjectHealthRow[],
    objectVersions: (objectVersions ?? []) as unknown as RepositoryObjectVersionRow[],
    governanceExceptionCount: governanceExceptionCount ?? 0,
    coverageOverall: coverage.overall,
    platformTraceabilityPct: platform?.traceability_pct ?? null,
  };
}

function mapObservations(source: RepositoryGovernanceSourceState, freshness: EIAFreshness): AdapterObservationPlan[] {
  return [
    {
      kpiId: "KPI-GOV-001",
      displayName: "Repository Governance Coverage",
      unit: "PERCENT",
      value: source.health.governance_completeness_pct,
      sourceRecords: ["repository_health_summary.governance_completeness_pct"],
      formula: "governed repository objects / total repository objects",
      freshness,
      confidence: confidenceFor(source.health.governance_completeness_pct, source),
      validation: source.health.governance_completeness_pct === null ? "INCOMPLETE" : "SUCCESS",
      unavailableReason: source.health.governance_completeness_pct === null ? "Repository health summary did not provide governance coverage." : undefined,
    },
    {
      kpiId: "KPI-GOV-002",
      displayName: "Stewardship Coverage",
      unit: "PERCENT",
      value: source.health.stewardship_completeness_pct,
      sourceRecords: ["repository_health_summary.stewardship_completeness_pct"],
      formula: "repository objects with steward / total repository objects",
      freshness,
      confidence: confidenceFor(source.health.stewardship_completeness_pct, source),
      validation: source.health.stewardship_completeness_pct === null ? "INCOMPLETE" : "SUCCESS",
      unavailableReason: source.health.stewardship_completeness_pct === null ? "Repository health summary did not provide stewardship coverage." : undefined,
    },
    {
      kpiId: "KPI-GOV-003",
      displayName: "Platform Traceability Coverage",
      unit: "PERCENT",
      value: source.platformTraceabilityPct,
      sourceRecords: ["repository_object_health family=PLAT traceability_pct"],
      formula: "traceable platform assets / total platform assets",
      freshness,
      confidence: confidenceFor(source.platformTraceabilityPct, source),
      validation: source.platformTraceabilityPct === null ? "INCOMPLETE" : "SUCCESS",
      unavailableReason: source.platformTraceabilityPct === null ? "No PLAT family traceability coverage was available." : undefined,
    },
  ];
}

export async function invokeRepositoryGovernanceAdapter(options: {
  execute: boolean;
  invocationId?: string;
  now?: Date;
}): Promise<RepositoryGovernanceAdapterResult> {
  const started = options.now ?? new Date();
  const invocationId =
    options.invocationId ??
    `RGOV-${started.toISOString().replace(/[-:.]/g, "").slice(0, 15)}-${crypto.randomUUID().slice(0, 8)}`;
  const environment = currentEnvironment();
  const validationFailures: string[] = [];
  const persistenceFailures: string[] = [];
  const source = await readSourceState();
  const effectiveAt = sourceEffectiveAt(source.objectVersions);
  const freshness = freshnessFor(effectiveAt, started);
  const sourceStateFingerprint = fingerprintRepositoryGovernanceSourceState(source);
  const observations = mapObservations(source, freshness);
  const unavailable = observations.filter((item) => item.value === null).length;

  for (const plan of observations) {
    if (!getEnterpriseKpi(plan.kpiId)) {
      validationFailures.push(`Canonical KPI not found: ${plan.kpiId}`);
    }
  }

  let persisted = 0;
  let deduplicated = 0;

  if (options.execute && validationFailures.length === 0) {
    try {
      const persistence = createEIAPersistenceRepository(prisma);
      const provenance = await persistence.createProvenance({
        sourceSystem: "Enterprise Repository",
        sourceType: "repository_governance_adapter_invocation",
        sourceRecordId: invocationId,
        sourceQueryRef:
          "repository_health_summary + repository_object_health + repository_object + repository_governance_exception_candidates",
        observationAt: effectiveAt,
        processedAt: started,
        environment,
        dataOrigin: "LIVE",
        calculationVersion: REPOSITORY_GOVERNANCE_CALCULATION_VERSION,
        repositoryVersion: sourceStateFingerprint,
        confidence: observations.every((item) => item.confidence === "HIGH") ? "HIGH" : "MEDIUM",
        freshness,
        privacy: "SYSTEM",
        sensitivity: "INTERNAL",
        retention: "AUDIT",
        creatingAppVersion: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_APP_VERSION ?? "LOCAL",
      });

      const evidence = await persistence.upsertEvidenceReference({
        evidenceKey: `EIA-EVD-${REPOSITORY_GOVERNANCE_ADAPTER_ID}-${sourceStateFingerprint}`,
        evidenceType: "REPOSITORY_GOVERNANCE_SOURCE_STATE",
        title: "Repository governance source-state fingerprint",
        sourceSystem: "Enterprise Repository",
        sourceQueryRef:
          "repository_health_summary + repository_object_health + repository_object + repository_governance_exception_candidates",
        observedAt: effectiveAt,
        contentHash: sourceStateFingerprint,
        provenanceId: provenance.id,
        environment,
        dataOrigin: "LIVE",
        confidence: "HIGH",
        freshness,
        privacy: "SYSTEM",
        sensitivity: "INTERNAL",
        retention: "AUDIT",
      });

      for (const plan of observations) {
        const before = await prisma.eIAKpiObservation.findFirst({
          where: {
            kpiId: plan.kpiId,
            environment,
            dataOrigin: "LIVE",
            calculationVersion: REPOSITORY_GOVERNANCE_CALCULATION_VERSION,
          },
          orderBy: { createdAt: "desc" },
        });
        const observation = await persistence.upsertKpiObservation({
          environment,
          dataOrigin: "LIVE",
          kpiId: plan.kpiId,
          value:
            plan.value === null
              ? { kind: "UNAVAILABLE", unavailableReason: plan.unavailableReason ?? "Live repository value unavailable." }
              : { kind: "NUMERIC", numericValue: new Prisma.Decimal(plan.value) },
          unit: plan.unit,
          periodStart: effectiveAt,
          periodEnd: effectiveAt,
          observedAt: effectiveAt,
          status: plan.value === null ? "UNKNOWN" : evaluateKpi(getEnterpriseKpi(plan.kpiId)!, toEifObservation(plan, effectiveAt.toISOString()), started).status,
          calculationVersion: REPOSITORY_GOVERNANCE_CALCULATION_VERSION,
          provenanceId: provenance.id,
          confidence: plan.confidence,
          freshness: plan.freshness,
          privacy: "INTERNAL",
          sensitivity: "INTERNAL",
          retention: "HISTORICAL",
          sourceStateFingerprint,
        });
        const evaluation = evaluateKpi(
          getEnterpriseKpi(plan.kpiId)!,
          toEifObservation(plan, effectiveAt.toISOString()),
          started,
        );
        const persistedEvaluation = await persistence.upsertKpiEvaluation({
          environment,
          dataOrigin: "LIVE",
          kpiId: plan.kpiId,
          observationId: observation.id,
          status: evaluation.status,
          includedInHealth: evaluation.includedInHealth,
          exclusionReason: evaluation.exclusionReason ?? undefined,
          calculationVersion: REPOSITORY_GOVERNANCE_CALCULATION_VERSION,
          thresholdVersion: getEnterpriseKpi(plan.kpiId)?.effectiveVersion,
          evaluatedAt: started,
          provenanceId: provenance.id,
          confidence: plan.confidence,
          freshness: plan.freshness,
          privacy: "INTERNAL",
          sensitivity: "INTERNAL",
          retention: "HISTORICAL",
          sourceStateFingerprint,
        });
        await persistence.linkEvidence({
          evidenceId: evidence.id,
          entityType: "EIAKpiObservation",
          entityId: observation.id,
          relationship: "SUPPORTS",
        });
        await persistence.linkEvidence({
          evidenceId: evidence.id,
          entityType: "EIAKpiEvaluation",
          entityId: persistedEvaluation.id,
          relationship: "SUPPORTS",
        });
        plan.persistedObservation = observation;
        plan.persistedEvaluation = persistedEvaluation;
        if (before?.id === observation.id) {
          deduplicated += 1;
        } else {
          persisted += 1;
        }
      }
    } catch (error) {
      persistenceFailures.push(error instanceof Error ? error.message : "Unknown persistence failure.");
    }
  }

  const completed = new Date();
  const persistenceStatus: AdapterStatus =
    persistenceFailures.length > 0 ? "PERSISTENCE_FAILURE" : options.execute ? "SUCCESS" : "SUCCESS";
  const validationStatus: AdapterStatus = validationFailures.length > 0 ? "INVALID" : unavailable > 0 ? "PARTIAL" : "SUCCESS";
  const overallStatus: AdapterStatus =
    persistenceStatus === "PERSISTENCE_FAILURE"
      ? "PERSISTENCE_FAILURE"
      : validationStatus === "INVALID"
        ? "INVALID"
        : unavailable > 0
          ? "PARTIAL"
          : "SUCCESS";

  return {
    adapter: {
      id: REPOSITORY_GOVERNANCE_ADAPTER_ID,
      name: REPOSITORY_GOVERNANCE_ADAPTER_NAME,
      version: REPOSITORY_GOVERNANCE_ADAPTER_VERSION,
      sourceSystem: "Enterprise Repository",
      reliability: "AUTHORITATIVE",
      owner: "PROJECT ATLAS Executive Architecture",
      steward: "Enterprise Architecture Office",
    },
    invocationId,
    mode: options.execute ? "EXECUTE" : "DRY_RUN",
    startedAt: started.toISOString(),
    completedAt: completed.toISOString(),
    environment,
    sourceStatus: "SUCCESS",
    validationStatus,
    persistenceStatus,
    overallStatus,
    sourceStateFingerprint,
    sourceEffectiveAt: effectiveAt.toISOString(),
    observationWindow: {
      start: effectiveAt.toISOString(),
      end: effectiveAt.toISOString(),
    },
    observationsAttempted: observations.length,
    observationsPersisted: persisted,
    observationsDeduplicated: deduplicated,
    observationsUnavailable: unavailable,
    validationFailures,
    persistenceFailures,
    unsupportedKpis: [
      {
        requestedMetric: "Governance Exception Count",
        reason: "No canonical EIF KPI ID exists in the current registry.",
      },
      {
        requestedMetric: "Governance Recovery Rate",
        reason: "No canonical EIF KPI ID or governed formula exists in the current registry.",
      },
      {
        requestedMetric: "Missing Steward Count",
        reason: "No canonical EIF KPI ID exists in the current registry.",
      },
      {
        requestedMetric: "Relationship Completeness %",
        reason: "Repository source exists, but no canonical EIF KPI ID exists in the current registry.",
      },
      {
        requestedMetric: "Broken Relationship Count",
        reason: "No canonical EIF KPI ID or governed formula exists in the current registry.",
      },
      {
        requestedMetric: "Platform Traceability Gap Count",
        reason: "Repository source exists, but no canonical count KPI exists in the current registry.",
      },
      {
        requestedMetric: "Repository Health Score / Risk Level",
        reason: "Repository health source exists, but no canonical EIF KPI ID or governed scoring/risk formula exists.",
      },
    ],
    observations,
  };
}

export async function inspectRepositoryGovernanceAdapter() {
  const environment = currentEnvironment();
  const observations = await prisma.eIAKpiObservation.findMany({
    where: {
      environment,
      dataOrigin: "LIVE",
      kpiId: { in: ["KPI-GOV-001", "KPI-GOV-002", "KPI-GOV-003"] },
      archivedAt: null,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return {
    adapterId: REPOSITORY_GOVERNANCE_ADAPTER_ID,
    adapterVersion: REPOSITORY_GOVERNANCE_ADAPTER_VERSION,
    environment,
    latestLiveObservationCount: observations.length,
    latestLiveObservations: observations.map((item) => ({
      id: item.id,
      kpiId: item.kpiId,
      valueKind: item.valueKind,
      numericValue: item.numericValue?.toString() ?? null,
      status: item.status,
      observedAt: item.observedAt?.toISOString() ?? null,
      freshness: item.freshness,
      confidence: item.confidence,
      dataOrigin: item.dataOrigin,
      idempotencyKey: item.idempotencyKey,
    })),
    manualInvocationOnly: true,
    publicExposure: false,
  };
}
