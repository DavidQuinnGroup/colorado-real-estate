import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { AdvancedReturnError } from '@/lib/advancedInvestmentReturnAnalysis';
import { buildAdvancedReturnOutputFixture, AdvancedReturnOutputError } from '@/lib/advancedInvestmentReturnOutputPersistence';
import { createAdvancedInvestmentReturnService, AdvancedReturnServiceError } from '@/lib/advancedInvestmentReturnService';
import { createInvestmentBreakevenService, InvestmentBreakevenError } from '@/lib/investmentBreakevenAnalysis';
import { createStrategySuiteService, StrategySuiteError, type StrategyProfile } from '@/lib/multiDimensionalStrategySuite';
import { createOutputPersistenceService, OutputPersistenceError } from '@/lib/outputPersistenceFoundation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; export const revalidate = 0; export const runtime = 'nodejs';
const ROUTE = '/api/agent/advanced-investment-return';
const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const auth = await authorizeAdminRequest(request, { pathname: ROUTE, method });
  return auth.authenticated && auth.identityType === 'HUMAN_AGENT' && auth.role === 'AGENT' && auth.mechanism === 'HUMAN_AGENT_SESSION' && auth.subject && (method === 'GET' || auth.canMutate && isSameOriginAdminRequest(request)) ? auth.subject : null;
}

