import assert from "node:assert/strict";
import fs from "node:fs";

import {
  GIO_AUTHORIZED_OBJECT_TYPES,
  GIO_SAFE_ELIGIBILITY_DEFAULTS,
  assertGioAuthorizedObjectType,
  assertGioEffectiveDateRange,
  buildGioObjectIdempotencyKey,
  normalizeGioLookupValue,
  validateGioObjectCreateInput,
} from "../lib/gio/persistence.js";

const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
const migration = fs.readFileSync(
  "prisma/migrations/20260725143000_gio_wave3_additive_persistence_foundation/migration.sql",
  "utf8",
);
const packageJson = fs.readFileSync("package.json", "utf8");

const expectedModels = [
  "GeographicObject",
  "GeographicAlias",
  "GeographicRelationship",
  "GeographicSource",
  "GeographicObservation",
  "GeographicEligibility",
  "PropertyGeographicRelationship",
];

for (const model of expectedModels) {
  assert.ok(schema.includes(`model ${model} `), `Missing Prisma model ${model}`);
  assert.ok(migration.includes(`CREATE TABLE "${model}"`), `Missing migration table ${model}`);
}

const expectedEnums = [
  "GeographicObjectType",
  "GeographicLifecycleStatus",
  "GeographicVisibility",
  "GeographicAliasType",
  "GeographicRelationshipType",
  "GeographicDirectionality",
  "GeographicSourceClass",
  "GeographicAuthorityLevel",
  "GeographicAccessMethod",
  "GeographicUpdateCadence",
  "GeographicHealthState",
  "GeographicConfidence",
  "GeographicObservationValueKind",
  "GeographicFreshness",
  "GeographicDerivationMethod",
  "GeographicReviewStatus",
  "GeographicPropertyRelationshipType",
];

for (const enumName of expectedEnums) {
  assert.ok(schema.includes(`enum ${enumName} `), `Missing enum ${enumName}`);
  assert.ok(migration.includes(`CREATE TYPE "${enumName}"`), `Missing migration enum ${enumName}`);
}

const objectTypeBlock = schema.match(/enum GeographicObjectType \{([\s\S]*?)\}/)?.[1] ?? "";
const objectTypeValues = objectTypeBlock
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);
assert.deepEqual(objectTypeValues, [...GIO_AUTHORIZED_OBJECT_TYPES]);
for (const disallowedType of [
  "SCHOOL_DISTRICT",
  "SCHOOL",
  "COUNTY",
  "PARCEL",
  "HOA",
  "BUILDER",
]) {
  assert.equal(objectTypeBlock.includes(disallowedType), false, `Disallowed GIO object type present: ${disallowedType}`);
}

for (const requiredPropertyField of [
  "city                 String",
  "state                String",
  "zip                  String",
  "lat                  Float",
  "lng                  Float",
  "neighborhood         String?",
  "subdivision          String?",
  "schoolDistrict       String?",
]) {
  assert.ok(schema.includes(requiredPropertyField), `Existing Property geography field changed or missing: ${requiredPropertyField}`);
}

assert.ok(schema.includes("@@unique([objectType, canonicalSlug])"));
assert.ok(schema.includes("@@unique([objectId, normalizedValue, aliasType, language, lifecycleStatus])"));
assert.ok(schema.includes("@@unique([sourceObjectId, targetObjectId, relationshipType, directionality, lifecycleStatus])"));
assert.ok(schema.includes("@@unique([propertyId, geographicObjectId, relationshipType, lifecycleStatus])"));

for (const [key, value] of Object.entries(GIO_SAFE_ELIGIBILITY_DEFAULTS)) {
  assert.equal(value, false, `GIO eligibility default must stay false: ${key}`);
  assert.ok(schema.includes(`${key}`), `Missing eligibility field ${key}`);
}
assert.match(schema, /internalUse\s+Boolean\s+@default\(false\)/);
assert.match(schema, /searchEligible\s+Boolean\s+@default\(false\)/);
assert.match(schema, /mapEligible\s+Boolean\s+@default\(false\)/);
assert.match(schema, /publicPageEligible\s+Boolean\s+@default\(false\)/);
assert.match(schema, /indexingEligible\s+Boolean\s+@default\(false\)/);
assert.match(schema, /propertyEnrichment\s+Boolean\s+@default\(false\)/);
assert.match(schema, /marketAnalytics\s+Boolean\s+@default\(false\)/);

