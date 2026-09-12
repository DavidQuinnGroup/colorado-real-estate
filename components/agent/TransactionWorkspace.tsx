'use client';

import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Plus, ShieldCheck } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { humanizeTransactionValue } from '@/lib/transactionPresentation';

type Party = { id: string; role: string; displayLabel: string };
type ClientCase = { id: string; displayName: string; status: string; parties: Party[]; properties: { canonicalPropertyId: string; role: string; canonicalProperty: { sourceFormattedSitusAddress: string | null; normalizedSitusAddress: string | null } }[] };
type Transaction = { id: string; displayTitle: string; side: string; status: string; stage: string; propertyDisplay: string; clientCase: { id: string; displayName: string } | null; _count: { parties: number; timelineEvents: number }; updatedAt: string };

async function request(path: string, body?: Record<string, unknown>) {
  const response = await fetch(path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' });
  const payload = await response.json() as Record<string, unknown>;
  if (!response.ok) throw new Error(typeof payload.error === 'string' ? payload.error : 'Transaction request failed.');
  return payload;
}

function propertyLabel(property: ClientCase['properties'][number]) {
  return property.canonicalProperty.sourceFormattedSitusAddress || property.canonicalProperty.normalizedSitusAddress || property.canonicalPropertyId;
}

export default function TransactionWorkspace() {
  const searchParams = useSearchParams();
  const clientCaseId = searchParams.get('clientCaseId');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clientCase, setClientCase] = useState<ClientCase | null>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [side, setSide] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [label, setLabel] = useState('');
  const [canonicalPropertyId, setCanonicalPropertyId] = useState('');
  const [partyIds, setPartyIds] = useState<string[]>([]);

  const load = useCallback(async () => {
    const query = clientCaseId ? `?clientCaseId=${encodeURIComponent(clientCaseId)}` : '';
    const transactionsPayload = await request(`/api/agent/transactions${query}`);
    setTransactions((transactionsPayload.transactions as Transaction[]) || []);
    if (clientCaseId) {
      const casePayload = await request(`/api/agent/client-cases?id=${encodeURIComponent(clientCaseId)}`);
      const nextCase = casePayload.clientCase as ClientCase;
      setClientCase(nextCase);
      setPartyIds((current) => current.length ? current : nextCase.parties.map((party) => party.id));
    } else setClientCase(null);
  }, [clientCaseId]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load().catch((error) => setStatus(error instanceof Error ? error.message : 'Transaction request failed.')); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function createTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clientCase) return;
    setBusy(true); setStatus('');
    try {
      const payload = await request('/api/agent/transactions', { action: 'CREATE', input: { clientCaseId: clientCase.id, side, label: label || undefined, canonicalPropertyId: canonicalPropertyId || undefined, selectedCasePartyIds: partyIds, clientMutationKey: `TRANSACTION_CASE_HANDOFF_${crypto.randomUUID()}` } });
      const transaction = payload.transaction as Transaction;
      window.location.assign(`/agent/transactions/${transaction.id}?clientCaseId=${encodeURIComponent(clientCase.id)}`);
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Transaction could not be created.'); }
    finally { setBusy(false); }
  }

  return <main className="px-5 py-8 sm:px-8 lg:px-12" data-testid="transactions-workspace"><div className="mx-auto max-w-6xl">
    <header className="border-b border-white/10 pb-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/70">Project Atlas / Agent Workspace</p><h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Transactions</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Controlled operational records linked to a Client Case. Creating or viewing a Transaction does not create a document, output, authorization, contact, or external action.</p>{clientCase && <p className="mt-4 text-sm font-semibold text-cyan-100">Client Case context: {clientCase.displayName}</p>}</header>
    {status && <p className="atlas-workspace-status mt-5" role="status">{status}</p>}
    {clientCase ? <section className="mt-6 border border-white/10 p-5"><h2 className="text-lg font-semibold text-white">Create Transaction</h2><p className="mt-2 text-sm text-slate-400">This creates a draft record for this exact Client Case. Buyer transactions may remain Property TBD; seller listings require a Case-attached property.</p><form onSubmit={createTransaction} className="mt-5 grid gap-4 lg:grid-cols-2"><label className="text-sm text-slate-300">Transaction type<select value={side} onChange={(event) => { const nextSide = event.target.value as 'BUYER' | 'SELLER'; setSide(nextSide); if (nextSide === 'BUYER') setCanonicalPropertyId(''); }} className="mt-1 min-h-10 w-full border border-white/15 bg-[#071014] px-3 text-white"><option value="BUYER">Buyer purchase</option><option value="SELLER">Seller listing</option></select></label><label className="text-sm text-slate-300">Display title (optional)<input value={label} maxLength={160} onChange={(event) => setLabel(event.target.value)} className="mt-1 min-h-10 w-full border border-white/15 bg-transparent px-3 text-white" placeholder={`${clientCase.displayName} - ${side === 'BUYER' ? 'Buyer purchase' : 'Seller listing'}`} /></label><label className="text-sm text-slate-300">Subject property {side === 'SELLER' ? '(required)' : '(optional)'}<select required={side === 'SELLER'} value={canonicalPropertyId} onChange={(event) => setCanonicalPropertyId(event.target.value)} className="mt-1 min-h-10 w-full border border-white/15 bg-[#071014] px-3 text-white"><option value="">{side === 'BUYER' ? 'Property TBD' : 'Select Case property'}</option>{clientCase.properties.map((property) => <option key={property.canonicalPropertyId} value={property.canonicalPropertyId}>{propertyLabel(property)}</option>)}</select></label><fieldset className="text-sm text-slate-300"><legend>Client Case parties</legend><div className="mt-2 space-y-2">{clientCase.parties.map((party) => <label className="flex items-center gap-2" key={party.id}><input type="checkbox" checked={partyIds.includes(party.id)} onChange={(event) => setPartyIds((current) => event.target.checked ? [...current, party.id] : current.filter((id) => id !== party.id))} />{party.displayLabel} <span className="text-slate-500">{humanizeTransactionValue(party.role)}</span></label>)}{!clientCase.parties.length && <p className="text-slate-400">Add at least one Case party before creating a Transaction.</p>}</div></fieldset><div className="lg:col-span-2"><button disabled={busy || !clientCase.parties.length} className="atlas-action atlas-action-primary" type="submit"><Plus size={15} />Create draft Transaction</button></div></form></section> : <section className="mt-6 border border-white/10 p-5"><h2 className="text-lg font-semibold text-white">Create from a Client Case</h2><p className="mt-2 text-sm text-slate-400">Transaction creation is intentionally available only in a validated Client Case context.</p><Link href="/agent/clients" className="atlas-action atlas-action-primary mt-4"><BriefcaseBusiness size={15} />Open Client Work</Link></section>}
    <section className="mt-7"><div className="flex items-center justify-between gap-4"><h2 className="text-lg font-semibold text-white">{clientCase ? 'Case Transactions' : 'All Transactions'}</h2><span className="text-sm text-slate-400">{transactions.length}</span></div><div className="mt-4 space-y-3">{transactions.length ? transactions.map((transaction) => <Link key={transaction.id} href={`/agent/transactions/${transaction.id}${clientCase ? `?clientCaseId=${encodeURIComponent(clientCase.id)}` : ''}`} className="block border border-white/10 p-5 transition hover:border-cyan-100/40"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="text-lg font-semibold text-white">{transaction.displayTitle}</h3><p className="mt-2 text-sm text-slate-300">{humanizeTransactionValue(transaction.side)} · {humanizeTransactionValue(transaction.status)} · {humanizeTransactionValue(transaction.stage)}</p><p className="mt-1 text-sm text-slate-400">{transaction.propertyDisplay}{transaction.clientCase && !clientCase ? ` · ${transaction.clientCase.displayName}` : ''}</p></div><ArrowRight size={18} className="text-cyan-100" aria-hidden="true" /></div></Link>) : <div className="atlas-empty-state">No {clientCase ? 'Transactions are linked to this Client Case' : 'Transaction records are available to this Agent'}.</div>}</div></section>
    <p className="mt-6 flex items-center gap-2 text-xs text-slate-400"><ShieldCheck size={14} className="text-cyan-100" />Transactions are internal records. Document storage and Compass office-file workflows remain inactive.</p>
  </div></main>;
}
