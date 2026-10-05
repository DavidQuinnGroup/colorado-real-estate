'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, ChevronDown, CircleDollarSign, Clock3, ExternalLink, Home, LoaderCircle, RefreshCw, Scale, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { formatFinancialValue, humanizeScenarioValue, type Comparison, type FixedContext, type FixedEntry, type ScenarioSummary, type ScenarioVersion, type WorkingContext, type WorkingFact } from './clientCaseScenarioTypes';
import styles from './ClientCaseScenarioWorkspace.module.css';

const domainOrder = ['ASSET', 'INCOME', 'LIABILITY', 'BORROWING_QUALIFICATION', 'FINANCIAL_CONSTRAINT'];

async function payload<T>(response: Response): Promise<T> {
  const value = await response.json() as T & { error?: string; code?: string; details?: Record<string, unknown> };
  if (!response.ok) {
    const error = new Error(value.error || 'Scenario Financial Context is unavailable.') as Error & { code?: string; details?: Record<string, unknown> };
    error.code = value.code;
    error.details = value.details;
    throw error;
  }
  return value;
}

function contextUrl(clientCaseId: string, scenarioId: string, view = 'working', scenarioVersionId?: string) {
  const query = new URLSearchParams({ clientCaseId, scenarioId, view });
  if (scenarioVersionId) query.set('scenarioVersionId', scenarioVersionId);
  return `/api/agent/client-case-scenario-financial-context?${query.toString()}`;
}

function date(value: string | null | undefined) {
  return value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not recorded';
}

function assumptionValue(entry: { value: unknown; valueType: string }) {
  if (entry.valueType === 'MONEY_CENTS' && typeof entry.value === 'number') return formatFinancialValue({ category: null, marketValueCents: entry.value, liquidValueCents: null, availableAmountCents: null, currentBalanceCents: null, monthlyObligationCents: null, amountCents: null, maximumLoanAmountCents: null, maximumPurchaseAmountCents: null, rateBps: null, frequency: null, programLabel: null });
  if (entry.valueType === 'PERCENT_BPS' && typeof entry.value === 'number') return `${(entry.value / 100).toFixed(2)}%`;
  if (Array.isArray(entry.value)) return entry.value.join(', ');
  return String(entry.value);
}

function FactContext({ fact }: { fact: Pick<WorkingFact, 'participant' | 'property'> }) {
  if (!fact.participant && !fact.property) return <span>Client Case</span>;
  return <>{fact.participant ? <span>{fact.participant.label}</span> : null}{fact.property ? <span>{fact.property.label}</span> : null}</>;
}

function WorkingFactRow({ busy, fact, onMutation }: { busy: boolean; fact: WorkingFact; onMutation: (action: 'SELECT' | 'DESELECT' | 'REVIEW', fact: WorkingFact) => void }) {
  const inputId = `financial-context-${fact.domain}-${fact.entityId}`;
  return <article className={`${styles.factRow} ${fact.selected ? styles.factSelected : ''} ${fact.reviewRequired ? styles.factReview : ''}`}>
    <div className={styles.factMain}>
      <input aria-describedby={`${inputId}-detail`} aria-label={`Include in analysis version: ${fact.label}`} checked={fact.selected} disabled={busy || (!fact.selected && !fact.currentObservation)} id={inputId} onChange={() => onMutation(fact.selected ? 'DESELECT' : 'SELECT', fact)} type="checkbox" />
      <label htmlFor={inputId}><span className={styles.factLabel}>{fact.label}</span><span className={styles.factCategory}>{humanizeScenarioValue(fact.category)}</span></label>
      <strong className={styles.factValue}>{formatFinancialValue(fact.currentObservation?.value)}</strong>
    </div>
    <div className={styles.factDetails} id={`${inputId}-detail`}>
      <span className={styles.contextLabels}><FactContext fact={fact} /></span>
      <span>{fact.currentObservation ? `As of ${date(fact.currentObservation.asOf)}` : 'No longer current'}</span>
      {fact.selected && !fact.reviewRequired ? <span className={styles.statusGood}><Check aria-hidden="true" size={14} />Included and current</span> : null}
      {fact.reviewRequired ? <span className={styles.statusWarning}><AlertTriangle aria-hidden="true" size={14} />Review required</span> : null}
      {busy ? <span role="status"><LoaderCircle aria-hidden="true" className={styles.spin} size={14} />Saving...</span> : null}
    </div>
    {fact.reviewRequired && fact.currentObservation ? <div className={styles.reviewCallout}><p>This selected information changed or needs a current review before creating an analysis version.</p><button className="atlas-action atlas-action-secondary" disabled={busy} onClick={() => onMutation('REVIEW', fact)} type="button"><RefreshCw aria-hidden="true" size={15} />Review current information</button></div> : null}
  </article>;
}

