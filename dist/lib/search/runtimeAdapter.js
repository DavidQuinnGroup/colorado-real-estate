import "server-only";
import { performance } from "node:perf_hooks";
import { fingerprintEnterpriseAdapterSourceState, inspectEnterpriseAdapter, invokeEnterpriseAdapter, } from "../enterprise-kpi/adapterFramework.js";
export const SEARCH_RUNTIME_ADAPTER_ID = "SEARCH_RUNTIME";
export const SEARCH_RUNTIME_ADAPTER_NAME = "Search Runtime Adapter";
export const SEARCH_RUNTIME_ADAPTER_VERSION = "1.0.0";
export const SEARCH_RUNTIME_CALCULATION_VERSION = "EIA-1.0-search-runtime-adapter-v1";
export const SEARCH_RUNTIME_PROBE_REGISTRY_VERSION = "EIA-1.0-search-runtime-probe-registry-v1";
export const SEARCH_RUNTIME_PRODUCTION_ORIGIN = "https://davidquinngroup.com";
const PROBE_TIMEOUT_MS = 10000;
const OBSERVATION_WINDOW_MINUTES = 15;
const SEARCH_RUNTIME_FORMULA = "valid usable runtime executions / total eligible runtime executions × 100";
export const SEARCH_RUNTIME_PROBES = [
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
const unsupportedSearchRuntimeMetrics = [
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
function observationWindowFor(now) {
    const windowMs = OBSERVATION_WINDOW_MINUTES * 60000;
    const start = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
    const end = new Date(start.getTime() + windowMs - 1);
    return { start, end };
}
function safeProbeUrl(probe) {
    const url = new URL(probe.path, SEARCH_RUNTIME_PRODUCTION_ORIGIN);
    if (url.origin !== SEARCH_RUNTIME_PRODUCTION_ORIGIN) {
        throw new Error(`Probe ${probe.id} resolves outside the production origin.`);
    }
    return url;
}
function toBoolean(value) {
    return typeof value === "boolean" ? value : null;
}
function toFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function validateSearchRuntimePayload(value) {
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
    const payload = value;
    const meta = payload.meta && typeof payload.meta === "object" ? payload.meta : {};
    const smoke = meta.smoke && typeof meta.smoke === "object" ? meta.smoke : {};
    const source = payload.source === "typesense" || payload.source === "database" ? payload.source : "unknown";
    const health = payload.health === "healthy" || payload.health === "degraded" ? payload.health : "unknown";
    const results = Array.isArray(payload.results) ? payload.results : null;
    const blockers = Array.isArray(smoke.blockers) ? smoke.blockers : null;
    const returned = toFiniteNumber(payload.returned);
    const mapped = toFiniteNumber(payload.mapped);
    const coordinateFiltered = toFiniteNumber(payload.coordinateFiltered);
    const ready = toBoolean(smoke.ready);
    const hasValidRequiredShape = results !== null &&
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
function providerFor(validation) {
    if (validation.source === "typesense")
        return "TYPESENSE";
    if (validation.source === "database")
        return "DATABASE";
    if (validation.responseValidationState === "UNAVAILABLE")
        return "UNAVAILABLE";
    return "UNKNOWN";
}
function classifyRuntime(status, validation) {
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
async function parseSearchRuntimeResponse(response) {
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
    }
    catch {
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
async function probeSearchRuntime(probe) {
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
    }
    catch (error) {
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
    }
    finally {
        clearTimeout(timeout);
    }
}
async function readSearchRuntimeSourceState(now = new Date()) {
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
function isEligibleClassification(classification) {
    return !["UNKNOWN", "UNAVAILABLE"].includes(classification);
}
function isUsableClassification(classification) {
    return ["SUCCESS", "DEGRADED", "FALLBACK", "EMPTY_VALID"].includes(classification);
}
function runtimeHealthPct(source) {
    const eligible = source.probes.filter((probe) => isEligibleClassification(probe.runtimeClassification));
    if (eligible.length === 0)
        return null;
    const usable = eligible.filter((probe) => isUsableClassification(probe.runtimeClassification));
    return Number(((usable.length / eligible.length) * 100).toFixed(2));
}
function confidenceFor(source) {
    if (source.probes.length !== SEARCH_RUNTIME_PROBES.length)
        return "INSUFFICIENT";
    if (source.probes.every((probe) => probe.responseValidationState === "VALID"))
        return "HIGH";
    if (source.probes.some((probe) => probe.validation === "SUCCESS"))
        return "MEDIUM";
    if (source.probes.some((probe) => probe.runtimeClassification === "INVALID"))
        return "LOW";
    return "INSUFFICIENT";
}
function validationStatusFor(source) {
    if (source.probes.every((probe) => probe.validation === "SUCCESS"))
        return "SUCCESS";
    if (source.probes.some((probe) => probe.validation === "SUCCESS"))
        return "PARTIAL";
    if (source.probes.some((probe) => probe.validation === "SCHEMA_MISMATCH"))
        return "SCHEMA_MISMATCH";
    return "UNAVAILABLE";
}
function sourceQueryRefFor(source) {
    return [
        `origin=${source.productionOrigin}`,
        `registry=${source.probeRegistryVersion}`,
        `windowStart=${source.observationWindowStart}`,
        `probes=${source.probes.map((probe) => `${probe.probeId}:${probe.path}:${probe.observedStatus ?? "NO_STATUS"}:${probe.runtimeClassification}:${probe.providerClassification}`).join(",")}`,
    ].join(";");
}
function summarizeSearchRuntimeSourceState(source) {
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
export function fingerprintSearchRuntimeSourceState(state) {
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
function mapSearchRuntimeObservations(source, freshness) {
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
};
export async function invokeSearchRuntimeAdapter(options) {
    const now = options.now ?? new Date();
    return invokeEnterpriseAdapter({
        ...searchRuntimeAdapterConfig,
        readSourceState: () => readSearchRuntimeSourceState(now),
    }, { ...options, now });
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
