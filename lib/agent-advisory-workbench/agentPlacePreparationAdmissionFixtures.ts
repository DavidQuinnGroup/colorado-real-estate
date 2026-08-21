import {
  AGENT_PLACE_PREPARATION_CAPABILITY,
  AGENT_PLACE_PREPARATION_FUTURE_ROUTE,
  AGENT_PLACE_PREPARATION_P0_CITIES,
  buildAgentPlacePreparationSourcePosture,
  type AgentPlacePreparationRequest,
} from './agentPlacePreparationAdmission';

const boulder = AGENT_PLACE_PREPARATION_P0_CITIES.find((city) => city.canonicalName === 'Boulder')!;
const louisville = AGENT_PLACE_PREPARATION_P0_CITIES.find((city) => city.canonicalName === 'Louisville')!;
const lafayette = AGENT_PLACE_PREPARATION_P0_CITIES.find((city) => city.canonicalName === 'Lafayette')!;

const admissibleRequest = (canonicalPlaceId: string): AgentPlacePreparationRequest => Object.freeze({
  actorIdentityType: 'HUMAN_AGENT',
  actorRole: 'AGENT',
  sessionMechanism: 'HUMAN_AGENT_SESSION',
  capability: AGENT_PLACE_PREPARATION_CAPABILITY,
  route: AGENT_PLACE_PREPARATION_FUTURE_ROUTE,
  canonicalPlaceId,
  requestedObjectType: 'CITY',
  freeFormPlaceValue: null,
  adminContext: false,
  mcpContext: false,
  customerContext: false,
  persistenceRequested: false,
  providerRuntimeRequired: false,
  recommendationRequested: false,
  rankingRequested: false,
  suitabilityRequested: false,
  fairHousingSensitiveRequest: false,
  schoolQualityRequest: false,
  safetyRequest: false,
});

export const AGENT_PLACE_PREPARATION_FIXTURES = Object.freeze({
  boulder: Object.freeze({ request: admissibleRequest(boulder.canonicalPlaceId), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  louisville: Object.freeze({ request: admissibleRequest(louisville.canonicalPlaceId), sourcePosture: buildAgentPlacePreparationSourcePosture(louisville) }),
  lafayette: Object.freeze({ request: admissibleRequest(lafayette.canonicalPlaceId), sourcePosture: buildAgentPlacePreparationSourcePosture(lafayette) }),
  niwot: Object.freeze({ request: Object.freeze({ ...admissibleRequest('reie-city:niwot-co-real-estate'), requestedObjectType: 'NEIGHBORHOOD' as const }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  gunbarrel: Object.freeze({ request: Object.freeze({ ...admissibleRequest('reie-city:gunbarrel-co-real-estate'), requestedObjectType: 'EDITORIAL_CONTEXT' as const }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  tableMesa: Object.freeze({ request: Object.freeze({ ...admissibleRequest('reie-neighborhood:table-mesa'), requestedObjectType: 'NEIGHBORHOOD' as const }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  neighborhood: Object.freeze({ request: Object.freeze({ ...admissibleRequest(boulder.canonicalPlaceId), requestedObjectType: 'NEIGHBORHOOD' as const }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  unknownCity: Object.freeze({ request: Object.freeze({ ...admissibleRequest('reie-city:unknown'), requestedObjectType: 'UNKNOWN' as const }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  freeForm: Object.freeze({ request: Object.freeze({ ...admissibleRequest(boulder.canonicalPlaceId), freeFormPlaceValue: 'Boulder' }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  staleSource: Object.freeze({ request: admissibleRequest(boulder.canonicalPlaceId), sourcePosture: Object.freeze({ ...buildAgentPlacePreparationSourcePosture(boulder), freshness: 'STALE' as const }) }),
  unknownRights: Object.freeze({ request: admissibleRequest(boulder.canonicalPlaceId), sourcePosture: Object.freeze({ ...buildAgentPlacePreparationSourcePosture(boulder), rights: 'UNKNOWN_OR_UNRESOLVED' as const }) }),
  conflictingSource: Object.freeze({ request: admissibleRequest(boulder.canonicalPlaceId), sourcePosture: Object.freeze({ ...buildAgentPlacePreparationSourcePosture(boulder), conflict: 'CONFLICTING' as const }) }),
  customerContext: Object.freeze({ request: Object.freeze({ ...admissibleRequest(boulder.canonicalPlaceId), customerContext: true }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  adminContext: Object.freeze({ request: Object.freeze({ ...admissibleRequest(boulder.canonicalPlaceId), actorRole: 'ADMIN' as const, adminContext: true }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  mcpContext: Object.freeze({ request: Object.freeze({ ...admissibleRequest(boulder.canonicalPlaceId), mcpContext: true }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  fairHousing: Object.freeze({ request: Object.freeze({ ...admissibleRequest(boulder.canonicalPlaceId), fairHousingSensitiveRequest: true }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  schoolQuality: Object.freeze({ request: Object.freeze({ ...admissibleRequest(boulder.canonicalPlaceId), schoolQualityRequest: true }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  safety: Object.freeze({ request: Object.freeze({ ...admissibleRequest(boulder.canonicalPlaceId), safetyRequest: true }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  recommendation: Object.freeze({ request: Object.freeze({ ...admissibleRequest(boulder.canonicalPlaceId), recommendationRequested: true }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
  providerRuntime: Object.freeze({ request: Object.freeze({ ...admissibleRequest(boulder.canonicalPlaceId), providerRuntimeRequired: true }), sourcePosture: buildAgentPlacePreparationSourcePosture(boulder) }),
});
