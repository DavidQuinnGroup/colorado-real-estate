'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, CircleAlert, ClipboardCheck, RefreshCw } from 'lucide-react';

import {
  AtlasButton,
  AtlasEmptyState,
  AtlasErrorState,
  AtlasField,
  AtlasInformationClassLabel,
  AtlasLoadingState,
  AtlasNotice,
  AtlasStatusLabel,
  AtlasSurface,
} from '@/components/design-system/AtlasDesignSystem';
import styles from './ClientCaseReadinessWorkspace.module.css';

type ClientCase = { id: string; displayName: string; status: string };
type Scenario = { id: string; name: string; currentVersionId: string | null; status: string };
type Capability = { id: 'FINANCIAL_STRATEGY' | 'BUYER_DECISION' | 'MARKET_INTELLIGENCE'; label: string; executionParameters: readonly ('annualInterestRateBasisPoints' | 'marketScope')[] };
type ReadinessResult = {
  result: {
    status: 'INSUFFICIENT' | 'PRELIMINARY_READY' | 'COMPREHENSIVE_READY';
    evaluatedAt: string;
    context: { clientCaseId: string; mode: 'CANONICAL_BASELINE' | 'SCENARIO_VERSION'; scenarioId: string | null; scenarioVersionId: string | null; effectiveContextContractVersion: string; effectiveContextRulesetVersion: number };
    requirements: Array<{ requirementId: string; level: string; presence: string; verification: string; freshness: string; professionalInput: string; conflict: boolean }>;
    missingPreliminary: string[];
    missingComprehensive: string[];
    helpfulMissing: string[];
    unverified: string[];
    stale: string[];
    professionalInputNeeded: string[];
    conflicts: string[];
    limitations: Array<{ code: string; semanticKey: string | null; sourceRecordId: string | null }>;
  };
  requirementLabels: Record<string, string>;
};
type WorkspaceResponse = { clientCase?: ClientCase; clientCases: ClientCase[]; scenarios?: Scenario[]; capabilities: Capability[]; error?: string };

const baseline = '__baseline__';

function errorMessage(payload: unknown) {
  return typeof payload === 'object' && payload && 'error' in payload && typeof payload.error === 'string' ? payload.error : 'The readiness check could not be completed.';
}

function requirementList(ids: readonly string[], labels: Record<string, string>) {
  return ids.map((id) => labels[id] ?? id);
}

function ResultList({ ids, labels, title }: { ids: readonly string[]; labels: Record<string, string>; title: string }) {
  if (!ids.length) return null;
  return <section className={styles.resultList}><h3 className="atlas-ds-panel-title">{title}</h3><ul>{requirementList(ids, labels).map((label) => <li key={label}>{label}</li>)}</ul></section>;
}

function statusPresentation(status: ReadinessResult['result']['status']) {
  if (status === 'COMPREHENSIVE_READY') return { label: 'Comprehensive ready', notice: 'All required readiness conditions are currently satisfied.', tone: 'success' as const, status: 'complete' as const };
  if (status === 'PRELIMINARY_READY') return { label: 'Preliminary ready', notice: 'Preliminary requirements are satisfied; comprehensive requirements remain.', tone: 'attention' as const, status: 'pending' as const };
  return { label: 'Insufficient', notice: 'Preliminary required information is missing or needs attention.', tone: 'blocking' as const, status: 'blocked' as const };
}

export function ClientCaseReadinessWorkspace({ clientCaseId }: { clientCaseId: string }) {
  return <ClientCaseReadinessWorkspaceState clientCaseId={clientCaseId} key={clientCaseId} />;
}

