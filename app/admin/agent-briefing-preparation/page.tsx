import type { Metadata } from 'next';

import AgentConversationPreparationCompositionProof from '@/components/AgentConversationPreparationCompositionProof';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Agent Conversation Preparation | REIE Admin',
  description: 'Protected, read-only synthetic composition proof for human-agent preparation.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function AgentBriefingPreparationPage() {
  return <AgentConversationPreparationCompositionProof />;
}
