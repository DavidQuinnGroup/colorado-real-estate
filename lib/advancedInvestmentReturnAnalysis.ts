import { createHash } from 'node:crypto';

export const ADVANCED_INVESTMENT_RETURN_CALCULATION_V2 = 'ADVANCED_INVESTMENT_RETURN_CALCULATION_V2' as const;
export const ADVANCED_INVESTMENT_RETURN_POLICY_V2 = 'ADVANCED_INVESTMENT_RETURN_POLICY_V2' as const;

export type AdvancedReturnDisposition = 'HOLD_THROUGH_HORIZON' | 'SELL_AT_HORIZON';
export type AdvancedReturnPropertyRole = 'INVESTMENT_PROPERTY' | 'NEW_PRIMARY' | 'RETAINED_RENTAL';
export type AdvancedReturnPropertyInput = Readonly<{
  role: AdvancedReturnPropertyRole;
  label: string;
  canonicalPropertyId: string | null;
  startingValueCents: number;
  startingLoanBalanceCents: number;
  initialCashInvestedCents: number;
  monthlyRentCents: number;
  vacancyBasisPoints: number;
  managementBasisPoints: number;
  monthlyTaxesCents: number;
  monthlyInsuranceCents: number;
  monthlyHoaCents: number;
  monthlyMaintenanceCents: number;
  monthlyCapexReserveCents: number;
  annualRateBasisPoints: number;
  remainingLoanTermMonths: number;
  monthlyMortgageInsuranceCents: number;
  monthlyDebtPaymentCents: number | null;
  debtModel: 'EXACT_FIXED_RATE' | 'PAYMENT_ONLY_NON_AMORTIZING';
  qualification: string;
}>;
export type AdvancedReturnRequest = Readonly<{
  analysisKey: string;
  analysisTitle: string;
  analysisPurpose: string;
  projectionKey: string;
  analysisProfile: 'SINGLE_INVESTMENT_HOLDING_PERIOD' | 'MULTI_DIMENSIONAL_STRATEGY_HOLDING_PERIOD';
  sourceKind: 'INVESTMENT_SCENARIO' | 'STRATEGY_ALTERNATIVE';
  sourceArtifactId: string;
  sourceResultId: string;
  sourceInputFingerprint: string;
  properties: readonly AdvancedReturnPropertyInput[];
  horizonMonths: readonly number[];
  appreciationBasisPoints: number;
  rentGrowthBasisPoints: number;
  expenseGrowthBasisPoints: number;
  disposition: AdvancedReturnDisposition;
  dispositionCostBasisPoints: number;
  discountRateBasisPoints: number | null;
  supersedesProjectionId: string | null;
  review: boolean;
}>;

export class AdvancedReturnError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'IRR_UNAVAILABLE', message: string) { super(message); }
}

type RecordValue = Record<string, unknown>;
const isRecord = (value: unknown): value is RecordValue => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const whole = (value: unknown, field: string) => { if (!Number.isInteger(value) || Number(value) < 0 || Number(value) > 100_000_000_000) throw new AdvancedReturnError('INVALID_REQUEST', `${field} must be non-negative integer cents.`); return Number(value); };
const rate = (value: unknown, field: string, min = -100_000) => { if (!Number.isInteger(value) || Number(value) < min || Number(value) > 100_000) throw new AdvancedReturnError('INVALID_REQUEST', `${field} is invalid.`); return Number(value); };
const label = (value: unknown, field: string, maximum = 160) => { if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new AdvancedReturnError('INVALID_REQUEST', `${field} is invalid.`); return value.trim(); };
const rounded = (value: number) => Math.round(value);
const stable = (value: unknown): string => Array.isArray(value) ? `[${value.map(stable).join(',')}]` : isRecord(value) ? `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}` : JSON.stringify(value);
export const advancedReturnFingerprint = (value: unknown) => createHash('sha256').update(stable(value)).digest('hex');

