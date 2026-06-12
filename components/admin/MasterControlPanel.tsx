'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BellRing,
  CheckCircle2,
  DatabaseZap,
  Eye,
  EyeOff,
  Gauge,
  Loader2,
  Map as MapIcon,
  Radar,
  RefreshCcw,
  Shield,
  SlidersHorizontal,
  Terminal,
  ToggleLeft,
  ToggleRight,
  Users,
  WifiOff,
  Zap,
} from 'lucide-react';

type IntakePriority = 'High' | 'Medium' | 'Watch';

type IntakeSignal = {
  id: string;
  kind: 'crm_task' | 'interaction';
  name: string;
  email: string;
  userId: string;
  heatScore: number;
  source: string;
  sourceLabel: string;
  area: string;
  intent: 'Buyer' | 'Seller' | 'Investor' | 'Research';
  priority: IntakePriority;
  status: string;
  leadTemperature: string;
  heatScoreIncrement: number;
  authoritySignals: string[];
  primaryNorthStar: string | null;
  northStarCount: number;
  alertReadiness: {
    level: 'ready' | 'watch' | 'incomplete' | 'unknown';
    summary: string;
    blockers: string[];
    signals: string[];
  };
  hasNotes: boolean;
  nextAction: string;
  createdAt: string;
  metadata: Record<string, unknown>;
};

type IntakeSummary = {
  total: number;
  highPriority: number;
  crmTasks: number;
  interactions: number;
  hiddenPromotedInteractions: number;
  alertReady: number;
  alertWatch: number;
  alertIncomplete: number;
};

type IntakeSignalsResponse =
  | {
      success: true;
      signals: IntakeSignal[];
      summary: IntakeSummary;
      auth: {
        configured: boolean;
      };
    }
  | {
      success: false;
      error: string;
      detail?: string;
    };

type UpdateIntakeSignalResponse =
  | {
      success: true;
      signal: IntakeSignal;
      promoted?: boolean;
      auth: {
        configured: boolean;
      };
    }
  | {
      success: false;
      error: string;
      detail?: string;
    };

type ControlMetric = {
  label: string;
  value: string;
  detail: string;
  tone: 'cyan' | 'emerald' | 'amber' | 'red';
};

type ControlMode = 'ops' | 'monitor' | 'paused';

type ControlState = {
  strategyGate: number;
  areaCloud: boolean;
  privateLayer: boolean;
  killSwitchActive: boolean;
  mode: ControlMode;
  updatedBy: string;
  updatedAt: string;
};

type ControlPolicy = {
  automation: 'live' | 'monitor' | 'paused';
  publicExposure: 'open' | 'guided' | 'protected';
  mapPrecision: 'exact' | 'area-cloud';
  privateLayer: 'hidden' | 'visible';
  warnings: string[];
};

type ControlStateResponse =
  | {
      success: true;
      state: ControlState;
      policy: ControlPolicy;
      source: 'database' | 'default';
      auth: {
        configured: boolean;
      };
    }
  | {
      success: false;
      error: string;
      detail?: string;
      fallback?: ControlState;
    };

type MlsQueueStatus = {
  name: string;
  waiting: number;
  active: number;
  delayed: number;
  failed: number;
  completed: number;
  paused: boolean;
  health: 'healthy' | 'busy' | 'degraded';
};

type MlsPropertyFreshness = {
  total: number;
  active: number;
  stale: number;
  privateExclusive: number;
  stalePercent: number;
  latestMinutesAgo: number | null;
  newestMinutesAgo: number | null;
  staleThresholdHours: number;
  freshnessField: 'lastIntelligenceSync' | 'updatedAt';
};

type MlsCompletedJob = {
  queue: string;
  id?: string;
  name: string;
  finishedOn: string | null;
  returnvalue: unknown;
};

type MlsSearchIndexStatus = {
  checkedJobs: number;
  attempted: number;
  succeeded: number;
  failed: number;
  unattempted: number;
  unknown: number;
  health: 'healthy' | 'busy' | 'degraded';
  diagnostics: Array<{ area: string; message: string }>;
  recent: Array<{
    queue: string;
    id?: string;
    name: string;
    finishedOn: string | null;
    attempted: number | null;
    succeeded: number | null;
    failed: number | null;
    processed: number | null;
    indexed: boolean | null;
    error: string | null;
  }>;
};

type MlsOperationalReadiness = {
  level: 'ready' | 'watch' | 'blocked';
  summary: string;
  nextAction: string;
  nextTerminal: 'Terminal 3' | 'Terminal 5';
  nextCommand: string;
  gates: Array<{
    label: string;
    status: 'pass' | 'watch' | 'fail';
    detail: string;
  }>;
};

type MlsStatusResponse =
  | {
      success: true;
      status: 'healthy' | 'busy' | 'degraded';
      generatedAt: string;
      diagnostics: Array<{ area: string; message: string }>;
      recommendations: string[];
      syncDefaults?: {
        maxPages: number;
        pageSize: number;
        pageTimeoutMs: number;
        startPage: number;
      };
      syncLimits?: {
        pageTimeoutMs: number;
      };
      terminals?: {
        nextApp?: string;
        mlsPageWorker?: string;
        coordinator?: string;
        dockerAndTypesense?: string;
        statusChecks?: string;
        scriptsAndCurl?: string;
      };
      commands: {
        smokeOps?: string;
        smokeMlsStatus?: string;
        smokeSearch?: string;
        status: string;
        rawStatus?: string;
        searchCheck?: string;
        rawSearchCheck?: string;
        retryStatus: string;
        dryRunRetry?: string;
        dryRunRetryMlsSync: string;
        dryRunSyncPreview: string;
        liveSync?: string;
        forcedLiveSync?: string;
        deadLetter: string;
        deadLetterInspector?: string;
        deadLetterOpen?: string;
        worker: string;
      };
      propertyFreshness: MlsPropertyFreshness;
      operationalReadiness?: MlsOperationalReadiness;
      searchIndex?: MlsSearchIndexStatus;
      queues: MlsQueueStatus[];
      recentFailedJobs: Array<{
        queue: string;
        id?: string;
        name: string;
        attemptsMade: number;
        failedReason: string | null;
        finishedOn: string | null;
        dryRunRetryCommand: string;
        liveRetryCommand: string;
      }>;
      recentCompletedJobs?: MlsCompletedJob[];
    }
  | {
      success: false;
      error: string;
    };

type AlertExecutionPlan = {
  level: 'safe' | 'caution' | 'blocked';
  summary: string;
  nextAction: string;
  terminal: 'Terminal 5';
  nextCommand: string;
  liveAllowed: boolean;
  gates: Array<{
    label: string;
    status: 'pass' | 'watch' | 'fail';
    detail: string;
  }>;
};

type AlertStatusResponse =
  | {
      success: true;
      mode: 'status' | 'preview' | 'process';
      module: string;
      timeoutMs: number;
      commands: {
        terminal: string;
        status: string;
        dryRun: string;
        live: string;
        alertWorkerDryRun?: string;
        alertWorkerLiveOnce?: string;
        queueDashboard?: string;
        mlsStatus?: string;
        retryStatus?: string;
        deadLetter: string;
        scriptDryRun?: string;
        scriptLive?: string;
      };
      diagnostics: Array<{ area: string; message: string }>;
      executionPlan?: AlertExecutionPlan;
      recommendations: string[];
      stats: {
        pending: number;
        processing: number;
        sent: number;
        failed: number;
        skipped: number;
        actionable: number;
        terminal: number;
      };
    }
  | {
      success: false;
      error: string;
    };

type CRMTask = {
  id: string;
  leadId: string;
  email: string;
  name: string | null;
  heatScore: number;
  type: string;
  status: string;
  priority: 'high' | 'medium' | 'low' | 'unknown';
  title: string;
  createdAt: string;
  intentSummary: string | null;
  nextAction: string;
  tacticalLevers: string | null;
  latestSavedSearchIntake: {
    savedSearchId: string | null;
    capturedAt: string | null;
    city: string | null;
    marketScope: string | null;
    searchType: string | null;
    reieGoalLabel: string | null;
    timelineLabel: string | null;
    leadTemperature: string | null;
    sourceLabel: string | null;
    authoritySignals: string[];
    primaryNorthStar: string | null;
    northStarCount: number;
    hasNotes: boolean;
  } | null;
  propertyInquiry: {
    propertyId: string | null;
    mlsId: string | null;
    slug: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    price: number | null;
    propertyType: string | null;
    status: string | null;
    timelineLabel: string | null;
    leadTemperature: string | null;
    hasPhone: boolean;
    hasNotes: boolean;
  } | null;
  alertReadiness: {
    level: 'ready' | 'watch' | 'incomplete' | 'unknown';
    summary: string;
    blockers: string[];
    signals: string[];
  };
  operations: {
    terminal: 'Terminal 5';
    reviewCommand: string;
    intakeCommand: string;
    alertStatusCommand: string;
  };
};

type CRMTaskReviewStatus = 'reviewing' | 'completed' | 'dismissed';

type CRMTaskSummary = {
  total: number;
  pending: number;
  reviewing: number;
  completed: number;
  dismissed: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  preDiscoveryBriefs: number;
  strategyIntakes: number;
  propertyInquiries: number;
  alertReady: number;
  alertWatch: number;
  alertIncomplete: number;
  alertUnknown: number;
};

type CRMTaskAuditSummary = {
  closed: number;
  completed: number;
  dismissed: number;
  completedWithReview: number;
  completedMissingReview: number;
  dismissedWithReview: number;
  dismissedMissingReview: number;
  closureReviewReady: number;
  closureReviewMissing: number;
  closureReviewCoveragePercent: number;
};

type CRMTaskReadiness = {
  level: 'ready' | 'watch' | 'blocked';
  summary: string;
  nextAction: string;
  terminal: 'Terminal 5';
  nextCommand: string;
  gates: Array<{
    label: string;
    status: 'pass' | 'watch' | 'fail';
    detail: string;
  }>;
};

type CRMTaskOperations = {
  terminal: 'Terminal 5';
  reviewCommand: string;
  intakeCommand: string;
  alertStatusCommand: string;
};

