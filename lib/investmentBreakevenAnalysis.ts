import { createHash } from 'node:crypto';
import type { Prisma, PrismaClient } from '@prisma/client';

export const INVESTMENT_BREAKEVEN_CALCULATION_V1 = 'INVESTMENT_BREAKEVEN_CALCULATION_V1' as const;
export const INVESTMENT_ASSUMPTION_POLICY_V1 = 'INVESTMENT_ASSUMPTION_POLICY_V1' as const;

export type InvestmentPropertyRole = 'EXISTING_PRIMARY' | 'NEW_PRIMARY' | 'INVESTMENT_PROPERTY';
export type InputQualification = 'SYNTHETIC_CERTIFICATION' | 'AGENT_ESTIMATE' | 'CLIENT_REPORTED' | 'SELLER_FINANCIAL_REVIEWED_RESULT' | 'PROFESSIONAL_INPUT';
type Database = PrismaClient;
type RecordValue = Record<string, unknown>;

export class InvestmentBreakevenError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'IMMUTABLE' | 'PERSISTENCE_UNAVAILABLE', message: string) { super(message); }
}

export type InvestmentPropertyInput = Readonly<{
  role: InvestmentPropertyRole;
  label: string;
  purchasePriceCents: number;
  downPaymentCents: number;
  closingCostsCents: number;
  monthlyTaxesCents: number;
  monthlyInsuranceCents: number;
  monthlyHoaCents: number;
  monthlyRentCents: number;
  vacancyBasisPoints: number;
  managementBasisPoints: number;
  monthlyMaintenanceCents: number;
  monthlyCapexReserveCents: number;
  annualRateBasisPoints: number;
  loanTermMonths: number;
  monthlyMortgageInsuranceCents: number;
  qualification: InputQualification;
  sellerFinancialResultId?: string | null;
  manualSaleProceedsCents?: number | null;
}>;

export type InvestmentScenarioRequest = Readonly<{
  analysisKey: string;
  analysisTitle: string;
  analysisPurpose: string;
  scenarioKey: string;
  properties: readonly InvestmentPropertyInput[];
  additionalCapitalCents?: number;
  reserveTargetCents?: number;
  supersedesScenarioId?: string | null;
  review?: boolean;
}>;

