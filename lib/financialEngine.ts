/**
 * DQG Financial Synthesis Hub.
 * Merges lending logic, GC reserve planning, and life-ROI time-tax analysis.
 */

import {
  calculateCAPEXReserve,
  calculateConventionalPayment,
  calculateFHAPayment,
  type MortgageInput,
} from "./marketMetrics";

export type TCOLInput = MortgageInput & {
  homeAge: number;
  commuteTimeWeekly: number;
  hourlyRate: number;
  propertyTaxes: number;
  hoaFees: number;
};

export type TCOLResult = {
  hardCashOutflow: number;
  trueEconomicCost: number;
  timeTaxBreakdown: number;
  reserveAllocation: number;
};

export type LendingScenario = {
  totalMonthlyPI: number;
  note?: string;
  monthlyPMI?: number;
  monthlyMIP?: number;
  upfrontMIP?: number;
};

export type LendingMatrix = {
  conventional: LendingScenario;
  fha: LendingScenario;
  va: LendingScenario;
  jumbo: LendingScenario;
};

export type FinancialIntent =
  | "Steady Income"
  | "Legacy Preservation"
  | "Lifestyle Efficiency"
  | "Equity Growth"
  | string;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

function getFiniteNumber(value: number, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function formatCurrency(value: number) {
  return currencyFormatter.format(getFiniteNumber(value));
}

/**
 * Calculates the REIE total cost of living model: PITI, GC reserve, and time tax.
 */
export function calculateTCOL(input: TCOLInput): TCOLResult {
  const lending = calculateConventionalPayment(input);
  const capex = calculateCAPEXReserve(input.homeAge);
  const monthlyPITI = lending.totalMonthlyPI + input.propertyTaxes / 12 + input.hoaFees;
  const monthlyTimeTax = input.commuteTimeWeekly * 4 * input.hourlyRate;

  return {
    hardCashOutflow: monthlyPITI + capex,
    trueEconomicCost: monthlyPITI + capex + monthlyTimeTax,
    timeTaxBreakdown: monthlyTimeTax,
    reserveAllocation: capex,
  };
}

/**
 * Generates the lending comparison matrix used by the private strategy layer.
 */
export function generateLendingMatrix(
  price: number,
  downPayment: number,
  rate: number
): LendingMatrix {
  const baseInput: MortgageInput = {
    downPayment,
    interestRate: rate,
    price,
    termYears: 30,
  };
  const estimatedMonthlyPI = baseInput.price / 360;

  return {
    conventional: calculateConventionalPayment(baseInput),
    fha: calculateFHAPayment(baseInput),
    va: {
      totalMonthlyPI: estimatedMonthlyPI,
      note: "0% down modeling active",
    },
    jumbo: {
      totalMonthlyPI: estimatedMonthlyPI,
      note: "Luxury-tier modeling active",
    },
  };
}

/**
 * Converts financial data into private REIE narrative guidance.
 */
export function generateFinancialNarrative(tcol: TCOLResult, intent: FinancialIntent): string {
  if (intent === "Steady Income" || intent === "Legacy Preservation") {
    return `This property is a steady-income asset. While the hard cash outflow is ${formatCurrency(
      tcol.hardCashOutflow
    )}, the strategic reserve allocation of ${formatCurrency(
      tcol.reserveAllocation
    )} supports long-term capital protection for legacy goals.`;
  }

  if (tcol.timeTaxBreakdown > 2000) {
    return `Warning: high time-tax detected. The client is forfeiting ${formatCurrency(
      tcol.timeTaxBreakdown
    )} in monthly economic value to transit. Recommend refocusing on North Star high-efficiency zones.`;
  }

  if (intent === "Equity Growth") {
    return `Financial profile supports an equity-growth posture. True economic cost is ${formatCurrency(
      tcol.trueEconomicCost
    )}, with GC reserve requirements currently modeled at ${formatCurrency(tcol.reserveAllocation)}.`;
  }

  return "Financial profile aligns with primary North Star efficiency thresholds.";
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/financialEngine.ts
