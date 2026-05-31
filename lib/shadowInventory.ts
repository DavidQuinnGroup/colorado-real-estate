import crypto, { randomUUID } from "crypto";

import { prisma } from "@/lib/prisma";

export type PrivateListingSource = {
  id: string;
  lat: number;
  lng: number;
  neighborhood?: string | null;
};

export type MaskedPrivateListing = {
  id: string;
  lat: number;
  lng: number;
  neighborhood: string;
  isPrivateExclusive: true;
  address: string;
  price: null;
  details: string;
};

export type ShadowInventoryInput = {
  id?: string;
  mlsId?: string;
  slug?: string;
  address: string;
  city: string;
  state?: string;
  zip?: string;
  price?: number;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  lotSize?: number | null;
  yearBuilt?: number | null;
  propertyType?: string;
  status?: string;
  lat: number;
  lng: number;
  neighborhood?: string | null;
  subdivision?: string | null;
  schoolDistrict?: string | null;
  description?: string | null;
  listingAgent?: string | null;
  listingOffice?: string | null;
  optimizedValue?: number | null;
  efficiencyScore?: number;
  resilienceScore?: number;
  altitude?: number;
  soilType?: string;
  hasPolybutyleneRisk?: boolean;
};

function normalizeText(value: string, fallback: string) {
  const normalized = value.trim();
  return normalized || fallback;
}

function toSlugSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildShadowMlsId(listingData: ShadowInventoryInput) {
  return listingData.mlsId?.trim() || `shadow-${listingData.id || randomUUID()}`;
}

function buildShadowSlug(listingData: ShadowInventoryInput, mlsId: string) {
  if (listingData.slug?.trim()) {
    return toSlugSegment(listingData.slug);
  }

  const addressSlug = toSlugSegment(listingData.address) || "private-exclusive";
  const citySlug = toSlugSegment(listingData.city) || "colorado";
  const idSlug = toSlugSegment(mlsId);

  return `${addressSlug}-${citySlug}-${idSlug}`;
}

function getNeighborhoodLabel(neighborhood: string | null | undefined) {
  return normalizeText(neighborhood || "", "selected Colorado market");
}

/**
 * Strips precise private-exclusive details for the public ghost-pin view.
 */
export function maskPrivateListing(listing: PrivateListingSource): MaskedPrivateListing {
  const neighborhood = getNeighborhoodLabel(listing.neighborhood);

  return {
    id: listing.id,
    lat: listing.lat,
    lng: listing.lng,
    neighborhood,
    isPrivateExclusive: true,
    address: `Luxury listing near ${neighborhood}`,
    price: null,
    details: "Reserved for DQG contracted clients",
  };
}

/**
 * Generates a client-specific temporary vault route for contracted clients.
 */
export function generateSecureVaultLink(clientId: string, listingId: string) {
  const secret = process.env.VAULT_ENCRYPTION_KEY || "dqg-authority-secret";
  const issuedAt = Date.now().toString();
  const token = crypto
    .createHmac("sha256", secret)
    .update(`${clientId}:${listingId}:${issuedAt}`)
    .digest("hex");

  const params = new URLSearchParams({
    issuedAt,
    listing: listingId,
    token,
  });

  return `/vault/access?${params.toString()}`;
}

/**
 * Ingests a validated private-exclusive listing into the REIE property table.
 */
export async function upsertShadowInventory(listingData: ShadowInventoryInput) {
  const mlsId = buildShadowMlsId(listingData);
  const slug = buildShadowSlug(listingData, mlsId);

  try {
    return await prisma.property.upsert({
      where: { mlsId },
      create: {
        id: listingData.id,
        mlsId,
        slug,
        address: normalizeText(listingData.address, "Private Exclusive"),
        city: normalizeText(listingData.city, "Colorado"),
        state: normalizeText(listingData.state || "", "CO"),
        zip: normalizeText(listingData.zip || "", "00000"),
        price: listingData.price ?? 0,
        beds: listingData.beds ?? null,
        baths: listingData.baths ?? null,
        sqft: listingData.sqft ?? null,
        lotSize: listingData.lotSize ?? null,
        yearBuilt: listingData.yearBuilt ?? null,
        propertyType: normalizeText(listingData.propertyType || "", "Residential"),
        status: normalizeText(listingData.status || "", "Private Exclusive"),
        lat: listingData.lat,
        lng: listingData.lng,
        neighborhood: listingData.neighborhood ?? null,
        subdivision: listingData.subdivision ?? null,
        schoolDistrict: listingData.schoolDistrict ?? null,
        description: listingData.description ?? null,
        listingAgent: listingData.listingAgent ?? "David Quinn Group",
        listingOffice: listingData.listingOffice ?? "Compass",
        isPrivateExclusive: true,
        gcForensics: {
          source: "Compass Private Exclusive",
          ingestionMethod: "Secure Proxy",
        },
        optimizedValue: listingData.optimizedValue ?? null,
        efficiencyScore: listingData.efficiencyScore ?? 0,
        resilienceScore: listingData.resilienceScore ?? 85,
        altitude: listingData.altitude ?? 5280,
        soilType: listingData.soilType ?? "Front Range Mixed",
        hasPolybutyleneRisk: listingData.hasPolybutyleneRisk ?? false,
        lastIntelligenceSync: new Date(),
      },
      update: {
        slug,
        address: normalizeText(listingData.address, "Private Exclusive"),
        city: normalizeText(listingData.city, "Colorado"),
        state: normalizeText(listingData.state || "", "CO"),
        zip: normalizeText(listingData.zip || "", "00000"),
        price: listingData.price ?? 0,
        beds: listingData.beds ?? null,
        baths: listingData.baths ?? null,
        sqft: listingData.sqft ?? null,
        lotSize: listingData.lotSize ?? null,
        yearBuilt: listingData.yearBuilt ?? null,
        propertyType: normalizeText(listingData.propertyType || "", "Residential"),
        status: normalizeText(listingData.status || "", "Private Exclusive"),
        lat: listingData.lat,
        lng: listingData.lng,
        neighborhood: listingData.neighborhood ?? null,
        subdivision: listingData.subdivision ?? null,
        schoolDistrict: listingData.schoolDistrict ?? null,
        description: listingData.description ?? null,
        listingAgent: listingData.listingAgent ?? "David Quinn Group",
        listingOffice: listingData.listingOffice ?? "Compass",
        isPrivateExclusive: true,
        gcForensics: {
          source: "Compass Private Exclusive",
          ingestionMethod: "Secure Proxy",
        },
        optimizedValue: listingData.optimizedValue ?? null,
        efficiencyScore: listingData.efficiencyScore ?? 0,
        resilienceScore: listingData.resilienceScore ?? 85,
        altitude: listingData.altitude ?? 5280,
        soilType: listingData.soilType ?? "Front Range Mixed",
        hasPolybutyleneRisk: listingData.hasPolybutyleneRisk ?? false,
        lastIntelligenceSync: new Date(),
      },
    });
  } catch (error) {
    console.error("[SHADOW SYNC] Ingestion failure:", error);
    return null;
  }
}

/**
 * Validates whether a user's current access tier can view shadow inventory.
 */
export async function validateShadowAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      hasPrivateAccess: true,
      status: true,
    },
  });

  return user?.status === "Contracted" && user.hasPrivateAccess;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/shadowInventory.ts
