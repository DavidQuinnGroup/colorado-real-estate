import type { Metadata } from 'next';

import ClientAuthorizationWorkspace from '@/components/agent/ClientAuthorizationWorkspace';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { title: 'Client Authorization | Project Atlas Agent', description: 'Private Agent workspace for bounded synthetic Client Authorization governance.' };

export default function ClientAuthorizationPage() { return <ClientAuthorizationWorkspace />; }
