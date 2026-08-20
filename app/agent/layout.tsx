import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import AgentWorkspaceShell from '@/components/agent/AgentWorkspaceShell';

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function AgentLayout({ children }: { children: ReactNode }) {
  return <AgentWorkspaceShell>{children}</AgentWorkspaceShell>;
}
