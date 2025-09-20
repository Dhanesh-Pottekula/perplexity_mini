import { redisQueue } from "../db/services/redisService";
import { QueueName } from "../interfaces/config";

async function processUrl(url: string) {
  try {
    // Here goes your scraping logic using Playwright or other libraries
    // e.g., await scrapeWebsite(url);
    
    // For now, just simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (err) {
    console.error("❌ Error processing URL:", url, err);
    // Optionally, push back to Redis for retry
    await redisQueue.push("urls_queue" as QueueName, url);
  }
}

// Subscribe to the queue
redisQueue.subscribe("urls_queue" as QueueName, processUrl).catch(err => {
  console.error("❌ Failed to start queue subscription:", err);
});