function isRecord(value: unknown): value is RecordValue { return Boolean(value) && typeof value === 'object' && !Array.isArray(value); }
function asRecord(value: unknown): RecordValue { return isRecord(value) ? value : {}; }
function text(value: unknown, field: string, maximum = 160) { if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new InvestmentBreakevenError('INVALID_REQUEST', `${field} is invalid.`); return value.trim(); }
function wholeCents(value: unknown, field: string) { if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 100_000_000_000) throw new InvestmentBreakevenError('INVALID_REQUEST', `${field} must be non-negative integer cents.`); return value; }
function basisPoints(value: unknown, field: string) { if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 100_000) throw new InvestmentBreakevenError('INVALID_REQUEST', `${field} is invalid.`); return value; }
function stable(value: unknown): string { if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`; if (isRecord(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`; return JSON.stringify(value); }
export function investmentFingerprint(value: unknown) { return createHash('sha256').update(stable(value)).digest('hex'); }
function rounded(value: number) { return Math.round(value); }
function monthlyPrincipalAndInterest(principalCents: number, annualRateBasisPoints: number, termMonths: number) {
  if (!principalCents) return 0;
  if (!annualRateBasisPoints) return rounded(principalCents / termMonths);
  const monthlyRate = annualRateBasisPoints / 1_200_000;
  const factor = (1 + monthlyRate) ** termMonths;
  return rounded(principalCents * (monthlyRate * factor) / (factor - 1));
}
function propertyResult(property: InvestmentPropertyInput) {
  const loanPrincipalCents = property.purchasePriceCents - property.downPaymentCents;
  const monthlyPrincipalInterestCents = monthlyPrincipalAndInterest(loanPrincipalCents, property.annualRateBasisPoints, property.loanTermMonths);
  const vacancyCents = rounded(property.monthlyRentCents * property.vacancyBasisPoints / 10_000);
  const effectiveRentCents = property.monthlyRentCents - vacancyCents;
  const managementCents = rounded(effectiveRentCents * property.managementBasisPoints / 10_000);
  const monthlyOperatingExpensesCents = property.monthlyTaxesCents + property.monthlyInsuranceCents + property.monthlyHoaCents + property.monthlyMaintenanceCents + property.monthlyCapexReserveCents + managementCents;
  const monthlyDebtServiceCents = monthlyPrincipalInterestCents + property.monthlyMortgageInsuranceCents;
  const monthlyCashFlowCents = effectiveRentCents - monthlyOperatingExpensesCents - monthlyDebtServiceCents;
  const monthlyCarryCents = property.monthlyTaxesCents + property.monthlyInsuranceCents + property.monthlyHoaCents + monthlyDebtServiceCents;
  const annualNoiCents = (effectiveRentCents - monthlyOperatingExpensesCents) * 12;
  const capRateBasisPoints = property.purchasePriceCents ? rounded(annualNoiCents * 10_000 / property.purchasePriceCents) : null;
  const cashRequiredCents = property.downPaymentCents + property.closingCostsCents;
  const cashOnCashBasisPoints = cashRequiredCents ? rounded((monthlyCashFlowCents * 12) * 10_000 / cashRequiredCents) : null;
  const variableRateBasisPoints = property.vacancyBasisPoints + (10_000 - property.vacancyBasisPoints) * property.managementBasisPoints / 10_000;
  const fixedOutflowCents = property.monthlyTaxesCents + property.monthlyInsuranceCents + property.monthlyHoaCents + property.monthlyMaintenanceCents + property.monthlyCapexReserveCents + monthlyDebtServiceCents;
  const breakevenRentCents = variableRateBasisPoints >= 10_000 ? null : rounded(fixedOutflowCents * 10_000 / (10_000 - variableRateBasisPoints));
  return Object.freeze({ role: property.role, label: property.label, qualification: property.qualification, loanPrincipalCents, monthlyPrincipalInterestCents, vacancyCents, effectiveRentCents, managementCents, monthlyOperatingExpensesCents, monthlyDebtServiceCents, monthlyCashFlowCents, monthlyCarryCents, annualNoiCents, capRateBasisPoints, cashRequiredCents, cashOnCashBasisPoints, breakevenRentCents, breakevenMarginCents: breakevenRentCents === null ? null : property.monthlyRentCents - breakevenRentCents });
}

