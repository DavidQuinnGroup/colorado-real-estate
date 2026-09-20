import type { Metadata } from 'next';

import { ClientObjectivePropertyRelationshipVisualFixture } from '@/components/agent/ClientObjectivePropertyRelationshipVisualFixture';

export const metadata: Metadata = {
  title: 'Objective Property Workflow Visual Certification | Project Atlas',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function ObjectivePropertyRelationshipsVisualCertificationPage() {
  return <ClientObjectivePropertyRelationshipVisualFixture />;
}
