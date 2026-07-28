'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Bell, Check, ChevronDown, Loader2, Mail, MessageSquareText, Sparkles } from 'lucide-react';
import type { CSSProperties } from 'react';

import { getSavedNorthStarAnchors } from '@/components/settings/NorthStarManager';

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

const selectControlStyle: CSSProperties = {
  boxSizing: 'border-box',
  minHeight: 42,
  paddingBottom: 10,
  paddingTop: 10,
};

const emailControlStyle: CSSProperties = {
  boxSizing: 'border-box',
  minHeight: 44,
  paddingBottom: 10,
  paddingTop: 10,
};

const saveButtonStyle: CSSProperties = {
  alignItems: 'center',
  boxSizing: 'border-box',
  display: 'inline-flex',
  minHeight: 44,
  paddingBottom: 10,
  paddingTop: 10,
};

const notesControlStyle: CSSProperties = {
  boxSizing: 'border-box',
  minHeight: 70,
  paddingBottom: 10,
  paddingTop: 10,
};

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

function getCustomerFollowUpLabel(level: SaveSearchResponse['alertReadiness'] extends infer Readiness ? Readiness extends { level: infer Level } ? Level : never : never) {
  if (level === 'ready') return 'Updates ready';
  if (level === 'watch') return 'Saved for watching';
  return 'Criteria saved';
}

function getSavedMessage(result: SaveSearchResponse | null) {
  if (!result?.alertReadiness) return 'Your search criteria were saved for listing updates and optional follow-up context.';
  return result.alertReadiness.summary;
}

