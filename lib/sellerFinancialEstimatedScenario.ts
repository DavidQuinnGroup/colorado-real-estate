/* eslint-disable @typescript-eslint/no-explicit-any -- narrow Prisma adapter supports deterministic contract checks. */
import { createHash } from 'node:crypto';

export const SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1 = 'SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1' as const;

export const SELLER_FINANCIAL_INPUT_KEYS = [
  'SALE_PRICE', 'PAYOFF', 'SELLING_COMPENSATION', 'SELLER_CONCESSION',
  'PREPARATION_ALLOWANCE', 'REPAIR_ALLOWANCE', 'TITLE_CLOSING_ESTIMATE',
  'PROPERTY_TAX_PRORATION', 'HOA_TRANSFER_FEES', 'OTHER_SELLER_COST',
] as const;

export type SellerFinancialInputKey = (typeof SELLER_FINANCIAL_INPUT_KEYS)[number];
export type SellerFinancialSourceClass = 'PROFESSIONAL_INPUT' | 'CLIENT_PROVIDED' | 'AGENT_ESTIMATE' | 'SYSTEM_SOURCE' | 'SCENARIO_ASSUMPTION' | 'UNKNOWN';
export type SellerFinancialValueState = 'VALUE' | 'UNKNOWN' | 'NOT_INCLUDED';

export const SELLER_FINANCIAL_INPUT_REGISTRY: Readonly<Record<SellerFinancialInputKey, Readonly<{ label: string; required: boolean; allowedSources: readonly SellerFinancialSourceClass[] }>>> = Object.freeze({
  SALE_PRICE: { label: 'Estimated sale price', required: true, allowedSources: ['SCENARIO_ASSUMPTION', 'SYSTEM_SOURCE'] },
  PAYOFF: { label: 'Estimated payoff', required: true, allowedSources: ['PROFESSIONAL_INPUT', 'CLIENT_PROVIDED', 'AGENT_ESTIMATE', 'SCENARIO_ASSUMPTION', 'UNKNOWN'] },
  SELLING_COMPENSATION: { label: 'Selling-side compensation assumption', required: false, allowedSources: ['SCENARIO_ASSUMPTION', 'AGENT_ESTIMATE', 'UNKNOWN'] },
  SELLER_CONCESSION: { label: 'Seller concession assumption', required: false, allowedSources: ['SCENARIO_ASSUMPTION', 'CLIENT_PROVIDED', 'AGENT_ESTIMATE', 'UNKNOWN'] },
  PREPARATION_ALLOWANCE: { label: 'Seller preparation allowance', required: false, allowedSources: ['CLIENT_PROVIDED', 'AGENT_ESTIMATE', 'SCENARIO_ASSUMPTION', 'UNKNOWN'] },
  REPAIR_ALLOWANCE: { label: 'Repair allowance', required: false, allowedSources: ['CLIENT_PROVIDED', 'AGENT_ESTIMATE', 'SCENARIO_ASSUMPTION', 'UNKNOWN'] },
  TITLE_CLOSING_ESTIMATE: { label: 'Title / closing estimate', required: false, allowedSources: ['PROFESSIONAL_INPUT', 'AGENT_ESTIMATE', 'SCENARIO_ASSUMPTION', 'UNKNOWN'] },
  PROPERTY_TAX_PRORATION: { label: 'Property tax / proration estimate', required: false, allowedSources: ['SYSTEM_SOURCE', 'AGENT_ESTIMATE', 'SCENARIO_ASSUMPTION', 'UNKNOWN'] },
  HOA_TRANSFER_FEES: { label: 'HOA / transfer fee estimate', required: false, allowedSources: ['PROFESSIONAL_INPUT', 'AGENT_ESTIMATE', 'SCENARIO_ASSUMPTION', 'UNKNOWN'] },
  OTHER_SELLER_COST: { label: 'Other seller cost', required: false, allowedSources: ['CLIENT_PROVIDED', 'AGENT_ESTIMATE', 'SCENARIO_ASSUMPTION', 'UNKNOWN'] },
});

export class SellerFinancialScenarioError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'CURRENT_INPUT_REQUIRED' | 'IMMUTABLE' | 'PERSISTENCE_UNAVAILABLE', message: string) { super(message); }
}

