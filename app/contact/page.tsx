import Link from 'next/link';
import type { Metadata } from 'next';

import JourneyCohesionPanel from '@/components/JourneyCohesionPanel';
import { PublicTrustPage, StandardTrustIntro, TrustList, TrustSection } from '@/components/PublicTrustPage';
import { PUBLIC_CONTACT_EMAIL_STATUS, PUBLIC_NOTIFICATION_EMAIL, PUBLIC_TRUST_REVIEW_STATUS, SITE_NAME, SITE_URL } from '@/lib/publicTrust';

export const metadata: Metadata = {
  title: `Contact | ${SITE_NAME}`,
  description: 'Contact and inquiry routing information for David Quinn Group.',
  alternates: { canonical: `${SITE_URL}/contact` },
  robots: { index: true, follow: true },
};

const contactItems = [
  'Property-specific questions should use the inquiry workflow on an individual property page.',
  'Market strategy requests can use the strategy-intake forms on city market pages.',
  'Public contact, privacy, and accessibility requests route through the contact page and property inquiry workflows until a branded contact email is operational.',
  'Public phone, office address, and branded contact email are not published until brokerage-approved values are confirmed.',
];

export default function ContactPage() {
  return (
    <PublicTrustPage
      eyebrow="Public Trust"
      title="Contact"
      summary="Production contact routing for public inquiries, privacy requests, and accessibility requests without publishing unverified phone or office details."
    >
      <TrustSection title="Production Status">
        <StandardTrustIntro />
        <p>Classification: {PUBLIC_TRUST_REVIEW_STATUS}.</p>
      </TrustSection>

      <TrustSection title="Public Contact">
        <p>
          Branded contact email status: {PUBLIC_CONTACT_EMAIL_STATUS}. Use the property inquiry workflow on an individual property page or
          the market strategy request workflow on market pages until a branded public contact email is operational.
        </p>
        <p>
          Automated service notifications may be sent from {PUBLIC_NOTIFICATION_EMAIL} when configured for the applicable workflow. That
          sender is not presented as the public contact channel.
        </p>
      </TrustSection>

      <TrustSection title="Current Contact Routing">
        <JourneyCohesionPanel
          surface="contact"
          tone="light"
          title="Choose the route that matches the question."
          body="Contact is the advisory endpoint. Property questions should start from a property page, search questions can start in search, and broader timing or planning questions can start with Grand Plan."
          links={[
            { label: 'Search Homes', href: '/search', note: 'Find a property path', destination: 'search' },
            { label: 'Grand Plan', href: '/grand-plan', note: 'Organize priorities', destination: 'grand-plan' },
            { label: 'Home Worth', href: '/home-worth', note: 'Frame seller context', destination: 'home-worth' },
          ]}
        />
        <TrustList items={contactItems} />
        <p>
          Start from the{' '}
          <Link href="/search" className="reie-inline-link font-bold underline underline-offset-4">
            property search
          </Link>{' '}
          and open a listing to submit a property-specific inquiry. Submitting any inquiry is for follow-up routing only and does not
          automatically create a brokerage relationship.
        </p>
        <p>
          Do not submit confidential negotiating positions, personal motivation, financial limits, or other client-confidential information
          until the applicable brokerage relationship and disclosures have been discussed.
        </p>
      </TrustSection>

      <TrustSection title="Form Notice">
        <p>
          Public forms require an email address and may collect optional name, phone, notes, selected timing, market/search criteria, and
          property context. Forms are used for the requested inquiry, saved search, strategy intake, and related follow-up routing. Review
          the <Link href="/privacy" className="reie-inline-link font-bold underline underline-offset-4">Privacy Notice</Link> and{' '}
          <Link href="/terms" className="reie-inline-link font-bold underline underline-offset-4">Terms of Use</Link> before submitting.
        </p>
      </TrustSection>
    </PublicTrustPage>
  );
}
