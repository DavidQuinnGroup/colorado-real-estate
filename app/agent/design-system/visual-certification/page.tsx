import type { Metadata } from 'next';

import { DesignSystemVisualCertificationFixture } from '@/components/design-system/DesignSystemVisualCertificationFixture';

export const metadata: Metadata = {
  title: 'Liquid Glass Visual Certification | Project Atlas',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function DesignSystemVisualCertificationPage() {
  return <DesignSystemVisualCertificationFixture />;
}
