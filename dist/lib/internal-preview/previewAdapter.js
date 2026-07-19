import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fingerprintEnterpriseAdapterSourceState, inspectEnterpriseAdapter, invokeEnterpriseAdapter, } from "../enterprise-kpi/adapterFramework.js";
export const INTERNAL_PREVIEW_ADAPTER_ID = "INTERNAL_PREVIEW";
export const INTERNAL_PREVIEW_ADAPTER_NAME = "Internal Preview Adapter";
export const INTERNAL_PREVIEW_ADAPTER_VERSION = "1.0.0";
export const INTERNAL_PREVIEW_CALCULATION_VERSION = "EIA-1.0-internal-preview-adapter-v1";
export const INTERNAL_PREVIEW_SOURCE_VERSION = "PROJECT-ATLAS-RC1-internal-preview-certification-v1";
const RELEASE_CANDIDATE_BOARD_PATH = "docs/project-atlas/executive-library/release-candidate-board.json";
const RC1_CERTIFICATION_RECORD_PATH = "docs/project-atlas/executive-library/RC1-CERT-001.md";
const CERTIFICATION_ID = "CERT-001";
const unavailablePreviewSources = [
    {
        kpiId: "KPI-CUST-001",
        source: "Preview participant roster",
        reason: "No governed roster table or source file exists; do not infer participants from production User rows.",
    },
    {
        kpiId: "KPI-CUST-002",
        source: "Session analytics",
        reason: "No approved session telemetry source is activated for Internal Preview.",
    },
    {
        kpiId: "KPI-CUST-003",
        source: "Governed search event taxonomy",
        reason: "No approved search event collector exists; do not inspect or persist user search behavior.",
    },
    {
        kpiId: "KPI-CUST-004",
        source: "Governed property-view event taxonomy",
        reason: "No approved property-view collector exists; do not infer from email tracking or listing records.",
    },
    {
        kpiId: "KPI-CUST-005",
        source: "Preview participant telemetry",
        reason: "No approved repeat-usage source exists.",
    },
    {
        kpiId: "KPI-OPS-002",
        source: "Incident register",
        reason: "No governed incident register exists; Critical incidents require manual executive review.",
    },
    {
        kpiId: "KPI-BUS-001",
        source: "Governed product analytics",
        reason: "No approved workflow telemetry exists for search-to-property completion.",
    },
    {
        kpiId: "KPI-BUS-002",
        source: "Governed feature-use taxonomy",
        reason: "No approved feature-use telemetry exists.",
    },
    {
        kpiId: "KPI-GROW-001",
        source: "Preview roster and event taxonomy",
        reason: "No approved invitation roster or activation collector exists.",
    },
    {
        kpiId: "KPI-GROW-002",
        source: "Preview roster and event taxonomy",
        reason: "No approved retention source exists.",
    },
];
const unsupportedInternalPreviewMetrics = [
    {
        requestedMetric: "KPI-PLAT-001 Production Availability",
        reason: "SUPPORTED_BY_OTHER_ADAPTER: Platform Availability Adapter owns production route availability.",
    },
    {
        requestedMetric: "KPI-SRCH-001 Search Runtime Health Rate",
        reason: "SUPPORTED_BY_OTHER_ADAPTER: Search Runtime Adapter owns runtime classification and provider fallback evidence.",
    },
    {
        requestedMetric: "Customer Personal Feedback",
        reason: "UNSUPPORTED: Sprint 5 does not collect names, emails, free-text feedback, or customer identifiers.",
    },
    {
        requestedMetric: "Preview User Identity",
        reason: "UNAVAILABLE: no governed Internal Preview identity source is connected.",
    },
];
function repoPath(relativePath) {
    return path.join(process.cwd(), relativePath);
}
function asStringArray(value) {
    return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
async function readCertificationRecord() {
    const raw = await readFile(repoPath(RELEASE_CANDIDATE_BOARD_PATH), "utf8");
    const parsed = JSON.parse(raw);
    const record = parsed.issues?.find((item) => item.id === CERTIFICATION_ID);
    if (!record) {
        throw new Error(`Unable to find ${CERTIFICATION_ID} in release candidate board.`);
    }
    return record;
}
async function readInternalPreviewSourceState() {
    const [record, certificationRecordText] = await Promise.all([
        readCertificationRecord(),
        readFile(repoPath(RC1_CERTIFICATION_RECORD_PATH), "utf8"),
    ]);
    const certification = record.certification ?? {};
    const closedIssues = asStringArray(certification.closedIssues);
    const knownWatchItems = asStringArray(certification.knownWatchItems);
    const explicitExclusions = asStringArray(certification.explicitExclusions);
    const operatingConditions = asStringArray(certification.operatingConditions);
    const certificationTimestamp = certification.certifiedAt ?? "1970-01-01T00:00:00.000Z";
    return {
        adapterId: INTERNAL_PREVIEW_ADAPTER_ID,
        adapterVersion: INTERNAL_PREVIEW_ADAPTER_VERSION,
        sourceVersion: INTERNAL_PREVIEW_SOURCE_VERSION,
        certificationId: CERTIFICATION_ID,
        certificationStatus: record.status,
        certificationDecision: certification.decision ?? "UNAVAILABLE",
        certificationTimestamp,
        certifiedRuntimeCommit: certification.certifiedRuntimeCommit ?? record.baseline,
        scope: certification.scope ?? "UNAVAILABLE",
        closedIssues,
        explicitExclusions,
        operatingConditions,
        knownWatchItems,
        operationalIssueSummary: {
            openCriticalOrHighIssues: record.status === "CLOSED" && certification.decision === "CERTIFIED_FOR_INTERNAL_PREVIEW" ? 0 : 1,
            closedIssueCount: closedIssues.length,
            knownWatchItemCount: knownWatchItems.length,
            watchItemsNonBlocking: certificationRecordText.includes("These are non-blocking for controlled Internal Preview"),
        },
        unavailableSources: unavailablePreviewSources,
        sourceRecords: [
            RELEASE_CANDIDATE_BOARD_PATH,
            RC1_CERTIFICATION_RECORD_PATH,
        ],
        certificationRecordHash: fingerprintEnterpriseAdapterSourceState({
            releaseCandidateRecord: record,
            certificationRecordText,
        }),
    };
}
function sourceEffectiveAt(source) {
    const timestamp = new Date(source.certificationTimestamp);
    return Number.isFinite(timestamp.getTime()) ? timestamp : new Date(0);
}
function sourceQueryRefFor(source) {
    return [
        `certificationId=${source.certificationId}`,
        `decision=${source.certificationDecision}`,
        `certifiedAt=${source.certificationTimestamp}`,
        `runtimeCommit=${source.certifiedRuntimeCommit}`,
        `sourceVersion=${source.sourceVersion}`,
        `records=${source.sourceRecords.join(",")}`,
    ].join(";");
}
export function fingerprintInternalPreviewSourceState(state) {
    return fingerprintEnterpriseAdapterSourceState({
        adapterId: state.adapterId,
        adapterVersion: state.adapterVersion,
        sourceVersion: state.sourceVersion,
        certificationId: state.certificationId,
        certificationStatus: state.certificationStatus,
        certificationDecision: state.certificationDecision,
        certificationTimestamp: state.certificationTimestamp,
        certifiedRuntimeCommit: state.certifiedRuntimeCommit,
        closedIssues: [...state.closedIssues].sort(),
        explicitExclusions: [...state.explicitExclusions].sort(),
        operatingConditions: [...state.operatingConditions].sort(),
        knownWatchItems: [...state.knownWatchItems].sort(),
        operationalIssueSummary: state.operationalIssueSummary,
        unavailableSources: [...state.unavailableSources].sort((left, right) => left.kpiId.localeCompare(right.kpiId)),
        certificationRecordHash: state.certificationRecordHash,
    });
}
function confidenceForOperationalIssues(source) {
    if (source.certificationStatus !== "CLOSED")
        return "LOW";
    if (source.certificationDecision !== "CERTIFIED_FOR_INTERNAL_PREVIEW")
        return "LOW";
    if (source.closedIssues.length < 8)
        return "MEDIUM";
    if (!source.operationalIssueSummary.watchItemsNonBlocking)
        return "MEDIUM";
    return "HIGH";
}
function unavailablePlan(source, sourceInfo, freshness) {
    const definitions = {
        "KPI-CUST-001": {
            displayName: "Active Preview Participants",
            unit: "COUNT",
            formula: "count of approved internal preview users with activity in period",
        },
        "KPI-CUST-002": {
            displayName: "Preview Sessions",
            unit: "COUNT",
            formula: "count of approved internal preview sessions",
        },
        "KPI-CUST-003": {
            displayName: "Searches Performed",
            unit: "COUNT",
            formula: "count of governed search events",
        },
        "KPI-CUST-004": {
            displayName: "Property Detail Views",
            unit: "COUNT",
            formula: "count of governed property detail view events",
        },
        "KPI-CUST-005": {
            displayName: "Repeat Preview Usage",
            unit: "PERCENT",
            formula: "returning preview users / active preview users",
        },
        "KPI-OPS-002": {
            displayName: "Critical Incident Count",
            unit: "COUNT",
            formula: "count of Critical incidents",
        },
        "KPI-BUS-001": {
            displayName: "Core Workflow Adoption",
            unit: "PERCENT",
            formula: "users completing search and property detail workflow / active preview users",
        },
        "KPI-BUS-002": {
            displayName: "Feature Adoption Coverage",
            unit: "PERCENT",
            formula: "used preview features / enabled preview features",
        },
        "KPI-GROW-001": {
            displayName: "Preview Participant Activation Rate",
            unit: "PERCENT",
            formula: "activated preview participants / invited preview participants",
        },
        "KPI-GROW-002": {
            displayName: "Preview Participant Retention",
            unit: "PERCENT",
            formula: "retained preview participants / active preview participants",
        },
    };
    const definition = definitions[sourceInfo.kpiId];
    return {
        kpiId: sourceInfo.kpiId,
        displayName: definition.displayName,
        unit: definition.unit,
        value: null,
        unavailableReason: sourceInfo.reason,
        sourceRecords: source.sourceRecords,
        formula: definition.formula,
        freshness,
        confidence: "INSUFFICIENT",
        validation: "UNAVAILABLE",
    };
}
function mapInternalPreviewObservations(source, freshness) {
    return [
        {
            kpiId: "KPI-OPS-001",
            displayName: "Open Operational Issues",
            unit: "COUNT",
            value: source.operationalIssueSummary.openCriticalOrHighIssues,
            sourceRecords: source.sourceRecords,
            formula: "count of open Critical or High governed operational issues",
            freshness,
            confidence: confidenceForOperationalIssues(source),
            validation: source.certificationStatus === "CLOSED" ? "SUCCESS" : "INCOMPLETE",
        },
        ...source.unavailableSources.map((item) => unavailablePlan(source, item, freshness)),
    ];
}
function summarizeInternalPreviewSourceState(source) {
    return {
        certificationId: source.certificationId,
        certificationStatus: source.certificationStatus,
        certificationDecision: source.certificationDecision,
        certificationTimestamp: source.certificationTimestamp,
        certifiedRuntimeCommit: source.certifiedRuntimeCommit,
        scope: source.scope,
        closedIssueCount: source.closedIssues.length,
        knownWatchItemCount: source.knownWatchItems.length,
        openCriticalOrHighIssues: source.operationalIssueSummary.openCriticalOrHighIssues,
        unavailableKpis: source.unavailableSources.map((item) => item.kpiId),
    };
}
const internalPreviewAdapterConfig = {
    metadata: {
        id: INTERNAL_PREVIEW_ADAPTER_ID,
        name: INTERNAL_PREVIEW_ADAPTER_NAME,
        version: INTERNAL_PREVIEW_ADAPTER_VERSION,
        sourceSystem: "PROJECT ATLAS RC1 Certification Records",
        reliability: "AUTHORITATIVE",
        owner: "PROJECT ATLAS Executive Architecture",
        steward: "Internal Preview Operations",
    },
    calculationVersion: INTERNAL_PREVIEW_CALCULATION_VERSION,
    invocationPrefix: "IPRV",
    sourceType: "internal_preview_adapter_invocation",
    sourceQueryRef: sourceQueryRefFor,
    evidenceType: "INTERNAL_PREVIEW_SOURCE_STATE",
    evidenceTitle: "Internal Preview source-state fingerprint",
    readSourceState: readInternalPreviewSourceState,
    sourceEffectiveAt,
    sourceStateFingerprint: fingerprintInternalPreviewSourceState,
    mapObservations: mapInternalPreviewObservations,
    summarizeSourceState: summarizeInternalPreviewSourceState,
    unsupportedKpis: unsupportedInternalPreviewMetrics,
};
export async function invokeInternalPreviewAdapter(options) {
    return invokeEnterpriseAdapter(internalPreviewAdapterConfig, options);
}
export async function inspectInternalPreviewAdapter() {
    const [inspection, source] = await Promise.all([
        inspectEnterpriseAdapter({
            metadata: internalPreviewAdapterConfig.metadata,
            kpiIds: [
                "KPI-CUST-001",
                "KPI-CUST-002",
                "KPI-CUST-003",
                "KPI-CUST-004",
                "KPI-CUST-005",
                "KPI-OPS-001",
                "KPI-OPS-002",
                "KPI-BUS-001",
                "KPI-BUS-002",
                "KPI-GROW-001",
                "KPI-GROW-002",
            ],
        }),
        readInternalPreviewSourceState(),
    ]);
    return {
        ...inspection,
        sourceVersion: INTERNAL_PREVIEW_SOURCE_VERSION,
        supportedKpis: [
            "KPI-CUST-001",
            "KPI-CUST-002",
            "KPI-CUST-003",
            "KPI-CUST-004",
            "KPI-CUST-005",
            "KPI-OPS-001",
            "KPI-OPS-002",
            "KPI-BUS-001",
            "KPI-BUS-002",
            "KPI-GROW-001",
            "KPI-GROW-002",
        ],
        unsupportedKpis: unsupportedInternalPreviewMetrics,
        latestInternalPreviewState: summarizeInternalPreviewSourceState(source),
        explicitExclusionCount: source.explicitExclusions.length,
        operatingConditionCount: source.operatingConditions.length,
    };
}
