import {
  AGENT_PROPERTY_LISTING_SOURCE_ID,
  AGENT_PROPERTY_PREPARATION_CAPABILITY,
  AGENT_PROPERTY_PREPARATION_FUTURE_ROUTE,
  type AgentPropertyPreparationProperty,
  type AgentPropertyPreparationRequest,
  type AgentPropertyPreparationSourcePosture,
} from './agentPropertyPreparationAdmission';

const admissibleProperty: AgentPropertyPreparationProperty = Object.freeze({
  origin: 'REPOSITORY_PROPERTY',
  resolvedPropertyCount: 1,
  slug: 'fixture-active-property',
  mlsId: 'FIXTURE-MLS-001',
  address: '100 Fixture Avenue',
  city: 'Boulder',
  state: 'CO',
  zip: '80302',
  status: 'Active',
  isPrivateExclusive: false,
  price: 850000,
  beds: 3,
  baths: 2,
  sqft: 1800,
  lotSize: 6000,
  yearBuilt: 1994,
  propertyType: 'Single Family',
  neighborhood: 'Fixture Neighborhood',
});

const admissibleSourcePosture: AgentPropertyPreparationSourcePosture = Object.freeze({
  sourceId: AGENT_PROPERTY_LISTING_SOURCE_ID,
  sourceClass: 'EXISTING_REPOSITORY_LISTING_FACTS',
  listingReference: 'FIXTURE-MLS-001',
  observedAt: '2026-08-20T00:00:00.000Z',
  freshness: 'CURRENT',
  completeness: 'COMPLETE',
  conflict: 'NO_CONFLICT',
  rights: 'CERTIFIED_EXISTING_REPOSITORY_USE',
  certification: 'PROPERTY_PRODUCT_CERTIFIED',
});

const admissibleRequest: AgentPropertyPreparationRequest = Object.freeze({
  actorRole: 'AGENT',
  capability: AGENT_PROPERTY_PREPARATION_CAPABILITY,
  route: AGENT_PROPERTY_PREPARATION_FUTURE_ROUTE,
  adminContext: false,
  customerContext: false,
  persistenceRequested: false,
  providerRuntimeRequired: false,
  publicRecordRequested: false,
  recommendationRequested: false,
  fairHousingSensitiveRequest: false,
});

export const AGENT_PROPERTY_PREPARATION_FIXTURES = Object.freeze({
  admissible: Object.freeze({ property: admissibleProperty, sourcePosture: admissibleSourcePosture, request: admissibleRequest }),
  incompleteEvidence: Object.freeze({ property: Object.freeze({ ...admissibleProperty, price: null }), sourcePosture: admissibleSourcePosture, request: admissibleRequest }),
  staleEvidence: Object.freeze({ property: admissibleProperty, sourcePosture: Object.freeze({ ...admissibleSourcePosture, freshness: 'STALE' as const }), request: admissibleRequest }),
  conflictingEvidence: Object.freeze({ property: admissibleProperty, sourcePosture: Object.freeze({ ...admissibleSourcePosture, conflict: 'CONFLICTING' as const }), request: admissibleRequest }),
  unavailablePublicRecords: Object.freeze({ property: admissibleProperty, sourcePosture: admissibleSourcePosture, request: Object.freeze({ ...admissibleRequest, publicRecordRequested: true }) }),
  unknownProperty: Object.freeze({ property: Object.freeze({ ...admissibleProperty, resolvedPropertyCount: 0 }), sourcePosture: admissibleSourcePosture, request: admissibleRequest }),
  ambiguousProperty: Object.freeze({ property: Object.freeze({ ...admissibleProperty, resolvedPropertyCount: 2 }), sourcePosture: admissibleSourcePosture, request: admissibleRequest }),
  privateProperty: Object.freeze({ property: Object.freeze({ ...admissibleProperty, isPrivateExclusive: true }), sourcePosture: admissibleSourcePosture, request: admissibleRequest }),
  missingSourceIdentity: Object.freeze({ property: admissibleProperty, sourcePosture: Object.freeze({ ...admissibleSourcePosture, sourceId: null }), request: admissibleRequest }),
  unauthorizedContext: Object.freeze({ property: admissibleProperty, sourcePosture: admissibleSourcePosture, request: Object.freeze({ ...admissibleRequest, actorRole: 'ADMIN' as const, adminContext: true }) }),
  prohibitedCustomerContext: Object.freeze({ property: admissibleProperty, sourcePosture: admissibleSourcePosture, request: Object.freeze({ ...admissibleRequest, customerContext: true }) }),
  syntheticProperty: Object.freeze({ property: Object.freeze({ ...admissibleProperty, origin: 'SYNTHETIC_FIXTURE' as const }), sourcePosture: admissibleSourcePosture, request: admissibleRequest }),
  providerRuntime: Object.freeze({ property: admissibleProperty, sourcePosture: admissibleSourcePosture, request: Object.freeze({ ...admissibleRequest, providerRuntimeRequired: true }) }),
  prohibitedRecommendation: Object.freeze({ property: admissibleProperty, sourcePosture: admissibleSourcePosture, request: Object.freeze({ ...admissibleRequest, recommendationRequested: true }) }),
});
