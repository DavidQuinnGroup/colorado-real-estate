import type { ReactNode } from 'react';
import './globals.css';
import BrokerageAttribution from '@/components/BrokerageAttribution';
import PlatformFooter from '@/components/Footer';
import PublicNavigation from '@/components/PublicNavigation';
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
  title: 'David Quinn Group | Colorado Real Estate Advisory',
  description:
    "Construction-informed real estate advisory, property search, and strategic planning for Colorado's Front Range.",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${lexend.variable} h-full w-full overflow-x-hidden bg-[#050505]`}>
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
      <body className="flex min-h-full w-full max-w-full flex-col overflow-x-hidden font-sans antialiased">
        <BrokerageAttribution />
        <PublicNavigation />
        <main className="flex-grow">{children}</main>
        <PlatformFooter />
      </body>
    </html>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/layout.tsx
