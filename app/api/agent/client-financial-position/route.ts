import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest, isSameOriginAdminRequest } from '@/lib/admin/adminAuth';
import { ClientFinancialPositionError, createClientFinancialPositionService } from '@/lib/clientFinancialPositionFoundation';
import { createClientFinancialPositionPresentationService, type FinancialPositionDomain } from '@/lib/clientFinancialPositionPresentation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const CLIENT_FINANCIAL_POSITION_API_ROUTE = '/api/agent/client-financial-position';
const HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };
const DOMAINS = new Set<FinancialPositionDomain>(['ASSET', 'LIABILITY', 'INCOME', 'QUALIFICATION', 'CONSTRAINT']);

function object(value: unknown, field: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} is invalid.`);
  return value as Record<string, unknown>;
}

function dollarsToCents(value: unknown, field: string) {
  if (value === undefined || value === null || value === '') return null;
  const text = typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim().replace(/^\$/, '').replaceAll(',', '') : '';
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} must be a nonnegative dollar amount with no more than two decimal places.`);
  const [whole, fraction = ''] = text.split('.');
  const parsed = BigInt(whole) * BigInt(100) + BigInt((fraction + '00').slice(0, 2));
  if (parsed > BigInt(Number.MAX_SAFE_INTEGER)) throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} is outside the supported range.`);
  return Number(parsed);
}

function percentToBps(value: unknown, field: string) {
  if (value === undefined || value === null || value === '') return null;
  const text = typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim().replace(/%$/, '') : '';
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} must be a nonnegative percentage with no more than two decimal places.`);
  const [whole, fraction = ''] = text.split('.');
  const parsed = BigInt(whole) * BigInt(100) + BigInt((fraction + '00').slice(0, 2));
  if (parsed > BigInt(Number.MAX_SAFE_INTEGER)) throw new ClientFinancialPositionError('INVALID_REQUEST', `${field} is outside the supported range.`);
  return Number(parsed);
}

function normalizeObservation(value: unknown, domain: FinancialPositionDomain) {
  const input = object(value, 'observation');
  const next: Record<string, unknown> = { ...input };
  if (domain === 'ASSET') ['marketValueCents', 'liquidValueCents', 'availableAmountCents'].forEach((field) => { next[field] = dollarsToCents(input[field], field); });
  if (domain === 'LIABILITY') {
    ['currentBalanceCents', 'monthlyObligationCents'].forEach((field) => { next[field] = dollarsToCents(input[field], field); });
    next.rateBps = percentToBps(input.rateBps, 'rateBps');
  }
  if (domain === 'INCOME') next.amountCents = dollarsToCents(input.amountCents, 'amountCents');
  if (domain === 'QUALIFICATION') {
    ['maximumLoanAmountCents', 'maximumPurchaseAmountCents'].forEach((field) => { next[field] = dollarsToCents(input[field], field); });
    next.rateBps = percentToBps(input.rateBps, 'rateBps');
  }
  if (domain === 'CONSTRAINT') next.amountCents = dollarsToCents(input.amountCents, 'amountCents');
  return next;
}

async function subjectFor(request: NextRequest, method: 'GET' | 'POST') {
  const authorization = await authorizeAdminRequest(request, { pathname: CLIENT_FINANCIAL_POSITION_API_ROUTE, method });
  return authorization.authenticated
    && authorization.identityType === 'HUMAN_AGENT'
    && authorization.role === 'AGENT'
    && authorization.mechanism === 'HUMAN_AGENT_SESSION'
    && authorization.subject
    && (method === 'GET' || (authorization.canMutate && isSameOriginAdminRequest(request)))
    ? authorization.subject
    : null;
}

