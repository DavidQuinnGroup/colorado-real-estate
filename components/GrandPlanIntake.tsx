'use client';

import { type FormEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react';
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

type PlanningThemeId =
  | 'daily-life-fit'
  | 'location-rhythm'
  | 'property-readiness'
  | 'community-connection'
  | 'privacy-space'
  | 'outdoor-access'
  | 'school-family'
  | 'long-term-flexibility'
  | 'timing-clarity'
  | 'market-context'
  | 'relocation-planning'
  | 'ownership-transition';

type PlanningTheme = {
  id: PlanningThemeId;
  title: string;
  body: string;
  question: string;
};

type StrategyPreviewStatus = 'Public Starting Point' | 'Advisor Review' | 'Contracted-Client Deep Dive';

type StrategyPreviewSection = {
  id: 'construction' | 'market' | 'timing' | 'property-fit' | 'next-step';
  title: string;
  body: string;
  status: StrategyPreviewStatus;
};

type AdvisorJourneyStage = {
  title: string;
  status?: 'Complete';
  body: string;
};

type DecisionPlanSection = {
  id: 'place' | 'property' | 'timing' | 'financing' | 'verification' | 'professional-questions' | 'next-step';
  label: string;
  known: string;
  assumed: string;
  unresolved: string;
  action: string;
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

const themeLibrary: Record<PlanningThemeId, PlanningTheme> = {
  'daily-life-fit': {
    id: 'daily-life-fit',
    title: 'Daily-Life Fit',
    body: 'Your priorities and routines should shape where the conversation begins.',
    question: 'Which routine would create the greatest improvement if it became easier?',
  },
  'location-rhythm': {
    id: 'location-rhythm',
    title: 'Location Rhythm',
    body: 'Multiple important places can change how each area feels day to day.',
    question: 'Which place should carry the most weight when comparing locations?',
  },
  'property-readiness': {
    id: 'property-readiness',
    title: 'Property Readiness',
    body: 'Condition, maintenance, and improvement comfort may matter alongside location.',
    question: 'How much project work feels comfortable after closing?',
  },
  'community-connection': {
    id: 'community-connection',
    title: 'Community Connection',
    body: 'The right move should account for the people and places that keep life connected.',
    question: 'Which connection would be hardest to give up?',
  },
  'privacy-space': {
    id: 'privacy-space',
    title: 'Privacy and Space',
    body: 'Room, quiet, and separation may be central to how a property supports daily life.',
    question: 'Where do you need more space or privacy than you have today?',
  },
  'outdoor-access': {
    id: 'outdoor-access',
    title: 'Outdoor Access',
    body: 'Colorado lifestyle needs can depend on how easily outdoor time fits into the week.',
    question: 'Which outdoor routine should stay easy to reach?',
  },
  'school-family': {
    id: 'school-family',
    title: 'School and Family Considerations',
    body: 'School, family, and care routines can shape the practical boundaries of a move.',
    question: 'Which family or school need should be protected first?',
  },
  'long-term-flexibility': {
    id: 'long-term-flexibility',
    title: 'Long-Term Flexibility',
    body: 'The next decision should leave room for future needs, not only today’s search.',
    question: 'What future change should this decision leave room for?',
  },
  'timing-clarity': {
    id: 'timing-clarity',
    title: 'Timing Clarity',
    body: 'Your timing helps determine whether the next step is exploration, preparation, or active decision-making.',
    question: 'What needs to happen before you would feel ready to move forward?',
  },
  'market-context': {
    id: 'market-context',
    title: 'Market Context',
    body: 'Your market focus gives the next conversation a clearer starting point.',
    question: 'Which tradeoff are you least willing to make in this market?',
  },
  'relocation-planning': {
    id: 'relocation-planning',
    title: 'Relocation Planning',
    body: 'Relocation decisions work best when daily routines are discussed before listings dominate the conversation.',
    question: 'What part of the move would benefit most from local context?',
  },
  'ownership-transition': {
    id: 'ownership-transition',
    title: 'Ownership Transition',
    body: 'A clear transition plan can help connect preparation, timing, and the next chapter.',
    question: 'What needs to feel settled before the transition begins?',
  },
};

const defaultThemeIds: PlanningThemeId[] = ['daily-life-fit', 'timing-clarity', 'market-context'];

const strategyPreviewSections: StrategyPreviewSection[] = [
  {
    id: 'construction',
    title: 'Construction Perspective',
    body: 'Questions about condition, maintenance, and improvement potential can be reviewed alongside your priorities.',
    status: 'Advisor Review',
  },
  {
    id: 'market',
    title: 'Market Context',
    body: 'Current inventory and local conditions help frame when and where to focus.',
    status: 'Public Starting Point',
  },
  {
    id: 'timing',
    title: 'Timing Considerations',
    body: 'Your timing helps determine whether the next step is exploration, preparation, or active decision-making.',
    status: 'Public Starting Point',
  },
  {
    id: 'property-fit',
    title: 'Property Fit',
    body: 'Location, condition, daily routines, and long-term flexibility should be considered together.',
    status: 'Contracted-Client Deep Dive',
  },
  {
    id: 'next-step',
    title: 'Next-Step Planning',
    body: 'A clear sequence of decisions can reduce uncertainty and make the next conversation more productive.',
    status: 'Advisor Review',
  },
];

const advisorJourneyStages: AdvisorJourneyStage[] = [
  {
    title: 'Your Grand Plan',
    status: 'Complete',
    body: 'You shared the priorities, places, timing, and context that should shape the next conversation.',
  },
  {
    title: 'Guided Property Discovery',
    body: 'Explore homes and locations through the priorities you identified.',
  },
  {
    title: 'Personalized Strategy Session',
    body: 'Review timing, tradeoffs, questions, and possible next steps with an advisor.',
  },
  {
    title: 'Confident Purchase or Sale',
    body: 'Move forward when the decision, property, and timing feel right.',
  },
];

const grandPlanUsePoints = [
  'Your priorities help focus the conversation.',
  'Important Places help us understand how location affects daily life.',
  'Your ownership goals help frame which questions deserve attention.',
  'Your Grand Plan can evolve as your needs, timing, and perspective change.',
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

function addTheme(themeIds: PlanningThemeId[], themeId: PlanningThemeId) {
  if (!themeIds.includes(themeId)) themeIds.push(themeId);
}

function getPlanningThemes(priorities: LifestylePriorityId[], selectedGoal: GoalId, selectedTimeline: TimelineId, places: ImportantPlace[]) {
  const themeIds: PlanningThemeId[] = [];

  for (const priority of priorities) {
    if (priority === 'daily-ease') addTheme(themeIds, 'daily-life-fit');
    if (priority === 'trails-outdoors') addTheme(themeIds, 'outdoor-access');
    if (priority === 'privacy-space') addTheme(themeIds, 'privacy-space');
    if (priority === 'schools-family') addTheme(themeIds, 'school-family');
    if (priority === 'renovation-readiness') addTheme(themeIds, 'property-readiness');
    if (priority === 'long-term-flexibility') addTheme(themeIds, 'long-term-flexibility');
    if (priority === 'community-connection') addTheme(themeIds, 'community-connection');
    if (priority === 'market-resilience') addTheme(themeIds, 'market-context');
  }

  if (selectedGoal === 'relocation-fit') addTheme(themeIds, 'relocation-planning');
  if (selectedGoal === 'sell-optimize') {
    addTheme(themeIds, 'ownership-transition');
    addTheme(themeIds, 'property-readiness');
  }
  if (selectedGoal === 'portfolio-review') addTheme(themeIds, 'long-term-flexibility');
  if (selectedGoal === 'buy-strategy') {
    addTheme(themeIds, 'daily-life-fit');
    addTheme(themeIds, 'market-context');
  }

  if (selectedTimeline === 'now' || selectedTimeline === 'ninety-days') addTheme(themeIds, 'timing-clarity');
  if (places.length > 1) addTheme(themeIds, 'location-rhythm');

  for (const themeId of defaultThemeIds) addTheme(themeIds, themeId);

  return themeIds.slice(0, 5).map((themeId) => themeLibrary[themeId]);
}

function getDiscussionPrompts(goalLabel: string, timelineLabel: string, places: ImportantPlace[], priorities: string[]) {
  const prompts = [
    'Which daily routine matters most when comparing locations?',
    'What would make your timing feel clearer?',
    'Which important place should carry the greatest weight?',
  ];

  if (priorities.includes('Renovation Readiness') || goalLabel === 'Preparing to Sell') {
    prompts.push('How much property improvement feels comfortable?');
  }

  if (timelineLabel === 'Now' || timelineLabel === 'Next 90 days') {
    prompts.push('What needs to happen before you would feel ready to move forward?');
  }

  if (places.length > 1) prompts.push('What tradeoff are you least willing to make around location?');
  if (goalLabel === 'Relocating') prompts.push('Which local context would make the move easier to compare?');
  if (goalLabel === 'Long-Term Ownership') prompts.push('What future need should this decision leave room for?');

  return Array.from(new Set(prompts)).slice(0, 5);
}

function getStrategyPreviewSections(priorities: LifestylePriorityId[], selectedGoal: GoalId, selectedTimeline: TimelineId, places: ImportantPlace[]) {
  const emphasized = new Set<StrategyPreviewSection['id']>();

  if (priorities.includes('renovation-readiness')) emphasized.add('construction');
  if (selectedGoal === 'relocation-fit' || priorities.includes('market-resilience')) emphasized.add('market');
  if (selectedGoal === 'relocation-fit' || selectedTimeline === 'now' || selectedTimeline === 'ninety-days') emphasized.add('timing');
  if (places.length > 1) emphasized.add('property-fit');

  return [...strategyPreviewSections]
    .sort((a, b) => Number(emphasized.has(b.id)) - Number(emphasized.has(a.id)))
    .map((section) => ({ ...section, isRelevant: emphasized.has(section.id) }));
}

function getDecisionPlanSections(
  priorities: string[],
  goalLabel: string,
  timelineLabel: string,
  market: string,
  places: ImportantPlace[],
  prompts: string[],
): DecisionPlanSection[] {
  const placeSummary = places.length
    ? places.map((place) => `${place.label} (${getCategoryLabel(place.category)})`).join('; ')
    : 'At least one important place or routine needs to be named.';
  const prioritySummary = priorities.length ? priorities.join(', ') : 'No lifestyle priorities selected yet.';
  const primaryPlace = places[0]?.label || 'the first important place';
  const firstPrompt = prompts[0] || 'Which decision should be clarified before the next step?';

  return [
    {
      id: 'place',
      label: 'Place',
      known: `${market} is the starting market, with ${placeSummary}`,
      assumed: 'Daily routines and place anchors should frame exploration before listings dominate the decision.',
      unresolved: `Which place should carry the most weight when tradeoffs appear?`,
      action: 'Open Search or Market context without passing hidden planner inputs.',
    },
    {
      id: 'property',
      label: 'Property',
      known: `${goalLabel} is the ownership context and ${prioritySummary} are the selected priorities.`,
      assumed: 'Property condition, layout, location, and source availability still need property-specific review.',
      unresolved: 'Which facts are visible, which are assumed, and which require documents, inspection, or source review?',
      action: 'Use property pages and comparison only to organize facts and questions, not to rank choices.',
    },
    {
      id: 'timing',
      label: 'Timing',
      known: `${timelineLabel} is the current timing posture.`,
      assumed: 'Timing is preparation context, not a pressure signal or prediction.',
      unresolved: 'What must be true before the next move is practical?',
      action: 'Use timing to sequence research, showings, selling preparation, or advisor review.',
    },
    {
      id: 'financing',
      label: 'Financing Assumptions',
      known: 'No lender approval, rate quote, or qualification is created by the Grand Plan.',
      assumed: 'Financing scenarios should use customer-entered assumptions and remain lender-neutral.',
      unresolved: 'Which payment, cash, timing, or sale-proceeds assumption should be tested with qualified professionals?',
      action: 'Continue to the certified financing readiness surface when assumptions need review.',
    },
    {
      id: 'verification',
      label: 'Verification Needs',
      known: 'REIE separates source availability from property quality.',
      assumed: 'More available evidence does not mean a better property, and missing county data does not mean a negative condition.',
      unresolved: `Which source, record, document, or professional review is needed before relying on the plan?`,
      action: 'Use Sources & Methodology before treating public records or REIE-derived context as decision evidence.',
    },
    {
      id: 'professional-questions',
      label: 'Professional Questions',
      known: firstPrompt,
      assumed: 'Advisor review can organize context without creating automated advice on this page.',
      unresolved: 'Which question should be answered before you compare homes, prepare a sale, or pause the process?',
      action: 'Bring the decision plan to the advisory conversation as a starting point.',
    },
    {
      id: 'next-step',
      label: 'Next Decision Step',
      known: `${primaryPlace} and ${goalLabel.toLowerCase()} are the current anchors.`,
      assumed: 'The next step should be customer-controlled and optional.',
      unresolved: 'Should the next action be search, market review, property review, financing assumption review, or advisor follow-up?',
      action: 'Choose one public REIE surface below; no hidden profile or cross-route state transfer occurs.',
    },
  ];
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
  const successTitleRef = useRef<HTMLHeadingElement>(null);
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
  const planningThemes = getPlanningThemes(selectedPriorities, goal, timeline, activeImportantPlaces);
  const discussionPrompts = getDiscussionPrompts(selectedGoalLabel, selectedTimelineLabel, activeImportantPlaces, selectedPriorityLabels);
  const strategyPreview = getStrategyPreviewSections(selectedPriorities, goal, timeline, activeImportantPlaces);
  const decisionPlanSections = getDecisionPlanSections(
    selectedPriorityLabels,
    selectedGoalLabel,
    selectedTimelineLabel,
    normalizedCity,
    activeImportantPlaces,
    discussionPrompts,
  );
  const currentStep = steps[currentStepIndex];
  const hasValidEmail = useMemo(() => isValidEmail(normalizedEmail), [normalizedEmail]);
  const isReviewStep = currentStep.id === 'review';
  const progressText = `Step ${currentStepIndex + 1} of ${steps.length}`;

  useEffect(() => {
    stepTitleRef.current?.focus();
  }, [currentStepIndex]);

  useEffect(() => {
    if (submitState === 'success') successTitleRef.current?.focus();
  }, [submitState]);

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
        data-grand-plan-result="public-starting-point"
        data-grand-plan-state="success"
        data-grand-plan-source={result?.intake?.source || ''}
        data-grand-plan-theme-count={planningThemes.length}
        data-grand-plan-read-only="true"
        aria-live="polite"
      >
        <div className="gp-result-hero">
          <div className="gp-completion-icon">
            <CheckCircle2 size={30} aria-hidden="true" />
          </div>
          <p className="gp-eyebrow">Your Grand Plan Starting Point</p>
          <h2 ref={successTitleRef} tabIndex={-1}>
            Your Grand Plan starting point is ready.
          </h2>
          <p>
            We saved your priorities, timing, and important places so the next conversation can begin with context instead of starting from
            scratch.
          </p>
        </div>

        <div className="gp-result-section gp-result-summary" data-testid="grand-plan-result-summary">
          <div>
            <p className="gp-eyebrow">Your Priorities</p>
            <h3>What you told us matters most</h3>
          </div>
          <ul className="gp-result-pill-list" aria-label="Selected lifestyle priorities">
            {selectedPriorityLabels.map((priority) => (
              <li key={priority}>{priority}</li>
            ))}
          </ul>
          <div className="gp-summary-grid">
            <SummaryCard label="Your Ownership Goal" value={result?.intake?.reieGoalLabel || selectedGoalLabel} />
            <SummaryCard label="Your Timing" value={result?.intake?.timelineLabel || selectedTimelineLabel} />
            <SummaryCard label="Primary Market" value={normalizedCity} />
          </div>
        </div>

        <div className="gp-result-section" data-testid="grand-plan-result-places">
          <div>
            <p className="gp-eyebrow">Your Important Places</p>
            <h3>Places and routines that shape the plan</h3>
          </div>
          <ul className="gp-result-place-list">
            {activeImportantPlaces.map((place) => (
              <li key={place.id}>
                <span>{place.label}</span>
                <span>
                  {getCategoryLabel(place.category)} | {getFrequencyOption(place.frequency).label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {normalizedNotes ? (
          <div className="gp-result-section" data-testid="grand-plan-result-context">
            <p className="gp-eyebrow">Additional Context</p>
            <p>{normalizedNotes}</p>
          </div>
        ) : null}

        <div className="gp-result-section" data-testid="grand-plan-result-themes">
          <div>
            <p className="gp-eyebrow">Your Planning Themes</p>
            <h3>Good topics for the first advisory conversation</h3>
          </div>
          <div className="gp-theme-grid">
            {planningThemes.map((theme) => (
              <article className="gp-theme-card" data-testid="grand-plan-result-theme" key={theme.id}>
                <h4>{theme.title}</h4>
                <p>{theme.body}</p>
                <p>
                  <span>Discuss:</span> {theme.question}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="gp-result-section gp-next-step" data-testid="grand-plan-result-prompts">
          <p className="gp-eyebrow">What We Should Explore Together</p>
          <ul>
            {discussionPrompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ul>
        </div>

        <section
          className="gp-result-section gp-decision-plan"
          data-testid="grand-plan-decision-plan"
          data-grand-plan-decision-plan-read-only="true"
          data-grand-plan-decision-plan-hidden-state-transfer="false"
          data-grand-plan-decision-plan-scoring="false"
          data-grand-plan-decision-plan-section-count={decisionPlanSections.length}
          aria-labelledby={`${formId}-decision-plan-title`}
        >
          <div>
            <p className="gp-eyebrow">Decision Plan Summary</p>
            <h3 id={`${formId}-decision-plan-title`}>Known, assumed, unresolved, and useful next steps</h3>
            <p>
              This summary organizes the context you entered. It does not rank properties, score places, predict outcomes, or move your
              planner inputs into other routes.
            </p>
          </div>
          <div className="gp-decision-plan-grid">
            {decisionPlanSections.map((section) => (
              <article
                className="gp-decision-plan-card"
                data-testid="grand-plan-decision-plan-section"
                data-grand-plan-decision-domain={section.id}
                key={section.id}
              >
                <h4>{section.label}</h4>
                <dl>
                  <div>
                    <dt>Known</dt>
                    <dd>{section.known}</dd>
                  </div>
                  <div>
                    <dt>Assumed</dt>
                    <dd>{section.assumed}</dd>
                  </div>
                  <div>
                    <dt>Unresolved</dt>
                    <dd>{section.unresolved}</dd>
                  </div>
                  <div>
                    <dt>Useful Next Step</dt>
                    <dd>{section.action}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section
          className="gp-result-section gp-strategy-preview"
          data-testid="grand-plan-strategy-preview"
          data-grand-plan-preview-read-only="true"
          aria-labelledby={`${formId}-strategy-preview-title`}
        >
          <div className="gp-strategy-preview-header">
            <div>
              <p className="gp-eyebrow">A Preview of Your Strategy Report</p>
              <h3 id={`${formId}-strategy-preview-title`}>What deeper advisor review can add</h3>
            </div>
            <p>
              Your public result summarizes the priorities you shared. Detailed property, construction, timing, and strategy review is
              prepared through direct advisor work and is not generated automatically on this page.
            </p>
          </div>
          <div className="gp-strategy-preview-list">
            {strategyPreview.map((section) => (
              <article
                className="gp-strategy-preview-card"
                data-testid="grand-plan-strategy-preview-section"
                data-grand-plan-preview-section={section.id}
                data-grand-plan-preview-status={section.status}
                data-grand-plan-preview-relevant={section.isRelevant ? 'true' : 'false'}
                key={section.id}
              >
                <div>
                  <h4>{section.title}</h4>
                  {section.isRelevant ? <p className="gp-preview-relevant">Relevant to Your Priorities</p> : null}
                </div>
                <p>{section.body}</p>
                <span className="gp-preview-status">
                  {section.status !== 'Public Starting Point' ? <LockKeyhole size={13} aria-hidden="true" /> : null}
                  {section.status}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section
          className="gp-advisor-journey"
          data-testid="grand-plan-advisor-journey"
          data-grand-plan-advisor-journey-read-only="true"
          aria-labelledby={`${formId}-advisor-journey-title`}
        >
          <div className="gp-result-section gp-continue-forward" data-testid="grand-plan-continue-from-here">
            <p className="gp-eyebrow">Continue From Here</p>
            <h3 id={`${formId}-advisor-journey-title`}>You are not starting over.</h3>
            <p>
              Your Grand Plan becomes the foundation for future conversations, property reviews, neighborhood exploration, and timing
              discussions. We continue building from what you have already shared, so you do not have to start over.
            </p>
          </div>

          <div className="gp-result-section gp-journey-map" data-testid="grand-plan-journey-map">
            <div>
              <p className="gp-eyebrow">Your Grand Plan Journey</p>
              <h3>An orientation map for what can come next</h3>
            </div>
            <ol aria-label="Grand Plan journey stages">
              {advisorJourneyStages.map((stage, index) => (
                <li key={stage.title}>
                  <span className="gp-journey-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <h4>
                      {stage.title}
                      {stage.status ? <span>{stage.status}</span> : null}
                    </h4>
                    <p>{stage.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="gp-result-section gp-plan-use" data-testid="grand-plan-how-we-use">
            <p className="gp-eyebrow">How We Use Your Grand Plan</p>
            <ul>
              {grandPlanUsePoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="gp-result-section gp-advisor-note" data-testid="grand-plan-advisor-commitment">
            <p className="gp-eyebrow">Our Commitment</p>
            <p>Our goal is not to convince you to move. It is to help you make the right decision when the time is right.</p>
            <p>That may mean acting soon, continuing to explore, or deciding that no move is the right move for now.</p>
          </div>

          <div className="gp-result-section gp-advisor-note" data-testid="grand-plan-right-pace">
            <p className="gp-eyebrow">Move at the Right Pace</p>
            <p>
              Some people are ready to move quickly. Others spend months refining priorities, exploring locations, or waiting for
              circumstances to change. Both are completely normal.
            </p>
            <p>Good decisions rarely come from unnecessary pressure.</p>
          </div>

          <div className="gp-cta-orientation" data-testid="grand-plan-cta-orientation">
            <p className="gp-eyebrow">Where Would You Like to Continue?</p>
            <p>You can return later and continue from your Grand Plan starting point.</p>
          </div>
        </section>

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
