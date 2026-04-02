import { Queue } from "bullmq";
import { connection } from "./redis";

export const deadLetterQueue = new Queue("mls-dead-letter", {
  connection,
});