import { indexListing, toListingDocument, type ListingIndexDocument } from '../typesense/indexListing.js';
import { LISTING_COLLECTION_NAME, PROPERTY_COLLECTION_NAME, SEARCH_SCHEMA_REQUIRED_FIELD_NAMES } from '../typesense/schema.js';

type SearchIndexInput = Record<string, unknown>;

export type SearchIndexDiagnostics = {
  canIndex: boolean;
  sourceId: string;
  documentId?: string;
  requiredFields: string[];
  missingRequiredFields: string[];
  collections: {
    properties: typeof PROPERTY_COLLECTION_NAME;
    listings: typeof LISTING_COLLECTION_NAME;
  };
  terminal: 'Terminal 5';
  module: 'MLS Search Index';
  commands: {
    schemaCheck: string;
    schemaRepair: string;
    reindex: string;
    searchSmoke: string;
  };
  document?: Pick<
    ListingIndexDocument,
    | 'id'
    | 'mlsId'
    | 'address'
    | 'city'
    | 'price'
    | 'status'
    | 'neighborhood'
    | 'isPrivateExclusive'
    | 'efficiencyScore'
    | 'resilienceScore'
    | 'hasPolybutyleneRisk'
  >;
  error?: string;
};

export type SearchIndexResult = {
  attempted: boolean;
  indexed: boolean;
  documentId?: string;
  sourceId?: string;
  diagnostics: SearchIndexDiagnostics;
  collections: {
    properties: boolean;
    listings: boolean;
  };
  error?: string;
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getSourceId(listing: SearchIndexInput) {
  const candidates = [listing.id, listing.mlsId, listing.mls_id, listing.ListingKey, listing.ListingId, listing.MLSNumber, listing.address];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
    if (typeof candidate === 'number' && Number.isFinite(candidate)) return String(candidate);
  }

  return 'unknown';
}

function getMissingRequiredFields(document: ListingIndexDocument) {
  return SEARCH_SCHEMA_REQUIRED_FIELD_NAMES.filter((fieldName) => {
    const value = document[fieldName as keyof ListingIndexDocument];
    return value === undefined || value === null || value === '';
  });
}

function getSearchIndexCommands() {
  return {
    schemaCheck: 'npm run typesense:collections:check',
    schemaRepair: 'npm run typesense:init',
    reindex: 'npm run typesense:reindex',
    searchSmoke: 'npm run smoke:search',
  };
}

function baseDiagnostics(sourceId: string): Omit<SearchIndexDiagnostics, 'canIndex' | 'missingRequiredFields'> {
  return {
    sourceId,
    requiredFields: [...SEARCH_SCHEMA_REQUIRED_FIELD_NAMES],
    collections: {
      properties: PROPERTY_COLLECTION_NAME,
      listings: LISTING_COLLECTION_NAME,
    },
    terminal: 'Terminal 5',
    module: 'MLS Search Index',
    commands: getSearchIndexCommands(),
  };
}

export function getSearchIndexDiagnostics(listing?: SearchIndexInput | null): SearchIndexDiagnostics {
  if (!listing) {
    return {
      ...baseDiagnostics('unknown'),
      canIndex: false,
      missingRequiredFields: [...SEARCH_SCHEMA_REQUIRED_FIELD_NAMES],
      error: 'No listing was provided for search index update.',
    };
  }

  const sourceId = getSourceId(listing);

  try {
    const document = toListingDocument(listing);
    const missingRequiredFields = getMissingRequiredFields(document);

    return {
      ...baseDiagnostics(sourceId),
      canIndex: missingRequiredFields.length === 0,
      documentId: document.id,
      missingRequiredFields,
      document: {
        id: document.id,
        mlsId: document.mlsId,
        address: document.address,
        city: document.city,
        price: document.price,
        status: document.status,
        neighborhood: document.neighborhood,
        isPrivateExclusive: document.isPrivateExclusive,
        efficiencyScore: document.efficiencyScore,
        resilienceScore: document.resilienceScore,
        hasPolybutyleneRisk: document.hasPolybutyleneRisk,
      },
    };
  } catch (error) {
    return {
      ...baseDiagnostics(sourceId),
      canIndex: false,
      missingRequiredFields: [],
      error: errorMessage(error),
    };
  }
}

export async function updateSearchIndex(listing?: SearchIndexInput | null): Promise<SearchIndexResult> {
  const diagnostics = getSearchIndexDiagnostics(listing);

  if (!listing) {
    return {
      attempted: false,
      indexed: false,
      diagnostics,
      collections: {
        properties: false,
        listings: false,
      },
      error: 'No listing was provided for search index update.',
    };
  }

  const sourceId = getSourceId(listing);

  try {
    const result = await indexListing(listing);

    return {
      attempted: true,
      indexed: result.indexed,
      documentId: result.documentId,
      sourceId,
      diagnostics,
      collections: result.collections,
      error: result.error,
    };
  } catch (error) {
    const message = errorMessage(error);
    console.error(`Typesense search index update failed for ${sourceId}:`, message);

    return {
      attempted: true,
      indexed: false,
      sourceId,
      diagnostics: {
        ...diagnostics,
        canIndex: false,
        error: message,
      },
      collections: {
        properties: false,
        listings: false,
      },
      error: message,
    };
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/updateSearchIndex.ts
