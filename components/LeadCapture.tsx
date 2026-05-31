'use client';

import type { FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, CircleDollarSign, Compass, Hammer, Lock, ShieldCheck, Target } from 'lucide-react';

type LeadCaptureProps = {
  city: string;
};

type GoalId = 'sell-optimize' | 'buy-strategy' | 'relocation-fit' | 'portfolio-review';

type TimelineId = 'now' | 'ninety-days' | 'six-months' | 'research';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

type GoalOption = {
  id: GoalId;
  label: string;
  description: string;
  icon: ReactNode;
};

type TimelineOption = {
  id: TimelineId;
  label: string;
};

type IntakeSignal = {
  label: string;
  value: string;
  description: string;
};

type SaveSearchResponse = {
  success?: boolean;
  error?: string;
  savedSearchId?: string;
  crmTaskId?: string | null;
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
    heatScoreIncrement?: number;
    authoritySignals?: string[];
  };
};

const GOALS: GoalOption[] = [
  {
    id: 'sell-optimize',
    label: 'Sell / Optimize',
    description: 'Identify pre-listing leverage, condition risks, value gaps, timing, and private-market positioning.',
    icon: <CircleDollarSign size={24} />,
  },
  {
    id: 'buy-strategy',
    label: 'Buy Strategy',
    description: 'Compare neighborhoods, construction risks, lifestyle efficiency, and tactical offer posture.',
    icon: <Target size={24} />,
  },
  {
    id: 'relocation-fit',
    label: 'Relocation Fit',
    description: 'Map daily-life friction, commute logic, school/lifestyle anchors, and Boulder/Denver tradeoffs.',
    icon: <Compass size={24} />,
  },
  {
    id: 'portfolio-review',
    label: 'Portfolio Review',
    description: 'Evaluate long-term durability, equity position, rental optionality, and maintenance exposure.',
    icon: <Hammer size={24} />,
  },
];

const TIMELINES: TimelineOption[] = [
  { id: 'now', label: 'Now' },
  { id: 'ninety-days', label: '90 Days' },
  { id: 'six-months', label: '6 Months' },
  { id: 'research', label: 'Research' },
];

const GOAL_TO_LEGACY_GOAL: Record<GoalId, string> = {
  'sell-optimize': 'equity-growth',
  'buy-strategy': 'lifestyle-optimization',
  'relocation-fit': 'lifestyle-optimization',
  'portfolio-review': 'retirement-income',
};

const INTAKE_SIGNALS: IntakeSignal[] = [
  {
    label: 'Market Fit',
    value: 'City + Neighborhood',
    description: 'Routes the request through local market context, inventory posture, and authority paths.',
  },
  {
    label: 'Property Risk',
    value: 'GC Lens',
    description: 'Frames condition, envelope, drainage, systems, and maintenance exposure before strategy.',
  },
  {
    label: 'Move Logic',
    value: 'Timing + Goal',
    description: 'Connects buyer, seller, relocation, or portfolio intent to the correct next action.',
  },
];

