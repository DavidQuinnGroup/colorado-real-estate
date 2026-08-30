'use client';

import { AlertTriangle, CheckCircle2, ClipboardPlus, FileWarning, History, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { projectAtlasTitleHierarchy } from '@/components/ProjectAtlasTitleHierarchy';

type ClaimKind = 'LENDER_RATE' | 'PROPERTY_MANAGER_RENT' | 'PAYOFF_AMOUNT' | 'INSURANCE_PREMIUM';
type VerificationStatus = 'UNVERIFIED' | 'SOURCE_ROLE_CLAIMED' | 'SOURCE_ROLE_VERIFIED' | 'VERIFICATION_LIMITED' | 'VERIFICATION_FAILED';
type RequestRecord = Readonly<{ id: string; claimKind: ClaimKind; requestedSourceRole: string; status: string; purpose: string; supportDocumentRequired: boolean; createdAt: string; requestedAt: string | null; response?: ResponseRecord | null }>;
type CandidateRecord = Readonly<{ id: string; claimKind: ClaimKind; sourceKind: string; sourceRef: string; candidatePayload: Record<string, unknown>; provenance: Record<string, unknown>; receivedAt: string; status: string; reviewedAt: string | null; rejectionReason: string | null; admissionRecord?: AdmissionRecord | null }>;
type AdmissionRecord = Readonly<{ id: string; claimKind: ClaimKind; admittedValue: Record<string, unknown>; admittedAt: string; effectiveAt: string | null; expiresAt: string | null; reviewAfter: string | null; supersedesAdmissionId: string | null }>;
type ResponseRecord = Readonly<{ id: string; sourceReference: string; sourceRoleClaim: string | null; verificationStatus: VerificationStatus; receivedAt: string; candidate?: CandidateRecord | null }>;
type InputRecord = Readonly<{ id: string; claimKind: ClaimKind; versionOrdinal: number; value: Record<string, unknown>; effectiveAt: string | null; expiresAt: string | null; reviewAfter: string | null; createdAt: string; evidenceAdmission?: AdmissionRecord | null }>;
type Resolution = Readonly<{ state: 'NONE' | 'ELIGIBLE' | 'CONFLICT_REQUIRES_REVIEW'; admissions: AdmissionRecord[] }>;

const profiles: Readonly<Record<ClaimKind, Readonly<{ label: string; role: string; description: string; valueLabel: string; payload: (value: string) => Record<string, unknown> | null }>>> = {
  LENDER_RATE: { label: 'Lender rate', role: 'LENDER', description: 'A stated rate for professional review. It is not a loan offer or approval.', valueLabel: 'Rate percent', payload: (value) => numberValue(value) === null ? null : { rate: numberValue(value), unit: 'PERCENT' } },
  PROPERTY_MANAGER_RENT: { label: 'Property-manager rent estimate', role: 'PROPERTY_MANAGER', description: 'A monthly estimate, never a guaranteed rent outcome.', valueLabel: 'Monthly USD estimate', payload: (value) => numberValue(value) === null ? null : { amount: numberValue(value), currency: 'USD', period: 'MONTHLY' } },
  PAYOFF_AMOUNT: { label: 'Payoff / balance source', role: 'SELLER_OR_LENDER', description: 'A stated balance requiring source and verification qualification.', valueLabel: 'USD amount', payload: (value) => numberValue(value) === null ? null : { amount: numberValue(value), currency: 'USD' } },
  INSURANCE_PREMIUM: { label: 'Insurance premium', role: 'INSURANCE_PROFESSIONAL', description: 'An annual premium estimate for review, not coverage advice.', valueLabel: 'Annual USD premium', payload: (value) => numberValue(value) === null ? null : { amount: numberValue(value), currency: 'USD', period: 'ANNUAL' } },
};

const verificationLabels: Record<VerificationStatus, string> = {
  UNVERIFIED: 'Unverified',
  SOURCE_ROLE_CLAIMED: 'Source role claimed',
  SOURCE_ROLE_VERIFIED: 'Source role verified',
  VERIFICATION_LIMITED: 'Verification limited',
  VERIFICATION_FAILED: 'Verification failed',
};

function numberValue(value: string) {
  const parsed = Number(value);
  return value.trim() && Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function dateValue() { return new Date().toISOString(); }
function shortDate(value: string | null | undefined) { return value ? new Date(value).toLocaleString() : 'Not recorded'; }
function displayValue(value: Record<string, unknown>) {
  if (typeof value.rate === 'number') return `${value.rate}%`;
  if (typeof value.amount === 'number') return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value.amount) + (value.period === 'MONTHLY' ? ' / month' : value.period === 'ANNUAL' ? ' / year' : '');
  return 'Review required';
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...init });
  const payload = await response.json().catch(() => ({})) as T & { error?: string };
  if (!response.ok) throw new Error(payload.error ?? 'The Agent workflow request could not be completed.');
  return payload;
}

