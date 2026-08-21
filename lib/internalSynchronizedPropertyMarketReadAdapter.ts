import { prisma } from './prisma';
import {
  CURRENT_MARKET_SUPPORTED_CITIES,
  type CurrentMarketComputationInput,
  type CurrentMarketListingInput,
} from './currentMarketComputation';
import type { CurrentMarketSourceSetCompletion } from './currentMarketSourceSetCurrentness';

export const REIE_INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_ADAPTER_STATUS = 'REIE_INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_ADAPTER_CURRENTNESS_CERTIFIED' as const;
export const REIE_SYNCHRONIZED_PROPERTY_MARKET_SOURCE_SET = 'REIE_SYNCHRONIZED_PROPERTY_MARKET_READ_V2' as const;
export const REIE_CURRENT_MARKET_MINIMUM_VERIFIED_SAMPLE_SIZE = 5;

export const INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_PROJECTION = Object.freeze({
  mlsId: true,
  city: true,
  zip: true,
  status: true,
  price: true,
  sqft: true,
  propertyType: true,
  sourceModifiedAt: true,
});

export type InternalSynchronizedPropertyMarketRead = Readonly<{
  sourceSetId: typeof REIE_SYNCHRONIZED_PROPERTY_MARKET_SOURCE_SET;
  records: readonly CurrentMarketListingInput[];
}>;

export async function readInternalSynchronizedPropertyMarketRecords(): Promise<InternalSynchronizedPropertyMarketRead> {
  const rows = await prisma.property.findMany({
    where: {
      OR: CURRENT_MARKET_SUPPORTED_CITIES.map((city) => ({ city: { equals: city, mode: 'insensitive' as const } })),
    },
    select: INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_PROJECTION,
    orderBy: { mlsId: 'asc' },
  });
  return Object.freeze({
    sourceSetId: REIE_SYNCHRONIZED_PROPERTY_MARKET_SOURCE_SET,
    records: Object.freeze(rows.map((row) => Object.freeze({
      mlsId: row.mlsId,
      city: row.city,
      zip: row.zip,
      status: row.status,
      listPrice: row.price,
      sqft: row.sqft,
      propertyType: row.propertyType,
      sourceModifiedAt: row.sourceModifiedAt,
    }))),
  });
}

export function buildInternalSynchronizedPropertyMarketComputationInput(
  read: InternalSynchronizedPropertyMarketRead,
  sourceSet: CurrentMarketSourceSetCompletion,
  computedAt: Date,
): CurrentMarketComputationInput {
  if (sourceSet.sourceSetId !== read.sourceSetId) throw new Error('Current Market source-set completion does not match the synchronized read source set.');
  return Object.freeze({
    sourceSet,
    computedAt,
    minimumVerifiedSampleSize: REIE_CURRENT_MARKET_MINIMUM_VERIFIED_SAMPLE_SIZE,
    listings: read.records,
  });
}

export const INTERNAL_SYNCHRONIZED_PROPERTY_MARKET_READ_PROTECTED_BOUNDARIES = Object.freeze({
  providerActivity: false,
  databaseMutation: false,
  customerData: false,
  customerJoin: false,
  persistence: false,
  publicExposure: false,
  historicalComputation: false,
});