function parseProperty(value: unknown): AdvancedReturnPropertyInput {
  if (!isRecord(value)) throw new AdvancedReturnError('INVALID_REQUEST', 'Property input is malformed.');
  const role = label(value.role, 'role', 80) as AdvancedReturnPropertyRole;
  if (!['INVESTMENT_PROPERTY', 'NEW_PRIMARY', 'RETAINED_RENTAL'].includes(role)) throw new AdvancedReturnError('INVALID_REQUEST', 'Property role is unsupported.');
  const startingValueCents = whole(value.startingValueCents, 'startingValueCents');
  const startingLoanBalanceCents = whole(value.startingLoanBalanceCents, 'startingLoanBalanceCents');
  const term = Number.isInteger(value.remainingLoanTermMonths) && Number(value.remainingLoanTermMonths) > 0 && Number(value.remainingLoanTermMonths) <= 480 ? Number(value.remainingLoanTermMonths) : 360;
  const debtModel = value.debtModel ?? 'EXACT_FIXED_RATE';
  if (debtModel !== 'EXACT_FIXED_RATE' && debtModel !== 'PAYMENT_ONLY_NON_AMORTIZING') throw new AdvancedReturnError('INVALID_REQUEST', 'debtModel is unsupported.');
  const monthlyDebtPaymentCents = value.monthlyDebtPaymentCents === null || value.monthlyDebtPaymentCents === undefined ? null : whole(value.monthlyDebtPaymentCents, 'monthlyDebtPaymentCents');
  if (debtModel === 'PAYMENT_ONLY_NON_AMORTIZING' && monthlyDebtPaymentCents === null) throw new AdvancedReturnError('INVALID_REQUEST', 'payment-only debt requires monthlyDebtPaymentCents.');
  return Object.freeze({ role, label: label(value.label, 'label'), canonicalPropertyId: typeof value.canonicalPropertyId === 'string' ? label(value.canonicalPropertyId, 'canonicalPropertyId') : null, startingValueCents, startingLoanBalanceCents, initialCashInvestedCents: whole(value.initialCashInvestedCents, 'initialCashInvestedCents'), monthlyRentCents: whole(value.monthlyRentCents ?? 0, 'monthlyRentCents'), vacancyBasisPoints: rate(value.vacancyBasisPoints ?? 0, 'vacancyBasisPoints', 0), managementBasisPoints: rate(value.managementBasisPoints ?? 0, 'managementBasisPoints', 0), monthlyTaxesCents: whole(value.monthlyTaxesCents ?? 0, 'monthlyTaxesCents'), monthlyInsuranceCents: whole(value.monthlyInsuranceCents ?? 0, 'monthlyInsuranceCents'), monthlyHoaCents: whole(value.monthlyHoaCents ?? 0, 'monthlyHoaCents'), monthlyMaintenanceCents: whole(value.monthlyMaintenanceCents ?? 0, 'monthlyMaintenanceCents'), monthlyCapexReserveCents: whole(value.monthlyCapexReserveCents ?? 0, 'monthlyCapexReserveCents'), annualRateBasisPoints: rate(value.annualRateBasisPoints ?? 0, 'annualRateBasisPoints', 0), remainingLoanTermMonths: term, monthlyMortgageInsuranceCents: whole(value.monthlyMortgageInsuranceCents ?? 0, 'monthlyMortgageInsuranceCents'), monthlyDebtPaymentCents, debtModel, qualification: label(value.qualification, 'qualification', 80) });
}

