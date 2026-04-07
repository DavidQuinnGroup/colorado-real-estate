import { Queue } from "bullmq";
import { getRedisConnection } from "./redis";

const connection = getRedisConnection();

export const mlsPageQueue = new Queue("mls-page", {
  connection,
});