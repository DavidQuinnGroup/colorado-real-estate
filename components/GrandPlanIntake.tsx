'use client';

import { type FormEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

type GoalId = 'sell-optimize' | 'buy-strategy' | 'relocation-fit' | 'portfolio-review';

type TimelineId = 'now' | 'ninety-days' | 'six-months' | 'research';

type LifestylePriorityId =
  | 'daily-ease'
  | 'schools-family'
  | 'trails-outdoors'
  | 'privacy-space'
  | 'community-connection'
  | 'renovation-readiness'
  | 'long-term-flexibility'
  | 'market-resilience';

type AnchorCategoryId = 'work' | 'school' | 'family' | 'medical' | 'trail-recreation' | 'airport' | 'community-social' | 'other';

type FrequencyId = 'most-days' | 'few-times-week' | 'weekly' | 'few-times-month' | 'occasionally';

type ImportantPlace = {
  id: string;
  label: string;
  category: AnchorCategoryId;
  frequency: FrequencyId;
};

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

const lifestylePriorities: Array<{ id: LifestylePriorityId; label: string; body: string }> = [
  { id: 'daily-ease', label: 'Daily Ease', body: 'Keep ordinary routines practical.' },
  { id: 'schools-family', label: 'Schools and Family', body: 'Stay close to people or school needs.' },
  { id: 'trails-outdoors', label: 'Trails and Outdoors', body: 'Protect access to Colorado time outside.' },
  { id: 'privacy-space', label: 'Privacy and Space', body: 'Prioritize room, quiet, or separation.' },
  { id: 'community-connection', label: 'Community and Connection', body: 'Stay connected to people and places.' },
  { id: 'renovation-readiness', label: 'Renovation Readiness', body: 'Plan around repair and improvement reality.' },
  { id: 'long-term-flexibility', label: 'Long-Term Flexibility', body: 'Keep future options open.' },
  { id: 'market-resilience', label: 'Market Resilience', body: 'Think beyond the immediate search.' },
];

const goals: Array<{ id: GoalId; label: string; body: string }> = [
  {
    id: 'buy-strategy',
    label: 'Buying a Home',
    body: 'Prepare for a clearer purchase decision.',
  },
  {
    id: 'sell-optimize',
    label: 'Preparing to Sell',
    body: 'Think through timing and preparation.',
  },
  {
    id: 'relocation-fit',
    label: 'Relocating',
    body: 'Compare places through daily-life needs.',
  },
  {
    id: 'portfolio-review',
    label: 'Long-Term Ownership',
    body: 'Plan around ownership, maintenance, and flexibility.',
  },
];

const anchorCategories: Array<{ id: AnchorCategoryId; label: string }> = [
  { id: 'work', label: 'Work' },
  { id: 'school', label: 'School' },
  { id: 'family', label: 'Family' },
  { id: 'medical', label: 'Medical' },
  { id: 'trail-recreation', label: 'Trail or Recreation' },
  { id: 'airport', label: 'Airport' },
  { id: 'community-social', label: 'Community or Social' },
  { id: 'other', label: 'Other' },
];

const frequencyOptions: Array<{ id: FrequencyId; label: string; value: number }> = [
  { id: 'most-days', label: 'Most Days', value: 6 },
  { id: 'few-times-week', label: 'A Few Times a Week', value: 3 },
  { id: 'weekly', label: 'Weekly', value: 1 },
  { id: 'few-times-month', label: 'A Few Times a Month', value: 1 },
  { id: 'occasionally', label: 'Occasionally', value: 1 },
];

const MAX_IMPORTANT_PLACES = 3;

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
    title: 'Which priorities should shape the plan?',
    description: 'Select the lifestyle priorities that matter, then choose the ownership goal behind the conversation.',
  },
  {
    id: 'place',
    label: 'Your Important Places',
    kicker: 'Daily Life Context',
    title: 'Name the places or routines that should shape the plan.',
    description: 'Add up to three important places. They stay as planning context and are not converted into exact distance or commute claims.',
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

function getPriorityLabel(priority: LifestylePriorityId) {
  return lifestylePriorities.find((item) => item.id === priority)?.label || priority;
}

function getCategoryLabel(category: AnchorCategoryId) {
  return anchorCategories.find((item) => item.id === category)?.label || 'Other';
}

function getFrequencyOption(frequency: FrequencyId) {
  return frequencyOptions.find((item) => item.id === frequency) || frequencyOptions[frequencyOptions.length - 1];
}

function getLeadTemperature(timeline: TimelineId) {
  if (timeline === 'now') return 'hot';
  if (timeline === 'ninety-days') return 'warm';
  return 'nurture';
}

function getReviewValue(value: string, fallback: string) {
  return value.trim() || fallback;
}

function createImportantPlace(index = 1): ImportantPlace {
  return {
    id: `anchor-${index}`,
    label: '',
    category: 'other',
    frequency: 'weekly',
  };
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
  const [selectedPriorities, setSelectedPriorities] = useState<LifestylePriorityId[]>(['daily-ease']);
  const [importantPlaces, setImportantPlaces] = useState<ImportantPlace[]>([createImportantPlace()]);
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
  const normalizedNotes = notes.trim();
  const selectedGoalLabel = getGoalLabel(goal);
  const selectedTimelineLabel = getTimelineLabel(timeline);
  const selectedPriorityLabels = selectedPriorities.map(getPriorityLabel);
  const activeImportantPlaces = importantPlaces
    .map((place) => ({ ...place, label: place.label.trim() }))
    .filter((place) => place.label);
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
    if (stepId === 'priorities' && selectedPriorities.length === 0) {
      return 'Select at least one lifestyle priority before continuing.';
    }

    if (stepId === 'place' && activeImportantPlaces.length === 0) {
      return 'Add at least one important place or routine before continuing.';
    }

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

  function togglePriority(priority: LifestylePriorityId) {
    setSelectedPriorities((current) =>
      current.includes(priority) ? current.filter((item) => item !== priority) : [...current, priority],
    );
  }

  function updateImportantPlace(id: string, updates: Partial<Omit<ImportantPlace, 'id'>>) {
    setImportantPlaces((current) => current.map((place) => (place.id === id ? { ...place, ...updates } : place)));
  }

  function addImportantPlace() {
    setImportantPlaces((current) => {
      if (current.length >= MAX_IMPORTANT_PLACES) return current;

      const nextIndex = current.reduce((highest, place) => {
        const parsed = Number(place.id.replace('anchor-', ''));
        return Number.isFinite(parsed) ? Math.max(highest, parsed + 1) : highest;
      }, current.length + 1);

      return [...current, createImportantPlace(nextIndex)];
    });
  }

  function removeImportantPlace(id: string) {
    setImportantPlaces((current) => {
      const next = current.filter((place) => place.id !== id);
      return next.length > 0 ? next : [createImportantPlace()];
    });
  }

  function getPriorityReviewText() {
    return selectedPriorityLabels.length > 0 ? selectedPriorityLabels.join(', ') : 'Select at least one priority';
  }

  function getImportantPlacesReviewText() {
    if (activeImportantPlaces.length === 0) return 'Add at least one important place or routine';

    return activeImportantPlaces
      .map((place) => `${place.label} (${getFrequencyOption(place.frequency).label}, ${getCategoryLabel(place.category)})`)
      .join('; ');
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
            authoritySignals: ['Grand Plan', 'Market fit', 'Property strategy', ...selectedPriorityLabels],
            northStars: activeImportantPlaces.map((place) => ({
              name: place.label,
              address: `${getCategoryLabel(place.category)} - ${normalizedCity}`,
              type: place.category,
              frequency: getFrequencyOption(place.frequency).value,
              lat: null,
              lng: null,
            })),
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
          <SummaryCard label="Priorities" value={`${selectedPriorityLabels.length} selected`} />
          <SummaryCard label="Places" value={`${activeImportantPlaces.length} shared`} />
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
            <>
              <fieldset className="gp-field-group">
                <legend className="gp-field-title">Lifestyle priorities</legend>
                <div className="gp-option-grid gp-priority-grid" data-testid="grand-plan-lifestyle-priorities">
                  {lifestylePriorities.map((item) => {
                    const isSelected = selectedPriorities.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-label={`Lifestyle priority: ${item.label}`}
                        aria-pressed={isSelected}
                        onClick={() => togglePriority(item.id)}
                        data-testid="grand-plan-lifestyle-priority"
                        data-grand-plan-priority={item.id}
                        data-grand-plan-priority-selected={isSelected ? 'true' : 'false'}
                      >
                        <span>{item.label}</span>
                        <span>{item.body}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="gp-field-group">
                <legend className="gp-field-title">Ownership goal</legend>
                <div className="gp-option-grid" data-testid="grand-plan-ownership-goals">
                  {goals.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`Ownership goal: ${item.label}`}
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
            </>
          ) : null}

          {currentStep.id === 'place' ? (
            <fieldset className="gp-field-group gp-anchor-fieldset" data-testid="grand-plan-important-places">
              <legend className="gp-field-title">Important places and routines</legend>
              <div className="gp-anchor-list">
                {importantPlaces.map((place, index) => (
                  <div className="gp-anchor-card" data-testid="grand-plan-anchor-entry" key={place.id}>
                    <div className="gp-anchor-card-heading">
                      <p>Place {index + 1}</p>
                      {importantPlaces.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeImportantPlace(place.id)}
                          aria-label={`Remove place ${index + 1}`}
                          data-testid="grand-plan-remove-anchor"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                    <div className="gp-form-grid">
                      <label htmlFor={`${formId}-anchor-${place.id}`}>
                        Place or routine
                        <input
                          id={`${formId}-anchor-${place.id}`}
                          aria-label={`Place or routine ${index + 1}`}
                          value={place.label}
                          onChange={(event) => updateImportantPlace(place.id, { label: event.target.value })}
                          placeholder="School, trail, family, airport, work routine"
                        />
                      </label>
                      <label htmlFor={`${formId}-anchor-category-${place.id}`}>
                        Category
                        <select
                          id={`${formId}-anchor-category-${place.id}`}
                          aria-label={`Category for place ${index + 1}`}
                          value={place.category}
                          onChange={(event) => updateImportantPlace(place.id, { category: event.target.value as AnchorCategoryId })}
                        >
                          {anchorCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <fieldset className="gp-frequency-group">
                      <legend>How often does it matter?</legend>
                      <div className="gp-frequency-grid">
                        {frequencyOptions.map((frequency) => (
                          <button
                            type="button"
                            key={frequency.id}
                            aria-label={`Frequency for place ${index + 1}: ${frequency.label}`}
                            aria-pressed={place.frequency === frequency.id}
                            onClick={() => updateImportantPlace(place.id, { frequency: frequency.id })}
                            data-testid="grand-plan-anchor-frequency"
                            data-grand-plan-frequency={frequency.id}
                            data-grand-plan-frequency-selected={place.frequency === frequency.id ? 'true' : 'false'}
                          >
                            {frequency.label}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="gp-add-anchor"
                onClick={addImportantPlace}
                disabled={importantPlaces.length >= MAX_IMPORTANT_PLACES}
                data-testid="grand-plan-add-anchor"
              >
                Add Another Place
              </button>
            </fieldset>
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
              <ReviewItem label="Lifestyle priorities" value={getPriorityReviewText()} onEdit={() => setStep(0)} />
              <ReviewItem label="Ownership goal" value={selectedGoalLabel} onEdit={() => setStep(0)} />
              <ReviewItem label="Important places" value={getImportantPlacesReviewText()} onEdit={() => setStep(1)} />
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
      <button type="button" onClick={onEdit} aria-label={`Edit ${label}`} data-testid="grand-plan-review-edit">
        Edit
      </button>
    </article>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/GrandPlanIntake.tsx
