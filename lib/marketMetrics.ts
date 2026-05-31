/**
 * DQG INTELLIGENCE ENGINE: ADVANCED LENDING & FINANCIAL METRICS
 * Implements Module 6.1 (Digital Loan Officer) and Module 6.2 (CAPEX).
 */

/**
 * 1. MARKET VELOCITY: ABSORPTION RATE (Module 9.2)
 * Measures months of inventory based on current sales velocity.
 */
export function calculateAbsorptionRate(inventory: number, monthlySales: number): string {
  if (!monthlySales || monthlySales === 0) return "0.0";
  return (inventory / monthlySales).toFixed(1);
}

/**
 * 2. LOAN TYPE LOGIC ENGINE (Module 6.1.1)
 * Calculates monthly P&I for various loan structures.
 */
export interface MortgageInput {
  price: number;
  downPayment: number;
  interestRate: number;
  termYears: number;
}

export function calculateBaseMonthlyPI(input: MortgageInput): number {
  const principal = input.price - input.downPayment;
  const monthlyRate = input.interestRate / 100 / 12;
  const numberOfPayments = input.termYears * 12;

  if (monthlyRate === 0) return principal / numberOfPayments;

  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
}

/**
 * FHA MODELING (Module 6.1.1 [403])
 * Includes 1.75% Upfront MIP and annual MIP calculations.
 */
export function calculateFHAPayment(input: MortgageInput) {
  const upfrontMIP = (input.price - input.downPayment) * 0.0175;
  const basePI = calculateBaseMonthlyPI({
    ...input,
    price: input.price + upfrontMIP // Upfront MIP is typically financed
  });

  // Annual MIP (Approx 0.55% for 3.5% down over 30 years)
  const monthlyMIP = ((input.price - input.downPayment) * 0.0055) / 12;

  return {
    totalMonthlyPI: basePI + monthlyMIP,
    upfrontMIP,
    monthlyMIP
  };
}

/**
 * CONVENTIONAL MODELING (Module 6.1.1 [404])
 * Includes PMI tiering for down payments under 20%.
 */
export function calculateConventionalPayment(input: MortgageInput) {
  const basePI = calculateBaseMonthlyPI(input);
  const downPercent = (input.downPayment / input.price) * 100;

  let monthlyPMI = 0;
  if (downPercent < 20) {
    // Simplified PMI logic: approx 0.7% annually for lower down payments
    monthlyPMI = (input.price * 0.007) / 12;
  }

  return {
    totalMonthlyPI: basePI + monthlyPMI,
    monthlyPMI
  };
}

/**
 * 3. AMORTIZATION VISUALIZER (Module 6.1.2 [410])
 * Generates the interest vs. principal breakdown and total interest paid.
 */
export function generateAmortizationSchedule(input: MortgageInput) {
  let balance = input.price - input.downPayment;
  const monthlyPI = calculateBaseMonthlyPI(input);
  const monthlyRate = input.interestRate / 100 / 12;
  const schedule = [];
  let totalInterest = 0;

  for (let i = 1; i <= input.termYears * 12; i++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPI - interest;
    balance -= principal;
    totalInterest += interest;

    if (i % 12 === 0 || i === 1) { // Log annual milestones for visualization
      schedule.push({
        month: i,
        year: i / 12,
        remainingBalance: Math.max(0, balance),
        totalInterestPaid: totalInterest
      });
    }
  }

  return { schedule, totalInterestPaid: totalInterest };
}

/**
 * 4. THE "GC RESERVE" (CAPEX) (Module 6.2 [418])
 * Estimates monthly reserves for critical systems based on home age.
 */
export function calculateCAPEXReserve(homeAge: number): number {
  let baseReserve = 150; // Standard monthly reserve

  // The "GC Lens" multiplier for aging mechanicals
  if (homeAge > 15) baseReserve += 100; // Aging HVAC/Roof window
  if (homeAge > 25) baseReserve += 150; // Potential plumbing/sewer risk

  return baseReserve;
}