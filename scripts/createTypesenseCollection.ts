import dotenv from 'dotenv';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js';

import {
  SEARCH_SCHEMA_FIELD_RULES,
  SEARCH_SCHEMA_FILTER_FIELD_NAMES,
  SEARCH_SCHEMA_QUERY_FIELD_NAMES,
  SEARCH_SCHEMA_SORT_FIELD_NAMES,
  client,
  formatSearchSchemaValidationError,
  searchSchemas,
} from '../lib/typesense/schema.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

type RetrievedTypesenseCollection = CollectionCreateSchema & {
  fields?: NonNullable<CollectionCreateSchema['fields']>;
};

type CreateOptions = {
  check: boolean;
  dryRun: boolean;
  reset: boolean;
};

type ExistingCollectionInspection = {
  schemaName: string;
  status: 'missing' | 'ready' | 'stale';
  summary?: string;
  error?: string;
};

const HELP_TEXT = `
Compatibility Typesense collection creator

Usage:
  node dist/scripts/createTypesenseCollection.js [options]

Options:
  --check     Validate canonical schemas and inspect existing collections without deleting or creating collections.
  --dry-run   Validate canonical schemas and report intended collection changes without connecting to Typesense.
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
  npm run typesense:init is the primary schema repair command. This script is kept as a compatibility helper.
`;

function parseArgs(argv: string[]): CreateOptions | null {
  const options: CreateOptions = {
    check: false,
    dryRun: false,
    reset: false,
  };

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      console.log(HELP_TEXT.trim());
      return null;
    }

    if (arg === '--check') {
      options.check = true;
      continue;
    }

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--reset') {
      options.reset = true;
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  if (options.dryRun && (options.check || options.reset)) {
    throw new Error('--dry-run cannot be combined with --check or --reset.');
  }

  if (options.check && options.reset) {
    throw new Error('--check cannot be combined with --reset.');
  }

  return options;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getHttpStatus(error: unknown) {
  if (typeof error !== 'object' || error === null) return undefined;

  const candidate = error as { httpStatus?: unknown };
  return typeof candidate.httpStatus === 'number' ? candidate.httpStatus : undefined;
}

function getSchemaSummary(schema: CollectionCreateSchema) {
  const fields = schema.fields || [];
  const facetedFields = fields.filter((field) => field.facet === true);
  const sortableFields = fields.filter((field) => field.sort === true);

  return `${schema.name}: ${fields.length} fields, ${facetedFields.length} facets, ${sortableFields.length} sortable fields, default sort ${
    schema.default_sorting_field || 'none'
  }`;
}

function getCanonicalRuleSummary() {
  const facetedRules = SEARCH_SCHEMA_FIELD_RULES.filter((field) => field.facet).length;
  const sortableRules = SEARCH_SCHEMA_FIELD_RULES.filter((field) => field.sort).length;

  return [
    `${SEARCH_SCHEMA_FIELD_RULES.length} canonical fields`,
    `${facetedRules} required facets`,
    `${sortableRules} sortable fields`,
    `${SEARCH_SCHEMA_QUERY_FIELD_NAMES.length} query fields`,
    `${SEARCH_SCHEMA_FILTER_FIELD_NAMES.length} filter fields`,
    `${SEARCH_SCHEMA_SORT_FIELD_NAMES.length} sort fields`,
  ].join(', ');
}

function logCanonicalSearchSurface() {
  console.log(`Canonical Typesense query fields: ${SEARCH_SCHEMA_QUERY_FIELD_NAMES.join(', ')}.`);
  console.log(`Canonical Typesense filter fields: ${SEARCH_SCHEMA_FILTER_FIELD_NAMES.join(', ')}.`);
  console.log(`Canonical Typesense sort fields: ${SEARCH_SCHEMA_SORT_FIELD_NAMES.join(', ')}.`);
}

function getRepairInstruction() {
  return 'Terminal 5: run npm run typesense:init, then npm run typesense:reindex when Supabase is reachable.';
}

function validateUniqueSchemaNames(schemas: CollectionCreateSchema[]) {
  const seen = new Set<string>();

  for (const schema of schemas) {
    if (!schema.name) {
      throw new Error('Typesense schema is missing a collection name.');
    }

    if (seen.has(schema.name)) {
      throw new Error(`Duplicate Typesense schema name: ${schema.name}`);
    }

    seen.add(schema.name);
  }
}

function assertValidSearchSchema(schema: CollectionCreateSchema) {
  const error = formatSearchSchemaValidationError(schema);

  if (error) {
    throw new Error(error);
  }
}

function assertValidRetrievedCollection(collection: RetrievedTypesenseCollection) {
  const error = formatSearchSchemaValidationError(collection);

  if (error) {
    throw new Error(`Created Typesense collection failed validation: ${error}`);
  }
}

