import type { Metadata } from 'next';

import { PublicTrustPage, StandardTrustIntro, TrustSection } from '@/components/PublicTrustPage';
import { FAIR_HOUSING_CLASSIFICATION, PUBLIC_TRUST_REVIEW_STATUS, SITE_NAME, SITE_URL } from '@/lib/publicTrust';

export const metadata: Metadata = {
  title: `Fair Housing | ${SITE_NAME}`,
  description: 'Fair housing public-trust page for David Quinn Group.',
  alternates: { canonical: `${SITE_URL}/fair-housing` },
  robots: { index: true, follow: true },
};

export default function FairHousingPage() {
  return (
    <PublicTrustPage
      eyebrow="Public Trust"
      title="Fair Housing"
      summary="A text-only fair housing page for the public customer experience."
    >
      <TrustSection title="Production Status">
        <StandardTrustIntro />
        <p>Classification: {PUBLIC_TRUST_REVIEW_STATUS}.</p>
        <p>Fair housing classification: {FAIR_HOUSING_CLASSIFICATION}.</p>
      </TrustSection>

      <TrustSection title="Fair Housing Commitment">
        <p>
          David Quinn Group supports equal access to housing information across the public website, property search, inquiry workflows, and
          follow-up routing.
        </p>
        <p data-testid="public-fair-housing-slogan">Equal Housing Opportunity.</p>
        <p>
          This page does not use an Equal Housing logo or REALTOR mark because no authorized asset or required display instruction is
          published in the repository.
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
