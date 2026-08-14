import type { Metadata } from 'next';

import {
  buildSellerUpdatePreparationPacket,
  type SellerUpdatePreparationPacket,
} from '@/lib/sellerUpdatePreparation';
import { getPublicPropertiesByIds, toPublicPropertyIdFilterValue } from '@/lib/property/publicPropertyRead';

type SellerUpdatePreparationPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type SellerUpdateFacts = NonNullable<SellerUpdatePreparationPacket['subject']>['facts'];

type Selection =
  | { valid: true; subjectId: string; competitorIds: string[]; requestedIds: string[] }
  | { valid: false; message: string };

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Seller Update Preparation | REIE Admin',
  description: 'Protected, read-only agent preview for evidence-bound seller update preparation.',
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

function singleParam(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : null;
}

function optionalId(value: string | string[] | undefined) {
  const raw = singleParam(value);
  if (raw === null || raw.trim() === '') return { value: null, valid: true } as const;
  const normalized = toPublicPropertyIdFilterValue(raw);
  return normalized ? ({ value: normalized, valid: true } as const) : ({ value: null, valid: false } as const);
}

function selectionFor(params: Record<string, string | string[] | undefined>): Selection {
  const subjectId = singleParam(params.subjectId);
  const normalizedSubjectId = subjectId ? toPublicPropertyIdFilterValue(subjectId) : null;
  if (!normalizedSubjectId) return { valid: false, message: 'Fail closed: enter one valid subject Property ID.' };

  const firstCompetitor = optionalId(params.competitorId);
  const secondCompetitor = optionalId(params.competitor2Id);
  if (!firstCompetitor.valid || !secondCompetitor.valid) {
    return { valid: false, message: 'Fail closed: each supplied competitive Property ID must be valid.' };
  }

  const competitorIds = [firstCompetitor.value, secondCompetitor.value].filter((id): id is string => Boolean(id));
  const requestedIds = [normalizedSubjectId, ...competitorIds];
  if (requestedIds.length > 3 || new Set(requestedIds).size !== requestedIds.length) {
    return { valid: false, message: 'Fail closed: subject and competitive Property IDs must be distinct, with no more than two competitors.' };
  }

  return { valid: true, subjectId: normalizedSubjectId, competitorIds, requestedIds };
}

function formatFact(value: string) {
  return value === 'Not supplied' ? <span className="text-amber-100">Not supplied</span> : value;
}

function FactList({ facts }: { facts: SellerUpdateFacts }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {facts.map((fact) => (
        <div key={fact.key} className="border border-white/10 bg-white/[0.03] p-3">
          <dt className="text-xs uppercase tracking-[0.12em] text-slate-400">{fact.label}</dt>
          <dd className="mt-1 text-sm text-slate-100">{formatFact(fact.value)}</dd>
          <p className="mt-1 text-xs text-slate-500">{fact.classification}</p>
        </div>
      ))}
    </dl>
  );
}

