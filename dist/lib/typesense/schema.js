import Typesense from 'typesense';
export const PROPERTY_COLLECTION_NAME = 'properties';
export const LISTING_COLLECTION_NAME = 'listings';
export const SEARCH_SCHEMA_DEFAULT_SORTING_FIELD = 'price';
export const SEARCH_SCHEMA_FIELD_RULES = [
    { name: 'id', type: 'string' },
    { name: 'mlsId', type: 'string', optional: true },
    { name: 'slug', type: 'string', optional: true },
    { name: 'address', type: 'string' },
    { name: 'city', type: 'string', facet: true },
    { name: 'state', type: 'string', facet: true, optional: true },
    { name: 'zip', type: 'string', facet: true, optional: true },
    { name: 'price', type: 'int64', facet: true, sort: true },
    { name: 'beds', type: 'float', facet: true, optional: true },
    { name: 'baths', type: 'float', facet: true, optional: true },
    { name: 'sqft', type: 'int32', sort: true, optional: true },
    { name: 'lotSize', type: 'float', optional: true },
    { name: 'yearBuilt', type: 'int32', facet: true, sort: true, optional: true },
    { name: 'propertyType', type: 'string', facet: true, optional: true },
    { name: 'status', type: 'string', facet: true },
    { name: 'neighborhood', type: 'string', facet: true },
    { name: 'subdivision', type: 'string', facet: true, optional: true },
    { name: 'schoolDistrict', type: 'string', facet: true, optional: true },
    { name: 'listingAgent', type: 'string', facet: true, optional: true },
    { name: 'listingOffice', type: 'string', facet: true, optional: true },
    { name: 'description', type: 'string', optional: true },
    { name: 'lat', type: 'float', facet: true, optional: true },
    { name: 'lng', type: 'float', facet: true, optional: true },
    { name: 'location', type: 'geopoint', optional: true },
    { name: 'isPrivateExclusive', type: 'bool', facet: true },
    { name: 'efficiencyScore', type: 'int32', facet: true, sort: true, optional: true },
    { name: 'resilienceScore', type: 'int32', facet: true, sort: true, optional: true },
    { name: 'altitude', type: 'int32', facet: true, optional: true },
    { name: 'soilType', type: 'string', facet: true, optional: true },
    { name: 'roofType', type: 'string', facet: true, optional: true },
    { name: 'hasPolybutyleneRisk', type: 'bool', facet: true, optional: true },
    { name: 'createdAt', type: 'int64', sort: true, optional: true },
    { name: 'updatedAt', type: 'int64', sort: true, optional: true },
];
const TYPESENSE_RESERVED_FIELD_NAMES = new Set(['id']);
export const SEARCH_SCHEMA_REQUIRED_FIELD_NAMES = SEARCH_SCHEMA_FIELD_RULES.filter((field) => !field.optional).map((field) => field.name);
export const SEARCH_SCHEMA_REQUIRED_FACET_FIELD_NAMES = SEARCH_SCHEMA_FIELD_RULES.filter((field) => field.facet).map((field) => field.name);
export const SEARCH_SCHEMA_QUERY_FIELD_NAMES = [
    'address',
    'city',
    'neighborhood',
    'subdivision',
    'schoolDistrict',
    'listingAgent',
    'listingOffice',
    'description',
    'zip',
    'mlsId',
];
export const SEARCH_SCHEMA_FILTER_FIELD_NAMES = [
    'lat',
    'lng',
    'price',
    'beds',
    'baths',
    'city',
    'neighborhood',
    'propertyType',
    'status',
    'isPrivateExclusive',
];
export const SEARCH_SCHEMA_SORT_FIELD_NAMES = ['price', 'updatedAt'];
export const SEARCH_SCHEMA_QUERY_BY = SEARCH_SCHEMA_QUERY_FIELD_NAMES.join(',');
export const SEARCH_SCHEMA_DEFAULT_SORT_BY = 'price:desc,updatedAt:desc';
const TYPESENSE_HOST = process.env.TYPESENSE_HOST || 'localhost';
const TYPESENSE_PORT = Number(process.env.TYPESENSE_PORT || 8109);
const TYPESENSE_PROTOCOL = process.env.TYPESENSE_PROTOCOL || 'http';
const TYPESENSE_API_KEY = process.env.TYPESENSE_API_KEY || 'xyz';
export const typesense = new Typesense.Client({
    nodes: [
        {
            host: TYPESENSE_HOST,
            port: Number.isFinite(TYPESENSE_PORT) ? TYPESENSE_PORT : 8109,
            protocol: TYPESENSE_PROTOCOL,
        },
    ],
    apiKey: TYPESENSE_API_KEY,
    connectionTimeoutSeconds: 5,
});
export const client = typesense;
function toTypesenseField(rule) {
    return {
        name: rule.name,
        type: rule.type,
        facet: rule.facet,
        sort: rule.sort,
        optional: rule.optional,
    };
}
function createSearchCollectionSchema(name) {
    return {
        name,
        fields: SEARCH_SCHEMA_FIELD_RULES.filter((rule) => !TYPESENSE_RESERVED_FIELD_NAMES.has(rule.name)).map(toTypesenseField),
        default_sorting_field: SEARCH_SCHEMA_DEFAULT_SORTING_FIELD,
    };
}
function getFieldMap(schema) {
    return new Map((schema.fields || []).map((field) => [field.name, field]));
}
function getDuplicateFieldNames(schema) {
    const seen = new Set();
    const duplicates = new Set();
    for (const field of schema.fields || []) {
        if (seen.has(field.name)) {
            duplicates.add(field.name);
            continue;
        }
        seen.add(field.name);
    }
    return [...duplicates].sort();
}
function getInvalidFields(schema) {
    const fieldMap = getFieldMap(schema);
    const invalidFields = [];
    for (const rule of SEARCH_SCHEMA_FIELD_RULES) {
        if (TYPESENSE_RESERVED_FIELD_NAMES.has(rule.name))
            continue;
        const field = fieldMap.get(rule.name);
        if (!field)
            continue;
        if (field.type !== rule.type) {
            invalidFields.push({
                name: rule.name,
                issue: `expected type ${rule.type}, received ${field.type}`,
            });
        }
        if (rule.facet === true && field.facet !== true) {
            invalidFields.push({
                name: rule.name,
                issue: 'expected faceted field',
            });
        }
        if (rule.sort === true && field.sort !== true) {
            invalidFields.push({
                name: rule.name,
                issue: 'expected sortable field',
            });
        }
        if (rule.optional === true && field.optional !== true) {
            invalidFields.push({
                name: rule.name,
                issue: 'expected optional field',
            });
        }
        if (rule.optional !== true && field.optional === true) {
            invalidFields.push({
                name: rule.name,
                issue: 'expected required field',
            });
        }
    }
    return invalidFields;
}
function getMissingNamedFields(schema, fieldNames) {
    const fieldMap = getFieldMap(schema);
    return fieldNames.filter((fieldName) => !fieldMap.has(fieldName));
}
export function getSearchSchemaValidation(schema) {
    const fieldMap = getFieldMap(schema);
    return {
        duplicateFields: getDuplicateFieldNames(schema),
        missingFields: SEARCH_SCHEMA_REQUIRED_FIELD_NAMES.filter((fieldName) => !TYPESENSE_RESERVED_FIELD_NAMES.has(fieldName) && !fieldMap.has(fieldName)),
        missingFacetFields: SEARCH_SCHEMA_REQUIRED_FACET_FIELD_NAMES.filter((fieldName) => fieldMap.get(fieldName)?.facet !== true),
        missingQueryFields: getMissingNamedFields(schema, SEARCH_SCHEMA_QUERY_FIELD_NAMES),
        missingFilterFields: getMissingNamedFields(schema, SEARCH_SCHEMA_FILTER_FIELD_NAMES),
        missingSortFields: getMissingNamedFields(schema, SEARCH_SCHEMA_SORT_FIELD_NAMES),
        invalidFields: getInvalidFields(schema),
        invalidDefaultSortingField: schema.default_sorting_field === SEARCH_SCHEMA_DEFAULT_SORTING_FIELD
            ? null
            : `expected ${SEARCH_SCHEMA_DEFAULT_SORTING_FIELD}, received ${schema.default_sorting_field || 'none'}`,
    };
}
export function formatSearchSchemaValidationError(schema) {
    const validation = getSearchSchemaValidation(schema);
    const failures = [
        validation.duplicateFields.length ? `duplicate field(s): ${validation.duplicateFields.join(', ')}` : '',
        validation.missingFields.length ? `missing field(s): ${validation.missingFields.join(', ')}` : '',
        validation.missingFacetFields.length ? `missing faceted field(s): ${validation.missingFacetFields.join(', ')}` : '',
        validation.missingQueryFields.length ? `missing query field(s): ${validation.missingQueryFields.join(', ')}` : '',
        validation.missingFilterFields.length ? `missing filter field(s): ${validation.missingFilterFields.join(', ')}` : '',
        validation.missingSortFields.length ? `missing sort field(s): ${validation.missingSortFields.join(', ')}` : '',
        validation.invalidFields.length
            ? `invalid field(s): ${validation.invalidFields.map((field) => `${field.name} (${field.issue})`).join(', ')}`
            : '',
        validation.invalidDefaultSortingField ? `invalid default sort: ${validation.invalidDefaultSortingField}` : '',
    ].filter(Boolean);
    return failures.length ? `Typesense schema ${schema.name} is invalid: ${failures.join('; ')}` : '';
}
export function validateSearchSchema(schema) {
    const error = formatSearchSchemaValidationError(schema);
    if (error) {
        throw new Error(error);
    }
}
export const propertySchema = createSearchCollectionSchema(PROPERTY_COLLECTION_NAME);
export const listingSchema = createSearchCollectionSchema(LISTING_COLLECTION_NAME);
export const searchSchemas = [propertySchema, listingSchema];
for (const schema of searchSchemas) {
    validateSearchSchema(schema);
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts
