import type { Metadata } from 'next';

import { PublicTrustPage, StandardTrustIntro, TrustList, TrustSection } from '@/components/PublicTrustPage';
import { PUBLIC_TRUST_REVIEW_STATUS, SITE_NAME, SITE_URL } from '@/lib/publicTrust';

export const metadata: Metadata = {
  title: `Accessibility | ${SITE_NAME}`,
  description: 'Draft accessibility statement and owner-review items for David Quinn Group.',
  alternates: { canonical: `${SITE_URL}/accessibility` },
  robots: { index: true, follow: true },
};

const accessibilityItems = [
  'Public trust pages use semantic headings, readable text, keyboard-focusable links, and responsive layouts.',
  'The repository includes interactive search, map, inquiry, and saved-search experiences that still require owner-directed accessibility review.',
  'No completed accessibility conformance claim is made by this draft page.',
  'A verified public accessibility contact channel still requires owner confirmation.',
];

export default function AccessibilityPage() {
  return (
    <PublicTrustPage
      eyebrow="Public Trust"
      title="Accessibility"
      summary="A draft accessibility statement that identifies the current review posture without claiming completed conformance."
    >
      <TrustSection title="Review Status">
        <StandardTrustIntro />
        <p>Classification: {PUBLIC_TRUST_REVIEW_STATUS}.</p>
      </TrustSection>

      <TrustSection title="Current Accessibility Posture">
        <TrustList items={accessibilityItems} />
      </TrustSection>

      <TrustSection title="Request Channel">
        <p>
          Until a public accessibility email or phone number is owner-confirmed, accessibility requests should be routed through the
          owner-confirmed contact channel before customer beta. The general contact page records this as an owner-verification item.
        </p>
      </TrustSection>
    </PublicTrustPage>
  );
}
