import type { Metadata } from 'next';

import DeadLetterInspector from '@/components/admin/DeadLetterInspector';

export const metadata: Metadata = {
  title: 'REIE Dead-Letter Queue Inspector | David Quinn Group',
  description:
    'Internal David Quinn Group Real Estate Intelligence Engine operations page for inspecting failed queue jobs, source queue concentration, and retry guidance.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function DeadLetterPage() {
  return <DeadLetterInspector />;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/admin/dead-letter/page.tsx
