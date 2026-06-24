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

type IntakeReadiness = {
  level: 'ready' | 'watch' | 'blocked';
  summary: string;
  nextAction: string;
  terminal: string;
  nextCommand: string;
  gates: Array<{
    name: string;
    status: 'pass' | 'watch' | 'blocked';
    detail: string;
  }>;
};

type IntakeApiMetadata = {
  generatedAt: string;
  terminal: 'Terminal 5';
  inspectionSource?: 'Detail Route';
  route: string;
  command: string;
};

type IntakeApiErrorMetadata = Partial<IntakeApiMetadata>;

type IntakeSignalsResponse =
  | {
      success: true;
      generatedAt: string;
      terminal: 'Terminal 5';
      route: string;
      command: string;
      signals: IntakeSignal[];
      summary: IntakeSummary;
      readiness: IntakeReadiness;
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
      route?: string;
      command?: string;
      signals?: IntakeSignal[];
      summary?: IntakeSummary;
      readiness?: IntakeReadiness;
      auth?: {
        configured: boolean;
      };
    };

type UpdateIntakeSignalResponse =
  | {
      success: true;
      generatedAt: string;
      terminal: 'Terminal 5';
      inspectionSource: 'Detail Route';
      route: string;
      command: string;
      signal: IntakeSignal;
      readiness: IntakeReadiness;
      promoted?: boolean;
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
      signal?: IntakeSignal;
      readiness?: IntakeReadiness;
      auth?: {
        configured: boolean;
      };
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

type ControlStateApiMetadata = {
  generatedAt: string;
  terminal: 'Terminal 5';
  route: '/api/admin/control-state';
  command: string;
};

type ControlStateApiErrorMetadata = Partial<ControlStateApiMetadata>;

type ControlStateResponse =
  | {
      success: true;
      generatedAt: string;
      terminal: 'Terminal 5';
      route: '/api/admin/control-state';
      command: string;
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
      generatedAt?: string;
      terminal?: 'Terminal 5';
      route?: '/api/admin/control-state';
      command?: string;
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

type MlsMediaDiagnosticsStatus = {
  checkedJobs: number;
  jobsWithMediaDiagnostics: number;
  listingsWithMedia: number;
  extractedMediaCount: number;
  ignoredMediaItemCount: number;
  listingsWithDirectMedia: number;
  listingsWithNestedMedia: number;
  listingsWithTopLevelPhotos: number;
  unknown: number;
  health: 'healthy' | 'busy' | 'degraded';
  diagnostics: Array<{ area: string; message: string }>;
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
      terminal: 'Terminal 5';
      route: '/api/mls/status';
      command: string;
      auth: {
        configured: boolean;
      };
      redis?: {
        url: string;
      };
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
      mediaDiagnostics?: MlsMediaDiagnosticsStatus;
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
      detail?: string;
      status: 'healthy' | 'busy' | 'degraded';
      generatedAt: string;
      terminal: 'Terminal 5';
      route: '/api/mls/status';
      command: string;
      auth: {
        configured: boolean;
      };
      redis?: {
        url: string;
      };
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
      mediaDiagnostics?: MlsMediaDiagnosticsStatus;
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
    };

type MlsRetryExecutionPlan = {
  level: 'safe' | 'caution' | 'blocked';
  summary: string;
  nextAction: string;
  terminal: 'Terminal 5';
  nextCommand: string;
  liveRetryAllowed: boolean;
  gates: Array<{
    label: string;
    status: 'pass' | 'watch' | 'fail';
    detail: string;
  }>;
};

type MlsRetryStatusResponse =
  | {
      success: true;
      module: 'REIE MLS Queue Retry';
      generatedAt: string;
      terminal: 'Terminal 5';
      route: '/api/mls/retry';
      command: string;
      timeoutMs: number;
      defaults: {
        dryRun: boolean;
        liveRetryRequires: string;
        broadLiveRetryRequires: string;
        terminal: 'Terminal 5';
      };
      terminals: {
        scriptsAndCurl: 'Terminal 5';
        statusChecks: 'Terminal 5';
      };
      commands: {
        terminal?: 'Terminal 5';
        retryStatus: string;
        dryRunRetry: string;
        liveRetry: string;
        deadLetter: string;
        queueDashboard: string;
      };
      diagnostics: Array<{ area: string; message: string }>;
      executionPlan?: MlsRetryExecutionPlan;
      supportedQueues: string[];
      queues: MlsQueueStatus[];
      deadLetter: {
        waiting: number;
        active: number;
        delayed: number;
        failed: number;
        completed: number;
      };
      recentFailedJobs: Array<{
        key: string;
        queue: string;
        id?: string;
        name: string;
        failedReason: string | null;
        finishedOn: string | null;
      }>;
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
      route?: '/api/mls/retry';
      command?: string;
      timeoutMs?: number;
      defaults?: {
        dryRun: boolean;
        liveRetryRequires: string;
        broadLiveRetryRequires: string;
        terminal: 'Terminal 5';
      };
      terminals?: {
        scriptsAndCurl: 'Terminal 5';
        statusChecks: 'Terminal 5';
      };
      commands?: {
        terminal?: 'Terminal 5';
        retryStatus: string;
        dryRunRetry: string;
        liveRetry: string;
        deadLetter: string;
        queueDashboard: string;
      };
      diagnostics?: Array<{ area: string; message: string }>;
      executionPlan?: MlsRetryExecutionPlan;
      supportedQueues?: string[];
      queues?: MlsQueueStatus[];
      deadLetter?: {
        waiting: number;
        active: number;
        delayed: number;
        failed: number;
        completed: number;
      };
      recentFailedJobs?: Array<{
        key: string;
        queue: string;
        id?: string;
        name: string;
        failedReason: string | null;
        finishedOn: string | null;
      }>;
      auth?: {
        configured: boolean;
      };
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

type NotificationReadinessBlocker = {
  code: string;
  envVars: string[];
  detail: string;
  nextCommand: string;
};

const NOTIFICATION_BLOCKER_ALIGNMENT_STATUSES = ['aligned', 'display-fallback', 'mismatch'] as const;

type NotificationBlockerAlignmentStatus = (typeof NOTIFICATION_BLOCKER_ALIGNMENT_STATUSES)[number];

const NOTIFICATION_BLOCKER_ALIGNMENT_STATUS = {
  aligned: 'aligned',
  displayFallback: 'display-fallback',
  mismatch: 'mismatch',
} satisfies Record<string, NotificationBlockerAlignmentStatus>;

const NOTIFICATION_BLOCKER_ALIGNMENT_STATUS_COUNT = NOTIFICATION_BLOCKER_ALIGNMENT_STATUSES.length;

const NOTIFICATION_BLOCKER_INSPECTION_CONTRACT_STATUSES = [
  'ready',
  'inspection-incomplete',
  'alignment-status-contract-incomplete',
] as const;

type NotificationBlockerInspectionContractStatus =
  (typeof NOTIFICATION_BLOCKER_INSPECTION_CONTRACT_STATUSES)[number];

const NOTIFICATION_BLOCKER_INSPECTION_CONTRACT_STATUS = {
  ready: 'ready',
  inspectionIncomplete: 'inspection-incomplete',
  alignmentStatusContractIncomplete: 'alignment-status-contract-incomplete',
} satisfies Record<string, NotificationBlockerInspectionContractStatus>;

const NOTIFICATION_BLOCKER_INSPECTION_CONTRACT_STATUS_COUNT =
  NOTIFICATION_BLOCKER_INSPECTION_CONTRACT_STATUSES.length;

const NOTIFICATION_BLOCKER_CONTRACT_STATUSES = [
  'ready',
  'legacy-mismatch',
  'payload-incomplete',
  'command-incomplete',
] as const;

type NotificationBlockerContractStatus = (typeof NOTIFICATION_BLOCKER_CONTRACT_STATUSES)[number];

const NOTIFICATION_BLOCKER_CONTRACT_STATUS = {
  ready: 'ready',
  legacyMismatch: 'legacy-mismatch',
  payloadIncomplete: 'payload-incomplete',
  commandIncomplete: 'command-incomplete',
} satisfies Record<string, NotificationBlockerContractStatus>;

const NOTIFICATION_BLOCKER_CONTRACT_STATUS_COUNT = NOTIFICATION_BLOCKER_CONTRACT_STATUSES.length;

const NOTIFICATION_BLOCKER_COMPOSITE_STATUSES = [
  'ready',
  'blocker-contract-incomplete',
  'status-contract-incomplete',
] as const;

type NotificationBlockerCompositeStatus = (typeof NOTIFICATION_BLOCKER_COMPOSITE_STATUSES)[number];

const NOTIFICATION_BLOCKER_COMPOSITE_STATUS = {
  ready: 'ready',
  blockerContractIncomplete: 'blocker-contract-incomplete',
  statusContractIncomplete: 'status-contract-incomplete',
} satisfies Record<string, NotificationBlockerCompositeStatus>;

const NOTIFICATION_BLOCKER_COMPOSITE_STATUS_COUNT = NOTIFICATION_BLOCKER_COMPOSITE_STATUSES.length;

const NOTIFICATION_BLOCKER_LAUNCH_STATUSES = [
  'ready',
  'inspection-contract-incomplete',
  'composite-contract-incomplete',
] as const;

type NotificationBlockerLaunchStatus = (typeof NOTIFICATION_BLOCKER_LAUNCH_STATUSES)[number];

const NOTIFICATION_BLOCKER_LAUNCH_STATUS = {
  ready: 'ready',
  inspectionContractIncomplete: 'inspection-contract-incomplete',
  compositeContractIncomplete: 'composite-contract-incomplete',
} satisfies Record<string, NotificationBlockerLaunchStatus>;

const NOTIFICATION_BLOCKER_LAUNCH_STATUS_COUNT = NOTIFICATION_BLOCKER_LAUNCH_STATUSES.length;

const NOTIFICATION_BLOCKER_LAUNCH_COMPOSITE_STATUSES = [
  'ready',
  'launch-contract-incomplete',
  'status-contract-incomplete',
] as const;

type NotificationBlockerLaunchCompositeStatus =
  (typeof NOTIFICATION_BLOCKER_LAUNCH_COMPOSITE_STATUSES)[number];

const NOTIFICATION_BLOCKER_LAUNCH_COMPOSITE_STATUS = {
  ready: 'ready',
  launchContractIncomplete: 'launch-contract-incomplete',
  statusContractIncomplete: 'status-contract-incomplete',
} satisfies Record<string, NotificationBlockerLaunchCompositeStatus>;

const NOTIFICATION_BLOCKER_LAUNCH_COMPOSITE_STATUS_COUNT =
  NOTIFICATION_BLOCKER_LAUNCH_COMPOSITE_STATUSES.length;

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_STATUSES = [
  'ready',
  'launch-composite-contract-incomplete',
] as const;

type NotificationBlockerLaunchReadinessStatus =
  (typeof NOTIFICATION_BLOCKER_LAUNCH_READINESS_STATUSES)[number];

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_STATUS = {
  ready: 'ready',
  launchCompositeContractIncomplete: 'launch-composite-contract-incomplete',
} satisfies Record<string, NotificationBlockerLaunchReadinessStatus>;

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_STATUS_COUNT =
  NOTIFICATION_BLOCKER_LAUNCH_READINESS_STATUSES.length;

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_STATUSES = [
  'ready',
  'launch-readiness-contract-incomplete',
] as const;

type NotificationBlockerLaunchReadinessContractStatus =
  (typeof NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_STATUSES)[number];

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_STATUS = {
  ready: 'ready',
  launchReadinessContractIncomplete: 'launch-readiness-contract-incomplete',
} satisfies Record<string, NotificationBlockerLaunchReadinessContractStatus>;

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_STATUS_COUNT =
  NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_STATUSES.length;

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_COMPOSITE_STATUSES = [
  'ready',
  'launch-readiness-contract-incomplete',
  'status-contract-incomplete',
] as const;

type NotificationBlockerLaunchReadinessContractCompositeStatus =
  (typeof NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_COMPOSITE_STATUSES)[number];

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_COMPOSITE_STATUS = {
  ready: 'ready',
  launchReadinessContractIncomplete: 'launch-readiness-contract-incomplete',
  statusContractIncomplete: 'status-contract-incomplete',
} satisfies Record<string, NotificationBlockerLaunchReadinessContractCompositeStatus>;

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_COMPOSITE_STATUS_COUNT =
  NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_COMPOSITE_STATUSES.length;

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_STATUSES = [
  'ready',
  'launch-readiness-contract-composite-contract-incomplete',
] as const;

type NotificationBlockerLaunchReadinessContractFinalStatus =
  (typeof NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_STATUSES)[number];

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_STATUS = {
  ready: 'ready',
  compositeContractIncomplete: 'launch-readiness-contract-composite-contract-incomplete',
} satisfies Record<string, NotificationBlockerLaunchReadinessContractFinalStatus>;

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_STATUS_COUNT =
  NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_STATUSES.length;

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_CONTRACT_STATUSES = [
  'ready',
  'final-contract-incomplete',
] as const;

type NotificationBlockerLaunchReadinessContractFinalContractStatus =
  (typeof NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_CONTRACT_STATUSES)[number];

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_CONTRACT_STATUS = {
  ready: 'ready',
  finalContractIncomplete: 'final-contract-incomplete',
} satisfies Record<string, NotificationBlockerLaunchReadinessContractFinalContractStatus>;

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_CONTRACT_STATUS_COUNT =
  NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_CONTRACT_STATUSES.length;

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_FINAL_CONTRACT_STATUSES = [
  'ready',
  'final-final-contract-incomplete',
] as const;

type NotificationBlockerLaunchReadinessContractFinalFinalContractStatus =
  (typeof NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_FINAL_CONTRACT_STATUSES)[number];

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_FINAL_CONTRACT_STATUS = {
  ready: 'ready',
  finalFinalContractIncomplete: 'final-final-contract-incomplete',
} satisfies Record<string, NotificationBlockerLaunchReadinessContractFinalFinalContractStatus>;

const NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_FINAL_CONTRACT_STATUS_COUNT =
  NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_FINAL_CONTRACT_STATUSES.length;

const NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_STATUSES = [
  'ready',
  'terminal-contract-incomplete',
] as const;

type NotificationBlockerContractTerminalStatus =
  (typeof NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_STATUSES)[number];

const NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_STATUS = {
  ready: 'ready',
  terminalContractIncomplete: 'terminal-contract-incomplete',
} satisfies Record<string, NotificationBlockerContractTerminalStatus>;

const NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_STATUS_COUNT =
  NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_STATUSES.length;

const NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_CONTRACT_STATUSES = [
  'ready',
  'terminal-contract-contract-incomplete',
] as const;

type NotificationBlockerContractTerminalContractStatus =
  (typeof NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_CONTRACT_STATUSES)[number];

const NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_CONTRACT_STATUS = {
  ready: 'ready',
  terminalContractContractIncomplete: 'terminal-contract-contract-incomplete',
} satisfies Record<string, NotificationBlockerContractTerminalContractStatus>;

const NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_CONTRACT_STATUS_COUNT =
  NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_CONTRACT_STATUSES.length;

const NOTIFICATION_READINESS_COMMAND_KEYS = [
  'propertyInquiryReadiness',
  'notificationReadiness',
  'strictNotificationReadiness',
  'strictNotificationReadinessContract',
  'launchReadiness',
] as const;

const NOTIFICATION_READINESS_COMMAND_COUNT = NOTIFICATION_READINESS_COMMAND_KEYS.length;

type NotificationReadinessMetadata = {
  level: 'ready' | 'blocked';
  summary: string;
  terminal?: string;
  route?: string;
  nextCommand?: string;
  blockerCodes?: string[];
  blockerEnvVars?: string[];
  blockedBy: NotificationReadinessBlocker[];
  commands: {
    propertyInquiryReadiness: string;
    notificationReadiness: string;
    strictNotificationReadiness: string;
    strictNotificationReadinessContract: string;
    launchReadiness: string;
  };
};

type AlertStatusResponse =
  | {
      success: true;
      generatedAt: string;
      terminal: 'Terminal 5';
      route: '/api/process-alerts';
      command: string;
      mode: 'status' | 'preview' | 'process';
      module: string;
      timeoutMs: number;
      auth: {
        configured: boolean;
      };
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
      notificationReadiness?: NotificationReadinessMetadata;
      diagnostics: Array<{ area: string; message: string }>;
      executionPlan?: AlertExecutionPlan;
      recommendations: string[];
      nextRunHint?: string;
      nextDryRunHint?: string;
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
      detail?: string;
      generatedAt?: string;
      terminal?: 'Terminal 5';
      route?: '/api/process-alerts';
      command?: string;
      mode?: 'status' | 'preview' | 'process';
      module?: string;
      timeoutMs?: number;
      auth?: {
        configured: boolean;
      };
      commands?: {
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
      notificationReadiness?: NotificationReadinessMetadata;
      diagnostics?: Array<{ area: string; message: string }>;
      executionPlan?: AlertExecutionPlan;
      recommendations?: string[];
      nextRunHint?: string;
      nextDryRunHint?: string;
      stats?: {
        pending: number;
        processing: number;
        sent: number;
        failed: number;
        skipped: number;
        actionable: number;
        terminal: number;
      };
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
type CRMTaskTypeFilter = 'all' | 'property' | 'strategy';

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
      tasks?: CRMTask[];
      summary?: CRMTaskSummary;
      audit?: CRMTaskAuditSummary;
      readiness?: CRMTaskReadiness;
      verdict?: string;
      filters?: {
        limit: number;
        status: string;
        effectiveStatuses: string[] | null;
        type: string | null;
      };
      operations?: CRMTaskOperations;
      auth?: {
        configured: boolean;
      };
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
      inspectionSource?: 'Detail Route';
      route?: string;
      command?: string;
      task?: CRMTask;
      operations?: CRMTaskOperations;
      audit?: {
        required: boolean;
        requiredForStatuses: string[];
        reviewNoteMaxLength: number;
      };
      auth?: {
        configured: boolean;
      };
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

const emptyIntakeReadiness: IntakeReadiness = {
  level: 'watch',
  summary: 'Intake readiness has not been loaded.',
  nextAction: 'Load recent intake signals from the admin API.',
  terminal: 'Terminal 5',
  nextCommand: 'curl --max-time 8 -s "http://localhost:3000/api/admin/intake-signals?limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"',
  gates: [],
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

const ADMIN_KEY_SESSION_STORAGE_KEY = 'reie.adminKey';

const crmTaskTypeOptions: Array<{ value: CRMTaskTypeFilter; label: string; apiType: string | null }> = [
  { value: 'all', label: 'All', apiType: null },
  { value: 'property', label: 'Property', apiType: 'property_inquiry' },
  { value: 'strategy', label: 'Strategy', apiType: 'strategy_intake' },
];

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

function getNotificationBlockerCodes(readiness: NotificationReadinessMetadata) {
  if (readiness.blockerCodes?.length) return readiness.blockerCodes;
  return readiness.blockedBy.map((blocker) => blocker.code);
}

function getNotificationBlockerEnvVars(readiness: NotificationReadinessMetadata) {
  if (readiness.blockerEnvVars?.length) return readiness.blockerEnvVars;
  return Array.from(new Set(readiness.blockedBy.flatMap((blocker) => blocker.envVars)));
}

function getStructuredNotificationBlockerEnvVars(readiness: NotificationReadinessMetadata) {
  return Array.from(new Set(readiness.blockedBy.flatMap((blocker) => blocker.envVars)));
}

function getNotificationBlockerSummaryCounts(readiness: NotificationReadinessMetadata) {
  return {
    apiCodeCount: readiness.blockerCodes?.length ?? 0,
    apiEnvVarCount: readiness.blockerEnvVars?.length ?? 0,
    structuredCodeCount: readiness.blockedBy.length,
    structuredEnvVarCount: getStructuredNotificationBlockerEnvVars(readiness).length,
  };
}

function isNotificationBlockerSummaryAligned(readiness: NotificationReadinessMetadata) {
  const counts = getNotificationBlockerSummaryCounts(readiness);
  return (
    getNotificationBlockerCodes(readiness).length === counts.structuredCodeCount &&
    getNotificationBlockerEnvVars(readiness).length === counts.structuredEnvVarCount
  );
}

function isNotificationBlockerApiSummaryAligned(readiness: NotificationReadinessMetadata) {
  const structuredCodes = readiness.blockedBy.map((blocker) => blocker.code);
  const structuredEnvVars = getStructuredNotificationBlockerEnvVars(readiness);
  const counts = getNotificationBlockerSummaryCounts(readiness);
  return (
    counts.apiCodeCount === counts.structuredCodeCount &&
    counts.apiEnvVarCount === counts.structuredEnvVarCount &&
    structuredCodes.every((code) => readiness.blockerCodes?.includes(code)) &&
    structuredEnvVars.every((envVar) => readiness.blockerEnvVars?.includes(envVar))
  );
}

function getNotificationBlockerInspectionMetadata(readiness: NotificationReadinessMetadata) {
  const blockerCodes = getNotificationBlockerCodes(readiness);
  const blockerEnvVars = getNotificationBlockerEnvVars(readiness);
  const counts = getNotificationBlockerSummaryCounts(readiness);
  const blockerCount = readiness.blockedBy.length;
  const summaryAligned = isNotificationBlockerSummaryAligned(readiness);
  const apiSummaryAligned = isNotificationBlockerApiSummaryAligned(readiness);
  const blockerCountAligned =
    blockerCount === counts.apiCodeCount && blockerCount === counts.structuredCodeCount;
  const blockerEnvVarCountAligned = counts.apiEnvVarCount === counts.structuredEnvVarCount;
  const blockerCountsAligned = blockerCountAligned && blockerEnvVarCountAligned;
  const blockerCountsReady = blockerCountsAligned && summaryAligned && apiSummaryAligned;
  const firstBlocker = readiness.blockedBy[0];
  const firstBlockerComplete = Boolean(
    firstBlocker?.code &&
    firstBlocker.envVars.length > 0 &&
    firstBlocker.detail &&
    firstBlocker.nextCommand,
  );
  const blockerPayloadReady = blockerCountsReady && firstBlockerComplete;
  const commandKeys = NOTIFICATION_READINESS_COMMAND_KEYS;
  const commandsComplete = commandKeys.every((key) => Boolean(readiness.commands[key]));
  const commandKeyCount = commandKeys.length;
  const commandCount = commandKeys.filter((key) => Boolean(readiness.commands[key])).length;
  const commandKeyCountAligned = commandKeyCount === NOTIFICATION_READINESS_COMMAND_COUNT;
  const commandCountAligned = commandCount === NOTIFICATION_READINESS_COMMAND_COUNT;
  const commandInspectionReady = commandsComplete && commandKeyCountAligned && commandCountAligned;
  const blockerContractReady = blockerPayloadReady && commandInspectionReady;
  const blockerInspectionReady = apiSummaryAligned && firstBlockerComplete && commandInspectionReady;
  const blockerContractLegacyAligned = blockerContractReady === blockerInspectionReady;
  const blockerContractStatus: NotificationBlockerContractStatus = blockerContractReady
    ? NOTIFICATION_BLOCKER_CONTRACT_STATUS.ready
    : !blockerContractLegacyAligned
      ? NOTIFICATION_BLOCKER_CONTRACT_STATUS.legacyMismatch
      : !blockerPayloadReady
        ? NOTIFICATION_BLOCKER_CONTRACT_STATUS.payloadIncomplete
        : NOTIFICATION_BLOCKER_CONTRACT_STATUS.commandIncomplete;
  const blockerContractStatusAligned =
    (blockerContractStatus === NOTIFICATION_BLOCKER_CONTRACT_STATUS.ready) === blockerContractReady;
  const blockerContractStatusOptionCount = NOTIFICATION_BLOCKER_CONTRACT_STATUSES.length;
  const blockerContractStatusExpectedCount = NOTIFICATION_BLOCKER_CONTRACT_STATUS_COUNT;
  const blockerContractStatusOptionCountAligned =
    blockerContractStatusOptionCount === blockerContractStatusExpectedCount;
  const blockerContractStatusKnown = NOTIFICATION_BLOCKER_CONTRACT_STATUSES.includes(blockerContractStatus);
  const blockerContractStatusContractReady =
    blockerContractStatusKnown && blockerContractStatusAligned && blockerContractStatusOptionCountAligned;
  const blockerContractCompositeReady = blockerContractReady && blockerContractStatusContractReady;
  const blockerContractCompositeStatus: NotificationBlockerCompositeStatus = blockerContractCompositeReady
    ? NOTIFICATION_BLOCKER_COMPOSITE_STATUS.ready
    : !blockerContractReady
      ? NOTIFICATION_BLOCKER_COMPOSITE_STATUS.blockerContractIncomplete
      : NOTIFICATION_BLOCKER_COMPOSITE_STATUS.statusContractIncomplete;
  const blockerContractCompositeStatusAligned =
    (blockerContractCompositeStatus === NOTIFICATION_BLOCKER_COMPOSITE_STATUS.ready) ===
    blockerContractCompositeReady;
  const blockerContractCompositeStatusOptionCount = NOTIFICATION_BLOCKER_COMPOSITE_STATUSES.length;
  const blockerContractCompositeStatusExpectedCount = NOTIFICATION_BLOCKER_COMPOSITE_STATUS_COUNT;
  const blockerContractCompositeStatusOptionCountAligned =
    blockerContractCompositeStatusOptionCount === blockerContractCompositeStatusExpectedCount;
  const blockerContractCompositeStatusKnown =
    NOTIFICATION_BLOCKER_COMPOSITE_STATUSES.includes(blockerContractCompositeStatus);
  const blockerContractCompositeStatusContractReady =
    blockerContractCompositeStatusKnown &&
    blockerContractCompositeStatusAligned &&
    blockerContractCompositeStatusOptionCountAligned;
  const blockerContractCompositeContractReady =
    blockerContractCompositeReady && blockerContractCompositeStatusContractReady;
  const alignmentStatus: NotificationBlockerAlignmentStatus = apiSummaryAligned
    ? NOTIFICATION_BLOCKER_ALIGNMENT_STATUS.aligned
    : summaryAligned
      ? NOTIFICATION_BLOCKER_ALIGNMENT_STATUS.displayFallback
      : NOTIFICATION_BLOCKER_ALIGNMENT_STATUS.mismatch;
  const alignmentStatusAligned =
    (alignmentStatus === NOTIFICATION_BLOCKER_ALIGNMENT_STATUS.aligned) === apiSummaryAligned;
  const alignmentStatusOptionCount = NOTIFICATION_BLOCKER_ALIGNMENT_STATUSES.length;
  const alignmentStatusExpectedCount = NOTIFICATION_BLOCKER_ALIGNMENT_STATUS_COUNT;
  const alignmentStatusOptionCountAligned = alignmentStatusOptionCount === alignmentStatusExpectedCount;
  const alignmentStatusKnown = NOTIFICATION_BLOCKER_ALIGNMENT_STATUSES.includes(alignmentStatus);
  const alignmentStatusContractReady =
    alignmentStatusKnown && alignmentStatusAligned && alignmentStatusOptionCountAligned;
  const blockerInspectionContractReady = blockerInspectionReady && alignmentStatusContractReady;
  const blockerInspectionContractStatus: NotificationBlockerInspectionContractStatus =
    blockerInspectionContractReady
      ? NOTIFICATION_BLOCKER_INSPECTION_CONTRACT_STATUS.ready
      : !blockerInspectionReady
        ? NOTIFICATION_BLOCKER_INSPECTION_CONTRACT_STATUS.inspectionIncomplete
        : NOTIFICATION_BLOCKER_INSPECTION_CONTRACT_STATUS.alignmentStatusContractIncomplete;
  const blockerInspectionContractStatusAligned =
    (blockerInspectionContractStatus === NOTIFICATION_BLOCKER_INSPECTION_CONTRACT_STATUS.ready) ===
    blockerInspectionContractReady;
  const blockerInspectionContractStatusOptionCount =
    NOTIFICATION_BLOCKER_INSPECTION_CONTRACT_STATUS_COUNT;
  const blockerInspectionContractStatusExpectedCount =
    NOTIFICATION_BLOCKER_INSPECTION_CONTRACT_STATUS_COUNT;
  const blockerInspectionContractStatusOptionCountAligned =
    blockerInspectionContractStatusOptionCount === blockerInspectionContractStatusExpectedCount;
  const blockerInspectionContractStatusKnown =
    NOTIFICATION_BLOCKER_INSPECTION_CONTRACT_STATUSES.includes(blockerInspectionContractStatus);
  const blockerInspectionContractStatusContractReady =
    blockerInspectionContractStatusKnown &&
    blockerInspectionContractStatusAligned &&
    blockerInspectionContractStatusOptionCountAligned;
  const blockerInspectionContractContractReady =
    blockerInspectionContractReady && blockerInspectionContractStatusContractReady;
  const blockerLaunchContractReady =
    blockerInspectionContractContractReady && blockerContractCompositeContractReady;
  const blockerLaunchContractStatus: NotificationBlockerLaunchStatus = blockerLaunchContractReady
    ? NOTIFICATION_BLOCKER_LAUNCH_STATUS.ready
    : !blockerInspectionContractContractReady
      ? NOTIFICATION_BLOCKER_LAUNCH_STATUS.inspectionContractIncomplete
      : NOTIFICATION_BLOCKER_LAUNCH_STATUS.compositeContractIncomplete;
  const blockerLaunchContractStatusAligned =
    (blockerLaunchContractStatus === NOTIFICATION_BLOCKER_LAUNCH_STATUS.ready) === blockerLaunchContractReady;
  const blockerLaunchContractStatusOptionCount = NOTIFICATION_BLOCKER_LAUNCH_STATUSES.length;
  const blockerLaunchContractStatusExpectedCount = NOTIFICATION_BLOCKER_LAUNCH_STATUS_COUNT;
  const blockerLaunchContractStatusOptionCountAligned =
    blockerLaunchContractStatusOptionCount === blockerLaunchContractStatusExpectedCount;
  const blockerLaunchContractStatusKnown =
    NOTIFICATION_BLOCKER_LAUNCH_STATUSES.includes(blockerLaunchContractStatus);
  const blockerLaunchContractStatusContractReady =
    blockerLaunchContractStatusKnown &&
    blockerLaunchContractStatusAligned &&
    blockerLaunchContractStatusOptionCountAligned;
  const blockerLaunchContractCompositeReady =
    blockerLaunchContractReady && blockerLaunchContractStatusContractReady;
  const blockerLaunchContractCompositeStatus: NotificationBlockerLaunchCompositeStatus =
    blockerLaunchContractCompositeReady
      ? NOTIFICATION_BLOCKER_LAUNCH_COMPOSITE_STATUS.ready
      : !blockerLaunchContractReady
        ? NOTIFICATION_BLOCKER_LAUNCH_COMPOSITE_STATUS.launchContractIncomplete
        : NOTIFICATION_BLOCKER_LAUNCH_COMPOSITE_STATUS.statusContractIncomplete;
  const blockerLaunchContractCompositeStatusAligned =
    (blockerLaunchContractCompositeStatus === NOTIFICATION_BLOCKER_LAUNCH_COMPOSITE_STATUS.ready) ===
    blockerLaunchContractCompositeReady;
  const blockerLaunchContractCompositeStatusOptionCount =
    NOTIFICATION_BLOCKER_LAUNCH_COMPOSITE_STATUSES.length;
  const blockerLaunchContractCompositeStatusExpectedCount =
    NOTIFICATION_BLOCKER_LAUNCH_COMPOSITE_STATUS_COUNT;
  const blockerLaunchContractCompositeStatusOptionCountAligned =
    blockerLaunchContractCompositeStatusOptionCount === blockerLaunchContractCompositeStatusExpectedCount;
  const blockerLaunchContractCompositeStatusKnown =
    NOTIFICATION_BLOCKER_LAUNCH_COMPOSITE_STATUSES.includes(blockerLaunchContractCompositeStatus);
  const blockerLaunchContractCompositeStatusContractReady =
    blockerLaunchContractCompositeStatusKnown &&
    blockerLaunchContractCompositeStatusAligned &&
    blockerLaunchContractCompositeStatusOptionCountAligned;
  const blockerLaunchContractCompositeContractReady =
    blockerLaunchContractCompositeReady && blockerLaunchContractCompositeStatusContractReady;
  const blockerLaunchReadinessStatus: NotificationBlockerLaunchReadinessStatus =
    blockerLaunchContractCompositeContractReady
      ? NOTIFICATION_BLOCKER_LAUNCH_READINESS_STATUS.ready
      : NOTIFICATION_BLOCKER_LAUNCH_READINESS_STATUS.launchCompositeContractIncomplete;
  const blockerLaunchReadinessStatusOptionCount =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_STATUSES.length;
  const blockerLaunchReadinessStatusExpectedCount =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_STATUS_COUNT;
  const blockerLaunchReadinessStatusOptionCountAligned =
    blockerLaunchReadinessStatusOptionCount === blockerLaunchReadinessStatusExpectedCount;
  const blockerLaunchReadinessStatusKnown =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_STATUSES.includes(blockerLaunchReadinessStatus);
  const blockerLaunchReadinessStatusAligned =
    (blockerLaunchReadinessStatus === NOTIFICATION_BLOCKER_LAUNCH_READINESS_STATUS.ready) ===
    blockerLaunchContractCompositeContractReady;
  const blockerLaunchReadinessStatusContractReady =
    blockerLaunchReadinessStatusKnown &&
    blockerLaunchReadinessStatusAligned &&
    blockerLaunchReadinessStatusOptionCountAligned;
  const blockerLaunchReadinessContractReady =
    blockerLaunchContractCompositeContractReady && blockerLaunchReadinessStatusContractReady;
  const blockerLaunchReadinessContractStatus: NotificationBlockerLaunchReadinessContractStatus =
    blockerLaunchReadinessContractReady
      ? NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_STATUS.ready
      : NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_STATUS.launchReadinessContractIncomplete;
  const blockerLaunchReadinessContractStatusOptionCount =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_STATUSES.length;
  const blockerLaunchReadinessContractStatusExpectedCount =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_STATUS_COUNT;
  const blockerLaunchReadinessContractStatusOptionCountAligned =
    blockerLaunchReadinessContractStatusOptionCount ===
    blockerLaunchReadinessContractStatusExpectedCount;
  const blockerLaunchReadinessContractStatusKnown =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_STATUSES.includes(
      blockerLaunchReadinessContractStatus,
    );
  const blockerLaunchReadinessContractStatusAligned =
    (blockerLaunchReadinessContractStatus ===
      NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_STATUS.ready) ===
    blockerLaunchReadinessContractReady;
  const blockerLaunchReadinessContractStatusContractReady =
    blockerLaunchReadinessContractStatusKnown &&
    blockerLaunchReadinessContractStatusAligned &&
    blockerLaunchReadinessContractStatusOptionCountAligned;
  const blockerLaunchReadinessContractContractReady =
    blockerLaunchReadinessContractReady &&
    blockerLaunchReadinessContractStatusContractReady;
  const blockerLaunchReadinessContractCompositeStatus:
    NotificationBlockerLaunchReadinessContractCompositeStatus =
    blockerLaunchReadinessContractContractReady
      ? NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_COMPOSITE_STATUS.ready
      : !blockerLaunchReadinessContractReady
        ? NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_COMPOSITE_STATUS.launchReadinessContractIncomplete
        : NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_COMPOSITE_STATUS.statusContractIncomplete;
  const blockerLaunchReadinessContractCompositeStatusOptionCount =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_COMPOSITE_STATUSES.length;
  const blockerLaunchReadinessContractCompositeStatusExpectedCount =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_COMPOSITE_STATUS_COUNT;
  const blockerLaunchReadinessContractCompositeStatusOptionCountAligned =
    blockerLaunchReadinessContractCompositeStatusOptionCount ===
    blockerLaunchReadinessContractCompositeStatusExpectedCount;
  const blockerLaunchReadinessContractCompositeStatusKnown =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_COMPOSITE_STATUSES.includes(
      blockerLaunchReadinessContractCompositeStatus,
    );
  const blockerLaunchReadinessContractCompositeStatusAligned =
    (blockerLaunchReadinessContractCompositeStatus ===
      NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_COMPOSITE_STATUS.ready) ===
    blockerLaunchReadinessContractContractReady;
  const blockerLaunchReadinessContractCompositeStatusContractReady =
    blockerLaunchReadinessContractCompositeStatusKnown &&
    blockerLaunchReadinessContractCompositeStatusAligned &&
    blockerLaunchReadinessContractCompositeStatusOptionCountAligned;
  const blockerLaunchReadinessContractCompositeContractReady =
    blockerLaunchReadinessContractContractReady &&
    blockerLaunchReadinessContractCompositeStatusContractReady;
  const blockerLaunchReadinessContractFinalStatus:
    NotificationBlockerLaunchReadinessContractFinalStatus =
    blockerLaunchReadinessContractCompositeContractReady
      ? NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_STATUS.ready
      : NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_STATUS.compositeContractIncomplete;
  const blockerLaunchReadinessContractFinalStatusOptionCount =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_STATUSES.length;
  const blockerLaunchReadinessContractFinalStatusExpectedCount =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_STATUS_COUNT;
  const blockerLaunchReadinessContractFinalStatusOptionCountAligned =
    blockerLaunchReadinessContractFinalStatusOptionCount ===
    blockerLaunchReadinessContractFinalStatusExpectedCount;
  const blockerLaunchReadinessContractFinalStatusKnown =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_STATUSES.includes(
      blockerLaunchReadinessContractFinalStatus,
    );
  const blockerLaunchReadinessContractFinalStatusAligned =
    (blockerLaunchReadinessContractFinalStatus ===
      NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_STATUS.ready) ===
    blockerLaunchReadinessContractCompositeContractReady;
  const blockerLaunchReadinessContractFinalStatusContractReady =
    blockerLaunchReadinessContractFinalStatusKnown &&
    blockerLaunchReadinessContractFinalStatusAligned &&
    blockerLaunchReadinessContractFinalStatusOptionCountAligned;
  const blockerLaunchReadinessContractFinalContractReady =
    blockerLaunchReadinessContractCompositeContractReady &&
    blockerLaunchReadinessContractFinalStatusContractReady;
  const blockerLaunchReadinessContractFinalContractStatus:
    NotificationBlockerLaunchReadinessContractFinalContractStatus =
    blockerLaunchReadinessContractFinalContractReady
      ? NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_CONTRACT_STATUS.ready
      : NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_CONTRACT_STATUS.finalContractIncomplete;
  const blockerLaunchReadinessContractFinalContractStatusOptionCount =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_CONTRACT_STATUSES.length;
  const blockerLaunchReadinessContractFinalContractStatusExpectedCount =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_CONTRACT_STATUS_COUNT;
  const blockerLaunchReadinessContractFinalContractStatusOptionCountAligned =
    blockerLaunchReadinessContractFinalContractStatusOptionCount ===
    blockerLaunchReadinessContractFinalContractStatusExpectedCount;
  const blockerLaunchReadinessContractFinalContractStatusKnown =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_CONTRACT_STATUSES.includes(
      blockerLaunchReadinessContractFinalContractStatus,
    );
  const blockerLaunchReadinessContractFinalContractStatusAligned =
    (blockerLaunchReadinessContractFinalContractStatus ===
      NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_CONTRACT_STATUS.ready) ===
    blockerLaunchReadinessContractFinalContractReady;
  const blockerLaunchReadinessContractFinalContractStatusContractReady =
    blockerLaunchReadinessContractFinalContractStatusKnown &&
    blockerLaunchReadinessContractFinalContractStatusAligned &&
    blockerLaunchReadinessContractFinalContractStatusOptionCountAligned;
  const blockerLaunchReadinessContractFinalFinalContractReady =
    blockerLaunchReadinessContractFinalContractReady &&
    blockerLaunchReadinessContractFinalContractStatusContractReady;
  const blockerLaunchReadinessContractFinalFinalContractStatus:
    NotificationBlockerLaunchReadinessContractFinalFinalContractStatus =
    blockerLaunchReadinessContractFinalFinalContractReady
      ? NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_FINAL_CONTRACT_STATUS.ready
      : NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_FINAL_CONTRACT_STATUS.finalFinalContractIncomplete;
  const blockerLaunchReadinessContractFinalFinalContractStatusOptionCount =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_FINAL_CONTRACT_STATUSES.length;
  const blockerLaunchReadinessContractFinalFinalContractStatusExpectedCount =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_FINAL_CONTRACT_STATUS_COUNT;
  const blockerLaunchReadinessContractFinalFinalContractStatusOptionCountAligned =
    blockerLaunchReadinessContractFinalFinalContractStatusOptionCount ===
    blockerLaunchReadinessContractFinalFinalContractStatusExpectedCount;
  const blockerLaunchReadinessContractFinalFinalContractStatusKnown =
    NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_FINAL_CONTRACT_STATUSES.includes(
      blockerLaunchReadinessContractFinalFinalContractStatus,
    );
  const blockerLaunchReadinessContractFinalFinalContractStatusAligned =
    (blockerLaunchReadinessContractFinalFinalContractStatus ===
      NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_FINAL_CONTRACT_STATUS.ready) ===
    blockerLaunchReadinessContractFinalFinalContractReady;
  const blockerLaunchReadinessContractFinalFinalContractStatusContractReady =
    blockerLaunchReadinessContractFinalFinalContractStatusKnown &&
    blockerLaunchReadinessContractFinalFinalContractStatusAligned &&
    blockerLaunchReadinessContractFinalFinalContractStatusOptionCountAligned;
  const blockerLaunchReadinessContractFinalFinalContractContractReady =
    blockerLaunchReadinessContractFinalFinalContractReady &&
    blockerLaunchReadinessContractFinalFinalContractStatusContractReady;
  const blockerContractTerminalReady =
    blockerLaunchReadinessContractFinalFinalContractContractReady && blockerContractCompositeContractReady;
  const blockerContractTerminalStatus: NotificationBlockerContractTerminalStatus =
    blockerContractTerminalReady
      ? NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_STATUS.ready
      : NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_STATUS.terminalContractIncomplete;
  const blockerContractTerminalStatusOptionCount =
    NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_STATUSES.length;
  const blockerContractTerminalStatusExpectedCount =
    NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_STATUS_COUNT;
  const blockerContractTerminalStatusOptionCountAligned =
    blockerContractTerminalStatusOptionCount === blockerContractTerminalStatusExpectedCount;
  const blockerContractTerminalStatusKnown =
    NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_STATUSES.includes(blockerContractTerminalStatus);
  const blockerContractTerminalStatusAligned =
    (blockerContractTerminalStatus === NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_STATUS.ready) ===
    blockerContractTerminalReady;
  const blockerContractTerminalStatusContractReady =
    blockerContractTerminalStatusKnown &&
    blockerContractTerminalStatusAligned &&
    blockerContractTerminalStatusOptionCountAligned;
  const blockerContractTerminalContractReady =
    blockerContractTerminalReady && blockerContractTerminalStatusContractReady;
  const blockerContractTerminalContractStatus: NotificationBlockerContractTerminalContractStatus =
    blockerContractTerminalContractReady
      ? NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_CONTRACT_STATUS.ready
      : NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_CONTRACT_STATUS.terminalContractContractIncomplete;
  const blockerContractTerminalContractStatusOptionCount =
    NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_CONTRACT_STATUSES.length;
  const blockerContractTerminalContractStatusExpectedCount =
    NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_CONTRACT_STATUS_COUNT;
  const blockerContractTerminalContractStatusOptionCountAligned =
    blockerContractTerminalContractStatusOptionCount ===
    blockerContractTerminalContractStatusExpectedCount;
  const blockerContractTerminalContractStatusKnown =
    NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_CONTRACT_STATUSES.includes(
      blockerContractTerminalContractStatus,
    );
  const blockerContractTerminalContractStatusAligned =
    (blockerContractTerminalContractStatus ===
      NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_CONTRACT_STATUS.ready) ===
    blockerContractTerminalContractReady;
  const blockerContractTerminalContractStatusContractReady =
    blockerContractTerminalContractStatusKnown &&
    blockerContractTerminalContractStatusAligned &&
    blockerContractTerminalContractStatusOptionCountAligned;
  const blockerContractTerminalContractContractReady =
    blockerContractTerminalContractReady && blockerContractTerminalContractStatusContractReady;
  const firstBlockerContractReady =
    firstBlockerComplete && blockerContractTerminalContractContractReady;
  const blockerPayloadContractReady = blockerPayloadReady && firstBlockerContractReady;
  const blockerContractPayloadReady = blockerContractReady && blockerPayloadContractReady;
  const blockerInspectionPayloadReady = blockerInspectionReady && blockerContractPayloadReady;
  const blockerInspectionContractPayloadReady =
    blockerInspectionContractReady && blockerInspectionPayloadReady;
  const blockerLaunchContractPayloadReady =
    blockerLaunchContractReady && blockerInspectionContractPayloadReady;
  const blockerLaunchContractStatusPayloadReady =
    blockerLaunchContractStatusContractReady && blockerLaunchContractPayloadReady;
  const blockerLaunchContractCompositePayloadReady =
    blockerLaunchContractCompositeReady && blockerLaunchContractStatusPayloadReady;
  const blockerLaunchContractCompositeStatusPayloadReady =
    blockerLaunchContractCompositeStatusContractReady && blockerLaunchContractCompositePayloadReady;
  const blockerLaunchContractCompositeContractPayloadReady =
    blockerLaunchContractCompositeContractReady && blockerLaunchContractCompositeStatusPayloadReady;
  const blockerLaunchReadinessStatusPayloadReady =
    blockerLaunchReadinessStatusContractReady && blockerLaunchContractCompositeContractPayloadReady;
  const blockerLaunchReadinessContractPayloadReady =
    blockerLaunchReadinessContractReady && blockerLaunchReadinessStatusPayloadReady;
  const blockerLaunchReadinessContractStatusPayloadReady =
    blockerLaunchReadinessContractStatusContractReady && blockerLaunchReadinessContractPayloadReady;
  const blockerLaunchReadinessContractContractPayloadReady =
    blockerLaunchReadinessContractContractReady && blockerLaunchReadinessContractStatusPayloadReady;
  const blockerLaunchReadinessContractCompositeStatusPayloadReady =
    blockerLaunchReadinessContractCompositeStatusContractReady &&
    blockerLaunchReadinessContractContractPayloadReady;
  const blockerLaunchReadinessContractCompositeContractPayloadReady =
    blockerLaunchReadinessContractCompositeContractReady &&
    blockerLaunchReadinessContractCompositeStatusPayloadReady;
  const blockerLaunchReadinessContractFinalStatusPayloadReady =
    blockerLaunchReadinessContractFinalStatusContractReady &&
    blockerLaunchReadinessContractCompositeContractPayloadReady;
  const blockerLaunchReadinessContractFinalContractPayloadReady =
    blockerLaunchReadinessContractFinalContractReady &&
    blockerLaunchReadinessContractFinalStatusPayloadReady;
  const blockerLaunchReadinessContractFinalContractStatusPayloadReady =
    blockerLaunchReadinessContractFinalContractStatusContractReady &&
    blockerLaunchReadinessContractFinalContractPayloadReady;
  const blockerLaunchReadinessContractFinalFinalContractPayloadReady =
    blockerLaunchReadinessContractFinalFinalContractReady &&
    blockerLaunchReadinessContractFinalContractStatusPayloadReady;
  const blockerLaunchReadinessContractFinalFinalContractStatusPayloadReady =
    blockerLaunchReadinessContractFinalFinalContractStatusContractReady &&
    blockerLaunchReadinessContractFinalFinalContractPayloadReady;
  const blockerLaunchReadinessContractFinalFinalContractContractPayloadReady =
    blockerLaunchReadinessContractFinalFinalContractContractReady &&
    blockerLaunchReadinessContractFinalFinalContractStatusPayloadReady;
  const blockerContractTerminalPayloadReady =
    blockerContractTerminalReady &&
    blockerLaunchReadinessContractFinalFinalContractContractPayloadReady;
  const blockerContractTerminalStatusPayloadReady =
    blockerContractTerminalStatusContractReady && blockerContractTerminalPayloadReady;
  const blockerContractTerminalContractPayloadReady =
    blockerContractTerminalContractReady && blockerContractTerminalStatusPayloadReady;
  const blockerContractTerminalContractStatusPayloadReady =
    blockerContractTerminalContractStatusContractReady && blockerContractTerminalContractPayloadReady;
  const blockerContractTerminalContractContractPayloadReady =
    blockerContractTerminalContractContractReady &&
    blockerContractTerminalContractStatusPayloadReady;
  const firstBlockerContractPayloadReady =
    firstBlockerContractReady && blockerContractTerminalContractContractPayloadReady;
  const blockerPayloadContractPayloadReady =
    blockerPayloadContractReady && firstBlockerContractPayloadReady;
  const blockerContractContractPayloadReady =
    blockerContractPayloadReady && blockerPayloadContractPayloadReady;
  const blockerInspectionContractContractPayloadReady =
    blockerInspectionPayloadReady && blockerContractContractPayloadReady;
  const blockerContractLegacyPayloadReady =
    blockerContractLegacyAligned && blockerInspectionContractContractPayloadReady;
  const blockerContractStatusPayloadReady =
    blockerContractStatusContractReady && blockerContractLegacyPayloadReady;
  const blockerContractCompositePayloadReady =
    blockerContractCompositeReady && blockerContractStatusPayloadReady;
  const blockerContractCompositeStatusPayloadReady =
    blockerContractCompositeStatusContractReady && blockerContractCompositePayloadReady;
  const blockerContractCompositeContractPayloadReady =
    blockerContractCompositeContractReady && blockerContractCompositeStatusPayloadReady;
  const commandInspectionPayloadReady =
    commandInspectionReady && blockerContractCompositeContractPayloadReady;
  const commandExpectedPayloadReady =
    commandKeyCountAligned && commandCountAligned && commandInspectionPayloadReady;
  const firstBlockerPayloadReady =
    firstBlockerComplete && commandExpectedPayloadReady;
  const firstBlockerIdentityPayloadReady =
    firstBlockerPayloadReady && firstBlockerComplete;
  const firstBlockerActionPayloadReady =
    firstBlockerIdentityPayloadReady && Boolean(firstBlocker?.nextCommand);
  const firstBlockerDetailPayloadReady =
    firstBlockerActionPayloadReady && Boolean(firstBlocker?.detail);
  const firstBlockerEnvPayloadReady =
    firstBlockerDetailPayloadReady && Boolean(firstBlocker?.envVars.length);
  const firstBlockerCodePayloadReady =
    firstBlockerEnvPayloadReady && Boolean(firstBlocker?.code);
  const notificationBlockerPanelPayloadReady =
    firstBlockerCodePayloadReady && commandExpectedPayloadReady;
  const notificationCommandPanelPayloadReady =
    notificationBlockerPanelPayloadReady && commandsComplete;
  const propertyInquiryCommandPayloadReady =
    notificationCommandPanelPayloadReady && Boolean(readiness.commands.propertyInquiryReadiness);
  const notificationReadinessCommandPayloadReady =
    propertyInquiryCommandPayloadReady && Boolean(readiness.commands.notificationReadiness);
  const strictNotificationReadinessCommandPayloadReady =
    notificationReadinessCommandPayloadReady && Boolean(readiness.commands.strictNotificationReadiness);
  const strictNotificationContractCommandPayloadReady =
    strictNotificationReadinessCommandPayloadReady &&
    Boolean(readiness.commands.strictNotificationReadinessContract);
  const launchReadinessCommandPayloadReady =
    strictNotificationContractCommandPayloadReady && Boolean(readiness.commands.launchReadiness);
  const notificationCommandChainPayloadReady = launchReadinessCommandPayloadReady;
  const notificationLaunchPanelPayloadReady =
    notificationBlockerPanelPayloadReady && notificationCommandChainPayloadReady;
  const notificationLaunchTerminalPayloadReady =
    notificationLaunchPanelPayloadReady && blockerContractTerminalContractContractPayloadReady;
  const notificationReadinessLevelPayloadReady =
    notificationLaunchTerminalPayloadReady && Boolean(readiness.level);
  return {
    blockerCodes,
    blockerEnvVars,
    counts,
    blockerCountAligned,
    blockerEnvVarCountAligned,
    blockerCountsAligned,
    blockerCountsReady,
    summaryAligned,
    apiSummaryAligned,
    alignmentStatus,
    alignmentStatusAligned,
    alignmentStatusOptionCount,
    alignmentStatusExpectedCount,
    alignmentStatusOptionCountAligned,
    alignmentStatusKnown,
    alignmentStatusContractReady,
    blockerInspectionContractReady,
    blockerInspectionContractStatus,
    blockerInspectionContractStatusAligned,
    blockerInspectionContractStatusOptionCount,
    blockerInspectionContractStatusExpectedCount,
    blockerInspectionContractStatusOptionCountAligned,
    blockerInspectionContractStatusKnown,
    blockerInspectionContractStatusContractReady,
    blockerInspectionContractContractReady,
    blockerLaunchContractReady,
    blockerLaunchContractStatus,
    blockerLaunchContractStatusAligned,
    blockerLaunchContractStatusOptionCount,
    blockerLaunchContractStatusExpectedCount,
    blockerLaunchContractStatusOptionCountAligned,
    blockerLaunchContractStatusKnown,
    blockerLaunchContractStatusContractReady,
    blockerLaunchContractCompositeReady,
    blockerLaunchContractCompositeStatus,
    blockerLaunchContractCompositeStatusAligned,
    blockerLaunchContractCompositeStatusOptionCount,
    blockerLaunchContractCompositeStatusExpectedCount,
    blockerLaunchContractCompositeStatusOptionCountAligned,
    blockerLaunchContractCompositeStatusKnown,
    blockerLaunchContractCompositeStatusContractReady,
    blockerLaunchContractCompositeContractReady,
    blockerLaunchReadinessStatus,
    blockerLaunchReadinessStatusOptionCount,
    blockerLaunchReadinessStatusExpectedCount,
    blockerLaunchReadinessStatusOptionCountAligned,
    blockerLaunchReadinessStatusKnown,
    blockerLaunchReadinessStatusAligned,
    blockerLaunchReadinessStatusContractReady,
    blockerLaunchReadinessContractReady,
    blockerLaunchReadinessContractStatus,
    blockerLaunchReadinessContractStatusOptionCount,
    blockerLaunchReadinessContractStatusExpectedCount,
    blockerLaunchReadinessContractStatusOptionCountAligned,
    blockerLaunchReadinessContractStatusKnown,
    blockerLaunchReadinessContractStatusAligned,
    blockerLaunchReadinessContractStatusContractReady,
    blockerLaunchReadinessContractContractReady,
    blockerLaunchReadinessContractCompositeStatus,
    blockerLaunchReadinessContractCompositeStatusOptionCount,
    blockerLaunchReadinessContractCompositeStatusExpectedCount,
    blockerLaunchReadinessContractCompositeStatusOptionCountAligned,
    blockerLaunchReadinessContractCompositeStatusKnown,
    blockerLaunchReadinessContractCompositeStatusAligned,
    blockerLaunchReadinessContractCompositeStatusContractReady,
    blockerLaunchReadinessContractCompositeContractReady,
    blockerLaunchReadinessContractFinalStatus,
    blockerLaunchReadinessContractFinalStatusOptionCount,
    blockerLaunchReadinessContractFinalStatusExpectedCount,
    blockerLaunchReadinessContractFinalStatusOptionCountAligned,
    blockerLaunchReadinessContractFinalStatusKnown,
    blockerLaunchReadinessContractFinalStatusAligned,
    blockerLaunchReadinessContractFinalStatusContractReady,
    blockerLaunchReadinessContractFinalContractReady,
    blockerLaunchReadinessContractFinalContractStatus,
    blockerLaunchReadinessContractFinalContractStatusOptionCount,
    blockerLaunchReadinessContractFinalContractStatusExpectedCount,
    blockerLaunchReadinessContractFinalContractStatusOptionCountAligned,
    blockerLaunchReadinessContractFinalContractStatusKnown,
    blockerLaunchReadinessContractFinalContractStatusAligned,
    blockerLaunchReadinessContractFinalContractStatusContractReady,
    blockerLaunchReadinessContractFinalFinalContractReady,
    blockerLaunchReadinessContractFinalFinalContractStatus,
    blockerLaunchReadinessContractFinalFinalContractStatusOptionCount,
    blockerLaunchReadinessContractFinalFinalContractStatusExpectedCount,
    blockerLaunchReadinessContractFinalFinalContractStatusOptionCountAligned,
    blockerLaunchReadinessContractFinalFinalContractStatusKnown,
    blockerLaunchReadinessContractFinalFinalContractStatusAligned,
    blockerLaunchReadinessContractFinalFinalContractStatusContractReady,
    blockerLaunchReadinessContractFinalFinalContractContractReady,
    blockerContractTerminalReady,
    blockerContractTerminalStatus,
    blockerContractTerminalStatusOptionCount,
    blockerContractTerminalStatusExpectedCount,
    blockerContractTerminalStatusOptionCountAligned,
    blockerContractTerminalStatusKnown,
    blockerContractTerminalStatusAligned,
    blockerContractTerminalStatusContractReady,
    blockerContractTerminalContractReady,
    blockerContractTerminalContractStatus,
    blockerContractTerminalContractStatusOptionCount,
    blockerContractTerminalContractStatusExpectedCount,
    blockerContractTerminalContractStatusOptionCountAligned,
    blockerContractTerminalContractStatusKnown,
    blockerContractTerminalContractStatusAligned,
    blockerContractTerminalContractStatusContractReady,
    blockerContractTerminalContractContractReady,
    firstBlockerComplete,
    firstBlockerContractReady,
    blockerPayloadReady,
    blockerPayloadContractReady,
    blockerContractReady,
    blockerContractPayloadReady,
    blockerInspectionReady,
    blockerInspectionPayloadReady,
    blockerInspectionContractPayloadReady,
    blockerLaunchContractPayloadReady,
    blockerLaunchContractStatusPayloadReady,
    blockerLaunchContractCompositePayloadReady,
    blockerLaunchContractCompositeStatusPayloadReady,
    blockerLaunchContractCompositeContractPayloadReady,
    blockerLaunchReadinessStatusPayloadReady,
    blockerLaunchReadinessContractPayloadReady,
    blockerLaunchReadinessContractStatusPayloadReady,
    blockerLaunchReadinessContractContractPayloadReady,
    blockerLaunchReadinessContractCompositeStatusPayloadReady,
    blockerLaunchReadinessContractCompositeContractPayloadReady,
    blockerLaunchReadinessContractFinalStatusPayloadReady,
    blockerLaunchReadinessContractFinalContractPayloadReady,
    blockerLaunchReadinessContractFinalContractStatusPayloadReady,
    blockerLaunchReadinessContractFinalFinalContractPayloadReady,
    blockerLaunchReadinessContractFinalFinalContractStatusPayloadReady,
    blockerLaunchReadinessContractFinalFinalContractContractPayloadReady,
    blockerContractTerminalPayloadReady,
    blockerContractTerminalStatusPayloadReady,
    blockerContractTerminalContractPayloadReady,
    blockerContractTerminalContractStatusPayloadReady,
    blockerContractTerminalContractContractPayloadReady,
    firstBlockerContractPayloadReady,
    blockerPayloadContractPayloadReady,
    blockerContractContractPayloadReady,
    blockerInspectionContractContractPayloadReady,
    blockerContractLegacyPayloadReady,
    blockerContractStatusPayloadReady,
    blockerContractCompositePayloadReady,
    blockerContractCompositeStatusPayloadReady,
    blockerContractCompositeContractPayloadReady,
    commandInspectionPayloadReady,
    commandExpectedPayloadReady,
    firstBlockerPayloadReady,
    firstBlockerIdentityPayloadReady,
    firstBlockerActionPayloadReady,
    firstBlockerDetailPayloadReady,
    firstBlockerEnvPayloadReady,
    firstBlockerCodePayloadReady,
    notificationBlockerPanelPayloadReady,
    notificationCommandPanelPayloadReady,
    propertyInquiryCommandPayloadReady,
    notificationReadinessCommandPayloadReady,
    strictNotificationReadinessCommandPayloadReady,
    strictNotificationContractCommandPayloadReady,
    launchReadinessCommandPayloadReady,
    notificationCommandChainPayloadReady,
    notificationLaunchPanelPayloadReady,
    notificationLaunchTerminalPayloadReady,
    notificationReadinessLevelPayloadReady,
    blockerContractLegacyAligned,
    blockerContractStatus,
    blockerContractStatusAligned,
    blockerContractStatusOptionCount,
    blockerContractStatusExpectedCount,
    blockerContractStatusOptionCountAligned,
    blockerContractStatusKnown,
    blockerContractStatusContractReady,
    blockerContractCompositeReady,
    blockerContractCompositeStatus,
    blockerContractCompositeStatusAligned,
    blockerContractCompositeStatusOptionCount,
    blockerContractCompositeStatusExpectedCount,
    blockerContractCompositeStatusOptionCountAligned,
    blockerContractCompositeStatusKnown,
    blockerContractCompositeStatusContractReady,
    blockerContractCompositeContractReady,
    commandsComplete,
    commandKeys,
    commandKeyCount,
    commandKeyCountAligned,
    commandCount,
    commandCountAligned,
    commandInspectionReady,
    expectedCommandCount: NOTIFICATION_READINESS_COMMAND_COUNT,
    hasRecipientBlocker: blockerCodes.includes('property_inquiry_recipient_missing'),
    hasDryRunBlocker: blockerCodes.includes('property_inquiry_dry_run_enabled'),
  };
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

function getIntakeReadinessClass(level: IntakeReadiness['level']) {
  if (level === 'ready') return 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100';
  if (level === 'watch') return 'border-amber-300/40 bg-amber-400/10 text-amber-100';
  return 'border-red-400/40 bg-red-500/10 text-red-100';
}

function getIntakeInspectionSourceClass(source?: IntakeApiMetadata['inspectionSource']) {
  if (source === 'Detail Route') return 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100';
  return 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100';
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

function getCRMTaskFocus(task: CRMTask) {
  if (task.type === 'property_inquiry') {
    if (task.priority === 'high') return 'Confirm property intent and showing urgency.';
    return 'Qualify property fit and buyer timeline.';
  }

  if (task.alertReadiness.level === 'incomplete') return 'Resolve missing alert criteria before automation.';
  if (task.alertReadiness.level === 'ready') return 'Prepare one advisory point from saved-search context.';
  if (task.alertReadiness.level === 'watch') return 'Review saved-search fit and refine criteria if needed.';

  return 'Review intake context and decide the next client action.';
}

function getCRMTaskClosureHint(task: CRMTask) {
  if (task.type === 'property_inquiry') return 'Record outreach result, buyer intent, and next property-specific step.';
  if (task.alertReadiness.level === 'incomplete') return 'Note what criteria were missing or how they were resolved.';
  return 'Record the decision, client-facing next step, and any follow-up owner.';
}

function hasCRMTaskApiMetadata(payload: CRMTaskApiErrorMetadata): payload is CRMTaskApiMetadata {
  return Boolean(payload.generatedAt && payload.terminal && payload.inspectionSource && payload.route && payload.command);
}

function hasIntakeApiMetadata(payload: IntakeApiErrorMetadata): payload is IntakeApiMetadata {
  return Boolean(payload.generatedAt && payload.terminal && payload.route && payload.command);
}

function hasControlStateApiMetadata(payload: ControlStateApiErrorMetadata): payload is ControlStateApiMetadata {
  return Boolean(payload.generatedAt && payload.terminal && payload.route && payload.command);
}

function getGateClass(status: MlsOperationalReadiness['gates'][number]['status'] | IntakeReadiness['gates'][number]['status']) {
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
  return mlsStatus?.queues.find((queue) => queue.name === name) || null;
}

function getRecordValue(value: unknown, key: string) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return (value as Record<string, unknown>)[key] ?? null;
}

function getRecordObject(value: unknown, key: string) {
  const nested = getRecordValue(value, key);
  if (!nested || typeof nested !== 'object' || Array.isArray(nested)) return null;
  return nested as Record<string, unknown>;
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
  const mediaDiagnostics = getRecordObject(value, 'mediaDiagnostics');
  const mediaListings = mediaDiagnostics ? getRecordValue(mediaDiagnostics, 'listingsWithMedia') : null;
  const mediaExtracted = mediaDiagnostics ? getRecordValue(mediaDiagnostics, 'extractedMediaCount') : null;
  const mediaIgnored = mediaDiagnostics ? getRecordValue(mediaDiagnostics, 'ignoredMediaItemCount') : null;
  const mediaDirectArrays = mediaDiagnostics ? getRecordValue(mediaDiagnostics, 'listingsWithDirectMedia') : null;
  const mediaNestedArrays = mediaDiagnostics ? getRecordValue(mediaDiagnostics, 'listingsWithNestedMedia') : null;
  const mediaTopLevelPhotos = mediaDiagnostics ? getRecordValue(mediaDiagnostics, 'listingsWithTopLevelPhotos') : null;

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
    mediaListings !== null ? `${mediaListings} with media` : null,
    mediaExtracted !== null ? `${mediaExtracted} media extracted` : null,
    mediaIgnored !== null ? `${mediaIgnored} media ignored` : null,
    mediaDirectArrays !== null ? `${mediaDirectArrays} direct media` : null,
    mediaNestedArrays !== null ? `${mediaNestedArrays} nested media` : null,
    mediaTopLevelPhotos !== null ? `${mediaTopLevelPhotos} top-level photos` : null,
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

function formatMediaDiagnosticsDetail(mediaDiagnostics: MlsMediaDiagnosticsStatus | undefined) {
  if (!mediaDiagnostics) return 'Media diagnostics are unavailable.';
  if (mediaDiagnostics.checkedJobs === 0) return 'No recent completed MLS jobs checked for media diagnostics.';

  return `${mediaDiagnostics.jobsWithMediaDiagnostics} of ${mediaDiagnostics.checkedJobs} jobs exposed media diagnostics; ${mediaDiagnostics.extractedMediaCount} extracted, ${mediaDiagnostics.ignoredMediaItemCount} ignored.`;
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

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: ControlMetric['tone'];
}) {
  return (
    <span className={`inline-flex border px-2 py-1 text-[10px] font-black uppercase ${getToneClass(tone)}`}>
      {label}
    </span>
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
  const [controlStateApiMetadata, setControlStateApiMetadata] = useState<ControlStateApiMetadata | null>(null);
  const [intakeSignals, setIntakeSignals] = useState<IntakeSignal[]>([]);
  const [intakeSummary, setIntakeSummary] = useState<IntakeSummary>(emptyIntakeSummary);
  const [intakeReadiness, setIntakeReadiness] = useState<IntakeReadiness>(emptyIntakeReadiness);
  const [intakeApiMetadata, setIntakeApiMetadata] = useState<IntakeApiMetadata | null>(null);
  const [lastIntakeDetailApiMetadata, setLastIntakeDetailApiMetadata] = useState<IntakeApiMetadata | null>(null);
  const [isLoadingIntake, setIsLoadingIntake] = useState(true);
  const [intakeError, setIntakeError] = useState<string | null>(null);
  const [reviewingSignalId, setReviewingSignalId] = useState<string | null>(null);
  const [mlsStatus, setMlsStatus] = useState<MlsStatusResponse | null>(null);
  const [isLoadingMlsStatus, setIsLoadingMlsStatus] = useState(true);
  const [mlsStatusError, setMlsStatusError] = useState<string | null>(null);
  const [mlsRetryStatus, setMlsRetryStatus] = useState<MlsRetryStatusResponse | null>(null);
  const [isLoadingMlsRetryStatus, setIsLoadingMlsRetryStatus] = useState(true);
  const [mlsRetryStatusError, setMlsRetryStatusError] = useState<string | null>(null);
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
  const [crmTaskTypeFilter, setCRMTaskTypeFilter] = useState<CRMTaskTypeFilter>('all');
  const [crmTaskError, setCRMTaskError] = useState<string | null>(null);
  const [reviewingCRMTaskId, setReviewingCRMTaskId] = useState<string | null>(null);
  const [crmTaskReviewNotes, setCRMTaskReviewNotes] = useState<Record<string, string>>({});
  const [adminKey, setAdminKey] = useState(() => {
    if (typeof window === 'undefined') return '';

    try {
      return window.sessionStorage.getItem(ADMIN_KEY_SESSION_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const controlStateRef = useRef<ControlState>(defaultControlState);
  const adminRequestHeaders = useMemo<Record<string, string>>(() => {
    const trimmedAdminKey = adminKey.trim();
    const headers: Record<string, string> = {};
    if (trimmedAdminKey) headers['x-admin-key'] = trimmedAdminKey;
    return headers;
  }, [adminKey]);
  const adminJsonHeaders = useMemo<Record<string, string>>(
    () => ({
      ...adminRequestHeaders,
      'Content-Type': 'application/json',
    }),
    [adminRequestHeaders],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const trimmedAdminKey = adminKey.trim();
      if (trimmedAdminKey) {
        window.sessionStorage.setItem(ADMIN_KEY_SESSION_STORAGE_KEY, trimmedAdminKey);
      } else {
        window.sessionStorage.removeItem(ADMIN_KEY_SESSION_STORAGE_KEY);
      }
    } catch {
      // Session storage can be unavailable in private or restricted browser contexts.
    }
  }, [adminKey]);

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
        headers: adminRequestHeaders,
      });
      const payload = (await response.json()) as ControlStateResponse;

      if (!response.ok || !payload.success) {
        if (!payload.success && hasControlStateApiMetadata(payload)) {
          setControlStateApiMetadata(payload);
        }
        throw new Error(payload.success ? 'Control state could not be loaded.' : payload.error);
      }

      applyControlState(payload.state);
      setControlPolicy(payload.policy);
      setStateSource(payload.source);
      setControlStateApiMetadata({
        generatedAt: payload.generatedAt,
        terminal: payload.terminal,
        route: payload.route,
        command: payload.command,
      });
    } catch (error) {
      setControlStateError(error instanceof Error ? error.message : 'Control state could not be loaded.');
      setControlPolicy(defaultControlPolicy);
      setStateSource('local');
    } finally {
      setIsLoadingState(false);
    }
  }, [adminRequestHeaders, applyControlState]);

  const loadIntakeSignals = useCallback(async () => {
    setIsLoadingIntake(true);
    setIntakeError(null);

    try {
      const response = await fetch('/api/admin/intake-signals?limit=6', {
        cache: 'no-store',
        headers: adminRequestHeaders,
      });
      const payload = (await response.json()) as IntakeSignalsResponse;

      if (!response.ok || !payload.success) {
        if (!payload.success && payload.generatedAt && payload.terminal && payload.route && payload.command) {
          setIntakeSignals(payload.signals || []);
          setIntakeSummary(payload.summary || emptyIntakeSummary);
          setIntakeReadiness(payload.readiness || emptyIntakeReadiness);
          setIntakeApiMetadata({
            generatedAt: payload.generatedAt,
            terminal: payload.terminal,
            route: payload.route,
            command: payload.command,
          });
        }
        throw new Error(payload.success ? 'Intake signals could not be loaded.' : payload.error);
      }

      setIntakeSignals(payload.signals);
      setIntakeSummary(payload.summary);
      setIntakeReadiness(payload.readiness);
      setIntakeApiMetadata({
        generatedAt: payload.generatedAt,
        terminal: payload.terminal,
        route: payload.route,
        command: payload.command,
      });
    } catch (error) {
      setIntakeError(error instanceof Error ? error.message : 'Intake signals could not be loaded.');
    } finally {
      setIsLoadingIntake(false);
    }
  }, [adminRequestHeaders]);

  const loadMlsStatus = useCallback(async () => {
    setIsLoadingMlsStatus(true);
    setMlsStatusError(null);

    try {
      const response = await fetch('/api/mls/status', {
        cache: 'no-store',
        headers: adminRequestHeaders,
      });
      const payload = (await response.json()) as MlsStatusResponse;

      if (!response.ok || !payload.success) {
        setMlsStatus(payload);
        setMlsStatusError(payload.success ? 'MLS status could not be loaded.' : payload.error);
        return;
      }

      setMlsStatus(payload);
    } catch (error) {
      setMlsStatusError(error instanceof Error ? error.message : 'MLS status could not be loaded.');
      setMlsStatus(null);
    } finally {
      setIsLoadingMlsStatus(false);
    }
  }, [adminRequestHeaders]);

  const loadMlsRetryStatus = useCallback(async () => {
    setIsLoadingMlsRetryStatus(true);
    setMlsRetryStatusError(null);

    try {
      const response = await fetch('/api/mls/retry?queue=mls-sync&limit=6', {
        cache: 'no-store',
        headers: adminRequestHeaders,
      });
      const payload = (await response.json()) as MlsRetryStatusResponse;

      if (!response.ok || !payload.success) {
        setMlsRetryStatus(payload);
        setMlsRetryStatusError(payload.success ? 'MLS retry status could not be loaded.' : payload.error);
        return;
      }

      setMlsRetryStatus(payload);
    } catch (error) {
      setMlsRetryStatusError(error instanceof Error ? error.message : 'MLS retry status could not be loaded.');
      setMlsRetryStatus(null);
    } finally {
      setIsLoadingMlsRetryStatus(false);
    }
  }, [adminRequestHeaders]);

  const loadAlertStatus = useCallback(async () => {
    setIsLoadingAlertStatus(true);
    setAlertStatusError(null);

    try {
      const response = await fetch('/api/process-alerts', {
        cache: 'no-store',
        headers: adminRequestHeaders,
      });
      const payload = (await response.json()) as AlertStatusResponse;

      if (!response.ok || !payload.success) {
        setAlertStatus(payload);
        setAlertStatusError(payload.success ? 'Alert status could not be loaded.' : payload.error);
        return;
      }

      setAlertStatus(payload);
    } catch (error) {
      setAlertStatusError(error instanceof Error ? error.message : 'Alert status could not be loaded.');
      setAlertStatus(null);
    } finally {
      setIsLoadingAlertStatus(false);
    }
  }, [adminRequestHeaders]);

  const loadCRMTasks = useCallback(async () => {
    setIsLoadingCRMTasks(true);
    setCRMTaskError(null);

    try {
      const params = new URLSearchParams({
        limit: '6',
        status: 'active',
      });
      const selectedType = crmTaskTypeOptions.find((option) => option.value === crmTaskTypeFilter)?.apiType;
      if (selectedType) params.set('type', selectedType);

      const response = await fetch(`/api/admin/crm-tasks?${params.toString()}`, {
        cache: 'no-store',
        headers: adminRequestHeaders,
      });
      const payload = (await response.json()) as CRMTasksResponse;

      if (!response.ok || !payload.success) {
        if (!payload.success && hasCRMTaskApiMetadata(payload)) {
          setCRMTasks(payload.tasks || []);
          setCRMTaskSummary(payload.summary || emptyCRMTaskSummary);
          setCRMTaskAuditSummary(payload.audit || emptyCRMTaskAuditSummary);
          setCRMTaskReadiness(payload.readiness || emptyCRMTaskReadiness);
          setCRMTaskVerdict(payload.verdict || '');
          setCRMTaskOperations(payload.operations || null);
          setCRMTaskApiMetadata({
            generatedAt: payload.generatedAt,
            terminal: payload.terminal,
            inspectionSource: payload.inspectionSource,
            route: payload.route,
            command: payload.command,
          });
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
    } finally {
      setIsLoadingCRMTasks(false);
    }
  }, [adminRequestHeaders, crmTaskTypeFilter]);

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
          headers: adminJsonHeaders,
          body: JSON.stringify(nextState),
        });
        const payload = (await response.json()) as ControlStateResponse;

        if (!response.ok || !payload.success) {
          if (!payload.success && hasControlStateApiMetadata(payload)) {
            setControlStateApiMetadata(payload);
          }
          throw new Error(payload.success ? 'Control state could not be saved.' : payload.error);
        }

        applyControlState(payload.state);
        setControlPolicy(payload.policy);
        setStateSource(payload.source);
        setControlStateApiMetadata({
          generatedAt: payload.generatedAt,
          terminal: payload.terminal,
          route: payload.route,
          command: payload.command,
        });
      } catch (error) {
        applyControlState(previousState);
        setControlStateError(error instanceof Error ? error.message : 'Control state could not be saved.');
      } finally {
        setIsSavingState(false);
      }
    },
    [adminJsonHeaders, applyControlState],
  );

  const reviewIntakeSignal = useCallback(
    async (signal: IntakeSignal) => {
      setReviewingSignalId(signal.id);
      setIntakeError(null);

      try {
        const isInteraction = signal.kind === 'interaction';
        const response = await fetch(`/api/admin/intake-signals/${encodeURIComponent(signal.id)}`, {
          method: 'PATCH',
          headers: adminJsonHeaders,
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
        if (!payload.success && hasIntakeApiMetadata(payload)) {
          const errorMetadata: IntakeApiMetadata = {
            generatedAt: payload.generatedAt,
            terminal: payload.terminal,
            inspectionSource: payload.inspectionSource,
            route: payload.route,
            command: payload.command,
          };

          setIntakeApiMetadata(errorMetadata);
          if (payload.inspectionSource === 'Detail Route') {
            setLastIntakeDetailApiMetadata(errorMetadata);
          }
        }
        throw new Error(payload.success ? 'Intake signal could not be reviewed.' : payload.error);
      }

        setIntakeSignals((currentSignals) =>
          currentSignals.map((currentSignal) =>
            currentSignal.id === signal.id || currentSignal.id === payload.signal.id ? payload.signal : currentSignal,
          ),
        );
        const detailApiMetadata: IntakeApiMetadata = {
          generatedAt: payload.generatedAt,
          terminal: payload.terminal,
          inspectionSource: payload.inspectionSource,
          route: payload.route,
          command: payload.command,
        };

        setIntakeApiMetadata(detailApiMetadata);
        setLastIntakeDetailApiMetadata(detailApiMetadata);
        await loadIntakeSignals();
        await loadCRMTasks();
      } catch (error) {
        setIntakeError(error instanceof Error ? error.message : 'Intake signal could not be updated.');
      } finally {
        setReviewingSignalId(null);
      }
    },
    [adminJsonHeaders, loadCRMTasks, loadIntakeSignals],
  );

  const updateCRMTaskStatus = useCallback(
    async (task: CRMTask, status: CRMTaskReviewStatus, reviewNote: string) => {
      setReviewingCRMTaskId(task.id);
      setCRMTaskError(null);

      try {
        const response = await fetch(`/api/admin/crm-tasks/${encodeURIComponent(task.id)}`, {
          method: 'PATCH',
          headers: adminJsonHeaders,
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
            const errorMetadata: CRMTaskApiMetadata = {
              generatedAt: payload.generatedAt,
              terminal: payload.terminal,
              inspectionSource: payload.inspectionSource,
              route: payload.route,
              command: payload.command,
            };

            const errorTask = payload.task;
            if (errorTask) {
              setCRMTasks((currentTasks) => currentTasks.map((currentTask) => (currentTask.id === errorTask.id ? errorTask : currentTask)));
            }
            if (payload.operations) {
              setCRMTaskOperations(payload.operations);
            }
            setCRMTaskApiMetadata(errorMetadata);
            if (payload.inspectionSource === 'Detail Route') {
              setLastCRMTaskDetailApiMetadata(errorMetadata);
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
    [adminJsonHeaders, loadCRMTasks],
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
      void loadMlsRetryStatus();
      void loadAlertStatus();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadAlertStatus, loadCRMTasks, loadControlState, loadIntakeSignals, loadMlsRetryStatus, loadMlsStatus]);

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
        detail: `${intakeReadiness.level}: ${intakeSummary.highPriority} high priority, ${intakeSummary.alertReady} alert-ready, ${intakeSummary.alertIncomplete} incomplete, ${intakeSummary.hiddenPromotedInteractions} already promoted.`,
        tone:
          intakeReadiness.level === 'blocked'
            ? 'red'
            : intakeReadiness.level === 'ready'
              ? 'emerald'
              : intakeSummary.highPriority > 0
                ? 'red'
                : 'amber',
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
        detail: alertStatus?.stats
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
      intakeReadiness.level,
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
  const crmTone: ControlMetric['tone'] =
    crmTaskReadiness.level === 'blocked' ? 'red' : crmTaskReadiness.level === 'ready' ? 'emerald' : 'amber';
  const mlsTone: ControlMetric['tone'] = mlsStatus?.success
    ? mlsStatus.status === 'healthy'
      ? 'emerald'
      : mlsStatus.status === 'busy'
        ? 'amber'
        : 'red'
    : 'red';
  const alertTone: ControlMetric['tone'] = alertStatus?.success
    ? alertStatus.executionPlan?.level === 'blocked'
      ? 'red'
      : alertStatus.executionPlan?.level === 'caution'
        ? 'amber'
        : 'emerald'
    : 'red';

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
              <label className="min-w-0 sm:w-72">
                <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                  <Shield size={13} />
                  Admin Key
                </span>
                <input
                  type="password"
                  data-testid="reie-master-control-admin-key"
                  value={adminKey}
                  onChange={(event) => setAdminKey(event.target.value)}
                  placeholder="Required when configured"
                  className="h-11 w-full border border-slate-800 bg-black px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-700 focus:border-cyan-300"
                />
              </label>
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
            <span data-testid="reie-admin-key-mode">
              {adminKey.trim() ? 'Admin key header enabled for protected API reads.' : 'Admin key header empty; local bypass only works when no admin key is configured.'}
            </span>
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
                void loadMlsRetryStatus();
                void loadAlertStatus();
              }}
              disabled={
                isLoadingState ||
                isSavingState ||
                isLoadingIntake ||
                isLoadingCRMTasks ||
                isLoadingMlsStatus ||
                isLoadingMlsRetryStatus ||
                isLoadingAlertStatus
              }
              className="inline-flex self-start items-center gap-2 border border-slate-800 bg-black px-3 py-2 font-black uppercase text-slate-300 transition hover:border-cyan-300 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
            >
              <RefreshCcw size={13} />
              Refresh State
            </button>
          </div>

          {controlStateApiMetadata ? (
            <div
              className="mt-4 border border-slate-800 bg-black/70 p-4 text-xs leading-5 text-slate-400"
              data-testid="reie-control-api-metadata"
              data-api-generated-at={controlStateApiMetadata.generatedAt}
              data-api-route={controlStateApiMetadata.route}
              data-api-terminal={controlStateApiMetadata.terminal}
              data-api-command={controlStateApiMetadata.command}
            >
              <div className="mb-3 text-[10px] font-black uppercase text-slate-500">Control API Inspection</div>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="min-w-0 border border-slate-900 bg-slate-950/70 px-3 py-2">
                  <span className="block font-black uppercase text-slate-500">Generated</span>
                  <span className="mt-1 block break-words text-slate-200">{controlStateApiMetadata.generatedAt}</span>
                </div>
                <div className="min-w-0 border border-slate-900 bg-slate-950/70 px-3 py-2">
                  <span className="block font-black uppercase text-slate-500">Route</span>
                  <span className="mt-1 block break-words text-slate-200">{controlStateApiMetadata.route}</span>
                </div>
                <div className="min-w-0 border border-slate-900 bg-slate-950/70 px-3 py-2">
                  <span className="block font-black uppercase text-slate-500">Terminal</span>
                  <span className="mt-1 block break-words text-slate-200">{controlStateApiMetadata.terminal}</span>
                </div>
              </div>
              <div className="mt-3 min-w-0">
                <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 API Check</div>
                <code className="block max-w-full overflow-x-auto whitespace-nowrap border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                  {controlStateApiMetadata.command}
                </code>
              </div>
            </div>
          ) : null}
        </header>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <section className="border border-slate-800 bg-slate-950/80 p-5 md:col-span-2 xl:col-span-4" data-testid="reie-operational-snapshot">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Operational Snapshot</div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  Current control posture, active CRM work, MLS health, and alert readiness in one scan.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={controlPolicy.automation} tone={controlPolicy.automation === 'paused' ? 'red' : controlPolicy.automation === 'monitor' ? 'amber' : 'emerald'} />
                <StatusPill label={`CRM ${crmTaskReadiness.level}`} tone={crmTone} />
                <StatusPill label={`MLS ${mlsStatus?.success ? mlsStatus.status : 'offline'}`} tone={mlsTone} />
                <StatusPill label={`Alerts ${alertStatus?.success ? alertStatus.executionPlan?.level || 'status' : 'offline'}`} tone={alertTone} />
              </div>
            </div>

            <div className="grid gap-px overflow-hidden border border-slate-800 bg-slate-800 md:grid-cols-2 xl:grid-cols-4">
              <div className="bg-black/80 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Control Posture</div>
                <div className="mt-2 text-xl font-black uppercase text-white">
                  {controlState.killSwitchActive ? 'Paused' : 'Live'}
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {controlPolicy.publicExposure} exposure / {controlPolicy.mapPrecision} map precision.
                </p>
              </div>
              <div className="bg-black/80 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">CRM Workload</div>
                <div className="mt-2 text-xl font-black uppercase text-white">
                  {isLoadingCRMTasks ? 'Loading' : `${crmTaskSummary.pending + crmTaskSummary.reviewing} Active`}
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {crmTaskSummary.propertyInquiries} property, {crmTaskSummary.strategyIntakes} strategy, {crmTaskAuditSummary.closureReviewCoveragePercent}% audit coverage.
                </p>
              </div>
              <div className="bg-black/80 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">MLS Pipeline</div>
                <div className="mt-2 text-xl font-black uppercase text-white">
                  {isLoadingMlsStatus ? 'Loading' : mlsStatus?.success ? mlsStatus.status : 'Offline'}
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {mlsStatus?.success
                    ? `${mlsStatus.propertyFreshness.stalePercent}% stale / ${mlsStatus.recentFailedJobs.length} failed jobs.`
                    : 'MLS status has not loaded.'}
                </p>
              </div>
              <div className="bg-black/80 p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Alert Posture</div>
                <div className="mt-2 text-xl font-black uppercase text-white">
                  {isLoadingAlertStatus ? 'Loading' : alertStatus?.success ? alertStatus.executionPlan?.level || 'Status' : 'Offline'}
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {alertStatus?.stats
                    ? `${alertStatus.stats.pending} pending / ${alertStatus.stats.failed} failed / live ${alertStatus.executionPlan?.liveAllowed ? 'available' : 'blocked'}.`
                    : 'Alert status has not loaded.'}
                </p>
              </div>
            </div>
          </section>

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

            {!isLoadingIntake && !intakeError ? (
              <div className="border-b border-slate-800 bg-black/40 px-5 py-4" data-testid="reie-intake-readiness">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs font-black uppercase text-slate-500">Intake Readiness</div>
                  <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getIntakeReadinessClass(intakeReadiness.level)}`}>
                    {intakeReadiness.level}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-300">{intakeReadiness.summary}</p>
                {intakeReadiness.gates.length ? (
                  <div className="mt-3 grid gap-2 md:grid-cols-3">
                    {intakeReadiness.gates.map((gate) => (
                      <div key={gate.name} className={`border px-3 py-2 ${getGateClass(gate.status)}`}>
                        <div className="text-[10px] font-black uppercase">{gate.name}</div>
                        <div className="mt-1 text-xs leading-5 text-slate-400">{gate.detail}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1fr]">
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">
                      Next: {intakeReadiness.terminal} / {intakeReadiness.nextAction}
                    </div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {intakeReadiness.nextCommand}
                    </code>
                  </div>
                  {intakeApiMetadata ? (
                    <div
                      className="border border-slate-800 bg-black/70 p-3 text-xs leading-5 text-slate-500"
                      data-testid="reie-intake-api-metadata"
                      data-api-generated-at={intakeApiMetadata.generatedAt}
                      data-api-route={intakeApiMetadata.route}
                      data-api-terminal={intakeApiMetadata.terminal}
                      data-api-source={intakeApiMetadata.inspectionSource || 'List Route'}
                      data-api-command={intakeApiMetadata.command}
                    >
                      <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Intake API Inspection</div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="min-w-0">
                          <span className="block font-black uppercase text-slate-500">Generated</span>
                          <span className="mt-1 block break-words text-slate-200">{intakeApiMetadata.generatedAt}</span>
                        </div>
                        <div className="min-w-0">
                          <span className="block font-black uppercase text-slate-500">Terminal</span>
                          <span className="mt-1 block break-words text-slate-200">{intakeApiMetadata.terminal}</span>
                        </div>
                        <div className="min-w-0">
                          <span className="block font-black uppercase text-slate-500">Route</span>
                          <span className="mt-1 block break-words text-slate-200">{intakeApiMetadata.route}</span>
                        </div>
                        <div className="min-w-0">
                          <span className="block font-black uppercase text-slate-500">Source</span>
                          <span
                            className={`mt-1 inline-flex border px-2 py-1 text-[10px] font-black uppercase ${getIntakeInspectionSourceClass(
                              intakeApiMetadata.inspectionSource,
                            )}`}
                          >
                            {intakeApiMetadata.inspectionSource || 'List Route'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 min-w-0">
                        <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 API Check</div>
                        <code className="block max-w-full overflow-x-auto whitespace-nowrap border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                          {intakeApiMetadata.command}
                        </code>
                      </div>
                      {lastIntakeDetailApiMetadata ? (
                        <div
                          className="mt-3 min-w-0 border border-cyan-400/20 bg-cyan-950/10 p-3"
                          data-testid="reie-intake-detail-api-metadata"
                          data-api-generated-at={lastIntakeDetailApiMetadata.generatedAt}
                          data-api-route={lastIntakeDetailApiMetadata.route}
                          data-api-terminal={lastIntakeDetailApiMetadata.terminal}
                          data-api-source={lastIntakeDetailApiMetadata.inspectionSource || 'Detail Route'}
                          data-api-command={lastIntakeDetailApiMetadata.command}
                        >
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase text-slate-500">Last Detail Route</span>
                            <span
                              className={`border px-2 py-1 text-[10px] font-black uppercase ${getIntakeInspectionSourceClass(
                                lastIntakeDetailApiMetadata.inspectionSource,
                              )}`}
                            >
                              {lastIntakeDetailApiMetadata.inspectionSource || 'Detail Route'}
                            </span>
                          </div>
                          <div className="grid gap-2 text-xs leading-5 text-slate-400 sm:grid-cols-2">
                            <div className="min-w-0">
                              <span className="block font-black uppercase text-slate-500">Generated</span>
                              <span className="mt-1 block break-words text-slate-200">
                                {lastIntakeDetailApiMetadata.generatedAt}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <span className="block font-black uppercase text-slate-500">Route</span>
                              <span className="mt-1 block break-words text-slate-200">{lastIntakeDetailApiMetadata.route}</span>
                            </div>
                          </div>
                          <div className="mt-3 min-w-0">
                            <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Detail Command</div>
                            <code className="block max-w-full overflow-x-auto whitespace-nowrap border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                              {lastIntakeDetailApiMetadata.command}
                            </code>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

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
              <div
                className="grid grid-cols-3 overflow-hidden border border-slate-800 bg-black"
                aria-label="CRM task type filter"
              >
                {crmTaskTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={crmTaskTypeFilter === option.value}
                    data-testid={`reie-crm-type-${option.value}`}
                    disabled={isLoadingCRMTasks}
                    onClick={() => setCRMTaskTypeFilter(option.value)}
                    className={`px-3 py-2 text-[10px] font-black uppercase transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      crmTaskTypeFilter === option.value
                        ? 'bg-cyan-300 text-slate-950'
                        : 'border-l border-slate-800 text-slate-500 first:border-l-0 hover:text-cyan-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
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
                  <div
                    className="mt-4 border border-slate-800 bg-black/70 p-4"
                    data-testid="reie-crm-api-metadata"
                    data-api-generated-at={crmTaskApiMetadata.generatedAt}
                    data-api-route={crmTaskApiMetadata.route}
                    data-api-terminal={crmTaskApiMetadata.terminal}
                    data-api-source={crmTaskApiMetadata.inspectionSource}
                    data-api-command={crmTaskApiMetadata.command}
                  >
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
                        <div
                          className="min-w-0 border border-cyan-400/20 bg-cyan-950/10 p-3"
                          data-testid="reie-crm-last-detail-route"
                          data-api-generated-at={lastCRMTaskDetailApiMetadata.generatedAt}
                          data-api-route={lastCRMTaskDetailApiMetadata.route}
                          data-api-terminal={lastCRMTaskDetailApiMetadata.terminal}
                          data-api-source={lastCRMTaskDetailApiMetadata.inspectionSource}
                          data-api-command={lastCRMTaskDetailApiMetadata.command}
                        >
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
                          <div className="mt-3 min-w-0">
                            <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Detail Command</div>
                            <code className="block max-w-full overflow-x-auto whitespace-nowrap border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                              {lastCRMTaskDetailApiMetadata.command}
                            </code>
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
                    No active {crmTaskTypeFilter === 'all' ? 'CRM' : crmTaskTypeFilter} tasks are currently available.
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
                      const triageFocus = getCRMTaskFocus(task);
                      const closureHint = getCRMTaskClosureHint(task);

                      return (
                      <article key={task.id} className="grid gap-4 border border-slate-800 bg-black/70 p-4 xl:grid-cols-[minmax(0,1fr)_180px]">
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
                          <div className="mt-3 grid gap-3 border border-slate-800 bg-slate-950/80 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/60">Triage Focus</div>
                              <p className="mt-2 text-xs leading-5 text-slate-300">{triageFocus}</p>
                            </div>
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Closure Note Should Capture</div>
                              <p className="mt-2 text-xs leading-5 text-slate-400">{closureHint}</p>
                            </div>
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
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <label htmlFor={`reie-crm-note-${task.id}`} className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                              Review Note
                            </label>
                            <span
                              className={`text-[10px] font-black uppercase tracking-[0.18em] ${
                                hasClosureNote ? 'text-emerald-100/70' : 'text-amber-100/70'
                              }`}
                            >
                              {reviewNote.length}/500
                            </span>
                          </div>
                          <textarea
                            id={`reie-crm-note-${task.id}`}
                            data-testid={`reie-crm-task-note-${task.id}`}
                            value={reviewNote}
                            maxLength={500}
                            rows={3}
                            disabled={isUpdatingTask}
                            onChange={(event) => updateCRMTaskReviewNote(task.id, event.target.value)}
                            className="mt-2 min-h-20 w-full resize-y border border-slate-800 bg-slate-950 px-3 py-2 text-xs leading-5 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder={closureHint}
                          />
                        </div>

                        <div className="grid content-start gap-3">
                          <div className="border border-slate-800 bg-slate-950/80 p-3">
                            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Task State</div>
                            <div className="mt-2 text-sm font-black uppercase text-white">{task.status}</div>
                            <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                              {hasClosureNote ? 'Ready to close' : 'Needs note'}
                            </div>
                          </div>
                          <button
                            type="button"
                            data-testid={`reie-review-crm-task-${task.id}`}
                            disabled={isUpdatingTask || task.status === 'reviewing'}
                            onClick={() => void reviewCRMTask(task)}
                            className="inline-flex h-10 items-center justify-center gap-2 border border-slate-700 bg-black px-3 text-xs font-black uppercase text-slate-200 transition hover:border-cyan-300 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isUpdatingTask ? <Loader2 size={14} className="animate-spin" /> : <Activity size={14} />}
                            {isUpdatingTask ? 'Saving' : task.status === 'reviewing' ? 'In Review' : 'Start Review'}
                          </button>
                          <div className="grid gap-2 border border-slate-800 bg-black/40 p-2">
                            <div className="px-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">Close Task</div>
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

        <section
          className="border border-slate-800 bg-slate-950/80"
          data-testid="reie-alert-operations"
          data-api-route={alertStatus?.route || '/api/process-alerts'}
          data-api-terminal={alertStatus?.terminal || 'Terminal 5'}
          data-api-command={alertStatus?.command || 'curl --max-time 20 -s "http://localhost:3000/api/process-alerts" -H "x-admin-key: $REIE_ADMIN_API_KEY"'}
          data-alert-mode={alertStatus?.mode || 'status'}
          data-alert-readiness={alertStatus?.executionPlan?.level || 'unknown'}
        >
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
          ) : alertStatusError && !alertStatus ? (
            <div className="px-5 py-6">
              <div className="border border-red-400/30 bg-red-500/10 p-4 text-sm leading-6 text-red-100">{alertStatusError}</div>
            </div>
          ) : alertStatus ? (
            <div className="grid gap-px bg-slate-800 xl:grid-cols-[360px_minmax(0,1fr)]">
              <div className="bg-slate-950 p-5">
                <div className="mb-4 text-xs font-black uppercase text-slate-500">Alert Queue</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Pending</div>
                    <div className="mt-2 text-3xl font-black uppercase text-white">{alertStatus.stats?.pending ?? 0}</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Processing</div>
                    <div className="mt-2 text-3xl font-black uppercase text-white">{alertStatus.stats?.processing ?? 0}</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Failed</div>
                    <div className="mt-2 text-lg font-black uppercase text-white">{alertStatus.stats?.failed ?? 0}</div>
                  </div>
                  <div className="border border-slate-800 bg-black/70 p-4">
                    <div className="text-[10px] font-black uppercase text-slate-500">Terminal</div>
                    <div className="mt-2 text-lg font-black uppercase text-white">{alertStatus.stats?.terminal ?? 0}</div>
                  </div>
                </div>
                {alertStatusError ? (
                  <div className="mt-4 border border-red-400/30 bg-red-500/10 p-3 text-xs leading-5 text-red-100">{alertStatusError}</div>
                ) : null}
              </div>

              <div className="bg-slate-950 p-5">
                {alertStatus.executionPlan ? (
                  <div
                    className="border border-slate-800 bg-black/70 p-4"
                    data-testid="reie-alert-execution-plan"
                    data-api-route={alertStatus.route || '/api/process-alerts'}
                    data-api-terminal={alertStatus.executionPlan.terminal}
                    data-alert-plan-level={alertStatus.executionPlan.level}
                    data-alert-live-allowed={String(alertStatus.executionPlan.liveAllowed)}
                    data-alert-next-command={alertStatus.executionPlan.nextCommand}
                  >
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

                {alertStatus.notificationReadiness ? (() => {
                  const notificationBlockerMetadata = getNotificationBlockerInspectionMetadata(alertStatus.notificationReadiness);
                  return (
                  <div
                    className="mt-4 border border-slate-800 bg-black/70 p-4"
                    data-testid="reie-notification-blockers"
                    data-api-route={alertStatus.notificationReadiness.route || alertStatus.route || '/api/process-alerts'}
                    data-api-terminal={alertStatus.notificationReadiness.terminal || alertStatus.terminal || 'Terminal 5'}
                    data-notification-readiness={alertStatus.notificationReadiness.level}
                    data-notification-next-command={alertStatus.notificationReadiness.nextCommand || alertStatus.notificationReadiness.commands.notificationReadiness}
                    data-blocker-count={alertStatus.notificationReadiness.blockedBy.length}
                    data-blocker-count-aligned={String(notificationBlockerMetadata.blockerCountAligned)}
                    data-blocker-env-var-count-aligned={String(notificationBlockerMetadata.blockerEnvVarCountAligned)}
                    data-blocker-counts-aligned={String(notificationBlockerMetadata.blockerCountsAligned)}
                    data-blocker-counts-ready={String(notificationBlockerMetadata.blockerCountsReady)}
                    data-has-first-blocker={String(alertStatus.notificationReadiness.blockedBy.length > 0)}
                    data-first-blocker-complete={String(notificationBlockerMetadata.firstBlockerComplete)}
                    data-first-blocker-contract-ready={String(notificationBlockerMetadata.firstBlockerContractReady)}
                    data-blocker-payload-ready={String(notificationBlockerMetadata.blockerPayloadReady)}
                    data-blocker-payload-contract-ready={String(notificationBlockerMetadata.blockerPayloadContractReady)}
                    data-blocker-codes={notificationBlockerMetadata.blockerCodes.join(',')}
                    data-blocker-env-vars={notificationBlockerMetadata.blockerEnvVars.join(',')}
                    data-blocker-summary-aligned={String(notificationBlockerMetadata.summaryAligned)}
                    data-blocker-api-summary-aligned={String(notificationBlockerMetadata.apiSummaryAligned)}
                    data-blocker-alignment-status={notificationBlockerMetadata.alignmentStatus}
                    data-blocker-alignment-status-aligned={String(notificationBlockerMetadata.alignmentStatusAligned)}
                    data-blocker-alignment-options={NOTIFICATION_BLOCKER_ALIGNMENT_STATUSES.join(',')}
                    data-blocker-alignment-option-count={notificationBlockerMetadata.alignmentStatusOptionCount}
                    data-blocker-alignment-expected-count={notificationBlockerMetadata.alignmentStatusExpectedCount}
                    data-blocker-alignment-option-count-aligned={String(notificationBlockerMetadata.alignmentStatusOptionCountAligned)}
                    data-blocker-alignment-status-known={String(notificationBlockerMetadata.alignmentStatusKnown)}
                    data-blocker-alignment-status-contract-ready={String(notificationBlockerMetadata.alignmentStatusContractReady)}
                    data-blocker-inspection-ready={String(notificationBlockerMetadata.blockerInspectionReady)}
                    data-blocker-inspection-payload-ready={String(notificationBlockerMetadata.blockerInspectionPayloadReady)}
                    data-blocker-inspection-contract-ready={String(notificationBlockerMetadata.blockerInspectionContractReady)}
                    data-blocker-inspection-contract-payload-ready={String(notificationBlockerMetadata.blockerInspectionContractPayloadReady)}
                    data-blocker-inspection-contract-status={notificationBlockerMetadata.blockerInspectionContractStatus}
                    data-blocker-inspection-contract-status-aligned={String(notificationBlockerMetadata.blockerInspectionContractStatusAligned)}
                    data-blocker-inspection-contract-status-options={NOTIFICATION_BLOCKER_INSPECTION_CONTRACT_STATUSES.join(',')}
                    data-blocker-inspection-contract-status-option-count={notificationBlockerMetadata.blockerInspectionContractStatusOptionCount}
                    data-blocker-inspection-contract-status-expected-count={notificationBlockerMetadata.blockerInspectionContractStatusExpectedCount}
                    data-blocker-inspection-contract-status-option-count-aligned={String(notificationBlockerMetadata.blockerInspectionContractStatusOptionCountAligned)}
                    data-blocker-inspection-contract-status-known={String(notificationBlockerMetadata.blockerInspectionContractStatusKnown)}
                    data-blocker-inspection-contract-status-contract-ready={String(notificationBlockerMetadata.blockerInspectionContractStatusContractReady)}
                    data-blocker-inspection-contract-contract-ready={String(notificationBlockerMetadata.blockerInspectionContractContractReady)}
                    data-blocker-launch-contract-ready={String(notificationBlockerMetadata.blockerLaunchContractReady)}
                    data-blocker-launch-contract-payload-ready={String(notificationBlockerMetadata.blockerLaunchContractPayloadReady)}
                    data-blocker-launch-contract-status={notificationBlockerMetadata.blockerLaunchContractStatus}
                    data-blocker-launch-contract-status-aligned={String(notificationBlockerMetadata.blockerLaunchContractStatusAligned)}
                    data-blocker-launch-contract-status-options={NOTIFICATION_BLOCKER_LAUNCH_STATUSES.join(',')}
                    data-blocker-launch-contract-status-option-count={notificationBlockerMetadata.blockerLaunchContractStatusOptionCount}
                    data-blocker-launch-contract-status-expected-count={notificationBlockerMetadata.blockerLaunchContractStatusExpectedCount}
                    data-blocker-launch-contract-status-option-count-aligned={String(notificationBlockerMetadata.blockerLaunchContractStatusOptionCountAligned)}
                    data-blocker-launch-contract-status-known={String(notificationBlockerMetadata.blockerLaunchContractStatusKnown)}
                    data-blocker-launch-contract-status-contract-ready={String(notificationBlockerMetadata.blockerLaunchContractStatusContractReady)}
                    data-blocker-launch-contract-status-payload-ready={String(notificationBlockerMetadata.blockerLaunchContractStatusPayloadReady)}
                    data-blocker-launch-contract-composite-ready={String(notificationBlockerMetadata.blockerLaunchContractCompositeReady)}
                    data-blocker-launch-contract-composite-payload-ready={String(notificationBlockerMetadata.blockerLaunchContractCompositePayloadReady)}
                    data-blocker-launch-contract-composite-status={notificationBlockerMetadata.blockerLaunchContractCompositeStatus}
                    data-blocker-launch-contract-composite-status-aligned={String(notificationBlockerMetadata.blockerLaunchContractCompositeStatusAligned)}
                    data-blocker-launch-contract-composite-status-options={NOTIFICATION_BLOCKER_LAUNCH_COMPOSITE_STATUSES.join(',')}
                    data-blocker-launch-contract-composite-status-option-count={notificationBlockerMetadata.blockerLaunchContractCompositeStatusOptionCount}
                    data-blocker-launch-contract-composite-status-expected-count={notificationBlockerMetadata.blockerLaunchContractCompositeStatusExpectedCount}
                    data-blocker-launch-contract-composite-status-option-count-aligned={String(notificationBlockerMetadata.blockerLaunchContractCompositeStatusOptionCountAligned)}
                    data-blocker-launch-contract-composite-status-known={String(notificationBlockerMetadata.blockerLaunchContractCompositeStatusKnown)}
                    data-blocker-launch-contract-composite-status-contract-ready={String(notificationBlockerMetadata.blockerLaunchContractCompositeStatusContractReady)}
                    data-blocker-launch-contract-composite-status-payload-ready={String(notificationBlockerMetadata.blockerLaunchContractCompositeStatusPayloadReady)}
                    data-blocker-launch-contract-composite-contract-ready={String(notificationBlockerMetadata.blockerLaunchContractCompositeContractReady)}
                    data-blocker-launch-contract-composite-contract-payload-ready={String(notificationBlockerMetadata.blockerLaunchContractCompositeContractPayloadReady)}
                    data-blocker-launch-readiness-status={notificationBlockerMetadata.blockerLaunchReadinessStatus}
                    data-blocker-launch-readiness-status-options={NOTIFICATION_BLOCKER_LAUNCH_READINESS_STATUSES.join(',')}
                    data-blocker-launch-readiness-status-option-count={notificationBlockerMetadata.blockerLaunchReadinessStatusOptionCount}
                    data-blocker-launch-readiness-status-expected-count={notificationBlockerMetadata.blockerLaunchReadinessStatusExpectedCount}
                    data-blocker-launch-readiness-status-option-count-aligned={String(notificationBlockerMetadata.blockerLaunchReadinessStatusOptionCountAligned)}
                    data-blocker-launch-readiness-status-known={String(notificationBlockerMetadata.blockerLaunchReadinessStatusKnown)}
                    data-blocker-launch-readiness-status-aligned={String(notificationBlockerMetadata.blockerLaunchReadinessStatusAligned)}
                    data-blocker-launch-readiness-status-contract-ready={String(notificationBlockerMetadata.blockerLaunchReadinessStatusContractReady)}
                    data-blocker-launch-readiness-status-payload-ready={String(notificationBlockerMetadata.blockerLaunchReadinessStatusPayloadReady)}
                    data-blocker-launch-readiness-contract-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractReady)}
                    data-blocker-launch-readiness-contract-payload-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractPayloadReady)}
                    data-blocker-launch-readiness-contract-status={notificationBlockerMetadata.blockerLaunchReadinessContractStatus}
                    data-blocker-launch-readiness-contract-status-options={NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_STATUSES.join(',')}
                    data-blocker-launch-readiness-contract-status-option-count={notificationBlockerMetadata.blockerLaunchReadinessContractStatusOptionCount}
                    data-blocker-launch-readiness-contract-status-expected-count={notificationBlockerMetadata.blockerLaunchReadinessContractStatusExpectedCount}
                    data-blocker-launch-readiness-contract-status-option-count-aligned={String(notificationBlockerMetadata.blockerLaunchReadinessContractStatusOptionCountAligned)}
                    data-blocker-launch-readiness-contract-status-known={String(notificationBlockerMetadata.blockerLaunchReadinessContractStatusKnown)}
                    data-blocker-launch-readiness-contract-status-aligned={String(notificationBlockerMetadata.blockerLaunchReadinessContractStatusAligned)}
                    data-blocker-launch-readiness-contract-status-contract-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractStatusContractReady)}
                    data-blocker-launch-readiness-contract-status-payload-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractStatusPayloadReady)}
                    data-blocker-launch-readiness-contract-contract-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractContractReady)}
                    data-blocker-launch-readiness-contract-contract-payload-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractContractPayloadReady)}
                    data-blocker-launch-readiness-contract-composite-status={notificationBlockerMetadata.blockerLaunchReadinessContractCompositeStatus}
                    data-blocker-launch-readiness-contract-composite-status-options={NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_COMPOSITE_STATUSES.join(',')}
                    data-blocker-launch-readiness-contract-composite-status-option-count={notificationBlockerMetadata.blockerLaunchReadinessContractCompositeStatusOptionCount}
                    data-blocker-launch-readiness-contract-composite-status-expected-count={notificationBlockerMetadata.blockerLaunchReadinessContractCompositeStatusExpectedCount}
                    data-blocker-launch-readiness-contract-composite-status-option-count-aligned={String(notificationBlockerMetadata.blockerLaunchReadinessContractCompositeStatusOptionCountAligned)}
                    data-blocker-launch-readiness-contract-composite-status-known={String(notificationBlockerMetadata.blockerLaunchReadinessContractCompositeStatusKnown)}
                    data-blocker-launch-readiness-contract-composite-status-aligned={String(notificationBlockerMetadata.blockerLaunchReadinessContractCompositeStatusAligned)}
                    data-blocker-launch-readiness-contract-composite-status-contract-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractCompositeStatusContractReady)}
                    data-blocker-launch-readiness-contract-composite-status-payload-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractCompositeStatusPayloadReady)}
                    data-blocker-launch-readiness-contract-composite-contract-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractCompositeContractReady)}
                    data-blocker-launch-readiness-contract-composite-contract-payload-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractCompositeContractPayloadReady)}
                    data-blocker-launch-readiness-contract-final-status={notificationBlockerMetadata.blockerLaunchReadinessContractFinalStatus}
                    data-blocker-launch-readiness-contract-final-status-options={NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_STATUSES.join(',')}
                    data-blocker-launch-readiness-contract-final-status-option-count={notificationBlockerMetadata.blockerLaunchReadinessContractFinalStatusOptionCount}
                    data-blocker-launch-readiness-contract-final-status-expected-count={notificationBlockerMetadata.blockerLaunchReadinessContractFinalStatusExpectedCount}
                    data-blocker-launch-readiness-contract-final-status-option-count-aligned={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalStatusOptionCountAligned)}
                    data-blocker-launch-readiness-contract-final-status-known={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalStatusKnown)}
                    data-blocker-launch-readiness-contract-final-status-aligned={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalStatusAligned)}
                    data-blocker-launch-readiness-contract-final-status-contract-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalStatusContractReady)}
                    data-blocker-launch-readiness-contract-final-status-payload-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalStatusPayloadReady)}
                    data-blocker-launch-readiness-contract-final-contract-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalContractReady)}
                    data-blocker-launch-readiness-contract-final-contract-payload-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalContractPayloadReady)}
                    data-blocker-launch-readiness-contract-final-contract-status={notificationBlockerMetadata.blockerLaunchReadinessContractFinalContractStatus}
                    data-blocker-launch-readiness-contract-final-contract-status-options={NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_CONTRACT_STATUSES.join(',')}
                    data-blocker-launch-readiness-contract-final-contract-status-option-count={notificationBlockerMetadata.blockerLaunchReadinessContractFinalContractStatusOptionCount}
                    data-blocker-launch-readiness-contract-final-contract-status-expected-count={notificationBlockerMetadata.blockerLaunchReadinessContractFinalContractStatusExpectedCount}
                    data-blocker-launch-readiness-contract-final-contract-status-option-count-aligned={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalContractStatusOptionCountAligned)}
                    data-blocker-launch-readiness-contract-final-contract-status-known={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalContractStatusKnown)}
                    data-blocker-launch-readiness-contract-final-contract-status-aligned={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalContractStatusAligned)}
                    data-blocker-launch-readiness-contract-final-contract-status-contract-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalContractStatusContractReady)}
                    data-blocker-launch-readiness-contract-final-contract-status-payload-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalContractStatusPayloadReady)}
                    data-blocker-launch-readiness-contract-final-final-contract-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalFinalContractReady)}
                    data-blocker-launch-readiness-contract-final-final-contract-payload-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalFinalContractPayloadReady)}
                    data-blocker-launch-readiness-contract-final-final-contract-status={notificationBlockerMetadata.blockerLaunchReadinessContractFinalFinalContractStatus}
                    data-blocker-launch-readiness-contract-final-final-contract-status-options={NOTIFICATION_BLOCKER_LAUNCH_READINESS_CONTRACT_FINAL_FINAL_CONTRACT_STATUSES.join(',')}
                    data-blocker-launch-readiness-contract-final-final-contract-status-option-count={notificationBlockerMetadata.blockerLaunchReadinessContractFinalFinalContractStatusOptionCount}
                    data-blocker-launch-readiness-contract-final-final-contract-status-expected-count={notificationBlockerMetadata.blockerLaunchReadinessContractFinalFinalContractStatusExpectedCount}
                    data-blocker-launch-readiness-contract-final-final-contract-status-option-count-aligned={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalFinalContractStatusOptionCountAligned)}
                    data-blocker-launch-readiness-contract-final-final-contract-status-known={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalFinalContractStatusKnown)}
                    data-blocker-launch-readiness-contract-final-final-contract-status-aligned={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalFinalContractStatusAligned)}
                    data-blocker-launch-readiness-contract-final-final-contract-status-contract-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalFinalContractStatusContractReady)}
                    data-blocker-launch-readiness-contract-final-final-contract-status-payload-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalFinalContractStatusPayloadReady)}
                    data-blocker-launch-readiness-contract-final-final-contract-contract-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalFinalContractContractReady)}
                    data-blocker-launch-readiness-contract-final-final-contract-contract-payload-ready={String(notificationBlockerMetadata.blockerLaunchReadinessContractFinalFinalContractContractPayloadReady)}
                    data-blocker-contract-terminal-ready={String(notificationBlockerMetadata.blockerContractTerminalReady)}
                    data-blocker-contract-terminal-payload-ready={String(notificationBlockerMetadata.blockerContractTerminalPayloadReady)}
                    data-blocker-contract-terminal-status={notificationBlockerMetadata.blockerContractTerminalStatus}
                    data-blocker-contract-terminal-status-options={NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_STATUSES.join(',')}
                    data-blocker-contract-terminal-status-option-count={notificationBlockerMetadata.blockerContractTerminalStatusOptionCount}
                    data-blocker-contract-terminal-status-expected-count={notificationBlockerMetadata.blockerContractTerminalStatusExpectedCount}
                    data-blocker-contract-terminal-status-option-count-aligned={String(notificationBlockerMetadata.blockerContractTerminalStatusOptionCountAligned)}
                    data-blocker-contract-terminal-status-known={String(notificationBlockerMetadata.blockerContractTerminalStatusKnown)}
                    data-blocker-contract-terminal-status-aligned={String(notificationBlockerMetadata.blockerContractTerminalStatusAligned)}
                    data-blocker-contract-terminal-status-contract-ready={String(notificationBlockerMetadata.blockerContractTerminalStatusContractReady)}
                    data-blocker-contract-terminal-status-payload-ready={String(notificationBlockerMetadata.blockerContractTerminalStatusPayloadReady)}
                    data-blocker-contract-terminal-contract-ready={String(notificationBlockerMetadata.blockerContractTerminalContractReady)}
                    data-blocker-contract-terminal-contract-payload-ready={String(notificationBlockerMetadata.blockerContractTerminalContractPayloadReady)}
                    data-blocker-contract-terminal-contract-status={notificationBlockerMetadata.blockerContractTerminalContractStatus}
                    data-blocker-contract-terminal-contract-status-options={NOTIFICATION_BLOCKER_CONTRACT_TERMINAL_CONTRACT_STATUSES.join(',')}
                    data-blocker-contract-terminal-contract-status-option-count={notificationBlockerMetadata.blockerContractTerminalContractStatusOptionCount}
                    data-blocker-contract-terminal-contract-status-expected-count={notificationBlockerMetadata.blockerContractTerminalContractStatusExpectedCount}
                    data-blocker-contract-terminal-contract-status-option-count-aligned={String(notificationBlockerMetadata.blockerContractTerminalContractStatusOptionCountAligned)}
                    data-blocker-contract-terminal-contract-status-known={String(notificationBlockerMetadata.blockerContractTerminalContractStatusKnown)}
                    data-blocker-contract-terminal-contract-status-aligned={String(notificationBlockerMetadata.blockerContractTerminalContractStatusAligned)}
                    data-blocker-contract-terminal-contract-status-contract-ready={String(notificationBlockerMetadata.blockerContractTerminalContractStatusContractReady)}
                    data-blocker-contract-terminal-contract-status-payload-ready={String(notificationBlockerMetadata.blockerContractTerminalContractStatusPayloadReady)}
                    data-blocker-contract-terminal-contract-contract-ready={String(notificationBlockerMetadata.blockerContractTerminalContractContractReady)}
                    data-blocker-contract-terminal-contract-contract-payload-ready={String(notificationBlockerMetadata.blockerContractTerminalContractContractPayloadReady)}
                    data-first-blocker-contract-payload-ready={String(notificationBlockerMetadata.firstBlockerContractPayloadReady)}
                    data-blocker-payload-contract-payload-ready={String(notificationBlockerMetadata.blockerPayloadContractPayloadReady)}
                    data-blocker-contract-ready={String(notificationBlockerMetadata.blockerContractReady)}
                    data-blocker-contract-payload-ready={String(notificationBlockerMetadata.blockerContractPayloadReady)}
                    data-blocker-contract-contract-payload-ready={String(notificationBlockerMetadata.blockerContractContractPayloadReady)}
                    data-blocker-inspection-contract-contract-payload-ready={String(notificationBlockerMetadata.blockerInspectionContractContractPayloadReady)}
                    data-blocker-contract-legacy-payload-ready={String(notificationBlockerMetadata.blockerContractLegacyPayloadReady)}
                    data-blocker-contract-legacy-aligned={String(notificationBlockerMetadata.blockerContractLegacyAligned)}
                    data-blocker-contract-status={notificationBlockerMetadata.blockerContractStatus}
                    data-blocker-contract-status-payload-ready={String(notificationBlockerMetadata.blockerContractStatusPayloadReady)}
                    data-blocker-contract-status-aligned={String(notificationBlockerMetadata.blockerContractStatusAligned)}
                    data-blocker-contract-status-options={NOTIFICATION_BLOCKER_CONTRACT_STATUSES.join(',')}
                    data-blocker-contract-status-option-count={notificationBlockerMetadata.blockerContractStatusOptionCount}
                    data-blocker-contract-status-expected-count={notificationBlockerMetadata.blockerContractStatusExpectedCount}
                    data-blocker-contract-status-option-count-aligned={String(notificationBlockerMetadata.blockerContractStatusOptionCountAligned)}
                    data-blocker-contract-status-known={String(notificationBlockerMetadata.blockerContractStatusKnown)}
                    data-blocker-contract-status-contract-ready={String(notificationBlockerMetadata.blockerContractStatusContractReady)}
                    data-blocker-contract-composite-ready={String(notificationBlockerMetadata.blockerContractCompositeReady)}
                    data-blocker-contract-composite-payload-ready={String(notificationBlockerMetadata.blockerContractCompositePayloadReady)}
                    data-blocker-contract-composite-status={notificationBlockerMetadata.blockerContractCompositeStatus}
                    data-blocker-contract-composite-status-aligned={String(notificationBlockerMetadata.blockerContractCompositeStatusAligned)}
                    data-blocker-contract-composite-status-options={NOTIFICATION_BLOCKER_COMPOSITE_STATUSES.join(',')}
                    data-blocker-contract-composite-status-option-count={notificationBlockerMetadata.blockerContractCompositeStatusOptionCount}
                    data-blocker-contract-composite-status-expected-count={notificationBlockerMetadata.blockerContractCompositeStatusExpectedCount}
                    data-blocker-contract-composite-status-option-count-aligned={String(notificationBlockerMetadata.blockerContractCompositeStatusOptionCountAligned)}
                    data-blocker-contract-composite-status-known={String(notificationBlockerMetadata.blockerContractCompositeStatusKnown)}
                    data-blocker-contract-composite-status-contract-ready={String(notificationBlockerMetadata.blockerContractCompositeStatusContractReady)}
                    data-blocker-contract-composite-status-payload-ready={String(notificationBlockerMetadata.blockerContractCompositeStatusPayloadReady)}
                    data-blocker-contract-composite-contract-ready={String(notificationBlockerMetadata.blockerContractCompositeContractReady)}
                    data-blocker-contract-composite-contract-payload-ready={String(notificationBlockerMetadata.blockerContractCompositeContractPayloadReady)}
                    data-api-blocker-code-count={notificationBlockerMetadata.counts.apiCodeCount}
                    data-api-blocker-env-var-count={notificationBlockerMetadata.counts.apiEnvVarCount}
                    data-structured-blocker-code-count={notificationBlockerMetadata.counts.structuredCodeCount}
                    data-structured-blocker-env-var-count={notificationBlockerMetadata.counts.structuredEnvVarCount}
                    data-has-recipient-blocker={String(notificationBlockerMetadata.hasRecipientBlocker)}
                    data-has-dry-run-blocker={String(notificationBlockerMetadata.hasDryRunBlocker)}
                    data-command-bundle-complete={String(notificationBlockerMetadata.commandsComplete)}
                    data-command-keys={notificationBlockerMetadata.commandKeys.join(',')}
                    data-command-key-count={notificationBlockerMetadata.commandKeyCount}
                    data-command-key-count-aligned={String(notificationBlockerMetadata.commandKeyCountAligned)}
                    data-command-count={notificationBlockerMetadata.commandCount}
                    data-command-count-aligned={String(notificationBlockerMetadata.commandCountAligned)}
                    data-command-inspection-ready={String(notificationBlockerMetadata.commandInspectionReady)}
                    data-command-inspection-payload-ready={String(notificationBlockerMetadata.commandInspectionPayloadReady)}
                    data-command-expected-count={notificationBlockerMetadata.expectedCommandCount}
                    data-command-expected-payload-ready={String(notificationBlockerMetadata.commandExpectedPayloadReady)}
                    data-notification-command-panel-payload-ready={String(notificationBlockerMetadata.notificationCommandPanelPayloadReady)}
                    data-first-blocker-payload-ready={String(notificationBlockerMetadata.firstBlockerPayloadReady)}
                    data-first-blocker-identity-payload-ready={String(notificationBlockerMetadata.firstBlockerIdentityPayloadReady)}
                    data-first-blocker-action-payload-ready={String(notificationBlockerMetadata.firstBlockerActionPayloadReady)}
                    data-first-blocker-detail-payload-ready={String(notificationBlockerMetadata.firstBlockerDetailPayloadReady)}
                    data-first-blocker-env-payload-ready={String(notificationBlockerMetadata.firstBlockerEnvPayloadReady)}
                    data-first-blocker-code-payload-ready={String(notificationBlockerMetadata.firstBlockerCodePayloadReady)}
                    data-notification-blocker-panel-payload-ready={String(notificationBlockerMetadata.notificationBlockerPanelPayloadReady)}
                    data-first-blocker-code={alertStatus.notificationReadiness.blockedBy[0]?.code || 'none'}
                    data-first-blocker-env-vars={alertStatus.notificationReadiness.blockedBy[0]?.envVars.join(',') || ''}
                    data-first-blocker-env-var-count={alertStatus.notificationReadiness.blockedBy[0]?.envVars.length || 0}
                    data-first-blocker-detail={alertStatus.notificationReadiness.blockedBy[0]?.detail || ''}
                    data-first-blocker-next-command={alertStatus.notificationReadiness.blockedBy[0]?.nextCommand || ''}
                    data-property-inquiry-command-payload-ready={String(notificationBlockerMetadata.propertyInquiryCommandPayloadReady)}
                    data-notification-readiness-command-payload-ready={String(notificationBlockerMetadata.notificationReadinessCommandPayloadReady)}
                    data-strict-notification-readiness-command-payload-ready={String(notificationBlockerMetadata.strictNotificationReadinessCommandPayloadReady)}
                    data-strict-notification-contract-command-payload-ready={String(notificationBlockerMetadata.strictNotificationContractCommandPayloadReady)}
                    data-launch-readiness-command-payload-ready={String(notificationBlockerMetadata.launchReadinessCommandPayloadReady)}
                    data-notification-command-chain-payload-ready={String(notificationBlockerMetadata.notificationCommandChainPayloadReady)}
                    data-notification-launch-panel-payload-ready={String(notificationBlockerMetadata.notificationLaunchPanelPayloadReady)}
                    data-notification-launch-terminal-payload-ready={String(notificationBlockerMetadata.notificationLaunchTerminalPayloadReady)}
                    data-notification-readiness-level-payload-ready={String(notificationBlockerMetadata.notificationReadinessLevelPayloadReady)}
                    data-command-property-inquiry-readiness={alertStatus.notificationReadiness.commands.propertyInquiryReadiness}
                    data-command-notification-readiness={alertStatus.notificationReadiness.commands.notificationReadiness}
                    data-command-strict-notification-readiness={alertStatus.notificationReadiness.commands.strictNotificationReadiness}
                    data-command-strict-notification-contract={alertStatus.notificationReadiness.commands.strictNotificationReadinessContract}
                    data-command-launch-readiness={alertStatus.notificationReadiness.commands.launchReadiness}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs font-black uppercase text-slate-500">Notification Launch Blockers</div>
                      <span
                        className={`border px-2 py-1 text-[10px] font-black uppercase ${
                          alertStatus.notificationReadiness.level === 'blocked'
                            ? 'border-red-400/40 bg-red-500/10 text-red-100'
                            : 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100'
                        }`}
                      >
                        {alertStatus.notificationReadiness.level}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{alertStatus.notificationReadiness.summary}</p>
                    {alertStatus.notificationReadiness.blockedBy.length > 0 ? (
                      <div className="mt-3 grid gap-2">
                        {alertStatus.notificationReadiness.blockedBy.map((blocker) => (
                          <div
                            key={`${blocker.code}-${blocker.envVars.join('-')}`}
                            className="border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-100"
                            data-testid={`reie-notification-blocker-${blocker.code}`}
                            data-blocker-code={blocker.code}
                            data-blocker-env-vars={blocker.envVars.join(',')}
                            data-blocker-next-command={blocker.nextCommand}
                          >
                            <div className="font-black uppercase">{blocker.code.replaceAll('_', ' ')}</div>
                            <div className="mt-1 text-red-100/80">{blocker.detail}</div>
                            <div className="mt-1 font-semibold text-red-100/70">{blocker.envVars.join(' or ')}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 border border-emerald-300/20 bg-emerald-400/5 px-3 py-2 text-xs font-semibold text-emerald-100">
                        No notification launch blockers reported by alert status.
                      </div>
                    )}
                    <div className="mt-3">
                      <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Notification Gate</div>
                      <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                        {alertStatus.notificationReadiness.nextCommand || alertStatus.notificationReadiness.commands.notificationReadiness}
                      </code>
                    </div>
                    <div className="mt-3 grid gap-2 lg:grid-cols-2">
                      {[
                        ['Property Inquiry', alertStatus.notificationReadiness.commands.propertyInquiryReadiness],
                        ['Notification Summary', alertStatus.notificationReadiness.commands.notificationReadiness],
                        ['Strict Gate', alertStatus.notificationReadiness.commands.strictNotificationReadiness],
                        ['Strict Contract', alertStatus.notificationReadiness.commands.strictNotificationReadinessContract],
                        ['Launch Readiness', alertStatus.notificationReadiness.commands.launchReadiness],
                      ].map(([label, command]) => (
                        <div key={label} className="min-w-0">
                          <div className="mb-1 text-[10px] font-black uppercase text-slate-500">{label}</div>
                          <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-300">
                            {command}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                  );
                })() : null}

                <div
                  className="mt-4 border border-slate-800 bg-black/70 p-4"
                  data-testid="reie-alert-api-metadata"
                  data-api-generated-at={alertStatus.generatedAt || ''}
                  data-api-route={alertStatus.route || '/api/process-alerts'}
                  data-api-terminal={alertStatus.terminal || 'Terminal 5'}
                  data-api-command={alertStatus.command || 'curl --max-time 20 -s "http://localhost:3000/api/process-alerts" -H "x-admin-key: $REIE_ADMIN_API_KEY"'}
                  data-alert-mode={alertStatus.mode || 'status'}
                  data-alert-pending={alertStatus.stats?.pending ?? 0}
                  data-alert-failed={alertStatus.stats?.failed ?? 0}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-black uppercase text-slate-500">Alert API Inspection</div>
                    <span className="border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[10px] font-black uppercase text-cyan-100">
                      {alertStatus.terminal}
                    </span>
                  </div>
                  <div className="grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
                    <div>
                      <span className="block font-black uppercase text-slate-500">Generated</span>
                      <span className="mt-1 block break-words">{alertStatus.generatedAt || 'Not recorded'}</span>
                    </div>
                    <div>
                      <span className="block font-black uppercase text-slate-500">Route</span>
                      <span className="mt-1 block break-words">{alertStatus.route || '/api/process-alerts'}</span>
                    </div>
                    <div>
                      <span className="block font-black uppercase text-slate-500">Mode</span>
                      <span className="mt-1 block font-black uppercase text-white">{alertStatus.mode || 'status'}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 API Check</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {alertStatus.command || 'curl --max-time 20 -s "http://localhost:3000/api/process-alerts" -H "x-admin-key: $REIE_ADMIN_API_KEY"'}
                    </code>
                  </div>
                </div>

                <div
                  className="mt-4 grid gap-3 lg:grid-cols-2"
                  data-testid="reie-alert-command-metadata"
                  data-api-terminal={alertStatus.commands?.terminal || alertStatus.terminal || 'Terminal 5'}
                  data-command-status={alertStatus.commands?.status || 'curl -s "http://localhost:3000/api/process-alerts?limit=50"'}
                  data-command-dry-run={alertStatus.commands?.dryRun || 'curl -s -X POST "http://localhost:3000/api/process-alerts?dryRun=true&limit=50"'}
                  data-command-live={alertStatus.commands?.live || ''}
                  data-command-dead-letter={alertStatus.commands?.deadLetter || 'curl -s "http://localhost:3000/api/admin/dead-letter?sourceQueue=reie-alerts&limit=25"'}
                >
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Alert Status</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {alertStatus.commands?.status || 'curl -s "http://localhost:3000/api/process-alerts?limit=50"'}
                    </code>
                  </div>
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Alert Dry-Run</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {alertStatus.commands?.dryRun || 'curl -s -X POST "http://localhost:3000/api/process-alerts?dryRun=true&limit=50"'}
                    </code>
                  </div>
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Dead-Letter</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {alertStatus.commands?.deadLetter || 'curl -s "http://localhost:3000/api/admin/dead-letter?sourceQueue=reie-alerts&limit=25"'}
                    </code>
                  </div>
                  <div>
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 Queue Dashboard</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {alertStatus.commands?.queueDashboard || 'npm run run:queue-dashboard -- --failed --limit=5'}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section
          className="border border-slate-800 bg-slate-950/80"
          data-testid="reie-mls-operations"
          data-api-route={mlsStatus?.route || '/api/mls/status'}
          data-api-terminal={mlsStatus?.terminal || 'Terminal 5'}
          data-api-command={mlsStatus?.command || 'curl --max-time 8 -s "http://localhost:3000/api/mls/status" -H "x-admin-key: $REIE_ADMIN_API_KEY"'}
          data-mls-status={mlsStatus?.status || 'unknown'}
          data-mls-retry-route={mlsRetryStatus?.route || '/api/mls/retry'}
          data-mls-retry-command={mlsRetryStatus?.command || 'curl --max-time 8 -s "http://localhost:3000/api/mls/retry" -H "x-admin-key: $REIE_ADMIN_API_KEY"'}
        >
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
                onClick={() => {
                  void loadMlsStatus();
                  void loadMlsRetryStatus();
                }}
                disabled={isLoadingMlsStatus || isLoadingMlsRetryStatus}
                className="inline-flex items-center gap-2 border border-slate-800 bg-black px-3 py-2 text-xs font-black uppercase text-slate-300 transition hover:border-cyan-300 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingMlsStatus || isLoadingMlsRetryStatus ? <Loader2 size={13} className="animate-spin" /> : <RefreshCcw size={13} />}
                Refresh MLS
              </button>
            </div>
          </div>

          {isLoadingMlsStatus ? (
            <div className="flex min-h-48 items-center justify-center gap-3 px-5 py-8 text-sm font-black uppercase text-slate-500">
              <Loader2 size={18} className="animate-spin text-cyan-300" />
              Loading MLS operations
            </div>
          ) : mlsStatusError && !mlsStatus ? (
            <div className="px-5 py-6">
              <div className="border border-red-400/30 bg-red-500/10 p-4 text-sm leading-6 text-red-100">{mlsStatusError}</div>
            </div>
          ) : mlsStatus ? (
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
                {mlsStatusError ? (
                  <div className="mt-4 border border-red-400/30 bg-red-500/10 p-3 text-xs leading-5 text-red-100">{mlsStatusError}</div>
                ) : null}
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

                <div
                  className="mt-4 border border-slate-800 bg-black/70 p-4"
                  data-testid="reie-mls-status-api-metadata"
                  data-api-generated-at={mlsStatus.generatedAt}
                  data-api-route={mlsStatus.route}
                  data-api-terminal={mlsStatus.terminal}
                  data-api-command={mlsStatus.command}
                  data-mls-status={mlsStatus.status}
                  data-search-index-health={mlsStatus.searchIndex?.health || 'unknown'}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-black uppercase text-slate-500">MLS Status API Inspection</div>
                    <span className="border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-[10px] font-black uppercase text-cyan-100">
                      {mlsStatus.terminal}
                    </span>
                  </div>
                  <div className="grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
                    <div>
                      <span className="block font-black uppercase text-slate-500">Generated</span>
                      <span className="mt-1 block break-words">{mlsStatus.generatedAt}</span>
                    </div>
                    <div>
                      <span className="block font-black uppercase text-slate-500">Route</span>
                      <span className="mt-1 block break-words">{mlsStatus.route}</span>
                    </div>
                    <div>
                      <span className="block font-black uppercase text-slate-500">Status</span>
                      <span className="mt-1 block font-black uppercase text-white">{mlsStatus.status}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 API Check</div>
                    <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                      {mlsStatus.command}
                    </code>
                  </div>
                </div>

                {mlsStatus.operationalReadiness ? (
                  <div
                    className="mt-4 border border-slate-800 bg-black/70 p-4"
                    data-testid="reie-mls-operational-readiness"
                    data-api-route={mlsStatus.route}
                    data-api-terminal={mlsStatus.operationalReadiness.nextTerminal}
                    data-readiness-level={mlsStatus.operationalReadiness.level}
                    data-readiness-next-command={mlsStatus.operationalReadiness.nextCommand}
                  >
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

                <div
                  className="mt-4 border border-slate-800 bg-black/70 p-4"
                  data-testid="reie-mls-retry-api-metadata"
                  data-api-generated-at={mlsRetryStatus?.generatedAt || ''}
                  data-api-route={mlsRetryStatus?.route || '/api/mls/retry'}
                  data-api-terminal={mlsRetryStatus?.terminal || 'Terminal 5'}
                  data-api-command={mlsRetryStatus?.command || 'curl --max-time 8 -s "http://localhost:3000/api/mls/retry" -H "x-admin-key: $REIE_ADMIN_API_KEY"'}
                  data-retry-plan-level={mlsRetryStatus?.executionPlan?.level || 'unknown'}
                  data-retry-live-allowed={typeof mlsRetryStatus?.executionPlan?.liveRetryAllowed === 'boolean' ? String(mlsRetryStatus.executionPlan.liveRetryAllowed) : 'unknown'}
                  data-dead-letter-open={
                    mlsRetryStatus?.deadLetter
                      ? mlsRetryStatus.deadLetter.waiting + mlsRetryStatus.deadLetter.active + mlsRetryStatus.deadLetter.delayed + mlsRetryStatus.deadLetter.failed
                      : 0
                  }
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-black uppercase text-slate-500">MLS Retry API Inspection</div>
                    {mlsRetryStatus?.executionPlan ? (
                      <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getReadinessClass(mlsRetryStatus.executionPlan?.level === 'safe' ? 'ready' : mlsRetryStatus.executionPlan?.level === 'blocked' ? 'blocked' : 'watch')}`}>
                        {mlsRetryStatus.executionPlan?.level || 'status'}
                      </span>
                    ) : (
                      <span className="border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] font-black uppercase text-slate-400">
                        {isLoadingMlsRetryStatus ? 'loading' : 'offline'}
                      </span>
                    )}
                  </div>

                  {isLoadingMlsRetryStatus ? (
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-500">
                      <Loader2 size={14} className="animate-spin text-cyan-300" />
                      Loading MLS retry inspection
                    </div>
                  ) : mlsRetryStatus ? (
                    <>
                      <div className="grid gap-3 text-xs text-slate-300 sm:grid-cols-4">
                        <div>
                          <span className="block font-black uppercase text-slate-500">Generated</span>
                          <span className="mt-1 block break-words">{mlsRetryStatus.generatedAt || 'Not recorded'}</span>
                        </div>
                        <div>
                          <span className="block font-black uppercase text-slate-500">Route</span>
                          <span className="mt-1 block break-words">{mlsRetryStatus.route || '/api/mls/retry'}</span>
                        </div>
                        <div>
                          <span className="block font-black uppercase text-slate-500">Terminal</span>
                          <span className="mt-1 block font-black uppercase text-white">{mlsRetryStatus.terminal || 'Terminal 5'}</span>
                        </div>
                        <div>
                          <span className="block font-black uppercase text-slate-500">Dead Letter Open</span>
                          <span className="mt-1 block font-black uppercase text-white">
                            {mlsRetryStatus.deadLetter
                              ? mlsRetryStatus.deadLetter.waiting +
                                mlsRetryStatus.deadLetter.active +
                                mlsRetryStatus.deadLetter.delayed +
                                mlsRetryStatus.deadLetter.failed
                              : 0}
                          </span>
                        </div>
                      </div>
                      {mlsRetryStatusError ? (
                        <div className="mt-3 border border-red-400/30 bg-red-500/10 p-3 text-xs leading-5 text-red-100">{mlsRetryStatusError}</div>
                      ) : null}
                      {mlsRetryStatus.executionPlan ? (
                        <p className="mt-3 text-sm leading-6 text-slate-300">{mlsRetryStatus.executionPlan.summary}</p>
                      ) : null}
                      <div className="mt-3">
                        <div className="mb-2 text-[10px] font-black uppercase text-slate-500">Terminal 5 API Check</div>
                        <code className="block overflow-x-auto border border-slate-800 bg-black px-3 py-2 text-xs text-slate-200">
                          {mlsRetryStatus.command || 'curl --max-time 8 -s "http://localhost:3000/api/mls/retry" -H "x-admin-key: $REIE_ADMIN_API_KEY"'}
                        </code>
                      </div>
                    </>
                  ) : null}
                </div>

                <div
                  className="mt-4 border border-slate-800 bg-black/70 p-4"
                  data-testid="reie-search-index-status"
                  data-api-route={mlsStatus.route}
                  data-search-index-health={mlsStatus.searchIndex?.health || 'unknown'}
                  data-search-index-attempted={mlsStatus.searchIndex?.attempted ?? 0}
                  data-search-index-succeeded={mlsStatus.searchIndex?.succeeded ?? 0}
                  data-search-index-failed={mlsStatus.searchIndex?.failed ?? 0}
                >
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

                <div
                  className="mt-4 border border-slate-800 bg-black/70 p-4"
                  data-testid="reie-mls-media-diagnostics"
                  data-api-route={mlsStatus.route}
                  data-media-diagnostics-health={mlsStatus.mediaDiagnostics?.health || 'unknown'}
                  data-media-diagnostics-jobs={mlsStatus.mediaDiagnostics?.jobsWithMediaDiagnostics ?? 0}
                  data-media-extracted={mlsStatus.mediaDiagnostics?.extractedMediaCount ?? 0}
                  data-media-ignored={mlsStatus.mediaDiagnostics?.ignoredMediaItemCount ?? 0}
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-black uppercase text-slate-500">Media Diagnostics</div>
                    <span className={`border px-2 py-1 text-[10px] font-black uppercase ${getHealthClass(mlsStatus.mediaDiagnostics?.health || 'degraded')}`}>
                      {mlsStatus.mediaDiagnostics?.health || 'unknown'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="border border-slate-800 bg-slate-950 p-2">
                      <div className="font-black text-white">{mlsStatus.mediaDiagnostics?.listingsWithMedia ?? 0}</div>
                      <div className="mt-1 uppercase text-slate-600">Listings</div>
                    </div>
                    <div className="border border-slate-800 bg-slate-950 p-2">
                      <div className="font-black text-white">{mlsStatus.mediaDiagnostics?.extractedMediaCount ?? 0}</div>
                      <div className="mt-1 uppercase text-slate-600">Extracted</div>
                    </div>
                    <div className="border border-slate-800 bg-slate-950 p-2">
                      <div className="font-black text-white">{mlsStatus.mediaDiagnostics?.ignoredMediaItemCount ?? 0}</div>
                      <div className="mt-1 uppercase text-slate-600">Ignored</div>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="border border-slate-800 bg-slate-950 p-2">
                      <div className="font-black text-white">{mlsStatus.mediaDiagnostics?.listingsWithDirectMedia ?? 0}</div>
                      <div className="mt-1 uppercase text-slate-600">Direct</div>
                    </div>
                    <div className="border border-slate-800 bg-slate-950 p-2">
                      <div className="font-black text-white">{mlsStatus.mediaDiagnostics?.listingsWithNestedMedia ?? 0}</div>
                      <div className="mt-1 uppercase text-slate-600">Nested</div>
                    </div>
                    <div className="border border-slate-800 bg-slate-950 p-2">
                      <div className="font-black text-white">{mlsStatus.mediaDiagnostics?.listingsWithTopLevelPhotos ?? 0}</div>
                      <div className="mt-1 uppercase text-slate-600">Top-Level</div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">{formatMediaDiagnosticsDetail(mlsStatus.mediaDiagnostics)}</p>
                </div>

                {mlsStatus.syncDefaults ? (
                  <div
                    className="mt-4 grid gap-3 md:grid-cols-3"
                    data-testid="reie-mls-sync-envelope"
                    data-api-route={mlsStatus.route}
                    data-sync-page-size={mlsStatus.syncDefaults.pageSize}
                    data-sync-page-timeout-ms={mlsStatus.syncDefaults.pageTimeoutMs}
                    data-sync-start-page={mlsStatus.syncDefaults.startPage}
                    data-command-sync-preview={mlsStatus.commands.dryRunSyncPreview}
                  >
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

                <div
                  className="mt-4 grid gap-3 lg:grid-cols-2"
                  data-testid="reie-mls-command-metadata"
                  data-api-terminal={mlsStatus.terminals?.scriptsAndCurl || 'Terminal 5'}
                  data-command-smoke-ops={mlsStatus.commands.smokeOps || 'npm run smoke:ops'}
                  data-command-status-smoke={mlsStatus.commands.smokeMlsStatus || 'npm run smoke:mls-status'}
                  data-command-sync-preview={mlsStatus.commands.dryRunSyncPreview}
                  data-command-dry-run-retry={mlsStatus.commands.dryRunRetry || mlsStatus.commands.dryRunRetryMlsSync}
                  data-command-dead-letter={mlsStatus.commands.deadLetterOpen || mlsStatus.commands.deadLetterInspector || mlsStatus.commands.deadLetter}
                >
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
