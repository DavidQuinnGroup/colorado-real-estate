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
  return (
    <div
      data-testid="reie-admin-page"
      data-page-route="/admin"
      data-page-module="master-control-panel"
      data-page-component="MasterControlPanel"
      data-page-terminal="Terminal 5"
      data-page-control-route="/api/admin/control-state"
      data-page-intake-route="/api/admin/intake-signals"
      data-page-crm-route="/api/admin/crm-tasks"
      data-page-alert-route="/api/process-alerts"
      data-page-mls-status-route="/api/mls/status"
      data-page-mls-retry-route="/api/mls/retry"
      data-page-noindex="true"
    >
      <MasterControlPanel />
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/admin/page.tsx
