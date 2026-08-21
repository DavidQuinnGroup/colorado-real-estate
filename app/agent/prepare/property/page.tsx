import type { Metadata } from 'next';

import PropertyConversationExperience from '@/components/agent/PropertyConversationExperience';
import { getAgentPropertyConversationCandidates } from '@/lib/agent-advisory-workbench/agentPropertyConversationPreparationRepository';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Property Preparation | Project Atlas Agent',
  description: 'Read-only Agent property conversation preparation using certified repository-local listing facts.',
};

export default async function AgentPropertyConversationPage() {
  const candidates = await getAgentPropertyConversationCandidates();
  return <PropertyConversationExperience candidates={candidates} />;
}
