import { createHash } from 'node:crypto';
import type { Prisma, PrismaClient } from '@prisma/client';

export const MULTI_PROPERTY_FINANCIAL_SCENARIO_SCHEMA_V1 = 'MULTI_PROPERTY_FINANCIAL_SCENARIO_SCHEMA_V1' as const;
export const MULTI_PROPERTY_FINANCIAL_SCENARIO_ENGINE_V1 = 'MULTI_PROPERTY_FINANCIAL_SCENARIO_ENGINE_V1' as const;
export const MULTI_PROPERTY_FINANCIAL_SCENARIO_RESULT_V1 = 'MULTI_PROPERTY_FINANCIAL_SCENARIO_RESULT_V1' as const;
export const MULTI_PROPERTY_FINANCIAL_SCENARIO_API_ROUTE = '/api/agent/multi-property-financial-scenarios' as const;

type Database = PrismaClient;
type RecordValue = Record<string, unknown>;
export type MultiPropertyRole = 'CURRENT_HOME_SELL' | 'CURRENT_HOME_RETAIN' | 'REPLACEMENT_PRIMARY_ACQUIRE' | 'INVESTMENT_ACQUIRE';
export type PropertyReferenceType = 'CANONICAL' | 'PROSPECTIVE' | 'HYPOTHETICAL';

export class MultiPropertyFinancialScenarioError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'IMMUTABLE' | 'PERSISTENCE_CONFLICT' | 'PERSISTENCE_UNAVAILABLE', message: string) { super(message); }
}

export type MultiPropertyFinancialPropertyInput = Readonly<{
  role: MultiPropertyRole;
  referenceType: PropertyReferenceType;
  canonicalPropertyId: string | null;
  label: string;
  valueCents: number;
  debtBalanceCents: number;
  downPaymentCents: number;
  closingCostsCents: number;
  monthlyRentCents: number;
  monthlyTaxesCents: number;
  monthlyInsuranceCents: number;
  monthlyHoaCents: number;
  monthlyMaintenanceCents: number;
  monthlyCapexReserveCents: number;
  monthlyMortgageInsuranceCents: number;
  vacancyBasisPoints: number;
  managementBasisPoints: number;
  annualRateBasisPoints: number;
  loanTermMonths: number;
  qualification: 'SYNTHETIC_CERTIFICATION' | 'AGENT_ESTIMATE' | 'CLIENT_REPORTED' | 'PROFESSIONAL_INPUT';
}>;

export type MultiPropertyFinancialScenarioInput = Readonly<{
  clientCaseId: string | null;
  scenarioKey: string;
  displayName: string;
  additionalLiquidCapitalCents: number;
  reserveTargetCents: number;
  saleClosingCostBasisPoints: number;
  timing: Readonly<{ saleMonth: number; acquisitionMonth: number }>;
  properties: readonly MultiPropertyFinancialPropertyInput[];
}>;

