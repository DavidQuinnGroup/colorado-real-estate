import { Queue } from "bullmq";
import { connection } from "./redis";

export const mlsPageQueue = new Queue("mls-page", {
  connection,
});