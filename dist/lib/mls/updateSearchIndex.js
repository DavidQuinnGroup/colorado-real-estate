import { indexListing } from '../typesense/indexListing.js';
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
function getSourceId(listing) {
    const candidates = [listing.id, listing.mlsId, listing.mls_id, listing.ListingKey, listing.ListingId, listing.MLSNumber, listing.address];
    for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim())
            return candidate.trim();
        if (typeof candidate === 'number' && Number.isFinite(candidate))
            return String(candidate);
    }
    return 'unknown';
}
export async function updateSearchIndex(listing) {
    if (!listing) {
        return {
            attempted: false,
            indexed: false,
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
            collections: result.collections,
            error: result.error,
        };
    }
    catch (error) {
        const message = errorMessage(error);
        console.error(`Typesense search index update failed for ${sourceId}:`, message);
        return {
            attempted: true,
            indexed: false,
            sourceId,
            collections: {
                properties: false,
                listings: false,
            },
            error: message,
        };
    }
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/updateSearchIndex.ts
