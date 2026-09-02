/* eslint-disable @typescript-eslint/no-explicit-any -- Prisma transaction client and deterministic check doubles share this narrow adapter. */
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

import { Prisma } from '@prisma/client';

import {
  CLIENT_AUTHORIZATION_SNAPSHOT_VERSION,
  ClientAuthorizationError,
  SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE,
  SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE_KEY,
  SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE_VERSION,
  buildClientAuthorizationSnapshot,
  clientAuthorizationFingerprint,
} from './clientAuthorizationFoundation';

const CAPABILITY_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_TTL_MS = 30 * 60 * 1000;
export const CLIENT_AUTHORIZATION_CONFIRMATION_COOKIE = 'project_atlas_client_authorization_session';
export const CLIENT_AUTHORIZATION_CONFIRMATION_PURPOSE = 'CLIENT_AUTHORIZATION_CONFIRMATION_V1';

type Database = { $transaction: any; clientAuthorizationProfile: any; clientAuthorization: any; clientAuthorizationCapability: any; clientAuthorizationSession: any; clientAuthorizationConfirmationEvidence: any };
type RecordValue = Record<string, unknown>;

function secret() { return randomBytes(32).toString('base64url'); }
function hash(value: string) { return createHash('sha256').update(value).digest('hex'); }
function equal(left: string, right: string) { const a = Buffer.from(left); const b = Buffer.from(right); return a.length === b.length && timingSafeEqual(a, b); }
function text(value: unknown, field: string, maximum = 240) { if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[<>]/.test(value)) throw new ClientAuthorizationError('INVALID_REQUEST', `${field} is invalid.`); return value.trim(); }
function iso(value: unknown, field: string) { const parsed = typeof value === 'string' ? new Date(value) : null; if (!parsed || Number.isNaN(parsed.getTime())) throw new ClientAuthorizationError('INVALID_REQUEST', `${field} is invalid.`); return parsed; }
function list(value: unknown, field: string) { if (!Array.isArray(value) || !value.length) throw new ClientAuthorizationError('INVALID_REQUEST', `${field} is invalid.`); const normalized = value.map((item) => text(item, field, 160)).sort(); if (new Set(normalized).size !== normalized.length) throw new ClientAuthorizationError('INVALID_REQUEST', `${field} must not contain duplicates.`); return normalized; }
function owner(value: string) { return text(value, 'ownerAgentSubject', 160); }
function nowExpiry(now = new Date()) { return new Date(now.getTime() + CAPABILITY_TTL_MS); }
function sessionExpiry(now = new Date()) { return new Date(now.getTime() + SESSION_TTL_MS); }

export function getClientAuthorizationSessionCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return { httpOnly: true, secure: isProduction, sameSite: 'strict' as const, path: '/client-authorization', maxAge: Math.floor(SESSION_TTL_MS / 1000) };
}

export function getExpiredClientAuthorizationSessionCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return { ...getClientAuthorizationSessionCookieOptions(isProduction), maxAge: 0, expires: new Date(0) };
}

