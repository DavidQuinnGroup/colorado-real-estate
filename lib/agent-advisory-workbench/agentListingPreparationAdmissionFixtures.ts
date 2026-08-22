import { AGENT_LISTING_PREPARATION_CAPABILITY, AGENT_LISTING_PREPARATION_ROUTE, type AgentListingPreparationRequest } from "./agentListingPreparationAdmission";

export const AGENT_LISTING_PREPARATION_FIXTURE = Object.freeze({
  actorIdentityType: "HUMAN_AGENT", actorRole: "AGENT", sessionMechanism: "HUMAN_AGENT_SESSION", capability: AGENT_LISTING_PREPARATION_CAPABILITY, route: AGENT_LISTING_PREPARATION_ROUTE,
  position: "MOVING_TOWARD_LAUNCH", identifiedSellerPropertyConfirmed: true, launchHorizon: "ONE_TO_THREE_MONTHS",
  priorities: ["PRE_LISTING_READINESS", "PROPERTY_FACTS_RECORDS", "CONDITION_REPAIRS_IMPROVEMENTS", "PRESENTATION_MEDIA_ACCESS", "PRICING_MARKET_INPUTS", "LAUNCH_CHECKPOINTS", "PROFESSIONAL_VERIFICATION"],
  customerContext: false, persistenceRequested: false, providerRuntimeRequired: false, adminContext: false, mcpContext: false, propertyIdentityProvided: false, mlsDataRequested: false, publicActivationRequested: false,
  pricingRecommendationRequested: false, marketingRecommendationRequested: false, legalConclusionRequested: false, taxAdviceRequested: false, protectedClassRequest: false, demographicInferenceRequested: false, suitabilityConclusionRequested: false,
} as const satisfies AgentListingPreparationRequest);
