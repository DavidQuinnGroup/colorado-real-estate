import "server-only";

import { performance } from "node:perf_hooks";

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
  type EnterpriseAdapterStatus,
  type EnterpriseAdapterUnsupportedMetric,
} from "../enterprise-kpi/adapterFramework.js";

export const SEARCH_RUNTIME_ADAPTER_ID = "SEARCH_RUNTIME";
export const SEARCH_RUNTIME_ADAPTER_NAME = "Search Runtime Adapter";
export const SEARCH_RUNTIME_ADAPTER_VERSION = "1.0.0";
export const SEARCH_RUNTIME_CALCULATION_VERSION =
  "EIA-1.0-search-runtime-adapter-v1";
export const SEARCH_RUNTIME_PROBE_REGISTRY_VERSION =
  "EIA-1.0-search-runtime-probe-registry-v1";
export const SEARCH_RUNTIME_PRODUCTION_ORIGIN = "https://davidquinngroup.com";

const PROBE_TIMEOUT_MS = 10_000;
const OBSERVATION_WINDOW_MINUTES = 15;
const SEARCH_RUNTIME_FORMULA =
  "valid usable runtime executions / total eligible runtime executions × 100";

type SearchRuntimeProbeId = "BOUNDED_DEFAULT_SEARCH";
type SearchRuntimeClassification =
  | "SUCCESS"
  | "DEGRADED"
  | "FALLBACK"
  | "EMPTY_VALID"
  | "FAILED"
  | "INVALID"
  | "TIMEOUT"
  | "UNKNOWN"
  | "UNAVAILABLE";
type SearchRuntimeProviderClassification =
  | "TYPESENSE"
  | "DATABASE"
  | "UNKNOWN"
  | "UNAVAILABLE";
type SearchRuntimeResponseValidationState =
  | "VALID"
  | "VALID_INCOMPLETE"
  | "INVALID"
  | "UNAVAILABLE";

type SearchRuntimeProbe = {
  id: SearchRuntimeProbeId;
  label: string;
  method: "GET";
  path: "/api/search?limit=1";
  expectedStatuses: number[];
  timeoutMs: typeof PROBE_TIMEOUT_MS;
  enabled: true;
};

type SearchRuntimeValidation = {
  responseValidationState: SearchRuntimeResponseValidationState;
  source: "typesense" | "database" | "unknown";
  health: "healthy" | "degraded" | "unknown";
  ready: boolean | null;
  blockerCount: number | null;
  resultCount: number | null;
  returned: number | null;
  mapped: number | null;
  coordinateFiltered: number | null;
  fallbackReasonPresent: boolean;
};

type SearchRuntimeProbeResult = {
  probeId: SearchRuntimeProbeId;
  method: "GET";
  path: "/api/search?limit=1";
  expectedStatuses: number[];
  observedStatus: number | null;
  startedAt: string;
  completedAt: string;
  elapsedMs: number;
  runtimeClassification: SearchRuntimeClassification;
  providerClassification: SearchRuntimeProviderClassification;
  fallbackUsed: boolean;
  degraded: boolean;
  ready: boolean | null;
  blockerCount: number | null;
  resultCount: number | null;
  responseValidationState: SearchRuntimeResponseValidationState;
  validation: EnterpriseAdapterStatus;
  errorCategory?: "TIMEOUT" | "NETWORK_FAILURE" | "HTTP_FAILURE" | "INVALID_RESPONSE";
};

type SearchRuntimeSourceState = {
  adapterId: typeof SEARCH_RUNTIME_ADAPTER_ID;
  adapterVersion: typeof SEARCH_RUNTIME_ADAPTER_VERSION;
  productionOrigin: typeof SEARCH_RUNTIME_PRODUCTION_ORIGIN;
  probeRegistryVersion: typeof SEARCH_RUNTIME_PROBE_REGISTRY_VERSION;
  observationWindowStart: string;
  observationWindowEnd: string;
  probes: SearchRuntimeProbeResult[];
  unsupportedMetrics: EnterpriseAdapterUnsupportedMetric[];
};

type SearchRuntimeObservationPlan = EnterpriseAdapterObservationPlan & {
  kpiId: "KPI-SRCH-001";
  unit: "PERCENT";
};

