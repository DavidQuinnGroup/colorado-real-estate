import { Queue } from "bullmq"

export const connection = {
  host: "127.0.0.1",
  port: 6379,
}

export const mlsQueue = new Queue("mls-sync", {
  connection,
})

export const mlsPageQueue = new Queue("mls-page", {
  connection,
})