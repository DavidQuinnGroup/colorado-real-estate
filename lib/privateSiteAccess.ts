export const PRIVATE_SITE_ACCESS_COOKIE = 'project_atlas_private_access';
export const PRIVATE_SITE_ACCESS_MAX_AGE_SECONDS = 8 * 60 * 60;
export const PRIVATE_SITE_ACCESS_CONTRACT_VERSION = 'PROJECT_ATLAS_TEMPORARY_PRIVATE_SITE_ACCESS_V1';

type Environment = Record<string, string | undefined>;

export type PrivateSiteAccessConfiguration = Readonly<{
  enabled: boolean;
  secret: string | null;
  sessionVersion: string;
  configurationState: 'ENABLED' | 'DISABLED' | 'MISSING_SECRET';
}>;

type SessionPayload = Readonly<{
  contractVersion: typeof PRIVATE_SITE_ACCESS_CONTRACT_VERSION;
  issuedAt: number;
  expiresAt: number;
  sessionVersion: string;
}>;

function text(value: string | undefined) {
  return value?.trim() ?? '';
}

function base64UrlEncodeBytes(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlEncode(value: string) {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new TextDecoder().decode(bytes);
}

function constantTimeEqual(left: string, right: string) {
  const maximumLength = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < maximumLength; index += 1) difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  return difference === 0;
}

async function signSessionPayload(encodedPayload: string, secret: string, sessionVersion: string) {
  const key = await globalThis.crypto.subtle.importKey('raw', new TextEncoder().encode(`${secret}:${sessionVersion}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encodedPayload));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

export function getPrivateSiteAccessConfiguration(environment: Environment = process.env): PrivateSiteAccessConfiguration {
  const requested = text(environment.PROJECT_ATLAS_PRIVATE_ACCESS_ENABLED).toLowerCase();
  const enabled = requested === 'true' || (requested !== 'false' && environment.NODE_ENV === 'production');
  const secret = text(environment.PROJECT_ATLAS_PRIVATE_ACCESS_SECRET) || null;
  return Object.freeze({
    enabled,
    secret,
    sessionVersion: text(environment.PROJECT_ATLAS_PRIVATE_ACCESS_SESSION_VERSION) || '1',
    configurationState: enabled ? (secret ? 'ENABLED' : 'MISSING_SECRET') : 'DISABLED',
  });
}

export function getPrivateSiteAccessCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return { httpOnly: true, secure: isProduction, sameSite: 'lax' as const, path: '/', maxAge: PRIVATE_SITE_ACCESS_MAX_AGE_SECONDS };
}

export function getExpiredPrivateSiteAccessCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return { ...getPrivateSiteAccessCookieOptions(isProduction), maxAge: 0, expires: new Date(0) };
}

export function sanitizePrivateAccessReturnPath(value: string | null | undefined) {
  const candidate = value?.trim() ?? '';
  if (!candidate.startsWith('/') || candidate.startsWith('//') || candidate.includes('\\') || candidate.includes('://')) return '/';
  if (candidate.startsWith('/private-access') || candidate.startsWith('/_next/')) return '/';
  return candidate;
}

export async function validatePrivateSiteAccessSecret(candidate: string, configuration = getPrivateSiteAccessConfiguration()) {
  return Boolean(configuration.configurationState === 'ENABLED' && configuration.secret && constantTimeEqual(candidate, configuration.secret));
}

export async function createPrivateSiteAccessSessionValue(configuration = getPrivateSiteAccessConfiguration(), nowMs = Date.now()) {
  if (configuration.configurationState !== 'ENABLED' || !configuration.secret) throw new Error('Private site access session signing is not configured.');
  const issuedAt = Math.floor(nowMs / 1000);
  const payload: SessionPayload = { contractVersion: PRIVATE_SITE_ACCESS_CONTRACT_VERSION, issuedAt, expiresAt: issuedAt + PRIVATE_SITE_ACCESS_MAX_AGE_SECONDS, sessionVersion: configuration.sessionVersion };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedPayload}.${await signSessionPayload(encodedPayload, configuration.secret, configuration.sessionVersion)}`;
}

export async function validatePrivateSiteAccessSessionValue(value: string | undefined, configuration = getPrivateSiteAccessConfiguration(), nowMs = Date.now()) {
  if (!value || configuration.configurationState !== 'ENABLED' || !configuration.secret) return false;
  const [encodedPayload, signature, extra] = value.split('.');
  if (!encodedPayload || !signature || extra) return false;
  if (!constantTimeEqual(signature, await signSessionPayload(encodedPayload, configuration.secret, configuration.sessionVersion))) return false;
  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    return payload.contractVersion === PRIVATE_SITE_ACCESS_CONTRACT_VERSION && Number.isInteger(payload.issuedAt) && Number.isInteger(payload.expiresAt) && payload.expiresAt > Math.floor(nowMs / 1000) && payload.sessionVersion === configuration.sessionVersion;
  } catch {
    return false;
  }
}

export function isSameOriginPrivateAccessRequest(request: { headers: Headers; nextUrl: URL }) {
  const origin = request.headers.get('origin');
  return !origin || origin === request.nextUrl.origin;
}
