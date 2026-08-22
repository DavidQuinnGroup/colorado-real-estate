import type { Metadata } from 'next';

import PlaceConversationExperience from '@/components/agent/PlaceConversationExperience';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Location Preparation | Project Atlas',
  description: 'Read-only Agent location conversation preparation using certified City context.',
};

export default function AgentPlaceConversationPage() {
  return <PlaceConversationExperience />;
}