export function validateInvestmentScenarioRequest(value: unknown): InvestmentScenarioRequest {
  if (!isRecord(value)) throw new InvestmentBreakevenError('INVALID_REQUEST', 'Investment scenario is malformed.');
  if (!Array.isArray(value.properties) || !value.properties.length || value.properties.length > 3) throw new InvestmentBreakevenError('INVALID_REQUEST', 'One to three scenario properties are required.');
  const roles = new Set<string>();
  const properties = value.properties.map((candidate) => {
    if (!isRecord(candidate)) throw new InvestmentBreakevenError('INVALID_REQUEST', 'Property input is malformed.');
    const role = text(candidate.role, 'role', 80) as InvestmentPropertyRole;
    if (!['EXISTING_PRIMARY', 'NEW_PRIMARY', 'INVESTMENT_PROPERTY'].includes(role) || roles.has(role)) throw new InvestmentBreakevenError('INVALID_REQUEST', 'Property roles must be unique supported roles.');
    roles.add(role);
    const qualification = text(candidate.qualification, 'qualification', 80) as InputQualification;
    if (!['SYNTHETIC_CERTIFICATION', 'AGENT_ESTIMATE', 'CLIENT_REPORTED', 'SELLER_FINANCIAL_REVIEWED_RESULT', 'PROFESSIONAL_INPUT'].includes(qualification)) throw new InvestmentBreakevenError('INVALID_REQUEST', 'qualification is invalid.');
    const purchasePriceCents = wholeCents(candidate.purchasePriceCents, 'purchasePriceCents');
    const downPaymentCents = wholeCents(candidate.downPaymentCents, 'downPaymentCents');
    if (downPaymentCents > purchasePriceCents) throw new InvestmentBreakevenError('INVALID_REQUEST', 'downPaymentCents cannot exceed purchasePriceCents.');
    const manualSaleProceedsCents = candidate.manualSaleProceedsCents === null || candidate.manualSaleProceedsCents === undefined ? null : wholeCents(candidate.manualSaleProceedsCents, 'manualSaleProceedsCents');
    return Object.freeze({ role, label: text(candidate.label, 'label'), purchasePriceCents, downPaymentCents, closingCostsCents: wholeCents(candidate.closingCostsCents ?? 0, 'closingCostsCents'), monthlyTaxesCents: wholeCents(candidate.monthlyTaxesCents ?? 0, 'monthlyTaxesCents'), monthlyInsuranceCents: wholeCents(candidate.monthlyInsuranceCents ?? 0, 'monthlyInsuranceCents'), monthlyHoaCents: wholeCents(candidate.monthlyHoaCents ?? 0, 'monthlyHoaCents'), monthlyRentCents: wholeCents(candidate.monthlyRentCents ?? 0, 'monthlyRentCents'), vacancyBasisPoints: basisPoints(candidate.vacancyBasisPoints ?? 0, 'vacancyBasisPoints'), managementBasisPoints: basisPoints(candidate.managementBasisPoints ?? 0, 'managementBasisPoints'), monthlyMaintenanceCents: wholeCents(candidate.monthlyMaintenanceCents ?? 0, 'monthlyMaintenanceCents'), monthlyCapexReserveCents: wholeCents(candidate.monthlyCapexReserveCents ?? 0, 'monthlyCapexReserveCents'), annualRateBasisPoints: basisPoints(candidate.annualRateBasisPoints ?? 0, 'annualRateBasisPoints'), loanTermMonths: Number.isInteger(candidate.loanTermMonths) && Number(candidate.loanTermMonths) > 0 && Number(candidate.loanTermMonths) <= 480 ? Number(candidate.loanTermMonths) : 360, monthlyMortgageInsuranceCents: wholeCents(candidate.monthlyMortgageInsuranceCents ?? 0, 'monthlyMortgageInsuranceCents'), qualification, sellerFinancialResultId: typeof candidate.sellerFinancialResultId === 'string' ? candidate.sellerFinancialResultId : null, manualSaleProceedsCents });
  });
  return Object.freeze({ analysisKey: text(value.analysisKey, 'analysisKey'), analysisTitle: text(value.analysisTitle, 'analysisTitle'), analysisPurpose: text(value.analysisPurpose, 'analysisPurpose', 240), scenarioKey: text(value.scenarioKey, 'scenarioKey'), properties, additionalCapitalCents: wholeCents(value.additionalCapitalCents ?? 0, 'additionalCapitalCents'), reserveTargetCents: wholeCents(value.reserveTargetCents ?? 0, 'reserveTargetCents'), supersedesScenarioId: typeof value.supersedesScenarioId === 'string' ? value.supersedesScenarioId : null, review: value.review === true });
}

export function calculateInvestmentScenario(input: InvestmentScenarioRequest) {
  const properties = input.properties.map(propertyResult);
  const existing = input.properties.find((property) => property.role === 'EXISTING_PRIMARY');
  const saleProceedsCents = existing?.manualSaleProceedsCents ?? 0;
  const totalCashRequiredCents = properties.filter((property) => property.role !== 'EXISTING_PRIMARY').reduce((total, property) => total + property.cashRequiredCents, 0) + (input.reserveTargetCents ?? 0);
  const availableCapitalCents = saleProceedsCents + (input.additionalCapitalCents ?? 0);
  const remainingLiquidityCents = availableCapitalCents - totalCashRequiredCents;
  const primary = properties.find((property) => property.role === 'NEW_PRIMARY');
  const investment = properties.find((property) => property.role === 'INVESTMENT_PROPERTY');
  const combinedMonthlyPropertyCashRequirementCents = properties.reduce((total, property) => total + (property.role === 'INVESTMENT_PROPERTY' ? -property.monthlyCashFlowCents : property.monthlyCarryCents), 0);
  return Object.freeze({ calculationVersion: INVESTMENT_BREAKEVEN_CALCULATION_V1, assumptionPolicy: INVESTMENT_ASSUMPTION_POLICY_V1, qualifier: 'MODELED_ESTIMATE', taxTreatment: 'PRE_TAX_ONLY', properties, availableCapitalCents, totalCashRequiredCents, remainingLiquidityCents, newPrimaryMonthlyCarryCents: primary?.monthlyCarryCents ?? null, investmentMonthlyCashFlowCents: investment?.monthlyCashFlowCents ?? null, investmentAnnualNoiCents: investment?.annualNoiCents ?? null, investmentCapRateBasisPoints: investment?.capRateBasisPoints ?? null, investmentPreTaxCashOnCashBasisPoints: investment?.cashOnCashBasisPoints ?? null, investmentBreakevenRentCents: investment?.breakevenRentCents ?? null, investmentBreakevenMarginCents: investment?.breakevenMarginCents ?? null, combinedMonthlyPropertyCashRequirementCents, limitations: ['Results are modeled estimates based on the assumptions shown.', 'Financing, rent, vacancy, expenses, and future value are not guaranteed.', 'Tax consequences, loan qualification, and lender approval are not modeled.'] });
}

