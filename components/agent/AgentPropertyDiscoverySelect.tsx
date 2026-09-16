'use client';

import { Plus, Search, X } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';

import { AtlasButton, AtlasField } from '@/components/design-system/AtlasDesignSystem';
import styles from './ClientCaseInformationWorkspace.module.css';

type PropertyDiscoveryResult = {
  resultToken: string;
  displayAddress: string;
  attachable: boolean;
  alreadyLinked: boolean;
  context: string;
};

type PropertyDiscoveryResponse = {
  state: 'QUERY_TOO_SHORT' | 'NO_RESULT' | 'RESULTS';
  results: PropertyDiscoveryResult[];
  error?: string;
};

const relationshipRoleOptions = ['CURRENT_HOME', 'TARGET_PRIMARY', 'INVESTMENT_PROPERTY', 'SALE_RELEVANT', 'OTHER'];

function errorMessage(payload: unknown) {
  return typeof payload === 'object' && payload && 'error' in payload && typeof payload.error === 'string' ? payload.error : 'Unable to search properties right now.';
}

function roleLabel(value: string) {
  if (value === 'CURRENT_HOME') return 'Current home';
  if (value === 'TARGET_PRIMARY') return 'Primary-home target';
  if (value === 'INVESTMENT_PROPERTY') return 'Investment property';
  if (value === 'SALE_RELEVANT') return 'Planning to sell';
  return 'Other property';
}

async function discoverProperties(clientCaseId: string, query: string, signal: AbortSignal) {
  const response = await fetch(`/api/agent/property-discovery?clientCaseId=${encodeURIComponent(clientCaseId)}&q=${encodeURIComponent(query)}`, { cache: 'no-store', signal });
  const payload = await response.json() as PropertyDiscoveryResponse;
  if (!response.ok) throw new Error(errorMessage(payload));
  return payload;
}

export type AgentPropertyDiscoverySelection = {
  discoveryResultToken: string;
  roles: string[];
  alreadyLinked: boolean;
};

