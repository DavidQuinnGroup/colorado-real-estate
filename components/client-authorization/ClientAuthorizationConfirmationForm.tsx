'use client';

import { useState } from 'react';

type Props = { snapshot: Record<string, unknown>; csrfToken: string; completed: { decision: string; decidedAt: Date | string } | null };
function detail(value: unknown) { return Array.isArray(value) ? value.join(', ') : typeof value === 'string' ? value : 'Not applicable'; }

export default function ClientAuthorizationConfirmationForm({ snapshot, csrfToken, completed: initialCompleted }: Props) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  async function decide(decision: 'CONFIRMED' | 'DECLINED') {
    setBusy(true); setStatus('');
    try {
      const response = await fetch('/client-authorization/confirm/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ csrfToken, decision }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'This confirmation is unavailable.');
      setCompleted({ decision: body.decision, decidedAt: body.decidedAt });
    } catch (error) { setStatus(error instanceof Error ? error.message : 'This confirmation is unavailable.'); }
    finally { setBusy(false); }
  }
  if (completed) return <main className="min-h-screen bg-slate-950 px-5 py-12 text-slate-100"><section className="mx-auto max-w-2xl border border-white/10 bg-white/[0.03] p-6"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">David Quinn Group</p><h1 className="mt-3 text-2xl font-semibold">{completed.decision === 'CONFIRMED' ? 'Authorization confirmed' : 'Authorization declined'}</h1><p className="mt-3 text-sm leading-6 text-slate-300">Your decision was recorded for this exact request. It did not itself execute an external action.</p></section></main>;
  return <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 sm:py-12"><section className="mx-auto max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">David Quinn Group</p><h1 className="mt-3 text-3xl font-semibold">Review this authorization</h1><p className="mt-3 text-sm leading-6 text-slate-300">Please review the exact scope below. You may confirm or decline. Opening this page does not authorize anything.</p><dl className="mt-7 divide-y divide-white/10 border-y border-white/10"><Row label="What you are authorizing" value={snapshot.actionClass} /><Row label="Why this is requested" value={snapshot.purpose} /><Row label="Recipient" value={snapshot.recipientRef} /><Row label="Information included" value={snapshot.allowedDataClasses} /><Row label="Property context" value={snapshot.propertyId} /><Row label="Transaction context" value={snapshot.transactionId} /><Row label="Valid until" value={typeof snapshot.expiresAt === 'string' ? new Date(snapshot.expiresAt).toLocaleString() : null} /><Row label="Important limitation" value={snapshot.limitations} /></dl>{status && <p className="mt-5 text-sm text-rose-200" role="alert">{status}</p>}<div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" disabled={busy} onClick={() => decide('CONFIRMED')} className="min-h-12 border border-cyan-100/40 bg-cyan-100/10 px-4 text-sm font-semibold text-cyan-50 disabled:opacity-50">Confirm authorization</button><button type="button" disabled={busy} onClick={() => decide('DECLINED')} className="min-h-12 border border-white/25 px-4 text-sm font-semibold text-white disabled:opacity-50">Decline</button></div></section></main>;
}
function Row({ label, value }: { label: string; value: unknown }) { const shown = detail(value); return shown === 'Not applicable' ? null : <div className="py-4"><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</dt><dd className="mt-1 text-sm leading-6 text-slate-100">{shown}</dd></div>; }
