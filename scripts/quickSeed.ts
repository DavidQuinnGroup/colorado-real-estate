import dotenv from 'dotenv';

import { prisma } from '../lib/prisma.js';
import { assertDatabaseReady } from '../lib/queue/databasePreflight.js';
import { indexListing } from '../lib/typesense/indexListing.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

type SeedPhoto = {
  url: string;
  order: number;
};

type SeedProperty = {
  mlsId: string;
  slug: string;
  address: string;
  city: string;
  zip: string;
  state: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lat: number;
  lng: number;
  propertyType: string;
  status: string;
  neighborhood: string;
  description: string;
  listingAgent?: string;
  listingOffice?: string;
  isPrivateExclusive?: boolean;
  efficiencyScore?: number;
  resilienceScore?: number;
  altitude?: number;
  soilType?: string;
  roofType?: string;
  hasPolybutyleneRisk?: boolean;
};

type SeedListing = {
  property: SeedProperty;
  photos: SeedPhoto[];
};

type SeedSummary = {
  database: number;
  photos: number;
  indexed: number;
  failedIndex: number;
};

const args = new Set(process.argv.slice(2));
const allowedArgs = new Set(['--help', '--dry-run', '--skip-index']);

const seedListings: SeedListing[] = [
  {
    property: {
      mlsId: 'IRES-1244-MAPLE',
      slug: '1244-mapleton-ave',
      address: '1244 Mapleton Ave',
      city: 'Boulder',
      zip: '80304',
      state: 'CO',
      price: 4250000,
      beds: 5,
      baths: 4,
      sqft: 4800,
      lat: 40.0211,
      lng: -105.2811,
      propertyType: 'Single Family',
      status: 'Active',
      neighborhood: 'Mapleton Hill',
      description: 'Historic Mapleton Hill estate used for local REIE zero-state testing.',
      listingAgent: 'David Quinn',
      listingOffice: 'David Quinn Group',
      efficiencyScore: 72,
      resilienceScore: 88,
      altitude: 5430,
      soilType: 'Boulder Foothills Mixed',
      roofType: 'Architectural Shingle',
      hasPolybutyleneRisk: false,
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=90',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=90',
        order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90',
        order: 2,
      },
    ],
  },
  {
    property: {
      mlsId: 'SHADOW-001',
      slug: 'foothills-modern-private',
      address: 'PRIVATE EXCLUSIVE: Foothills Modern',
      city: 'Boulder',
      zip: '80304',
      state: 'CO',
      price: 6800000,
      beds: 6,
      baths: 7,
      sqft: 7200,
      lat: 40.0422,
      lng: -105.2855,
      propertyType: 'Estate',
      status: 'Active',
      neighborhood: 'North Boulder',
      description: 'Private exclusive architectural seed listing for REIE shadow inventory testing.',
      listingAgent: 'David Quinn',
      listingOffice: 'David Quinn Group Private Client Advisory',
      isPrivateExclusive: true,
      efficiencyScore: 84,
      resilienceScore: 91,
      altitude: 5580,
      soilType: 'Foothills Rock And Clay',
      roofType: 'Standing Seam Metal',
      hasPolybutyleneRisk: false,
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1800&q=90',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1800&q=90',
        order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1800&q=90',
        order: 2,
      },
    ],
  },
];

function printUsage() {
  console.log(`REIE quick seed

Usage:
  node dist/scripts/quickSeed.js [options]

Options:
  --dry-run      Print the seed plan without writing database rows or Typesense documents.
  --skip-index   Upsert database rows and photos without updating Typesense.
  --help         Show this help text.

Recommended terminal:
  Terminal 5: npm run worker:build
  Terminal 5: node dist/scripts/quickSeed.js`);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function validateArgs() {
  const unknownArgs = [...args].filter((arg) => !allowedArgs.has(arg));
  if (!unknownArgs.length) return;

  throw new Error(`Unknown quick seed option(s): ${unknownArgs.join(', ')}. Run with --help for usage.`);
}

function printDryRun() {
  console.log('REIE quick seed dry run.');
  for (const listing of seedListings) {
    console.log(
      `${listing.property.mlsId}: ${listing.property.address}, ${listing.property.city}, ${listing.property.state} ` +
        `at ${listing.property.price} with ${listing.photos.length} photo(s).`,
    );
  }
}

async function replacePhotos(propertyId: string, photos: SeedPhoto[]) {
  await prisma.propertyPhoto.deleteMany({
    where: {
      propertyId,
    },
  });

  if (!photos.length) return 0;

  await prisma.propertyPhoto.createMany({
    data: photos.map((photo) => ({
      propertyId,
      url: photo.url,
      order: photo.order,
    })),
  });

  return photos.length;
}

async function seedListing(listing: SeedListing, skipIndex: boolean) {
  const savedProperty = await prisma.property.upsert({
    where: {
      mlsId: listing.property.mlsId,
    },
    update: listing.property,
    create: listing.property,
  });
  const photoCount = await replacePhotos(savedProperty.id, listing.photos);

  if (skipIndex) {
    console.log(`Seeded ${savedProperty.mlsId}: database=ok, photos=${photoCount}, index=skipped.`);
    return {
      photoCount,
      indexed: false,
      failedIndex: false,
    };
  }

  const indexResult = await indexListing(savedProperty);
  const indexed = indexResult.collections.properties && indexResult.collections.listings;
  const indexStatus = indexed ? 'ok' : `failed (${indexResult.error || 'unknown Typesense error'})`;

  console.log(`Seeded ${savedProperty.mlsId}: database=ok, photos=${photoCount}, index=${indexStatus}.`);

  return {
    photoCount,
    indexed,
    failedIndex: !indexed,
  };
}

async function main() {
  validateArgs();

  if (args.has('--help')) {
    printUsage();
    return;
  }

  if (args.has('--dry-run')) {
    printDryRun();
    return;
  }

  const skipIndex = args.has('--skip-index');
  await assertDatabaseReady({
    operation: 'quick authority seed',
    recoveryCommand: 'npm run supabase:check',
  });

  const summary: SeedSummary = {
    database: 0,
    photos: 0,
    indexed: 0,
    failedIndex: 0,
  };

  console.log('Initializing bounded REIE authority seed.');

  for (const listing of seedListings) {
    const result = await seedListing(listing, skipIndex);
    summary.database += 1;
    summary.photos += result.photoCount;
    summary.indexed += result.indexed ? 1 : 0;
    summary.failedIndex += result.failedIndex ? 1 : 0;
  }

  console.log(
    `REIE authority seed complete: database=${summary.database}, photos=${summary.photos}, ` +
      `indexed=${summary.indexed}, failedIndex=${summary.failedIndex}.`,
  );

  if (summary.failedIndex > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error('REIE authority seed failed:', errorMessage(error));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/quickSeed.ts
