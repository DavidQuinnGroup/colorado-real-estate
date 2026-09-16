'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ClipboardCheck, LinkIcon, Plus, Save, UserPlus, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

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
import type { ClientCaseInformationIntent } from '@/lib/clientCaseInformationIntent';
import styles from './ClientCaseInformationWorkspace.module.css';

type ContextRecord = { id: string; semanticKey: string; value: unknown; sourcePosture: string; observedAt: string | null; effectiveAt: string | null; reviewAfter: string | null; createdAt: string };
type RelationshipRole = { id: string; role: string; status: 'ACTIVE' | 'ENDED'; startedAt: string; endedAt: string | null };
type PropertyRelation = {
  id: string;
  canonicalPropertyId: string;
  role: string;
  displayLabel?: string;
  activeRelationshipRoleLabels?: string[];
  legacyRoleReadBehavior?: string;
  canonicalProperty?: { sourceFormattedSitusAddress?: string | null; normalizedSitusAddress?: string | null; city?: string | null; state?: string | null; postalCode?: string | null };
  relationshipRoles?: RelationshipRole[];
  facts?: ContextRecord[];
  scenarioPropertyDispositions?: Array<{ id: string; disposition: string; scenarioVersion: { id: string; versionNumber: number; scenario: { id: string; name: string; currentVersionId: string | null } } }>;
};
type ObjectiveRecord = { id: string; objectiveType: string; status: string; title: string; archivedAt: string | null };
type ContactMethod = { id: string; kind: 'EMAIL' | 'PHONE'; displayValue: string; normalizedValue: string; isPrimary: boolean; lifecycleStatus: string };
type ContactRecord = { id: string; displayName: string; givenName: string | null; familyName: string | null; entityType: 'PERSON' | 'ORGANIZATION'; lifecycleStatus: string; methods: ContactMethod[] };
type ParticipationRecord = { id: string; role: string; displayLabel: string; participationStatus: string; contact: ContactRecord | null; advisoryRoles: Array<{ id: string; role: string }> };
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
  people: { contacts: ContactRecord[]; participations: ParticipationRecord[] };
  propertyRelationships?: {
    relationshipRoles: string[];
    currentLinkingMechanism: string;
    propertyDiscoveryUx: string;
    addressAutocomplete: string;
    offMarketDiscovery: string;
    provisionalPropertyCreate: string;
  };
  readinessPreview: Record<string, { status: string; missingPreliminary: string[]; missingComprehensive: string[]; helpfulMissing: string[] } | null>;
  error?: string;
};

const occupancyOptions = ['OWNER_OCCUPIED', 'TENANT_OCCUPIED', 'VACANT', 'UNKNOWN'];
const relationshipRoleOptions = ['CURRENT_HOME', 'TARGET_PRIMARY', 'INVESTMENT_PROPERTY', 'SALE_RELEVANT', 'OTHER'];

function errorMessage(payload: unknown) {
  return typeof payload === 'object' && payload && 'error' in payload && typeof payload.error === 'string' ? payload.error : 'Client Case information is unavailable.';
}

function formatMoney(value: unknown, key: 'minimumCents' | 'maximumCents') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '';
  const cents = (value as Record<string, unknown>)[key];
  return typeof cents === 'number' ? String(cents / 100) : '';
}

function propertyLabel(property: PropertyRelation) {
  return property.displayLabel || property.canonicalProperty?.sourceFormattedSitusAddress || property.canonicalProperty?.normalizedSitusAddress || property.canonicalPropertyId;
}

