import type { Metadata } from 'next';

import { ClientFinancialPositionVisualFixture } from '@/components/agent/ClientFinancialPositionVisualFixture';

export const metadata: Metadata = {
  title: 'Client Financial Position Visual Certification | Project Atlas',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function ClientFinancialPositionVisualCertificationPage() {
  return <ClientFinancialPositionVisualFixture />;
}
