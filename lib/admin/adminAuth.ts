import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server.js';

export const ADMIN_MACHINE_KEY_COOKIE = 'reie_admin_key';
export const ADMIN_SESSION_COOKIE = 'reie_admin_session';
export const AGENT_SESSION_COOKIE = 'reie_agent_session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
export const ADMIN_SESSION_CONTRACT_VERSION = 'EPARB-REVIEW-001-ADMIN-SESSION-FOUNDATION';
export const AGENT_SESSION_CONTRACT_VERSION = 'REIE-AGENT-PER-USER-CREDENTIAL-IDENTITY-AND-ROLE-ALLOWLIST-MVV';

export type AdminIdentityType = 'HUMAN_ADMIN' | 'HUMAN_AGENT' | 'MACHINE_ADMIN' | 'DEVELOPMENT_OPERATOR';
export type HumanAdminRole = 'REPOSITORY_ADMIN' | 'EXECUTIVE_ADMIN' | 'OPERATIONS_ADMIN' | 'SERVICE_ADMIN';
export type AdminRole = 'AGENT' | HumanAdminRole;
export type AdminAuthMechanism =
  | 'HUMAN_SESSION'
  | 'HUMAN_AGENT_SESSION'
  | 'X_ADMIN_KEY'
  | 'BEARER_ADMIN_KEY'
  | 'LEGACY_ADMIN_KEY_COOKIE'
  | 'DEVELOPMENT_NO_KEY_FALLBACK';
export type AdminSurfaceType =
  | 'BROWSER_ADMIN_PAGE'
  | 'READ_ONLY_ADMIN_API'
  | 'MUTATING_ADMIN_API'
  | 'MACHINE_ONLY_OPERATIONAL_API'
  | 'DUAL_ACCESS_ADMIN_API'
  | 'PUBLIC_ROUTE_OPTIONAL_ADMIN_CONTEXT';
export type AdminMutationPosture = 'READ_ONLY' | 'MUTATION_CAPABLE' | 'PUBLIC_READ';
export type AdminAuditClassification = 'AUTHENTICATION_ONLY' | 'READ_ONLY_ADMIN' | 'MUTATING_ADMIN' | 'MACHINE_OPERATIONAL';

export type AdminProtectedSurfaceClassification = {
  routePattern: string;
  surfaceType: AdminSurfaceType;
  acceptedIdentityTypes: AdminIdentityType[];
  requiredRoles: AdminRole[];
  allowedMechanisms: AdminAuthMechanism[];
  mutationPosture: AdminMutationPosture;
  auditClassification: AdminAuditClassification;
  csrfProtectionRequired: boolean;
};

export type AdminSessionPayload = {
  contractVersion: typeof ADMIN_SESSION_CONTRACT_VERSION;
  identityType: 'HUMAN_ADMIN';
  role: HumanAdminRole;
  issuedAt: number;
  expiresAt: number;
  sessionVersion: string;
};

export type AgentIdentityIssuer = 'PER_USER_CREDENTIAL' | 'EXTERNAL_IDP';

export type AgentSessionPayload = {
  contractVersion: typeof AGENT_SESSION_CONTRACT_VERSION;
  identityType: 'HUMAN_AGENT';
  issuer: 'PER_USER_CREDENTIAL';
  subject: string;
  role: 'AGENT';
  issuedAt: number;
  expiresAt: number;
  sessionVersion: string;
};

export type AdminAuthenticationResult =
  | {
      authenticated: true;
      identityType: AdminIdentityType;
      role: AdminRole;
      mechanism: AdminAuthMechanism;
      canMutate: boolean;
      subject?: string;
      surface: AdminProtectedSurfaceClassification;
    }
  | {
      authenticated: false;
      denialReason:
        | 'NO_ADMIN_CREDENTIAL_CONFIGURED'
        | 'MISSING_CREDENTIAL'
        | 'INVALID_CREDENTIAL'
        | 'EXPIRED_SESSION'
        | 'REVOKED_SESSION'
        | 'INVALID_SESSION'
        | 'INSUFFICIENT_SURFACE_PERMISSION';
      surface: AdminProtectedSurfaceClassification;
    };

export const adminProtectedSurfaceClassifications: AdminProtectedSurfaceClassification[] = [
  surface('/admin/login', 'BROWSER_ADMIN_PAGE', ['DEVELOPMENT_OPERATOR'], ['REPOSITORY_ADMIN'], ['DEVELOPMENT_NO_KEY_FALLBACK'], 'READ_ONLY', 'AUTHENTICATION_ONLY', false),
  surface('/admin/logout', 'BROWSER_ADMIN_PAGE', ['HUMAN_ADMIN', 'MACHINE_ADMIN', 'DEVELOPMENT_OPERATOR'], ['REPOSITORY_ADMIN', 'SERVICE_ADMIN'], ['HUMAN_SESSION', 'X_ADMIN_KEY', 'BEARER_ADMIN_KEY', 'LEGACY_ADMIN_KEY_COOKIE', 'DEVELOPMENT_NO_KEY_FALLBACK'], 'READ_ONLY', 'AUTHENTICATION_ONLY', false),
  surface('/admin', 'BROWSER_ADMIN_PAGE', ['HUMAN_ADMIN', 'MACHINE_ADMIN', 'DEVELOPMENT_OPERATOR'], ['REPOSITORY_ADMIN', 'SERVICE_ADMIN'], ['HUMAN_SESSION', 'X_ADMIN_KEY', 'BEARER_ADMIN_KEY', 'LEGACY_ADMIN_KEY_COOKIE', 'DEVELOPMENT_NO_KEY_FALLBACK'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/admin/repository', 'BROWSER_ADMIN_PAGE', ['HUMAN_ADMIN', 'MACHINE_ADMIN', 'DEVELOPMENT_OPERATOR'], ['REPOSITORY_ADMIN', 'SERVICE_ADMIN'], ['HUMAN_SESSION', 'X_ADMIN_KEY', 'BEARER_ADMIN_KEY', 'LEGACY_ADMIN_KEY_COOKIE', 'DEVELOPMENT_NO_KEY_FALLBACK'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/admin/repository/executive-operations-dashboard', 'BROWSER_ADMIN_PAGE', ['HUMAN_ADMIN', 'MACHINE_ADMIN', 'DEVELOPMENT_OPERATOR'], ['EXECUTIVE_ADMIN', 'REPOSITORY_ADMIN', 'SERVICE_ADMIN'], ['HUMAN_SESSION', 'X_ADMIN_KEY', 'BEARER_ADMIN_KEY', 'LEGACY_ADMIN_KEY_COOKIE', 'DEVELOPMENT_NO_KEY_FALLBACK'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/admin/agent-briefing-preparation', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT', 'HUMAN_ADMIN'], ['AGENT', 'REPOSITORY_ADMIN'], ['HUMAN_AGENT_SESSION', 'HUMAN_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/agent', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/agent/prepare/market', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/agent/prepare/market-update', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/agent/prepare/property', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/agent/prepare/place', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/agent/prepare/buyer', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/agent/prepare/seller', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/agent/prepare/seller/presentation', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/agent/prepare/seller/financial', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/agent/prepare/professional-inputs', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/agent/prepare/listing', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/api/agent/output/pdf', 'READ_ONLY_ADMIN_API', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/api/agent/outputs', 'MUTATING_ADMIN_API', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'MUTATION_CAPABLE', 'MUTATING_ADMIN', true),
  surface('/api/agent/evidence', 'MUTATING_ADMIN_API', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'MUTATION_CAPABLE', 'MUTATING_ADMIN', true),
  surface('/api/agent/professional-inputs', 'MUTATING_ADMIN_API', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'MUTATION_CAPABLE', 'MUTATING_ADMIN', true),
  surface('/api/agent/seller-financial', 'MUTATING_ADMIN_API', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'MUTATION_CAPABLE', 'MUTATING_ADMIN', true),
  surface('/api/agent/prepare/property', 'READ_ONLY_ADMIN_API', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/api/agent/current-competing-listing-context', 'READ_ONLY_ADMIN_API', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/api/agent/current-snapshot-comparison', 'READ_ONLY_ADMIN_API', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/api/admin/enterprise/operational-kpis', 'DUAL_ACCESS_ADMIN_API', ['HUMAN_ADMIN', 'MACHINE_ADMIN', 'DEVELOPMENT_OPERATOR'], ['EXECUTIVE_ADMIN', 'REPOSITORY_ADMIN', 'SERVICE_ADMIN'], ['HUMAN_SESSION', 'X_ADMIN_KEY', 'BEARER_ADMIN_KEY', 'DEVELOPMENT_NO_KEY_FALLBACK'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/api/admin/enterprise/operational-summary', 'DUAL_ACCESS_ADMIN_API', ['HUMAN_ADMIN', 'MACHINE_ADMIN', 'DEVELOPMENT_OPERATOR'], ['EXECUTIVE_ADMIN', 'REPOSITORY_ADMIN', 'SERVICE_ADMIN'], ['HUMAN_SESSION', 'X_ADMIN_KEY', 'BEARER_ADMIN_KEY', 'DEVELOPMENT_NO_KEY_FALLBACK'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/api/admin/toggle-access', 'MUTATING_ADMIN_API', ['MACHINE_ADMIN', 'DEVELOPMENT_OPERATOR'], ['SERVICE_ADMIN', 'REPOSITORY_ADMIN'], ['X_ADMIN_KEY', 'BEARER_ADMIN_KEY', 'DEVELOPMENT_NO_KEY_FALLBACK'], 'MUTATION_CAPABLE', 'MUTATING_ADMIN', true),
  surface('/api/admin/:path*', 'READ_ONLY_ADMIN_API', ['HUMAN_ADMIN', 'MACHINE_ADMIN', 'DEVELOPMENT_OPERATOR'], ['REPOSITORY_ADMIN', 'SERVICE_ADMIN'], ['HUMAN_SESSION', 'X_ADMIN_KEY', 'BEARER_ADMIN_KEY', 'DEVELOPMENT_NO_KEY_FALLBACK'], 'READ_ONLY', 'READ_ONLY_ADMIN', false),
  surface('/api/process-alerts', 'MACHINE_ONLY_OPERATIONAL_API', ['MACHINE_ADMIN', 'DEVELOPMENT_OPERATOR'], ['SERVICE_ADMIN'], ['X_ADMIN_KEY', 'BEARER_ADMIN_KEY', 'DEVELOPMENT_NO_KEY_FALLBACK'], 'MUTATION_CAPABLE', 'MACHINE_OPERATIONAL', true),
  surface('/api/mls/status', 'MACHINE_ONLY_OPERATIONAL_API', ['MACHINE_ADMIN', 'DEVELOPMENT_OPERATOR'], ['SERVICE_ADMIN'], ['X_ADMIN_KEY', 'BEARER_ADMIN_KEY', 'DEVELOPMENT_NO_KEY_FALLBACK'], 'READ_ONLY', 'MACHINE_OPERATIONAL', false),
  surface('/api/mls/sync', 'MACHINE_ONLY_OPERATIONAL_API', ['MACHINE_ADMIN', 'DEVELOPMENT_OPERATOR'], ['SERVICE_ADMIN'], ['X_ADMIN_KEY', 'BEARER_ADMIN_KEY', 'DEVELOPMENT_NO_KEY_FALLBACK'], 'MUTATION_CAPABLE', 'MACHINE_OPERATIONAL', true),
  surface('/api/mls/retry', 'MACHINE_ONLY_OPERATIONAL_API', ['MACHINE_ADMIN', 'DEVELOPMENT_OPERATOR'], ['SERVICE_ADMIN'], ['X_ADMIN_KEY', 'BEARER_ADMIN_KEY', 'DEVELOPMENT_NO_KEY_FALLBACK'], 'MUTATION_CAPABLE', 'MACHINE_OPERATIONAL', true),
  surface('/api/search', 'PUBLIC_ROUTE_OPTIONAL_ADMIN_CONTEXT', ['MACHINE_ADMIN'], ['SERVICE_ADMIN'], ['X_ADMIN_KEY', 'BEARER_ADMIN_KEY'], 'PUBLIC_READ', 'AUTHENTICATION_ONLY', false),
];

export function getConfiguredAdminCredential() {
  return process.env.REIE_ADMIN_API_KEY || process.env.ADMIN_API_KEY || null;
}

export function getConfiguredAgentCredential() {
  return process.env.REIE_AGENT_CREDENTIAL || null;
}

export function getConfiguredAgentSubject() {
  const subject = process.env.REIE_AGENT_SUBJECT?.trim();
  return subject || null;
}

export function getAgentSessionVersion() {
  return process.env.REIE_AGENT_SESSION_VERSION || '1';
}

export function resolveAgentRole(identity: { issuer: AgentIdentityIssuer; subject: string }) {
  // Authorization is keyed only by the stable internal subject so a future verified issuer can reuse this mapping.
  const configuredSubject = getConfiguredAgentSubject();
  if (!configuredSubject || process.env.REIE_AGENT_SUBJECT_STATUS !== 'ACTIVE') return null;
  if (!constantTimeEqual(identity.subject, configuredSubject)) return null;
  return 'AGENT' as const;
}

export function getAdminSessionVersion() {
  return process.env.REIE_ADMIN_SESSION_VERSION || '1';
}

export function getAdminSessionCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}

export function getExpiredAdminSessionCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return {
    ...getAdminSessionCookieOptions(isProduction),
    maxAge: 0,
    expires: new Date(0),
  };
}

export function getAgentSessionCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return getAdminSessionCookieOptions(isProduction);
}

export function getExpiredAgentSessionCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return getExpiredAdminSessionCookieOptions(isProduction);
}