export function AgentPropertyDiscoverySelect({ clientCaseId, busy = false, onAttach }: { clientCaseId: string; busy?: boolean; onAttach: (selection: AgentPropertyDiscoverySelection) => Promise<void> }) {
  const [propertySearch, setPropertySearch] = useState('');
  const [propertySearchState, setPropertySearchState] = useState<'idle' | 'loading' | 'ready' | 'no-result' | 'error'>('idle');
  const [propertySearchError, setPropertySearchError] = useState('');
  const [propertyResults, setPropertyResults] = useState<PropertyDiscoveryResult[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDiscoveryResult | null>(null);
  const [activePropertyIndex, setActivePropertyIndex] = useState(-1);
  const propertySearchSequence = useRef(0);
  const [roles, setRoles] = useState<string[]>(['CURRENT_HOME']);
  const [attachError, setAttachError] = useState('');

  function clearSelection() {
    setSelectedProperty(null);
    setPropertySearch('');
    setPropertyResults([]);
    setPropertySearchState('idle');
    setPropertySearchError('');
    setRoles(['CURRENT_HOME']);
    setActivePropertyIndex(-1);
    setAttachError('');
  }

  function selectPropertyResult(result: PropertyDiscoveryResult) {
    if (!result.attachable) return;
    setSelectedProperty(result);
    setPropertySearch(result.displayAddress);
    setPropertyResults([]);
    setPropertySearchState('ready');
    setPropertySearchError('');
    setActivePropertyIndex(-1);
    setAttachError('');
  }

  function handlePropertySearchKeys(event: KeyboardEvent<HTMLInputElement>) {
    if (!propertyResults.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActivePropertyIndex((current) => Math.min(propertyResults.length - 1, current + 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActivePropertyIndex((current) => Math.max(0, current < 0 ? propertyResults.length - 1 : current - 1));
    }
    if (event.key === 'Enter' && activePropertyIndex >= 0) {
      event.preventDefault();
      selectPropertyResult(propertyResults[activePropertyIndex]);
    }
    if (event.key === 'Escape') {
      setPropertyResults([]);
      setActivePropertyIndex(-1);
    }
  }

  useEffect(() => {
    if (selectedProperty) return;
    const query = propertySearch.trim();
    propertySearchSequence.current += 1;
    const sequence = propertySearchSequence.current;
    if (query.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void discoverProperties(clientCaseId, query, controller.signal).then((payload) => {
        if (sequence !== propertySearchSequence.current) return;
        setPropertyResults(payload.results);
        setPropertySearchState(payload.state === 'NO_RESULT' ? 'no-result' : 'ready');
      }).catch((error: unknown) => {
        if (controller.signal.aborted || sequence !== propertySearchSequence.current) return;
        setPropertyResults([]);
        setPropertySearchState('error');
        setPropertySearchError(error instanceof Error ? error.message : 'Unable to search properties right now.');
      });
    }, 250);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [clientCaseId, propertySearch, selectedProperty]);

  async function attachProperty() {
    if (!selectedProperty?.attachable || !roles.length) return;
    setAttachError('');
    try {
      await onAttach({ discoveryResultToken: selectedProperty.resultToken, roles, alreadyLinked: selectedProperty.alreadyLinked });
      clearSelection();
    } catch (error) {
      setAttachError(error instanceof Error ? error.message : 'Property relationship could not be saved.');
    }
  }

  function toggleRole(role: string) {
    setRoles((current) => current.includes(role) ? current.filter((entry) => entry !== role) : [...current, role]);
  }

  return <form className={styles.propertyLinkForm} onSubmit={(event) => { event.preventDefault(); void attachProperty(); }} data-testid="agent-property-discovery-select">
    <div className={styles.propertyLinkLayout}>
      <div className={styles.propertySearchColumn}>
        <AtlasField htmlFor="property-search" label="Search property">
          <div className={styles.comboboxWrap}>
            <Search aria-hidden="true" className={styles.comboboxIcon} size={16} />
            <input
              aria-activedescendant={activePropertyIndex >= 0 ? `property-result-${activePropertyIndex}` : undefined}
              aria-autocomplete="list"
              aria-controls="property-results"
              aria-expanded={propertyResults.length > 0}
              aria-label="Search existing properties"
              className={`${styles.input} ${styles.searchInput}`}
              id="property-search"
              maxLength={160}
              onChange={(event) => {
                const next = event.target.value;
                setSelectedProperty(null);
                setPropertySearch(next);
                setPropertySearchError('');
                setAttachError('');
                setActivePropertyIndex(-1);
                if (next.trim().length < 2) {
                  setPropertyResults([]);
                  setPropertySearchState('idle');
                } else {
                  setPropertySearchState('loading');
                }
              }}
              onKeyDown={handlePropertySearchKeys}
              placeholder="Start typing an address"
              role="combobox"
              value={propertySearch}
            />
          </div>
        </AtlasField>
        {propertySearchState === 'loading' ? <p className={styles.searchStatus}>Searching existing property data.</p> : null}
        {propertySearchState === 'error' ? <p className={styles.searchStatus}>{propertySearchError || 'Unable to search properties right now.'}</p> : null}
        {propertySearchState === 'no-result' ? <p className={styles.searchStatus}>No matching property found in the currently available property data.</p> : null}
        {propertyResults.length ? <div className={styles.suggestionPanel} id="property-results" role="listbox" aria-label="Property search suggestions">
          {propertyResults.map((result, index) => <button
            aria-disabled={!result.attachable}
            aria-selected={index === activePropertyIndex}
            className={`${styles.suggestionOption} ${index === activePropertyIndex ? styles.suggestionOptionActive : ''}`}
            disabled={!result.attachable}
            id={`property-result-${index}`}
            key={`${result.resultToken}-${index}`}
            onClick={() => selectPropertyResult(result)}
            role="option"
            type="button"
          >
            <span className={styles.suggestionTitle}>{result.displayAddress}</span>
            <span className={styles.suggestionMeta}>{result.context}{result.alreadyLinked ? ' · Already linked' : ''}</span>
          </button>)}
        </div> : null}
        {selectedProperty ? <div className={styles.selectedPropertySummary} data-selected-property-summary="true">
          <p className={styles.summaryLabel}>Selected property</p>
          <p className={styles.summaryValue}>{selectedProperty.displayAddress}</p>
          <p className={styles.optionDescription}>{selectedProperty.alreadyLinked ? 'Already linked to this Client Case. You can add another durable role.' : selectedProperty.context}</p>
          <AtlasButton disabled={busy} tone="ghost" type="button" onClick={clearSelection}><X size={15} />Clear selection</AtlasButton>
        </div> : null}
      </div>
      <div className={styles.rolePicker} aria-label="Initial relationship roles">{relationshipRoleOptions.map((option) => <label className={styles.roleCheck} key={option}><input checked={roles.includes(option)} type="checkbox" onChange={() => toggleRole(option)} />{roleLabel(option)}</label>)}</div>
      {attachError ? <p className={styles.searchStatus} role="status">{attachError}</p> : null}
      <div className={styles.propertyLinkActions}><AtlasButton disabled={busy || !selectedProperty?.attachable || !roles.length} type="submit"><Plus size={16} />Add to Client Case</AtlasButton></div>
    </div>
  </form>;
}
