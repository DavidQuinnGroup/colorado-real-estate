import dotenv from 'dotenv';
const DEFAULT_BATCH_SIZE = 500;
const MAX_BATCH_SIZE = 1000;
const MAX_RECORDS_LIMIT = 1000000;
const HELP_TEXT = `
Typesense property reindex runner

Usage:
  node dist/scripts/index.js [options]

Options:
  --check                  Validate canonical schemas and inspect existing collections without creating, deleting, or indexing.
  --reset                  Delete and recreate properties and listings collections before indexing.
  --collections-only       Repair or reset collections without reading Supabase or importing documents.
  --batch-size=<number>    Supabase fetch/import batch size. Default: ${DEFAULT_BATCH_SIZE}, max: ${MAX_BATCH_SIZE}.
  --max-records=<number>   Stop after fetching this many Supabase records. Max: ${MAX_RECORDS_LIMIT}.
  --help                   Show this help text.

Primary local repair flow:
  Terminal 4: npm run infra:up
  Terminal 5: npm run worker:build
  Terminal 5: npm run typesense:init
  Terminal 5: npm run typesense:reindex

Default behavior:
  Missing collections are created.
  Stale collections are deleted and recreated.
  Ready collections are left in place.
  Supabase records are reindexed after collections are ready.

Examples:
  node dist/scripts/index.js
  node dist/scripts/index.js --check
  node dist/scripts/index.js --batch-size=250 --max-records=1000
  node dist/scripts/index.js --collections-only
  node dist/scripts/index.js --reset --collections-only
`;
dotenv.config({ path: '.env.local' });
dotenv.config();
function readFlagValue(arg) {
    const [, value] = arg.split('=');
    return value;
}
function parseBoundedInteger(value, name, min, max) {
    if (!value)
        throw new Error(`Missing value for ${name}.`);
    const parsed = Number(value);
    if (!Number.isInteger(parsed))
        throw new Error(`Invalid integer for ${name}: ${value}`);
    if (parsed < min || parsed > max)
        throw new Error(`${name} must be between ${min} and ${max}.`);
    return parsed;
}
function parseArgs(argv) {
    const options = {
        reset: false,
        check: false,
        collectionsOnly: false,
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
        if (arg === '--reset') {
            options.reset = true;
            continue;
        }
        if (arg === '--collections-only') {
            options.collectionsOnly = true;
            continue;
        }
        if (arg.startsWith('--batch-size=')) {
            options.batchSize = parseBoundedInteger(readFlagValue(arg), '--batch-size', 1, MAX_BATCH_SIZE);
            continue;
        }
        if (arg.startsWith('--max-records=')) {
            options.maxRecords = parseBoundedInteger(readFlagValue(arg), '--max-records', 1, MAX_RECORDS_LIMIT);
            continue;
        }
        throw new Error(`Unknown option: ${arg}`);
    }
    if (options.check && (options.reset || options.batchSize !== undefined || options.maxRecords !== undefined)) {
        throw new Error('--check cannot be combined with --reset, --batch-size, or --max-records.');
    }
    if (options.collectionsOnly && (options.batchSize !== undefined || options.maxRecords !== undefined)) {
        throw new Error('--collections-only cannot be combined with --batch-size or --max-records.');
    }
    return options;
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
function getHttpStatus(error) {
    if (typeof error !== 'object' || error === null)
        return undefined;
    const candidate = error;
    return typeof candidate.httpStatus === 'number' ? candidate.httpStatus : undefined;
}
function getSchemaSummary(schema) {
    const fields = schema.fields || [];
    const facetCount = fields.filter((field) => field.facet === true).length;
    const sortableCount = fields.filter((field) => field.sort === true).length;
    return `${schema.name}: ${fields.length} fields, ${facetCount} facets, ${sortableCount} sortable fields, default sort ${schema.default_sorting_field || 'none'}`;
}
function getCanonicalRuleSummary(SEARCH_SCHEMA_FIELD_RULES, SEARCH_SCHEMA_QUERY_FIELD_NAMES, SEARCH_SCHEMA_FILTER_FIELD_NAMES, SEARCH_SCHEMA_SORT_FIELD_NAMES) {
    const facetCount = SEARCH_SCHEMA_FIELD_RULES.filter((field) => field.facet).length;
    const sortableCount = SEARCH_SCHEMA_FIELD_RULES.filter((field) => field.sort).length;
    const requiredCount = SEARCH_SCHEMA_FIELD_RULES.filter((field) => !field.optional).length;
    const optionalCount = SEARCH_SCHEMA_FIELD_RULES.filter((field) => field.optional).length;
    return [
        `${SEARCH_SCHEMA_FIELD_RULES.length} canonical fields`,
        `${requiredCount} required fields`,
        `${optionalCount} optional fields`,
        `${facetCount} required facets`,
        `${sortableCount} sortable fields`,
        `${SEARCH_SCHEMA_QUERY_FIELD_NAMES.length} query fields`,
        `${SEARCH_SCHEMA_FILTER_FIELD_NAMES.length} filter fields`,
        `${SEARCH_SCHEMA_SORT_FIELD_NAMES.length} sort fields`,
    ].join(', ');
}
function logCanonicalSearchSurface(SEARCH_SCHEMA_QUERY_FIELD_NAMES, SEARCH_SCHEMA_FILTER_FIELD_NAMES, SEARCH_SCHEMA_SORT_FIELD_NAMES) {
    console.log(`Canonical Typesense query fields: ${SEARCH_SCHEMA_QUERY_FIELD_NAMES.join(', ')}.`);
    console.log(`Canonical Typesense filter fields: ${SEARCH_SCHEMA_FILTER_FIELD_NAMES.join(', ')}.`);
    console.log(`Canonical Typesense sort fields: ${SEARCH_SCHEMA_SORT_FIELD_NAMES.join(', ')}.`);
}
function getRepairInstruction() {
    return 'Terminal 5: run npm run typesense:init, then npm run typesense:reindex when Supabase is reachable.';
}
function getInspectionFailureDetail(inspection) {
    if (inspection.status === 'missing') {
        return `${inspection.schemaName}: missing collection`;
    }
    if (inspection.status === 'stale') {
        return `${inspection.schemaName}: stale collection${inspection.error ? ` (${inspection.error})` : ''}`;
    }
    return `${inspection.schemaName}: ${inspection.status}`;
}
function assertValidSchema(schema, formatSearchSchemaValidationError) {
    const error = formatSearchSchemaValidationError(schema);
    if (error) {
        throw new Error(error);
    }
}
function getSupabaseEnvErrors() {
    return [
        process.env.NEXT_PUBLIC_SUPABASE_URL ? '' : 'NEXT_PUBLIC_SUPABASE_URL',
        process.env.SUPABASE_SERVICE_ROLE_KEY ? '' : 'SUPABASE_SERVICE_ROLE_KEY',
    ].filter(Boolean);
}
function assertSupabaseEnvReady() {
    const missing = getSupabaseEnvErrors();
    if (missing.length) {
        throw new Error(`Missing Supabase environment variable(s) for Typesense reindex: ${missing.join(', ')}.`);
    }
}
function assertValidRetrievedCollection(collection, formatSearchSchemaValidationError) {
    const error = formatSearchSchemaValidationError(collection);
    if (error) {
        throw new Error(`Created collection failed validation: ${error}`);
    }
}
async function inspectCollection(typesense, schema, formatSearchSchemaValidationError) {
    try {
        const collection = (await typesense.collections(schema.name).retrieve());
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
    }
    catch (error) {
        if (getHttpStatus(error) === 404) {
            return {
                schemaName: schema.name,
                status: 'missing',
            };
        }
        throw new Error(`Failed to inspect Typesense ${schema.name} collection: ${errorMessage(error)}`);
    }
}
function logInspection(inspection) {
    if (inspection.status === 'missing') {
        console.log(`Typesense ${inspection.schemaName} collection is missing.`);
        return;
    }
    if (inspection.status === 'ready') {
        console.log(`Typesense ${inspection.summary} is ready.`);
        return;
    }
    console.warn(`Typesense ${inspection.schemaName} collection is stale (${inspection.summary}).`);
    console.warn(inspection.error);
}
async function deleteCollection(typesense, collectionName) {
    try {
        await typesense.collections(collectionName).delete();
        console.log(`Deleted existing Typesense ${collectionName} collection.`);
    }
    catch (error) {
        if (getHttpStatus(error) === 404) {
            console.log(`Typesense ${collectionName} collection did not exist.`);
            return;
        }
        throw new Error(`Failed to delete Typesense ${collectionName} collection: ${errorMessage(error)}`);
    }
}
async function createAndVerifyCollection(typesense, schema, formatSearchSchemaValidationError) {
    await typesense.collections().create(schema);
    console.log(`Created Typesense ${schema.name} collection.`);
    const collection = (await typesense.collections(schema.name).retrieve());
    assertValidRetrievedCollection(collection, formatSearchSchemaValidationError);
    console.log(`Verified Typesense ${getSchemaSummary(collection)}.`);
}
function getSchemaByName(searchSchemas, collectionName) {
    return searchSchemas.find((schema) => schema.name === collectionName);
}
async function validateCanonicalSchemas(schemaModule) {
    const { SEARCH_SCHEMA_FIELD_RULES, SEARCH_SCHEMA_FILTER_FIELD_NAMES, SEARCH_SCHEMA_QUERY_FIELD_NAMES, SEARCH_SCHEMA_SORT_FIELD_NAMES, formatSearchSchemaValidationError, searchSchemas, } = schemaModule;
    console.log(`Canonical Typesense rule set: ${getCanonicalRuleSummary(SEARCH_SCHEMA_FIELD_RULES, SEARCH_SCHEMA_QUERY_FIELD_NAMES, SEARCH_SCHEMA_FILTER_FIELD_NAMES, SEARCH_SCHEMA_SORT_FIELD_NAMES)}.`);
    logCanonicalSearchSurface(SEARCH_SCHEMA_QUERY_FIELD_NAMES, SEARCH_SCHEMA_FILTER_FIELD_NAMES, SEARCH_SCHEMA_SORT_FIELD_NAMES);
    for (const schema of searchSchemas) {
        assertValidSchema(schema, formatSearchSchemaValidationError);
        console.log(`Validated canonical Typesense schema: ${getSchemaSummary(schema)}.`);
    }
}
async function inspectSearchCollections(schemaModule) {
    const { formatSearchSchemaValidationError, searchSchemas, typesense } = schemaModule;
    const inspections = [];
    for (const schema of searchSchemas) {
        const inspection = await inspectCollection(typesense, schema, formatSearchSchemaValidationError);
        logInspection(inspection);
        inspections.push(inspection);
    }
    return inspections;
}
async function ensureSearchCollections(schemaModule, reset) {
    const { formatSearchSchemaValidationError, searchSchemas, typesense } = schemaModule;
    if (reset) {
        for (const schema of searchSchemas) {
            await deleteCollection(typesense, schema.name);
        }
    }
    const inspections = reset
        ? searchSchemas.map((schema) => ({ schemaName: schema.name, status: 'missing' }))
        : await inspectSearchCollections(schemaModule);
    let changed = false;
    for (const inspection of inspections) {
        const schema = getSchemaByName(searchSchemas, inspection.schemaName);
        if (!schema) {
            throw new Error(`No canonical schema found for inspected Typesense collection: ${inspection.schemaName}`);
        }
        if (inspection.status === 'ready')
            continue;
        if (inspection.status === 'stale') {
            await deleteCollection(typesense, schema.name);
        }
        await createAndVerifyCollection(typesense, schema, formatSearchSchemaValidationError);
        changed = true;
    }
    if (!changed) {
        console.log('Typesense collection setup complete. All canonical collections were already ready.');
    }
}
async function runCheck(schemaModule) {
    const inspections = await inspectSearchCollections(schemaModule);
    const failures = inspections.filter((inspection) => inspection.status !== 'ready');
    if (failures.length) {
        throw new Error(`Typesense collection check failed: ${failures.map(getInspectionFailureDetail).join('; ')}. ${getRepairInstruction()}`);
    }
    console.log('Typesense collection check complete. All canonical collections are ready.');
}
async function main() {
    const options = parseArgs(process.argv.slice(2));
    if (!options)
        return;
    const schemaModule = await import('../lib/typesense/schema.js');
    console.log(`Typesense reindex starting: check=${options.check}, reset=${options.reset}, collectionsOnly=${options.collectionsOnly}, batchSize=${options.batchSize ?? DEFAULT_BATCH_SIZE}, maxRecords=${options.maxRecords ?? 'all'}.`);
    await validateCanonicalSchemas(schemaModule);
    if (options.check) {
        await runCheck(schemaModule);
        return;
    }
    await ensureSearchCollections(schemaModule, options.reset);
    if (options.collectionsOnly) {
        console.log('Typesense collection setup complete. Indexing skipped because --collections-only was provided.');
        return;
    }
    assertSupabaseEnvReady();
    const { indexProperties } = await import('../lib/typesense/indexProperties.js');
    const summary = await indexProperties({
        batchSize: options.batchSize,
        maxRecords: options.maxRecords,
    });
    console.log('Typesense property reindex complete:', summary);
}
main().catch((error) => {
    console.error('Typesense property reindex failed:', errorMessage(error));
    process.exit(1);
});
// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/index.ts
