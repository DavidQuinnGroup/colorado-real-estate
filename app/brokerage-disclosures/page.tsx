import type { Metadata } from 'next';

import { PublicTrustPage, StandardTrustIntro, TrustList, TrustSection } from '@/components/PublicTrustPage';
import {
  BROKERAGE_FIRM_NAME,
  COMPASS_BRANDING_CLASSIFICATION,
  COMPASS_MARKETING_APPROVAL_GATE,
  PUBLIC_CONTACT_EMAIL_STATUS,
  PUBLIC_TRUST_REVIEW_STATUS,
  SITE_NAME,
  SITE_URL,
  externalApprovalItems,
  ownerVerificationRegister,
} from '@/lib/publicTrust';

export const metadata: Metadata = {
  title: `Brokerage Disclosures | ${SITE_NAME}`,
  description: 'Brokerage disclosure page for David Quinn Group.',
  alternates: { canonical: `${SITE_URL}/brokerage-disclosures` },
  robots: { index: true, follow: true },
};

const verifiedItems = [
  'Repository sources identify the public brand as David Quinn Group.',
  'Repository sources identify the public product as the Real Estate Intelligence Engine.',
  'Repository sources identify Colorado, Boulder, Denver, and the Front Range as public market context.',
  `Owner-supplied Compass policy evidence identifies the Brokerage Firm as ${BROKERAGE_FIRM_NAME}.`,
  `Public contact, privacy, and accessibility requests route through the contact page while branded contact email status is ${PUBLIC_CONTACT_EMAIL_STATUS}.`,
];

const ownerItems = [
  'Responsible broker, if required for public display.',
  'Colorado license number and exact license display requirement, if required for public display.',
  'Office address, public phone number, and approved branded or Compass public contact email address.',
  'Required agency, compensation, affiliated-business, MLS/IDX, REALTOR, or Equal Housing disclosures.',
];

export default function BrokerageDisclosuresPage() {
  return (
    <PublicTrustPage
      eyebrow="Public Trust"
      title="Brokerage Disclosures"
      summary="A brokerage disclosure page that separates verified public facts from items requiring external brokerage, Compass, MLS, or counsel approval."
    >
      <TrustSection title="Production Status">
        <StandardTrustIntro />
        <p>Classification: {PUBLIC_TRUST_REVIEW_STATUS}.</p>
      </TrustSection>

      <TrustSection title="Verified Repository Facts">
        <TrustList items={verifiedItems} />
      </TrustSection>

      <TrustSection title="Compass And Brokerage Gates">
        <p>Compass marketing approval gate: {COMPASS_MARKETING_APPROVAL_GATE}.</p>
        <p>Compass branding status: {COMPASS_BRANDING_CLASSIFICATION}.</p>
        <p>No Compass approval, Compass logo, Compass email address, license number, office address, public phone number, or Compass.com URL is rendered as verified.</p>
      </TrustSection>

      <TrustSection title="External Approval Required">
        <TrustList items={externalApprovalItems} />
        <TrustList items={ownerItems} />
      </TrustSection>

      <TrustSection title="Verification Register">
        <ul className="space-y-3">
          {ownerVerificationRegister.map((item) => (
            <li key={item.fact} className="border-l border-cyan-100/28 pl-4">
              <span className="font-bold text-white/78">{item.fact}:</span> {item.status}
              {item.value ? ` (${item.value})` : ''}
            </li>
          ))}
        </ul>
      </TrustSection>
    </PublicTrustPage>
  );
}
