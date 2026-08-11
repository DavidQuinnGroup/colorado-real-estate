export const CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_STATUS = 'CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_IMPLEMENTED';
export const CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_ROUTE = '/properties/compare';
export const CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MIN_SELECTIONS = 2;
export const CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS = 3;
export const CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_QUERY_LENGTH = 620;

export type CustomerControlledComparisonNoticeReason =
  | 'empty'
  | 'single-selection'
  | 'duplicate'
  | 'malformed'
  | 'selection-limit'
  | 'unavailable'
  | 'oversized-query';

export type CustomerControlledComparisonNotice = {
  id?: string;
  reason: CustomerControlledComparisonNoticeReason;
  message: string;
};

export type CustomerControlledComparisonParseResult = {
  acceptedIds: string[];
  canonicalIds: string[];
  canAttemptRead: boolean;
  canCompare: boolean;
  isOversized: boolean;
  notices: CustomerControlledComparisonNotice[];
  canonicalHref: string;
};

export type CustomerControlledComparisonPropertyInput = {
  id: string;
  address: string;
  city?: string | null;
  state?: string | null;
  price?: number | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  lotSize?: number | null;
  yearBuilt?: number | null;
  propertyType?: string | null;
  status?: string | null;
  updatedAt?: Date | string | null;
  lastIntelligenceSync?: Date | string | null;
};

export type CustomerControlledComparisonEvidenceState =
  | 'SUPPORTED'
  | 'DERIVED / CALCULATED'
  | 'ASYMMETRIC'
  | 'UNAVAILABLE'
  | 'VERIFICATION REQUIRED';

export type CustomerControlledComparisonCell = {
  propertyId: string;
  value: string;
  href?: string;
  evidenceState: CustomerControlledComparisonEvidenceState;
};

export type CustomerControlledComparisonRow = {
  key:
    | 'identity'
    | 'location'
    | 'listedPrice'
    | 'beds'
    | 'baths'
    | 'sqft'
    | 'lotSize'
    | 'yearBuilt'
    | 'propertyType'
    | 'status'
    | 'pricePerSquareFoot'
    | 'freshness';
  label: string;
  source: 'Public listing facts' | 'Public listing facts + labelled arithmetic' | 'Existing listing timestamp';
  limitation: string;
  cells: CustomerControlledComparisonCell[];
};

export type CustomerControlledComparisonSourceTransparencyItem = {
  label: 'Source' | 'Period / Freshness' | 'Limitation' | 'Verify';
  value: string;
  detail: string;
  href?: '/sources' | '/properties' | '/contact#advisory-readiness';
};

export type CustomerControlledComparisonWorkspace = {
  status: typeof CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_STATUS;
  route: typeof CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_ROUTE;
  selection: CustomerControlledComparisonParseResult;
  properties: CustomerControlledComparisonPropertyInput[];
  canCompare: boolean;
  rows: CustomerControlledComparisonRow[];
  sourceTransparency: CustomerControlledComparisonSourceTransparencyItem[];
  trustBoundaries: string[];
  protectedBoundaries: {
    ranking: false;
    scoring: false;
    recommendation: false;
    suitability: false;
    valuation: false;
    offerGuidance: false;
    financingAdvice: false;
    legalAdvice: false;
    taxAdvice: false;
    apiChange: false;
    schemaChange: false;
    providerActivation: false;
    persistence: false;
    telemetry: false;
  };
};

const PROPERTY_ID_PATTERN = /^[A-Za-z0-9._~-]{1,160}$/;

function normalizeId(value: string) {
  return value.trim();
}

function buildHref(ids: string[]) {
  return ids.length ? `${CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_ROUTE}?ids=${encodeURIComponent(ids.join(','))}` : CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_ROUTE;
}

