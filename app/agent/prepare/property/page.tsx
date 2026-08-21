import type { Metadata } from 'next';

import PropertyConversationExperience from '@/components/agent/PropertyConversationExperience';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Property Preparation | Project Atlas Agent',
  description: 'Read-only Agent property conversation preparation using certified repository-local listing facts.',
};

export default function AgentPropertyConversationPage() {
  return <PropertyConversationExperience />;
}
