export const REIE_CAPABILITY_VISIBILITY_STATES = [
  'PUBLIC',
  'GUIDED',
  'PRIVATE_CLIENT',
  'AGENT_ONLY',
  'ADMIN_ONLY',
  'NOT_AUTHORIZED',
  'NOT_READY',
  'DATA_INSUFFICIENT',
  'COMPLIANCE_BLOCKED',
] as const;

export type ReieCapabilityVisibilityState = (typeof REIE_CAPABILITY_VISIBILITY_STATES)[number];

export const REIE_CAPABILITY_CATEGORIES = [
  'MAP_PRECISION',
  'PRIVATE_LISTING_CONTEXT',
  'VALUATION_DETAIL',
  'FINANCIAL_ILLUSTRATION',
  'INVESTMENT_INTELLIGENCE',
  'GEOGRAPHIC_INTELLIGENCE',
  'SOURCE_QUALITY_DETAIL',
  'PROPERTY_FORENSIC_DETAIL',
  'STRATEGY_PREPARATION',
  'AI_SYNTHESIS',
  'SPECIALIZED_HUB_CONTENT',
] as const;

export type ReieCapabilityCategory = (typeof REIE_CAPABILITY_CATEGORIES)[number];

export const REIE_CAPABILITY_DATA_CLASSES = [
  'PUBLIC_EDUCATIONAL',
  'GEOGRAPHIC_CONTEXT',
  'PRIVATE_CLIENT_CONTEXT',
  'FINANCIAL_ASSUMPTION',
  'INVESTMENT_INTELLIGENCE',
  'SOURCE_QUALITY_DETAIL',
  'PROPERTY_FORENSIC_DETAIL',
  'STRATEGY_PREPARATION',
  'SYSTEM_INTERNAL_DIAGNOSTIC',
] as const;

export type ReieCapabilityDataClass = (typeof REIE_CAPABILITY_DATA_CLASSES)[number];

export const REIE_CAPABILITY_VISIBILITY_ROLES = [
  'PUBLIC_USER',
  'AUTHENTICATED_CLIENT',
  'AGENT',
  'ADMIN',
  'SYSTEM_INTERNAL',
] as const;

export type ReieCapabilityVisibilityRole = (typeof REIE_CAPABILITY_VISIBILITY_ROLES)[number];

export type ReieCapabilityAuthorizationState = Readonly<{
  capability: 'AUTHORIZED' | 'NOT_AUTHORIZED';
  approval: 'APPROVED' | 'PENDING' | 'NOT_APPROVED';
  compliance: 'APPROVED' | 'PENDING' | 'NOT_REQUIRED' | 'BLOCKED';
  activation: 'ACTIVE_BOUNDED_USE' | 'APPROVED_NOT_ACTIVATED' | 'NOT_ACTIVATED' | 'NOT_APPLICABLE';
  customerSelected: boolean;
  agentReviewed: boolean;
  adminAuthorized: boolean;
}>;

export type ReieCapabilitySourcePosture = Readonly<{
  identity: 'SOURCE_IDENTITY_EXISTS' | 'SOURCE_IDENTITY_UNKNOWN' | 'SOURCE_IDENTITY_ABSENT';
  rights: 'RIGHTS_APPROVED' | 'RIGHTS_UNKNOWN' | 'RIGHTS_NOT_APPLICABLE';
  freshness: 'FRESHNESS_CURRENT' | 'FRESHNESS_INSUFFICIENT' | 'FRESHNESS_UNKNOWN' | 'FRESHNESS_NOT_APPLICABLE';
  evidence: 'EVIDENCE_SUFFICIENT' | 'EVIDENCE_INSUFFICIENT' | 'EVIDENCE_UNKNOWN' | 'EVIDENCE_NOT_APPLICABLE';
  activation: 'ACTIVE_FOR_BOUNDED_USE' | 'APPROVED_NOT_ACTIVATED' | 'NOT_ACTIVATED' | 'NOT_APPLICABLE';
  manifestMembership: 'IN_MANIFEST' | 'NOT_IN_MANIFEST';
}>;

export type ReieCapabilityVisibilityPolicyInput = Readonly<{
  capability: ReieCapabilityCategory;
  dataClass: ReieCapabilityDataClass;
  authorizationState: ReieCapabilityAuthorizationState;
  role: ReieCapabilityVisibilityRole;
  sourcePosture: ReieCapabilitySourcePosture;
  killSwitchActive: boolean;
  disclosure: 'SAFE_DISCLOSURE' | 'REQUIRES_REVIEW' | 'COMPLIANCE_BLOCKED';
  professionalVerificationRequired: boolean;
}>;

export type ReieCapabilityVisibilityPolicyResult = Readonly<{
  visibility: ReieCapabilityVisibilityState;
  reasonCode: string;
  trace: readonly string[];
}>;

type ReieCapabilityRule = Readonly<{
  dataClasses: readonly ReieCapabilityDataClass[];
  allowedRoles: readonly ReieCapabilityVisibilityRole[];
  sourceRequired: boolean;
  complianceRequired: boolean;
  adminOnly: boolean;
  visibilityByRole: Readonly<Record<ReieCapabilityVisibilityRole, ReieCapabilityVisibilityState>>;
}>;

export const REIE_CAPABILITY_VISIBILITY_RULES: Readonly<Record<ReieCapabilityCategory, ReieCapabilityRule>> = {
  MAP_PRECISION: {
    dataClasses: ['GEOGRAPHIC_CONTEXT'],
    allowedRoles: ['PUBLIC_USER', 'AUTHENTICATED_CLIENT', 'AGENT', 'ADMIN'],
    sourceRequired: true,
    complianceRequired: false,
    adminOnly: false,
    visibilityByRole: { PUBLIC_USER: 'GUIDED', AUTHENTICATED_CLIENT: 'GUIDED', AGENT: 'AGENT_ONLY', ADMIN: 'ADMIN_ONLY', SYSTEM_INTERNAL: 'ADMIN_ONLY' },
  },
  PRIVATE_LISTING_CONTEXT: {
    dataClasses: ['PRIVATE_CLIENT_CONTEXT'],
    allowedRoles: ['AUTHENTICATED_CLIENT', 'AGENT', 'ADMIN'],
    sourceRequired: true,
    complianceRequired: false,
    adminOnly: false,
    visibilityByRole: { PUBLIC_USER: 'NOT_AUTHORIZED', AUTHENTICATED_CLIENT: 'PRIVATE_CLIENT', AGENT: 'AGENT_ONLY', ADMIN: 'ADMIN_ONLY', SYSTEM_INTERNAL: 'ADMIN_ONLY' },
  },
  VALUATION_DETAIL: {
    dataClasses: ['PROPERTY_FORENSIC_DETAIL'],
    allowedRoles: ['AGENT', 'ADMIN', 'SYSTEM_INTERNAL'],
    sourceRequired: true,
    complianceRequired: true,
    adminOnly: false,
    visibilityByRole: { PUBLIC_USER: 'NOT_AUTHORIZED', AUTHENTICATED_CLIENT: 'NOT_READY', AGENT: 'AGENT_ONLY', ADMIN: 'ADMIN_ONLY', SYSTEM_INTERNAL: 'ADMIN_ONLY' },
  },
  FINANCIAL_ILLUSTRATION: {
    dataClasses: ['FINANCIAL_ASSUMPTION'],
    allowedRoles: ['PUBLIC_USER', 'AUTHENTICATED_CLIENT', 'AGENT', 'ADMIN'],
    sourceRequired: false,
    complianceRequired: false,
    adminOnly: false,
    visibilityByRole: { PUBLIC_USER: 'GUIDED', AUTHENTICATED_CLIENT: 'PRIVATE_CLIENT', AGENT: 'AGENT_ONLY', ADMIN: 'ADMIN_ONLY', SYSTEM_INTERNAL: 'ADMIN_ONLY' },
  },
  INVESTMENT_INTELLIGENCE: {
    dataClasses: ['INVESTMENT_INTELLIGENCE'],
    allowedRoles: ['AGENT', 'ADMIN', 'SYSTEM_INTERNAL'],
    sourceRequired: true,
    complianceRequired: true,
    adminOnly: false,
    visibilityByRole: { PUBLIC_USER: 'COMPLIANCE_BLOCKED', AUTHENTICATED_CLIENT: 'COMPLIANCE_BLOCKED', AGENT: 'AGENT_ONLY', ADMIN: 'ADMIN_ONLY', SYSTEM_INTERNAL: 'ADMIN_ONLY' },
  },
  GEOGRAPHIC_INTELLIGENCE: {
    dataClasses: ['GEOGRAPHIC_CONTEXT'],
    allowedRoles: ['PUBLIC_USER', 'AUTHENTICATED_CLIENT', 'AGENT', 'ADMIN'],
    sourceRequired: true,
    complianceRequired: false,
    adminOnly: false,
    visibilityByRole: { PUBLIC_USER: 'GUIDED', AUTHENTICATED_CLIENT: 'GUIDED', AGENT: 'AGENT_ONLY', ADMIN: 'ADMIN_ONLY', SYSTEM_INTERNAL: 'ADMIN_ONLY' },
  },
  SOURCE_QUALITY_DETAIL: {
    dataClasses: ['SOURCE_QUALITY_DETAIL'],
    allowedRoles: ['AGENT', 'ADMIN', 'SYSTEM_INTERNAL'],
    sourceRequired: true,
    complianceRequired: false,
    adminOnly: true,
    visibilityByRole: { PUBLIC_USER: 'NOT_AUTHORIZED', AUTHENTICATED_CLIENT: 'NOT_AUTHORIZED', AGENT: 'AGENT_ONLY', ADMIN: 'ADMIN_ONLY', SYSTEM_INTERNAL: 'ADMIN_ONLY' },
  },
  PROPERTY_FORENSIC_DETAIL: {
    dataClasses: ['PROPERTY_FORENSIC_DETAIL'],
    allowedRoles: ['AGENT', 'ADMIN', 'SYSTEM_INTERNAL'],
    sourceRequired: true,
    complianceRequired: true,
    adminOnly: false,
    visibilityByRole: { PUBLIC_USER: 'NOT_READY', AUTHENTICATED_CLIENT: 'NOT_READY', AGENT: 'AGENT_ONLY', ADMIN: 'ADMIN_ONLY', SYSTEM_INTERNAL: 'ADMIN_ONLY' },
  },
  STRATEGY_PREPARATION: {
    dataClasses: ['STRATEGY_PREPARATION', 'PRIVATE_CLIENT_CONTEXT'],
    allowedRoles: ['AUTHENTICATED_CLIENT', 'AGENT', 'ADMIN'],
    sourceRequired: false,
    complianceRequired: false,
    adminOnly: false,
    visibilityByRole: { PUBLIC_USER: 'NOT_AUTHORIZED', AUTHENTICATED_CLIENT: 'PRIVATE_CLIENT', AGENT: 'AGENT_ONLY', ADMIN: 'ADMIN_ONLY', SYSTEM_INTERNAL: 'ADMIN_ONLY' },
  },
  AI_SYNTHESIS: {
    dataClasses: ['SYSTEM_INTERNAL_DIAGNOSTIC', 'STRATEGY_PREPARATION'],
    allowedRoles: ['AGENT', 'ADMIN', 'SYSTEM_INTERNAL'],
    sourceRequired: true,
    complianceRequired: true,
    adminOnly: false,
    visibilityByRole: { PUBLIC_USER: 'NOT_AUTHORIZED', AUTHENTICATED_CLIENT: 'NOT_READY', AGENT: 'AGENT_ONLY', ADMIN: 'ADMIN_ONLY', SYSTEM_INTERNAL: 'ADMIN_ONLY' },
  },
  SPECIALIZED_HUB_CONTENT: {
    dataClasses: ['PUBLIC_EDUCATIONAL'],
    allowedRoles: ['PUBLIC_USER', 'AUTHENTICATED_CLIENT', 'AGENT', 'ADMIN'],
    sourceRequired: true,
    complianceRequired: false,
    adminOnly: false,
    visibilityByRole: { PUBLIC_USER: 'PUBLIC', AUTHENTICATED_CLIENT: 'PUBLIC', AGENT: 'AGENT_ONLY', ADMIN: 'ADMIN_ONLY', SYSTEM_INTERNAL: 'ADMIN_ONLY' },
  },
};

