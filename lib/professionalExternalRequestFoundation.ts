/* eslint-disable @typescript-eslint/no-explicit-any -- Prisma transaction client and deterministic checker doubles share this narrow adapter. */
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

import { createProfessionalInputService, ProfessionalInputError } from './professionalInputFoundation';
import {
  PROFESSIONAL_EXTERNAL_REQUEST_PROFILE,
  PROFESSIONAL_EXTERNAL_REQUEST_PROFILES,
  ProfessionalExternalRequestError,
  professionalExternalRequestFingerprint,
  validateProfessionalExternalRequestDraft,
  validatePropertyManagerRentEstimateResponse,
  type ProfessionalExternalRequestDraft,
} from './professionalExternalRequestProfileRegistry';

const CAPABILITY_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_TTL_MS = 30 * 60 * 1000;

export const EXTERNAL_REQUEST_SESSION_COOKIE = 'project_atlas_external_request_session';

type ExternalRequestDatabase = {
  $transaction: any;
  professionalInputRequest: any;
  professionalInputResponse: any;
  professionalInput: any;
  evidenceCandidate: any;
  evidenceAdmission: any;
  evidenceAdmissionAuditEvent: any;
  externalRequestDelivery: any;
  externalRequestCapability: any;
  externalRequestSession: any;
  externalRequestDisclosureSnapshot: any;
  externalIdentityVerification: any;
};

function ownerScope(ownerAgentSubject: string) {
  if (!ownerAgentSubject.trim()) throw new ProfessionalExternalRequestError('NOT_AUTHORIZED', 'An authenticated Agent owner identity is required.');
  return ownerAgentSubject;
}

