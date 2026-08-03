import Link from 'next/link';
import type { Metadata } from 'next';

import AdvisoryHandoffGuide from '@/components/AdvisoryHandoffGuide';
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
  'Property-specific questions continue to start from the inquiry workflow on an individual property page.',
  'Market strategy requests continue to start from the strategy-intake workflow on city market pages.',
  'General planning, privacy, accessibility, and public contact questions continue through this Contact route until a branded public contact email is operational.',
  'Public phone, office address, and branded contact email are not published until brokerage-approved values are confirmed.',
];

const contactContexts = [
  {
    label: 'Property question',
    body: 'Start from the property page when the question depends on a specific address, listing fact, record, photo, or condition signal.',
  },
  {
    label: 'Market or place question',
    body: 'Use Market or Neighborhood context first when the question is about location, evidence, freshness, or what should be investigated next.',
  },
  {
    label: 'Buyer or seller preparation',
    body: 'Use Buyer, Seller, or Advisory preparation when the question is about readiness, market exposure, assumptions, timing, or professional review.',
  },
];

const minimumInfo = [
  'The decision or question you want to discuss.',
  'The property, market, neighborhood, Buyer, Seller, or Advisory context that shaped it.',
  'A safe follow-up channel only when you use an existing authorized inquiry or intake path.',
];

const optionalContext = [
  'Helpful notes about timing, open questions, or evidence gaps.',
  'Links or references to REIE pages you reviewed.',
  'Questions that may require lender, legal, tax, title, insurance, inspection, or valuation review.',
];

const nextSteps = [
  'Choose the route that matches the question.',
  'Use the existing property or market workflow only when that specialized path fits.',
  'Keep confidential negotiating positions, financial limits, and client-confidential details out of public forms until the applicable relationship and disclosures are discussed.',
];

export default function ContactPage() {
  return (
    <PublicTrustPage
      eyebrow="Public Trust"
      title="Contact"
      summary="A concise way to begin the right conversation without creating a generic intake form, changing existing workflows, or publishing unverified phone or office details."
    >
      <TrustSection title="Conversation Start">
        <div
          data-testid="contact-decision-flow"
          data-dxt-contact-decision-flow="implemented"
          data-dxt-contact-runtime-scope="app/contact/page.tsx"
          data-dxt-contact-generic-form="false"
          data-dxt-contact-new-fields="false"
          data-dxt-contact-api-change="false"
          data-dxt-contact-crm="false"
          data-dxt-contact-email="false"
          data-dxt-contact-scheduling="false"
          data-dxt-contact-persistence="false"
          data-dxt-contact-telemetry="false"
          data-dxt-contact-hidden-context="false"
          className="rounded-lg bg-white p-6 text-neutral-700"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">Conversation Start</p>
          <h2 className="mt-3 text-3xl font-serif text-neutral-950 md:text-4xl">
            What is the simplest appropriate way to begin this conversation?
          </h2>
          <p data-testid="contact-conversation-promise" className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700">
            Contact helps route a question to the safest existing conversation path. It does not create a new form,
            change submission behavior, or turn preparation into qualification.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3" data-testid="contact-decision-contexts">
            {contactContexts.map((context) => (
              <article key={context.label} className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-950">{context.label}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-700">{context.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div
              data-testid="contact-minimum-information"
              className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 text-neutral-700"
            >
              <h3 className="text-base font-semibold text-neutral-950">Minimum useful information</h3>
              <TrustList items={minimumInfo} />
            </div>
            <div
              data-testid="contact-optional-context"
              className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 text-neutral-700"
            >
              <h3 className="text-base font-semibold text-neutral-950">Optional context</h3>
              <TrustList items={optionalContext} />
            </div>
            <div
              data-testid="contact-what-happens-next"
              className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 text-neutral-700"
            >
              <h3 className="text-base font-semibold text-neutral-950">What happens next</h3>
              <TrustList items={nextSteps} />
            </div>
          </div>

          <div data-testid="contact-professional-boundaries" className="mt-8 rounded-lg border border-neutral-300 bg-white p-6">
            <h3 className="text-lg font-semibold text-neutral-950">Professional and privacy boundaries</h3>
            <p className="mt-3 leading-7 text-neutral-700">
              Contact does not itself establish representation, legal advice, tax advice, lending approval,
              qualification, affordability, appraisal, valuation certainty, pricing certainty, outcome certainty,
              investment recommendations, suitability conclusions, fair-housing or protected-class guidance, AI advisory,
              provider rankings, response-time promises, persistence, telemetry, hidden context, CRM behavior, email behavior,
              scheduling behavior, or form submission.
            </p>
          </div>

          <div
            id="contact-route-choice"
            data-testid="contact-route-choice"
            className="mt-8 rounded-lg border border-neutral-900 bg-neutral-950 p-6 text-white"
          >
            <h3 className="text-xl font-semibold">Choose the starting point.</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-200">
              Use the route below that best matches the question. Customers who are not ready to submit can return to
              Search, Buyer, Seller, Market, Neighborhood, or Advisory preparation without pressure.
            </p>
            <Link
              href="#contact-route-choice"
              data-testid="contact-decision-primary-action"
              data-dxt-contact-primary-action="choose-starting-point"
              className="mt-5 inline-flex rounded-md bg-white px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950"
            >
              Choose The Starting Point
            </Link>
          </div>
        </div>
      </TrustSection>

      <AdvisoryHandoffGuide />

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

      <TrustSection title="Contact Routes">
        <JourneyCohesionPanel
          surface="contact"
          tone="light"
          title="Choose the route that matches the question."
          body="Contact begins the conversation by pointing customers to the safest existing path. Property questions should start from a property page, market strategy questions can start in city Market, and broader timing or planning questions can return through Advisory or Grand Plan."
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

      <TrustSection title="Production Status">
        <StandardTrustIntro />
        <p>Classification: {PUBLIC_TRUST_REVIEW_STATUS}.</p>
      </TrustSection>
    </PublicTrustPage>
  );
}
