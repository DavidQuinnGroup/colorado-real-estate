import type { Prisma, PrismaClient } from "@prisma/client";

import {
  buildEipSprint5ApprovalSystemFixtures,
  type EnterpriseKnowledgeApprovalDecisionRecord,
  type EnterpriseKnowledgeApprovalRequest,
  type EnterpriseKnowledgeExecutiveReviewPacket,
} from "./enterpriseKnowledgeApprovalSystem.js";
import { createEipSprint4InternalGeographicActivationReadinessLedger } from "./internalGeographicActivationReadinessLedger.js";
import { createEipSprint2InternalGeographicReadModel } from "./internalGeographicReadModel.js";
import {
  assessEnterpriseKnowledgeQuality,
  qualityInputFromGeographicView,
} from "./enterpriseKnowledgeQualityEngine.js";
import { normalizeGioLookupValue } from "../gio/persistence.js";

export const EIP_SPRINT_6_PILOT_VERSION = "EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT_V1";
export const EIP_SPRINT_6_AUTHORIZATION = "EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT";
export const EIP_SPRINT_6_AUTHORIZED_SUBJECT_ID = "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|001";
export const EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME = "Thornton";
export const EIP_SPRINT_6_AUTHORIZED_DISPLAY_NAME = "Thornton, Colorado";
export const EIP_SPRINT_6_AUTHORIZED_SLUG = "thornton-colorado";
export const EIP_SPRINT_6_AUTHORIZED_SCOPE = "CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT";
export const EIP_SPRINT_6_EFFECTIVE_DATE = new Date("2026-07-25T00:00:00.000Z");

export const EIP_SPRINT_6_WRITE_LIMITS = Object.freeze({
  geographicObjects: 1,
  aliases: 2,
  sources: 1,
  observations: 6,
  eligibilityRows: 1,
  relationships: 0,
  propertyRelationships: 0,
});

export type EipSprint6PilotMode = "dry-run" | "execute" | "inspection" | "retirement-plan";

export type EipSprint6Invocation = Readonly<{
  mode: EipSprint6PilotMode;
  subject: string;
  scope: string;
  invocationId?: string;
  authorized: boolean;
}>;

export type EipSprint6PilotPlan = Readonly<{
  version: typeof EIP_SPRINT_6_PILOT_VERSION;
  authorization: typeof EIP_SPRINT_6_AUTHORIZATION;
  subject: {
    internalId: typeof EIP_SPRINT_6_AUTHORIZED_SUBJECT_ID;
    canonicalName: typeof EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME;
    displayName: typeof EIP_SPRINT_6_AUTHORIZED_DISPLAY_NAME;
    objectType: "MUNICIPALITY";
    canonicalSlug: typeof EIP_SPRINT_6_AUTHORIZED_SLUG;
  };
  evidence: {
    qualityStatus: string;
    readinessLedgerEntryId: string;
    readinessGate: "PRODUCTION_INTERNAL_ONLY_PERSISTENCE";
    approvalRequestId: string;
    reviewPacketId: string;
    approvalDecisionId: string;
    sourceDecisionId: string;
    sourceQueueItemId: string;
    sourcePreviewRecordId: string;
  };
  source: {
    canonicalName: string;
    sourceClass: "INTERNAL";
    authorityLevel: "AUTHORITATIVE";
    accessMethod: "INTERNAL_DERIVATION";
    defaultUpdateCadence: "EVENT_DRIVEN";
    licensingRestriction: false;
    publicDisplayRestriction: true;
    healthState: "READY";
    coverageDescription: string;
  };
  aliases: readonly {
    aliasText: string;
    normalizedValue: string;
    aliasType: "PRIMARY" | "LEGAL";
    language: "en-US";
  }[];
  observations: readonly {
    observationKey: string;
    valueKind: "TEXT" | "JSON";
    valueText?: string;
    valueJson?: Prisma.InputJsonObject;
    valueSchemaKey: string;
    freshness: "FRESH";
    confidence: "HIGH";
    derivationMethod: "MANUAL_REVIEW" | "INTERNAL_DERIVED";
    reviewStatus: "REVIEWED";
    publicVisibility: "INTERNAL_ONLY";
  }[];
  eligibility: {
    internalUse: false;
    searchEligible: false;
    mapEligible: false;
    publicPageEligible: false;
    indexingEligible: false;
    propertyEnrichment: false;
    marketAnalytics: false;
  };
  limits: typeof EIP_SPRINT_6_WRITE_LIMITS;
}>;

