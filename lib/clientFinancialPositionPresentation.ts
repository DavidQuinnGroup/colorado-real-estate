import type { PrismaClient } from '@prisma/client';

import { createClientCaseGovernedSourceService } from './clientCaseGovernedSourceFoundation';
import { createClientFinancialPositionService } from './clientFinancialPositionFoundation';

const DOMAIN_ORDER = ['ASSET', 'INCOME', 'LIABILITY', 'QUALIFICATION', 'CONSTRAINT'] as const;

function date(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

function cents(value: bigint | null | undefined) {
  return value === null || value === undefined ? null : Number(value);
}

function reviewState(reviewAfter: Date | null | undefined, expiresAt?: Date | null) {
  const now = Date.now();
  if (expiresAt && expiresAt.getTime() <= now) return 'EXPIRED' as const;
  if (reviewAfter && reviewAfter.getTime() <= now) return 'REVIEW_RECOMMENDED' as const;
  return 'CURRENT' as const;
}

function propertyLabel(property: { canonicalProperty: { sourceFormattedSitusAddress: string | null; normalizedSitusAddress: string | null; city: string | null; state: string | null } }) {
  const address = property.canonicalProperty.sourceFormattedSitusAddress || property.canonicalProperty.normalizedSitusAddress || 'Property address unavailable';
  const locality = [property.canonicalProperty.city, property.canonicalProperty.state].filter(Boolean).join(', ');
  return locality ? `${address} · ${locality}` : address;
}

function observation(value: Record<string, unknown>) {
  const expiresAt = value.expiresAt instanceof Date ? value.expiresAt : null;
  const reviewAfter = value.reviewAfter instanceof Date ? value.reviewAfter : null;
  return {
    id: String(value.id),
    marketValueCents: cents(value.marketValueCents as bigint | null),
    liquidValueCents: cents(value.liquidValueCents as bigint | null),
    availableAmountCents: cents(value.availableAmountCents as bigint | null),
    currentBalanceCents: cents(value.currentBalanceCents as bigint | null),
    monthlyObligationCents: cents(value.monthlyObligationCents as bigint | null),
    amountCents: cents(value.amountCents as bigint | null),
    maximumLoanAmountCents: cents(value.maximumLoanAmountCents as bigint | null),
    maximumPurchaseAmountCents: cents(value.maximumPurchaseAmountCents as bigint | null),
    rateBps: typeof value.rateBps === 'number' ? value.rateBps : null,
    frequency: typeof value.frequency === 'string' ? value.frequency : null,
    programLabel: typeof value.programLabel === 'string' ? value.programLabel : null,
    conditions: typeof value.conditions === 'string' ? value.conditions : null,
    sourcePosture: String(value.sourcePosture),
    verificationState: String(value.verificationState),
    observationKind: String(value.observationKind),
    financialSourceId: typeof value.financialSourceId === 'string' ? value.financialSourceId : null,
    asOf: date(value.asOf as Date),
    observedAt: date(value.observedAt as Date | null),
    effectiveAt: date(value.effectiveAt as Date | null),
    expiresAt: date(expiresAt),
    reviewAfter: date(reviewAfter),
    freshness: reviewState(reviewAfter, expiresAt),
  };
}

export type FinancialPositionDomain = (typeof DOMAIN_ORDER)[number];

export function createClientFinancialPositionPresentationService(prisma: PrismaClient) {
  const foundation = createClientFinancialPositionService(prisma);
  const governedSources = createClientCaseGovernedSourceService(prisma);

  async function load(ownerAgentSubject: string, clientCaseId: string) {
    const [current, clientCase, sourceCandidates] = await Promise.all([
      foundation.getCurrentFinancialPosition(ownerAgentSubject, clientCaseId),
      prisma.clientCase.findFirst({
        where: { id: clientCaseId, ownerAgentSubject },
        select: {
          id: true,
          displayName: true,
          status: true,
          parties: { where: { participationStatus: 'ACTIVE' }, select: { id: true, displayLabel: true, role: true }, orderBy: { startedAt: 'asc' } },
          properties: { select: { id: true, canonicalProperty: { select: { sourceFormattedSitusAddress: true, normalizedSitusAddress: true, city: true, state: true } } }, orderBy: { createdAt: 'asc' } },
        },
      }),
      governedSources.listClientCaseGovernedSources(ownerAgentSubject, clientCaseId, 100),
    ]);
    if (!clientCase) return null;
    const candidates = sourceCandidates.map((source) => ({
      id: source.id,
      sourceKind: source.sourceKind,
      claimKind: source.source.claimKind,
      label: `${source.sourceKind === 'EVIDENCE' ? 'Document supported' : 'Professional provided'} · ${source.source.claimKind.replaceAll('_', ' ').toLowerCase()}`,
      effectiveAt: date(source.source.effectiveAt),
      expiresAt: date(source.source.expiresAt),
      reviewAfter: date(source.source.reviewAfter),
    }));
    const sourceByFinancialId = new Map<string, { id: string; label: string }>();
    if (current) {
      const bindings = await prisma.clientFinancialSource.findMany({
        where: { clientCaseId },
        select: { id: true, clientCaseGovernedSourceId: true },
      });
      const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
      bindings.forEach((binding) => sourceByFinancialId.set(binding.id, candidateById.get(binding.clientCaseGovernedSourceId) ?? { id: binding.clientCaseGovernedSourceId, label: 'Previously governed source' }));
    }
    const mapDomain = (domain: FinancialPositionDomain, records: Array<Record<string, unknown>>) => records.map((record) => {
      const currentObservation = Array.isArray(record.observations) && record.observations[0] ? observation(record.observations[0] as Record<string, unknown>) : null;
      return {
        id: String(record.id),
        domain,
        category: String(record.category ?? record.qualificationType ?? record.constraintType),
        label: typeof record.label === 'string' ? record.label : String(record.constraintType).replaceAll('_', ' ').toLowerCase(),
        clientCasePartyId: typeof record.clientCasePartyId === 'string' ? record.clientCasePartyId : null,
        clientCasePropertyId: typeof record.clientCasePropertyId === 'string' ? record.clientCasePropertyId : null,
        current: currentObservation ? { ...currentObservation, source: currentObservation.financialSourceId ? sourceByFinancialId.get(currentObservation.financialSourceId) ?? null : null } : null,
      };
    });
    const domains = current ? [
      ...mapDomain('ASSET', current.assets as unknown as Array<Record<string, unknown>>),
      ...mapDomain('INCOME', current.incomeSources as unknown as Array<Record<string, unknown>>),
      ...mapDomain('LIABILITY', current.liabilities as unknown as Array<Record<string, unknown>>),
      ...mapDomain('QUALIFICATION', current.qualifications as unknown as Array<Record<string, unknown>>),
      ...mapDomain('CONSTRAINT', current.constraints as unknown as Array<Record<string, unknown>>),
    ] : [];
    return {
      clientCase: {
        id: clientCase.id,
        displayName: clientCase.displayName,
        status: clientCase.status,
        participants: clientCase.parties,
        properties: clientCase.properties.map((property) => ({ id: property.id, label: propertyLabel(property) })),
      },
      position: current ? { id: current.id, createdAt: date(current.createdAt), domains } : null,
      sourceCandidates: candidates,
      summary: {
        entered: Boolean(current),
        domains: DOMAIN_ORDER.map((domain) => ({ domain, count: domains.filter((record) => record.domain === domain).length })),
        reviewRecommended: domains.filter((record) => record.current?.freshness === 'REVIEW_RECOMMENDED').length,
        expiredQualifications: domains.filter((record) => record.domain === 'QUALIFICATION' && record.current?.freshness === 'EXPIRED').length,
      },
    };
  }

  async function history(ownerAgentSubject: string, clientCaseId: string, domain: FinancialPositionDomain, entityId: string) {
    const entries = await foundation.listObservationHistory(ownerAgentSubject, clientCaseId, domain, entityId, 100);
    return entries.map((entry) => observation(entry as unknown as Record<string, unknown>));
  }

  return Object.freeze({ load, history });
}
