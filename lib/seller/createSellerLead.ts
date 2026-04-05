import { prisma } from "@/lib/prisma";

type CreateSellerLeadInput = {
  propertyId: string;
  city: string;
  beds?: number | null;
  price?: number | null;
  reason: string;
};

export async function createSellerLead(input: CreateSellerLeadInput) {
  const { propertyId, city, beds, price, reason } = input;

  if (!propertyId) {
    throw new Error("createSellerLead: propertyId is required");
  }

  try {
    // ✅ Deduplication: prevent duplicate leads per property
    const existing = await prisma.sellerLead.findFirst({
      where: {
        propertyId,
      },
    });

    if (existing) {
      return existing;
    }

    // ✅ Create new lead
    const lead = await prisma.sellerLead.create({
      data: {
        propertyId,
        city,
        beds: beds ?? null,
        price: price ?? null,
        reason,
      },
    });

    return lead;
  } catch (error) {
    console.error("❌ createSellerLead error:", error);
    throw error;
  }
}