export function createClientAuthorizationSecureConfirmationService(prisma: Database) {
  async function ensureSyntheticProfile() {
    const definitionFingerprint = clientAuthorizationFingerprint(SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE);
    const existing = await prisma.clientAuthorizationProfile.findUnique({ where: { profileKey_profileVersion: { profileKey: SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE_KEY, profileVersion: SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE_VERSION } } });
    if (existing) {
      if (existing.definitionFingerprint !== definitionFingerprint || existing.lifecycle !== 'SYNTHETIC_CERTIFICATION_ONLY') throw new ClientAuthorizationError('IMMUTABLE', 'The persisted secure-confirmation synthetic profile does not match its immutable definition.');
      return existing;
    }
    return prisma.clientAuthorizationProfile.create({ data: { profileKey: SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE_KEY, profileVersion: SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE_VERSION, lifecycle: 'SYNTHETIC_CERTIFICATION_ONLY', definition: SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE as unknown as Prisma.JsonObject, definitionFingerprint } });
  }

  function draftInput(raw: unknown) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new ClientAuthorizationError('INVALID_REQUEST', 'authorization draft is invalid.');
    const value = raw as RecordValue;
    const principalRefs = list(value.principalRefs, 'principalRefs');
    const principalLabels = Array.isArray(value.principalLabels) ? value.principalLabels.map((item) => text(item, 'principalLabels', 160)) : principalRefs;
    if (principalLabels.length !== principalRefs.length) throw new ClientAuthorizationError('INVALID_REQUEST', 'principalLabels must match principalRefs.');
    const actionClass = text(value.actionClass ?? 'SYNTHETIC_AUTHORIZED_ACTION_V1', 'actionClass', 160);
    const purpose = text(value.purpose ?? SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE.purpose, 'purpose', 240);
    const recipientClass = text(value.recipientClass ?? 'SYNTHETIC_CERTIFICATION_RECIPIENT', 'recipientClass', 160);
    const recipientRef = text(value.recipientRef ?? 'ATLAS_SYNTHETIC_RECIPIENT_A', 'recipientRef', 240);
    const allowedDataClasses = list(value.allowedDataClasses ?? ['SYNTHETIC_NON_SENSITIVE_DATA'], 'allowedDataClasses');
    const effectiveAt = iso(value.effectiveAt ?? new Date().toISOString(), 'effectiveAt');
    const expiresAt = iso(value.expiresAt ?? new Date(Date.now() + CAPABILITY_TTL_MS).toISOString(), 'expiresAt');
    if (expiresAt <= effectiveAt) throw new ClientAuthorizationError('INVALID_REQUEST', 'expiresAt must be after effectiveAt.');
    if (purpose !== SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE.purpose || actionClass !== 'SYNTHETIC_AUTHORIZED_ACTION_V1' || recipientClass !== 'SYNTHETIC_CERTIFICATION_RECIPIENT' || allowedDataClasses.length !== 1 || allowedDataClasses[0] !== 'SYNTHETIC_NON_SENSITIVE_DATA') throw new ClientAuthorizationError('PROFILE_INACTIVE', 'Only the inert secure-confirmation synthetic profile is available.');
    return { value, principalRefs, principalLabels, actionClass, purpose, recipientClass, recipientRef, allowedDataClasses, effectiveAt, expiresAt };
  }

  async function createDraft(ownerAgentSubject: string, raw: unknown) {
    const actor = owner(ownerAgentSubject); const input = draftInput(raw); const profile = await ensureSyntheticProfile();
    const mutationKey = text(input.value.clientMutationKey, 'clientMutationKey', 160);
    const transactionId = typeof input.value.transactionId === 'string' ? text(input.value.transactionId, 'transactionId', 160) : null;
    const propertyId = typeof input.value.propertyId === 'string' ? text(input.value.propertyId, 'propertyId', 160) : null;
    const idempotencyKey = `ATLAS_SECURE_CLIENT_CONFIRMATION_DRAFT_V1|${actor}|${clientAuthorizationFingerprint({ mutationKey, profile: profile.id, principalRefs: input.principalRefs, actionClass: input.actionClass, purpose: input.purpose, recipientClass: input.recipientClass, recipientRef: input.recipientRef, allowedDataClasses: input.allowedDataClasses, effectiveAt: input.effectiveAt.toISOString(), expiresAt: input.expiresAt.toISOString(), transactionId, propertyId })}`;
    const existing = await prisma.clientAuthorization.findUnique({ where: { idempotencyKey }, include: { snapshot: true, principals: true, profile: true, capabilities: true, confirmationEvidence: true, uses: true } });
    if (existing) return existing;
    const { snapshot, fingerprint } = buildClientAuthorizationSnapshot({ profileKey: SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE_KEY, profileVersion: SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE_VERSION, purpose: input.purpose, actionClass: input.actionClass, recipientClass: input.recipientClass, recipientRef: input.recipientRef, allowedDataClasses: input.allowedDataClasses, principalRequirement: 'SINGLE_REQUIRED_PRINCIPAL', principalRefs: input.principalRefs, captureMethod: 'PURPOSE_BOUND_SECURE_LINK', assurance: 'CLIENT_CONFIRMED', effectiveAt: input.effectiveAt.toISOString(), expiresAt: input.expiresAt.toISOString(), authorizationLanguage: input.value.authorizationLanguage ?? 'You are deciding whether to authorize one inert Project Atlas certification action. It will not send information, contact anyone, release a document, or affect a transaction.', limitations: input.value.limitations ?? 'Synthetic certification only. Confirmation does not execute an external action and does not establish high-assurance identity.', transactionId, propertyId });
    return prisma.clientAuthorization.create({ data: { ownerAgentSubject: actor, profileId: profile.id, status: 'DRAFT', effectiveAt: input.effectiveAt, expiresAt: input.expiresAt, captureMethod: 'PURPOSE_BOUND_SECURE_LINK', assurance: 'AGENT_RECORDED', createdBySubject: actor, idempotencyKey, transactionId, propertyId, principals: { create: input.principalRefs.map((principalRef, index) => ({ principalRef, displayLabel: input.principalLabels[index] })) }, snapshot: { create: { schemaVersion: CLIENT_AUTHORIZATION_SNAPSHOT_VERSION, snapshot: snapshot as unknown as Prisma.JsonObject, fingerprint } } }, include: { snapshot: true, principals: true, profile: true, capabilities: true, confirmationEvidence: true, uses: true } });
  }

  async function owned(ownerAgentSubject: string, authorizationId: string) {
    const value = await prisma.clientAuthorization.findFirst({ where: { id: text(authorizationId, 'authorizationId', 100), ownerAgentSubject: owner(ownerAgentSubject) }, include: { profile: true, snapshot: true, principals: true, capabilities: { orderBy: { createdAt: 'desc' } }, confirmationEvidence: true, uses: { orderBy: { resolvedAt: 'desc' } }, supersedesAuthorization: true, supersededByAuthorization: true } });
    if (!value) throw new ClientAuthorizationError('NOT_FOUND', 'The authorization is unavailable to this Agent.');
    return value;
  }

  async function prepare(ownerAgentSubject: string, authorizationId: string) {
    const record = await owned(ownerAgentSubject, authorizationId);
    if (record.status === 'PENDING_CONFIRMATION') return record;
    if (record.status !== 'DRAFT' || !record.snapshot) throw new ClientAuthorizationError('IMMUTABLE', 'Only an unmodified draft can be prepared for client confirmation.');
    await prisma.clientAuthorization.update({ where: { id: record.id }, data: { status: 'PENDING_CONFIRMATION' } });
    return owned(ownerAgentSubject, record.id);
  }

  async function issueCapability(ownerAgentSubject: string, authorizationId: string, issuanceKey: string) {
    const record = await owned(ownerAgentSubject, authorizationId);
    if (record.status !== 'PENDING_CONFIRMATION' || !record.snapshot) throw new ClientAuthorizationError('IMMUTABLE', 'Only a prepared authorization can receive a confirmation capability.');
    const normalizedIssuanceKey = text(issuanceKey, 'issuanceKey', 160);
    const existing = await prisma.clientAuthorizationCapability.findUnique({ where: { issuanceKey: normalizedIssuanceKey } });
    if (existing) return { capability: existing, capabilityPlaintext: null, created: false };
    const capabilityPlaintext = secret(); const now = new Date(); const expiresAt = nowExpiry(now);
    const capability = await prisma.$transaction(async (tx: Database) => {
      await tx.clientAuthorizationCapability.updateMany({ where: { authorizationId: record.id, revokedAt: null, completedAt: null }, data: { revokedAt: now } });
      return tx.clientAuthorizationCapability.create({ data: { authorizationId: record.id, tokenHash: hash(capabilityPlaintext), purpose: CLIENT_AUTHORIZATION_CONFIRMATION_PURPOSE, issuanceKey: normalizedIssuanceKey, expiresAt } });
    });
    return { capability, capabilityPlaintext, created: true };
  }

  async function recoverCapability(ownerAgentSubject: string, authorizationId: string, recoveryKey: string) {
    const record = await owned(ownerAgentSubject, authorizationId);
    if (record.status !== 'PENDING_CONFIRMATION' || !record.snapshot) throw new ClientAuthorizationError('IMMUTABLE', 'Only a prepared authorization can recover a confirmation capability.');
    const normalizedRecoveryKey = text(recoveryKey, 'recoveryKey', 160);
    const existing = await prisma.clientAuthorizationCapability.findUnique({ where: { issuanceKey: normalizedRecoveryKey } });
    if (existing) {
      if (existing.authorizationId !== record.id) throw new ClientAuthorizationError('IMMUTABLE', 'The recovery key is unavailable for this authorization.');
      return { capability: existing, capabilityPlaintext: null, created: false };
    }
    const active = record.capabilities.filter((capability: { revokedAt: Date | null; completedAt: Date | null }) => !capability.revokedAt && !capability.completedAt);
    if (record.confirmationEvidence || record.uses.length || active.length !== 1 || active[0].exchangedAt || active[0].useCount !== 0 || active[0].maxUses !== 1 || active[0].expiresAt <= new Date()) throw new ClientAuthorizationError('IMMUTABLE', 'Recovery requires exactly one unused, unexpired confirmation capability with no recorded decision or downstream use.');
    const capabilityPlaintext = secret(); const now = new Date(); const expiresAt = nowExpiry(now);
    const capability = await prisma.$transaction(async (tx: Database) => {
      const existingSession = await tx.clientAuthorizationSession.findFirst({ where: { authorizationId: record.id } });
      if (existingSession) throw new ClientAuthorizationError('IMMUTABLE', 'Recovery is unavailable after a confirmation session has existed.');
      const revoked = await tx.clientAuthorizationCapability.updateMany({ where: { id: active[0].id, authorizationId: record.id, revokedAt: null, completedAt: null, exchangedAt: null, useCount: 0 }, data: { revokedAt: now } });
      if (revoked.count !== 1) throw new ClientAuthorizationError('IMMUTABLE', 'The active confirmation capability changed before recovery could complete.');
      return tx.clientAuthorizationCapability.create({ data: { authorizationId: record.id, tokenHash: hash(capabilityPlaintext), purpose: CLIENT_AUTHORIZATION_CONFIRMATION_PURPOSE, issuanceKey: normalizedRecoveryKey, expiresAt } });
    });
    return { capability, capabilityPlaintext, created: true };
  }

  async function revokeCapability(ownerAgentSubject: string, authorizationId: string) {
    const record = await owned(ownerAgentSubject, authorizationId);
    if (!['DRAFT', 'PENDING_CONFIRMATION'].includes(record.status)) throw new ClientAuthorizationError('IMMUTABLE', 'Only an unresolved authorization capability can be revoked.');
    const now = new Date();
    await prisma.$transaction(async (tx: Database) => { await tx.clientAuthorizationCapability.updateMany({ where: { authorizationId: record.id, revokedAt: null, completedAt: null }, data: { revokedAt: now } }); await tx.clientAuthorizationSession.updateMany({ where: { authorizationId: record.id, revokedAt: null, completedAt: null }, data: { revokedAt: now } }); });
    return owned(ownerAgentSubject, record.id);
  }

  async function supersede(ownerAgentSubject: string, authorizationId: string, raw: unknown) {
    const predecessor = await owned(ownerAgentSubject, authorizationId);
    if (predecessor.supersededByAuthorization) return owned(ownerAgentSubject, predecessor.supersededByAuthorization.id);
    if (!['DRAFT', 'PENDING_CONFIRMATION', 'ACTIVE'].includes(predecessor.status)) throw new ClientAuthorizationError('IMMUTABLE', 'Only an unresolved or active authorization can receive a successor.');
    const successor = await createDraft(ownerAgentSubject, raw);
    if (successor.id === predecessor.id) return successor;
    const now = new Date();
    await prisma.$transaction(async (tx: Database) => {
      await tx.clientAuthorization.update({ where: { id: predecessor.id }, data: { status: 'SUPERSEDED', supersededAt: now } });
      await tx.clientAuthorization.update({ where: { id: successor.id }, data: { supersedesAuthorizationId: predecessor.id } });
      await tx.clientAuthorizationCapability.updateMany({ where: { authorizationId: predecessor.id, revokedAt: null, completedAt: null }, data: { revokedAt: now } });
      await tx.clientAuthorizationSession.updateMany({ where: { authorizationId: predecessor.id, revokedAt: null, completedAt: null }, data: { revokedAt: now } });
    });
    return owned(ownerAgentSubject, successor.id);
  }

  async function bootstrap(capabilityPlaintext: string) {
    if (typeof capabilityPlaintext !== 'string' || capabilityPlaintext.length < 40) throw new ClientAuthorizationError('NOT_FOUND', 'This confirmation link is unavailable.');
    return prisma.$transaction(async (tx: Database) => {
      const capability = await tx.clientAuthorizationCapability.findFirst({ where: { tokenHash: hash(capabilityPlaintext) }, include: { authorization: { include: { snapshot: true, profile: true, confirmationEvidence: true } } } });
      const now = new Date();
      if (!capability || capability.purpose !== CLIENT_AUTHORIZATION_CONFIRMATION_PURPOSE || capability.revokedAt || capability.completedAt || capability.expiresAt <= now || capability.useCount >= capability.maxUses || capability.authorization.status !== 'PENDING_CONFIRMATION' || !capability.authorization.snapshot) throw new ClientAuthorizationError('NOT_FOUND', 'This confirmation link is unavailable.');
      const sessionSecret = secret(); const csrfToken = hash(`${sessionSecret}:csrf`);
      const session = await tx.clientAuthorizationSession.create({ data: { authorizationId: capability.authorizationId, capabilityId: capability.id, sessionHash: hash(sessionSecret), csrfTokenHash: hash(csrfToken), expiresAt: sessionExpiry(now), lastAccessedAt: now } });
      await tx.clientAuthorizationCapability.update({ where: { id: capability.id }, data: { useCount: { increment: 1 }, exchangedAt: now } });
      return { cookieValue: `${session.id}.${sessionSecret}`, expiresAt: session.expiresAt };
    });
  }

  async function readSession(cookieValue: string | undefined) {
    const [id, sessionSecret, extra] = (cookieValue ?? '').split('.');
    if (!id || !sessionSecret || extra) throw new ClientAuthorizationError('NOT_FOUND', 'This confirmation session is unavailable.');
    const session = await prisma.clientAuthorizationSession.findFirst({ where: { id }, include: { authorization: { include: { snapshot: true, profile: true, principals: true, confirmationEvidence: true } }, capability: true } });
    const now = new Date();
    if (!session || !equal(session.sessionHash, hash(sessionSecret)) || session.revokedAt || session.expiresAt <= now) throw new ClientAuthorizationError('NOT_FOUND', 'This confirmation session is unavailable.');
    return { ...session, sessionSecret };
  }

  async function context(cookieValue: string | undefined) {
    const session = await readSession(cookieValue); const snapshot = session.authorization.snapshot?.snapshot as RecordValue | undefined;
    if (!snapshot) throw new ClientAuthorizationError('PERSISTENCE_UNAVAILABLE', 'Confirmation details are unavailable.');
    return { snapshot, csrfToken: hash(`${session.sessionSecret}:csrf`), completed: session.authorization.confirmationEvidence ? { decision: session.authorization.confirmationEvidence.decision, decidedAt: session.authorization.confirmationEvidence.decidedAt } : null };
  }

  async function decide(cookieValue: string | undefined, csrfToken: string | undefined, decision: unknown) {
    if (decision !== 'CONFIRMED' && decision !== 'DECLINED') throw new ClientAuthorizationError('INVALID_REQUEST', 'A confirmation decision is required.');
    const session = await readSession(cookieValue); const expected = hash(`${session.sessionSecret}:csrf`);
    if (!csrfToken || !equal(expected, csrfToken) || !equal(session.csrfTokenHash, hash(csrfToken))) throw new ClientAuthorizationError('OWNERSHIP_DENIED', 'This confirmation session could not be verified.');
    const snapshot = session.authorization.snapshot?.snapshot as RecordValue | undefined;
    if (!snapshot || !session.authorization.snapshot) throw new ClientAuthorizationError('PERSISTENCE_UNAVAILABLE', 'Confirmation details are unavailable.');
    try {
      return await prisma.$transaction(async (tx: Database) => {
        const current = await tx.clientAuthorization.findFirst({ where: { id: session.authorizationId }, include: { snapshot: true, confirmationEvidence: true } });
        if (!current || !current.snapshot || current.status !== 'PENDING_CONFIRMATION') {
          if (current?.confirmationEvidence) return { evidence: current.confirmationEvidence, created: false };
          throw new ClientAuthorizationError('IMMUTABLE', 'This authorization can no longer be decided.');
        }
        const now = new Date();
        const evidence = await tx.clientAuthorizationConfirmationEvidence.create({ data: { authorizationId: current.id, capabilityId: session.capabilityId, sessionId: session.id, decision, evidenceVersion: 'CLIENT_AUTHORIZATION_CONFIRMATION_EVIDENCE_V1', requestFingerprint: current.snapshot.fingerprint, profileKey: SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE_KEY, profileVersion: SECURE_CLIENT_CONFIRMATION_SYNTHETIC_PROFILE_VERSION, scopeSnapshot: snapshot as Prisma.JsonObject, decidedAt: now } });
        await tx.clientAuthorization.update({ where: { id: current.id }, data: { status: decision === 'CONFIRMED' ? 'ACTIVE' : 'DECLINED', assurance: decision === 'CONFIRMED' ? 'CLIENT_CONFIRMED' : 'AGENT_RECORDED' } });
        await tx.clientAuthorizationCapability.update({ where: { id: session.capabilityId }, data: { completedAt: now } });
        await tx.clientAuthorizationSession.update({ where: { id: session.id }, data: { completedAt: now, lastAccessedAt: now } });
        return { evidence, created: true };
      });
    } catch (error) {
      if (error instanceof ClientAuthorizationError) throw error;
      const existing = await prisma.clientAuthorizationConfirmationEvidence.findUnique({ where: { authorizationId: session.authorizationId } });
      if (existing) return { evidence: existing, created: false };
      throw error;
    }
  }

  async function listOwned(ownerAgentSubject: string) {
    return prisma.clientAuthorization.findMany({ where: { ownerAgentSubject: owner(ownerAgentSubject) }, include: { profile: true, snapshot: true, principals: true, capabilities: { orderBy: { createdAt: 'desc' } }, confirmationEvidence: true, uses: { orderBy: { resolvedAt: 'desc' } }, supersedesAuthorization: true, supersededByAuthorization: true }, orderBy: { createdAt: 'desc' } });
  }

  return Object.freeze({ ensureSyntheticProfile, createDraft, prepare, issueCapability, recoverCapability, revokeCapability, supersede, bootstrap, context, decide, listOwned, getOwned: owned });
}