type CRMTaskApiMetadata = {
  generatedAt: string;
  terminal: 'Terminal 5';
  inspectionSource: 'List Route' | 'Detail Route';
  route: string;
  command: string;
};

type CRMTaskApiErrorMetadata = Partial<CRMTaskApiMetadata>;

type CRMTasksResponse =
  | {
      success: true;
      generatedAt: string;
      terminal: 'Terminal 5';
      inspectionSource: 'List Route';
      route: string;
      command: string;
      tasks: CRMTask[];
      summary: CRMTaskSummary;
      audit: CRMTaskAuditSummary;
      readiness: CRMTaskReadiness;
      verdict: string;
      filters: {
        limit: number;
        status: string;
        effectiveStatuses: string[] | null;
        type: string | null;
      };
      operations: CRMTaskOperations;
      auth: {
        configured: boolean;
      };
    }
  | {
      success: false;
      error: string;
      detail?: string;
      generatedAt?: string;
      terminal?: 'Terminal 5';
      inspectionSource?: 'List Route';
      route?: string;
      command?: string;
    };

type UpdateCRMTaskResponse =
  | {
      success: true;
      generatedAt: string;
      terminal: 'Terminal 5';
      inspectionSource: 'Detail Route';
      route: string;
      command: string;
      task: CRMTask;
      auth: {
        configured: boolean;
      };
    }
  | {
      success: false;
      error: string;
      detail?: string;
      generatedAt?: string;
      terminal?: 'Terminal 5';
      inspectionSource?: 'Detail Route';
      route?: string;
      command?: string;
    };

const defaultControlState: ControlState = {
  strategyGate: 60,
  areaCloud: true,
  privateLayer: false,
  killSwitchActive: false,
  mode: 'ops',
  updatedBy: 'local-default',
  updatedAt: '',
};

const defaultControlPolicy: ControlPolicy = {
  automation: 'live',
  publicExposure: 'guided',
  mapPrecision: 'area-cloud',
  privateLayer: 'hidden',
  warnings: [],
};

const emptyIntakeSummary: IntakeSummary = {
  total: 0,
  highPriority: 0,
  crmTasks: 0,
  interactions: 0,
  hiddenPromotedInteractions: 0,
  alertReady: 0,
  alertWatch: 0,
  alertIncomplete: 0,
};

const emptyCRMTaskSummary: CRMTaskSummary = {
  total: 0,
  pending: 0,
  reviewing: 0,
  completed: 0,
  dismissed: 0,
  highPriority: 0,
  mediumPriority: 0,
  lowPriority: 0,
  preDiscoveryBriefs: 0,
  strategyIntakes: 0,
  propertyInquiries: 0,
  alertReady: 0,
  alertWatch: 0,
  alertIncomplete: 0,
  alertUnknown: 0,
};

const emptyCRMTaskAuditSummary: CRMTaskAuditSummary = {
  closed: 0,
  completed: 0,
  dismissed: 0,
  completedWithReview: 0,
  completedMissingReview: 0,
  dismissedWithReview: 0,
  dismissedMissingReview: 0,
  closureReviewReady: 0,
  closureReviewMissing: 0,
  closureReviewCoveragePercent: 100,
};

const emptyCRMTaskReadiness: CRMTaskReadiness = {
  level: 'ready',
  summary: 'CRM readiness has not been loaded.',
  nextAction: 'Load CRM task readiness from the admin API.',
  terminal: 'Terminal 5',
  nextCommand: 'npm run run:crm:active',
  gates: [],
};

const commandCards = [
  {
    label: 'Next.js App',
    terminal: 'Terminal 1',
    command: 'npm run dev',
  },
  {
    label: 'Infrastructure',
    terminal: 'Terminal 4',
    command: 'npm run infra:up',
  },
  {
    label: 'Fast Verification',
    terminal: 'Terminal 5',
    command: 'npm run check:fast',
  },
  {
    label: 'Search Reindex',
    terminal: 'Terminal 5',
    command: 'npm run worker:build && npm run typesense:init && npm run typesense:reindex',
  },
  {
    label: 'Operational Smoke',
    terminal: 'Terminal 5',
    command: 'npm run smoke:ops',
  },
  {
    label: 'MLS Status',
    terminal: 'Terminal 5',
    command: 'npm run smoke:mls-status',
  },
  {
    label: 'Search Smoke Readiness',
    terminal: 'Terminal 5',
    command: 'npm run smoke:search',
  },
  {
    label: 'Retry Status',
    terminal: 'Terminal 5',
    command: 'curl -s "http://localhost:3000/api/mls/retry"',
  },
  {
    label: 'Dead-Letter Inspector',
    terminal: 'Terminal 5',
    command: 'curl -s "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"',
  },
  {
    label: 'Alert Dry Run',
    terminal: 'Terminal 5',
    command: 'curl -s -X POST "http://localhost:3000/api/process-alerts?dryRun=true&limit=25"',
  },
];

const modeOptions: Array<{ value: ControlMode; label: string }> = [
  { value: 'ops', label: 'Ops' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'paused', label: 'Paused' },
];

function getPriorityClass(priority: IntakePriority) {
  if (priority === 'High') return 'border-red-400/40 bg-red-500/10 text-red-100';
  if (priority === 'Medium') return 'border-amber-300/40 bg-amber-400/10 text-amber-100';
  return 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100';
}

function getTemperatureClass(temperature: string) {
  if (temperature === 'hot') return 'border-red-400/40 bg-red-500/10 text-red-100';
  if (temperature === 'warm') return 'border-amber-300/40 bg-amber-400/10 text-amber-100';
  return 'border-slate-700 bg-black text-slate-300';
}

function getAlertReadinessClass(level: IntakeSignal['alertReadiness']['level']) {
  if (level === 'ready') return 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100';
  if (level === 'watch') return 'border-amber-300/40 bg-amber-400/10 text-amber-100';
  if (level === 'incomplete') return 'border-red-400/40 bg-red-500/10 text-red-100';
  return 'border-slate-700 bg-black text-slate-300';
}

function getToneClass(tone: ControlMetric['tone']) {
  if (tone === 'emerald') return 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100';
  if (tone === 'amber') return 'border-amber-300/40 bg-amber-400/10 text-amber-100';
  if (tone === 'red') return 'border-red-400/40 bg-red-500/10 text-red-100';
  return 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100';
}

function getHealthClass(health: MlsQueueStatus['health']) {
  if (health === 'healthy') return 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100';
  if (health === 'busy') return 'border-amber-300/40 bg-amber-400/10 text-amber-100';
  return 'border-red-400/40 bg-red-500/10 text-red-100';
}

function getReadinessClass(level: MlsOperationalReadiness['level']) {
  if (level === 'ready') return 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100';
  if (level === 'watch') return 'border-amber-300/40 bg-amber-400/10 text-amber-100';
  return 'border-red-400/40 bg-red-500/10 text-red-100';
}

function getAlertPlanClass(level: AlertExecutionPlan['level']) {
  if (level === 'safe') return 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100';
  if (level === 'caution') return 'border-amber-300/40 bg-amber-400/10 text-amber-100';
  return 'border-red-400/40 bg-red-500/10 text-red-100';
}

function getCRMTaskPriorityClass(priority: CRMTask['priority']) {
  if (priority === 'high') return 'border-red-400/40 bg-red-500/10 text-red-100';
  if (priority === 'medium') return 'border-amber-300/40 bg-amber-400/10 text-amber-100';
  if (priority === 'low') return 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100';
  return 'border-slate-700 bg-black text-slate-300';
}

function getCRMReadinessClass(level: CRMTaskReadiness['level']) {
  if (level === 'ready') return 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100';
  if (level === 'watch') return 'border-amber-300/40 bg-amber-400/10 text-amber-100';
  return 'border-red-400/40 bg-red-500/10 text-red-100';
}

function getCRMInspectionSourceClass(source: CRMTaskApiMetadata['inspectionSource']) {
  if (source === 'Detail Route') return 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100';
  return 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100';
}

function getCRMTaskTypeLabel(type: string) {
  if (type === 'property_inquiry') return 'Property Inquiry';
  if (type === 'strategy_intake') return 'Strategy Intake';
  if (type === 'PRE_DISCOVERY_BRIEF') return 'Pre-Discovery';
  return type || 'CRM Task';
}

function hasCRMTaskApiMetadata(payload: CRMTaskApiErrorMetadata): payload is CRMTaskApiMetadata {
  return Boolean(payload.generatedAt && payload.terminal && payload.inspectionSource && payload.route && payload.command);
}

function getGateClass(status: MlsOperationalReadiness['gates'][number]['status']) {
  if (status === 'pass') return 'border-emerald-300/20 bg-emerald-400/5 text-emerald-100';
  if (status === 'watch') return 'border-amber-300/30 bg-amber-400/10 text-amber-100';
  return 'border-red-400/30 bg-red-500/10 text-red-100';
}

function formatTimestamp(value: string) {
  if (!value) return 'Not synced';
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Not synced';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatMinutesAgo(value: number | null) {
  if (value === null) return 'No sync';
  if (value < 60) return `${value}m ago`;
  if (value < 1440) return `${Math.round(value / 60)}h ago`;
  return `${Math.round(value / 1440)}d ago`;
}

function formatMilliseconds(value: number | undefined) {
  if (value === undefined) return 'Not set';
  if (value < 1000) return `${value}ms`;
  return `${Math.round(value / 1000)}s`;
}

function formatCRMPrice(value: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'Price not recorded';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function getMlsQueue(mlsStatus: MlsStatusResponse | null, name: string) {
  return mlsStatus?.success ? mlsStatus.queues.find((queue) => queue.name === name) || null : null;
}

function getRecordValue(value: unknown, key: string) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return (value as Record<string, unknown>)[key] ?? null;
}

function formatBooleanStatus(value: unknown, trueLabel: string, falseLabel: string) {
  if (typeof value !== 'boolean') return null;
  return value ? trueLabel : falseLabel;
}

