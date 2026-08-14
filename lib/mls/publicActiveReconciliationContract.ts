export type PublicActiveLocalRow = {
  propertyId: string;
  sourceId: string | null | undefined;
  status: string | null | undefined;
  isPrivateExclusive: boolean;
};

export type ProviderPublicScopeSnapshot = {
  complete: boolean;
  sourceIds: readonly string[];
};

export type ProviderStatusEvidence = {
  found: boolean;
  status?: string | null;
};

export type PublicActiveReconciliationReason =
  | 'LOCAL_NOT_PUBLIC_ACTIVE_CANDIDATE'
  | 'IDENTITY_INVALID'
  | 'DUPLICATE_LOCAL_SOURCE_ID'
  | 'PROVIDER_SNAPSHOT_INCOMPLETE'
  | 'VERIFIED_IN_CURRENT_PROVIDER_PUBLIC_SCOPE'
  | 'ABSENT_FROM_COMPLETED_PROVIDER_PUBLIC_SCOPE'
  | 'AUTHORITATIVE_PROVIDER_STATUS_PUBLIC'
  | 'AUTHORITATIVE_PROVIDER_STATUS_NON_PUBLIC'
  | 'PROVIDER_RECORD_UNAVAILABLE'
  | 'PROVIDER_STATUS_AMBIGUOUS';

export type PublicActiveReconciliationDisposition =
  | 'allow_public_active'
  | 'exclude_public_active'
  | 'requires_authoritative_resolution'
  | 'blocked';

export type PublicActiveReconciliationRow = {
  propertyId: string;
  sourceId: string | null;
  localStatus: string;
  isPrivateExclusive: boolean;
  localPublicActiveCandidate: boolean;
  reason: PublicActiveReconciliationReason;
  disposition: PublicActiveReconciliationDisposition;
  publicSearchEligible: boolean;
  savedSearchNewListingEligible: boolean;
};

export type PublicActiveReconciliationSummary = {
  totalRows: number;
  localPublicActiveCandidates: number;
  verifiedCurrentProviderPublicScope: number;
  absentFromCompletedProviderPublicScope: number;
  blockedIncompleteSnapshot: number;
  duplicateIdentityRows: number;
  invalidIdentityRows: number;
  publicSearchEligible: number;
  savedSearchNewListingEligible: number;
};

export type PublicActiveReconciliationResult = {
  rows: PublicActiveReconciliationRow[];
  summary: PublicActiveReconciliationSummary;
};

const LOCAL_PUBLIC_ACTIVE_STATUS_KEYS = new Set(['active']);
const CURRENT_PROVIDER_PUBLIC_STATUS_KEYS = new Set(['active', 'coming soon']);

export function normalizePublicActiveSourceId(value: string | null | undefined) {
  const cleaned = value?.trim() ?? '';
  return cleaned || null;
}

export function normalizePublicActiveStatus(value: string | null | undefined) {
  return (value ?? '').trim();
}

function normalizeStatusKey(value: string | null | undefined) {
  return normalizePublicActiveStatus(value).replace(/\s+/g, ' ').toLowerCase();
}

export function isLocalPublicActiveCandidate(row: Pick<PublicActiveLocalRow, 'status' | 'isPrivateExclusive'>) {
  return row.isPrivateExclusive === false && LOCAL_PUBLIC_ACTIVE_STATUS_KEYS.has(normalizeStatusKey(row.status));
}

export function isCurrentProviderPublicScopeStatus(status: string | null | undefined) {
  return CURRENT_PROVIDER_PUBLIC_STATUS_KEYS.has(normalizeStatusKey(status));
}

function summarizeRows(rows: PublicActiveReconciliationRow[]): PublicActiveReconciliationSummary {
  return {
    totalRows: rows.length,
    localPublicActiveCandidates: rows.filter((row) => row.localPublicActiveCandidate).length,
    verifiedCurrentProviderPublicScope: rows.filter((row) => row.reason === 'VERIFIED_IN_CURRENT_PROVIDER_PUBLIC_SCOPE').length,
    absentFromCompletedProviderPublicScope: rows.filter((row) => row.reason === 'ABSENT_FROM_COMPLETED_PROVIDER_PUBLIC_SCOPE').length,
    blockedIncompleteSnapshot: rows.filter((row) => row.reason === 'PROVIDER_SNAPSHOT_INCOMPLETE').length,
    duplicateIdentityRows: rows.filter((row) => row.reason === 'DUPLICATE_LOCAL_SOURCE_ID').length,
    invalidIdentityRows: rows.filter((row) => row.reason === 'IDENTITY_INVALID').length,
    publicSearchEligible: rows.filter((row) => row.publicSearchEligible).length,
    savedSearchNewListingEligible: rows.filter((row) => row.savedSearchNewListingEligible).length,
  };
}