function isRecord(value: unknown): value is RecordValue { return Boolean(value) && typeof value === 'object' && !Array.isArray(value); }
function stable(value: unknown): string { if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`; if (isRecord(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`; return JSON.stringify(value); }
export function multiPropertyFinancialScenarioFingerprint(value: unknown) { return createHash('sha256').update(stable(value)).digest('hex'); }
function text(value: unknown, field: string, maximum = 160) { if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', `${field} is invalid.`); return value.trim(); }
function nonNegativeInteger(value: unknown, field: string, maximum = 100_000_000_000) { if (!Number.isInteger(value) || Number(value) < 0 || Number(value) > maximum) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', `${field} must be a non-negative integer.`); return Number(value); }
function basisPoints(value: unknown, field: string) { return nonNegativeInteger(value, field, 10_000); }
function positiveInteger(value: unknown, field: string, maximum = 600) { const parsed = nonNegativeInteger(value, field, maximum); if (!parsed) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', `${field} must be positive.`); return parsed; }
function rounded(value: number) { return Math.round(value); }

function parseProperty(value: unknown): MultiPropertyFinancialPropertyInput {
  if (!isRecord(value)) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'A property participant is malformed.');
  const role = text(value.role, 'property role', 80) as MultiPropertyRole;
  const referenceType = text(value.referenceType, 'property reference type', 40) as PropertyReferenceType;
  const roles: MultiPropertyRole[] = ['CURRENT_HOME_SELL', 'CURRENT_HOME_RETAIN', 'REPLACEMENT_PRIMARY_ACQUIRE', 'INVESTMENT_ACQUIRE'];
  const referenceTypes: PropertyReferenceType[] = ['CANONICAL', 'PROSPECTIVE', 'HYPOTHETICAL'];
  if (!roles.includes(role) || !referenceTypes.includes(referenceType)) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'Property role or reference type is unsupported.');
  const canonicalPropertyId = typeof value.canonicalPropertyId === 'string' && value.canonicalPropertyId.trim() ? text(value.canonicalPropertyId, 'canonicalPropertyId') : null;
  if (referenceType === 'CANONICAL' && !canonicalPropertyId) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'A canonical property reference is required for CANONICAL participants.');
  if (referenceType !== 'CANONICAL' && canonicalPropertyId) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'Only CANONICAL participants may reference a canonical property.');
  const qualification = text(value.qualification ?? 'AGENT_ESTIMATE', 'property qualification', 80) as MultiPropertyFinancialPropertyInput['qualification'];
  if (!['SYNTHETIC_CERTIFICATION', 'AGENT_ESTIMATE', 'CLIENT_REPORTED', 'PROFESSIONAL_INPUT'].includes(qualification)) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'Property qualification is unsupported.');
  const input = Object.freeze({
    role, referenceType, canonicalPropertyId, label: text(value.label, 'property label'),
    valueCents: nonNegativeInteger(value.valueCents, 'valueCents'), debtBalanceCents: nonNegativeInteger(value.debtBalanceCents ?? 0, 'debtBalanceCents'),
    downPaymentCents: nonNegativeInteger(value.downPaymentCents ?? 0, 'downPaymentCents'), closingCostsCents: nonNegativeInteger(value.closingCostsCents ?? 0, 'closingCostsCents'),
    monthlyRentCents: nonNegativeInteger(value.monthlyRentCents ?? 0, 'monthlyRentCents'), monthlyTaxesCents: nonNegativeInteger(value.monthlyTaxesCents ?? 0, 'monthlyTaxesCents'),
    monthlyInsuranceCents: nonNegativeInteger(value.monthlyInsuranceCents ?? 0, 'monthlyInsuranceCents'), monthlyHoaCents: nonNegativeInteger(value.monthlyHoaCents ?? 0, 'monthlyHoaCents'),
    monthlyMaintenanceCents: nonNegativeInteger(value.monthlyMaintenanceCents ?? 0, 'monthlyMaintenanceCents'), monthlyCapexReserveCents: nonNegativeInteger(value.monthlyCapexReserveCents ?? 0, 'monthlyCapexReserveCents'), monthlyMortgageInsuranceCents: nonNegativeInteger(value.monthlyMortgageInsuranceCents ?? 0, 'monthlyMortgageInsuranceCents'),
    vacancyBasisPoints: basisPoints(value.vacancyBasisPoints ?? 0, 'vacancyBasisPoints'), managementBasisPoints: basisPoints(value.managementBasisPoints ?? 0, 'managementBasisPoints'),
    annualRateBasisPoints: basisPoints(value.annualRateBasisPoints ?? 0, 'annualRateBasisPoints'), loanTermMonths: positiveInteger(value.loanTermMonths ?? 360, 'loanTermMonths'), qualification,
  });
  if ((role === 'REPLACEMENT_PRIMARY_ACQUIRE' || role === 'INVESTMENT_ACQUIRE') && input.downPaymentCents + input.closingCostsCents > input.valueCents + input.closingCostsCents) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'Acquisition cash assumptions are invalid.');
  return input;
}

