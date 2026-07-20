import type { Metadata } from 'next';

import { PublicTrustPage, StandardTrustIntro, TrustList, TrustSection } from '@/components/PublicTrustPage';
import { PUBLIC_TRUST_REVIEW_STATUS, SITE_NAME, SITE_URL } from '@/lib/publicTrust';

export const metadata: Metadata = {
  title: `Brokerage Disclosures | ${SITE_NAME}`,
  description: 'Draft brokerage disclosure review page for David Quinn Group.',
  alternates: { canonical: `${SITE_URL}/brokerage-disclosures` },
  robots: { index: true, follow: true },
};

const verifiedItems = [
  'Repository sources identify the public brand as David Quinn Group.',
  'Repository sources identify the public product as the Real Estate Intelligence Engine.',
  'Repository sources identify Colorado, Boulder, Denver, and the Front Range as public market context.',
];

const ownerItems = [
  'Brokerage affiliation and responsible broker.',
  'Colorado license number and exact license display requirement.',
  'Office address, public phone number, and approved public email address.',
  'Required agency, compensation, affiliated-business, MLS/IDX, REALTOR, or Equal Housing disclosures.',
];

export default function BrokerageDisclosuresPage() {
  return (
    <PublicTrustPage
      eyebrow="Public Trust"
      title="Brokerage Disclosures"
      summary="A draft disclosure page that separates verified repository facts from owner-confirmation requirements."
    >
      <TrustSection title="Review Status">
        <StandardTrustIntro />
        <p>Classification: {PUBLIC_TRUST_REVIEW_STATUS}.</p>
      </TrustSection>

      <TrustSection title="Verified Repository Facts">
        <TrustList items={verifiedItems} />
      </TrustSection>

      <TrustSection title="Owner Confirmation Required">
        <TrustList items={ownerItems} />
      </TrustSection>
    </PublicTrustPage>
  );
}
