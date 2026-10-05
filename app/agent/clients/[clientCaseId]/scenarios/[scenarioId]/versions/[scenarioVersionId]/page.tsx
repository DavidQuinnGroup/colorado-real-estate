import type { Metadata } from 'next';

import { ClientCaseScenarioWorkspace } from '@/components/agent/ClientCaseScenarioWorkspace';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { title: 'Analysis Version | Project Atlas', robots: { index: false, follow: false } };

export default async function ClientCaseScenarioVersionPage({ params }: { params: Promise<{ clientCaseId: string; scenarioId: string; scenarioVersionId: string }> }) {
  const { clientCaseId, scenarioId, scenarioVersionId } = await params;
  return <ClientCaseScenarioWorkspace clientCaseId={clientCaseId} scenarioId={scenarioId} scenarioVersionId={scenarioVersionId} />;
}
