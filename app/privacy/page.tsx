import type { Metadata } from 'next';

import { PublicTrustPage, StandardTrustIntro, TrustList, TrustSection } from '@/components/PublicTrustPage';
import {
  PUBLIC_TRUST_REVIEW_STATUS,
  SITE_NAME,
  SITE_URL,
  unavailableOrUnverifiedPractices,
  verifiedDataPractices,
} from '@/lib/publicTrust';

export const metadata: Metadata = {
  title: `Privacy Notice | ${SITE_NAME}`,
  description: 'Draft privacy notice for David Quinn Group public forms and Real Estate Intelligence Engine workflows.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <PublicTrustPage
      eyebrow="Public Trust"
      title="Privacy Notice"
      summary="A draft, behavior-grounded privacy notice for the current website, property inquiry, saved-search, and strategy-intake workflows."
    >
      <TrustSection title="Review Status">
        <StandardTrustIntro />
        <p>Classification: {PUBLIC_TRUST_REVIEW_STATUS}.</p>
      </TrustSection>

      <TrustSection title="Information The Site Currently Collects">
        <TrustList items={verifiedDataPractices.slice(0, 4)} />
      </TrustSection>

      <TrustSection title="How Submitted Information Is Used">
        <p>
          Submitted information is used to route property inquiries, saved searches, strategy-intake requests, CRM follow-up tasks, and
          service communications that support the requested real estate workflow.
        </p>
        <p>
          Submitting a form does not by itself create a brokerage relationship, agency relationship, representation agreement, or obligation
          to provide brokerage services.
        </p>
      </TrustSection>

      <TrustSection title="Email, Unsubscribe, And Tracking">
        <p>
          Repository evidence shows unsubscribe handling and first-party click-tracking redirects for saved-search and digest email flows.
          Tracking is used for internal delivery and engagement diagnostics, and the application avoids tracking when required identifiers
          are missing or when a user is unsubscribed.
        </p>
      </TrustSection>

      <TrustSection title="Owner-Review Items">
        <TrustList items={unavailableOrUnverifiedPractices} />
      </TrustSection>
    </PublicTrustPage>
  );
}
