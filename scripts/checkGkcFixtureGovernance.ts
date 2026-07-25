import assert from "node:assert/strict";
import fs from "node:fs";

import {
  GKC_FIXTURE_OBJECTS,
  GKC_KNOWLEDGE_CLASSIFICATIONS,
  GKC_KNOWLEDGE_LIFECYCLE_TRANSITIONS,
  GKC_OBJECT_LIFECYCLE_TRANSITIONS,
  GKC_SAFE_ELIGIBILITY_DEFAULTS,
  GKC_SCHEMA_KEY_REGISTRY,
  GKC_SOURCE_CLASSES,
  GKC_SOURCE_FIXTURES,
  GKC_SOURCE_LIFECYCLE_TRANSITIONS,
  buildGkcAliasDedupeKey,
  buildGkcObjectDedupeKey,
  buildGkcObservationDedupeKey,
  canActivateGkcEligibility,
  createGkcRepresentativeObservations,
  detectGkcAliasCollisions,
  normalizeGkcAliasValue,
  normalizeGkcZipAlias,
  resolveGkcConflictGroup,
  runGkcFixtureGovernanceValidation,
  validateGkcSchemaKeyObservation,
  validateGkcSourceClassification,
  validateGkcSourceRequirement,
  validateLifecycleTransition,
} from "../lib/gkc/fixtureGovernance.js";

