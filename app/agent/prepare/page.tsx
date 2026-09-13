import type { Metadata } from 'next';

import IntelligenceWorkspace from '@/components/agent/IntelligenceWorkspace';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Intelligence | Project Atlas Agent',
  description: 'Read-only Agent entry point for Property, Location, and Market Intelligence.',
};

export default function AgentIntelligencePage() {
  return <IntelligenceWorkspace />;
}
