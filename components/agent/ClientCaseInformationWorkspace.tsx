'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ClipboardCheck, Plus, Save, X } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';

import {
  AtlasButton,
  AtlasEmptyState,
  AtlasErrorState,
  AtlasField,
  AtlasInformationClassLabel,
  AtlasLoadingState,
  AtlasNotice,
  AtlasSurface,
} from '@/components/design-system/AtlasDesignSystem';
import styles from './ClientCaseInformationWorkspace.module.css';

type Intent = 'objectives' | 'target-cities' | 'purchase-price-range' | 'min-bedrooms' | 'property-occupancy' | null;
type ContextRecord = { id: string; semanticKey: string; value: unknown; sourcePosture: string; observedAt: string | null; effectiveAt: string | null; reviewAfter: string | null; createdAt: string };
type PropertyRelation = { id: string; canonicalPropertyId: string; role: string; canonicalProperty?: { sourceFormattedSitusAddress?: string | null; normalizedSitusAddress?: string | null; city?: string | null; state?: string | null; postalCode?: string | null } };
type ObjectiveRecord = { id: string; objectiveType: string; status: string; title: string; archivedAt: string | null };
type InformationResponse = {
  clientCase: { id: string; displayName: string; status: string; properties?: PropertyRelation[] };
  current: {
    objectives: { BUY_PRIMARY_HOME: boolean; FINANCIAL_STRATEGY: boolean };
    objectiveRecords: ObjectiveRecord[];
    targetCities: ContextRecord | null;
    purchasePriceRange: ContextRecord | null;
    minBedrooms: ContextRecord | null;
    propertyOccupancy: Array<{ clientCasePropertyId: string; current: ContextRecord | null }>;
    properties: PropertyRelation[];
  };
  readinessPreview: Record<string, { status: string; missingPreliminary: string[]; missingComprehensive: string[]; helpfulMissing: string[] } | null>;
  error?: string;
};

const requirementIntentMap: Record<string, Exclude<Intent, null>> = {
  BUYER_DECISION_OBJECTIVE: 'objectives',
  FINANCIAL_STRATEGY_OBJECTIVE: 'objectives',
  BUYER_DECISION_TARGET_CITIES: 'target-cities',
  MARKET_INTELLIGENCE_TARGET_CITIES: 'target-cities',
  BUYER_DECISION_PRICE_RANGE: 'purchase-price-range',
  BUYER_DECISION_MIN_BEDROOMS: 'min-bedrooms',
};

const occupancyOptions = ['OWNER_OCCUPIED', 'TENANT_OCCUPIED', 'VACANT', 'UNKNOWN'];

export function informationIntentFromRequirement(value: string | undefined): Intent {
  return value ? requirementIntentMap[value] ?? null : null;
}

function errorMessage(payload: unknown) {
  return typeof payload === 'object' && payload && 'error' in payload && typeof payload.error === 'string' ? payload.error : 'Client Case information is unavailable.';
}

function formatMoney(value: unknown, key: 'minimumCents' | 'maximumCents') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  const cents = (value as Record<string, unknown>)[key];
  return typeof cents === 'number' ? String(cents / 100) : '';
}

function propertyLabel(property: PropertyRelation) {
  return property.canonicalProperty?.sourceFormattedSitusAddress || property.canonicalProperty?.normalizedSitusAddress || property.canonicalPropertyId;
}

