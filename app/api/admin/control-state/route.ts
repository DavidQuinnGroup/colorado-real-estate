import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { assertPublicRuntimeSchema } from '@/lib/runtime/publicSchemaSafety';

export const dynamic = 'force-dynamic';

type ControlMode = 'ops' | 'monitor' | 'paused';

type ControlState = {
  strategyGate: number;
  areaCloud: boolean;
  privateLayer: boolean;
  killSwitchActive: boolean;
  mode: ControlMode;
  updatedBy: string;
  updatedAt: string;
};

type ControlPolicy = {
  automation: 'live' | 'monitor' | 'paused';
  publicExposure: 'open' | 'guided' | 'protected';
  mapPrecision: 'exact' | 'area-cloud';
  privateLayer: 'hidden' | 'visible';
  warnings: string[];
};

type ControlStateResponse = {
  success: true;
  generatedAt: string;
  terminal: 'Terminal 5';
  route: '/api/admin/control-state';
  command: string;
  state: ControlState;
  policy: ControlPolicy;
  source: 'database' | 'default';
  auth: {
    configured: boolean;
  };
};

type ControlStateRequestBody = {
  strategyGate?: unknown;
  areaCloud?: unknown;
  privateLayer?: unknown;
  killSwitchActive?: unknown;
  mode?: unknown;
  updatedBy?: unknown;
};

const CONTROL_STATE_KEY = 'master-control-panel';
const MIN_STRATEGY_GATE = 0;
const MAX_STRATEGY_GATE = 100;
const MAX_UPDATED_BY_LENGTH = 120;
const LOCAL_BASE_URL = 'http://localhost:3000';
const ROUTE = '/api/admin/control-state';
const TERMINAL = 'Terminal 5';

function getAdminKey() {
  return process.env.REIE_ADMIN_API_KEY || process.env.ADMIN_API_KEY || null;
}

function getRequestAdminKey(request: NextRequest) {
  const authorization = request.headers.get('authorization') || '';
  const bearerToken = authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7).trim() : '';
  return request.headers.get('x-admin-key') || bearerToken || '';
}

function authorizeRequest(request: NextRequest) {
  const configuredKey = getAdminKey();

  if (!configuredKey) {
    return process.env.NODE_ENV !== 'production';
  }

  return getRequestAdminKey(request) === configuredKey;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error || 'Unknown control-state failure.');
}

function getInspectionCommand(request: NextRequest) {
  const method = request.method.toUpperCase();
  const methodFlag = method === 'GET' ? '' : ` -X ${method}`;
  const searchParams = new URLSearchParams(request.nextUrl.searchParams);
  searchParams.delete('adminKey');
  const search = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const bodyHint =
    method === 'GET'
      ? ''
      : ` -H "Content-Type: application/json" -d '{"mode":"paused","updatedBy":"terminal-5"}'`;

  return `curl --max-time 8 -s${methodFlag} "${LOCAL_BASE_URL}${ROUTE}${search}" -H "x-admin-key: $REIE_ADMIN_API_KEY"${bodyHint}`;
}

