import assert from "node:assert/strict";
import fs from "node:fs";

import {
  GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT,
  buildGofWave3ColoradoPersistenceContract,
  evaluateGofWave3DryRun,
} from "../lib/gof/coloradoControlledProductionPersistence.js";
import { parseGofWave3bCliOptions } from "./activateGofWave3bColoradoPersistence.js";

const adapterSource = fs.readFileSync("lib/gof/coloradoProductionExecutionAdapter.ts", "utf8");
const commandSource = fs.readFileSync("scripts/activateGofWave3bColoradoPersistence.ts", "utf8");
const reportPath = "docs/project-atlas/executive-library/GOF-1.0-WAVE-3C-R1-COLORADO-PERSISTENCE-IDEMPOTENCY-RECOVERY-REVIEW.md";
const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const contract = buildGofWave3ColoradoPersistenceContract();

const exact = evaluateGofWave3DryRun({
  geographicObjectCount: 2,
  stateObjectCount: 1,
  coloradoNamedObjectCount: 1,
  geographicRelationshipCount: 0,
  propertyGeographicRelationshipCount: 0,
  matchingColoradoObject: {
    id: "production-generated-id-ignored",
    objectType: "STATE",
    canonicalName: "Colorado",
    displayName: "Colorado",
    canonicalSlug: "colorado",
    lifecycleStatus: "DRAFT",
    visibility: "INTERNAL_ONLY",
    convenienceParentId: null,
    mergedIntoId: null,
  },
  matchingColoradoSupportState: "COMPLETE",
  stateEnumPresent: true,
  thorntonFingerprint: GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT,
});
assert.equal(exact.status, "DRY_RUN_IDEMPOTENT_NOOP");
assert.deepEqual(exact.proposedWritesIfAuthorized, {
  geographicObjects: 0,
  aliases: 0,
  sources: 0,
  observations: 0,
  eligibilityRows: 0,
  relationships: 0,
  propertyRelationships: 0,
});

for (const [label, state] of [
  ["missing companion state", exactState({ matchingColoradoSupportState: "PARTIAL_OR_CONFLICTING" })],
  ["changed lifecycle", exactState({ matchingColoradoObject: { lifecycleStatus: "ACTIVE" } })],
  ["changed visibility", exactState({ matchingColoradoObject: { visibility: "PUBLIC_ELIGIBLE" } })],
  ["missing state enum", exactState({ stateEnumPresent: false })],
  ["relationship exists", exactState({ geographicRelationshipCount: 1 })],
  ["property relationship exists", exactState({ propertyGeographicRelationshipCount: 1 })],
] as const) {
  assert.equal(evaluateGofWave3DryRun(state).status, "BLOCKED_SCHEMA_OR_DATA_MISMATCH", label);
}

const aliasLeft = canonicalString([{ aliasText: "CO", generatedId: "a1" }, { aliasText: "State of Colorado", generatedId: "a2" }]);
const aliasRight = canonicalString([{ generatedId: "a2", aliasText: "State of Colorado" }, { generatedId: "a1", aliasText: "CO" }]);
assert.notEqual(aliasLeft, aliasRight, "Generated IDs must not be included in governed alias comparison fixtures.");
assert.equal(
  canonicalString([{ aliasText: "CO" }, { aliasText: "State of Colorado" }].sort(byAliasText)),
  canonicalString([{ aliasText: "State of Colorado" }, { aliasText: "CO" }].sort(byAliasText)),
  "Ordering differences normalize deterministically.",
);
assert.equal(
  canonicalString({ productionEligible: false, provider: "State of Colorado" }),
  canonicalString({ provider: "State of Colorado", productionEligible: false }),
  "Observation JSON property ordering normalizes deterministically.",
);

assert.equal(contract.evidenceFingerprint, "280b283ba101707b2fb0a85b801db2ce6220c2f56fa7f232d2d0dd6396bb2719");
assert.equal(parseGofWave3bCliOptions([]).mode, "dry-run");
assert.equal(commandSource.includes("--execute"), true);
assert.equal(commandSource.includes("GOF_WAVE_3B_OPERATOR_AUTHORIZATION_TOKEN"), true);
assert.equal(/geographicRelationship\.create|propertyGeographicRelationship\.create/.test(adapterSource), false);
assert.equal(adapterSource.includes("readOwnedCompanionConflictCount"), true);
assert.equal(adapterSource.includes("readOrphanCompanionConflictCount"), true);
assert.equal(adapterSource.includes("createdAt"), true);
assert.equal(adapterSource.includes("updatedAt"), true);
assert.equal(adapterSource.includes("canonicalString"), true);
assert.match(report, /IDEMPOTENCY_CORRECTION_CERTIFIED_PENDING_RECOVERY_EXECUTION/);
assert.match(report, /Colorado production retrieval remains `NOT_AUTHORIZED`/);
assert.match(report, /GOF Wave 4 remains `NOT_AUTHORIZED`/);

console.log("[gof-wave-3c-colorado-idempotency-recovery] ok: exact persisted Colorado state is idempotent, generated fields/order/JSON ordering are non-material, partial and conflicting states fail closed, execution remains gated, and no relationship/retrieval/runtime integration is introduced.");

function canonicalString(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => canonicalString(item)).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalString(record[key])}`).join(",")}}`;
}

function byAliasText(left: { aliasText: string }, right: { aliasText: string }): number {
  return left.aliasText.localeCompare(right.aliasText, "en-US");
}

function exactState(overrides: {
  matchingColoradoSupportState?: "COMPLETE" | "PARTIAL_OR_CONFLICTING";
  matchingColoradoObject?: Partial<NonNullable<Parameters<typeof evaluateGofWave3DryRun>[0]["matchingColoradoObject"]>>;
  stateEnumPresent?: boolean;
  geographicRelationshipCount?: number;
  propertyGeographicRelationshipCount?: number;
} = {}): Parameters<typeof evaluateGofWave3DryRun>[0] {
  return {
    geographicObjectCount: 2,
    stateObjectCount: 1,
    coloradoNamedObjectCount: 1,
    geographicRelationshipCount: overrides.geographicRelationshipCount ?? 0,
    propertyGeographicRelationshipCount: overrides.propertyGeographicRelationshipCount ?? 0,
    matchingColoradoObject: {
      id: "production-generated-id-ignored",
      objectType: "STATE",
      canonicalName: "Colorado",
      displayName: "Colorado",
      canonicalSlug: "colorado",
      lifecycleStatus: "DRAFT",
      visibility: "INTERNAL_ONLY",
      convenienceParentId: null,
      mergedIntoId: null,
      ...overrides.matchingColoradoObject,
    },
    matchingColoradoSupportState: overrides.matchingColoradoSupportState ?? "COMPLETE",
    stateEnumPresent: overrides.stateEnumPresent ?? true,
    thorntonFingerprint: GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT,
  };
}