export type SellerFinancialInput = Readonly<{ key: SellerFinancialInputKey; state: SellerFinancialValueState; amountCents: number | null; sourceClass: SellerFinancialSourceClass; note?: string | null; professionalInputId?: string | null }>;
export type SellerFinancialScenarioRequest = Readonly<{ scenarioKey: string; inputs: readonly SellerFinancialInput[]; supersedesScenarioId?: string | null; review?: boolean }>;

type SellerFinancialDatabase = { $transaction: any; sellerFinancialScenario: any; sellerFinancialResult: any; sellerFinancialAuditEvent: any; professionalInput: any; };

function canonical(value: unknown) { return JSON.stringify(value, Object.keys(value as object).sort()); }
function fingerprint(value: unknown) { return createHash('sha256').update(canonical(value)).digest('hex'); }
function ownerScope(owner: string) { if (!owner.trim()) throw new SellerFinancialScenarioError('OWNERSHIP_DENIED', 'An authenticated Agent owner identity is required.'); return owner; }
function integerCents(value: unknown, field: string) {
  if (!Number.isInteger(value) || typeof value !== 'number' || value < 0 || value > 100_000_000_000) throw new SellerFinancialScenarioError('INVALID_REQUEST', `${field} must be non-negative integer cents.`);
  return value;
}
function validKey(value: unknown): value is SellerFinancialInputKey { return typeof value === 'string' && SELLER_FINANCIAL_INPUT_KEYS.includes(value as SellerFinancialInputKey); }
function validSource(value: unknown): value is SellerFinancialSourceClass { return ['PROFESSIONAL_INPUT', 'CLIENT_PROVIDED', 'AGENT_ESTIMATE', 'SYSTEM_SOURCE', 'SCENARIO_ASSUMPTION', 'UNKNOWN'].includes(String(value)); }
function validState(value: unknown): value is SellerFinancialValueState { return ['VALUE', 'UNKNOWN', 'NOT_INCLUDED'].includes(String(value)); }

export function validateSellerFinancialScenarioRequest(value: unknown): SellerFinancialScenarioRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new SellerFinancialScenarioError('INVALID_REQUEST', 'Scenario request is malformed.');
  const record = value as Record<string, unknown>;
  if (typeof record.scenarioKey !== 'string' || !record.scenarioKey.trim() || record.scenarioKey.length > 120) throw new SellerFinancialScenarioError('INVALID_REQUEST', 'scenarioKey is required.');
  if (!Array.isArray(record.inputs) || record.inputs.length === 0 || record.inputs.length > SELLER_FINANCIAL_INPUT_KEYS.length) throw new SellerFinancialScenarioError('INVALID_REQUEST', 'Scenario inputs are invalid.');
  const keys = new Set<string>();
  const inputs = record.inputs.map((value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new SellerFinancialScenarioError('INVALID_REQUEST', 'Scenario input is malformed.');
    const input = value as Record<string, unknown>;
    if (!validKey(input.key) || !validState(input.state) || !validSource(input.sourceClass)) throw new SellerFinancialScenarioError('INVALID_REQUEST', 'Scenario input type is invalid.');
    if (keys.has(input.key)) throw new SellerFinancialScenarioError('INVALID_REQUEST', 'Scenario input keys must be unique.');
    keys.add(input.key);
    if (!SELLER_FINANCIAL_INPUT_REGISTRY[input.key].allowedSources.includes(input.sourceClass)) throw new SellerFinancialScenarioError('INVALID_REQUEST', `${input.key} does not allow that source.`);
    if (input.state === 'VALUE') {
      if (input.amountCents === null || input.amountCents === undefined) throw new SellerFinancialScenarioError('INVALID_REQUEST', `${input.key} requires an amount.`);
      integerCents(input.amountCents, input.key);
    } else if (input.amountCents !== null && input.amountCents !== undefined) throw new SellerFinancialScenarioError('INVALID_REQUEST', `${input.key} cannot have an amount in its current state.`);
    if (input.sourceClass === 'UNKNOWN' && input.state !== 'UNKNOWN') throw new SellerFinancialScenarioError('INVALID_REQUEST', 'UNKNOWN source requires UNKNOWN state.');
    if (typeof input.note === 'string' && input.note.length > 500) throw new SellerFinancialScenarioError('INVALID_REQUEST', 'Input note is too long.');
    if (input.professionalInputId !== undefined && input.professionalInputId !== null && (typeof input.professionalInputId !== 'string' || !input.professionalInputId.trim())) throw new SellerFinancialScenarioError('INVALID_REQUEST', 'professionalInputId is invalid.');
    return Object.freeze({ key: input.key, state: input.state, amountCents: input.state === 'VALUE' ? integerCents(input.amountCents, input.key) : null, sourceClass: input.sourceClass, note: typeof input.note === 'string' ? input.note.trim() || null : null, professionalInputId: typeof input.professionalInputId === 'string' ? input.professionalInputId : null });
  });
  if (!keys.has('SALE_PRICE') || !keys.has('PAYOFF')) throw new SellerFinancialScenarioError('INVALID_REQUEST', 'Sale price and payoff are required inputs.');
  return Object.freeze({ scenarioKey: record.scenarioKey.trim(), inputs, supersedesScenarioId: typeof record.supersedesScenarioId === 'string' ? record.supersedesScenarioId : null, review: record.review === true });
}

