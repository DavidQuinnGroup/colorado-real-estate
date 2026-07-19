import "server-only";
import crypto from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma.js";
import { createEIAPersistenceRepository, } from "./persistence.js";
import { evaluateKpi, } from "./evaluation.js";
import { getEnterpriseKpi, } from "./registry.js";
export function currentEnterpriseAdapterEnvironment() {
    if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production")
        return "PRODUCTION";
    if (process.env.VERCEL_ENV === "preview")
        return "PREVIEW";
    if (process.env.NODE_ENV === "test")
        return "TEST";
    if (process.env.NODE_ENV === "development")
        return "DEVELOPMENT";
    return "UNKNOWN";
}
export function stableEnterpriseAdapterJson(value) {
    if (Array.isArray(value))
        return `[${value.map(stableEnterpriseAdapterJson).join(",")}]`;
    if (value && typeof value === "object") {
        return `{${Object.entries(value)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([key, item]) => `${JSON.stringify(key)}:${stableEnterpriseAdapterJson(item)}`)
            .join(",")}}`;
    }
    return JSON.stringify(value);
}
export function fingerprintEnterpriseAdapterSourceState(value) {
    return crypto.createHash("sha256").update(stableEnterpriseAdapterJson(value)).digest("hex");
}
export function freshnessForEnterpriseAdapterSource(sourceTime, now) {
    const ageHours = (now.getTime() - sourceTime.getTime()) / 3600000;
    if (ageHours <= 24)
        return "FRESH";
    if (ageHours <= 168)
        return "STALE";
    return "STALE";
}
function statusForPlan(plan) {
    return plan.value === null ? "DEFINED_ONLY" : "LIVE_INTERNAL";
}
function toEifObservation(adapterName, plan, observedAt) {
    return {
        kpiId: plan.kpiId,
        value: plan.value,
        observedAt,
        provenance: statusForPlan(plan),
        sourceAvailability: plan.value === null ? "DEFINED_BUT_UNAVAILABLE" : "LIVE_AVAILABLE",
        note: plan.unavailableReason ?? `${adapterName} live observation.`,
    };
}
function statusFromEvaluation(plan, observedAt, started, adapterName) {
    if (plan.value === null)
        return "UNKNOWN";
    return evaluateKpi(getEnterpriseKpi(plan.kpiId), toEifObservation(adapterName, plan, observedAt), started).status;
}
export async function invokeEnterpriseAdapter(config, options) {
    const started = options.now ?? new Date();
    const invocationId = options.invocationId ??
        `${config.invocationPrefix}-${started.toISOString().replace(/[-:.]/g, "").slice(0, 15)}-${crypto.randomUUID().slice(0, 8)}`;
    const environment = currentEnterpriseAdapterEnvironment();
    const validationFailures = [];
    const persistenceFailures = [];
    const source = await config.readSourceState();
    const effectiveAt = config.sourceEffectiveAt(source);
    const freshness = freshnessForEnterpriseAdapterSource(effectiveAt, started);
    const sourceStateFingerprint = config.sourceStateFingerprint(source);
    const observations = config.mapObservations(source, freshness, started);
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
                sourceSystem: config.metadata.sourceSystem,
                sourceType: config.sourceType,
                sourceRecordId: invocationId,
                sourceQueryRef: config.sourceQueryRef,
                observationAt: effectiveAt,
                processedAt: started,
                environment,
                dataOrigin: "LIVE",
                calculationVersion: config.calculationVersion,
                repositoryVersion: sourceStateFingerprint,
                confidence: observations.every((item) => item.confidence === "HIGH") ? "HIGH" : "MEDIUM",
                freshness,
                privacy: "SYSTEM",
                sensitivity: "INTERNAL",
                retention: "AUDIT",
                creatingAppVersion: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_APP_VERSION ?? "LOCAL",
            });
            const evidence = await persistence.upsertEvidenceReference({
                evidenceKey: `EIA-EVD-${config.metadata.id}-${sourceStateFingerprint}`,
                evidenceType: config.evidenceType,
                title: config.evidenceTitle,
                sourceSystem: config.metadata.sourceSystem,
                sourceQueryRef: config.sourceQueryRef,
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
                        calculationVersion: config.calculationVersion,
                    },
                    orderBy: { createdAt: "desc" },
                });
                const observedAt = effectiveAt.toISOString();
                const observation = await persistence.upsertKpiObservation({
                    environment,
                    dataOrigin: "LIVE",
                    kpiId: plan.kpiId,
                    value: plan.value === null
                        ? { kind: "UNAVAILABLE", unavailableReason: plan.unavailableReason ?? "Live adapter value unavailable." }
                        : { kind: "NUMERIC", numericValue: new Prisma.Decimal(plan.value) },
                    unit: plan.unit,
                    periodStart: effectiveAt,
                    periodEnd: effectiveAt,
                    observedAt: effectiveAt,
                    status: statusFromEvaluation(plan, observedAt, started, config.metadata.name),
                    calculationVersion: config.calculationVersion,
                    provenanceId: provenance.id,
                    confidence: plan.confidence,
                    freshness: plan.freshness,
                    privacy: "INTERNAL",
                    sensitivity: "INTERNAL",
                    retention: "HISTORICAL",
                    sourceStateFingerprint,
                });
                const evaluation = evaluateKpi(getEnterpriseKpi(plan.kpiId), toEifObservation(config.metadata.name, plan, observedAt), started);
                const persistedEvaluation = await persistence.upsertKpiEvaluation({
                    environment,
                    dataOrigin: "LIVE",
                    kpiId: plan.kpiId,
                    observationId: observation.id,
                    status: evaluation.status,
                    includedInHealth: evaluation.includedInHealth,
                    exclusionReason: evaluation.exclusionReason ?? undefined,
                    calculationVersion: config.calculationVersion,
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
                }
                else {
                    persisted += 1;
                }
            }
        }
        catch (error) {
            persistenceFailures.push(error instanceof Error ? error.message : "Unknown persistence failure.");
        }
    }
    const completed = new Date();
    const persistenceStatus = persistenceFailures.length > 0 ? "PERSISTENCE_FAILURE" : options.execute ? "SUCCESS" : "SUCCESS";
    const validationStatus = validationFailures.length > 0 ? "INVALID" : unavailable > 0 ? "PARTIAL" : "SUCCESS";
    const overallStatus = persistenceStatus === "PERSISTENCE_FAILURE"
        ? "PERSISTENCE_FAILURE"
        : validationStatus === "INVALID"
            ? "INVALID"
            : unavailable > 0
                ? "PARTIAL"
                : "SUCCESS";
    return {
        adapter: config.metadata,
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
        unsupportedKpis: config.unsupportedKpis,
        observations,
    };
}
export async function inspectEnterpriseAdapter(config) {
    const environment = currentEnterpriseAdapterEnvironment();
    const observations = await prisma.eIAKpiObservation.findMany({
        where: {
            environment,
            dataOrigin: "LIVE",
            kpiId: { in: config.kpiIds },
            archivedAt: null,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
    });
    return {
        adapterId: config.metadata.id,
        adapterVersion: config.metadata.version,
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
