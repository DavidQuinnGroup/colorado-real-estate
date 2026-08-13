export type MlsTimestampClassification =
  | 'SOURCE_CHANGE_TIMESTAMP'
  | 'LISTING_ORIGIN_TIMESTAMP'
  | 'STATUS_TIMESTAMP'
  | 'INGESTION_ONLY'
  | 'NOT_AVAILABLE'
  | 'UNKNOWN';

export type MlsSourceTimestampField = {
  field: string;
  classification: MlsTimestampClassification;
  repositoryEvidence: string;
  sourceFreshnessCandidate: boolean;
};

export type MlsSourceFreshness = {
  field: string | null;
  sourceModifiedAt: Date | null;
  issue: 'ok' | 'missing_source_timestamp' | 'malformed_source_timestamp';
};

export type SourceFreshnessWindowResult = {
  eligible: boolean;
  ageHours: number | null;
  reason: 'SOURCE_FRESH' | 'SOURCE_STALE' | 'SOURCE_TIMESTAMP_MISSING' | 'SOURCE_TIMESTAMP_MALFORMED' | 'EVALUATION_TIME_INVALID';
};

export type SourceFreshnessPersistenceDecision =
  | 'persist_incoming'
  | 'keep_existing_missing_incoming'
  | 'keep_existing_malformed_incoming'
  | 'keep_existing_older_incoming'
  | 'no_change_same_timestamp';

export type ResolvedMlsSourceModifiedAt = MlsSourceFreshness & {
  decision: SourceFreshnessPersistenceDecision;
  persistedSourceModifiedAt: Date | null;
};

export const REIE_MLS_SOURCE_FRESHNESS_FIELD = 'sourceModifiedAt';
export const REIE_MLS_SOURCE_FRESHNESS_PRIMARY_PAYLOAD_FIELD = 'ModificationTimestamp';
export const REIE_NEW_LISTING_FRESHNESS_WINDOW_HOURS = 72;

const sourceTimestampCandidateFields = ['ModificationTimestamp', 'ListingModificationTimestamp'] as const;

