'use client';

import Link from 'next/link';
import { ArrowRight, Home, Plus, Search } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';

import styles from './ClientCommandCenter.module.css';

type ClientCase = { id: string; displayName: string; status: string; updatedAt: string; _count?: { parties: number; properties: number; transactions: number } };

function dateTime(value: string) { return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }

export default function ClientTrackerWorkspace() {
  const [clientCases, setClientCases] = useState<ClientCase[]>([]);
  const [query, setQuery] = useState('');
  const [newName, setNewName] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch('/api/agent/client-cases', { cache: 'no-store' }).then(async (response) => {
      const payload = await response.json() as { clientCases?: ClientCase[]; error?: string };
      if (!response.ok) throw new Error(payload.error || 'Clients are unavailable.');
      return payload.clientCases || [];
    }).then((clientCases) => { if (active) setClientCases(clientCases); }).catch((error) => { if (active) setStatus(error instanceof Error ? error.message : 'Clients are unavailable.'); });
    return () => { active = false; };
  }, []);

  async function createClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const displayName = newName.trim();
    if (!displayName) return;
    setBusy(true); setStatus('');
    try {
      const response = await fetch('/api/agent/client-cases', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'CREATE', input: { displayName, clientMutationKey: `CLIENT_TRACKER_CREATE_${crypto.randomUUID()}`, parties: [] } }) });
      const payload = await response.json() as { clientCase?: ClientCase; error?: string };
      if (!response.ok || !payload.clientCase) throw new Error(payload.error || 'Client could not be created.');
      window.location.assign(`/agent/clients/${encodeURIComponent(payload.clientCase.id)}`);
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Client could not be created.'); }
    finally { setBusy(false); }
  }

  const visibleClients = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return normalized ? clientCases.filter((clientCase) => clientCase.displayName.toLocaleLowerCase().includes(normalized)) : clientCases;
  }, [clientCases, query]);

  return <main className={styles.page} data-testid="client-tracker-workspace"><div className={styles.container}>
    <header className={styles.pageHeader}><div><p className={styles.eyebrow}>Project Atlas / Agent Workspace</p><h1 className={styles.pageTitle}>Client Tracker</h1><p className={styles.pageCopy}>Find a Client, scan the current context, and continue the work.</p></div><Link className={styles.utilityLink} href="/agent"><Home aria-hidden="true" size={16} />Workspace Home</Link></header>
    <section className={styles.trackerControls} aria-label="Client controls"><form className={styles.createForm} onSubmit={createClient}><label className={styles.srOnly} htmlFor="client-tracker-new-client">Client name</label><input className={styles.input} id="client-tracker-new-client" maxLength={160} onChange={(event) => setNewName(event.target.value)} placeholder="New Client name" value={newName} /><button className="atlas-action atlas-action-primary" disabled={busy} type="submit"><Plus aria-hidden="true" size={16} />Create Client</button></form><label className={styles.searchField} htmlFor="client-tracker-search"><Search aria-hidden="true" size={17} /><span className={styles.srOnly}>Search Clients</span><input id="client-tracker-search" onChange={(event) => setQuery(event.target.value)} placeholder="Search Clients" value={query} /></label></section>
    {status ? <p className="atlas-workspace-status mt-5" role="status">{status}</p> : null}
    <section aria-labelledby="client-tracker-results" className={styles.trackerList}><div className={styles.trackerListHeading}><h2 id="client-tracker-results">Active Clients</h2><span>{visibleClients.length}</span></div>{visibleClients.length ? visibleClients.map((clientCase) => <article className={styles.trackerRow} key={clientCase.id}><div><h3>{clientCase.displayName}</h3><p>{clientCase._count?.parties || 0} people · {clientCase._count?.properties || 0} properties · {clientCase._count?.transactions || 0} transactions</p></div><div className={styles.trackerRowMeta}><span>{clientCase.status === 'ACTIVE' ? 'Active' : clientCase.status}</span><span>Updated {dateTime(clientCase.updatedAt)}</span><Link className="atlas-action atlas-action-secondary" href={`/agent/clients/${encodeURIComponent(clientCase.id)}`}>Open Client<ArrowRight aria-hidden="true" size={16} /></Link></div></article>) : <div className="atlas-empty-state">No active Clients match this search.</div>}</section>
  </div></main>;
}