type ExistingPilotState = Readonly<{
  object: { id: string; canonicalName: string; displayName: string; canonicalSlug: string; lifecycleStatus: string; visibility: string } | null;
  thorntonCollisions: readonly { id: string; canonicalName: string; displayName: string; canonicalSlug: string }[];
  source: { id: string; canonicalName: string } | null;
  aliases: readonly { id: string; aliasText: string; aliasType: string; normalizedValue: string; language: string | null }[];
  observations: readonly { id: string; observationKey: string; valueSchemaKey: string | null; sourceId: string | null }[];
  eligibility: {
    id: string;
    internalUse: boolean;
    searchEligible: boolean;
    mapEligible: boolean;
    publicPageEligible: boolean;
    indexingEligible: boolean;
    propertyEnrichment: boolean;
    marketAnalytics: boolean;
  } | null;
  relationshipCount: number;
  propertyRelationshipCount: number;
}>;

export type EipSprint6PilotResult = Readonly<{
  success: boolean;
  module: "eip-sprint-6-controlled-production-internal-geographic-persistence-pilot";
  version: typeof EIP_SPRINT_6_PILOT_VERSION;
  mode: EipSprint6PilotMode;
  dryRun: boolean;
  executed: boolean;
  invocationId: string | null;
  authorizedSubject: typeof EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME;
  scope: typeof EIP_SPRINT_6_AUTHORIZED_SCOPE;
  writesPerformed: number;
  created: Readonly<Record<string, number>>;
  reused: Readonly<Record<string, number>>;
  skipped: Readonly<Record<string, number>>;
  plannedCreates: Readonly<Record<string, number>>;
  rowIdentities: Readonly<Record<string, readonly string[]>>;
  eligibility: EipSprint6PilotPlan["eligibility"];
  activation: {
    runtime: false;
    customer: false;
    search: false;
    map: false;
    publicPage: false;
    indexing: false;
    analytics: false;
    ai: false;
    propertyRelationship: false;
  };
  lineage: EipSprint6PilotPlan["evidence"] & {
    sprint6Authorization: typeof EIP_SPRINT_6_AUTHORIZATION;
    invocationId: string | null;
  };
  rollbackPlan: {
    available: true;
    executeByDefault: false;
    affectedRows: Readonly<Record<string, number>>;
    procedure: readonly string[];
  };
  stopConditions: readonly string[];
}>;

