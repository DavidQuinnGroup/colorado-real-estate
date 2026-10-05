'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, FolderKanban, Home, LoaderCircle, Plus, X } from 'lucide-react';
import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';

import type { ScenarioSummary } from './clientCaseScenarioTypes';
import styles from './ClientCaseScenarioWorkspace.module.css';

type ClientCase = { id: string; displayName: string; status: string };

async function payload<T>(response: Response): Promise<T> {
  const value = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(value.error || 'The requested Scenario information is unavailable.');
  return value;
}

export function ClientCaseScenarioIndexWorkspace({ clientCaseId }: { clientCaseId: string }) {
  const [clientCase, setClientCase] = useState<ClientCase | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const createButton = useRef<HTMLButtonElement | null>(null);
  const createDialog = useRef<HTMLElement | null>(null);

  const load = useCallback(async () => {
    try {
      const [caseResult, scenarioResult] = await Promise.all([
        fetch(`/api/agent/client-cases?id=${encodeURIComponent(clientCaseId)}`, { cache: 'no-store' }).then((response) => payload<{ clientCase: ClientCase }>(response)),
        fetch(`/api/agent/client-case-scenarios?clientCaseId=${encodeURIComponent(clientCaseId)}`, { cache: 'no-store' }).then((response) => payload<{ scenarios: ScenarioSummary[] }>(response)),
      ]);
      setError(null);
      setClientCase(caseResult.clientCase);
      setScenarios(scenarioResult.scenarios);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Scenarios are unavailable.');
    }
  }, [clientCaseId]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function createScenario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const result = await fetch('/api/agent/client-case-scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientCaseId, action: 'CREATE', input: { name, description: description || null, initialDefinition: { assumptions: [], criteria: [], propertyDispositions: [], objectiveIds: [] } } }),
      }).then((response) => payload<{ scenario: ScenarioSummary }>(response));
      window.location.assign(`/agent/clients/${encodeURIComponent(clientCaseId)}/scenarios/${encodeURIComponent(result.scenario.id)}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The Scenario could not be created.');
      setBusy(false);
    }
  }

  function closeCreate() {
    setCreating(false);
    requestAnimationFrame(() => createButton.current?.focus());
  }

  function handleCreateKeys(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && !busy) { event.preventDefault(); closeCreate(); return; }
    if (event.key !== 'Tab') return;
    const controls = Array.from(createDialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])') || []);
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  return <main className={styles.page} data-testid="client-case-scenario-index"><div className={styles.container}>
    <header className={styles.pageHeader}>
      <nav aria-label="Scenario breadcrumbs" className={styles.breadcrumbs}>
        <Link href="/agent"><Home aria-hidden="true" size={15} />Workspace</Link>
        <Link href={`/agent/clients/${encodeURIComponent(clientCaseId)}`}><ArrowLeft aria-hidden="true" size={15} />Client Case</Link>
      </nav>
      <div className={styles.titleRow}><div><p className={styles.eyebrow}>Client Case</p><h1>{clientCase?.displayName || 'Scenarios'}</h1><p className={styles.introduction}>Model decisions in working Scenarios, then preserve selected Client information in a fixed analysis version.</p></div>
        <button className="atlas-action atlas-action-primary" onClick={() => setCreating(true)} ref={createButton} type="button"><Plus aria-hidden="true" size={17} />New Scenario</button>
      </div>
    </header>

    {error ? <div className={styles.error} role="alert"><span>{error}</span><button className={styles.textButton} onClick={() => void load()} type="button">Try again</button></div> : null}
    {!scenarios ? <p className={styles.loading} role="status"><LoaderCircle aria-hidden="true" className={styles.spin} size={18} />Loading Scenarios...</p> : scenarios.length ? <section aria-labelledby="scenario-list-title" className={styles.indexSurface}>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Active work</p><h2 id="scenario-list-title">Scenarios</h2></div><span>{scenarios.length} {scenarios.length === 1 ? 'Scenario' : 'Scenarios'}</span></div>
      <ul className={styles.scenarioList}>{scenarios.map((scenario) => <li key={scenario.id}>
        <Link className={styles.scenarioLink} href={`/agent/clients/${encodeURIComponent(clientCaseId)}/scenarios/${encodeURIComponent(scenario.id)}`}>
          <span className={styles.scenarioIcon}><FolderKanban aria-hidden="true" size={20} /></span>
          <span className={styles.scenarioIdentity}><strong>{scenario.name}</strong><span>{scenario.description || 'Working Scenario'}</span></span>
          <span className={styles.scenarioMeta}><span>Working</span><span>{scenario.currentVersion ? `Current version ${scenario.currentVersion.versionNumber}` : 'No current version'}</span></span>
          <ArrowRight aria-hidden="true" size={19} />
        </Link>
      </li>)}</ul>
    </section> : <section className={styles.emptyState}><FolderKanban aria-hidden="true" size={28} /><h2>No Scenarios yet</h2><p>Create a working Scenario to organize assumptions and choose the Client financial information relevant to an analysis version.</p><button className="atlas-action atlas-action-primary" onClick={() => setCreating(true)} type="button"><Plus aria-hidden="true" size={17} />New Scenario</button></section>}

    {creating ? <div className={styles.dialogBackdrop} onMouseDown={(event) => { if (event.currentTarget === event.target && !busy) closeCreate(); }}>
      <section aria-labelledby="new-scenario-title" aria-modal="true" className={styles.dialog} onKeyDown={handleCreateKeys} ref={createDialog} role="dialog">
        <div className={styles.dialogHeading}><div><p className={styles.eyebrow}>Working Scenario</p><h2 id="new-scenario-title">Create Scenario</h2></div><button aria-label="Close" className={styles.iconButton} disabled={busy} onClick={closeCreate} type="button"><X aria-hidden="true" size={19} /></button></div>
        <form className={styles.createForm} onSubmit={createScenario}>
          <label><span>Scenario name</span><input autoFocus disabled={busy} maxLength={160} onChange={(event) => setName(event.target.value)} required value={name} /></label>
          <label><span>Description <small>Optional</small></span><textarea disabled={busy} maxLength={1000} onChange={(event) => setDescription(event.target.value)} rows={3} value={description} /></label>
          <p className={styles.formNote}>The Scenario starts with an empty definition. Client financial information is selected separately in Financial Context.</p>
          <div className={styles.dialogActions}><button className="atlas-action atlas-action-secondary" disabled={busy} onClick={closeCreate} type="button">Cancel</button><button className="atlas-action atlas-action-primary" disabled={busy || !name.trim()} type="submit">{busy ? <LoaderCircle aria-hidden="true" className={styles.spin} size={17} /> : <Plus aria-hidden="true" size={17} />}Create Scenario</button></div>
        </form>
      </section>
    </div> : null}
  </div></main>;
}
