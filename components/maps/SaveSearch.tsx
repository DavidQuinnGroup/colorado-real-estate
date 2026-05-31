'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bell, Check, ChevronDown, Loader2 } from 'lucide-react';

type SaveSearchProps = {
  city: string;
};

type SaveSearchResponse = {
  success?: boolean;
  error?: string;
  userId?: string;
  savedSearchId?: string;
  alertReadiness?: {
    level: 'ready' | 'watch' | 'incomplete';
    summary: string;
    blockers: string[];
    signals: string[];
  };
  intake?: {
    reieGoalLabel?: string | null;
    timelineLabel?: string | null;
    leadTemperature?: string;
  };
};

type SubmitState = 'idle' | 'saving' | 'saved' | 'error';

type ReieGoal = 'buy-strategy' | 'sell-optimize' | 'relocation-fit' | 'portfolio-review';

type Timeline = 'research' | 'six-months' | 'ninety-days' | 'now';

type GoalOption = {
  value: ReieGoal;
  label: string;
};

type TimelineOption = {
  value: Timeline;
  label: string;
};

const GOAL_OPTIONS: GoalOption[] = [
  { value: 'buy-strategy', label: 'Buy Strategy' },
  { value: 'sell-optimize', label: 'Sell / Optimize' },
  { value: 'relocation-fit', label: 'Relocation Fit' },
  { value: 'portfolio-review', label: 'Portfolio Review' },
];

const TIMELINE_OPTIONS: TimelineOption[] = [
  { value: 'research', label: 'Research' },
  { value: 'six-months', label: '6 Months' },
  { value: 'ninety-days', label: '90 Days' },
  { value: 'now', label: 'Now' },
];

const MAX_NOTE_LENGTH = 220;

function getParam(searchParams: URLSearchParams, key: string) {
  return searchParams.get(key) || null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unable to save this search.';
}

function getGoalLabel(value: ReieGoal) {
  return GOAL_OPTIONS.find((option) => option.value === value)?.label || 'Buy Strategy';
}

function getTimelineLabel(value: Timeline) {
  return TIMELINE_OPTIONS.find((option) => option.value === value)?.label || 'Research';
}

function getCharacterCountLabel(value: string) {
  return `${value.length}/${MAX_NOTE_LENGTH}`;
}

function getReadinessClass(level: SaveSearchResponse['alertReadiness'] extends infer Readiness ? Readiness extends { level: infer Level } ? Level : never : never) {
  if (level === 'ready') return 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100';
  if (level === 'watch') return 'border-amber-300/40 bg-amber-400/10 text-amber-100';
  return 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100';
}

function getSavedMessage(result: SaveSearchResponse | null) {
  if (!result?.alertReadiness) return 'New matching inventory will feed your intelligence digest.';
  return result.alertReadiness.summary;
}

async function readResponse(response: Response): Promise<SaveSearchResponse> {
  try {
    const body = (await response.json()) as SaveSearchResponse;
    return body && typeof body === 'object' ? body : {};
  } catch {
    return {};
  }
}

