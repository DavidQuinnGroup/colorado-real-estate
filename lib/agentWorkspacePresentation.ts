export const agentWorkspaceHierarchy = {
  page: 'text-3xl font-semibold leading-tight text-white sm:text-4xl',
  section: 'text-xl font-semibold leading-7 text-white sm:text-2xl sm:leading-8',
  subsection: 'text-base font-semibold leading-6 text-white sm:text-lg sm:leading-7',
  card: 'text-base font-semibold leading-6 text-white',
  field: 'text-xs font-medium leading-5 text-slate-300',
  supporting: 'text-sm leading-6 text-slate-400',
  technical: 'text-xs leading-5 text-slate-500',
} as const;

type CurrencyFormatOptions = Readonly<{ monthly?: boolean; maximumFractionDigits?: number }>;

export function formatAgentCurrencyFromCents(value: number | null | undefined, options: CurrencyFormatOptions = {}) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Not recorded';
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
  }).format(value / 100);
  return options.monthly ? `${formatted}/mo` : formatted;
}

export function formatAgentRateFromBasisPoints(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Not recorded';
  return `${(value / 100).toFixed(2)}%`;
}

export function formatAgentLoanTerm(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Not recorded';
  if (value > 0 && value % 12 === 0) {
    const years = value / 12;
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  return `${value} ${value === 1 ? 'month' : 'months'}`;
}

export function humanizeScenarioRole(role: string) {
  const labels: Record<string, string> = {
    CURRENT_HOME_SELL: 'Current home - Sell',
    CURRENT_HOME_RETAIN: 'Current home - Retain',
    REPLACEMENT_PRIMARY_ACQUIRE: 'Replacement primary - Buy',
    INVESTMENT_ACQUIRE: 'Investment property - Buy',
  };
  return labels[role] ?? humanizeStructuredIdentifier(role);
}

export function humanizeScenarioReferenceType(referenceType: string) {
  const labels: Record<string, string> = {
    HYPOTHETICAL: 'Hypothetical property',
    PROSPECTIVE: 'Prospective property',
    CANONICAL: 'Recorded property',
  };
  return labels[referenceType] ?? humanizeStructuredIdentifier(referenceType);
}

export function humanizeOutputReviewState(state: string) {
  const labels: Record<string, string> = {
    AGENT_REVIEW_REQUIRED: 'Agent review required',
    AGENT_REVIEWED: 'Agent reviewed',
    DRAFT: 'Draft',
    COMPOSED: 'Composed',
    INVALIDATED: 'Invalidated',
  };
  return labels[state] ?? humanizeStructuredIdentifier(state);
}

const scenarioMetricPresentation = {
  liquidityAfterPlannedSale: {
    label: 'Liquidity after planned sale',
    help: 'Estimated liquidity remaining after modeled acquisition cash, reserves, and planned sale proceeds are accounted for.',
  },
  cashRequiredBeforeSaleProceeds: {
    label: 'Cash required before sale proceeds',
    help: 'Estimated cash required before the modeled sale proceeds become available.',
  },
  modeledMonthlyPropertyCashFlowAfterSale: {
    label: 'Modeled monthly property cash flow after sale',
    help: 'Modeled monthly post-sale property cash flow for the replacement primary under the current assumptions.',
  },
  estimatedNetSaleProceeds: {
    label: 'Estimated net sale proceeds',
    help: 'Estimated sale value less modeled debt payoff and selling costs.',
  },
} as const;

export { scenarioMetricPresentation };

export function humanizeStrategyProfile(profile: string) {
  const labels: Record<string, string> = {
    SELL_EXISTING_BUY_PRIMARY: 'Sell current home and buy a primary residence',
    SELL_EXISTING_BUY_PRIMARY_AND_INVESTMENT: 'Sell current home and buy a primary residence with an investment property',
    KEEP_EXISTING_CONVERT_TO_RENTAL_AND_BUY_PRIMARY: 'Keep current home as a rental and buy a primary residence',
    KEEP_EXISTING_CONVERT_TO_RENTAL_AND_BUY_PRIMARY_AND_INVESTMENT: 'Keep current home as a rental and buy a primary residence with an investment property',
  };
  return labels[profile] ?? humanizeStructuredIdentifier(profile);
}

export function humanizeStrategyKeyFallback(value: string) {
  return humanizeStructuredIdentifier(value.replace(/^ATLAS_SYNTHETIC_/, ''));
}

export function humanizeStructuredIdentifier(value: string) {
  const normalized = value.trim().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
  if (!normalized) return 'Not recorded';
  return normalized.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}