function listRuntimeSourceFiles(root: string): string[] {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const path = `${root}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...listRuntimeSourceFiles(path));
      continue;
    }
    if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(path)) {
      files.push(path);
    }
  }

  return files;
}

const packageJson = fs.readFileSync("package.json", "utf8");
const fixtureModule = fs.readFileSync("lib/gkc/fixtureGovernance.ts", "utf8");
const observations = createGkcRepresentativeObservations();
const firstObservation = observations[0];

assert.ok(packageJson.includes("check:gkc-fixture-governance"));
assert.equal(/model\s+Gkc|model\s+GKC|enum\s+Gkc|enum\s+GKC/.test(fs.readFileSync("prisma/schema.prisma", "utf8")), false);
assert.equal(fs.readdirSync("prisma/migrations").some((name) => /gkc/i.test(name)), false);
assert.equal(/DATABASE_URL|DIRECT_URL|SUPABASE|TYPESENSE|RESEND|SECRET|TOKEN|PASSWORD|API_KEY/.test(fixtureModule), false);

for (const object of GKC_FIXTURE_OBJECTS) {
  assert.equal(object.synthetic, true);
  assert.ok(object.id.startsWith("synthetic-"));
  assert.ok(object.canonicalName.startsWith("Synthetic") || object.objectType === "ZIP_CODE");
}

for (const source of GKC_SOURCE_FIXTURES) {
  assert.equal(source.synthetic, true);
  assert.ok(source.id.startsWith("synthetic-"));
}

for (const observation of observations) {
  assert.equal(observation.synthetic, true);
  assert.ok(observation.id.startsWith("synthetic-"));
  assert.deepEqual(observation.eligibility, GKC_SAFE_ELIGIBILITY_DEFAULTS);
}

for (const classification of GKC_KNOWLEDGE_CLASSIFICATIONS) {
  const sourceIdByClassification = {
    AUTHORITATIVE_FACT: "synthetic-source-authoritative-government",
    LICENSED_FACT: "synthetic-source-authoritative-industry",
    ENTERPRISE_OBSERVATION: undefined,
    EDITORIAL_KNOWLEDGE: undefined,
    PROVISIONAL_KNOWLEDGE: "synthetic-source-secondary-public",
    RESTRICTED_KNOWLEDGE: "synthetic-source-authoritative-government",
  } as const;
  const validObservation = {
    ...firstObservation,
    id: `synthetic-observation-${classification.toLocaleLowerCase("en-US").replace(/_/g, "-")}`,
    classification,
    sourceId: sourceIdByClassification[classification],
    derivationIdentity: classification === "ENTERPRISE_OBSERVATION" ? "synthetic-derivation-market-v1" : undefined,
    editorialAuthor: classification === "EDITORIAL_KNOWLEDGE" ? "synthetic-editorial-reviewer" : undefined,
    schemaKey: classification === "EDITORIAL_KNOWLEDGE" ? "editorial.community_summary.v1" : firstObservation.schemaKey,
    valueKind: classification === "EDITORIAL_KNOWLEDGE" ? ("TEXT" as const) : firstObservation.valueKind,
    value: classification === "EDITORIAL_KNOWLEDGE" ? "Synthetic editorial summary." : firstObservation.value,
    unit: classification === "EDITORIAL_KNOWLEDGE" ? "NONE" : firstObservation.unit,
    confidence: classification === "EDITORIAL_KNOWLEDGE" ? ("LOW" as const) : firstObservation.confidence,
  };
  validateGkcSourceRequirement(validObservation);
}
assert.throws(() => validateGkcSourceRequirement({ ...firstObservation, classification: "UNKNOWN" as never }));
assert.throws(() => validateGkcSourceRequirement({ ...firstObservation, sourceId: undefined }));
assert.equal(canActivateGkcEligibility(observations[1], { publicPageEligible: true }), false);
assert.equal(
  canActivateGkcEligibility(
    { ...firstObservation, sourceId: "synthetic-source-authoritative-government", classification: "AUTHORITATIVE_FACT" },
    { publicPageEligible: true },
  ),
  false,
);

for (const sourceClass of GKC_SOURCE_CLASSES) {
  assert.ok(GKC_SOURCE_FIXTURES.some((source) => source.sourceClass === sourceClass));
}
const authoritativeGovernment = GKC_SOURCE_FIXTURES.find((source) => source.sourceClass === "AUTHORITATIVE_GOVERNMENT");
const userSubmitted = GKC_SOURCE_FIXTURES.find((source) => source.sourceClass === "USER_SUBMITTED");
assert.ok(authoritativeGovernment);
assert.ok(userSubmitted);
validateGkcSourceClassification(authoritativeGovernment, "AUTHORITATIVE_FACT");
assert.throws(() => validateGkcSourceClassification(authoritativeGovernment, "LICENSED_FACT"));
assert.throws(() => validateGkcSourceClassification(userSubmitted, "AUTHORITATIVE_FACT"));
assert.throws(() => validateGkcSourceClassification({ ...authoritativeGovernment, health: "RETIRED" }, "AUTHORITATIVE_FACT"));

for (const registryEntry of GKC_SCHEMA_KEY_REGISTRY) {
  assert.equal(registryEntry.version, "v1");
  assert.equal(registryEntry.publicDisplayEligibleByDefault, false);
  const objectType = registryEntry.applicableObjectTypes[0];
  validateGkcSchemaKeyObservation({
    ...firstObservation,
    id: `synthetic-observation-${registryEntry.key}`,
    objectType,
    schemaKey: registryEntry.key,
    sourceId: registryEntry.requiresSource ? firstObservation.sourceId : undefined,
    editorialAuthor: registryEntry.requiresSource ? undefined : "synthetic-editorial-reviewer",
    valueKind: registryEntry.valueKind,
    value:
      registryEntry.valueKind === "NUMBER"
        ? 1
        : registryEntry.valueKind === "JSON"
          ? { synthetic: true }
          : "Synthetic value.",
    unit: registryEntry.unit,
    effectiveDate: registryEntry.requiresEffectiveDate ? "2026-01-01" : undefined,
    confidence: registryEntry.confidenceFloor,
  });
}
assert.throws(() => validateGkcSchemaKeyObservation({ ...firstObservation, schemaKey: "market.unknown.v1" }));
assert.throws(() => validateGkcSchemaKeyObservation({ ...firstObservation, valueKind: "TEXT", value: "wrong" }));
assert.throws(() => validateGkcSchemaKeyObservation({ ...firstObservation, unit: "DAYS" }));
assert.throws(() => validateGkcSchemaKeyObservation({ ...firstObservation, valueKind: "NUMBER", value: "not numeric" }));
assert.throws(() => validateGkcSchemaKeyObservation({ ...observations[3], value: "not json" }));
assert.throws(() => validateGkcSchemaKeyObservation({ ...firstObservation, objectType: "SUBDIVISION" }));
assert.throws(() => validateGkcSchemaKeyObservation({ ...firstObservation, effectiveDate: undefined }));

assert.equal(normalizeGkcAliasValue("  N. Table-Town, CO  "), "north table-town co");
assert.equal(normalizeGkcAliasValue("Mt. Test   Village"), "mount test village");
assert.equal(normalizeGkcZipAlias("80000"), "80000");
assert.equal(normalizeGkcZipAlias("80000-1234"), "80000-1234");
assert.throws(() => normalizeGkcZipAlias("8000"));
const aliases = [
  { objectId: "synthetic-gio-municipality-north-table", aliasText: "North Table", aliasType: "COMMON" as const },
  { objectId: "synthetic-gio-neighborhood-pine-bench", aliasText: " north   table ", aliasType: "COLLOQUIAL" as const },
  { objectId: "synthetic-gio-subdivision-copper-meadow", aliasText: "Copper Meadows", aliasType: "SUBDIVISION_VARIANT" as const },
  { objectId: "synthetic-gio-subdivision-copper-meadow", aliasText: "Copper Meadows", aliasType: "LEGACY" as const, deprecated: true },
];
assert.equal(detectGkcAliasCollisions(aliases).size, 1);
assert.equal(new Set(aliases.map(buildGkcAliasDedupeKey)).size, aliases.length);

validateLifecycleTransition(GKC_OBJECT_LIFECYCLE_TRANSITIONS, "PROPOSED", "ACTIVE");
validateLifecycleTransition(GKC_OBJECT_LIFECYCLE_TRANSITIONS, "ACTIVE", "MERGED");
assert.throws(() => validateLifecycleTransition(GKC_OBJECT_LIFECYCLE_TRANSITIONS, "ARCHIVED", "ACTIVE"));
validateLifecycleTransition(GKC_SOURCE_LIFECYCLE_TRANSITIONS, "PROPOSED", "ACTIVE");
validateLifecycleTransition(GKC_SOURCE_LIFECYCLE_TRANSITIONS, "ACTIVE", "RESTRICTED");
assert.throws(() => validateLifecycleTransition(GKC_SOURCE_LIFECYCLE_TRANSITIONS, "RETIRED", "ACTIVE"));
validateLifecycleTransition(GKC_KNOWLEDGE_LIFECYCLE_TRANSITIONS, "PROPOSED", "VERIFIED");
validateLifecycleTransition(GKC_KNOWLEDGE_LIFECYCLE_TRANSITIONS, "ACTIVE", "REVIEW_DUE");
assert.throws(() => validateLifecycleTransition(GKC_KNOWLEDGE_LIFECYCLE_TRANSITIONS, "ARCHIVED", "ACTIVE"));

assert.throws(() => validateGkcSourceRequirement({ ...firstObservation, classification: "LICENSED_FACT", sourceId: undefined }));
assert.throws(() => validateGkcSourceRequirement({ ...observations[2], classification: "EDITORIAL_KNOWLEDGE", editorialAuthor: undefined }));
assert.throws(() => validateGkcSourceRequirement({ ...firstObservation, classification: "RESTRICTED_KNOWLEDGE", sourceId: undefined }));
assert.equal(
  canActivateGkcEligibility(
    {
      ...firstObservation,
      classification: "PROVISIONAL_KNOWLEDGE",
      sourceId: undefined,
      derivationIdentity: "synthetic-hypothesis",
      schemaKey: "editorial.community_summary.v1",
      valueKind: "TEXT",
      value: "Synthetic internal hypothesis.",
      unit: "NONE",
      effectiveDate: undefined,
      confidence: "LOW",
      reviewStatus: "PENDING_REVIEW",
    },
    { publicPageEligible: true },
  ),
  false,
);

const conflictGroup = resolveGkcConflictGroup(observations, "synthetic-observation-flood-context-a");
assert.equal(conflictGroup.length, 2);
assert.equal(canActivateGkcEligibility(observations[3], { publicPageEligible: true }), false);
const superseded = { ...observations[3], id: "synthetic-observation-flood-context-superseded" };
assert.notEqual(buildGkcObservationDedupeKey(observations[3]), buildGkcObservationDedupeKey({ ...superseded, effectiveDate: "2027-01-01" }));

assert.equal(canActivateGkcEligibility(firstObservation, { internalUse: true }), true);
assert.equal(canActivateGkcEligibility({ ...firstObservation, reviewStatus: "PENDING_REVIEW" }, { searchEligible: true }), false);
assert.equal(canActivateGkcEligibility({ ...firstObservation, freshness: "STALE" }, { indexingEligible: true }), false);
assert.equal(canActivateGkcEligibility(firstObservation, { publicPageEligible: true }), false);

assert.equal(new Set(GKC_FIXTURE_OBJECTS.map(buildGkcObjectDedupeKey)).size, GKC_FIXTURE_OBJECTS.length);
assert.equal(new Set(observations.map(buildGkcObservationDedupeKey)).size, observations.length);
assert.deepEqual(
  observations.map(buildGkcObservationDedupeKey),
  createGkcRepresentativeObservations().map(buildGkcObservationDedupeKey),
);
assert.equal(JSON.stringify(runGkcFixtureGovernanceValidation()), JSON.stringify(runGkcFixtureGovernanceValidation()));

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "lib/tracking", "workers"]) {
  if (!fs.existsSync(runtimeRoot)) {
    continue;
  }
  for (const file of listRuntimeSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("lib/gkc"), false, `Runtime file imports GKC fixtures: ${file}`);
    assert.equal(contents.includes("GKC_"), false, `Runtime file consumes GKC governance constants: ${file}`);
    assert.equal(contents.includes("Gkc"), false, `Runtime file consumes GKC fixture types: ${file}`);
  }
}

const validation = runGkcFixtureGovernanceValidation();
assert.equal(validation.ok, true);
assert.ok(validation.checks.length >= 6);

console.log(
  "[gkc-fixture-governance] ok: synthetic fixtures, classification/source/schema-key/alias/lifecycle/source-requirement/conflict/eligibility/idempotency/runtime-isolation checks passed without database access or runtime activation.",
);