export function calculateSellerFinancialScenario(inputs: readonly SellerFinancialInput[]) {
  const map = new Map(inputs.map((input) => [input.key, input]));
  const missing = SELLER_FINANCIAL_INPUT_KEYS.filter((key) => SELLER_FINANCIAL_INPUT_REGISTRY[key].required && map.get(key)?.state !== 'VALUE');
  const optionalUnknown = SELLER_FINANCIAL_INPUT_KEYS.filter((key) => !SELLER_FINANCIAL_INPUT_REGISTRY[key].required && map.get(key)?.state === 'UNKNOWN');
  if (missing.length) return Object.freeze({ state: 'INCOMPLETE_ESTIMATE' as const, missingInputs: missing, optionalUnknownInputs: optionalUnknown, grossSalePriceCents: null, estimatedPayoffCents: null, totalEstimatedSellerCostsCents: null, estimatedNetProceedsCents: null, netProceedsBasisPoints: null, includedCostKeys: [] as readonly SellerFinancialInputKey[] });
  const salePrice = map.get('SALE_PRICE')!.amountCents!;
  const payoff = map.get('PAYOFF')!.amountCents!;
  const costKeys = SELLER_FINANCIAL_INPUT_KEYS.filter((key) => key !== 'SALE_PRICE' && key !== 'PAYOFF' && map.get(key)?.state === 'VALUE');
  const costs = costKeys.reduce((sum, key) => sum + (map.get(key)?.amountCents ?? 0), 0);
  const net = salePrice - payoff - costs;
  const basisPoints = salePrice === 0 ? null : Math.round((net * 10_000) / salePrice);
  return Object.freeze({ state: 'ESTIMATED' as const, missingInputs: [] as readonly SellerFinancialInputKey[], optionalUnknownInputs: optionalUnknown, grossSalePriceCents: salePrice, estimatedPayoffCents: payoff, totalEstimatedSellerCostsCents: costs, estimatedNetProceedsCents: net, netProceedsBasisPoints: basisPoints, includedCostKeys: costKeys });
}

function qualification(inputs: readonly SellerFinancialInput[]) { return inputs.map(({ key, state, sourceClass, professionalInputId }) => ({ key, state, sourceClass, professionalInputId: professionalInputId ?? null })); }