export function buildEipSprint6PilotPlan(): EipSprint6PilotPlan {
  const readModel = createEipSprint2InternalGeographicReadModel();
  const subjectView = readModel.retrieveByInternalId(EIP_SPRINT_6_AUTHORIZED_SUBJECT_ID).result;
  if (!subjectView) throw new Error("Thornton fixture is not present in the Sprint 2 read model.");
  const quality = assessEnterpriseKnowledgeQuality(qualityInputFromGeographicView(subjectView));
  const ledger = createEipSprint4InternalGeographicActivationReadinessLedger(readModel.listAll());
  const readinessEntry = ledger.entries.find((entry) =>
    entry.knowledgeObjectId === EIP_SPRINT_6_AUTHORIZED_SUBJECT_ID &&
    entry.gate === "PRODUCTION_INTERNAL_ONLY_PERSISTENCE"
  );
  if (!readinessEntry) throw new Error("Thornton production-internal readiness ledger entry is missing.");
  const approvals = buildEipSprint5ApprovalSystemFixtures(ledger);
  const approvalRequest = requiredApprovalRequest(approvals.requests);
  const reviewPacket = requiredReviewPacket(approvals.packets, approvalRequest);
  const approvalDecision = requiredApprovalDecision(approvals.decisions, approvalRequest);

  const lineage = {
    qualityStatus: quality.overallInternalStatus,
    readinessLedgerEntryId: readinessEntry.ledgerEntryId,
    readinessGate: "PRODUCTION_INTERNAL_ONLY_PERSISTENCE" as const,
    approvalRequestId: approvalRequest.approvalRequestId,
    reviewPacketId: reviewPacket.packetId,
    approvalDecisionId: approvalDecision.decisionId,
    sourceDecisionId: subjectView.metadata.sourceDecisionId,
    sourceQueueItemId: subjectView.metadata.sourceQueueItemId,
    sourcePreviewRecordId: subjectView.metadata.sourcePreviewRecordId,
  };

  const sourceCanonicalName = "PROJECT ATLAS Sprint 6 Thornton Controlled Production-Internal Pilot Evidence";
  const approvalLineage = {
    sprint3QualityStatus: quality.overallInternalStatus,
    sprint4ReadinessLedgerEntryId: readinessEntry.ledgerEntryId,
    sprint5ApprovalRequestId: approvalRequest.approvalRequestId,
    sprint5ReviewPacketId: reviewPacket.packetId,
    sprint5ApprovalDecisionId: approvalDecision.decisionId,
    sprint6Authorization: EIP_SPRINT_6_AUTHORIZATION,
  };

  const plan = Object.freeze({
    version: EIP_SPRINT_6_PILOT_VERSION,
    authorization: EIP_SPRINT_6_AUTHORIZATION,
    subject: {
      internalId: EIP_SPRINT_6_AUTHORIZED_SUBJECT_ID,
      canonicalName: EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME,
      displayName: EIP_SPRINT_6_AUTHORIZED_DISPLAY_NAME,
      objectType: "MUNICIPALITY",
      canonicalSlug: EIP_SPRINT_6_AUTHORIZED_SLUG,
    },
    evidence: lineage,
    source: {
      canonicalName: sourceCanonicalName,
      sourceClass: "INTERNAL",
      authorityLevel: "AUTHORITATIVE",
      accessMethod: "INTERNAL_DERIVATION",
      defaultUpdateCadence: "EVENT_DRIVEN",
      licensingRestriction: false,
      publicDisplayRestriction: true,
      healthState: "READY",
      coverageDescription: "Internal PROJECT ATLAS EIP Sprint 1-6 approval, quality, readiness, source, and trust evidence for Thornton, Colorado.",
    },
    aliases: Object.freeze([
      Object.freeze({
        aliasText: "Thornton",
        normalizedValue: normalizeGioLookupValue("Thornton"),
        aliasType: "PRIMARY" as const,
        language: "en-US" as const,
      }),
      Object.freeze({
        aliasText: "City of Thornton",
        normalizedValue: normalizeGioLookupValue("City of Thornton"),
        aliasType: "LEGAL" as const,
        language: "en-US" as const,
      }),
    ]),
    observations: Object.freeze([
      observation("canonical_municipality_name", "TEXT", "Thornton", "gio.municipality.canonical_name.v1", "MANUAL_REVIEW"),
      observation("municipality_classification", "TEXT", "MUNICIPALITY", "gio.municipality.classification.v1", "MANUAL_REVIEW"),
      observation("state_association", "TEXT", "Colorado", "gio.municipality.state_association.v1", "MANUAL_REVIEW"),
      observation("approved_internal_identity_assertion", "JSON", undefined, "gio.municipality.internal_identity_assertion.v1", "INTERNAL_DERIVED", {
        canonicalName: "Thornton",
        displayName: "Thornton, Colorado",
        objectType: "MUNICIPALITY",
        canonicalSlug: EIP_SPRINT_6_AUTHORIZED_SLUG,
        finalCanonicalCustomerSelection: false,
      }),
      observation("approval_lineage", "JSON", undefined, "gio.municipality.approval_lineage.v1", "INTERNAL_DERIVED", approvalLineage),
      observation("runtime_isolation_assertion", "JSON", undefined, "gio.municipality.runtime_isolation.v1", "INTERNAL_DERIVED", {
        searchEligible: false,
        mapEligible: false,
        publicPageEligible: false,
        indexingEligible: false,
        propertyEnrichment: false,
        marketAnalytics: false,
        aiEligible: false,
        customerVisible: false,
      }),
    ]),
    eligibility: {
      internalUse: false,
      searchEligible: false,
      mapEligible: false,
      publicPageEligible: false,
      indexingEligible: false,
      propertyEnrichment: false,
      marketAnalytics: false,
    },
    limits: EIP_SPRINT_6_WRITE_LIMITS,
  } satisfies EipSprint6PilotPlan);
  validateEipSprint6PilotPlan(plan);
  return plan;
}

