import type { Metadata } from 'next';
import AgentOutputsWorkspace from '@/components/agent/AgentOutputsWorkspace';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Outputs | Project Atlas Agent', description: 'Private owner-scoped immutable OutputVersion history.' };
export default function AgentOutputsPage() { return <AgentOutputsWorkspace />; }
