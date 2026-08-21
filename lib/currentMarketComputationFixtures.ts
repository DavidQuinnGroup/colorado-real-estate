import type { CurrentMarketComputationInput } from './currentMarketComputation';
import { CURRENT_MARKET_SOURCE_SET_COMPLETION_FIXTURE } from './currentMarketSourceSetCurrentnessFixtures';

export const CURRENT_MARKET_COMPUTATION_FIXTURE: CurrentMarketComputationInput = Object.freeze({
  sourceSet: CURRENT_MARKET_SOURCE_SET_COMPLETION_FIXTURE,
  computedAt: '2026-08-21T12:00:00.000Z',
  minimumVerifiedSampleSize: 2,
  listings: Object.freeze([
    { mlsId: 'B-001', status: 'Active', city: 'Boulder', zip: '80302', propertyType: 'Single Family', listPrice: 1_000_000, sqft: 2_000, sourceModifiedAt: '2026-08-21T10:00:00.000Z' },
    { mlsId: 'B-002', status: 'Active', city: 'boulder', zip: '80302-1234', propertyType: 'Condo', listPrice: 750_000, sqft: 1_000, sourceModifiedAt: '2026-08-21T09:00:00.000Z' },
    { mlsId: 'B-003', status: 'Pending', city: 'Boulder', zip: '80302', propertyType: 'Townhome', listPrice: 800_000, sqft: 1_600, sourceModifiedAt: '2026-08-21T09:30:00.000Z' },
    { mlsId: 'B-004', status: 'Active', city: 'Boulder', zip: '80302', propertyType: 'Residential', listPrice: 900_000, sqft: null, sourceModifiedAt: '2026-08-21T08:00:00.000Z' },
    { mlsId: 'B-DUP', status: 'Active', city: 'Boulder', zip: '80302', propertyType: 'Single Family', listPrice: 1_100_000, sqft: 2_100, sourceModifiedAt: '2026-08-21T09:00:00.000Z' },
    { mlsId: 'B-DUP', status: 'Active', city: 'Boulder', zip: '80302', propertyType: 'Single Family', listPrice: 1_100_000, sqft: 2_100, sourceModifiedAt: '2026-08-21T09:00:00.000Z' },
    { mlsId: 'L-001', status: 'Active', city: 'Louisville', zip: '80027', propertyType: 'Detached', listPrice: 950_000, sqft: 1_900, sourceModifiedAt: '2026-08-21T10:30:00.000Z' },
    { mlsId: 'X-001', status: 'Active', city: 'Denver', zip: '80202', propertyType: 'Condo', listPrice: 700_000, sqft: 900, sourceModifiedAt: '2026-08-21T10:00:00.000Z' },
    { mlsId: 'X-002', status: 'Mystery', city: 'Boulder', zip: '80302', propertyType: 'Condo', listPrice: 700_000, sqft: 900, sourceModifiedAt: '2026-08-21T10:00:00.000Z' },
    { mlsId: 'X-003', status: 'Active Under Contract', city: 'Boulder', zip: '80302', propertyType: 'Residential', listPrice: 700_000, sqft: 900, sourceModifiedAt: null },
    { mlsId: 'X-004', status: 'Closed', city: 'Boulder', zip: '80302', propertyType: 'Condo', listPrice: 700_000, sqft: 900, sourceModifiedAt: '2026-08-15T10:00:00.000Z' },
  ]),
});
