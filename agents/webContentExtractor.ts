import { RedisQueue } from "../db/services/redisService"; // your RedisQueue implementation

const redisQueue = new RedisQueue();

async function processUrl(url: string) {
  try {
    console.log("Processing URL:", url);
    // Here goes your scraping logic using Playwright or other libraries
    // e.g., await scrapeWebsite(url);
  } catch (err) {
    console.error("Error processing URL:", url, err);
    // Optionally, push back to Redis for retry
    await redisQueue.push("urls_queue", url);
  }
}

// Subscribe to the queue
redisQueue.subscribe("urls_queue", processUrl);
