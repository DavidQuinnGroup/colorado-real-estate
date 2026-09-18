import type { Metadata } from 'next';

import { ClientContextVisualFixture } from '@/components/agent/ClientContextVisualFixture';

export const metadata: Metadata = {
  title: 'Client Context Visual Certification | Project Atlas',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function ClientContextVisualCertificationPage() {
  return <ClientContextVisualFixture />;
}
