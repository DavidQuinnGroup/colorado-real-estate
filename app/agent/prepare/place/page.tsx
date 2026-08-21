import type { Metadata } from 'next';

import PlaceConversationExperience from '@/components/agent/PlaceConversationExperience';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Place Preparation | Project Atlas Agent',
  description: 'Read-only Agent place conversation preparation using certified City context.',
};

export default function AgentPlaceConversationPage() {
  return <PlaceConversationExperience />;
}