export function parseMultiPropertyFinancialScenarioInput(raw: unknown): MultiPropertyFinancialScenarioInput {
  if (!isRecord(raw) || !Array.isArray(raw.properties)) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'A scenario input with property participants is required.');
  if (!raw.properties.length) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'At least one property participant is required.');
  const properties = raw.properties.map(parseProperty);
  const roleCounts = new Map<MultiPropertyRole, number>();
  properties.forEach((property) => roleCounts.set(property.role, (roleCounts.get(property.role) ?? 0) + 1));
  if ((roleCounts.get('CURRENT_HOME_SELL') ?? 0) > 1 || (roleCounts.get('CURRENT_HOME_RETAIN') ?? 0) > 1 || (roleCounts.get('REPLACEMENT_PRIMARY_ACQUIRE') ?? 0) > 1) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'A current or replacement primary role may appear only once.');
  if ((roleCounts.get('CURRENT_HOME_SELL') ?? 0) && (roleCounts.get('CURRENT_HOME_RETAIN') ?? 0)) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'One participant cannot both sell and retain the current home in one version.');
  const timing = isRecord(raw.timing) ? raw.timing : {};
  return Object.freeze({
    clientCaseId: typeof raw.clientCaseId === 'string' && raw.clientCaseId.trim() ? text(raw.clientCaseId, 'clientCaseId') : null,
    scenarioKey: text(raw.scenarioKey, 'scenarioKey'), displayName: text(raw.displayName, 'displayName'),
    additionalLiquidCapitalCents: nonNegativeInteger(raw.additionalLiquidCapitalCents ?? 0, 'additionalLiquidCapitalCents'), reserveTargetCents: nonNegativeInteger(raw.reserveTargetCents ?? 0, 'reserveTargetCents'), saleClosingCostBasisPoints: basisPoints(raw.saleClosingCostBasisPoints ?? 0, 'saleClosingCostBasisPoints'),
    timing: Object.freeze({ saleMonth: nonNegativeInteger(timing.saleMonth ?? 0, 'timing.saleMonth', 120), acquisitionMonth: nonNegativeInteger(timing.acquisitionMonth ?? 0, 'timing.acquisitionMonth', 120) }),
    properties,
  });
}

function monthlyPrincipalAndInterest(principalCents: number, annualRateBasisPoints: number, termMonths: number) {
  if (!principalCents) return 0;
  if (!annualRateBasisPoints) return rounded(principalCents / termMonths);
  const monthlyRate = annualRateBasisPoints / 1_200_000;
  const factor = (1 + monthlyRate) ** termMonths;
  return rounded(principalCents * (monthlyRate * factor) / (factor - 1));
}

function calculateParticipant(property: MultiPropertyFinancialPropertyInput, saleClosingCostBasisPoints: number) {
  const acquisition = property.role === 'REPLACEMENT_PRIMARY_ACQUIRE' || property.role === 'INVESTMENT_ACQUIRE';
  const sale = property.role === 'CURRENT_HOME_SELL';
  const principalCents = acquisition ? Math.max(0, property.valueCents - property.downPaymentCents) : property.debtBalanceCents;
  const monthlyPrincipalInterestCents = monthlyPrincipalAndInterest(principalCents, property.annualRateBasisPoints, property.loanTermMonths);
  const vacancyCents = rounded(property.monthlyRentCents * property.vacancyBasisPoints / 10_000);
  const effectiveRentCents = property.monthlyRentCents - vacancyCents;
  const managementCents = rounded(effectiveRentCents * property.managementBasisPoints / 10_000);
  const monthlyOperatingExpenseCents = property.monthlyTaxesCents + property.monthlyInsuranceCents + property.monthlyHoaCents + property.monthlyMaintenanceCents + property.monthlyCapexReserveCents + managementCents;
  const monthlyDebtServiceCents = monthlyPrincipalInterestCents + property.monthlyMortgageInsuranceCents;
  const monthlyCashFlowCents = sale ? 0 : effectiveRentCents - monthlyOperatingExpenseCents - monthlyDebtServiceCents;
  const monthlyCarryCents = sale ? 0 : monthlyOperatingExpenseCents + monthlyDebtServiceCents - effectiveRentCents;
  const variableCostBasisPoints = property.vacancyBasisPoints + ((10_000 - property.vacancyBasisPoints) * property.managementBasisPoints / 10_000);
  const fixedOutflowCents = property.monthlyTaxesCents + property.monthlyInsuranceCents + property.monthlyHoaCents + property.monthlyMaintenanceCents + property.monthlyCapexReserveCents + monthlyDebtServiceCents;
  return Object.freeze({
    role: property.role, label: property.label, referenceType: property.referenceType, canonicalPropertyId: property.canonicalPropertyId, qualification: property.qualification,
    saleProceedsCents: sale ? Math.max(0, property.valueCents - property.debtBalanceCents - rounded(property.valueCents * saleClosingCostBasisPoints / 10_000)) : 0,
    acquisitionCashRequiredCents: acquisition ? property.downPaymentCents + property.closingCostsCents : 0,
    principalCents, monthlyPrincipalInterestCents, effectiveRentCents, monthlyOperatingExpenseCents, monthlyDebtServiceCents, monthlyCashFlowCents, monthlyCarryCents,
    breakevenRentCents: sale || variableCostBasisPoints >= 10_000 ? null : rounded(fixedOutflowCents * 10_000 / (10_000 - variableCostBasisPoints)),
  });
}

