import type { Metadata } from 'next';

import SellerDecisionBriefCompositionPreview from '@/components/agent/SellerDecisionBriefCompositionPreview';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Seller Presentation | Project Atlas',
  description: 'Agent-visible Seller Decision Brief composition, Seller preview, and print preview foundation.',
};

export default function AgentSellerPresentationPage() {
  return <SellerDecisionBriefCompositionPreview />;
}
