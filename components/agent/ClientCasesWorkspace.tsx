'use client';

import Link from 'next/link';
import { Archive, ArrowLeft, ClipboardList, Home, Plus, RotateCcw, Users } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useState } from 'react';

import { AgentPropertyDiscoverySelect, type AgentPropertyDiscoverySelection } from './AgentPropertyDiscoverySelect';
import styles from './ClientCasesWorkspace.module.css';

type ClientCase = {
  id: string;
  displayName: string;
  status: 'ACTIVE' | 'ARCHIVED';
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  parties?: { id: string; role: string; displayLabel: string }[];
  properties?: { id: string; role: string; canonicalProperty: { id: string; sourceFormattedSitusAddress: string | null; normalizedSitusAddress: string | null; city: string | null; state: string | null; postalCode: string | null } }[];
  transactions?: { id: string; label: string; side: string; status: string; stage: string; updatedAt: string }[];
  _count?: { parties: number; properties: number; transactions: number };
};
type ContextRecord = { value: unknown };
type CanonicalInformationSummary = {
  current: {
    objectiveRecords: Array<{ id: string; objectiveType: string; status: string; title: string }>;
    targetCities: ContextRecord | null;
    purchasePriceRange: ContextRecord | null;
    minBedrooms: ContextRecord | null;
    propertyOccupancy: Array<{ current: ContextRecord | null }>;
  };
};

const partyRoles = ['PRIMARY_CLIENT', 'ADDITIONAL_CLIENT', 'OTHER_PARTY'];

function dateTime(value: string | null) { return value ? new Date(value).toLocaleString() : 'Not recorded'; }

async function request(body?: Record<string, unknown>, query = '') {
  const response = await fetch(`/api/agent/client-cases${query}`, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' });
  const payload = await response.json() as Record<string, unknown>;
  if (!response.ok) throw new Error(typeof payload.error === 'string' ? payload.error : 'Client Case request failed.');
  return payload;
}

async function informationRequest(clientCaseId: string) {
  const response = await fetch(`/api/agent/client-case-information?clientCaseId=${encodeURIComponent(clientCaseId)}`, { cache: 'no-store' });
  const payload = await response.json() as CanonicalInformationSummary & { error?: string };
  if (!response.ok) throw new Error(typeof payload.error === 'string' ? payload.error : 'Client Case information request failed.');
  return payload;
}

function formatRecordValue(value: unknown) {
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'Not provided';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return value.replaceAll('_', ' ');
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (typeof record.minimumCents === 'number' && typeof record.maximumCents === 'number') return `$${(record.minimumCents / 100).toLocaleString()} - $${(record.maximumCents / 100).toLocaleString()}`;
    return 'Provided';
  }
  return 'Not provided';
}

