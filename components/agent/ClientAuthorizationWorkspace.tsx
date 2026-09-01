'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, ClipboardCheck, History, ShieldAlert, ShieldCheck, Users } from 'lucide-react';

type Authorization = {
  id: string; status: string; effectiveAt: string | null; expiresAt: string | null; revokedAt: string | null; revocationReason: string | null;
  profile: { profileKey: string; profileVersion: string; lifecycle: string };
  principals: Array<{ principalRef: string; displayLabel: string }>;
  snapshot: { fingerprint: string; snapshot: Record<string, unknown> } | null;
  supersedesAuthorization?: { id: string } | null; supersededByAuthorization?: { id: string } | null;
  uses: Array<{ resolution: string; reasons: string[]; resolvedAt: string; downstreamReference: string | null }>;
  capabilities?: Array<{ id: string; expiresAt: string; revokedAt: string | null; exchangedAt: string | null; completedAt: string | null; useCount: number; maxUses: number }>;
  confirmationEvidence?: { id: string; decision: string; decidedAt: string; requestFingerprint: string } | null;
};

function dateTime(value: string | null) { return value ? new Date(value).toLocaleString() : 'Not recorded'; }
function scope(authorization: Authorization) { return authorization.snapshot?.snapshot ?? {}; }
function value(item: unknown) { return typeof item === 'string' ? item : Array.isArray(item) ? item.join(', ') : item ? String(item) : 'Not recorded'; }

