import type { Metadata } from 'next';

import { ClientCaseScenarioWorkspace } from '@/components/agent/ClientCaseScenarioWorkspace';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { title: 'Working Scenario | Project Atlas', robots: { index: false, follow: false } };

export default async function ClientCaseScenarioPage({ params }: { params: Promise<{ clientCaseId: string; scenarioId: string }> }) {
  const { clientCaseId, scenarioId } = await params;
  return <ClientCaseScenarioWorkspace clientCaseId={clientCaseId} scenarioId={scenarioId} />;
}
