export type ScenarioSummary = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  currentVersionId: string | null;
  currentVersion: { id: string; versionNumber: number; createdAt: string } | null;
  _count: { versions: number };
  createdAt: string;
  updatedAt: string;
};

export type ScenarioDefinitionEntry = { semanticKey: string; valueType: string; value: unknown };
export type ScenarioVersion = {
  id: string;
  versionNumber: number;
  createdAt: string;
  assumptions: ScenarioDefinitionEntry[];
  criteria: ScenarioDefinitionEntry[];
};

export type FinancialValue = {
  category: string | null;
  marketValueCents: number | null;
  liquidValueCents: number | null;
  availableAmountCents: number | null;
  currentBalanceCents: number | null;
  monthlyObligationCents: number | null;
  amountCents: number | null;
  maximumLoanAmountCents: number | null;
  maximumPurchaseAmountCents: number | null;
  rateBps: number | null;
  frequency: string | null;
  programLabel: string | null;
};

export type WorkingFact = {
  domain: string;
  entityId: string;
  label: string;
  category: string;
  participant: { id: string; label: string; role?: string } | null;
  property: { id: string; label: string } | null;
  currentObservation: {
    id: string;
    value: FinancialValue;
    sourcePosture: string;
    verificationState: string;
    observationKind: string;
    asOf: string;
    expiresAt: string | null;
    reviewAfter: string | null;
    freshness: string;
  } | null;
  selected: boolean;
  selectedObservationId: string | null;
  selectedAt: string | null;
  reviewedAt: string | null;
  reviewState: string;
  reviewRequired: boolean;
};

export type WorkingContext = {
  state: 'WORKING_CONTEXT' | 'EMPTY_SELECTION' | 'NO_FINANCIAL_POSITION';
  lifecycle: string;
  clientCase: { id: string; displayName: string };
  scenario: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    currentVersionId: string;
    currentVersion: { id: string; versionNumber: number; assumptions: ScenarioDefinitionEntry[] };
  };
  draft: { id: string; revision: number; selectionCount: number } | null;
  facts: WorkingFact[];
  reviewRequiredCount: number;
  freezeReview?: {
    expectedCurrentVersionId: string;
    expectedDraftRevision: number | null;
    captureState: string;
    canFreeze: boolean;
    reviewRequiredCount: number;
    assumptions: ScenarioDefinitionEntry[];
  };
};

export type FixedEntry = {
  domain: string;
  entityId: string;
  observationId: string;
  label: string | null;
  participantLabel: string | null;
  propertyLabel: string | null;
  source: { posture: string; verificationState: string };
  observationKind: string;
  limitation: string | null;
  asOf: string;
  expiresAt: string | null;
  reviewAfter: string | null;
  value: FinancialValue;
};

export type FixedContext = {
  state: 'CAPTURED' | 'EMPTY_SELECTION' | 'NO_FINANCIAL_POSITION' | 'LEGACY_NO_FINANCIAL_CONTEXT';
  scenarioVersion: { id: string; versionNumber: number };
  versionContext: {
    predecessor: { id: string; versionNumber: number } | null;
    fixed: { id: string; versionNumber: number };
    successor: { id: string; versionNumber: number } | null;
  };
  manifest: { id: string; capturedAt: string; schemaVersion: number } | null;
  entries: FixedEntry[];
};

export type Comparison = {
  state: 'COMPARISON_AVAILABLE' | 'LEGACY_NO_FINANCIAL_CONTEXT';
  checkedAt: string;
  differences: Array<{
    domain: string;
    entityId: string;
    fixedObservationId: string | null;
    currentObservationId: string | null;
    classification: string;
  }>;
};

export function humanizeScenarioValue(value: string) {
  return value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatFinancialValue(value: FinancialValue | undefined) {
  if (!value) return 'Current value unavailable';
  const money = [value.availableAmountCents, value.liquidValueCents, value.marketValueCents, value.currentBalanceCents, value.monthlyObligationCents, value.amountCents, value.maximumPurchaseAmountCents, value.maximumLoanAmountCents].find((entry) => typeof entry === 'number');
  if (typeof money === 'number') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(money / 100);
  if (typeof value.rateBps === 'number') return `${(value.rateBps / 100).toFixed(2)}%`;
  return value.programLabel || (value.category ? humanizeScenarioValue(value.category) : 'Recorded');
}
