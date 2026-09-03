import type { Metadata } from 'next';

import ClientCasesWorkspace from '@/components/agent/ClientCasesWorkspace';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { title: 'Client Work | Project Atlas Agent', description: 'Private Agent workspace for durable Client Case context.' };

export default function ClientCasesPage() { return <ClientCasesWorkspace />; }