export default function SaveSearch({ city }: SaveSearchProps) {
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState<ReieGoal>('buy-strategy');
  const [timeline, setTimeline] = useState<Timeline>('research');
  const [notes, setNotes] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [saveResult, setSaveResult] = useState<SaveSearchResponse | null>(null);
  const searchParams = useSearchParams();

  const isSaving = submitState === 'saving';
  const statusText = useMemo(() => {
    if (submitState === 'saving') return 'Saving search';
    if (submitState === 'saved') return 'Search saved';
    if (submitState === 'error') return error || 'Unable to save this search.';
    return `${getGoalLabel(goal)} / ${getTimelineLabel(timeline)}`;
  }, [error, goal, submitState, timeline]);

  function resetErrorState() {
    if (submitState === 'error') {
      setSubmitState('idle');
      setError(null);
    }
    if (submitState === 'saved') {
      setSubmitState('idle');
      setSaveResult(null);
    }
  }

  async function handleSave() {
    if (isSaving) return;

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedNotes = notes.trim();

    if (!isValidEmail(normalizedEmail)) {
      setSubmitState('error');
      setError('Enter a valid email address.');
      return;
    }

    setSubmitState('saving');
    setError(null);
    setSaveResult(null);

    const payload = {
      email: normalizedEmail,
      city,
      minPrice: getParam(searchParams, 'minPrice'),
      beds: getParam(searchParams, 'beds'),
      type: getParam(searchParams, 'type'),
      north: getParam(searchParams, 'north'),
      south: getParam(searchParams, 'south'),
      east: getParam(searchParams, 'east'),
      west: getParam(searchParams, 'west'),
      filters: {
        intakeSource: 'search-map',
        reieGoal: goal,
        timeline,
        notes: normalizedNotes || null,
      },
    };

    try {
      const response = await fetch('/api/save-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await readResponse(response);

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to save this search.');
      }

      setSaveResult(result);
      setSubmitState('saved');
    } catch (requestError) {
      setSubmitState('error');
      setError(getErrorMessage(requestError));
    }
  }

  if (submitState === 'saved') {
    return (
      <div className="border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-cyan-100">
        <div className="flex items-start gap-3">
          <Check size={16} className="mt-0.5 shrink-0 text-cyan-300" />
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.26em]">Search Saved</p>
            {saveResult?.alertReadiness ? (
              <span className={`mt-2 inline-flex border px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] ${getReadinessClass(saveResult.alertReadiness.level)}`}>
                Alert {saveResult.alertReadiness.level}
              </span>
            ) : null}
            <p className="mt-2 text-xs leading-5 text-white/60">{getSavedMessage(saveResult)}</p>
            {saveResult?.intake ? (
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                {saveResult.intake.reieGoalLabel || getGoalLabel(goal)} / {saveResult.intake.timelineLabel || getTimelineLabel(timeline)}
              </p>
            ) : null}
            {saveResult?.alertReadiness?.signals.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {saveResult.alertReadiness.signals.slice(0, 3).map((signal) => (
                  <span key={signal} className="border border-white/10 bg-black/40 px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white/45">
                    {signal}
                  </span>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setSubmitState('idle');
                setSaveResult(null);
              }}
              className="mt-3 text-[9px] font-black uppercase tracking-[0.22em] text-cyan-200 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            >
              Save another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-black p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Bell size={16} className="shrink-0 text-cyan-300" />
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/55">Save Search</p>
            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">{statusText}</p>
          </div>
        </div>

        {isSaving ? <Loader2 size={16} className="mt-0.5 shrink-0 animate-spin text-cyan-300" /> : null}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <label className="relative block">
          <span className="sr-only">REIE intent</span>
          <select
            value={goal}
            onChange={(event) => {
              setGoal(event.target.value as ReieGoal);
              resetErrorState();
            }}
            disabled={isSaving}
            className="h-10 w-full appearance-none border border-white/10 bg-white/[0.04] px-3 pr-8 text-[10px] font-black uppercase tracking-[0.14em] text-white outline-none transition focus:border-cyan-300/70 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {GOAL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-black text-white">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/45" />
        </label>

        <label className="relative block">
          <span className="sr-only">Timeline</span>
          <select
            value={timeline}
            onChange={(event) => {
              setTimeline(event.target.value as Timeline);
              resetErrorState();
            }}
            disabled={isSaving}
            className="h-10 w-full appearance-none border border-white/10 bg-white/[0.04] px-3 pr-8 text-[10px] font-black uppercase tracking-[0.14em] text-white outline-none transition focus:border-cyan-300/70 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {TIMELINE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-black text-white">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/45" />
        </label>
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="map-save-search-email">
          Email address
        </label>
        <input
          id="map-save-search-email"
          type="email"
          placeholder="Email address"
          value={email}
          disabled={isSaving}
          onChange={(event) => {
            setEmail(event.target.value);
            resetErrorState();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void handleSave();
          }}
          className="min-h-11 min-w-0 flex-1 border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-cyan-300/70 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-cyan-300/40 bg-cyan-300 px-4 text-[10px] font-black uppercase tracking-[0.22em] text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Saving' : 'Save'}
        </button>
      </div>

      <label className="mt-2 block">
        <span className="sr-only">Optional search notes</span>
        <textarea
          value={notes}
          maxLength={MAX_NOTE_LENGTH}
          disabled={isSaving}
          onChange={(event) => {
            setNotes(event.target.value);
            resetErrorState();
          }}
          placeholder="Optional notes"
          className="min-h-16 w-full resize-none border border-white/10 bg-white/[0.04] px-3 py-2 text-xs leading-5 text-white outline-none transition-colors placeholder:text-white/25 focus:border-cyan-300/70 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      <div className="mt-2 flex min-h-5 items-center justify-between gap-3">
        <p className={`text-xs font-bold ${error ? 'text-red-300' : 'text-white/35'}`}>{error || 'Saved searches include this map view and current filters.'}</p>
        <p className="shrink-0 text-[10px] font-bold text-white/25">{getCharacterCountLabel(notes)}</p>
      </div>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SaveSearch.tsx