function ClientCaseReadinessWorkspaceState({ clientCaseId }: { clientCaseId: string }) {
  const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [capabilityId, setCapabilityId] = useState<string>('');
  const [scenarioVersionId, setScenarioVersionId] = useState(baseline);
  const [interestRateBasisPoints, setInterestRateBasisPoints] = useState('');
  const [marketScope, setMarketScope] = useState('');
  const [result, setResult] = useState<ReadinessResult | null>(null);
  const [resultSelectionKey, setResultSelectionKey] = useState<string | null>(null);
  const [resultError, setResultError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const requestSequence = useRef(0);

  const clearResult = () => {
    requestSequence.current += 1;
    setResult(null);
    setResultSelectionKey(null);
    setResultError(null);
    setChecking(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/agent/client-case-readiness?clientCaseId=${encodeURIComponent(clientCaseId)}`, { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as WorkspaceResponse;
        if (!response.ok) throw new Error(errorMessage(payload));
        setWorkspace(payload);
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name !== 'AbortError') setLoadError(error instanceof Error ? error.message : 'Client Case readiness is unavailable.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [clientCaseId]);

  const capability = workspace?.capabilities.find((item) => item.id === capabilityId) ?? null;
  const needsRate = capability?.executionParameters.includes('annualInterestRateBasisPoints') ?? false;
  const needsScope = capability?.executionParameters.includes('marketScope') ?? false;
  const validParameters = (!needsRate || /^\d+$/.test(interestRateBasisPoints)) && (!needsScope || ['STATE', 'CITY', 'NEIGHBORHOOD'].includes(marketScope));
  const canCheck = Boolean(workspace?.clientCase && capability && validParameters && !checking);
  const activeSelection = useMemo(() => JSON.stringify({ clientCaseId, capabilityId, scenarioVersionId, interestRateBasisPoints, marketScope }), [clientCaseId, capabilityId, scenarioVersionId, interestRateBasisPoints, marketScope]);

  async function checkReadiness() {
    if (!canCheck || !capability) return;
    const selectionKey = activeSelection;
    const sequence = requestSequence.current + 1;
    requestSequence.current = sequence;
    setChecking(true);
    setResult(null);
    setResultError(null);
    const executionParameters: Record<string, unknown> = {};
    if (needsRate) executionParameters.annualInterestRateBasisPoints = Number(interestRateBasisPoints);
    if (needsScope) executionParameters.marketScope = marketScope;
    try {
      const response = await fetch('/api/agent/client-case-readiness', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientCaseId, capability: capability.id, ...(scenarioVersionId === baseline ? {} : { scenarioVersionId }), ...(Object.keys(executionParameters).length ? { executionParameters } : {}) }),
      });
      const payload = await response.json() as ReadinessResult;
      if (!response.ok) throw new Error(errorMessage(payload));
      if (sequence === requestSequence.current) {
        setResult(payload);
        setResultSelectionKey(selectionKey);
      }
    } catch (error) {
      if (sequence === requestSequence.current) setResultError(error instanceof Error ? error.message : 'The readiness check could not be completed.');
    } finally {
      if (sequence === requestSequence.current) setChecking(false);
    }
  }

  if (loading) return <main className={styles.page}><AtlasLoadingState>Loading owner-scoped Client Case readiness.</AtlasLoadingState></main>;
  if (loadError) return <main className={styles.page}><AtlasErrorState title="Client Case readiness is unavailable"><p>{loadError}</p><Link className="atlas-ds-link" href="/agent/clients">Return to Client Work</Link></AtlasErrorState></main>;
  if (!workspace?.clientCase) return <main className={styles.page}><AtlasEmptyState title="No Client Case selected"><p>Select an owner-scoped Client Case from Client Work before checking readiness.</p><Link className="atlas-ds-link" href="/agent/clients">Open Client Work</Link></AtlasEmptyState></main>;

  const currentSelection = result && result.result.context.clientCaseId === clientCaseId && activeSelection === resultSelectionKey;
  const status = result ? statusPresentation(result.result.status) : null;

  return (
    <main className={styles.page} data-testid="client-case-readiness-workspace">
      <div className={styles.heading}>
        <div><p className="atlas-ds-label">Client Work / Readiness</p><h1 className="atlas-ds-page-title">Readiness check</h1><p className={styles.introduction}>Review the current owner-scoped context before a capability is used. This check reads the canonical case and selected scenario version; it does not create, edit, or duplicate client information.</p></div>
        <Link className="atlas-ds-link" href={`/agent/clients/${encodeURIComponent(clientCaseId)}`}><ArrowLeft aria-hidden="true" size={16} />Client Case</Link>
      </div>
      <AtlasNotice title="Read-only readiness" tone="information">Use this workflow to identify what is present, missing, or needs review. It does not run analysis or take an external action.</AtlasNotice>
      <AtlasSurface className={styles.selectionPanel} material="glass">
        <div className={styles.panelHeading}><div><h2 className="atlas-ds-major-section">Select context</h2><p className="atlas-ds-metadata">Selections are session-only. Existing Client Case information stays canonical and is not re-entered here.</p></div><AtlasInformationClassLabel informationClass="system-status" label="Read-only workflow" /></div>
        <div className={styles.selectionGrid}>
          <AtlasField htmlFor="readiness-case" label="Client Case"><select className="atlas-ds-select" id="readiness-case" value={clientCaseId} onChange={(event) => { clearResult(); window.location.assign(`/agent/clients/${encodeURIComponent(event.target.value)}/readiness`); }}><option value={clientCaseId}>{workspace.clientCase.displayName}</option>{workspace.clientCases.filter((item) => item.id !== clientCaseId).map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}</select></AtlasField>
          <AtlasField description="Baseline remains usable when no scenario exists." htmlFor="readiness-scenario" label="Context"><select className="atlas-ds-select" id="readiness-scenario" value={scenarioVersionId} onChange={(event) => { clearResult(); setScenarioVersionId(event.target.value); }}><option value={baseline}>Canonical baseline</option>{(workspace.scenarios ?? []).filter((scenario) => scenario.currentVersionId).map((scenario) => <option key={scenario.id} value={scenario.currentVersionId!}>{scenario.name} (current version)</option>)}</select></AtlasField>
          <AtlasField htmlFor="readiness-capability" label="Admitted capability"><select className="atlas-ds-select" id="readiness-capability" value={capabilityId} onChange={(event) => { clearResult(); setCapabilityId(event.target.value); setInterestRateBasisPoints(''); setMarketScope(''); }}><option value="">Select capability</option>{workspace.capabilities.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></AtlasField>
          {needsRate ? <AtlasField description="Basis points are an ephemeral execution parameter; the Client Case is unchanged." htmlFor="readiness-rate" label="Annual interest rate assumption" message={interestRateBasisPoints && !/^\d+$/.test(interestRateBasisPoints) ? 'Enter a whole number of basis points.' : undefined} messageTone="error" unit="bps"><input className="atlas-ds-input" id="readiness-rate" inputMode="numeric" value={interestRateBasisPoints} onChange={(event) => { clearResult(); setInterestRateBasisPoints(event.target.value); }} /></AtlasField> : null}
          {needsScope ? <AtlasField htmlFor="readiness-market-scope" label="Market scope"><select className="atlas-ds-select" id="readiness-market-scope" value={marketScope} onChange={(event) => { clearResult(); setMarketScope(event.target.value); }}><option value="">Select scope</option><option value="STATE">State</option><option value="CITY">City</option><option value="NEIGHBORHOOD">Neighborhood</option></select></AtlasField> : null}
        </div>
        {!workspace.scenarios?.length ? <AtlasEmptyState className={styles.inlineEmpty} title="No active scenarios"><p>Canonical baseline is available now. Scenario creation and editing are outside this workflow.</p></AtlasEmptyState> : null}
        <div className={styles.checkRow}><AtlasButton disabled={!canCheck} loading={checking} onClick={() => void checkReadiness()}><ClipboardCheck aria-hidden="true" size={16} />Check readiness</AtlasButton>{capability && !validParameters ? <p className="atlas-ds-metadata">Complete the required execution parameter before checking readiness.</p> : null}</div>
      </AtlasSurface>
      {resultError ? <AtlasErrorState title="Readiness could not be checked"><p>{resultError}</p><AtlasButton tone="secondary" onClick={() => void checkReadiness()}><RefreshCw aria-hidden="true" size={16} />Try again</AtlasButton></AtlasErrorState> : null}
      {result && currentSelection && status ? <section className={styles.resultSection} aria-live="polite" data-testid="client-case-readiness-result">
        <div className={styles.resultHeading}><div><p className="atlas-ds-label">Current selection</p><h2 className="atlas-ds-major-section">Readiness result</h2></div><AtlasStatusLabel label={status.label} status={status.status} /></div>
        <AtlasNotice title={status.label} tone={status.tone}>{status.notice}</AtlasNotice>
        <div className={styles.resultGrid}>
          <AtlasSurface material="data"><h3 className="atlas-ds-panel-title">Context summary</h3><dl className={styles.summaryList}><div><dt>Client Case</dt><dd>{workspace.clientCase.displayName}</dd></div><div><dt>Context</dt><dd>{result.result.context.mode === 'CANONICAL_BASELINE' ? 'Canonical baseline' : 'Selected scenario current version'}</dd></div><div><dt>Scenario version</dt><dd>{result.result.context.scenarioVersionId ?? 'Not selected'}</dd></div><div><dt>Ruleset</dt><dd>Effective Context V{result.result.context.effectiveContextRulesetVersion}</dd></div></dl></AtlasSurface>
          <AtlasSurface material="reading"><h3 className="atlas-ds-panel-title">Requirement detail</h3><div className={styles.requirementTable}><table><caption className="sr-only">Readiness requirements for the selected capability</caption><thead><tr><th>Requirement</th><th>Level</th><th>State</th></tr></thead><tbody>{result.result.requirements.map((requirement) => <tr key={requirement.requirementId}><td>{result.requirementLabels[requirement.requirementId] ?? requirement.requirementId}</td><td>{requirement.level.replaceAll('_', ' ')}</td><td>{[requirement.presence, requirement.verification, requirement.freshness, requirement.professionalInput, requirement.conflict ? 'CONFLICT' : null].filter((value) => value && value !== 'NOT_REQUIRED' && value !== 'NOT_APPLICABLE').join(' / ') || 'Satisfied'}</td></tr>)}</tbody></table></div></AtlasSurface>
        </div>
        <div className={styles.resultLists}><ResultList ids={result.result.missingPreliminary} labels={result.requirementLabels} title="Missing preliminary required" /><ResultList ids={result.result.missingComprehensive} labels={result.requirementLabels} title="Comprehensive required" /><ResultList ids={result.result.helpfulMissing} labels={result.requirementLabels} title="Helpful missing" /><ResultList ids={result.result.unverified} labels={result.requirementLabels} title="Verification needed" /><ResultList ids={result.result.stale} labels={result.requirementLabels} title="Stale information" /><ResultList ids={result.result.professionalInputNeeded} labels={result.requirementLabels} title="Professional input needed" /><ResultList ids={result.result.conflicts} labels={result.requirementLabels} title="Conflicts needing review" />{result.result.limitations.length ? <section className={styles.resultList}><h3 className="atlas-ds-panel-title">Limitations</h3><ul>{result.result.limitations.map((limitation, index) => <li key={`${limitation.code}-${index}`}>{limitation.code.replaceAll('_', ' ')}</li>)}</ul></section> : null}</div>
        <p className="atlas-ds-metadata"><CheckCircle2 aria-hidden="true" size={15} /> Evaluated {new Date(result.result.evaluatedAt).toLocaleString()}. Readiness does not execute analysis, alter the Client Case, or create a record.</p>
      </section> : null}
      {!result && !resultError && !checking ? <AtlasSurface className={styles.initialState} material="reading"><CircleAlert aria-hidden="true" size={18} /><p>Select an admitted capability and check readiness to see the current canonical context and supported limitations.</p></AtlasSurface> : null}
    </main>
  );
}