function validateCanonicalSchemas() {
  validateUniqueSchemaNames(searchSchemas);
  console.log(`Canonical Typesense rule set: ${getCanonicalRuleSummary()}.`);
  logCanonicalSearchSurface();

  for (const schema of searchSchemas) {
    assertValidSearchSchema(schema);
    console.log(`Validated canonical Typesense schema: ${getSchemaSummary(schema)}.`);
  }
}

async function inspectExistingCollection(schema: CollectionCreateSchema): Promise<ExistingCollectionInspection> {
  try {
    const collection = (await client.collections(schema.name).retrieve()) as RetrievedTypesenseCollection;
    const error = formatSearchSchemaValidationError(collection);

    if (error) {
      return {
        schemaName: schema.name,
        status: 'stale',
        summary: getSchemaSummary(collection),
        error,
      };
    }

    return {
      schemaName: schema.name,
      status: 'ready',
      summary: getSchemaSummary(collection),
    };
  } catch (error) {
    if (getHttpStatus(error) === 404) {
      return {
        schemaName: schema.name,
        status: 'missing',
      };
    }

    throw new Error(`Failed to inspect Typesense ${schema.name} collection: ${errorMessage(error)}`);
  }
}

function logInspection(inspection: ExistingCollectionInspection) {
  if (inspection.status === 'missing') {
    console.log(`Existing Typesense ${inspection.schemaName} collection: missing.`);
    return;
  }

  if (inspection.status === 'ready') {
    console.log(`Existing Typesense ${inspection.schemaName} collection: ready (${inspection.summary}).`);
    return;
  }

  console.warn(`Existing Typesense ${inspection.schemaName} collection: stale (${inspection.summary}).`);
  console.warn(inspection.error);
}

async function inspectExistingCollections() {
  const inspections: ExistingCollectionInspection[] = [];

  for (const schema of searchSchemas) {
    const inspection = await inspectExistingCollection(schema);
    logInspection(inspection);
    inspections.push(inspection);
  }

  return inspections;
}

async function deleteCollection(collectionName: string) {
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

async function createAndVerifyCollection(schema: CollectionCreateSchema) {
  await client.collections().create(schema);
  console.log(`Created Typesense ${schema.name} collection.`);

  const collection = (await client.collections(schema.name).retrieve()) as RetrievedTypesenseCollection;
  assertValidRetrievedCollection(collection);
  console.log(`Verified Typesense ${getSchemaSummary(collection)}.`);
}

function getSchemaByName(collectionName: string) {
  return searchSchemas.find((schema) => schema.name === collectionName);
}

async function runCheck() {
  const inspections = await inspectExistingCollections();
  const failures = inspections.filter((inspection) => inspection.status !== 'ready');

  if (failures.length) {
    throw new Error(
      `Typesense collection check failed for ${failures.map((inspection) => inspection.schemaName).join(', ')}. ${getRepairInstruction()}`,
    );
  }

  console.log('Typesense collection check complete. All canonical collections are ready.');
}

async function runRepair() {
  const inspections = await inspectExistingCollections();
  let changed = false;

  for (const inspection of inspections) {
    const schema = getSchemaByName(inspection.schemaName);
    if (!schema) {
      throw new Error(`No canonical schema found for inspected Typesense collection: ${inspection.schemaName}`);
    }

    if (inspection.status === 'ready') continue;

    if (inspection.status === 'stale') {
      await deleteCollection(schema.name);
    }

    await createAndVerifyCollection(schema);
    changed = true;
  }

  if (!changed) {
    console.log('Typesense compatibility collection setup complete. All canonical collections were already ready.');
    return;
  }

  console.log('Typesense compatibility collection setup complete. Terminal 5: run npm run typesense:reindex before relying on search results.');
}

async function runReset() {
  await inspectExistingCollections();

  for (const schema of searchSchemas) {
    await deleteCollection(schema.name);
  }

  for (const schema of searchSchemas) {
    await createAndVerifyCollection(schema);
  }

  console.log('Typesense compatibility collection reset complete. Terminal 5: run npm run typesense:reindex before relying on search results.');
}

async function run(options: CreateOptions) {
  console.log(
    `Creating canonical Typesense search collections through compatibility helper. check=${options.check}, dryRun=${options.dryRun}, reset=${options.reset}.`,
  );
  validateCanonicalSchemas();

  if (options.dryRun) {
    console.log('Typesense collection creation dry-run complete. No Typesense connection was opened and no collections were deleted or created.');
    return;
  }

  if (options.check) {
    await runCheck();
    return;
  }

  if (options.reset) {
    await runReset();
    return;
  }

  await runRepair();
}

const options = parseArgs(process.argv.slice(2));

if (options) {
  run(options).catch((error) => {
    console.error('Typesense collection creation failed:', errorMessage(error));
    process.exit(1);
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/createTypesenseCollection.ts
