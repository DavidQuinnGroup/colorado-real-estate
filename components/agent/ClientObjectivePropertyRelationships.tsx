'use client';

import Link from 'next/link';
import { Archive, ArrowUpRight, CheckCircle2, ChevronDown, Home, LoaderCircle, Plus, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { AgentObjectivePropertyRelationshipSummary } from '@/lib/clientCaseObjectivePropertyRelationshipPresentation';
import { relationshipRoleDefault, relationshipRoleLabel } from '@/lib/clientCaseObjectivePropertyRelationshipPresentation';
import { objectiveTypeMetadata } from '@/lib/clientCaseContextSemanticRegistry';
import { fetchCurrentObjectivePropertyRelationships, fetchObjectivePropertyRelationshipHistory, mutateObjectivePropertyRelationship, type RelationshipResponse } from './clientCaseObjectivePropertyRelationshipClient';
import type { ClientCaseObjectiveSummaryRecord, ClientCaseSummary } from './clientCommandCenterTypes';
import styles from './ClientCommandCenter.module.css';

type ClientCaseProperty = ClientCaseSummary['properties'][number];
type ObjectiveStatus = 'COMPLETED' | 'ARCHIVED';
type Feedback = { objectiveId: string; message: string; error: boolean } | null;
type HistoryState = { loading: boolean; expanded: boolean; relationships: AgentObjectivePropertyRelationshipSummary[] | null; error: string | null };

function dateLabel(value: string | null) {
  if (!value) return 'Not recorded';
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function propertyLabel(property: ClientCaseProperty) {
  return property.canonicalProperty.sourceFormattedSitusAddress || property.canonicalProperty.normalizedSitusAddress || 'Property address unavailable';
}

function propertyContext(property: ClientCaseProperty) {
  return [property.canonicalProperty.city, property.canonicalProperty.state, property.canonicalProperty.postalCode].filter(Boolean).join(', ');
}

function ObjectiveActions({ clientCaseId, disabled, objective, onTransition }: {
  clientCaseId: string;
  disabled: boolean;
  objective: ClientCaseObjectiveSummaryRecord;
  onTransition: (objective: ClientCaseObjectiveSummaryRecord, status: ObjectiveStatus) => void;
}) {
  const metadata = objectiveTypeMetadata(objective.objectiveType);
  const domain = metadata.domainAction === 'BUYER'
    ? { label: 'Open Buyer', href: `/agent/prepare/buyer?clientCaseId=${encodeURIComponent(clientCaseId)}` }
    : metadata.domainAction === 'SELLER'
      ? { label: 'Open Seller', href: `/agent/prepare/seller?clientCaseId=${encodeURIComponent(clientCaseId)}` }
      : null;
  return <div className={styles.objectiveActions}>
    {domain ? <Link className="atlas-action atlas-action-secondary" href={domain.href}>{domain.label}<ArrowUpRight aria-hidden="true" size={16} /></Link> : null}
    <button className="atlas-action atlas-action-secondary" disabled={disabled} onClick={() => onTransition(objective, 'COMPLETED')} type="button"><CheckCircle2 aria-hidden="true" size={16} />Complete</button>
    <button className="atlas-action atlas-action-secondary" disabled={disabled} onClick={() => onTransition(objective, 'ARCHIVED')} type="button"><Archive aria-hidden="true" size={16} />Archive</button>
  </div>;
}

export function ClientObjectivePropertyRelationships({ clientCaseId, objectives, properties, objectiveBusy, onTransition }: {
  clientCaseId: string;
  objectives: ClientCaseObjectiveSummaryRecord[];
  properties: ClientCaseProperty[];
  objectiveBusy: boolean;
  onTransition: (objective: ClientCaseObjectiveSummaryRecord, status: ObjectiveStatus) => void;
}) {
  const [batch, setBatch] = useState<RelationshipResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [draftObjectiveId, setDraftObjectiveId] = useState<string | null>(null);
  const [draftPropertyId, setDraftPropertyId] = useState('');
  const [draftRole, setDraftRole] = useState('');
  const [linkBusy, setLinkBusy] = useState(false);
  const [endConfirmId, setEndConfirmId] = useState<string | null>(null);
  const [endBusyId, setEndBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [history, setHistory] = useState<Record<string, HistoryState>>({});
  const requestSequence = useRef(0);

  const reload = useCallback(async () => {
    const response = await fetchCurrentObjectivePropertyRelationships(clientCaseId);
    setBatch(response);
    setLoadError(null);
    return response;
  }, [clientCaseId]);

  useEffect(() => {
    const sequence = ++requestSequence.current;
    setBatch(null);
    setLoadError(null);
    setDraftObjectiveId(null);
    setDraftPropertyId('');
    setDraftRole('');
    setEndConfirmId(null);
    setFeedback(null);
    setHistory({});
    if (!objectives.length) return;
    void reload().catch((reason) => {
      if (sequence === requestSequence.current) setLoadError(reason instanceof Error ? reason.message : 'Current Property relationships are unavailable.');
    });
  }, [clientCaseId, objectives.length, reload]);

  const relationshipsByObjective = useMemo(() => {
    const grouped = new Map<string, AgentObjectivePropertyRelationshipSummary[]>();
    for (const relationship of batch?.relationships ?? []) {
      const current = grouped.get(relationship.objectiveId) ?? [];
      current.push(relationship);
      grouped.set(relationship.objectiveId, current);
    }
    return grouped;
  }, [batch]);

  function clearDraft() {
    setDraftObjectiveId(null);
    setDraftPropertyId('');
    setDraftRole('');
    setFeedback(null);
  }

  function openLink(objective: ClientCaseObjectiveSummaryRecord, preselectedPropertyId = '') {
    setDraftObjectiveId(objective.id);
    setDraftPropertyId(preselectedPropertyId);
    setDraftRole(relationshipRoleDefault(objective.objectiveType) ?? '');
    setEndConfirmId(null);
    setFeedback(null);
  }

  async function link(objective: ClientCaseObjectiveSummaryRecord) {
    if (!draftPropertyId || !draftRole) return;
    setLinkBusy(true);
    setFeedback(null);
    try {
      await mutateObjectivePropertyRelationship(clientCaseId, 'LINK', { objectiveId: objective.id, clientCasePropertyId: draftPropertyId, role: draftRole });
      await reload();
      setDraftObjectiveId(null);
      setDraftPropertyId('');
      setDraftRole('');
      setFeedback({ objectiveId: objective.id, message: 'Property linked to this Objective.', error: false });
    } catch (reason) {
      setFeedback({ objectiveId: objective.id, message: reason instanceof Error ? reason.message : 'The Property could not be linked.', error: true });
      void reload().catch(() => undefined);
    } finally {
      setLinkBusy(false);
    }
  }

  async function end(relationship: AgentObjectivePropertyRelationshipSummary) {
    setEndBusyId(relationship.relationshipId);
    setFeedback(null);
    try {
      await mutateObjectivePropertyRelationship(clientCaseId, 'END', { relationshipId: relationship.relationshipId });
      await reload();
      setEndConfirmId(null);
      setFeedback({ objectiveId: relationship.objectiveId, message: 'Property relationship ended. Its history is preserved.', error: false });
    } catch (reason) {
      setFeedback({ objectiveId: relationship.objectiveId, message: reason instanceof Error ? reason.message : 'The Property relationship could not be ended.', error: true });
      void reload().catch(() => undefined);
    } finally {
      setEndBusyId(null);
    }
  }

  async function toggleHistory(objectiveId: string) {
    const current = history[objectiveId];
    if (current?.expanded) {
      setHistory((value) => ({ ...value, [objectiveId]: { ...current, expanded: false } }));
      return;
    }
    if (current?.relationships) {
      setHistory((value) => ({ ...value, [objectiveId]: { ...current, expanded: true } }));
      return;
    }
    setHistory((value) => ({ ...value, [objectiveId]: { loading: true, expanded: true, relationships: null, error: null } }));
    try {
      const response = await fetchObjectivePropertyRelationshipHistory(clientCaseId, objectiveId);
      setHistory((value) => ({ ...value, [objectiveId]: { loading: false, expanded: true, relationships: response.relationships, error: null } }));
    } catch (reason) {
      setHistory((value) => ({ ...value, [objectiveId]: { loading: false, expanded: true, relationships: null, error: reason instanceof Error ? reason.message : 'Relationship history is unavailable.' } }));
    }
  }

  if (loadError) return <p className={styles.localizedError} role="alert">{loadError}</p>;
  if (!batch && objectives.length) return <p className={styles.localizedStatus} role="status"><LoaderCircle aria-hidden="true" className={styles.spin} size={16} />Loading current Property relationships...</p>;

  return <ul className={styles.objectiveList} data-testid="client-objective-property-relationships">
    {objectives.map((objective) => {
      const metadata = objectiveTypeMetadata(objective.objectiveType);
      const current = relationshipsByObjective.get(objective.id) ?? [];
      const activePropertyIds = new Set(current.map((relationship) => relationship.clientCasePropertyId));
      const eligibleProperties = properties.filter((property) => !activePropertyIds.has(property.id));
      const historyState = history[objective.id];
      const isDrafting = draftObjectiveId === objective.id;
      const lifecycleGuard = current.length > 0;
      return <li className={styles.objectiveRow} key={objective.id}>
        <div className={styles.objectiveRowHeader}>
          <div className={styles.objectiveIdentity}><strong>{metadata.displayLabel}: {objective.title}</strong><span>Active since {dateLabel(objective.createdAt)}</span></div>
          <ObjectiveActions clientCaseId={clientCaseId} disabled={objectiveBusy || lifecycleGuard} objective={objective} onTransition={onTransition} />
        </div>
        <div className={styles.relationshipContent}>
          {current.length ? <ul className={styles.currentRelationshipList}>{current.map((relationship) => <li className={styles.currentRelationship} key={relationship.relationshipId}>
            <div><strong>{relationship.property.label}</strong>{relationship.property.location ? <span>{relationship.property.location}</span> : null}<small>{relationshipRoleLabel(relationship.role)}</small></div>
            <div className={styles.relationshipActions}><Link className="atlas-action atlas-action-secondary" href={`/agent/clients/${encodeURIComponent(clientCaseId)}/information#properties`}>View Property<ArrowUpRight aria-hidden="true" size={15} /></Link>{endConfirmId === relationship.relationshipId ? <div className={styles.endConfirmation}><p>This ends this Objective relationship. History remains, and the Property stays in this Client Case.</p><button className="atlas-action atlas-action-secondary" disabled={endBusyId === relationship.relationshipId} onClick={() => setEndConfirmId(null)} type="button">Cancel</button><button className="atlas-action atlas-action-secondary" disabled={endBusyId === relationship.relationshipId} onClick={() => void end(relationship)} type="button">{endBusyId === relationship.relationshipId ? 'Ending…' : 'Confirm End'}</button></div> : <button className="atlas-action atlas-action-secondary" disabled={Boolean(endBusyId)} onClick={() => { setEndConfirmId(relationship.relationshipId); setFeedback(null); }} type="button">End relationship</button>}</div>
          </li>)}</ul> : <p className={styles.relationshipEmpty}>No Properties are currently connected to this Objective.</p>}
          {lifecycleGuard ? <p className={styles.lifecycleNotice}>End current Property relationships before completing or archiving this Objective.</p> : null}
          {feedback?.objectiveId === objective.id ? <p className={feedback.error ? styles.localizedError : styles.localizedStatus} role={feedback.error ? 'alert' : 'status'}>{feedback.message}</p> : null}
          {isDrafting ? <form className={styles.relationshipLinkForm} onSubmit={(event) => { event.preventDefault(); void link(objective); }}>
            <label className={styles.objectiveField} htmlFor={`relationship-property-${objective.id}`}><span>Client Property</span><select disabled={linkBusy} id={`relationship-property-${objective.id}`} value={draftPropertyId} onChange={(event) => setDraftPropertyId(event.target.value)}><option value="">Select a Client Property</option>{eligibleProperties.map((property) => <option key={property.id} value={property.id}>{propertyLabel(property)}{propertyContext(property) ? ` · ${propertyContext(property)}` : ''}</option>)}</select></label>
            <fieldset className={styles.relationshipRoleField} disabled={linkBusy}><legend>Relationship meaning</legend><label><input checked={draftRole === 'SUBJECT'} name={`relationship-role-${objective.id}`} onChange={() => setDraftRole('SUBJECT')} type="radio" value="SUBJECT" />Property being sold</label><label><input checked={draftRole === 'CANDIDATE'} name={`relationship-role-${objective.id}`} onChange={() => setDraftRole('CANDIDATE')} type="radio" value="CANDIDATE" />Property being considered</label></fieldset>
            <div className={styles.relationshipActions}><button className="atlas-action atlas-action-secondary" disabled={linkBusy} onClick={clearDraft} type="button"><X aria-hidden="true" size={16} />Clear selection</button><button className="atlas-action atlas-action-primary" disabled={linkBusy || !draftPropertyId || !draftRole} type="submit">{linkBusy ? 'Linking…' : 'Confirm Property'}</button></div>
            {!properties.length ? <p className={styles.relationshipEmpty}>Add a Client Property before linking it to this Objective. <Link href={`/agent/clients/${encodeURIComponent(clientCaseId)}/information#properties`}>Manage Properties</Link></p> : !eligibleProperties.length ? <p className={styles.relationshipEmpty}>Every Client Property is already current for this Objective.</p> : null}
          </form> : <div className={styles.relationshipActions}><button className="atlas-action atlas-action-secondary" disabled={!properties.length} onClick={() => openLink(objective)} type="button"><Plus aria-hidden="true" size={16} />Add Property</button>{!properties.length ? <Link className="atlas-action atlas-action-secondary" href={`/agent/clients/${encodeURIComponent(clientCaseId)}/information#properties`}><Home aria-hidden="true" size={16} />Manage Properties</Link> : null}</div>}
          <button aria-controls={`relationship-history-${objective.id}`} aria-expanded={historyState?.expanded ?? false} className={styles.historyToggle} onClick={() => void toggleHistory(objective.id)} type="button">Relationship history<ChevronDown aria-hidden="true" className={`${styles.chevron} ${historyState?.expanded ? styles.chevronExpanded : ''}`} size={16} /></button>
          {historyState?.expanded ? <div className={styles.relationshipHistory} id={`relationship-history-${objective.id}`}>{historyState.loading ? <p className={styles.localizedStatus} role="status"><LoaderCircle aria-hidden="true" className={styles.spin} size={16} />Loading history...</p> : historyState.error ? <p className={styles.localizedError} role="alert">{historyState.error}</p> : historyState.relationships?.length ? <ul>{historyState.relationships.map((relationship) => <li className={styles.historyRow} key={relationship.relationshipId}><div><strong>{relationship.property.label}</strong><span>{relationshipRoleLabel(relationship.role)} · linked {dateLabel(relationship.startedAt)} · ended {dateLabel(relationship.endedAt)}</span></div><button className="atlas-action atlas-action-secondary" onClick={() => openLink(objective, relationship.clientCasePropertyId)} type="button">Link again</button></li>)}</ul> : <p className={styles.relationshipEmpty}>No past Property relationships for this Objective.</p>}</div> : null}
        </div>
      </li>;
    })}
  </ul>;
}
