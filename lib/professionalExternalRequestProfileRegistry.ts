import { createHash } from 'node:crypto';

export const PROFESSIONAL_EXTERNAL_REQUEST_FOUNDATION_VERSION = 'PROFESSIONAL_EXTERNAL_REQUEST_FOUNDATION_V1' as const;
export const PROFESSIONAL_EXTERNAL_REQUEST_PROFILE = 'PROPERTY_MANAGER_RENT_ESTIMATE_V1' as const;

export type ProfessionalExternalRequestProfile = typeof PROFESSIONAL_EXTERNAL_REQUEST_PROFILE;

export type ProfessionalExternalRequestDraft = Readonly<{
  profile: ProfessionalExternalRequestProfile;
  recipientEmail: string;
  recipientDisplayName?: string | null;
  recipientOrganization?: string | null;
  propertyLabel: string;
  propertyCity?: string | null;
  propertyState?: string | null;
  purpose: string;
  dueAt?: string | null;
}>;

export type PropertyManagerRentEstimateResponse = Readonly<{
  monthlyRent: number;
  rentRangeLow?: number | null;
  rentRangeHigh?: number | null;
  asOf?: string | null;
  note?: string | null;
  responderName?: string | null;
  responderOrganization?: string | null;
  responderRole?: string | null;
  businessEmail?: string | null;
}>;

