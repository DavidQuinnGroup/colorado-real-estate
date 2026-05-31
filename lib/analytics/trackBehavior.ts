import { prisma } from "@/lib/prisma";

/**
 * REIE BEHAVIORAL TRACKER (Module 3.1)
 * Captures "Client DNA" by monitoring interaction with Forensic data.
 */
export async function trackForensicInteraction(clientId: string, propertyId: string, forensicType: string) {
  // Logic: If a user hovers/clicks on "Bentonite Risk" or "Altitude Advice" 3+ times,
  // we flag it in their Pre-Discovery Brief.

  return await prisma.leadInteraction.create({
    data: {
      clientId,
      propertyId,
      interactionType: "FORENSIC_VIEW",
      metadata: {
        target: forensicType,
        timestamp: new Date().toISOString()
      }
    }
  });
}

// ./lib/analytics/trackBehavior.ts