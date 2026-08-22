import type { Metadata } from "next";
import SellerConsultationExperience from "@/components/agent/SellerConsultationExperience";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Seller Preparation | Project Atlas", description: "Read-only Agent seller consultation preparation using explicit, session-only inputs." };
export default function AgentSellerConsultationPage() { return <SellerConsultationExperience />; }
