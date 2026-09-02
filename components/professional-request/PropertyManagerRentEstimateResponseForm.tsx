'use client';

import { CheckCircle2, Loader2 } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { ProjectAtlasPublicHomeAction } from '@/components/project-atlas/ProjectAtlasExternalShell';

type Disclosure = Readonly<{ title?: string; property?: { label?: string; city?: string | null; state?: string | null }; purpose?: string; dueAt?: string | null; disclosures?: readonly string[] }>;

export default function PropertyManagerRentEstimateResponseForm({ disclosure, csrfToken, alreadyResponded }: { disclosure: Disclosure; csrfToken: string; alreadyResponded: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(alreadyResponded);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || complete) return;
    setPending(true);
    setError('');
    const fields = new FormData(event.currentTarget);
    const optionalNumber = (name: string) => {
      const value = String(fields.get(name) || '').trim();
      return value ? Number(value) : null;
    };
    try {
      const response = await fetch('/professional-request/respond/submit', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csrfToken, response: { monthlyRent: Number(fields.get('monthlyRent')), rentRangeLow: optionalNumber('rentRangeLow'), rentRangeHigh: optionalNumber('rentRangeHigh'), asOf: String(fields.get('asOf') || '').trim() || null, note: String(fields.get('note') || '').trim() || null, responderName: String(fields.get('responderName') || '').trim() || null, responderOrganization: String(fields.get('responderOrganization') || '').trim() || null, responderRole: String(fields.get('responderRole') || '').trim() || null, businessEmail: String(fields.get('businessEmail') || '').trim() || null } }),
      });
      const payload = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(payload.error || 'The response could not be accepted.');
      setComplete(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'The response could not be accepted.');
    } finally { setPending(false); }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-slate-100 sm:px-8" data-testid="professional-external-request-response">
      <section className="mx-auto max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100/70">Project Atlas</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{disclosure.title || 'Professional estimate request'}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">{disclosure.property?.label || 'Property details are unavailable'}{disclosure.property?.city ? `, ${disclosure.property.city}` : ''}{disclosure.property?.state ? `, ${disclosure.property.state}` : ''}</p>
        <p className="mt-3 text-sm leading-6 text-slate-300">{disclosure.purpose}</p>
        {disclosure.dueAt ? <p className="mt-2 text-sm text-slate-400">Requested by {new Date(disclosure.dueAt).toLocaleString()}.</p> : null}
        <div className="mt-6 border-y border-white/10 py-5 text-sm leading-6 text-slate-400">{disclosure.disclosures?.map((item) => <p key={item} className="mt-2 first:mt-0">{item}</p>)}</div>
        {complete ? <div className="mt-8 border border-emerald-300/25 bg-emerald-300/[0.06] p-5 text-sm leading-6 text-emerald-50" role="status"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 shrink-0" size={19} aria-hidden="true" /><p>Your estimate has been received for Agent review. It has not been automatically admitted as evidence.</p></div><div className="mt-5"><ProjectAtlasPublicHomeAction terminal /></div></div> : (
          <form onSubmit={submit} className="mt-8 grid gap-5" noValidate>
            <label className="grid gap-2 text-sm font-medium text-slate-100">Monthly rent estimate (USD)<input name="monthlyRent" type="number" min="0" max="50000000" step="1" required className="h-11 border border-white/20 bg-white/5 px-3 text-white outline-none focus:border-cyan-200" /></label>
            <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium text-slate-100">Monthly range low (optional)<input name="rentRangeLow" type="number" min="0" max="50000000" step="1" className="h-11 border border-white/20 bg-white/5 px-3 text-white outline-none focus:border-cyan-200" /></label><label className="grid gap-2 text-sm font-medium text-slate-100">Monthly range high (optional)<input name="rentRangeHigh" type="number" min="0" max="50000000" step="1" className="h-11 border border-white/20 bg-white/5 px-3 text-white outline-none focus:border-cyan-200" /></label></div>
            <label className="grid gap-2 text-sm font-medium text-slate-100">Estimate as of (optional)<input name="asOf" type="datetime-local" className="h-11 border border-white/20 bg-white/5 px-3 text-white outline-none focus:border-cyan-200" /></label>
            <label className="grid gap-2 text-sm font-medium text-slate-100">Assumptions or note (optional)<input name="note" maxLength={1000} className="h-11 border border-white/20 bg-white/5 px-3 text-white outline-none focus:border-cyan-200" /></label>
            <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium text-slate-100">Your name (optional)<input name="responderName" maxLength={160} autoComplete="name" className="h-11 border border-white/20 bg-white/5 px-3 text-white outline-none focus:border-cyan-200" /></label><label className="grid gap-2 text-sm font-medium text-slate-100">Organization (optional)<input name="responderOrganization" maxLength={160} autoComplete="organization" className="h-11 border border-white/20 bg-white/5 px-3 text-white outline-none focus:border-cyan-200" /></label><label className="grid gap-2 text-sm font-medium text-slate-100">Role (optional)<input name="responderRole" maxLength={120} className="h-11 border border-white/20 bg-white/5 px-3 text-white outline-none focus:border-cyan-200" /></label><label className="grid gap-2 text-sm font-medium text-slate-100">Business email (optional)<input name="businessEmail" type="email" maxLength={320} autoComplete="email" className="h-11 border border-white/20 bg-white/5 px-3 text-white outline-none focus:border-cyan-200" /></label></div>
            {error ? <p className="text-sm text-rose-200" role="alert">{error}</p> : null}
            <button type="submit" disabled={pending} className="inline-flex min-h-11 w-fit items-center gap-2 border border-cyan-100/40 bg-cyan-100 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60">{pending ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}Submit estimate</button>
          </form>
        )}
      </section>
    </main>
  );
}
