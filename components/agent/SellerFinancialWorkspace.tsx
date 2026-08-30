'use client';

import { Calculator, CheckCircle2, History, Loader2, Plus, TriangleAlert } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { projectAtlasTitleHierarchy } from '@/components/ProjectAtlasTitleHierarchy';

type InputKey = 'SALE_PRICE' | 'PAYOFF' | 'SELLING_COMPENSATION' | 'SELLER_CONCESSION' | 'PREPARATION_ALLOWANCE' | 'REPAIR_ALLOWANCE' | 'TITLE_CLOSING_ESTIMATE' | 'PROPERTY_TAX_PRORATION' | 'HOA_TRANSFER_FEES' | 'OTHER_SELLER_COST';
type Source = 'PROFESSIONAL_INPUT' | 'CLIENT_PROVIDED' | 'AGENT_ESTIMATE' | 'SCENARIO_ASSUMPTION' | 'UNKNOWN';
type InputState = { amount: string; state: 'VALUE' | 'UNKNOWN' | 'NOT_INCLUDED'; sourceClass: Source; professionalInputId?: string };
type Scenario = { id: string; scenarioKey: string; versionOrdinal: number; lifecycleState: string; createdAt: string; inputSnapshot: Array<{ key: InputKey; sourceClass: Source; state: string }>; results: Array<{ resultPayload: { state: string; grossSalePriceCents: number | null; estimatedPayoffCents: number | null; totalEstimatedSellerCostsCents: number | null; estimatedNetProceedsCents: number | null; netProceedsBasisPoints: number | null; optionalUnknownInputs: InputKey[] } }> };
type ProfessionalInput = { id: string; versionOrdinal: number; value: { amount?: number }; expiresAt: string | null; evidenceAdmission: { supersededByAdmission: { id: string } | null } };

const fields: Array<{ key: InputKey; label: string; required?: boolean; source?: Source }> = [
  { key: 'SALE_PRICE', label: 'Estimated sale price', required: true, source: 'SCENARIO_ASSUMPTION' }, { key: 'PAYOFF', label: 'Estimated payoff', required: true, source: 'AGENT_ESTIMATE' },
  { key: 'SELLING_COMPENSATION', label: 'Selling-side compensation assumption', source: 'SCENARIO_ASSUMPTION' }, { key: 'SELLER_CONCESSION', label: 'Seller concession', source: 'SCENARIO_ASSUMPTION' },
  { key: 'PREPARATION_ALLOWANCE', label: 'Preparation allowance', source: 'AGENT_ESTIMATE' }, { key: 'REPAIR_ALLOWANCE', label: 'Repair allowance', source: 'AGENT_ESTIMATE' },
  { key: 'TITLE_CLOSING_ESTIMATE', label: 'Title / closing estimate', source: 'AGENT_ESTIMATE' }, { key: 'PROPERTY_TAX_PRORATION', label: 'Property tax / proration estimate', source: 'AGENT_ESTIMATE' },
  { key: 'HOA_TRANSFER_FEES', label: 'HOA / transfer fee estimate', source: 'AGENT_ESTIMATE' }, { key: 'OTHER_SELLER_COST', label: 'Other seller cost', source: 'AGENT_ESTIMATE' },
];
const initial = Object.fromEntries(fields.map((field) => [field.key, { amount: '', state: field.required ? 'VALUE' : 'NOT_INCLUDED', sourceClass: field.source ?? 'AGENT_ESTIMATE' }])) as Record<InputKey, InputState>;
const money = (cents: number | null) => cents === null ? 'Held for review' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
const inputClass = 'mt-1 min-h-10 w-full border border-white/15 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-cyan-100';

