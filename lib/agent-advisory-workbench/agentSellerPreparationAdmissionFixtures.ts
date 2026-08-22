import { AGENT_SELLER_PREPARATION_CAPABILITY, AGENT_SELLER_PREPARATION_ROUTE, type AgentSellerPreparationRequest } from "./agentSellerPreparationAdmission";

export const AGENT_SELLER_PREPARATION_FIXTURE = Object.freeze({
  actorIdentityType: "HUMAN_AGENT", actorRole: "AGENT", sessionMechanism: "HUMAN_AGENT_SESSION", capability: AGENT_SELLER_PREPARATION_CAPABILITY, route: AGENT_SELLER_PREPARATION_ROUTE,
  position: "MOVING_TOWARD_MARKET", timing: "THREE_TO_SIX_MONTHS", cityContext: "Boulder", propertyReadiness: "PREPARATION_NEEDS_DISCUSSION", proceedsDiscussion: "PAYOFF_OR_LIEN_QUESTION",
  priorities: ["SELLING_PROCESS", "PROPERTY_CONDITION_PREPARATION", "PRICING_DISCUSSION", "CURRENT_MARKET_QUESTIONS", "PROFESSIONAL_QUESTIONS"],
  customerContext: false, persistenceRequested: false, providerRuntimeRequired: false, adminContext: false, mcpContext: false, protectedClassRequest: false, demographicInferenceRequested: false, suitabilityConclusionRequested: false, pricingRecommendationRequested: false, legalConclusionRequested: false, taxAdviceRequested: false,
} as const satisfies AgentSellerPreparationRequest);