function fail(visibility: ReieCapabilityVisibilityState, reasonCode: string, trace: readonly string[]): ReieCapabilityVisibilityPolicyResult {
  return { visibility, reasonCode, trace: Object.freeze([...trace, reasonCode]) };
}

function isCapability(value: unknown): value is ReieCapabilityCategory {
  return typeof value === 'string' && REIE_CAPABILITY_CATEGORIES.includes(value as ReieCapabilityCategory);
}

function isDataClass(value: unknown): value is ReieCapabilityDataClass {
  return typeof value === 'string' && REIE_CAPABILITY_DATA_CLASSES.includes(value as ReieCapabilityDataClass);
}

function isRole(value: unknown): value is ReieCapabilityVisibilityRole {
  return typeof value === 'string' && REIE_CAPABILITY_VISIBILITY_ROLES.includes(value as ReieCapabilityVisibilityRole);
}

function isAuthorizationState(value: unknown): value is ReieCapabilityAuthorizationState {
  if (!value || typeof value !== 'object') return false;
  const state = value as ReieCapabilityAuthorizationState;
  return (state.capability === 'AUTHORIZED' || state.capability === 'NOT_AUTHORIZED')
    && (state.approval === 'APPROVED' || state.approval === 'PENDING' || state.approval === 'NOT_APPROVED')
    && (state.compliance === 'APPROVED' || state.compliance === 'PENDING' || state.compliance === 'NOT_REQUIRED' || state.compliance === 'BLOCKED')
    && (state.activation === 'ACTIVE_BOUNDED_USE' || state.activation === 'APPROVED_NOT_ACTIVATED' || state.activation === 'NOT_ACTIVATED' || state.activation === 'NOT_APPLICABLE')
    && typeof state.customerSelected === 'boolean'
    && typeof state.agentReviewed === 'boolean'
    && typeof state.adminAuthorized === 'boolean';
}

