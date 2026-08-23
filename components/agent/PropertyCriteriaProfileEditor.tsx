'use client';

import { useState } from 'react';

import { projectAtlasTitleHierarchy } from '@/components/ProjectAtlasTitleHierarchy';
import {
  PROPERTY_CRITERIA_BASEMENT_OPTIONS,
  PROPERTY_CRITERIA_CONDITION_OPTIONS,
  PROPERTY_CRITERIA_STORY_OPTIONS,
  PROPERTY_CRITERIA_TYPES,
  createPropertyCriteriaProfile,
  updatePropertyCriteriaChoice,
  updatePropertyCriteriaRange,
  type PropertyCriteriaContext,
  type PropertyCriteriaIntent,
  type PropertyCriteriaProfile,
} from '@/lib/agent-advisory-workbench/propertyCriteriaProfile';

const intentOptions: readonly PropertyCriteriaIntent[] = ['MUST_HAVE', 'PREFERRED', 'FLEXIBLE', 'EXCLUDE', 'OPEN_QUESTION', 'UNKNOWN'];
const labels: Record<string, string> = {
  SINGLE_FAMILY: 'Single-family', CONDOMINIUM: 'Condominium', TOWNHOUSE: 'Townhouse', MULTI_FAMILY: 'Multi-family', MANUFACTURED_HOME: 'Manufactured home', LAND: 'Land', OTHER_RESIDENTIAL: 'Other residential',
  FINISHED: 'Finished', PARTIALLY_FINISHED: 'Partially finished', UNFINISHED: 'Unfinished', WALKOUT: 'Walkout', GARDEN_LEVEL: 'Garden level', NONE_OR_NOT_APPLICABLE: 'None / not applicable',
  SINGLE_LEVEL: 'Single-level', TWO_STORY: 'Two-story', MULTI_LEVEL: 'Multi-level', MAIN_FLOOR_LIVING: 'Main-floor living',
  TURNKEY: 'Turnkey', COSMETIC_WORK_ACCEPTABLE: 'Cosmetic work acceptable', RENOVATION_ACCEPTABLE: 'Renovation acceptable', MAJOR_PROJECT_TOLERANCE: 'Major-project tolerance',
  YARD: 'Yard', PATIO: 'Patio', DECK: 'Deck', BALCONY: 'Balcony', FENCED_YARD: 'Fenced yard',
};

function label(value: string) { return labels[value] ?? value.replaceAll('_', ' ').toLowerCase(); }
function number(value: string) { const parsed = Number(value); return value === '' || !Number.isFinite(parsed) ? null : parsed; }

function IntentSelect({ label: intentLabel, value, onChange }: { label: string; value: PropertyCriteriaIntent; onChange: (value: PropertyCriteriaIntent) => void }) {
  return <select aria-label={`${intentLabel} intent`} value={value} onChange={(event) => onChange(event.target.value as PropertyCriteriaIntent)} className="min-h-10 border border-white/15 bg-black/20 px-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-100">{intentOptions.map((item) => <option key={item} value={item}>{label(item)}</option>)}</select>;
}

function RangeField({ label: fieldLabel, value, onChange, unit }: { label: string; value: PropertyCriteriaProfile['bedrooms']; onChange: (update: { min?: number | null; max?: number | null; intent?: PropertyCriteriaIntent }) => void; unit?: string }) {
  return <div className="border border-white/10 bg-black/10 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium text-white">{fieldLabel}</p><IntentSelect label={fieldLabel} value={value.intent} onChange={(intent) => onChange({ intent })} /></div><div className="mt-3 grid grid-cols-2 gap-3"><label className="text-xs text-slate-400">Minimum<input aria-label={`${fieldLabel} minimum`} type="number" min="0" value={value.min ?? ''} onChange={(event) => onChange({ min: number(event.target.value) })} className="mt-1 min-h-10 w-full border border-white/15 bg-black/20 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100" /></label><label className="text-xs text-slate-400">Maximum<input aria-label={`${fieldLabel} maximum`} type="number" min="0" value={value.max ?? ''} onChange={(event) => onChange({ max: number(event.target.value) })} className="mt-1 min-h-10 w-full border border-white/15 bg-black/20 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-100" /></label></div>{unit ? <p className="mt-2 text-xs text-slate-500">{unit}</p> : null}</div>;
}

