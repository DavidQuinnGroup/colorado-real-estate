import {
  buildInternalSynchronizedPropertyMarketComputationInput,
  readInternalSynchronizedPropertyMarketRecords,
} from '../lib/internalSynchronizedPropertyMarketReadAdapter';
import { CURRENT_MARKET_SUPPORTED_CITIES, computeCurrentMarketAggregates } from '../lib/currentMarketComputation';

const read = await readInternalSynchronizedPropertyMarketRecords();

console.log(JSON.stringify({
  status: 'REIE_CURRENT_MARKET_SOURCE_SET_COMPLETION_REQUIRED',
  sourceSetId: read.sourceSetId,
  recordsConsidered: read.records.length,
  reason: 'A current Market computation requires a same-run certified source-set completion record; historical MlsSyncState values are insufficient.',
  providerActivity: false,
  databaseMutation: false,
  rawListingOutput: false,
}, null, 2));