export function sanitizeAdminReturnPath(value: string | null | undefined) {
  if (!value) return '/admin';
  const trimmed = value.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return '/admin';
  if (trimmed.includes('://') || trimmed.includes('\\')) return '/admin';
  if (trimmed.startsWith('/api/')) return '/admin';
  if (trimmed.startsWith('/admin-auth')) return '/admin';
  return trimmed;
}

export function sanitizeAgentReturnPath(value: string | null | undefined) {
  return value === '/agent' || value === '/agent/prepare/market' || value === '/agent/prepare/market-update' || value === '/agent/prepare/property' || value === '/agent/prepare/place' || value === '/agent/prepare/buyer' || value === '/agent/prepare/seller' || value === '/agent/prepare/seller/presentation' || value === '/agent/prepare/seller/financial' || value === '/agent/prepare/professional-inputs' || value === '/agent/prepare/listing' ? value : '/agent';
}

export function classifyAdminSurface(pathname: string, method = 'GET'): AdminProtectedSurfaceClassification {
  const exact = adminProtectedSurfaceClassifications.find((candidate) => candidate.routePattern === pathname);
  if (exact) return exact;

  if (pathname.startsWith('/admin/repository/')) {
    return adminProtectedSurfaceClassifications.find((candidate) => candidate.routePattern === '/admin/repository') ?? adminProtectedSurfaceClassifications[2];
  }

  if (pathname.startsWith('/admin')) {
    return adminProtectedSurfaceClassifications.find((candidate) => candidate.routePattern === '/admin') ?? adminProtectedSurfaceClassifications[2];
  }

  if (pathname.startsWith('/api/admin/')) {
    if (method !== 'GET' && method !== 'HEAD') {
      return surface(pathname, 'MUTATING_ADMIN_API', ['MACHINE_ADMIN', 'DEVELOPMENT_OPERATOR'], ['SERVICE_ADMIN', 'REPOSITORY_ADMIN'], ['X_ADMIN_KEY', 'BEARER_ADMIN_KEY', 'DEVELOPMENT_NO_KEY_FALLBACK'], 'MUTATION_CAPABLE', 'MUTATING_ADMIN', true);
    }
    return adminProtectedSurfaceClassifications.find((candidate) => candidate.routePattern === '/api/admin/:path*') ?? adminProtectedSurfaceClassifications[8];
  }

  return surface(pathname, 'PUBLIC_ROUTE_OPTIONAL_ADMIN_CONTEXT', ['MACHINE_ADMIN'], ['SERVICE_ADMIN'], ['X_ADMIN_KEY', 'BEARER_ADMIN_KEY'], 'PUBLIC_READ', 'AUTHENTICATION_ONLY', false);
}

