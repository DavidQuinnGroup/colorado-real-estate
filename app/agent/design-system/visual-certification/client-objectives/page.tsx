import type { Metadata } from 'next';

import { ClientObjectiveVisualFixture } from '@/components/agent/ClientObjectiveVisualFixture';

export const metadata: Metadata = {
  title: 'Client Objectives Visual Certification | Project Atlas',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function ClientObjectivesVisualCertificationPage() {
  return <ClientObjectiveVisualFixture />;
}