export function validateAdvancedReturnRequest(raw: unknown): AdvancedReturnRequest {
  if (!isRecord(raw) || !Array.isArray(raw.properties) || !raw.properties.length || raw.properties.length > 3 || !Array.isArray(raw.horizonMonths)) throw new AdvancedReturnError('INVALID_REQUEST', 'Advanced return request is malformed.');
  const analysisProfile = label(raw.analysisProfile, 'analysisProfile', 80) as AdvancedReturnRequest['analysisProfile'];
  const sourceKind = label(raw.sourceKind, 'sourceKind', 80) as AdvancedReturnRequest['sourceKind'];
  const disposition = label(raw.disposition, 'disposition', 80) as AdvancedReturnDisposition;
  if (!['SINGLE_INVESTMENT_HOLDING_PERIOD', 'MULTI_DIMENSIONAL_STRATEGY_HOLDING_PERIOD'].includes(analysisProfile) || !['INVESTMENT_SCENARIO', 'STRATEGY_ALTERNATIVE'].includes(sourceKind) || !['HOLD_THROUGH_HORIZON', 'SELL_AT_HORIZON'].includes(disposition)) throw new AdvancedReturnError('INVALID_REQUEST', 'Projection profile is unsupported.');
  const horizonMonths = [...new Set(raw.horizonMonths.map((value) => Number(value)))].sort((left, right) => left - right);
  if (!horizonMonths.length || horizonMonths.some((value) => !Number.isInteger(value) || value < 1 || value > 360)) throw new AdvancedReturnError('INVALID_REQUEST', 'Projection horizons must be between one and 360 months.');
  const properties = raw.properties.map(parseProperty);
  if (new Set(properties.map((property) => property.canonicalPropertyId).filter(Boolean)).size !== properties.filter((property) => property.canonicalPropertyId).length) throw new AdvancedReturnError('INVALID_REQUEST', 'A physical property cannot appear twice in one projection.');
  if (analysisProfile === 'SINGLE_INVESTMENT_HOLDING_PERIOD' && (properties.length !== 1 || properties[0].role !== 'INVESTMENT_PROPERTY')) throw new AdvancedReturnError('INVALID_REQUEST', 'Single-investment projections require exactly one investment property.');
  return Object.freeze({ analysisKey: label(raw.analysisKey, 'analysisKey'), analysisTitle: label(raw.analysisTitle, 'analysisTitle'), analysisPurpose: label(raw.analysisPurpose, 'analysisPurpose', 240), projectionKey: label(raw.projectionKey, 'projectionKey'), analysisProfile, sourceKind, sourceArtifactId: label(raw.sourceArtifactId, 'sourceArtifactId'), sourceResultId: label(raw.sourceResultId, 'sourceResultId'), sourceInputFingerprint: label(raw.sourceInputFingerprint, 'sourceInputFingerprint'), properties, horizonMonths, appreciationBasisPoints: rate(raw.appreciationBasisPoints, 'appreciationBasisPoints'), rentGrowthBasisPoints: rate(raw.rentGrowthBasisPoints, 'rentGrowthBasisPoints'), expenseGrowthBasisPoints: rate(raw.expenseGrowthBasisPoints, 'expenseGrowthBasisPoints'), disposition, dispositionCostBasisPoints: rate(raw.dispositionCostBasisPoints, 'dispositionCostBasisPoints', 0), discountRateBasisPoints: raw.discountRateBasisPoints === null || raw.discountRateBasisPoints === undefined ? null : rate(raw.discountRateBasisPoints, 'discountRateBasisPoints', 0), supersedesProjectionId: typeof raw.supersedesProjectionId === 'string' ? label(raw.supersedesProjectionId, 'supersedesProjectionId') : null, review: raw.review === true });
}

function payment(balance: number, annualRateBasisPoints: number, termMonths: number) { if (!balance) return 0; if (!annualRateBasisPoints) return rounded(balance / termMonths); const monthlyRate = annualRateBasisPoints / 1_200_000; const factor = (1 + monthlyRate) ** termMonths; return rounded(balance * monthlyRate * factor / (factor - 1)); }
function npv(cashFlows: number[], annualBasisPoints: number | null) { if (annualBasisPoints === null) return { valueCents: null, status: 'NPV_NOT_CALCULATED' as const }; const monthlyRate = annualBasisPoints / 1_200_000; return { valueCents: rounded(cashFlows.reduce((total, cashFlow, month) => total + cashFlow / ((1 + monthlyRate) ** month), 0)), status: 'NPV_CALCULATED' as const }; }
function irr(cashFlows: number[]) {
  if (!cashFlows.some((value) => value < 0) || !cashFlows.some((value) => value > 0)) return { annualBasisPoints: null, monthlyRate: null, rootResidualCents: null, status: 'IRR_UNAVAILABLE_NON_CONVENTIONAL' as const };
  const f = (rateValue: number) => cashFlows.reduce((total, cashFlow, month) => total + cashFlow / ((1 + rateValue) ** month), 0);
  const sampleCount = 1_200;
  const lowerBound = -0.9999;
  const upperBound = 10;
  const intervals: Array<readonly [number, number]> = [];
  let previousRate = lowerBound;
  let previousValue = f(previousRate);
  for (let sample = 1; sample <= sampleCount; sample += 1) {
    const currentRate = lowerBound + ((upperBound - lowerBound) * sample / sampleCount);
    const currentValue = f(currentRate);
    if (previousValue === 0 || currentValue === 0 || previousValue * currentValue < 0) intervals.push([previousRate, currentRate]);
    previousRate = currentRate;
    previousValue = currentValue;
  }
  if (!intervals.length) return { annualBasisPoints: null, monthlyRate: null, rootResidualCents: null, status: 'IRR_UNAVAILABLE_NO_ROOT' as const };
  if (intervals.length > 1) return { annualBasisPoints: null, monthlyRate: null, rootResidualCents: null, status: 'IRR_UNAVAILABLE_AMBIGUOUS' as const };
  let [low, high] = intervals[0];
  for (let iteration = 0; iteration < 120; iteration += 1) {
    const middle = (low + high) / 2;
    if (f(low) * f(middle) <= 0) high = middle;
    else low = middle;
  }
  const monthlyRate = (low + high) / 2;
  return { annualBasisPoints: rounded((((1 + monthlyRate) ** 12) - 1) * 10_000), monthlyRate, rootResidualCents: f(monthlyRate), status: 'IRR_CALCULATED' as const };
}

