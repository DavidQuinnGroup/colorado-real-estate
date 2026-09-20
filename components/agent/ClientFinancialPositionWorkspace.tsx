'use client';

import Link from 'next/link';
import { ChevronUp, ExternalLink, History, Pencil, Plus, RotateCcw, Save, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AtlasButton, AtlasEmptyState, AtlasErrorState, AtlasField, AtlasInformationClassLabel, AtlasLoadingState, AtlasNotice, AtlasSurface } from '@/components/design-system/AtlasDesignSystem';
import styles from './ClientFinancialPositionWorkspace.module.css';

type Domain = 'ASSET' | 'LIABILITY' | 'INCOME' | 'QUALIFICATION' | 'CONSTRAINT';
type Observation = {
  id: string; marketValueCents: number | null; liquidValueCents: number | null; availableAmountCents: number | null; currentBalanceCents: number | null; monthlyObligationCents: number | null; amountCents: number | null; maximumLoanAmountCents: number | null; maximumPurchaseAmountCents: number | null; rateBps: number | null; frequency: string | null; programLabel: string | null; conditions: string | null; sourcePosture: string; verificationState: string; observationKind: string; financialSourceId: string | null; asOf: string | null; observedAt: string | null; effectiveAt: string | null; expiresAt: string | null; reviewAfter: string | null; freshness: 'CURRENT' | 'REVIEW_RECOMMENDED' | 'EXPIRED'; source: { id: string; label: string } | null;
};
type RecordItem = { id: string; domain: Domain; category: string; label: string; clientCasePartyId: string | null; clientCasePropertyId: string | null; current: Observation | null };
type Workspace = {
  clientCase: { id: string; displayName: string; status: string; participants: Array<{ id: string; displayLabel: string; role: string }>; properties: Array<{ id: string; label: string }> };
  position: { id: string; createdAt: string | null; domains: RecordItem[] } | null;
  sourceCandidates: Array<{ id: string; sourceKind: string; claimKind: string; label: string; effectiveAt: string | null; expiresAt: string | null; reviewAfter: string | null }>;
  summary: { entered: boolean; domains: Array<{ domain: Domain; count: number }>; reviewRecommended: number; expiredQualifications: number };
};
type Draft = Record<string, string>;

const domainMeta: Record<Domain, { title: string; add: string; entityAction: string; updateAction: string; entityId: string; categories: Array<[string, string]> }> = {
  ASSET: { title: 'Resources', add: 'Resource / available funds', entityAction: 'CREATE_ASSET', updateAction: 'UPDATE_ASSET', entityId: 'assetId', categories: [['CASH', 'Cash'], ['LIQUID_INVESTMENT', 'Liquid investment'], ['RETIREMENT_ACCESSIBLE', 'Accessible retirement'], ['OTHER_AVAILABLE_RESOURCE', 'Other available resource']] },
  INCOME: { title: 'Income', add: 'Income', entityAction: 'CREATE_INCOME', updateAction: 'UPDATE_INCOME', entityId: 'incomeId', categories: [['SALARY', 'Salary'], ['SELF_EMPLOYMENT', 'Self-employment'], ['COMMISSION', 'Commission'], ['BONUS', 'Bonus'], ['RENTAL', 'Rental'], ['OTHER', 'Other']] },
  LIABILITY: { title: 'Debt & obligations', add: 'Debt / obligation', entityAction: 'CREATE_LIABILITY', updateAction: 'UPDATE_LIABILITY', entityId: 'liabilityId', categories: [['MORTGAGE', 'Mortgage'], ['HELOC', 'HELOC'], ['AUTO_LOAN', 'Auto loan'], ['STUDENT_LOAN', 'Student loan'], ['CREDIT_CARD', 'Credit card'], ['PERSONAL_LOAN', 'Personal loan'], ['OTHER', 'Other']] },
  QUALIFICATION: { title: 'Lender qualification', add: 'Lender qualification / preapproval', entityAction: 'CREATE_QUALIFICATION', updateAction: 'UPDATE_QUALIFICATION', entityId: 'qualificationId', categories: [['PREAPPROVAL', 'Preapproval'], ['PREQUALIFICATION', 'Prequalification'], ['OTHER_LENDER_QUALIFICATION', 'Other lender qualification']] },
  CONSTRAINT: { title: 'Financial preferences', add: 'Financial preference / constraint', entityAction: 'CREATE_CONSTRAINT', updateAction: 'UPDATE_CONSTRAINT', entityId: 'constraintId', categories: [['MINIMUM_RETAINED_LIQUIDITY', 'Minimum retained liquidity'], ['MAXIMUM_CASH_DEPLOYMENT', 'Maximum cash deployment'], ['MAXIMUM_COMFORTABLE_HOUSING_PAYMENT', 'Maximum comfortable housing payment']] },
};
const domainOrder: Domain[] = ['ASSET', 'INCOME', 'LIABILITY', 'QUALIFICATION', 'CONSTRAINT'];