function formatCityName(city: string) {
  return city
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getSelectedGoalLabel(selectedGoal: GoalId) {
  return GOALS.find((goal) => goal.id === selectedGoal)?.label || 'Strategy';
}

function getSelectedTimelineLabel(selectedTimeline: TimelineId) {
  return TIMELINES.find((timeline) => timeline.id === selectedTimeline)?.label || 'Research';
}

function getLeadTemperature(timeline: TimelineId) {
  if (timeline === 'now') return 'hot';
  if (timeline === 'ninety-days') return 'warm';
  return 'nurture';
}

function getReadinessClass(level: SaveSearchResponse['alertReadiness'] extends infer Readiness ? Readiness extends { level: infer Level } ? Level : never : never) {
  if (level === 'ready') return 'border-[#00ff80]/30 bg-[#00ff80]/10 text-[#00ff80]';
  if (level === 'watch') return 'border-amber-300/30 bg-amber-300/10 text-amber-100';
  return 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100';
}

function getTemperatureClass(temperature: string | undefined) {
  if (temperature === 'hot') return 'border-red-400/30 bg-red-500/10 text-red-100';
  if (temperature === 'warm') return 'border-amber-300/30 bg-amber-300/10 text-amber-100';
  return 'border-white/10 bg-white/[0.03] text-white/50';
}

async function readResponse(response: Response): Promise<SaveSearchResponse> {
  try {
    const body = (await response.json()) as SaveSearchResponse;
    return body && typeof body === 'object' ? body : {};
  } catch {
    return {};
  }
}

export default function LeadCapture({ city }: LeadCaptureProps) {
  const cityName = useMemo(() => formatCityName(city), [city]);
  const [selectedGoal, setSelectedGoal] = useState<GoalId>('buy-strategy');
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineId>('ninety-days');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [saveResult, setSaveResult] = useState<SaveSearchResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setSubmitState('error');
      setErrorMessage('Enter a valid email address to initialize the strategy brief.');
      return;
    }

    setSubmitState('submitting');
    setErrorMessage('');
    setSaveResult(null);

    try {
      const response = await fetch('/api/save-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          city: cityName,
          type: 'REIE Strategy Intake',
          filters: {
            intakeSource: 'city-market-page',
            strategicGoal: GOAL_TO_LEGACY_GOAL[selectedGoal],
            reieGoal: selectedGoal,
            reieGoalLabel: getSelectedGoalLabel(selectedGoal),
            timeline: selectedTimeline,
            timelineLabel: getSelectedTimelineLabel(selectedTimeline),
            leadTemperature: getLeadTemperature(selectedTimeline),
            marketScope: `${cityName}, Colorado`,
            authoritySignals: INTAKE_SIGNALS.map((signal) => signal.label),
            notes: notes.trim(),
          },
        }),
      });
      const result = await readResponse(response);

      if (!response.ok) {
        throw new Error(result.error || 'Unable to save this strategy request right now.');
      }

      setSaveResult(result);
      setSubmitState('success');
    } catch (error) {
      setSubmitState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save this strategy request right now.');
    }
  }

  return (
    <section className="mt-16 overflow-hidden border border-white/10 bg-[#050505] shadow-2xl">
      <div className="grid gap-8 border-b border-white/5 bg-white/[0.02] p-8 lg:grid-cols-[1fr_0.7fr]">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-[#00ff80]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00ff80]">Private Strategy Intake</p>
          </div>
          <h2 className="mb-3 text-3xl font-black italic tracking-tight text-white">Build the {cityName} Strategy Brief</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-white/50 md:text-base">
            Request a David Quinn Group strategy brief before chasing listings. The REIE intake frames neighborhood fit, construction
            exposure, negotiation leverage, and the practical cost of the next move.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-px border border-white/10 bg-white/10">
          <Signal label="Market" value={cityName} />
          <Signal label="Mode" value={getSelectedGoalLabel(selectedGoal)} />
          <Signal label="Timing" value={getSelectedTimelineLabel(selectedTimeline)} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {submitState === 'success' ? (
          <div className="py-8 text-center animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center bg-[#00ff80]/15">
              <CheckCircle2 className="text-[#00ff80]" size={34} />
            </div>
            <h3 className="mb-3 text-xl font-black italic uppercase tracking-tight text-white">Strategy Request Initialized</h3>
            <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-white/50">
              {saveResult?.alertReadiness?.summary ||
                `Your ${cityName} REIE strategy request has been saved. The intake is now staged for follow-up routing and a more specific discovery brief.`}
            </p>
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {saveResult?.alertReadiness ? (
                <span className={`border px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] ${getReadinessClass(saveResult.alertReadiness.level)}`}>
                  Alert {saveResult.alertReadiness.level}
                </span>
              ) : null}
              <span className={`border px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] ${getTemperatureClass(saveResult?.intake?.leadTemperature)}`}>
                {saveResult?.intake?.leadTemperature || getLeadTemperature(selectedTimeline)}
              </span>
              {typeof saveResult?.intake?.heatScoreIncrement === 'number' ? (
                <span className="border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/50">
                  Heat +{saveResult.intake.heatScoreIncrement}
                </span>
              ) : null}
            </div>
            <div className="mx-auto grid max-w-lg gap-4 text-left sm:grid-cols-3">
              <PreviewCard label="Goal" value={saveResult?.intake?.reieGoalLabel || getSelectedGoalLabel(selectedGoal)} />
              <PreviewCard label="Timeline" value={saveResult?.intake?.timelineLabel || getSelectedTimelineLabel(selectedTimeline)} />
              <PreviewCard label="Market" value={cityName} />
            </div>
            {saveResult?.alertReadiness?.signals.length ? (
              <div className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-2">
                {saveResult.alertReadiness.signals.slice(0, 5).map((signal) => (
                  <span key={signal} className="border border-white/10 bg-black/40 px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white/40">
                    {signal}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <div className="mb-8 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
                {INTAKE_SIGNALS.map((signal) => (
                  <div key={signal.label} className="bg-[#050505] p-5">
                    <p className="mb-2 text-[9px] font-black uppercase tracking-[0.28em] text-[#00ff80]">{signal.label}</p>
                    <p className="text-sm font-black uppercase tracking-[0.12em] text-white">{signal.value}</p>
                    <p className="mt-3 text-xs leading-6 text-white/42">{signal.description}</p>
                  </div>
                ))}
              </div>

              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Primary Strategy</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    aria-pressed={selectedGoal === goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`group flex min-h-48 flex-col items-start border p-5 text-left transition-all ${
                      selectedGoal === goal.id
                        ? 'border-[#00ff80]/70 bg-[#00ff80]/10 text-white'
                        : 'border-white/10 bg-white/[0.03] text-white/50 hover:border-[#00ff80]/50 hover:text-white'
                    }`}
                  >
                    <span
                      className={selectedGoal === goal.id ? 'mb-4 text-[#00ff80]' : 'mb-4 text-white/30 group-hover:text-[#00ff80]'}
                    >
                      {goal.icon}
                    </span>
                    <span className="mb-3 text-sm font-black uppercase tracking-widest text-white">{goal.label}</span>
                    <span className="text-xs leading-relaxed text-white/45">{goal.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.7fr_1fr]">
              <div>
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Timeline</p>
                <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10">
                  {TIMELINES.map((timeline) => (
                    <button
                      key={timeline.id}
                      type="button"
                      aria-pressed={selectedTimeline === timeline.id}
                      onClick={() => setSelectedTimeline(timeline.id)}
                      className={`min-h-14 px-4 text-[10px] font-black uppercase tracking-[0.22em] transition-colors ${
                        selectedTimeline === timeline.id ? 'bg-[#00ff80] text-black' : 'bg-[#050505] text-white/45 hover:text-white'
                      }`}
                    >
                      {timeline.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="mb-4 block text-[10px] font-black uppercase tracking-[0.3em] text-white/30"
                  htmlFor="lead-capture-notes"
                >
                  Brief Context
                </label>
                <textarea
                  id="lead-capture-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Optional: neighborhood, property, timing, constraints, or what you need clarity on."
                  maxLength={500}
                  className="min-h-28 w-full resize-none border border-white/10 bg-white/[0.03] p-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#00ff80]/60"
                />
                <p className="mt-2 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
                  {notes.length}/500
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <label className="sr-only" htmlFor="lead-capture-email">
                Email address
              </label>
              <input
                id="lead-capture-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (submitState === 'error') {
                    setSubmitState('idle');
                    setErrorMessage('');
                  }
                }}
                placeholder="Secure email for strategy delivery"
                className="min-h-14 w-full border border-white/10 bg-white/[0.03] px-4 font-mono text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#00ff80]/60"
              />
              <button
                type="submit"
                disabled={submitState === 'submitting'}
                className="flex min-h-14 items-center justify-center gap-2 bg-[#00ff80] px-8 text-xs font-black uppercase tracking-[0.24em] text-black transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState === 'submitting' ? 'Saving' : 'Initialize'}
                <ChevronRight size={18} />
              </button>
            </div>

            {errorMessage ? (
              <p
                aria-live="polite"
                className="border border-red-500/20 bg-red-500/10 p-4 text-center text-xs font-bold uppercase tracking-widest text-red-200"
              >
                {errorMessage}
              </p>
            ) : null}

            <div className="flex items-center justify-center gap-3 border-t border-white/5 pt-6 text-center">
              <Lock className="shrink-0 text-white/20" size={14} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">
                Saves a DQG lead record and strategy task for follow-up routing.
              </p>
            </div>
          </div>
        )}
      </form>
    </section>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#050505] p-4">
      <p className="mb-2 text-[8px] font-black uppercase tracking-[0.24em] text-white/25">{label}</p>
      <p className="line-clamp-2 text-xs font-black uppercase italic text-white">{value}</p>
    </div>
  );
}

function PreviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-2 text-[9px] font-black uppercase tracking-[0.28em] text-white/25">{label}</p>
      <p className="text-sm font-black uppercase tracking-wide text-white">{value}</p>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/LeadCapture.tsx
