import type { Metadata } from 'next';

import ClientCasesWorkspace from '@/components/agent/ClientCasesWorkspace';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { title: 'Client Case | Project Atlas Agent', description: 'Private Agent Client Case context.' };

export default async function ClientCasePage({ params }: { params: Promise<{ clientCaseId: string }> }) {
  const { clientCaseId } = await params;
  return <ClientCasesWorkspace clientCaseId={clientCaseId} />;
}
