import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function AgentMarketLayout({ children }: { children: ReactNode }) {
  return <section className="fixed inset-0 z-50 overflow-auto bg-[#071014]">{children}</section>;
}
