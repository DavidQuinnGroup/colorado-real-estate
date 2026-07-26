import { assertGisFailClosedActivation } from "./activationContract.js";
import {
  type GisProviderInventoryEntry,
  type GisProviderOverlap,
} from "./providerInventoryContract.js";

const jurisdictionalClassNames = [
  "county assessor source class",
  "county clerk and recorder source class",
  "building-department source class",
  "planning-department source class",
  "school district source class",
];

export function validateGisProviderInventoryEntry(entry: GisProviderInventoryEntry): readonly string[] {
  const failures: string[] = [];
  if (!entry.inventoryEntryId) failures.push("INVENTORY_ENTRY_ID_REQUIRED");
  if (!entry.canonicalName) failures.push("CANONICAL_NAME_REQUIRED");
  if (entry.entityTypes.length === 0) failures.push("ENTITY_TYPE_REQUIRED");
  if (!entry.verificationState) failures.push("VERIFICATION_STATE_REQUIRED");
  if (!entry.governanceDisposition) failures.push("GOVERNANCE_DISPOSITION_REQUIRED");
  if (!entry.licensingClassification) failures.push("LICENSING_CLASSIFICATION_REQUIRED");
  if (!entry.permittedUse) failures.push("PERMITTED_USE_REQUIRED");
  if (entry.customerDisplayAuthorized !== false) failures.push("CUSTOMER_DISPLAY_MUST_BE_FALSE");
  if (entry.redistributionAuthorized !== false) failures.push("REDISTRIBUTION_MUST_BE_FALSE");
  if (entry.internalOnly !== true) failures.push("ENTRY_MUST_BE_INTERNAL_ONLY");
  if (Object.values(entry.activation).some((value) => value !== false)) failures.push("ACTIVATION_MUST_BE_FALSE");
  if (entry.licensingClassification === "UNKNOWN") failures.push("LICENSING_UNKNOWN_FAIL_CLOSED");
  if (entry.permittedUse === "UNKNOWN") failures.push("PERMITTED_USE_UNKNOWN_FAIL_CLOSED");
  if (entry.governanceDisposition === "APPROVED_FOR_FUTURE_PROVIDER_EVALUATION" && entry.activation.acquisitionAuthorized) failures.push("FUTURE_EVALUATION_CANNOT_AUTHORIZE_ACQUISITION");
  if (entry.verificationState === "NOT_VERIFIED" && entry.lastVerifiedDate) failures.push("UNVERIFIED_CURRENT_STATE_CANNOT_HAVE_VERIFIED_DATE");
  if (entry.providerRoles.includes("OPERATIONAL_TOOL") && entry.providerRoles.includes("ORIGINATING_AUTHORITY")) failures.push("OPERATIONAL_TOOL_CANNOT_BE_ORIGINATING_AUTHORITY");
  if (entry.entityTypes.includes("CONSUMER_PORTAL") && entry.providerRoles.includes("ORIGINATING_AUTHORITY")) failures.push("CONSUMER_PORTAL_CANNOT_BE_ORIGINATING_AUTHORITY");
  if (entry.entityTypes.includes("GENERIC_SOURCE_CLASS") && entry.jurisdiction && jurisdictionalClassNames.includes(entry.canonicalName.toLowerCase())) failures.push("GENERIC_SOURCE_CLASS_CANNOT_MASQUERADE_AS_INSTANCE");
  if (entry.entityTypes.includes("GENERIC_SOURCE_CLASS") && entry.sourcePreference === "POTENTIAL_PRIMARY_AUTHORITY") failures.push("GENERIC_SOURCE_CLASS_CANNOT_BE_PRIMARY_AUTHORITY");
  if (entry.governanceDisposition === "REJECTED" && !entry.rejectionReason) failures.push("REJECTED_ENTRY_REQUIRES_REASON");
  if (entry.governanceDisposition === "RETIRED" && !entry.notes) failures.push("RETIRED_ENTRY_REQUIRES_TRACE");
  return Object.freeze(failures);
}

export function assertGisProviderInventoryEntryFailClosed(entry: GisProviderInventoryEntry): void {
  assertGisFailClosedActivation(entry.activation);
  if (entry.customerDisplayAuthorized !== false || entry.redistributionAuthorized !== false) {
    throw new Error("Provider inventory entries must keep customer display and redistribution false.");
  }
}

export function validateGisProviderOverlap(overlap: GisProviderOverlap, entryIds: readonly string[]): readonly string[] {
  const failures: string[] = [];
  if (!overlap.overlapId) failures.push("OVERLAP_ID_REQUIRED");
  if (overlap.involvedInventoryEntryIds.length < 2) failures.push("OVERLAP_REQUIRES_MULTIPLE_ENTRIES");
  for (const id of overlap.involvedInventoryEntryIds) {
    if (!entryIds.includes(id)) failures.push("OVERLAP_UNKNOWN_ENTRY");
  }
  if (overlap.unresolved !== true) failures.push("OVERLAP_MUST_REMAIN_UNRESOLVED");
  if (overlap.equivalent !== false) failures.push("OVERLAP_MUST_NOT_IMPLY_EQUIVALENCE");
  if (overlap.internalOnly !== true) failures.push("OVERLAP_MUST_BE_INTERNAL_ONLY");
  return Object.freeze(failures);
}

export function deterministicProviderInventorySummary(entries: readonly GisProviderInventoryEntry[], overlaps: readonly GisProviderOverlap[]): Readonly<{
  entryCount: number;
  overlapCount: number;
  categoryCount: number;
  namedEntryIds: readonly string[];
}> {
  return Object.freeze({
    entryCount: entries.length,
    overlapCount: overlaps.length,
    categoryCount: new Set(entries.map((entry) => entry.category)).size,
    namedEntryIds: Object.freeze(entries.map((entry) => entry.inventoryEntryId).sort()),
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/providerInventoryValidation.ts