export function validateEipSprint6Invocation(invocation: EipSprint6Invocation): void {
  if (!invocation.authorized) throw new Error("Sprint 6 pilot requires admin authorization.");
  if (!isAuthorizedSubject(invocation.subject)) throw new Error("Thornton is the only authorized Sprint 6 pilot subject.");
  if (invocation.scope !== EIP_SPRINT_6_AUTHORIZED_SCOPE) throw new Error("Sprint 6 pilot scope is not authorized.");
  if ((invocation.mode === "execute" || invocation.mode === "dry-run") && !invocation.invocationId?.trim()) {
    throw new Error("Sprint 6 dry-run and execute modes require a unique invocation ID.");
  }
}

export function validateEipSprint6PilotPlan(plan: EipSprint6PilotPlan): void {
  if (plan.subject.objectType !== "MUNICIPALITY") throw new Error("Sprint 6 pilot is limited to Municipality.");
  if (plan.subject.canonicalName !== EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME) throw new Error("Sprint 6 pilot is limited to Thornton.");
  if (plan.subject.canonicalSlug !== EIP_SPRINT_6_AUTHORIZED_SLUG) throw new Error("Sprint 6 pilot slug must remain stable.");
  if (plan.evidence.qualityStatus !== "READY") throw new Error("Thornton quality evidence is not READY.");
  if (plan.aliases.length > EIP_SPRINT_6_WRITE_LIMITS.aliases) throw new Error("Sprint 6 alias plan exceeds authorized limit.");
  if (plan.observations.length > EIP_SPRINT_6_WRITE_LIMITS.observations) throw new Error("Sprint 6 observation plan exceeds authorized limit.");
  if (Object.values(plan.eligibility).some(Boolean)) throw new Error("Sprint 6 eligibility flags must remain false.");
}

export async function invokeEipSprint6Pilot(
  prisma: PrismaClient,
  invocation: EipSprint6Invocation,
): Promise<EipSprint6PilotResult> {
  validateEipSprint6Invocation(invocation);
  const plan = buildEipSprint6PilotPlan();
  const state = await readExistingPilotState(prisma, plan);
  const stopConditions = validateExistingState(state, plan);
  if (stopConditions.length > 0) return resultFor(plan, invocation, state, zeroCounts(), zeroCounts(), stopConditions);

  if (invocation.mode === "inspection" || invocation.mode === "retirement-plan" || invocation.mode === "dry-run") {
    return resultFor(plan, invocation, state, zeroCounts(), reuseCountsFor(state, plan), []);
  }

  const created = zeroCounts();
  const reused = zeroCounts();

  const finalState = await prisma.$transaction(async (tx) => {
    const source = await tx.geographicSource.findUnique({ where: { canonicalName: plan.source.canonicalName } });
    const sourceRow = source ?? await tx.geographicSource.create({
      data: {
        canonicalName: plan.source.canonicalName,
        sourceClass: plan.source.sourceClass,
        authorityLevel: plan.source.authorityLevel,
        accessMethod: plan.source.accessMethod,
        coverageDescription: plan.source.coverageDescription,
        defaultUpdateCadence: plan.source.defaultUpdateCadence,
        licensingRestriction: plan.source.licensingRestriction,
        publicDisplayRestriction: plan.source.publicDisplayRestriction,
        healthState: plan.source.healthState,
      },
    });
    if (source) {
      reused.sources++;
    } else {
      created.sources++;
    }

    const object = await tx.geographicObject.findUnique({
      where: { objectType_canonicalSlug: { objectType: plan.subject.objectType, canonicalSlug: plan.subject.canonicalSlug } },
    });
    const objectRow = object ?? await tx.geographicObject.create({
      data: {
        objectType: plan.subject.objectType,
        canonicalName: plan.subject.canonicalName,
        displayName: plan.subject.displayName,
        canonicalSlug: plan.subject.canonicalSlug,
        lifecycleStatus: "DRAFT",
        visibility: "INTERNAL_ONLY",
      },
    });
    if (object) {
      reused.geographicObjects++;
    } else {
      created.geographicObjects++;
    }

    for (const alias of plan.aliases) {
      const existing = await tx.geographicAlias.findFirst({
        where: {
          objectId: objectRow.id,
          normalizedValue: alias.normalizedValue,
          aliasType: alias.aliasType,
          language: alias.language,
          lifecycleStatus: "ACTIVE",
        },
      });
      if (existing) {
        reused.aliases++;
      } else {
        await tx.geographicAlias.create({
          data: {
            objectId: objectRow.id,
            aliasText: alias.aliasText,
            normalizedValue: alias.normalizedValue,
            aliasType: alias.aliasType,
            language: alias.language,
            sourceId: sourceRow.id,
            lifecycleStatus: "ACTIVE",
            effectiveDate: EIP_SPRINT_6_EFFECTIVE_DATE,
          },
        });
        created.aliases++;
      }
    }

    for (const item of plan.observations) {
      const existing = await tx.geographicObservation.findFirst({
        where: {
          objectId: objectRow.id,
          sourceId: sourceRow.id,
          observationKey: item.observationKey,
          valueSchemaKey: item.valueSchemaKey,
          effectiveDate: EIP_SPRINT_6_EFFECTIVE_DATE,
        },
      });
      if (existing) {
        reused.observations++;
      } else {
        await tx.geographicObservation.create({
          data: {
            objectId: objectRow.id,
            sourceId: sourceRow.id,
            observationKey: item.observationKey,
            valueKind: item.valueKind,
            valueText: item.valueText,
            valueJson: item.valueJson,
            valueSchemaKey: item.valueSchemaKey,
            effectiveDate: EIP_SPRINT_6_EFFECTIVE_DATE,
            retrievedAt: EIP_SPRINT_6_EFFECTIVE_DATE,
            verifiedAt: EIP_SPRINT_6_EFFECTIVE_DATE,
            freshness: item.freshness,
            confidence: item.confidence,
            derivationMethod: item.derivationMethod,
            reviewStatus: item.reviewStatus,
            publicVisibility: item.publicVisibility,
          },
        });
        created.observations++;
      }
    }

    const eligibility = await tx.geographicEligibility.findUnique({ where: { objectId: objectRow.id } });
    if (eligibility) {
      reused.eligibilityRows++;
    } else {
      await tx.geographicEligibility.create({
        data: {
          objectId: objectRow.id,
          ...plan.eligibility,
        },
      });
      created.eligibilityRows++;
    }

    return readExistingPilotState(tx as unknown as PrismaClient, plan);
  });

  return resultFor(plan, invocation, finalState, created, reused, []);
}