function isSourcePosture(value: unknown): value is ReieCapabilitySourcePosture {
  if (!value || typeof value !== 'object') return false;
  const posture = value as ReieCapabilitySourcePosture;
  return (posture.identity === 'SOURCE_IDENTITY_EXISTS' || posture.identity === 'SOURCE_IDENTITY_UNKNOWN' || posture.identity === 'SOURCE_IDENTITY_ABSENT')
    && (posture.rights === 'RIGHTS_APPROVED' || posture.rights === 'RIGHTS_UNKNOWN' || posture.rights === 'RIGHTS_NOT_APPLICABLE')
    && (posture.freshness === 'FRESHNESS_CURRENT' || posture.freshness === 'FRESHNESS_INSUFFICIENT' || posture.freshness === 'FRESHNESS_UNKNOWN' || posture.freshness === 'FRESHNESS_NOT_APPLICABLE')
    && (posture.evidence === 'EVIDENCE_SUFFICIENT' || posture.evidence === 'EVIDENCE_INSUFFICIENT' || posture.evidence === 'EVIDENCE_UNKNOWN' || posture.evidence === 'EVIDENCE_NOT_APPLICABLE')
    && (posture.activation === 'ACTIVE_FOR_BOUNDED_USE' || posture.activation === 'APPROVED_NOT_ACTIVATED' || posture.activation === 'NOT_ACTIVATED' || posture.activation === 'NOT_APPLICABLE')
    && (posture.manifestMembership === 'IN_MANIFEST' || posture.manifestMembership === 'NOT_IN_MANIFEST');
}