function formatJobResult(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'No return value recorded';

  const fetched = getRecordValue(value, 'fetched') ?? getRecordValue(value, 'listingsFetched');
  const processed = getRecordValue(value, 'processed');
  const succeeded = getRecordValue(value, 'succeeded') ?? getRecordValue(value, 'listingsSucceeded');
  const failed = getRecordValue(value, 'failed') ?? getRecordValue(value, 'listingsFailed');
  const indexAttempted = getRecordValue(value, 'indexAttempted');
  const indexSucceeded = getRecordValue(value, 'indexSucceeded');
  const indexFailed = getRecordValue(value, 'indexFailed');
  const searchIndexIndexed = formatBooleanStatus(getRecordValue(value, 'searchIndexIndexed'), 'indexed', 'not indexed');
  const searchIndexAttempted = formatBooleanStatus(getRecordValue(value, 'searchIndexAttempted'), 'index attempted', 'index not attempted');
  const searchIndexError = getRecordValue(value, 'searchIndexError');
  const warningCount = getRecordValue(value, 'warningCount');
  const stoppedReason = getRecordValue(value, 'stoppedReason');

  const parts = [
    fetched !== null ? `${fetched} fetched` : null,
    processed !== null ? `${processed} processed` : null,
    succeeded !== null ? `${succeeded} succeeded` : null,
    failed !== null ? `${failed} failed` : null,
    indexAttempted !== null ? `${indexAttempted} index attempts` : null,
    indexSucceeded !== null ? `${indexSucceeded} indexed` : null,
    indexFailed !== null ? `${indexFailed} index failed` : null,
    searchIndexAttempted,
    searchIndexIndexed,
    searchIndexError ? `index error: ${searchIndexError}` : null,
    warningCount !== null ? `${warningCount} warnings` : null,
    stoppedReason !== null ? `stopped: ${stoppedReason}` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(' / ') : 'Return value recorded';
}

function formatSearchIndexDetail(searchIndex: MlsSearchIndexStatus | undefined) {
  if (!searchIndex) return 'Search-index diagnostics are unavailable.';
  if (searchIndex.checkedJobs === 0) return 'No recent completed indexing jobs checked.';

  return `${searchIndex.attempted} attempted, ${searchIndex.succeeded} indexed, ${searchIndex.failed} failed, ${searchIndex.unknown} unknown.`;
}

function MetricCell({ metric }: { metric: ControlMetric }) {
  return (
    <div className="border border-slate-800 bg-black/70 p-4">
      <div className={`mb-3 inline-flex border px-2 py-1 text-[10px] font-black uppercase ${getToneClass(metric.tone)}`}>
        {metric.label}
      </div>
      <div className="text-2xl font-black uppercase leading-none text-white">{metric.value}</div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{metric.detail}</p>
    </div>
  );
}

function ToggleControl({
  active,
  activeLabel,
  disabled,
  inactiveLabel,
  icon: Icon,
  onClick,
  testId,
}: {
  active: boolean;
  activeLabel: string;
  disabled?: boolean;
  inactiveLabel: string;
  icon: LucideIcon;
  onClick: () => void;
  testId: string;
}) {
  const ToggleIcon = active ? ToggleRight : ToggleLeft;

  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-4 border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
        active ? 'border-cyan-300/50 bg-cyan-300/10 text-white' : 'border-slate-800 bg-black text-slate-400 hover:border-slate-600'
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <Icon size={18} className={active ? 'text-cyan-300' : 'text-slate-500'} />
        <span className="truncate text-sm font-black uppercase">{active ? activeLabel : inactiveLabel}</span>
      </span>
      <ToggleIcon size={22} className={active ? 'text-cyan-300' : 'text-slate-600'} />
    </button>
  );
}

