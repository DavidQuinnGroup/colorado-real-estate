import { getRedisConnection } from "./redis";

const connection = getRedisConnection();

export { connection }