export default function ClientAuthorizationWorkspace() {
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [oneTimeLink, setOneTimeLink] = useState<string | null>(null);

  async function load() {
    const response = await fetch('/api/agent/client-authorizations', { cache: 'no-store' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || 'Unable to load Client Authorization history.');
    setAuthorizations(body.authorizations || []);
  }
  useEffect(() => { const timer = window.setTimeout(() => { void load().catch((error) => setStatus(error.message)); }, 0); return () => window.clearTimeout(timer); }, []);

  async function action(actionName: string, payload: Record<string, unknown>) {
    setBusy(true); setStatus('');
    try {
      const response = await fetch('/api/agent/client-authorizations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: actionName, ...payload }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'The authorization action could not be completed.');
      await load();
      const resolution = body.resolution || body.result;
      setStatus(resolution ? `${resolution.resolution}: ${resolution.reasons.join(', ')}` : 'Synthetic authorization record updated.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'The authorization action could not be completed.'); }
    finally { setBusy(false); }
  }
  const createSynthetic = () => action('CREATE_SECURE_CONFIRMATION_DRAFT', { input: { clientMutationKey: 'ATLAS_SECURE_CONFIRMATION_SYNTHETIC_A', principalRefs: ['ATLAS_SYNTHETIC_PRINCIPAL_A'], principalLabels: ['ATLAS Synthetic Principal A'], recipientRef: 'ATLAS_SYNTHETIC_RECIPIENT_A', propertyId: 'ATLAS_SYNTHETIC_PROPERTY_CERTIFICATION', effectiveAt: '2026-09-03T00:00:00.000Z', expiresAt: '2026-09-30T00:00:00.000Z' } });
  const createRevocationFixture = () => action('CREATE_SYNTHETIC', { input: { clientMutationKey: 'ATLAS_SYNTHETIC_AUTHORIZATION_REVOCATION', principalRefs: ['ATLAS_SYNTHETIC_PRINCIPAL_REVOCATION'], principalLabels: ['ATLAS Synthetic Principal Revocation'], recipientRef: 'ATLAS_SYNTHETIC_RECIPIENT_REVOCATION', effectiveAt: '2026-08-31T12:00:00.000Z', expiresAt: '2026-09-30T12:00:00.000Z' } });
  const resolutionInput = (authorization: Authorization) => { const terms = scope(authorization); return { profileKey: authorization.profile.profileKey, profileVersion: authorization.profile.profileVersion, principalRefs: authorization.principals.map((principal) => principal.principalRef), actionClass: value(terms.actionClass), purpose: value(terms.purpose), recipientClass: value(terms.recipientClass), recipientRef: value(terms.recipientRef), requestedDataClasses: Array.isArray(terms.allowedDataClasses) ? terms.allowedDataClasses as string[] : ['SYNTHETIC_NON_SENSITIVE_DATA'], propertyId: typeof terms.propertyId === 'string' ? terms.propertyId : null, transactionId: typeof terms.transactionId === 'string' ? terms.transactionId : null }; };
  const resolve = (authorization: Authorization) => action('RESOLVE', { input: resolutionInput(authorization) });
  const recordUse = (authorization: Authorization) => action('RECORD_SYNTHETIC_USE', { input: resolutionInput(authorization), downstreamReference: `ATLAS_SYNTHETIC_USE_${authorization.id}`, clientMutationKey: `ATLAS_SYNTHETIC_USE_${authorization.id}` });
  const supersede = (authorization: Authorization) => action(authorization.profile.profileKey === 'SYNTHETIC_CLIENT_AUTHORIZATION_CONFIRMATION_V1' ? 'SUPERSEDE_SECURE_CONFIRMATION' : 'SUPERSEDE', { authorizationId: authorization.id, input: { clientMutationKey: `ATLAS_SECURE_CONFIRMATION_SUCCESSOR_${authorization.id}`, principalRefs: ['ATLAS_SYNTHETIC_PRINCIPAL_A'], principalLabels: ['ATLAS Synthetic Principal A'], recipientRef: 'ATLAS_SYNTHETIC_RECIPIENT_B', propertyId: 'ATLAS_SYNTHETIC_PROPERTY_CERTIFICATION', effectiveAt: '2026-09-03T00:00:00.000Z', expiresAt: '2026-09-30T00:00:00.000Z' } });
  const revoke = (authorization: Authorization) => action('REVOKE', { authorizationId: authorization.id, reason: 'ATLAS synthetic revocation certification.' });
  const prepare = (authorization: Authorization) => action('PREPARE_SECURE_CONFIRMATION', { authorizationId: authorization.id });
  const revokeCapability = (authorization: Authorization) => action('REVOKE_SECURE_CONFIRMATION_CAPABILITY', { authorizationId: authorization.id });
  async function issue(authorization: Authorization) {
    setBusy(true); setStatus(''); setOneTimeLink(null);
    try {
      const response = await fetch('/api/agent/client-authorizations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'ISSUE_SECURE_CONFIRMATION_CAPABILITY', authorizationId: authorization.id, issuanceKey: `ATLAS_SECURE_CONFIRMATION_ISSUANCE_${authorization.id}` }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'The confirmation capability could not be issued.');
      if (body.confirmationToken) setOneTimeLink(`${window.location.origin}/client-authorization/access?token=${body.confirmationToken}`);
      await load(); setStatus(body.confirmationToken ? 'One-time synthetic confirmation link issued. It is shown only in this controlled session.' : 'The existing issuance was retained; no token was re-displayed.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'The confirmation capability could not be issued.'); }
    finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-[#071014] px-5 py-6 text-slate-100 sm:px-8 sm:py-8 lg:px-12" data-testid="client-authorization-workspace" data-agent-only="true" data-client-facing="false">
    <div className="mx-auto max-w-6xl">
      <header className="border-b border-white/10 pb-6"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-100/70">Project Atlas / Agent Workspace</p><h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Client Authorization</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Profile-governed authorization history. This Foundation V1 surface is synthetic certification only; it does not collect client authorization, release documents, or execute an external action.</p></header>
      {status && <p className="mt-4 border border-cyan-100/20 bg-cyan-100/[0.06] px-4 py-3 text-sm text-cyan-50" role="status">{status}</p>}
      {oneTimeLink && <section className="mt-4 border border-amber-100/30 bg-amber-100/[0.06] p-4"><p className="text-sm font-semibold text-amber-50">Controlled synthetic link</p><p className="mt-2 break-all font-mono text-xs text-amber-50">{oneTimeLink}</p><button type="button" onClick={() => setOneTimeLink(null)} className="mt-3 border border-amber-100/30 px-3 py-2 text-xs font-semibold text-amber-50">Hide link</button></section>}
      <section className="mt-6 border border-amber-100/20 bg-amber-100/[0.04] p-5"><div className="flex items-start gap-3"><ShieldAlert className="mt-0.5 text-amber-100" size={18} /><div><h2 className="text-sm font-semibold text-amber-50">Controlled certification boundary</h2><p className="mt-1 text-sm leading-6 text-slate-300">Synthetic principals, recipient, and non-sensitive data only. A profile that does not require authorization is distinct from authorization being present. Authorization is not client identity verification, Evidence Admission, contractual election, or brokerage approval.</p></div></div></section>
      <section className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-white/[0.035] p-5"><div><p className="text-sm font-semibold text-white">Synthetic authorization fixture</p><p className="mt-1 text-sm text-slate-400">Create bounded Foundation V1 certification records when production proof is authorized.</p></div><div className="flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={createSynthetic} className="inline-flex min-h-10 items-center gap-2 border border-cyan-100/35 px-3 text-sm font-semibold text-cyan-50 disabled:opacity-50"><ClipboardCheck size={16} />Create synthetic authorization</button><button type="button" disabled={busy} onClick={createRevocationFixture} className="inline-flex min-h-10 items-center gap-2 border border-rose-100/30 px-3 text-sm font-semibold text-rose-100 disabled:opacity-50"><ShieldAlert size={16} />Create revocation fixture</button></div></section>
      <section className="mt-6 space-y-4" aria-label="Client authorization history">
        {!authorizations.length && <div className="border border-white/10 bg-white/[0.035] p-7 text-sm text-slate-400">No synthetic authorization records are available to this Agent.</div>}
        {authorizations.map((authorization) => { const terms = scope(authorization); return <article key={authorization.id} className="border border-white/10 bg-white/[0.035] p-5" data-testid="client-authorization-record">
          <div className="flex flex-col justify-between gap-4 sm:flex-row"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">{authorization.profile.profileKey}</p><h2 className="mt-1 text-lg font-semibold text-white">{authorization.status.replaceAll('_', ' ')}</h2><p className="mt-2 text-sm text-slate-400">Version {authorization.profile.profileVersion} · fingerprint {authorization.snapshot?.fingerprint.slice(0, 12) || 'Unavailable'}</p></div><span className="inline-flex h-fit items-center gap-2 border border-cyan-100/20 bg-cyan-100/[0.06] px-3 py-2 text-xs font-semibold text-cyan-50"><ShieldCheck size={14} />{authorization.status.replaceAll('_', ' ')}</span></div>
          <dl className="mt-5 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-3"><Field label="Purpose" value={terms.purpose} /><Field label="Principal" value={authorization.principals.map((principal) => principal.displayLabel).join(', ')} icon={Users} /><Field label="Recipient" value={terms.recipientRef} /><Field label="Action" value={terms.actionClass} /><Field label="Data scope" value={terms.allowedDataClasses} /><Field label="Capture / assurance" value={`${value(terms.captureMethod)} / ${value(terms.assurance)}`} /><Field label="Effective" value={dateTime(authorization.effectiveAt)} /><Field label="Expiration" value={dateTime(authorization.expiresAt)} /><Field label="Revocation" value={authorization.revokedAt ? `${dateTime(authorization.revokedAt)} · ${authorization.revocationReason || 'Recorded'}` : 'Not revoked'} /></dl>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4"><button type="button" disabled={busy} onClick={() => resolve(authorization)} className="inline-flex min-h-9 items-center gap-2 border border-white/15 px-3 text-xs font-semibold text-slate-100 disabled:opacity-50"><CheckCircle2 size={14} />Resolve exact scope</button>{authorization.status === 'DRAFT' && <button type="button" disabled={busy} onClick={() => prepare(authorization)} className="inline-flex min-h-9 items-center gap-2 border border-cyan-100/35 px-3 text-xs font-semibold text-cyan-50 disabled:opacity-50">Prepare and freeze</button>}{authorization.status === 'PENDING_CONFIRMATION' && <button type="button" disabled={busy} onClick={() => issue(authorization)} className="inline-flex min-h-9 items-center gap-2 border border-cyan-100/35 px-3 text-xs font-semibold text-cyan-50 disabled:opacity-50">Issue secure link</button>}{authorization.status === 'PENDING_CONFIRMATION' && <button type="button" disabled={busy} onClick={() => revokeCapability(authorization)} className="inline-flex min-h-9 items-center gap-2 border border-rose-100/30 px-3 text-xs font-semibold text-rose-100 disabled:opacity-50">Revoke secure link</button>}{authorization.status === 'ACTIVE' && <button type="button" disabled={busy} onClick={() => recordUse(authorization)} className="inline-flex min-h-9 items-center gap-2 border border-white/15 px-3 text-xs font-semibold text-slate-100 disabled:opacity-50"><ClipboardCheck size={14} />Record synthetic use</button>}{authorization.status === 'ACTIVE' && !authorization.supersededByAuthorization && <button type="button" disabled={busy} onClick={() => supersede(authorization)} className="inline-flex min-h-9 items-center gap-2 border border-white/15 px-3 text-xs font-semibold text-slate-100 disabled:opacity-50"><History size={14} />Create synthetic successor</button>}{authorization.status === 'ACTIVE' && <button type="button" disabled={busy} onClick={() => revoke(authorization)} className="inline-flex min-h-9 items-center gap-2 border border-rose-100/30 px-3 text-xs font-semibold text-rose-100 disabled:opacity-50">Revoke synthetic authorization</button>}</div>
          {authorization.confirmationEvidence && <p className="mt-4 text-xs text-cyan-50">Immutable client decision: {authorization.confirmationEvidence.decision} at {dateTime(authorization.confirmationEvidence.decidedAt)}.</p>}
          {(authorization.supersedesAuthorization || authorization.supersededByAuthorization || authorization.uses.length > 0) && <div className="mt-4 border-t border-white/10 pt-4 text-xs text-slate-400"><p>History: {authorization.supersedesAuthorization ? 'Successor record preserves predecessor history.' : authorization.supersededByAuthorization ? 'Superseded historical record is retained.' : 'No successor relationship.'}</p>{authorization.uses.map((use, index) => <p key={index} className="mt-1">Resolution: {use.resolution} · {use.reasons.join(', ')} · {dateTime(use.resolvedAt)}</p>)}</div>}
        </article>; })}
      </section>
    </div>
  </main>;
}

function Field({ label, value: detail, icon: Icon }: { label: string; value: unknown; icon?: typeof Users }) { return <div><dt className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</dt><dd className="mt-1 flex items-center gap-2 break-words text-slate-200">{Icon && <Icon size={14} className="text-cyan-100" />}{value(detail)}</dd></div>; }
