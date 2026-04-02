// /scripts/queueDashboard.ts

import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

import { mlsQueue } from "../lib/queue/mlsQueue.js";

const app = express();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(mlsQueue)],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

app.listen(3001, () => {
  console.log("🚀 Queue Dashboard running on http://localhost:3001/admin/queues");
});