export default function SellerFinancialWorkspace() {
  const [scenarioKey, setScenarioKey] = useState('ATLAS CERTIFICATION BASE');
  const [inputs, setInputs] = useState(initial);
  const [history, setHistory] = useState<Scenario[]>([]);
  const [professional, setProfessional] = useState<ProfessionalInput[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    const response = await fetch('/api/agent/seller-financial', { cache: 'no-store', credentials: 'same-origin' });
    const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Seller financial history is unavailable.'); setHistory(data.history); setProfessional(data.professionalInputs);
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh().catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to restore history.')); }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);
  const currentProfessional = useMemo(() => professional.filter((item) => !item.expiresAt || new Date(item.expiresAt) > new Date()).filter((item) => !item.evidenceAdmission.supersededByAdmission), [professional]);
  function update(key: InputKey, patch: Partial<InputState>) { setInputs((previous) => ({ ...previous, [key]: { ...previous[key], ...patch } })); }
  async function save() {
    setBusy(true); setError(null); setNotice(null);
    try {
      const scenario = { scenarioKey, review: true, inputs: fields.map((field) => {
        const value = inputs[field.key]; const selected = professional.find((item) => item.id === value.professionalInputId);
        return { key: field.key, state: value.state, sourceClass: value.sourceClass, amountCents: value.sourceClass === 'PROFESSIONAL_INPUT' ? null : value.state === 'VALUE' ? Math.round(Number(value.amount) * 100) : null, professionalInputId: selected?.id ?? null };
      }) };
      const response = await fetch('/api/agent/seller-financial', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'CREATE_SCENARIO', scenario }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error ?? 'Scenario could not be persisted.'); setNotice(data.created ? 'Estimated scenario reviewed and persisted as immutable history.' : 'The identical reviewed scenario already exists.'); await refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Scenario could not be saved.'); } finally { setBusy(false); }
  }
  return <main className="min-h-full bg-[#071014] px-5 py-8 text-slate-100 sm:px-8 lg:px-12" data-testid="agent-seller-financial-workspace" data-agent-only="true" data-client-portal="not-activated" data-outputrender="not-mutated">
    <div className="mx-auto max-w-6xl"><header className="border-b border-white/10 pb-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100/70">Project Atlas / Seller Preparation</p><h1 className={`mt-3 ${projectAtlasTitleHierarchy.page}`}>Seller Financial Preparation</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Build an estimated seller financial scenario from explicit qualified inputs. This is not a final settlement statement, tax calculation, lender decision, or title certification.</p></header>
      {notice ? <div className="mt-5 flex gap-2 border border-emerald-300/30 bg-emerald-300/10 p-4 text-sm text-emerald-100"><CheckCircle2 size={18} />{notice}</div> : null}{error ? <div className="mt-5 flex gap-2 border border-rose-300/30 bg-rose-300/10 p-4 text-sm text-rose-100"><TriangleAlert size={18} />{error}</div> : null}
      <section className="mt-8 border border-white/10 bg-[#0b171c] p-5 sm:p-6"><div className="flex items-center gap-3"><Plus className="text-cyan-100" size={20} /><div><h2 className="text-lg font-semibold">Scenario</h2><p className="text-sm text-slate-400">All amounts are USD estimates. Unknown remains distinct from zero.</p></div></div><label className="mt-5 block max-w-md text-sm font-medium text-slate-200">Scenario name<input value={scenarioKey} onChange={(event) => setScenarioKey(event.target.value)} maxLength={120} className={inputClass} /></label>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">{fields.map((field) => { const value = inputs[field.key]; return <div key={field.key} className="border border-white/10 bg-black/10 p-4"><label className="text-sm font-medium text-white">{field.label}{field.required ? ' *' : ''}<input inputMode="decimal" disabled={value.state !== 'VALUE' || value.sourceClass === 'PROFESSIONAL_INPUT'} value={value.amount} onChange={(event) => update(field.key, { amount: event.target.value })} placeholder="0.00" className={inputClass} /></label><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-xs text-slate-400">Status<select value={value.state} onChange={(event) => update(field.key, { state: event.target.value as InputState['state'] })} className={inputClass}><option value="VALUE">Explicit value</option>{!field.required ? <option value="NOT_INCLUDED">Not included</option> : null}<option value="UNKNOWN">Unknown</option></select></label><label className="text-xs text-slate-400">Source<select value={value.sourceClass} onChange={(event) => update(field.key, { sourceClass: event.target.value as Source, professionalInputId: undefined })} className={inputClass}>{field.key === 'PAYOFF' ? <><option value="PROFESSIONAL_INPUT">Professional input</option><option value="CLIENT_PROVIDED">Seller provided</option></> : null}<option value="AGENT_ESTIMATE">Agent estimate</option><option value="SCENARIO_ASSUMPTION">Scenario assumption</option><option value="UNKNOWN">Unknown</option></select></label></div>{field.key === 'PAYOFF' && value.sourceClass === 'PROFESSIONAL_INPUT' ? <label className="mt-3 block text-xs text-slate-400">Current qualified payoff<select value={value.professionalInputId ?? ''} onChange={(event) => update(field.key, { professionalInputId: event.target.value })} className={inputClass}><option value="">Select input</option>{currentProfessional.map((item) => <option key={item.id} value={item.id}>Professional payoff V{item.versionOrdinal} ({money(Math.round((item.value.amount ?? 0) * 100))})</option>)}</select></label> : null}</div>; })}</div>
      <button type="button" disabled={busy} onClick={() => void save()} className="mt-6 inline-flex min-h-10 items-center gap-2 border border-cyan-100/40 bg-cyan-100/10 px-4 text-sm font-semibold text-cyan-100 hover:bg-cyan-100/20 disabled:opacity-50">{busy ? <Loader2 size={16} className="animate-spin" /> : <Calculator size={16} />} Calculate and persist reviewed estimate</button></section>
      <section className="mt-8 border border-white/10 bg-[#0b171c] p-5 sm:p-6"><div className="flex items-center gap-3"><History className="text-cyan-100" size={20}/><div><h2 className="text-lg font-semibold">History and comparison</h2><p className="text-sm text-slate-400">Reviewed scenarios are immutable. Later changes create a new version.</p></div></div><div className="mt-5 grid gap-4 lg:grid-cols-2">{history.map((scenario) => { const result = scenario.results[0]?.resultPayload; return <article key={scenario.id} className="border border-white/10 bg-black/10 p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/70">{scenario.lifecycleState} / V{scenario.versionOrdinal}</p><h3 className="mt-2 font-semibold text-white">{scenario.scenarioKey}</h3>{result?.state === 'ESTIMATED' ? <><p className="mt-4 text-xs uppercase tracking-[0.12em] text-slate-400">Estimated net proceeds</p><p className="mt-1 text-2xl font-semibold text-cyan-100">{money(result.estimatedNetProceedsCents)}</p><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-slate-400">Gross sale price</dt><dd>{money(result.grossSalePriceCents)}</dd></div><div><dt className="text-slate-400">Estimated payoff</dt><dd>{money(result.estimatedPayoffCents)}</dd></div><div><dt className="text-slate-400">Seller costs</dt><dd>{money(result.totalEstimatedSellerCostsCents)}</dd></div><div><dt className="text-slate-400">Net percent</dt><dd>{result.netProceedsBasisPoints === null ? 'Not available' : `${(result.netProceedsBasisPoints / 100).toFixed(2)}%`}</dd></div></dl></> : <p className="mt-4 text-amber-100">Incomplete estimate: required input is unknown.</p>}</article>; })}</div>{history.length === 0 ? <p className="mt-5 text-sm text-slate-400">No seller financial scenarios have been persisted.</p> : null}</section></div></main>;
}
