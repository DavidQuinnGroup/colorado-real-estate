import { pathToFileURL } from 'node:url';
import { prisma } from '../lib/prisma.js';
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const DEFAULT_STATUS = 'pending';
const ACTIVE_STATUSES = ['pending', 'reviewing'];
const EMAIL_VISIBLE_PREFIX = 2;
const emptyCRMTaskAuditSummary = {
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
const emptyCRMTaskReadiness = {
    level: 'ready',
    summary: 'CRM readiness has not been calculated.',
    nextAction: 'Run CRM reporting from Terminal 5.',
    terminal: 'Terminal 5',
    nextCommand: 'npm run run:crm:active',
    gates: [],
};
const HELP_TEXT = `
REIE CRM task worker

Usage:
  node dist/workers/runCRMTasks.js [options]

Options:
  --limit <number>   Maximum CRM tasks to scan. Default: ${DEFAULT_LIMIT}, max: ${MAX_LIMIT}.
  --limit=<number>   Same as --limit <number>.
  --status <status>  CRM task status to scan. Default: ${DEFAULT_STATUS}.
  --status=<status>  Same as --status <status>.
  --quiet            Suppress human-readable worker logs for scheduler output.
  --help             Show this help text.

Terminal 5 examples:
  node dist/workers/runCRMTasks.js --help
  node dist/workers/runCRMTasks.js --limit 20 --status pending
  node dist/workers/runCRMTasks.js --limit 20 --status active
  node dist/workers/runCRMTasks.js --limit 50 --status all
  npm run run:worker:crm -- --limit 20 --status pending
`;
function printHelp() {
    console.log(HELP_TEXT.trim());
}
function clampInteger(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed))
        return fallback;
    return Math.min(Math.max(Math.floor(parsed), min), max);
}
function parseBoundedInteger(value, name, min, max) {
    if (!value)
        throw new Error(`Missing value for ${name}.`);
    const parsed = Number(value);
    if (!Number.isInteger(parsed))
        throw new Error(`Invalid integer for ${name}: ${value}`);
    if (parsed < min || parsed > max)
        throw new Error(`${name} must be between ${min} and ${max}.`);
    return parsed;
}
function readFlagValue(arg) {
    const [, value] = arg.split('=');
    return value;
}
function normalizeStatus(value) {
    const normalized = String(value || '')
        .replace(/[^a-zA-Z0-9_-]/g, '')
        .trim()
        .slice(0, 48);
    return normalized || DEFAULT_STATUS;
}
function getStatusFilter(status) {
    if (status === 'all')
        return null;
    if (status === 'active')
        return ACTIVE_STATUSES;
    return [status];
}
function parseArgs(argv) {
    const options = {
        limit: DEFAULT_LIMIT,
        status: DEFAULT_STATUS,
    };
    for (let index = 0; index < argv.length; index++) {
        const arg = argv[index];
        if (arg === '--help' || arg === '-h') {
            printHelp();
            return null;
        }
        if (arg === '--quiet') {
            options.quiet = true;
            continue;
        }
        if (arg === '--limit') {
            options.limit = parseBoundedInteger(argv[index + 1], '--limit', 1, MAX_LIMIT);
            index++;
            continue;
        }
        if (arg.startsWith('--limit=')) {
            options.limit = parseBoundedInteger(readFlagValue(arg), '--limit', 1, MAX_LIMIT);
            continue;
        }
        if (arg === '--status') {
            options.status = normalizeStatus(argv[index + 1]);
            index++;
            continue;
        }
        if (arg.startsWith('--status=')) {
            options.status = normalizeStatus(readFlagValue(arg));
            continue;
        }
        throw new Error(`Unknown option: ${arg}`);
    }
    return options;
}
function getMetadata(task) {
    return task.metadata && typeof task.metadata === 'object' && !Array.isArray(task.metadata) ? task.metadata : {};
}
function getRecord(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}
function cleanString(value, fallback = '') {
    if (typeof value !== 'string')
        return fallback;
    const trimmed = value.trim();
    return trimmed || fallback;
}
function getIntentSummary(task) {
    const metadata = getMetadata(task);
    const value = metadata.intentSummary;
    return typeof value === 'string' && value.trim() ? value.trim() : null;
}
function getNextAction(task) {
    const metadata = getMetadata(task);
    const nextAction = cleanString(metadata.nextAction);
    return nextAction || null;
}
function getAlertReadiness(task) {
    const metadata = getMetadata(task);
    const readiness = getRecord(metadata.alertReadiness);
    const rawLevel = cleanString(readiness.level).toLowerCase();
    const level = rawLevel === 'ready' || rawLevel === 'watch' || rawLevel === 'incomplete'
        ? rawLevel
        : 'unknown';
    return {
        level,
        summary: cleanString(readiness.summary, level === 'unknown' ? 'Alert readiness was not recorded for this CRM task.' : ''),
    };
}
function getLatestSavedSearchIntake(task) {
    const metadata = getMetadata(task);
    const intake = getRecord(metadata.latestSavedSearchIntake);
    if (!Object.keys(intake).length)
        return null;
    return {
        city: cleanString(intake.city) || null,
        marketScope: cleanString(intake.marketScope) || null,
        timelineLabel: cleanString(intake.timelineLabel) || null,
        leadTemperature: cleanString(intake.leadTemperature) || null,
        sourceLabel: cleanString(intake.sourceLabel) || null,
    };
}
function maskEmail(email) {
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain)
        return '[invalid email]';
    return `${localPart.slice(0, EMAIL_VISIBLE_PREFIX)}***@${domain}`;
}
function toTaskSummary(task) {
    return {
        id: task.id,
        leadId: task.leadId,
        email: task.user.email,
        name: task.user.name,
        type: task.type,
        title: task.title,
        status: task.status,
        priority: task.priority,
        heatScore: task.user.heatScore || 0,
        createdAt: task.createdAt.toISOString(),
        intentSummary: getIntentSummary(task),
        nextAction: getNextAction(task),
        alertReadiness: getAlertReadiness(task),
        latestSavedSearchIntake: getLatestSavedSearchIntake(task),
    };
}
function normalizeCount(value) {
    if (typeof value === 'bigint')
        return Number(value);
    if (typeof value === 'number' && Number.isFinite(value))
        return value;
    return 0;
}
function normalizeAuditSummary(row) {
    const completedWithReview = normalizeCount(row?.completedWithReview);
    const completedMissingReview = normalizeCount(row?.completedMissingReview);
    const dismissedWithReview = normalizeCount(row?.dismissedWithReview);
    const dismissedMissingReview = normalizeCount(row?.dismissedMissingReview);
    const closureReviewReady = completedWithReview + dismissedWithReview;
    const closureReviewMissing = completedMissingReview + dismissedMissingReview;
    const closed = normalizeCount(row?.closed);
    return {
        closed,
        completed: normalizeCount(row?.completed),
        dismissed: normalizeCount(row?.dismissed),
        completedWithReview,
        completedMissingReview,
        dismissedWithReview,
        dismissedMissingReview,
        closureReviewReady,
        closureReviewMissing,
        closureReviewCoveragePercent: closed > 0 ? Math.round((closureReviewReady / closed) * 100) : 100,
    };
}
async function fetchAuditSummary() {
    const rows = await prisma.$queryRaw `
    SELECT
      COUNT(*) FILTER (WHERE "CRMTask"."status" IN ('completed', 'dismissed')) AS "closed",
      COUNT(*) FILTER (WHERE "CRMTask"."status" = 'completed') AS "completed",
      COUNT(*) FILTER (WHERE "CRMTask"."status" = 'dismissed') AS "dismissed",
      COUNT(*) FILTER (
        WHERE "CRMTask"."status" = 'completed'
          AND NULLIF(TRIM("CRMTask"."metadata" #>> '{review,reviewNote}'), '') IS NOT NULL
      ) AS "completedWithReview",
      COUNT(*) FILTER (
        WHERE "CRMTask"."status" = 'completed'
          AND NULLIF(TRIM("CRMTask"."metadata" #>> '{review,reviewNote}'), '') IS NULL
      ) AS "completedMissingReview",
      COUNT(*) FILTER (
        WHERE "CRMTask"."status" = 'dismissed'
          AND NULLIF(TRIM("CRMTask"."metadata" #>> '{review,reviewNote}'), '') IS NOT NULL
      ) AS "dismissedWithReview",
      COUNT(*) FILTER (
        WHERE "CRMTask"."status" = 'dismissed'
          AND NULLIF(TRIM("CRMTask"."metadata" #>> '{review,reviewNote}'), '') IS NULL
      ) AS "dismissedMissingReview"
    FROM "CRMTask"
  `;
    return normalizeAuditSummary(rows[0]);
}
function getReviewCommand(status) {
    if (status === 'active')
        return 'npm run run:crm:active';
    if (status === 'pending')
        return 'npm run run:crm:pending';
    if (status === 'reviewing')
        return 'npm run run:crm:reviewing';
    if (status === 'all')
        return 'npm run run:crm:all';
    return `npm run run:crm -- --limit ${DEFAULT_LIMIT} --status ${status}`;
}
function getReadiness(summary) {
    const auditGateStatus = summary.audit.closureReviewMissing > 0 ? 'fail' : 'pass';
    const intakeGateStatus = summary.alertIncomplete > 0 ? 'watch' : 'pass';
    const activeGateStatus = summary.pending + summary.reviewing > 0 ? 'watch' : 'pass';
    const gates = [
        {
            label: 'Closure Audit',
            status: auditGateStatus,
            detail: `${summary.audit.closureReviewCoveragePercent}% closure review coverage; ${summary.audit.closureReviewMissing} closed tasks missing review notes.`,
        },
        {
            label: 'Active Review',
            status: activeGateStatus,
            detail: `${summary.pending} pending and ${summary.reviewing} reviewing CRM tasks in this response.`,
        },
        {
            label: 'Alert Criteria',
            status: intakeGateStatus,
            detail: `${summary.alertReady} alert-ready, ${summary.alertWatch} watch, ${summary.alertIncomplete} incomplete CRM tasks in this response.`,
        },
    ];
    if (auditGateStatus === 'fail') {
        return {
            level: 'blocked',
            summary: 'CRM closure audit coverage is incomplete.',
            nextAction: 'Review closed CRM tasks missing notes before increasing CRM automation or reporting cadence.',
            terminal: 'Terminal 5',
            nextCommand: 'npm run run:crm:all',
            gates,
        };
    }
    if (summary.alertIncomplete > 0) {
        return {
            level: 'watch',
            summary: 'CRM queue is usable, but some active tasks need stronger saved-search criteria.',
            nextAction: 'Review incomplete CRM intake criteria before relying on automated alert matching.',
            terminal: 'Terminal 5',
            nextCommand: getReviewCommand(summary.status),
            gates,
        };
    }
    if (summary.pending + summary.reviewing > 0) {
        return {
            level: 'watch',
            summary: 'CRM closure audit is clean and active tasks are ready for human review.',
            nextAction: 'Continue reviewing active CRM tasks in the admin dashboard.',
            terminal: 'Terminal 5',
            nextCommand: getReviewCommand(summary.status),
            gates,
        };
    }
    return {
        level: 'ready',
        summary: 'CRM closure audit is clean and no active CRM task blockers were detected.',
        nextAction: 'Keep CRM reporting on the approved cadence and monitor new intake.',
        terminal: 'Terminal 5',
        nextCommand: getReviewCommand(summary.status),
        gates,
    };
}
async function fetchTasks(limit, status) {
    const statusFilter = getStatusFilter(status);
    return prisma.cRMTask.findMany({
        where: statusFilter ? { status: { in: statusFilter } } : {},
        orderBy: [
            {
                priority: 'asc',
            },
            {
                createdAt: 'asc',
            },
        ],
        take: limit,
        include: {
            user: {
                select: {
                    email: true,
                    name: true,
                    heatScore: true,
                },
            },
        },
    });
}
function printSummary(summary) {
    console.log('REIE CRM task worker complete:', {
        scanned: summary.scanned,
        status: summary.status,
        effectiveStatuses: summary.effectiveStatuses,
        pending: summary.pending,
        reviewing: summary.reviewing,
        completed: summary.completed,
        dismissed: summary.dismissed,
        alertReady: summary.alertReady,
        alertWatch: summary.alertWatch,
        alertIncomplete: summary.alertIncomplete,
        audit: summary.audit,
        readiness: summary.readiness,
        success: summary.success,
        terminal: 'Terminal 5',
        relatedCommands: {
            crmScript: 'npm run run:crm -- --limit 20 --status active',
            intakeSignals: 'curl -s http://localhost:3000/api/admin/intake-signals',
            mlsDryRun: 'npm run run:mls-sync:dry',
        },
    });
    if (!summary.tasks.length) {
        console.log(`No CRM tasks found with status "${summary.status}".`);
        return;
    }
    console.table(summary.tasks.map((task) => ({
        id: task.id,
        email: maskEmail(task.email),
        type: task.type,
        status: task.status,
        priority: task.priority,
        alert: task.alertReadiness.level,
        heatScore: task.heatScore,
        market: task.latestSavedSearchIntake?.marketScope || task.latestSavedSearchIntake?.city || '',
        timeline: task.latestSavedSearchIntake?.timelineLabel || '',
        intentSummary: task.intentSummary || '',
        nextAction: task.nextAction || '',
    })));
}
export async function runCRMTasks(options = {}) {
    const limit = clampInteger(options.limit, DEFAULT_LIMIT, 1, MAX_LIMIT);
    const status = normalizeStatus(options.status);
    const quiet = Boolean(options.quiet);
    try {
        if (!quiet)
            console.log('REIE CRM task worker starting:', { limit, status });
        const tasks = await fetchTasks(limit, status);
        const audit = await fetchAuditSummary();
        const taskSummaries = tasks.map(toTaskSummary);
        const summaryWithoutReadiness = {
            success: true,
            scanned: tasks.length,
            status,
            effectiveStatuses: getStatusFilter(status),
            pending: taskSummaries.filter((task) => task.status === 'pending').length,
            reviewing: taskSummaries.filter((task) => task.status === 'reviewing').length,
            completed: taskSummaries.filter((task) => task.status === 'completed').length,
            dismissed: taskSummaries.filter((task) => task.status === 'dismissed').length,
            alertReady: taskSummaries.filter((task) => task.alertReadiness.level === 'ready').length,
            alertWatch: taskSummaries.filter((task) => task.alertReadiness.level === 'watch').length,
            alertIncomplete: taskSummaries.filter((task) => task.alertReadiness.level === 'incomplete').length,
            audit,
            tasks: taskSummaries,
        };
        const summary = {
            ...summaryWithoutReadiness,
            readiness: getReadiness(summaryWithoutReadiness),
        };
        if (!quiet)
            printSummary(summary);
        return summary;
    }
    catch (error) {
        if (!quiet)
            console.error('REIE CRM task worker failed:', error instanceof Error ? error.message : error);
        return {
            success: false,
            scanned: 0,
            status,
            effectiveStatuses: getStatusFilter(status),
            pending: 0,
            reviewing: 0,
            completed: 0,
            dismissed: 0,
            alertReady: 0,
            alertWatch: 0,
            alertIncomplete: 0,
            audit: emptyCRMTaskAuditSummary,
            readiness: emptyCRMTaskReadiness,
            tasks: [],
        };
    }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const options = parseArgs(process.argv.slice(2));
    if (options) {
        runCRMTasks(options)
            .then((summary) => {
            if (!summary.success)
                process.exitCode = 1;
        })
            .catch((error) => {
            console.error('REIE CRM task worker crashed:', error instanceof Error ? error.message : error);
            process.exitCode = 1;
        })
            .finally(async () => {
            await prisma.$disconnect();
        });
    }
    else {
        prisma.$disconnect().catch((error) => {
            console.error('REIE CRM task worker disconnect failed:', error instanceof Error ? error.message : error);
        });
    }
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/workers/runCRMTasks.ts
