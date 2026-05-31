import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const COMPILED_SCHEMA_PATH = resolve("dist/lib/typesense/schema.js");

const HELP_TEXT = `
Legacy JavaScript Typesense collection creator

Usage:
  node scripts/createCollection.js [options]

Options:
  --check     Validate compiled canonical schemas and inspect existing collections without deleting or creating collections.
  --dry-run   Validate compiled canonical schemas and report intended collection changes without connecting to Typesense.
  --reset     Delete and recreate all canonical search collections, even if they are already valid.
  --help      Show this help text.

Primary local repair flow:
  Terminal 4: npm run infra:up
  Terminal 5: npm run worker:build
  Terminal 5: npm run typesense:init
  Terminal 5: npm run typesense:reindex

Default behavior:
  Missing collections are created.
  Stale collections are deleted and recreated.
  Ready collections are left in place.

Note:
  npm run typesense:init is the primary schema repair command. This script is kept for legacy compatibility and loads dist/lib/typesense/schema.js.
`;

function parseArgs(argv) {
  const options = {
    check: false,
    dryRun: false,
    reset: false,
  };

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      console.log(HELP_TEXT.trim());
      return null;
    }

    if (arg === "--check") {
      options.check = true;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--reset") {
      options.reset = true;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  if (options.dryRun && (options.check || options.reset)) {
    throw new Error("--dry-run cannot be combined with --check or --reset.");
  }

  if (options.check && options.reset) {
    throw new Error("--check cannot be combined with --reset.");
  }

  return options;
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function getHttpStatus(error) {
  if (typeof error !== "object" || error === null) return undefined;

  return typeof error.httpStatus === "number" ? error.httpStatus : undefined;
}

function getSchemaSummary(schema) {
  const fields = schema.fields || [];
  const facetedFields = fields.filter((field) => field.facet === true);
  const sortableFields = fields.filter((field) => field.sort === true);

  return `${schema.name}: ${fields.length} fields, ${facetedFields.length} facets, ${sortableFields.length} sortable fields, default sort ${
    schema.default_sorting_field || "none"
  }`;
}

function getCanonicalRuleSummary(searchSchemaFieldRules, searchSchemaQueryFieldNames, searchSchemaFilterFieldNames, searchSchemaSortFieldNames) {
  const facetedRules = searchSchemaFieldRules.filter((field) => field.facet).length;
  const sortableRules = searchSchemaFieldRules.filter((field) => field.sort).length;

  return [
    `${searchSchemaFieldRules.length} canonical fields`,
    `${facetedRules} required facets`,
    `${sortableRules} sortable fields`,
    `${searchSchemaQueryFieldNames.length} query fields`,
    `${searchSchemaFilterFieldNames.length} filter fields`,
    `${searchSchemaSortFieldNames.length} sort fields`,
  ].join(", ");
}

function logCanonicalSearchSurface(searchSchemaQueryFieldNames, searchSchemaFilterFieldNames, searchSchemaSortFieldNames) {
  console.log(`Canonical Typesense query fields: ${searchSchemaQueryFieldNames.join(", ")}.`);
  console.log(`Canonical Typesense filter fields: ${searchSchemaFilterFieldNames.join(", ")}.`);
  console.log(`Canonical Typesense sort fields: ${searchSchemaSortFieldNames.join(", ")}.`);
}

function getRepairInstruction() {
  return "Terminal 5: run npm run typesense:init, then npm run typesense:reindex when Supabase is reachable.";
}

async function loadCompiledTypesenseSchema() {
  if (!existsSync(COMPILED_SCHEMA_PATH)) {
    throw new Error(
      "Compiled Typesense schema not found. Terminal 5: run npm run worker:build, then rerun this script."
    );
  }

  return import(pathToFileURL(COMPILED_SCHEMA_PATH).href);
}

function validateUniqueSchemaNames(schemas) {
  const seen = new Set();

  for (const schema of schemas) {
    if (!schema.name) {
      throw new Error("Typesense schema is missing a collection name.");
    }

    if (seen.has(schema.name)) {
      throw new Error(`Duplicate Typesense schema name: ${schema.name}`);
    }

    seen.add(schema.name);
  }
}

function assertValidSearchSchema(schema, formatSearchSchemaValidationError) {
  const error = formatSearchSchemaValidationError(schema);

  if (error) {
    throw new Error(error);
  }
}

function assertValidRetrievedCollection(collection, formatSearchSchemaValidationError) {
  const error = formatSearchSchemaValidationError(collection);

  if (error) {
    throw new Error(`Created Typesense collection failed validation: ${error}`);
  }
}

function validateCanonicalSchemas(
  searchSchemas,
  formatSearchSchemaValidationError,
  searchSchemaFieldRules,
  searchSchemaQueryFieldNames,
  searchSchemaFilterFieldNames,
  searchSchemaSortFieldNames
) {
  validateUniqueSchemaNames(searchSchemas);
  console.log(
    `Canonical Typesense rule set: ${getCanonicalRuleSummary(
      searchSchemaFieldRules,
      searchSchemaQueryFieldNames,
      searchSchemaFilterFieldNames,
      searchSchemaSortFieldNames
    )}.`
  );
  logCanonicalSearchSurface(searchSchemaQueryFieldNames, searchSchemaFilterFieldNames, searchSchemaSortFieldNames);

  for (const schema of searchSchemas) {
    assertValidSearchSchema(schema, formatSearchSchemaValidationError);
    console.log(`Validated canonical Typesense schema: ${getSchemaSummary(schema)}.`);
  }
}

async function inspectExistingCollection(client, schema, formatSearchSchemaValidationError) {
  try {
    const collection = await client.collections(schema.name).retrieve();
    const error = formatSearchSchemaValidationError(collection);

    if (error) {
      return {
        schemaName: schema.name,
        status: "stale",
        summary: getSchemaSummary(collection),
        error,
      };
    }

    return {
      schemaName: schema.name,
      status: "ready",
      summary: getSchemaSummary(collection),
    };
  } catch (error) {
    if (getHttpStatus(error) === 404) {
      return {
        schemaName: schema.name,
        status: "missing",
      };
    }

    throw new Error(`Failed to inspect Typesense ${schema.name} collection: ${errorMessage(error)}`);
  }
}

function logInspection(inspection) {
  if (inspection.status === "missing") {
    console.log(`Existing Typesense ${inspection.schemaName} collection: missing.`);
    return;
  }

  if (inspection.status === "ready") {
    console.log(`Existing Typesense ${inspection.schemaName} collection: ready (${inspection.summary}).`);
    return;
  }

  console.warn(`Existing Typesense ${inspection.schemaName} collection: stale (${inspection.summary}).`);
  console.warn(inspection.error);
}

async function inspectExistingCollections(client, searchSchemas, formatSearchSchemaValidationError) {
  const inspections = [];

  for (const schema of searchSchemas) {
    const inspection = await inspectExistingCollection(client, schema, formatSearchSchemaValidationError);
    logInspection(inspection);
    inspections.push(inspection);
  }

  return inspections;
}

async function deleteCollection(client, collectionName) {
  try {
    await client.collections(collectionName).delete();
    console.log(`Deleted existing Typesense ${collectionName} collection.`);
  } catch (error) {
    if (getHttpStatus(error) === 404) {
      console.log(`Typesense ${collectionName} collection did not exist.`);
      return;
    }

    throw new Error(`Failed to delete Typesense ${collectionName} collection: ${errorMessage(error)}`);
  }
}

async function createAndVerifyCollection(client, schema, formatSearchSchemaValidationError) {
  await client.collections().create(schema);
  console.log(`Created Typesense ${schema.name} collection.`);

  const collection = await client.collections(schema.name).retrieve();
  assertValidRetrievedCollection(collection, formatSearchSchemaValidationError);
  console.log(`Verified Typesense ${getSchemaSummary(collection)}.`);
}

function getSchemaByName(searchSchemas, collectionName) {
  return searchSchemas.find((schema) => schema.name === collectionName);
}

async function runCheck(client, searchSchemas, formatSearchSchemaValidationError) {
  const inspections = await inspectExistingCollections(client, searchSchemas, formatSearchSchemaValidationError);
  const failures = inspections.filter((inspection) => inspection.status !== "ready");

  if (failures.length) {
    throw new Error(
      `Typesense collection check failed for ${failures.map((inspection) => inspection.schemaName).join(", ")}. ${getRepairInstruction()}`
    );
  }

  console.log("Typesense collection check complete. All canonical collections are ready.");
}

async function runRepair(client, searchSchemas, formatSearchSchemaValidationError) {
  const inspections = await inspectExistingCollections(client, searchSchemas, formatSearchSchemaValidationError);
  let changed = false;

  for (const inspection of inspections) {
    const schema = getSchemaByName(searchSchemas, inspection.schemaName);
    if (!schema) {
      throw new Error(`No canonical schema found for inspected Typesense collection: ${inspection.schemaName}`);
    }

    if (inspection.status === "ready") continue;

    if (inspection.status === "stale") {
      await deleteCollection(client, schema.name);
    }

    await createAndVerifyCollection(client, schema, formatSearchSchemaValidationError);
    changed = true;
  }

  if (!changed) {
    console.log("Legacy Typesense collection setup complete. All canonical collections were already ready.");
    return;
  }

  console.log("Legacy Typesense collection setup complete. Terminal 5: run npm run typesense:reindex before relying on search results.");
}

async function runReset(client, searchSchemas, formatSearchSchemaValidationError) {
  await inspectExistingCollections(client, searchSchemas, formatSearchSchemaValidationError);

  for (const schema of searchSchemas) {
    await deleteCollection(client, schema.name);
  }

  for (const schema of searchSchemas) {
    await createAndVerifyCollection(client, schema, formatSearchSchemaValidationError);
  }

  console.log("Legacy Typesense collection reset complete. Terminal 5: run npm run typesense:reindex before relying on search results.");
}

async function createCollection(options) {
  const {
    SEARCH_SCHEMA_FIELD_RULES,
    SEARCH_SCHEMA_FILTER_FIELD_NAMES = [],
    SEARCH_SCHEMA_QUERY_FIELD_NAMES = [],
    SEARCH_SCHEMA_SORT_FIELD_NAMES = [],
    client,
    formatSearchSchemaValidationError,
    searchSchemas,
  } = await loadCompiledTypesenseSchema();

  console.log(
    `Creating canonical Typesense search collections from compiled schema. check=${options.check}, dryRun=${options.dryRun}, reset=${options.reset}.`
  );
  validateCanonicalSchemas(
    searchSchemas,
    formatSearchSchemaValidationError,
    SEARCH_SCHEMA_FIELD_RULES,
    SEARCH_SCHEMA_QUERY_FIELD_NAMES,
    SEARCH_SCHEMA_FILTER_FIELD_NAMES,
    SEARCH_SCHEMA_SORT_FIELD_NAMES
  );

  if (options.dryRun) {
    console.log("Typesense collection creation dry-run complete. No Typesense connection was opened and no collections were deleted or created.");
    return;
  }

  if (options.check) {
    await runCheck(client, searchSchemas, formatSearchSchemaValidationError);
    return;
  }

  if (options.reset) {
    await runReset(client, searchSchemas, formatSearchSchemaValidationError);
    return;
  }

  await runRepair(client, searchSchemas, formatSearchSchemaValidationError);
}

const options = parseArgs(process.argv.slice(2));

if (options) {
  createCollection(options).catch((error) => {
    console.error("Failed to create Typesense search collections:", errorMessage(error));
    process.exit(1);
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createCollection.js
