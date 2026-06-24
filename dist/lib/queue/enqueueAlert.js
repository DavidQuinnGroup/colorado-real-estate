import { enqueueAlertJob, getAlertQueuePlan } from './alertQueue.js';
function getNormalizedAlertId(alertId) {
    const normalizedAlertId = alertId.trim();
    if (!normalizedAlertId) {
        throw new Error('alertId is required to enqueue a saved-search alert.');
    }
    return normalizedAlertId;
}
export function getEnqueueAlertPlan(alertId, options = {}) {
    const normalizedAlertId = getNormalizedAlertId(alertId);
    const plan = getAlertQueuePlan(normalizedAlertId, {
        requestedAt: options.requestedAt,
        requestedBy: options.requestedBy,
        source: options.source ?? 'matching',
    }, 'matching');
    return {
        ...plan,
        wrapper: {
            module: 'enqueueAlert',
            defaultSource: 'matching',
            validatedAlertId: normalizedAlertId,
        },
    };
}
export async function enqueueAlert(alertId, options = {}) {
    const plan = getEnqueueAlertPlan(alertId, options);
    return enqueueAlertJob(plan.data.alertId || plan.wrapper.validatedAlertId, {
        requestedAt: options.requestedAt,
        requestedBy: options.requestedBy,
        source: options.source ?? 'matching',
    });
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/enqueueAlert.ts
