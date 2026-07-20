import type { Metadata } from 'next';

import { PublicTrustPage, StandardTrustIntro, TrustSection } from '@/components/PublicTrustPage';
import { PUBLIC_TRUST_REVIEW_STATUS, SITE_NAME, SITE_URL } from '@/lib/publicTrust';

export const metadata: Metadata = {
  title: `Fair Housing | ${SITE_NAME}`,
  description: 'Draft fair housing public-trust page for David Quinn Group.',
  alternates: { canonical: `${SITE_URL}/fair-housing` },
  robots: { index: true, follow: true },
};

export default function FairHousingPage() {
  return (
    <PublicTrustPage
      eyebrow="Public Trust"
      title="Fair Housing"
      summary="A text-only fair housing page for the controlled public beta surface, pending owner and counsel review."
    >
      <TrustSection title="Review Status">
        <StandardTrustIntro />
        <p>Classification: {PUBLIC_TRUST_REVIEW_STATUS}.</p>
      </TrustSection>

      <TrustSection title="Fair Housing Commitment">
        <p>
          David Quinn Group intends the public website, property search, inquiry workflows, and follow-up routing to support equal access to
          housing information and to avoid discriminatory steering, exclusion, preference, or limitation.
        </p>
        <p>
          This draft page does not use an Equal Housing logo or REALTOR mark because no authorized asset or required display instruction was
          verified during this package.
        </p>
      </TrustSection>

      <TrustSection title="Official Information">
        <p>
          Fair housing complaint and rights information is available from the U.S. Department of Housing and Urban Development at{' '}
          <a
            href="https://www.hud.gov/program_offices/fair_housing_equal_opp"
            className="font-bold text-cyan-100 underline underline-offset-4"
            rel="noopener noreferrer"
          >
            hud.gov/program_offices/fair_housing_equal_opp
          </a>
          .
        </p>
      </TrustSection>
    </PublicTrustPage>
  );
}
