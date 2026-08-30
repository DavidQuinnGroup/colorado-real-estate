import type { Metadata } from 'next';

import ProfessionalInputWorkflow from '@/components/agent/ProfessionalInputWorkflow';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Professional Inputs | Project Atlas Agent',
  description: 'Private Agent workflow for governed professional input requests, evidence review, and admitted history.',
};

export default function AgentProfessionalInputPage() {
  return <ProfessionalInputWorkflow />;
}