export function evaluateReieCapabilityVisibilityPolicy(input: ReieCapabilityVisibilityPolicyInput): ReieCapabilityVisibilityPolicyResult {
  const trace: string[] = ['KILL_SWITCH'];
  if (input.killSwitchActive !== false) return fail('NOT_AUTHORIZED', 'KILL_SWITCH_ACTIVE_OR_INVALID', trace);

  trace.push('CAPABILITY_AUTHORIZATION');
  if (!isCapability(input.capability)) return fail('NOT_AUTHORIZED', 'CAPABILITY_UNKNOWN', trace);
  if (!isDataClass(input.dataClass)) return fail('NOT_AUTHORIZED', 'DATA_CLASS_UNKNOWN', trace);
  if (!isAuthorizationState(input.authorizationState) || input.authorizationState.capability !== 'AUTHORIZED') return fail('NOT_AUTHORIZED', 'CAPABILITY_NOT_AUTHORIZED', trace);
  const rule = REIE_CAPABILITY_VISIBILITY_RULES[input.capability];
  if (!rule.dataClasses.includes(input.dataClass)) return fail('NOT_AUTHORIZED', 'DATA_CLASS_NOT_ALLOWED_FOR_CAPABILITY', trace);

  trace.push('SOURCE_RIGHTS_EVIDENCE_FRESHNESS');
  if (rule.sourceRequired) {
    if (!isSourcePosture(input.sourcePosture)) return fail('NOT_AUTHORIZED', 'SOURCE_POSTURE_INVALID', trace);
    if (input.sourcePosture.identity !== 'SOURCE_IDENTITY_EXISTS') return fail('NOT_AUTHORIZED', 'SOURCE_IDENTITY_NOT_ESTABLISHED', trace);
    if (input.sourcePosture.rights !== 'RIGHTS_APPROVED') return fail('NOT_AUTHORIZED', 'SOURCE_RIGHTS_NOT_APPROVED', trace);
    if (input.sourcePosture.evidence !== 'EVIDENCE_SUFFICIENT') return fail('DATA_INSUFFICIENT', 'SOURCE_EVIDENCE_INSUFFICIENT', trace);
    if (input.sourcePosture.freshness !== 'FRESHNESS_CURRENT') return fail('DATA_INSUFFICIENT', 'SOURCE_FRESHNESS_INSUFFICIENT', trace);
  }

  trace.push('APPROVAL_STATE');
  if (input.authorizationState.compliance === 'BLOCKED' || (rule.complianceRequired && input.authorizationState.compliance !== 'APPROVED')) return fail('COMPLIANCE_BLOCKED', 'COMPLIANCE_APPROVAL_REQUIRED', trace);
  if (input.authorizationState.approval !== 'APPROVED') return fail('NOT_AUTHORIZED', 'APPROVAL_NOT_COMPLETE', trace);

  trace.push('ACTIVATION_STATE');
  if (input.authorizationState.activation === 'APPROVED_NOT_ACTIVATED' || input.authorizationState.activation === 'NOT_ACTIVATED') return fail('NOT_READY', 'CAPABILITY_NOT_ACTIVATED', trace);
  if (rule.sourceRequired && input.sourcePosture.activation !== 'ACTIVE_FOR_BOUNDED_USE') return fail('NOT_READY', 'SOURCE_NOT_ACTIVE_FOR_BOUNDED_USE', trace);

  trace.push('ROLE_ELIGIBILITY');
  if (!isRole(input.role)) return fail('NOT_AUTHORIZED', 'ROLE_UNKNOWN', trace);
  if (!rule.allowedRoles.includes(input.role)) return fail('NOT_AUTHORIZED', 'ROLE_NOT_ELIGIBLE', trace);
  if (rule.adminOnly && input.role === 'ADMIN') return fail('ADMIN_ONLY', 'ADMIN_DIAGNOSTIC', trace);

  trace.push('SAFE_OUTPUT_DISCLOSURE');
  if (input.disclosure === 'COMPLIANCE_BLOCKED') return fail('COMPLIANCE_BLOCKED', 'DISCLOSURE_COMPLIANCE_BLOCKED', trace);
  if (input.disclosure === 'REQUIRES_REVIEW') return fail('GUIDED', 'DISCLOSURE_REQUIRES_REVIEW', trace);
  if (input.professionalVerificationRequired && input.role === 'PUBLIC_USER') return fail('GUIDED', 'PROFESSIONAL_VERIFICATION_REQUIRED', trace);
  return {
    visibility: rule.visibilityByRole[input.role],
    reasonCode: 'POLICY_ALLOWLIST_MATCH',
    trace: Object.freeze([...trace, 'POLICY_ALLOWLIST_MATCH']),
  };
}