export async function inspectEipSprint6Pilot(prisma: PrismaClient): Promise<EipSprint6PilotResult> {
  const plan = buildEipSprint6PilotPlan();
  const state = await readExistingPilotState(prisma, plan);
  return resultFor(plan, {
    mode: "inspection",
    subject: EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME,
    scope: EIP_SPRINT_6_AUTHORIZED_SCOPE,
    authorized: true,
  }, state, zeroCounts(), reuseCountsFor(state, plan), validateExistingState(state, plan));
}

function observation(
  observationKey: string,
  valueKind: "TEXT" | "JSON",
  valueText: string | undefined,
  valueSchemaKey: string,
  derivationMethod: "MANUAL_REVIEW" | "INTERNAL_DERIVED",
  valueJson?: Prisma.InputJsonObject,
) {
  return Object.freeze({
    observationKey,
    valueKind,
    valueText,
    valueJson,
    valueSchemaKey,
    freshness: "FRESH" as const,
    confidence: "HIGH" as const,
    derivationMethod,
    reviewStatus: "REVIEWED" as const,
    publicVisibility: "INTERNAL_ONLY" as const,
  });
}

function requiredApprovalRequest(requests: readonly EnterpriseKnowledgeApprovalRequest[]) {
  const request = requests.find((item) => item.approvalRequestId === "EIP_SPRINT_5_APPROVAL_REQUEST|001|SEARCH");
  if (!request) throw new Error("Thornton Sprint 5 approval request is missing.");
  return request;
}

function requiredReviewPacket(
  packets: readonly EnterpriseKnowledgeExecutiveReviewPacket[],
  request: EnterpriseKnowledgeApprovalRequest,
) {
  const packet = packets.find((item) => item.approvalRequestId === request.approvalRequestId);
  if (!packet) throw new Error("Thornton Sprint 5 executive review packet is missing.");
  return packet;
}

function requiredApprovalDecision(
  decisions: readonly EnterpriseKnowledgeApprovalDecisionRecord[],
  request: EnterpriseKnowledgeApprovalRequest,
) {
  const decision = decisions.find((item) =>
    item.approvalRequestId === request.approvalRequestId &&
    item.decision === "APPROVED_FOR_DEFINED_NEXT_STEP"
  );
  if (!decision) throw new Error("Thornton Sprint 5 bounded next-step approval is missing.");
  return decision;
}