type SearchRuntimeSourceSummary = {
  productionOrigin: string;
  probeRegistryVersion: string;
  observationWindow: {
    start: string;
    end: string;
  };
  runtimeHealthPct: number | null;
  probes: Array<{
    probeId: SearchRuntimeProbeId;
    path: "/api/search?limit=1";
    observedStatus: number | null;
    runtimeClassification: SearchRuntimeClassification;
    providerClassification: SearchRuntimeProviderClassification;
    fallbackUsed: boolean;
    degraded: boolean;
    ready: boolean | null;
    blockerCount: number | null;
    resultCount: number | null;
    responseValidationState: SearchRuntimeResponseValidationState;
  }>;
};

export type SearchRuntimeAdapterResult = EnterpriseAdapterResult & {
  adapter: {
    id: typeof SEARCH_RUNTIME_ADAPTER_ID;
    name: typeof SEARCH_RUNTIME_ADAPTER_NAME;
    version: typeof SEARCH_RUNTIME_ADAPTER_VERSION;
    sourceSystem: "REIE Search Runtime";
    reliability: "AUTHORITATIVE";
    owner: "REIE Platform";
    steward: "Search Platform Engineering";
  };
  sourceSummary?: SearchRuntimeSourceSummary;
  observations: SearchRuntimeObservationPlan[];
};

export const SEARCH_RUNTIME_PROBES: SearchRuntimeProbe[] = [
  {
    id: "BOUNDED_DEFAULT_SEARCH",
    label: "Bounded default public search runtime",
    method: "GET",
    path: "/api/search?limit=1",
    expectedStatuses: [200],
    timeoutMs: PROBE_TIMEOUT_MS,
    enabled: true,
  },
];

const unsupportedSearchRuntimeMetrics: EnterpriseAdapterUnsupportedMetric[] = [
  {
    requestedMetric: "Search Degraded Rate",
    reason: "UNSUPPORTED: no separate canonical governed KPI ID exists in the current registry.",
  },
  {
    requestedMetric: "Search Fallback Utilization",
    reason: "UNSUPPORTED: fallback evidence is preserved for KPI-SRCH-001 and is not a separate governed KPI.",
  },
  {
    requestedMetric: "Search Response Time",
    reason: "UNAVAILABLE: response timing is captured only as bounded probe context and is not mapped to a Search Runtime KPI.",
  },
  {
    requestedMetric: "Search Result Relevance",
    reason: "UNSUPPORTED: relevance quality is outside the Search Runtime Adapter scope.",
  },
];

function observationWindowFor(now: Date) {
  const windowMs = OBSERVATION_WINDOW_MINUTES * 60_000;
  const start = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
  const end = new Date(start.getTime() + windowMs - 1);
  return { start, end };
}

function safeProbeUrl(probe: SearchRuntimeProbe): URL {
  const url = new URL(probe.path, SEARCH_RUNTIME_PRODUCTION_ORIGIN);
  if (url.origin !== SEARCH_RUNTIME_PRODUCTION_ORIGIN) {
    throw new Error(`Probe ${probe.id} resolves outside the production origin.`);
  }
  return url;
}

function toBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function validateSearchRuntimePayload(value: unknown): SearchRuntimeValidation {
  if (!value || typeof value !== "object") {
    return {
      responseValidationState: "INVALID",
      source: "unknown",
      health: "unknown",
      ready: null,
      blockerCount: null,
      resultCount: null,
      returned: null,
      mapped: null,
      coordinateFiltered: null,
      fallbackReasonPresent: false,
    };
  }

  const payload = value as Record<string, unknown>;
  const meta = payload.meta && typeof payload.meta === "object" ? payload.meta as Record<string, unknown> : {};
  const smoke = meta.smoke && typeof meta.smoke === "object" ? meta.smoke as Record<string, unknown> : {};
  const source = payload.source === "typesense" || payload.source === "database" ? payload.source : "unknown";
  const health = payload.health === "healthy" || payload.health === "degraded" ? payload.health : "unknown";
  const results = Array.isArray(payload.results) ? payload.results : null;
  const blockers = Array.isArray(smoke.blockers) ? smoke.blockers : null;
  const returned = toFiniteNumber(payload.returned);
  const mapped = toFiniteNumber(payload.mapped);
  const coordinateFiltered = toFiniteNumber(payload.coordinateFiltered);
  const ready = toBoolean(smoke.ready);
  const hasValidRequiredShape =
    results !== null &&
    (source === "typesense" || source === "database") &&
    (health === "healthy" || health === "degraded") &&
    returned !== null &&
    mapped !== null &&
    coordinateFiltered !== null;

  return {
    responseValidationState: hasValidRequiredShape
      ? ready === null || blockers === null
        ? "VALID_INCOMPLETE"
        : "VALID"
      : "INVALID",
    source,
    health,
    ready,
    blockerCount: blockers?.length ?? null,
    resultCount: results?.length ?? null,
    returned,
    mapped,
    coordinateFiltered,
    fallbackReasonPresent: typeof payload.fallbackReason === "string" && payload.fallbackReason.length > 0,
  };
}
function providerFor(validation: SearchRuntimeValidation): SearchRuntimeProviderClassification {
  if (validation.source === "typesense") return "TYPESENSE";
  if (validation.source === "database") return "DATABASE";
  if (validation.responseValidationState === "UNAVAILABLE") return "UNAVAILABLE";
  return "UNKNOWN";
}

