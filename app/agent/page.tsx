import AgentWorkspaceHome from '@/components/agent/AgentWorkspaceHome';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Agent Workspace | Project Atlas', description: 'Private Agent navigation and durable-work discovery.' };

export default function AgentWorkspaceHomePage() {
  return <AgentWorkspaceHome />;
}
