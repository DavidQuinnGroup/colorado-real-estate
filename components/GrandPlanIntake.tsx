'use client';

import { type FormEvent, useId, useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

type GoalId = 'sell-optimize' | 'buy-strategy' | 'relocation-fit' | 'portfolio-review';

type TimelineId = 'now' | 'ninety-days' | 'six-months' | 'research';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

type SaveSearchResponse = {
  success?: boolean;
  error?: string;
  savedSearchId?: string;
  crmTaskId?: string | null;
  interactionId?: string;
  alertReadiness?: {
    level: 'ready' | 'watch' | 'incomplete';
    summary: string;
    blockers: string[];
    signals: string[];
  };
  intake?: {
    source?: string;
    sourceLabel?: string;
    reieGoalLabel?: string | null;
    timelineLabel?: string | null;
    primaryNorthStar?: string | null;
    northStarCount?: number;
    leadTemperature?: string;
  };
};

const goals: Array<{ id: GoalId; label: string; body: string }> = [
  {
    id: 'buy-strategy',
    label: 'Buy with a plan',
    body: 'Clarify location, lifestyle anchors, budget range, and due diligence priorities before touring seriously.',
  },
  {
    id: 'sell-optimize',
    label: 'Sell or prepare',
    body: 'Connect preparation, timing, equity goals, and likely buyer objections before choosing the next move.',
  },
  {
    id: 'relocation-fit',
    label: 'Relocation fit',
    body: 'Map daily-life requirements, commute logic, school or lifestyle anchors, and Front Range tradeoffs.',
  },
  {
    id: 'portfolio-review',
    label: 'Long-term ownership',
    body: 'Review durability, renovation exposure, maintenance horizon, and future flexibility.',
  },
];

const timelines: Array<{ id: TimelineId; label: string }> = [
  { id: 'now', label: 'Now' },
  { id: 'ninety-days', label: 'Next 90 days' },
  { id: 'six-months', label: 'Three to six months' },
  { id: 'research', label: 'Researching' },
];

const goalToLegacyGoal: Record<GoalId, string> = {
  'sell-optimize': 'equity-growth',
  'buy-strategy': 'lifestyle-optimization',
  'relocation-fit': 'lifestyle-optimization',
  'portfolio-review': 'retirement-income',
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getGoalLabel(goal: GoalId) {
  return goals.find((item) => item.id === goal)?.label || 'Grand Plan';
}

function getTimelineLabel(timeline: TimelineId) {
  return timelines.find((item) => item.id === timeline)?.label || 'Researching';
}

function getLeadTemperature(timeline: TimelineId) {
  if (timeline === 'now') return 'hot';
  if (timeline === 'ninety-days') return 'warm';
  return 'nurture';
}

async function readResponse(response: Response): Promise<SaveSearchResponse> {
  try {
    const body = (await response.json()) as SaveSearchResponse;
    return body && typeof body === 'object' ? body : {};
  } catch {
    return {};
  }
}

export default function GrandPlanIntake() {
  const formId = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Boulder');
  const [primaryAnchor, setPrimaryAnchor] = useState('');
  const [goal, setGoal] = useState<GoalId>('buy-strategy');
  const [timeline, setTimeline] = useState<TimelineId>('research');
  const [notes, setNotes] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<SaveSearchResponse | null>(null);
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();
  const normalizedCity = city.trim() || 'Colorado';
  const normalizedAnchor = primaryAnchor.trim();
  const normalizedNotes = notes.trim();
  const selectedGoalLabel = getGoalLabel(goal);
  const selectedTimelineLabel = getTimelineLabel(timeline);
  const hasValidEmail = useMemo(() => isValidEmail(normalizedEmail), [normalizedEmail]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!normalizedName) {
      setSubmitState('error');
      setErrorMessage('Enter your name so David Quinn Group can prepare the right follow-up.');
      return;
    }

    if (!hasValidEmail) {
      setSubmitState('error');
      setErrorMessage('Enter a valid email address.');
      return;
    }

    setSubmitState('submitting');
    setErrorMessage('');
    setResult(null);

    try {
      const response = await fetch('/api/save-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
          city: normalizedCity,
          type: 'Grand Plan Strategy',
          filters: {
            intakeSource: 'grand-plan',
            strategicGoal: goalToLegacyGoal[goal],
            reieGoal: goal,
            reieGoalLabel: selectedGoalLabel,
            timeline,
            timelineLabel: selectedTimelineLabel,
            leadTemperature: getLeadTemperature(timeline),
            marketScope: `${normalizedCity}, Colorado`,
            authoritySignals: ['Grand Plan', 'Market fit', 'Property strategy', 'Lifestyle anchors'],
            northStars: normalizedAnchor
              ? [
                  {
                    name: normalizedAnchor,
                    address: normalizedCity,
                    type: 'lifestyle',
                    frequency: 5,
                    lat: null,
                    lng: null,
                  },
                ]
              : [],
            notes: normalizedNotes,
          },
        }),
      });
      const body = await readResponse(response);

      if (!response.ok || !body.success) {
        throw new Error(body.error || 'Unable to save your Grand Plan request right now.');
      }

      setResult(body);
      setSubmitState('success');
    } catch (error) {
      setSubmitState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save your Grand Plan request right now.');
    }
  }

  if (submitState === 'success') {
    return (
      <section
        data-testid="grand-plan-completion"
        data-grand-plan-state="success"
        data-grand-plan-source={result?.intake?.source || ''}
        data-grand-plan-saved-search-id={result?.savedSearchId || ''}
        data-grand-plan-crm-task-id={result?.crmTaskId || ''}
        data-grand-plan-interaction-id={result?.interactionId || ''}
        data-grand-plan-alert-readiness={result?.alertReadiness?.level || ''}
      >
        <div className="gp-completion-icon">
          <CheckCircle2 size={30} aria-hidden="true" />
        </div>
        <p className="gp-eyebrow">Grand Plan Saved</p>
        <h2>
          Your starting point is ready for advisor review.
        </h2>
        <p>
          David Quinn Group will review your goal, timing, market focus, and planning notes before recommending the right next conversation.
        </p>
        <div className="gp-summary-grid">
          <SummaryCard label="Goal" value={result?.intake?.reieGoalLabel || selectedGoalLabel} />
          <SummaryCard label="Timing" value={result?.intake?.timelineLabel || selectedTimelineLabel} />
          <SummaryCard label="Market" value={normalizedCity} />
        </div>
        <div className="gp-next-step">
          <p>What happens next</p>
          <p>
            Your request is saved for direct follow-up. No automated recommendation, valuation, or email campaign is triggered by this form.
          </p>
        </div>
        <div className="gp-actions">
          <Link
            href="/search"
            className="gp-button gp-button-primary"
          >
            Explore Inventory
          </Link>
          <Link
            href="/contact"
            className="gp-button gp-button-secondary"
          >
            Contact David Quinn
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="grand-plan-intake"
      data-grand-plan-state={submitState}
      data-grand-plan-source="grand-plan"
      aria-labelledby={`${formId}-title`}
      aria-describedby={`${formId}-description ${formId}-notice`}
      noValidate
    >
      <div>
        <p className="gp-eyebrow">Initial Intake</p>
        <h2 id={`${formId}-title`}>Start with the decision you are trying to make.</h2>
        <p id={`${formId}-description`}>
          Share enough context for David Quinn Group to frame the first conversation around market fit, timing, property strategy, and the
          practical tradeoffs behind the move.
        </p>
      </div>

      <div className="gp-form-grid">
        <label htmlFor={`${formId}-name`}>
          Name
          <input
            id={`${formId}-name`}
            aria-label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />
        </label>
        <label htmlFor={`${formId}-email`}>
          Email
          <input
            id={`${formId}-email`}
            aria-label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            inputMode="email"
            required
          />
        </label>
        <label htmlFor={`${formId}-city`}>
          Primary market
          <input
            id={`${formId}-city`}
            aria-label="Primary market"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            autoComplete="address-level2"
            placeholder="Boulder"
          />
        </label>
        <label htmlFor={`${formId}-primary-anchor`}>
          Important anchor
          <input
            id={`${formId}-primary-anchor`}
            aria-label="Important anchor"
            value={primaryAnchor}
            onChange={(event) => setPrimaryAnchor(event.target.value)}
            placeholder="School, commute, trail access, family, renovation plan"
          />
        </label>
      </div>

      <fieldset className="gp-field-group">
        <legend className="gp-field-title">Primary goal</legend>
        <div className="gp-option-grid">
          {goals.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Primary goal: ${item.label}`}
              aria-pressed={goal === item.id}
              onClick={() => setGoal(item.id)}
              data-testid="grand-plan-goal"
              data-grand-plan-goal={item.id}
              data-grand-plan-goal-selected={goal === item.id ? 'true' : 'false'}
            >
              <span className="text-sm font-black uppercase tracking-[0.12em]">{item.label}</span>
              <span className="mt-3 block text-xs leading-6 text-white/52">{item.body}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="gp-field-group">
        <legend className="gp-field-title">Timeline</legend>
        <div className="gp-option-grid gp-timeline-grid">
          {timelines.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Timeline: ${item.label}`}
              aria-pressed={timeline === item.id}
              onClick={() => setTimeline(item.id)}
              data-testid="grand-plan-timeline"
              data-grand-plan-timeline={item.id}
              data-grand-plan-timeline-selected={timeline === item.id ? 'true' : 'false'}
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="gp-field-group" htmlFor={`${formId}-notes`}>
        What should this plan help solve?
        <textarea
          id={`${formId}-notes`}
          aria-label="What should this plan help solve?"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          maxLength={500}
          placeholder="Optional: homes you are considering, timing constraints, renovation questions, selling before buying, relocation concerns, or risk points."
        />
      </label>

      {submitState === 'error' ? (
        <p className="gp-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitState === 'submitting'}
        data-testid="grand-plan-submit"
      >
        {submitState === 'submitting' ? (
          <>
            <Loader2 size={17} aria-hidden="true" />
            Saving Plan
          </>
        ) : (
          <>
            Begin Grand Plan
            <ChevronRight size={17} aria-hidden="true" />
          </>
        )}
      </button>

      <div id={`${formId}-notice`} className="gp-notice">
        <ShieldCheck aria-hidden="true" />
        <p>
          This form requests advisory follow-up only. Do not submit confidential negotiating positions, financial limits, or client-confidential
          information until the applicable brokerage relationship and disclosures have been discussed. Review the{' '}
          <Link href="/privacy" className="font-bold text-cyan-100 underline underline-offset-4">
            Privacy Notice
          </Link>{' '}
          and{' '}
          <Link href="/terms" className="font-bold text-cyan-100 underline underline-offset-4">
            Terms of Use
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="gp-summary-card">
      <p>{label}</p>
      <p>{value}</p>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/GrandPlanIntake.tsx
