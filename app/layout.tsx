import type { ReactNode } from 'react';
import './globals.css';
import BrokerageAttribution from '@/components/BrokerageAttribution';
import PlatformFooter from '@/components/Footer';
import { Lexend } from 'next/font/google';
import { realEstateAgentSchema } from '@/lib/schema/realEstateAgentSchema';

const SITE_URL = 'https://davidquinngroup.com';
const REAL_ESTATE_AGENT_ID = `${SITE_URL}/#real-estate-agent`;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const realEstateAgentSchemaGraph = realEstateAgentSchema['@graph'];

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
        <script
          type="application/ld+json"
          data-testid="reie-real-estate-agent-schema"
          data-agent-schema-type="RealEstateAgent"
          data-agent-schema-site-url={SITE_URL}
          data-agent-schema-agent-id={REAL_ESTATE_AGENT_ID}
          data-agent-schema-organization-id={ORGANIZATION_ID}
          data-agent-schema-graph-count={realEstateAgentSchemaGraph.length}
          data-agent-schema-has-property-search="true"
          data-agent-schema-has-reie-service="true"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentSchema) }}
        />
      </head>
      <body className="flex h-full w-full flex-col font-sans antialiased">
        <BrokerageAttribution />
        <main className="flex-grow">{children}</main>
        <PlatformFooter />
      </body>
    </html>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/layout.tsx