function humanize(value: string) {
  return value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function roleLabel(value: string) {
  if (value === 'CURRENT_HOME') return 'Current home';
  if (value === 'TARGET_PRIMARY') return 'Primary-home target';
  if (value === 'INVESTMENT_PROPERTY') return 'Investment property';
  if (value === 'SALE_RELEVANT') return 'Planning to sell';
  return 'Other property';
}

async function api(clientCaseId: string, body?: Record<string, unknown>) {
  const response = await fetch(`/api/agent/client-case-information?clientCaseId=${encodeURIComponent(clientCaseId)}`, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' });
  const payload = await response.json() as InformationResponse | { workspace?: InformationResponse };
  if (!response.ok) throw new Error(errorMessage(payload));
  return 'workspace' in payload && payload.workspace ? payload.workspace : payload as InformationResponse;
}

async function duplicateCandidates(clientCaseId: string, methods: Array<{ kind: string; displayValue: string; isPrimary: boolean }>) {
  const response = await fetch(`/api/agent/client-case-information?clientCaseId=${encodeURIComponent(clientCaseId)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'DUPLICATE_CANDIDATES', clientCaseId, input: { methods } }) });
  const payload = await response.json() as { candidates?: ContactRecord[]; error?: string };
  if (!response.ok) throw new Error(errorMessage(payload));
  return payload.candidates ?? [];
}

export function ClientCaseInformationWorkspace({ clientCaseId, intent }: { clientCaseId: string; intent: ClientCaseInformationIntent }) {
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
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEntityType, setContactEntityType] = useState<'PERSON' | 'ORGANIZATION'>('PERSON');
  const [participationRole, setParticipationRole] = useState('ADDITIONAL_CLIENT');
  const [advisoryRoles, setAdvisoryRoles] = useState<string[]>([]);
  const [linkContactId, setLinkContactId] = useState('');
  const [editContactId, setEditContactId] = useState('');
  const [editContactName, setEditContactName] = useState('');
  const [editContactEmail, setEditContactEmail] = useState('');
  const [editContactPhone, setEditContactPhone] = useState('');
  const [editContactEntityType, setEditContactEntityType] = useState<'PERSON' | 'ORGANIZATION'>('PERSON');
  const [duplicateState, setDuplicateState] = useState<ContactRecord[]>([]);
  const [canonicalPropertyId, setCanonicalPropertyId] = useState('');
  const [newPropertyRoles, setNewPropertyRoles] = useState<string[]>(['CURRENT_HOME']);
  const [roleDraft, setRoleDraft] = useState<Record<string, string>>({});

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
  const activeParticipations = workspace?.people.participations.filter((entry) => entry.participationStatus === 'ACTIVE') ?? [];
  const endedParticipations = workspace?.people.participations.filter((entry) => entry.participationStatus === 'ENDED') ?? [];
  const unlinkedContacts = workspace?.people.contacts.filter((contact) => !activeParticipations.some((party) => party.contact?.id === contact.id)) ?? [];
  const editableContacts = workspace?.people.contacts.filter((contact) => contact.lifecycleStatus === 'ACTIVE') ?? [];
  const propertySummary = workspace?.current.properties.length ? `${workspace.current.properties.length} linked · ${[...new Set(workspace.current.properties.flatMap((property) => property.activeRelationshipRoleLabels ?? property.relationshipRoles?.filter((entry) => entry.status === 'ACTIVE').map((entry) => roleLabel(entry.role)) ?? [roleLabel(property.role)]))].slice(0, 3).join(', ')}` : 'None linked';
  const summary = [
    ['Objectives', [buyerObjective ? 'Buyer decision' : null, financialObjective ? 'Financial strategy' : null].filter(Boolean).join(', ') || 'Not provided'],
    ['Properties', propertySummary],
    ['Target cities', cities.length ? cities.join(', ') : 'Not provided'],
    ['Stated purchase range', minimumDollars && maximumDollars ? `$${Number(minimumDollars).toLocaleString()} - $${Number(maximumDollars).toLocaleString()}` : 'Not provided'],
    ['Minimum bedrooms', minBedrooms || 'Not provided'],
  ] as const;

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

  function contactMethods() {
    return [
      ...(contactEmail.trim() ? [{ kind: 'EMAIL', displayValue: contactEmail, isPrimary: true }] : []),
      ...(contactPhone.trim() ? [{ kind: 'PHONE', displayValue: contactPhone, isPrimary: !contactEmail.trim() }] : []),
    ];
  }

  function buildMethods(email: string, phone: string) {
    return [
      ...(email.trim() ? [{ kind: 'EMAIL', displayValue: email, isPrimary: true }] : []),
      ...(phone.trim() ? [{ kind: 'PHONE', displayValue: phone, isPrimary: !email.trim() }] : []),
    ];
  }

  function toggleAdvisoryRole(role: string) {
    setAdvisoryRoles((current) => current.includes(role) ? current.filter((entry) => entry !== role) : [...current, role]);
  }

  async function checkDuplicates() {
    setStatus(null);
    try {
      setDuplicateState(await duplicateCandidates(clientCaseId, contactMethods()));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Duplicate candidates are unavailable.');
    }
  }

  async function createPerson() {
    if (!workspace) return;
    setSaving(true);
    setStatus(null);
    try {
      const payload = await api(clientCaseId, {
        action: 'CREATE_CONTACT_PARTICIPATION',
        clientCaseId,
        input: {
          contact: { displayName: contactName, entityType: contactEntityType, methods: contactMethods() },
          participation: { role: participationRole, advisoryRoles },
        },
      });
      setWorkspace(payload);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setAdvisoryRoles([]);
      setDuplicateState([]);
      setStatus('Contact and Case participation saved. Duplicate candidates are advisory only; no Contact was merged silently.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Contact could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  async function linkExistingContact() {
    if (!workspace || !linkContactId) return;
    setSaving(true);
    setStatus(null);
    try {
      setWorkspace(await api(clientCaseId, { action: 'LINK_CONTACT', clientCaseId, input: { contactId: linkContactId, participation: { role: participationRole, advisoryRoles } } }));
      setLinkContactId('');
      setAdvisoryRoles([]);
      setStatus('Existing authorized Contact linked to this Client Case.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Contact could not be linked.');
    } finally {
      setSaving(false);
    }
  }

  function selectEditableContact(contactId: string) {
    setEditContactId(contactId);
    const contact = workspace?.people.contacts.find((entry) => entry.id === contactId);
    setEditContactName(contact?.displayName ?? '');
    setEditContactEntityType(contact?.entityType ?? 'PERSON');
    setEditContactEmail(contact?.methods.find((method) => method.kind === 'EMAIL')?.displayValue ?? '');
    setEditContactPhone(contact?.methods.find((method) => method.kind === 'PHONE')?.displayValue ?? '');
  }

  async function updateContact() {
    if (!workspace || !editContactId) return;
    setSaving(true);
    setStatus(null);
    try {
      setWorkspace(await api(clientCaseId, {
        action: 'UPDATE_CONTACT',
        clientCaseId,
        contactId: editContactId,
        input: { displayName: editContactName, entityType: editContactEntityType, methods: buildMethods(editContactEmail, editContactPhone) },
      }));
      setStatus('Contact identity updated for authorized future use. Existing Case participation history was preserved.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Contact could not be updated.');
    } finally {
      setSaving(false);
    }
  }

  async function endParticipation(clientCasePartyId: string) {
    if (!workspace) return;
    setSaving(true);
    setStatus(null);
    try {
      setWorkspace(await api(clientCaseId, { action: 'END_PARTICIPATION', clientCaseId, clientCasePartyId }));
      setStatus('Participation ended. The durable Contact identity remains available for authorized future use.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Participation could not be ended.');
    } finally {
      setSaving(false);
    }
  }

  function toggleNewPropertyRole(role: string) {
    setNewPropertyRoles((current) => current.includes(role) ? current.filter((entry) => entry !== role) : [...current, role]);
  }

  async function attachProperty(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workspace || !canonicalPropertyId.trim() || !newPropertyRoles.length) return;
    setSaving(true);
    setStatus(null);
    try {
      const payload = await api(clientCaseId, { action: 'ATTACH_EXISTING_PROPERTY', clientCaseId, input: { canonicalPropertyId, roles: newPropertyRoles } });
      setWorkspace(payload);
      setCanonicalPropertyId('');
      setNewPropertyRoles(['CURRENT_HOME']);
      setStatus('Property relationship saved. Existing canonical Property identity was linked without external lookup.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Property relationship could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  async function addRelationshipRole(clientCasePropertyId: string) {
    const nextRole = roleDraft[clientCasePropertyId];
    if (!workspace || !nextRole) return;
    setSaving(true);
    setStatus(null);
    try {
      setWorkspace(await api(clientCaseId, { action: 'ADD_PROPERTY_RELATIONSHIP_ROLE', clientCaseId, clientCasePropertyId, input: { role: nextRole } }));
      setRoleDraft((current) => ({ ...current, [clientCasePropertyId]: '' }));
      setStatus('Relationship role added. Scenario dispositions and Transactions were not changed.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Relationship role could not be added.');
    } finally {
      setSaving(false);
    }
  }

  async function endRelationshipRole(relationshipRoleId: string) {
    if (!workspace) return;
    setSaving(true);
    setStatus(null);
    try {
      setWorkspace(await api(clientCaseId, { action: 'END_PROPERTY_RELATIONSHIP_ROLE', clientCaseId, relationshipRoleId }));
      setStatus('Relationship role ended and preserved in history. The Property anchor remains linked.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Relationship role could not be ended.');
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
        <AtlasNotice className={styles.canonicalBoundaryNotice} title="Canonical boundary" tone="information">Use this page for factual or generally applicable Client Case information. Target acquisition price, down payment, cash allocation, holding period, hypothetical city or bedroom overrides, and sell/retain/rent alternatives remain Scenario Version inputs.</AtlasNotice>

        <nav className={styles.sectionNav} aria-label="Client Information sections">
          {['Case overview', 'People', 'Goals', 'Properties', 'Current information', 'Readiness'].map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</a>)}
        </nav>

        <AtlasSurface material="floating" data-testid="client-case-information-case-overview" id="case-overview">
          <div className={styles.panelHeading}><div><h2 className="atlas-ds-major-section">Case Overview</h2><p className={styles.metadata}>Client Information keeps durable case context separate from CRM activity, Scenario assumptions, Transaction files, and Outputs.</p></div><AtlasInformationClassLabel informationClass="governed-fact" /></div>
          <ul className={styles.summaryList}>
            <li className={styles.summaryItem}><p className={styles.summaryLabel}>Client Case</p><p className={styles.summaryValue}>{workspace.clientCase.displayName}</p></li>
            <li className={styles.summaryItem}><p className={styles.summaryLabel}>Active participants</p><p className={styles.summaryValue}>{activeParticipations.length || 'None yet'}</p></li>
            <li className={styles.summaryItem}><p className={styles.summaryLabel}>Linked properties</p><p className={styles.summaryValue}>{workspace.current.properties.length ? `${workspace.current.properties.length} linked` : 'None yet'}</p>{workspace.current.properties.length ? <p className={styles.optionDescription}>{workspace.current.properties.flatMap((property) => property.activeRelationshipRoleLabels ?? []).slice(0, 4).join(' · ') || 'Relationship roles pending migration fallback'}</p> : null}</li>
          </ul>
        </AtlasSurface>

        <AtlasSurface material="floating" data-testid="client-case-information-people" id="people">
          <div className={styles.panelHeading}><div><h2 className="atlas-ds-major-section">People</h2><p className={styles.metadata}>Contacts are durable identities. Case participation describes how a Contact is involved here.</p></div><AtlasInformationClassLabel informationClass="governed-fact" label="Owner scoped" /></div>
          <ul className={styles.peopleList}>{activeParticipations.length ? activeParticipations.map((party) => <li className={styles.personItem} key={party.id}><div><p className={styles.optionTitle}>{party.contact?.displayName ?? party.displayLabel}</p><p className={styles.optionDescription}>{party.role.replaceAll('_', ' ')} · {party.advisoryRoles.map((role) => role.role.replaceAll('_', ' ')).join(', ') || 'No advisory role yet'}</p><p className={styles.optionDescription}>{party.contact?.methods.map((method) => `${method.kind.toLowerCase()}: ${method.displayValue}`).join(' · ') || 'No contact method'}</p></div><AtlasButton disabled={saving} tone="ghost" onClick={() => void endParticipation(party.id)}>End participation</AtlasButton></li>) : <li><AtlasEmptyState title="No active people"><p>Add or link an authorized Contact before assigning advisory roles.</p></AtlasEmptyState></li>}</ul>
          {endedParticipations.length ? <p className={styles.metadata}>{endedParticipations.length} ended participation record{endedParticipations.length === 1 ? '' : 's'} preserved for history.</p> : null}
          <div className={styles.peopleEditor}>
            <div className={styles.fieldGrid}>
              <AtlasField htmlFor="contact-name" label="Display name"><input className={styles.input} id="contact-name" maxLength={160} value={contactName} onChange={(event) => setContactName(event.target.value)} /></AtlasField>
              <AtlasField htmlFor="contact-type" label="Identity type"><select className={styles.select} id="contact-type" value={contactEntityType} onChange={(event) => setContactEntityType(event.target.value as 'PERSON' | 'ORGANIZATION')}><option value="PERSON">Person</option><option value="ORGANIZATION">Organization / entity</option></select></AtlasField>
              <AtlasField htmlFor="contact-email" label="Email"><input className={styles.input} id="contact-email" inputMode="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} /></AtlasField>
              <AtlasField htmlFor="contact-phone" label="Phone"><input className={styles.input} id="contact-phone" inputMode="tel" value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} /></AtlasField>
              <AtlasField htmlFor="participation-role" label="Case participation"><select className={styles.select} id="participation-role" value={participationRole} onChange={(event) => setParticipationRole(event.target.value)}><option value="PRIMARY_CLIENT">Primary client</option><option value="ADDITIONAL_CLIENT">Co-client / co-participant</option><option value="OTHER_PARTY">Other relevant party</option></select></AtlasField>
              <div className={styles.rolePicker} aria-label="Advisory roles">{['BUYER', 'SELLER', 'INVESTOR', 'AUTHORIZED_PARTICIPANT', 'CO_PARTICIPANT'].map((role) => <label className={styles.roleCheck} key={role}><input checked={advisoryRoles.includes(role)} type="checkbox" onChange={() => toggleAdvisoryRole(role)} />{role.replaceAll('_', ' ')}</label>)}</div>
            </div>
            {duplicateState.length ? <AtlasNotice title="Possible duplicate Contacts" tone="attention"><ul className={styles.compactList}>{duplicateState.map((candidate) => <li key={candidate.id}>{candidate.displayName} · {candidate.methods.map((method) => method.displayValue).join(', ')}</li>)}</ul><p>Review only. PROJECT ATLAS did not merge these Contacts.</p></AtlasNotice> : null}
            <div className={styles.actions}><AtlasButton disabled={saving || !contactName.trim()} tone="secondary" onClick={() => void checkDuplicates()}><ClipboardCheck size={16} />Check duplicates</AtlasButton><AtlasButton disabled={saving || !contactName.trim()} onClick={() => void createPerson()}><UserPlus size={16} />Add Contact to Case</AtlasButton></div>
          </div>
          {unlinkedContacts.length ? <div className={styles.linkExisting}><AtlasField htmlFor="existing-contact" label="Link existing authorized Contact"><select className={styles.select} id="existing-contact" value={linkContactId} onChange={(event) => setLinkContactId(event.target.value)}><option value="">Select a Contact</option>{unlinkedContacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.displayName}</option>)}</select></AtlasField><AtlasButton disabled={saving || !linkContactId} tone="secondary" onClick={() => void linkExistingContact()}><LinkIcon size={16} />Link to Case</AtlasButton></div> : null}
          {editableContacts.length ? <div className={styles.peopleEditor}>
            <div className={styles.panelHeading}><div><h3 className={styles.optionTitle}>Edit authorized Contact</h3><p className={styles.metadata}>Updates Contact identity and active methods. Case participation history stays intact.</p></div></div>
            <div className={styles.fieldGrid}>
              <AtlasField htmlFor="edit-contact" label="Contact"><select className={styles.select} id="edit-contact" value={editContactId} onChange={(event) => selectEditableContact(event.target.value)}><option value="">Select a Contact</option>{editableContacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.displayName}</option>)}</select></AtlasField>
              <AtlasField htmlFor="edit-contact-type" label="Identity type"><select className={styles.select} disabled={!editContactId} id="edit-contact-type" value={editContactEntityType} onChange={(event) => setEditContactEntityType(event.target.value as 'PERSON' | 'ORGANIZATION')}><option value="PERSON">Person</option><option value="ORGANIZATION">Organization / entity</option></select></AtlasField>
              <AtlasField htmlFor="edit-contact-name" label="Display name"><input className={styles.input} disabled={!editContactId} id="edit-contact-name" maxLength={160} value={editContactName} onChange={(event) => setEditContactName(event.target.value)} /></AtlasField>
              <AtlasField htmlFor="edit-contact-email" label="Email"><input className={styles.input} disabled={!editContactId} id="edit-contact-email" inputMode="email" value={editContactEmail} onChange={(event) => setEditContactEmail(event.target.value)} /></AtlasField>
              <AtlasField htmlFor="edit-contact-phone" label="Phone"><input className={styles.input} disabled={!editContactId} id="edit-contact-phone" inputMode="tel" value={editContactPhone} onChange={(event) => setEditContactPhone(event.target.value)} /></AtlasField>
            </div>
            <div className={styles.actions}><AtlasButton disabled={saving || !editContactId || !editContactName.trim()} tone="secondary" onClick={() => void updateContact()}><Save size={16} />Update Contact</AtlasButton></div>
          </div> : null}
        </AtlasSurface>

        <div className={styles.sectionGrid} id="goals">
          <AtlasSurface className={intent === 'objectives' ? styles.intent : undefined} material="glass" data-testid="client-case-information-objectives">
            <div className={styles.panelHeading}><div><h2 className="atlas-ds-major-section">Objectives</h2><p className={styles.metadata}>Ordinary objective lifecycle records, not immutable fact revisions.</p></div><AtlasInformationClassLabel informationClass="governed-fact" /></div>
            <div className={styles.objectiveList}>
              <label className={styles.objectiveOption}><input checked={buyerObjective} onChange={(event) => setBuyerObjective(event.target.checked)} type="checkbox" /><span className={styles.optionText}><span className={styles.optionTitle}>Buyer decision objective</span><span className={styles.optionDescription}>Enables buyer criteria such as price range and minimum bedrooms.</span></span></label>
              <label className={styles.objectiveOption}><input checked={financialObjective} onChange={(event) => setFinancialObjective(event.target.checked)} type="checkbox" /><span className={styles.optionText}><span className={styles.optionTitle}>Financial strategy objective</span><span className={styles.optionDescription}>Supports Financial Strategy readiness without storing scenario assumptions.</span></span></label>
            </div>
          </AtlasSurface>

          <AtlasSurface className={intent === 'target-cities' || intent === 'purchase-price-range' || intent === 'min-bedrooms' ? styles.intent : undefined} material="glass" data-testid="client-case-information-buyer-criteria" id="current-information">
            <div className={styles.panelHeading}><div><h2 className="atlas-ds-major-section">Buyer Criteria</h2><p className={styles.metadata}>Only current canonical criteria registered in the repository. Stated purchase range is a preference, not demonstrated affordability.</p></div><AtlasInformationClassLabel informationClass="governed-fact" /></div>
            <form className={styles.fieldGrid} onSubmit={addCity}>
              <AtlasField htmlFor="target-city" label="Target cities"><input className={styles.input} id="target-city" maxLength={80} placeholder="Add a city" value={cityDraft} onChange={(event) => setCityDraft(event.target.value)} /></AtlasField>
              <div className={styles.actions}><AtlasButton tone="secondary" type="submit"><Plus size={16} />Add city</AtlasButton></div>
            </form>
            <div className={styles.citiesRow}>{cities.length ? cities.map((city) => <span className={styles.cityChip} key={city}>{city}<button aria-label={`Remove ${city}`} type="button" onClick={() => setCities((current) => current.filter((item) => item !== city))}><X size={14} /></button></span>) : <p className={styles.emptyText}>Not provided.</p>}</div>
            <div className={styles.fieldGrid}>
              <div className={styles.rangeGrid}>
                <AtlasField htmlFor="minimum-dollars" label="Minimum stated purchase price"><input className={styles.input} id="minimum-dollars" inputMode="decimal" placeholder="500000" value={minimumDollars} onChange={(event) => setMinimumDollars(event.target.value)} /></AtlasField>
                <AtlasField htmlFor="maximum-dollars" label="Maximum stated purchase price"><input className={styles.input} id="maximum-dollars" inputMode="decimal" placeholder="750000" value={maximumDollars} onChange={(event) => setMaximumDollars(event.target.value)} /></AtlasField>
              </div>
              <AtlasField description={activeBuyerObjective ? undefined : 'Save the Buyer decision objective before saving objective-scoped buyer criteria.'} htmlFor="min-bedrooms" label="Minimum bedrooms"><input className={styles.input} id="min-bedrooms" inputMode="numeric" min="0" type="number" value={minBedrooms} onChange={(event) => setMinBedrooms(event.target.value)} /></AtlasField>
            </div>
          </AtlasSurface>
        </div>

        <AtlasSurface material="floating" data-testid="client-case-information-properties" id="properties">
          <div className={styles.panelHeading}><div><h2 className="atlas-ds-major-section">Properties</h2><p className={styles.metadata}>Link existing canonical physical Properties and manage durable Case relationship roles. Address autocomplete, off-market discovery, provider lookup, and provisional Property creation are deferred.</p></div><AtlasInformationClassLabel informationClass="governed-fact" label="Wave B" /></div>
          <AtlasNotice title="Property discovery boundary" tone="information">Current linking mechanism: explicit canonical Property ID. Agent-friendly property search is foundation-only in this wave.</AtlasNotice>
          <form className={styles.propertyLinkForm} onSubmit={attachProperty}>
            <AtlasField htmlFor="canonical-property-id" label="Canonical physical Property ID"><input className={styles.input} id="canonical-property-id" maxLength={160} value={canonicalPropertyId} onChange={(event) => setCanonicalPropertyId(event.target.value)} placeholder="CanonicalPhysicalProperty ID" /></AtlasField>
            <div className={styles.rolePicker} aria-label="Initial relationship roles">{relationshipRoleOptions.map((option) => <label className={styles.roleCheck} key={option}><input checked={newPropertyRoles.includes(option)} type="checkbox" onChange={() => toggleNewPropertyRole(option)} />{roleLabel(option)}</label>)}</div>
            <div className={styles.actions}><AtlasButton disabled={saving || !canonicalPropertyId.trim() || !newPropertyRoles.length} type="submit"><Plus size={16} />Add / Link Property</AtlasButton></div>
          </form>
          {workspace.current.properties.length ? <div className={styles.propertyCardGrid}>{workspace.current.properties.map((property) => {
            const activeRoles = property.relationshipRoles?.filter((entry) => entry.status === 'ACTIVE') ?? [];
            const endedRoles = property.relationshipRoles?.filter((entry) => entry.status === 'ENDED') ?? [];
            const currentOccupancy = workspace.current.propertyOccupancy.find((entry) => entry.clientCasePropertyId === property.id)?.current;
            return (
              <article className={styles.propertyCard} key={property.id} data-client-case-property-card="true">
                <div className={styles.panelHeading}><div><p className={styles.propertyLabel}>Property identity</p><h3 className={styles.propertyTitle}>{propertyLabel(property)}</h3></div><Link className={styles.link} href={`/agent/clients/${encodeURIComponent(clientCaseId)}/readiness`}>View Readiness</Link></div>
                <div className={styles.roleChipRow}>{activeRoles.length ? activeRoles.map((entry) => <span className={styles.roleChip} key={entry.id}>{roleLabel(entry.role)}</span>) : <span className={styles.roleChip}>{roleLabel(property.role)}</span>}</div>
                <div className={styles.propertyMetaGrid}>
                  <div><p className={styles.summaryLabel}>Occupancy</p><p className={styles.summaryValue}>{typeof currentOccupancy?.value === 'string' ? humanize(currentOccupancy.value) : 'Not provided'}</p></div>
                  <div><p className={styles.summaryLabel}>Scenario overlay</p><p className={styles.summaryValue}>{property.scenarioPropertyDispositions?.length ? property.scenarioPropertyDispositions.map((entry) => `Scenario: ${humanize(entry.disposition)}`).join(' · ') : 'No selected Scenario disposition shown'}</p></div>
                  <div><p className={styles.summaryLabel}>Transactions</p><p className={styles.summaryValue}>Operational state remains in Transactions</p></div>
                </div>
                <AtlasField htmlFor={`property-occupancy-${property.id}`} label="Edit occupancy"><select className={styles.select} id={`property-occupancy-${property.id}`} value={occupancy[property.id] ?? ''} onChange={(event) => setOccupancy((current) => ({ ...current, [property.id]: event.target.value }))}><option value="">Not provided</option>{occupancyOptions.map((option) => <option key={option} value={option}>{humanize(option)}</option>)}</select></AtlasField>
                <div className={styles.relationshipActions}>
                  <AtlasField htmlFor={`role-${property.id}`} label="Add relationship role"><select className={styles.select} id={`role-${property.id}`} value={roleDraft[property.id] ?? ''} onChange={(event) => setRoleDraft((current) => ({ ...current, [property.id]: event.target.value }))}><option value="">Select role</option>{relationshipRoleOptions.map((option) => <option key={option} value={option}>{roleLabel(option)}</option>)}</select></AtlasField>
                  <AtlasButton disabled={saving || !roleDraft[property.id]} tone="secondary" onClick={() => void addRelationshipRole(property.id)}>Add Role</AtlasButton>
                </div>
                {activeRoles.length ? <div className={styles.relationshipHistory}><p className={styles.summaryLabel}>Active relationships</p>{activeRoles.map((entry) => <div className={styles.historyRow} key={entry.id}><span>{roleLabel(entry.role)}</span><AtlasButton disabled={saving} tone="ghost" onClick={() => void endRelationshipRole(entry.id)}>End role</AtlasButton></div>)}</div> : null}
                {endedRoles.length ? <div className={styles.relationshipHistory}><p className={styles.summaryLabel}>Relationship history</p>{endedRoles.map((entry) => <p className={styles.optionDescription} key={entry.id}>{roleLabel(entry.role)} ended {entry.endedAt ? new Date(entry.endedAt).toLocaleDateString() : 'previously'}</p>)}</div> : null}
              </article>
            );
          })}</div> : <AtlasEmptyState title="No linked properties"><p>Add an existing canonical physical Property when a specific Property becomes part of the Client Case. Criteria such as target cities and bedrooms do not create Property anchors.</p></AtlasEmptyState>}
        </AtlasSurface>

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

        <div className={styles.sectionGrid} id="readiness">
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