export function readMachineCredential(request: NextRequest) {
  const authorization = request.headers.get('authorization') || '';
  const bearerToken = authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7).trim() : '';
  const headerKey = request.headers.get('x-admin-key') || '';
  const legacyCookieKey = request.cookies.get(ADMIN_MACHINE_KEY_COOKIE)?.value || '';

  if (headerKey) return { credential: headerKey, mechanism: 'X_ADMIN_KEY' as const };
  if (bearerToken) return { credential: bearerToken, mechanism: 'BEARER_ADMIN_KEY' as const };
  if (legacyCookieKey) return { credential: legacyCookieKey, mechanism: 'LEGACY_ADMIN_KEY_COOKIE' as const };
  return { credential: '', mechanism: null };
}

export async function createAdminSessionCookieValue(options: {
  nowMs?: number;
  role?: HumanAdminRole;
  sessionVersion?: string;
} = {}) {
  const nowMs = options.nowMs ?? Date.now();
  const payload: AdminSessionPayload = {
    contractVersion: ADMIN_SESSION_CONTRACT_VERSION,
    identityType: 'HUMAN_ADMIN',
    role: options.role ?? 'REPOSITORY_ADMIN',
    issuedAt: Math.floor(nowMs / 1000),
    expiresAt: Math.floor(nowMs / 1000) + ADMIN_SESSION_MAX_AGE_SECONDS,
    sessionVersion: options.sessionVersion ?? getAdminSessionVersion(),
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await signSessionPayload(encodedPayload, getConfiguredAdminCredential());
  return `${encodedPayload}.${signature}`;
}

export async function validateAdminSessionCookieValue(
  value: string | undefined,
  options: {
    nowMs?: number;
    sessionVersion?: string;
  } = {},
): Promise<
  | { valid: true; payload: AdminSessionPayload }
  | { valid: false; reason: 'MISSING_SESSION' | 'INVALID_SESSION' | 'EXPIRED_SESSION' | 'REVOKED_SESSION' }
> {
  if (!value) return { valid: false, reason: 'MISSING_SESSION' };
  const [encodedPayload, signature, extra] = value.split('.');
  if (!encodedPayload || !signature || extra) return { valid: false, reason: 'INVALID_SESSION' };

  const expectedSignature = await signSessionPayload(encodedPayload, getConfiguredAdminCredential());
  if (!constantTimeEqual(signature, expectedSignature)) return { valid: false, reason: 'INVALID_SESSION' };

  let payload: AdminSessionPayload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSessionPayload;
  } catch {
    return { valid: false, reason: 'INVALID_SESSION' };
  }

  if (
    payload.contractVersion !== ADMIN_SESSION_CONTRACT_VERSION ||
    payload.identityType !== 'HUMAN_ADMIN' ||
    !payload.role ||
    !payload.issuedAt ||
    !payload.expiresAt ||
    !payload.sessionVersion
  ) {
    return { valid: false, reason: 'INVALID_SESSION' };
  }

  const nowSeconds = Math.floor((options.nowMs ?? Date.now()) / 1000);
  if (payload.expiresAt <= nowSeconds) return { valid: false, reason: 'EXPIRED_SESSION' };
  if (payload.sessionVersion !== (options.sessionVersion ?? getAdminSessionVersion())) return { valid: false, reason: 'REVOKED_SESSION' };

  return { valid: true, payload };
}