export function calculateAdvancedReturn(input: AdvancedReturnRequest) {
  const maxMonth = input.horizonMonths.at(-1)!;
  const propertyRows = input.properties.map((property) => {
    const monthlyPayment = payment(property.startingLoanBalanceCents, property.annualRateBasisPoints, property.remainingLoanTermMonths); let balance = property.startingLoanBalanceCents; let cumulativePrincipalCents = 0; let cumulativeInterestCents = 0; let cumulativeCashFlowCents = 0; const periods: RecordValue[] = [{ month: 0, debtModel: property.debtModel, modeledValueCents: property.startingValueCents, loanBalanceCents: balance, cumulativePrincipalCents, cumulativeInterestCents, cumulativeCashFlowCents, modeledGrossEquityCents: property.startingValueCents - balance }];
    for (let month = 1; month <= maxMonth; month += 1) { const appreciation = (1 + input.appreciationBasisPoints / 10_000) ** (month / 12); const rentGrowth = (1 + input.rentGrowthBasisPoints / 10_000) ** (month / 12); const expenseGrowth = (1 + input.expenseGrowthBasisPoints / 10_000) ** (month / 12); const modeledValueCents = rounded(property.startingValueCents * appreciation); const grossRentCents = rounded(property.monthlyRentCents * rentGrowth); const vacancyCents = rounded(grossRentCents * property.vacancyBasisPoints / 10_000); const effectiveRentCents = grossRentCents - vacancyCents; const managementCents = rounded(effectiveRentCents * property.managementBasisPoints / 10_000); const fixedExpensesCents = rounded((property.monthlyTaxesCents + property.monthlyInsuranceCents + property.monthlyHoaCents + property.monthlyMaintenanceCents + property.monthlyCapexReserveCents) * expenseGrowth); const operatingExpensesCents = fixedExpensesCents + managementCents; const interestCents = !balance ? 0 : property.debtModel === 'PAYMENT_ONLY_NON_AMORTIZING' ? property.monthlyDebtPaymentCents! : rounded(balance * property.annualRateBasisPoints / 1_200_000); const principalCents = balance && property.debtModel === 'EXACT_FIXED_RATE' ? Math.min(balance, Math.max(0, monthlyPayment - interestCents)) : 0; balance -= principalCents; const debtServiceCents = property.debtModel === 'PAYMENT_ONLY_NON_AMORTIZING' ? (balance ? property.monthlyDebtPaymentCents! : 0) : principalCents + interestCents + (balance || principalCents ? property.monthlyMortgageInsuranceCents : 0); const noiCents = effectiveRentCents - operatingExpensesCents; const preTaxCashFlowCents = property.role === 'NEW_PRIMARY' ? -debtServiceCents - fixedExpensesCents : noiCents - debtServiceCents; cumulativePrincipalCents += principalCents; cumulativeInterestCents += interestCents; cumulativeCashFlowCents += preTaxCashFlowCents; periods.push({ month, debtModel: property.debtModel, modeledValueCents, loanBalanceCents: balance, principalCents, interestCents, cumulativePrincipalCents, cumulativeInterestCents, grossRentCents, vacancyCents, effectiveRentCents, managementCents, fixedExpensesCents, operatingExpensesCents, noiCents, debtServiceCents, preTaxCashFlowCents, cumulativeCashFlowCents, modeledGrossEquityCents: modeledValueCents - balance }); }
    return { property, periods };
  });
  const horizons = input.horizonMonths.map((month) => { const rows = propertyRows.map(({ property, periods }) => ({ property, period: periods[month] as RecordValue })); const operatingCashFlowCents = rows.reduce((total, row) => total + Number(row.period.preTaxCashFlowCents ?? 0), 0); const cumulativeCashFlowCents = rows.reduce((total, row) => total + Number(row.period.cumulativeCashFlowCents ?? 0), 0); const modeledGrossEquityCents = rows.reduce((total, row) => total + Number(row.period.modeledGrossEquityCents), 0); const debtCents = rows.reduce((total, row) => total + Number(row.period.loanBalanceCents), 0); const dispositionProceedsCents = input.disposition === 'SELL_AT_HORIZON' ? rows.reduce((total, row) => total + (row.property.role === 'NEW_PRIMARY' ? 0 : rounded(Number(row.period.modeledValueCents) * (10_000 - input.dispositionCostBasisPoints) / 10_000) - Number(row.period.loanBalanceCents)), 0) : null; const initialCashInvestedCents = input.properties.reduce((total, property) => total + property.initialCashInvestedCents, 0); const cashFlows = [-initialCashInvestedCents, ...Array.from({ length: month }, (_, index) => propertyRows.reduce((total, row) => total + Number((row.periods[index + 1] as RecordValue).preTaxCashFlowCents ?? 0), 0))]; if (dispositionProceedsCents !== null) cashFlows[cashFlows.length - 1] += dispositionProceedsCents; const cashFlowIncludingDispositionCents = cashFlows.reduce((total, value) => total + value, 0); const singleInvestment = input.properties.length === 1 && input.properties[0].role === 'INVESTMENT_PROPERTY'; const ir = input.disposition === 'SELL_AT_HORIZON' ? irr(cashFlows) : { annualBasisPoints: null, monthlyRate: null, rootResidualCents: null, status: 'IRR_NOT_CALCULATED_HOLD' as const }; const netPresentValue = npv(cashFlows, input.discountRateBasisPoints); const recoveryIndex = input.disposition === 'SELL_AT_HORIZON' ? cashFlows.reduce<number | null>((found, value, index) => found !== null ? found : cashFlows.slice(0, index + 1).reduce((sum, item) => sum + item, 0) >= 0 ? index : null, null) : null; return Object.freeze({ month, endOfYear: month / 12, operatingCashFlowCents, cumulativeCashFlowCents, modeledGrossEquityCents, holdThroughHorizonEquityCents: input.disposition === 'HOLD_THROUGH_HORIZON' ? modeledGrossEquityCents : null, totalModeledPropertyDebtCents: debtCents, dispositionProceedsCents, initialCashInvestedCents, cashFlowSeriesCents: cashFlows, totalModeledPreTaxProfitLossCents: cashFlowIncludingDispositionCents, totalModeledPreTaxReturnBasisPoints: initialCashInvestedCents ? rounded(cashFlowIncludingDispositionCents * 10_000 / initialCashInvestedCents) : null, propertyLevelIrrAnnualBasisPoints: singleInvestment ? ir.annualBasisPoints : null, propertyLevelIrrMonthlyRate: singleInvestment ? ir.monthlyRate : null, propertyLevelIrrRootResidualCents: singleInvestment ? ir.rootResidualCents : null, irrStatus: singleInvestment ? ir.status : 'IRR_NOT_APPLICABLE_TO_STRATEGY', propertyLevelNpvCents: singleInvestment ? netPresentValue.valueCents : null, npvStatus: singleInvestment ? netPresentValue.status : 'NPV_NOT_APPLICABLE_TO_STRATEGY', capitalRecoveryMonth: recoveryIndex, capitalRecoveryStatus: input.disposition !== 'SELL_AT_HORIZON' ? 'CAPITAL_RECOVERY_NOT_CALCULATED_HOLD' : recoveryIndex === null ? 'NOT_REACHED_WITHIN_HORIZON' : 'MODELED_PRE_TAX_EXIT_CAPITAL_RECOVERY', propertyPeriods: rows.map((row) => ({ role: row.property.role, label: row.property.label, ...row.period })) }); });
  return Object.freeze({ calculationVersion: ADVANCED_INVESTMENT_RETURN_CALCULATION_V2, projectionPolicy: ADVANCED_INVESTMENT_RETURN_POLICY_V2, qualifier: 'MODELED_ESTIMATE', taxTreatment: 'PRE_TAX_ONLY', monthlyPropertySeries: propertyRows.map(({ property, periods }) => ({ role: property.role, label: property.label, canonicalPropertyId: property.canonicalPropertyId, periods })), horizons, limitations: ['Modeled pre-tax decision support only; not tax, legal, appraisal, underwriting, or a guarantee.', 'No automatic strategy recommendation, client delivery, provider action, or financing event is available.'] });
}