function getInspectionMetadata(request: NextRequest) {
  return {
    generatedAt: new Date().toISOString(),
    terminal: TERMINAL,
    route: ROUTE,
    command: getInspectionCommand(request),
  } as const;
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toBoolean(value: unknown, fallback: boolean) {
  if (value === true || value === 'true' || value === '1' || value === 'yes') return true;
  if (value === false || value === 'false' || value === '0' || value === 'no') return false;
  return fallback;
}

function toCleanString(value: unknown, fallback: string) {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function toBoundedCleanString(value: unknown, fallback: string, maxLength: number) {
  const text = toCleanString(value, fallback);
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function toMode(value: unknown, fallback: ControlMode) {
  if (value === 'ops' || value === 'monitor' || value === 'paused') return value;
  return fallback;
}

function getDefaultState(): ControlState {
  return {
    strategyGate: 60,
    areaCloud: true,
    privateLayer: false,
    killSwitchActive: false,
    mode: 'ops',
    updatedBy: 'system-default',
    updatedAt: new Date().toISOString(),
  };
}

function normalizeState(value: unknown, fallback = getDefaultState()): ControlState {
  const candidate = typeof value === 'object' && value !== null ? (value as Partial<ControlState>) : {};
  const rawStrategyGate = Number(candidate.strategyGate);

  return {
    strategyGate: Number.isFinite(rawStrategyGate) ? clampNumber(Math.round(rawStrategyGate), MIN_STRATEGY_GATE, MAX_STRATEGY_GATE) : fallback.strategyGate,
    areaCloud: toBoolean(candidate.areaCloud, fallback.areaCloud),
    privateLayer: toBoolean(candidate.privateLayer, fallback.privateLayer),
    killSwitchActive: toBoolean(candidate.killSwitchActive, fallback.killSwitchActive),
    mode: toMode(candidate.mode, fallback.mode),
    updatedBy: toBoundedCleanString(candidate.updatedBy, fallback.updatedBy, MAX_UPDATED_BY_LENGTH),
    updatedAt: toCleanString(candidate.updatedAt, fallback.updatedAt),
  };
}

function mergeState(currentState: ControlState, body: ControlStateRequestBody): ControlState {
  const rawStrategyGate = body.strategyGate === undefined ? currentState.strategyGate : Number(body.strategyGate);
  const strategyGate = Number.isFinite(rawStrategyGate)
    ? clampNumber(Math.round(rawStrategyGate), MIN_STRATEGY_GATE, MAX_STRATEGY_GATE)
    : currentState.strategyGate;

  return {
    strategyGate,
    areaCloud: toBoolean(body.areaCloud, currentState.areaCloud),
    privateLayer: toBoolean(body.privateLayer, currentState.privateLayer),
    killSwitchActive: toBoolean(body.killSwitchActive, currentState.killSwitchActive),
    mode: toMode(body.mode, currentState.mode),
    updatedBy: toBoundedCleanString(body.updatedBy, 'admin', MAX_UPDATED_BY_LENGTH),
    updatedAt: new Date().toISOString(),
  };
}

function getPublicExposure(strategyGate: number): ControlPolicy['publicExposure'] {
  if (strategyGate >= 70) return 'protected';
  if (strategyGate >= 35) return 'guided';
  return 'open';
}

function getAutomationMode(state: ControlState): ControlPolicy['automation'] {
  if (state.killSwitchActive || state.mode === 'paused') return 'paused';
  if (state.mode === 'monitor') return 'monitor';
  return 'live';
}

function buildControlPolicy(state: ControlState): ControlPolicy {
  const automation = getAutomationMode(state);
  const publicExposure = getPublicExposure(state.strategyGate);
  const warnings = [
    state.killSwitchActive ? 'Kill switch is active; public automation should remain paused.' : null,
    state.mode === 'paused' ? 'Control mode is paused.' : null,
    !state.areaCloud ? 'Area-cloud masking is off; public map pins may be more precise.' : null,
    state.privateLayer ? 'Private client layer is visible in the admin state.' : null,
  ].filter((warning): warning is string => Boolean(warning));

  return {
    automation,
    publicExposure,
    mapPrecision: state.areaCloud ? 'area-cloud' : 'exact',
    privateLayer: state.privateLayer ? 'visible' : 'hidden',
    warnings,
  };
}

function getControlStateEnvelope(request: NextRequest, state: ControlState, source: 'database' | 'default') {
  return {
    ...getInspectionMetadata(request),
    state,
    policy: buildControlPolicy(state),
    source,
    auth: {
      configured: Boolean(getAdminKey()),
    },
  } as const;
}

async function assertControlStateSchema() {
  await assertPublicRuntimeSchema(prisma, [
    { tableName: 'REIEControlState', columns: ['key', 'state', 'createdAt', 'updatedAt'] },
  ]);
}

async function readControlState() {
  await assertControlStateSchema();

  const record = await prisma.rEIEControlState.findUnique({
    where: {
      key: CONTROL_STATE_KEY,
    },
    select: {
      state: true,
    },
  });

  if (!record) {
    return {
      state: getDefaultState(),
      source: 'default' as const,
    };
  }

  return {
    state: normalizeState(record.state),
    source: 'database' as const,
  };
}

async function saveControlState(state: ControlState) {
  await assertControlStateSchema();

  await prisma.rEIEControlState.upsert({
    where: {
      key: CONTROL_STATE_KEY,
    },
    create: {
      key: CONTROL_STATE_KEY,
      state: state as Prisma.InputJsonValue,
    },
    update: {
      state: state as Prisma.InputJsonValue,
    },
  });
}

function unauthorizedResponse(request: NextRequest) {
  const state = getDefaultState();

  return NextResponse.json(
    {
      success: false,
      error: 'Admin access is required.',
      ...getControlStateEnvelope(request, state, 'default'),
    },
    { status: 401 },
  );
}

export async function GET(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return unauthorizedResponse(request);
  }

  try {
    const { state, source } = await readControlState();

    return NextResponse.json({
      success: true,
      ...getControlStateEnvelope(request, state, source),
    } satisfies ControlStateResponse);
  } catch (error) {
    console.error('[REIE CONTROL STATE] Read failed:', getErrorMessage(error));
    const fallback = getDefaultState();

    return NextResponse.json(
      {
        success: false,
        error: 'Control state could not be read.',
        detail: getErrorMessage(error),
        ...getControlStateEnvelope(request, fallback, 'default'),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  if (!authorizeRequest(request)) {
    return unauthorizedResponse(request);
  }

  try {
    const body = (await request.json().catch(() => ({}))) as ControlStateRequestBody;
    const current = await readControlState();
    const state = mergeState(current.state, body);

    await saveControlState(state);

    return NextResponse.json({
      success: true,
      ...getControlStateEnvelope(request, state, 'database'),
    } satisfies ControlStateResponse);
  } catch (error) {
    console.error('[REIE CONTROL STATE] Save failed:', getErrorMessage(error));
    const fallback = getDefaultState();

    return NextResponse.json(
      {
        success: false,
        error: 'Control state could not be saved.',
        detail: getErrorMessage(error),
        ...getControlStateEnvelope(request, fallback, 'default'),
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  return POST(request);
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/control-state/route.ts