export function parseCustomerControlledComparisonIds(rawIds: string | string[] | undefined): CustomerControlledComparisonParseResult {
  const rawValue = Array.isArray(rawIds) ? rawIds.join(',') : rawIds || '';
  const notices: CustomerControlledComparisonNotice[] = [];

  if (rawValue.length > CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_QUERY_LENGTH) {
    return {
      acceptedIds: [],
      canonicalIds: [],
      canAttemptRead: false,
      canCompare: false,
      isOversized: true,
      notices: [
        {
          reason: 'oversized-query',
          message: 'The comparison link is too large to use safely. Choose up to three homes again from Search.',
        },
      ],
      canonicalHref: CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_ROUTE,
    };
  }

  const tokens = rawValue
    .split(',')
    .map(normalizeId)
    .filter(Boolean);

  if (tokens.length === 0) {
    notices.push({
      reason: 'empty',
      message: 'Choose two or three homes from Search to open a side-by-side comparison.',
    });
  }

  if (tokens.length > CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS) {
    return {
      acceptedIds: [],
      canonicalIds: [],
      canAttemptRead: false,
      canCompare: false,
      isOversized: false,
      notices: [
        {
          reason: 'selection-limit',
          message: 'This workspace compares up to three customer-chosen homes. Nothing was truncated; choose three or fewer homes.',
        },
      ],
      canonicalHref: CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_ROUTE,
    };
  }

  const seen = new Set<string>();
  const acceptedIds: string[] = [];

  for (const token of tokens) {
    if (!PROPERTY_ID_PATTERN.test(token)) {
      notices.push({
        id: token,
        reason: 'malformed',
        message: `A malformed property id was omitted: ${token}`,
      });
      continue;
    }

    if (seen.has(token)) {
      notices.push({
        id: token,
        reason: 'duplicate',
        message: `Duplicate selection omitted: ${token}`,
      });
      continue;
    }

    seen.add(token);
    acceptedIds.push(token);
  }

  if (acceptedIds.length === 1) {
    notices.push({
      id: acceptedIds[0],
      reason: 'single-selection',
      message: 'One home is selected. Add one more home before opening a side-by-side workspace.',
    });
  }

  const canonicalIds = [...acceptedIds].sort((left, right) => left.localeCompare(right));

  return {
    acceptedIds,
    canonicalIds,
    canAttemptRead: acceptedIds.length > 0,
    canCompare: acceptedIds.length >= CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MIN_SELECTIONS,
    isOversized: false,
    notices,
    canonicalHref: buildHref(canonicalIds),
  };
}

function hasValue(value: unknown) {
  return value !== null && value !== undefined && value !== '';
}

function formatText(value: string | null | undefined) {
  return value?.trim() || 'Not provided / Verification required';
}

function formatNumber(value: number | null | undefined, suffix = '') {
  return typeof value === 'number' && Number.isFinite(value) ? `${value.toLocaleString('en-US')}${suffix}` : 'Not provided / Verification required';
}

function formatCurrency(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return 'Not provided / Verification required';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatLotSize(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return 'Not provided / Verification required';
  const formatted = value >= 1 ? value.toFixed(value >= 10 ? 1 : 2) : value.toFixed(2);
  return `${formatted.replace(/\.?0+$/, '')} acres`;
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return 'Unavailable / Verification required';
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Unavailable / Verification required';

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'America/Denver',
  }).format(parsed);
}

function pricePerSquareFoot(property: CustomerControlledComparisonPropertyInput) {
  if (typeof property.price !== 'number' || typeof property.sqft !== 'number' || property.price <= 0 || property.sqft <= 0) return null;
  return Math.round(property.price / property.sqft);
}

function evidenceFor(values: unknown[], derived = false): CustomerControlledComparisonEvidenceState {
  const availableCount = values.filter(hasValue).length;
  if (availableCount === 0) return 'UNAVAILABLE';
  if (availableCount !== values.length) return 'ASYMMETRIC';
  return derived ? 'DERIVED / CALCULATED' : 'SUPPORTED';
}

function buildCells(
  properties: CustomerControlledComparisonPropertyInput[],
  formatter: (property: CustomerControlledComparisonPropertyInput) => string,
  evidenceState: CustomerControlledComparisonEvidenceState,
  href = false,
): CustomerControlledComparisonCell[] {
  return properties.map((property) => ({
    propertyId: property.id,
    value: formatter(property),
    href: href ? `/properties/${property.id}` : undefined,
    evidenceState,
  }));
}