export class ProfessionalExternalRequestError extends Error {
  constructor(
    readonly code:
      | 'INVALID_REQUEST'
      | 'NOT_FOUND'
      | 'NOT_AUTHORIZED'
      | 'NOT_REVIEWABLE'
      | 'EXPIRED'
      | 'REVOKED'
      | 'SESSION_INVALID'
      | 'CSRF_DENIED'
      | 'DELIVERY_AUTHORIZATION_REQUIRED'
      | 'PERSISTENCE_UNAVAILABLE',
    message: string,
  ) {
    super(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function assertOnlyKeys(value: Record<string, unknown>, keys: readonly string[]) {
  if (Object.keys(value).some((key) => !keys.includes(key))) throw new ProfessionalExternalRequestError('INVALID_REQUEST', 'Unexpected external request fields are not accepted.');
}

function hasSensitiveData(value: string) {
  return /password|secret|token|ssn|social.?security|credit.?card|bank.?account|routing.?number|\b\d{3}-?\d{2}-?\d{4}\b|\b(?:\d[ -]*?){13,19}\b/i.test(value);
}

function boundedText(value: unknown, field: string, maximum: number, nullable = false) {
  if (nullable && (value === null || value === undefined || value === '')) return null;
  if (typeof value !== 'string') throw new ProfessionalExternalRequestError('INVALID_REQUEST', `${field} is invalid.`);
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (!normalized || normalized.length > maximum || /[<>]/.test(normalized) || hasSensitiveData(normalized)) throw new ProfessionalExternalRequestError('INVALID_REQUEST', `${field} is invalid.`);
  return normalized;
}

function email(value: unknown, field: string, nullable = false) {
  const normalized = boundedText(value, field, 320, nullable);
  if (normalized === null) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new ProfessionalExternalRequestError('INVALID_REQUEST', `${field} must be an email address.`);
  return normalized.toLowerCase();
}

function isoDate(value: unknown, field: string, nullable = false) {
  if (nullable && (value === null || value === undefined || value === '')) return null;
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) throw new ProfessionalExternalRequestError('INVALID_REQUEST', `${field} must be an ISO timestamp.`);
  return new Date(value).toISOString();
}

function finiteAmount(value: unknown, field: string, nullable = false) {
  if (nullable && (value === undefined || value === null || value === '')) return null;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 50_000_000) throw new ProfessionalExternalRequestError('INVALID_REQUEST', `${field} is invalid.`);
  return value;
}

export function professionalExternalRequestFingerprint(value: unknown) {
  return createHash('sha256').update(stableJson(value)).digest('hex');
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (isRecord(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}

export function validateProfessionalExternalRequestDraft(value: unknown): ProfessionalExternalRequestDraft {
  if (!isRecord(value) || value.profile !== PROFESSIONAL_EXTERNAL_REQUEST_PROFILE) throw new ProfessionalExternalRequestError('INVALID_REQUEST', 'The external request profile is unsupported.');
  assertOnlyKeys(value, ['profile', 'recipientEmail', 'recipientDisplayName', 'recipientOrganization', 'propertyLabel', 'propertyCity', 'propertyState', 'purpose', 'dueAt']);
  return Object.freeze({
    profile: PROFESSIONAL_EXTERNAL_REQUEST_PROFILE,
    recipientEmail: email(value.recipientEmail, 'recipientEmail')!,
    recipientDisplayName: boundedText(value.recipientDisplayName, 'recipientDisplayName', 160, true),
    recipientOrganization: boundedText(value.recipientOrganization, 'recipientOrganization', 160, true),
    propertyLabel: boundedText(value.propertyLabel, 'propertyLabel', 240)!,
    propertyCity: boundedText(value.propertyCity, 'propertyCity', 120, true),
    propertyState: boundedText(value.propertyState, 'propertyState', 40, true),
    purpose: boundedText(value.purpose, 'purpose', 800)!,
    dueAt: isoDate(value.dueAt, 'dueAt', true),
  });
}

export function validatePropertyManagerRentEstimateResponse(value: unknown): PropertyManagerRentEstimateResponse {
  if (!isRecord(value)) throw new ProfessionalExternalRequestError('INVALID_REQUEST', 'The external response is invalid.');
  assertOnlyKeys(value, ['monthlyRent', 'rentRangeLow', 'rentRangeHigh', 'asOf', 'note', 'responderName', 'responderOrganization', 'responderRole', 'businessEmail']);
  const monthlyRent = finiteAmount(value.monthlyRent, 'monthlyRent')!;
  const rentRangeLow = finiteAmount(value.rentRangeLow, 'rentRangeLow', true);
  const rentRangeHigh = finiteAmount(value.rentRangeHigh, 'rentRangeHigh', true);
  if ((rentRangeLow === null) !== (rentRangeHigh === null) || (rentRangeLow !== null && rentRangeHigh !== null && (rentRangeLow > rentRangeHigh || monthlyRent < rentRangeLow || monthlyRent > rentRangeHigh))) {
    throw new ProfessionalExternalRequestError('INVALID_REQUEST', 'The stated rent estimate must fall within a complete monthly range.');
  }
  return Object.freeze({
    monthlyRent,
    rentRangeLow,
    rentRangeHigh,
    asOf: isoDate(value.asOf, 'asOf', true),
    note: boundedText(value.note, 'note', 1000, true),
    responderName: boundedText(value.responderName, 'responderName', 160, true),
    responderOrganization: boundedText(value.responderOrganization, 'responderOrganization', 160, true),
    responderRole: boundedText(value.responderRole, 'responderRole', 120, true),
    businessEmail: email(value.businessEmail, 'businessEmail', true),
  });
}

export const PROFESSIONAL_EXTERNAL_REQUEST_PROFILES = Object.freeze({
  [PROFESSIONAL_EXTERNAL_REQUEST_PROFILE]: Object.freeze({
    profile: PROFESSIONAL_EXTERNAL_REQUEST_PROFILE,
    claimKind: 'PROPERTY_MANAGER_RENT' as const,
    requestedSourceRole: 'PROPERTY_MANAGER',
    clientAuthorizationRequirement: 'NOT_REQUIRED_BY_PROFILE' as const,
    otpRequirement: 'NOT_REQUIRED_BY_PROFILE' as const,
    capabilityPurpose: 'PROPERTY_MANAGER_RENT_ESTIMATE_RESPONSE',
    title: 'Property-manager rent estimate request',
    responseLabel: 'Monthly rent estimate',
  }),
});