function classifyRuntime(
  status: number,
  validation: SearchRuntimeValidation,
): Pick<SearchRuntimeProbeResult, "runtimeClassification" | "providerClassification" | "fallbackUsed" | "degraded" | "validation"> {
  const providerClassification = providerFor(validation);
  const fallbackUsed = validation.source === "database" || validation.fallbackReasonPresent;
  const degraded = validation.health === "degraded" || fallbackUsed || (validation.blockerCount ?? 0) > 0;

  if (validation.responseValidationState === "INVALID") {
    return { runtimeClassification: "INVALID", providerClassification, fallbackUsed, degraded, validation: "SCHEMA_MISMATCH" };
  }
  if (status >= 500) {
    return { runtimeClassification: "FAILED", providerClassification, fallbackUsed, degraded: true, validation: "UNAVAILABLE" };
  }
  if (status !== 200) {
    return { runtimeClassification: "INVALID", providerClassification, fallbackUsed, degraded, validation: "INVALID" };
  }
  if (fallbackUsed) {
    return { runtimeClassification: "FALLBACK", providerClassification, fallbackUsed, degraded: true, validation: "SUCCESS" };
  }
  if (degraded) {
    return { runtimeClassification: "DEGRADED", providerClassification, fallbackUsed, degraded: true, validation: "SUCCESS" };
  }
  if (validation.resultCount === 0 || validation.returned === 0 || validation.mapped === 0) {
    return { runtimeClassification: "EMPTY_VALID", providerClassification, fallbackUsed, degraded: false, validation: "SUCCESS" };
  }
  return { runtimeClassification: "SUCCESS", providerClassification, fallbackUsed, degraded: false, validation: "SUCCESS" };
}

async function parseSearchRuntimeResponse(response: Response): Promise<SearchRuntimeValidation> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {
      responseValidationState: "INVALID",
      source: "unknown",
      health: "unknown",
      ready: null,
      blockerCount: null,
      resultCount: null,
      returned: null,
      mapped: null,
      coordinateFiltered: null,
      fallbackReasonPresent: false,
    };
  }

  try {
    return validateSearchRuntimePayload(await response.json());
  } catch {
    return {
      responseValidationState: "INVALID",
      source: "unknown",
      health: "unknown",
      ready: null,
      blockerCount: null,
      resultCount: null,
      returned: null,
      mapped: null,
      coordinateFiltered: null,
      fallbackReasonPresent: false,
    };
  }
}