assert.equal(/geometry|geography|polygon|multipolygon|postgis|gist/i.test(schema), false, "Geometry/PostGIS terms found in schema.");
assert.equal(/geometry|geography|polygon|multipolygon|postgis|gist/i.test(migration), false, "Geometry/PostGIS terms found in migration.");

for (const destructive of [/DROP TABLE/i, /DROP COLUMN/i, /^DELETE FROM/im, /^TRUNCATE/im, /^UPDATE\s+"/im, /^INSERT INTO/im]) {
  assert.equal(destructive.test(migration), false, `Destructive or data-activating SQL detected: ${destructive}`);
}

const nonGioAlter = migration
  .split("\n")
  .filter((line) => /^ALTER TABLE\s+"(?!Geographic|PropertyGeographicRelationship)/i.test(line));
assert.deepEqual(nonGioAlter, []);

assert.ok(migration.includes('ON DELETE RESTRICT ON UPDATE CASCADE'));
assert.equal(/ON DELETE CASCADE/.test(migration), false, "GIO migration must not cascade-delete existing runtime records.");
assert.ok(migration.includes('FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE'));

assert.equal(/DATABASE_URL|DIRECT_URL|SUPABASE|TYPESENSE|RESEND|SECRET|TOKEN|PASSWORD|API_KEY/i.test(migration), false);

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

const runtimeFiles = [
  "app",
  "components",
  "lib/search",
  "lib/mls",
  "lib/typesense",
  "lib/alerts",
  "workers",
];

for (const path of runtimeFiles) {
  if (!fs.existsSync(path)) {
    continue;
  }

  const files = listRuntimeSourceFiles(path);

  for (const file of files) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("lib/gio"), false, `Runtime file imports GIO module: ${file}`);
    assert.equal(contents.includes("GeographicObject"), false, `Runtime file consumes GIO model: ${file}`);
    assert.equal(contents.includes("PropertyGeographicRelationship"), false, `Runtime file consumes GIO property relationship: ${file}`);
  }
}

assert.throws(() => assertGioAuthorizedObjectType("SCHOOL_DISTRICT"));
assert.doesNotThrow(() => assertGioAuthorizedObjectType("MUNICIPALITY"));
assert.equal(normalizeGioLookupValue("  Fort   Collins "), "fort collins");
assert.deepEqual(validateGioObjectCreateInput({
  objectType: "MARKET_AREA",
  canonicalName: "  Foothills ",
  displayName: " Foothills ",
  canonicalSlug: " Foothills Market ",
}), {
  objectType: "MARKET_AREA",
  canonicalName: "Foothills",
  displayName: "Foothills",
  canonicalSlug: "foothills-market",
});
assert.equal(
  buildGioObjectIdempotencyKey({
    objectType: "ZIP_CODE",
    canonicalName: "80521",
    displayName: "80521",
    canonicalSlug: "80521",
  }),
  "GIO_OBJECT|ZIP_CODE|80521",
);
assert.throws(() => assertGioEffectiveDateRange(new Date("2026-02-02"), new Date("2026-02-01")));
assert.doesNotThrow(() => assertGioEffectiveDateRange(new Date("2026-02-01"), new Date("2026-02-02")));

assert.ok(packageJson.includes("check:geographic-intelligence-object-safety"));
assert.equal(packageJson.includes("gio:seed"), false);
assert.equal(packageJson.includes("gio:backfill"), false);

console.log(
  "[geographic-intelligence-object-safety] ok: additive GIO schema, governed object-type scope, safe eligibility defaults, duplicate protections, no geometry, no seeds/backfills, no runtime consumption, and property-protective referential behavior passed.",
);
