import Link from 'next/link';
import type { Metadata } from 'next';

import { PublicTrustPage, StandardTrustIntro, TrustList, TrustSection } from '@/components/PublicTrustPage';
import { PUBLIC_TRUST_REVIEW_STATUS, SITE_NAME, SITE_URL } from '@/lib/publicTrust';

export const metadata: Metadata = {
  title: `Contact | ${SITE_NAME}`,
  description: 'Contact and inquiry routing information for David Quinn Group.',
  alternates: { canonical: `${SITE_URL}/contact` },
  robots: { index: true, follow: true },
};

const contactItems = [
  'Property-specific questions should use the inquiry workflow on an individual property page.',
  'Market strategy requests can use the strategy-intake forms on city market pages.',
  'A verified public email address, phone number, office address, and privacy/accessibility contact channel still require owner confirmation.',
];

export default function ContactPage() {
  return (
    <PublicTrustPage
      eyebrow="Public Trust"
      title="Contact"
      summary="Current contact routing for public beta without publishing unverified phone, address, brokerage, or email details."
    >
      <TrustSection title="Review Status">
        <StandardTrustIntro />
        <p>Classification: {PUBLIC_TRUST_REVIEW_STATUS}.</p>
      </TrustSection>

      <TrustSection title="Current Contact Routing">
        <TrustList items={contactItems} />
        <p>
          Start from the{' '}
          <Link href="/search" className="font-bold text-cyan-100 underline underline-offset-4">
            property search
          </Link>{' '}
          and open a listing to submit a property-specific inquiry. Submitting any inquiry is for follow-up routing only and does not
          automatically create a brokerage relationship.
        </p>
      </TrustSection>

      <TrustSection title="Form Notice">
        <p>
          Public forms require an email address and may collect optional name, phone, notes, selected timing, market/search criteria, and
          property context. Forms are used for the requested inquiry, saved search, strategy intake, and related follow-up routing. Review
          the <Link href="/privacy" className="font-bold text-cyan-100 underline underline-offset-4">Privacy Notice</Link> and{' '}
          <Link href="/terms" className="font-bold text-cyan-100 underline underline-offset-4">Terms of Use</Link> before submitting.
        </p>
      </TrustSection>
    </PublicTrustPage>
  );
}
