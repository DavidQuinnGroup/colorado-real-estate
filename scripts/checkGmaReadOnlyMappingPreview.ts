import assert from "node:assert/strict";
import fs from "node:fs";

import {
  readOnlyMappingPreviewRecords,
  type MappingMethod,
  type Outcome,
} from "../lib/gma/readOnlyMappingPreviewFixtures.js";

const records = readOnlyMappingPreviewRecords;

const requiredOutcomes: readonly Outcome[] = [
  "EXACT_CANONICAL_CANDIDATE",
  "ALIAS_CANDIDATE",
  "EDITORIAL_ASSOCIATION_ONLY",
  "DUPLICATE_CANDIDATE",
  "AMBIGUOUS_OBJECT_TYPE",
  "MANUAL_REVIEW_REQUIRED",
  "DEFERRED",
];

for (const outcome of requiredOutcomes) {
  assert.ok(records.some((entry) => entry.outcome === outcome || entry.recommendedDisposition === outcome), `Missing preview outcome: ${outcome}`);
}

assert.equal(records.some((entry) => entry.activationEligibility !== "NOT_ELIGIBLE"), false);
assert.equal(records.some((entry) => entry.mappingMethod === "AUTHORITATIVE_IMPORT"), false);
assert.equal(records.some((entry) => entry.mappingMethod === "LICENSED_IMPORT"), false);
assert.equal(records.some((entry) => entry.mappingMethod === "SPATIAL_RESOLUTION" as MappingMethod), false);
assert.equal(records.some((entry) => entry.mappingMethod === "AI_ASSISTED_PROPOSAL" as MappingMethod), false);
assert.ok(records.some((entry) => entry.sourceValue.includes("Gunbarrel") && entry.outcome === "AMBIGUOUS_OBJECT_TYPE"));
assert.ok(records.some((entry) => entry.repositoryLocation === "lib/neighborhoodPolygons.ts" && entry.outcome === "DEFERRED"));
assert.ok(records.some((entry) => entry.repositoryLocation === "data/searchPages.ts" && entry.editorialSeparationStatus === "EDITORIAL_ONLY"));
assert.ok(records.every((entry) => entry.mappingType !== "OBSERVATION_MAPPING" || entry.humanReviewRequirement === "REQUIRED"));

const fixtureSource = fs.readFileSync("lib/gma/readOnlyMappingPreviewFixtures.ts", "utf8");
for (const prohibited of ["node:fs", "fs.", "readFile", "readdir", "scandir", "@prisma/client", "process.env", "fetch(", "DATABASE_URL", "prisma/migrations", "prisma/schema.prisma"]) {
  assert.equal(fixtureSource.includes(prohibited), false, `Runtime-safe GMA fixture module contains prohibited dependency: ${prohibited}`);
}

const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
const packageJson = fs.readFileSync("package.json", "utf8");
assert.ok(packageJson.includes("check:gma-read-only-mapping-preview"));
assert.equal(/GmaReadOnlyMapping|MappingPreview|preview ledger/i.test(schema), false);

const migrationNames = fs.readdirSync("prisma/migrations").join("\n");
assert.equal(/gma|mapping_preview|read_only_mapping/i.test(migrationNames), false);

function listRuntimeSourceFiles(root: string): string[] {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const path = `${root}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...listRuntimeSourceFiles(path));
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(path)) {
      files.push(path);
    }
  }

  return files;
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "lib/tracking", "workers"]) {
  if (!fs.existsSync(runtimeRoot)) continue;

  for (const file of listRuntimeSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("checkGmaReadOnlyMappingPreview"), false, `Runtime imports GMA preview checker: ${file}`);
    assert.equal(contents.includes("GMA_PREVIEW"), false, `Runtime consumes GMA preview IDs: ${file}`);
  }
}

const summary = records.reduce<Record<string, number>>((acc, entry) => {
  acc[entry.outcome] = (acc[entry.outcome] ?? 0) + 1;
  return acc;
}, {});

console.log(
  `[gma-read-only-mapping-preview] ok: ${records.length} deterministic preview records, ${summary.EXACT_CANONICAL_CANDIDATE ?? 0} exact canonical candidates, ${summary.DUPLICATE_CANDIDATE ?? 0} duplicate candidates, ${summary.AMBIGUOUS_OBJECT_TYPE ?? 0} ambiguous object-type candidates, ${summary.EDITORIAL_ASSOCIATION_ONLY ?? 0} editorial-only records, ${summary.DEFERRED ?? 0} deferred records, runtime-safe fixture module, no active eligibility, no GMA migration/schema model, no runtime imports.`,
);

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkGmaReadOnlyMappingPreview.ts
