import type { ReactNode } from 'react';
import './globals.css';
import PlatformFooter from '@/components/Footer';
import { Lexend } from 'next/font/google';
import { realEstateAgentSchema } from '@/lib/schema/realEstateAgentSchema';

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
});

type RootLayoutProps = {
  children: ReactNode;
};

export const metadata = {
  title: 'David Quinn Group | Real Estate Intelligence Engine',
  description:
    "Advanced structural forensics, efficiency auditing, and strategic real estate consultation for Colorado's Front Range.",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${lexend.variable} h-full w-full bg-[#050505]`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentSchema) }} />
      </head>
      <body className="flex h-full w-full flex-col font-sans antialiased">
        <main className="flex-grow">{children}</main>
        <PlatformFooter />
      </body>
    </html>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/layout.tsx