export function createSellerFinancialScenarioService(prisma: SellerFinancialDatabase) {
  async function listOwned(ownerAgentSubject: string) {
    const owner = ownerScope(ownerAgentSubject);
    return prisma.sellerFinancialScenario.findMany({ where: { ownerAgentSubject: owner }, include: { results: true, auditEvents: true }, orderBy: [{ createdAt: 'desc' }] });
  }

  async function createScenario(ownerAgentSubject: string, request: SellerFinancialScenarioRequest) {
    const owner = ownerScope(ownerAgentSubject);
    const input = validateSellerFinancialScenarioRequest(request);
    const professionalIds = input.inputs.filter((item) => item.sourceClass === 'PROFESSIONAL_INPUT').map((item) => item.professionalInputId).filter(Boolean) as string[];
    if (input.inputs.some((item) => item.sourceClass === 'PROFESSIONAL_INPUT' && !item.professionalInputId)) throw new SellerFinancialScenarioError('INVALID_REQUEST', 'Professional inputs require an exact ProfessionalInput reference.');
    return prisma.$transaction(async (tx: SellerFinancialDatabase) => {
      const professionalInputs = professionalIds.length ? await tx.professionalInput.findMany({ where: { id: { in: professionalIds }, ownerAgentSubject: owner }, include: { evidenceAdmission: { include: { supersededByAdmission: { select: { id: true } } } } } }) : [];
      if (professionalInputs.length !== professionalIds.length) throw new SellerFinancialScenarioError('OWNERSHIP_DENIED', 'A referenced professional input is unavailable.');
      const now = new Date();
      for (const professional of professionalInputs) {
        if (professional.claimKind !== 'PAYOFF_AMOUNT' || professional.expiresAt && professional.expiresAt <= now || professional.evidenceAdmission.supersededByAdmission) throw new SellerFinancialScenarioError('CURRENT_INPUT_REQUIRED', 'The referenced payoff is not a current professional input.');
      }
      const resolvedInputs = input.inputs.map((item) => item.sourceClass === 'PROFESSIONAL_INPUT' ? Object.freeze({ ...item, amountCents: integerCents((professionalInputs.find((professional: any) => professional.id === item.professionalInputId)?.value as any)?.amount, 'PAYOFF') }) : item);
      const calculated = calculateSellerFinancialScenario(resolvedInputs);
      const scenarioFingerprint = fingerprint({ owner, scenarioKey: input.scenarioKey, contract: SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1, inputs: resolvedInputs, supersedesScenarioId: input.supersedesScenarioId });
      const existing = await tx.sellerFinancialScenario.findFirst({ where: { scenarioFingerprint }, include: { results: true } });
      if (existing) return Object.freeze({ scenario: existing, result: existing.results[0] ?? null, created: false });
      if (input.supersedesScenarioId) {
        const superseded = await tx.sellerFinancialScenario.findFirst({ where: { id: input.supersedesScenarioId, ownerAgentSubject: owner } });
        if (!superseded) throw new SellerFinancialScenarioError('NOT_FOUND', 'The scenario being succeeded is unavailable.');
      }
      const count = await tx.sellerFinancialScenario.count({ where: { ownerAgentSubject: owner, scenarioKey: input.scenarioKey } });
      const scenario = await tx.sellerFinancialScenario.create({ data: { ownerAgentSubject: owner, scenarioKey: input.scenarioKey, versionOrdinal: count + 1, lifecycleState: input.review ? 'REVIEWED' : 'DRAFT', calculationContract: SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1, inputSnapshot: resolvedInputs, sourceQualification: qualification(resolvedInputs), professionalInputRefs: professionalInputs.map((item: any) => ({ id: item.id, versionOrdinal: item.versionOrdinal, evidenceAdmissionId: item.evidenceAdmissionId, verificationStatus: (item.provenance as any)?.verificationStatus ?? 'UNVERIFIED' })), scenarioFingerprint, supersedesScenarioId: input.supersedesScenarioId, reviewedAt: input.review ? now : null } });
      const resultPayload = { ...calculated, calculationContract: SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1, qualifier: 'ESTIMATED', asOf: now.toISOString() };
      const result = await tx.sellerFinancialResult.create({ data: { scenarioId: scenario.id, ownerAgentSubject: owner, calculationContract: SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1, resultPayload, resultFingerprint: fingerprint({ scenarioId: scenario.id, resultPayload }) } });
      await tx.sellerFinancialAuditEvent.createMany({ data: [
        { scenarioId: scenario.id, ownerAgentSubject: owner, eventType: 'SCENARIO_CREATED', eventFingerprint: fingerprint({ scenarioId: scenario.id, event: 'SCENARIO_CREATED' }) },
        { scenarioId: scenario.id, ownerAgentSubject: owner, eventType: 'RESULT_MATERIALIZED', eventFingerprint: fingerprint({ scenarioId: scenario.id, event: 'RESULT_MATERIALIZED' }) },
        ...(input.review ? [{ scenarioId: scenario.id, ownerAgentSubject: owner, eventType: 'SCENARIO_REVIEWED', eventFingerprint: fingerprint({ scenarioId: scenario.id, event: 'SCENARIO_REVIEWED' }) }] : []),
      ] });
      return Object.freeze({ scenario, result, created: true });
    });
  }
  return Object.freeze({ listOwned, createScenario });
}