function isAuthorizedSubject(subject: string) {
  const normalized = normalizeGioLookupValue(subject);
  return normalized === "thornton" ||
    normalized === "thornton, colorado" ||
    normalized === "thornton colorado" ||
    normalized === "thornton-co" ||
    normalized === EIP_SPRINT_6_AUTHORIZED_SLUG;
}

async function readExistingPilotState(prisma: PrismaClient, plan: EipSprint6PilotPlan): Promise<ExistingPilotState> {
  const object = await prisma.geographicObject.findUnique({
    where: { objectType_canonicalSlug: { objectType: plan.subject.objectType, canonicalSlug: plan.subject.canonicalSlug } },
    select: { id: true, canonicalName: true, displayName: true, canonicalSlug: true, lifecycleStatus: true, visibility: true },
  });
  const thorntonCollisions = await prisma.geographicObject.findMany({
    where: {
      objectType: plan.subject.objectType,
      OR: [
        { canonicalName: { equals: plan.subject.canonicalName, mode: "insensitive" } },
        { displayName: { equals: plan.subject.displayName, mode: "insensitive" } },
        { canonicalSlug: plan.subject.canonicalSlug },
      ],
    },
    select: { id: true, canonicalName: true, displayName: true, canonicalSlug: true },
  });
  const source = await prisma.geographicSource.findUnique({
    where: { canonicalName: plan.source.canonicalName },
    select: { id: true, canonicalName: true },
  });
  const aliases = object ? await prisma.geographicAlias.findMany({
    where: { objectId: object.id },
    select: { id: true, aliasText: true, aliasType: true, normalizedValue: true, language: true },
    orderBy: { aliasText: "asc" },
  }) : [];
  const observations = object ? await prisma.geographicObservation.findMany({
    where: { objectId: object.id },
    select: { id: true, observationKey: true, valueSchemaKey: true, sourceId: true },
    orderBy: { observationKey: "asc" },
  }) : [];
  const eligibility = object ? await prisma.geographicEligibility.findUnique({
    where: { objectId: object.id },
    select: {
      id: true,
      internalUse: true,
      searchEligible: true,
      mapEligible: true,
      publicPageEligible: true,
      indexingEligible: true,
      propertyEnrichment: true,
      marketAnalytics: true,
    },
  }) : null;
  const relationshipCount = object ? await prisma.geographicRelationship.count({
    where: { OR: [{ sourceObjectId: object.id }, { targetObjectId: object.id }] },
  }) : 0;
  const propertyRelationshipCount = object ? await prisma.propertyGeographicRelationship.count({
    where: { geographicObjectId: object.id },
  }) : 0;

  return Object.freeze({
    object,
    thorntonCollisions,
    source,
    aliases,
    observations,
    eligibility,
    relationshipCount,
    propertyRelationshipCount,
  });
}

function validateExistingState(state: ExistingPilotState, plan: EipSprint6PilotPlan): readonly string[] {
  const stops: string[] = [];
  const unauthorizedCollisions = state.thorntonCollisions.filter((item) => item.canonicalSlug !== plan.subject.canonicalSlug);
  if (unauthorizedCollisions.length > 0) stops.push("UNRESOLVED_THORNTON_COLLISION");
  if (state.object && (state.object.lifecycleStatus !== "DRAFT" || state.object.visibility !== "INTERNAL_ONLY")) stops.push("PILOT_OBJECT_NOT_INTERNAL_DRAFT");
  if (state.eligibility && Object.values(state.eligibility).some((value) => value === true)) stops.push("PILOT_ELIGIBILITY_FLAG_TRUE");
  if (state.relationshipCount > 0) stops.push("GEOGRAPHIC_RELATIONSHIP_PRESENT");
  if (state.propertyRelationshipCount > 0) stops.push("PROPERTY_RELATIONSHIP_PRESENT");
  return Object.freeze(stops);
}