function blockedRow(
  row: PublicActiveLocalRow,
  sourceId: string | null,
  reason: PublicActiveReconciliationReason,
): PublicActiveReconciliationRow {
  return {
    propertyId: row.propertyId,
    sourceId,
    localStatus: normalizePublicActiveStatus(row.status),
    isPrivateExclusive: row.isPrivateExclusive,
    localPublicActiveCandidate: isLocalPublicActiveCandidate(row),
    reason,
    disposition: 'blocked',
    publicSearchEligible: false,
    savedSearchNewListingEligible: false,
  };
}

function excludedRow(
  row: PublicActiveLocalRow,
  sourceId: string | null,
  reason: PublicActiveReconciliationReason,
): PublicActiveReconciliationRow {
  return {
    propertyId: row.propertyId,
    sourceId,
    localStatus: normalizePublicActiveStatus(row.status),
    isPrivateExclusive: row.isPrivateExclusive,
    localPublicActiveCandidate: isLocalPublicActiveCandidate(row),
    reason,
    disposition: 'exclude_public_active',
    publicSearchEligible: false,
    savedSearchNewListingEligible: false,
  };
}

export function analyzePublicActiveReconciliation(input: {
  localRows: readonly PublicActiveLocalRow[];
  providerPublicScopeSnapshot: ProviderPublicScopeSnapshot;
}): PublicActiveReconciliationResult {
  const providerPublicSourceIds = new Set(input.providerPublicScopeSnapshot.sourceIds.map(normalizePublicActiveSourceId).filter(Boolean));
  const localSourceCounts = new Map<string, number>();

  for (const row of input.localRows) {
    const sourceId = normalizePublicActiveSourceId(row.sourceId);
    if (!sourceId) continue;
    localSourceCounts.set(sourceId, (localSourceCounts.get(sourceId) ?? 0) + 1);
  }

  const rows = input.localRows.map((row): PublicActiveReconciliationRow => {
    const sourceId = normalizePublicActiveSourceId(row.sourceId);
    const localPublicActiveCandidate = isLocalPublicActiveCandidate(row);
    const localStatus = normalizePublicActiveStatus(row.status);

    if (!localPublicActiveCandidate) {
      return excludedRow(row, sourceId, 'LOCAL_NOT_PUBLIC_ACTIVE_CANDIDATE');
    }

    if (!sourceId) {
      return blockedRow(row, sourceId, 'IDENTITY_INVALID');
    }

    if ((localSourceCounts.get(sourceId) ?? 0) > 1) {
      return blockedRow(row, sourceId, 'DUPLICATE_LOCAL_SOURCE_ID');
    }

    if (!input.providerPublicScopeSnapshot.complete) {
      return blockedRow(row, sourceId, 'PROVIDER_SNAPSHOT_INCOMPLETE');
    }

    if (!providerPublicSourceIds.has(sourceId)) {
      return {
        propertyId: row.propertyId,
        sourceId,
        localStatus,
        isPrivateExclusive: row.isPrivateExclusive,
        localPublicActiveCandidate,
        reason: 'ABSENT_FROM_COMPLETED_PROVIDER_PUBLIC_SCOPE',
        disposition: 'requires_authoritative_resolution',
        publicSearchEligible: false,
        savedSearchNewListingEligible: false,
      };
    }

    return {
      propertyId: row.propertyId,
      sourceId,
      localStatus,
      isPrivateExclusive: row.isPrivateExclusive,
      localPublicActiveCandidate,
      reason: 'VERIFIED_IN_CURRENT_PROVIDER_PUBLIC_SCOPE',
      disposition: 'allow_public_active',
      publicSearchEligible: true,
      savedSearchNewListingEligible: true,
    };
  });

  return {
    rows,
    summary: summarizeRows(rows),
  };
}

export function applyProviderStatusEvidence(
  row: PublicActiveReconciliationRow,
  evidence: ProviderStatusEvidence,
): PublicActiveReconciliationRow {
  if (row.reason !== 'ABSENT_FROM_COMPLETED_PROVIDER_PUBLIC_SCOPE') {
    return row;
  }

  if (!evidence.found) {
    return {
      ...row,
      reason: 'PROVIDER_RECORD_UNAVAILABLE',
      disposition: 'requires_authoritative_resolution',
      publicSearchEligible: false,
      savedSearchNewListingEligible: false,
    };
  }

  if (!normalizePublicActiveStatus(evidence.status)) {
    return {
      ...row,
      reason: 'PROVIDER_STATUS_AMBIGUOUS',
      disposition: 'requires_authoritative_resolution',
      publicSearchEligible: false,
      savedSearchNewListingEligible: false,
    };
  }

  if (isCurrentProviderPublicScopeStatus(evidence.status)) {
    return {
      ...row,
      reason: 'AUTHORITATIVE_PROVIDER_STATUS_PUBLIC',
      disposition: 'allow_public_active',
      publicSearchEligible: true,
      savedSearchNewListingEligible: normalizeStatusKey(evidence.status) === 'active',
    };
  }

  return {
    ...row,
    reason: 'AUTHORITATIVE_PROVIDER_STATUS_NON_PUBLIC',
    disposition: 'exclude_public_active',
    publicSearchEligible: false,
    savedSearchNewListingEligible: false,
  };
}