function errorResponse(error: unknown) {
  if (error instanceof AdvancedReturnServiceError || error instanceof AdvancedReturnOutputError || error instanceof InvestmentBreakevenError || error instanceof StrategySuiteError || error instanceof AdvancedReturnError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.code === 'NOT_FOUND' ? 404 : error.code === 'OWNERSHIP_DENIED' ? 403 : 400, headers: HEADERS });
  }
  if (error instanceof OutputPersistenceError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.code === 'OWNERSHIP_DENIED' ? 403 : 400, headers: HEADERS });
  return NextResponse.json({ error: 'Advanced Return Analysis is unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}

function investmentProperty(property: Record<string, unknown>) {
  const price = Number(property.purchasePriceCents);
  const down = Number(property.downPaymentCents);
  return {
    role: property.role, label: property.label, canonicalPropertyId: null, startingValueCents: price, startingLoanBalanceCents: price - down,
    initialCashInvestedCents: down + Number(property.closingCostsCents ?? 0), monthlyRentCents: Number(property.monthlyRentCents ?? 0), vacancyBasisPoints: Number(property.vacancyBasisPoints ?? 0), managementBasisPoints: Number(property.managementBasisPoints ?? 0), monthlyTaxesCents: Number(property.monthlyTaxesCents ?? 0), monthlyInsuranceCents: Number(property.monthlyInsuranceCents ?? 0), monthlyHoaCents: Number(property.monthlyHoaCents ?? 0), monthlyMaintenanceCents: Number(property.monthlyMaintenanceCents ?? 0), monthlyCapexReserveCents: Number(property.monthlyCapexReserveCents ?? 0), annualRateBasisPoints: Number(property.annualRateBasisPoints ?? 0), remainingLoanTermMonths: Number(property.loanTermMonths ?? 360), monthlyMortgageInsuranceCents: Number(property.monthlyMortgageInsuranceCents ?? 0), monthlyDebtPaymentCents: null, debtModel: 'EXACT_FIXED_RATE', qualification: property.qualification,
  };
}

async function syntheticInvestmentSource(owner: string) {
  const outcome = await createInvestmentBreakevenService(prisma).createScenario(owner, {
    analysisKey: 'ATLAS_SYNTHETIC_ADVANCED_RETURN_SOURCE_V1', analysisTitle: 'ATLAS Synthetic Advanced Return Source', analysisPurpose: 'Internal synthetic source for Advanced Return certification only.', scenarioKey: 'ATLAS_SYNTHETIC_INVESTMENT_HOLDING_PERIOD', review: true,
    properties: [{ role: 'INVESTMENT_PROPERTY', label: 'ATLAS Synthetic Investment Property', purchasePriceCents: 40000000, downPaymentCents: 8000000, closingCostsCents: 700000, monthlyTaxesCents: 40000, monthlyInsuranceCents: 16000, monthlyHoaCents: 15000, monthlyRentCents: 320000, vacancyBasisPoints: 500, managementBasisPoints: 800, monthlyMaintenanceCents: 15000, monthlyCapexReserveCents: 12000, annualRateBasisPoints: 675, loanTermMonths: 360, monthlyMortgageInsuranceCents: 0, qualification: 'SYNTHETIC_CERTIFICATION' }],
  });
  if (!outcome.result) throw new AdvancedReturnServiceError('PERSISTENCE_UNAVAILABLE', 'The immutable Investment source result is unavailable.');
  const input = outcome.scenario.inputSnapshot as unknown as Record<string, unknown>;
  const property = (input.properties as Record<string, unknown>[])[0];
  return { sourceKind: 'INVESTMENT_SCENARIO' as const, sourceArtifactId: outcome.scenario.id, sourceResultId: outcome.result.id, sourceInputFingerprint: outcome.scenario.inputFingerprint, properties: [investmentProperty(property)] };
}

async function syntheticProperty(label: string) {
  const normalized = `atlas-synthetic-advanced-return-${label.toLowerCase().replaceAll(' ', '-')}`;
  const found = await prisma.canonicalPhysicalProperty.findFirst({ where: { normalizedSitusAddress: normalized } });
  return found ?? prisma.canonicalPhysicalProperty.create({ data: { sourceFormattedSitusAddress: `ATLAS SYNTHETIC ${label}`, normalizedSitusAddress: normalized, city: 'Boulder', state: 'CO', postalCode: '80302', identityStatus: 'UNRESOLVED', identityConfidence: 'UNVERIFIED' } });
}

async function syntheticStrategySource(owner: string, profile: StrategyProfile) {
  const [existing, primary, investment] = await Promise.all([syntheticProperty('Existing Primary'), syntheticProperty('New Primary'), syntheticProperty('Investment Property')]);
  const keeping = profile.startsWith('KEEP_'); const hasInvestment = profile.endsWith('AND_INVESTMENT');
  const outcome = await createStrategySuiteService(prisma).createAlternative(owner, {
    analysisKey: 'ATLAS_SYNTHETIC_ADVANCED_RETURN_STRATEGY_SOURCE_V1', analysisTitle: 'ATLAS Synthetic Advanced Return Strategy Source', analysisPurpose: 'Internal synthetic source for Advanced Return certification only.', alternativeKey: `ATLAS_SYNTHETIC_ADVANCED_RETURN_${profile}`, strategyProfile: profile, additionalLiquidCapitalCents: 18000000, reserveTargetCents: 1500000, review: true,
    existing: { canonicalPropertyId: existing.id, label: 'ATLAS Synthetic Existing Primary', saleProceedsCents: 15000000, currentValueCents: 60000000, debtBalanceCents: 28000000, monthlyDebtPaymentCents: 210000, monthlyRentCents: keeping ? 310000 : 0, vacancyBasisPoints: 500, managementBasisPoints: 800, monthlyTaxesCents: 50000, monthlyInsuranceCents: 18000, monthlyHoaCents: 0, monthlyMaintenanceCents: 16000, monthlyCapexReserveCents: 14000, qualification: 'SYNTHETIC_CERTIFICATION', rentalPermissionStatus: 'NOT_VERIFIED', sellerFinancialResultId: null },
    acquisitionProperties: [{ canonicalPropertyId: primary.id, role: 'NEW_PRIMARY', label: 'ATLAS Synthetic New Primary', purchasePriceCents: 50000000, downPaymentCents: 10000000, closingCostsCents: 900000, monthlyTaxesCents: 55000, monthlyInsuranceCents: 18000, monthlyHoaCents: 0, monthlyRentCents: 0, vacancyBasisPoints: 0, managementBasisPoints: 0, monthlyMaintenanceCents: 0, monthlyCapexReserveCents: 0, annualRateBasisPoints: 650, loanTermMonths: 360, monthlyMortgageInsuranceCents: 0, qualification: 'SYNTHETIC_CERTIFICATION' }, ...(hasInvestment ? [{ canonicalPropertyId: investment.id, role: 'INVESTMENT_PROPERTY', label: 'ATLAS Synthetic Investment Property', purchasePriceCents: 40000000, downPaymentCents: 8000000, closingCostsCents: 700000, monthlyTaxesCents: 40000, monthlyInsuranceCents: 16000, monthlyHoaCents: 15000, monthlyRentCents: 320000, vacancyBasisPoints: 500, managementBasisPoints: 800, monthlyMaintenanceCents: 15000, monthlyCapexReserveCents: 12000, annualRateBasisPoints: 675, loanTermMonths: 360, monthlyMortgageInsuranceCents: 0, qualification: 'SYNTHETIC_CERTIFICATION' }] : [])],
  });
  const input = outcome.alternative.inputSnapshot as unknown as Record<string, unknown>;
  const existingInput = input.existing as Record<string, unknown>;
  const acquisitions = input.acquisitionProperties as Record<string, unknown>[];
  const properties = [
    ...(keeping ? [{ role: 'RETAINED_RENTAL', label: existingInput.label, canonicalPropertyId: existingInput.canonicalPropertyId, startingValueCents: existingInput.currentValueCents, startingLoanBalanceCents: existingInput.debtBalanceCents, initialCashInvestedCents: 0, monthlyRentCents: existingInput.monthlyRentCents, vacancyBasisPoints: existingInput.vacancyBasisPoints, managementBasisPoints: existingInput.managementBasisPoints, monthlyTaxesCents: existingInput.monthlyTaxesCents, monthlyInsuranceCents: existingInput.monthlyInsuranceCents, monthlyHoaCents: existingInput.monthlyHoaCents, monthlyMaintenanceCents: existingInput.monthlyMaintenanceCents, monthlyCapexReserveCents: existingInput.monthlyCapexReserveCents, annualRateBasisPoints: 0, remainingLoanTermMonths: 360, monthlyMortgageInsuranceCents: 0, monthlyDebtPaymentCents: existingInput.monthlyDebtPaymentCents, debtModel: 'PAYMENT_ONLY_NON_AMORTIZING', qualification: existingInput.qualification }] : []),
    ...acquisitions.map((property) => ({ ...investmentProperty(property), canonicalPropertyId: property.canonicalPropertyId })),
  ];
  const result = outcome.result;
  if (!result) throw new AdvancedReturnServiceError('PERSISTENCE_UNAVAILABLE', 'The immutable Strategy source result is unavailable.');
  return { sourceKind: 'STRATEGY_ALTERNATIVE' as const, sourceArtifactId: outcome.alternative.id, sourceResultId: result.id, sourceInputFingerprint: outcome.alternative.inputFingerprint, properties };
}

function projectionRequest(source: Awaited<ReturnType<typeof syntheticInvestmentSource>> | Awaited<ReturnType<typeof syntheticStrategySource>>, analysisProfile: 'SINGLE_INVESTMENT_HOLDING_PERIOD' | 'MULTI_DIMENSIONAL_STRATEGY_HOLDING_PERIOD', projectionKey: string) {
  return { analysisKey: analysisProfile === 'SINGLE_INVESTMENT_HOLDING_PERIOD' ? 'ATLAS_SYNTHETIC_ADVANCED_RETURN_ANALYSIS_V2' : 'ATLAS_SYNTHETIC_ADVANCED_RETURN_STRATEGY_ANALYSIS_V2', analysisTitle: 'ATLAS Synthetic Advanced Investment Return Analysis', analysisPurpose: 'Internal Agent holding-period decision-support certification only.', projectionKey, analysisProfile, ...source, horizonMonths: [12, 36, 60, 84, 120], appreciationBasisPoints: 300, rentGrowthBasisPoints: 200, expenseGrowthBasisPoints: 250, disposition: 'SELL_AT_HORIZON', dispositionCostBasisPoints: 600, discountRateBasisPoints: 800, supersedesProjectionId: null, review: true };
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET'); if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try { const [analyses, outputs] = await Promise.all([createAdvancedInvestmentReturnService(prisma).listOwned(subject), createOutputPersistenceService(prisma).listOwnedOutputHistory(subject)]); return NextResponse.json({ analyses, outputs }, { headers: HEADERS }); } catch (error) { return errorResponse(error); }
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST'); if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const body = await request.json() as Record<string, unknown>; const service = createAdvancedInvestmentReturnService(prisma);
    if (body.action === 'CREATE_SYNTHETIC_BASE') { const source = await syntheticInvestmentSource(subject); const outcome = await service.createProjection(subject, projectionRequest(source, 'SINGLE_INVESTMENT_HOLDING_PERIOD', 'ATLAS_SYNTHETIC_PROJECTION_A')); return NextResponse.json(outcome, { status: outcome.created ? 201 : 200, headers: HEADERS }); }
    if (body.action === 'CREATE_SYNTHETIC_STRATEGY') { const profile = body.profile as StrategyProfile; const source = await syntheticStrategySource(subject, profile); const outcome = await service.createProjection(subject, projectionRequest(source, 'MULTI_DIMENSIONAL_STRATEGY_HOLDING_PERIOD', `ATLAS_SYNTHETIC_${profile}`)); return NextResponse.json(outcome, { status: outcome.created ? 201 : 200, headers: HEADERS }); }
    if (body.action === 'CLONE_PROJECTION') { if (typeof body.sourceProjectionId !== 'string' || typeof body.projectionKey !== 'string') throw new AdvancedReturnServiceError('INVALID_REQUEST', 'sourceProjectionId and projectionKey are required.'); return NextResponse.json(await service.cloneProjection(subject, body.sourceProjectionId, body.projectionKey), { headers: HEADERS }); }
    if (body.action === 'UPDATE_ASSUMPTIONS') { if (typeof body.projectionId !== 'string' || !body.assumptions || typeof body.assumptions !== 'object' || Array.isArray(body.assumptions)) throw new AdvancedReturnServiceError('INVALID_REQUEST', 'projectionId and assumptions are required.'); const allowed = ['appreciationBasisPoints', 'rentGrowthBasisPoints', 'expenseGrowthBasisPoints', 'dispositionCostBasisPoints', 'discountRateBasisPoints', 'disposition', 'horizonMonths']; const patch = Object.fromEntries(Object.entries(body.assumptions as Record<string, unknown>).filter(([key]) => allowed.includes(key))); return NextResponse.json(await service.updateDraftAssumptions(subject, body.projectionId, patch), { headers: HEADERS }); }
    if (body.action === 'RECALCULATE') { if (typeof body.projectionId !== 'string') throw new AdvancedReturnServiceError('INVALID_REQUEST', 'projectionId is required.'); return NextResponse.json(await service.recalculateProjection(subject, body.projectionId), { headers: HEADERS }); }
    if (body.action === 'REVIEW') { if (typeof body.projectionId !== 'string') throw new AdvancedReturnServiceError('INVALID_REQUEST', 'projectionId is required.'); return NextResponse.json(await service.reviewProjection(subject, body.projectionId), { headers: HEADERS }); }
    if (body.action === 'SENSITIVITY') { if (typeof body.projectionId !== 'string' || !body.assumptions || typeof body.assumptions !== 'object' || Array.isArray(body.assumptions)) throw new AdvancedReturnServiceError('INVALID_REQUEST', 'projectionId and assumptions are required.'); return NextResponse.json(await service.sensitivity(subject, body.projectionId, body.assumptions as Record<string, unknown>), { headers: HEADERS }); }
    if (body.action === 'PERSIST_OUTPUT') { if (typeof body.projectionId !== 'string') throw new AdvancedReturnServiceError('INVALID_REQUEST', 'projectionId is required.'); const fixture = await buildAdvancedReturnOutputFixture(prisma, subject, body.projectionId); const output = await createOutputPersistenceService(prisma).persistReviewedFixture(subject, fixture, 'Advanced Return holding-period analysis reviewed in Agent workspace.'); return NextResponse.json({ output }, { status: output.created ? 201 : 200, headers: HEADERS }); }
    throw new AdvancedReturnServiceError('INVALID_REQUEST', 'Unsupported Advanced Return action.');
  } catch (error) { return errorResponse(error); }
}