export default function ProfessionalInputWorkflow() {
  const [requests, setRequests] = useState<readonly RequestRecord[]>([]);
  const [inputs, setInputs] = useState<readonly InputRecord[]>([]);
  const [candidates, setCandidates] = useState<readonly CandidateRecord[]>([]);
  const [resolutions, setResolutions] = useState<Readonly<Record<string, Resolution>>>({});
  const [loadState, setLoadState] = useState<'LOADING' | 'READY' | 'FAILED'>('LOADING');
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestKind, setRequestKind] = useState<ClaimKind>('LENDER_RATE');
  const [requestPurpose, setRequestPurpose] = useState('Confirm a bounded professional input for internal preparation.');
  const [supportDocumentRequired, setSupportDocumentRequired] = useState(false);
  const [responseRequestId, setResponseRequestId] = useState('');
  const [responseValue, setResponseValue] = useState('');
  const [sourceReference, setSourceReference] = useState('ATLAS CERTIFICATION SOURCE');
  const [sourceRoleClaim, setSourceRoleClaim] = useState('Professional role claimed');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('SOURCE_ROLE_CLAIMED');
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoadState('LOADING');
    try {
      const [professional, evidence] = await Promise.all([
        jsonFetch<{ history: { requests: RequestRecord[]; inputs: InputRecord[] } }>('/api/agent/professional-inputs'),
        jsonFetch<{ candidates: CandidateRecord[] }>('/api/agent/evidence?history=1'),
      ]);
      const activeClaims = [...new Set([...professional.history.requests.map((item) => item.claimKind), ...professional.history.inputs.map((item) => item.claimKind), ...evidence.candidates.map((item) => item.claimKind)])] as ClaimKind[];
      const current = await Promise.all(activeClaims.map(async (claimKind) => [claimKind, await jsonFetch<{ resolution: Resolution }>(`/api/agent/evidence?claimKind=${claimKind}`)] as const));
      setRequests(professional.history.requests);
      setInputs(professional.history.inputs);
      setCandidates(evidence.candidates);
      setResolutions(Object.fromEntries(current.map(([claimKind, payload]) => [claimKind, payload.resolution])));
      setLoadState('READY');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'The workflow history could not be restored.');
      setLoadState('FAILED');
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const responseRequest = useMemo(() => requests.find((request) => request.id === responseRequestId) ?? null, [requests, responseRequestId]);
  const reviewableCandidates = candidates.filter((candidate) => candidate.status === 'PENDING_REVIEW');
  const selectedCandidate = reviewableCandidates.find((candidate) => candidate.id === selectedCandidateId) ?? null;

  async function run(action: string, operation: () => Promise<void>) {
    setBusy(action); setError(null); setNotice(null);
    try { await operation(); await refresh(); } catch (nextError) { setError(nextError instanceof Error ? nextError.message : 'The workflow action could not be completed.'); } finally { setBusy(null); }
  }

  async function createRequest() {
    await run('request', async () => {
      const created = await jsonFetch<{ request: RequestRecord }>('/api/agent/professional-inputs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'CREATE_REQUEST', request: { claimKind: requestKind, requestedSourceRole: profiles[requestKind].role, purpose: requestPurpose, supportDocumentRequired } }) });
      await jsonFetch('/api/agent/professional-inputs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'REQUEST', requestId: created.request.id }) });
      setResponseRequestId(created.request.id); setNotice('Request recorded. External delivery is not activated.');
    });
  }

  async function recordResponse() {
    if (!responseRequest) { setError('Choose a recorded request before entering a response.'); return; }
    const profile = profiles[responseRequest.claimKind];
    const payload = profile.payload(responseValue);
    if (!payload) { setError(`${profile.valueLabel} must be a non-negative number.`); return; }
    await run('response', async () => {
      const receivedAt = dateValue();
      const response = await jsonFetch<{ candidate: CandidateRecord }>('/api/agent/professional-inputs', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          action: 'RECORD_RESPONSE', response: {
            requestId: responseRequest.id,
            candidate: {
              sourceKind: 'PROFESSIONAL_REPORTED', sourceRef: sourceReference, claimKind: responseRequest.claimKind, candidatePayload: payload, observedAt: receivedAt, receivedAt,
              provenance: { sourceType: 'PROFESSIONAL_REPORTED', sourceReference, sourceRoleClaim, receivedAt, observedAt: receivedAt, providedAt: receivedAt, verificationStatus },
            },
          },
        }),
      });
      setSelectedCandidateId(response.candidate.id); setResponseValue(''); setNotice('Response recorded and candidate created for review.');
    });
  }

  async function admitSelectedCandidate() {
    if (!selectedCandidate) return;
    await run('admit', async () => {
      const admission = await jsonFetch<{ admission: AdmissionRecord }>('/api/agent/evidence', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'ADMIT_CANDIDATE', admission: { candidateId: selectedCandidate.id, policy: 'AGENT_REVIEWED_PROFESSIONAL_INPUT', effectiveAt: selectedCandidate.receivedAt } }) });
      await jsonFetch('/api/agent/professional-inputs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'MATERIALIZE_INPUT', evidenceAdmissionId: admission.admission.id }) });
      setSelectedCandidateId(''); setNotice('Evidence admitted and an immutable Professional Input version was created.');
    });
  }

  async function rejectSelectedCandidate() {
    if (!selectedCandidate) return;
    await run('reject', async () => {
      await jsonFetch('/api/agent/evidence', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'REJECT_CANDIDATE', candidateId: selectedCandidate.id, rejectionReason: 'INSUFFICIENT_SUPPORT' }) });
      setSelectedCandidateId(''); setNotice('Candidate rejected. Its history remains preserved.');
    });
  }

  return (
    <main className="min-h-full bg-[#071014] px-5 py-8 text-slate-100 sm:px-8 lg:px-12" data-testid="agent-professional-input-workflow" data-agent-only="true" data-client-portal="not-activated" data-external-delivery="not-activated" data-output-integration="not-activated">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-3xl"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-100/70">Project Atlas / Agent Workspace</p><p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-cyan-100">Professional Inputs</p><h1 className={`mt-2 ${projectAtlasTitleHierarchy.page}`}>Record and review professional inputs</h1><p className="mt-3 text-sm leading-6 text-slate-300">Create an internal request, capture a bounded response, review the resulting evidence, and preserve admitted input history. This workspace does not contact anyone or deliver documents.</p></div><div className="max-w-xs border-l-2 border-cyan-100/40 pl-4 text-sm leading-6 text-slate-400"><span className="font-semibold text-cyan-100">Private Agent workflow.</span> Records remain owner-scoped. External delivery and secure document exchange are not activated.</div></header>

        {notice ? <StatusBanner tone="success" message={notice} /> : null}
        {error ? <StatusBanner tone="error" message={error} /> : null}

        <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]" aria-label="Professional input request"><div className="border border-white/10 bg-[#0b171c] p-5 sm:p-6"><SectionTitle icon={<ClipboardPlus size={18} />} eyebrow="1. Internal request" title="Record what input is needed" /><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Input kind"><select value={requestKind} onChange={(event) => setRequestKind(event.target.value as ClaimKind)} className={inputClass}>{Object.entries(profiles).map(([kind, profile]) => <option key={kind} value={kind}>{profile.label}</option>)}</select></Field><Field label="Professional role"><div className="min-h-11 border border-white/15 bg-black/20 px-3 py-2 text-sm text-slate-200">{profiles[requestKind].role.replaceAll('_', ' ')}</div></Field><Field label="Purpose" wide><input value={requestPurpose} onChange={(event) => setRequestPurpose(event.target.value)} maxLength={1000} className={inputClass} /></Field></div><label className="mt-5 flex items-start gap-3 border border-white/10 bg-black/10 p-4 text-sm text-slate-300"><input type="checkbox" checked={supportDocumentRequired} onChange={(event) => setSupportDocumentRequired(event.target.checked)} className="mt-1 h-4 w-4 accent-cyan-200" /><span><span className="font-medium text-white">Support document required</span><span className="mt-1 block text-xs leading-5 text-slate-400">Secure document exchange is not activated. This records the requirement only.</span></span></label><div className="mt-5 flex items-center justify-between gap-4"><p className="text-xs leading-5 text-slate-400">{profiles[requestKind].description}</p><button type="button" onClick={() => void createRequest()} disabled={busy !== null} className={primaryButton}>{busy === 'request' ? <Loader2 className="animate-spin" size={16} /> : <ClipboardPlus size={16} />} Record request</button></div></div><aside className="border border-white/10 bg-[#0b171c] p-5"><ShieldCheck className="h-5 w-5 text-cyan-100" /><h2 className="mt-4 text-base font-semibold text-white">Truthful status</h2><p className="mt-2 text-sm leading-6 text-slate-400">A recorded request is an internal durable work item. It is not an email, delivery, notification, or external request token.</p></aside></section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2"><div className="border border-white/10 bg-[#0b171c] p-5 sm:p-6"><SectionTitle icon={<FileWarning size={18} />} eyebrow="2. Response" title="Record a bounded source response" /><div className="mt-5 grid gap-4"><Field label="Recorded request"><select value={responseRequestId} onChange={(event) => setResponseRequestId(event.target.value)} className={inputClass}><option value="">Choose a request</option>{requests.filter((request) => request.status === 'REQUESTED' || request.status === 'ACKNOWLEDGED').map((request) => <option key={request.id} value={request.id}>{profiles[request.claimKind].label} · {request.requestedSourceRole.replaceAll('_', ' ')}</option>)}</select></Field><Field label={responseRequest ? profiles[responseRequest.claimKind].valueLabel : 'Value'}><input inputMode="decimal" value={responseValue} onChange={(event) => setResponseValue(event.target.value)} className={inputClass} /></Field><Field label="Source reference"><input value={sourceReference} onChange={(event) => setSourceReference(event.target.value)} maxLength={500} className={inputClass} /></Field><Field label="Source role claim"><input value={sourceRoleClaim} onChange={(event) => setSourceRoleClaim(event.target.value)} maxLength={500} className={inputClass} /></Field><Field label="Verification status"><select value={verificationStatus} onChange={(event) => setVerificationStatus(event.target.value as VerificationStatus)} className={inputClass}>{Object.entries(verificationLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field></div><div className="mt-5 flex items-center justify-between gap-4"><p className="text-xs leading-5 text-slate-400">The response remains distinct from admitted evidence. Recording it creates a candidate ready for Agent review.</p><button type="button" onClick={() => void recordResponse()} disabled={busy !== null || !responseRequest} className={primaryButton}>{busy === 'response' ? <Loader2 className="animate-spin" size={16} /> : <FileWarning size={16} />} Record response</button></div></div>
          <div className="border border-white/10 bg-[#0b171c] p-5 sm:p-6"><SectionTitle icon={<CheckCircle2 size={18} />} eyebrow="3. Evidence review" title="Admit or reject a candidate" /><div className="mt-5 grid gap-3">{reviewableCandidates.length ? reviewableCandidates.map((candidate) => <label key={candidate.id} className={`flex cursor-pointer items-start justify-between gap-4 border p-4 ${selectedCandidate?.id === candidate.id ? 'border-cyan-100/60 bg-cyan-100/[0.07]' : 'border-white/10 bg-black/10'}`}><span><span className="block text-sm font-semibold text-white">{profiles[candidate.claimKind].label}</span><span className="mt-1 block text-sm text-slate-300">{displayValue(candidate.candidatePayload)}</span><span className="mt-1 block text-xs text-slate-400">{String(candidate.provenance.sourceRoleClaim ?? 'Source role not stated')} · {verificationLabels[String(candidate.provenance.verificationStatus) as VerificationStatus] ?? 'Verification state unavailable'}</span></span><input type="radio" name="professional-input-candidate" checked={selectedCandidate?.id === candidate.id} onChange={() => setSelectedCandidateId(candidate.id)} className="mt-1 h-4 w-4 accent-cyan-200" /></label>) : <Empty message="No candidates are ready for review." />}</div>{selectedCandidate ? <div className="mt-5 border-t border-white/10 pt-5"><p className="text-sm leading-6 text-slate-300">Admission creates immutable reviewed evidence. Correction requires a successor, not an edit.</p><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => void admitSelectedCandidate()} disabled={busy !== null} className={primaryButton}>{busy === 'admit' ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />} Admit and create input</button><button type="button" onClick={() => void rejectSelectedCandidate()} disabled={busy !== null} className="inline-flex min-h-11 items-center gap-2 border border-rose-200/30 px-4 text-sm font-semibold text-rose-100 transition hover:bg-rose-100/[0.08] disabled:opacity-50"><XCircle size={16} /> Reject</button></div></div> : null}</div></section>

        <section className="mt-8 border border-white/10 bg-[#0b171c] p-5 sm:p-6"><SectionTitle icon={<History size={18} />} eyebrow="Current and history" title="Resolver-backed admitted inputs" /><div className="mt-5 grid gap-4 lg:grid-cols-2">{Object.entries(resolutions).length ? Object.entries(resolutions).map(([claimKind, resolution]) => <div key={claimKind} className="border border-white/10 bg-black/10 p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">{profiles[claimKind as ClaimKind]?.label ?? claimKind}</p>{resolution.state === 'ELIGIBLE' ? <p className="mt-2 text-lg font-semibold text-white">{displayValue(resolution.admissions[0]?.admittedValue ?? {})}</p> : <p className="mt-2 text-sm font-semibold text-amber-100">{resolution.state === 'CONFLICT_REQUIRES_REVIEW' ? 'Review required: conflicting eligible evidence' : 'No currently eligible input'}</p>}<p className="mt-2 text-xs leading-5 text-slate-400">{resolution.state === 'ELIGIBLE' ? 'Resolved through the canonical eligibility service.' : 'No latest-row selection is used.'}</p></div>) : <Empty message={loadState === 'LOADING' ? 'Loading private workflow history.' : 'No admitted professional inputs yet.'} />}</div><div className="mt-6 border-t border-white/10 pt-5"><h2 className="text-sm font-semibold text-white">Immutable version history</h2><div className="mt-3 grid gap-3">{inputs.length ? inputs.map((input) => <div key={input.id} className="flex flex-col gap-2 border border-white/10 bg-black/10 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-white">{profiles[input.claimKind].label} · V{input.versionOrdinal}</p><p className="mt-1 text-sm text-slate-300">{displayValue(input.value)}</p><p className="mt-1 text-xs text-slate-400">Admitted {shortDate(input.evidenceAdmission?.admittedAt)} · Effective {shortDate(input.effectiveAt)}</p></div><span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Read-only history</span></div>) : <Empty message="No Professional Input versions have been admitted." />}</div></div></section>

        <section className="mt-8 border border-amber-100/20 bg-amber-100/[0.04] p-5 text-sm leading-6 text-slate-300"><AlertTriangle className="mr-3 inline-block h-5 w-5 text-amber-100" aria-hidden="true" />No external delivery, document storage, CRM mutation, Client Portal access, OutputVersion mutation, or PDF/OutputRender activity is available from this workflow.</section>
      </div>
    </main>
  );
}

