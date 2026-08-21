import { AGENT_PLACE_PREPARATION_P0_CITIES } from "./agentPlacePreparationAdmission";
import { prepareAgentPlaceConversation } from "./agentPlaceConversationPreparation";
import {
  buildAgentBuyerPreparationPacket,
  composeAgentBuyerPreparationBriefing,
  type AgentBuyerPreparationPacket,
  type AgentBuyerPreparationRequest,
} from "./agentBuyerPreparationAdmission";
import type { AgentBriefingComposition } from "./agentBriefingComposition";

export const AGENT_BUYER_CONSULTATION_PREPARATION_STATUS =
  "REIE_AGENT_BUYER_CONSULTATION_PREPARATION_EXPERIENCE_MVV" as const;

export type AgentBuyerConsultationHumanState = Readonly<{
  label:
    | "Complete the consultation choices"
    | "Buyer preparation unavailable"
    | "Ready for your review";
  message: string;
}>;

export type AgentBuyerConsultationExperience = Readonly<{
  status: typeof AGENT_BUYER_CONSULTATION_PREPARATION_STATUS;
  packet: AgentBuyerPreparationPacket;
  composition: AgentBriefingComposition | null;
  humanState: AgentBuyerConsultationHumanState;
  consultationObjective: string | null;
  journeyPosition: string | null;
  cityContext: Readonly<{ name: string; summary: string; href: string }> | null;
  searchStrategyContext: readonly string[];
}>;

function unavailable(
  packet: AgentBuyerPreparationPacket,
): AgentBuyerConsultationExperience {
  const requiresChoices =
    packet.reasons.includes("GOVERNED_BUYER_STAGE_REQUIRED") ||
    packet.reasons.includes("GOVERNED_DISCUSSION_PRIORITIES_REQUIRED");
  return Object.freeze({
    status: AGENT_BUYER_CONSULTATION_PREPARATION_STATUS,
    packet,
    composition: null,
    humanState: requiresChoices
      ? {
          label: "Complete the consultation choices" as const,
          message:
            "Choose a consultation stage and two to four discussion priorities before preparing the briefing.",
        }
      : {
          label: "Buyer preparation unavailable" as const,
          message:
            "This preparation is limited to explicit Agent inputs and governed Buyer consultation context.",
        },
    consultationObjective: null,
    journeyPosition: null,
    cityContext: null,
    searchStrategyContext: [],
  });
}

function strategyContext(request: AgentBuyerPreparationRequest) {
  const context: string[] = [];
  if (request.priorities.includes("SEARCH_GEOGRAPHY"))
    context.push(
      "Define geography from the buyer's stated criteria, without inferring location preferences.",
    );
  if (request.priorities.includes("PROPERTY_NEEDS"))
    context.push(
      "Separate essential property characteristics from flexible considerations before reviewing inventory.",
    );
  if (request.priorities.includes("SEARCH_STRATEGY"))
    context.push(
      "Set an initial search breadth and review rhythm that can be refined as facts become clearer.",
    );
  if (request.priorities.includes("TOURING_PROCESS"))
    context.push(
      "Prepare observation questions before tours rather than treating a first impression as a conclusion.",
    );
  return Object.freeze(context);
}

export function prepareAgentBuyerConsultation(
  request: AgentBuyerPreparationRequest,
): AgentBuyerConsultationExperience {
  const packet = buildAgentBuyerPreparationPacket(request);
  if (packet.admission !== "ADMITTED") return unavailable(packet);

  const place = request.certifiedCity
    ? (AGENT_PLACE_PREPARATION_P0_CITIES.find(
        (candidate) => candidate.canonicalName === request.certifiedCity,
      ) ?? null)
    : null;
  const placeExperience = place
    ? prepareAgentPlaceConversation(place.canonicalPlaceId)
    : null;
  const cityContext = placeExperience?.briefing
    ? Object.freeze({
        name: placeExperience.briefing.city.canonicalName,
        summary: placeExperience.briefing.summary,
        href: "/agent/prepare/place",
      })
    : null;

  return Object.freeze({
    status: AGENT_BUYER_CONSULTATION_PREPARATION_STATUS,
    packet,
    composition: composeAgentBuyerPreparationBriefing(packet),
    humanState: {
      label: "Ready for your review" as const,
      message:
        "Use this session-only briefing to organize the buyer conversation and the next facts to clarify.",
    },
    consultationObjective:
      request.stage === "DISCOVERY"
        ? "Establish goals, timing, search direction, and the process questions that should be resolved before an active search."
        : "Identify what remains to be clarified before the buyer moves into active search preparation and related professional verification.",
    journeyPosition:
      request.stage === "DISCOVERY"
        ? "Discovery is an early preparation point: clarify explicit priorities and explain the next process steps without treating assumptions as settled."
        : "Readiness is a preparation point before active search: confirm open questions, prepare verification items, and organize the next conversation.",
    cityContext,
    searchStrategyContext: strategyContext(request),
  });
}