async function probeSearchRuntime(probe: SearchRuntimeProbe): Promise<SearchRuntimeProbeResult> {
  const startedProbe = new Date();
  const timerStarted = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

  try {
    const response = await fetch(safeProbeUrl(probe), {
      method: probe.method,
      redirect: "manual",
      signal: controller.signal,
      headers: {
        accept: "application/json",
      },
    });
    const validation = await parseSearchRuntimeResponse(response);
    const classified = classifyRuntime(response.status, validation);

    return {
      probeId: probe.id,
      method: probe.method,
      path: probe.path,
      expectedStatuses: probe.expectedStatuses,
      observedStatus: response.status,
      startedAt: startedProbe.toISOString(),
      completedAt: new Date().toISOString(),
      elapsedMs: Math.round(performance.now() - timerStarted),
      ...classified,
      ready: validation.ready,
      blockerCount: validation.blockerCount,
      resultCount: validation.resultCount,
      responseValidationState: validation.responseValidationState,
      errorCategory: response.status >= 500 ? "HTTP_FAILURE" : undefined,
    };
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError";
    return {
      probeId: probe.id,
      method: probe.method,
      path: probe.path,
      expectedStatuses: probe.expectedStatuses,
      observedStatus: null,
      startedAt: startedProbe.toISOString(),
      completedAt: new Date().toISOString(),
      elapsedMs: Math.round(performance.now() - timerStarted),
      runtimeClassification: isTimeout ? "TIMEOUT" : "UNAVAILABLE",
      providerClassification: "UNAVAILABLE",
      fallbackUsed: false,
      degraded: true,
      ready: null,
      blockerCount: null,
      resultCount: null,
      responseValidationState: "UNAVAILABLE",
      validation: "UNAVAILABLE",
      errorCategory: isTimeout ? "TIMEOUT" : "NETWORK_FAILURE",
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function readSearchRuntimeSourceState(now = new Date()): Promise<SearchRuntimeSourceState> {
  const window = observationWindowFor(now);
  const probes = await Promise.all(SEARCH_RUNTIME_PROBES.map((probe) => probeSearchRuntime(probe)));

  return {
    adapterId: SEARCH_RUNTIME_ADAPTER_ID,
    adapterVersion: SEARCH_RUNTIME_ADAPTER_VERSION,
    productionOrigin: SEARCH_RUNTIME_PRODUCTION_ORIGIN,
    probeRegistryVersion: SEARCH_RUNTIME_PROBE_REGISTRY_VERSION,
    observationWindowStart: window.start.toISOString(),
    observationWindowEnd: window.end.toISOString(),
    probes,
    unsupportedMetrics: unsupportedSearchRuntimeMetrics,
  };
}

function isEligibleClassification(classification: SearchRuntimeClassification): boolean {
  return !["UNKNOWN", "UNAVAILABLE"].includes(classification);
}

function isUsableClassification(classification: SearchRuntimeClassification): boolean {
  return ["SUCCESS", "DEGRADED", "FALLBACK", "EMPTY_VALID"].includes(classification);
}

function runtimeHealthPct(source: SearchRuntimeSourceState): number | null {
  const eligible = source.probes.filter((probe) => isEligibleClassification(probe.runtimeClassification));
  if (eligible.length === 0) return null;
  const usable = eligible.filter((probe) => isUsableClassification(probe.runtimeClassification));
  return Number(((usable.length / eligible.length) * 100).toFixed(2));
}

function confidenceFor(source: SearchRuntimeSourceState): EIAConfidence {
  if (source.probes.length !== SEARCH_RUNTIME_PROBES.length) return "INSUFFICIENT";
  if (source.probes.every((probe) => probe.responseValidationState === "VALID")) return "HIGH";
  if (source.probes.some((probe) => probe.validation === "SUCCESS")) return "MEDIUM";
  if (source.probes.some((probe) => probe.runtimeClassification === "INVALID")) return "LOW";
  return "INSUFFICIENT";
}

function validationStatusFor(source: SearchRuntimeSourceState): EnterpriseAdapterStatus {
  if (source.probes.every((probe) => probe.validation === "SUCCESS")) return "SUCCESS";
  if (source.probes.some((probe) => probe.validation === "SUCCESS")) return "PARTIAL";
  if (source.probes.some((probe) => probe.validation === "SCHEMA_MISMATCH")) return "SCHEMA_MISMATCH";
  return "UNAVAILABLE";
}

function sourceQueryRefFor(source: SearchRuntimeSourceState): string {
  return [
    `origin=${source.productionOrigin}`,
    `registry=${source.probeRegistryVersion}`,
    `windowStart=${source.observationWindowStart}`,
    `probes=${source.probes.map((probe) => `${probe.probeId}:${probe.path}:${probe.observedStatus ?? "NO_STATUS"}:${probe.runtimeClassification}:${probe.providerClassification}`).join(",")}`,
  ].join(";");
}

function summarizeSearchRuntimeSourceState(source: SearchRuntimeSourceState): SearchRuntimeSourceSummary {
  return {
    productionOrigin: source.productionOrigin,
    probeRegistryVersion: source.probeRegistryVersion,
    observationWindow: {
      start: source.observationWindowStart,
      end: source.observationWindowEnd,
    },
    runtimeHealthPct: runtimeHealthPct(source),
    probes: source.probes.map((probe) => ({
      probeId: probe.probeId,
      path: probe.path,
      observedStatus: probe.observedStatus,
      runtimeClassification: probe.runtimeClassification,
      providerClassification: probe.providerClassification,
      fallbackUsed: probe.fallbackUsed,
      degraded: probe.degraded,
      ready: probe.ready,
      blockerCount: probe.blockerCount,
      resultCount: probe.resultCount,
      responseValidationState: probe.responseValidationState,
    })),
  };
}

export function fingerprintSearchRuntimeSourceState(state: SearchRuntimeSourceState): string {
  return fingerprintEnterpriseAdapterSourceState({
    adapterId: state.adapterId,
    adapterVersion: state.adapterVersion,
    productionOrigin: state.productionOrigin,
    probeRegistryVersion: state.probeRegistryVersion,
    observationWindowStart: state.observationWindowStart,
    probes: state.probes
      .map((probe) => ({
        probeId: probe.probeId,
        method: probe.method,
        path: probe.path,
        expectedStatuses: probe.expectedStatuses,
        observedStatus: probe.observedStatus,
        runtimeClassification: probe.runtimeClassification,
        providerClassification: probe.providerClassification,
        fallbackUsed: probe.fallbackUsed,
        degraded: probe.degraded,
        ready: probe.ready,
        blockerCount: probe.blockerCount,
        resultCount: probe.resultCount,
        responseValidationState: probe.responseValidationState,
        validation: probe.validation,
        errorCategory: probe.errorCategory,
      }))
      .sort((left, right) => left.probeId.localeCompare(right.probeId)),
    unsupportedMetrics: state.unsupportedMetrics,
  });
}

function mapSearchRuntimeObservations(
  source: SearchRuntimeSourceState,
  freshness: EIAFreshness,
): SearchRuntimeObservationPlan[] {
  const value = runtimeHealthPct(source);
  const confidence = confidenceFor(source);
  const validation = validationStatusFor(source);

  return [
    {
      kpiId: "KPI-SRCH-001",
      displayName: "Search Runtime Health Rate",
      unit: "PERCENT",
      value,
      unavailableReason: value === null ? "No eligible governed Search Runtime observations are available." : undefined,
      sourceRecords: source.probes.map((probe) => `search_runtime_probe_registry.${probe.probeId}`),
      formula: SEARCH_RUNTIME_FORMULA,
      freshness,
      confidence,
      validation,
    },
  ];
}

const searchRuntimeAdapterConfig = {
  metadata: {
    id: SEARCH_RUNTIME_ADAPTER_ID,
    name: SEARCH_RUNTIME_ADAPTER_NAME,
    version: SEARCH_RUNTIME_ADAPTER_VERSION,
    sourceSystem: "REIE Search Runtime",
    reliability: "AUTHORITATIVE",
    owner: "REIE Platform",
    steward: "Search Platform Engineering",
  },
  calculationVersion: SEARCH_RUNTIME_CALCULATION_VERSION,
  invocationPrefix: "SRCH",
  sourceType: "search_runtime_adapter_invocation",
  sourceQueryRef: sourceQueryRefFor,
  evidenceType: "SEARCH_RUNTIME_SOURCE_STATE",
  evidenceTitle: "Search runtime source-state fingerprint",
  readSourceState: readSearchRuntimeSourceState,
  sourceEffectiveAt: (source) => new Date(source.observationWindowStart),
  sourceStateFingerprint: fingerprintSearchRuntimeSourceState,
  mapObservations: mapSearchRuntimeObservations,
  summarizeSourceState: summarizeSearchRuntimeSourceState,
  unsupportedKpis: unsupportedSearchRuntimeMetrics,
} satisfies EnterpriseAdapterLifecycleConfig<SearchRuntimeSourceState>;

export async function invokeSearchRuntimeAdapter(options: {
  execute: boolean;
  invocationId?: string;
  now?: Date;
}): Promise<SearchRuntimeAdapterResult> {
  const now = options.now ?? new Date();
  return invokeEnterpriseAdapter(
    {
      ...searchRuntimeAdapterConfig,
      readSourceState: () => readSearchRuntimeSourceState(now),
    },
    { ...options, now },
  ) as Promise<SearchRuntimeAdapterResult>;
}

export async function inspectSearchRuntimeAdapter() {
  const [inspection, source] = await Promise.all([
    inspectEnterpriseAdapter({
      metadata: searchRuntimeAdapterConfig.metadata,
      kpiIds: ["KPI-SRCH-001"],
    }),
    readSearchRuntimeSourceState(),
  ]);

  return {
    ...inspection,
    productionOrigin: SEARCH_RUNTIME_PRODUCTION_ORIGIN,
    probeRegistryVersion: SEARCH_RUNTIME_PROBE_REGISTRY_VERSION,
    supportedKpis: ["KPI-SRCH-001"],
    unsupportedKpis: unsupportedSearchRuntimeMetrics,
    latestRuntimeClassifications: summarizeSearchRuntimeSourceState(source).probes,
  };
}