export function calculateInvestmentSensitivity(input: InvestmentScenarioRequest, rentDeltaCents: number) {
  if (!Number.isInteger(rentDeltaCents) || rentDeltaCents < -100_000_000 || rentDeltaCents > 100_000_000) {
    throw new InvestmentBreakevenError('INVALID_REQUEST', 'rentDeltaCents is invalid.');
  }
  const adjusted = Object.freeze({
    ...input,
    properties: input.properties.map((property) => property.role === 'INVESTMENT_PROPERTY'
      ? Object.freeze({ ...property, monthlyRentCents: Math.max(0, property.monthlyRentCents + rentDeltaCents) })
      : property),
  });
  return Object.freeze({ rentDeltaCents, result: calculateInvestmentScenario(adjusted) });
}

export function createInvestmentBreakevenService(prisma: Database) {
  async function listOwned(ownerAgentSubject: string) { return prisma.investmentAnalysis.findMany({ where: { ownerAgentSubject }, include: { scenarios: { include: { result: true, auditEvents: true, supersededByScenario: true }, orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' } }); }
  async function createScenario(ownerAgentSubject: string, raw: unknown) {
    const owner = text(ownerAgentSubject, 'ownerAgentSubject'); const input = validateInvestmentScenarioRequest(raw); const resultSnapshot = calculateInvestmentScenario(input);
    const inputFingerprint = investmentFingerprint({ owner, input, calculationVersion: INVESTMENT_BREAKEVEN_CALCULATION_V1, assumptionPolicy: INVESTMENT_ASSUMPTION_POLICY_V1 });
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const analysis = await tx.investmentAnalysis.upsert({ where: { ownerAgentSubject_analysisKey: { ownerAgentSubject: owner, analysisKey: input.analysisKey } }, create: { ownerAgentSubject: owner, analysisKey: input.analysisKey, title: input.analysisTitle, purpose: input.analysisPurpose, lifecycleState: 'DRAFT', calculationVersion: INVESTMENT_BREAKEVEN_CALCULATION_V1, assumptionPolicy: INVESTMENT_ASSUMPTION_POLICY_V1 }, update: {} });
      const existing = await tx.investmentScenario.findUnique({ where: { inputFingerprint }, include: { result: true } }); if (existing) return { scenario: existing, result: existing.result, created: false };
      if (input.supersedesScenarioId) { const predecessor = await tx.investmentScenario.findFirst({ where: { id: input.supersedesScenarioId, ownerAgentSubject: owner } }); if (!predecessor) throw new InvestmentBreakevenError('NOT_FOUND', 'The superseded scenario is unavailable.'); }
      const versionOrdinal = await tx.investmentScenario.count({ where: { analysisId: analysis.id, scenarioKey: input.scenarioKey } });
      const scenario = await tx.investmentScenario.create({ data: { analysisId: analysis.id, ownerAgentSubject: owner, scenarioKey: input.scenarioKey, versionOrdinal: versionOrdinal + 1, lifecycleState: input.review ? 'AGENT_REVIEWED' : 'DRAFT', calculationVersion: INVESTMENT_BREAKEVEN_CALCULATION_V1, assumptionPolicy: INVESTMENT_ASSUMPTION_POLICY_V1, inputSnapshot: input as never, sourceQualification: input.properties.map(({ role, qualification, sellerFinancialResultId }) => ({ role, qualification, sellerFinancialResultId: sellerFinancialResultId ?? null })), dependencySnapshot: input.properties.filter((property) => property.sellerFinancialResultId).map((property) => ({ kind: 'SELLER_FINANCIAL_RESULT', id: property.sellerFinancialResultId, role: property.role })), inputFingerprint, supersedesScenarioId: input.supersedesScenarioId, reviewedAt: input.review ? new Date() : null }, include: { result: true } });
      const result = await tx.investmentScenarioResult.create({ data: { scenarioId: scenario.id, ownerAgentSubject: owner, calculationVersion: INVESTMENT_BREAKEVEN_CALCULATION_V1, resultSnapshot: resultSnapshot as never, resultFingerprint: investmentFingerprint({ scenarioId: scenario.id, resultSnapshot }) } });
      await tx.investmentScenarioAuditEvent.createMany({ data: [{ scenarioId: scenario.id, ownerAgentSubject: owner, eventType: 'SCENARIO_CREATED', eventFingerprint: investmentFingerprint({ scenarioId: scenario.id, event: 'SCENARIO_CREATED' }) }, { scenarioId: scenario.id, ownerAgentSubject: owner, eventType: 'RESULT_MATERIALIZED', eventFingerprint: investmentFingerprint({ scenarioId: scenario.id, event: 'RESULT_MATERIALIZED' }) }] });
      return { scenario, result, created: true };
    });
  }
  async function cloneScenario(ownerAgentSubject: string, raw: unknown) {
    if (!isRecord(raw)) throw new InvestmentBreakevenError('INVALID_REQUEST', 'Clone request is malformed.');
    const sourceScenarioId = text(raw.sourceScenarioId, 'sourceScenarioId');
    const scenarioKey = text(raw.scenarioKey, 'scenarioKey');
    const source = await prisma.investmentScenario.findFirst({ where: { id: sourceScenarioId, ownerAgentSubject } });
    if (!source) throw new InvestmentBreakevenError('NOT_FOUND', 'The source scenario is unavailable.');
    const sourceInput = asRecord(source.inputSnapshot);
    return createScenario(ownerAgentSubject, {
      ...sourceInput,
      scenarioKey,
      supersedesScenarioId: source.id,
      review: false,
    });
  }
  async function reviewScenario(ownerAgentSubject: string, scenarioId: string) {
    const owner = text(ownerAgentSubject, 'ownerAgentSubject');
    const scenario = await prisma.investmentScenario.findFirst({ where: { id: scenarioId, ownerAgentSubject: owner }, include: { result: true } });
    if (!scenario) throw new InvestmentBreakevenError('NOT_FOUND', 'The scenario is unavailable.');
    if (!scenario.result) throw new InvestmentBreakevenError('PERSISTENCE_UNAVAILABLE', 'The immutable scenario result is unavailable.');
    if (scenario.lifecycleState === 'AGENT_REVIEWED') return { scenario, result: scenario.result, reviewed: false };
    if (scenario.lifecycleState !== 'DRAFT') throw new InvestmentBreakevenError('IMMUTABLE', 'The scenario cannot be reviewed from its current state.');
    return prisma.$transaction(async (tx) => {
      const reviewedAt = new Date();
      const reviewed = await tx.investmentScenario.update({ where: { id: scenario.id }, data: { lifecycleState: 'AGENT_REVIEWED', reviewedAt }, include: { result: true } });
      await tx.investmentScenarioAuditEvent.create({ data: { scenarioId: scenario.id, ownerAgentSubject: owner, eventType: 'SCENARIO_AGENT_REVIEWED', eventFingerprint: investmentFingerprint({ scenarioId: scenario.id, event: 'SCENARIO_AGENT_REVIEWED' }) } });
      return { scenario: reviewed, result: reviewed.result, reviewed: true };
    });
  }
  async function calculateSensitivity(ownerAgentSubject: string, scenarioId: string, rentDeltaCents: number) {
    const scenario = await prisma.investmentScenario.findFirst({ where: { id: scenarioId, ownerAgentSubject } });
    if (!scenario) throw new InvestmentBreakevenError('NOT_FOUND', 'The scenario is unavailable.');
    return calculateInvestmentSensitivity(validateInvestmentScenarioRequest(scenario.inputSnapshot), rentDeltaCents);
  }
  return Object.freeze({ listOwned, createScenario, cloneScenario, reviewScenario, calculateSensitivity });
}
