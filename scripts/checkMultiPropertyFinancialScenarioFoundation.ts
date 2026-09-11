import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  calculateMultiPropertyFinancialScenario,
  MULTI_PROPERTY_FINANCIAL_SCENARIO_ENGINE_V1,
  parseMultiPropertyFinancialScenarioInput,
} from '../lib/multiPropertyFinancialScenarioFoundation.js';

const root = process.cwd();
const fixture = parseMultiPropertyFinancialScenarioInput({
  clientCaseId: null,
  scenarioKey: 'ATLAS_SYNTHETIC_MULTI_PROPERTY_SCENARIO',
  displayName: 'ATLAS Synthetic Multi-Property Financial Scenario',
  additionalLiquidCapitalCents: 0,
  reserveTargetCents: 5_000_000,
  saleClosingCostBasisPoints: 600,
  timing: { saleMonth: 1, acquisitionMonth: 0 },
  properties: [
    { role: 'CURRENT_HOME_SELL', referenceType: 'HYPOTHETICAL', canonicalPropertyId: null, label: 'ATLAS Synthetic Current Home', valueCents: 80_000_000, debtBalanceCents: 40_000_000, downPaymentCents: 0, closingCostsCents: 0, monthlyRentCents: 0, monthlyTaxesCents: 60_000, monthlyInsuranceCents: 18_000, monthlyHoaCents: 0, monthlyMaintenanceCents: 12_000, monthlyCapexReserveCents: 8_000, monthlyMortgageInsuranceCents: 0, vacancyBasisPoints: 0, managementBasisPoints: 0, annualRateBasisPoints: 650, loanTermMonths: 360, qualification: 'SYNTHETIC_CERTIFICATION' },
    { role: 'REPLACEMENT_PRIMARY_ACQUIRE', referenceType: 'HYPOTHETICAL', canonicalPropertyId: null, label: 'ATLAS Synthetic Replacement Primary', valueCents: 65_000_000, debtBalanceCents: 0, downPaymentCents: 13_000_000, closingCostsCents: 1_300_000, monthlyRentCents: 0, monthlyTaxesCents: 60_000, monthlyInsuranceCents: 18_000, monthlyHoaCents: 0, monthlyMaintenanceCents: 12_000, monthlyCapexReserveCents: 8_000, monthlyMortgageInsuranceCents: 0, vacancyBasisPoints: 0, managementBasisPoints: 0, annualRateBasisPoints: 650, loanTermMonths: 360, qualification: 'SYNTHETIC_CERTIFICATION' },
    { role: 'INVESTMENT_ACQUIRE', referenceType: 'PROSPECTIVE', canonicalPropertyId: null, label: 'ATLAS Synthetic Investment', valueCents: 42_000_000, debtBalanceCents: 0, downPaymentCents: 8_400_000, closingCostsCents: 840_000, monthlyRentCents: 320_000, monthlyTaxesCents: 35_000, monthlyInsuranceCents: 12_000, monthlyHoaCents: 0, monthlyMaintenanceCents: 20_000, monthlyCapexReserveCents: 12_000, monthlyMortgageInsuranceCents: 0, vacancyBasisPoints: 500, managementBasisPoints: 800, annualRateBasisPoints: 650, loanTermMonths: 360, qualification: 'SYNTHETIC_CERTIFICATION' },
  ],
});

const result = calculateMultiPropertyFinancialScenario(fixture);
assert.equal(result.calculationEngine, MULTI_PROPERTY_FINANCIAL_SCENARIO_ENGINE_V1);
assert.equal(result.properties.length, 3);
assert.equal(result.liquidity.saleProceedsCents, 35_200_000);
assert.equal(result.liquidity.acquisitionCashRequiredCents, 23_540_000);
assert.equal(result.timing.saleBeforeAcquisition, false);
assert.ok(result.liquidity.requiresBridgeLiquidityCents > 0);
assert.equal(result.properties.find((property) => property.role === 'INVESTMENT_ACQUIRE')?.breakevenRentCents !== null, true);
assert.throws(() => parseMultiPropertyFinancialScenarioInput({ ...fixture, properties: [{ ...fixture.properties[0] }, { ...fixture.properties[0] }] }));
assert.throws(() => parseMultiPropertyFinancialScenarioInput({ ...fixture, properties: fixture.properties.map((property) => property.role === 'CURRENT_HOME_SELL' ? { ...property, referenceType: 'CANONICAL', canonicalPropertyId: null } : property) }));

const [schema, migration, route, service, output, workspace] = await Promise.all([
  readFile(resolve(root, 'prisma/schema.prisma'), 'utf8'),
  readFile(resolve(root, 'prisma/migrations/20260911000000_add_multi_property_financial_scenario_foundation/migration.sql'), 'utf8'),
  readFile(resolve(root, 'app/api/agent/multi-property-financial-scenarios/route.ts'), 'utf8'),
  readFile(resolve(root, 'lib/multiPropertyFinancialScenarioFoundation.ts'), 'utf8'),
  readFile(resolve(root, 'lib/outputPersistenceFoundation.ts'), 'utf8'),
  readFile(resolve(root, 'components/agent/MultiPropertyFinancialScenarioWorkspace.tsx'), 'utf8'),
]);
for (const token of ['model MultiPropertyFinancialScenario', 'model MultiPropertyFinancialScenarioVersion', 'model MultiPropertyFinancialScenarioProperty', 'model MultiPropertyFinancialScenarioResult', 'multiPropertyFinancialScenarioVersionId']) assert.ok(schema.includes(token), `schema missing ${token}`);
for (const token of ['CREATE TABLE "MultiPropertyFinancialScenario"', 'CREATE TABLE "MultiPropertyFinancialScenarioVersion"', 'ALTER TABLE "OutputVersion" ADD COLUMN "multiPropertyFinancialScenarioVersionId"']) assert.ok(migration.includes(token), `migration missing ${token}`);
for (const token of ['CREATE_SCENARIO', 'CREATE_REVISION', 'ANALYZE_VERSION', 'COMPARE_VERSIONS', 'CREATE_OUTPUT_DRAFT', 'isSameOriginAdminRequest']) assert.ok(route.includes(token), `route missing ${token}`);
for (const token of ['listOwned', 'createScenario', 'createRevision', 'analyzeVersion', 'compareVersions', 'SYNTHETIC_CERTIFICATION']) assert.ok(service.includes(token), `service missing ${token}`);
assert.ok(output.includes('createMultiPropertyFinancialScenarioOutputDraft'));
for (const token of ['data-testid="multi-property-financial-scenario-workspace"', 'Add participant', 'Prepare Output', 'Compare exact versions']) assert.ok(workspace.includes(token), `workspace missing ${token}`);
console.log('Multi-property financial scenario foundation checks passed.');