export const MLS_SOURCE_TIMESTAMP_FIELD_INVENTORY: readonly MlsSourceTimestampField[] = [
  {
    field: 'ModificationTimestamp',
    classification: 'SOURCE_CHANGE_TIMESTAMP',
    repositoryEvidence: 'MLS Grid delta cursor uses ModificationTimestamp gt lastSync and orders by ModificationTimestamp.',
    sourceFreshnessCandidate: true,
  },
  {
    field: 'ListingModificationTimestamp',
    classification: 'SOURCE_CHANGE_TIMESTAMP',
    repositoryEvidence: 'Typesense indexing treats ListingModificationTimestamp as an update timestamp fallback.',
    sourceFreshnessCandidate: true,
  },
  {
    field: 'MajorChangeTimestamp',
    classification: 'SOURCE_CHANGE_TIMESTAMP',
    repositoryEvidence: 'Typesense indexing treats MajorChangeTimestamp as an update timestamp fallback.',
    sourceFreshnessCandidate: false,
  },
  {
    field: 'PriceChangeTimestamp',
    classification: 'SOURCE_CHANGE_TIMESTAMP',
    repositoryEvidence: 'Typesense indexing treats PriceChangeTimestamp as an update timestamp fallback.',
    sourceFreshnessCandidate: false,
  },
  {
    field: 'ListingContractDate',
    classification: 'LISTING_ORIGIN_TIMESTAMP',
    repositoryEvidence: 'Typesense indexing treats ListingContractDate as a created/listed timestamp candidate.',
    sourceFreshnessCandidate: false,
  },
  {
    field: 'OnMarketDate',
    classification: 'LISTING_ORIGIN_TIMESTAMP',
    repositoryEvidence: 'Typesense indexing treats OnMarketDate as a created/listed timestamp candidate.',
    sourceFreshnessCandidate: false,
  },
  {
    field: 'OriginalEntryTimestamp',
    classification: 'LISTING_ORIGIN_TIMESTAMP',
    repositoryEvidence: 'Typesense indexing treats OriginalEntryTimestamp as a created/listed timestamp candidate.',
    sourceFreshnessCandidate: false,
  },
  {
    field: 'StatusChangeTimestamp',
    classification: 'STATUS_TIMESTAMP',
    repositoryEvidence: 'Typesense indexing treats StatusChangeTimestamp as an update timestamp fallback.',
    sourceFreshnessCandidate: false,
  },
  {
    field: 'PhotosChangeTimestamp',
    classification: 'UNKNOWN',
    repositoryEvidence: 'No current repository mapper, indexer, or fetch contract references PhotosChangeTimestamp.',
    sourceFreshnessCandidate: false,
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseSourceTimestamp(value: unknown) {
  if (value instanceof Date) {
    return Number.isFinite(value.getTime()) ? value : null;
  }

  if (typeof value !== 'string' || !value.trim()) return null;

  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function hasTimestampValue(listing: Record<string, unknown>, field: string) {
  const value = listing[field];
  return value !== undefined && value !== null && String(value).trim() !== '';
}

export function getMlsSourceFreshness(listing: unknown): MlsSourceFreshness {
  if (!isRecord(listing)) {
    return {
      field: null,
      sourceModifiedAt: null,
      issue: 'missing_source_timestamp',
    };
  }

  for (const field of sourceTimestampCandidateFields) {
    if (!hasTimestampValue(listing, field)) continue;

    const sourceModifiedAt = parseSourceTimestamp(listing[field]);

    return {
      field,
      sourceModifiedAt,
      issue: sourceModifiedAt ? 'ok' : 'malformed_source_timestamp',
    };
  }

  return {
    field: null,
    sourceModifiedAt: null,
    issue: 'missing_source_timestamp',
  };
}

export function isFreshForNewListingAlert(
  sourceFreshness: MlsSourceFreshness,
  evaluatedAt: Date | string,
  maxAgeHours = REIE_NEW_LISTING_FRESHNESS_WINDOW_HOURS,
): SourceFreshnessWindowResult {
  const evaluatedAtDate = parseSourceTimestamp(evaluatedAt);

  if (!evaluatedAtDate || !Number.isFinite(maxAgeHours) || maxAgeHours < 0) {
    return {
      eligible: false,
      ageHours: null,
      reason: 'EVALUATION_TIME_INVALID',
    };
  }

  if (sourceFreshness.issue === 'missing_source_timestamp') {
    return {
      eligible: false,
      ageHours: null,
      reason: 'SOURCE_TIMESTAMP_MISSING',
    };
  }

  if (sourceFreshness.issue === 'malformed_source_timestamp' || !sourceFreshness.sourceModifiedAt) {
    return {
      eligible: false,
      ageHours: null,
      reason: 'SOURCE_TIMESTAMP_MALFORMED',
    };
  }

  const ageHours = (evaluatedAtDate.getTime() - sourceFreshness.sourceModifiedAt.getTime()) / (60 * 60 * 1000);
  const eligible = ageHours <= maxAgeHours;

  return {
    eligible,
    ageHours,
    reason: eligible ? 'SOURCE_FRESH' : 'SOURCE_STALE',
  };
}

export function getSourceFreshnessPersistenceDecision(
  incoming: MlsSourceFreshness,
  existingSourceModifiedAt: Date | string | null | undefined,
): SourceFreshnessPersistenceDecision {
  const existing = parseSourceTimestamp(existingSourceModifiedAt);

  if (incoming.issue === 'missing_source_timestamp') return 'keep_existing_missing_incoming';
  if (incoming.issue === 'malformed_source_timestamp' || !incoming.sourceModifiedAt) return 'keep_existing_malformed_incoming';

  if (!existing) return 'persist_incoming';

  const incomingMs = incoming.sourceModifiedAt.getTime();
  const existingMs = existing.getTime();

  if (incomingMs < existingMs) return 'keep_existing_older_incoming';
  if (incomingMs === existingMs) return 'no_change_same_timestamp';

  return 'persist_incoming';
}

export function resolveMlsSourceModifiedAt(
  listing: unknown,
  existingSourceModifiedAt: Date | string | null | undefined,
): ResolvedMlsSourceModifiedAt {
  const incoming = getMlsSourceFreshness(listing);
  const existing = parseSourceTimestamp(existingSourceModifiedAt);
  const decision = getSourceFreshnessPersistenceDecision(incoming, existing);
  const persistedSourceModifiedAt = decision === 'persist_incoming' ? incoming.sourceModifiedAt : existing;

  return {
    ...incoming,
    decision,
    persistedSourceModifiedAt,
  };
}

export function isSourceFreshnessAfterIngestion(sourceFreshness: MlsSourceFreshness, ingestionAt: Date | string) {
  const ingestionDate = parseSourceTimestamp(ingestionAt);

  if (!sourceFreshness.sourceModifiedAt || !ingestionDate) return false;

  return sourceFreshness.sourceModifiedAt.getTime() > ingestionDate.getTime();
}