const inputClass = 'min-h-11 w-full border border-white/15 bg-black/20 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-100';
const primaryButton = 'inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-cyan-200 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-100';

function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) { return <label className={wide ? 'sm:col-span-2' : ''}><span className="mb-2 block text-xs font-medium text-slate-300">{label}</span>{children}</label>; }
function SectionTitle({ icon, eyebrow, title }: { icon: React.ReactNode; eyebrow: string; title: string }) { return <div className="flex items-start gap-3"><span className="mt-0.5 text-cyan-100">{icon}</span><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">{eyebrow}</p><h2 className="mt-1 text-lg font-semibold text-white">{title}</h2></div></div>; }
function Empty({ message }: { message: string }) { return <p className="border border-dashed border-white/15 px-4 py-5 text-sm text-slate-400">{message}</p>; }
function StatusBanner({ tone, message }: { tone: 'success' | 'error'; message: string }) { const Icon = tone === 'success' ? CheckCircle2 : AlertTriangle; return <div className={`mt-6 flex items-start gap-3 border p-4 text-sm leading-6 ${tone === 'success' ? 'border-emerald-200/25 bg-emerald-100/[0.06] text-emerald-50' : 'border-rose-200/25 bg-rose-100/[0.06] text-rose-50'}`} role="status"><Icon className="mt-0.5 h-5 w-5 shrink-0" />{message}</div>; }