function resultFor(
  plan: EipSprint6PilotPlan,
  invocation: EipSprint6Invocation,
  state: ExistingPilotState,
  created: Record<string, number>,
  reused: Record<string, number>,
  stopConditions: readonly string[],
): EipSprint6PilotResult {
  const plannedCreates = stopConditions.length > 0 ? zeroCounts() : plannedCreatesFor(state, plan);
  const writesPerformed = invocation.mode === "execute" ? Object.values(created).reduce((sum, value) => sum + value, 0) : 0;

  return Object.freeze({
    success: stopConditions.length === 0,
    module: "eip-sprint-6-controlled-production-internal-geographic-persistence-pilot" as const,
    version: EIP_SPRINT_6_PILOT_VERSION,
    mode: invocation.mode,
    dryRun: invocation.mode === "dry-run",
    executed: invocation.mode === "execute",
    invocationId: invocation.invocationId ?? null,
    authorizedSubject: EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME,
    scope: EIP_SPRINT_6_AUTHORIZED_SCOPE,
    writesPerformed,
    created: Object.freeze(created),
    reused: Object.freeze(reused),
    skipped: Object.freeze(stopConditions.length > 0 ? plannedCreatesFor(state, plan) : zeroCounts()),
    plannedCreates: Object.freeze(plannedCreates),
    rowIdentities: Object.freeze({
      object: Object.freeze(state.object ? [state.object.id] : []),
      source: Object.freeze(state.source ? [state.source.id] : []),
      aliases: Object.freeze(state.aliases.map((item) => item.id)),
      observations: Object.freeze(state.observations.map((item) => item.id)),
      eligibility: Object.freeze(state.eligibility ? [state.eligibility.id] : []),
      relationships: Object.freeze([]),
      propertyRelationships: Object.freeze([]),
    }),
    eligibility: plan.eligibility,
    activation: {
      runtime: false as const,
      customer: false as const,
      search: false as const,
      map: false as const,
      publicPage: false as const,
      indexing: false as const,
      analytics: false as const,
      ai: false as const,
      propertyRelationship: false as const,
    },
    lineage: {
      ...plan.evidence,
      sprint6Authorization: EIP_SPRINT_6_AUTHORIZATION as typeof EIP_SPRINT_6_AUTHORIZATION,
      invocationId: invocation.invocationId ?? null,
    },
    rollbackPlan: {
      available: true as const,
      executeByDefault: false as const,
      affectedRows: Object.freeze({
        geographicObjects: state.object ? 1 : plannedCreates.geographicObjects,
        aliases: state.aliases.length || plannedCreates.aliases,
        sources: state.source ? 1 : plannedCreates.sources,
        observations: state.observations.length || plannedCreates.observations,
        eligibilityRows: state.eligibility ? 1 : plannedCreates.eligibilityRows,
        relationships: state.relationshipCount,
        propertyRelationships: state.propertyRelationshipCount,
      }),
      procedure: Object.freeze([
        "Confirm no PropertyGeographicRelationship rows exist for the pilot object.",
        "Confirm no runtime module imports the Sprint 6 pilot module.",
        "Retire by setting GeographicObject.lifecycleStatus to ARCHIVED only under a separately authorized rollback invocation, or delete pilot rows in dependency order if executive rollback requires removal.",
        "Dependency order for removal would be observations, aliases, eligibility, source if unused, then object.",
      ]),
    },
    stopConditions: Object.freeze([...stopConditions]),
  });
}

function plannedCreatesFor(state: ExistingPilotState, plan: EipSprint6PilotPlan) {
  return {
    geographicObjects: state.object ? 0 : 1,
    aliases: Math.max(0, plan.aliases.length - state.aliases.length),
    sources: state.source ? 0 : 1,
    observations: Math.max(0, plan.observations.length - state.observations.length),
    eligibilityRows: state.eligibility ? 0 : 1,
    relationships: 0,
    propertyRelationships: 0,
  };
}

function reuseCountsFor(state: ExistingPilotState, plan: EipSprint6PilotPlan) {
  return {
    geographicObjects: state.object ? 1 : 0,
    aliases: Math.min(state.aliases.length, plan.aliases.length),
    sources: state.source ? 1 : 0,
    observations: Math.min(state.observations.length, plan.observations.length),
    eligibilityRows: state.eligibility ? 1 : 0,
    relationships: 0,
    propertyRelationships: 0,
  };
}

function zeroCounts() {
  return {
    geographicObjects: 0,
    aliases: 0,
    sources: 0,
    observations: 0,
    eligibilityRows: 0,
    relationships: 0,
    propertyRelationships: 0,
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/eip/controlledProductionInternalGeographicPersistencePilot.ts
