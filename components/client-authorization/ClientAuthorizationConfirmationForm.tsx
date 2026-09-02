'use client';

import { useState } from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

import { ProjectAtlasPublicHomeAction } from '@/components/project-atlas/ProjectAtlasExternalShell';

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
  if (completed) return <main className="atlas-confirmation-shell"><section className="atlas-confirmation-panel"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">David Quinn Group</p><span className={`atlas-status-badge mt-5 ${completed.decision === 'CONFIRMED' ? 'atlas-status-active' : 'atlas-status-declined'}`}><CheckCircle2 size={15} aria-hidden="true" />{completed.decision === 'CONFIRMED' ? 'Authorization confirmed' : 'Authorization declined'}</span><h1 className="mt-4 text-2xl font-semibold">{completed.decision === 'CONFIRMED' ? 'Authorization confirmed' : 'Authorization declined'}</h1><p className="mt-3 text-sm leading-6 text-slate-300">Your decision was recorded for this exact request. It did not itself execute an external action.</p><div className="mt-6"><ProjectAtlasPublicHomeAction terminal /></div></section></main>;
  return <main className="atlas-confirmation-shell"><section className="atlas-confirmation-panel"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">David Quinn Group</p><h1 className="mt-3 text-3xl font-semibold">Review this authorization</h1><p className="mt-3 text-sm leading-6 text-slate-300">Please review the exact scope below. Opening this page does not authorize anything.</p><dl className="mt-7 divide-y divide-white/10 border-y border-white/10"><Row label="What you are authorizing" value={snapshot.actionClass} /><Row label="Why this is requested" value={snapshot.purpose} /><Row label="Recipient" value={snapshot.recipientRef} /><Row label="Information included" value={snapshot.allowedDataClasses} /><Row label="Property context" value={snapshot.propertyId} /><Row label="Transaction context" value={snapshot.transactionId} /><Row label="Valid until" value={typeof snapshot.expiresAt === 'string' ? new Date(snapshot.expiresAt).toLocaleString() : null} /><Row label="Important limitation" value={snapshot.limitations} /></dl>{status && <p className="atlas-confirmation-error" role="alert"><ShieldAlert size={16} aria-hidden="true" />{status}</p>}<div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" disabled={busy} onClick={() => decide('CONFIRMED')} className="atlas-action atlas-action-primary atlas-confirmation-action"><CheckCircle2 size={16} aria-hidden="true" />Confirm authorization</button><button type="button" disabled={busy} onClick={() => decide('DECLINED')} className="atlas-action atlas-action-secondary atlas-confirmation-action">Decline</button></div></section></main>;
}
function Row({ label, value }: { label: string; value: unknown }) { const shown = detail(value); return shown === 'Not applicable' ? null : <div className="py-4"><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</dt><dd className="mt-1 text-sm leading-6 text-slate-100">{shown}</dd></div>; }
