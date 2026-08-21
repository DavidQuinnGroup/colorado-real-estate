import type { Metadata } from 'next';

import MarketConversationExperience from '@/components/agent/MarketConversationExperience';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Market Preparation | Project Atlas Agent',
  description: 'Read-only Agent market conversation preparation using certified repository-local market context.',
};

export default function AgentMarketConversationPage() {
  return <MarketConversationExperience />;
}
