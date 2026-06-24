import { type AlertJobData, type AlertQueuePlan, enqueueAlertJob, getAlertQueuePlan } from './alertQueue.js';

export type EnqueueAlertOptions = Omit<AlertJobData, 'alertId'>;

export type EnqueueAlertPlan = AlertQueuePlan & {
  wrapper: {
    module: 'enqueueAlert';
    defaultSource: 'matching';
    validatedAlertId: string;
  };
};

function getNormalizedAlertId(alertId: string) {
  const normalizedAlertId = alertId.trim();

  if (!normalizedAlertId) {
    throw new Error('alertId is required to enqueue a saved-search alert.');
  }

  return normalizedAlertId;
}

export function getEnqueueAlertPlan(alertId: string, options: EnqueueAlertOptions = {}): EnqueueAlertPlan {
  const normalizedAlertId = getNormalizedAlertId(alertId);
  const plan = getAlertQueuePlan(
    normalizedAlertId,
    {
      requestedAt: options.requestedAt,
      requestedBy: options.requestedBy,
      source: options.source ?? 'matching',
    },
    'matching',
  );

  return {
    ...plan,
    wrapper: {
      module: 'enqueueAlert',
      defaultSource: 'matching',
      validatedAlertId: normalizedAlertId,
    },
  };
}

export async function enqueueAlert(alertId: string, options: EnqueueAlertOptions = {}) {
  const plan = getEnqueueAlertPlan(alertId, options);

  return enqueueAlertJob(plan.data.alertId || plan.wrapper.validatedAlertId, {
    requestedAt: options.requestedAt,
    requestedBy: options.requestedBy,
    source: options.source ?? 'matching',
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/enqueueAlert.ts
