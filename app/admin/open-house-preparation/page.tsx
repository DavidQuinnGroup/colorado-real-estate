import type { Metadata } from 'next';

import {
  buildOpenHouseAgentPreparationPacket,
  type OpenHouseAgentPreparationPacket,
  type OpenHousePreparationFact,
} from '@/lib/openHouseAgentPreparation';
import { getPublicPropertiesByIds, toPublicPropertyIdFilterValue } from '@/lib/property/publicPropertyRead';

export const metadata: Metadata = {
  title: 'Open-House Preparation | REIE Admin',
  description: 'Protected, read-only factual preparation for one explicitly selected open-house property.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

type SearchValue = string | string[] | undefined;

type OpenHousePreparationPageProps = {
  searchParams?: Promise<{
    propertyId?: SearchValue;
    eventLabel?: SearchValue;
    eventDateLabel?: SearchValue;
  }>;
};

type SelectionFailure =
  | 'MISSING_EXPLICIT_PROPERTY'
  | 'INVALID_PROPERTY_ID'
  | 'NON_PERSONAL_EVENT_LABEL_REQUIRED'
  | 'UNAVAILABLE_SELECTED_PROPERTY'
  | 'PROPERTY_READ_UNAVAILABLE';

type Selection =
  | { propertyId: string; eventLabel: string | null; eventDateLabel: string | null; failure: null }
  | { propertyId: null; eventLabel: null; eventDateLabel: null; failure: SelectionFailure };

const GENERIC_EVENT_LABELS = new Set([
  'Open-house factual preparation',
  'Pre-event property review',
  'Agent preparation session',
]);

function scalar(value: SearchValue) {
  return typeof value === 'string' ? value : null;
}

function nonPersonalEventLabel(value: string | null) {
  if (!value) return { value: null, valid: true };
  const trimmed = value.trim();
  if (!GENERIC_EVENT_LABELS.has(trimmed)) {
    return { value: null, valid: false };
  }
  return { value: trimmed || null, valid: true };
}

function nonPersonalEventDateLabel(value: string | null) {
  if (!value) return { value: null, valid: true };
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) {
    return { value: null, valid: false };
  }
  return { value: trimmed || null, valid: true };
}

function selectionFromParams(params: { propertyId?: SearchValue; eventLabel?: SearchValue; eventDateLabel?: SearchValue }): Selection {
  const rawPropertyId = scalar(params.propertyId);
  if (!rawPropertyId) return { propertyId: null, eventLabel: null, eventDateLabel: null, failure: 'MISSING_EXPLICIT_PROPERTY' };

  const propertyId = toPublicPropertyIdFilterValue(rawPropertyId);
  if (!propertyId) return { propertyId: null, eventLabel: null, eventDateLabel: null, failure: 'INVALID_PROPERTY_ID' };

  const eventLabel = nonPersonalEventLabel(scalar(params.eventLabel));
  const eventDateLabel = nonPersonalEventDateLabel(scalar(params.eventDateLabel));
  if (!eventLabel.valid || !eventDateLabel.valid) {
    return { propertyId: null, eventLabel: null, eventDateLabel: null, failure: 'NON_PERSONAL_EVENT_LABEL_REQUIRED' };
  }

  return { propertyId, eventLabel: eventLabel.value, eventDateLabel: eventDateLabel.value, failure: null };
}

function failClosedMessage(reason: SelectionFailure) {
  const messages: Record<SelectionFailure, string> = {
    MISSING_EXPLICIT_PROPERTY: 'Enter one explicit property ID. No packet was prepared.',
    INVALID_PROPERTY_ID: 'The supplied property ID does not meet the existing validation rules. No packet was prepared.',
    NON_PERSONAL_EVENT_LABEL_REQUIRED: 'Event labels must be non-personal and must not contain visitor or customer identity details. No packet was prepared.',
    UNAVAILABLE_SELECTED_PROPERTY: 'The explicitly selected property is unavailable from the bounded read. No substitute was selected and no packet was prepared.',
    PROPERTY_READ_UNAVAILABLE: 'The bounded property read was unavailable. No packet was prepared.',
  };

  return messages[reason];
}

