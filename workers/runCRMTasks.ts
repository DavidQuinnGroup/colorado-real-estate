import { prisma } from "../lib/prisma";
import { sendSellerOutreach } from "../lib/outreach/sendSellerOutreach";

export async function runCRMTasks() {
  try {
    console.log("🔍 Prisma keys:", Object.keys(prisma));

    const now = new Date();

    console.log("🔄 Running CRM Task Worker...");

    // 🔥 TEMP SAFE ACCESS
    const crm = (prisma as any).crmTask || (prisma as any).cRMTask;

    if (!crm) {
      console.error("❌ CRMTask model NOT FOUND on Prisma client");
      return;
    }

    const tasks = await crm.findMany({
      where: {
        status: "pending",
        scheduledFor: {
          lte: now,
        },
      },
      take: 20,
    });

    console.log(`📬 Found ${tasks.length} tasks`);

  } catch (err) {
    console.error("runCRMTasks error:", err);
  }
}