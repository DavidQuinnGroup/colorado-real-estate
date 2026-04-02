// /app/api/admin/queue/route.ts

import { NextRequest } from "next/server";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { mlsQueue } from "@/lib/queue/mlsQueue";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/api/admin/queue");

createBullBoard({
  queues: [new BullMQAdapter(mlsQueue)],
  serverAdapter,
});

export async function GET(req: NextRequest) {
  return new Response(
    serverAdapter.getRouter().handle(req as any, {} as any),
    { status: 200 }
  );
}