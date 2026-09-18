import type { Metadata } from 'next';

import { ClientCommandCenterVisualFixture } from '@/components/agent/ClientCommandCenterVisualFixture';

export const metadata: Metadata = {
  title: 'Client Command Center Visual Certification | Project Atlas',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function ClientCommandCenterVisualCertificationPage() {
  return <ClientCommandCenterVisualFixture />;
}
