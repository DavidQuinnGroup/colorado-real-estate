'use client';

import { CheckCircle2, Loader2, RotateCcw, Send, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

type Verification = Readonly<{ id: string; dimension: string; method: string; status: string; assertedValue: string | null; createdAt: string }>;
type Delivery = Readonly<{ id: string; status: string; recipientEmail: string; recipientDisplayName: string | null; recipientOrganization: string | null; expiresAt: string; createdAt: string; professionalInputRequest: { id: string; status: string; response?: { id: string } | null; supersedesRequestId?: string | null }; identityVerifications: readonly Verification[]; disclosureSnapshot?: { disclosure: { property?: { label?: string } } } | null }>;

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...init });
  const payload = await response.json().catch(() => ({})) as T & { error?: string };
  if (!response.ok) throw new Error(payload.error || 'The external request workflow could not be completed.');
  return payload;
}

export default function ProfessionalExternalRequestWorkflow() {
  const [deliveries, setDeliveries] = useState<readonly Delivery[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [organization, setOrganization] = useState('');
  const [propertyLabel, setPropertyLabel] = useState('');
  const [propertyCity, setPropertyCity] = useState('');
  const [propertyState, setPropertyState] = useState('CO');
  const [purpose, setPurpose] = useState('Provide a professional monthly rent estimate for Agent review.');

  const refresh = useCallback(async () => {
    try {
      const payload = await requestJson<{ deliveries: Delivery[] }>('/api/agent/professional-external-requests');
      setDeliveries(payload.deliveries);
    } catch (nextError) { setError(nextError instanceof Error ? nextError.message : 'External request history is unavailable.'); }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  async function run(key: string, operation: () => Promise<void>) {
    setBusy(key); setError(null); setNotice(null);
    try { await operation(); await refresh(); } catch (nextError) { setError(nextError instanceof Error ? nextError.message : 'The external request workflow could not be completed.'); } finally { setBusy(null); }
  }

  async function prepare() {
    await run('prepare', async () => {
      await requestJson('/api/agent/professional-external-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'PREPARE', draft: { profile: 'PROPERTY_MANAGER_RENT_ESTIMATE_V1', recipientEmail, recipientDisplayName: recipientName || null, recipientOrganization: organization || null, propertyLabel, propertyCity: propertyCity || null, propertyState: propertyState || null, purpose } }) });
      setRecipientEmail(''); setRecipientName(''); setOrganization(''); setPropertyLabel(''); setPropertyCity(''); setPurpose('Provide a professional monthly rent estimate for Agent review.');
      setNotice('External request prepared. Delivery remains blocked until controlled synthetic email authorization is separately approved.');
    });
  }

  async function revoke(deliveryId: string) {
    await run(`revoke-${deliveryId}`, async () => {
      await requestJson('/api/agent/professional-external-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'REVOKE', deliveryId }) });
      setNotice('External request capability and active sessions were revoked.');
    });
  }

  async function verify(deliveryId: string, dimension: string) {
    await run(`verify-${deliveryId}-${dimension}`, async () => {
      await requestJson('/api/agent/professional-external-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'VERIFY_IDENTITY', deliveryId, dimension }) });
      setNotice('Identity verification was recorded as an immutable Agent event.');
    });
  }

  return (
    <section className="mt-8 border border-white/10 bg-[#0b171c] p-5 sm:p-6" data-testid="agent-professional-external-request-workflow" data-email-delivery="controlled-synthetic-authorization-required" data-client-authorization="not-required-by-profile">
      <div className="flex items-start gap-3"><Send className="mt-0.5 text-cyan-100" size={18} aria-hidden="true" /><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">External request V1</p><h2 className="mt-1 text-lg font-semibold text-white">Property-manager rent estimate</h2><p className="mt-2 text-sm leading-6 text-slate-400">Prepare a minimal property-only request. Delivery is intentionally gated and no customer, financial, document, portal, CRM, MLS, Output, or PDF data is included.</p></div></div>
      {notice ? <p className="mt-5 border border-emerald-200/25 bg-emerald-100/[0.06] p-4 text-sm leading-6 text-emerald-50">{notice}</p> : null}
      {error ? <p className="mt-5 border border-rose-200/25 bg-rose-100/[0.06] p-4 text-sm leading-6 text-rose-50">{error}</p> : null}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-xs font-medium text-slate-300">Business email<input value={recipientEmail} onChange={(event) => setRecipientEmail(event.target.value)} type="email" maxLength={320} className="h-11 border border-white/15 bg-black/20 px-3 text-sm text-white" /></label>
        <label className="grid gap-2 text-xs font-medium text-slate-300">Professional name<input value={recipientName} onChange={(event) => setRecipientName(event.target.value)} maxLength={160} className="h-11 border border-white/15 bg-black/20 px-3 text-sm text-white" /></label>
        <label className="grid gap-2 text-xs font-medium text-slate-300">Organization<input value={organization} onChange={(event) => setOrganization(event.target.value)} maxLength={160} className="h-11 border border-white/15 bg-black/20 px-3 text-sm text-white" /></label>
        <label className="grid gap-2 text-xs font-medium text-slate-300">Property label<input value={propertyLabel} onChange={(event) => setPropertyLabel(event.target.value)} maxLength={240} className="h-11 border border-white/15 bg-black/20 px-3 text-sm text-white" /></label>
        <label className="grid gap-2 text-xs font-medium text-slate-300">City<input value={propertyCity} onChange={(event) => setPropertyCity(event.target.value)} maxLength={120} className="h-11 border border-white/15 bg-black/20 px-3 text-sm text-white" /></label>
        <label className="grid gap-2 text-xs font-medium text-slate-300">State<input value={propertyState} onChange={(event) => setPropertyState(event.target.value)} maxLength={40} className="h-11 border border-white/15 bg-black/20 px-3 text-sm text-white" /></label>
        <label className="grid gap-2 text-xs font-medium text-slate-300 sm:col-span-2">Purpose<input value={purpose} onChange={(event) => setPurpose(event.target.value)} maxLength={800} className="h-11 border border-white/15 bg-black/20 px-3 text-sm text-white" /></label>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4"><button type="button" onClick={() => void prepare()} disabled={busy !== null || !recipientEmail || !propertyLabel || !purpose} className="inline-flex min-h-11 items-center gap-2 bg-cyan-200 px-4 text-sm font-semibold text-slate-950 disabled:opacity-50">{busy === 'prepare' ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}Prepare request</button><span className="text-xs leading-5 text-amber-100">No email will be sent from this screen without the separate controlled-synthetic delivery authorization.</span></div>
      <div className="mt-7 border-t border-white/10 pt-5"><h3 className="text-sm font-semibold text-white">Prepared and response history</h3><div className="mt-3 grid gap-3">{deliveries.length ? deliveries.map((delivery) => <div key={delivery.id} className="border border-white/10 bg-black/10 p-4"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-semibold text-white">{delivery.disclosureSnapshot?.disclosure.property?.label || 'Property request'}</p><p className="mt-1 text-xs text-slate-400">{delivery.recipientEmail} · {delivery.status} · expires {new Date(delivery.expiresAt).toLocaleString()}</p><p className="mt-1 text-xs text-slate-400">Professional Input: {delivery.professionalInputRequest.status}{delivery.professionalInputRequest.response ? ' · response routed to Agent evidence review' : ''}</p></div>{delivery.status !== 'REVOKED' && !delivery.professionalInputRequest.response ? <button type="button" onClick={() => void revoke(delivery.id)} disabled={busy !== null} className="inline-flex min-h-9 items-center gap-2 border border-rose-200/30 px-3 text-xs font-semibold text-rose-100 disabled:opacity-50"><RotateCcw size={14} />Revoke</button> : null}</div><div className="mt-4 flex flex-wrap gap-2">{['PERSON_IDENTITY', 'ORGANIZATION_AFFILIATION', 'PROFESSIONAL_ROLE'].map((dimension) => delivery.identityVerifications.some((item) => item.dimension === dimension && item.method === 'AGENT_MANUAL_CONFIRMATION') ? <span key={dimension} className="inline-flex items-center gap-1 border border-emerald-200/25 px-2 py-1 text-xs text-emerald-100"><CheckCircle2 size={13} />{dimension.replaceAll('_', ' ')}</span> : <button key={dimension} type="button" onClick={() => void verify(delivery.id, dimension)} disabled={busy !== null} className="inline-flex min-h-8 items-center gap-1 border border-white/15 px-2 text-xs text-slate-200 disabled:opacity-50"><ShieldCheck size={13} />Verify {dimension.replaceAll('_', ' ').toLowerCase()}</button>)}</div></div>) : <p className="border border-dashed border-white/15 px-4 py-5 text-sm text-slate-400">No external request records yet.</p>}</div></div>
    </section>
  );
}
