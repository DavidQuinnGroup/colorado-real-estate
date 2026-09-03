'use client';

import Link from 'next/link';
import { Archive, ArrowLeft, Home, Plus, RotateCcw, Users } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useState } from 'react';

type ClientCase = {
  id: string;
  displayName: string;
  status: 'ACTIVE' | 'ARCHIVED';
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  parties?: { id: string; role: string; displayLabel: string }[];
  properties?: { id: string; role: string; canonicalProperty: { id: string; sourceFormattedSitusAddress: string | null; normalizedSitusAddress: string | null; city: string | null; state: string | null; postalCode: string | null } }[];
  transactions?: { id: string; label: string; side: string; stage: string; updatedAt: string }[];
  _count?: { parties: number; properties: number; transactions: number };
};

const propertyRoles = ['CURRENT_HOME', 'NEW_PRIMARY', 'INVESTMENT_PROPERTY', 'SALE_PROPERTY', 'OTHER'];
const partyRoles = ['PRIMARY_CLIENT', 'ADDITIONAL_CLIENT', 'OTHER_PARTY'];

function dateTime(value: string | null) { return value ? new Date(value).toLocaleString() : 'Not recorded'; }

async function request(body?: Record<string, unknown>, query = '') {
  const response = await fetch(`/api/agent/client-cases${query}`, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' });
  const payload = await response.json() as Record<string, unknown>;
  if (!response.ok) throw new Error(typeof payload.error === 'string' ? payload.error : 'Client Case request failed.');
  return payload;
}

export default function ClientCasesWorkspace({ clientCaseId }: { clientCaseId?: string }) {
  const [cases, setCases] = useState<ClientCase[]>([]);
  const [clientCase, setClientCase] = useState<ClientCase | null>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const load = useCallback(async () => {
    const payload = await request(undefined, clientCaseId ? `?id=${encodeURIComponent(clientCaseId)}` : showArchived ? '?archived=true' : '');
    if (clientCaseId) setClientCase(payload.clientCase as ClientCase); else setCases((payload.clientCases as ClientCase[]) || []);
  }, [clientCaseId, showArchived]);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      try {
        const payload = await request(undefined, clientCaseId ? `?id=${encodeURIComponent(clientCaseId)}` : showArchived ? '?archived=true' : '');
        if (cancelled) return;
        if (clientCaseId) setClientCase(payload.clientCase as ClientCase); else setCases((payload.clientCases as ClientCase[]) || []);
      } catch (error) {
        if (!cancelled) setStatus(error instanceof Error ? error.message : 'Client Case request failed.');
      }
    }
    void hydrate();
    return () => { cancelled = true; };
  }, [clientCaseId, showArchived]);

  async function action(actionName: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    try {
      const response = await request({ action: actionName, ...payload });
      if (response.clientCase) setClientCase(response.clientCase as ClientCase);
      setStatus('Client Case updated.');
      if (!clientCaseId) await load();
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Client Case request failed.'); }
    finally { setBusy(false); }
  }

  function createCase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const displayName = String(form.get('displayName') || '');
    const partyLabel = String(form.get('partyLabel') || '');
    void action('CREATE', { input: { displayName, clientMutationKey: `CLIENT_CASE_CREATE_${crypto.randomUUID()}`, parties: partyLabel ? [{ role: 'PRIMARY_CLIENT', displayLabel: partyLabel }] : [] } });
    event.currentTarget.reset();
  }

  function addParty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!clientCase) return;
    const form = new FormData(event.currentTarget);
    void action('ADD_PARTY', { clientCaseId: clientCase.id, input: { role: form.get('role'), displayLabel: form.get('displayLabel') } });
    event.currentTarget.reset();
  }

  function attachProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!clientCase) return;
    const form = new FormData(event.currentTarget);
    void action('ATTACH_PROPERTY', { clientCaseId: clientCase.id, input: { canonicalPropertyId: form.get('canonicalPropertyId'), role: form.get('role') } });
    event.currentTarget.reset();
  }

  if (clientCaseId) return <main className="px-5 py-8 sm:px-8 lg:px-12" data-testid="client-case-detail"><div className="mx-auto max-w-6xl">
    <Link href="/agent/clients" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-cyan-100 hover:text-white"><ArrowLeft size={16} />Client Work</Link>
    {status && <p className="atlas-workspace-status mt-5" role="status">{status}</p>}
    {!clientCase ? <p className="mt-8 text-slate-300">Loading Client Case...</p> : <>
      <header className="mt-6 border-b border-white/10 pb-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/70">Project Atlas / Client Work</p><h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{clientCase.displayName}</h1><p className="mt-3 text-sm text-slate-300">Client Case context is Agent-private and keeps advisory relationships distinct from transactions, authorizations, outputs, and professional evidence.</p><p className="mt-3 text-sm text-cyan-100">Status: {clientCase.status}</p></header>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="border border-white/10 p-5"><h2 className="text-lg font-semibold text-white">Client / party context</h2>{clientCase.parties?.length ? <ul className="mt-4 space-y-2 text-sm text-slate-300">{clientCase.parties.map((party) => <li key={party.id}>{party.displayLabel} <span className="text-slate-500">{party.role}</span></li>)}</ul> : <p className="mt-3 text-sm text-slate-400">No party context recorded.</p>}<form onSubmit={addParty} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]"><input name="displayLabel" required maxLength={160} placeholder="Party display label" className="min-h-10 border border-white/15 bg-transparent px-3 text-sm text-white" /><select name="role" className="min-h-10 border border-white/15 bg-[#071014] px-3 text-sm text-white">{partyRoles.map((role) => <option key={role}>{role}</option>)}</select><button disabled={busy} className="atlas-action atlas-action-secondary" type="submit"><Users size={15} />Add party</button></form></section>
        <section className="border border-white/10 p-5"><h2 className="text-lg font-semibold text-white">Properties</h2>{clientCase.properties?.length ? <ul className="mt-4 space-y-3 text-sm text-slate-300">{clientCase.properties.map((property) => <li key={property.id}><p className="text-white">{property.canonicalProperty.sourceFormattedSitusAddress || property.canonicalProperty.normalizedSitusAddress || property.canonicalProperty.id}</p><p className="text-slate-400">Case role: {property.role}</p></li>)}</ul> : <p className="mt-3 text-sm text-slate-400">No properties attached to this Case.</p>}<form onSubmit={attachProperty} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]"><input name="canonicalPropertyId" required maxLength={160} placeholder="Canonical property ID" className="min-h-10 border border-white/15 bg-transparent px-3 text-sm text-white" /><select name="role" className="min-h-10 border border-white/15 bg-[#071014] px-3 text-sm text-white">{propertyRoles.map((role) => <option key={role}>{role}</option>)}</select><button disabled={busy} className="atlas-action atlas-action-secondary" type="submit"><Plus size={15} />Attach</button></form></section>
      </div>
      <section className="mt-6 border border-white/10 p-5"><h2 className="text-lg font-semibold text-white">Linked work</h2>{clientCase.transactions?.length ? <ul className="mt-4 space-y-2 text-sm text-slate-300">{clientCase.transactions.map((transaction) => <li key={transaction.id}>{transaction.label} <span className="text-slate-500">{transaction.side} / {transaction.stage}</span></li>)}</ul> : <p className="mt-3 text-sm text-slate-400">No linked Transactions yet. Output, Professional Input, and financial scenario relationships are deferred to their owning foundations.</p>}</section>
      <section className="mt-6 flex flex-wrap gap-3"><Link href="/agent" className="atlas-action atlas-action-secondary"><Home size={15} />Workspace Home</Link>{['Buyer','Seller','Financial Strategy','Intelligence','Transactions'].map((label, index) => <Link key={label} href={[ '/agent/prepare/buyer','/agent/prepare/seller','/agent/strategy','/agent/prepare/market','/agent/under-contract'][index] + `?clientCaseId=${encodeURIComponent(clientCase.id)}`} className="atlas-action atlas-action-secondary">{label}</Link>)}{clientCase.status === 'ACTIVE' ? <button disabled={busy} onClick={() => void action('ARCHIVE', { clientCaseId: clientCase.id })} className="atlas-action atlas-action-destructive"><Archive size={15} />Archive Case</button> : <button disabled={busy} onClick={() => void action('REACTIVATE', { clientCaseId: clientCase.id })} className="atlas-action atlas-action-primary"><RotateCcw size={15} />Reactivate Case</button>}</section>
    </>}
  </div></main>;

  return <main className="px-5 py-8 sm:px-8 lg:px-12" data-testid="client-cases-workspace"><div className="mx-auto max-w-6xl"><header className="border-b border-white/10 pb-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/70">Project Atlas / Agent Workspace</p><h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Client Work</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Create and discover durable Agent-owned advisory context. Creating a Case does not create a transaction, scenario, output, authorization, request, contact, or external action.</p></header>
    {status && <p className="atlas-workspace-status mt-5" role="status">{status}</p>}
    <section className="mt-6 border border-white/10 p-5"><h2 className="text-lg font-semibold text-white">New Client Case</h2><form onSubmit={createCase} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><input name="displayName" required maxLength={160} placeholder="Case display name" className="min-h-10 border border-white/15 bg-transparent px-3 text-sm text-white" /><input name="partyLabel" maxLength={160} placeholder="Optional primary party label" className="min-h-10 border border-white/15 bg-transparent px-3 text-sm text-white" /><button disabled={busy} className="atlas-action atlas-action-primary" type="submit"><Plus size={15} />Create Case</button></form></section>
    <div className="mt-6 flex items-center justify-between gap-4"><h2 className="text-lg font-semibold text-white">{showArchived ? 'Archived Cases' : 'Active Cases'}</h2><button type="button" className="atlas-action atlas-action-secondary" onClick={() => setShowArchived((value) => !value)}>{showArchived ? 'Show active' : 'Show archived'}</button></div>
    <section className="mt-4 space-y-3">{cases.length ? cases.map((item) => <Link key={item.id} href={`/agent/clients/${item.id}`} className="block border border-white/10 p-5 transition hover:border-cyan-100/40"><div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold text-white">{item.displayName}</h3><p className="mt-2 text-sm text-slate-400">{item._count?.parties || 0} parties · {item._count?.properties || 0} properties · {item._count?.transactions || 0} Transactions</p></div><span className="text-sm text-cyan-100">{item.status}</span></div><p className="mt-3 text-xs text-slate-500">Updated {dateTime(item.updatedAt)}</p></Link>) : <div className="atlas-empty-state">No {showArchived ? 'archived' : 'active'} Client Cases are available to this Agent.</div>}</section>
    <Link href="/agent" className="mt-6 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-cyan-100 hover:text-white"><Home size={16} />Workspace Home</Link>
  </div></main>;
}