export default function ClientCasesWorkspace({ clientCaseId }: { clientCaseId?: string }) {
  const [cases, setCases] = useState<ClientCase[]>([]);
  const [clientCase, setClientCase] = useState<ClientCase | null>(null);
  const [informationSummary, setInformationSummary] = useState<CanonicalInformationSummary | null>(null);
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
        if (clientCaseId) {
          setClientCase(payload.clientCase as ClientCase);
          informationRequest(clientCaseId).then((summary) => { if (!cancelled) setInformationSummary(summary); }).catch(() => { if (!cancelled) setInformationSummary(null); });
        } else {
          setCases((payload.clientCases as ClientCase[]) || []);
        }
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

  async function attachDiscoveredProperty(selection: AgentPropertyDiscoverySelection) {
    if (!clientCase) return;
    setBusy(true);
    try {
      const response = await request({ action: 'ATTACH_DISCOVERED_PROPERTY', clientCaseId: clientCase.id, input: { discoveryResultToken: selection.discoveryResultToken, roles: selection.roles } });
      if (response.clientCase) setClientCase(response.clientCase as ClientCase);
      setStatus(selection.alreadyLinked ? 'Property was already linked. Relationship roles are now current where needed.' : 'Property relationship saved. Existing property identity was linked without external lookup.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Property relationship could not be saved.';
      setStatus(message);
      throw new Error(message);
    } finally {
      setBusy(false);
    }
  }

  if (clientCaseId) return <main className={styles.page} data-testid="client-case-detail"><div className={styles.container}>
    <Link href="/agent/clients" className={styles.backLink}><ArrowLeft size={16} />Client Work</Link>
    {status && <p className="atlas-workspace-status mt-5" role="status">{status}</p>}
    {!clientCase ? <p className="mt-8 text-slate-300">Loading Client Case...</p> : <>
      <header className={styles.header}><p className={styles.eyebrow}>Project Atlas / Client Work</p><h1 className={styles.title}>{clientCase.displayName}</h1><p className={styles.statusLine}>Status: {clientCase.status}</p><div className={styles.actionRow}>{['Buyer','Seller','Financial Strategy','Intelligence','Transactions','Outputs'].map((label, index) => <Link key={label} href={[ '/agent/prepare/buyer','/agent/prepare/seller','/agent/strategy','/agent/prepare/market','/agent/transactions','/agent/outputs'][index] + `?clientCaseId=${encodeURIComponent(clientCase.id)}`} className="atlas-action atlas-action-secondary">{label}</Link>)}<Link href={`/agent/clients/${encodeURIComponent(clientCase.id)}/information`} className="atlas-action atlas-action-secondary">Information</Link><Link href={`/agent/clients/${encodeURIComponent(clientCase.id)}/readiness`} className="atlas-action atlas-action-secondary">Readiness</Link></div><p className={styles.copy}>Client Case context is Agent-private and keeps advisory relationships distinct from transactions, authorizations, outputs, and professional evidence.</p></header>
      <div className={styles.grid}>
        <section className={styles.surface}><h2 className={styles.sectionTitle}>Client / party context</h2>{clientCase.parties?.length ? <ul className={styles.list}>{clientCase.parties.map((party) => <li key={party.id}>{party.displayLabel} <span className={styles.mutedText}>{party.role}</span></li>)}</ul> : <p className={styles.emptyCopy}>No party context recorded.</p>}<form onSubmit={addParty} className={`${styles.form} ${styles.formSplit}`}><input name="displayLabel" required maxLength={160} placeholder="Party display label" className={styles.input} /><select name="role" className={styles.select}>{partyRoles.map((role) => <option key={role}>{role}</option>)}</select><button disabled={busy} className="atlas-action atlas-action-secondary" type="submit"><Users size={15} />Add party</button></form></section>
        <section className={styles.surface}><h2 className={styles.sectionTitle}>Properties</h2>{clientCase.properties?.length ? <ul className={styles.list}>{clientCase.properties.map((property) => <li key={property.id}><p className={styles.strongText}>{property.canonicalProperty.sourceFormattedSitusAddress || property.canonicalProperty.normalizedSitusAddress || property.canonicalProperty.id}</p><p className={styles.metadata}>Case role: {property.role}</p></li>)}</ul> : <p className={styles.emptyCopy}>No properties attached to this Case.</p>}<AgentPropertyDiscoverySelect busy={busy} clientCaseId={clientCase.id} onAttach={attachDiscoveredProperty} /></section>
      </div>
      <section className={styles.linkedWork} data-testid="client-case-information-summary-card"><div className={styles.cardHeader}><h2 className={styles.sectionTitle}>Canonical information</h2><Link href={`/agent/clients/${encodeURIComponent(clientCase.id)}/information`} className={styles.recordLink}><ClipboardList size={16} />View / edit</Link></div>{informationSummary ? <ul className={`${styles.list} ${styles.summaryGrid}`}><li><span className={styles.mutedText}>Objectives</span><br />{informationSummary.current.objectiveRecords.filter((objective) => objective.status === 'ACTIVE').map((objective) => objective.title).join(', ') || 'No current Objectives'}</li><li><span className={styles.mutedText}>Target cities</span><br />{formatRecordValue(informationSummary.current.targetCities?.value)}</li><li><span className={styles.mutedText}>Purchase range</span><br />{formatRecordValue(informationSummary.current.purchasePriceRange?.value)}</li><li><span className={styles.mutedText}>Minimum bedrooms</span><br />{formatRecordValue(informationSummary.current.minBedrooms?.value)}</li><li><span className={styles.mutedText}>Property occupancy</span><br />{informationSummary.current.propertyOccupancy.some((entry) => entry.current) ? `${informationSummary.current.propertyOccupancy.filter((entry) => entry.current).length} current fact${informationSummary.current.propertyOccupancy.filter((entry) => entry.current).length === 1 ? '' : 's'}` : 'Not provided'}</li></ul> : <p className={styles.emptyCopy}>Canonical information summary is unavailable. Open Information to review or maintain the current context.</p>}</section>
      <section className={styles.linkedWork}><h2 className={styles.sectionTitle}>Linked work</h2>{clientCase.transactions?.length ? <ul className={styles.list}>{clientCase.transactions.map((transaction) => <li key={transaction.id}><Link href={`/agent/transactions/${transaction.id}?clientCaseId=${encodeURIComponent(clientCase.id)}`} className={styles.recordLink}>{transaction.label}</Link> <span className={styles.mutedText}>{transaction.side} / {transaction.status} / {transaction.stage}</span></li>)}</ul> : <p className={styles.emptyCopy}>No linked Transactions yet. Output, Professional Input, and financial scenario relationships are deferred to their owning foundations.</p>}</section>
      <section className={styles.lifecycleActions} aria-label="Case lifecycle actions">{clientCase.status === 'ACTIVE' ? <button disabled={busy} onClick={() => void action('ARCHIVE', { clientCaseId: clientCase.id })} className="atlas-action atlas-action-destructive"><Archive size={15} />Archive Case</button> : <button disabled={busy} onClick={() => void action('REACTIVATE', { clientCaseId: clientCase.id })} className="atlas-action atlas-action-primary"><RotateCcw size={15} />Reactivate Case</button>}</section>
    </>}
  </div></main>;

  return <main className={styles.page} data-testid="client-cases-workspace"><div className={styles.container}><header className={styles.listHeader}><p className={styles.eyebrow}>Project Atlas / Agent Workspace</p><h1 className={styles.title}>Client Work</h1><p className={styles.copy}>Create and discover durable Agent-owned advisory context. Creating a Case does not create a transaction, scenario, output, authorization, request, contact, or external action.</p></header>
    {status && <p className="atlas-workspace-status mt-5" role="status">{status}</p>}
    <section className={`${styles.surface} ${styles.newCase}`}><h2 className={styles.sectionTitle}>New Client Case</h2><form onSubmit={createCase} className={`${styles.form} ${styles.createForm}`}><input name="displayName" required maxLength={160} placeholder="Case display name" className={styles.input} /><input name="partyLabel" maxLength={160} placeholder="Optional primary party label" className={styles.input} /><button disabled={busy} className="atlas-action atlas-action-primary" type="submit"><Plus size={15} />Create Case</button></form></section>
    <div className={styles.caseListHeader}><h2 className={styles.sectionTitle}>{showArchived ? 'Archived Cases' : 'Active Cases'}</h2><button type="button" className="atlas-action atlas-action-secondary" onClick={() => setShowArchived((value) => !value)}>{showArchived ? 'Show active' : 'Show archived'}</button></div>
    <section className={styles.caseList}>{cases.length ? cases.map((item) => <Link key={item.id} href={`/agent/clients/${item.id}`} className={styles.caseCard}><div className={styles.caseCardHeader}><div><h3 className={styles.caseCardTitle}>{item.displayName}</h3><p className={styles.metadata}>{item._count?.parties || 0} parties · {item._count?.properties || 0} properties · {item._count?.transactions || 0} Transactions</p></div><span className={styles.caseStatus}>{item.status}</span></div><p className={styles.metadata}>Updated {dateTime(item.updatedAt)}</p></Link>) : <div className="atlas-empty-state">No {showArchived ? 'archived' : 'active'} Client Cases are available to this Agent.</div>}</section>
    <Link href="/agent" className={styles.homeLink}><Home size={16} />Workspace Home</Link>
  </div></main>;
}
