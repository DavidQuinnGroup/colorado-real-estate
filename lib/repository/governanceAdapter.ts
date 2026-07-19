import "server-only";

import type {
  EIAConfidence,
  EIAFreshness,
} from "@prisma/client";

import {
  fingerprintEnterpriseAdapterSourceState,
  inspectEnterpriseAdapter,
  invokeEnterpriseAdapter,
  type EnterpriseAdapterLifecycleConfig,
  type EnterpriseAdapterObservationPlan,
  type EnterpriseAdapterResult,
} from "@/lib/enterprise-kpi/adapterFramework";
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

type RepositoryGovernanceKpiId = "KPI-GOV-001" | "KPI-GOV-002" | "KPI-GOV-003";

type RepositoryGovernanceObservationPlan = EnterpriseAdapterObservationPlan & {
  kpiId: RepositoryGovernanceKpiId;
  unit: "PERCENT";
};

export type RepositoryGovernanceAdapterResult = EnterpriseAdapterResult & {
  adapter: {
    id: typeof REPOSITORY_GOVERNANCE_ADAPTER_ID;
    name: typeof REPOSITORY_GOVERNANCE_ADAPTER_NAME;
    version: typeof REPOSITORY_GOVERNANCE_ADAPTER_VERSION;
    sourceSystem: "Enterprise Repository";
    reliability: "AUTHORITATIVE";
    owner: "PROJECT ATLAS Executive Architecture";
    steward: "Enterprise Architecture Office";
  };
  observations: RepositoryGovernanceObservationPlan[];
};

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

async function readRepositoryGovernanceSourceState(): Promise<RepositoryGovernanceSourceState> {
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

export function fingerprintRepositoryGovernanceSourceState(
  state: RepositoryGovernanceSourceState,
): string {
  return fingerprintEnterpriseAdapterSourceState({
    health: state.health,
    objectHealth: [...state.objectHealth].sort((left, right) => left.rid.localeCompare(right.rid)),
    objectVersions: [...state.objectVersions].sort((left, right) => left.rid.localeCompare(right.rid)),
    governanceExceptionCount: state.governanceExceptionCount,
    coverageOverall: state.coverageOverall,
    platformTraceabilityPct: state.platformTraceabilityPct,
  });
}

function mapRepositoryGovernanceObservations(
  source: RepositoryGovernanceSourceState,
  freshness: EIAFreshness,
): RepositoryGovernanceObservationPlan[] {
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

const repositoryGovernanceAdapterConfig = {
  metadata: {
    id: REPOSITORY_GOVERNANCE_ADAPTER_ID,
    name: REPOSITORY_GOVERNANCE_ADAPTER_NAME,
    version: REPOSITORY_GOVERNANCE_ADAPTER_VERSION,
    sourceSystem: "Enterprise Repository",
    reliability: "AUTHORITATIVE",
    owner: "PROJECT ATLAS Executive Architecture",
    steward: "Enterprise Architecture Office",
  },
  calculationVersion: REPOSITORY_GOVERNANCE_CALCULATION_VERSION,
  invocationPrefix: "RGOV",
  sourceType: "repository_governance_adapter_invocation",
  sourceQueryRef:
    "repository_health_summary + repository_object_health + repository_object + repository_governance_exception_candidates",
  evidenceType: "REPOSITORY_GOVERNANCE_SOURCE_STATE",
  evidenceTitle: "Repository governance source-state fingerprint",
  readSourceState: readRepositoryGovernanceSourceState,
  sourceEffectiveAt: (source) => sourceEffectiveAt(source.objectVersions),
  sourceStateFingerprint: fingerprintRepositoryGovernanceSourceState,
  mapObservations: mapRepositoryGovernanceObservations,
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
} satisfies EnterpriseAdapterLifecycleConfig<RepositoryGovernanceSourceState>;

export async function invokeRepositoryGovernanceAdapter(options: {
  execute: boolean;
  invocationId?: string;
  now?: Date;
}): Promise<RepositoryGovernanceAdapterResult> {
  return invokeEnterpriseAdapter(repositoryGovernanceAdapterConfig, options) as Promise<RepositoryGovernanceAdapterResult>;
}

export async function inspectRepositoryGovernanceAdapter() {
  return inspectEnterpriseAdapter({
    metadata: repositoryGovernanceAdapterConfig.metadata,
    kpiIds: ["KPI-GOV-001", "KPI-GOV-002", "KPI-GOV-003"],
  });
}
