import { Queue } from "bullmq";
import { getRedisConnection } from "./redis";

const connection = getRedisConnection();

export const deadLetterQueue = new Queue("mls-dead-letter", {
  connection,
});