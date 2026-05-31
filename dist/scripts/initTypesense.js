import dotenv from 'dotenv';
import { SEARCH_SCHEMA_FIELD_RULES, SEARCH_SCHEMA_FILTER_FIELD_NAMES, SEARCH_SCHEMA_QUERY_FIELD_NAMES, SEARCH_SCHEMA_SORT_FIELD_NAMES, formatSearchSchemaValidationError, searchSchemas, typesense, } from '../lib/typesense/schema.js';
dotenv.config({ path: '.env.local' });
dotenv.config();
const HELP_TEXT = `
Canonical Typesense collection initializer

Usage:
  node dist/scripts/initTypesense.js [options]

Options:
  --check     Validate canonical schemas and inspect existing Typesense collections without deleting or creating collections.
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
  Use --reset only when a full local rebuild is intentional.
`;
function parseArgs(argv) {
    const options = {
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
    const facetedFields = fields.filter((field) => field.facet === true);
    const sortableFields = fields.filter((field) => field.sort === true);
    return `${schema.name}: ${fields.length} fields, ${facetedFields.length} facets, ${sortableFields.length} sortable fields, default sort ${schema.default_sorting_field || 'none'}`;
}
function getCanonicalRuleSummary() {
    const facetedRules = SEARCH_SCHEMA_FIELD_RULES.filter((field) => field.facet).length;
    const sortableRules = SEARCH_SCHEMA_FIELD_RULES.filter((field) => field.sort).length;
    const requiredRules = SEARCH_SCHEMA_FIELD_RULES.filter((field) => !field.optional).length;
    const optionalRules = SEARCH_SCHEMA_FIELD_RULES.filter((field) => field.optional).length;
    return [
        `${SEARCH_SCHEMA_FIELD_RULES.length} canonical fields`,
        `${requiredRules} required fields`,
        `${optionalRules} optional fields`,
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
function getInspectionFailureDetail(inspection) {
    if (inspection.status === 'missing') {
        return `${inspection.schemaName}: missing collection`;
    }
    if (inspection.status === 'stale') {
        return `${inspection.schemaName}: stale collection${inspection.error ? ` (${inspection.error})` : ''}`;
    }
    return `${inspection.schemaName}: ${inspection.status}`;
}
function validateUniqueSchemaNames(schemas) {
    const seen = new Set();
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
function validateSchemaDefinition(schema) {
    const error = formatSearchSchemaValidationError(schema);
    if (error) {
        throw new Error(error);
    }
}
function validateRetrievedCollection(collection) {
    const error = formatSearchSchemaValidationError(collection);
    if (error) {
        throw new Error(`Created collection failed validation: ${error}`);
    }
}
function validateCanonicalSchemas() {
    validateUniqueSchemaNames(searchSchemas);
    console.log(`Canonical Typesense rule set: ${getCanonicalRuleSummary()}.`);
    logCanonicalSearchSurface();
    for (const schema of searchSchemas) {
        validateSchemaDefinition(schema);
        console.log(`Validated canonical Typesense schema: ${getSchemaSummary(schema)}.`);
    }
}
async function inspectExistingCollection(schema) {
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
    const inspections = [];
    for (const schema of searchSchemas) {
        const inspection = await inspectExistingCollection(schema);
        logInspection(inspection);
        inspections.push(inspection);
    }
    return inspections;
}
async function deleteCollection(collectionName) {
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
async function createAndVerifyCollection(schema) {
    await typesense.collections().create(schema);
    console.log(`Created Typesense ${schema.name} collection.`);
    const collection = (await typesense.collections(schema.name).retrieve());
    validateRetrievedCollection(collection);
    console.log(`Verified Typesense ${getSchemaSummary(collection)}.`);
}
function getSchemaByName(collectionName) {
    return searchSchemas.find((schema) => schema.name === collectionName);
}
async function runCheck() {
    const inspections = await inspectExistingCollections();
    const failures = inspections.filter((inspection) => inspection.status !== 'ready');
    if (failures.length) {
        throw new Error(`Typesense collection check failed: ${failures.map(getInspectionFailureDetail).join('; ')}. ${getRepairInstruction()}`);
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
        if (inspection.status === 'ready')
            continue;
        if (inspection.status === 'stale') {
            await deleteCollection(schema.name);
        }
        await createAndVerifyCollection(schema);
        changed = true;
    }
    if (!changed) {
        console.log('Typesense initialization complete. All canonical collections were already ready.');
        return;
    }
    console.log('Typesense initialization complete. Terminal 5: run npm run typesense:reindex before relying on search results.');
}
async function runReset() {
    await inspectExistingCollections();
    for (const schema of searchSchemas) {
        await deleteCollection(schema.name);
    }
    for (const schema of searchSchemas) {
        await createAndVerifyCollection(schema);
    }
    console.log('Typesense reset complete. Terminal 5: run npm run typesense:reindex before relying on search results.');
}
async function init(options) {
    console.log(`Initializing canonical Typesense collections. check=${options.check}, dryRun=${options.dryRun}, reset=${options.reset}.`);
    validateCanonicalSchemas();
    if (options.dryRun) {
        console.log('Typesense initialization dry-run complete. No Typesense connection was opened and no collections were deleted or created.');
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
    init(options).catch((error) => {
        console.error('Typesense initialization failed:', errorMessage(error));
        process.exit(1);
    });
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/initTypesense.ts