function today() { return new Date().toISOString().slice(0, 10); }
function humanize(value: string) { return value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function dollars(value: number | null) { return value === null ? '' : (value / 100).toFixed(2).replace(/\.00$/, ''); }
function currency(value: number | null) { return value === null ? 'Not provided' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100); }
function percent(value: number | null) { return value === null ? null : `${(value / 100).toFixed(2).replace(/\.00$/, '')}%`; }
function date(value: string | null) { return value ? new Date(value).toLocaleDateString() : null; }
function errorMessage(payload: unknown) { return typeof payload === 'object' && payload && 'error' in payload && typeof payload.error === 'string' ? payload.error : 'Financial Position is unavailable.'; }

function emptyDraft(domain: Domain): Draft {
  const category = domainMeta[domain].categories[0][0];
  return { category, label: '', clientCasePartyId: '', clientCasePropertyId: '', marketValueCents: '', liquidValueCents: '', availableAmountCents: '', currentBalanceCents: '', monthlyObligationCents: '', amountCents: '', maximumLoanAmountCents: '', maximumPurchaseAmountCents: '', rateBps: '', frequency: 'MONTHLY', programLabel: '', conditions: '', sourcePosture: 'CLIENT_STATED', verificationState: 'UNVERIFIED', clientCaseGovernedSourceId: '', observationKind: 'REPORTED', limitation: '', asOf: today(), observedAt: '', effectiveAt: '', expiresAt: '', reviewAfter: '' };
}

function draftFromRecord(record: RecordItem): Draft {
  const current = record.current;
  return {
    ...emptyDraft(record.domain),
    category: record.category,
    label: record.label,
    clientCasePartyId: record.clientCasePartyId ?? '',
    clientCasePropertyId: record.clientCasePropertyId ?? '',
    marketValueCents: dollars(current?.marketValueCents ?? null), liquidValueCents: dollars(current?.liquidValueCents ?? null), availableAmountCents: dollars(current?.availableAmountCents ?? null),
    currentBalanceCents: dollars(current?.currentBalanceCents ?? null), monthlyObligationCents: dollars(current?.monthlyObligationCents ?? null), amountCents: dollars(current?.amountCents ?? null),
    maximumLoanAmountCents: dollars(current?.maximumLoanAmountCents ?? null), maximumPurchaseAmountCents: dollars(current?.maximumPurchaseAmountCents ?? null), rateBps: percent(current?.rateBps ?? null)?.replace('%', '') ?? '', frequency: current?.frequency ?? 'MONTHLY', programLabel: current?.programLabel ?? '', conditions: current?.conditions ?? '', sourcePosture: current?.sourcePosture ?? 'CLIENT_STATED', verificationState: current?.verificationState ?? 'UNVERIFIED', clientCaseGovernedSourceId: current?.source?.id ?? '', observationKind: 'REPORTED', limitation: '', asOf: current?.asOf?.slice(0, 10) ?? today(), observedAt: current?.observedAt?.slice(0, 10) ?? '', effectiveAt: current?.effectiveAt?.slice(0, 10) ?? '', expiresAt: current?.expiresAt?.slice(0, 10) ?? '', reviewAfter: current?.reviewAfter?.slice(0, 10) ?? '', supersedesObservationId: current?.id ?? '',
  };
}