export default function MasterControlPanel() {
  const [controlState, setControlState] = useState<ControlState>(defaultControlState);
  const [controlPolicy, setControlPolicy] = useState<ControlPolicy>(defaultControlPolicy);
  const [isLoadingState, setIsLoadingState] = useState(true);
  const [isSavingState, setIsSavingState] = useState(false);
  const [controlStateError, setControlStateError] = useState<string | null>(null);
  const [stateSource, setStateSource] = useState<'database' | 'default' | 'local'>('local');
  const [intakeSignals, setIntakeSignals] = useState<IntakeSignal[]>([]);
  const [intakeSummary, setIntakeSummary] = useState<IntakeSummary>(emptyIntakeSummary);
  const [isLoadingIntake, setIsLoadingIntake] = useState(true);
  const [intakeError, setIntakeError] = useState<string | null>(null);
  const [reviewingSignalId, setReviewingSignalId] = useState<string | null>(null);
  const [mlsStatus, setMlsStatus] = useState<MlsStatusResponse | null>(null);
  const [isLoadingMlsStatus, setIsLoadingMlsStatus] = useState(true);
  const [mlsStatusError, setMlsStatusError] = useState<string | null>(null);
  const [alertStatus, setAlertStatus] = useState<AlertStatusResponse | null>(null);
  const [isLoadingAlertStatus, setIsLoadingAlertStatus] = useState(true);
  const [alertStatusError, setAlertStatusError] = useState<string | null>(null);
  const [crmTasks, setCRMTasks] = useState<CRMTask[]>([]);
  const [crmTaskSummary, setCRMTaskSummary] = useState<CRMTaskSummary>(emptyCRMTaskSummary);
  const [crmTaskAuditSummary, setCRMTaskAuditSummary] = useState<CRMTaskAuditSummary>(emptyCRMTaskAuditSummary);
  const [crmTaskReadiness, setCRMTaskReadiness] = useState<CRMTaskReadiness>(emptyCRMTaskReadiness);
  const [crmTaskVerdict, setCRMTaskVerdict] = useState('');
  const [crmTaskOperations, setCRMTaskOperations] = useState<CRMTaskOperations | null>(null);
  const [crmTaskApiMetadata, setCRMTaskApiMetadata] = useState<CRMTaskApiMetadata | null>(null);
  const [lastCRMTaskDetailApiMetadata, setLastCRMTaskDetailApiMetadata] = useState<CRMTaskApiMetadata | null>(null);
  const [isLoadingCRMTasks, setIsLoadingCRMTasks] = useState(true);
  const [crmTaskError, setCRMTaskError] = useState<string | null>(null);
  const [reviewingCRMTaskId, setReviewingCRMTaskId] = useState<string | null>(null);
  const [crmTaskReviewNotes, setCRMTaskReviewNotes] = useState<Record<string, string>>({});
  const controlStateRef = useRef<ControlState>(defaultControlState);

  const applyControlState = useCallback((nextState: ControlState) => {
    controlStateRef.current = nextState;
    setControlState(nextState);
  }, []);

  const loadControlState = useCallback(async () => {
    setIsLoadingState(true);
    setControlStateError(null);

    try {
      const response = await fetch('/api/admin/control-state', {
        cache: 'no-store',
      });
      const payload = (await response.json()) as ControlStateResponse;

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? 'Control state could not be loaded.' : payload.error);
      }

      applyControlState(payload.state);
      setControlPolicy(payload.policy);
      setStateSource(payload.source);
    } catch (error) {
      setControlStateError(error instanceof Error ? error.message : 'Control state could not be loaded.');
      setControlPolicy(defaultControlPolicy);
      setStateSource('local');
    } finally {
      setIsLoadingState(false);
    }
  }, [applyControlState]);

  const loadIntakeSignals = useCallback(async () => {
    setIsLoadingIntake(true);
    setIntakeError(null);

    try {
      const response = await fetch('/api/admin/intake-signals?limit=6', {
        cache: 'no-store',
      });
      const payload = (await response.json()) as IntakeSignalsResponse;

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? 'Intake signals could not be loaded.' : payload.error);
      }

      setIntakeSignals(payload.signals);
      setIntakeSummary(payload.summary);
    } catch (error) {
      setIntakeError(error instanceof Error ? error.message : 'Intake signals could not be loaded.');
      setIntakeSignals([]);
      setIntakeSummary(emptyIntakeSummary);
    } finally {
      setIsLoadingIntake(false);
    }
  }, []);

  const loadMlsStatus = useCallback(async () => {
    setIsLoadingMlsStatus(true);
    setMlsStatusError(null);

    try {
      const response = await fetch('/api/mls/status', {
        cache: 'no-store',
      });
      const payload = (await response.json()) as MlsStatusResponse;

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? 'MLS status could not be loaded.' : payload.error);
      }

      setMlsStatus(payload);
    } catch (error) {
      setMlsStatusError(error instanceof Error ? error.message : 'MLS status could not be loaded.');
      setMlsStatus(null);
    } finally {
      setIsLoadingMlsStatus(false);
    }
  }, []);

  const loadAlertStatus = useCallback(async () => {
    setIsLoadingAlertStatus(true);
    setAlertStatusError(null);

    try {
      const response = await fetch('/api/process-alerts', {
        cache: 'no-store',
      });
      const payload = (await response.json()) as AlertStatusResponse;

      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? 'Alert status could not be loaded.' : payload.error);
      }

      setAlertStatus(payload);
    } catch (error) {
      setAlertStatusError(error instanceof Error ? error.message : 'Alert status could not be loaded.');
      setAlertStatus(null);
    } finally {
      setIsLoadingAlertStatus(false);
    }
  }, []);

  const loadCRMTasks = useCallback(async () => {
    setIsLoadingCRMTasks(true);
    setCRMTaskError(null);

    try {
      const response = await fetch('/api/admin/crm-tasks?limit=6&status=active', {
        cache: 'no-store',
      });
      const payload = (await response.json()) as CRMTasksResponse;

      if (!response.ok || !payload.success) {
        if (!payload.success && hasCRMTaskApiMetadata(payload)) {
          setCRMTaskApiMetadata(payload);
        }
        throw new Error(payload.success ? 'CRM tasks could not be loaded.' : payload.error);
      }

      setCRMTasks(payload.tasks);
      setCRMTaskSummary(payload.summary);
      setCRMTaskAuditSummary(payload.audit);
      setCRMTaskReadiness(payload.readiness);
      setCRMTaskVerdict(payload.verdict);
      setCRMTaskOperations(payload.operations);
      setCRMTaskApiMetadata({
        generatedAt: payload.generatedAt,
        terminal: payload.terminal,
        inspectionSource: payload.inspectionSource,
        route: payload.route,
        command: payload.command,
      });
    } catch (error) {
      setCRMTaskError(error instanceof Error ? error.message : 'CRM tasks could not be loaded.');
      setCRMTasks([]);
      setCRMTaskSummary(emptyCRMTaskSummary);
      setCRMTaskAuditSummary(emptyCRMTaskAuditSummary);
      setCRMTaskReadiness(emptyCRMTaskReadiness);
      setCRMTaskVerdict('');
      setCRMTaskOperations(null);
      setCRMTaskApiMetadata(null);
    } finally {
      setIsLoadingCRMTasks(false);
    }
  }, []);

  const saveControlState = useCallback(
    async (patch: Partial<ControlState>) => {
      const previousState = controlStateRef.current;
      const nextState = {
        ...previousState,
        ...patch,
        updatedBy: 'admin-panel',
      };

      applyControlState(nextState);
      setIsSavingState(true);
      setControlStateError(null);

      try {
        const response = await fetch('/api/admin/control-state', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(nextState),
        });
        const payload = (await response.json()) as ControlStateResponse;

        if (!response.ok || !payload.success) {
          throw new Error(payload.success ? 'Control state could not be saved.' : payload.error);
        }

        applyControlState(payload.state);
        setControlPolicy(payload.policy);
        setStateSource(payload.source);
      } catch (error) {
        applyControlState(previousState);
        setControlStateError(error instanceof Error ? error.message : 'Control state could not be saved.');
      } finally {
        setIsSavingState(false);
      }
    },
    [applyControlState],
  );

  const reviewIntakeSignal = useCallback(
    async (signal: IntakeSignal) => {
      setReviewingSignalId(signal.id);
      setIntakeError(null);

      try {
        const isInteraction = signal.kind === 'interaction';
        const response = await fetch(`/api/admin/intake-signals/${encodeURIComponent(signal.id)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            kind: signal.kind,
            ...(isInteraction ? { action: 'promote' } : {}),
            status: 'reviewing',
            priority: signal.priority === 'High' ? 'high' : signal.priority === 'Medium' ? 'medium' : 'low',
            reviewNote: isInteraction ? 'Promoted from Master Control Panel.' : 'Marked reviewing from Master Control Panel.',
            reviewedBy: 'admin-panel',
          }),
        });
        const payload = (await response.json()) as UpdateIntakeSignalResponse;

        if (!response.ok || !payload.success) {
          throw new Error(payload.success ? 'Intake signal could not be reviewed.' : payload.error);
        }

        setIntakeSignals((currentSignals) =>
          currentSignals.map((currentSignal) =>
            currentSignal.id === signal.id || currentSignal.id === payload.signal.id ? payload.signal : currentSignal,
          ),
        );
        await loadIntakeSignals();
        await loadCRMTasks();
      } catch (error) {
        setIntakeError(error instanceof Error ? error.message : 'Intake signal could not be updated.');
      } finally {
        setReviewingSignalId(null);
      }
    },
    [loadCRMTasks, loadIntakeSignals],
  );

  const updateCRMTaskStatus = useCallback(
    async (task: CRMTask, status: CRMTaskReviewStatus, reviewNote: string) => {
      setReviewingCRMTaskId(task.id);
      setCRMTaskError(null);

      try {
        const response = await fetch(`/api/admin/crm-tasks/${encodeURIComponent(task.id)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status,
            priority: task.priority === 'unknown' ? 'medium' : task.priority,
            reviewNote,
            reviewedBy: 'admin-panel',
          }),
        });
        const payload = (await response.json()) as UpdateCRMTaskResponse;

        if (!response.ok || !payload.success) {
          if (!payload.success && hasCRMTaskApiMetadata(payload)) {
            setCRMTaskApiMetadata(payload);
            if (payload.inspectionSource === 'Detail Route') {
              setLastCRMTaskDetailApiMetadata(payload);
            }
          }
          throw new Error(payload.success ? 'CRM task could not be reviewed.' : payload.error);
        }

        setCRMTasks((currentTasks) => currentTasks.map((currentTask) => (currentTask.id === task.id ? payload.task : currentTask)));
        const detailApiMetadata: CRMTaskApiMetadata = {
          generatedAt: payload.generatedAt,
          terminal: payload.terminal,
          inspectionSource: payload.inspectionSource,
          route: payload.route,
          command: payload.command,
        };

        setCRMTaskApiMetadata(detailApiMetadata);
        setLastCRMTaskDetailApiMetadata(detailApiMetadata);
        if (status === 'completed' || status === 'dismissed') {
          setCRMTaskReviewNotes((currentNotes) => {
            const nextNotes = { ...currentNotes };
            delete nextNotes[task.id];
            return nextNotes;
          });
        }
        await loadCRMTasks();
      } catch (error) {
        setCRMTaskError(error instanceof Error ? error.message : 'CRM task could not be updated.');
      } finally {
        setReviewingCRMTaskId(null);
      }
    },
    [loadCRMTasks],
  );

  const reviewCRMTask = useCallback(
    async (task: CRMTask) => {
      await updateCRMTaskStatus(task, 'reviewing', 'Marked reviewing from Master Control Panel.');
    },
    [updateCRMTaskStatus],
  );

  const closeCRMTask = useCallback(
    async (task: CRMTask, status: Extract<CRMTaskReviewStatus, 'completed' | 'dismissed'>) => {
      const reviewNote = (crmTaskReviewNotes[task.id] || '').trim();

      if (!reviewNote) {
        setCRMTaskError('A review note is required before completing or dismissing a CRM task.');
        return;
      }

      await updateCRMTaskStatus(task, status, reviewNote);
    },
    [crmTaskReviewNotes, updateCRMTaskStatus],
  );

  const updateCRMTaskReviewNote = useCallback((taskId: string, reviewNote: string) => {
    setCRMTaskReviewNotes((currentNotes) => ({
      ...currentNotes,
      [taskId]: reviewNote,
    }));
  }, []);

  const updateLocalStrategyGate = useCallback(
    (strategyGate: number) => {
      applyControlState({
        ...controlStateRef.current,
        strategyGate,
      });
    },
    [applyControlState],
  );

  const commitStrategyGate = useCallback(() => {
    void saveControlState({ strategyGate: controlStateRef.current.strategyGate });
  }, [saveControlState]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadControlState();
      void loadIntakeSignals();
      void loadCRMTasks();
      void loadMlsStatus();
      void loadAlertStatus();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadAlertStatus, loadCRMTasks, loadControlState, loadIntakeSignals, loadMlsStatus]);

  const controlMetrics = useMemo<ControlMetric[]>(
    () => [
      {
        label: 'Public Blur',
        value: `${controlState.strategyGate}%`,
        detail: `Public exposure policy: ${controlPolicy.publicExposure}. Controls how much strategic inventory context remains gated.`,
        tone: controlPolicy.publicExposure === 'protected' ? 'amber' : 'cyan',
      },
      {
        label: 'Area Cloud',
        value: controlPolicy.mapPrecision === 'area-cloud' ? 'Active' : 'Off',
        detail: controlPolicy.mapPrecision === 'area-cloud'
          ? 'Map intelligence favors protected area signals over exact public pin exposure.'
          : 'Public map pins are precise.',
        tone: controlPolicy.mapPrecision === 'area-cloud' ? 'emerald' : 'amber',
      },
      {
        label: 'Lead Queue',
        value: isLoadingIntake ? '...' : `${intakeSummary.total}`,
        detail: `${intakeSummary.highPriority} high priority, ${intakeSummary.alertReady} alert-ready, ${intakeSummary.alertIncomplete} incomplete, ${intakeSummary.hiddenPromotedInteractions} already promoted.`,
        tone: intakeSummary.highPriority > 0 ? 'red' : 'cyan',
      },
      {
        label: 'CRM Tasks',
        value: isLoadingCRMTasks ? '...' : `${crmTaskSummary.total}`,
        detail: `${crmTaskReadiness.level}: ${crmTaskSummary.pending} pending, ${crmTaskSummary.reviewing} reviewing, ${crmTaskAuditSummary.closureReviewCoveragePercent}% closure audit coverage.`,
        tone:
          crmTaskReadiness.level === 'blocked'
            ? 'red'
            : crmTaskReadiness.level === 'ready'
              ? 'emerald'
              : 'amber',
      },
      {
        label: 'System Mode',
        value: controlPolicy.automation,
        detail:
          controlPolicy.automation === 'paused'
            ? 'Public automation should remain paused until manually cleared.'
            : `Control state is in ${controlPolicy.automation} mode and accepting operational changes.`,
        tone: controlPolicy.automation === 'paused' ? 'red' : controlPolicy.automation === 'monitor' ? 'amber' : 'emerald',
      },
      {
        label: 'MLS Health',
        value: isLoadingMlsStatus ? '...' : mlsStatus?.success ? mlsStatus.status : 'Offline',
        detail: mlsStatus?.success
          ? `${mlsStatus.propertyFreshness.stalePercent}% stale, ${mlsStatus.recentFailedJobs.length} failed jobs, ${
              mlsStatus.searchIndex?.failed ?? 0
            } index failures, ${
              mlsStatus.recentCompletedJobs?.length || 0
            } recent completions.`
          : 'MLS operations status is unavailable.',
        tone: mlsStatus?.success ? (mlsStatus.status === 'healthy' ? 'emerald' : mlsStatus.status === 'busy' ? 'amber' : 'red') : 'red',
      },
      {
        label: 'Alert Ops',
        value: isLoadingAlertStatus ? '...' : alertStatus?.success ? alertStatus.executionPlan?.level || 'status' : 'Offline',
        detail: alertStatus?.success
          ? `${alertStatus.stats.pending} pending, ${alertStatus.stats.processing} processing, ${alertStatus.stats.failed} failed, live ${
              alertStatus.executionPlan?.liveAllowed ? 'available after dry-run' : 'blocked'
            }.`
          : 'Saved-search alert status is unavailable.',
        tone: alertStatus?.success
          ? alertStatus.executionPlan?.level === 'blocked'
            ? 'red'
            : alertStatus.executionPlan?.level === 'caution'
              ? 'amber'
              : 'emerald'
          : 'red',
      },
    ],
    [
      alertStatus,
      controlPolicy,
      controlState.strategyGate,
      crmTaskAuditSummary,
      crmTaskReadiness,
      crmTaskSummary,
      intakeSummary,
      isLoadingAlertStatus,
      isLoadingCRMTasks,
      isLoadingIntake,
      isLoadingMlsStatus,
      mlsStatus,
    ],
  );

  const mlsSyncQueue = getMlsQueue(mlsStatus, 'mls-sync');
  const mlsPageQueue = getMlsQueue(mlsStatus, 'mls-page');

  return (
    <section className="min-h-screen bg-[#05070a] px-5 py-6 text-slate-100 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="border-b border-slate-800 pb-6">
          <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
            <DatabaseZap size={16} />
            David Quinn Group
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black uppercase leading-none tracking-normal text-white sm:text-5xl">
                Master Control Panel
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
                Authority controls for REIE visibility, map masking, lead intake, CRM escalation, MLS operations, and search infrastructure.
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <div
                data-testid="reie-control-sync-status"
                aria-live="polite"
                className={`inline-flex items-center justify-center gap-2 border px-4 py-3 text-xs font-black uppercase ${
                  controlStateError
                    ? 'border-red-400/40 bg-red-500/10 text-red-100'
                    : isSavingState
                      ? 'border-amber-300/40 bg-amber-400/10 text-amber-100'
                      : 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100'
                }`}
              >
                {controlStateError ? (
                  <WifiOff size={16} />
                ) : isSavingState || isLoadingState ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                {controlStateError ? 'API Sync Failed' : isSavingState ? 'Saving' : isLoadingState ? 'Loading' : `Synced: ${stateSource}`}
              </div>

              <button
                type="button"
                data-testid="reie-kill-switch"
                aria-pressed={controlState.killSwitchActive}
                disabled={isLoadingState || isSavingState}
                onClick={() => void saveControlState({ killSwitchActive: !controlState.killSwitchActive })}
                className={`inline-flex items-center justify-center gap-2 border px-5 py-3 text-sm font-black uppercase transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  controlState.killSwitchActive
                    ? 'border-red-400/50 bg-red-500/20 text-red-100'
                    : 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100 hover:border-emerald-200'
                }`}
              >
                <Zap size={18} />
                {controlState.killSwitchActive ? 'Kill Switch Active' : 'System Live'}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span data-testid="reie-control-last-saved">
              {controlStateError || `Last saved ${formatTimestamp(controlState.updatedAt)} by ${controlState.updatedBy}`}
            </span>
            {controlPolicy.warnings.length ? (
              <span className="text-amber-200" data-testid="reie-control-policy-warning">
                {controlPolicy.warnings[0]}
              </span>
            ) : (
              <span className="text-emerald-200" data-testid="reie-control-policy-warning">
                Policy clear: {controlPolicy.publicExposure} / {controlPolicy.mapPrecision} / {controlPolicy.privateLayer}
              </span>
            )}
            <button
              type="button"
              data-testid="reie-refresh-state"
              onClick={() => {
                void loadControlState();
                void loadIntakeSignals();
                void loadCRMTasks();
                void loadMlsStatus();
                void loadAlertStatus();
              }}
              disabled={isLoadingState || isSavingState || isLoadingIntake || isLoadingCRMTasks || isLoadingMlsStatus || isLoadingAlertStatus}
              className="inline-flex self-start items-center gap-2 border border-slate-800 bg-black px-3 py-2 font-black uppercase text-slate-300 transition hover:border-cyan-300 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
            >
              <RefreshCcw size={13} />
              Refresh State
            </button>
          </div>
        </header>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {controlMetrics.map((metric) => (
            <MetricCell key={metric.label} metric={metric} />
          ))}
        </div>

        <section className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="border border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-4">
              <SlidersHorizontal size={16} className="text-cyan-300" />
              <h2 className="text-sm font-black uppercase text-white">Visibility Controls</h2>
            </div>

            <div className="space-y-4 p-5">
              <div className="border border-slate-800 bg-black/70 p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm font-black uppercase text-white">
                    <Shield size={17} className="text-cyan-300" />
                    Strategy Gate
                  </div>
                  <span data-testid="reie-strategy-gate-value" className="text-sm font-black text-cyan-200">
                    {controlState.strategyGate}%
                  </span>
                </div>
                <input
                  data-testid="reie-strategy-gate"
                  aria-label="Strategy gate public blur percentage"
                  type="range"
                  min="0"
                  max="100"
                  disabled={isLoadingState || isSavingState}
                  value={controlState.strategyGate}
                  onBlur={commitStrategyGate}
                  onChange={(event) => updateLocalStrategyGate(parseInt(event.target.value, 10))}
                  onKeyUp={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') commitStrategyGate();
                  }}
                  onMouseUp={commitStrategyGate}
                  onTouchEnd={commitStrategyGate}
                  className="h-2 w-full cursor-pointer appearance-none rounded bg-slate-800 accent-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <div className="mt-3 flex justify-between text-[10px] font-black uppercase text-slate-600">
                  <span>Open</span>
                  <span>Protected</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-px border border-slate-800 bg-slate-800" role="group" aria-label="Control mode">
                {modeOptions.map((option) => {
                  const isActive = controlState.mode === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      data-testid={`reie-mode-${option.value}`}
                      aria-pressed={isActive}
                      disabled={isLoadingState || isSavingState}
                      onClick={() => void saveControlState({ mode: option.value })}
                      className={`px-3 py-3 text-xs font-black uppercase transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        isActive ? 'bg-cyan-300 text-black' : 'bg-black text-slate-400 hover:bg-slate-950 hover:text-cyan-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <ToggleControl
                active={controlState.areaCloud}
                activeLabel="Area-cloud masking active"
                disabled={isLoadingState || isSavingState}
                inactiveLabel="Precise pins visible"
                icon={MapIcon}
                testId="reie-area-cloud-toggle"
                onClick={() => void saveControlState({ areaCloud: !controlState.areaCloud })}
              />

              <ToggleControl
                active={controlState.privateLayer}
                activeLabel="Private client layer visible"
                disabled={isLoadingState || isSavingState}
                inactiveLabel="Public layer only"
                icon={controlState.privateLayer ? Eye : EyeOff}
                testId="reie-private-layer-toggle"
                onClick={() => void saveControlState({ privateLayer: !controlState.privateLayer })}
              />
            </div>
          </div>

          <div className="border border-slate-800 bg-slate-950/80">
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-5 py-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-cyan-300" />
                <h2 className="text-sm font-black uppercase text-white">Recent REIE Intake</h2>
              </div>
              <span className="border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[10px] font-black uppercase text-cyan-100">
                {isLoadingIntake
                  ? 'Loading'
                  : `${intakeSummary.total} Signals / ${intakeSummary.hiddenPromotedInteractions} Promoted Hidden`}
              </span>
            </div>

            {isLoadingIntake ? (
              <div className="flex min-h-72 items-center justify-center gap-3 px-5 py-8 text-sm font-black uppercase text-slate-500">
                <Loader2 size={18} className="animate-spin text-cyan-300" />
                Loading intake signals
              </div>
            ) : intakeError ? (
              <div className="min-h-72 px-5 py-8">
                <div className="border border-red-400/30 bg-red-500/10 p-4 text-sm leading-6 text-red-100">{intakeError}</div>
              </div>
            ) : intakeSignals.length === 0 ? (
              <div className="min-h-72 px-5 py-8 text-sm leading-6 text-slate-500">
                No active intake signals are currently available.
              </div>
            ) : (
              <div className="divide-y divide-slate-800" data-testid="reie-intake-signals">
                {intakeSignals.map((signal) => (
                  <article key={`${signal.kind}-${signal.id}`} className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_140px]">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-black uppercase text-white">{signal.name}</h3>
                        <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getPriorityClass(signal.priority)}`}>
                          {signal.priority}
                        </span>
                        <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getTemperatureClass(signal.leadTemperature)}`}>
                          {signal.leadTemperature}
                        </span>
                        <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getAlertReadinessClass(signal.alertReadiness.level)}`}>
                          Alert {signal.alertReadiness.level}
                        </span>
                        {signal.hasNotes ? (
                          <span className="border border-emerald-300/30 bg-emerald-400/10 px-2 py-1 text-[10px] font-black uppercase text-emerald-100">
                            Notes
                          </span>
                        ) : null}
                      </div>
                      <div className="grid gap-2 text-xs uppercase tracking-normal text-slate-500 sm:grid-cols-4">
                        <span>{signal.sourceLabel}</span>
                        <span>{signal.area}</span>
                        <span>{signal.intent}</span>
                        <span>{signal.status}</span>
                      </div>
                      <div className="mt-3 grid gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 sm:grid-cols-3">
                        <span>Heat {signal.heatScore}</span>
                        <span>Delta +{signal.heatScoreIncrement}</span>
                        <span>{signal.kind === 'crm_task' ? 'CRM Task' : 'Interaction'}</span>
                      </div>
                      {signal.primaryNorthStar || signal.northStarCount > 0 ? (
                        <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/70">
                          North Star: {signal.primaryNorthStar || 'Captured'} ({signal.northStarCount})
                        </p>
                      ) : null}
                      {signal.authoritySignals.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {signal.authoritySignals.map((authoritySignal) => (
                            <span
                              key={`${signal.id}-${authoritySignal}`}
                              className="border border-slate-800 bg-black px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400"
                            >
                              {authoritySignal}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {signal.alertReadiness.signals.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {signal.alertReadiness.signals.slice(0, 4).map((readinessSignal) => (
                            <span
                              key={`${signal.id}-${readinessSignal}`}
                              className="border border-cyan-300/20 bg-cyan-300/5 px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/70"
                            >
                              {readinessSignal}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <p className="mt-3 text-sm leading-6 text-slate-400">{signal.nextAction}</p>
                      {signal.alertReadiness.summary ? (
                        <p className="mt-2 text-xs leading-5 text-slate-500">{signal.alertReadiness.summary}</p>
                      ) : null}
                      <p className="mt-2 text-xs text-slate-600">{signal.email}</p>
                    </div>

                    <button
                      type="button"
                      data-testid={`reie-review-signal-${signal.id}`}
                      disabled={reviewingSignalId === signal.id}
                      onClick={() => void reviewIntakeSignal(signal)}
                      className="inline-flex h-10 items-center justify-center gap-2 self-start border border-slate-700 bg-black px-3 text-xs font-black uppercase text-slate-200 transition hover:border-cyan-300 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {reviewingSignalId === signal.id ? <Loader2 size={14} className="animate-spin" /> : <BellRing size={14} />}
                      {reviewingSignalId === signal.id
                        ? 'Saving'
                        : signal.kind === 'interaction'
                          ? 'Promote'
                          : signal.status === 'reviewing'
                            ? 'Reviewing'
                            : 'Review'}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="border border-slate-800 bg-slate-950/80" data-testid="reie-crm-tasks">
          <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-cyan-300" />
              <h2 className="text-sm font-black uppercase text-white">CRM Task Readiness</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[10px] font-black uppercase text-cyan-100">
                {isLoadingCRMTasks ? 'Loading' : `${crmTaskSummary.total} Active`}
              </span>
              <button
                type="button"
                data-testid="reie-refresh-crm-tasks"
                onClick={() => void loadCRMTasks()}
                disabled={isLoadingCRMTasks}
                className="inline-flex items-center gap-2 border border-slate-800 bg-black px-3 py-2 text-xs font-black uppercase text-slate-300 transition hover:border-cyan-300 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingCRMTasks ? <Loader2 size={13} className="animate-spin" /> : <RefreshCcw size={13} />}
                Refresh CRM
              </button>
            </div>
          </div>

          {isLoadingCRMTasks ? (
            <div className="flex min-h-40 items-center justify-center gap-3 px-5 py-8 text-sm font-black uppercase text-slate-500">
              <Loader2 size={18} className="animate-spin text-cyan-300" />
              Loading CRM tasks
            </div>
          ) : crmTaskError ? (
            <div className="px-5 py-6">
              <div className="border border-red-400/30 bg-red-500/10 p-4 text-sm leading-6 text-red-100">{crmTaskError}</div>
            </div>
          ) : (
            <div className="grid gap-px bg-slate-800 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="bg-slate-950 p-5">
                <div className="mb-4 text-xs font-black uppercase text-slate-500">Active Review</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Pending</div>
                    <div className="mt-2 text-3xl font-black uppercase text-white">{crmTaskSummary.pending}</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Reviewing</div>
                    <div className="mt-2 text-3xl font-black uppercase text-white">{crmTaskSummary.reviewing}</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Property</div>
                    <div className="mt-2 text-lg font-black uppercase text-white">{crmTaskSummary.propertyInquiries}</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Strategy</div>
                    <div className="mt-2 text-lg font-black uppercase text-white">{crmTaskSummary.strategyIntakes}</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Ready</div>
                    <div className="mt-2 text-lg font-black uppercase text-white">{crmTaskSummary.alertReady}</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Incomplete</div>
                    <div className="mt-2 text-lg font-black uppercase text-white">{crmTaskSummary.alertIncomplete}</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Audit Coverage</div>
                    <div className="mt-2 text-lg font-black uppercase text-white">
                      {crmTaskAuditSummary.closureReviewCoveragePercent}%
                    </div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Missing Notes</div>
                    <div className="mt-2 text-lg font-black uppercase text-white">{crmTaskAuditSummary.closureReviewMissing}</div>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Closed {crmTaskAuditSummary.closed}: {crmTaskAuditSummary.completed} completed, {crmTaskAuditSummary.dismissed} dismissed,
                  {' '}{crmTaskAuditSummary.closureReviewReady} with notes.
                </p>
                <div className="mt-4 border border-slate-800 bg-black/70 p-4" data-testid="reie-crm-readiness">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-black uppercase text-slate-500">CRM Readiness</div>
                    <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getCRMReadinessClass(crmTaskReadiness.level)}`}>
                      {crmTaskReadiness.level}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{crmTaskReadiness.summary}</p>
                  <div className="mt-3 grid gap-2">
                    {crmTaskReadiness.gates.map((gate) => (
                      <div key={gate.label} className={`border px-3 py-2 ${getGateClass(gate.status)}`}>
                        <div className="text-[10px] font-black uppercase">{gate.label}</div>
                        <div className="mt-1 text-xs leading-5 text-slate-400">{gate.detail}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">
                      Next: {crmTaskReadiness.terminal} / {crmTaskReadiness.nextAction}
                    </div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {crmTaskReadiness.nextCommand}
                    </code>
                  </div>
                </div>
                {crmTaskVerdict ? <p className="mt-4 text-sm leading-6 text-slate-400">{crmTaskVerdict}</p> : null}
                {crmTaskApiMetadata ? (
                  <div className="mt-4 border border-slate-800 bg-black/70 p-4" data-testid="reie-crm-api-metadata">
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">CRM API Inspection</div>
                    <div className="grid gap-2 text-xs leading-5 text-slate-400 sm:grid-cols-4">
                      <div className="min-w-0 border border-slate-900 bg-slate-950/70 px-3 py-2">
                        <span className="block font-black uppercase text-slate-500">Generated</span>
                        <span className="mt-1 block break-words text-slate-200">{crmTaskApiMetadata.generatedAt}</span>
                      </div>
                      <div className="min-w-0 border border-slate-900 bg-slate-950/70 px-3 py-2" aria-live="polite">
                        <span className="block font-black uppercase text-slate-500">Source</span>
                        <span
                          className={`mt-1 inline-flex border px-2 py-1 text-[10px] font-black uppercase ${getCRMInspectionSourceClass(
                            crmTaskApiMetadata.inspectionSource,
                          )}`}
                        >
                          {crmTaskApiMetadata.inspectionSource}
                        </span>
                      </div>
                      <div className="min-w-0 border border-slate-900 bg-slate-950/70 px-3 py-2">
                        <span className="block font-black uppercase text-slate-500">Route</span>
                        <span className="mt-1 block break-words text-slate-200">{crmTaskApiMetadata.route}</span>
                      </div>
                      <div className="min-w-0 border border-slate-900 bg-slate-950/70 px-3 py-2">
                        <span className="block font-black uppercase text-slate-500">Terminal</span>
                        <span className="mt-1 block break-words text-slate-200">{crmTaskApiMetadata.terminal}</span>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-3">
                      <div className="min-w-0 border border-slate-800 bg-slate-950/80 p-3">
                        <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 API Check</div>
                        <code className="block max-w-full overflow-x-auto whitespace-nowrap border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                          {crmTaskApiMetadata.command}
                        </code>
                      </div>
                      <div className="min-w-0 border border-slate-800 bg-slate-950/80 p-3" data-testid="reie-crm-scheduler-command">
                        <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 CRM Scheduler</div>
                        <code className="block max-w-full overflow-x-auto whitespace-nowrap border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                          npm run run:crm:scheduler
                        </code>
                      </div>
                      {lastCRMTaskDetailApiMetadata ? (
                        <div className="min-w-0 border border-cyan-400/20 bg-cyan-950/10 p-3" data-testid="reie-crm-last-detail-route">
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase text-slate-500">Last Detail Route</span>
                            <span
                              className={`border px-2 py-1 text-[10px] font-black uppercase ${getCRMInspectionSourceClass(
                                lastCRMTaskDetailApiMetadata.inspectionSource,
                              )}`}
                            >
                              {lastCRMTaskDetailApiMetadata.inspectionSource}
                            </span>
                          </div>
                          <div className="grid gap-2 text-xs leading-5 text-slate-400 sm:grid-cols-2">
                            <div className="min-w-0">
                              <span className="block font-black uppercase text-slate-500">Generated</span>
                              <span className="mt-1 block break-words text-slate-200">
                                {lastCRMTaskDetailApiMetadata.generatedAt}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <span className="block font-black uppercase text-slate-500">Route</span>
                              <span className="mt-1 block break-words text-slate-200">{lastCRMTaskDetailApiMetadata.route}</span>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="bg-slate-950 p-5">
                {crmTasks.length === 0 ? (
                  <div className="border border-slate-800 bg-black/70 p-4 text-sm leading-6 text-slate-500">
                    No active CRM tasks are currently available.
                  </div>
                ) : (
                  <div className="grid gap-3 lg:grid-cols-2">
                    {crmTasks.slice(0, 6).map((task) => {
                      const isUpdatingTask = reviewingCRMTaskId === task.id;
                      const reviewNote = crmTaskReviewNotes[task.id] || '';
                      const hasClosureNote = reviewNote.trim().length > 0;
                      const propertyInquiry = task.propertyInquiry;
                      const taskTimeline = propertyInquiry?.timelineLabel || task.latestSavedSearchIntake?.timelineLabel || task.status;
                      const taskTemperature = propertyInquiry?.leadTemperature || task.latestSavedSearchIntake?.leadTemperature || 'No Temp';

                      return (
                      <article key={task.id} className="grid gap-4 border border-slate-800 bg-black/70 p-4 sm:grid-cols-[1fr_148px]">
                        <div className="min-w-0">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getCRMTaskPriorityClass(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getAlertReadinessClass(task.alertReadiness.level)}`}>
                              Alert {task.alertReadiness.level}
                            </span>
                            <span className="border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-black uppercase text-slate-400">
                              {getCRMTaskTypeLabel(task.type)}
                            </span>
                          </div>
                          <h3 className="text-sm font-black uppercase leading-5 text-white">{task.title}</h3>
                          <div className="mt-3 grid gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600 sm:grid-cols-3">
                            <span>Heat {task.heatScore}</span>
                            <span>{taskTimeline}</span>
                            <span>{taskTemperature}</span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-400">{task.nextAction}</p>
                          {propertyInquiry ? (
                            <div className="mt-3 border border-cyan-400/20 bg-cyan-950/10 p-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/70">
                                {propertyInquiry.address || 'Property address not recorded'}
                              </p>
                              <p className="mt-2 text-xs leading-5 text-slate-400">
                                {[propertyInquiry.city, propertyInquiry.state].filter(Boolean).join(', ') || 'Market not recorded'} /{' '}
                                {formatCRMPrice(propertyInquiry.price)}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {propertyInquiry.mlsId ? (
                                  <span className="border border-slate-800 bg-black/50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
                                    MLS {propertyInquiry.mlsId}
                                  </span>
                                ) : null}
                                {propertyInquiry.propertyType ? (
                                  <span className="border border-slate-800 bg-black/50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
                                    {propertyInquiry.propertyType}
                                  </span>
                                ) : null}
                                {propertyInquiry.hasPhone ? (
                                  <span className="border border-slate-800 bg-black/50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
                                    Phone captured
                                  </span>
                                ) : null}
                                {propertyInquiry.hasNotes ? (
                                  <span className="border border-slate-800 bg-black/50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
                                    Notes captured
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                          {task.latestSavedSearchIntake?.marketScope || task.latestSavedSearchIntake?.city ? (
                            <p className="mt-2 text-xs leading-5 text-slate-500">
                              {task.latestSavedSearchIntake.marketScope || task.latestSavedSearchIntake.city}
                            </p>
                          ) : null}
                          {task.latestSavedSearchIntake ? (
                            task.latestSavedSearchIntake.primaryNorthStar || task.latestSavedSearchIntake.northStarCount > 0 ? (
                            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/70">
                              North Star: {task.latestSavedSearchIntake.primaryNorthStar || 'Captured'} ({task.latestSavedSearchIntake.northStarCount})
                            </p>
                            ) : null
                          ) : null}
                          {task.alertReadiness.summary ? (
                            <p className="mt-2 text-xs leading-5 text-slate-600">{task.alertReadiness.summary}</p>
                          ) : null}
                          <label htmlFor={`reie-crm-note-${task.id}`} className="mt-3 block text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                            Review Note
                          </label>
                          <textarea
                            id={`reie-crm-note-${task.id}`}
                            data-testid={`reie-crm-task-note-${task.id}`}
                            value={reviewNote}
                            maxLength={500}
                            rows={3}
                            disabled={isUpdatingTask}
                            onChange={(event) => updateCRMTaskReviewNote(task.id, event.target.value)}
                            className="mt-2 min-h-20 w-full resize-y border border-slate-800 bg-slate-950 px-3 py-2 text-xs leading-5 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Required before completing or dismissing"
                          />
                        </div>

                        <div className="grid content-start gap-2">
                          <button
                            type="button"
                            data-testid={`reie-review-crm-task-${task.id}`}
                            disabled={isUpdatingTask || task.status === 'reviewing'}
                            onClick={() => void reviewCRMTask(task)}
                            className="inline-flex h-10 items-center justify-center gap-2 border border-slate-700 bg-black px-3 text-xs font-black uppercase text-slate-200 transition hover:border-cyan-300 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isUpdatingTask ? <Loader2 size={14} className="animate-spin" /> : <Activity size={14} />}
                            {isUpdatingTask ? 'Saving' : task.status === 'reviewing' ? 'Reviewing' : 'Review'}
                          </button>
                          <button
                            type="button"
                            data-testid={`reie-complete-crm-task-${task.id}`}
                            disabled={isUpdatingTask || !hasClosureNote}
                            onClick={() => void closeCRMTask(task, 'completed')}
                            className="inline-flex h-10 items-center justify-center gap-2 border border-emerald-300/30 bg-emerald-400/10 px-3 text-xs font-black uppercase text-emerald-100 transition hover:border-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isUpdatingTask ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            Complete
                          </button>
                          <button
                            type="button"
                            data-testid={`reie-dismiss-crm-task-${task.id}`}
                            disabled={isUpdatingTask || !hasClosureNote}
                            onClick={() => void closeCRMTask(task, 'dismissed')}
                            className="inline-flex h-10 items-center justify-center gap-2 border border-slate-700 bg-slate-950 px-3 text-xs font-black uppercase text-slate-300 transition hover:border-red-300 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isUpdatingTask ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
                            Dismiss
                          </button>
                        </div>
                      </article>
                    )})}
                  </div>
                )}

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 CRM Review</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {crmTaskOperations?.reviewCommand || 'npm run run:crm:active'}
                    </code>
                  </div>
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Intake Signals</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {crmTaskOperations?.intakeCommand || 'curl -s http://localhost:3000/api/admin/intake-signals'}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="border border-slate-800 bg-slate-950/80" data-testid="reie-alert-operations">
          <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <BellRing size={16} className="text-cyan-300" />
              <h2 className="text-sm font-black uppercase text-white">Saved-Search Alert Operations</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {alertStatus?.success && alertStatus.executionPlan ? (
                <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getAlertPlanClass(alertStatus.executionPlan.level)}`}>
                  {alertStatus.executionPlan.level}
                </span>
              ) : null}
              <button
                type="button"
                data-testid="reie-refresh-alert-status"
                onClick={() => void loadAlertStatus()}
                disabled={isLoadingAlertStatus}
                className="inline-flex items-center gap-2 border border-slate-800 bg-black px-3 py-2 text-xs font-black uppercase text-slate-300 transition hover:border-cyan-300 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingAlertStatus ? <Loader2 size={13} className="animate-spin" /> : <RefreshCcw size={13} />}
                Refresh Alerts
              </button>
            </div>
          </div>

          {isLoadingAlertStatus ? (
            <div className="flex min-h-36 items-center justify-center gap-3 px-5 py-8 text-sm font-black uppercase text-slate-500">
              <Loader2 size={18} className="animate-spin text-cyan-300" />
              Loading alert operations
            </div>
          ) : alertStatusError ? (
            <div className="px-5 py-6">
              <div className="border border-red-400/30 bg-red-500/10 p-4 text-sm leading-6 text-red-100">{alertStatusError}</div>
            </div>
          ) : alertStatus?.success ? (
            <div className="grid gap-px bg-slate-800 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="bg-slate-950 p-5">
                <div className="mb-4 text-xs font-black uppercase text-slate-500">Alert Queue</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Pending</div>
                    <div className="mt-2 text-3xl font-black uppercase text-white">{alertStatus.stats.pending}</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Processing</div>
                    <div className="mt-2 text-3xl font-black uppercase text-white">{alertStatus.stats.processing}</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Failed</div>
                    <div className="mt-2 text-lg font-black uppercase text-white">{alertStatus.stats.failed}</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Terminal</div>
                    <div className="mt-2 text-lg font-black uppercase text-white">{alertStatus.stats.terminal}</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-5">
                {alertStatus.executionPlan ? (
                  <div className="border border-slate-800 bg-black/70 p-4" data-testid="reie-alert-execution-plan">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs font-black uppercase text-slate-500">Execution Plan</div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getAlertPlanClass(alertStatus.executionPlan.level)}`}>
                          {alertStatus.executionPlan.level}
                        </span>
                        <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getAlertPlanClass(alertStatus.executionPlan.liveAllowed ? 'caution' : 'blocked')}`}>
                          Live {alertStatus.executionPlan.liveAllowed ? 'available after dry-run' : 'blocked'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{alertStatus.executionPlan.summary}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {alertStatus.executionPlan.gates.map((gate) => (
                        <div key={gate.label} className={`border px-3 py-2 ${getGateClass(gate.status)}`}>
                          <div className="text-[10px] font-black uppercase">{gate.label}</div>
                          <div className="mt-1 text-xs leading-5 text-slate-400">{gate.detail}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <div className="mb-2 text-[10px] font-black uppercase text-slate-500">
                        Next: {alertStatus.executionPlan.terminal} / {alertStatus.executionPlan.nextAction}
                      </div>
                      <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                        {alertStatus.executionPlan.nextCommand}
                      </code>
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Alert Status</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {alertStatus.commands.status}
                    </code>
                  </div>
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Alert Dry-Run</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {alertStatus.commands.dryRun}
                    </code>
                  </div>
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Dead-Letter</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {alertStatus.commands.deadLetter}
                    </code>
                  </div>
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Queue Dashboard</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {alertStatus.commands.queueDashboard || 'npm run run:queue-dashboard -- --failed --limit=5'}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className="border border-slate-800 bg-slate-950/80" data-testid="reie-mls-operations">
          <div className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <Radar size={16} className="text-cyan-300" />
              <h2 className="text-sm font-black uppercase text-white">MLS Operations</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {mlsStatus?.success ? (
                <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getHealthClass(mlsStatus.status)}`}>
                  {mlsStatus.status}
                </span>
              ) : null}
              <Link
                href="/admin/dead-letter"
                data-testid="reie-open-dead-letter-inspector"
                className="inline-flex items-center gap-2 border border-slate-800 bg-black px-3 py-2 text-xs font-black uppercase text-slate-300 transition hover:border-cyan-300 hover:text-cyan-100"
              >
                <Shield size={13} />
                Dead Letter
              </Link>
              <button
                type="button"
                data-testid="reie-refresh-mls-status"
                onClick={() => void loadMlsStatus()}
                disabled={isLoadingMlsStatus}
                className="inline-flex items-center gap-2 border border-slate-800 bg-black px-3 py-2 text-xs font-black uppercase text-slate-300 transition hover:border-cyan-300 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingMlsStatus ? <Loader2 size={13} className="animate-spin" /> : <RefreshCcw size={13} />}
                Refresh MLS
              </button>
            </div>
          </div>

          {isLoadingMlsStatus ? (
            <div className="flex min-h-48 items-center justify-center gap-3 px-5 py-8 text-sm font-black uppercase text-slate-500">
              <Loader2 size={18} className="animate-spin text-cyan-300" />
              Loading MLS operations
            </div>
          ) : mlsStatusError ? (
            <div className="px-5 py-6">
              <div className="border border-red-400/30 bg-red-500/10 p-4 text-sm leading-6 text-red-100">{mlsStatusError}</div>
            </div>
          ) : mlsStatus?.success ? (
            <div className="grid gap-px bg-slate-800 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="bg-slate-950 p-5">
                <div className="mb-4 text-xs font-black uppercase text-slate-500">Freshness</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Stale</div>
                    <div className="mt-2 text-3xl font-black uppercase text-white">{mlsStatus.propertyFreshness.stalePercent}%</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Active</div>
                    <div className="mt-2 text-3xl font-black uppercase text-white">{mlsStatus.propertyFreshness.active}</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Latest Sync</div>
                    <div className="mt-2 text-lg font-black uppercase text-white">
                      {formatMinutesAgo(mlsStatus.propertyFreshness.latestMinutesAgo)}
                    </div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Total</div>
                    <div className="mt-2 text-lg font-black uppercase text-white">{mlsStatus.propertyFreshness.total}</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-5">
                <div className="grid gap-4 lg:grid-cols-2">
                  {[mlsSyncQueue, mlsPageQueue].filter(Boolean).map((queue) => (
                    <div key={queue!.name} className="border border-slate-800 bg-black/70 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="text-sm font-black uppercase text-white">{queue!.name}</span>
                        <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getHealthClass(queue!.health)}`}>
                          {queue!.health}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="border border-slate-800 bg-slate-950 p-2">
                          <div className="font-black text-white">{queue!.waiting}</div>
                          <div className="mt-1 uppercase text-slate-600">Wait</div>
                        </div>
                        <div className="border border-slate-800 bg-slate-950 p-2">
                          <div className="font-black text-white">{queue!.active}</div>
                          <div className="mt-1 uppercase text-slate-600">Active</div>
                        </div>
                        <div className="border border-slate-800 bg-slate-950 p-2">
                          <div className="font-black text-white">{queue!.failed}</div>
                          <div className="mt-1 uppercase text-slate-600">Fail</div>
                        </div>
                        <div className="border border-slate-800 bg-slate-950 p-2">
                          <div className="font-black text-white">{queue!.completed}</div>
                          <div className="mt-1 uppercase text-slate-600">Done</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border border-slate-800 bg-black/70 p-4">
                  <div className="mb-3 text-xs font-black uppercase text-slate-500">Recommended Action</div>
                  <div className="space-y-2 text-sm leading-6 text-slate-300">
                    {mlsStatus.recommendations.slice(0, 3).map((recommendation) => (
                      <p key={recommendation}>{recommendation}</p>
                    ))}
                  </div>
                </div>

                {mlsStatus.operationalReadiness ? (
                  <div className="mt-4 border border-slate-800 bg-black/70 p-4" data-testid="reie-mls-operational-readiness">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs font-black uppercase text-slate-500">Operational Readiness</div>
                      <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getReadinessClass(mlsStatus.operationalReadiness.level)}`}>
                        {mlsStatus.operationalReadiness.level}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{mlsStatus.operationalReadiness.summary}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {mlsStatus.operationalReadiness.gates.map((gate) => (
                        <div key={gate.label} className={`border px-3 py-2 ${getGateClass(gate.status)}`}>
                          <div className="text-[10px] font-black uppercase">{gate.label}</div>
                          <div className="mt-1 text-xs leading-5 text-slate-400">{gate.detail}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <div className="mb-2 text-[10px] font-black uppercase text-slate-500">
                        Next: {mlsStatus.operationalReadiness.nextTerminal} / {mlsStatus.operationalReadiness.nextAction}
                      </div>
                      <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                        {mlsStatus.operationalReadiness.nextCommand}
                      </code>
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 border border-slate-800 bg-black/70 p-4" data-testid="reie-search-index-status">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-black uppercase text-slate-500">Search Index</div>
                    <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getHealthClass(mlsStatus.searchIndex?.health || 'degraded')}`}>
                      {mlsStatus.searchIndex?.health || 'unknown'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="border border-slate-800 bg-slate-950 p-2">
                      <div className="font-black text-white">{mlsStatus.searchIndex?.attempted ?? 0}</div>
                      <div className="mt-1 uppercase text-slate-600">Try</div>
                    </div>
                    <div className="border border-slate-800 bg-slate-950 p-2">
                      <div className="font-black text-white">{mlsStatus.searchIndex?.succeeded ?? 0}</div>
                      <div className="mt-1 uppercase text-slate-600">Indexed</div>
                    </div>
                    <div className="border border-slate-800 bg-slate-950 p-2">
                      <div className="font-black text-white">{mlsStatus.searchIndex?.failed ?? 0}</div>
                      <div className="mt-1 uppercase text-slate-600">Fail</div>
                    </div>
                    <div className="border border-slate-800 bg-slate-950 p-2">
                      <div className="font-black text-white">{mlsStatus.searchIndex?.unknown ?? 0}</div>
                      <div className="mt-1 uppercase text-slate-600">Unknown</div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">{formatSearchIndexDetail(mlsStatus.searchIndex)}</p>
                </div>

                {mlsStatus.syncDefaults ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-3" data-testid="reie-mls-sync-envelope">
                    <div className="border border-slate-800 bg-black/70 p-3">
                      <div className="text-[10px] font-black uppercase text-slate-500">Page Timeout</div>
                      <div className="mt-2 text-lg font-black text-white">{formatMilliseconds(mlsStatus.syncDefaults.pageTimeoutMs)}</div>
                      <div className="mt-1 text-xs text-slate-600">Max {formatMilliseconds(mlsStatus.syncLimits?.pageTimeoutMs)}</div>
                    </div>
                    <div className="border border-slate-800 bg-black/70 p-3">
                      <div className="text-[10px] font-black uppercase text-slate-500">Page Size</div>
                      <div className="mt-2 text-lg font-black text-white">{mlsStatus.syncDefaults.pageSize}</div>
                      <div className="mt-1 text-xs text-slate-600">Default bounded sync</div>
                    </div>
                    <div className="border border-slate-800 bg-black/70 p-3">
                      <div className="text-[10px] font-black uppercase text-slate-500">Worker Terminal</div>
                      <div className="mt-2 text-lg font-black text-white">{mlsStatus.terminals?.coordinator || 'Terminal 3'}</div>
                      <div className="mt-1 text-xs text-slate-600">{mlsStatus.terminals?.scriptsAndCurl || 'Terminal 5'} for checks</div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Operational Smoke</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {mlsStatus.commands.smokeOps || 'npm run smoke:ops'}
                    </code>
                  </div>
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 MLS Status Smoke</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {mlsStatus.commands.smokeMlsStatus || 'npm run smoke:mls-status'}
                    </code>
                  </div>
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Sync Preview</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {mlsStatus.commands.dryRunSyncPreview}
                    </code>
                  </div>
                  {mlsStatus.commands.liveSync ? (
                    <div>
                      <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Live Sync Gate</div>
                      <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                        {mlsStatus.commands.liveSync}
                      </code>
                    </div>
                  ) : null}
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Dry-Run Retry</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {mlsStatus.commands.dryRunRetry || mlsStatus.commands.dryRunRetryMlsSync}
                    </code>
                  </div>
                  {mlsStatus.commands.smokeSearch || mlsStatus.commands.searchCheck || mlsStatus.commands.rawSearchCheck ? (
                    <div>
                      <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Search Smoke Readiness</div>
                      <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                        {mlsStatus.commands.smokeSearch || 'npm run smoke:search'}
                      </code>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                        Requires meta.smoke.ready=true and no blockers.
                      </p>
                      {mlsStatus.commands.rawSearchCheck || mlsStatus.commands.searchCheck ? (
                        <>
                          <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Raw API</div>
                          <code className="mt-1 block overflow-x-auto border border-slate-900 bg-black/70 px-3 py-2 text-[10px] text-slate-500">
                            {mlsStatus.commands.rawSearchCheck || mlsStatus.commands.searchCheck}
                          </code>
                        </>
                      ) : null}
                    </div>
                  ) : null}
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Dead-Letter</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {mlsStatus.commands.deadLetterOpen || mlsStatus.commands.deadLetterInspector || mlsStatus.commands.deadLetter}
                    </code>
                  </div>
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 3 Worker</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {mlsStatus.commands.worker}
                    </code>
                  </div>
                </div>

                {mlsStatus.recentCompletedJobs && mlsStatus.recentCompletedJobs.length > 0 ? (
                  <div className="mt-4 border border-slate-800 bg-black/70 p-4" data-testid="reie-mls-recent-completions">
                    <div className="mb-3 text-xs font-black uppercase text-slate-500">Recent MLS Completions</div>
                    <div className="space-y-3">
                      {mlsStatus.recentCompletedJobs.slice(0, 5).map((job) => (
                        <div key={`${job.queue}-${job.id || job.finishedOn || job.name}`} className="border border-slate-800 bg-slate-950 p-3">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-black uppercase text-white">{job.queue}</span>
                            <span className="border border-emerald-300/30 bg-emerald-400/10 px-2 py-1 text-[10px] font-black uppercase text-emerald-100">
                              completed
                            </span>
                            <span className="text-[10px] font-bold uppercase text-slate-600">{formatTimestamp(job.finishedOn || '')}</span>
                          </div>
                          <div className="text-xs leading-5 text-slate-400">{formatJobResult(job.returnvalue)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="border border-slate-800 bg-slate-950/80">
            <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-4">
              <Terminal size={16} className="text-cyan-300" />
              <h2 className="text-sm font-black uppercase text-white">Terminal Playbook</h2>
            </div>

            <div className="grid gap-px bg-slate-800 md:grid-cols-2">
              {commandCards.map((card) => (
                <div key={card.label} className="bg-slate-950 p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black uppercase text-white">{card.label}</span>
                    <span className="border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[10px] font-black uppercase text-cyan-100">
                      {card.terminal}
                    </span>
                  </div>
                  <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                    {card.command}
                  </code>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-800 bg-slate-950/80 p-5">
            <div className="mb-5 flex items-center gap-2">
              <Radar size={16} className="text-cyan-300" />
              <h2 className="text-sm font-black uppercase text-white">Operating Guardrails</h2>
            </div>
            <div className="space-y-3 text-sm leading-6 text-slate-400">
              <p>Read queue status before retries.</p>
              <p>Run smoke checks before raising MLS, alert, digest, or scheduler volume. Public search must report meta.smoke.ready=true with no blockers.</p>
              <p>Use dry-run endpoints before live alert or MLS recovery work.</p>
              <p>Live MLS syncs require explicit execute intent; forced syncs require status, retry, and dead-letter review.</p>
              <p>Run search infrastructure in Terminal 4 before Typesense repair commands.</p>
              <p>Keep client-facing intelligence gated until source data and CRM context are verified.</p>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-slate-800 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <Activity size={14} className="text-emerald-300" />
            REIE V 7.0 operational shell
          </span>
          <span className="flex items-center gap-2">
            <Gauge size={14} className="text-cyan-300" />
            Boulder, Denver, and Colorado authority layer
          </span>
        </footer>
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/admin/MasterControlPanel.tsx