function PacketPreview({ packet }: { packet: SellerUpdatePreparationPacket }) {
  if (!packet.subject) return null;

  return (
    <div className="mt-8 space-y-6" data-testid="seller-update-preparation-packet" data-seller-update-preparation-status={packet.status}>
      <section className="border border-cyan-200/25 bg-cyan-200/[0.06] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">Agent review boundary</p>
        <h2 className="mt-2 text-xl font-semibold text-white">REIE prepares factual evidence. The agent determines seller strategy.</h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-200">
          This read-only packet does not generate seller communication, pricing guidance, strategy, negotiation advice, valuation, appraisal, ranking, or prediction.
        </p>
      </section>

      <section className="border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-medium">Subject facts</h2>
        <p className="mt-1 text-sm text-slate-400">Explicit subject Property ID: {packet.subject.id}</p>
        <div className="mt-4"><FactList facts={packet.subject.facts} /></div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-medium">Prior baseline</h2>
          <p className="mt-3 text-sm text-amber-100" data-testid="seller-update-no-prior-baseline">{packet.priorBaseline.state}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{packet.priorBaseline.limitation}</p>
        </div>
        <div className="border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-medium">Market context</h2>
          <p className="mt-3 text-sm text-amber-100" data-testid="seller-update-missing-market-context">{packet.marketContext.state}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">No Market runtime is queried in this preview.</p>
        </div>
      </section>

      <section className="border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-medium">Selected competitive facts</h2>
        <p className="mt-1 text-sm text-slate-400">{packet.competitiveFacts.selectionMode}. No discovery, ranking, or recommendation occurs.</p>
        {packet.competitiveFacts.entries.length ? (
          <div className="mt-4 space-y-5">
            {packet.competitiveFacts.entries.map((entry) => (
              <div key={entry.id} className="border border-white/10 p-4">
                <h3 className="font-medium text-slate-100">{entry.address || entry.id}</h3>
                <p className="mt-1 text-xs text-slate-500">Explicit competitive Property ID: {entry.id}</p>
                <div className="mt-3"><FactList facts={entry.facts} /></div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-300">No competitive Property IDs were supplied.</p>
        )}
      </section>

      <section className="border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-medium">Factual and calculated differences</h2>
        {packet.competitiveFacts.differences.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.12em] text-slate-400">
                <tr><th className="pb-3 pr-4">Fact</th><th className="pb-3 pr-4">Subject</th><th className="pb-3 pr-4">Selected entry</th><th className="pb-3 pr-4">Evidence state</th><th className="pb-3">Limitation</th></tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-200">
                {packet.competitiveFacts.differences.map((difference) => (
                  <tr key={`${difference.competitiveId}-${difference.key}`}>
                    <td className="py-3 pr-4 font-medium">{difference.label}</td>
                    <td className="py-3 pr-4">{difference.subjectValue}</td>
                    <td className="py-3 pr-4">{difference.competitiveValue}</td>
                    <td className="py-3 pr-4 text-amber-100">{difference.classification}</td>
                    <td className="py-3">{difference.limitation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="mt-4 text-sm text-slate-300">No competitive facts were supplied for difference review.</p>}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-medium">Source / timestamp posture</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-slate-400">Source</dt><dd className="text-slate-100">{packet.sourcePosture.sourceIdentity || 'Not supplied'}</dd></div>
            <div><dt className="text-slate-400">Visible timestamp</dt><dd className="text-slate-100">{packet.sourcePosture.visibleTimestamp || 'Not supplied'}</dd></div>
            <div><dt className="text-slate-400">Timestamp meaning</dt><dd className="text-slate-100">{packet.sourcePosture.semantic || 'Not supplied'}</dd></div>
          </dl>
          <p className="mt-4 text-sm leading-6 text-amber-100">Visible timestamps are not presented as authoritative MLS freshness.</p>
        </div>
        <div className="border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-medium">Unsupported or missing evidence</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            {packet.unsupportedEvidence.map((item) => <li key={item.label}><span className="font-medium text-amber-100">{item.label}:</span> {item.limitation}</li>)}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-medium">Agent talking-point inputs</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{packet.talkingPointInputs.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-medium">Verification questions</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{packet.verificationQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-medium">Human review checklist</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{packet.humanReviewChecklist.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-medium">Professional boundary</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{packet.professionalBoundary.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>
    </div>
  );
}

export default async function SellerUpdatePreparationPage({ searchParams }: SellerUpdatePreparationPageProps) {
  const params = searchParams ? await searchParams : {};
  const selection = selectionFor(params);
  const properties = selection.valid ? await getPublicPropertiesByIds(selection.requestedIds) : [];
  const propertyById = new Map(properties.map((property) => [property.id, property]));
  const allRequestedResolved = selection.valid && selection.requestedIds.every((id) => propertyById.has(id));
  const canPrepare = selection.valid && allRequestedResolved;
  const subject = selection.valid ? propertyById.get(selection.subjectId) : null;
  const timestamp = subject?.updatedAt || subject?.lastIntelligenceSync || null;
  const packet = canPrepare && subject
    ? buildSellerUpdatePreparationPacket({
        generatedAt: new Date().toISOString(),
        subject: {
          id: subject.id,
          facts: {
            address: subject.address,
            city: subject.city,
            state: subject.state,
            neighborhood: subject.neighborhood,
            status: subject.status,
            listedPrice: subject.price,
            propertyType: subject.propertyType,
            beds: subject.beds,
            baths: subject.baths,
            squareFeet: subject.sqft,
            lotSize: subject.lotSize,
            yearBuilt: subject.yearBuilt,
          },
          sourcePosture: {
            sourceIdentity: 'Existing REIE public Property read',
            visibleTimestamp: timestamp ? timestamp.toISOString() : null,
            semantic: subject.updatedAt
              ? 'Visible Property row timestamp; not an authoritative MLS freshness statement.'
              : 'Visible REIE intelligence-sync marker; not an authoritative MLS freshness statement.',
          },
        },
        competitiveFacts: selection.competitorIds.map((id) => {
          const property = propertyById.get(id);
          if (!property) throw new Error('Fail closed: a requested competitive Property ID is unavailable.');
          const propertyTimestamp = property.updatedAt || property.lastIntelligenceSync || null;
          return {
            id: property.id,
            address: property.address,
            facts: {
              address: property.address,
              city: property.city,
              state: property.state,
              neighborhood: property.neighborhood,
              status: property.status,
              listedPrice: property.price,
              propertyType: property.propertyType,
              beds: property.beds,
              baths: property.baths,
              squareFeet: property.sqft,
              lotSize: property.lotSize,
              yearBuilt: property.yearBuilt,
            },
            sourcePosture: {
              sourceIdentity: 'Existing REIE public Property read',
              visibleTimestamp: propertyTimestamp ? propertyTimestamp.toISOString() : null,
              semantic: property.updatedAt
                ? 'Visible Property row timestamp; not an authoritative MLS freshness statement.'
                : 'Visible REIE intelligence-sync marker; not an authoritative MLS freshness statement.',
            },
          };
        }),
      })
    : null;
  const failureMessage = !selection.valid
    ? selection.message
    : selection.valid && !allRequestedResolved
      ? 'Fail closed: every explicitly requested Property ID must resolve successfully.'
      : null;

  return (
    <main className="min-h-screen bg-[#07100d] px-5 py-8 text-slate-100 sm:px-8 lg:px-12" data-testid="seller-update-preparation-page" data-seller-update-preparation-route="/admin/seller-update-preparation" data-seller-update-preparation-read-only="true" data-seller-update-preparation-persistence="false" data-seller-update-preparation-customer="false" data-seller-update-preparation-crm="false" data-seller-update-preparation-market-runtime="false">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-white/10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/70">PROJECT ATLAS / Agent Review</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Seller Update Preparation</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Enter one exact subject Property ID and optionally up to two exact competitive Property IDs. REIE organizes factual evidence for agent review only.</p>
        </header>

        <form method="get" className="mt-8 grid gap-4 border border-white/10 bg-white/[0.03] p-5 lg:grid-cols-[1fr_1fr_1fr_auto]" data-testid="seller-update-preparation-form">
          <label className="text-sm text-slate-300">Subject Property ID<input required name="subjectId" defaultValue={singleParam(params.subjectId) || ''} className="mt-2 w-full border border-white/15 bg-black/20 px-3 py-2 text-slate-100" /></label>
          <label className="text-sm text-slate-300">Competitive Property ID (optional)<input name="competitorId" defaultValue={singleParam(params.competitorId) || ''} className="mt-2 w-full border border-white/15 bg-black/20 px-3 py-2 text-slate-100" /></label>
          <label className="text-sm text-slate-300">Second competitive Property ID (optional)<input name="competitor2Id" defaultValue={singleParam(params.competitor2Id) || ''} className="mt-2 w-full border border-white/15 bg-black/20 px-3 py-2 text-slate-100" /></label>
          <button type="submit" className="self-end bg-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-950">Prepare review</button>
        </form>

        {failureMessage ? <section className="mt-6 border border-amber-300/30 bg-amber-300/10 p-5 text-sm text-amber-50" role="alert" data-testid="seller-update-preparation-fail-closed">{failureMessage}</section> : null}
        {packet ? <PacketPreview packet={packet} /> : null}
      </div>
    </main>
  );
}
