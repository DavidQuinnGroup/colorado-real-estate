import { type AlertJobData, enqueueAlertJob } from './alertQueue.js';

export type EnqueueAlertOptions = Omit<AlertJobData, 'alertId'>;

export async function enqueueAlert(alertId: string, options: EnqueueAlertOptions = {}) {
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
