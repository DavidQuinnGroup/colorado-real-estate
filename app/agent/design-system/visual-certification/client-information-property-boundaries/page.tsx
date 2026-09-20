import type { Metadata } from 'next';

import { ClientInformationPropertyBoundariesVisualFixture } from '@/components/agent/ClientInformationPropertyBoundariesVisualFixture';

export const metadata: Metadata = {
  title: 'Client Information Property Boundaries Visual Certification | Project Atlas',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function ClientInformationPropertyBoundariesVisualCertificationPage() {
  return <ClientInformationPropertyBoundariesVisualFixture />;
}
