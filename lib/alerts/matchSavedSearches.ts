import { prisma } from '@/lib/prisma';

type ListingForSearchMatch = {
  city?: string | null;
  price?: number | null;
  beds?: number | null;
  propertyType?: string | null;
  lat?: number | null;
  lng?: number | null;
};

function normalize(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

function hasBounds(search: { north: number | null; south: number | null; east: number | null; west: number | null }) {
  return search.north !== null && search.south !== null && search.east !== null && search.west !== null;
}

function matchesBounds(
  search: { north: number | null; south: number | null; east: number | null; west: number | null },
  listing: ListingForSearchMatch,
) {
  if (!hasBounds(search)) return true;
  if (listing.lat === null || listing.lng === null || listing.lat === undefined || listing.lng === undefined) return false;

  return listing.lat <= search.north! && listing.lat >= search.south! && listing.lng <= search.east! && listing.lng >= search.west!;
}

export async function matchSavedSearches(listing: ListingForSearchMatch) {
  const searches = await prisma.savedSearch.findMany({
    where: {
      isActive: true,
    },
    include: {
      user: true,
    },
  });

  return searches.filter((search) => {
    if (normalize(search.city) !== normalize(listing.city)) return false;
    if (search.minPrice && Number(listing.price || 0) < search.minPrice) return false;
    if (search.beds && Number(listing.beds || 0) < search.beds) return false;
    if (search.type && normalize(listing.propertyType) !== normalize(search.type)) return false;

    return matchesBounds(search, listing);
  });
}

// lib/alerts/matchSavedSearches.ts
