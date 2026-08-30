import type { Metadata } from 'next';

import BuyerDecisionBriefPreview from '@/components/agent/BuyerDecisionBriefPreview';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Buyer Decision Brief | Project Atlas Agent', description: 'Agent-only review of bounded Buyer Decision Brief fixtures.' };

export default function BuyerDecisionBriefPage() {
  return <BuyerDecisionBriefPreview />;
}
