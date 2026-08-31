import { createHash } from 'node:crypto';

import { Prisma, type PrismaClient } from '@prisma/client';

export const CLIENT_AUTHORIZATION_FOUNDATION_VERSION = 'CLIENT_AUTHORIZATION_FOUNDATION_V1' as const;
export const CLIENT_AUTHORIZATION_SNAPSHOT_VERSION = 'CLIENT_AUTHORIZATION_SNAPSHOT_V1' as const;
export const SYNTHETIC_AUTHORIZATION_PROFILE_KEY = 'ATLAS_SYNTHETIC_AUTHORIZATION_CERTIFICATION_V1' as const;
export const SYNTHETIC_AUTHORIZATION_PROFILE_VERSION = '1.0.0' as const;

const prohibitedDataClasses = new Set(['PASSWORD', 'MFA_CODE', 'REUSABLE_AUTH_TOKEN', 'PRIVATE_AUTHENTICATION_TOKEN', 'BANKING_LOGIN_CREDENTIAL', 'CARD_SECURITY_CODE', 'WIRE_CREDENTIAL', 'PAYMENT_INITIATION_SECRET']);
const assuranceRank = { AGENT_RECORDED: 0, CLIENT_CONFIRMED: 1, STRONG_CLIENT_CONFIRMED: 2, SIGNED: 3, PROVIDER_VERIFIED: 4 } as const;
export type AuthorizationAssurance = keyof typeof assuranceRank;

export type AuthorizationRequirement = 'NOT_REQUIRED_BY_PROFILE' | 'REQUIRED';
export type AuthorizationReason =
  | 'PROFILE_DOES_NOT_REQUIRE_CLIENT_AUTHORIZATION'
  | 'AUTHORIZED'
  | 'NOT_AUTHORIZED'
  | 'MISSING_REQUIRED_PRINCIPAL'
  | 'EXPIRED'
  | 'REVOKED'
  | 'SUPERSEDED'
  | 'SCOPE_MISMATCH'
  | 'RECIPIENT_MISMATCH'
  | 'DATA_CLASS_NOT_AUTHORIZED'
  | 'ASSURANCE_INSUFFICIENT'
  | 'PROFILE_INACTIVE'
  | 'CONFLICT_REQUIRES_REVIEW'
  | 'REVIEW_REQUIRED';

export class ClientAuthorizationError extends Error {
  constructor(readonly code: 'INVALID_REQUEST' | 'NOT_FOUND' | 'OWNERSHIP_DENIED' | 'IMMUTABLE' | 'PROFILE_INACTIVE' | 'PERSISTENCE_UNAVAILABLE', message: string) {
    super(message);
  }
}

type RecordValue = Record<string, unknown>;
type AuthorizationDatabase = PrismaClient;

export type ClientAuthorizationResolutionResult = Readonly<{
  requirement: AuthorizationRequirement;
  resolution: 'AUTHORIZED' | 'NOT_AUTHORIZED' | 'REVIEW_REQUIRED';
  reasons: readonly string[];
  authorizationId?: string;
  authorizationProfileKey: string;
  authorizationProfileVersion?: string;
  satisfiedPrincipalRefs: readonly string[];
  missingPrincipalRefs: readonly string[];
  resolvedAction: string;
  resolvedRecipient: string | null;
  resolvedDataClasses: readonly string[];
  resolvedAt: string;
}>;

export type ResolveClientAuthorizationInput = Readonly<{
  profileKey: string;
  profileVersion?: string;
  principalRefs?: readonly string[];
  transactionId?: string | null;
  propertyId?: string | null;
  actionClass: string;
  purpose: string;
  recipientClass?: string | null;
  recipientRef?: string | null;
  requestedDataClasses?: readonly string[];
  requestedAt?: Date;
}>;

export type PrincipalRequirement = 'SINGLE_REQUIRED_PRINCIPAL' | 'ALL_REQUIRED_PRINCIPALS' | 'ANY_ONE_AUTHORIZED_PRINCIPAL' | 'PROFILE_DEFINED_PRINCIPAL_SET';

