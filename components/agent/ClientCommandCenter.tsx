'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Home, LoaderCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ClientCommandCenterSection } from './ClientCommandCenterSection';
import { clientCommandCenterSections, clientCommandCenterSectionsFromIntent, formatCount, formatInformationValue, formatTransactionSectionSummary, formatTransactionSummary, humanize, propertyLabel, type ClientCaseSummary, type ClientCommandCenterSectionId, type InformationWorkspaceSummary, type OutputSummary } from './clientCommandCenterTypes';
import styles from './ClientCommandCenter.module.css';

type SectionData<T> = { clientCaseId: string | null; value: T | null; error: string | null };
const pending = <p className={styles.localizedStatus} role="status"><LoaderCircle aria-hidden="true" className={styles.spin} size={16} />Loading this section...</p>;

function dateTime(value: string) { return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
function sectionHref(clientCaseId: string, section: ClientCommandCenterSectionId) { return `/agent/clients/${encodeURIComponent(clientCaseId)}?section=${section}`; }
function domainHref(path: string, clientCaseId: string) { return `${path}?clientCaseId=${encodeURIComponent(clientCaseId)}`; }

export default function ClientCommandCenter({ clientCaseId }: { clientCaseId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [clientCase, setClientCase] = useState<ClientCaseSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [information, setInformation] = useState<SectionData<InformationWorkspaceSummary>>({ clientCaseId: null, value: null, error: null });
  const [outputs, setOutputs] = useState<SectionData<OutputSummary[]>>({ clientCaseId: null, value: null, error: null });
  const informationRequestCaseId = useRef<string | null>(null);
  const outputRequestCaseId = useRef<string | null>(null);
  const expanded = useMemo(() => clientCommandCenterSectionsFromIntent(searchParams.get('section')), [searchParams]);

  useEffect(() => {
    let active = true;
    void fetch(`/api/agent/client-cases?id=${encodeURIComponent(clientCaseId)}`, { cache: 'no-store' }).then(async (response) => {
      const payload = await response.json() as { clientCase?: ClientCaseSummary; error?: string };
      if (!response.ok || !payload.clientCase) throw new Error(payload.error || 'This Client is unavailable.');
      return payload.clientCase;
    }).then((value) => { if (active) setClientCase(value); }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : 'This Client is unavailable.'); });
    return () => { active = false; };
  }, [clientCaseId]);

  useEffect(() => {
    const needsInformation = ['goals', 'information', 'readiness'].some((section) => expanded.has(section as ClientCommandCenterSectionId));
    const currentInformation = information.clientCaseId === clientCaseId ? information : null;
    if (!needsInformation || currentInformation?.value || currentInformation?.error || informationRequestCaseId.current === clientCaseId) return;
    informationRequestCaseId.current = clientCaseId;
    void fetch(`/api/agent/client-case-information?clientCaseId=${encodeURIComponent(clientCaseId)}`, { cache: 'no-store' }).then(async (response) => {
      const payload = await response.json() as InformationWorkspaceSummary & { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Current information is unavailable.');
      return payload;
    }).then((value) => setInformation({ clientCaseId, value, error: null })).catch((reason) => setInformation({ clientCaseId, value: null, error: reason instanceof Error ? reason.message : 'Current information is unavailable.' }));
  }, [clientCaseId, expanded, information]);

  useEffect(() => {
    const currentOutputs = outputs.clientCaseId === clientCaseId ? outputs : null;
    if (!expanded.has('outputs') || currentOutputs?.value || currentOutputs?.error || outputRequestCaseId.current === clientCaseId) return;
    outputRequestCaseId.current = clientCaseId;
    void fetch(`/api/agent/outputs?clientCaseId=${encodeURIComponent(clientCaseId)}`, { cache: 'no-store' }).then(async (response) => {
      const payload = await response.json() as { products?: OutputSummary[]; error?: string };
      if (!response.ok) throw new Error(payload.error || 'Outputs are unavailable.');
      return payload.products || [];
    }).then((value) => setOutputs({ clientCaseId, value, error: null })).catch((reason) => setOutputs({ clientCaseId, value: null, error: reason instanceof Error ? reason.message : 'Outputs are unavailable.' }));
  }, [clientCaseId, expanded, outputs]);

  function toggleSection(section: ClientCommandCenterSectionId) {
    const currentlyOpen = expanded.has(section);
    const next = new Set(expanded);
    if (currentlyOpen) next.delete(section); else next.add(section);
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set('section', next.size ? [...next].join(',') : 'none');
    router.push(`${pathname}${nextParams.size ? `?${nextParams.toString()}` : ''}`, { scroll: false });
  }

  const currentInformation = information.clientCaseId === clientCaseId ? information : null;
  const currentOutputs = outputs.clientCaseId === clientCaseId ? outputs : null;
  const isExpanded = (section: ClientCommandCenterSectionId) => expanded.has(section);
  const objectives = useMemo(() => {
    if (!currentInformation?.value) return 'Open to review goals.';
    const labels = [currentInformation.value.current.objectives.BUY_PRIMARY_HOME ? 'Buyer decision' : null, currentInformation.value.current.objectives.FINANCIAL_STRATEGY ? 'Financial strategy' : null].filter(Boolean);
    return labels.length ? labels.join(' · ') : 'No supported goals recorded.';
  }, [currentInformation?.value]);

  if (error) return <main className={styles.page}><div className={styles.container}><p className="atlas-workspace-status" role="alert">{error}</p><Link className={styles.utilityLink} href="/agent/clients"><ArrowLeft aria-hidden="true" size={16} />Back to Clients</Link></div></main>;
  if (!clientCase) return <main className={styles.page}><div className={styles.container}><p className={styles.loading} role="status">Loading Client workspace...</p></div></main>;

  const informationHref = `/agent/clients/${encodeURIComponent(clientCase.id)}/information`;
  const readinessHref = `/agent/clients/${encodeURIComponent(clientCase.id)}/readiness`;
  const launch = (label: string, href: string) => <Link className="atlas-action atlas-action-secondary" href={href}>{label}<ArrowUpRight aria-hidden="true" size={16} /></Link>;
  const section = (id: ClientCommandCenterSectionId, title: string, summary: string, action: ReactNode, content: ReactNode) => <ClientCommandCenterSection action={action} expanded={isExpanded(id)} id={id} key={id} onToggle={toggleSection} summary={summary} title={title}>{content}</ClientCommandCenterSection>;

  return <main className={styles.page} data-testid="client-command-center"><div className={styles.container}>
    <header className={styles.commandHeader}><div className={styles.headerLinks}><Link className={styles.utilityLink} href="/agent/clients"><ArrowLeft aria-hidden="true" size={16} />Back to Clients</Link><Link className={styles.utilityLink} href="/agent"><Home aria-hidden="true" size={16} />Workspace Home</Link></div><p className={styles.eyebrow}>Client workspace</p><h1 className={styles.commandTitle}>{clientCase.displayName}</h1><div className={styles.headerMeta}><span>{clientCase.status === 'ACTIVE' ? 'Active' : clientCase.status}</span><span>{clientCase.parties.length ? clientCase.parties.map((party) => party.displayLabel).join(' · ') : 'No participants recorded'}</span><span>Updated {dateTime(clientCase.updatedAt)}</span></div></header>
    <div className={styles.sectionList}>
      {section('overview', 'Overview', `${formatCount(clientCase.parties.length, 'person', 'people')} · ${formatCount(clientCase.properties.length, 'property', 'properties')} · ${formatCount(clientCase.transactionSummary.totalTransactionCount, 'transaction', 'transactions')}`, launch('View information', informationHref), <div className={styles.overviewGrid}><div><span>People</span><strong>{clientCase.parties.length || 'None recorded'}</strong></div><div><span>Properties</span><strong>{clientCase.properties.length || 'None recorded'}</strong></div><div><span>Transactions</span><strong>{formatTransactionSummary(clientCase.transactionSummary)}</strong></div><div><span>Readiness</span><strong>{currentInformation?.value ? 'Available below' : 'Open Readiness to review'}</strong></div></div>)}
      {section('people', 'People', clientCase.parties.length ? clientCase.parties.map((party) => party.displayLabel).join(' · ') : 'No participants recorded.', launch('Manage people', `${informationHref}?requirement=PEOPLE`), <div className={styles.detailList}>{clientCase.parties.length ? clientCase.parties.map((party) => <p key={party.id}><strong>{party.displayLabel}</strong><span>{humanize(party.role)}</span></p>) : <p>No participants are recorded for this Client.</p>}<p className={styles.detailNote}>Contact details remain in the Client Information workspace.</p></div>)}
      {section('goals', 'Objectives and goals', objectives, launch('Manage goals', `${informationHref}?requirement=OBJECTIVES`), !currentInformation?.value && !currentInformation?.error ? pending : currentInformation.error ? <p className={styles.localizedError} role="alert">{currentInformation.error}</p> : <div className={styles.detailList}><p><strong>Buyer decision</strong><span>{currentInformation.value?.current.objectives.BUY_PRIMARY_HOME ? 'Active' : 'Not recorded'}</span></p><p><strong>Financial strategy</strong><span>{currentInformation.value?.current.objectives.FINANCIAL_STRATEGY ? 'Active' : 'Not recorded'}</span></p><p className={styles.detailNote}>Additional client objectives remain available when their owning model supports them.</p></div>)}
      {section('properties', 'Properties', clientCase.properties.length ? `${clientCase.properties.length} linked ${clientCase.properties.length === 1 ? 'property' : 'properties'}.` : 'No properties linked.', launch('Manage properties', `${informationHref}?requirement=PROPERTIES`), <div className={styles.detailList}>{clientCase.properties.length ? clientCase.properties.map((property) => <p key={property.id}><strong>{propertyLabel(property)}</strong><span>{humanize(property.role)}</span></p>) : <p>No properties are linked to this Client.</p>}<p className={styles.detailNote}>Property search and relationships remain in Client Information.</p></div>)}
      {section('information', 'Current information', currentInformation?.value ? `${formatInformationValue(currentInformation.value.current.targetCities?.value)}${currentInformation.value.current.purchasePriceRange ? ' · Context recorded' : ''}` : 'Open to review current context.', launch('Open information', informationHref), !currentInformation?.value && !currentInformation?.error ? pending : currentInformation.error ? <p className={styles.localizedError} role="alert">{currentInformation.error}</p> : <div className={styles.overviewGrid}><div><span>Target cities</span><strong>{formatInformationValue(currentInformation.value?.current.targetCities?.value)}</strong></div><div><span>Purchase range</span><strong>{formatInformationValue(currentInformation.value?.current.purchasePriceRange?.value)}</strong></div><div><span>Minimum bedrooms</span><strong>{formatInformationValue(currentInformation.value?.current.minBedrooms?.value)}</strong></div></div>)}
      {section('readiness', 'Readiness', currentInformation?.value ? Object.values(currentInformation.value.readinessPreview).filter(Boolean).map((entry) => humanize(entry!.status)).join(' · ') || 'Select a capability to check.' : 'Select a capability to check.', launch('View readiness', readinessHref), !currentInformation?.value && !currentInformation?.error ? pending : currentInformation.error ? <p className={styles.localizedError} role="alert">{currentInformation.error}</p> : <div className={styles.detailList}>{Object.entries(currentInformation.value?.readinessPreview || {}).map(([capability, result]) => <p key={capability}><strong>{humanize(capability)}</strong><span>{result ? `${humanize(result.status)}${result.missingPreliminary.length ? ` · ${result.missingPreliminary.length} preliminary item${result.missingPreliminary.length === 1 ? '' : 's'} needed` : ''}` : 'Check unavailable'}</span></p>)}<p className={styles.detailNote}>Readiness remains computed and is never stored by this workspace.</p></div>)}
      {section('buyer', 'Buyer', 'Open the existing buyer workspace with this Client in context.', launch('Open Buyer', domainHref('/agent/prepare/buyer', clientCase.id)), <p className={styles.detailNote}>Buyer preparation remains in its established workspace.</p>)}
      {section('seller', 'Seller', 'Open the existing seller workspace with this Client in context.', launch('Open Seller', domainHref('/agent/prepare/seller', clientCase.id)), <p className={styles.detailNote}>Seller preparation remains in its established workspace.</p>)}
      {section('financial', 'Financial strategy', 'Open the current strategy workspace with this Client in context.', launch('Open Financial Strategy', domainHref('/agent/strategy', clientCase.id)), <p className={styles.detailNote}>Financial Position is not part of this workspace.</p>)}
      {section('intelligence', 'Intelligence', 'Open the existing intelligence workspace with this Client in context.', launch('Open Intelligence', domainHref('/agent/prepare', clientCase.id)), <p className={styles.detailNote}>Intelligence remains a separate governed workspace.</p>)}
      {section('transactions', 'Transactions', formatTransactionSectionSummary(clientCase.transactionSummary), launch('Open Transactions', domainHref('/agent/transactions', clientCase.id)), <div className={styles.detailList}>{clientCase.transactions.length ? clientCase.transactions.map((transaction) => <p key={transaction.id}><Link href={`/agent/transactions/${encodeURIComponent(transaction.id)}?clientCaseId=${encodeURIComponent(clientCase.id)}`}>{transaction.label}</Link><span>{humanize(transaction.side)} · {humanize(transaction.status)} · {humanize(transaction.stage)}</span></p>) : <p>No transactions are linked to this Client.</p>}</div>)}
      {section('outputs', 'Outputs', currentOutputs?.value ? `${currentOutputs.value.length} ${currentOutputs.value.length === 1 ? 'output' : 'outputs'}.` : 'Open to review Client outputs.', launch('Open Outputs', domainHref('/agent/outputs', clientCase.id)), !currentOutputs?.value && !currentOutputs?.error ? pending : currentOutputs.error ? <p className={styles.localizedError} role="alert">{currentOutputs.error}</p> : <div className={styles.detailList}>{currentOutputs.value?.length ? currentOutputs.value.map((output) => <p key={output.id}><strong>{output.versions[0]?.composition?.title || output.subjectRef}</strong><span>{humanize(output.productKind)} · Version {output.versions[0]?.versionOrdinal || 'Not recorded'}</span></p>) : <p>No outputs are available for this Client.</p>}</div>)}
      {section('authorizations', 'Authorizations', 'Open authorization work with this Client in context.', launch('Open Authorizations', domainHref('/agent/authorizations', clientCase.id)), <p className={styles.detailNote}>Authorization remains a governed lifecycle record in its existing workspace.</p>)}
    </div>
  </div></main>;
}

export { clientCommandCenterSections, sectionHref };
