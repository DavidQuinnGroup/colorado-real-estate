'use client';

import { type FormEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

type GoalId = 'sell-optimize' | 'buy-strategy' | 'relocation-fit' | 'portfolio-review';

type TimelineId = 'now' | 'ninety-days' | 'six-months' | 'research';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

type StepId = 'priorities' | 'place' | 'timing' | 'context' | 'review';

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

const steps: Array<{ id: StepId; label: string; kicker: string; title: string; description: string }> = [
  {
    id: 'priorities',
    label: 'Your Priorities',
    kicker: 'Start With What Matters Most',
    title: 'What kind of real estate decision are you preparing for?',
    description: 'Choose the priority that best fits the decision in front of you. You can refine the details with David Quinn Group later.',
  },
  {
    id: 'place',
    label: 'Your Important Place',
    kicker: 'Daily Life Context',
    title: 'Name one place or routine that should shape the plan.',
    description: 'This can be a school, commute, family location, trail access point, renovation goal, or other anchor that matters in real life.',
  },
  {
    id: 'timing',
    label: 'Your Timing',
    kicker: 'Market Focus',
    title: 'Where and when should this conversation start?',
    description: 'Share the market or community you are focused on and the general timing for the decision.',
  },
  {
    id: 'context',
    label: 'Additional Context',
    kicker: 'Advisor Preparation',
    title: 'Add the context that would make the first conversation more useful.',
    description: 'A few practical notes are enough. Keep confidential financial limits and negotiating positions out of this public form.',
  },
  {
    id: 'review',
    label: 'Review Your Starting Point',
    kicker: 'Before You Submit',
    title: 'Review the starting point before it is saved.',
    description: 'Confirm the details below. Nothing is saved until you submit and the request is accepted.',
  },
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

function getReviewValue(value: string, fallback: string) {
  return value.trim() || fallback;
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
  const stepTitleRef = useRef<HTMLHeadingElement>(null);
  const reviewUnlockTimerRef = useRef<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Boulder');
  const [primaryAnchor, setPrimaryAnchor] = useState('');
  const [goal, setGoal] = useState<GoalId>('buy-strategy');
  const [timeline, setTimeline] = useState<TimelineId>('research');
  const [notes, setNotes] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [maxVisitedStepIndex, setMaxVisitedStepIndex] = useState(0);
  const [reviewSubmitReadyStep, setReviewSubmitReadyStep] = useState<number | null>(null);
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
  const currentStep = steps[currentStepIndex];
  const hasValidEmail = useMemo(() => isValidEmail(normalizedEmail), [normalizedEmail]);
  const isReviewStep = currentStep.id === 'review';
  const progressText = `Step ${currentStepIndex + 1} of ${steps.length}`;

  useEffect(() => {
    stepTitleRef.current?.focus();
  }, [currentStepIndex]);

  useEffect(() => {
    return () => {
      if (reviewUnlockTimerRef.current !== null) window.clearTimeout(reviewUnlockTimerRef.current);
    };
  }, []);

  function setStep(index: number) {
    const nextIndex = Math.max(0, Math.min(steps.length - 1, index));

    if (reviewUnlockTimerRef.current !== null) {
      window.clearTimeout(reviewUnlockTimerRef.current);
      reviewUnlockTimerRef.current = null;
    }

    setReviewSubmitReadyStep(null);

    if (steps[nextIndex].id === 'review') {
      reviewUnlockTimerRef.current = window.setTimeout(() => {
        setReviewSubmitReadyStep(nextIndex);
        reviewUnlockTimerRef.current = null;
      }, 300);
    }

    setCurrentStepIndex(nextIndex);
    setMaxVisitedStepIndex((current) => Math.max(current, nextIndex));
    setErrorMessage('');
    if (submitState === 'error') setSubmitState('idle');
  }

  function validateStep(stepId: StepId) {
    if (stepId === 'context') {
      if (!normalizedName) return 'Enter your name so David Quinn Group can prepare the right follow-up.';
      if (!hasValidEmail) return 'Enter a valid email address.';
    }

    return '';
  }

  function goToNextStep() {
    const validationError = validateStep(currentStep.id);

    if (validationError) {
      setSubmitState('error');
      setErrorMessage(validationError);
      return;
    }

    setStep(currentStepIndex + 1);
  }

  function goToPreviousStep() {
    setStep(currentStepIndex - 1);
  }

  function goToProgressStep(index: number) {
    if (index <= maxVisitedStepIndex) setStep(index);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    const isFinalSubmitter = submitter?.getAttribute('data-testid') === 'grand-plan-submit';

    if (!isFinalSubmitter) {
      if (!isReviewStep) goToNextStep();
      return;
    }

    if (!isReviewStep) {
      goToNextStep();
      return;
    }

    if (!normalizedName) {
      setStep(3);
      setSubmitState('error');
      setErrorMessage('Enter your name so David Quinn Group can prepare the right follow-up.');
      return;
    }

    if (!hasValidEmail) {
      setStep(3);
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
        aria-live="polite"
      >
        <div className="gp-completion-icon">
          <CheckCircle2 size={30} aria-hidden="true" />
        </div>
        <p className="gp-eyebrow">Grand Plan Saved</p>
        <h2>Your Grand Plan starting point has been saved for advisor review.</h2>
        <p>
          We will use your priorities, timing, and context to prepare for a more useful conversation.
        </p>
        <div className="gp-summary-grid">
          <SummaryCard label="Goal" value={result?.intake?.reieGoalLabel || selectedGoalLabel} />
          <SummaryCard label="Timing" value={result?.intake?.timelineLabel || selectedTimelineLabel} />
          <SummaryCard label="Market" value={normalizedCity} />
        </div>
        <div className="gp-next-step">
          <p>What happens next</p>
          <p>
            Your request is saved for direct follow-up. This form does not create automated advice, a private report, or a brokerage
            relationship by itself.
          </p>
        </div>
        <div className="gp-actions">
          <Link
            href="/contact"
            className="gp-button gp-button-primary"
            data-testid="grand-plan-success-primary-cta"
          >
            Continue With Advisor Follow-Up
          </Link>
          <Link
            href="/search"
            className="gp-button gp-button-secondary"
            data-testid="grand-plan-success-secondary-cta"
          >
            Explore Guided Search
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
      data-grand-plan-step={currentStep.id}
      data-grand-plan-step-index={currentStepIndex + 1}
      aria-labelledby={`${formId}-title`}
      aria-describedby={`${formId}-description ${formId}-progress ${formId}-notice`}
      noValidate
    >
      <div className="gp-step-shell">
        <div className="gp-step-progress" data-testid="grand-plan-progress" id={`${formId}-progress`}>
          <p>{progressText}</p>
          <ol aria-label="Grand Plan steps">
            {steps.map((step, index) => (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => goToProgressStep(index)}
                  disabled={index > maxVisitedStepIndex}
                  aria-current={index === currentStepIndex ? 'step' : undefined}
                  data-testid="grand-plan-progress-step"
                  data-grand-plan-progress-step={step.id}
                  data-grand-plan-progress-active={index === currentStepIndex ? 'true' : 'false'}
                  data-grand-plan-progress-available={index <= maxVisitedStepIndex ? 'true' : 'false'}
                >
                  <span>{index + 1}</span>
                  <span>{step.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="gp-step-heading" aria-live="polite">
          <p className="gp-eyebrow">{currentStep.kicker}</p>
          <h2 id={`${formId}-title`} ref={stepTitleRef} tabIndex={-1}>
            {currentStep.title}
          </h2>
          <p id={`${formId}-description`}>{currentStep.description}</p>
        </div>

        <div className="gp-step-body">
          {currentStep.id === 'priorities' ? (
            <fieldset className="gp-field-group">
              <legend className="gp-field-title">Your priority</legend>
              <div className="gp-option-grid">
                {goals.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Your priority: ${item.label}`}
                    aria-pressed={goal === item.id}
                    onClick={() => setGoal(item.id)}
                    data-testid="grand-plan-goal"
                    data-grand-plan-goal={item.id}
                    data-grand-plan-goal-selected={goal === item.id ? 'true' : 'false'}
                  >
                    <span>{item.label}</span>
                    <span>{item.body}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          {currentStep.id === 'place' ? (
            <div className="gp-form-grid gp-single-grid">
              <label htmlFor={`${formId}-primary-anchor`}>
                Important place or routine
                <input
                  id={`${formId}-primary-anchor`}
                  aria-label="Important place or routine"
                  value={primaryAnchor}
                  onChange={(event) => setPrimaryAnchor(event.target.value)}
                  placeholder="School, commute, trail access, family, renovation plan"
                />
              </label>
            </div>
          ) : null}

          {currentStep.id === 'timing' ? (
            <>
              <div className="gp-form-grid gp-single-grid">
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
              </div>
              <fieldset className="gp-field-group">
                <legend className="gp-field-title">Your timing</legend>
                <div className="gp-option-grid gp-timeline-grid">
                  {timelines.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Your timing: ${item.label}`}
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
            </>
          ) : null}

          {currentStep.id === 'context' ? (
            <>
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
              </div>
              <label className="gp-field-group" htmlFor={`${formId}-notes`}>
                What should we understand before advising you?
                <textarea
                  id={`${formId}-notes`}
                  aria-label="What should we understand before advising you?"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  maxLength={500}
                  placeholder="Optional: homes you are considering, timing constraints, renovation questions, selling before buying, relocation concerns, or practical risk points."
                />
              </label>
            </>
          ) : null}

          {isReviewStep ? (
            <div className="gp-review-grid" data-testid="grand-plan-review">
              <ReviewItem label="Goal" value={selectedGoalLabel} onEdit={() => setStep(0)} />
              <ReviewItem label="Important place" value={getReviewValue(primaryAnchor, 'Not specified yet')} onEdit={() => setStep(1)} />
              <ReviewItem label="Timing" value={selectedTimelineLabel} onEdit={() => setStep(2)} />
              <ReviewItem label="Market" value={normalizedCity} onEdit={() => setStep(2)} />
              <ReviewItem label="Additional context" value={getReviewValue(notes, 'No additional notes provided')} onEdit={() => setStep(3)} />
              <ReviewItem label="Name" value={getReviewValue(name, 'Name needed')} onEdit={() => setStep(3)} />
              <ReviewItem label="Email" value={getReviewValue(email, 'Email needed')} onEdit={() => setStep(3)} />
            </div>
          ) : null}
        </div>

        {submitState === 'error' ? (
          <p className="gp-error" role="alert" data-testid="grand-plan-error">
            {errorMessage}
          </p>
        ) : null}

        <div className="gp-step-actions">
          {currentStepIndex > 0 ? (
            <button type="button" className="gp-step-back" onClick={goToPreviousStep} data-testid="grand-plan-back">
              <ChevronLeft size={17} aria-hidden="true" />
              Back
            </button>
          ) : (
            <span aria-hidden="true" />
          )}
          {isReviewStep ? (
            <button
              type="submit"
              disabled={submitState === 'submitting' || reviewSubmitReadyStep !== currentStepIndex}
              data-testid="grand-plan-submit"
            >
              {submitState === 'submitting' ? (
                <>
                  <Loader2 size={17} aria-hidden="true" />
                  Saving Plan
                </>
              ) : (
                <>
                  Build My Grand Plan
                  <ChevronRight size={17} aria-hidden="true" />
                </>
              )}
            </button>
          ) : (
            <button type="button" onClick={goToNextStep} data-testid="grand-plan-continue">
              {currentStepIndex === steps.length - 2 ? 'Review' : 'Continue'}
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          )}
        </div>

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

function ReviewItem({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <article className="gp-review-item">
      <div>
        <p>{label}</p>
        <p>{value}</p>
      </div>
      <button type="button" onClick={onEdit} data-testid="grand-plan-review-edit">
        Edit
      </button>
    </article>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/GrandPlanIntake.tsx
