import type { Metadata } from 'next';

import MarketUpdatePreparationExperience from '@/components/agent/MarketUpdatePreparationExperience';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Market Update Preparation | Project Atlas Agent',
  description: 'Session-only Agent preparation for a dated, evidence-aware market update.',
};

export default function AgentMarketUpdatePreparationPage() {
  return <MarketUpdatePreparationExperience />;
}