export async function validateAdminCredentialSubmission(candidate: string) {
  const configuredCredential = getConfiguredAdminCredential();
  if (!configuredCredential) return false;
  return constantTimeEqual(candidate, configuredCredential);
}

export async function createAgentSessionCookieValue(options: {
  nowMs?: number;
  subject?: string;
  sessionVersion?: string;
} = {}) {
  const credential = getConfiguredAgentCredential();
  const subject = options.subject ?? getConfiguredAgentSubject();
  if (!credential || !subject || resolveAgentRole({ issuer: 'PER_USER_CREDENTIAL', subject }) !== 'AGENT') {
    throw new Error('Agent identity configuration is not active.');
  }
  const nowMs = options.nowMs ?? Date.now();
  const payload: AgentSessionPayload = {
    contractVersion: AGENT_SESSION_CONTRACT_VERSION,
    identityType: 'HUMAN_AGENT',
    issuer: 'PER_USER_CREDENTIAL',
    subject,
    role: 'AGENT',
    issuedAt: Math.floor(nowMs / 1000),
    expiresAt: Math.floor(nowMs / 1000) + ADMIN_SESSION_MAX_AGE_SECONDS,
    sessionVersion: options.sessionVersion ?? getAgentSessionVersion(),
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedPayload}.${await signSessionPayload(encodedPayload, credential)}`;
}

export async function validateAgentSessionCookieValue(
  value: string | undefined,
  options: { nowMs?: number; sessionVersion?: string } = {},
): Promise<
  | { valid: true; payload: AgentSessionPayload }
  | { valid: false; reason: 'MISSING_SESSION' | 'INVALID_SESSION' | 'EXPIRED_SESSION' | 'REVOKED_SESSION' }
> {
  if (!value) return { valid: false, reason: 'MISSING_SESSION' };
  const credential = getConfiguredAgentCredential();
  if (!credential) return { valid: false, reason: 'INVALID_SESSION' };
  const [encodedPayload, signature, extra] = value.split('.');
  if (!encodedPayload || !signature || extra) return { valid: false, reason: 'INVALID_SESSION' };
  const expectedSignature = await signSessionPayload(encodedPayload, credential);
  if (!constantTimeEqual(signature, expectedSignature)) return { valid: false, reason: 'INVALID_SESSION' };

  let payload: AgentSessionPayload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as AgentSessionPayload;
  } catch {
    return { valid: false, reason: 'INVALID_SESSION' };
  }
  if (
    payload.contractVersion !== AGENT_SESSION_CONTRACT_VERSION ||
    payload.identityType !== 'HUMAN_AGENT' ||
    payload.issuer !== 'PER_USER_CREDENTIAL' ||
    payload.role !== 'AGENT' ||
    !payload.subject ||
    !payload.issuedAt ||
    !payload.expiresAt ||
    !payload.sessionVersion ||
    resolveAgentRole({ issuer: payload.issuer, subject: payload.subject }) !== 'AGENT'
  ) return { valid: false, reason: 'INVALID_SESSION' };

  const nowSeconds = Math.floor((options.nowMs ?? Date.now()) / 1000);
  if (payload.expiresAt <= nowSeconds) return { valid: false, reason: 'EXPIRED_SESSION' };
  if (payload.sessionVersion !== (options.sessionVersion ?? getAgentSessionVersion())) return { valid: false, reason: 'REVOKED_SESSION' };
  return { valid: true, payload };
}

export async function validateAgentCredentialSubmission(candidate: string) {
  const credential = getConfiguredAgentCredential();
  const subject = getConfiguredAgentSubject();
  if (!credential || !subject || resolveAgentRole({ issuer: 'PER_USER_CREDENTIAL', subject }) !== 'AGENT') return false;
  return constantTimeEqual(candidate, credential);
}

export async function authorizeAdminRequest(
  request: NextRequest,
  options: {
    pathname?: string;
    method?: string;
  } = {},
): Promise<AdminAuthenticationResult> {
  const pathname = options.pathname ?? request.nextUrl.pathname;
  const method = options.method ?? request.method;
  const protectedSurface = classifyAdminSurface(pathname, method);
  const configuredCredential = getConfiguredAdminCredential();

  const agentSessionValue = request.cookies.get(AGENT_SESSION_COOKIE)?.value;
  const agentSessionValidation = await validateAgentSessionCookieValue(agentSessionValue);
  if (agentSessionValidation.valid) {
    if (
      protectedSurface.acceptedIdentityTypes.includes('HUMAN_AGENT') &&
      protectedSurface.allowedMechanisms.includes('HUMAN_AGENT_SESSION') &&
      protectedSurface.requiredRoles.includes('AGENT')
    ) {
      return {
        authenticated: true,
        identityType: 'HUMAN_AGENT',
        role: 'AGENT',
        mechanism: 'HUMAN_AGENT_SESSION',
        canMutate: protectedSurface.mutationPosture === 'MUTATION_CAPABLE',
        subject: agentSessionValidation.payload.subject,
        surface: protectedSurface,
      };
    }
    return { authenticated: false, denialReason: 'INSUFFICIENT_SURFACE_PERMISSION', surface: protectedSurface };
  }

  if (!configuredCredential) {
    if (process.env.NODE_ENV !== 'production' && protectedSurface.allowedMechanisms.includes('DEVELOPMENT_NO_KEY_FALLBACK')) {
      return {
        authenticated: true,
        identityType: 'DEVELOPMENT_OPERATOR',
        role: 'REPOSITORY_ADMIN',
        mechanism: 'DEVELOPMENT_NO_KEY_FALLBACK',
        canMutate: protectedSurface.mutationPosture === 'MUTATION_CAPABLE',
        surface: protectedSurface,
      };
    }

    return { authenticated: false, denialReason: 'NO_ADMIN_CREDENTIAL_CONFIGURED', surface: protectedSurface };
  }

  const sessionValue = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const sessionValidation = await validateAdminSessionCookieValue(sessionValue);
  if (sessionValidation.valid) {
    if (
      protectedSurface.acceptedIdentityTypes.includes('HUMAN_ADMIN') &&
      protectedSurface.allowedMechanisms.includes('HUMAN_SESSION') &&
      protectedSurface.requiredRoles.includes(sessionValidation.payload.role)
    ) {
      return {
        authenticated: true,
        identityType: 'HUMAN_ADMIN',
        role: sessionValidation.payload.role,
        mechanism: 'HUMAN_SESSION',
        canMutate: false,
        surface: protectedSurface,
      };
    }

    return { authenticated: false, denialReason: 'INSUFFICIENT_SURFACE_PERMISSION', surface: protectedSurface };
  }

  const machineCredential = readMachineCredential(request);
  if (machineCredential.credential && machineCredential.mechanism) {
    if (!protectedSurface.allowedMechanisms.includes(machineCredential.mechanism)) {
      return { authenticated: false, denialReason: 'INSUFFICIENT_SURFACE_PERMISSION', surface: protectedSurface };
    }
    if (constantTimeEqual(machineCredential.credential, configuredCredential)) {
      return {
        authenticated: true,
        identityType: 'MACHINE_ADMIN',
        role: 'SERVICE_ADMIN',
        mechanism: machineCredential.mechanism,
        canMutate: protectedSurface.mutationPosture === 'MUTATION_CAPABLE',
        surface: protectedSurface,
      };
    }
    return { authenticated: false, denialReason: 'INVALID_CREDENTIAL', surface: protectedSurface };
  }

  if (sessionValidation.reason === 'EXPIRED_SESSION') return { authenticated: false, denialReason: 'EXPIRED_SESSION', surface: protectedSurface };
  if (sessionValidation.reason === 'REVOKED_SESSION') return { authenticated: false, denialReason: 'REVOKED_SESSION', surface: protectedSurface };
  if (sessionValue) return { authenticated: false, denialReason: 'INVALID_SESSION', surface: protectedSurface };
  return { authenticated: false, denialReason: 'MISSING_CREDENTIAL', surface: protectedSurface };
}

export function buildAdminUnauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: 'Unauthorized administrative access.',
    },
    { status: 401 },
  );
}

export function buildAdminLoginRedirect(request: NextRequest) {
  const next = sanitizeAdminReturnPath(`${request.nextUrl.pathname}${request.nextUrl.search}`);
  const loginUrl = new URL('/admin/login', request.nextUrl.origin);
  loginUrl.searchParams.set('next', next);
  return NextResponse.redirect(loginUrl, { status: 303 });
}

export function buildAgentLoginRedirect(request: NextRequest) {
  const next = sanitizeAgentReturnPath(`${request.nextUrl.pathname}${request.nextUrl.search}`);
  const loginUrl = new URL('/agent/login', request.nextUrl.origin);
  loginUrl.searchParams.set('next', next);
  const response = NextResponse.redirect(loginUrl, { status: 303 });
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('x-middleware-cache', 'no-cache');
  return response;
}

export function withTrustedAdminHeaders(request: NextRequest, result: Extract<AdminAuthenticationResult, { authenticated: true }>) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('x-reie-admin-authenticated');
  requestHeaders.delete('x-reie-admin-identity-type');
  requestHeaders.delete('x-reie-admin-role');
  requestHeaders.delete('x-reie-admin-mechanism');
  requestHeaders.set('x-reie-admin-authenticated', 'true');
  requestHeaders.set('x-reie-admin-identity-type', result.identityType);
  requestHeaders.set('x-reie-admin-role', result.role);
  requestHeaders.set('x-reie-admin-mechanism', result.mechanism);
  return requestHeaders;
}

export function isTrustedMiddlewareAuthorizedRequest(request: NextRequest) {
  return request.headers.get('x-reie-admin-authenticated') === 'true';
}

export function isSameOriginAdminRequest(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  return origin === request.nextUrl.origin;
}

async function signSessionPayload(encodedPayload: string, secret: string | null) {
  if (!secret) throw new Error('Admin session signing secret is not configured.');
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(`${secret}:${getAdminSessionVersion()}`),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encodedPayload));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

function base64UrlEncode(value: string) {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function base64UrlEncodeBytes(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new TextDecoder().decode(bytes);
}

function constantTimeEqual(left: string, right: string) {
  const maxLength = Math.max(left.length, right.length);
  let diff = left.length ^ right.length;
  for (let index = 0; index < maxLength; index += 1) {
    diff |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return diff === 0;
}

function surface(
  routePattern: string,
  surfaceType: AdminSurfaceType,
  acceptedIdentityTypes: AdminIdentityType[],
  requiredRoles: AdminRole[],
  allowedMechanisms: AdminAuthMechanism[],
  mutationPosture: AdminMutationPosture,
  auditClassification: AdminAuditClassification,
  csrfProtectionRequired: boolean,
): AdminProtectedSurfaceClassification {
  return {
    routePattern,
    surfaceType,
    acceptedIdentityTypes,
    requiredRoles,
    allowedMechanisms,
    mutationPosture,
    auditClassification,
    csrfProtectionRequired,
  };
}
