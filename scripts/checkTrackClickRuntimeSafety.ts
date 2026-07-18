import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { trackClick } from '../lib/tracking/store.js';

const USER_ID = 'synthetic-click-user';
const LISTING_ID = 'synthetic-listing-id';
const DESTINATION = 'https://davidquinngroup.com/properties/synthetic-listing';
const CLICKED_AT_PATTERN = /^\d{4}-\d{2}-\d{2}T/;

type SyntheticAlert = {
  id: string;
  userId: string;
  status: string;
  clickedAt: string | null;
  createdAt: string;
  payload: Record<string, unknown>;
};

type QueryState = {
  table: string;
  operation: 'select' | 'update' | 'insert' | null;
  updateValues: Record<string, unknown> | null;
  filters: Record<string, unknown>;
};

function createAlerts() {
  const alerts: SyntheticAlert[] = [];

  for (let index = 0; index < 150; index++) {
    alerts.push({
      id: `alert-${index}`,
      userId: USER_ID,
      status: 'sent',
      clickedAt: null,
      createdAt: new Date(Date.UTC(2026, 6, 18, 12, index)).toISOString(),
      payload: {
        propertyId: index === 149 ? LISTING_ID : `other-listing-${index}`,
      },
    });
  }

  return alerts;
}

function createSyntheticStores() {
  const state = {
    user: {
      id: USER_ID,
      isUnsubscribed: false,
      heatScore: 15,
    },
    alerts: createAlerts(),
    interactions: [] as Array<Record<string, unknown>>,
  };

  const prismaClient = {
    user: {
      findUnique: async () => ({
        id: state.user.id,
        isUnsubscribed: state.user.isUnsubscribed,
      }),
      update: async () => {
        state.user.heatScore += 5;
        return state.user;
      },
    },
    userInteraction: {
      create: async (args: unknown) => {
        const data = (args as { data: Record<string, unknown> }).data;
        state.interactions.push(data);
        return data;
      },
    },
    alertQueue: {
      updateMany: async () => ({ count: 0 }),
    },
    $transaction: async (actions: Promise<unknown>[]) => Promise.all(actions),
  };

  class SyntheticQuery {
    private readonly query: QueryState;

    constructor(table: string) {
      this.query = {
        table,
        operation: null,
        updateValues: null,
        filters: {},
      };
    }

    select() {
      this.query.operation = 'select';
      return this;
    }

    update(values: Record<string, unknown>) {
      this.query.operation = 'update';
      this.query.updateValues = values;
      return this;
    }

    eq(key: string, value: unknown) {
      this.query.filters[key] = value;
      if (this.query.operation === 'update') return this.executeUpdate();
      return this;
    }

    is(key: string, value: unknown) {
      this.query.filters[key] = value;
      return this;
    }

    in(key: string, values: unknown[]) {
      this.query.filters[key] = values;
      if (this.query.operation === 'update') return this.executeUpdate();
      return this;
    }

    order() {
      return this;
    }

    range(from: number, to: number) {
      const userId = String(this.query.filters.userId);
      const statuses = this.query.filters.status as string[];
      const rows = state.alerts
        .filter((alert) => alert.userId === userId)
        .filter((alert) => alert.clickedAt === null)
        .filter((alert) => statuses.includes(alert.status))
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .slice(from, to + 1)
        .map((alert) => ({
          id: alert.id,
          payload: alert.payload,
        }));

      return Promise.resolve({
        data: rows,
        error: null,
      });
    }

    maybeSingle() {
      if (this.query.table !== 'User') {
        return Promise.resolve({ data: null, error: null });
      }

      return Promise.resolve({
        data: {
          id: state.user.id,
          isUnsubscribed: state.user.isUnsubscribed,
          heatScore: state.user.heatScore,
        },
        error: null,
      });
    }

    insert(values: Record<string, unknown>) {
      state.interactions.push(values);
      return Promise.resolve({ error: null });
    }

    private executeUpdate() {
      if (this.query.table === 'AlertQueue') {
        const ids = this.query.filters.id as string[];
        for (const alert of state.alerts) {
          if (ids.includes(alert.id)) {
            alert.clickedAt = String(this.query.updateValues?.clickedAt || '');
          }
        }
      }

      if (this.query.table === 'User') {
        state.user.heatScore = Number(this.query.updateValues?.heatScore);
      }

      return Promise.resolve({ error: null });
    }
  }

  const supabaseClient = {
    from: (table: string) => new SyntheticQuery(table),
  };

  return {
    state,
    prismaClient,
    supabaseClient,
  };
}

async function assertSourceGuards() {
  const store = await readFile('lib/tracking/store.ts', 'utf8');

  assert(store.includes('.range(from, to)'), 'Expected Supabase fallback to page through all bounded candidates.');
  assert(
    store.includes('No unclicked alert matched the tracked listing.'),
    'Expected repeated synthetic requests to avoid duplicate enrichment when no unclicked alert remains.',
  );
}

async function main() {
  await assertSourceGuards();

  const stores = createSyntheticStores();
  const selected = stores.state.alerts[149];

  assert.equal(selected.clickedAt, null, 'Expected synthetic selected alert to start unclicked.');

  const first = await trackClick(USER_ID, LISTING_ID, 'email_alert', DESTINATION, {
    prismaClient: stores.prismaClient,
    supabaseClient: stores.supabaseClient as never,
    supabaseAlertPageSize: 100,
    supabaseAlertMaxPages: 2,
  });

  assert.equal(first.tracked, true, 'Expected first synthetic request to track.');
  assert.match(selected.clickedAt || '', CLICKED_AT_PATTERN, 'Expected synthetic selected alert clickedAt timestamp.');
  assert.equal(stores.state.interactions.length, 1, 'Expected exactly one synthetic interaction after first request.');
  assert.equal(stores.state.user.heatScore, 20, 'Expected synthetic heat score to increase exactly once.');

  const clickedAt = selected.clickedAt;
  const second = await trackClick(USER_ID, LISTING_ID, 'email_alert', DESTINATION, {
    prismaClient: stores.prismaClient,
    supabaseClient: stores.supabaseClient as never,
    supabaseAlertPageSize: 100,
    supabaseAlertMaxPages: 2,
  });

  assert.equal(second.tracked, false, 'Expected repeated synthetic request to skip duplicate tracking.');
  assert.equal(selected.clickedAt, clickedAt, 'Expected repeated synthetic request to preserve clickedAt.');
  assert.equal(stores.state.interactions.length, 1, 'Expected no duplicate synthetic interaction.');
  assert.equal(stores.state.user.heatScore, 20, 'Expected no duplicate synthetic heat-score change.');

  console.log('[track-click-runtime-safety] ok: paginated clickedAt persistence and synthetic idempotency passed.');
}

main().catch((error) => {
  console.error('[track-click-runtime-safety] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkTrackClickRuntimeSafety.ts
