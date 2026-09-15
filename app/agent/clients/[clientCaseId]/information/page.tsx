import type { Metadata } from 'next';

import { ClientCaseInformationWorkspace } from '@/components/agent/ClientCaseInformationWorkspace';
import { informationIntentFromRequirement } from '@/lib/clientCaseInformationIntent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = {
  title: 'Client Case Information | Project Atlas Agent',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default async function ClientCaseInformationPage({
  params,
  searchParams,
}: {
  params: Promise<{ clientCaseId: string }>;
  searchParams: Promise<{ requirement?: string }>;
}) {
  const [{ clientCaseId }, query] = await Promise.all([params, searchParams]);
  return <ClientCaseInformationWorkspace clientCaseId={clientCaseId} intent={informationIntentFromRequirement(query.requirement)} />;
}
