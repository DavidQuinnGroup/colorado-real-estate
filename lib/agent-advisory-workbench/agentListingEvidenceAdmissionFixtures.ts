import type { AgentListingEvidenceAdmissionInput } from './agentListingEvidenceAdmission';
import { AGENT_PROPERTY_LISTING_SOURCE_ID } from './agentPropertyPreparationAdmission';

const base = {
  candidate: {
    property: {
      origin: 'REPOSITORY_PROPERTY', resolvedPropertyCount: 1, slug: 'fixture-listing-property', mlsId: 'MLS-FIXTURE-1', address: '1234 Example Ave', city: 'Boulder', state: 'CO', zip: '80302', status: 'Active', isPrivateExclusive: false, price: 850000, beds: 3, baths: 2, sqft: 1850, lotSize: null, yearBuilt: 1995, propertyType: 'Single Family', neighborhood: null,
    },
    sourcePosture: {
      sourceId: AGENT_PROPERTY_LISTING_SOURCE_ID, sourceClass: 'EXISTING_REPOSITORY_LISTING_FACTS', listingReference: 'MLS-FIXTURE-1', observedAt: '2026-08-20T12:00:00.000Z', freshness: 'CURRENT', completeness: 'COMPLETE', conflict: 'NO_CONFLICT', rights: 'CERTIFIED_EXISTING_REPOSITORY_USE', certification: 'PROPERTY_PRODUCT_CERTIFIED',
    },
  },
  actorRole: 'AGENT', sessionMechanism: 'HUMAN_AGENT_SESSION', persistenceRequested: false, providerRuntimeRequired: false, publicActivationRequested: false,
} as const satisfies AgentListingEvidenceAdmissionInput;

export const AGENT_LISTING_EVIDENCE_ADMISSION_FIXTURES = Object.freeze({
  admitted: base,
  missingIdentity: { ...base, candidate: null },
  identityConflict: { ...base, candidate: { ...base.candidate, property: { ...base.candidate.property, resolvedPropertyCount: 2 } } },
  missingProvenance: { ...base, candidate: { ...base.candidate, sourcePosture: { ...base.candidate.sourcePosture, sourceId: null } } },
  staleEvidence: { ...base, candidate: { ...base.candidate, sourcePosture: { ...base.candidate.sourcePosture, freshness: 'STALE' } } },
  restrictedRights: { ...base, candidate: { ...base.candidate, sourcePosture: { ...base.candidate.sourcePosture, rights: 'UNKNOWN_OR_UNRESOLVED' } } },
  conflictingEvidence: { ...base, candidate: { ...base.candidate, sourcePosture: { ...base.candidate.sourcePosture, conflict: 'CONFLICTING' } } },
  uncertainJurisdiction: { ...base, candidate: { ...base.candidate, property: { ...base.candidate.property, state: 'WY' } } },
  providerRuntime: { ...base, providerRuntimeRequired: true },
} as const satisfies Record<string, AgentListingEvidenceAdmissionInput>);
