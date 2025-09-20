import { redisQueue } from "../db/services/redisService";
import { QueueName } from "../interfaces/config";
import { scrapeWebsite } from "../workers/scrapingWorker";
import { sleep } from "../helpers/timers";

async function processUrl(url: string) {
  try {


    const result = await scrapeWebsite(url);
    const { content, links, title } = result;
    console.log("✅ Successfully processed URL:", url, content);

    // const getCleanContent = getCleanContent(content);
  } catch (err) {
    console.error("❌ Error processing URL:", url, err);
  }
}

// Subscribe to the queue
redisQueue.subscribe("urls_queue" as QueueName, processUrl).catch(err => {
  console.error("❌ Failed to start queue subscription:", err);
});