function buildRows(properties: CustomerControlledComparisonPropertyInput[]): CustomerControlledComparisonRow[] {
  const row = (
    key: CustomerControlledComparisonRow['key'],
    label: string,
    source: CustomerControlledComparisonRow['source'],
    limitation: string,
    values: unknown[],
    formatter: (property: CustomerControlledComparisonPropertyInput) => string,
    derived = false,
    href = false,
  ): CustomerControlledComparisonRow => ({
    key,
    label,
    source,
    limitation,
    cells: buildCells(properties, formatter, evidenceFor(values, derived), href),
  });

  return [
    row('identity', 'Property page', 'Public listing facts', 'Address links are identity only, not a preference signal.', properties.map((property) => property.address), (property) => property.address, false, true),
    row('location', 'City / State', 'Public listing facts', 'Location identity does not establish neighborhood quality, safety, schools, or suitability.', properties.map((property) => property.city || property.state), (property) => `${formatText(property.city)}, ${formatText(property.state)}`),
    row('listedPrice', 'Listed price', 'Public listing facts', 'Listed price is not a valuation, appraisal, offer, or negotiation instruction.', properties.map((property) => property.price), (property) => formatCurrency(property.price)),
    row('beds', 'Beds', 'Public listing facts', 'Room counts should be confirmed from the current source before relying on them.', properties.map((property) => property.beds), (property) => formatNumber(property.beds)),
    row('baths', 'Baths', 'Public listing facts', 'Bathroom counts should be confirmed from the current source before relying on them.', properties.map((property) => property.baths), (property) => formatNumber(property.baths)),
    row('sqft', 'Square feet', 'Public listing facts', 'Square footage can vary by source and measurement treatment; verify before relying.', properties.map((property) => property.sqft), (property) => formatNumber(property.sqft, ' sq ft')),
    row('lotSize', 'Lot size', 'Public listing facts', 'Lot size needs source confirmation before it controls a decision.', properties.map((property) => property.lotSize), (property) => formatLotSize(property.lotSize)),
    row('yearBuilt', 'Year built', 'Public listing facts', 'Construction era can frame questions, but does not establish condition.', properties.map((property) => property.yearBuilt), (property) => formatNumber(property.yearBuilt)),
    row('propertyType', 'Property type', 'Public listing facts', 'Property type should be verified with current listing and governing documents where applicable.', properties.map((property) => property.propertyType), (property) => formatText(property.propertyType)),
    row('status', 'Listing status', 'Public listing facts', 'Status can change; confirm availability before touring or pursuing a property.', properties.map((property) => property.status), (property) => formatText(property.status)),
    row('pricePerSquareFoot', 'Calculated price / sq ft', 'Public listing facts + labelled arithmetic', 'Calculated arithmetic uses listed price and square footage only; it is not valuation or appraisal evidence.', properties.map(pricePerSquareFoot), (property) => {
      const value = pricePerSquareFoot(property);
      return value === null ? 'Not provided / Verification required' : `${formatCurrency(value)} / sq ft`;
    }, true),
    row('freshness', 'Freshness', 'Existing listing timestamp', 'Freshness identifies the stored listing timestamp available here; verify current facts before relying.', properties.map((property) => property.lastIntelligenceSync || property.updatedAt), (property) => formatDate(property.lastIntelligenceSync || property.updatedAt)),
  ];
}

function buildSourceTransparency(properties: CustomerControlledComparisonPropertyInput[]): CustomerControlledComparisonSourceTransparencyItem[] {
  const freshnessValues = properties.map((property) => formatDate(property.lastIntelligenceSync || property.updatedAt)).join(' / ');

  return [
    {
      label: 'Source',
      value: 'Public listing facts + labelled arithmetic',
      detail: 'This workspace uses customer-selected public Property ids and existing listing fields only.',
    },
    {
      label: 'Period / Freshness',
      value: freshnessValues || 'Unavailable / Verification required',
      detail: 'Freshness is shown per property from lastIntelligenceSync when available, otherwise updatedAt, otherwise unavailable.',
    },
    {
      label: 'Limitation',
      value: 'Listing facts do not establish stronger property conclusions',
      detail: 'Displayed facts do not determine condition, title, taxes, permits, zoning, insurance, HOA obligations, value, financing, offer terms, or property quality.',
    },
    {
      label: 'Verify',
      value: 'Public Property pages, Sources, Property Inquiry, and Advisory',
      detail: 'Open the source methodology, inspect each Property page, or ask a focused question before relying on an unresolved point.',
      href: '/sources',
    },
  ];
}

export function buildCustomerControlledComparisonWorkspace({
  selection,
  properties,
}: {
  selection: CustomerControlledComparisonParseResult;
  properties: CustomerControlledComparisonPropertyInput[];
}): CustomerControlledComparisonWorkspace {
  const availableIds = new Set(properties.map((property) => property.id));
  const unavailableNotices = selection.acceptedIds
    .filter((id) => !availableIds.has(id))
    .map((id) => ({
      id,
      reason: 'unavailable' as const,
      message: `The selected property was unavailable and was omitted: ${id}`,
    }));
  const canCompare = properties.length >= CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MIN_SELECTIONS && properties.length <= CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS;

  return {
    status: CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_STATUS,
    route: CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_ROUTE,
    selection: {
      ...selection,
      notices: [...selection.notices, ...unavailableNotices],
      canCompare,
    },
    properties,
    canCompare,
    rows: canCompare ? buildRows(properties) : [],
    sourceTransparency: canCompare ? buildSourceTransparency(properties) : [],
    trustBoundaries: [
      'MORE AVAILABLE DATA does not mean a better property',
      'SOURCE AVAILABILITY does not equal PROPERTY QUALITY',
      'MISSING DATA does not equal NEGATIVE PROPERTY CONDITION',
    ],
    protectedBoundaries: {
      ranking: false,
      scoring: false,
      recommendation: false,
      suitability: false,
      valuation: false,
      offerGuidance: false,
      financingAdvice: false,
      legalAdvice: false,
      taxAdvice: false,
      apiChange: false,
      schemaChange: false,
      providerActivation: false,
      persistence: false,
      telemetry: false,
    },
  };
}