function ChoiceField({ label: fieldLabel, values, selected, intent, onChange }: { label: string; values: readonly string[]; selected: readonly string[]; intent: PropertyCriteriaIntent; onChange: (values: readonly string[], intent: PropertyCriteriaIntent) => void }) {
  return <div className="border border-white/10 bg-black/10 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium text-white">{fieldLabel}</p><IntentSelect label={fieldLabel} value={intent} onChange={(nextIntent) => onChange(selected, nextIntent)} /></div><div className="mt-3 flex flex-wrap gap-2">{values.map((value) => { const checked = selected.includes(value); return <label key={value} className={`cursor-pointer border px-2 py-1 text-xs focus-within:outline-none focus-within:ring-2 focus-within:ring-cyan-100 ${checked ? 'border-cyan-200/70 bg-cyan-200/10 text-white' : 'border-white/10 text-slate-300'}`}><input className="sr-only" type="checkbox" checked={checked} onChange={() => onChange(checked ? selected.filter((item) => item !== value) : [...selected, value], intent)} />{label(value)}</label>; })}</div></div>;
}

export default function PropertyCriteriaProfileEditor({ context }: { context: PropertyCriteriaContext }) {
  const [profile, setProfile] = useState(() => createPropertyCriteriaProfile(context));
  const updateRange = (field: 'bedrooms' | 'bathrooms' | 'squareFeet' | 'garageSpaces' | 'yearBuilt' | 'lotSquareFeet') => (update: { min?: number | null; max?: number | null; intent?: PropertyCriteriaIntent }) => setProfile((current) => updatePropertyCriteriaRange(current, field, update));
  const updateChoice = (field: 'propertyTypes' | 'basement' | 'outdoorSpace' | 'stories' | 'condition') => (values: readonly string[], intent: PropertyCriteriaIntent) => setProfile((current) => updatePropertyCriteriaChoice(current, field, values as never[], intent));

  return <section className="mt-7 border-t border-white/10 pt-6" data-testid="agent-property-criteria-profile" data-property-criteria-context={context} data-session-only="true" data-persistence="false" data-saved-search="false" data-provider-query="false"><div><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-100/70">Property criteria</p><h2 className={`mt-1 ${projectAtlasTitleHierarchy.briefingSection}`}>Explicit property characteristics</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Capture only stated criteria or questions for this page session. These entries do not create a customer profile, saved search, property record, or provider query.</p><p className="mt-2 text-xs leading-5 text-slate-500">Set the intent separately from the value. Open question means the characteristic still needs discussion; it is not a property fact.</p></div><div className="mt-5 grid gap-4 lg:grid-cols-2"><ChoiceField label="Property type" values={PROPERTY_CRITERIA_TYPES} selected={profile.propertyTypes.values} intent={profile.propertyTypes.intent} onChange={updateChoice('propertyTypes')} /><RangeField label="Bedrooms" value={profile.bedrooms} onChange={updateRange('bedrooms')} /><RangeField label="Bathrooms" value={profile.bathrooms} onChange={updateRange('bathrooms')} /><RangeField label="Square footage" value={profile.squareFeet} onChange={updateRange('squareFeet')} unit="Total, above-grade, finished-area, and basement-area semantics remain distinct until a supported data surface names them." /><RangeField label="Garage / parking spaces" value={profile.garageSpaces} onChange={updateRange('garageSpaces')} /><RangeField label="Year built" value={profile.yearBuilt} onChange={updateRange('yearBuilt')} /><ChoiceField label="Basement / lower level" values={PROPERTY_CRITERIA_BASEMENT_OPTIONS} selected={profile.basement.values} intent={profile.basement.intent} onChange={updateChoice('basement')} /><RangeField label="Lot size" value={profile.lotSquareFeet} onChange={updateRange('lotSquareFeet')} unit="Lot-size unit is square feet for this session-only foundation." /><ChoiceField label="Outdoor space" values={['YARD', 'PATIO', 'DECK', 'BALCONY', 'FENCED_YARD']} selected={profile.outdoorSpace.values} intent={profile.outdoorSpace.intent} onChange={updateChoice('outdoorSpace')} /><ChoiceField label="Stories / levels" values={PROPERTY_CRITERIA_STORY_OPTIONS} selected={profile.stories.values} intent={profile.stories.intent} onChange={updateChoice('stories')} /><ChoiceField label="Condition / renovation tolerance" values={PROPERTY_CRITERIA_CONDITION_OPTIONS} selected={profile.condition.values} intent={profile.condition.intent} onChange={updateChoice('condition')} /></div></section>;
}
