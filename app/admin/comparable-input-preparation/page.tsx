import type { Metadata } from 'next';

import {
  buildComparableInputPacket,
  type ComparableInputPacket,
  type ComparableInputPropertyFacts,
} from '@/lib/comparableInputPreparation';
import { getPublicPropertiesByIds, toPublicPropertyIdFilterValue } from '@/lib/property/publicPropertyRead';

export const metadata: Metadata = {
  title: 'Comparable Input Agent Preview | REIE Admin',
  description: 'Protected read-only agent preview for explicitly selected Comparable Input Packet evidence.',
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

type AgentPreviewPageProps = {
  searchParams?: Promise<{
    subjectId?: SearchValue;
    candidateId?: SearchValue;
    candidateId2?: SearchValue;
  }>;
};

type SelectionFailure =
  | 'MISSING_EXPLICIT_SELECTION'
  | 'INVALID_PROPERTY_ID'
  | 'DUPLICATE_IDENTITY'
  | 'UNAVAILABLE_SELECTED_PROPERTY'
  | 'PROPERTY_READ_UNAVAILABLE';

type Selection =
  | { subjectId: string; candidateIds: string[]; failure: null }
  | { subjectId: null; candidateIds: []; failure: SelectionFailure };

function scalar(value: SearchValue) {
  return typeof value === 'string' ? value : null;
}

function selectionFromParams(params: { subjectId?: SearchValue; candidateId?: SearchValue; candidateId2?: SearchValue }): Selection {
  const rawSubjectId = scalar(params.subjectId);
  const rawCandidateId = scalar(params.candidateId);
  const rawCandidateId2 = scalar(params.candidateId2);

  if (!rawSubjectId || !rawCandidateId) {
    return { subjectId: null, candidateIds: [], failure: 'MISSING_EXPLICIT_SELECTION' };
  }

  const subjectId = toPublicPropertyIdFilterValue(rawSubjectId);
  const candidateId = toPublicPropertyIdFilterValue(rawCandidateId);
  const candidateId2 = rawCandidateId2 ? toPublicPropertyIdFilterValue(rawCandidateId2) : null;
  if (!subjectId || !candidateId || (rawCandidateId2 && !candidateId2)) {
    return { subjectId: null, candidateIds: [], failure: 'INVALID_PROPERTY_ID' };
  }

  const candidateIds = candidateId2 ? [candidateId, candidateId2] : [candidateId];
  if (new Set([subjectId, ...candidateIds]).size !== candidateIds.length + 1) {
    return { subjectId: null, candidateIds: [], failure: 'DUPLICATE_IDENTITY' };
  }

  return { subjectId, candidateIds, failure: null };
}

function failClosedMessage(reason: SelectionFailure) {
  const messages: Record<SelectionFailure, string> = {
    MISSING_EXPLICIT_SELECTION: 'Enter one subject property ID and at least one distinct candidate property ID to prepare a review packet.',
    INVALID_PROPERTY_ID: 'One or more supplied property IDs do not meet the existing property-ID validation rules. No packet was prepared.',
    DUPLICATE_IDENTITY: 'Subject and candidate property IDs must all be distinct. No packet was prepared.',
    UNAVAILABLE_SELECTED_PROPERTY: 'At least one explicitly selected property is unavailable from the bounded read. No substitute was selected and no packet was prepared.',
    PROPERTY_READ_UNAVAILABLE: 'The bounded property read was unavailable. No packet was prepared.',
  };

  return messages[reason];
}

function formatCurrency(value: number | null) {
  if (value === null) return 'Not provided';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function formatNumber(value: number | null, suffix = '') {
  return value === null ? 'Not provided' : `${value.toLocaleString('en-US')}${suffix}`;
}

function PropertyFacts({ property, label }: { property: ComparableInputPropertyFacts; label: string }) {
  const facts = [
    ['Address', property.identity.address],
    ['Location', [property.facts.geography.neighborhood, property.facts.geography.city, property.facts.geography.state].filter(Boolean).join(', ') || 'Not provided'],
    ['Listed price', formatCurrency(property.facts.price)],
    ['Status', property.facts.status || 'Not provided'],
    ['Property type', property.facts.propertyType || 'Not provided'],
    ['Beds / baths', `${formatNumber(property.facts.beds)} / ${formatNumber(property.facts.baths)}`],
    ['Square feet', formatNumber(property.facts.squareFeet, ' sq ft')],
    ['Lot size', formatNumber(property.facts.lotSize, ' acres')],
    ['Year built', formatNumber(property.facts.yearBuilt)],
    ['Listed price per sq ft', formatCurrency(property.facts.pricePerSquareFoot)],
  ];

  return (
    <section className="border border-white/10 bg-white/[0.03] p-5" data-testid="comparable-input-property-facts">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">{label}</p>
      <h2 className="mt-2 text-xl font-semibold text-white">{property.identity.address}</h2>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {facts.map(([factLabel, value]) => (
          <div key={factLabel} className="border border-white/8 bg-black/20 p-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{factLabel}</dt>
            <dd className="mt-1 text-sm text-slate-100">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function SourceAndTimestamp({ property, label }: { property: ComparableInputPropertyFacts; label: string }) {
  const posture = property.sourceAndFreshness;
  return (
    <article className="border border-white/10 bg-black/20 p-4" data-testid="comparable-input-source-timestamp">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100/72">{label}</p>
      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-400">Visible source</dt>
          <dd className="mt-1 text-slate-100">{posture.sourceName || 'No governed source record supplied'}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Source state</dt>
          <dd className="mt-1 text-slate-100">{posture.sourceAuthorizationState || 'Verification required'}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Timestamp state</dt>
          <dd className="mt-1 text-slate-100">{posture.visibleTimestampKind}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Visible timestamp</dt>
          <dd className="mt-1 text-slate-100">{posture.visibleTimestamp || 'NO_VISIBLE_TIMESTAMP'}</dd>
        </div>
      </dl>
    </article>
  );
}

function PacketPreview({ packet }: { packet: ComparableInputPacket }) {
  if (!packet.subject) return null;

  return (
    <div className="mt-8 space-y-6" data-testid="comparable-input-agent-packet">
      <section className="border border-cyan-100/20 bg-cyan-100/[0.06] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">Agent review boundary</p>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-100">
          REIE PREPARES EVIDENCE. The agent selects candidates and retains CMA, pricing, professional appraisal, negotiation, offer, fiduciary, and customer-communication judgment.
        </p>
        <p className="mt-3 text-xs text-slate-300">Packet ID: {packet.packetId}</p>
      </section>

      <PropertyFacts property={packet.subject} label="Explicit subject" />
      <div className="grid gap-6 xl:grid-cols-2">
        {packet.candidates.map((candidate, index) => (
          <PropertyFacts key={candidate.identity.id} property={candidate} label={`Explicit candidate ${index + 1}`} />
        ))}
      </div>

      <section className="border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">Source and timestamp posture</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <SourceAndTimestamp property={packet.subject} label="Subject" />
          {packet.candidates.map((candidate, index) => (
            <SourceAndTimestamp key={candidate.identity.id} property={candidate} label={`Candidate ${index + 1}`} />
          ))}
        </div>
      </section>

      <section className="border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">Factual evidence differences</p>
        <div className="mt-4 grid gap-4">
          {packet.comparisons.map((comparison, index) => (
            <article key={comparison.candidateId} className="border border-white/8 bg-black/20 p-4" data-testid="comparable-input-differences">
              <p className="text-sm font-semibold text-white">Candidate {index + 1}</p>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {comparison.differences.map((difference) => (
                  <div key={difference.field} className="border border-white/8 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/75">{difference.state}</p>
                    <p className="mt-2 text-sm font-medium text-white">{difference.field}</p>
                    <p className="mt-2 text-sm text-slate-300">Subject: {difference.subjectValue}</p>
                    <p className="text-sm text-slate-300">Candidate: {difference.candidateValue}</p>
                    <p className="mt-3 text-xs leading-5 text-slate-400">{difference.verificationPrompt}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">Evidence limitations and verification requirements</p>
          <div className="mt-4 grid gap-3">
            {packet.limitations.map((limitation) => (
              <article key={`${limitation.candidateId}-${limitation.category}`} className="border border-white/8 bg-black/20 p-3">
                <p className="text-xs font-semibold text-cyan-100/80">{limitation.state} · {limitation.category}</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{limitation.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">Verification questions</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
            {packet.verificationQuestions.map((question) => <li key={question}>• {question}</li>)}
          </ul>
        </section>
      </div>

      <section className="border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/75">Human review checklist</p>
        <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-200 md:grid-cols-2">
          {packet.humanReviewChecklist.map((item) => <li key={item}>• {item}</li>)}
        </ul>
      </section>
    </div>
  );
}

export default async function ComparableInputPreparationAgentPreviewPage({ searchParams }: AgentPreviewPageProps) {
  const params = searchParams ? await searchParams : {};
  const selection = selectionFromParams(params);
  let failure = selection.failure;
  let packet: ComparableInputPacket | null = null;

  if (selection.failure === null) {
    try {
      const requestedIds = [selection.subjectId, ...selection.candidateIds];
      const selectedProperties = await getPublicPropertiesByIds(requestedIds);
      const propertiesById = new Map(selectedProperties.map((property) => [property.id, property]));
      const subjectProperty = propertiesById.get(selection.subjectId);
      const candidateProperties = selection.candidateIds.map((id) => propertiesById.get(id));

      if (!subjectProperty || candidateProperties.some((property) => !property)) {
        failure = 'UNAVAILABLE_SELECTED_PROPERTY';
      } else {
        const toPacketProperty = (property: NonNullable<typeof subjectProperty>) => ({
          id: property.id,
          address: property.address,
          city: property.city,
          state: property.state,
          neighborhood: property.neighborhood,
          price: property.price,
          status: property.status,
          propertyType: property.propertyType,
          beds: property.beds,
          baths: property.baths,
          sqft: property.sqft,
          lotSize: property.lotSize,
          yearBuilt: property.yearBuilt,
          updatedAt: property.updatedAt,
          lastIntelligenceSync: property.lastIntelligenceSync,
          sourceId: 'SRC-MLS-LISTING-DATA' as const,
        });

        packet = buildComparableInputPacket({
          generatedAt: new Date().toISOString(),
          subject: toPacketProperty(subjectProperty),
          candidates: candidateProperties.map((property) => toPacketProperty(property!)),
        });
      }
    } catch {
      failure = 'PROPERTY_READ_UNAVAILABLE';
    }
  }

  return (
    <main
      className="min-h-screen bg-[#07100d] px-5 py-8 text-slate-100 sm:px-8 lg:px-12"
      data-testid="comparable-input-agent-preview"
      data-comparable-input-agent-preview="true"
      data-comparable-input-agent-preview-api="false"
      data-comparable-input-agent-preview-persistence="false"
      data-comparable-input-agent-preview-provider-dependency="false"
      data-comparable-input-agent-preview-customer-data="false"
    >
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-white/10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/75">PROJECT ATLAS / Protected Agent Review</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Comparable Input Preparation</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Enter exact property IDs selected by an authenticated agent. The preview organizes existing evidence only and does not discover alternatives.
          </p>
        </header>

        <form method="get" action="/admin/comparable-input-preparation" className="mt-6 grid gap-4 border border-white/10 bg-white/[0.03] p-5 md:grid-cols-2" data-testid="comparable-input-explicit-selection-form">
          <label className="grid gap-2 text-sm text-slate-200">
            Subject property ID
            <input name="subjectId" required defaultValue={scalar(params.subjectId) || ''} className="border border-white/15 bg-black/30 px-3 py-2 text-white" />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Candidate property ID
            <input name="candidateId" required defaultValue={scalar(params.candidateId) || ''} className="border border-white/15 bg-black/30 px-3 py-2 text-white" />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Optional second candidate property ID
            <input name="candidateId2" defaultValue={scalar(params.candidateId2) || ''} className="border border-white/15 bg-black/30 px-3 py-2 text-white" />
          </label>
          <div className="flex items-end">
            <button type="submit" className="min-h-10 border border-cyan-100/50 bg-cyan-100 px-4 text-sm font-semibold text-[#07100d]">Prepare explicit evidence packet</button>
          </div>
        </form>

        {failure ? (
          <section className="mt-6 border border-amber-300/30 bg-amber-300/[0.08] p-5" data-testid="comparable-input-fail-closed" data-comparable-input-failure={failure}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">FAIL CLOSED</p>
            <p className="mt-3 text-sm leading-6 text-amber-50">{failClosedMessage(failure)}</p>
          </section>
        ) : packet ? <PacketPreview packet={packet} /> : null}
      </div>
    </main>
  );
}
