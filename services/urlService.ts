import { redisQueue } from '../db/services/redisService';
import { QueueName } from '../interfaces/config';
import { QUEUE_NAMES } from '../interfaces/constants';
  
export class UrlService {
  private queueManager = redisQueue;

  /**
   * Add a URL with depth to the urls_queue
   * @param url - The URL to add to the queue
   * @param depth - The depth level of the URL
   * @returns Promise<number> - The number of items in the queue after adding
   */
  async addUrlToQueue(url: string, depth: number): Promise<number> {
    try {
      // Add URL with depth to the urls_queue
      const urlData = {
        link: url,
        depth: depth
      };
      const queueLength = await this.queueManager.push(QUEUE_NAMES.URLS_QUEUE as QueueName, urlData);
      
      return queueLength;
    } catch (error) {
      console.error("❌ Failed to add URL to queue:", error);
      throw error;
    }
  }

  /**
   * Add multiple URLs with depth to the urls_queue
   * @param urls - Array of URLs to add to the queue
   * @param depth - The depth level for all URLs
   * @returns Promise<number[]> - Array of queue lengths after each addition
   */
  async addUrlsToQueue(urls: string[], depth: number): Promise<number[]> {
    const results: number[] = [];
    
    for (const url of urls) {
      const queueLength = await this.addUrlToQueue(url, depth);
      results.push(queueLength);
    }
    
    return results;
  }

  /**
   * Health check for the URL service and Redis connection
   * @returns Promise<boolean> - True if healthy, false otherwise
   */
  async healthCheck(): Promise<boolean> {
    try {
      return await this.queueManager.healthCheck();
    } catch (error) {
      console.error("❌ URL service health check failed:", error);
      return false;
    }
  }

}

// Export a singleton instance
export const urlService = new UrlService();
