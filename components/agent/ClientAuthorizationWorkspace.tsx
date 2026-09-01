'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, ClipboardCheck, History, KeyRound, LockKeyhole, ShieldAlert, ShieldCheck, Users } from 'lucide-react';

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
function activeCapability(authorization: Authorization) { return authorization.capabilities?.find((capability) => !capability.revokedAt && !capability.completedAt && !capability.exchangedAt && capability.useCount < capability.maxUses && new Date(capability.expiresAt) > new Date()) ?? null; }
function statusLabel(status: string) { return ({ DRAFT: 'Draft', PENDING_CONFIRMATION: 'Pending confirmation', ACTIVE: 'Confirmed / active', DECLINED: 'Declined', REVOKED: 'Revoked', SUPERSEDED: 'Superseded', CONSUMED: 'Consumed' } as Record<string, string>)[status] ?? status.replaceAll('_', ' '); }
function statusClass(status: string) { return `atlas-status-${status.toLowerCase().replaceAll('_', '-')}`; }

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
      {status && <p className="atlas-workspace-status mt-5" role="status" aria-live="polite">{status}</p>}
      {oneTimeLink && <section className="atlas-secure-link-panel mt-5" aria-labelledby="secure-link-ready-heading"><div className="flex items-start gap-3"><KeyRound className="mt-0.5 text-cyan-100" size={20} aria-hidden="true" /><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-100">Secure link ready</p><h2 id="secure-link-ready-heading" className="mt-1 text-lg font-semibold text-white">Open the controlled confirmation now</h2><p className="mt-2 text-sm leading-6 text-slate-200">This is the only display of this bearer link. It is exchanged once for a scoped confirmation session.</p></div></div><p className="mt-5 break-all border-y border-cyan-100/15 py-3 font-mono text-xs leading-5 text-cyan-50">{oneTimeLink}</p><a href={oneTimeLink} className="atlas-action atlas-action-secure mt-5"><KeyRound size={16} aria-hidden="true" />Open secure confirmation</a><p className="mt-4 text-xs leading-5 text-slate-300">Do not refresh, leave this workspace, or hide this panel before opening the link. After it is no longer displayed, the raw bearer secret cannot be safely recovered or redisplayed.</p></section>}
      <section className="mt-6 border border-amber-100/20 bg-amber-100/[0.04] p-5"><div className="flex items-start gap-3"><ShieldAlert className="mt-0.5 text-amber-100" size={18} /><div><h2 className="text-sm font-semibold text-amber-50">Controlled certification boundary</h2><p className="mt-1 text-sm leading-6 text-slate-300">Synthetic principals, recipient, and non-sensitive data only. A profile that does not require authorization is distinct from authorization being present. Authorization is not client identity verification, Evidence Admission, contractual election, or brokerage approval.</p></div></div></section>
      <section className="atlas-fixture-controls mt-6"><div><p className="text-sm font-semibold text-white">Synthetic authorization fixture</p><p className="mt-1 text-sm text-slate-400">Create bounded Foundation V1 certification records when production proof is authorized.</p></div><div className="flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={createSynthetic} className="atlas-action atlas-action-secondary"><ClipboardCheck size={16} aria-hidden="true" />Create synthetic authorization</button><button type="button" disabled={busy} onClick={createRevocationFixture} className="atlas-action atlas-action-destructive"><ShieldAlert size={16} aria-hidden="true" />Create revocation fixture</button></div></section>
      <section className="mt-6 space-y-4" aria-label="Client authorization history">
        {!authorizations.length && <div className="atlas-empty-state">No synthetic authorization records are available to this Agent.</div>}
        {authorizations.map((authorization) => { const terms = scope(authorization); const currentCapability = activeCapability(authorization); const isHistorical = ['SUPERSEDED', 'REVOKED', 'DECLINED', 'CONSUMED'].includes(authorization.status); const isCurrent = !isHistorical && !authorization.supersededByAuthorization; return <article key={authorization.id} className={`atlas-authorization-record ${isHistorical ? 'atlas-authorization-record-historical' : ''} ${isCurrent ? 'atlas-authorization-record-current' : ''}`} data-testid="client-authorization-record" data-authorization-status={authorization.status} data-authorization-history={isHistorical ? 'true' : 'false'}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">{isHistorical ? 'Historical record' : 'Current authorization record'}</p><p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{authorization.profile.profileKey}</p><h2 className="mt-1 text-xl font-semibold text-white">{statusLabel(authorization.status)}</h2><p className="mt-2 text-sm text-slate-400">Version {authorization.profile.profileVersion} · fingerprint {authorization.snapshot?.fingerprint.slice(0, 12) || 'Unavailable'}</p></div><span className={`atlas-status-badge ${statusClass(authorization.status)}`}><ShieldCheck size={15} aria-hidden="true" />{statusLabel(authorization.status)}</span></div>
          <dl className="mt-6 grid gap-x-6 gap-y-5 text-sm sm:grid-cols-2 lg:grid-cols-3"><Field label="Purpose" value={terms.purpose} /><Field label="Principal" value={authorization.principals.map((principal) => principal.displayLabel).join(', ')} icon={Users} /><Field label="Recipient" value={terms.recipientRef} /><Field label="Action" value={terms.actionClass} /><Field label="Data scope" value={terms.allowedDataClasses} /><Field label="Property context" value={terms.propertyId} /><Field label="Transaction context" value={terms.transactionId} /><Field label="Capture / assurance" value={`${value(terms.captureMethod)} / ${value(terms.assurance)}`} /><Field label="Effective" value={dateTime(authorization.effectiveAt)} /><Field label="Expiration" value={dateTime(authorization.expiresAt)} /><Field label="Revocation" value={authorization.revokedAt ? `${dateTime(authorization.revokedAt)} · ${authorization.revocationReason || 'Recorded'}` : 'Not revoked'} /></dl>
          {authorization.status === 'PENDING_CONFIRMATION' && currentCapability && !oneTimeLink && <aside className="atlas-issued-capability" aria-label="Issued secure link status"><KeyRound size={17} aria-hidden="true" /><div><p className="font-semibold text-cyan-50">Secure link issued and active</p><p className="mt-1 text-sm leading-6 text-slate-300">One use remains. The raw bearer link was shown only at issuance and cannot be safely redisplayed after leaving that view. Expires {dateTime(currentCapability.expiresAt)}.</p></div></aside>}
          <div className="atlas-action-row"><button type="button" disabled={busy} onClick={() => resolve(authorization)} className="atlas-action atlas-action-secondary"><CheckCircle2 size={15} aria-hidden="true" />Resolve exact scope</button>{authorization.status === 'DRAFT' && <button type="button" disabled={busy} onClick={() => prepare(authorization)} className="atlas-action atlas-action-primary">Prepare and freeze</button>}{authorization.status === 'PENDING_CONFIRMATION' && !currentCapability && <button type="button" disabled={busy} onClick={() => issue(authorization)} className="atlas-action atlas-action-primary"><KeyRound size={15} aria-hidden="true" />Issue secure link</button>}{authorization.status === 'PENDING_CONFIRMATION' && <button type="button" disabled={busy} onClick={() => revokeCapability(authorization)} className="atlas-action atlas-action-destructive"><LockKeyhole size={15} aria-hidden="true" />Revoke secure link</button>}{authorization.status === 'ACTIVE' && <button type="button" disabled={busy} onClick={() => recordUse(authorization)} className="atlas-action atlas-action-secondary"><ClipboardCheck size={15} aria-hidden="true" />Record synthetic use</button>}{['PENDING_CONFIRMATION', 'ACTIVE'].includes(authorization.status) && !authorization.supersededByAuthorization && <button type="button" disabled={busy} onClick={() => supersede(authorization)} className="atlas-action atlas-action-secondary"><History size={15} aria-hidden="true" />Create synthetic successor</button>}{authorization.status === 'ACTIVE' && <button type="button" disabled={busy} onClick={() => revoke(authorization)} className="atlas-action atlas-action-destructive"><ShieldAlert size={15} aria-hidden="true" />Revoke synthetic authorization</button>}</div>
          {authorization.confirmationEvidence && <p className="atlas-decision-evidence">Immutable client decision: {authorization.confirmationEvidence.decision} at {dateTime(authorization.confirmationEvidence.decidedAt)}.</p>}
          {(authorization.supersedesAuthorization || authorization.supersededByAuthorization || authorization.uses.length > 0) && <div className="atlas-record-history"><p>History: {authorization.supersedesAuthorization ? 'Successor record preserves predecessor history.' : authorization.supersededByAuthorization ? 'Superseded historical record is retained.' : 'No successor relationship.'}</p>{authorization.uses.map((use, index) => <p key={index} className="mt-1">Resolution: {use.resolution} · {use.reasons.join(', ')} · {dateTime(use.resolvedAt)}</p>)}</div>}
        </article>; })}
      </section>
    </div>
  </main>;
}

function Field({ label, value: detail, icon: Icon }: { label: string; value: unknown; icon?: typeof Users }) { return <div className="atlas-authorization-field"><dt>{label}</dt><dd>{Icon && <Icon size={14} className="text-cyan-100" aria-hidden="true" />}{value(detail)}</dd></div>; }