type ProfileDefinition = Readonly<{
  profileKey: string;
  profileVersion: string;
  purpose: string;
  authorizationClass: string;
  allowedActionClasses: readonly string[];
  allowedRecipientClasses: readonly string[];
  allowedDataClasses: readonly string[];
  prohibitedDataClasses: readonly string[];
  principalRequirement: PrincipalRequirement;
  captureMethodPolicy: readonly string[];
  requiredAssurance: keyof typeof assuranceRank;
  expirationPolicy: 'FIXED_DURATION';
  expirationDays: number;
  revocationPolicy: 'REVOCABLE';
  highConsequence: false;
  lifecycle: 'ACTIVE';
  governingLimitations: readonly string[];
}>;

export const SYNTHETIC_AUTHORIZATION_PROFILE: ProfileDefinition = Object.freeze({
  profileKey: SYNTHETIC_AUTHORIZATION_PROFILE_KEY,
  profileVersion: SYNTHETIC_AUTHORIZATION_PROFILE_VERSION,
  purpose: 'CERTIFY_CLIENT_AUTHORIZATION_GOVERNANCE',
  authorizationClass: 'INFORMATION_DISCLOSURE_AUTHORIZATION',
  allowedActionClasses: ['SYNTHETIC_INFORMATION_DISCLOSURE'],
  allowedRecipientClasses: ['SYNTHETIC_CERTIFICATION_RECIPIENT'],
  allowedDataClasses: ['SYNTHETIC_NON_SENSITIVE_DATA'],
  prohibitedDataClasses: [...prohibitedDataClasses],
  principalRequirement: 'SINGLE_REQUIRED_PRINCIPAL',
  captureMethodPolicy: ['AGENT_RECORDED_MEETING', 'AGENT_RECORDED_VERBAL', 'AGENT_RECORDED_EMAIL', 'AGENT_RECORDED_TEXT'],
  requiredAssurance: 'AGENT_RECORDED',
  expirationPolicy: 'FIXED_DURATION',
  expirationDays: 30,
  revocationPolicy: 'REVOCABLE',
  highConsequence: false,
  lifecycle: 'ACTIVE',
  governingLimitations: ['Synthetic certification only.', 'No external action, client contact, disclosure, provider request, document release, or contractual effect.'],
});

export function clientAuthorizationRequirement(profileKey: string): AuthorizationRequirement {
  if (profileKey === 'PROPERTY_MANAGER_RENT_ESTIMATE_V1' || profileKey === 'BUYER_UNDER_CONTRACT_LOW_RISK_AGENT_RECORDED_DECISION') return 'NOT_REQUIRED_BY_PROFILE';
  return 'REQUIRED';
}

export function resolvePrincipalRequirement(principalRequirement: PrincipalRequirement, authorizedPrincipalRefs: readonly string[], requestedPrincipalRefs: readonly string[]) {
  const authorized = [...new Set(authorizedPrincipalRefs)].sort();
  const requested = [...new Set(requestedPrincipalRefs)].sort();
  const unrecognized = requested.filter((item) => !authorized.includes(item));
  const absent = authorized.filter((item) => !requested.includes(item));
  if (principalRequirement === 'ANY_ONE_AUTHORIZED_PRINCIPAL') {
    const satisfied = requested.filter((item) => authorized.includes(item));
    return { satisfiedPrincipalRefs: satisfied, missingPrincipalRefs: unrecognized.length ? unrecognized : satisfied.length ? [] : authorized, authorized: !unrecognized.length && satisfied.length > 0 };
  }
  if (principalRequirement === 'SINGLE_REQUIRED_PRINCIPAL') {
    const satisfied = requested.filter((item) => authorized.includes(item));
    return { satisfiedPrincipalRefs: satisfied, missingPrincipalRefs: unrecognized.length ? unrecognized : requested.length === 1 && satisfied.length === 1 ? [] : authorized, authorized: !unrecognized.length && requested.length === 1 && satisfied.length === 1 };
  }
  return { satisfiedPrincipalRefs: requested.filter((item) => authorized.includes(item)), missingPrincipalRefs: [...unrecognized, ...absent], authorized: !unrecognized.length && !absent.length && authorized.length > 0 };
}

