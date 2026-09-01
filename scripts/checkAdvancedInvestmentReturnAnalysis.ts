import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { calculateAdvancedReturn, validateAdvancedReturnRequest } from '../lib/advancedInvestmentReturnAnalysis';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const root = resolve(import.meta.dirname, '..');
const raw = (overrides: Record<string, unknown> = {}) => ({
  analysisKey: 'check', analysisTitle: 'check', analysisPurpose: 'check', projectionKey: 'check', analysisProfile: 'SINGLE_INVESTMENT_HOLDING_PERIOD', sourceKind: 'INVESTMENT_SCENARIO', sourceArtifactId: 'scenario', sourceResultId: 'result', sourceInputFingerprint: 'fingerprint', horizonMonths: [12, 36, 60, 84, 120, 121], appreciationBasisPoints: 300, rentGrowthBasisPoints: 200, expenseGrowthBasisPoints: 250, disposition: 'SELL_AT_HORIZON', dispositionCostBasisPoints: 600, discountRateBasisPoints: 800, supersedesProjectionId: null, review: false,
  properties: [{ role: 'INVESTMENT_PROPERTY', label: 'Investment', canonicalPropertyId: null, startingValueCents: 40_000_000, startingLoanBalanceCents: 32_000_000, initialCashInvestedCents: 8_700_000, monthlyRentCents: 320_000, vacancyBasisPoints: 500, managementBasisPoints: 800, monthlyTaxesCents: 40_000, monthlyInsuranceCents: 16_000, monthlyHoaCents: 15_000, monthlyMaintenanceCents: 15_000, monthlyCapexReserveCents: 12_000, annualRateBasisPoints: 675, remainingLoanTermMonths: 360, monthlyMortgageInsuranceCents: 0, monthlyDebtPaymentCents: null, debtModel: 'EXACT_FIXED_RATE', qualification: 'SYNTHETIC_CERTIFICATION' }],
  ...overrides,
});
const base = calculateAdvancedReturn(validateAdvancedReturnRequest(raw()));
assert(base.horizons.map((horizon) => horizon.month).join(',') === '12,36,60,84,120,121', 'Standard and bounded custom horizons must be preserved.');
const first = base.monthlyPropertySeries[0].periods[1] as Record<string, number>;
assert(first.principalCents + first.interestCents === first.debtServiceCents, 'Fixed-rate monthly debt service must reconcile to principal plus interest.');
assert(first.loanBalanceCents === 32_000_000 - first.principalCents, 'Loan balance must reduce only by principal.');
assert(first.managementCents === Math.round(first.effectiveRentCents * 800 / 10_000), 'Management expense must depend on effective rent exactly once.');
const zeroRate = calculateAdvancedReturn(validateAdvancedReturnRequest(raw({ properties: [{ ...(raw().properties as Record<string, unknown>[])[0], annualRateBasisPoints: 0 }] })));
const zeroFirst = zeroRate.monthlyPropertySeries[0].periods[1] as Record<string, number>;
assert(zeroFirst.interestCents === 0 && zeroFirst.principalCents > 0, 'Zero-interest loans must amortize without interest.');
const negativeValue = calculateAdvancedReturn(validateAdvancedReturnRequest(raw({ appreciationBasisPoints: -500 })));
assert(Number((negativeValue.horizons[4].propertyPeriods[0] as unknown as Record<string, number>).modeledValueCents) < Number((base.horizons[4].propertyPeriods[0] as unknown as Record<string, number>).modeledValueCents), 'Negative appreciation must reduce modeled value relative to base.');
const zeroValue = calculateAdvancedReturn(validateAdvancedReturnRequest(raw({ appreciationBasisPoints: 0 })));
assert(Number((zeroValue.horizons[4].propertyPeriods[0] as unknown as Record<string, number>).modeledValueCents) === 40_000_000, 'Zero appreciation must preserve starting modeled value.');
const hold = calculateAdvancedReturn(validateAdvancedReturnRequest(raw({ disposition: 'HOLD_THROUGH_HORIZON' })));
assert(hold.horizons.every((horizon) => horizon.dispositionProceedsCents === null && horizon.capitalRecoveryStatus === 'CAPITAL_RECOVERY_NOT_CALCULATED_HOLD'), 'HOLD must not fabricate disposition proceeds or exit recovery.');
const sold = base.horizons[4];
assert(sold.dispositionProceedsCents !== null && sold.dispositionProceedsCents === Math.round(Number((sold.propertyPeriods[0] as unknown as Record<string, number>).modeledValueCents) * 0.94) - Number((sold.propertyPeriods[0] as unknown as Record<string, number>).loanBalanceCents), 'SELL disposition must reconcile value, explicit costs, and payoff.');
assert(sold.propertyLevelNpvCents !== null && sold.irrStatus === 'IRR_CALCULATED', 'A conventional sold investment must calculate property-level IRR and NPV.');
const cashFlows = sold.cashFlowSeriesCents;
const monthlyRate = Number(sold.propertyLevelIrrMonthlyRate);
const residual = cashFlows.reduce((sum, cashFlow, month) => sum + cashFlow / ((1 + monthlyRate) ** month), 0);
assert(Math.abs(residual) < 1 && Math.abs(Number(sold.propertyLevelIrrRootResidualCents)) < 1, `Reported IRR root must solve the modeled monthly cash-flow series (external=${residual}, engine=${sold.propertyLevelIrrRootResidualCents}).`);
const zeroDiscount = calculateAdvancedReturn(validateAdvancedReturnRequest(raw({ discountRateBasisPoints: 0 }))).horizons[4];
assert(zeroDiscount.propertyLevelNpvCents === zeroDiscount.totalModeledPreTaxProfitLossCents, 'Zero-percent NPV must reconcile to the modeled cash-flow sum.');
const highExpense = calculateAdvancedReturn(validateAdvancedReturnRequest(raw({ expenseGrowthBasisPoints: 600 })));
assert(Number(highExpense.horizons[4].cumulativeCashFlowCents) < Number(base.horizons[4].cumulativeCashFlowCents), 'Higher expense growth must worsen cumulative cash flow.');
const highRent = calculateAdvancedReturn(validateAdvancedReturnRequest(raw({ rentGrowthBasisPoints: 500 })));
assert(Number(highRent.horizons[4].cumulativeCashFlowCents) > Number(base.horizons[4].cumulativeCashFlowCents), 'Higher rent growth must improve cumulative cash flow.');
const paymentOnly = calculateAdvancedReturn(validateAdvancedReturnRequest(raw({ analysisProfile: 'MULTI_DIMENSIONAL_STRATEGY_HOLDING_PERIOD', sourceKind: 'STRATEGY_ALTERNATIVE', properties: [{ ...(raw().properties as Record<string, unknown>[])[0], role: 'RETAINED_RENTAL', canonicalPropertyId: 'property', debtModel: 'PAYMENT_ONLY_NON_AMORTIZING', monthlyDebtPaymentCents: 210_000 }] })));
assert(Number(paymentOnly.monthlyPropertySeries[0].periods[60].loanBalanceCents) === 32_000_000, 'Payment-only retained debt must remain explicit rather than inventing an amortization schedule.');
const [schema, migration, route, output, workspace, auth] = await Promise.all(['prisma/schema.prisma', 'prisma/migrations/20260902000000_add_advanced_investment_return_analysis_v2/migration.sql', 'app/api/agent/advanced-investment-return/route.ts', 'lib/advancedInvestmentReturnOutputPersistence.ts', 'components/agent/AdvancedInvestmentReturnWorkspace.tsx', 'lib/admin/adminAuth.ts'].map((path) => readFile(resolve(root, path), 'utf8')));
for (const token of ['model AdvancedInvestmentReturnAnalysis', 'model AdvancedInvestmentReturnProjection', 'model AdvancedInvestmentReturnProjectionResult', 'model AdvancedInvestmentReturnDependency', 'model AdvancedInvestmentReturnAuditEvent']) assert(schema.includes(token), `Schema lacks ${token}.`);
for (const token of ['AdvancedInvestmentReturnProjectionResult_append_only', 'AdvancedInvestmentReturnProjection_reviewed_immutable']) assert(migration.includes(token), `Migration lacks immutable protection ${token}.`);
for (const token of ['CREATE_SYNTHETIC_BASE', 'CREATE_SYNTHETIC_STRATEGY', 'CLONE_PROJECTION', 'UPDATE_ASSUMPTIONS', 'RECALCULATE', 'REVIEW', 'SENSITIVITY', 'PERSIST_OUTPUT', 'isSameOriginAdminRequest']) assert(route.includes(token), `Agent route lacks ${token}.`);
assert(output.includes('persistReviewedFixture') === false && output.includes('ADVANCED_INVESTMENT_RETURN_ANALYSIS_V2'), 'V2 output fixture must target the shared OutputVersion service without duplicating persistence.');
for (const token of ['Create single investment', 'Create Strategy B', 'Create Strategy C', 'Downside', 'Persist output']) assert(workspace.includes(token), `Agent workspace lacks ${token}.`);
assert(auth.includes("'/agent/advanced-return'") && auth.includes("'/api/agent/advanced-investment-return'"), 'V2 Agent surfaces must be explicitly registered.');
console.log('ADVANCED_INVESTMENT_RETURN_ANALYSIS_V2_CHECK: PASS');
