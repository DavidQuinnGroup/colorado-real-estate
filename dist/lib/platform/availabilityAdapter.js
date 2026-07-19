import "server-only";
import { performance } from "node:perf_hooks";
import { fingerprintEnterpriseAdapterSourceState, inspectEnterpriseAdapter, invokeEnterpriseAdapter, } from "../enterprise-kpi/adapterFramework.js";
export const PLATFORM_AVAILABILITY_ADAPTER_ID = "PLATFORM_AVAILABILITY";
export const PLATFORM_AVAILABILITY_ADAPTER_NAME = "Platform Availability Adapter";
export const PLATFORM_AVAILABILITY_ADAPTER_VERSION = "1.0.0";
export const PLATFORM_AVAILABILITY_CALCULATION_VERSION = "EIA-1.0-platform-availability-adapter-v1";
export const PLATFORM_AVAILABILITY_ENDPOINT_REGISTRY_VERSION = "EIA-1.0-platform-availability-registry-v1";
export const PLATFORM_AVAILABILITY_PRODUCTION_ORIGIN = "https://davidquinngroup.com";
const PROBE_TIMEOUT_MS = 10000;
const OBSERVATION_WINDOW_MINUTES = 15;
export const PLATFORM_AVAILABILITY_ENDPOINTS = [
    {
        id: "HOME",
        label: "Production home route",
        method: "GET",
        path: "/",
        expectedStatuses: [200],
        authExpectation: "PUBLIC",
        criticality: "CRITICAL",
        enabled: true,
    },
    {
        id: "SEARCH_UI",
        label: "Search experience route",
        method: "GET",
        path: "/search",
        expectedStatuses: [200],
        authExpectation: "PUBLIC",
        criticality: "CRITICAL",
        enabled: true,
    },
    {
        id: "SEARCH_API",
        label: "Search API route",
        method: "GET",
        path: "/api/search?limit=1",
        expectedStatuses: [200],
        authExpectation: "PUBLIC",
        criticality: "CRITICAL",
        enabled: true,
    },
    {
        id: "PROPERTY_ROUTE",
        label: "Representative property route",
        method: "GET",
        path: "/properties/6137-baseline-rd-boulder-co-ire1349635",
        expectedStatuses: [200],
        authExpectation: "PUBLIC",
        criticality: "HIGH",
        enabled: true,
    },
    {
        id: "ENTERPRISE_AUTH_BOUNDARY",
        label: "Enterprise admin auth boundary",
        method: "GET",
        path: "/api/admin/enterprise/health",
        expectedStatuses: [401],
        authExpectation: "PROTECTED_UNAUTHENTICATED_401",
        criticality: "HIGH",
        enabled: true,
    },
];
const unsupportedPlatformMetrics = [
    {
        requestedMetric: "Critical Route Availability",
        reason: "UNSUPPORTED: no canonical governed KPI ID exists in the current registry.",
    },
    {
        requestedMetric: "Protected Route Integrity",
        reason: "UNSUPPORTED: no canonical governed KPI ID exists in the current registry.",
    },
    {
        requestedMetric: "KPI-PLAT-003 Search Response Time",
        reason: "UNAVAILABLE: canonical KPI exists, but governed source notes prohibit inferring it from one-off probe timings.",
    },
    {
        requestedMetric: "KPI-PLAT-004 Application Error Rate",
        reason: "UNAVAILABLE: canonical KPI exists, but no approved production monitoring feed is available to this adapter.",
    },
    {
        requestedMetric: "Search Provider Quality",
        reason: "UNSUPPORTED: provider-level quality is outside the Platform Availability Adapter scope.",
    },
];
function observationWindowFor(now) {
    const windowMs = OBSERVATION_WINDOW_MINUTES * 60000;
    const start = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
    const end = new Date(start.getTime() + windowMs - 1);
    return { start, end };
}
function safeEndpointUrl(endpoint) {
    const url = new URL(endpoint.path, PLATFORM_AVAILABILITY_PRODUCTION_ORIGIN);
    if (url.origin !== PLATFORM_AVAILABILITY_PRODUCTION_ORIGIN) {
        throw new Error(`Endpoint ${endpoint.id} resolves outside the production origin.`);
    }
    return url;
}
function sanitizeErrorMessage(message) {
    return message
        .replace(/(adminKey|token|key|password)=([^&\s]+)/gi, "$1=[REDACTED]")
        .replace(/bearer\s+[a-z0-9._-]+/gi, "Bearer [REDACTED]")
        .replace(/[A-Za-z0-9_-]{32,}/g, "[REDACTED]");
}
function toSearchApiSummary(value) {
    if (!value || typeof value !== "object")
        return null;
    const payload = value;
    const meta = payload.meta && typeof payload.meta === "object" ? payload.meta : {};
    const smoke = meta.smoke && typeof meta.smoke === "object" ? meta.smoke : {};
    const source = payload.source === "typesense" || payload.source === "database" ? payload.source : "unknown";
    const health = payload.health === "healthy" || payload.health === "degraded" ? payload.health : "unknown";
    const blockers = Array.isArray(smoke.blockers) ? smoke.blockers.length : null;
    const resultCount = Array.isArray(payload.results) ? payload.results.length : null;
    return {
        source,
        health,
        ready: typeof smoke.ready === "boolean" ? smoke.ready : null,
        blockerCount: blockers,
        resultCount,
    };
}
async function parseSearchApiResponse(response) {
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json"))
        return null;
    try {
        return toSearchApiSummary(await response.json());
    }
    catch {
        return null;
    }
}
function classifyStatus(endpoint, status, searchApi) {
    if (endpoint.authExpectation === "PROTECTED_UNAUTHENTICATED_401") {
        if (status === 401) {
            return { classification: "HEALTHY_AUTH_BOUNDARY", success: true, validation: "SUCCESS" };
        }
        if (status === 200) {
            return { classification: "SECURITY_FAILURE", success: false, validation: "INVALID" };
        }
        if (status === 404) {
            return { classification: "ROUTE_UNAVAILABLE_OR_MISROUTED", success: false, validation: "UNAVAILABLE" };
        }
        return { classification: "UNEXPECTED_STATUS", success: false, validation: "INVALID" };
    }
    if (!endpoint.expectedStatuses.includes(status)) {
        return { classification: status === 404 ? "ROUTE_UNAVAILABLE_OR_MISROUTED" : "UNEXPECTED_STATUS", success: false, validation: "INVALID" };
    }
    if (endpoint.id === "SEARCH_API") {
        if (!searchApi) {
            return { classification: "INVALID_RESPONSE", success: false, validation: "SCHEMA_MISMATCH" };
        }
        if (searchApi.health === "degraded" || searchApi.source === "database") {
            return { classification: "AVAILABLE_DEGRADED", success: true, validation: "SUCCESS" };
        }
    }
    return { classification: "AVAILABLE", success: true, validation: "SUCCESS" };
}
async function probeEndpoint(endpoint, startedAt) {
    const startedProbe = new Date();
    const timerStarted = performance.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    try {
        const response = await fetch(safeEndpointUrl(endpoint), {
            method: endpoint.method,
            redirect: "manual",
            signal: controller.signal,
            headers: {
                accept: endpoint.id === "SEARCH_API" ? "application/json" : "text/html,application/json;q=0.9,*/*;q=0.8",
            },
        });
        const searchApi = endpoint.id === "SEARCH_API" ? await parseSearchApiResponse(response) : undefined;
        const classified = classifyStatus(endpoint, response.status, searchApi);
        return {
            endpointId: endpoint.id,
            label: endpoint.label,
            method: endpoint.method,
            path: endpoint.path,
            criticality: endpoint.criticality,
            authExpectation: endpoint.authExpectation,
            expectedStatuses: endpoint.expectedStatuses,
            observedStatus: response.status,
            startedAt: startedProbe.toISOString(),
            completedAt: new Date().toISOString(),
            elapsedMs: Math.round(performance.now() - timerStarted),
            ...classified,
            searchApi: searchApi ?? undefined,
        };
    }
    catch (error) {
        const isTimeout = error instanceof Error && error.name === "AbortError";
        return {
            endpointId: endpoint.id,
            label: endpoint.label,
            method: endpoint.method,
            path: endpoint.path,
            criticality: endpoint.criticality,
            authExpectation: endpoint.authExpectation,
            expectedStatuses: endpoint.expectedStatuses,
            observedStatus: null,
            startedAt: startedProbe.toISOString(),
            completedAt: new Date().toISOString(),
            elapsedMs: Math.round(performance.now() - timerStarted),
            classification: isTimeout ? "TIMEOUT" : "NETWORK_FAILURE",
            success: false,
            validation: isTimeout ? "UNAVAILABLE" : "UNAVAILABLE",
            errorCategory: isTimeout ? "TIMEOUT" : "NETWORK_FAILURE",
            errorMessage: sanitizeErrorMessage(error instanceof Error ? error.message : "Unknown probe error."),
        };
    }
    finally {
        clearTimeout(timeout);
        void startedAt;
    }
}
async function readPlatformAvailabilitySourceState(now = new Date()) {
    const window = observationWindowFor(now);
    const endpoints = await Promise.all(PLATFORM_AVAILABILITY_ENDPOINTS.map((endpoint) => probeEndpoint(endpoint, now)));
    return {
        adapterId: PLATFORM_AVAILABILITY_ADAPTER_ID,
        adapterVersion: PLATFORM_AVAILABILITY_ADAPTER_VERSION,
        productionOrigin: PLATFORM_AVAILABILITY_PRODUCTION_ORIGIN,
        endpointRegistryVersion: PLATFORM_AVAILABILITY_ENDPOINT_REGISTRY_VERSION,
        observationWindowStart: window.start.toISOString(),
        observationWindowEnd: window.end.toISOString(),
        endpoints,
        unsupportedMetrics: unsupportedPlatformMetrics,
    };
}
function endpointAvailabilityPct(source) {
    const total = source.endpoints.length;
    if (total === 0)
        return 0;
    const available = source.endpoints.filter((endpoint) => endpoint.success).length;
    return Number(((available / total) * 100).toFixed(2));
}
function searchApiSuccessPct(source) {
    const search = source.endpoints.find((endpoint) => endpoint.endpointId === "SEARCH_API");
    if (!search)
        return 0;
    return search.success ? 100 : 0;
}
function confidenceFor(source) {
    if (source.endpoints.length !== PLATFORM_AVAILABILITY_ENDPOINTS.length)
        return "INSUFFICIENT";
    if (source.endpoints.every((endpoint) => endpoint.success))
        return "HIGH";
    if (source.endpoints.some((endpoint) => endpoint.success))
        return "MEDIUM";
    return "INSUFFICIENT";
}
function platformAvailabilitySourceQueryRef(source) {
    return [
        `origin=${source.productionOrigin}`,
        `registry=${source.endpointRegistryVersion}`,
        `windowStart=${source.observationWindowStart}`,
        `endpoints=${source.endpoints.map((endpoint) => `${endpoint.endpointId}:${endpoint.path}:${endpoint.observedStatus ?? "NO_STATUS"}:${endpoint.classification}`).join(",")}`,
    ].join(";");
}
function summarizePlatformAvailabilitySourceState(source) {
    return {
        productionOrigin: source.productionOrigin,
        endpointRegistryVersion: source.endpointRegistryVersion,
        observationWindow: {
            start: source.observationWindowStart,
            end: source.observationWindowEnd,
        },
        availabilityPct: endpointAvailabilityPct(source),
        searchApiSuccessPct: searchApiSuccessPct(source),
        searchApiDegraded: source.endpoints.some((endpoint) => endpoint.endpointId === "SEARCH_API" && endpoint.classification === "AVAILABLE_DEGRADED"),
        endpoints: source.endpoints.map((endpoint) => ({
            endpointId: endpoint.endpointId,
            path: endpoint.path,
            observedStatus: endpoint.observedStatus,
            classification: endpoint.classification,
            success: endpoint.success,
            elapsedMs: endpoint.elapsedMs,
        })),
    };
}
export function fingerprintPlatformAvailabilitySourceState(state) {
    return fingerprintEnterpriseAdapterSourceState({
        adapterId: state.adapterId,
        adapterVersion: state.adapterVersion,
        productionOrigin: state.productionOrigin,
        endpointRegistryVersion: state.endpointRegistryVersion,
        observationWindowStart: state.observationWindowStart,
        endpoints: state.endpoints
            .map((endpoint) => ({
            endpointId: endpoint.endpointId,
            method: endpoint.method,
            path: endpoint.path,
            expectedStatuses: endpoint.expectedStatuses,
            authExpectation: endpoint.authExpectation,
            observedStatus: endpoint.observedStatus,
            classification: endpoint.classification,
            validation: endpoint.validation,
            success: endpoint.success,
            searchApi: endpoint.searchApi
                ? {
                    source: endpoint.searchApi.source,
                    health: endpoint.searchApi.health,
                    ready: endpoint.searchApi.ready,
                    blockerCount: endpoint.searchApi.blockerCount,
                    resultCount: endpoint.searchApi.resultCount,
                }
                : undefined,
        }))
            .sort((left, right) => left.endpointId.localeCompare(right.endpointId)),
        unsupportedMetrics: state.unsupportedMetrics,
    });
}
function mapPlatformAvailabilityObservations(source, freshness) {
    const confidence = confidenceFor(source);
    const search = source.endpoints.find((endpoint) => endpoint.endpointId === "SEARCH_API");
    return [
        {
            kpiId: "KPI-PLAT-001",
            displayName: "Production Availability",
            unit: "PERCENT",
            value: endpointAvailabilityPct(source),
            sourceRecords: source.endpoints.map((endpoint) => `platform_endpoint_registry.${endpoint.endpointId}`),
            formula: "successful enabled production endpoint checks / total enabled production endpoint checks",
            freshness,
            confidence,
            validation: source.endpoints.every((endpoint) => endpoint.success) ? "SUCCESS" : "PARTIAL",
        },
        {
            kpiId: "KPI-PLAT-002",
            displayName: "Search API Success Rate",
            unit: "PERCENT",
            value: searchApiSuccessPct(source),
            sourceRecords: ["platform_endpoint_registry.SEARCH_API"],
            formula: "successful /api/search availability checks / total /api/search availability checks",
            freshness,
            confidence: search?.success ? "HIGH" : "INSUFFICIENT",
            validation: search?.success ? "SUCCESS" : "UNAVAILABLE",
            unavailableReason: search?.success ? undefined : "Search API endpoint did not return a valid available response.",
        },
    ];
}
const platformAvailabilityAdapterConfig = {
    metadata: {
        id: PLATFORM_AVAILABILITY_ADAPTER_ID,
        name: PLATFORM_AVAILABILITY_ADAPTER_NAME,
        version: PLATFORM_AVAILABILITY_ADAPTER_VERSION,
        sourceSystem: "REIE Production Platform",
        reliability: "AUTHORITATIVE",
        owner: "REIE Platform",
        steward: "Platform Engineering",
    },
    calculationVersion: PLATFORM_AVAILABILITY_CALCULATION_VERSION,
    invocationPrefix: "PLAT",
    sourceType: "platform_availability_adapter_invocation",
    sourceQueryRef: platformAvailabilitySourceQueryRef,
    evidenceType: "PLATFORM_AVAILABILITY_SOURCE_STATE",
    evidenceTitle: "Platform availability source-state fingerprint",
    readSourceState: readPlatformAvailabilitySourceState,
    sourceEffectiveAt: (source) => new Date(source.observationWindowStart),
    sourceStateFingerprint: fingerprintPlatformAvailabilitySourceState,
    mapObservations: mapPlatformAvailabilityObservations,
    summarizeSourceState: summarizePlatformAvailabilitySourceState,
    unsupportedKpis: unsupportedPlatformMetrics,
};
export async function invokePlatformAvailabilityAdapter(options) {
    const now = options.now ?? new Date();
    return invokeEnterpriseAdapter({
        ...platformAvailabilityAdapterConfig,
        readSourceState: () => readPlatformAvailabilitySourceState(now),
    }, { ...options, now });
}
export async function inspectPlatformAvailabilityAdapter() {
    const [inspection, source] = await Promise.all([
        inspectEnterpriseAdapter({
            metadata: platformAvailabilityAdapterConfig.metadata,
            kpiIds: ["KPI-PLAT-001", "KPI-PLAT-002"],
        }),
        readPlatformAvailabilitySourceState(),
    ]);
    return {
        ...inspection,
        productionOrigin: PLATFORM_AVAILABILITY_PRODUCTION_ORIGIN,
        endpointRegistryVersion: PLATFORM_AVAILABILITY_ENDPOINT_REGISTRY_VERSION,
        supportedKpis: ["KPI-PLAT-001", "KPI-PLAT-002"],
        unsupportedKpis: unsupportedPlatformMetrics,
        latestEndpointClassifications: summarizePlatformAvailabilitySourceState(source).endpoints,
    };
}