export function authorizationAssuranceSatisfies(recorded: AuthorizationAssurance, required: AuthorizationAssurance) {
  return assuranceRank[recorded] >= assuranceRank[required];
}

function isRecord(value: unknown): value is RecordValue { return Boolean(value) && typeof value === 'object' && !Array.isArray(value); }
function text(value: unknown, field: string, maximum = 240, required = true) {
  if ((value === null || value === undefined || value === '') && !required) return null;
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new ClientAuthorizationError('INVALID_REQUEST', `${field} is invalid.`);
  return value.trim();
}
function stringList(value: unknown, field: string, maximum = 32) {
  if (!Array.isArray(value) || !value.length || value.length > maximum) throw new ClientAuthorizationError('INVALID_REQUEST', `${field} is invalid.`);
  const normalized = [...new Set(value.map((item) => text(item, field, 160)!))].sort();
  if (normalized.length !== value.length) throw new ClientAuthorizationError('INVALID_REQUEST', `${field} must not contain duplicates.`);
  return normalized;
}
function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (isRecord(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
export function clientAuthorizationFingerprint(value: unknown) { return createHash('sha256').update(stableJson(value)).digest('hex'); }
function owner(ownerAgentSubject: string) { return text(ownerAgentSubject, 'ownerAgentSubject', 160)!; }
function date(value: unknown, field: string, required = false) {
  if ((value === null || value === undefined || value === '') && !required) return null;
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) throw new ClientAuthorizationError('INVALID_REQUEST', `${field} is invalid.`);
  return new Date(value);
}
function profileDefinitionFor(key: string) {
  if (key !== SYNTHETIC_AUTHORIZATION_PROFILE_KEY) throw new ClientAuthorizationError('PROFILE_INACTIVE', 'This authorization profile is not active in Foundation V1.');
  return SYNTHETIC_AUTHORIZATION_PROFILE;
}
function assertAllowedScope(profile: ProfileDefinition, actionClass: string, recipientClass: string, dataClasses: readonly string[], purpose: string) {
  if (purpose !== profile.purpose || !profile.allowedActionClasses.includes(actionClass)) throw new ClientAuthorizationError('INVALID_REQUEST', 'The action or purpose is outside the profile scope.');
  if (!profile.allowedRecipientClasses.includes(recipientClass)) throw new ClientAuthorizationError('INVALID_REQUEST', 'The recipient class is outside the profile scope.');
  if (dataClasses.some((item) => prohibitedDataClasses.has(item) || !profile.allowedDataClasses.includes(item))) throw new ClientAuthorizationError('INVALID_REQUEST', 'The requested data classes are outside the profile scope.');
}

export function buildClientAuthorizationSnapshot(input: RecordValue) {
  const principalRefs = stringList(input.principalRefs, 'principalRefs');
  const snapshot = Object.freeze({
    schemaVersion: CLIENT_AUTHORIZATION_SNAPSHOT_VERSION,
    profileKey: text(input.profileKey, 'profileKey', 160)!,
    profileVersion: text(input.profileVersion, 'profileVersion', 80)!,
    purpose: text(input.purpose, 'purpose', 240)!,
    actionClass: text(input.actionClass, 'actionClass', 160)!,
    recipientClass: text(input.recipientClass, 'recipientClass', 160)!,
    recipientRef: text(input.recipientRef, 'recipientRef', 240)!,
    allowedDataClasses: stringList(input.allowedDataClasses, 'allowedDataClasses'),
    principalRequirement: text(input.principalRequirement, 'principalRequirement', 80)!,
    principalRefs,
    captureMethod: text(input.captureMethod, 'captureMethod', 80)!,
    assurance: text(input.assurance, 'assurance', 80)!,
    effectiveAt: date(input.effectiveAt, 'effectiveAt', true)!.toISOString(),
    expiresAt: date(input.expiresAt, 'expiresAt', true)!.toISOString(),
    authorizationLanguage: text(input.authorizationLanguage ?? 'Synthetic certification authorization. No external action.', 'authorizationLanguage', 500)!,
    limitations: text(input.limitations ?? 'Synthetic certification only; no external action.', 'limitations', 800)!,
    transactionId: text(input.transactionId, 'transactionId', 160, false),
    propertyId: text(input.propertyId, 'propertyId', 160, false),
  });
  return Object.freeze({ snapshot, fingerprint: clientAuthorizationFingerprint(snapshot) });
}

function mapStatus(status: string): AuthorizationReason | null {
  if (status === 'REVOKED') return 'REVOKED';
  if (status === 'SUPERSEDED') return 'SUPERSEDED';
  if (status === 'EXPIRED') return 'EXPIRED';
  if (status !== 'ACTIVE') return 'NOT_AUTHORIZED';
  return null;
}

export function createClientAuthorizationService(prisma: AuthorizationDatabase) {
  async function ensureSyntheticProfile() {
    const definitionFingerprint = clientAuthorizationFingerprint(SYNTHETIC_AUTHORIZATION_PROFILE);
    const existing = await prisma.clientAuthorizationProfile.findUnique({ where: { profileKey_profileVersion: { profileKey: SYNTHETIC_AUTHORIZATION_PROFILE_KEY, profileVersion: SYNTHETIC_AUTHORIZATION_PROFILE_VERSION } } });
    if (existing) {
      if (existing.definitionFingerprint !== definitionFingerprint || existing.lifecycle !== 'ACTIVE') throw new ClientAuthorizationError('IMMUTABLE', 'The persisted synthetic authorization profile does not match its immutable Foundation V1 definition.');
      return existing;
    }
    return prisma.clientAuthorizationProfile.create({ data: { profileKey: SYNTHETIC_AUTHORIZATION_PROFILE_KEY, profileVersion: SYNTHETIC_AUTHORIZATION_PROFILE_VERSION, lifecycle: 'ACTIVE', definition: SYNTHETIC_AUTHORIZATION_PROFILE as unknown as Prisma.JsonObject, definitionFingerprint } });
  }

  async function createSynthetic(ownerAgentSubject: string, raw: unknown) {
    const actor = owner(ownerAgentSubject);
    if (!isRecord(raw)) throw new ClientAuthorizationError('INVALID_REQUEST', 'authorization input is invalid.');
    const profile = profileDefinitionFor(text(raw.profileKey ?? SYNTHETIC_AUTHORIZATION_PROFILE_KEY, 'profileKey', 160)!);
    const profileRow = await ensureSyntheticProfile();
    const principalRefs = stringList(raw.principalRefs, 'principalRefs');
    const principalLabels = Array.isArray(raw.principalLabels) ? raw.principalLabels.map((value) => text(value, 'principalLabels', 160)!) : principalRefs;
    if (principalLabels.length !== principalRefs.length) throw new ClientAuthorizationError('INVALID_REQUEST', 'principalLabels must match principalRefs.');
    const actionClass = text(raw.actionClass ?? 'SYNTHETIC_INFORMATION_DISCLOSURE', 'actionClass', 160)!;
    const purpose = text(raw.purpose ?? profile.purpose, 'purpose', 240)!;
    const recipientClass = text(raw.recipientClass ?? 'SYNTHETIC_CERTIFICATION_RECIPIENT', 'recipientClass', 160)!;
    const recipientRef = text(raw.recipientRef ?? 'ATLAS_SYNTHETIC_RECIPIENT_A', 'recipientRef', 240)!;
    const allowedDataClasses = stringList(raw.allowedDataClasses ?? ['SYNTHETIC_NON_SENSITIVE_DATA'], 'allowedDataClasses');
    assertAllowedScope(profile, actionClass, recipientClass, allowedDataClasses, purpose);
    const captureMethod = text(raw.captureMethod ?? 'AGENT_RECORDED_MEETING', 'captureMethod', 80)!;
    const assurance = text(raw.assurance ?? 'AGENT_RECORDED', 'assurance', 80)!;
    if (!profile.captureMethodPolicy.includes(captureMethod) || assurance !== 'AGENT_RECORDED') throw new ClientAuthorizationError('INVALID_REQUEST', 'The capture method or assurance is outside the synthetic profile policy.');
    const effectiveAt = date(raw.effectiveAt ?? '2026-08-31T12:00:00.000Z', 'effectiveAt', true)!;
    const expiresAt = date(raw.expiresAt ?? '2026-09-30T12:00:00.000Z', 'expiresAt', true)!;
    if (expiresAt <= effectiveAt) throw new ClientAuthorizationError('INVALID_REQUEST', 'expiresAt must be after effectiveAt.');
    const clientMutationKey = text(raw.clientMutationKey, 'clientMutationKey', 160)!;
    const idempotencyKey = `ATLAS_CLIENT_AUTHORIZATION_V1|${actor}|${clientAuthorizationFingerprint({ profileKey: profile.profileKey, profileVersion: profile.profileVersion, principalRefs, actionClass, purpose, recipientClass, recipientRef, allowedDataClasses, effectiveAt: effectiveAt.toISOString(), expiresAt: expiresAt.toISOString(), clientMutationKey })}`;
    const existing = await prisma.clientAuthorization.findUnique({ where: { idempotencyKey }, include: { snapshot: true, principals: true, profile: true } });
    if (existing) return existing;
    const { snapshot, fingerprint } = buildClientAuthorizationSnapshot({ profileKey: profile.profileKey, profileVersion: profile.profileVersion, purpose, actionClass, recipientClass, recipientRef, allowedDataClasses, principalRequirement: profile.principalRequirement, principalRefs, captureMethod, assurance, effectiveAt: effectiveAt.toISOString(), expiresAt: expiresAt.toISOString(), authorizationLanguage: raw.authorizationLanguage, limitations: raw.limitations, transactionId: raw.transactionId, propertyId: raw.propertyId });
    return prisma.clientAuthorization.create({
      data: {
        ownerAgentSubject: actor, profileId: profileRow.id, status: 'ACTIVE', effectiveAt, expiresAt, captureMethod: captureMethod as never, assurance: assurance as never, createdBySubject: actor, idempotencyKey,
        transactionId: text(raw.transactionId, 'transactionId', 160, false), propertyId: text(raw.propertyId, 'propertyId', 160, false),
        principals: { create: principalRefs.map((principalRef, index) => ({ principalRef, displayLabel: principalLabels[index] })) },
        snapshot: { create: { schemaVersion: CLIENT_AUTHORIZATION_SNAPSHOT_VERSION, snapshot: snapshot as unknown as Prisma.JsonObject, fingerprint } },
      }, include: { snapshot: true, principals: true, profile: true },
    });
  }

  async function ownedAuthorization(ownerAgentSubject: string, authorizationId: string) {
    const value = await prisma.clientAuthorization.findFirst({ where: { id: text(authorizationId, 'authorizationId', 100)!, ownerAgentSubject: owner(ownerAgentSubject) }, include: { snapshot: true, principals: true, profile: true, supersedesAuthorization: true, supersededByAuthorization: true, uses: { orderBy: { resolvedAt: 'desc' } } } });
    if (!value) throw new ClientAuthorizationError('NOT_FOUND', 'The authorization is unavailable to this Agent.');
    return value;
  }

  async function supersede(ownerAgentSubject: string, authorizationId: string, raw: unknown) {
    const predecessor = await ownedAuthorization(ownerAgentSubject, authorizationId);
    if (predecessor.supersededByAuthorization) return ownedAuthorization(ownerAgentSubject, predecessor.supersededByAuthorization.id);
    if (predecessor.status !== 'ACTIVE') throw new ClientAuthorizationError('IMMUTABLE', 'Only an active authorization can receive a successor.');
    if (!isRecord(raw)) throw new ClientAuthorizationError('INVALID_REQUEST', 'successor input is invalid.');
    const successor = await createSynthetic(ownerAgentSubject, { ...raw, profileKey: SYNTHETIC_AUTHORIZATION_PROFILE_KEY, clientMutationKey: text(raw.clientMutationKey, 'clientMutationKey', 160)! });
    if (successor.id === predecessor.id) return successor;
    await prisma.$transaction([
      prisma.clientAuthorization.update({ where: { id: predecessor.id }, data: { status: 'SUPERSEDED', supersededAt: new Date() } }),
      prisma.clientAuthorization.update({ where: { id: successor.id }, data: { supersedesAuthorizationId: predecessor.id } }),
    ]);
    return ownedAuthorization(ownerAgentSubject, successor.id);
  }

  async function revoke(ownerAgentSubject: string, authorizationId: string, reason: string) {
    const record = await ownedAuthorization(ownerAgentSubject, authorizationId);
    if (record.status === 'REVOKED') return record;
    if (record.status !== 'ACTIVE') throw new ClientAuthorizationError('IMMUTABLE', 'Only an active authorization can be revoked.');
    await prisma.clientAuthorization.update({ where: { id: record.id }, data: { status: 'REVOKED', revokedAt: new Date(), revokedBySubject: owner(ownerAgentSubject), revocationReason: text(reason, 'reason', 500)! } });
    return ownedAuthorization(ownerAgentSubject, record.id);
  }

  async function resolve(ownerAgentSubject: string, input: ResolveClientAuthorizationInput): Promise<ClientAuthorizationResolutionResult> {
    const actor = owner(ownerAgentSubject); const now = input.requestedAt ?? new Date();
    const profileKey = text(input.profileKey, 'profileKey', 160)!;
    const requirement = clientAuthorizationRequirement(profileKey);
    const resolvedAction = text(input.actionClass, 'actionClass', 160)!;
    const purpose = text(input.purpose, 'purpose', 240)!;
    const dataClasses = input.requestedDataClasses ? [...new Set(input.requestedDataClasses)].sort() : [];
    if (requirement === 'NOT_REQUIRED_BY_PROFILE') return Object.freeze({ requirement, resolution: 'AUTHORIZED', reasons: ['PROFILE_DOES_NOT_REQUIRE_CLIENT_AUTHORIZATION'], authorizationProfileKey: profileKey, satisfiedPrincipalRefs: [], missingPrincipalRefs: [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: dataClasses, resolvedAt: now.toISOString() });
    if (dataClasses.some((item) => prohibitedDataClasses.has(item))) return Object.freeze({ requirement, resolution: 'NOT_AUTHORIZED', reasons: ['DATA_CLASS_NOT_AUTHORIZED'], authorizationProfileKey: profileKey, satisfiedPrincipalRefs: [], missingPrincipalRefs: [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: [], resolvedAt: now.toISOString() });
    const profile = profileDefinitionFor(profileKey);
    const profileRow = await prisma.clientAuthorizationProfile.findUnique({ where: { profileKey_profileVersion: { profileKey, profileVersion: input.profileVersion ?? profile.profileVersion } } });
    if (!profileRow || profileRow.lifecycle !== 'ACTIVE') return Object.freeze({ requirement, resolution: 'NOT_AUTHORIZED', reasons: ['PROFILE_INACTIVE'], authorizationProfileKey: profileKey, authorizationProfileVersion: input.profileVersion, satisfiedPrincipalRefs: [], missingPrincipalRefs: [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: [], resolvedAt: now.toISOString() });
    const records = await prisma.clientAuthorization.findMany({ where: { ownerAgentSubject: actor, profileId: profileRow.id }, include: { principals: true, snapshot: true, supersededByAuthorization: true }, orderBy: { createdAt: 'desc' } });
    if (!records.length) return Object.freeze({ requirement, resolution: 'NOT_AUTHORIZED', reasons: ['NOT_AUTHORIZED'], authorizationProfileKey: profileKey, authorizationProfileVersion: profile.profileVersion, satisfiedPrincipalRefs: [], missingPrincipalRefs: input.principalRefs ?? [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: [], resolvedAt: now.toISOString() });
    const actionScopedRecords = records.filter((item) => {
      const snapshot = item.snapshot?.snapshot as RecordValue | undefined;
      return snapshot?.purpose === purpose && snapshot.actionClass === resolvedAction && (snapshot.transactionId ?? null) === (input.transactionId ?? null) && (snapshot.propertyId ?? null) === (input.propertyId ?? null);
    });
    if (!actionScopedRecords.length) return Object.freeze({ requirement, resolution: 'NOT_AUTHORIZED', reasons: ['SCOPE_MISMATCH'], authorizationProfileKey: profileKey, authorizationProfileVersion: profile.profileVersion, satisfiedPrincipalRefs: [], missingPrincipalRefs: input.principalRefs ?? [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: [], resolvedAt: now.toISOString() });
    const recipientScopedRecords = actionScopedRecords.filter((item) => {
      const snapshot = item.snapshot?.snapshot as RecordValue | undefined;
      return snapshot?.recipientClass === (input.recipientClass ?? null) && snapshot.recipientRef === (input.recipientRef ?? null);
    });
    if (!recipientScopedRecords.length) return Object.freeze({ requirement, resolution: 'NOT_AUTHORIZED', reasons: ['RECIPIENT_MISMATCH'], authorizationProfileKey: profileKey, authorizationProfileVersion: profile.profileVersion, satisfiedPrincipalRefs: [], missingPrincipalRefs: input.principalRefs ?? [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: [], resolvedAt: now.toISOString() });
    const current = recipientScopedRecords.find((item) => !item.supersededByAuthorization) ?? recipientScopedRecords[0];
    const statusReason = mapStatus(current.status);
    if (statusReason) return Object.freeze({ requirement, resolution: 'NOT_AUTHORIZED', reasons: [statusReason], authorizationId: current.id, authorizationProfileKey: profileKey, authorizationProfileVersion: profile.profileVersion, satisfiedPrincipalRefs: current.principals.map((item) => item.principalRef), missingPrincipalRefs: [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: [], resolvedAt: now.toISOString() });
    if (!current.snapshot) throw new ClientAuthorizationError('PERSISTENCE_UNAVAILABLE', 'The authorization snapshot is unavailable.');
    if (current.expiresAt && current.expiresAt <= now) {
      await prisma.clientAuthorization.update({ where: { id: current.id }, data: { status: 'EXPIRED' } });
      return Object.freeze({ requirement, resolution: 'NOT_AUTHORIZED', reasons: ['EXPIRED'], authorizationId: current.id, authorizationProfileKey: profileKey, authorizationProfileVersion: profile.profileVersion, satisfiedPrincipalRefs: current.principals.map((item) => item.principalRef), missingPrincipalRefs: [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: [], resolvedAt: now.toISOString() });
    }
    const snapshot = current.snapshot.snapshot as RecordValue;
    if ((snapshot.transactionId ?? null) !== (input.transactionId ?? null) || (snapshot.propertyId ?? null) !== (input.propertyId ?? null)) return Object.freeze({ requirement, resolution: 'NOT_AUTHORIZED', reasons: ['SCOPE_MISMATCH'], authorizationId: current.id, authorizationProfileKey: profileKey, authorizationProfileVersion: profile.profileVersion, satisfiedPrincipalRefs: [], missingPrincipalRefs: [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: [], resolvedAt: now.toISOString() });
    const requestedPrincipals = input.principalRefs ? [...new Set(input.principalRefs)].sort() : [];
    const principalResolution = resolvePrincipalRequirement(profile.principalRequirement, current.principals.map((item) => item.principalRef), requestedPrincipals);
    if (!principalResolution.authorized) return Object.freeze({ requirement, resolution: 'NOT_AUTHORIZED', reasons: ['MISSING_REQUIRED_PRINCIPAL'], authorizationId: current.id, authorizationProfileKey: profileKey, authorizationProfileVersion: profile.profileVersion, satisfiedPrincipalRefs: principalResolution.satisfiedPrincipalRefs, missingPrincipalRefs: principalResolution.missingPrincipalRefs, resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: [], resolvedAt: now.toISOString() });
    if (snapshot.purpose !== purpose || snapshot.actionClass !== resolvedAction) return Object.freeze({ requirement, resolution: 'NOT_AUTHORIZED', reasons: ['SCOPE_MISMATCH'], authorizationId: current.id, authorizationProfileKey: profileKey, authorizationProfileVersion: profile.profileVersion, satisfiedPrincipalRefs: requestedPrincipals, missingPrincipalRefs: [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: [], resolvedAt: now.toISOString() });
    if (snapshot.recipientClass !== (input.recipientClass ?? null) || snapshot.recipientRef !== (input.recipientRef ?? null)) return Object.freeze({ requirement, resolution: 'NOT_AUTHORIZED', reasons: ['RECIPIENT_MISMATCH'], authorizationId: current.id, authorizationProfileKey: profileKey, authorizationProfileVersion: profile.profileVersion, satisfiedPrincipalRefs: requestedPrincipals, missingPrincipalRefs: [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: [], resolvedAt: now.toISOString() });
    const allowedDataClasses = Array.isArray(snapshot.allowedDataClasses) ? snapshot.allowedDataClasses as string[] : [];
    if (dataClasses.some((item) => !allowedDataClasses.includes(item))) return Object.freeze({ requirement, resolution: 'NOT_AUTHORIZED', reasons: ['DATA_CLASS_NOT_AUTHORIZED'], authorizationId: current.id, authorizationProfileKey: profileKey, authorizationProfileVersion: profile.profileVersion, satisfiedPrincipalRefs: requestedPrincipals, missingPrincipalRefs: [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: [], resolvedAt: now.toISOString() });
    if (!authorizationAssuranceSatisfies(current.assurance, profile.requiredAssurance)) return Object.freeze({ requirement, resolution: 'NOT_AUTHORIZED', reasons: ['ASSURANCE_INSUFFICIENT'], authorizationId: current.id, authorizationProfileKey: profileKey, authorizationProfileVersion: profile.profileVersion, satisfiedPrincipalRefs: requestedPrincipals, missingPrincipalRefs: [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: [], resolvedAt: now.toISOString() });
    return Object.freeze({ requirement, resolution: 'AUTHORIZED', reasons: ['AUTHORIZED'], authorizationId: current.id, authorizationProfileKey: profileKey, authorizationProfileVersion: profile.profileVersion, satisfiedPrincipalRefs: requestedPrincipals, missingPrincipalRefs: [], resolvedAction, resolvedRecipient: input.recipientRef ?? null, resolvedDataClasses: dataClasses, resolvedAt: now.toISOString() });
  }

  async function recordUse(ownerAgentSubject: string, input: ResolveClientAuthorizationInput, downstreamReference: string, clientMutationKey: string) {
    const result = await resolve(ownerAgentSubject, input);
    const actor = owner(ownerAgentSubject);
    const idempotencyKey = `ATLAS_CLIENT_AUTHORIZATION_USE_V1|${actor}|${clientAuthorizationFingerprint({ input, downstreamReference, clientMutationKey })}`;
    const existing = await prisma.clientAuthorizationUse.findUnique({ where: { idempotencyKey } });
    if (existing) return { result, use: existing };
    const use = await prisma.clientAuthorizationUse.create({ data: { authorizationId: result.authorizationId, ownerAgentSubject: actor, profileKey: result.authorizationProfileKey, profileVersion: result.authorizationProfileVersion ?? 'NOT_REQUIRED_BY_PROFILE', principalRefs: result.satisfiedPrincipalRefs as unknown as Prisma.JsonArray, proposedAction: result.resolvedAction, purpose: input.purpose, recipientClass: input.recipientClass ?? null, recipientRef: input.recipientRef ?? null, requestedDataClasses: (input.requestedDataClasses ?? []) as unknown as Prisma.JsonArray, resolvedDataClasses: result.resolvedDataClasses as unknown as Prisma.JsonArray, resolution: result.resolution, reasons: result.reasons as unknown as Prisma.JsonArray, downstreamReference: text(downstreamReference, 'downstreamReference', 240), completedAt: result.resolution === 'AUTHORIZED' ? new Date() : null, idempotencyKey } });
    return { result, use };
  }

  async function listOwned(ownerAgentSubject: string) {
    return prisma.clientAuthorization.findMany({ where: { ownerAgentSubject: owner(ownerAgentSubject) }, include: { profile: true, principals: true, snapshot: true, supersedesAuthorization: { include: { snapshot: true } }, supersededByAuthorization: { include: { snapshot: true } }, uses: { orderBy: { resolvedAt: 'desc' } } }, orderBy: { createdAt: 'desc' } });
  }

  return Object.freeze({ ensureSyntheticProfile, createSynthetic, supersede, revoke, resolve, recordUse, listOwned, getOwned: ownedAuthorization });
}
