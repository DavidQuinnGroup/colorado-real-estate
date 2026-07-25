import assert from "node:assert/strict";
import fs from "node:fs";

const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
const repairMigration = fs.readFileSync(
  "prisma/migrations/20260725142500_seller_lead_uuid_schema_reconciliation/migration.sql",
  "utf8",
);
const parityMigration = fs.readFileSync(
  "prisma/migrations/20260722210000_repair_seller_lead_schema_parity/migration.sql",
  "utf8",
);
const gioMigration = fs.readFileSync(
  "prisma/migrations/20260725143000_gio_wave3_additive_persistence_foundation/migration.sql",
  "utf8",
);

assert.match(
  schema,
  /model SellerLead \{[\s\S]*?id\s+String\s+@id\s+@default\(dbgenerated\("gen_random_uuid\(\)"\)\)\s+@db\.Uuid[\s\S]*?\}/,
  "SellerLead.id must use the governed UUID strategy.",
);
assert.match(
  schema,
  /sellerLeadId\s+String\?\s+@map\("leadid"\)\s+@db\.Uuid/,
  "CRMTask.leadid must be modeled as a UUID-compatible SellerLead foreign key.",
);
assert.match(
  schema,
  /sellerLead\s+SellerLead\?\s+@relation\(fields: \[sellerLeadId\], references: \[id\], onDelete: Cascade\)/,
  "CRMTask sellerLead relation must reflect the existing production FK behavior.",
);

assert.equal(fs.existsSync("prisma/migrations/20260722211500_repair_seller_lead_id_type"), false);

for (const migrationSql of [repairMigration, gioMigration]) {
  assert.equal(/UPDATE\s+"SellerLead"\s+SET\s+"id"/i.test(migrationSql), false);
  assert.equal(/DELETE\s+FROM\s+"SellerLead"/i.test(migrationSql), false);
  assert.equal(/TRUNCATE\s+"SellerLead"/i.test(migrationSql), false);
  assert.equal(/DROP\s+TABLE\s+"SellerLead"/i.test(migrationSql), false);
  assert.equal(/DROP\s+COLUMN\s+"id"/i.test(migrationSql), false);
}

assert.match(repairMigration, /SellerLead\.id contains non-UUID text values; stopping before type conversion/);
assert.match(repairMigration, /CRMTask\.leadid contains non-UUID text values; stopping before type conversion/);
assert.match(repairMigration, /ALTER TABLE "SellerLead" ALTER COLUMN "id" TYPE uuid USING "id"::uuid/);
assert.match(repairMigration, /ALTER TABLE "CRMTask" ALTER COLUMN "leadid" TYPE uuid USING "leadid"::uuid/);
assert.match(repairMigration, /CREATE INDEX IF NOT EXISTS "CRMTask_leadid_idx" ON "CRMTask"\("leadid"\)/);
assert.match(repairMigration, /FOREIGN KEY \("leadid"\) REFERENCES "SellerLead"\("id"\)/);
assert.match(repairMigration, /ON DELETE CASCADE ON UPDATE NO ACTION/);

assert.match(parityMigration, /ALTER TABLE "SellerLead" ADD COLUMN IF NOT EXISTS "propertyId" TEXT/);
assert.match(parityMigration, /ALTER TABLE "SellerLead" ALTER COLUMN "propertyId" SET NOT NULL/);
assert.match(parityMigration, /CREATE INDEX IF NOT EXISTS "SellerLead_propertyId_idx"/);

assert.equal(/INSERT INTO\s+"Geographic/i.test(gioMigration), false);
assert.equal(/UPDATE\s+"Geographic/i.test(gioMigration), false);
assert.equal(/DELETE\s+FROM\s+"Geographic/i.test(gioMigration), false);

const runtimeFiles = [
  "app/api/valuation/route.ts",
  "lib/seller/createSellerLead.ts",
  "app/api/webhooks/email-reply/route.ts",
];

for (const file of runtimeFiles) {
  const contents = fs.readFileSync(file, "utf8");
  assert.equal(/cuid\(\)|createId|nanoid|randomUUID\(\)/.test(contents), false, `${file} must not generate SellerLead IDs in application code.`);
}

const packageJson = fs.readFileSync("package.json", "utf8");
assert.ok(packageJson.includes("check:seller-lead-schema-safety"));

console.log(
  "[seller-lead-schema-safety] ok: UUID id strategy, UUID-compatible SellerLead FK, fail-closed migration, no SellerLead ID rewrite, governed empty-directory disposition, and dormant GIO posture verified.",
);

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkSellerLeadSchemaSafety.ts
