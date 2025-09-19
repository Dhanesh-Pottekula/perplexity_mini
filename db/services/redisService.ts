import { getRedisClient } from "../../configs/redis";
import { QueueName } from "../../interfaces/config";
import { QueueManager } from "../../interfaces/config";

class RedisQueue implements QueueManager {
  private redis = getRedisClient();

  // Get the Redis client instance
  getRedisClient() {
    return this.redis;
  }

  // Push an item to a queue (LPUSH)
  async push(queue: QueueName, value: string) {
    return await this.redis.lpush(queue, value);
  }

  // Pop an item from a queue (RPOP)
  async pop(queue: QueueName): Promise<string | null> {
    return await this.redis.rpop(queue);
  }

  // Subscribe to a queue (blocking) using BRPOP
  subscribe(queue: QueueName, callback: (value: string) => void) {
    const loop = async () => {
      while (true) {
        try {
          // BRPOP blocks until an item is available
          const result = await this.redis.brpop(queue, 0); // 0 = block indefinitely
          if (result) {
            const [, value] = result;
            callback(value);
          }
        } catch (err) {
          console.error("Redis queue error:", err);
          await new Promise((res) => setTimeout(res, 1000)); // retry after delay
        }
      }
    };
    loop();
  }

}

// Export a singleton instance
export const redisQueue = new RedisQueue();
