import type { Metadata } from 'next';

import ClientTrackerWorkspace from '@/components/agent/ClientTrackerWorkspace';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { title: 'Client Tracker | Project Atlas Agent', description: 'Private Agent workspace for Client context.' };

export default function ClientCasesPage() { return <ClientTrackerWorkspace />; }