async function requestWorkspace(clientCaseId: string) {
  const response = await fetch(`/api/agent/client-financial-position?clientCaseId=${encodeURIComponent(clientCaseId)}`, { cache: 'no-store' });
  const payload = await response.json() as Workspace;
  if (!response.ok) throw new Error(errorMessage(payload));
  return payload;
}

export function ClientFinancialPositionWorkspace({ clientCaseId }: { clientCaseId: string }) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeDomain, setActiveDomain] = useState<Domain | null>(null);
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [history, setHistory] = useState<Record<string, Observation[]>>({});
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const refresh = useCallback(() => requestWorkspace(clientCaseId).then(setWorkspace).catch((error: unknown) => setLoadError(error instanceof Error ? error.message : 'Financial Position is unavailable.')), [clientCaseId]);
  useEffect(() => { void refresh(); }, [refresh]);
  const visibleDomains = useMemo(() => domainOrder.filter((domain) => workspace?.position?.domains.some((record) => record.domain === domain) || activeDomain === domain), [workspace, activeDomain]);

  function openAdd(domain: Domain) { setEditing(null); setActiveDomain(domain); setDraft(emptyDraft(domain)); setStatus(null); }
  function openEdit(record: RecordItem) { setEditing(record); setActiveDomain(record.domain); setDraft(draftFromRecord(record)); setStatus(null); }
  function closeDraft() { setActiveDomain(null); setEditing(null); setDraft(null); setStatus(null); }
  function clearDraft() { if (activeDomain) setDraft(emptyDraft(activeDomain)); }
  function patchDraft(key: string, value: string) { setDraft((current) => current ? { ...current, [key]: value } : current); }

  async function saveDraft() {
    if (!workspace || !activeDomain || !draft) return;
    setBusy(true); setStatus(null);
    const meta = domainMeta[activeDomain];
    const commonObservation = {
      sourcePosture: draft.sourcePosture,
      verificationState: draft.verificationState,
      observationKind: draft.observationKind,
      limitation: draft.limitation || null,
      asOf: draft.asOf,
      observedAt: draft.observedAt || null,
      effectiveAt: draft.effectiveAt || null,
      reviewAfter: draft.reviewAfter || null,
      supersedesObservationId: editing?.current?.id ?? null,
    };
    const observation = activeDomain === 'ASSET'
      ? { ...commonObservation, marketValueCents: draft.marketValueCents, liquidValueCents: draft.liquidValueCents, availableAmountCents: draft.availableAmountCents }
      : activeDomain === 'LIABILITY'
        ? { ...commonObservation, currentBalanceCents: draft.currentBalanceCents, monthlyObligationCents: draft.monthlyObligationCents, rateBps: draft.rateBps }
        : activeDomain === 'INCOME'
          ? { ...commonObservation, amountCents: draft.amountCents, frequency: draft.frequency }
          : activeDomain === 'QUALIFICATION'
            ? { ...commonObservation, maximumLoanAmountCents: draft.maximumLoanAmountCents, maximumPurchaseAmountCents: draft.maximumPurchaseAmountCents, rateBps: draft.rateBps, programLabel: draft.programLabel, conditions: draft.conditions, expiresAt: draft.expiresAt || null }
            : { ...commonObservation, amountCents: draft.amountCents };
    const entity = activeDomain === 'QUALIFICATION' ? { qualificationType: draft.category, label: draft.label } : activeDomain === 'CONSTRAINT' ? { constraintType: draft.category } : { category: draft.category, label: draft.label, clientCasePartyId: draft.clientCasePartyId || null, ...(activeDomain === 'LIABILITY' || activeDomain === 'INCOME' ? { clientCasePropertyId: draft.clientCasePropertyId || null } : {}) };
    const body: Record<string, unknown> = editing
      ? { action: meta.updateAction, clientCaseId, [meta.entityId]: editing.id, input: { ...observation, clientCaseGovernedSourceId: draft.clientCaseGovernedSourceId || null } }
      : { action: meta.entityAction, clientCaseId, input: { entity, observation, clientCaseGovernedSourceId: draft.clientCaseGovernedSourceId || null } };
    try {
      const response = await fetch('/api/agent/client-financial-position', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const payload = await response.json() as { workspace?: Workspace; error?: string };
      if (!response.ok) throw new Error(errorMessage(payload));
      if (payload.workspace) setWorkspace(payload.workspace);
      closeDraft();
      setStatus(editing ? `${meta.title} updated. The prior observation remains in history.` : `${meta.title} recorded.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Financial Position could not be saved.');
    } finally { setBusy(false); }
  }

  async function toggleHistory(record: RecordItem) {
    if (history[record.id]) { setHistory((current) => { const next = { ...current }; delete next[record.id]; return next; }); return; }
    setBusy(true); setStatus(null);
    try {
      const response = await fetch(`/api/agent/client-financial-position?clientCaseId=${encodeURIComponent(clientCaseId)}&historyDomain=${record.domain}&entityId=${encodeURIComponent(record.id)}`, { cache: 'no-store' });
      const payload = await response.json() as { history?: Observation[]; error?: string };
      if (!response.ok) throw new Error(errorMessage(payload));
      setHistory((current) => ({ ...current, [record.id]: payload.history ?? [] }));
    } catch (error) { setStatus(error instanceof Error ? error.message : 'History is unavailable.'); } finally { setBusy(false); }
  }

  if (loadError) return <AtlasErrorState title="Financial Position is unavailable"><p>{loadError}</p><AtlasButton tone="secondary" onClick={() => void refresh()}>Try again</AtlasButton></AtlasErrorState>;
  if (!workspace) return <AtlasLoadingState>Loading Financial Position.</AtlasLoadingState>;
  const recordsFor = (domain: Domain) => workspace.position?.domains.filter((record) => record.domain === domain) ?? [];

  return <section className={styles.workspace} data-testid="client-financial-position-workspace">
    <div className={styles.heading}><div><p className={styles.eyebrow}>Client Information</p><h2 className="atlas-ds-major-section">Financial Position</h2><p className={styles.copy}>Record current financial facts with their source and timing. This workspace does not calculate affordability or make a recommendation.</p></div><AtlasInformationClassLabel informationClass="governed-fact" label="Case-scoped financial facts" /></div>
    {status ? <AtlasNotice title="Financial Position" tone={status.includes('could not') || status.includes('required') || status.includes('unavailable') || status.includes('changed since') ? 'attention' : 'success'}>{status}</AtlasNotice> : null}
    {!workspace.position ? <AtlasEmptyState title="No financial information entered"><p>Financial information is optional. Add a financial fact only when it is useful to the Client Case.</p><AtlasButton onClick={() => openAdd('ASSET')}><Plus aria-hidden="true" size={16} />Add financial information</AtlasButton></AtlasEmptyState> : <>
      <div className={styles.overview}><AtlasSurface material="data"><span>Financial Position</span><strong>Available</strong></AtlasSurface>{workspace.summary.domains.filter((entry) => entry.count).map((entry) => <AtlasSurface key={entry.domain} material="data"><span>{domainMeta[entry.domain].title}</span><strong>{entry.count} {entry.count === 1 ? 'record' : 'records'}</strong></AtlasSurface>)}{workspace.summary.reviewRecommended ? <AtlasSurface material="data"><span>Review attention</span><strong>{workspace.summary.reviewRecommended} recommended</strong></AtlasSurface> : null}</div>
      <div className={styles.actions}><AtlasButton onClick={() => openAdd('ASSET')}><Plus aria-hidden="true" size={16} />Add financial information</AtlasButton>{domainOrder.map((domain) => <AtlasButton key={domain} tone="ghost" onClick={() => openAdd(domain)}>Add {domainMeta[domain].title}</AtlasButton>)}</div>
    </>}
    {activeDomain && draft ? <DraftForm busy={busy} clientCaseId={clientCaseId} draft={draft} editing={editing} onCancel={closeDraft} onChange={patchDraft} onClear={clearDraft} onSave={() => void saveDraft()} domain={activeDomain} workspace={workspace} /> : null}
    {visibleDomains.map((domain) => <section className={styles.domain} key={domain}><div className={styles.domainHeading}><div><h3>{domainMeta[domain].title}</h3><p>{recordsFor(domain).length ? `${recordsFor(domain).length} current ${recordsFor(domain).length === 1 ? 'record' : 'records'}` : 'No current records'}</p></div><AtlasButton tone="secondary" onClick={() => openAdd(domain)}><Plus aria-hidden="true" size={16} />Add</AtlasButton></div>{recordsFor(domain).length ? <div className={styles.recordList}>{recordsFor(domain).map((record) => <RecordCard busy={busy} history={history[record.id]} key={record.id} onEdit={() => openEdit(record)} onHistory={() => void toggleHistory(record)} record={record} workspace={workspace} />)}</div> : <p className={styles.muted}>Use Add financial information when this domain is relevant.</p>}</section>)}
  </section>;
}

function RecordCard({ busy, history, onEdit, onHistory, record, workspace }: { busy: boolean; history: Observation[] | undefined; onEdit: () => void; onHistory: () => void; record: RecordItem; workspace: Workspace }) {
  const current = record.current;
  const participant = record.clientCasePartyId ? workspace.clientCase.participants.find((item) => item.id === record.clientCasePartyId)?.displayLabel ?? 'Historical participant' : 'Joint / Client Case';
  const property = record.clientCasePropertyId ? workspace.clientCase.properties.find((item) => item.id === record.clientCasePropertyId)?.label ?? 'Historical property' : null;
  const values = record.domain === 'ASSET' ? [['Current value', currency(current?.marketValueCents ?? null)], ['Available for real-estate purposes', currency(current?.availableAmountCents ?? null)]] : record.domain === 'LIABILITY' ? [['Current balance', currency(current?.currentBalanceCents ?? null)], ['Monthly obligation', currency(current?.monthlyObligationCents ?? null)], ['Quoted rate', percent(current?.rateBps ?? null) ?? 'Not provided']] : record.domain === 'INCOME' ? [['Amount', currency(current?.amountCents ?? null)], ['Frequency', current?.frequency ? humanize(current.frequency) : 'Not provided']] : record.domain === 'QUALIFICATION' ? [['Maximum loan', currency(current?.maximumLoanAmountCents ?? null)], ['Maximum purchase', currency(current?.maximumPurchaseAmountCents ?? null)], ['Quoted rate', percent(current?.rateBps ?? null) ?? 'Not provided']] : [['Amount', currency(current?.amountCents ?? null)]];
  return <AtlasSurface className={styles.record} material="glass"><div className={styles.recordHeading}><div><p className={styles.category}>{humanize(record.category)}</p><h4>{record.label}</h4><p>{participant}{property ? ` · ${property}` : ''}</p></div>{current?.freshness === 'EXPIRED' ? <span className={styles.expired}>Expired</span> : current?.freshness === 'REVIEW_RECOMMENDED' ? <span className={styles.review}>Review recommended</span> : null}</div><dl className={styles.values}>{values.filter(([, value]) => value !== 'Not provided').map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{current ? <div className={styles.metadata}><span>As of {date(current.asOf) ?? 'not provided'}</span><span>{humanize(current.sourcePosture)}</span><span>{humanize(current.verificationState)}</span>{current.source ? <span>{current.source.label}</span> : null}</div> : null}<div className={styles.recordActions}><AtlasButton disabled={busy || !current} tone="secondary" onClick={onEdit}><Pencil aria-hidden="true" size={16} />Update</AtlasButton><AtlasButton aria-expanded={Boolean(history)} disabled={busy} tone="ghost" onClick={onHistory}>{history ? <ChevronUp aria-hidden="true" size={16} /> : <History aria-hidden="true" size={16} />}{history ? 'Hide history' : 'View history'}</AtlasButton></div>{history ? <div className={styles.history}>{history.map((entry) => <div key={entry.id}><strong>{entry.observationKind === 'CORRECTION' ? 'Correction' : 'Prior observation'}</strong><span>As of {date(entry.asOf) ?? 'not provided'} · {humanize(entry.sourcePosture)} · {humanize(entry.verificationState)}</span></div>)}</div> : null}</AtlasSurface>;
}

function DraftForm({ busy, clientCaseId, domain, draft, editing, onCancel, onChange, onClear, onSave, workspace }: { busy: boolean; clientCaseId: string; domain: Domain; draft: Draft; editing: RecordItem | null; onCancel: () => void; onChange: (key: string, value: string) => void; onClear: () => void; onSave: () => void; workspace: Workspace }) {
  const meta = domainMeta[domain];
  const sourceRequired = draft.sourcePosture === 'DOCUMENT_SUPPORTED' || draft.sourcePosture === 'PROFESSIONAL_PROVIDED' || draft.verificationState === 'DOCUMENT_SUPPORTED' || draft.verificationState === 'PROFESSIONAL_CONFIRMED';
  const field = (key: string, label: string, props: Record<string, unknown> = {}) => <AtlasField htmlFor={`financial-${domain}-${key}`} label={label}><input className={styles.input} id={`financial-${domain}-${key}`} value={draft[key] ?? ''} onChange={(event) => onChange(key, event.target.value)} {...props} /></AtlasField>;
  return <AtlasSurface className={styles.draft} material="floating"><div className={styles.draftHeading}><div><p className={styles.eyebrow}>{editing ? 'Update current fact' : 'Add financial information'}</p><h3>{editing ? `Update ${meta.title}` : meta.add}</h3></div><AtlasButton aria-label="Cancel Financial Position draft" tone="ghost" onClick={onCancel}><X aria-hidden="true" size={18} /></AtlasButton></div>{editing ? <AtlasField htmlFor="financial-update-kind" label="Reason for update"><select className={styles.select} id="financial-update-kind" value={draft.observationKind} onChange={(event) => onChange('observationKind', event.target.value)}><option value="REPORTED">Information changed</option><option value="CORRECTION">Correct previous entry</option></select></AtlasField> : null}<div className={styles.fields}>{domain !== 'CONSTRAINT' ? <><AtlasField htmlFor={`financial-${domain}-category`} label="Category"><select className={styles.select} id={`financial-${domain}-category`} value={draft.category} onChange={(event) => onChange('category', event.target.value)}>{meta.categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></AtlasField>{field('label', domain === 'QUALIFICATION' ? 'Lender / source label' : 'Label', { maxLength: 160, required: true })}</> : <AtlasField htmlFor="financial-constraint-category" label="Preference or constraint"><select className={styles.select} id="financial-constraint-category" value={draft.category} onChange={(event) => onChange('category', event.target.value)}>{meta.categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></AtlasField>}{domain !== 'QUALIFICATION' && domain !== 'CONSTRAINT' ? <AtlasField htmlFor={`financial-${domain}-participant`} label="Applies to"><select className={styles.select} id={`financial-${domain}-participant`} value={draft.clientCasePartyId} onChange={(event) => onChange('clientCasePartyId', event.target.value)}><option value="">Joint / Client Case</option>{workspace.clientCase.participants.map((participant) => <option key={participant.id} value={participant.id}>{participant.displayLabel}</option>)}</select></AtlasField> : null}{(domain === 'LIABILITY' || domain === 'INCOME') ? <AtlasField htmlFor={`financial-${domain}-property`} label="Existing Client Case Property"><select className={styles.select} id={`financial-${domain}-property`} value={draft.clientCasePropertyId} onChange={(event) => onChange('clientCasePropertyId', event.target.value)}><option value="">No Property selected</option>{workspace.clientCase.properties.map((property) => <option key={property.id} value={property.id}>{property.label}</option>)}</select></AtlasField> : null}</div>{domain === 'ASSET' ? <div className={styles.fields}>{field('marketValueCents', 'Current value', { inputMode: 'decimal', placeholder: '0.00' })}{field('liquidValueCents', 'Liquid value', { inputMode: 'decimal', placeholder: '0.00' })}{field('availableAmountCents', 'Available for real-estate purposes', { inputMode: 'decimal', placeholder: '0.00' })}</div> : null}{domain === 'LIABILITY' ? <div className={styles.fields}>{field('currentBalanceCents', 'Current balance', { inputMode: 'decimal', placeholder: '0.00' })}{field('monthlyObligationCents', 'Monthly obligation', { inputMode: 'decimal', placeholder: '0.00' })}{field('rateBps', 'Quoted rate', { inputMode: 'decimal', placeholder: '6.50' })}</div> : null}{domain === 'INCOME' ? <div className={styles.fields}>{field('amountCents', 'Amount', { inputMode: 'decimal', placeholder: '0.00' })}<AtlasField htmlFor="financial-income-frequency" label="Frequency"><select className={styles.select} id="financial-income-frequency" value={draft.frequency} onChange={(event) => onChange('frequency', event.target.value)}>{['WEEKLY', 'BIWEEKLY', 'SEMIMONTHLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL'].map((value) => <option key={value} value={value}>{humanize(value)}</option>)}</select></AtlasField></div> : null}{domain === 'QUALIFICATION' ? <><div className={styles.fields}>{field('maximumLoanAmountCents', 'Maximum loan amount', { inputMode: 'decimal', placeholder: '0.00' })}{field('maximumPurchaseAmountCents', 'Maximum purchase amount', { inputMode: 'decimal', placeholder: '0.00' })}{field('programLabel', 'Program', { maxLength: 160 })}{field('rateBps', 'Quoted rate', { inputMode: 'decimal', placeholder: '6.50' })}</div>{field('conditions', 'Conditions / limitations', { maxLength: 1000 })}<p className={styles.disclosure}>Lender qualification reflects information supplied by the lender/source and is not an Atlas affordability recommendation.</p></> : null}{domain === 'CONSTRAINT' ? field('amountCents', 'Amount', { inputMode: 'decimal', placeholder: '0.00' }) : null}<details className={styles.advanced}><summary>Source and timing</summary><div className={styles.fields}><AtlasField htmlFor="financial-source-posture" label="Source posture"><select className={styles.select} id="financial-source-posture" value={draft.sourcePosture} onChange={(event) => onChange('sourcePosture', event.target.value)}><option value="CLIENT_STATED">Client stated</option><option value="AGENT_ENTERED_FROM_CLIENT">Agent entered from Client</option><option value="DOCUMENT_SUPPORTED">Document supported</option><option value="PROFESSIONAL_PROVIDED">Professional provided</option></select></AtlasField><AtlasField htmlFor="financial-verification" label="Support / verification"><select className={styles.select} id="financial-verification" value={draft.verificationState} onChange={(event) => onChange('verificationState', event.target.value)}><option value="UNVERIFIED">Unverified</option><option value="CLIENT_CONFIRMED">Client confirmed</option><option value="DOCUMENT_SUPPORTED">Document supported</option><option value="PROFESSIONAL_CONFIRMED">Professional confirmed</option></select></AtlasField><AtlasField htmlFor="financial-governed-source" label="Associated governed source"><select className={styles.select} id="financial-governed-source" value={draft.clientCaseGovernedSourceId} onChange={(event) => onChange('clientCaseGovernedSourceId', event.target.value)}><option value="">No governed source selected</option>{workspace.sourceCandidates.map((source) => <option key={source.id} value={source.id}>{source.label}</option>)}</select></AtlasField>{sourceRequired && !workspace.sourceCandidates.length ? <AtlasNotice title="No eligible source is associated" tone="attention"><p>Associate an eligible Evidence or Professional Input through its owning workflow before using this source posture.</p><p><Link href={`/agent/prepare/evidence?clientCaseId=${encodeURIComponent(clientCaseId)}`}>Open Evidence <ExternalLink aria-hidden="true" size={14} /></Link> · <Link href={`/agent/prepare/professional-inputs?clientCaseId=${encodeURIComponent(clientCaseId)}`}>Open Professional Inputs <ExternalLink aria-hidden="true" size={14} /></Link></p></AtlasNotice> : null}{field('asOf', 'As of', { type: 'date', required: true })}{field('effectiveAt', 'Effective date', { type: 'date' })}{domain === 'QUALIFICATION' ? field('expiresAt', 'Expires', { type: 'date' }) : null}{field('reviewAfter', 'Review after', { type: 'date' })}</div></details><div className={styles.draftActions}><AtlasButton disabled={busy} onClick={onSave}><Save aria-hidden="true" size={16} />Save</AtlasButton><AtlasButton disabled={busy} tone="secondary" onClick={onCancel}>Cancel</AtlasButton><AtlasButton disabled={busy} tone="ghost" onClick={onClear}><RotateCcw aria-hidden="true" size={16} />Clear All Selections</AtlasButton></div></AtlasSurface>;
}
