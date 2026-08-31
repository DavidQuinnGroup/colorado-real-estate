'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';
import { AlertTriangle, CalendarDays, CheckCircle2, FileText, Gavel, History, LoaderCircle, ShieldCheck } from 'lucide-react';

type TransactionSummary = { id: string; label: string; stage: string; updatedAt: string; canonicalProperty: { sourceFormattedSitusAddress: string | null; city: string | null; state: string | null } };
type Detail = Record<string, any>;
const tabs = ['Overview', 'Timeline', 'Deadlines', 'Issues', 'Professional Input', 'Decisions', 'Outputs'] as const;
const lowRiskProfiles = ['REQUEST_ADDITIONAL_INFORMATION', 'REQUEST_PROFESSIONAL_ESTIMATE', 'REQUEST_INSPECTION_OR_QUOTE', 'PREFERRED_SCHEDULING_OPTION', 'PREFERRED_PROVIDER_SELECTION', 'NON_BINDING_PRIORITY', 'ACKNOWLEDGED_AGENT_REVIEWED_INFORMATION'] as const;

function dateTime(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString() : 'Not recorded';
}

export default function BuyerUnderContractWorkspace() {
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ canonicalPropertyId: '', label: '', clientContextLabel: '' });
  const [deadline, setDeadline] = useState({ label: '', dueAt: '', timezone: 'America/Denver' });
  const [issue, setIssue] = useState({ title: '', factualSummary: '' });
  const [decision, setDecision] = useState({ profile: lowRiskProfiles[0], description: '' });

  async function loadList() {
    const response = await fetch('/api/agent/buyer-under-contract', { cache: 'no-store' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || 'Unable to load transactions.');
    setTransactions(body.transactions || []);
    if (!selectedId && body.transactions?.[0]?.id) setSelectedId(body.transactions[0].id);
  }

  async function loadDetail(id: string) {
    const response = await fetch(`/api/agent/buyer-under-contract?transactionId=${encodeURIComponent(id)}`, { cache: 'no-store' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || 'Unable to load transaction detail.');
    setDetail(body.transaction);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadList().catch((error) => setStatus(error.message)); }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!selectedId) return;
    const timer = window.setTimeout(() => { void loadDetail(selectedId).catch((error) => setStatus(error.message)); }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedId]);

  async function mutate(action: string, input: Record<string, unknown>) {
    setBusy(true);
    setStatus('');
    try {
      const response = await fetch('/api/agent/buyer-under-contract', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, input }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'The requested action could not be recorded.');
      await loadList();
      const targetId = body.transaction?.id || selectedId;
      if (targetId) { setSelectedId(targetId); await loadDetail(targetId); }
      setStatus('Recorded.');
      return body;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'The requested action could not be recorded.');
    } finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen bg-[#071014] px-5 py-6 text-slate-100 sm:px-8 sm:py-8 lg:px-12" data-testid="buyer-under-contract-workspace" data-agent-only="true">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-white/10 pb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-100/70">Project Atlas / Agent Workspace</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal text-white sm:text-3xl">Buyer Under Contract</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Operational coordination records, deadline history, factual issues, low-risk decisions, and reviewed internal outputs.</p>
        </header>

        {status && <p className="mt-4 border border-cyan-100/20 bg-cyan-100/[0.06] px-4 py-3 text-sm text-cyan-50" role="status">{status}</p>}

        <section className="mt-6 grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center justify-between gap-3"><h2 className="text-sm font-semibold text-white">Transactions</h2><span className="text-xs text-slate-400">{transactions.length}</span></div>
            <div className="mt-3 space-y-2">
              {transactions.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`w-full border px-3 py-3 text-left text-sm transition ${item.id === selectedId ? 'border-cyan-100/45 bg-cyan-100/[0.10] text-white' : 'border-white/10 bg-black/10 text-slate-300 hover:border-white/25'}`}><span className="block font-medium">{item.label}</span><span className="mt-1 block text-xs text-slate-400">{item.stage.replaceAll('_', ' ')} · {item.canonicalProperty.city || 'Location pending'}</span></button>)}
              {!transactions.length && <p className="py-4 text-sm leading-6 text-slate-400">No transaction records are available to this Agent.</p>}
            </div>
            <form className="mt-5 border-t border-white/10 pt-4" onSubmit={(event) => { event.preventDefault(); mutate('CREATE_TRANSACTION', { ...newTransaction, clientMutationKey: `agent-${Date.now()}`, stage: 'UNDER_CONTRACT', executionVerificationStatus: 'UNKNOWN' }); }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">Record transaction</h3>
              <label className="mt-3 block text-xs text-slate-300">Canonical property ID<input required value={newTransaction.canonicalPropertyId} onChange={(event) => setNewTransaction({ ...newTransaction, canonicalPropertyId: event.target.value })} className="mt-1 w-full border border-white/15 bg-black/20 px-2 py-2 text-sm text-white" /></label>
              <label className="mt-2 block text-xs text-slate-300">Label<input required value={newTransaction.label} onChange={(event) => setNewTransaction({ ...newTransaction, label: event.target.value })} className="mt-1 w-full border border-white/15 bg-black/20 px-2 py-2 text-sm text-white" /></label>
              <label className="mt-2 block text-xs text-slate-300">Bounded context<input value={newTransaction.clientContextLabel} onChange={(event) => setNewTransaction({ ...newTransaction, clientContextLabel: event.target.value })} className="mt-1 w-full border border-white/15 bg-black/20 px-2 py-2 text-sm text-white" /></label>
              <button disabled={busy} className="mt-3 inline-flex min-h-9 items-center gap-2 border border-cyan-100/30 px-3 text-xs font-semibold text-cyan-50 disabled:opacity-50"><CheckCircle2 size={14} />Record</button>
            </form>
          </aside>

          <section className="min-w-0">
            {!detail ? <div className="border border-white/10 bg-white/[0.035] p-8 text-sm text-slate-400">Select a transaction to view its controlled operational record.</div> : <>
              <div className="border border-white/10 bg-white/[0.035] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">{detail.stage.replaceAll('_', ' ')}</p><h2 className="mt-1 text-xl font-semibold text-white">{detail.label}</h2><p className="mt-2 text-sm text-slate-300">{detail.canonicalProperty.sourceFormattedSitusAddress || 'Canonical property reference'}{detail.canonicalProperty.city ? ` · ${detail.canonicalProperty.city}, ${detail.canonicalProperty.state || ''}` : ''}</p></div><span className="inline-flex items-center gap-2 border border-amber-100/20 bg-amber-100/[0.06] px-3 py-2 text-xs text-amber-50"><ShieldCheck size={14} />Documents inactive</span></div>
                <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Buyer Under Contract sections">{tabs.map((item) => <button type="button" key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`min-h-9 border px-3 text-xs font-semibold ${tab === item ? 'border-cyan-100/45 bg-cyan-100/[0.12] text-cyan-50' : 'border-white/10 text-slate-300 hover:border-white/25'}`}>{item}</button>)}</div>
              </div>

              {tab === 'Overview' && <section className="mt-5 grid gap-4 md:grid-cols-2"><Panel title="Archive policy" icon={ShieldCheck}><Rows values={[['Owner', detail.archivePolicy.archiveOwner], ['Coverage', detail.archivePolicy.coverage], ['Retention', detail.archivePolicy.retention], ['Brokerage relationship', detail.archivePolicy.relationshipToBrokerageFile], ['Secure document system required', String(detail.archivePolicy.secureDocumentSystemRequired)], ['Storage active', String(detail.archivePolicy.storageActive)]]} /></Panel><Panel title="Execution context" icon={Gavel}><Rows values={[['Mutual execution', dateTime(detail.mutualExecutionAt)], ['Verification', detail.executionVerificationStatus], ['Source reference', detail.sourceReference || 'Not recorded'], ['Limitations', detail.limitations || 'Not recorded']]} /></Panel></section>}
              {tab === 'Timeline' && <Panel className="mt-5" title="Append-only timeline" icon={History}>{detail.timelineEvents.map((event: any) => <div key={event.id} className="border-b border-white/10 py-3 last:border-0"><p className="text-sm font-medium text-white">{event.eventType.replaceAll('_', ' ')}</p><p className="mt-1 text-xs text-slate-400">Occurred {dateTime(event.occurredAt)} · Recorded {dateTime(event.recordedAt)} · {event.objectReference}</p></div>)}</Panel>}
              {tab === 'Deadlines' && <section className="mt-5 grid gap-4 lg:grid-cols-2"><Panel title="Deadline history" icon={CalendarDays}>{detail.deadlines.map((item: any) => <div key={item.id} className="border-b border-white/10 py-3 last:border-0"><p className="text-sm font-medium text-white">{item.label}</p><p className="mt-1 text-xs text-slate-400">{dateTime(item.dueAt)} {item.timezone} · {item.verificationStatus} · {item.attentionState}</p>{item.supersededByDeadline && <p className="mt-1 text-xs text-amber-100">Successor: {item.supersededByDeadline.label}</p>}</div>)}</Panel><Panel title="Record deadline" icon={CalendarDays}><form onSubmit={(event) => { event.preventDefault(); mutate('CREATE_DEADLINE', { transactionId: detail.id, ...deadline, dueAt: new Date(deadline.dueAt).toISOString(), category: 'INSPECTION', sourceClass: 'AGENT_RECORDED_MANUAL_FACT', verificationStatus: 'RECORDED' }); }}><TextInput label="Label" value={deadline.label} onChange={(value) => setDeadline({ ...deadline, label: value })} required /><TextInput label="Due date and time" value={deadline.dueAt} onChange={(value) => setDeadline({ ...deadline, dueAt: value })} type="datetime-local" required /><TextInput label="Timezone" value={deadline.timezone} onChange={(value) => setDeadline({ ...deadline, timezone: value })} required /><Submit busy={busy} label="Record deadline" /></form></Panel></section>}
              {tab === 'Issues' && <section className="mt-5 grid gap-4 lg:grid-cols-2"><Panel title="Factual issues" icon={AlertTriangle}>{detail.issues.map((item: any) => <div key={item.id} className="border-b border-white/10 py-3 last:border-0"><p className="text-sm font-medium text-white">{item.title}</p><p className="mt-1 text-sm text-slate-300">{item.factualSummary}</p><p className="mt-1 text-xs text-slate-400">{item.category} · {item.attentionLevel} · {item.state}</p></div>)}</Panel><Panel title="Record issue" icon={AlertTriangle}><form onSubmit={(event) => { event.preventDefault(); mutate('CREATE_ISSUE', { transactionId: detail.id, ...issue, category: 'INSPECTION', sourceClass: 'AGENT_RECORDED_FACTUAL_OBSERVATION', attentionLevel: 'FOLLOW_UP', state: 'OPEN' }); }}><TextInput label="Title" value={issue.title} onChange={(value) => setIssue({ ...issue, title: value })} required /><TextArea label="Factual summary" value={issue.factualSummary} onChange={(value) => setIssue({ ...issue, factualSummary: value })} required /><Submit busy={busy} label="Record issue" /></form></Panel></section>}
              {tab === 'Professional Input' && <Panel className="mt-5" title="Professional-input provenance" icon={ShieldCheck}>{detail.issues.filter((item: any) => item.professionalInputResponseId || item.evidenceCandidateId || item.evidenceAdmissionId).map((item: any) => <div key={item.id} className="border-b border-white/10 py-3 last:border-0"><p className="text-sm font-medium text-white">{item.title}</p><p className="mt-1 text-xs text-slate-400">Response: {item.professionalInputResponseId || 'None'} · Candidate: {item.evidenceCandidateId || 'None'} · Candidate status: {item.evidenceCandidate?.status || item.professionalInputResponse?.candidate?.status || 'None'} · Admission: {item.evidenceAdmissionId || 'None'}</p></div>)}{!detail.issues.some((item: any) => item.professionalInputResponseId || item.evidenceCandidateId || item.evidenceAdmissionId) && <p className="text-sm text-slate-400">No professional-input provenance is linked to this transaction.</p>}<p className="mt-4 text-xs leading-5 text-amber-100">Links are provenance only. This surface never admits evidence or materializes ProfessionalInput automatically.</p></Panel>}
              {tab === 'Decisions' && <section className="mt-5 grid gap-4 lg:grid-cols-2"><Panel title="Low-risk decision record" icon={Gavel}>{detail.decisions.map((item: any) => <div key={item.id} className="border-b border-white/10 py-3 last:border-0"><p className="text-sm font-medium text-white">{item.profile.replaceAll('_', ' ')}</p><p className="mt-1 text-sm text-slate-300">{item.description}</p><p className="mt-1 text-xs text-slate-400">Occurred {dateTime(item.occurredAt)} · Recorded {dateTime(item.recordedAt)} · {item.sourceMethod}</p></div>)}</Panel><Panel title="Record low-risk decision" icon={Gavel}><form onSubmit={(event) => { event.preventDefault(); mutate('RECORD_DECISION', { transactionId: detail.id, ...decision, sourceMethod: 'AGENT_RECORDED_MEETING', clientMutationKey: `agent-${Date.now()}` }); }}><label className="mt-3 block text-xs text-slate-300">Profile<select value={decision.profile} onChange={(event) => setDecision({ ...decision, profile: event.target.value as typeof decision.profile })} className="mt-1 w-full border border-white/15 bg-black/20 px-2 py-2 text-sm text-white">{lowRiskProfiles.map((profile) => <option key={profile}>{profile}</option>)}</select></label><TextArea label="Description" value={decision.description} onChange={(value) => setDecision({ ...decision, description: value })} required /><Submit busy={busy} label="Record decision" /></form><p className="mt-3 text-xs leading-5 text-amber-100">Not available here: amendments, waivers, termination notices, legal interpretation, or binding direction.</p></Panel></section>}
              {tab === 'Outputs' && <Panel className="mt-5" title="Reviewed immutable outputs" icon={FileText}>{detail.outputs.map((item: any) => <div key={item.id} className="border-b border-white/10 py-3 last:border-0"><p className="text-sm font-medium text-white">{item.displayVersion}</p><p className="mt-1 text-xs text-slate-400">Immutable {dateTime(item.immutableAt)} · {item.contentFingerprint}</p></div>)}<button type="button" disabled={busy} onClick={() => mutate('PERSIST_BRIEF', { transactionId: detail.id, versionLabel: `Review ${detail.outputs.length + 1}`, reviewNote: 'Agent-reviewed Buyer Under Contract certification brief.' })} className="mt-4 inline-flex min-h-9 items-center gap-2 border border-cyan-100/30 px-3 text-xs font-semibold text-cyan-50 disabled:opacity-50"><FileText size={14} />Persist reviewed brief</button></Panel>}
            </>}
          </section>
        </section>
      </div>
    </main>
  );
}

