import { enqueueAlertJob } from './alertQueue.js';
export async function enqueueAlert(alertId, options = {}) {
    const normalizedAlertId = alertId.trim();
    if (!normalizedAlertId) {
        throw new Error('alertId is required to enqueue a saved-search alert.');
    }
    return enqueueAlertJob(normalizedAlertId, {
        requestedAt: options.requestedAt,
        requestedBy: options.requestedBy,
        source: options.source ?? 'matching',
    });
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/enqueueAlert.ts