function errorResponse(error: unknown) {
  if (error instanceof ClientFinancialPositionError) {
    const status = error.code === 'NOT_FOUND' ? 404 : error.code === 'CONFLICT' ? 409 : 400;
    return NextResponse.json({ error: error.message, code: error.code }, { status, headers: HEADERS });
  }
  return NextResponse.json({ error: 'Financial Position is unavailable.', code: 'PERSISTENCE_UNAVAILABLE' }, { status: 503, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const subject = await subjectFor(request, 'GET');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const clientCaseId = request.nextUrl.searchParams.get('clientCaseId');
    if (!clientCaseId) throw new ClientFinancialPositionError('INVALID_REQUEST', 'clientCaseId is required.');
    const historyDomain = request.nextUrl.searchParams.get('historyDomain');
    const entityId = request.nextUrl.searchParams.get('entityId');
    const presentation = createClientFinancialPositionPresentationService(prisma);
    if (historyDomain || entityId) {
      if (!historyDomain || !entityId || !DOMAINS.has(historyDomain as FinancialPositionDomain)) throw new ClientFinancialPositionError('INVALID_REQUEST', 'A valid history domain and entity are required.');
      return NextResponse.json({ history: await presentation.history(subject, clientCaseId, historyDomain as FinancialPositionDomain, entityId) }, { headers: HEADERS });
    }
    const workspace = await presentation.load(subject, clientCaseId);
    if (!workspace) throw new ClientFinancialPositionError('NOT_FOUND', 'The Client Case is unavailable to this Agent.');
    return NextResponse.json(workspace, { headers: HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}

async function financialSourceIdFor(service: ReturnType<typeof createClientFinancialPositionService>, subject: string, clientCaseId: string, governedSourceId: unknown) {
  if (governedSourceId === undefined || governedSourceId === null || governedSourceId === '') return null;
  const binding = await service.bindFinancialSource(subject, clientCaseId, { clientCaseGovernedSourceId: governedSourceId });
  return binding.id;
}

export async function POST(request: NextRequest) {
  const subject = await subjectFor(request, 'POST');
  if (!subject) return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: HEADERS });
  try {
    const body = object(await request.json(), 'request');
    if (typeof body.clientCaseId !== 'string') throw new ClientFinancialPositionError('INVALID_REQUEST', 'clientCaseId is required.');
    const service = createClientFinancialPositionService(prisma);
    const create = async (domain: FinancialPositionDomain) => {
      const input = object(body.input, 'input');
      const payload = { ...input, observation: normalizeObservation(input.observation, domain) };
      if (domain === 'ASSET') return service.createAssetWithInitialObservation(subject, body.clientCaseId as string, payload);
      if (domain === 'LIABILITY') return service.createLiabilityWithInitialObservation(subject, body.clientCaseId as string, payload);
      if (domain === 'INCOME') return service.createIncomeWithInitialObservation(subject, body.clientCaseId as string, payload);
      if (domain === 'QUALIFICATION') return service.createQualificationWithInitialObservation(subject, body.clientCaseId as string, payload);
      return service.createConstraintWithInitialObservation(subject, body.clientCaseId as string, payload);
    };
    const update = async (domain: FinancialPositionDomain, entityField: string) => {
      const entityId = body[entityField];
      if (typeof entityId !== 'string') throw new ClientFinancialPositionError('INVALID_REQUEST', `${entityField} is required.`);
      const input = object(body.input, 'input');
      const normalized = normalizeObservation(input, domain);
      const financialSourceId = await financialSourceIdFor(service, subject, body.clientCaseId as string, input.clientCaseGovernedSourceId);
      delete normalized.clientCaseGovernedSourceId;
      normalized.financialSourceId = financialSourceId;
      if (domain === 'ASSET') return service.recordAssetObservation(subject, body.clientCaseId as string, entityId, normalized);
      if (domain === 'LIABILITY') return service.recordLiabilityObservation(subject, body.clientCaseId as string, entityId, normalized);
      if (domain === 'INCOME') return service.recordIncomeObservation(subject, body.clientCaseId as string, entityId, normalized);
      if (domain === 'QUALIFICATION') return service.recordQualificationObservation(subject, body.clientCaseId as string, entityId, normalized);
      return service.recordConstraintObservation(subject, body.clientCaseId as string, entityId, normalized);
    };
    let result: unknown;
    if (body.action === 'CREATE_ASSET') result = await create('ASSET');
    else if (body.action === 'CREATE_LIABILITY') result = await create('LIABILITY');
    else if (body.action === 'CREATE_INCOME') result = await create('INCOME');
    else if (body.action === 'CREATE_QUALIFICATION') result = await create('QUALIFICATION');
    else if (body.action === 'CREATE_CONSTRAINT') result = await create('CONSTRAINT');
    else if (body.action === 'UPDATE_ASSET') result = await update('ASSET', 'assetId');
    else if (body.action === 'UPDATE_LIABILITY') result = await update('LIABILITY', 'liabilityId');
    else if (body.action === 'UPDATE_INCOME') result = await update('INCOME', 'incomeId');
    else if (body.action === 'UPDATE_QUALIFICATION') result = await update('QUALIFICATION', 'qualificationId');
    else if (body.action === 'UPDATE_CONSTRAINT') result = await update('CONSTRAINT', 'constraintId');
    else throw new ClientFinancialPositionError('INVALID_REQUEST', 'Unsupported Financial Position action.');
    const workspace = await createClientFinancialPositionPresentationService(prisma).load(subject, body.clientCaseId);
    return NextResponse.json({ result, workspace }, { headers: HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}
