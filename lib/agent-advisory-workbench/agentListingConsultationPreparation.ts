import type { AgentBriefingComposition } from "./agentBriefingComposition";
import { buildAgentListingPreparationPacket, composeAgentListingPreparationBriefing, type AgentListingPreparationPacket, type AgentListingPreparationRequest } from "./agentListingPreparationAdmission";
import { buildAgentListingProfessionalPlaybook, type AgentListingProfessionalPlaybook } from "./agentListingProfessionalPlaybook";

export const AGENT_LISTING_CONSULTATION_PREPARATION_STATUS = "REIE_AGENT_LISTING_PREPARATION_READINESS_AND_ADMISSION_MVV" as const;
export type AgentListingConsultationExperience = Readonly<{ status: typeof AGENT_LISTING_CONSULTATION_PREPARATION_STATUS; packet: AgentListingPreparationPacket; composition: AgentBriefingComposition | null; playbook: AgentListingProfessionalPlaybook | null; humanState: Readonly<{ label: "Complete the listing choices" | "Listing preparation unavailable" | "Ready for your review"; message: string; }>; }>;

export function prepareAgentListingConsultation(request: AgentListingPreparationRequest): AgentListingConsultationExperience {
  const packet = buildAgentListingPreparationPacket(request);
  if (packet.admission !== "ADMITTED") {
    const needsChoices = packet.reasons.includes("GOVERNED_LISTING_POSITION_REQUIRED") || packet.reasons.includes("GOVERNED_LISTING_TOPICS_REQUIRED") || packet.reasons.includes("AGENT_PROPERTY_CONFIRMATION_REQUIRED");
    const humanState: AgentListingConsultationExperience["humanState"] = { label: needsChoices ? "Complete the listing choices" : "Listing preparation unavailable", message: needsChoices ? "Confirm the identified Seller property, choose a preparation position, and select at least two Listing topics." : "This preparation is limited to explicit Agent inputs and governed listing-readiness context." };
    return Object.freeze({ status: AGENT_LISTING_CONSULTATION_PREPARATION_STATUS, packet, composition: null, playbook: null, humanState });
  }
  const composition = composeAgentListingPreparationBriefing(packet);
  const humanState: AgentListingConsultationExperience["humanState"] = { label: "Ready for your review", message: "Use this session-only briefing to organize listing preparation questions, evidence gaps, and professional checkpoints." };
  return Object.freeze({ status: AGENT_LISTING_CONSULTATION_PREPARATION_STATUS, packet, composition, playbook: composition ? buildAgentListingProfessionalPlaybook(request) : null, humanState });
}
