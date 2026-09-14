import type { Metadata } from 'next';

import { ClientCaseReadinessVisualFixture } from '@/components/agent/ClientCaseReadinessVisualFixture';

export const metadata: Metadata = {
  title: 'Client Readiness Visual Certification | Project Atlas',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function ClientCaseReadinessVisualCertificationPage() {
  return <ClientCaseReadinessVisualFixture />;
}
