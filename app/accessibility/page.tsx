import Link from 'next/link';
import type { Metadata } from 'next';

import { PublicTrustPage, StandardTrustIntro, TrustList, TrustSection } from '@/components/PublicTrustPage';
import { PUBLIC_CONTACT_EMAIL_STATUS, PUBLIC_TRUST_REVIEW_STATUS, SITE_NAME, SITE_URL } from '@/lib/publicTrust';

export const metadata: Metadata = {
  title: `Accessibility | ${SITE_NAME}`,
  description: 'Accessibility statement and support contact information for David Quinn Group.',
  alternates: { canonical: `${SITE_URL}/accessibility` },
  robots: { index: true, follow: true },
};

const accessibilityItems = [
  'Public trust pages use semantic headings, readable text, keyboard-focusable links, and responsive layouts.',
  'Interactive search, map, inquiry, and saved-search experiences remain subject to periodic accessibility review as the product changes.',
  'No completed accessibility conformance certification is claimed.',
  'Accessibility requests route through the contact page until a branded public contact email is operational.',
];

export default function AccessibilityPage() {
  return (
    <PublicTrustPage
      eyebrow="Public Trust"
      title="Accessibility"
      summary="An accessibility statement that identifies the current support channel without claiming completed third-party conformance certification."
    >
      <TrustSection title="Production Status">
        <StandardTrustIntro />
        <p>Classification: {PUBLIC_TRUST_REVIEW_STATUS}.</p>
      </TrustSection>

      <TrustSection title="Current Accessibility Posture">
        <TrustList items={accessibilityItems} />
      </TrustSection>

      <TrustSection title="Request Channel">
        <p>
          Branded contact email status: {PUBLIC_CONTACT_EMAIL_STATUS}. Accessibility requests should route through the{' '}
          <Link href="/contact" className="font-bold text-cyan-100 underline underline-offset-4">
            contact page
          </Link>{' '}
          until a branded public contact email is operational. Include the page, device, browser, assistive technology when applicable, and a
          short description of the issue.
        </p>
      </TrustSection>
    </PublicTrustPage>
  );
}
