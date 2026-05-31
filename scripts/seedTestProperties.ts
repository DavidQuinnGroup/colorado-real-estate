import dotenv from 'dotenv';

import { prisma } from '../lib/prisma.js';
import { indexListing } from '../lib/typesense/indexListing.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

type TestPhoto = {
  url: string;
  order: number;
};

type TestProperty = {
  id: string;
  mlsId: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  price: number;
  lat: number;
  lng: number;
  status: string;
  propertyType: string;
  neighborhood: string;
  subdivision?: string;
  schoolDistrict?: string;
  description: string;
  listingAgent: string;
  listingOffice: string;
  efficiencyScore: number;
  resilienceScore: number;
  altitude: number;
  soilType: string;
  roofType?: string;
  hasPolybutyleneRisk: boolean;
};

type TestListing = {
  property: TestProperty;
  photos: TestPhoto[];
};

type SeedSummary = {
  database: number;
  photos: number;
  indexed: number;
  failedIndex: number;
};

const args = new Set(process.argv.slice(2));
const allowedArgs = new Set(['--help', '--dry-run', '--skip-index']);

const testListings: TestListing[] = [
  {
    property: {
      id: 'TEST-BOULDER-1',
      mlsId: 'MLS-TEST-1001',
      slug: '123-pearl-st-boulder-co',
      address: '123 Pearl St',
      city: 'Boulder',
      state: 'CO',
      zip: '80302',
      beds: 3,
      baths: 2,
      sqft: 2140,
      price: 925000,
      lat: 40.0189,
      lng: -105.2765,
      status: 'Active',
      propertyType: 'Single Family',
      neighborhood: 'Downtown Boulder',
      subdivision: 'Boulder O T East & West & North',
      schoolDistrict: 'Boulder Valley RE 2',
      description: 'Downtown Boulder test listing used to verify map selection, sidebar imagery, and search indexing.',
      listingAgent: 'David Quinn',
      listingOffice: 'David Quinn Group',
      efficiencyScore: 70,
      resilienceScore: 84,
      altitude: 5328,
      soilType: 'Urban Boulder Mixed',
      roofType: 'Composition',
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
      id: 'TEST-BOULDER-2',
      mlsId: 'MLS-TEST-1002',
      slug: '456-main-st-louisville-co',
      address: '456 Main St',
      city: 'Louisville',
      state: 'CO',
      zip: '80027',
      beds: 4,
      baths: 3,
      sqft: 2860,
      price: 1150000,
      lat: 39.9778,
      lng: -105.1319,
      status: 'Active',
      propertyType: 'Single Family',
      neighborhood: 'Old Town Louisville',
      subdivision: 'Louisville Old Town',
      schoolDistrict: 'Boulder Valley RE 2',
      description: 'Old Town Louisville test listing used to verify market links and city-level inventory behavior.',
      listingAgent: 'David Quinn',
      listingOffice: 'David Quinn Group',
      efficiencyScore: 76,
      resilienceScore: 86,
      altitude: 5335,
      soilType: 'Louisville Clay Loam',
      roofType: 'Architectural Shingle',
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
  {
    property: {
      id: 'TEST-BOULDER-3',
      mlsId: 'MLS-TEST-1003',
      slug: '789-pine-st-boulder-co',
      address: '789 Pine St',
      city: 'Boulder',
      state: 'CO',
      zip: '80302',
      beds: 2,
      baths: 2,
      sqft: 1380,
      price: 720000,
      lat: 40.0212,
      lng: -105.284,
      status: 'Active',
      propertyType: 'Condo',
      neighborhood: 'Mapleton Hill',
      subdivision: 'Mapleton',
      schoolDistrict: 'Boulder Valley RE 2',
      description: 'Mapleton Hill condo test listing used to verify smaller-property display and search filtering.',
      listingAgent: 'David Quinn',
      listingOffice: 'David Quinn Group',
      efficiencyScore: 68,
      resilienceScore: 82,
      altitude: 5360,
      soilType: 'Boulder Urban Fill',
      roofType: 'Membrane',
      hasPolybutyleneRisk: false,
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1800&q=90',
        order: 0,
      },
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=90',
        order: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=90',
        order: 2,
      },
    ],
  },
];

function printUsage() {
  console.log(`REIE test property seed

Usage:
  node dist/scripts/seedTestProperties.js [options]

Options:
  --dry-run      Print the seed plan without writing database rows or Typesense documents.
  --skip-index   Upsert database rows and photos without updating Typesense.
  --help         Show this help text.

Recommended terminal:
  Terminal 5: npm run worker:build
  Terminal 5: node dist/scripts/seedTestProperties.js`);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function validateArgs() {
  const unknownArgs = [...args].filter((arg) => !allowedArgs.has(arg));
  if (!unknownArgs.length) return;

  throw new Error(`Unknown test seed option(s): ${unknownArgs.join(', ')}. Run with --help for usage.`);
}

function printDryRun() {
  console.log('REIE test property seed dry run.');
  for (const listing of testListings) {
    console.log(
      `${listing.property.mlsId}: ${listing.property.address}, ${listing.property.city}, ${listing.property.state} ` +
        `at ${listing.property.price} with ${listing.photos.length} photo(s).`,
    );
  }
}

function getUpdateData(property: TestProperty) {
  const { id: _id, ...updateData } = property;
  return updateData;
}

async function replacePhotos(propertyId: string, photos: TestPhoto[]) {
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

async function seedListing(listing: TestListing, skipIndex: boolean) {
  const savedProperty = await prisma.property.upsert({
    where: {
      mlsId: listing.property.mlsId,
    },
    update: getUpdateData(listing.property),
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
  const summary: SeedSummary = {
    database: 0,
    photos: 0,
    indexed: 0,
    failedIndex: 0,
  };

  console.log('Seeding bounded REIE test properties.');

  for (const listing of testListings) {
    const result = await seedListing(listing, skipIndex);
    summary.database += 1;
    summary.photos += result.photoCount;
    summary.indexed += result.indexed ? 1 : 0;
    summary.failedIndex += result.failedIndex ? 1 : 0;
  }

  console.log(
    `REIE test property seed complete: database=${summary.database}, photos=${summary.photos}, ` +
      `indexed=${summary.indexed}, failedIndex=${summary.failedIndex}.`,
  );

  if (summary.failedIndex > 0) {
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error('Test property seed failed:', errorMessage(error));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/seedTestProperties.ts