function getIntentSummary(goal: ReieGoal, timeline: Timeline) {
  return `${getGoalLabel(goal)} / ${getTimelineLabel(timeline)}`;
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
  const capturedFilters = useMemo(
    () => ({
      minPrice: getParam(searchParams, 'minPrice'),
      beds: getParam(searchParams, 'beds'),
      type: getParam(searchParams, 'type'),
      north: getParam(searchParams, 'north'),
      south: getParam(searchParams, 'south'),
      east: getParam(searchParams, 'east'),
      west: getParam(searchParams, 'west'),
    }),
    [searchParams],
  );
  const capturedFilterCount = useMemo(() => Object.values(capturedFilters).filter(Boolean).length, [capturedFilters]);
  const normalizedEmail = email.trim().toLowerCase();
  const hasValidEmail = isValidEmail(normalizedEmail);
  const normalizedNotes = notes.trim();
  const statusText = useMemo(() => {
    if (submitState === 'saving') return 'Saving search';
    if (submitState === 'saved') return 'Search saved';
    if (submitState === 'error') return error || 'Unable to save this search.';
    return getIntentSummary(goal, timeline);
  }, [error, goal, submitState, timeline]);
  const intentSummary = useMemo(() => getIntentSummary(goal, timeline), [goal, timeline]);

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

    if (!isValidEmail(normalizedEmail)) {
      setSubmitState('error');
      setError('Enter a valid email address.');
      return;
    }

    setSubmitState('saving');
    setError(null);
    setSaveResult(null);
    const northStars = getSavedNorthStarAnchors();

    const payload = {
      email: normalizedEmail,
      city,
      minPrice: capturedFilters.minPrice,
      beds: capturedFilters.beds,
      type: capturedFilters.type,
      north: capturedFilters.north,
      south: capturedFilters.south,
      east: capturedFilters.east,
      west: capturedFilters.west,
      filters: {
        intakeSource: 'search-map',
        reieGoal: goal,
        timeline,
        northStars,
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
      <div
        className="overflow-hidden rounded-[8px] border border-cyan-200/30 bg-[#071017] text-cyan-100"
        data-testid="reie-save-search"
        data-save-search-state={submitState}
        data-save-search-city={city}
        data-save-search-intent={goal}
        data-save-search-intent-label={saveResult?.intake?.reieGoalLabel || getGoalLabel(goal)}
        data-save-search-timeline={timeline}
        data-save-search-timeline-label={saveResult?.intake?.timelineLabel || getTimelineLabel(timeline)}
        data-save-search-alert-readiness={saveResult?.alertReadiness?.level || ''}
        data-save-search-signal-count={saveResult?.alertReadiness?.signals.length ?? 0}
        data-save-search-blocker-count={saveResult?.alertReadiness?.blockers.length ?? 0}
        data-save-search-user-id={saveResult?.userId || ''}
        data-save-search-id={saveResult?.savedSearchId || ''}
        data-save-search-filter-count={capturedFilterCount}
      >
        <div className="border-b border-cyan-100/14 bg-cyan-100/[0.08] px-4 py-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-cyan-100 text-[#071017]">
              <Check size={16} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.26em]">Search Saved</p>
              <p className="mt-1 text-xs leading-5 text-white/58">{getSavedMessage(saveResult)}</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3">
          {saveResult?.alertReadiness ? (
            <span
              className={`inline-flex rounded-[5px] border px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] ${getReadinessClass(saveResult.alertReadiness.level)}`}
              data-testid="reie-save-search-readiness"
              data-save-search-alert-readiness={saveResult.alertReadiness.level}
              data-save-search-signal-count={saveResult.alertReadiness.signals.length}
              data-save-search-blocker-count={saveResult.alertReadiness.blockers.length}
            >
              {getCustomerFollowUpLabel(saveResult.alertReadiness.level)}
            </span>
          ) : null}
          {saveResult?.intake ? (
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
              {saveResult.intake.reieGoalLabel || getGoalLabel(goal)} / {saveResult.intake.timelineLabel || getTimelineLabel(timeline)}
            </p>
          ) : null}
          {saveResult?.alertReadiness?.signals.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {saveResult.alertReadiness.signals.slice(0, 3).map((signal) => (
                <span
                  key={signal}
                  className="rounded-[4px] border border-white/10 bg-black/40 px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white/45"
                  data-testid="reie-save-search-signal"
                  data-save-search-signal={signal}
                >
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
            className="mt-4 inline-flex h-9 items-center justify-center rounded-[6px] border border-cyan-100/28 px-3 text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100 transition hover:border-white/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
            data-testid="reie-save-search-reset"
            data-save-search-next-state="idle"
          >
            Save another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-[8px] border border-white/10 bg-[#071017] shadow-[0_12px_35px_rgba(0,0,0,0.22)]"
      data-testid="reie-save-search"
      data-save-search-state={submitState}
      data-save-search-city={city}
      data-save-search-intent={goal}
      data-save-search-intent-label={getGoalLabel(goal)}
      data-save-search-timeline={timeline}
      data-save-search-timeline-label={getTimelineLabel(timeline)}
      data-save-search-email-valid={hasValidEmail ? 'true' : 'false'}
      data-save-search-email-present={normalizedEmail ? 'true' : 'false'}
      data-save-search-notes-present={normalizedNotes ? 'true' : 'false'}
      data-save-search-notes-length={notes.length}
      data-save-search-notes-max-length={MAX_NOTE_LENGTH}
      data-save-search-filter-count={capturedFilterCount}
      data-save-search-has-bounds={capturedFilters.north && capturedFilters.south && capturedFilters.east && capturedFilters.west ? 'true' : 'false'}
      data-save-search-has-min-price={capturedFilters.minPrice ? 'true' : 'false'}
      data-save-search-has-beds={capturedFilters.beds ? 'true' : 'false'}
      data-save-search-has-type={capturedFilters.type ? 'true' : 'false'}
      data-save-search-error={error || ''}
    >
      <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(103,232,249,0.095),rgba(255,255,255,0.028))] p-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-cyan-100/20 bg-cyan-100/[0.08] text-cyan-100">
              <Bell size={16} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">Save This Search</p>
              <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">{statusText}</p>
            </div>
          </div>

          {isSaving ? <Loader2 size={16} className="mt-0.5 shrink-0 animate-spin text-cyan-300" /> : null}
        </div>
        <p className="mt-2 text-xs leading-5 text-white/48">
          Save when this view is worth watching. It keeps supported search criteria with your timing, intent, email, and optional notes.
        </p>
        <div
          className="mt-2 grid grid-cols-2 overflow-hidden rounded-[6px] border border-white/10 bg-black/24"
          data-testid="reie-save-search-summary"
          data-save-search-city={city}
          data-save-search-intent-summary={intentSummary}
        >
          <div className="px-3 py-2">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/32">Market</p>
            <p className="mt-1 truncate text-[11px] font-black uppercase tracking-[0.08em] text-white/68">{city}</p>
          </div>
          <div className="border-l border-white/10 px-3 py-2">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/32">Intent</p>
            <p className="mt-1 truncate text-[11px] font-black uppercase tracking-[0.08em] text-cyan-100/80">{intentSummary}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 p-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="relative block min-w-0">
            <span className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/38">
              <Sparkles size={12} aria-hidden="true" className="text-cyan-100/60" />
              Search Goal
            </span>
            <select
              value={goal}
              onChange={(event) => {
                setGoal(event.target.value as ReieGoal);
                resetErrorState();
              }}
              disabled={isSaving}
              style={selectControlStyle}
              className="h-10 w-full min-w-0 appearance-none rounded-[6px] border border-white/10 bg-white/[0.055] px-3 pr-8 text-[10px] font-black uppercase tracking-[0.08em] text-white outline-none transition focus:border-cyan-200/70 disabled:cursor-not-allowed disabled:opacity-60"
              data-testid="reie-save-search-goal"
              data-save-search-intent={goal}
              data-save-search-intent-label={getGoalLabel(goal)}
            >
              {GOAL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#0d141c] text-white">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/45" />
          </label>

          <label className="relative block min-w-0">
            <span className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/38">
              <Bell size={12} aria-hidden="true" className="text-cyan-100/60" />
              Timeline
            </span>
            <select
              value={timeline}
              onChange={(event) => {
                setTimeline(event.target.value as Timeline);
                resetErrorState();
              }}
              disabled={isSaving}
              style={selectControlStyle}
              className="h-10 w-full min-w-0 appearance-none rounded-[6px] border border-white/10 bg-white/[0.055] px-3 pr-8 text-[10px] font-black uppercase tracking-[0.08em] text-white outline-none transition focus:border-cyan-200/70 disabled:cursor-not-allowed disabled:opacity-60"
              data-testid="reie-save-search-timeline"
              data-save-search-timeline={timeline}
              data-save-search-timeline-label={getTimelineLabel(timeline)}
            >
              {TIMELINE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#0d141c] text-white">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/45" />
          </label>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="min-w-0 flex-1" htmlFor="map-save-search-email">
            <span className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/38">
              <Mail size={12} aria-hidden="true" className="text-cyan-100/60" />
              Email
            </span>
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
              style={emailControlStyle}
              className="min-h-11 w-full min-w-0 flex-1 rounded-[6px] border border-white/10 bg-white/[0.055] px-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-cyan-200/70 disabled:cursor-not-allowed disabled:opacity-60"
              data-testid="reie-save-search-email"
              data-save-search-email-valid={hasValidEmail ? 'true' : 'false'}
              data-save-search-email-present={normalizedEmail ? 'true' : 'false'}
            />
          </label>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={saveButtonStyle}
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-[6px] border border-cyan-100/40 bg-cyan-100 px-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#071017] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-[112px] sm:self-end"
            data-testid="reie-save-search-submit"
            data-save-search-state={submitState}
            data-save-search-disabled={isSaving ? 'true' : 'false'}
            data-save-search-email-valid={hasValidEmail ? 'true' : 'false'}
          >
            {isSaving ? (
              <>
                <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                Saving
              </>
            ) : (
              <>
                <Bell size={13} aria-hidden="true" />
                Save
              </>
            )}
          </button>
        </div>

        <label className="block">
          <span className="mb-2 flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.14em] text-white/38">
            <span className="flex items-center gap-1.5">
              <MessageSquareText size={12} aria-hidden="true" className="text-cyan-100/60" />
              Notes
            </span>
            <span>{getCharacterCountLabel(notes)}</span>
          </span>
          <textarea
            value={notes}
            maxLength={MAX_NOTE_LENGTH}
            disabled={isSaving}
            onChange={(event) => {
              setNotes(event.target.value);
              resetErrorState();
            }}
            placeholder="Optional notes about what you want to compare"
            style={notesControlStyle}
            className="min-h-16 w-full resize-none rounded-[6px] border border-white/10 bg-white/[0.055] px-3 py-2 text-xs leading-5 text-white outline-none transition-colors placeholder:text-white/25 focus:border-cyan-200/70 disabled:cursor-not-allowed disabled:opacity-60"
            data-testid="reie-save-search-notes"
            data-save-search-notes-length={notes.length}
            data-save-search-notes-max-length={MAX_NOTE_LENGTH}
            data-save-search-notes-present={normalizedNotes ? 'true' : 'false'}
          />
        </label>

        <div
          className="flex min-h-5 items-center justify-between gap-3 border-t border-white/10 pt-3"
          data-testid="reie-save-search-status"
          data-save-search-state={submitState}
          data-save-search-error={error || ''}
          data-save-search-status-text={error || 'Save this view when it reflects what you want to keep watching.'}
        >
          <p className={`min-w-0 text-xs font-bold ${error ? 'text-red-300' : 'text-white/35'}`}>
            {error || 'Save this view when it reflects what you want to keep watching. Updates depend on available listing changes.'}
          </p>
        </div>
        <p
          className="text-[11px] leading-4 text-white/38"
          data-testid="reie-save-search-consent-notice"
          data-public-trust-form-notice="save-search"
        >
          Email is required. Supported search criteria, timing, intent, and optional notes are used for saved-search updates and follow-up routing. Saving a search
          does not automatically create a brokerage relationship. Review the{' '}
          <Link href="/privacy" className="font-bold text-cyan-100 underline underline-offset-4">
            Privacy Notice
          </Link>{' '}
          and{' '}
          <Link href="/terms" className="font-bold text-cyan-100 underline underline-offset-4">
            Terms of Use
          </Link>
          . Do not submit confidential negotiating positions, motivation, financial limits, or client-confidential information until the
          applicable brokerage relationship and disclosures have been discussed.
        </p>
      </div>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SaveSearch.tsx
