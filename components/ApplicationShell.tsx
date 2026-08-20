'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import BrokerageAttribution from '@/components/BrokerageAttribution';
import PlatformFooter from '@/components/Footer';
import PublicNavigation from '@/components/PublicNavigation';

export default function ApplicationShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const usesPrivateShell = pathname?.startsWith('/agent') || pathname?.startsWith('/admin');

  if (usesPrivateShell) return <>{children}</>;

  return (
    <>
      <BrokerageAttribution />
      <PublicNavigation />
      <main className="flex-grow">{children}</main>
      <PlatformFooter />
    </>
  );
}