function secret(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

function hash(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function fixedEqual(left: string, right: string) {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function nowExpiry(now = new Date()) {
  return new Date(now.getTime() + CAPABILITY_TTL_MS);
}

function sessionExpiry(now = new Date()) {
  return new Date(now.getTime() + SESSION_TTL_MS);
}

function disclosureFor(draft: ProfessionalExternalRequestDraft, expiresAt: Date) {
  const profile = PROFESSIONAL_EXTERNAL_REQUEST_PROFILES[draft.profile];
  return Object.freeze({
    contractVersion: 'EXTERNAL_REQUEST_DISCLOSURE_SNAPSHOT_V1',
    profile: draft.profile,
    title: profile.title,
    requestedSourceRole: profile.requestedSourceRole,
    property: Object.freeze({ label: draft.propertyLabel, city: draft.propertyCity, state: draft.propertyState }),
    purpose: draft.purpose,
    dueAt: draft.dueAt,
    expiresAt: expiresAt.toISOString(),
    clientAuthorizationRequirement: profile.clientAuthorizationRequirement,
    disclosures: Object.freeze([
      'Provide a professional estimate only; this request does not ask for client financial, mortgage, account, or other customer information.',
      'Your response will be routed to the requesting Agent for review and is not automatically admitted as evidence.',
      'Do not include documents, rich HTML, credentials, passwords, tokens, bank details, Social Security numbers, or payment-card information.',
    ]),
  });
}

function assertDeliveryActive(delivery: any, now = new Date()) {
  if (!delivery) throw new ProfessionalExternalRequestError('NOT_FOUND', 'The external request is unavailable.');
  if (delivery.revokedAt || delivery.status === 'REVOKED') throw new ProfessionalExternalRequestError('REVOKED', 'This external request has been revoked.');
  if (delivery.expiresAt <= now || delivery.status === 'EXPIRED') throw new ProfessionalExternalRequestError('EXPIRED', 'This external request has expired.');
}

async function createClaim(tx: ExternalRequestDatabase, deliveryId: string, dimension: string, assertedValue: string | null | undefined) {
  if (!assertedValue) return;
  const existing = await tx.externalIdentityVerification.findFirst({ where: { deliveryId, dimension, method: 'RESPONDER_CLAIM' } });
  if (!existing) await tx.externalIdentityVerification.create({ data: { deliveryId, dimension, method: 'RESPONDER_CLAIM', status: 'CLAIMED', assertedValue } });
}

export function getExternalRequestSessionCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return { httpOnly: true, secure: isProduction, sameSite: 'strict' as const, path: '/professional-request', maxAge: Math.floor(SESSION_TTL_MS / 1000) };
}

export function getExpiredExternalRequestSessionCookieOptions(isProduction = process.env.NODE_ENV === 'production') {
  return { ...getExternalRequestSessionCookieOptions(isProduction), maxAge: 0, expires: new Date(0) };
}

export function createProfessionalExternalRequestService(prisma: ExternalRequestDatabase) {
  async function prepare(ownerAgentSubject: string, rawDraft: unknown, supersedesRequestId?: string | null) {
    const owner = ownerScope(ownerAgentSubject);
    const draft = validateProfessionalExternalRequestDraft(rawDraft);
    const profile = PROFESSIONAL_EXTERNAL_REQUEST_PROFILES[draft.profile];
    const expiresAt = nowExpiry();
    const requestFingerprint = professionalExternalRequestFingerprint({ owner, draft, supersedesRequestId: supersedesRequestId ?? null });
    const capabilityPlaintext = secret();
    const disclosure = disclosureFor(draft, expiresAt);
    const disclosureFingerprint = professionalExternalRequestFingerprint(disclosure);

    return prisma.$transaction(async (tx: ExternalRequestDatabase) => {
      const existing = await tx.externalRequestDelivery.findFirst({ where: { ownerAgentSubject: owner, requestFingerprint }, include: { professionalInputRequest: true, disclosureSnapshot: true } });
      if (existing) return Object.freeze({ delivery: existing, capability: null, created: false });
      if (supersedesRequestId) {
        const predecessor = await tx.professionalInputRequest.findFirst({ where: { id: supersedesRequestId, ownerAgentSubject: owner }, include: { response: true, supersededByRequest: true } });
        if (!predecessor) throw new ProfessionalExternalRequestError('NOT_FOUND', 'The predecessor request is unavailable.');
        if (predecessor.supersededByRequest) throw new ProfessionalExternalRequestError('NOT_REVIEWABLE', 'The predecessor request already has a successor.');
      }
      const request = await tx.professionalInputRequest.create({ data: {
        ownerAgentSubject: owner,
        claimKind: profile.claimKind,
        requestedSourceRole: profile.requestedSourceRole,
        status: 'DRAFT',
        requestedBySubject: owner,
        purpose: draft.purpose,
        dueAt: draft.dueAt ? new Date(draft.dueAt) : null,
        supportDocumentRequired: false,
        supersedesRequestId: supersedesRequestId ?? null,
      } });
      const delivery = await tx.externalRequestDelivery.create({ data: {
        ownerAgentSubject: owner,
        professionalInputRequestId: request.id,
        profile: draft.profile,
        recipientEmail: draft.recipientEmail,
        recipientDisplayName: draft.recipientDisplayName,
        recipientOrganization: draft.recipientOrganization,
        status: 'PREPARED',
        requestFingerprint,
        expiresAt,
      } });
      await tx.externalRequestCapability.create({ data: { deliveryId: delivery.id, tokenHash: hash(capabilityPlaintext), purpose: profile.capabilityPurpose, maxUses: 1, expiresAt } });
      await tx.externalRequestDisclosureSnapshot.create({ data: { deliveryId: delivery.id, contractVersion: disclosure.contractVersion, disclosure, fingerprint: disclosureFingerprint } });
      return Object.freeze({ delivery: { ...delivery, professionalInputRequest: request, disclosureSnapshot: { disclosure } }, capability: null, created: true });
    });
  }

  async function listOwned(ownerAgentSubject: string) {
    const owner = ownerScope(ownerAgentSubject);
    return prisma.externalRequestDelivery.findMany({
      where: { ownerAgentSubject: owner },
      include: { professionalInputRequest: { include: { response: { include: { candidate: true } }, supersedesRequest: true, supersededByRequest: true } }, disclosureSnapshot: true, identityVerifications: true, capability: { select: { expiresAt: true, revokedAt: true, exchangedAt: true, useCount: true, maxUses: true } } },
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  async function revoke(ownerAgentSubject: string, deliveryId: string) {
    const owner = ownerScope(ownerAgentSubject);
    return prisma.$transaction(async (tx: ExternalRequestDatabase) => {
      const delivery = await tx.externalRequestDelivery.findFirst({ where: { id: deliveryId, ownerAgentSubject: owner }, include: { professionalInputRequest: { include: { response: true } } } });
      if (!delivery) throw new ProfessionalExternalRequestError('NOT_FOUND', 'The external request is unavailable.');
      if (delivery.professionalInputRequest.response) throw new ProfessionalExternalRequestError('NOT_REVIEWABLE', 'A responded request cannot be revoked; create a successor request for a correction.');
      if (delivery.status === 'REVOKED') return delivery;
      const now = new Date();
      await tx.externalRequestCapability.updateMany({ where: { deliveryId, revokedAt: null }, data: { revokedAt: now } });
      await tx.externalRequestSession.updateMany({ where: { deliveryId, revokedAt: null }, data: { revokedAt: now } });
      await tx.professionalInputRequest.update({ where: { id: delivery.professionalInputRequestId }, data: { status: 'CANCELLED' } });
      return tx.externalRequestDelivery.update({ where: { id: deliveryId }, data: { status: 'REVOKED', revokedAt: now } });
    });
  }

  async function activateForDelivery(ownerAgentSubject: string, deliveryId: string) {
    const owner = ownerScope(ownerAgentSubject);
    const capabilityPlaintext = secret();
    return prisma.$transaction(async (tx: ExternalRequestDatabase) => {
      const delivery = await tx.externalRequestDelivery.findFirst({ where: { id: deliveryId, ownerAgentSubject: owner }, include: { professionalInputRequest: true, capability: true } });
      if (!delivery) throw new ProfessionalExternalRequestError('NOT_FOUND', 'The external request is unavailable.');
      assertDeliveryActive(delivery);
      if (delivery.status !== 'PREPARED') throw new ProfessionalExternalRequestError('NOT_REVIEWABLE', 'Only a prepared external request can be delivered.');
      const expiresAt = nowExpiry();
      await tx.externalRequestCapability.update({ where: { id: delivery.capability.id }, data: { tokenHash: hash(capabilityPlaintext), useCount: 0, exchangedAt: null, revokedAt: null, expiresAt } });
      await tx.professionalInputRequest.update({ where: { id: delivery.professionalInputRequestId }, data: { status: 'REQUESTED', requestedAt: new Date() } });
      return Object.freeze({ delivery, capabilityPlaintext, expiresAt });
    });
  }

  async function markDeliverySent(ownerAgentSubject: string, deliveryId: string, providerMessageId: string) {
    const owner = ownerScope(ownerAgentSubject);
    if (!providerMessageId.trim()) throw new ProfessionalExternalRequestError('PERSISTENCE_UNAVAILABLE', 'The delivery provider did not return a message identifier.');
    const delivery = await prisma.externalRequestDelivery.findFirst({ where: { id: deliveryId, ownerAgentSubject: owner } });
    if (!delivery) throw new ProfessionalExternalRequestError('NOT_FOUND', 'The external request is unavailable.');
    return prisma.externalRequestDelivery.update({ where: { id: deliveryId }, data: { status: 'SENT', sentAt: new Date(), providerMessageId } });
  }

  async function applyProviderLifecycle(providerMessageId: string, eventType: string) {
    const delivery = await prisma.externalRequestDelivery.findFirst({ where: { providerMessageId } });
    if (!delivery) return null;
    if (eventType === 'email.delivered' && !['REVOKED', 'RESPONDED'].includes(delivery.status)) return prisma.externalRequestDelivery.update({ where: { id: delivery.id }, data: { status: 'DELIVERED', deliveredAt: delivery.deliveredAt ?? new Date() } });
    if (['email.bounced', 'email.complained', 'email.delivery_delayed'].includes(eventType) && !['REVOKED', 'RESPONDED'].includes(delivery.status)) return prisma.externalRequestDelivery.update({ where: { id: delivery.id }, data: { status: 'DELIVERY_FAILED', failureCode: eventType } });
    return delivery;
  }

  async function verifyIdentity(ownerAgentSubject: string, deliveryId: string, dimension: string, assertedValue?: string | null) {
    const owner = ownerScope(ownerAgentSubject);
    const allowed = ['CHANNEL_CONTROL', 'PERSON_IDENTITY', 'ORGANIZATION_AFFILIATION', 'PROFESSIONAL_ROLE', 'CREDENTIAL_STATUS'];
    if (!allowed.includes(dimension)) throw new ProfessionalExternalRequestError('INVALID_REQUEST', 'The identity verification dimension is unsupported.');
    const delivery = await prisma.externalRequestDelivery.findFirst({ where: { id: deliveryId, ownerAgentSubject: owner } });
    if (!delivery) throw new ProfessionalExternalRequestError('NOT_FOUND', 'The external request is unavailable.');
    const existing = await prisma.externalIdentityVerification.findFirst({ where: { deliveryId, dimension, method: 'AGENT_MANUAL_CONFIRMATION' } });
    if (existing) return existing;
    return prisma.externalIdentityVerification.create({ data: { deliveryId, dimension, method: 'AGENT_MANUAL_CONFIRMATION', status: 'VERIFIED', assertedValue: assertedValue?.trim() || null, verifiedBySubject: owner } });
  }

  async function bootstrap(capabilityPlaintext: string) {
    if (typeof capabilityPlaintext !== 'string' || capabilityPlaintext.length < 40) throw new ProfessionalExternalRequestError('NOT_AUTHORIZED', 'The external request capability is invalid.');
    return prisma.$transaction(async (tx: ExternalRequestDatabase) => {
      const capability = await tx.externalRequestCapability.findFirst({ where: { tokenHash: hash(capabilityPlaintext) }, include: { delivery: { include: { disclosureSnapshot: true } } } });
      if (!capability) throw new ProfessionalExternalRequestError('NOT_AUTHORIZED', 'The external request capability is invalid.');
      const now = new Date();
      assertDeliveryActive(capability.delivery, now);
      if (!['SENT', 'DELIVERED'].includes(capability.delivery.status)) throw new ProfessionalExternalRequestError('NOT_AUTHORIZED', 'This external request is not available for access.');
      if (capability.revokedAt) throw new ProfessionalExternalRequestError('REVOKED', 'This external request capability has been revoked.');
      if (capability.expiresAt <= now) throw new ProfessionalExternalRequestError('EXPIRED', 'This external request capability has expired.');
      if (capability.useCount >= capability.maxUses) throw new ProfessionalExternalRequestError('NOT_AUTHORIZED', 'This external request capability has already been used.');
      const sessionSecret = secret();
      const csrfToken = hash(`${sessionSecret}:csrf`);
      const session = await tx.externalRequestSession.create({ data: { deliveryId: capability.deliveryId, sessionHash: hash(sessionSecret), csrfTokenHash: hash(csrfToken), expiresAt: sessionExpiry(now), lastAccessedAt: now } });
      await tx.externalRequestCapability.update({ where: { id: capability.id }, data: { useCount: { increment: 1 }, exchangedAt: now } });
      await tx.externalRequestDelivery.update({ where: { id: capability.deliveryId }, data: { status: 'ACCESSED', accessedAt: now } });
      const channelEvent = await tx.externalIdentityVerification.findFirst({ where: { deliveryId: capability.deliveryId, dimension: 'CHANNEL_CONTROL', method: 'EMAIL_CHANNEL_CONTROL' } });
      if (!channelEvent) await tx.externalIdentityVerification.create({ data: { deliveryId: capability.deliveryId, dimension: 'CHANNEL_CONTROL', method: 'EMAIL_CHANNEL_CONTROL', status: 'LIMITED', assertedValue: capability.delivery.recipientEmail } });
      return Object.freeze({ cookieValue: `${session.id}.${sessionSecret}`, disclosure: capability.delivery.disclosureSnapshot?.disclosure, expiresAt: session.expiresAt });
    });
  }

  async function readSession(cookieValue: string | undefined) {
    const [id, sessionSecret, extra] = (cookieValue ?? '').split('.');
    if (!id || !sessionSecret || extra) throw new ProfessionalExternalRequestError('SESSION_INVALID', 'An active external request session is required.');
    const session = await prisma.externalRequestSession.findFirst({ where: { id }, include: { delivery: { include: { disclosureSnapshot: true, professionalInputRequest: { include: { response: true } } } } } });
    if (!session || !fixedEqual(session.sessionHash, hash(sessionSecret))) throw new ProfessionalExternalRequestError('SESSION_INVALID', 'An active external request session is required.');
    const now = new Date();
    assertDeliveryActive(session.delivery, now);
    if (session.revokedAt || session.expiresAt <= now) throw new ProfessionalExternalRequestError('SESSION_INVALID', 'The external request session is no longer active.');
    return Object.freeze({ ...session, sessionSecret });
  }

  async function responseContext(cookieValue: string | undefined) {
    const session = await readSession(cookieValue);
    return Object.freeze({ disclosure: session.delivery.disclosureSnapshot?.disclosure, csrfToken: hash(`${session.sessionSecret}:csrf`), expiresAt: session.expiresAt, alreadyResponded: Boolean(session.delivery.professionalInputRequest.response) });
  }

  async function externalResponse(cookieValue: string | undefined, csrfToken: string | undefined, rawResponse: unknown) {
    const session = await readSession(cookieValue);
    const expectedCsrf = hash(`${session.sessionSecret}:csrf`);
    if (!csrfToken || !fixedEqual(expectedCsrf, csrfToken) || !fixedEqual(session.csrfTokenHash, hash(csrfToken))) throw new ProfessionalExternalRequestError('CSRF_DENIED', 'The external request session could not be verified.');
    if (session.delivery.profile !== PROFESSIONAL_EXTERNAL_REQUEST_PROFILE) throw new ProfessionalExternalRequestError('NOT_REVIEWABLE', 'The external request profile is unsupported.');
    const answer = validatePropertyManagerRentEstimateResponse(rawResponse);
    const receivedAt = session.createdAt.toISOString();
    const payload = {
      amount: answer.monthlyRent,
      currency: 'USD',
      period: 'MONTHLY',
      ...(answer.rentRangeLow !== null ? { rentRangeLow: answer.rentRangeLow, rentRangeHigh: answer.rentRangeHigh } : {}),
      ...(answer.asOf ? { asOf: answer.asOf } : {}),
      ...(answer.note ? { note: answer.note } : {}),
    };
    const candidate = {
      sourceKind: 'PROFESSIONAL_REPORTED' as const,
      sourceRef: `external-request:${session.delivery.id}`,
      claimKind: 'PROPERTY_MANAGER_RENT' as const,
      candidatePayload: payload,
      observedAt: answer.asOf,
      receivedAt,
      provenance: {
        sourceType: 'PROFESSIONAL_EXTERNAL_REQUEST',
        sourceReference: `external-request:${session.delivery.id}`,
        receivedAt,
        providedAt: answer.asOf,
        sourceRoleClaim: 'PROPERTY_MANAGER',
        sourceIdentityReference: `external-request:${session.delivery.id}`,
        verificationStatus: 'SOURCE_ROLE_CLAIMED' as const,
        verificationMethod: 'RESPONDER_CLAIM_PENDING_AGENT_REVIEW',
        verificationLimitations: 'Responder-provided estimate; role and identity are not automatically verified.',
      },
    };
    try {
      const result = await createProfessionalInputService(prisma).recordProfessionalInputResponse(session.delivery.ownerAgentSubject, { requestId: session.delivery.professionalInputRequestId, candidate });
      await prisma.$transaction(async (tx: ExternalRequestDatabase) => {
        const now = new Date();
        await tx.externalRequestSession.update({ where: { id: session.id }, data: { lastAccessedAt: now, submittedAt: session.submittedAt ?? now } });
        await tx.externalRequestDelivery.update({ where: { id: session.deliveryId }, data: { status: 'RESPONDED', respondedAt: now } });
        await createClaim(tx, session.deliveryId, 'PERSON_IDENTITY', answer.responderName);
        await createClaim(tx, session.deliveryId, 'ORGANIZATION_AFFILIATION', answer.responderOrganization);
        await createClaim(tx, session.deliveryId, 'PROFESSIONAL_ROLE', answer.responderRole);
        await createClaim(tx, session.deliveryId, 'CHANNEL_CONTROL', answer.businessEmail);
      });
      return result;
    } catch (error) {
      if (error instanceof ProfessionalInputError) throw new ProfessionalExternalRequestError(error.code === 'NOT_FOUND' ? 'NOT_FOUND' : 'NOT_REVIEWABLE', error.message);
      throw error;
    }
  }

  return Object.freeze({ prepare, listOwned, revoke, activateForDelivery, markDeliverySent, applyProviderLifecycle, verifyIdentity, bootstrap, readSession, responseContext, externalResponse });
}
