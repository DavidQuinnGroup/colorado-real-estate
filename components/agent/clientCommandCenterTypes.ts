export const clientCommandCenterSections = [
  'overview',
  'people',
  'goals',
  'properties',
  'information',
  'readiness',
  'buyer',
  'seller',
  'financial',
  'intelligence',
  'transactions',
  'outputs',
  'authorizations',
] as const;

export type ClientCommandCenterSectionId = (typeof clientCommandCenterSections)[number];

export function isClientCommandCenterSection(value: string | null): value is ClientCommandCenterSectionId {
  return Boolean(value && clientCommandCenterSections.includes(value as ClientCommandCenterSectionId));
}

export function clientCommandCenterSectionsFromIntent(value: string | null) {
  if (value === null) return new Set<ClientCommandCenterSectionId>(['overview']);
  if (value === 'none') return new Set<ClientCommandCenterSectionId>();
  return new Set(value.split(',').filter((entry): entry is ClientCommandCenterSectionId => isClientCommandCenterSection(entry)));
}

export type ClientCaseSummary = {
  id: string;
  displayName: string;
  status: 'ACTIVE' | 'ARCHIVED';
  updatedAt: string;
  parties: Array<{ id: string; role: string; displayLabel: string }>;
  properties: Array<{
    id: string;
    role: string;
    canonicalProperty: { id: string; sourceFormattedSitusAddress: string | null; normalizedSitusAddress: string | null; city: string | null; state: string | null; postalCode: string | null };
  }>;
  transactions: Array<{ id: string; label: string; side: string; status: string; stage: string; updatedAt: string }>;
  _count?: { parties: number; properties: number; transactions: number };
};

export type InformationWorkspaceSummary = {
  current: {
    objectives: { BUY_PRIMARY_HOME: boolean; FINANCIAL_STRATEGY: boolean };
    targetCities: { value: unknown } | null;
    purchasePriceRange: { value: unknown } | null;
    minBedrooms: { value: unknown } | null;
  };
  people: { participations: Array<{ id: string; displayLabel: string; role: string; contact: { displayName: string } | null }> };
  readinessPreview: Record<string, { status: string; missingPreliminary: string[]; missingComprehensive: string[]; helpfulMissing: string[] } | null>;
};

export type OutputSummary = { id: string; productKind: string; subjectRef: string; versions: Array<{ versionOrdinal: number; composition: { title?: string } | null }> };

export function humanize(value: string) {
  return value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function propertyLabel(property: ClientCaseSummary['properties'][number]) {
  return property.canonicalProperty.sourceFormattedSitusAddress || property.canonicalProperty.normalizedSitusAddress || 'Property address unavailable';
}

export function formatInformationValue(value: unknown) {
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'Not provided';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return value.replaceAll('_', ' ');
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (typeof record.minimumCents === 'number' && typeof record.maximumCents === 'number') return `$${(record.minimumCents / 100).toLocaleString()} - $${(record.maximumCents / 100).toLocaleString()}`;
    return 'Provided';
  }
  return 'Not provided';
}
