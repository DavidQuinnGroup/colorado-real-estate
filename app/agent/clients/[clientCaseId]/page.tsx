import type { Metadata } from 'next';

import ClientCommandCenter from '@/components/agent/ClientCommandCenter';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { title: 'Client | Project Atlas Agent', description: 'Private Agent Client workspace.' };

export default async function ClientCasePage({ params }: { params: Promise<{ clientCaseId: string }> }) {
  const { clientCaseId } = await params;
  return <ClientCommandCenter clientCaseId={clientCaseId} />;
}
