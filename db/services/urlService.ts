import { RedisQueue } from './redisService';
import { QueueName } from '../../interfaces/config';

export class UrlService {
  private queueManager: RedisQueue;

  constructor() {
    this.queueManager = new RedisQueue();
  }

  /**
   * Add a URL to the urls_queue
   * @param url - The URL to add to the queue
   * @returns Promise<number> - The number of items in the queue after adding
   */
  async addUrlToQueue(url: string): Promise<number> {
    
    // Add URL to the urls_queue
    const queueLength = await this.queueManager.push('urls_queue' as QueueName, url);
    
    return queueLength;
  }

  /**
   * Add multiple URLs to the urls_queue
   * @param urls - Array of URLs to add to the queue
   * @returns Promise<number[]> - Array of queue lengths after each addition
   */
  async addUrlsToQueue(urls: string[]): Promise<number[]> {
    const results: number[] = [];
    
    for (const url of urls) {
      const queueLength = await this.addUrlToQueue(url);
      results.push(queueLength);
    }
    
    return results;
  }

}

// Export a singleton instance
export const urlService = new UrlService();
