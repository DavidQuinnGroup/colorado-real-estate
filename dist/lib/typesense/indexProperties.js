import { createClient } from '@supabase/supabase-js';
import { toListingDocument } from './indexListing.js';
import { LISTING_COLLECTION_NAME, PROPERTY_COLLECTION_NAME, typesense } from './schema.js';
const TARGET_COLLECTIONS = [PROPERTY_COLLECTION_NAME, LISTING_COLLECTION_NAME];
const DEFAULT_BATCH_SIZE = 500;
const MAX_BATCH_SIZE = 1000;
const MAX_RECORDS_LIMIT = 1000000;
const MAX_LOGGED_IMPORT_ERRORS = 5;
const MAX_LOGGED_SKIPPED_DOCUMENTS = 5;
let supabase = null;
function getSupabaseClient() {
    if (supabase)
        return supabase;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Missing Supabase environment variables for Typesense indexing.');
    }
    supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    return supabase;
}
function toPositiveInteger(value, fallback, min, max) {
    if (value === undefined || !Number.isFinite(value))
        return fallback;
    return Math.min(Math.max(Math.floor(value), min), max);
}
function toSingleLine(value) {
    return value.replace(/\s+/g, ' ').trim();
}
function compactNetworkError(value) {
    const dnsFailure = value.match(/getaddrinfo\s+(ENOTFOUND|EAI_AGAIN)\s+([^\s)]+)/);
    if (dnsFailure) {
        return `DNS lookup failed: ${dnsFailure[1]} ${dnsFailure[2]}`;
    }
    return value;
}
function errorMessage(error) {
    if (error instanceof Error)
        return compactNetworkError(toSingleLine(error.message));
    if (error && typeof error === 'object') {
        const candidate = error;
        const parts = [candidate.message, candidate.error_description, candidate.details, candidate.hint]
            .filter((part) => typeof part === 'string' && part.trim().length > 0)
            .map((part) => compactNetworkError(toSingleLine(part)));
        if (parts.length)
            return parts.join(' ');
        try {
            return toSingleLine(JSON.stringify(error));
        }
        catch {
            return toSingleLine(String(error));
        }
    }
    return toSingleLine(String(error));
}
function getSupabaseHost() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl)
        return 'unknown Supabase host';
    try {
        return new URL(supabaseUrl).host;
    }
    catch {
        return supabaseUrl;
    }
}
function getSupabaseFetchFailureMessage(error) {
    return [
        `Failed to fetch properties for Typesense indexing from ${getSupabaseHost()}: ${errorMessage(error)}`,
        'Verify NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DNS, and project status before rerunning npm run typesense:reindex.',
    ].join(' ');
}
function getDocumentId(document) {
    return typeof document.id === 'string' ? document.id : 'unknown';
}
function getPropertyIdentity(property) {
    const candidates = [property.id, property.mlsId, property.ListingKey, property.ListingId, property.address, property.UnparsedAddress];
    for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim())
            return candidate.trim();
        if (typeof candidate === 'number' && Number.isFinite(candidate))
            return String(candidate);
    }
    return 'unknown';
}
function parseImportLine(line) {
    try {
        const parsed = JSON.parse(line);
        return parsed && typeof parsed === 'object' ? parsed : { success: false, error: line };
    }
    catch {
        return { success: false, error: line };
    }
}
function parseImportResponse(response) {
    if (Array.isArray(response)) {
        return response.map((line) => (line && typeof line === 'object' ? line : parseImportLine(String(line))));
    }
    if (typeof response === 'string') {
        return response
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map(parseImportLine);
    }
    if (response && typeof response === 'object') {
        return [response];
    }
    return [];
}
function summarizeImportResponse(collectionName, documents, response) {
    const lines = parseImportResponse(response);
    if (!lines.length) {
        return {
            collectionName,
            indexed: documents.length,
            failed: 0,
            errors: [],
        };
    }
    const failedLines = lines.filter((line) => line.success === false);
    const indexed = Math.max(lines.length - failedLines.length, 0);
    const errors = failedLines.slice(0, MAX_LOGGED_IMPORT_ERRORS).map((line) => {
        const id = line.id || 'unknown';
        return `${collectionName} ${id}: ${line.error || 'Typesense import failed without an error message'}`;
    });
    return {
        collectionName,
        indexed,
        failed: failedLines.length,
        errors,
    };
}
function summarizeRejectedImport(collectionName, documents, error) {
    const firstDocument = documents[0] ? ` First document: ${getDocumentId(documents[0])}.` : '';
    return {
        collectionName,
        indexed: 0,
        failed: documents.length,
        errors: [`${collectionName}: ${errorMessage(error)}.${firstDocument}`],
    };
}
function logImportErrors(summary) {
    for (const error of summary.errors) {
        console.error(`Typesense bulk import failed for ${error}`);
    }
    if (summary.failed > summary.errors.length) {
        console.error(`Typesense bulk import for ${summary.collectionName} had ${summary.failed - summary.errors.length} additional failure(s).`);
    }
}
async function fetchPropertyBatch(from, to) {
    let response;
    try {
        response = await getSupabaseClient()
            .from('Property')
            .select('*')
            .order('updatedAt', { ascending: true })
            .range(from, to);
    }
    catch (error) {
        throw new Error(getSupabaseFetchFailureMessage(error));
    }
    const { data, error } = response;
    if (error) {
        throw new Error(getSupabaseFetchFailureMessage(error));
    }
    return (data || []);
}
async function importDocuments(collectionName, documents) {
    if (!documents.length) {
        return {
            collectionName,
            indexed: 0,
            failed: 0,
            errors: [],
        };
    }
    const response = await typesense.collections(collectionName).documents().import(documents, { action: 'upsert' });
    return summarizeImportResponse(collectionName, documents, response);
}
function buildDocuments(properties) {
    const documents = [];
    let skipped = 0;
    const skippedErrors = [];
    for (const property of properties) {
        try {
            documents.push(toListingDocument(property));
        }
        catch (error) {
            skipped++;
            if (skippedErrors.length < MAX_LOGGED_SKIPPED_DOCUMENTS) {
                skippedErrors.push(`${getPropertyIdentity(property)}: ${errorMessage(error)}`);
            }
        }
    }
    for (const error of skippedErrors) {
        console.warn(`Skipping property during Typesense indexing: ${error}`);
    }
    if (skipped > skippedErrors.length) {
        console.warn(`Skipped ${skipped - skippedErrors.length} additional propert${skipped - skippedErrors.length === 1 ? 'y' : 'ies'} during Typesense indexing.`);
    }
    return {
        documents,
        skipped,
    };
}
async function importPropertyBatch(properties) {
    if (!properties.length) {
        return {
            fetched: 0,
            skipped: 0,
            indexed: 0,
            failed: 0,
            propertiesIndexed: 0,
            listingsIndexed: 0,
            propertiesFailed: 0,
            listingsFailed: 0,
        };
    }
    const { documents, skipped } = buildDocuments(properties);
    const results = await Promise.allSettled(TARGET_COLLECTIONS.map((collectionName) => importDocuments(collectionName, documents)));
    const collectionSummaries = results.map((result, index) => {
        const collectionName = TARGET_COLLECTIONS[index] || 'unknown';
        return result.status === 'fulfilled'
            ? result.value
            : summarizeRejectedImport(collectionName, documents, result.reason);
    });
    const propertiesSummary = collectionSummaries[0];
    const listingsSummary = collectionSummaries[1];
    for (const summary of collectionSummaries) {
        logImportErrors(summary);
    }
    return {
        fetched: properties.length,
        skipped,
        indexed: Math.max(propertiesSummary?.indexed || 0, listingsSummary?.indexed || 0),
        failed: Math.max(propertiesSummary?.failed || 0, listingsSummary?.failed || 0),
        propertiesIndexed: propertiesSummary?.indexed || 0,
        listingsIndexed: listingsSummary?.indexed || 0,
        propertiesFailed: propertiesSummary?.failed || 0,
        listingsFailed: listingsSummary?.failed || 0,
    };
}
export { toListingDocument as toTypesenseDocument };
export async function indexProperties(options = {}) {
    const batchSize = toPositiveInteger(options.batchSize, DEFAULT_BATCH_SIZE, 1, MAX_BATCH_SIZE);
    const maxRecords = options.maxRecords === undefined
        ? Number.POSITIVE_INFINITY
        : toPositiveInteger(options.maxRecords, batchSize, 1, MAX_RECORDS_LIMIT);
    const summary = {
        fetched: 0,
        indexed: 0,
        skipped: 0,
        failed: 0,
        propertiesIndexed: 0,
        listingsIndexed: 0,
        propertiesFailed: 0,
        listingsFailed: 0,
        batches: 0,
    };
    while (summary.fetched < maxRecords) {
        const remaining = maxRecords - summary.fetched;
        const requestedBatchSize = Math.min(batchSize, remaining);
        const from = summary.fetched;
        const to = from + requestedBatchSize - 1;
        const properties = await fetchPropertyBatch(from, to);
        if (properties.length === 0)
            break;
        const imported = await importPropertyBatch(properties);
        summary.fetched += imported.fetched;
        summary.indexed += imported.indexed;
        summary.skipped += imported.skipped;
        summary.failed += imported.failed;
        summary.propertiesIndexed += imported.propertiesIndexed;
        summary.listingsIndexed += imported.listingsIndexed;
        summary.propertiesFailed += imported.propertiesFailed;
        summary.listingsFailed += imported.listingsFailed;
        summary.batches++;
        console.log(`Typesense indexed batch ${summary.batches}: fetched=${imported.fetched}, indexed=${imported.indexed}, skipped=${imported.skipped}, failed=${imported.failed}. Total fetched: ${summary.fetched}.`);
        if (properties.length < requestedBatchSize)
            break;
    }
    if (summary.indexed === 0) {
        console.log(`No properties were indexed into Typesense. Fetched: ${summary.fetched}. Skipped: ${summary.skipped}. Failed: ${summary.failed}.`);
    }
    else {
        console.log(`Indexed ${summary.indexed} properties across ${summary.batches} batch(es): fetched=${summary.fetched}, ${summary.propertiesIndexed} ${PROPERTY_COLLECTION_NAME}, ${summary.listingsIndexed} ${LISTING_COLLECTION_NAME}, ${summary.propertiesFailed} ${PROPERTY_COLLECTION_NAME} failed, ${summary.listingsFailed} ${LISTING_COLLECTION_NAME} failed, ${summary.skipped} skipped.`);
    }
    return summary;
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexProperties.ts
