import Redis from "ioredis";
import { envDefaults } from "../envDefaults";

let redis: Redis;

export function getRedisClient() {
  if (!redis) {
    redis = new Redis({
      host: envDefaults.REDIS_HOST,
      port: Number(envDefaults.REDIS_PORT),
    });
  }
  return redis;
}