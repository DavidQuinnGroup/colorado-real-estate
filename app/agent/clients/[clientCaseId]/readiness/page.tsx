import type { Metadata } from 'next';

import { ClientCaseReadinessWorkspace } from '@/components/agent/ClientCaseReadinessWorkspace';

export const metadata: Metadata = {
  title: 'Client Case Readiness | Project Atlas',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default async function ClientCaseReadinessPage({ params }: { params: Promise<{ clientCaseId: string }> }) {
  const { clientCaseId } = await params;
  return <ClientCaseReadinessWorkspace clientCaseId={clientCaseId} />;
}