function formatFact(fact: OpenHousePreparationFact) {
  return fact.classification === 'MISSING_FACT' ? 'Not supplied' : fact.value;
}

function FactList({ facts }: { facts: readonly OpenHousePreparationFact[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {facts.map((fact) => (
        <div key={fact.label} className="border border-white/10 bg-black/20 p-3">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{fact.label}</dt>
          <dd className="mt-1 text-sm text-slate-100">{formatFact(fact)}</dd>
          <dd className="mt-1 text-[10px] uppercase tracking-[0.12em] text-cyan-100/70">{fact.classification}</dd>
        </div>
      ))}
    </dl>
  );
}

function PacketPreview({ packet }: { packet: OpenHouseAgentPreparationPacket }) {
  if (!packet.property) return null;

  return (
    <div className="mt-8 space-y-6" data-testid="open-house-preparation-packet">
      <section className="border border-cyan-100/25 bg-cyan-100/[0.06] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">Agent review boundary</p>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-100">
          REIE PREPARES FACTUAL EVIDENCE AND QUESTIONS. THE AGENT OPERATES THE OPEN HOUSE AND RETAINS ALL PROFESSIONAL JUDGMENT.
        </p>
        <p className="mt-3 text-xs text-slate-300">Packet ID: {packet.packetId}</p>
      </section>

      <section className="border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">Explicit property facts</p>
        <h2 className="mt-2 text-xl font-semibold text-white">{packet.property.address || packet.property.id}</h2>
        <p className="mt-1 text-sm text-slate-300">
          {[packet.property.neighborhood, packet.property.city, packet.property.state].filter(Boolean).join(', ') || 'Location not supplied'}
        </p>
        <div className="mt-5"><FactList facts={packet.property.facts} /></div>
      </section>

      <section className="border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">Source and evidence posture</p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-400">Visible source</dt><dd className="mt-1 text-slate-100">{packet.sourceEvidence.sourceIdentity || 'No source identity supplied'}</dd></div>
          <div><dt className="text-slate-400">Timestamp posture</dt><dd className="mt-1 text-slate-100">{packet.sourceEvidence.timestampState}</dd></div>
          <div><dt className="text-slate-400">Visible timestamp</dt><dd className="mt-1 text-slate-100">{packet.sourceEvidence.visibleTimestamp || 'NO_VISIBLE_TIMESTAMP'}</dd></div>
          <div><dt className="text-slate-400">Market/context posture</dt><dd className="mt-1 text-slate-100">{packet.marketContext.state === 'MISSING_CONTEXT' ? 'MISSING_CONTEXT — no market or place context was supplied.' : packet.marketContext.state}</dd></div>
        </dl>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
          {packet.limitations.map((item) => <li key={item}>• {item}</li>)}
          {packet.sourceEvidence.verificationRequirements.map((item) => <li key={item}>• Verify: {item}</li>)}
        </ul>
      </section>

      <section className="border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">Factual talking-point inputs</p>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
          {packet.talkingPointInputs.map((item) => <li key={item}>• {item}</li>)}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">Visitor-question preparation</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
            {packet.visitorQuestionPreparation.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </section>
        <section className="border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">Event-preparation checklist</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
            {packet.eventPreparationChecklist.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">Fair-housing reminders</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
            {packet.fairHousingReminders.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </section>
        <section className="border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">Professional-boundary checklist</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
            {packet.humanJudgmentBoundary.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default async function OpenHousePreparationPage({ searchParams }: OpenHousePreparationPageProps) {
  const params = searchParams ? await searchParams : {};
  const selection = selectionFromParams(params);
  let failure = selection.failure;
  let packet: OpenHouseAgentPreparationPacket | null = null;

  if (selection.failure === null) {
    try {
      const selectedProperties = await getPublicPropertiesByIds([selection.propertyId]);
      const property = selectedProperties.find((item) => item.id === selection.propertyId);
      if (!property) {
        failure = 'UNAVAILABLE_SELECTED_PROPERTY';
      } else {
        packet = buildOpenHouseAgentPreparationPacket({
          generatedAt: new Date().toISOString(),
          eventLabel: selection.eventLabel,
          eventDateTimeLabel: selection.eventDateLabel,
          property: {
            id: property.id,
            address: property.address,
            city: property.city,
            state: property.state,
            neighborhood: property.neighborhood,
            facts: {
              price: property.price,
              status: property.status,
              propertyType: property.propertyType,
              beds: property.beds,
              baths: property.baths,
              squareFeet: property.sqft,
              lotSize: property.lotSize,
              yearBuilt: property.yearBuilt,
            },
          },
          sourceEvidence: {
            sourceIdentity: 'Existing REIE public property read',
            visibleTimestamp: property.lastIntelligenceSync?.toISOString() ?? property.updatedAt?.toISOString() ?? null,
            limitations: ['Property facts are presented from the existing bounded read and remain verification-bound.'],
            verificationRequirements: ['Confirm material property facts with the appropriate listing or property professional before relying on them.'],
          },
        });
      }
    } catch {
      failure = 'PROPERTY_READ_UNAVAILABLE';
    }
  }

  return (
    <main
      className="min-h-screen bg-[#07100d] px-5 py-8 text-slate-100 sm:px-8 lg:px-12"
      data-testid="open-house-preparation-preview"
      data-open-house-preparation-preview="true"
      data-open-house-preparation-api="false"
      data-open-house-preparation-persistence="false"
      data-open-house-preparation-provider-dependency="false"
      data-open-house-preparation-customer-data="false"
      data-open-house-preparation-calendar="false"
    >
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-white/10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/75">PROJECT ATLAS / Protected Agent Review</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Open-House Preparation</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Enter one exact property ID. This protected preview prepares factual evidence and questions only; it does not operate, schedule, promote, register, or follow up on an event.
          </p>
        </header>

        <form method="get" action="/admin/open-house-preparation" className="mt-6 grid gap-4 border border-white/10 bg-white/[0.03] p-5 md:grid-cols-2" data-testid="open-house-preparation-form">
          <label className="grid gap-2 text-sm text-slate-200">
            Property ID
            <input name="propertyId" required defaultValue={scalar(params.propertyId) || ''} className="border border-white/15 bg-black/30 px-3 py-2 text-white" />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Optional non-personal event label
            <select name="eventLabel" defaultValue={scalar(params.eventLabel) || ''} className="border border-white/15 bg-black/30 px-3 py-2 text-white">
              <option value="">No event label</option>
              {[...GENERIC_EVENT_LABELS].map((label) => <option key={label} value={label}>{label}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Optional event date/time
            <input type="datetime-local" name="eventDateLabel" defaultValue={scalar(params.eventDateLabel) || ''} className="border border-white/15 bg-black/30 px-3 py-2 text-white" />
          </label>
          <div className="flex items-end"><button type="submit" className="min-h-10 border border-cyan-100/50 bg-cyan-100 px-4 text-sm font-semibold text-[#07100d]">Prepare factual packet</button></div>
          <p className="text-xs leading-5 text-slate-400 md:col-span-2">The event label is limited to generic preparation labels and the optional date/time is a date-only value; neither accepts visitor, customer, lead, contact, or other personal identity information.</p>
        </form>

        {failure ? (
          <section className="mt-6 border border-amber-300/30 bg-amber-300/[0.08] p-5" data-testid="open-house-preparation-fail-closed" data-open-house-preparation-failure={failure}>
            <p className="text-sm font-semibold text-amber-100">Fail closed</p>
            <p className="mt-2 text-sm leading-6 text-amber-50/90">{failClosedMessage(failure)}</p>
          </section>
        ) : packet ? <PacketPreview packet={packet} /> : null}
      </div>
    </main>
  );
}
