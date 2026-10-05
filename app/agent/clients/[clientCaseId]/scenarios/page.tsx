import type { Metadata } from 'next';

import { ClientCaseScenarioIndexWorkspace } from '@/components/agent/ClientCaseScenarioIndexWorkspace';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { title: 'Client Scenarios | Project Atlas', robots: { index: false, follow: false } };

export default async function ClientCaseScenariosPage({ params }: { params: Promise<{ clientCaseId: string }> }) {
  const { clientCaseId } = await params;
  return <ClientCaseScenarioIndexWorkspace clientCaseId={clientCaseId} />;
}
