import Redis from "ioredis";
import { envDefaults } from "../envDefaults";

let publisherRedis: Redis;
let subscriberRedis: Redis;

const redisConfig = {
  host: envDefaults.REDIS_HOST,
  port: Number(envDefaults.REDIS_PORT),
  connectTimeout: 10000, // 10 seconds
  maxRetriesPerRequest: 3,
  enableOfflineQueue: true, // Enable offline queue to handle connection issues gracefully
  keepAlive: 30000, // Keep connection alive
  lazyConnect: true, // Don't connect immediately
};

export function getRedisPublisher() {
  if (!publisherRedis) {
    publisherRedis = new Redis(redisConfig);

    publisherRedis.on("error", (err) => {
      console.error("❌ Redis Publisher error:", err);
      // Don't exit process on Redis errors, just log them
    });
  }
  return publisherRedis;
}

export function getRedisSubscriber() {
  if (!subscriberRedis) {
    subscriberRedis = new Redis(redisConfig);

    subscriberRedis.on("error", (err) => {
      console.error("❌ Redis Subscriber error:", err);
      // Don't exit process on Redis errors, just log them
    });
  }
  return subscriberRedis;
}