async function api(clientCaseId: string, body?: Record<string, unknown>) {
  const response = await fetch(`/api/agent/client-case-information?clientCaseId=${encodeURIComponent(clientCaseId)}`, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' });
  const payload = await response.json() as InformationResponse;
  if (!response.ok) throw new Error(errorMessage(payload));
  return payload;
}

export function ClientCaseInformationWorkspace({ clientCaseId, intent }: { clientCaseId: string; intent: Intent }) {
  const [workspace, setWorkspace] = useState<InformationResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [buyerObjective, setBuyerObjective] = useState(false);
  const [financialObjective, setFinancialObjective] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [cityDraft, setCityDraft] = useState('');
  const [minimumDollars, setMinimumDollars] = useState('');
  const [maximumDollars, setMaximumDollars] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [sourcePosture, setSourcePosture] = useState<'AGENT_ENTERED' | 'CLIENT_STATED'>('AGENT_ENTERED');
  const [observedAt, setObservedAt] = useState('');
  const [effectiveAt, setEffectiveAt] = useState('');
  const [reviewAfter, setReviewAfter] = useState('');
  const [occupancy, setOccupancy] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    void api(clientCaseId).then((payload) => {
      if (cancelled) return;
      setWorkspace(payload);
      setBuyerObjective(payload.current.objectives.BUY_PRIMARY_HOME);
      setFinancialObjective(payload.current.objectives.FINANCIAL_STRATEGY);
      setCities(Array.isArray(payload.current.targetCities?.value) ? payload.current.targetCities.value.filter((entry): entry is string => typeof entry === 'string') : []);
      setMinimumDollars(formatMoney(payload.current.purchasePriceRange?.value, 'minimumCents'));
      setMaximumDollars(formatMoney(payload.current.purchasePriceRange?.value, 'maximumCents'));
      setMinBedrooms(typeof payload.current.minBedrooms?.value === 'number' ? String(payload.current.minBedrooms.value) : '');
      setOccupancy(Object.fromEntries(payload.current.propertyOccupancy.map((entry) => [entry.clientCasePropertyId, typeof entry.current?.value === 'string' ? entry.current.value : ''])));
    }).catch((error: unknown) => {
      if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Client Case information is unavailable.');
    });
    return () => { cancelled = true; };
  }, [clientCaseId]);

  const activeBuyerObjective = buyerObjective || Boolean(workspace?.current.objectives.BUY_PRIMARY_HOME);
  const readinessHref = `/agent/clients/${encodeURIComponent(clientCaseId)}/readiness`;
  const canSave = !saving && Boolean(workspace);
  const summary = useMemo(() => ([
    ['Objectives', [buyerObjective ? 'Buyer decision' : null, financialObjective ? 'Financial strategy' : null].filter(Boolean).join(', ') || 'Not provided'],
    ['Target cities', cities.length ? cities.join(', ') : 'Not provided'],
    ['Purchase range', minimumDollars && maximumDollars ? `$${Number(minimumDollars).toLocaleString()} - $${Number(maximumDollars).toLocaleString()}` : 'Not provided'],
    ['Minimum bedrooms', minBedrooms || 'Not provided'],
  ] as const), [buyerObjective, financialObjective, cities, minimumDollars, maximumDollars, minBedrooms]);

  function addCity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = cityDraft.trim();
    if (!next || cities.includes(next) || cities.length >= 12) return;
    setCities((current) => [...current, next]);
    setCityDraft('');
  }

  async function save(reviewReadiness = false) {
    if (!workspace) return;
    setSaving(true);
    setStatus(null);
    try {
      const payload = await api(clientCaseId, {
        action: 'SAVE_CANONICAL_INFORMATION',
        clientCaseId,
        input: {
          objectives: { BUY_PRIMARY_HOME: buyerObjective, FINANCIAL_STRATEGY: financialObjective },
          targetCities: cities,
          ...(minimumDollars && maximumDollars ? { purchasePriceRange: { minimumDollars, maximumDollars } } : {}),
          ...(minBedrooms ? { minBedrooms } : {}),
          propertyOccupancy: Object.entries(occupancy).filter(([, value]) => value).map(([clientCasePropertyId, value]) => ({ clientCasePropertyId, value })),
          sourcePosture,
          observedAt: observedAt || null,
          effectiveAt: effectiveAt || null,
          reviewAfter: reviewAfter || null,
        },
      });
      setWorkspace(payload);
      setStatus('Canonical Client Case information saved. Readiness will recompute from the current context.');
      if (reviewReadiness) window.location.assign(readinessHref);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Client Case information could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  if (loadError) return <main className={styles.page}><AtlasErrorState title="Client Case information is unavailable"><p>{loadError}</p><Link className={styles.link} href={`/agent/clients/${encodeURIComponent(clientCaseId)}`}><ArrowLeft size={16} />Client Case</Link></AtlasErrorState></main>;
  if (!workspace) return <main className={styles.page}><AtlasLoadingState>Loading canonical Client Case information.</AtlasLoadingState></main>;

  return (
    <main className={styles.page} data-testid="client-case-information-workspace" data-canonical-information-route="true" data-scenario-authoring="false" data-readiness-persistence="false">
      <div className={styles.container}>
        <header className={styles.heading}>
          <div>
            <p className="atlas-ds-label">Client Work / Canonical information</p>
            <h1 className="atlas-ds-page-title">Client Case Information</h1>
            <p className={styles.introduction}>Maintain the durable canonical context used by Readiness and Agent workflows. Scenario assumptions, external requests, client authorization, CRM, and output actions stay outside this editor.</p>
          </div>
          <Link className={styles.link} href={`/agent/clients/${encodeURIComponent(clientCaseId)}`}><ArrowLeft aria-hidden="true" size={16} />Client Case</Link>
        </header>

        {status ? <AtlasNotice title="Information workflow" tone={status.includes('could not') || status.includes('required') ? 'attention' : 'success'}>{status}</AtlasNotice> : null}
        <AtlasNotice title="Canonical boundary" tone="information">Use this page for factual or generally applicable Client Case information. Target acquisition price, down payment, cash allocation, holding period, hypothetical city or bedroom overrides, and sell/retain/rent alternatives remain Scenario Version inputs.</AtlasNotice>

        <div className={styles.sectionGrid}>
          <AtlasSurface className={intent === 'objectives' ? styles.intent : undefined} material="glass" data-testid="client-case-information-objectives">
            <div className={styles.panelHeading}><div><h2 className="atlas-ds-major-section">Objectives</h2><p className={styles.metadata}>Ordinary objective lifecycle records, not immutable fact revisions.</p></div><AtlasInformationClassLabel informationClass="governed-fact" /></div>
            <div className={styles.objectiveList}>
              <label className={styles.objectiveOption}><input checked={buyerObjective} onChange={(event) => setBuyerObjective(event.target.checked)} type="checkbox" /><span className={styles.optionText}><span className={styles.optionTitle}>Buyer decision objective</span><span className={styles.optionDescription}>Enables buyer criteria such as price range and minimum bedrooms.</span></span></label>
              <label className={styles.objectiveOption}><input checked={financialObjective} onChange={(event) => setFinancialObjective(event.target.checked)} type="checkbox" /><span className={styles.optionText}><span className={styles.optionTitle}>Financial strategy objective</span><span className={styles.optionDescription}>Supports Financial Strategy readiness without storing scenario assumptions.</span></span></label>
            </div>
          </AtlasSurface>

          <AtlasSurface className={intent === 'target-cities' || intent === 'purchase-price-range' || intent === 'min-bedrooms' ? styles.intent : undefined} material="glass" data-testid="client-case-information-buyer-criteria">
            <div className={styles.panelHeading}><div><h2 className="atlas-ds-major-section">Buyer Criteria</h2><p className={styles.metadata}>Only current canonical criteria registered in the repository.</p></div><AtlasInformationClassLabel informationClass="governed-fact" /></div>
            <form className={styles.fieldGrid} onSubmit={addCity}>
              <AtlasField htmlFor="target-city" label="Target cities"><input className={styles.input} id="target-city" maxLength={80} placeholder="Add a city" value={cityDraft} onChange={(event) => setCityDraft(event.target.value)} /></AtlasField>
              <div className={styles.actions}><AtlasButton tone="secondary" type="submit"><Plus size={16} />Add city</AtlasButton></div>
            </form>
            <div className={styles.citiesRow}>{cities.length ? cities.map((city) => <span className={styles.cityChip} key={city}>{city}<button aria-label={`Remove ${city}`} type="button" onClick={() => setCities((current) => current.filter((item) => item !== city))}><X size={14} /></button></span>) : <p className={styles.emptyText}>Not provided.</p>}</div>
            <div className={styles.fieldGrid}>
              <div className={styles.rangeGrid}>
                <AtlasField htmlFor="minimum-dollars" label="Minimum purchase price"><input className={styles.input} id="minimum-dollars" inputMode="decimal" placeholder="500000" value={minimumDollars} onChange={(event) => setMinimumDollars(event.target.value)} /></AtlasField>
                <AtlasField htmlFor="maximum-dollars" label="Maximum purchase price"><input className={styles.input} id="maximum-dollars" inputMode="decimal" placeholder="750000" value={maximumDollars} onChange={(event) => setMaximumDollars(event.target.value)} /></AtlasField>
              </div>
              <AtlasField description={activeBuyerObjective ? undefined : 'Save the Buyer decision objective before saving objective-scoped buyer criteria.'} htmlFor="min-bedrooms" label="Minimum bedrooms"><input className={styles.input} id="min-bedrooms" inputMode="numeric" min="0" type="number" value={minBedrooms} onChange={(event) => setMinBedrooms(event.target.value)} /></AtlasField>
            </div>
          </AtlasSurface>
        </div>

        <AtlasSurface className={intent === 'property-occupancy' ? styles.intent : undefined} material="glass" data-testid="client-case-information-property-occupancy">
          <div className={styles.panelHeading}><div><h2 className="atlas-ds-major-section">Property / Occupancy Facts</h2><p className={styles.metadata}>Occupancy is property-scoped. Select an existing authorized Client Case property relationship.</p></div><AtlasInformationClassLabel informationClass="governed-fact" /></div>
          {workspace.current.properties.length ? <ul className={styles.occupancyList}>{workspace.current.properties.map((property) => <li className={styles.occupancyItem} key={property.id}><p className={styles.propertyLabel}>{property.role.replaceAll('_', ' ')}</p><p className={styles.propertyValue}>{propertyLabel(property)}</p><AtlasField htmlFor={`occupancy-${property.id}`} label="Occupancy status"><select className={styles.select} id={`occupancy-${property.id}`} value={occupancy[property.id] ?? ''} onChange={(event) => setOccupancy((current) => ({ ...current, [property.id]: event.target.value }))}><option value="">Not provided</option>{occupancyOptions.map((option) => <option key={option} value={option}>{option.replaceAll('_', ' ')}</option>)}</select></AtlasField></li>)}</ul> : <AtlasEmptyState title="No property relationship"><p>Attach an authorized Client Case property before recording property-scoped occupancy facts.</p></AtlasEmptyState>}
        </AtlasSurface>

        <AtlasSurface material="elevated" data-testid="client-case-information-provenance-timing">
          <div className={styles.panelHeading}><div><h2 className="atlas-ds-major-section">Provenance / Timing</h2><p className={styles.metadata}>Direct entry can be Agent-entered or client-stated. Evidence and Professional Input references are handled by their owning workflows.</p></div><AtlasInformationClassLabel informationClass={sourcePosture === 'CLIENT_STATED' ? 'agent-opinion' : 'system-status'} label={sourcePosture.replaceAll('_', ' ')} /></div>
          <div className={styles.fieldGrid}>
            <AtlasField htmlFor="source-posture" label="Source posture"><select className={styles.select} id="source-posture" value={sourcePosture} onChange={(event) => setSourcePosture(event.target.value as 'AGENT_ENTERED' | 'CLIENT_STATED')}><option value="AGENT_ENTERED">Agent entered</option><option value="CLIENT_STATED">Client stated</option></select></AtlasField>
            <AtlasField htmlFor="observed-at" label="Observed at"><input className={styles.input} id="observed-at" type="date" value={observedAt} onChange={(event) => setObservedAt(event.target.value)} /></AtlasField>
            <AtlasField htmlFor="effective-at" label="Effective at"><input className={styles.input} id="effective-at" type="date" value={effectiveAt} onChange={(event) => setEffectiveAt(event.target.value)} /></AtlasField>
            <AtlasField htmlFor="review-after" label="Review after"><input className={styles.input} id="review-after" type="date" value={reviewAfter} onChange={(event) => setReviewAfter(event.target.value)} /></AtlasField>
          </div>
        </AtlasSurface>

        <div className={styles.sectionGrid}>
          <AtlasSurface material="data" data-testid="client-case-information-summary">
            <h2 className="atlas-ds-major-section">Canonical Context Summary</h2>
            <ul className={styles.summaryList}>{summary.map(([label, value]) => <li className={styles.summaryItem} key={label}><p className={styles.summaryLabel}>{label}</p><p className={styles.summaryValue}>{value}</p></li>)}</ul>
          </AtlasSurface>
          <AtlasSurface material="reading" data-testid="client-case-information-readiness-preview">
            <h2 className="atlas-ds-major-section">Readiness Recomputes From Context</h2>
            <ul className={styles.readinessList}>{Object.entries(workspace.readinessPreview).map(([label, result]) => <li className={styles.readinessItem} key={label}><p className={styles.summaryLabel}>{label.replaceAll('_', ' ')}</p><p className={styles.summaryValue}>{result?.status?.replaceAll('_', ' ') ?? 'Not available'}</p></li>)}</ul>
            <Link className={styles.link} href={readinessHref}><ClipboardCheck size={16} />Review readiness</Link>
          </AtlasSurface>
        </div>

        <div className={styles.actions}>
          <AtlasButton disabled={!canSave} loading={saving} onClick={() => void save(false)}><Save size={16} />Save</AtlasButton>
          <AtlasButton disabled={!canSave} loading={saving} tone="secondary" onClick={() => void save(true)}><CheckCircle2 size={16} />Save and review readiness</AtlasButton>
        </div>
      </div>
    </main>
  );
}
