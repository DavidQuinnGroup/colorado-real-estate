import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { calculateInvestmentScenario, INVESTMENT_ASSUMPTION_POLICY_V1, INVESTMENT_BREAKEVEN_CALCULATION_V1, validateInvestmentScenarioRequest } from '../lib/investmentBreakevenAnalysis';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260831120000_add_investment_breakeven_analysis/migration.sql', 'utf8');
const route = readFileSync('app/api/agent/investment-breakeven/route.ts', 'utf8');
const workspace = readFileSync('components/agent/InvestmentBreakevenWorkspace.tsx', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };

const request = validateInvestmentScenarioRequest({ analysisKey: 'ATLAS_CHECK', analysisTitle: 'ATLAS check', analysisPurpose: 'Synthetic only', scenarioKey: 'A', additionalCapitalCents: 18000000, reserveTargetCents: 1500000, properties: [
  { role: 'EXISTING_PRIMARY', label: 'Existing', purchasePriceCents: 0, downPaymentCents: 0, qualification: 'SYNTHETIC_CERTIFICATION', manualSaleProceedsCents: 15000000 },
  { role: 'NEW_PRIMARY', label: 'Primary', purchasePriceCents: 50000000, downPaymentCents: 10000000, closingCostsCents: 900000, monthlyTaxesCents: 55000, monthlyInsuranceCents: 18000, annualRateBasisPoints: 650, loanTermMonths: 360, qualification: 'SYNTHETIC_CERTIFICATION' },
  { role: 'INVESTMENT_PROPERTY', label: 'Investment', purchasePriceCents: 40000000, downPaymentCents: 8000000, closingCostsCents: 700000, monthlyTaxesCents: 40000, monthlyInsuranceCents: 16000, monthlyHoaCents: 15000, monthlyRentCents: 320000, vacancyBasisPoints: 500, managementBasisPoints: 800, monthlyMaintenanceCents: 15000, monthlyCapexReserveCents: 12000, annualRateBasisPoints: 675, loanTermMonths: 360, qualification: 'SYNTHETIC_CERTIFICATION' },
] });
const first = calculateInvestmentScenario(request); const second = calculateInvestmentScenario(request);
assert.deepEqual(first, second); assert.equal(first.calculationVersion, INVESTMENT_BREAKEVEN_CALCULATION_V1); assert.equal(first.assumptionPolicy, INVESTMENT_ASSUMPTION_POLICY_V1); assert.equal(first.taxTreatment, 'PRE_TAX_ONLY'); assert.ok(typeof first.investmentBreakevenRentCents === 'number'); assert.ok(typeof first.investmentMonthlyCashFlowCents === 'number');
assert.throws(() => validateInvestmentScenarioRequest({ ...request, properties: [{ ...request.properties[0], role: 'INVALID' }] }));
assert.throws(() => validateInvestmentScenarioRequest({ ...request, properties: [{ ...request.properties[2], downPaymentCents: 50000000 }] }));
for (const model of ['InvestmentAnalysis', 'InvestmentScenario', 'InvestmentScenarioResult', 'InvestmentScenarioAuditEvent']) assert.match(schema, new RegExp(`model ${model} \\{`));
for (const table of ['InvestmentAnalysis', 'InvestmentScenario', 'InvestmentScenarioResult', 'InvestmentScenarioAuditEvent']) assert.match(migration, new RegExp(`CREATE TABLE "${table}"`));
assert.match(migration, /InvestmentScenarioResult_append_only/); assert.match(route, /authorizeAdminRequest/); assert.match(route, /isSameOriginAdminRequest/); assert.match(auth, /\/api\/agent\/investment-breakeven/); assert.match(auth, /\/agent\/investment/); assert.match(workspace, /pre-tax decision support/i); assert.match(workspace, /not financial advice/i); assert.doesNotMatch(workspace, /approved rate|guaranteed return/i); assert.equal(packageJson.scripts['check:investment-breakeven-analysis'], 'jiti scripts/checkInvestmentBreakevenAnalysis.ts');
console.log('INVESTMENT_BREAKEVEN_ANALYSIS_CHECK: PASS');
