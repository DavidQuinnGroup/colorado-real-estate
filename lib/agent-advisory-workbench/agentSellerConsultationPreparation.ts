import { buildAgentSellerPreparationPacket, composeAgentSellerPreparationBriefing, type AgentSellerPreparationPacket, type AgentSellerPreparationRequest } from "./agentSellerPreparationAdmission";
import type { AgentBriefingComposition } from "./agentBriefingComposition";
import { buildAgentSellerProfessionalPlaybook, type AgentSellerProfessionalPlaybook } from "./agentSellerProfessionalPlaybook";

export const AGENT_SELLER_CONSULTATION_PREPARATION_STATUS = "REIE_AGENT_SELLER_CONSULTATION_PREPARATION_READINESS_AND_ADMISSION_MVV" as const;
export type AgentSellerConsultationExperience = Readonly<{ status: typeof AGENT_SELLER_CONSULTATION_PREPARATION_STATUS; packet: AgentSellerPreparationPacket; composition: AgentBriefingComposition | null; playbook: AgentSellerProfessionalPlaybook | null; humanState: Readonly<{ label: "Complete the consultation choices" | "Seller preparation unavailable" | "Ready for your review"; message: string; }>; }>;
export function prepareAgentSellerConsultation(request: AgentSellerPreparationRequest): AgentSellerConsultationExperience {
  const packet = buildAgentSellerPreparationPacket(request);
  if (packet.admission !== "ADMITTED") {
    const needsChoices = packet.reasons.includes("GOVERNED_SELLER_POSITION_REQUIRED") || packet.reasons.includes("GOVERNED_SELLER_TOPICS_REQUIRED");
    return Object.freeze({ status: AGENT_SELLER_CONSULTATION_PREPARATION_STATUS, packet, composition: null, playbook: null, humanState: { label: (needsChoices ? "Complete the consultation choices" : "Seller preparation unavailable") as "Complete the consultation choices" | "Seller preparation unavailable", message: needsChoices ? "Choose a consultation position and at least two Seller topics before preparing the briefing." : "This preparation is limited to explicit Agent inputs and governed Seller consultation context." } });
  }
  const composition = composeAgentSellerPreparationBriefing(packet);
  return Object.freeze({ status: AGENT_SELLER_CONSULTATION_PREPARATION_STATUS, packet, composition, playbook: composition ? buildAgentSellerProfessionalPlaybook(request) : null, humanState: { label: "Ready for your review" as const, message: "Use this session-only briefing to organize a Seller consultation and the next facts to clarify." } });
}