export function calculateMultiPropertyFinancialScenario(input: MultiPropertyFinancialScenarioInput) {
  const properties = input.properties.map((property) => calculateParticipant(property, input.saleClosingCostBasisPoints));
  const saleProceedsCents = properties.reduce((total, property) => total + property.saleProceedsCents, 0);
  const acquisitionCashRequiredCents = properties.reduce((total, property) => total + property.acquisitionCashRequiredCents, 0);
  const monthlyCashFlowCents = properties.reduce((total, property) => total + property.monthlyCashFlowCents, 0);
  const monthlyCarryCents = properties.reduce((total, property) => total + property.monthlyCarryCents, 0);
  const grossLiquidityBeforeActionsCents = input.additionalLiquidCapitalCents;
  const liquidityAfterAcquisitionsCents = grossLiquidityBeforeActionsCents - acquisitionCashRequiredCents - input.reserveTargetCents;
  const liquidityAfterSaleCents = liquidityAfterAcquisitionsCents + saleProceedsCents;
  const requiresBridgeLiquidityCents = input.timing.saleMonth > input.timing.acquisitionMonth ? Math.max(0, -liquidityAfterAcquisitionsCents) : 0;
  const liquidCapitalAfterTimedActionsCents = input.timing.saleMonth > input.timing.acquisitionMonth ? liquidityAfterSaleCents : grossLiquidityBeforeActionsCents + saleProceedsCents - acquisitionCashRequiredCents - input.reserveTargetCents;
  return Object.freeze({
    schemaVersion: MULTI_PROPERTY_FINANCIAL_SCENARIO_RESULT_V1,
    calculationEngine: MULTI_PROPERTY_FINANCIAL_SCENARIO_ENGINE_V1,
    scenario: { scenarioKey: input.scenarioKey, displayName: input.displayName, propertyCount: properties.length, clientCaseId: input.clientCaseId, taxTreatment: 'PRE_TAX_ONLY', qualification: input.properties.every((property) => property.qualification === 'SYNTHETIC_CERTIFICATION') ? 'SYNTHETIC_CERTIFICATION' : 'MODELED_ESTIMATE' },
    liquidity: { grossLiquidityBeforeActionsCents, saleProceedsCents, acquisitionCashRequiredCents, reserveTargetCents: input.reserveTargetCents, liquidityAfterAcquisitionsCents, liquidityAfterSaleCents, liquidCapitalAfterTimedActionsCents, requiresBridgeLiquidityCents },
    cashFlow: { monthlyCashFlowCents, monthlyCarryCents, annualCashFlowCents: monthlyCashFlowCents * 12 },
    timing: { saleMonth: input.timing.saleMonth, acquisitionMonth: input.timing.acquisitionMonth, saleBeforeAcquisition: input.timing.saleMonth <= input.timing.acquisitionMonth, overlapMonths: Math.max(0, input.timing.saleMonth - input.timing.acquisitionMonth) },
    properties,
    limitations: [
      'Decision support only; not lender underwriting, tax, legal, appraisal, or investment advice.',
      'Financing, rent, expenses, timing, sale proceeds, and future values are modeled assumptions and are not guaranteed.',
      'No external action, client delivery, document release, CRM, MLS, or transaction activation occurs from this scenario.',
    ],
  });
}

function ownedScenarioInclude() { return { versions: { include: { properties: true, result: true, outputVersions: { select: { id: true, lifecycleState: true, reviewState: true } }, auditEvents: true }, orderBy: { versionOrdinal: 'desc' as const } }, auditEvents: { orderBy: { createdAt: 'desc' as const } }, clientCase: { select: { id: true, displayName: true, status: true } } }; }

