import {
  evaluateReieCapabilityVisibilityPolicy,
  type ReieCapabilityVisibilityPolicyInput,
  type ReieCapabilityVisibilityPolicyResult,
} from './reieCapabilityVisibilityPolicy.js';

export const REIE_CONTROL_STATE_VISIBILITY_ADAPTER_VERSION = 'REIE_MODULE_10_CONTROL_ADAPTER_V1' as const;

export const REIE_CONTROL_STATE_SEMANTIC_CLASSIFICATIONS = {
  killSwitchActive: 'CANONICAL_SAFETY_CONTROL',
  mode: 'CANONICAL_OPERATIONAL_CONTROL',
  strategyGate: 'LEGACY_CONTROL_HINT_ONLY',
  areaCloud: 'LEGACY_MAP_PRECISION_HINT_ONLY',
  privateLayer: 'LEGACY_LAYER_HINT_ONLY',
  publicExposure: 'DERIVED_LEGACY_POLICY_HINT_ONLY',
  mapPrecision: 'DERIVED_LEGACY_POLICY_HINT_ONLY',
} as const;

export type ReieControlStateMode = 'ops' | 'monitor' | 'paused';
export type ReieControlStatePublicExposure = 'open' | 'guided' | 'protected';
export type ReieControlStateMapPrecision = 'exact' | 'area-cloud';

export type ReieControlStateVisibilityInput = Readonly<{
  strategyGate: number;
  areaCloud: boolean;
  privateLayer: boolean;
  killSwitchActive: boolean;
  mode: ReieControlStateMode;
  publicExposure: ReieControlStatePublicExposure;
  mapPrecision: ReieControlStateMapPrecision;
  policy: Omit<ReieCapabilityVisibilityPolicyInput, 'killSwitchActive'>;
}>;

export type ReieControlStateLegacyPosture = Readonly<{
  strategyGate: number;
  areaCloud: boolean;
  privateLayer: boolean;
  mode: ReieControlStateMode;
  publicExposure: ReieControlStatePublicExposure;
  mapPrecision: ReieControlStateMapPrecision;
  strategyGateCanAuthorize: false;
  areaCloudCanAuthorize: false;
  privateLayerCanAuthorize: false;
  publicExposureCanAuthorize: false;
  mapPrecisionCanAuthorize: false;
}>;

export type ReieControlStateVisibilityAdaptation = Readonly<{
  classification: 'VALID_CONTROL_STATE_ADAPTATION' | 'FAIL_CLOSED';
  policyResult: ReieCapabilityVisibilityPolicyResult | null;
  legacyPosture: ReieControlStateLegacyPosture | null;
  reasons: readonly string[];
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

function isMode(value: unknown): value is ReieControlStateMode {
  return value === 'ops' || value === 'monitor' || value === 'paused';
}

function isPublicExposure(value: unknown): value is ReieControlStatePublicExposure {
  return value === 'open' || value === 'guided' || value === 'protected';
}

function isMapPrecision(value: unknown): value is ReieControlStateMapPrecision {
  return value === 'exact' || value === 'area-cloud';
}

function validateControlState(input: unknown): readonly string[] {
  if (!isRecord(input)) return ['CONTROL_STATE_INPUT_INVALID'];
  const reasons: string[] = [];
  if (typeof input.strategyGate !== 'number' || !Number.isFinite(input.strategyGate) || input.strategyGate < 0 || input.strategyGate > 100) reasons.push('CONTROL_STATE_STRATEGY_GATE_INVALID');
  if (typeof input.areaCloud !== 'boolean') reasons.push('CONTROL_STATE_AREA_CLOUD_INVALID');
  if (typeof input.privateLayer !== 'boolean') reasons.push('CONTROL_STATE_PRIVATE_LAYER_INVALID');
  if (typeof input.killSwitchActive !== 'boolean') reasons.push('CONTROL_STATE_KILL_SWITCH_INVALID');
  if (!isMode(input.mode)) reasons.push('CONTROL_STATE_MODE_INVALID');
  if (!isPublicExposure(input.publicExposure)) reasons.push('CONTROL_STATE_PUBLIC_EXPOSURE_INVALID');
  if (!isMapPrecision(input.mapPrecision)) reasons.push('CONTROL_STATE_MAP_PRECISION_INVALID');
  if (!isRecord(input.policy)) reasons.push('CONTROL_STATE_POLICY_INPUT_REQUIRED');
  return Object.freeze([...new Set(reasons)].sort());
}

function legacyPosture(input: ReieControlStateVisibilityInput): ReieControlStateLegacyPosture {
  return Object.freeze({
    strategyGate: input.strategyGate,
    areaCloud: input.areaCloud,
    privateLayer: input.privateLayer,
    mode: input.mode,
    publicExposure: input.publicExposure,
    mapPrecision: input.mapPrecision,
    strategyGateCanAuthorize: false,
    areaCloudCanAuthorize: false,
    privateLayerCanAuthorize: false,
    publicExposureCanAuthorize: false,
    mapPrecisionCanAuthorize: false,
  });
}

export function adaptReieControlStateToCapabilityVisibility(input: ReieControlStateVisibilityInput): ReieControlStateVisibilityAdaptation {
  const validationReasons = validateControlState(input);
  if (validationReasons.length > 0) return { classification: 'FAIL_CLOSED', policyResult: null, legacyPosture: null, reasons: validationReasons };

  const paused = input.mode === 'paused';
  const policyInput: ReieCapabilityVisibilityPolicyInput = {
    ...input.policy,
    killSwitchActive: input.killSwitchActive || paused ? true : false,
    authorizationState: paused
      ? { ...input.policy.authorizationState, activation: 'NOT_ACTIVATED' }
      : input.policy.authorizationState,
  };
  const result = evaluateReieCapabilityVisibilityPolicy(policyInput);
  const reasons = paused ? ['CONTROL_STATE_MODE_PAUSED'] : [];
  if (input.killSwitchActive) reasons.push('CONTROL_STATE_KILL_SWITCH_ACTIVE');
  return {
    classification: 'VALID_CONTROL_STATE_ADAPTATION',
    policyResult: result,
    legacyPosture: legacyPosture(input),
    reasons: Object.freeze([...reasons, ...result.trace]),
  };
}

export function validateReieControlStateVisibilityInput(input: unknown): readonly string[] {
  return validateControlState(input);
}
