import type { Metadata } from "next";

import BuyerConsultationExperience from "@/components/agent/BuyerConsultationExperience";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buyer Preparation | Project Atlas Agent",
  description:
    "Read-only Agent buyer consultation preparation using explicit, session-only inputs.",
};

export default function AgentBuyerConsultationPage() {
  return <BuyerConsultationExperience />;
}