function FixedFactRow({ entry }: { entry: FixedEntry }) {
  return <article className={styles.fixedFact}>
    <div><span className={styles.factCategory}>{humanizeScenarioValue(entry.domain)}</span><h4>{entry.label || humanizeScenarioValue(entry.value.category || entry.domain)}</h4></div>
    <strong>{formatFinancialValue(entry.value)}</strong>
    <div className={styles.factDetails}><span>{entry.participantLabel || 'Client Case'}</span>{entry.propertyLabel ? <span>{entry.propertyLabel}</span> : null}<span>Captured as of {date(entry.asOf)}</span><span>{humanizeScenarioValue(entry.source.verificationState)}</span></div>
  </article>;
}

export function ClientCaseScenarioWorkspace({ clientCaseId, scenarioId, scenarioVersionId }: { clientCaseId: string; scenarioId: string; scenarioVersionId?: string }) {
  const fixedMode = Boolean(scenarioVersionId);
  const [scenario, setScenario] = useState<ScenarioSummary | null>(null);
  const [versions, setVersions] = useState<ScenarioVersion[]>([]);
  const [working, setWorking] = useState<WorkingContext | null>(null);
  const [fixed, setFixed] = useState<FixedContext | null>(null);
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [comparisonWorking, setComparisonWorking] = useState<WorkingContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [review, setReview] = useState<WorkingContext | null>(null);
  const [comparisonBusy, setComparisonBusy] = useState(false);
  const reviewButton = useRef<HTMLButtonElement | null>(null);
  const reviewDialog = useRef<HTMLElement | null>(null);
  const errorMessage = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async (message?: string) => {
    try {
      const detailPromise = fetch(`/api/agent/client-case-scenarios?clientCaseId=${encodeURIComponent(clientCaseId)}&scenarioId=${encodeURIComponent(scenarioId)}`, { cache: 'no-store' }).then((response) => payload<{ scenario: ScenarioSummary; versions: ScenarioVersion[] }>(response));
      if (fixedMode) {
        const [detail, context, current] = await Promise.all([
          detailPromise,
          fetch(contextUrl(clientCaseId, scenarioId, 'fixed', scenarioVersionId), { cache: 'no-store' }).then((response) => payload<FixedContext>(response)),
          fetch(contextUrl(clientCaseId, scenarioId), { cache: 'no-store' }).then((response) => payload<WorkingContext>(response)),
        ]);
        setScenario(detail.scenario); setVersions(detail.versions); setFixed(context); setWorking(current);
      } else {
        const [detail, context] = await Promise.all([detailPromise, fetch(contextUrl(clientCaseId, scenarioId), { cache: 'no-store' }).then((response) => payload<WorkingContext>(response))]);
        setScenario(detail.scenario); setVersions(detail.versions); setWorking(context);
      }
      setError(null);
      if (message) setNotice(message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The Scenario is unavailable.');
    }
  }, [clientCaseId, fixedMode, scenarioId, scenarioVersionId]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  useEffect(() => { if (review) document.getElementById('analysis-review-title')?.focus(); }, [review]);
  useEffect(() => { if (error) errorMessage.current?.focus(); }, [error]);

  const groupedFacts = useMemo(() => domainOrder.map((domain) => ({ domain, facts: working?.facts.filter((fact) => fact.domain === domain) || [] })).filter((group) => group.facts.length), [working]);
  const selectedFacts = working?.facts.filter((fact) => fact.selected) || [];

  async function postContext(action: string, input: Record<string, unknown>) {
    return fetch('/api/agent/client-case-scenario-financial-context', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientCaseId, scenarioId, action, input }) });
  }

  async function mutate(action: 'SELECT' | 'DESELECT' | 'REVIEW', fact: WorkingFact) {
    const observationId = action === 'DESELECT' ? fact.selectedObservationId || fact.currentObservation?.id : fact.currentObservation?.id;
    if (!working?.scenario.currentVersionId || !observationId) return;
    setBusyKey(fact.entityId); setError(null); setNotice(null);
    try {
      const next = await postContext(action, { expectedRevision: working.draft?.revision ?? null, selection: { domain: fact.domain, entityId: fact.entityId, observationId } }).then((response) => payload<WorkingContext>(response));
      setWorking(next);
      setNotice(action === 'REVIEW' ? 'Current information reviewed. The fact remains included.' : 'Saved to this working Scenario.');
      requestAnimationFrame(() => document.getElementById(`financial-context-${fact.domain}-${fact.entityId}`)?.focus());
    } catch (reason) {
      const failure = reason as Error & { code?: string };
      if (failure.code === 'CONFLICT') await load('Scenario selections changed elsewhere. The latest working state has been loaded; review it before retrying.');
      else setError(failure.message);
    } finally { setBusyKey(null); }
  }

  async function clearAll() {
    if (!working) return;
    setBusyKey('clear'); setError(null); setNotice(null);
    try {
      const next = await postContext('CLEAR_ALL', { expectedRevision: working.draft?.revision ?? null }).then((response) => payload<WorkingContext>(response));
      setWorking(next); setNotice('All selections were cleared from this working Scenario.');
      requestAnimationFrame(() => reviewButton.current?.focus());
    } catch (reason) {
      const failure = reason as Error & { code?: string };
      if (failure.code === 'CONFLICT') await load('Scenario selections changed elsewhere. The latest working state has been loaded.'); else setError(failure.message);
    } finally { setBusyKey(null); }
  }

  async function openReview() {
    if (!working) return;
    setBusyKey('review'); setError(null); setNotice(null);
    try {
      const next = await postContext('REVIEW_CREATE_ANALYSIS_VERSION', { expectedDraftRevision: working.draft?.revision ?? null, expectedCurrentVersionId: working.scenario.currentVersionId }).then((response) => payload<WorkingContext>(response));
      setReview(next);
    } catch (reason) {
      const failure = reason as Error & { code?: string };
      if (failure.code === 'CONFLICT') await load('The Scenario changed. The latest working state has been loaded; review it before creating an analysis version.'); else setError(failure.message);
    } finally { setBusyKey(null); }
  }

  function closeReview() { setReview(null); requestAnimationFrame(() => reviewButton.current?.focus()); }

  function handleReviewKeys(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && busyKey !== 'freeze') { event.preventDefault(); closeReview(); return; }
    if (event.key !== 'Tab') return;
    const controls = Array.from(reviewDialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])') || []);
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!controls.includes(document.activeElement as HTMLElement)) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
    else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  async function createAnalysisVersion() {
    if (!review?.freezeReview) return;
    setBusyKey('freeze'); setError(null);
    try {
      const result = await postContext('CREATE_ANALYSIS_VERSION', { expectedDraftRevision: review.freezeReview.expectedDraftRevision, expectedCurrentVersionId: review.freezeReview.expectedCurrentVersionId, clientMutationKey: crypto.randomUUID() }).then((response) => payload<{ scenarioVersion: { id: string; versionNumber: number } }>(response));
      closeReview();
      await load('Analysis version created. Selected Client financial information was preserved for this version.');
      window.history.replaceState(null, '', `/agent/clients/${encodeURIComponent(clientCaseId)}/scenarios/${encodeURIComponent(scenarioId)}?createdVersion=${encodeURIComponent(result.scenarioVersion.id)}`);
    } catch (reason) {
      const failure = reason as Error & { code?: string };
      closeReview();
      await load();
      setError(failure.code === 'REVIEW_REQUIRED'
        ? 'Selected financial information changed. Review the highlighted facts before retrying.'
        : failure.code === 'CONFLICT'
          ? 'The Scenario changed while creating the analysis version. The latest working state has been loaded.'
          : failure.message);
    } finally { setBusyKey(null); }
  }

  async function compare() {
    if (!scenarioVersionId) return;
    if (comparison) { setComparison(null); setComparisonWorking(null); return; }
    setComparisonBusy(true); setError(null);
    try {
      const [differenceResult, currentResult] = await Promise.all([
        fetch(contextUrl(clientCaseId, scenarioId, 'comparison', scenarioVersionId), { cache: 'no-store' }).then((response) => payload<Comparison>(response)),
        fetch(contextUrl(clientCaseId, scenarioId), { cache: 'no-store' }).then((response) => payload<WorkingContext>(response)),
      ]);
      setComparison(differenceResult); setComparisonWorking(currentResult);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Comparison is unavailable.'); }
    finally { setComparisonBusy(false); }
  }

  const clientName = working?.clientCase.displayName || scenario?.name || 'Scenario';
  if (!scenario || !working || (fixedMode && !fixed)) return <main className={styles.page}><div className={styles.container}>{error ? <div className={styles.error} role="alert">{error}</div> : <p className={styles.loading} role="status"><LoaderCircle aria-hidden="true" className={styles.spin} size={18} />Loading Scenario...</p>}</div></main>;
  const activeWorking = working as WorkingContext;
  const activeFixed = fixed as FixedContext;

  return <main className={styles.page} data-testid={fixedMode ? 'client-case-scenario-fixed-workspace' : 'client-case-scenario-working-workspace'}><div className={styles.container}>
    <header className={styles.pageHeader}>
      <nav aria-label="Scenario breadcrumbs" className={styles.breadcrumbs}><Link href="/agent"><Home aria-hidden="true" size={15} />Workspace</Link><Link href={`/agent/clients/${encodeURIComponent(clientCaseId)}`}><ArrowLeft aria-hidden="true" size={15} />Client Case</Link><Link href={`/agent/clients/${encodeURIComponent(clientCaseId)}/scenarios`}>Scenarios</Link></nav>
      <div className={styles.titleRow}><div><p className={styles.eyebrow}>{fixedMode ? `Analysis version ${activeFixed.scenarioVersion.versionNumber}` : 'Working Scenario'}</p><h1>{scenario.name}</h1><p className={styles.introduction}>{scenario.description || `${clientName} Scenario`}</p></div><span className={fixedMode ? styles.fixedBadge : styles.workingBadge}>{fixedMode ? <Clock3 aria-hidden="true" size={15} /> : <RefreshCw aria-hidden="true" size={15} />}{fixedMode ? 'Fixed, read-only' : 'Working'}</span></div>
      <div className={styles.headerMeta}><span>Client Case: {activeWorking.clientCase?.displayName || clientName}</span><span>{fixedMode ? `Version ${activeFixed.scenarioVersion.versionNumber}` : `Current version ${activeWorking.scenario.currentVersion.versionNumber}`}</span></div>
    </header>

    {error ? <div className={styles.error} ref={errorMessage} role="alert" tabIndex={-1}><AlertTriangle aria-hidden="true" size={17} /><span>{error}</span><button className={styles.textButton} onClick={() => void load()} type="button">Reload</button></div> : null}
    {notice ? <div className={styles.notice} role="status"><Check aria-hidden="true" size={17} /><span>{notice}</span></div> : null}

    <section className={styles.scenarioContext} aria-labelledby="scenario-context-title"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Scenario context</p><h2 id="scenario-context-title">Assumptions</h2></div></div>
      {(fixedMode ? versions.find((version) => version.id === scenarioVersionId)?.assumptions : activeWorking.scenario.currentVersion.assumptions)?.length ? <dl className={styles.assumptionGrid}>{(fixedMode ? versions.find((version) => version.id === scenarioVersionId)?.assumptions : activeWorking.scenario.currentVersion.assumptions)?.map((entry) => <div key={entry.semanticKey}><dt>{humanizeScenarioValue(entry.semanticKey)}</dt><dd>{assumptionValue(entry)}</dd></div>)}</dl> : <p className={styles.quietState}>No Scenario assumptions are recorded for this version.</p>}
    </section>

    {!fixedMode ? <section className={styles.financialSurface} aria-labelledby="financial-context-title">
      <div className={styles.financialHeader}><div><p className={styles.eyebrow}>Current Client information</p><h2 id="financial-context-title">Financial Context</h2><p>Select the Client financial information relevant to this Scenario.</p></div><Link className="atlas-action atlas-action-secondary" href={`/agent/clients/${encodeURIComponent(clientCaseId)}/information#financial-position`}>View / Edit Financial Position<ExternalLink aria-hidden="true" size={15} /></Link></div>
      <div className={styles.summaryBar}><span><strong>{activeWorking.draft?.selectionCount || 0}</strong> selected</span><span><strong>{activeWorking.reviewRequiredCount}</strong> review required</span><span>Saved to this working Scenario</span></div>
      {activeWorking.state === 'NO_FINANCIAL_POSITION' ? <div className={styles.emptyState}><CircleDollarSign aria-hidden="true" size={28} /><h3>No Client Financial Position has been added.</h3><p>Add financial information in Client Information, then return here to choose what is relevant to this Scenario.</p><Link className="atlas-action atlas-action-secondary" href={`/agent/clients/${encodeURIComponent(clientCaseId)}/information#financial-position`}>View / Edit Financial Position<ArrowRight aria-hidden="true" size={16} /></Link></div> : <>
        {activeWorking.state === 'EMPTY_SELECTION' ? <div className={styles.inlineState}><CircleDollarSign aria-hidden="true" size={18} /><span>No Client financial information is selected. Available facts remain optional.</span></div> : null}
        <div className={styles.domainList}>{groupedFacts.map((group, index) => <details className={styles.domainGroup} key={group.domain} open={index === 0 || group.facts.some((fact) => fact.reviewRequired)}><summary><span><strong>{humanizeScenarioValue(group.domain)}</strong><small>{group.facts.filter((fact) => fact.selected).length} of {group.facts.length} selected</small></span><ChevronDown aria-hidden="true" size={19} /></summary><div className={styles.factList}>{group.facts.map((fact) => <WorkingFactRow busy={busyKey === fact.entityId} fact={fact} key={fact.entityId} onMutation={mutate} />)}</div></details>)}</div>
      </>}
      <div className={styles.actionFooter}><div>{selectedFacts.length ? <p>{selectedFacts.length} selected for the next analysis version.</p> : <p>No Client financial information will be preserved unless you make a selection.</p>}<button className={styles.textButton} disabled={!selectedFacts.length || Boolean(busyKey)} onClick={() => void clearAll()} type="button">{busyKey === 'clear' ? 'Clearing...' : 'Clear all selections'}</button></div><button className="atlas-action atlas-action-primary" disabled={Boolean(busyKey)} onClick={() => void openReview()} ref={reviewButton} type="button">{busyKey === 'review' ? <LoaderCircle aria-hidden="true" className={styles.spin} size={17} /> : <Scale aria-hidden="true" size={17} />}Create analysis version</button></div>
    </section> : <section className={styles.financialSurface} aria-labelledby="fixed-context-title">
      <div className={styles.financialHeader}><div><p className={styles.eyebrow}>Historical capture</p><h2 id="fixed-context-title">Financial information used for this version</h2><p>{activeFixed.manifest ? `Captured ${date(activeFixed.manifest.capturedAt)}. This context is fixed and read-only.` : 'This earlier version does not contain captured financial context.'}</p></div><Link className="atlas-action atlas-action-primary" href={`/agent/clients/${encodeURIComponent(clientCaseId)}/scenarios/${encodeURIComponent(scenarioId)}`}>Create new version<ArrowRight aria-hidden="true" size={16} /></Link></div>
      {activeFixed.state === 'LEGACY_NO_FINANCIAL_CONTEXT' ? <div className={styles.emptyState}><Clock3 aria-hidden="true" size={28} /><h3>Financial context was not captured for this earlier version.</h3><p>Current Client information is not being presented as historical information for this version.</p></div> : activeFixed.state === 'NO_FINANCIAL_POSITION' ? <div className={styles.emptyState}><CircleDollarSign aria-hidden="true" size={28} /><h3>No Financial Position was available when this version was created.</h3></div> : activeFixed.state === 'EMPTY_SELECTION' ? <div className={styles.emptyState}><CircleDollarSign aria-hidden="true" size={28} /><h3>No Client financial information was preserved with this version.</h3></div> : <div className={styles.fixedList}>{activeFixed.entries.map((entry) => <FixedFactRow entry={entry} key={`${entry.domain}-${entry.entityId}`} />)}</div>}
      {activeFixed.state !== 'LEGACY_NO_FINANCIAL_CONTEXT' ? <div className={styles.comparisonActions}><button className="atlas-action atlas-action-secondary" disabled={comparisonBusy} onClick={() => void compare()} type="button">{comparisonBusy ? <LoaderCircle aria-hidden="true" className={styles.spin} size={16} /> : <Scale aria-hidden="true" size={16} />}{comparison ? 'Close comparison' : 'Compare with Current Financial Position'}</button></div> : null}
      {comparison ? <section aria-labelledby="comparison-title" className={styles.comparison}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>On-demand comparison</p><h3 id="comparison-title">Historical version and current information</h3></div><span>Checked {date(comparison.checkedAt)}</span></div><div className={styles.comparisonList}>{comparison.differences.map((difference) => {
        const historical = activeFixed.entries.find((entry) => entry.domain === difference.domain && entry.entityId === difference.entityId);
        const current = comparisonWorking?.facts.find((fact) => fact.domain === difference.domain && fact.entityId === difference.entityId);
        const label = historical?.label || current?.label || humanizeScenarioValue(difference.domain);
        return <article className={styles.comparisonRow} key={`${difference.domain}-${difference.entityId}`}><div className={styles.comparisonTitle}><strong>{label}</strong><span>{humanizeScenarioValue(difference.classification)}</span></div><div className={styles.comparisonValues}><div><span>Used by this version</span><strong>{historical ? formatFinancialValue(historical.value) : 'Not part of this version'}</strong></div><div><span>Current Client information</span><strong>{current ? formatFinancialValue(current.currentObservation?.value) : 'No longer current'}</strong></div></div>{difference.classification === 'LATER_CORRECTION' ? <p>This version remains unchanged; the current information was later corrected.</p> : null}{difference.classification === 'TIME_REVIEW_CHANGED' ? <p>This information was current when the version was created and now needs time-based review.</p> : null}{difference.classification === 'CURRENT_FACT_NOT_PART_OF_VERSION' ? <p>Current fact not part of this version.</p> : null}</article>;
      })}</div></section> : null}
    </section>}

    <section className={styles.versionRail} aria-labelledby="versions-title"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Scenario history</p><h2 id="versions-title">Versions</h2></div><Link href={`/agent/clients/${encodeURIComponent(clientCaseId)}/scenarios/${encodeURIComponent(scenarioId)}`}>Working Scenario</Link></div><div className={styles.versionLinks}>{versions.map((version) => <Link aria-current={scenarioVersionId === version.id ? 'page' : undefined} href={`/agent/clients/${encodeURIComponent(clientCaseId)}/scenarios/${encodeURIComponent(scenarioId)}/versions/${encodeURIComponent(version.id)}`} key={version.id}><span>Version {version.versionNumber}</span><small>{version.id === scenario.currentVersionId ? 'Current working basis' : date(version.createdAt)}</small></Link>)}</div></section>

    {review?.freezeReview ? <div className={styles.dialogBackdrop} onMouseDown={(event) => { if (event.currentTarget === event.target && busyKey !== 'freeze') closeReview(); }}><section aria-labelledby="analysis-review-title" aria-modal="true" className={`${styles.dialog} ${styles.reviewDialog}`} onKeyDown={handleReviewKeys} ref={reviewDialog} role="dialog"><div className={styles.dialogHeading}><div><p className={styles.eyebrow}>Before creating a fixed version</p><h2 id="analysis-review-title" tabIndex={-1}>Review selected financial information</h2></div><button aria-label="Close" className={styles.iconButton} disabled={busyKey === 'freeze'} onClick={closeReview} type="button"><X aria-hidden="true" size={19} /></button></div>
      <div className={styles.reviewBody}><div className={styles.reviewContext}><span>{scenario.name}</span><strong>{review.freezeReview.captureState === 'CAPTURED' ? `${review.draft?.selectionCount || 0} selected facts` : humanizeScenarioValue(review.freezeReview.captureState)}</strong></div>
        {review.freezeReview.reviewRequiredCount ? <div className={styles.reviewBlocker} role="alert"><AlertTriangle aria-hidden="true" size={18} /><div><strong>Review required before creating this version</strong><p>{review.freezeReview.reviewRequiredCount} selected {review.freezeReview.reviewRequiredCount === 1 ? 'fact has' : 'facts have'} changed or needs review.</p></div></div> : null}
        {review.state === 'EMPTY_SELECTION' ? <p className={styles.inlineState}>No Client financial information will be preserved with this version.</p> : review.state === 'NO_FINANCIAL_POSITION' ? <p className={styles.inlineState}>No Client Financial Position exists, so this version will record that state.</p> : <div className={styles.reviewFacts}>{review.facts.filter((fact) => fact.selected).map((fact) => <div key={fact.entityId}><span>{fact.label}</span><strong>{formatFinancialValue(fact.currentObservation?.value)}</strong></div>)}</div>}
        <ul className={styles.consequenceList}><li>A new fixed analysis version will be created.</li><li>The Client Financial Position remains unchanged.</li><li>No Output, report, or calculation is generated.</li><li>Your working selections remain available for continued Scenario work.</li></ul>
      </div><div className={styles.dialogActions}><button className="atlas-action atlas-action-secondary" disabled={busyKey === 'freeze'} onClick={closeReview} type="button">Cancel</button><button className="atlas-action atlas-action-primary" disabled={!review.freezeReview.canFreeze || busyKey === 'freeze'} onClick={() => void createAnalysisVersion()} type="button">{busyKey === 'freeze' ? <LoaderCircle aria-hidden="true" className={styles.spin} size={17} /> : <Scale aria-hidden="true" size={17} />}Create analysis version</button></div>
    </section></div> : null}
  </div></main>;
}