export function createMultiPropertyFinancialScenarioService(prisma: Database) {
  async function verifyCase(ownerAgentSubject: string, clientCaseId: string | null) {
    if (!clientCaseId) return;
    const clientCase = await prisma.clientCase.findFirst({ where: { id: clientCaseId, ownerAgentSubject }, select: { id: true } });
    if (!clientCase) throw new MultiPropertyFinancialScenarioError('OWNERSHIP_DENIED', 'The selected Client Case is unavailable to this Agent.');
  }
  async function verifyCanonicalProperties(properties: readonly MultiPropertyFinancialPropertyInput[]) {
    const ids = properties.flatMap((property) => property.canonicalPropertyId ? [property.canonicalPropertyId] : []);
    if (!ids.length) return;
    const found = await prisma.canonicalPhysicalProperty.findMany({ where: { id: { in: ids } }, select: { id: true } });
    if (found.length !== new Set(ids).size) throw new MultiPropertyFinancialScenarioError('NOT_FOUND', 'A canonical property participant is unavailable.');
  }
  async function listOwned(ownerAgentSubject: string, clientCaseId?: string | null) {
    if (!ownerAgentSubject.trim()) throw new MultiPropertyFinancialScenarioError('OWNERSHIP_DENIED', 'An Agent owner identity is required.');
    if (clientCaseId) await verifyCase(ownerAgentSubject, clientCaseId);
    return prisma.multiPropertyFinancialScenario.findMany({ where: { ownerAgentSubject, ...(clientCaseId ? { clientCaseId } : {}) }, include: ownedScenarioInclude(), orderBy: { createdAt: 'desc' } });
  }
  async function createScenario(ownerAgentSubject: string, raw: unknown) {
    const input = parseMultiPropertyFinancialScenarioInput(raw);
    await verifyCase(ownerAgentSubject, input.clientCaseId); await verifyCanonicalProperties(input.properties);
    const inputFingerprint = multiPropertyFinancialScenarioFingerprint({ ownerAgentSubject, schema: MULTI_PROPERTY_FINANCIAL_SCENARIO_SCHEMA_V1, input });
    const existing = await prisma.multiPropertyFinancialScenarioVersion.findUnique({ where: { inputFingerprint }, include: { scenario: { include: ownedScenarioInclude() } } });
    if (existing) {
      if (existing.ownerAgentSubject !== ownerAgentSubject) throw new MultiPropertyFinancialScenarioError('OWNERSHIP_DENIED', 'The scenario input is unavailable to this Agent.');
      return Object.freeze({ scenario: existing.scenario, version: existing, created: false });
    }
    try {
      return await prisma.$transaction(async (tx) => {
        const scenario = await tx.multiPropertyFinancialScenario.upsert({ where: { ownerAgentSubject_scenarioKey: { ownerAgentSubject, scenarioKey: input.scenarioKey } }, create: { ownerAgentSubject, clientCaseId: input.clientCaseId, scenarioKey: input.scenarioKey, displayName: input.displayName, createdBySubject: ownerAgentSubject }, update: {} });
        if (scenario.clientCaseId !== input.clientCaseId || scenario.displayName !== input.displayName) throw new MultiPropertyFinancialScenarioError('IMMUTABLE', 'Create a successor version rather than changing an existing scenario identity.');
        const ordinal = await tx.multiPropertyFinancialScenarioVersion.count({ where: { scenarioId: scenario.id } });
        const version = await tx.multiPropertyFinancialScenarioVersion.create({ data: {
          scenarioId: scenario.id, ownerAgentSubject, versionOrdinal: ordinal + 1, schemaVersion: MULTI_PROPERTY_FINANCIAL_SCENARIO_SCHEMA_V1, calculationEngine: MULTI_PROPERTY_FINANCIAL_SCENARIO_ENGINE_V1,
          inputSnapshot: input as Prisma.InputJsonValue, inputFingerprint, idempotencyKey: `MPFS_CREATE_V1|${ownerAgentSubject}|${inputFingerprint}`, createdBySubject: ownerAgentSubject,
          properties: { create: input.properties.map((property, index) => ({ ownerAgentSubject, sequence: index + 1, role: property.role, referenceType: property.referenceType, canonicalPropertyId: property.canonicalPropertyId, displayLabel: property.label, inputSnapshot: property as Prisma.InputJsonValue, provenanceSnapshot: { qualification: property.qualification, referenceType: property.referenceType, synthetic: property.qualification === 'SYNTHETIC_CERTIFICATION' } as Prisma.InputJsonValue })) },
        } });
        await tx.multiPropertyFinancialScenarioAuditEvent.create({ data: { scenarioId: scenario.id, scenarioVersionId: version.id, ownerAgentSubject, eventType: 'SCENARIO_VERSION_CREATED', eventFingerprint: multiPropertyFinancialScenarioFingerprint({ scenarioId: scenario.id, versionId: version.id, event: 'SCENARIO_VERSION_CREATED' }), detail: { inputFingerprint, schemaVersion: MULTI_PROPERTY_FINANCIAL_SCENARIO_SCHEMA_V1 } as Prisma.InputJsonValue } });
        return Object.freeze({ scenario, version, created: true });
      });
    } catch (error) {
      if (error instanceof MultiPropertyFinancialScenarioError) throw error;
      throw new MultiPropertyFinancialScenarioError('PERSISTENCE_UNAVAILABLE', 'Scenario persistence is unavailable.');
    }
  }
  async function createRevision(ownerAgentSubject: string, scenarioId: string, raw: unknown) {
    const predecessor = await prisma.multiPropertyFinancialScenarioVersion.findFirst({ where: { id: scenarioId, ownerAgentSubject }, include: { scenario: true } });
    if (!predecessor) throw new MultiPropertyFinancialScenarioError('OWNERSHIP_DENIED', 'The scenario version is unavailable to this Agent.');
    const input = parseMultiPropertyFinancialScenarioInput(raw);
    if (input.scenarioKey !== predecessor.scenario.scenarioKey || input.clientCaseId !== predecessor.scenario.clientCaseId || input.displayName !== predecessor.scenario.displayName) throw new MultiPropertyFinancialScenarioError('IMMUTABLE', 'A revision cannot alter immutable scenario identity or Client Case scope.');
    await verifyCanonicalProperties(input.properties);
    const inputFingerprint = multiPropertyFinancialScenarioFingerprint({ ownerAgentSubject, schema: MULTI_PROPERTY_FINANCIAL_SCENARIO_SCHEMA_V1, input });
    const existing = await prisma.multiPropertyFinancialScenarioVersion.findUnique({ where: { inputFingerprint } });
    if (existing) return Object.freeze({ version: existing, created: false });
    return prisma.$transaction(async (tx) => {
      const successor = await tx.multiPropertyFinancialScenarioVersion.findFirst({ where: { supersedesVersionId: predecessor.id } });
      if (successor) return Object.freeze({ version: successor, created: false });
      const ordinal = await tx.multiPropertyFinancialScenarioVersion.count({ where: { scenarioId: predecessor.scenarioId } });
      const version = await tx.multiPropertyFinancialScenarioVersion.create({ data: { scenarioId: predecessor.scenarioId, ownerAgentSubject, versionOrdinal: ordinal + 1, schemaVersion: MULTI_PROPERTY_FINANCIAL_SCENARIO_SCHEMA_V1, calculationEngine: MULTI_PROPERTY_FINANCIAL_SCENARIO_ENGINE_V1, inputSnapshot: input as Prisma.InputJsonValue, inputFingerprint, idempotencyKey: `MPFS_REVISION_V1|${ownerAgentSubject}|${predecessor.id}|${inputFingerprint}`, supersedesVersionId: predecessor.id, createdBySubject: ownerAgentSubject, properties: { create: input.properties.map((property, index) => ({ ownerAgentSubject, sequence: index + 1, role: property.role, referenceType: property.referenceType, canonicalPropertyId: property.canonicalPropertyId, displayLabel: property.label, inputSnapshot: property as Prisma.InputJsonValue, provenanceSnapshot: { qualification: property.qualification, referenceType: property.referenceType } as Prisma.InputJsonValue })) } } });
      await tx.multiPropertyFinancialScenarioAuditEvent.create({ data: { scenarioId: predecessor.scenarioId, scenarioVersionId: version.id, ownerAgentSubject, eventType: 'SCENARIO_VERSION_REVISED', eventFingerprint: multiPropertyFinancialScenarioFingerprint({ predecessorId: predecessor.id, versionId: version.id, event: 'SCENARIO_VERSION_REVISED' }), detail: { predecessorVersionId: predecessor.id, inputFingerprint } as Prisma.InputJsonValue } });
      return Object.freeze({ version, created: true });
    });
  }
  async function analyzeVersion(ownerAgentSubject: string, versionId: string) {
    const version = await prisma.multiPropertyFinancialScenarioVersion.findFirst({ where: { id: versionId, ownerAgentSubject }, include: { scenario: true, result: true } });
    if (!version) throw new MultiPropertyFinancialScenarioError('OWNERSHIP_DENIED', 'The requested scenario version is unavailable to this Agent.');
    if (version.result) return Object.freeze({ result: version.result, created: false });
    const input = parseMultiPropertyFinancialScenarioInput(version.inputSnapshot);
    const resultSnapshot = calculateMultiPropertyFinancialScenario(input);
    const resultFingerprint = multiPropertyFinancialScenarioFingerprint({ versionId: version.id, inputFingerprint: version.inputFingerprint, resultSnapshot });
    try {
      return await prisma.$transaction(async (tx) => {
        const existing = await tx.multiPropertyFinancialScenarioResult.findUnique({ where: { scenarioVersionId: version.id } });
        if (existing) return Object.freeze({ result: existing, created: false });
        const result = await tx.multiPropertyFinancialScenarioResult.create({ data: { scenarioVersionId: version.id, ownerAgentSubject, schemaVersion: MULTI_PROPERTY_FINANCIAL_SCENARIO_RESULT_V1, calculationEngine: MULTI_PROPERTY_FINANCIAL_SCENARIO_ENGINE_V1, inputFingerprint: version.inputFingerprint, resultSnapshot: resultSnapshot as Prisma.InputJsonValue, resultFingerprint, calculatedBySubject: ownerAgentSubject } });
        await tx.multiPropertyFinancialScenarioAuditEvent.create({ data: { scenarioId: version.scenarioId, scenarioVersionId: version.id, ownerAgentSubject, eventType: 'SCENARIO_RESULT_MATERIALIZED', eventFingerprint: multiPropertyFinancialScenarioFingerprint({ versionId: version.id, resultId: result.id, event: 'SCENARIO_RESULT_MATERIALIZED' }), detail: { resultFingerprint, calculationEngine: MULTI_PROPERTY_FINANCIAL_SCENARIO_ENGINE_V1 } as Prisma.InputJsonValue } });
        return Object.freeze({ result, created: true });
      });
    } catch (error) {
      if (error instanceof MultiPropertyFinancialScenarioError) throw error;
      throw new MultiPropertyFinancialScenarioError('PERSISTENCE_UNAVAILABLE', 'Scenario analysis persistence is unavailable.');
    }
  }
  async function compareVersions(ownerAgentSubject: string, versionIds: readonly string[]) {
    if (!Array.isArray(versionIds) || versionIds.length < 2 || versionIds.length > 12 || new Set(versionIds).size !== versionIds.length) throw new MultiPropertyFinancialScenarioError('INVALID_REQUEST', 'Select two to twelve distinct scenario versions.');
    const versions = await prisma.multiPropertyFinancialScenarioVersion.findMany({ where: { id: { in: [...versionIds] }, ownerAgentSubject }, include: { scenario: true, result: true } });
    if (versions.length !== versionIds.length || versions.some((version) => !version.result)) throw new MultiPropertyFinancialScenarioError('NOT_FOUND', 'Each selected owned scenario version must have an immutable result.');
    return Object.freeze(versions.map((version) => ({ scenarioId: version.scenarioId, scenarioKey: version.scenario.scenarioKey, displayName: version.scenario.displayName, versionId: version.id, versionOrdinal: version.versionOrdinal, inputFingerprint: version.inputFingerprint, resultId: version.result!.id, resultFingerprint: version.result!.resultFingerprint, resultSnapshot: version.result!.resultSnapshot })));
  }
  return Object.freeze({ listOwned, createScenario, createRevision, analyzeVersion, compareVersions });
}
