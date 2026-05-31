import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
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

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section className="fixed inset-0 z-50 overflow-auto bg-[#06080c] text-slate-100">
      {children}
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/admin/layout.tsx