function Panel({ title, icon: Icon, children, className = '' }: { title: string; icon: typeof ShieldCheck; children: React.ReactNode; className?: string }) { return <section className={`border border-white/10 bg-white/[0.035] p-5 ${className}`}><h2 className="flex items-center gap-2 text-sm font-semibold text-white"><Icon size={16} className="text-cyan-100" />{title}</h2><div className="mt-4">{children}</div></section>; }
function Rows({ values }: { values: [string, string][] }) { return <dl className="space-y-3">{values.map(([label, value]) => <div key={label}><dt className="text-xs text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm text-slate-100">{value}</dd></div>)}</dl>; }
function TextInput({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) { return <label className="mt-3 block text-xs text-slate-300">{label}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full border border-white/15 bg-black/20 px-2 py-2 text-sm text-white" /></label>; }
function TextArea({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) { return <label className="mt-3 block text-xs text-slate-300">{label}<textarea required={required} value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="mt-1 w-full border border-white/15 bg-black/20 px-2 py-2 text-sm text-white" /></label>; }
function Submit({ busy, label }: { busy: boolean; label: string }) { return <button disabled={busy} className="mt-3 inline-flex min-h-9 items-center gap-2 border border-cyan-100/30 px-3 text-xs font-semibold text-cyan-50 disabled:opacity-50">{busy && <LoaderCircle size={14} className="animate-spin" />}{label}</button>; }
