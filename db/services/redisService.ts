import Redis from "ioredis";
import { getRedisPublisher, getRedisSubscriber } from "../../configs/redis";
import { QueueName } from "../../interfaces/config";
import { QueueManager } from "../../interfaces/config";

class RedisQueue implements QueueManager {
  private publisherRedis = getRedisPublisher();
  private subscriberRedis = getRedisSubscriber();

  // Get the Redis publisher client instance
  getRedisPublisher() {
    return this.publisherRedis;
  }

  // Get the Redis subscriber client instance
  getRedisSubscriber() {
    return this.subscriberRedis;
  }

  // Health check for Redis connections
  async healthCheck(): Promise<boolean> {
    try {
      // Check if both Redis connections are ready
      if (this.publisherRedis.status !== 'ready') {
        return false;
      }
      
      if (this.subscriberRedis.status !== 'ready') {
        return false;
      }
      
      // Test both connections
      const publisherResult = await this.publisherRedis.ping();
      const subscriberResult = await this.subscriberRedis.ping();
      
      return publisherResult === 'PONG' && subscriberResult === 'PONG';
    } catch (error) {
      console.error("❌ Redis health check failed:", error);
      return false;
    }
  }

  // Initialize Redis connections
  async initialize(): Promise<void> {
    try {
      // Initialize publisher connection
      await this.initializeConnection(this.publisherRedis, "Publisher");
      
      // Initialize subscriber connection
      await this.initializeConnection(this.subscriberRedis, "Subscriber");
    } catch (error) {
      console.error("❌ Failed to initialize Redis connections:", error);
      throw error;
    }
  }

  // Helper method to initialize a single Redis connection
  private async initializeConnection(redis: Redis, connectionType: string): Promise<void> {
    try {
      // Check if Redis is already connected or connecting
      if (redis.status === 'ready') {
        return;
      }
      
      if (redis.status === 'connecting') {
        // Wait for connection to complete
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error(`Redis ${connectionType} connection timeout`));
          }, 10000);
          
          redis.once('ready', () => {
            clearTimeout(timeout);
            resolve(void 0);
          });
          
          redis.once('error', (err: Error) => {
            clearTimeout(timeout);
            reject(err);
          });
        });
        return;
      }
      
      // Only connect if not already connected or connecting
      await redis.connect();
    } catch (error) {
      console.error(`❌ Failed to initialize Redis ${connectionType} connection:`, error);
      throw error;
    }
  }

  // Push an item to a queue (LPUSH) - uses publisher connection
  async push(queue: QueueName, value: object): Promise<number> {
    try {
      // Ensure Redis publisher is connected before pushing
      if (this.publisherRedis.status !== 'ready') {
        await this.initializeConnection(this.publisherRedis, "Publisher");
      }
      
      // Serialize object to JSON string
      const serializedValue = JSON.stringify(value);
      
      const result = await this.publisherRedis.lpush(queue, serializedValue);
      return result;
    } catch (error) {
      console.error(`❌ Error pushing to queue ${queue}:`, error);
      throw new Error(`Failed to push to queue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Pop an item from a queue (RPOP) - uses publisher connection
  async pop(queue: QueueName): Promise<string | null> {
    try {
      // Ensure Redis publisher is connected before popping
      if (this.publisherRedis.status !== 'ready') {
        await this.initializeConnection(this.publisherRedis, "Publisher");
      }
      
      const result = await this.publisherRedis.rpop(queue);
      return result;
    } catch (error) {
      console.error(`❌ Error popping from queue ${queue}:`, error);
      throw new Error(`Failed to pop from queue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Subscribe to a queue (blocking) using BRPOP - uses subscriber connection
  async subscribe(queue: QueueName, callback: (value: object) => void) {
    // Ensure Redis subscriber is connected before starting subscription
    if (this.subscriberRedis.status !== 'ready') {
      setTimeout(() => {
        this.subscribe(queue, callback);
      }, 1000);
      return;
    }
    
    const loop = async () => {
      while (true) {
        try {
          // BRPOP blocks until an item is available - uses dedicated subscriber connection
          const result = await this.subscriberRedis.brpop(queue, 0); // 0 = block indefinitely
          if (result) {
            const [, value] = result;
            // Parse JSON string to object and pass to callback
            const parsedValue = JSON.parse(value);
            callback(parsedValue);
          }
        } catch (err) {
          console.error("Redis subscriber queue error:", err);
          // If connection is lost, try to reconnect
          await new Promise((res) => setTimeout(res, 1000)); // retry after delay
        }
      }
    };
    loop();
  }

}

// Export a singleton instance
export const redisQueue = new RedisQueue();
