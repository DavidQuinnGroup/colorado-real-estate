import type { Metadata } from 'next';

import { PublicTrustPage, StandardTrustIntro, TrustList, TrustSection } from '@/components/PublicTrustPage';
import { PUBLIC_TRUST_REVIEW_STATUS, SITE_NAME, SITE_URL } from '@/lib/publicTrust';

export const metadata: Metadata = {
  title: `Terms of Use | ${SITE_NAME}`,
  description: 'Draft terms for using David Quinn Group public pages, search, and inquiry tools.',
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
};

const termsItems = [
  'The website provides property search, market context, inquiry routing, and real estate intelligence workflows for review and follow-up.',
  'Listing, search, market, and strategy information can be incomplete, delayed, unavailable, or changed by source systems.',
  'Users should independently verify property facts, availability, pricing, legal status, condition, financing, insurance, and suitability before relying on any information.',
  'Use of the website must not interfere with public routes, protected admin routes, APIs, queues, search infrastructure, or customer data.',
  'Submitting an inquiry or saved-search request does not by itself create a brokerage, agency, fiduciary, or confidential relationship.',
];

export default function TermsPage() {
  return (
    <PublicTrustPage
      eyebrow="Public Trust"
      title="Terms of Use"
      summary="Draft use terms for the current David Quinn Group website and Real Estate Intelligence Engine public workflows."
    >
      <TrustSection title="Review Status">
        <StandardTrustIntro />
        <p>Classification: {PUBLIC_TRUST_REVIEW_STATUS}.</p>
      </TrustSection>

      <TrustSection title="Draft Terms">
        <TrustList items={termsItems} />
      </TrustSection>

      <TrustSection title="No Professional Or Legal Conclusion">
        <p>
          Website content is informational and workflow-oriented. It is not legal, tax, engineering, insurance, lending, inspection, or
          regulatory advice. Any brokerage terms, representation duties, property condition conclusions, or transaction obligations require
          confirmed written agreements and appropriate professional review.
        </p>
      </TrustSection>
    </PublicTrustPage>
  );
}
