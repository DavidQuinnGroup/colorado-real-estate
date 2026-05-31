import type { Metadata } from 'next';

import MasterControlPanel from '@/components/admin/MasterControlPanel';

export const metadata: Metadata = {
  title: 'REIE Master Control Panel | David Quinn Group',
  description:
    'Operational command center for the David Quinn Group Real Estate Intelligence Engine, including visibility controls, lead intake, MLS operations, and search infrastructure.',
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

export default function AdminPage() {
  return <MasterControlPanel />;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/admin/page.tsx
